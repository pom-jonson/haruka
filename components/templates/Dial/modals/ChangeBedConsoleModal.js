import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import RadioButton from "~/components/molecules/RadioInlineButton"
import * as apiClient from "~/api/apiClient";
import Spinner from "react-bootstrap/Spinner";
import Button from "../../../atoms/Button";

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
    // color:;
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

 const SpinnerWrapper = styled.div`
   padding: 0;
 `;

class ChangeBedConsoleModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data_list:[],
      is_loaded:false,
    }
  }

  async componentDidMount () {
    let path = "/app/api/v2/dial/board/search_bed_console";
    let post_data = {
      type:this.props.modal_kind,
      schedule_date:this.props.schedule_date,
      time_zone:this.props.time_zone,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          data_list:res,
          is_loaded:true,
        })
      })
      .catch(() => {
      });
  }

  getStaff = (e) => {
    let item = this.state.data_list[parseInt(e.target.value)];
    if(this.props.modal_kind == "bed_no"){
      this.props.setValue(this.props.modal_kind, item['number'], item['default_console_code']);
    } else {
      this.props.setValue(this.props.modal_kind, item['code']);
    }
  };
  onHide = () => {}

  render() {
    let data_list = [];
    if(this.state.data_list.length > 0){
      this.state.data_list.map((item, index) => {
        data_list.push(
          <RadioButton
            key={index}
            id={`patient_${index}`}
            label={item.name}
            value={index}
            getUsage={this.getStaff}
            checked={index === this.state.bed_number}
          />
        );
        });
    }
    return  (
        <Modal show={true} onHide={this.onHide} id="add_contact_dlg"  className="master-modal bed-modal">
          <Modal.Header>
            <Modal.Title>{this.props.modal_kind == "bed_no" ? "ベッドNo" : "コンソールNo"}選択</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>
              {this.state.is_loaded ? (
                <>
                  <div className="staff-list">
                    {data_list}
                  </div>
                </>
              ):(
                <div className='staff-list' style={{textAlign:"center"}}>
                  <SpinnerWrapper>
                    <Spinner animation="border" variant="secondary" />
                  </SpinnerWrapper>
                </div>
              )}
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
        </Modal.Footer>
        </Modal>
    );
  }
}

ChangeBedConsoleModal.contextType = Context;

ChangeBedConsoleModal.propTypes = {
  closeModal: PropTypes.func,
  setValue: PropTypes.func,
  modal_kind: PropTypes.string,
  schedule_date: PropTypes.string,
  time_zone: PropTypes.number,
};

export default ChangeBedConsoleModal;
