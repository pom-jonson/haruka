import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import MedicineList from "../molecules/MedicineList";
import MedicineHistory from "../organisms/MedicineHistory";
import Spinner from "react-bootstrap/Spinner";

const MedicineSelectionWrapper = styled.div`
  width: 100%;
`;

const MedicineOtherWrapper = styled.div`
  display: none;
  width: 100%;
  max-height: 130px;
  overflow: auto;
`;

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class MedicineSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      medicineData: this.props.medicineHistory,
      focus: 0,
      inOut: 0,
      diagnosis_division: 1,
      drug_division: 0,
      // isEditingIndex: this.props.isEditingIndex,
      stopGetHistory: false,
      isLoaded: this.props.isLoaded
    };

    this.timer = "";
  }


  copyOrder = (order, type) => {
    return this.props.copyOrder(order, type);
  };

  copyOrders = (orders, type) => {
    return this.props.copyOrders(orders, type);
  };

  editOrders = (prescription, is_done = false) => {
    this.props.editOrders(prescription, is_done);
  };

  registerSet = (prescription, type) => {
    this.props.registerSet(prescription, type);
  };

  changeDepartment = prescription => {
    this.props.changeDepartment(prescription);
  };

  printOrders = prescription => {
    this.props.printOrders(prescription);
  };

  isOrderNumberList = () => {
    var orderNumberList = this.MedicineHistory.isOrderNumberList();
    return orderNumberList;
  };

  // testMedRender = (medicineHistory, isEditingIndex = -1) => {
  //   let set_state = {
  //     medicineData: medicineHistory
  //   };
  //   if (isEditingIndex != -1){
  //     set_state.isEditingIndex = isEditingIndex;
  //   }
  //   this.setState(set_state);
  // }

  testMedRender = (medicineHistory) => {
    let set_state = {
      medicineData: medicineHistory
    };
    this.setState(set_state);
  }

  testIsLoadedRender = (isLoaded = false) => {
    this.setState({
      isLoaded: isLoaded
    });
  }

  testStopGetHistoryRender = (bFlag = false) => {
    this.setState({stopGetHistory: bFlag});
  }

  render() {
    const medicineList = [];
    this.state.medicineData.forEach((medicine, index) => {
      medicineList.push(
        <MedicineList
          key={index}
          medicineId={medicine.code}
          medicineName={medicine.name}
          main_unit={medicine.main_unit}
          units={medicine.units}
          moveList={this.props.moveList}
        />
      );
    });
    if ((Object.keys(this.props.patientInfo).length ==0) || (this.state.isLoaded == false)) {
      return (
        <SpinnerWrapper>
          <Spinner animation="border" variant="secondary" />
        </SpinnerWrapper>
      );
    } else {
      return (
        <MedicineSelectionWrapper>
          <MedicineHistory
            ref={ref => (this.MedicineHistory = ref)}
            patientId={this.props.patientId}
            copyOrder={this.copyOrder}
            copyOrders={this.copyOrders}
            editOrders={this.editOrders}
            registerSet={this.registerSet}
            changeDepartment={this.changeDepartment}
            printOrders={this.printOrders}
            allPrescriptionOpen={this.props.allPrescriptionOpen}
            doctors={this.props.doctors}
            doctor_code={this.props.doctor_code}
            doctor_name={this.props.doctor_name}
            setDoctorInfo={this.props.setDoctorInfo}
            medicineHistory={this.state.medicineData}
            patientInfo={this.props.patientInfo}
            // isEditingIndex={this.state.isEditingIndex}
            openNotConsentedModal={this.props.openNotConsentedModal}
            isNotConsentedPopup={this.props.isNotConsentedPopup}
            isNotConsentedDataLength={this.props.isNotConsentedDataLength}
            consent={this.props.consent}
            deselectItem={this.props.deselectItem}
            getDelData={this.props.getDelData}
            scrollAddHistoryData={this.props.scrollAddHistoryData}
            match={this.props.match}
            stopGetHistory={this.state.stopGetHistory}
            cacheSerialNumber={this.props.cacheSerialNumber}
            setChildState={this.props.setChildState}
            initPresData={this.props.initPresData}
          />
          <MedicineOtherWrapper>{medicineList}</MedicineOtherWrapper>
        </MedicineSelectionWrapper>
      );
    }
  }
}

MedicineSelection.propTypes = {
  isLoaded: PropTypes.bool,
  patientId: PropTypes.number,
  tab: PropTypes.number,
  getTabId: PropTypes.func,
  moveList: PropTypes.func,
  prescriptionTab: PropTypes.number,
  medical_business_diagnosing_type: PropTypes.number,
  copyOrder: PropTypes.func,
  copyOrders: PropTypes.func,
  editOrders: PropTypes.func,
  registerSet: PropTypes.func,
  changeDepartment: PropTypes.func,
  printOrders: PropTypes.func,
  allPrescriptionOpen: PropTypes.boolean,
  doctors: PropTypes.array,
  doctor_code: PropTypes.number,
  doctor_name: PropTypes.string,
  setDoctorInfo: PropTypes.func,
  medicineHistory: PropTypes.array,
  patientInfo: PropTypes.array,
  // isEditingIndex: PropTypes.number,
  openNotConsentedModal: PropTypes.func,
  isNotConsentedPopup: PropTypes.bool,
  isNotConsentedDataLength: PropTypes.number,
  consent: PropTypes.func,
  deselectItem: PropTypes.func,
  getDelData: PropTypes.func,
  scrollAddHistoryData: PropTypes.func,
  setChildState: PropTypes.func,
  initPresData: PropTypes.func,
  match: PropTypes.object,
  cacheSerialNumber: PropTypes.number,
};

export default MedicineSelection;
