import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import Radiobox from "~/components/molecules/Radiobox";

const Wrapper = styled.div`
    overflow-y: auto;
    height: 100%;
    .flex {
        display: flex;
    }
  
    .first-medical {
        -webkit-box-pack: justify;
        justify-content: space-between;
        .block-area {
          width: 45%;
          border: 1px solid #aaa;
          margin-top: 20px;
          padding: 10px;
          position: relative;
          color: black;
          label {
            font-size: 14px;
            width:auto; 
          }
        }
        .block-title {
          position: absolute;
          top: -12px;
          left: 10px;
          font-size: 18px;
          background-color: white;
          padding-left: 5px;
          padding-right: 5px;
        }
    }
`;

class SelectVisitDiagnosisTypeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visit_type:2,
      diagnosis_type:1,
    }
  }

  handleOk=()=>{
    this.props.handleOk(this.state.visit_type, this.state.diagnosis_type);
  }

  setVisitType = (e) => {
    this.setState({visit_type:parseInt(e.target.value)});
  }

  setDiagnosisType = (e) => {
    this.setState({diagnosis_type:parseInt(e.target.value)});
  }

  render() {
    return (
      <>
        <Modal show={true} className="custom-modal-sm patient-exam-modal select-visit-diagnosis-type-modal">
          <Modal.Body>
            <Wrapper>
              <div className={'first-medical flex'}>
                <div className={'block-area'}>
                  <div className={'block-title'}>初再診</div>
                  <Radiobox
                    label={'未設定'}
                    value={0}
                    getUsage={this.setVisitType.bind(this)}
                    checked={this.state.visit_type == 0 ? true : false}
                    disabled={true}
                    name={`visit_type`}
                  />
                  <Radiobox
                    label={'初診'}
                    value={1}
                    getUsage={this.setVisitType.bind(this)}
                    checked={this.state.visit_type == 1 ? true : false}
                    disabled={true}
                    name={`visit_type`}
                  />
                  <Radiobox
                    label={'再診'}
                    value={2}
                    getUsage={this.setVisitType.bind(this)}
                    checked={this.state.visit_type == 2 ? true : false}
                    disabled={true}
                    name={`visit_type`}
                  />
                </div>
                <div className={'block-area'}>
                  <div className={'block-title'}>診察区分</div>
                  <Radiobox
                    label={'未設定'}
                    value={0}
                    getUsage={this.setDiagnosisType.bind(this)}
                    checked={this.state.diagnosis_type == 0 ? true : false}
                    disabled={true}
                    name={`diagnosis_type`}
                  />
                  <Radiobox
                    label={'対面'}
                    value={1}
                    getUsage={this.setDiagnosisType.bind(this)}
                    checked={this.state.diagnosis_type == 1 ? true : false}
                    disabled={true}
                    name={`diagnosis_type`}
                  />
                  <Radiobox
                    label={'電話'}
                    value={2}
                    getUsage={this.setDiagnosisType.bind(this)}
                    checked={this.state.diagnosis_type == 2 ? true : false}
                    disabled={true}
                    name={`diagnosis_type`}
                  />
                </div>
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className={'red-btn'} onClick={this.handleOk}>確定</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
SelectVisitDiagnosisTypeModal.contextType = Context;
SelectVisitDiagnosisTypeModal.propTypes = {
  handleOk: PropTypes.func,
};

export default SelectVisitDiagnosisTypeModal;
