import React, { Component } from "react";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import Button from "~/components/atoms/Button";
import { surface } from "~/components/_nano/colors";
import PropTypes from "prop-types";
import DialFootcareNav from "../DialFootcareNav";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as sessApi from "~/helpers/cacheSession-utils";

const Card = styled.div`
  position: relative;  
  margin: 0px;  
  float: left;
  width: 100%;
  height: 100%;
  background-color: ${surface};
  padding: 0px;
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }

  .clickable{
    cursor:pointer;
  }
`;

const Wrapper = styled.div`
  width: 100%;  
  height: 100%;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 18px;

  .content{        
    margin-top: 10px;
    overflow:hidden;
    overflow-y: auto;
    height: calc(100% - 10px);   
  }
  .flex {
    display: flex;    
    flex-wrap: wrap;
  }
  .example-custom-input{
      font-size: 18px;
      width:180px;
      text-align:center;
      padding-left: 15px;
      padding-right: 15px;
      padding-top: 5px;
      padding-bottom: 5px;
      border: 1px solid;
      margin-left:5px;
      margin-right:5px;
  }

  .div-style1{
    display: block;
    overflow: hidden;
    .label-type1{
      float: left;
    }
    .label-type2{
      float: right;
    }
  }

  .left-area {
    width: 40%;
    height: 100%;
    padding: 10px;
    border-right: 1px solid;
    .block{
      margin-bottom: 10px;
      input, textarea{
        width:90%;
      }
      textarea{
        height:130px;
      }

    }
    .react-datepicker-wrapper{
      margin-top:-8px;
      input{
        height: 33px;
      }
    }
    .sub-title{
      margin-bottom: 5px;
      font-size: 17px;
    }
    .radio-btn{
      margin-right: 10px;
      label{
        font-size: 18px;
        margin-left: 5px;
        padding: 3px;
        margin-right: 5px;
        border: 1px solid lightgray;
        margin-bottom: 0px;
        border-radius: 0px;
      }
      
    }
    .label-title{
      display:none;
    }
    .history-list{
      margin-top: 20px;
      // height: 30%;
      overflow: hidden;
      height: 50%;      
    }
  }

  .right-area {
    width: 100%;    
    padding-left: 20px;
    height: 100%;
    overflow-y: auto;
    .div-paint{
      float:left;
      width: 60%;
      height: 550px;
      overflow: hidden;
      // border: 1px solid #ddd;
    }
    .sc-bdVaJa{
      border: 1px solid #ddd;
      padding-top: 5px;
      height: 100%;
    }

    .sc-htpNat {
      margin-top: -10px;
      background: none;
      font-size: 18px;
      border-bottom: 1px solid #ddd;
      .tab {
          border-bottom: solid 1px #ddd;
      }
      
    }    

  
  .text-left {
    text-align: left;
  }
  .text-right {
    text-align: right;
  }
  .label-box {
    font-size: 18px;
    border: 1px solid #a0a0a0;
  }
  .prev-session {    
    width: 65%;
    padding-left: 5%;
  }
  .pt-20 {
    padding-top: 20px;
  }
  .pt-10 {
    padding-top: 10px;
  }
  .pt-12 {
    padding-top: 12px;
  }
  .padding-top-5 {
    padding-top: 5px;
  }
  .wp-30 {
    width: 30%;
  }
  .wp-35 {
    width: 35%;
  }
  .wp-40 {
    width: 40%;
  }
  .wp-45 {
    width: 45%;
    cursor: pointer;
  }
  .wp-55 {
    width: 55%;
  }
  .wp-60 {
    width: 60%;
  }
  .wp-70 {
    width: 70%;
  }
  .hp-100 {
    height : 100%;
  }
  .footer {
    margin-top: 10px!important;
    button span {
        font-size: 20px;
    }
  }

  .table-view{
    border: 1px solid #ddd;
    overflow: hidden;
    height: 90%;
  }

  .div-double-content{
    width: 50%;
    display: block;
    overflow: hidden;
    float: left;
    margin-top: 10px;
  }
  .list-content{
    border: 1px solid #ddd;
    height: 200px;
    width: 100%;
  }

  .div-regist-content{
    height: 50%;
    .div-double-content{
      height: 95%;
    }
    .list-content{
      height: 90%;
    }
  }

  .arm-img{
    margin-top: 20px;
  }

  .history-item{
    padding: 5px;
  }

  .history-header{
    overflow: hidden;
    display: block;
    margin-bottom: 20px;
  }

  .header-item{
    width: 30%;
    float: left;
    margin-right: 30px;
    label {
        text-align: left;
        width: 60px;
        font-size: 18px;
        margin-top: 7px;
        margin-bottom: 0;
    }
    input {
        width: 64%;
        height: 35px;
        border-radius: 4px;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(206, 212, 218);
        border-image: initial;
        padding: 0px 8px;
    }        
  }
 `;


class FootcareFootsEditModal extends Component {
  constructor(props) {
    super(props);

    this.state = {      
      isCloseConfirmModal: false,
      confirm_message:'',
      confirm_alert_title:'',
      isUpdateConfirmModal:false,
    }

    this.FootNav = React.createRef();
  }

  confirmSave = () => {
    this.confirmCancel();
    let dataURL_left = this.FootNav.current.stageLeftRef.current.toDataURL();      
    let dataURL_right = this.FootNav.current.stageRightRef.current.toDataURL();
    this.props.handlePropInsert(dataURL_left, dataURL_right);
  }

  handleInsert = async() => {
    this.setState({
      isUpdateConfirmModal:true,
      confirm_message:'フットケア画像を登録しますか？'
    })
  }
  
  componentWillUnmount() {
    sessApi.delObjectValue('dial_change_flag', 'foot_care_modal');
  }

  onHide=()=>{}

  handleCloseModal = () => {
    let nFlag = sessApi.getObjectValue('dial_change_flag', 'foot_care_modal');
    if (nFlag == 1) {// if data changed
      this.setState({          
        isCloseConfirmModal:true,
        confirm_message:'登録していない内容があります。\n変更内容を破棄して閉じますか？', 
        confirm_alert_title:'入力中'
      });
      return;
    } 
    this.props.closeModal();
  }

  confirmCancel() {
    this.setState({
      isUpdateConfirmModal:false,
      isCloseConfirmModal: false,
      confirm_message: "",
      confirm_alert_title:'',
    });
  }

  confirmCloseModal = () => {
    this.setState({
      isCloseConfirmModal: false,
      confirm_message: "",
    }, ()=>{
      sessApi.delObjectValue('dial_change_flag', 'foot_care_modal');
      this.props.closeModal();
    });
  }

  render() {     
    return  (
      <Modal show={true} onHide={this.onHide} id="add_contact_dlg"  className="master-modal exam-va-calc-modal first-view-modal">
        <Modal.Header>
    <Modal.Title>フットケア画像編集</Modal.Title>
        </Modal.Header>
        <Modal.Body>                     
            <Card>
            <Wrapper>
                <div className="flex hp-100 content">                    
                    <div className="right-area">                         
                        <DialFootcareNav 
                          ref={this.FootNav}
                          imgLeftBase64={this.props.imgLeftBase64}                   
                          imgRightBase64={this.props.imgRightBase64}                   
                          imgBackroundVersion={this.props.imgBackroundVersion}                   
                          imgLeftBackgroundBase64={this.props.imgLeftBackgroundBase64}                   
                          imgRightBackgroundBase64={this.props.imgRightBackgroundBase64}                   
                        />
                    </div>  
                </div>                
            </Wrapper>                    
          </Card>
        </Modal.Body>    
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.handleCloseModal}>キャンセル</Button>
          <Button className="red-btn" onClick={this.handleInsert}>{'登録'}</Button>
        </Modal.Footer>  
        {this.state.isCloseConfirmModal !== false &&  (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.confirmCloseModal}
            confirmTitle= {this.state.confirm_message}
            title = {this.state.confirm_alert_title}
          />
        )}
        {this.state.isUpdateConfirmModal &&  (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.confirmSave}
            confirmTitle= {this.state.confirm_message}            
          />
        )}  
      </Modal>
    );
  }
}

FootcareFootsEditModal.contextType = Context;

FootcareFootsEditModal.propTypes = {
    closeModal: PropTypes.func,
    handleOk: PropTypes.func,
    handlePropInsert: PropTypes.func,
    imgLeftBase64: PropTypes.string,
    imgRightBase64: PropTypes.string,
    imgBackroundVersion: PropTypes.number,
    imgLeftBackgroundBase64: PropTypes.string,
    imgRightBackgroundBase64: PropTypes.string,
};

export default FootcareFootsEditModal;
