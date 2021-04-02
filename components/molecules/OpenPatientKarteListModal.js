import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import Button from "../atoms/Button";
import PropTypes from "prop-types";
import styled from "styled-components";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import { KEY_CODES } from "~/helpers/constants";
// import Spinner from "react-bootstrap/Spinner";
// import SystemAlertModal from "../molecules/SystemAlertModal";
// import DiagnosisRpModal from "../organisms/DiagnosisRpModal";
// import { CACHE_LOCALNAMES, CACHE_SESSIONNAMES } from "~/helpers/constants";
// import * as cacheApi from  "~/helpers/cacheLocal-utils";
// import * as sessApi from "~/helpers/cacheSession-utils";
// import * as karteApi from "~/helpers/cacheKarte-utils";
// import * as apiClient from "~/api/apiClient";
// import Context from "~/helpers/configureStore";
// import endKarteMode from "~/components/templates/Patient/PrescriptionMethods/endKarteMode";
// import SelectDoctorModal from "~/components/templates/Patient/components/SelectDoctorModal";
// import { formatJapanDateSlash, formatTimeIE } from "~/helpers/date";
// import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
// import Radiobox from "~/components/molecules/Radiobox";
// import InputWithLabel from "~/components/molecules/InputWithLabel";


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

    .accept-info{
      width: 100%;
      text-align: right;
      padding-right: 30px;
      font-size: 18px;
      color: red;
      span{
        color: black;
      }
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
      border: 1px solid #ddd;
      background: rgb(241,86,124); 
      span{
        color: white;
      }
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
      border: 1px solid #ddd;
      background: #efefef;
      span{
        color: black;
      }
    } 
  }

  .button-op{
    padding: 30px;
    border-top: 1px solid #ddd;
    .text-under{
      text-decoration: underline;      
    }

    span{
      font-size: 14px !important;
    }
  }
  
  .flex {
    display:flex;
  }
  
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
`;

const buttonStyle1 = {
  fontSize: "18px",
  width: "380px",
  padding: "10px",
  margin: "16px" 
};

const buttonStyle2 = {
  fontSize: "18px",
  width: "380px",
  padding: "10px",
  margin: "16px"
};


class OpenPatientKarteListModal extends Component {
  constructor(props) {
    super(props);
    this.state = {    
      confirm_message: "",
      curFocus: 1,
    }
    this._btn = [];
    this._flag = 1; 
  }

  
  async componentDidMount(){ 
    if (
      document.getElementById("patient_confirm_Cancel") !== undefined &&
      document.getElementById("patient_confirm_Cancel") !== null
    ) {
      document.getElementById("patient_confirm_Cancel").focus();
    }
    this._btn = ["btnOK","btnCancel"];
    this.setState({
      curFocus: 1
    });
    this._flag = 1;   
  }

  goKartePage = (system_patient_id) => {
    if (system_patient_id <= 0) return;
    this.props.goKartePage(parseInt(system_patient_id));
  }

  cancelAllLogOut = () => {
    this.setState({
      confirm_message: "ログアウトしますか？",
      confirm_alert_title: "ログアウト確認"
    });    
  }

  confirmCancel = () => {
    this.setState({
      confirm_message: "",
      confirm_alert_title: ""
    });
  }

  confirmOk = () => {    
    this.setState({
      confirm_message: "",
      confirm_alert_title: ""
    }); 
    this.props.cancelAllLogOut();
  }

  _onKeyPressed(e) {
    if (this.state.confirm_message != "") return;
    if (e.keyCode === KEY_CODES.left || e.keyCode === KEY_CODES.right) {      
      let fnum = (this._flag + 1) % this._btn.length; 

      this.setState({curFocus : fnum});
      this._flag = fnum;   
    }
    if (e.keyCode === KEY_CODES.enter) {
      e.stopPropagation();
      e.preventDefault();
      if (this._flag === 0) {
        this.cancelAllLogOut();
      }else{
        this.props.closeModal();
      }      
    }
  }

  render() {      
    const { openKarteArray } = this.props;

    return  (
      <Modal
        show={true}        
        className="openPatientKarte_dlg first-view-modal"
        centered
        size="lg"
        onKeyDown={this._onKeyPressed.bind(this)}
      >
        <Modal.Header>
          <Modal.Title>開いているカルテがあります</Modal.Title>    
          <div className="div-karte-array">
            <table className="table-scroll table table-bordered" id="wordList-table">
              <thead>
              <tr>
                  <th style={{width:'130px'}}>患者番号</th>
                  <th>氏名</th>                  
              </tr>
              </thead>
              <tbody>

              {openKarteArray !== undefined && openKarteArray !== null && openKarteArray.length > 0 && (
                openKarteArray.map(item => {
                  return(
                    <>
                      <tr>                                
                        <td style={{width:'130px'}}><div className="patient-name">{item.receId}</div></td>
                        <td>
                          <div className="patient-name">{item.name}</div>
                          <Button onClick={()=>this.goKartePage(item.system_patient_id)}>カルテに移動</Button>
                        </td>
                      </tr>
                    </>
                  )
                })
              )}
              </tbody>
          </table>
          </div>
        </Modal.Header>
        <Modal.Body>
        <Wrapper>                           
          <ButtonBox>              
            <div className="third-div">
              <Button
                id="patient_confirm_Ok"
                onClick={this.cancelAllLogOut}
                style={buttonStyle1}
                className={this.state.curFocus === 0?"focus": ""}
              >すべて破棄してログアウト</Button>
              <div className="button-op">
                <div><span className="text-under">入力内容を破棄</span><span>してログアウトします</span></div>                  
              </div>
            </div>
            <div className="forth-div">
              <Button id="patient_confirm_Cancel" className={this.state.curFocus === 1?"focus": ""} onClick={this.props.closeModal} style={buttonStyle2}>
                キャンセル
              </Button>
            </div>
          </ButtonBox>              
        </Wrapper>  
        {this.state.confirm_message !== "" && (
          <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.confirmOk.bind(this)}
              confirmTitle= {this.state.confirm_message}
              title = {this.state.confirm_alert_title}
          />
        )}      
        </Modal.Body>
      </Modal>
    );
  }
}

// OpenPatientKarteListModal.contextType = Context;

OpenPatientKarteListModal.propTypes = {  
  closeModal: PropTypes.func,  
  goKartePage: PropTypes.func,  
  cancelAllLogOut: PropTypes.func,  
  openKarteArray: PropTypes.array,
};

export default OpenPatientKarteListModal;
