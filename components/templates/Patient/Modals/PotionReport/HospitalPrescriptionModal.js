import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";

const Wrapper = styled.div`
  display: block;
  max-width: 100%;
  overflow: auto;
  position: relative;
`;

export class HospitalPrescriptionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDeleteConfirmModal: false,
      is_loaded:false,
    };
  }

  async componentDidMount() {
  }

  confirmCancel() {
    this.setState({
      isDeleteConfirmModal: false,
      confirm_message: "",
    });
  }

  onHide=()=>{};

    selectSearchTypeNo = (e) => {
        this.setState({ search_type: parseInt(e.target.value)}, ()=>{
        });
    };

  render() {
    return (
      <Modal show={true} className="custom-modal-sm routine-input-panel-modal first-view-modal" onHide={this.onHide}>
        <Modal.Header>
          <Modal.Title>入院処方指示</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>

          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeModal}>確定</Button>
          <Button onClick={this.props.closeModal}>閉じる</Button>
        </Modal.Footer>
        {this.state.isDeleteConfirmModal !== false && (
            <SystemConfirmJapanModal
                hideConfirm= {this.confirmCancel.bind(this)}
                confirmCancel= {this.confirmCancel.bind(this)}
                confirmOk= {this.deleteData.bind(this)}
                confirmTitle= {this.state.confirm_message}
            />
        )}
      </Modal>
    );  
  }
}
HospitalPrescriptionModal.contextType = Context;
HospitalPrescriptionModal.propTypes = {
  closeModal: PropTypes.func,
  patientInfo: PropTypes.object,
  patientId: PropTypes.number,
};

export default HospitalPrescriptionModal;
