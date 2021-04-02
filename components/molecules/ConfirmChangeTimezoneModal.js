import React, { Component } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { onSecondaryDark } from "../_nano/colors";
import Button from "../atoms/Button";
import { KEY_CODES } from "../../helpers/constants";

const DoubleModal = styled.div`
  font-family: NotoSansJP;
  font-size: 12px;
  line-height: 1.33;
  letter-spacing: 0.4px;
  color: ${onSecondaryDark};
  padding: 4px 4px 4px 0;
  margin: 0;
  font-size: 20px;
  font-weight: bold;
`;

class ConfirmChangeTimezoneModal extends Component {
  constructor(props) {
    super(props);
    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.state = {
      curFocus: 1,
    }
    this.btns = [];
    this.flag = 1;
  }
  
  async componentDidMount() {
    if (
      document.getElementById("system_confirm_Ok") !== undefined &&
      document.getElementById("system_confirm_Ok") !== null
    ) {
      document.getElementById("system_confirm_Ok").focus();
    }
    this.btns = ["btnOK","btnCancel"];
    this.setState({
      curFocus: 1
    });
    this.flag = 1;
  }
  
  onKeyPressed(e) {
    if (e.keyCode === KEY_CODES.left || e.keyCode === KEY_CODES.right) {
      let fnum = (this.flag + 1) % this.btns.length;
      
      this.setState({curFocus : fnum});
      this.flag = fnum;
    }
    if (e.keyCode === KEY_CODES.enter) {
      e.stopPropagation();
      e.preventDefault();
      if (this.flag === 0) {
        this.props.confirmOk();
      }else{
        this.props.confirmCancel();
      }
    }
  }
  render() {
    return (
      <Modal
        show={true}
        id="system_alert_dlg"
        className = {"system-confirm windows-alert-message master-modal timezone-change-modal"}
        onKeyDown={this.onKeyPressed}
      >
        <Modal.Header>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="auto-logout">
            <DoubleModal>
              <div>
                {this.props.confirmTitle.replace(/[\n\r]+/g, '\\n').split("\\n").map((item, key) => {
                  return (
                    <>
                      {item == "" ? (<br />) : (<p key={key}>{item}</p>) }
                    </>
                  )
                })}
              </div>
            </DoubleModal>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button id="system_confirm_Cancel" className={this.state.curFocus === 1?"cancel-btn focus": "cancel-btn"} onClick={this.props.confirmCancel}>キャンセル</Button>
          <Button id="system_confirm_Ok" className={this.state.curFocus === 0?"red-btn focus": "red-btn"} onClick={this.props.confirmOk}>OK</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
ConfirmChangeTimezoneModal.propTypes = {
  hideConfirm: PropTypes.func,
  confirmOk: PropTypes.func,
  confirmCancel: PropTypes.func,
  confirmTitle: PropTypes.string,
};

export default ConfirmChangeTimezoneModal;