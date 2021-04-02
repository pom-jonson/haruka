import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
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
  text-align: center;  
  .comment-area {
    border: solid 1px rgb(206,212,218);
    width:100%;
    textarea {
      width: 100%;
      height: 150px;
    }
  }
  .radio-btn label{
    font-size:16px;
  }  .footer {    
    margin-left: 60px;
    margin-top: 10px;
    text-align: center;
    padding-top:20px;
    clear:both;
    label{
      width:100px;      
    }        
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225); 
      border: none;
      margin-right: 30px;
      padding-left: 20px;
      padding-right: 20px;
    }
    .add-button {
      text-align: center;      
    }
    span {
      color: white;
      font-size: 15px;
      font-weight: 100;
    }
  }
 `;

class InputCommentModal extends Component {
  constructor(props) {
    super(props);
    this.state = {      
      comment: this.props.comment !==null ? this.props.comment : "",
    }
  }

    saveEditedComment = () => {
      this.props.saveComment(this.state.comment);
    };

    setComment = (e) => {
        this.setState({comment:e.target.value});
    };

  render() {    
    return  (
        <Modal show={true} id="add_contact_dlg"  className="master-modal input-comment-modal">
          <Modal.Header>
            <Modal.Title>コメント編集</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>                            
              <div className="comment-area">
                  <textarea
                      onChange={this.setComment.bind(this)}
                      value={this.state.comment}
                  />
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.closeModal} className="cancel-btn">キャンセル</Button>
            <Button onClick={this.saveEditedComment} className="red-btn">登録</Button>
          </Modal.Footer>
        </Modal>
    );
  }
}

InputCommentModal.contextType = Context;

InputCommentModal.propTypes = {
  saveComment: PropTypes.func,
  closeModal: PropTypes.func,
    comment: PropTypes.string,
};

export default InputCommentModal;
