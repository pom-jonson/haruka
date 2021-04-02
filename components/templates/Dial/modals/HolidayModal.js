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
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import { formatDateLine } from "~/helpers/date";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
// import { getMasterValidate } from "~/components/templates/Dial/DialMethods";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";

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
  font-size: 1rem;
  width: 100%;
  height: 100%;
  float: left;
  .flex {
    display: flex;
  }
  label {
    text-align: right;
    width: 100px;
    font-size: 1rem;
    margin-bottom: 0px;
    margin-top: 0px;
  }
  input {
    width: 400px;
    font-size: 1rem;
    height: 2rem;
  }
  .label-title{
    height: 2rem;
    line-height: 2rem;
  }
  .pullbox-title{
    height: 2rem;
    line-height: 2rem;
    margin-right: 8px !important;
    width: 100px !important;
    font-size: 1rem;
  }
  .pullbox-select{
    height: 2rem;
    font-size: 1rem;
  }
  .react-datepicker-wrapper {
    width: 400px;
    .react-datepicker__input-container {
      width: 100%;
      input {
        font-size: 1rem;
        width: 100%;
        height: 2rem;
        border-radius: 4px;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(206, 212, 218);
        border-image: initial;
        padding: 0px 8px;
      }
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
      font-size: 1rem;
      text-align: left;
      margin-left: 110px;
      width: 100px;
      height: 15px;
      line-height: 15px;
      input{
        font-size: 1rem;
        height: 15px !important;
      }
    }
  }
  .kana_area {
    padding-top: 10px;
  }
  .name-area {
    padding-top: 20px;
  }
  .gender {
    font-size: 1rem;
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
      font-size: 1rem;
      font-weight: 100;
    }
  }
  .select-input {
    display: -webkit-flex;
    -webkit-flex-wrap: wrap;
    display: flex;
    flex-wrap: wrap;
    .pullbox {
      width: 100%;
    }
    margin-top: 10px;
    .pullbox-title {
      text-align: right;
      width: 90px;
      font-size: 1rem;
      margin-right: 16px;
    }
    .pullbox-label,
    .pullbox-select {
      width: 400px;
    }
  }
`;

class HolidayModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    this.day_of_week_list = [
      { id: null, value: null },
      { id: "月", value: "月" },
      { id: "火", value: "火" },
      { id: "水", value: "水" },
      { id: "木", value: "木" },
      { id: "金", value: "金" },
      { id: "土", value: "土" },
      { id: "日", value: "日" },
    ];
    this.state = {
      number: modal_data != null ? modal_data.number : "",
      month: modal_data != null ? modal_data.month : null,
      day: modal_data != null ? modal_data.day : null,
      week: modal_data != null ? modal_data.week : null,
      day_of_week: modal_data != null ? modal_data.day_of_week : null,
      name: modal_data != null ? modal_data.name : "",
      name_kana: modal_data != null ? modal_data.name_kana : "",
      name_short: modal_data != null ? modal_data.name_short : "",
      start_date: modal_data != null && modal_data.start_date != null ? new Date(modal_data.start_date) : '',
      end_date: modal_data != null && modal_data.end_date != null ? new Date(modal_data.end_date) : '',
      isBackConfirmModal: false,
      is_enabled: modal_data != null ? modal_data.is_enabled : 1,
      isUpdateConfirmModal: false,
      confirm_message: "",
      confirm_type: "",
      alert_message: "",
      confirm_alert_title: "",
    };
    this.double_click = false;
    this.week_list = [];
    this.week_list.push({ id: 0, value: null });
    for (var i = 1; i <= 5; i++) {
      this.week_list.push({ id: i, value: i });
    }
    this.change_flag = 0;
  }

  componentDidMount() {
    this.changeBackground();
    this.original = JSON.stringify(this.state);
  }

  componentDidUpdate() {
    this.changeBackground();
  }

  changeBackground = () => {
    masterValidate("dial_holiday_master", this.state, 'background');    
  };

  checkValidation = () => {
    removeRedBorder("name_id");
    removeRedBorder("name_kana_id");
    removeRedBorder("name_short_id");
    removeRedBorder("month_id");
    removeRedBorder("day_id");
    let error_str_arr = [];
    let validate_data = masterValidate("dial_holiday_master", this.state);

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
    this.change_flag = 1;
    if (name === "alwaysShow") {
      this.setState({ is_enabled: value });
    }
  };
  getMonth = (e) => {
    this.change_flag = 1;
    this.setState({ month: e.target.value });
  };
  getDay = (e) => {
    this.change_flag = 1;
    this.setState({ day: e.target.value });
  };
  getWeek = (e) => {
    this.change_flag = 1;
    this.setState({ week: e.target.value });
  };
  getDayOfWeek = (e) => {
    this.change_flag = 1;
    this.setState({ day_of_week: e.target.value });
  };
  getName = (e) => {
    this.change_flag = 1;
    this.setState({ name: e.target.value });
  };
  getKanaName = (e) => {
    this.change_flag = 1;
    this.setState({ name_kana: e.target.value });
  };
  getShortName = (e) => {
    this.change_flag = 1;
    this.setState({ name_short: e.target.value });
  };
  getStartDate = (value) => {
    this.change_flag = 1;
    this.setState({ start_date: value });
  };
  getEndDate = (value) => {
    this.change_flag = 1;
    this.setState({ end_date: value });
  };

  async saveHoliday() {
    let path = "/app/api/v2/dial/master/holiday_register";
    const post_data = {
      params: {...this.state},
    };
    post_data.params.start_date = post_data.params.start_date
      ? formatDateLine(post_data.params.start_date)
      : "";
    post_data.params.end_date = post_data.params.end_date
      ? formatDateLine(post_data.params.end_date)
      : "";
    if (this.double_click == true) return;
    this.double_click = true;
    await apiClient.post(path, post_data).finally(() => {
      this.double_click = false;
    });
  }

  handleOk = () => {
    // if (this.checkValidation() != "") return;
    var error = this.checkValidation();

    if (error.length > 0) {
      this.setState({ alert_message: error.join("\n") });
      return;
    }

    if (this.props.modal_data !== null) {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "祝日マスタ情報を変更しますか?",
      });
    } else {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "祝日マスタ情報を登録しますか?",
      });
    }
  };
  // checkValidation = () => {
  //   let error_str = "";
  //   let master_validate = getMasterValidate();
  //   let validate_data = master_validate.dial_holiday_master;
  //   if (
  //     this.state.name != null &&
  //     this.state.name != "" &&
  //     this.state.name.length > validate_data.name.length
  //   ) {
  //     error_str =
  //       "祝日名称を" +
  //       validate_data.name.length +
  //       "文字以下で入力してください。";
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
  //     error_str = "祝日名称を入力してください。";
  //   } else if (JSON.stringify(this.state) == this.original) {
  //     error_str = "変更内容がありません。";
  //   }
  //   return error_str;
  // };

  register = () => {
    this.saveHoliday().then(() => {
      this.confirmCancel();
      this.props.handleOk();
    });
  };

  confirmCancel() {
    this.setState({
      isBackConfirmModal: false,
      isUpdateConfirmModal: false,
      confirm_message: "",
      confirm_type: "",
      confirm_alert_title: "",
    });
  }

  temp_save = () => {
    this.saveHoliday().then(() => {
      this.setState({
        month: null,
        day: null,
        week: null,
        day_of_week: null,
        name: "",
        name_kana: "",
        name_short: "",
        start_date: "",
        end_date: "",
        is_enabled: 0,
      });
    });
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

  handleCloseModal = () => {
    if (this.change_flag == 1) {
      this.setState({
        confirm_message: (this.props.modal_data != null ? "変更" : "登録") + "を破棄しますか？",
        confirm_type: "cancel_edit"
      });
      return;
    }
    this.props.closeModal();
  }

  confirmOk = () => {
    if (this.state.confirm_type == "cancel_edit") {
      this.props.closeModal();
    }
  }

  render() {
    const { category } = this.props;
    // let error_str = this.checkValidation();
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        className="master-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>
            祝日マスタ{this.props.modal_data != null ? "編集" : "登録"}
            {category}
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
            <InputWithLabelBorder
              label="祝日名称"
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
            <InputWithLabelBorder
              label="月"
              type="text"
              getInputText={this.getMonth.bind(this)}
              diseaseEditData={this.state.month}
              id="month_id"
            />
            <InputWithLabelBorder
              label="日"
              type="text"
              getInputText={this.getDay.bind(this)}
              diseaseEditData={this.state.day}
              id="day_id"
            />
            <div className="select-input">
              <SelectorWithLabel
                options={this.week_list}
                title="第何週"
                getSelect={this.getWeek.bind(this)}
                departmentEditCode={this.state.week}
              />
            </div>
            <div className="select-input">
              <SelectorWithLabel
                options={this.day_of_week_list}
                title="曜日"
                getSelect={this.getDayOfWeek.bind(this)}
                departmentEditCode={this.state.day_of_week}
              />
            </div>
            <InputWithLabelBorder
              label="施行日"
              type="date"
              getInputText={this.getStartDate.bind(this)}
              placeholder={this.state.end_date != '' ? '' : '未設定'}
              diseaseEditData={this.state.start_date}
            />
            <InputWithLabelBorder
              label="廃止日"
              type="date"
              getInputText={this.getEndDate.bind(this)}
              placeholder={this.state.end_date != '' ? '' : '無期限'}
              diseaseEditData={this.state.end_date}
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
          {this.state.confirm_message !== "" && this.state.confirm_type !== "" && (
            <SystemConfirmModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.confirmOk.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
        </Modal.Body>
        <Modal.Footer>            
          <Button className="cancel-btn" onClick={this.handleCloseModal}>キャンセル</Button>
          <Button
            onClick={this.handleOk}            
            className={this.change_flag != 1 ? "disable-btn" : "red-btn"}
            isDisabled={this.change_flag != 1}
          >
            {this.props.modal_data != null ? "変更" : "登録"}
          </Button>
          {this.state.modal_data === null && (
            <Button className="red-btn" onClick={this.temp_save}>続けて登録</Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

HolidayModal.contextType = Context;

HolidayModal.propTypes = {
  closeModal: PropTypes.func,
  saveContact: PropTypes.func,
  handleOk: PropTypes.func,
  category: PropTypes.string,
  modal_data: PropTypes.object,
};

export default HolidayModal;
