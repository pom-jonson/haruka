import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import {formatDateLine} from "~/helpers/date"
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import {addRedBorder, removeRedBorder, addRequiredBg, removeRequiredBg} from "~/helpers/dialConstants";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from "jquery";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  float: left;
.flex {
  display: flex;
  flex-wrap: wrap;
}
  .left-area {
    width: 100%;
    .react-datepicker-wrapper {
        width: 100%;
        .react-datepicker__input-container {
            width: 100%;
            input {
                font-size: 1rem;
                width: 100%;
                height: 2.5rem;
                border-radius: 4px;
                border-width: 1px;
                border-style: solid;
                border-color: rgb(206, 212, 218);
                border-image: initial;
                padding: 0px 8px;
            }
        } 
    }
    .description {
      width: 100%;
      padding-top: 15px;
      .input-text-area {
          width: 100%;
          textarea {
              overflow-y: scroll;
              font-size:20px;
              font-family: "MS Gothic";              
          }
      }
    }
  }
  .label-title {
    width: 5rem;
    font-size: 20px;
    text-align: left;
    margin-top: 0.3rem;    
    margin-right: 10px;
  }
 `;

class AttentionModal extends Component {
    constructor(props) {
      super(props);
      let modal_data = this.props.modal_data;     
      this.state={
        id: modal_data == null ? 0 : modal_data.number,
        regist_date: modal_data !== null && modal_data.regist_date !== undefined ? new Date(modal_data.regist_date) : new Date(),
        attention: modal_data !== null && modal_data.attention !== undefined ? modal_data.attention : "",
    
        isUpdateConfirmModal: false,
        isCloseConfirmModal:false,
        confirm_message: "",
        alert_message:'',
        confirm_alert_title:'',
      }
      this.change_flag = false;
      this.original = JSON.stringify(this.state);
    }

    componentDidMount () {
      this.changeBackground();
    }
  
    componentDidUpdate () {
      this.changeBackground();
    }

    changeBackground = () => {
      if (this.state.regist_date == "" || this.state.regist_date == null) {
        addRequiredBg("regist_date_id");
      } else {
        removeRequiredBg("regist_date_id");
      }
      if (this.state.attention == "") {
        addRequiredBg("attention_id");
      } else {
        removeRequiredBg("attention_id");
      }
    }

    checkValidation() {
      removeRedBorder('regist_date_id');
      removeRedBorder('attention_id');
      let error_str_arr = [];
      let error_arr = [];
      if (this.state.regist_date == undefined  || this.state.regist_date == null || this.state.regist_date == ""){
        error_str_arr.push("日付を入力してください。");
        error_arr.push({
          state_key: 'regist_date_id',
          error_msg: "日付を入力してください。",
          error_type: 'blank',
          tag_id:'regist_date_id'
        });
        addRedBorder('regist_date_id')
      }
      if (this.state.attention == ''){
        error_str_arr.push("注意点を入力してください。");
        error_arr.push({
          state_key: 'attention_id',
          error_msg: "注意点を入力してください。",
          error_type: 'blank',
          tag_id:'attention_id'
        });
        addRedBorder('attention_id')
      }

      if(this.state.attention.length > 100){
        error_str_arr.push("注意点は100文字以下で入力してください。");
        error_arr.push({
          state_key: 'attention_id',
          error_msg: "注意点は100文字以下で入力してください。",
          error_type: 'blank',
          tag_id:'attention_id'
        });
        addRedBorder('attention_id');
      }
      this.setState({error_arr});
      return error_str_arr;
    }
    
    closeAlertModal = () => {
      this.setState({alert_message: ''});
      if(this.state.error_arr.length > 0){
        let first_obj = this.state.error_arr[0];
        $("#" + first_obj.tag_id).focus();
      }
    }

    handleOk = () => {
      if (this.change_flag == false) return;
      var error = this.checkValidation();
      if (error.length > 0){
        this.setState({alert_message:error.join('\n')});        
        return;
      }
      this.setState({
        isUpdateConfirmModal:true,
        confirm_message:this.state.id>0?'変更しますか？':'登録しますか？'
      })
    };

    register = () => {
      this.change_flag = false;
      this.confirmCancel();
      let postData = {            
        regist_date: formatDateLine(this.state.regist_date),
        attention: this.state.attention,
      };        
      if (this.state.id != null && this.state.id > 0 ) {
        postData.number = this.state.id;
      }
      this.props.handleOk(postData);
    }

    getPlannedDate = value => {
        this.setState({regist_date: value});
    };

    getSending = (e) => {
        this.setState({attention:e.target.value});
    };

    confirmCancel() {
      this.setState({
          isUpdateConfirmModal: false,
          isCloseConfirmModal:false,
          confirm_message: "",
          confirm_alert_title:'',
      });
    }
  
    close = () => {
      if (this.change_flag){
        this.setState({
          isCloseConfirmModal:true,
          confirm_message:'登録していない内容があります。\n変更内容を破棄して移動しますか？',
          confirm_alert_title:'入力中',
        })
      } else {
        this.closeThisModal();
      }
    }
    
    closeThisModal = () => {
      this.confirmCancel();
      this.props.closeModal();
      this.change_flag = false;
    }

    onHide=()=>{};

    render() {
        const is_add = this.state.id;        
        if (this.original != JSON.stringify(this.state)){
          this.change_flag = true;
        } else {
          this.change_flag = false;
        }        
        return  (
            <Modal show={true} onHide={this.onHide} id="add_contact_dlg"  className="master-modal add-infection-modal attention-input-modal first-view-modal">
                <Modal.Header>
                    <Modal.Title>注意点{is_add > 0 ? '編集' : '追加'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                        <div className="flex">
                            <div className="left-area">                                
                                <div className="flex">
                                    <div className="select-day">
                                        <InputWithLabelBorder
                                            label="日付"
                                            type="date"
                                            getInputText={this.getPlannedDate}
                                            diseaseEditData={this.state.regist_date}
                                            id= 'regist_date_id'
                                        />
                                    </div>                                    
                                </div>
                                <div className="description flex">
                                    <div className="label-title">注意点</div>
                                    <div className="input-text-area">
                                        <textarea
                                          cols="50"
                                          rows="7"
                                          onChange={this.getSending.bind(this)}
                                          value={this.state.attention}
                                          id = 'attention_id'
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>                        
                    </Wrapper>                    
                </Modal.Body>
                <Modal.Footer>
                  <Button className="cancel-btn" onClick={this.close}>キャンセル</Button>
                  <Button className={this.change_flag ? "red-btn" : "disable-btn"} onClick={this.handleOk}>{is_add > 0 ? '変更' : '登録'}</Button>
                </Modal.Footer>
                {this.state.isUpdateConfirmModal !== false && (
                  <SystemConfirmJapanModal
                      hideConfirm= {this.confirmCancel.bind(this)}
                      confirmCancel= {this.confirmCancel.bind(this)}
                      confirmOk= {this.register.bind(this)}
                      confirmTitle= {this.state.confirm_message}
                  />
                )}
                {this.state.isCloseConfirmModal !== false && (
                  <SystemConfirmJapanModal
                      hideConfirm= {this.confirmCancel.bind(this)}
                      confirmCancel= {this.confirmCancel.bind(this)}
                      confirmOk= {this.closeThisModal.bind(this)}
                      confirmTitle= {this.state.confirm_message}
                      title = {this.state.confirm_alert_title}
                  />
                )}
                {this.state.alert_message != "" && (
                  <ValidateAlertModal
                    handleOk={this.closeAlertModal}
                    alert_meassage={this.state.alert_message}
                  />
                )}
            </Modal>
        );
    }
}

AttentionModal.contextType = Context;

AttentionModal.propTypes = {
    modal_data: PropTypes.object,
    closeModal: PropTypes.func,
    handleOk: PropTypes.func,
};

export default AttentionModal;
