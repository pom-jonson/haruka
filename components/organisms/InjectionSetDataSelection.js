import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import InjectionSetDataHistory from "./InjectionSetDataHistory";

const InjectionSelectionWrapper = styled.div`
  width: 100%;
`;

class InjectionSetDataSelection extends Component {
  state = {
    injectionData: this.props.injectionHistory
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
    return (
        <InjectionSelectionWrapper>
          <InjectionSetDataHistory
            ref={ref => (this.InjectionHistory = ref)}
            allPrescriptionOpen={this.props.allPrescriptionOpen}
            doctors={this.props.doctors}
            doctor_code={this.props.doctor_code}
            doctor_name={this.props.doctor_name}
            setDoctorInfo={this.props.setDoctorInfo}
            injectionHistory={this.props.injectionHistory}
            match={this.props.match}
            copyOrder={this.copyOrder}
            copyOrders={this.copyOrders}
            editOrders={this.editOrders}
            deleteOrders={this.deleteOrders}
          />
        </InjectionSelectionWrapper>
      );
  }
}

InjectionSetDataSelection.propTypes = {
  isLoaded: PropTypes.bool,
  allPrescriptionOpen: PropTypes.boolean,
  doctors: PropTypes.array,
  doctor_code: PropTypes.number,
  doctor_name: PropTypes.string,
  setDoctorInfo: PropTypes.func,
  injectionHistory: PropTypes.array,
  copyOrder: PropTypes.func,
  copyOrders: PropTypes.func,
  editOrders: PropTypes.func,
  deleteOrders: PropTypes.func,
  match: PropTypes.object
};

export default InjectionSetDataSelection;
