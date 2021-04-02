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
  font-size: 18px;
  width: 100%;
  height: 100%;
  float: left;
  label {
      text-align: right;
      width: 80px;
  }
  input {
    width: 400px;
    font-size: 18px;
  }
  
  .checkbox-label{
    width: 30%;
    text-align: left;
  }
  .label-title{
    font-size: 18px;
    width: 120px;
   }
  .add-button {
      text-align: center;
      width:100%;
  }
  .checkbox_area {
    padding-left: 120px;
    label{
        font-size: 16px;
        width: 100px;
    }
  }
  .short-input-group{
    display:flex;
    input{
        width:130px;
    }
  }
  .medicine_code {
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px;
    margin-left: -20px;
    input {
      font-size: 18px;
      width: 155px;
    }
    label {
      width: 120px;
      font-size: 15px;
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
    font-size: 18px;
    margin-top: 10px;
    margin-left: 15px;
    margin-bottom: 10px;
    .gender-label {
      width: 100px;
      margin-top: 8px;
      float: left;
    }
    .radio-group-btn label{
        font-size: 14px;
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
      font-size: 20px;
      font-weight: 100;
    }
}
 `;


class SpiritClassificModal extends Component {
    constructor(props) {
        super(props);
        let modal_data = this.props.modal_data;       
        var title = "", id;
        switch(this.props.kind){
            case 0:
                title = '分類'; 
                id = modal_data !== null ? modal_data.classific_id : '';
                break;
            case 1:
                title = '分類詳細';
                id = modal_data !== null ? modal_data.classific_detail_id : '';
                break;            
        }
        
        this.state = {
            kind:this.props.kind,
            is_enabled: modal_data !== null?modal_data.is_enabled:1,
            number: modal_data !== null ? modal_data.number : 0,
            order: modal_data !== null ? modal_data.order : undefined,
            receipt_key: modal_data !== null ? modal_data.receipt_key : undefined,
            classific_id: modal_data !== null ? modal_data.classific_id : (this.props.kind ==1?this.props.classific_id:undefined),
            classific_detail_id: modal_data !== null ? modal_data.classific_detail_id : undefined,
            id,
            title,
            name:modal_data !== null?modal_data.name:"",
            
            isUpdateConfirmModal: false,
            confirm_message:"",
        }
    }

    getAlwaysShow = (name, value) => {
        if(name==="alwaysShow"){
            this.setState({is_enabled: value})
        }
    };
    getMasterID = e => {
        switch(this.props.kind){
            case 0:
                this.setState({id:parseInt(e), classific_id:parseInt(e),})
                break;
            case 1:
                this.setState({id:parseInt(e), classific_detail_id:parseInt(e),})
                break;
        }
    };
    
    getName = e => {
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
                path = "/app/api/v2/master/spirit/registerClassific";
                break;
            case 1:
                path = "/app/api/v2/master/spirit/registerClassificDetail";
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
        if((this.state.classific_id === undefined || this.state.classific_id === '') && this.props.kind == 1){
            window.sessionStorage.setItem("alert_messages", '分類マスタIDを選択してください。');
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
            confirm_message: "",
        });
    }

    getOrder = e => {
        this.setState({order: parseInt(e.target.value)})
    };

    render() {        
        return  (
            <Modal show={true} id="add_contact_dlg"  className="medicine-modal first-view-modal">
                <Modal.Header>
                    <Modal.Title>指導・管理料{this.state.title}マスタ{this.props.modal_data != null?'編集':'登録'}</Modal.Title>
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
                        <div className="">
                            <NumericInputWithUnitLabel
                                label={this.state.title+"ID"}
                                value={this.state.id}
                                disabled = {this.props.modal_data!=null?true:false}
                                getInputText={this.getMasterID.bind(this)}
                                inputmode="numeric"
                            />
                            <InputWithLabel
                                label="表示順"
                                type="number"
                                getInputText={this.getOrder.bind(this)}
                                diseaseEditData={this.state.order}
                            />
                        </div>
                        <InputWithLabel
                            label={this.state.title + '名'}
                            type="text"
                            className="name-area"
                            getInputText={this.getName.bind(this)}
                            diseaseEditData={this.state.name}
                        />
                        {this.props.kind == 1 && (
                            <div className = "display_order">
                                <InputWithLabel
                                    label="会計用キー"
                                    type="text"
                                    getInputText={this.getReceiptKey.bind(this)}
                                    diseaseEditData={this.state.receipt_key}
                                />
                            </div>
                        )}
                        
                        <div className="footer">
                            <div className="add-button">
                                <Button type="mono" onClick={this.handleOk}>{this.props.modal_data !== null ? "変更" : "登録"}</Button>
                                <Button type="mono" onClick={this.props.closeModal}>閉じる</Button>
                            </div>
                        </div>
                    </Wrapper>
                    {this.state.isUpdateConfirmModal !== false && (
                        <SystemConfirmJapanModal
                            hideConfirm= {this.confirmCancel.bind(this)}
                            confirmCancel= {this.confirmCancel.bind(this)}
                            confirmOk= {this.register.bind(this)}
                            confirmTitle= {this.state.confirm_message}
                        />
                    )}
                </Modal.Body>
            </Modal>
        );
    }
}

SpiritClassificModal.contextType = Context;

SpiritClassificModal.propTypes = {
    closeModal : PropTypes.func,
    handleOk : PropTypes.func,    
    modal_data : PropTypes.object,
    kind : PropTypes.number,
    classific_id : PropTypes.number,
};

export default SpiritClassificModal;
