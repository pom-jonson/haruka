import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
// import axios from "axios";

const Wrapper = styled.div`  
 width: 100%;
 height: 100%;
 font-size: 1rem;
 overflow-y:auto;
 .flex{
  display: flex;
 }
 .width-100{
    width: 100px;
 }
 .width-50{
    width: 50px;
 }
 .form-row{
   margin-right: 0px !important;
   margin-left: 0px !important;
 }
 .form-control{
   border: none;
 }
 .file-input-area{
   height: 2rem;
 }
 .disable-btn{
  pointer-events: none;
 }
 .form-content{

   display: flex;
   padding: 1rem;
   width: 100%;
   label{
    width: 8rem;
    height: calc(1.5em + .75rem + 2px);
    line-height: calc(1.5em + .75rem + 2px);
   }
   input{
    width: 20rem;
   }
   button{
    padding: 0px !important;
   }
 }
 .footer-buttons{
   button{
    line-height: 2rem;
   }
 }
 .m-b-10{
    margin-bottom: 10px;
 }
 .div-top{
    margin-top: 10px;
 }
 .div-bottom select{
    width: 178px;
 }
 
  .react-datepicker-wrapper {
    width: calc(100% - 110px);
    .react-datepicker__input-container {
      width: 100%;
      input {
        font-size: 1rem;
        width: 100%;
        height: 2rem;
        border-radius: 4px;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(206, 212, 218);
        border-image: initial;
        padding: 0px 8px;
      }
    } 
  }
  .label-title {
      font-size: 1rem;
      width: 7rem;
      text-align: right;
      margin: 0;
      line-height: 2rem;
      margin-right: 0.5rem;
  }
  .select-time-zone {
    margin-bottom:0.5rem;
      label {
          line-height: 2rem;
          font-size: 1rem;
          margin: 0;
          margin-right: 0.5rem;
      }
  }
  .pullbox-label {
    .pullbox-select {
      width: 100%;
      height: 2rem;
      font-size:1rem;
    }
  }
  .select-state {
    margin-bottom:0.5rem;
      .pullbox-label {
        width: 15rem;
      }
  }
  .select-visit-place, .select-visit-group {
    margin-bottom:0.5rem;
    .pullbox-label {
      width: calc(100% - 7.5rem);
    }
  }
  .set-scheduled-doctor {
    margin-bottom: 0.5rem;
    .scheduled-doctor-name {
      border:1px solid rgb(206, 212, 218);
      cursor:pointer;
      line-height: 2rem;
      width: 21rem;
      padding-left: 5px;
    }
  }
  .set-scheduled-departure-time {
    .react-datepicker-wrapper {
      width: 7rem;
    }
  }
  .clear-btn {
      height: 2rem;
      line-height: 2rem;
      text-align: center;
      margin-left: 0.5rem;
      min-width: 2rem;
      background-color: buttonface;
      border: 1px solid #7e7e7e;
      padding: 0;
      span{
        color:black;  
        font-size: 1rem;   
      }
  }
  .patient-info {
    button {
      width: 10rem;
      padding: 0;
      height: 2rem;
      margin-left: 0.5rem;
      span {font-size:1rem;}
    } 
  }
  .select-schedule-date {
    margin-bottom:0.5rem;
    .react-datepicker-wrapper {
      width: 8rem;
    }
  }
`;

class UploadScannerModal extends Component {
  constructor(props) {
    super(props);
    
    this.state = {      
      selectedFile: [],
      alert_messages: ""
    };    
  }

  

  closeModal = () => {
    this.props.closeModal();
  }  

  handleInputChange = (event) => {
      this.setState({
        selectedFile: event.target.files,
      })
  }

  submit = () => {      
    if (this.state.selectedFile.length < 1) return;
    
    this.props.uploadFiles(this.state.selectedFile);                  
  }  

  cancelModal = () => {
    this.setState({
      alert_messages: ""
    });
  }

  render() {
    return (
      <>
        <Modal show={true} className="custom-modal-sm visit-patient-modal first-view-modal">
          <Modal.Header>
            <Modal.Title>スキャナ一アップロード</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div>                
                <div className="form-row">
                    <div className="form-content">
                        <label>ファイル選択:</label>                        
                        <input type="file" accept="image/x-png,image/gif,image/jpeg,.pdf" className="file-input-area" placeholder="" name="upload_file" onChange={this.handleInputChange} multiple/>
                        <div className="footer-buttons">
                            <button type="submit" className={this.state.selectedFile.length > 0 ? "cancel-btn" : "disable-btn cancel-btn"} onClick={()=>this.submit()} style={{height:"2rem"}}>アップロード</button>
                        </div>
                    </div>
                </div>                
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className={'cancel-btn'} onClick={this.closeModal}>キャンセル</Button>            
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <AlertNoFocusModal
              hideModal= {this.cancelModal.bind(this)}
              handleOk= {this.cancelModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
        </Modal>
      </>
    );
  }
}

UploadScannerModal.contextType = Context;
UploadScannerModal.propTypes = {
  closeModal: PropTypes.func,    
  uploadFiles: PropTypes.func,  
};

export default UploadScannerModal;
