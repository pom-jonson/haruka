import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import Checkbox from "~/components/molecules/Checkbox";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";

//components for validation area-----------------------------------------
import { masterValidate } from "~/helpers/validate";
import {
  removeRedBorder,
} from "~/helpers/dialConstants";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from "jquery";
//-----------------------------------------------------------------------

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
    width: 80px;
  }
  input {
    width: 400px;
    font-size: 16px;
  }

  .checkbox-label {
    width: 30%;
    text-align: left;
  }
  .label-title {
    font-size: 16px;
    width: 120px;
  }
  .add-button {
    text-align: center;
    width: 100%;
  }
  .checkbox_area {
    padding-left: 15px;
    label {
      font-size: 15px;
      margin-left: 120px;
    }
  }
  .medicine_code {
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px;
    margin-left: -20px;
    input {
      font-size: 16px;
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
    font-size: 16px;
    margin-top: 10px;
    margin-left: 15px;
    margin-bottom: 10px;
    .gender-label {
      width: 100px;
      margin-top: 8px;
      float: left;
    }
    .radio-btn label {
      width: 100px;
      border: solid 1px rgb(206, 212, 218);
      border-radius: 4px;
      margin: 0 5px;
      padding: 4px 5px;
    }
  }
  .pullbox-label {
    width: 155px;
    margin-top:7px;
    select {
      width: 100%;
      height: 35px;
    }
  }
  .pullbox .label-title {
    width: 200px;
    text-align: right;
    font-size: 16px;
    margin-top: 5px;
    margin-bottom: 0;
    margin-right: 8px;
  }
  .footer {
    display: flex;
    margin-top: 10px;
    text-align: center;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 30px;
    }

    span {
      color: white;
      font-size: 16px;
      font-weight: 100;
    }
  }
`;

class BedModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    this.state = {
      is_enabled: modal_data !== null ? modal_data.is_enabled : 1,
      number: modal_data !== null ? modal_data.number : 0,
      name: modal_data !== null ? modal_data.name : "",
      group_1: modal_data !== null ? modal_data.group_1 : "",
      group_2: modal_data !== null ? modal_data.group_2 : "",
      default_console_code:
        modal_data !== null ? modal_data.default_console_code : "",
      isUpdateConfirmModal: false,
      isCloseConfirmModal: false,
      confirm_message: "",
      alert_message: "",
      confirm_alert_title: "",
    };
    this.double_click = false;
    this.change_flag = false;
    this.original = JSON.stringify(this.state);
  }

  //set background of required field box
  componentDidMount() {
    this.changeBackground();
  }

  componentDidUpdate() {
    this.changeBackground();
  }

  changeBackground = () => {
    masterValidate("bed_master", this.state, 'background');
  };
  //--------------------------------------
  //check validation of parameter
  checkValidation = () => {
    removeRedBorder("name_id");
    removeRedBorder("group_1_id");
    removeRedBorder("group_2_id");
    let error_str_arr = [];
    let validate_data = masterValidate("bed_master", this.state);
    if (validate_data.error_str_arr.length > 0) {
      error_str_arr = validate_data.error_str_arr;
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
  ///------------------------------------------------------

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
        confirm_message: "ベッドマスタ情報を変更しますか?",
      });
    } else {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "ベッドマスタ情報を登録しますか?",
      });
    }
  };
  getAlwaysShow = (name, value) => {
    if (name === "alwaysShow") {
      this.setState({ is_enabled: value });
    }
  };

  getBedName = (e) => {
    this.setState({ name: e.target.value });
  };

  getGroup1 = (e) => {
    this.setState({ group_1: e.target.value });
  };

  getGroup2 = (e) => {
    this.setState({ group_2: e.target.value });
  };

  async registerBed() {
    if (this.double_click == true) return;
    this.double_click = true;

    let path = "/app/api/v2/dial/master/bed_register";
    const post_data = {
      params: this.state,
    };
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
          this.props.handleOk();
        }
      })
      .finally(() => {
        this.double_click = false;
      });
  }

  register = () => {
    this.registerBed().then(() => {
      this.confirmCancel();
      this.change_flag = false;
    });
  };

  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isCloseConfirmModal: false,
      confirm_message: "",
      confirm_alert_title: "",
    });
  }

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

  getDefaultConsole = (e) => {
    this.setState({
      default_console_code: parseInt(e.target.id),
    });
  };

  onHide = () => {};

  render() {
    if (this.original != JSON.stringify(this.state)) {
      this.change_flag = true;
    } else {
      this.change_flag = false;
    }
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        id="add_contact_dlg"
        className="master-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>ベッド編集</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="checkbox_area">
              <Checkbox
                label="常に表示"
                getRadio={this.getAlwaysShow.bind(this)}
                value={this.state.is_enabled}
                checked={this.state.is_enabled === 1}
                name="alwaysShow"
              />
            </div>
            <InputWithLabelBorder
              label="ベッド番号"
              type="text"
              className="name-area"
              getInputText={this.getBedName.bind(this)}
              diseaseEditData={this.state.name}
              id="name_id"
            />
            <InputWithLabelBorder
              label="グループ１"
              type="text"
              getInputText={this.getGroup1.bind(this)}
              diseaseEditData={this.state.group_1}
              id="group_1_id"
            />

            <InputWithLabelBorder
              label="グループ２"
              type="text"
              getInputText={this.getGroup2.bind(this)}
              diseaseEditData={this.state.group_2}
              id="group_2_id"
            />
            <SelectorWithLabel
              options={this.props.consoles_list}
              title="デフォルトコンソール"
              getSelect={this.getDefaultConsole.bind(this)}
              departmentEditCode={this.state.default_console_code}
              id="default_console_code_id"
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
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.close}>キャンセル</Button>
          <Button
              className={this.change_flag ? "red-btn" : "disable-btn"}
            onClick={this.handleOk}
          >
            {this.props.modal_data !== null ? "変更" : "登録"}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

BedModal.contextType = Context;

BedModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  modal_data: PropTypes.object,
  consoles_list: PropTypes.array,
};

export default BedModal;
