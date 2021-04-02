import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Button from "../atoms/Button";
import Context from "~/helpers/configureStore";

class ConfirmDeleteModal extends Component {
  constructor(props) {
    super(props);
    this.state = {      

    }
  }
  
  render() {    
    return  (
      <Modal
        show={true}
        id="ConfirmDeleteModal_dlg"        
        className="custom-modal ConfirmDeleteModal-modal"
      >
        {/* <Modal.Header>
        患者移動履歴変更
        </Modal.Header> */}
        <Modal.Body>
          <div className="content">  
            <p>患者情報を削除しますか？</p>          
          </div>
          <div className="text-right">
            <Button onClick={this.props.handleOk} id="login-seat-button">
              はい
            </Button>
            <Button onClick={this.props.closeModal}>
              いいえ
            </Button>
          </div>
         
        </Modal.Body>        

      </Modal>
    );
  }
}

ConfirmDeleteModal.contextType = Context;

ConfirmDeleteModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
};

export default ConfirmDeleteModal;
