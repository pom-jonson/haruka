import React, { Component } from "react";
import axios from "axios";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import PropTypes from "prop-types";
import PrescriptionHistoryList from "../molecules/PrescriptionHistoryList";
// import orderPrescriptionPatientMock from "../../mocks/order/prescription/patient";
import { getRandomKey } from "../../helpers/random";

const MedicineSelectionWrapper = styled.div`
  width: 100%;
  background-color: #ffffff;
  border: 1px solid ${colors.disable};
  border-top: none;
`;

const MedicineListWrapper = styled.div`
  font-size: 12px;

  .row {
    border-left: none;
    border-right: none;
    margin: 0;
  }

  .box {
    padding: 16px 16px 4px 32px;
    line-height: 1.3;
  }

  .dl-box {
    padding: 0 4px;
  }

  input {
    text-align: center;
    width: 50px;
  }

  .flex {
    display: flex;
    margin-bottom: 0;

    &.between {
      justify-content: space-between;

      div {
        margin-right: 0;
      }
    }

    div {
      margin-right: 8px;
    }

    .date {
      margin-left: auto;
      margin-right: 24px;
    }
  }

  .patient-name {
    margin-left: 16px;
  }

  .doctor {
    margin-left: 140px;
  }

  .drug-item {
    display: inline-block;
    padding: 8px 4px;
    width: 30%;
    margin-right: 5%;
    margin-bottom: 4px;
    vertical-align: top;
    &:nth-child(2n) {
      background-color: ${colors.secondary200};
    }
    &:nth-child(3n) {
      margin-right: 0;
    }
  }

  .w50 {
    text-align: right;
    width: 50px;
  }

  .text-right {
    width: calc(100% - 60px);
  }

  dt {
    font-weight: normal;
  }

  dd {
    margin: 0 0 0 16px;
  }

  .ml {
    margin-left: 20px;
  }
`;

class MedicineSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      medicineHistory: [],
      limit: 5,
      offset: 0
    };
  }

  getHistoryData = async params => {
    const { data } = await axios.get("/app/api/v2/order/prescription/patient", {
      params: {
        patient_id: params.id,
        offset: params.offset,
        limit: params.limit
      }
    });
    return data;
  };

  isMounted = false;
  async componentDidMount() {
    this.isMounted = true;
    const medicineHistory = await this.getHistoryData({
      id: this.props.patientId,
      offset: this.state.offset,
      limit: this.state.limit
    });
    if (medicineHistory) {
      this.setState({ medicineHistory });
    }
  }

  async componentWillUnmount() {
    this.isMounted = false;
  }

  render() {
    let medicineHistoryList = [];

    this.state.medicineHistory.map(medicine => {
      medicine.order_data.order_data.map(order => {
        medicineHistoryList.push(
          <PrescriptionHistoryList
            key={getRandomKey()}
            orderNumber={medicine.number}
            patientId={this.props.patientId}
            order={order}
          />
        );
      });
    });

    return (
      <MedicineSelectionWrapper>
        <MedicineListWrapper>{medicineHistoryList}</MedicineListWrapper>
      </MedicineSelectionWrapper>
    );
  }
}

MedicineSelection.propTypes = {
  patientId: PropTypes.number
};

export default MedicineSelection;
