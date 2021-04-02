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
  .short-input-group{    
    input{        
        line-height: 0.5rem;        
    }
    b {
      right: 4px !important;
    }
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
   }
  .add-button {
      text-align: center;
      width:100%;
  }
  .label-title{
    font-size: 1rem;
    width: 120px;
    text-align: right;
    margin-right: 8px;
    margin-top: 0px;
    height: 2rem;
    line-height: 2rem;
    margin-top: 0px;
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
  .checkbox_area {
    padding-left: 128px;
    label{
        font-size: 1rem;
        width: 100px;
    }
    div{
      margin-top: 0px;
    }
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
      height: 38px;
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


class EndscopeMasterModal extends Component {
    constructor(props) {
        super(props);
        let modal_data = this.props.modal_data;       
        var title = "";
        switch(this.props.kind){
            case 0:     //検査分類2
                title = '検査種別'
                break;
            case 1:     //検査分類1
                title = '検査項目';
                break;
        }
        
        this.state = {
            kind:this.props.kind,
            is_enabled: modal_data !== null?modal_data.is_enabled:1,
            number: modal_data !== null ? modal_data.number : 0,            
            inspection_type_id : modal_data !== null ? modal_data.inspection_type_id : ((this.props.inspection_type_id!=null && this.props.inspection_type_id!='')?this.props.inspection_type_id:''),
            inspection_item_id : modal_data !== null ? modal_data.inspection_item_id : undefined,
            title,
            name:modal_data !== null?modal_data.name:"",
            receipt_key:modal_data !== null?modal_data.receipt_key:undefined,
            
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
        if (this.props.kind ==1){
            this.setState({inspection_type_id: parseInt(e)})
        } else {
            this.setState({inspection_item_id: parseInt(e)})
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
        let path = "/app/api/v2/master/inspection/registerEndscopeMaster";
        const post_data = {
            params: this.state
        };        
        await apiClient.post(path, post_data).then((res)=>{
          if (res)
                window.sessionStorage.setItem("alert_messages", res.alert_message);
        });
    }

    handleOk = () => {
        if(this.state.inspection_type_id === undefined || this.state.inspection_type_id == ''|| this.state.inspection_type_id <= 0){
            window.sessionStorage.setItem("alert_messages", '検査種別IDを入力してください。');
            return;
        }

        if((this.state.inspection_item_id === undefined || this.state.inspection_item_id == '' || this.state.inspection_item_id <= 0) && this.props.kind != 1){
            window.sessionStorage.setItem("alert_messages", '検査項目IDを入力してください。');
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
                                label={this.props.kind==1?'検査種別ID':'検査項目ID'}
                                value={this.props.kind==1?this.state.inspection_type_id:this.state.inspection_item_id}
                                disabled = {this.props.modal_data!=null?true:false}
                                getInputText={this.getMasterID.bind(this)}
                                inputmode="numeric"
                            />
                        </div>
                        <InputWithLabel
                            label={this.props.kind==1?'検査種別名':'検査項目名'}
                            type="text"
                            className="name-area"
                            getInputText={this.getName.bind(this)}
                            diseaseEditData={this.state.name}
                        />
                        {this.props.kind != 1 && (
                            <div className = "display_order">
                                <InputWithLabel
                                    label="会計用キー"
                                    type="text"
                                    getInputText={this.getReceiptKey.bind(this)}
                                    diseaseEditData={this.state.receipt_key}
                                />
                            </div>                        
                        ) }                       
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
                  <Button className={this.change_flag === 1 ? "red-btn" : "disable-btn"} onClick={this.handleOk} isDisabled={this.change_flag == 0}>{this.props.modal_data !== null ? "変更" : "登録"}</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

EndscopeMasterModal.contextType = Context;

EndscopeMasterModal.propTypes = {
    closeModal: PropTypes.func,
    handleOk:   PropTypes.func,
    modal_data:PropTypes.object,
    first_kind_number : PropTypes.number,
    inspection_type_id: PropTypes.number,
    kind : PropTypes.number,
};

export default EndscopeMasterModal;
