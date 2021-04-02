import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import RadioButton from "~/components/molecules/RadioInlineButton";
import * as sessApi from "~/helpers/cacheSession-utils";
import { makeList_code } from "~/helpers/dialConstants";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import { medicalInformationValidate } from '~/helpers/validate'
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
  
  .checkbox-label{
    width: 30%;
    text-align: left;
  }
  .label-title{
    font-size: 18px;
    width: 120px;
    margin-top: 0;
    margin-bottom: 0;
    line-height: 38px;
   }
  .add-button {
      text-align: center;
      width:100%;
  }
  .checkbox_area {
    padding-left: 15px;
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
      width: 120px;
      font-size: 18px;
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
    .radio-btn label{
        width: 100px;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 4px;
        margin: 0 5px;
        padding: 4px 5px;    
        font-size: 18px;
    }
  }
}
 `;

class HeartInputModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    let code_master = sessApi.getObjectValue(
      "dial_common_master",
      "code_master"
    );
    var timingData = code_master["実施タイミング"];
    var timing_codes = makeList_code(timingData);
    var timing_code =
      modal_data !== null && modal_data.timing_code !== undefined
        ? modal_data.timing_code
        : 0;
    var timing = timing_codes[timing_code];
    var dial_status = 0;
    if (
      modal_data == undefined ||
      modal_data.dial_status == undefined ||
      modal_data.dial_status == null
    ) {
      if (timing == "透析終了後" || timing == "透析終了時") {
        dial_status = 1;
      } else {
        dial_status = 0;
      }
    } else {
      dial_status = modal_data.dial_status;
    }

    this.state = {
      heart:
        modal_data != null && modal_data.heart != null ? modal_data.heart : "",
      thorax:
        modal_data != null && modal_data.thorax != null
          ? modal_data.thorax
          : "",
      chest_ratio:
        modal_data != null && modal_data.chest_ratio != null
          ? modal_data.chest_ratio
          : "",
      comment: modal_data !== null ? modal_data.comment : "",
      // dial_status:(modal_data !== null && modal_data.dial_status !== undefined ) ? modal_data.dial_status : 0,
      dial_status,
      schedule_date: modal_data !== null ? modal_data.schedule_date : "",
      system_patient_id: modal_data !== null ? modal_data.system_patient_id : 0,

      timing_code,

      isBackConfirmModal: false,
      isUpdateConfirmModal: false,
      timing_codes,
      alert_messages: "",
      confirm_alert_title:'',
      check_message:"",
    };
    this.original = "";
  }

  componentDidMount() {
    this.original = JSON.stringify(this.state);
    // this.changeBackground();
  }

  componentDidUpdate () {
    // this.changeBackground();
  }

  changeBackground = () => {
    medicalInformationValidate("heart_input", this.state, "background");
  }

  closeModal = () => {
    if (JSON.stringify(this.state) != this.original) {
      this.setState({
        isBackConfirmModal: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_alert_title:'入力中',
      });
    } else {
      this.props.closeModal();
    }
  };

  getDisplayName = (e) => {
    var RegExp = /^\d*\.?\d*$/;
    if (!RegExp.test(e.target.value)) {
      return;
    }
    this.setState({ heart: e.target.value });
  };

  getMedicineName = (e) => {
    var RegExp = /^\d*\.?\d*$/;
    if (!RegExp.test(e.target.value)) {
      return;
    }
    this.setState({ thorax: e.target.value });
  };

  getMedicineKanaName = (e) => {
    var RegExp = /^\d*\.?\d*$/;
    if (!RegExp.test(e.target.value)) {
      return;
    }
    this.setState({ chest_ratio: e.target.value });
  };

  getMedicineShortName = (e) => {
    this.setState({ comment: e.target.value });
  };

  handleOk = () => {
    // let validate_data = medicalInformationValidate("heart_input", this.state);
    // if (validate_data['error_str_arr'].length > 0 ) {
    //     this.setState({
    //       check_message:validate_data['error_str_arr'].join('\n'),
    //       first_tag_id:validate_data['first_tag_id']
    //     });
    //     return;
    // }
    if (this.state.heart == '' && this.state.thorax == '' && this.state.chest_ratio == ''){
      this.setState({
        check_message:'心臓・胸郭・心胸比を入力してください。',
        first_tag_id:'heart_id'
      })
      return;
    }
    this.setState({
      isUpdateConfirmModal: true,
      confirm_message: "心胸比情報を変更しますか?",
    });
  };

  closeAlertModal = () => {
    this.setState({check_message: ''});
    $("#" + this.state.first_tag_id).focus();
  }

  confirmCancel() {
    this.setState({
      isBackConfirmModal: false,
      isUpdateConfirmModal: false,
      confirm_message: "",
      alert_messages: "",
      confirm_alert_title:'',
    });
  }

  register = () => {
    this.props.handleOk(this.state);
  };

  getMedicineCategory = (e) => {
    this.setState({ dial_status: parseInt(e.target.value) });
  };

  onHide = () => {};

  closeConfirmModal = () => {
    this.confirmCancel();
    this.props.closeModal();
  };

  render() {
    // let tooltip = "";
    // if (this.state.heart === "") {
    //   tooltip = "心臓幅を入力してください。";
    // } else if (this.state.thorax === "") {
    //   tooltip = "胸郭幅を入力してください。";
    // } else if (this.state.chest_ratio === "") {
    //   tooltip = "心胸比を入力してください。";
    // }
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        id="add_contact_dlg"
        className="master-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>心胸比編集</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <InputWithLabelBorder
              label="心臓"
              type="text"
              id='heart_id'
              className="name-area"
              getInputText={this.getDisplayName.bind(this)}
              diseaseEditData={this.state.heart}
            />
            <InputWithLabelBorder
              label="胸郭"
              type="text"
              id='thorax_id'
              className="name-area"
              getInputText={this.getMedicineName.bind(this)}
              diseaseEditData={this.state.thorax}
            />
            <InputWithLabelBorder
              label="心胸比"
              type="text"
              id='chest_ratio_id'
              className="kana_area"
              getInputText={this.getMedicineKanaName.bind(this)}
              diseaseEditData={this.state.chest_ratio}
            />
            <InputWithLabelBorder
              label="コメント"
              type="text"
              id='comment_id'
              getInputText={this.getMedicineShortName.bind(this)}
              diseaseEditData={this.state.comment}
            />

            <div className="gender">
              <label className="mr-2 gender-label">透析前後</label>
              <RadioButton
                id="gender_1"
                value={0}
                label="前"
                name="dial_status"
                getUsage={this.getMedicineCategory}
                checked={this.state.dial_status == 1 ? false : true}
                // checked = {timing_codes[this.state.timing_code] == '透析終了後' ? false:true}
              />
              <RadioButton
                id="gender_2"
                value={1}
                label="後"
                name="dial_status"
                getUsage={this.getMedicineCategory}
                checked={this.state.dial_status == 1 ? true : false}
                // checked = {timing_codes[this.state.timing_code] == '透析終了後' ? true:false}
              />
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
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
            <Button
              onClick={this.handleOk}
              className={"red-btn"}
              // tooltip={tooltip}
            >
              登録
            </Button>
        </Modal.Footer>
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal={this.confirmCancel.bind(this)}
            handleOk={this.confirmCancel.bind(this)}
            showMedicineContent={this.state.alert_messages}
          />
        )}
        {this.state.isBackConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.closeConfirmModal}
            confirmTitle={this.state.confirm_message}
            title = {this.state.confirm_alert_title}
          />
        )}
        {this.state.check_message != "" && (
          <ValidateAlertModal
            handleOk={this.closeAlertModal}
            alert_meassage={this.state.check_message}
          />
        )}
      </Modal>
    );
  }
}

HeartInputModal.contextType = Context;

HeartInputModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  modal_data: PropTypes.object,
};

export default HeartInputModal;
