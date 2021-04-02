import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import {formatJapanDate} from "~/helpers/date";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import { medicalInformationValidate } from '~/helpers/validate'
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from "jquery";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 18px;
  width: 100%;
  height: 100%;
  float: left;
  label {
      text-align: right;
      width: 200px;
      font-weight: bold;
      font-size: 18px;
      margin-right: 8px;
  }
  .label-title {
    text-align: right;
    width: 200px;
    font-weight: bold;
    font-size: 18px;
    margin: 0;
    line-height: 38px;
   }
  input {
    width: 200px !important;
    font-size: 18px;
  }
  .add-button {
      text-align: center;
  }

  .footer {
    display: flex;
    margin-left: 30%;
    margin-top: 15px;
    text-align: center;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 30px;
    }
    
    span {
      color: white;
      font-size: 20px;
      font-weight: 100;
    }
  }
`;

class BasicDataModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data != undefined ? this.props.modal_data: null;
    this.state = {
      schedule_id: modal_data !== null ? modal_data.schedule_id : 0,
      before_pressure_max: modal_data !== null ? modal_data.before_pressure_max : "",
      before_pressure_min: modal_data !== null ? modal_data.before_pressure_min : "",
      after_pressure_max: modal_data !== null ? modal_data.after_pressure_max : "",
      after_pressure_min: modal_data !== null ? modal_data.after_pressure_min : "",
      before_pulse : modal_data !== null ? modal_data.before_pulse : "",
      after_pulse : modal_data !== null ? modal_data.after_pulse : "",
      patient_id : modal_data !== null ? modal_data.patient_id : "",
      isUpdateConfirmModal : false,
      isCloseConfirmModal : false,
      confirm_message: "",
      confirm_alert_title:'',
      check_message:"",
    };
    this.change_flag = 0;
  }
  
  componentDidMount() {
    this.changeBackground();
  }
  
  componentDidUpdate () {
    this.changeBackground();
  }
  
  changeBackground = () => {
    let check_data = this.getCheckData();
    medicalInformationValidate("basic_data", check_data, "background");
  }
  
  registerData = () => {
    this.confirmCancel();
    let post_data = {
      patient_id:this.state.patient_id,
      schedule_id: this.state.schedule_id,
      before_pressure_max: this.state.before_pressure_max,
      before_pressure_min: this.state.before_pressure_min,
      after_pressure_max: this.state.after_pressure_max,
      after_pressure_min: this.state.after_pressure_min,
      before_pulse: this.state.before_pulse,
      after_pulse: this.state.after_pulse,
    };
    this.props.handleOk(post_data);
  };
  
  onChange = (key, e) => {
    var RegExp = /^\d*\.?\d*$/;
    if (!RegExp.test(e.target.value)) {
      return;
    }
    this.change_flag = 1;
    if (key === "before_pressure_max") this.setState({before_pressure_max: e.target.value});
    else if (key === "before_pressure_min") this.setState({before_pressure_min: e.target.value});
    else if (key === "after_pressure_max") this.setState({after_pressure_max: e.target.value});
    else if (key === "after_pressure_min") this.setState({after_pressure_min: e.target.value});
    else if (key === "before_pulse") this.setState({before_pulse: e.target.value});
    else if (key === "after_pulse") this.setState({after_pulse: e.target.value});
  };
  
  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isCloseConfirmModal: false,
      confirm_message: "",
      confirm_alert_title:'',
    });
  }
  
  getCheckData=()=>{
    let state_data = {};
    state_data.before_pressure_max = this.state.before_pressure_max == 0 ? "" : this.state.before_pressure_max;
    state_data.before_pressure_min = this.state.before_pressure_min == 0 ? "" : this.state.before_pressure_min;
    state_data.after_pressure_max = this.state.after_pressure_max == 0 ? "" : this.state.after_pressure_max;
    state_data.after_pressure_min = this.state.after_pressure_min == 0 ? "" : this.state.after_pressure_min;
    state_data.before_pulse = this.state.before_pulse == 0 ? "" : this.state.before_pulse;
    state_data.after_pulse = this.state.after_pulse == 0 ? "" : this.state.after_pulse;
    return state_data;
  }
  
  register = () =>  {
    if(this.change_flag == 0){
      return;
    }
    let check_data = this.getCheckData();
    let validate_data = medicalInformationValidate("basic_data", check_data);
    if (validate_data['error_str_arr'].length > 0 ) {
      this.setState({
        check_message:validate_data['error_str_arr'].join('\n'),
        first_tag_id:validate_data['first_tag_id']
      });
      return;
    }
    this.setState({
      isUpdateConfirmModal : true,
      confirm_message: "基礎データを変更しますか?",
    });
  }
  
  closeAlertModal = () => {
    this.setState({check_message: ''});
    $("#" + this.state.first_tag_id).focus();
  }
  
  confirmClose=()=>{
    if(this.change_flag == 1){
      this.setState({
        isCloseConfirmModal:true,
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_alert_title:'入力中',
      });
    } else {
      this.props.closeModal();
    }
  };
  
  render() {
    let {modal_data, schedule_date} = this.props;
    return  (
      <Modal show={true}  className="master-modal inspection-pattern-modal first-view-modal">
        <Modal.Header>
          <div style={{fontSize:24}}>基礎データ編集</div>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="patient_info ml-2">
              {modal_data.patient_name != undefined ? modal_data.patient_name : ""}
              {schedule_date != undefined && schedule_date != null && schedule_date != '' ? "  "+formatJapanDate(schedule_date) : ""}
            </div>
            <InputWithLabelBorder
              label="血圧高（前）"
              type="text"
              id='before_pressure_max_id'
              className="form-control"
              getInputText={this.onChange.bind(this, 'before_pressure_max')}
              diseaseEditData={this.state.before_pressure_max}
            />
            <InputWithLabelBorder
              label="血圧低（前）"
              type="text"
              id='before_pressure_min_id'
              className="form-control"
              getInputText={this.onChange.bind(this, 'before_pressure_min')}
              diseaseEditData={this.state.before_pressure_min}
            />
            <InputWithLabelBorder
              label="脈拍（前）"
              type="text"
              id='before_pulse_id'
              className="form-control"
              getInputText={this.onChange.bind(this, 'before_pulse')}
              diseaseEditData={this.state.before_pulse}
            />
            <InputWithLabelBorder
              label="血圧高（後）"
              type="text"
              id='after_pressure_max_id'
              className="form-control"
              getInputText={this.onChange.bind(this, 'after_pressure_max')}
              diseaseEditData={this.state.after_pressure_max}
            />
            <InputWithLabelBorder
              label="血圧低（後）"
              type="text"
              id='after_pressure_min_id'
              className="form-control"
              getInputText={this.onChange.bind(this, 'after_pressure_min')}
              diseaseEditData={this.state.after_pressure_min}
            />
            <InputWithLabelBorder
              label="脈拍（後）"
              type="text"
              id='after_pulse_id'
              className="form-control"
              getInputText={this.onChange.bind(this, 'after_pulse')}
              diseaseEditData={this.state.after_pulse}
            />
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.confirmClose}>キャンセル</Button>
          <Button className={this.change_flag == 1 ? 'red-btn' : 'disable-btn'} onClick={this.register}>変更</Button>
        </Modal.Footer>
        {this.state.isUpdateConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.registerData.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.isCloseConfirmModal && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.props.closeModal}
            confirmTitle= {this.state.confirm_message}
            title = {this.state.confirm_alert_title}
          />
        )}
        {this.state.check_message != "" && (
          <ValidateAlertModal
            handleOk={this.closeAlertModal}
            alert_meassage={this.state.check_message}
          />
        )}
      </Modal>
    );
  }
}

BasicDataModal.contextType = Context;

BasicDataModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  modal_data: PropTypes.object,
  schedule_date: PropTypes.object,
};

export default BasicDataModal;
