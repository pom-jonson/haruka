import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { surface } from "~/components/_nano/colors";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import PatientInfoEditBody from "~/components/templates/Dial/Board/molecules/PatientInfoEditBody";
import DialInsuranceBody from "~/components/templates/Dial/DialInsuranceBody";
import DialEmergencyContactBody from "~/components/templates/Dial/DialEmergencyContactBody";
import DialFamilyBody from "~/components/templates/Dial/DialFamilyBody";

const Card = styled.div`
  width: 100%;
  margin: 0px;
  height: 100%;
  float: left;
  overflow-y: auto;
  .title {
    margin-left: 10px;
    margin-top: 0;
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
  .plus_icon{
    font-size:14px;
   }
 .calendar_icon{
    font-size:20px;
    position: absolute;
    top: 17px;
    left: 66px;
    color: #6a676a;
}
  }
  .bodywrap {
      display: flex;
      height: calc(100% - 8rem);
      overflow-y: auto;
  }
  background-color: ${surface};
    button {
        margin-bottom: 10px;
        margin-left: 10px;
    }
.id_input{
    label{
        text-align:right;
    }   
}
.first-input-step{
    margin-top: 20px;
    margin-left: 20px;
}
label {
    font-size: 14px;
}
.modal_card{
    position: relative;
    left: 0;
    width: 100%;
}
.insurance-modal{
    top: 0;
    padding: 0;
    height: 100%;
}
.emergency-contact-modal{
    height: 100%;
    .wrapper{
      height: calc(100% - 14.3rem);
    }
    tbody{
        height: calc(100vh - 33rem);
    }
}
.insurance-modal-wrapper{
    height: calc(100% - 8rem);
}
.family-wrapper{
    height: calc( 100% - 8rem);
    overflow-y: auto;
}
  .footer {
      text-align: center;
      margin-top: 20px;
      button {
        text-align: center;
        border-radius: 4px;
        background: rgb(105, 200, 225); 
        border: none;
        margin-right: 30px;
      }
      
      span {
        color: white;
        font-size: 20px;
        font-weight: 100;
      }
  }
`;

class PatientInfoEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "/dial/dial_patient?from_other=1",
    };
  }

  onHide = () => {};
  goOtherPage = (type) => {
    this.setState({ type });
  };

  render() {
    const { closeModal } = this.props;
    let { type } = this.state;
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        className="wordPattern-modal master-modal patient-info-edit-modal first-view-modal"
        id="patient-info-edit-modal"
      >
        <Modal.Header>
          <Modal.Title>基本情報/緊急連絡先</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            {type == "/dial/dial_patient?from_other=1" && (
              <PatientInfoEditBody
                patientInfo={this.props.patientInfo}
                type={"modal"}
                closeModal={closeModal}
                handleOk={this.props.handleOk}
                goOtherPage={this.goOtherPage}
              />
            )}
            {type == "/dial/dial_insurance" && (
              <DialInsuranceBody
                patientInfo={this.props.patientInfo}
                type={"modal"}
                closeModal={closeModal}
                handleOk={this.props.handleOk}
                goOtherPage={this.goOtherPage}
              />
            )}
            {type == "/dial/dial_emergency" && (
              <DialEmergencyContactBody
                patientInfo={this.props.patientInfo}
                type={"modal"}
                closeModal={closeModal}
                handleOk={this.props.handleOk}
                goOtherPage={this.goOtherPage}
              />
            )}
            {type == "/dial/dial_family" && (
              <DialFamilyBody
                patientInfo={this.props.patientInfo}
                type={"modal"}
                closeModal={closeModal}
                handleOk={this.props.handleOk}
                goOtherPage={this.goOtherPage}
              />
            )}
          </Card>
        </Modal.Body>
      </Modal>
    );
  }
}

PatientInfoEditModal.contextType = Context;

PatientInfoEditModal.propTypes = {
  handleOk: PropTypes.func,
  closeModal: PropTypes.func,
  patientInfo: PropTypes.object,
};
export default PatientInfoEditModal;
