import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
// import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import Checkbox from "~/components/molecules/Checkbox";
// import InputWithLabel from "~/components/molecules/InputWithLabel";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
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
    width: 27rem;
    font-size: 1rem;
    height: 2rem;
    line-height: 2rem;
  }
  .react-datepicker-wrapper {
    width: 100%;
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
  .label-title{
    height: 2rem;
    line-height: 2rem;
    margin-top: 0px;
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

  .checkbox-label {
    width: 30%;
    text-align: left;
  }
  .add-button {
    text-align: center;
  }
  .checkbox_area {
    div{
      margin-top: 0px;
    }
    .form-control{
      height: 2rem;
      line-height: 2rem;
      font-size: 1rem;
    }
    margin-left: 110px;
    label {
      margin-top: 0.1rem;
      font-size: 1rem;
      text-align: left;
      width: 100px;
      height: 2rem;
      line-height: 2rem;
      input{
        font-size: 1rem;
        height: 15px !important;
      }      
    }    
    .label-title {
      font-size: 1rem;
    }
    .dZZuAe {
      margin-top: 0px;
    }
    label{
      // margin-top:4px;
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
  .order-display-area{
    .label-title{
      width: auto;
    }
    label{
      margin-top: 0px;
    }
  }
`;

class OtherFacilitiesDepartmentModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    let otherFacilitiesNumber = this.props.selectedOtherFacilitiesNumber;
    this.state = {
      number: modal_data !== null ? modal_data.number : "",
      other_facilities_number:
        modal_data !== null
          ? modal_data.other_facilities_number
          : otherFacilitiesNumber,
      sort_number: modal_data !== null ? modal_data.sort_number : 0,
      name: modal_data !== null ? modal_data.name : "",
      name_kana: modal_data !== null ? modal_data.name_kana : "",
      name_short: modal_data !== null ? modal_data.name_short : "",
      is_enabled: modal_data !== null ? modal_data.is_enabled : 1,
      isBackConfirmModal: false,
      isUpdateConfirmModal: false,
      confirm_alert_title: "",
      alert_message: "",
    };
    this.double_click = false;
    this.can_register = false;
  }

  componentDidMount() {
    this.changeBackground();
    this.original = JSON.stringify(this.state);
    // check register permission
    this.can_register = this.context.$canDoAction(this.context.FEATURES.DIAL_OTHER_FACILITY_MASTER, this.context.AUTHS.REGISTER) == true || this.context.$canDoAction(this.context.FEATURES.DIAL_OTHER_FACILITY_MASTER, this.context.AUTHS.REGISTER_PROXY) == true;    
    // check udpate permission
    if(this.props.modal_data != null) {
      this.can_register = this.context.$canDoAction(this.context.FEATURES.DIAL_OTHER_FACILITY_MASTER, this.context.AUTHS.EDIT) == true || this.context.$canDoAction(this.context.FEATURES.DIAL_OTHER_FACILITY_MASTER, this.context.AUTHS.EDIT_PROXY) == true;    
    }
  }

  componentDidUpdate() {
    this.changeBackground();
  }

  changeBackground = () => {
    masterValidate(
      "dial_other_facilities_master_department",
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
      "dial_other_facilities_master_department",
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
  getName = (e) => {
    this.setState({ name: e.target.value });
  };
  getKanaName = (e) => {
    this.setState({ name_kana: e.target.value });
  };
  getShortName = (e) => {
    this.setState({ name_short: e.target.value });
  };

  async saveOtherFacilitiesDepartment() {
    let path = "/app/api/v2/dial/master/other_facilities_department_register";
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
        confirm_message: "診療科情報を変更しますか?",
      });
    } else {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "診療科情報を登録しますか?",
      });
      // this.saveOtherFacilitiesDepartment().then(() => {
      //   this.props.handleOk();
      // });
    }
  };

  // checkValidation = () => {
  //   let error_str = "";
  //   let master_validate = getMasterValidate();
  //   let validate_data = master_validate.dial_other_facilities_master_department;
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
  //   } else if (JSON.stringify(this.state) == this.original) {
  //     error_str = "変更内容がありません。";
  //   }
  //   return error_str;
  // };

  getSortNumber = (e) => {
    if (parseFloat(e) < 0) e = 0;
    this.setState({ sort_number: parseInt(e) });
  };

  register = () => {
    this.saveOtherFacilitiesDepartment().then(() => {
      this.confirmCancel();
      this.props.handleOk();
    });
  };

  confirmCancel = () => {
    this.setState({
      isBackConfirmModal: false,
      isUpdateConfirmModal: false,
      confirm_message: "",
      confirm_alert_title: "",
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
          <Modal.Title>診療科編集{category}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="checkbox_area flex">
              <Checkbox
                label="常に表示"
                getRadio={this.getAlwaysShow.bind(this)}
                value={this.state.is_enabled}
                checked={this.state.is_enabled === 1}
                name="alwaysShow"
              />
              <div className="order-display-area">
                <NumericInputWithUnitLabel
                  label="表示順"
                  value={this.state.sort_number}
                  getInputText={this.getSortNumber.bind(this)}
                  inputmode="numeric"
                />
              </div>
            </div>
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
        <Modal.Footer>            
            <div className={"custom-modal-btn cancel-btn"} onClick={this.closeModal} style={{cursor:"pointer"}}><span>キャンセル</span></div>
            {this.can_register ? (
              <>
                {JSON.stringify(this.state) != this.original ? (
                  <>
                    <div onClick={this.handleOk} className={"custom-modal-btn red-btn"} style={{cursor:"pointer"}}><span>{this.props.modal_data != null ? "変更" : "登録"}</span></div>
                  </>
                ):(
                  <>
                    <div className={"custom-modal-btn disable-btn"}><span>{this.props.modal_data != null ? "変更" : "登録"}</span></div>
                  </>
                )}                
              </>
            ) : (
              <>                
                <div className={"custom-modal-btn disable-btn"}><span>{this.props.modal_data != null ? "変更" : "登録"}</span></div>                
              </>
            )}                                   
        </Modal.Footer>
      </Modal>
    );
  }
}

OtherFacilitiesDepartmentModal.contextType = Context;

OtherFacilitiesDepartmentModal.propTypes = {
  closeModal: PropTypes.func,
  saveContact: PropTypes.func,
  handleOk: PropTypes.func,
  category: PropTypes.string,
  modal_data: PropTypes.object,
  selectedOtherFacilitiesNumber: PropTypes.integer,
};

export default OtherFacilitiesDepartmentModal;
