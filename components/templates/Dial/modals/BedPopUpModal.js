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
  font-size: 14px;
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
   height: 70vh;
    overflow-y: scroll;
    border: solid 1px rgb(206,212,218);
    label {
      font-size: 20px;
      margin-bottom: 0;
    }
   }
   .foQzBm > input:checked + label {
    background-color: none;    
}
.foQzBm > input:hover + label {
    background-color: #e6f7ff;
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

class BedPopUpModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  getStaff = (e) => {
      if (this.props.modal_kind === "ベッドNo"){
          this.setState({bed_number: parseInt(e.target.value)});
          this.props.selectBed(parseInt(e.target.value));
      } else {
          this.setState({bed_number: parseInt(e.target.value)});
          this.props.selectConsole(parseInt(e.target.value));
      }
  };
  onHide = () => {}

  render() {
    let data_list = [];
    let props_array = [];
    if (this.props.modal_kind === "ベッドNo"){
        props_array = this.props.bed_list;
    } else {
        props_array = this.props.console_list;
    }

    if(props_array.length > 0){
        props_array.map((staff, index) => {
            if(staff.is_enabled === 1){
                data_list.push(
                    <RadioButton
                        key={index}
                        id={`patient_${index}`}
                        label={staff.name}
                        value={index}
                        getUsage={this.getStaff}
                        checked={index === this.state.bed_number}
                    />
                );
            }
        });
    }

    return  (
        <Modal show={true} onHide={this.onHide} id="add_contact_dlg"  className="master-modal bed-modal">
          <Modal.Header>
            <Modal.Title>{this.props.modal_kind}選択</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className="search-box">
              </div>
              <div className="staff-list">
                {data_list}
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
          </Modal.Footer>
        </Modal>
    );
  }
}

BedPopUpModal.contextType = Context;

BedPopUpModal.propTypes = {
  bed_list: PropTypes.array,
    console_list: PropTypes.array,
  closeModal: PropTypes.func,
    selectBed: PropTypes.func,
    selectConsole: PropTypes.func,
    modal_kind: PropTypes.string,

};

export default BedPopUpModal;
