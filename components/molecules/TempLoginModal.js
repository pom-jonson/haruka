import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Button from "../atoms/Button";
import FormWithLabel from "../molecules/FormWithLabel";
// import axios from "axios";
import { withRouter } from "react-router-dom";
import auth from "~/api/auth";
import Context from "~/helpers/configureStore";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as methods from "~/components/methods/StoreMethods";
import { CACHE_LOCALNAMES} from "~/helpers/constants";
import * as localApi from "~/helpers/cacheLocal-utils";


class TempLoginModal extends Component {
  sendLog = methods.sendLog.bind(this);
  setOperationLog = methods.setOperationLog.bind(this);

  constructor(props) {
    super(props);
    this.state = {
      curFocus: 1,
      id:"",
      password: "",
      errMsg: "",
    }
  }

  
  componentDidMount(){
    document.getElementById("user_id").focus();
  }

  handleChange = key => ({ target: { value } }) => {
    const convertStr = key == "id" ? this.convertStr(value) : value;
    this.setState({ [key]: convertStr });
  };

  convertStr = str => {
    return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
    });
  };

  handleKeyPressed = e => {
    if (e.keyCode === 13 && this.state.id !== "" && this.state.password !== "") {
      document.getElementById("login-seat-button").focus();
    }
  };
  handleKeyPressedId = e => {
    if (e.keyCode === 13) {
      document.getElementById("password-area").focus();
    }
  };

  handleLogin = async () => {
    // const { id, password } = this.state;    

    // // check origin user
    // const { data, status } = await axios.post("/app/api/v2/user/auth", {
    //   id,
    //   password,
    // })
    // .catch(() => {
    //   console.log("#01");
    //   this.setState({
    //     errMsg: "ログインに失敗しました。IDとパスワードを確認してください。"
    //   });
    //   return;
    // }).finally(()=>{
    // });
    // console.log("#02");
    // if( !(status == 200 && data !== undefined && data == true ) ) {
    //   console.log("#03");
    //   this.setState({
    //     errMsg: "ログインに失敗しました。IDとパスワードを確認してください。"
    //   });
    //   return;
    // }
    // console.log("#04");
    // login
    let userInfo = JSON.parse(localApi.getValue(CACHE_LOCALNAMES.TEMPORARYUSER));

    const success = await auth.signIn(this.state);
    if (success) {
      //this.enterFullscreenMode();
      var sessionStorage = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.HARUKA));
      if (sessionStorage.user_number !== userInfo.user_number &&  sessionStorage.name !== "test_master") {
        // sessApi.remove(CACHE_SESSIONNAMES.HARUKA);
        this.setState({
          errMsg: "ログインに失敗しました。IDとパスワードを確認してください。"
        });
        this.context.$resetState(0, "");
        // auth.signOut("temporary_login");
        auth.signOut("");
        this.props.history.replace("/tempLogin");
        return;
      }
      localApi.remove(CACHE_LOCALNAMES.TEMPORARYUSER);
      this.context.$updateTimeout(
        sessionStorage.operationTimeout, 
        sessionStorage.operationWarningTime
      );
      this.context.$updateAuths(
        sessionStorage.feature_auth,
        sessionStorage.common_auth
      );

      // ●YJ777 MySQLに保存するほうの操作ログの改善
      // ・切替モードから本人がログインするときはログインと区別する (・op_screen=一時利用、op_type=利用再開 2: from blackboard)
      this.setOperationLog("login", this.state.id + "がログインした");
      this.sendLog();      
      // this.props.history.replace("/patients");
      this.props.history.replace("/top");
      this.setState({
        // success: 1,
        userName: sessionStorage.name,
        errMsg: ""
      });
    } else {
      this.exitFullscreen();
      this.setState({
        errMsg: "ログインに失敗しました。IDとパスワードを確認してください。"
      });
    }
    
    this.props.closeModal();
  };

  render() {      

    return  (
      <Modal        
        show={true}
        id="login_dlg"
        className="custom-modal-sm login-modal"
      >
        <Modal.Header>
          <Modal.Title>
            <span>{this.props.userName}がログイン中</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="auto-logout">  
          <div className="mb-2">
            <FormWithLabel
              type="text"
              label="利用者ID"
              onChange={this.handleChange("id")}
              onKeyPressed={this.handleKeyPressedId}
              value={this.state.id}
              id="user_id"
            />
          </div>
          <div className="mb-2">
            <FormWithLabel
              type="password"
              label="パスワード"
              onChange={this.handleChange("password")}
              onKeyPressed={this.handleKeyPressed}
              value={this.state.password}
              id="password-area"
            />
          </div>
          </div>          
          {this.state.errMsg && (
              <div className="mt-3 ml-auto mr-auto warning">
                <div className="alert alert-danger" role="alert">
                  {this.state.errMsg}
                </div>
              </div>
            )}
        </Modal.Body>  
        <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeLogin}>閉じる</Button>
            <Button className={this.state.success == 1 ? "red-btn show-disable" : "red-btn login-show"} onClick={this.handleLogin} id="login-seat-button">
              ログイン
            </Button>
        </Modal.Footer>      

      </Modal>
    );
  }
}

TempLoginModal.contextType = Context;

TempLoginModal.propTypes = {
  closeModal: PropTypes.func,
  closeLogin: PropTypes.func,
  userName: PropTypes.string,
  history: PropTypes.object
};

export default withRouter(TempLoginModal);
