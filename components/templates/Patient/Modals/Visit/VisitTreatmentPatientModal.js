import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import SelectPannelHarukaModal from "~/components/templates/Patient/Modals/Common/SelectPannelHarukaModal";
import {formatDateLine, formatJapanDateSlash, formatTimeIE, formatTimePicker} from "~/helpers/date";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import * as apiClient from "~/api/apiClient";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import Radiobox from "~/components/molecules/Radiobox";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import SelectDoctorModal from "~/components/templates/Patient/components/SelectDoctorModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as localApi from "~/helpers/cacheLocal-utils";
import * as sessApi from "~/helpers/cacheSession-utils";
import Spinner from "react-bootstrap/Spinner";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import * as karteApi from "~/helpers/cacheKarte-utils";

const Wrapper = styled.div`  
 width: 100%;
 height: 100%;
 font-size: 1rem;
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
        font-size: 1rem;
        width: 100%;
        height: 2rem;
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
      width: 7rem;
      margin: 0;
      line-height: 2rem;
      margin-right: 0.5rem;
  }
  .div-value {
    width:calc(100% - 7rem);
    line-height: 2rem;
  }
  .select-time-zone {
      label {
          line-height: 2rem;
          font-size: 1rem;
          margin: 0;
          margin-right: 0.5rem;
      }
  }
  .pullbox-label {
    .pullbox-select {
      width: 100%;
      height: 2rem;
      font-size:1rem;
    }
  }
  .select-state {
    margin-bottom:0.5rem;
    .pullbox-label {
      width: 15rem;
      margin-bottom:0;
    }
  }
  .select-visit-place, .select-visit-group {
    margin-bottom:0.5rem;
    .pullbox-label {
      width: calc(100% - 7.5rem);
    }
  }
  .set-scheduled-doctor {
    margin-bottom: 0.5rem;
    .scheduled-doctor-name {
      border:1px solid rgb(206, 212, 218);
      cursor:pointer;
      line-height: 2rem;
      width: 21rem;
      padding-left: 5px;
    }
  }
  .set-scheduled-departure-time {
    .react-datepicker-wrapper {
      width: 7rem;
    }
  }
  .clear-btn {
      height: 2rem;
      line-height: 2rem;
      text-align: center;
      margin-left: 0.5rem;
      min-width: 2rem;
      background-color: buttonface;
      border: 1px solid #7e7e7e;
      padding: 0;
      span{
        color:black;  
        font-size: 1rem;   
      }
  }
  .patient-info {
    button {
      width: 10rem;
      padding: 0;
      height: 2rem;
      margin-left: 0.5rem;
      span {font-size:1rem;}
    } 
  }
  .select-schedule-date {
    display:flex;
    div {margin-top:0;}
    .react-datepicker-wrapper {
      width: 8rem;
    }
    .react-datepicker-popper {
      margin-top:10px;
    }
  }
`;

const SpinnerWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class VisitTreatmentPatientModal extends Component {
  constructor(props) {
    super(props);
    let patient_name = props.patient_name;
    let patient_number = props.patient_number;
    let system_patient_id = props.system_patient_id;
    let place_name = props.place_name;
    let group_name = props.group_name;
    let visit_date = props.visit_date;
    this.set_visit = props.set_visit; //訪問診療患者でない場合 1
    this.select_patient_visit_mode_info = localApi.getObject("select_patient_visit_mode");
    this.select_patient_visit_mode = false;
    if(this.select_patient_visit_mode_info != undefined && this.select_patient_visit_mode_info != null){
      patient_name = this.select_patient_visit_mode_info.patient_name;
      patient_number = this.select_patient_visit_mode_info.patient_number;
      system_patient_id = this.select_patient_visit_mode_info.system_patient_id;
      this.set_visit = this.select_patient_visit_mode_info.is_visit == 0 ? 1 : 0;
      this.select_patient_visit_mode = true;
      if(this.select_patient_visit_mode_info.is_visit == 1){
        place_name = this.select_patient_visit_mode_info.place_name;
        group_name = this.select_patient_visit_mode_info.group_name;
      }
      localApi.remove("select_patient_visit_mode");
    }
    this.state = {
      visit_status:[
        {
          id: 0,
          value: "訪問予定"
        },
        {
          id: 1,
          value: "診察開始"
        },
        {
          id: 2,
          value: "診療済み"
        },
        {
          id: 9,
          value: "予定を中止"
        },
        {
          id: 99,
          value: "診察中止"
        }],
      selectPatient: false,
      patient_name: patient_name == null || patient_name == undefined || patient_name == "" ? "" : patient_name,
      patient_number: patient_number == null || patient_number == undefined || patient_number == "" ? "" : patient_number,
      system_patient_id: system_patient_id == null || system_patient_id == undefined || system_patient_id == "" ? "" : system_patient_id,
      status: props.visit_status == null || props.visit_status == undefined || props.visit_status == "" ? 0 : props.visit_status,
      collected_date: visit_date == null || visit_date == undefined || visit_date == "" ? new Date() : new Date(visit_date.split('-').join('/')),
      confirm_message:'',
      number:(props.visit_number !== undefined && props.visit_number != null) ? props.visit_number : 0,
      complete_message:'',
      place_name:(place_name !== undefined && place_name != null) ? place_name : '',
      group_name:(group_name !== undefined && group_name != null) ? group_name : '',
      scheduled_time_zone:(this.props.scheduled_time_zone !== undefined && this.props.scheduled_time_zone != null) ? this.props.scheduled_time_zone : 0,
      scheduled_doctor_number:(this.props.scheduled_doctor_number !== undefined) ? this.props.scheduled_doctor_number : null,
      scheduled_departure_time:(this.props.scheduled_departure_time !== undefined && this.props.scheduled_departure_time != null) ? formatTimePicker(this.props.scheduled_departure_time) : '',
      openSelectDoctorModal:false,
      isCloseConfirm: false,
      close_confirm_message: "",
      confirm_type:"",
      load_data:false,
      place_data:[{id:0, value:""}],
      group_data:[{id:0, value:""}],
      visit_place_id:0,
      visit_group_id:0,
      alert_messages:"",
    };
    this.change_flag = 0;
    this.doctors = sessApi.getDoctorList();
    this.group_master = [];
  }

  async UNSAFE_componentWillMount () {
    if(this.set_visit == 1){
      await this.getVisitGroup();
      await this.getPlaceGroup();
    } else {
      this.setState({load_data:true});
    }
  }

  getVisitGroup =async()=>{
    let path = "/app/api/v2/visit/get/visit_group";
    let post_data = {
      is_enabled:1,
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        this.group_master = res;
      })
      .catch(() => {
      });
  }

  getPlaceGroup =async()=>{
    let path = "/app/api/v2/visit/get/visit_place";
    let post_data = {
      is_enabled:1,
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if(res.length > 0){
          let place_data = this.state.place_data;
          res.map(item=>{
            let place = {};
            place.id = item.visit_place_id;
            place.value = item.name;
            place_data.push(place);
          })
          this.setState({
            place_data,
            load_data:true
          });
        }
      })
      .catch(() => {
      });
  }

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

  register =async()=>{
    this.setState({
      confirm_message:"",
      confirm_type:"",
      complete_message: this.state.number > 0 ? "編集中":"登録中"
    });
    let path = "/app/api/v2/visit/schedule/add_patient";
    let post_data = {
      number:this.state.number,
      system_patient_id:this.state.system_patient_id,
      scheduled_date: formatDateLine(this.state.collected_date),
      scheduled_time_zone: this.state.scheduled_time_zone,
      state: this.state.status,
      scheduled_doctor_number: this.state.scheduled_doctor_number,
      scheduled_departure_time: (this.state.scheduled_departure_time != null && this.state.scheduled_departure_time !== '') ? formatTimeIE(this.state.scheduled_departure_time) : null,
    };
    if(this.set_visit == 1){
      post_data.set_visit = 1;
      post_data.visit_group_id = this.state.visit_group_id;
      let patientInfo = karteApi.getPatient(this.state.system_patient_id);
      if(patientInfo != undefined && patientInfo != null){
        let visit_info = {
          is_visit:1,
          visit_group_id: this.state.visit_group_id,
          group_name: this.state.visit_group_name,
          visit_place_id: this.state.visit_place_id,
          place_name: this.state.visit_place_name,
        };
        patientInfo.visit_info = visit_info;
        karteApi.setPatient(this.state.system_patient_id, JSON.stringify(patientInfo));
      }
    }
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
    this.change_flag = 1;
    this.setState({
      status: e.target.id
    });
  }

  openSelectPatientModal = () => {
    this.setState({
      selectPatient: true
    });
  }

  setPatient = (system_info) => {
    this.change_flag = 1;
    this.setState({
      selectPatient: false,
      patient_name: system_info.patient_name,
      patient_number: system_info.patient_number,
      system_patient_id: system_info.system_patient_id,
      place_name: system_info.place_name,
      group_name: system_info.group_name,
    });
  };

  closeModal = () => {
    this.setState({
      selectPatient: false,
      openSelectDoctorModal: false,
      alert_messages: "",
    });
  }

  getDate = value => {
    this.change_flag = 1;
    this.setState({
      collected_date: value,
    });
  };

  confirmCancel() {
    this.setState({
      confirm_message: "",
      close_confirm_message: "",
      isCloseConfirm: false,
    });
  }

  openConfirmModal =()=>{
    if(this.state.system_patient_id === ''){
      this.setState({alert_messages:"患者様を選択してください。"});
      return;
    }
    if(this.state.collected_date == null || this.state.collected_date == ""){
      this.setState({alert_messages:"予定日付を選択してください。"});
      return;
    }
    if(this.set_visit == 1){
      if(this.state.visit_place_id == 0){
        this.setState({alert_messages:"施設を選択してください。"});
        return;
      }
      if(this.state.visit_group_id == 0){
        this.setState({alert_messages:"グループ名を選択してください。"});
        return;
      }
    }
    let confirm_message = '登録しますか？';
    if(this.state.number >0){
      confirm_message = '編集しますか？';
    }
    this.setState({
      confirm_message,
      confirm_type:"register"
    });
  }

  setScheduledTimeZone = (e) => {
    this.change_flag = 1;
    this.setState({scheduled_time_zone:parseInt(e.target.value)});
  };

  setScheduledDepartureTime = value => {
    this.change_flag = 1;
    this.setState({scheduled_departure_time: value});
  };

  openSelectDoctorModal=()=>{
    this.setState({openSelectDoctorModal:true});
  }

  getDoctor = e => {
    this.change_flag = 1;
    this.selectDoctorFromModal(e.target.id);
  };

  selectDoctorFromModal = (id) => {
    this.change_flag = 1;
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

  confirmClose=()=>{
    if(this.change_flag == 1){
      this.setState({
        close_confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        isCloseConfirm:true,
      });
    } else {
      this.props.closeModal();
    }
  }

  getPlaceSelect = e => {
    this.change_flag = 1;
    let select_obj = document.getElementsByClassName('select-visit-place')[0].getElementsByTagName("select")[0];
    if(select_obj != undefined && select_obj != null){
      if(e.target.value.length > 65){
        select_obj.style.fontSize = "0.4rem";
      } else {
        select_obj.style.fontSize = "1rem";
      }
    }
    let visit_place_id = parseInt(e.target.id);
    let group_data = [{id:0, value:""}];
    if(this.group_master.length > 0){
      this.group_master.map(group=>{
        if(group.visit_place_id == visit_place_id){
          group_data.push({id:group.visit_group_id, value:group.name});
        }
      })
    }
    this.setState({
      visit_place_id,
      visit_place_name:e.target.value,
      visit_group_id: 0,
      group_data,
    });
  };

  getGroupSelect = e => {
    if(parseInt(e.target.id) !== this.state.visit_group_id){
      this.change_flag = 1;
      let select_obj = document.getElementsByClassName('select-visit-group')[0].getElementsByTagName("select")[0];
      if(select_obj != undefined && select_obj != null){
        if(e.target.value.length > 65){
          select_obj.style.fontSize = "0.4rem";
        } else {
          select_obj.style.fontSize = "1rem";
        }
      }
      this.setState({
        visit_group_id: parseInt(e.target.id),
        visit_group_name:e.target.value,
      });
    }
  };

  render() {
    let scheduled_doctor_name = '';
    if(this.state.scheduled_doctor_number != null && this.doctors != null){
      this.doctors.map(doctor=>{
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
              {this.state.load_data ? (
                <>
                  <div className={'flex'}>
                    <div className={'label-title'}>施設</div>
                    <div className={'div-value'}>{this.state.place_name}</div>
                  </div>
                  <div className={'flex'}>
                    <div className={'label-title'}>グループ</div>
                    <div className={'div-value'}>{this.state.group_name}</div>
                  </div>
                  {this.set_visit == 1 && (
                    <>
                      <div className={'select-visit-place'}>
                        <SelectorWithLabel
                          options={this.state.place_data}
                          title="施設"
                          getSelect={this.getPlaceSelect}
                          departmentEditCode={this.state.visit_place_id}
                        />
                      </div>
                      <div className={'select-visit-group'}>
                        <SelectorWithLabel
                          options={this.state.group_data}
                          title="グループ"
                          getSelect={this.getGroupSelect}
                          departmentEditCode={this.state.visit_group_id}
                          isDisabled={this.state.visit_place_id === 0}
                        />
                      </div>
                    </>
                  )}
                  <div className="flex patient-info">
                    <div style={{width:"calc(100% - 11rem)"}}>
                      <div className={'flex'}>
                        <div className={'label-title'}>患者ID</div>
                        <div className={'div-value'}>{this.state.patient_number}</div>
                      </div>
                      <div className={'flex'}>
                        <div className={'label-title'}>患者氏名</div>
                        <div className={'div-value'}>{this.state.patient_name}</div>
                      </div>
                    </div>
                    {this.select_patient_visit_mode == false && (this.props.patient_name == undefined || this.props.patient_name == null || this.props.patient_name == "") && (
                      <Button onClick={this.openSelectPatientModal}>訪問診療患者選択</Button>
                    )}
                  </div>
                  <div className="select-schedule-date">
                    {this.state.number > 0 ? (
                      <>
                        <div className={'label-title'}>予定日付</div>
                        <div style={{lineHeight:"2rem"}}>
                          {formatJapanDateSlash(formatDateLine(this.state.collected_date))+' '+(this.state.scheduled_time_zone === 0 ? '時間枠なし' : (this.state.scheduled_time_zone === 1 ? '午前' : '午後'))}
                        </div>
                      </>
                    ) : (
                      <>
                        <InputWithLabel
                          label="予定日付"
                          type="date"
                          getInputText={this.getDate.bind(this)}
                          diseaseEditData={this.state.collected_date}
                        />
                      </>
                    )}
                  </div>
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
                    {this.state.number >0 ? (
                      <>
                        {this.state.status == 2 ? (
                          <SelectorWithLabel
                            title="状態"
                            options={this.state.visit_status}
                            getSelect={this.selectVisitStatus}
                            departmentEditCode={this.state.status}
                            isDisabled={true}
                          />
                        ):(
                          <SelectorWithLabel
                            title="状態"
                            options={this.state.visit_status}
                            getSelect={this.selectVisitStatus}
                            departmentEditCode={this.state.status}
                            disabledValue={'1:2:99'}
                          />
                        )}
                      </>
                    ) : (
                      <SelectorWithLabel
                        options={[{id: 0,value: "訪問予定"}]}
                        title="状態"
                        getSelect={this.selectVisitStatus}
                        departmentEditCode={this.state.status}
                        isDisabled={this.state.number === 0}
                      />
                    )}
                  </div>
                  <div className={'set-scheduled-doctor flex'}>
                    <div className={'label-title'}>予定医師</div>
                    <div className={'scheduled-doctor-name'} onClick={this.openSelectDoctorModal}>{scheduled_doctor_name !== '' ? scheduled_doctor_name : 'クリックで選択'}</div>
                    <Button className='clear-btn' onClick={this.confirmClear.bind(this, "scheduled_doctor_number")}>C</Button>
                  </div>
                  <div className={'set-scheduled-departure-time flex'}>
                    <div className={'label-title'}>出発予定時刻</div>
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
                </>
                ):(
                <>
                  <SpinnerWrapper>
                    <Spinner animation="border" variant="secondary" />
                  </SpinnerWrapper>
                </>
                )}
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <div
              onClick={this.confirmClose}
              className={"custom-modal-btn cancel-btn"}
              style={{cursor:"pointer"}}
              id='cancel_btn'
            >
              <span>キャンセル</span>
            </div>
            <div
              onClick={this.openConfirmModal}
              className={"custom-modal-btn red-btn"}
              style={{cursor:"pointer"}}
            >
              <span>{this.state.number === 0 ? '登録' : '編集'}</span>
            </div>
          </Modal.Footer>
          {this.state.selectPatient && (
            <SelectPannelHarukaModal
              selectMaster = {this.setPatient}
              closeModal= {this.closeModal}
              MasterName= {'訪問診療患者'}
            />
          )}
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
          {this.doctors != null && this.state.openSelectDoctorModal && (
            <SelectDoctorModal
              closeDoctor={this.closeModal}
              getDoctor={this.getDoctor}
              selectDoctorFromModal={this.selectDoctorFromModal}
              doctors={this.doctors}
            />
          )}
          {this.state.isCloseConfirm && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.props.closeModal}
              confirmTitle={this.state.close_confirm_message}
            />
          )}
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
        </Modal>
      </>
    );
  }
}

VisitTreatmentPatientModal.contextType = Context;
VisitTreatmentPatientModal.propTypes = {
  closeModal: PropTypes.func,
  patient_name: PropTypes.string,
  patient_number: PropTypes.string,
  system_patient_id: PropTypes.string,
  visit_date: PropTypes.string,
  visit_status: PropTypes.number,
  visit_number: PropTypes.number,
  place_name: PropTypes.string,
  group_name: PropTypes.string,
  scheduled_time_zone: PropTypes.number,
  scheduled_doctor_number: PropTypes.number,
  scheduled_departure_time: PropTypes.string,
  set_visit: PropTypes.number,
};

export default VisitTreatmentPatientModal;
