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

class DoneComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert_messages:"",
      comment:"",
      confirm_message:"",
      confirm_type:"",
      confirm_alert_title:'',
      check_message:'',
    };
    this.comment = "";
    this.first_tag_id = "";
  }
  
  async componentDidMount() {
    // await this.searchSoapFocusRecord();
  }

  setComment = e => {
    this.setState({comment: e.target.value})
  };

  setPeriod=(key,value)=>{
    this.setState({[key]:value});
  };

  searchSoapFocusRecord=async()=>{
    if(this.state.load_flag){
      this.setState({load_flag:false});
    }
    let path = "/app/api/v2/nursing_service/search_plan/soap_focus_record";
    let post_data = {
      start_date:(this.state.start_date != null && this.state.start_date !== "") ? formatDateLine(this.state.start_date) : "",
      end_date:(this.state.end_date != null && this.state.end_date !== "") ? formatDateLine(this.state.end_date) : "",
      problem_focus_classification:this.state.problem_focus_classification,
      nursing_problem_focus:this.state.nursing_problem_focus,
      article:this.state.article,
      problem_number:this.state.problem_number,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          load_flag:true,
          soap_focus_records:res,
          selected_index:-1,
        });
      })
      .catch(() => {

      });
  };
  
  confirmOk=()=>{
    if(this.state.confirm_type == "modal_close"){
      this.props.closeModal();
    }
    if(this.state.confirm_type == "register"){
      this.register();
    }
  }
  
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
    if(this.comment != this.state.comment){
      this.setState({
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type:"modal_close",
        confirm_alert_title:'入力中',
      });
    } else {
      this.props.closeModal();
    }
  }
  
  confirmRegister=()=>{
    if(this.comment == this.state.comment){return;}
    if(this.state.comment.length > 1000){
      addRedBorder("comment_id");
      this.first_tag_id = "comment_id";
      this.setState({
        check_message:"コメントは50文字以内で入力してください。",
      });
      return;
    }
    // this.setState({
    //   confirm_message:"コメントを登録しますか？",
    //   confirm_type:"register",
    //   confirm_title:"登録確認"
    // });
  }
  
  register=async()=>{
    // let path = "/app/api/v2/nursing_service/register/nurse_memo";
    // let post_data = {
    //   patient_id:this.props.patient_info.patient_id,
    //   type:this.props.modal_type,
    //   target_date:this.state.selected_date,
    //   memo:this.state.memo,
    // };
    // await apiClient
    //   .post(path, {
    //     params: post_data
    //   })
    //   .then((res) => {
    //     this.setState({
    //       alert_messages:res.success_message != undefined ? res.success_message : res.error_message,
    //       alert_type:res.success_message != undefined ? "modal_close" : "",
    //     });
    //   })
    //   .catch(() => {
    //
    //   });
  }

  render() {
    return (
      <>
        <Modal
          show={true}
          className="custom-modal-sm patient-daily-memo first-view-modal"
        >
          <Modal.Header><Modal.Title>実施コメント</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div>※コメントは50文字以内で登録してください。</div>
              <div className='memo-area'>
                <textarea
                  onChange={this.setComment.bind(this)}
                  value={this.state.comment}
                  id="comment_id"
                />
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.confirmClose}>キャンセル</Button>
            <Button className={(this.comment != this.state.comment) ? "red-btn" : "disable-btn"} onClick={this.confirmRegister}>{"確定"}</Button>
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

DoneComment.propTypes = {
  closeModal: PropTypes.func,
};

export default DoneComment;
