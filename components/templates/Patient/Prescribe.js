import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import PrescribePopup from "../../organisms/PrescribePopup";

const PrescribeWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(16, 30, 33, 0.73);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;
`;

const Prescribe = props => (
  <PrescribeWrapper>
    <PrescribePopup
      closeModal={props.closeModal}
      confirm={props.confirm}
      medicineId={props.medicineId}
      medicineName={props.medicineName}
      medical_business_diagnosing_type={props.medical_business_diagnosing_type}
      insurance_type_list={props.insurance_type_list}
      unit={props.unit}
    />
  </PrescribeWrapper>
);

Prescribe.propTypes = {
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func,
  confirm: PropTypes.func,
  medicineId: PropTypes.number,
  medicineName: PropTypes.string,
  unit: PropTypes.array,
  medical_business_diagnosing_type: PropTypes.number,
  insurance_type_list: PropTypes.array
};

export default Prescribe;
