import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import Checkbox from "~/components/molecules/Checkbox";
import styled from "styled-components";
import Button from "~/components/atoms/Button";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  width: 100%;
  height: 100%;
  flex-direction: column;
  display: flex;
  overflow-y: auto;
  text-align: center;
  .comment-area {
    border: solid 1px rgb(206, 212, 218);
    width: 100%;
    textarea {
      width: 100%;
      height: 150px;
    }
  }
  .radio-btn label {
    font-size: 16px;
  }
  .title {
    width: 8rem;
    float: left;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    border-right: 1px solid #aaa;
    padding-right: 1rem;
    text-align: right;
  }
  .content {
    width: 80%;
    text-align: left;
    word-break: break-all;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 1rem;
  }
  .checkbox_content {
    display: flex;
    border-bottom: 1px solid #aaa;
  }
  .maincontent {
    width: 100%;
    font-size: 1rem;
    border: 1px solid #aaa;
    label{
      margin-bottom: 0px;
    }
  }
`;

class SchedulePreviewModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Modal show={true} className="master-modal width-50vw-modal">
        <Modal.Header>
          <Modal.Title>プレビュー</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="maincontent">
              <div className="checkbox_content">
                <label className="title">完了</label>
                <div className="content">
                  <Checkbox
                    value={this.props.checked_by_complete}
                    checked={this.props.checked_by_complete === 1}
                    name="check"
                    isDisabled={true}
                  />
                </div>
              </div>
              <div className="checkbox_content">
                <label className="title">添書</label>
                <div className="content">
                  <Checkbox
                    value={this.props.checked_by_accompanying}
                    checked={this.props.checked_by_accompanying === 1}
                    name="check"
                    isDisabled={true}
                  />
                </div>
              </div>
              <div className="checkbox_content">
                <label className="title">受診</label>
                <div className="content">
                  <Checkbox
                    value={this.props.checked_by_medical_examination}
                    checked={this.props.checked_by_medical_examination === 1}
                    name="check"
                    isDisabled={true}
                  />
                </div>
              </div>
              <div style={{display:"flex",borderBottom:"1px solid #aaa"}}>
                <label className="title">日付</label>
                <label className="content">{this.props.scheduledate}</label>
              </div>
              <div style={{display:"flex",borderBottom:"1px solid #aaa"}}>
                <label className="title">時間帯</label>
                <label className="content">{this.props.scheduletimezone}</label>
              </div>
              <div style={{display:"flex",borderBottom:"1px solid #aaa"}}>
                <label className="title">施設等</label>
                <label className="content">{this.props.schedulefacility}</label>
              </div>
              <div style={{display:"flex",borderBottom:"1px solid #aaa"}}>
                <label className="title">種類</label>
                <label className="content">{this.props.patientcode}</label>
              </div>
              <div style={{display:"flex",borderBottom:"1px solid #aaa"}}>
                <label className="title">内容</label>
                <label className="content">{this.props.content}</label>
              </div>
              <div style={{display:"flex",borderBottom:"1px solid #aaa"}}>
                <label className="title">備考</label>
                <label className="content">{this.props.note}</label>
              </div>
              <div style={{display:"flex"}}>
                <label className="title">添書</label>
                <label className="content">{this.props.attachdoccheck}</label>
              </div>
            </div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
            <Button className="delete-btn" onClick={this.props.delete}>
              削除
            </Button>
          <Button className="cancel-btn" onClick={this.props.closeModal}>
            キャンセル
          </Button>
            <Button className="red-btn" onClick={this.props.editModal}>
              編集
            </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

SchedulePreviewModal.contextType = Context;

SchedulePreviewModal.propTypes = {
  closeModal: PropTypes.func,
  editModal: PropTypes.func,
  delete: PropTypes.func,
  checked_by_complete: PropTypes.boolean,
  checked_by_accompanying: PropTypes.boolean,
  checked_by_medical_examination: PropTypes.boolean,
  schedulenum: PropTypes.number,
  scheduledate: PropTypes.string,
  scheduletimezone: PropTypes.string,
  schedulefacility: PropTypes.string,
  patientcode: PropTypes.string,
  content: PropTypes.string,
  note: PropTypes.string,
  attachdoccheck: PropTypes.string,
};

export default SchedulePreviewModal;
