import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import {displayLineBreak} from "~/helpers/dialConstants"

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 16px;
  width: 100%;
  max-height: 70vh;
  flex-direction: column;
  display: flex;
  overflow-y: auto;
  text-align: left;
  textarea{
    height: 180px !important;
    pointer-events: none;
  }
  .flex {
    display: flex;
  }
  .sticky-note-color {
    width: 30px;
    height: 25px;
  }
  .type-area {
    padding-bottom: 10px;
    div {
      padding-bottom:5px;
      label {
        font-size: 16px;
        input {
          top:2px;
        }
      }
    }
  }
  .title-area {
    padding-bottom: 10px;
    .label-title {
      width: 0;
      margin-right: 0;
    }
  }
  .input-title {
    font-size: 16px;
    text-align: left;
    margin-bottom: 0;
    padding-right: 5px;
  }
  .enable-area {
    label {
      width: 100%;
      font-size: 16px;
      input {
        top:2px;
      }
    }
    div {
      width: calc(100% - 240px);
    }
    button {
      span {
        font-size: 16px;
      }
    }
  }
`;

class TagDetailModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    let base_modal = document.getElementsByClassName("tag-list-modal")[0];
    if(base_modal !== undefined && base_modal != null){
      base_modal.style['z-index'] = 1040;
    }
    document.getElementById("close_detail").focus();
  }

  render() {
    const { modal_data } = this.props;
    return  (
      <Modal show={true} className="custom-modal-sm tag-add-modal">
        <Modal.Header><Modal.Title>{'付箋詳細'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="enable-area w-100">
              <label>表示状態 : {modal_data.is_enabled === 1 ? '表示' : '非表示'}</label>
            </div>
            <div className="enable-area w-100">
              <label>公開範囲 : {modal_data.public_range === 0 ? '全体' : '本人のみ'}</label>
            </div>
            <div className="type-area w-100 flex">
              <label className="input-title">種類 : {modal_data.name}</label>
              <div className={'sticky-note-color'} style={{backgroundColor:modal_data.color}}></div>
            </div>
            <div className="title-area w-100">
              <label className="input-title">タイトル・概要 : {modal_data.title}</label>
            </div>
            <div className="w-100">
              <label className="input-title">本文</label>
              <div className="w-100 border" style={{overflowY:"auto", height:"180px"}}>{displayLineBreak(modal_data.body)}</div>                            
            </div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className={'cancel-btn'} id={'close_detail'} onClick={this.props.closeModal}>閉じる</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

TagDetailModal.contextType = Context;

TagDetailModal.propTypes = {
  closeModal: PropTypes.func,
  modal_data: PropTypes.object,
};

export default TagDetailModal;