import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import DialSideBar from "../DialSideBar";
import DialPatientNav from "../DialPatientNav";
import * as methods from "../DialMethods";
import InfectionBody from "./InfectionBody";
import PropTypes from "prop-types";

const Card = styled.div`
  padding: 1.25rem;
  position: fixed;  
  top: 70px;
  left: 200px;
  width: calc(100% - 390px);
  margin: 0px;
  height: calc(100vh - 4.375rem);
  float: left;
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 0.3rem #69c8e1;
  }
  .bodywrap {
      display: flex;
  }
  
  background-color: ${surface};
    button {
        margin-bottom: 0.625rem;
        margin-left: 0.625rem;
    }
`;

class Infection extends Component {
    constructor(props) {
        super(props);
        Object.entries(methods).forEach(([name, fn]) =>
            name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
        );
        this.state={
            patient: {},
            patient_name: "",
            modal_data: {},
            commonCodeData: []
        }
    }

    selectPatient = (patient) => {
        this.setState({
            patientInfo: patient
        });
    };

    render() {
        let code_arr = {};
        this.state.commonCodeData.map((item)=>{
            code_arr[item.code] = item.name;
        });

        return (
            <>
                <DialSideBar                
                    onGoto={this.selectPatient.bind(this)}
                    history = {this.props.history}
                />
                <DialPatientNav
                    patientInfo={this.state.patientInfo}
                    history = {this.props.history}
                />
                <Card>
                    <div className="title">感染症</div>
                    <InfectionBody
                        patientInfo={this.state.patientInfo}
                    />
                </Card>
            </>
        )
    }
}

Infection.propTypes = {
    history: PropTypes.object
};
export default Infection