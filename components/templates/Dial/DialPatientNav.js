import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import LargeUserIcon from "../../atoms/LargeUserIcon";
import { surface } from "../../_nano/colors";
import * as colors from "../../_nano/colors";
import {formatJapan, formatDateLine} from "~/helpers/date";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import {Dial_tab_index} from "~/helpers/dialConstants";
import Clock from "~/components/templates/Dial/Board/Clock";

const Wrapper = styled.div`
  // background-color: ${colors.background};
  position: fixed;
  top: 0px;
  width: calc(100% - 390px) !important;
  left: 200px;
  z-index: 100;
  height: 70px;
  background: #3f1040;
  color: white;
  margin-left: 1px;

  .flex {
    display: flex;
    margin: 0 !important;
  }

  .row {
    margin: 0;
  }

  dl {
    margin-top: 0;
  }

  .modal-dialog {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    max-width: 70%;
  }
  .clock-area {
    width:12rem;
    .cur-date-time {
      font-size: 1.2rem;
      text-align: right;
    }
    .clock {
      padding-top: 0.5rem;
      font-size: 1rem;
      text-align: right;
    }
  }
`;

const PatientCardWrapper = styled.div`
  border-radius: 4px;
  box-shadow: 1px 1px 0 0 rgba(223, 223, 223, 0.5);
  background-color: ${surface};
  width: 100%;
`;

const WrapperChild = styled.div`
  background-color: ${colors.surface};
  border-radius: 4px;
  padding: 0;
  position: relative;

  .fa-5x {
    font-size: 4.06rem;
  }

  .name-area {
    min-width: 200px;
    max-width: 33rem;
    margin-right: 20px;
  }

  .patient-info {
    font-size: 0.875rem;
    margin: 0 10px;
    line-height: 1;

    div {
      font-weight: 500;
    }

    span {
      font-weight: normal;
    }
  }

  .blood-type {
    margin: 8px 0;
    span {
      font-size: 0.812rem;
      margin-left: 16px;
      &.rh {
        margin-left: 0;
        margin-right: 16px;
      }
    }
  }

  .unit {
    font-size: 0.75;
    margin-left: 8px;
  }

  .bmi {
    font-size: 0.812;
    margin-right: 8px;
  }

  .icon {
    border-radius: 50%;
    display: inline-block;
    text-align: center;
    margin-right: 8px;
    width: 20px;
    height: 20px;
    position: relative;
  }

  .invitor_number {
    margin-right: 17px;
    margin-left: auto;
    color: rgb(255,127,39);
  }

  img {
    width: 20px;
    vertical-align: top;
  }
`;

const Flex = styled.div`
  display: block;

  .float-left{
    float: left;
  }

  .div-name{
    font-size: 1.62rem;
  }

  .button-group{
    padding-top: 5px;
    display: inline-flex;
    float: left;
    margin-top: 12px;
    p{
        cursor: pointer;
        margin-right: 5px;
        border-width: 2px;
        border-style: solid;
        border-color: white;
        border-image: initial;
        float: left;
    }
  }

  .circle {
    width: 35px;
    height: 35px;
    font-size: 1.25rem;
    border-radius: 35px;
    padding: 0px 5px;
    background: none;
  }  

  .float-right{
    float:right;
  }
  .nav-label{
    width:80px;
    text-align:right;
    margin-right: 5px;
    display: inline-block;
  }

  .nav-div{
    padding:2px;
    font-size:1rem;
  }

  .flex-base {
    display: flex;
    align-items: baseline;
    position: absolute;
    top: 8px;
    right: 8px;
  }

  .age-birthday{
    margin-top: 4px;
    margin-right: 0;
  }

  svg{
    float:left;
    margin: 10px auto;
    font-size: 3.125rem !important;
    margin-left: 10px;
    margin-right: 20px;
  }

  .div-patient-info{
    float:left;
  }

  .div-insurance{
    margin-top: 12px;
    margin-left: 7px;
    font-size: 0.875rem;
  }

  .div-left-side{    
    float: left;
    margin: 12px 15px 5px 10px;

    select{
      width: 120px;
    }

    .label-title{
      width: 0px;
    }
  }

  .login-name{
    float: right;
    margin: 10px auto;
    margin-right: 10px;
    div{
        text-align: center;
    }
    p{
        margin-bottom: 5px;
    }
  }

  .div-patient-name{
    float:left;
    margin: 15px auto;
  }

  .div-right-side{
    width: 140px;
    margin: 15px 10px;

    .btn-prof1{
      border: 1px solid #aaa;      
      width: 62px;
      float: left;      
      min-width: 50px;
      margin-bottom: 4px;
      background-color: #ddd;

      span{
        color: black;
      }
    }

    .btn-prof2{
      border: 1px solid #aaa;
      float: left;
      width: 62px;
      min-width: 50px;   
      background-color: #ddd;

      span{
        color: black;
      }   
    }

    .btn-karte{
      float: right;
      height: 76px;
      width: 70px;
      min-width: 50px;
      padding: 4px 8px;
      background-color: rgb(241,86,124);

      span{
        font-size: 0.875rem;
      }
    }
  }
`;

const ContextMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    left: 0px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 0px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    z-index: 300;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: normal;
    line-height: 1.2rem;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    border-bottom: 1px solid #cfcbcb;
    div {
      padding: 0.75rem;
    }    
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 0.5rem;
  }
  .blue-text {
    color: blue;
  }
`;

const TooltipMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
    width: 35rem;
    opacity: 0.8;
    border: 2px solid #807f7f;
    border-radius: 12px;
  }
  .tooltip-item{
    display: flex;
  }
  .item-title{
    width: 7rem;
    text-align: right;
    padding: 5px 6px !important;
  }
  .item-content{
    width: 13rem;
    word-break: break-all;
  }
  .tooltip-content-area{
    line-height: 1rem;
    background: #050404;
    color: white;
  }
  .context-menu li {
    font-size: 1rem;
    line-height: 1.875rem;
    clear: both;
    color: black;
    cursor: pointer;
    font-weight: normal;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    border-bottom: solid 1px #888;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
    }
  }
  .context-menu li:hover {
    background-color: #3c3c87;
    color: white;
  }
`;

const Tooltip = ({visible,x,y,tooltip_content}) => {
  if (visible) {
    return (
      <TooltipMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div className="tooltip-content-area">
              {tooltip_content['patient_name']!= undefined && tooltip_content['patient_name'] != null && tooltip_content['patient_name'] != "" && (
                <div className="tooltip-item">
                  <div className="item-title">患者氏名:</div>
                  <div className="item-content">{tooltip_content['patient_name']}</div>
                </div>
              )}
              {tooltip_content['kana_name']!= undefined && tooltip_content['kana_name'] != null && tooltip_content['kana_name'] != "" && (
                <div className="tooltip-item">
                  <div className="item-title">カナ氏名:</div>
                  <div className="item-content">{tooltip_content['kana_name']}</div>
                </div>
              )}
            </div>
          </li>
        </ul>
      </TooltipMenuUl>
    );
  } else {
    return null;
  }
};

const ContextMenu = ({visible, x, y,parent,  system_patient_id}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.move_to_doctor_karte(system_patient_id)}>Drカルテに移動</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const blood_type = ['A', 'B', 'O', 'AB', '未設定'];


class DialPatientNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patientList: [],
      schVal:'',
      sort_order:true,
      confirm_message:'',
      confirm_alert_title:'',
    }
    this.change_dial_delete = null;
    this.reload_count = 0;
  }
  
  componentWillUnmount (){
    clearInterval(this.reloadInterval);
  }

  move_to_doctor_karte = (system_patient_id) => {
    var confirm_message = '';
    var confirm_type = '';
    var dial_change_flag = sessApi.getObjectValue('dial_change_flag');
    if (this.state.selected_id == system_patient_id && dial_change_flag !== undefined && dial_change_flag != null && this.change_dial_delete == null) return;
    if(this.change_dial_delete == null && dial_change_flag !== undefined && dial_change_flag != null){
      confirm_message = "登録していない内容があります。\n変更内容を破棄して移動しますか？";
      confirm_type = "change_dial_page";
    }
    if (confirm_message != ''){
      this.setState({
        confirm_message,
        confirm_type,
        go_func:"move_to_doctor_karte",
        func_param:system_patient_id,
        confirm_alert_title:'入力中'
      });
      return;
    } else {
      this.change_dial_delete = null;
    }

    var url = "/dial/board/system_setting";
    var date = sessApi.getObjectValue('for_left_sidebar', 'date');
    if (date == undefined || date == null || date == '') date = formatDateLine(new Date());

    sessApi.setObjectValue("from_print", "schedule_date", date);
    sessApi.setObjectValue("from_print", "system_patient_id", system_patient_id);
    sessApi.setObjectValue("from_print", "tab_id", Dial_tab_index.DRMedicalRecord);
    sessApi.remove('for_left_sidebar');
    setTimeout(()=>{
      this.props.history.replace(url);
    }, 500);
  }

  calcDialHistory = (nMonths) => {
    if (nMonths > 0) {
      let nYear = parseInt(nMonths/12);
      let nMonth = nMonths % 12;
      let res = "";
      if (nYear > 0) {
        res = nYear + "年";
      }
      if (nMonth > 0) {
        res = res + nMonth + "ヶ月";
      }
      return res;
    }
    return "";
  }

  handleClick = (e, patientInfo) => {
    if (patientInfo == undefined || patientInfo == null || !(patientInfo.system_patient_id > 0)) return;
    e.preventDefault();
    // eslint-disable-next-line consistent-this
    var that = this;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({ contextMenu: { visible: false } }, ()=>{
      });
      document.removeEventListener(`click`, onClickOutside);
    });
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({contextMenu: { visible: false }}, ()=>{
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    document
      .getElementById("patient-list")
      .addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: { visible: false },
        }, ()=>{
        });
        document
          .getElementById("patient-list")
          .removeEventListener(`scroll`, onScrollOutside);
      });

    this.setState({
      contextMenu: {
        visible: true,
        x: e.clientX - 200,
        y: e.clientY + window.pageYOffset,
        system_patient_id:patientInfo.system_patient_id},
    })
  }

  confirmCancel = () =>{
    this.setState({
      confirm_message:'',
      confirm_alert_title:''
    })
  }

  confirmOk = () => {
    this.confirmCancel();
    if (this.state.confirm_type == 'change_dial_page'){
      this.change_dial_delete = null;
      sessApi.remove('dial_change_flag');
      if (this.state.go_func == 'move_to_doctor_karte'){
        this.move_to_doctor_karte(this.state.func_param);
      }
    }
  }

  editTooltip = async(e, tooltip_type) => {
    if (this.props.patientInfo == null ||
      this.props.patientInfo == undefined ||
      Object.keys(this.props.patientInfo).length <= 0) {
      return;
    }
    if (this.show_patient_name != 1) return;

    let content = this.makeTooltipContent(this.props.patientInfo, tooltip_type);
    this.setState({
      tooltip: {
        visible: true,
        x: e.clientX - 200,
        y: e.clientY+window.pageYOffset + 20,
      },
      tooltip_content:content,
      tooltip_type,
    });
  };

  hideTooltip = () => {
    this.setState({ tooltip: { visible: false} });
  };

  makeTooltipContent = (data, tooltip_type) => {
    let result = [];
    if (tooltip_type == "patient") {
      if(this.show_patient_name == 1) {
        result['patient_name'] = data.patient_name;
        result['kana_name'] = data.kana_name;
      }
    }
    return result;
  };

  getPatientName(patient_name){
    let patientName = patient_name;
    var d = patientName.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {return String.fromCharCode(s.charCodeAt(0) - 0xFEE0)});
    var nLength = d.length;
    let half_i = 0;
    // var kanaregexp = new RegExp('[\uff00-\uff9f]');
    var kanaregexp = /[Ａ-Ｚａ-ｚ０-９]/g;
    if(kanaregexp.test(patientName) != true){
      nLength = nLength * 2;
    } else {
      nLength = 0;
      for (let i = 0; i < patientName.length; ++i) {
        if(kanaregexp.test(patientName[i]) != true){
          nLength += 2;
        } else {
          nLength += 1;
        }
        if (half_i == 0 && nLength > 20){
          half_i = i;
        }
      }
    }
    if (nLength > 20) {
      if (half_i > 0){
        patientName = patientName.substring(0,half_i) + "…";
      } else {
        patientName = d.substring(0,9) + '…';
      }
      this.show_patient_name = 1;
    }
    return patientName;
  }

  UNSAFE_componentWillReceiveProps() {
    this.show_patient_name = 0;
  }

  convertDecimal = (_val, _digits) => {
    if (isNaN(parseFloat(_val))) return "";
    return parseFloat(_val).toFixed(_digits);
  }

  render() {
    const {patientInfo} = this.props;
    let rh = "";
    if (patientInfo != undefined &&
      patientInfo != null &&
      patientInfo.RH != undefined &&
      patientInfo.RH != null) {
      rh = patientInfo.RH == 0 ? "+" : patientInfo.RH == 1 ? "-" : "";
      if (rh != "") rh = "(" + rh + ")";
    }
    return (
      <Wrapper onContextMenu={e => this.handleClick(e, patientInfo)} >
        <PatientCardWrapper>
          <WrapperChild>
            <Flex>
              {patientInfo !== undefined && patientInfo !== null && patientInfo.gender != undefined && patientInfo.gender == 1 ? (
                <LargeUserIcon size="5x" color="#9eaeda" />
              ) : (
                <LargeUserIcon size="5x" color="#f0baed" />
              )}
              <div
                className="name-area float-left"                
                data-toggle="modal"
                data-target="#modal-sample"
                onMouseOver={e=>this.editTooltip(e,"patient")}
                onMouseOut={this.hideTooltip}
              >
                {patientInfo !== undefined && patientInfo !== null && (
                  <>
                    <div className={'flex'}>
                      <div style={{paddingRight:"10px"}}>{patientInfo !== undefined && patientInfo !== null && patientInfo.patient_number !== undefined && patientInfo.patient_number}</div>
                      <div className="kana">{patientInfo !== undefined && patientInfo !== null && patientInfo.kana_name !== undefined && this.getPatientName(patientInfo.kana_name)}</div>
                    </div>
                    <div className="div-name">{patientInfo !== undefined && patientInfo !== null && patientInfo.patient_name !== undefined && this.getPatientName(patientInfo.patient_name)}</div>
                  </>
                )}
              </div>

              <div className="patient-info float-left age-birthday">
                <Flex>
                  <div className="nav-div"><span className="nav-label">身長 : </span>{patientInfo !== undefined && patientInfo !== null && patientInfo.tall != undefined && patientInfo.tall + "㎝"}</div>
                  <div className="nav-div">
                    <span className="nav-label">DW :</span>{patientInfo !== undefined && patientInfo !== null && patientInfo.dw != undefined && this.convertDecimal(patientInfo.dw, 1)}
                  </div>
                  <div className="nav-div"><span className="nav-label">血液型 : </span>{patientInfo !== undefined && patientInfo !== null && patientInfo.blood_type != undefined && blood_type[patientInfo.blood_type]+rh}</div>
                </Flex>
              </div>
              <div className="patient-info float-left age-birthday">
                <Flex>
                  <div className="nav-div"><span className="nav-label">生年月日 : </span>{patientInfo !== undefined && patientInfo !== null && patientInfo.birthday != undefined && formatJapan(patientInfo.birthday)}{patientInfo !== undefined && patientInfo !== null && patientInfo.age != undefined && patientInfo.age > 0 && "("+patientInfo.age+"歳)"}</div>
                  <div className="nav-div">
                    <span className="nav-label">性別 : </span>{patientInfo !== undefined && patientInfo !== null && patientInfo.gender != undefined && patientInfo.gender == 2 ? "女" : ""}{patientInfo !== undefined && patientInfo !== null && patientInfo.gender != undefined && patientInfo.gender == 1 ? "男" : ""}
                  </div>
                  <div className="nav-div"><span className="nav-label">透析歴 : </span>{patientInfo !== undefined && patientInfo !== null && patientInfo.dial_history != undefined && patientInfo.dial_history != 0 ? this.calcDialHistory(patientInfo.dial_history) : ""}</div>
                </Flex>
              </div>
              <div className="login-name">
                <Flex>
                  <Clock style={{width:"12rem"}} />
                </Flex>
              </div>
            </Flex>
          </WrapperChild>
        </PatientCardWrapper>
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
        />
        <Tooltip
          {...this.state.tooltip}
          parent={this}
          tooltip_content={this.state.tooltip_content}
          tooltip_type={this.state.tooltip_type}
        />

        {this.state.confirm_message != "" && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.confirmOk}
            confirmTitle= {this.state.confirm_message}
            title = {this.state.confirm_alert_title}
          />
        )}
      </Wrapper>
    )
  }
}

DialPatientNav.contextType = Context;

DialPatientNav.propTypes = {
  getPatientList: PropTypes.func,
  onGoto: PropTypes.func,
  updateFavouriteList: PropTypes.func,
  patientInfo: PropTypes.array,
  history: PropTypes.object,
};
export default DialPatientNav