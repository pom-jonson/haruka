import React, { Component } from "react";
import PropTypes from "prop-types";
import DialEmergencyContactBody from "~/components/templates/Dial/DialEmergencyContactBody";

class DialEmergencyContact extends Component {
  constructor(props) {
      super(props);
  }
  render() {
    return (
      <>
           <DialEmergencyContactBody 
                history={this.props.history}
                type="page"
           /> 
      </>
    )
  }
}
DialEmergencyContact.propTypes = {
    history: PropTypes.object
};

export default DialEmergencyContact