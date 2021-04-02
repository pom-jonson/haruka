import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
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
   width: 216px;
   height: 50vh;
    overflow-y: scroll;
    border: solid 1px rgb(206,212,218);
   }
   svg {
    width: 46px;
    margin-top: -7px;
   }
   .footer {
    button {
      margin-left: 77%;
      margin-top: 10px;
    }
    span {
      font-weight: normal;
    }
   }
 `;

class ChangePatientModal extends Component {
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

  selectType = (e) => {
    let filterData = this.props.staff_list.filter(
        option => option.type === parseInt(e.target.value)
    );
    this.setState({staff_list:filterData});
  };

  render() {    
    return  (
        <Modal show={true} id="add_contact_dlg"  className="master-modal staff-modal">
          {/*<Modal.Header closeButton>*/}
          {/*  <Modal.Title>スタッフサイン</Modal.Title>*/}
          {/*</Modal.Header>*/}
          <Modal.Body>
            <Wrapper>
              <div className="search-box">

              </div>

              <div className="footer text-center">
                <Button onClick={this.props.handleOk}>はい</Button>
                <Button onClick={this.props.closeModal}>いいえ</Button>
              </div>
            </Wrapper>
          </Modal.Body>
        </Modal>
    );
  }
}

ChangePatientModal.contextType = Context;

ChangePatientModal.propTypes = {
  staff_list: PropTypes.array,
  staff_types:PropTypes.array,
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  getStaff: PropTypes.func,
};

export default ChangePatientModal;
