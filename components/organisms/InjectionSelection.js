import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import InjectionHistory from "../organisms/InjectionHistory";
import Spinner from "react-bootstrap/Spinner";

const InjectionSelectionWrapper = styled.div`
  width: 100%;
`;

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class InjectionSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      injectionData: props.injectionHistory,    
      // isEditingIndex: props.isEditingIndex,
      stopGetHistory: false,
      isLoaded: props.isLoaded
    };
  }

  async componentDidMount() {
  }

  copyOrder = (order, type) => {
    return this.props.copyOrder(order, type);
  };

  stopPeriodRp = (order_number, rp_number, doctor_code, doctor_name) => {
    return this.props.stopPeriodRp(order_number, rp_number, doctor_code, doctor_name);
  };

  stopPeriodOrder = (order_number, doctor_code, doctor_name) => {
    return this.props.stopPeriodOrder(order_number, doctor_code, doctor_name);
  };

  stopPeriodInjectionCategory = (_param) => {
    return this.props.stopPeriodInjectionCategory(_param);
  };

  copyOrders = (orders, type) => {
    return this.props.copyOrders(orders, type);
  };

  editOrders = (prescription, is_done = false) => {
    this.props.editOrders(prescription, is_done);
  };

  registerSet = prescription => {
    this.props.registerSet(prescription);
  };

  changeDepartment = prescription => {
    this.props.changeDepartment(prescription);
  };

  printOrders = prescription => {
    this.props.printOrders(prescription);
  };

  // testMedRender = (injectionHistory, isEditingIndex = -1) => {
  //   let set_state = {
  //     injectionData: injectionHistory
  //   };
  //   if (isEditingIndex != -1) set_state.isEditingIndex = isEditingIndex;
  //   this.setState(set_state);
  // }
  testMedRender = (injectionHistory) => {
    let set_state = {
      injectionData: injectionHistory
    };
    this.setState(set_state);
  }

  testIsLoadedRender = (isLoaded = false) => {
    this.setState({
      isLoaded: isLoaded
    });
  }

  testStopGetHistoryRender = (bFlag = false) => {
    this.setState({
      stopGetHistory: bFlag
    });
  }

  timer = "";

  render() {    
    if (!this.state.isLoaded) {
      return (
        <SpinnerWrapper>
          <Spinner animation="border" variant="secondary" />
        </SpinnerWrapper>
      );
    } else {      
      return (
        <InjectionSelectionWrapper>
          <InjectionHistory            
            injectionHistory={this.state.injectionData} 
            patientInfo={this.props.patientInfo}   
            patientId={this.props.patientId}   
            copyOrder={this.copyOrder}
            copyOrders={this.copyOrders}
            stopPeriodRp={this.stopPeriodRp}
            stopPeriodOrder={this.stopPeriodOrder}
            stopPeriodInjectionCategory={this.stopPeriodInjectionCategory}
            editOrders={this.editOrders}
            registerSet={this.registerSet}
            doctors={this.props.doctors}
            setDoctorInfo={this.props.setDoctorInfo}
            changeDepartment={this.changeDepartment}
            printOrders={this.printOrders}        
            openNotConsentedModal={this.props.openNotConsentedModal}        
            openSomeCompletedCancel={this.props.openSomeCompletedCancel}        
            isNotConsentedPopup={this.props.isNotConsentedPopup}
            deselectItem={this.props.deselectItem}    
            getDelData={this.props.getDelData}
            deselectInjectionItem={this.props.deselectInjectionItem}
            scrollAddInjectionHistoryData={this.props.scrollAddInjectionHistoryData}
            match={this.props.match}
            stopGetHistory={this.state.stopGetHistory}
            setInjectionHistory={this.props.setInjectionHistory}
            initInjectData={this.props.initInjectData}
            cacheSerialNumber={this.props.cacheSerialNumber}
          />        
        </InjectionSelectionWrapper>
      );    
    }
  }
}

InjectionSelection.propTypes = {
  isLoaded: PropTypes.bool,
  patientId: PropTypes.number,
  copyOrder: PropTypes.func,
  copyOrders: PropTypes.func,
  stopPeriodRp: PropTypes.func,
  stopPeriodOrder: PropTypes.func,
  stopPeriodInjectionCategory: PropTypes.func,
  editOrders: PropTypes.func,
  registerSet: PropTypes.func,
  changeDepartment: PropTypes.func,
  printOrders: PropTypes.func,
  doctors: PropTypes.array,
  setDoctorInfo: PropTypes.func,
  injectionHistory: PropTypes.array,
  patientInfo: PropTypes.array,
  // isEditingIndex: PropTypes.number,
  openNotConsentedModal: PropTypes.func,
  openSomeCompletedCancel: PropTypes.func,
  isNotConsentedPopup: PropTypes.bool,
  deselectItem: PropTypes.func,
  deselectInjectionItem: PropTypes.func,
  getDelData: PropTypes.func,
  scrollAddInjectionHistoryData: PropTypes.func,
  setInjectionHistory: PropTypes.func,
  initInjectData: PropTypes.func,
  match: PropTypes.object,
  cacheSerialNumber: PropTypes.number,
};

export default InjectionSelection;
