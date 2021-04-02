import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "../../../atoms/Button";

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
`;

class PatternUpdateConfirmModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    delete = (type) => {
        this.props.confirmOk(type)
    }

    onHide=()=>{}

    render() {
        return  (
            <Modal show={true} onHide={this.onHide} id="add_contact_dlg"  className="master-modal pattern-delete-modal">
                <Modal.Header>
                    <Modal.Title>{this.props.title}パターンの編集</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                        <div className={'btn-area'}>
                            <Button type="mono" onClick={this.delete.bind(this,true)}>パターンを変更し、範囲から外れる予定は削除</Button>
                            <p>このパターンに基づく、未実施のスケジュールを削除します。</p>
                        </div>
                        <div className={'btn-area'}>
                            <Button type="mono" onClick={this.delete.bind(this,false)}>パターンを変更</Button>
                            <p>パターンだけを変更します。期間から外れるスケジュールは削除せず残します。</p>
                        </div>
                        <div className={'cancel-btn'}>
                            <Button type="mono" onClick={this.props.closeModal}>キャンセル</Button>
                        </div>
                    </Wrapper>
                </Modal.Body>
            </Modal>
        );
    }
}

PatternUpdateConfirmModal.contextType = Context;

PatternUpdateConfirmModal.propTypes = {
    closeModal: PropTypes.func,
    confirmOk: PropTypes.func,
    title: PropTypes.string,
};

export default PatternUpdateConfirmModal;
