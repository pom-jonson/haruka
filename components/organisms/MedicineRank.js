import React, { Component } from "react";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import MedicineRankItem from "../organisms/MedicineRankItem";
import PropTypes from "prop-types";
import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MedicineSelectionWrapper = styled.div`
  width: 100%;
  height: 100%;
  max-height: calc(100vh - 220px);
  background-color: #ffffff;
  border: 1px solid ${colors.disable};
  border-top: none;
  overflow-y: scroll;
`;

const MedicineListWrapper = styled.div`
  font-size: 12px;

  .row {
    margin: 0;
    &:first-child {
      border-top: 1px solid ${colors.disable};
    }
  }

  p {
    margin-bottom: 0;
  }
`;

class MedicineRank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      medicineRankData: this.props.medicineRankData,
      allPrescriptionOpen: null
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.allPrescriptionOpen != prevState.allPrescriptionOpen) {
      this.state.medicineRankData.map(medicine => {
        if (this.props.allPrescriptionOpen !== undefined) {
          if (medicine.class_name === undefined) {
            if (this.props.allPrescriptionOpen == true) {
              medicine.class_name = "";
            } else if (this.props.allPrescriptionOpen == false) {
              medicine.class_name = "open";
            }
          }
        }
      });
      this.setState({ allPrescriptionOpen: this.props.allPrescriptionOpen });
    }
  }

  async componentDidMount() {
    this.setState({ medicineRankData: this.props.medicineRankData });
  }

  onAngleClicked(e, code) {
    if (e.target === e.currentTarget) {
      let medicineRankData = this.state.medicineRankData.map(function(
        medicine
      ) {
        if (medicine.code == code) {
          medicine.class_name = medicine.class_name == "open" ? "" : "open";
        }
        return medicine;
      });

      this.setState({
        medicineRankData: medicineRankData
      });
    }
  }

  handleMedicineRankRender = (medicineRankData) => {
    this.setState({
      medicineRankData
    });
  }

  render() {
    let medicineRankList = this.state.medicineRankData.map(
      (medicine, orderIndex) => {
        return (
          medicine.count >= 3 && ( // 今後削除することが必要になります。
            <div key={orderIndex}>
              <MedicineRankItem
                code={medicine.code}
                medicine={medicine}
                onAngleClicked={this.onAngleClicked.bind(this)}
                class_name={medicine.class_name}
              />
            </div>
          )
        );
      }
    );

    return (
      <MedicineSelectionWrapper>
        <MedicineListWrapper>{medicineRankList}</MedicineListWrapper>
        {this.props.isLoaded_rank == true && (
          <SpinnerWrapper>
            <Spinner animation="border" variant="secondary" />
          </SpinnerWrapper>
        )}
      </MedicineSelectionWrapper>
    );
  }
}

MedicineRank.defaultProps = {
  allPrescriptionOpen: null
};

MedicineRank.propTypes = {
  medicineRankData: PropTypes.array,
  isLoaded_rank: PropTypes.bool,
  allPrescriptionOpen: PropTypes.bool
};

export default MedicineRank;
