import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import NursePatientNav from "~/components/templates/Patient/NursingDocument/NursePatientNav";
import * as localApi from "~/helpers/cacheLocal-utils";
import styled from "styled-components";
// import * as sessApi from "~/helpers/cacheSession-utils";
import NursePass from "~/components/templates/Patient/NursingDocument/NursePass";
import NursingHistory from "~/components/templates/Patient/NursingDocument/NursingHistory";
import * as karteApi from "~/helpers/cacheKarte-utils";

const Wrapper = styled.div`
  background-color:white;
  padding-top: 120px;
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-size:${props=>(props.font_props != undefined ? (0.75 * props.font_props + 'rem'):'0.75rem')};
  .nurse-history {
    width:70%;
    height:100%;
    margin: 0.5rem;
  }
  .nurse-passing {
    width:30%;
    height:100%;
    border-left:1px solid #aaa;
  }
`;

class NursingDocument extends Component {
  constructor(props) {
    super(props);
    let nurse_patient_info = localApi.getObject("nurse_patient_info");
    if(nurse_patient_info === undefined || nurse_patient_info == null){
      nurse_patient_info = {};
      let cache_patientInfo = karteApi.getPatient(props.match.params.id);
      nurse_patient_info.patientInfo = cache_patientInfo;
      nurse_patient_info.hos_number = cache_patientInfo.hospitalization_id;
      let patient_detail = karteApi.getVal(props.match.params.id,"patient_detail");
      nurse_patient_info.detailedPatientInfo = patient_detail.detailedPatientInfo;
      localApi.setObject("nurse_patient_info", nurse_patient_info);
    }
    this.state ={
      patientInfo: nurse_patient_info.patientInfo,
      detailedPatientInfo: nurse_patient_info.detailedPatientInfo,
      hos_number: nurse_patient_info.hos_number,
    };
    this.font_props = 1;    
    this.patientNavRef = React.createRef();
    this.nurseRecordRef = React.createRef();
    this.nurseHistoryRef = React.createRef();
    this.close_page = 0;
  }
  
  openModal=()=>{}
  
  goOtherPage=(url)=>{
    this.props.history.push(url);
  }
  
  setChangeStatus=(status)=>{
    this.patientNavRef.current.setChangeFlag(status);
  }
  
  registerNurseRecord=(act)=>{
    if(act == "close_page"){
      this.close_page = 1;
    }
    this.nurseRecordRef.current.registerNurseRecord();
  }
  
  finishRegister=()=>{
    if(this.close_page == 1){
      let system_before_page = localApi.getValue('system_before_page');
      if (system_before_page != null && system_before_page != undefined && system_before_page != "") {
        this.goOtherPage(system_before_page);
      } else {
        this.goOtherPage("/hospital_ward_map");
      }
    } else {
      this.patientNavRef.current.finishRegister();
    }
  }
  
  setTab=(val) => {
    this.setState({
      tab_id:parseInt(val),
    },()=>{this.getSearchResult();});
  };
  
  closeRightClickMenu=(from_click)=>{
    if(from_click === 'left'){
      this.nurseRecordRef.current.closeRightClickMenu();
    }
    if(from_click === 'right'){
      this.nurseHistoryRef.current.closeRightClickMenu();
    }
  }
  saveResult = () => {
    this.nurseHistoryRef.current.saveResult();
  }

  render() {
    this.font_props = this.context.font_props;
    return (
      <>
        <NursePatientNav
          ref={this.patientNavRef}
          openModal={this.openModal}
          patientId={this.props.match.params.id}
          patientInfo={this.state.patientInfo}
          detailedPatientInfo={this.state.detailedPatientInfo}
          patientsList={[]}
          goOtherPage={this.goOtherPage}
          saveResult={this.saveResult}
          registerNurseRecord={this.registerNurseRecord}
        />
        <div className="hello noselect" style={{height:"100vh"}}>
          <Wrapper font_props = {this.font_props}>
            <div className={'nurse-history'}>
              <NursingHistory
                ref={this.nurseHistoryRef}
                patientId={this.props.match.params.id}
                hospitalization_id = {this.state.hos_number}
                font_props={this.font_props}
                patientInfo={this.state.patientInfo}
                closeRightClickMenu={this.closeRightClickMenu}
                setChangeStatus={this.setChangeStatus}
              />
            </div>
            <div className={'nurse-passing'} id={'nurse-passing'}>
              <NursePass
                ref={this.nurseRecordRef}
                font_props={this.font_props}
                setChangeStatus={this.setChangeStatus}
                finishRegister={this.finishRegister}
                hos_number={this.state.hos_number}
                patientInfo={this.state.patientInfo}
                patientId={this.props.match.params.id}
                closeRightClickMenu={this.closeRightClickMenu}
              />
            </div>
          </Wrapper>
        </div>
      </>
    );
  }
}

NursingDocument.contextType = Context;
NursingDocument.propTypes = {
  patientInfo: PropTypes.object.isRequired,
  patientId: PropTypes.number.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.node
    }).isRequired
  }).isRequired,
  history: PropTypes.object
};
export default NursingDocument;
