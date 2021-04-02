import React, { Component } from "react";
import * as methods from "~/components/templates/Dial/DialMethods";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import DialSideBar from "../DialSideBar";
import DialPatientNav from "../DialPatientNav";
import MedicalHistoryBody from "./MedicalHistoryBody";
import PropTypes from "prop-types";

const Card = styled.div`
  position: relative;  
  width: 100%;
  margin: 0px;
  top: 70px;
  float: left;
  width: calc(100% - 390px);
  left: 200px;
  height: calc(100vh - 70px);
  position: fixed;
  background-color: ${surface};
  padding: 20px;
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
`;

class MedicineHistory extends Component {
    constructor(props) {
      super(props);
      Object.entries(methods).forEach(([name, fn]) =>        
        name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
      );
      this.state = {
        patient_id:0,
        sub_title:''
      }
    }

    selectPatient = (patientInfo) => {
        this.setState({
            patientInfo:patientInfo,
            patient_id:patientInfo.system_patient_id
        })
    };

    showTitle = (sub_title) => {
      this.setState({sub_title});
    }

  render() {
    return (
      <>
          <DialSideBar
              onGoto={this.selectPatient}
              history = {this.props.history}
          />
          <DialPatientNav
              patientInfo={this.state.patientInfo}
              history = {this.props.history}
          />
          <Card>
            <div className="title">病歴&nbsp;&nbsp;{this.state.sub_title}</div>
              <MedicalHistoryBody
                  patientInfo={this.state.patientInfo}
                  showTitle = {this.showTitle}
              />
          </Card>
      </>
    )
  }
}

MedicineHistory.propTypes = {
  history:PropTypes.object,  
}
export default MedicineHistory