import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Button from "~/components/atoms/Button";
import $ from "jquery";
import {harukaValidate} from "~/helpers/haruka_validate";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import * as apiClient from "~/api/apiClient";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";

const Wrapper = styled.div`  
  width: 100%;
  height: 100%;
  font-size: 1rem;
  overflow-y:auto;
  .flex{display: flex;}
 .input-comment {
    width:100%;
    div {margin-top:0;}
    .label-title {
      width:10rem;
      font-size:1rem;
      line-height:2rem;
      margin:0;
    }
    input {
      width:calc(100% - 10rem);
      font-size:1rem;
      height:2rem;
    }
 }
`;

class RegisterComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: props.comment,
      check_message:"",
      confirm_type:"",
      confirm_title:'',
      confirm_message:"",
      complete_message:"",
      alert_type:"",
      alert_title:"",
      alert_messages:"",
    };
    this.change_flag = 0;
  }
  
  setTextValue = (key,e) => {
    this.setState({[key]: e.target.value});
  }
  
  confirmRegister=()=>{
    if(this.props.comment == this.state.comment){return;}
    let error = this.checkValidation();
    if (error.length > 0) {
      let check_message = "";
      error.map(str=>{
        check_message = check_message + (this.props.comment_type === "remit_comment" ? "差し戻し" : "訂正依頼") + str + "\n";
      });
      this.setState({ check_message});
      return;
    }
    this.setState({
      confirm_type:"register",
      confirm_title:'登録確認',
      confirm_message:"登録しますか？",
    });
  }
  
  closeModal=()=>{
    if(this.state.alert_type === "modal_close"){
      this.props.closeModal('modal_close');
    }
    this.setState({
      confirm_type:"",
      confirm_title:'',
      confirm_message:"",
      alert_type:"",
      alert_title:"",
      alert_messages:"",
    });
  }
  
  componentDidUpdate() {
    harukaValidate('karte', 'summary', 'comment_register', this.state, 'background');
  }
  
  checkValidation = () => {
    let error_str_arr = [];
    let validate_data = harukaValidate('karte', 'summary', 'discharge_summary', this.state);
    if (validate_data.error_str_arr.length > 0) {
      error_str_arr = validate_data.error_str_arr;
    }
    if (validate_data.first_tag_id != "") {
      this.setState({ first_tag_id: validate_data.first_tag_id });
    }
    return error_str_arr;
  };
  
  closeValidateAlertModal = () => {
    this.setState({check_message: ""});
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null) {
      $("#" + first_tag_id).focus();
    }
  };
  
  confirmModalClose=()=>{
    if(this.state.comment !== ""){
      this.setState({
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type:"modal_close",
        confirm_title:'入力中',
      });
    } else {
      this.props.closeModal();
    }
  }
  
  confirmOk=()=>{
    if(this.state.confirm_type === "modal_close"){
      this.props.closeModal();
    }
    if(this.state.confirm_type === "register"){
      this.register();
    }
  }
  
  register=async()=>{
    this.setState({
      complete_message:"登録中",
      confirm_type : "",
      confirm_title : "",
      confirm_message : "",
    });
    let path = "/app/api/v2/ward/summary/hospital_discharge/change_status";
    let post_data = {
      number:this.props.number,
      comment:this.state.comment,
      type:this.props.comment_type,
    };
    await apiClient.post(path, {params: post_data})
      .then(res => {
        this.setState({
          complete_message:"",
          alert_type:res.alert_message !== undefined ? "modal_close" : "",
          alert_title:"登録確認",
          alert_messages:res.alert_message !== undefined ? res.alert_message : res.error_message,
        });
      })
      .catch(()=> {
        this.setState({complete_message:""});
      })
  }

  render() {
    return (
      <>
        <Modal
          show={true}
          className="register-comment first-view-modal"
        >
          <Modal.Header><Modal.Title>コメント登録</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className='input-comment'>
                <InputWithLabelBorder
                  label={this.props.comment_type === "remit_comment" ? "差し戻しコメント" : "訂正依頼コメント"}
                  type="text"
                  id={'comment_id'}
                  getInputText={this.setTextValue.bind(this, "comment")}
                  diseaseEditData = {this.state.comment}
                />
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.confirmModalClose}>キャンセル</Button>
            <Button className={(this.props.comment != this.state.comment) ? 'red-btn' : 'disable-btn'} onClick={this.confirmRegister}>確定</Button>
          </Modal.Footer>
          {this.state.check_message !== "" && (
            <ValidateAlertModal
              handleOk={this.closeValidateAlertModal}
              alert_meassage={this.state.check_message}
            />
          )}
          {this.state.confirm_message !== "" && (
            <ConfirmNoFocusModal
              hideConfirm= {this.closeModal.bind(this)}
              confirmCancel= {this.closeModal.bind(this)}
              confirmOk= {this.confirmOk.bind(this)}
              confirmTitle= {this.state.confirm_message}
              title= {this.state.confirm_title}
            />
          )}
          {this.state.complete_message !== '' && (
            <CompleteStatusModal
              message = {this.state.complete_message}
            />
          )}
          {this.state.alert_messages !== "" && (
            <AlertNoFocusModal
              hideModal= {this.closeModal}
              handleOk= {this.closeModal}
              showMedicineContent= {this.state.alert_messages}
              title= {this.state.alert_title}
            />
          )}
        </Modal>
      </>
    );
  }
}

RegisterComment.propTypes = {
  closeModal: PropTypes.func,
  setComment: PropTypes.func,
  comment_type: PropTypes.string,
  comment: PropTypes.string,
  number: PropTypes.number,
};

export default RegisterComment;
