import React from "react";
import auth from "~/api/auth";
import { withRouter } from "react-router-dom";

/** withSecured HOC should be used under Router component directly */
export default Component =>
  withRouter(props => {
    let Secured;
    switch (auth.isAuthenticated()) {
      case true:
        Secured = <Component {...props} />;
        break;
      default:
        props.history.replace("/");
        Secured = <div />;
    }
    return Secured;
  });
