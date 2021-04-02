import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";

const Wrapper = styled.div`
  display: block;
  width: 100%;
  height: 100%;
  padding: 20px;
  float: left;
  button {
    border: none!important;
    background: rgb(105, 200, 225); 
    margin-right: 10px;
    span {
        font-size: 24px;
        color: white !important;
    }
  }
  .btn-area {
      p {
        padding-top: 10px;
        padding-left: 15px;
        font-size: 20px;
      }
  }
  .cancel-btn {
    text-align: right;
    padding-top: 20px;
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
`;

const buttonStyle = {
  fontSize: "18px",
  width: "380px",
  padding: "10px",
  margin: "16px"
};

class SelectBranchModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
          confirm_message:"",
          confirm_type:null,
        }
    }

    save = (type) => {
      this.setState({
        confirm_message:"保存しますか？",
        confirm_type:type,
      });
    }

    confirmOk=()=>{
      this.confirmCancel();
      this.props.confirmOk(this.state.confirm_type);
    }

    confirmCancel=()=>{
      this.setState({
        confirm_message:"",
        confirm_type:null,
      });
    }

    onHide=()=>{}

    render() {
        return  (
            <Modal show={true} onHide={this.onHide} id="add_contact_dlg"  className="master-modal pattern-delete-modal first-view-modal">
                <Modal.Header>
                    <Modal.Title>条件保存</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                        <div className={'btn-area'}>
                            <Button style={buttonStyle} className='red-btn' onClick={this.save.bind(this,'doctor')}>自分の利用者セットに保存</Button>
                            <p></p>
                        </div>
                        <div className={'btn-area'}>
                            <Button style={buttonStyle} className='red-btn' onClick={this.save.bind(this, 'department')}>自科セットに保存</Button>
                            <p></p>
                        </div>                        
                    </Wrapper>                    
                </Modal.Body>
                <Modal.Footer>                
                    <Button className={'cancel-btn'} onClick={this.props.closeModal}>キャンセル</Button>                    
                </Modal.Footer>
                {this.state.confirm_message !== "" && (
                    <SystemConfirmJapanModal
                        hideConfirm= {this.confirmCancel.bind(this)}
                        confirmCancel= {this.confirmCancel.bind(this)}
                        confirmOk= {this.confirmOk.bind(this)}
                        confirmTitle= {this.state.confirm_message}
                    />
                )}
            </Modal>
            
        );
    }
}

SelectBranchModal.contextType = Context;

SelectBranchModal.propTypes = {
    closeModal: PropTypes.func,
    confirmOk: PropTypes.func,
    title: PropTypes.string,
};

export default SelectBranchModal;
