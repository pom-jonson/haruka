import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import HeartIndividualBody from "~/components/templates/Dial/MedicalInformation/HeartIndividualBody";
// import Button from "~/components/atoms/Button";

const Card = styled.div`
  width: 100%;
  height: 100%;
  position:relative;
  float: left;
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
  .bodywrap {
    display: flex;
  }
  background-color: ${surface};
  button {
    margin-bottom: 10px;
    margin-left: 10px;
  }
  .modal-wrapper {
    height: 100%;
    .content {
      height: 100%;
    }
    table {
      tbody {
        height: calc(100vh - 30.3rem);
      }
    }
  }
`;

class PatientHeartModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onHide = () => {};

  render() {
    const { closeModal } = this.props;
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        className="wordPattern-modal master-modal patient-contrain-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>心胸比</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card id ='heart-body'>
            <HeartIndividualBody
              patientInfo={this.props.patientInfo}
              type={"modal"}
              closeModal={closeModal}
              handleOk={this.props.handleOk}
            />
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <div onClick={this.props.closeModal} className="custom-modal-btn cancel-btn" style={{cursor:"pointer"}}>
            <span>キャンセル</span>
          </div>
          {/* <Button className="cancel-btn" onClick={closeModal}>閉じる</Button> */}
        </Modal.Footer>
      </Modal>
    );
  }
}

PatientHeartModal.contextType = Context;

PatientHeartModal.propTypes = {
  handleOk: PropTypes.func,
  closeModal: PropTypes.func,
  patientInfo: PropTypes.array,
};
export default PatientHeartModal;
