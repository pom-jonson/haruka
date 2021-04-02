import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "../../../atoms/Button";
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
  .cancel-button {
    text-align: right;
    padding-top: 20px;
  }
`;

class PatternDeleteConfirmModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
          confirm_message:"",
          confirm_type:null,
        }
    }

    delete = (type) => {
      this.setState({
        confirm_message:"削除しますか？",
        confirm_type:type,
      });
    }

    confirmOk=()=>{
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
                    <Modal.Title>{this.props.title}パターンの削除</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                        <div className={'btn-area'}>
                            <Button type="mono" onClick={this.delete.bind(this,true)}>パターンと予定を削除</Button>
                            <p>このパターンに基づく未実施のスケジュールも削除します。</p>
                        </div>
                        <div className={'btn-area'}>
                            <Button type="mono" onClick={this.delete.bind(this,false)}>パターンを削除</Button>
                            <p>パターンだけを削除します。スケジュールは削除しません。</p>
                        </div>
                        <div className={'cancel-button'}>
                            <Button type="mono" onClick={this.props.closeModal}>キャンセル</Button>
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

PatternDeleteConfirmModal.contextType = Context;

PatternDeleteConfirmModal.propTypes = {
    closeModal: PropTypes.func,
    confirmOk: PropTypes.func,
    title: PropTypes.string,
};

export default PatternDeleteConfirmModal;
