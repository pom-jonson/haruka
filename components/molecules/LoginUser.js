import React, { Component } from "react";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { onSecondaryDark } from "../_nano/colors";
import SelectorWithLabel from "./SelectorWithLabel";
import SystemConfirmModal from "./SystemConfirmModal";

import { KARTE_STATUS_TYPE } from "~/helpers/constants";
import { canShowKarteStatus } from "~/helpers/checkUrl";

const UserName = styled.div`
  font-family: NotoSansJP;
  font-size: 12px;
  line-height: 1.33;
  letter-spacing: 0.4px;
  color: ${onSecondaryDark};
  padding: 4px 4px 4px 0;
  cursor: pointer;
  display: inline-flex;

  .depart-block{
    margin-left: 15px;
    display: inline-flex;
  }

  .label-title1{
    font-size: 14px;   
    margin-right: 5px;     
  }

  .label-title2{
    font-size: 14px;        
    margin-left: 15px;
    margin-right: 5px;
  }

  .label-content1{
    font-size: 14px;
    font-weight: bold;
    color: blue;
    margin-left: 5px;
  }

  .label-content2{
    margin-left: 5px;
    font-size: 14px;
    font-weight: bold;
    color: rgb(6, 181, 209);
  }

  .label-title{
    font-size: 14px;
  }

  p {
    margin: 0;
  }

  .red {
    color: rgb(241, 86, 124);
  }

  .pullbox {
    height: 30px;
    margin-top: -11.5px;

    .pullbox-title {
      height: 30px;
      width: auto;
      margin-left: 0px;
      margin-right: 10px;
    }

    .pullbox-label {
      width: 120px;

      &:before {
        margin-top: 5px;
      }

      .pullbox-select {
        height: 30px;
        margin-top: 5px;
        width: 120px;
      }
    }
  }
`;

class LoginUser extends Component {
  constructor(props) {
    super(props);
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.state={
      departmentOptions,
      confirm_message: "",
      confirm_type: "",
    } 
  }

  componentDidMount() {
    this.context.$resetState();
    this.setState({
      deparment: this.context.department.name,
      department_code: this.context.department.code,      
    });
  }

  getDepartment = e => {
    this.context.$updateDepartment(e.target.id, e.target.value);
  };

  getKarteStatus = e => {
    this.context.$updateKarteStatus(e.target.id, e.target.value);
  };

  cancelDoctor() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    var path = window.location.href.split("/");    
    path = path[path.length - 1];
    if (this.context.staff_category === 1 && authInfo.staff_category == 1) return;
    if (path == "prescription" || path == "soap" || path == "injection") {
      if (this.context.selectedDoctor.code === 0) {
        this.context.$selectDoctor(true);
        return;
      }      

      /*if (confirm("依頼医の設定を解除しますか?")) {
        this.context.$updateDoctor(0, "");
      }*/      
      this.setState({
        confirm_type: "releaseDoctor",
        confirm_message: "依頼医の設定を解除しますか?"
      });
    } else {
      if (this.context.selectedDoctor.code != 0) {
        // if (confirm("依頼医の設定を解除しますか?")) {
        //   this.context.$updateDoctor(0, "");
        // }
        this.setState({
          confirm_type: "releaseDoctor",
          confirm_message: "依頼医の設定を解除しますか?"
        });            
      }  
    }            
  }  

  confirmOk() {
    this.context.$updateDoctor(0, "");
    this.setState({
      confirm_message: "",
      confirm_type: "",
      soapIndex: 0,
    });
    }

  confirmCancel() {
    this.setState({
      confirm_message: "",
      confirm_type: "",
      soapIndex: 0,
    }); 
  }

  render() {
    const {
      selectedDoctor,
      medical_department_name,
      duties_department_name,
      department,
      karte_status
    } = this.context;

    var path = window.location.href.split("/");
    var presetPath = path[path.length-2] + "/" + path[path.length-1];
    path = path[path.length - 1];

    return (
      <div className="login-user">
        <UserName>
          {selectedDoctor.code > 0 ? (
            <p onClick={() => this.cancelDoctor()}>
              <span className="label-title1">{"依頼医:"}</span>
              <span className="red">{medical_department_name}</span>
              <span className="label-content1">{selectedDoctor.name}</span>
              <span className="label-title2">{"入力者:"}</span>
              <span className="red">{duties_department_name}</span>
              <span className="label-content2">{" " + JSON.parse(window.sessionStorage.getItem("haruka")).name}</span>
            </p>
          ) : (
            <p onClick={() => this.cancelDoctor()}>
              <span className="red">
                {duties_department_name === ""
                  ? medical_department_name
                  : duties_department_name}
              </span>
              <span className="label-content2">{" " + JSON.parse(window.sessionStorage.getItem("haruka")).name}</span>
            </p>
          )}
          <div className="depart-block">
          {path == "prescription" && presetPath != "preset/prescription" && (
            <SelectorWithLabel
              title="診療科"
              options={this.state.departmentOptions}
              getSelect={this.getDepartment}
              value={department.name}
              departmentEditCode={department.code}
            />
          )}
          {path == "soap" && (
            <SelectorWithLabel
              title="診療科"
              options={this.state.departmentOptions}
              getSelect={this.getDepartment}
              value={department.name}
              departmentEditCode={department.code}
            />
          )}
          {path == "injection" && presetPath != "preset/injection" &&(
            <SelectorWithLabel
              title="診療科"
              options={this.state.departmentOptions}
              getSelect={this.getDepartment}
              value={department.name}
              departmentEditCode={department.code}
            />
          )}          
          {canShowKarteStatus(window.location.href.split("/")) && (
            <SelectorWithLabel
              title=""
              options={KARTE_STATUS_TYPE}
              getSelect={this.getKarteStatus}
              value={karte_status.name}
              departmentEditCode={karte_status.code}
            />
          )}
          </div>
        </UserName>
        {this.state.confirm_message !== "" && this.state.confirm_type !== "" && (
          <SystemConfirmModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.confirmOk.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
      </div>
    );
  }
}
LoginUser.contextType = Context;

export default LoginUser;
