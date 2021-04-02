import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import {
  formatDateSlash, 
  formatDateString, 
  formatDateTimeIE,
  formatDateLine,
} from "~/helpers/date";
import * as apiClient from "~/api/apiClient";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Button from "~/components/atoms/Button";
import Radiobox from "~/components/molecules/Radiobox";
import Checkbox from "~/components/molecules/Checkbox";
import axios from "axios/index";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import * as sessApi from "~/helpers/cacheSession-utils";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import {harukaValidate} from "~/helpers/haruka_validate";
import $ from "jquery";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import {CACHE_SESSIONNAMES, getServerTime} from "~/helpers/constants";
import Spinner from "react-bootstrap/Spinner";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { faMinusCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as localApi from "~/helpers/cacheLocal-utils";
import AnamuneHistoryModal from "~/components/templates/Nurse/AnamuneHistoryModal";
import ShowHistoryDetailModal from "~/components/templates/Nurse/ShowHistoryDetailModal"

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 1rem;
`;

const Header = styled.div`
  margin-bottom:4px;  
  display:flex;
  button{    
    height: 2rem;
    width:6rem;
    font-size: 1rem;
    margin-right:0.5rem;
    padding:0.3rem;
    position: absolute;
    right: 15px;
    top: 11px;
  }
  .cancel-btn {
    background: #ffffff;
    border: solid 2px #7e7e7e;
    span {
      color: #7e7e7e;
    }
  }
  .cancel-btn:hover {
    border: solid 2px #000000;
    background: #ffffff;
    span {
      color: #000000;
    }
  }
`;

const PatientsWrapper = styled.div`
  width: 100%;
  height: 100%;
  font-size:1rem;
  .flex {display: flex;}
  .justify-content {
    align-items: flex-start;
    justify-content: space-between;
  }
  .div-value {
    height:2rem;
    line-height:2rem;
    padding:0 0.3rem;
    border:1px solid #aaa;
  }
  .div-title {
    height:2rem;
    line-height:2rem;
    margin-right : 0.5rem;
    min-width : 2.5rem;
  }
  .react-datepicker-wrapper {
    input {
     height: 2rem;
     width: 6rem;
     font-size:1rem;
    }
  } 
  .border-1px {border:1px solid #aaa;}
  .w-50-p {width:50%;}
  .vertical-align {
    display:flex;
    align-items: center;
    div {
      width: 100%;
      text-align: center;
    }
  }
  .summary-area {
    width:100%;
    height:100%;
    padding:0.5rem;
    .border-right-1px {border-right:1px solid #aaa;}
    .border-top-1px {border-top:1px solid #aaa;}
    .border-bottom-1px {border-bottom:1px solid #aaa;}
    .border-left-1px {border-left:1px solid #aaa;}
    .scroll-area {
      width:100%;
      height:calc(100% - 2rem);
      padding-bottom: 1px;
      overflow-y: auto;
    }
    .mt-m-1px {
      margin-top: -1px;
    }
    .past-history {
      width:100%;
    }
    .summary-label {
      width:6rem;
      border-right:1px solid #aaa;
    }
    .summary-value {
      width:calc(100% - 6rem);
      .simple-input-div{
        input{
          width:94%;
          margin-left:1%;
          line-height:2rem;
          font-size:1rem;
          height:2rem;
        }
      }
    }
    .div-input {
      div {margin-top:0;}
      .label-title {
        margin:0;
        line-height:2rem;
        font-size:1rem;
        width: 7rem;
        text-align:right;
        margin-right:10px;
      }
      input {
        line-height:2rem;
        font-size:1rem;
        height:2rem;
      }
    }
    .select-radio {
      display:flex;
      padding-left: 0.5rem;
      label {
        font-size:1rem;
        line-height:2rem;
      }
    }
    .pressure-ulcer-site {
      width:calc(100% - 8rem);
      .label-title {width:4rem;}
      input {width:10rem;}
    }
    .unit-input {
      .label-title {
        display:none;
      }
      input {width:5rem;}
    }
    .insurance-required {
      width:calc(100% - 12rem);
      .label-title {display:none;}
      input {width:100%;}
    }
    .insurance-office {
      width:100%;
      margin: 0.3rem 0;
      .label-title {
        width:5rem;
        margin-left: 0.5rem;
      }
      input {width:calc(100% - 5rem);}
    }
    .key-person {
      width:100%;
      margin: 0.3rem 0;
      .label-title {
        width:8rem;
        margin-left: 0.5rem;
      }
      input {width:9rem;}
    }
    .select-check {
      display:flex;
      margin-left: 0.5rem;
      label {
        font-size:1rem;
        line-height:2rem;
        min-width: 4rem;
      }
    }
    .p-03 {padding:0.3rem;}
    .l-h-2 {line-height:2rem;}
    .select-date {
      display:flex;
      .date-title {
        padding-left:0.2rem;
      }
      div {margin-top:0;}
      .label-title {display:none;}
      .input {
        font-size:1rem;
        height:2rem;
        width:7rem;
      }
    }
    .unit-value-input {
      display:flex;
      div {margin-top:0;}
      .label-title {display:none;}
      input {
        font-size:1rem;
        height:2rem;
        width:4rem;
      }
      .unit-label {
        line-height:2rem;
        padding-left:0.2rem;
      }
    }
    .no-label-input{
      .label-title{
        display:none;
      }
    }
    .emergency-contact {
      div {margin-top:0;}
      .label-title {display:none;}
      input {
        font-size:1rem;
        height:2rem;
        width:100%;
      }
    }
    .select-doctor {
      .label-title {display:none;}
      .pullbox-label {
        margin:0;
        width:100%;
      }
      .pullbox-select {
        height:2rem;
        font-size:1rem;
        width:100%;
      }
    }
  }
  .react-datepicker__month {
    margin: 0.4rem !important;
  }
  .ime-active {
    input {ime-mode: active;}
  }
  .hankaku-eng-num-input {
    ime-mode: inactive;
    input{
      ime-mode: inactive;
    }
  }
  .medical-history {
    width:100%;
    table {
      margin:0px;
      tbody{
        display:block;
        overflow-y: scroll;
        height: 9rem;
        width:100%;
      }
      tr{
        display: table;
        width: 100%;
      }
      thead{
        display:table;
        width:100%;
        border-bottom: 1px solid #dee2e6;
        tr{width: calc(100% - 17px);}
      }
      td {
        padding: 0rem;
        word-break: break-all;
        font-size: 1rem;
        vertical-align: middle;
      }
      th {
          position: sticky;
          text-align: center;
          padding: 0.25rem;
          font-size: 1rem;
          white-space:nowrap;
          border:1px solid #dee2e6;
          border-bottom:none;
          border-top:none;
          font-weight: normal;
      }
      .td-input {
        padding:0;
        div {margin-top:0;}
        .label-title {display:none;}
        input {
          font-size:1rem;
          height:2rem;
        }
      }
      .age-td{
        width:3.5rem;
        input {width:calc(3.5rem - 1px);}
      }
      .birth-td{
        padding-left:0;
        padding-right:0;
        .label-title{
          display:none;
        }
        div{
          margin-top:0px;
        }
        input{
          height:2rem;
          font-size:1rem;
        }
        width:11rem;
        .input-year{
          input{
            width:4rem;
            margin-right:1px;
          }
        }
        .input-month{
          input{
            width:3rem;
            margin-right:1px;
          }
        }
        .input-date{
          input{
            width:3rem;
            margin-right:1px;
          }
        }
      }
      .disease-td{
        width:10rem;
        input {width:calc(10rem - 1px);}
      }
      .hospital-td{
        width:17rem;
        input {width:calc(17rem - 1px);}
      }
      .department-td{
        width:10rem;
        div{
          width:10rem;
        }
        input {width:100%;}
      }
      .prescription-td{
        // width:12rem;
        text-align:center;
        label {
          font-size:1rem;
          line-height:2rem;
        }
      }
      .icon-td{
        padding: 0px;
        div {
          line-height: 2rem;
          width:50%;
          text-align: center;
          svg {
            cursor:pointer;
            margin:0;
          }
        }
      }
    }
  }
  .updated-date {
    .react-datepicker-popper {
      left: -150px !important;
      .react-datepicker__triangle {
        left: 180px !important;
      }
    }
  }
`;

const SpinnerWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class VisitNurseSummaryModal extends Component {
  constructor(props) {
    super(props);
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    let hospital_name = "";
    if(initState !== undefined && initState != null && initState.conf_data !== undefined && initState.conf_data.hospital_name !== undefined){
      hospital_name = initState.conf_data.hospital_name;
    }
    var care_necessary = [false, false];
    var excretion_type_array = [false,false,false,false];
    let patientId = props.patientId;
    let patientInfo = props.patientInfo;
    let path = window.location.href.split("/");
    if(path[path.length - 1] == "nursing_document"){
      let nurse_patient_info = localApi.getObject("nurse_patient_info");
      if(nurse_patient_info !== undefined && nurse_patient_info != null){
        patientInfo = nurse_patient_info.patientInfo;
        patientId = nurse_patient_info.detailedPatientInfo.patient[0]['number'];
      }
    }
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));    
    var modal_data = (this.props.modal_data != undefined && this.props.modal_data != null)? this.props.modal_data.summary_data:null;
    if (modal_data == undefined) modal_data = null;
    this.patient_age = '';
    this.birth_year = ''
    this.year = new Date().getFullYear();    
    if (this.props.modal_data != undefined && this.props.modal_data != null && this.props.modal_data.birthday != undefined && this.props.modal_data.birthday != null && this.props.modal_data.birthday != ''){
      var birthday = this.props.modal_data.birthday;
      this.birth_year = birthday.split('-')[0];
      this.patient_age = this.year - this.birth_year;
    }
    this.state = {
      patientId:patientId > 0?patientId: (this.props.modal_data != null && this.props.modal_data.system_patient_id > 0 ? this.props.modal_data.system_patient_id:''),
      patientInfo,
      care_necessary,
      excretion_type_array,      
      hospital_name,
      

      patient_number:this.props.modal_data != null && this.props.modal_data.patient_number > 0 ? this.props.modal_data.patient_number:'',
      patient_name:this.props.modal_data != null && this.props.modal_data.patient_name != null ? this.props.modal_data.patient_name:'',
      birthday:this.props.modal_data != null && this.props.modal_data.birthday != null ? this.props.modal_data.birthday:'',
      birthDate:this.props.modal_data != null && this.props.modal_data.birthDate != null ? this.props.modal_data.birthDate:'',
      place_name:this.props.modal_data != null && this.props.modal_data.place_name != null ? this.props.modal_data.place_name:'',
      number:modal_data == null ? 0 : modal_data.number,
      create_flag:modal_data == null ? 0 : modal_data.create_flag,
      history:modal_data == null ? null : modal_data.history,
      // ward_name:res.ward_name,
      disease_name:modal_data != null && modal_data.disease_name != null ? modal_data.disease_name:'',
      medical_history:(modal_data != null && modal_data.medical_history != null) ? modal_data.medical_history : [{age:"", disease_name:"", hospital:"", year:'', month:'', day:''}],
      visit_another_hospital:(modal_data != null && modal_data.visit_another_hospital != null) ? modal_data.visit_another_hospital : [{hospital:'', department:'', prescription:0}, {hospital:'', department:'', prescription:0}],
      pressure_ulcer_judgment:modal_data != null && modal_data.pressure_ulcer_judgment != null ? modal_data.pressure_ulcer_judgment : 0,
      pressure_ulcer_site:(modal_data != null && modal_data.pressure_ulcer_site != null) ? modal_data.pressure_ulcer_site : "",
      meal_judgment:modal_data != null && modal_data.meal_judgment != null ? modal_data.meal_judgment : null,
      denture_judgment:modal_data != null && modal_data.denture_judgment != null ? modal_data.denture_judgment : 0,
      denture_part:modal_data != null && modal_data.denture_part != null ? modal_data.denture_part : null,
      infectious_disease_judgment:modal_data != null && modal_data.infectious_disease_judgment != null ? modal_data.infectious_disease_judgment : 0,
      hbs:modal_data != null && modal_data.hbs != null ? modal_data.hbs : 0,
      hcv:modal_data != null && modal_data.hcv != null ? modal_data.hcv : 0,
      syphilis:modal_data != null && modal_data.syphilis != null ? modal_data.syphilis : 0,
      hiv:modal_data != null && modal_data.hiv != null ? modal_data.hiv : 0,
      height:(modal_data != null && modal_data.height != null) ? modal_data.height : '',
      weight:(modal_data != null && modal_data.weight != null) ? modal_data.weight : '',
      long_term_care_insurance_judgment_1:modal_data != null && modal_data.long_term_care_insurance_judgment_1 !=null ? modal_data.long_term_care_insurance_judgment_1 : 0,
      long_term_care_insurance_judgment_2:modal_data != null && modal_data.long_term_care_insurance_judgment_2 !=null ? modal_data.long_term_care_insurance_judgment_2 : 0,          
      long_term_care_insurance_office:modal_data != null && modal_data.long_term_care_insurance_office !=null ? modal_data.long_term_care_insurance_office : "",
      key_person:modal_data != null && modal_data.key_person !=null ? modal_data.key_person: "",
      emergency_contact_name:modal_data != null && modal_data.emergency_contact_name != null ? modal_data.emergency_contact_name: "",
      emergency_contact_relations:modal_data != null && modal_data.emergency_contact_relations != null ? modal_data.emergency_contact_relations: "",
      emergency_contact_phone_number:modal_data != null && modal_data.emergency_contact_phone_number != null ? modal_data.emergency_contact_phone_number: "",
      emergency_contact_name_2:modal_data != null && modal_data.emergency_contact_name_2 != null ? modal_data.emergency_contact_name_2: "",
      emergency_contact_relations_2:modal_data != null && modal_data.emergency_contact_relations_2 != null ? modal_data.emergency_contact_relations_2: "",
      emergency_contact_phone_number_2:modal_data != null && modal_data.emergency_contact_phone_number_2 != null ? modal_data.emergency_contact_phone_number_2: "",
      visually_impaired:modal_data != null && modal_data.visually_impaired != null ? modal_data.visually_impaired: 0,
      hearing_impairment:modal_data != null && modal_data.hearing_impairment != null ? modal_data.hearing_impairment: 0,
      language_disorder:modal_data != null && modal_data.language_disorder != null? modal_data.language_disorder: 0,
      movement_disorders:modal_data != null && modal_data.movement_disorders != null? modal_data.movement_disorders: 0,
      writer:modal_data != null && modal_data.writer != null? modal_data.writer: authInfo.user_number,
      writer_name:modal_data != null && modal_data.writer_name != null? modal_data.writer_name: authInfo.name,
      
      move_in_date:(modal_data != null && modal_data.move_in_date != null)
        ? formatDateTimeIE(modal_data.move_in_date): "",
      first_visit_date:(modal_data != null && modal_data.first_visit_date != null)
        ? formatDateTimeIE(modal_data.first_visit_date): "",
      remarks:modal_data != null && modal_data.remarks != null ? modal_data.remarks:'',
      when_necessary_fever:modal_data != null && modal_data.when_necessary_fever != null? modal_data.when_necessary_fever:'',          
      when_necessary_insomnia:modal_data != null && modal_data.when_necessary_insomnia != null ? modal_data.when_necessary_insomnia:'',
      when_necessary_constipation:modal_data != null && modal_data.when_necessary_constipation != null ? modal_data.when_necessary_constipation:'',
      record:modal_data != null && modal_data.record!= null ? modal_data.record:'',
      meal_comment:modal_data != null && modal_data.meal_comment != null ? modal_data.meal_comment:'',
      excretion_comment:modal_data != null && modal_data.excretion_comment != null ? modal_data.excretion_comment:'',
      excretion_type:modal_data != null && modal_data.excretion_type > 0 ? modal_data.excretion_type:0,
      height_measuring_date:(modal_data != null && modal_data.height_measuring_date != null) ? formatDateTimeIE(modal_data.height_measuring_date): "",
      weight_measuring_date:(modal_data != null && modal_data.weight_measuring_date != null)
        ? formatDateTimeIE(modal_data.weight_measuring_date): "",
      independence_level:modal_data != null && modal_data.independence_level != null ? modal_data.independence_level:'',
      dementia_level:modal_data != null && modal_data.dementia_level != null ? modal_data.dementia_level:'',
      long_term_care_insurance_comment:modal_data != null && modal_data.long_term_care_insurance_comment != null ? modal_data.long_term_care_insurance_comment:'',
      care_manager:modal_data != null && modal_data.care_manager != null ? modal_data.care_manager:'',
      key_person_relations:modal_data != null && modal_data.key_person_relations != null ? modal_data.key_person_relations:'',
      family_structure:modal_data != null && modal_data.family_structure != null ? modal_data.family_structure:'',
      life_history:modal_data != null && modal_data.life_history != null ? modal_data.life_history:'',
      paralyzed:modal_data != null && modal_data.paralyzed >= 0 ? modal_data.paralyzed : 0,
      paralyzed_site:modal_data != null && modal_data.paralyzed_site != null ? modal_data.paralyzed_site:'',
      excretion_judgment:modal_data != null && modal_data.excretion_judgment > 0 ? modal_data.excretion_judgment :0,
      contraindicated_drug:modal_data != null && modal_data.contraindicated_drug != null?modal_data.contraindicated_drug:'',
      current_medical_history:(modal_data != null && modal_data.current_medical_history != null) ? modal_data.current_medical_history: "",
      created_at:(modal_data != null && modal_data.created_at != null) ? new Date(modal_data.created_at.split('-').join('/')): new Date(),
      revision_date:(modal_data != null && modal_data.revision_date != null) ? formatDateTimeIE(modal_data.revision_date):new Date(),
      create_comment:(modal_data != null && modal_data.create_comment != null) ? modal_data.create_comment:"",
      isOpenStaffList:false,
      confirm_message:'',
      confirm_type:'',
      complete_message:'',
      alert_messages:'',
      alert_type:'',
      check_message:'',
      staffs:[],
      food_types:[],
      is_loaded:true,
      confirm_alert_title:'',
      isCloseConfirmModal:false,
      isHistoryModal:false,
      isShowDetailModal:false,
    };
    this.ward_name = [];
    this.change_flag = 0;
    this.doctor_list = [];
    let doctor_code_list = [];
    let doctor_data = sessApi.getDoctorList();
    doctor_data.map(doctor=>{
      let index = doctor_code_list.indexOf(doctor.doctor_code);
      if(index === -1){
        doctor_code_list.push(doctor.doctor_code);
        doctor.id = doctor.number;
        doctor.value = doctor.name;
        this.doctor_list.push(doctor);
      }
    });
    this.doctor_list.unshift({id:0,value:''});
    this.can_register_old = false;
    this.can_edit_old = false;
  }
  
  async componentDidMount() {
    this.can_register_old = this.context.$canDoAction(this.context.FEATURES.VISIT_NURSE_SUMMARY,this.context.AUTHS.REGISTER_OLD);
    this.can_edit_old = this.context.$canDoAction(this.context.FEATURES.VISIT_NURSE_SUMMARY,this.context.AUTHS.EDIT_OLD);
    await this.getMaster();
    await this.getNurseStaff();
    // await this.getSummaryInfo();
  }

  getNurseStaff = async() => {
    let path = "/app/api/v2/dial/master/staff/getNurseStaff";
    await apiClient.post(path, {params:{}})
    .then(res => {
      var options = [{id:0, value:''}];
      if (res.length > 0){
        res.map(item => {
          options.push({id:item.number, value:item.name})
        })
      }
      this.setState({
        nurse_staff:res,
        nurse_staff_options:options,        
      })
    })
  }

  getSummaryInfo = async() => {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let path = "/app/api/v2/nursing_service/get/visit_summary_individual";
    let post_data = {
      patientId:this.state.patientId
    };
    await apiClient.post(path, {params: post_data})
    .then(res => {
      if(res.error_message != undefined){
        this.setState({
          alert_messages:res.error_message,
          alert_type:"modal_close",
        });
      } else {        
        this.setState({
          number:res.summary_data == null ? 0 : res.summary_data.number,
          ward_name:res.ward_name,
          disease_name:res.disease_name != null && res.disease_name != '' ? res.disease_name:'',
          medical_history:(res.summary_data != null && res.summary_data.medical_history != null) ? res.summary_data.medical_history : [{age:"", disease_name:"", hospital:"", year:'', month:'', day:''}],
          visit_another_hospital:(res.summary_data != null && res.summary_data.visit_another_hospital != null) ? res.summary_data.visit_another_hospital : [{hospital:'', department:'', prescription:0}, {hospital:'', department:'', prescription:0}],
          pressure_ulcer_judgment:res.summary_data != null && res.summary_data.pressure_ulcer_judgment != null ? res.summary_data.pressure_ulcer_judgment : 0,
          pressure_ulcer_site:(res.summary_data != null && res.summary_data.pressure_ulcer_site != null) ? res.summary_data.pressure_ulcer_site : "",
          meal_judgment:res.summary_data != null && res.summary_data.meal_judgment != null ? res.summary_data.meal_judgment : null,
          denture_judgment:res.summary_data != null && res.summary_data.denture_judgment != null ? res.summary_data.denture_judgment : 0,
          denture_part:res.summary_data != null && res.summary_data.denture_part != null ? res.summary_data.denture_part : null,
          infectious_disease_judgment:res.summary_data != null && res.summary_data.infectious_disease_judgment != null ? res.summary_data.infectious_disease_judgment : 0,
          hbs:res.summary_data != null && res.summary_data.hbs != null ? res.summary_data.hbs : 0,
          hcv:res.summary_data != null && res.summary_data.hcv != null ? res.summary_data.hcv : 0,
          syphilis:res.summary_data != null && res.summary_data.syphilis != null ? res.summary_data.syphilis : 0,
          hiv:res.summary_data != null && res.summary_data.hiv != null ? res.summary_data.hiv : 0,
          height:(res.summary_data != null && res.summary_data.height != null) ? res.summary_data.height : '',
          weight:(res.summary_data != null && res.summary_data.weight != null) ? res.summary_data.weight : '',
          long_term_care_insurance_judgment_1:res.summary_data != null && res.summary_data.long_term_care_insurance_judgment_1 !=null ? res.summary_data.long_term_care_insurance_judgment_1 : 0,
          long_term_care_insurance_judgment_2:res.summary_data != null && res.summary_data.long_term_care_insurance_judgment_2 !=null ? res.summary_data.long_term_care_insurance_judgment_2 : 0,          
          long_term_care_insurance_office:res.summary_data != null && res.summary_data.long_term_care_insurance_office !=null ? res.summary_data.long_term_care_insurance_office : "",
          key_person:res.summary_data != null && res.summary_data.key_person !=null ? res.summary_data.key_person: "",
          emergency_contact_name:res.summary_data != null && res.summary_data.emergency_contact_name != null ? res.summary_data.emergency_contact_name: "",
          emergency_contact_relations:res.summary_data != null && res.summary_data.emergency_contact_relations != null ? res.summary_data.emergency_contact_relations: "",
          emergency_contact_phone_number:res.summary_data != null && res.summary_data.emergency_contact_phone_number != null ? res.summary_data.emergency_contact_phone_number: "",
          emergency_contact_name_2:res.summary_data != null && res.summary_data.emergency_contact_name_2 != null ? res.summary_data.emergency_contact_name_2: "",
          emergency_contact_relations_2:res.summary_data != null && res.summary_data.emergency_contact_relations_2 != null ? res.summary_data.emergency_contact_relations_2: "",
          emergency_contact_phone_number_2:res.summary_data != null && res.summary_data.emergency_contact_phone_number_2 != null ? res.summary_data.emergency_contact_phone_number_2: "",
          visually_impaired:res.summary_data != null && res.summary_data.visually_impaired != null ? res.summary_data.visually_impaired: 0,
          hearing_impairment:res.summary_data != null && res.summary_data.hearing_impairment != null ? res.summary_data.hearing_impairment: 0,
          language_disorder:res.summary_data != null && res.summary_data.language_disorder != null? res.summary_data.language_disorder: 0,
          movement_disorders:res.summary_data != null && res.summary_data.movement_disorders != null? res.summary_data.movement_disorders: 0,
          writer:res.summary_data != null && res.summary_data.writer != null? res.summary_data.writer: authInfo.user_number,
          writer_name:res.summary_data != null && res.summary_data.writer_name != null? res.summary_data.writer_name: authInfo.name,
          
          move_in_date:(res.summary_data != null && res.summary_data.move_in_date != null)
            ? formatDateTimeIE(res.summary_data.move_in_date): "",
          first_visit_date:(res.summary_data != null && res.summary_data.first_visit_date != null)
            ? formatDateTimeIE(res.summary_data.first_visit_date): "",
          remarks:res.summary_data != null && res.summary_data.remarks != null ? res.summary_data.remarks:'',
          when_necessary_fever:res.summary_data != null && res.summary_data.when_necessary_fever != null? res.summary_data.when_necessary_fever:'',          
          when_necessary_insomnia:res.summary_data != null && res.summary_data.when_necessary_insomnia != null ? res.summary_data.when_necessary_insomnia:'',
          when_necessary_constipation:res.summary_data != null && res.summary_data.when_necessary_constipation != null ? res.summary_data.when_necessary_constipation:'',
          record:res.summary_data != null && res.summary_data.record!= null ? res.summary_data.record:'',
          meal_comment:res.summary_data != null && res.summary_data.meal_comment != null ? res.summary_data.meal_comment:'',
          excretion_comment:res.summary_data != null && res.summary_data.excretion_comment != null ? res.summary_data.excretion_comment:'',
          excretion_type:res.summary_data != null && res.summary_data.excretion_type > 0 ? res.summary_data.excretion_type:0,
          height_measuring_date:(res.summary_data != null && res.summary_data.height_measuring_date != null)
            ? formatDateTimeIE(res.summary_data.height_measuring_date): "",
          weight_measuring_date:(res.summary_data != null && res.summary_data.weight_measuring_date != null)
            ? formatDateTimeIE(res.summary_data.weight_measuring_date): "",
          independence_level:res.summary_data != null && res.summary_data.independence_level != null ? res.summary_data.independence_level:'',
          dementia_level:res.summary_data != null && res.summary_data.dementia_level != null ? res.summary_data.dementia_level:'',
          long_term_care_insurance_comment:res.summary_data != null && res.summary_data.long_term_care_insurance_comment != null ? res.summary_data.long_term_care_insurance_comment:'',
          care_manager:res.summary_data != null && res.summary_data.care_manager != null ? res.summary_data.care_manager:'',
          key_person_relations:res.summary_data != null && res.summary_data.key_person_relations != null ? res.summary_data.key_person_relations:'',
          family_structure:res.summary_data != null && res.summary_data.family_structure != null ? res.summary_data.family_structure:'',
          life_history:res.summary_data != null && res.summary_data.life_history != null ? res.summary_data.life_history:'',
          paralyzed:res.summary_data != null && res.summary_data.paralyzed >= 0 ? res.summary_data.paralyzed : 0,
          paralyzed_site:res.summary_data != null && res.summary_data.paralyzed_site != null ? res.summary_data.paralyzed_site:'',
          excretion_judgment:res.summary_data != null && res.summary_data.excretion_judgment > 0 ? res.summary_data.excretion_judgment :0,
          contraindicated_drug:res.summary_data != null && res.summary_data.contraindicated_drug != null?res.summary_data.contraindicated_drug:'',
          current_medical_history:(res.summary_data != null && res.summary_data.current_medical_history != null) ? res.summary_data.current_medical_history: "",
          created_at:(res.summary_data != null && res.summary_data.created_at != null) ? new Date(res.summary_data.created_at.split('-').join('/')): new Date(),
          revision_date:(res.summary_data != null && res.summary_data.revision_date != null)? new Date(res.summary_data.revision_date.split('-').join('/')): new Date(),
          is_loaded:true,
        }, () => {
          this.setState({
            care_necessary : this.makeCheckCareArray(this.state.long_term_care_insurance_judgment_2),
            excretion_type_array : this.makeCheckExcretionArray(this.state.excretion_type),
          })
        });
      }
    })
  }

  makeCheckCareArray = (value) => {
    var care_necessary = [false, false];
    if (value == 0) return care_necessary;

    for(var i = 0; i <= 1; i++){
      var pval = Math.pow(2, i);
      if ((value & pval) > 0){
        care_necessary[i] = true;
      } else {
        care_necessary[i] = false;
      }
    }

    return care_necessary;
  }

  makeCheckExcretionArray = (value) => {
    var excretion_type_array = [false, false, false, false];
    if (value == 0) return excretion_type_array;

    for(var i = 0; i <= 3; i++){
      var pval = Math.pow(2, i);
      if ((value & pval) > 0){
        excretion_type_array[i] = true;
      } else {
        excretion_type_array[i] = false;
      }
    }
    return excretion_type_array;
  }
  
  getMaster=async()=>{
    let path = "/app/api/v2/nursing_service/get/nurse_summary/master";
    let post_data = {};
    await apiClient.post(path, {params: post_data})
      .then(res => {
        let food_types = [{id:0, value:""}];
        if(res.food_type_master != undefined && res.food_type_master.length > 0){
          res.food_type_master.map(item=>{
            food_types.push({id:item.number, value:item.name});
          })
        }
        this.setState({
          food_types,
          staffs: (res.staff != undefined && res.staff.original != undefined && res.staff.original.length > 0) ? res.staff.original : [],
          is_loaded:true,
        });
      })
      .catch(()=> {
      })
  }
  
  setRadioState = (e) => {
    this.change_flag = 1;
    let state_data = {};
    state_data[e.target.name] = parseInt(e.target.value);
    if(e.target.name == "pressure_ulcer_judgment" && e.target.value == 0){
      state_data['pressure_ulcer_site'] = "";
    }
    if(e.target.name == "denture_judgment" && e.target.value == 0){
      state_data['denture_part'] = 0;
    }
    if(e.target.name == "infectious_disease_judgment" && e.target.value == 0){
      state_data['hbs'] = 0;
      state_data['hcv'] = 0;
      state_data['syphilis'] = 0;
      state_data['hiv'] = 0;
    }    
    if(e.target.name == "long_term_care_insurance_judgment" && e.target.value == 0){
      state_data['long_term_care_insurance_office'] = "";
    }
    this.setState(state_data);
  }

  setOtherRadioState = (index, e) => {
    this.change_flag = 1;
    var visit_another_hospital = this.state.visit_another_hospital;
    visit_another_hospital[index].prescription = parseInt(e.target.value);
    this.setState({visit_another_hospital});
  }

  setTextValue = (key,e) => {
    this.change_flag = 1;
    this.setState({[key]: e.target.value});
  }
  
  setIntNumberValue = (key,e) => {
    let value = "";
    if(e.target.value == ""){
      value = e.target.value;
      this.change_flag = 1;
    } else if(parseInt(e.target.value) >= 0){
      value = parseInt(e.target.value);
      this.change_flag = 1;
    } else {
      value = this.state[key];
    }
    this.setState({[key]: value});
  }

  setNumericValue = (key,e) => {
    if(e.target.value == "" || parseInt(e.target.value) >= 0){
      this.change_flag = 1;
      this.setState({[key]: e.target.value});
    } else {
      this.setState({[key]: this.state[key]});
    }
  }

  setCheckState = (name, value) => {
    this.change_flag = 1;
    this.setState({[name]: value});
  }

  closeModal = () => {
    this.setState({
      isOpenStaffList: false,
      isHistoryModal: false,
      isShowDetailModal:false,
    });
  }

  confirmPrint=()=>{
    let error = this.checkValidation();
    if (error.length > 0) {
      this.setState({ check_message: error.join("\n") });
      return;
    }
    this.setState({
      confirm_message:"印刷しますか？",
      confirm_type:"print"
    });
  }
  
  get_title_pdf =async() => {
    let server_time = await getServerTime(); // y/m/d H:i:s
    let pdf_file_name = "訪問診療看護サマリー_" +this.state.patient_number + "_" + formatDateString(new Date(server_time)) + ".pdf";
    return pdf_file_name;
  }

  printPdf=async()=>{
    this.setState({
      confirm_type:"",
      confirm_message:"",
      complete_message:"印刷中"
    });
    let pdf_file_name = await this.get_title_pdf();
    let path = "/app/api/v2/nursing_service/print/visit_summary";
    let print_data = {};
    print_data.patient_info = this.state.patientInfo;
    print_data.summary_info = this.state;
    axios({
      url: path,
      method: 'POST',
      data:{print_data},
      responseType: 'blob', // important
    }).then((response) => {
      this.setState({complete_message:""});
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      if(window.navigator.msSaveOrOpenBlob) {
        //IE11 & Edge
        window.navigator.msSaveOrOpenBlob(blob, pdf_file_name);
      }
      else{
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', pdf_file_name); //or any other extension
        document.body.appendChild(link);
        link.click();
      }
    })
      .catch(() => {
        this.setState({
          complete_message:"",
          alert_messages:"印刷失敗",
        });
      })
  }

  confirmCancel=()=>{
    if(this.state.alert_type == "modal_close"){
      this.props.closeModal();
    }
    this.setState({
      alert_messages: "",
      confirm_message: "",
      confirm_type: "",
      isCloseConfirmModal:false,      
      confirm_alert_title:'',      
    });
  }
  
  confirmOk=()=>{
    if(this.state.confirm_type == "print"){
      this.printPdf();
    }
    if(this.state.confirm_type == "temporary_register"){
      this.register(0);
    }
    if(this.state.confirm_type == "register"){
      this.register(1);
    }
  }
  
  registerConfirm=(value)=>{
    if(value == 0){
      if(!((this.props.modal_data.summary_data != null && this.props.modal_data.summary_data.number == 0) || (this.change_flag == 1))){
        return;
      }
    } else {
      if(!((this.props.modal_data.summary_data != null && this.props.modal_data.summary_data.number == 0) || (this.change_flag == 1) || (this.state.number != 0 && this.state.create_flag == 0))){
        return;
      }
    }
    let error = this.checkValidation();
    if (error.length > 0) {
      this.setState({ check_message: error.join("\n") });
      return;
    }
    this.setState({
      confirm_type:value == 0 ? "temporary_register" : "register",
      confirm_message:"保存しますか？",
      confirm_alert_title:'保存確認'
    });
  }
  
  register=async(create_flag)=>{
    this.setState({
      confirm_type:"",
      confirm_message:"",
      confirm_alert_title:''
    });
    let path = "/app/api/v2/nursing_service/register/visit_nurse_summary";
    let post_data = {
      number:this.state.number > 0 ? this.state.number : 0,      
      patient_id:this.state.patientId,
      create_flag,
      create_comment:this.state.create_comment,
      disease_name:this.state.disease_name,
      medical_history:this.state.medical_history,
      pressure_ulcer_judgment:this.state.pressure_ulcer_judgment,
      pressure_ulcer_site:this.state.pressure_ulcer_judgment == 1 ? this.state.pressure_ulcer_site : null,
      meal_judgment:this.state.meal_judgment,      
      denture_judgment:this.state.denture_judgment,
      denture_part:this.state.denture_judgment == 1 ? this.state.denture_part : null,      
      infectious_disease_judgment:this.state.infectious_disease_judgment,
      hbs:this.state.infectious_disease_judgment == 1 ? this.state.hbs : 0,
      hcv:this.state.infectious_disease_judgment == 1 ? this.state.hcv : 0,
      syphilis:this.state.infectious_disease_judgment == 1 ? this.state.syphilis : 0,
      hiv:this.state.infectious_disease_judgment == 1 ? this.state.hiv : 0,
      height:this.state.height != "" ? this.state.height : null,
      weight:this.state.weight != "" ? this.state.weight : null,
      long_term_care_insurance_judgment_1:this.state.long_term_care_insurance_judgment_1,
      long_term_care_insurance_judgment_2:this.state.long_term_care_insurance_judgment_2,
      long_term_care_insurance_office:this.state.long_term_care_insurance_office != "" ? this.state.long_term_care_insurance_office : null,
      key_person:this.state.key_person != "" ? this.state.key_person : null,      
      emergency_contact_name:this.state.emergency_contact_name != "" ? this.state.emergency_contact_name : null,
      emergency_contact_relations:this.state.emergency_contact_relations != "" ? this.state.emergency_contact_relations : null,
      emergency_contact_phone_number:this.state.emergency_contact_phone_number != "" ? this.state.emergency_contact_phone_number : null,
      emergency_contact_name_2:this.state.emergency_contact_name_2 != "" ? this.state.emergency_contact_name_2 : null,
      emergency_contact_relations_2:this.state.emergency_contact_relations_2 != "" ? this.state.emergency_contact_relations_2 : null,
      emergency_contact_phone_number_2:this.state.emergency_contact_phone_number_2 != "" ? this.state.emergency_contact_phone_number_2 : null,
      visually_impaired:this.state.visually_impaired,
      hearing_impairment:this.state.hearing_impairment,
      language_disorder:this.state.language_disorder,
      movement_disorders:this.state.movement_disorders,
      writer:this.state.writer,
      
      move_in_date:formatDateLine(this.state.move_in_date) != ''?formatDateLine(this.state.move_in_date):null,
      first_visit_date:formatDateLine(this.state.first_visit_date) != '' ? formatDateLine(this.state.first_visit_date) : null,
      remarks:this.state.remarks,
      when_necessary_fever:this.state.when_necessary_fever,
      when_necessary_insomnia:this.state.when_necessary_insomnia,
      when_necessary_constipation:this.state.when_necessary_constipation,
      record:this.state.record,
      meal_comment:this.state.meal_comment,
      excretion_comment:this.state.excretion_comment,
      excretion_type:this.state.excretion_type,
      height_measuring_date:formatDateLine(this.state.height_measuring_date) != ''? formatDateLine(this.state.height_measuring_date):null,
      weight_measuring_date:formatDateLine(this.state.weight_measuring_date) != ''? formatDateLine(this.state.weight_measuring_date):null,      
      independence_level:this.state.independence_level,
      dementia_level:this.state.dementia_level,
      long_term_care_insurance_comment:this.state.long_term_care_insurance_comment,
      care_manager:this.state.care_manager,
      key_person_relations:this.state.key_person_relations,
      family_structure:this.state.family_structure,      
      life_history:this.state.life_history,
      paralyzed:this.state.paralyzed,
      paralyzed_site:this.state.paralyzed_site,
      visit_another_hospital:this.state.visit_another_hospital,
      created_at:formatDateLine(this.state.created_at),
      revision_date:formatDateLine(this.state.revision_date),
    };
    await apiClient.post(path, {params: post_data})
      .then(res => {
        if(res.alert_message != undefined){          
          this.setState({alert_messages:res.alert_message});
          this.change_flag = 0;
          this.props.handleOk();          
          this.props.closeModal('register');
        } else {
          this.setState({
            alert_messages:res.error_message,
          });
        }
      })
      .catch(()=> {
      })
  }
  
  setDateValue = (key,value) => {
    this.change_flag = 1;
    if((key == "created_at" || key == "revision_date") && (value == null || value == "")){
      value = new Date();
    }
    this.setState({[key]:value});
  };
  
  setSelectValue = (key, e) => {
    this.change_flag = 1;
    this.setState({[key]:parseInt(e.target.id)});
  };
  
  openStaffList = () => {
    this.setState({isOpenStaffList: true});
  };
  
  selectStaff=(staff)=>{
    this.change_flag = 1;
    this.setState({
      writer:staff.number,
      writer_name:staff.name,
      isOpenStaffList:false,
    });
  }
  
  componentDidUpdate() {
    harukaValidate('nursing', 'summary', 'visit_nurse_summary', this.state, 'background');
  }
  
  checkValidation = () => {
    let error_str_arr = [];
    let validate_data = harukaValidate('nursing', 'summary', 'visit_nurse_summary', this.state);
    if (validate_data.error_str_arr.length > 0) {
      error_str_arr = validate_data.error_str_arr;
    }
    if (validate_data.first_tag_id != "") {
      this.setState({ first_tag_id: validate_data.first_tag_id });
    }
    return error_str_arr;
  };
  
  closeValidateAlertModal = () => {
    this.setState({check_message: ""});
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null) {
      $("#" + first_tag_id).focus();
    }
  };

  closeThisModal = () => {
    if (this.change_flag){
      this.setState({
        isCloseConfirmModal:true,
        confirm_message:'登録していない内容があります。\n変更内容を破棄して移動しますか？',
        confirm_alert_title:'入力中'
      })
    } else {
      this.props.closeModal();
    }
  }
  
  setMedicalHistory = (param,e) => {
    let key = param.split(':')[0];
    let index = param.split(':')[1];
    let medical_history = this.state.medical_history;
    if(key == "age" || key == 'year' || key == 'month' || key == 'day'){
      var input_value = e.target.value;
      input_value = input_value.replace(/[^0-9０-９]/g, '');
      if (input_value == ''){
        medical_history[index][key] = input_value;
        this.change_flag = 1;
      } else {
        if (key == 'year'){
          if (input_value.length > 5) return;
          medical_history[index][key] = input_value;
          this.change_flag = 1;
          if (input_value.length == 4 && e.keyCode == undefined){
            $('#birth-month_' + index).focus();
          }
        }
        if (key == 'month'){
          if (input_value.length == 1 && parseInt(input_value) > 1) return;
          if(input_value.length > 2) return;
          if(input_value > 12) return;          
          medical_history[index][key] = input_value;
          this.change_flag = 1;
          if (input_value.length == 2 && e.keyCode == undefined){
            $('#birth-day_' + index).focus();
          }
          
        }
        if (key == 'day'){
          if (input_value > 31) return;          
          medical_history[index][key] = input_value;
          this.change_flag = 1;
          if (input_value.length == 2 && e.keyCode == undefined){
            $('#age-input_' + index).focus();
          }
          
        }
        if (key == 'age'){
          if (input_value>=0 && input_value <= 1000){
            medical_history[index][key] = input_value;
            this.change_flag = 1;
          } else {
            return;
          }
        }
      }
    } else {
      this.change_flag = 1;
      medical_history[index][key] = e.target.value;
    }
    this.setState({medical_history});
  }

  calcAgeHistory = (index) => {
    
    let medical_history = this.state.medical_history;
    if (!(medical_history[index]['year'] > 0)) return;
    if (this.birth_year == '') return;
    if (medical_history[index]['year'] < parseInt(this.birth_year) || medical_history[index]['year'] > this.year){
      medical_history[index]['year'] = '';
      this.setState({        
        alert_messages:'年は生年以上・今年以下で入力してください。',
        medical_history,
      });
      $('#birth-year_' + index).focus();
      return;
    }
    medical_history[index]['age'] = medical_history[index]['year'] - this.birth_year;
    this.setState({medical_history});
  }

  calcYearHistory = (index) => {
    let medical_history = this.state.medical_history;
    if (!(medical_history[index]['age'] > 0)) return;
    if (this.birth_year == '') return;
    medical_history[index]['year'] = parseInt(this.birth_year) + parseInt(medical_history[index]['age']);
    this.setState({medical_history});
  }

  setOtherDataText = (param, index, e) => {    
    var visit_another_hospital = this.state.visit_another_hospital;
    visit_another_hospital[index][param] = e.target.value;
    this.setState({visit_another_hospital});
    this.change_flag = 1;
  }
  
  changeMedicalHistory=(index, type)=>{
    let cur_medical_history = this.state.medical_history;
    let medical_history = [];
    cur_medical_history.map((history, h_idx)=>{
      if(h_idx == index){
        if(type == "add"){
          medical_history.push(history);
          medical_history.push({age:"", disease_name:"", hospital:"", year:'', month:'', day:''});
        }
      } else {
        medical_history.push(history);
      }
    });
    if(medical_history.length == 0){
      medical_history.push({age:"", disease_name:"", hospital:"", year:'', month:'', day:''});
    }
    this.setState({medical_history});
  }

  setCheckCareNecessary = (index, name, value) => {
    if (name == 'long_term_care_insurance_judgment_2'){
      this.change_flag = 1;
      var care_necessary = this.state.care_necessary;
      care_necessary[index] = value;
      var long_term_care_insurance_judgment_2 = 0;
      care_necessary.map(val => {
        long_term_care_insurance_judgment_2 += Math.pow(2, val);
      })
      this.setState({care_necessary, long_term_care_insurance_judgment_2});
    }
  }

  setCheckExcretionType = (index, name, value) => {
    if (name == 'excretion_type'){
      this.change_flag = 1;
      var excretion_type_array = this.state.excretion_type_array;
      excretion_type_array[index] = value;
      var excretion_type = 0;
      excretion_type_array.map(val => {
        excretion_type += Math.pow(2, val);
      })
      this.setState({excretion_type_array, excretion_type});
    }
  }

  openHistoryModal = () => {
    if(this.state.history == null){return;}
    this.setState({isHistoryModal:true});
  }

  showHistoryDetail = (data) => {
    this.closeModal();
    this.setState({
      isShowDetailModal:true,
      detail_data:data,
    })
  }
  
  setPhoneNumber = (name, e) => {
    let regx = /^[-ー]*[0-9０-９][-ー0-9０-９]*$/;
    if (e.target.value != "" && !regx.test(e.target.value)) return;
    this.change_flag = 1;
    this.setState({[name]:e.target.value});
  }

  render() {    
    return (
      <Modal show={true} id="add_contact_dlg"  className="custom-modal-sm patient-exam-modal bed-control-modal nurse-summary first-view-modal">
        <Modal.Header>
          <Header>
            <Modal.Title>訪問診療  看護サマリー</Modal.Title>
            <Button className={this.state.history == null ? 'disable-btn' : 'red-btn'} onClick={this.openHistoryModal.bind(this)}>歴一覧</Button>
          </Header>
        </Modal.Header>
        <Modal.Body>
          <PatientsWrapper>
            {this.state.is_loaded ? (
              <>
                <div className={'summary-area border-1px'}>
                  <div className={'flex justify-content'} style={{width:"100%", paddingLeft:"0.2rem", paddingRight:"0.2rem"}}>
                    <div className={'div-title w-50-p'}>
                      <span>{this.state.patient_number} : {this.state.patient_name}（{this.props.modal_data.birthDate}生）</span>
                    </div>
                    <div className={'div-title w-50-p'} style={{marginRight:0, overflowY:"auto", textAlign:"right"}}>
                      <span>病院名 : {this.state.hospital_name} 施設名 : {this.props.modal_data.place_name}</span>
                    </div>
                  </div>
                  <div className={'scroll-area'}>
                    <div className={'flex border-1px'}>
                      <div className={'w-50-p border-right-1px'}>
                        <div className={'flex border-bottom-1px'}>
                          <div className={'summary-label text-center l-h-2'}>記載日</div>
                          <div className={'select-date border-right-1px'} style={{lineHeight:"2rem", paddingLeft:"0.2rem", width:"6rem"}}>
                            {formatDateSlash(this.state.created_at)}
                          </div>
                          <div className={'summary-label text-center l-h-2'}>入居日</div>
                          <div className={'select-date'}>
                            <InputWithLabelBorder
                              label=""
                              type="date"
                              getInputText={this.setDateValue.bind(this,"move_in_date")}
                              diseaseEditData={this.state.move_in_date}
                            />
                          </div>
                          <div className={'summary-label text-center l-h-2'}>初診日</div>
                          <div className={'select-date'}>
                            <InputWithLabelBorder
                              label=""
                              type="date"
                              getInputText={this.setDateValue.bind(this,"first_visit_date")}
                              diseaseEditData={this.state.first_visit_date}
                            />
                          </div>
                        </div>
                        <div className={'flex'} style={{height:"calc(4rem + 3px)"}}>
                          <div className={'vertical-align summary-label'}><div>病名</div></div>
                          <div className={'summary-value p-03'} style={{overflowY:"auto"}}>{this.state.disease_name}</div>
                        </div>
                      </div>
                      <div className={'w-50-p'}>
                        <div className={'flex border-bottom-1px'}>
                          <div className={'summary-label vertical-align'}><div>禁忌</div></div>
                          <div className={'summary-value'}>
                            <div className='div-input no-label-input'>
                              <InputWithLabelBorder
                                label=""
                                type="text"
                                getInputText={this.setTextValue.bind(this, "contraindicated_drug")}
                                diseaseEditData = {this.state.contraindicated_drug}
                                id={'contraindicated_drug_id'}
                              />
                            </div>
                          </div>
                        </div>
                        <div className={'flex border-bottom-1px'}>
                          <div className={'summary-label vertical-align'}><div>身長</div></div>
                          <div className={'summary-value'}>
                            <div className={'flex border-bottom-1px'}>
                              <div className={'div-input unit-input flex hankaku-eng-num-input'}>
                                <InputWithLabelBorder
                                  label=""
                                  type="text"
                                  id={'height_id'}
                                  getInputText={this.setNumericValue.bind(this, "height")}
                                  diseaseEditData = {this.state.height}
                                />
                                <div className={'div-title'} style={{marginLeft:"0.5rem"}}>cm</div>
                              </div>
                              <div className='div-input'>
                                <InputWithLabelBorder
                                  label="身長計測日"
                                  type="date"
                                  getInputText={this.setDateValue.bind(this,"height_measuring_date")}
                                  diseaseEditData={this.state.height_measuring_date}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={'flex'}>
                          <div className={'summary-label vertical-align'}><div>体重</div></div>
                          <div className={'summary-value'}>
                            <div className={'flex border-bottom-1px'}>
                              <div className={'div-input unit-input flex hankaku-eng-num-input'}>
                                <InputWithLabelBorder
                                  label=""
                                  type="text"
                                  id={'weight_id'}
                                  getInputText={this.setNumericValue.bind(this, "weight")}
                                  diseaseEditData = {this.state.weight}
                                />
                                <div className={'div-title'} style={{marginLeft:"0.5rem"}}>kg</div>
                              </div>
                              <div className='div-input'>
                                <InputWithLabelBorder
                                  label="体重計測日"
                                  type="date"
                                  getInputText={this.setDateValue.bind(this,"weight_measuring_date")}
                                  diseaseEditData={this.state.weight_measuring_date}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={'flex border-1px mt-m-1px'}>
                      <div className={'w-50-p border-right-1px'}>
                        <div className={'l-h-2'} style={{paddingLeft:"0.3rem"}}>病歴</div>
                        <div className={'medical-history'}>
                          <table className="table-scroll table table-bordered" id="code-table">
                            <thead>
                            <tr>
                              <th className='birth-td'>年月日</th>
                              <th className='age-td'>年齢</th>                              
                              <th className={'disease-td'}>病名</th>
                              <th className='hospital-td'>病院</th>
                              <th className='icon-td'/>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.medical_history.map((history, index)=>{                              
                              return (
                                <>
                                  <tr>
                                    <td className='birth-td'>
                                      <div className='flex' style={{width:'100%', justifyContent:'space-between'}}>
                                        <div className={'input-year hankaku-eng-num-input'}>
                                          <InputWithLabelBorder
                                            label=""
                                            type="text"
                                            getInputText={this.setMedicalHistory.bind(this, 'year:'+index)}
                                            onBlur = {this.calcAgeHistory.bind(this, index)}
                                            className={"hankaku-eng-num-input"}
                                            diseaseEditData = {history.year}
                                            id ={'birth-year_' + index}
                                          />
                                        </div>
                                        <div className={'input-month hankaku-eng-num-input'}>
                                          <InputWithLabelBorder
                                            label=""
                                            type="text"
                                            getInputText={this.setMedicalHistory.bind(this, 'month:' + index)}
                                            className="hankaku-eng-num-input"
                                            diseaseEditData = {history.month}
                                            id ={'birth-month_'+ index}
                                          />
                                        </div>
                                        <div className={'input-date hankaku-eng-num-input'}>
                                          <InputWithLabelBorder
                                            label=""
                                            type="text"
                                            getInputText={this.setMedicalHistory.bind(this, 'day:' + index)}
                                            className="hankaku-eng-num-input"
                                            diseaseEditData = {history.day}
                                            id ={'birth-day_' + index}
                                          />
                                        </div>
                                      </div> 
                                    </td>
                                    <td className='age-td hankaku-eng-num-input td-input'>
                                      <InputWithLabelBorder
                                        label=""
                                        type="text"
                                        id ={'age-input_' + index}
                                        getInputText={this.setMedicalHistory.bind(this, "age:"+index)}
                                        onBlur = {this.calcYearHistory.bind(this, index)}
                                        diseaseEditData = {history.age}
                                      />
                                    </td>                                    
                                    <td className={'disease-td td-input ime-active'}>
                                      <InputWithLabelBorder
                                        label=""
                                        type="text"
                                        getInputText={this.setMedicalHistory.bind(this, "disease_name:"+index)}
                                        diseaseEditData = {history.disease_name}
                                      />
                                    </td>
                                    <td className='hospital-td td-input ime-active'>
                                      <InputWithLabelBorder
                                        label=""
                                        type="text"
                                        getInputText={this.setMedicalHistory.bind(this, "hospital:"+index)}
                                        diseaseEditData = {history.hospital}
                                      />
                                    </td>
                                    <td className='icon-td'>
                                      <div className='flex' style={{width:'100%'}}>
                                        <div style={{width:'50%'}}><Icon onClick={this.changeMedicalHistory.bind(this, index, "add")} icon={faPlus} /></div>
                                        <div style={{width:'50%'}}><Icon onClick={this.changeMedicalHistory.bind(this, index, "delete")} icon={faMinusCircle} /></div>
                                      </div>
                                    </td>
                                  </tr>
                                </>
                              )}
                            )}
                            </tbody>
                          </table>
                        </div>
                        <div className={'flex border-top-1px border-bottom-1px'}>
                          <div className={'summary-label text-center'} style={{lineHeight:"6.5rem"}}>他科受診</div>
                          <div className={'summary-value medical-history'}>
                            <table className="table-scroll table table-bordered">
                              <thead>
                              <tr>
                                <th className='hospital-td'>病院</th>
                                <th className='department-td'>診療科</th>
                                <th className='prescription-td'>処方</th>
                              </tr>
                              </thead>
                              <tbody style={{height:'4.3rem'}}>
                              <tr>
                                <td className='hospital-td hankaku-eng-num-input td-input'>
                                  <InputWithLabelBorder
                                    label=""
                                    type="text"
                                    getInputText={this.setOtherDataText.bind(this, "hospital", 0)}
                                    diseaseEditData = {this.state.visit_another_hospital[0].hospital}
                                  />
                                </td>
                                <td className={'department-td td-input ime-active'}>
                                  <InputWithLabelBorder
                                    label=""
                                    type="text"
                                    getInputText={this.setOtherDataText.bind(this, "department", 0)}
                                    diseaseEditData = {this.state.visit_another_hospital[0].department}
                                  />
                                </td>
                                <td className='prescription-td' style={{paddingTop:0,paddingBottom:0}}>
                                  <Radiobox
                                    label={'無'}
                                    value={0}
                                    getUsage={this.setOtherRadioState.bind(this, 0)}
                                    checked={this.state.visit_another_hospital[0].prescription === 0}
                                    name={`prescription_0`}
                                  />
                                  <Radiobox
                                    label={'有'}
                                    value={1}
                                    getUsage={this.setOtherRadioState.bind(this, 0)}
                                    checked={this.state.visit_another_hospital[0].prescription === 1}
                                    name={`prescription_0`}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td className='hospital-td hankaku-eng-num-input td-input'>
                                  <InputWithLabelBorder
                                    label=""
                                    type="text"
                                    getInputText={this.setOtherDataText.bind(this, "hospital", 1)}
                                    diseaseEditData = {this.state.visit_another_hospital[1].hospital}
                                  />
                                </td>
                                <td className={'department-td td-input ime-active'}>
                                  <InputWithLabelBorder
                                    label=""
                                    type="text"
                                    getInputText={this.setOtherDataText.bind(this, "department", 1)}
                                    diseaseEditData = {this.state.visit_another_hospital[1].department}
                                  />
                                </td>
                                <td className='prescription-td' style={{paddingTop:0,paddingBottom:0}}>
                                  <Radiobox
                                    label={'無'}
                                    value={0}
                                    getUsage={this.setOtherRadioState.bind(this, 1)}
                                    checked={this.state.visit_another_hospital[1].prescription === 0}
                                    name={`prescription_1`}
                                  />
                                  <Radiobox
                                    label={'有'}
                                    value={1}
                                    getUsage={this.setOtherRadioState.bind(this, 1)}
                                    checked={this.state.visit_another_hospital[1].prescription === 1}
                                    name={`prescription_1`}
                                  />
                                </td>
                              </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className={'flex border-top-1px border-bottom-1px'}>
                          <div className={'summary-label text-center'} style={{lineHeight:"calc(6rem - 0.25rem)"}}>備考</div>
                          <div className={'summary-value'} style={{height:"calc(6rem - 0.25rem)", overflowY:"auto"}}>
                          <textarea
                            value={this.state.remarks}
                            style={{width:"100%", height:"100%"}}
                            id={'remarks_id'}
                            onChange={this.setTextValue.bind(this, 'remarks')}
                          />
                          </div>
                        </div>
                        <div className={'flex border-top-1px border-bottom-1px'}>
                          <div className={'summary-label text-center'} style={{lineHeight:"6rem"}}>屯用指示</div>
                          <div className={'summary-value'}>
                            <div className={'div-input'}>
                              <InputWithLabelBorder
                                label="熱発時"
                                type="text"
                                id={'when_necessary_fever_id'}
                                getInputText={this.setTextValue.bind(this, "when_necessary_fever")}
                                diseaseEditData = {this.state.when_necessary_fever}
                              />
                            </div>
                            <div className={'div-input'}>
                              <InputWithLabelBorder
                                label="不眠時"
                                type="text"
                                id={'when_necessary_insomnia_id'}
                                getInputText={this.setTextValue.bind(this, "when_necessary_insomnia")}
                                diseaseEditData = {this.state.when_necessary_insomnia}
                              />
                            </div>
                            <div className={'div-input'}>
                              <InputWithLabelBorder
                                label="便秘時"
                                type="text"
                                id={'when_necessary_constipation_id'}
                                getInputText={this.setTextValue.bind(this, "when_necessary_constipation")}
                                diseaseEditData = {this.state.when_necessary_constipation}
                              />
                            </div>
                          </div>
                        </div>
                        <div className={'flex border-top-1px border-bottom-1px'}>
                          <div className={'summary-label text-center'} style={{lineHeight:"6rem"}}>記録</div>
                          <div className={'summary-value'} style={{height:"6rem", overflowY:"auto"}}>
                          <textarea
                            value={this.state.record}
                            style={{width:"100%", height:"100%"}}
                            id={'record_id'}
                            onChange={this.setTextValue.bind(this, 'record')}
                          />
                          </div>
                        </div>
                        <div className={'flex border-bottom-1px'}>
                          <div className={'summary-label vertical-align'}><div>食事</div></div>
                          <div className={'summary-value'}>
                            <div style={{width:"100%"}} className='simple-input-div'>
                              <input id={'meal_comment_id'} getInputText={this.setTextValue.bind(this, "meal_comment")} diseaseEditData = {this.state.meal_comment}></input>
                            </div>
                            <div className='select-radio'>
                              <Radiobox
                                label={'自立'}
                                value={1}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.meal_judgment === 1}
                                name={`meal_judgment`}
                              />
                              <Radiobox
                                label={'見守り'}
                                value={2}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.meal_judgment === 2}
                                name={`meal_judgment`}
                              />
                              <Radiobox
                                label={'部分介助'}
                                value={3}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.meal_judgment === 3}
                                name={`meal_judgment`}
                              />
                              <Radiobox
                                label={'全介助'}
                                value={4}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.meal_judgment === 4}
                                name={`meal_judgment`}
                              />
                            </div>
                          </div>
                        </div>
                        <div className={'flex border-bottom-1px'}>
                          <div className={'summary-label text-center l-h-2'}>義歯</div>
                          <div className={'summary-value select-radio'}>
                            <Radiobox
                              label={'無'}
                              value={0}
                              getUsage={this.setRadioState.bind(this)}
                              checked={this.state.denture_judgment === 0}
                              name={`denture_judgment`}
                            />
                            <Radiobox
                              label={'有'}
                              value={1}
                              getUsage={this.setRadioState.bind(this)}
                              checked={this.state.denture_judgment === 1}
                              name={`denture_judgment`}
                            />
                            <div className={'l-h-2'} style={{marginRight:"0.5rem"}}>（ </div>
                            <Radiobox
                              label={'全部'}
                              value={1}
                              getUsage={this.setRadioState.bind(this)}
                              checked={this.state.denture_part === 1}
                              name={`denture_part`}
                              isDisabled={this.state.denture_judgment === 0}
                            />
                            <Radiobox
                              label={'部分'}
                              value={2}
                              getUsage={this.setRadioState.bind(this)}
                              checked={this.state.denture_part === 2}
                              name={`denture_part`}
                              isDisabled={this.state.denture_judgment === 0}
                            />
                            <div className={'l-h-2'}> ）</div>
                          </div>
                        </div>
                        <div className={'flex'}>
                          <div className={'summary-label text-center l-h-2'}>褥瘡</div>
                          <div className={'summary-value flex'}>
                            <div className={'select-radio'}>
                              <Radiobox
                                label={'無'}
                                value={0}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.pressure_ulcer_judgment === 0}
                                name={`pressure_ulcer_judgment`}
                              />
                              <Radiobox
                                label={'有'}
                                value={1}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.pressure_ulcer_judgment === 1}
                                name={`pressure_ulcer_judgment`}
                              />
                            </div>
                            <div className={'pressure-ulcer-site div-input'}>
                              <InputWithLabelBorder
                                label="部位："
                                type="text"
                                id={'pressure_ulcer_site_id'}
                                getInputText={this.setTextValue.bind(this, "pressure_ulcer_site")}
                                diseaseEditData = {this.state.pressure_ulcer_site}
                                isDisabled={this.state.pressure_ulcer_judgment === 0}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={'w-50-p'}>
                        <div className={'flex border-bottom-1px'}>
                          <div className={'summary-label vertical-align'}><div>感染症</div></div>
                          <div className={'summary-label vertical-align'} style={{width:"7rem"}}>
                            <div className={'select-radio'}>
                              <Radiobox
                                label={'無'}
                                value={0}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.infectious_disease_judgment === 0}
                                name={`infectious_disease_judgment`}
                              />
                              <Radiobox
                                label={'有'}
                                value={1}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.infectious_disease_judgment === 1}
                                name={`infectious_disease_judgment`}
                              />
                            </div>
                          </div>
                          <div>
                            <div className={'select-check'}>
                              <Checkbox
                                label="HBs抗原"
                                getRadio={this.setCheckState.bind(this)}
                                value={this.state.hbs}
                                name="hbs"
                                isDisabled={this.state.infectious_disease_judgment === 0}
                              />
                              <Checkbox
                                label="HCV抗体"
                                getRadio={this.setCheckState.bind(this)}
                                value={this.state.hcv}
                                name="hcv"
                                isDisabled={this.state.infectious_disease_judgment === 0}
                              />
                              <Checkbox
                                label="梅毒"
                                getRadio={this.setCheckState.bind(this)}
                                value={this.state.syphilis}
                                name="syphilis"
                                isDisabled={this.state.infectious_disease_judgment === 0}
                              />
                              <Checkbox
                                label="HIV"
                                getRadio={this.setCheckState.bind(this)}
                                value={this.state.hiv}
                                name="hiv"
                                isDisabled={this.state.infectious_disease_judgment === 0}
                              />
                            </div>
                          </div>
                        </div>
                        <div className={'flex border-bottom-1px'}>
                          <div className={'summary-label vertical-align'}><div>自立度</div></div>
                          <div className={'summary-value'}>
                            <div className={'div-input no-label-input'}>
                              <InputWithLabelBorder
                                label=""
                                type="text"
                                id={'independence_level_id'}
                                getInputText={this.setTextValue.bind(this, "independence_level")}
                                diseaseEditData = {this.state.independence_level}
                              />
                            </div>
                          </div>
                        </div>
                        <div className={'flex border-bottom-1px'}>
                          <div className={'summary-label vertical-align'}><div>認知度</div></div>
                          <div className={'summary-value'}>
                            <div className={'div-input no-label-input'}>
                              <InputWithLabelBorder
                                label=""
                                type="text"
                                id={'dementia_level_id'}
                                getInputText={this.setTextValue.bind(this, "dementia_level")}
                                diseaseEditData = {this.state.dementia_level}
                              />
                            </div>
                          </div>
                        </div>
                        <div className={'flex border-bottom-1px'}>
                          <div className={'summary-label vertical-align'}><div>介護保険</div></div>
                          <div className={'summary-value'}>
                            <div className={'select-radio'}>
                              <Radiobox
                                label={'無'}
                                value={0}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.long_term_care_insurance_judgment_1 === 0}
                                name={`long_term_care_insurance_judgment_1`}
                              />
                              <Radiobox
                                label={'有'}
                                value={1}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.long_term_care_insurance_judgment_1 === 1}
                                name={`long_term_care_insurance_judgment_1`}
                              />
                              {/* <Radiobox
                              label={'申請中'}
                              value={2}
                              getUsage={this.setRadioState.bind(this)}
                              checked={this.state.long_term_care_insurance_judgment_1 === 2}
                              name={`long_term_care_insurance_judgment_1`}
                            /> */}
                            </div>
                            <div className={'select-radio'}>
                              <Checkbox
                                label="要支援"
                                getRadio={this.setCheckCareNecessary.bind(this, 0)}
                                value={this.state.care_necessary[0]}
                                name="long_term_care_insurance_judgment_2"
                              />
                              <Checkbox
                                label="要介護"
                                getRadio={this.setCheckCareNecessary.bind(this, 1)}
                                value={this.state.care_necessary[1]}
                                name="long_term_care_insurance_judgment_2"
                              />
                              <div className={'div-input insurance-required'}>
                                <InputWithLabelBorder
                                  label=""
                                  type="text"
                                  id={'long_term_care_insurance_comment_id'}
                                  getInputText={this.setTextValue.bind(this, "long_term_care_insurance_comment")}
                                  diseaseEditData = {this.state.long_term_care_insurance_comment}
                                  // isDisabled={this.state.long_term_care_insurance_judgment == 0}
                                />
                              </div>
                            </div>
                            <div className={'div-input insurance-office'}>
                              <InputWithLabelBorder
                                label="事業所"
                                type="text"
                                id={'long_term_care_insurance_office_id'}
                                getInputText={this.setTextValue.bind(this, "long_term_care_insurance_office")}
                                diseaseEditData = {this.state.long_term_care_insurance_office}
                              />
                            </div>
                            <div className={'div-input insurance-office'}>
                              <InputWithLabelBorder
                                label="ケアマネ"
                                type="text"
                                id={'care_manager_id'}
                                getInputText={this.setTextValue.bind(this, "care_manager")}
                                diseaseEditData = {this.state.care_manager}
                              />
                            </div>
                          </div>
                        </div>
                        <div className={'flex border-bottom-1px'}>
                          <div className={'summary-label vertical-align'}><div>家族構成</div></div>
                          <div className={'summary-value'}>
                            <div className={'div-input key-person flex'}>
                              <InputWithLabelBorder
                                label="[キーパーソン]"
                                type="text"
                                id={'key_person_id'}
                                getInputText={this.setTextValue.bind(this, "key_person")}
                                diseaseEditData = {this.state.key_person}
                              />
                              <InputWithLabelBorder
                                label="（続柄）"
                                type="text"
                                id={'key_person_relations_id'}
                                getInputText={this.setTextValue.bind(this, "key_person_relations")}
                                diseaseEditData = {this.state.key_person_relations}
                              />
                            </div>
                            <div style={{height:'4rem', overflowY:'auto'}}>
                            <textarea
                              value={this.state.family_structure}
                              style={{width:"100%", height:"100%"}}
                              id={'family_structure_id'}
                              onChange={this.setTextValue.bind(this, 'family_structure')}
                            />
                            </div>
                          </div>
                        </div>
                        <div className={'flex border-bottom-1px'}>
                          <div className={'summary-label vertical-align'}><div>緊急連絡先</div></div>
                          <div className={'summary-value emergency-contact'}>
                            <div className={'border-bottom-1px flex'}>
                              <div style={{width:"12rem"}} className={'ime-active'}>
                                <InputWithLabelBorder
                                  label=""
                                  type="text"
                                  getInputText={this.setTextValue.bind(this, "emergency_contact_name")}
                                  diseaseEditData = {this.state.emergency_contact_name}
                                  placeholder={'氏名'}
                                />
                              </div>
                              <div className={'l-h-2'}>（</div>
                              <div style={{width:"5rem"}} className={'ime-active'}>
                                <InputWithLabelBorder
                                  label=""
                                  type="text"
                                  getInputText={this.setTextValue.bind(this, "emergency_contact_relations")}
                                  diseaseEditData = {this.state.emergency_contact_relations}
                                  placeholder={'続柄'}
                                />
                              </div>
                              <div className={'l-h-2'}>）</div>
                              <div className={'hankaku-eng-num-input'} style={{width:"9rem"}}>
                                <InputWithLabelBorder
                                  label=""
                                  type="text"
                                  getInputText={this.setPhoneNumber.bind(this, "emergency_contact_phone_number")}
                                  diseaseEditData = {this.state.emergency_contact_phone_number}
                                  placeholder={'電話番号'}
                                />
                              </div>
                            </div>
                            <div className='flex' style={{width:'100%'}}>
                              <div style={{width:"12rem"}} className={'ime-active'}>
                                <InputWithLabelBorder
                                  label=""
                                  type="text"
                                  getInputText={this.setTextValue.bind(this, "emergency_contact_name_2")}
                                  diseaseEditData = {this.state.emergency_contact_name_2}
                                  placeholder={'氏名'}
                                />
                              </div>
                              <div className={'l-h-2'}>（</div>
                              <div style={{width:"5rem"}} className={'ime-active'}>
                                <InputWithLabelBorder
                                  label=""
                                  type="text"
                                  getInputText={this.setTextValue.bind(this, "emergency_contact_relations_2")}
                                  diseaseEditData = {this.state.emergency_contact_relations_2}
                                  placeholder={'続柄'}
                                />
                              </div>
                              <div className={'l-h-2'}>）</div>
                              <div className={'hankaku-eng-num-input'} style={{width:"9rem"}}>
                                <InputWithLabelBorder
                                  label=""
                                  type="text"
                                  getInputText={this.setPhoneNumber.bind(this, "emergency_contact_phone_number_2")}
                                  diseaseEditData = {this.state.emergency_contact_phone_number_2}
                                  placeholder={'電話番号'}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={'flex border-bottom-1px'}>
                          <div className={'summary-label vertical-align'}><div>生活歴</div></div>
                          <div className={'summary-value'} style={{height:"6rem", overflowY:"auto"}}>
                          <textarea
                            value={this.state.life_history}
                            style={{width:"100%", height:"100%"}}
                            id={'life_history_id'}
                            onChange={this.setTextValue.bind(this, 'life_history')}
                          />
                          </div>
                        </div>
                        <div className={'flex border-bottom-1px'}>
                          <div className={'flex w-50-p border-right-1px'}>
                            <div className={'summary-label text-center l-h-2'}>視覚障害</div>
                            <div className={'summary-value select-radio'}>
                              <Radiobox
                                label={'無'}
                                value={0}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.visually_impaired === 0}
                                name={`visually_impaired`}
                              />
                              <Radiobox
                                label={'有'}
                                value={1}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.visually_impaired === 1}
                                name={`visually_impaired`}
                              />
                            </div>
                          </div>
                          <div className={'flex w-50-p'}>
                            <div className={'summary-label text-center l-h-2'}>聴覚障害</div>
                            <div className={'summary-value select-radio'}>
                              <Radiobox
                                label={'無'}
                                value={0}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.hearing_impairment === 0}
                                name={`hearing_impairment`}
                              />
                              <Radiobox
                                label={'有'}
                                value={1}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.hearing_impairment === 1}
                                name={`hearing_impairment`}
                              />
                            </div>
                          </div>
                        </div>
                        <div className={'flex border-bottom-1px'}>
                          <div className={'flex w-50-p border-right-1px'}>
                            <div className={'summary-label text-center l-h-2'}>言語障害</div>
                            <div className={'summary-value select-radio'}>
                              <Radiobox
                                label={'無'}
                                value={0}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.language_disorder === 0}
                                name={`language_disorder`}
                              />
                              <Radiobox
                                label={'有'}
                                value={1}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.language_disorder === 1}
                                name={`language_disorder`}
                              />
                            </div>
                          </div>
                          <div className={'flex w-50-p'}>
                            <div className={'summary-label text-center l-h-2'}>運動障害</div>
                            <div className={'summary-value select-radio'}>
                              <Radiobox
                                label={'無'}
                                value={0}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.movement_disorders === 0}
                                name={`movement_disorders`}
                              />
                              <Radiobox
                                label={'有'}
                                value={1}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.movement_disorders === 1}
                                name={`movement_disorders`}
                              />
                            </div>
                          </div>
                        </div>
                        <div className={'flex border-bottom-1px'}>
                          <div className={'summary-label text-center l-h-2'}>麻痺</div>
                          <div className={'summary-value'}>
                            <div className={'select-radio'}>
                              <Radiobox
                                label={'無'}
                                value={0}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.paralyzed === 0}
                                name={`paralyzed`}
                              />
                              <Radiobox
                                label={'有'}
                                value={1}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.paralyzed === 1}
                                name={`paralyzed`}
                              />
                              <div className={'div-title emergency-contact flex'}>
                                <div>（</div>
                                <div style={{width:"5rem"}}>
                                  <InputWithLabelBorder
                                    label=""
                                    type="text"
                                    id={'paralyzed_site_id'}
                                    getInputText={this.setTextValue.bind(this, "paralyzed_site")}
                                    diseaseEditData = {this.state.paralyzed_site}
                                    isDisabled={this.state.paralyzed === 0}
                                  />
                                </div>
                                <div>）</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={'flex border-bottom-1px'} style={{height:"6rem"}}>
                          <div className={'summary-label vertical-align'}><div>排泄</div></div>
                          <div className={'summary-value'}>
                            <div style={{width:"100%"}} className='simple-input-div'>
                              <input id={'excretion_comment_id'} getInputText={this.setTextValue.bind(this, "excretion_comment")} diseaseEditData = {this.state.excretion_comment}></input>
                            </div>
                            <div className='select-radio'>
                              <Radiobox
                                label={'自立'}
                                value={1}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.excretion_judgment === 1}
                                name={`excretion_judgment`}
                              />
                              <Radiobox
                                label={'見守り'}
                                value={2}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.excretion_judgment === 2}
                                name={`excretion_judgment`}
                              />
                              <Radiobox
                                label={'部分介助'}
                                value={3}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.excretion_judgment === 3}
                                name={`excretion_judgment`}
                              />
                              <Radiobox
                                label={'全介助'}
                                value={4}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.excretion_judgment === 4}
                                name={`excretion_judgment`}
                              />
                            </div>
                            <div className={'select-check'}>
                              <Checkbox
                                label="トイレ"
                                getRadio={this.setCheckExcretionType.bind(this, 0)}
                                value={this.state.excretion_type_array[0]}
                                name="excretion_type"
                              />
                              <Checkbox
                                label="Pトイレ"
                                getRadio={this.setCheckExcretionType.bind(this, 1)}
                                value={this.state.excretion_type_array[1]}
                                name="excretion_type"
                              />
                              <Checkbox
                                label="尿器"
                                getRadio={this.setCheckExcretionType.bind(this, 2)}
                                value={this.state.excretion_type_array[2]}
                                name="excretion_type"
                              />
                              <Checkbox
                                label="オムツ"
                                getRadio={this.setCheckExcretionType.bind(this, 3)}
                                value={this.state.excretion_type_array[3]}
                                name="excretion_type"
                              />
                            </div>
                          </div>
                        </div>
                        <div className={'flex'}>
                          <div className={'summary-label text-center l-h-2'}>記載者</div>
                          <div style={{cursor:"pointer", width:"calc(100% - 26.5rem)", paddingLeft:"0.3rem", lineHeight:"2rem"}} onClick={this.openStaffList.bind(this)}>
                            {this.state.writer_name}&nbsp;
                          </div>
                          <div className={'text-center l-h-2 border-left-1px'} style={{width:"4rem", marginLeft:"0.5rem"}}>記載日</div>
                          <div className={'select-date'}>
                            <InputWithLabelBorder
                              label=""
                              type="date"
                              getInputText={this.setDateValue.bind(this,"created_at")}
                              diseaseEditData={this.state.created_at}
                              isDisabled={!this.can_register_old}
                            />
                          </div>
                          <div className={'text-center l-h-2'} style={{width:"4rem"}}>改定日</div>
                          <div className={'select-date updated-date'}>
                            <InputWithLabelBorder
                              label=""
                              type="date"
                              getInputText={this.setDateValue.bind(this,"revision_date")}
                              diseaseEditData={this.state.revision_date}
                              isDisabled={!this.can_edit_old}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ):(
              <>
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              </>
            )}
          </PatientsWrapper>                
        </Modal.Body>
        <Modal.Footer>
          <div className={'creat-comment'}>
            <InputWithLabelBorder
              type="text"
              label="作成コメント"
              getInputText={this.setTextValue.bind(this, 'create_comment')}
              diseaseEditData={this.state.create_comment}
            />
          </div>
          <Button className="cancel-btn" onClick={this.closeThisModal}>閉じる</Button>
          <Button className={"red-btn"} onClick={this.confirmPrint}>印刷</Button>
          <Button className={((this.props.modal_data.summary_data != null && this.props.modal_data.summary_data.number == 0) || (this.change_flag == 1)) ? "red-btn" : 'disable-btn'} onClick={this.registerConfirm.bind(this, 0)}>仮保存</Button>
          <Button
            className={((this.props.modal_data.summary_data != null && this.props.modal_data.summary_data.number == 0) || (this.change_flag == 1) || (this.state.number != 0 && this.state.create_flag == 0)) ? "red-btn" : 'disable-btn'}
            onClick={this.registerConfirm.bind(this, 1)}
          >
            確定保存
          </Button>
        </Modal.Footer>
        {this.state.confirm_message !== "" && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.confirmOk.bind(this)}
            confirmTitle= {this.state.confirm_message}
            title = {this.state.confirm_alert_title}
          />
        )}
        {this.state.complete_message !== '' && (
          <CompleteStatusModal
            message = {this.state.complete_message}
          />
        )}
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal= {this.confirmCancel.bind(this)}
            handleOk= {this.confirmCancel.bind(this)}
            showMedicineContent= {this.state.alert_messages}            
          />
        )}
        {this.state.isOpenStaffList && (
          <DialSelectMasterModal
            selectMaster = {this.selectStaff}
            closeModal = {this.closeModal}
            MasterCodeData = {this.state.staffs}
            MasterName = 'スタッフ'
          />
        )}
        {this.state.check_message !== "" && (
          <ValidateAlertModal
            handleOk={this.closeValidateAlertModal}
            alert_meassage={this.state.check_message}
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
        {this.state.isHistoryModal && (
          <AnamuneHistoryModal
            closeModal = {this.closeModal}
            history_numbers = {this.state.history}
            handleOk = {this.showHistoryDetail}
            from_source = {'visit'}
          />
        )}
        {this.state.isShowDetailModal && (
          <ShowHistoryDetailModal
            closeModal = {this.closeModal}
            detail_data = {this.state.detail_data}
            food_type_object = {this.state.food_type_object}
            doctor_list = {this.doctor_list}
            nurse_staff_options = {this.state.nurse_staff_options}
            type = 'visit'
          />
        )}
      </Modal>
    );
  }
}

VisitNurseSummaryModal.contextType = Context;
VisitNurseSummaryModal.propTypes = {
  modal_data: PropTypes.object,
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,
  closeModal: PropTypes.func,
  detailedPatientInfo : PropTypes.object,
  handleOk:PropTypes.func
}
export default VisitNurseSummaryModal;

