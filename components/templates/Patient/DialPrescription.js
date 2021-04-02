import React, { Component } from "react";
import styled from "styled-components";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";

registerLocale("ja", ja);

const PatientsWrapper = styled.div`
  width: 100%;
  margin: auto;
`;


class DialPrescription extends Component {
  constructor(props) {
    super(props);        
  }

  componentDidMount () {
    
  }

 
  render() {
    return (
      <PatientsWrapper>
        <div className="div-dial-prescripton">          
        </div>
      </PatientsWrapper>
    );
  }
}

export default DialPrescription;
