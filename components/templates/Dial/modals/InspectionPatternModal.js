import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import Checkbox from "~/components/molecules/Checkbox";
// import InputWithLabel from "~/components/molecules/InputWithLabel";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as methods from "~/components/templates/Dial/DialMethods";
// import { getMasterValidate } from "~/components/templates/Dial/DialMethods";
import * as apiClient from "~/api/apiClient";

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
    width: 150px;
    font-size: 18px;
  }
  input {
    width: 419px;
    font-size: 18px;
  }
  .checkbox-label {
    width: 30%;
    text-align: left;
  }
  .add-button {
    text-align: center;
  }
  .checkbox_area {
    padding-left: 25px;
    label {
      font-size: 15px;
      margin-left: 60px;
    }
  }
  .pattern_code {
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px 0 20px 0;
    input {
      font-size: 18px;
      width: 135px;
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
`;

class InspectionPatternModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    this.state = {
      number: modal_data !== null ? modal_data.number : 0,
      alwaysShow: modal_data !== null ? modal_data.is_enabled : 1,
      patternCode: modal_data !== null ? modal_data.code : "",
      patternName: modal_data !== null ? modal_data.name : "",
      patternKana: modal_data !== null ? modal_data.name_kana : "",
      displayOrder: modal_data !== null ? modal_data.sort_number : "",
      type:
        modal_data !== null
          ? modal_data.type
          : this.props.type == 1
          ? "合併症検査のパターン"
          : "パターン",
      
      contactAddress2: "",
      contactTelName1: "",
      contactTelName2: "",
      contactTelNumber1: "",
      contactTelNumber2: "",
      isBackConfirmModal: false,
      isUpdateConfirmModal: false,
      confirm_message: "",
      alert_message: "",
      confirm_alert_title: "",
    };
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
      "dial_examination_master_pattern",
      this.state,
      'background'
    );    
  };

  checkValidation = () => {
    removeRedBorder("patternCode_id");
    removeRedBorder("patternName_id");
    removeRedBorder("patternKana_id");
    removeRedBorder("displayOrder_id");
    let error_str_arr = [];
    let validate_data = masterValidate(
      "dial_examination_master_pattern",
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
    if (name == "contract_alwaysShow") this.setState({ alwaysShow: value });
  };
  getPatternCode = (e) => {
    this.setState({ patternCode: e.target.value });
  };
  getDisplayOrder = (e) => {
    let input_value = e.target.value.replace(/[^0-9０-９]/g, '');
    if (input_value != "") {
      input_value = parseInt(toHalfWidthOnlyNumber(input_value));
    }
    this.setState({ displayOrder: input_value });
  };
  getPatternName = (e) => {
    this.setState({ patternName: e.target.value });
  };
  getPatternKana = (e) => {
    this.setState({ patternKana: e.target.value });
  };
  getContactTelName1 = (e) => {
    this.setState({ contactTelName1: e.target.value });
  };

  register = () => {
    var error = this.checkValidation();

    if (error.length > 0) {
      this.setState({ alert_message: error.join("\n") });
      return;
    }

    if (this.props.modal_data !== null) {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "検査パターン名称を変更しますか?",
      });
    } else {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "検査パターン名称を登録しますか?",
      });
    }
  };

  // checkValidation = () => {
  //   let master_validate = getMasterValidate();
  //   let error_str = "";
  //   let validate_data = master_validate.dial_examination_master_pattern;
  //   if (this.state.patternCode === "") {
  //     error_str = "パターンコードを入力してください。";
  //   } else if (this.state.patternName === "") {
  //     error_str = "検査パターン名称を入力してください。";
  //   } else if (this.state.patternKana === "") {
  //     error_str = "カナ名称を入力してください。";
  //   } else if (
  //     this.state.patternCode != null &&
  //     this.state.patternCode != "" &&
  //     this.state.patternCode.length > validate_data.code.length
  //   ) {
  //     error_str =
  //       "パターンコードを" +
  //       validate_data.code.length +
  //       "文字以下で入力してください。";
  //   } else if (
  //     this.state.patternName != null &&
  //     this.state.patternName != "" &&
  //     this.state.patternName.length > validate_data.name.length
  //   ) {
  //     error_str =
  //       "検査パターン名称を" +
  //       validate_data.name.length +
  //       "文字以下で入力してください。";
  //   } else if (
  //     this.state.patternKana != null &&
  //     this.state.patternKana != "" &&
  //     this.state.patternKana.length > validate_data.name_kana.length
  //   ) {
  //     error_str =
  //       "カナ名称を" +
  //       validate_data.name_kana.length +
  //       "文字以下で入力してください。";
  //   } else if (JSON.stringify(this.state) == this.original) {
  //     error_str = "変更内容がありません。";
  //   }
  //   return error_str;
  // };

  saveData = () => {
    this.registerExaminationPatternItem(this.state, "pattern");
  };

  registerExaminationPatternItem(newPattern, kind) {
    let postData = {
      code: newPattern.patternCode,
      name: newPattern.patternName,
      name_kana: newPattern.patternKana,
      number: newPattern.number !== undefined ? newPattern.number : 0,
      sort_number: newPattern.displayOrder,
      is_enabled: newPattern.alwaysShow,
      type: this.props.type,
    };
    if (kind == "item") {
      postData = {
        pattern_code: newPattern.patternCode,
        item_code: newPattern.itemCode,
        name_kana: newPattern.abbreviation,        
      };
    }
    let path = "/app/api/v2/dial/master/register_examination_pattern";
    if (kind == "item")
      path = "/app/api/v2/dial/master/register_examination_pattern_item";
    apiClient
      .post(path, {
        params: postData,
      })
      .then((res) => {
        if (res.error_message !== undefined) {
          window.sessionStorage.setItem("alert_messages", res.error_message);
        } else {
          if (res.alert_message) {
            var title = "";
            var message = res.alert_message;
            if (message.indexOf("変更") > -1) title = "変更完了##";
            if (message.indexOf("登録") > -1) title = "登録完了##";
            window.sessionStorage.setItem(
              "alert_messages",
              title + res.alert_message
            );
          }
          this.props.registerExaminationPattern(this.state);
          this.props.closeModal();
        }
      })
      .catch(() => {
        window.sessionStorage.removeItem("isCallingAPI");
        this.props.closeModal();
      });
  }

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

    var title =
      this.props.type == 1 ? "合併症検査パターン名称" : "検査パターン名称";
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        className="inspection-pattern-modal master-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>
            {title}
            {this.props.modal_data !== null ? "編集" : "登録"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="checkbox_area">
              <Checkbox
                label="常に表示"
                getRadio={this.getAlwaysShow.bind(this)}
                value={this.state.alwaysShow}
                checked={this.state.alwaysShow === 1}
                name="contract_alwaysShow"
              />
            </div>
            <div className="pattern_code">
              <InputWithLabelBorder
                label="パターンコード"
                type="text"
                // placeholder="パターンコードを入力"
                getInputText={this.getPatternCode.bind(this)}
                diseaseEditData={this.state.patternCode}
                id="patternCode_id"
              />
              {/* <InputWithLabelBorder
                label="表示順"
                type="text"
                // placeholder="表示順を入力"
                getInputText={this.getDisplayOrder.bind(this)}
                diseaseEditData={this.state.displayOrder}
                id="displayOrder_id"
              /> */}
            </div>
            <InputWithLabelBorder
              label="検査パターン名称"
              type="text"
              // placeholder="検査パターン名称を入力"
              getInputText={this.getPatternName.bind(this)}
              diseaseEditData={this.state.patternName}
              id="patternName_id"
            />
            <InputWithLabelBorder
              label="カナ名称"
              type="text"
              // placeholder="カナ名称を入力"
              getInputText={this.getPatternKana.bind(this)}
              diseaseEditData={this.state.patternKana}
              id="patternKana_id"
            />
            <div className="footer-buttons">
              <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
                <Button
                  onClick={this.register}
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
              confirmOk={this.saveData.bind(this)}
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

InspectionPatternModal.contextType = Context;

InspectionPatternModal.propTypes = {
  closeModal: PropTypes.func,
  registerExaminationPattern: PropTypes.func,
  modal_data: PropTypes.object,
  type: PropTypes.bool,
};

export default InspectionPatternModal;
