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
    font-size:1rem;
    line-height:2rem;
    margin-bottom: 0px;
  }
  input {
    width: 400px;
    font-size: 1rem;
    height: 2rem;
    line-height: 2rem;
    margin-top:0px;
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
    text-align: right;
  }
  .add-button {
      text-align: center;
      width:100%;
  }
  .pullbox-title{
    height: 2rem;
    line-height: 2rem;
    margin-right: 8px !important;
    width: 100px !important;
    font-size: 1rem;
  }
  .pullbox-select{
    height: 2rem;
    font-size: 1rem;
  }
  .checkbox_area {
    padding-left: 128px;
    .form-control{
      height: 2rem;
      line-height: 2rem;
      font-size: 1rem;
    }
    label {
      margin-top: 0.1rem;
      font-size: 1rem;
      text-align: left;
      width: 100px;
      height: 2rem;
      line-height: 2rem;
      input{
        font-size: 1rem;
        height: 15px !important;
      }      
    }
  }
  .numeric-area{    
    input{
      height:2rem;
      margin-top: 0px;
      line-height: normal;
    }
    .label-title{
      margin-top:0.1rem;
    }
    .display-order{
      .label-title{
        width: 70px;
      }
    }
  }
`;

class ExamSetModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    this.state = {
      is_enabled: modal_data !== null?modal_data.is_enabled:1,
      number: modal_data !== null ? modal_data.number : 0,
      sort_number: modal_data !== null ? modal_data.sort_number : undefined,
      outsourcing_inspection_set_id: modal_data !== null ? modal_data.outsourcing_inspection_set_id : undefined,
      title:'検査セット',
      name:modal_data !== null?modal_data.name:"",
      isBackConfirmModal: false,
      isUpdateConfirmModal: false,
      confirm_message:"",
    }
    this.original = JSON.stringify(this.state);
  }

  componentDidMount() {    
  }
  
  getAlwaysShow = (name, value) => {
    if(name==="alwaysShow"){
      this.setState({is_enabled: value})
    }
  };
  getMasterID = e => {
    this.setState({outsourcing_inspection_set_id:parseInt(e)});
  };
  
  getName = e => {
    this.setState({name: e.target.value})
  };
  
  async registerMaster()  {
    var path = '';
    const post_data = {
      params: this.state
    };
    
    path = "/app/api/v2/master/examination/registerExamSet";
    
    await apiClient.post(path, post_data).then(()=>{
      window.sessionStorage.setItem("alert_messages", '検査セットマスタを変更しました。');
    });
  }
  
  handleOk = () => {
    if(this.state.outsourcing_inspection_set_id === undefined || this.state.outsourcing_inspection_set_id === '' || this.state.outsourcing_inspection_set_id <= 0){
      window.sessionStorage.setItem("alert_messages", '検査セットIDを入力してください。');
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
    this.setState({sort_number: parseInt(e)})
  };

  handleCloseModal = () => {
    if (JSON.stringify(this.state) != this.original) {
      this.setState({
        isBackConfirmModal: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_alert_title: "入力中",
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
            <div className="flex numeric-area">
              <NumericInputWithUnitLabel
                label={this.state.title +'ID'}
                value={this.state.outsourcing_inspection_set_id}
                disabled = {this.props.modal_data!=null?true:false}
                getInputText={this.getMasterID.bind(this)}
                inputmode="numeric"
              />
              <div className="display-order">
                <NumericInputWithUnitLabel
                  label={'表示順'}
                  value={this.state.sort_number}                
                  getInputText={this.getOrder.bind(this)}
                  inputmode="numeric"
                />              
              </div>
            </div>
            <InputWithLabel
              label={this.state.title + '名'}
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
              title={this.state.confirm_alert_title}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className={`cancel-btn`} onClick={this.handleCloseModal}>キャンセル</Button>
          <Button 
            className={JSON.stringify(this.state) != this.original ? "red-btn" : "disable-btn"}
            onClick={this.handleOk}
            isDisabled={JSON.stringify(this.state) == this.original}
          >{this.props.modal_data !== null ? "変更" : "登録"}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

ExamSetModal.contextType = Context;

ExamSetModal.propTypes = {
  closeModal : PropTypes.func,
  handleOk : PropTypes.func,
  modal_data : PropTypes.object,
  kind : PropTypes.number,
};

export default ExamSetModal;