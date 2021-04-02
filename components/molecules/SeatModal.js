import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import LoginModal from "./LoginModal";
import { CACHE_SESSIONNAMES } from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import auth from "~/api/auth";
import { withRouter } from "react-router-dom";
import axios from "axios";

const MenuModalBox = styled.div`

  width: 100vw;
  left: calc(-100vw + 190px);
  top: 0px;
  border: 2px solid rgb(110,110,110);
  margin: 0px;
  height: 100vh;  
  position: absolute;  
  background-color: black;
  .title {
    position: absolute;
    top: 50%;
    left: 45%;
    color: white;
  }

`;

class MenuModal extends Component {
  static propTypes = {
    history: PropTypes.object
  }; 
  constructor(props) {
    super(props);
    this.state = {
      isLoginModal: false,
        timer_finisth: false,
    };
    this.timer = null;
    this.timer_form = null;
    this.screensaver_limit = 0;
    this.screensaver_form_limit = 0;
    this.times = 60*1000;
  }

  async componentDidMount() {
      let path = "/app/api/v2/management/config/get";
      let { data } = await axios.post(path);
      this.screensaver_limit = data.screensaver_limit !== undefined && data.screensaver_limit != null ? parseInt(data.screensaver_limit) : 60; // デフォルトは60分
      this.screensaver_form_limit = data.screensaver_form_limit !== undefined && data.screensaver_form_limit != null ? parseInt(data.screensaver_form_limit) : 10; // デフォルトは10秒
      this.timer=setTimeout(() => {
          this.forceLogout();
      }, this.screensaver_limit * this.times);
  }
  
  componentWillUnmount (){
      clearTimeout(this.timer);
      clearTimeout(this.timer_form);
  }

  forceLogout() {
      clearTimeout(this.timer);
      clearTimeout(this.timer_form);
      auth.signOut();
      window.sessionStorage.setItem("logout_msg", "離席状態で" + this.screensaver_limit +"分経過したため、ログアウトされました");
      this.props.onCloseModal();
      setTimeout(()=> {
          this.props.history.replace("/");
      }, 1000);
  }

  openLodginModal = () => {
    clearTimeout(this.timer);
    clearTimeout(this.timer_form);
      this.timer_form = setTimeout(() => {
          this.retime();
      }, this.screensaver_form_limit * 1000);
    if (this.state.isLoginModal == true) return;
      this.setState({isLoginModal: true});
  };

  onCloseModal = () => {
    this.props.onCloseModal();
  }

  closeModal = () => {
    this.setState({isLoginModal: false});
    this.props.onCloseModal();
  };

  closeLogin = () => {
    this.setState({isLoginModal: false});
    this.timer=setTimeout(() => {
        this.forceLogout();
    }, this.screensaver_limit * this.times);
  };

    retime = () => {
        clearTimeout(this.timer_form);
      this.closeLogin();
  };

  render() {
    const sessionHaruka = sessApi.getObject(CACHE_SESSIONNAMES.HARUKA);
 
    return (
      <MenuModalBox
        className="content"
        onMouseMove={this.openLodginModal}
        onMouseDown={this.openLodginModal}
        onKeyDown={this.openLodginModal}
        id="calc_dlg"
      >
          {sessionHaruka != null && sessionHaruka.name !== undefined && (
              <div className="title">
                  {sessionHaruka.name}がログイン中
              </div>
          )}
          {this.state.isLoginModal && (
          <LoginModal
          closeModal={this.closeModal}
          closeLogin={this.closeLogin}
        />
        )}
      </MenuModalBox>
    );
  }
}

MenuModal.propTypes = {
  onCloseModal: PropTypes.func,
  onGoto: PropTypes.func,
    history: PropTypes.object
};
export default withRouter(MenuModal);
// export default MenuModal;
