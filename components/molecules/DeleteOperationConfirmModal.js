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

class DeleteOperationConfirmModal extends Component {
  constructor(props) {
    super(props);
    this.onKeyPressed = this.onKeyPressed.bind(this); 
    this.state = {
      curFocus: 1,
    }    
    this.btns = [];
    this.flag = 1; 
    this.m_title = "";

    // get modal title
    if(this.props.modal_type == "modal_delete"){
    this.m_title = "入力中";
    } else if(this.props.modal_type == "delete_ok") {
      this.m_title = "削除確認";    
    } else if(this.props.modal_type == "delete_cancel") {
      this.m_title = "削除準備中";
    }
  }

  async componentDidMount() {
    if (
      document.getElementById("system_confirm_Cancel") !== undefined &&
      document.getElementById("system_confirm_Cancel") !== null
    ) {
      document.getElementById("system_confirm_Cancel").focus();
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
    let _confirmTitle = "はい";
    let _message = "";
    let _alert = "";

    if (this.props.modal_type == "modal_delete") { 
      _alert = "登録・編集と削除は同時に行えません。";
      _message = "入力中の内容を破棄して、処方歴の削除を行いますか？";

      
    if (this.props.type == "injection") {
      _message = "入力中の内容を破棄して、注射履歴の削除を行いますか？";
    }

    } else if(this.props.modal_type == "delete_ok") {
      
      _message = this.props.del_numbers + "件の処方歴を削除予定に追加しますか？";    
      
      if (this.props.type == "injection") {
        _message = this.props.del_numbers + "件の注射履歴を削除予定に追加しますか？";
      }

    } else if(this.props.modal_type == "delete_cancel") {

      _alert = "確認・確定していない削除予定が" + this.props.del_numbers + "件あります。";
      _message = "削除を取りやめてカルテに戻りますか？";

    }

    // if (this.props.type == "_editAfterDelete") _confirmTitle = "破棄して入力開始";
    return (
      <Modal
        show={true}       
        id="system_alert_dlg"
        // onHide={this.props.hideConfirm}
        className = "system-confirm"
        tabIndex="0"
        onKeyDown={this.onKeyPressed}
      >
        <Modal.Header>
          <Modal.Title>{this.m_title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="auto-logout">  
              <DoubleModal>
                {_alert != "" && (
              <div>              
                    {_alert}
              </div>
                )}
              <div>
                {_message}
              </div>
              </DoubleModal>
          </div>
        </Modal.Body>        
        <Modal.Footer>
          <Button id="system_confirm_Cancel" className={this.state.curFocus === 1?"cancel-btn focus": "cancel-btn"} onClick={this.props.confirmCancel}>{_cancelTitle}</Button>
          <Button id="system_confirm_Ok" className={this.state.curFocus === 0?"red-btn focus": "red-btn"} onClick={this.props.confirmOk}>{_confirmTitle}</Button>          
        </Modal.Footer>
      </Modal>
    );
  }
}
DeleteOperationConfirmModal.propTypes = {  
  hideConfirm: PropTypes.func,
  confirmOk: PropTypes.func,
  confirmCancel: PropTypes.func,
  confirmTitle: PropTypes.string,
  okTitle: PropTypes.string,
  cancelTitle: PropTypes.string,
  type: PropTypes.string,
  del_numbers: PropTypes.number,
  modal_type: PropTypes.string,
};

export default DeleteOperationConfirmModal;
