import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import MedicalHistoryBody from "../MedicalInformation/MedicalHistoryBody";
import styled from "styled-components";

const Card = styled.div`
  width: calc(80vw - 30px);
  height: 80vh;
  margin: 0px;
  float: left;
  .content{
    height: 89% !important;
    overflow: hidden !important;
  }
  .footer {
    margin-top: 1.2rem !important;
    text-align: center;
    margin-left: 0px !important;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 30px;
    }
    span {
      color: white;
      font-size: 0.8rem;
      font-weight: 100;
    }
  }
`;
class MedicalHistoryModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
    
    }
  }
  
  onHide=()=>{}
  
  render() {
    const { closeModal } = this.props;
    return  (
      <Modal show={true} onHide={this.onHide}  className="wordPattern-modal master-modal medical-history-modal first-view-modal">
        <Modal.Header>
          <Modal.Title>病歴</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <MedicalHistoryBody
              patientInfo={this.props.patientInfo}
              type={'modal'}
              closeModal={closeModal}
              handleOk= {this.props.handleOk}
              from_source = {this.props.from_source}
            />
          </Card>
        </Modal.Body>
      </Modal>
    );
  }
}

MedicalHistoryModal.contextType = Context;

MedicalHistoryModal.propTypes = {
  handleOk: PropTypes.func,
  closeModal: PropTypes.func,
  patientInfo:PropTypes.array,
  from_source:PropTypes.string,
};
export default MedicalHistoryModal;
