import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import Button from "~/components/atoms/Button";
import PropTypes from "prop-types";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import * as localApi from "~/helpers/cacheLocal-utils";

const Wrapper = styled.div`
  .patient-info{
    border-bottom: 1px solid #ddd;
    overflow: hidden;
    padding-left: 15px;
    padding-bottom: 5px;
    color: blue;
    font-size: 20px;
    .float-left{
      float: left;
      width: 50%;
    }
    .float-right{
      float: right;
      text-align: right;
      width: 50%;
      padding-right: 30px;
    }
  }
  .first-div{
    overflow: hidden;
    button{
      float:left;
    }
  }
  .second-div{
    overflow: hidden;
    border-bottom: 1px solid #ddd;
    button{
      float:left;
    }
  }
  .third-div{
    overflow: hidden;
    border-bottom: 1px solid #ddd;
    button{
      float:left;
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
      border: 1px solid black;
      background: #efefef;
      span{
        color: black;
      }
    } 
  }
  .button-op{
    padding: 16px;
    .text-under{
      text-decoration: underline;
    }
    span{
      font-size: 14px !important;
    }
  }
  .flex {display:flex;}
  .first-medical {
    -webkit-box-pack: justify;
    justify-content: space-between;
    .block-area {
      width: 45%;
      border: 1px solid #aaa;
      margin-top: 20px;
      padding: 10px;
      position: relative;
      color: black;
      label {
        font-size: 14px;
        width:auto; 
      }
    }
    .block-title {
      position: absolute;
      top: -12px;
      left: 10px;
      font-size: 18px;
      background-color: white;
      padding-left: 5px;
      padding-right: 5px;
    }
  }
  .medical-comment {
    .label-title {
      font-size: 14px;
      text-align: right;      
      color: black;
    }
  }
 `;


const ButtonBox = styled.div`
  text-align: left;
  span {
    font-size: 18px;
  }
  .red-btn {
    background: #cc0000 !important;
    span {
      color: #ffffff !important;
    }
  }
  .red-btn:hover {
    background: #e81123 !important;
    span {
      color: #ffffff !important;
    }
  }
  .cancel-btn {
    background: #ffffff !important;
    border: solid 2px #7e7e7e !important;
    span {
      color: #7e7e7e !important;
    }
  }
  .cancel-btn:hover {
    border: solid 2px #000000 !important;
    background: #ffffff !important;
    span {
      color: #000000 !important;
    }
  }
  .disable-btn {
    background: #d3d3d3;
    span {
      color: #595959;
    }
  }
  .disable-btn:hover {
    background: #d3d3d3;
    span {
      color: #595959;
    }
  }
  .delete-btn {
    background: #ffffff;
    border: solid 2px #4285f4;
    span {
      color: #4285f4;
    }
  }
  .delete-btn:hover {
    background: #4285f4;
    span {
      color: #ffffff;
    }
  }
`;

const buttonStyle = {
  fontSize: "18px",
  width: "380px",
  padding: "10px",
  margin: "16px"
};


class NurseRecordSave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirm_title:"",
      confirm_message:"",
      complete_message:""
    }
  }

  async componentDidMount(){
  }

  saveAndGoList=()=>{
    this.setState({complete_message:"保存中"});
    this.props.registerNurseRecord("close_page");
  }
  
  saveAndGoKarte=()=>{
    this.setState({complete_message:"保存中"});
    this.props.registerNurseRecord();
  }

  openConfirmModal=()=>{
    this.setState({
      confirm_title : '破棄確認',
      confirm_message : '看護記録を破棄しますか？'
    });
  }

  confirmCancel=()=>{
    this.setState({
      confirm_title : '',
      confirm_message : ''
    });
  }

  cancelAndGoList = () => {
    let system_before_page = localApi.getValue('system_before_page');
    if (system_before_page != null && system_before_page != undefined && system_before_page != "") {
      this.props.goOtherPage(system_before_page);
    } else {
      this.props.goOtherPage("/hospital_ward_map");
    }
  }

  render() {
    const { patientInfo } = this.props;
    return  (
      <Modal
        show={true}
        className="endExamination_dlg first-view-modal"
        centered
        size="lg"
      >
        <Modal.Header><Modal.Title>看護記録保存</Modal.Title></Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="patient-info">
              <div className="float-left">{patientInfo.receId} {patientInfo.name}</div>
              <div className="float-right">{patientInfo.sex == 1 ? "男" : "女"} {patientInfo.age}歳 {patientInfo.age_month}ヶ月</div>
            </div>
            <ButtonBox>
              <div className="first-div">
                <Button onClick={this.saveAndGoList.bind(this)} style={buttonStyle} className={"red-btn"}>保存して閉じる</Button>
                <div className="button-op">
                  <div><span className="text-under">入力内容を保存</span><span>して看護記録を閉じます</span></div>
                  <div><span>診察を終了します</span></div>
                </div>
              </div>
              <div className="second-div">
                <Button onClick={this.saveAndGoKarte} style={buttonStyle} className={"red-btn"}>保存する</Button>
                <div className="button-op">
                  <div><span className="text-under">入力内容を保存</span><span>し、看護記録に戻ります</span></div>
                </div>
              </div>
              <div className="third-div">
                <Button className="delete-btn" onClick={this.openConfirmModal} style={buttonStyle}>入力内容を破棄する</Button>
                <div className="button-op">
                  <div><span className="text-under">入力内容を破棄</span><span>して看護記録を閉じます</span></div>
                </div>
              </div>
            </ButtonBox>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
        </Modal.Footer>
        {this.state.confirm_message !== "" && (
          <ConfirmNoFocusModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.cancelAndGoList.bind(this)}
            confirmTitle= {this.state.confirm_message}
            title= {this.state.confirm_title}
          />
        )}
        {this.state.complete_message !== '' && (
          <CompleteStatusModal
            message = {this.state.complete_message}
          />
        )}
      </Modal>
    );
  }
}

NurseRecordSave.contextType = Context;

NurseRecordSave.propTypes = {
  closeModal: PropTypes.func,
  goOtherPage: PropTypes.func,
  registerNurseRecord: PropTypes.func,
  patientInfo: PropTypes.object,
  patientId: PropTypes.number,
};

export default NurseRecordSave;
