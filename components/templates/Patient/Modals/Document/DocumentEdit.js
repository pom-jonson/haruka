import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import * as karteApi from "~/helpers/cacheKarte-utils";
import {CACHE_LOCALNAMES} from "~/helpers/constants";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";

const Wrapper = styled.div`
  display: block;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  .flex{
    display:flex;
  }
  .justify-content {
    align-items: flex-start;
    justify-content: space-between;
  }
  .label-title{
    text-align: left;
    width: 8rem;
    font-size:1rem;
    margin: 0;
    line-height: 2rem;
  }
  .div-title {width: 8rem;}
  .div-value {width: calc(100% - 8rem);}
  .input-comment {
    margin-top:0.5rem;
    div {margin-top:0;}
    input {
      width: calc(100% - 8rem);
      height:2rem;
    }
  } 
`;

class DocumentEdit extends Component {
  constructor(props) {
    super(props);
    let free_comment = "";
    this.cache_data = {};
    if(props.cache_data != undefined && props.cache_data != null){
      this.cache_data = props.cache_data;
      free_comment = props.cache_data.free_comment;
    } else {
      this.cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.DOCUMENT_CREATE, this.props.cache_index);
      free_comment = this.cache_data.free_comment;
    }
    this.state = {
      free_comment,
      confirm_message:"",
      confirm_type:"",
      confirm_alert_title:'',
      alert_messages:'',
    };
    this.change_flag = 0;
  }

  getFreeCommnet(e) {
    if(e.target.value.length > 25){
      this.setState({alert_messages:"フリーコメントは25文字以内で入力してください。"});
      return;
    }
    this.change_flag = 1;
    this.setState({free_comment:e.target.value});
  }

  confirmRegister=()=>{
    if(this.change_flag == 0){
      return;
    }
    this.setState({
      confirm_type:"register",
      confirm_message:"文書を登録しますか？"
    });
  }

  handleOk = () => {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let document_create = this.cache_data;
    document_create.last_doctor_code = this.cache_data.doctor_code;
    document_create.last_doctor_name = this.cache_data.doctor_name;
    document_create.free_comment = this.state.free_comment;
    document_create.doctor_code = authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code;
    document_create.doctor_name = authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name;
    karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.DOCUMENT_CREATE, this.props.cache_index, JSON.stringify(document_create), 'insert');
    this.context.$setExaminationOrderFlag(1);
    this.props.closeModal();
  };

  confirmCloseModal=()=>{
    if(this.change_flag == 1){
      this.setState({
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type:"close",
        confirm_alert_title:'入力中',
      });
    } else {
      this.props.closeModal();
    }
  }

  confirmOk=()=>{
    if(this.state.confirm_type == "close"){
      this.props.closeModal();
    }
    if(this.state.confirm_type == "register"){
      this.handleOk();
    }
  }

  confirmCancel=()=>{
    this.setState({
      confirm_message:"",
      confirm_type:"",
      confirm_alert_title:'',
      alert_messages:'',
    });
  }

  render() {
    return  (
      <Modal show={true} id="add_contact_dlg"  className="document-edit-modal first-view-modal">
        <Modal.Header>
          <Modal.Title>文書作成</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className={'flex'}>
              <div className={'div-title'}>文書伝票</div>
              <div className={'div-value'}>{this.cache_data.slip_name}</div>
            </div>
            <div className={'flex'} style={{marginTop:"0.5rem"}}>
              <div className={'div-title'}>文書タイトル</div>
              <div className={'div-value'}>{this.cache_data.name}</div>
            </div>
            <div className={'input-comment'}>
              <InputBoxTag
                label="フリーコメント"
                type="text"
                getInputText={this.getFreeCommnet.bind(this)}
                value={this.state.free_comment}
              />
              <div style={{float:'right'}}>25文字まで</div>
            </div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className={'cancel-btn'} onClick={this.confirmCloseModal}>キャンセル</Button>
          <Button className={this.change_flag == 1 ? 'red-btn' : 'disable-btn'} onClick={this.confirmRegister}>確定</Button>
        </Modal.Footer>
        {this.state.confirm_message !== "" && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.confirmOk}
            confirmTitle= {this.state.confirm_message}
            title = {this.state.confirm_alert_title}
          />
        )}
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal= {this.confirmCancel.bind(this)}
            handleOk= {this.confirmCancel.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
      </Modal>
    );
  }
}

DocumentEdit.contextType = Context;

DocumentEdit.propTypes = {
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,
  closeModal: PropTypes.func,
  cache_index:PropTypes.number,
  cache_data:PropTypes.object,
};

export default DocumentEdit;
