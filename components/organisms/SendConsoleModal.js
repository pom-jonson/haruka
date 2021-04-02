import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import Button from "../atoms/Button";
import PropTypes from "prop-types";
import styled from "styled-components";
import Context from "~/helpers/configureStore";

const ButtonBox = styled.div`
  text-align: center;
  span {
    font-size: 16px;
  }
`;

const content_style = {
  margin: "40px 20px",
  fontSize: "35px",
};

const buttonStyle = {
  fontSize: "16px",
  width: "400px",
  padding: "16px",
  margin: "16px"
};

class SendConsoleModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return  (
        <Modal
            show={true}            
            width="700"
            effect="fadeInUp"
        >
          <Modal.Header>
            <Modal.Title>コンソールへ送信</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={content_style}>
              この内容で送信しますか？
            </div>
            <ButtonBox>
              <div>
                <Button onClick={this.props.sendConsole} style={buttonStyle}>
                  コンソールへ送信する
                </Button>
              </div>
              <div>
                <Button onClick={this.props.saveData} style={buttonStyle}>
                  送信せずに保存する
                </Button>
              </div>
              <div>
                <Button onClick={this.props.closeModal} style={buttonStyle}>
                  キャンセル
                </Button>

              </div>
            </ButtonBox>
          </Modal.Body>
        </Modal>
    );
  }
}

SendConsoleModal.contextType = Context;

SendConsoleModal.propTypes = {
  visible: PropTypes.bool,
  sendConsole: PropTypes.func,
  closeModal: PropTypes.func,
  saveData: PropTypes.func,
};

export default SendConsoleModal;
