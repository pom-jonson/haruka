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
import Radiobox from "~/components/molecules/Radiobox";
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
    height:2.375rem;
  }
  
  .checkbox-label{
    width: 30%;
    text-align: left;
  }
  .label-title{
    font-size: 1rem;
    width: 120px;
    line-height:2.375rem;
    margin-top: 0;
    
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
  .radio-area {
    label {
        width: auto;
        font-size: 1rem;
        margin-bottom: 0;
        line-height: 2.375rem;
    }
    input {
        line-height: 1rem;
        height: 1rem;
    }
  }
 `;

class TreatPracticeMasterModal extends Component {
    constructor(props) {
        super(props);
        let modal_data = this.props.modal_data;       
        var title = "", id;
        switch(this.props.kind){
            case 0:     
                title = '処置分類'; 
                id = modal_data !== null ? modal_data.classification_id : ((this.props.classification_id !=null && this.props.classification_id !='')?this.props.classification_id:'');
                break;
            case 1:
                title = '行為';
                id = modal_data !== null ? modal_data.practice_id : ((this.props.practice_id !=null && this.props.practice_id !='')?this.props.practice_id:'');
                break;
            case 2:
                title = '請求情報';
                id = modal_data !== null ? modal_data.request_id : undefined;
                break;
        }
        
        this.state = {
            kind:this.props.kind,
            is_enabled: modal_data != null?modal_data.is_enabled:1,
            number: modal_data != null ? modal_data.number : 0,
            classification_id : modal_data != null ? modal_data.classification_id : ((this.props.classification_id !=null && this.props.classification_id !='')?this.props.classification_id:''),
            practice_id : modal_data != null ? modal_data.practice_id : ((this.props.practice_id !=null && this.props.practice_id !='')?this.props.practice_id:''),
            request_id : modal_data != null ? modal_data.request_id : undefined,
            receipt_key : modal_data != null? modal_data.receipt_key : '',
            order: modal_data != null ? modal_data.order : undefined,
            order_item_mode: modal_data != null ? modal_data.order_item_mode : 1,
            id,
            title,
            name:modal_data !== null?modal_data.name:"",
            alert_messages: "",
            confirm_message:"",
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
        this.change_flag = 1;
        switch(this.props.kind){
            case 0:
                this.setState({classification_id: parseInt(e), id:parseInt(e)})
                break;
            case 1:
                this.setState({practice_id: parseInt(e), id:parseInt(e)})
                break;
            case 2:
                this.setState({request_id: parseInt(e), id:parseInt(e)})
                break;
        }
    };
    
    getName = e => {
        this.change_flag = 1;
        this.setState({name: e.target.value})
    };

    getReceiptKey = e => {
        this.change_flag = 1;
        this.setState({receipt_key: e.target.value})
    }

    async registerMaster()  {
        var path = '';
        const post_data = {
            params: this.state
        };
        switch(this.props.kind){
            case 0:
                path = "/app/api/v2/master/treat/registerClassificationMaster";
                break;
            case 1:
                path = "/app/api/v2/master/treat/registerPracticeMaster";
                break;
            case 2:
                path = "/app/api/v2/master/treat/registerRequestMaster";
                break;
        }
        await apiClient.post(path, post_data).then(()=>{
            let alert_messages = this.props.modal_data !== undefined && this.props.modal_data != null ? "変更しました。": "登録しました。";
          this.setState({alert_messages, alert_action: "close"});
        });
    }

    handleOk = () => {
        if(this.change_flag == 0) return;
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
                confirm_message: this.state.title + "マスタ情報を追加しますか?",
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

    getOrder = e => {
        this.change_flag = 1;
        this.setState({order: parseInt(e)})
    };
    setRadioValue = e => {
        this.change_flag = 1;
        this.setState({[e.target.name]:parseInt(e.target.value)});
    }
    
    closeModal = () => {
        if(this.change_flag == 1) {
            this.setState({
                confirm_message: "登録していない内容があります。\n変更内容を破棄して移動しますか？",
                confirm_alert_title:'入力中',
                confirm_action: "close"
            });
        } else {
            this.props.closeModal();
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
                            label={this.state.title + '名'}
                            type="text"
                            className="name-area"
                            getInputText={this.getName.bind(this)}
                            diseaseEditData={this.state.name}
                        />
                        {this.props.kind != 0 && (
                            <div className = "display_order">
                                <InputWithLabel
                                    label="会計用キー"
                                    type="text"
                                    getInputText={this.getReceiptKey.bind(this)}
                                    diseaseEditData={this.state.receipt_key}
                                />
                            </div>
                        )}
                        {this.props.kind == 1 && (
                          <div className="radio-area d-flex">
                              <label className="label-title radio-label" style={{marginRight: 8, width: 120}}>個別指示</label>
                              <Radiobox
                                label="不使用または固定"
                                value={0}
                                key={0}
                                getUsage={this.setRadioValue.bind(this)}
                                checked={this.state.order_item_mode == 0}
                                name="order_item_mode"
                              />
                              <Radiobox
                                label="選択可能"
                                value={1}
                                key={1}
                                getUsage={this.setRadioValue.bind(this)}
                                checked={this.state.order_item_mode == 1}
                                name="order_item_mode"
                              />
                          </div>
                        )}
                    </Wrapper>
                    {this.state.confirm_message !== "" && (
                        <SystemConfirmJapanModal
                            hideConfirm= {this.confirmCancel.bind(this)}
                            confirmCancel= {this.confirmCancel.bind(this)}
                            confirmOk= {this.confirmOk.bind(this)}
                            confirmTitle= {this.state.confirm_message}
                            title={this.state.confirm_alert_title}
                        />
                    )}{this.state.alert_messages !== "" && (
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

TreatPracticeMasterModal.contextType = Context;

TreatPracticeMasterModal.propTypes = {
    closeModal : PropTypes.func,
    handleOk : PropTypes.func,    
    modal_data : PropTypes.object,    
    classification_id : PropTypes.number,
    practice_id : PropTypes.number,    
    kind : PropTypes.number,    
};

export default TreatPracticeMasterModal;
