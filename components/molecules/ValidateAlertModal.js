import React, { Component } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { onSecondaryDark } from "../_nano/colors";
import Button from "../atoms/Button";

const DoubleModal = styled.div`
  font-family: NotoSansJP;
  font-size: 20px;
  font-weight: bold;
  line-height: 1.33;
  letter-spacing: 0.4px;
  color: ${onSecondaryDark};
  padding: 10px 20px;
  margin: 0;
  max-width: 60vw;
  p{
    margin-bottom: 5px !important;
  }
  ul{
    color:red;
  }
`;

class ValidateAlertModal extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    if (
      document.getElementById("system_btn_Ok") !== undefined &&
      document.getElementById("system_btn_Ok") !== null
    ) {
      document.getElementById("system_btn_Ok").focus();
    }
  }


  render() {    
    return (
      <Modal
        show={true}       
        id="system_alert_dlg"
        // onHide={this.props.hideModal}
        className = "validate-alert-modal master-modal"
        tabIndex="0"
      >
        <Modal.Header>
          <Modal.Title>{this.props.title != undefined && this.props.title != null? this.props.title:'エラー'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>          
          <DoubleModal>
          <div>
            <p>入力内容にエラーがあります。</p>
            <ul>
            {this.props.alert_meassage != undefined && this.props.alert_meassage.replace(/[\n\r]+/g, '\\n').split("\\n").map((item, key) => {
              return (
                <>
                {item == "" ? (<br />) : (
                  <li key = {key}>{item}</li>
                )}
                </>
              )
            })}
            </ul>
          </div>
          </DoubleModal>
        </Modal.Body>        
        <Modal.Footer>
          <Button id="system_btn_Ok" className="red-btn" onClick={this.props.handleOk}>OK</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
ValidateAlertModal.propTypes = {  
  hideModal: PropTypes.func,
  handleOk: PropTypes.func,
  alert_meassage: PropTypes.string,
  title: PropTypes.string
};

export default ValidateAlertModal;
