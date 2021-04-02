import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import Checkbox from "~/components/molecules/Checkbox";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import RadioButton from "~/components/molecules/RadioInlineButton";
import * as methods from "~/components/templates/Dial/DialMethods";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import axios from "axios/index";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";

import { masterValidate } from "~/helpers/validate";
import {
  removeRedBorder,
} from "~/helpers/dialConstants";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from "jquery";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 16px;
  width: 100%;
  height: 100%;
  float: left;
  label {
    text-align: right;
    width: 120px;
    font-size: 16px;
  }  
  input {
    width: 400px;
    font-size: 16px;
  }
  #ip_addr_id{
    ime-mode:inactive;
  }
  .disease_classification {
    display: flex;
    font-size: 16px;
    margin-top: 8px;
    .radio-btn label {
      width: 100px;
      border: solid 1px rgb(206, 212, 218);
      border-radius: 4px;
      margin: 0 5px;
      padding: 4px 5px;
    }
    .checkbox-label {
      width: 120px;
      text-align: right;
      margin-top: 8px;
      margin-right: 3px;
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
    label {
      font-size: 15px;
      margin-left: 88px;
    }
  }
  .pattern_code {
    display: flex;
    flex-wrap: wrap;
    input {
      font-size: 16px;
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
      font-size: 16px;
    }
  }
  .unit-area-last {
    display: flex;
    margin-left: 40px;
    label {
      width: 80px;
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
  .pullbox {
    margin-top: 8px;
  }
  .pullbox-select {
    font-size: 14px;
    width: 120px;
  }
  .pullbox-title {
    text-align: right;
    width: 130px;
    font-size: 16px;
    margin-right: -2px;
    padding-right: 8px;
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
`;

const title_array = ["端末設定"];

let bed_nos = [{ id: 0, value: "設定なし" }];
let group_list = [{ id: 0, value: "" }];
class CreateTerminalModal extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let modal_data = this.props.modal_data;
    this.state = {
      ip_addr: modal_data !== null ? modal_data.ip_addr : "",
      is_enabled: modal_data !== null ? modal_data.is_enabled : 1,
      number: modal_data !== null ? modal_data.number : 0,
      bed_number: modal_data !== null ? modal_data.bed_number : 0,
      group_1: modal_data !== null ? modal_data.group_1 : "",
      start_page: modal_data !== null ? modal_data.start_page : "",

      table_kind: this.props.modalType,
      common_category: this.props.category,
      isOpenConfirmModal: false,
      isUpdateConfirmModal: false,
      confirm_message: "",
      alert_message: "",
    };
    this.original = JSON.stringify(this.state);
  }

  componentDidUpdate() {
    this.changeBackground();
  }

  changeBackground = () => {
    masterValidate("dial_terminal_master", this.state, 'background');    
  };

  checkValidation = () => {
    removeRedBorder("ip_addr_id");
    let error_str_arr = [];
    let validate_data = masterValidate("dial_terminal_master", this.state);

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
  // 検索
  getConstInfo = async () => {
    let path = "/app/api/v2/dial/pattern/getDialConditionInfo";
    let post_data = {
      keyword: "",
      is_enabled: 1,
    };
    let { data } = await axios.post(path, { params: post_data });

    data[0].map((item, index) => {
      if (item.id < 100) {
        let bed_info = { id: item.id, value: item.value };
        bed_nos[index + 1] = bed_info;
      }
    });
  };
  getGroup1 = async () => {
    let path = "/app/api/v2/dial/master/bed/getGroup1List";
    let post_data = {};
    const { data } = await axios.post(path, { params: post_data });
    return data;
  };
  async componentDidMount() {
		this.changeBackground();
    await this.getConstInfo();
    await this.getGroup1().then((result) => {
      let tmp = [];
      if (result != null && result != undefined && result.length > 0) {
        result.map((item, index) => {
          tmp.push({ id: index + 1, value: item.value });
        });
      }
      group_list.concat(tmp);
      this.group_list = group_list.concat(tmp);
      this.setState({
        isOpenConfirmModal: false,
      });
      // this.setState({group_list:group_list.concat(tmp)});
    });
    this.original = JSON.stringify(this.state);
  }

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
  };
  getIpaddress = (e) => {
    let inputText = e.target.value;
    let last_char = inputText.charAt(inputText.length - 1);
    if (last_char == "." || parseInt(last_char) >= 0)
      this.setState({ ip_addr: e.target.value });
  };
  selectStartPage = (e) => {
    this.setState({
      start_page: e.target.value,
    });
  };

  getBedNumber = (e) => {
    this.setState({ bed_number: parseInt(e.target.id) });
  };

  getGroup = (e) => {
    this.setState({ group_1: e.target.value });
  };
  closeModal = () => {
    if (JSON.stringify(this.state) != this.original) {
      this.setState({
        isOpenConfirmModal: true,
        confirm_message:
          "登録していない内容があります。変更内容を破棄して移動しますか？",
      });
    } else {
      this.props.closeModal();
    }
  };
  async register() {
    let flag = true;
    if (this.state.ip_addr === "") {
      flag = false;
      window.sessionStorage.setItem(
        "alert_messages",
        "IPアドレスを入力してください。"
      );
    }
    if (flag) {
      let path = "/app/api/v2/dial/system_master/master_register";
      const post_data = {
        params: this.state,
      };
      await apiClient.post(path, post_data).then(() => {
        let str_msg = this.props.modal_data !== null ? "update" : "register";
        this.props.handleOk(str_msg);
      });
    }
  }
  handleOk = () => {
    if (JSON.stringify(this.state) == this.original) return;
    var error = this.checkValidation();

    if (error.length > 0) {
      this.setState({ alert_message: error.join("\n") });
      return;
    }

    let str_msg = this.props.modal_data !== null ? "変更" : "登録";
    this.setState({
      isUpdateConfirmModal: true,
      confirm_message: str_msg + "しますか？",
    });
  };

  confirmCancel = () => {
    this.setState({
      isOpenConfirmModal: false,
      isUpdateConfirmModal: false,
      confirm_message: "",
    });
  };

  closeConfirmModal = () => {
    this.setState(
      {
        isOpenConfirmModal: false,
        confirm_message: "",
      },
      () => {
        this.props.closeModal();
      }
    );
  };

  render() {
    return (
      <>
        <Modal
          show={true}
          id="add_contact_dlg"
          className="master-modal material-modal first-view-modal"
        >
          <Modal.Header>
            <Modal.Title>
              {title_array[this.props.modalType]}
              {this.props.modal_data !== null ? "編集" : "登録"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className="checkbox_area">
                <Checkbox
                  label="使用する"
                  getRadio={this.getRadio.bind(this)}
                  value={this.state.is_enabled}
                  checked={this.state.is_enabled === 1}
                  name="alwaysShow"
                />
              </div>
              <InputWithLabelBorder
                label="IPアドレス"
                type="text"
                className="name-area"
                getInputText={this.getIpaddress.bind(this)}
                diseaseEditData={this.state.ip_addr}
                id="ip_addr_id"
              />
              <div className="disease_classification">
                <label className="checkbox-label">初期ページ設定</label>
                <RadioButton
                  id="communication"
                  value="ベッドサイド"
                  label="ベッドサイド"
                  name="communication"
                  getUsage={this.selectStartPage}
                  checked={this.state.start_page === "ベッドサイド"}
                />
                <RadioButton
                  id="communication_1"
                  value=""
                  label="デフォルト"
                  name="communication"
                  getUsage={this.selectStartPage}
                  checked={this.state.start_page === ""}
                />
                <RadioButton
                  id="communication_2"
                  value="予約一覧"
                  label="予約一覧"
                  name="communication"
                  getUsage={this.selectStartPage}
                  checked={this.state.start_page === "予約一覧"}
                />
              </div>
              {this.state.start_page !== "予約一覧" ? (
                <SelectorWithLabel
                  title="ベッド指定"
                  options={bed_nos}
                  getSelect={this.getBedNumber.bind(this)}
                  departmentEditCode={this.state.bed_number}
                />
              ) : (
                <SelectorWithLabel
                  title="ベッドグループ"
                  options={this.group_list}
                  getSelect={this.getGroup.bind(this)}
                  value={this.state.group_1}
                />
              )}
              {this.state.isOpenConfirmModal !== false && (
                <SystemConfirmJapanModal
                  hideConfirm={this.confirmCancel.bind(this)}
                  confirmCancel={this.confirmCancel.bind(this)}
                  confirmOk={this.closeConfirmModal}
                  confirmTitle={this.state.confirm_message}
                />
              )}
              {this.state.isUpdateConfirmModal !== false && (
                <SystemConfirmJapanModal
                  hideConfirm={this.confirmCancel.bind(this)}
                  confirmCancel={this.confirmCancel.bind(this)}
                  confirmOk={this.register.bind(this)}
                  confirmTitle={this.state.confirm_message}
                />
              )}
              {this.state.alert_message != "" && (
                <ValidateAlertModal
                  handleOk={this.closeAlertModal}
                  alert_meassage={this.state.alert_message}
                />
              )}
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
            <Button
              className={
                JSON.stringify(this.state) != this.original
                  ? "red-btn"
                  : "disable-btn"
              }
              onClick={this.handleOk}
            >
              {this.props.modal_data !== null ? "変更" : "登録"}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

CreateTerminalModal.contextType = Context;

CreateTerminalModal.propTypes = {
  modal_data: PropTypes.object,
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  modalType: PropTypes.number,
  category: PropTypes.string,
};

export default CreateTerminalModal;
