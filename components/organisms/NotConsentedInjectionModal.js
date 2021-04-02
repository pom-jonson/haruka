import React, { Component } from "react";
import axios from "axios";
import styled from "styled-components";
import Button from "../atoms/Button";
import InjectionSelection from "../organisms/InjectionSelection";
import Checkbox from "../molecules/Checkbox";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import * as sessApi from "~/helpers/cacheSession-utils";

const PatientsWrapper = styled.div`
  margin: auto;
  #injection_selection_wrapper{
    height: 100%;
  }
`;

class NotConsentedInjectionModal extends Component {
  constructor(props) {
    super(props);
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.state = {
      notConsentedHistoryData: [],
      notConsentedModal: false,
      isNotConsentedPopupTrue: true,
      isNotConsentedPopupFalse: false,
      notConsentedDataSelect: false,
      staff_category: authInfo.staff_category || 2,
      patientInfo: {},
      authInfo: authInfo,
      diseaseList: [],
      orderList: [],
      consentList: [],
      confirm_message:"",
    };
  }
  
  async componentDidMount() {
    if (this.state.staff_category === 1) {
      let notConsentedHistoryData = null;
      let cache_data = sessApi.getObject('injection_consented_list');
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
      const insuranceTypeList = this.getInsuranceTypeList();
      this.setState({
        notConsentedHistoryData:notConsentedHistoryData.length > 0 ? notConsentedHistoryData : [],
        notConsentedModal:notConsentedHistoryData.length > 0,
        patientInfo: {
          insurance_type_list: insuranceTypeList
        }
      });
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
  
  handleClick = async () => {
    // var postData;
    let orderList = [];
    if (this.state.notConsentedHistoryData && this.state.notConsentedHistoryData.length > 0) {
      this.state.notConsentedHistoryData.map(medicine => {
        if (medicine.data_one_select === 1 || medicine.data_one_select === true)
          orderList.push(medicine.number);
      });
    }
    if (orderList.length === 0) return;
    this.setState({
      orderList,
      confirm_message: "承認しますか？"
    });
  };
  
  consent = async postData => {
    axios
      .post("/app/api/v2/order/injection/consent", {
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
    let params = (params = {
      get_consent_pending: 1
    });
    const { data } = await axios.get("/app/api/v2/order/injection/find", {
      params: params
    });
    sessApi.setObject("injection_consented_list", data);
    let notConsentedHistoryData = [];
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
  
  confirmCancel() {
    this.setState({
      confirm_message: "",
    });
  }
  
  handleOk = async () => {
    let postData = {
      targets: this.state.orderList
    };
    if (postData.targets.length != 0) {
      this.consent(postData);
    }
    
    if (postData.targets.length > 0) {
      this.context.$setUnconsentedConfirmed(false);
      this.closeNotConsentedModal();
    }
    this.confirmCancel();
  };
  
  render() {
    return (
      <PatientsWrapper>
        {this.state.notConsentedModal && this.state.staff_category === 1 && (
          <Modal
            show={true}
            id="notconsented_injection_dlg"
            centered
            size="lg"
            className="first-view-modal"
          >
            <Modal.Header>
              <Modal.Title>未承認履歴一覧</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
              <InjectionSelection
                injectionHistory={this.state.notConsentedHistoryData}
                patientId={this.props.fromPatient === true ? -1 : 0}
                setDoctorInfo={this.dummpyFunc}
                openNotConsentedModal={this.openNotConsentedModal}
                isNotConsentedPopup={this.state.isNotConsentedPopupTrue}
                deselectItem={this.deselectItem.bind(this)}
                isLoaded={true}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.closeNotConsentedModal} className="cancel-btn">キャンセル</Button>
              <Button onClick={this.handleClick} className="red-btn">承認</Button>
            </Modal.Footer>
            {this.state.confirm_message !== "" && (
              <SystemConfirmModal
                hideConfirm= {this.confirmCancel.bind(this)}
                confirmCancel= {this.confirmCancel.bind(this)}
                confirmOk= {this.handleOk.bind(this)}
                confirmTitle= {this.state.confirm_message}
              />
            )}
          </Modal>
        )}
      </PatientsWrapper>
    );
  }
}
NotConsentedInjectionModal.contextType = Context;

NotConsentedInjectionModal.propTypes = {
  patientId: PropTypes.number,
  refresh: PropTypes.func,
  closeNotConsentedModal: PropTypes.func,
  fromPatient: PropTypes.bool
};

export default NotConsentedInjectionModal;
