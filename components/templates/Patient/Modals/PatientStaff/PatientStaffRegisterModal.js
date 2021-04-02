import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import RadioButton from "~/components/molecules/RadioInlineButton"
import Button from "~/components/atoms/Button";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  width: 100%;
  height: 100%;
  flex-direction: column;
  display: flex;
  text-align: center;
  .form-control {
    width: 216px;
    font-size: 12px;
   }
   .staff-list {
   width: 100%;
   height: 50vh;
    overflow-y: scroll;
    border: solid 1px rgb(206,212,218);
    label {
      font-size: 14px;
      }
   }
   svg {
    width: 46px;
    margin-top: -7px;
   }
 `;

class PatientStaffRegisterModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      staff_type: 0,
      staff_list: this.props.staff_list,
      staff_number: 0,
    }
  }
  register = () => {
    this.props.getStaff(this.state.staff_number);
  };

  getStaff = (e) => {
    this.setState({staff_number: parseInt(e.target.value)});
  };

  render() {
    const staff_list = [];
    this.state.staff_list.map((staff, index) => {
      staff_list.push(
          <RadioButton
              key={index}
              id={index}
              label={staff.name}
              value={staff.number}
              getUsage={this.getStaff}
              checked={staff.number === this.state.staff_number}
          />
      );
    });
    return  (
        <Modal show={true} id="add_contact_dlg"  className="basic-info-view-modal haruka-staff-modal">
          <Modal.Header>
            <Modal.Title>スタッフ</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className="staff-list">
                {staff_list}
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            <Button className="red-btn" onClick={this.register}>登録</Button>
          </Modal.Footer>
        </Modal>
    );
  }
}

PatientStaffRegisterModal.contextType = Context;

PatientStaffRegisterModal.propTypes = {
  staff_list: PropTypes.array,
  staff_types:PropTypes.array,
  closeModal: PropTypes.func,
  getStaff: PropTypes.func,
};

export default PatientStaffRegisterModal;
