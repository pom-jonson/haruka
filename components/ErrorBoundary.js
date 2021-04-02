import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import auth from "~/api/auth";
import { withRouter } from "react-router-dom";
import { CACHE_SESSIONNAMES, CACHE_LOCALNAMES} from "~/helpers/constants";
import * as localApi from "~/helpers/cacheLocal-utils";
import * as sessApi from "~/helpers/cacheSession-utils";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
    this.debug_mode = 1;
    this.error_mail_send = 0;
    this.display_error=1;
    this.error_msg_1 = "システムのバージョン更新がありました。システムの再読み込みが必要です。再度ログインしてください。";
    this.error_msg_2 = "予期せぬエラーが発生しました。管理者にお問い合わせください。";
  }

    componentDidCatch(error, errorInfo) {
      this.setState({ error, errorInfo });      
  }

  exitFullscreen = () => {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
  };

  errorSend = async () => {
    var init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
    if(init_status !== undefined && init_status != null){
      if(init_status.enable_ordering_karte == 1 || init_status.enable_ordering_karte == "ON") {
        let debug_mode = init_status.debug_mode !== undefined ? init_status.debug_mode : 1;
        this.debug_mode = debug_mode;
        if (this.debug_mode == "ON" || this.debug_mode == "OFF") {
          this.debug_mode = this.debug_mode == "ON" ? 1 : 0;
        }
        if (init_status.error_mail_send !== undefined && init_status.error_mail_send == 1) {
            let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
            axios.post("/app/api/v2/user/send_mail",
                {
                    params: {
                        errorInfo: this.state.errorInfo,
                        authInfo: {name: authInfo.name, ip_addr: authInfo.ip_addr},
                        error_str: this.state.error.toString()
                    }
                });
        }
        
        // window.location.reload();
  
        return this.debug_mode;
      } else {
        let conf_data = init_status.conf_data;
        if (conf_data != null && conf_data.error_display != undefined && conf_data.error_display == "OFF"){
            this.display_error = 0;
            auth.signOut();
            /*axios.defaults.headers.common["Authorization"] = "";
            window.localStorage.removeItem("haruka");
            window.sessionStorage.removeItem("haruka");
            window.sessionStorage.removeItem("dial_setting");
            window.sessionStorage.removeItem("first_login");
            window.sessionStorage.removeItem("medicine_change_history");
            window.sessionStorage.removeItem("force_logout");*/
            
            // const link = document.createElement('a');
            // link.href = '/';
            // document.body.appendChild(link);
            // link.click();
            window.location.reload();
            return;
        } else {
          let debug_mode = init_status.debug_mode !== undefined ? init_status.debug_mode : 1;
          this.debug_mode = debug_mode;
          if (this.debug_mode == "ON" || this.debug_mode == "OFF") {
            this.debug_mode = this.debug_mode == "ON" ? 1 : 0;
          }
          // this.debug_mode=0;
        }
      }
    }
  };


  isTemporaryUser = () => {
    let userInfo = JSON.parse(localApi.getValue(CACHE_LOCALNAMES.TEMPORARYUSER));
    if (userInfo !== null && userInfo !== undefined && (userInfo.statusTemporary == 0 || userInfo.statusTemporary == 1)) {
      return true;
    }
    return false;
  }

  // removeTemporaryUserInfo = () => {
  //   let userInfo = JSON.parse(localApi.getValue(CACHE_LOCALNAMES.TEMPORARYUSER));
  //   userInfo.statusTemporary = 0;
  //   localApi.setValue(CACHE_LOCALNAMES.TEMPORARYUSER, JSON.stringify(userInfo));
  // }


  render() {
    let error_msg = this.error_msg_2;
    if (this.state.errorInfo) {
      document.body.onbeforeunload = null;
      
      let error_string = this.state.error.toString();
      if (error_string.includes("ChunkLoadError") && error_string.includes(".js)")) {
        error_msg = this.error_msg_1;                
      } else if(error_string.includes("Loading chunk") && error_string.includes(".js)")){
        error_msg = this.error_msg_1;                
      } else if(error_string.includes("Loading") && error_string.includes("chunk") && error_string.includes("failed") && error_string.includes(".js)")){
        error_msg = this.error_msg_1;                
      }

      this.errorSend();
      let conf_data = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS)).conf_data;
      if (conf_data.logout_page_fullscreen_control != 1) {
          this.exitFullscreen();
      }

      // ●YJ782 離席/切替機能の調整
      if (this.isTemporaryUser()) {
        let userInfo = JSON.parse(localApi.getValue(CACHE_LOCALNAMES.TEMPORARYUSER));
        userInfo.statusTemporary = 0;
        localApi.setValue(CACHE_LOCALNAMES.TEMPORARYUSER, JSON.stringify(userInfo));
        auth.signOut("reload", userInfo);
      } else {        
        auth.signOut("reload");
      }
      /*axios.defaults.headers.common["Authorization"] = "";
      window.localStorage.removeItem("haruka");
      window.sessionStorage.removeItem("haruka");
      window.sessionStorage.removeItem("dial_setting");
      window.sessionStorage.removeItem("first_login");
      window.sessionStorage.removeItem("medicine_change_history");
      window.sessionStorage.removeItem("force_logout");      
      window.sessionStorage.clear();
      window.localStorage.clear();*/
      return (
        <div>
            {this.display_error?(
                <>
                    {this.debug_mode == 1 ? (
                        <>
                          {error_msg == this.error_msg_1 ? (
                            <>
                              <div className={`pt-5 pt-2`}>
                                  <h2>{error_msg}</h2>
                                  <a href="/">ログインページに戻る</a>
                              </div>
                            </>    
                          ): (
                            <>
                              <h2>システムエラーが発生しました.</h2>
                              <details style={{ whiteSpace: "pre-wrap" }}>
                                  {this.state.error && this.state.error.toString()}
                                  <br />
                                  {this.state.errorInfo.componentStack}
                              </details>
                              <a href="/">再ログイン</a>
                            </>
                          )}
                        </>
                    ) : (
                        <div className={`pt-5 pt-2`}>
                            <h2>{error_msg}</h2>
                            <a href="/">ログインページに戻る</a>
                        </div>
                    )}
                </>
            ):(<></>)}
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.any,
  history: PropTypes.object
};

export default withRouter(ErrorBoundary);
