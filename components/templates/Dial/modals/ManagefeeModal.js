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
import { Col } from "react-bootstrap";
import RadioGroupButton from "~/components/molecules/RadioGroup";
import RadioButton from "~/components/molecules/RadioInlineButton";
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
      font-size: 18px;
  }
  input {
    width: 419px;
    font-size: 18px;
  }
  .left{
    width:60%;
    float:left;
    padding-left:0;
  }
  .right{
    width:40%;
    float:right;
    padding-left:0;
  }
  .select-area{
    display:flex;
    margin-top:8px;
    padding-left:24px;
  }
  .select-area .label{
    border-radius:none;
    width: 80px;
  }
  .select-area .radio-btn{
    margin-left:10px;
  }
  
  .radio-btn label{
    width:90px;
    font-size: 16px;
    border-radius:0;
  }
  .radio-group-btn label{
    width: 70px;
    font-size: 16px;
    border-radius: 4px;
    margin-right:10px;
  }
  .weekday .radio-group-btn label{
    width:20px;
  }
  .weekday .label, .week .label{
    margin-right:10px;
  }

  .month{
    padding-left:24px;
    display: -webkit-inline-box;
  }
  .month .radio-group-btn label{
    width:40px;
    font-size: 18px;
    margin-left:5px;
    margin-right:5px;
  }
  .note div{
    float:left;
    width:fit-content;
    padding-left:25px;
  }
  
  .note textarea{
    width: 190px;
    height: 80px;
    margin-left:10px;
  }
  .select
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
  }
  .checkbox-label{
    width: auto;
    text-align: left;
  }
  .add-button {
      text-align: center;
  }
  .checkbox_area {
    padding-left: 25px;
  }
  .checkbox_area label{
    width:auto;    
  }
  .pattern_code {
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px 0 20px 0;
    input {
      font-size: 18px;
      width: 155px;
    }
  }
  .footer {
    display: flex;
    margin-left: 33%;
    margin-top: 10px;
    text-align: center;
    clear:both;
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
.right button{
  float:right;
}
.right .button_area{
  height:50px;
}
.hide {
  display: none;
}
 `;

class ManagefeeModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    this.state = {
      number:
        modal_data !== null && modal_data != undefined ? modal_data.number : 0,
      name:
        modal_data !== null && modal_data != undefined ? modal_data.name : "",
      name_kana:
        modal_data !== null && modal_data != undefined
          ? modal_data.name_kana
          : "",
      name_short:
        modal_data !== null && modal_data != undefined
          ? modal_data.name_short
          : "",
      is_enabled:
        modal_data !== null && modal_data != undefined
          ? modal_data.is_enabled
          : 1,
      is_comment_requiered:
        modal_data !== null && modal_data != undefined
          ? modal_data.is_comment_requiered
          : 0,
      is_pattern:
        modal_data !== null && modal_data != undefined
          ? modal_data.is_pattern
          : 0,
      is_outer_fee: 0,
      is_specific_management_fee:
        modal_data !== null && modal_data != undefined
          ? modal_data.is_fee_specifical_management
          : 0,
      type:
        modal_data !== null && modal_data != undefined ? modal_data.type : "",
      weekday:
        modal_data !== null && modal_data != undefined ? modal_data.weekday : 0,
      monthly_enable_week_number:
        modal_data !== null && modal_data != undefined
          ? modal_data.monthly_enable_week_number
          : 0,
      isBackConfirmModal: false,
      enable_month_flag:
        modal_data !== null && modal_data != undefined
          ? modal_data.enable_month_flag
          : 0,
      isUpdateConfirmModal: false,
      confirm_message: "",
      alert_message: "",
      confirm_alert_title: "",
    };
    this.double_click = false;
  }

  componentDidMount() {
    this.changeBackground();
    this.original = JSON.stringify(this.state);
  }

  componentDidUpdate() {
    this.changeBackground();
  }

  changeBackground = () => {
    masterValidate(
      "dial_fee_management_master",
      this.state,
      'background'
    );
  };

  checkValidation = () => {
    removeRedBorder("name_id");
    removeRedBorder("name_kana_id");
    removeRedBorder("name_short_id");
    let error_str_arr = [];
    let validate_data = masterValidate(
      "dial_fee_management_master",
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
    } else if (name === "ShowOuterFee") {
      this.setState({ is_outer_fee: value });
    } else if (name === "ShowSpecificManagementFee") {
      this.setState({ is_specific_management_fee: value });
    }
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
  selectIsCommentRequired = (e) => {
    this.setState({ is_comment_requiered: parseInt(e.target.value) });
  };
  selectIsPattern = (e) => {
    this.setState({ is_pattern: parseInt(e.target.value) });
  };
  selectType = (e) => {
    this.setState({ type: e.target.value });
  };
  selectWeekday = (e) => {
    this.setState({ weekday: parseInt(e.target.value) });
  };
  selectMonthlyEnableWeekNumber = (e) => {
    this.setState({ monthly_enable_week_number: parseInt(e.target.value) });
  };
  selectEnableMonthFlag = (e) => {
    this.setState({ enable_month_flag: parseInt(e.target.value) });
  };

  async saveManagefee() {
    let path = "/app/api/v2/dial/master/managefee_register";
    const post_data = {
      params: this.state,
    };
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
        this.confirmCancel();
        this.props.handleOk();
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
        confirm_message: "管理料マスタ情報を変更しますか?",
      });
    } else {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "管理料マスタ情報を登録しますか?",
      });
    }
  };

  // checkValidation = () => {
  //   let error_str = "";
  //   let master_validate = getMasterValidate();
  //   let validate_data = master_validate.dial_fee_management_master;
  //   if (
  //     this.state.name != null &&
  //     this.state.name != "" &&
  //     this.state.name.length > validate_data.name.length
  //   ) {
  //     error_str =
  //       "名称を" + validate_data.name.length + "文字以下で入力してください。";
  //   } else if (
  //     this.state.name_kana != null &&
  //     this.state.name_kana != "" &&
  //     this.state.name_kana.length > validate_data.name_kana.length
  //   ) {
  //     error_str =
  //       "カナ名称を" +
  //       validate_data.name_kana.length +
  //       "文字以下で入力してください。";
  //   } else if (
  //     this.state.name_short != null &&
  //     this.state.name_short != "" &&
  //     this.state.name_short.length > validate_data.name_short.length
  //   ) {
  //     error_str =
  //       "略称を" +
  //       validate_data.name_short.length +
  //       "文字以下で入力してください。";
  //   } else if (this.state.name === "") {
  //     error_str = "名称を入力してください。";
  //   } else if (this.state.name_kana === "") {
  //     error_str = "カナ名称を入力してください。";
  //   } else if (this.state.name_short === "") {
  //     error_str = "略称を入力してください。";
  //   } else if (JSON.stringify(this.state) == this.original) {
  //     error_str = "変更内容がありません。";
  //   }
  //   return error_str;
  // };

  register = () => {
    this.saveManagefee().then(() => {
      this.confirmCancel();
      this.props.handleOk();
    });
  };

  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isBackConfirmModal: false,
      confirm_message: "",
      confirm_alert_title: "",
    });
  }

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

  render() {
    // let error_str = this.checkValidation();

    return (
      <Modal
        show={true}
        className="managefee-modal master-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>
            {this.props.modal_data !== null
              ? "管理料・指導料 編集"
              : "管理料・指導料 追加"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <Col className="left">
              <InputWithLabelBorder
                label="名称"
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
              <div className="commnet select-area">
                <label className="label">コメント</label>
                <RadioButton
                  id="required"
                  value={1}
                  label="必須"
                  name="commnet"
                  getUsage={this.selectIsCommentRequired}
                  checked={this.state.is_comment_requiered === 1}
                />
                <RadioButton
                  id="non-required"
                  value={0}
                  label="不要"
                  name="commnet"
                  getUsage={this.selectIsCommentRequired}
                  checked={this.state.is_comment_requiered === 0}
                />
              </div>
              <div className="kind select-area">
                <label className="label">区分</label>
                <RadioButton
                  id="auto"
                  value={1}
                  label="パターン"
                  name="kind"
                  getUsage={this.selectIsPattern}
                  checked={this.state.is_pattern === 1}
                />
                <RadioButton
                  id="manual"
                  value={0}
                  label="手動登録"
                  name="kind"
                  getUsage={this.selectIsPattern}
                  checked={this.state.is_pattern === 0}
                />
              </div>
              <div
                className={`type select-area ${
                  this.state.is_pattern === 0 ? "hide" : ""
                }`}
              >
                <label className="label">実施</label>
                <RadioButton
                  id="once_month"
                  value="月1回目"
                  label="月1回目"
                  name="type"
                  getUsage={this.selectType}
                  checked={this.state.type === "月1回目"}
                />
                <RadioButton
                  id="onetwo_month"
                  value="月1、2回目"
                  label="月1、2回目"
                  name="type"
                  getUsage={this.selectType}
                  checked={this.state.type === "月1、2回目"}
                />
                <RadioButton
                  id="timing"
                  value="週・月を指定"
                  label="週・月を指定"
                  name="type"
                  getUsage={this.selectType}
                  checked={this.state.type === "週・月を指定"}
                />
              </div>
              <div
                className={`weekday select-area ${
                  this.state.is_pattern === 0 ||
                  this.state.type !== "週・月を指定"
                    ? "hide"
                    : ""
                }`}
              >
                <label className="label">曜日</label>
                <RadioGroupButton
                  id="monday"
                  value={0}
                  label="月"
                  name="weekday"
                  getUsage={this.selectWeekday}
                  checked={this.state.weekday === 0}
                />
                <RadioGroupButton
                  id="tuesday"
                  value={1}
                  label="火"
                  name="weekday"
                  getUsage={this.selectWeekday}
                  checked={this.state.weekday === 1}
                />
                <RadioGroupButton
                  id="wendsday"
                  value={2}
                  label="水"
                  name="weekday"
                  getUsage={this.selectWeekday}
                  checked={this.state.weekday === 2}
                />
                <RadioGroupButton
                  id="thursday"
                  value={3}
                  label="木"
                  name="weekday"
                  getUsage={this.selectWeekday}
                  checked={this.state.weekday === 3}
                />
                <RadioGroupButton
                  id="friday"
                  value={4}
                  label="金"
                  name="weekday"
                  getUsage={this.selectWeekday}
                  checked={this.state.weekday === 4}
                />
                <RadioGroupButton
                  id="saturday"
                  value={5}
                  label="土"
                  name="weekday"
                  getUsage={this.selectWeekday}
                  checked={this.state.weekday === 5}
                />
                <RadioGroupButton
                  id="sunday"
                  value={6}
                  label="日"
                  name="weekday"
                  getUsage={this.selectWeekday}
                  checked={this.state.weekday === 6}
                />
              </div>
              <div
                className={`week select-area ${
                  this.state.is_pattern === 0 ||
                  this.state.type !== "週・月を指定"
                    ? "hide"
                    : ""
                }`}
              >
                <label className="label">実施週</label>
                <RadioGroupButton
                  id="one"
                  value={0}
                  label="第1週目"
                  name="week"
                  getUsage={this.selectMonthlyEnableWeekNumber}
                  checked={this.state.monthly_enable_week_number === 0}
                />
                <RadioGroupButton
                  id="two"
                  value={1}
                  label="第2週目"
                  name="week"
                  getUsage={this.selectMonthlyEnableWeekNumber}
                  checked={this.state.monthly_enable_week_number === 1}
                />
                <RadioGroupButton
                  id="three"
                  value={2}
                  label="第3週目"
                  name="week"
                  getUsage={this.selectMonthlyEnableWeekNumber}
                  checked={this.state.monthly_enable_week_number === 2}
                />
                <RadioGroupButton
                  id="four"
                  value={3}
                  label="第4週目"
                  name="week"
                  getUsage={this.selectMonthlyEnableWeekNumber}
                  checked={this.state.monthly_enable_week_number === 3}
                />
                <RadioGroupButton
                  id="five"
                  value={4}
                  label="第5週目"
                  name="week"
                  getUsage={this.selectMonthlyEnableWeekNumber}
                  checked={this.state.monthly_enable_week_number === 4}
                />
              </div>
              <div
                className={`month select-area ${
                  this.state.is_pattern === 0 ||
                  this.state.type !== "週・月を指定"
                    ? "hide"
                    : ""
                }`}
              >
                <label className="label"> 実施月</label>
                <RadioGroupButton
                  id="Jan"
                  value={0}
                  label="1月"
                  name="month"
                  getUsage={this.selectEnableMonthFlag}
                  checked={this.state.enable_month_flag === 0}
                />
                <RadioGroupButton
                  id="Feb"
                  value={1}
                  label="2月"
                  name="month"
                  getUsage={this.selectEnableMonthFlag}
                  checked={this.state.enable_month_flag === 1}
                />
                <RadioGroupButton
                  id="Mar"
                  value={2}
                  label="3月"
                  name="month"
                  getUsage={this.selectEnableMonthFlag}
                  checked={this.state.enable_month_flag === 2}
                />
                <RadioGroupButton
                  id="Apr"
                  value={3}
                  label="4月"
                  name="month"
                  getUsage={this.selectEnableMonthFlag}
                  checked={this.state.enable_month_flag === 3}
                />
                <RadioGroupButton
                  id="May"
                  value={4}
                  label="5月"
                  name="month"
                  getUsage={this.selectEnableMonthFlag}
                  checked={this.state.enable_month_flag === 4}
                />
                <RadioGroupButton
                  id="Jun"
                  value={5}
                  label="6月"
                  name="month"
                  getUsage={this.selectEnableMonthFlag}
                  checked={this.state.enable_month_flag === 5}
                />
              </div>
              <div
                className={`month select-area ${
                  this.state.is_pattern === 0 ||
                  this.state.type !== "週・月を指定"
                    ? "hide"
                    : ""
                }`}
              >
                <label className="label" />
                <RadioGroupButton
                  id="Jul"
                  value={6}
                  label="7月"
                  name="month"
                  getUsage={this.selectEnableMonthFlag}
                  checked={this.state.enable_month_flag === 6}
                />
                <RadioGroupButton
                  id="Aug"
                  value={7}
                  label="8月"
                  name="month"
                  getUsage={this.selectEnableMonthFlag}
                  checked={this.state.enable_month_flag === 7}
                />
                <RadioGroupButton
                  id="Sep"
                  value={8}
                  label="9月"
                  name="month"
                  getUsage={this.selectEnableMonthFlag}
                  checked={this.state.enable_month_flag === 8}
                />
                <RadioGroupButton
                  id="Oct"
                  value={9}
                  label="10月"
                  name="month"
                  getUsage={this.selectEnableMonthFlag}
                  checked={this.state.enable_month_flag === 9}
                />
                <RadioGroupButton
                  id="Nov"
                  value={10}
                  label="11月"
                  name="month"
                  getUsage={this.selectEnableMonthFlag}
                  checked={this.state.enable_month_flag === 10}
                />
                <RadioGroupButton
                  id="Dec"
                  value={11}
                  label="12月"
                  name="month"
                  getUsage={this.selectEnableMonthFlag}
                  checked={this.state.enable_month_flag === 11}
                />
              </div>
            </Col>
            <Col className="right">
              <div className="checkbox_area">
                <Checkbox
                  label="常に表示"
                  getRadio={this.getAlwaysShow.bind(this)}
                  value={this.state.is_enabled}
                  checked={this.state.is_enabled === 1}
                  name="alwaysShow"
                />
              </div>
              <div className="checkbox_area">
                <Checkbox
                  label="外来料"
                  getRadio={this.getAlwaysShow.bind(this)}
                  value={this.state.is_outer_fee}
                  checked={this.state.is_outer_fee === 1}
                  name="ShowOuterFee"
                />
              </div>
              {/* <div className="button_area">
                <Button
                  type="mono"
                  className={this.state.curFocus === 1 ? "focus" : ""}
                >
                  コメント設定
                </Button>
              </div> */}
              <div className="checkbox_area">
                <Checkbox
                  label="特定管理料"
                  getRadio={this.getAlwaysShow.bind(this)}
                  value={this.state.is_specific_management_fee}
                  checked={this.state.is_specific_management_fee === 1}
                  name="ShowSpecificManagementFee"
                />
              </div>
              {/* <div className="button_area">
                <Button
                  type="mono"
                  className={this.state.curFocus === 1 ? "focus" : ""}
                >
                  コメント設定
                </Button>
              </div> */}
              <div className="note">
                <div>備考</div>
                <textarea />
              </div>
            </Col>
            <div className="footer-buttons">
              <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
                <Button
                  onClick={this.handleOk}
                   className="red-btn"
                  // className={error_str != "" ? "disable-btn" : "red-btn"}
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

ManagefeeModal.contextType = Context;

ManagefeeModal.propTypes = {
  modal_data: PropTypes.object,
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
};

export default ManagefeeModal;
