import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Button from "~/components/atoms/Button";
import Checkbox from "~/components/molecules/Checkbox";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import SelectMedicineModal from "../Common/SelectMedicineModal"
import AddCommentModal from "../Common/AddCommentModal"
import Radiobox from "~/components/molecules/Radiobox";
import RegionBottom from "../Common/RegionBottom";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import * as apiClient from "~/api/apiClient";
import {CACHE_LOCALNAMES, KARTEMODE} from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";
import Context from "~/helpers/configureStore";
import {formatDateLine, formatDateSlash} from "~/helpers/date";
import $ from "jquery";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import SelectorWithLabelIndex from "~/components/molecules/SelectorWithLabelIndex";
import { BODY_PART_DATA, FUNCTION_ID_CATEGORY } from "~/helpers/constants";
import BodyParts from "~/components/molecules/BodyParts";
import SelectPannelHarukaModal from "~/components/templates/Patient/Modals/Common/SelectPannelHarukaModal";
import KnowledgeSetModal from "./KnowledgeSetModal";
import EndoscopeReservationModal from "~/components/templates/Patient/Modals/Common/EndoscopeReservationModal";
import { harukaValidate } from "~/helpers/haruka_validate";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import RadiationEditModal from "~/components/templates/Patient/Modals/Common/RadiationEditModal"
import axios from "axios";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import {removeRedBorder, setDateColorClassName} from '~/helpers/dialConstants';
import {DatePickerBox} from "~/components/styles/DatePickerBox";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Spinner from "react-bootstrap/Spinner";
const renderTooltip = (props) => <Tooltip {...props} className={'tooltip-area'}>{props}</Tooltip>;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Header = styled.div`
  button{
    padding-top:0.5rem;
    padding-bottom:0.5rem;
  }
  .red-btn {
    background: #cc0000;
    span {
      color: #ffffff;
    }
  }
  .red-btn:hover {
    background: #e81123;
    span {
      color: #ffffff;
    }
  }
`
const Wrapper = styled.div`
  height:100%;
  width:100%;
  font-size:1rem;
  .title-style1{
    legend{
      width: 52px;
      padding-left: 10px;
    }
  }
  .w100{
      width:100%;
  }
  .title-style2{
    legend{
      width: 21rem;
      padding-left: 10px;
    }
  }
  .flex{
    display:flex;
    clear:both;
  }
  .items-select-area{
    justify-content: start;
    border-left: 1px solid #aaa;
    .block-area{
      padding-top:0px;
      padding-bottom:1px;
      margin-right:20px;
    }
  }
  .list{
    width:17%;
    border: 1px solid #aaa;
    border-left: none;
  }
  .list-items{
    height: 6rem;
    overflow-y:scroll;
    overflow-x:hidden;
    label{
      width:100%;
      margin-right:0;
    }
    font-size:0.9rem;
  }
  .react-numeric-input{
    width:122px!important;
    input{
        width:120px!important;
    }
  }
  .sub-title{
    text-align: center;
    font-size: 1.1rem;
    font-weight: bold;
    background-color: #a0ebff;
    border-bottom: 1px solid #aaa;
  }
  .nowrap{
    white-space:nowrap;
  }

  .selected{
    background: lightblue;
  }
  .row-item {
    cursor:pointer;
  }
  .disabled{
    opacity: 0.5;
  }
  .disabled:hover{
    border:none;
  }
  .kinds_content_list{    
    padding: 3px;
    height: 35vh;
    float:left;
    width: calc(26vw);
    border: 1px solid #aaa;
    overflow-y:scroll;
  }
  .clear-button{
    margin-left: 0.25rem;
    min-width: 2rem;    
    width: 2rem;    
    height: 2rem;
    padding: 0rem;
    padding-top: 0.15rem;
    text-align:center;
    span {
      font-size:1rem;
    }
  }

  .date-area {
    padding-top: 3px;
    width: 178px;
    height:34px;
    border:1px solid #aaa;
    margin-top: 0.5rem;
  }
  .head-title {
    text-align: center;
    background-color: #a0ebff;
    font-size: 1.1rem;
    border: 1px solid #aaa;
    border-bottom: none;
  }

  .button-area{
    margin-top: 0.1rem;
    margin-bottom: 0.1rem;
    margin-left: 20%;
    button{
      margin-right:10px;      
      span{
        font-size:1rem;
      }
      height:2rem;
      padding:1px;
    }
    .button-add{
      margin-right:20px;
      width:160px;
    //   background: antiquewhite;
    }
  }
  .label-unit{
    font-size: 20px;
    margin-top: 0.5rem;
  }
  .date-input-other{
      width:6rem!important;
      padding-top:0px;
      padding-bottom:4px;
  }
  .table-area{
    margin-bottom:10px;
    table{
        width: 100%;
        border-spacing: 0;
        border:1px solid #aaa;
        thead, tbody { display: block; }

        tbody {
            height: 6rem;       /* Just for the demo          */
            overflow-y: scroll;    /* Trigger vertical scroll    */
            overflow-x: hidden;  /* Hide the horizontal scroll */
            border-top: 1px solid #dee2e6;
        }

        tr{
            width: 100%;
            display: table;
            table-layout: fixed;
        }

        thead {
            width: calc(100% - 17.5px);
        }

        thead th {
            border-bottom:none;
            border-top:none;
            text-align:center;
            font-size:0.9rem;
            padding-top:0.4rem!important;
            padding-bottom:0.4rem!important;
            background-color: #a0ebff;
        }

        th,td {
            padding-left: 0.1rem;
            padding-right: 0.1rem;
            border:1px solid #aaa;
        }
        td{
          font-size:0.9rem;
          padding-top:0.2rem;
          padding-bottom:0.2rem;
          vertical-align:middle;
          word-break:break-all;
          font-size:1rem;
          .pullbox{
            width:100%;
          }
          .pullbox-label{
            width:100%;
          }
          .pullbox-select{
            font-size:1rem;
            width:100%;
          }
        }

        thead th:last-child {
            border-right: none;
        }

        .item-no {
            width:3%;
        }
        .classfic_name {
            width:15%;
        }
        .part_name {
            width:10%;
        }
        .left_right_name {
            width:7%;
        }
        .selected_directions {
            width:15%;
        }
        .method_name {
            width:12%;
        }
        .selected_comments {
            width:15%;
        }
        .sema {
            width:10%;
        }
        .shoot_count {
            width:5%;
        }
        .sub_picture {
            width:5%;
        }
        .direction_count {
            // width:5%;
        }
    }
  }

  .left{
    width:35%;
    div{
      height:auto;
      margin-bottom:5px;
    }
  }
  .block-area {
    border: 1px solid #aaa;
    margin-top: 1rem;
    padding: 0.5rem 0.5rem 0.5rem 0.5rem;
    position: relative;
    .check-label{
      float:left;
      label {
          font-size: 1rem;            
      }
      width: 45%;
    }
    .use-label{
      label{
        font-size:1rem;
      }
    }
    .label-unit{
      font-size: 20px;
      margin-top: 0.2rem;
      width: 50px;
    }
    .div-tall-weight {
      margin:0;
      input{
        height:2rem!important;
      }
    }
    input[type='radio']{
        height:1rem;
        background:none;
    }
  }
  .mmg-block{
    label{
      width:100%;
    }
  }
  .select-item-area{
    margin-left:2px;
    display:flex;
    label{
      width:100px;
      margin: 0;
      line-height: 2rem;
      text-align: right;
      margin-right: 0.5rem;
    }
    .input-box {
      height: 2rem;
      line-height: 2rem;
      font-size:1rem;
      min-width:30rem;
      padding:0 0.3rem;
      border:1px solid #aaa;
      cursor:pointer;
    }
    button {
      min-width: 2rem;    
      width: 2rem;    
      height: 2rem;
      padding: 0rem;
      padding-top: 0.15rem;  
      margin-left: 0.25rem;
      text-align: center;
      // line-height:2rem;
      span {
        font-size:1rem;
        letter-spacing:0;
        display:inline;
      }
    }
  }
  .block-title {
    position: absolute;
    top: -1rem;
    left: 10px;
    font-size: 1.2rem;
    background-color: white;
    padding-left: 5px;
    padding-right: 5px;
  }
  .right{
    width:65%;    
  }
  
  .blog{
    margin-bottom:15px;
    // width:75%;
    width: calc(26vw);
    label{
      margin-right: 10px;
    }
    button{
      margin-right:10px;
    }
    
  }
  .shoot-instruction{
    label{
      width:auto;
    }
  }
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
  .div-tall-weight{
    margin-top: 1.2rem;
    margin-bottom: 10px;
    div {margin-top:0;}
    .label-title {
      width: 4.5rem;
      margin:0;
      line-height:2rem;
      font-size: 1rem;
    }
    .label-unit{
      font-size: 1rem;
      margin-top: 0;
      margin-bottom: 0;
      line-height: 2rem;
      width: 1.5rem;
      margin-left: 0.3rem;
    }
    .form-control {
        ime-mode: inactive;
    }
    .notice{
      width: 100%;
      display: flex;
    }
    .react-numeric-input{
      width:6.5rem !important;
      input {
        width:6.5rem !important;
        height:2rem;
        font-size:1rem !important;
      }
    }
  }
  .formula_area{
    .pullbox-select, .pullbox-label{
      width: 10rem;
      margin-bottom: 0;
      height: 2rem;
    }
    margin-top:0rem;
    margin-bottom:0rem;
    display: flex;
    justify-content: space-between;
  }

  .radio-area{ 
    border: 1px solid #aaa;
    legend{
      width: 16rem;
      font-size: 1.2rem;
      margin-left: 20px;
      padding-left: 10px;
    }
    .div-textarea{
      margin: 0px;
      textarea {
        width: 95%;
        height:2.5rem;
        margin-left:2%;
      }
      padding-bottom: 0.4rem;
    }
  }

  .sub-left{
    width:55%;
    margin-right:5%;
  }
  .sub-right{
    width:40%;
  }

  input[type='text'], textarea{    
    width:95%;
  }
  .number_type{
    width: 150px;
    margin-left: 10px;
  }
  .td-selectbox{
    .pullbox{
      width:200px;
    }
    .label-title{
      width:0px;
    }
    .pullbox-label, .pullbox-select{
      width:200px;
      margin-bottom:0px;
    }
  }
  .portable-checkbox {
    label {
      font-size : 1rem!important;
    }
  }

  .set-detail-area {
    width: 100%;
    max-height: calc(100% - 250px);
    overflow-y: auto;
    table {
        margin-bottom: 0;
        margin-top: 0.3rem;
    }
    .table-menu {    
      background-color: #a0ebff;
      th{
        padding-top:0.1rem;
        padding-bottom:0.1rem;
      }
    }
    .td-no {
    //   background-color: #e2caff;
    }
    td {
      vertical-align: middle;
      font-size:0.9rem;
      padding-top:0.2rem;
      padding-bottom:0.2rem;
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
    .hvMNwk, .dZZuAe {
      margin:0;
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
      height: normal!important;
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
`;

const Footer = styled.div`
  display: flex;
  align-items: center;  
  span{
    color: white;
    font-size: 16px;
  }
  button{
    float: right;
    padding: 5px;
    font-size: 16px;
    margin-right: 16px;  
  }
  .emergency{
    margin-right: 1rem;;
    // background-color: #881717;
  }
  .select-eme {
    background-color: #881717;
  }
  
  .date-input{
    padding-top: 7px;
    border: solid 1px #999;
    width: 100px;
    margin: 0 10px;
    cursor: pointer;
  }
  .date{
    margin-right: 10px;
    height: 2rem;
    padding-top:0.3rem;
    // line-height: 2rem;
  }
  .react-datepicker-wrapper {
    padding-top: 0px;
    input{
      width: 7rem;;
      font-size:1rem;
      height: 2rem;
      // line-height: 2rem;
      padding-top:0.15rem;
    }
  }
  .label-title{
    text-align: right;
    font-size: 1.1rem;
    margin: 0;
    margin-right: 10px;
  }
  .date-area {    
    min-width: 9rem;
    font-size:1rem;
    border:1px solid #aaa;
    height:2rem;
    line-height:2rem;
    padding: 0 0.3rem;
  }
  .bottom-alert{
    font-size:1rem;
    position: absolute;
    bottom: 5rem;
    right: 10rem;
  }
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
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
  margin: 0;
  padding: 0 20px;
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

const ContextMenu = ({visible,x,y,parent,index}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() =>parent.contextMenuAction("edit", index)}>変更</div></li>
          <li><div onClick={() => parent.contextMenuAction("delete",index)}>削除</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

class RadiationModal extends Component {
  constructor(props) {
    super(props);
    /* eslint-disable no-console */
    console.log("Radiation Constructor", new Date().getTime());
    this.exist_portable_shoots = false;
    this.japan_year_list = [];
    var i =0;
    var japan_year_name ='';
    var current_year = new Date().getFullYear();
    this.default_use_flag = false;
    this.count_is_force_disabled = 0;
    for (i=1900;i <= current_year; i++){
        if (i <= 1912) {
            japan_year_name = "明治" + (i-1867).toString();
        } else if (i>1912 && i<1927){
            japan_year_name = "大正" + (i-1911).toString();
        } else if (i >=1927 && i<1990){
            japan_year_name = "昭和" + (i-1925).toString();
        } else if (i >= 1990 && i<=2019){
            japan_year_name = "平成" + (i-1988).toString();
        } else {
            japan_year_name = "令和" + (i-2018).toString();
        }
        this.japan_year_list.push({id:i, value:japan_year_name});
    }
    this.japan_year_list.reverse();
    var pregnancy_items = [
      {label:'無', value:0},
      {label:'有', value:1},
    ];
    var kind_items = [
      {label:'通常', value:0},
      {label:'至急(入院のみ)', value:1},
      {label:'朝一(入院のみ)', value:2},
      {label:'午後(入院のみ)', value:3},
      {label:'時間指定(入院のみ)', value:4},
      {label:'時間外', value:5},
    ];

    var move_items = [
      {label:'単独歩行可能', value:0},
      {label:'歩行可(入院のみ)', value:1},
      {label:'車椅子', value:2},
      {label:'ベッド', value:3},
    ];

    var film_output_items = [
      {label:'無', value:'0'},
      {label:'有', value:'1'},
    ];

    var inquiry_items = [
      {label:'本日記入済', value:0},
      {label:'以前のものを代用', value:1},
    ];
    var filmsend_items = [
      {label:'通常', value:0},
      {label:'患者持ち帰り', value:1},
      {label:'搬送せずDrCall', value:2},
    ];

    var key_items = [
      {label:'無', value:0},
      {label:'有', value:1},
    ];

    var dummy_items = [
      {label:'無', value:0},
      {label:'有', value:1},
    ];

    this.init_item_details = [
      {classfic: 9, classfic_name:'造影剤', item_id: 0, item_name: "", attribute1:"0", format1:"", unit_name1:"", max_length1:"", value1:"", attribute2:"0", format2:"", unit_name2:"", max_length2:"", value2:"",
      item_category_id:9, name:'', input_item1_attribute:"0", input_item1_format:"", input_item1_unit:"", input_item1_max_length:"", input_item2_attribute:'0', input_item2_format:'', input_item2_unit:'', input_item2_max_length:''},
    ];
    this.patient_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PATIENT_INFORMATION);    
    this.state = {
      patientId: this.props.patientId,
      gensa_date:new Date(),
      isShowMedicineModal:false,
      isShowCommentModal:false,
      isDeleteConfirmModal: false,
      isUpdateConfirmModal:false,
      alert_messages:'',
      edit_flag:false,
      imgBase64: "",
      image_path:"",
      pregnancy_items,
      pregnancy_id:0,
      pregnancy:'無',
      kind_items,
      kind_id:0,
      kind:'通常',
      move_items,
      move_id:0,
      move:'単独歩行可能',
      film_output_items,
      film_output_id:0,
      film_output:'無',
      inquiry_items,
      // inquiry_id:0,
      // inquiry:'本日記入済',
      inquiry_id:2,
      inquiry:'',      
      use_id:2,
      use:'使用しない',      
      filmsend_items,
      filmsend_id:0,
      filmsend:'通常',
      key_items,
      key_id:0,
      key:'',
      dummy_items,
      dummy:'',
      not_yet:false,
      placeholder:'',
      shoot_count_flag:false,
      sub_picture_flag:false,
      direction_count_flag:false,
      enable_contrast_medium_interview_sheet:false,
      shoot_count:'',
      sub_picture:'',
      direction_count:'',
      instructions_check:{0:false},
      instructions:[{number:0,name:'技師判断で追加撮影可'}],
      shootings_check:{0:false,1:false},
      shootings:[{number:0,name:'ボータプル'}, {number:1, name:'手術ボータプル'}],
      // item_details:[],
      item_details:this.init_item_details,      
      formula_id:0,
      formula:'',
      receipt_keys:[],
      item_id_groups:[],
      selected_kind_id:0,
      selected_kind_detail_id:0,
      other_kind:'',
      other_kind_detail:'',
      isItemSelectModal:false,
      obtain_tech:'',
      obtain_tech_id:0,
      number:0,
      isForUpdate:0,
      done_order:0,
      created_at:'',
      openKnowledgeSetModal:false,
      isOpenReserveCalendar:false,
      is_reserved:0,
      reserve_time:'',
      reserve_data:null,

      alert_message:'',
      isClearConfirmModal:false,
      portable_shoot:false,
      karte_status: 0,

      // height : this.patient_data != undefined && this.patient_data != null? parseFloat(this.patient_data.height) : '',
      // weight : this.patient_data != undefined && this.patient_data != null? parseFloat(this.patient_data.weight) : '',

      part_shoot_count:1,
    };
    this.change_flag = 0;
    this.manual_height_weight_change = false;

    this.can_done = false;
    this.can_register = false;
  }

  async componentDidMount(){
    let cache_data = null;
    let imgBase64 = "";
    let image_path = "";
    let radiation_id = this.props.radiation_id;
    var type = "";
    
    // switch(radiation_id){
    //   case 1:
    //     type = "X線";
    //     break;
    //   case 2:
    //     type = "透視造影TV";
    //     break;
    //   case 3:
    //     type = "CT";
    //     break;
    //   case 4:
    //     type = "MRI";
    //     break;
    //   case 5:
    //     type = "MRI（藤井寺市民）";
    //     break;
    //   case 6:
    //     type = "MMG";
    //     break;
    //   case 7:
    //     type = "眼底検査";
    //     break;
    //   case 8:
    //     type = "他医撮影診断";
    //     break;
    // }
    let system_patient_id = this.props.patientId;
    var shoot_count_flag = false;
    var sub_picture_flag = false;
    var direction_count_flag = false;
    var enable_contrast_medium_interview_sheet = false;
    var height_weight_flag = false;

    let number = this.state.number;
    let isForUpdate = this.state.isForUpdate;
    let done_order = this.state.done_order;
    let created_at = this.state.created_at;
    let item_details = this.state.item_details;
    let karte_status = this.context.karte_status.code == 0 ? 1 : this.context.karte_status.code == 1 ? 3 : 2;

    this.use_items = [
      {label:'造影剤を使用する', value:0},
      {label:'依頼医の責任において造影実施', value:1},
      {label:'使用しない', value:2},
    ];

    if (this.props.cache_index != null) {
      cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.RADIATION_EDIT, this.props.cache_index);
      if (this.props.cache_data != undefined && this.props.cache_data != null) cache_data = JSON.parse(JSON.stringify(this.props.cache_data));
      number = cache_data['number'];
      isForUpdate = number > 0 ? 1 : 0;
      done_order = cache_data['done_order'];
      created_at = cache_data['created_at'];
      type = cache_data['radiation_name'];
      radiation_id = cache_data['radiation_id'];
      item_details =this.convertItemDetails(cache_data.details);
      if(item_details == undefined || item_details == null || item_details.length == 0) item_details = this.init_item_details;      
      imgBase64 = cache_data['imgBase64'];
      karte_status = cache_data['karte_status'];
      if (cache_data['image_path'] != null && cache_data['image_path'] != undefined && cache_data['image_path'] != "") {
        image_path = cache_data['image_path'];
      }
      let cache_data_tmp = cache_data;
      if (cache_data_tmp['imgBase64'] == null || cache_data_tmp['imgBase64'] == undefined || cache_data_tmp['imgBase64'] == "") {
        if (cache_data_tmp['image_path'] != null && cache_data_tmp['image_path'] != undefined && cache_data_tmp['image_path'] != "") {
          const { data } = await axios.post("/app/api/v2/order/radiation/getImage", {
            params: {
              number: cache_data_tmp['number']
            }
          });
          imgBase64 = data;
        }
      }
    }
    this.can_done = this.context.$canDoAction(this.context.FEATURES.RADIATION, this.context.AUTHS.DONE_OREDER);
    this.can_register = isForUpdate ? true : (this.context.$canDoAction(this.context.FEATURES.RADIATION, this.context.AUTHS.REGISTER) | this.context.$canDoAction(this.context.FEATURES.RADIATION, this.context.AUTHS.REGISTER_PROXY));
    if (radiation_id != 8) this.getRecentRadiationOrderData(radiation_id);
    if (radiation_id == 2){
      this.use_items = [
        {label:'造影剤を使用する', value:0},
      ];
    }
    let path = "/app/api/v2/master/radiation";
    let post_data = {
      radiation_order_id:radiation_id,
      system_patient_id:system_patient_id,
    };
    await apiClient._post(path, {params: post_data}).then((res) => {
      if (res.name){
        type = res.name;
      }
      let is_reserved = res.is_reserved;
      //撮影回数表示フラグ, 分画数表示フラグ, 方向数表示フラグ--------
      if (res.shoot_count_flag){
        shoot_count_flag = res.shoot_count_flag;
      }
      if (res.sub_picture_flag){
        sub_picture_flag = res.sub_picture_flag;
      }
      if (res.direction_count_flag){
        direction_count_flag = res.direction_count_flag;
      }
      if (res.height_weight_flag){
        height_weight_flag = res.height_weight_flag;
      }
      //---------------------------------------------------------------
      if (res.enable_contrast_medium_interview_sheet){
        enable_contrast_medium_interview_sheet = res.enable_contrast_medium_interview_sheet;
      }

      var formula_list = [{id:0, value:''}];
      if (res.formula != undefined && res.formula != null){
        var formula_data = res.formula;
        Object.keys(res.formula).map((formula_name, index)=> {
          formula_list.push({id:index+1, value:formula_name, formula:res.formula[formula_name]})
        })
      }
      //------- 6 categories of top------------------------------------
      var radiation_classific_data = [];
      var selected_classific_id = 0;
      var selected_classific_name = '';
      if (res.classific_data != undefined){
        radiation_classific_data = res.classific_data;
      }

      var radiation_part_data = [];
      var selected_part_id = 0;
      var selected_part_name = '';

      if (res.part_data != undefined){
        radiation_part_data = res.part_data;
      }

      var radiation_direction_data = [];
      var selected_direction_id = 0;
      var selected_direction_name = '';
      var directions_check = {};

      if (res.direction_data != undefined){
        radiation_direction_data = res.direction_data;
      }

      var radiation_method_data = [];
      var selected_method_id = 0;
      var selected_method_name = '';

      if (res.method_data != undefined){
        radiation_method_data = res.method_data;
      }

      var radiation_comment_data = [];
      var selected_comment_id = 0;
      var selected_comment_name = '';
      var comments_check = [];

      if (res.comment_data != undefined){
        radiation_comment_data = res.comment_data;
      }

      var left_right_flag_data = [];
      var origin_radiation_left_right_data = [];
      var radiation_left_right_data = [];
      var selected_left_right_id = 0;
      var selected_left_right_name = '';

      if (res.left_right_flag != undefined){
        left_right_flag_data = res.left_right_flag;
      }

      if (res.left_right_data != undefined){
        origin_radiation_left_right_data = res.left_right_data;
      }

      // if(res.left_right_flag != undefined && res.left_right_data != undefined && left_right_flag_data[selected_part_id]!= undefined){
      //   if(left_right_flag_data[selected_part_id] == 1){
      //     radiation_left_right_data = res.left_right_data;
      //   }
      // }

      //-------------------------------------------------------------------------------------

      //他医撮影診断分
      var other_kind_data = [];
      var selected_kind_id = 0;
      var other_kind = this.state.other_kind;
      if (res.other_kind_data != undefined){
        other_kind_data = res.other_kind_data;
      }

      var other_kind_detail_data = [];
      var selected_kind_detail_id = 0;
      var other_kind_detail = this.state.other_kind_detail;
      if (res.other_kind_detail_data != undefined){
        other_kind_detail_data = res.other_kind_detail_data;
      }

      //-------------------------------------------------------------------------------------

      let radiation_data = this.state.radiation_data;
      let sick_name = this.state.sick_name;
      let treat_date = this.state.treat_date;
      let etc_comment = this.state.etc_comment;
      let body_part = this.state.body_part;
      // let height = res.height;
      // let weight = res.weight;
      let height = '';
      let weight = '';
      let surface_area = this.state.surface_area;
      let request_comment = this.state.request_comment;
      let gensa_date = this.state.gensa_date;
      let reserve_time = this.state.reserve_time;
      let reserve_data = this.state.reserve_data;
      let not_yet = this.state.not_yet;
      let pregnancy_id = this.state.pregnancy_id;
      let pregnancy = this.state.pregnancy;
      let film_output_id = this.state.film_output_id;
      let film_output = this.state.film_output;
      let kind_id = this.state.kind_id;
      let kind = this.state.kind;
      let move_id = this.state.move_id;
      let move = this.state.move;
      let filmsend_id = this.state.filmsend_id;
      let filmsend = this.state.filmsend;
      let inquiry_id = this.state.inquiry_id;
      let inquiry = this.state.inquiry;
      let use_id = this.state.use_id;
      let use = this.state.use;
      let shoot_count = this.state.shoot_count;
      let sub_picture = this.state.sub_picture;
      let direction_count = this.state.direction_count;
      var receipt_keys = this.state.receipt_keys;
      var item_id_groups = this.state.item_id_groups;

      let instructions = this.state.instructions;
      let shootings = this.state.shootings;
      let selected_shootings = [];
      let selected_instructions = [];
      let shootings_check = this.state.instructions_check;
      let instructions_check = this.state.shootings_check;

      var free_comment = this.state.free_comment;
      var other_body_part = this.state.other_body_part;
      var formula = this.state.formula;
      var formula_id = this.state.formula_id;
      let is_emergency = 0;
      var obtain_tech = this.state.obtain_tech;
      var obtain_tech_id = this.state.obtain_tech_id;
      var portable_shoot = this.state.portable_shoot;

      if (cache_data != null){
        if(cache_data.portable_shoot != undefined && cache_data.portable_shoot != null) portable_shoot = cache_data.portable_shoot;
        if (portable_shoot == true) this.exist_portable_shoots = true;

        if(cache_data.radiation_data != undefined && cache_data.radiation_data != null) {
          radiation_data = cache_data.radiation_data;
          radiation_data.map(item => {
            var part_id = item.part_id;
            var part_item = radiation_part_data.filter(x=>x.radiation_part_id == part_id);
            if (part_item.length == 1 && part_item[0].can_portable_radiography) this.exist_portable_shoots = true;
          })
        }
        if(cache_data.sick_name != undefined && cache_data.sick_name != null) sick_name = cache_data.sick_name;
        if(cache_data.treat_date != undefined && cache_data.treat_date != null) treat_date = cache_data.treat_date;
        if(treat_date === '日未定'){
          not_yet = true;
          gensa_date = '';
          var placeholder = '日未定';
        } else {
          gensa_date = new Date(treat_date);
          if(cache_data.reserve_time !== undefined){
            reserve_time = cache_data.reserve_time == "時間未定" ? null : cache_data.reserve_time;
            reserve_data = cache_data.reserve_data;
          }
        }
        if(cache_data.etc_comment != undefined && cache_data.etc_comment != null) etc_comment = cache_data.etc_comment;
        if(cache_data.body_part != undefined && cache_data.body_part != null) body_part = cache_data.body_part;
        if(cache_data.height != undefined && cache_data.height != null) height = cache_data.height;
        if(cache_data.weight != undefined && cache_data.weight != null) weight = cache_data.weight;
        if(cache_data.surface_area != undefined && cache_data.surface_area != null) surface_area = cache_data.surface_area;
        if(cache_data.request_comment != undefined && cache_data.request_comment != null) request_comment = cache_data.request_comment;
        if(cache_data.pregnancy_id != undefined && cache_data.pregnancy_id != null) pregnancy_id = cache_data.pregnancy_id;
        if(cache_data.pregnancy != undefined && cache_data.pregnancy != null) pregnancy = cache_data.pregnancy;
        if(cache_data.film_output_id != undefined && cache_data.film_output_id != null) film_output_id = cache_data.film_output_id;
        if(cache_data.film_output != undefined && cache_data.film_output != null) film_output = cache_data.film_output;
        if(cache_data.kind_id != undefined && cache_data.kind_id != null) kind_id = cache_data.kind_id;
        if(cache_data.kind != undefined && cache_data.kind != null) kind = cache_data.kind;
        if(cache_data.move_id != undefined && cache_data.move_id != null) move_id = cache_data.move_id;
        if(cache_data.move != undefined && cache_data.move != null) move = cache_data.move;
        if(cache_data.filmsend_id != undefined && cache_data.filmsend_id != null) filmsend_id = cache_data.filmsend_id;
        if(cache_data.filmsend != undefined && cache_data.filmsend != null) filmsend = cache_data.filmsend;
        if(cache_data.inquiry_id != undefined && cache_data.inquiry_id != null) inquiry_id = cache_data.inquiry_id;
        if(cache_data.inquiry != undefined && cache_data.inquiry != null) inquiry = cache_data.inquiry;
        if(cache_data.use_id != undefined && cache_data.use_id != null) use_id = cache_data.use_id;
        if(cache_data.use != undefined && cache_data.use != null) use = cache_data.use;
        if(cache_data.shoot_count != undefined && cache_data.shoot_count != null) shoot_count = cache_data.shoot_count;
        if(cache_data.sub_picture != undefined && cache_data.sub_picture != null) sub_picture = cache_data.sub_picture;
        if(cache_data.direction_count != undefined && cache_data.direction_count != null) direction_count = cache_data.direction_count;
        if(cache_data.receipt_keys != undefined && cache_data.receipt_keys != null) receipt_keys = cache_data.receipt_keys;
        if(cache_data.item_id_groups != undefined && cache_data.item_id_groups != null) item_id_groups = cache_data.item_id_groups;

        if(cache_data.selected_instructions != undefined && cache_data.selected_instructions != null) selected_instructions = cache_data.selected_instructions;
        if(cache_data.selected_shootings != undefined && cache_data.selected_shootings != null) selected_shootings = cache_data.selected_shootings;

        if(cache_data.formula_id != undefined && cache_data.formula_id != null) formula_id = cache_data.formula_id;
        if(cache_data.formula != undefined && cache_data.formula != null) formula = cache_data.formula;
        if(cache_data.is_emergency != undefined && cache_data.is_emergency != null) is_emergency = cache_data.is_emergency;
        if(cache_data.obtain_tech != undefined && cache_data.obtain_tech != null) obtain_tech = cache_data.obtain_tech;
        if(cache_data.obtain_tech_id != undefined && cache_data.obtain_tech_id != null) obtain_tech_id = cache_data.obtain_tech_id;
        
        //他医撮影診断分
        if(cache_data.selected_kind_id != undefined && cache_data.selected_kind_id != null) {
          selected_kind_id = cache_data.selected_kind_id;
          var display_other_kind_details = undefined;
          if (other_kind_detail_data != undefined){
            display_other_kind_details = other_kind_detail_data.filter(x=>x.kind_id == parseInt(selected_kind_id));
          }
        }
        if(cache_data.selected_kind_detail_id != undefined && cache_data.selected_kind_detail_id != null) selected_kind_detail_id = cache_data.selected_kind_detail_id;
        if(cache_data.other_kind != undefined && cache_data.other_kind != null) other_kind = cache_data.other_kind;
        if(cache_data.other_kind_detail != undefined && cache_data.other_kind_detail != null) other_kind_detail = cache_data.other_kind_detail;
        if(cache_data.free_comment != undefined && cache_data.free_comment != null) free_comment = cache_data.free_comment;
        if(cache_data.other_body_part != undefined && cache_data.other_body_part != null) other_body_part = cache_data.other_body_part;
        //------------
      }

      selected_instructions.map((item) => {
        instructions_check[item.number] = true;
      })
      selected_shootings.map((item) => {
        shootings_check[item.number] = true;
      })

      //加算項目-----------------------------------------------
      let additions_check = {};
      let additions_send_flag_check = {};
      var additions = [];
      if (res.additions != undefined && res.additions!= null){
        additions = res.additions;
        additions.map(addition=> {
          if (cache_data != null && cache_data.additions != undefined && cache_data.additions[addition.addition_id] != undefined){
            additions_check[addition.addition_id] = true;
            let sending_flag = cache_data.additions[addition.addition_id]['sending_flag'];
            if(sending_flag !== undefined && sending_flag !== null && sending_flag === 1){
              additions_send_flag_check[addition.addition_id] = true;
            } else {
              additions_send_flag_check[addition.addition_id] = false;
            }
          } else {
            additions_check[addition.addition_id] = false;
            additions_send_flag_check[addition.addition_id] = false;
          }
        })
      }
      //-------------------------------------------------------

      this.setState({
        number,
        isForUpdate,
        done_order,
        created_at,
        karte_status,
        type,
        radiation_id,
        radiation_classific_data,
        selected_classific_id,
        selected_classific_name,
        radiation_part_data,
        selected_part_id,
        selected_part_name,
        radiation_direction_data,
        selected_direction_id,
        selected_direction_name,
        radiation_left_right_data,
        selected_left_right_id,
        selected_left_right_name,
        radiation_method_data,
        selected_method_id,
        selected_method_name,
        radiation_comment_data,
        selected_comment_id,
        selected_comment_name,
        is_reserved,
        imgBase64: imgBase64,
        image_path: image_path,
        shoot_count_flag,
        part_shoot_count: shoot_count_flag?1:'',
        sub_picture_flag,
        direction_count_flag,
        height_weight_flag,
        enable_contrast_medium_interview_sheet,
        left_right_flag_data,
        origin_radiation_left_right_data,
        radiation_data,
        sick_name,
        gensa_date,
        reserve_time,
        reserve_data,
        placeholder,
        not_yet,
        etc_comment,
        body_part,
        height,
        weight,
        surface_area,
        request_comment,
        pregnancy_id,
        pregnancy,
        film_output_id,
        film_output,
        kind_id,
        kind,
        move_id,
        move,
        filmsend_id,
        filmsend,
        inquiry_id,
        inquiry,
        shoot_count,
        sub_picture,
        direction_count,
        use_id,
        use,

        item_details,
        instructions,
        instructions_check,
        shootings,
        shootings_check,
        selected_shootings,
        selected_instructions,
        additions,
        additions_check,
        additions_send_flag_check,
        directions_check,
        comments_check,

        receipt_keys,
        item_id_groups,

        other_kind_data,
        selected_kind_id,
        other_kind,
        other_kind_detail_data,
        selected_kind_detail_id,
        display_other_kind_details,
        other_kind_detail,
        free_comment,
        other_body_part,

        is_emergency,
        formula_list,
        formula_data,
        formula,
        formula_id,
        obtain_tech,
        obtain_tech_id,
        portable_shoot,
      })
    });
  }

  async getRecentRadiationOrderData(radiation_id) {
    let path = "/app/api/v2/order/radiation/getRecentOrder";
    let post_data = {
      radiation_id:radiation_id,
    };
    await apiClient._post(path, {params: post_data}).then((res) => {
      if (res.length > 0){
        this.setState({
          recent_order:res,
        })
      } else {
        this.setState({
          recent_order:undefined,
        })
      }
    })
    .catch(()=> {
      this.setState({
        recent_order:undefined,
      })
    })
  }

  getRadio = (name,number) => {
    var check_status = {};
    switch(name){
      case 'instruction':
        this.change_flag = 1;
        check_status = this.state.instructions_check;
        check_status[number] = !check_status[number];
        this.setState({instructions_check:check_status});
        break;
      case 'shooting':
        this.change_flag = 1;
        check_status = this.state.shootings_check;
        check_status[number] = !check_status[number];
        this.setState({shootings_check:check_status});
        break;
      case "direction":
        this.change_flag = 1;
        check_status = this.state.directions_check;
        check_status[number] = !check_status[number];

        var count_sum = 0;
        var shoot_count = '';
        if (this.count_is_force_disabled == 0){          
          Object.keys(check_status).map(key_id => {
            if (check_status[key_id]) {
              var selected_direction = this.state.display_direction_data.find(x=>x.radiation_direction_id == key_id);
              count_sum += selected_direction.count;
            } 
          })

          if (this.state.selected_left_right_item != undefined && this.state.selected_left_right_item != ''){
            if (count_sum > 0){
              if (this.state.part_shoot_count > 0){
                shoot_count = this.state.selected_left_right_item.magnification * this.state.part_shoot_count * count_sum;
                count_sum = this.state.part_shoot_count * count_sum;
              }
            } else {
              if (this.state.part_shoot_count > 0){
                shoot_count = this.state.selected_left_right_item.magnification * this.state.part_shoot_count;
                count_sum = this.state.part_shoot_count;
              }
            }
          } else {
            if (count_sum > 0){
              if (this.state.part_shoot_count > 0){
                shoot_count = this.state.part_shoot_count * count_sum;
                count_sum = this.state.part_shoot_count * count_sum;
              }
            } else {
              shoot_count = this.state.part_shoot_count;
              count_sum = this.state.part_shoot_count;
            }
          }
        }
        
        this.setState({
          directions_check:check_status,
          count_sum,
          shoot_count,
        });
        break;
      case "comments":
        this.change_flag = 1;
        check_status = this.state.comments_check;
        check_status[number] = !check_status[number];
        this.setState({comments_check:check_status});
        break;
    }
  }

  getGensaDate = (value) => {
    this.change_flag = 1;
    this.setState({
      placeholder:'',
      not_yet: false,
      gensa_date:value,
    });
  }

  showMedicineModal = () => {
    this.change_flag = 1;
    this.setState({isShowMedicineModal:true});
  }

  showCommentModal = () => {
    this.change_flag = 1;
    this.setState({isShowCommentModal:true});
  }

  closeModal = () => {
    this.setState({
      isShowMedicineModal:false,
      isShowCommentModal:false,
      isItemSelectModal:false,
      openKnowledgeSetModal:false,
    });
  }

  getPregnancy = (e) => {
    this.change_flag = 1;
    this.setState({
      pregnancy_id:parseInt(e.target.value),
      pregnancy:e.target.id,
    });
  }

  getKind = (e) => {
    this.change_flag = 1;
    this.setState({
      kind_id:parseInt(e.target.value),
      kind:e.target.id,
    });
  }

  getMove = (e) => {
    this.change_flag = 1;
    this.setState({
      move_id:parseInt(e.target.value),
      move:e.target.id,
    });
  }

  getInquiry = (e) => {
    this.change_flag = 1;
    this.setState({
      inquiry_id:parseInt(e.target.value),
      inquiry:e.target.id,
    });
  }

  getUse = (e) => {
    this.change_flag = 1;
    this.setState({
      use_id:parseInt(e.target.value),
      use:e.target.id
    });    
    if (e.target.value != 2){
      var radiation_data = this.state.radiation_data;
      var added_receipt_keys = [];
      var classfic_ids = [];
      radiation_data.map(item => {        
        if (item.classific_item.receipt_key != null && item.classific_item.receipt_key != ''){
          added_receipt_keys.push(item.classific_item.receipt_key.split(','));
        }
    
        if (item.classific_item.receipt_key_if_use_contrast_medium != null && item.classific_item.receipt_key_if_use_contrast_medium != '' ){
          added_receipt_keys.push(item.classific_item.receipt_key_if_use_contrast_medium.split(','));
        }
        classfic_ids.push(item.classfic_id);
        
        if (item.part_item.can_portable_radiography){
          if (this.state.portable_shoot){
            if (item.part_item.receipt_key_if_portable != null && item.part_item.receipt_key_if_portable != ''){
              added_receipt_keys.push(item.part_item.receipt_key_if_portable.split(','));
            }
          } else {
            if (item.part_item.receipt_key != null && item.part_item.receipt_key != ''){
              added_receipt_keys.push(item.part_item.receipt_key.split(','));
            }
          }
        } else {
          if (item.part_item.receipt_key != null && item.part_item.receipt_key != ''){
            added_receipt_keys.push(item.part_item.receipt_key.split(','));
          }
        }
        
        if (item.method_item != undefined && item.method_item.receipt_key != null && item.method_item.receipt_key != ''){
          added_receipt_keys.push(item.method_item.receipt_key.split(','));
        }
      })
      this.addContrastMedium(added_receipt_keys, classfic_ids, true);
    }
  }

  getFilmsend = (e) => {
    this.change_flag = 1;
    this.setState({
      filmsend_id:parseInt(e.target.value),
      filmsend:e.target.id,
    });
  }

  getKey = (e) => {
    this.change_flag = 1;
    this.setState({
      key_id:parseInt(e.target.value),
      key:e.target.id,
    });
  }

  getdummy = (e) => {
    this.change_flag = 1;
    this.setState({dummy:parseInt(e.target.value)});
  }

  getFilmOutput = (e) => {
    this.change_flag = 1;
    this.setState({
      film_output_id:parseInt(e.target.value),
      film_output:e.target.id,
    });
  }

  handleShema = () => {
    this.change_flag = 1;
    this.setState({
      isOpenShemaModal: true
    });
  }

  getEtcComment =(value)=>{
    this.change_flag = 1;
    this.setState({
      etc_comment:value,
    });
  }

  getSickName =(value)=>{
    this.change_flag = 1;
    this.setState({
      sick_name:value,
    });
  }

  getSpecialPresentation =(value)=>{
    this.change_flag = 1;
    this.setState({
      special_presentation:value,
    });
  }

  calculateSurface(formula_name){
    if (formula_name == undefined || formula_name ==null || formula_name == '') {
      this.change_flag = 1;
      this.setState({surface_area:''});
      return false;
    }
    var height = parseFloat(this.state.height);
    var weight = parseFloat(this.state.weight);
    var formula = this.state.formula_data[formula_name];
    formula = formula.replace('height', height);
    formula = formula.replace('weight', weight);
    var surface_area = eval(formula);
    surface_area = parseFloat(surface_area).toFixed(4);
    this.change_flag = 1;
    this.setState({surface_area});
  }

  selectBody = (name, e) => {
    if(e < 0) e = 0;
    switch(name){
      case 'weight':
        this.change_flag = 1;
        this.manual_height_weight_change = true;
        this.setState({weight: isNaN(parseFloat(e)) ? '' : e}, () => {
          this.calculateSurface(this.state.formula);
        });
        break;
      case 'height':
        this.change_flag = 1;
        this.manual_height_weight_change = true;
        this.setState({height: isNaN(parseFloat(e)) ? '' : e}, () => {
          this.calculateSurface(this.state.formula);
        });
        break;
      case 'surface_area':
        this.change_flag = 1;
        this.setState({surface_area: isNaN(parseFloat(e)) ? '' : parseFloat(e)});
        break;
    }
  };

  selectCount = (name, e) => {
    let regx = /^[.]*[0-9０-９][.0-9０-９]*$/;
    if (e != "" && !regx.test(e)) return;
    switch(name){
      case 'shoot':
        this.change_flag = 1;
        this.setState({shoot_count: isNaN(parseInt(e)) ? '' : parseInt(e)});
        break;
      case 'picture':
        this.change_flag = 1;
        this.setState({sub_picture: isNaN(parseInt(e)) ? '' : parseInt(e)});
        break;
      case 'direction':
        this.change_flag = 1;
        this.setState({direction_count: isNaN(parseInt(e)) ? '' : parseInt(e)});
        break;
    }
  };

  selectClassfic = (item) => {
    var part_data = this.state.radiation_part_data;
    var display_part_data = part_data.filter(x=>x.radiation_shooting_classific_id == parseInt(item.radiation_shooting_classific_id));
    this.change_flag = 1;

    this.count_is_force_disabled = item.count_is_force_disabled;
    this.setState({
      selected_classific_id : item.radiation_shooting_classific_id,
      selected_classific_name : item.radiation_shooting_classific_name,
      selected_classific_item : item,
      selected_part_id :display_part_data.length ==1? display_part_data[0].radiation_part_id: 0,
      selected_part_name: display_part_data.length ==1? display_part_data[0].radiation_part_name: '',
      selected_part_item: display_part_data.length ==1? display_part_data[0]: undefined,
      selected_direction_id :0,
      selected_direction_name:'',
      selected_method_id : 0,
      selected_method_name:'',
      selected_comment_id :0,
      selected_comment_name:'',
      selected_left_right_id:0,
      selected_left_right_name:'',
      selected_left_right_item:'',
      count_sum:'',
      shoot_count:'',

      radiation_left_right_data:[],
      display_part_data,
      display_method_data:[],
      display_comment_data:[],
      display_direction_data:[],
      directions_check:{},
      comments_check:{},
    }, () => {
      if (display_part_data.length == 1){
        this.selectPart(display_part_data[0]);
      }
    })
  }

  selectPart = (item) => {
    var directions_check = {};
    var display_direction_data = this.state.radiation_direction_data.filter(x=>x.radiation_part_id == parseInt(item.radiation_part_id));
    var direction_sum = 1;
    if (display_direction_data != undefined){
      display_direction_data.map(sub_item => {
        directions_check[sub_item.radiation_direction_id] = false;
      })
      if (display_direction_data.length == 1){
        directions_check[display_direction_data[0].radiation_direction_id] = true;
        direction_sum = display_direction_data[0].count;
      }
    }
    var comments_check = {};
    var display_comment_data = this.state.radiation_comment_data.filter(x=>x.radiation_part_id == parseInt(item.radiation_part_id));
    if (display_comment_data != undefined){
      display_comment_data.map(sub_item => {
        comments_check[sub_item.radiation_shooting_comment_id] = false;
      })
    }
    var display_method_data = this.state.radiation_method_data.filter(x=>x.radiation_part_id == parseInt(item.radiation_part_id));
    var radiation_left_right_data = [];
    if (item.radiation_left_right_flag == 1){
      radiation_left_right_data = this.state.origin_radiation_left_right_data;
    }
    this.change_flag = 1;
    this.setState({
      selected_part_id:item.radiation_part_id,
      selected_part_name:item.radiation_part_name,
      selected_part_item:item,
      selected_method_id :0,
      selected_method_name:'',
      radiation_left_right_data,
      selected_left_right_id:0,
      selected_left_right_name:'',      
      count_sum:this.count_is_force_disabled? '' : this.state.shoot_count_flag?item.count * direction_sum:'',
      shoot_count: this.count_is_force_disabled? '' : this.state.shoot_count_flag?item.count * direction_sum:'',
      part_shoot_count: this.state.shoot_count_flag?item.count:'',
      directions_check,
      comments_check,
      display_direction_data,
      display_comment_data,
      display_method_data,
    })
  }

  selectMethod = (item) => {
    this.change_flag = 1;
    this.setState({
      selected_method_id:item.radiation_method_id,
      selected_method_name:item.radiation_method_name,
      selected_method_item:item,
    })
  }

  selectLeftRight = (item) => {
    this.change_flag = 1;
    this.setState({
      selected_left_right_id:item.radiation_left_right_id,
      selected_left_right_name:item.radiation_left_right_name,
      selected_left_right_item:item,
      shoot_count: this.state.count_sum > 0? item.magnification * this.state.count_sum: '',
      // shoot_count : this.state.shoot_count > 0 ? item.magnification * this.state.shoot_count: '',
    })
  }

  addContrastMedium = async(receipt_keys, classfic_ids, refresh_flag = false) => {
    var temp;
    if (refresh_flag){
      temp = [];
    } else {
      temp = this.state.item_id_groups;
    }
     
    if (receipt_keys == [] && classfic_ids.length == 0){
      temp.push([]);
      this.change_flag = 1;
      this.setState({item_id_groups:temp}, () => {this.getContrastList(this.state.item_id_groups)});      
      return false;
    }

    let path = "/app/api/v2/master/radiation/searchContrastsItemIDs";
    let post_data = {
      receipt_keys:receipt_keys,
      classfic_ids,
    };
    await apiClient._post(path, {params: post_data}).then((res) => {
      if (res.length == 0){
        temp.push([]);
      } else {
        temp.push(res);
        this.change_flag = 1;
      }
      this.setState({item_id_groups:temp}, () => {
        this.getContrastList(this.state.item_id_groups);
      });
      
    })
  }

  editContrastMedium = async(receipt_keys, classfic_ids) => {
    var temp = this.state.item_id_groups;
    if (receipt_keys == [] && classfic_ids.length == 0){
      temp[0] = [];
      this.change_flag = 1;
      this.setState({item_id_groups:temp});
      return false;
    }

    let path = "/app/api/v2/master/radiation/searchContrastsItemIDs";
    let post_data = {
      receipt_keys:receipt_keys,
      classfic_ids
    };
    await apiClient._post(path, {params: post_data}).then((res) => {
      temp[0] = res;
      this.change_flag = 1;
      this.setState({item_id_groups:temp}, () => {
        this.getContrastList(this.state.item_id_groups);
      });

    })
  }

  getContrastList = async(id_groups) => {
    if (id_groups == undefined || id_groups == null || id_groups.length == 0 ){
      this.change_flag = 1;
      this.setState({
        item_details:this.init_item_details,
      });
      return;
    }

    var search_ids = [];
    id_groups.map(item => {
      item.map(sub_item => {
        if (sub_item != null) search_ids.push(sub_item);
      })
    })

    let path = "/app/api/v2/master/radiation/searchContrastsItemList";
    let post_data = {
      function_id:FUNCTION_ID_CATEGORY.RADIATION,
      item_category_id:9,
      search_ids:search_ids,
    };

    await apiClient._post(path, {params:post_data}).then( res => {      
      this.change_flag = 1;
      var temp = res.length>0?this.convertItemDetails(res):this.init_item_details;
      this.setState({item_details:temp})
    })
  }

  checkTrueBox(data){
    if (data == undefined || data == null || Object.keys(data).length ==0 ) return false;
    for (var key in data){
      if (data[key] == true) return true;
    }
    return false;
  }

  addToTable = () => {
    if(this.state.edit_flag || this.check_can_add_flag != true) return false;
    var temp = this.state.radiation_data;
    if (temp == undefined || temp == null) temp = [];
    if (this.state.radiation_classific_data != undefined && this.state.radiation_classific_data != null && this.state.radiation_classific_data.length>0 && this.state.selected_classific_name =='') {
      this.setState({alert_messages:'撮影区分を選択してください。'});
      return false;
    }
    if (this.state.display_part_data != undefined && this.state.display_part_data != null && this.state.display_part_data.length>0 && this.state.selected_part_name=='') {
      this.setState({alert_messages:'部位を選択してください。'});
      return false;
    }
    if (this.state.display_method_data != undefined && this.state.display_method_data != null && this.state.display_method_data.length>0 && this.state.selected_method_name =='') {
      this.setState({alert_messages:'方法を選択してください。'});
      return false;
    }    
    if (this.state.display_direction_data != undefined && this.state.display_direction_data != null && this.state.display_direction_data.length>0 && (this.state.directions_check == {} || this.checkTrueBox(this.state.directions_check) == false)){
      this.setState({alert_messages:'方向を選択してください。'});
      return false;
    }
    var directions_check = this.state.directions_check;
    var comments_check = this.state.comments_check;
    var selected_directions = {};
    var selected_comments = {};
    var direction_id = 0;
    var comment_id = 0;

    if (Object.keys(directions_check).length > 0){
      Object.keys(directions_check).map(key_id => {
        if (directions_check[key_id]) selected_directions[key_id] = this.state.display_direction_data.find(x=>x.radiation_direction_id == key_id).radiation_direction_name;
      })
    }
    if (Object.keys(selected_directions).length > 0) direction_id = Object.keys(selected_directions)[0];

    if (Object.keys(comments_check).length > 0){
      Object.keys(comments_check).map(key_id => {
        if (comments_check[key_id]) selected_comments[key_id] = this.state.display_comment_data.find(x=>x.radiation_shooting_comment_id == key_id).radiation_shooting_comment_name;
      })
    }
    if (Object.keys(selected_comments).length > 0) comment_id = Object.keys(selected_comments)[0];

    var added_receipt_keys =[];    
    if (this.state.selected_classific_item.receipt_key != null && this.state.selected_classific_item.receipt_key != ''){
      added_receipt_keys.push(this.state.selected_classific_item.receipt_key.split(','));
    }

    if (this.state.selected_classific_item.receipt_key_if_use_contrast_medium != null && this.state.selected_classific_item.receipt_key_if_use_contrast_medium != '' ){
      added_receipt_keys.push(this.state.selected_classific_item.receipt_key_if_use_contrast_medium.split(','));
    }
    if (this.state.selected_classific_item.is_all_angiography) this.default_use_flag = true;


    if (this.state.selected_part_id > 0 && this.state.selected_part_name != ''){
      if (this.state.selected_part_item.can_portable_radiography){
        this.exist_portable_shoots = true;
        if (this.state.portable_shoot){
          if (this.state.selected_part_item.receipt_key_if_portable != null && this.state.selected_part_item.receipt_key_if_portable != ''){
            added_receipt_keys.push(this.state.selected_part_item.receipt_key_if_portable.split(','));
          }
        } else {
          if (this.state.selected_part_item.receipt_key != null && this.state.selected_part_item.receipt_key != ''){
            added_receipt_keys.push(this.state.selected_part_item.receipt_key.split(','));
          }
        }
      } else {
        if (this.state.selected_part_item.receipt_key != null && this.state.selected_part_item.receipt_key != ''){
          added_receipt_keys.push(this.state.selected_part_item.receipt_key.split(','));
        }
      }
    }

    if (this.state.selected_method_id > 0 && this.state.selected_method_name != ''){
      if (this.state.selected_method_item.receipt_key != null && this.state.selected_method_item.receipt_key != ''){
        added_receipt_keys.push(this.state.selected_method_item.receipt_key.split(','));
      }
      if(this.state.selected_method_item.is_angiography) this.default_use_flag = true;
    }

    this.addContrastMedium(added_receipt_keys, [this.state.selected_classific_id]);

    var temp_keys = this.state.receipt_keys;
    if (added_receipt_keys != []) temp_keys.push(added_receipt_keys);

    var radiation_data_item = {
      classfic_id:this.state.selected_classific_id,
      classfic_name:this.state.selected_classific_name,
      classific_item:this.state.selected_classific_item,
      part_id:this.state.selected_part_id,
      part_name:this.state.selected_part_name,
      part_item: this.state.selected_part_item,
      left_right_id:this.state.selected_left_right_id,
      left_right_name:this.state.selected_left_right_name,
      selected_directions,
      method_id:this.state.selected_method_id,
      method_name:this.state.selected_method_name,
      method_item:this.state.selected_method_item,
      selected_comments,
      direction_id,
      comment_id,
      shoot_count:this.state.shoot_count>0?this.state.shoot_count:'',
      sub_picture:this.state.sub_picture>0?this.state.sub_picture:'',
      direction_count:this.state.direction_count>0?this.state.direction_count:'',
      count_sum:this.state.count_sum>0?this.state.count_sum:'',
      order_number:0
    }

    temp.push(radiation_data_item);
    this.change_flag = 1;    
    this.setState({
      radiation_data:temp,
      receipt_keys:temp_keys,
      shoot_count:'',
      sub_picture:'',
      direction_count:'',
      count_sum:'',      
      radiation_left_right_data:[],
      display_part_data:[],
      display_method_data:[],
      display_comment_data:[],
      display_direction_data:[],
      directions_check:{},
      comments_check:{},
      selected_classific_id:0,
      selected_classific_name:'',
      selected_part_id:0,
      selected_part_name:'',
      selected_direction_id:0,
      selected_direction_name:'',
      selected_left_right_id:0,
      selected_left_right_name:'',
      selected_method_id:0,
      selected_method_name:'',
      selected_comment_id:0,
      selected_comment_name:'',
      use_id : this.default_use_flag? 0 : 2,
      use : this.default_use_flag? '造影剤を使用する' : '使用しない',
    });
    if (this.default_use_flag){
      this.use_items = [
        {label:'造影剤を使用する', value:0},
      ];
    } else {
      this.use_items = [
        {label:'造影剤を使用する', value:0},
        {label:'依頼医の責任において造影実施', value:1},
        {label:'使用しない', value:2},
      ];
    }
  }

  editToTable = () => {
    if(this.state.edit_flag == false) return false;
    var temp = this.state.radiation_data;
    if (this.state.radiation_classific_data != undefined && this.state.radiation_classific_data != null && this.state.radiation_classific_data.length>0 && this.state.selected_classific_name =='') {
      this.setState({alert_messages:'撮影区分を選択してください。'})
      return false;
    }
    if (this.state.display_part_data != undefined && this.state.display_part_data != null && this.state.display_part_data.length>0 && this.state.selected_part_name=='') {
      this.setState({alert_messages:'部位を選択してください。'})
      return false;
    }
    if (this.state.display_method_data != undefined && this.state.display_method_data != null && this.state.display_method_data.length>0 && this.state.selected_method_name =='') {
      this.setState({alert_messages:'方法を選択してください。'})
      return false;
    }
    if (this.state.display_direction_data != undefined && this.state.display_direction_data != null && this.state.display_direction_data.length>0 && (this.state.directions_check == {} || this.checkTrueBox(this.state.directions_check) == false)){
      this.setState({alert_messages:'方向を選択してください。'})
      return false;
    }

    var directions_check = this.state.directions_check;
    var comments_check = this.state.comments_check;
    var selected_directions = {};
    var selected_comments = {};
    var direction_id = 0;
    var comment_id = 0;

    if (Object.keys(directions_check).length > 0){
      Object.keys(directions_check).map(key_id => {
        if (directions_check[key_id]) selected_directions[key_id] = this.state.display_direction_data.find(x=>x.radiation_direction_id == key_id).radiation_direction_name;
      })
    }
    if (Object.keys(selected_directions).length > 0) direction_id = Object.keys(selected_directions)[0];

    if (Object.keys(comments_check).length > 0){
      Object.keys(comments_check).map(key_id => {
        if (comments_check[key_id]) selected_comments[key_id] = this.state.display_comment_data.find(x=>x.radiation_shooting_comment_id == key_id).radiation_shooting_comment_name;
      })
    }
    if (Object.keys(selected_comments).length > 0) comment_id = Object.keys(selected_comments)[0];

    var edit_receipt_keys =[];
    if (this.state.selected_classific_item.receipt_key != null && this.state.selected_classific_item.receipt_key != ''){
      edit_receipt_keys.push(this.state.selected_classific_item.receipt_key.split(','));
    }

    if (this.state.selected_classific_item.receipt_key_if_use_contrast_medium != null && this.state.selected_classific_item.receipt_key_if_use_contrast_medium != ''){
      edit_receipt_keys.push(this.state.selected_classific_item.receipt_key_if_use_contrast_medium.split(','));
    }

    if (this.state.selected_classific_item.is_all_angiography) this.default_use_flag = true;

    if (this.state.selected_part_id > 0 && this.state.selected_part_name != ''){
      if (this.state.selected_part_item.can_portable_radiography){
        this.exist_portable_shoots = true;
        if (this.state.portable_shoot){
          if (this.state.selected_part_item.receipt_key_if_portable != null && this.state.selected_part_item.receipt_key_if_portable != ''){
            edit_receipt_keys.push(this.state.selected_part_item.receipt_key_if_portable.split(','));
          }
        } else {
          if (this.state.selected_part_item.receipt_key != null && this.state.selected_part_item.receipt_key != ''){
            edit_receipt_keys.push(this.state.selected_part_item.receipt_key.split(','));
          }
        }
      } else {
        if (this.state.selected_part_item.receipt_key != null && this.state.selected_part_item.receipt_key != ''){
          edit_receipt_keys.push(this.state.selected_part_item.receipt_key.split(','));
        }
      }
    }

    if (this.state.selected_method_id > 0 && this.state.selected_method_name != ''){
      if (this.state.selected_method_item.receipt_key != null && this.state.selected_method_item.receipt_key != ''){
        edit_receipt_keys.push(this.state.selected_method_item.receipt_key.split(','));
      }
      if (this.state.selected_method_item.is_angiography) this.default_use_flag = true;
    }
    
    this.editContrastMedium(edit_receipt_keys, [this.state.selected_classific_id]);    

    var radiation_data_item = {
      classfic_id:this.state.selected_classific_id,
      classfic_name:this.state.selected_classific_name,
      classific_item:this.state.selected_classific_item,
      part_id:this.state.selected_part_id,
      part_name:this.state.selected_part_name,
      part_item: this.state.selected_part_item,
      left_right_id:this.state.selected_left_right_id,
      left_right_name:this.state.selected_left_right_name,
      selected_directions,
      method_id:this.state.selected_method_id,
      method_name:this.state.selected_method_name,
      method_item:this.state.selected_method_item,
      selected_comments,
      direction_id,
      comment_id,
      shoot_count:this.state.shoot_count>0?this.state.shoot_count:'',
      sub_picture:this.state.sub_picture>0?this.state.sub_picture:'',
      direction_count:this.state.direction_count>0?this.state.direction_count:'',
      order_number: this.state.number > 0 ? this.state.selected_item_order_number : 0,
      count_sum:this.state.count_sum> 0?this.state.count_sum:'',
    }
    temp[0] = radiation_data_item;
    this.change_flag = 1;
    this.setState({
      radiation_data:temp,
      edit_flag:false,

      shoot_count:'',
      sub_picture:'',
      direction_count:'',
      radiation_left_right_data:[],
      display_part_data:[],
      display_method_data:[],
      display_comment_data:[],
      display_direction_data:[],
      directions_check:{},
      comments_check:{},
      selected_classific_id:0,
      selected_classific_name:'',
      selected_part_id:0,
      selected_part_name:'',
      selected_direction_id:0,
      selected_direction_name:'',
      selected_left_right_id:0,
      selected_left_right_name:'',
      selected_method_id:0,
      selected_method_name:'',
      selected_comment_id:0,
      selected_comment_name:'', 
      
      use_id : this.default_use_flag? 0 : 2,
      use : this.default_use_flag? '造影剤を使用する' : '使用しない',
    });
    if (this.default_use_flag){
      this.use_items = [
        {label:'造影剤を使用する', value:0},        
      ];
    } else {
      this.use_items = [
        {label:'造影剤を使用する', value:0},
        {label:'依頼医の責任において造影実施', value:1},
        {label:'使用しない', value:2},
      ];      
    }
  }

  doneEdit = () => {
    if(this.state.edit_flag == false) return false;
    this.change_flag = 1;
    this.setState({
      edit_flag:false,
      shoot_count:'',
      sub_picture:'',
      direction_count:'',
      radiation_left_right_data:[],
      display_part_data:[],
      display_method_data:[],
      display_comment_data:[],
      display_direction_data:[],
      directions_check:{},
      comments_check:{},
      selected_classific_id:0,
      selected_classific_name:'',
      selected_part_id:0,
      selected_part_name:'',
      selected_direction_id:0,
      selected_direction_name:'',
      selected_left_right_id:0,
      selected_left_right_name:'',
      selected_method_id:0,
      selected_method_name:'',
      selected_comment_id:0,
      selected_comment_name:'',
    })
  }

  saveAndDone = () => {
    this.saveData();
  };

  componentDidUpdate () {
    this.changeBackground();    
    this.checkAngiography();    
  }

  checkAngiography = () => {
    var check_all_flag = false;
    var check_flag = false;
    if (this.state.radiation_data != undefined && this.state.radiation_data != null && this.state.radiation_data.length > 0){
      this.state.radiation_data.map(item => {
        if (item.classific_item.is_all_angiography == 1)  check_all_flag = true;
        if(item.method_item != undefined && item.method_item.is_angiography == 1){
          check_flag = true;
        }        
      })
    }
    if (check_all_flag == true || check_flag == true) {
      this.use_items = [
        {label:'造影剤を使用する', value:0},
      ];
    } else {
      this.use_items = [
        {label:'造影剤を使用する', value:0},
        {label:'依頼医の責任において造影実施', value:1},
        {label:'使用しない', value:2},
      ];
    }
  }

  changeBackground = () => {
    if (this.state.radiation_id == 8){
      harukaValidate('karte', 'radiation', 'other_shoot', this.state, 'background');
    } else {
      harukaValidate('karte', 'radiation', 'radiation', this.state, 'background');
    }
  }

  initRedBorder = () => {
    removeRedBorder('radiation_data_id');
    removeRedBorder('free_comment_id');
    removeRedBorder('etc_comment_id');
    removeRedBorder('request_comment_id');
  }

  checkValidation = () => {
    this.initRedBorder();
    let error_str_arr = [];
    let first_tag_id = '';
    let validate_data = '';
    if (this.state.radiation_id == 8){
      validate_data = harukaValidate('karte', 'radiation', 'other_shoot', this.state);
    } else {
      validate_data = harukaValidate('karte', 'radiation', 'radiation', this.state);
    }

    if (validate_data.error_str_arr.length > 0) {
      error_str_arr = validate_data.error_str_arr;
    }
    if (validate_data.first_tag_id != '') {
      first_tag_id = validate_data.first_tag_id;
    }
    this.change_flag = 1;
    this.setState({first_tag_id});
    return error_str_arr;
  }

  closeAlertModal = () => {
    this.setState({ alert_message: '' });
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null){
      $('#' + first_tag_id).focus()
    }
  }

  closeWarnModal = () => {
    this.setState({alert_messages:""})
  }

  save = (done_flag = 0) => {    
    if (!this.context.$canDoAction(this.context.FEATURES.RADIATION, this.context.AUTHS.DONE_OREDER) && done_flag === 1){
      this.setState({alert_messages:'実施権限がありません。'});
      return;
    }
    let error_str_array = this.checkValidation()

    if (error_str_array.length > 0) {
      this.setState({ alert_message: error_str_array.join('\n') })
      return;
    }
    if (this.state.enable_contrast_medium_interview_sheet){
      if (this.state.radiation_id == 3 || this.state.radiation_id == 4 || this.state.radiation_id == 2 || this.state.radiation_id == 1){
        if (this.state.inquiry_id == 2 && this.state.use_id != 2){
          this.setState({alert_messages:'造影剤問診票を選択してください'});
          return;
        }
      }
    }

    // if (this.state.radiation_id == 3 || this.state.radiation_id == 4 || this.state.radiation_id == 2){
    //   if (this.state.use_id == 0 || this.state.use_id ==1){      
    //     if (this.state.item_details != undefined && this.state.item_details != null && this.state.item_details.length > 0){
    //       var detail_flag = false;
    //       this.state.item_details.map((item) => {
    //         if(item.item_id != 0){              
    //           if (item.tele_type != 2 && (item.value1 == undefined || item.value1 == '') && (item.value2 == undefined || item.value2 == null || item.value2 == '')){
    //             detail_flag = true;
    //             window.sessionStorage.setItem("alert_messages", '品名の数量を入力してください。');              
    //           }
    //         }
    //       })
    //       if (detail_flag) return;
    //     }      
    //   }
    // }    

    this.setState({
      isUpdateConfirmModal:true,
      confirm_message:'登録しますか？',
      done_flag,
    })
  }

  saveData = (done_flag = 0) => {
    this.confirmCancel();
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let radiations = {};
    radiations['number'] = this.state.number;
    radiations['isForUpdate'] = this.state.isForUpdate;
    if(this.state.isForUpdate === 1 && this.props.cache_index != null){
      let cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.RADIATION_EDIT, this.props.cache_index);
      if(cache_data !== undefined && cache_data != null && cache_data.last_doctor_code !== undefined){
        radiations.last_doctor_code = cache_data.last_doctor_code;
        radiations.last_doctor_name = cache_data.last_doctor_name;
      }
      if (this.props.cache_data !== undefined && this.props.cache_data != null){
        cache_data = JSON.parse(JSON.stringify(this.props.cache_data));
        radiations.last_doctor_code = cache_data.doctor_code;
        radiations.last_doctor_name = cache_data.doctor_name;
      }
    }
    radiations['done_order'] = this.state.done_order;
    radiations['radiation_id'] = this.state.radiation_id;
    radiations['created_at'] = this.state.created_at;
    radiations['karte_status'] = this.state.karte_status;
    if(done_flag === 1){
      radiations['done_order'] = done_flag;
    }
    radiations['radiation_name'] = this.state.type;
    radiations['portable_shoot'] = this.state.portable_shoot;     //ポータブル撮影
    radiations['open_flag'] = 1;
    radiations['radiation_data'] = this.state.radiation_data;
    radiations['is_emergency'] = this.state.is_emergency;
    radiations['system_patient_id'] = this.state.patientId;
    radiations['etc_comment'] = this.state.etc_comment;
    radiations['body_part'] = this.state.body_part;
    radiations['sick_name'] = this.state.sick_name;
    radiations['request_comment'] = this.state.request_comment;
    radiations['doctor_code'] = authInfo.staff_category == 1 ? authInfo.doctor_code : this.context.selectedDoctor.code;
    radiations['doctor_name'] = authInfo.staff_category == 1 ? authInfo.name : this.context.selectedDoctor.name;
    radiations['department_id'] = this.context.department.code == 0 ? 1 : this.context.department.code;
    radiations['imgBase64'] = this.state.imgBase64;
    radiations['image_path'] = this.state.image_path;
    if (authInfo.staff_category != 1){
      radiations['substitute_name'] = authInfo.name;
    }
    //others data
    if (this.state.radiation_id ==1){
      // radiations['film_output'] = this.state.film_output;
      // radiations['film_output_id'] = this.state.film_output_id;
      radiations['kind'] = this.state.kind;
      radiations['kind_id'] = this.state.kind_id;
      radiations['move'] = this.state.move;
      radiations['move_id'] = this.state.move_id;
      radiations['inquiry'] = this.state.inquiry;
      if (this.state.enable_contrast_medium_interview_sheet){
        radiations['inquiry_id'] = this.state.inquiry_id;
      }
      radiations['use'] = this.state.use;
      radiations['use_id'] = this.state.use_id;
      if (this.state.use_id == 0 || this.state.use_id ==1){
        let details = [];
        if (this.state.item_details != undefined && this.state.item_details != null && this.state.item_details.length > 0){
          this.state.item_details.map((item) => {
            if(item.item_id !== 0){
              let detail_row = {};
              Object.keys(item).map(idx=>{
                detail_row[idx] = item[idx];
              });
              details.push(detail_row);
            }
          })
        }
        radiations['details'] = details;
        radiations['obtain_tech'] = this.state.obtain_tech;
        radiations['obtain_tech_id'] = this.state.obtain_tech_id;
      }

      // radiations['filmsend'] = this.state.filmsend;
      // radiations['filmsend_id'] = this.state.filmsend_id;
      radiations['selected_instructions'] = [];
      Object.keys(this.state.instructions_check).map((index) => {
        if(this.state.instructions_check[index]) {
          let item = {number:index, name:this.state.instructions[index].name};
          radiations['selected_instructions'].push(item);
        }
      });
      // radiations['selected_shootings'] = [];
      // Object.keys(this.state.shootings_check).map((index) => {
      //   if(this.state.shootings_check[index]) {
      //     let item = {number:index, name:this.state.shootings[index].name};
      //     radiations['selected_shootings'].push(item);
      //   }
      // })
    }

    if (this.state.height_weight_flag){
      radiations['height'] = this.state.height;
      radiations['weight'] = this.state.weight;
      radiations['surface_area'] = this.state.surface_area;
      radiations['formula'] = this.state.formula;
      radiations['formula_id'] = this.state.formula_id;
    }

    if (this.state.radiation_id == 3 || this.state.radiation_id == 4 || this.state.radiation_id == 2){
      radiations['inquiry'] = this.state.inquiry;
      if (this.state.enable_contrast_medium_interview_sheet){
        radiations['inquiry_id'] = this.state.inquiry_id;
      }
      radiations['use'] = this.state.use;
      radiations['use_id'] = this.state.use_id;
      if (this.state.use_id == 0 || this.state.use_id ==1){
        let details = [];
        if (this.state.item_details != undefined && this.state.item_details != null && this.state.item_details.length > 0){
          this.state.item_details.map((item) => {
            if(item.item_id !== 0){
              let detail_row = {};
              Object.keys(item).map(idx=>{
                detail_row[idx] = item[idx];
              });
              details.push(detail_row);
            }
          })
        }
        radiations['details'] = details;
        radiations['obtain_tech'] = this.state.obtain_tech;
        radiations['obtain_tech_id'] = this.state.obtain_tech_id;
      }
    }
    if (this.state.radiation_id != 3 && this.state.radiation_id != 2 && this.state.radiation_id != 1 &&  this.state.radiation_id != 8){
      radiations['pregnancy'] = this.state.pregnancy;
      radiations['pregnancy_id'] = this.state.pregnancy_id;
    }

    if (this.state.radiation_id == 8){          //他医撮影診断
      radiations['selected_kind_id'] = this.state.selected_kind_id;
      radiations['other_kind'] = this.state.other_kind;
      radiations['selected_kind_detail_id'] = this.state.selected_kind_detail_id;
      radiations['other_kind_detail'] = this.state.other_kind_detail;
      radiations['free_comment'] = this.state.free_comment;
      radiations['other_body_part'] = this.state.other_body_part;
    }

    //--------------------------------------------------------------------
    if(this.state.gensa_date === '' || this.state.not_yet === true){
      radiations['treat_date'] = "日未定";
    } else {
      radiations['treat_date'] = formatDateLine(this.state.gensa_date);
      if(this.state.reserve_time !== ""){
        radiations['reserve_time'] = this.state.reserve_time == null ? "時間未定" : this.state.reserve_time;
        radiations['reserve_data'] = this.state.reserve_data;
      }
    }

    //加算項目------------------------------
    if(this.state.additions !== undefined && this.state.additions != null && Object.keys(this.state.additions_check).length > 0){
      radiations['additions'] = {};
      Object.keys(this.state.additions_check).map(key => {
        if (this.state.additions_check[key]){
          this.state.additions.map(addition => {
            if (addition.addition_id == key){
              addition['sending_flag'] = 2;
              if(addition.sending_category === 1){
                addition['sending_flag'] = 1;
              }
              if(addition.sending_category === 3 && this.state.additions_send_flag_check[key]){
                addition['sending_flag'] = 1;
              }
              if (this.state.radiation_id != 3 || addition.addition_id != 7271){
                radiations['additions'][key] = addition;
              } else {
                if (this.state.use_id == 0){
                  radiations['additions'][key] = addition;
                }
              }
            }
          });
        }
      })
    }
    //-------------------------------------

    //---------------------
    if (this.state.receipt_keys != undefined && this.state.receipt_keys != null && this.state.receipt_keys.length > 0){
      radiations['receipt_keys'] = this.state.receipt_keys;
    }
    if (this.state.item_id_groups != undefined && this.state.item_id_groups != null && this.state.item_id_groups.length > 0){
      radiations['item_id_groups'] = this.state.item_id_groups;
    }
    if(this.props.cache_index != null){
      karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.RADIATION_EDIT, this.props.cache_index, JSON.stringify(radiations), 'insert');
    } else {
      karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.RADIATION_EDIT, new Date().getTime(), JSON.stringify(radiations), 'insert');
    }
    this.props.closeModal();
    this.context.$setExaminationOrderFlag(1);
  }

  getRequestComment = (e) => {
    this.change_flag = 1;
    this.setState({request_comment:e.target.value})
  }

  getFreeComment  = (e) => {
    this.change_flag = 1;
    this.setState({free_comment:e.target.value})
  }

  setNodate = () => {
    this.change_flag = 1;
    this.setState({
      gensa_date: '',
      not_yet: true,
      placeholder:'日未定',
      is_emergency:0,
      reserve_time:"",
      isOpenReserveCalendar: false
    });
  };

  handleClick = (e, index) => {
    if (e.type === "contextmenu"){
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
        .getElementById("radiation_data_id")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById("radiation_data_id")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX -$('#radiation').offset().left,
          y: e.clientY -$('#radiation').offset().top - 40,
          index: index,
        },
      });
    }
  };

  contextMenuAction = (act, index) => {
    if( act === "edit") {
      var temp = this.state.radiation_data;
      var temp_id_groups = this.state.item_id_groups;
      var swap_temp = temp[0];
      var swap_temp_id_group = temp_id_groups[0];

      temp[0] = temp[index];
      temp_id_groups[0] = temp_id_groups[index];

      temp[index] = swap_temp;
      temp_id_groups[index] = swap_temp_id_group;

      var selected_classific_item = this.state.radiation_classific_data.find(x=>x.radiation_shooting_classific_id == parseInt(temp[0].classfic_id));
      var display_part_data = this.state.radiation_part_data.filter(x=>x.radiation_shooting_classific_id == parseInt(temp[0].classfic_id));
      var selected_part_item = this.state.radiation_part_data.find(x=>x.radiation_part_id == parseInt(temp[0].part_id));
      var display_direction_data = this.state.radiation_direction_data.filter(x=>x.radiation_part_id == parseInt(temp[0].part_id));
      var display_method_data = this.state.radiation_method_data.filter(x=>x.radiation_part_id == parseInt(temp[0].part_id));
      var selected_method_item = this.state.radiation_method_data.find(x=>x.radiation_method_id == parseInt(temp[0].method_id));
      var display_comment_data = this.state.radiation_comment_data.filter(x=>x.radiation_part_id == parseInt(temp[0].part_id));
      var radiation_left_right_data = (selected_part_item != undefined && selected_part_item.radiation_left_right_flag ==1)?this.state.origin_radiation_left_right_data:[];
      var directions_check = {};
      if (display_direction_data != undefined){
        display_direction_data.map(item => {
          if (temp[0].selected_directions[item.radiation_direction_id] != undefined && temp[0].selected_directions[item.radiation_direction_id] != null && temp[0].selected_directions[item.radiation_direction_id] != ''){
            directions_check[item.radiation_direction_id] = true;
          } else {
            directions_check[item.radiation_direction_id] = false;
          }
        })
      }
      var comments_check = {};
      if (display_comment_data != undefined){
        display_comment_data.map(item => {
          if (temp[0].selected_comments[item.radiation_shooting_comment_id] != undefined && temp[0].selected_comments[item.radiation_shooting_comment_id] != null && temp[0].selected_comments[item.radiation_shooting_comment_id] != ''){
            comments_check[item.radiation_shooting_comment_id] = true;
          } else {
            comments_check[item.radiation_shooting_comment_id] = false;
          }
        })
      }
      this.setState({
        edit_flag:true,
        radiation_data:temp,
        item_id_groups:temp_id_groups,
        display_part_data,
        display_direction_data,
        display_method_data,
        display_comment_data,

        selected_classific_id:temp[0].classfic_id,
        selected_classific_name:temp[0].classfic_name,
        selected_classific_item,
        selected_part_id:temp[0].part_id,
        selected_part_name:temp[0].part_name,
        selected_part_item,
        selected_method_id:temp[0].method_id,
        selected_method_name:temp[0].method_name,
        selected_method_item,
        selected_left_right_id:temp[0].left_right_id,
        selected_left_right_name:temp[0].left_right_name,
        shoot_count:temp[0].shoot_count,
        sub_picture:temp[0].sub_picture,
        direction_count:temp[0].direction_count,
        directions_check,
        comments_check,
        radiation_left_right_data,
        selected_item_order_number:temp[0].order_number
      })
    } else if (act === "delete") {
      this.setState({
        isDeleteConfirmModal : true,
        selected_index:index,
        confirm_message:"このデータを削除しますか?",
      })
    }
  };

  confirmCancel() {
    this.setState({
      isDeleteConfirmModal: false,
      isUpdateConfirmModal:false,
      confirm_message: "",
      confirm_type: "",
    });
  }

  deleteData = () => {
    this.confirmCancel();
    var temp = this.state.radiation_data;    
    var temp_item_ids = this.state.item_id_groups;
    temp.splice(this.state.selected_index, 1);
    temp_item_ids.splice(this.state.selected_index, 1);
    this.exist_portable_shoots = false;
    
    // var classfic_ids = [];
    if (temp.length > 0){
      temp.map(item => {
        var part_id = item.part_id;
        var radiation_part_data = this.state.radiation_part_data;
        var part_item = radiation_part_data.filter(x => x.radiation_part_id == part_id);
        if (part_item.length > 0 && part_item[0].can_portable_radiography) this.exist_portable_shoots = true;
        // classfic_ids.push(item.classfic_id);
      })
    }
    this.change_flag = 1;
    this.setState({
      radiation_data:temp,
      item_id_groups:temp_item_ids,
      portable_shoot:this.exist_portable_shoots == false? false: this.state.portable_shoot,      
    }, () => {
      this.getContrastList(this.state.item_id_groups);
      
      this.checkAngiography();
      if (this.use_items.length == 1){
        this.default_use_flag = true;
        this.setState({
          use_id:0,
          use:'造影剤を使用する',
        })
      } else {
        this.default_use_flag = false;
      }
    })
  };

  setItemDetails =(data)=>{
    this.change_flag = 1;
    this.setState({item_details:data});
  }

  getAdditions = (name, number) => {
    let check_status = {};
    if (name == 'additions') {
      check_status = this.state.additions_check;
      check_status[number] = !check_status[number];
      this.change_flag = 1;
      this.setState({additions_check:check_status});
    }
  }

  getAdditionsSendFlag = (name, number) => {
    let check_status = {};
    if (name == 'additions_sending_flag') {
      check_status = this.state.additions_send_flag_check;
      check_status[number] = !check_status[number];
      this.change_flag = 1;
      this.setState({additions_send_flag_check:check_status});
    }
  }

  getFormula = e => {
    this.change_flag = 1;
    this.setState({formula:e.target.value, formula_id:e.target.id}, () => {
      this.calculateSurface(this.state.formula);
    })
  }

  selectDirection = (index,e) => {
    var temp = this.state.radiation_data;
    temp[index].direction_id = e.target.id;
    this.change_flag = 1;
    this.setState({radiation_data:temp});
  };
  selectComment = (index,e) => {
    var temp = this.state.radiation_data;
    temp[index].comment_id = e.target.id;
    this.change_flag = 1;
    this.setState({radiation_data:temp});
  };

  openBodyPart = () => {
    this.setState({
      isBodyPartOpen: true,
    })
  };

  closeBodyParts = () =>
    this.setState({ isBodyPartOpen: false });
  bodyPartConfirm = value => {
    this.setState({
      isBodyPartOpen: false,
      other_body_part: value
    })
  };

  selectOtherKind(kind_id, other_kind){
    this.change_flag = 1;
    var temp = this.state.other_kind_detail_data;
    var display_other_kind_details = temp.filter(x=>x.kind_id == parseInt(kind_id));
    this.setState({
      selected_kind_id:parseInt(kind_id),
      selected_kind_detail_id:0,
      display_other_kind_details,
      other_kind:other_kind,
    })
  }

  selectDetail(kind_detail_id, other_kind_detail){
    this.change_flag = 1;
    this.setState({selected_kind_detail_id:kind_detail_id, other_kind_detail:other_kind_detail})
  }

  setEmergency = () => {
    let is_emergency = this.state.is_emergency;
    this.change_flag = 1;
    if(is_emergency === 1){
      this.setState({
        is_emergency:0,
      });
    } else {
      this.setState({
        is_emergency:1,
        gensa_date:new Date(),
        not_yet: false,
        placeholder:'',
        reserve_time:"",
      });
    }
  };

  openSelectItem = () => {
    this.setState({isItemSelectModal:true});
  };

  confirmClearObtain=()=>{
    if(this.state.obtain_tech == ""){
      return;
    }
    this.setState({
      isClearConfirmModal:true,
      confirm_message:"造影剤注入手技を削除しますか？"
    });
  }

  clearObtain = () => {
    this.change_flag = 1;
    this.setState({
      obtain_tech:'',
      obtain_tech_id:0,
      confirm_message:"",
      isClearConfirmModal:false,
    });
  };

  setItemName = (item) => {
    this.change_flag = 1;
    this.setState({obtain_tech:item.name, obtain_tech_id:item.item_id});
    this.closeModal();
  };

  openKnowledgeSetModal=()=>{
    this.setState({openKnowledgeSetModal:true});
  };

  openReserveCalendar = () => {
    this.setState({isOpenReserveCalendar: true});
  };

  closeCalendarModal = () => {
    this.setState({isOpenReserveCalendar: false});
  };

  setReserveDateTime = (date, time, reserve_data) => {
    if(date == null){
      this.setNodate();
      return;
    }
    this.change_flag = 1;
    this.setState({
      gensa_date: new Date(date),
      reserve_time: time,
      not_yet: false,
      placeholder:'',
      reserve_data,
      isOpenReserveCalendar: false
    });
  };

  handleOk = () => {
    this.setState({
      isOpenShemaModal: false
    });
  }

  closeShemaModal = () => {
    this.setState({
      isOpenShemaModal: false
    })
  }

  registerImage = (img_base64) => {
    this.change_flag = 1;
    this.setState({
      imgBase64: img_base64,
      isOpenShemaModal: false
    });
  }

  confirmCloseModal=()=>{
    if(this.change_flag == 1){
      this.setState({
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type:"close",
        confirm_alert_title:'入力中',
      });
    } else {
      this.confirmDeleteCache();
    }
  }
  confirmDeleteCache=()=>{
      this.props.closeModal();
  };

  setRecentOrder = (item) => {
    this.closeModal();
    var part_data = this.state.radiation_part_data;
    var selected_classific_item = this.state.radiation_classific_data.find(x=>x.radiation_shooting_classific_id == item.classfic_id);
    var selected_part_item = part_data.find(x=>x.radiation_part_id == item.part_id);
    var display_part_data = part_data.filter(x=>x.radiation_shooting_classific_id == parseInt(item.classfic_id));
    var directions_check = {};
    var display_direction_data = this.state.radiation_direction_data.filter(x=>x.radiation_part_id == item.part_id);
    if (display_direction_data != undefined){
      display_direction_data.map(sub_item => {
        if (item.selected_directions.includes(sub_item.radiation_direction_id)){
          directions_check[sub_item.radiation_direction_id] = true;
        } else {
          directions_check[sub_item.radiation_direction_id] = false;
        }
      })
    }

    var comments_check = {};
    var display_comment_data = this.state.radiation_comment_data.filter(x=>x.radiation_part_id == item.part_id);
    if (display_comment_data != undefined){
      display_comment_data.map(sub_item => {
        if (item.selected_comments.includes(sub_item.radiation_shooting_comment_id)){
          comments_check[sub_item.radiation_shooting_comment_id] = true;
        } else {
          comments_check[sub_item.radiation_shooting_comment_id] = false;
        }
      })
    }
    var display_method_data = this.state.radiation_method_data.filter(x=>x.radiation_part_id == item.part_id);
    var radiation_left_right_data = [];
    if (selected_part_item.radiation_left_right_flag == 1){
      radiation_left_right_data = this.state.origin_radiation_left_right_data;
    }

    this.setState({
      selected_classific_id : item.classfic_id,
      selected_classific_name : item.classfic_name,
      selected_classific_item,
      selected_part_id : item.part_id,
      selected_part_name: item.part_name,
      selected_part_item,
      selected_method_id : item.method_id,
      selected_method_name: item.method_name,
      selected_left_right_id:item.left_right_id,
      selected_left_right_name:item.left_right_name,

      radiation_left_right_data,
      display_part_data,
      display_method_data,
      display_comment_data,
      display_direction_data,
      directions_check,
      comments_check,
    })
  }

  checkPortable = (name, value) => {
    if (name == 'portable_shoot'){
      var radiation_data = this.state.radiation_data;
      var receipt_keys = [];
      var classfic_ids = [];
      if (radiation_data.length > 0){
        radiation_data.map(item => {
          classfic_ids.push(item.classfic_id);
          if (item.classific_item != undefined && item.classific_item != null && item.classific_item.receipt_key != null) receipt_keys.push(item.classific_item.receipt_key.split(','));
          if (item.classific_item != undefined && item.classific_item != null && item.classific_item.receipt_key_if_use_contrast_medium != null) receipt_keys.push(item.classific_item.receipt_key_if_use_contrast_medium.split(','));
          if (item.method_item != undefined && item.method_item != null && item.method_item.receipt_key != null) receipt_keys.push(item.method_item.receipt_key.split(','));
          var part_id = item.part_id;
          var radiation_part_data = this.state.radiation_part_data;
          var part_item = radiation_part_data.filter(x => x.radiation_part_id == part_id);
          if (part_item.length == 1){
            if (value) {
              if (part_item[0].can_portable_radiography){
                if (part_item[0].receipt_key_if_portable != null) receipt_keys.push(part_item[0].receipt_key_if_portable.split(','));
              } else {
                if (part_item[0].receipt_key != null) receipt_keys.push(part_item[0].receipt_key.split(','));
              }
            } else {
              if (part_item[0].receipt_key != null) receipt_keys.push(part_item[0].receipt_key.split(','));
            }
          }
        })
      }      

      if (receipt_keys.length > 0 ){
        this.setState({
          receipt_keys,
          portable_shoot:value,
          item_id_groups:[],
        }, () => {
          this.addContrastMedium(this.state.receipt_keys, classfic_ids);
        })
      } else {
        this.setState({
          receipt_keys,
          portable_shoot:value,
        })
      }
    }
  }

  convertItemDetails = (item_details) => {
    if (item_details == undefined || item_details == null) return item_details;
    item_details.map(val => {
      val['classfic'] = 9;
      val['classfic_name'] = '造影剤'
      // val['item_id'] = val.item_id;
      val['item_name'] = val.name;
      if(val.input_item1_flag === 1){
          val['attribute1'] = val.input_item1_attribute;
          val['format1'] = val.input_item1_format;
          val['unit_name1'] = val.input_item1_unit;
          val['max_length1'] = val.input_item1_max_length;
          if(val['attribute1'] === 4){
              val['value1'] = formatDateLine(new Date());
              let cur_date = new Date(val['value1']);
              let cur_year = cur_date.getFullYear();
              let cur_month = cur_date.getMonth() + 1;
              let cur_day = cur_date.getDate();
              val['value1_format'] = this.japan_year_list.find(x => x.id === cur_year).value + '年' + cur_month + '月' + cur_day + '日';
          }
      }
      if(val.input_item2_flag === 1){
          val['attribute2'] = val.input_item2_attribute;
          val['format2'] = val.input_item2_format;
          val['unit_name2'] = val.input_item2_unit;
          val['max_length2'] = val.input_item2_max_length;
          if(val['attribute2'] === 4){
              val['value2'] = formatDateLine(new Date());
              let cur_date = new Date(val['value2']);
              let cur_year = cur_date.getFullYear();
              let cur_month = cur_date.getMonth() + 1;
              let cur_day = cur_date.getDate();
              val['value2_format'] = this.japan_year_list.find(x => x.id === cur_year).value + '年' + cur_month + '月' + cur_day + '日';
          }
      }
    })
    
    return item_details;
  }

  render() {    
    let {formula_list} = this.state;    
    let addition_count_01 = 0;
    if (this.state.additions != undefined && this.state.additions != null && this.state.additions.length > 0 &&  this.state.radiation_id == 3) {
      this.state.additions.map(addition => {
        if (addition.addition_id != 7271){
          addition_count_01 ++;
        }
        // if (addition.addition_id == 7271 && addition.sending_category ==3 && this.state.use_id ==0){     //造影剤加算（ＣＴ）
        //   addition_count_01 ++;
        // }
      });
    }

    let addition_count_02 = 0;
    if (this.state.additions != undefined && this.state.additions != null && this.state.additions.length > 0 &&  this.state.radiation_id == 3) {
      this.state.additions.map(addition => {
        if (addition.addition_id != 7271){
          addition_count_02 ++;
        }
        // if (addition.addition_id == 7271 && addition.sending_category ==3 && this.state.use_id ==0){     //造影剤加算（ＣＴ）
        //   addition_count_02 ++;
        // }
      });
    }

    this.check_can_add_flag = true;

    if (this.state.radiation_classific_data == undefined || this.state.radiation_classific_data == null || 
      !(this.state.radiation_classific_data.length > 0) || !(this.state.selected_classific_id > 0)){
        this.check_can_add_flag = false;
    }
    return (
      <>
        <Modal
          show={true}
          id="radiation"
          className="custom-modal-sm patient-exam-modal radiation-modal first-view-modal"
        >
          <Modal.Header>
            <Header>
              <Modal.Title>
                {this.state.type}
                {this.props.radiation_id>0 && this.props.radiation_id != 8 && (
                  <>
                  <Button className="red-btn" onClick={this.handleShema} style={{position:'absolute', right:'16px'}}>シェーマ</Button>
                  <Button className="red-btn" onClick={this.openKnowledgeSetModal} style={{position:'absolute', right:'110px'}}>ナレッジセット</Button>
                  </>
                )}
              </Modal.Title>
            </Header>
          </Modal.Header>
          <Modal.Body style={{overflowY:'auto'}}>
            <DatePickerBox style={{height:'100%', width:'100%'}}>
              <Wrapper >
                {!(this.state.radiation_id > 0) && (
                  <div style={{height:'100%',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  </div>
                )}
                {this.state.radiation_id > 0 && this.state.radiation_id != 8 && (
                  <>
                    <div className="content">
                      <div className="items-select-area flex">
                        <div className="list">
                          <div className="sub-title">撮影区分</div>
                          <div className="list-items">
                            {this.state.radiation_classific_data != undefined && this.state.radiation_classific_data != null && this.state.radiation_classific_data.length>0 && (
                              this.state.radiation_classific_data.map(item => {
                                return(
                                  <>
                                    <div className={this.state.selected_classific_id == item.radiation_shooting_classific_id ? 'row-item selected' : 'row-item'} onClick={this.selectClassfic.bind(this, item)}>
                                      {item.radiation_shooting_classific_name}
                                    </div>
                                  </>
                                )
                              })
                            )}
                          </div>
                        </div>
                        <div className="list">
                          <div className="sub-title">部位</div>
                          <div className="list-items">
                            {this.state.display_part_data != undefined && this.state.display_part_data != null && this.state.display_part_data.length>0 &&(
                              this.state.display_part_data.map(item => {
                                return(
                                  <>
                                    <div className={this.state.selected_part_id == item.radiation_part_id ? 'row-item selected' : 'row-item'} onClick={this.selectPart.bind(this, item)}>
                                      {item.radiation_part_name}
                                    </div>
                                  </>
                                )
                              })
                            )}
                          </div>
                        </div>
                        <div className="list">
                          <div className="sub-title">左右</div>
                          <div className="list-items">
                            {this.state.radiation_left_right_data != undefined && this.state.radiation_left_right_data != null && (
                              this.state.radiation_left_right_data.map(item => {
                                return(
                                  <>
                                    <div className={this.state.selected_left_right_id == item.radiation_left_right_id ? 'row-item selected' : 'row-item'} onClick={this.selectLeftRight.bind(this, item)}>
                                      {item.radiation_left_right_name}
                                    </div>
                                  </>
                                )
                              })
                            )}

                          </div>
                        </div>
                        <div className="list">
                          <div className="sub-title">方向</div>
                          <div className="list-items">
                            {this.state.display_direction_data != undefined && this.state.display_direction_data != null && this.state.display_direction_data.length > 0 && (
                              this.state.display_direction_data.map(item => {
                                return(
                                  <>
                                    <Checkbox
                                      label={item.radiation_direction_name}
                                      number = {item.radiation_direction_id}
                                      getRadio={this.getRadio}
                                      value = {this.state.directions_check[item.radiation_direction_id]}
                                      name="direction"
                                    />
                                  </>
                                )
                              })
                            )}
                          </div>
                        </div>
                        <div className="list">
                          <div className="sub-title">体位/方法</div>
                          <div className="list-items">
                            {this.state.display_method_data != undefined && this.state.display_method_data != null && this.state.display_method_data.length > 0 && (
                              this.state.display_method_data.map(item => {
                                return(
                                  <>
                                    <div className={this.state.selected_method_id == item.radiation_method_id ? 'row-item selected' : 'row-item'} onClick={this.selectMethod.bind(this, item)}>
                                      {item.radiation_method_name}
                                    </div>
                                  </>
                                )
                              })
                            )}
                          </div>
                        </div>
                        <div className="list">
                          <div className="sub-title">撮影コメント</div>
                          <div className="list-items">
                            {this.state.display_comment_data != undefined && this.state.display_comment_data != null && this.state.display_comment_data.length > 0 && (
                              this.state.display_comment_data.map(item => {
                                return(
                                  <>
                                    <Checkbox
                                      label={item.radiation_shooting_comment_name}
                                      number = {item.radiation_shooting_comment_id}
                                      getRadio={this.getRadio}
                                      value = {this.state.comments_check[item.radiation_shooting_comment_id]}
                                      name="comments"
                                    />
                                  </>
                                )
                              })
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-select-area" style={{borderLeft:'none'}}>
                        {this.state.shoot_count_flag && (
                          <div className={'block-area'} style={{width:"16%"}}>
                            <div className={'block-title'}>撮影回数</div>
                            <div className="count-area">
                              <NumericInputWithUnitLabel
                                unit={'回'}
                                maxLength={ 4 }
                                max={9999}
                                min = {0}
                                className="form-control"
                                value={this.state.shoot_count}
                                getInputText={this.selectCount.bind(this, "shoot")}
                                inputmode="numeric"
                                disabled = {this.count_is_force_disabled || (this.state.display_direction_data != undefined && this.state.display_direction_data.length > 0)?true:false}
                              />
                            </div>
                          </div>
                        )}
                        {this.state.sub_picture_flag && (
                          <div className={'block-area'} style={{width:"16%"}}>
                            <div className={'block-title'}>分画数</div>
                            <div className="count-area">
                              <NumericInputWithUnitLabel
                                unit={''}
                                maxLength={ 4 }
                                max={9999}
                                min = {0}
                                className="form-control"
                                value={this.state.sub_picture}
                                getInputText={this.selectCount.bind(this, "picture")}
                                inputmode="numeric"
                              />
                            </div>
                          </div>
                        )}
                        {this.state.direction_count_flag && (
                          <div className={'block-area'} style={{width:"16%"}}>
                            <div className={'block-title'}>方向数</div>
                            <div className="count-area">
                              <NumericInputWithUnitLabel
                                unit={''}
                                maxLength={ 4 }
                                className="form-control"
                                max={9999}
                                min = {0}
                                value={this.state.direction_count}
                                getInputText={this.selectCount.bind(this, "direction")}
                                inputmode="numeric"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="button-area flex">
                        <Button className ={this.state.edit_flag || this.check_can_add_flag == false?"button-add disabled":"button-add"} onClick = {this.addToTable.bind(this)}>↓追加</Button>
                        <Button className ={this.state.edit_flag?"button-update":"disabled button-update"} onClick = {this.editToTable.bind(this)}>変更確定</Button>
                        <Button className ={this.state.edit_flag?"button-stop":"disabled button-stop"} onClick = {this.doneEdit.bind(this)}>変更中止</Button>
                      </div>
                      <div className="table-area">
                        <table className="table-scroll table table-bordered">
                          <thead>
                          <tr>
                            <th className={'item-no'} />
                            <th className={'classfic_name'}>撮影区分</th>
                            <th className={'part_name'}>部位</th>
                            <th className={'left_right_name'}>左右</th>
                            <th className={'selected_directions'}>方向</th>
                            <th className={'method_name'}>体位/方法</th>
                            <th className={'selected_comments'}>撮影コメント</th>
                            <th className={'sema'}>シェーマ</th>
                            {this.state.shoot_count_flag && (
                              <th className={'shoot_count'}>撮影回数</th>
                            )}
                            {this.state.sub_picture_flag && (
                              <th className={'sub_picture'}>分画数</th>
                            )}
                            {this.state.direction_count_flag && (
                              <th className={'direction_count'}>方向数</th>
                            )}
                          </tr>
                          </thead>
                          <tbody id = "radiation_data_id">
                          {this.state.radiation_data != undefined && this.state.radiation_data != null && this.state.radiation_data.length>0 &&(
                            this.state.radiation_data.map((item, index) => {
                              return(
                                <>
                                  <tr onContextMenu={e => this.handleClick(e,index)} className={(this.state.edit_flag && index==0)?"selected":""}>
                                    <td className={'item-no text-right'}>{index+1}</td>
                                    <td className={'classfic_name'}>{item.classfic_name}</td>
                                    <td className={'part_name'}>{item.part_name}</td>
                                    <td className={'left_right_name'}>{item.left_right_name}</td>
                                    <td className='selected_directions td-selectbox'>
                                      {Object.keys(item.selected_directions).length == 1 && item.selected_directions[Object.keys(item.selected_directions)[0]]}
                                      {Object.keys(item.selected_directions).length > 1 && (
                                        <>
                                          <SelectorWithLabelIndex
                                            options={item.selected_directions}
                                            getSelect={this.selectDirection.bind(this)}
                                            departmentEditCode={item.direction_id}
                                          />
                                        </>
                                      )}
                                    </td>
                                    <td className={'method_name'} >{item.method_name}</td>
                                    <td className='selected_comments td-selectbox'>
                                      {Object.keys(item.selected_comments).length == 1 && item.selected_comments[Object.keys(item.selected_comments)[0]]}
                                      {Object.keys(item.selected_comments).length > 1 && (
                                        <>
                                          <SelectorWithLabelIndex
                                            options={item.selected_comments}
                                            getSelect={this.selectComment.bind(this)}
                                            departmentEditCode={item.comment_id}
                                          />
                                        </>
                                      )}
                                    </td>
                                    <td className={'sema'}></td>
                                    {this.state.shoot_count_flag && (
                                      <td className={'shoot_count text-right'}>{item.shoot_count}</td>
                                    )}
                                    {this.state.sub_picture_flag && (
                                      <td className={'sub_picture text-right'}>{item.sub_picture}</td>
                                    )}
                                    {this.state.direction_count_flag && (
                                      <td className={'direction_count text-right'}>{item.direction_count}</td>
                                    )}
                                  </tr>
                                </>
                              )
                            })
                          )}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex">
                        <div className="left">
                          <RegionBottom
                            etc_comment={this.state.etc_comment}
                            getEtcComment={this.getEtcComment.bind(this)}
                            sick_name={this.state.sick_name}
                            getSickName={this.getSickName.bind(this)}
                            special_presentation={this.state.special_presentation}
                            getSpecialPresentation={this.getSpecialPresentation.bind(this)}
                            system_patient_id={this.state.patientId}
                          />

                          <fieldset className="blog radio-area">
                            <legend>依頼コメント(定型コメント)</legend>
                            <div className="div-textarea">
                              <textarea id='request_comment_id' onChange={this.getRequestComment.bind(this)} value={this.state.request_comment}></textarea>
                            </div>
                          </fieldset>
                          {this.state.radiation_id == 4 && (
                            <>
                              <div style={{fontSize:'0.9rem'}} className="">体内金属とは...脳クリップ・心臓人工弁・プレート・ステント・人工骨頭/関節・刺青などです</div>
                              <div style={{color:'red', fontSize:'0.9rem'}}>〇心臓ベースメーカー、人工内耳、可動義眼を使用している方は、MRI検査を受けることができません</div>
                            </>
                          )}
                        </div>
                        <div className="right">
                          {this.state.radiation_id == 1 && (
                            <>
                              <div className='flex'>
                                <div className={'block-area'} style={{width:'100%'}}>
                                  <div className={'block-title'}>区分</div>
                                  {this.state.kind_items.map((item) => {
                                    return(
                                      <>
                                        <div className='check-label'>
                                          <Radiobox
                                            id = {item.label}
                                            label={item.label}
                                            value={item.value}
                                            getUsage={this.getKind.bind(this)}
                                            checked={this.state.kind_id == item.value ? true : false}
                                            name={`kind`}
                                          />
                                        </div>
                                      </>
                                    )
                                  })}
                                </div>
                              </div>
                              <div className="flex">
                                <div className={'block-area'} style={{width:"50%"}}>
                                  <div className={'block-title'}>移動形態</div>
                                  {this.state.move_items.map(item => {
                                    return(
                                      <>
                                        <div className='check-label'>
                                          <Radiobox
                                            id = {item.label}
                                            label={item.label}
                                            value={item.value}
                                            getUsage={this.getMove.bind(this)}
                                            checked={this.state.move_id == item.value ? true : false}
                                            name={`move`}
                                          />
                                        </div>
                                      </>
                                    )
                                  })}
                                </div>

                                <div className={'block-area'} style={{marginLeft:"10px", width:"50%"}}>
                                  <div className={'block-title'}>撮影指示</div>
                                  <div className='check-label' style={{width:'100%'}}>
                                    <Checkbox
                                      label="技師判断で追加撮影可"
                                      number = {0}
                                      getRadio={this.getRadio}
                                      value = {this.state.instructions_check[0]}
                                      name="instruction"
                                    />
                                  </div>
                                </div>                              
                                {/* <div className={'block-area'} style={{marginLeft:"10px", width:"50%"}}>
                                  <div className={'block-title'}>フィルム出力</div>
                                  {this.state.film_output_items.map(item => {
                                    return(
                                      <>
                                        <div className='check-label'>
                                          <Radiobox
                                            id = {item.label}
                                            label={item.label}
                                            value={item.value}
                                            getUsage={this.getFilmOutput.bind(this)}
                                            checked={this.state.film_output_id == item.value ? true : false}
                                            name={`film_output`}
                                          />
                                        </div>
                                      </>
                                    )
                                  })}
                                </div> */}
                              </div>
                              {this.state.enable_contrast_medium_interview_sheet && (
                                <>
                                <div className={'block-area flex'}>
                                  <div className={'block-title'}>造影剤問診票</div>
                                  {this.state.inquiry_items.map(item => {
                                    return(
                                      <>
                                        <div className='check-label'>
                                          <Radiobox
                                            id = {item.label}
                                            label={item.label}
                                            value={item.value}
                                            getUsage={this.getInquiry.bind(this)}
                                            checked={this.state.inquiry_id == item.value ? true : false}
                                            name={`inquiry`}
                                          />
                                        </div>
                                      </>
                                    )
                                  })}
                                </div>
                                </>
                              )}                            
                              <div className={'block-area'}>
                                <div className={'block-title'}>造影剤使用</div>
                                {this.use_items.map(item => {
                                  return(
                                    <>
                                      <div className='use-label'>
                                        <Radiobox
                                          id = {item.label}
                                          label={item.label}
                                          value={item.value}
                                          getUsage={this.getUse.bind(this)}
                                          checked={this.state.use_id == item.value ? true : false}
                                          name={`use`}
                                        />
                                      </div>
                                    </>
                                  )
                                })}
                              </div>
                              {/* <div className="flex">
                                <div className={'block-area'} style={{width:"50%"}}>
                                  <div className={'block-title'}>妊娠</div>
                                  {this.state.pregnancy_items.map(item => {
                                    return (
                                      <>
                                        <div className='check-label'>
                                          <Radiobox
                                            id = {item.label}
                                            label={item.label}
                                            value={item.value}
                                            getUsage={this.getPregnancy.bind(this)}
                                            checked={this.state.pregnancy_id == item.value ? true : false}
                                            name={`pregnancy`}
                                          />
                                        </div>
                                      </>
                                    )
                                  })}
                                </div>
                                <div className={'block-area'} style={{marginLeft:"10px", width:"50%"}}>
                                  <div className={'block-title'}>撮影指示</div>
                                  <div className='check-label' style={{width:'100%'}}>
                                    <Checkbox
                                      label="技師判断で追加撮影可"
                                      number = {0}
                                      getRadio={this.getRadio}
                                      value = {this.state.instructions_check[0]}
                                      name="instruction"
                                    />
                                  </div>
                                </div>
                              </div> */}

                              {/* <div className="flex">
                                <div className={'block-area'} style={{width:"50%"}}>
                                  <div className={'block-title'}>フィルム搬送先</div>
                                  {this.state.filmsend_items.map(item => {
                                    return(
                                      <>
                                        <div className='check-label'>
                                          <Radiobox
                                            id = {item.label}
                                            label={item.label}
                                            value={item.value}
                                            getUsage={this.getFilmsend.bind(this)}
                                            checked={this.state.filmsend_id == item.value ? true : false}
                                            name={`filmsend`}
                                          />
                                        </div>
                                      </>
                                    )
                                  })}
                                </div>
                                <div className={'block-area'} style={{width:"50%"}}>
                                  <div className={'block-title'}>撮影</div>
                                  <div className='check-label'>
                                    <Checkbox
                                      label="ポータブル"
                                      number = {0}
                                      getRadio={this.getRadio}
                                      value = {this.state.shootings_check[0]}
                                      name="shooting"
                                    />
                                  </div>
                                  <div className='check-label'>
                                    <Checkbox
                                      label="手術ポータブル"
                                      number = {1}
                                      getRadio={this.getRadio}
                                      value = {this.state.shootings_check[1]}
                                      name="shooting"
                                    />
                                  </div>
                                </div>
                              </div> */}
                            </>
                          )}
                          {(this.state.radiation_id == 2 || this.state.radiation_id == 4 || this.state.radiation_id == 3) && (
                            <>
                              {this.state.radiation_id != 3 && this.state.radiation_id != 2 && (
                                <div className={'block-area flex'}>
                                  <div className={'block-title'}>妊娠</div>
                                  {this.state.pregnancy_items.map(item => {
                                    return (
                                      <>
                                        <div className='check-label'>
                                          <Radiobox
                                            id = {item.label}
                                            label={item.label}
                                            value={item.value}
                                            getUsage={this.getPregnancy.bind(this)}
                                            checked={this.state.pregnancy_id == item.value ? true : false}
                                            name={`pregnancy`}
                                          />
                                        </div>
                                      </>
                                    )
                                  })}
                                </div>
                              )}
                              {this.state.enable_contrast_medium_interview_sheet && (
                                <>
                                <div className={'block-area flex'}>
                                  <div className={'block-title'}>造影剤問診票</div>
                                  {this.state.inquiry_items.map(item => {
                                    return(
                                      <>
                                        <div className='check-label'>
                                          <Radiobox
                                            id = {item.label}
                                            label={item.label}
                                            value={item.value}
                                            getUsage={this.getInquiry.bind(this)}
                                            checked={this.state.inquiry_id == item.value ? true : false}
                                            name={`inquiry`}
                                          />
                                        </div>
                                      </>
                                    )
                                  })}
                                </div>
                                </>
                              )}
                              <div className={'block-area'}>
                                <div className={'block-title'}>造影剤使用</div>
                                {this.use_items.map(item => {
                                  return(
                                    <>
                                      <div className='use-label'>
                                        <Radiobox
                                          id = {item.label}
                                          label={item.label}
                                          value={item.value}
                                          getUsage={this.getUse.bind(this)}
                                          checked={this.state.use_id == item.value ? true : false}
                                          name={`use`}
                                        />
                                      </div>
                                    </>
                                  )
                                })}
                                {/* {(this.state.use_id == 0 || this.state.use_id ==1 ) && (
                                  <>
                                    <div style={{marginLeft:'30px'}} className="select-item-area">
                                      <label style={{width:'8rem'}}>造影剤注入手技</label>
                                      <div className={'input-box'} onClick = {this.openSelectItem.bind(this)}>{this.state.obtain_tech}</div>
                                      <Button type="mono" onClick={this.confirmClearObtain.bind(this)}>C</Button>
                                    </div>
                                    <div className={'set-detail-area'}>
                                      <ItemTableBody
                                        function_id={FUNCTION_ID_CATEGORY.RADIATION}
                                        item_details={this.state.item_details}
                                        setItemDetails={this.setItemDetails.bind(this)}
                                      />
                                    </div>
                                  </>
                                )} */}
                              </div>
                            </>
                          )}
                          {this.state.radiation_id == 6 && (
                            <>
                              <div className="flex">
                                <div className={'block-area'} style={{width:"50%"}}>
                                  <div className={'block-title'}>移動形態</div>
                                  {this.state.move_items.map(item => {
                                    return(
                                      <>
                                        <div className='check-label'>
                                          <Radiobox
                                            id = {item.label}
                                            label={item.label}
                                            value={item.value}
                                            getUsage={this.getMove.bind(this)}
                                            checked={this.state.move_id == item.value ? true : false}
                                            name={`move`}
                                          />
                                        </div>
                                      </>
                                    )
                                  })}
                                </div>
                                <div style={{marginLeft:"10px", width:"50%"}}>
                                  <div className={'block-area flex'}>
                                    <div className={'block-title'}>ヨードアレルギー</div>
                                    {this.state.key_items.map(item => {
                                      return(
                                        <>
                                          <div className='check-label'>
                                            <Radiobox
                                              id = {item.label}
                                              label={item.label}
                                              value={item.value}
                                              getUsage={this.getKey.bind(this)}
                                              checked={this.state.key_id == item.value ? true : false}
                                              name={`key`}
                                            />
                                          </div>
                                        </>
                                      )
                                    })}
                                  </div>
                                  <div className={'block-area flex'}>
                                    <div className={'block-title'}>喘息</div>
                                    {this.state.dummy_items.map(item => {
                                      return(
                                        <>
                                          <div className='check-label'>
                                            <Radiobox
                                              id = {item.label}
                                              label={item.label}
                                              value={item.value}
                                              getUsage={this.getdummy.bind(this)}
                                              checked={this.state.dummy == item.value ? true : false}
                                              name={`dummy`}
                                            />
                                          </div>
                                        </>
                                      )
                                    })}
                                  </div>
                                </div>

                              </div>
                              <div className="flex">
                                <div className={'block-area'} style={{width:"50%"}}>
                                  <div className={'block-title'}>妊娠</div>
                                  {this.state.pregnancy_items.map(item => {
                                    return (
                                      <>
                                        <div className='check-label'>
                                          <Radiobox
                                            id = {item.label}
                                            label={item.label}
                                            value={item.value}
                                            getUsage={this.getPregnancy.bind(this)}
                                            checked={this.state.pregnancy_id == item.value ? true : false}
                                            name={`pregnancy`}
                                          />
                                        </div>
                                      </>
                                    )
                                  })}
                                </div>
                                {this.state.enable_contrast_medium_interview_sheet && (
                                  <>
                                  <div className={'block-area mmg-block'} style={{marginLeft:"10px", width:"50%"}}>
                                    <div className={'block-title'}>造影剤問診票</div>
                                    {this.state.inquiry_items.map(item => {
                                      return(
                                        <>
                                          <div className='check-label'>
                                            <Radiobox
                                              id = {item.label}
                                              label={item.label}
                                              value={item.value}
                                              getUsage={this.getInquiry.bind(this)}
                                              checked={this.state.inquiry_id == item.value ? true : false}
                                              name={`inquiry`}
                                            />
                                          </div>
                                        </>
                                      )
                                    })}
                                  </div>
                                  </>
                                )}                              
                              </div>

                              <div className={'block-area flex'} style={{width:"calc(50% - 5px)"}}>
                                <div className={'block-title'}>フィルム出力</div>
                                {this.state.film_output_items.map(item => {
                                  return(
                                    <>
                                      <div className='check-label'>
                                        <Radiobox
                                          id = {item.label}
                                          label={item.label}
                                          value={item.value}
                                          getUsage={this.getFilmOutput.bind(this)}
                                          checked={this.state.film_output_id == item.value ? true : false}
                                          name={`film_output`}
                                        />
                                      </div>
                                    </>
                                  )
                                })}
                              </div>
                              <div className={'block-area mmg-block'} style={{width:"100%"}}>
                                <div className={'block-title'}>造影剤使用</div>
                                {this.use_items.map(item => {
                                  return(
                                    <>
                                      <div className='use-label'>
                                        <Radiobox
                                          id = {item.label}
                                          label={item.label}
                                          value={item.value}
                                          getUsage={this.getUse.bind(this)}
                                          checked={this.state.use_id == item.value ? true : false}
                                          name={`use`}
                                        />
                                      </div>
                                    </>
                                  )
                                })}
                                {/* {(this.state.use_id == 0 || this.state.use_id ==1 ) && (
                                  <>
                                    <div className="select-item-area">
                                      <label style={{width:'8rem'}}>造影剤注入手技</label>
                                      <div className={'input-box'} onClick = {this.openSelectItem.bind(this)}>{this.state.obtain_tech}</div>
                                      <Button type="mono" onClick={this.confirmClearObtain.bind(this)}>C</Button>
                                    </div>
                                    <div className={'set-detail-area'}>
                                      <ItemTableBody
                                        function_id={FUNCTION_ID_CATEGORY.RADIATION}
                                        item_details={this.state.item_details}
                                        setItemDetails={this.setItemDetails.bind(this)}
                                      />
                                    </div>
                                  </>
                                )} */}
                              </div>
                            </>
                          )}
                          {this.state.height_weight_flag && (
                            <div className={'block-area'} style={{paddingBottom:'0px'}}>
                              <div className={'block-title'}>身長・体重・体表面積</div>
                              <div className = "div-tall-weight">
                                <div className={'flex'} style={{marginTop:"0.5rem"}}>
                                  <NumericInputWithUnitLabel
                                    label={'身長'}
                                    unit="cm"
                                    min = {0}
                                    max = {400}
                                    precision = {1}
                                    size = {4}
                                    step = {0.1}
                                    className="form-control"
                                    value={this.state.height}
                                    getInputText={this.selectBody.bind(this, "height")}
                                    inputmode="numeric"
                                  />
                                </div>
                                <div className={'flex'} style={{marginTop:"0.5rem"}}>
                                  <NumericInputWithUnitLabel
                                    label={'体重'}
                                    unit="kg"
                                    className="form-control"
                                    min = {0}
                                    max = {500}
                                    precision = {1}
                                    size = {4}
                                    step = {0.1}
                                    value={this.state.weight}
                                    getInputText={this.selectBody.bind(this, "weight")}
                                    inputmode="numeric"
                                  />
                                </div>
                                <div className={'flex'} style={{marginTop:"0.5rem", marginBottom:"0.5rem"}}>
                                  <NumericInputWithUnitLabel
                                    label={'体表面積'}
                                    unit='㎡'
                                    min = {0}
                                    max = {50}
                                    precision = {4}
                                    size = {6}
                                    step = {0}
                                    className="form-control"
                                    value={this.state.surface_area}
                                    getInputText={this.selectBody.bind(this, "surface_area")}
                                    inputmode="numeric"
                                  />
                                  <div className ="formula_area">
                                    <SelectorWithLabel
                                      options={formula_list}
                                      title={'（計算式'}
                                      getSelect={this.getFormula.bind(this)}
                                      departmentEditCode={this.state.formula_id}
                                    />
                                  </div>
                                  <div style={{lineHeight:"2rem"}}>）</div>
                                </div>
                              </div>
                            </div>
                          )}
                          {this.state.additions != undefined && this.state.additions != null && this.state.additions.length > 0 &&  this.state.radiation_id != 3  && (
                            <>
                              <div className={'block-area shoot-instruction'} style={{width:"100%"}}>
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
                                            <div style={{fontSize:"0.8rem"}}>※送信するチェックボックスにチェックすると医事に送信されます。</div>
                                          </>
                                        )}
                                      </div>
                                    </>
                                  )
                                })}
                              </div>
                            </>
                          )}

                          {this.state.additions != undefined && this.state.additions != null && this.state.additions.length > 0 &&  this.state.radiation_id == 3 && addition_count_01 > 0 && (
                            <>
                              <div className={'block-area shoot-instruction'} style={{width:"100%"}}>
                                <div className={'block-title'}>追加指示・指導・処置等選択</div>
                                {this.state.additions.map(addition => {
                                  if (addition.addition_id != 7271){
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
                                              <div style={{fontSize:"0.8rem"}}>※送信するチェックボックスにチェックすると医事に送信されます。</div>
                                            </>
                                          )}
                                        </div>
                                      </>
                                    )
                                  }
                                  // if (addition.addition_id == 7271 && addition.sending_category ==3 && this.state.use_id ==0){     //造影剤加算（ＣＴ）
                                  //     return (
                                  //         <>
                                  //             <div className={'flex'}>
                                  //                 <Checkbox
                                  //                     label={addition.name}
                                  //                     getRadio={this.getAdditions.bind(this)}
                                  //                     number={addition.addition_id}
                                  //                     value={this.state.additions_check[addition.addition_id]}
                                  //                     name={`additions`}
                                  //                 />
                                  //                 {addition.sending_category === 3 && (
                                  //                     <>
                                  //                         <Checkbox
                                  //                             label={'送信する'}
                                  //                             getRadio={this.getAdditionsSendFlag.bind(this)}
                                  //                             number={addition.addition_id}
                                  //                             value={this.state.additions_send_flag_check[addition.addition_id]}
                                  //                             name={`additions_sending_flag`}
                                  //                         />
                                  //                         <div style={{fontSize:"14px"}}>※送信するチェックボックスにチェックすると医事に送信されます。</div>
                                  //                     </>
                                  //                 )}
                                  //             </div>
                                  //         </>
                                  //     )
                                  // }
                                })}
                              </div>
                            </>
                          )}
                          {this.exist_portable_shoots && (
                          <>
                          <div className='portable-checkbox' style={{marginTop:'0.5rem'}}>
                            <Checkbox
                              label={'ポータブル撮影'}
                              getRadio={this.checkPortable.bind(this)}                          
                              value={this.state.portable_shoot}
                              name={`portable_shoot`}
                            />
                          </div>
                          </>
                        )}
                        </div>                      
                      </div>
                    </div>

                  </>
                )}
                {this.state.radiation_id>0 && this.state.radiation_id ==8 && (
                  <>
                    <div className="flex" style={{marginBottom:'10px'}}>
                      <div className="date" style={{paddingTop:'0.2rem', marginRight:'10px'}}>日付</div>
                      {this.state.is_reserved !== 1 && (
                        <DatePicker
                          locale="ja"
                          selected={this.state.gensa_date}
                          onChange={this.getGensaDate.bind(this)}
                          dateFormat="yyyy/MM/dd"
                          placeholderText={this.state.not_yet ? "日未定" :"年/月/日"}
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          className='date-input-other'
                          dayClassName = {date => setDateColorClassName(date)}                        
                        />
                      )}
                      {this.state.is_reserved === 1 && (
                        <div className={'date-area'}>
                          {this.state.not_yet ? "日未定" : formatDateSlash(this.state.gensa_date) + ' ' + (this.state.reserve_time == null ? "時間未定" : this.state.reserve_time)}
                        </div>
                      )}
                    </div>
                    <div className="flex">
                      <div className="select-area" style={{width:'45%', marginRight:'2%'}}>
                        <div className={'head-title'}>{'分類'}</div>
                        <div className="kinds_content_list" style={{width:'100%'}} id='selected_kind_id_id'>
                          {this.state.other_kind_data != undefined && this.state.other_kind_data != null &&
                          this.state.other_kind_data.length> 0 && this.state.other_kind_data.map(item => {
                            return(
                              <>
                                <div className={this.state.selected_kind_id == item.kind_id ? 'row-item selected' : 'row-item'} onClick={this.selectOtherKind.bind(this, item.kind_id, item)}>
                                  <div>{item.name}</div>
                                </div>
                              </>
                            )
                          })
                          }
                        </div>
                      </div>
                      <div className="select-area" style={{width:'45%'}}>
                        <div className={'head-title'}>{'分類詳細'}</div>
                        <div className="kinds_content_list" style={{width:'100%'}} id='selected_kind_detail_id_id'>
                          {this.state.display_other_kind_details != undefined && this.state.display_other_kind_details != null && this.state.display_other_kind_details.length > 0 &&
                          this.state.display_other_kind_details.map((item)=>{
                              return (
                                <>
                                  <div className={this.state.selected_kind_detail_id == item.kind_detail_id ? 'row-item selected' : 'row-item'} onClick={this.selectDetail.bind(this, item.kind_detail_id, item)}>
                                    <div>{item.name}</div>
                                  </div>
                                </>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                    <div style={{display:'flex', width:'100%'}}>
                      <fieldset className={'block-area title-style1'} style={{width:"45%", marginTop:'10px', marginRight:'2%'}}>
                        <legend style={{fontSize:'1.2rem'}}>部位</legend>
                        <div className={'flex'}>
                          <input type="text" readOnly={true} value={this.state.other_body_part} style={{width:"80%"}}/>
                          <Button type="common" onClick={this.openBodyPart.bind(this)} style={{width:"20%", marginLeft:'5px'}}>部位編集</Button>
                        </div>
                      </fieldset>

                      <fieldset className={'block-area title-style2'} style={{width:"45%", marginTop:'10px'}}>
                        <legend style={{fontSize:'1.2rem'}}>フリーコメント（全角25文字まで）</legend>
                        <div className="div-textarea">
                          <textarea id='free_comment_id' onChange={this.getFreeComment.bind(this)} value={this.state.free_comment}></textarea>
                        </div>
                      </fieldset>
                    </div>

                    {this.state.shoot_count_flag && (
                      <div className={'block-area'} style={{width:"16%"}}>
                        <div className={'block-title'}>撮影回数</div>
                        <div className="count-area">
                          <NumericInputWithUnitLabel
                            unit={'回'}
                            maxLength={ 4 }
                            className="form-control"
                            value={this.state.shoot_count}
                            getInputText={this.selectCount.bind(this, "shoot")}
                            inputmode="numeric"
                            disabled = {this.state.display_direction_data != undefined && this.state.display_direction_data.length > 0?true:false}
                          />
                        </div>
                      </div>
                    )}
                    {this.state.sub_picture_flag && (
                      <div className={'block-area'} style={{width:"16%"}}>
                        <div className={'block-title'}>分画数</div>
                        <div className="count-area">
                          <NumericInputWithUnitLabel
                            unit={''}
                            maxLength={ 4 }
                            className="form-control"
                            value={this.state.sub_picture}
                            getInputText={this.selectCount.bind(this, "picture")}
                            inputmode="numeric"
                          />
                        </div>
                      </div>
                    )}
                    {this.state.direction_count_flag && (
                      <div className={'block-area'} style={{width:"16%"}}>
                        <div className={'block-title'}>方向数</div>
                        <div className="count-area">
                          <NumericInputWithUnitLabel
                            unit={''}
                            maxLength={ 4 }
                            className="form-control"
                            value={this.state.direction_count}
                            getInputText={this.selectCount.bind(this, "direction")}
                            inputmode="numeric"
                          />
                        </div>
                      </div>
                    )}
                    {this.state.additions != undefined && this.state.additions != null && this.state.additions.length > 0 &&  this.state.radiation_id != 3  && (
                      <>
                        <div className={'block-area shoot-instruction'} style={{width:"100%"}}>
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
                                      <div style={{fontSize:"0.8rem"}}>※送信するチェックボックスにチェックすると医事に送信されます。</div>
                                    </>
                                  )}
                                </div>
                              </>
                            )
                          })}
                        </div>
                      </>
                    )}
                    {this.state.additions != undefined && this.state.additions != null && this.state.additions.length > 0 &&  this.state.radiation_id == 3 && addition_count_02 > 0 && (
                      <>
                        <div className={'block-area shoot-instruction'} style={{width:"100%"}}>
                          <div className={'block-title'}>追加指示・指導・処置等選択</div>
                          {this.state.additions.map(addition => {
                            if (addition.addition_id != 7271){
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
                                        <div style={{fontSize:"0.8rem"}}>※送信するチェックボックスにチェックすると医事に送信されます。</div>
                                      </>
                                    )}
                                  </div>
                                </>
                              )
                            }
                            // if (addition.addition_id == 7271 && addition.sending_category ==3 && this.state.use_id ==0){     //造影剤加算（ＣＴ）
                            //     return (
                            //         <>
                            //             <div className={'flex'}>
                            //                 <Checkbox
                            //                     label={addition.name}
                            //                     getRadio={this.getAdditions.bind(this)}
                            //                     number={addition.addition_id}
                            //                     value={this.state.additions_check[addition.addition_id]}
                            //                     name={`additions`}
                            //                 />
                            //                 {addition.sending_category === 3 && (
                            //                     <>
                            //                         <Checkbox
                            //                             label={'送信する'}
                            //                             getRadio={this.getAdditionsSendFlag.bind(this)}
                            //                             number={addition.addition_id}
                            //                             value={this.state.additions_send_flag_check[addition.addition_id]}
                            //                             name={`additions_sending_flag`}
                            //                         />
                            //                         <div style={{fontSize:"14px"}}>※送信するチェックボックスにチェックすると医事に送信されます。</div>
                            //                     </>
                            //                 )}
                            //             </div>
                            //         </>
                            //     )
                            // }
                          })}
                        </div>
                      </>
                    )}
                  </>
                )}

              </Wrapper>
            </DatePickerBox>
          </Modal.Body>

          <Modal.Footer>
            <DatePickerBox>
              <Footer>
                {this.props.radiation_id>0 && this.props.radiation_id != 8 && (
                  <>
                    <div className="date">検査日</div>
                    {this.state.is_reserved !== 1 && (
                      <DatePicker
                        locale="ja"
                        selected={this.state.gensa_date}
                        onChange={this.getGensaDate.bind(this)}
                        dateFormat="yyyy/MM/dd"
                        // placeholderText={this.state.not_yet ? "日未定" : "年/月/日"}
                        placeholderText = {this.state.placeholder}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        className='spec-datepicker'
                        dayClassName = {date => setDateColorClassName(date)}
                      />
                    )}
                    {this.state.is_reserved === 1 && (
                      <div className={'date-area'}>
                        {this.state.not_yet ? "日未定" : formatDateSlash(this.state.gensa_date) + ' ' + (this.state.reserve_time == null ? "時間未定" : this.state.reserve_time)}
                      </div>
                    )}
                    <Button className="red-btn" style={{marginLeft:"16px"}} onClick={this.setNodate.bind(this)}>日未定</Button>
                    {this.state.radiation_id == 1 && (
                      <>
                        {/* <Button className="reservation" style={{marginRight:"150px", marginLeft:'10px'}}>次回診察日</Button> */}
                      </>
                    )}
                    {(this.state.radiation_id == 3 || this.state.radiation_id == 4) && (
                      <>
                        {/* <Button className="reservation">予約</Button> */}
                        <Button className={this.state.is_emergency === 1 ? "emergency red-btn" : "emergency cancel-btn"} onClick={this.setEmergency.bind(this)}>当日緊急</Button>
                      </>
                    )}
                  </>
                )}
                {(this.props.radiation_id == 3 || this.props.radiation_id == 4) && (
                  <div className="bottom-alert">↓必ず放射線部に連絡・確認上このボタンから依頼してください</div>
                )}
                {this.props.radiation_id > 0 && (
                  <>
                    {this.state.is_reserved === 1 && this.state.is_emergency === 0 && (
                      <Button className="reservation red-btn" onClick={this.openReserveCalendar.bind(this)}>予約</Button>
                    )}

                    <Button className="cancel cancel-btn" onClick={this.confirmCloseModal}>キャンセル</Button>
                    {this.context.$getKarteMode(this.props.patientId) == KARTEMODE.EXECUTE ? (
                      <>
                        {(this.state.number > 0 && this.state.done_order !== 1)  ? (
                          <>
                          {this.can_register ? (
                            <>
                            <Button className="ok red-btn" onClick = {this.save.bind(this)}>確定(指示)</Button>
                            </>
                          ) : (
                            <>
                            <OverlayTrigger placement={"top"} overlay={renderTooltip("権限がありません。")}>
                              <Button className="ok disable-btn">確定(指示)</Button>
                            </OverlayTrigger>
                            </>
                          )}
                          </>
                        ):(
                          <OverlayTrigger placement={"top"} overlay={renderTooltip("権限がありません。")}>
                            <Button className='disable-btn'>確定(指示)</Button>
                          </OverlayTrigger>                          
                        )}
                        {this.can_done ? (
                          <>
                          <Button className="ok red-btn" onClick = {this.save.bind(this, 1)}>確定(指示& 実施)</Button>
                          </>
                        ) : (
                          <>
                          <OverlayTrigger placement={"top"} overlay={renderTooltip("権限がありません。")}>
                            <Button className="disable-btn">確定(指示& 実施)</Button>
                          </OverlayTrigger>
                          </>
                        )}
                      </>
                    ):(
                      <>
                        {(this.state.number > 0 && this.state.done_order === 1)  ? (
                          <>
                            <OverlayTrigger placement={"top"} overlay={renderTooltip("権限がありません。")}>
                              <Button className='disable-btn'>確定(指示)</Button>
                            </OverlayTrigger>
                            {this.can_done ? (
                              <>
                              <Button className="ok red-btn" onClick = {this.save.bind(this, 1)}>確定(指示& 実施)</Button>
                              </>
                            ) : (
                              <>
                              <OverlayTrigger placement={"top"} overlay={renderTooltip("権限がありません。")}>
                                <Button className="disable-btn">確定(指示& 実施)</Button>
                              </OverlayTrigger>
                              </>
                            )}
                          </>
                        ):(
                          <>
                          {this.can_register ? (
                            <Button className="ok red-btn" onClick = {this.save.bind(this)}>確定(指示)</Button>
                          ) : (
                            <>
                            <OverlayTrigger placement={"top"} overlay={renderTooltip("権限がありません。")}>
                              <Button className="disable-btn">確定(指示)</Button>
                            </OverlayTrigger>
                            </>
                          )}
                          {/* {this.state.radiation_id == 8 ? (
                            <Button className="cancel red-btn" onClick={this.save.bind(this, 1)}>確定(指示& 実施)</Button>
                          ):( */}

                          <OverlayTrigger placement={"top"} overlay={renderTooltip("権限がありません。")}>
                            <Button className='disable-btn'>確定(指示& 実施)</Button>
                          </OverlayTrigger>                            
                          {/* )} */}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}

              </Footer>
            </DatePickerBox>
          </Modal.Footer>
          {this.state.isShowMedicineModal && (
            <SelectMedicineModal
              closeModal = {this.closeModal}
            />
          )}
          {this.state.isShowCommentModal && (
            <AddCommentModal
              closeModal = {this.closeModal}
            />
          )}
          {this.state.isBodyPartOpen && (
            <BodyParts
              bodyPartData={BODY_PART_DATA}
              closeBodyParts={this.closeBodyParts}
              usageName={this.state.type}
              body_part={this.state.other_body_part != undefined && this.state.other_body_part != null ? this.state.other_body_part : ""}
              bodyPartConfirm={this.bodyPartConfirm}
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
          {this.state.isDeleteConfirmModal !== false && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.deleteData.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.isUpdateConfirmModal !== false && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.saveData.bind(this, this.state.done_flag)}
              confirmTitle= {this.state.confirm_message}
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
          {this.state.openKnowledgeSetModal && (
            <KnowledgeSetModal
              closeModal= {this.closeModal}
              radiation_id={this.state.radiation_id}
              radiation_name={this.state.type}
              radiation_classific_data={this.state.radiation_classific_data}
              radiation_part_data={this.state.radiation_part_data}
              recent_order = {this.state.recent_order}
              handleOk = {this.setRecentOrder}
            />
          )}
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
          />
          {this.state.isOpenReserveCalendar === true && (
            <EndoscopeReservationModal
              handleOk={this.setReserveDateTime.bind(this)}
              system_patient_id={this.state.patientId}
              inspection_id={this.state.radiation_id}
              inspection_DATETIME={this.state.gensa_date}
              reserve_time={this.state.reserve_time}
              closeModal={this.closeCalendarModal}
              patient_name={this.props.patientInfo.name}
              reserve_type={'radiation'}
              use_day_hold={1}
            />
          )}
          {this.state.alert_message != "" && (
            <ValidateAlertModal
              handleOk={this.closeAlertModal}
              alert_meassage={this.state.alert_message}
            />
          )}
          {this.state.isOpenShemaModal === true && (
            <RadiationEditModal
              handleOk={this.handleOk}
              closeModal={this.closeShemaModal}
              handlePropInsert={this.registerImage}
              imgBase64={this.state.imgBase64}
            />
          )}
          {this.state.confirm_message !== "" && this.state.confirm_type === "close" && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.confirmDeleteCache}
              confirmTitle= {this.state.confirm_message}
              title = {this.state.confirm_alert_title}
            />
          )}

          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeWarnModal}
              handleOk= {this.closeWarnModal}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
        </Modal>
      </>
    );
  }
}

RadiationModal.contextType = Context;

RadiationModal.defaultProps = {
  cache_index: null
};

RadiationModal.propTypes = {
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,
  radiation_id: PropTypes.number,
  closeModal: PropTypes.func,
  cache_index:PropTypes.number,
  cache_data: PropTypes.object
};

export default RadiationModal;
