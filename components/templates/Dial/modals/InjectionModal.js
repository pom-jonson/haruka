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
import RadioGroupButton from "~/components/molecules/RadioGroup";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
// import { getMasterValidate } from "~/components/templates/Dial/DialMethods";

import { masterValidate } from "~/helpers/validate";
import {
  removeRedBorder,
  // addRequiredBg,
  // removeRequiredBg,
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
  }
  input {
    width: 400px;
    font-size: 18px;
  }
  .checkbox-label {
    width: 30%;
    text-align: left;
  }
  .checkbox-name {
    margin-top: 5px;
    margin-right: 4px;
    width: 130px;
    text-align: right;
  }
  .add-button {
    text-align: center;
  }
  .checkbox_area {
    padding-left: 15px;
    label {
      font-size: 15px;
      margin-left: 70px;
    }
    .checkbox-name {
      margin-left: 0px;
    }
  }
  .pattern_code {
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px;
    margin-left: -20px;
    input {
      font-size: 18px;
      width: 100px;
    }
    label {
      width: 140px;
      font-size: 16px;
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
  .label-title {
    font-size: 18px;
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
    .radio-btn label {
      width: 60px;
      border: solid 1px rgb(206, 212, 218);
      border-radius: 4px;
      margin: 0 5px;
      padding: 4px 5px;
    }
    .radio-group-btn label {
      font-size: 14px;
      width: 70px;
      padding: 4px 4px;
      border: solid 1px rgb(206, 212, 218);
      border-radius: 4px;
      margin-left: 5px;
    }
  }
  .footer {
    display: flex;
  }
`;
const injection_type_names = [
  "静注",
  "筋注",
  "点滴",
  "処置薬剤",
  "麻酔",
  "処置行為",
  "区分無し",
];
class InjectionModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    this.state = {
      is_enabled: modal_data !== null ? modal_data.is_enabled : 1,
      number: modal_data !== null ? modal_data.number : 0,
      code: modal_data !== null ? modal_data.code : "",
      mhlw_code: modal_data !== null ? modal_data.mhlw_code : "",
      name_view: modal_data !== null ? modal_data.name_view : "",
      name: modal_data !== null ? modal_data.name : "",
      name_kana: modal_data !== null ? modal_data.name_kana : "",
      name_short: modal_data !== null ? modal_data.name_short : "",
      generic_name: modal_data !== null ? modal_data.generic_name : "",
      unit: modal_data !== null ? modal_data.unit : "",
      one_unit_value: modal_data !== null ? modal_data.one_unit_value : "",
      injection_category:
        modal_data != null &&
        modal_data.injection_category != null &&
        modal_data.injection_category !== ""
          ? modal_data.injection_category
          : "区分無し",
      is_insulin: modal_data !== null ? modal_data.is_insulin : 0,
      table_kind: 6,
      isBackConfirmModal: false,
      isUpdateConfirmModal: false,
      confirm_message: "",
      alert_message: "",
      confirm_alert_title: "",
    };
    this.double_click = false;
    this.original = "";
  }

  //set background of required field box

  changeBackground = () => {
    masterValidate("dial_injection_master", this.state, 'background');    
  };
  //--------------------------------------
  //check validation of parameter
  checkValidation = () => {
    removeRedBorder("code_id");
    removeRedBorder("name_id");
    removeRedBorder("name_kana_id");
    removeRedBorder("name_view_id");
    removeRedBorder("name_short_id");
    removeRedBorder("unit_id");
    removeRedBorder("mhlw_code_id");
    removeRedBorder("generic_name_id");
    removeRedBorder("one_unit_value_id");
    let error_str_arr = [];
    let validate_data = masterValidate("dial_injection_master", this.state);

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

  getAlwaysShow = (name, value) => {
    if (name === "alwaysShow") this.setState({ is_enabled: value });
    else if (name === "is_insulin") this.setState({ is_insulin: value });
  };
  getValue = (key, e) => {
    if (key === "code") this.setState({ code: e.target.value });
    else if (key === "mhlw_code") this.setState({ mhlw_code: e.target.value });
    else if (key === "name_view") this.setState({ name_view: e.target.value });
    else if (key === "name") this.setState({ name: e.target.value });
    else if (key === "name_kana") this.setState({ name_kana: e.target.value });
    else if (key === "name_short")
      this.setState({ name_short: e.target.value });
    else if (key === "generic_name")
      this.setState({ generic_name: e.target.value });
    else if (key === "unit") this.setState({ unit: e.target.value });
    else if (key === "one_unit_value")
      this.setState({ one_unit_value: e.target.value });
  };

  async registerMedicine() {
    let path = "/app/api/v2/dial/master/dial_method_register";
    let post_data = {
      params: this.state,
    };
    if (this.state.injection_category == "区分無し") {
      post_data.params.injection_category = "";
    }
    if (this.double_click == true) return;
    this.double_click = true;
    await apiClient
      .post(path, post_data)
      .then((res) => {
        if (res) var title = "";
        var message = res.alert_message;
        if (message.indexOf("変更") > -1) title = "変更完了##";
        if (message.indexOf("登録") > -1) title = "登録完了##";
        window.sessionStorage.setItem(
          "alert_messages",
          title + res.alert_message
        );
      })
      .finally(() => {
        this.double_click = false;
      });
  }

  handleOk = () => {
    var error = this.checkValidation();
    if (error.length > 0) {
      this.setState({ alert_message: error.join("\n") });
      return;
    }
    if (this.props.modal_data !== null) {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "注射情報を変更しますか?",
      });
    } else {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "注射情報を登録しますか?",
      });
    }
  };

  register = () => {
    this.registerMedicine().then(() => {
      this.confirmCancel();
      this.props.handleOk();
    });
  };

  confirmCancel() {
    this.setState({
      isBackConfirmModal: false,
      isUpdateConfirmModal: false,
      confirm_message: "",
      confirm_alert_title: "",
    });
  }

  getInjectionCategory = (e) => {
    this.setState({ injection_category: e.target.value });
  };

  onHide = () => {};
  closeConfirmModal = () => {
    this.confirmCancel();
    this.props.closeModal();
  };
  closeModal = () => {
    if (JSON.stringify(this.state) != this.original) {
      this.setState({
        isBackConfirmModal: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_alert_title: "入力中",
      });
    } else {
      this.props.closeModal();
    }
  };

  componentDidMount() {
    this.changeBackground();
    this.original = JSON.stringify(this.state);
  }

  componentDidUpdate() {
    this.changeBackground();
  }

  render() {
    // let error_str = this.checkValidation();
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        id="add_contact_dlg"
        className="master-modal first-view-modal material-modal"
      >
        <Modal.Header>
          <Modal.Title>注射編集</Modal.Title>
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
                label="注射コード"
                type="text"
                getInputText={this.getValue.bind(this, "code")}
                diseaseEditData={this.state.code}
                id="code_id"
              />
              <InputWithLabelBorder
                label="厚生労働省コード"
                type="text"
                getInputText={this.getValue.bind(this, "mhlw_code")}
                diseaseEditData={this.state.mhlw_code}
                id="mhlw_code_id"
              />
              {/* <Button type="mono">検索</Button> */}
            </div>
            <InputWithLabelBorder
              label="表示名称"
              type="text"
              className="name-area"
              getInputText={this.getValue.bind(this, "name_view")}
              diseaseEditData={this.state.name_view}
              id="name_view_id"
            />
            <InputWithLabelBorder
              label="正式名称"
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
            <InputWithLabelBorder
              label="略称"
              type="text"
              getInputText={this.getValue.bind(this, "name_short")}
              diseaseEditData={this.state.name_short}
              id="name_short_id"
            />
            <InputWithLabelBorder
              label="一般名称"
              type="text"
              getInputText={this.getValue.bind(this, "generic_name")}
              diseaseEditData={this.state.generic_name}
              id="generic_name_id"
            />
            <InputWithLabelBorder
              label="単位"
              type="text"
              getInputText={this.getValue.bind(this, "unit")}
              diseaseEditData={this.state.unit}
              id="unit_id"
            />
            <InputWithLabelBorder
              label="単位数量"
              type="text"
              getInputText={this.getValue.bind(this, "one_unit_value")}
              diseaseEditData={this.state.one_unit_value}
              id="one_unit_value_id"
            />
            <div className="gender">
              <label className="mr-2 gender-label">区分</label>
              <>
                {injection_type_names.map((item, index) => {
                  return (
                    <>
                      <RadioGroupButton
                        id={`inject_${index}`}
                        value={item}
                        label={item}
                        name="gender"
                        getUsage={this.getInjectionCategory}
                        checked={this.state.injection_category == item}
                      />
                    </>
                  );
                })}
              </>
            </div>
            <div className="checkbox_area">
              <label className="checkbox-name">インスリン区分</label>
              <Checkbox
                label="インスリン"
                getRadio={this.getAlwaysShow.bind(this)}
                value={this.state.is_insulin}
                checked={this.state.is_insulin === 1}
                name="is_insulin"
              />
            </div>
            <div className="footer footer-buttons">
              <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
                <Button className="red-btn" onClick={this.handleOk}>
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
          {this.state.isBackConfirmModal !== false && (
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
      </Modal>
    );
  }
}

InjectionModal.contextType = Context;

InjectionModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  modal_data: PropTypes.object,
};

export default InjectionModal;
