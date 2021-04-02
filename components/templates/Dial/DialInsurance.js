import React, { Component } from "react";
import PropTypes from "prop-types";
import DialInsuranceBody from "~/components/templates/Dial/DialInsuranceBody";

class DialInsurance extends Component {
  constructor(props) {
      super(props);
  }
  render() {
    return (
      <>
           <DialInsuranceBody 
                history={this.props.history}
                type="page"
           /> 
      </>
    )
  }
}
DialInsurance.propTypes = {
    history: PropTypes.object
};

export default DialInsurance