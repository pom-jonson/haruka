import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Button from "~/components/atoms/Button";
import Checkbox from "~/components/molecules/Checkbox";
import SelectDoneReservationDateTime from "~/components/templates/Nurse/patient_certification/SelectDoneReservationDateTime";
import InputResult from "~/components/templates/Nurse/patient_certification/InputResult";

const Wrapper = styled.div`  
  width: 100%;
  height: 100%;
  font-size: 1rem;
  overflow-y:auto;
  .flex{display: flex;}
  .justify-content {
    align-items: flex-start;
    justify-content: space-between;
  }
  .select-check {
    display:flex;
    label {
      font-size:1rem;
      line-height:2rem;
    }
  }
  .patient-info {
    width:60%;
    .div-title {
      line-height:2rem;
      min-width:5rem;
    }
    .div-value {
      height:2rem;
      line-height:2rem;
      border:1px solid #aaa;
      padding:0 0.2rem;
    }
    .patient-blood {
      border:1px solid #aaa;
      width:5rem;
      height:5rem;
      line-height:5rem;
      text-align: center;
    }
    .result-message {
      border:1px solid #aaa;
      padding:0.2rem;
      width:100%;
      height:5rem;
      overflow-y:auto
    }
    .patient-number {
      width:10rem;
      div{margin-top:0;}
      .label-title {
        display:none;
      }
      input {
        font-size:1rem;
        height:2rem;
        width:100%;
      }
    }
  }
  .result-view {
    width:38%;
    border:1px solid #aaa;
    display:flex;
    height: 17.5rem;
    align-items: center;
    text-align: center;
    .result-icon {
      width: 100%;
      font-size: 2rem;
      font-weight: bold;
    }
  }
  .slip-area {
    margin-top:0.5rem;
    .border-1px {border:1px solid #aaa;}
    .border-top {border-top:1px solid #aaa !important;}
    .border-left {border-left:1px solid #aaa !important;}
    .border-right {border-right:1px solid #aaa !important;}
    .border-bottom {border-bottom:1px solid #aaa !important;}
    .confirm-div {
      background-color:#e2e2e2;
      width:3rem;
      line-height:4rem;
      text-align:center;
      cursor: pointer;
    }
    .order-title {
      width:20rem;
      div{line-height:2rem;}
      padding:0 0.2rem;
    }
    .nurse-info {
      width:calc(100% - 24rem);
      .div-title {width:8rem;}
      .div-date {width:10rem;}
      div{line-height:2rem;}
      padding:0 0.2rem;
    }
    .order-info {
      div{line-height:2rem;}
      .item-title {width:5rem;}
      padding:0 0.2rem;
    }
  }
  .hankaku-eng-num-input {
    ime-mode: inactive;
    input{
      ime-mode: inactive;
    }
  }
`;

class PatientCertification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      continue_certific:0,
      input_patient_id:0,
      isOpenSelectDoneReservationDateTime:false,
      isOpenInputResult:false,
    };
  }
  
  setCheckState = (name, value) => {
    this.change_flag = 1;
    this.setState({[name]: value});
  }
  
  openSelectDoneReservationDateTime=()=>{
    this.setState({isOpenSelectDoneReservationDateTime:true});
  }
  
  closeModal=(act)=>{
    this.setState({
      isOpenSelectDoneReservationDateTime:false,
      isOpenInputResult:act == "open_input_result" ? true : false,
    });
  }
  
  setNumericValue = (key,e) => {
    this.setState({[key]: e.target.value});
  }

  render() {
    return (
      <>
        <Modal
          show={true}
          className="custom-modal-sm patient-certification first-view-modal"
        >
          <Modal.Header><Modal.Title>患者認証</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className={'select-check flex'}>
                <Checkbox
                  label="連続で処理を行う"
                  getRadio={this.setCheckState.bind(this)}
                  value={this.state.continue_certific}
                  name="continue_certific"
                />
              </div>
              <div style={{marginTop:"0.5rem", fontSize:"1.25rem", marginBottom:"0.5rem"}}>患者情報</div>
              <div className={'flex justify-content'}>
                <div className={'patient-info'}>
                  <div className={'flex justify-content'}>
                    <div style={{width:"45%"}}>
                      <div className={'flex'}>
                        <div className={'div-title'}>患者ID</div>
                        <div className={'div-value patient-number'}>{this.props.authenticate_data.patient.patientNumber}</div>
                      </div>
                      <div className={'flex'} style={{marginTop:"0.5rem"}}>
                        <div className={'div-title'}>病棟</div>
                        <div className={'div-value'} style={{minWidth:"8rem"}}>{this.props.authenticate_data.prescription.ward_name}</div>
                      </div>
                      <div className={'flex'} style={{marginTop:"0.5rem"}}>
                        <div className={'div-title'}>ベッド</div>
                        <div className={'div-value'} style={{minWidth:"8rem"}}>{this.props.authenticate_data.prescription.bed_name}</div>
                      </div>
                      <div className={'flex'} style={{marginTop:"0.5rem"}}>
                        <div className={'div-title'}>診療科</div>
                        <div className={'div-value'} style={{minWidth:"8rem"}}>{this.props.authenticate_data.prescription.hospital_department_name}</div>
                      </div>
                    </div>
                    <div style={{width:"50%"}}>
                      <div className={'flex'}>
                        <div className={'div-title'}>患者氏名</div>
                        <div className={'div-value'} style={{width:"20rem"}}>{this.props.authenticate_data.patient.name}</div>
                      </div>
                      <div className={'flex'} style={{marginTop:"0.5rem"}}>
                        <div className={'div-title'}> </div>
                        <div className={'div-title'} style={{marginRight:"0.5rem"}}>ABO</div>
                        <div className={'div-title'}>Rh</div>
                      </div>
                      <div className={'flex'}>
                        <div className={'div-title'}> </div>
                        <div className={'patient-blood'} style={{marginRight:"0.5rem"}}>{this.props.authenticate_data.prescription.blood_type}</div>
                        <div className={'patient-blood'}>{this.props.authenticate_data.prescription.blood_rh}</div>
                      </div>
                    </div>
                  </div>
                  <div className={'flex'} style={{marginTop:"0.5rem"}}>
                    <div className={'div-title'} style={{width:"10rem"}}>オーダーバーコード</div>
                    <div className={'div-value'} style={{width:"calc(100% - 10rem)"}}>123456789123</div>
                  </div>
                  <div className={'result-message'} style={{marginTop:"0.5rem"}}>
                  
                  </div>
                </div>
                <div className={'result-view'}>
                  <div className={'result-icon'}>〇</div>
                </div>
              </div>
              <div className={'slip-area'}>
                <div className={'flex border-1px'}>
                  <div className={'confirm-div border-right'} onClick={this.openSelectDoneReservationDateTime.bind(this)}>○</div>
                  <div className={'order-title border-right'}>
                    <div>入院注射</div>
                    <div style={{cursor:"pointer"}}>YYYY/MM/DD HH:MI</div>
                  </div>
                  <div className={'nurse-info'}>
                    <div className={'flex'}>
                      <div className={'div-title'}>指示開始日時：</div>
                      <div className={'div-date'}> </div>
                      <div className={'div-title'}>依頼者：</div>
                      <div> </div>
                    </div>
                    <div className={'flex'}>
                      <div className={'div-title'}>実施日時：</div>
                      <div className={'div-date'}> </div>
                      <div className={'div-title'}>実施者：</div>
                      <div> </div>
                    </div>
                  </div>
                </div>
                <div className={'flex border-1px'} style={{marginTop:"-1px"}}>
                  <div style={{width:"3rem"}} className={'border-right'}> </div>
                  <div style={{width:"calc(100% - 3rem)"}}>
                    <div className={'flex border-bottom'}>
                      <div className={'order-title border-right'}> </div>
                      <div className={'nurse-info'}>
                        <div className={'flex'}>
                          <div className={'div-title'}>指示受け日時：</div>
                          <div className={'div-date'}> </div>
                          <div className={'div-title'}>指示受け者：</div>
                          <div> </div>
                        </div>
                        <div className={'flex'}>
                          <div className={'div-title'}>指示確認日時：</div>
                          <div className={'div-date'}> </div>
                          <div className={'div-title'}>指示確認者：</div>
                          <div> </div>
                        </div>
                      </div>
                    </div>
                    <div className={'order-info'}>
                      <div className={'flex'}>
                        <div className={'item-title'}>手技：</div>
                        <div className={'item-value'}>中心静脈メイン</div>
                      </div>
                      <div className={'flex'}>
                        <div className={'item-title'}>薬品：</div>
                        <div className={'item-value'}>ドブトレックス注射液100ｍｇ</div>
                      </div>
                      <div className={'flex'}>
                        <div className={'item-title'}>用法：</div>
                        <div className={'item-value'}>注射用法</div>
                      </div>
                      <div className={'flex'}>
                        <div className={'item-title'}>速度：</div>
                        <div className={'item-value'}>時間当たり</div>
                      </div>
                      <div className={'flex'}>
                        <div className={'item-title'}>実施場：</div>
                        <div className={'item-value'}>西２階病棟</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
          </Modal.Footer>
          {this.state.isOpenSelectDoneReservationDateTime && (
            <SelectDoneReservationDateTime
              closeModal={this.closeModal}
            />
          )}
          {this.state.isOpenInputResult && (
            <InputResult
              closeModal={this.closeModal}
            />
          )}
        </Modal>
      </>
    );
  }
}

PatientCertification.propTypes = {
  closeModal: PropTypes.func,
  authenticate_data: PropTypes.object,
};

export default PatientCertification;
