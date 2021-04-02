import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Button from "../atoms/Button";
import FormWithLabel from "../molecules/FormWithLabel";
import axios from "axios";
import Context from "~/helpers/configureStore";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";

class LoginModal extends Component {
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
    document.getElementById("login_modal_user_id").focus();
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
      document.getElementById("login_modal_password-area").focus();
    }
  };

  handleLogin = async () => {
    const { id, password } = this.state;
    const { data, status } = await axios.post("/app/api/v2/auth/login", {
      id,
      password,
    })
    .catch(() => {
      this.setState({
        errMsg: "ログインに失敗しました。IDとパスワードを確認してください。"
      });
      return;
    }).finally(()=>{
    });
    if( !(status == 200 && data !== undefined) ) {
    this.setState({
      errMsg: "ログインに失敗しました。IDとパスワードを確認してください。"
    });
    return;
  }
    if (this.props.from_source == "dialmain") {
      this.props.handleLogIn(this.state);
      return ;
    }
  sessApi.remove(CACHE_SESSIONNAMES.LOCK_SCREEN);
   this.props.closeModal();
  };
  onHide = () => {};

  render() {  
    let sessionHaruka = sessApi.getObject(CACHE_SESSIONNAMES.HARUKA);

    return  (
      <Modal show={true} id="login_dlg" className={`${this.props.from_source == "dialmain" ? "master-modal":""} custom-modal-sm login-modal`} onHide={this.onHide}>
        <Modal.Header>
          <Modal.Title>
            {sessionHaruka != null && sessionHaruka.name !== undefined && (
              <span>{sessionHaruka.name}がログイン中</span>
            )}
            {this.props.from_source == "dialmain" && (
              <span>ログインしてください。</span>
            )}
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
              id="login_modal_user_id"
            />
          </div>
          <div className="mb-2">
            <FormWithLabel
              type="password"
              label="パスワード"
              onChange={this.handleChange("password")}
              onKeyPressed={this.handleKeyPressed}
              value={this.state.password}
              id="login_modal_password-area"
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
          {this.props.from_source == "dialmain" && (
            <Button className="cancel-btn" onClick={this.props.closeModal} >キャンセル</Button>
          )}
          <Button className={this.state.success == 1 ? "red-btn show-disable" : "red-btn login-show"} onClick={this.handleLogin} id="login-seat-button">ログイン</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

LoginModal.contextType = Context;

LoginModal.propTypes = {
  closeModal: PropTypes.func,
  closeLogin: PropTypes.func,
  handleLogIn: PropTypes.func,
  from_source:PropTypes.string
};

export default LoginModal;