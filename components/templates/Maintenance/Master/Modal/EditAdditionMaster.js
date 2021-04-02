import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import Checkbox from "~/components/molecules/Checkbox";

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
    width: calc(100% - 240px);
    font-size: 18px;
  }
  
  .checkbox-label{
    width: 30%;
    text-align: left;
  }
  .label-title{
    font-size: 18px;
    width: 230px;
   }
  .add-button {
      text-align: center;
      width:100%;
  }
  .checkbox_area {
    padding-left: 15px;
    label{
        width: 310px;
        font-size: 18px;
    }
  }
  .short-input-group{
    display:flex;
    input{
        width:130px;
    }
    .label-unit {
        width:0;
    }
    .order-value {
        .label-title {
            width:80px;
        }
    }
  }
  .separate-check {
    display: flex;
    .label-title {
        text-align: right;
        margin-right: 8px;
    }
    label {
        width: 0;
        input {
            height: 18px;
            top: 5px;
            width: 18px !important;
        }
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


class EditAdditionMaster extends Component {
    constructor(props) {
        super(props);
        let modal_data = this.props.modal_data;
        
        this.state = {            
            is_enabled: modal_data !== null?modal_data.is_enabled:1,
            number: modal_data !== null ? modal_data.number : 0,
            addition_id:modal_data !== null?modal_data.addition_id:undefined,
            name:modal_data !== null?modal_data.name:'',
            order:modal_data !== null?modal_data.order:undefined,
            receipt_key:modal_data !== null?modal_data.receipt_key:undefined,
            is_separate:modal_data !== null?modal_data.is_separate:0,
            connection_receipt_key:modal_data !== null?modal_data.connection_receipt_key:'',
            title:'追加項目制御',
            
            isUpdateConfirmModal: false,
            confirm_message:"",
        }
    }

    getAlwaysShow = (name, value) => {
        if(name==="alwaysShow"){
            this.setState({is_enabled: value})
        }
        if (name == 'left_right'){
            this.setState({radiation_left_right_flag:value})
        }
    };
    getMasterID = e => {
        this.setState({addition_id:parseInt(e)});        
    };

    getReceiptKey = e => {
        this.setState({receipt_key: e.target.value})
    };

    getConnectionReceiptKey = e => {
        this.setState({connection_receipt_key: e.target.value})
    };

    getName = e => {
        this.setState({name:e.target.value});        
    };
    getOrder = e => {
        this.setState({order: parseInt(e)})
    };
    

    async registerMaster()  {
        let path = "/app/api/v2/master/addition/registerAdditionMaster";
        
        const post_data = {
            params: this.state
        };
        await apiClient.post(path, post_data).then((res)=>{
          if (res)
                window.sessionStorage.setItem("alert_messages", res.alert_message);
        });
    }

    handleOk = () => {
        
        if(this.state.addition_id === undefined || this.state.addition_id === '' || this.state.addition_id <= 0){
            window.sessionStorage.setItem("alert_messages", 'マスタIDを入力してください。');
            return;
        }
        if(this.state.name == undefined || this.state.name == ''){
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

    getSeparate  = (name, value) => {
        if (name == 'is_separate') {
            this.setState({is_separate:value});
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
                                label={this.state.title+'ID'}
                                value={this.state.addition_id}
                                disabled = {this.props.modal_data!=null?true:false}
                                getInputText={this.getMasterID.bind(this)}
                                inputmode="numeric"
                            />
                            <div className={'order-value'}>
                                <NumericInputWithUnitLabel
                                    label="表示順"
                                    value={this.state.order}
                                    getInputText={this.getOrder.bind(this)}
                                    inputmode="numeric"
                                />
                            </div>
                        </div>

                        <InputWithLabel
                            label={'品名'}
                            type="text"
                            className="name-area"
                            getInputText={this.getName.bind(this)}
                            diseaseEditData={this.state.name}
                        />
                        <div className = "display_order">
                            <InputWithLabel
                                label="会計用キー"
                                type="text"
                                getInputText={this.getReceiptKey.bind(this)}
                                diseaseEditData={this.state.receipt_key}
                            />
                        </div>
                        <div className={'separate-check'}>
                            <div className={'label-title'}>区切りを分ける</div>
                            <Checkbox
                                getRadio={this.getSeparate.bind(this)}
                                value={this.state.is_separate}
                                name={`is_separate`}
                            />
                        </div>
                        <div className = "display_order">
                            <InputWithLabel
                                label="同区切り追加時の会計キー"
                                type="text"
                                getInputText={this.getConnectionReceiptKey.bind(this)}
                                diseaseEditData={this.state.connection_receipt_key}
                            />
                        </div>
                        
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

EditAdditionMaster.contextType = Context;

EditAdditionMaster.propTypes = {
    closeModal: PropTypes.func,
    handleOk:   PropTypes.func,    
    modal_data:PropTypes.object,
};

export default EditAdditionMaster;
