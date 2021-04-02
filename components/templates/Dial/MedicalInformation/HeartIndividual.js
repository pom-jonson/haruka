import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import DialSideBar from "../DialSideBar";
import DialPatientNav from "../DialPatientNav";
import HeartIndividualBody from "~/components/templates/Dial/MedicalInformation/HeartIndividualBody";
import PropTypes from "prop-types";

const Card = styled.div`
  padding: 20px;
  position: fixed;  
  top: 70px;
  left: 200px;
  width: calc(100% - 390px);
  margin: 0px;
  height: calc(100% - 70px);
  float: left;
  overflow: auto;
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
  .bodywrap {
      display: flex;
  }
  background-color: ${surface};
    button {
        margin-bottom: 10px;
        margin-left: 10px;
    }
`;

class HeartIndividual extends Component {
    constructor(props) {
        super(props);
        this.state={
            patientInfo: '',
            system_patient_id: '',
        }
    }

    selectPatient = (patientInfo) => {
        this.setState({
            patientInfo: patientInfo,
            system_patient_id: patientInfo.system_patient_id
        });
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
                    <div className="title">心胸比（個別）</div>
                    <HeartIndividualBody
                        patientInfo={this.state.patientInfo}
                    />
                </Card>
            </>
        )
    }
}

HeartIndividual.propTypes = {
    history: PropTypes.object
};
export default HeartIndividual