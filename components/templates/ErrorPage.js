import React from "react";
import { withRouter } from "react-router-dom";

class ErrorPage extends React.Component {
  state = {
  };
  render() {
    return (
      <div>{this.state.error.length}</div>
    );
  }
}
export default withRouter(ErrorPage);