import React, { Component, useContext } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import { WEEKDAYS, FUNCTION_ID_CATEGORY, checkSMPByUnicode, getVisitPlaceNameForModal} from "~/helpers/constants";
import {
  surface,
  secondary200,
  midEmphasis,
  disable
} from "~/components/_nano/colors";
import * as apiClient from "~/api/apiClient";

import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import EndoscopeImageModal from "~/components/templates/Patient/Modals/Endoscope/EndoscopeImageModal";
import SelectDoctorModal from "~/components/templates/Patient/components/SelectDoctorModal";
import axios from "axios";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import {toHalfWidthOnlyNumber} from "~/helpers/dialConstants";
import {Bar} from "~/components/styles/harukaBackgroundCss";
import SelectPannelHarukaModal from "~/components/templates/Patient/Modals/Common/SelectPannelHarukaModal";
import ItemTableBody from "~/components/templates/Patient/Modals/Guidance/ItemTableBody";
import Checkbox from "~/components/molecules/Checkbox";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import RadiationData from "~/components/templates/Patient/components/RadiationData";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
const renderTooltip = (props) => <Tooltip {...props} className={'tooltip-area'}>{props}</Tooltip>;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  
  flex-direction column;
  display: flex;
  text-align: center;
  .patient-info {
    text-align: right;
    font-size: 1.2rem;
    font-weight: bold;
  }  
  .justify-content {
    align-items: flex-start;
    justify-content: space-between;
  }
  .content{
    height: 100%;
    width:45%;
  }
  .input-area {
    width:55%;
    padding-top:15px;
    padding-left:1rem;
    .shoot-condition-area{
      .row-title{
        text-align:left;
        padding-left:5px;
        padding-top: 5px;
      }
      .directions{
        text-align:left;
        padding-left:20px;
        .count-area{
          margin-top:5px;
          font-size:1rem;
          .label-title{
            width:2%!important;
          }
          div{
            margin-top:0px!important;
          }
          .label-unit{
            font-size:1rem;
            padding-top:0.4rem;
          }
          input{
            height:2rem;
            margin-top:3px;
            width:121px!important;
          }
        }
      }
    }
    .select-item-area{
      text-align:left;
      .clear-button{
        height:2rem!important;
        width:2rem!important;
        span{
          font-size:1rem!important;
        }
      }
    }
    .sub-title{
      text-align:left;            
    }
    .one-row{
      margin-top:0.5rem;
    }
    .title-label{
      width:6rem;
      min-width:3.5rem;
      text-align:left;
      margin-right:0.5rem;
    }
    .numeric-input{
      width:6rem;
    }
    .unit-label{
      width:auto;
      margin-left:0.5rem;
    }
    .blog{
      margin-top:1rem
    }
    .input-box {
      height: 2rem;
      line-height: 2rem;
      font-size:1rem;
      min-width:8rem;
      width:16rem;
      padding:0 0.3rem;
      border:1px solid #aaa;
      cursor:pointer;
    }
    .clear-button {    
      min-width: 30px !important;
      height: 30px !important;
      width: 30px !important;
      background-color: buttonface;
      border: 1px solid #7e7e7e;
      padding: 0 !important;
      margin-left:0.5rem;
      span{
        color:black;     
        font-size: 16px !important;   
      }
    }
    .top-area{
      overflow-y:auto;
      max-height:17rem;
    }
    .uses-area{
      max-height: 8rem;
      overflow-y: auto;
    }
    .comment-area{
      textarea{
        height:2rem;
      }
    }
    .set-detail-area {
      width: 100%;
      position:relative;
      table {
        margin-bottom: 0;
        margin-top: 0.3rem;
      }
      .table-menu {    
        background-color: #a0ebff;
        th{
          padding-top:0.1rem;
          padding-bottom:0.1rem;
          font-size:0.8rem;
        }
        .code-number{
          width:3.5rem;
        }
      }
      td {
        vertical-align: middle;
        font-size:0.8rem;
        padding:0.2rem;
        .label-title{
          width:0px;
        }
        input{
          height:1.5rem;
          font-size:0.9rem;
        }
      }
      .pullbox-label {
        width: 100%!important;
        margin: 0;
      }
      .value-area{
        div{
          line-height: normal!important;
          margin-top:0;
        }
        .unit-div{
          padding-top:4px;
        }
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
      .cqhJKX {
        width:100%;
        input {
          width: 100% !important;
        }
      }
      .search-item-btn {
        margin: 0;
        padding: 0;
        width: 100%;
        height: auto!important;
        font-size:0.8rem;
      }
      
      .birthday_area{
        span{
          line-height:38px;
          margin-right: 5px;
          margin-left: 5px;
        }
        .pullbox-select{
          width:75px;
        }
        .month_day{
          .pullbox-select{
              width:50px;
          }
          .label-title{
              display:none;
          }
          label {
            width: 50px;
          }
        }
        label {
          width: 80px;
        }
        .calendar_icon {
          left: 100px;
        }
        .react-datepicker-wrapper {
          width: 35px;
          padding-top:0.3rem;
          svg {
              left: 10px;
              top: 0px;
          }
          .react-datepicker__input-container{
            width: 35px;
          }
        }
      }
    }    
 `;

const Col = styled.div`
  background-color: ${surface};
  width: 100%;
  height: 100%;
  -ms-overflow-style: auto;
  textarea {
    width: 100%;
    resize: none;
  }
  .data-item{
    border-bottom: 1px solid ${disable};
    background: rgb(160, 235, 255);
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
    .data-item{
      padding:10px;
    }
    .note{
      text-align: left;
    }
    .date{
      text-align: left;
    }
  }
  .department{
    font-size: 1rem;
  }
  .note{
    font-weight: bold;
  }
  .date{
    font-weight:bold
  }
  .doctor-name{
    font-size: 1rem;
    padding-right: 0.5rem;
  }
  .history-region{
    border-bottom: 1px solid rgb(213,213,213);
    font-size: 1rem;
    padding-right: 0.5rem;
  }
  .order{
    display: block !important;
  }
  .data-list{
    overflow: hidden;
    height: calc(100% - 2rem);
  }

  .soap-history-title{
    font-size: 0.8rem;
  }

  .low-title,
  .middle-title{
    background: #ddf8ff;
  }
  .facility-border{
    border-top: 1px solid rgb(213, 213, 213);
  }
  .tb-soap{
    width: 100%;
  
    th{
      background: #f6fcfd; 
    }

    textarea{
      background: white;
      color: black;
      height: 25px;
    }
  }
.disable-button {
    background: rgb(101, 114, 117);
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
  .basic-area{
    .label-title{
      margin: 0;
      line-height: 2rem;
      width: 4.5rem;
      font-size:1rem;
      text-align: left;
    }
    .label-unit{
      margin: 0;
      margin-left: 0.3rem;
      line-height: 2rem;
      width: 1.5rem;
      font-size:1rem;
    }
    input{
      width:6rem;
      height: 2rem;
      font-size:1rem;
    }
    div {margin-top:0;}
  }
  .formula_area{
    .label-title{
      width:auto;
      margin-right:10px;
      line-height:31px;
    }
    .pullbox-label {
      margin-bottom:0;
      select{
        width:auto;
        padding-right:1.5rem;
        height:28px;
      }
    }
  }
`;

const MedicineListWrapper = styled.div`
  font-size: 0.8rem;
  height: calc(100% - 8rem);
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
    line-height: 1.3;
    position: relative;
    &:before {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 50px;
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
      left: 200px;
    }    

    .text-left{
      .table-item{
        width: 150px;
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

  .patient-name {
    margin-left: 1rem;
  }

  .drug-item {
    border-bottom: 1px solid ${disable};
    padding: 4px;
  }

  .number {
    margin-right: 8px;
    width: 75px;    
  }
  .number .rp{
    text-decoration-line: underline;
  }

  .unit{
    text-align: right;
  }

  .w80 {
    text-align: right;
    width: 80px;
    margin-left: 8px;
  }

  .option {
    border-bottom: 1px solid ${disable};
    padding: 4px;
  }

  .text-right {
    width: calc(100% - 88px);
  }

  .remarks-comment {
    margin-left: auto;
    width: calc(100% - 80px);
    word-wrap: break-word;
  }

  .order-copy {
    background-color: transparent;
    border: 1px solid #ced4da;
    padding: 0 4px;
    min-width: auto;
    span {
      color: ${midEmphasis};
      font-weight: normal;
      letter-spacing: 0;
    }
  }

  .hidden {
    display: none;
  }

  p {
    margin-bottom: 0;
  }

  .doing {
    background: #ccc !important;

    .table-row {
      &:nth-child(2n) {
        background-color: #ccc;
      }
    }
  }
`;

const ContextMenuUl = styled.ul`
  margin-bottom:0;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.5rem;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);    
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 84px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 1rem;
    font-weight: normal;
    line-height: 1.5rem;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 0.3rem 0.75rem;
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

const ContextMenu = ({ visible, x,  y,  parent, done_order}) => {
  const { $canDoAction, FEATURES, AUTHS } = useContext(Context);
  if (visible) {    
      return (
          <ContextMenuUl>
              <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                  {$canDoAction(FEATURES.RADIATION, AUTHS.EDIT_ORDER_STATE) && (
                    <>
                      {done_order == 1 && (
                        <>
                        <li><div onClick={() => parent.chagneStatus(0)}>未受付に戻す</div></li>
                        <li><div onClick={() => parent.chagneStatus(2)}>受付済みに戻す</div></li>
                        </>
                      )}
                      {done_order == 2 && (
                        <>
                        <li><div onClick={() => parent.chagneStatus(0)}>未受付に戻す</div></li>                        
                        </>
                      )}
                    </>
                  )}
              </ul>
          </ContextMenuUl>
      );
  } else {
      return null;
  }
};

class OrderDoneRaidationModal extends Component {
  constructor(props) {
    super(props);
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    let departements = {};
    if (departmentOptions != undefined && departmentOptions.length > 0) {
      departmentOptions.map(item=>{
        departements[item.id] = item;
      })
    }

    this.shoot_condition_default = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "shoot_condition_default");
    this.shoot_done_validate = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "shoot_done_validate");
    this.radiation_master = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "radiation_master");
    this.radiation_classific_master = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "radiation_classific_master");    
    this.radiation_part_master = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "radiation_part_master");
    this.radiation_direction_master = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "radiation_direction_master");
    this.radiation_left_right_master = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "radiation_left_right_master");
    this.surface_formulas = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "surface_formulas");
    this.formula_list = [{id:0, value:''}];
    if (this.surface_formulas != null && this.surface_formulas!=''){      
      Object.keys(this.surface_formulas).map((formula_name, index) => {
        this.formula_list.push({id:index + 1, value:formula_name, formula:this.surface_formulas[formula_name]})
      })
    }

    this.done_comment_length = 200;
    this.done_comment_overflow_message = '実施コメントは全角200文字以内で入力してください。';
    if (this.shoot_done_validate != undefined && this.shoot_done_validate != null){
      if (this.shoot_done_validate.done_comment != undefined){
        this.done_comment_length = this.shoot_done_validate.done_comment.length;
        this.done_comment_overflow_message = this.shoot_done_validate.done_comment.overflow_message;
      }
    }

    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));

    var order_data = this.props.modal_data.data != undefined?this.props.modal_data.data.order_data.order_data:this.props.modal_data.order_data.order_data;
    var radiation_name = order_data.radiation_name;
    if (radiation_name == '他医撮影診断'){
      this.can_radiation_done_flag = false;
    } else {
      this.can_radiation_done_flag = true;
    }

    this.temp_order_data = {};
    Object.keys(order_data).map(key=> {
      this.temp_order_data[key] = order_data[key];
    })
    this.temp_order_data = JSON.stringify(this.temp_order_data);    
    if (order_data.radiation_data != undefined && order_data.radiation_data.length > 0){
      order_data.radiation_data.map(item => {
        if (item.done_selected_directions == undefined || item.done_selected_directions == null || Object.keys(item.done_selected_directions).length == 0 ) {
          item.done_selected_directions = {};
          if (item.selected_directions != []){
            Object.keys(item.selected_directions).map(key => {
              item.done_selected_directions[key] = item.selected_directions[key];
            })
          }
        }
        if (!(item.done_shoot_count > 0)){
          item.done_shoot_count = item.shoot_count;
        }
      })
    }    
    var radiation_id = order_data.radiation_id;
    this.shoot_count_flag = false;
    this.conditions = null;
    this.height_weight_flag = false;
    if (this.radiation_master != undefined && this.radiation_master.length > 0){      
      this.shoot_count_flag = this.radiation_master.filter(x => parseInt(x.radiation_order_id) == parseInt(radiation_id))[0].shoot_count_flag;
      this.conditions = this.radiation_master.filter(x => parseInt(x.radiation_order_id) == parseInt(radiation_id))[0].conditions;
      this.height_weight_flag = this.radiation_master.filter(x => parseInt(x.radiation_order_id) == parseInt(radiation_id))[0].height_weight_flag;
    }

    if (order_data.done_order != 1){
      if (order_data.portable_shoot == true ){
        if (this.shoot_condition_default != undefined && this.shoot_condition_default != null){
          if (order_data.radiation_data != undefined && order_data.radiation_data.length > 0){
            order_data.radiation_data.map(item => {
              item.kV = item.kV > 0 ? item.kV : this.shoot_condition_default.kv;
              item.mA = item.mA >0 ? item.mA : this.shoot_condition_default.mA;
              item.sec = item.sec > 0 ? item.sec : this.shoot_condition_default.sec;
              item.FFD = item.FFD >0 ? item.FFD :this.shoot_condition_default.fed;
              item['管電圧'] = item['管電圧']>0?item['管電圧']: this.shoot_condition_default['管電圧'];
              item['トータル'] = item['トータル']> 0?item['トータル'] : this.shoot_condition_default['トータル'];
              item['曝射時間'] = item['曝射時間']>0?item['曝射時間'] : this.shoot_condition_default['曝射時間'];
            })
          }
        }
      } else {
        if (this.radiation_part_master != undefined && this.radiation_part_master != null && this.radiation_part_master.length > 0 && order_data.radiation_data != undefined){
          order_data.radiation_data.map(item => {
            var part_id = item.part_id;
            var part_item = this.radiation_part_master.filter(x=>x.radiation_part_id == part_id);
            if (part_item.length == 1 && part_item[0].shooting_conditions_default_json != undefined && part_item[0].shooting_conditions_default_json != null){
              var default_json = JSON.parse(part_item[0].shooting_conditions_default_json);          
              item.kV = item.kV > 0 ? item.kV : default_json.kv;
              item.mA = item.mA > 0 ? item.mA > 0 : default_json.mA;
              item.sec = item.sec > 0 ? item.sec : default_json.sec;
              item.FFD = item.FFD > 0 ? item.FFD : default_json.fed;
              item['管電圧'] = item['管電圧'] > 0 ? item['管電圧']: default_json['管電圧'];
              item['トータル'] = item['トータル'] > 0? item['トータル']: default_json['トータル'];
              item['曝射時間'] = item['曝射時間'] > 0? item['曝射時間']: default_json['曝射時間'];
            }
          })
        }
      }
    }
    
    this.init_item_details = [
      {classfic: 9, classfic_name:'造影剤', item_id: 0, item_name: "", attribute1:"0", format1:"", unit_name1:"", max_length1:"", value1:"", attribute2:"0", format2:"", unit_name2:"", max_length2:"", value2:"",
      item_category_id:9, name:'', input_item1_attribute:"0", input_item1_format:"", input_item1_unit:"", input_item1_max_length:"", input_item2_attribute:'0', input_item2_format:'', input_item2_unit:'', input_item2_max_length:''},
    ];

    this.can_done = false;

    this.state = {
      departmentOptions: departements,
      modal_type: this.props.modal_type,
      modal_title: this.props.modal_title,
      modal_data: this.props.modal_data,
      isOpenInspectionImageModal: false,  
      isDeleteConfirmModal:false,
      isDirectionsUpdateModal:false,
      isShowStaffList:false,
      isClearConfirmModal:false,
      confirm_message: "",
      order_data,
      done_comment:order_data.done_comment,      
      shoot_done_user:order_data.shoot_done_user!=undefined && order_data.shoot_done_user!=null && order_data.shoot_done_user!= ''?order_data.shoot_done_user:authInfo.name,
      shoot_done_user_number:order_data.shoot_done_user_number>0?order_data.shoot_done_user_number:authInfo.user_number,
      alert_messages:'',
      isItemSelectModal:false,
      item_details:order_data.details == undefined || order_data.details == null || order_data.details.length == 0 ? this.init_item_details:order_data.details,
      obtain_tech:order_data.obtain_tech,
      obtain_tech_id:order_data.obtain_tech_id,

      done_height:order_data.done_height > 0 ? order_data.done_height: order_data.height,
      done_weight:order_data.done_weight > 0 ? order_data.done_weight: order_data.weight,
      done_surface_area:order_data.done_surface_area > 0 ? order_data.done_surface_area: order_data.surface_area,
      done_formula_id:order_data.done_formula_id > 0? order_data.done_formula_id:order_data.formula_id,

      isConfirmBackStatusModal:false,
      confirm_back_message:'',
      waring_message:'',
    };
    let reception_disable, done_disable = false;
    if (this.props.modal_data !== undefined && this.props.modal_data.done_order !== undefined && (this.props.modal_data.done_order === 1 || this.props.modal_data.done_order === 2) && this.props.reception_or_done === "reception"){
      reception_disable = true;
    }
    if (this.props.modal_data !== undefined && this.props.modal_data.done_order !== undefined && this.props.modal_data.done_order === 1 && this.props.reception_or_done === "done"){
      done_disable = true;
    }
    this.reception_disable = reception_disable;
    this.done_disable = done_disable;
    this.updated_directions_check = false;
  }

  async componentDidMount() {
    this.can_done = this.context.$canDoAction(this.context.FEATURES.RADIATION, this.context.AUTHS.DONE_OREDER);
    await this.getDoneStaffList();
    var formula = '';
    if (this.state.done_formula_id > 0){
      var formula_item = this.formula_list.filter(x => x.id == this.state.done_formula_id);
      if (formula_item.length > 0){
        formula = formula_item[0].value;
      }
    }
    this.setState({formula});
  }

  chagneStatus = (changed_status) => {
    var confirm_back_message = '';
    var waring_message = '';
    if (changed_status == 0){
      confirm_back_message = 'このオーダーを未受付に戻しますか？';
      if (this.state.order_data.done_order == 1){
        waring_message = '※ 実施の追加情報も消去されます。';
      }
    }
    if (changed_status == 2){
      confirm_back_message = 'このオーダーを受付済み(未実施)に戻しますか？';
      waring_message = '※ 実施の追加情報も消去されます'
    }
    if (confirm_back_message != ''){
      this.setState({
        isConfirmBackStatusModal:true,
        confirm_back_message,
        waring_message,
        changed_status,
      })
    }
  }

  confirmBackStatus = async() => {
    var number = this.state.order_data.number;
    var order_data = this.state.order_data;    
    let path = "/app/api/v2/order/changeBackStatusRadiation";

    var current_done_flag = false;
    if (order_data.done_order == 1 && order_data.radiation_name != '他医撮影診断'){
      current_done_flag = true;
      order_data.done_comment = undefined;
      order_data.shoot_done_user = undefined;
      order_data.shoot_done_user_number = undefined;
      order_data.radiation_data.map(item => {
        item.kV = undefined;
        item.mA = undefined;
        item.sec = undefined;
        item.FFD = undefined;
        item['管電圧'] = undefined;
        item['トータル'] = undefined;
        item['曝射時間'] = undefined;
        item.done_selected_directions = [];
      })      
      order_data.obtain_tech = undefined;
      order_data.obtain_tech_id = undefined;

      order_data.done_height = undefined;
      order_data.done_weight = undefined;
      order_data.done_surface_area = undefined;
      order_data.done_shoot_count = undefined;
      order_data.done_formula_id = undefined;
    }

    order_data.done_order = this.state.changed_status;    
    let post_data = {
      type : this.props.modal_type,
      number,
      reception_or_done : this.props.reception_or_done,
      order_data : order_data,
      current_done_flag
    };
    await apiClient._post(path, {params: post_data})
        .then(() => {
          var alert_message = '';
          if (this.state.changed_status == 0){
            alert_message = '未受付に変更しました。'
          }
          if (this.state.changed_status == 2){
            alert_message = '受付済みに戻しました。'
          }
          if (alert_message != ''){
            window.sessionStorage.setItem("alert_messages", alert_message);
          }
          if (this.props.from_source != 'done_list') {
            order_data.done_order = this.state.changed_status;
            this.props.changeDoneState(this.props.modal_data.number, 'radiation', order_data);
          }
        })
        .catch(() => {
        });
    this.props.closeModal("change");
    if (this.props.handleNotDoneOk != undefined && this.props.handleNotDoneOk != null) this.props.handleNotDoneOk();
  }



  doneData = async() => {
    let number = this.state.order_data.number;
    if(this.props.modal_type === 'examination'){
        number = this.props.modal_data.record_number;
    }
    let path = "/app/api/v2/order/orderComplete";

    var order_data = this.state.order_data;
    order_data.done_height = this.state.done_height;
    order_data.done_weight = this.state.done_weight;
    order_data.done_surface_area = this.state.done_surface_area;
    order_data.done_formula_id = this.state.done_formula_id;
    order_data.done_order = 1;
    let post_data = {
      type : this.props.modal_type,
      number,
      reception_or_done : this.props.reception_or_done,
      order_data : order_data,
    };
    await apiClient._post(path, {params: post_data})
        .then((res) => {
          if(res){
            window.sessionStorage.setItem("alert_messages", res.alert_message);            
            if (this.props.from_source != 'done_list') {
              this.props.changeDoneState(this.props.modal_data.number, 'radiation', order_data);              
            }
          }
        })
        .catch(() => {
        });
    this.props.closeModal("change");
    if (this.props.handleNotDoneOk != undefined && this.props.handleNotDoneOk != null) this.props.handleNotDoneOk();
  };

  getWeekDay = dateStr => {
    let weekday = new Date(dateStr).getDay();
    return WEEKDAYS[weekday];
  }

  getDoctorName = (nDoctorConsented = -1, strDoctorName = "") => {

    if (nDoctorConsented == 4) {

      return `（過去データ取り込み）${strDoctorName}`;

    }
    if (nDoctorConsented == 2) {

      return strDoctorName;

    }else{

      if (nDoctorConsented == 1) {

        return `[承認済み] 依頼医: ${strDoctorName}`;

      }else{
        return  <div><span className='not-consented'>[未承認]</span> 依頼医: {strDoctorName}</div>;
      }
    }
  }

  confirmCancel() {
    this.setState({
      confirm_message: "",
      isDeleteConfirmModal:false,
      isClearConfirmModal:false,
      isDirectionsUpdateModal:false,

      confirm_back_message:'',
      isConfirmBackStatusModal:false,
      waring_message:'',
    });
  }

  confirmOk = () => {
    this.doneData();
    this.setState({
      confirm_message: "",
    });
  };

  openConfirm = () => {
    // let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    // if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
    //     this.context.$selectDoctor(true);
    //     return;
    // }
    if (this.done_disable || this.reception_disable) return;
    var details_check_flag = false;
    var item_details = this.state.item_details;    
    if (item_details != undefined && item_details != null && item_details.length > 0){      
      item_details.map((item, index) => {        
        if(item.item_id != 0){              
          if (item.tele_type != 2 && (item.value1 == undefined || item.value1 == '') && (item.value2 == undefined || item.value2 == null || item.value2 == '')){
            details_check_flag = true;
            this.setState({
              alert_messages:'品名の数量を入力してください。'
            })
          } else {
            if (checkSMPByUnicode(item.value1) || checkSMPByUnicode(item.value2)){
              details_check_flag = true;
              this.setState({alert_messages:'品名に印刷や医事連携できない可能性のある文字を含んでいます。機種依存文字は他の文字に置き換えてください'})
            }
          }
        } else {
          item_details.splice(index, 1);
        }
      })
    }
    if (details_check_flag) return;
    if (this.state.order_data.done_comment != undefined && this.state.order_data.done_comment != null && this.state.order_data.done_comment != '' && this.state.order_data.done_comment.length > 25){
      this.setState({alert_messages:'実施コメントは25文字以内で入力してください。'})
      return;
    }
    if (checkSMPByUnicode(this.state.order_data.done_comment)){
      this.setState({alert_messages:'実施コメントに印刷や医事連携できない可能性のある文字を含んでいます。機種依存文字は他の文字に置き換えてください。'})
      return;
    }

    this.setState({
      confirm_message: this.props.reception_or_done == "done" ? "実施しますか？":"受け付けますか？",
      item_details,
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

  getDoneStaffList = async () => {
    var path = "/app/api/v2/secure/doneStaff/search";
    var params = {auth_kind:'radiation'};
    let data = await apiClient.post(path,{params});
    this.setState({ doctors: data });
  };

  getOrderTitleClassName = (param_obj) => {
    if (param_obj.target_table == "order") {
      if (param_obj.is_doctor_consented != 4 && (param_obj.done_order == 0 || param_obj.done_order == 3)) {
        return param_obj.karte_status != 3? "_color_not_implemented" : "_color_not_implemented_hospital";        
      }
      if (param_obj.done_order == 1) {
        return param_obj.karte_status != 3? "_color_implemented" : "_color_implemented_hospital";        
      }
      if (param_obj.done_order == 2) {
        return param_obj.karte_status != 3? "_color_received" : "_color_received_hospital";
      }
    } else if(param_obj.target_table == "inspection_order") {
      if (param_obj.is_doctor_consented !== 4 && param_obj.state == 0) {
        return param_obj.karte_status != 3? "_color_not_implemented" : "_color_not_implemented_hospital";        
      }
      if ( param_obj.state == 2) {
        return param_obj.karte_status != 3? "_color_implemented" : "_color_implemented_hospital";
      }
      if (param_obj.state == 1) {
        return param_obj.karte_status != 3? "_color_received" : "_color_received_hospital";        
      }
    } else if(param_obj.target_table == "treat_order_header") {
      if (param_obj.is_doctor_consented !== 4 && param_obj.state == 0) {
        return param_obj.karte_status != 3? "_color_not_implemented" : "_color_not_implemented_hospital";
      }
      if (param_obj.done_order == 1) {
        return param_obj.karte_status != 3? "_color_implemented" : "_color_implemented_hospital";        
      }
      // if (param_obj.state == 2) {
      //   return "_color_received";
      // }
    }
    return "";
  }

  openInspectionImageModal = async (number, type=null) => {
    let path = "/app/api/v2/order/inspection/getImage";

    if (type == "radiation") {
      path = "/app/api/v2/order/radiation/getImage";
    }

    const { data } = await axios.post(path, {
      params: {
        number: number
      }
    });
    this.setState({
      endoscope_image: data,
      isOpenInspectionImageModal: true,
    });
  }

  closeModal = () => {
    this.setState({
      isOpenInspectionImageModal: false,
      isItemSelectModal:false,      
    });
  }

  openSelectItem = () => {
    this.setState({isItemSelectModal:true});
  };

  getHistoryInfo = (nHistoryLength = -1, strStuffName = "", strDateTime = "", nDoctorConsented = -1) => {
    let strHistory = "";
    nHistoryLength++;
    if (nHistoryLength < 10) {
      nHistoryLength = `0${nHistoryLength}`;
    }

    if (nDoctorConsented == 4) {
      return ""; 
    }
    if (strDateTime == undefined || strDateTime == null) return '';
    if (nDoctorConsented == 2) {      
      strHistory = `${nHistoryLength}版 : ${strDateTime.substr(0, 4)}/${strDateTime.substr(5, 2)}/${strDateTime.substr(8, 2)} ${strDateTime.substr(11, 8)}`;
      return strHistory;
    } else{
      if (nDoctorConsented == 1) {
        strHistory = `${nHistoryLength}版 入力者 : ${strStuffName}`;
        return strHistory;
      } else{
        strHistory = `${nHistoryLength}版 : ${strDateTime.substr(0, 4)}/${strDateTime.substr(5, 2)}/${strDateTime.substr(8, 2)} ${strDateTime.substr(11, 8)} 入力者 : ${strStuffName}`;
        if (nHistoryLength == 1) {
          strHistory = `${nHistoryLength}版 入力者 : ${strStuffName}`;  
        }
        return strHistory;
      }
    }    
  }

  clearUser = () => {
    if (this.props.modal_data.done_order == 1) return;
    if (this.state.order_data.shoot_done_user == "") return;
    this.setState({
      isDeleteConfirmModal:true,      
      confirm_message:'実施（予定）者を削除しますか？'
    });
  };
  confirmDelete = () => {
    this.confirmCancel();
    this.change_flag = 1;
    this.setState({
      treat_user_id:0,
      shoot_done_user:'',
    });
  }

  selectDoctor = () => {
    this.setState({isShowStaffList: true});
  };

  selectStaff = (staff) => {
    this.change_flag = 1;
    var order_data = this.state.order_data;
    order_data.shoot_done_user = staff.name;
    order_data.shoot_done_user_number = staff.number;
    this.setState({
      shoot_done_user_number:staff.number,
      shoot_done_user:staff.name,
      order_data
    });
    this.closeDoctorSelectModal();
  };

  closeDoctorSelectModal = () => {
    this.setState({
      isShowStaffList:false
    });
  };

  getInputText = (name, e) => {
    if (e.target.value.length > this.done_comment_length){
      this.setState({alert_messages:this.done_comment_overflow_message})
      return;
    }
    var order_data = this.state.order_data;
    order_data[name] = e.target.value;
    this.setState({
      order_data
    })
  }

  getInputNumber = (name, unit, index, e) => {
    let input_value = e.target.value.replace(/[^0-9/\\.。０-９]/g, "");
    if (input_value != '') input_value = toHalfWidthOnlyNumber(input_value);
    var order_data = this.state.order_data;
    order_data.radiation_data[index][name] = input_value;
    order_data.radiation_data[index][name + '_unit'] = unit;
    this.setState({order_data})
  }

  getInputBasicNumber = (name, e) => {
    let input_value = e.target.value.replace(/[^0-9/\\.。０-９]/g, "");
    if (input_value != '') input_value = toHalfWidthOnlyNumber(input_value);
    this.setState({[name]:input_value}, () => {
      if (name =='done_height' || name == 'done_weight'){
        this.calculateSurface(this.state.formula);
      }
    })
  }

  closeAlertModal = () => {
    this.setState({alert_messages:""})
  }

  getDoneStatus = (order_data) => {    
    if (order_data.is_doctor_consented != 4 && order_data.done_order == 0) return '未受付';
    if (order_data.is_doctor_consented != 4 && order_data.done_order == 2) return '受付済み';
    return '';
  }

  setItemDetails =(data)=>{    
    this.setState({item_details:data});
    var order_data = this.state.order_data;
    order_data.details = data;
    this.setState({order_data})
  }

  confirmClearObtain=()=>{
    if(this.state.obtain_tech == ""){
      return;
    }
    this.setState({
      isClearConfirmModal:true,
      confirm_message:"造影剤注入手技を削除しますか？"
    });
  }

  setItemName = (item) => {    
    this.setState({obtain_tech:item.name, obtain_tech_id:item.item_id});
    var order_data = this.state.order_data;
    order_data.obtain_tech = item.name;
    order_data.obtain_tech_id = item.item_id;
    this.setState({
      order_data
    })
    this.closeModal();
  };

  clearObtain = () => {    
    this.setState({
      obtain_tech:'',
      obtain_tech_id:0,
      confirm_message:"",
      isClearConfirmModal:false,
    });
    var order_data = this.state.order_data;
    order_data.obtain_tech = '';
    order_data.obtain_tech_id = 0;
    this.setState({
      order_data
    })
  };

  selectCount = (index, e) => {
    if (e== null) e='';
    let regx = /^[.]*[0-9０-９][.0-9０-９]*$/;
    if (e != "" && !regx.test(e)) return;    
    var done_shoot_count = isNaN(parseInt(e)) ? '' : parseInt(e);    
    var order_data = this.state.order_data;
    order_data.radiation_data[index].done_shoot_count = done_shoot_count;
  };

  cancelUpdateDirection = () => {
    this.confirmCancel();
    this.updated_directions_check = false;
  }

  confirmUpdate = (index, direction_id, value) => {
    this.confirmCancel();    
    var order_data = this.state.order_data;
    var radiation_data = order_data.radiation_data;
    var checked_direction = this.radiation_direction_master.filter(x => x.radiation_direction_id == direction_id)[0];

    if (value == true){      
      var direction_name = checked_direction.radiation_direction_name;      
      radiation_data[index].done_selected_directions[direction_id] = direction_name; 
    } else {
      delete radiation_data[index].done_selected_directions[direction_id];      
    }
    var done_shoot_count = 0;
    Object.keys(radiation_data[index].done_selected_directions).map(id => {
      var temp_direction = this.radiation_direction_master.filter(x => x.radiation_direction_id == id)[0];
      done_shoot_count += temp_direction.count;
    })

    var part_item  = radiation_data[index].part_item;    
    if (part_item != undefined && part_item != null && part_item.count > 0){
      done_shoot_count = done_shoot_count > 0 ? done_shoot_count * part_item.count : part_item.count;
    }

    var left_right_id = order_data.radiation_data[index].left_right_id;
    if (left_right_id > 0 && this.radiation_left_right_master != undefined){
      var left_right_item = this.radiation_left_right_master.filter(x => parseInt(x.radiation_left_right_id) == parseInt(left_right_id));        
      if (left_right_item.length > 0){
        done_shoot_count = done_shoot_count > 0 ? done_shoot_count * left_right_item[0].magnification : left_right_item[0].magnification;
      }

    }
    
    radiation_data[index].done_shoot_count = done_shoot_count;
    this.setState({order_data});
  }

  getRadio = (index, direction_id, name, value) => {
    if (name =='direction'){
      var modified_shoot_count;
      var radiation_data = this.state.order_data.radiation_data;      
      var checked_direction = this.radiation_direction_master.filter(x => x.radiation_direction_id == direction_id)[0];
      var part_item  = radiation_data[index].part_item;
      var left_right_id = radiation_data[index].left_right_id;

      modified_shoot_count = 0;
      Object.keys(radiation_data[index].done_selected_directions).map(id => {
        var temp_direction = this.radiation_direction_master.filter(x => x.radiation_direction_id == id)[0];
        modified_shoot_count += temp_direction.count;
      });
      if (part_item != undefined && part_item != null && part_item.count > 0){
        modified_shoot_count = modified_shoot_count > 0 ? modified_shoot_count * part_item.count : part_item.count;
      }
      if (left_right_id > 0 && this.radiation_left_right_master != undefined){
        var left_right_item = this.radiation_left_right_master.filter(x => parseInt(x.radiation_left_right_id) == parseInt(left_right_id));        
        if (left_right_item.length > 0){
          modified_shoot_count = modified_shoot_count > 0 ? modified_shoot_count* left_right_item[0].magnification: left_right_item[0].magnification;
        }
      }

      if (modified_shoot_count != radiation_data[index].done_shoot_count){
        this.setState({
          isDirectionsUpdateModal:true,
          confirm_message:'撮影回数は再計算されますが、方向を編集しますか？',
          selected_direction_id:direction_id,
          selected_index:index,
          selected_value:value,
        })
        return;
      }
      this.confirmCancel();    
      var order_data = this.state.order_data;      
      
      if (value == true){
        var direction_name = checked_direction.radiation_direction_name;        
        radiation_data[index].done_selected_directions[direction_id] = direction_name; 
      } else {
        delete radiation_data[index].done_selected_directions[direction_id]
      }

      
      modified_shoot_count = 0;
      Object.keys(radiation_data[index].done_selected_directions).map(id => {
        var temp_direction = this.radiation_direction_master.filter(x => x.radiation_direction_id == id)[0];
        modified_shoot_count += temp_direction.count;
      })
      
      if (part_item != undefined && part_item != null && part_item.count > 0){
        modified_shoot_count = modified_shoot_count > 0 ? modified_shoot_count * part_item.count : part_item.count;
      }
      
      if (left_right_id > 0 && this.radiation_left_right_master != undefined){
        left_right_item = this.radiation_left_right_master.filter(x => parseInt(x.radiation_left_right_id) == parseInt(left_right_id));        
        if (left_right_item.length > 0){
          modified_shoot_count = modified_shoot_count > 0 ? modified_shoot_count* left_right_item[0].magnification: left_right_item[0].magnification;
        }
      }
      
      
      radiation_data[index].done_shoot_count = modified_shoot_count;
      this.setState({order_data});
    }
  }

  closeThisModal = () => {
    if (this.props.modal_data.data != undefined){
      this.props.modal_data.data.order_data.order_data = JSON.parse(this.temp_order_data);
    } else {
      this.props.modal_data.order_data.order_data = JSON.parse(this.temp_order_data)
    }    
    this.props.closeModal();    
  }

  getFormula = e => {        
    this.setState({formula:e.target.value, done_formula_id:e.target.id}, () => {
      this.calculateSurface(this.state.formula);
    })
  }

  calculateSurface(formula_name){    
    if (formula_name == undefined || formula_name ==null || formula_name == '') {      
      this.setState({done_surface_area:''});
      return false;
    }    
    var done_height = parseFloat(this.state.done_height);
    var done_weight = parseFloat(this.state.done_weight);
    if (!(done_height >= 0 && done_weight >=0)){
      this.setState({done_surface_area:''});
      return false;
    }

    var formula = this.surface_formulas[formula_name];
    formula = formula.replace('height', done_height);
    formula = formula.replace('weight', done_weight);
    var done_surface_area = eval(formula);
    done_surface_area = parseFloat(done_surface_area).toFixed(4);    
    this.setState({done_surface_area});
  }

  handleClick = (e) => {
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
      // document
      //     .getElementById("code-table")
      //     .addEventListener("scroll", function onScrollOutside() {
      //       that.setState({
      //         contextMenu: { visible: false }
      //       });
      //       document
      //         .getElementById("code-table")
      //         .removeEventListener(`scroll`, onScrollOutside);
      //     });
      var obj_modal = document.getElementById('done-order-modal');      
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - obj_modal.offsetLeft,
          y: e.clientY + window.pageYOffset - obj_modal.offsetTop - 60,
        },
      });
    }
  }

  render() {    
    const { modal_data, modal_title, modal_type} = this.props;    
    var {order_data} = this.state;
    var done_status = this.getDoneStatus(order_data);
    //-----------flex area-----------------------------------------
    var patient_number = this.props.from_source == 'done_list' ? modal_data.patient_number:this.props.patientInfo.receId;
    var patient_name = this.props.from_source == 'done_list' ? modal_data.patient_name:this.props.patientInfo.name;
    var history = this.props.from_source == 'done_list' ? modal_data.history:modal_data.data.history;
    let karte_status_name = "外来・";
    if (order_data != undefined && order_data.karte_status != undefined) {
      karte_status_name = order_data.karte_status == 1 ? "外来・" : order_data.karte_status == 2 ? "訪問診療・" : order_data.karte_status == 3 ? "入院・" : "";
    }
    //------------------------------------------------------------- 
    var temp_item_details = this.state.item_details;    
    if (temp_item_details.length == 0) {      
      temp_item_details = [
        {classfic: 9, classfic_name:'造影剤', item_id: 0, item_name: "", attribute1:"0", format1:"", unit_name1:"", max_length1:"", value1:"", attribute2:"0", format2:"", unit_name2:"", max_length2:"", value2:"",
        item_category_id:9, name:'', input_item1_attribute:"0", input_item1_format:"", input_item1_unit:"", input_item1_max_length:"", input_item2_attribute:'0', input_item2_format:'', input_item2_unit:'', input_item2_max_length:''},
      ];
    }
    
    return  (
        <Modal show={true} id="done-order-modal"  className="custom-modal-sm first-view-modal haruka-done-modal haruka-done-radiation-modal">
          <Modal.Header>
            <Modal.Title>{modal_title}{this.props.reception_or_done == "done"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>
              <Col id="soap_list_wrapper">
                <Bar>
                <div className='flex' style={{height:'100%'}}>
                  <div className="content" style={{width:this.can_radiation_done_flag?'45%':'100%'}}>
                    {(modal_type == "radiation") && (
                        <>
                            <div className={'patient-info'}>
                                {patient_number} : {patient_name}
                            </div>
                            <div className="data-list" onContextMenu={e => this.handleClick(e)}>
                            <div className={`data-title 
                              ${this.props.from_source == 'done_list'?
                                this.getOrderTitleClassName({target_table:modal_data.target_table,is_doctor_consented:modal_data.is_doctor_consented, done_order:modal_data.done_order, state:order_data.state, is_enabled:modal_data.is_enabled,karte_status:modal_data.karte_status})
                                :modal_data.karte_status !=3?'_color_not_implemented':'_color_not_implemented_hospital'}`}>
                                    <div className={'data-item'}>
                                      <div className="flex justify-content">
                                        <div className="note">
                                          【{karte_status_name}放射線&nbsp;&nbsp;{order_data.radiation_name}】{done_status}
                                           
                                        </div>
                                        <div className="department text-right">{this.state.departmentOptions[order_data.department_id].value}</div>
                                      </div>
                                        <div className="date">
                                            {(modal_data.treatment_datetime !== undefined && modal_data.treatment_datetime != null && modal_data.treatment_datetime !== "") && (
                                                <>
                                                    {modal_data.treatment_datetime.substr(0, 4)}/
                                                    {modal_data.treatment_datetime.substr(5, 2)}/
                                                    {modal_data.treatment_datetime.substr(8, 2)}
                                                    ({this.getWeekDay(modal_data.treatment_datetime.substr(0,10))})
                                                    {' '}{modal_data.treatment_datetime.substr(11, 8)}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {history !== "" && history != undefined &&
                                      history !== null ? (
                                      <div className="history-region text-right middle-title">
                                        {this.getHistoryInfo(history.split(",").length-1, modal_data.input_staff_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                                      </div>
                                    ):(
                                      <>
                                      {modal_data.is_doctor_consented !=2 && (
                                        <div className="history-region text-right middle-title">
                                        {this.getHistoryInfo(0, modal_data.input_staff_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                                      </div>
                                    )}
                                      </>
                                    )}
                                    <div className="doctor-name text-right low-title">
                                        {this.getDoctorName(modal_data.is_doctor_consented, order_data.doctor_name)}
                                    </div>
                                    {order_data != undefined && order_data.visit_place_id != undefined && order_data.visit_place_id > 0 && (
                                      <div className="doctor-name text-right low-title facility-border">
                                        {getVisitPlaceNameForModal(order_data.visit_place_id)}
                                      </div>
                                    )}
                                </div>
                                <MedicineListWrapper>
                                  <RadiationData
                                    data = {order_data}
                                    patientId = {this.props.patientId}                                    
                                  />
                                </MedicineListWrapper>
                            </div>
                        </>
                    )}
                  </div>
                  
                  {this.can_radiation_done_flag && (
                    <>
                    <div className='input-area'>
                      <div className='top-area'>
                        <div className='sub-title'>撮影条件</div>
                        <div className='blog shoot-condition-area' style={{marginTop:'0.3rem'}}>
                            {order_data.radiation_data != undefined && order_data.radiation_data.length>0 && (
                              order_data.radiation_data.map((item, index) => {
                                var part_name = item.left_right_name != undefined && item.left_right_name !=''?item.left_right_name + item.part_name:item.part_name;
                                var directions = [];
                                if (this.radiation_direction_master != undefined && this.radiation_direction_master.length > 0){
                                  directions = this.radiation_direction_master.filter(x => parseInt(x.radiation_part_id) == parseInt(item.part_id));
                                }
                                var count_is_force_disabled = 0;
                                if (this.radiation_classific_master != undefined && this.radiation_classific_master.length > 0){
                                  var classfic_id = item.classfic_id;
                                  var classfic_data = this.radiation_classific_master.filter(x => x.radiation_shooting_classific_id == classfic_id);
                                  if (classfic_data.length > 0) count_is_force_disabled = classfic_data[0].count_is_force_disabled;                                  
                                }

                                return(
                                  <>
                                  <div className='flex'>
                                    <div className='conditions'>
                                      <div className='row-title'>{'(' + (index + 1) + '/' + order_data.radiation_data.length +  ')' + item.classfic_name + ' ' +part_name}</div>
                                      {this.conditions != undefined && this.conditions != null && this.conditions != '' && 
                                        Object.keys(this.conditions).map(key => {
                                          var item = this.conditions[key];
                                          return(
                                            <>
                                            <div className='flex one-row'>
                                              <label className='title-label'>{item.label}</label>
                                              <input className="numeric-input" disabled={order_data.done_order == 1?true:false} value={this.state.order_data.radiation_data[index][item.label]} 
                                                onChange={this.getInputNumber.bind(this, item.label, item.unit, index)}/>
                                              <label className='unit-label'>{item.unit}</label>
                                            </div>
                                            </>
                                          )
                                        })
                                      }                                      
                                    </div>

                                    <div className='directions'>
                                      {directions.length > 0 && (
                                        <>
                                        <div className='row-title'>方向</div>
                                        {directions.map(sub_item => {
                                          return(
                                            <>
                                            <Checkbox
                                              label={sub_item.radiation_direction_name}                                          
                                              getRadio={this.getRadio.bind(this, index, sub_item.radiation_direction_id)}
                                              value = {item.done_selected_directions != undefined && item.done_selected_directions != [] && item.done_selected_directions[sub_item.radiation_direction_id] != undefined? true:false}
                                              name="direction"
                                              isDisabled = {order_data.done_order == 1?true:false}
                                            />
                                            </>
                                          )
                                        })}
                                        </>
                                      )}
                                      
                                      {this.shoot_count_flag == true && count_is_force_disabled != 1 && (
                                        <>
                                        <div className='sub-title' style={{marginTop:'5px'}}>撮影回数</div>
                                        <div className="count-area">
                                          <NumericInputWithUnitLabel
                                            unit={'回'}
                                            maxLength={ 4 }
                                            max={9999}
                                            min = {0}
                                            className="form-control"
                                            value={item.done_shoot_count}
                                            getInputText={this.selectCount.bind(this, index)}
                                            inputmode="numeric"
                                            disabled = {order_data.done_order == 1?true:false}
                                          />
                                        </div>
                                        </>
                                      )}                                  
                                    </div>
                                  </div>
                                  </>
                                )
                              })
                            )}
                        </div>                      
                      </div>
                      {this.height_weight_flag && (
                        <>
                          <div className='basic-area'>
                            <div className={'flex'}>
                              <InputWithLabelBorder
                                label="身長"
                                type="text"
                                getInputText={this.getInputBasicNumber.bind(this, 'done_height')}
                                isDisabled = {order_data.done_order == 1?true:false}
                                diseaseEditData={this.state.done_height}
                              />
                              <label className='label-unit'>cm</label>
                            </div>
                            <div className={'flex'} style={{marginTop:"0.5rem"}}>
                              <InputWithLabelBorder
                                label="体重"
                                type="text"
                                getInputText={this.getInputBasicNumber.bind(this, 'done_weight')}
                                isDisabled = {order_data.done_order == 1?true:false}
                                diseaseEditData={this.state.done_weight}
                              />
                              <label className='label-unit'>kg</label>
                            </div>
                            <div className={'flex'} style={{marginTop:"0.5rem"}}>
                              <InputWithLabelBorder
                                label="体表面積"
                                type="text"
                                getInputText={this.getInputBasicNumber.bind(this, 'done_surface_area')}
                                isDisabled = {order_data.done_order == 1?true:false}
                                diseaseEditData={this.state.done_surface_area}
                              />
                              <label className='label-unit'>㎡</label>
                              <div className ="formula_area">
                                <SelectorWithLabel
                                  options={this.formula_list}
                                  title={'（計算式'}
                                  getSelect={this.getFormula.bind(this)}
                                  departmentEditCode={this.state.done_formula_id}
                                  isDisabled = {order_data.done_order == 1?true:false}
                                />
                              </div>
                              <div style={{lineHeight:"2rem", marginLeft:"0.3rem"}}>）</div>
                            </div>
                          </div>
                        </>
                      )}
                      <div className='blog uses-area'>
                          {(order_data.use_id == 0 || order_data.use_id == 1) && order_data.done_order != 1 && (
                            <>
                            <div className="select-item-area flex">
                              <label style={{marginRight:'0.5rem', marginTop:'0.2rem'}}>造影剤注入手技</label>
                              <div className={'input-box'} onClick = {this.openSelectItem.bind(this)}>{this.state.obtain_tech}</div>
                              <Button className='clear-button' onClick={this.confirmClearObtain.bind(this)}>C</Button>
                            </div>
                            <div className={'set-detail-area'}>
                              <ItemTableBody
                                function_id={FUNCTION_ID_CATEGORY.RADIATION}
                                // item_details={this.state.item_details}
                                item_details = {temp_item_details}
                                setItemDetails={this.setItemDetails.bind(this)}
                              />
                            </div>
                            </>
                          )}
                      </div>
                      <div className='blog comment-area'>
                        <div className='sub-title'>実施コメント</div>
                        <textarea disabled={order_data.done_order == 1?true:false} value={this.state.order_data.done_comment} onChange={this.getInputText.bind(this, 'done_comment')}></textarea>
                      </div>
                      <div className='blog'>
                        <div className='sub-title'>撮影実施者</div>
                        <div className='flex one-row'>                        
                          <input style={{width:'100%'}} readOnly onClick={this.selectDoctor.bind(this)} className='' type="text" placeholder={'クリックで選択'}
                          value = {this.state.order_data.shoot_done_user} disabled={modal_data.done_order == 1?true:false}/>
                          <Button className='clear-button' onClick={this.clearUser.bind(this)}>C</Button> 
                        </div>
                      </div>
                    </div>                
                    </>
                  )}
                </div>
                </Bar>
              </Col>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeThisModal} className="cancel-btn">キャンセル</Button>
            {this.props.only_close_btn != true && (
              <>
                {(modal_data.done_order !== undefined && modal_data.done_order != null && modal_data.done_order === 1) ? (
                    <></>
                ):(
                  <>
                  {this.props.reception_or_done == "done"?(
                    <>
                    {!this.can_done ? (
                      <>
                      <OverlayTrigger placement={"top"} overlay={renderTooltip("権限がありません。")}>
                        <Button className={"disable-btn"}>{"実施"}</Button>
                      </OverlayTrigger>
                      </>
                    ) : (
                      <>
                      <Button onClick={this.openConfirm.bind(this)} className={(this.reception_disable || this.done_disable) ? "disable-btn" : "red-btn"}>{"実施"}</Button>
                      </>
                    )}                    
                    </>
                  ):(
                    <>
                    <Button onClick={this.openConfirm.bind(this)} className={(this.reception_disable || this.done_disable) ? "disable-btn" : "red-btn"}>{"受付済み"}</Button>
                    </>
                  )}
                  </>
                )}
              </>
            )}
          </Modal.Footer>
          {this.state.isOpenInspectionImageModal == true && (
            <EndoscopeImageModal
              closeModal={this.closeModal}
              imgBase64={this.state.endoscope_image}
            />
          )}
          {this.state.confirm_message !== "" && (
              <SystemConfirmJapanModal
                  hideConfirm= {this.confirmCancel.bind(this)}
                  confirmCancel= {this.confirmCancel.bind(this)}
                  confirmOk= {this.confirmOk.bind(this)}
                  confirmTitle= {this.state.confirm_message}
              />
          )}

          {this.state.isDeleteConfirmModal && (
            <ConfirmNoFocusModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.confirmDelete.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}          
          {this.state.isDirectionsUpdateModal == true && (
            <SystemConfirmJapanModal
              hideConfirm= {this.cancelUpdateDirection.bind(this)}
              confirmCancel= {this.cancelUpdateDirection.bind(this)}
              confirmOk= {this.confirmUpdate.bind(this, this.state.selected_index, this.state.selected_direction_id, this.state.selected_value)}
              confirmTitle= {this.state.confirm_message}
              title = {'注意'}
            />
          )}

          {this.state.isClearConfirmModal && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.clearObtain.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}

          {this.state.isConfirmBackStatusModal && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.confirmBackStatus.bind(this)}
              confirmTitle= {this.state.confirm_back_message}
              waring_message = {this.state.waring_message}
            />
          )}

          {this.state.isShowStaffList && (
            <DialSelectMasterModal
              selectMaster = {this.selectStaff}
              closeModal = {this.closeDoctorSelectModal}
              MasterCodeData = {this.state.doctors}
              MasterName = '撮影実施者'
            />
          )}

          {this.state.doctors != undefined && this.context.needSelectDoctor === true ? (
              <SelectDoctorModal
                  closeDoctor={this.closeDoctor}
                  getDoctor={this.getDoctor}
                  selectDoctorFromModal={this.selectDoctorFromModal}
                  doctors={this.state.doctors}
              />
          ) : (
              ""
          )}
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeAlertModal}
              handleOk= {this.closeAlertModal}
              showMedicineContent= {this.state.alert_messages}
            />
          )}

          {this.state.isItemSelectModal && (
            <SelectPannelHarukaModal
              selectMaster = {this.setItemName}
              closeModal= {this.closeModal}
              MasterName= {'品名'}
              function_id= {FUNCTION_ID_CATEGORY.RADIATION}
              item_category_id={99}
              type = {'obtain_tech'}
            />
          )}
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
            done_order={this.state.order_data.done_order}
          />
        </Modal>
    );
  }
}

OrderDoneRaidationModal.contextType = Context;

OrderDoneRaidationModal.propTypes = {
  closeModal: PropTypes.func,
  modal_type: PropTypes.string,
  modal_title: PropTypes.string,
  modal_data: PropTypes.object,
  only_close_btn: PropTypes.bool,
  reception_or_done: PropTypes.string,
  patientInfo: PropTypes.object,
  patientId: PropTypes.number,
  from_source: PropTypes.string,
  changeDoneState:PropTypes.func,
  history: PropTypes.object,
  handleNotDoneOk: PropTypes.func
};

export default OrderDoneRaidationModal;
