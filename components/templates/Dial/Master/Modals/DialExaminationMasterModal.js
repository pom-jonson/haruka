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
import RadioButton from "~/components/molecules/RadioInlineButton";
// import {formatDateLine} from "~/helpers/date";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import { getMasterValidate } from "~/components/templates/Dial/DialMethods";

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
    width: 80px;
  }
  input {
    width: 400px;
    font-size: 18px;
  }

  .checkbox-label {
    width: 30%;
    text-align: left;
  }
  .label-title {
    width: 120px;
    font-size: 16px;
    margin-top: 0;
    margin-bottom: 0;
    line-height: 38px;
  }
  .add-button {
    text-align: center;
    width: 100%;
  }
  .checkbox_area {
    padding-left: 15px;
    label {
      width: 150px;
      font-size: 14px;
    }
  }
  .medicine_code {
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px;
    input {
      font-size: 18px;
      width: 140px;
    }
    label {
      width: 120px;
      font-size: 16px;
      margin-top: 0;
      margin-bottom: 0;
      line-height: 38px;
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
    .radio-btn label {
      width: 100px;
      font-size: 18px;
      border: solid 1px rgb(206, 212, 218);
      border-radius: 4px;
      margin: 0 5px;
      padding: 4px 5px;
    }
  }
  .react-datepicker-wrapper {
    width: 400px;
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
`;

class DialExaminationMasterModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    this.state = {
      is_enabled: modal_data !== null ? modal_data.is_enabled : 1,
      number: modal_data !== null ? modal_data.number : 0,
      code: modal_data !== null ? modal_data.code : "",
      sort_number: modal_data !== null ? modal_data.sort_number : "",
      name: modal_data !== null ? modal_data.name : "",
      name_short: modal_data !== null ? modal_data.name_short : "",
      name_kana: modal_data !== null ? modal_data.name_kana : "",
      examination_category:
        modal_data !== null ? modal_data.examination_category : "",
      schedule_icon:
        modal_data !== null && modal_data.schedule_icon != ""
          ? modal_data.schedule_icon
          : "テキスト",
      schedule_icon_text:
        modal_data !== null ? modal_data.schedule_icon_text : "",
      is_visible_in_schedule:
        modal_data !== null ? modal_data.is_visible_in_schedule : 1,
      is_cardiothoracic_ratio_date:
        modal_data !== null ? modal_data.is_cardiothoracic_ratio_date : 0,

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
      "dial_periodic_examination_master",
      this.state,
      'background'
    );    
  };

  checkValidation = () => {
    removeRedBorder("code_id");
    removeRedBorder("name_id");
    removeRedBorder("name_kana_id");
    removeRedBorder("name_short_id");
    removeRedBorder("schedule_icon_text_id");
    let error_str_arr = [];
    let validate_data = masterValidate(
      "dial_periodic_examination_master",
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
  ///------------------------------------------------------

  getCheckValue = (name, value) => {
    if (name === "alwaysShow") {
      this.setState({ is_enabled: value });
    }

    if (name === "schedule") {
      this.setState({ is_visible_in_schedule: value });
    }

    if (name === "heart") {
      this.setState({ is_cardiothoracic_ratio_date: value });
    }
  };
  getMedicineCode = (e) => {
    this.setState({ code: e.target.value });
  };
  getOtherMedicineCode = (e) => {
    this.setState({ mhlw_code: e.target.value });
  };
  getMedicineName = (e) => {
    this.setState({ name: e.target.value });
  };
  getMedicineKanaName = (e) => {
    this.setState({ name_kana: e.target.value });
  };
  getShortName = (e) => {
    this.setState({ name_short: e.target.value });
  };

  getCategory = (e) => {
    this.setState({ examination_category: e.target.value });
  };

  getScheduleIcon = (e) => {
    this.setState({ schedule_icon: e.target.value });
  };

  getScheduleText = (e) => {
    this.setState({ schedule_icon_text: e.target.value });
  };

  async registerMedicine() {
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
    let validate_data = master_validate.dial_periodic_examination_master;
    if (
      this.state.code != null &&
      this.state.code != "" &&
      this.state.code.length > validate_data.code.length
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "コードを" + validate_data.code.length + "文字以下で入力してください。"
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
    if (
      this.state.schedule_icon_text != null &&
      this.state.schedule_icon_text != "" &&
      this.state.schedule_icon_text.length >
        validate_data.schedule_icon_text.length
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "表示文字を" +
          validate_data.schedule_icon_text.length +
          "文字以下で入力してください。"
      );
      return;
    }
    let path = "/app/api/v2/dial/master/register_examination";
    const post_data = {
      params: this.state,
    };
    if (this.double_click == true) return;
    this.double_click = true;
    await apiClient
      .post(path, post_data)
      .then(() => {
        var alarm_text =
          this.props.modal_data != null ? "変更しました。" : "登録しました。";
        var title = "";
        var message = alarm_text;
        if (message.indexOf("変更") > -1) title = "変更完了##";
        if (message.indexOf("登録") > -1) title = "登録完了##";
        window.sessionStorage.setItem("alert_messages", title + alarm_text);
        this.props.handleOk();
      })
      .finally(() => {
        this.confirmCancel();
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
        confirm_message: "定期検査情報を変更しますか?",
      });
    } else {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "定期検査情報を登録しますか?",
      });
    }
  };

  register = () => {
    this.change_flag = false;
    this.registerMedicine();
  };

  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isCloseConfirmModal: false,
      confirm_message: "",
      confirm_alert_title: "",
    });
  }

  getOrder = (e) => {
    this.setState({ sort_number: parseInt(e) });
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
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        id="add_contact_dlg"
        className="master-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>
            {this.props.modal_data !== null
              ? "定期検査マスタ編集"
              : "定期検査マスタ追加"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="checkbox_area">
              <Checkbox
                label="常に表示"
                getRadio={this.getCheckValue.bind(this)}
                value={this.state.is_enabled}
                checked={this.state.is_enabled === 1}
                name="alwaysShow"
              />
              <Checkbox
                label="スケジュールに表示"
                getRadio={this.getCheckValue.bind(this)}
                value={this.state.is_visible_in_schedule}
                checked={this.state.is_visible_in_schedule === 1}
                name="schedule"
              />
              <Checkbox
                label="心胸比の日付に使用"
                getRadio={this.getCheckValue.bind(this)}
                value={this.state.is_cardiothoracic_ratio_date}
                checked={this.state.is_cardiothoracic_ratio_date === 1}
                name="heart"
              />
            </div>
            <div className="medicine_code">
              <InputWithLabelBorder
                label="コード番号"
                type="text"
                getInputText={this.getMedicineCode.bind(this)}
                diseaseEditData={this.state.code}
                id="code_id"
              />
              <NumericInputWithUnitLabel
                label="表示順"
                value={this.state.sort_number}
                getInputText={this.getOrder.bind(this)}
                inputmode="numeric"
              />
            </div>
            <InputWithLabelBorder
              label="表示名称"
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
            <InputWithLabelBorder
              label="略称"
              type="text"
              className="kana_area"
              getInputText={this.getShortName.bind(this)}
              diseaseEditData={this.state.name_short}
              id="name_short_id"
            />
            <div className="gender">
              <label className="mr-2 gender-label">検査種別</label>
              <RadioButton
                id="exam_category_1"
                value="ＸＰ"
                label="ＸＰ"
                name="exam_category"
                getUsage={this.getCategory}
                checked={this.state.examination_category === "ＸＰ"}
              />
              <RadioButton
                id="exam_category_2"
                value="その他"
                label="その他"
                name="exam_category"
                getUsage={this.getCategory}
                checked={this.state.examination_category === "その他"}
              />
              <RadioButton
                id="exam_category_3"
                value="定期検査"
                label="定期検査"
                name="exam_category"
                getUsage={this.getCategory}
                checked={this.state.examination_category === "定期検査"}
              />
              <RadioButton
                id="exam_category_4"
                value="ＥＣＧ"
                label="ＥＣＧ"
                name="exam_category"
                getUsage={this.getCategory}
                checked={this.state.examination_category === "ＥＣＧ"}
              />
            </div>
            <div className="gender">
              <label className="mr-2 gender-label">アイコン</label>
              <RadioButton
                id="gender_1"
                value="テキスト"
                label="テキスト"
                name="medicinal_efficacy"
                getUsage={this.getScheduleIcon}
                checked={this.state.schedule_icon == "テキスト" ? true : false}
              />
              <RadioButton
                id="gender_2"
                value="胸部X-P"
                label="胸部X-P"
                name="medicinal_efficacy"
                getUsage={this.getScheduleIcon}
                checked={this.state.schedule_icon == "胸部X-P" ? true : false}
              />
              <RadioButton
                id="gender_3"
                value="心電図"
                label="心電図"
                name="medicinal_efficacy"
                getUsage={this.getScheduleIcon}
                checked={this.state.schedule_icon == "心電図" ? true : false}
              />
            </div>
            <InputWithLabelBorder
              label="表示文字"
              type="text"
              className="kana_area"
              isDisabled={this.state.schedule_icon == "テキスト" ? false : true}
              getInputText={this.getScheduleText.bind(this)}
              diseaseEditData={this.state.schedule_icon_text}
              id="schedule_icon_text_id"
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
          <Button className='cancel-btn' onClick={this.close}>キャンセル</Button>              
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

DialExaminationMasterModal.contextType = Context;

DialExaminationMasterModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  modal_data: PropTypes.object,
};

export default DialExaminationMasterModal;
