import React, { Component } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { onSecondaryDark } from "../_nano/colors";
// import Button from "../atoms/Button";
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

// const FooterWrapper = styled.div`
//   width: 100%;
//   button{
//     padding: 4px 8px;
//     margin-left: 4px;
//     span{
//       font-size: 14px;
//     }
//     outline: none;
//   }
//   button:first-child{
//     background: #f1567c;      
//     span{
//       color: white;
//     }
//     float: left;
//   }

//   button:last-child{
//     float: right;
//   }
// `;

class SystemDeletePrescriptionModal extends Component {
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
      document.getElementById("prescription_injection_cancel_modal") !== undefined &&
      document.getElementById("prescription_injection_cancel_modal") !== null
    ) {
      document.getElementById("prescription_injection_cancel_modal").focus();
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
    let _cancelTitle = "キャンセル";
    let _confirmTitle = "破棄してSOAPに戻る";
    if (this.props.type == "_editAfterDelete") _confirmTitle = "破棄して入力開始";
    return (
      <Modal
        show={true}       
        id="prescription_injection_cancel_modal"
        // onHide={this.props.hideConfirm}
        className = "system-confirm"
        tabIndex="0"
        onKeyDown={this.onKeyPressed}
      >

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
          <div                 
            onClick={this.props.confirmCancel}
            className={this.state.curFocus === 1 ? "custom-modal-btn cancel-btn focus " : "custom-modal-btn cancel-btn"}
            style={{cursor:"pointer"}}
          >
            <span>{_cancelTitle}</span>
          </div>
          <div     
            id="system_confirm_Ok"            
            className={this.state.curFocus === 0 ? "custom-modal-btn red-btn focus " : "custom-modal-btn red-btn"}
            onClick={this.props.confirmOk}
            style={{background:this.props.OkBackground !== undefined ? this.props.OkBackground:"",cursor:"pointer"}}
          >
            <span>{_confirmTitle}</span>
          </div>

          {/*<Button id="system_confirm_Cancel" className={this.state.curFocus === 1?"cancel-btn focus": "cancel-btn"} onClick={this.props.confirmCancel}>{_cancelTitle}</Button>
          <Button id="system_confirm_Ok" className={this.state.curFocus === 0?"red-btn focus": "red-btn"} onClick={this.props.confirmOk}>{_confirmTitle}</Button>          */}
        </Modal.Footer>
      </Modal>
    );
  }
}
SystemDeletePrescriptionModal.propTypes = {  
  hideConfirm: PropTypes.func,
  confirmOk: PropTypes.func,
  confirmCancel: PropTypes.func,
  confirmTitle: PropTypes.string,
  okTitle: PropTypes.string,
  cancelTitle: PropTypes.string,
  OkBackground: PropTypes.string,
  type: PropTypes.string,
};

export default SystemDeletePrescriptionModal;
