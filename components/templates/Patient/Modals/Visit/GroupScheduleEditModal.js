import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import {formatDateLine, formatJapanDateSlash, formatTimeIE, formatTimePicker} from "~/helpers/date";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import Radiobox from "~/components/molecules/Radiobox";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import SelectDoctorModal from "~/components/templates/Patient/components/SelectDoctorModal";
import GroupScheduleRegisterConfirmModal from "~/components/templates/Patient/Modals/Visit/GroupScheduleRegisterConfirmModal";

const Wrapper = styled.div`
 width: 100%;
 height: 100%;
 font-size: 16px;
 overflow-y:auto;
 .flex{
  display: flex;
 }
 .width-100{
    width: 100px;
 }
 .width-50{
    width: 50px;
 }
 .m-b-10{
    margin-bottom: 10px;
 }
 .div-top{
    margin-top: 10px;
 }
 .div-bottom select{
    width: 178px;
 }
    .react-datepicker-wrapper {
        width: calc(100% - 110px);
        .react-datepicker__input-container {
            width: 100%;
            input {
                font-size: 16px;
                width: 100%;
                height: 38px;
                border-radius: 4px;
                border-width: 1px;
                border-style: solid;
                border-color: rgb(206, 212, 218);
                border-image: initial;
                padding: 0px 8px;
            }
        }
    }
    .label-title {
      font-size: 1rem;
      width: 100px;
      text-align: right;
      margin: 0;
      line-height: 38px;
      margin-right: 8px;
    }
    .div-value {
      line-height: 38px;
      width:calc(100% - 100px);
      font-size: 1rem;
    }
    .select-time-zone {
        label {
            font-size: 1rem;
            margin: 0;
            line-height: 38px;
            margin-right: 8px;
        }
    }
    .select-state {
        .pullbox-label {
          width: 15rem;
          .pullbox-select {
            width: 15rem;
          }
        }
    }
    .pullbox-label {
        margin-bottom: 0;
        width: calc(100% - 110px);
        .pullbox-select {
            width: 100%;
        }
    }
    .set-scheduled-doctor {
      margin-top: 8px;
      .scheduled-doctor-name {
          border:1px solid rgb(206, 212, 218);
          cursor:pointer;
          margin-bottom: 8px;
          line-height: 35px;
          width: calc(100% - 150px);
          padding-left: 5px;
      }
    }
    .set-scheduled-departure-time {
        .react-datepicker-wrapper {
          width: 7rem;
        }
    }
    .clear-btn {
        height: 38px;
        text-align: center;
        margin-left: 5px;
        min-width: 38px;
        background-color: buttonface;
        border: 1px solid #7e7e7e;
        padding: 0;
        span{
          color:black;
          font-size: 1rem;
        }
    }
`;

class GroupScheduleEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collected_date: new Date(props.visit_date),
      confirm_message:'',
      number:this.props.visit_number != null ? this.props.visit_number : 0,
      complete_message:'',
      place_name:this.props.place_name,
      group_name:this.props.group_name,
      scheduled_time_zone:this.props.scheduled_time_zone,
      scheduled_doctor_number:this.props.scheduled_doctor_number,
      scheduled_departure_time:this.props.scheduled_departure_time != null ? formatTimePicker(this.props.scheduled_departure_time) : '',
      doctors:null,
      openGroupScheduleRegisterConfirmModal:false,
    }
  }
  
  async componentDidMount() {
    await this.getDoctorsList();
  }
  
  getDoctorsList = async () => {
    let data = await apiClient.get("/app/api/v2/secure/doctor/search?");
    this.setState({
      doctors: data,
    });
  };
  
  confirmOk=()=>{
    if(this.state.confirm_type == "register"){
      this.register();
    }
    if(this.state.confirm_type == "scheduled_doctor_number"){
      this.clearScheduledDoctor();
    }
    if(this.state.confirm_type == "scheduled_departure_time"){
      this.clearScheduledDepartureTime();
    }
  }
  
  register =async(register_type=null)=>{
    this.confirmCancel();
    this.setState({complete_message: this.state.number > 0 ? "編集中":"登録中"});
    if(this.state.collected_date == null){
      window.sessionStorage.setItem("alert_messages", "予定日付を選択してください。");
      return;
    }
    let path = "/app/api/v2/visit/group_schedule";
    let post_data = {
      number:this.state.number,
      scheduled_date: formatDateLine(this.state.collected_date),
      scheduled_time_zone: this.state.scheduled_time_zone,
      scheduled_doctor_number: this.state.scheduled_doctor_number,
      scheduled_departure_time: (this.state.scheduled_departure_time != null && this.state.scheduled_departure_time !== '') ? formatTimeIE(this.state.scheduled_departure_time) : null,
      register_type,
      visit_place_id:this.props.visit_place_id,
      visit_group_id:this.props.visit_group_id,
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
  
  selectVisitStatus = (e) => {
    this.setState({
      status: e.target.id
    });
  }
  
  closeModal = () => {
    this.setState({
      openSelectDoctorModal: false,
    });
  };
  
  getDate = value => {
    this.setState({
      collected_date: value,
    });
  };
  
  confirmCancel() {
    this.setState({
      confirm_message: "",
      openGroupScheduleRegisterConfirmModal: false,
    });
  }
  
  openConfirmModal =()=>{
    if(this.state.number >0){
      this.setState({
        confirm_message:'このグループの'+formatJapanDateSlash(this.props.visit_date)+'の予定を変更しますか？（※ 診察開始以降の物は変更されません）',
        confirm_type:"register"
      });
    } else {
      this.setState({openGroupScheduleRegisterConfirmModal:true});
    }
  }
  
  setScheduledTimeZone = (e) => {
    this.setState({scheduled_time_zone:parseInt(e.target.value)});
  };
  
  setScheduledDepartureTime = value => {
    this.setState({scheduled_departure_time: value});
  };
  
  openSelectDoctorModal=()=>{
    this.setState({openSelectDoctorModal:true});
  }
  
  getDoctor = e => {
    this.selectDoctorFromModal(e.target.id);
  };
  
  selectDoctorFromModal = (id) => {
    this.setState({
      scheduled_doctor_number: id,
      openSelectDoctorModal: false,
    });
  };
  
  confirmClear=(type)=>{
    let confirm_message = "";
    if(type == "scheduled_doctor_number"){
      if(this.state.scheduled_doctor_number == null){
        return;
      }
      confirm_message = "予定医師を削除しますか？";
    }
    if(type == "scheduled_departure_time"){
      if(this.state.scheduled_departure_time == ""){
        return;
      }
      confirm_message = "出発予定時刻を削除しますか？";
    }
    this.setState({
      confirm_message,
      confirm_type:type
    });
  }
  
  clearScheduledDoctor=()=>{
    this.change_flag = 1;
    this.setState({
      scheduled_doctor_number: null,
      confirm_type:"",
      confirm_message:""
    });
  }
  
  clearScheduledDepartureTime=()=>{
    this.change_flag = 1;
    this.setState({
      scheduled_departure_time: '',
      confirm_type:"",
      confirm_message:""
    });
  }
  
  render() {
    let scheduled_doctor_name = '';
    if(this.state.scheduled_doctor_number != null && this.state.doctors != null){
      this.state.doctors.map(doctor=>{
        if(doctor.doctor_code == this.state.scheduled_doctor_number){
          scheduled_doctor_name = doctor.name;
        }
      })
    }
    return (
      <>
        <Modal show={true} className="custom-modal-sm visit-patient-modal first-view-modal">
          <Modal.Header>
            <Modal.Title>スケジュール{this.state.number >0 ? '編集' : '登録'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div>
                <div className={'flex'}>
                  <div className={'label-title'}>施設</div>
                  <div className={'div-value'}>{this.state.place_name}</div>
                </div>
                <div className={'flex'}>
                  <div className={'label-title'}>グループ</div>
                  <div className={'div-value'}>{this.state.group_name}</div>
                </div>
                {this.state.number > 0 ? (
                  <div className="select-schedule-date flex">
                    <div className={'label-title'}>予定日付</div>
                    <div style={{lineHeight:"38px"}}>
                      {formatJapanDateSlash(formatDateLine(this.state.collected_date))+' '+(this.state.scheduled_time_zone === 0 ? '時間枠なし' : (this.state.scheduled_time_zone === 1 ? '午前' : '午後'))}
                    </div>
                  </div>
                ) : (
                  <div className="select-schedule-date">
                    <InputWithLabel
                      label="予定日付"
                      type="date"
                      getInputText={this.getDate.bind(this)}
                      diseaseEditData={this.state.collected_date}
                    />
                  </div>
                )}
                {this.state.number === 0 && (
                  <div className={'select-time-zone flex'}>
                    <label className={'label-title'}>時間枠</label>
                    <Radiobox
                      label={'時間枠なし'}
                      value={0}
                      getUsage={this.setScheduledTimeZone.bind(this)}
                      checked={this.state.scheduled_time_zone === 0}
                      disabled={true}
                      name={`scheduled_time_zone`}
                    />
                    <Radiobox
                      label={'午前'}
                      value={1}
                      getUsage={this.setScheduledTimeZone.bind(this)}
                      checked={this.state.scheduled_time_zone === 1}
                      disabled={true}
                      name={`scheduled_time_zone`}
                    />
                    <Radiobox
                      label={'午後'}
                      value={2}
                      getUsage={this.setScheduledTimeZone.bind(this)}
                      checked={this.state.scheduled_time_zone === 2}
                      disabled={true}
                      name={`scheduled_time_zone`}
                    />
                  </div>
                )}
                <div className="select-state">
                  <SelectorWithLabel
                    options={[{id: 0,value: "訪問予定"}]}
                    title="状態"
                    getSelect={this.selectVisitStatus}
                    departmentEditCode={this.state.status}
                    isDisabled={true}
                  />
                </div>
                <div className={'set-scheduled-doctor flex'}>
                  <label className={'label-title'}>予定医師</label>
                  <div className={'scheduled-doctor-name'} onClick={this.openSelectDoctorModal}>{scheduled_doctor_name !== '' ? scheduled_doctor_name : 'クリックで選択'}</div>
                  <Button className='clear-btn' onClick={this.confirmClear.bind(this, "scheduled_doctor_number")}>C</Button>
                </div>
                <div className={'set-scheduled-departure-time flex'}>
                  <label className={'label-title'}>出発予定時刻</label>
                  <DatePicker
                    locale="ja"
                    selected={this.state.scheduled_departure_time}
                    onChange={this.setScheduledDepartureTime}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={10}
                    dateFormat="HH:mm"
                    timeFormat="HH:mm"
                    timeCaption="出発予定時刻"
                  />
                  <Button className='clear-btn' onClick={this.confirmClear.bind(this, "scheduled_departure_time")}>C</Button>
                </div>
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            <Button className="red-btn" onClick={this.openConfirmModal.bind(this)}>{this.state.number === 0 ? '登録' : '編集'}</Button>
          </Modal.Footer>
          {this.state.confirm_message !== "" && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.confirmOk.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.complete_message !== '' && (
            <CompleteStatusModal
              message = {this.state.complete_message}
            />
          )}
          {this.state.doctors != null && this.state.openSelectDoctorModal && (
            <SelectDoctorModal
              closeDoctor={this.closeModal}
              getDoctor={this.getDoctor}
              selectDoctorFromModal={this.selectDoctorFromModal}
              doctors={this.state.doctors}
            />
          )}
          {this.state.openGroupScheduleRegisterConfirmModal && (
            <GroupScheduleRegisterConfirmModal
              closeModal= {this.confirmCancel.bind(this)}
              visit_place_name={this.state.place_name}
              visit_group_name={this.state.group_name}
              collected_date={formatDateLine(this.state.collected_date)}
              handleOk={this.register.bind(this)}
            />
          )}
        </Modal>
      </>
    );
  }
}

GroupScheduleEditModal.contextType = Context;
GroupScheduleEditModal.propTypes = {
  closeModal: PropTypes.func,
  visit_date: PropTypes.string,
  visit_number: PropTypes.number,
  place_name: PropTypes.string,
  group_name: PropTypes.string,
  scheduled_time_zone: PropTypes.number,
  scheduled_doctor_number: PropTypes.number,
  visit_place_id: PropTypes.number,
  visit_group_id: PropTypes.number,
  scheduled_departure_time: PropTypes.string,
};

export default GroupScheduleEditModal;
