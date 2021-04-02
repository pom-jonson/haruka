import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import InjectionSetHistory from "../organisms/InjectionSetHistory";
import Spinner from "react-bootstrap/Spinner";

const InjectionSelectionWrapper = styled.div`
  width: 100%;
`;

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class InjectionSetSelection extends Component {
  state = {
    injectionData: this.props.injectionHistory
  };

  async componentDidMount() {}

  testMedSetRender = (medicineSetHistory) => {
    this.setState({
      injectionData: medicineSetHistory
    });

  }

  render() {

    if (!this.props.isLoaded) {
      return (
        <SpinnerWrapper>
          <Spinner animation="border" variant="secondary" />
        </SpinnerWrapper>
      );
    } else {
      return (
        <InjectionSelectionWrapper>
          <InjectionSetHistory
            ref={ref => (this.InjectionHistory = ref)}
            patientId={this.props.patientId}
            allPrescriptionOpen={this.props.allPrescriptionOpen}
            doctors={this.props.doctors}
            doctor_code={this.props.doctor_code}
            doctor_name={this.props.doctor_name}
            setDoctorInfo={this.props.setDoctorInfo}
            injectionHistory={this.state.injectionData}
            match={this.props.match}
          />
        </InjectionSelectionWrapper>
      );
    }
  }
}

InjectionSetSelection.propTypes = {
  isLoaded: PropTypes.bool,
  patientId: PropTypes.number,
  allPrescriptionOpen: PropTypes.boolean,
  doctors: PropTypes.array,
  doctor_code: PropTypes.number,
  doctor_name: PropTypes.string,
  setDoctorInfo: PropTypes.func,
  injectionHistory: PropTypes.array,
  match: PropTypes.object
};

export default InjectionSetSelection;
