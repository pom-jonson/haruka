import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import Checkbox from "~/components/molecules/Checkbox";
// import InputWithLabel from "~/components/molecules/InputWithLabel";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import DatePicker from "react-datepicker";
import { formatTime, formatTimePicker } from "~/helpers/date";
// import Spinner from "react-bootstrap/Spinner";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
// import RadioGroupButton from "~/components/molecules/RadioGroup";

// const SpinnerWrapper = styled.div`
//   height: 200px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;

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
      width: 120px;
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
		width: 120px;
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
  .label-date{
      margin-right:8px;
      width:120px;
			height: 2rem;
			line-height: 2rem;
  }
	.label-date-input{
		margin-bottom: 0.5rem;
		input{
			border-radius: 4px;
			border: 1px solid rgb(206, 212, 218);
			line-height: normal;
		}
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
    margin-left: 128px;
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
	.short-input-group{
		div{
			margin-top: 0px;
		}
    display:flex;
    input{
        width:130px;
				font-size: 1rem;
    }
    input{        
        line-height: 0.5rem;        
    }
    b {
      right: 4px !important;
    }
  }
 `;


class InspectionBookModal extends Component {
    constructor(props) {
        super(props);
        let modal_data = this.props.modal_data;
        
        this.state = {
            is_enabled: modal_data !== null && modal_data.is_enabled != undefined?modal_data.is_enabled:1,
            number: modal_data !== null ? modal_data.number : 0,            
            inspection_id : modal_data !== null ? modal_data.id : '',
            start_time : modal_data !== null ?formatTimePicker(modal_data.start_time) : undefined,
            end_time : modal_data !== null ? formatTimePicker(modal_data.end_time) : undefined,
            time_interval: modal_data !== null ? modal_data.time_interval : undefined,
            title:'予約枠',
            
            init_start_time : modal_data !== null ?formatTimePicker(modal_data.start_time) : undefined,
            init_end_time : modal_data !== null ? formatTimePicker(modal_data.end_time) : undefined,
            init_time_interval: modal_data !== null ? modal_data.time_interval : undefined,

            isUpdateConfirmModal: false,
            isBackConfirmModal: false,
            confirm_message:"",
            complete_message:"",
        }
    }

    getAlwaysShow = (name, value) => {
        if(name==="alwaysShow"){
            this.setState({is_enabled: value})
        }
    };
    getMasterID = e => {
        this.setState({position_id: e.target.value})        
        
    };
    getOrder = e => {
        this.setState({order: parseInt(e.target.value)})
    };
    getTimeInterval = e => {
        this.setState({time_interval: parseInt(e)})
    };   

    async registerMaster()  {
        let path = "/app/api/v2/master/inspection/registerBookMaster";
        const post_data = {
            params: {
                number:this.state.number,
                is_enabled:this.state.is_enabled,
                inspection_id:this.state.inspection_id,
                start_time:formatTime(this.state.start_time),
                end_time:formatTime(this.state.end_time),
                time_interval:this.state.time_interval,
            }
        };
        await apiClient.post(path, post_data).then((res)=>{
          if (res)						
						window.sessionStorage.setItem("alert_messages", '予約枠時間帯マスタを変更しました。');
        });
    }

    handleOk = () => {        
        if((this.state.inspection_id === undefined || this.state.inspection_id == '' || this.state.inspection_id <= 0)){
            window.sessionStorage.setItem("alert_messages", '検査マスタIDを選択してください。');
            return;
        }
        if((this.state.start_time === undefined || this.state.start_time == '')){
            window.sessionStorage.setItem("alert_messages", '開始時刻を入力してください。');
            return;
        }
        if((this.state.end_time === undefined || this.state.end_time == '')){
            window.sessionStorage.setItem("alert_messages", '終了時刻を入力してください。');
            return;
        }
        if (this.state.start_time >= this.state.end_time ){
            window.sessionStorage.setItem("alert_messages", '終了時刻が開始時刻より早いです。 正確に入力してください');
            return;
        }
        if((this.state.time_interval === undefined || this.state.time_interval == '' || this.state.time_interval <= 0)){
            window.sessionStorage.setItem("alert_messages", '1枠の長さを入力してください。');
            return;
        }

        if (formatTime(this.state.start_time) == formatTime(this.state.init_start_time) && formatTime(this.state.end_time) == formatTime(this.state.init_end_time) && this.state.time_interval == this.state.init_time_interval){
            window.sessionStorage.setItem("alert_messages", '変更された項目がありません。');
            return;
        }

        if(this.props.modal_data !== null){
            this.setState({
                isUpdateConfirmModal : true,
                confirm_message: this.state.title + "マスタ情報を変更しますか?",
            });
        } else {
					this.setState({
						complete_message: "処理中"
					},()=>{
            this.register();
					});
        }
    };

    register = () => {
        this.confirmCancel(); 
        this.registerMaster().then(() => {            
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

    getStartTime = value => {
        this.setState({start_time: value});
    };

    getEndTime = value => {
        this.setState({end_time: value});
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

		handleRegister = () => {
			this.setState({
				complete_message: "処理中"
			},()=>{
				this.register();
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
                        <div className="label-date-input">
                            <label className="label-date">開始時刻</label>
                            <DatePicker
                                locale="ja"
                                selected={this.state.start_time}
                                onChange={this.getStartTime.bind(this)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={10}
                                dateFormat="HH:mm"
                                timeFormat="HH:mm"
                                timeCaption="時間"
                            />
                        </div>
                        <div className="label-date-input">
                            <label className="label-date">終了時刻</label>
                            <DatePicker
                                locale="ja"
                                selected={this.state.end_time}
                                onChange={this.getEndTime.bind(this)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={10}
                                dateFormat="HH:mm"
                                timeFormat="HH:mm"
                                timeCaption="時間"
                            />
                        </div>
												<div className="short-input-group">
													<NumericInputWithUnitLabel
															label='1枠の長さ'
															value={this.state.time_interval}                            
															getInputText={this.getTimeInterval.bind(this)}
															inputmode="numeric"
													/>                                                
												</div>
                    </Wrapper>
                    {this.state.isUpdateConfirmModal !== false && (
                        <SystemConfirmJapanModal
                            hideConfirm= {this.confirmCancel.bind(this)}
                            confirmCancel= {this.confirmCancel.bind(this)}
                            confirmOk= {this.handleRegister}
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
										{this.state.complete_message !== '' && (
											<CompleteStatusModal
												message = {this.state.complete_message}
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
								</Modal.Footer>
            </Modal>
        );
    }
}

InspectionBookModal.contextType = Context;

InspectionBookModal.propTypes = {
    closeModal: PropTypes.func,
    handleOk:   PropTypes.func,
    modal_data:PropTypes.object,    
    inspection_id : PropTypes.number,
};

export default InspectionBookModal;
