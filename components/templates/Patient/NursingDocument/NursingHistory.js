import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import PatientProgressChart from "~/components/templates/Patient/NursingDocument/PatientProgressChart";
import PatientNursePlan from "~/components/templates/Patient/NursingDocument/PatientNursePlan";
import * as localApi from "~/helpers/cacheLocal-utils";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";

const Wrapper = styled.div`
  width:100%;
  height:100%;
  .panel-menu {
    margin-top:0.5rem;
    display:flex;
    width: 100%;    
    font-size:${props=>(props.font_props != undefined ? (props.font_props + 'rem'):'1rem')};
    font-weight: bold;
    .menu-btn {
      width:100px;
      text-align: center;
      border: 1px solid #aaa;
      background-color: rgba(200, 194, 194, 0.22);
      height: 2rem;
      line-height: 2rem;
      cursor: pointer;
    }
    .active-menu {
      width:100px;
      text-align: center;
      border-top: 1px solid #aaa;
      border-right: 1px solid #aaa;
      border-left: 1px solid #aaa;
      height: 2rem;
      line-height: 2rem;
    }
    .no-menu {
      width: calc(100% - 100px);
      border-bottom: 1px solid #aaa;
    }
  }
  .panel-body {
    width: 100%;
    height: calc(100% - 3.5rem);
    border: 1px solid #aaa;
    border-top: none;
    padding: 0.5rem;
  
  }
`;

class NursingHistory extends Component {
  constructor(props) {
    super(props);
    let nursing_history = localApi.getObject("nursing_history");
    nursing_history = nursing_history === undefined ? null : nursing_history;
    this.state ={
      tab_id:(nursing_history != null && nursing_history.tab_id !== undefined) ? nursing_history.tab_id : 0,
      confirm_message: ""
    };
    this.patientProgressChartRef = React.createRef();
  }
  
  setTab=(val) => {
    let nursing_history = localApi.getObject("nursing_history");
    if (this.state.tab_id == 0 && val == 1) {
      if (nursing_history !== undefined && nursing_history != null && nursing_history.progress_chat !== undefined &&
        (nursing_history.progress_chat.result_changed == true || nursing_history.progress_chat.plan_changed == true || nursing_history.progress_chat.meal_changed == true
          || nursing_history.progress_chat.oxygen_changed == true)) {
        this.setState({confirm_message : "登録していない内容があります。\n変更内容を破棄して移動しますか？"});
        return true;
      }
    }
    let tab_id = parseInt(val);
    this.setState({tab_id});
    if(nursing_history === undefined || nursing_history == null){
      nursing_history = {};
    }
    nursing_history.tab_id = tab_id;
    localApi.setObject("nursing_history", nursing_history);
  };
  
  closeModal = () => {
    this.setState({confirm_message: ""});
  }
  
  confirmOk = () => {
    this.setState({confirm_message: "", tab_id: 1});
    localApi.remove("nursing_history");
  }
  
  closeRightClickMenu=()=>{
    if(this.state.tab_id === 0){
      this.patientProgressChartRef.current.closeRightClickMenu();
    }
  }
  
  saveResult = () => {
    this.patientProgressChartRef.current.mainRegister();
  }
  

  render() {
    return (
      <>
        <Wrapper font_props = {this.props.font_props}>
          <div className="panel-menu">
            {this.state.tab_id === 0 ? (
              <div className="active-menu">熱型表</div>
            ) : (
              <div className="menu-btn" onClick={this.setTab.bind(this, 0)}>熱型表</div>
            )}
            {this.state.tab_id === 1 ? (
              <div className="active-menu">看護計画</div>
            ) : (
              <div className="menu-btn" onClick={this.setTab.bind(this, 1)}>看護計画</div>
            )}
            <div className="no-menu"/>
          </div>
          <div className={'panel-body'}>
            {this.state.tab_id === 0 && (
              <PatientProgressChart
                ref={this.patientProgressChartRef}
                patientId={this.props.patientId}
                hospitalization_id = {this.props.hospitalization_id}
                patientInfo={this.props.patientInfo}
                closeRightClickMenu={this.props.closeRightClickMenu}
                setChangeStatus={this.props.setChangeStatus}
              />
            )}
            {this.state.tab_id === 1 && (
              <PatientNursePlan
                patientId={this.props.patientId}
                font_props={this.props.font_props}
              />
            )}
          </div>
          {this.state.confirm_message !== "" && (
            <ConfirmNoFocusModal
              hideConfirm= {this.closeModal.bind(this)}
              confirmCancel= {this.closeModal.bind(this)}
              confirmOk= {this.confirmOk.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
        </Wrapper>
      </>
    );
  }
}

NursingHistory.contextType = Context;
NursingHistory.propTypes = {
  patientId: PropTypes.number,
  hospitalization_id: PropTypes.number,
  font_props: PropTypes.number,
  patientInfo: PropTypes.object,
  closeRightClickMenu: PropTypes.func,
  setChangeStatus: PropTypes.func,
};
export default NursingHistory;
