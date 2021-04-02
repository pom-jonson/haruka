import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import InputWithLabel from "~/components/molecules/InputWithLabel";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  width: 100%;
  height: 100%;
  float: left;
  label {
      text-align: right;
      width: 100px;
  }
  input {
    width: 300px;
    font-size: 14px;
  }
  .pattern_code {
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px;
    .info-label {
      text-align: right;
      width: 100px;
    }
    .info-data {
        width: 300px;
        font-size: 14px;
        padding: 0px 8px;
    }
  }
  .kana_area {
    padding-top: 10px;
  }
  .name_area {
    padding-top: 20px;
  }
  .footer {
    display: flex;
    margin-top: 20px;
    margin-left: 30%;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225); 
      border: none;
      margin-right: 15px;
    }
    
    span {
      color: white;
      font-size: 0.8rem;
      font-weight: 100;
    }
}
.unit-button {
  margin: 7px 0 0 5px;
}
.flex {
  display: flex;
  flex-wrap: wrap;
  button {
    background-color: rgb(208, 213, 214);
  }
}
 `;

class PatientInformation extends Component {
  constructor(props) {
    super(props);
    let patientInfo = this.props.patientInfo;
    this.state = {
        id: patientInfo.id,
        after_weight: patientInfo.after_weight,
        bedNumber: patientInfo.bedNumber,
        before_weight: patientInfo.before_weight,
        name: patientInfo.name,
        time: patientInfo.time,
    };
  }
    setBedNumber = e => {
        this.setState({bedNumber: e.target.value})
    };
    setBeforeWeight = e => {
        this.setState({before_weight: e.target.value})
    };
    setAfterWeight = e => {
        this.setState({after_weight: e.target.value})
    };
    saveInfo = () => {
        let {before_weight, after_weight} = this.state;
        this.setState({
            before_weight: before_weight !== "" ? before_weight : 0,
            after_weight: after_weight !== "" ? after_weight : 0,
        });
      this.props.handleOk(this.state);
    };
    cancelInfo = () => {
        this.props.closeModal();
    };
    closeModal = () => {
        this.props.closeModal();
    };

    onHide=()=>{}

  render() {    
    return  (
      <Modal show={true} onHide={this.onHide} id="add_contact_dlg"  className="master-modal patient-infomation-modal">
        <Modal.Header>
          <Modal.Title>患者個別情報編集</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Wrapper>
                <div className="pattern_code">
                    <div className="info-label">予約時間</div>
                    <div className="info-data">{this.state.time}</div>
                </div>
                <div className="pattern_code">
                    <div className="info-label">患者 ID</div>
                    <div className="info-data">{this.state.id}</div>
                </div>
                <div className="pattern_code">
                    <div className="info-label">患者名</div>
                    <div className="info-data">{this.state.name}</div>
                </div>
                <InputWithLabel
                    label="ベッドNo"
                    type="text"
                    className="kana_area"
                    getInputText={this.setBedNumber.bind(this)}
                    diseaseEditData={this.state.bedNumber}
                />
                  <InputWithLabel
                      label="前体重"
                      type="text"
                      getInputText={this.setBeforeWeight.bind(this)}
                      diseaseEditData={this.state.before_weight !== 0 ? this.state.before_weight : ""}
                  />
                <InputWithLabel
                    label="後体重"
                    type="text"
                    getInputText={this.setAfterWeight.bind(this)}
                    diseaseEditData={this.state.after_weight !== 0 ? this.state.after_weight : ""}
                />
                <div className="footer-buttons">
                        <Button className="cancel-btn" onClick={this.cancelInfo}>キャンセル</Button>
                        <Button className="red-btn" onClick={this.saveInfo}>変更</Button>
                </div>
            </Wrapper>
        </Modal.Body>        
      </Modal>
    );
  }
}

PatientInformation.contextType = Context;

PatientInformation.propTypes = {
  closeModal: PropTypes.func,
    handleOk: PropTypes.func,
    patientInfo: PropTypes.object,
};

export default PatientInformation;
