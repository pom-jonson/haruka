import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import Checkbox from "~/components/molecules/Checkbox";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import { masterValidate } from "~/helpers/validate";
import {removeRedBorder} from "~/helpers/dialConstants";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from "jquery";

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
    width: 80px;
  }
  input {
    width: 400px;
    font-size: 18px;
  }

  .checkbox-label {
    width: auto;
    text-align: left;
  }
  .label-title {
    font-size: 18px;
    width: 120px;
  }

  .checkbox_area {
    padding-left: 15px;
    label {
      font-size: 1rem;
      width: auto;
      margin-left: 32px;
    }
  }
  .medicine_code {
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px;
    input {
      font-size: 18px;
      width: 155px;
    }
    label {
      width: 120px;
      font-size: 15px;
    }
    .husei-code label {
      width: 100px;
      margin-left: 10px;
    }
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      height: 38px;
      margin-top: 8px;
      margin-left: 10px;
    }
    span {
      color: white;
    }
  }
  .kana_area {
    padding-top: 10px;
  }
  .name_area {
    padding-top: 20px;
  }
  .gender {
    font-size: 18px;
    margin-top: 10px;
    margin-left: 15px;
    margin-bottom: 10px;
    .gender-label {
      width: 100px;
      margin-top: 8px;
      float: left;
    }
  }
`;

class InjectionSetCategoryInputModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    this.state = {
      is_enabled: modal_data !== null ? modal_data.is_enabled : 1,
      number: modal_data !== null ? modal_data.number : 0,
      code: modal_data !== null ? modal_data.code : "",
      name: modal_data !== null ? modal_data.name : "",
      name_kana: modal_data !== null ? modal_data.name_kana : "",
      isUpdateConfirmModal: false,
      isOpenConfirmModal: false,
      confirm_message: "",
      confirm_alert_title: "",
      alert_message: "",
      sort_number: modal_data !== null ? modal_data.sort_number : "",
    };
    this.original = JSON.stringify(this.state);
  }

  componentDidMount() {
    this.changeBackground();
  }

  componentDidUpdate() {
    this.changeBackground();
  }

  changeBackground = () => {
    masterValidate(
      "dial_injection_set_category",
      this.state,
      'background'
    );
  };

  checkValidation = () => {
    removeRedBorder("code_id");
    removeRedBorder("name_id");
    removeRedBorder("name_kana_id");
    let error_str_arr = [];
    let validate_data = masterValidate(
      "dial_injection_set_category",
      this.state
    );

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

  getAlwaysShow = (name, value) => {
    if (name === "alwaysShow") {
      this.setState({ is_enabled: value });
    }
  };
  getMedicineCode = (e) => {
    if (e.target.value.length > 2) {
      return;
    }
    this.setState({ code: e.target.value });
  };
  getMedicineName = (e) => {
    this.setState({ name: e.target.value });
  };
  getMedicineKanaName = (e) => {
    this.setState({ name_kana: e.target.value });
  };

  async registerMedicine() {
    let path = "/app/api/v2/dial/master/dial_method_register";
    const post_data = {
      code: this.state.code,
      name: this.state.name,
      name_kana: this.state.name_kana,
      number: this.state.number,
      is_enabled: this.state.is_enabled,
      table_kind: 11,
      sort_number: this.state.sort_number
    };
    await apiClient.post(path, { params: post_data }).then((res) => {
      if (res) var title = "";
      var message = res.alert_message;
      if (message.indexOf("変更") > -1) title = "変更完了##";
      if (message.indexOf("登録") > -1) title = "登録完了##";
      window.sessionStorage.setItem(
        "alert_messages",
        title + res.alert_message
      );
    });
    this.props.handleOk();
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

  register = () => {
    this.registerMedicine();
  };

  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isOpenConfirmModal: false,
      confirm_message: "",
      confirm_alert_title: "",
    });
  }

  onHide = () => {};

  handleClose = () => {
    if (JSON.stringify(this.state) != this.original) {
      this.setState({
        isOpenConfirmModal: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_alert_title: "入力中",
      });
    } else {
      this.props.closeModal();
    }
  };

  closeConfirmModal = () => {
    this.setState(
      {
        isOpenConfirmModal: false,
        confirm_message: "",
        confirm_alert_title: "",
      },
      () => {
        this.props.closeModal();
      }
    );
  };
  getSortNumber = (e) => {
    if (parseFloat(e) < 0) e = 0;
    this.setState({ sort_number: parseInt(e) });
  };

  render() {
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        id="add_contact_dlg"
        className="master-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>
            注射セット分類{this.props.modal_data !== null ? "編集" : "登録"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="checkbox_area">
              <Checkbox
                label="この注射セット分類を常に表示"
                getRadio={this.getAlwaysShow.bind(this)}
                value={this.state.is_enabled}
                checked={this.state.is_enabled === 1}
                name="alwaysShow"
              />
            </div>
            <div className="medicine_code">
              <InputWithLabelBorder
                label="分類コード"
                type="text"
                getInputText={this.getMedicineCode.bind(this)}
                diseaseEditData={this.state.code}
                id="code_id"
                isDisabled = {this.props.modal_data != null? true:false}
              />
            </div>
            <NumericInputWithUnitLabel
              label="表示順"
              value={this.state.sort_number}
              getInputText={this.getSortNumber.bind(this)}
              inputmode="numeric"
            />
            <InputWithLabelBorder
              label="分類名称"
              type="text"
              className="name-area"
              getInputText={this.getMedicineName.bind(this)}
              diseaseEditData={this.state.name}
              id="name_id"
            />
            <InputWithLabelBorder
              label="カナ名称"
              type="text"
              className="kana_area"
              getInputText={this.getMedicineKanaName.bind(this)}
              diseaseEditData={this.state.name_kana}
              id="name_kana_id"
            />
          </Wrapper>
          {this.state.isUpdateConfirmModal !== false && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.register.bind(this)}
              confirmTitle={this.state.confirm_message}
            />
          )}
          {this.state.isOpenConfirmModal !== false && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.closeConfirmModal}
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
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.handleClose}>キャンセル</Button>
            <Button
              className={
                JSON.stringify(this.state) != this.original ? "red-btn" : "disable-btn"
              }
              onClick={this.handleOk}
            >
              {this.props.modal_data != null ? "変更" : "登録"}
            </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

InjectionSetCategoryInputModal.contextType = Context;

InjectionSetCategoryInputModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  modal_data: PropTypes.object,
};

export default InjectionSetCategoryInputModal;
