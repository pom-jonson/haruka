import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "../_nano/colors";

const H3 = styled.h3`
  color: ${colors.secondary600};
  display: inline-block;
  font-family: NotoSansJP;
  font-size: 8px;
  line-height: 1.7;
  margin-bottom: 0;
`;

const MedicineListWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 26px;
  border-bottom: 1px solid ${colors.background};
  padding: 4px 8px;
  background-color: ${colors.surface};

  &.row {
    margin: 0;
  }

  &:hover {
    background-color: ${colors.secondary200};
    cursor: pointer;

    > h3 {
      color: ${colors.secondary};
      text-decoration: underline;
    }
  }
`;

class SmallMedicineList extends Component {
  putMedicine = ({ currentTarget }) => {
    const target = currentTarget;
    const medicine = {
      medicineId: parseInt(target.getAttribute("data-medicine-id")),
      medicineName: target.getAttribute("data-medicine-name"),
      unit: this.props.unit
    };

    this.props.putMedicine(medicine);
  };
  render() {
    return (
      <MedicineListWrapper
        key={this.props.medicineId}
        onClick={this.putMedicine}
        data-medicine-id={this.props.medicineId}
        data-medicine-name={this.props.medicineName}
        className="row"
      >
        <H3>{this.props.medicineName}</H3>
      </MedicineListWrapper>
    );
  }
}

SmallMedicineList.propTypes = {
  medicineId: PropTypes.number,
  medicineName: PropTypes.string,
  unit: PropTypes.array,
  putMedicine: PropTypes.func
};

export default SmallMedicineList;
