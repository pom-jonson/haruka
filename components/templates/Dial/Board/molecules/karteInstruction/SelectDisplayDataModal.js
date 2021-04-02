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
      margin-top:10px;
  }  
`;

class SelectDisplayDataModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
          confirm_message:"",
          confirm_type:null,
        }
    }

    confirmOk=(type)=>{
      this.props.confirmOk(type);
    }
    
    onHide=()=>{}

    render() {
        return  (
            <Modal show={true} onHide={this.onHide} id="add_contact_dlg"  className="master-modal pattern-delete-modal">
                <Modal.Header>
                    <Modal.Title>変更内容選択</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                        <div style={{fontSize:'1.5rem'}}>この透析日の情報はスケジュールから変更登録されたこの日専用の内容となっています。</div>
                        <div className={'btn-area'}>
                            <Button type="mono" onClick={this.confirmOk.bind(this,'today')}>この日だけを変更する</Button>                            
                        </div>
                        <div className={'btn-area'}>
                            <Button type="mono" onClick={this.confirmOk.bind(this, 'pattern')}>該当の期間の透析パターンを変更する</Button>                            
                        </div>                        
                    </Wrapper>
                </Modal.Body>
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

SelectDisplayDataModal.contextType = Context;

SelectDisplayDataModal.propTypes = {
    closeModal: PropTypes.func,
    confirmOk: PropTypes.func,
    title: PropTypes.string,
};

export default SelectDisplayDataModal;
