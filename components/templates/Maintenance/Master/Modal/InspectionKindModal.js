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
  font-size: 1rem;
  width: 100%;
  height: 100%;
  div {margin-top:0;}
  .label-title {
    text-align: right;
    width: 7rem;
    margin:0;
    margin-right:0.5rem;
    font-size: 1rem;
  }
  label {
    font-size:1rem;
    line-height:2rem;
  }
  input {
    width: calc(100% - 7.5rem);
    font-size: 1rem;
    height:2rem;
  }
  .checkbox_area {
    padding-left: 7.5rem;
    input {height: 15px !important;}
  }
 `;


class InspectionKindModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    let title = "";
    switch(this.props.kind){
      case 0:     //検査分類2
        title = '検査分類2';
        break;
      case 1:     //検査分類1
        title = '検査分類1';
        break;
    }
    this.state = {
      kind:this.props.kind,
      is_enabled: modal_data != null ? modal_data.is_enabled : 1,
      number: modal_data !== null ? modal_data.number : 0,
      inspection_id : this.props.inspection_id,
      classification1_id : modal_data != null ? modal_data.classification1_id : ((this.props.classification1_id !=null && this.props.classification1_id !='')?this.props.classification1_id:''),
      classification2_id : modal_data != null ? modal_data.classification2_id : undefined,
      title,
      name:modal_data !== null?modal_data.name:"",
      receipt_key:modal_data !== null?modal_data.receipt_key:undefined,
      require_body_parts: modal_data != null ? modal_data.require_body_parts : 0,
      exception_handling_name: (modal_data != null && modal_data.exception_handling_name != null) ? modal_data.exception_handling_name : "",
      isUpdateConfirmModal: false,
      isBackConfirmModal: false,
      confirm_message:"",
    }
    this.change_flag = 0;
  }
  
  getAlwaysShow = (name, value) => {
    this.change_flag = 1;
    this.setState({[name]:value});
  };
  
  getMasterID = e => {
    this.change_flag = 1;
    if (this.props.kind ==1){
      this.setState({classification1_id: parseInt(e)});
    } else {
      this.setState({classification2_id: parseInt(e)});
    }
  };
  
  getReceiptKey = e => {
    this.change_flag = 1;
    this.setState({receipt_key: e.target.value})
  };
  
  getName = e => {
    this.change_flag = 1;
    this.setState({name: e.target.value})
  };
  
  async registerMaster()  {
    let path = "/app/api/v2/master/inspection/registerKindMaster";
    const post_data = {
      params: this.state
    };
    await apiClient.post(path, post_data).then((res)=>{
      if (res)
        window.sessionStorage.setItem("alert_messages", res.alert_message);
    });
  }
  
  handleOk = () => {
    if(this.state.classification1_id === undefined || this.state.classification1_id === '' || this.state.classification1_id <= 0){
      window.sessionStorage.setItem("alert_messages", '検査分類1マスタIDを入力してください。');
      return;
    }
    if((this.state.classification2_id === undefined || this.state.classification2_id === '' || this.state.classification2_id <= 0) && this.props.kind != 1){
      window.sessionStorage.setItem("alert_messages", '検査分類2マスタIDを入力してください。');
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
  
  setExceptionHandlingName = e => {
    this.change_flag = 1;
    this.setState({exception_handling_name: e.target.value})
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
          <Modal.Title>{this.state.title}マスタ編集</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="checkbox_area">
              <Checkbox
                label="常に表示"
                getRadio={this.getAlwaysShow.bind(this)}
                value={this.state.is_enabled}
                checked = {this.state.is_enabled === 1}
                name="is_enabled"
              />
            </div>
            <div className="">
              <NumericInputWithUnitLabel
                label={this.props.kind==1?'検査分類1ID':'検査分類2ID'}
                value={this.props.kind==1?this.state.classification1_id:this.state.classification2_id}
                disabled = {this.props.modal_data!=null?true:false}
                getInputText={this.getMasterID.bind(this)}
                inputmode="numeric"
              />
            </div>
            <div style={{marginTop:"0.5rem"}}>
              <InputWithLabel
                label={this.props.kind==1?'検査分類1名':'検査分類2名'}
                type="text"
                className="name-area"
                getInputText={this.getName.bind(this)}
                diseaseEditData={this.state.name}
              />
            </div>
            <div style={{marginTop:"0.5rem"}}>
              <InputWithLabel
                label="会計用キー"
                type="text"
                getInputText={this.getReceiptKey.bind(this)}
                diseaseEditData={this.state.receipt_key}
              />
            </div>
            <div className="checkbox_area">
              <Checkbox
                label="部位必須"
                getRadio={this.getAlwaysShow.bind(this)}
                value={this.state.require_body_parts}
                checked = {this.state.require_body_parts === 1}
                name="require_body_parts"
              />
            </div>
            {this.props.kind == 1 && (
              <div>
                <InputWithLabel
                  label="例外処理名"
                  type="text"
                  getInputText={this.setExceptionHandlingName.bind(this)}
                  diseaseEditData={this.state.exception_handling_name}
                />
              </div>
            )}
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
          <Button className="cancel-btn" onClick={this.handleCloseModal}>キャンセル</Button>
          <Button className={this.change_flag === 1 ? "red-btn" : "disable-btn"} onClick={this.handleOk}>{this.props.modal_data !== null ? "変更" : "登録"}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

InspectionKindModal.contextType = Context;
InspectionKindModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk:   PropTypes.func,
  modal_data:PropTypes.object,
  first_kind_number : PropTypes.number,
  classification1_id: PropTypes.number,
  kind : PropTypes.number,
  inspection_id:PropTypes.string,
};
export default InspectionKindModal;
