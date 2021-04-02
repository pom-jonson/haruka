import React, { Component } from "react";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import PropTypes from "prop-types";
import SmallMedicineList from "./SmallMedicineList";

const MedicineSelectionWrapper = styled.div`
  width: 300px;
  background-color: ${colors.background};
`;

class SmallMedicineSelection extends Component {
  putMedicine(medicine) {
    this.props.putMedicine(medicine);
  }
  render() {
    const medicineList = [];
    this.props.medicineData.map((medicine, index) => {
      medicineList.push(
        <SmallMedicineList
          key={index}
          medicineId={medicine.medicineId}
          medicineName={medicine.medicineName}
          unit={medicine.unit}
          putMedicine={this.putMedicine.bind(this)}
        />
      );
    });
    return (
      <MedicineSelectionWrapper>
        <MedicineSelectionWrapper>{medicineList}</MedicineSelectionWrapper>
      </MedicineSelectionWrapper>
    );
  }
}

SmallMedicineSelection.propTypes = {
  medicineData: PropTypes.array,
  putMedicine: PropTypes.func
};

export default SmallMedicineSelection;
