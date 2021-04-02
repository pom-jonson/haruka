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


class EditRadiationMasterModal extends Component {
    constructor(props) {
        super(props);
        let modal_data = this.props.modal_data;       
        var title = "";
        switch(this.props.kind){
            case 1:
                title = '放射撮影区分';
                break;
            case 0:
                title = '放射線部位';
                break;
        }
        
        this.state = {
            kind:this.props.kind,
            is_enabled: modal_data !== null?modal_data.is_enabled:1,
            number: modal_data !== null ? modal_data.number : 0,
            radiation_order_id : this.props.radiation_order_id,
            radiation_shooting_classific_id : modal_data !== null ? modal_data.radiation_shooting_classific_id : ((this.props.classific_id !=null && this.props.classific_id !='')?this.props.classific_id:''),
            radiation_part_id : modal_data !== null ? modal_data.radiation_part_id : undefined,
            order:modal_data !== null?modal_data.order:undefined,
            radiation_left_right_flag:modal_data !== null?modal_data.radiation_left_right_flag:undefined,
            title,
            radiation_shooting_classific_name:modal_data !== null?modal_data.radiation_shooting_classific_name:"",
            radiation_part_name:modal_data !== null?modal_data.radiation_part_name:"",
            receipt_key:modal_data !== null?modal_data.receipt_key:undefined,
            
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
        if (this.props.kind ==1){
            this.setState({radiation_shooting_classific_id: parseInt(e)})
        } else {
            this.setState({radiation_part_id: parseInt(e)})
        }
    };

    getReceiptKey = e => {
        this.setState({receipt_key: e.target.value})
    };

    getName = e => {
        if (this.props.kind ==1){
            this.setState({radiation_shooting_classific_name: e.target.value})
        } else {
            this.setState({radiation_part_name: e.target.value})
        }        
    };
    getOrder = e => {
        this.setState({order: parseInt(e)})
    };
    

    async registerMaster()  {
        let path='';
        if (this.props.kind == 1){
            path = "/app/api/v2/master/radiation/registerClassific";
        } else {
            path = "/app/api/v2/master/radiation/registerPart";
        }
        
        const post_data = {
            params: this.state
        };        
        await apiClient.post(path, post_data).then((res)=>{
          if (res)
                window.sessionStorage.setItem("alert_messages", res.alert_message);
        });
    }

    handleOk = () => {
        if(this.state.radiation_shooting_classific_id === undefined || this.state.radiation_shooting_classific_id === '' || this.state.radiation_shooting_classific_id <= 0){
            window.sessionStorage.setItem("alert_messages", '検査分類1マスタIDを入力してください。');
            return;
        }
        if((this.state.radiation_part_id === undefined || this.state.radiation_part_id === '' || this.state.radiation_part_id <= 0) && this.props.kind != 1){
            window.sessionStorage.setItem("alert_messages", '検査分類2マスタIDを入力してください。');
            return;
        }
        if(this.state.radiation_shooting_classific_name === '' && this.props.kind ==1){
            window.sessionStorage.setItem("alert_messages", '撮影区分名を入力してください。');
            return;
        }
        if(this.state.radiation_part_name === '' && this.props.kind ==0){
            window.sessionStorage.setItem("alert_messages", '部位名を入力してください。');
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
                                label={this.props.kind==1?'撮影区分ID':'部位ID'}
                                value={this.props.kind==1?this.state.radiation_shooting_classific_id:this.state.radiation_part_id}
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
                            label={this.props.kind==1?'撮影区分名':'部位名'}
                            type="text"
                            className="name-area"
                            getInputText={this.getName.bind(this)}
                            diseaseEditData={this.props.kind==1?this.state.radiation_shooting_classific_name:this.state.radiation_part_name}
                        />
                        <div className = "display_order">
                            <InputWithLabel
                                label="会計用キー"
                                type="text"
                                getInputText={this.getReceiptKey.bind(this)}
                                diseaseEditData={this.state.receipt_key}
                            />
                        </div>
                        {this.props.kind ==0 && (
                            <div className='checkbox_area'>
                            <Checkbox
                                label="左右有無フラグ"
                                getRadio={this.getAlwaysShow.bind(this)}
                                value={this.state.radiation_left_right_flag}
                                checked = {this.state.radiation_left_right_flag ===1}
                                name="left_right"
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

EditRadiationMasterModal.contextType = Context;

EditRadiationMasterModal.propTypes = {
    closeModal: PropTypes.func,
    handleOk:   PropTypes.func,    
    modal_data:PropTypes.object,    
    classific_id: PropTypes.number,
    kind : PropTypes.number,
    radiation_order_id:PropTypes.string,
};

export default EditRadiationMasterModal;
