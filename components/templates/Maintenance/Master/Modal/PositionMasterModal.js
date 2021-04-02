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
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";

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
    height: 2.375rem;
  }
  
  .checkbox-label{
    width: 30%;
    text-align: left;
  }
  .label-title{
    font-size: 1rem;
    width: 120px;
    line-height: 2.375rem;
    margin-top: 0;
    margin-bottom: 0;
   }
  .checkbox_area {
    margin-left: 128px;
    label{
        font-size: 1rem;
        width: 100px;
        text-align: left;
    }
    input {
        height: 15px;
    }
  }
  .short-input-group{
      display:flex;
      input{
          width:130px;
      }
  }
 `;


class PositionMasterModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    this.state = {
      is_enabled: modal_data !== null?modal_data.is_enabled:1,
      number: modal_data !== null ? modal_data.number : 0,
      part_id : modal_data !== null ? modal_data.part_id : ((this.props.part_id!=null && this.props.part_id!='')?this.props.part_id:''),
      position_id : modal_data !== null ? modal_data.position_id : undefined,
      order: modal_data !== null ? modal_data.order : undefined,
      title:'位置',
      name:modal_data !== null?modal_data.name:"",
      isUpdateConfirmModal: false,
      confirm_message:"",
      alert_messages:"",
    }
    this.change_flag = 0;
  }
  
  getAlwaysShow = (name, value) => {
    if(name==="alwaysShow"){
      this.setState({is_enabled: value});
      this.change_flag = 1;
    }
  };
  getMasterID = e => {
    this.setState({position_id: parseInt(e)})
    this.change_flag = 1;
  };
  getOrder = e => {
    this.setState({order: parseInt(e)});
    this.change_flag = 1;
  };
  getName = e => {
    this.setState({name: e.target.value});
    this.change_flag = 1;
  };
  
  
  async registerMaster()  {
    let path = "/app/api/v2/master/treat/registerPosition";
    const post_data = {
      params: this.state
    };
    await apiClient.post(path, post_data).then(()=>{
      let alert_messages = this.props.modal_data !== undefined && this.props.modal_data != null ? "変更しました。": "登録しました。";
      this.setState({alert_messages, alert_action: "close"});
    });
  }
  
  handleOk = () => {
    if(this.state.part_id === undefined || this.state.part_id == '' || this.state.part_id <= 0){
      this.setState({alert_messages: '部位マスタを選択してください。'});
      return;
    }
    
    if((this.state.position_id === undefined || this.state.position_id == '' || this.state.position_id <= 0)){
      this.setState({alert_messages: '位置マスタIDを選択してください。'});
      return;
    }
    
    if(this.state.name === ''){
      this.setState({alert_messages: '名称を入力してください。'});
      return;
    }
    
    if(this.props.modal_data !== null){
      this.setState({
        confirm_message: this.state.title + "マスタ情報を変更しますか?",
        confirm_action: "register"
      });
    } else {
      this.setState({
        confirm_message: this.state.title + "マスタ情報を登録しますか?",
        confirm_action: "register"
      });
    }
  };
  
  register = () => {
    this.registerMaster();
  }
  
  confirmCancel() {
    this.setState({
      confirm_message: "",
      confirm_alert_title: "",
      confirm_action: "",
      alert_messages: "",
      alert_action: ""
    });
    if (this.state.alert_action === "close") {
      this.props.handleOk();
    }
  }
  confirmOk = () => {
    this.confirmCancel();
    if (this.state.confirm_action === "close") {
      this.props.closeModal();
    } else if (this.state.confirm_action === "register") {
      this.register();
    }
  }
  
  closeModal = () => {
    if(this.change_flag == 1) {
      this.setState({
        confirm_message: "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_alert_title:'入力中',
        confirm_action: "close"
      });
      return;
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
                checked = {this.state.is_enabled ===1}
                name="alwaysShow"
              />
            </div>
            <div className="short-input-group">
              <NumericInputWithUnitLabel
                label='位置ID'
                value={this.state.position_id}
                disabled = {this.props.modal_data!=null?true:false}
                getInputText={this.getMasterID.bind(this)}
                inputmode="numeric"
              />
              <NumericInputWithUnitLabel
                label="表示順"
                value={this.state.order}
                getInputText={this.getOrder.bind(this)}
                inputmode="numeric"
              />
            </div>
            <InputWithLabel
              label='位置名'
              type="text"
              className="name-area"
              getInputText={this.getName.bind(this)}
              diseaseEditData={this.state.name}
            />
          </Wrapper>
          {this.state.confirm_message !== "" && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.confirmOk.bind(this)}
              confirmTitle= {this.state.confirm_message}
              title={this.state.confirm_alert_title}
            />
          )}
          {this.state.alert_messages !== "" && (
            <AlertNoFocusModal
              hideModal= {this.confirmCancel.bind(this)}
              handleOk= {this.confirmCancel.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.closeModal}>閉じる</Button>
          <Button className={this.change_flag == 1 ? "red-btn" :"disable-btn"} onClick={this.handleOk}>{this.props.modal_data !== null ? "変更" : "登録"}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

PositionMasterModal.contextType = Context;

PositionMasterModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk:   PropTypes.func,
  modal_data:PropTypes.object,
  first_kind_number : PropTypes.number,
  part_id : PropTypes.number,
};

export default PositionMasterModal;