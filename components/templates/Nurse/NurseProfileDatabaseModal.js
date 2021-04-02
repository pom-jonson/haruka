import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import {formatDateLine,formatDateString} from "~/helpers/date";
import * as apiClient from "~/api/apiClient";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Button from "~/components/atoms/Button";
import Radiobox from "~/components/molecules/Radiobox";
import axios from "axios/index";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import * as sessApi from "~/helpers/cacheSession-utils";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import {harukaValidate} from "~/helpers/haruka_validate";
import $ from "jquery";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import {CACHE_SESSIONNAMES, getServerTime} from "~/helpers/constants";
import Spinner from "react-bootstrap/Spinner";
import ja from "date-fns/locale/ja";
import DatePicker, { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { faMinusCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {toHalfWidthOnlyNumber, setDateColorClassName} from "~/helpers/dialConstants";
import * as localApi from "~/helpers/cacheLocal-utils";
import AnamuneHistoryModal from "~/components/templates/Nurse/AnamuneHistoryModal";
import ShowHistoryDetailModal from "~/components/templates/Nurse/ShowHistoryDetailModal"
import Checkbox from "~/components/molecules/Checkbox";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

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
    margin-right:0.5rem;
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
      width:8rem;
      border-right:1px solid #aaa;
    }
    .summary-value {
      width:calc(100% - 8rem);
    }
    .div-input {
      div {margin-top:0;}
      .label-title {
        margin:0;
        line-height:2rem;
        font-size:1rem;
      }
      input {
        line-height:2rem;
        font-size:1rem;
        height:2rem;
      }
    }
    .no-label-input{
      .label-title{
        display:none;
      }
    }
    .select-radio {
      display:flex;
      padding-left: 0.5rem;
      label {
        font-size:1rem;
        line-height:2rem;
        margin-right: 0.5rem;
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
        width:4rem;
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
      input {width:calc(100% - 9rem);}
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
        height: 4.5rem;
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
        .pullbox-label{
          margin-bottom:0;
        }
        .pullbox-select{
          width:3.5rem;
          height:2rem;
          font-size:1rem;
          padding:0;
        }
      }
      .td-select{
        padding:0;
        .label-title{
          display:none;
        }
        .pullbox-label{
          margin-bottom:0;
        }
        .pullbox-select{
          font-size:1rem;
          width:calc(4.5rem - 1px);
          height:2rem;
          padding:0;
        }

      }
      .td-check{
        text-align:center;
        label{
          margin-right:0;
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
      .icon-td{
        padding: 0px;
        div {
          line-height: 2rem;          
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
      left: -130px !important;
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

class NurseProfileDatabaseModal extends Component {
  constructor(props) {
    super(props);
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    let hospital_name = "";
    if(initState !== undefined && initState != null && initState.conf_data !== undefined && initState.conf_data.hospital_name !== undefined){
      hospital_name = initState.conf_data.hospital_name;
    }
    let patientId = props.patientId;
    let patientInfo = props.patientInfo;
    let path = window.location.href.split("/");
    this.patient_age = '';
    this.year = new Date().getFullYear();    
    if (patientInfo != undefined && patientInfo.birth_day != undefined && patientInfo.birth_day != null && patientInfo.birth_day != ''){
      var birth_day = patientInfo.birth_day;
      var birth_year = birth_day.split('-')[0];
      this.patient_age = this.year - birth_year;
    }
    if(path[path.length - 1] == "nursing_document"){
      let nurse_patient_info = localApi.getObject("nurse_patient_info");
      if(nurse_patient_info !== undefined && nurse_patient_info != null){
        patientInfo = nurse_patient_info.patientInfo;
        patientId = nurse_patient_info.detailedPatientInfo.patient[0]['number'];
      }
    }
    this.live_state_options = [{id:0, value:'生存'}, {id:1, value:'死亡'}];
    this.relation_prefix_option = [
      {id:0, value:''}, 
      {id:1, value:'配'},
      {id:2, value:'子'},
    ];
    this.state = {
      patientId,
      patientInfo,
      hospital_name,
      medical_history:[{age:"", disease_name:"", hospital:"", year:'', month:'', day:''}],
      family_members:[{name:'', relation:'', comment:'', live_togeter:0, live_state:0, relation_prefix:0}],
      ward_name:'',
      disease_name:'',
      create_comment:"",
      medical_history_number:"",
      medical_history_age:"",
      medical_history_disease_name:"",
      medical_history_hospital:"",
      pressure_ulcer_judgment:0,
      pressure_ulcer_site:"",
      movement_judgment:null,
      change_of_clothes_judgment:null,
      bathing_judgment:null,
      meal_judgment: null,
      movement_judgment_free:'',
      change_of_clothes_judgment_free:'',
      bathing_judgment_free:'',
      meal_judgment_free:'',
      food_type: 0,
      food_energy:"",
      food_type_salt_content:"",
      denture_judgment:0,
      denture_part:null,
      peg_construction_date:"",
      scheduled_ed_tube_date:"",
      defecation:"",
      last_defecation:"",
      number_of_urination:"",
      balun_judgment:0,
      balun_insert_date:"",
      balun_size:"",
      stoma_judgment:0,
      infectious_disease_judgment:0,
      hbs:0,
      hcv:0,
      wa:0,
      mrsa:0,
      allergy_judgment:0,
      allergic_food:0,
      allergic_drugs:0,
      t:patientInfo.temperature!= undefined && patientInfo.temperature!= null ? patientInfo.temperature:'',
      p:patientInfo.pluse!= undefined && patientInfo.pluse!= null ? patientInfo.pluse:'',
      bp:patientInfo.max_blood!= undefined && patientInfo.max_blood!= null ? patientInfo.max_blood:'',
      height:patientInfo.height!= undefined && patientInfo.height!= null ? patientInfo.height:'',
      weight:patientInfo.weight!= undefined && patientInfo.weight!= null ? patientInfo.weight:'',
      spo2:"",
      long_term_care_insurance_judgment:0,
      long_term_care_insurance_required:"",
      long_term_care_insurance_office:"",
      key_person:"",
      no_relatives:0,
      emergency_contact_name:"",
      emergency_contact_relations:"",
      emergency_contact_phone_number:"",
      emergency_contact_name_2:"",
      emergency_contact_relations_2:"",
      emergency_contact_phone_number_2:"",
      long_term_care_problems:"",
      visually_impaired:0,
      hearing_impairment:0,
      language_disorder:0,
      movement_disorders:0,
      paralyzed_upper_limbs:0,
      paralyzed_upper_limb_site:"",
      paralyzed_lower_limbs:0,
      paralyzed_lower_limb_site:"",
      comprehension:"",
      tracheostomy_judgment:0,
      tracheostomy_type:"",
      notices:"",
      doctor:0,
      division_teacher:0,
      writer:null,
      writer_name:"",
      date_of_description:"",
      isOpenStaffList:false,
      confirm_message:'',
      confirm_type:'',
      complete_message:'',
      alert_messages:'',
      alert_type:'',
      check_message:'',
      staffs:[],
      food_types:[],
      is_loaded:false,

      confirm_alert_title:'',
      isCloseConfirmModal:false,
      isHistoryModal:false,
      isShowDetailModal:false,
      address:"",
      phone_number_1:"",
      phone_number_2:"",
      created_at:new Date(),
      revision_date:new Date(),
      history:null
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
    this.can_register = false;
    this.can_register_old = false;
    this.can_edit_old = false;
  }
  
  async componentDidMount() {
    this.can_register = this.context.$canDoAction(this.context.FEATURES.NURSE_DATABASE,this.context.AUTHS.REGISTER);
    this.can_register_old = this.context.$canDoAction(this.context.FEATURES.NURSE_DATABASE,this.context.AUTHS.REGISTER_OLD);
    this.can_edit_old = this.context.$canDoAction(this.context.FEATURES.NURSE_DATABASE,this.context.AUTHS.EDIT_OLD);
    await this.getMaster();
    await this.getNurseStaff();
    await this.getSummaryInfo();
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
    let path = "/app/api/v2/nursing_service/get/summary_individual";
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
          history:res.summary_data == null ? null : res.summary_data.history,
          hospitalization_date:res.date_and_time_of_hospitalization,
          ward_name:res.ward_name,
          disease_name:res.disease_name,
          address:res.address,
          phone_number_1:res.phone_number_1,
          phone_number_2:res.phone_number_2,
          medical_history_number:(res.summary_data != null && res.summary_data.medical_history_number != null) ? res.summary_data.medical_history_number : "",
          medical_history:(res.summary_data != null && res.summary_data.medical_history != null) ? res.summary_data.medical_history : [{age:"", disease_name:"", hospital:"", year:'', month:'', day:''}],
          family_members:(res.summary_data != null && res.summary_data.family_members != null) ? res.summary_data.family_members : [{name:'', relation:'', comment:'', live_togeter:0, live_state:0, relation_prefix:0}],
          pressure_ulcer_judgment:res.summary_data != null ? res.summary_data.pressure_ulcer_judgment : 0,
          pressure_ulcer_site:(res.summary_data != null && res.summary_data.pressure_ulcer_site != null) ? res.summary_data.pressure_ulcer_site : "",
          movement_judgment:res.summary_data != null ? res.summary_data.movement_judgment : null,
          change_of_clothes_judgment:res.summary_data != null ? res.summary_data.change_of_clothes_judgment : null,
          bathing_judgment:res.summary_data != null ? res.summary_data.bathing_judgment : null,
          meal_judgment:res.summary_data != null ? res.summary_data.meal_judgment : null,
          movement_judgment_free:res.summary_data != null ? res.summary_data.movement_judgment_free : '',
          change_of_clothes_judgment_free:res.summary_data != null ? res.summary_data.change_of_clothes_judgment_free : '',
          bathing_judgment_free:res.summary_data != null ? res.summary_data.bathing_judgment_free : '',
          meal_judgment_free:res.summary_data != null ? res.summary_data.meal_judgment_free : '',
          food_type:(res.summary_data != null && res.summary_data.food_type != null) ? res.summary_data.food_type : res.food_type_id,
          food_energy:(res.summary_data != null && res.summary_data.food_energy != null) ? res.summary_data.food_energy : "",
          food_type_salt_content:(res.summary_data != null && res.summary_data.food_type_salt_content != null) ? res.summary_data.food_type_salt_content : "",
          denture_judgment:res.summary_data != null ? res.summary_data.denture_judgment : 0,
          denture_part:res.summary_data != null ? res.summary_data.denture_part : null,
          peg_construction_date:(res.summary_data != null && res.summary_data.peg_construction_date != null)
            ? new Date(res.summary_data.peg_construction_date.split('-').join('/')) : "",
          scheduled_ed_tube_date:(res.summary_data != null && res.summary_data.scheduled_ed_tube_date != null)
            ? new Date(res.summary_data.scheduled_ed_tube_date.split('-').join('/')) : "",
          defecation:(res.summary_data != null && res.summary_data.defecation != null) ? res.summary_data.defecation : "",
          last_defecation:(res.summary_data != null && res.summary_data.last_defecation != null)
            ? new Date(res.summary_data.last_defecation.split('-').join('/')) : "",
          number_of_urination:(res.summary_data != null && res.summary_data.number_of_urination != null) ? res.summary_data.number_of_urination : "",
          balun_judgment:res.summary_data != null ? res.summary_data.balun_judgment : 0,
          balun_insert_date:(res.summary_data != null && res.summary_data.balun_insert_date != null)
            ? new Date(res.summary_data.balun_insert_date.split('-').join('/')) : "",
          balun_size:(res.summary_data != null && res.summary_data.balun_size != null) ? res.summary_data.balun_size : "",
          stoma_judgment:res.summary_data != null ? res.summary_data.stoma_judgment : 0,
          infectious_disease_judgment:res.summary_data != null ? res.summary_data.infectious_disease_judgment : 0,
          hbs:res.summary_data != null ? res.summary_data.hbs : 0,
          hcv:res.summary_data != null ? res.summary_data.hcv : 0,
          wa:res.summary_data != null ? res.summary_data.wa : 0,
          mrsa:res.summary_data != null ? res.summary_data.mrsa : 0,
          allergy_judgment:res.summary_data != null ? res.summary_data.allergy_judgment : 0,
          allergic_food:res.summary_data != null ? res.summary_data.allergic_food : 0,
          allergic_drugs:res.summary_data != null ? res.summary_data.allergic_drugs : 0,
          t:(res.summary_data != null && res.summary_data.t != null) ? res.summary_data.t : this.state.t,
          p:(res.summary_data != null && res.summary_data.p != null) ? res.summary_data.p : this.state.p,
          bp:(res.summary_data != null && res.summary_data.bp != null) ? res.summary_data.bp : this.state.bp,
          spo2:(res.summary_data != null && res.summary_data.spo2 != null) ? res.summary_data.spo2 : "",
          height:(res.summary_data != null && res.summary_data.height != null) ? res.summary_data.height : this.state.height,
          weight:(res.summary_data != null && res.summary_data.weight != null) ? res.summary_data.weight : this.state.weight,
          long_term_care_insurance_judgment:res.summary_data != null ? res.summary_data.long_term_care_insurance_judgment : 0,
          long_term_care_insurance_required:res.summary_data != null ? res.summary_data.long_term_care_insurance_required : "",
          long_term_care_insurance_office:res.summary_data != null ? res.summary_data.long_term_care_insurance_office : "",
          key_person:res.summary_data != null ? res.summary_data.key_person: "",
          no_relatives:res.summary_data != null ? res.summary_data.no_relatives: 0,
          emergency_contact_name:res.summary_data != null ? res.summary_data.emergency_contact_name: "",
          emergency_contact_relations:res.summary_data != null ? res.summary_data.emergency_contact_relations: "",
          emergency_contact_phone_number:res.summary_data != null ? res.summary_data.emergency_contact_phone_number: "",
          emergency_contact_name_2:res.summary_data != null ? res.summary_data.emergency_contact_name_2: "",
          emergency_contact_relations_2:res.summary_data != null ? res.summary_data.emergency_contact_relations_2: "",
          emergency_contact_phone_number_2:res.summary_data != null ? res.summary_data.emergency_contact_phone_number_2: "",
          long_term_care_problems:res.summary_data != null ? res.summary_data.long_term_care_problems: "",
          visually_impaired:res.summary_data != null ? res.summary_data.visually_impaired: 0,
          hearing_impairment:res.summary_data != null ? res.summary_data.hearing_impairment: 0,
          language_disorder:res.summary_data != null ? res.summary_data.language_disorder: 0,
          movement_disorders:res.summary_data != null ? res.summary_data.movement_disorders: 0,
          paralyzed_upper_limbs:res.summary_data != null ? res.summary_data.paralyzed_upper_limbs: 0,
          paralyzed_upper_limb_site:res.summary_data != null ? res.summary_data.paralyzed_upper_limb_site: "",
          paralyzed_lower_limbs:res.summary_data != null ? res.summary_data.paralyzed_lower_limbs: 0,
          paralyzed_lower_limb_site:res.summary_data != null ? res.summary_data.paralyzed_lower_limb_site: "",
          comprehension:res.summary_data != null ? res.summary_data.comprehension: "",
          tracheostomy_judgment:res.summary_data != null ? res.summary_data.tracheostomy_judgment: 0,
          tracheostomy_type:res.summary_data != null ? res.summary_data.tracheostomy_type: "",
          notices:res.summary_data != null ? res.summary_data.notices: "",
          doctor:(res.summary_data != null && res.summary_data.doctor != null) ? res.summary_data.doctor: res.doctor,
          division_teacher:(res.summary_data != null && res.summary_data.division_teacher != null) ? res.summary_data.division_teacher: 0,
          writer:res.summary_data != null ? res.summary_data.writer: authInfo.user_number,
          writer_name:res.summary_data != null ? res.summary_data.writer_name: authInfo.name,
          date_of_description:(res.summary_data != null && res.summary_data.date_of_description != null)
            ? new Date(res.summary_data.date_of_description.split('-').join('/')): "",
          internal_use:(res.summary_data != null && res.summary_data.internal_use != null) ? res.summary_data.internal_use: "",
          current_medical_history:(res.summary_data != null && res.summary_data.current_medical_history != null) ? res.summary_data.current_medical_history: "",
          created_at:(res.summary_data != null && res.summary_data.created_at != null) ? new Date(res.summary_data.created_at.split('-').join('/')) : new Date(),
          revision_date:(res.summary_data != null && res.summary_data.revision_date != null) ? new Date(res.summary_data.revision_date.split('-').join('/')) : new Date(),
          is_loaded:true,
        });
      }
    })
  }
  
  getMaster=async()=>{
    let path = "/app/api/v2/nursing_service/get/nurse_summary/master";
    let post_data = {};
    await apiClient.post(path, {params: post_data})
      .then(res => {
        let food_types = [{id:0, value:""}];
        var food_type_object = {};
        if(res.food_type_master != undefined && res.food_type_master.length > 0){
          res.food_type_master.map(item=>{
            food_types.push({id:item.number, value:item.name});
            food_type_object[item.number] = item.name;
          })
        }
        this.setState({
          food_types,
          food_type_object,
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
    if(e.target.name == "balun_judgment" && e.target.value == 0){
      state_data['balun_size'] = "";
      state_data['balun_insert_date'] = "";
    }
    if(e.target.name == "infectious_disease_judgment" && e.target.value == 0){
      state_data['hbs'] = 0;
      state_data['hcv'] = 0;
      state_data['wa'] = 0;
      state_data['mrsa'] = 0;
    }
    if(e.target.name == "allergy_judgment" && e.target.value == 0){
      state_data['allergic_food'] = 0;
      state_data['allergic_drugs'] = 0;
    }
    if(e.target.name == "long_term_care_insurance_judgment" && e.target.value == 0){
      state_data['long_term_care_insurance_office'] = "";
    }
    if(e.target.name == "paralyzed_upper_limbs" && e.target.value == 0){
      state_data['paralyzed_upper_limb_site'] = "";
    }
    if(e.target.name == "paralyzed_lower_limbs" && e.target.value == 0){
      state_data['paralyzed_lower_limb_site'] = "";
    }
    if(e.target.name == "tracheostomy_judgment" && e.target.value == 0){
      state_data['tracheostomy_type'] = "";
    }
    this.setState(state_data);
  }

  setTextValue = (key,e) => {
    this.change_flag = 1;
    this.setState({[key]: e.target.value});
  }
  
  setIntNumberValue = (key,e) => {
    var RegExp = /^[0-9０-９]*$/;
    if (e.target.value != '' && !RegExp.test(e.target.value)) return;
    this.change_flag = 1;
    this.setState({[key]: toHalfWidthOnlyNumber(e.target.value)});
  }

  setNumericValue = (key,e) => {
    var RegExp = /^[0-9０-９]+\.?[0-9０-９]*$/;
    if (e.target.value != '' && !RegExp.test(e.target.value)) return;    
    this.change_flag = 1;
    this.setState({[key]: toHalfWidthOnlyNumber(e.target.value)});
  }

  setCheckState = (name, value) => {
    this.change_flag = 1;
    this.setState({[name]: value});
  }

  closeModal = () => {
    this.setState({
      isOpenStaffList: false,      
      isHistoryModal:false,
      isShowDetailModal:false
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
    let pdf_file_name = "看護データベース_" + this.state.patientInfo.receId + "_" + formatDateString(new Date(server_time)) + ".pdf";
    return pdf_file_name;
  }

  printPdf=async()=>{
    this.setState({
      confirm_type:"",
      confirm_message:"",
      complete_message:"印刷中"
    });
    let pdf_file_name = await this.get_title_pdf();
    let path = "/app/api/v2/nursing_service/print/nurse_database";
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
      if(this.change_flag == 0){
        return;
      }
    } else {
      if(this.change_flag == 0){
        return;
      }
    }
    if(!this.can_register){return;}
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
    let path = "/app/api/v2/nursing_service/register/nurse_summary";
    let post_data = {
      number:this.state.number > 0 ? this.state.number : 0,
      database_flag:1,
      patient_id:this.state.patientId,
      hospitalization_date:this.state.hospitalization_date,
      create_flag,
      create_comment:this.state.create_comment,
      full_name:this.state.patientInfo.patient_name,
      medical_history_number:this.state.medical_history_number == "" ? null : this.state.medical_history_number,
      medical_history:this.state.medical_history,
      family_members:this.state.family_members,
      pressure_ulcer_judgment:this.state.pressure_ulcer_judgment,
      pressure_ulcer_site:this.state.pressure_ulcer_judgment == 1 ? this.state.pressure_ulcer_site : null,
      movement_judgment:this.state.movement_judgment,
      change_of_clothes_judgment:this.state.change_of_clothes_judgment,
      bathing_judgment:this.state.bathing_judgment,
      meal_judgment:this.state.meal_judgment,
      movement_judgment_free:this.state.movement_judgment_free,
      change_of_clothes_judgment_free:this.state.change_of_clothes_judgment_free,
      bathing_judgment_free:this.state.bathing_judgment_free,
      meal_judgment_free:this.state.meal_judgment_free,
      food_type:this.state.food_type == 0 ? null : this.state.food_type,
      food_energy:this.state.food_energy == "" ? null : this.state.food_energy,
      food_type_salt_content:this.state.food_type_salt_content == "" ? null : this.state.food_type_salt_content,
      denture_judgment:this.state.denture_judgment,
      denture_part:this.state.denture_judgment == 1 ? this.state.denture_part : null,
      peg_construction_date:(this.state.peg_construction_date != null && this.state.peg_construction_date != "") ? formatDateLine(this.state.peg_construction_date) : null,
      scheduled_ed_tube_date:(this.state.scheduled_ed_tube_date != null && this.state.scheduled_ed_tube_date != "") ? formatDateLine(this.state.scheduled_ed_tube_date) : null,
      defecation:this.state.defecation != "" ? this.state.defecation : null,
      last_defecation:(this.state.last_defecation != null && this.state.last_defecation != "") ? formatDateLine(this.state.last_defecation) : null,
      number_of_urination:this.state.number_of_urination != "" ? this.state.number_of_urination : null,
      balun_judgment:this.state.balun_judgment,
      balun_insert_date:(this.state.balun_insert_date != null && this.state.balun_insert_date != "") ? formatDateLine(this.state.balun_insert_date) : null,
      balun_size:this.state.balun_size != "" ? this.state.balun_size : null,
      stoma_judgment:this.state.stoma_judgment,
      infectious_disease_judgment:this.state.infectious_disease_judgment,
      hbs:this.state.infectious_disease_judgment == 1 ? this.state.hbs : 0,
      hcv:this.state.infectious_disease_judgment == 1 ? this.state.hcv : 0,
      wa:this.state.infectious_disease_judgment == 1 ? this.state.wa : 0,
      mrsa:this.state.infectious_disease_judgment == 1 ? this.state.mrsa : 0,
      allergy_judgment:this.state.allergy_judgment,
      allergic_food:this.state.allergy_judgment == 1 ? this.state.allergic_food : 0,
      allergic_drugs:this.state.allergy_judgment == 1 ? this.state.allergic_drugs : 0,
      t:this.state.t != "" ? this.state.t : null,
      p:this.state.p != "" ? this.state.p : null,
      bp:this.state.bp != "" ? this.state.bp : null,
      spo2:this.state.spo2 != "" ? this.state.spo2 : null,
      height:this.state.height != "" ? this.state.height : null,
      weight:this.state.weight != "" ? this.state.weight : null,
      long_term_care_insurance_judgment:this.state.long_term_care_insurance_judgment,
      long_term_care_insurance_required:(this.state.long_term_care_insurance_judgment == 4 && this.state.long_term_care_insurance_required != "") ? this.state.long_term_care_insurance_required : null,
      long_term_care_insurance_office:this.state.long_term_care_insurance_office != "" ? this.state.long_term_care_insurance_office : null,
      key_person:this.state.key_person != "" ? this.state.key_person : null,
      no_relatives:this.state.no_relatives,
      emergency_contact_name:this.state.emergency_contact_name != "" ? this.state.emergency_contact_name : null,
      emergency_contact_relations:this.state.emergency_contact_relations != "" ? this.state.emergency_contact_relations : null,
      emergency_contact_phone_number:this.state.emergency_contact_phone_number != "" ? this.state.emergency_contact_phone_number : null,
      emergency_contact_name_2:this.state.emergency_contact_name_2 != "" ? this.state.emergency_contact_name_2 : null,
      emergency_contact_relations_2:this.state.emergency_contact_relations_2 != "" ? this.state.emergency_contact_relations_2 : null,
      emergency_contact_phone_number_2:this.state.emergency_contact_phone_number_2 != "" ? this.state.emergency_contact_phone_number_2 : null,
      long_term_care_problems:this.state.long_term_care_problems != "" ? this.state.long_term_care_problems : null,
      visually_impaired:this.state.visually_impaired,
      hearing_impairment:this.state.hearing_impairment,
      language_disorder:this.state.language_disorder,
      movement_disorders:this.state.movement_disorders,
      paralyzed_upper_limbs:this.state.paralyzed_upper_limbs,
      paralyzed_upper_limb_site:(this.state.paralyzed_upper_limbs == 1 && this.state.paralyzed_upper_limb_site != "") ? this.state.paralyzed_upper_limb_site : null,
      paralyzed_lower_limbs:this.state.paralyzed_lower_limbs,
      paralyzed_lower_limb_site:(this.state.paralyzed_lower_limbs == 1 && this.state.paralyzed_lower_limb_site != "") ? this.state.paralyzed_lower_limb_site : null,
      comprehension:this.state.comprehension != "" ? this.state.comprehension : null,
      tracheostomy_judgment:this.state.tracheostomy_judgment,
      tracheostomy_type:(this.state.tracheostomy_judgment == 1 && this.state.tracheostomy_type != "") ? this.state.tracheostomy_type : null,
      notices:this.state.notices != "" ? this.state.notices : null,
      doctor:this.state.doctor != 0 ? this.state.doctor : null,
      division_teacher:this.state.division_teacher != 0 ? this.state.division_teacher : null,
      writer:this.state.writer,
      date_of_description:(this.state.date_of_description != null && this.state.date_of_description != "") ? formatDateLine(this.state.date_of_description) : null,
      internal_use:this.state.internal_use,
      current_medical_history:this.state.current_medical_history,
      created_at:formatDateLine(this.state.created_at),
      revision_date:formatDateLine(this.state.revision_date),
    };
    await apiClient.post(path, {params: post_data})
      .then(res => {
        if(res.alert_message !== undefined){
          this.change_flag = 0;
        }
        this.setState({
          alert_messages:res.alert_message !== undefined ? res.alert_message : res.error_message,
          is_loaded:false,
        }, ()=>{
          this.getSummaryInfo();
        });
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
    harukaValidate('nursing', 'summary', 'nurse_data_base', this.state, 'background');
  }
  
  checkValidation = () => {
    let error_str_arr = [];
    let validate_data = harukaValidate('nursing', 'summary', 'nurse_data_base', this.state);
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
    var patientInfo = this.props.patientInfo;
    if (patientInfo == undefined || patientInfo.birth_day == undefined || patientInfo.birth_day == null || patientInfo.birth_day == '') return;
    var birth_day = patientInfo.birth_day;
    var birth_year = birth_day.split('-')[0];    
    if (medical_history[index]['year'] < parseInt(birth_year) || medical_history[index]['year'] > this.year){
      medical_history[index]['year'] = '';
      this.setState({        
        alert_messages:'年は生年以上・今年以下で入力してください。',
        medical_history,
      });
      $('#birth-year_' + index).focus();
      return;
    }
    medical_history[index]['age'] = medical_history[index]['year'] - birth_year;
    this.setState({medical_history});
  }

  calcYearHistory = (index) => {
    let medical_history = this.state.medical_history;
    if (!(medical_history[index]['age'] > 0)) return;
    var patientInfo = this.props.patientInfo;
    if (patientInfo == undefined || patientInfo.birth_day == undefined || patientInfo.birth_day == null || patientInfo.birth_day == '') return;
    var birth_day = patientInfo.birth_day;
    var birth_year = birth_day.split('-')[0];
    medical_history[index]['year'] = parseInt(birth_year) + parseInt(medical_history[index]['age']);
    this.setState({medical_history});
  }

  setFamilyMember = (param, e) => {
    let key = param.split(':')[0];
    let index = param.split(':')[1];
    let family_members = this.state.family_members;
    if (key == 'live_state' || key == 'relation_prefix'){
      family_members[index][key] = e.target.id;
    } else {
      family_members[index][key] = e.target.value;
    }
    this.setState({family_members});
    this.change_flag = 1;
  }

  setFamilyCheck = (index, name, value) => {
    let family_members = this.state.family_members;
    family_members[index][name] = value;
    this.change_flag = 1;
  }

  changeFamilyMembers = (index, type)=>{
    let cur_family_members = this.state.family_members;
    let family_members = [];
    cur_family_members.map((memeber, h_idx)=>{
      if(h_idx == index){
        if(type == "add"){
          family_members.push(memeber);
          family_members.push({name:"", relation:"", comment:"", live_togeter:0, live_state:0, relation_prefix:0});
        }
      } else {
        family_members.push(memeber);
      }
    });
    if(family_members.length == 0){
      family_members.push({name:"", relation:"", comment:"", live_togeter:0, live_state:0, relation_prefix:0});
    }
    this.setState({family_members});
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

  setPhoneNumber = (name, e) => {
    let regx = /^[-ー]*[0-9０-９][-ー0-9０-９]*$/;
    if (e.target.value != "" && !regx.test(e.target.value)) return;
    this.change_flag = 1;
    this.setState({[name]:e.target.value});
  }

  openHistoryModal = () => {
    if(this.state.history == null){return;}
    this.setState({isHistoryModal:true})
  }

  showHistoryDetail = (data) => {    
    this.closeModal();
    this.setState({
      isShowDetailModal:true,
      detail_data:data,
    })
  }

  render() {    
    return (
      <Modal show={true} id="add_contact_dlg"  className="custom-modal-sm patient-exam-modal bed-control-modal nurse-summary first-view-modal">
        <Modal.Header>
          <Header>
            <Modal.Title>看護データベース</Modal.Title>
            <Button type="common" className={this.state.history == null ? 'disable-btn' : 'red-btn'} onClick={this.openHistoryModal.bind(this)}>歴一覧</Button>
          </Header>
        </Modal.Header>
        <Modal.Body>
          <DatePickerBox style={{width:"100%", height:"100%"}}>
            <PatientsWrapper>
              {this.state.is_loaded ? (
                <>
                  {/* <div className={'div-title'}>ファイル(F) 編集(g)</div>
                  <div className={'flex'}>
                    <div className={'div-value'} style={{width:"6rem"}}>
                      {this.props.modal_data.summary_data != null ? formatDateSlash(new Date(this.props.modal_data.summary_data.created_at.split('-').join('/'))) : formatDateSlash(new Date())}
                    </div>
                    <div className={'div-title'} style={{marginLeft:"0.5rem"}}>患者氏名</div>
                    <div className={'div-value'} style={{width:"20rem"}}>{this.props.modal_data.patient_name}</div>
                    <div className={'div-title'} style={{marginLeft:"0.5rem"}}>入院日</div>
                    <div className={'div-value'} style={{width:"6rem"}}>{formatDateSlash(this.props.modal_data.date_and_time_of_hospitalization.split('-').join('/'))}</div>
                    <div className={'div-title'} style={{marginLeft:"0.5rem"}}>退院日</div>
                    <div className={'div-value'} style={{width:"6rem"}}>
                      {this.props.modal_data.expected_discharge_date != null ? formatDateSlash(this.props.modal_data.expected_discharge_date.split('-').join('/')) : ""}
                    </div>
                  </div>
                  <div className={'flex'} style={{marginTop:"0.5rem"}}>
                    <div className={'div-title'}>承認状態</div>
                    <div className={'div-value'} style={{width:"5rem"}}>
                      {this.props.modal_data.summary_data != null ?
                        (this.props.modal_data.summary_data.approval_category == 0 ? "未承認" : (this.props.modal_data.summary_data.approval_category == 1 ? "承認済み" : "差し戻し"))
                        :""}
                    </div>
                    <div className={'div-title'} style={{marginLeft:"0.5rem"}}>承認日</div>
                    <div className={'div-value'} style={{width:"6rem"}}>
                      {(this.props.modal_data.summary_data != null && this.props.modal_data.summary_data.approval_date != null)
                        ? formatDateSlash(this.props.modal_data.summary_data.approval_date.split('-').join('/')) : ""}
                    </div>
                    <div className={'div-title'} style={{marginLeft:"0.5rem"}}>承認者氏名</div>
                    <div className={'div-value'} style={{width:"20rem"}}>{this.props.modal_data.summary_data != null ? this.props.modal_data.summary_data.approval_staff_name : ""}</div>
                  </div>
                  <div className={'flex'} style={{marginTop:"0.5rem"}}>
                    <div style={{paddingTop:"0.3rem", marginRight:"0.5rem"}}>承認コメント</div>
                    <div style={{minWidth:"20rem", maxWidth:"cacl(100% - 8rem)", maxHeight:"3rem", overflowY:"auto", border:"1px solid #aaa", padding:"0.3rem"}}>
                      {(this.props.modal_data.summary_data != null && this.props.modal_data.summary_data.approval_comment != null)
                        ? this.props.modal_data.summary_data.approval_comment : ""}&nbsp;
                    </div>
                  </div> */}
                  <div className={'summary-area border-1px'}>
                    <div className={'flex justify-content'} style={{width:"100%", paddingLeft:"0.2rem", paddingRight:"0.2rem"}}>
                      <div className={'div-title'}>
                        <span>病院名 : {this.state.hospital_name} 病棟：{this.state.ward_name}</span>
                      </div>
                      <div className={'div-title'}>
                        <span>{this.state.patientInfo.receId} : {this.state.patientInfo.name}（{this.state.patientInfo.birthDate}生）</span>
                      </div>
                    </div>
                    <div className={'scroll-area'}>
                      <div className={'flex border-1px'}>
                        <div className={'w-50-p border-right-1px'}>
                          <div className={'border-bottom-1px'} style={{padding:"0 0.2rem", height:"calc(4rem + 1px)"}}>
                            <div className={'flex'}>
                              <div style={{width:"5rem", lineHeight:"2rem"}}>住所</div>
                              <div style={{lineHeight:"2rem"}}>{this.state.address}</div>
                            </div>
                            <div className={'flex'}>
                              <div className={'flex'} style={{width:"50%"}}>
                                <div style={{width:"5rem", lineHeight:"2rem"}}>電話番号1</div>
                                <div style={{lineHeight:"2rem"}}>{this.state.phone_number_1}</div>
                              </div>
                              <div className={'flex'} style={{width:"50%"}}>
                                <div style={{width:"5rem", lineHeight:"2rem"}}>電話番号2</div>
                                <div style={{lineHeight:"2rem"}}>{this.state.phone_number_2}</div>
                              </div>
                            </div>
                          </div>
                          <div className={'flex border-bottom-1px'} style={{height:"calc(4rem + 3px)"}}>
                            <div className={'vertical-align summary-label'}><div>病名</div></div>
                            <div className={'summary-value p-03'} style={{overflowY:"auto"}}>{this.state.disease_name}</div>
                          </div>
                          <div className={'l-h-2'} style={{paddingLeft:"0.3rem"}}>既往歴</div>
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
                            <div className={'summary-label text-center'} style={{lineHeight:"4rem"}}>現病歴</div>
                            <div className={'summary-value'} style={{height:"4rem", overflowY:"auto"}}>
                            <textarea
                              value={this.state.current_medical_history}
                              style={{width:"100%", height:"100%"}}
                              id={'current_medical_history_id'}
                              onChange={this.setTextValue.bind(this, 'current_medical_history')}
                            />
                            </div>
                          </div>
                          <div className={'flex border-bottom-1px'}>
                            <div className={'summary-label text-center'} style={{lineHeight:"calc(4rem + 1px)"}}>内服</div>
                            <div className={'summary-value'} style={{height:"calc(4rem + 1px)", overflowY:"auto"}}>
                            <textarea
                              value={this.state.internal_use}
                              style={{width:"100%", height:"100%"}}
                              id={'internal_use_id'}
                              onChange={this.setTextValue.bind(this, 'internal_use')}
                            />
                            </div>
                          </div>
                          <div className={'flex border-bottom-1px'}>
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
                          <div className={'flex border-bottom-1px'}>
                            <div className={'summary-label text-center l-h-2'}>移動</div>
                            <div className={'summary-value select-radio'}>
                              <Radiobox
                                label={'自立'}
                                value={1}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.movement_judgment === 1}
                                name={`movement_judgment`}
                              />
                              <Radiobox
                                label={'見守り'}
                                value={2}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.movement_judgment === 2}
                                name={`movement_judgment`}
                              />
                              <Radiobox
                                label={'部分介助'}
                                value={3}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.movement_judgment === 3}
                                name={`movement_judgment`}
                              />
                              <Radiobox
                                label={'全介助'}
                                value={4}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.movement_judgment === 4}
                                name={`movement_judgment`}
                              />
                              <div className={'div-input no-label-input'}>
                                <InputWithLabelBorder
                                  label=""
                                  type="text"
                                  id={'movement_judgment_free_id'}
                                  getInputText={this.setTextValue.bind(this, "movement_judgment_free")}
                                  diseaseEditData = {this.state.movement_judgment_free}
                                />
                              </div>
                            </div>
                          </div>
                          <div className={'flex border-bottom-1px'}>
                            <div className={'summary-label text-center l-h-2'}>更衣</div>
                            <div className={'summary-value select-radio'}>
                              <Radiobox
                                label={'自立'}
                                value={1}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.change_of_clothes_judgment === 1}
                                name={`change_of_clothes_judgment`}
                              />
                              <Radiobox
                                label={'見守り'}
                                value={2}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.change_of_clothes_judgment === 2}
                                name={`change_of_clothes_judgment`}
                              />
                              <Radiobox
                                label={'部分介助'}
                                value={3}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.change_of_clothes_judgment === 3}
                                name={`change_of_clothes_judgment`}
                              />
                              <Radiobox
                                label={'全介助'}
                                value={4}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.change_of_clothes_judgment === 4}
                                name={`change_of_clothes_judgment`}
                              />
                              <div className={'div-input no-label-input'}>
                                <InputWithLabelBorder
                                  label=""
                                  type="text"
                                  id={'change_of_clothes_judgment_free_id'}
                                  getInputText={this.setTextValue.bind(this, "change_of_clothes_judgment_free")}
                                  diseaseEditData = {this.state.change_of_clothes_judgment_free}                                  
                                />
                              </div>
                            </div>
                          </div>
                          <div className={'flex border-bottom-1px'}>
                            <div className={'summary-label text-center l-h-2'}>入浴</div>
                            <div className={'summary-value select-radio'}>
                              <Radiobox
                                label={'自立'}
                                value={1}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.bathing_judgment === 1}
                                name={`bathing_judgment`}
                              />
                              <Radiobox
                                label={'見守り'}
                                value={2}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.bathing_judgment === 2}
                                name={`bathing_judgment`}
                              />
                              <Radiobox
                                label={'部分介助'}
                                value={3}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.bathing_judgment === 3}
                                name={`bathing_judgment`}
                              />
                              <Radiobox
                                label={'全介助'}
                                value={4}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.bathing_judgment === 4}
                                name={`bathing_judgment`}
                              />
                              <div className={'div-input no-label-input'}>
                                <InputWithLabelBorder
                                  label=""
                                  type="text"
                                  id={'bathing_judgment_free_id'}
                                  getInputText={this.setTextValue.bind(this, "bathing_judgment_free")}
                                  diseaseEditData = {this.state.bathing_judgment_free}                                  
                                />
                              </div>
                            </div>
                          </div>
                          <div className={'flex border-bottom-1px'}>
                            <div className={'summary-label text-center l-h-2'}>食事</div>
                            <div className={'summary-value select-radio'}>
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
                              <div className={'div-input no-label-input'}>
                                <InputWithLabelBorder
                                  label=""
                                  type="text"
                                  id={'meal_judgment_free_id'}
                                  getInputText={this.setTextValue.bind(this, "meal_judgment_free")}
                                  diseaseEditData = {this.state.meal_judgment_free}                                  
                                />
                              </div>
                            </div>
                          </div>
                          <div className={'flex border-bottom-1px'}>
                            <div className={'summary-label text-center l-h-2'}>食種</div>
                            <div className={'summary-value flex'}>
                              <div className={'select-doctor flex'}>
                                <div style={{lineHeight:"2rem", width:"3rem", textAlign:"center"}}>形態</div>
                                <div style={{width:"15rem"}}>
                                  <SelectorWithLabel
                                    options={this.state.food_types}
                                    title={''}
                                    getSelect={this.setSelectValue.bind(this, 'food_type')}
                                    departmentEditCode={this.state.food_type}
                                  />
                                </div>
                              </div>
                              <div className={'flex'}>
                                <div style={{lineHeight:"2rem", width:"6rem", textAlign:"center"}}>エネルギー</div>
                                <div className={'unit-value-input hankaku-eng-num-input'}>
                                  <InputWithLabelBorder
                                    label=""
                                    type="text"
                                    id={'food_energy_id'}
                                    getInputText={this.setIntNumberValue.bind(this, 'food_energy')}
                                    diseaseEditData={this.state.food_energy}
                                  />
                                  <div className={'unit-label'}>㎉</div>
                                </div>
                                <div style={{lineHeight:"2rem", width:"3rem", textAlign:"center"}}>塩分</div>
                                <div className={'unit-value-input hankaku-eng-num-input'}>
                                  <InputWithLabelBorder
                                    label=""
                                    type="text"
                                    id={'food_type_salt_content_id'}
                                    getInputText={this.setIntNumberValue.bind(this, 'food_type_salt_content')}
                                    diseaseEditData={this.state.food_type_salt_content}
                                  />
                                  <div className={'unit-label'}>g</div>
                                </div>
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
                              <div className={'div-title'}>（ </div>
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
                              <div className={'div-title'}> ）</div>
                            </div>
                          </div>
                          <div className={'flex border-bottom-1px'} style={{height:"calc(4rem + 2px)"}}>
                            <div className={'summary-label text-center'}>
                              <div className={'div-title'}>ＰＥＧ</div>
                              <div className={'div-title'} style={{fontSize:'0.9rem'}}>ＥＤチューブ</div>
                            </div>
                            <div className={'summary-value'}>
                              <div className={'div-title select-date'} style={{paddingLeft:"0.5rem"}}>
                                <div style={{width:"15rem"}}>造設日又は交換（挿入）施工日：</div>
                                <InputWithLabelBorder
                                  label=""
                                  type="date"
                                  getInputText={this.setDateValue.bind(this,"peg_construction_date")}
                                  diseaseEditData={this.state.peg_construction_date}
                                />
                              </div>
                              <div className={'div-title select-date'} style={{paddingLeft:"0.5rem"}}>
                                <div style={{width:"15rem"}}>次回交換（挿入）予定日：</div>
                                <InputWithLabelBorder
                                  label=""
                                  type="date"
                                  getInputText={this.setDateValue.bind(this,"scheduled_ed_tube_date")}
                                  diseaseEditData={this.state.scheduled_ed_tube_date}
                                />
                              </div>
                            </div>
                          </div>
                          <div className={'flex border-bottom-1px'}>
                            <div className={'summary-label vertical-align'}><div>排泄</div></div>
                            <div className={'summary-value'}>
                              <div className={'flex'}>
                                <div className={'summary-label text-center l-h-2'}>排便</div>
                                <div className={'unit-value-input hankaku-eng-num-input'}>
                                  <InputWithLabelBorder
                                    label=""
                                    type="text"
                                    id={'defecation_id'}
                                    getInputText={this.setIntNumberValue.bind(this, 'defecation')}
                                    diseaseEditData={this.state.defecation}
                                  />
                                  <div className={'unit-label'}>回/日</div>
                                </div>
                                <div className={'text-center l-h-2 border-left-1px'} style={{width:"5rem", marginLeft:"0.5rem"}}>最終排便</div>
                                <div className={'select-date'}>
                                  <DatePicker
                                    locale="ja"
                                    selected={this.state.last_defecation}
                                    onChange={this.setDateValue.bind(this,"last_defecation")}
                                    dateFormat="MM/dd"
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    dayClassName = {date => setDateColorClassName(date)}
                                  />
                                </div>
                                <div className={'text-center l-h-2'} style={{width:"5rem"}}>排尿回数</div>
                                <div className={'unit-value-input hankaku-eng-num-input'}>
                                  <InputWithLabelBorder
                                    label=""
                                    type="text"
                                    id={'number_of_urination_id'}
                                    getInputText={this.setIntNumberValue.bind(this, 'number_of_urination')}
                                    diseaseEditData={this.state.number_of_urination}
                                  />
                                  <div className={'unit-label'}>回/日</div>
                                </div>
                              </div>
                              <div className={'flex border-bottom-1px'}>
                              </div>
                              <div className={'flex border-bottom-1px'}>
                                <div className={'summary-label vertical-align'}><div>バルン</div></div>
                                <div className={'summary-value flex'}>
                                  <div className={'select-radio'}>
                                    <Radiobox
                                      label={'無'}
                                      value={0}
                                      getUsage={this.setRadioState.bind(this)}
                                      checked={this.state.balun_judgment === 0}
                                      name={`balun_judgment`}
                                    />
                                    <Radiobox
                                      label={'有'}
                                      value={1}
                                      getUsage={this.setRadioState.bind(this)}
                                      checked={this.state.balun_judgment === 1}
                                      name={`balun_judgment`}
                                    />
                                    <div className={'div-title unit-value-input hankaku-eng-num-input'}>
                                      <div>サイズ（ </div>
                                      <InputWithLabelBorder
                                        label=""
                                        type="text"
                                        id={'balun_size_id'}
                                        getInputText={this.setIntNumberValue.bind(this, 'balun_size')}
                                        diseaseEditData={this.state.balun_size}
                                        isDisabled={this.state.balun_judgment === 0}
                                      />
                                      <div className={'unit-label'}> Fr）</div>
                                    </div>
                                  </div>
                                  <div className={'select-date'} style={{height:"calc(2rem + 1px)"}}>
                                    <div style={{lineHeight:"2rem", margin:"0 0.5rem"}}>挿入日：</div>
                                    <InputWithLabelBorder
                                      label=""
                                      type="date"
                                      getInputText={this.setDateValue.bind(this,"balun_insert_date")}
                                      diseaseEditData={this.state.balun_insert_date}
                                      isDisabled={this.state.balun_judgment === 0}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className={'flex'}>
                                <div className={'summary-label text-center l-h-2'}>ストマ</div>
                                <div className={'summary-value select-radio'}>
                                  <Radiobox
                                    label={'無'}
                                    value={0}
                                    getUsage={this.setRadioState.bind(this)}
                                    checked={this.state.stoma_judgment === 0}
                                    name={`stoma_judgment`}
                                  />
                                  <Radiobox
                                    label={'有'}
                                    value={1}
                                    getUsage={this.setRadioState.bind(this)}
                                    checked={this.state.stoma_judgment === 1}
                                    name={`stoma_judgment`}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className={'flex'}>
                            <div className={'summary-label vertical-align'}><div>気管切開</div></div>
                            <div className={'summary-value flex'}>
                              <div className={'select-radio'}>
                                <Radiobox
                                  label={'無'}
                                  value={0}
                                  getUsage={this.setRadioState.bind(this)}
                                  checked={this.state.tracheostomy_judgment === 0}
                                  name={`tracheostomy_judgment`}
                                />
                                <Radiobox
                                  label={'有'}
                                  value={1}
                                  getUsage={this.setRadioState.bind(this)}
                                  checked={this.state.tracheostomy_judgment === 1}
                                  name={`tracheostomy_judgment`}
                                />
                              </div>
                              <div className={'div-title emergency-contact flex'} style={{marginLeft:"0.5rem"}}>
                                <div>種類（</div>
                                <div style={{width:"10rem"}}>
                                  <InputWithLabelBorder
                                    label=""
                                    type="text"
                                    id={'tracheostomy_type_id'}
                                    getInputText={this.setTextValue.bind(this, "tracheostomy_type")}
                                    diseaseEditData = {this.state.tracheostomy_type}
                                    isDisabled={this.state.tracheostomy_judgment === 0}
                                  />
                                </div>
                                <div>） Fr</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={'w-50-p'}>
                          <div className={'flex border-bottom-1px'}>
                            <div className={'summary-label vertical-align'}><div>アレルギー</div></div>
                            <div className={'summary-label vertical-align'}>
                              <div className={'select-radio'}>
                                <Radiobox
                                  label={'無'}
                                  value={0}
                                  getUsage={this.setRadioState.bind(this)}
                                  checked={this.state.allergy_judgment === 0}
                                  name={`allergy_judgment`}
                                />
                                <Radiobox
                                  label={'有'}
                                  value={1}
                                  getUsage={this.setRadioState.bind(this)}
                                  checked={this.state.allergy_judgment === 1}
                                  name={`allergy_judgment`}
                                />
                              </div>
                            </div>
                            <div className={'flex'}>
                              <div className={'select-radio'}>
                                <div className={'div-title'}>食品</div>
                                <Radiobox
                                  label={'無'}
                                  value={0}
                                  getUsage={this.setRadioState.bind(this)}
                                  checked={this.state.allergic_food === 0}
                                  name={`allergic_food`}
                                  isDisabled={this.state.allergy_judgment === 0}
                                />
                                <Radiobox
                                  label={'有'}
                                  value={1}
                                  getUsage={this.setRadioState.bind(this)}
                                  checked={this.state.allergic_food === 1}
                                  name={`allergic_food`}
                                  isDisabled={this.state.allergy_judgment === 0}
                                />
                              </div>
                              <div className={'select-radio'}>
                                <div className={'div-title'}>薬品</div>
                                <Radiobox
                                  label={'無'}
                                  value={0}
                                  getUsage={this.setRadioState.bind(this)}
                                  checked={this.state.allergic_drugs === 0}
                                  name={`allergic_drugs`}
                                  isDisabled={this.state.allergy_judgment === 0}
                                />
                                <Radiobox
                                  label={'有'}
                                  value={1}
                                  getUsage={this.setRadioState.bind(this)}
                                  checked={this.state.allergic_drugs === 1}
                                  name={`allergic_drugs`}
                                  isDisabled={this.state.allergy_judgment === 0}
                                />
                              </div>
                            </div>
                          </div>
                          <div className={'flex border-bottom-1px'}>
                            <div className={'summary-label vertical-align'}><div>入院時バイタル</div></div>
                            <div className={'summary-value'}>
                              <div className={'flex border-bottom-1px'}>
                                <div className={'summary-label text-center'} style={{lineHeight:"2rem"}}>T, P</div>
                                <div className={'div-input unit-input summary-value flex hankaku-eng-num-input'}>
                                  <InputWithLabelBorder
                                    label=""
                                    type="text"
                                    id={'t_id'}
                                    getInputText={this.setNumericValue.bind(this, "t")}
                                    diseaseEditData = {this.state.t}
                                  />
                                  <div className={'div-title'} style={{marginLeft:"0.5rem", width:'3rem'}}>℃</div>&nbsp;&nbsp;
                                  <InputWithLabelBorder
                                    label=""
                                    type="text"
                                    id={'p_id'}
                                    getInputText={this.setIntNumberValue.bind(this, "p")}
                                    diseaseEditData = {this.state.p}
                                  />
                                  <div className={'div-title'} style={{marginLeft:"0.5rem", width:'3rem'}}>回/分</div>
                                </div>
                              </div>                            
                              <div className={'flex border-bottom-1px'}>
                                <div className={'summary-label text-center'} style={{lineHeight:"2rem"}}>BP, SPO2</div>
                                <div className={'div-input unit-input summary-value flex hankaku-eng-num-input'}>
                                  <InputWithLabelBorder
                                    label=""
                                    type="text"
                                    id={'bp_id'}
                                    getInputText={this.setIntNumberValue.bind(this, "bp")}
                                    diseaseEditData = {this.state.bp}
                                  />
                                  <div className={'div-title'} style={{marginLeft:"0.5rem", width:'3rem'}}>㎜Hg</div>&nbsp;&nbsp;
                                  <InputWithLabelBorder
                                    label=""
                                    type="text"
                                    id={'spo2_id'}
                                    getInputText={this.setNumericValue.bind(this, "spo2")}
                                    diseaseEditData = {this.state.spo2}
                                  />
                                  <div className={'div-title'} style={{marginLeft:"0.5rem", width:'3rem'}}>%</div>
                                </div>
                              </div>                            
                              <div className={'flex'}>
                                <div className={'summary-label text-center'} style={{lineHeight:"2rem"}}>身長, 体重</div>
                                <div className={'div-input unit-input summary-value flex hankaku-eng-num-input'}>
                                  <InputWithLabelBorder
                                    label=""
                                    type="text"
                                    id={'height_id'}
                                    getInputText={this.setNumericValue.bind(this, "height")}
                                    diseaseEditData = {this.state.height}
                                  />
                                  <div className={'div-title'} style={{marginLeft:"0.5rem", width:'3rem'}}>cm</div>&nbsp;&nbsp;
                                  <InputWithLabelBorder
                                    label=""
                                    type="text"
                                    id={'weight_id'}
                                    getInputText={this.setNumericValue.bind(this, "weight")}
                                    diseaseEditData = {this.state.weight}
                                  />
                                  <div className={'div-title'} style={{marginLeft:"0.5rem", width:'3rem'}}>kg</div>
                                </div>
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
                                  checked={this.state.long_term_care_insurance_judgment === 0}
                                  name={`long_term_care_insurance_judgment`}
                                />
                                <Radiobox
                                  label={'有'}
                                  value={1}
                                  getUsage={this.setRadioState.bind(this)}
                                  checked={this.state.long_term_care_insurance_judgment === 1}
                                  name={`long_term_care_insurance_judgment`}
                                />
                                <Radiobox
                                  label={'申請中'}
                                  value={2}
                                  getUsage={this.setRadioState.bind(this)}
                                  checked={this.state.long_term_care_insurance_judgment === 2}
                                  name={`long_term_care_insurance_judgment`}
                                />
                              </div>
                              <div className={'select-radio'}>
                                <Radiobox
                                  label={'要支援'}
                                  value={3}
                                  getUsage={this.setRadioState.bind(this)}
                                  checked={this.state.long_term_care_insurance_judgment === 3}
                                  name={`long_term_care_insurance_judgment`}
                                />
                                <Radiobox
                                  label={'要介護'}
                                  value={4}
                                  getUsage={this.setRadioState.bind(this)}
                                  checked={this.state.long_term_care_insurance_judgment === 4}
                                  name={`long_term_care_insurance_judgment`}
                                />
                                <div className={'div-input insurance-required'}>
                                  <InputWithLabelBorder
                                    label=""
                                    type="text"
                                    id={'long_term_care_insurance_required_id'}
                                    getInputText={this.setTextValue.bind(this, "long_term_care_insurance_required")}
                                    diseaseEditData = {this.state.long_term_care_insurance_required}
                                    isDisabled={this.state.long_term_care_insurance_judgment == 0}
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
                            </div>
                          </div>
                          <div className={'flex border-bottom-1px'}>
                            <div className={'summary-label vertical-align'}><div>家族構成</div></div>
                            <div className={'summary-value medical-history'}>
                              <table className="table-scroll table table-bordered" id="code-table">
                                <thead>
                                <tr>
                                  <th style={{width:'6.5rem'}}>続柄</th>
                                  <th style={{width:'3rem'}}>同居</th>
                                  <th style={{width:'4.5rem'}}>状態</th>
                                  <th style={{width:'8rem'}}>名称</th>
                                  <th style={{width:'12rem'}}>備考</th>
                                  <th className='icon-td'/>
                                </tr>
                                </thead>
                                <tbody style={{height:'4rem'}}>
                                {this.state.family_members.map((member, index)=>{
                                  return (
                                    <>
                                      <tr>
                                        <td className={'td-input ime-active'} style={{width:'6.5rem'}}>
                                          <div className='flex' style={{width:'100%'}}>
                                            <SelectorWithLabel
                                              options={this.relation_prefix_option}
                                              title={''}
                                              getSelect={this.setFamilyMember.bind(this, 'relation_prefix:'+index)}
                                              departmentEditCode={member.relation_prefix}
                                            />
                                            <input style={{width: 'calc(3rem - 1px)', height:'2rem'}} type="text" onChange={this.setFamilyMember.bind(this, "relation:"+index)} value = {member.relation}/>
                                          </div>
                                        </td>
                                        <td style={{width:'3rem'}} className='td-check'>
                                          <Checkbox
                                            label=""
                                            getRadio={this.setFamilyCheck.bind(this, index)}
                                            value={member.live_togeter}
                                            checked={member.live_togeter === 1}
                                            name="live_togeter"
                                          />
                                        </td>
                                        <td style={{width:'4.5rem'}} className='td-select'>
                                          <SelectorWithLabel
                                            options={this.live_state_options}
                                            title={''}
                                            getSelect={this.setFamilyMember.bind(this, 'live_state:'+index)}
                                            departmentEditCode={member.live_state}
                                          />
                                        </td>

                                        <td style={{width:'8rem'}} className='ime-active td-input'>
                                          <input style={{width: 'calc(8rem - 1px)', height:'2rem'}} type="text" onChange={this.setFamilyMember.bind(this, "name:"+index)} value = {member.name}/>                                        
                                        </td>                                      
                                        <td className='td-input ime-active' style={{width:'12rem'}}>
                                          <input style={{width: 'calc(12rem - 1px)', height:'2rem'}} type="text" onChange={this.setFamilyMember.bind(this, "comment:"+index)} value = {member.comment}/>                                        
                                        </td>
                                        <td className='icon-td'>
                                          <div className='flex' style={{width:'100%'}}>
                                            <div style={{width:'50%'}}><Icon onClick={this.changeFamilyMembers.bind(this, index, "add")} icon={faPlus} /></div>
                                            <div style={{width:'50%'}}><Icon onClick={this.changeFamilyMembers.bind(this, index, "delete")} icon={faMinusCircle} /></div>
                                          </div>
                                        </td>
                                      </tr>
                                    </>
                                  )}
                                )}
                                </tbody>
                              </table>
                              {/* <div className={'div-input key-person'}>
                              <InputWithLabelBorder
                                label="[キーパーソン]"
                                type="text"
                                id={'key_person_id'}
                                getInputText={this.setTextValue.bind(this, "key_person")}
                                diseaseEditData = {this.state.key_person}
                              />
                            </div>
                            <div className={'key-person select-radio'}>
                              <label className='label-title'>身寄り</label>
                              <Radiobox
                                label={'なし'}
                                value={0}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.no_relatives == 0}
                                name={`no_relatives`}
                              />
                              <Radiobox
                                label={'あり'}
                                value={1}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.no_relatives == 1}
                                name={`no_relatives`}
                              />
                            </div> */}
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
                          <div className={'border-bottom-1px'} style={{width:"100%", textAlign:"center", height:"calc(2rem + 1px)", lineHeight:"calc(2rem + 1px)"}}>看護上の問題</div>
                          <div className={'border-bottom-1px'} style={{width:"100%", height:"calc(8rem + 4px)", overflowY:"auto"}}>
                            <textarea
                              value={this.state.long_term_care_problems}
                              style={{width:"100%", height:"100%"}}
                              id={'long_term_care_problems_id'}
                              onChange={this.setTextValue.bind(this, 'long_term_care_problems')}
                            />
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
                            <div className={'summary-label vertical-align'}><div>麻痺</div></div>
                            <div className={'summary-value flex'}>
                              <div className={'select-radio'}>
                                <div className={'div-title'}>上肢</div>
                                <Radiobox
                                  label={'無'}
                                  value={0}
                                  getUsage={this.setRadioState.bind(this)}
                                  checked={this.state.paralyzed_upper_limbs === 0}
                                  name={`paralyzed_upper_limbs`}
                                />
                                <Radiobox
                                  label={'有'}
                                  value={1}
                                  getUsage={this.setRadioState.bind(this)}
                                  checked={this.state.paralyzed_upper_limbs === 1}
                                  name={`paralyzed_upper_limbs`}
                                />
                                <div className={'div-title emergency-contact flex'}>
                                  <div>（</div>
                                  <div style={{width:"5rem"}}>
                                    <InputWithLabelBorder
                                      label=""
                                      type="text"
                                      id={'paralyzed_upper_limb_site_id'}
                                      getInputText={this.setTextValue.bind(this, "paralyzed_upper_limb_site")}
                                      diseaseEditData = {this.state.paralyzed_upper_limb_site}
                                      isDisabled={this.state.paralyzed_upper_limbs === 0}
                                    />
                                  </div>
                                  <div>）</div>
                                </div>
                              </div>
                              <div className={'select-radio'}>
                                <div className={'div-title'}>下肢</div>
                                <Radiobox
                                  label={'無'}
                                  value={0}
                                  getUsage={this.setRadioState.bind(this)}
                                  checked={this.state.paralyzed_lower_limbs === 0}
                                  name={`paralyzed_lower_limbs`}
                                />
                                <Radiobox
                                  label={'有'}
                                  value={1}
                                  getUsage={this.setRadioState.bind(this)}
                                  checked={this.state.paralyzed_lower_limbs === 1}
                                  name={`paralyzed_lower_limbs`}
                                />
                                <div className={'div-title emergency-contact flex'}>
                                  <div>（</div>
                                  <div style={{width:"5rem"}}>
                                    <InputWithLabelBorder
                                      label=""
                                      type="text"
                                      id={'paralyzed_lower_limb_site_id'}
                                      getInputText={this.setTextValue.bind(this, "paralyzed_lower_limb_site")}
                                      diseaseEditData = {this.state.paralyzed_lower_limb_site}
                                      isDisabled={this.state.paralyzed_lower_limbs === 0}
                                    />
                                  </div>
                                  <div>）</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className={'flex border-bottom-1px'}>
                            <div className={'summary-label text-center l-h-2'}>理解度</div>
                            <div className={'summary-value emergency-contact flex'}>
                              <div style={{width:"20rem"}}>
                                <InputWithLabelBorder
                                  label=""
                                  type="text"
                                  id={'comprehension_id'}
                                  getInputText={this.setTextValue.bind(this, "comprehension")}
                                  diseaseEditData = {this.state.comprehension}
                                />
                              </div>
                            </div>
                          </div>
                          <div className={'flex border-bottom-1px'}>
                            <div className={'summary-label vertical-align'}><div>特記事項</div></div>
                            <div className={'summary-value'} style={{height:"calc(4rem + 2px)", overflowY:"auto"}}>
                              <textarea
                                value={this.state.notices}
                                style={{width:"100%", height:"100%"}}
                                id={'notices_id'}
                                onChange={this.setTextValue.bind(this, 'notices')}
                              />
                            </div>
                          </div>
                          <div className={'flex border-bottom-1px'}>
                            <div className={'summary-label text-center l-h-2'}>主治医</div>
                            <div className={'border-right-1px select-doctor'}>
                              <div style={{width:"14rem"}}>
                                <SelectorWithLabel
                                  options={this.doctor_list}
                                  title={''}
                                  getSelect={this.setSelectValue.bind(this, 'doctor')}
                                  departmentEditCode={this.state.doctor}
                                />
                              </div>
                            </div>
                            <div className={'summary-label text-center l-h-2'} style={{width:"4rem"}}>師長</div>
                            <div className={'select-doctor'}>
                              <div style={{width:"14rem"}}>
                                <SelectorWithLabel
                                  options={this.state.nurse_staff_options}
                                  title={''}
                                  getSelect={this.setSelectValue.bind(this, 'division_teacher')}
                                  departmentEditCode={this.state.division_teacher}
                                />
                              </div>
                            </div>
                          </div>
                          <div className={'flex'}>
                            <div className={'summary-label text-center l-h-2'}>記載者</div>
                            <div style={{cursor:"pointer", width:"calc(100% - 29.5rem)", paddingLeft:"0.3rem", lineHeight:"2rem"}} onClick={this.openStaffList.bind(this)}>
                              {this.state.writer_name}&nbsp;
                            </div>
                            <div className={'text-center l-h-2 border-left-1px'} style={{width:"4rem", marginLeft:"0.5rem"}}>記載日</div>
                            <div className={'select-date'}>
                              <InputWithLabelBorder
                                label=""
                                type="date"
                                getInputText={this.setDateValue.bind(this,"created_at")}
                                diseaseEditData={this.state.created_at}
                                isDisabled = {!this.can_register_old}
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
          </DatePickerBox>
        </Modal.Body>
        <Modal.Footer>
          {/* <div className={'creat-comment'}>
            <InputWithLabel
              type="text"
              label="作成コメント"
              getInputText={this.setTextValue.bind(this, 'create_comment')}
              diseaseEditData={this.state.create_comment}
            />
          </div> */}
          <Button className="cancel-btn" onClick={this.closeThisModal}>閉じる</Button>
          <Button className={"red-btn"} onClick={this.confirmPrint}>印刷</Button>
          {/* <Button className={this.change_flag == 1 ? "red-btn" : 'disable-btn'} onClick={this.registerConfirm.bind(this, 0)}>仮保存</Button> */}
          <Button className={(this.change_flag == 1 && this.can_register) ? "red-btn" : 'disable-btn'} onClick={this.registerConfirm.bind(this, 1)}>確定保存</Button>
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
        {this.state.check_message != "" && (
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
            from_source = {'database'}
          />
        )}
        {this.state.isShowDetailModal && (
          <ShowHistoryDetailModal
            closeModal = {this.closeModal}
            detail_data = {this.state.detail_data}
            food_type_object = {this.state.food_type_object}
            doctor_list = {this.doctor_list}
            nurse_staff_options = {this.state.nurse_staff_options}
          />
        )}
      </Modal>
    );
  }
}

NurseProfileDatabaseModal.contextType = Context;
NurseProfileDatabaseModal.propTypes = {
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,
  closeModal: PropTypes.func,
}
export default NurseProfileDatabaseModal;

