import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import RadioButton from "~/components/molecules/RadioInlineButton"

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 16px;
  width: 100%;
  height: 100%;
  flex-direction: column;
  display: flex;
  text-align: center;
  .radio-btn{
    label{
      font-size:18px;
    }
  }
  .dialyser-list {
    border: solid 1px rgb(206,212,218);
    width:100%;
  }  
 `;

class SelectDialyserModal extends Component {
  constructor(props) {
    super(props);
    this.state = {      
      dialyserList: this.props.dialyserList
    }
  }

  addDialyser = (e) => {
    this.props.addDialyser(parseInt(e.target.id));
  };

  render() {
    const dialyserList = [];
    this.state.dialyserList.map((dialyser, index) => {
      dialyserList.push(
          <RadioButton
              key={index}
              id={index}
              label={dialyser.id + " : " + dialyser.name}
              getUsage={this.addDialyser}
              // checked={index === this.state.usageSelectIndex}
          />
      );
    });

    const { closeModal } = this.props;
    return  (
        <Modal show={true} onHide={closeModal} id="add_contact_dlg"  className="master-modal dialyser-modal">
          <Modal.Header closeButton>
            <Modal.Title>ダイアライザ選択</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>                            
              <div className="dialyser-list">
                {dialyserList}
              </div>
            </Wrapper>
          </Modal.Body>
        </Modal>
    );
  }
}

SelectDialyserModal.contextType = Context;

SelectDialyserModal.propTypes = {
  dialyserList: PropTypes.array,
  closeModal: PropTypes.func,
  addDialyser: PropTypes.func,
};

export default SelectDialyserModal;
