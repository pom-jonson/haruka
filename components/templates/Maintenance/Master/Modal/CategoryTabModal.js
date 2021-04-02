import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import Checkbox from "~/components/molecules/Checkbox";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  float: left;
  label {
      text-align: right;
      width: 80px;      
  }
  input {
    width: 400px;
    font-size: 1rem;
    height: 2rem;
    line-height: 2rem;
  }
  .short-input-group{    
    input{        
        line-height: 0.5rem;        
    }
    b {
      right: 4px !important;
    }
  }
  
  .checkbox-label{
    width: 30%;
    text-align: left;
  }
  .label-title{
    font-size: 1rem;
    width: 120px;
    height: 2rem;
    line-height: 2rem;
    margin-top: 0.1rem;
   }
  .pullbox-title{
    height: 2rem;
    line-height: 2rem;
    font-size: 1rem;
  }
  .pullbox-select{
    height: 2rem;
    font-size: 1rem;
  }
  .add-button {
      text-align: center;
      width:100%;
  }
  .checkbox_area {
    padding-left: 128px;
    label{
        font-size: 1rem;
        width: 100px;
        text-align: left;
        input{
          font-size: 1rem;
          height: 15px !important;
        }
    }
  }
 `;


class CategoryTabModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    var title = "", id;
    switch(this.props.kind){
      case 0:
        title = 'カテゴリ';
        id = modal_data !== null ? modal_data.outsourcing_inspection_category_id : '';
        break;
      case 1:
        title = 'タブ';
        id = modal_data !== null ? modal_data.outsourcing_inspection_tab_id : '';
        break;
    }
    
    this.state = {
      kind:this.props.kind,
      is_enabled: modal_data !== null?modal_data.is_enabled:1,
      number: modal_data !== null ? modal_data.number : 0,
      order: modal_data !== null ? modal_data.order : undefined,
      outsourcing_inspection_category_id: modal_data !== null ? modal_data.outsourcing_inspection_category_id : undefined,
      outsourcing_inspection_tab_id: modal_data !== null ? modal_data.outsourcing_inspection_tab_id : undefined,
      id,
      title,
      name:modal_data !== null?modal_data.name:"",
      
      isUpdateConfirmModal: false,
      isBackConfirmModal: false,
      confirm_message:"",
    }
    this.change_flag = 0;
  }
  
  getAlwaysShow = (name, value) => {
    if(name==="alwaysShow"){
      this.change_flag = 1;
      this.setState({is_enabled: value})
    }
  };
  getMasterID = e => {
    switch(this.props.kind){
      case 0:
        this.change_flag = 1;
        this.setState({id:parseInt(e), outsourcing_inspection_category_id:parseInt(e),})
        break;
      case 1:
        this.change_flag = 1;
        this.setState({id:parseInt(e), outsourcing_inspection_tab_id:parseInt(e),})
        break;
    }
  };
  
  getName = e => {
    this.change_flag = 1;
    this.setState({name: e.target.value})
  };
  
  getReceiptKey = e => {
    this.setState({receipt_key: e.target.value})
  }
  
  async registerMaster()  {
    var path = '';
    const post_data = {
      params: this.state
    };
    switch(this.props.kind){
      case 0:
        path = "/app/api/v2/master/examination/registerExamCategory";
        break;
      case 1:
        path = "/app/api/v2/master/examination/registerExamTab";
        break;
    }
    await apiClient.post(path, post_data).then((res)=>{
      if (res)
        window.sessionStorage.setItem("alert_messages", res.alert_message);
    });
  }
  
  handleOk = () => {
    if(this.state.id === undefined || this.state.id === '' || this.state.id <= 0){
      window.sessionStorage.setItem("alert_messages", 'IDを入力してください。');
      return;
    }
    if(this.state.name === ''){
      window.sessionStorage.setItem("alert_messages", '名称を入力してください。');
      return;
    }
    
    if(this.props.modal_data !== null){
      this.setState({
        isUpdateConfirmModal : true,
        confirm_message: this.state.title + "マスタ情報を変更しますか?",
      });
    } else {
      this.register();
    }
  };
  
  register = () => {
    this.registerMaster().then(() => {
      this.confirmCancel();
      this.props.handleOk();
    });
  }
  
  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isBackConfirmModal: false,
      confirm_message: "",
    });
  }
  
  getOrder = e => {
    this.setState({order: parseInt(e.target.value)})
  };

  handleCloseModal = () => {
    if (this.change_flag == 1) {
      this.setState({
        isBackConfirmModal: true,
        confirm_message:
          "登録していない内容があります。変更内容を破棄して移動しますか？",
      });
    } else {
      this.props.closeModal();
    }      
  }
  
  render() {
    return  (
      <Modal show={true} id="add_contact_dlg"  className="medicine-modal first-view-modal">
        <Modal.Header>
          <Modal.Title>{this.state.title}マスタ{this.props.modal_data != null?'編集':'登録'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="checkbox_area">
              <Checkbox
                label="常に表示"
                getRadio={this.getAlwaysShow.bind(this)}
                value={this.state.is_enabled}
                checked = {this.state.is_enabled ===1}
                name="alwaysShow"
              />
            </div>
            <div className="short-input-group">
              <NumericInputWithUnitLabel
                label={this.state.title+"ID"}
                value={this.state.id}
                disabled = {this.props.modal_data!=null?true:false}
                getInputText={this.getMasterID.bind(this)}
                inputmode="numeric"
              />
              {/* <InputWithLabel
                                label="表示順"
                                type="number"
                                getInputText={this.getOrder.bind(this)}
                                diseaseEditData={this.state.order}
                            /> */}
            </div>
            <InputWithLabel
              label={this.state.title + '名'}
              type="text"
              className="name-area"
              getInputText={this.getName.bind(this)}
              diseaseEditData={this.state.name}
            />
            {/* {this.props.kind != 0 && (
                            <div className = "display_order">
                                <InputWithLabel
                                    label="会計用キー"
                                    type="text"
                                    getInputText={this.getReceiptKey.bind(this)}
                                    diseaseEditData={this.state.receipt_key}
                                />
                            </div>
                        )} */}
          </Wrapper>
          {this.state.isUpdateConfirmModal !== false && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.register.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.isBackConfirmModal !== false && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.props.closeModal}
              confirmTitle={this.state.confirm_message}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className={`cancel-btn`} onClick={this.handleCloseModal}>キャンセル</Button>
          <Button className={this.change_flag == 1 ? "red-btn":"disable-btn"} onClick={this.handleOk} isDisabled={this.change_flag == 0}>{this.props.modal_data !== null ? "変更" : "登録"}</Button>          
        </Modal.Footer>
      </Modal>
    );
  }
}

CategoryTabModal.contextType = Context;

CategoryTabModal.propTypes = {
  closeModal : PropTypes.func,
  handleOk : PropTypes.func,
  modal_data : PropTypes.object,
  kind : PropTypes.number,
};

export default CategoryTabModal;