import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import * as apiClient from "~/api/apiClient";
import { masterValidate } from "~/helpers/validate";
import {removeRedBorder} from "~/helpers/dialConstants";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from "jquery";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";

const Wrapper = styled.div`
  display: block;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  .flex {display:flex;}
  div {margin-top:0;}
  .checkbox-area label {
    line-height:2rem;
    font-size: 1rem;
  }
  .label-title {
    font-size: 1rem;
    width: 5rem;
    line-height:2rem;
    margin:0;
  }
  .input-number{
     .label-title{
      width: 4rem;
      margin-left:1rem;
    }
    input{
      ime-mode: inactive;
    }
  }
  .label-unit {display:none;}
  .input-text input {
    font-size: 1rem;
    width: 30rem;
    height:2rem;
    ime-mode: active;
  }
  .react-numeric-input input {
    font-size: 1rem;
    height:2rem;
  }
  .text-area{
    width:30rem;
    height: 32rem;
    overflow-y:auto;
    border:1px solid rgb(206, 212, 218);
    textarea {
      font-family: MS Gothic,monospace;
      font-size: 14px;
    }
  }
`;

class UserWordModal extends Component {
  constructor(props) {
    super(props);
    let name = props.modal_data != null ? props.modal_data.word : "";
    let name_arr = name.split('<br>' + '\r\n');
    if(name_arr.length > 1){
      name = "";
      name_arr.map((word, index)=>{
        name = name + word;
        if(index != name_arr_length - 1){
          name = name + '\n';
        }
      });
    }
    name_arr = name.split('<br>' + '\n');
    if(name_arr.length > 1){
      name = "";
      name_arr.map((word, index)=>{
        name = name + word;
        if(index != name_arr_length - 1){
          name = name + '\n';
        }
      });
    }
    name_arr = name.split('<br>');
    let name_arr_length = name_arr.length;
    if(name_arr_length > 1){
      name = "";
      name_arr.map((word, index)=>{
        name = name + word;
        if(index != name_arr_length - 1){
          name = name + '\n';
        }
      });
    }
    this.state = {
      confirm_type: "",
      confirm_title: "",
      confirm_message: "",
      alert_message: "",
      check_message: "",
      number: props.modal_data != null ? props.modal_data.number : 0,
      is_enabled: props.modal_data != null ? props.modal_data.is_enabled : 1,
      title: props.modal_data != null ? props.modal_data.title : "",
      name,
      name_kana: props.modal_data != null ? props.modal_data.word_kana : "",
      order: props.modal_data != null ? props.modal_data.order : 0,
    };
    this.change_flag = 0;
  }

  componentDidMount() {
    this.changeBackground();
  }

  componentDidUpdate() {
    this.changeBackground();
  }

  changeBackground = () => {
    masterValidate("user_word", this.state, 'background');
  };

  checkValidation = () => {
    removeRedBorder("title_id");
    removeRedBorder("name_id");
    let error_str_arr = [];
    let validate_data = {};
    validate_data = masterValidate("user_word", this.state);
    if (validate_data.error_str_arr.length > 0) {
      error_str_arr = validate_data.error_str_arr;
    }
    if (validate_data.first_tag_id != "") {
      this.setState({ first_tag_id: validate_data.first_tag_id });
    }
    return error_str_arr;
  };

  closeAlertModal = () => {
    this.setState({ check_message: ""});
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null) {
      $("#" + first_tag_id).focus();
    }
  };
  
  setTextValue = (key,e) => {
    this.change_flag = 1;
    this.setState({[key]: e.target.value});
  }

  saveWord = async () => {
    if(this.change_flag == 0){return;}
    let error = this.checkValidation();
    if (error.length > 0) {
      this.setState({ check_message: error.join("\n") });
      return;
    }
    this.setState({
      confirm_type: "register",
      confirm_title: (this.props.modal_data == null ? "登録" : "編集") + "確認",
      confirm_message: (this.props.modal_data == null ? "登録" : "編集") + "しますか？",
    });
  };

  handleSaveWord = async () => {
    let path = "/app/api/v2/dial/board/registerWord";
    let name = this.state.name;
    // let name_arr = name.split('\n');
    // let name_arr_length = name_arr.length;
    // if(name_arr_length > 1){
    //   name = "";
    //   name_arr.map((word, index)=>{
    //     name = name + word;
    //     if(index != name_arr_length - 1){
    //       name = name + '<br>';
    //     }
    //   });
    // }
    let post_data = {
      pattern_number:this.props.pattern_number,
      number:this.state.number,
      is_enabled:this.state.is_enabled,
      order:this.state.order,
      is_private:1,
      title:this.state.title,
      name,
      name_kana:this.state.name_kana,
    };
    await apiClient
      ._post(path, {
        params: post_data,
      })
      .then(() => {
        this.setState({
          confirm_type:"register_close",
          confirm_message:"",
          confirm_title:(this.props.modal_data == null ? "登録" : "編集") + "完了",
          alert_message:(this.props.modal_data == null ? "登録" : "編集") + "しました。",
        });
      })
      .catch(() => {});
  };

  handleClose = () => {
    if (this.change_flag == 1) {
      this.setState({
        confirm_type: "modal_close",
        confirm_title: "入力中",
        confirm_message:"登録していない内容があります。\n変更内容を破棄して閉じますか？",
      });
    } else {
      this.props.closeModal();
    }
  };

  confirmCancel = () => {
    this.setState({
      confirm_type: "",
      confirm_title: "",
      confirm_message: "",
    });
  };
  
  confirmOk=()=>{
    if(this.state.confirm_type === "modal_close"){
      this.props.closeModal();
    }
    if(this.state.confirm_type === "register"){
      this.handleSaveWord();
    }
    if(this.state.confirm_type === "register_close"){
      this.props.handleOk(this.props.pattern_number);
      this.props.closeModal();
    }
  }

  render() {
    return (
      <Modal show={true} className="wordPattern-modal master-modal first-view-modal">
        <Modal.Header>
          <Modal.Title>入力テンプレート{this.props.modal_data == null ? "登録" : "編集"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className={'input-text'}>
              <InputWithLabelBorder
                label="タイトル"
                type="text"
                placeholder=""
                getInputText={this.setTextValue.bind(this, 'title')}
                diseaseEditData={this.state.title}
                id="title_id"
              />
            </div>
            <div className={'flex'} style={{marginTop:"0.5rem"}}>
              <div className={'label-title'}>本文</div>
              <div className={'text-area'}>
                <textarea
                  value={this.state.name}
                  style={{width:"100%", height:"100%"}}
                  id={'name_id'}
                  onChange={this.setTextValue.bind(this, 'name')}
                />
              </div>
            </div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <div onClick={this.handleClose.bind(this)} className={"custom-modal-btn cancel-btn"} style={{cursor:"pointer"}} id='cancel_btn'>
            <span>キャンセル</span>
          </div>
          <div onClick={this.saveWord.bind(this)} className={"custom-modal-btn " + (this.change_flag == 0 ? "disable-btn" : "red-btn")} style={{cursor:"pointer"}}>
            <span>{this.props.modal_data == null ? "登録" : "編集"}</span>
          </div>
        </Modal.Footer>
        {this.state.confirm_message !== "" && (
          <ConfirmNoFocusModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.confirmOk.bind(this)}
            confirmTitle={this.state.confirm_message}
            title={this.state.confirm_title}
          />
        )}
        {this.state.check_message !== "" && (
          <ValidateAlertModal
            handleOk={this.closeAlertModal}
            alert_meassage={this.state.check_message}
          />
        )}
        {this.state.alert_message !== "" && (
          <AlertNoFocusModal
            showMedicineContent={this.state.alert_message}
            hideModal={this.confirmOk.bind(this)}
            handleOk={this.confirmOk.bind(this)}
            title={this.state.confirm_title}
          />
        )}
      </Modal>
    );
  }
}

UserWordModal.contextType = Context;
UserWordModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  modal_data: PropTypes.object,
  pattern_number: PropTypes.number,
};
export default UserWordModal;
