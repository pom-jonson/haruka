import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "../../../atoms/Button";
import ReactToPrint from "react-to-print";
import DialRecord_A from "~/components/templates/Dial/Board/molecules/printSheets/DialRecord_A";
import DialRecord_B from "~/components/templates/Dial/Board/molecules/printSheets/DialRecord_B";
import DialRecord_C from "~/components/templates/Dial/Board/molecules/printSheets/DialRecord_C";

const Modal_Top = styled.div`
  .sheet_button {
    margin-left: 20px;
    opacity: 0.5;
  }
  .selected.sheet_button {
    opacity: 1;
    border: 2px dotted;
  }
`;

class PrintPreviewModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sheet_style: "A",
    };
  }
  closeModal = () => {
    this.props.closeModal();
  };

  switchSheet = (sheet) => {
    this.setState({ sheet_style: sheet });
  };
  render() {
    return (
      <Modal
        show={true}
        onHide={this.closeModal.bind(this)}
        id="add_contact_dlg"
        className="master-modal printer-modal"
      >
        <Modal.Body>
          <Modal_Top>
            <Button
              onClick={this.closeModal.bind(this)}
              color="primary"
              style={{ marginRight: "20px" }}
            >
              キャンセル
            </Button>
            <ReactToPrint
              trigger={() => (
                <Button size="small" color="primary">
                  印刷
                </Button>
              )}
              content={() => this.componentRef}
            />
            <Button
              onClick={this.switchSheet.bind(this, "A")}
              className={
                this.state.sheet_style == "A"
                  ? "selected sheet_button"
                  : "sheet_button"
              }
            >
              A
            </Button>
            <Button
              onClick={this.switchSheet.bind(this, "B")}
              className={
                this.state.sheet_style == "B"
                  ? "selected sheet_button"
                  : "sheet_button"
              }
            >
              B
            </Button>
            <Button
              onClick={this.switchSheet.bind(this, "C")}
              className={
                this.state.sheet_style == "C"
                  ? "selected sheet_button"
                  : "sheet_button"
              }
            >
              C
            </Button>
          </Modal_Top>
          {this.state.sheet_style == "A" && (
            <DialRecord_A
              ref={(el) => (this.componentRef = el)}
              rows_blood={this.props.rows_blood}
              rows_measure={this.props.rows_measure}
              rows_temp={this.props.rows_temp}
              schedule_data={this.props.schedule_data}
              disease={this.props.disease}
            />
          )}
          {this.state.sheet_style == "B" && (
            <DialRecord_B
              ref={(el) => (this.componentRef = el)}
              print_data={this.props.print_data}
              rows_blood={this.props.rows_blood}
              rows_measure={this.props.rows_measure}
              rows_temp={this.props.rows_temp}
              schedule_data={this.props.schedule_data}
            />
          )}
          {this.state.sheet_style == "C" && (
            <DialRecord_C
              ref={(el) => (this.componentRef = el)}
              print_data={this.props.print_data}
              rows_blood={this.props.rows_blood}
              rows_measure={this.props.rows_measure}
              rows_temp={this.props.rows_temp}
              schedule_data={this.props.schedule_data}
            />
          )}
        </Modal.Body>
      </Modal>
    );
  }
}

PrintPreviewModal.contextType = Context;

PrintPreviewModal.propTypes = {
  print_data: PropTypes.object,
  closeModal: PropTypes.func,
  rows_blood: PropTypes.array,
  rows_measure: PropTypes.array,
  rows_temp: PropTypes.array,
  schedule_data: PropTypes.object,
  disease: PropTypes.array,
};

export default PrintPreviewModal;
