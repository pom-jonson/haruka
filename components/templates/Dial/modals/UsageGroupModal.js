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
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
// import { getMasterValidate } from "~/components/templates/Dial/DialMethods";

import { masterValidate } from "~/helpers/validate";
import {
  removeRedBorder,
  // addRequiredBg,
  // removeRequiredBg,
  toHalfWidthOnlyNumber
} from "~/helpers/dialConstants";
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
    width: 120px;
    font-size: 18px;
  }
  input {
    width: 400px;
    font-size: 18px;
  }
  .disease_classification {
    display: flex;
    font-size: 18px;
    margin-left: 15px;
    margin-top: 8px;
    .radio-btn label {
      width: 100px;
      font-size: 18px;
      border: solid 1px rgb(206, 212, 218);
      border-radius: 4px;
      margin: 0 5px;
      padding: 4px 5px;
    }
    .checkbox-label {
      width: 110px;
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
    padding-top: 20px;
    input {
      font-size: 18px;
      width: 135px;
    }
  }
  .kana_area {
    padding-top: 10px;
  }
  .label-title {
    font-size: 18px;
  }
  .name_area {
    padding-top: 20px;
  }
  .footer {
    display: flex;
    margin-left: 32%;
    margin-top: 20px;
    margin-bottom: 20px;
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
      font-size: 20px;
      font-weight: 100;
    }
  }
`;

class UsageGroupModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    this.state = {
      is_enabled: modal_data !== null ? modal_data.is_enabled : 1,
      number: modal_data !== null ? modal_data.number : 0,
      code: modal_data !== null ? modal_data.code : "",
      name: modal_data !== null ? modal_data.name : "",
      name_kana: modal_data !== null ? modal_data.name_kana : "",
      sort_number: modal_data !== null ? modal_data.sort_number : 0,
      table_kind: 12,
      isUpdateConfirmModal: false,
      isCloseConfirmModal: false,
      confirm_message: "",
      confirm_alert_title: "",
      alert_message: "",
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
    masterValidate(
      "dial_medicine_usage_group_master",
      this.state,
      'background'
    );    
  };
  //--------------------------------------
  //check validation of parameter
  checkValidation = () => {
    removeRedBorder("code_id");
    removeRedBorder("name_id");
    removeRedBorder("name_kana_id");
    let error_str_arr = [];
    let validate_data = masterValidate(
      "dial_medicine_usage_group_master",
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

  getAlwaysShow = (name, value) => {
    if (name === "alwaysShow") this.setState({ is_enabled: value });
  };
  getValue = (key, e) => {
    if (key === "code") this.setState({ code: e.target.value });
    else if (key === "name") this.setState({ name: e.target.value });
    else if (key === "name_kana") this.setState({ name_kana: e.target.value });
    else if (key === "sort_number"){
      let input_value = e.target.value.replace(/[^0-9０-９]/g, '');
      if (input_value != "") {
        input_value = parseInt(toHalfWidthOnlyNumber(input_value));
      }
      this.setState({sort_number:input_value})  
    }
    
  };

  async registerMedicine() {
    let path = "/app/api/v2/dial/master/dial_method_register";
    const post_data = {
      params: this.state,
    };
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
          this.props.handleOk();
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
    // if(this.state.code === ''){
    //       window.sessionStorage.setItem("alert_messages", 'コードを入力してください。');
    //       return;
    //   }
    //   if(this.state.name === ''){
    //       window.sessionStorage.setItem("alert_messages", '表示名称を入力してください。');
    //       return;
    //   }
    //   let master_validate = getMasterValidate();
    //   let validate_data = master_validate.dial_medicine_usage_group_master;
    //   if (this.state.code != null && this.state.code != "" && this.state.code.length > validate_data.code.length){
    //       window.sessionStorage.setItem("alert_messages", '薬剤コードを'+validate_data.code.length+'文字以下で入力してください。');
    //       return;
    //   }
    //   if (this.state.name != null && this.state.name != "" && this.state.name.length > validate_data.name.length){
    //       window.sessionStorage.setItem("alert_messages", '表示名称を'+validate_data.name.length+'文字以下で入力してください。');
    //       return;
    //   }
    //   if (this.state.name_kana != null && this.state.name_kana != "" && this.state.name_kana.length > validate_data.name_kana.length){
    //       window.sessionStorage.setItem("alert_messages", 'カナ名称を'+validate_data.name_kana.length+'文字以下で入力してください。');
    //       return;
    //   }

    if (this.props.modal_data !== null) {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "服用グループマスタ情報を変更しますか?",
      });
    } else {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "服用グループマスタ情報を登録しますか?",
      });
    }
  };

  register = () => {
    this.registerMedicine().then(() => {
      this.change_flag = false;
      this.confirmCancel();
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
        className="master-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>
            服用グループマスタ{this.props.modal_data != null ? "編集" : "登録"}
          </Modal.Title>
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
            <div className="pattern_code">
              <InputWithLabelBorder
                label="コード"
                type="text"
                placeholder=""
                getInputText={this.getValue.bind(this, "code")}
                diseaseEditData={this.state.code}
                isDisabled={this.props.modal_data != null}
                id="code_id"
              />
              <InputWithLabelBorder
                label="表示順"
                type="text"
                placeholder=""
                getInputText={this.getValue.bind(this, "sort_number")}
                diseaseEditData={this.state.sort_number}
              />
            </div>
            <InputWithLabelBorder
              label="表示名称"
              type="text"
              className="name-area"
              getInputText={this.getValue.bind(this, "name")}
              diseaseEditData={this.state.name}
              id="name_id"
            />
            <InputWithLabelBorder
              label="カナ名称"
              type="text"
              className="kana_area"
              getInputText={this.getValue.bind(this, "name_kana")}
              diseaseEditData={this.state.name_kana}
              id="name_kana_id"
            />
            <div className="footer-buttons">
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
    );
  }
}

UsageGroupModal.contextType = Context;

UsageGroupModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  modal_data: PropTypes.object,
};

export default UsageGroupModal;
