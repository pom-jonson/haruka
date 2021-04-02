import React, { Component } from "react";
import DialSideBar from "../DialSideBar";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import DialPatientNav from "../DialPatientNav";
import InsulinBody from "./InsulinBody";
import PropTypes from "prop-types";

const Card = styled.div`
  position: fixed;  
  top: 70px;
  width: calc(100% - 390px);
  left: 200px;
  margin: 0px;
  height: 100vh;
  float: left;
  background-color: ${surface};
  padding: 20px;  
  .left{
    float:left;
  }
  .right{
    float:right;
  }
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
  .footer {
    margin-top: 10px;
    text-align: center;
    clear:both;
  }
  .flex{
    display:flex;
  }
  .history, .context{
    height: calc( 50vh - 11rem);
    width:100%;
  }
  .sub_title{
    padding-top:20px;
    clear: both;
  }
  .right_area{
    position:absolute;
    right:1rem;
    cursor: pointer;
  }
`;

class Insulin extends Component {
  constructor(props) {
      super(props);
      this.state = {
      }
  }

    selectPatient = (patientInfo) => {
        this.setState({
            patientInfo: patientInfo
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
          <div className="title">インスリン管理</div>
          <InsulinBody
              patientInfo={this.state.patientInfo}
          />
        </Card>
      </>
    )
  }
}

Insulin.propTypes = {
  history: PropTypes.object
}
export default Insulin