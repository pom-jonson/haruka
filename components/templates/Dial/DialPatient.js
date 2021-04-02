import React, { Component } from "react";
import PropTypes from "prop-types";
import PatientInfoEditBody from "~/components/templates/Dial/Board/molecules/PatientInfoEditBody";

class DialPatient extends Component {
  constructor(props) {
      super(props);
  }
  render() {
    return (
      <>
           <PatientInfoEditBody 
                history={this.props.history}
                type="page"
           /> 
      </>
    )
  }
}
DialPatient.propTypes = {
    history: PropTypes.object
};

export default DialPatient