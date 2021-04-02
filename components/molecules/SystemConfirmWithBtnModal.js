import React, { Component } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { onSecondaryDark } from "../_nano/colors";
import Button from "../atoms/Button";
import { KEY_CODES } from "../../helpers/constants";

const DoubleModal = styled.div`
  font-family: NotoSansJP;
  line-height: 1.33;
  letter-spacing: 0.4px;
  color: ${onSecondaryDark};
  padding: 4px 4px 4px 0;
  margin: 0;
  font-size: 20px;
  font-weight: bold;
`;

class SystemConfirmWithBtnModal extends Component {
  constructor(props) {
    super(props);
    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.state = {
      curFocus: 0,
    }
    this.btns = [];
    this.flag = 0;
  }
  
  async componentDidMount() {
    if (
      document.getElementById("system_confirm_Ok") !== undefined &&
      document.getElementById("system_confirm_Ok") !== null
    ) {
      document.getElementById("system_confirm_Ok").focus();
    }
    // this.btns = ["btnOK","btnCancel"];
    this.btns = [1,2];
    if(this.props.thirdMethod != undefined){
      this.btns = [1,2, 3];
    }
    this.setState({
      curFocus: 0
    });
    this.flag = 0;
  }
  
  onKeyPressed(e) {
    if (e.keyCode === KEY_CODES.left){
      this.flag++;
      this.flag = this.flag == this.btns.length ? 0 : this.flag;
    }
    if(e.keyCode === KEY_CODES.right) {
      this.flag--;
      this.flag = this.flag < 0 ? this.btns.length-1 : this.flag;
    }
    if (e.keyCode === KEY_CODES.left || e.keyCode === KEY_CODES.right){
      this.setState({curFocus : this.flag});
    }
    if (e.keyCode === KEY_CODES.enter) {
      e.stopPropagation();
      e.preventDefault();
      if (this.flag === 0) {
        this.props.firstMethod();
      } else if (this.flag === 1) {
        this.props.secondMethod();
      } else if (this.flag === 2) {
        this.props.thirdMethod();
      }
    }
  }
  
  render() {
    return (
      <Modal
        show={true}
        id="system_alert_dlg"
        className = "system-confirm with-btn-modal"
        tabIndex="0"
        onKeyDown={this.onKeyPressed}
      >
        {this.props.title != undefined && this.props.title != null && this.props.title != "" && (
          <Modal.Header><Modal.Title>{this.props.title}</Modal.Title></Modal.Header>
        )}
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
          {this.props.thirdMethod != undefined && (
            <Button
              className={this.props.third_btn_class + (this.state.curFocus === 2 ? " focus": "")}
              onClick={this.props.thirdMethod}
            >{this.props.third_btn_name}</Button>
          )}
          <Button
            className={(this.props.second_btn_class != undefined ? this.props.second_btn_class : "cancel-btn") + (this.state.curFocus === 1 ? " focus": "")}
            onClick={this.props.secondMethod}
          >{this.props.second_btn_name}</Button>
          <Button
            id="system_confirm_Ok"
            className={"red-btn" + (this.state.curFocus === 0 ? " focus" : "")}
            onClick={this.props.firstMethod}
          >{this.props.first_btn_name}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

SystemConfirmWithBtnModal.propTypes = {
  title: PropTypes.string,
  confirmTitle: PropTypes.string,
  first_btn_name: PropTypes.string,
  firstMethod: PropTypes.func,
  secondMethod: PropTypes.func,
  second_btn_name: PropTypes.string,
  second_btn_class: PropTypes.string,
  thirdMethod: PropTypes.func,
  third_btn_name: PropTypes.string,
  third_btn_class: PropTypes.string,
};

export default SystemConfirmWithBtnModal;
