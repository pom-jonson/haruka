import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import Context from "~/helpers/configureStore";
import Button from "../atoms/Button";
import auth from "~/api/auth";

registerLocale("ja", ja);

const PatientsWrapper = styled.div`
  width: 100%;
  margin: auto;

  button{
    margin-right: 10px;
    background: white;
    border: 1px solid #9e9b9b;
    span{
      color: #212529 !important;
    }
  }

  .active{
    background-color: rgb(105, 200, 225);
    span{
      color:white !important;
    }
  }

  .div-buttons{
    padding: 50px;
  }
`;


class ManageSetting extends Component {

  constructor(props) {
    super(props);    
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.state = {
      staff_category: authInfo.staff_category || 2,
      authInfo: authInfo,
      systemType: "haruka",
    };
  }

  componentDidMount () {
    this.context.$updateAuths(
      this.state.authInfo.feature_auth === undefined
        ? ""
        : this.state.authInfo.feature_auth,
      this.state.authInfo.common_auth === undefined
        ? ""
        : this.state.authInfo.common_auth
    );
    auth.refreshAuth(location.pathname+location.hash);
  }

  onManageSetting = (type) => {
   
    this.setState({
      systemType: type
    });  

    this.context.$updateCurrentSystem(type);
    
  }

  render() {
    return (
      <PatientsWrapper>
        <div className="div-top">
          <div className="div-buttons">
            <p>システム切替 ({this.state.systemType == "dial" ? "透析" : "HARUKA"})</p>
            <Button className={this.state.systemType == "dial" && "active"} onClick={()=>this.onManageSetting("dial")} id="dial-button">
              透析
            </Button>
            <Button className={this.state.systemType == "haruka" && "active"} onClick={()=>this.onManageSetting("haruka")} id="haruka-button">
              HARUKA
            </Button>                
          </div>
        </div>
      </PatientsWrapper>
    );
  }
}
ManageSetting.contextType = Context;
ManageSetting.propTypes = {
  history: PropTypes.object
};

export default ManageSetting;
