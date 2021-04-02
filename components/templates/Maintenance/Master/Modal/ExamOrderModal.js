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
import Radiobox from "~/components/molecules/Radiobox";
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
			font-size: 1rem;
			margin-bottom: 0px;
			margin-top: 0px;
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
    height: 2rem;
    line-height: 2rem;
    margin-top: 0px;
    font-size: 1rem;
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
  .add-button {
      text-align: center;
      width:100%;
  }
  .checkbox_area {    
    div{
      margin-top: 0px;
    }
    .form-control{
      height: 2rem;
      line-height: 2rem;
      font-size: 1rem;
    }
    margin-left: 88px;
    label {
      margin-top: 0.1rem;
      font-size: 1rem;
      text-align: left;
      width: 200px;
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
  .title{
    height: 2rem;    
  }
  .radio-area{
    input{
      height: 15px;
    }
  }
 `;


class ExamOrderModal extends Component {
    constructor(props) {
        super(props);
        let modal_data = this.props.modal_data;
        
        this.state = {            
            is_enabled: modal_data !== null?modal_data.is_enabled:1,
            number: modal_data !== null ? modal_data.number : 0,            
            code : modal_data !== null ? modal_data.code : undefined,
            label : modal_data !== null ? modal_data.label : undefined,
            is_in_hospital : modal_data !== null ? modal_data.is_in_hospital : 0,
            name:modal_data !== null?modal_data.name:"",            
            receipt_key : modal_data !== null?modal_data.receipt_key:"",
            is_calculate_rapid_examination : modal_data !== null ? modal_data.is_calculate_rapid_examination : 0,
            can_order_off_hours : modal_data !== null ? modal_data.can_order_off_hours : 0,

            title:'検体検査',            
            isUpdateConfirmModal: false,
            isBackConfirmModal: false,
            confirm_message:"",
        }
				this.original = JSON.stringify(this.state);
    }

    getAlwaysShow = (name, value) => {
        if(name == "alwaysShow"){
            this.setState({is_enabled: value})
        }
        if (name == 'rapid'){
            this.setState({is_calculate_rapid_examination: value})
        }
        if (name == 'can_order_off_hours'){
            this.setState({can_order_off_hours: value})
        }
    };
    getCode = e => {
        this.setState({code: parseInt(e)})        
        
    };
    getOrder = e => {
        this.setState({order: parseInt(e.target.value)})
    };
    getName = e => {
        this.setState({name: e.target.value})
    };
    getLabel = e => {
        this.setState({label: e.target.value})
    };
    getReceiptKey = e => {
        this.setState({receipt_key: e.target.value})
    }
    getRadio = e => {
        this.setState({is_in_hospital:parseInt(e.target.value)})
    }
    

    async registerMaster()  {
        let path = "/app/api/v2/master/examination/registerExamOrder";
        const post_data = {
            params: this.state
        };        
        await apiClient.post(path, post_data).then((res)=>{
          if (res)
                window.sessionStorage.setItem("alert_messages", res.alert_message);
        });
    }

    handleOk = () => {
        if(this.state.code === undefined || this.state.code == '' || this.state.code <= 0){
            window.sessionStorage.setItem("alert_messages", '検査項目IDを入力してください。');
            return;
        }

        if((this.state.label === undefined || this.state.label == '')){
            window.sessionStorage.setItem("alert_messages", '表示名を入力してください。');
            return;
        }

        if(this.state.name === ''){
            window.sessionStorage.setItem("alert_messages", '項目名を入力してください。');
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
                        <div className="">
                            <NumericInputWithUnitLabel
                                label='検査項目ID'
                                value={this.state.code}
                                disabled = {this.props.modal_data!=null?true:false}
                                getInputText={this.getCode.bind(this)}
                                inputmode="numeric"
                            />
                        </div>
                        <InputWithLabel
                            label='検査項目名'
                            type="text"
                            className="name-area"
                            getInputText={this.getName.bind(this)}
                            diseaseEditData={this.state.name}
                        /> 
                        <InputWithLabel
                            label='表示名'
                            type="text"
                            className="name-area"
                            getInputText={this.getLabel.bind(this)}
                            diseaseEditData={this.state.label}
                        />
                        <InputWithLabel
                            label="会計用キー"
                            type="text"
                            getInputText={this.getReceiptKey.bind(this)}
                            diseaseEditData={this.state.receipt_key}
                        />
                        <div className="checkbox_area">
                            <Checkbox
                                label="外来迅速検体検査加算"
                                getRadio={this.getAlwaysShow.bind(this)}
                                value={this.state.is_calculate_rapid_examination}
                                checked = {this.state.is_calculate_rapid_examination ===1}
                                name="rapid"
                            />
                        </div>
                        <div className="checkbox_area">
                            <Checkbox
                                label="夜間・休日に測定可能"
                                getRadio={this.getAlwaysShow.bind(this)}
                                value={this.state.can_order_off_hours}
                                checked = {this.state.can_order_off_hours === 1}
                                name="can_order_off_hours"
                            />
                        </div>
                        <div style={{display:'flex'}}>
                            <div className="title">院内検査フラグ</div>
                            <div className='radio-area'>
                            <Radiobox
                                label={'院内'}
                                value={0}
                                getUsage={this.getRadio.bind(this)}
                                checked={this.state.is_in_hospital === 0 ? true : false}
                                name={`hospital`}
                            />
                            <Radiobox
                                label={'院外'}
                                value={1}
                                getUsage={this.getRadio.bind(this)}
                                checked={this.state.is_in_hospital === 1 ? true : false}
                                name={`hospital`}
                            />
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
									<Button className="cancel-btn" onClick={this.handleCloseModal}>キャンセル</Button>
									<Button
										onClick={this.handleOk}            
										className={JSON.stringify(this.state) != this.original ? "red-btn" : "disable-btn"}
										isDisabled={JSON.stringify(this.state) == this.original}
									>{this.props.modal_data !== null ? "変更" : "登録"}</Button>
									{this.state.modal_data === null && (
										<Button className="red-btn" onClick={this.temp_save}>続けて登録</Button>
									)}
								</Modal.Footer>
            </Modal>
        );
    }
}

ExamOrderModal.contextType = Context;

ExamOrderModal.propTypes = {
    closeModal: PropTypes.func,
    handleOk:   PropTypes.func,
    modal_data:PropTypes.object,
    first_kind_number : PropTypes.number,
    part_id : PropTypes.number,
};

export default ExamOrderModal;
