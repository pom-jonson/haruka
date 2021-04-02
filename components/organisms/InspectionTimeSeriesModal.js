import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import TimeSeriesChart from "./TimeSeriesChart";
import Button from "~/components/atoms/Button";

class InspectionTimeSeriesModal extends Component {
  render() {
    return (
      <Modal
        show={true}
        id="inspectionTimeSeries_dlg"
        centered
        size="xl"  
        className="timeSeries-modal"         
      >
        <Modal.Header>
          <Modal.Title>時系列</Modal.Title>
        </Modal.Header>
        <Modal.Body>                    
          <TimeSeriesChart
          showData={this.props.showData}
          />  
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.props.closeTimeSeriesModal}>閉じる</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

InspectionTimeSeriesModal.propTypes = {
  closeTimeSeriesModal: PropTypes.func,
  showData: PropTypes.array,
};

export default InspectionTimeSeriesModal;
