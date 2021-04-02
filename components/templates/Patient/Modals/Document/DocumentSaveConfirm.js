import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import Checkbox from "~/components/molecules/Checkbox";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import InputWithLabel from "~/components/molecules/InputWithLabel";

const Wrapper = styled.div`
  overflow-y: auto;
  height: 100%;
  font-size:1rem;
  .flex {
    display: flex;
  }
  .check-area {
    text-align: right;
    label {font-size:1rem;}
  }
  .first-div{
    overflow: hidden;
    button{
      float:left;
      span{
        font-size: 1.25rem;
      }
    }
    border-bottom: 1px solid #aaa;
  }
  .second-div{
    overflow: hidden;
    border-bottom: 1px solid #ddd;
    button{
      float:left;
      span{
        font-size: 1.25rem;
      }
    }
    border-bottom: 1px solid #aaa;
  }
  .button-op{
    padding: 16px;
    span{
      font-size: 14px !important;
    }
  }
  .red-btn {
    background-color: #cc0000;
    span {
      color: #ffffff;
    }
  }
  .red-btn:hover {
    background: #e81123;
    span {
      color: #ffffff;
    }
  }
  .select-value {
    .pullbox-title {
      width: 5rem;
      font-size: 1rem;
      line-height: 2rem;
    }
    .pullbox-label {
      margin-bottom: 0;
      .pullbox-select {
        width: 4rem;
        height: 2rem;
      }
    }
  }
  .free-comment {
    margin-top:0.5rem;
    div {margin:0;}
    .label-title{
      width:0;
      margin:0;
    }
    input {height:2.3rem;}
  }
`;

const buttonStyle = {
  width: "19rem",
  padding: "0.5rem",
  margin: "1rem",
};

class DocumentSaveConfirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert_messages:"",
      confirm_message:"",
      receipt_flag:0,
      free_comment:"",
      default_number_of_copies:1,
    }
    this.number_of_copies_list = [{id:1, value:"1"}];
  }

  async componentDidMount() {
  }

  setCheckValue = (name, value) => {
    this.setState({[name]: value });
  };

  closeModal=()=>{
    this.setState({
      alert_messages:"",
      confirm_message:"",
    })
  }

  registerConfirm=()=>{

  }

  setNumberOfCopies=(e)=>{
    this.setState({default_number_of_copies:parseInt(e.target.id)});
  }

  setComment=(e)=>{
    if (e.target.value.length > 25) {
      this.setState({alert_messages:"フリーコメントは全角25文字以上入力できません。"});
      return;
    }
    this.setState({free_comment: e.target.value});
  }

  render() {
    return (
      <>
        <Modal show={true} className="custom-modal-sm patient-exam-modal document-save-confirm-modal first-view-modal">
          <Modal.Header><Modal.Title>文書保存確認</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div style={{color:"red", marginLeft:"3rem"}}>保存しますよろしいですか？</div>
              <div className={'check-area'}>
                <Checkbox
                  label="同意受取済"
                  getRadio={this.setCheckValue.bind(this)}
                  value={this.state.receipt_flag === 1}
                  name="receipt_flag"
                />
              </div>
              <div style={{marginLeft:"1rem"}}>【保存終了】</div>
              <div className="first-div">
                <Button style={buttonStyle} className={'red-btn'} onClick={this.registerConfirm.bind(this,'first')}>印刷して終了</Button>
                <div className="button-op">
                  <div><span>印刷後、保存して終了します。</span></div>
                  <div className='select-value'>
                    <SelectorWithLabel
                      title="印刷部数"
                      options={this.number_of_copies_list}
                      getSelect={this.setNumberOfCopies}
                      departmentEditCode={this.state.default_number_of_copies}
                    />
                  </div>
                </div>
              </div>
              <div className="second-div">
                <Button style={buttonStyle} className={'red-btn'} onClick={this.registerConfirm.bind(this,'second')}>保存して終了</Button>
                <div className="button-op">
                  <div><span>保存して終了します。</span></div>
                  <div><span>印刷は行われません。</span></div>
                </div>
              </div>
              <div>
                <div>その他(全角25文字まで)</div>
                <div className="free-comment">
                  <InputWithLabel
                    label=""
                    type="text"
                    getInputText={this.setComment}
                    diseaseEditData={this.state.free_comment}
                  />
                </div>
                <div>※文書科請求のため発行部数をフリーコメントに記入願います。</div>
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className={'cancel-btn'} onClick={this.props.closeModal}>キャンセル（文書作成に戻る）</Button>
            <Button className={'red-btn'}>保存せずに終了</Button>
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
          {this.state.confirm_message !== "" && (
            <SystemConfirmModal
              hideConfirm= {this.closeModal.bind(this)}
              confirmCancel= {this.closeModal.bind(this)}
              confirmOk= {this.confirmOk.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
        </Modal>
      </>
    );
  }
}

DocumentSaveConfirm.contextType = Context;
DocumentSaveConfirm.propTypes = {
    closeModal: PropTypes.func,
};

export default DocumentSaveConfirm;
