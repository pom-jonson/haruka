import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import DialSideBar from "../DialSideBar";
import DialPatientNav from "../DialPatientNav";
import FootCareBody from "../Board/FootCare";
import PropTypes from "prop-types";

const Card = styled.div`
  padding: 20px;
  padding-right: 10px;
  position: fixed;
  top: 70px;
  left: 200px;
  width: calc(100% - 390px);
  margin: 0px;
  height: 100vh;
  float: left;
  overflow: hidden;
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
  .bodywrap {
    display: flex;
  }
  .footer {
    margin-top: 10px;
    text-align: center;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 30px;
    }

    span {
      color: white;
      font-size: 20px;
      font-weight: 100;
    }
  }
  background-color: ${surface};
  button {
    margin-bottom: 10px;
    margin-left: 10px;
  }
`;

class FootCare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      table_data: [],
      isOpenModal: false,
      schedule_date: new Date(),
      modal_data: null,
      system_patient_id: null,
    };
  }

  selectPatient = (patientInfo) => {
    this.setState(
      {
        patientInfo: patientInfo,
        system_patient_id: patientInfo.system_patient_id,
      },
      () => {
        // this.getList();
      }
    );
  };

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
          <div className="title">フットケア</div>
          <FootCareBody
            patientInfo={this.state.patientInfo}
            patientId={this.state.patientId}
            offset_x={200}
            offset_y={70}
          />
        </Card>
      </>
    );
  }
}

FootCare.propTypes = {    
  history: PropTypes.object
};
export default FootCare;
