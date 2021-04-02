import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import { KEY_CODES } from "../../../../helpers/constants";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import CalcDial from "~/components/molecules/CalcDial";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 18px;
  width: 100%;
  height: 100%;
  flex-direction: column;
  display: flex;
  text-align: center;
  button {
    margin-left: auto;
    margin-right: auto;
  }
  input {
    height: 40px;
    width: 300px !important;
    ime-mode: inactive;
  }
  label {
    font-size: 18px;
    text-align: right;
    margin-top: 5px;
  }
  .react-datepicker-wrapper {
    margin: 10px auto;
  }
  .label-title {
    font-size: 18px;
    width: 55px;
  }
  .label-unit {
    font-size: 18px;
    width: 80px;
  }
  .footer {
    display: flex;
    margin-left: 70px;
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
  .ml-10 {
    margin-left: 10px;
  }
`;

class AmountInputModal extends Component {
  constructor(props) {
    super(props);
    let medi_info = this.props.medicine;
    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.state = {
      amount:
        medi_info != undefined &&
        medi_info != null &&
        medi_info.amount != undefined
          ? medi_info.amount
          : "",
      unit:
        medi_info != undefined &&
        medi_info != null &&
        medi_info.unit != undefined
          ? medi_info.unit
          : "",
      alert_messages: "",
      isOpenCalcModal: false,
      isBackConfirmModal: false,
      calcUnit: "",
      calcTitle: "",
      confirm_alert_title:'',
    };
    this.btns = [];
    this.flag = 0;
    this.carpos =
      medi_info != undefined &&
      medi_info != null &&
      medi_info.amount != undefined
        ? medi_info.amount.toString().length
        : 0;
    this.original = "";
  }

  register = () => {
    var base_modal = document.getElementsByClassName("name-save-modal")[0];
    if (this.state.amount === "") {
      if (base_modal !== undefined && base_modal != null)
        base_modal.style["z-index"] = 1040;
      this.setState({ alert_messages: "数量を入力してください。" });
      return;
    }
    if (this.state.amount !== "" && isNaN(parseFloat(this.state.amount))) {
      if (base_modal !== undefined && base_modal != null)
        base_modal.style["z-index"] = 1040;
      this.setState({ alert_messages: "数量を数字で入力してください。" });
      return;
    }
    this.props.handleModal(this.state.amount);
  };

  onChange = (e) => {
    if (e.target.value.toString().length > 4) return;
    var RegExp = /^\d*\.?\d*$/;
    if (!RegExp.test(e.target.value)) {
      return;
    }
    this.setState({ amount: e.target.value });
  };

  onKeyPressed(e) {
    if (e.keyCode === KEY_CODES.left || e.keyCode === KEY_CODES.right) {
      let fnum = (this.flag + 1) % this.btns.length;

      this.setState({ curFocus: fnum });
      this.flag = fnum;
    }
    if (e.keyCode === KEY_CODES.enter) {
      e.stopPropagation();
      e.preventDefault();
      if (
        document.getElementById("system_alert_dlg") !== undefined &&
        document.getElementById("system_alert_dlg") != null
      ) {
        this.setState({ alert_messages: "" });
        if (document.getElementById("medicine_amount_input") != null)
          document.getElementById("medicine_amount_input").focus();
        return;
      }
      if (this.flag === 0) {
        this.register();
      } else {
        this.props.closeModal();
      }
    }
  }

  setCaretPosition = (elem, caretPos) => {
    var range;
    if (elem != null) {
      if (elem.createTextRange) {
        range = elem.createTextRange();
        range.move("character", caretPos);
        range.select();
      } else {
        elem.focus();
        if (elem.selectionStart !== undefined) {
          elem.setSelectionRange(caretPos, caretPos);
        }
      }
    }
  };

  onHide = () => {};

  componentDidMount() {
    let medicine_modal = document.getElementsByClassName(
      "prescript-medicine-select-modal"
    )[0];
    this.original = JSON.stringify(this.state);
    if (medicine_modal != undefined) medicine_modal.style["z-index"] = 1040;
    if (document.getElementById("medicine_amount_input") != null) {
      this.setCaretPosition(
        document.getElementById("medicine_amount_input"),
        this.carpos
      );
    }
  }
  
  componentWillUnmount() {
    let medicine_modal = document.getElementsByClassName(
      "prescript-medicine-select-modal"
    )[0];
    if (medicine_modal != undefined) medicine_modal.style["z-index"] = 1050;
  }

  confirmCancel() {
    this.setState({
      alert_messages: "",
      isBackConfirmModal: false,
      confirm_alert_title:'',
    });
    var base_modal = document.getElementsByClassName("staff-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1050;
    if (document.getElementById("medicine_amount_input") != null)
      document.getElementById("medicine_amount_input").focus();
  }

  openCalc = (type, val) => {
    let medicine_name = this.props.medicine.name;
    if (medicine_name == null || medicine_name == undefined) {
      medicine_name = this.props.medicine.item_name;
    }
    this.setState({
      calcInit: val != undefined && val != null && val > 0 ? val : 0,
      calcValType: type,
      calcTitle: medicine_name,
      calcUnit: this.props.medicine.unit,
      isOpenCalcModal: true,
    });
  };

  calcCancel = () => {
    this.setState({
      isOpenCalcModal: false,
      calcValType: "",
      calcTitle: "",
      calcUnit: "",
      calcInit: 0,
    });
  };

  calcConfirm = (val) => {
    let _state = { isOpenCalcModal: false };
    if (this.state.calcValType == "") {
      _state.amount = val;
    }
    _state.calcValType = "";
    _state.calcTitle = "";
    _state.calcUnit = "";
    _state.calcInit = 0;
    this.setState(_state);
  };

  closeModal = () => {
    if (this.original != JSON.stringify(this.state)) {
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

  closeConfirmModal = () => {
    this.confirmCancel();
    this.props.closeModal();
  };

  render() {
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        id="add_contact_dlg"
        className="master-modal staff-time-modal name-save-modal"
        onKeyDown={this.onKeyPressed}
      >
        <Modal.Header>
          <Modal.Title>数量入力</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <InputBoxTag
              label="数量"
              id={"medicine_amount_input"}
              type="numeric"
              getInputText={this.onChange.bind(this)}
              onClick={() => this.openCalc("", this.state.amount)}
              value={this.state.amount}
            />
            <div className="footer-buttons">
              <Button onClick={this.register} className={`mr10 red-btn`}>
                登録
              </Button>
              <Button onClick={this.closeModal} className={`ml-10 cancel-btn`}>
                キャンセル
              </Button>
            </div>
          </Wrapper>
        </Modal.Body>
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal={this.confirmCancel.bind(this)}
            handleOk={this.confirmCancel.bind(this)}
            showMedicineContent={this.state.alert_messages}
          />
        )}
        {this.state.isOpenCalcModal ? (
          <CalcDial
            calcConfirm={this.calcConfirm}
            units={this.state.calcUnit}
            calcCancel={this.calcCancel}
            daysSelect={false}
            daysInitial={0}
            daysLabel=""
            daysSuffix=""
            maxAmount={100000}
            calcTitle={this.state.calcTitle}
            calcInitData={this.state.calcInit}
          />
        ) : (
          ""
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
      </Modal>
    );
  }
}

AmountInputModal.contextType = Context;

AmountInputModal.propTypes = {
  closeModal: PropTypes.func,
  handleModal: PropTypes.func,
  medicine: PropTypes.object,
};

export default AmountInputModal;
