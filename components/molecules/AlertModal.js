import React, { Component } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { onSecondaryDark } from "../_nano/colors";
import Button from "../atoms/Button";
import { KEY_CODES } from "../../helpers/constants";

const DoubleModal = styled.div`
  font-family: NotoSansJP;
  font-size: 20px;
  line-height: 1.33;
  letter-spacing: 0.4px;
  color: ${onSecondaryDark};
  padding: 4px 4px 4px 0;
  margin: 0;
  max-height: 70vh;
  overflow-y: auto;
`;

class AlertModal extends Component {
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
    if(this.props.modalType === "Duplicate" || this.props.modalType === "Alert"){
      this.btns = ["btnOK","btnCancel"];
      this.setState({
        curFocus: 1
      });

      this.flag = 1;
    }
    else {
      this.btns = ["btnOK"];
    }
    if (
      document.getElementById("alert_dlg") !== undefined &&
      document.getElementById("alert_dlg") !== null
    ) {
      document.getElementById("alert_dlg").focus();
    }

    // let modal_container = document.getElementsByClassName("alert-modal")[0];    
    // if(modal_container !== undefined && modal_container != null){
    //     let modal_content = document.getElementsByClassName("modal-content")[0];
    //     if (modal_content !== undefined && modal_content != null) {
    //       let margin_top = parseInt((modal_container.offsetHeight - modal_content.offsetHeight) / 2);
    //       modal_container.style['margin-top'] = margin_top.toString()+"px";          
    //     }
    // }
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
        this.props.handleOk();
      }else{
        this.props.handleCancel();
      }      
    }
  }

  render() {    
    return (
      <Modal
        show={true}       
        id="alert_dlg"
        // onHide={this.props.hideModal}
        className = "alert-modal"
        tabIndex="0"
        onKeyDown={this.onKeyPressed}
      >

        <Modal.Body>
          <div className="auto-logout">  
              {this.props.modalType === "Duplicate" && (
              <DoubleModal>
              <div>{this.props.showMedicineSelected}{this.props.showMedicineContent}</div>
              </DoubleModal>
              )}
              {this.props.modalType === "Reject" && (
                <DoubleModal>
              <div>{this.props.showMedicineSelected}</div>
              <div>{this.props.showMedicineContent}</div>
              <br />
              <div>対象の薬品</div>
              <div>{this.props.showMedicineOrigin}</div>
              </DoubleModal>

              )}
              {(this.props.modalType === "Alert" || this.props.modalType === "OnlyAlert") && (
              <DoubleModal>              
              <div>{this.props.showMedicineSelected}</div>
              {this.props.modalType === "Alert" && (
                <div>{this.props.showMedicineContent}</div>
              )}
              {this.props.modalType === "OnlyAlert" && (
                <>
                  <div>相互作用情報があります。</div>
                </>
              )}
              <br />
              <div>対象の薬品</div>
              {this.props.showMedicineOrigin.split('#').map((item, key) => {
                return (
                  <div key={key}>{item}</div>
                )
              })}              
              </DoubleModal>

              )}  
              {this.props.modalType === "Notify" && (
              <DoubleModal>
              <div>{this.props.showMedicineSelected}{this.props.showMedicineContent}</div>
              </DoubleModal>
              )}
          </div>
        </Modal.Body>        
        <Modal.Footer>
          {!(this.props.modalType === "Notify" || this.props.modalType === "Reject" || this.props.modalType === "OnlyAlert") && (
              <Button id="btnCancel" className={this.state.curFocus === 1?"cancel-btn focus": "cancel-btn"} onClick={this.props.handleCancel}>キャンセル</Button>
          )} 
          <Button id="btnOk" className={this.state.curFocus === 0?"red-btn focus": "red-btn"} onClick={this.props.handleOk}>OK</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
AlertModal.propTypes = {  
  hideModal: PropTypes.func,
  handleCancel: PropTypes.func,
  handleOk: PropTypes.func,
  showMedicineOrigin: PropTypes.string,
  showMedicineContent: PropTypes.string,
  showMedicineSelected: PropTypes.string,
  modalType: PropTypes.string,
};

export default AlertModal;
