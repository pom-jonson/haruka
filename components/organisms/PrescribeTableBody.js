import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import $ from "jquery";
import Context from "~/helpers/configureStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/pro-solid-svg-icons";
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


class PrescribeTableBody extends Component {
  constructor(props) {

    super(props);
    // const keyName = this.props.isLastRow
    //   ? "medicine_keyword"
    //   : "medicine_keyword_" +
    //     this.props.indexOfPresData +
    //     "_" +
    //     this.props.indexNum;
    const keyName ="medicine_keyword_" + this.props.indexOfPresData + "_" + this.props.indexNum;

    this.state = {
      show: false,
      keyName: keyName,
      // keyword: ""
      keyword:
        window.localStorage.getItem(keyName) === undefined ||
        window.localStorage.getItem(keyName) === null
          ? ""
          : window.localStorage.getItem(keyName)
    };
    this.nMouseClick = 0;
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
    document
      .getElementById("prescribe-container")
      .addEventListener("scroll", this.handleScroll);
    const scrollTop =
      window.sessionStorage.getItem("prescribe-container-scroll") != undefined
        ? parseInt(window.sessionStorage.getItem("prescribe-container-scroll"))
        : 0;

    $("#prescribe-container").scrollTop(scrollTop);
  }

  handleScroll = async () => {
    window.sessionStorage.setItem(
      "prescribe-container-scroll",
      $("#prescribe-container").scrollTop()
    );
  };

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

  handleShow() {
    this.props.handleShow(this.props.medicine, this.props.indexNum);
  }

  getKeyword = e => {
    if (window.sessionStorage.getItem("mouseword") !== undefined){
      window.sessionStorage.removeItem("mouseWord");
    }
    this.setState({ 
      keyword: e.target.value,
    });
    window.localStorage.setItem(this.state.keyName, e.target.value);
  };

  handleKeyPress = e => {
    if (e.key === "Enter") {
      this.props.search(
        this.state.keyword,
        this.props.indexOfPresData,
        this.props.indexNum
      );
      // this.setState({keyword:''});
    }
  };

  handleFocus = () => {
    if (window.sessionStorage.getItem("mouseword") !== undefined && window.sessionStorage.getItem("mouseword") !== null){
      this.setState({
        keyword: window.sessionStorage.getItem("mouseWord")
      }, () => {
        window.sessionStorage.removeItem("mouseWord");
      });
    }
    // window.localStorage.setItem("prev_focus_key", this.state.keyName);
  }

  handleMedicineClick = (e) => {
    if(e.type === "contextmenu"){
      this.nMouseClick = 1;
    }
    if(e.type !== "contextmenu"){
      if (this.nMouseClick === 1 ) {
        this.nMouseClick = 0;
      }else{
        if(this.props.medicine.usage_permission !== undefined && this.props.medicine.usage_permission === -1){
          this.props.handleMedicineClick(this.props.indexOfPresData, this.props.indexNum);
        }
      }
    }
  }

  iconClick = () => {
    var is_patient = window.location.href.indexOf("preset") == -1;

    if (this.context.$getKarteMode(this.props.patientId) == KARTEMODE.READ && is_patient) return;   // 「閲覧のみ」を選択した場合

    this.props.openMedicineBodyParts(this.state.keyName, this.props.indexOfPresData, this.props.indexNum)
  }

  hasPermission = (medicine) => {
    if ( medicine.medicineName != "" && (medicine.diagnosis_permission == -1 || medicine.usage_permission == -1 || medicine.period_permission == -1 || medicine.alert_permission == -1 || medicine.duplciate_permission == -1 || medicine.disease_permission == -1)) {      
      return 1;
    }    
    if (medicine.medicineName != "" && (medicine.diagnosis_permission == 1 || medicine.usage_permission == 1 || medicine.period_permission == 1 || medicine.alert_permission == 1 || medicine.duplciate_permission == 1 || medicine.disease_permission == 1)) {     
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
    var is_patient = window.location.href.indexOf("preset") == -1;

    const { medicine } = this.props;
    if (document.getElementById('haruka-menu-list') != undefined) {
      if(document.getElementsByClassName('mcinput-prescription')[0] != undefined) {
        document.getElementsByClassName('mcinput-prescription')[0].blur();
      }
    }
    const mouseWord = window.sessionStorage.getItem("mouseWord") !== undefined && 
        window.sessionStorage.getItem("mouseWord") !== null ? window.sessionStorage.getItem("mouseWord") : "";

    let multi = 1;
    let mainUnit = "";
    let unit_list = [];
    if(medicine.units_list !== undefined) {
      unit_list = medicine.units_list;
    } else if(medicine.units !== undefined) {
      unit_list = medicine.units;
    }
    unit_list.map((val) => {
      if(val.main_unit_flag == 1) {
        mainUnit = val.name;
      }
      if(val.name == medicine.unit) {
        multi = val.multiplier;
      }
    });

    let unit_title = (medicine.amount * multi) + mainUnit;
    return (
      <>
        <div onClick={this.handleMedicineClick} onContextMenu={this.handleMedicineClick} className={`medicine ${this.hasPermission(medicine) == 1?"usage-permission-reject":this.hasPermission(medicine) == 2?"usage-permission-allow":""}`}>
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
                )) && (
                  <>
                <MCInput                  
                  id={this.state.keyName}
                  className="mcinput-prescription"
                  type="text"
                  value={ mouseWord !== undefined && mouseWord !== null && mouseWord.length > 0 ? mouseWord : `${this.state.keyword}`}
                  onChange={this.getKeyword}
                  onKeyPress={this.handleKeyPress}
                  onFocus={this.handleFocus}
                  autoFocus={true}
                  onDrop={e=>this.handleDrop(e)}
                  disabled={this.context.$getKarteMode(this.props.patientId) == KARTEMODE.READ && is_patient}
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
            <span title={`${unit_title}`}>{medicine.amount}{medicine.unit}</span>
          </div>
        ) : (
          <div className="unit" />
        )}
      </>
    );
  }
}
PrescribeTableBody.contextType = Context;

PrescribeTableBody.propTypes = {
  medicine: PropTypes.object,
  handleShow: PropTypes.func,
  handleMedicineClick: PropTypes.func,
  indexNum: PropTypes.number,
  search: PropTypes.func,
  indexOfPresData: PropTypes.number,
  indexOfMedicines: PropTypes.number,
  isLastRow: PropTypes.boolean,
  openMedicineBodyParts: PropTypes.func,
  patientId: PropTypes.number,
};

export default PrescribeTableBody;
