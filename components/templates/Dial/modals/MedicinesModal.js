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
import { formatDateLine } from "~/helpers/date";
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
    font-size: 18px;
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
      font-size: 18px;
      width: 155px;
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
      font-size: 20px;
      font-weight: 100;
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

class MedicinesModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    this.double_click = false;
    this.state = {
      is_enabled:
        modal_data !== null && modal_data !== undefined
          ? modal_data.is_enabled
          : 1,
      number:
        modal_data !== null && modal_data !== undefined ? modal_data.number : 0,
      code:
        modal_data !== null && modal_data !== undefined ? modal_data.code : "",
      mhlw_code:
        modal_data !== null && modal_data !== undefined
          ? modal_data.mhlw_code
          : "",
      name:
        modal_data !== null && modal_data !== undefined ? modal_data.name : "",
      transitional_measures_end_date:
        modal_data != null && modal_data != undefined &&
        modal_data.transitional_measures_end_date != null && modal_data.transitional_measures_end_date !== undefined && modal_data.transitional_measures_end_date !== ''
          ? new Date(modal_data.transitional_measures_end_date)
          : "",
      name_kana:
        modal_data !== null && modal_data !== undefined
          ? modal_data.name_kana
          : "",
      unit:
        modal_data !== null && modal_data !== undefined ? modal_data.unit : "",
      category:
        modal_data !== null && modal_data !== undefined
          ? this.props.medicine_type_name.indexOf(modal_data.category)
          : "",
      isUpdateConfirmModal: false,
      isBackConfirmModal: false,
      confirm_message: "",
      confirm_alert_title: "",
      alert_message: "",
    };
    this.original = "";
  }

  componentDidMount() {
    this.changeBackground();
    this.original = JSON.stringify(this.state);
  }

  componentDidUpdate() {
    this.changeBackground();
  }

  changeBackground = () => {    
    masterValidate("dial_mhlw_medicine_master", this.state, 'background');
  };

  checkValidation = () => {
    removeRedBorder("code_id");
    removeRedBorder("name_id");
    removeRedBorder("name_kana_id");
    removeRedBorder("unit_id");
    removeRedBorder("mhlw_code_id");
    let error_str_arr = [];
    let validate_data = masterValidate("dial_mhlw_medicine_master", this.state);

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
  getUnit = (e) => {
    this.setState({ unit: e.target.value });
  };

  getMedicineCategory = (e) => {
    this.setState({ category: e.target.value });
  };

  getTransitional_measures_end_date = (value) => {
    this.setState({ transitional_measures_end_date: value });
  };

  async registerMedicine() {
    this.confirmCancel();
    let path = "/app/api/v2/dial/master/medicines_register";
    const post_data = {
      params: {...this.state},
    };
    post_data.params.category = this.props.medicine_type_name[
      this.state.category
    ];
    post_data.params.transitional_measures_end_date = post_data.params
      .transitional_measures_end_date
      ? formatDateLine(post_data.params.transitional_measures_end_date)
      : "";
    if (this.double_click == true) return;
    this.double_click = true;
    await apiClient
      .post(path, post_data)
      .then(() => {
        if (this.state.number > 0) {
          window.sessionStorage.setItem(
            "alert_messages",
            "変更完了##" + "変更しました。"
          );
        } else {
          window.sessionStorage.setItem(
            "alert_messages",
            "登録完了##" + "登録しました。"
          );
        }
        this.props.handleOk();
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
        confirm_message: "医薬品情報を変更しますか?",
      });
    } else {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "医薬品情報を登録しますか?",
      });
    }
  };

  // checkValidation = () => {
  //   let master_validate = getMasterValidate();
  //   let validate_data = master_validate.dial_mhlw_medicine_master;
  //   let error_str = "";
  //   if (this.state.code == null || this.state.code === "") {
  //     error_str = "コードを入力してください。";
  //   } else if (this.state.name == null || this.state.name === "") {
  //     error_str = "表示名称を入力してください。";
  //   } else if (
  //     this.state.code != null &&
  //     this.state.code != "" &&
  //     this.state.code.length > validate_data.code.length
  //   ) {
  //     error_str =
  //       "コードを" + validate_data.code.length + "文字以下で入力してください。";
  //   } else if (
  //     this.state.mhlw_code != null &&
  //     this.state.mhlw_code != "" &&
  //     this.state.mhlw_code.length > validate_data.mhlw_code.length
  //   ) {
  //     error_str =
  //       "厚生労働省コードを" +
  //       validate_data.mhlw_code.length +
  //       "文字以下で入力してください。";
  //   } else if (
  //     this.state.name != null &&
  //     this.state.name != "" &&
  //     this.state.name.length > validate_data.name.length
  //   ) {
  //     error_str =
  //       "表示名称を" +
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
  //   } else if (
  //     this.state.unit != null &&
  //     this.state.unit != "" &&
  //     this.state.unit.length > validate_data.unit.length
  //   ) {
  //     error_str =
  //       "単位を" + validate_data.unit.length + "文字以下で入力してください。";
  //   } else if (JSON.stringify(this.state) == this.original) {
  //     error_str = "変更内容がありません。";
  //   }
  //   return error_str;
  // };

  register = () => {
    this.registerMedicine();
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

  onHide = () => {};

  render() {
    // let error_str = this.checkValidation();
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        id="add_contact_dlg"
        className="master-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>
            {this.props.modal_data !== null ? "医薬品編集" : "医薬品追加"}
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
            <div className="medicine_code">
              <InputWithLabelBorder
                label="コード番号"
                type="text"
                getInputText={this.getMedicineCode.bind(this)}
                diseaseEditData={this.state.code}
                id="code_id"
              />
              <InputWithLabelBorder
                label="厚生労働省コード"
                type="text"
                getInputText={this.getOtherMedicineCode.bind(this)}
                diseaseEditData={this.state.mhlw_code}
                id="mhlw_code_id"
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
              label="経過措置日"
              type="date"
              getInputText={this.getTransitional_measures_end_date.bind(this)}
              diseaseEditData={this.state.transitional_measures_end_date}
            />
            <InputWithLabelBorder
              label="単位"
              type="text"
              getInputText={this.getUnit.bind(this)}
              diseaseEditData={this.state.unit}
              id="unit_id"
            />
            <div className="gender">
              <label className="mr-2 gender-label">薬効</label>
              <RadioButton
                id="gender_1"
                value={0}
                label="内服"
                name="medicinal_efficacy"
                getUsage={this.getMedicineCategory}
                checked={this.state.category == 0 ? true : false}
              />
              <RadioButton
                id="gender_2"
                value={1}
                label="外用"
                name="medicinal_efficacy"
                getUsage={this.getMedicineCategory}
                checked={this.state.category == 1 ? true : false}
              />
              <RadioButton
                id="gender_3"
                value={2}
                label="注射"
                name="medicinal_efficacy"
                getUsage={this.getMedicineCategory}
                checked={this.state.category == 2 ? true : false}
              />
            </div>
            <div className="footer-buttons">
              <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
                <Button
                  onClick={this.handleOk}
                   className="red-btn"
                  // className={error_str != "" ? "disable-btn" : ""}
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

MedicinesModal.contextType = Context;

MedicinesModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  medicine_type_name: PropTypes.array,
  modal_data: PropTypes.object,
};

export default MedicinesModal;
