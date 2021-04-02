import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";

const Wrapper = styled.div`
  .content{
    padding-left:50px;
    label{
      width:100%;
      font-size:20px;
    }
    textarea{
      width:470px;
      height:200px;
    }
  }
  .footer {
    text-align:center;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225); 
      border: none;  
      margin-right: 20px;    
    }    
    span {
      color: white;
      font-size: 16px;
      padding-left: 35px;
      padding-right: 35px;
      font-weight: 100;
    }    
}
.no-padding{
  padding:0;
}
td label{
  display:none;
}
 `;

class AddSendingModal extends Component {
  constructor(props) {
    super(props);
      let edit_modal_data = this.props.edit_modal_data;
    this.state = {
      number: edit_modal_data !== undefined && edit_modal_data != null ? edit_modal_data.number : "",
      sending_data: edit_modal_data !== undefined && edit_modal_data != null ? edit_modal_data.message : "",
    };
  }
  
  getValue = (index, e) => {
    var temp = this.state.rows;
    temp[index].staff = e.target.value;
    this.setState({
      rows:temp
    });    
  };

  getSending = (e) => {
    this.setState({sending_data:e.target.value});
  }

  addSending = (title) => {
    if(title == "次回への") {
        title = "次回";
    }
    let data = {
        number: this.state.number,
        patient_id: this.props.patientId,
        category: title+"申し送り",
        message: this.state.sending_data,
    };

    let path = "/app/api/v2/dial/board/sendingDataRegister";
    apiClient.post(path, {
        params: data
    }).then(() => {        
        this.props.handleOk();
    }).catch(() => {
    });
  }

    closeModal = () => {
        this.props.closeModal();
    };

  onHide=()=>{}
  

  render() {
    const { modal_title } = this.props;
    return  (
        <Modal show={true} onHide={this.onHide} id="add_contact_dlg"  className="master-modal">
          <Modal.Header>
            <Modal.Title>              
                {modal_title}申し送りを追加
              </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className="content">
                <label>申し送りを入力してください。</label>
                  <textarea
                      onChange={this.getSending.bind(this)}
                      value={this.state.sending_data}
                  />
              </div>                            
              <div className="footer-buttons">                  
                      <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
                      <Button className="red-btn" onClick={this.addSending.bind(this, modal_title)}>{this.props.edit_modal_data !== null && this.props.edit_modal_data !== undefined ? "変更" : "登録"}</Button>
              </div>
            </Wrapper>
          </Modal.Body>
        </Modal>
    );
  }
}

AddSendingModal.contextType = Context;

AddSendingModal.propTypes = {    
  closeModal:PropTypes.func,
  handleOk:PropTypes.func,
  handleModal:PropTypes.func,
  modal_title:PropTypes.string,
  edit_modal_data:PropTypes.object,
  patientId:PropTypes.number
};

export default AddSendingModal;
