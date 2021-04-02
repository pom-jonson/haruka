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
  p{
    margin-bottom: 5px !important;
  }
`;

class UsageAlertModal extends Component {
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
    this.btns = ["usage_btn_Detail","usage_btn_Cancel","usage_btn_Ok"];      
    if (
      document.getElementById("usage_alert_dlg") !== undefined &&
      document.getElementById("usage_alert_dlg") !== null
    ) {
      document.getElementById("usage_alert_dlg").focus();
    }
  }

  onKeyPressed(e) {
    if (e.keyCode === KEY_CODES.left || e.keyCode === KEY_CODES.right) {      
      let fnum = this.flag; 
      if(e.keyCode === KEY_CODES.left){
        fnum = (this.flag - 1 + this.btns.length) % this.btns.length; 
      }else{
        fnum = (this.flag + 1) % this.btns.length; 
      }      

      this.setState({curFocus : fnum});
      this.flag = fnum;   
    }
    if (e.keyCode === KEY_CODES.enter) {
      e.stopPropagation();
      e.preventDefault();
      if (this.flag === 0) {
        this.props.handleDetail();
      }else if(this.flag === 1){
        this.props.handleCancel();
      }else{
        this.props.handleOk();
      }   
    }
  }


  render() {    
    return (
      <Modal
        show={true}       
        id="usage_alert_dlg"        
        // className = "usage-alert-modal"
        className = "alert-modal"
        tabIndex="0"
        onKeyDown={this.onKeyPressed}
      >

        <Modal.Body>
          <div className="auto-logout">  
              <DoubleModal>
              <div>              
                {this.props.alertContent.split("\n").map((item, key) => {
                  return (
                    <p key={key}>{item}</p>
                  )
                })}
              </div>
              </DoubleModal>
          </div>
        </Modal.Body>        
        <Modal.Footer>
          <Button className={this.state.curFocus === 1?"cancel-btn focus": "cancel-btn"} id="usage_btn_Cancel" onClick={this.props.handleCancel}>キャンセル</Button>
          <Button className={this.state.curFocus === 0?"red-btn focus btnDetail": "red-btn btnDetail"} id="usage_btn_Detail" onClick={this.props.handleDetail}>詳細を見る</Button>
          <Button className={this.state.curFocus === 2?"red-btn focus": "red-btn"} id="usage_btn_Ok" onClick={this.props.handleOk}>OK</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
UsageAlertModal.propTypes = {  
  hideModal: PropTypes.func,
  handleOk: PropTypes.func,
  handleDetail: PropTypes.func,
  handleCancel: PropTypes.func,
  alertContent: PropTypes.string,
};

export default UsageAlertModal;
