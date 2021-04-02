import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import Checkbox from "~/components/molecules/Checkbox";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import RadioButton from "~/components/molecules/RadioInlineButton";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import { getMasterValidate } from "~/components/templates/Dial/DialMethods";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";

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
  .flex {
    display: flex;
  }
  label {
    text-align: right;
    width: 130px;
    font-size: 18px;
  }
  input {
    width: 400px;
    font-size: 18px;
  }
  .react-datepicker-wrapper {
    width: 100%;
    .react-datepicker__input-container {
      width: 100%;
      input {
        font-size: 18px;
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
      width: 155px;
    }
  }
  .label-title {
    font-size: 16px;
    padding-top: 3px;
    width:115px;
    margin-right:13px;
    margin-top:4px;
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
      margin-right:8px;
    }
    .radio-btn label {
      width: 90px;
      border: solid 1px rgb(206, 212, 218);
      border-radius: 4px;
      margin: 0 5px;
      padding: 4px 5px;
    }
  }
  .timing .radio-btn label {
    width: 135px;
  }
  .footer {
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
      font-size: 20px;
      font-weight: 100;
    }
  }
  .label-title{
    text-align:right;
  }
  .pullbox-label{
    width:auto;
    margin-top:7px;
    padding-right:16px;
  }
  .pullbox-select{
    width: calc(100% + 15px);
  }

`;

class CodeModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    this.family_class_options = [
      {id:'', value:''},
      {id:'祖父母', value:'祖父母'},
      {id:'父母', value:'父母'},
      {id:'配偶者・兄弟姉妹', value:'配偶者・兄弟姉妹'},
      {id:'子', value:'子'},
      {id:'孫', value:'孫'},
    ]
    this.state = {
      number: modal_data !== null ? modal_data.number : 0,
      is_enabled: modal_data !== null ? modal_data.is_enabled : 1,
      code: modal_data !== null ? modal_data.code : "",
      sort_number: modal_data !== null ? modal_data.sort_number : "",
      name: modal_data !== null ? modal_data.name : "",
      name_kana: modal_data !== null ? modal_data.name_kana : "",
      name_short: modal_data !== null ? modal_data.name_short : "",
      value: modal_data !== null ? modal_data.value : "",
      category: this.props.category,
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

  componentDidMount() {
    this.changeBackground();
  }

  componentDidUpdate() {
    this.changeBackground();
  }

  changeBackground = () => {
    masterValidate("dial_common_code_master", this.state, 'background');    
  };

  checkValidation = () => {
    removeRedBorder("code_id");
    removeRedBorder("name_id");
    removeRedBorder("name_kana_id");
    removeRedBorder("name_short_id");
    let error_str_arr = [];
    let validate_data = masterValidate("dial_common_code_master", this.state);

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
    if (name === "alwaysShow") {
      this.setState({ is_enabled: value });
    }
  };

  getCode = (e) => {
    this.setState({ code: e.target.value });
  };

  getSortNumber = (e) => {
    if (parseFloat(e) < 0) e = 0;
    this.setState({ sort_number: parseInt(e) });
  };

  getName = (e) => {
    this.setState({ name: e.target.value });
  };

  getKanaName = (e) => {
    this.setState({ name_kana: e.target.value });
  };

  getShortName = (e) => {
    this.setState({ name_short: e.target.value });
  };

  getValue = (e) => {
    this.setState({ value: e.target.value });
  };

  getFamilyClass = (e) => {
    this.setState({
      value:e.target.value,      
    })
  }

  async saveCode() {
    let path = "/app/api/v2/dial/master/register_code";
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
      let validate_data = master_validate.dial_common_code_master;
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
    }
    this.saveCode();
  };

  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isCloseConfirmModal: false,
      confirm_message: "",
      confirm_alert_title: "",
    });
  }

  temp_save = () => {
    this.saveCode().then(() => {
      this.setState({
        is_enabled: 0,
        code: "",
        sort_number: "",
        name: "",
        name_kana: "",
        name_short: "",
        value: "",
      });
    });
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

  onHide = () => {};

  render() {
    if (this.original != JSON.stringify(this.state)) {
      this.change_flag = true;
    } else {
      this.change_flag = false;
    }
    const { category } = this.props;
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        className="master-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>コード編集{category}</Modal.Title>
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
                // placeholder="パターンコードを入力"
                getInputText={this.getCode.bind(this)}
                diseaseEditData={this.state.code}
                id="code_id"
              />
              <NumericInputWithUnitLabel
                label="表示順"
                value={this.state.sort_number}
                getInputText={this.getSortNumber.bind(this)}
                inputmode="numeric"
              />
            </div>
            <InputWithLabelBorder
              label="表示名称"
              type="text"
              className="name-area"
              getInputText={this.getName.bind(this)}
              diseaseEditData={this.state.name}
              id="name_id"
            />
            <InputWithLabelBorder
              label="カナ名称"
              type="text"
              className="kana_area"
              getInputText={this.getKanaName.bind(this)}
              diseaseEditData={this.state.name_kana}
              id="name_kana_id"
            />
            <InputWithLabelBorder
              label="略称"
              type="text"
              getInputText={this.getShortName.bind(this)}
              diseaseEditData={this.state.name_short}
              id="name_short_id"
            />
            {category == "定期検査" && (
              <div className="gender flex">
                <label className="gender-label" style={{ width: "120px" }}>
                  検査種別区分
                </label>
                <RadioButton
                  id="BLOOD"
                  value="血液検査"
                  label="血液検査"
                  name="gender"
                  getUsage={this.getValue.bind(this)}
                  checked={this.state.value == "血液検査" ? true : false}
                />
                <RadioButton
                  id="ＸＰ"
                  value="ＸＰ"
                  label="ＸＰ"
                  name="gender"
                  getUsage={this.getValue.bind(this)}
                  checked={this.state.value == "ＸＰ" ? true : false}
                />
                <RadioButton
                  id="ＥＣＧ"
                  value="ＥＣＧ"
                  label="ＥＣＧ"
                  name="gender"
                  getUsage={this.getValue.bind(this)}
                  checked={this.state.value == "ＥＣＧ" ? true : false}
                />
                <RadioButton
                  id="other"
                  value="その他"
                  label="その他"
                  name="gender"
                  getUsage={this.getValue.bind(this)}
                  checked={this.state.value == "その他" ? true : false}
                />
              </div>
            )}
            {category == "実施タイミング" && (
              <>
                <div className="gender flex timing">
                  <label className="gender-label">時間区分</label>
                  <RadioButton
                    id="start_before"
                    value="透析開始前"
                    label="透析開始前"
                    name="gender"
                    getUsage={this.getValue.bind(this)}
                    checked={this.state.value == "透析開始前" ? true : false}
                  />
                  <RadioButton
                    id="start_after_soon"
                    value="透析開始時～直後"
                    label="透析開始時～直後"
                    name="gender"
                    getUsage={this.getValue.bind(this)}
                    checked={
                      this.state.value == "透析開始時～直後" ? true : false
                    }
                  />
                </div>
                <div className="gender flex timing">
                  <label className="gender-label"></label>
                  <RadioButton
                    id="start_after"
                    value="透析開始後"
                    label="透析開始後"
                    name="gender"
                    getUsage={this.getValue.bind(this)}
                    checked={this.state.value == "透析開始後" ? true : false}
                  />
                  <RadioButton
                    id="middle"
                    value="透析中"
                    label="透析中"
                    name="gender"
                    getUsage={this.getValue.bind(this)}
                    checked={this.state.value == "透析中" ? true : false}
                  />
                </div>
                <div className="gender timing flex">
                  <label className="gender-label"></label>
                  <RadioButton
                    id="end_before"
                    value="透析終了前"
                    label="透析終了前"
                    name="gender"
                    getUsage={this.getValue.bind(this)}
                    checked={this.state.value == "透析終了前" ? true : false}
                  />
                  <RadioButton
                    id="end_before_soon"
                    value="透析終了直前～終了時"
                    label="透析終了直前～終了時"
                    name="gender"
                    getUsage={this.getValue.bind(this)}
                    checked={
                      this.state.value == "透析終了直前～終了時" ? true : false
                    }
                  />
                  <RadioButton
                    id="end_after"
                    value="透析終了後"
                    label="透析終了後"
                    name="gender"
                    getUsage={this.getValue.bind(this)}
                    checked={this.state.value == "透析終了後" ? true : false}
                  />
                </div>
              </>
            )}
            {category == "VA名称" && (
              <InputWithLabel
                label="背景画像コード"
                type="text"
                className="name-area"
                getInputText={this.getValue.bind(this)}
                diseaseEditData={this.state.value}
              />
            )}
            {category == "グループ" && (
              <InputWithLabel
                label="施設"
                type="text"
                className="name-area"
                getInputText={this.getValue.bind(this)}
                diseaseEditData={this.state.value}
              />
            )}
            {(category == "照射録KVP" ||
              category == "照射録mA" ||
              category == "照射録sec" ||
              category == "照射録FED") && (
              <InputWithLabel
                label={category}
                type="text"
                className="name-area"
                getInputText={this.getValue.bind(this)}
                diseaseEditData={this.state.value}
              />
            )}
            {category == '家族歴' && (
              <SelectorWithLabel
                options={this.family_class_options}
                title="階層"
                getSelect={this.getFamilyClass.bind(this)}
                departmentEditCode={this.state.value}
              />
            )}

            <div className="footer-buttons" style={{marginTop:'10px'}}>
              <Button className="cancel-btn" onClick={this.close}>キャンセル</Button>
                <Button
                  className={this.change_flag ? "red-btn" : "disable-btn"}
                  onClick={this.handleOk}
                >
                  {this.props.modal_data != null ? "変更" : "登録"}
                </Button>
                {this.state.modal_data === null && (
                  <Button className="red-btn" onClick={this.temp_save}>続けて登録</Button>
                )}
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

CodeModal.contextType = Context;

CodeModal.propTypes = {
  closeModal: PropTypes.func,
  saveContact: PropTypes.func,
  handleOk: PropTypes.func,
  category: PropTypes.string,
  modal_data: PropTypes.object,
};

export default CodeModal;
