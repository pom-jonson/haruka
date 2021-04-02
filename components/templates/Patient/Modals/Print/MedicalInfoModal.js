import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import MedicalInfoDoc from "./MedicalInfoDoc";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 16px;
  width: 100%;
  height: 100%;
 `;

class MedicalInfoModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  render() {
    return  (
        <Modal show={true}  className="outpatient-modal exa-modal">
          <Modal.Header>
            <Modal.Title><span>診療情報提供書</span></Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Wrapper>
              <MedicalInfoDoc
                  cache_index={this.props.cache_index}
                  patientInfo={this.props.patientInfo}
                  patientId={this.props.patientId}
                  closeModal={this.props.closeModal}
                  />
              </Wrapper>
          </Modal.Body>
        </Modal>
    );
  }
}

MedicalInfoModal.contextType = Context;

MedicalInfoModal.propTypes = {
  closeModal: PropTypes.func,
  modal_type: PropTypes.string,
  patientId: PropTypes.number,
  modal_data: PropTypes.object,
  patientInfo: PropTypes.object,
  history: PropTypes.object,
  cache_index:PropTypes.number,

};

export default withRouter(MedicalInfoModal);
