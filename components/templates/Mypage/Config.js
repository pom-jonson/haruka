import React from "react";
import styled from "styled-components";
import Card from "../../atoms/Card";
import Button from "../../atoms/Button";
import * as methods from "./methods";
import InputWithLabel from "../../molecules/InputWithLabel";
import Context from "../../../helpers/configureStore";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import auth from "~/api/auth";

const Wrapper = styled.div`
  height: 100vh;
  overflow: hidden;
`;

const Label = styled.div`
  font-size: 1.125rem !important;
  width: 100%;
  margin-top: 0px;
  padding-bottom: 10px;
`;

const CenterBox = styled.div`
  position: absolute;
  top: 75%;
  left: 50%;
  padding: 20px 30px;
  transform: translate(-50%, -50%); 
  overflow: hidden;
  ${Card}, .warning {
    width: 600px;
  }

  input::-ms-clear {
    visibility: hidden;
  }

  input::-ms-reveal {
    visibility: hidden;
  }

  button {
    width: 100px;
    height: 40px;
    background: #cc0000;
    span {
      color: #ffffff;
      font-size: 1rem;
      font-weight: normal;
    }
    border-radius: 0;
  }
  button:hover {
    background: #e81123;
    span {
      color: #ffffff;
    }
  }

  .div_password{
    border-top: 1px solid rgb(200,200,200);
    padding-top: 20px;
  }
  .div_update_button{
    border-top: 1px solid rgb(200,200,200);
    padding-top: 10px;
    margin-top: 10px;
  }
  .div_error_msg_1, .div_error_msg_2{
    color: #FF6633;
    padding-left: 20px;
  }
  .password-area {
    label {
      white-space: pre-line;
    }
  }
  .div_notify{
    border: 1px solid rgb(200,200,200);
    padding: 20px;
    margin: 0 auto;
    text-align: center;
    width: 100%;
    margin-bottom: 20px;
  }
  label{
    font-size: 1rem;
    width: 215px;
  }
  .warning{
    width: 100%;
  }
  .div_return_fail{
    color: #FF6633;
  }
`;


class Config extends React.Component {

  updatePassword = methods.updatePassword.bind(this);  

  constructor(props) {
    super(props);
    this.state = {
      old_password: "",
      password: "",
      password_confirm:"",
      error_msg_1: "",
      error_msg_2: "",
      error_msg: "",
      return_type: "",
      isUpdateConfirmModal: false,
      confirm_message:""
    };
  }

  componentDidMount() {
      auth.refreshAuth(location.pathname+location.hash);

  }

  handleChange =(name, e)=>{
      switch(name) {
          case 'old_password':
              this.setState({old_password: e.target.value});
              break;
          case 'password':
              this.setState({password: e.target.value});
              break;
          case 'password_confirm':
              this.setState({password_confirm: e.target.value});
              break;
      }
  }
  // handleChange = key => ({ target: { value } }) => {
  //   this.setState({ [key]: value });
  // };

  handleKeyPressed = e => {
    if (e.keyCode === 13) {
      document.getElementById("password_button").focus();
    }
  };

  handleBlur = () => {

  }

  handleLogin = async () => {
    this.setState({error_msg : ""});
    if (this.state.old_password === "") {
      this.setState({error_msg_1 : "パスワードを入力してください"});
      return;
    } else {
      this.setState({error_msg_1 : ""});      
    }
    if (this.state.password === "" || this.state.password_confirm === "") {
      this.setState({error_msg_2 : "新しいパスワードが再入力と一致していません。再度入力してください"});
      return;
    }else if(this.state.password !== this.state.password_confirm) {
      this.setState({error_msg_2 : "新しいパスワードが再入力と一致していません。\n再度入力してください"});
      return;
    }else{
      this.setState({error_msg_2 : ""});      
    }
    this.setState({
      isUpdateConfirmModal : true,
      confirm_message: "設定を更新してよろしいですか?",
    });
  };

  changePassword = () => {
    this.updatePassword(this.state);
    document.getElementsByClassName("password-area")[0].getElementsByTagName("input")[0].value = "";
    document.getElementsByClassName("password-area")[1].getElementsByTagName("input")[0].value = "";
    document.getElementsByClassName("password-area")[2].getElementsByTagName("input")[0].value = "";
    this.setState({
      old_password: "",
      password: "",
      password_confirm:"",
      error_msg_1: "",
      error_msg_2: "",
      error_msg: "",
      return_type: "",
      isUpdateConfirmModal: false,
      confirm_message: "",
    });
  };

  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      confirm_message: "",
    });
  }
  
  render() {
    return (
      <Wrapper>
        <CenterBox>
          <div className="container">
            <Card className={`p-3`}>          
            <Label>ユーザー設定</Label>
            {this.state.error_msg && this.state.return_type === "success" && (
                <div className="mt-3 ml-auto mr-auto warning">
                  <div className="div_notify" role="alert">
                    {this.state.error_msg}
                  </div>
                </div>
              )}  
            {this.state.error_msg && this.state.return_type === "fail" && (
              <div className="mt-3 ml-auto mr-auto warning div_return_fail">
                <div className="div_notify" role="alert">
                  {this.state.error_msg}
                </div>
              </div>
            )} 
            <div className="mb-3 password-area">
              <InputWithLabel
                label="現在のパスワード"
                type="password"
                getInputText={this.handleChange.bind(this, "old_password")}
                onKeyPressed={this.handleKeyPressed}
                value={this.state.old_password}   
                id="old_password"    
                onBlur={this.handleBlur}        
              />  
              {this.state.error_msg_1 !== "" && (
                <div className="mt-3 ml-auto mr-auto warning">
                  <div className="div_error_msg_1" role="alert">
                    {this.state.error_msg_1}
                  </div>
                </div>
              )}           
              </div>
              <div className="mb-1 div_password password-area">
                <InputWithLabel
                  label="新しいパスワード"
                  type="password"
                  getInputText={this.handleChange.bind(this, "password")}
                  onKeyPressed={this.handleKeyPressed}
                  value={this.state.password}  
                  id="password"  
                  onBlur={this.handleBlur}             
                />                 
              </div>
              <div className="mb-1 password-area">
                <InputWithLabel
                  label={"新しいパスワード\n(確認のため再入力)"}
                  type="password"
                  getInputText={this.handleChange.bind(this, "password_confirm")}
                  onKeyPressed={this.handleKeyPressed}
                  value={this.state.password_confirm}  
                  id="password_confirm"   
                  onBlur={this.handleBlur}                              
                />                 
              </div>
              {this.state.error_msg_2 !== "" && (
                <div className="mt-3 ml-auto mr-auto warning">
                  <div className="div_error_msg_2" role="alert">
                    {this.state.error_msg_2}
                  </div>
                </div>
              )}                
              <div className="text-right div_update_button">
                <Button onClick={this.handleLogin} id="password_button">
                  更新
                </Button>
              </div>
              </Card>
          </div>
        </CenterBox>
        {this.state.isUpdateConfirmModal !== false && (
            <SystemConfirmJapanModal
                hideConfirm= {this.confirmCancel.bind(this)}
                confirmCancel= {this.confirmCancel.bind(this)}
                confirmOk= {this.changePassword}
                confirmTitle= {this.state.confirm_message}
            />
        )}
      </Wrapper>
    );
  }
}
Config.contextType = Context;

export default Config;
