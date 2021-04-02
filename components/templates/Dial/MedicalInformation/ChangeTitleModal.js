import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as methods from "../DialMethods";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 18px;
  width: 100%;
  height: 100%;
  flex-direction: column;
  display: flex;
  text-align: center;
  .form-control {
    width: 216px;
    font-size: 18px;
  }
  .footer {
    display: flex;
    button {
      min-width: 110px;
      margin-left: 10px;
      margin-top: 10px;
    }
    span {
      font-weight: normal;
      font-size: 20px;
    }
  }
  
  .filename{
    font-size:1rem;
    label{
      width: auto;
      margin-right:10px;
    }
    input{
      width:320px;
    }
  }
`;
class ChangeTitleModal extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );    
    let modal_data = this.props.modal_data;    
    this.state = {
      image_title:modal_data != null?modal_data.image_title:'',
      number:modal_data != null?modal_data.number:0,
      system_patient_id:modal_data != null?modal_data.system_patient_id:0,
      alert_messages: "",
      isBackConfirmModal: false,
      isUpdateConfirmModal: false,
      confirm_alert_title:'',
    };
    this.change_flag = 0;
    this.double_click = false;
  }

  register = () => {
    if (this.change_flag != 1) return;
    this.setState({
      isUpdateConfirmModal: true,
      confirm_message: "画像のタイトルを変更しますか？",
    });
  };

  registerConfirm = async() => {
    let path = "/app/api/v2/dial/medicine_information/changeTitle";
    var post_data = {params: {
      image_title:this.state.image_title,
      number:this.state.number,
      system_patient_id:this.state.system_patient_id,
    }};
    if (this.double_click == true) return;
    this.double_click = true;
    await apiClient.post(path, post_data)
      .then(() => {
        window.sessionStorage.setItem("alert_messages", '変更完了##変更が完了しました。');
        this.props.handleOk();
      })
      .finally(() => {
        this.double_click = false;
      });
  }

  async componentDidMount() {    
  }

  onHide = () => {};

  confirmCancel() {
    this.setState({
      alert_messages: "",
      isBackConfirmModal: false,
      isUpdateConfirmModal: false,
      confirm_alert_title:'',
    });    
  }
  
  closeModal = () => {
    if (this.change_flag == 1){
      this.setState({
        isBackConfirmModal: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_alert_title:'入力中',
      });
    } else {
      this.closeConfirmModal();
    }
    
  };
  
  closeConfirmModal = () => {
    this.confirmCancel();
    this.props.closeModal();
  };

  getInputText = (name, e) => {
    if (e.target.value != '' && e.target.value.length > 15){
      return;
    }
    this.change_flag = 1;
    this.setState({[name]:e.target.value});
  }

  render() {
    let tooltip = "";    
    if (this.change_flag == 0) {
      tooltip = "変更内容がありません。";
    }
    
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        id="add_contact_dlg"
        className="master-modal staff-modal first-view-modal"        
      >
        <Modal.Header>
          <Modal.Title>タイトル変更</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className='filename'>
              <label>タイトル(任意)</label>
              <input className='filename-input' value = {this.state.image_title} type='text' onChange = {this.getInputText.bind(this, 'image_title')}></input>
            </div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
            <Button className={tooltip != "" ? "disable-btn" : "red-btn"} tooltip={tooltip} onClick={this.register}>
              登録
            </Button>
        </Modal.Footer>        
        {this.state.isBackConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.closeConfirmModal}
            confirmTitle={this.state.confirm_message}
            title = {this.state.confirm_alert_title}
          />
        )}
        {this.state.isUpdateConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.registerConfirm.bind(this)}
            confirmTitle={this.state.confirm_message}
            title = {'変更確認'}
          />
        )}
      </Modal>
    );
  }
}

ChangeTitleModal.contextType = Context;

ChangeTitleModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  modal_data:PropTypes.object,
};

export default ChangeTitleModal;
