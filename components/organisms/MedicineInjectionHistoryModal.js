import React, { Component } from "react";
import axios from "axios";
import styled from "styled-components";
import Button from "../atoms/Button";
import MedicineSelection from "../organisms/MedicineSelection";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import InjectionSelection from "../organisms/InjectionSelection";
import Spinner from "react-bootstrap/Spinner";
import {formatDateLine, getNextMonthByJapanFormat} from "~/helpers/date";

const PatientsWrapper = styled.div`
  margin: auto;
`;

const injectTitle = {
  marginTop: "10px"
};
 const SpinnerWrapper = styled.div`
   height: 200px;
   display: flex;
   justify-content: center;
   align-items: center;
 `;

class MedicineInjectionHistoryModal extends Component {
  constructor(props) {
    super(props);
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.state = {
        notConsentedHistoryData: [],
        notConsentedInjectionHistoryData: [],
        staff_category: authInfo.staff_category || 2,
        patientInfo: {},
        authInfo: authInfo,
        confirm_message:"",
        curFocus: 1,
        is_loaded: false,
    }
  }

  async componentDidMount() {
    if (
      document.getElementById("notconsented_dlg") !== undefined &&
      document.getElementById("notconsented_dlg") !== null
    ) {
      document.getElementById("notconsented_dlg").focus();
    }
    this.btns = ["btnOK","btnCancel"];
    this.setState({
      curFocus: 1
    });
    this.flag = 1;
    
    const insuranceTypeList = this.getInsuranceTypeList();
    await this.getNotConsentedHistoryData();
    await this.getNotConsentedInjectionHistoryData();
    this.setState({
      patientInfo: {
        insurance_type_list: insuranceTypeList
      },
      is_loaded: true
    })
  }
  getInsuranceTypeList = () => {
    return this.context.insuranceTypeList;
  };

  getNotConsentedInjectionHistoryData = async () => {
    let notConsentedInjectionHistoryData = [];
      let params = (params = {
        // get_consent_pending: 1
        patient_id:this.props.patientId,
        start_date: formatDateLine(this.props.search_date),
        end_date: formatDateLine(getNextMonthByJapanFormat(this.props.search_date))
      });
      const { data } = await axios.get("/app/api/v2/order/injection/find", {
        params: params
      });

      if (this.props.patientId != undefined && this.props.patientId != null && parseInt(this.props.patientId) > 0)
        notConsentedInjectionHistoryData = data.filter(x=>x.patient_id == this.props.patientId);
      else 
        notConsentedInjectionHistoryData = data;

    if (notConsentedInjectionHistoryData) {
      notConsentedInjectionHistoryData.map((item) => {
          item.order_data.class_name = "open";
        item.data_one_select = 0;
      });
    }

    this.setState({
      notConsentedInjectionHistoryData: notConsentedInjectionHistoryData
    });
    return notConsentedInjectionHistoryData;
  };

  getNotConsentedHistoryData = async () => {
    let notConsentedHistoryData = null;
      let params = (params = {
        // get_consent_pending: 1
        patient_id:this.props.patientId,
        start_date: formatDateLine(this.props.search_date),
        end_date: formatDateLine(getNextMonthByJapanFormat(this.props.search_date))
      });
      const { data } = await axios.get("/app/api/v2/order/prescription/patient", {
        params: params
      });

      if (this.props.patientId != undefined && this.props.patientId != null && parseInt(this.props.patientId) > 0)
        notConsentedHistoryData = data.filter(x=>x.patient_id == this.props.patientId);
      else 
        notConsentedHistoryData = data;

    if (notConsentedHistoryData) {
      notConsentedHistoryData.map((item) => {
          item.order_data.class_name = "open";
        item.data_one_select = 0;
      });
    }

    this.setState({
      notConsentedHistoryData: notConsentedHistoryData
    });

    return notConsentedHistoryData;
  };
  onHide = () => {};

  render() {
    let prescription_title = <div className="flex"><h6>処方一覧</h6></div>;
    let injection_title = <div className="flex" style={injectTitle}><h6>注射一覧</h6></div>;
    return (
      <PatientsWrapper>
          <Modal
            className='NotConsented first-view-modal not-consented-style'
            show={true}            
            id="notconsented_dlg"
            centered
            size="lg"
            onHide={this.onHide}
          >
            <Modal.Header>
              <Modal.Title>薬歴情報</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {this.state.is_loaded ? (
                <>
                  {(this.state.notConsentedHistoryData.length === 0
                      && this.state.notConsentedInjectionHistoryData.length === 0) ? (
                          <>
                              <div style={{padding:"200px", textAlign:"center"}}>
                                  <span style={{padding:"10px", border:"2px solid #aaa"}}>薬歴情報がありません。</span>
                              </div>
                          </>
                  ):(
                      <>
                          {this.state.notConsentedHistoryData.length > 0 && (
                              <>
                                  {prescription_title}
                                  <MedicineSelection
                                      ref={ref => (this.MedicineSelection = ref)}
                                      tab={0}
                                      patientId={this.props.fromPatient === true ? -1 : 0}
                                      medical_business_diagnosing_type={0}
                                      doctors={[]}
                                      doctor_code={0}
                                      doctor_name={""}
                                      setDoctorInfo={this.dummpyFunc}
                                      medicineHistory={this.state.notConsentedHistoryData}
                                      patientInfo={this.state.patientInfo}
                                      isEditingIndex={-1}
                                      isNotConsentedPopup={this.state.isNotConsentedPopupTrue}
                                      // deselectItem={this.deselectItem.bind(this)}
                                      isLoaded={true}
                                      scrollAddHistoryData={this.dummpyFunc}
                                  />
                              </>
                          )}
                          {this.state.notConsentedInjectionHistoryData.length > 0 && (
                              <>
                                  {injection_title}
                                  <InjectionSelection
                                      injectionHistory={this.state.notConsentedInjectionHistoryData}
                                      patientId={this.props.fromPatient === true ? -1 : 0}
                                      setDoctorInfo={this.dummpyFunc}
                                      openNotConsentedModal={this.openNotConsentedModal}
                                      isNotConsentedPopup={this.state.isNotConsentedPopupTrue}
                                      // deselectInjectionItem={this.deselectInjectionItem.bind(this)}
                                      patientInfo={this.state.patientInfo}
                                      isLoaded={true}
                                  />
                              </>
                          )}
                      </>
                  )}
                </>
              ):(
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button id="system_confirm_Cancel" onClick={this.props.closeModal} className={this.state.curFocus === 1?"cancel-btn focus": "cancel-btn"}>キャンセル</Button>
            </Modal.Footer>
          </Modal>
      </PatientsWrapper>
    );
  }
}
MedicineInjectionHistoryModal.contextType = Context;

MedicineInjectionHistoryModal.propTypes = {
  patientId: PropTypes.string,
  closeModal: PropTypes.func,
  fromPatient: PropTypes.bool,
  search_date: PropTypes.string
};

export default MedicineInjectionHistoryModal;