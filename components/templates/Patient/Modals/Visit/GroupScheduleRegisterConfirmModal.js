import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import { formatJapanDateSlash } from "~/helpers/date";
import Button from "~/components/atoms/Button";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";

const Wrapper = styled.div`
  .button-op{
    padding: 16px;
    .text-under{
      text-decoration: underline;
    }
    span{
      font-size: 14px !important;
    }
  }
  .first-div{
    overflow: hidden;
    button{
      float:left;
    }
    border-bottom: 1px solid #aaa;
  }
  .second-div{
    overflow: hidden;
    border-bottom: 1px solid #ddd;
    button{
      float:left;
    }
    border-bottom: 1px solid #aaa;
  }

  .third-div{
    overflow: hidden;
    border-bottom: 1px solid #ddd;
    button{
      float:left;
      border: 1px solid black;
      background: #efefef;
      span{
        color: black;
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
    } 
  }
  
  .flex {
    display:flex;
  }
  .register-info {
    border-bottom: 1px solid #aaa;
    padding-bottom: 20px;
    padding-left: 15px;
    .label-title {
        width: 4rem;
    }
    .label-name {
      width:calc(100% - 4rem);
      word-break: break-all;
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
  .cancel-btn {
    background: #ffffff;
    border: solid 2px #7e7e7e;
    span {
      color: #7e7e7e;
    }
  }
  .cancel-btn:hover {
    border: solid 2px #000000;
    background: #ffffff;
    span {
      color: #000000;
    }
  }
 `;


const ButtonBox = styled.div`
  text-align: left;

  span {
    font-size: 18px;
  }
`;

const buttonStyle = {
  fontSize: "18px",
  width: "310px",
  padding: "10px",
  margin: "16px",
};


class GroupScheduleRegisterConfirmModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        confirm_message:"",
    }
  }

  registerConfirm=(register_type)=>{
      var base_modal = document.getElementsByClassName("endExamination_dlg")[0];
      if(base_modal !== undefined && base_modal != null){
          base_modal.style['z-index'] = 1040;
      }
      let confirm_message = "";
      if(this.props.collected_date === undefined){
          if(register_type === 'first'){
              confirm_message = "グループに予定を追加しますか？";
          }
          if(register_type === 'second'){
              confirm_message = "グループの予定を登録しなおしますか？";
          }
          if(register_type === 'third'){
              confirm_message = "既にある予定を削除して登録しますか？";
          }
      } else {
          confirm_message = "予定を登録しますか？";
      }
      this.setState({
          register_type,
          confirm_message,
      })
  }

  registerSchedule=()=>{
      this.confirmCancel();
      this.props.handleOk(this.state.register_type);
  }

  confirmCancel=()=>{
      var base_modal = document.getElementsByClassName("endExamination_dlg")[0];
      if(base_modal !== undefined && base_modal != null){
          base_modal.style['z-index'] = 1050;
      }
      this.setState({confirm_message:""});
  }

  render() {
    return  (
      <Modal
        show={true}
        className="endExamination_dlg"
        centered
        size="lg"
      >
        <Modal.Body>
        <Wrapper>
            <div className={'register-info'}>
              <div className={'flex'}>
                <div className={'label-title'}>訪問先</div>
                <div className={'label-name'}> : {this.props.visit_place_name+' '+ ' （'+this.props.visit_group_name+'）'}</div>
              </div>
              <div className={'flex'} style={{paddingTop:"5px"}}>
                <div className={'label-title'}>期間</div>
                <div> : {this.props.collected_date === undefined ? (formatJapanDateSlash(this.props.time_limit_from)+'～'+formatJapanDateSlash(this.props.time_limit_to)) : formatJapanDateSlash(this.props.collected_date)}</div>
              </div>
            </div>
            <ButtonBox>
                {this.props.collected_date === undefined ? (
                    <>
                        <div className="first-div">
                            <Button style={buttonStyle} className={'red-btn'} onClick={this.registerConfirm.bind(this,'first')}>グループの予定を追加</Button>
                            <div className="button-op">
                                <div><span>このグループの患者に予定を追加します。</span></div>
                                <div><span className="text-under">同じ日付の予定は上書きします</span></div>
                            </div>
                        </div>
                        <div className="second-div">
                            <Button style={buttonStyle} className={'red-btn'} onClick={this.registerConfirm.bind(this,'second')}>グループの予定を登録しなおす</Button>
                            <div className="button-op">
                                <div><span>このグループの訪問診療予定を削除し</span></div>
                                <div><span>新しい予定を登録します。</span></div>
                                <div><span className="text-under">患者ごとに個別に追加・変更された予定は削除しません</span></div>
                            </div>
                        </div>
                        <div className="second-div">
                            <Button style={buttonStyle} className={'red-btn'} onClick={this.registerConfirm.bind(this,'third')}>全ての予定を削除して登録</Button>
                            <div className="button-op">
                                <div><span>このグループの患者の訪問診療予定を全て削除し</span></div>
                                <div><span>新しい予定を登録します。</span></div>
                                <div><span className="text-under">患者ごとに個別で追加・変更された予定も削除します</span></div>
                            </div>
                        </div>
                    </>
                ):(
                    <>
                        <div className="first-div">
                            <Button style={buttonStyle} className={'red-btn'} onClick={this.registerConfirm.bind(this,'first')}>登録（重複を上書き）</Button>
                            <div className="button-op">
                                <div><span>予定を登録します。</span></div>
                                <div><span>同日に既に存在する患者様の予定は、</span></div>
                                <div><span>削除して新しい内容を登録します。</span></div>
                                <div style={{paddingLeft:"325px"}}><span className="text-under">※診察開始済みの予定は変更しません</span></div>
                            </div>
                        </div>
                        <div className="second-div">
                            <Button style={buttonStyle} className={'red-btn'} onClick={this.registerConfirm.bind(this,'second')}>登録（重複をスキップ）</Button>
                            <div className="button-op">
                                <div><span>予定を登録します。</span></div>
                                <div><span>同日に既に存在する患者様の予定は変更しません</span></div>
                            </div>
                        </div>
                    </>
                )}
              <div className="forth-div">
                  <Button style={buttonStyle} className={'cancel-btn'} onClick={this.props.closeModal}>キャンセル</Button>
              </div>
            </ButtonBox>
        </Wrapper>
        </Modal.Body>
          {this.state.confirm_message !== "" && (
              <SystemConfirmModal
                  hideConfirm= {this.confirmCancel.bind(this)}
                  confirmCancel= {this.confirmCancel.bind(this)}
                  confirmOk= {this.registerSchedule.bind(this)}
                  confirmTitle= {this.state.confirm_message}
              />
          )}
      </Modal>

      );
      }
}
GroupScheduleRegisterConfirmModal.contextType = Context;

GroupScheduleRegisterConfirmModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  visit_place_name: PropTypes.string,
  visit_group_name: PropTypes.string,
  time_limit_from: PropTypes.string,
  time_limit_to: PropTypes.string,
  collected_date: PropTypes.string,
};

export default GroupScheduleRegisterConfirmModal;
