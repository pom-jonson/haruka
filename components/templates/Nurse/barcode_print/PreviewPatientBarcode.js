import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import * as apiClient from "~/api/apiClient";
import Button from "~/components/atoms/Button";
import Spinner from "react-bootstrap/Spinner";

const Wrapper = styled.div`  
 width: 100%;
 height: 100%;
 font-size: 1rem;
 overflow-y:auto;
 .flex{display: flex;}
 .barcode-area {
    width:270px;
    border:1px solid #aaa;
    padding: 0 0.5rem;
    line-height: 4rem;
    text-align: center;
  }
 .patient-name {
    width:50%;
    margin-left: 1rem;
    div {line-height:2rem;}
 }
`;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class PreviewPatientBarcode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load_flag:false,
      first_name:"",
      second_name:"",
      barcode:null,
    };
  }
  
  async componentDidMount() {
    await this.searchSoapFocusRecord();
  }

  searchSoapFocusRecord=async()=>{
    let path = "/app/api/v2/ward/get/patient_bracode_preview_info";
    let post_data = {
      preview_number:this.props.preview_number,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        let patient_name = res.patient_name.split('　');
        let first_name = "";
        let second_name = "";
        if(patient_name[1] != undefined){
          first_name = patient_name[0];
          second_name = patient_name[1];
        } else {
          patient_name = res.patient_name.split(' ');
          if(patient_name[1] != undefined){
            first_name = patient_name[0];
            second_name = patient_name[1];
          } else {
            first_name = res.patient_name;
          }
        }
        this.setState({
          load_flag:true,
          first_name,
          second_name,
          barcode:res.barcode,
        });
      })
      .catch(() => {

      });
  };

  render() {
    return (
      <>
        <Modal
          show={true}
          className="custom-modal-sm preview-patient-barcode first-view-modal"
        >
          <Modal.Header><Modal.Title>印刷プレビュー</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              {this.state.load_flag ? (
                <div className={'flex'}>
                  <div className={'barcode-area'}>
                    <img src={this.state.barcode} alt="" />
                  </div>
                  <div className={'patient-name'}>
                    <div>患者氏名（姓）{this.state.first_name}</div>
                    <div>患者氏名（名）{this.state.second_name}</div>
                  </div>
                </div>
              ):(
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              )}
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            <Button className={"red-btn"} onClick={this.props.print}>印刷</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

PreviewPatientBarcode.propTypes = {
  closeModal: PropTypes.func,
  print: PropTypes.func,
  preview_number: PropTypes.number,
};

export default PreviewPatientBarcode;
