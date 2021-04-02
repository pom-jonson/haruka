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
// import RadioGroupButton from "~/components/molecules/RadioGroup";

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
  
  .checkbox-label{
    width: 30%;
    text-align: left;
  }
  .label-title{
    font-size: 1rem;
    width: 120px;
    height: 2rem;
    line-height: 2rem;
    margin-top: 0px;
   }
  .add-button {
      text-align: center;
      width:100%;
  }
  .checkbox_area {
    padding-left: 120px;
    label{
        font-size: 1rem;        
        input{
          font-size: 1rem;
          height: 15px !important;
        }
    }
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
  .short-input-group{
    display:flex;
    input{
        width:130px;
    }
    input{        
        line-height: 0.5rem;        
    }
    b {
      right: 4px !important;
    }
  }
  .medicine_code {
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px;
    margin-left: -20px;
    input {
      font-size: 1rem;
      width: 155px;
    }
    label {
      width: 120px;
      font-size: 1rem;
    }
    .husei-code label {
      width: 100px;
      margin-left: 10px;
    }
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      height: 2rem;
      margin-top: 8px;
      margin-left: 10px;
    }
    span {
      color: white;
    }
  }
  .kana_area {
    padding-top: 10px;
  }
  .name_area {
    padding-top: 20px;
  }
  .gender {
    font-size: 1rem;
    margin-top: 10px;
    margin-left: 15px;
    margin-bottom: 10px;
    .gender-label {
      width: 100px;
      margin-top: 8px;
      float: left;
    }
    .radio-group-btn label{
        font-size: 1rem;
        width: 45px;
        padding: 4px 4px;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 4px;
        margin-left: 5px;
    }
    .radio-group-btn:last-child {
        label {
            width: 85px;
        }
    }
  }
  
  .footer {
    display: flex;
    margin-top: 10px;
    text-align: center;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 30px;
    }
    
    span {
      color: white;
      font-size: 1rem;
      font-weight: 100;
    }
}
 `;


class InspectionModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    var id ="";
    var title = "";
    switch(parseInt(this.props.modal_type)){
      case 0:     //検査目的
        id = modal_data != null?modal_data.purpose_id:'';
        title = '検査目的'
        break;
      case 1:     //現症
        id = modal_data != null?modal_data.symptoms_id:'';
        title = '現症';
        break;
      case 2:     //依頼区分
        id = modal_data != null?modal_data.request_id:'';
        title = '依頼区分';
        break;
      case 3:     //患者移動形態
        id = modal_data != null?modal_data.movement_id:'';
        title = '患者移動形態';
        break;
      case 4:     //冠危険因子
        id = modal_data != null?modal_data.risk_factors_id:'';
        title = '冠危険因子';
        break;
      case 5:     //現病歴
        id = modal_data != null?modal_data.sick_history_id:'';
        title = '現病歴';
        break;
    }
    this.state = {
      is_enabled: modal_data !== null?modal_data.is_enabled:1,
      number: modal_data !== null ? modal_data.number : 0,
      order: modal_data != null? modal_data.order:null,
      id,
      title,
      name:modal_data !== null?modal_data.name:"",
      
      table_kind:this.props.modal_type,
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
    this.change_flag = 1;
    this.setState({id: parseInt(e)})
  };
  getName = e => {
    this.change_flag = 1;
    this.setState({name: e.target.value})
  };
  
  
  async registerMaster()  {
    let path = "/app/api/v2/master/inspection/registerMasterData";
    const post_data = {
      params: this.state
    };
    await apiClient.post(path, post_data).then((res)=>{
      if (res)
        window.sessionStorage.setItem("alert_messages", res.alert_message);
    });
  }
  
  handleOk = () => {
    if(this.state.id === '' || this.state.id <= 0 ){
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
    this.change_flag = 1;
    this.setState({order: parseInt(e)})
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
              <NumericInputWithUnitLabel
                label="表示順"
                value={this.state.order}
                getInputText={this.getOrder.bind(this)}
                inputmode="numeric"
              />
            </div>
            <InputWithLabel
              label={this.state.title + "名"}
              type="text"
              className="name-area"
              getInputText={this.getName.bind(this)}
              diseaseEditData={this.state.name}
            />            
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
          <Button className="cancel-btn" onClick={this.handleCloseModal}>閉じる</Button>
          <Button
            onClick={this.handleOk}            
            className={this.change_flag != 1 ? "disable-btn" : "red-btn"}
            isDisabled={this.change_flag != 1}
          >
            {this.props.modal_data !== null ? "変更" : "登録"}
          </Button>          
        </Modal.Footer>
      </Modal>
    );
  }
}

InspectionModal.contextType = Context;

InspectionModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk:   PropTypes.func,
  modal_data:PropTypes.object,
  modal_type : PropTypes.number,
};

export default InspectionModal;
