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
      font-size: 18px;
      width: 120px !important;
      line-height: 38px;
      margin-top: 0px !important;
      margin-bottom: 0px !important;
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
                font-size: 14px;
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
    width: 30%;
    text-align: left;
  }
  .add-button {
      text-align: center;
  }
  .checkbox_area {
    padding-left: 18px;
    label{
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
      width: 140px;
    }
    label {
    font-size: 16px;    
      width: 120px;
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
    margin-bottom: 10px;
    .gender-label {
      width: 100px;
      margin-top: 10px;
      float: left;
  }
    .radio-btn label{
    font-size: 18px;
        width: 80px;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 4px;
        margin: 0 5px;
        padding: 4px 5px;
    }
  }
  .normal-value-arange {
    display: flex;
    label {
      width: 100px;
      margin-top: 10px;
    }
    span {
      padding: 8px;
      border: solid 1px grey;
      background: lightblue;
      margin-top:3px;
    }
  }
  .value-arange-content {
    display: flex;
    margin-left: 8px;
    input {
      width: 60px;
    }
    label {
      width: 80px;
    }
    .man-box {
        margin-top: 3px;
        padding: 8px;
        background-color: rgb(159,176,215);
    }
    .woman-box {
        margin-top: 3px;
        padding: 8px;
        background-color: rgb(238,185,234);
    }
  }
  .footer {    
    margin-top: 10px;    
}
.flex{
  display:flex;
}
.arrange-value{
  .label-title{
    width:60px!important;
  }
  span{
    font-size:16px;
    width:48px;
  }
}
.arrange-value div{
  margin-top:4px;
}
 `;

class InspctionModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    this.state = {
      is_enabled: modal_data !== null ? modal_data.is_enabled : 1,
      number: modal_data !== null ? modal_data.number : 0,
      code: modal_data !== null ? modal_data.code : "",
      company_examination_code:
        modal_data !== null ? modal_data.company_examination_code : "",
      name: modal_data !== null ? modal_data.name : "",
      name_kana: modal_data !== null ? modal_data.name_kana : "",
      name_short: modal_data !== null ? modal_data.name_short : "",
      unit: modal_data !== null ? modal_data.unit : "",
      data_type:
        modal_data !== null
          ? this.props.data_type_name.indexOf(modal_data.data_type)
          : 2,
      before_or_after_enabled:
        modal_data !== null ? modal_data.before_or_after_enabled : 0,
      reference_value_male_min:
        modal_data !== null ? modal_data.reference_value_male_min : "",
      reference_value_male_max:
        modal_data !== null ? modal_data.reference_value_male_max : "",
      reference_value_male:
        modal_data !== null ? modal_data.reference_value_male : "",
      reference_value_female_min:
        modal_data !== null ? modal_data.reference_value_female_min : "",
      reference_value_female_max:
        modal_data !== null ? modal_data.reference_value_female_max : "",
      reference_value_female:
        modal_data !== null ? modal_data.reference_value_female : "",
      isBackConfirmModal: false,
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
    masterValidate("dial_examination_master", this.state, 'background');
  };

  checkValidation = () => {
    removeRedBorder("code_id");
    removeRedBorder("name_id");
    removeRedBorder("name_kana_id");
    removeRedBorder("company_examination_code_id");
    removeRedBorder("name_short_id");
    removeRedBorder("unit_id");
    removeRedBorder("reference_value_male_min_id");
    removeRedBorder("reference_value_male_max_id");
    removeRedBorder("reference_value_male_id");
    removeRedBorder("reference_value_female_min_id");
    removeRedBorder("reference_value_female_ax_id");
    removeRedBorder("reference_value_female_id");
    let error_str_arr = [];
    let validate_data = masterValidate("dial_examination_master", this.state);

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
    if (name == "alwaysShow") {
      this.setState({ is_enabled: value });
    }
  };
  getInspectionCode = (e) => {
    this.setState({ code: e.target.value });
  };
  getCompanyCode = (e) => {
    this.setState({ company_examination_code: e.target.value });
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
  getUnit = (e) => {
    this.setState({ unit: e.target.value });
  };
  getDataType = (e) => {
    this.setState({ data_type: e.target.value });
  };
  getBeforeAfterEnabled = (e) => {
    this.setState({ before_or_after_enabled: e.target.value });
  };

  getMaleMax = (e) => {
    this.setState({ reference_value_male_max: e.target.value });
  };

  getMaleMin = (e) => {
    this.setState({ reference_value_male_min: e.target.value });
  };

  getMale = (e) => {
    this.setState({ reference_value_male: e.target.value });
  };

  getFemaleMax = (e) => {
    this.setState({ reference_value_female_max: e.target.value });
  };

  getFemaleMin = (e) => {
    this.setState({ reference_value_female_min: e.target.value });
  };

  getFemale = (e) => {
    this.setState({ reference_value_female: e.target.value });
  };

  async registerInspection() {
    let path = "/app/api/v2/dial/master/inspection_register";
    const post_data = {
      params: this.state,
    };
    post_data.params.data_type = this.props.data_type_name[
      this.state.data_type
    ];
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
        this.confirmCancel();
        // this.props.handleOk();
      });
  }

  // checkValidation = () => {
  //   let error_str = "";
  //   let master_validate = getMasterValidate();
  //   let validate_data = master_validate.dial_examination_master;
  //   if (this.state.code == null || this.state.code === "") {
  //     error_str = "検査項目コードを入力してください。";
  //   } else if (this.state.name == null || this.state.name === "") {
  //     error_str = "表示名称を入力してください。";
  //   } else if (
  //     this.state.code != null &&
  //     this.state.code != "" &&
  //     this.state.code.length > validate_data.code.length
  //   ) {
  //     error_str =
  //       "検査項目コードを" +
  //       validate_data.code.length +
  //       "文字以下で入力してください。";
  //   } else if (
  //     this.state.company_examination_code != null &&
  //     this.state.company_examination_code != "" &&
  //     this.state.company_examination_code.length >
  //       validate_data.company_examination_code.length
  //   ) {
  //     error_str =
  //       "検査会社コードを" +
  //       validate_data.company_examination_code.length +
  //       "文字以下で入力してください。";
  //   } else if (
  //     this.state.name != null &&
  //     this.state.name != "" &&
  //     this.state.name.length > validate_data.name.length
  //   ) {
  //     error_str =
  //       "検査名称を" +
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

  saveInspection = () => {
    var error = this.checkValidation();

    if (error.length > 0) {
      this.setState({ alert_message: error.join("\n") });
      return;
    }

    if (this.props.modal_data !== null) {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "検査項目マスタ情報を変更しますか?",
      });
    } else {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "検査項目マスタ情報を登録しますか?",
      });
    }
  };

  register = () => {
    this.registerInspection().then(() => {
      this.confirmCancel();
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
    // let error_str = this.checkValidation();

    return (
      <Modal
        show={true}
        onHide={this.onHide}
        id="add_contact_dlg"
        className="master-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>検査編集画面</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="checkbox_area">
              <Checkbox
                label="常に表示"
                getRadio={this.getAlwaysShow.bind(this)}
                value={this.state.is_enabled}
                checked
                name="alwaysShow"
              />
            </div>
            <div className="pattern_code">
              <InputWithLabelBorder
                label="検査項目コード"
                type="text"
                getInputText={this.getInspectionCode.bind(this)}
                diseaseEditData={this.state.code}
                id="code_id"
              />
              <InputWithLabelBorder
                label="検査会社コード"
                type="text"
                getInputText={this.getCompanyCode.bind(this)}
                diseaseEditData={this.state.company_examination_code}
                id="company_examination_code_id"
              />
              {/* <Button type="mono">検索</Button> */}
            </div>
            <InputWithLabelBorder
              label="検査名称"
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
              label="単位"
              type="text"
              getInputText={this.getUnit.bind(this)}
              diseaseEditData={this.state.unit}
              id="unit_id"
            />
            <div className="gender">
              <label className="mr-2 gender-label">データ区分</label>
              <RadioButton
                id="male1"
                value={0}
                label="数値"
                name="gender"
                getUsage={this.getDataType}
                checked={this.state.data_type == 0 ? true : false}
              />
              <RadioButton
                id="femaie1"
                value={1}
                label="文字"
                name="gender"
                getUsage={this.getDataType}
                checked={this.state.data_type == 1 ? true : false}
              />
            </div>
            <div className="gender">
              <label className="mr-2 gender-label">前後区分</label>
              <RadioButton
                id="male2"
                value={0}
                label="なし"
                name="gender1"
                getUsage={this.getBeforeAfterEnabled}
                checked={this.state.before_or_after_enabled == 0 ? true : false}
              />
              <RadioButton
                id="femaie2"
                value={1}
                label="あり"
                name="gender1"
                getUsage={this.getBeforeAfterEnabled}
                checked={this.state.before_or_after_enabled == 1 ? true : false}
              />
            </div>
            {/* <div className="gender">
                  <label className="mr-2 gender-label">小数点位置</label>
                  <RadioButton
                      id="male3"
                      value={0}
                      label="なし"
                      name="gender2"
                      // getUsage={this.selectMedicineType}
                      // checked={this.state.medicine_type == 0 ? true : false}
                  />
                  <RadioButton
                      id="femaie3"
                      value={1}
                      label="第1位"
                      name="gender2"
                      // getUsage={this.selectMedicineType}
                      // checked={this.state.medicine_type == 1 ? true : false}
                  /><RadioButton
                      id="femaie4"
                      value={2}
                      label="第2位"
                      name="gender2"
                      // getUsage={this.selectMedicineType}
                      // checked={this.state.medicine_type == 1 ? true : false}
                  /><RadioButton
                      id="femaie5"
                      value={3}
                      label="第3位"
                      name="gender2"
                      // getUsage={this.selectMedicineType}
                      // checked={this.state.medicine_type == 1 ? true : false}
                  /><RadioButton
                      id="femaie6"
                      value={4}
                      label="第4位"
                      name="gender2"
                      // getUsage={this.selectMedicineType}
                      // checked={this.state.medicine_type == 1 ? true : false}
                  /><RadioButton
                      id="femaie7"
                      value={5}
                      label="第5位"
                      name="gender2"
                      // getUsage={this.selectMedicineType}
                      // checked={this.state.medicine_type == 1 ? true : false}
                  />
                </div> */}
            <div className="normal-value-arange">
              <div
                style={{
                  lineHeight: "38px",
                  width: "120px",
                  textAlign: "right",
                  marginTop: "4px",
                }}
              >
                正常値範囲
              </div>
              <div className="value-arange-content">
                <div className={"man-box"}>男性</div>
                <div className="arrange-value flex">
                  <InputWithLabelBorder
                    label="下限値"
                    type="text"
                    getInputText={this.getMaleMin.bind(this)}
                    diseaseEditData={this.state.reference_value_male_min}
                    id="reference_value_male_min_id"
                  />
                  <InputWithLabelBorder
                    label="上限値"
                    type="text"
                    getInputText={this.getMaleMax.bind(this)}
                    diseaseEditData={this.state.reference_value_male_max}
                    id="reference_value_male_max_id"
                  />
                  <InputWithLabelBorder
                    label="標準値"
                    type="text"
                    getInputText={this.getMale.bind(this)}
                    diseaseEditData={this.state.reference_value_male}
                    id="reference_value_male_id"
                  />
                </div>
              </div>
            </div>
            <div className="normal-value-arange">
              <label></label>
              <div className="value-arange-content">
                <div className={"woman-box"}>女性</div>
                <div className="arrange-value flex">
                  <InputWithLabelBorder
                    label="下限値"
                    type="text"
                    getInputText={this.getFemaleMin.bind(this)}
                    diseaseEditData={this.state.reference_value_female_min}
                    id="reference_value_female_min_id"
                  />
                  <InputWithLabelBorder
                    label="上限値"
                    type="text"
                    getInputText={this.getFemaleMax.bind(this)}
                    diseaseEditData={this.state.reference_value_female_max}
                    id="reference_value_female_max_id"
                  />
                  <InputWithLabelBorder
                    label="標準値"
                    type="text"
                    getInputText={this.getFemale.bind(this)}
                    diseaseEditData={this.state.reference_value_female}
                    id="reference_value_female_id"
                  />
                </div>
              </div>
            </div>
            <div className="footer footer-buttons">
              <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
                <Button
                  onClick={this.saveInspection}
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

InspctionModal.contextType = Context;

InspctionModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  data_type_name: PropTypes.array,
  modal_data: PropTypes.object,
};

export default InspctionModal;
