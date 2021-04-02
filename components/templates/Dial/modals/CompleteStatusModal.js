import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Spinner from "react-bootstrap/Spinner";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";

const Wrapper = styled.div`
  display: block;
  font-size: 24px;
  width: 100%;
  height: 100%;
  float: left;
  .message {
    text-align: center;
    font-size: 40px;
    font-weight: bold;
    padding-top: 5vh;
    padding-bottom: 15px;
  }
  .stop-button{
    margin-top:20px;
    margin-bottom:25px;
    font-size:16px;      
  }
`;

const SpinnerWrapper = styled.div`
    margin: auto;
`;


class CompleteStatusModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
          confirm_message:'',
          confirm_alert_title:'',
        }
    }
    
    close = () => {
      this.setState({
        confirm_message:'復元を中止して破棄しますか？',
        confirm_alert_title:'破棄確認'
      })
    }

    confirmCancel = () => {
      this.setState({
        confirm_message:'',
        confirm_alert_title:''
      })
    }

    stopOk = () => {
      this.props.stopLoading();
    }

    render() {        
        return  (
            <Modal show={true} id="add_contact_dlg"  className="master-modal confirm-complete-modal">
              <Wrapper>
                <div className={'message'}>{this.props.message}</div>
                <div className='text-center'>
                  <SpinnerWrapper>
                    <Spinner animation="border" variant="secondary" />
                  </SpinnerWrapper>
                </div>
                {this.props.stop_button == true && (
                  <div className="text-center">
                    <button className='cancel-btn stop-button' onClick={this.close.bind(this)}>復元中止</button>
                  </div>
                )}
              </Wrapper>
              {this.state.confirm_message != '' && (
                <SystemConfirmJapanModal
                  hideConfirm={this.confirmCancel.bind(this)}
                  confirmCancel={this.confirmCancel.bind(this)}
                  confirmOk={this.stopOk.bind(this)}
                  confirmTitle={this.state.confirm_message}
                  title = {this.state.confirm_alert_title}
                />
              )}
            </Modal>
        );
    }
}

CompleteStatusModal.contextType = Context;

CompleteStatusModal.propTypes = {
    message: PropTypes.string,
    stop_button:PropTypes.bool,
    stopLoading:PropTypes.func,
};

export default CompleteStatusModal;
