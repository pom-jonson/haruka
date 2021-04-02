import React, { Component } from "react";
import PropTypes from "prop-types";
import DialFamilyBody from "~/components/templates/Dial/DialFamilyBody";

class DialFamily extends Component {
  constructor(props) {
      super(props);
  }
  render() {
    return (
      <>
           <DialFamilyBody 
                history={this.props.history}
                type="page"
           /> 
      </>
    )
  }
}
DialFamily.propTypes = {
    history: PropTypes.object
};

export default DialFamily