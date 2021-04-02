import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import Checkbox from "~/components/molecules/Checkbox";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
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
    height: 2.375rem;
  }
  
  .checkbox-label{
    width: 30%;
    text-align: left;
  }
  .label-title{
    font-size: 1rem;
    width: 120px;
    line-height: 2.375rem;
    margin-top: 0;
    margin-bottom: 0;
  }
  .checkbox_area {
    margin-left: 128px;
    margin-bottom: 0.5rem;
    label{
        font-size: 1rem;
        width: 100px;
        text-align: left;
    }
    input {
        height: 15px;
    }
  }
  .selectbox-area{
      .label-title{
        text-align: right;
        margin-right: 10px;
      }
      .pullbox-label, .pullbox-select{
          width:180px!important;
      }
  }

  .short-input-group{
    display:flex;
    input{
        width:130px;
    }
  }
 `;


class DepartmentPracticeModal extends Component {
    constructor(props) {
        super(props);
        let modal_data = this.props.modal_data;
        
        this.state = {            
            is_enabled: modal_data !== null?modal_data.is_enabled:1,
            number: modal_data !== null ? modal_data.number : 0,            
            title:'科別処置定義',                      
            department_id:this.props.department_id, 
            practice_id : modal_data != null? modal_data.practice_id:undefined,
            order : modal_data != null? modal_data.order:undefined,
            confirm_message:"",
            alert_messages:"",
        }
        this.change_flag = 0;
    }

    async componentDidMount(){
        let path = "/app/api/v2/master/treat/searchPractice";
        let post_data = {
            params:{is_enabled:1}
        }
        await apiClient.post(path, post_data).then((res)=>{
            var master_list = [{id:0,value:''}];
            if(res.length > 0){
                res.map(item => {
                    master_list.push({id:item.practice_id, value:item.name});                    
                })
            }
            this.setState({master_list})            
        });

    }
    getAlwaysShow = (name, value) => {
        if(name==="alwaysShow"){
            this.change_flag = 1;
            this.setState({is_enabled: value})
        }
    };    
    
    getOrder = e => {
        this.change_flag = 1;
        this.setState({order: parseInt(e)})
    };
    
    getMasterID = e => {
        this.change_flag = 1;
        this.setState({practice_id:e.target.id});
    }

    async registerMaster()  {
        let path = "/app/api/v2/master/treat/registerDepartmentDefine";
        const post_data = {
            params: this.state
        };
        await apiClient.post(path, post_data).then(()=>{
            let alert_messages = this.props.modal_data !== undefined && this.props.modal_data != null ? "変更しました。": "登録しました。";
            this.setState({alert_messages, alert_action: "close"});
        });
    }

    handleOk = () => {        
        if(this.state.department_id === undefined || this.state.department_id == '' || this.state.department_id <= 0){
            this.setState({alert_messages: '科を選択してください。'});
            return;
        }
        if(this.state.practice_id === undefined || this.state.practice_id == '' || this.state.practice_id <= 0){
            this.setState({alert_messages: 'マスタを選択してください。'});
            return;
        }
    
        if(this.props.modal_data !== null){
            this.setState({
                confirm_message: this.state.title + "マスタ情報を変更しますか?",
                confirm_action: "register"
            });
        } else {
            this.setState({
                confirm_message: this.state.title + "マスタ情報を登録しますか?",
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
    confirmOk = () => {
        this.confirmCancel();
        if (this.state.confirm_action === "close") {
            this.props.closeModal();
        } else if (this.state.confirm_action === "register") {
            this.register();
        }
    }
    
    closeModal = () => {
        if(this.change_flag == 1) {
            this.setState({
                confirm_message: "登録していない内容があります。\n変更内容を破棄して移動しますか？",
                confirm_alert_title:'入力中',
                confirm_action: "close"
            });
            return;
        } else {
            this.props.closeModal();
        }
    }

    render() {        
        return  (
            <Modal show={true} id="add_contact_dlg"  className="medicine-modal first-view-modal">
                <Modal.Header>
                    <Modal.Title>{this.state.title}マスタ{this.state.modal_data == null?'登録':'編集'}</Modal.Title>
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
                        <div className="selectbox-area short-input-group">
                            {this.state.master_list != undefined && this.state.master_list != null && (
                                <SelectorWithLabel
                                    options={this.state.master_list}
                                    title='行為'
                                    getSelect={this.getMasterID}
                                    departmentEditCode={this.state.practice_id}
                                />
                            )}
                            <NumericInputWithUnitLabel
                                label="表示順"                                
                                value={this.state.order}
                                getInputText={this.getOrder.bind(this)}
                                inputmode="numeric"
                            />
                        </div>
                    </Wrapper>
                    {this.state.confirm_message !== "" && (
                      <SystemConfirmJapanModal
                        hideConfirm= {this.confirmCancel.bind(this)}
                        confirmCancel= {this.confirmCancel.bind(this)}
                        confirmOk= {this.confirmOk.bind(this)}
                        confirmTitle= {this.state.confirm_message}
                        title={this.state.confirm_alert_title}
                      />
                    )}
                    {this.state.alert_messages !== "" && (
                      <AlertNoFocusModal
                        hideModal= {this.confirmCancel.bind(this)}
                        handleOk= {this.confirmCancel.bind(this)}
                        showMedicineContent= {this.state.alert_messages}
                      />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
                    <Button className={this.change_flag == 1 ? "red-btn" :"disable-btn"} onClick={this.handleOk}>{this.props.modal_data !== null ? "変更" : "登録"}</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

DepartmentPracticeModal.contextType = Context;

DepartmentPracticeModal.propTypes = {
    closeModal: PropTypes.func,
    handleOk:   PropTypes.func,    
    modal_data:PropTypes.object,
    department_id : PropTypes.number,    
};

export default DepartmentPracticeModal;
