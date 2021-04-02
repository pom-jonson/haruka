import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import SupplierButton from "../atoms/SupplierButton";

const ClearAll = styled(FontAwesomeIcon)`
  cursor: ${({ modified }) => (modified ? "pointer" : "normal")};
`;

class MedicineSupplier extends Component {
  initialState = {
    modified: false,
    supplyPlace: null,
    medicineType: null
  };

  state = this.initialState;

  updateSupplyPlace = supplyPlace => () =>
    this.setState({ supplyPlace, modified: true });
  updateMedicineType = medicineType => () =>
    this.setState({ medicineType, modified: true });
  clearAll = () => this.setState(this.initialState);

  render() {
    return (
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="btn-group col" role="group">
            <SupplierButton
              fn={this.updateSupplyPlace("in")}
              supplyPlace={this.state.supplyPlace}
              supplyCondition="in"
              title="院内処方"
            />
            <SupplierButton
              fn={this.updateSupplyPlace("out")}
              supplyPlace={this.state.supplyPlace}
              supplyCondition="out"
              title="院外処方"
            />
          </div>
          <div className="btn-group col" role="group">
            <SupplierButton
              fn={this.updateMedicineType("in")}
              supplyPlace={this.state.medicineType}
              supplyCondition="in"
              title="内服"
            />
            <SupplierButton
              fn={this.updateMedicineType("out")}
              supplyPlace={this.state.medicineType}
              supplyCondition="out"
              title="外服"
            />
            <SupplierButton
              fn={this.updateMedicineType("patch")}
              supplyPlace={this.state.medicineType}
              supplyCondition="patch"
              title="外服(湿布)"
            />
            <SupplierButton
              fn={this.updateMedicineType("self")}
              supplyPlace={this.state.medicineType}
              supplyCondition="self"
              title="在宅自己注射"
            />
          </div>
          <div className="col">
            <ClearAll
              modified={this.state.modified}
              onClick={this.clearAll}
              icon={faTimesCircle}
              size="2x"
              color={this.state.modified ? "red" : "grey"}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default MedicineSupplier;
