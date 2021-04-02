import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import Checkbox from "~/components/molecules/Checkbox";
// import InputWithLabel from "~/components/molecules/InputWithLabel";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
// import InputWithUnitLabel from "~/components/molecules/InputWithUnitLabel";
import InputWithUnitLabelBorder from "~/components/molecules/InputWithUnitLabelBorder";
import RadioButton from "~/components/molecules/RadioInlineButton";
import {
  dialysis_method_category,
  makeList_code,
  makeList_codeName,
  toHalfWidthOnlyNumber
} from "~/helpers/dialConstants";
import FormWithLabel from "../../../molecules/FormWithLabel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import SelectAntiItemModal from "~/components/templates/Dial/Board/molecules/SelectAntiItemModal";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import * as methods from "~/components/templates/Dial/DialMethods";
import { faMinusCircle } from "@fortawesome/pro-solid-svg-icons";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import { getMasterValidate } from "~/components/templates/Dial/DialMethods";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";

import { masterValidate } from "~/helpers/validate";
import {
  removeRedBorder,
  // addRequiredBg,
  // removeRequiredBg,
} from "~/helpers/dialConstants";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from "jquery";

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 15px;
  margin-right: 5px;
  cursor: pointer;
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 18px;
  width: 100%;
  height: 100%;
  float: left;
  label {
    text-align: right;
    width: 140px;
    font-size: 18px;
  }
  input {
    width: 400px;
    font-size: 18px;
  }
  .disease_classification {
    display: flex;
    font-size: 18px;
    margin-top: 8px;
    .radio-btn label {
      width: 80px;
      border: solid 1px rgb(206, 212, 218);
      border-radius: 4px;
      margin: 0 5px;
      padding: 4px 5px;
    }
    .checkbox-label {
      width: 140px;
      text-align: right;
      margin-top: 8px;
    }
  }
  .checkbox-label {
    width: 30%;
    text-align: left;
  }
  .add-button {
    text-align: center;
  }
  .checkbox_area {
    padding-left: 15px;
    label {
      font-size: 15px;
      margin-left: 120px;
    }
  }
  .pattern_code {
    display: flex;
    flex-wrap: wrap;
    input {
      font-size: 18px;
      width: 137px;
    }
  }
  .kana_area {
    padding-top: 10px;
  }
  .name_area {
    padding-top: 20px;
  }
  .unit-area {
    display: flex;
    margin-left: 40px;
    label {
      width: 100px;
      font-size: 18px;
    }
  }
  .unit-area-last {
    display: flex;
    margin-left: 40px;
    label {
      width: 100px;
      margin-top:8px;
    }
    input {
      width: 80px !important;
    }
  }
  .label-set {
    margin-top: 10px;
  }
  td {
    padding-top: 1px;
    padding-bottom: 1px;
    label {
      width: auto;
    }
    .label-text {
      width: 320px;
    }
  }
  .th-name {
    width: 70px;
  }
  .th-unit {
    width: 20%;
  }
  .index {
    width: 10%;
  }
  .footer {
    display: flex;
    margin-left: 32%;
    margin-top: 10px;
    text-align: center;
    padding: 10px;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 30px;
    }

    span {
      color: white;
      font-size: 20px;
      font-weight: 100;
    }
  }
  .pullbox {
    margin-top: 5px;
  }
  .pullbox-select {
    font-size: 18px;
    width: 140px;
  }
  .pullbox-title {
    text-align: right;
    width: 135px;
    font-size: 18px;
    margin-right: 12px;
  }
  .flex {
    display: flex;
  }
  .ip-area {
    margin-left: 120px;
    input {
      width: 130px;
      margin-right: 10px;
    }
  }
  .next-table-area {
    margin-left: 10px;
    width: 100%;
    height: 130px;
    overflow-y: auto;
    border: 1px solid black;
  }
  .add-method {
    text-align: right;
    padding-top: 0px;
    cursor: pointer;
  }
  th {
    font-size: 14px;
    text-align: center;
    padding: 1px;
  }
  .label-table {
    height: auto;
  }
  .text-center {
    text-align: center;
  }
  .radio-btn label {
    font-size: 16px;
  }
  .maxlength-numeric {
    .label-title {
      width: 140px;
      font-size: 18px;
      letter-spacing: -1px;
    }
    .label-unit {
      font-size: 15px;
      width: auto;
    }
  }
`;

// const title_array = [
//   "ダイアライザ",
//   "治療法",
//   "抗凝固法",
//   "抗凝固法パターン",
//   "コンソール",
// ];

class MaterialModal extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let code_master = sessApi.getObjectValue(
      "dial_common_master",
      "code_master"
    );
    let modal_data = this.props.modal_data;
    this.state = {
      // 共通
      is_enabled: modal_data !== null ? modal_data.is_enabled : 1,
      number: modal_data !== null ? modal_data.number : 0,
      sort_number: modal_data !== null ? modal_data.sort_number : 0,
      code: modal_data !== null ? modal_data.code : "",
      name: modal_data !== null ? modal_data.name : "",
      name_kana: modal_data !== null ? modal_data.name_kana : "",
      name_short: modal_data !== null ? modal_data.name_short : "",
      value: modal_data !== null ? modal_data.value : "",
      // 治療法
      dialysis_method_category:
        modal_data !== null
          ? dialysis_method_category.indexOf(
              modal_data.dialysis_method_category
            )
          : 0,
      mode_number: modal_data !== null ? modal_data.mode_number : "",
      // コンソール
      manufacturer: modal_data !== null ? modal_data.manufacturer : "",
      water_removal_speed_calculation:
        modal_data !== null ? modal_data.water_removal_speed_calculation : "",
      has_builtin_sphygmomanometer:
        modal_data !== null ? modal_data.has_builtin_sphygmomanometer : "",
      protocol: modal_data !== null ? modal_data.protocol : "",
      communication_method:
        modal_data !== null ? modal_data.communication_method : "",
      ip_addr: modal_data !== null ? modal_data.ip_addr : "",
      port: modal_data !== null ? modal_data.port : "",
      com_port: modal_data !== null ? modal_data.com_port : "",
      //ダイアライザ
      jan_code: modal_data !== null ? modal_data.jan_code : "",
      membrane_area: modal_data !== null ? modal_data.membrane_area : "",
      cl: modal_data !== null ? modal_data.cl : "",
      blood_flow_rate: modal_data !== null ? modal_data.blood_flow_rate : "",
      dialysate_flow_rate:
        modal_data !== null ? modal_data.dialysate_flow_rate : "",
      efficiency: modal_data !== null ? modal_data.efficiency : "",
      flow_rate_ratio: modal_data !== null ? modal_data.flow_rate_ratio : "",
      k: modal_data !== null ? modal_data.k : "",
      //抗凝固法
      unit: modal_data !== null ? modal_data.unit : "",
      category: modal_data !== null ? modal_data.category : "",
      maxlength: modal_data != null ? modal_data.maxlength : 0,
      //抗凝固法パータン
      is_anti_item_modal: false,
      anti_items: modal_data !== null ? modal_data.anti_items : [],
      label_color: modal_data !== null ? modal_data.label_color : "",
      label_1_text: modal_data !== null ? modal_data.label_1_text : "",
      label_2_text: modal_data !== null ? modal_data.label_2_text : "",
      label_3_text: modal_data !== null ? modal_data.label_3_text : "",
      label_1_is_colored_font:
        modal_data !== null ? modal_data.label_1_is_colored_font : 0,
      label_2_is_colored_font:
        modal_data !== null ? modal_data.label_2_is_colored_font : 0,
      label_3_is_colored_font:
        modal_data !== null ? modal_data.label_3_is_colored_font : 0,

      table_kind: this.props.modalType,
      common_category: this.props.category,
      isUpdateConfirmModal: false,
      isCloseConfirmModal: false,
      confirm_message: "",
      confirm_alert_title: "",

      colorCodeData: code_master["ラベルシールの文字色"],
      color_codes: makeList_code(code_master["ラベルシールの文字色"]),
      color_codes_options:makeList_codeName(code_master["ラベルシールの文字色"], 1),

      alert_message: "",
    };
    this.double_click = false;
    this.change_flag = false;
  }

  componentDidMount() {
    this.changeBackground();
    
  }

  componentDidUpdate() {
    this.changeBackground();
  }

  changeBackground = () => {
    switch (this.state.table_kind) {
      case -1:
        masterValidate(
          "dial_material_master__common",
          this.state, 
          'background'
        );
        break;
      case 0:
        masterValidate(
          "dial_material_master__dialyzer",
          this.state, 
          'background'
        );
        break;
      case 1:
        masterValidate(
          "dial_material_master__dialysis_method",
          this.state, 
          'background'
        );
        break;
      case 2:
        masterValidate(
          "dial_material_master__anticoagulation",
          this.state, 
          'background'
        );
        break;
      case 3:
        masterValidate(
          "dial_material_master__anticoagulation_pattern",
          this.state, 
          'background'
        );
        break;
      case 4:
        masterValidate(
          "dial_material_master__console",
          this.state, 
          'background'
        );
        break;
    }    
  };

  checkValidation = () => {
    removeRedBorder("code_id");
    removeRedBorder("name_id");
    removeRedBorder("name_kana_id");
    removeRedBorder("name_short_id");
    removeRedBorder("mode_number_id");
    removeRedBorder("jan_code_id");
    removeRedBorder("membrane_area_id");
    removeRedBorder("cl_id");
    removeRedBorder("blood_flow_rate_id");
    removeRedBorder("dialysate_flow_rate_id");
    removeRedBorder("efficiency_id");
    removeRedBorder("flow_rate_ratio_id");
    removeRedBorder("k_id");
    removeRedBorder("mode_number_id");
    removeRedBorder("unit_id");
    let error_str_arr = [];
    let validate_data = {};
    switch (this.state.table_kind) {
      case -1:
        validate_data = masterValidate(
          "dial_material_master__common",
          this.state
        );
        break;
      case 0:
        validate_data = masterValidate(
          "dial_material_master__dialyzer",
          this.state
        );
        break;
      case 1:
        validate_data = masterValidate(
          "dial_material_master__dialysis_method",
          this.state
        );
        break;
      case 2:
        validate_data = masterValidate(
          "dial_material_master__anticoagulation",
          this.state
        );
        break;
      case 3:
        validate_data = masterValidate(
          "dial_material_master__anticoagulation_pattern",
          this.state
        );
        break;
      case 4:
        validate_data = masterValidate(
          "dial_material_master__console",
          this.state
        );
        break;
    }

    if (validate_data.error_str_arr.length > 0) {
      error_str_arr = validate_data.error_str_arr;
    }
    if (validate_data.first_tag_id != "") {
      this.setState({ first_tag_id: validate_data.first_tag_id });
    }
    return error_str_arr;
  };

  closeAlertModal = () => {
    this.setState({ alert_message: "" });
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null) {
      $("#" + first_tag_id).focus();
    }
  };

  getRadio = (name, value) => {
    switch (name) {
      case "alwaysShow":
        this.setState({ is_enabled: value });
        break;
      case "label_1":
        this.setState({ label_1_is_colored_font: value });
        break;
      case "label_2":
        this.setState({ label_2_is_colored_font: value });
        break;
      case "label_3":
        this.setState({ label_3_is_colored_font: value });
        break;
    }
    this.change_flag = true;
  };
  getPatternCode = (e) => {
    this.setState({ code: e.target.value });
    this.change_flag = true;
  };
  getDisplayOrder = (e) => {
    let input_value = e.target.value.replace(/[^0-9０-９]/g, '');
    if (input_value != "") {
      input_value = parseInt(toHalfWidthOnlyNumber(input_value));
    }
    this.setState({ sort_number: input_value});
    this.change_flag = true;
  };
  getPatternName = (e) => {
    this.setState({ name: e.target.value });
    this.change_flag = true;
  };
  getPatternKana = (e) => {
    this.setState({ name_kana: e.target.value });
    this.change_flag = true;
  };
  getPatternShort = (e) => {
    this.setState({ name_short: e.target.value });
    this.change_flag = true;
  };
  //資材マスタ_治療法
  selectDialCategory = (e) => {
    this.setState({ dialysis_method_category: parseInt(e.target.value) });
    this.change_flag = true;
  };
  //資材マスタ_コンソール
  selectMeka = (e) => {
    this.setState({ manufacturer: e.target.value });
    this.change_flag = true;
  };
  selectSpeedAmount = (e) => {
    this.setState({ water_removal_speed_calculation: e.target.value });
    this.change_flag = true;
  };
  selectBlood = (e) => {
    this.setState({ has_builtin_sphygmomanometer: parseInt(e.target.value) });
    this.change_flag = true;
  };
  selectProtocol = (e) => {
    this.setState({ protocol: e.target.value });
    this.change_flag = true;
  };
  selectCommunication = (e) => {
    this.setState({ communication_method: e.target.value });
    this.change_flag = true;
  };
  selectIPAddress = (e) => {
    this.setState({ ip_addr: e.target.value });
    this.change_flag = true;
  };
  selectPort = (e) => {
    this.setState({ port: parseInt(e.target.value) >= 0?parseInt(e.target.value):'' });
    this.change_flag = true;
  };
  selectComPort = (e) => {
    this.setState({ com_port: e.target.value });
    this.change_flag = true;
  };
  //ダイアライザ
  selectDialyzer = (name, e) => {
    if (name === "jan_code") this.setState({ jan_code: e.target.value });
    else if (name === "membrane_area")
      this.setState({ membrane_area: e.target.value });
    else if (name === "cl") this.setState({ cl: e.target.value });
    else if (name === "blood_flow_rate")
      this.setState({ blood_flow_rate: e.target.value });
    else if (name === "dialysate_flow_rate")
      this.setState({ dialysate_flow_rate: e.target.value });
    else if (name === "efficiency")
      this.setState({ efficiency: e.target.value });
    else if (name === "flow_rate_ratio")
      this.setState({ flow_rate_ratio: e.target.value });
    else if (name === "k") this.setState({ k: e.target.value });

    this.change_flag = true;
  };
  //抗凝固法
  selectModeNumber = (e) => {
    this.setState({ mode_number: e.target.value });
    this.change_flag = true;
  };
  selectUnit = (e) => {
    this.setState({ unit: e.target.value });
    this.change_flag = true;
  };
  selectCategory = (e) => {
    this.setState({ category: e.target.value });
    this.change_flag = true;
  };
  async registerDialMethod() {
    this.confirmCancel();
    if (this.state.code == null || this.state.code === "") {
      window.sessionStorage.setItem(
        "alert_messages",
        "コードを入力してください。"
      );
      return;
    }
    if (this.state.name == null || this.state.name === "") {
      window.sessionStorage.setItem(
        "alert_messages",
        "表示名称を入力してください。"
      );
      return;
    }
    let master_validate = getMasterValidate();
    if (master_validate != null) {
      let validate_data = master_validate.dial_material_master__common;
      if (this.props.modalType === 0)
        validate_data = master_validate.dial_material_master__dialyzer;
      if (this.props.modalType === 1)
        validate_data = master_validate.dial_material_master__dialysis_method; // 治療法
      if (this.props.modalType === 2)
        validate_data = master_validate.dial_material_master__anticoagulation; // 抗凝固法
      if (this.props.modalType === 3)
        validate_data =
          master_validate.dial_material_master__anticoagulation_pattern; // 抗凝固法パターン
      if (this.props.modalType === 4)
        validate_data = master_validate.dial_material_master__console; // コンソール

      if (
        this.state.code != null &&
        this.state.code != "" &&
        this.state.code.length > validate_data.code.length
      ) {
        window.sessionStorage.setItem(
          "alert_messages",
          "コードを" +
            validate_data.code.length +
            "文字以下で入力してください。"
        );
        return;
      }
      if (
        this.state.name != null &&
        this.state.name != "" &&
        this.state.name.length > validate_data.name.length
      ) {
        window.sessionStorage.setItem(
          "alert_messages",
          "表示名称を" +
            validate_data.name.length +
            "文字以下で入力してください。"
        );
        return;
      }
      if (
        this.state.name_kana != null &&
        this.state.name_kana != "" &&
        this.state.name_kana.length > validate_data.name_kana.length
      ) {
        window.sessionStorage.setItem(
          "alert_messages",
          "カナ名称を" +
            validate_data.name_kana.length +
            "文字以下で入力してください。"
        );
        return;
      }
      if (
        this.state.name_short != null &&
        this.state.name_short != "" &&
        this.state.name_short.length > validate_data.name_short.length
      ) {
        window.sessionStorage.setItem(
          "alert_messages",
          "略称を" +
            validate_data.name_short.length +
            "文字以下で入力してください。"
        );
        return;
      }
      if (this.props.modalType === 0) {
        if (
          this.state.jan_code != null &&
          this.state.jan_code != "" &&
          this.state.jan_code.length > validate_data.jan_code.length
        ) {
          window.sessionStorage.setItem(
            "alert_messages",
            "JANコードを" +
              validate_data.jan_code.length +
              "文字以下で入力してください。"
          );
          return;
        }
        if (
          this.state.membrane_area != null &&
          this.state.membrane_area != "" &&
          this.state.membrane_area.length > validate_data.membrane_area.length
        ) {
          window.sessionStorage.setItem(
            "alert_messages",
            "膜面積を" +
              validate_data.membrane_area.length +
              "文字以下で入力してください。"
          );
          return;
        }
        if (
          this.state.cl != null &&
          this.state.cl != "" &&
          this.state.cl.length > validate_data.cl.length
        ) {
          window.sessionStorage.setItem(
            "alert_messages",
            "CLを" + validate_data.cl.length + "文字以下で入力してください。"
          );
          return;
        }
        if (
          this.state.blood_flow_rate != null &&
          this.state.blood_flow_rate != "" &&
          this.state.blood_flow_rate.length >
            validate_data.blood_flow_rate.length
        ) {
          window.sessionStorage.setItem(
            "alert_messages",
            "血液流量を" +
              validate_data.blood_flow_rate.length +
              "文字以下で入力してください。"
          );
          return;
        }
        if (
          this.state.dialysate_flow_rate != null &&
          this.state.dialysate_flow_rate != "" &&
          this.state.dialysate_flow_rate.length >
            validate_data.dialysate_flow_rate.length
        ) {
          window.sessionStorage.setItem(
            "alert_messages",
            "透析液流量を" +
              validate_data.dialysate_flow_rate.length +
              "文字以下で入力してください。"
          );
          return;
        }
        if (
          this.state.efficiency != null &&
          this.state.efficiency != "" &&
          this.state.efficiency.length > validate_data.efficiency.length
        ) {
          window.sessionStorage.setItem(
            "alert_messages",
            "効率を" +
              validate_data.efficiency.length +
              "文字以下で入力してください。"
          );
          return;
        }
        if (
          this.state.flow_rate_ratio != null &&
          this.state.flow_rate_ratio != "" &&
          this.state.flow_rate_ratio.length >
            validate_data.flow_rate_ratio.length
        ) {
          window.sessionStorage.setItem(
            "alert_messages",
            "流量比を" +
              validate_data.flow_rate_ratio.length +
              "文字以下で入力してください。"
          );
          return;
        }
        if (
          this.state.k != null &&
          this.state.k != "" &&
          this.state.k.length > validate_data.k.length
        ) {
          window.sessionStorage.setItem(
            "alert_messages",
            "Kを" + validate_data.k.length + "文字以下で入力してください。"
          );
          return;
        }
      }
      if (this.props.modalType == 1) {
        if (
          this.state.mode_number != null &&
          this.state.mode_number != "" &&
          this.state.mode_number.length > validate_data.mode_number.length
        ) {
          window.sessionStorage.setItem(
            "alert_messages",
            "プロトコル番号を" +
              validate_data.mode_number.length +
              "文字以下で入力してください。"
          );
          return;
        }
      }
      if (this.props.modalType == 2) {
        if (
          this.state.unit != null &&
          this.state.unit != "" &&
          this.state.unit.length > validate_data.unit.length
        ) {
          window.sessionStorage.setItem(
            "alert_messages",
            "単位を" +
              validate_data.unit.length +
              "文字以下で入力してください。"
          );
          return;
        }
        if (this.state.maxlength != null && this.state.maxlength > 10) {
          window.sessionStorage.setItem(
            "alert_messages",
            "最大文字数は10以下に設定してください。"
          );
          return;
        }
        if (this.state.maxlength != null && this.state.maxlength < 0) {
          window.sessionStorage.setItem(
            "alert_messages",
            "最大文字数は0以上に設定してください。"
          );
          return;
        }
      }
    }

    let path = "/app/api/v2/dial/master/dial_method_register";
    const post_data = {
      params: this.state,
    };
    post_data.params.dialysis_method_category =
      dialysis_method_category[this.state.dialysis_method_category];
    if (this.double_click == true) return;
    this.double_click = true;
    await apiClient
      .post(path, post_data)
      .then((res) => {
        if (res) {
          var title = "";
          var message = res.alert_message;
          if (message.indexOf("変更") > -1) title = "変更完了##";
          if (message.indexOf("登録") > -1) title = "登録完了##";
          window.sessionStorage.setItem(
            "alert_messages",
            title + res.alert_message
          );
          this.props.handleOk(this.state);
        }
      })
      .finally(() => {
        this.double_click = false;
      });
  }
  handleOk = () => {
    if (this.change_flag == false) return;
    var error = this.checkValidation();
    if (error.length > 0) {
      this.setState({ alert_message: error.join("\n") });
      return;
    }

    if (this.props.modal_data !== null) {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "変更しますか?",
      });
    } else {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "登録しますか?",
      });
    }
  };

  register = () => {
    this.change_flag = false;
    this.registerDialMethod();
  };

  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isCloseConfirmModal: false,
      confirm_message: "",
      confirm_alert_title: "",
    });
  }

  openAntiItemModal = () => {
    this.setState({ is_anti_item_modal: true });
  };
  closeAntiItemModal = () => {
    this.setState({ is_anti_item_modal: false });
  };
  addItem = (item) => {
    let temp = this.state.anti_items;
    var flag = false;
    if (temp.length > 0) {
      temp.map((anti) => {
        flag = flag | (anti.number == item.number);
      });
    } else {
      flag = false;
    }

    if (flag == false) {
      temp.push(item);
      this.setState({
        is_anti_item_modal: false,
        anti_items: temp,
      });
      this.change_flag = true;
    } else {
      window.sessionStorage.setItem(
        "alert_messages",
        "すでに追加した抗凝固法です。"
      );
    }
  };

  deleteItem = (item) => {
    var temp = this.state.anti_items;
    var index = temp.indexOf(item);
    temp.splice(index, 1);
    this.setState({ anti_items: temp });
    this.change_flag = true;
  };
  getColorSelect = (e) => {
    this.setState({ label_color: e.target.id });
    this.change_flag = true;
  };

  getLabel1 = (e) => {
    this.setState({ label_1_text: e.target.value });
    this.change_flag = true;
  };

  getLabel2 = (e) => {
    this.setState({ label_2_text: e.target.value });
    this.change_flag = true;
  };

  getLabel3 = (e) => {
    this.setState({ label_3_text: e.target.value });
    this.change_flag = true;
  };
  getMaxNumber = (value) => {
    if (parseFloat(value) < 0) value = 0;
    if (value > 10) return;
    this.setState({ maxlength: value });
    this.change_flag = true;
  };

  close = () => {
    if (this.change_flag) {
      this.setState({
        isCloseConfirmModal: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_alert_title: "入力中",
      });
    } else {
      this.closeThisModal();
    }
  };

  closeThisModal = () => {
    this.confirmCancel();
    this.props.closeModal();
    this.change_flag = false;
  };

  getInputText = (name, e) => {
    var value = e.target.value;
    if (name == 'value'){
      var RegExp = /^[0-9０-９]+\.?[0-9０-９]*$/;
      if (value != "" && !RegExp.test(e.target.value)) {
        return;
      }
    }
    this.setState({[name]:value});
    this.change_flag = true;
  }

  onHide = () => {};

  render() {
    return (
      <>
        <Modal
          show={true}
          onHide={this.onHide}
          id="add_contact_dlg"
          className="master-modal first-view-modal material-modal"
        >
          <Modal.Header>
            <Modal.Title>
              {/* コード編集 {title_array[this.props.modalType]} */}
              コード編集 {this.props.selected_category}              
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className="checkbox_area">
                <Checkbox
                  label="常に表示"
                  getRadio={this.getRadio.bind(this)}
                  value={this.state.is_enabled}
                  checked={this.state.is_enabled === 1}
                  name="alwaysShow"
                />
              </div>
              <div className="pattern_code">
                <InputWithLabelBorder
                  label="コード"
                  type="text"
                  getInputText={this.getPatternCode.bind(this)}
                  diseaseEditData={this.state.code}
                  id="code_id"
                />
                <InputWithLabelBorder
                  label="表示順"
                  type="text"
                  getInputText={this.getDisplayOrder.bind(this)}
                  diseaseEditData={this.state.sort_number}
                />
              </div>
              <InputWithLabelBorder
                label="表示名称"
                type="text"
                className="name-area"
                getInputText={this.getPatternName.bind(this)}
                diseaseEditData={this.state.name}
                id="name_id"
              />
              <InputWithLabelBorder
                label="カナ名称"
                type="text"
                className="kana_area"
                getInputText={this.getPatternKana.bind(this)}
                diseaseEditData={this.state.name_kana}
                id="name_kana_id"
              />
              <InputWithLabelBorder
                label="略称"
                type="text"
                getInputText={this.getPatternShort.bind(this)}
                diseaseEditData={this.state.name_short}
                id="name_short_id"
              />
              {this.props.selected_category == '車椅子' && (
                <InputWithLabelBorder
                  label="重量"
                  type="text"
                  getInputText={this.getInputText.bind(this, 'value')}
                  diseaseEditData={this.state.value}
                  id="name_short_id"
                />
              )}
              {this.props.modalType === 0 && ( //ダイアライザ
                <>
                  <InputWithLabelBorder
                    label="JANコード"
                    type="text"
                    getInputText={this.selectDialyzer.bind(this, "jan_code")}
                    diseaseEditData={this.state.jan_code}
                    id="jan_code_id"
                  />
                  <div className="unit-area">
                    <InputWithUnitLabelBorder
                      label="膜面積"
                      unit="㎡"
                      type="text"
                      className={`membrane_area`}
                      getInputText={this.selectDialyzer.bind(
                        this,
                        "membrane_area"
                      )}
                      diseaseEditData={this.state.membrane_area}
                      id="membrane_area_id"
                    />
                    <InputWithUnitLabelBorder
                      label="CL(in Vitro)"
                      unit="mL/min"
                      type="text"
                      getInputText={this.selectDialyzer.bind(this, "cl")}
                      diseaseEditData={this.state.cl}
                      id="cl_id"
                    />
                  </div>
                  <div className="unit-area">
                    <InputWithUnitLabelBorder
                      label="血液流量"
                      unit="mL/min"
                      type="text"
                      getInputText={this.selectDialyzer.bind(
                        this,
                        "blood_flow_rate"
                      )}
                      diseaseEditData={this.state.blood_flow_rate}
                      id="blood_flow_rate_id"
                    />
                    <InputWithUnitLabelBorder
                      label="透析液流量"
                      unit="mL/min"
                      type="text"
                      getInputText={this.selectDialyzer.bind(
                        this,
                        "dialysate_flow_rate"
                      )}
                      diseaseEditData={this.state.dialysate_flow_rate}
                      id="dialysate_flow_rate_id"
                    />
                  </div>
                  <div className="unit-area-last">
                    <InputWithLabelBorder
                      label="効率"
                      type="text"
                      getInputText={this.selectDialyzer.bind(
                        this,
                        "efficiency"
                      )}
                      diseaseEditData={this.state.efficiency}
                      id="efficiency_id"
                    />
                    <InputWithLabelBorder
                      label="流量比"
                      type="text"
                      getInputText={this.selectDialyzer.bind(
                        this,
                        "flow_rate_ratio"
                      )}
                      diseaseEditData={this.state.flow_rate_ratio}
                      id="flow_rate_ratio_id"
                    />
                    <InputWithLabelBorder
                      label="K"
                      type="text"
                      getInputText={this.selectDialyzer.bind(this, "k")}
                      diseaseEditData={this.state.k}
                      id="k_id"
                    />
                  </div>
                </>
              )}
              {this.props.modalType === 1 && ( // 治療法
                <>
                  <InputWithLabelBorder
                    label="プロトコル番号"
                    type="text"
                    getInputText={this.selectModeNumber.bind(this)}
                    diseaseEditData={this.state.mode_number}
                    id="mode_number_id"
                  />
                  <div className="disease_classification">
                    <label className="checkbox-label">治療法区分</label>
                    <RadioButton
                      id="dial_method"
                      value={0}
                      label="HD"
                      name="disease_kind_modal"
                      getUsage={this.selectDialCategory}
                      checked={this.state.dialysis_method_category === 0}
                    />
                    <RadioButton
                      id="dial_method_1"
                      value={1}
                      label="ECUM"
                      name="disease_kind_modal"
                      getUsage={this.selectDialCategory}
                      checked={this.state.dialysis_method_category === 1}
                    />
                    <RadioButton
                      id="dial_method_2"
                      value={2}
                      label="HDF"
                      name="disease_kind_modal"
                      getUsage={this.selectDialCategory}
                      checked={this.state.dialysis_method_category === 2}
                    />
                    <RadioButton
                      id="dial_method_3"
                      value={3}
                      label="HF"
                      name="disease_kind_modal"
                      getUsage={this.selectDialCategory}
                      checked={this.state.dialysis_method_category === 3}
                    />
                    <RadioButton
                      id="dial_method_4"
                      value={4}
                      label="その他"
                      name="disease_kind_modal"
                      getUsage={this.selectDialCategory}
                      checked={this.state.dialysis_method_category === 4}
                    />
                  </div>
                </>
              )}
              {this.props.modalType === 2 && ( //抗凝固法
                <>
                  <InputWithLabelBorder
                    label="単位"
                    type="text"
                    getInputText={this.selectUnit}
                    diseaseEditData={this.state.unit}
                    id="unit_id"
                  />
                  <div className="disease_classification">
                    <label className="checkbox-label">区分</label>
                    <RadioButton
                      id="category"
                      value="初回量"
                      label="初回量"
                      name="category"
                      getUsage={this.selectCategory}
                      checked={this.state.category === "初回量"}
                    />
                    <RadioButton
                      id="category_1"
                      value="持続量"
                      label="持続量"
                      name="category"
                      getUsage={this.selectCategory}
                      checked={this.state.category === "持続量"}
                    />
                    <RadioButton
                      id="category_2"
                      value="総量"
                      label="総量"
                      name="category"
                      getUsage={this.selectCategory}
                      checked={this.state.category === "総量"}
                    />
                    <RadioButton
                      id="category_3"
                      value="事前停止"
                      label="事前停止"
                      name="category"
                      getUsage={this.selectCategory}
                      checked={this.state.category === "事前停止"}
                    />
                  </div>
                  <div className="maxlength-numeric">
                    <NumericInputWithUnitLabel
                      label="数量の最大文字数"
                      value={this.state.maxlength}
                      getInputText={this.getMaxNumber.bind(this)}
                      min={0}
                      step={1}
                      max={10}
                      unit="※ 0の場合は数量の文字数をチェックしません"
                      inputmode="numeric"
                    />
                  </div>
                </>
              )}
              {this.props.modalType === 3 && ( // 抗凝固法パターン
                <>
                  <SelectorWithLabel
                    options={this.state.color_codes_options}
                    title="ラベルの色"
                    getSelect={this.getColorSelect}
                    departmentEditCode={this.state.label_color}
                  />
                  <div
                    className="add-method"
                    onClick={this.openAntiItemModal.bind(this)}
                  >
                    <Icon icon={faPlus} />
                    抗凝固法を追加
                  </div>
                  <div className="flex">
                    <div>
                      <label>抗凝固法</label>
                    </div>
                    <div className="next-table-area">
                      <table
                        className="table-scroll table table-bordered"
                        id="next-table"
                      >
                        <thead>
                          <th className="index" />
                          <th className="th-name">名称</th>
                          <th className="th-unit">単位</th>
                        </thead>
                        <tbody>
                          {this.state.anti_items !== undefined &&
                            this.state.anti_items !== null &&
                            this.state.anti_items.length > 0 &&
                            this.state.anti_items.map((item, index) => {
                              return (
                                <>
                                  <tr key={index}>
                                    <td
                                      className="text-center"
                                      onClick={this.deleteItem.bind(this, item)}
                                    >
                                      <Icon icon={faMinusCircle} />
                                    </td>
                                    <td>{item.name}</td>
                                    <td className="text-center">{item.unit}</td>
                                  </tr>
                                </>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="label-set flex">
                    <div>
                      <label>ラベル</label>
                    </div>
                    <div className="next-table-area label-table">
                      <table
                        className="table-scroll table table-bordered"
                        id="label-table"
                      >
                        <thead>
                          <th className="index" />
                          <th className="th-name">ラベル</th>
                          <th className="th-unit">色付け</th>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="text-center">1</td>
                            <td>
                              <input
                                className="label-text"
                                value={this.state.label_1_text}
                                onChange={this.getLabel1.bind(this)}
                              />
                            </td>
                            <td className="text-center">
                              <Checkbox
                                label=""
                                getRadio={this.getRadio.bind(this)}
                                value={this.state.label_1_is_colored_font}
                                name="label_1"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="text-center">2</td>
                            <td>
                              <input
                                className="label-text"
                                value={this.state.label_2_text}
                                onChange={this.getLabel2.bind(this)}
                              />
                            </td>
                            <td className="text-center">
                              <Checkbox
                                label=""
                                getRadio={this.getRadio.bind(this)}
                                value={this.state.label_2_is_colored_font}
                                name="label_2"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
              {this.props.modalType === 4 && ( //コンソール
                <>
                  <div className="disease_classification">
                    <label className="checkbox-label">メーカー</label>
                    <RadioButton
                      id="meka_1"
                      value="日機装"
                      label="日機装"
                      name="meka"
                      getUsage={this.selectMeka}
                      checked={this.state.manufacturer === "日機装"}
                    />
                    <RadioButton
                      id="dial_method_1"
                      value="東レ"
                      label="東レ"
                      name="meka"
                      getUsage={this.selectMeka}
                      checked={this.state.manufacturer === "東レ"}
                    />
                    <RadioButton
                      id="meka_2"
                      value="JMS"
                      label="JMS"
                      name="maka"
                      getUsage={this.selectMeka}
                      checked={this.state.manufacturer === "JMS"}
                    />
                    <RadioButton
                      id="meka_3"
                      value="コプロ"
                      label="コプロ"
                      name="meka"
                      getUsage={this.selectMeka}
                      checked={this.state.manufacturer === "コプロ"}
                    />
                    <RadioButton
                      id="meka_4"
                      value="その他"
                      label="その他"
                      name="meka"
                      getUsage={this.selectMeka}
                      checked={this.state.manufacturer === "その他"}
                    />
                  </div>
                  <div className="disease_classification">
                    <label className="checkbox-label">除水速度計算</label>
                    <RadioButton
                      id="spped_amount_0"
                      value="切り上け"
                      label="切り上け"
                      name="spped_amount"
                      getUsage={this.selectSpeedAmount}
                      checked={
                        this.state.water_removal_speed_calculation ===
                        "切り上け"
                      }
                    />
                    <RadioButton
                      id="spped_amount_1"
                      value="切り捨て"
                      label="切り捨て"
                      name="spped_amount"
                      getUsage={this.selectSpeedAmount}
                      checked={
                        this.state.water_removal_speed_calculation ===
                        "切り捨て"
                      }
                    />
                    <RadioButton
                      id="spped_amount_2"
                      value="四捨五入"
                      label="四捨五入"
                      name="spped_amount"
                      getUsage={this.selectSpeedAmount}
                      checked={
                        this.state.water_removal_speed_calculation ===
                        "四捨五入"
                      }
                    />
                  </div>
                  <div className="disease_classification">
                    <label className="checkbox-label">血圧計内蔵</label>
                    <RadioButton
                      id="blood"
                      value={1}
                      label="あり"
                      name="blood"
                      getUsage={this.selectBlood}
                      checked={this.state.has_builtin_sphygmomanometer === 1}
                    />
                    <RadioButton
                      id="blood_1"
                      value={0}
                      label="なし"
                      name="blood"
                      getUsage={this.selectBlood}
                      checked={this.state.has_builtin_sphygmomanometer === 0}
                    />
                  </div>
                  <div className="disease_classification">
                    <label className="checkbox-label">通信プロトコル</label>
                    <RadioButton
                      id="protocol"
                      value="Ver2.0"
                      label="Ver2.0"
                      name="protocol"
                      getUsage={this.selectProtocol}
                      checked={this.state.protocol === "Ver2.0"}
                    />
                    <RadioButton
                      id="protocol_1"
                      value="Ver3.0"
                      label="Ver3.0"
                      name="protocol"
                      getUsage={this.selectProtocol}
                      checked={this.state.protocol === "Ver3.0"}
                    />
                    <RadioButton
                      id="protocol_2"
                      value="Ver4.0"
                      label="Ver4.0"
                      name="protocol"
                      getUsage={this.selectProtocol}
                      checked={this.state.protocol === "Ver4.0"}
                    />
                  </div>
                  <div className="disease_classification">
                    <label className="checkbox-label">通信方法</label>
                    <RadioButton
                      id="communication"
                      value="LAN"
                      label="LAN"
                      name="communication"
                      getUsage={this.selectCommunication}
                      checked={this.state.communication_method === "LAN"}
                    />
                    <RadioButton
                      id="communication_1"
                      value="MOXA"
                      label="MOXA"
                      name="communication"
                      getUsage={this.selectCommunication}
                      checked={this.state.communication_method === "MOXA"}
                    />
                  </div>
                  <div className={`flex ip-area`}>
                    <FormWithLabel
                      type="text"
                      label="IPアドレス"
                      onChange={this.selectIPAddress}
                      value={this.state.ip_addr}
                    />
                    <FormWithLabel
                      type="text"
                      label="ポート"
                      onChange={this.selectPort}
                      value={this.state.port}
                    />
                    <FormWithLabel
                      type="text"
                      label="COMポート"
                      onChange={this.selectComPort}
                      value={this.state.com_port}
                    />
                  </div>
                </>
              )}

              <div className="footer-buttons" style={{marginTop:'10px'}}>
                <Button className="cancel-btn" onClick={this.close}>キャンセル</Button>
                  <Button
                    className={this.change_flag ? "red-btn" : "disable-btn"}
                    onClick={this.handleOk}
                  >
                    {this.props.modal_data !== null ? "変更" : "登録"}
                  </Button>
              </div>
            </Wrapper>
            {this.state.isUpdateConfirmModal !== false && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.register.bind(this)}
                confirmTitle={this.state.confirm_message}
              />
            )}
            {this.state.isCloseConfirmModal !== false && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.closeThisModal.bind(this)}
                confirmTitle={this.state.confirm_message}
                title={this.state.confirm_alert_title}
              />
            )}
            {this.state.alert_message != "" && (
              <ValidateAlertModal
                handleOk={this.closeAlertModal}
                alert_meassage={this.state.alert_message}
              />
            )}
          </Modal.Body>
        </Modal>
        {this.state.is_anti_item_modal && (
          <SelectAntiItemModal
            closeModal={this.closeAntiItemModal}
            getAntiItem={this.addItem}
          />
        )}
      </>
    );
  }
}

MaterialModal.contextType = Context;

MaterialModal.propTypes = {
  modal_data: PropTypes.object,
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  modalType: PropTypes.number,
  category: PropTypes.string,
  selected_category:PropTypes.string,
};

export default MaterialModal;
