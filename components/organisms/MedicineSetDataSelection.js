import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
// import MedicineList from "../molecules/MedicineList";
import MedicineSetDataHistory from "../organisms/MedicineSetDataHistory";
// import Spinner from "react-bootstrap/Spinner";

const MedicineSelectionWrapper = styled.div`
  width: 100%;
`;

// const MedicineOtherWrapper = styled.div`
//   display: none;
//   width: 100%;
//   max-height: 130px;
//   overflow: auto;
// `;

// const SpinnerWrapper = styled.div`
//   height: 200px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;

class MedicineSetDataSelection extends Component {
  state = {
    medicineData: this.props.medicineHistory
  };

  async componentDidMount() {}

  copyOrder = order => {
    return this.props.copyOrder(order);
  };

  copyOrders = orders => {
    return this.props.copyOrders(orders);
  };

  editOrders = prescription => {    
    this.props.editOrders(prescription);
  };

  deleteOrders = prescription => {       
    this.props.deleteOrders(prescription);
  };

  render() {
    // const medicineList = [];
    // this.state.medicineData.forEach((medicine, index) => {
    //   medicineList.push(
    //     <MedicineList
    //       key={index}
    //       medicineId={medicine.code}
    //       medicineName={medicine.name}
    //       main_unit={medicine.main_unit}
    //       units={medicine.units}
    //       moveList={this.props.moveList}
    //     />
    //   );
    // });

    return (
        <MedicineSelectionWrapper>
          <MedicineSetDataHistory
            ref={ref => (this.MedicineHistory = ref)}
            patientId={this.props.patientId}
            allPrescriptionOpen={this.props.allPrescriptionOpen}
            doctors={this.props.doctors}
            doctor_code={this.props.doctor_code}
            doctor_name={this.props.doctor_name}
            setDoctorInfo={this.props.setDoctorInfo}
            medicineHistory={this.props.medicineHistory}
            match={this.props.match}
            copyOrder={this.copyOrder}
            copyOrders={this.copyOrders}
            editOrders={this.editOrders}
            deleteOrders={this.deleteOrders}
          />
          {/* <MedicineOtherWrapper>{medicineList}</MedicineOtherWrapper> */}
        </MedicineSelectionWrapper>
      );
  }
}

MedicineSetDataSelection.propTypes = {
  isLoaded: PropTypes.bool,
  patientId: PropTypes.number,
  allPrescriptionOpen: PropTypes.boolean,
  doctors: PropTypes.array,
  doctor_code: PropTypes.number,
  doctor_name: PropTypes.string,
  setDoctorInfo: PropTypes.func,
  medicineHistory: PropTypes.array,
  copyOrder: PropTypes.func,
  copyOrders: PropTypes.func,
  editOrders: PropTypes.func,
  deleteOrders: PropTypes.func,
  match: PropTypes.object
};

export default MedicineSetDataSelection;
