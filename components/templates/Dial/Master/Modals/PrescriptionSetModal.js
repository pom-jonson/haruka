import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "../../../../atoms/Button";
import RadioButton from "~/components/molecules/RadioInlineButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/pro-solid-svg-icons";
import InputWithLabelBorder from "../../../../molecules/InputWithLabelBorder";
import PrescriptMedicineSelectModal from "../../modals/PrescriptMedicineSelectModal";
import SelectUsageModal from "../../modals/SelectUsageModal";
import * as methods from "~/components/templates/Dial/DialMethods";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as apiClient from "~/api/apiClient";
import { getMasterValidate } from "~/components/templates/Dial/DialMethods";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import { masterValidate } from "~/helpers/validate";
import {
  removeRedBorder,
} from "~/helpers/dialConstants";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from "jquery";
import CalcDial from "~/components/molecules/CalcDial";
import Checkbox from "~/components/molecules/Checkbox";
import * as sessApi from "~/helpers/cacheSession-utils";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";

const Icon = styled(FontAwesomeIcon)`
  color: black;
  font-size: 15px;
  margin-right: 5px;
`;

const Wrapper = styled.div`
  display: block;
  font-size: 1.125rem;
  width: 100%;
  height: 70vh;  
  float: left;
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .header{
    padding-right: 1rem;
    label{
        font-size: 1.125rem;
        width: 7rem;
        margin-top: 0px;
        line-height: 38px;
        text-align: right;
    }
    input {
        font-size: 1.125rem;
        width: calc(100% - 7rem);
    }
    .set-id, .sort-order {
      width: 20%;
    }
    .set-name, .kana-name {
      width: 30%;
    }
    
  }
  .checkbox_area {
    label {
      font-size: 1.125rem;
      width: 7rem;
      margin-left: 1.5rem;
      line-height: 38px;
      text-align: right;
      margin-top: 8px;
    }
  }

  .left-area {
    width: 10%;
    padding-left: 1rem;
    .sortation-btn {
        margin-top: 5px;
        label{
            font-size: 18px;
        }
    }
    .radio-btn label{
        font-size: 16px;
        width: 100px;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 4px;
        padding: 4px 5px;
        text-align:center;
        margin: 0 5px;
        margin-bottom: 5px;
  }
  
  }
  .main-area {
    height: calc(100% - 7.5rem);
  }
  .right-area {
      width: 90%;
       padding-left: 1rem;
      .input-info-area {
        width: 320px;
       }

       .edit-btn {
            button {
             margin-left: 5px;
            }
       }
      .dial-body {
          width: 100%;
          margin-top: 5px;
          height: 40vh;
          overflow-y: auto;
          border: solid 1px rgb(206, 212,218);
          padding: 10px;
          .react-grid-Canvas{
            height: 300px !important;
            }
         td {
              padding: 0 5px 0 5px;
              button {
                  min-width: 50px;
                  text-align: center;
                  background: #ddd;
                  border: solid 1px #aaa;
                  margin: 0px;
               }
               line-height: 35px;
         }
         .set-title {
            td {
                background-color: blue;
                color:white;
            }
         }
         .btn-area {
              line-height: 15px;
              width: 50px;
              background-color: white!important;
              padding: 0;
         }
      }
      .dial-oper {
        .row {
            margin: 0px;
        }
      }
  }
  .footer {
    margin-left: 44%;
  }
  .footer button {
    margin-right: 10px;
    background-color: rgb(38, 159, 191);
    border-color: rgb(38, 159, 191);
    span {
        color: white;
        font-size: 20px;
    }
  }
  }

.selected-rp {
    background: #eee;
}
.rp-comment{
    label {
      margin-top: 0;
      width: 110px;
      text-align: right;
    }
    input {
      margin-top: -8px;
    }
}
#set_id_id{
  ime-mode: inactive;
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
    max-width:230px;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: normal;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
    }
    .blue-text {
      color: blue;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
`;

const HoverPatternMenu = ({ visible, x, y, rp_index, comment_index, parent, word_pattern_list}) => {  
  if (visible){
    return (
      <ContextMenuUl>
        <ul className="hover-pattern-menu context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {word_pattern_list != undefined && word_pattern_list != null && word_pattern_list.length > 0 && 
            word_pattern_list.map(pattern => {
              return (
                <>
                  <li style={{padding:'5px 12px'}} onMouseOver = {e => parent.setPatternHover(e, rp_index,  comment_index, pattern.number)}>{pattern.name}</li>
                </>
              )
            })
          }
        </ul>
      </ContextMenuUl>
    )
  } else {
    return null;
  }
}

const HoverWordMenu = ({ visible, x, y, rp_index, comment_index, parent, selected_word_list}) => {
  if (visible){
    return (
      <ContextMenuUl>
        <ul className="hover-word-menu context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {selected_word_list != undefined && selected_word_list != null && selected_word_list.length > 0 && 
            selected_word_list.map(item => {
              return(
                <>
                <li><div onClick = {e => parent.selectRpWord(e, rp_index, comment_index, item.word)}>{item.word}</div></li>
                </>
              )
            })
          }
        </ul>
      </ContextMenuUl>
    )
  } else {
    return null;
  }
}

const ContextMenu = ({ visible, x, y, parent, rp_index, medi_index, comment_index }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu main-context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {medi_index != undefined && (
            <>
              <li>
                <div onMouseOver = {e => parent.outMainHover(e)} onClick={() =>parent.contextMenuAction(rp_index, medi_index, "med_change")}>
                  薬剤変更
                </div>
              </li>
              <li>
                <div onMouseOver = {e => parent.outMainHover(e)} onClick={() => parent.contextMenuAction(rp_index,medi_index,"amount_change")}>
                  数量変更
                </div>
              </li>
              <li><div onMouseOver = {e => parent.outMainHover(e)} onClick={() => parent.contextMenuAction( rp_index, medi_index, "is_not_generic" )}>後発品への変更不可</div></li>
            </>
          )}
          {comment_index !== undefined && comment_index >= 0 && (
            <>
              <li><div onMouseOver = {e => parent.outMainHover(e)} onClick={() => parent.contextMenuAction(rp_index, medi_index, "change_free_comment", comment_index)}>RPコメント編集</div></li>
              <li><div onMouseOver = {e => parent.outMainHover(e)} onClick={() => parent.contextMenuAction(rp_index, medi_index, "delete_free_comment", comment_index)}>RPコメント削除</div></li>
            </>
          )}
          <li><div onMouseOver = {e => parent.outMainHover(e)} onClick={() => parent.contextMenuAction(rp_index, medi_index, "usage_change")}>用法・日数/回数変更</div></li>
          {!(medi_index >= 0) && (
            <>
              <li id = "regular-comment-li"><div onMouseOver = {e => parent.setMainHover(e, rp_index, comment_index)}>RPコメント行追加（定型文）</div></li>
              <li><div onMouseOver = {e => parent.outMainHover(e)} onClick={() => parent.contextMenuAction(rp_index, medi_index, "add_free_comment", comment_index)}>RPコメント行追加（フリー）</div></li>
            </>
          )}          
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const sortations = ["内服", "頓服", "外用", "処置", "麻酔", "インスリン"];

class PrescriptionSetModal extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    this.state = {
      regular_prescription_number: 1,
      medicine_kind: "",
      isOpenMedicineModal: false,
      isOpenUsageModal: false,
      rp_number: 0,
      prescription_category: "内服",
      usage_code: "",
      comment: "",
      data_json_item: {
        rp_number: 0,
        prescription_category: "内服",
        usage_code: "",
        usage_name: "",
        days: 0,
        disable_days_dosing: 0,
        free_comment: [],
        medicines: [],
      },
      is_pattern: 0,
      confirm_message: "",
      complete_message: "",
      rp_index: "",
      medi_index: "",
      isOpenAmountModal: false,
      isUpdateConfirmModal: false,
      selected_rp: "",
      input_comment: false,
      name:
        this.props.modal_data != null &&
        this.props.modal_data.name !== undefined
          ? this.props.modal_data.name
          : "",
      name_kana:
        this.props.modal_data != null &&
        this.props.modal_data.name_kana !== undefined
          ? this.props.modal_data.name_kana
          : "",
      set_id:
        this.props.modal_data != null &&
        this.props.modal_data.set_id !== undefined
          ? this.props.modal_data.set_id
          : "",
      data_json:
        this.props.modal_data != null &&
        this.props.modal_data.data_json !== undefined
          ? this.props.modal_data.data_json
          : [],
      sort_order:
        this.props.modal_data != null &&
        this.props.modal_data.sort_order !== undefined
          ? this.props.modal_data.sort_order
          : "",
      number:
        this.props.modal_data != null &&
        this.props.modal_data.number !== undefined
          ? this.props.modal_data.number
          : null,
      is_enabled:
        this.props.modal_data != null &&
        this.props.modal_data.is_enabled !== undefined
          ? this.props.modal_data.is_enabled
          : 1,
      isBackConfirmModal: false,
      isMinusConfirmModal: false,
      confirm_alert_title:'',
      alert_message: '',
      alert_messages: '',
      isOpenCalcModal: false,
    };
    this.double_click = false;
    this.original = '';
    let dial_pattern_validate = sessApi.getObject("init_status").dial_pattern_validate;
    this.free_comment_max = 30;
    this.free_comment_err_msg = "RPのコメントは30文字以下で入力してください。";
    if (dial_pattern_validate !== undefined && dial_pattern_validate.dial_prescription_pattern !== undefined &&
      dial_pattern_validate.dial_prescription_pattern.free_comment !== undefined ) {
      this.free_comment_max = dial_pattern_validate.dial_prescription_pattern.free_comment.length;
      this.free_comment_err_msg = dial_pattern_validate.dial_prescription_pattern.free_comment.overflow_message != "" ?
        dial_pattern_validate.dial_prescription_pattern.free_comment.overflow_message : this.free_comment_err_msg;
    }
  }
  async componentDidMount() {
    await this.getWordInfo();
    this.original = JSON.stringify(this.state);
    this.changeBackground();
  }

  getWordInfo = async() => {
    let path = "/app/api/v2/dial/board/searchPatternAndWords";
    await apiClient
      ._post(path, {
        params: {
          is_enabled: 1,
          usable_page: '処方/RPコメント',
          order: 'name_kana',
        },
      })
      .then((res) => {
        this.setState({
          word_pattern_list: res.pattern,
          word_list:res.word
        });
      })
      .catch(() => {});
  }
  
  componentDidUpdate() {
    this.changeBackground();
  }
  
  changeBackground = () => {
    masterValidate("dial_prescription_set_master", this.state, 'background');
  };
  //--------------------------------------
  //check validation of parameter
  registerCheckValidation = () => {
    removeRedBorder("name_id");
    removeRedBorder("set_id_id");
    let error_str_arr = [];
    let validate_data = masterValidate("dial_prescription_set_master", this.state);
    
    if (validate_data.error_str_arr.length > 0) {
      error_str_arr = validate_data.error_str_arr;
    }
    if (
      this.context.$canDoAction(
        this.context.FEATURES.DIAL_SYSTEM,
        this.context.AUTHS.EDIT
      ) === false
    ) {
      error_str_arr.unshift("変更権限がありません。");
    }
    if (validate_data.first_tag_id != "") {
      this.setState({ first_tag_id: validate_data.first_tag_id });
    }
    return error_str_arr;
  };
  //----------------------------
  
  //set focus on first error tag  when close the error alert modal
  closeAlertModal = () => {
    this.setState({ alert_message: "" });
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null) {
      $("#" + first_tag_id).focus();
    }
  };
  
  confirmCancel() {
    this.setState({
      isMakeScheduleModal: false,
      isUpdateConfirmModal: false,
      isBackConfirmModal: false,
      isMinusConfirmModal: false,
      confirm_message: "",
      confirm_type: "",
      confirm_alert_title:''
    });
  }
  
  getInputMan = (e) => {
    this.setState({ entry_name: e.target.value });
  };
  
  changeMedicineKind = (value) => {
    this.setState({ medicine_kind: value });
  };
  
  closeModal = () => {
    this.setState({
      isOpenSetPrescriptListModal: false,
      isOpenMakePrescriptByHistoryModal: false,
      isOpenAmountModal: false,
      isOpenMedicineModal: false,
      change_med_index: null,
      selected_medicine: null,
      alert_messages: ""
    }, ()=> {
      if (document.getElementById("input_comment") != null) {
        let data_json = this.state.data_json;
        let comment_length =
          data_json[this.state.selected_rp].free_comment !== undefined &&
          data_json[this.state.selected_rp].free_comment != null &&
          data_json[this.state.selected_rp].free_comment.length > 0 &&
          data_json[this.state.selected_rp].free_comment[this.state.selected_comment_index] != ""
            ? data_json[this.state.selected_rp].free_comment[this.state.selected_comment_index].length
            : 0;
        this.setCaretPosition(document.getElementById("input_comment"),comment_length);
      }
    });
  };
  
  closeMedicineModal = () => {
    this.setState({ isOpenMedicineModal: false });
  };
  
  closeUsageModal = () => {
    this.setState({ isOpenUsageModal: false });
  };
  
  changeMedicineKind = (value) => {
    this.setState({
      prescription_category: sortations[value],
      isOpenMedicineModal: true,
      medicine_kind: value,
      is_open_usage: 1,
      data_json_item: {
        rp_number: 0,
        prescription_category: "内服",
        usage_code: "",
        usage_name: "",
        days: 0,
        disable_days_dosing: 0,
        free_comment: [],
        medicines: [],
      },
    });
  };
  
  addMedicine = (value, prescription_category) => {
    this.setState({
      rp_number: value,
      prescription_category,
      is_open_usage: 0,
      medicine_kind: sortations.indexOf(prescription_category),
      data_json_item: {
        rp_number: value,
        prescription_category,
        usage_code: "",
        usage_name: "",
        days: 0,
        disable_days_dosing: 0,
        free_comment: [],
        medicines: [],
      },
      isOpenMedicineModal: true,
    });
  };
  getAlwaysShow = (name, value) => {
    if (name === "alwaysShow") this.setState({ is_enabled: value });
  };
  
  handleOk = (medicine_data, rp_number, is_open_usage) => {
    if (is_open_usage === 1) {
      let data_json_item = { ...this.state.data_json_item };
      let medicine = { ...medicine_data };
      data_json_item.medicines.push(medicine);
      this.setState({
        data_json_item,
        isOpenMedicineModal: false,
        isOpenUsageModal: true,
      });
      return;
    } else {
      let data_json = this.state.data_json;
      let data_json_item = { ...this.state.data_json[rp_number] };
      let medicines = data_json_item.medicines;
      if (
        this.state.selected_medicine !== undefined &&
        this.state.selected_medicine != null &&
        this.state.change_med_index !== undefined &&
        this.state.change_med_index != null
      ) {
        medicines[this.state.change_med_index] = medicine_data;
        this.setState({
          change_med_index: null,
          selected_medicine: null,
        });
      } else {
        medicines.push(medicine_data);
      }
      data_json_item.medicines = medicines;
      data_json[rp_number] = data_json_item;
      this.setState({
        data_json,
        isOpenMedicineModal: false,
      });
    }
  };
  
  handleUsageOk = (usage_data) => {
    if (this.state.rp_index !== "") {
      // 服用編集
      let data_json_item = { ...this.state.data_json_item };
      data_json_item.rp_number = this.state.rp_number + 1;
      data_json_item.usage_code = usage_data.usage_code;
      data_json_item.usage_name = usage_data.usage_name;
      data_json_item.days = usage_data.days;
      data_json_item.medicines = this.state.data_json[
        this.state.rp_index
        ].medicines;
      data_json_item.disable_days_dosing = usage_data.disable_days_dosing;
      data_json_item.prescription_category = this.state.prescription_category;
      data_json_item.free_comment = this.state.data_json[
        this.state.rp_index
        ].free_comment;
      this.setState((state) => {
        let data_json = state.data_json;
        data_json[this.state.rp_index] = data_json_item;
        return {
          data_json,
          modal_data: null,
          isOpenUsageModal: false,
          rp_index: "",
          data_json_item: {
            rp_number: data_json_item.rp_number,
            prescription_category: "内服",
            usage_code: "",
            usage_name: "",
            days: 0,
            disable_days_dosing: 0,
            free_comment: [],
            medicines: [],
          },
        };
      });
    } else {
      let data_json_item = { ...this.state.data_json_item };
      data_json_item.rp_number = this.state.rp_number + 1;
      data_json_item.usage_code = usage_data.usage_code;
      data_json_item.usage_name = usage_data.usage_name;
      data_json_item.days = usage_data.days;
      data_json_item.disable_days_dosing = usage_data.disable_days_dosing;
      data_json_item.prescription_category = this.state.prescription_category;
      this.setState((state) => {
        let data_json = state.data_json;
        data_json.push(data_json_item);
        return {
          data_json,
          modal_data: null,
          isOpenUsageModal: false,
          rp_index: "",
          selected_rp: data_json.length - 1, // RP追加時は、そのRPが選択される状態
          data_json_item: {
            rp_number: data_json_item.rp_number,
            prescription_category: "内服",
            usage_code: "",
            usage_name: "",
            days: 0,
            disable_days_dosing: 0,
            free_comment: [],
            medicines: [],
          },
        };
      });
    }
  };
  
  deleteMedicine = (rp_index, medi_index) => {
    this.setState({
      sel_del_rp: rp_index,
      sel_del_med: medi_index,
      isMinusConfirmModal: true,
      confirm_message: "削除しますか？",
    });
  };
  
  deleteRp = (rp_index) => {
    this.setState({
      sel_del_rp: rp_index,
      isMinusConfirmModal: true,
      confirm_message: "削除しますか？",
    });
  };
  
  confirmDeleteRp = (rp_index, medi_index) => {
    this.confirmCancel();
    let data_json = this.state.data_json;
    if (medi_index == null) {
      data_json.splice(rp_index, 1);
      this.setState({
        data_json,
        sel_del_rp: null,
      });
      return;
    }
    let data_json_item = { ...this.state.data_json[rp_index] };
    let medicines = data_json_item.medicines;
    if (medicines.length == 1) {
      data_json.splice(rp_index, 1);
      this.setState({
        data_json,
        sel_del_med: null,
        sel_del_rp: null,
      });
      return;
    }
    data_json_item.medicines.splice(medi_index, 1);
    data_json[rp_index] = data_json_item;
    this.setState({
      data_json,
      sel_del_med: null,
      sel_del_rp: null,
    });
  };
  
  checkValidation = () => {
    let error_str = '';
    let master_validate = getMasterValidate();
    let validate_data = master_validate.dial_prescription_set_master;
    if (
      this.context.$canDoAction(
        this.context.FEATURES.DIAL_SYSTEM,
        this.context.AUTHS.EDIT
      ) === false
    ) {
      error_str = "変更権限がありません。";
    }
    if (this.state.name === "") {
      error_str = "セット名を入力してください。";
    } else if (this.state.name_kana === "") {
      error_str = "カナ名を入力してください。";
    } else if (this.state.sort_order === "") {
      error_str = "表示順を入力してください。";
    } else if (
      this.state.data_json == undefined ||
      this.state.data_json == null ||
      this.state.data_json.length === 0
    ) {
      error_str = "薬剤を選択してください。";
    } else if (
      this.state.name != null &&
      this.state.name != "" &&
      this.state.name.length > validate_data.name.length
    ) {
      error_str =
        "セット名を" +
        validate_data.name.length +
        "文字以下で入力してください。";
    } else if (
      this.state.name_kana != null &&
      this.state.name_kana != "" &&
      validate_data.name_kana != undefined &&
      validate_data.name_kana.length != undefined &&
      this.state.name_kana.length > validate_data.name.length
    ) {
      error_str =
        "カナ名を" +
        validate_data.name_kana.length +
        "文字以下で入力してください。";
    } else if (
      this.state.set_id != null &&
      this.state.set_id != "" &&
      this.state.set_id.length > validate_data.set_id.length
    ) {
      error_str =
        "セットIDを" +
        validate_data.set_id.length +
        "文字以下で入力してください。";
    } else if (JSON.stringify(this.state) == this.original) {
      error_str = "変更内容がありません。";
    }
    return error_str;
  }
  
  registerPrescriptionSet = async () => {
    this.setState({
      isUpdateConfirmModal: false,
      confirm_message: "",
    });
    let path = "/app/api/v2/dial/master/prescriptionSet_register";
    const post_data = {
      number: this.state.number,
      name: this.state.name,
      name_kana: this.state.name_kana,
      set_id: this.state.set_id,
      sort_order: this.state.sort_order,
      is_enabled: this.state.is_enabled,
      data_json: this.state.data_json,
    };
    if (this.double_click == true) return;
    this.double_click = true;
    await apiClient
      .post(path, { params: post_data })
      .then((res) => {
        if (res) {
          var title = '';
          var message = res.alert_message;
          if (message.indexOf('変更') > -1) title = "変更完了##";
          if (message.indexOf('登録') > -1) title = "登録完了##";
          window.sessionStorage.setItem("alert_messages", title + res.alert_message);
          this.props.handleOk();
        }
      })
      .finally(() => {
        this.double_click = false;
      });
  };
  
  confirmRegister = () => {
    var error = this.registerCheckValidation();
    if (error.length > 0) {
      this.setState({ alert_message: error.join("\n") });
      return;
    }
    let confirm_message = this.state.number != null ? "処方セットを変更しますか?" : "処方セットを登録しますか？";
    this.setState({
      isUpdateConfirmModal: true,
      confirm_message
    });
  };
  
  handleClick = (e, rp_index, medi_index, comment_index) => {
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ 
          contextMenu: { visible: false },
          hoverPatternMenu:{visible:false},
          hoverWordMenu:{visible:false},
          pattern_menu_reserved_flag:false,  
         });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({ 
          contextMenu: { visible: false },
          hoverPatternMenu:{visible:false},
          hoverWordMenu:{visible:false},
          pattern_menu_reserved_flag:false,  
         });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("code-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({ 
            contextMenu: { visible: false },
            hoverPatternMenu:{visible:false},
            hoverWordMenu:{visible:false},
            pattern_menu_reserved_flag:false,  
           });
          document
            .getElementById("code-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });        
      document
        .getElementById("dial-body")
        .addEventListener("scroll", function onScrollOutside() {          
          that.setState({ 
            contextMenu: { visible: false },
            hoverPatternMenu:{visible:false},
            hoverWordMenu:{visible:false},
            pattern_menu_reserved_flag:false,  
           });
          document
            .getElementById("dial-body")
            .removeEventListener(`scroll`, onScrollOutside);
        });

      let clientY = e.clientY;
      let clientX = e.clientX;
      var modal = document.getElementById('select-usage-modal');
      this.setState({
        hoverPatternMenu:{visible:false},
        hoverWordMenu:{visible:false},
        pattern_menu_reserved_flag:false,
        contextMenu: {
          visible: true,
          x: e.clientX - modal.offsetLeft,
          y: e.clientY + window.pageYOffset - modal.offsetTop,
        },
        rp_index: rp_index,
        medi_index: medi_index,
        comment_index: comment_index
      },()=>{
        let main_menu_width = 208;
        var main_menu_height = 130;
        if (medi_index !== undefined) {
          main_menu_width = 156;
          main_menu_height = 78;
        }
        if (clientX - modal.offsetLeft + main_menu_width > modal.offsetWidth && clientY - modal.offsetTop + main_menu_height <= modal.offsetHeight) {
          this.setState({
            contextMenu: {
              visible: true,
              x: clientX - modal.offsetLeft - main_menu_width,
              y: clientY - modal.offsetTop,
            },
          })
        }
        if (clientX - modal.offsetLeft + main_menu_width > modal.offsetWidth && clientY - modal.offsetTop + main_menu_height > modal.offsetHeight) {
          this.setState({
            contextMenu: {
              visible: true,
              x: clientX - modal.offsetLeft - main_menu_width,
              y: clientY - modal.offsetTop - main_menu_height,
            },
          })
        }
        if (clientX - modal.offsetLeft + main_menu_width <= modal.offsetWidth && clientY - modal.offsetTop + main_menu_height > modal.offsetHeight) {
          this.setState({
            contextMenu: {
              visible: true,
              x: clientX - modal.offsetLeft,
              y: clientY - modal.offsetTop - main_menu_height,
            },
          })
        }        
      });
    }
  };

  selectRpWord = (e,  rp_index, comment_index, word) => {
    let data_json = this.state.data_json;
    let data_json_item = { ...this.state.data_json[rp_index] };
    let free_comment = data_json_item.free_comment;
    if (free_comment === undefined) free_comment = [];
    let com_index = '';
    if (comment_index == undefined){
      com_index = free_comment.length;
    } else {
      com_index = comment_index + 1;
    }

    if(free_comment.length == 0 || comment_index == undefined) {
      free_comment.push(word);
      com_index = free_comment.length -1;
    } else {
      free_comment.splice(comment_index + 1, 0, word);
    }

    data_json_item.free_comment = free_comment;
    data_json[rp_index] = data_json_item;
    this.setState({
      data_json,
      selected_comment_index: com_index,
      selected_rp: rp_index,
    }, () => {      
      if (document.getElementById("input_comment") != null) {        
        let data_json = this.state.data_json;
        let comment_length =
          data_json[this.state.selected_rp].free_comment !== undefined &&
          data_json[this.state.selected_rp].free_comment != null &&
          data_json[this.state.selected_rp].free_comment.length > 0 &&
          data_json[this.state.selected_rp].free_comment[this.state.selected_comment_index] != ""
            ? data_json[this.state.selected_rp].free_comment[this.state.selected_comment_index].length
            : 0;            
        this.setCaretPosition(document.getElementById("input_comment"),comment_length);
      }
    })    
  }

  setPatternHover = (e,  rp_index, comment_index, pattern_number) => {
    /*@cc_on _d = document; eval ( 'var document = _d') @*/
    e.preventDefault();
    // eslint-disable-next-line consistent-this
    const that = this;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({ hoverWordMenu: { visible: false } });
      document.removeEventListener(`click`, onClickOutside);
    });
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({
        hoverWordMenu: { visible: false }
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });    
    var word_list = this.state.word_list;
    var selected_word_list = [];
    if (word_list != undefined && word_list != null && word_list.length != 0){
      selected_word_list = word_list[pattern_number];
    }
    var modal = document.getElementById('select-usage-modal');
    var hover_pattern_menu = document.getElementsByClassName('hover-pattern-menu')[0];    
    var clientX = hover_pattern_menu.offsetLeft + hover_pattern_menu.offsetWidth;
    var clientY = hover_pattern_menu.offsetTop + e.target.offsetTop;
    this.setState({
      selected_pattern_number:pattern_number,
      selected_word_list,
      hoverWordMenu: {
        visible: true,
        x: clientX,
        y: clientY,
        rp_index,
        comment_index,
      },
    }, () => {
      let word_menu = document.getElementsByClassName("hover-word-menu")[0];      
      if(clientY + word_menu.offsetHeight > modal.offsetHeight){
        if (this.state.pattern_menu_reserved_flag != true){
          this.setState({
            hoverWordMenu: {
              visible: true,
              x: clientX,
              y: clientY - word_menu.offsetHeight + 30,
              rp_index,
              comment_index,
            }
          })
        } else {
          this.setState({
            hoverWordMenu: {
              visible: true,
              x: hover_pattern_menu.offsetLeft - word_menu.offsetWidth,
              y: clientY - word_menu.offsetHeight + 30,
              rp_index,
              comment_index,
            }
          })
        }
      } else {
        if (this.state.pattern_menu_reserved_flag == true){
          this.setState({
            hoverWordMenu: {
              visible: true,
              x: hover_pattern_menu.offsetLeft - word_menu.offsetWidth,
              y: clientY,
              rp_index,
              comment_index,
            }
          })
        }
      }
    });
  }

  outMainHover = () => {
    this.setState({ 
      hoverPatternMenu: { visible: false },
      hoverWordMenu: { visible: false },
    });
  }

  setMainHover = (e,  rp_index,  comment_index) => {    
    /*@cc_on _d = document; eval ( 'var document = _d') @*/
    e.preventDefault();
    // eslint-disable-next-line consistent-this
    const that = this;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({ hoverPatternMenu: { visible: false } });
      document.removeEventListener(`click`, onClickOutside);
    });
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({
        hoverPatternMenu: { visible: false }
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    var main_menu = document.getElementsByClassName('main-context-menu')[0];
    var regular_comment_li = document.getElementById('regular-comment-li');
    var hover_pattern_y = main_menu.offsetTop + regular_comment_li.offsetTop;
    var hover_pattern_x = main_menu.offsetLeft + main_menu.offsetWidth;
    var modal = document.getElementById('select-usage-modal');
    this.setState({
      hoverPatternMenu: {
        visible: true,
        x: hover_pattern_x,
        y: hover_pattern_y,
        rp_index,
        comment_index,        
      },
      pattern_menu_reserved_flag:false,
    }, () => {
      var pattern_menu = document.getElementsByClassName('hover-pattern-menu')[0];
      if (hover_pattern_x + pattern_menu.offsetWidth + 230 > modal.offsetWidth && hover_pattern_y + pattern_menu.offsetHeight <= modal.offsetHeight){
        this.setState({
          hoverPatternMenu: {
            visible: true,
            x: main_menu.offsetLeft - pattern_menu.offsetWidth,
            y: hover_pattern_y,
            rp_index,
            comment_index
          },
          pattern_menu_reserved_flag:true,
        }, () => {
          this.setState({
            hoverPatternMenu: {
              visible: true,
              x: main_menu.offsetLeft - pattern_menu.offsetWidth,
              y: hover_pattern_y,
              rp_index,
              comment_index
            },
          })          
        })
      }
      if (hover_pattern_x + pattern_menu.offsetWidth + 230> modal.offsetWidth && hover_pattern_y + pattern_menu.offsetHeight > modal.offsetHeight){
        this.setState({
          hoverPatternMenu: {
            visible: true,
            x: main_menu.offsetLeft - pattern_menu.offsetWidth,
            y: hover_pattern_y - pattern_menu.offsetHeight + 30,
            rp_index,
            comment_index,            
          },
          pattern_menu_reserved_flag:true,
        }, () => {
          this.setState({
            hoverPatternMenu: {
              visible: true,
              x: main_menu.offsetLeft - pattern_menu.offsetWidth,
              y: hover_pattern_y - pattern_menu.offsetHeight + 30,
              rp_index,
              comment_index
            },
          })          
        })
      }
      if (hover_pattern_x + pattern_menu.offsetWidth + 230 <= modal.offsetWidth && hover_pattern_y + pattern_menu.offsetHeight > modal.offsetHeight){
        this.setState({
          hoverPatternMenu: {
            visible: true,
            x: hover_pattern_x,
            y: hover_pattern_y - pattern_menu.offsetHeight + 30,
            rp_index,
            comment_index,            
          },
          pattern_menu_reserved_flag:false,
        })
      }
    });
  }
  
  contextMenuAction = (rp_index, medi_index, type, comment_index) => {
    if (type === "amount_change") {
      if (this.state.data_json[rp_index].medicines == undefined) return;
      this.setState({
        // isOpenAmountModal: true,
        isOpenCalcModal: true,
        calcInit: this.state.data_json[rp_index].medicines[medi_index].amount,
        calcValType: "",
        calcTitle: this.state.data_json[rp_index].medicines[medi_index]
          .item_name,
        calcUnit: this.state.data_json[rp_index].medicines[medi_index].unit,
        medi_data: this.state.data_json[rp_index].medicines[medi_index],
      });
    } else if (type === "usage_change") {
      this.setState({
        isOpenUsageModal: true,
        medicine_kind: sortations.indexOf(
          this.state.data_json[rp_index].prescription_category
        ),
        modal_data: this.state.data_json[rp_index],
        usage_only: true
      });
    } else if (type === "med_change") {
      this.setState({
        isOpenMedicineModal: true,
        only_med: true,
        medicine_kind: sortations.indexOf(
          this.state.data_json[rp_index].prescription_category
        ),
        selected_medicine: this.state.data_json[rp_index].medicines[medi_index],
        rp_number: rp_index,
        change_med_index: medi_index,
      });
    } else if (type === "is_not_generic") {
      let data_json = this.state.data_json;
      let data_json_item = { ...this.state.data_json[rp_index] };
      let medicines = data_json_item.medicines;
      medicines[medi_index].is_not_generic = medicines[medi_index].is_not_generic == 0 ? 1 : 0;
      data_json_item.medicines = medicines;
      data_json[rp_index] = data_json_item;
      this.setState({
        data_json,
      });
    } else if (type === "add_free_comment") {
      let data_json = this.state.data_json;
      let data_json_item = { ...this.state.data_json[rp_index] };
      let free_comment = data_json_item.free_comment;
      if (free_comment === undefined) free_comment = [];
      let com_index = comment_index + 1;
      if(free_comment.length == 0 || comment_index === undefined) {
        free_comment.push("");
        com_index = free_comment.length - 1;
      }
      else free_comment.splice(comment_index + 1, 0, "");
      data_json_item.free_comment = free_comment;
      data_json[rp_index] = data_json_item;
      this.setState({
        data_json,
        selected_comment_index: com_index,
        selected_rp: rp_index,
      }, ()=>{
        if (document.getElementById("input_comment") != null) {
          let data_json = this.state.data_json;
          let comment_length =
            data_json[this.state.selected_rp].free_comment !== undefined &&
            data_json[this.state.selected_rp].free_comment != null &&
            data_json[this.state.selected_rp].free_comment.length > 0 &&
            data_json[this.state.selected_rp].free_comment[this.state.selected_comment_index] != ""
              ? data_json[this.state.selected_rp].free_comment[this.state.selected_comment_index].length
              : 0;
          this.setCaretPosition(document.getElementById("input_comment"),comment_length);
        }
      });
    } else if (type === "change_free_comment") {
      this.setState({
        selected_comment_index: comment_index,
        selected_rp: rp_index,
      }, ()=> {
        if (document.getElementById("input_comment") != null) {
          let data_json = this.state.data_json;
          let comment_length =
            data_json[this.state.selected_rp].free_comment !== undefined &&
            data_json[this.state.selected_rp].free_comment != null &&
            data_json[this.state.selected_rp].free_comment.length > 0 &&
            data_json[this.state.selected_rp].free_comment[this.state.selected_comment_index] != ""
              ? data_json[this.state.selected_rp].free_comment[this.state.selected_comment_index].length
              : 0;
          this.setCaretPosition(document.getElementById("input_comment"),comment_length);
        }
      });
    } else if (type === "delete_free_comment") {
      let data_json = this.state.data_json;
      let data_json_item = { ...this.state.data_json[rp_index] };
      let free_comment = data_json_item.free_comment;
      free_comment.splice(comment_index, 1);
      data_json_item.free_comment = free_comment;
      data_json[rp_index] = data_json_item;
      this.setState({
        data_json,
        selected_rp: rp_index,
      });
    }
  };
  
  amountChange = (amount) => {
    if (this.state.medi_index !== "" && this.state.rp_index !== "") {
      let data_json = this.state.data_json;
      let data_json_item = { ...this.state.data_json[this.state.rp_index] };
      let medicines = data_json_item.medicines;
      medicines[this.state.medi_index].amount = amount;
      data_json_item.medicines = medicines;
      data_json[this.state.rp_index] = data_json_item;
      this.setState({
        data_json,
        rp_index: "",
        medi_index: "",
        // isOpenAmountModal: false,
        isOpenCalcModal: false,
        calcValType: "",
        calcTitle: "",
        calcUnit: "",
        calcInit: 0,
      });
    }
  };
  calcCancel = () => {
    this.setState({
      isOpenCalcModal: false,
      calcValType: "",
      calcTitle: "",
      calcUnit: "",
      calcInit: 0,
    });
  };
  
  selectRp = (rp_index) => {
    this.setState({
      selected_rp: rp_index,
      input_comment: false,
    });
  };
  
  inputUsage = () => {
    this.setState({
      isOpenUsageModal: true,
      medicine_kind: sortations.indexOf(
        this.state.data_json[this.state.selected_rp].prescription_category
      ),
      modal_data: this.state.data_json[this.state.selected_rp],
      rp_index: this.state.selected_rp,
    });
  };
  
  enableInputRpComment = () => {
    let data_json = this.state.data_json;
    let data_json_item = { ...this.state.data_json[this.state.selected_rp] };
    let free_comment = data_json_item.free_comment;
    if (free_comment === undefined) free_comment = [];
    free_comment.push("");
    data_json_item.free_comment = free_comment;
    data_json[this.state.selected_rp] = data_json_item;
    this.setState({
      data_json,
      selected_comment_index: free_comment.length - 1,
      input_comment: true,
    }, () => {
      if (document.getElementById("input_comment") != null) {
        let data_json = this.state.data_json;
        let comment_length =
          data_json[this.state.selected_rp].free_comment !== undefined &&
          data_json[this.state.selected_rp].free_comment != null &&
          data_json[this.state.selected_rp].free_comment.length > 0 &&
          data_json[this.state.selected_rp].free_comment[this.state.selected_comment_index] != ""
            ? data_json[this.state.selected_rp].free_comment[this.state.selected_comment_index].length
            : 0;
        this.setCaretPosition(document.getElementById("input_comment"),comment_length);
      }
    });
  };
  setCaretPosition = (elem, caretPos) => {
    var range;
    if (elem != null) {
      if (elem.createTextRange) {
        range = elem.createTextRange();
        range.move("character", caretPos);
        range.select();
      } else {
        elem.focus();
        if (elem.selectionStart !== undefined) {
          elem.setSelectionRange(caretPos, caretPos);
        }
      }
    }
  };
  
  setRpComment = (index, e) => {
    let data_json = this.state.data_json;
    let value = e.target.value;
    data_json[this.state.selected_rp].free_comment[index] = value;
    this.setState({ data_json});
  };
  
  blueRpComment = () => {
    let data_json = this.state.data_json;
    let data_json_item = { ...this.state.data_json[this.state.selected_rp] };
    let free_comment = data_json_item.free_comment;
    if (free_comment.length > 0) {
      if (free_comment[this.state.selected_comment_index].length > this.free_comment_max) {
        this.setState({alert_messages: this.free_comment_err_msg});
        return;
      }
      free_comment = free_comment.filter(x=> x!= "");
    }
    data_json[this.state.selected_rp].free_comment = free_comment;
    this.setState({selected_comment_index: -1, data_json});
  }
  
  setSetName = (e) => {
    this.setState({ name: e.target.value });
  };
  setSetKanaName = (e) => {
    this.setState({ name_kana: e.target.value });
  };
  
  setSetId = (e) => {
    this.setState({ set_id: e.target.value });
  };
  
  getOrder = (e) => {
    if (parseFloat(e.target.value) < 0) this.setState({ sort_order: 0});
    else this.setState({ sort_order: parseInt(e.target.value) });
  };
  
  onHide = () => {};
  
  closeConfirmModal = () => {
    this.confirmCancel();
    this.props.closeModal();
  };
  closeSetModal = () => {
    if (JSON.stringify(this.state) != this.original) {
      this.setState({
        isBackConfirmModal: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_alert_title:'入力中'
      });
    } else {
      this.props.closeModal();
    }
  };
  
  render() {
    let { data_json } = this.state;
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        className="wordPattern-modal master-modal edit-prescript-modal first-view-modal"
        id="select-usage-modal"
      >
        <Modal.Header>
          <Modal.Title>
            処方セット
            {this.props.modal_data != null &&
            Object.keys(this.props.modal_data).length > 0
              ? "編集"
              : "登録"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper id = 'wrapper-body'>
            <div className="checkbox_area">
              <Checkbox
                label="常に表示"
                getRadio={this.getAlwaysShow.bind(this)}
                value={this.state.is_enabled}
                checked={this.state.is_enabled === 1}
                name="alwaysShow"
              />
            </div>
            <div className={"flex header"}>
              <div className={`set-name`}>
                <InputWithLabelBorder
                  label="セット名"
                  type="text"
                  getInputText={this.setSetName.bind(this)}
                  diseaseEditData={this.state.name}
                  id="name_id"
                />
              </div>
              <div className={`kana-name`}>
                <InputWithLabelBorder
                  label="カナ名"
                  type="text"
                  getInputText={this.setSetKanaName.bind(this)}
                  diseaseEditData={this.state.name_kana}
                  id="name_kana_id"
                />
              </div>
              <div className={`set-id`}>
                <InputWithLabelBorder
                  label="セットID"
                  type="text"
                  getInputText={this.setSetId.bind(this)}
                  diseaseEditData={this.state.set_id}
                  id='set_id_id'
                />
              </div>
              <div className={'sort-order'}>
                <InputWithLabelBorder
                  label="表示順"
                  type='number'
                  diseaseEditData={parseInt(this.state.sort_order)}
                  getInputText={this.getOrder.bind(this)}
                  id="sort_order_id"
                />
              </div>
            </div>
            <div className={"flex w-100 main-area"}>
              <div className={"left-area"}>
                <div className="sortation-btn">
                  {sortations.map((item, key) => {
                    return (
                      <>
                        <RadioButton
                          id={`sortation_${key}`}
                          value={key}
                          label={item}
                          name="sortation"
                          getUsage={this.changeMedicineKind.bind(this, key)}
                          checked={
                            this.state.medicine_kind === key ? true : false
                          }
                        />
                      </>
                    );
                  })}
                </div>
                <div className="sortation-btn take_comment-btn">
                  <RadioButton
                    id="take_btn"
                    label="服用"
                    value={0}
                    name="take_comment"
                    getUsage={this.inputUsage.bind(this)}
                    checked={this.state.take_comment === 0 ? true : false}
                  />
                  <RadioButton
                    id="comment_btn"
                    label="コメント"
                    value={1}
                    name="take_comment"
                    getUsage={this.enableInputRpComment.bind(this)}
                    checked={this.state.take_comment === 1 ? true : false}
                  />
                </div>
              </div>
              
              <div className={"right-area"}>
                <div className="dial-body h-100" id = 'dial-body'>
                  <table
                    className="table-scroll table table-bordered"
                    id="code-table"
                  >
                    <tbody>
                    {data_json != undefined &&
                    data_json !== null &&
                    data_json.map((item, rp_index) => {
                      return (
                        <>
                          <tr
                            className="set-title"
                            key={rp_index + 1}
                            onClick={this.selectRp.bind(this, rp_index)}
                            style={{ cursor: "pointer" }}
                          >
                            <td className="btn-area">
                              <Button
                                onClick={this.addMedicine.bind(
                                  this,
                                  rp_index,
                                  item.prescription_category
                                )}
                              >
                                <Icon icon={faPlus} />
                              </Button>
                            </td>
                            <td className="btn-area">
                              <Button
                                onClick={this.deleteRp.bind(this, rp_index)}
                              >
                                <Icon icon={faMinus} />
                              </Button>
                            </td>
                            <td
                              className="text-center"
                              style={{ width: "5%" }}
                            >
                              {rp_index + 1}
                            </td>
                            <td className="text-left" colSpan={3}>
                              {item.prescription_category}処方
                            </td>
                          </tr>
                          {item.medicines.length > 0 &&
                          item.medicines.map((medi_item, medi_index) => {
                            return (
                              <tr
                                key={medi_index}
                                onContextMenu={(e) =>
                                  this.handleClick(
                                    e,
                                    rp_index,
                                    medi_index
                                  )
                                }
                                onClick={this.selectRp.bind(
                                  this,
                                  rp_index
                                )}
                                className={
                                  this.state.selected_rp === rp_index
                                    ? "selected-rp"
                                    : ""
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <td className="btn-area" />
                                <td className="btn-area">
                                  <Button
                                    onClick={this.deleteMedicine.bind(
                                      this,
                                      rp_index,
                                      medi_index
                                    )}
                                  >
                                    <Icon icon={faMinus} />
                                  </Button>
                                </td>
                                <td />
                                <td
                                  className="text-left"
                                  style={{ width: "45%" }}
                                >
                                  {medi_item.item_name}
                                </td>
                                <td
                                  className="text-center"
                                  style={{ width: "50px" }}
                                >
                                  {medi_item.amount}
                                </td>
                                <td className="text-left">
                                  <div className="ml-1">
                                    {medi_item.unit}{medi_item.is_not_generic == 1 ? "【後発変更不可】": ""}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          <tr
                            onContextMenu={(e) =>
                              this.handleClick(e, rp_index)
                            }
                            onClick={this.selectRp.bind(this, rp_index)}
                            className={
                              this.state.selected_rp === rp_index
                                ? "selected-rp"
                                : ""
                            }
                            style={{ cursor: "pointer" }}
                          >
                            <td className="btn-area" colSpan={2} />
                            <td />
                            <td className="text-left" colSpan={4}>
                              {item.usage_name}
                              {item.days !== undefined &&
                              item.days !== null &&
                              item.disable_days_dosing == 0
                                ? "(" +
                                item.days +
                                (item.prescription_category === "頓服"
                                  ? "回分)"
                                  : "日分)")
                                : ""}
                            </td>
                          </tr>
                          {item.free_comment !== undefined && item.free_comment.length > 0 && item.free_comment.map((comment_item, comment_index)=>{
                            return (
                              <>
                                <tr onContextMenu={(e) =>this.handleClick(e, rp_index, undefined, comment_index)} key={comment_index}>
                                  <td colSpan={6} className="rp-comment">
                                    {this.state.selected_rp === rp_index && this.state.selected_comment_index == comment_index ? (
                                      <InputBoxTag
                                        label=""
                                        id={"input_comment"}
                                        type="text"
                                        getInputText={this.setRpComment.bind(this, comment_index)}
                                        value={comment_item}
                                        onBlur={this.blueRpComment}
                                        autofocus={true}
                                      />
                                    ):(
                                      <>
                                        <div style={{ marginLeft: "110px" }}>
                                          {comment_item}
                                        </div>
                                      </>
                                    )}
                                  </td>
                                </tr>
                              </>
                            )
                          })}
                        </>
                      );
                    })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {this.state.isOpenMedicineModal && (
              <PrescriptMedicineSelectModal
                handleOk={this.handleOk}
                closeModal={this.closeModal}
                medicine_type_name={""}
                modal_data={[]}
                rp_number={this.state.rp_number}
                is_open_usage={this.state.is_open_usage}
                medicine_kind={sortations[this.state.medicine_kind]}
                selected_medicine={this.state.selected_medicine}
              />
            )}
            {this.state.isOpenUsageModal && (
              <SelectUsageModal
                handleOk={this.handleUsageOk}
                closeModal={this.closeUsageModal}
                medicine_kind={this.state.medicine_kind}
                modal_data={this.state.modal_data}
                usage_only={this.state.usage_only}
              />
            )}
            {this.state.isUpdateConfirmModal == true && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.registerPrescriptionSet.bind(this)}
                confirmTitle={this.state.confirm_message}
              />
            )}
            {/* {this.state.isOpenAmountModal && (
              <AmountInputModal
                closeModal={this.closeModal}
                handleModal={this.amountChange}
                medicine={this.state.medi_data}
              />
            )} */}
            {this.state.isMinusConfirmModal !== false && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.confirmDeleteRp.bind(
                  this,
                  this.state.sel_del_rp,
                  this.state.sel_del_med
                )}
                confirmTitle={this.state.confirm_message}
              />
            )}
            {this.state.isBackConfirmModal !== false && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.closeConfirmModal}
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
            {this.state.isOpenCalcModal ? (
              <CalcDial
                calcConfirm={this.amountChange}
                units={this.state.calcUnit}
                calcCancel={this.calcCancel}
                daysSelect={false}
                daysInitial={this.state.calcInit}
                daysLabel=""
                daysSuffix=""
                maxAmount={100000}
                calcTitle={this.state.calcTitle}
                calcInitData={this.state.calcInit}
              />
            ) : (
              ""
            )}            
            {this.state.alert_messages !== "" && (
              <AlertNoFocusModal
                hideModal= {this.closeModal.bind(this)}
                handleOk= {this.closeModal.bind(this)}
                showMedicineContent= {this.state.alert_messages}
              />
            )}
          </Wrapper>
        </Modal.Body>
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
          rp_index={this.state.rp_index}
          medi_index={this.state.medi_index}
          comment_index={this.state.comment_index}
        />
        <HoverPatternMenu
          {...this.state.hoverPatternMenu}          
          parent={this}
          word_pattern_list = {this.state.word_pattern_list}
        />
        <HoverWordMenu
          {...this.state.hoverWordMenu}
          parent={this}
          selected_word_list = {this.state.selected_word_list}
        />
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.closeSetModal}>キャンセル</Button>
          <Button onClick={this.confirmRegister.bind(this)} className="red-btn"> {this.props.modal_data != null && Object.keys(this.props.modal_data).length > 0 ? "変更": "登録"}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
PrescriptionSetModal.contextType = Context;

PrescriptionSetModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  modal_data: PropTypes.object,
};

export default PrescriptionSetModal;