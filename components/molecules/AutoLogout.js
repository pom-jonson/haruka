import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { onSecondaryDark } from "../_nano/colors";
import auth from "~/api/auth";
import { withRouter } from "react-router-dom";

const RemainingTime = styled.div`
  font-family: NotoSansJP;
  font-size: 12px;
  line-height: 1.33;
  letter-spacing: 0.4px;
  color: ${onSecondaryDark};
  padding: 4px 4px 4px 0;
  margin: 0;
`;

class AutoLogout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: undefined,
      remainingTime: -1,
      operationTimeout: 300,
      operationWarningTime: 180
    };
  }
  countDown() {
    if (auth.isAuthenticated()) {
      let newRemainigTime = this.state.remainingTime - 1;
      if (newRemainigTime < 1) {
        let conf_data = JSON.parse(window.sessionStorage.getItem("init_status")).conf_data;
        if (conf_data.logout_page_fullscreen_control != 1) {
          if (document.exitFullscreen) document.exitFullscreen();
          else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
          else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
          else if (document.msExitFullscreen) document.msExitFullscreen();
        }

        auth.signOut();
        this.props.history.replace("/");
      } else {
        this.setState({ remainingTime: newRemainigTime });
      }
      if (newRemainigTime == this.state.operationWarningTime) {
        alert(
          "あと" +
            this.formatSecond(this.state.operationWarningTime) +
            "で\nログアウトします"
        );
      }
    }
  }
  formatSecond(sec) {
    return ((sec / 60) | 0) + ":" + ("00" + (sec % 60)).slice(-2);
  }
  componentDidMount() {
    this.setState({
      remainingTime: this.state.operationTimeout,
      timer: setInterval(() => {
        this.countDown();
      }, 1000)
    });
    document.addEventListener("keydown", () => {
      this.resetCount();
    });
    document.addEventListener("mousemove", () => {
      this.resetCount();
    });
  }
  resetCount() {
    let newRemainigTime = this.state.operationTimeout;
    this.setState({ remainingTime: newRemainigTime });
  }
  componentDidUnmount() {
    clearInterval(this.state.timer);
    document.removeEventListener("keydown", () => {
      this.resetCount();
    });
    document.removeEventListener("mousemove", () => {
      this.resetCount();
    });
  }
  render() {
    if (this.state.remainingTime > this.state.operationWarningTime) {
      return null;
    }
    return (
      <div className="auto-logout">
        <RemainingTime>
          ログアウトまで {this.formatSecond(this.state.remainingTime)}
        </RemainingTime>
      </div>
    );
  }
}

AutoLogout.propTypes = {
  history: PropTypes.object
};

export default withRouter(AutoLogout);
