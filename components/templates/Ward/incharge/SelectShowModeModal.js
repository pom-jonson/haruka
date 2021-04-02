import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import InchargeSheetModal from "./InchargeSheetModal";
import * as localApi from "~/helpers/cacheLocal-utils";
// import disabled_status_no from "../../_demo/Patients_panel_icon/disabled_status_no.png";
// import disabled_status_yes from "../../_demo/Patients_panel_icon/disabled_status_yes.png";
// import drugalergy_status_no from "../../_demo/Patients_panel_icon/drugalergy_status_no.png";
// import drugalergy_status_yes from "../../_demo/Patients_panel_icon/drugalergy_status_yes.png";
// import foodalergy_status_no from "../../_demo/Patients_panel_icon/foodalergy_status_no.png";
// import foodalergy_status_yes from "../../_demo/Patients_panel_icon/foodalergy_status_yes.png";
// import staff_status_no from "../../_demo/Patients_panel_icon/staff_status_no.png";
// import staff_status_yes from "../../_demo/Patients_panel_icon/staff_status_yes.png";
// import ADL_status_no from "../../_demo/Patients_panel_icon/ADL_status_no.png";
// import ADL_status_yes from "../../_demo/Patients_panel_icon/ADL_status_yes.png";
// import vaccine_status_no from "../../_demo/Patients_panel_icon/vaccine_status_no.png";
// import vaccine_status_yes from "../../_demo/Patients_panel_icon/vaccine_status_yes.png";
// import infection_status_positive from "../../_demo/Patients_panel_icon/infection_status_positive.png";
// import infection_status_no from "../../_demo/Patients_panel_icon/infection_status_no.png";
// import infection_status_unknown from "../../_demo/Patients_panel_icon/infection_status_unknown.png";
// import infection_status_negative from "../../_demo/Patients_panel_icon/infection_status_negative.png";
// import alergy_status_positive from "../../_demo/Patients_panel_icon/alergy_status_positive.png";
// import alergy_status_no from "../../_demo/Patients_panel_icon/alergy_status_no.png";
// import alergy_status_unknown from "../../_demo/Patients_panel_icon/alergy_status_unknown.png";
// import alergy_status_negative from "../../_demo/Patients_panel_icon/alergy_status_negative.png";
// import navigation_status from "../../_demo/Patients_panel_icon/navigation_status.png";
// import introduction_status from "../../_demo/Patients_panel_icon/introduction_status.png";
// import AfflictionIcon from "../../atoms/AfflictionIcon";
// import axios from "axios";
// import ConcurrentuserModal from "../../molecules/ConcurrentuserModal";
// import startKarteMode from "~/components/templates/Patient/PrescriptionMethods/startKarteMode";
// import * as karteApi from "~/helpers/cacheKarte-utils";
// import LargeUserIcon from "../../atoms/LargeUserIcon";
// import {KARTEMODE} from "~/helpers/constants"
// import SystemAlertModal from "~/components/molecules/SystemAlertModal";
// import {getDifferentTime} from "~/helpers/date";
// import * as apiClient from "~/api/apiClient";
// import {formatDateLine, formatTimeSecondIE} from "../../../helpers/date";
// import {CACHE_LOCALNAMES, ALLERGY_STATUS_ARRAY, ALLERGY_TYPE_ARRAY} from "~/helpers/constants";
// import {disable} from "../../_nano/colors";
// import {displayLineBreak} from "~/helpers/dialConstants";
// import $ from "jquery";
// import {KEY_CODES} from "../../../helpers/constants";
// import * as localApi from "~/helpers/cacheLocal-utils";
// import Radiobox from "~/components/molecules/Radiobox";
// import Spinner from "react-bootstrap/Spinner";

const Wrapper = styled.div`
  display: block;
  max-width: 100%;
  // width: 649px;
  width: 100%;
  height: 100%;
  padding: 9px 9px 9px 2px;
  max-height: 700px;
  overflow: auto;
  position: relative;
  font-size: 18px;
  font-family: NotoSansJP;
  img {
    width: 20px;
    margin-left: 8px;
  }
  .patientId{
    color: rgb(126, 126, 126);
    font-size: 25px;
    transform: scale(0.9, 1);
    font-family: NotoSansJP;
    font-weight: lighter;
  }
  .kana_name{
    color: rgb(0, 0, 0);
    font-size: 17px;
    line-height: 1;
  }
  .patient-name{
    color: rgb(0, 0, 0);
    font-size: 20px;
    font-weight: bold;
  }
    .invitor_number {
    margin-left: auto;
    color: rgb(255,127,39);
  }
    .first-medical {
        -webkit-box-pack: justify;
        justify-content: space-between;
        .block-area {
          width: 45%;
          border: 1px solid #aaa;
          margin-top: 20px;
          padding: 10px;
          position: relative;
          color: black;
          label {
            font-size: 14px;
            width:auto; 
          }
        }
        .block-title {
          position: absolute;
          top: -12px;
          left: 10px;
          font-size: 18px;
          background-color: white;
          padding-left: 5px;
          padding-right: 5px;
        }
    }
    .no-result {
        text-align: center;
        padding-top: 100px;
    }
    .title{
      margin: auto;
      padding: 7rem;
      font-size: 1.5rem;
      margin-left: 3rem;
      text-align: center;
    }
`;

export class SelectShowModeModal extends Component {
  constructor(props) {
    super(props);
    let patientId = props.patientId;
    let patientInfo = props.patientInfo;
    let detailedPatientInfo = props.detailedPatientInfo;
    let path = window.location.href.split("/");
    if(path[path.length - 1] == "nursing_document"){
      let nurse_patient_info = localApi.getObject("nurse_patient_info");
      if(nurse_patient_info !== undefined && nurse_patient_info != null){
        patientInfo = nurse_patient_info.patientInfo;
        detailedPatientInfo = nurse_patient_info.detailedPatientInfo;
        patientId = detailedPatientInfo.patient[0]['number'];
      }
    }
    this.state = {
      patientId,
      patientInfo,
      detailedPatientInfo,
      isOpenModal: false,
      selectType: null
    }    
  }

  async componentDidMount() {
   
  }

  showDisplayModal = (type) => {
    this.setState({
      selectType: type,
      isOpenModal: true,
    });
  }

  closeModal = () =>{
    this.setState({
      isOpenModal: false,
      selectType: null
    }, ()=>{
      this.props.closeModal();
    });
  }

  render() {
    return (
        <Modal
            show={true}
            id="select_mode_modal"
            className="custom-modal-sm basic-data-modal mode-select-modal first-view-modal"
            // onKeyDown={this.onKeyPressed}
        >
          <Modal.Header>
            <Modal.Title>表示モード選択</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className="title">表示モードを選択してください。</div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={()=>this.showDisplayModal("completed_at")} className="red-btn">実施日検索</Button>
            <Button onClick={()=>this.showDisplayModal("suggest_at")} className="red-btn">依頼日検索</Button>                        
            <Button onClick={()=>this.showDisplayModal("emergency_instruction")} className="red-btn">緊急指示検索</Button>                        
          </Modal.Footer>
          {this.state.isOpenModal && (
            <InchargeSheetModal
              selectType={this.state.selectType}
              closeModal={this.closeModal}
              patientId={this.state.patientId}
              patientInfo={this.state.patientInfo}
              detailedPatientInfo={this.state.detailedPatientInfo}
            />
          )}
        </Modal>
    );
  }
}
SelectShowModeModal.contextType = Context;
SelectShowModeModal.propTypes = {
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,  
  closeModal: PropTypes.func,
  detailedPatientInfo : PropTypes.object
};

export default SelectShowModeModal;
