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
    width: 130px;
   }
  .add-button {
      text-align: center;
      width:100%;
  }
  .checkbox_area {
    padding-left: 130px;
    label{
        font-size: 16px;
        width: 140px;
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


class EditPartSubMaster extends Component {
    constructor(props) {
        super(props);
        let modal_data = this.props.modal_data;       
        var title = "", id = "", name = '';
        switch(this.props.kind){
            case 0:     
                title = '体位・方向'
                id = (modal_data !== null && modal_data.radiation_direction_id != undefined)? modal_data.radiation_direction_id : '';
                name = (modal_data !== null && modal_data.radiation_direction_name != undefined)? modal_data.radiation_direction_name : '';
                break;
            case 1:     
                title = '方法';
                id = (modal_data !== null && modal_data.radiation_method_id != undefined)? modal_data.radiation_method_id : '';
                name = (modal_data !== null && modal_data.radiation_method_name != undefined)? modal_data.radiation_method_name : '';
                break;
            case 2:
                title = '撮影コメント';
                id = (modal_data !== null && modal_data.radiation_shooting_comment_id != undefined)? modal_data.radiation_shooting_comment_id : '';
                name = (modal_data !== null && modal_data.radiation_shooting_comment_name != undefined)? modal_data.radiation_shooting_comment_name : '';
                break;
        }
        
        this.state = {
            kind:this.props.kind,
            is_enabled: modal_data !== null?modal_data.is_enabled:1,
            number: modal_data !== null ? modal_data.number : 0,
            radiation_part_id : this.props.radiation_part_id,
            radiation_direction_id : id,
            radiation_method_id:id,
            radiation_shooting_comment_id:id,

            order:modal_data !== null?modal_data.order:undefined,
            receipt_key:modal_data !== null?modal_data.receipt_key:undefined,

            radiation_direction_name: name,
            radiation_method_name : name,
            radiation_shooting_comment_name:name,
            
            id,
            title,
            name,
            
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
        switch(this.props.kind){
            case 0:
                this.setState({
                    radiation_direction_id: parseInt(e),
                    id:parseInt(e),
                })
                break;
            case 1:
                this.setState({
                    radiation_method_id: parseInt(e),
                    id:parseInt(e),
                })
                break;
            case 2:
                this.setState({
                    radiation_shooting_comment_id: parseInt(e),
                    id:parseInt(e),
                })
                break;
        }
    };

    getReceiptKey = e => {
        this.setState({receipt_key: e.target.value})
    };

    getName = e => {
        switch(this.props.kind){
            case 0:
                this.setState({
                    radiation_direction_name: e.target.value,
                    name:e.target.value,
                })
                break;
            case 1:
                this.setState({
                    radiation_method_name: e.target.value,
                    name:e.target.value,
                })
                break;
            case 2:
                this.setState({
                    radiation_shooting_comment_name: e.target.value,
                    name:e.target.value,
                })
                break;
        }
        
    };
    getOrder = e => {
        this.setState({order: parseInt(e)})
    };
    

    async registerMaster()  {
        let path='';
        switch(this.props.kind){
            case 0:
                path = "/app/api/v2/master/radiation/registerDirection";
                break;
            case 1:
                path = "/app/api/v2/master/radiation/registerMethod";
                break;
            case 2:
                path = "/app/api/v2/master/radiation/registerComment";
                break;        
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
        
        if(this.state.id === undefined || this.state.id === '' || this.state.id <= 0){
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
                            label={this.state.title+'名'}
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

EditPartSubMaster.contextType = Context;

EditPartSubMaster.propTypes = {
    closeModal: PropTypes.func,
    handleOk:   PropTypes.func,    
    modal_data:PropTypes.object,
    kind : PropTypes.number,
    radiation_part_id:PropTypes.string,
};

export default EditPartSubMaster;
