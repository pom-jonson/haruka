import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";

const Wrapper = styled.div`
  .content{
    padding-left:50px;
    label{
      width:100%;
      font-size:20px;
    }
    textarea{
      width:470px;
      height:200px;
    }
  }
  .footer {
    text-align:center;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225); 
      border: none;  
      margin-right: 20px;    
    }    
    span {
      color: white;
      font-size: 16px;
      padding-left: 35px;
      padding-right: 35px;
      font-weight: 100;
    }    
}
.no-padding{
  padding:0;
}
td label{
  display:none;
}
 `;

class AddDiseaseModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        cur_disease: props.modal_data !== undefined ? props.modal_data.body : "",
    };
  }

  componentDidMount() {
      var base_modal = document.getElementsByClassName("wordPattern-modal")[0];
      if(base_modal !== undefined && base_modal != null){
          base_modal.style['z-index'] = 1040;
      }
  }
  
  componentWillUnmount() {
      var base_modal = document.getElementsByClassName("wordPattern-modal")[0];
      if(base_modal !== undefined && base_modal != null){
          base_modal.style['z-index'] = 1050;
      }
  }

    getSending = (e) => {
    this.setState({cur_disease:e.target.value});
  };

  addSending = () => {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let data = {
        system_patient_id: this.props.system_patient_id,
        category_1: "現症",
        category_2: "現症",
        instruction_doctor_number: authInfo.doctor_number,
        body: this.state.cur_disease,
        schedule_date: this.props.schedule_date
    };
    if (this.props.modal_data !== undefined ){
        data.number = this.props.modal_data.number;
        data.write_date = this.props.modal_data.write_date;
    }

    let path = "/app/api/v2/dial/board/Soap/disease_register";
    apiClient.post(path, {
        params: data
    }).then(() => {
        this.props.handleOk();
    }).catch(() => {
    });
  };

    closeModal = () => {
        this.props.closeModal();
    };

    onHide=()=>{}

  render() {
    return  (
        <Modal show={true} onHide={this.onHide} id="add_contact_dlg"  className="master-modal">
          <Modal.Header>
            <Modal.Title>
                現 症 追 加
              </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className="content">
                <label>現症を入力してください。</label>
                  <textarea
                      onChange={this.getSending.bind(this)}
                      value={this.state.cur_disease}
                  />
              </div>
              <div className="footer-buttons">
                      <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
                      <Button className="red-btn" onClick={this.addSending.bind(this)}>登録</Button>
              </div>
            </Wrapper>
          </Modal.Body>
        </Modal>
    );
  }
}

AddDiseaseModal.contextType = Context;

AddDiseaseModal.propTypes = {    
  closeModal:PropTypes.func,
  handleOk:PropTypes.func,
  patientInfo:PropTypes.object,
  schedule_date: PropTypes.string,
  system_patient_id:PropTypes.number,
  modal_data: PropTypes.array,
};

export default AddDiseaseModal;
