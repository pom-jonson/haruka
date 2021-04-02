import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import DatePicker, { registerLocale } from "react-datepicker";
import { formatDateLine, formatDateSlash, formatTime } from "~/helpers/date";
registerLocale("ja", ja);
import ja from "date-fns/locale/ja";
import InputWithLabel from "../../../../molecules/InputWithLabel";
import Button from "../../../../atoms/Button";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Checkbox from "../../../../molecules/Checkbox";
import * as apiClient from "~/api/apiClient";
import { CACHE_SESSIONNAMES ,getServerTime} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as methods from "~/components/templates/Dial/DialMethods";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import DialSelectDialyzerMasterModal from "~/components/templates/Dial/Common/DialSelectDialyzerMasterModal";
import DialSelectRegularExamMasterModal from "~/components/templates/Dial/Common/DialSelectRegularExamMasterModal";
import DialSelectFacilityOtherModal from "~/components/templates/Dial/Common/DialSelectFacilityOtherModal";
import axios from "axios/index";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import { makeList_code } from "~/helpers/dialConstants";
import SelectPannelModal from "~/components/templates/Dial/Common/SelectPannelModal";
// import Spinner from "react-bootstrap/Spinner";

// const SpinnerWrapper = styled.div`
//   height: 200px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;

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
    margin-top:10px;
    width: 100%;
    height: calc(100% - 150px);
    overflow-y: auto;
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
        width: 70%;
        height: calc(100% - 50px);
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
            overflow-y: auto;
            overflow-x: scroll;
            .table-menu {
                background-color: gainsboro;
                div {
                    line-height: 30px;
                }
            }
            .row-border-bottom {
                border-bottom: 1px solid gray;
            }
            .exam_name {
                width: 200px;
                border-right: 1px solid gray;
            }
            .exam_unit {
                width: 100px;
                border-right: 1px solid gray;
            }
            .exam_date {
                width: 100px;
                border-right: 1px solid gray;
                border-bottom: 1px solid gray;
            }
            .exam_value {
                width: 50px;
                border-right: 1px solid gray;
            }
            .lh-60 {
                line-height: 60px!important;
            }
        }
        .history-table-area {
            height: 100%;
            border: solid 1px darkgray;
            overflow-y: auto;
            table {
                td {
                    text-align: center;
                    input {
                        margin: 0;
                    }
                    padding: 5px;
                }
                th {
                    padding: 5px 0 5px 0;
                    background-color: #f2f2f2;
                }
                .th-date {
                    width: 110px;
                }
                .th-time {
                    width: 70px;
                }
                .tl {
                    text-align: left;
                }
            }
        }
        .block-area {
            eight: calc(100% - 90px);
            display: flex;
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
    .right-area {
        width: 29%;
        height: calc(100% - 50px);
        margin-left: 10px;
        .edit-area {
            height: calc(100% - 150px);
            textarea {
                width: 100%;
                margin: 0px;
                height: 220px;
                max-height: 100%;
            }
        }
        .create_info {
            width: 100%;
            label {
                width: 80px;
                text-align: right;
                margin-right: 10px;
                font-size: 14px;
            }
            .jyZLTd {
                width: calc(100% - 90px);
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

`;

class InputPanel extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    this.register_flag = false;
    let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
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
    //
    var body = "";

    if (item != undefined && item != null) {
      var export_destination = null;
      var export_relation = null;
      var relation = null;
      var external_change_source = null;
      if (is_soap) {
        var soap_numbers = {};
        item.map((sub_item) => {
          body_soap[sub_item.category_2] = sub_item.body;
          soap_numbers[sub_item.category_2] = sub_item.number;
          if (sub_item.body != "") {
            export_relation = sub_item.export_relation;
            export_destination = sub_item.export_destination;
            relation = sub_item.relation;
            external_change_source = sub_item.source;
          }
        });
      } else {
        body = item.body;
        export_relation = item.export_relation;
        export_destination = item.export_destination;
        relation = item.relation;
        external_change_source = item.source;
      }
    }

    // let code_master = sessApi.getObjectValue("dial_common_master","code_master");
    let examinationCodeData = sessApi.getObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER,"examination_master");

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
      isUpdateConfirmModal: false,
      isShowDoctorList: false,
      source: this.props.source,
      handover_relation: this.props.handover_relation,
      export_destination,
      export_relation,
      relation,
      external_change_source,
      change_flag: 0,
      isOpenConfirmModal: false,

      examinationCodeData,
      examination_codes: makeList_code(examinationCodeData),

      is_loaded: false,
      search_order: 1,
    };
  }
  
  componentWillUnmount() {
    sessApi.delObjectValue('dial_change_flag', 'input_inspection');
  }

  async componentDidMount() {
    let server_time = await getServerTime();
    var cur_date = new Date(server_time);
    this.setChangeFlag(0);
    this.getDialyzerCode();
    this.getExamPattern();
    this.getExamDataList();
    this.setDoctors();
    if (this.context.selectedDoctor.code > 0) {
      this.setState({
        instruction_doctor_number: parseInt(this.context.selectedDoctor.code),
        directer_name: this.context.selectedDoctor.name,
      });
    }
    this.setState({      
      examination_start_date: new Date(cur_date.getFullYear(), cur_date.getMonth(),1),
      examination_end_date: cur_date,
    });
  }

  setChangeFlag=(change_flag)=>{      
      this.setState({change_flag});
      if (change_flag){
          sessApi.setObjectValue('dial_change_flag', 'input_inspection', 1)
      } else {
          sessApi.remove('dial_change_flag');
      }
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

  handleOk = () => {
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
    this.props.handleOk(this.state.body);
  };
  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isOpenConfirmModal: false,
      confirm_message: "",
    });
  }

  saveBody = async () => {
    let server_time = await getServerTime();
    if (
      this.state.kind == "申し送り/継続" ||
      this.state.kind == "申し送り/次回" ||
      this.state.kind == "Dr上申" ||
      this.state.kind == "VA継続"
    ) {
      var category = "";
      if (this.state.body == undefined || this.state.body == "") {
        window.sessionStorage.setItem(
          "alert_messages",
          "本文の内容を入力してください。"
        );
        return;
      }
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
      };

      if (this.register_flag === false) {
        this.register_flag = true;
        let path = "/app/api/v2/dial/board/sendingDataRegister";
        apiClient
          .post(path, {
            params: data,
          })
          .then(() => {
            this.props.closeModal();
            if (this.state.kind == "Dr上申") {
              window.sessionStorage.setItem(
                "alert_messages",
                "Dr上申を登録しました。"
              );
            } else if (this.state.kind == "VA継続") {
              window.sessionStorage.setItem(
                "alert_messages",
                "VA継続を登録しました。"
              );
            } else if (this.state.kind == "申し送り/継続") {
              window.sessionStorage.setItem(
                "alert_messages",
                "継続申し送りを登録しました。"
              );
            } else {
              window.sessionStorage.setItem(
                "alert_messages",
                "次回申し送りを登録しました。"
              );
            }
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

      let data = {
        system_patient_id: this.props.patient_id,
        category_1: "現症",
        category_2: "現症",
        instruction_doctor_number: this.state.instruction_doctor_number,
        body: this.state.body,
        schedule_date:
          this.state.schedule_date != undefined &&
          this.state.schedule_date != ""
            ? this.state.schedule_date
            : new Date(server_time),
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
          return;
        }
      } else {
        if (this.state.prefix != "") {
          if (!this.checkBody(this.state.prefix, this.state.body)) {
            window.sessionStorage.setItem(
              "alert_messages",
              "本文を入力してください。"
            );
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
        schedule_date:
          this.state.schedule_date != undefined &&
          this.state.schedule_date != ""
            ? this.state.schedule_date
            : new Date(server_time),
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

      if (this.register_flag === false) {
        this.register_flag = true;
        await apiClient
          ._post(path, {
            params: post_data,
          })
          .then(() => {
            this.props.handleOk();
          })
          .finally(() => {
            this.register_flag = false;
          });
      }
    }
  };

  addWord = (word, selected_word_number) => {
    this.setChangeFlag(1);
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
    this.setChangeFlag(1);
    if (this.state.is_soap) {
      var body_soap = this.state.body_soap;
      body_soap[this.state.kind] = e.target.value;
      this.setState({ body_soap });
    } else {
      this.setState({ body: e.target.value });
    }
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
    this.setState({ entry_time: value });
  };

  setTab = (e, val) => {
    this.setState({ tab_id: val });
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

  showDoctorList = () => {
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

  confirmCloseOk = () => {
    this.setState({
      isOpenConfirmModal: false,
      confirm_message: ""
    },()=>{
      this.props.closeModal();    
    });
  }

  handleCloseModal = () => {
    if (this.state.change_flag == 1) {
      this.setState({
        isOpenConfirmModal: true,
        confirm_message: "登録していない内容があります。変更内容を破棄して閉じますか？"
      });
      return;
    }
    this.props.closeModal();
  }

  render() {
    // const { closeModal } = this.props;
    let { examinationPattern_code_options } = this.state;
    // var authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        className="wordPattern-modal master-modal input-panel-modal"
      >
        <Modal.Header>
          <Modal.Title>治療経過・検査データ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="work-area flex">
              <div className="left-area">
                <div className="search-area flex">
                  <div className="select-area">
                    <SelectorWithLabel
                      options={examinationPattern_code_options}
                      title=""
                      getSelect={this.getExamPatternCode.bind(this)}
                      departmentEditCode={this.state.exam_pattern_code}
                    />
                    <button onClick={this.getExamCodes.bind(this)}>検索</button>
                  </div>

                  <div className="period">
                    <InputWithLabel
                      label="期限"
                      type="date"
                      getInputText={this.getStartdate}
                      diseaseEditData={this.state.examination_start_date}
                    />
                    <div className="pd-15">～</div>
                    <InputWithLabel
                      label=""
                      type="date"
                      getInputText={this.getEnddate}
                      diseaseEditData={this.state.examination_end_date}
                    />
                  </div>
                </div>
                <div className="table-area">
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
                                    this.state.exam_table_data[0] !== null &&
                                    this.state.exam_table_data[0].length > 0 &&
                                    this.state.exam_table_data[0].map(
                                      (item) => {
                                        return (
                                          <>
                                            <div className="text-center exam_date">
                                              {formatDateSlash(new Date(item))}
                                            </div>
                                          </>
                                        );
                                      }
                                    )}
                                </div>
                              </div>
                              <div>
                                <div className={"inline-flex"}>
                                  {this.state.exam_table_data[0] !==
                                    undefined &&
                                    this.state.exam_table_data[0] !== null &&
                                    this.state.exam_table_data[0].length > 0 &&
                                    this.state.exam_table_data[0].map(() => {
                                      return (
                                        <>
                                          <div className="text-center exam_value">
                                            前
                                          </div>
                                          <div className="text-center exam_value">
                                            後
                                          </div>
                                        </>
                                      );
                                    })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {this.state.exam_table_data[1] !== undefined &&
                          this.state.exam_table_data[1] !== null &&
                          Object.keys(this.state.exam_table_data[1]).map(
                            (index) => {
                              let item = this.state.exam_table_data[1][index];
                              return (
                                <>
                                  <div className={"fl"}>
                                    <div
                                      className={
                                        "inline-flex row-border-bottom"
                                      }
                                    >
                                      <div className="text-center exam_name">
                                        {item.name}
                                      </div>
                                      <div className="text-center exam_unit">
                                        {item.unit}
                                      </div>
                                      {this.props.patientInfo != null &&
                                      this.props.patientInfo.gender === 1 ? (
                                        <div className="text-center exam_unit">
                                          {item.reference_value_male != null &&
                                          item.reference_value_male !== ""
                                            ? "男:" + item.reference_value_male
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
                                        this.state.exam_table_data[0].length >
                                          0 &&
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
                                                          item[date].value2 +
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
                      </>
                    )}
                </div>
                <div className={"check-area"}>
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
                </div>
              </div>
              <div className="right-area">
                <div className="edit-area">
                  <textarea
                    onChange={this.getTextBody.bind(this)}
                    value={
                      this.state.is_soap
                        ? this.state.body_soap[this.state.kind]
                        : this.state.body
                    }
                  ></textarea>
                </div>
                <div className="create_info">
                  <div className="input-time">
                    <label>入力時間</label>
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
                  </div>
                  {/*入力がドクターの場合は入力者の表示はいらない*/}
                  {/* {authInfo !== undefined && authInfo != null && authInfo.doctor_number === 0 && (
                                <div>
                                    <InputWithLabel
                                        label="入力者"
                                        type="text"
                                        diseaseEditData={authInfo.name}
                                    />
                                </div>
                            )}
                            {this.state.doctor_list_by_number != undefined && (
                                <div onClick={this.showDoctorList.bind(this)} className={authInfo !== undefined && authInfo != null && authInfo.doctor_number === 0?'':'display-none'}>
                                    <InputWithLabel
                                        label="指示者"
                                        type="text"
                                        diseaseEditData={(this.state.instruction_doctor_number > 0) ? this.state.doctor_list_by_number[this.state.instruction_doctor_number] : ''}
                                    />
                                </div>
                            )} */}
                </div>
              </div>
            </div>

            <div className={"flex"}>
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
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.handleCloseModal}>キャンセル</Button>
            <Button className={this.state.change_flag == 0 ? "disable-btn": "red-btn"} onClick={this.handleOk}>{"登録"}</Button>
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
        {this.state.isOpenConfirmModal !== false &&  (
              <SystemConfirmJapanModal
                  hideConfirm= {this.confirmCancel.bind(this)}
                  confirmCancel= {this.confirmCancel.bind(this)}
                  confirmOk= {this.confirmCloseOk}
                  confirmTitle= {this.state.confirm_message}
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
