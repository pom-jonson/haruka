import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Checkbox from "~/components/molecules/Checkbox";
import SelectPatientModal from "~/components/templates/Patient/components/SelectPatientModal";
import * as apiClient from "~/api/apiClient";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Spinner from "react-bootstrap/Spinner";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .flex {
    display: flex;
  }
  label {font-size:1rem;}
  .pullbox-label select {
    height:2rem;
    font-size:1rem;
  }
  .patient-info {
    border: 1px solid #aaa;
    padding: 0.3rem;
    .info-item {
      padding-top: 0.3rem;
      .label-title {
        width: 7rem;
        padding-left: 0.3rem;
      }
      .content {
        border: 1px solid #aaa;
        width: calc(50% - 7rem);
        padding-left:0.2rem;
      }
    }
  }
  .reception-info {
    border: 1px solid #aaa;
    padding: 0.3rem;
    .label-title {
      width: 7rem;
      padding-left: 0.3rem;
      font-size:1rem;
      line-height:2rem;
      margin: 0;
    }
    .pullbox-label {
      width: calc(100% - 7rem);
      margin-bottom: 0;
      select {
        width: 100%;
        height: 2rem;
      }
    }
    .two-box {
      .first {
        border: 1px solid #aaa;
        width: 50px;
      }
      .second {
        border: 1px solid #aaa;
        width: calc(50% - 150px);
        margin-left: -1px;
      }
    }
    .sender-reason {
      input {
        width: calc(100% - 7rem);
        height: 2rem;
      }
    }
    .two-doctor {
      border: 1px solid #aaa;
      width: calc(100% - 220px);
      height: calc(98vh - 53rem);
      overflow-y: auto;
    }
    .row-item {
      cursor:pointer;
      padding-left: 5px;
    }
    .selected{
      background: lightblue;
    }
    .select-facility {
    }
  }
`;

const SpinnerWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class EmergencyReceptionModal extends Component {
  constructor(props) {
    super(props);
    let escort_doctor_codes = [];
    if(props.modal_data !== undefined && props.modal_data.escort_doctor_code1 != null){
      escort_doctor_codes.push(props.modal_data.escort_doctor_code1);
    }
    if(props.modal_data !== undefined && props.modal_data.escort_doctor_code2 != null){
      escort_doctor_codes.push(props.modal_data.escort_doctor_code2);
    }
    this.state = {
      number:props.modal_data !== undefined ? props.modal_data.number :0,
      patient_info:props.modal_data !== undefined ? props.modal_data.patient_number : null,
      hospital_visit_classific_id:props.modal_data !== undefined ? props.modal_data.hospital_visit_classific_id : 0,
      accident_classific_id:(props.modal_data !== undefined && props.modal_data.accident_classific_id != null) ? props.modal_data.accident_classific_id : 0,
      hospital_method_id:(props.modal_data !== undefined && props.modal_data.hospital_method_id != null) ? props.modal_data.hospital_method_id : 0,
      patient_status_id:(props.modal_data !== undefined && props.modal_data.patient_status_id != null) ? props.modal_data.patient_status_id : 0,
      ambulance_affiliation_id:(props.modal_data !== undefined && props.modal_data.ambulance_affiliation_id != null) ? props.modal_data.ambulance_affiliation_id : 0,
      introduction_letter:(props.modal_data !== undefined && props.modal_data.introduction_letter != null) ? props.modal_data.introduction_letter : 0,
      department_id:(props.modal_data !== undefined && props.modal_data.department_id != null) ? props.modal_data.department_id : 1,
      outcome_classific_id:(props.modal_data !== undefined && props.modal_data.outcome_classific_id != null) ? props.modal_data.outcome_classific_id : 0,
      hospital_id:(props.modal_data !== undefined && props.modal_data.hospital_id != null) ? props.modal_data.hospital_id : 0,
      autopsy_classific_id:(props.modal_data !== undefined && props.modal_data.autopsy_classific_id != null) ? props.modal_data.autopsy_classific_id : 0,
      destination_hospital_id:(props.modal_data !== undefined && props.modal_data.destination_hospital_id != null) ? props.modal_data.destination_hospital_id : 0,
      sender_reason:(props.modal_data !== undefined && props.modal_data.sender_reason != null) ? props.modal_data.sender_reason : "",
      referral_hospital_id:(props.modal_data !== undefined && props.modal_data.referral_hospital_id != null) ? props.modal_data.referral_hospital_id : 0,
      escort_doctor_codes,
      selectPatient:false,
      alert_messages:"",
      confirm_message:"",
      confirm_type:"",
      confirm_alert_title:'',
      load_flag:false,
    };
    this.hospital_visit_classific_master = [{id:0, value:""}];
    this.accident_classific_master = [{id:0, value:""}];
    this.hospital_method_master = [{id:0, value:""}];
    this.patient_status_master = [{id:0, value:""}];
    this.ambulance_affiliation_master = [{id:0, value:""}];
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.outcome_classific = [{id:0, value:"入院"}];
    this.ward_master = [{id:0, value:""}];
    this.dial_other_facilities_master = [{id:0, value:""}];
    this.autopsy_classific_master = [{id:0, value:""}];
    this.doctor_list = [];
    let doctor_code_list = [];
    let doctor_data = sessApi.getDoctorList();
    doctor_data.map(doctor=>{
      let index = doctor_code_list.indexOf(doctor.doctor_code);
      if(index === -1){
        doctor_code_list.push(doctor.doctor_code);
        this.doctor_list.push(doctor);
      }
    });
    this.change_flag = 0;
  }

  async componentDidMount() {
    await this.getMasterData();
    if(this.state.patient_info != null){
      await this.getPatientInfo(this.state.patient_info);
    }
    this.setState({load_flag:true});
  }

  getMasterData=async()=>{
    let path = "/app/api/v2/emergency/get/maser_data";
    let post_data = {
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if(res.hospital_visit_classific_master !== undefined && res.hospital_visit_classific_master.length > 0){
          res.hospital_visit_classific_master.map(item=>{
            let master = {id:item.hospital_visit_classific_id, value:item.name};
            this.hospital_visit_classific_master.push(master);
          })
        }
        if(res.accident_classific_master !== undefined && res.accident_classific_master.length > 0){
          res.accident_classific_master.map(item=>{
            let master = {id:item.accident_classific_id, value:item.name};
            this.accident_classific_master.push(master);
          })
        }
        if(res.hospital_method_master !== undefined && res.hospital_method_master.length > 0){
          res.hospital_method_master.map(item=>{
            let master = {id:item.hospital_method_id, value:item.name};
            this.hospital_method_master.push(master);
          })
        }
        if(res.patient_status_master !== undefined && res.patient_status_master.length > 0){
          res.patient_status_master.map(item=>{
            let master = {id:item.patient_status_id, value:item.name};
            this.patient_status_master.push(master);
          })
        }
        if(res.ambulance_affiliation_master !== undefined && res.ambulance_affiliation_master.length > 0){
          res.ambulance_affiliation_master.map(item=>{
            let master = {id:item.ambulance_affiliation_id, value:item.name};
            this.ambulance_affiliation_master.push(master);
          })
        }
        if(res.autopsy_classific_master !== undefined && res.autopsy_classific_master.length > 0){
          res.autopsy_classific_master.map(item=>{
            let master = {id:item.autopsy_classific_id, value:item.name};
            this.autopsy_classific_master.push(master);
          })
        }
        if(res.ward_master !== undefined && res.ward_master.length > 0){
          res.ward_master.map(item=>{
            let master = {id:item.number, value:item.name};
            this.ward_master.push(master);
          })
        }
        if(res.dial_other_facilities_master !== undefined && res.dial_other_facilities_master.length > 0){
          res.dial_other_facilities_master.map(item=>{
            let master = {id:item.number, value:item.name};
            this.dial_other_facilities_master.push(master);
          })
        }
      })
      .catch(() => {
      });
  };

  setSelectedValue = (key, e) => {
    this.change_flag = 1;
    this.setState({[key]:parseInt(e.target.id)});
  };

  getCheckIntroductionLetter = (name, value) => {
    if (name === "introduction_letter"){
      this.change_flag = 1;
      this.setState({
        introduction_letter: value,
      });
    }
  };

  openSelectPatientModal = () => {
    this.setState({selectPatient: true});
  };

  getPatientInfo = async(patient_number) => {
    let path = "/app/api/v2/patients/received";
    let post_data = {
      keyword : patient_number,
      status: 2,
      page: 1,
      limit: "",
      name_search_type: 0,
    };
    let patient = null;

    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if (res) {
          patient = res[0];
        }
      })
      .catch(() => {
      });
    if(patient != null){
      await this.selectPatient(patient, "edit");
    }
  };

  selectPatient = async(patient, type=null) => {
    let path = "/app/api/v2/emergency/get/patient_address";
    let post_data = {
      system_patient_id:patient.systemPatientId,
    };
    let address = "";
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if(res && res.address !== undefined && res.address != null){
          address = res.address;
        }
      })
      .catch(() => {
      });
    patient.address = address;
    if(type == null){
      this.change_flag = 1;
    }
    this.setState({
      patient_info: patient,
      selectPatient: false,
    });
  };

  closeModal =()=>{
    this.setState({
      selectPatient: false,
      alert_messages:"",
      confirm_message:"",
      confirm_alert_title:"",
      confirm_type:"",
    });
  };

  register=async()=>{
    let path = "/app/api/v2/emergency/reception/register";
    let post_data = {
      number:this.state.number,
      patient_id:this.state.patient_info.systemPatientId,
      hospital_visit_classific_id:this.state.hospital_visit_classific_id,
      accident_classific_id:this.state.accident_classific_id,
      hospital_method_id:this.state.hospital_method_id,
      patient_status_id:this.state.patient_status_id,
      ambulance_affiliation_id:this.state.ambulance_affiliation_id,
      introduction_letter:this.state.introduction_letter,
      referral_hospital_id:this.state.referral_hospital_id,
      department_id:this.state.department_id,
      outcome_classific_id:this.state.outcome_classific_id,
      hospital_id:this.state.hospital_id,
      autopsy_classific_id:this.state.autopsy_classific_id,
      destination_hospital_id:this.state.destination_hospital_id,
      sender_reason:this.state.sender_reason,
      escort_doctor_codes:this.state.escort_doctor_codes,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        window.sessionStorage.setItem("alert_messages", res.alert_message);
        this.props.closeModal('register');
      })
      .catch(() => {

      });
  };

  confirmData=()=>{
    if(this.change_flag == 0){
      return;
    }
    if(this.state.patient_info == null){
      this.setState({alert_messages:"患者様を選択してください。"});
      return;
    }
    if(this.state.hospital_visit_classific_id === 0){
      this.setState({alert_messages:"来院区分を選択してください。"});
      return;
    }
    let confirm_message = '登録しますか？';
    if(this.state.number >0){
      confirm_message = '編集しますか？';
    }
    this.setState({
      confirm_type:"register",
      confirm_message
    });
  };

  setSenderReason = e => {
    if(e.target.value.length > 25){
      this.setState({alert_messages: "25文字以上入力できません。"});
      return;
    }
    this.change_flag = 1;
    this.setState({sender_reason: e.target.value});
  };

  selectEscortDoctor=(doctor_code)=>{
    let escort_doctor_codes = this.state.escort_doctor_codes;
    if(escort_doctor_codes.length > 2){
      this.setState({alert_messages:"転送付添医師は2人まで選択可能です。"});
      return;
    }
    let index = escort_doctor_codes.indexOf(doctor_code);
    if(index === -1){
      escort_doctor_codes.push(doctor_code);
    } else {
      escort_doctor_codes.splice(index, 1);
    }
    this.change_flag = 1;
    this.setState({escort_doctor_codes});
  };

  confirmCloseModal=()=>{
    if(this.change_flag == 1){
      this.setState({
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type:"close",
        confirm_alert_title:'入力中',
      });
    } else {
      this.props.closeModal();
    }
  }

  confirmOk=()=>{
    if(this.state.confirm_type == "register"){
      this.register();
    } else if(this.state.confirm_type == "close"){
      this.props.closeModal();
    }
  }

  render() {
    return (
      <>
        <Modal show={true} className="custom-modal-sm patient-exam-modal emergency_reception-modal first-view-modal">
          <Modal.Header><Modal.Title>救急受付</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              {this.state.load_flag ? (
                <>
                  <div style={{fontSize:"1.25rem"}}>患者情報</div>
                  <div className={'patient-info'}>
                    <div className={'select-patient'}>
                      <button onClick={this.openSelectPatientModal}>患者選択</button>
                    </div>
                    <div className={'info-item flex'}>
                      <div className={'label-title'}>患者ID</div>
                      <div className={'content'}>{this.state.patient_info != null ? this.state.patient_info.patientNumber : ""}</div>
                    </div>
                    <div className={'info-item flex'}>
                      <div className={'label-title'}>氏名</div>
                      <div className={'content'} style={{width:"calc(100% - 7rem)"}}>{this.state.patient_info != null ? this.state.patient_info.name : ""}</div>
                    </div>
                    <div className={'info-item flex'}>
                      <div className={'label-title'}>生年月日</div>
                      <div className={'content'}>{this.state.patient_info != null ? this.state.patient_info.birthday : ""}</div>
                      <div className={'label-title'} style={{width:"3rem"}}>性別</div>
                      <div className={'content'} style={{width:"2rem"}}>{this.state.patient_info != null ? (this.state.patient_info.sex  == 1 ? '男' : '女') : ""}</div>
                    </div>
                    <div className={'info-item flex'}>
                      <div className={'label-title'}>年齢</div>
                      <div className={'content'}>{this.state.patient_info != null ? this.state.patient_info.age : ""}</div>
                    </div>
                    <div className={'info-item flex'}>
                      <div className={'label-title'}>住所</div>
                      <div className={'content'} style={{width:"calc(100% - 7rem)"}}>{this.state.patient_info != null ? this.state.patient_info.address : ""}</div>
                    </div>
                  </div>
                  <div style={{paddingTop:"0.3rem", fontSize:"1.25rem"}}>受付情報</div>
                  <div className={'reception-info'}>
                    <div className={'flex'}>
                      <div style={{width:"50%"}}>
                        <SelectorWithLabel
                          title="来院区分"
                          options={this.hospital_visit_classific_master}
                          getSelect={this.setSelectedValue.bind(this, "hospital_visit_classific_id")}
                          departmentEditCode={this.state.hospital_visit_classific_id}
                        />
                      </div>
                      <div style={{width:"50%"}}>
                        <SelectorWithLabel
                          title="事故区分"
                          options={this.accident_classific_master}
                          getSelect={this.setSelectedValue.bind(this, "accident_classific_id")}
                          departmentEditCode={this.state.accident_classific_id}
                        />
                      </div>
                    </div>
                    <div className={'flex'} style={{marginTop:"0.3rem"}}>
                      <div style={{width:"50%"}}>
                        <SelectorWithLabel
                          title="来院方法"
                          options={this.hospital_method_master}
                          getSelect={this.setSelectedValue.bind(this, "hospital_method_id")}
                          departmentEditCode={this.state.hospital_method_id}
                        />
                      </div>
                      <div style={{width:"50%"}}>
                        <SelectorWithLabel
                          title="患者状態"
                          options={this.patient_status_master}
                          getSelect={this.setSelectedValue.bind(this, "patient_status_id")}
                          departmentEditCode={this.state.patient_status_id}
                        />
                      </div>
                    </div>
                    <div className={'flex'} style={{marginTop:"0.3rem"}}>
                      <div style={{width:"50%"}}>
                        <SelectorWithLabel
                          title="救急車所属"
                          options={this.ambulance_affiliation_master}
                          getSelect={this.setSelectedValue.bind(this, "ambulance_affiliation_id")}
                          departmentEditCode={this.state.ambulance_affiliation_id}
                        />
                      </div>
                    </div>
                    <div className={'flex'} style={{marginLeft:"10px"}}>
                      <Checkbox
                        label="紹介状"
                        getRadio={this.getCheckIntroductionLetter.bind(this)}
                        value={this.state.introduction_letter}
                        name="introduction_letter"
                      />
                    </div>
                    <div className={'select-facility'}>
                      <SelectorWithLabel
                        title="紹介元病院"
                        options={this.dial_other_facilities_master}
                        getSelect={this.setSelectedValue.bind(this, "referral_hospital_id")}
                        departmentEditCode={this.state.referral_hospital_id}
                      />
                    </div>
                    <div className={'flex'} style={{marginTop:"0.3rem"}}>
                      <div style={{width:"50%"}}>
                        <SelectorWithLabel
                          title="診療科"
                          options={this.departmentOptions}
                          getSelect={this.setSelectedValue.bind(this, "department_id")}
                          departmentEditCode={this.state.department_id}
                        />
                      </div>
                    </div>
                    <div className={'flex'} style={{marginTop:"0.3rem"}}>
                      <div style={{width:"50%"}}>
                        <SelectorWithLabel
                          title="転帰区分"
                          options={this.outcome_classific}
                          getSelect={this.setSelectedValue.bind(this, "")}
                          departmentEditCode={this.state.outcome_classific_id}
                        />
                      </div>
                      <div style={{width:"50%"}}>
                        <SelectorWithLabel
                          title="入院病棟"
                          options={this.ward_master}
                          getSelect={this.setSelectedValue.bind(this, "hospital_id")}
                          departmentEditCode={this.state.hospital_id}
                        />
                      </div>
                    </div>
                    <div className={'flex'} style={{marginTop:"0.3rem"}}>
                      <div style={{width:"50%"}}></div>
                      <div style={{width:"50%"}}>
                        <SelectorWithLabel
                          title="検死区分"
                          options={this.autopsy_classific_master}
                          getSelect={this.setSelectedValue.bind(this, "autopsy_classific_id")}
                          departmentEditCode={this.state.autopsy_classific_id}
                        />
                      </div>
                    </div>
                    <div className={'select-facility'} style={{marginTop:"0.3rem"}}>
                      <SelectorWithLabel
                        title="転送先病院"
                        options={this.dial_other_facilities_master}
                        getSelect={this.setSelectedValue.bind(this, "destination_hospital_id")}
                        departmentEditCode={this.state.destination_hospital_id}
                      />
                    </div>
                    <div className={'two-box sender-reason'}>
                      <InputWithLabel
                        label="転送先理由"
                        type="text"
                        getInputText={this.setSenderReason.bind(this)}
                        diseaseEditData={this.state.sender_reason}
                      />
                    </div>
                    <div className={'two-box flex'} style={{marginTop:"0.3rem"}}>
                      <div className={'label-title'}>転送付添医師</div>
                      <div className={'two-doctor'}>
                        {this.doctor_list.map((doctor)=>{
                          return (
                            <>
                              <div
                                className={this.state.escort_doctor_codes.includes(doctor.doctor_code) ? 'row-item selected' : 'row-item'}
                                onClick={this.selectEscortDoctor.bind(this, doctor.doctor_code)}
                              >
                                {doctor.name}
                              </div>
                            </>
                          )
                        })}
                      </div>
                      <div style={{paddingLeft:"10px", marginTop:"calc(98vh - 54rem)"}}>2人まで</div>
                    </div>
                  </div>
                </>
              ):(
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              )}
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className='cancel-btn' onClick={this.confirmCloseModal}>キャンセル</Button>
            <Button className={this.change_flag == 1 ? 'red-btn' : "disable-btn"} onClick={this.confirmData}>確定</Button>
          </Modal.Footer>
          {this.state.selectPatient && (
            <SelectPatientModal
              handleOk={this.selectPatient}
              closeModal={this.closeModal}
            />
          )}
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
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
          {this.state.confirm_message !== "" && (
            <SystemConfirmJapanModal
              hideConfirm= {this.closeModal.bind(this)}
              confirmCancel= {this.closeModal.bind(this)}
              confirmOk= {this.confirmOk}
              confirmTitle= {this.state.confirm_message}
              title = {this.state.confirm_alert_title}
            />
          )}
        </Modal>
      </>
    );
  }
}
EmergencyReceptionModal.contextType = Context;
EmergencyReceptionModal.propTypes = {
  closeModal: PropTypes.func,
  modal_data: PropTypes.array,
};

export default EmergencyReceptionModal;
