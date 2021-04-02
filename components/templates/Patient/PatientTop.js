import React, { Component } from "react";
import PropTypes from "prop-types";
import PatientNav from "../../organisms/PatientNav";

class PatientTop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patientInfo: {}
    };
  }

  componentDidMount() {
    this.setState({
      patientInfo: this.props.patientInfo
    });
  }

  render() {
    return (
      <>
        <PatientNav
          patientId={this.props.patientId}
          patientInfo={this.state.patientInfo}
        />
      </>
    );
  }
}

PatientTop.propTypes = {
  patientId: PropTypes.number,
  patientInfo: PropTypes.object
};

export default PatientTop;
