import React, { Component } from "react";
import { Modal} from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import {displayLineBreak} from "~/helpers/dialConstants"
import Button from "~/components/atoms/Button";

const Wrapper = styled.div`
    max-height:40rem;
    overflow-y:auto;
    word-break:break-all;
    word-wrap:break-word;
    .flex{
        display:flex;
    }
    .note{
      font-size:20px;
    }
 `;

class NoteModal extends Component {
  constructor(props) {
    super(props);
        
    this.state = {    
    }
  }

  onHide = () =>{}

  render() {
    const no_str = "登録した備考がありません。";
    return  (
      <Modal show={true} onHide={this.onHide} id="add_contact_dlg"  className="master-modal note-modal">
        <Modal.Header>
          <Modal.Title>備考</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Wrapper>                
                <div className='note'>{this.props.note!=undefined && this.props.note != null && this.props.note !=''?displayLineBreak(this.props.note):no_str}</div>
            </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

NoteModal.contextType = Context;

NoteModal.propTypes = {    
    closeModal: PropTypes.func,
    note:PropTypes.string,
    comment:PropTypes.array,    
    section_no:PropTypes.number,
};

export default NoteModal;
