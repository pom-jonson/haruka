import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const PatientLi = styled.li`
  display: flex;
  width: 100%;
  border-bottom: 1px solid #aaa;
  height: 2.5rem;
  font-size: 1.25rem;
  line-height: 2.5rem;
`;

const Title = styled.div`
  width: auto;
  border-right: 1px solid #aaa;
  width: 200px;
  margin-top: 5px;
  margin-bottom: 5px;
`;

const Value = styled.div`
  width: auto;
  margin-top: 5px;
  margin-bottom: 5px;
  padding-left: 30px;
`;

class PatientList extends Component {
  initialState = {};

  state = this.initialState;

  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    // const blood_types = [ "O", "A", "B", "AB","未設定" ];
    let patientListValue = this.props.patientListValue;
    if(this.props.patientListTitle === "血液型:"){
        patientListValue = patientListValue != null && patientListValue !=  '' ? patientListValue.trim() : '';
    }
    if(this.props.patientListTitle === "出生時体重:"){
        patientListValue = (patientListValue != null && patientListValue !== 0) ? patientListValue : '' ;
    }
    return (
      <PatientLi>
        <Title>{this.props.patientListTitle}</Title>
        <Value>{patientListValue}</Value>
      </PatientLi>
    );
  }
}

PatientList.propTypes = {
  patientListTitle: PropTypes.string,
  patientListValue: PropTypes.string
};

export default PatientList;
