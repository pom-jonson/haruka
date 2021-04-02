import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import InjectionRank from "./InjectionRank";
import Spinner from "react-bootstrap/Spinner";


const InjectionRankSelectionWrapper = styled.div`
  width: 100%;
  height: 100%;
`;


const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class InjectionRankSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      medicineData: this.props.medicineRankData,
      isLoadedRank: this.props.isLoadedRank,
    };
    this.injectionRankRef = React.createRef();
  }

  testMedRankRender = (medicineRankHistory) => {
    this.injectionRankRef.current.handleInjectionRankRender(medicineRankHistory);
    this.setState({
      medicineData: medicineRankHistory,
      isLoadedRank: false
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
      <InjectionRankSelectionWrapper>
        <InjectionRank
          ref={this.injectionRankRef}
          medicineRankData={this.state.medicineData}
          isLoaded_rank={this.state.isLoadedRank}
          allPrescriptionOpen={this.props.allPrescriptionOpen}
        />
      </InjectionRankSelectionWrapper>
    );
  }
}
}

InjectionRankSelection.propTypes = {
  isLoaded: PropTypes.bool,
  isLoadedRank: PropTypes.bool,
  medicineRankData: PropTypes.array,
  allPrescriptionOpen: PropTypes.bool
};

export default InjectionRankSelection;
