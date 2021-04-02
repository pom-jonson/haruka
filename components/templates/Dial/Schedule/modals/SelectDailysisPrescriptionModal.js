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
  font-size: 12px;
  width: 100%;
  height: 100%;
  flex-direction: column;
  display: flex;
  text-align: center;  
  .dailysis-prescription-list {
    border: solid 1px rgb(206,212,218);
    width:100%;
  }
  .radio-btn label{
    font-size:16px;
  }
 `;

class SelectDailysisPrescriptionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {      
      dailysisPrescriptionList: this.props.dailysisPrescriptionList
    }
  }

  addDailysisPrescription = (e) => {
    this.props.addDailysisPrescription(parseInt(e.target.id));
  };

  render() {
    const dailysisPrescriptionList = [];
    this.state.dailysisPrescriptionList.map((dialyser, index) => {
      dailysisPrescriptionList.push(
          <RadioButton
              key={index}
              id={index}
              label={dialyser.id + " : " + dialyser.name}
              getUsage={this.addDailysisPrescription}
              // checked={index === this.state.usageSelectIndex}
          />
      );
    });

    const { closeModal } = this.props;
    return  (
        <Modal show={true} onHide={closeModal} id="add_contact_dlg"  className="master-modal dailysis-prescription-modal">
          <Modal.Header closeButton>
            <Modal.Title>透析中処方追加</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>                            
              <div className="dailysis-prescription-list">
                {dailysisPrescriptionList}
              </div>
            </Wrapper>
          </Modal.Body>
        </Modal>
    );
  }
}

SelectDailysisPrescriptionModal.contextType = Context;

SelectDailysisPrescriptionModal.propTypes = {
  dailysisPrescriptionList: PropTypes.array,
  closeModal: PropTypes.func,
  addDailysisPrescription: PropTypes.func,
};

export default SelectDailysisPrescriptionModal;
