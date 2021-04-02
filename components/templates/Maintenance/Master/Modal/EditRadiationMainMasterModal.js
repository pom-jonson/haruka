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
    width: 300px;
    font-size: 18px;
  }
  
  .checkbox-label{
    width: 30%;
    text-align: left;
  }
  .label-title{
    font-size: 18px;
    width: 150px;
    margin-right:8px;
   }
  .add-button {
      text-align: center;
      width:100%;
  }
  .checkbox_area {
    padding-left: 120px;
    label{
        font-size: 16px;
        width: auto;
    }
  }
  .short-input-group{
    display:flex;
    input{
        width:130px;
    }
  }
  
  .kana_area {
    padding-top: 10px;
  }
  .name_area {
    padding-top: 20px;
  }
  .display_order{
      display:flex;
      label{
          padding-left:8px;
          padding-top:18px;
          font-size:18px;
          width:120px;
          text-align:left;
      }
      .label-title{
          padding-top:0px;
          text-align:right;
      }
  }
  .label-unit{
      display:none;
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


class EditRadiationMainMasterModal extends Component {
    constructor(props) {
        super(props);
        let modal_data = this.props.modal_data;       
        var title = "放射線オーダー";
        this.state = {
            kind:this.props.kind,
            is_enabled: modal_data !== null?modal_data.is_enabled:1,
            number: modal_data !== null ? modal_data.number : 0,
            radiation_order_id:modal_data !== null ? modal_data.radiation_order_id : 0,
            name:modal_data !== null ? modal_data.name : undefined,
            shoot_count_flag:modal_data !== null ? modal_data.shoot_count_flag : 0,
            sub_picture_flag:modal_data !== null ? modal_data.sub_picture_flag : 0,
            direction_count_flag:modal_data !== null ? modal_data.direction_count_flag : 0,
            shoot_receipt_key:modal_data !== null ? modal_data.shoot_receipt_key : undefined,
            sub_picture_receipt_key:modal_data !== null ? modal_data.sub_picture_receipt_key : undefined,
            direction_receipt_key:modal_data !== null ? modal_data.direction_receipt_key : undefined,
            order:modal_data !== null?modal_data.order:undefined,            
            title,

            isUpdateConfirmModal: false,
            confirm_message:"",
        }
    }

    getAlwaysShow = (name, value) => {
        switch(name){
            case 'alwaysShow':
                this.setState({is_enabled: value})
                break;
            case 'shootcount':
                this.setState({shoot_count_flag:value})
                break;
            case 'subpicture':
                this.setState({sub_picture_flag:value})
                break;
            case 'directioncount':
                this.setState({direction_count_flag:value})
                break;
        }
        
    };
    getMasterID = e => {        
        this.setState({radiation_order_id: parseInt(e)})        
    };

    getReceiptKey = (name, e) => {
        switch(name){        
            case 'shootcount':
                this.setState({shoot_receipt_key:e.target.value})
                break;
            case 'subpicture':
                this.setState({sub_picture_receipt_key:e.target.value})
                break;
            case 'directioncount':
                this.setState({direction_receipt_key:e.target.value})
                break;
        }        
    };

    getName = e => {
        this.setState({name: e.target.value})        
    };
    getOrder = e => {
        this.setState({order: parseInt(e)})
    };
    

    async registerMaster()  {
        let path='';        
        path = "/app/api/v2/master/radiation/registerMainMaster";
        
        const post_data = {
            params: this.state
        };        
        await apiClient.post(path, post_data).then((res)=>{
          if (res)
                window.sessionStorage.setItem("alert_messages", res.alert_message);
                this.props.closeModal();
        });
    }

    handleOk = () => {
        if(this.state.name === ''){
            window.sessionStorage.setItem("alert_messages", '放射線オーダー名を入力してください。');
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
                                label={'放射線オーダーID'}
                                value={this.state.radiation_order_id}
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
                            label={'放射線オーダー名'}
                            type="text"
                            className="name-area"
                            getInputText={this.getName.bind(this)}
                            diseaseEditData={this.state.name}
                        />
                        <div className = "display_order flex">
                            <Checkbox
                                label="撮影回数"
                                getRadio={this.getAlwaysShow.bind(this)}
                                value={this.state.shoot_count_flag}
                                checked = {this.state.shoot_count_flag ===1}
                                name="shootcount"
                            />
                            <InputWithLabel
                                label="会計用キー"
                                type="text"
                                isDisabled = {this.state.shoot_count_flag?false:true}
                                getInputText={this.getReceiptKey.bind(this, 'shootcount')}
                                diseaseEditData={this.state.shoot_receipt_key}
                            />
                        </div>
                        <div className = "display_order flex">
                            <Checkbox
                                label="分画数"
                                getRadio={this.getAlwaysShow.bind(this)}
                                value={this.state.sub_picture_flag}
                                checked = {this.state.sub_picture_flag ===1}
                                name="subpicture"
                            />
                            <InputWithLabel
                                label="会計用キー"
                                type="text"
                                isDisabled = {this.state.sub_picture_flag?false:true}
                                getInputText={this.getReceiptKey.bind(this, 'subpicture')}
                                diseaseEditData={this.state.sub_picture_receipt_key}
                            />
                        </div>
                        <div className = "display_order flex">
                            <Checkbox
                                label="方向数"
                                getRadio={this.getAlwaysShow.bind(this)}
                                value={this.state.direction_count_flag}
                                checked = {this.state.direction_count_flag ===1}
                                name="directioncount"
                            />
                            <InputWithLabel
                                label="会計用キー"
                                type="text"
                                isDisabled = {this.state.direction_count_flag?false:true}
                                getInputText={this.getReceiptKey.bind(this, 'directioncount')}
                                diseaseEditData={this.state.direction_receipt_key}
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

EditRadiationMainMasterModal.contextType = Context;

EditRadiationMainMasterModal.propTypes = {
    closeModal: PropTypes.func,
    handleOk:   PropTypes.func,    
    modal_data:PropTypes.object,
    kind : PropTypes.number,    
};

export default EditRadiationMainMasterModal;
