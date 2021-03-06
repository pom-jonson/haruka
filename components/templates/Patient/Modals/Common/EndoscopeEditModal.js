import React, { Component } from "react";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import { surface } from "~/components/_nano/colors";
import PropTypes from "prop-types";
import HarukaShemaNav from "./HarukaShemaNav"
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";

const Card = styled.div`
  position: relative;  
  margin: 0px;  
  float: left;
  width: 100%;
  height: 100%;
  background-color: ${surface};
  padding: 0px;
  .footer {
    margin-top: 10px;
    text-align: center;
    margin-left: 0px !important;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225); 
      border: none;
      margin-right: 30px;
    }
    
    span {
      color: white;
      font-size: 20px;
      font-weight: 100;
    }
  }

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
  // text-align: center;

  .content{        
    margin-top: 10px;
    overflow:hidden;
    overflow-y: auto;
    height: 100%;
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
    overflow:hidden;    
    .div-paint{
      float:left;
      width: 500px;
      height: 540px;
      overflow: hidden;
      border: 1px solid #ddd;
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


class EndoscopeEditModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isUpdateConfirmModal:false,
      confirm_message:''
    }
    this.ShemaNav = React.createRef();
  }

  async componentDidMount() {
    document.getElementById("cancel_btn").focus();
  }

  confirmCancel = () => {
    this.setState({
      isUpdateConfirmModal:false,
      confirm_message:''
    })
  }

  Insert = (type) => {
    if(type == "delete"){
      this.props.handlePropInsert(null);
    } else {
      this.setState({
        isUpdateConfirmModal:true,
        confirm_message:'登録しますか？'
      })
    }
  }

  handleInsert = async() => {
    this.confirmCancel();
    let dataURL = this.ShemaNav.current.stageRef.current.toDataURL();
    this.props.handlePropInsert(dataURL);
  }

  render() {
    return  (
      <Modal show={true} id="add_contact_dlg"  className="master-modal exam-schema-calc-modal first-view-modal">
        <Modal.Header>
    <Modal.Title>シェーマ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Card>
            <Wrapper>
                <div className="flex hp-100 content">
                    <div className="right-area">
                        <HarukaShemaNav
                          ref={this.ShemaNav}
                          imgBase64={this.props.imgBase64}
                        />
                    </div>
                </div>
            </Wrapper>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <div
            onClick={this.props.closeModal}
            className={"custom-modal-btn cancel-btn"}
            style={{cursor:"pointer",paddingTop:'2px', paddingBottom:'2px'}}
            id='cancel_btn'
          >
            <span>キャンセル</span>
          </div>
          {this.props.from_mode == "soap_focus" && (
            <div
              onClick={this.Insert.bind(this, 'delete')}
              className={"custom-modal-btn red-btn"}
              style={{cursor:"pointer",paddingTop:'2px', paddingBottom:'2px'}}
            >
              <span>元絵なし</span>
            </div>
          )}
          <div
            onClick={this.Insert.bind(this, 'save')}
            className={"custom-modal-btn red-btn"}
            style={{cursor:"pointer",paddingTop:'2px', paddingBottom:'2px'}}
          >
            <span>登録</span>
          </div>
        </Modal.Footer>
        {this.state.isUpdateConfirmModal && (
          <ConfirmNoFocusModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.handleInsert.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
      </Modal>
    );
  }
}

EndoscopeEditModal.contextType = Context;

EndoscopeEditModal.propTypes = {
    closeModal: PropTypes.func,
    handleOk: PropTypes.func,
    handlePropInsert: PropTypes.func,
    imgBase64: PropTypes.string,
    from_mode: PropTypes.string,
};

export default EndoscopeEditModal;
