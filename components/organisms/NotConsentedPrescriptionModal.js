import React, { Component } from "react";
import axios from "axios";
import styled from "styled-components";
import Button from "../atoms/Button";
import MedicineSelection from "../organisms/MedicineSelection";
import Checkbox from "../molecules/Checkbox";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import { KEY_CODES } from "../../helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";

const PatientsWrapper = styled.div`
  margin: auto;
`;

class NotConsentedPrescriptionModal extends Component {
  constructor(props) {
    super(props);
    this.onKeyPressed = this.onKeyPressed.bind(this);
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.state = {
      notConsentedHistoryData: [],
      staff_category: authInfo.staff_category || 2,
      isNotConsentedPopupTrue: true,
      patientInfo: {},
      authInfo: authInfo,
      diseaseList: [],
      confirm_message:"",
      curFocus: 1,
    }
    this.btns = [];
    this.flag = 1;
  }
  
  onKeyPressed(e) {
    if (e.keyCode === KEY_CODES.left || e.keyCode === KEY_CODES.right) {
      let fnum = (this.flag + 1) % this.btns.length;
      
      this.setState({curFocus : fnum});
      this.flag = fnum;
    }
    if (e.keyCode === KEY_CODES.enter) {
      e.stopPropagation();
      e.preventDefault();
      if (this.flag === 0) {
        this.openConfirmModal();
      }else{
        this.props.closeNotConsentedModal();
      }
    }
  }
  
  async componentDidMount() {
    if (document.getElementById("notconsented_dlg") !== undefined && document.getElementById("notconsented_dlg") !== null) {
      document.getElementById("notconsented_dlg").focus();
    }
    this.btns = ["btnOK","btnCancel"];
    this.setState({curFocus: 1});
    this.flag = 1;
    if (this.state.staff_category === 1) {
      const insuranceTypeList = this.getInsuranceTypeList();
      let notConsentedHistoryData = null;
      let cache_data = sessApi.getObject('prescription_consented_list');
      if (cache_data != undefined && cache_data != null) {
        if (this.props.patientId != undefined && this.props.patientId != null && parseInt(this.props.patientId) > 0){
          notConsentedHistoryData = cache_data.filter(x=>x.patient_id == this.props.patientId);
        } else {
          notConsentedHistoryData = cache_data;
        }
      }
      if (notConsentedHistoryData) {
        notConsentedHistoryData.map((item, index) => {
          if (index < 2) {
            item.order_data.class_name = "open";
          } else {
            item.order_data.class_name = "";
          }
          item.data_one_select = 0;
        });
      }
      this.setState({
        notConsentedModal: true,
        notConsentedHistoryData:notConsentedHistoryData.length > 0 ? notConsentedHistoryData : [],
        patientInfo: {
          insurance_type_list: insuranceTypeList
        },
      })
    }
  }
  
  getInsuranceTypeList = () => {
    return this.context.insuranceTypeList;
  };
  
  closeNotConsentedModal = () => {
    this.setState({
      notConsentedModal: false
    });
    if (this.props.closeNotConsentedModal !== undefined)
      this.props.closeNotConsentedModal();
  };
  
  openNotConsentedModal = () => {
    this.setState({
      notConsentedModal: true
    });
  };
  
  consent = async(postData)=> {
    axios.post("/app/api/v2/order/prescription/doctor_consent", {
        params: postData
      })
      .catch(res => {
        if (res.status == 400 || res.status == 500) {
          if (res.error != undefined && res.error_alert_message != "") {
            alert(res.error_alert_message + "\n");
          }
        }
      });
    
    this.getNotConsentedHistoryData();
  };
  
  getNotConsentedHistoryData = async () => {
    let notConsentedHistoryData = null;
    let params = (params = {
      get_consent_pending: 1
    });
    const { data } = await axios.get("/app/api/v2/order/prescription/patient", {
      params: params
    });
    sessApi.setObject("prescription_consented_list", data);
    if (this.props.patientId != undefined && this.props.patientId != null && parseInt(this.props.patientId) > 0){
      notConsentedHistoryData = data.filter(x=>x.patient_id == this.props.patientId);
    } else{
      notConsentedHistoryData = data;
    }
    
    if (notConsentedHistoryData) {
      notConsentedHistoryData.map((item, index) => {
        if (index < 3) {
          item.order_data.class_name = "open";
        } else {
          item.order_data.class_name = "";
        }
        item.data_one_select = 0;
      });
    }
    
    if (this.props.refresh !== undefined) {
      this.props.refresh();
    }
    this.setState({notConsentedHistoryData});
    return notConsentedHistoryData;
  };
  
  getRadio(name, value) {
    if (name === "notConsentedDataSelect") {
      let notConsentedHistoryData = this.state.notConsentedHistoryData;
      notConsentedHistoryData.map(item => {
        item.data_one_select = value;
      });
      this.setState({
        notConsentedHistoryData: notConsentedHistoryData,
        notConsentedDataSelect: value === 1
      });
    }
  }
  
  deselectItem(number, value) {
    let allChecked = true;
    let notConsentedHistoryData = [];
    this.state.notConsentedHistoryData.map(item => {
      if (item.number === number) {
        item.data_one_select = value;
      }
      if (item.data_one_select === 0) {
        allChecked = false;
      }
      notConsentedHistoryData.push(item);
    });
    this.setState({
      notConsentedHistoryData: notConsentedHistoryData,
      notConsentedDataSelect: allChecked
    });
  }
  
  dummpyFunc = () => {};
  
  handleClick = async () => {
    let postData = {
      order: this.state.orderList
    };
    
    if (postData.order.length !== 0) {
      this.consent(postData);
    }
    
    if (postData.order.length > 0) {
      this.context.$setUnconsentedConfirmed(false);
      this.closeNotConsentedModal();
    }
    this.confirmCancel();
  };
  
  openConfirmModal =()=> {
    let orderList = [];
    if(this.state.notConsentedHistoryData.length > 0 ){
      this.state.notConsentedHistoryData.map(medicine => {
        if (medicine.data_one_select === 1 || medicine.data_one_select === true)
          orderList.push(medicine.number);
      });
    }
    
    if ( orderList.length === 0) return;
    this.setState({
      confirm_message: "承認しますか？",
      orderList,
    });
  }
  
  confirmCancel() {
    this.setState({
      confirm_message: "",
    });
  }
  onHide = () => {};
  
  render() {
    let prescription_title = <div className="flex"><h6>処方一覧</h6></div>;
    return (
      <PatientsWrapper>
        {this.state.notConsentedModal && this.state.staff_category === 1 && (
          <Modal
            className='NotConsented first-view-modal not-consented-style'
            show={true}
            id="notconsented_dlg"
            centered
            size="lg"
            onKeyDown={this.onKeyPressed}
            onHide={this.onHide}
          >
            <Modal.Header>
              <Modal.Title>未承認履歴一覧</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {(this.state.notConsentedHistoryData.length === 0) ? (
                <>
                  <div style={{padding:"200px", textAlign:"center"}}>
                    <span style={{padding:"10px", border:"2px solid #aaa"}}>未承認の内容はありません。</span>
                  </div>
                </>
              ):(
                <>
                  {this.state.notConsentedHistoryData.length > 0 && (
                    <>
                      {prescription_title}
                      <div className="row">
                        <div className="col-md-6">
                          <Checkbox
                            ref={ref => (this.selectAll = ref)}
                            label="全て選択"
                            getRadio={this.getRadio.bind(this)}
                            value={this.state.notConsentedDataSelect}
                            name="notConsentedDataSelect"
                          />
                        </div>
                      </div>
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
                        deselectItem={this.deselectItem.bind(this)}
                        isLoaded={true}
                        scrollAddHistoryData={this.dummpyFunc}
                      />
                    </>
                  )}
                </>
              )}
              {this.state.confirm_message !== "" && (
                <SystemConfirmModal
                  hideConfirm= {this.confirmCancel.bind(this)}
                  confirmCancel= {this.confirmCancel.bind(this)}
                  confirmOk= {this.handleClick.bind(this)}
                  confirmTitle= {this.state.confirm_message}
                />
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button id="system_confirm_Cancel" onClick={this.props.closeNotConsentedModal} className={this.state.curFocus === 1?"cancel-btn focus": "cancel-btn"}>キャンセル</Button>
              <Button id="system_confirm_Ok" onClick={this.openConfirmModal.bind(this)} className={this.state.curFocus === 0?"red-btn focus": "red-btn"}>承認</Button>
            </Modal.Footer>
          </Modal>
        )}
      </PatientsWrapper>
    );
  }
}
NotConsentedPrescriptionModal.contextType = Context;

NotConsentedPrescriptionModal.propTypes = {
  patientId: PropTypes.string,
  refresh: PropTypes.func,
  closeNotConsentedModal: PropTypes.func,
  fromPatient: PropTypes.bool
};

export default NotConsentedPrescriptionModal;

