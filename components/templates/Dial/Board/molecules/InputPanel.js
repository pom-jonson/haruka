import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import 
  // DatePicker, 
  { registerLocale } from "react-datepicker";
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
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import DialSelectDialyzerMasterModal from "~/components/templates/Dial/Common/DialSelectDialyzerMasterModal";
import DialSelectRegularExamMasterModal from "~/components/templates/Dial/Common/DialSelectRegularExamMasterModal";
import DialSelectFacilityOtherModal from "~/components/templates/Dial/Common/DialSelectFacilityOtherModal";
import axios from "axios/index";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import {displayLineBreak, makeList_code, addRequiredBg, removeRequiredBg, addRedBorder, removeRedBorder } from "~/helpers/dialConstants";
import SelectPannelModal from "~/components/templates/Dial/Common/SelectPannelModal";
import Spinner from "react-bootstrap/Spinner";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from 'jquery';
import renderHTML from 'react-render-html';

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  position:absolute;
  top:115px;
  right:50px;
  width: 25%;  
  height: calc(100% - 200px);
  .selected-tr {
    article{
      background:lightblue!important;      
    }
  }
  .edit-area {
    height: calc(100% - 250px);
    textarea {
        width: 100%;
        margin: 0px;
        height: calc(100% - 10px);
        max-height: 100%;
    }
  }
  .create_info {
    width: auto;    
    label {
      width: 80px;
      text-align: right;
      margin-right: 10px;
      font-size: 14px;
    }
    .react-datepicker-wrapper{
      width: calc(100% - 100px);
      div{
        width:100%;
      }
      input{
        width:100%;
      }
    }
    .remove-x-input{
      input{
        width: calc(100% - 100px);
      }
    }
  }
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  width: 100%;
  height: 100%;
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
    .no-bg{
        background-color: rgba(200, 194, 194, 0.22);        
        border-top: none;
        border-left: none;
        border-right: none;
        border-bottom: 1px solid black;
    }
    .no-menu {
        width: calc(100% - 400px);
        border-bottom: 1px solid black;
        background-color: rgba(200, 194, 194, 0.22);
    }
  }
  .work-area {
    width: 100%;
    height: 64vh;
    // height: calc(100% - 1rem);
    // overflow-y: auto;
    margin-bottom: 0px;
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
        width: 70%;
        // height: calc(100% - 50px);
        height: 100%;
        .work-list{
            height: calc(100% - 70px);
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
            height: calc(100% - 70px);
            border: solid 1px darkgray;            
            overflow-y:hidden;
            overflow-x: scroll;
            .inspection-body{
              height:calc(100% - 61px);
              overflow-y:auto;
              overflow-x: hidden;
              clear:both;
            }
            .table-menu {
                background-color: gainsboro;
                // div {
                //     line-height: 30px;
                // }
            }
            .row-border-bottom {
                border-bottom: 1px solid gray;
            }
            .exam_name {
                width: 200px;
                border-right: 1px solid gray;
                line-height: 2rem;
            }
            .exam_unit {
                width: 100px;
                border-right: 1px solid gray;
                line-height: 2rem;
            }
            .exam_date {
                width: 100px;
                border-right: 1px solid gray;
                border-bottom: 1px solid gray;
                line-height: 2rem;
            }
            .exam_value {
                width: 50px;
                border-right: 1px solid gray;
                line-height: 2rem;
            }
            .lh-60 {
                line-height: 60px!important;
            }
        }
        .history-table-area {
          height: 50vh;
          width:100%;
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
              // height: calc(100% - 32px);
              height:46vh;
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
            eight: calc(100% - 90px);
            display: flex;
            height: 100%;
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
                        height: 100px;
                    }
                }
            }
        }
    }
    .label-title{
        width:100px;
        font-size:18px;
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
    
`;

const btn_names = [
  "薬剤マスタ",
  "注射マスタ",
  "定期検査",
  "ダイアライザ",
  "他施設マスタ",
];

class InputPanel extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    this.register_flag = false;
    let schedule_date = sessApi.getObjectValue(
      CACHE_SESSIONNAMES.DIAL_BOARD,
      "schedule_date"
    );
    let cur_date = new Date();

    var item = this.props.item;
    var kind = this.props.kind;

    var is_soap = false;
    if (
      kind == "S" ||
      kind == "O" ||
      kind == "A" ||
      kind == "P" ||
      kind == "指示"
    ) {
      is_soap = true;
    } else {
      is_soap = false;
    }

    //soap指示 編集時
    var body_soap = {
      S: "(S)",
      O: "(O)",
      A: "(A)",
      P: "(P)",
      指示: "(指示)",
    };

    // soap指示 image_base64
    this.imageBase64_soap = {
      s_imageBase64: null,
      o_imageBase64: null,
      a_imageBase64: null,
      p_imageBase64: null,
      i_imageBase64: null,
    };

    // soap指示 image_comment
    this.image_comment_soap = {
      s_imageComment: null,
      o_imageComment: null,
      a_imageComment: null,
      p_imageComment: null,
      i_imageComment: null,
    };

    this.body_validate_data = sessApi.getObjectValue('init_status', 'dial_schedule_validate');
    this.body_validate_data = this.body_validate_data.karte;
    if(this.body_validate_data != undefined && this.body_validate_data != null) this.body_validate_data = this.body_validate_data.body;
    //
    var body = "";
    let cur_imageBase64 = null;
    let cur_imageComment = "";

    if (item != undefined && item != null) {
      var export_destination = null;
      var export_relation = null;
      var relation = null;
      var external_change_source = null;
      if (is_soap) {
        var soap_numbers = {};
        item.map((sub_item) => {
          body_soap[sub_item.category_2] = sub_item.body;
          if (sub_item.category_2 == "S") {
            this.image_comment_soap.s_imageComment = sub_item.image_comment;
          } else if (sub_item.category_2 == "O") {
            this.image_comment_soap.o_imageComment = sub_item.image_comment;
          } else if (sub_item.category_2 == "A") {
            this.image_comment_soap.a_imageComment = sub_item.image_comment;
          } else if (sub_item.category_2 == "P") {
            this.image_comment_soap.p_imageComment = sub_item.image_comment;
          } else if (sub_item.category_2 == "指示") {
            this.image_comment_soap.i_imageComment = sub_item.image_comment;
          }
          soap_numbers[sub_item.category_2] = sub_item.number;
          if (sub_item.body != "") {
            export_relation = sub_item.export_relation;
            export_destination = sub_item.export_destination;
            relation = sub_item.relation;
            external_change_source = sub_item.source;
          }
        });
        if (kind == "S") {
          cur_imageComment = this.image_comment_soap.s_imageComment;
        } else if (kind == "O") {
          cur_imageComment = this.image_comment_soap.o_imageComment;
        } else if (kind == "A") {
          cur_imageComment = this.image_comment_soap.a_imageComment;
        } else if (kind == "P") {
          cur_imageComment = this.image_comment_soap.p_imageComment;
        } else if (kind == "指示") {
          cur_imageComment = this.image_comment_soap.i_imageComment;
        }
      } else {
        body = item.body;
        export_relation = item.export_relation;
        export_destination = item.export_destination;
        relation = item.relation;
        external_change_source = item.source;
        cur_imageBase64 =
          item != null && item.imgBase64 != null ? item.imgBase64 : null;
        cur_imageComment =
          item != null && item.image_comment != null
            ? item.image_comment
            : null;
      }
    }

    this.original_body = body;
    this.original_body_soap = JSON.stringify(body_soap);

    // let code_master = sessApi.getObjectValue("dial_common_master","code_master");
    let examinationCodeData = sessApi.getObjectValue(
      CACHE_SESSIONNAMES.COMMON_MASTER,
      "examination_master"
    );

    this.state = {
      kind,
      is_soap,
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
      body_soap,
      usable_page: "",
      schedule_date,
      exam_table_data: [],
      item: item != undefined ? item : null,
      number: item != undefined && item.length > 0 ? item[0].number : 0,
      soap_numbers,
      confirm_message: "",
      confirm_alert_title:'',
      alert_message:'',
      isUpdateConfirmModal: false,
      isCloseConfirmModal: false,
      isShowDoctorList: false,      
      source: this.props.source,
      handover_relation: this.props.handover_relation,
      export_destination,
      export_relation,
      relation,
      external_change_source,

      examinationCodeData,
      examination_codes: makeList_code(examinationCodeData),

      is_loaded: false,
      search_order: 1,
      img_version: 0,
      cur_imageBase64,
      cur_imageComment,
    };

    this.VALeftNav = React.createRef();
  }

  async componentDidMount() {
    let server_time = await getServerTime();
    var cur_date = new Date(server_time);

    this.setInputKind(this.state.kind);
    this.getDialyzerCode();
    this.getExamPattern();
    this.getExamDataList();
    this.getSoapInfo();
    this.getStaffs();
    this.setDoctors();
    this.getImageInfo();

    let dial_timezone = JSON.parse(window.sessionStorage.getItem("init_status"))
      .dial_timezone["timezone"];
    let base_value =
      dial_timezone != undefined &&
      dial_timezone != null &&
      dial_timezone[1] != undefined &&
      dial_timezone["1"] != null &&
      dial_timezone[1]["start"] != null &&
      dial_timezone[1]["start"] != ""
        ? dial_timezone[1]["start"]
        : "08:00";
    var base_hour = base_value.split(":")[0];
    var base_mins = base_value.split(":")[1];

    this.base_time_object = new Date(server_time);
    this.base_time_object.setHours(parseInt(base_hour));
    this.base_time_object.setMinutes(parseInt(base_mins));

    if (this.context.selectedDoctor.code > 0) {
      this.setState({
        instruction_doctor_number: parseInt(this.context.selectedDoctor.code),
        directer_name: this.context.selectedDoctor.name,
      });
    }

    let img_version = 0;
    let initState = JSON.parse(
      sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS)
    );
    let schema_background_list = initState.schema_background_list;

    if (
      this.state.kind == "VA継続" ||
      this.state.kind == "申し送り/次回" ||
      this.state.kind == "申し送り/継続"
    ) {
      let key = "";
      if (this.state.kind == "VA継続") key = "VA継続申し送り";
      if (this.state.kind == "申し送り/次回") key = "次回申し送り";
      if (this.state.kind == "申し送り/継続") key = "継続申し送り";
      if (schema_background_list.length > 0) {
        schema_background_list.map((item) => {
          if (key == item.category_1) {
            img_version = item.number;
          }
        });
      }
    }
    // if (this.state.number > 0 && this.props.item !=null && this.props.item.background_image_number !=null) {
    //     img_version = this.props.item.background_image_number;
    // }
    this.setState({
      img_version,
      examination_start_date: new Date(cur_date.getFullYear(),cur_date.getMonth(),1),
      examination_end_date:cur_date,
    });
  }
  
  componentWillUnmount() {
    sessApi.remove('dial_change_flag');
  }

  shouldComponentUpdate(nextprops, nextstate) {

    this.changeState = JSON.stringify(this.state) != JSON.stringify(nextstate);
    this.changeProps = JSON.stringify(this.props) != JSON.stringify(nextprops);    
    
    if (!this.changeState) {      
      return false;
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
    if (
      this.state.soap_numbers == undefined ||
      this.state.soap_numbers == null ||
      Object.keys(this.state.soap_numbers).length <= 0
    ) {
      return;
    }

    if (!this.state.is_soap) return;

    let arr = [];
    Object.keys(this.state.soap_numbers).forEach(function(key) {
      arr.push(key);
    });

    let _state = {};

    let path = "/app/api/v2/dial/board/Soap/get_image_by_number";
    for (let i = 0; i < arr.length; i++) {
      if (this.state.soap_numbers[arr[i]] > 0) {
        await apiClient
          ._post(path, {
            params: {
              number: this.state.soap_numbers[arr[i]],
            },
          })
          .then((res) => {
            if (res) {
              // soap指示 image_base64
              this.setSoapImage64ByKind(arr[i], res);
              // if (arr[i] == 'S') {
              //     this.imageBase64_soap.s_imageBase64 = res;
              // } else if(arr[i] == 'O') {
              //     this.imageBase64_soap.o_imageBase64 = res;
              // } else if(arr[i] == 'A') {
              //     this.imageBase64_soap.a_imageBase64 = res;
              // } else if(arr[i] == 'P') {
              //     this.imageBase64_soap.p_imageBase64 = res;
              // } else if(arr[i] == '指示') {
              //     this.imageBase64_soap.i_imageBase64 = res;
              // }
            }
          })
          .catch(() => {});
      }
    }

    // if (this.state.kind == 'S') {
    //     _state.cur_imageBase64 = this.imageBase64_soap.s_imageBase64;
    // } else if(this.state.kind == 'O') {
    //     _state.cur_imageBase64 = this.imageBase64_soap.o_imageBase64;
    // } else if(this.state.kind == 'A') {
    //     _state.cur_imageBase64 = this.imageBase64_soap.a_imageBase64;
    // } else if(this.state.kind == 'P') {
    //     _state.cur_imageBase64 = this.imageBase64_soap.p_imageBase64;
    // } else if(this.state.kind == '指示') {
    //     _state.cur_imageBase64 = this.imageBase64_soap.i_imageBase64;
    // }
    _state.cur_imageBase64 = this.getSoapImage64ByKind(this.state.kind);

    this.setState(_state);
  };

  setSoapImage64ByKind = (kind, val) => {
    if (kind == "S") {
      this.imageBase64_soap.s_imageBase64 = val;
    } else if (kind == "O") {
      this.imageBase64_soap.o_imageBase64 = val;
    } else if (kind == "A") {
      this.imageBase64_soap.a_imageBase64 = val;
    } else if (kind == "P") {
      this.imageBase64_soap.p_imageBase64 = val;
    } else if (kind == "指示") {
      this.imageBase64_soap.i_imageBase64 = val;
    }
  };

  getSoapImage64ByKind = (kind) => {
    let result = "";
    if (kind == "S") {
      result = this.imageBase64_soap.s_imageBase64;
    } else if (kind == "O") {
      result = this.imageBase64_soap.o_imageBase64;
    } else if (kind == "A") {
      result = this.imageBase64_soap.a_imageBase64;
    } else if (kind == "P") {
      result = this.imageBase64_soap.p_imageBase64;
    } else if (kind == "指示") {
      result = this.imageBase64_soap.i_imageBase64;
    }

    return result;
  };

  setSoapImageCommentByKind = (kind, val) => {
    if (kind == "S") {
      this.image_comment_soap.s_imageComment = val;
    } else if (kind == "O") {
      this.image_comment_soap.o_imageComment = val;
    } else if (kind == "A") {
      this.image_comment_soap.a_imageComment = val;
    } else if (kind == "P") {
      this.image_comment_soap.p_imageComment = val;
    } else if (kind == "指示") {
      this.image_comment_soap.i_imageComment = val;
    }
  };

  getSoapImageCommentByKind = (kind) => {
    let result = "";
    if (kind == "S") {
      result = this.image_comment_soap.s_imageComment;
    } else if (kind == "O") {
      result = this.image_comment_soap.o_imageComment;
    } else if (kind == "A") {
      result = this.image_comment_soap.a_imageComment;
    } else if (kind == "P") {
      result = this.image_comment_soap.p_imageComment;
    } else if (kind == "指示") {
      result = this.image_comment_soap.i_imageComment;
    }

    return result;
  };

  setInputKind = async (kind) => {
    // let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    // if((!authInfo.doctor_number > 0) && kind =='指示'){
    //     window.sessionStorage.setItem("alert_messages", '医師のみが指示を登録することができます。');
    //     return;
    // }

    var item = this.state.item;
    let _state = {
      kind: kind,
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
          this.setSoapImage64ByKind(this.state.kind, dataURL);
          // if (this.state.kind == 'S') {
          //     this.imageBase64_soap.s_imageBase64 = dataURL;
          // } else if(this.state.kind == 'O') {
          //     this.imageBase64_soap.o_imageBase64 = dataURL;
          // } else if(this.state.kind == 'A') {
          //     this.imageBase64_soap.a_imageBase64 = dataURL;
          // } else if(this.state.kind == 'P') {
          //     this.imageBase64_soap.p_imageBase64 = dataURL;
          // } else if(this.state.kind == '指示') {
          //     this.imageBase64_soap.i_imageBase64 = dataURL;
          // }
        }
      }
      if (
        this.VALeftNav.current.state.comment != undefined &&
        this.VALeftNav.current.state.comment != null
      ) {
        this.setSoapImageCommentByKind(
          this.state.kind,
          this.VALeftNav.current.state.comment
        );
      }
    }
    await this.getWordInfo(kind);

    if (
      kind == "S" ||
      kind == "O" ||
      kind == "A" ||
      kind == "P" ||
      kind == "指示"
    ) {
      _state.cur_imageBase64 = this.getSoapImage64ByKind(kind);
      _state.cur_imageComment = this.getSoapImageCommentByKind(kind);
      _state.is_soap = true;
      this.setState(_state, () => {
        this.getLastSoapNumber();
      });
    } else {
      if (
        kind == "申し送り/継続" ||
        kind == "申し送り/次回" ||
        kind == "Dr上申" ||
        this.state.kind == "VA継続"
      ) {
        this.setState({
          body: item != undefined && item != null ? item.message : "",
          kind: kind,
          number: item != undefined && item != null ? item.number : 0,
          export_relation:
            item != undefined && item != null ? item.export_relation : null,
          export_destination:
            item != undefined && item != null ? item.export_destination : null,
          is_soap: false,
          cur_imageComment:
            item != undefined && item != null ? item.image_comment : null,
        });
        this.original_body =
          item != undefined && item != null ? item.message : "";
      } else {
        this.setState({
          body: item != undefined && item != null ? item.body : "",
          prefix: "",
          kind: kind,
          number: item != undefined && item != null ? item.number : 0,
          export_relation:
            item != undefined && item != null ? item.export_relation : null,
          export_destination:
            item != undefined && item != null ? item.export_destination : null,
          is_soap: false,
        });

        this.original_body = item != undefined && item != null ? item.body : "";
      }
    }
  };

  getLastSoapNumber = async () => {
    let path = "/app/api/v2/dial/board/Soap/getLastnumber";
    await apiClient
      ._post(path, {
        params: {
          system_patient_id: this.props.patient_id,
          date: this.state.schedule_date,
        },
      })
      //   .then((res) => {
      .then(() => {
        var body_soap = this.state.body_soap;

        this.setState({
          // body:'(' + this.state.kind + (res+1).toString() + ')',
          // prefix:'(' + this.state.kind + (res+1).toString() + ')',

          // body:item != undefined && item != null ? item.body :'(' + this.state.kind  + ')',
          // prefix:'(' + this.state.kind + ')',
          body_soap,
        });
      });
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
    this.setState({ is_loaded: false, word_list: [] });
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
          is_loaded: true,
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
    });
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
    if (this.state.is_soap){
      var body_soap = this.state.body_soap;
      var flag = false;
      Object.keys(body_soap).map((key) => {
        flag |= this.checkBody("(" + key + ")", body_soap[key]);
        if (this.checkBody("(" + key + ")", body_soap[key])) {
          if (!this.checkPrefix("(" + key + ")", body_soap[key])) {
            body_soap[key] = "(" + key + ")" + body_soap[key];
          }
        } else {
          body_soap[key] = "";
        }

        if (body_soap[key].length > 100){
          error_str_arr.push(key + this.body_validate_data.overflow_message);
          addRedBorder('body_id');
        }
      });

      if (flag == false) {
        error_str_arr.push(this.body_validate_data.requierd_message);
        addRedBorder('body_id');        
      }
    } else {
      if (this.state.body == undefined || this.state.body == null || this.state.body == ''){
        error_str_arr.push(this.body_validate_data.requierd_message);
        addRedBorder('body_id');        
      }

      if (this.state.body != undefined && this.state.body != null && this.state.body != '' && this.state.body.length > 100 ){
        error_str_arr.push(this.body_validate_data.overflow_message);
        addRedBorder('body_id');
      }
    }
    this.setState({first_tag_id:'body_id'});
    return error_str_arr;
  }

  stripHtml(html)
  {
    if (html == undefined || html == null || html == '') return '';
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  handleOk = () => {
    let error_str_array = this.checkValidation();
    if (error_str_array.length > 0 ) {
      this.setState({alert_message:error_str_array.join('\n')});
      return;
    }
    
    var operation_type = '';
    if (this.state.number > 0){
      operation_type = '変更';
    } else {
      operation_type = '登録';
    }
    let _state = {
      isUpdateConfirmModal: true,
      confirm_message: this.state.kind + "情報を" + operation_type +  "しますか?",
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
            if (this.state.is_soap) {
              this.setSoapImage64ByKind(this.state.kind, dataURL);
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
          if (this.state.is_soap) {
            this.setSoapImageCommentByKind(
              this.state.kind,
              this.VALeftNav.current.state.comment
            );
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
      confirm_alert_title:'',
      alert_message:'',
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
          if (this.state.tab_id == 3) {
            if (this.state.is_soap) {
              this.setSoapImage64ByKind(this.state.kind, dataURL);
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
          if (this.state.is_soap) {
            this.setSoapImageCommentByKind(
              this.state.kind,
              this.VALeftNav.current.state.comment
            );
          }
          _state.cur_imageComment = this.VALeftNav.current.state.comment;
        }
      }
    }

    this.setState(_state);
  };

  register = () => {
    let _state = {
      isUpdateConfirmModal: true,
      confirm_message: this.state.kind + "情報を保存しますか?",
    };
    this.setState(_state);
  };

  saveBody = async () => {
    let server_time = await getServerTime();
    var check_night_flag = false;
    var entry_time = this.state.entry_time == ''?new Date(server_time):this.state.entry_time;
    if (entry_time.getTime() <= this.base_time_object.getTime()) check_night_flag = true;        
    var schedule_date = this.state.schedule_date;
    if (schedule_date == undefined || schedule_date == '') schedule_date = new Date(server_time); else schedule_date = formatDateTimeIE(this.state.schedule_date);
    if (check_night_flag) schedule_date.setDate(schedule_date.getDate()+1);
    
    this.confirmCancel();
    if (
      this.state.kind == "申し送り/継続" ||
      this.state.kind == "申し送り/次回" ||
      this.state.kind == "Dr上申" ||
      this.state.kind == "VA継続"
    ) {
      var category = "";
      if (
        this.state.kind == "申し送り/継続" ||
        this.state.kind == "申し送り/次回"
      ) {
        category = this.state.kind.split("/")[1] + "申し送り";
      }
      if (this.state.kind == "Dr上申") {
        category = this.state.kind;
      }
      if (this.state.kind == "VA継続") {
        category = this.state.kind + "申し送り";
      }
      let data = {
        number: this.state.number,
        patient_id: this.props.patient_id,
        category: category,
        message: this.state.body,
        source: this.state.source,
        relation: this.state.handover_relation,
        imageBase64: this.state.cur_imageBase64,
        image_comment: this.state.cur_imageComment,
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
            if (this.state.tab_id == 3 && this.state.number == 0) {
              // add when insert not
              data.imageBase64 = dataURL;
              data.background_image_number = this.state.img_version;
            }
          }
        }
        if (
          this.VALeftNav.current.state.comment != undefined &&
          this.VALeftNav.current.state.comment != null
        ) {
          if (this.state.tab_id == 3 && this.state.number == 0) {
            data.image_comment = this.VALeftNav.current.state.comment;
          }
        }
      }

      if (this.state.body == undefined || this.state.body == "") {
        if (
          this.state.tab_id == 3 &&
          data.imageBase64 != null &&
          data.imageBase64 != ""
        ) {
          this.setState({
            cur_imageBase64: data.imageBase64,
          });
        }
        if (
          this.state.tab_id == 3 &&
          data.image_comment != null &&
          data.image_comment != ""
        ) {
          this.setState({
            cur_imageComment: data.image_comment,
          });
        }
        window.sessionStorage.setItem(
          "alert_messages",
          "本文の内容を入力してください。"
        );
        return;
      }

      this.temp_imageBase64 = null;

      if (this.register_flag === false) {
        this.register_flag = true;
        let path = "/app/api/v2/dial/board/sendingDataRegister";
        apiClient
          .post(path, {
            params: data,
          })
          .then(() => {
            if (this.state.kind == "Dr上申") {
              this.props.handleOk();
              window.sessionStorage.setItem(
                "alert_messages",
                "登録完了##" + "Dr上申を登録しました。"
              );
              return;
            } else if (this.state.kind == "VA継続") {
              window.sessionStorage.setItem(
                "alert_messages",
                "登録完了##" + "VA継続を登録しました。"
              );
            } else if (this.state.kind == "申し送り/継続") {
              window.sessionStorage.setItem(
                "alert_messages",
                "登録完了##" + "継続申し送りを登録しました。"
              );
            } else {
              window.sessionStorage.setItem(
                "alert_messages",
                "登録完了##" + "次回申し送りを登録しました。"
              );
            }
            this.props.closeModal();
          })
          .finally(() => {
            this.register_flag = false;
          });
      }
    } else if (this.state.kind === "現症") {
      if (
        this.state.body == undefined ||
        this.state.body == null ||
        this.state.body == ""
      ) {
        window.sessionStorage.setItem(
          "alert_messages",
          "本文の内容を入力してください。"
        );
        return false;
      }
      let search_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
      let data = {
        system_patient_id: this.props.patient_id,
        category_1: "現症",
        category_2: "現症",
        instruction_doctor_number: this.state.instruction_doctor_number,
        body: this.state.body,
        schedule_date:formatDateLine(search_date)
      };
      if (this.props.item !== undefined) {
        data.number = this.props.item.number;
        data.write_date = this.props.item.write_date;
      }

      if (this.register_flag === false) {
        this.register_flag = true;
        let path = "/app/api/v2/dial/board/Soap/disease_register";
        apiClient
          .post(path, {
            params: data,
          })
          .then(() => {            
            this.props.handleOk();
            window.sessionStorage.setItem(
              "alert_messages",
              "登録完了##" + "現症を登録しました。"
            );
          })
          .finally(() => {
            this.register_flag = false;
          });
      }
    } else {
      if (this.state.is_soap) {
        var body_soap = this.state.body_soap;
        var flag = false;
        Object.keys(body_soap).map((key) => {
          flag |= this.checkBody("(" + key + ")", body_soap[key]);
          if (this.checkBody("(" + key + ")", body_soap[key])) {
            if (!this.checkPrefix("(" + key + ")", body_soap[key])) {
              body_soap[key] = "(" + key + ")" + body_soap[key];
            }
          } else {
            body_soap[key] = "";
          }
        });

        if (flag == false) {
          window.sessionStorage.setItem(
            "alert_messages",
            "本文を入力してください。"
          );
          this.confirmCancel();
          return;
        }
      } else {
        if (this.state.prefix != "") {
          if (!this.checkBody(this.state.prefix, this.state.body)) {
            window.sessionStorage.setItem(
              "alert_messages",
              "本文を入力してください。"
            );
            this.confirmCancel();
            return;
          }
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
        var body = "";
        if (this.checkPrefix(this.state.prefix, this.state.body))
          body = this.state.body;
        else body = this.state.prefix + this.state.body;
      }

      let path = "/app/api/v2/dial/board/Soap/register";
      let post_data = {
        number: this.state.number,
        soap_numbers: this.state.soap_numbers,
        system_patient_id: this.props.patient_id,
        write_date: formatTime(this.state.entry_time),
        schedule_date:schedule_date,
        category_1:
          this.state.kind == "Drカルテ/指示"
            ? "Drカルテ"
            : this.state.usable_page.split("/")[0],
        category_2: this.state.usable_page.split("/")[1],
        body: this.state.is_soap ? body_soap : body,
        instruction_doctor_number: this.state.instruction_doctor_number,
        relation: this.state.relation,
        export_relation: this.state.export_relation,
        export_destination: this.state.export_destination,
        source: this.state.external_change_source,
        is_soap: this.state.is_soap,
      };

      if (this.state.is_soap) {
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
              this.setSoapImage64ByKind(this.state.kind, dataURL);
            }
          }
          if (
            this.VALeftNav.current.state.comment != undefined &&
            this.VALeftNav.current.state.comment != null
          ) {
            // image comment
            this.setSoapImageCommentByKind(
              this.state.kind,
              this.VALeftNav.current.state.comment
            );
          }
        }

        let image_path_arr = {
          S: this.imageBase64_soap.s_imageBase64,
          O: this.imageBase64_soap.o_imageBase64,
          A: this.imageBase64_soap.a_imageBase64,
          P: this.imageBase64_soap.p_imageBase64,
          指示: this.imageBase64_soap.i_imageBase64,
        };

        let image_comment_arr = {
          S: this.image_comment_soap.s_imageComment,
          O: this.image_comment_soap.o_imageComment,
          A: this.image_comment_soap.a_imageComment,
          P: this.image_comment_soap.p_imageComment,
          指示: this.image_comment_soap.i_imageComment,
        };

        post_data.imageBase64_soap = image_path_arr;
        post_data.image_comment_soap = image_comment_arr;
      }

      if (this.register_flag === false) {
        this.register_flag = true;
        await apiClient
          ._post(path, {
            params: post_data,
          })
          .then(() => {
            if (this.state.number > 0){
              window.sessionStorage.setItem(
                "alert_messages",
                "変更完了##" + "変更しました。"
              );
            } else {
              window.sessionStorage.setItem(
                "alert_messages",
                "登録完了##" + "登録しました。"
              );
            }
            this.props.handleOk();
          })
          .finally(() => {
            this.register_flag = false;
          });
      }
    }
  };

  addWord = (word, selected_word_number = null) => {
    if (this.state.is_soap) {
      var body_soap = this.state.body_soap;
      body_soap[this.state.kind] += word;
      this.setState({ body_soap });
    } else {
      var temp = this.state.body;
      temp = temp + word;
      this.setState({ body: temp });
    }
    if (selected_word_number != null) {
      this.setState({ selected_word_number });
    }
  };

  getTextBody = (e) => {
    if (this.state.tab_id == 3) {
      this.saveShemaInfo();
    }
    if (this.state.is_soap) {
      var body_soap = this.state.body_soap;
      body_soap[this.state.kind] = e.target.value;
      this.setState({ body_soap });
    } else {
      this.setState({ body: e.target.value });
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

  selectMaster = (master) => {
    if (this.state.is_soap) {
      var body_soap = this.state.body_soap;
      body_soap[this.state.kind] += master.name;
      this.setState({ body_soap });
    } else {
      this.setState({
        body: this.state.body + master.name,
      });
    }

    this.closeModal();
  };

  SetImplementationIntervalType = (value) => {
    this.setState({ implementationIntervalType: value });
  };

  getInputTime = (value) => {
    this.saveShemaInfo();
    this.setState({ entry_time: value });
  };

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
            if (this.state.is_soap) {
              this.setSoapImage64ByKind(this.state.kind, dataURL);
            }
            _state.cur_imageBase64 = dataURL;
          }
        }
        if (
          this.VALeftNav.current.state.comment != undefined &&
          this.VALeftNav.current.state.comment != null
        ) {
          // image comment
          this.setSoapImageCommentByKind(
            this.state.kind,
            this.VALeftNav.current.state.comment
          );
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
    if (this.state.is_soap) {
      var body_soap = this.state.body_soap;
      body_soap[this.state.kind] += data;
      this.setState({ body_soap });
    } else {
      this.setState({
        body: this.state.body + data,
      });
    }
    this.closeModal();
  };

  getOrderSelect = (e) => {
    //表示順
    this.setState({ search_order: parseInt(e.target.id) }, () => {
      this.getWordInfo();
    });
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
      this.original_body != this.state.body ||
      this.original_body_soap != JSON.stringify(this.state.body_soap) || 
      nFlag == 1
    ) {
      this.setState({
        isCloseConfirmModal: true,
        confirm_message: "編集途中の内容があります。破棄して閉じますか？",
        confirm_alert_title:'入力中'
      });
      return;
    }
    this.props.closeModal();
  };

  clearImageRef = () => {
    if (this.state.is_soap) {
      this.setSoapImage64ByKind(this.state.kind, null);
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
    if (this.state.is_soap){
      var body_soap = this.state.body_soap;
      var flag = false;
      Object.keys(body_soap).map((key) => {
        flag |= this.checkBody("(" + key + ")", body_soap[key]);
        if (this.checkBody("(" + key + ")", body_soap[key])) {
          if (!this.checkPrefix("(" + key + ")", body_soap[key])) {
            body_soap[key] = "(" + key + ")" + body_soap[key];
          }
        } else {
          body_soap[key] = "";
        }
      });

      if (flag == false) {
        addRequiredBg("body_id");  
      } else {
        removeRequiredBg("body_id");
      }
    } else {
      if (this.state.body == undefined || this.state.body == null || this.state.body == ''){        
        addRequiredBg("body_id");  
      } else {
        removeRequiredBg("body_id");
      }
    }
  }

  handleUpdateImageBase64 = (_imgBase64, _comment) => {
    if (this.state.kind == "S" ||
      this.state.kind == "O" ||
      this.state.kind == "A" ||
      this.state.kind == "P" ||
      this.state.kind == "指示") {
      this.setSoapImage64ByKind(this.state.kind, _imgBase64);
      this.setSoapImageCommentByKind(this.state.kind, _comment);      
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
          <div className="left-div" style={(item.rp_key === undefined || item.rp_key >0) ? {float:"left"}:{float: "left", marginLeft:"1.5rem"}}>{item.left_str}</div>
          <div className={topstyle?"top-div":""} style={item.is_usage == 1 ? {float:"right", marginRight:"3rem"}:{float:"right"}}>{item.right_str}</div>
        </div>
      )
    }))
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
    var kind = this.state.kind;

    return (
      <Modal
        show={true}
        onHide={this.onHide}
        className="wordPattern-modal master-modal input-panel-modal"
      >
        <Modal.Header>
          <Modal.Title>
            {kind == "S" ||
            kind == "O" ||
            kind == "A" ||
            kind == "P" ||
            kind == "指示"
              ? "処置モニタ入力(" + this.state.kind + ")"
              : this.state.kind}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
              {this.state.kind !== "現症" ? (
                <>
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
                </>
              ) : (
                <>
                  <div className="active-menu no-bg"></div>
                </>
              )}
              <div className="no-menu"></div>
            </div>
            <div className="work-area flex">
              <div className="left-area">
                {this.state.tab_id == 0 ? (
                  <>
                    <div className="flex work-list">
                      <div className="area-1">
                        {word_pattern_list != undefined &&
                          word_pattern_list.length > 0 &&
                          word_pattern_list.map((item) => {
                            return (
                              <p
                                className={
                                  item.number ==
                                  this.state.selected_pattern_number
                                    ? "selected"
                                    : ""
                                }
                                key={item.number}
                                onClick={this.selectPattern.bind(
                                  this,
                                  item.number
                                )}
                              >
                                {item.name}
                              </p>
                            );
                          })}
                      </div>
                      <div className="area-2 flex">
                        <div className="list-1">
                          {word_list != undefined &&
                            word_list.length > 0 &&
                            word_list.map((item) => {
                              return (
                                <p
                                  className={
                                    item.number ==
                                    this.state.selected_word_number
                                      ? "selected"
                                      : ""
                                  }
                                  onClick={this.addWord.bind(
                                    this,
                                    item.word,
                                    item.number
                                  )}
                                  key={item.number}
                                >
                                  {item.word}
                                </p>
                              );
                            })}
                          {this.state.is_loaded !== true && (
                            <>
                              <SpinnerWrapper>
                                <Spinner
                                  animation="border"
                                  variant="secondary"
                                />
                              </SpinnerWrapper>
                            </>
                          )}
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
                    <div className="table-area">
                      {this.state.exam_table_data !== undefined &&
                        this.state.exam_table_data !== null &&
                        this.state.exam_table_data.length > 0 && (
                          <>
                            <div className={"fl"}>
                              <div className={"inline-flex table-menu row-border-bottom"}>
                                <div className="text-center exam_name">検査名</div>
                                <div className="text-center exam_unit">単位</div>
                                <div className="text-center exam_unit">基準値</div>
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
                        <tbody>
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
                  className={`block-area ${
                    this.state.tab_id != 3 ? "display-force-none" : ""
                  }`}
                >
                  <DialVALeftNav
                    ref={this.VALeftNav}
                    img_version={this.state.img_version}
                    imgBase64={this.state.cur_imageBase64}
                    // image_comment={this.props.item !=null && this.props.item.image_comment !=null ? this.props.item.image_comment : null}
                    image_comment={this.state.cur_imageComment}
                    clearImageRef={this.clearImageRef}
                    // updaeImageBase64={this.handleUpdateImageBase64}
                  />
                </div>
              </div>
            </div>
            <div className={""}>
              {this.state.is_soap && (
                <div className="master_btns">
                  <label className="continue_input">続けて入力</label>
                  <Button
                    type="mono"
                    className={this.state.kind == "S" ? "selected" : ""}
                    onClick={this.setInputKind.bind(this, "S")}
                  >
                    S 訴え
                  </Button>
                  <Button
                    type="mono"
                    className={this.state.kind == "O" ? "selected" : ""}
                    onClick={this.setInputKind.bind(this, "O")}
                  >
                    O 所見
                  </Button>
                  <Button
                    type="mono"
                    className={this.state.kind == "A" ? "selected" : ""}
                    onClick={this.setInputKind.bind(this, "A")}
                  >
                    A 問題点
                  </Button>
                  <Button
                    type="mono"
                    className={this.state.kind == "P" ? "selected" : ""}
                    onClick={this.setInputKind.bind(this, "P")}
                  >
                    P 対応
                  </Button>
                  <Button
                    type="mono"
                    className={this.state.kind == "指示" ? "selected" : ""}
                    onClick={this.setInputKind.bind(this, "指示")}
                  >
                    指示
                  </Button>
                </div>
              )}
            </div>
          </Wrapper>
        </Modal.Body>
        <Card>
          <div className="edit-area">
            <textarea id = "body_id"
              onChange={this.getTextBody.bind(this)}
              value={this.state.is_soap?this.stripHtml(this.state.body_soap[this.state.kind]): this.stripHtml(this.state.body)}
            ></textarea>
          </div>
          <div className="create_info">
            {/* <div className="input-time">
              <label style={{cursor:"text"}}>入力時間</label>
              <DatePicker
                selected={this.state.entry_time}
                onChange={this.getInputTime}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={10}
                dateFormat="HH:mm"
                timeFormat="HH:mm"
                timeCaption="時間"
              />
            </div> */}
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
              <div
                onClick={(e)=>this.showDoctorList(e).bind(this)}
                className={
                  authInfo !== undefined &&
                  authInfo != null &&
                  authInfo.doctor_number === 0
                    ? "remove-x-input"
                    : "remove-x-input cursor-input display-none"
                }
              >
                <InputWithLabel
                  label="指示者"
                  type="text"
                  isDisabled={true}
                  diseaseEditData={
                    this.state.instruction_doctor_number > 0 &&
                    this.state.doctor_list_by_number != undefined
                      ? this.state.doctor_list_by_number[
                          this.state.instruction_doctor_number
                        ]
                      : ""
                  }
                />
              </div>
            )}
          </div>
            
          </Card>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.handleCloseModal}>キャンセル</Button>
            <Button className="red-btn" onClick={this.handleOk}>
              {this.state.number > 0 ? "変更" : "登録"}
            </Button>
        </Modal.Footer>
        {this.state.isShowDoctorList && (
          <DialSelectMasterModal
            selectMaster={this.selectDoctor}
            closeModal={this.closeModal}
            MasterCodeData={this.state.doctors}
            MasterName="医師"
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
      </Modal>
    );
  }
}

InputPanel.contextType = Context;

InputPanel.propTypes = {
  closeModal: PropTypes.func,
  kind: PropTypes.string,
  handleOk: PropTypes.func,
  patient_id: PropTypes.number,
  patientInfo: PropTypes.array,
  schedule_date: PropTypes.string,
  item: PropTypes.object,
  source: PropTypes.string,
  handover_relation: PropTypes.number,
};

export default InputPanel;
