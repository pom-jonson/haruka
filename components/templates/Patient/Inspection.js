import React, { Component } from "react";
import styled from "styled-components";
import {
  surface,
  error,
  secondary,
  disable
} from "../../_nano/colors";
import enhance from "./@enhance";
import * as methods from "./PrescriptionMethods";
import PropTypes from "prop-types";
import ExaminationLeftBox from "./Inspection/components/ExaminationLeftBox";
import ExaminationRightBox from "./Inspection/components/ExaminationRightBox";
import Context from "~/helpers/configureStore";
import { SOAP_TREE_CATEGORY, TREE_FLAG } from "~/helpers/constants";
import PanelGroup from "./PanelGroup/PanelGroup";
import {
    CACHE_LOCALNAMES,
} from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";
import auth from "~/api/auth";
import Button from "~/components/atoms/Button";
import * as localApi from "~/helpers/cacheLocal-utils";

const PrescriptionWrapper = styled.div`
  width: 100%;
  padding-top: 120px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  width: 100%;
  .examination-content{
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    width: 100%;
  }
  .note-red{
    color: ${error};
  }

  .exam-order{
    margin-left: 75px;
  }
  nav {
    padding: 4px 0;
    ul {
      padding-left: 0;
      margin-bottom: 8px;
      &:before {
        content: "";
        border-left: 1px solid #ccc;
        display: block;
        width: 0;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
      }

      .sel_open {
        background: #ddd;
      }
      ul {
        margin-left: 10px;
        position: relative;
        margin-bottom: 0px;

        li {
          padding: 0px 12px;

          &:before {
            content: "";
            border-top: 1px solid #ccc;
            display: block;
            width: 8px;
            height: 0;
            position: absolute;
            top: 10px;
            left: 0;
          }
          &:last-child:before {
            background: #fff;
            height: auto;
            top: 10px;
            bottom: 0;
          }

          ul {
            margin-bottom: 0px;
            li {
              padding: 0px 12px;

              ul {
                margin-bottom: 0px;

                li {
                  padding: 0px 12px;
                }
              }
            }
          }
        }
      }
      li {
        margin: 0;
        padding: 3px 12px;
        text-decoration: none;
        text-transform: uppercase;
        font-size: 13px;
        line-height: 20px;
        position: relative;
      }
    }

    li {
      cursor: pointer;
      list-style-type: none;
    }
  }

  .mark {
    color: ${surface};
    font-size: 12px;
    display: inline-block;
    padding: 2px;
    line-height: 1;
    &.red {
      background-color: ${error};
    }
    &.blue {
      background-color: ${secondary};
    }
  }

  .data-item {
    padding: 4px 32px 4px 8px;
    position: relative;
    cursor: pointer;

    &.open {
      .angle {
        transform: rotate(180deg);
      }
    }

    &.changed {
      background: #eee;
    }

    &.updating {
      background: #ccc;
    }
  }

  p {
    margin: 0;
  }

  .flex {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .entry-name {
    display: inline-block;
    width: 35%;
  }

  .soap-data,
  .soap-data-item {
    width: 100%;

    tr {
      flex-wrap: nowrap;
    }

    th,
    td {
      border: 1px solid ${disable};
      padding: 2px;
    }

    th {
      background: #f6fcfd;
      text-align: center;
      width: 50px;
    }

    td {
      flex: 1;
    }

    input {
      width: 100%;
    }
  }

  .style-hide{
    display: none;
  }
  
  .detail-deleted {
      color: #ff0000;
      textarea {
        color: #ff0000;
      }
  }
  
  .soap-data-item {
    display: none;
    &.open {
      display: inline-table;
    }

    textarea {
      border: 0px;
      resize: none;
    }

    &.changed {
      background: #eee;
      textarea {
        background: #eee;
      }
    }
    &.deleted {
      color: #ff0000;

      textarea {
        color: #ff0000;
      }
    }
  }

  .data-input{
    display: none;
    &.open{
      display: block;
    }
  }

  .not-consented {
    color: ${error};
  }

  .btn {
    background-color: ${secondary};
    border: none;
    border-radius: 4px;
    box-sizing: border-box;
    color: ${surface};
    display: block;
    font-size: 14px;
    text-align: center;
    margin-left: auto;
    padding: 2px 4px;
    line-height: 1;
  }  
  #soapTreeView li{
    cursor: default;
    span{
      cursor: pointer;
    }
  }
`;

@enhance
class Inspection extends Component {
  constructor(props) {
    super(props);    
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
  }
  async UNSAFE_componentWillMount () {
    await this.getPatientInfor();
  }
  
  async componentDidMount(){
    this.setState({
      isLoaded: false,
      bOpenAllExamination: false,
      bOpenAllExaminationLatest: true,
      categoryType: -1,
      curScrollTop: 0,
      selYear:-1,
      selMonth:-1,
      selDay:-1,
      openStatus:{
        iExamination: 1,
        eExamination: 1,
      },
      patientInfo:karteApi.getPatient(this.props.match.params.id),
      activeOperation: 'examination'
    });
    this.m_department_code = this.context.department.code;
    await this.getExaminationKarteTree({
      patient_id: this.props.match.params.id,
      medical_department_code: this.context.department.code
    });        
    auth.refreshAuth(location.pathname+location.hash);
  }  

  setOpenClose = (nType, i) => {
    var setVal = false;
    if(i == TREE_FLAG.OPEN_TREE){
      setVal = true;
    }
    switch(nType){      
      case SOAP_TREE_CATEGORY.ALL_EXAMINATION:
        this.setState({
          bOpenAllExamination:setVal,        
        });
        break;      
      case SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST:
        this.setState({
          bOpenAllExaminationLatest:setVal
        });
        break;      
    }    
  }

  setCurScrollTop = (nVal) => {
    this.setState({
      curScrollTop: nVal
    });
  }

  changeLeftSoapList = (department, year, month, date, nCategoryType) => {
    // this.context.$updateStopGetHistory(false);
    // this.context.$updatePageNumber(0);
    window.sessionStorage.setItem('inspection_scroll_top', 0);
    this.changeSoapList(department, year, month, date, nCategoryType);
  }

  setImportance =(soapIndex, importance_level)=>{
      let soapList = this.state.soapList;
      soapList[soapIndex]['importance_level'] = importance_level;
      this.setState({soapList,});
  }

  onResizeEnd = (val) => {
    let cache_tree_width = karteApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.TREE_WIDTH);
    cache_tree_width.prescription.left.size = val[0].size;
    cache_tree_width.injection.left.size = val[0].size;
    cache_tree_width.inspection.left.size = val[0].size;
    cache_tree_width.soap.left.size = val[0].size;
    // cache_tree_width.prescription.right.size = val[1].size;
    karteApi.setVal(this.props.match.params.id, CACHE_LOCALNAMES.TREE_WIDTH, JSON.stringify(cache_tree_width));
  }

  gotoSoap = () => {
    let patient_info = karteApi.getLatestVisitPatientInfo();    
    if (patient_info == undefined || patient_info == null) {
      let current_system_patient_id = localApi.getValue("current_system_patient_id");
      current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
      if (current_system_patient_id > 0) {
        this.props.history.replace(`/patients/${current_system_patient_id}/soap`);
      }
    } else {
      this.props.history.replace(`/patients/${patient_info.patient_id}/soap`);
    }
  }
  
  render() {
    let tree_width = [
      {size: 350, minSize:180, maxSize:400, resize: "dynamic"},
      {minSize:600, resize: "stretch"}
    ];
    let cache_tree_width = karteApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.TREE_WIDTH);
    if (cache_tree_width != undefined && cache_tree_width != null && cache_tree_width.inspection != undefined && cache_tree_width.inspection != null) {
      tree_width = [
        cache_tree_width.inspection.left,        
        cache_tree_width.inspection.right
      ]
    }
    return (
      <div>
        <PrescriptionWrapper>                    
          <Wrapper> 
            <PanelGroup borderColor="#DDD" spacing={2}
              panelWidths={tree_width}
              onResizeEnd={this.onResizeEnd} 
            >
            <ExaminationLeftBox
              soapTrees={this.state.soapTrees}
              changeSoapList={this.changeLeftSoapList}
              departmentStr={this.context.department.name !== ""?this.context.department.name:"内科"}
              bOpenCurrentSoap={this.state.bOpenCurrentSoap}
              bOpenAllSoap={this.state.bOpenAllSoap}
              bOpenAllOrder={this.state.bOpenAllOrder}
              bOpenAllExamination={this.state.bOpenAllExamination}
              bOpenAllInspection={this.state.bOpenAllInspection}
              bOpenAllTreatment={this.state.bOpenAllTreatment}
              bOpenAllRehabily={this.state.bOpenAllRehabily}
              bOpenAllRadiation={this.state.bOpenAllRadiation}
              bOpenCurrentSoapLatest={this.state.bOpenCurrentSoapLatest}
              bOpenAllSoapLatest={this.state.bOpenAllSoapLatest}
              bOpenAllOrderLatest={this.state.bOpenAllOrderLatest}
              bOpenAllExaminationLatest={this.state.bOpenAllExaminationLatest}
              bOpenAllInspectionLatest={this.state.bOpenAllInspectionLatest}
              bOpenAllTreatmentLatest={this.state.bOpenAllTreatmentLatest}
              bOpenAllRehabilyLatest={this.state.bOpenAllRehabilyLatest}
              bOpenAllRadiationLatest={this.state.bOpenAllRadiationLatest}
              setOpenClose={this.setOpenClose}
              curScrollTop={this.state.curScrollTop}
              setCurScrollTop={this.setCurScrollTop}
              categoryType={this.state.categoryType}
              selYear={this.state.selYear}
              selMonth={this.state.selMonth}
              selDay={this.state.selDay}
            />
            <div className="examination-content">
              <ExaminationRightBox
                ref={this.middleRef}
                isLoaded={this.state.isLoaded}
                soapTrees={this.state.soapTrees}
                saveConfirmMessage={this.saveConfirmMessage}
                soapList={this.state.soapList}
                allTags={this.state.allTags}
                updateSoapList={this.updateSoapList}
                changeSoapList={this.changeSoapList}
                updateSoap={this.updateSoap} 
                showModal={this.emitPatientModalEvent}                   
                patientId={this.props.match.params.id}
                patientInfo={this.state.patientInfo}
                categoryType={this.state.categoryType}            
                updateIndex={this.state.updateIndex}
                setOpenClose={this.setOpenClose}
                selYear={this.state.selYear}
                selMonth={this.state.selMonth}
                selDay={this.state.selDay}
                setImportance={this.setImportance}
                history = {this.props.history}
              />              
            </div>
            </PanelGroup>
            {karteApi.getEditPatientList() != undefined && karteApi.getEditPatientList() != null && karteApi.getEditPatientList().length > 0 && (
              <>
              <div style={{position:'absolute', right:'210px', bottom:'10px'}}>
                <Button className="tab-btn button close-back-btn" onClick={this.gotoSoap}>閉じる</Button>
              </div>
              </>
            )}
          </Wrapper> 
        </PrescriptionWrapper>
      </div>      
    );
  }
}

Inspection.contextType = Context;

Inspection.propTypes = {
  patientInfo: PropTypes.object.isRequired,
  patientId: PropTypes.number.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.node
    }).isRequired
  }).isRequired,
  history: PropTypes.object
};
export default Inspection;
