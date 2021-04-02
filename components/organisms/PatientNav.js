import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import * as colors from "~/components/_nano/colors";
import PatientInfoCard from "../molecules/PatientInfoCard";

const Wrapper = styled.div`
  background-color: ${colors.background};
  position: fixed;
  top: 0px;
  width: calc(100% - 190px);
  z-index: 100;
  
  -webkit-touch-callout: none; /* iOS Safari */ 
  -webkit-user-select: none; /* Safari */ 
  -khtml-user-select: none; /* Konqueror HTML */ 
  -moz-user-select: none; /* Firefox */ 
  -ms-user-select: none; /* Internet Explorer/Edge */ 
  user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */

  .flex {
    display: flex;
    margin: 0 !important;
  }

  .row {
    margin: 0;
  }

  dl {
    margin-top: 0;
  }

  .modal-dialog {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    max-width: 70%;
  }

  .selected_patient_0 #patient-head-info{
    border: 5px solid ${colors.firstPatientColor};
  }
  .selected_patient_1 #patient-head-info{
    border: 5px solid ${colors.secondPatientColor};
  }
  .selected_patient_2 #patient-head-info{
    border: 5px solid ${colors.thirdPatientColor};
  }
  .selected_patient_3 #patient-head-info{
    border: 5px solid ${colors.forthPatientColor};
  }
`;

export const getSelectedPatientClass = (patient_id, patient_list) => {
  
  if (patient_list != null && patient_list != undefined && patient_list.length > 0) {

    let patient_index = "";
    patient_list.map((item, idx)=>{
      if (patient_id == parseInt(item.system_patient_id)) {
        patient_index = idx;
      }
    });

    return "selected_patient_" + patient_index;
  }

  return "";
}

const PatientNav = ({ patientId, patientInfo, detailedPatientInfo, openModal, currentSystem, patientsList }) => (
  <Wrapper
    className={ currentSystem == "haruka" ? "" : "dial-patient-nav"}
  >
    <header className={`patients-header ${currentSystem == "haruka" && getSelectedPatientClass(patientId, patientsList) }`}>
      <div className="flex my-3">
        <PatientInfoCard
          openModal={openModal}
          patientId={patientId}
          patientInfo={patientInfo}
          detailedPatientInfo={detailedPatientInfo}
        />
      </div>
    </header>
  </Wrapper>
);

PatientNav.propTypes = {
  openModal: PropTypes.func,
  patientId: PropTypes.number,
  patientInfo: PropTypes.object.isRequired,
  detailedPatientInfo: PropTypes.object,
  currentSystem: PropTypes.string,
  patientsList: PropTypes.array,
};

export default PatientNav;
