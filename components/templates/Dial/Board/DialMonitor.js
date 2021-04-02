import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import GraphMonitor from "./molecules/GraphMonitor";
import TreatMonitor from "./molecules/TreatMonitor";
import * as apiClient from "~/api/apiClient";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import {compareTwoObjects} from "~/helpers/dialConstants";

const Wrapper = styled.div`
    height: 100%;
 `;

class DialMonitor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patientInfo:this.props.patientInfo,
      schedule_date:this.props.schedule_date,
    }
    this.timer = undefined;
    this.monitor_interval = 60;//seconds
    this.treatMonitorRef = React.createRef();
    this.graphMonitorRef = React.createRef();
    this.prev_props = JSON.parse(JSON.stringify(this.props));
  }

  shouldComponentUpdate(nextprops, nextstate) {    
    nextprops = JSON.parse(JSON.stringify(nextprops));    
    if (compareTwoObjects(nextprops, this.prev_props) && compareTwoObjects(nextstate, this.state)) return false;
    this.prev_props = JSON.parse(JSON.stringify(nextprops));        
    return true;
  }
  
  componentDidMount(){
    if(this.props.patientInfo === undefined || this.props.patientInfo == null || Object.keys(this.props.patientInfo).length === 0){
      return;
    }
    this.setState({
      patientInfo:this.props.patientInfo,
      system_patient_id: this.props.patientInfo.system_patient_id,
      schedule_date:this.props.schedule_date,
    }, () => {
      this.getRightAreaData();
    })
    this.timer=setInterval(() => {
      this.getRightAreaData();
    }, this.monitor_interval*1000);
  }
  
  componentWillUnmount() {
    clearInterval(this.timer);

    // initialize
    this.timer = null;
    this.monitor_interval = null;
    this.treatMonitorRef = null;
    this.graphMonitorRef = null;

    var html_obj = document.getElementsByClassName("dial_monitor_wrapper")[0];
    if(html_obj !== undefined && html_obj != null){
        html_obj.innerHTML = "";
    }    
  }
  
  getRightAreaData(){
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if (patientInfo == undefined || patientInfo == null) return;
    this.getCurDiseaseInfo();
    this.getInstructionInfo();
  }
  
  isEqual(prev, after){
    if(prev == undefined || after == undefined || prev == null || after == null) return false;
    if (prev.length != after.length) return false;
    var flag = true;
    prev.map((item, index) => {
      if (JSON.stringify(item) != JSON.stringify(after[index])) flag = false;
    });
    return flag;
  }
  
  UNSAFE_componentWillReceiveProps(nextProps) {
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if (patientInfo == undefined || patientInfo == null) return;
    if (this.state.system_patient_id == nextProps.patientInfo.system_patient_id && this.state.schedule_date == nextProps.schedule_date) return;
    this.setState({
      patientInfo:nextProps.patientInfo,
      system_patient_id:nextProps.patientInfo.system_patient_id,
      schedule_date:nextProps.schedule_date,
    }, () => {
      this.getRightAreaData();
    })
  }
  
  refreshScheduleInfo = (patientId, schedule_date) => {
    this.props.refreshScheduleInfo(patientId, schedule_date);
    this.getRightAreaData();
  }
  
  getCurDiseaseInfo = async() => {
    let path = "/app/api/v2/dial/board/Soap/search_disease";
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo === undefined || authInfo == null) path = "/app/api/v2/dial/no_auth/Soap/search_disease";
    await apiClient
      ._post(path, {
        params: {
          is_enabled:1,
          system_patient_id: this.state.system_patient_id,
          date: this.state.schedule_date
        }
      })
      .then((res) => {
        this.setState({
          disease_history:res,
        });
      });
  };
  
  getInstructionInfo = async() => {
    let path = "/app/api/v2/dial/board/Soap/search_instruction";
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo === undefined || authInfo == null) path = "/app/api/v2/dial/no_auth/Soap/search_instruction";
    await apiClient
      ._post(path, {
        params: {
          is_enabled:1,
          system_patient_id: this.state.system_patient_id,
          date: this.state.schedule_date
        }
      })
      .then((res) => {
        if (res.length != 0){
          this.setState({
            instruction_list:res,
          })
        } else {
          this.setState({
            instruction_list:[],
          })
        }
      });
  };
  
  moreDisplay = () => {
    this.graphMonitorRef.current.moreDisplay();
  }
  
  setDisplayZoom = () => {
    this.treatMonitorRef.current.setZoom();
  }
  
  refreshTreatMonitor = () => {
    this.treatMonitorRef.current.getSoapInfo();
  }
  
  render() {    
    return (
      <Wrapper className="dial_monitor_wrapper">
        <GraphMonitor
          ref={this.graphMonitorRef}
          schedule_data={this.props.schedule_data}
          rows_blood={this.props.rows_blood}
          rows_measure={this.props.rows_measure}
          rows_temp={this.props.rows_temp}
          schedule_date={this.props.schedule_date}
          done_inspection = {this.props.done_inspection}
          done_injection = {this.props.done_injection}
          done_dial_pres = {this.props.done_dial_pres}
          saveEditedSchedule = {this.props.saveEditedSchedule}
          done_status = {this.props.done_status}
          disease_history = {this.state.disease_history}
          instruction_list = {this.state.instruction_list}
          getCurDiseaseInfo = {this.getCurDiseaseInfo}
          setDisplayZoom = {this.setDisplayZoom}
          setHandleTempData = {this.props.setHandleTempData}
          instruction_doctor = {this.props.instruction_doctor}
          openLoginModal = {this.props.openLoginModal}
          refreshScheduleInfo = {this.refreshScheduleInfo}
        />
        <TreatMonitor
          ref={this.treatMonitorRef}
          schedule_date={this.props.schedule_date}
          patientInfo={this.props.patientInfo}
          refreshScheduleInfo = {this.refreshScheduleInfo}
          getCurDiseaseInfo = {this.getCurDiseaseInfo}
          moreDisplay = {this.moreDisplay}
          openLoginModal = {this.props.openLoginModal}
        />
      </Wrapper>
    )
  }
}

DialMonitor.contextType = Context;

DialMonitor.propTypes = {
  schedule_data: PropTypes.object,
  patientInfo: PropTypes.object,
  rows_blood: PropTypes.array,
  rows_measure: PropTypes.array,
  rows_temp: PropTypes.array,
  schedule_date: PropTypes.instanceOf(Date),
  refreshScheduleInfo : PropTypes.func,
  done_inspection: PropTypes.array,
  done_injection: PropTypes.array,
  done_dial_pres: PropTypes.array,
  done_status: PropTypes.object,
  saveEditedSchedule: PropTypes.func,
  setHandleTempData : PropTypes.func,
  openLoginModal : PropTypes.func,
  instruction_doctor : PropTypes.string,
};
export default DialMonitor