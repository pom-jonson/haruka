import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import Checkbox from "~/components/molecules/Checkbox";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import DatePicker, { registerLocale } from "react-datepicker";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import SelectDoctorModal from "~/components/templates/Patient/components/SelectDoctorModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import SelectMedicineModal from "~/components/templates/Patient/Modals/Common/SelectMedicineModal";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .flex{
    display:flex;
  }  
  .left-area{
    width:50%;
    .label-title{
      text-align: left;
      width: 6rem;
      font-size:1rem;
      height:2.3rem;
      line-height:2.3rem;
      margin:0;
    }
    .pullbox-label {margin:0;}
    .pullbox-select{
      width:10rem;
      height:2.3rem;
    }
    .patient-name {
      border:1px solid #aaa;
      width:20rem;
      min-height:2.3rem;
      line-height:2.3rem;
      padding:0 0.2rem;
    }
    .select-date {
      input {    
        width: 10rem;
        height: 2.3rem;
      }
    }
    .select-disease {
      button {
        margin-left:0.2rem;
        height:2.3rem;
      }
    }
    textarea {
      width: calc(100% - 7rem);
    }
  }  
  .right-area{    
    width:48%;
    .pullbox-select {
      width:20rem;
      height:2.3rem;
    }
    .label-title{
      display:none;
    }
    padding-top:15%;
    button {
      height:2.3rem;
      margin-left:0.5rem;
    }
    textarea {
      width:calc(100% - 3rem);
    }
  }
}
 `;

class RegisterModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      print_date:new Date(),
      department_id:1,
      ward_master : [],
      first_ward_id:1,
      openSelectDoctorModal:false,
      doctor_code:"",
      isOpenSelectDiseaseModal:false,
      disease_name:"",
      disease_name_id:"",
      symptom:"",
      treatment_plan_comments:"",
      other:"",
      hospitalization_plan_entry_flag:0,
      confirm_message:"",
    };
    this.change_flag = 0;
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.doctors_data = sessApi.getDoctorList();
  }

  async componentDidMount() {
    await this.getMasterData();
  }

  getMasterData=async()=>{
    let path = "/app/api/v2/ward/get/master_data/plan_list";
    let post_data = {
    };
    await apiClient
      ._post(path, {
          params: post_data
      })
      .then((res) => {
        let ward_master = this.state.ward_master;
        if(res.ward_master.length > 0){
          res.ward_master.map(ward=>{
            ward_master.push({id:ward.number, value:ward.name});
          })
        }
        this.setState({ward_master});
      })
      .catch(() => {
      });
  }

  setPrintDate=(value)=>{
    this.change_flag = 1;
    this.setState({ print_date: value });
  }

  setDepartment = e => {
    this.setState({ department_id: parseInt(e.target.id)});
  };

  setWard = e => {
    this.setState({ first_ward_id: parseInt(e.target.id)});
  };

  openSelectDoctorModal=()=>{
    this.setState({openSelectDoctorModal:true});
  }

  confirmCancel=()=> {
    this.setState({
      openSelectDoctorModal:false,
      isOpenSelectDiseaseModal:false,
      confirm_message: "",
    });
  }

  setDoctor = e => {
    this.change_flag = 1;
    this.selectDoctorFromModal(e.target.id);
  };

  selectDoctorFromModal = (doctor_code) => {
    this.change_flag = 1;
    this.setState({
      doctor_code,
      openSelectDoctorModal: false,
    });
  };

  setDiseaseName =  () => {
    this.setState({isOpenSelectDiseaseModal: true});
  };

  selectDiseaseName =(disease_name,disease)=>{
    this.change_flag = 1;
    this.setState({
      disease_name,
      disease_name_id:disease.number,
    });
  }

  setSymptom = (e) => {
    this.setState({symptom:e.target.value});
  };

  setTreatmentPlan = (e) => {
    this.setState({treatment_plan_comments:e.target.value});
  };

  setOther = (e) => {
    this.setState({other:e.target.value});
  };

  clearOther = () => {
    this.setState({other:""});
  };

  getAlwaysShow = (name, value) => {
    if(name==="hospitalization_plan_entry_flag"){
      this.setState({hospitalization_plan_entry_flag: value})
    }
  };

  render() {
    let doctor_name = '';
    if(this.state.doctor_code != "" && this.doctors_data != null){
      this.doctors_data.map(doctor=>{
        if(doctor.doctor_code == this.state.doctor_code){
          doctor_name = doctor.name;
        }
      })
    }
    return  (
      <Modal show={true} id="add_contact_dlg"  className="hospital-plan-doc first-view-modal">
        <Modal.Header><Modal.Title>入院診療計画書</Modal.Title></Modal.Header>
        <Modal.Body>
          <DatePickerBox style={{width:"100%", height:"100%"}}>
            <Wrapper>
              <div className='left-area'>
                <div className={'flex'}>
                  <div className={'label-title'}>患者氏名</div>
                  <div className={'patient-name'}></div>
                </div>
                <div className='flex select-date' style={{marginTop:"0.5rem"}}>
                  <div className='label-title'>日付</div>
                  <DatePicker
                    locale="ja"
                    selected={this.state.print_date}
                    onChange={this.setPrintDate}
                    dateFormat="yyyy/MM/dd"                        
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"                  
                    dayClassName = {date => setDateColorClassName(date)}
                  />
                </div>  
                <div className="flex" style={{marginTop:"0.5rem"}}>
                  <SelectorWithLabel
                    title="診療科"
                    options={this.departmentOptions}
                    getSelect={this.setDepartment}
                    departmentEditCode={this.state.department_id}
                  />
                </div>
                <div className="flex" style={{marginTop:"0.5rem"}}>
                  <SelectorWithLabel
                    title="病棟"
                    options={this.state.ward_master}
                    getSelect={this.setWard}
                    departmentEditCode={this.state.first_ward_id}
                  />
                </div>
                <div className="flex" style={{marginTop:"0.5rem"}}>
                  <div className={'label-title'}>医師名</div>
                  <div className={'patient-name'} style={{cursor:"pointer"}} onClick={this.openSelectDoctorModal}>{doctor_name}</div>
                </div>
                <div className="flex select-disease" style={{marginTop:"0.5rem"}}>
                  <div className={'label-title'}>病名</div>
                  <div className={'patient-name'}>{this.state.disease_name}</div>
                  <button onClick={this.setDiseaseName}>病名選択</button>
                </div>
                <div className="flex" style={{marginTop:"0.5rem"}}>
                  <label className='label-title'>症状</label>
                  <textarea
                    onChange={this.setSymptom.bind(this)}
                    value={this.state.symptom}
                  />
                </div>
                <div className="flex" style={{marginTop:"0.5rem"}}>
                  <label className='label-title'>治療計画</label>
                  <textarea
                    onChange={this.setTreatmentPlan.bind(this)}
                    value={this.state.treatment_plan_comments}
                  />
                </div>
              </div>     
              <div className='right-area'>
                <div>推進された入院期間</div>
                <SelectorWithLabel
                    title=""
                    options={[]}
                    getSelect={this.getDepartment}
                    departmentEditCode={this.state.departmentCode}
                />
                <div>その他（看護計画、リハビリテーション等の計画）</div>
                <div className={'flex'}>
                  <textarea
                    onChange={this.setOther.bind(this)}
                    value={this.state.other}
                  />
                  <button onClick={this.clearOther}>C</button>
                </div>
              </div>                    
            </Wrapper>                    
          </DatePickerBox>
        </Modal.Body>
        <Modal.Footer>  
          <Checkbox
            label="記入済み"
            getRadio={this.getAlwaysShow.bind(this)}
            value={this.state.hospitalization_plan_entry_flag}
            checked = {this.state.hospitalization_plan_entry_flag === 1}
            name="hospitalization_plan_entry_flag"
          />
          <Button className={'cancel-btn'} onClick={this.props.closeModal}>キャンセル</Button>
          <Button className={'red-btn'}>確定</Button>
        </Modal.Footer>
        {this.state.confirm_message !== '' && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.register.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.doctors_data != null && this.state.openSelectDoctorModal && (
          <SelectDoctorModal
            closeDoctor={this.confirmCancel}
            getDoctor={this.setDoctor}
            selectDoctorFromModal={this.selectDoctorFromModal}
            doctors={this.state.doctors}
          />
        )}
        {this.state.isOpenSelectDiseaseModal && (
          <SelectMedicineModal
            closeModal = {this.confirmCancel}
            system_patient_id={84}
            selectDiseaseName={this.selectDiseaseName}
          />
        )} 
      </Modal>
    );
  }
}

RegisterModal.contextType = Context;

RegisterModal.propTypes = {
    closeModal: PropTypes.func,
    handleOk:   PropTypes.func,    
    modal_data:PropTypes.object,
    modal_type : PropTypes.number,
};

export default RegisterModal;
