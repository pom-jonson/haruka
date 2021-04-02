import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as methods from "~/components/templates/Dial/DialMethods";
import * as apiClient from "~/api/apiClient";

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
      width: 150px;
      font-size: 18px;
  }
  input {
    width: 419px;
    font-size: 18px;
  }
  .checkbox-label{
    width: 30%;
    text-align: left;
  }
  .add-button {
      text-align: center;
  }
  .checkbox_area {
    padding-left: 25px;
    label{
        font-size: 15px;
        margin-left: 60px;
      }
  }
  .pattern_code {
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px 0 20px 0;
    input {
      font-size: 18px;
      width: 135px;
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

class EditPatternItemModal extends Component {
    constructor(props) {
        super(props);
        let modal_data = this.props.modal_data;
        Object.entries(methods).forEach(([name, fn]) =>
            name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
        );
        this.state = {
            number: modal_data !== null ? modal_data.number : 0,            
            pattern_code: modal_data !== null?modal_data.pattern_code:"",
            item_code: modal_data !== null?modal_data.item_code:"",
            alert_value:modal_data !== null?modal_data.complications_alert_value:"",
            isUpdateConfirmModal: false,
            confirm_message:"",
        }
    }
    
    getAlertValue = e => {
        this.setState({alert_value: e.target.value})
    };
    getContactTelName1 = e => {
        this.setState({contactTelName1: e.target.value})
    };

    register = () => {
        if (this.state.pattern_code === ""){
            window.sessionStorage.setItem("alert_messages", "パターンコードを入力してください。");
            return;
        }
        if (this.state.item_code === ""){
            window.sessionStorage.setItem("alert_messages", "検査項目コードを入力してください。");
            return;
        }
        
        if (isNaN(parseInt(this.state.alert_value))){
            window.sessionStorage.setItem("alert_messages", "警告増減値を数字で入力してください。");
            return;
        }
        
        if(this.props.modal_data !== null){
            this.setState({
                isUpdateConfirmModal : true,
                confirm_message: "検査パターン名称を変更しますか?",
            });
        } else {
            this.saveData();
        }
    }

    saveData = () => {
        var postData = {
            number:this.state.number,
            pattern_code: this.state.pattern_code,
            item_code: this.state.item_code,
            complications_alert_value : this.state.alert_value,            
        };
        let path = "/app/api/v2/dial/master/register_examination_pattern_item";
        apiClient
        .post(path, {
            params: postData
        })
        .then((res) => {
            if(res.error_message !== undefined){
                window.sessionStorage.setItem("alert_messages", res.error_message);
            } else {
                if(res.alert_message)  {
                    var title = '';
                    var message = res.alert_message;
                    if (message.indexOf('変更') > -1) title = "変更完了##";
                    if (message.indexOf('登録') > -1) title = "登録完了##";
                    window.sessionStorage.setItem("alert_messages", title + res.alert_message);
                }
                // this.props.registerExaminationPattern(this.state);
                this.props.handleOk(this.state.pattern_code);                
            }
        })
        .catch(() => {
            window.sessionStorage.removeItem("isCallingAPI");
            this.closeModal();
        });
    }

    confirmCancel() {
        this.setState({
            isUpdateConfirmModal: false,
            confirm_message: "",
        });
    }

    closeModal=()=>{
      this.props.closeModal();
    };

    onHide=()=>{}

    render() {
        const { closeModal } = this.props;        
        return  (
            <Modal show={true} onHide={this.onHide}  className="inspection-pattern-modal master-modal first-view-modal">
                <Modal.Header>
                    <Modal.Title>{"合併症検査項目編集"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>                        
                        <div className="pattern_code">
                            <InputWithLabel
                                label="パターンコード"
                                type="text"
                                // placeholder="パターンコードを入力"
                                // getInputText={this.getPatternCode.bind(this)}
                                isDisabled = {true}
                                diseaseEditData={this.state.pattern_code}
                            />
                            <InputWithLabel
                                label="検査項目コード"
                                type="text"
                                // placeholder="表示順を入力"
                                // getInputText={this.getDisplayOrder.bind(this)}
                                isDisabled= {true}
                                diseaseEditData={this.state.item_code}
                            />
                        </div>
                        <InputWithLabel
                            label="警告増減値"
                            type="text"
                            // placeholder="検査パターン名称を入力"
                            getInputText={this.getAlertValue.bind(this)}
                            diseaseEditData={this.state.alert_value}
                        />                        
                        <div className="footer-buttons">
                            <div style={{width:'100%'}}>
                                <Button className="cancel-btn" onClick={closeModal}>キャンセル</Button>
                                <Button className="red-btn" onClick={this.register}>変更</Button>
                            </div>
                        </div>
                    </Wrapper>
                    {this.state.isUpdateConfirmModal !== false && (
                        <SystemConfirmJapanModal
                            hideConfirm= {this.confirmCancel.bind(this)}
                            confirmCancel= {this.confirmCancel.bind(this)}
                            confirmOk= {this.saveData.bind(this)}
                            confirmTitle= {this.state.confirm_message}
                        />
                    )}
                </Modal.Body>
            </Modal>
        );
    }
}

EditPatternItemModal.contextType = Context;

EditPatternItemModal.propTypes = {
    closeModal: PropTypes.func,
    handleOk: PropTypes.func,
    modal_data: PropTypes.object,
    
};

export default EditPatternItemModal;
