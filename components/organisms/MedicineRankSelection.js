import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import MedicineRank from "../organisms/MedicineRank";
import Spinner from "react-bootstrap/Spinner";


const MedicineRankSelectionWrapper = styled.div`
  width: 100%;
  height: 100%;
`;


const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class MedicineRankSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      medicineData: props.medicineRankData,
      isLoadedRank: props.isLoadedRank,
      isLoaded: props.isLoaded
    };
    this.medicineRankRef = React.createRef();
  }

  testMedRankRender = (medicineRankHistory) => {
    this.medicineRankRef.current.handleMedicineRankRender(medicineRankHistory);
    this.setState({
      medicineData: medicineRankHistory,
      isLoadedRank: false
    });
  }

  testIsLoadedRender = (isLoaded = false) => {
    this.setState({
      isLoaded
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
      <MedicineRankSelectionWrapper>
        <MedicineRank
          ref={this.medicineRankRef}
          medicineRankData={this.state.medicineData}
          isLoaded_rank={this.state.isLoadedRank}
          allPrescriptionOpen={this.props.allPrescriptionOpen}
        />
      </MedicineRankSelectionWrapper>
    );
  }
}
}

MedicineRankSelection.propTypes = {
  isLoaded: PropTypes.bool,
  isLoadedRank: PropTypes.bool,
  medicineRankData: PropTypes.array,
  allPrescriptionOpen: PropTypes.bool
};

export default MedicineRankSelection;
