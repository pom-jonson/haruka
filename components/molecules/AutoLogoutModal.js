import React, { Component } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { onSecondaryDark } from "../_nano/colors";

const RemainingTime = styled.div`
  font-family: NotoSansJP;
  // font-size: 12px;
  line-height: 1.33;
  letter-spacing: 0.4px;
  color: ${onSecondaryDark};
  padding: 4px 4px 4px 0;
  margin: 0;
  font-size: 2.25rem;
  text-align: center;
`;

class AutoLogoutModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      remainingTime : 0,
      timer : undefined,
      visible : false
    }

  }
  componentDidMount() {
    this.setState({
      remainingTime : this.props.remainingTime,
      visible: this.props.visible,
      timer: setInterval(() => {
        this.countDown();
      }, 1000),
    });

  }

  countDown() {
    let remainingTime = this.state.remainingTime;
    remainingTime--;
    if( remainingTime == 0) return;
    this.setState({
      remainingTime : remainingTime
    }); 

  }

  formatSecond(sec, initTime) {
    if (sec <= 0) {
      sec = initTime;
    }
    return ((sec / 60) | 0) + ":" + ("00" + (sec % 60)).slice(-2);
  }

  callRender =  (p_remainingTime, p_visible) => {
    this.setState({
      remainingTime: p_remainingTime,
      visible: p_visible
    })
  };
  
  callVisible = (p_visible) => {
    this.setState({
      visible: p_visible
    });
  }

  render() {
    return (
      <Modal
        show={this.state.visible}
        onHide={this.props.closeAutoLogoutModal}
        id="autologout_dlg"
        centered
        size="sm"
        className="auto-logout-modal"
      >
        <Modal.Header>
          <Modal.Title>強制ログアウト</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="auto-logout">
            <RemainingTime>
              ログアウトまで {this.formatSecond(this.state.remainingTime, 0)}
            </RemainingTime>
          </div>
        </Modal.Body>
        {/*<Modal.Footer />*/}
      </Modal>
    );
  }
}

AutoLogoutModal.defaultProps = {
  visible: false
};
AutoLogoutModal.propTypes = {
  remainingTime: PropTypes.number,
  warningTime: PropTypes.number,
  visible: PropTypes.bool,
  closeAutoLogoutModal: PropTypes.func

};

export default AutoLogoutModal;
