import React, { Component } from "react";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import auth from "~/api/auth";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import icon from "../_demo/logout.png";

const Background = styled.div`
  background-color: ${colors.secondary};
  cursor: pointer;
  display: inline-block;
  text-align: center;
  width: 48px;
  line-height: 48px;
  &:hover {
    background-color: ${colors.secondary600};
  }

  img {
    width: 25px;
  }
`;
class Logout extends Component {
  constructor(props) {
    super(props);
  }

  exitFullscreen = () => {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
  };

  signOut = () => {
    if (confirm("ログアウトします")) {
      // const $resetState = useContext(Context);
      this.context.$resetState(0, "");
      let conf_data = JSON.parse(window.sessionStorage.getItem("init_status")).conf_data;
      if (conf_data.logout_page_fullscreen_control != 1) {
        this.exitFullscreen();
      }
      auth.signOut();
      window.location.reload(true);
    }
  };

  render() {
    return (
      <Background onClick={this.signOut}>
        <img src={icon} />
      </Background>
    );
  }
}

Logout.contextType = Context;

Logout.propTypes = {
  history: PropTypes.object
};

export default withRouter(Logout);
