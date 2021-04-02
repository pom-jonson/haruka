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
 
const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  float: left;
  input {
    width: 400px;
    font-size: 1rem;
    height: 2rem;
    line-height: 2rem;
  }
  .short-input-group{    
    input{        
        line-height: 0.5rem;        
    }
    b {
      right: 4px !important;
    }
  }
  .checkbox-label{
    width: 30%;
    text-align: left;
  }
  .label-title{
    font-size: 1rem;
    width: 120px;
    text-align: right;
    margin-right: 8px;
    margin-top: 0px;
    height: 2rem;
    line-height: 2rem;
    margin-top: 0px;
   }
  .pullbox-title{
    height: 2rem;
    line-height: 2rem;
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
    padding-left: 128px;
    label{
        font-size: 1rem;
        width: 100px;
    }
    div{
      margin-top: 0px;
    }
    .form-control{
      height: 2rem;
      line-height: 2rem;
      font-size: 1rem;
    }
    label {
      margin-top: 0.1rem;
      font-size: 1rem;
      text-align: left;
      width: 100px;
      height: 2rem;
      line-height: 2rem;
      input{
        font-size: 1rem;
        height: 15px !important;
      }      
    }
  }
  .short-input-group{
    display:flex;
    input{
        width:130px;
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
  .pullbox {
    margin-top: 8px;
  }

 `;

class TabCategoryModal extends Component {
    constructor(props) {
        super(props);
        let modal_data = this.props.modal_data;       
        var title = "", id, name = '';
        switch(this.props.kind){
            case 0:
                title = 'タブ'; 
                id = modal_data !== null ? modal_data.tab_id : '';
                name = modal_data !== null ? modal_data.tab_name : '';
                break;
            case 1:
                title = 'カテゴリ';
                id = modal_data !== null ? modal_data.category_id : '';
                name = modal_data !== null ? modal_data.category_name : '';
                break;
        }
        
        this.state = {
            kind:this.props.kind,
            is_enabled: modal_data !== null?modal_data.is_enabled:1,
            is_visible: modal_data !== null?modal_data.is_visible:1,
            number: modal_data !== null ? modal_data.number : 0,
            sort_number: modal_data !== null ? modal_data.sort_number : undefined,            
            tab_id: modal_data !== null ? modal_data.tab_id : (this.props.kind ==1?this.props.tab_id:undefined),
            category_id: modal_data !== null ? modal_data.category_id : undefined,            
            
            id,
            title,
            name,
            
            isUpdateConfirmModal: false,
            isBackConfirmModal: false,
            confirm_message:"",            
        }
        this.change_flag = 0;
    }

    getAlwaysShow = (name, value) => {
      this.change_flag = 1;
        switch(name){
            case 'enabled':
                this.setState({is_enabled: value})
                break;
            case 'visible':
                this.setState({is_visible: value})
                break;    
        }
    };

    getMasterID = e => {
      this.change_flag = 1;
        switch(this.props.kind){
            case 0:
                this.setState({id:parseInt(e), tab_id:parseInt(e),})
                break;
            case 1:
                this.setState({id:parseInt(e), category_id:parseInt(e),})
                break;
        }
    };
    
    getName = e => {
      this.change_flag = 1;
        switch(this.props.kind){
            case 0:
                this.setState({name: e.target.value, tab_name:e.target.value,})
                break;
            case 1:
                this.setState({name: e.target.value, category_name:e.target.value})
                break;
        }        
    };

    async registerMaster()  {
        var path = '';
        const post_data = {
            params: this.state
        };
        switch(this.props.kind){
            case 0:
                path = "/app/api/v2/master/menu/registerTab";
                break;
            case 1:
                path = "/app/api/v2/master/menu/registerCategory";
                break;            
        }
        await apiClient.post(path, post_data).then(()=>{
            if (this.props.modal_data != null){
                window.sessionStorage.setItem("alert_messages", '変更しました。');
            } else {
                window.sessionStorage.setItem("alert_messages", '登録しました。');
            }
        });
    }

    handleOk = () => {
        if(this.state.id === undefined || this.state.id === '' || this.state.id <= 0){
            window.sessionStorage.setItem("alert_messages", 'IDを入力してください。');
            return;
        }
        if((this.state.tab_id === undefined || this.state.tab_id === '') && this.props.kind == 1){
            window.sessionStorage.setItem("alert_messages", 'タブIDを選択してください。');
            return;
        }
        if(this.state.name === ''){
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
            isBackConfirmModal: false,
            confirm_message: "",
        });
    }

    setSendingCategory = e => {
        this.setState({ sending_category: parseInt(e.target.id)});
    };

    getSortNumber = e => {
      this.change_flag = 1;
        this.setState({sort_number: parseInt(e)})
    };

    handleCloseModal = () => {
      if (this.change_flag == 1) {
        this.setState({
          isBackConfirmModal: true,
          confirm_message:
            "登録していない内容があります。変更内容を破棄して移動しますか？",
        });
      } else {
        this.props.closeModal();
      }      
    }

    render() {        
        return  (
            <Modal show={true} id="add_contact_dlg"  className="medicine-modal first-view-modal">
                <Modal.Header>
                    <Modal.Title>{this.state.title}{this.props.modal_data != null?'編集':'登録'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                    <div className="checkbox_area">
                            <Checkbox
                                label="有効化"
                                getRadio={this.getAlwaysShow.bind(this)}
                                value={this.state.is_enabled}
                                checked = {this.state.is_enabled ===1}
                                name="enabled"
                            />
                            <Checkbox
                                label="常に表示"
                                getRadio={this.getAlwaysShow.bind(this)}
                                value={this.state.is_visible}
                                checked = {this.state.is_visible ===1}
                                name="visible"
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
                                value={this.state.sort_number}
                                getInputText={this.getSortNumber.bind(this)}
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
                      />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button className="cancel-btn" onClick={this.handleCloseModal}>キャンセル</Button>
                    <Button className={this.change_flag == 1 ? "red-btn":"disable-btn"} onClick={this.handleOk} isDisabled={this.change_flag == 0}>{this.props.modal_data !== null ? "変更" : "登録"}</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

TabCategoryModal.contextType = Context;

TabCategoryModal.propTypes = {
    closeModal : PropTypes.func,
    handleOk : PropTypes.func,    
    modal_data : PropTypes.object,
    kind : PropTypes.number,
    tab_id : PropTypes.number,
};

export default TabCategoryModal;
