import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import InfectionBody from "~/components/templates/Dial/MedicalInformation/InfectionBody";

const Card = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${surface};
  button {
    margin-bottom: 10px;
    margin-left: 10px;
  }
  .bedside-infection {
    height: 100%;
    table {
      tbody {
        height: calc(100vh - 28.3rem);
      }
    }
  }
`;

class PatientInfectionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    onHide=()=>{}

    render() {
        const { closeModal } = this.props;
        return  (
            <Modal show={true} onHide={this.onHide}  className="wordPattern-modal master-modal patient-contrain-modal first-view-modal">
                <Modal.Header>
                    <Modal.Title>感染症</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <InfectionBody
                            patientInfo={this.props.patientInfo}
                            type={'modal'}
                            closeModal={closeModal}
                            handleOk= {this.props.handleOk}
                        />
                    </Card>
                </Modal.Body>
            </Modal>
        );
    }
}

PatientInfectionModal.contextType = Context;

PatientInfectionModal.propTypes = {
    handleOk: PropTypes.func,
    closeModal: PropTypes.func,
    patientInfo:PropTypes.array,
};
export default PatientInfectionModal;
