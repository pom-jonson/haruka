import styled from "styled-components";
import { _patientInfo_bg } from "~/components/_nano/colors";

const PatientCardWrapper = styled.div`
  border-radius: 0px;
  border:5px solid #f2f2f2;
  box-shadow: 1px 1px 0 0 rgba(223, 223, 223, 0.5);
  background-color: ${_patientInfo_bg};
  width: 100%;
  margin-top: 5px;
  margin-right:10px;
  height:120px;
  .div-left-side{
    .pullbox-label, .pullbox-select{
      width:180px;
    }
  }
`;

export default PatientCardWrapper;
