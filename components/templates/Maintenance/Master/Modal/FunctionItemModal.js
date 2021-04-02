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
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";

const Wrapper = styled.div`
  display: block;
  font-size: 16px;
  width: 100%;
  height: 100%;
  .label-title{
    font-size: 16px;
    width: 220px;
    margin-right:10px;
    text-align:right;
    line-height:38px;
    margin-top: 0;
   }
  .checkbox_area {
    padding-left: 230px;
    div{
        margin-top:0px;
    }
    label{
        font-size: 16px;
        width: 150px;
        text-align:left;
    }
  }
  .comment-output label {
      font-size: 1rem;
      letter-spacing: -1px;
  }
  .short-input-group{
    padding-top:5px;
    display:flex;
    div{
        margin-top:0px;
    }
    .pullbox-label {
        width:calc(100% - 230px);
    }
    .pullbox-select {
        width: 100%;
    }
    .label-unit{
        width: 38px;
    }
  }
  .input-area input {
      width:calc(100% - 230px);
  }
}
 `;

 const Footer = styled.div`
   display:flex;
   span{
     color: white;
     font-size: 16px;
   }
   button{
     float: right;
     padding: 5px;
     font-size: 16px;
     margin-right: 16px;
   }
 `;

const attribute_list = [
    {id:0, value:''},
    {id:1, value:'文字列'},
    {id:2, value:'数字'},
    {id:3, value:'日付(カレンダ入力)'},
    {id:4, value:'和暦対応の日付'},
    {id:5, value:'定型入力'},
];

class FunctionItemModal extends Component {
    constructor(props) {
        super(props);
        let modal_data = this.props.modal_data;
        
        this.state = {            
            is_enabled: modal_data !== null?modal_data.is_enabled:1,
            number: modal_data !== null ? modal_data.number : 0,
            order: modal_data !== null ? modal_data.order : undefined,
            receipt_key: modal_data !== null ? modal_data.receipt_key : undefined,
            function_id: modal_data !== null ? modal_data.function_id : this.props.function_id,
            item_category_id: modal_data !== null ? modal_data.item_category_id : this.props.item_category_id,
            item_id: modal_data !== null ? modal_data.item_id : null,            
            name:modal_data !== null?modal_data.name:"",
            input_item1_flag: modal_data !== null ? modal_data.input_item1_flag : null,
            input_item1_attribute: modal_data !== null ? modal_data.input_item1_attribute : null,
            input_item1_format: modal_data !== null ? modal_data.input_item1_format : null,
            input_item1_unit: modal_data !== null ? modal_data.input_item1_unit : null,
            input_item1_max_length: modal_data !== null ? modal_data.input_item1_max_length : null,
            input_item2_flag: modal_data !== null ? modal_data.input_item2_flag : null,
            input_item2_attribute: modal_data !== null ? modal_data.input_item2_attribute : null,
            input_item2_format: modal_data !== null ? modal_data.input_item2_format : null,
            input_item2_unit: modal_data !== null ? modal_data.input_item2_unit : null,
            input_item2_max_length: modal_data !== null ? modal_data.input_item2_max_length : null,
            send_format: modal_data !== null ? modal_data.send_format : null,
            number_full_angle_flag: modal_data !== null ? modal_data.number_full_angle_flag : 0,
            date_zero_fill_flag: modal_data !== null ? modal_data.date_zero_fill_flag : 0,
            date_amount_output_flag: modal_data !== null ? modal_data.date_amount_output_flag : 0,
            comment_output_flag: modal_data !== null ? modal_data.comment_output_flag : 0,

            isUpdateConfirmModal: false,
            confirm_message:"",
        }
    }

    getRadio = (name, value) => {
        switch(name){
            case 'alwaysShow':
                this.setState({is_enabled: value});
                break;
            case 'item1':
                this.setState({input_item1_flag:value});
                break;
            case 'item2':
                this.setState({input_item2_flag:value});
                break;
            case 'convert-letter':
                this.setState({number_full_angle_flag:value});
                break;
            case 'date_zero_fill_flag':
                this.setState({date_zero_fill_flag:value});
                break;
            case 'date_amount_output_flag':
                this.setState({date_amount_output_flag:value});
                break;
            case 'comment_output_flag':
                this.setState({comment_output_flag:value});
                break;
        }
    };
    getMasterID = e => {
        this.setState({item_id:parseInt(e)});
    };
    
    getName = e => {
        this.setState({name: e.target.value})
    };

    getReceiptKey = e => {
        this.setState({receipt_key: e.target.value})
    }

    getAttribute = (index, e) => {
        if (index == 1){
            this.setState({input_item1_attribute:parseInt(e.target.id)});
        }
        if (index == 2){
            this.setState({input_item2_attribute:parseInt(e.target.id)});
        }
    }

    getConvertFormat = (index, e) => {
        if (index == 1){
            this.setState({input_item1_format:e.target.value});
        }
        if (index == 2){
            this.setState({input_item2_format:e.target.value});
        }
    }

    getUnit = (index, e) => {
        if (index == 1){
            this.setState({input_item1_unit:e.target.value});
        }
        if (index == 2){
            this.setState({input_item2_unit:e.target.value});
        }
    }

    getMaxLength = (index, e) => {
        if (index == 1){
            this.setState({input_item1_max_length:parseInt(e)});
        }
        if (index == 2){
            this.setState({input_item2_max_length:parseInt(e)});
        }
    }

    getSendFormat = e => {
        this.setState({send_format:e.target.value});
    }

    async registerMaster()  {
        let path = '';
        const post_data = {
            params: this.state
        };
        path = "/app/api/v2/master/item/registerItem";        
        await apiClient.post(path, post_data);
    }

    handleOk = () => {
        if(this.state.item_id === undefined || this.state.item_id === '' || this.state.item_id <= 0){
            window.sessionStorage.setItem("alert_messages", 'IDを入力してください。');
            return;
        }
        if((this.state.function_id === undefined || this.state.function_id === '')){
            window.sessionStorage.setItem("alert_messages", '機能を選択してください。');
            return;
        }
        if((this.state.item_category_id === undefined || this.state.item_category_id === '')){
            window.sessionStorage.setItem("alert_messages", '品名分類を選択してください。');
            return;
        }
        if(this.state.name === ''){
            window.sessionStorage.setItem("alert_messages", '品名を入力してください。');
            return;
        }

        if(this.props.modal_data !== null){
            this.setState({
                isUpdateConfirmModal : true,
                confirm_message: "機能毎品名マスタ情報を変更しますか?",
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
    };

    confirmCancel() {
        this.setState({
            isUpdateConfirmModal: false,
            confirm_message: "",
        });
    }

    getOrder = e => {
        this.setState({order: parseInt(e)})
    };

    render() {        
        return  (
            <Modal show={true} id="add_contact_dlg"  className="first-view-modal function-item-modal">
                <Modal.Header>
                    <Modal.Title>機能毎品名マスタ{this.props.modal_data != null?'編集':'登録'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                        <div className="checkbox_area">
                            <Checkbox
                                label="常に表示"
                                getRadio={this.getRadio.bind(this)}
                                value={this.state.is_enabled}
                                checked = {this.state.is_enabled ===1}
                                name="alwaysShow"
                            />
                        </div>
                        <div className="short-input-group" style={{paddingTop:"5px"}}>
                            <div style={{width:"50%"}}>
                                <NumericInputWithUnitLabel
                                    label={"品名ID"}
                                    value={this.state.item_id}
                                    disabled = {this.props.modal_data!=null?true:false}
                                    getInputText={this.getMasterID.bind(this)}
                                    inputmode="numeric"
                                />
                            </div>
                            <div style={{width:"50%"}}>
                                <NumericInputWithUnitLabel
                                    label={"表示順"}
                                    value={this.state.order}                                
                                    getInputText={this.getOrder.bind(this)}
                                    inputmode="numeric"
                                />  
                            </div>                          
                        </div>
                        <div className = "input-area">
                            <InputWithLabel
                                label={'品名'}
                                type="text"
                                className="name-area"
                                getInputText={this.getName.bind(this)}
                                diseaseEditData={this.state.name}
                            />  
                        </div>                      
                        <div className = "input-area">
                            <InputWithLabel
                                label="会計用キー"
                                type="text"
                                getInputText={this.getReceiptKey.bind(this)}
                                diseaseEditData={this.state.receipt_key}
                            />
                        </div>
                        <div className="checkbox_area" style={{paddingTop:"10px"}}>
                            <Checkbox
                                label="入力項目1表示"
                                getRadio={this.getRadio.bind(this)}
                                value={this.state.input_item1_flag}
                                checked = {this.state.input_item1_flag ===1}
                                name="item1"
                            />
                        </div>
                        <div className="short-input-group">
                            <div style={{width:"50%"}}>
                                <SelectorWithLabel
                                    title="入力項目1属性"
                                    options={attribute_list}
                                    getSelect={this.getAttribute.bind(this, 1)}
                                    isDisabled = {this.state.input_item1_flag?false:true}
                                    departmentEditCode={this.state.input_item1_attribute}
                                />
                            </div>
                            <div className = "input-area" style={{width:"50%"}}>
                                <InputWithLabel
                                    label="入力項目1変換フォーマット"
                                    type="text"
                                    isDisabled = {this.state.input_item1_flag?false:true}
                                    getInputText={this.getConvertFormat.bind(this, 1)}
                                    diseaseEditData={this.state.input_item1_format}
                                />
                            </div>
                        </div>
                        <div className="short-input-group">
                            <div style={{width:"50%"}}>
                                <NumericInputWithUnitLabel
                                    label={"入力項目1最大桁数"}
                                    value={this.state.input_item1_max_length}
                                    disabled = {this.state.input_item1_flag?false:true}
                                    getInputText={this.getMaxLength.bind(this, 1)}
                                    inputmode="numeric"
                                />
                            </div>
                            <div className = "input-area" style={{width:"50%"}}>
                                <InputWithLabel
                                    label="入力項目1単位"
                                    type="text"
                                    isDisabled = {this.state.input_item1_flag?false:true}
                                    getInputText={this.getUnit.bind(this,1)}
                                    diseaseEditData={this.state.input_item1_unit}
                                />
                            </div>
                        </div>
                        <div className="checkbox_area" style={{paddingTop:"10px"}}>
                            <Checkbox
                                label="入力項目2表示"
                                getRadio={this.getRadio.bind(this)}
                                value={this.state.input_item2_flag}
                                checked = {this.state.input_item2_flag ===1}
                                name="item2"
                            />
                        </div>
                        <div className="short-input-group" style={{paddingTop:"5px"}}>
                            <div style={{width:"50%"}}>
                                <SelectorWithLabel
                                    title="入力項目2属性"
                                    options={attribute_list}
                                    getSelect={this.getAttribute.bind(this, 2)}
                                    isDisabled = {this.state.input_item2_flag?false:true}
                                    departmentEditCode={this.state.input_item2_attribute}
                                />
                            </div>
                            <div className = "input-area" style={{width:"50%"}}>
                                <InputWithLabel
                                    label="入力項目2変換フォーマット"
                                    type="text"
                                    isDisabled = {this.state.input_item2_flag?false:true}
                                    getInputText={this.getConvertFormat.bind(this, 2)}
                                    diseaseEditData={this.state.input_item2_format}
                                />
                            </div>
                        </div>
                        <div className="short-input-group">
                            <div style={{width:"50%"}}>
                                <NumericInputWithUnitLabel
                                    label={"入力項目2最大桁数"}
                                    value={this.state.input_item2_max_length}
                                    disabled = {this.state.input_item2_flag?false:true}
                                    getInputText={this.getMaxLength.bind(this, 2)}
                                    inputmode="numeric"
                                />
                            </div>
                            <div className = "input-area" style={{width:"50%"}}>
                                <InputWithLabel
                                    label="入力項目2単位"
                                    type="text"
                                    isDisabled = {this.state.input_item2_flag?false:true}
                                    getInputText={this.getUnit.bind(this,2)}
                                    diseaseEditData={this.state.input_item2_unit}
                                />
                            </div>
                        </div>
                        <div className=" short-input-group" style={{marginTop:'10px'}}>
                            <div className={'checkbox_area'} style={{width:"50%"}}>
                                <div style={{lineHeight:"38px"}}>
                                    <Checkbox
                                        label="数値全角変換"
                                        getRadio={this.getRadio.bind(this)}
                                        value={this.state.number_full_angle_flag}
                                        checked = {this.state.number_full_angle_flag ===1}
                                        name="convert-letter"
                                    />
                                </div>
                                <div style={{lineHeight:"38px"}}>
                                    <Checkbox
                                        label="日付0埋め"
                                        getRadio={this.getRadio.bind(this)}
                                        value={this.state.date_zero_fill_flag}
                                        checked = {this.state.date_zero_fill_flag === 1}
                                        name="date_zero_fill_flag"
                                    />
                                </div>
                            </div>
                            <div style={{width:"50%"}}>
                                <div className = "input-area">
                                    <InputWithLabel
                                        label="送信時フォーマット"
                                        type="text"                                
                                        getInputText={this.getSendFormat.bind(this)}
                                        diseaseEditData={this.state.send_format}
                                    />
                                </div>
                                <div className={'checkbox_area'} style={{lineHeight:"38px"}}>
                                    <Checkbox
                                        label="日付数量出力"
                                        getRadio={this.getRadio.bind(this)}
                                        value={this.state.date_amount_output_flag}
                                        checked = {this.state.date_amount_output_flag ===1}
                                        name="date_amount_output_flag"
                                    />
                                </div>
                                <div className={'checkbox_area comment-output'} style={{lineHeight:"38px"}}>
                                    <Checkbox
                                        label="コメントなし時も出力"
                                        getRadio={this.getRadio.bind(this)}
                                        value={this.state.comment_output_flag}
                                        checked = {this.state.comment_output_flag ===1}
                                        name="comment_output_flag"
                                    />
                                </div>
                            </div>
                        </div>
                    </Wrapper>
                </Modal.Body>
                <Modal.Footer>
                    <Footer>
                        <Button onClick={this.handleOk}>{this.props.modal_data !== null ? "変更" : "登録"}</Button>
                        <Button type="mono" onClick={this.props.closeModal}>閉じる</Button>
                    </Footer>
                </Modal.Footer>
                {this.state.isUpdateConfirmModal !== false && (
                    <SystemConfirmJapanModal
                        hideConfirm= {this.confirmCancel.bind(this)}
                        confirmCancel= {this.confirmCancel.bind(this)}
                        confirmOk= {this.register.bind(this)}
                        confirmTitle= {this.state.confirm_message}
                    />
                )}
            </Modal>
        );
    }
}

FunctionItemModal.contextType = Context;

FunctionItemModal.propTypes = {
    closeModal : PropTypes.func,
    handleOk : PropTypes.func,    
    modal_data : PropTypes.object,
    kind : PropTypes.number,
    function_id : PropTypes.number,
    item_category_id:PropTypes.number,
};

export default FunctionItemModal;
