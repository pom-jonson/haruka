import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import Button from "~/components/atoms/Button";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";

const Wrapper = styled.div`
  width:100%;
  height:100%;
  font-size:1rem;
  .button-op{
    padding: 1rem;
    .text-under{text-decoration: underline;}
    span{font-size: 14px !important;}
  }
  .first-div{
    overflow: hidden;
    button{float:left;}
    border-bottom: 1px solid #aaa;
  }
  .second-div{
    overflow: hidden;
    border-bottom: 1px solid #ddd;
    button{float:left;}
    border-bottom: 1px solid #aaa;
  }
  .third-div{
    overflow: hidden;
    border-bottom: 1px solid #ddd;
    button{
      float:left;
      border: 1px solid black;
      background: #efefef;
      span{color: black;}
    }
  }
  .forth-div{
    overflow: hidden;
    float: right;
    padding-right: 30px;
    button{
      width: 200px !important;
      margin: 0px !important;
      margin-top: 15px !important;
    }
  }
  .flex {display:flex;}
  .register-info {
    border-bottom: 1px solid #aaa;
    padding-bottom: 20px;
    padding-left: 15px;
    .label-title {width: 4rem;}
    .label-name {
      width:calc(100% - 4rem);
      word-break: break-all;
    }
  }
  .red-btn {
    background-color: #cc0000;
    span {color: #ffffff;}
  }
  .red-btn:hover {
    background: #e81123;
    span {color: #ffffff;}
  }
  .cancel-btn {
    background: #ffffff;
    border: solid 2px #7e7e7e;
    span {color: #7e7e7e;}
  }
  .cancel-btn:hover {
    border: solid 2px #000000;
    background: #ffffff;
    span {color: #000000;}
  }
`;

const ButtonBox = styled.div`
  text-align: left;
  span {font-size: 18px;}
`;

const buttonStyle = {
  fontSize: "18px",
  width: "310px",
  padding: "10px",
  margin: "1rem",
};

class VisitTreatmentPatientDeleteConfirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirm_type:"",
      confirm_title:"",
      confirm_message:"",
    }
  }
  
  confirmCancel=()=>{
    this.setState({
      confirm_type:"",
      confirm_title:"",
      confirm_message:"",
    });
  }
  
  deleteConfirm=(act)=>{
    this.setState({
      confirm_type:act,
      confirm_title:"削除確認",
      confirm_message:"削除を実行しますか？",
    });
  }
  
  delete=()=>{
    this.props.handleOk(this.props.modal_data.system_patient_id, this.state.confirm_type === "first" ? "cancel" : "");
  }
  
  render() {
    return  (
      <Modal show={true} className="endExamination_dlg first-view-modal" centered size="lg">
        <Modal.Body>
          <Wrapper>
            <div style={{padding:"0 1rem"}}>{this.props.modal_data.patient_number} : {this.props.modal_data.patient_name}</div>
            <div style={{padding:"0 1rem"}}>{this.props.modal_data.place_name+ ' （'+this.props.modal_data.group_name+'）'}</div>
            <ButtonBox>
              <div className="first-div">
                <Button style={buttonStyle} className={'red-btn'} onClick={this.deleteConfirm.bind(this,'first')}>予定を削除してグループから削除</Button>
                <div className="button-op">
                  <div><span>グループから削除し、未実施のスケジュールも削除します。</span></div>
                </div>
              </div>
              <div className="second-div">
                <Button style={buttonStyle} className={'red-btn'} onClick={this.deleteConfirm.bind(this,'second')}>グループから削除</Button>
                <div className="button-op">
                  <div><span>グループから削除します。スケジュールは削除しません。</span></div>
                </div>
              </div>
              <div className="forth-div">
                <Button style={buttonStyle} className={'cancel-btn'} onClick={this.props.closeModal}>キャンセル</Button>
              </div>
            </ButtonBox>
          </Wrapper>
        </Modal.Body>
        {this.state.confirm_message !== "" && (
          <ConfirmNoFocusModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.delete.bind(this)}
            confirmTitle= {this.state.confirm_message}
            title = {this.state.confirm_title}
          />
        )}
      </Modal>
    );
  }
}

VisitTreatmentPatientDeleteConfirm.contextType = Context;
VisitTreatmentPatientDeleteConfirm.propTypes = {
  closeModal: PropTypes.func,
  modal_data: PropTypes.object,
  handleOk: PropTypes.func,
};
export default VisitTreatmentPatientDeleteConfirm;
