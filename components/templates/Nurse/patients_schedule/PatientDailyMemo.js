import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import * as apiClient from "~/api/apiClient";
import Button from "~/components/atoms/Button";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import {formatDateLine} from "~/helpers/date";
import {addRedBorder} from "~/helpers/dialConstants";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";

const Wrapper = styled.div`  
 width: 100%;
 height: 100%;
 font-size: 1rem;
 overflow-y:auto;
 .flex{
  display: flex;
 }
 .div-title {
   height:2rem;
   line-height:2rem;
 }
 .div-value {
   height:2rem;
   line-height:2rem;
   border:1px solid #aaa;
   padding:0 0.3rem;
 }
 .memo-area {
    width: 100%;
    margin-top: 0.5rem;
    height: calc(40vh - 15rem);
    textarea {
      width: 100%;
      height: 100%;
    }
 }
`;

class PatientDailyMemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected_date:formatDateLine(props.search_date),
      memo:"",
      confirm_message:"",
      confirm_type:"",
      confirm_alert_title:'',
      check_message:'',
      alert_type:"",
      alert_messages:"",
    };
    this.memo = "";
    this.first_tag_id = "";
  }
  async componentDidMount() {
    await this.getPatientMemoInfo();
  }
  
  getPatientMemoInfo=async()=>{
    if(this.state.load_flag){
      this.setState({load_flag:false});
    }
    let path = "/app/api/v2/nursing_service/get/nurse_memo";
    let post_data = {
      patient_id:this.props.patient_info.patient_id,
      type:this.props.modal_type,
      target_date:this.state.selected_date,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          memo:res != null ? res : ""
        });
        this.memo = res != null ? JSON.parse(JSON.stringify(res)) : "";
      })
      .catch(() => {
      
      });
  };

  setMemo = e => {
    this.change_flag = 1;
    this.setState({memo: e.target.value})
  };

  closeModal=()=>{
    if(this.state.alert_type == "modal_close"){
      this.props.closeModal();
    }
    this.setState({
      alert_messages:"",
      confirm_message:"",
      confirm_type:"",
      confirm_alert_title:'',
      check_message:'',
    });
  }
  
  confirmClose=()=>{
    if(this.memo != this.state.memo){
      this.setState({
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type:"modal_close",
        confirm_alert_title:'入力中',
      });
    } else {
      this.props.closeModal();
    }
  }
  
  confirmOk=()=>{
    if(this.state.confirm_type == "modal_close"){
      this.props.closeModal();
    }
    if(this.state.confirm_type == "register"){
      this.register();
    }
  }
  
  confirmRegister=()=>{
    if(this.memo == this.state.memo){return;}
    if(this.state.memo.length > 1000){
      addRedBorder("memo_id");
      this.first_tag_id = "memo_id";
      this.setState({
        check_message:"メモは1000文字以内で入力してください。",
      });
      return;
    }
    this.setState({
      confirm_message:"メモを登録しますか？",
      confirm_type:"register",
      confirm_title:"登録確認"
    });
  }
  
  register=async()=>{
    let path = "/app/api/v2/nursing_service/register/nurse_memo";
    let post_data = {
      patient_id:this.props.patient_info.patient_id,
      type:this.props.modal_type,
      target_date:this.state.selected_date,
      memo:this.state.memo,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          alert_messages:res.success_message != undefined ? res.success_message : res.error_message,
          alert_type:res.success_message != undefined ? "modal_close" : "",
        });
      })
      .catch(() => {
      
      });
  }

  render() {
    return (
      <>
        <Modal
          show={true}
          className="custom-modal-sm patient-daily-memo first-view-modal"
        >
          <Modal.Header><Modal.Title>{this.props.modal_type == "patient" ? "患者別メモ" : "日別メモ"}</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className={'flex'}>
                <div className={'div-title'} style={{width:"4rem"}}>患者ID</div>
                <div className={'div-value'} style={{minWidth:"7rem"}}>{this.props.patient_info.patient_number}</div>
                <div className={'div-title'} style={{width:"5rem", marginLeft:"0.5rem"}}>患者氏名</div>
                <div className={'div-value'} style={{minWidth:"21rem"}}>{this.props.patient_info.patient_name}</div>
                {this.props.modal_type == "date" && (
                  <>
                    <div className={'div-title'} style={{width:"4rem", marginLeft:"0.5rem"}}>対象日</div>
                    <div className={'div-value'} style={{minWidth:"6rem"}}>{this.state.selected_date.split('-').join('/')}</div>
                  </>
                )}
              </div>
              <div className='memo-area'>
                <textarea
                  onChange={this.setMemo.bind(this)}
                  value={this.state.memo}
                  id="memo_id"
                />
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.confirmClose}>キャンセル</Button>
            <Button className={(this.memo != this.state.memo) ? "red-btn" : "disable-btn"} onClick={this.confirmRegister}>{"確定"}</Button>
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
          {this.state.confirm_message != "" && (
            <SystemConfirmJapanModal
              hideConfirm= {this.closeModal.bind(this)}
              confirmCancel= {this.closeModal.bind(this)}
              confirmOk= {this.confirmOk}
              confirmTitle= {this.state.confirm_message}
              title= {this.state.confirm_alert_title}
            />
          )}
          {this.state.check_message != "" && (
            <ValidateAlertModal
              handleOk={this.closeModal}
              alert_meassage={this.state.check_message}
            />
          )}
        </Modal>
      </>
    );
  }
}

PatientDailyMemo.propTypes = {
  closeModal: PropTypes.func,
  modal_type: PropTypes.string,
  search_date: PropTypes.string,
  patient_info: PropTypes.object,
};

export default PatientDailyMemo;
