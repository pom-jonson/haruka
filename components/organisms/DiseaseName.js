import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import DiseaseNamePopup from "./DiseaseNamePopup";

const DiseaseNameWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(16, 30, 33, 0.73);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;
`;

const DiseaseName = props => (
  <DiseaseNameWrapper>
    <DiseaseNamePopup closeModal={props.closeModal} />
  </DiseaseNameWrapper>
);

DiseaseName.propTypes = {
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func
};

export default DiseaseName;
