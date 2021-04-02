import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Button from "~/components/atoms/Button";
import $ from "jquery";
import {harukaValidate} from "~/helpers/haruka_validate";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";

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
      create_comment: props.create_comment,
      approval_comment: props.approval_comment,
      check_message:"",
    };
    this.change_flag = 0;
  }
  
  setTextValue = (key,e) => {
    this.change_flag = 1;
    this.setState({[key]: e.target.value});
  }
  
  confirmRegister=()=>{
    if(this.change_flag == 0){
      return;
    }
    let error = this.checkValidation();
    if (error.length > 0) {
      this.setState({ check_message: error.join("\n") });
      return;
    }
    this.props.setComment(this.state.create_comment, this.state.approval_comment);
  }
  
  closeModal=()=>{
    this.setState({alert_messages: ""});
  }
  
  componentDidUpdate() {
    harukaValidate('karte', 'nurse_summary', 'approve_summary', this.state, 'background');
  }
  
  checkValidation = () => {
    let error_str_arr = [];
    let validate_data = harukaValidate('karte', 'nurse_summary', 'approve_summary', this.state);
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

  render() {
    return (
      <>
        <Modal
          show={true}
          className="custom-modal-sm register-comment first-view-modal"
        >
          <Modal.Header><Modal.Title>コメント入力</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className='input-comment'>
                <InputWithLabelBorder
                  label="差し戻しコメント"
                  type="text"
                  id={'create_comment_id'}
                  getInputText={this.setTextValue.bind(this, "create_comment")}
                  diseaseEditData = {this.state.create_comment}
                />
              </div>
              <div className='input-comment' style={{marginTop:"1rem"}}>
                <InputWithLabelBorder
                  label="承認／却下コメント"
                  type="text"
                  id={'approval_comment_id'}
                  getInputText={this.setTextValue.bind(this, "approval_comment")}
                  diseaseEditData = {this.state.approval_comment}
                />
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            <Button className={this.change_flag == 1 ? 'red-btn' : 'disable-btn'} onClick={this.confirmRegister}>確定</Button>
          </Modal.Footer>
          {this.state.check_message != "" && (
            <ValidateAlertModal
              handleOk={this.closeValidateAlertModal}
              alert_meassage={this.state.check_message}
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
  create_comment: PropTypes.string,
  approval_comment: PropTypes.string,
};

export default RegisterComment;
