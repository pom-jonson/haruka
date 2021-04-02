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
`;

class RegisterAlertModal extends Component {
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
        className = "register-alert-modal"
        tabIndex="0"
      >

        <Modal.Body>
          <div className="auto-logout">  
              <DoubleModal>
              <div>              
                {this.props.alert_meassage != undefined && this.props.alert_meassage.replace(/[\n\r]+/g, '\\n').split("\\n").map((item, key) => {
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
          <Button id="system_btn_Ok" onClick={this.props.handleOk}>OK</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
RegisterAlertModal.propTypes = {  
  hideModal: PropTypes.func,
  handleOk: PropTypes.func,
  alert_meassage: PropTypes.string,
};

export default RegisterAlertModal;
