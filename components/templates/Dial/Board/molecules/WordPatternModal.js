import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Checkbox from "~/components/molecules/Checkbox";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import { Col } from "react-bootstrap";
import RadioGroupButton from "~/components/molecules/RadioGroup";
import * as apiClient from "~/api/apiClient";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import { masterValidate } from "~/helpers/validate";
import {removeRedBorder} from "~/helpers/dialConstants";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from "jquery";

const Wrapper = styled.div`
  display: block;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  label {
    text-align: right;
    width: 90px;
    font-size: 14px;
  }
  input {
    width: 480px;
    font-size: 13px;
  }
  .select-area {
    display: flex;
    margin-top: 8px;
  }
  .select-area .label {
    border-radius: none;
  }
  .select-area .radio-btn {
    margin-left: 5px;
  }
  .radio-group-btn {
    margin-left: 5px;
  }
  .radio-btn label {
    width: 75px;
    border-radius: 0;
    border: solid 1px #ddd;
  }
  .radio-group-btn label {
    width: 95px;
    border-radius: 4px;
    border: solid 1px #ddd;
    font-size: 15px;
  }

  .checkbox_area {
    display: flex;
    margin-left: 65px;
    padding-left: 15px;
    .ixnvCM {
      margin-right: 150px;
      font-size: 17px;
      padding-top: 6px;
    }
    .dZZuAe {
      margin: 0px;
    }
    .label-title {
      padding-top: 5px;
      font-size: 16px;
    }
  }
  .checkbox-label {
    width: auto;
    text-align: left;
  }
  .checkbox_area label {
    width: auto;
  }
`;

class WordPatternModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    let checkPages = {
      "処置モニタ/S": false,
      "処置モニタ/O": false,
      "処置モニタ/A": false,
      "処置モニタ/P": false,
      "処置モニタ/指示": false,
      "Drカルテ/経過": false,
      "Drカルテ/所見": false,
      "Drカルテ/管理料": false,
      "申し送り/当日のみ": false,
      "申し送り/継続": false,
      "VA管理/当日のみ": false,
      "VA管理/継続": false,
      "処方/RPコメント": false,
    };
    let name = "";
    let name_kana = "";

    if (modal_data != null) {
      if (this.props.isPatternModal) {
        name = modal_data.name;
        name_kana = modal_data.name_kana;
        Object.keys(checkPages).map((key) => {
          if (
            modal_data.usages != undefined &&
            modal_data.usages != null &&
            modal_data.usages.indexOf(key) > -1
          )
            checkPages[key] = true;
        });
      } else {
        name = modal_data.word;
        name_kana = modal_data.word_kana;
      }
    }
    this.state = {
      usage_pages: modal_data != null ? modal_data.usages : [],
      number: modal_data != null ? modal_data.number : 0,
      name,
      name_kana,
      is_enabled: modal_data != null ? modal_data.is_enabled : 1,
      order: modal_data != null ? modal_data.order : 0,
      is_private: 0,
      checkPages,
      pattern_number: this.props.pattern_number,
      isPattern: this.props.isPatternModal,
      isOpenConfirmModal: false,
      isUpdateConfirmModal: false,
      confirm_message: "",
      change_flag: 0,
      confirm_alert_title: "",
      alert_message: "",
    };
  }

  componentDidMount() {
    this.setChangeFlag(0);
    this.changeBackground();
  }

  componentDidUpdate() {
    this.changeBackground();
  }
  
  componentWillUnmount() {
    // sessApi.delObjectValue('dial_change_flag', 'word_pattern');
    sessApi.remove("dial_change_flag");
  }

  changeBackground = () => {
    if (this.state.isPattern == true) {
      masterValidate("dial_word_pattern", this.state, 'background');
    } else {
      masterValidate("dial_word", this.state, 'background');
    }
  };

  checkValidation = () => {
    removeRedBorder("name_id");
    removeRedBorder("name_kana_id");
    let error_str_arr = [];
    let validate_data = {};
    if (this.state.isPattern == true) {
      validate_data = masterValidate("dial_word_pattern", this.state);
    } else {
      validate_data = masterValidate("dial_word", this.state);
    }

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

  setChangeFlag = (change_flag) => {
    this.setState({ change_flag });
    if (change_flag) {
      sessApi.setObjectValue("dial_change_flag", "word_pattern", 1);
    } else {
      sessApi.remove("dial_change_flag");
    }
  };

  getAlwaysShow = (name, value) => {
    this.setChangeFlag(1);
    if (name === "contract_alwaysShow") {
      this.setState({ is_enabled: value });
    }
  };

  selectUsagePage = (e) => {
    this.setChangeFlag(1);
    var pages = this.state.usage_pages;
    var checkPages = this.state.checkPages;
    var checked_value = e.target.value;
    checkPages[checked_value] = !checkPages[checked_value];

    if (e.target.checked) {
      pages.push(checked_value);
    } else {
      var index = pages.indexOf(checked_value);
      if (index > -1) pages.splice(index, 1);
    }
    this.setState({
      usage_pages: pages,
      checkPages,
    });
  };

  getName = (e) => {
    this.setChangeFlag(1);
    this.setState({ name: e.target.value });
  };

  getKanaName = (e) => {
    this.setChangeFlag(1);
    this.setState({ name_kana: e.target.value });
  };

  getOrder = (e) => {
    this.setChangeFlag(1);
    if (parseFloat(e) < 0) e = 0;
    this.setState({ order: parseInt(e) });
  };

  saveWord = async () => {
    // let master_validate = getMasterValidate();
    // let validate_data = master_validate.dial_word;
    // if (this.props.isPatternModal) {
    //   validate_data = master_validate.dial_word_pattern;
    //   if (
    //     this.state.name != null &&
    //     this.state.name != "" &&
    //     this.state.name.length > validate_data.name.length
    //   ) {
    //     window.sessionStorage.setItem(
    //       "alert_messages",
    //       "名称を" + validate_data.name.length + "文字以下で入力してください。"
    //     );
    //     return;
    //   }
    //   if (
    //     this.state.name_kana != null &&
    //     this.state.name_kana != "" &&
    //     this.state.name_kana.length > validate_data.name_kana.length
    //   ) {
    //     window.sessionStorage.setItem(
    //       "alert_messages",
    //       "カナ名称を" +
    //         validate_data.name_kana.length +
    //         "文字以下で入力してください。"
    //     );
    //     return;
    //   }
    // } else {
    //   if (
    //     this.state.name != null &&
    //     this.state.name != "" &&
    //     this.state.name.length > validate_data.word.length
    //   ) {
    //     window.sessionStorage.setItem(
    //       "alert_messages",
    //       "名称を" + validate_data.word.length + "文字以下で入力してください。"
    //     );
    //     return;
    //   }
    //   if (
    //     this.state.name_kana != null &&
    //     this.state.name_kana != "" &&
    //     this.state.name_kana.length > validate_data.word_kana.length
    //   ) {
    //     window.sessionStorage.setItem(
    //       "alert_messages",
    //       "カナ名称を" +
    //         validate_data.word_kana.length +
    //         "文字以下で入力してください。"
    //     );
    //     return;
    //   }
    // }
    // if (this.state.name === "") {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "名称を入力してください。"
    //   );
    //   return;
    // }
    var error = this.checkValidation();

    if (error.length > 0) {
      this.setState({ alert_message: error.join("\n") });
      return;
    }
    let str_msg = this.state.number == 0 ? "登録" : "変更";
    this.setState({
      isUpdateConfirmModal: true,
      confirm_message: str_msg + "しますか？",
    });
  };

  handleSaveWord = async () => {
    let path = "/app/api/v2/dial/board/registerWord";
    await apiClient
      ._post(path, {
        params: this.state,
      })
      .then((res) => {
        var title = "";
        var message = res.alert_message;
        if (message.indexOf("変更") > -1) title = "変更完了##";
        if (message.indexOf("登録") > -1) title = "登録完了##";
        window.sessionStorage.setItem(
          "alert_messages",
          title + res.alert_message
        );
        this.props.handleOk();
      })
      .catch(() => {});
  };

  handleClose = () => {
    if (this.state.change_flag == 1) {
      this.setState({
        isOpenConfirmModal: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して閉じますか？",
        confirm_alert_title: "入力中",
      });
      return;
    }
    this.props.closeModal();
  };

  confirmCancel = () => {
    this.setState({
      isOpenConfirmModal: false,
      isUpdateConfirmModal: false,
      confirm_message: "",
      confirm_alert_title: "",
    });
  };

  confirmCloseOk = () => {
    this.setState({
      isOpenConfirmModal: false,
      confirm_message: "",
      confirm_alert_title: "",
    },() => {
      this.props.closeModal();
    });
  };
  
  render() {
    return (
      <Modal show={true} className="wordPattern-modal master-modal first-view-modal">
        <Modal.Header>
          <Modal.Title>
            {this.props.isPatternModal ? "単語パターン 追加" : "単語 追加"}{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <Col className="">
              <div className="checkbox_area">
                <Checkbox
                  label="常に表示"
                  getRadio={this.getAlwaysShow.bind(this)}
                  value={this.state.is_enabled}
                  checked
                  name="contract_alwaysShow"
                />
                <NumericInputWithUnitLabel
                  label="表示順"
                  value={this.state.order}
                  getInputText={this.getOrder.bind(this)}
                  inputmode="numeric"
                />
              </div>
              <InputWithLabelBorder
                label="名称"
                type="text"
                placeholder=""
                getInputText={this.getName.bind(this)}
                diseaseEditData={this.state.name}
                id="name_id"
              />
              <InputWithLabelBorder
                label="カナ名称"
                type="text"
                placeholder=""
                getInputText={this.getKanaName.bind(this)}
                diseaseEditData={this.state.name_kana}
                id="name_kana_id"
              />
              {this.props.isPatternModal && (
                <>
                  <div className="dummy_2 select-area">
                    <label className="label">処置モニタ</label>
                    <RadioGroupButton
                      id="one"
                      value="処置モニタ/S"
                      label="S)訴え"
                      name="ダミー_2"
                      getUsage={this.selectUsagePage}
                      checked={this.state.checkPages["処置モニタ/S"]}
                    />
                    <RadioGroupButton
                      id="two"
                      value="処置モニタ/O"
                      label="O)所見"
                      name="ダミー_2"
                      getUsage={this.selectUsagePage}
                      checked={this.state.checkPages["処置モニタ/O"]}
                    />
                    <RadioGroupButton
                      id="three"
                      value="処置モニタ/A"
                      label="A)問題点"
                      name="ダミー_2"
                      getUsage={this.selectUsagePage}
                      checked={this.state.checkPages["処置モニタ/A"]}
                    />
                    <RadioGroupButton
                      id="four"
                      value="処置モニタ/P"
                      label="P)今後の対応"
                      name="ダミー_2"
                      getUsage={this.selectUsagePage}
                      checked={this.state.checkPages["処置モニタ/P"]}
                    />
                    <RadioGroupButton
                      id="five"
                      value="処置モニタ/指示"
                      label="指示"
                      name="ダミー_2"
                      getUsage={this.selectUsagePage}
                      checked={this.state.checkPages["処置モニタ/指示"]}
                    />
                  </div>
                  <div className="dummy select-area">
                    <label className="label">Drカルテ</label>
                    <RadioGroupButton
                      id="once_month"
                      value="Drカルテ/経過"
                      label="経過"
                      name="kind"
                      getUsage={this.selectUsagePage}
                      checked={this.state.checkPages["Drカルテ/経過"]}
                    />
                    <RadioGroupButton
                      id="onetwo_month"
                      value="Drカルテ/所見"
                      label="所 見"
                      name="kind"
                      getUsage={this.selectUsagePage}
                      checked={this.state.checkPages["Drカルテ/所見"]}
                    />
                    <RadioGroupButton
                      id="ダミー"
                      value="Drカルテ/管理料"
                      label="管理料"
                      name="kind"
                      getUsage={this.selectUsagePage}
                      checked={this.state.checkPages["Drカルテ/管理料"]}
                    />
                  </div>
                  <div className="commnet select-area">
                    <label className="label">申し送り</label>
                    <RadioGroupButton
                      id="required"
                      value="申し送り/当日のみ"
                      label="当日のみ"
                      name="commnet"
                      getUsage={this.selectUsagePage}
                      checked={this.state.checkPages["申し送り/当日のみ"]}
                    />
                    <RadioGroupButton
                      id="non-required"
                      value="申し送り/継続"
                      label="継 続"
                      name="commnet"
                      getUsage={this.selectUsagePage}
                      checked={this.state.checkPages["申し送り/継続"]}
                    />
                  </div>
                  <div className="kind select-area">
                    <label className="label">VA管理</label>
                    <RadioGroupButton
                      id="auto"
                      value="VA管理/当日のみ"
                      label="当日のみ"
                      name="kind"
                      getUsage={this.selectUsagePage}
                      checked={this.state.checkPages["VA管理/当日のみ"]}
                    />
                    <RadioGroupButton
                      id="manual"
                      value="VA管理/継続"
                      label="継 続"
                      name="kind"
                      getUsage={this.selectUsagePage}
                      checked={this.state.checkPages["VA管理/継続"]}
                    />
                  </div>
                  <div className="kind select-area">
                    <label className="label">RPコメント</label>
                    <RadioGroupButton
                      id="prescription_rp"
                      value="処方/RPコメント"
                      label="RPコメント"
                      name="kind"
                      getUsage={this.selectUsagePage}
                      checked={this.state.checkPages["処方/RPコメント"]}
                    />
                  </div>
                </>
              )}
            </Col>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <div onClick={this.handleClose.bind(this)} className={"custom-modal-btn cancel-btn"} style={{cursor:"pointer"}} id='cancel_btn'>
            <span>キャンセル</span>
          </div>
          <div onClick={this.saveWord.bind(this)} className={"custom-modal-btn " + (this.state.change_flag == 0 ? "disable-btn" : "red-btn")} style={{cursor:"pointer"}}>
            <span>{this.state.number == 0 ? "登録" : "変更"}</span>
          </div>
        </Modal.Footer>
        {this.state.isOpenConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.confirmCloseOk}
            confirmTitle={this.state.confirm_message}
            title={this.state.confirm_alert_title}
          />
        )}
        {this.state.isUpdateConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.handleSaveWord}
            confirmTitle={this.state.confirm_message}
          />
        )}
        {this.state.alert_message !== "" && (
          <ValidateAlertModal
            handleOk={this.closeAlertModal}
            alert_meassage={this.state.alert_message}
          />
        )}
      </Modal>
    );
  }
}

WordPatternModal.contextType = Context;
WordPatternModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  isPatternModal: PropTypes.bool,
  modal_data: PropTypes.object,
  pattern_number: PropTypes.number,
};
export default WordPatternModal;
