import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import Checkbox from "~/components/molecules/Checkbox";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import RadioGroupButton from "~/components/molecules/RadioGroup";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import { masterValidate } from "~/helpers/validate";
import {removeRedBorder} from "~/helpers/dialConstants";
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
    margin-top: 5px;
  }
  input {
    width: 400px;
    font-size: 18px;
  }
  .checkbox-label {
    width: 30%;
    text-align: left;
  }
  .add-button {
    text-align: center;
    .first {
      margin-left: -30px;
    }
  }
  .checkbox_area {
    padding-left: 30px;
    label {
      font-size: 15px;
      margin-left: 120px;
    }
  }
  .pattern_code {
    display: flex;
    flex-wrap: wrap;
    padding-top: 10px;
    input {
      font-size: 18px;
      width: 155px;
    }
    label {
      width: 150px;
    }
    .label-title {
      font-size: 18px;
      margin-top: 6px;
    }
    .label-unit {
      width: 0;
      margin-left: 0;
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
  .pullbox-title {
    font-size: 18px;
    text-align: right;
    margin-right: 8px;
  }
  .pullbox-label,
  .pullbox-select {
    width: 400px;
  }
  .footer {
    display: flex;
    margin-left: 24%;
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
  .unit-padding {
    padding: 15px 0 0 5px;
  }
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .radio-group-btn label {
    font-size: 18px;
    border: solid 1px rgb(206, 212, 218);
    border-radius: 4px;
    margin-right: 5px;
    text-align: center !important;
    margin-bottom: 0;
  }
  .internal_medicine {
    display: flex;
    width: 100%;
    .internal_medicine-label {
      text-align: right;
      margin-top: 10px;
      margin-right: 8px;
      width: 150px;
      float: left;
      font-size: 18px;
      margin-bottom: 0;
    }
    .radio-group-btn label {
      width: 50px;
      padding: 5px 0px 2px 0px;
    }
    .radio-group-btn:last-child {
      label {
        width: 95px;
      }
    }
  }
  .dial_timing {
    display: flex;
    width: 100%;
    .dial_timing-label {
      text-align: right;
      margin-top: 10px;
      margin-right: 8px;
      width: 150px;
      float: left;
      font-size: 18px;
      margin-bottom: 0;
    }
    .radio-group-btn label {
      width: 105px;
      padding: 5px 0px 2px 0px;
    }
  }
`;

const dial_timings = [
  "なし",
  "透析開始前",
  "透析開始後",
  "透析終了前",
  "透析終了後",
];

class UsageModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    let check_in_dialysis = {
      0: false,
      1: false,
      2: false,
      3: false,
      4: false,
    };
    if (
      modal_data != null &&
      modal_data.in_dialysis &&
      parseInt(modal_data.in_dialysis) !== 0
    ) {
      if (parseInt(modal_data.in_dialysis) === 1) {
        check_in_dialysis[0] = true;
      } else {
        for (var i = 1; i < 5; i++) {
          var pval = Math.pow(2, i);
          if ((modal_data.in_dialysis & pval) > 0) {
            check_in_dialysis[i] = true;
          } else {
            check_in_dialysis[i] = false;
          }
        }
      }
    }
    let internal_medicines = [
      "内服",
      "頓服",
      "外用",
      "処置",
      "麻酔",
      "インスリン",
    ];
    this.state = {
      is_enabled: modal_data !== null ? modal_data.is_enabled : 1,
      number: modal_data !== null ? modal_data.number : 0,
      code: modal_data !== null ? modal_data.code : "",
      name: modal_data !== null ? modal_data.name : "",
      name_kana: modal_data !== null ? modal_data.name_kana : "",
      name_short: modal_data !== null ? modal_data.name_short : "",
      count: modal_data !== null ? modal_data.count : "",
      category: modal_data !== null ? modal_data.category : "",
      usage_group_code: modal_data !== null ? modal_data.usage_group_code : "",
      in_dialysis:
        modal_data != null && modal_data.in_dialysis != null
          ? modal_data.in_dialysis
          : 0,
      sort_number:
        modal_data != null && modal_data.sort_number != null
          ? modal_data.sort_number
          : 0,
      table_kind: 5,
      isUpdateConfirmModal: false,
      isCloseConfirmModal: false,
      confirm_message: "",
      check_in_dialysis,
      internal_medicines,
      confirm_alert_title: "",
      alert_message: "",
      alert_messages: "",
      alert_messages_title: "",
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
      "dial_medicine_usage_master",
      this.state,
      'background'
    );
  };
  //--------------------------------------
  //check validation of parameter
  checkValidation = () => {
    removeRedBorder("name_id");
    removeRedBorder("code_id");
    removeRedBorder("name_kana_id");
    removeRedBorder("name_short_id");
    let error_str_arr = [];
    let validate_data = masterValidate(
      "dial_medicine_usage_master",
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
  //----------------------------

  //set focus on first error tag  when close the error alert modal
  closeAlertModal = () => {
    this.setState({ alert_message: "" });
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null) {
      $("#" + first_tag_id).focus();
    }
  };
  
  closeAlert = () => {
    let {alert_action} = this.state;
    this.setState({
      alert_messages: "",
      alert_title: "",
      alert_action: ""
    });
    if (alert_action === "continue") {
      this.setState(
        {
          number: 0,
          code: "",
          name: "",
          name_kana: "",
          name_short: "",
          count: "",
          category: "",
          in_dialysis: 0,
          sort_number: 0,
          check_in_dialysis: {
            0: false,
            1: false,
            2: false,
            3: false,
            4: false,
          },
          check_enable_medicines: {
            0: false,
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
          },
          modal_data: null,
        },
        () => {
          this.original = JSON.stringify(this.state);
        }
      );
    } else {
      this.props.handleOk(this.state);
    }
  }

  getAlwaysShow = (name, value) => {
    if (name === "alwaysShow") this.setState({ is_enabled: value });
  };
  getPatternCode = (e) => {
    this.setState({ code: e.target.value });
  };
  getPatternName = (e) => {
    this.setState({ name: e.target.value });
  };
  getPatternKana = (e) => {
    this.setState({ name_kana: e.target.value });
  };
  getPatternShort = (e) => {
    this.setState({ name_short: e.target.value });
  };
  getCount = (e) => {
    this.setState({
      count: e.target.value !== "" ? parseInt(e.target.value) : e.target.value,
    });
  };

  async register(alert_action = "close") {
    let path = "/app/api/v2/dial/master/dial_method_register";
    const post_data = {
      params: this.state,
    };
    if (this.double_click == true) return;
    this.double_click = true;
    await apiClient
      .post(path, post_data)
      .then((res) => {
        if (res) if (res) var title = "";
        var message = res.alert_message;
        if (message.indexOf("変更") > -1) title = "変更完了";
        if (message.indexOf("登録") > -1) title = "登録完了";
        this.setState({
          alert_messages: res.alert_message,
          alert_title: title,
          alert_action: alert_action,
        });
      })
      .finally(() => {
        this.double_click = false;
        this.confirmCancel();
      });
  }
  handleOk = () => {
    if (this.change_flag == false) return;
    var error = this.checkValidation();

    if (error.length > 0) {
      this.setState({ alert_message: error.join("\n") });
      return;
    }
    // let master_validate = getMasterValidate();
    // let validate_data = master_validate.dial_medicine_usage_master;
    // if (
    //   this.state.code != null &&
    //   this.state.code != "" &&
    //   this.state.code.length > validate_data.code.length
    // ) {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "コードを" + validate_data.code.length + "文字以下で入力してください。"
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
    //     "表示名称を" +
    //       validate_data.name.length +
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
    // if (this.state.code === "") {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "服用コードを入力してください。"
    //   );
    //   return;
    // }
    // if (this.state.name === "") {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "表示名称を入力してください。"
    //   );
    //   return;
    // }
    // if (this.state.count !== "" && isNaN(parseFloat(this.state.count))) {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "服用回数を数字で入力してください。"
    //   );
    //   return;
    // }
    if (this.props.modal_data !== null) {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "服用情報を変更しますか?",
      });
    } else {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "服用情報を登録しますか?",
      });
    }
  };

  registerData = (act = null) => {
    this.change_flag = false;
    this.register(act);
  };

  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isCloseConfirmModal: false,
      confirm_message: "",
      confirm_alert_title: "",
      confirm_type: "",
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

  confirmOk = () => {
    if (this.state.confirm_type === "continue") {
      this.registerData("continue");
    } else {
      this.registerData();
    }
  };

  continueRegister = () => {
    if (this.change_flag == false) return;
    var error = this.checkValidation();

    if (error.length > 0) {
      this.setState({ alert_message: error.join("\n") });
      return;
    }
    // if (this.state.code === "") {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "服用コードを入力してください。"
    //   );
    //   return;
    // }
    // if (this.state.name === "") {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "表示名称を入力してください。"
    //   );
    //   return;
    // }
    // if (
    //   this.state.count != null &&
    //   this.state.count !== "" &&
    //   isNaN(parseFloat(this.state.count))
    // ) {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "服用回数を数字で入力してください。"
    //   );
    //   return;
    // }
    if (this.props.modal_data !== null) {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "服用情報を変更しますか?",
        confirm_type: "continue",
      });
      return;
    } else {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "服用情報を登録しますか?",
        confirm_type: "continue",
      });
      return;
    }
  };

  SetImplementationMonth = (e) => {
    let category = this.state.category;
    if (category.includes(e.target.value)) {
      if (category.includes(e.target.value + ",")) {
        category = category.replace(e.target.value + ",", "");
      } else {
        category = category.replace(e.target.value, "");
      }
    } else {
      if (category === "") {
        category = e.target.value;
      } else {
        category = category + "," + e.target.value;
      }
    }
    this.setState({ category });
  };

  SetInDialysis = (value) => {
    let check_in_dialysis = this.state.check_in_dialysis;
    var in_dialysis = parseInt(this.state.in_dialysis);
    if (value !== 0 && check_in_dialysis[0] === true) {
      check_in_dialysis[0] = false;
      in_dialysis--;
    }
    if (value === 0) {
      in_dialysis = 1;
      check_in_dialysis = { 0: true, 1: false, 2: false, 3: false, 4: false };
    } else {
      check_in_dialysis[value] = check_in_dialysis[value] ? false : true;
      var pval = Math.pow(2, value);
      in_dialysis =
        (in_dialysis & pval) > 0 ? in_dialysis - pval : in_dialysis + pval;
    }
    this.setState({ in_dialysis, check_in_dialysis });
  };

  getSortNumber = (e) => {
    if (parseFloat(e) < 0) e = 0;
    this.setState({ sort_number: e });
  };

  onHide = () => {};

  selectGroup = (e) => {
    this.setState({
      usage_group_code: e.target.id,
    });
  };

  render() {
    if (this.original != JSON.stringify(this.state)) {
      this.change_flag = true;
    } else {
      this.change_flag = false;
    }

    let { usage_group } = this.props;
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        id="add_contact_dlg"
        className="master-modal first-view-modal material-modal usage-add-modal"
      >
        <Modal.Header>
          <Modal.Title>服用編集</Modal.Title>
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
                label="服用コード"
                type="text"
                getInputText={this.getPatternCode.bind(this)}
                diseaseEditData={this.state.code}
                id="code_id"
              />
              <NumericInputWithUnitLabel
                label={"表示順"}
                className="form-control"
                value={this.state.sort_number}
                getInputText={this.getSortNumber.bind(this)}
                inputmode="numeric"
              />
            </div>
            <InputWithLabelBorder
              label="表示名称"
              type="text"
              className="name-area"
              getInputText={this.getPatternName.bind(this)}
              diseaseEditData={this.state.name}
              id="name_id"
            />
            <InputWithLabelBorder
              label="カナ名称"
              type="text"
              className="name-area"
              getInputText={this.getPatternKana.bind(this)}
              diseaseEditData={this.state.name_kana}
              id="name_kana_id"
            />
            <InputWithLabelBorder
              label="略称"
              type="text"
              className="kana_area"
              getInputText={this.getPatternShort.bind(this)}
              diseaseEditData={this.state.name_short}
              id="name_short_id"
            />
            <div className="flex">
              <InputWithLabelBorder
                label="服用回数"
                type="text"
                getInputText={this.getCount.bind(this)}
                diseaseEditData={
                  isNaN(this.state.count) ? "" : this.state.count
                }
              />
              <div className="unit-padding">回</div>
            </div>
            <div className="search-box d-flex usage-group-select">
              {usage_group != undefined && (
                <SelectorWithLabel
                  options={usage_group}
                  title="服用グループ"
                  getSelect={this.selectGroup}
                  departmentEditCode={this.state.usage_group_code}
                  className="usage-group-select"
                />
              )}
            </div>
            <div className="internal_medicine">
              <label className="internal_medicine-label">処方区分</label>
              <>
                {this.state.internal_medicines.map((item, key) => {
                  return (
                    <>
                      <RadioGroupButton
                        id={`internal_medicine${key}`}
                        value={item}
                        label={item}
                        name="internal_medicine"
                        getUsage={this.SetImplementationMonth.bind(this)}
                        checked={
                          this.state.category.includes(item) === true
                            ? true
                            : false
                        }
                      />
                    </>
                  );
                })}
              </>
            </div>
            <div className="dial_timing">
              <label className="dial_timing-label">透析中タイミング</label>
              <>
                {dial_timings.map((item, key) => {
                  return (
                    <>
                      <RadioGroupButton
                        id={`dial_timing${key}`}
                        value={key}
                        label={item}
                        name="dial_timing"
                        getUsage={this.SetInDialysis.bind(this, key)}
                        checked={this.state.check_in_dialysis[key]}
                      />
                    </>
                  );
                })}
              </>
            </div>
            <div className="footer-buttons mt-3">
              <Button className="cancel-btn" onClick={this.close}>キャンセル</Button>
                <Button
                  className={this.change_flag ? "red-btn" : "disable-btn"}
                  onClick={this.handleOk}
                >
                  {this.props.modal_data !== null ? "変更" : "登録"}
                </Button>
                <Button
                  className={this.change_flag ? "red-btn" : "disable-btn"}
                  onClick={this.continueRegister}
                >
                  続けて登録
                </Button>
            </div>
          </Wrapper>
          {this.state.isUpdateConfirmModal !== false && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.confirmOk.bind(this)}
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
          {this.state.alert_messages != '' && (
            <SystemAlertModal
              hideModal= {this.closeAlert}
              handleOk= {this.closeAlert}
              title = {this.state.alert_title}
              showTitle = {true}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
        </Modal.Body>
      </Modal>
    );
  }
}

UsageModal.contextType = Context;

UsageModal.propTypes = {
  modal_data: PropTypes.object,
  usage_group: PropTypes.array,
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  continueRegister: PropTypes.func,
};

export default UsageModal;
