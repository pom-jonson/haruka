import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import Context from "~/helpers/configureStore";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
registerLocale("ja", ja);
import * as karteApi from "~/helpers/cacheKarte-utils";
import {formatDateLine, formatDateTimeIE} from "~/helpers/date";
import {CACHE_LOCALNAMES, KARTEMODE, FUNCTION_ID_CATEGORY, checkSMPByUnicode} from "~/helpers/constants";
import ItemTableBody from "~/components/templates/Patient/Modals/Guidance/ItemTableBody";
import axios from "axios/index";
import Checkbox from "~/components/molecules/Checkbox";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import {removeRedBorder, addRedBorder, setDateColorClassName} from '~/helpers/dialConstants';
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import $ from "jquery";
import { harukaValidate } from "~/helpers/haruka_validate";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`
 width: 100%;
 height: 100%;
 font-size: 1rem;
 overflow-y:auto;
 .flex{
  display: flex;
 }
.selected, .selected:hover{
  background:lightblue!important;
}
.work-list{
    height: 12rem;
    width: 100%;
    justify-content: space-between;
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
        height: calc(100% - 30px);
        border:1px solid #aaa;
        p {
          margin: 0;
          cursor: pointer;
          padding-left: 5px;
        }
        p:hover {
          background-color: rgb(246, 252, 253);
        }
        overflow-y:auto;
      }
    }
}
  .menu-select{
    width: 35px;
    height: 30px;
    button{
      width: 100%;
      min-width: 30px;
      height: 30px;
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
    width: 150px;
    text-align: center;
    height: 30px;
    margin: 0 10px;
  }
  .select-box{
    margin-left: 30px;
    select{
      width: 300px;
      height: 30px;
    }
    label{
        margin: 0;
        height: 25px;
        margin-top: 2px;
    }
    .pullbox-title{
      font-size: 16px;
      width: auto;
      line-height: 33px;
      margin-right: 5px;
    }
  }
  .mt5{
    button{
    padding:5px;
    margin-left:5px;
    min-width:34px;
    }
  }
  .mt5{margin-top:5px;}
  .header-second{
    display: flex;
    margin-bottom:5px;
    label{
      margin-top:-5px;
      margin-left: 5px;
      margin-right:15px;
      margin-bottom:5px;
    }
  }
  
  .header-first{
    display: flex;
    margin-bottom: 0.25rem;
    .menu-select{
      width: 35px;
      height: 30px;
      button{
        width: 100%;
        min-width: 30px;
        height: 30px;
        background-color: #ddd;
        border: 1px solid #aaa;
        line-height: 0px;
        span{
          color:black;
          margin-left: -4px;
        }
      }
    }
    .radio-area{
      display: flex;
      margin-bottom:5px;
      label{
        margin-top: -5px;
        margin-right:15px;
      }
    }
    .treat-date {
        line-height: 2rem;
    }
    .date-select {
      width: auto;
      border: solid 1px #999;
      margin-left: 3px;
      .react-datepicker-wrapper {
        input {
          width: 7rem;
          height: 2rem;
          border-radius: 4px;
          border: solid 1px #ced4da;
          padding-left: 4px;
          font-size:1rem;
          padding-bottom: 0.2rem;
        }
      }
    }
    .select-box{
      margin-left: 30px;
      .label-title {
        margin-top: 2px;
        margin-bottom: 0px;
      }
      select{
        width: 100px;
        height: 30px;
      }
      label{
      margin-top: 2px;
      height: 25px;
      }
      .pullbox-title{
        font-size: 16px;
        width: auto;
        line-height: 33px;
        margin-right: 5px;
      }
    }
  }
  .clear-button {
      min-width: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      padding:0;
      padding-left:0.15rem;
      padding-top:0.15rem;
      margin-left: 0.25rem;
      background-color: buttonface;
      border: 1px solid #7e7e7e;
      span{
        color:black;
        font-size:1rem;
      }
  }
  .table {
    .pullbox-title{width:0;}
    tr{height: 30px;}
    td{padding:0;}
    th{padding:3px;}
  }
  .comment-area{
    div {margin:0;}
    .label-title{
      width: 17rem;
      font-size: 1rem;
      line-height:2.5rem;
    }
    input {
      width: calc(100% - 17rem);
      height:2.5rem;
    }
    select{
      width: 100px;
      height: 30px;
    }
    button{
      height: 2.5rem;
      width: 2.5rem;
    }
    label{
    margin: 0;
    height: 25px;
    }
    .pullbox-title{
      font-size: 16px;
      width: auto;
      line-height: 33px;
      margin-right: 5px;
    }
  }
  }
  .send-flag-area {
    width: calc(45% - 60px);
    padding-left: 10px;
    label {
        font-size: 16px;
    }
    .send-message {
        font-size: 14px;
    }
  }
  .ml100{margin-left: 100px;}
  .ml10{margin-left: 100px;}
  .no-border{
    border: none !important;
  }
  .last-part{
    button{
      margin-right: 5px;
      margin-left: 5px;
      span{
        font-size: 16px;
        font-weight: 100;
      }
    }
  }
  .inline-radio{
    label {
      font-size: 16px;
      margin-right: 5px;
      border-radius: 4px;
      border: solid 1px #ddd;
    }
    div{
      margin-right: 5px;
    }
  }
  .search-type{
    label {
      font-size: 16px;
    }
  }
  .set-detail-area {
    width: 100%;
    overflow-y: auto;
    margin-top: 0.5rem;
    table {
      thead{
        display:table;
        width:100%;
      }
      tbody{
        display:block;
        overflow-y: auto;
        height: calc( 100vh - 55rem);
        width:100%;
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2 !important;}
      }
      tr{
        display: table;
        width: 100%;
      }
      td {
        word-break: break-all;
        padding: 0.25rem;
      }
      th {
          position: sticky;
          text-align: center;
          padding: 0.3rem;
      }
      .table-check {
        width: 10rem;
      }
      .item-no {
        width: 2.5rem;
      }
      .code-number {
        width: 4.5rem;
        label {
          margin-right:0;
        }
      }
      .name{
        width: 30rem;
      }
    }
    table {
      margin-bottom: 0;
    }
    .table-menu {
      background-color: rgb(160, 235, 255);
    }
    .td-no {
      background-color: rgb(160, 235, 255);
    }
    td {
      vertical-align: middle;
    }
    .value-area {
      padding:0;
      div {margin-top:0;}
      .input-value {
        div {
          // width:100%;
        }
        .form-control {width: 100% !important;}
        .birthday_area{
          .react-datepicker-wrapper {
            width: 28px !important;
            margin-right:15px;
            svg {
                left: 5px;
                top: -8px;
            }
          }
          .react-datepicker-popper{
            width:16rem;
          }
          label {width: 8.5rem;}
          .pullbox-select{width:8.5rem;}
          .pullbox {
            width:8.5rem;
            .pullbox-title {width:0;}
          }
          span{
            line-height:38px;
            margin-right: 5px;
          }
          .month_day{
            .pullbox{width:4rem;}
            .pullbox-select{width:4rem;}
            label {width: 4rem;}
            .label-title{
              display:none;
            }
          }
          .calendar_icon {
            left: 100px;
          }
        }
      }
    }
    .value-input {
        width: 340px!important;
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
    .search-item-btn {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 38px;
    }
    .react-datepicker-wrapper {
        width: 100%;
        .react-datepicker__input-container {
            width: 100%;
            input {
                font-size: 18px;
                width: 100%;
                height: 38px;
                border-radius: 4px;
                border-width: 1px;
                border-style: solid;
                border-color: rgb(206, 212, 218);
                border-image: initial;
                padding: 0px 8px;
            }
        }
    }
    .calendar_icon{
        font-size:20px;
        position: absolute;
        top: 17px;
        left: 66px;
        color: #6a676a;
    }
  }
  .spinner_area {
    width: 2rem;
    margin: auto;
  }
  .block-area {
    border: 1px solid #aaa;
    margin-top: 0.5rem;
    padding: 10px;
    position: relative;
    label {
      font-size: 14px;
      width: auto;
    }
  }
  .block-title {
    position: absolute;
    top: -12px;
    left: 10px;
    font-size: 18px;
    background-color: white;
    padding-left: 5px;
    padding-right: 5px;
  }
  .note-label {
    width: 10rem;
  }
  .note-text {
    border: 1px solid #aaa;
    width: calc(100% - 10rem);
    height: 50px;
    overflow-y: auto;
    padding:0.2rem;
    p {margin: 0;}
  }
  .karte-text-area {
    border: 1px solid #aaa;
    width: calc(100% - 10rem);
    overflow-y: auto;
    height: 8rem;
    .karte-text {
      label {
        margin: 0;
        padding-left: 5px;
      }
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

class GuidanceModal extends Component {
  constructor(props) {
    super(props);
    let japan_year_list = [];
    var i =0;
    var japan_year_name ='';
    var current_year = new Date().getFullYear();
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
      japan_year_list.push({id:i, value:japan_year_name});
    }
    japan_year_list.reverse();
    this.state = {
      patient_id: props.patientId,
      is_loaded: false,
      collected_date: new Date(),
      item_details:[],
      classific_id:'',
      classific_name:'',
      classific_detail_id:'',
      classific_detail_name:'',
      classific_detail_master:[],
      japan_year_list,
      send_flag:0,
      sending_category:null,
      number:0,
      isForUpdate:0,
      done_order:0,
      created_at:'',
      notes_id:0,
      karte_description_name:null,
      karte_text_data:[],
      isUpdateConfirmModal:false,
      isDeleteConfirmModal:false,
      confirm_message: "",
      karte_status: 0,
      validate_alert_message:'',
      alert_messages:'',
    };
    this.change_flag = 0;
  }
  
  async componentDidMount() {
    let karte_status = this.context.karte_status.code == 0 ? 1 : this.context.karte_status.code == 1 ? 3 : 2;
    let path = "/app/api/v2/master/guidance";
    let post_data = {
    };
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if (res) {
          this.setState({
            classific: res.classific,
            classific_detail: res.classific_detail,
            classific_add: res.classific_add,
            notes_master: res.notes_master,
            karte_text_master: res.karte_text_master,
            is_loaded:true,
            additions:res.additions,
            additions_check:{},
            additions_send_flag_check:{},
          });
        }
      })
      .catch(() => {
      });
    
    path = "/app/api/v2/order/guidance/getItemCategories";
    post_data = {
      function_id:1,
    };
    let { data } = await axios.post(path, {params: post_data});
    if(data.length){
      let item_categories = [];
      data.map((item)=>{
        item_categories[item.item_category_id] = item.name;
      });
      this.setState({
        item_categories,
      });
    }
    
    let number = this.state.number;
    let isForUpdate = this.state.isForUpdate;
    let done_order = this.state.done_order;
    let created_at = this.state.created_at;
    
    if (this.props.cache_index != null){
      let cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.GUIDANCE_EDIT, this.props.cache_index);
      if (this.props.cache_data != undefined && this.props.cache_data != null) cache_data = JSON.parse(JSON.stringify(this.props.cache_data));
      if (cache_data === undefined || cache_data == null) return;
      number = cache_data.number;
      isForUpdate = number > 0 ? 1 : 0;
      done_order = cache_data.done_order;
      created_at = cache_data.created_at;
      karte_status = cache_data['karte_status'];
      let item_details = this.state.item_details;
      if(cache_data.details !== undefined){
        item_details = cache_data.details;
      }
      
      //加算項目-----------------------------------------------
      let additions_check = {};
      let additions_send_flag_check = {};
      let additions = [];
      if (this.state.additions != undefined && this.state.additions!= null){
        additions = this.state.additions;
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
      this.setState({
        number,
        isForUpdate,
        done_order,
        created_at,
        collected_date: formatDateTimeIE(cache_data.treat_date),
        department_id: parseInt(cache_data.department_id),
        department_name: cache_data.department_name,
        classific_id:cache_data.classific_id,
        classific_name:cache_data.classific_name,
        classific_detail_id:cache_data.classific_detail_id !== undefined ? cache_data.classific_detail_id : '',
        classific_detail_name:cache_data.classific_detail_name !== undefined ? cache_data.classific_detail_name: '',
        sending_category:cache_data.sending_category !== undefined ? cache_data.sending_category: null,
        send_flag:cache_data.send_flag !== undefined ? cache_data.send_flag: 0,
        comment:cache_data.comment !== undefined ? cache_data.comment: '',
        item_details,
        additions,
        additions_check,
        additions_send_flag_check,
        karte_status
      });
      this.selectClassification(cache_data.classific_id, cache_data.classific_name, cache_data.karte_text_data !== undefined ? cache_data.karte_text_data: [], true);
      if(cache_data.classific_detail_id !== undefined ){
        this.selectPractice(cache_data.classific_detail_id, cache_data.classific_detail_name, true, this.state.sending_category, this.state.notes_id, this.state.karte_description_name, true);
      }
    } else {
      this.setState({karte_status});
    }
  }
  
  //分類選択
  selectClassification = (id,name, karte_text_data=null, from_cachce = false) => {
    let classific_detail = this.state.classific_detail;
    let filteredArray = classific_detail.filter(item => {
      if (item.classific_id === id) return item;
    });
    if(!from_cachce) this.change_flag = 1;
    this.setState({
      classific_id: id,
      classific_name: name,
      classific_detail_master:filteredArray,
      classific_detail_id:'',
      notes_id:0,
      sending_category:null,
      karte_description_name:null,
      karte_text_data:karte_text_data != null ? karte_text_data:[],
    })
  };
  
  // 分類詳細選択
  selectPractice = (id, name, init, sending_category=null, notes_id, karte_description_name, from_cachce = false) => {
    let classific_add = this.state.classific_add;
    let new_item_details = [];
    let karte_text_data = this.state.karte_text_data;
    if(init){
      new_item_details = this.state.item_details;
      if(this.state.classific_detail_master.length > 0){
        this.state.classific_detail_master.map(item => {
          if (item.classific_detail_id === id){
            sending_category = item.sending_category;
            notes_id = item.notes_id
            karte_description_name = item.karte_description_name
          }
        });
      }
    } else {
      karte_text_data = [];
      classific_add.filter(item => {
        if (item.classific_detail_id === id){
          let detail = {};
          detail['classfic'] = item.item_category_id;
          detail['classfic_name'] = (item.item_category_id === 0) ? '' : this.state.item_categories[item.item_category_id];
          detail['item_id'] = item.item_id;
          detail['item_name'] = item.name;
          detail['delete'] = false;
          detail['is_enabled'] = 1;
          if(item.input_item1_flag === 1){
            detail['attribute1'] = item.input_item1_attribute;
            detail['format1'] = item.input_item1_format;
            detail['unit_name1'] = item.input_item1_unit;
            detail['max_length1'] = item.input_item1_max_length;
            if(detail['attribute1'] === 4){
              detail['value1'] = formatDateLine(new Date());
              let cur_date = new Date(detail['value1']);
              let cur_year = cur_date.getFullYear();
              let cur_month = cur_date.getMonth() + 1;
              let cur_day = cur_date.getDate();
              detail['value1_format'] = this.state.japan_year_list.find(x => x.id === cur_year).value + '年' + cur_month + '月' + cur_day + '日';
            }
          }
          if(item.input_item2_flag === 1){
            detail['attribute2'] = item.input_item2_attribute;
            detail['format2'] = item.input_item2_format;
            detail['unit_name2'] = item.input_item2_unit;
            detail['max_length2'] = item.input_item2_max_length;
            if(detail['attribute2'] === 4){
              detail['value2'] = formatDateLine(new Date());
              let cur_date = new Date(detail['value2']);
              let cur_year = cur_date.getFullYear();
              let cur_month = cur_date.getMonth() + 1;
              let cur_day = cur_date.getDate();
              detail['value2_format'] = this.state.japan_year_list.find(x => x.id === cur_year).value + '年' + cur_month + '月' + cur_day + '日';
            }
          }
          new_item_details.push(detail);
        }
      });
    }
    if(!from_cachce) this.change_flag = 1;
    this.setState({
      classific_detail_id: id,
      classific_detail_name: name,
      item_details:new_item_details,
      sending_category,
      notes_id,
      karte_description_name,
      karte_text_data,
    })
  };
  
  getDate = value => {
    this.change_flag = 1;
    this.setState({
      collected_date: value,
    });
  };
  
  confirmCancel() {
    this.setState({
      isUpdateConfirmModal:false,
      isDeleteConfirmModal:false,
      confirm_message: "",
      confirm_type: "",
    });
  }  

  closeAlertModal = () => {
    this.setState({ validate_alert_message: '' });
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null){
      $('#' + first_tag_id).focus()
    }
  }

  initRedBorder = () => {
    removeRedBorder('classific_id_id');
    removeRedBorder('classific_detail_id_id');
    removeRedBorder('comment_id');
  }

  checkValidation = () => {    
    let error_str_arr = [];
    let first_tag_id = '';
    let validate_data = '';
    validate_data = harukaValidate('karte', 'guidance', 'output', this.state);

    if (validate_data.error_str_arr.length > 0) {
      error_str_arr = validate_data.error_str_arr;
    }
    if (validate_data.first_tag_id != '') {
      first_tag_id = validate_data.first_tag_id;
    }    
    this.setState({first_tag_id});
    return error_str_arr;
  }

  closeWarnModal = () => {
    this.setState({alert_messages:""})
  }
  
  doneCheck = () => {
    if (!this.context.$canDoAction(this.context.FEATURES.GUIDANCEORDER, this.context.AUTHS.DONE_OREDER)){
      return "実施権限がありません。";
    }
    return "";
  }
  
  saveCheck = () => {
    let result = '';
    if (!(this.state.number > 0) && !this.context.$canDoAction(this.context.FEATURES.GUIDANCEORDER, this.context.AUTHS.REGISTER) && !this.context.$canDoAction(this.context.FEATURES.GUIDANCEORDER, this.context.AUTHS.REGISTER_PROXY)) result = "登録権限がありません。";
    if (this.state.number > 0 && !this.context.$canDoAction(this.context.FEATURES.GUIDANCEORDER, this.context.AUTHS.EDIT) && !this.context.$canDoAction(this.context.FEATURES.GUIDANCEORDER, this.context.AUTHS.EDIT_PROXY)) result = "編集権限がありません。";
    return result;
  }

  save = (done_flag=0) =>{
    this.initRedBorder();
    if (!this.context.$canDoAction(this.context.FEATURES.GUIDANCEORDER, this.context.AUTHS.DONE_OREDER) && done_flag === 1){
      return;
    }
    if (!(this.state.number > 0) && !this.context.$canDoAction(this.context.FEATURES.GUIDANCEORDER, this.context.AUTHS.REGISTER) && !this.context.$canDoAction(this.context.FEATURES.GUIDANCEORDER, this.context.AUTHS.REGISTER_PROXY)) return;
    if (this.state.number > 0 && !this.context.$canDoAction(this.context.FEATURES.GUIDANCEORDER, this.context.AUTHS.EDIT) && !this.context.$canDoAction(this.context.FEATURES.GUIDANCEORDER, this.context.AUTHS.EDIT_PROXY)) return;
    if(this.state.classific_id === ''){
      addRedBorder('classific_id_id');
      this.setState({alert_messages:"分類を選択してください。"})      
      return;
    }
    if(this.state.classific_detail_master.length > 0 &&  this.state.classific_detail_id === ''){
      addRedBorder('classific_detail_id_id');
      this.setState({alert_messages:"分類詳細を選択してください。"})
      return;
    }
    var item_details = this.state.item_details;
    var details_check_flag = false;
    if (item_details != undefined && item_details != null && item_details.length > 0){
      item_details.map((item) => {        
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
        }
      })
    }
    if (details_check_flag) return;

    let error_str_array = this.checkValidation();
    if (error_str_array.length > 0) {
      this.setState({ validate_alert_message: error_str_array.join('\n') })
      return;
    }
    
    this.setState({
      isUpdateConfirmModal:true,
      confirm_message:'登録しますか？',
      done_flag,
    });
  }
  
  saveData = (done_flag=0) =>{
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let guidance_order = {};
    
    guidance_order['classific_id'] = this.state.classific_id;
    guidance_order['classific_name'] = this.state.classific_name;
    
    if(this.state.classific_detail_id !== ''){
      guidance_order['classific_detail_id'] = this.state.classific_detail_id;
      guidance_order['classific_detail_name'] = this.state.classific_detail_name;
      guidance_order['sending_category'] = this.state.sending_category;
      guidance_order['send_flag'] = this.state.send_flag;
    }
    if(this.state.comment !== ''){
      guidance_order['comment'] = this.state.comment;
    }
    let details = [];
    Object.keys(this.state.item_details).map((index) => {
      if(this.state.item_details[index]['item_id'] !== 0){
        let detail_row = {};
        Object.keys(this.state.item_details[index]).map(idx=>{
          detail_row[idx] = this.state.item_details[index][idx];
        });
        details.push(detail_row);
      }
    })
    if(Object.keys(details).length > 0){
      guidance_order['details'] = details;
    }
    guidance_order['karte_description_name'] = this.state.karte_description_name;
    guidance_order['karte_text_data'] = this.state.karte_text_data;
    
    //加算項目------------------------------
    if(this.state.additions !== undefined && this.state.additions != null && Object.keys(this.state.additions_check).length > 0){
      guidance_order['additions'] = {};
      Object.keys(this.state.additions_check).map(key => {
        if (this.state.additions_check[key]){
          let addition_row = '';
          this.state.additions.map(addition => {
            if (addition.addition_id == key){
              addition['sending_flag'] = 2;
              if(addition.sending_category === 1){
                addition['sending_flag'] = 1;
              }
              if(addition.sending_category === 3 && this.state.additions_send_flag_check[key]){
                addition['sending_flag'] = 1;
              }
              addition_row = addition;
            }
          });
          guidance_order['additions'][key] = addition_row;
        }
      })
    }
    guidance_order['number'] = this.state.number;
    guidance_order['isForUpdate'] = this.state.isForUpdate;
    if(this.state.isForUpdate === 1 && this.props.cache_index != null){
      let cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.INSPECTION_EDIT, this.props.cache_index);
      if(cache_data !== undefined && cache_data != null && cache_data.last_doctor_code !== undefined){
        guidance_order.last_doctor_code = cache_data.last_doctor_code;
        guidance_order.last_doctor_name = cache_data.last_doctor_name;
      }
      if (this.props.cache_data !== undefined && this.props.cache_data != null){
        cache_data = JSON.parse(JSON.stringify(this.props.cache_data));
        guidance_order.last_doctor_code = cache_data.doctor_code;
        guidance_order.last_doctor_name = cache_data.doctor_name;
      }
    }
    guidance_order['done_order'] = this.state.done_order;
    guidance_order['created_at'] = this.state.created_at;
    guidance_order['karte_status'] = this.state.karte_status;
    if(done_flag === 1){
      guidance_order['done_order'] = done_flag;
    }
    guidance_order['system_patient_id'] = this.state.patient_id;
    guidance_order['treat_date'] = formatDateLine(this.state.collected_date);
    guidance_order['department_id'] = this.context.department.code == 0 ? 1 : this.context.department.code;
    guidance_order['department_name'] = this.state.department_name;
    guidance_order['doctor_code'] = authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code;
    guidance_order['doctor_name'] = authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name;
    if (authInfo.staff_category !== 1){
      guidance_order['substitute_name'] = authInfo.name;
    }
    if(this.props.cache_index != null){
      karteApi.setSubVal(this.state.patient_id, CACHE_LOCALNAMES.GUIDANCE_EDIT, this.props.cache_index, JSON.stringify(guidance_order), 'insert');
    } else {
      karteApi.setSubVal(this.state.patient_id, CACHE_LOCALNAMES.GUIDANCE_EDIT, new Date().getTime(), JSON.stringify(guidance_order), 'insert');
    }
    this.context.$setExaminationOrderFlag(1);
    this.props.closeModal();
  };
  
  getComment = e => {    
    this.change_flag = 1;
    this.setState({comment: e.target.value})
  };
  
  clearComment = () => {
    if (this.state.comment == undefined || this.state.comment == "") return;
    this.change_flag = 1;
    this.setState({
      isDeleteConfirmModal:true,
      deleteTarget:'comment',
      confirm_message:'フリーコメントを削除しますか？'
    });
  };
  confirmDelete = (target) => {
    this.confirmCancel();
    if (target != undefined && target != null && target != '')
      this.change_flag = 1;
    this.setState({[target]:""});
  }
  
  setItemDetails =(data)=>{
    this.change_flag = 1;
    this.setState({item_details:data});
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
  
  setSendFlag = (name, value) => {
    if(name==="send_flag"){
      this.change_flag = 1;
      this.setState({send_flag: value})
    }
  }
  
  getCheckStatus=(karte_text_id)=>{
    let result = false;
    if(this.state.karte_text_data.length > 0){
      this.state.karte_text_data.map(karte_text=>{
        if(karte_text['karte_text_id'] == karte_text_id){
          result = true;
        }
      })
    }
    return result;
  }
  
  setKarteText = (name, number) => {
    let karte_text_data = this.state.karte_text_data;
    if (name == 'karte_text') {
      let push_flag = false;
      if(karte_text_data.length === 0){
        push_flag = true;
      } else {
        let exit_karte_text = 0;
        karte_text_data.map((karte_text, index)=>{
          if(karte_text['karte_text_id'] == number){
            exit_karte_text = index;
          }
        })
        if(exit_karte_text === 0){
          push_flag = true;
        } else {
          let tmp_karte_text_data = [];
          karte_text_data.map(karte_text=>{
            if(karte_text['karte_text_id'] != number){
              tmp_karte_text_data.push(karte_text);
            }
          })
          karte_text_data = tmp_karte_text_data;
        }
      }
      if(push_flag === true){
        this.state.karte_text_master[this.state.classific_detail_id].map(karte_text=>{
          if(karte_text['karte_text_id'] == number){
            karte_text_data.push(karte_text);
          }
        })
      }
      this.change_flag = 1;
      this.setState({karte_text_data});
    }
  }
  
  onHide = () =>{}
  
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
  
  render() {
    let done_tooltip = this.doneCheck();
    let save_tooltip = this.saveCheck();
    let {classific, classific_detail_master} = this.state;
    return (
      <>
        <Modal show={true} id="first-view-modal" className="custom-modal-sm patient-exam-modal guidance-modal first-view-modal" onHide={this.onHide}>
          <Modal.Header>
            <Modal.Title>汎用オーダー</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                {this.state.is_loaded ? (
                  <>
                    <div className="header-first">
                      <div className="treat-date">日付</div>
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
                          dayClassName = {date => setDateColorClassName(date)}
                        />
                      </div>
                    </div>
                    <div className="flex work-list">
                      <div className="area-1" style={{width:"30%"}}>
                        <div className="title">分類</div>
                        <div className="content" id='classific_id_id'>
                          {classific !== undefined && classific.length>0 && (
                            classific.map(item => {
                              return (
                                <p
                                  className={item.classific_id == this.state.classific_id ? "selected" : ""}
                                  onClick = {this.selectClassification.bind(this, item.classific_id, item.name)}
                                  key = {item.classific_id}
                                >
                                  {item.name}
                                </p>
                              )
                            })
                          )}
                        </div>
                      </div>
                      <div className="area-1" style={{width:"68%"}}>
                        <div className="title">分類詳細</div>
                        <div className="content" id='classific_detail_id_id'>
                          {classific_detail_master !== undefined && classific_detail_master.length>0 && (
                            classific_detail_master.map(item => {
                              return (
                                <p
                                  className={item.classific_detail_id == this.state.classific_detail_id ? "selected" : ""}
                                  onClick = {this.selectPractice.bind(this, item.classific_detail_id, item.name, false, item.sending_category, item.notes_id, item.karte_description_name)}
                                  key = {item.classific_detail_id}
                                >
                                  {item.name}
                                </p>
                              )
                            })
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={'set-detail-area'}>
                      <ItemTableBody
                        function_id={FUNCTION_ID_CATEGORY.GUIDANCE}
                        item_details={this.state.item_details}
                        setItemDetails={this.setItemDetails.bind(this)}
                      />
                    </div>
                    <div className={'flex'}>
                      <div style={{width:"38%", marginTop:"0.5rem", marginRight:"2%"}}>
                        <div className={'flex'}>
                          <div className={'note-label'}>注意事項</div>
                          <div className={'note-text'}>
                            {this.state.notes_master[this.state.notes_id] !== undefined && (
                              (this.state.notes_master[this.state.notes_id].split("￥")).map(note=>{
                                return (
                                  <>
                                    <p>{note}</p>
                                  </>
                                )
                              })
                            )}
                          </div>
                        </div>
                        <div className={'flex'} style={{paddingTop:"0.5rem"}}>
                          <div className={'note-label'}>カルテ記述名称</div>
                          <div className={'note-text'}>{this.state.karte_description_name != null ? this.state.karte_description_name : ''}</div>
                        </div>
                      </div>
                      {/*{this.state.additions != undefined && this.state.additions != null && this.state.additions.length > 0 && (*/}
                      {/*<>*/}
                      <div className={'flex'} style={{width:"60%"}}>
                        <div style={{marginTop:"0.5rem", width:"3rem"}}>追加</div>
                        <div className={'block-area'} style={{width:"calc(100% - 3rem)", height:"6.5rem", overflowY:"auto"}}>
                          {this.state.additions != undefined && this.state.additions != null && this.state.additions.length > 0 && (
                            this.state.additions.map(addition => {
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
                                      </>
                                    )}
                                  </div>
                                  {addition.sending_category === 3 && (
                                    <div style={{fontSize:"14px", paddingLeft:"16px"}}>※送信するチェックボックスにチェックすると医事に送信されます。</div>
                                  )}
                                </>
                              )
                            }))}
                        </div>
                      </div>
                      {/*</>*/}
                      {/*)}*/}
                    </div>
                    <div className={'flex'} style={{marginTop:"0.5rem"}}>
                      <div className={'note-label'}>カルテ記述内容</div>
                      <div className={'karte-text-area'}>
                        {this.state.karte_text_master[this.state.classific_detail_id] !== undefined && this.state.karte_text_master[this.state.classific_detail_id].length > 0 && (
                          this.state.karte_text_master[this.state.classific_detail_id].map(karte_text=>{
                            return (
                              <>
                                <div className={'flex karte-text'}>
                                  <Checkbox
                                    getRadio={this.setKarteText.bind(this)}
                                    number={karte_text['karte_text_id']}
                                    value={this.getCheckStatus(karte_text['karte_text_id'])}
                                    name={`karte_text`}
                                  />
                                  <div>{karte_text['karte_text']}</div>
                                </div>
                              </>
                            )
                          })
                        )}
                      </div>
                    </div>
                    <div className="flex comment-area" style={{marginTop:"0.5rem"}}>
                      <div style={{width:"60%"}}>
                        <InputWithLabelBorder
                          label="フリーコメント（全角25文字まで）"
                          type="text"
                          getInputText={this.getComment.bind(this)}
                          diseaseEditData={this.state.comment}
                          id = 'comment_id'
                        />
                      </div>
                      <Button className="clear-button" onClick={this.clearComment.bind(this)}>C</Button>
                      {this.state.sending_category === 3 && (
                        <>
                          <div className={'send-flag-area'}>
                            <Checkbox
                              label={'送信する'}
                              getRadio={this.setSendFlag.bind(this)}
                              value={this.state.send_flag}
                              name={`send_flag`}
                            />
                            <div className={'send-message'}>※送信するチェックボックスにチェックすると医事に送信されます。</div>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <SpinnerWrapper>
                    <Spinner animation="border" variant="secondary" />
                  </SpinnerWrapper>
                )}
              </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel cancel-btn" onClick={this.confirmCloseModal}>キャンセル</Button>
            {this.context.$getKarteMode(this.props.patientId) == KARTEMODE.EXECUTE ? (
              <>
                {(this.state.number > 0 && this.state.done_order !== 1)  ? (
                  <Button className={save_tooltip !== "" ? "disable-btn" :"ok red-btn"} tooltip={save_tooltip} onClick = {this.save.bind(this)}>確定(指示)</Button>
                ):(
                  <Button className='disable-btn'>確定(指示)</Button>
                )}
                <Button className={done_tooltip !== "" ? "disable-btn" :"ok red-btn"} tooltip={done_tooltip} onClick = {this.save.bind(this, 1)}>確定(指示& 実施)</Button>
              </>
            ):(
              <>
                {(this.state.number > 0 && this.state.done_order === 1) ? (
                  <>
                  <Button className='disable-btn'>確定(指示)</Button>
                  <Button className="red-btn" onClick = {this.save.bind(this, 1)}>確定(指示& 実施)</Button>
                  </>
                ):(
                  <>
                  <Button className={save_tooltip !== "" ? "disable-btn" :"ok red-btn"} tooltip={save_tooltip} onClick = {this.save.bind(this)}>確定(指示)</Button>
                  <Button className="disable-btn">確定(指示& 実施)</Button>
                  </>
                )}
              </>
            )}
          </Modal.Footer>
          {this.state.isUpdateConfirmModal && (
            <ConfirmNoFocusModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.saveData.bind(this, this.state.done_flag)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.isDeleteConfirmModal && (
            <ConfirmNoFocusModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.confirmDelete.bind(this, this.state.deleteTarget)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.confirm_message !== "" && this.state.confirm_type === "close" && (
            <ConfirmNoFocusModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.confirmDeleteCache}
              confirmTitle= {this.state.confirm_message}
              title = {this.state.confirm_alert_title}
            />
          )}          
          {this.state.validate_alert_message != "" && (
            <ValidateAlertModal
              handleOk={this.closeAlertModal}
              alert_meassage={this.state.validate_alert_message}
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

GuidanceModal.contextType = Context;
GuidanceModal.propTypes = {
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,
  closeModal: PropTypes.func,
  cache_index:PropTypes.number,
  cache_data:PropTypes.object,
};

export default GuidanceModal;