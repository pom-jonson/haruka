import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import ContraindicationBody from "~/components/templates/Dial/MedicalInformation/ContraindicationBody";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";

const Card = styled.div`
  width: 100%;
  height: 100%;
  float: left;
  overflow-y: auto;
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
  .bedside-contradication {
    height: 100%;
    table {
      tbody {
        height: calc(100vh - 28.3rem);
      }
    }
  }
  .bodywrap {
    display: flex;
  }
  background-color: ${surface};
  button {
    margin-bottom: 10px;
    margin-left: 10px;
  }
`;

class PatientContrainModal extends Component {
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
                    <Modal.Title>禁忌薬</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <ContraindicationBody
                            patientInfo={this.props.patientInfo}
                            type={'modal'}
                            closeModal={closeModal}
                            handleOk= {this.props.handleOk}
                            from_source={this.props.from_source}
                        />
                    </Card>
                </Modal.Body>
            </Modal>
        );
    }
}

PatientContrainModal.contextType = Context;

PatientContrainModal.propTypes = {
    handleOk: PropTypes.func,
    closeModal: PropTypes.func,
    patientInfo:PropTypes.array,
    from_source:PropTypes.string
};
export default PatientContrainModal;
