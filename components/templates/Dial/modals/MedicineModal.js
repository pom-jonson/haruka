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
import RadioGroupButton from "~/components/molecules/RadioGroup";
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
    input {
      font-size: 18px;
      width: 130px;
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
    font-size: 18px;
    margin-top: 10px;
    margin-left: 15px;
    margin-bottom: 10px;
    .gender-label {
      width: 100px;
      margin-top: 8px;
      float: left;
    }
    .radio-group-btn label {
      font-size: 14px;
      width: 45px;
      padding: 4px 4px;
      border: solid 1px rgb(206, 212, 218);
      border-radius: 4px;
      margin-left: 5px;
    }
    .radio-group-btn:last-child {
      label {
        width: 85px;
      }
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

class MedicineModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    this.state = {
      is_enabled: modal_data !== null ? modal_data.is_enabled : 1,
      is_antithrombotic: modal_data !== null ? modal_data.is_antithrombotic : 0,
      number: modal_data !== null ? modal_data.number : 0,
      code: modal_data !== null ? modal_data.code : "",
      mhlw_code: modal_data !== null ? modal_data.mhlw_code : "",
      name_view: modal_data !== null ? modal_data.name_view : "",
      name: modal_data !== null ? modal_data.name : "",
      name_kana: modal_data !== null ? modal_data.name_kana : "",
      name_short: modal_data !== null ? modal_data.name_short : "",
      generic_name: modal_data !== null ? modal_data.generic_name : "",
      unit: modal_data !== null ? modal_data.unit : "",
      medicinal_properties:
        modal_data !== null ? modal_data.medicinal_properties : "",
      slelect_category: modal_data !== null ? modal_data.category : "",
      medicine_type_name: this.props.medicine_type_name,
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
    masterValidate("dial_medicine_master", this.state, 'background');
  };
  //--------------------------------------
  //check validation of parameter
  checkValidation = () => {
    removeRedBorder("code_id");
    removeRedBorder("name_id");
    removeRedBorder("name_kana_id");
    removeRedBorder("name_short_id");
    removeRedBorder("unit_id");
    removeRedBorder("mhlw_code_id");
    removeRedBorder("name_view_id");
    removeRedBorder("generic_name_id");
    removeRedBorder("medicinal_properties_id");
    let error_str_arr = [];
    let validate_data = masterValidate("dial_medicine_master", this.state);

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

  getCheckbox = (name, value) => {
    this.setState({ [name]: value });
  };
  getMedicineCode = (e) => {
    this.setState({ code: e.target.value });
  };
  getOtherMedicineCode = (e) => {
    this.setState({ mhlw_code: e.target.value });
  };
  getDisplayName = (e) => {
    this.setState({ name_view: e.target.value });
  };
  getMedicineName = (e) => {
    this.setState({ name: e.target.value });
  };
  getMedicineKanaName = (e) => {
    this.setState({ name_kana: e.target.value });
  };
  getMedicineShortName = (e) => {
    this.setState({ name_short: e.target.value });
  };
  getMedicineGeneralName = (e) => {
    this.setState({ generic_name: e.target.value });
  };

  getUnit = (e) => {
    this.setState({ unit: e.target.value });
  };
  getMedicineProperty = (e) => {
    this.setState({ medicinal_properties: e.target.value });
  };

  getMedicineCategory = (e) => {
    let slelect_category = this.state.slelect_category;
    if (slelect_category.includes(e.target.value)) {
      if (slelect_category.includes(e.target.value + ",")) {
        slelect_category = slelect_category.replace(e.target.value + ",", "");
      } else {
        slelect_category = slelect_category.replace(e.target.value, "");
      }
    } else {
      if (slelect_category === "") {
        slelect_category = e.target.value;
      } else {
        slelect_category = slelect_category + "," + e.target.value;
      }
    }
    this.setState({ slelect_category: slelect_category });
  };

  async registerMedicine() {
    let path = "/app/api/v2/dial/master/medicine_register";
    const post_data = {
      params: this.state,
    };
    post_data.params.category = this.state.slelect_category;
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
    if (this.change_flag == false) return;
    var error = this.checkValidation();

    if (error.length > 0) {
      this.setState({ alert_message: error.join("\n") });
      return;
    }

    // if (this.state.code === "") {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "薬剤コードを入力してください。"
    //   );
    //   return;
    // }
    // if (this.state.name_view === "") {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "表示名称を入力してください。"
    //   );
    //   return;
    // }
    // if (this.state.name === "") {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "正式名称を入力してください。"
    //   );
    //   return;
    // }
    // if (this.state.name_kana === "") {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "カナ名称を入力してください。"
    //   );
    //   return;
    // }
    // if (this.state.slelect_category === "") {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "区分を選択してください。"
    //   );
    //   return;
    // }
    // let master_validate = getMasterValidate();
    // let validate_data = master_validate.dial_medicine_master;
    // if (
    //   this.state.code != null &&
    //   this.state.code != "" &&
    //   this.state.code.length > validate_data.code.length
    // ) {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "薬剤コードを" +
    //       validate_data.code.length +
    //       "文字以下で入力してください。"
    //   );
    //   return;
    // }
    // if (
    //   this.state.name != null &&
    //   this.state.name != "" &&
    //   this.state.name.length > validate_data.name.length
    // ) {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "正式名称を" +
    //       validate_data.name.length +
    //       "文字以下で入力してください。"
    //   );
    //   return;
    // }
    // if (
    //   this.state.name_view != null &&
    //   this.state.name_view != "" &&
    //   this.state.name_view.length > validate_data.name_view.length
    // ) {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "表示名称を" +
    //       validate_data.name_view.length +
    //       "文字以下で入力してください。"
    //   );
    //   return;
    // }
    // if (
    //   this.state.name_kana != null &&
    //   this.state.name_kana != "" &&
    //   this.state.name_kana.length > validate_data.name_kana.length
    // ) {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "カナ名称を" +
    //       validate_data.name_kana.length +
    //       "文字以下で入力してください。"
    //   );
    //   return;
    // }
    // if (
    //   this.state.name_short != null &&
    //   this.state.name_short != "" &&
    //   this.state.name_short.length > validate_data.name_short.length
    // ) {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "略称を" +
    //       validate_data.name_short.length +
    //       "文字以下で入力してください。"
    //   );
    //   return;
    // }
    // if (
    //   this.state.generic_name != null &&
    //   this.state.generic_name != "" &&
    //   this.state.generic_name.length > validate_data.generic_name.length
    // ) {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "一般名称を" +
    //       validate_data.generic_name.length +
    //       "文字以下で入力してください。"
    //   );
    //   return;
    // }
    // if (
    //   this.state.unit != null &&
    //   this.state.unit != "" &&
    //   this.state.unit.length > validate_data.unit.length
    // ) {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "単位を" + validate_data.unit.length + "文字以下で入力してください。"
    //   );
    //   return;
    // }
    // if (
    //   this.state.medicinal_properties != null &&
    //   this.state.medicinal_properties != "" &&
    //   this.state.medicinal_properties.length >
    //     validate_data.medicinal_properties.length
    // ) {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "薬効を" +
    //       validate_data.medicinal_properties.length +
    //       "文字以下で入力してください。"
    //   );
    //   return;
    // }

    if (this.props.modal_data !== null) {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "薬剤情報を変更しますか?",
      });
    } else {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "薬剤情報を登録しますか?",
      });
    }
  };

  register = () => {
    this.registerMedicine().then(() => {
      this.change_flag = false;
      this.confirmCancel();
      this.props.handleOk();
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
        id="add_contact_dlg"
        className="master-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>薬剤編集</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="checkbox_area">
              <Checkbox
                label="常に表示"
                getRadio={this.getCheckbox.bind(this)}
                value={this.state.is_enabled}
                checked={this.state.is_enabled === 1}
                name="is_enabled"
              />
              <Checkbox
                label="抗血栓"
                getRadio={this.getCheckbox.bind(this)}
                value={this.state.is_antithrombotic}
                checked={this.state.is_antithrombotic === 1}
                name="is_antithrombotic"
              />
            </div>
            <div className="medicine_code">
              <InputWithLabelBorder
                label="薬剤コード"
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
              {/* <Button type="mono">検索</Button> */}
            </div>
            <InputWithLabelBorder
              label="表示名称"
              type="text"
              className="name-area"
              getInputText={this.getDisplayName.bind(this)}
              diseaseEditData={this.state.name_view}
              id="name_view_id"
            />
            <InputWithLabelBorder
              label="正式名称"
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
              getInputText={this.getMedicineShortName.bind(this)}
              diseaseEditData={this.state.name_short}
              id="name_short_id"
            />
            <InputWithLabelBorder
              label="一般名称"
              type="text"
              getInputText={this.getMedicineGeneralName.bind(this)}
              diseaseEditData={this.state.generic_name}
              id="generic_name_id"
            />
            <InputWithLabelBorder
              label="単位"
              type="text"
              getInputText={this.getUnit.bind(this)}
              diseaseEditData={this.state.unit}
              id="unit_id"
            />
            <InputWithLabelBorder
              label="薬効"
              type="text"
              getInputText={this.getMedicineProperty.bind(this)}
              diseaseEditData={this.state.medicinal_properties}
              id="medicinal_properties_id"
            />
            <div className="gender">
              <label className="mr-2 gender-label">区分</label>
              <>
                {this.state.medicine_type_name.map((item, index) => {
                  return (
                    <>
                      <RadioGroupButton
                        id={`medicine_${index}`}
                        value={item}
                        label={item}
                        name="gender"
                        getUsage={this.getMedicineCategory}
                        checked={
                          this.state.slelect_category.includes(
                            this.props.medicine_type_name[index]
                          ) === true
                            ? true
                            : false
                        }
                      />
                    </>
                  );
                })}
              </>
            </div>
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

MedicineModal.contextType = Context;

MedicineModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  medicine_type_name: PropTypes.array,
  modal_data: PropTypes.object,
};

export default MedicineModal;
