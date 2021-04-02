import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/pro-solid-svg-icons";
import $ from "jquery";
import {KARTEMODE} from "~/helpers/constants"

const MCInput = styled.input`
  ime-mode: active;
  width: 93% !important;
`;
const Icon = styled(FontAwesomeIcon)`
  width: 5%;
  margin-left: 5px;
  margin-top: 4px;
`;

class InjectionTableBody extends Component {
  constructor(props) {
    super(props);   
    // const keyName = this.props.isLastRow
    //   ? "inject_keyword"
    //   : "inject_keyword_" +
    //     this.props.indexOfPresData +
    //     "_" +
    //     this.props.indexNum;

    const keyName ="inject_keyword_" + this.props.indexOfPresData + "_" + this.props.indexNum;

    this.state = {
      // show: false,
      keyName: keyName,
      // keyword: "",
      keyword:
        window.localStorage.getItem(keyName) === undefined ||
        window.localStorage.getItem(keyName) === null
          ? ""
          : window.localStorage.getItem(keyName)
    };
    if (window.sessionStorage.getItem("mouseword") !== undefined){
      window.sessionStorage.removeItem("mouseWord");
    }
    if (window.sessionStorage.getItem("createfocus") !== undefined && parseInt(window.sessionStorage.getItem("createfocus")) === 1 ){
      window.localStorage.setItem("prev_focus_key", keyName)
      window.sessionStorage.setItem("createfocus", 0);
    }
  }

  componentDidMount() {   
    this.ieInputErrorFix();
  }

  ieInputErrorFix = () => {
    var el = $("#medicine-input");
    // el[0].onfocus = el[0].onblur = null;

    $(el).on("focus blur", function(e) {
      this.value = $.trim(this.value);
      if (e.type === "focus" && this.createTextRange) {
        var r = this.createTextRange();
        r.moveStart("character", this.value.length);
        r.select();
      }
    });
  };

  scriptLoaded() {
    $("#medicine-input").mcInputEvent();
  }

  loadScript = src => {
    const script = document.createElement("script");

    script.src = src;
    script.async = true;
    script.onload = () => this.scriptLoaded();

    document.body.appendChild(script);
  };

  getKeyword = e => {
    if (window.sessionStorage.getItem("mouseword") !== undefined){
      window.sessionStorage.removeItem("mouseWord");
    }
    this.setState({ 
      keyword: e.target.value,
    });
    window.localStorage.setItem(this.state.keyName, e.target.value);
  };

  handleFocus = () => {
    if (window.sessionStorage.getItem("mouseword") !== undefined && window.sessionStorage.getItem("mouseword") !== null){
      this.setState({
        keyword: window.sessionStorage.getItem("mouseWord")
      }, () => {
        window.sessionStorage.removeItem("mouseWord");
      });
    }
    window.localStorage.setItem("prev_focus_key", this.state.keyName);
  }

  handleKeyPress = e => {
    if (e.key === "Enter") {
      this.props.search(
        this.state.keyword,
        this.props.indexOfPresData,
        this.props.indexNum
      );
      // window.localStorage.setItem(this.state.keyName, "");
    }
  };

  iconClick = () => {
    if (this.context.$getKarteMode(this.props.patientId) == KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合

    this.props.openMedicineBodyParts(this.state.keyName, this.props.indexOfPresData, this.props.indexNum)
  }

  hasPermission = (medicine) => {
    if ( medicine.medicineName != "" && ( medicine.alert_permission == -1 || medicine.duplciate_permission == -1 || medicine.disease_permission == -1)) {      
      return 1;
    }    
    if ( medicine.medicineName != "" && ( medicine.alert_permission == 1 || medicine.duplciate_permission == 1 || medicine.disease_permission == 1)) {     
      return 2;
    }
    return 0;
  }

  // YJ601 薬剤検索欄などに残す必要が無い時にデータが残る不具合
  handleDrop = (e) => {
    e.preventDefault();
    return false;
  }

  render() {    
    const { medicine } = this.props;
    if (document.getElementById('haruka-menu-list') != undefined) {
      if(document.getElementsByClassName('mcinput-injection')[0] != undefined) {
        document.getElementsByClassName('mcinput-injection')[0].blur();
      }
    }
    // const autoFocus =
    //   window.sessionStorage.getItem("prescribe-auto-focus") !== undefined &&
    //   window.sessionStorage.getItem("prescribe-auto-focus") !== null
    //     ? parseInt(window.sessionStorage.getItem("prescribe-auto-focus")) === 1 && window.localStorage.getItem("prev_focus_key") === this.state.keyName
    //     : true;
    const mouseWord = window.sessionStorage.getItem("mouseWord") !== undefined && 
        window.sessionStorage.getItem("mouseWord") !== null ? window.sessionStorage.getItem("mouseWord") : "";
    return (
      <>
        <div className={`medicine ${this.hasPermission(medicine) == 1 && medicine.medicineName != "" ?"usage-permission-reject":this.hasPermission(medicine) == 2 && medicine.medicineName != ""?"usage-permission-allow":""}`}>
          {!medicine.medicineName ? (
            <>              
              {(this.context.$canDoAction(
                this.context.FEATURES.PRESCRIPTION,
                this.context.AUTHS.REGISTER
              ) ||
                this.context.$canDoAction(
                  this.context.FEATURES.PRESCRIPTION,
                  this.context.AUTHS.REGISTER_OLD
                ) ||
                this.context.$canDoAction(
                  this.context.FEATURES.PRESCRIPTION,
                  this.context.AUTHS.REGISTER_PROXY
                ) ||
                this.context.$canDoAction(
                  this.context.FEATURES.PRESCRIPTION,
                  this.context.AUTHS.REGISTER_PROXY_OLD
                )) && 
                this.props.usageName !== "" && (
                <>
                <MCInput
                  id="medicine-input"
                  className="mcinput-injection"
                  type="text"  
                  value={ mouseWord !== undefined && mouseWord !== null && mouseWord.length > 0 ? mouseWord : `${this.state.keyword}`}
                  onChange={this.getKeyword}
                  onKeyPress={this.handleKeyPress}
                  onFocus={this.handleFocus}
                  autoFocus={true}
                  onDrop={e=>this.handleDrop(e)}
                  disabled={this.context.$getKarteMode(this.props.patientId) == KARTEMODE.READ}
                />            
                <Icon 
                  icon={faPencilAlt}
                  onClick={this.iconClick}
                  />
                </>          
              )}            
            </>
          ) : (
            `${medicine.medicineName}`
          )}
        </div>
        {medicine.medicineName != "" && medicine.amount >= 0 ? (
          <div className="unit">
            {medicine.amount}
            {medicine.unit}
          </div>
        ) : (
          <div className="unit" />
        )}
      </>
    );
  }
}
InjectionTableBody.contextType = Context;

InjectionTableBody.propTypes = {
  medicine: PropTypes.object,
  usageName: PropTypes.string,
  indexNum: PropTypes.number,
  search: PropTypes.func,
  indexOfPresData: PropTypes.number,
  indexOfMedicines: PropTypes.number,
  isLastRow: PropTypes.boolean,
  openMedicineBodyParts: PropTypes.func,
  patientId: PropTypes.number,
};

export default InjectionTableBody;