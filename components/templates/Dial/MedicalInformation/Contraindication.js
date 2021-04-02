import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import DialSideBar from "../DialSideBar";
import DialPatientNav from "../DialPatientNav";
import * as methods from "../DialMethods";
import ContraindicationBody from "./ContraindicationBody";
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
  overflow-y: auto;
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

class Contraindication extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
        name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );             
    this.state={
    }
  }

  selectPatient = (patient) => {
      this.setState({
          patientInfo: patient
      });
  };

  render() {

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
              <div className="title">禁忌薬</div>
              <ContraindicationBody
                  patientInfo={this.state.patientInfo}
              />
        </Card>
      </>
    )
  }
}

Contraindication.propTypes = {    
  history: PropTypes.object
};

export default Contraindication