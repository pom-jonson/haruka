import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltDown } from "@fortawesome/pro-solid-svg-icons";

const RightPointer = styled(FontAwesomeIcon)`
  display: inline-block;
  margin-left: auto;
  font-size: 14px;
`;

const H3 = styled.h3`
  color: ${colors.secondary600};
  display: inline-block;
  font-family: NotoSansJP;
  font-size: 8px;
  line-height: 1.7;
  margin-bottom: 0;
`;

class MedicineSelectedList extends Component {
  constructor(props) {
    super(props);
  }

  openModal(e) {
    const target = e.currentTarget;
    const medicine = {
      medicineId: parseInt(target.getAttribute("data-medicine-id")),
      medicineName: target.getAttribute("data-medicine-name"),
      unit: this.props.unit
    };

    this.props.openModal(medicine);
  }

  render() {
    const MedicineListWrapper = styled.div`
      display: flex;
      width: 100%;
      height: 26px;
      border-bottom: 1px solid ${colors.background};

      background-color: ${colors.secondary200};
      cursor: pointer;

      &.row {
        margin: 0;
      }

      > h3 {
        color: ${colors.secondary};
        text-decoration: underline;
      }
    `;

    return (
      <MedicineListWrapper
        key={this.props.medicineId}
        onClick={this.openModal.bind(this)}
        data-medicine-id={this.props.medicineId}
        data-medicine-name={this.props.medicineName}
        data-medicine-unit={this.props.medicineUnit}
        className="row"
      >
        <H3>{this.props.medicineName}</H3>
        <RightPointer
          icon={faArrowAltDown}
          rotation={270}
          color={colors.secondary}
        />
      </MedicineListWrapper>
    );
  }
}

MedicineSelectedList.propTypes = {
  medicineId: PropTypes.number,
  unit: PropTypes.array,
  medicineName: PropTypes.string,
  medicineUnit: PropTypes.string,
  openModal: PropTypes.func
};

export default MedicineSelectedList;
