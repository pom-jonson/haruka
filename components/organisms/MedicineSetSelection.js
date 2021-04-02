import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
// import MedicineList from "../molecules/MedicineList";
import MedicineSetHistory from "../organisms/MedicineSetHistory";
import Spinner from "react-bootstrap/Spinner";

const MedicineSelectionWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class MedicineSetSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      medicineData: this.props.medicineHistory,
      isLoaded:props.isLoaded
    };
  }

  async componentDidMount() {}

  testMedSetRender = (medicineSetHistory) => {
    this.setState({
      medicineData: medicineSetHistory
    });
  }

  testIsLoadedRender = (isLoaded = false) => {
    this.setState({
      isLoaded: isLoaded
    });
  }

  render() {
    if (!this.state.isLoaded) {
      return (
        <SpinnerWrapper>
          <Spinner animation="border" variant="secondary" />
        </SpinnerWrapper>
      );
    } else {
      return (
        <MedicineSelectionWrapper>
          <MedicineSetHistory
            ref={ref => (this.MedicineHistory = ref)}
            patientId={this.props.patientId}
            allPrescriptionOpen={this.props.allPrescriptionOpen}
            doctors={this.props.doctors}
            doctor_code={this.props.doctor_code}
            doctor_name={this.props.doctor_name}
            setDoctorInfo={this.props.setDoctorInfo}
            medicineHistory={this.state.medicineData}
            match={this.props.match}
            presetRefresh={this.props.presetRefresh}
          />
          {/* <MedicineOtherWrapper>{medicineList}</MedicineOtherWrapper> */}
        </MedicineSelectionWrapper>
      );
    }
  }
}

MedicineSetSelection.propTypes = {
  isLoaded: PropTypes.bool,
  patientId: PropTypes.number,
  allPrescriptionOpen: PropTypes.boolean,
  doctors: PropTypes.array,
  doctor_code: PropTypes.number,
  doctor_name: PropTypes.string,
  setDoctorInfo: PropTypes.func,
  presetRefresh: PropTypes.func,
  medicineHistory: PropTypes.array,
  match: PropTypes.object
};

export default MedicineSetSelection;
