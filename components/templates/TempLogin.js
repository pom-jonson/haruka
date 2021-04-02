import React from "react";
import styled from "styled-components";
// import Img from "../_demo/logo.png";
// import Card from "../atoms/Card";
// import Button from "../atoms/Button";
// import FormWithLabel from "../molecules/FormWithLabel";
import PropTypes from "prop-types";
// import auth from "~/api/auth";
import { withRouter } from "react-router-dom";
import Context from "../../helpers/configureStore";
import * as methods from "~/components/methods/StoreMethods";
// import axios from "axios";
// import renderHTML from 'react-render-html';
import { CACHE_LOCALNAMES} from "~/helpers/constants";
import * as localApi from "~/helpers/cacheLocal-utils";
import TempLoginModal from "../molecules/TempLoginModal";


const MenuModalBox = styled.div`

  width: 100vw;
  // left: calc(-100vw + 190px);
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

class TempLogin extends React.Component {
  sendLog = methods.sendLog.bind(this);
  setOperationLog = methods.setOperationLog.bind(this);

  state = {
    id: "",
    password: "",
    errMsg: "",
    message: "",
    // success: 0,
    userName: "", 
    isLoginModal: false
  };

  static propTypes = {
    history: PropTypes.object
  };    

  enterFullscreenMode = () => {
    if (document.body.msRequestFullscreen) document.body.msRequestFullscreen();
    else if (document.body.mozRequestFullScreen)
      document.body.mozRequestFullScreen();
    else if (document.body.webkitRequestFullscreen)
      document.body.webkitRequestFullscreen();
    else if (document.body.requestFullscreen) document.body.requestFullscreen();
  };

  exitFullscreen = () => {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
  };

  async componentDidMount() {              
  }  

  isTemporaryUser = () => {
    let userInfo = JSON.parse(localApi.getValue(CACHE_LOCALNAMES.TEMPORARYUSER));  
    if (userInfo !== null && userInfo !== undefined && userInfo.statusTemporary == 0 ) {
      return true;      
    }
    return false;
  } 

  openLodginModal = () => {
    this.setState({isLoginModal: true});
  }

  closeModal = () => {
    this.setState({isLoginModal: false});    
  }

  closeLogin = () => {
    this.setState({isLoginModal: false});
  }

  render() {    
    // let existTemporaryUser = this.isTemporaryUser();
    let userInfo = JSON.parse(localApi.getValue(CACHE_LOCALNAMES.TEMPORARYUSER));
    return (
      <MenuModalBox
        className="content"
        onMouseMove={this.openLodginModal}
        onMouseDown={this.openLodginModal}
        onKeyDown={this.openLodginModal}
        id="calc_dlg"
      >
        <div className="title">
        {userInfo !== undefined && userInfo !== null && userInfo.name}がログイン中
        </div>        
        {this.state.isLoginModal && (
          <TempLoginModal
          closeModal={this.closeModal}
          closeLogin={this.closeLogin}
          userName={userInfo !== undefined && userInfo !== null && userInfo.name}
        />
        )}
      </MenuModalBox>
    );
  }
}
TempLogin.contextType = Context;

export default withRouter(TempLogin);
