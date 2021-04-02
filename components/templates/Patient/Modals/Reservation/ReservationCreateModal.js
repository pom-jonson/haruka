import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import {formatDateLine, formatDateTimeIE} from "~/helpers/date";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import * as apiClient from "~/api/apiClient";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import SelectPatientModal from "~/components/templates/Patient/components/SelectPatientModal";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import SelectDoctorModal from "~/components/molecules/SelectDoctorModal";
import * as sessApi from "~/helpers/cacheSession-utils";

const Wrapper = styled.div`  
  width: 100%;
  height: 100%;
  font-size: 1rem;
  overflow-y:auto;
  .flex{
    display: flex;
  }
  .select-patient-btn {
    height: 2rem;
    padding: 0 1rem;
    min-width: 6rem;
  }
  .react-datepicker-wrapper {
    width: calc(100% - 110px);
    .react-datepicker__input-container {
      width: 100%;
      input {
        font-size: 1rem;
        width: 7rem;
        height: 2rem;
        border-radius: 4px;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(206, 212, 218);
        border-image: initial;
        padding: 0px 0.5rem;
      }
    } 
  }
  .label-title {
    font-size: 1rem;
    width: 100px;
    text-align: right;
    line-height: 2rem;
    margin: 0;
    margin-right: 0.5rem;
  }
  .select-state {
      margin-top: 0.5rem;
  }
  .pullbox-label {
    margin-bottom: 0;
    .pullbox-select {
      width: 12rem;
      height: 2rem;
      font-size: 1rem;
    }
  }
  .select-schedule-date {
    display: flex;
    margin-top:0.5rem;
    .date-area div {margin-top:0;}
    .time-area input {width:5rem;}
  }
`;

class ReservationCreateModal extends Component {
  constructor(props) {
    super(props);
    let cur_date = this.props.scheduled_date == null ? new Date() : new Date(this.props.scheduled_date);
    let cur_time = this.props.scheduled_time == null ? ' 00:00:00' : ' ' + this.props.scheduled_time +':00';
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    let diagnosis = [{id:0, value:""}];
    departmentOptions.map(department=>{
      diagnosis.push(department);
    });
    this.state = {
      reservation_state:[
        {id: 0,value: "未診療"},
        {id: 1,value: "受付済"},
        {id: 2,value: "診察開始"},
        {id: 3,value: "診察終了"},
        {id: 4,value: "会計済"},
        {id: 9,value: "中止"},
        {id: 10,value: "中断"}],
      diagnosis,
      selectPatient: false,
      patient_name: this.props.patient_name == null ? '' : this.props.patient_name,
      system_patient_id: this.props.system_patient_id == null ? 0 : this.props.system_patient_id,
      diagnosis_code: this.props.scheduled_diagnosis_code == null ? 0 : this.props.scheduled_diagnosis_code,
      state:this.props.scheduled_status == null ? 0 : this.props.scheduled_status,
      scheduled_date: cur_date,
      scheduled_time: formatDateTimeIE(formatDateLine(cur_date) + cur_time),
      confirm_message:'',
      alert_messages:'',
      complete_message:'',
      isOpenSelectDoctor:false,
    }
    this.doctors = sessApi.getDoctorList();
    this.authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
  }

  getScheduledDate = value => {
    this.setState({
      scheduled_date: value,
    });
  };

  register =async()=>{
    this.setState({
      confirm_message:"",
      complete_message: this.props.number > 0 ? "編集中":"登録中"
    });
    let path = "/app/api/v2/reservation/register_schedule";
    let post_data = {
      system_patient_id:this.state.system_patient_id,
      scheduled_date: formatDateLine(this.state.scheduled_date),
      scheduled_time: this.state.scheduled_time.getHours() + ":" + this.state.scheduled_time.getMinutes(),
      state: this.state.state,
      doctor_number:this.authInfo.staff_category === 1 ? this.authInfo.doctor_code : this.context.selectedDoctor.code,
      number:this.props.number == null ? 0 : this.props.number,
      diagnosis_code:this.state.diagnosis_code,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        window.sessionStorage.setItem("alert_messages", res.alert_message);
        this.props.closeModal('save');
      })
      .catch(() => {

      });
    this.setState({complete_message: ""});
  }

  setDiagnosisCode = (e) => {
    this.setState({
      diagnosis_code: e.target.id
    });
  }

  setReservationState = (e) => {
    this.setState({
      state: e.target.id
    });
  }

  openSelectPatientModal = () => {
    var base_modal = document.getElementsByClassName("reservation_create_modal")[0];
    if(base_modal !== undefined && base_modal != null){
      base_modal.style['z-index'] = 1040;
    }
    this.setState({
      selectPatient: true
    });
  }

  openConfirmModal =()=>{
    let base_modal = document.getElementsByClassName("reservation_create_modal")[0];
    if(base_modal !== undefined && base_modal != null){
      base_modal.style['z-index'] = 1040;
    }
    if(this.state.system_patient_id === 0){
      this.setState({alert_messages: "患者様を選択してください。"});
      return;
    }
    if(this.state.scheduled_date === ''){
      this.setState({alert_messages: "予定日時を選択してください。"});
      return;
    }
    if(this.state.diagnosis_code === 0){
      this.setState({alert_messages: "診療科を選択してください。"});
      return;
    }
    if(this.state.state == 3){ //診察終了
      if(this.authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
        this.setState({isOpenSelectDoctor:true});
        return;
      }
    }
    this.setState({confirm_message:this.props.number == null ? '登録しますか？' : '編集しますか？'});
  }

  getScheduledTime = value => {
    this.setState({scheduled_time: value});
  };

  selectPatient = (patient) => {
    this.setState({
      patient_name: patient.name,
      system_patient_id: patient.systemPatientId,
    });
    this.closeModal();
  }

  closeModal=()=>{
    let base_modal = document.getElementsByClassName("reservation_create_modal")[0];
    if(base_modal !== undefined && base_modal != null){
      base_modal.style['z-index'] = 1050;
    }
    this.setState({
      confirm_message: '',
      alert_messages: '',
      selectPatient: false,
      isOpenSelectDoctor: false,
    });
  }
  
  getDoctor = e => {
    this.selectDoctorFromModal(e.target.id, e.target.getAttribute("label"));
  }
  
  selectDoctorFromModal = (id, name) => {
    let department_name = "その他";
    this.doctors.map(doctor => {
      if (doctor.doctor_code === parseInt(id)) {
        if (doctor.diagnosis_department_name !== "") {
          department_name = doctor.diagnosis_department_name;
        }
      }
    });
    this.context.$updateDoctor(id, name, department_name);
    this.setState({isOpenSelectDoctor:false}, ()=>{
      this.openConfirmModal();
    })
  }

  render() {
    return (
      <>
        <Modal show={true} className="custom-modal-sm reservation_create_modal">
          <Modal.Header>
            <Modal.Title>予約{this.props.number == null ? '登録' : '編集'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className="flex">
                <div className="label-title">患者: </div>
                <div style={{width:"calc(100% - 12rem)", lineHeight:"2rem"}}>{this.state.patient_name}</div>
                {this.props.number == null && (
                  <Button className="select-patient-btn" onClick={this.openSelectPatientModal}>患者選択</Button>
                )}
              </div>
              <div className="select-schedule-date">
                <div className={'date-area'}>
                  <InputWithLabel
                    label="予定日時"
                    type="date"
                    getInputText={this.getScheduledDate.bind(this)}
                    diseaseEditData={this.state.scheduled_date}
                  />
                </div>
                <div className={'time-area'}>
                  <DatePicker
                    locale="ja"
                    selected={this.state.scheduled_time}
                    onChange={this.getScheduledTime}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={10}
                    dateFormat="HH:mm"
                    timeFormat="HH:mm"
                    timeCaption="時間"
                  />
                </div>
              </div>
              <div className="select-state">
                <SelectorWithLabel
                  options={this.state.diagnosis}
                  title="診療科"
                  getSelect={this.setDiagnosisCode}
                  departmentEditCode={this.state.diagnosis_code}
                />
              </div>
              <div className="select-state">
                <SelectorWithLabel
                  options={this.state.reservation_state}
                  title="状態"
                  getSelect={this.setReservationState}
                  departmentEditCode={this.state.state}
                />
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            <Button className="red-btn" onClick={this.openConfirmModal.bind(this)}>{this.props.number == null ? '登録' : '編集'}</Button>
          </Modal.Footer>
          {this.state.selectPatient && (
            <SelectPatientModal
              handleOk={this.selectPatient}
              closeModal={this.closeModal}
            />
          )}
          {this.state.confirm_message !== "" && (
            <SystemConfirmModal
              hideConfirm= {this.closeModal.bind(this)}
              confirmCancel= {this.closeModal.bind(this)}
              confirmOk= {this.register.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
          {this.state.complete_message !== '' && (
            <CompleteStatusModal
              message = {this.state.complete_message}
            />
          )}
          {this.state.isOpenSelectDoctor && (
            <SelectDoctorModal
              closeDoctor={this.closeModal}
              getDoctor={this.getDoctor}
              selectDoctorFromModal={this.selectDoctorFromModal}
              doctors={this.doctors}
            />
          )}
        </Modal>
      </>
    );
  }
}

ReservationCreateModal.contextType = Context;
ReservationCreateModal.defaultProps = {
  number: null,
  scheduled_date: null,
  scheduled_time: null,
  system_patient_id: null,
  patient_name: null,
  scheduled_status: null,
  scheduled_diagnosis_code: null,
};
ReservationCreateModal.propTypes = {
  closeModal: PropTypes.func,
  patient_name: PropTypes.string,
  system_patient_id: PropTypes.string,
  scheduled_date: PropTypes.string,
  scheduled_time: PropTypes.string,
  scheduled_status: PropTypes.number,
  number: PropTypes.number,
  scheduled_diagnosis_code: PropTypes.number,
};

export default ReservationCreateModal;
