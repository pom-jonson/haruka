import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import DatePicker, { registerLocale } from "react-datepicker";
import {
  formatDateLine,
  formatDateSlash,
  formatTime,
  formatDateTimeIE,
} from "~/helpers/date";
registerLocale("ja", ja);
import ja from "date-fns/locale/ja";
import InputWithLabel from "../../../../molecules/InputWithLabel";
import Button from "../../../../atoms/Button";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import DialVALeftNav from "../../DialVALeftNav";
import * as apiClient from "~/api/apiClient";
import { CACHE_SESSIONNAMES, getServerTime} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as methods from "~/components/templates/Dial/DialMethods";
import DialSelectDialyzerMasterModal from "~/components/templates/Dial/Common/DialSelectDialyzerMasterModal";
import DialSelectRegularExamMasterModal from "~/components/templates/Dial/Common/DialSelectRegularExamMasterModal";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import DialSelectFacilityOtherModal from "~/components/templates/Dial/Common/DialSelectFacilityOtherModal";
import axios from "axios/index";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import {displayLineBreak, insertLineBreak,
  makeList_code, addRequiredBg, removeRequiredBg, addRedBorder, removeRedBorder, removeFirstBreak, toHalfWidthOnlyNumber, setDateColorClassName} from "~/helpers/dialConstants";
import SelectPannelModal from "~/components/templates/Dial/Common/SelectPannelModal";
import Spinner from "react-bootstrap/Spinner";
import InputInstructionPanel from "./InputInstructionPanel";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from 'jquery';
import ContentEditable from 'react-contenteditable'
import reactCSS from 'reactcss'
import renderHTML from 'react-render-html';
import {DatePickerBox} from "~/components/styles/DatePickerBox";
import * as localApi from "~/helpers/cacheLocal-utils";

const SpinnerWrapper = styled.div`
  height: 25rem;
  display: flex;
  width: 50%;
  justify-content: center;
  align-items: center;
`;

const KarteSpinnerWrapper = styled.div`
  height: 100%;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
position:absolute;
top:107px;
right:17px;
width: 450px;
height: calc(100% - 213px);
.edit-area {
  height: calc(100% - 6.5rem);
  margin-bottom:0px;
  textarea {
      width: 100%;
      margin: 0px;
      height: calc(100% - 10px);
      max-height: 100%;
  }
}
.content_editable_area {
  min-height: 10rem;
  width:100%;
  word-break: break-all;
  p{
    margin-bottom:0px!important;
  }
}
em, i {
  font-family:"ＭＳ Ｐゴシック";
}
.preview-karte-area{
  height:calc(100% - 25.8rem);  
  overflow-y:auto;
  border:1px solid gray;
  div{
    border-bottom: 1px dotted;
  }
  .top-div {
    margin-top: -1.5rem;
  }
}
.data-input {
  width:100%;  
  display:block;
  height:21rem;
  overflow-y:auto;
  .table {
    height:20.5rem;
    width:100%;
    margin-top:0.2rem;
    margin-bottom:0;
    .tr{
      width:100%;
      display:flex;        
    }
    .th {
      display:block;
      min-height:10rem;
      width:50px;
      min-width:50px;
      max-width:50px;
      font-weight: normal !important;
      background: rgb(230, 230, 230);
      border:1px solid rgb(213, 213, 213);
    }
    .td {
      display:block;
      word-break:break-all;
      width: calc(100% - 50px);
      border:1px solid rgb(213, 213, 213);
    }
  } 
}
  .soap-data{
    .tr:nth-child(2n) {
      background: #f7f7f7;
    }    
  }
  .content_editable_icon {
    button {
        margin-top: 8px;
        margin-right: 0.3rem;
        width: 2.4rem;
        font-weight: bold;
        height:27px;
        line-height: 25px;
    }
    .color-icon {
        text-align: center;
        padding: 0;
    }
    .set-font-color {
        margin-bottom: 0;
        width: 100%;
        border-bottom: 2px solid;
        cursor: pointer;
        height: 100%;
        line-height: 25px;
    }
    .color_picker_area {
        .color-block-area {
            background-color: white;
            border: 1px solid #aaa;
        }
        .color-block {
            width: 15px;
            margin: 4px;
            height: 15px;
            cursor: pointer;
        }
    }
    .font_select_area {
        left: 140px!important;
        border: 1px solid #aaa;
        width: 30px;
        border-top: none;
        .font-block-area {
            background-color: white;
        }
        .font-block {
            cursor: pointer;
            border-top: 1px solid #aaa;
        }
    }
  }  
  .create_info {
    width: auto;
    text-align:right;
    label {
      width: 80px;
      text-align: right;
      margin-right: 10px;
      font-size: 14px;
      margin-top:0px;
    }
    .react-datepicker-wrapper{
      width: auto;
      div{
        width:100%;
      }
      input{
        width:100%;
        height:25px;        
      }
    }
    .datetime-area{
      float:right;
      input{
        width:90px;
      }
    }
    .remove-x-input{
      float:right;
      input{
        width: 270px;
        height:25px;
      }
      .label-title{
        margin-top:3px;
      }
    }
  }
  .selected-tr {
    background:lightblue!important;
    article{
    }
  }
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  width: 100%;
  min-height: 68vh;
  float: left;
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
 .fl {
    float: left;
 }
 .inline-flex {
    display: inline-flex;
 }
  .selected, .selected:hover{
    background:lightblue!important;      
  }

  p{
      cursor:pointer;
  }

  .display-none{
    display:none;
  }
  .display-force-none{
    display:none !important;
  }
  .continue_input{
    margin-right: 20px;
  }
  .panel-menu {
    width: 100%;
    margin-bottom: 20px;
    font-weight: bold;
    .menu-btn {
        width:100px;
        text-align: center;
        border-bottom: 1px solid black;
        background-color: rgba(200, 194, 194, 0.22);
        padding: 5px 0;
        cursor: pointer;
    }
    .active-menu {
        width:100px;
        text-align: center;
        border-top: 1px solid black;
        border-right: 1px solid black;
        border-left: 1px solid black;
        padding: 5px 0;
    }
    .no-menu {
        width: calc(100% - 400px);
        border-bottom: 1px solid black;
        background-color: rgba(200, 194, 194, 0.22);
    }
  }
  .work-area {
    width: 100%;    
    // height: calc(100% - 7rem);
    height: 64vh;
    // overflow-y: auto;
    margin-bottom: 10px;
    .react-datepicker-wrapper {
        width: calc(100% - 90px);
        .react-datepicker__input-container {
            width: 100%;
            input {
                font-size: 14px;
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
    .left-area {
        width: 706px;
        height: 100%;
        .work-list{
            height: 55vh;
        }
        .area-1 {
            width: 40%;
            border:1px solid black;
            margin-right: 10px;
            p {
                margin: 0;
                padding-left: 5px; 
            }
            p:hover {
                background-color: rgb(246, 252, 253);
            }
            height: 100%;
            overflow-y:auto;
        }
        .area-2 {
            width: 58%;
            height: 100%;
            .list-1 {
                max-height: 100%;
                overflow-y:auto;
                width: 100%;
                border: 1px solid black;
                p {
                    margin: 0;
                    padding-left: 5px; 
                }
                p:hover {
                    background-color: rgb(246, 252, 253);
                }
            }
            .list-2 {
                max-height: 100%;
                overflow-y:auto;
                width: 50%;
                border-right: 1px solid black;
                border-top: 1px solid black;
                border-bottom: 1px solid black;
            }
        }
        .search-area {
            .select-area {
                width: 50%;
                display: flex;
                .pullbox {
                    width: 70%;
                    .label-title {
                        width: 0;
                    }
                    label {
                        width: 100%;
                        select {
                            width: 100%;
                        }
                    }
                }
                button {
                    height: 38px;
                    margin-left: 10px;
                }
            }
            .period {
                width: 50%;
                display: flex;
                .hvMNwk {
                    margin-top: 0;
                }
                label {
                    width: 0;
                }
                .pd-15 {
                    padding: 8px 0 0 7px;
                }
                .w55 {
                    width: 55px;
                }
                .react-datepicker-wrapper {
                    width: calc(100% - 35px);
                }
                .end-date{
                  .label-title{
                    width:0;
                  }
                }
                input{
                  width:120px;
                }
              }
            }
            .period div:first-child {
                .label-title {
                    width: 35px;
                    font-size: 14px;
                }
            }
        }        
        .table-area {
            height: 42vh;
            border: solid 1px darkgray;
            overflow-y: hidden;            
            .inspection-body{
              height:calc(100% - 61px);
              overflow-y:auto;
              overflow-x: hidden;
              clear:both;
            }
            .table-menu {
                background-color: gainsboro;
            }
            .row-border-bottom {
                border-bottom: 1px solid gray;
                margin-bottom: -2px;
            }
            .exam_name {
                width: 200px;
                border-right: 1px solid gray;
                font-size: 0.875rem;
                line-height: 2rem;
            }
            .exam_unit {
                width: 100px;
                border-right: 1px solid gray;
                font-size: 0.875rem;
                line-height: 2rem;
            }
            .exam_date {
                width: 100px;
                border-right: 1px solid gray;
                border-bottom: 1px solid gray;
            }
            .exam_value {
                width: 50px;
                border-right: 1px solid gray;
                font-size: 0.875rem;
                line-height: 2rem;
            }
            .lh-60 {
                line-height: 2rem!important;
            }
        }
        .history-table-area {
          border: solid 1px darkgray;
          overflow: hidden;
          table {
            margin:0px;
            thead{
              display:table;
              width:calc(100% - 18px);
            }
            tbody{
              display:block;
              overflow-y: scroll;
              height:43vh;
              width:100%;
            }
            tr{
              display: table;
              width: 100%;
            }
            td {
              word-break: break-all;
              padding: 0.25rem;
              p{
                margin-bottom:0px;
              }
            }
            th {
                position: sticky;
                text-align: center;
                padding: 0.3rem;
            }              
            .tl {
                text-align: left;
            }
            .date_col{
              width:6.5rem;
            }
            .time_col{
              width:3.5rem;
            }
            .inputer_col{
              width:10rem;
            }
          }
        }
        .block-area {
            width: 100%;
            eight: calc(100% - 90px);
            display: flex;   
            .div-parent{
              height: 33rem;
              canvas{
                height: 25rem;
              }
            }
            .block-1{
              svg{
                height: 3.1rem;
              }
            }       
            .block-2{
              .pullbox-title{
                font-size: 1.1rem;
                line-height: 2.3rem;
                height: 2.3rem;
              }
              .pullbox-label{
                margin-bottom: 0px;
              }
              .pullbox-select{
                height: 2.3rem;
              }
              .div-color{
                div{
                  height: 1.9rem;
                  margin: 0px;
                }                
                .color-title{
                  line-height: 1.9rem;
                }
              }
              .div-paient {
                .pic-comment {
                  textarea {
                    height: 3.5rem !important;
                  }
                }
              }
            }  
            .block-3{
              p{
                span{
                  font-size: 1.55rem;
                }
              }
              .dv-table{
                img{
                  width: 2.9rem;
                }
              }
            }
            .block-4{
              div{
                margin-top:0.5rem;
              }
              button{
                margin: 0.5rem 0px 0.5rem 2.4rem;
                height: 2.3rem;
              }
              input{
                margin-left: 1.8rem;
                height: 2.3rem;
              }
              .dv-input{
                font-size:0.9rem;
              }
            }
            .block-area-1 {
                width: 28%;
            }
            .block-area-2 {
                width: 70%;
                padding-left: 10%;
                padding-right: 10%;
                .load-pic {
                    border: 1px solid black;
                    text-align: center;
                    margin-bottom: 10px;
                    padding: 5px;
                    cursor: pointer;
                }
                .edit-pic {
                    border: 1px solid black;
                    height: 50%;
                    margin-bottom: 5px;
                }
                .label-comment {
                    padding-top: 5px;
                    padding-bottom: 5px;
                }
                .pic-comment {
                    textarea {
                        width: 100%;
                        margin: 0px;
                        height: 4rem !important;
                    }
                }
            }
        }
    }
  }
  .master_btns{
      width: calc(100% - 210px);
      button{
        margin-left:10px;
        margin-right:10px;
      }
  }
  .radio-btn label{
    font-size: 12px;
    width: 100px;
    border: solid 1px black;
    border-radius: 4px;
    padding: 4px 5px;
    text-align:center;
    margin-right: 5px;
  }
  .radio-btn input:checked + label {
    border-color: #08bfe1;
  }
  .btn_names {
    margin-top: 10px;
    margin-bottom: 10px;
    button{
        margin-left:10px;
        margin-right:10px;
    }
  }
    
  .label-title{
    width:100px;
    font-size:18px;
  }
`;

const btn_names = [
  "薬剤マスタ",
  "注射マスタ",
  "定期検査",
  "ダイアライザ",
  "他施設マスタ",
];

class InputKartePanel extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    
    let cur_date = new Date();

    var modal_data = this.props.modal_data;    
    var kind = this.props.kind;
    var body = "";
    var body_instruction = "";
    var number = 0, number_instruction = 0;
    var reserve_date = new Date();
    if (this.props.schedule_date != undefined && this.props.schedule_date != null) reserve_date = new Date(this.props.schedule_date);    
    this.changeState = false;
    this.course_imageBase64 = null;
    this.dr_instruction_imageBase64 = null;
    this.course_imageComment = null;
    this.dr_instruction_imageComment = null;

    this.body_validate_data = sessApi.getObjectValue('init_status', 'dial_schedule_validate');
    this.body_validate_data = this.body_validate_data.karte;
    if(this.body_validate_data != undefined && this.body_validate_data != null) this.body_validate_data = this.body_validate_data.body;
    let kind_arr = null;
    if (kind != undefined && kind != null && kind != "") {
      kind_arr = kind.split("/");
    }

    if (
      kind_arr != null &&
      kind_arr != undefined &&
      modal_data != null &&
      modal_data.length > 0
    ) {      
      modal_data.map((item) => {
        if (item.category_1 == 'Drカルテ'){
          if (item.category_2 == '経過'){
            body = item.body;
            number = item.number;
            this.course_imageComment = item.image_comment;
          } else if (item.category_2 == '指示'){
            body_instruction = item.body;
            number_instruction = item.number;
            this.dr_instruction_imageComment = item.image_comment;
            reserve_date = item.write_date.split(' ')[0];
            reserve_date = new Date(reserve_date);
          } else {
            if (item.relation > 0 && number_instruction == 0){
              number_instruction = item.relation;
            }
          }
        }
      });      
    }

    this.original_body = body; // check change data after close button click
    this.original_body_instruction = body_instruction; // check chane data after close button click

    // let code_master = sessApi.getObjectValue("dial_common_master","code_master");
    let examinationCodeData = sessApi.getObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER,"examination_master");
    
    var isConfirmComplete = false;
    var complete_message = '';

    this.state = {
      number,
      number_instruction,
      kind,
      tab_id: 0,
      implementationIntervalType: "",
      entry_time: "",
      exam_pattern_code: 0,
      examination_start_date: new Date(cur_date.getFullYear(),cur_date.getMonth(),1),
      examination_end_date: cur_date,
      showWeight: false,
      showDW: false,
      word_pattern_list: [],
      word_list: [],
      selected_word_number: 0,
      selected_pattern_number: 0,
      body,
      body_instruction,
      usable_page: "",
      schedule_date: this.props.schedule_date,
      exam_table_data: [],
      confirm_message: "",
      confirm_alert_title:'',
      isUpdateConfirmModal: false,
      isCloseConfirmModal: false,
      isShowDoctorList: false,
      modal_data,
      timeline_number: this.props.timeline_number,

      examinationCodeData,
      examination_codes: makeList_code(examinationCodeData),
      isOpenInstructionModal: false,
      isConfirmComplete,
      complete_message,
      stop_button:false,
      alert_message:'',
      is_loaded: false,
      is_small_loaded:true,
      search_order: 1,
      cur_imageBase64: null,
      reserve_date,
      cur_imageComment:kind == "Drカルテ/指示"? this.dr_instruction_imageComment: this.course_imageComment,      
    };

    this.VALeftNav = React.createRef();
    this.didmount = false;
  }

  async componentDidMount() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.props.closeCompleteModal();
    let dr_karte_cache = localApi.getObject("dr_karte_cache");
    if (dr_karte_cache != null && dr_karte_cache.schedule_date != undefined && dr_karte_cache.system_patient_id != undefined && authInfo !== undefined && authInfo.user_number != null && authInfo.user_number == dr_karte_cache.user_number) {
      if (dr_karte_cache.state != undefined && dr_karte_cache.state != null) {
        if (dr_karte_cache.state.isOpenInstructionModal != true) {
          this.closeCompleteModal();
        } else {
          this.setState({
            isConfirmComplete:true,
            complete_message:'読み込み中',
            stop_button:true
          })          
        }        
      }
    }

    await this.setDoctors();
    let server_time = await getServerTime();
    var cur_date = new Date(server_time);
    var reserve_date = new Date(server_time);
    if (this.props.schedule_date != undefined && this.props.schedule_date != null) reserve_date = new Date(this.props.schedule_date);    
    var modal_data = this.props.modal_data;
    if (modal_data != undefined && modal_data != null){
      modal_data.map((item) => {
        if (item.category_1 == "Drカルテ" && item.category_2 == "指示") {
          reserve_date = item.write_date.split(' ')[0];
          reserve_date = new Date(reserve_date);
        }
      });
    }
    if (this.context.selectedDoctor.code > 0) {
      this.setState({
        instruction_doctor_number: parseInt(this.context.selectedDoctor.code),
        directer_name: this.context.selectedDoctor.name,
      });
    }
    await this.setInputKind(this.state.kind);
    await this.getDialyzerCode();
    await this.getExamPattern();
    await this.getExamDataList();
    await this.getStaffs();
    await this.getSoapInfo();
    await this.getImageInfo();
    this.setState({
      examination_start_date: new Date(cur_date.getFullYear(),cur_date.getMonth(),1),
      examination_end_date:cur_date,
      reserve_date
    })

    let elements = document.getElementsByClassName("content_editable_area");
    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', this.getSeleteTag, false);
    }
    dr_karte_cache = localApi.getObject("dr_karte_cache");
    if (dr_karte_cache != null && dr_karte_cache.schedule_date != undefined && dr_karte_cache.system_patient_id != undefined && authInfo.user_number == dr_karte_cache.user_number) {
      this.course_imageBase64 = dr_karte_cache.course_imageBase64;
      this.course_imageComment = dr_karte_cache.course_imageComment;
      this.dr_instruction_imageBase64 = dr_karte_cache.dr_instruction_imageBase64;
      this.dr_instruction_imageComment = dr_karte_cache.dr_instruction_imageComment;
      if (dr_karte_cache.state != undefined && dr_karte_cache.state != null) {
        let state_data = dr_karte_cache.state;
        if (state_data.examination_end_date !== undefined && state_data.examination_end_date != null)
          state_data.examination_end_date = new Date(state_data.examination_end_date);
        if (state_data.examination_start_date !== undefined && state_data.examination_start_date != null)
          state_data.examination_start_date = new Date(state_data.examination_start_date);
        if (state_data.reserve_date !== undefined && state_data.reserve_date != null)
          state_data.reserve_date = new Date(state_data.reserve_date);        
        if (state_data.isOpenInstructionModal != true) {
          state_data.isConfirmComplete = false;
          state_data.complete_message = '';
          state_data.stop_button = false;
        } else {
          state_data.isConfirmComplete = true;
          state_data.complete_message = '読み込み中';
          state_data.stop_button = true;
        }        
        this.setState(state_data);
        if (authInfo.doctor_number == 0 && this.state.instruction_doctor_number > 0 && this.state.doctor_list_by_number != undefined && 
        this.state.doctor_list_by_number[this.state.instruction_doctor_number] !== undefined) {
          this.context.$updateDoctor(this.state.instruction_doctor_number, this.state.doctor_list_by_number[this.state.instruction_doctor_number]);
        }
      }
    } else {
      let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
      let system_patient_id = this.props.patient_id;
      dr_karte_cache = {};
      
      if (schedule_date != null && system_patient_id > 0 && authInfo !== undefined && authInfo != null){
        dr_karte_cache.system_patient_id = system_patient_id;
        dr_karte_cache.props = this.props;
        dr_karte_cache.schedule_date = schedule_date;
        dr_karte_cache.user_number = authInfo.user_number;
      }
      localApi.setObject("dr_karte_cache",dr_karte_cache);
    }

    this.didmount = true;
  }

  getSeleteTag=()=>{
    let parentNode_name = window.getSelection().anchorNode.parentNode.tagName;
    let bold_btn = document.getElementsByClassName("bold-btn")[0];
    let italic_btn = document.getElementsByClassName("italic-btn")[0];
    let font_color_btn = document.getElementsByClassName("set-font-color")[0];
    if(bold_btn !== undefined && bold_btn != null){
      if(parentNode_name == "STRONG" || parentNode_name == "B"){
        bold_btn.style['background-color'] = "#aaa";
      } else {
        bold_btn.style['background-color'] = "";
      }
    }
    if(italic_btn !== undefined && italic_btn != null){
      if(parentNode_name == "EM" || parentNode_name == "I"){
        italic_btn.style['background-color'] = "#aaa";
      } else {
        italic_btn.style['background-color'] = "";
      }
    }
    if(font_color_btn !== undefined && font_color_btn != null){
      if(parentNode_name == "FONT"){
        let font_color =  window.getSelection().anchorNode.parentNode.color;
        if(font_color !== undefined && font_color != null && font_color != ""){
          this.changeBtnColor(font_color);
        }
      }
    }    
  }

  openConfirmCompleteModal =(message)=>{
    this.setState({
      isConfirmComplete:true,
      complete_message: message,
      stop_button:false,
    });
  };

  stopLoading = () => {
    this.closeCompleteModal();
    localApi.remove('dr_karte_cache');
  }

  closeCompleteModal = () => {
    this.setState({
      isConfirmComplete:false,
      complete_message:'',
      stop_button:false,
    })
  }
  
  componentWillUnmount() {
    sessApi.remove('dial_change_flag');
    let dr_karte_cache = localApi.getObject("dr_karte_cache");
    if (dr_karte_cache !== undefined && dr_karte_cache != null) {
      let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      if (authInfo !== undefined && authInfo != null && authInfo.user_number == dr_karte_cache.user_number) {
        localApi.remove('dr_karte_cache');
      }
    }
  }

  shouldComponentUpdate(nextprops, nextstate) {
    this.changeState = JSON.stringify(this.state) != JSON.stringify(nextstate);
    this.changeProps = JSON.stringify(this.props) != JSON.stringify(nextprops);    
    if (!this.changeState) {
      return false;
    }
    if (this.didmount) {
      let dr_karte_cache = localApi.getObject("dr_karte_cache");
      if (dr_karte_cache == undefined || dr_karte_cache == null) dr_karte_cache = {};
      dr_karte_cache.state = JSON.parse(JSON.stringify(nextstate));
      dr_karte_cache.course_imageBase64 = this.course_imageBase64;
      dr_karte_cache.course_imageComment = this.course_imageComment;
      dr_karte_cache.dr_instruction_imageBase64 = this.dr_instruction_imageBase64;
      dr_karte_cache.dr_instruction_imageComment = this.dr_instruction_imageComment;      
      localApi.setObject("dr_karte_cache", dr_karte_cache);
    }
    return true;
  }

  getSoapInfo = async () => {
    if (!(this.props.patient_id > 0)) {
      return;
    }
    let path = "/app/api/v2/dial/board/Soap/search_for_history_karte";
    await apiClient
      ._post(path, {
        params: {
          is_enabled: 1,
          system_patient_id: this.props.patient_id,
          date: this.state.schedule_date,
        },
      })
      .then((res) => {
        if (res.length != 0) {
          this.setState({
            treat_monitor_list: res,
          });
        } else {
          this.setState({
            treat_monitor_list: [],
          });
        }
      })
      .catch(() => {});
  };
  getImageInfo = async () => {
    let path = "/app/api/v2/dial/board/Soap/get_image_by_number";
    if (this.state.number > 0) {
      await apiClient
        ._post(path, {
          params: {
            number: this.state.number,
          },
        })
        .then((res) => {
          if (res) {
            this.course_imageBase64 = res;
          }
        })
        .catch(() => {});
    }
    if (this.state.number_instruction > 0) {
      await apiClient
        ._post(path, {
          params: {
            number: this.state.number_instruction,
          },
        })
        .then((res) => {
          if (res) {
            this.dr_instruction_imageBase64 = res;
          }
        })
        .catch(() => {});
    }

    if (this.state.kind == "Drカルテ/経過") {
      this.setState({
        cur_imageBase64: this.course_imageBase64,
      });
    } else {
      this.setState({
        cur_imageBase64: this.dr_instruction_imageBase64,
      });
    }
  };

  setInputKind = async (kind) => {
    // check shema image exist
    if (this.VALeftNav.current != null && this.VALeftNav.current.stageRef != null && this.VALeftNav.current.stageRef != undefined) {
      if (this.VALeftNav.current.updated == 1 || this.VALeftNav.current.state.comment != "") {
        let dataURL = this.VALeftNav.current.stageRef.current.toDataURL();
        if (dataURL != "") {
          if (this.state.kind == "Drカルテ/経過") {
            this.course_imageBase64 = dataURL;
          } else {
            this.dr_instruction_imageBase64 = dataURL;
          }
          // if (this.VALeftNav.current.state.comment != "") {
          //     post_data.image_comment = this.VALeftNav.current.state.comment;
          // }
          // post_data.background_image_number = this.state.img_version;
        }
      }
      if (this.VALeftNav.current.state.comment != undefined && this.VALeftNav.current.state.comment != null) {
        if (this.state.kind == "Drカルテ/経過") {
          this.course_imageComment = this.VALeftNav.current.state.comment;
        } else {
          this.dr_instruction_imageComment = this.VALeftNav.current.state.comment;
        }
      }
    }

    await this.getWordInfo(kind);
    let _state = {
      prefix: "",
      kind: kind,
    };

    if (kind == "Drカルテ/経過") {
      _state.cur_imageBase64 = this.course_imageBase64;
      _state.cur_imageComment = this.course_imageComment;
    } else if (kind == "Drカルテ/指示") {
      _state.cur_imageBase64 = this.dr_instruction_imageBase64;
      _state.cur_imageComment = this.dr_instruction_imageComment;
    }

    this.setState(_state);
  };

  getWordInfo = async (kind) => {
    var usable_page = "";
    switch (kind) {
      case "S":
        usable_page = "処置モニタ/S";
        break;
      case "O":
        usable_page = "処置モニタ/O";
        break;
      case "A":
        usable_page = "処置モニタ/A";
        break;
      case "P":
        usable_page = "処置モニタ/P";
        break;
      case "指示":
        usable_page = "処置モニタ/指示";
        break;
      case "Drカルテ/経過":
        usable_page = kind;
        break;
      case "Drカルテ/所見":
        usable_page = kind;
        break;
      case "Drカルテ/指示":
        usable_page = "処置モニタ/指示";
        break;
      case "申し送り/次回":
        usable_page = "申し送り/当日のみ";
        break;
      case "申し送り/継続":
        usable_page = "申し送り/継続";
        break;
      case "Dr上申":
        usable_page = "申し送り/当日のみ";
        break;
      default:
        usable_page = "処置モニタ/S";
        break;
    }
    this.setState({
      usable_page,
    });
    let path = "/app/api/v2/dial/board/searchWordPattern";
    await apiClient
      ._post(path, {
        params: {
          is_enabled: 1,
          usable_page: usable_page,
          order: 'order',
        },
      })
      .then((res) => {
        if (res.length > 0) {
          this.setState(
            {
              word_pattern_list: res,
              selected_pattern_number:
                res != null &&
                res != undefined &&
                res.length > 0 &&
                res[0].number > 0
                  ? res[0].number
                  : this.state.selected_pattern_number,
            },
            () => {
              this.getWordsFromPattern(this.state.selected_pattern_number);
            }
          );
        } else {
          this.setState({
            word_pattern_list: [],
            word_list: [],
            selected_pattern_number: 0,
          });
        }
      })
      .catch(() => {});
  };

  getWordsFromPattern = async (pattern_number) => {
    this.setState({ is_word_loaded: false, word_list: [] });
    let path = "/app/api/v2/dial/board/searchWords";
    let post_data = {
      pattern_number: pattern_number,
      is_enabled: 1,
      order: 'order',
    };
    await apiClient
      ._post(path, {
        params: post_data,
      })
      .then((res) => {
        this.setState({
          word_list: res,
          selected_pattern_number: pattern_number,
          is_word_loaded: true,
          is_loaded:true
        });
      })
      .catch(() => {});
  };

  showMasterModal = (index) => {
    switch (index) {
      case 0:
        this.setState({ isMedicineMaster: true });
        break;
      case 1:
        this.setState({ isInjectionMaster: true });
        break;
      case 2:
        this.setState({ isExaminationMaster: true });
        break;
      case 3:
        this.setState({ isDailyserMaster: true });
        break;
      case 4:
        this.setState({ isOtherFacilityMaster: true });
        break;
    }
  };

  closeModal = () => {
    this.setState({
      isMedicineMaster: false,
      isInjectionMaster: false,
      isExaminationMaster: false,
      isDailyserMaster: false,
      isOtherFacilityMaster: false,
      isShowDoctorList: false,
      isOpenInstructionModal: false,
    });
    if (this.context.selectedDoctor.code > 0) {
      this.setState({
        instruction_doctor_number: parseInt(this.context.selectedDoctor.code),
        directer_name: this.context.selectedDoctor.name,
      });
    }
  };

  checkPrefix = (prefix, body) => {
    if (
      body != undefined &&
      body != null &&
      body != "" &&
      prefix != undefined &&
      prefix != null &&
      prefix != ""
    ) {
      return body.indexOf(prefix) == 0;
    } else return false;
  };

  checkBody = (prefix, body) => {
    if (
      body != undefined &&
      body != null &&
      prefix != undefined &&
      prefix != null &&
      prefix != ""
    ) {
      if (body.replace(prefix, "") != "") return true;
      else return false;
    } else return false;
  };

  checkValidation = () => {
    let error_str_arr = [];
    removeRedBorder('body_id');
    var body = this.state.body;
    var body_instruction = this.state.body_instruction;
    if (this.stripHtml(body).trim() == ''){
      body = '';
      this.setState({body:''});
    }      
    if (this.stripHtml(body_instruction).trim() == '') {
      body_instruction = '';
      this.setState({body_instruction:''})
    }
    
    if (body == "" && body_instruction == "" && (this.state.preview_kartes == undefined || this.state.preview_kartes == null || this.state.preview_kartes.length == 0)) {
      // error_str_arr.push("本文を入力してください。");
      error_str_arr.push(this.body_validate_data.requierd_message);
      addRedBorder('body_id');
    }
    if (this.stripHtml(this.state.body).length > this.body_validate_data.length){
      // error_str_arr.push("経過本文を100文字以下で入力してください。");
      error_str_arr.push("経過" + this.body_validate_data.overflow_message);
      addRedBorder('body_id');    
    }
    if (this.stripHtml(this.state.body_instruction).length > this.body_validate_data.length){
      // error_str_arr.push("指示本文を100文字以下で入力してください。");
      error_str_arr.push("指示" + this.body_validate_data.overflow_message);
      addRedBorder('body_id');
    }
    this.setState({first_tag_id:'body_id'});
    return error_str_arr;
  }

  handleOk = () => {
    if (this.state.is_small_loaded != true) return;
    let error_str_array = this.checkValidation();
    if (error_str_array.length > 0 ) {
      this.saveShemaInfo();
      this.setState({alert_message:error_str_array.join('\n')});
      return;
    }
    var operation_type = '';
    if ((this.state.number > 0 && this.state.kind == "Drカルテ/経過") || (this.state.number_instruction > 0 && this.state.kind == "Drカルテ/指示")){
      operation_type = '変更';
    } else {
      operation_type = '登録';
    }
        
    let _state = {
      isUpdateConfirmModal: true,
      // confirm_message: this.state.kind + "情報を" + operation_type +  "しますか?",
      confirm_message:"Drカルテ情報を" + operation_type +  "しますか?",
    };
    // check shema image exist
    if (
      this.VALeftNav.current != null &&
      this.VALeftNav.current.stageRef != null &&
      this.VALeftNav.current.stageRef != undefined
    ) {
      if (
        this.VALeftNav.current.updated == 1 ||
        this.VALeftNav.current.state.comment != ""
      ) {
        let dataURL = this.VALeftNav.current.stageRef.current.toDataURL();
        if (dataURL != "") {
          // image
          if (this.state.tab_id == 3) {
            if (this.state.kind == "Drカルテ/経過") {              
              this.course_imageBase64 = dataURL;
            } else {
              this.dr_instruction_imageBase64 = dataURL;
            }
            _state.cur_imageBase64 = dataURL;
          }
        }
      }
      if (
        this.VALeftNav.current.state.comment != undefined &&
        this.VALeftNav.current.state.comment != null
      ) {
        // image comment
        if (this.state.tab_id == 3) {
          if (this.state.kind == "Drカルテ/経過") {
            this.course_imageComment = this.VALeftNav.current.state.comment;
          } else {
            this.dr_instruction_imageComment = this.VALeftNav.current.state.comment;
          }
          _state.cur_imageComment = this.VALeftNav.current.state.comment;
        }
      }
    }
    this.setState(_state);
  };
  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isCloseConfirmModal: false,
      confirm_message: "",
      alert_message:'',
      confirm_alert_title:'',
    });
  }

  saveShemaInfo = () => {
    let _state = {};
    // check shema image exist
    if (
      this.VALeftNav.current != null &&
      this.VALeftNav.current.stageRef != null &&
      this.VALeftNav.current.stageRef != undefined
    ) {
      if (
        this.VALeftNav.current.updated == 1 ||
        this.VALeftNav.current.state.comment != ""
      ) {
        let dataURL = this.VALeftNav.current.stageRef.current.toDataURL();
        if (dataURL != "") {
          // image
          if (this.state.kind == "Drカルテ/経過") {
            this.course_imageBase64 = dataURL;
          } else {
            this.dr_instruction_imageBase64 = dataURL;
          }
          _state.cur_imageBase64 = dataURL;
        }
      }
      if (
        this.VALeftNav.current.state.comment != undefined &&
        this.VALeftNav.current.state.comment != null
      ) {
        // image comment
        if (this.state.kind == "Drカルテ/経過") {
          this.course_imageComment = this.VALeftNav.current.state.comment;
        } else {
          this.dr_instruction_imageComment = this.VALeftNav.current.state.comment;
        }
        _state.cur_imageComment = this.VALeftNav.current.state.comment;
      }
    }

    this.setState(_state);
  };

  saveBody = async () => {    
    if (this.state.tab_id == 3) {
      this.saveShemaInfo();
    }
    if (
      this.state.kind == "Drカルテ/経過" ||
      this.state.kind == "Drカルテ/所見" ||
      this.state.kind == "Drカルテ/指示"
    ) {
      if (
        this.state.instruction_doctor_number == undefined ||
        this.state.instruction_doctor_number == null ||
        this.state.instruction_doctor_number === 0
      ) {
        // window.sessionStorage.setItem("alert_messages", '指示者を選択してください。');
        this.showDoctorList();
        this.confirmCancel();
        return;
      }
    }

    var course = this.state.body;
    var dr_instruction = this.state.body_instruction;
    if (dr_instruction == undefined || dr_instruction == null || dr_instruction == '') dr_instruction = ' ';
    // if (dr_instruction == "" && (this.state.preview_kartes !== undefined && this.state.preview_kartes != null && this.state.preview_kartes.length > 0)) {
    //   dr_instruction = " ";
    // }
    // if (dr_instruction == "" && this.state.number_instruction > 0) {
    //   dr_instruction = " ";
    // }
    var karte_data = this.state.karte_data;
    this.openConfirmCompleteModal("保存中");
    let path = "/app/api/v2/dial/board/karte/registerByMode";
    // let mode = 1;
    let post_data = {
      number: this.state.number,
      number_instruction: this.state.number_instruction,
      timeline_number: this.state.timeline_number,
      system_patient_id: this.props.patient_id,
      write_date: formatTime(this.state.entry_time),
      schedule_date:
        this.state.reserve_date != undefined && this.state.reserve_date != ""
          ? formatDateLine(this.state.reserve_date)
          : formatDateLine(new Date()),
      course: removeFirstBreak(course),
      dr_instruction: removeFirstBreak(dr_instruction),
      karte_data: karte_data,
      instruction_doctor_number: this.state.instruction_doctor_number,
      mode: 0,
      course_imageBase64: this.course_imageBase64,
      dr_instruction_imageBase64: this.dr_instruction_imageBase64,
      course_image_comment: this.course_imageComment,
      dr_instruction_image_comment: this.dr_instruction_imageComment,
      search_date: this.props.schedule_date
    };

    /*// check shema image exist
        if (this.VALeftNav.current != null && this.VALeftNav.current.stageRef != null && this.VALeftNav.current.stageRef != undefined) {                
            if(this.VALeftNav.current.updated == 1 || this.VALeftNav.current.state.comment != ""){
                let dataURL = this.VALeftNav.current.stageRef.current.toDataURL();
                if (dataURL != "") {
                    post_data.imageBase64 = dataURL;
                    if (this.VALeftNav.current.state.comment != "") {
                        post_data.image_comment = this.VALeftNav.current.state.comment;
                    }
                    post_data.background_image_number = this.state.img_version;
                }
            }
        }*/

    // check shema image exist
    if (
      this.VALeftNav.current != null &&
      this.VALeftNav.current.stageRef != null &&
      this.VALeftNav.current.stageRef != undefined
    ) {
      if (
        this.VALeftNav.current.updated == 1 ||
        this.VALeftNav.current.state.comment != ""
      ) {
        let dataURL = this.VALeftNav.current.stageRef.current.toDataURL();
        if (dataURL != "") {
          if (this.state.kind == "Drカルテ/経過") {
            post_data.course_imageBase64 = dataURL;
          } else {
            post_data.dr_instruction_imageBase64 = dataURL;
          }
        }
      }
    }

    let timeline_number = this.state.timeline_number;
    var instruction_number = null;
    await apiClient
      ._post(path, {
        params: post_data,
      })
      .then((res) => {
        timeline_number = res.timeline_number;
        instruction_number = res.instruction_number;
        this.setState({ isConfirmComplete: false });
        // if (this.state.number > 0){
        //   window.sessionStorage.setItem(
        //     "alert_messages",
        //     "変更完了##" + "変更しました。"
        //   );
        // } else {
        //   window.sessionStorage.setItem(
        //     "alert_messages",
        //     "登録完了##" + "登録しました。"
        //   );
        // }
        this.props.handleOk(res);
      })
      .catch(() => {
        this.setState({ isConfirmComplete: false });
        window.sessionStorage.setItem("alert_messages", "失敗しました");
      });

    if (timeline_number == undefined || timeline_number == null) {
      // error process
    } else {
      let postData = { ...post_data };

      postData["mode"] = 1;
      postData["timeline_number"] = timeline_number;
      postData["instruction_number"] = instruction_number;
      await apiClient._post(path, {
        params: postData,
      })
      .then(() => {
        // this.setState({ isConfirmComplete: false });        
        if (this.state.number > 0){
          window.sessionStorage.setItem("alert_messages","変更完了##" + "変更しました。");
        } else {
          window.sessionStorage.setItem("alert_messages","登録完了##" + "登録しました。");
        }
      })
      .catch(()=> {
        this.setState({ isConfirmComplete: false });
        window.sessionStorage.setItem("alert_messages", "失敗しました");
      });
    }
    this.props.handleOk();
    
  };

  saveKarteData = async (karte_data) => {
    //display preview modified data-----------------------------------
    this.setState({is_small_loaded:false})
    let path = "/app/api/v2/dial/board/karte/registerByMode";
    let post_data = {
      number: this.state.number,      
      system_patient_id: this.props.patient_id,
      karte_data: karte_data,      
      mode: 2,
      search_date: this.props.schedule_date
    };    
    await apiClient._post(path, {
      params: post_data,
    })
    .then((res) => {
      if (res != null && res.kartes != undefined){
        this.setState({
          preview_kartes:res.kartes,
          is_small_loaded:true,
        })
      }
    });
    //-------------------------------------------------------

    this.setState({ karte_data });
    if (this.context.selectedDoctor.code > 0) {
      this.setState({
        instruction_doctor_number: parseInt(this.context.selectedDoctor.code),
        directer_name: this.context.selectedDoctor.name,
      });
    }
  };

  getTextBody = (e) => {
    if (this.state.tab_id == 3) {
      this.saveShemaInfo();
    }
    if (this.state.kind == "Drカルテ/経過") {
      this.setState({ body: e.target.value });
    } else {
      this.setState({ body_instruction: e.target.value });
    }
  };

  selectPattern = (selected_pattern_number) => {
    this.setState(
      {
        selected_pattern_number,
        selected_word_number: 0,
      },
      () => {
        this.getWordsFromPattern(this.state.selected_pattern_number);
      }
    );
  };

  addWord = (word, selected_word_number = null) => {
    var temp = this.state.kind == "Drカルテ/経過" ? this.state.body : this.state.body_instruction;
    if (temp == '<br>') temp = '';
    if (temp == '<br/>') temp = '';
    if (temp == '<br />') temp = '';
    if (this.IsJsonString(word)) {
      temp = temp + '<span>' + this.getprescriptionRender(JSON.parse(word)) +'</span>';
    } else {
      temp = temp + '<span>' + insertLineBreak(word) +'</span>';
    }
    if (this.state.kind == "Drカルテ/経過") {
      this.setState({ body: temp });
    } else {
      this.setState({ body_instruction: temp });
    }
    if (selected_word_number != null) {
      this.setState({ selected_word_number });
    }
  };

  selectMaster = (master) => {
    if (this.state.kind == "Drカルテ/経過") {
      this.setState({
        body: this.state.body + master.name,
      });
    } else {
      this.setState({
        body_instruction: this.state.body_instruction + master.name,
      });
    }

    this.closeModal();
  };

  SetImplementationIntervalType = (value) => {
    this.setState({ implementationIntervalType: value });
  };

  insertStrTimeStyle=(input)=>{
    return input.slice(0, 2) + ':' + input.slice(2,input.length);
  }

  timeKeyEvent = (e) => {    
    var start_pos = e.target.selectionStart;
    var end_pos = e.target.selectionEnd;
    var key_code = e.keyCode;    
    this.key_code = key_code;
    this.start_pos = start_pos;
    var obj = document.getElementById('input_time_id');

    let input_value = e.target.value;    
    
    if (start_pos == end_pos) {
      if (key_code == 37 && start_pos == 3){
        e.target.setSelectionRange(start_pos-1, start_pos-1);
      }
      if (key_code == 39 && start_pos == 2){
        e.target.setSelectionRange(start_pos+1, start_pos+1);
      }
    }

    input_value = input_value.replace(/[^0-9０-９]/g, '');
    if (input_value.length > 4) return;
    input_value = toHalfWidthOnlyNumber(input_value);

    if(input_value.length >= 2 ){
      input_value = this.insertStrTimeStyle(input_value);
    }

    if (key_code == 9) {
      this.setTime(e);
      return;
    }
    
    if (key_code == 8){          
      if (input_value.length == 1 && start_pos == 1 && start_pos == end_pos){
        this.setState({input_time_value:''}, () => {
          obj.setSelectionRange(0, 0);
        })
        e.preventDefault();
      }
      if (input_value.length == 3 && start_pos == 1 && start_pos == end_pos){
        input_value = input_value.slice(1.2);
        this.setState({input_time_value:input_value}, () => {
          obj.setSelectionRange(0,0);
        });
        e.preventDefault();
      }
      if (start_pos == end_pos && start_pos == 3){        
        input_value = input_value.slice(0,1) + input_value.slice(3, input_value.length);        
        this.setState({
          input_time_value:input_value,
        }, () => {
          obj.setSelectionRange(1, 1);
        })
        e.preventDefault();
      }
      
      if (start_pos != end_pos){        
        input_value = input_value.slice(0, start_pos) + input_value.slice(end_pos, input_value.length);
        this.setState({
          input_time_value:input_value,
        }, () => {
          obj.setSelectionRange(start_pos, start_pos);
        })
        e.preventDefault();
      }
    }
    if (key_code == 46){
      if (start_pos != end_pos){        
        input_value = input_value.slice(0, start_pos) + input_value.slice(end_pos, input_value.length);
        this.setState({
          input_time_value:input_value,
        }, () => {
          obj.setSelectionRange(start_pos, start_pos);
        })
        e.preventDefault();
      }
      if (input_value.length == 1 && start_pos == 0 && start_pos == end_pos){        
        this.setState({input_time_value:''}, () => {
          obj.setSelectionRange(0, 0);
        })
        e.preventDefault();
      }
      if (start_pos == end_pos && input_value.length == 3){
        if (start_pos == 0){          
          this.setState({
            input_time_value:input_value.slice(1,2),            
          }, () => {
            obj.setSelectionRange(0, 0);
          })
          e.preventDefault();
        }
        if (start_pos == 1){          
          this.setState({
            input_time_value:input_value.slice(0,1),            
          }, () => {
            obj.setSelectionRange(1, 1);
          })
          e.preventDefault();
        }
      }
    }    
    if (key_code != 8 && key_code != 46){
      this.setState({
        input_time_value:input_value,
      })
    }
  }

  getInputTime = (value, e) => {        
    this.saveShemaInfo();
    if (e == undefined){
      this.setState({
        entry_time:value,
        input_time_value:formatTime(value)
      })
      return;
    }
    var input_value = e.target.value;

    input_value = input_value.replace(/[^0-9０-９]/g, '');
    if (input_value.length > 4) return;
    input_value = toHalfWidthOnlyNumber(input_value);

    if(input_value.length >= 2 ){
      input_value = this.insertStrTimeStyle(input_value);
    }
    
    if (input_value.length == 5) this.setTime(e);
    
    this.setState({
      input_time_value:input_value
    }, () => {
      var obj = document.getElementById('input_time_id');
      if (this.key_code == 46){        
        obj.setSelectionRange(this.start_pos, this.start_pos);
      }
      if (this.key_code == 8){        
        obj.setSelectionRange(this.start_pos - 1, this.start_pos - 1);
      }
    })
  };

  setTime = (e) => {        
    if (e.target.value.length != 5) {
      this.setState({
        entry_time:'',
        input_time_value:undefined
      })
      return;
    }    
    var input_value = e.target.value;
    var hours = input_value.split(':')[0];
    var mins = input_value.split(':')[1];    
    if (hours > 23 || mins > 60){
      this.setState({
        entry_time:'',
        input_time_value:undefined
      })      
      return;
    }    
    var now = new Date();
    now.setHours(hours);
    now.setMinutes(mins);
    this.setState({entry_time:now})
  }

  getReserveDate = (value) => {
    this.setState({reserve_date:value})
  }
  setTab = (e, val) => {
    let _state = {
      tab_id: val,
    };
    if (this.state.tab_id == 3 && val != 3) {
      // check shema image exist
      if (
        this.VALeftNav.current != null &&
        this.VALeftNav.current.stageRef != null &&
        this.VALeftNav.current.stageRef != undefined
      ) {
        if (
          this.VALeftNav.current.updated == 1 ||
          this.VALeftNav.current.state.comment != ""
        ) {
          let dataURL = this.VALeftNav.current.stageRef.current.toDataURL();
          if (dataURL != "") {
            if (this.state.kind == "Drカルテ/経過") {
              this.course_imageBase64 = dataURL;
            } else {
              this.dr_instruction_imageBase64 = dataURL;
            }
            _state.cur_imageBase64 = dataURL;
          }
        }
        if (
          this.VALeftNav.current.state.comment != undefined &&
          this.VALeftNav.current.state.comment != null
        ) {
          // image comment
          if (this.state.kind == "Drカルテ/経過") {
            this.course_imageComment = this.VALeftNav.current.state.comment;
          } else {
            this.dr_instruction_imageComment = this.VALeftNav.current.state.comment;
          }
          _state.cur_imageComment = this.VALeftNav.current.state.comment;
        }
      }
    }
    this.setState(_state);
  };

  getExamPatternCode = (e) => {
    this.setState({ exam_pattern_code: e.target.id });
  };

  getExamCodes = () => {
    this.getExamDataList();
  };


  getExamDataList = async () => {
    let path =
      "/app/api/v2/dial/medicine_information/examination_data/getByDrkarte";
    let post_data = {
      system_patient_id: this.props.patient_id,
      examination_start_date: formatDateLine(this.state.examination_start_date),
      examination_end_date: formatDateLine(this.state.examination_end_date),
      curPatternCode: this.state.exam_pattern_code,
    };
    const { data } = await axios.post(path, { params: post_data });
    this.setState({
      exam_table_data: data,
    });
  };
  getStartdate = (value) => {
    this.setState({ examination_start_date: value }, () => {
      this.getExamDataList();
    });
  };

  getEnddate = (value) => {
    this.setState({ examination_end_date: value }, () => {
      this.getExamDataList();
    });
  };
  getShowWeight = (name, value) => {
    if (name === "weight") this.setState({ showWeight: value });
  };
  getShowDW = (name, value) => {
    if (name === "dw") this.setState({ showDW: value });
  };

  showDoctorList = (e) => {

    // ■DN601 入力者関連のラベルのカーソルの統一
    if (e != undefined && (e.target.type == undefined || e.target.type != "text")) return;

    if (this.state.tab_id == 3) {
      this.saveShemaInfo();
    }
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.doctor_number > 0) {
      this.setState({
        instruction_doctor_number: authInfo.doctor_number,
      });
    } else {
      this.setState({
        isShowDoctorList: true,
      });
    }
  };

  selectDoctor = (doctor) => {
    this.setState(
      {
        instruction_doctor_number: doctor.number,
      },
      () => {
        this.context.$updateDoctor(doctor.number, doctor.name);

        this.closeModal();
      }
    );
  };
  setOtherFacility = (data) => {
    if (this.state.kind == "Drカルテ/経過") {
      this.setState({
        body: this.state.body + data,
      });
    } else {
      this.setState({
        body_instruction: this.state.body_instruction + data,
      });
    }
    this.closeModal();
  };

  openInstructionModal = () => {
    this.setState({
      isOpenInstructionModal: true,
      continue_input: true,
    });
  };
  

  getOrderSelect = (e) => {
    //表示順
    this.setState({ search_order: parseInt(e.target.id) }, () => {
      this.getWordInfo();
    });
  };

  checkSO = (category_2) => {
    if (category_2 == "S" || category_2 == "O" || category_2 == "A")
      return true;
    else return false;
  };

  onHide = () => {};

  handleCloseModal = () => {
    let nFlag = sessApi.getObjectValue('dial_change_flag', 'dial_va_left_nav');    
    if (nFlag == 1) {
      if (this.state.tab_id == 3) {
        this.saveShemaInfo();
      }
    }
    if (
      this.state.body != this.original_body ||
      this.state.body_instruction != this.original_body_instruction ||
      this.state.karte_data != undefined ||
      nFlag == 1
    ) {
      this.setState({
        isCloseConfirmModal: true,
        confirm_message: "編集途中の内容があります。\n破棄して閉じますか？",
        confirm_alert_title:'入力中',
      });
      return;
    }
    this.props.closeModal();
  };

  clearImageRef = () => {
    if (this.state.kind == "Drカルテ/経過") {
      this.course_imageBase64 = null;
    } else {
      this.dr_instruction_imageBase64 = null;
    }
    this.setState({
      cur_imageBase64: null,
    });
  };

  closeAlertModal = () => {
    this.setState({ alert_message: '' });
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null){
      $('#' + first_tag_id).focus()
    }
  }
  componentDidUpdate () {
    this.changeBackground();
  }

  changeBackground = () => {    
    if (this.state.body == "" && this.state.body_instruction == "") {
      addRequiredBg("body_id");
    } else {
      removeRequiredBg("body_id");
    }    
  }

  boldBtnClicked =()=>{
    let bold_btn = document.getElementsByClassName("bold-btn")[0];
    if(bold_btn.style['background-color'] == "rgb(170, 170, 170)"){
        bold_btn.style['background-color'] = "";
    } else {
        bold_btn.style['background-color'] = "#aaa";
    }
  }

  italicBtnClicked = ()=>{
      let italic_btn = document.getElementsByClassName("italic-btn")[0];
      if(italic_btn.style['background-color'] == "rgb(170, 170, 170)"){
          italic_btn.style['background-color'] = "";
      } else {
          italic_btn.style['background-color'] = "#aaa";
      }
  }

  colorPickerHover = (e) => {
    let color_picker_area = document.getElementsByClassName("color_picker_area")[0];
    let font_select_area = document.getElementsByClassName("font_select_area")[0];
    // eslint-disable-next-line consistent-this
    // const that = this;
    e.preventDefault();
    document.addEventListener(`click`, function onClickOutside(e) {
        var obj = e.target;
        do {
            if( obj.id !== undefined && obj.id != null && obj.id == "color_sel_icon") return;
            obj = obj.parentElement;
        } while(obj.tagName.toLowerCase() !== "body");
        color_picker_area.style['display'] = "none";
        document.removeEventListener(`click`, onClickOutside);
    });
    window.addEventListener("scroll", function onScrollOutside() {
        color_picker_area.style['display'] = "none";
        window.removeEventListener(`scroll`, onScrollOutside);
    });
    color_picker_area.style['display'] = "block";
    font_select_area.style['display'] = "none";

  };

  changeBtnColor=(color)=>{
    let set_font_color_obj = document.getElementsByClassName("set-font-color")[0];
    if(set_font_color_obj !== undefined && set_font_color_obj != null){
      set_font_color_obj.style['border-color'] = color;
      this.soap_font_color = color;
    }
  }

  fontPickerHover = (e) => {
      let font_select_area = document.getElementsByClassName("font_select_area")[0];
      let color_picker_area = document.getElementsByClassName("color_picker_area")[0];
      // eslint-disable-next-line consistent-this
      // const that = this;
      e.preventDefault();
      document.addEventListener(`click`, function onClickOutside(e) {
          var obj = e.target;
          do {
              if( obj.id != null && obj.id == "font_sel_icon") return;
              obj = obj.parentElement;
          } while(obj.tagName.toLowerCase() !== "body");
          font_select_area.style['display'] = "none";
          document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
          font_select_area.style['display'] = "none";
          window.removeEventListener(`scroll`, onScrollOutside);
      });
      font_select_area.style['display'] = "block";
      color_picker_area.style['display'] = "none";
  };

  onChangeCKEditArea = (evt,key) => {   
    this.saveShemaInfo(); 
    if (key == 0){
      this.setState({body:evt.target.value})
    }
    if (key == 1){
      this.setState({body_instruction:evt.target.value})
    }    
  }

  stripHtml(html)
  {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  handleUpdateImageBase64 = (_imgBase64, _comment) => {
    if (this.state.kind == "Drカルテ/経過") {
      this.course_imageBase64 = _imgBase64;
      this.course_imageComment = _comment;
    } else if (this.state.kind == "Drカルテ/指示") {
      this.dr_instruction_imageBase64 = _imgBase64;
      this.dr_instruction_imageComment = _comment;
    }
    this.setState({
      cur_imageBase64: _imgBase64,
      cur_imageComment: _comment
    });
  }
  
  prescriptionRender = (pres_array) => {
    let max_length = this.state.drkarte_style !== undefined && this.state.drkarte_style.drkarte_display_width !== undefined ? this.state.drkarte_style.drkarte_display_width : 120;
    return (pres_array.map(item=> {
      let lines = parseInt(item.left_str.length / max_length);
      let mods = (item.left_str.length % max_length + item.right_str.length) > max_length;
      let topstyle = lines > 0 && !mods;
      return (
        <div className="" key={item} style={{clear:"both"}}>
          <p className="left-div" style={(item.rp_key === undefined || item.rp_key >0) ? {float:"left", marginBottom: 0}:{float: "left", marginLeft:"1.5rem", marginBottom: 0}}>{item.left_str}</p>
          <p className={topstyle?"top-div":""} style={item.is_usage == 1 ? {float:"right", marginRight:"3rem", marginBottom: 0}:{float:"right", marginBottom: 0}}>{item.right_str}</p>
        </div>
      )
    }))
  }
  getprescriptionRender = (pres_array) => {
    let ret_str = '';
    pres_array.map(item=> {
      ret_str += item.left_str + "　" + item.right_str + "<br/>";
    });
    return ret_str;
  }
  IsJsonString = (str) => {
    try {
      var json = JSON.parse(str);
      return (typeof json === 'object');
    } catch (e) {
      return false;
    }
  }

  render() {
    const { closeModal } = this.props;    
    let {
      word_pattern_list,
      word_list,
      examinationPattern_code_options,
      treat_monitor_list,
      doctor_list_by_number,
      staff_list_by_number,
    } = this.state;
    var authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let btn_name = "登録";
    if (this.state.kind == "Drカルテ/経過" && this.state.number > 0) {
      btn_name = "変更";
    } else if (
      this.state.kind == "Drカルテ/指示" &&
      this.state.number_instruction > 0
    ) {
      btn_name = "変更";
    }

    let color_styles = reactCSS({
      'default': {
          popover: {
              position: 'absolute',
              zIndex: '2',
              top:'35px',
              display: 'none',
              left: '-15px',
          },
          cover: {
              position: 'fixed',
              top: '0px',
              right: '0px',
              bottom: '0px',
              left: '0px',
          },
      },
    });
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        className="wordPattern-modal master-modal small-input-panel-modal"
      >
        <Modal.Header>
          <Modal.Title>{this.state.kind}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DatePickerBox>
            <Wrapper>
              <div className="panel-menu flex">
                {this.state.tab_id == 0 ? (
                  <>
                    <div className="active-menu">単語リスト</div>
                  </>
                ) : (
                  <>
                    <div
                      className="menu-btn"
                      onClick={(e) => {
                        this.setTab(e, "0");
                      }}
                    >
                      単語リスト
                    </div>
                  </>
                )}
                {this.state.tab_id == 1 ? (
                  <>
                    <div className="active-menu">検査データ</div>
                  </>
                ) : (
                  <>
                    <div
                      className="menu-btn"
                      onClick={(e) => {
                        this.setTab(e, "1");
                      }}
                    >
                      検査データ
                    </div>
                  </>
                )}
                {this.state.tab_id == 2 ? (
                  <>
                    <div className="active-menu">履歴データ</div>
                  </>
                ) : (
                  <>
                    <div
                      className="menu-btn"
                      onClick={(e) => {
                        this.setTab(e, "2");
                      }}
                    >
                      履歴データ
                    </div>
                  </>
                )}
                {this.state.tab_id == 3 ? (
                  <>
                    <div className="active-menu">シェーマ</div>
                  </>
                ) : (
                  <>
                    <div
                      className="menu-btn"
                      onClick={(e) => {
                        this.setTab(e, "3");
                      }}
                    >
                      シェーマ
                    </div>
                  </>
                )}
                <div className="no-menu"></div>
              </div>
              <div className="work-area flex">
                {this.state.is_loaded !== true ? (
                  <>
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary"/>
                    </SpinnerWrapper>
                  </>
                ):(
                  <div className="left-area">
                  {this.state.tab_id == 0 ? (
                    <>
                      <div className="flex work-list">
                        <div className="area-1">
                          {word_pattern_list != undefined &&
                          word_pattern_list.length > 0 &&
                          word_pattern_list.map((item) => {
                            return (
                              <p className={item.number ==this.state.selected_pattern_number? "selected": ""}
                                key={item.number} onClick={this.selectPattern.bind(this,item.number)}>
                                {item.name}
                              </p>
                            );
                          })}
                        </div>
                        <div className="area-2 flex">
                          <div className="list-1">
                            {this.state.is_word_loaded != true && this.state.is_loaded == true && (
                              <>
                                <SpinnerWrapper>
                                  <Spinner animation="border" variant="secondary"/>
                                </SpinnerWrapper>
                              </>
                            )}
                            {this.state.is_word_loaded && word_list != undefined && word_list.length > 0 &&
                            word_list.map((item) => {
                              return (
                                <p className={item.number ==this.state.selected_word_number? "selected": ""}
                                  onClick={this.addWord.bind(this, item.word,item.number)}key={item.number}>
                                  {item.word}
                                </p>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="btn_names">
                        <>
                          {btn_names.map((item, key) => {
                            return (
                              <>
                                <Button
                                  key={key}
                                  onClick={this.showMasterModal.bind(this, key)}
                                >
                                  {item}
                                </Button>
                              </>
                            );
                          })}
                        </>
                      </div>
                    </>
                  ) : this.state.tab_id == 1 ? (
                    <>
                      <div className="search-area flex">
                        <div className="select-area">
                          <SelectorWithLabel
                            options={examinationPattern_code_options}
                            title=""
                            getSelect={this.getExamPatternCode.bind(this)}
                            departmentEditCode={this.state.exam_pattern_code}
                          />
                          <button onClick={this.getExamCodes.bind(this)}>
                            検索
                          </button>
                        </div>
          
                        <div className="period">
                          <InputWithLabel
                            label="期限"
                            type="date"
                            getInputText={this.getStartdate}
                            diseaseEditData={this.state.examination_start_date}
                          />
                          <div className="pd-15">～</div>
                          <div className='end-date'>
                            <InputWithLabel
                              label=""
                              type="date"
                              getInputText={this.getEnddate}
                              diseaseEditData={this.state.examination_end_date}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="table-area" style={{height: "58vh"}}>
                        {this.state.exam_table_data !== undefined &&
                        this.state.exam_table_data !== null &&
                        this.state.exam_table_data.length > 0 && (
                          <>
                            <div className={"fl"}>
                              <div
                                className={
                                  "inline-flex table-menu row-border-bottom"
                                }
                              >
                                <div className="text-center exam_name lh-60">
                                  検査名
                                </div>
                                <div className="text-center exam_unit lh-60">
                                  単位
                                </div>
                                <div className="text-center exam_unit lh-60">
                                  基準値
                                </div>
                                <div>
                                  <div>
                                    <div className={"inline-flex"}>
                                      {this.state.exam_table_data[0] !==
                                      undefined &&
                                      this.state.exam_table_data[0] !==
                                      null &&
                                      this.state.exam_table_data[0].length >
                                      0 &&
                                      this.state.exam_table_data[0].map(
                                        (item) => {
                                          return (
                                            <>
                                              <div className="text-center exam_date">
                                                {formatDateSlash(
                                                  new Date(item)
                                                )}
                                              </div>
                                            </>
                                          );
                                        }
                                      )}
                                    </div>
                                  </div>
                                  <div style={{marginTop: -1}}>
                                    <div className={"inline-flex"}>
                                      {this.state.exam_table_data[0] !==
                                      undefined &&
                                      this.state.exam_table_data[0] !==
                                      null &&
                                      this.state.exam_table_data[0].length >
                                      0 &&
                                      this.state.exam_table_data[0].map(
                                        () => {
                                          return (
                                            <>
                                              <div className="text-center exam_value" style={{lineHeight: "2rem"}}>前</div>
                                              <div className="text-center exam_value" style={{lineHeight: "2rem"}}>後</div>
                                            </>
                                          );
                                        }
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='inspection-body'>
                              {this.state.exam_table_data[1] !== undefined &&
                              this.state.exam_table_data[1] !== null &&
                              Object.keys(this.state.exam_table_data[1]).map(
                                (index) => {
                                  let item = this.state.exam_table_data[1][
                                    index
                                    ];
                                  return (
                                    <>
                                      <div className={"fl"}>
                                        <div className={"inline-flex row-border-bottom"} style={{marginTop: -2}}>
                                          <div className="text-center exam_name">
                                            {item.name}
                                          </div>
                                          <div className="text-center exam_unit">
                                            {item.unit}
                                          </div>
                                          {this.props.patientInfo != null &&
                                          this.props.patientInfo.gender ===
                                          1 ? (
                                            <div className="text-center exam_unit">
                                              {item.reference_value_male !=
                                              null &&
                                              item.reference_value_male !== ""
                                                ? "男:" +
                                                item.reference_value_male
                                                : ""}
                                            </div>
                                          ) : (
                                            <div className="text-center exam_unit">
                                              {item.reference_value_female !=
                                              null &&
                                              item.reference_value_female !== ""
                                                ? "女:" +
                                                item.reference_value_female
                                                : ""}
                                            </div>
                                          )}
                                          {this.state.exam_table_data[0] !==
                                          undefined &&
                                          this.state.exam_table_data[0] !==
                                          null &&
                                          this.state.exam_table_data[0]
                                            .length > 0 &&
                                          this.state.exam_table_data[0].map(
                                            (date) => {
                                              if (item[date] != undefined) {
                                                return (
                                                  <>
                                                    <div
                                                      className="text-center exam_value"
                                                      onDoubleClick={this.addWord.bind(
                                                        this,
                                                        item.name +
                                                        item[date].value +
                                                        (item.unit
                                                          ? item.unit
                                                          : "")
                                                      )}
                                                    >
                                                      {item[date].value}
                                                    </div>
                                                    {item[date].value2 !=
                                                    undefined ? (
                                                      <div
                                                        className="text-center exam_value"
                                                        onDoubleClick={this.addWord.bind(
                                                          this,
                                                          item.name +
                                                          item[date]
                                                            .value2 +
                                                          (item.unit
                                                            ? item.unit
                                                            : "")
                                                        )}
                                                      >
                                                        {item[date].value2}
                                                      </div>
                                                    ) : (
                                                      <div className="exam_value"></div>
                                                    )}
                                                  </>
                                                );
                                              } else {
                                                return (
                                                  <>
                                                    <div className="exam_value"></div>
                                                    <div className="exam_value"></div>
                                                  </>
                                                );
                                              }
                                            }
                                          )}
                                        </div>
                                      </div>
                                    </>
                                  );
                                }
                              )}
                            </div>
            
                          </>
                        )}
                      </div>
                      {/* <div className={'check-area'}>
                          <Checkbox
                              label="体重・血圧を表示"
                              getRadio={this.getShowWeight.bind(this)}
                              value={this.state.showWeight}
                              name="weight"
                          />
                          <Checkbox
                              label="DWを表示"
                              getRadio={this.getShowDW.bind(this)}
                              value={this.state.showDW}
                              name="dw"
                          />
                      </div> */}
                    </>
                  ) : this.state.tab_id == 2 ? (
                    <>
                      <div className="history-table-area">
                        <table className="table-scroll table table-bordered" id="treat_monitor-table">
                          <thead>
                          <th className="text-center date_col">日付</th>
                          <th className="text-center time_col">時間</th>
                          <th className="text-center suso_col">内容</th>
                          <th className="text-center inputer_col" style={{borderRightStyle:'none'}}>入力者</th>
                          </thead>
                          <tbody style={{height: "59vh"}}>
                          {treat_monitor_list !== undefined &&
                          treat_monitor_list != [] &&
                          doctor_list_by_number != undefined &&
                          staff_list_by_number != undefined &&
                          treat_monitor_list.map((item) => {
                            return (
                              <>
                                <tr
                                  className="clickable"
                                  onClick={this.addWord.bind(this, item.body)}
                                >
                                  <td className='date_col'>
                                    {formatDateLine(
                                      formatDateTimeIE(item.write_date)
                                    )}
                                  </td>
                                  <td className='time_col'>{item.write_date_time}</td>
                                  <td className="text-left suso_col">
                                  {item.category_2.includes('処方') && this.IsJsonString(item.body) ? (
                                    <>{this.prescriptionRender(JSON.parse(item.body))}</>
                                  ):(
                                    <>{displayLineBreak(renderHTML(item.body))}</>
                                  )}
                                  </td>
                                  <td className="text-left inputer_col">
                                    {item.updated_by !== null
                                      ? staff_list_by_number[item.updated_by]
                                      : ""}
                                  </td>
                                </tr>
                              </>
                            );
                          })}
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  <div
                  className={`block-area va-area ${
                  this.state.tab_id != 3 ? "display-force-none" : ""
                }`}
                  >
                  <DialVALeftNav
                  ref={this.VALeftNav}
                  img_version={
                  this.props.modal_data != null &&
                  this.props.modal_data.image_version != null
                    ? this.props.modal_data.image_version
                    : 0
                }
                  imgBase64={this.state.cur_imageBase64}
                  image_comment={this.state.cur_imageComment}
                  clearImageRef={this.clearImageRef}
                  // updaeImageBase64={this.handleUpdateImageBase64}
                  />
                  </div>
                  </div>
                )}
              </div>

              <div className={""}>                
                <Button style={{ marginRight: "10px" }} type="mono" className={this.state.kind == "Drカルテ/経過" ? "selected" : ""}
                  onClick={this.setInputKind.bind(this, "Drカルテ/経過")}>
                  経過
                </Button>
                <Button style={{ marginRight: "10px" }} type="mono" className={this.state.kind == "Drカルテ/指示" ? "selected" : ""}
                  onClick={this.setInputKind.bind(this, "Drカルテ/指示")}>
                  指示
                </Button>
                <Button style={{ marginRight: "10px" }} type="mono" className="" onClick={this.openInstructionModal.bind(this)}>
                  各種変更
                </Button>
              </div>
            </Wrapper>
          </DatePickerBox>
        </Modal.Body>
        <Card>
          
          {this.state.is_loaded !== true ? (
            <>
              <SpinnerWrapper>
                <Spinner animation="border" variant="secondary"/>
              </SpinnerWrapper>
            </>
          ):(
            <>
              <div className="edit-area">
                {/* <textarea
                id = 'body_id'
                onChange={this.getTextBody.bind(this)}
                value={
                  this.state.kind == "Drカルテ/経過"
                    ? this.state.body
                    : this.state.body_instruction
                }
              ></textarea> */}
                <div className={`flex noselect control-btn-area`}>
                  <div className={'content_editable_icon flex'} style={{position:"relative"}}>
                    <button
                      className={'bold-btn'}
                      style={{backgroundColor:""}}
                      onMouseDown={evt => {
                        evt.preventDefault(); // Avoids loosing focus from the editable area
                        document.execCommand("bold", false, ""); // Send the command to the browser
                        this.boldBtnClicked(evt)
                      }}
                    >B</button>
                    <button
                      className={'italic-btn'}
                      style={{fontStyle:"italic", backgroundColor:""}}
                      onMouseDown={evt => {
                        evt.preventDefault(); // Avoids loosing focus from the editable area
                        document.execCommand("italic", false, ""); // Send the command to the browser
                        this.italicBtnClicked(evt)
                      }}
                    >I</button>
                    <button className="color-icon" id={'color_sel_icon'}
                            onClick={(e) => {
                              this.colorPickerHover(e)
                            }}
                    >
                      <label className="set-font-color" style={{borderColor:this.soap_font_color}}>A<sup>▾</sup></label>
                    </button>
                    <div style={ color_styles.popover } className={'color_picker_area'} id={'color_picker_area'}>
                      <div className={'color-block-area'}>
                        <div className={'flex'}>
                          <div className={'color-block'} style={{backgroundColor:"#d0021b"}} onMouseDown={e=>{
                            e.preventDefault();
                            document.execCommand("ForeColor", false, "#d0021b");
                            this.changeBtnColor("#d0021b");
                          }}> </div>
                          <div className={'color-block'} style={{backgroundColor:"#f5a623"}} onMouseDown={e=>{
                            e.preventDefault();
                            document.execCommand("ForeColor", false, "#f5a623");
                            this.changeBtnColor("#f5a623");
                          }}> </div>
                          <div className={'color-block'} style={{backgroundColor:"#f8e71c"}} onMouseDown={e=>{
                            e.preventDefault();
                            document.execCommand("ForeColor", false, "#f8e71c");
                            this.changeBtnColor("#f8e71c");
                          }}> </div>
                          <div className={'color-block'} style={{backgroundColor:"#8b572a"}} onMouseDown={e=>{
                            e.preventDefault();
                            document.execCommand("ForeColor", false, "#8b572a");
                            this.changeBtnColor("#8b572a");
                          }}> </div>
                          <div className={'color-block'} style={{backgroundColor:"#7ed321"}} onMouseDown={e=>{
                            e.preventDefault();
                            document.execCommand("ForeColor", false, "#7ed321");
                            this.changeBtnColor("#7ed321");
                          }}> </div>
                          <div className={'color-block'} style={{backgroundColor:"#417505"}} onMouseDown={e=>{
                            e.preventDefault();
                            document.execCommand("ForeColor", false, "#417505");
                            this.changeBtnColor("#417505");
                          }}> </div>
                          <div className={'color-block'} style={{backgroundColor:"#bd10e0"}} onMouseDown={e=>{
                            e.preventDefault();
                            document.execCommand("ForeColor", false, "#bd10e0");
                            this.changeBtnColor("#bd10e0");
                          }}> </div>
                          <div className={'color-block'} style={{backgroundColor:"#9013fe"}} onMouseDown={e=>{
                            e.preventDefault();
                            document.execCommand("ForeColor", false, "#9013fe");
                            this.changeBtnColor("#9013fe");
                          }}> </div>
                        </div>
                        <div className={'flex'}>
                          <div className={'color-block'} style={{backgroundColor:"#4a90e2"}} onMouseDown={e=>{
                            e.preventDefault();
                            document.execCommand("ForeColor", false, "#4a90e2");
                            this.changeBtnColor("#4a90e2");
                          }}> </div>
                          <div className={'color-block'} style={{backgroundColor:"#50e3c2"}} onMouseDown={e=>{
                            e.preventDefault();
                            document.execCommand("ForeColor", false, "#50e3c2");
                            this.changeBtnColor("#50e3c2");
                          }}> </div>
                          <div className={'color-block'} style={{backgroundColor:"#b8e986"}} onMouseDown={e=>{
                            e.preventDefault();
                            document.execCommand("ForeColor", false, "#b8e986");
                            this.changeBtnColor("#b8e986");
                          }}> </div>
                          <div className={'color-block'} style={{backgroundColor:"#000000"}} onMouseDown={e=>{
                            e.preventDefault();
                            document.execCommand("ForeColor", false, "#000000");
                            this.changeBtnColor("#000000");
                          }}> </div>
                          <div className={'color-block'} style={{backgroundColor:"#4a4a4a"}} onMouseDown={e=>{
                            e.preventDefault();
                            document.execCommand("ForeColor", false, "#4a4a4a");
                            this.changeBtnColor("#4a4a4a");
                          }}> </div>
                          <div className={'color-block'} style={{backgroundColor:"#9b9b9b"}} onMouseDown={e=>{
                            e.preventDefault();
                            document.execCommand("ForeColor", false, "#9b9b9b");
                            this.changeBtnColor("#9b9b9b");
                          }}> </div>
                          <div className={'color-block'} style={{backgroundColor:"#FFFFFF"}} onMouseDown={e=>{
                            e.preventDefault();
                            document.execCommand("ForeColor", false, "#FFFFFF");
                            this.changeBtnColor("#FFFFFF");
                          }}> </div>
                        </div>
                      </div>
                    </div>
                    <button
                      id={'font_sel_icon'}
                      style={{position:"relative", padding:"0"}}
                      onClick={(e) => {
                        this.fontPickerHover(e)
                      }}
                    >
                      <span style={{position:"absolute", left:"5px", top:"0px"}}>A</span>
                      <span style={{position:"absolute", left:"14px", top:"5px"}}>▾</span>
                      <span style={{position:"absolute", left:"14px", top:"-5px"}}>▴</span>
                    </button>
                    <div style={ color_styles.popover  } className={'font_select_area'}>
                      <div className={'font-block-area'}>
                        <div className={'font-block'} onMouseDown={e=>{
                          e.preventDefault();
                          document.execCommand("fontSize", false, 1);
                        }}>10</div>
                        <div className={'font-block'} onMouseDown={e=>{
                          e.preventDefault();
                          document.execCommand("fontSize", false, 2);
                        }}>14</div>
                        <div className={'font-block'} onMouseDown={e=>{
                          e.preventDefault();
                          document.execCommand("fontSize", false, 3);
                        }}>16</div>
                        <div className={'font-block'} onMouseDown={e=>{
                          e.preventDefault();
                          document.execCommand("fontSize", false, 4);
                        }}>18</div>
                        <div className={'font-block'} onMouseDown={e=>{
                          e.preventDefault();
                          document.execCommand("fontSize", false, 5);
                        }}>24</div>
                        <div className={'font-block'} onMouseDown={e=>{
                          e.preventDefault();
                          document.execCommand("fontSize", false, 6);
                        }}>32</div>
                        <div className={'font-block'} onMouseDown={e=>{
                          e.preventDefault();
                          document.execCommand("fontSize", false, 7);
                        }}>48</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='data-input'>
                  <div className='soap-data table' id = "soap-data">
                    <div className='flex tr'>
                      <div className={'th '+ (this.state.kind == 'Drカルテ/経過' ? 'selected-tr' : '')} style={{textAlign:"center"}}>経過</div>
                      <div className={'text-left td '}>
                        <ContentEditable
                          className="content_editable_area"
                          html={this.state.body}
                          onChange={e=>this.onChangeCKEditArea(e, 0)} // handle innerHTML chang
                          tagName='article'
                        />
                      </div>
                    </div>
                    <div className='flex tr'>
                      <div className={'th ' + (this.state.kind == 'Drカルテ/指示' ? 'selected-tr' : '')} style={{textAlign:"center"}}>指示</div>
                      <div className={'text-left td '}>
                        <ContentEditable
                          className="content_editable_area"
                          html={this.state.body_instruction}
                          onChange={e=>this.onChangeCKEditArea(e, 1)} // handle innerHTML chang
                          tagName='article'
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='preview-karte-area'>
                  {this.state.is_small_loaded != true && (
                    <KarteSpinnerWrapper>
                      <Spinner animation="border" variant="secondary"/>
                    </KarteSpinnerWrapper>
                  )}
                  {this.state.is_small_loaded && this.state.preview_kartes != undefined && this.state.preview_kartes.length > 0 && (
                    this.state.preview_kartes.map(item => {
                      if (item.category_2.includes('処方') && this.IsJsonString(item.body)) {
                        return (
                          <>
                            <div>{this.prescriptionRender(JSON.parse(item.body))}</div>
                            <div style={{clear:"both"}} />
                          </>
                        )
                      } else {
                        return(
                          <>
                            <div>{displayLineBreak(renderHTML(item.body))}</div>
                          </>
                        )
                      }
                    })
                  )}
                </div>
  
              </div>
              <div className="create_info mt-1">
                <div className='flex datetime-area'>
                  <div className='input-time flex'>
                    <label>予定日付</label>
                    <DatePickerBox>
                    <DatePicker
                      locale="ja"
                      selected={this.state.reserve_date}
                      onChange={this.getReserveDate}
                      dateFormat="yyyy/MM/dd"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      dayClassName = {date => setDateColorClassName(date)}
                    />
                    </DatePickerBox>
                  </div>
                  <div className="input-time">
                    <label style={{cursor:"text"}}>入力時間</label>
                    <DatePicker
                      selected={this.state.entry_time}
                      onChange={this.getInputTime}
                      onKeyDown = {this.timeKeyEvent}
                      onBlur = {this.setTime}
                      value = {this.state.input_time_value}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={10}
                      dateFormat="HH:mm"
                      timeFormat="HH:mm"
                      timeCaption ='時間'
                      id="input_time_id"
                    />
                  </div>
                </div>
                {/*入力がドクターの場合は入力者の表示はいらない*/}
                {authInfo !== undefined &&
                authInfo != null &&
                authInfo.doctor_number === 0 && (
                  <div className="remove-x-input">
                    <InputWithLabel
                      label="入力者"
                      type="text"
                      isDisabled={true}
                      diseaseEditData={authInfo.name}
                    />
                  </div>
                )}
                {(this.state.kind == "Drカルテ/経過" ||
                  this.state.kind == "Drカルテ/所見" ||
                  this.state.kind == "Drカルテ/指示") && (
                  <div onClick={(e)=>this.showDoctorList(e)} className={authInfo !== undefined && authInfo != null && authInfo.doctor_number === 0 ? "remove-x-input  cursor-input": "remove-x-input display-none"}>
                    <InputWithLabel
                      label="指示者"
                      type="text"
                      isDisabled={true}
                      diseaseEditData={this.state.instruction_doctor_number > 0 && this.state.doctor_list_by_number != undefined ? this.state.doctor_list_by_number[this.state.instruction_doctor_number]: ""}
                    />
                  </div>
                )}
              </div>
            </>
          )}          
        </Card>
        
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.handleCloseModal}>キャンセル</Button>
            <Button className={this.state.is_small_loaded?"red-btn":'disable-btn'} onClick={this.handleOk}>{btn_name}</Button>
        </Modal.Footer>
        {this.state.isShowDoctorList && (
          <DialSelectMasterModal
            selectMaster={this.selectDoctor}
            closeModal={this.closeModal}
            MasterCodeData={this.state.doctors}
            MasterName="医師"
          />
        )}
        {this.state.isOpenInstructionModal && (
          <InputInstructionPanel
            closeModal={this.closeModal}
            patient_id={this.props.patient_id}
            patientInfo={this.props.patientInfo}
            schedule_date={this.props.schedule_date}
            saveKarteData={this.saveKarteData}
            continue_input={this.state.continue_input}
            karte_data={this.state.karte_data}
            history = {this.props.history}
            closeCompleteModal = {this.closeCompleteModal}
            staff_list_by_number = {this.state.staff_list_by_number}
            staffs = {this.state.staffs}
          />
        )}
        {this.state.isMedicineMaster && (
          <SelectPannelModal
            selectMaster={this.selectMaster}
            closeModal={this.closeModal}
            MasterName={"薬剤"}
          />
        )}
        {this.state.isInjectionMaster && (
          <SelectPannelModal
            selectMaster={this.selectMaster}
            closeModal={this.closeModal}
            MasterName="注射"
          />
        )}
        {this.state.isExaminationMaster && (
          <DialSelectRegularExamMasterModal
            selectMaster={this.selectMaster}
            closeModal={this.closeModal}
            MasterName="定期検査"
          />
        )}
        {this.state.isDailyserMaster && (
          <DialSelectDialyzerMasterModal
            selectMaster={this.selectMaster}
            closeModal={this.closeModal}
            MasterName="ダイアライザ"
          />
        )}
        {this.state.isOtherFacilityMaster && (
          <DialSelectFacilityOtherModal
            handleOk={this.setOtherFacility}
            closeModal={this.closeModal}
            MasterCodeData={this.state.dialyzerList}
            MasterName="他施設マスタ"
          />
        )}
        {this.state.isUpdateConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.saveBody.bind(this)}
            confirmTitle={this.state.confirm_message}
          />
        )}
        {this.state.isCloseConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={closeModal}
            confirmTitle={this.state.confirm_message}
            title = {this.state.confirm_alert_title}
          />
        )}        
        {this.state.alert_message != "" && (
          <ValidateAlertModal
            handleOk={this.closeAlertModal}
            alert_meassage={this.state.alert_message}
          />
        )}
        {this.state.isConfirmComplete !== false && (
          <CompleteStatusModal 
            message={this.state.complete_message}
            stop_button = {this.state.stop_button}
            stopLoading = {this.stopLoading.bind(this)}
          />
        )}
      </Modal>
    );
  }
}

InputKartePanel.contextType = Context;

InputKartePanel.propTypes = {
  closeModal: PropTypes.func,
  kind: PropTypes.string,
  handleOk: PropTypes.func,
  patient_id: PropTypes.number,
  patientInfo: PropTypes.object,
  schedule_date: PropTypes.string,
  modal_data: PropTypes.object,
  timeline_number: PropTypes.number,
  history:PropTypes.object,
  closeCompleteModal:PropTypes.func,
};

export default InputKartePanel;
