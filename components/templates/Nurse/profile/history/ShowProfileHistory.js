import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import HistoryProfile from "./HistoryProfile";
import HistorySummary from "./HistorySummary";
import HistoryHealth from "./HistoryHealth";
import HistoryNutrity from "./HistoryNutrity";
import HistoryExcretion from "./HistoryExcretion";
import HistoryExercise from "./HistoryExercise";
import HistoryRest from "./HistoryRest";
import HistoryPerception from "./HistoryPerception";
import HistorySelfPerception from "./HistorySelfPerception";
import HistoryRoleRelation from "./HistoryRoleRelation";
import HistoryGender from "./HistoryGender";
import HistoryStress from "./HistoryStress";
import HistoryValueBelief from "./HistoryValueBelief";
import {
  // surface,
  secondary200,
  // midEmphasis,
  disable
} from "~/components/_nano/colors";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  .patient-info {
    text-align: left;
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom:0.5rem;
  }
  .flex {
    display: flex;
    margin-bottom: 0;

    &.between {
      justify-content: space-between;

      div {
        margin-right: 0;
      }
    }

    div {
      margin-right: 8px;
    }

    .date {
      margin-left: auto;
      margin-right: 24px;
    }
  }
  .panel-menu {
    width: 100%;
    margin-bottom: 0.3rem;
    font-weight: bold;
    div{
      margin-right:0;
    }
    .menu-btn {
        width:auto;
        text-align: center;
        border-bottom: 1px solid black;
        background-color: rgba(200, 194, 194, 0.22);
        padding: 0.2rem;
        cursor: pointer;
        opacity:0.5;
        border-right:1px solid black;
        padding-left:0.5rem;
        padding-right:0.5rem;
    }
    .active-menu {
        width:auto;
        text-align: center;
        border-top: 1px solid black;
        border-right: 1px solid black;
        border-left: 1px solid black;
        padding: 0.2rem;
        opacity:1;
        padding-left:0.5rem;
        padding-right:0.5rem;
    }
    .no-menu {
        width: calc(100% - 600px);
        border-bottom: 1px solid black;
        background-color: rgba(200, 194, 194, 0.22);
    }
  }
  .content{
    height:calc(75vh - 15rem);
    overflow-y:auto;
    padding-top:0.5rem;
  }
  .table-item{
    padding-top:2px;
    padding-bottom:2px;
  }
  .phy-box{
    line-height: 1.3;
    position: relative;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    border-top: 1px solid #ddd;
    &:before {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 240px;
    }
    .text-left{
      .table-item{        
        width: 200px;
        float: left;
        text-align: right;
      }
    }
    .text-right{
      .table-item{
        text-align: left;
      }
    }

    .table-row {
      &:nth-child(2n) {
        background-color: ${secondary200};
      }
      border-bottom: 1px solid ${disable};
    }
  }  
  .text-right {
    width: calc(100% - 138px);
  }
  .remarks-comment {
    margin-left: auto;
    width: calc(100% - 130px);
    word-wrap: break-word;
  }  
`;

class ShowProfileHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {      
      modal_data: this.props.modal_data,      
      confirm_message: "",      
      confirm_type: "",
      tab_id:0
    }
  }

  setTab = (e,tab_id) => {    
    this.setState({tab_id})
  }

  render() {    
    return  (
        <Modal show={true} className="custom-modal-sm first-view-modal nurse-profile-history-detail-modal">
          <Modal.Header>
            <Modal.Title>看護プロフィール</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className={'patient-info flex'}>
                <div className='text-left'>
                  {this.props.patientInfo.receId} : {this.props.patientInfo.name}({this.props.patientInfo.sex==1?'男':'女'})
                </div>
                <div style={{marginLeft:'2rem'}}>{this.props.patientInfo.birthDate}</div>
              </div>
              <div className="panel-menu flex">
                { this.state.tab_id === 0 ? (
                    <><div className="active-menu">プロフィール</div></>
                ) : (
                    <><div className="menu-btn" onClick={e => {this.setTab(e, 0);}}>プロフィール</div></>
                )}
                { this.state.tab_id === 1 ? (
                    <><div className="active-menu">パターン要約</div></>
                ) : (
                    <><div className="menu-btn" onClick={e => {this.setTab(e, 1);}}>パターン要約</div></>
                )}
                { this.state.tab_id === 2 ? (
                    <><div className="active-menu">健康知覚</div></>
                ) : (
                    <><div className="menu-btn" onClick={e => {this.setTab(e, 2);}}>健康知覚</div></>
                )}
                { this.state.tab_id === 3 ? (
                    <><div className="active-menu">栄養-代謝</div></>
                ) : (
                    <><div className="menu-btn" onClick={e => {this.setTab(e, 3);}}>栄養-代謝</div></>
                )}
                { this.state.tab_id === 4 ? (
                    <><div className="active-menu">排泄</div></>
                ) : (
                    <><div className="menu-btn" onClick={e => {this.setTab(e, 4);}}>排泄</div></>
                )}
                { this.state.tab_id === 5 ? (
                    <><div className="active-menu">活動-運動</div></>
                ) : (
                    <><div className="menu-btn" onClick={e => {this.setTab(e, 5);}}>活動-運動</div></>
                )}
                { this.state.tab_id === 6 ? (
                    <><div className="active-menu">睡眠-休息</div></>
                ) : (
                    <><div className="menu-btn" onClick={e => {this.setTab(e, 6);}}>睡眠-休息</div></>
                )}
                { this.state.tab_id === 7 ? (
                    <><div className="active-menu">認知-知覚</div></>
                ) : (
                    <><div className="menu-btn" onClick={e => {this.setTab(e, 7);}}>認知-知覚</div></>
                )}
                { this.state.tab_id === 8 ? (
                    <><div className="active-menu">自己知覚</div></>
                ) : (
                    <><div className="menu-btn" onClick={e => {this.setTab(e, 8);}}>自己知覚</div></>
                )}
                { this.state.tab_id === 9 ? (
                    <><div className="active-menu">役割-関係</div></>
                ) : (
                    <><div className="menu-btn" onClick={e => {this.setTab(e, 9);}}>役割-関係</div></>
                )}
                { this.state.tab_id === 10 ? (
                    <><div className="active-menu">性-生殖</div></>
                ) : (
                    <><div className="menu-btn" onClick={e => {this.setTab(e, 10);}}>性-生殖</div></>
                )}
                { this.state.tab_id === 11 ? (
                    <><div className="active-menu">コーピング</div></>
                ) : (
                    <><div className="menu-btn" onClick={e => {this.setTab(e, 11);}}>コーピング</div></>
                )}
                { this.state.tab_id === 12 ? (
                    <><div className="active-menu">価値-信念</div></>
                ) : (
                    <><div className="menu-btn" onClick={e => {this.setTab(e, 12);}}>価値-信念</div></>
                )}
              </div>
              {/* <div className="panel-menu flex">
              </div> */}
              <div className='content'>
                  {this.state.tab_id == 0 && (
                    <HistoryProfile
                      modal_data ={this.props.modal_data}
                      current_medical_history = {this.props.current_medical_history}
                      nurse_staff = {this.props.nurse_staff}
                      hosptial_purpose_master = {this.props.hosptial_purpose_master}
                      diseaseName_object = {this.props.diseaseName_object}
                    />
                  )}
                  {this.state.tab_id == 1 && (
                    <HistorySummary
                      modal_data ={this.props.modal_data}
                    />
                  )}
                  {this.state.tab_id == 2 && (
                    <HistoryHealth
                      modal_data ={this.props.modal_data}
                    />
                  )}
                  {this.state.tab_id == 3 && (
                    <HistoryNutrity
                      modal_data ={this.props.modal_data}
                    />
                  )}
                  {this.state.tab_id == 4 && (
                    <HistoryExcretion
                      modal_data ={this.props.modal_data}
                    />
                  )}
                  {this.state.tab_id == 5 && (
                    <HistoryExercise
                      modal_data ={this.props.modal_data}
                    />
                  )}
                  {this.state.tab_id == 6 && (
                    <HistoryRest
                      modal_data ={this.props.modal_data}
                    />
                  )}
                  {this.state.tab_id == 7 && (
                    <HistoryPerception
                      modal_data ={this.props.modal_data}
                    />
                  )}
                  {this.state.tab_id == 8 && (
                    <HistorySelfPerception
                      modal_data ={this.props.modal_data}
                    />
                  )}
                  {this.state.tab_id == 9 && (
                    <HistoryRoleRelation
                      modal_data ={this.props.modal_data}
                    />
                  )}
                  {this.state.tab_id == 10 && (
                    <HistoryGender
                      modal_data ={this.props.modal_data}
                    />
                  )}
                  {this.state.tab_id == 11 && (
                    <HistoryStress
                      modal_data ={this.props.modal_data}
                    />
                  )}
                  {this.state.tab_id == 12 && (
                    <HistoryValueBelief
                      modal_data ={this.props.modal_data}
                    />
                  )}
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.closeModal} className="cancel-btn">キャンセル</Button>            
          </Modal.Footer>
        </Modal>
    );
  }
}

ShowProfileHistory.contextType = Context;

ShowProfileHistory.propTypes = {
  closeModal: PropTypes.func,  
  modal_data: PropTypes.object,
  patientInfo: PropTypes.object,
  current_medical_history : PropTypes.string,
  nurse_staff : PropTypes.array,
  hosptial_purpose_master : PropTypes.array,
  diseaseName_object : PropTypes.object,
};

export default ShowProfileHistory;
