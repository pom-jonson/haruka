import React, {Component} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "~/components/_nano/colors";
import { Modal } from "react-bootstrap";
import Context from "~/helpers/configureStore";
import * as apiClient from "~/api/apiClient";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Button from "~/components/atoms/Button";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import Checkbox from "~/components/molecules/Checkbox";
import SelectMedicineModal from "~/components/templates/Patient/Modals/Common/SelectMedicineModal";
import DiseaseNameModal from "~/components/templates/Patient/Modals/Disease/DiseaseNameModal";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import {formatDateFull, formatDateLine} from "../../../../../helpers/date";
import WardSelectModal from "./WardSelectModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import HarukaSelectMasterModal from "../../../../molecules/HarukaSelectMasterModal";
import { faMinusCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
registerLocale("ja", ja);
import * as karteApi from "~/helpers/cacheKarte-utils";
import {
  ALLERGY_STATUS_ARRAY,
  CACHE_LOCALNAMES,
  CACHE_SESSIONNAMES,
  getEnableChangeMeal,
  getEnableInitMeal
} from "~/helpers/constants";
import { harukaValidate } from "~/helpers/haruka_validate";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from 'jquery';
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import SelectPannelHarukaModal from "~/components/templates/Patient/Modals/Common/SelectPannelHarukaModal";
import Spinner from "react-bootstrap/Spinner";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import {formatTimeIE} from "~/helpers/date";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 15px;
  margin-right: 5px;
`;

const Popup = styled.div`
    font-size : 1rem;
    .flex {display: flex;}
    height: 100%;
    overflow-y:auto;
    h2 {
      color: ${colors.onSurface};
      font-size: 1rem;
      font-weight: 500;
      margin: 6px 0;
    }
    input, .pullbox-select{
        height:1.875rem;
        font-size:1rem!important;
    }
    label{
      font-size:1rem!important;
    }
    .topic-label{
        height: 1.875rem;
        margin-bottom:0px;
        line-height: 1.875rem;
        width:11rem !important;
        // font-size: 0.825rem;
        font-size: 1rem;
        text-align: right;
        padding-right: 0.5rem;
    }
    .content{
        margin-right:1.6rem;
        width:200px;
        border:1px solid;
        padding-left: 0.5rem;
        padding-top: 2px;
    }
    .large-content{
        width: 32rem;
    }
    .case {
      select{
        width: 600px;
      }
    }
    .list-button{
      position: absolute;
      right: 25px;
      top: 45px;
    }
    .head-title{        
        width:11rem;
        // font-size: 0.825rem;
        font-size: 1rem;
        text-align: right;
        padding-right: 0.5rem;
        line-height:1.875rem;
        height: 1.875rem;
    }
    .remove-x-input {
      div {margin:0;}
      .label-title {
        width:0 !important;
        margin:0 !important;
        padding: 0 !important;
      }
      input {
        width:15rem;
      }
    }
    .disease-header{
      .department-status{
        .pullbox-title{
          font-size: 1rem;
        }
      }
      overflow: hidden;
      display:flex;
      margin-bottom:0.25rem;
      button{
          margin-left:3px;
          margin-right:3px;
      }
      .label-title{
          display:none;
      }
      .pullbox-select{
          width:200px;
      }
      .disease-name {
        border:1px solid rgb(206, 212, 218);
        min-width:15rem;
        line-height: 1.875rem;
        padding-left: 0.2rem;
      }
    }    
      
    .label-title {
      float: left;
      text-align: right;
      width: 150px;
      line-height: 1rem;
      &.pullbox-title {
        margin-right: 0.5rem;
      }
    }
    .free-commnet-area{
      div {margin-top:0.5rem;}
        .label-title{
            text-align:right;
            margin-top:0px;
            width:15rem !important;
            padding-right: 0.5rem;
            line-height: 1.875rem;
            margin-bottom: 0px;
        }
        input{
          width: 20rem;
          height: 1.875rem;
        }
    }
    .path-area {
        .label-title{
            text-align:right;
            padding-top:10px;
            width:3rem;
        }
        label{
          margin-bottom:0.25rem;
        }
    }
    .date-area{
        margin-bottom: 0.25rem;
        .hvMNwk{
            margin-top:0px;            
        }
        .label-title{
            // font-size:0.875rem;
            font-size:1rem;
            line-height: 1.875rem;
            height: 1.875rem;
            margin-top: 0px;
            margin-bottom: 0px;
        }
        input{
          width: 10rem;
        }
    }
    .clear-button{
        min-width:1.875rem;
        margin-right:0.5rem;
        height: 1.875rem;
        margin-left: 0.5rem;
        padding:0;
    }
    .pullbox-title{
      // font-size: 0.875rem;
      font-size: 1rem;
    }

    .select-box-area{
        .label-title{
            width: 87px;
            padding-top: 10px;
        }
        .pullbox-select{
            width:150px;
        }
        label{
          margin-bottom: 0.25rem;
        }
        select{
          width: 10rem !important;
        }
    }
    .order-area{
        .label-title{
            width: 80px;
            padding-top: 10px;
            text-align:right;
        }
        .pullbox-select{
            width:200px;
        }
        .hope-hospital-area{
            .label-title{
                display:none;
                width:80px;
                margin-right:30px;
            }
            .pullbox-select{
                margin-left:20px;
            }
            .react-datepicker{
              width: 130% !important;
              font-size: 1.25rem;
              .react-datepicker__month-container{
                width:79% !important;
                height:24.375rem;
              }
              .react-datepicker__navigation--next--with-time{
                right: 6rem;
              }
              .react-datepicker__time-container{
                width:21% !important;
              }
              .react-datepicker__time-box{
                width:auto !important;
              }
              .react-datepicker__current-month{
                font-size: 1.25rem;
              }
              .react-datepicker__day-names, .react-datepicker__week{
                display: flex;
                justify-content: space-between;
              }
              .react-datepicker__month{
                .react-datepicker__week{
                  margin-bottom:0.25rem;
                }
              }
            }
        }
        .free-input-area{
          div {margin:0;}
          .label-title{
              margin: 0;
              width: 11rem;
              font-size:1rem;
              text-align: right;
              padding-top: 0px;    
              padding-right: 0.5rem;
              line-height:1.875rem;
          }
          input{width: 20rem;}
        }
    }
    .right-area.order-area{        
        .label-title{
            width:7rem;
        }
    } 
    
    .meal-area{
        .label-title{
            display:none;
        }    
        .start-time-classification {
          .pullbox-select{
              width:5rem;
          }
        } 
        .food-type {
          .pullbox-select{
              width:15rem;
          }
        } 
        .meal-title-label{
            width:120px;
            text-align:right;
        }
        label {margin-bottom:0;}
    }    
    .selected{
      background: lightblue;
    }

    .clickable{
      cursor:pointer;
      min-height:0.8rem;
    }
    .select-area{
      margin-right:2rem;
    }
    .kinds_content_list{
      border: 1px solid lightgrey;
      height: 5rem;
      overflow-y: auto;
      width:28rem;
      padding: 0.2rem;
    }
    .select-doctor {
        width: 210px;
        .doctor-name {
            width:calc(100% - 20px);
            padding-left:5px;
        }
        .delete-icon {
            cursor:pointer;
        }
    }
    .center {
      text-align: center;
      button {
        height: 1.5rem;
        padding: 0;
        line-height: 1.5rem;
        span {
          color: ${colors.surface};
        }
      }
  
      span {
        color: rgb(241, 86, 124);
      }
  
      .black {
        color: #000;
      }
    }
    .red {
      color: rgb(241, 86, 124);
    }
  .table-area {
    width: 100%;
    margin: auto;
    table {
        margin-bottom:0;
        thead{
          display: table;
          width:calc(100% - 17px);
        }
        tbody{
          height: 11rem;  
          overflow-y:scroll;
          display:block;
        }
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2 !important;}
        tr{
          display: table;
          width: 100%;
          box-sizing: border-box;
        }
        td {
            padding: 0.25rem;
            text-align: left;
        }
        th {
            text-align: center;
            background:#c5d9f1;
            padding: 0.3rem;
        }      
        .tl {
            text-align: left;
        }      
        .tr {
            text-align: right;
        }
        .td-title {
          word-break: break-all;
        }
        .td-datetime {
          width: 10.3rem;
        }
        .td-status {
          width: 10rem;
        }
     }
  }
  .pullbox-title{
    width: 11rem !important;
    margin-right: 0px !important;
    text-align: right;
    font-size: 1rem;
    padding-right: 0.5rem;
    padding-top: 0px !important;
    line-height: 1.875rem;
    height: 1.875rem;
  }
  .label-title{
    width: 11rem !important;
    margin-right: 0px !important;
    font-size: 1rem;
    text-align: right;
    padding-right: 0.5rem;
  }
  .select-style-01{
    .pullbox-title{
      width: 6.7rem !important;
    }
  }
  .select-style-spec{
    .label-title{
      margin-left:2px;
    }
  }
  select{
    height:1.875rem !important;
  }
  input{
    height:1.875rem !important;
  }
  .select-doctor{
    height: 8rem !important;
  }  
  .kinds_content_list{
    input{
      height:15px !important;
    }
  }
  .chk-style-01{
    label{
      margin-bottom: 25px;
      font-size:1rem;
    }
    input{
      height: 15px!important;
      margin-right:5px!important;
      // margin-bottom:2px;
    }
  }
  .hos-date-div{
    input{
      width: 10rem;
    }
    .pullbox-title{
      width: 0px !important;
    }
    .pullbox-label {margin:0;}
  }
  .sub-div {
    div {margin-top:0;}
  }
  .hospital-condition {
    .pullbox-select {
      font-size:1rem;
      height: 1.875rem;
      width: 200px;
    }
  }
`;

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class HospitalApplicationOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load_flag:false,
      isOpenSelectDiseaseModal: false,
      isAddDiseaseNameModal:false,
      openWardModal:false,
      master_data:{
        desired_room_type_master:[],
        estimated_hospitalization_period_master:[],
        path_master:[],
        rest_master:[],
        treatment_plan_master:[],
        discharge_plan_master:[],
        urgency_master:[],
        ward_master:[],
        hospital_room_master:[],
      },
      purpose_array:[],
      department_id: 1,
      confirm_message:"",
      clearConfirmModal:false,
      openSelectDoctorModal: false,
      selected_doctor_list: [],
      alert_title: "",
      alert_messages: "",
      check_message:"",
      ward_name:"",
      room_name:"",
      bed_name:"",
      isOpenSelectItemModal:false,
      saveConfirmModal:false,
      hospitalization_route:0,
      hospitalization_identification:0,
    };
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.drag_type = null;
    this.time_type=[
      {id:0, value:''},
      {id:1, value:'朝食前'},
      {id:2, value:'昼食前'},
      {id:3, value:'夕食前'},
      {id:4, value:'夕食後'},
    ];
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
    this.change_flag = 0;
    this.desired_hospitalization_date = formatDateLine(new Date());
    this.desired_hospitalization_date = new Date(this.desired_hospitalization_date.split('-').join('/')+" 00:00:00");
    this.date_and_time_of_hospitalization = this.desired_hospitalization_date;
    this.meal_implement_edit = false;
    this.can_edit_meal_info = true;
    this.isForUpdate = 0;
    this.can_register = false;
  }

  async getMasterData() {
    let selector_insert={id:0,value:''};
    let path = "/app/api/v2/master/hospitalization/searchMasterData";
    await apiClient
      ._post(path)
      .then((res) => {
        this.master_data = res;
        if(res.path_master.length > 0) {
          res.path_master.map(item=>{
            item.id=item.number;
            item.value=item.name;
          });
          res.path_master.unshift(selector_insert);
        }
        if(res.rest_master.length > 0) {
          res.rest_master.map(item=>{
            item.id=item.number;
            item.value=item.name;
          });
          res.rest_master.unshift(selector_insert);
        }
        if(res.urgency_master.length > 0) {
          res.urgency_master.map(item=>{
            item.id=item.number;
            item.value=item.name;
          });
          res.urgency_master.unshift(selector_insert);
        }
        if(res.estimated_hospitalization_period_master.length > 0) {
          res.estimated_hospitalization_period_master.map(item=>{
            item.id=item.number;
            item.value=item.name;
          });
          res.estimated_hospitalization_period_master.unshift(selector_insert);
        }
        if(res.desired_room_type_master.length > 0) {
          res.desired_room_type_master.map(item=>{
            item.id=item.number;
            item.value=item.name;
          });
          res.desired_room_type_master.unshift(selector_insert);
        }
        if(res.ward_master.length > 0) {
          res.ward_master.map(item=>{
            item.id=item.number;
            item.value=item.name;
          });
        }
        if(res.food_type_master.length > 0) {
          res.food_type_master.map(item=>{
            item.id=item.number;
            item.value=item.name;
          });
          res.food_type_master.unshift(selector_insert);
        }
        if(res.meal_time_classification_master.length > 0) {
          res.meal_time_classification_master.map(item=>{
            item.id=item.number;
            item.value=item.name;
          });
          res.meal_time_classification_master.unshift(selector_insert);
        }
        if(res.nurse_master.length > 0) {
          res.nurse_master.map(item=>{
            item.id=item.number;
            item.value=item.name;
          });
          res.nurse_master.unshift(selector_insert);
        }
        let hospitalization_route = 0;
        if(this.props.type !== "decision") {
          if(res.ward_master.length > 0) {
            res.ward_master.map(item=>{
              item.id=item.number;
              item.value=item.name;
            });
            res.ward_master.unshift(selector_insert);
          }
        } else {
          if(res.hospitalization_route_master.length > 0) {
            res.hospitalization_route_master.map(item=>{
              item.id=item.route_id;
              item.value=item.name;
              if(item.name == "一般入院"){
                hospitalization_route = item.route_id;
              }
            });
          }
          if(res.hospitalization_identification_master.length > 0) {
            res.hospitalization_identification_master.map(item=>{
              item.id=item.identification_id;
              item.value=item.name;
            });
          }
        }
        this.setState({
          master_data:res,
          hospitalization_route
        });
      })
      .catch(() => {
      });
  }

  async componentDidMount(){
    this.meal_implement_edit = this.context.$canDoAction(this.context.FEATURES.MEAL_CHANGE,this.context.AUTHS.MEAL_IMPLEMENT_EDIT);
    if(this.props.type === "decision"){
      this.can_register = this.context.$canDoAction(this.context.FEATURES.HOSPITAL_DECISION, this.context.AUTHS.REGISTER)
          || this.context.$canDoAction(this.context.FEATURES.HOSPITAL_DECISION, this.context.AUTHS.REGISTER_PROXY);
    } else {
      this.can_register = this.context.$canDoAction(this.context.FEATURES.HOSPITAL_APPLY, this.context.AUTHS.REGISTER)
        || this.context.$canDoAction(this.context.FEATURES.HOSPITAL_APPLY, this.context.AUTHS.REGISTER_PROXY);
    }
    await this.getMasterData();
    await this.getHospitalData();
  }

  componentDidUpdate() {
    if(this.props.type == "decision"){
      harukaValidate('karte', 'hospital', 'hospital_decision', this.state, 'background');
    } else {
      harukaValidate('karte', 'hospital', 'hospital_application', this.state, 'background');
    }
  }

  checkValidation = () => {
    let error_str_arr = [];
    let validate_data = null;
    if(this.props.type == "decision"){
      validate_data = harukaValidate('karte', 'hospital', 'hospital_decision', this.state);
    } else {
      validate_data = harukaValidate('karte', 'hospital', 'hospital_application', this.state);
    }
    if (validate_data != null && validate_data.error_str_arr.length > 0) {
      error_str_arr = validate_data.error_str_arr;
    }
    if (validate_data != null && validate_data.first_tag_id != "") {
      this.setState({ first_tag_id: validate_data.first_tag_id });
    }
    return error_str_arr;
  };

  closeValidateAlertModal = () => {
    this.setState({ check_message: "" });
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null) {
      $("#" + first_tag_id).focus();
    }
  };

  async getHospitalData() {
    let cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.IN_HOSPITAL_EDIT);
    let exit_cahce = false;
    if(cache_data !== undefined && cache_data != null) {exit_cahce = true;}
    let infection_list = [];
    let path = "/app/api/v2/hospitalization/searchByPatient";
    let post_data = {
      exit_cahce,
      patient_id:this.props.patientId,
      hospital_type:this.props.type === "decision" ? "in_decision" : "in_apply",
    };
    await apiClient
      ._post(path,{params:post_data})
      .then((res) => {
        if(this.props.type === "decision"){
          if((res.is_carried_out_of_hospitalization !== undefined && res.is_carried_out_of_hospitalization == 1) || (res.not_edit !== undefined)){
            this.setState({
              alert_title:"移動エラー",
              alert_messages:"この患者の最後の移動内容ではないため、変更できません。", //入院中の患者なので、入院決定できません
              alert_action:'close',
              load_flag:true,
            });
            return;
          }
        } else {
          if (res.date_and_time_of_hospitalization != undefined && res.date_and_time_of_hospitalization != null) {
            this.setState({
              alert_title:"移動エラー",
              alert_messages:"この患者の最後の移動内容ではないため、変更できません。", //入院が決まった患者なので、入院申込できません
              alert_action:'close'
            });
            return;
          }
        }
        infection_list = res.infection_list;
        if(!exit_cahce){
          let result = res;
          let doctor_list = result.doctor_list !== undefined ? result.doctor_list: [];
          let main_doctor_id = null;
          let selected_doctor_list = [];
          doctor_list.map(item=>{
            if(item.doctor_flag == 1) {
              main_doctor_id = item.doctor_id;
            } else {
              selected_doctor_list.push(item.doctor_id);
            }
          });
          if(this.props.type == "decision"){
            this.isForUpdate = result.date_and_time_of_hospitalization != undefined && result.date_and_time_of_hospitalization != null ? 1 : 0;
          } else {
            this.isForUpdate = result.desired_hospitalization_date != undefined && result.desired_hospitalization_date != null ? 1 : 0;
          }
          if(this.isForUpdate == 1){this.can_register = true;}
          let date_and_time_of_hospitalization = new Date();
          if(result.date_and_time_of_hospitalization != undefined && result.date_and_time_of_hospitalization != null){
            date_and_time_of_hospitalization = new Date(result.date_and_time_of_hospitalization.split("-").join("/"));
          }
          if(result.desired_hospitalization_date != undefined && result.desired_hospitalization_date != null){
            date_and_time_of_hospitalization = new Date(result.desired_hospitalization_date.split("-").join("/"));
          }
          if(date_and_time_of_hospitalization.getTime() < new Date().getTime()){
            date_and_time_of_hospitalization = new Date();
          }
          let start_date = new Date();
          if(result.start_date != undefined && result.start_date != null){
            start_date = new Date(result.start_date.split("-").join("/"));
          }
          if(start_date.getTime() < this.date_and_time_of_hospitalization.getTime()){
            start_date = new Date();
          }
          let desired_hospitalization_date = new Date();
          if(result.desired_hospitalization_date != undefined && result.desired_hospitalization_date != null){
            desired_hospitalization_date = new Date(result.desired_hospitalization_date.split("-").join("/"));
          }
          if(desired_hospitalization_date.getTime() < this.desired_hospitalization_date.getTime()){
            desired_hospitalization_date = new Date();
          }
          let date_time = formatTimeIE(desired_hospitalization_date);
          let date_hour = parseInt(date_time.split(':')[0]);
          let date_min = parseInt(date_time.split(':')[1]);
          if(date_min > 0){
            date_hour++;
            if(date_hour == 24){
              date_hour = 0;
              desired_hospitalization_date.setDate(desired_hospitalization_date.getDate() + 1);
            }
          }
          desired_hospitalization_date = formatDateLine(desired_hospitalization_date);
          desired_hospitalization_date = new Date(desired_hospitalization_date.split('-').join('/')+" "+(date_hour > 9 ? date_hour : "0"+date_hour)+":00:00");
          let hospitalization_route = this.state.hospitalization_route;
          let start_time_classification = result.start_time_classification != undefined ? result.start_time_classification : 0;
          let check_init_date_classification = {
            start_date: null,
            start_time_classification: null
          };
          //YJ527 入院当日周辺についての「実施直前変更」権限がないユーザーの制限の修正
          //「実施直前変更」権限
          if(!this.meal_implement_edit){
            if(this.props.type !== "decision" || (this.props.type === "decision" && result.hos_number == undefined)){
              check_init_date_classification = getEnableInitMeal(start_date, this.state.master_data.meal_time_classification_master, true, start_time_classification);
            }
            if(this.props.type === "decision" && result.hos_number != undefined){
              let changeMealStatus = getEnableChangeMeal(start_date, this.state.master_data.meal_time_classification_master);
              let isDisableMealSelected = false;
              if (changeMealStatus != "") {
                let meal_status_array = [];
                meal_status_array = changeMealStatus.split(":");
                if (meal_status_array.includes(start_time_classification.toString())) {
                  isDisableMealSelected = true;
                }
              }
              this.can_edit_meal_info = !isDisableMealSelected;
            }
          }
          this.setState({
            disease_id_at_application: result.disease_id_at_application,
            hospitalized_disease_name_id:result.hospitalized_disease_name_id == null ? result.disease_id_at_application : result.hospitalized_disease_name_id,
            disease_name:result.disease_name,
            hospitalization_purpose_comment:result.hospitalization_purpose_comment,
            purpose_array:res.purpose_array !== undefined ? res.purpose_array : [],
            treatment_plan_comments:result.treatment_plan_comments,
            discharge_plan_comment:result.discharge_plan_comment,
            path_id:parseInt(result.path_id),
            surgery_day: result.surgery_day != null && result.surgery_day != "" ?
              new Date(result.surgery_day.split("-").join("/")): null,
            surgery_name:result.surgery_name,
            treatment_day: result.treatment_day != null && result.treatment_day != ""?
              new Date(result.treatment_day.split("-").join("/")):null,
            treatment_name:result.treatment_name,
            inspection_date: result.inspection_date != null && result.inspection_date != ""?
              new Date(result.inspection_date.split("-").join("/")):null,
            inspection_name:result.inspection_name,
            estimated_hospitalization_period_id:result.estimated_hospitalization_period_id,
            urgency_id:result.urgency_id,
            rest_id:result.rest_id,
            desired_room_type_id:result.desired_room_type_id,
            desired_hospitalization_date,
            department_id:result.department_id != null ?result.department_id:(this.context.department.code == 0 ? 1 : this.context.department.code),
            desired_hospitalization_time_category_id:result.desired_hospitalization_time_category_id,
            emergency_admission_comments:result.emergency_admission_comments,
            free_comment:result.free_comment,
            first_ward_id:result.first_ward_id,
            ward_name:result.ward_name,
            hospital_room_id:result.hospital_room_id,
            hospital_bed_id:result.hospital_bed_id,
            room_name:result.room_name,
            bed_name:result.hospital_bed_id == null ? "病床未指定" : result.bed_name,
            second_ward_id:result.second_ward_id,
            bulletin_board_reference_flag:result.bulletin_board_reference_flag,
            food_type_id:result.food_type_id,
            nurse_id_in_charge:result.nurse_id_in_charge,
            deputy_nurse_id:result.deputy_nurse_id,
            hospitalization_route:result.hospitalization_route != null ? result.hospitalization_route : hospitalization_route,
            hospitalization_identification:result.hospitalization_identification != null ? result.hospitalization_identification : 0,
            start_time_classification:check_init_date_classification.start_time_classification != null ? check_init_date_classification.start_time_classification : start_time_classification,
            start_date: check_init_date_classification.start_date != null ? check_init_date_classification.start_date : start_date,
            date_and_time_of_hospitalization,
            selected_doctor_list,
            main_doctor_id,
            infection_list,
            treatment_plan: result.treatment_plan,
            discharge_plan_id: result.discharge_plan_id,
            load_flag:true,
            last_doctor_code:res.last_doctor_code,
            last_doctor_name:res.last_doctor_name,
          });
        }
      });
    if(exit_cahce) {
      let selected_doctor_list = [];
      if(cache_data.doctor_list.length > 0){
        cache_data.doctor_list.map(item=>{
          selected_doctor_list.push(item);
        })
      }
      this.isForUpdate = cache_data.isForUpdate;
      if(this.isForUpdate == 1){this.can_register = true;}
      let desired_hospitalization_date = cache_data.desired_hospitalization_date != null && cache_data.desired_hospitalization_date != "" ?
        new Date(cache_data.desired_hospitalization_date.split("-").join("/")):new Date();
      let date_time = formatTimeIE(desired_hospitalization_date);
      let date_hour = parseInt(date_time.split(':')[0]);
      let date_min = parseInt(date_time.split(':')[1]);
      if(date_min > 0){
        date_hour++;
        if(date_hour == 24){
          date_hour = 0;
          desired_hospitalization_date.setDate(desired_hospitalization_date.getDate() + 1);
        }
      }
      desired_hospitalization_date = formatDateLine(desired_hospitalization_date);
      desired_hospitalization_date = new Date(desired_hospitalization_date.split('-').join('/')+" "+(date_hour > 9 ? date_hour : "0"+date_hour)+":00:00");
      this.setState({
        disease_id_at_application: cache_data.disease_id_at_application,
        hospitalized_disease_name_id:cache_data.hospitalized_disease_name_id,
        disease_name:cache_data.disease_name,
        hospitalization_purpose_comment:cache_data.hospitalization_purpose_comment,
        treatment_plan_comments:cache_data.treatment_plan_comments,
        discharge_plan_comment:cache_data.discharge_plan_comment,
        path_id:parseInt(cache_data.path_id),
        surgery_day: cache_data.surgery_day != null && cache_data.surgery_day != "" ?
          new Date(cache_data.surgery_day.split("-").join("/")): null,
        surgery_name:cache_data.surgery_name,
        treatment_day: cache_data.treatment_day != null && cache_data.treatment_day != ""?
          new Date(cache_data.treatment_day.split("-").join("/")):null,
        treatment_name:cache_data.treatment_name,
        inspection_date: cache_data.inspection_date != null && cache_data.inspection_date != ""?
          new Date(cache_data.inspection_date.split("-").join("/")):null,
        inspection_name:cache_data.inspection_name,
        estimated_hospitalization_period_id:cache_data.estimated_hospitalization_period_id,
        urgency_id:cache_data.urgency_id,
        rest_id:cache_data.rest_id,
        desired_room_type_id:cache_data.desired_room_type_id,
        desired_hospitalization_date,
        department_id:cache_data.department_id,
        department_name:cache_data.department_name,
        desired_hospitalization_time_category_id:cache_data.desired_hospitalization_time_category_id,
        emergency_admission_comments:cache_data.emergency_admission_comments,
        free_comment:cache_data.free_comment,
        first_ward_id:cache_data.first_ward_id,
        ward_name:cache_data.ward_name,
        hospital_room_id:cache_data.hospital_room_id,
        hospital_bed_id:cache_data.hospital_bed_id,
        room_name:cache_data.room_name,
        bed_name:cache_data.bed_name,
        second_ward_id:cache_data.second_ward_id,
        bulletin_board_reference_flag:cache_data.bulletin_board_reference_flag,
        food_type_id:cache_data.food_type_id,
        nurse_id_in_charge:cache_data.nurse_id_in_charge,
        deputy_nurse_id:cache_data.deputy_nurse_id,
        start_time_classification:cache_data.start_time_classification,
        start_date: cache_data.start_date != null ? new Date(cache_data.start_date.split("-").join("/")):new Date(),
        date_and_time_of_hospitalization: cache_data.date_and_time_of_hospitalization != null ? new Date(cache_data.date_and_time_of_hospitalization.split("-").join("/")):new Date(),
        selected_doctor_list,
        main_doctor_id:cache_data.main_doctor_id,
        main_doctor_name:cache_data.main_doctor_name,
        discharge_plan_id: cache_data.discharge_plan_id,
        treatment_plan: cache_data.treatment_plan,
        purpose_array:cache_data.purpose_array,
        hospitalization_route:cache_data.hospitalization_route,
        hospitalization_identification:cache_data.hospitalization_identification,
        infection_list,
        load_flag:true,
        last_doctor_code:cache_data.last_doctor_code,
        last_doctor_name:cache_data.last_doctor_name,
      });
    }
  }

  setSelectorValue = (key,e) => {
    this.change_flag = 1;
    // if(key == "main_doctor_id"){
    //   this.setState({[key]:parseInt(e.target.id),});
    // } else {
    //   this.setState({[key]:parseInt(e.target.id)});
    // }
    if(key === "first_ward_id"){
      this.setState({
        [key]:parseInt(e.target.id),
        ward_name:e.target.value
      });
    } else {
      this.setState({[key]:parseInt(e.target.id)});
    }
    //
  }

  closeModal = () => {
    this.setState({
      isOpenSelectDiseaseModal: false,
      isAddDiseaseNameModal:false,
      openWardModal:false,
      openSelectDoctorModal: false,
      isOpenSelectItemModal: false,
    })
  };

  setDiseaseName =  () => {
    this.setState({
      isOpenSelectDiseaseModal: true,
    });
  };

  registerDisease =  () => {
    this.setState({
      isAddDiseaseNameModal: true,
    });
  };

  selectDiseaseName = (disease_name,disease) =>{
    this.change_flag = 1;
    if(this.props.type == "decision"){
      this.setState({
        disease_name,
        hospitalized_disease_name_id:disease.number,
      });
    } else {
      this.setState({
        disease_name,
        disease_id_at_application:disease.number,
      });
    }
  }

  getRadio=(value, name)=>{
    if (name =='check'){
      let purpose_array = this.state.purpose_array;
      let index = purpose_array.indexOf(value);
      if(index === -1){
        purpose_array.push(value);
      } else {
        purpose_array.splice(index, 1);
      }
      this.change_flag = 1;
      this.setState({purpose_array});
    }
  }

  selectPlanMaster = (item) => {
    this.change_flag = 1;
    if(this.props.type == "decision"){
      this.setState({
        discharge_plan_id:item.number,
      });
    } else {
      this.setState({
        treatment_plan:item.number,
      });
    }
  };

  setTextValue = (key,e) => {
    this.change_flag = 1;
    this.setState({[key]:e.target.value});
  };

  setDateValue = (key,value) => {
    this.change_flag = 1;
    this.setState({[key]:value});
  };

  clearData = (key) => {
    if (this.state[key] == "") return;
    let msg = "";
    if (key == "surgery_name"){
      msg = "手術名の内容をクリアします。よろしいですか？";
    } else if (key == "treatment_name"){
      msg = "治療名の内容をクリアします。よろしいですか？";
    } else if (key == "inspection_name"){
      msg = "検査名の内容をクリアします。よろしいですか？";
    } else if (key == "discharge_plan_id"){
      msg = "退院計画をクリアします。よろしいですか？";
    } else if (key == "treatment_plan"){
      msg = "治療計画をクリアします。よろしいですか？";
    } else if (key == "path_id"){
      msg = "パスをクリアします。よろしいですか？";
    }

    this.change_flag = 1;
    this.setState({
      selected_clear_key:key,
      clearConfirmModal: true,
      confirm_message: msg
    });
  };

  openConfirmModal = () =>{
    if(!this.can_register && this.change_flag == 0){return;}
    let check_flag = true;
    if(this.props.type === "decision"){
      check_flag = this.validateDate('date_and_time_of_hospitalization');
    } else {
      check_flag = this.validateDate('desired_hospitalization_date');
    }
    if (this.state.deputy_nurse_id !== undefined && this.state.deputy_nurse_id != null && this.state.deputy_nurse_id !== '' && this.state.deputy_nurse_id == this.state.nurse_id_in_charge) {
      this.setState({
        alert_messages: '同じ看護師が複数選択されています。',
        alert_title: 'エラー'
      });
      return;
    }
    if(check_flag == false){
      return;
    } else {
      check_flag = this.validateDate('start_date');
    }
    if(check_flag == false){
      return;
    }
    var error = this.checkValidation();
    if (error.length > 0) {
      this.setState({ check_message: error.join("\n") });
      return;
    }

    // 食事の時間帯に対する時刻設定
    if(!this.meal_implement_edit && this.can_edit_meal_info){ //「実施直前変更」権限
      let changeMealStatus = getEnableChangeMeal(this.state.start_date, this.state.master_data.meal_time_classification_master);
      let isDisableMealSelected = false;
      if (changeMealStatus != "") {
        let meal_status_array = [];
        meal_status_array = changeMealStatus.split(":");
        if (meal_status_array.includes(this.state.start_time_classification.toString())) {
          isDisableMealSelected = true;
        }
      }
      if (isDisableMealSelected) {
        let cur_start_date = formatDateLine(this.state.start_date).split('-').join('/');
        let cur_start_time_name = (this.state.master_data.meal_time_classification_master.find((x) => x.id == this.state.start_time_classification) != undefined) ?
          this.state.master_data.meal_time_classification_master.find((x) => x.id == this.state.start_time_classification).value : "";
        let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
        if(cur_start_time_name == "朝" || cur_start_time_name == "夜"){
          let morning_time = "10:15";
          if (init_status != null && init_status != undefined && init_status.morning_time != undefined && init_status.morning_time != null) {
            morning_time = init_status.morning_time;
          }
          this.setState({alert_messages:"前日の"+morning_time+"を過ぎているため、"+cur_start_date+"の"+cur_start_time_name+"食の有無は変更できません。"});
          return;
        }
        if(cur_start_time_name == "昼"){
          let noon_time = "13:45";
          if (init_status != null && init_status != undefined && init_status.noon_time != undefined && init_status.noon_time != null) {
            noon_time = init_status.noon_time;
          }
          this.setState({alert_messages:"前日の"+noon_time+"を過ぎているため、"+cur_start_date+"の"+cur_start_time_name+"食の有無は変更できません。"});
          return;
        }
        if(cur_start_time_name == "夕"){
          let evening_time = "15:45";
          if (init_status != null && init_status != undefined && init_status.evening_time != undefined && init_status.evening_time != null) {
            evening_time = init_status.evening_time;
          }
          this.setState({alert_messages:"前日の"+evening_time+"を過ぎているため、"+cur_start_date+"の"+cur_start_time_name+"食の有無は変更できません。"});
          return;
        }
      }
    }
    this.setState({
      saveConfirmModal:true,
      confirm_message:(this.props.type == "decision" ? "入院決定" : "入院申込")+"情報を登録しますか？"
    });
  };

  saveData=()=>{
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let in_hospital_edit = {
      isForUpdate:this.isForUpdate,
      disease_id_at_application: this.state.disease_id_at_application,
      hospitalized_disease_name_id:this.state.hospitalized_disease_name_id,
      disease_name:this.state.disease_name,
      hospitalization_purpose_comment:this.state.hospitalization_purpose_comment,
      treatment_plan_comments:this.state.treatment_plan_comments,
      discharge_plan_comment: this.state.discharge_plan_comment,
      path_id:this.state.path_id,
      path_name:(this.state.master_data.path_master.find((x) => x.id == this.state.path_id) != undefined) ?
        this.state.master_data.path_master.find((x) => x.id == this.state.path_id).value : "",
      surgery_day:this.state.surgery_day != undefined && this.state.surgery_day != null && this.state.surgery_day != "" ?
        formatDateLine(this.state.surgery_day): null,
      surgery_name:this.state.surgery_name,
      treatment_day:this.state.treatment_day != undefined && this.state.treatment_day != null && this.state.treatment_day != ""?
        formatDateLine(this.state.treatment_day):null,
      treatment_name:this.state.treatment_name,
      inspection_date:this.state.inspection_date != undefined && this.state.inspection_date != null && this.state.inspection_date != ""?
        formatDateLine(this.state.inspection_date):null,
      inspection_name:this.state.inspection_name,
      estimated_hospitalization_period_id:this.state.estimated_hospitalization_period_id,
      estimated_hospitalization_period_name:(this.state.master_data.estimated_hospitalization_period_master.find((x) => x.id == this.state.estimated_hospitalization_period_id) != undefined) ?
        this.state.master_data.estimated_hospitalization_period_master.find((x) => x.id == this.state.estimated_hospitalization_period_id).value : "",
      urgency_id:this.state.urgency_id,
      urgency_name:(this.state.master_data.urgency_master.find((x) => x.id == this.state.urgency_id) != undefined)
        ? this.state.master_data.urgency_master.find((x) => x.id == this.state.urgency_id).value : "",
      rest_id:this.state.rest_id,
      rest_name:(this.state.master_data.rest_master.find((x) => x.id == this.state.rest_id) != undefined)
        ? this.state.master_data.rest_master.find((x) => x.id == this.state.rest_id).value : "",
      desired_room_type_id:this.state.desired_room_type_id,
      desired_room_type_name:(this.state.master_data.desired_room_type_master.find((x) => x.id == this.state.desired_room_type_id) != undefined)
        ? this.state.master_data.desired_room_type_master.find((x) => x.id == this.state.desired_room_type_id).value : "",
      desired_hospitalization_date:this.state.desired_hospitalization_date != undefined && this.state.desired_hospitalization_date != null &&
      this.state.desired_hospitalization_date != "" ? formatDateFull(this.state.desired_hospitalization_date,"-") : null,
      desired_hospitalization_time_category_id:this.state.desired_hospitalization_time_category_id,
      emergency_admission_comments:this.state.emergency_admission_comments,
      bulletin_board_reference_flag:this.state.bulletin_board_reference_flag,
      free_comment:this.state.free_comment,
      deputy_nurse_id:this.state.deputy_nurse_id,
      deputy_nurse_name:this.state.master_data.nurse_master.find((x) => x.id == this.state.deputy_nurse_id) != undefined ?
        this.state.master_data.nurse_master.find((x) => x.id == this.state.deputy_nurse_id).value : "",
      nurse_id_in_charge:this.state.nurse_id_in_charge,
      nurse_id_in_charge_name:this.state.master_data.nurse_master.find((x) => x.id == this.state.nurse_id_in_charge) != undefined ?
        this.state.master_data.nurse_master.find((x) => x.id == this.state.nurse_id_in_charge).value : "",
      doctor_list:this.state.selected_doctor_list,
      main_doctor_id: this.state.main_doctor_id,
      main_doctor_name:this.doctor_list.find((x) => x.id == this.state.main_doctor_id).value,
      purpose_array:this.state.purpose_array,
      treatment_plan: this.state.treatment_plan,
      treatment_plan_name: this.state.master_data.treatment_plan_master.find((x) => x.number == this.state.treatment_plan) != undefined ?
        this.state.master_data.treatment_plan_master.find((x) => x.number == this.state.treatment_plan).name : "",
      discharge_plan_id: this.state.discharge_plan_id,
      discharge_plan_name: this.state.master_data.discharge_plan_master.find((x) => x.number == this.state.discharge_plan_id) != undefined ?
        this.state.master_data.discharge_plan_master.find((x) => x.number == this.state.discharge_plan_id).name : "",
      patient_id:this.props.patientId,
      hospital_type:this.props.type == "decision" ? "in_decision" : "in_apply",
      date_and_time_of_hospitalization:this.props.type == "decision" ? formatDateFull(this.state.date_and_time_of_hospitalization,"-") : null,
      start_date:formatDateLine(this.state.start_date),
      start_time_classification:this.state.start_time_classification,
      start_time_classification_name:(this.state.master_data.meal_time_classification_master.find((x) => x.id == this.state.start_time_classification) != undefined) ?
        this.state.master_data.meal_time_classification_master.find((x) => x.id == this.state.start_time_classification).value : "",
      food_type_id:this.state.food_type_id,
      food_type_name:(this.state.master_data.food_type_master.find((x) => x.id == this.state.food_type_id) != undefined) ?
        this.state.master_data.food_type_master.find((x) => x.id == this.state.food_type_id).value : "",
      first_ward_id:this.state.first_ward_id,
      ward_name:this.state.ward_name,
      room_name:this.state.room_name,
      bed_name:this.state.bed_name,
      hospital_room_id:this.state.hospital_room_id,
      second_ward_id:this.state.second_ward_id,
      second_ward_name:(this.state.master_data.ward_master.find((x) => x.id == this.state.second_ward_id) != undefined) ?
        this.state.master_data.ward_master.find((x) => x.id == this.state.second_ward_id).value : "",
      hospital_bed_id:this.state.hospital_bed_id,
      department_id:this.state.department_id,
      department_name:this.departmentOptions.find((x) => x.id == this.state.department_id).value,
      doctor_code:authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code,
      doctor_name:authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name,
      hospitalization_route:this.state.hospitalization_route,
      route_name:(this.state.master_data.hospitalization_route_master.find((x) => x.id == this.state.hospitalization_route) != undefined) ?
        this.state.master_data.hospitalization_route_master.find((x) => x.id == this.state.hospitalization_route).value : "",
      hospitalization_identification:this.state.hospitalization_identification,
      identification_name:(this.state.master_data.hospitalization_identification_master.find((x) => x.id == this.state.hospitalization_identification) != undefined) ?
        this.state.master_data.hospitalization_identification_master.find((x) => x.id == this.state.hospitalization_identification).value : "",
    };
    if(this.isForUpdate){
      in_hospital_edit.last_doctor_code = this.state.last_doctor_code;
      in_hospital_edit.last_doctor_name = this.state.last_doctor_name;
    }
    let purpose_array_names = [];
    if(this.state.purpose_array.length > 0 && this.state.master_data.hospitalization_purpose_master.length > 0){
      this.state.master_data.hospitalization_purpose_master.map(item=>{
        if(this.state.purpose_array.includes(item.number)){
          purpose_array_names.push(item.name);
        }
      });
    }
    let doctor_list_names = [];
    if(this.state.selected_doctor_list.length > 0){
      this.state.selected_doctor_list.map(doctor_id=>{
        doctor_list_names.push(this.doctor_list.find((x) => x.id == doctor_id).value);
      })
    }
    in_hospital_edit.purpose_array_names = purpose_array_names;
    in_hospital_edit.doctor_list_names = doctor_list_names;
    karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.IN_HOSPITAL_EDIT, JSON.stringify(in_hospital_edit), 'insert');
    this.context.$setExaminationOrderFlag(1);
    this.props.closeModal();
  }

  confirmCancel () {
    this.setState({
      clearConfirmModal:false,
      saveConfirmModal:false,
      confirm_message:"",
      confirm_type: "",
      confirm_alert_title: "",
      alert_title: '',
      alert_messages: ''
    },()=>{
      if (this.state.alert_action == 'close'){
        this.props.closeModal();
      }
    });
  }

  setCheckValue = (name,value) => {
    if(name === "bulletin_check") {
      this.change_flag = 1;
      this.setState({
        bulletin_board_reference_flag:value
      });
    }
  };

  clearConfirmOk =() => {
    this.confirmCancel();
    this.change_flag = 1;
    if(this.state.selected_clear_key == "hospitalization_purpose_comment") {
      if(this.props.type == "decision"){
        this.setState({discharge_plan_id:-1});
      } else {
        this.setState({treatment_plan:-1});
      }
    } else {
      this.setState({
        [this.state.selected_clear_key]: ""
      });
    }
  };

  selectWard = () =>{
    if (this.props.type == "decision") {
      if (this.state.date_and_time_of_hospitalization == undefined || this.state.date_and_time_of_hospitalization == null || this.state.date_and_time_of_hospitalization == '') {
        this.setState({alert_messages: '入院日時を選択してください。'});
        return;
      }
    }
    this.setState({
      openWardModal:true,
    });
  };

  setWard = (ward, room, bed) => {
    this.closeModal();
    this.change_flag = 1;
    this.setState({
      first_ward_id: ward.number,
      ward_name: ward.name,
      hospital_room_id:room.number,
      room_name:room.name,
      bed_name:bed == null ? "病床未指定" : bed.name,
      hospital_bed_id:bed == null ? null : bed.number,
    });
  };

  getDoctor = e => {
    this.closeModal();
    this.selectDoctorFromModal(e.target.id);
  };

  selectDoctorFromModal = (doctor) => {
    this.closeModal();
    let selected_doctor_list = this.state.selected_doctor_list;
    if (!selected_doctor_list.includes(doctor.id)){
      selected_doctor_list.push(doctor.id);
    }
    this.change_flag = 1;
    this.setState({
      selected_doctor_list
    });
  };

  getDoctorName=(id)=>{
    let doctor_name = "";
    let doctor = this.doctor_list.find(x=>x.number==id);
    if(doctor != undefined && doctor != null)
      doctor_name = doctor.name;
    return doctor_name;
  };

  selectDoctor = () => {
    this.setState({openSelectDoctorModal:true});
  };

  removeDoctor=(index)=>{
    let selected_doctor_list = [];
    this.state.selected_doctor_list.map((doctor, key)=>{
      if(index !== key){
        selected_doctor_list.push(doctor);
      }
    });
    this.change_flag = 1;
    this.setState({selected_doctor_list});
  };

  openSelectExamModal=()=>{
    this.setState({isOpenSelectItemModal:true});
  }

  setExamName=(item)=>{
    this.setState({inspection_name:item.name}, ()=>{
      this.closeModal();
    });
  }

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

  validateDate=(key)=>{
    let compare_value = "";
    let key_name = "";
    let date_name = "";
    if(key == "desired_hospitalization_date"){
      compare_value = this.desired_hospitalization_date.getTime();
      key_name = "入院予定日時";
      date_name = "本日";
    }
    if(key == "date_and_time_of_hospitalization"){
      compare_value = this.date_and_time_of_hospitalization.getTime();
      key_name = "入院日時";
      date_name = "本日";
    }
    if(key == "start_date"){
      let compare_key = this.props.type == "decision" ? "date_and_time_of_hospitalization" : "desired_hospitalization_date";
      compare_value = formatDateLine(this.state[compare_key]);
      compare_value = new Date(compare_value.split('-').join('/')+" 00:00:00").getTime();
      key_name = "食事開始日時";
      date_name = "入院日";
    }
    if(this.state[key] == null || (this.state[key] != null && this.state[key].getTime() < compare_value)){
      this.setState({
        confirm_type:"check_date",
        confirm_alert_title:"日付エラー",
        confirm_message:key_name+"は"+date_name+"以降の日付を選択してください。"
      });
      return false;
    } else {
      return true;
    }
  }

  setHospitalizationRoute = (e) => {
    this.change_flag = 1;
    this.setState({hospitalization_route:parseInt(e.target.id)});
  };

  setHospitalizationDdentification = (e) => {
    this.change_flag = 1;
    this.setState({hospitalization_identification:parseInt(e.target.id)});
  };

  render() {
    var {hospitalization_purpose_master, treatment_plan_master, discharge_plan_master,path_master,rest_master,desired_room_type_master,
      estimated_hospitalization_period_master,urgency_master,ward_master,hospital_room_master,
      meal_time_classification_master, food_type_master, nurse_master,hospital_bed_master, hospitalization_route_master, hospitalization_identification_master} = this.state.master_data;
    var { selected_doctor_list, infection_list} = this.state;
    var patientInfo = this.props.patientInfo;
    let plan_master = this.props.type == "decision" ? discharge_plan_master : treatment_plan_master;

    // 食事の時間帯に対する時刻設定
    let changeMealStatus = "";
    if(!this.meal_implement_edit){  //「実施直前変更」権限
      changeMealStatus = getEnableChangeMeal(this.state.start_date, meal_time_classification_master);
    }
    return (
      <>
        <Modal
          show={true}
          id="outpatient"
          className="custom-modal-sm patient-exam-modal disease-name-modal first-view-modal"
        >
          <Modal.Header>
            <Modal.Title style={{width:'20rem'}}>{this.props.type=='decision'?'入院決定':'入院申込情報'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DatePickerBox>
            {this.state.load_flag ? (
              <Popup>
                {this.props.type =='decision' && (
                  <>
                    <div className='patient-info-area'>
                      <div className="flex" style={{marginBottom:'0.25rem'}}>
                        <label className='topic-label'>患者ID</label>
                        <div className='content' style={{width: "9.7rem",height:"1.875rem", marginRight:"0px"}}>{patientInfo.receId}</div>
                        <label className='topic-label' style={{width:"6rem !important"}}>患者氏名</label>
                        <div className='content' style={{width: "17.7rem",height:"1.875rem", marginRight:"0px"}}>{patientInfo.name}</div>
                        <label className='topic-label' style={{width:"5rem !important"}}>性別</label>
                        <div className='content' style={{width: "3.7rem",height:"1.875rem", marginRight:"0px"}}>{patientInfo.sex ==1?'男性':'女性'}</div>
                        <label className='topic-label' style={{width:"5rem !important"}}>年令</label>
                        <div className='content' style={{width: "9.7rem",height:"1.875rem", marginRight:"0px"}}>{patientInfo.age + '歳' + patientInfo.age_month + 'ヶ月'}</div>
                      </div>
                      <div className='flex' style={{marginBottom:'0.25rem'}}>
                        <label className='topic-label'>連絡先</label>
                        <div className='large-content content' style={{height:"1.875rem"}}></div>
                        <label className='topic-label'>電話番号</label>
                        <div className='large-content content' style={{height:"1.875rem"}}></div>
                      </div>
                    </div>
                  </>
                )}
                <div className='flex disease-header'>
                  <div className={'head-title'}>{'入院病名'}</div>
                  <div className={'disease-name'} id={'disease_name_id'}>{this.state.disease_name}</div>
                  <Button type="common" className={'disease-r ml-2'} onClick={this.setDiseaseName.bind(this)}>病名選択</Button>
                  <Button type="common" className={'ml-2'} onClick={this.registerDisease.bind(this)}>病名新規登録</Button>
                </div>

                <div className="flex" style={{marginBottom:'0.25rem'}}>
                  <div className="select-area">
                    <div className={'flex'}>
                      <div className={'head-title'}>{'入院目的'}</div>
                      <div className="kinds_content_list p-1" id="wordList-table">
                        {hospitalization_purpose_master != undefined && hospitalization_purpose_master != null &&
                        hospitalization_purpose_master.length> 0 && hospitalization_purpose_master.map((item) => {
                          return(
                            <>
                              <div>
                                <Checkbox
                                  label={item.name}
                                  getRadio={this.getRadio.bind(this,item.number)}
                                  value={this.state.purpose_array.includes(item.number)}
                                  name="check"
                                />
                              </div>
                            </>
                          )
                        })
                        }
                      </div>
                    </div>
                    <div className='free-commnet-area'>
                      <InputWithLabelBorder
                        label="フリーコメント(25文字まで)"
                        type="text"
                        id='hospitalization_purpose_comment_id'
                        getInputText={this.setTextValue.bind(this,"hospitalization_purpose_comment")}
                        diseaseEditData={this.state.hospitalization_purpose_comment}
                      />
                    </div>
                  </div>
                  <div className="select-area">
                    <div className={'flex'}>
                      <div className={'head-title'}>{`${this.props.type == "decision" ? "退院計画":"治療計画"}`}</div>
                      <div className="kinds_content_list" id="wordList-table">
                        {plan_master != undefined && plan_master != null && plan_master.length > 0 &&
                        plan_master.map((item)=>{
                            return (
                              <>
                                <div
                                  onClick={this.selectPlanMaster.bind(this,item)}
                                  className={(this.props.type != "decision" && this.state.treatment_plan == item.number) ? "selected":((this.props.type == "decision" && this.state.discharge_plan_id == item.number) ? "selected": "")}
                                  style={{cursor:"pointer"}}
                                >
                                  {item.name}
                                </div>
                              </>
                            );
                          }
                        )}
                      </div>
                      {this.props.type == "decision" ? (
                        <Button type="mono" className="clear-button" onClick={this.clearData.bind(this,"discharge_plan_id")}>C</Button>
                      ):(
                        <Button type="mono" className="clear-button" onClick={this.clearData.bind(this,"treatment_plan")}>C</Button>
                      )}

                    </div>
                    <div className='free-commnet-area'>
                      {this.props.type == "decision" ? (
                        <InputWithLabelBorder
                          label="フリーコメント(25文字まで)"
                          type="text"
                          id='discharge_plan_comment_id'
                          getInputText={this.setTextValue.bind(this,"discharge_plan_comment")}
                          diseaseEditData={this.state.discharge_plan_comment}
                        />
                      ):(
                        <InputWithLabelBorder
                          label="フリーコメント(25文字まで)"
                          type="text"
                          id='treatment_plan_comments_id'
                          getInputText={this.setTextValue.bind(this,"treatment_plan_comments")}
                          diseaseEditData={this.state.treatment_plan_comments}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="path-area d-flex" style={{marginTop:"0.25rem"}}>
                  <SelectorWithLabel
                    title="パス"
                    options={path_master}
                    getSelect={this.setSelectorValue.bind(this,"path_id")}
                    departmentEditCode={this.state.path_id}
                  />
                  <Button type="mono" className="clear-button" onClick={this.clearData.bind(this,"path_id")}>C</Button>
                </div>
                <div className="flex date-area">
                  <div className="date topic-label">手術日</div>
                  <DatePicker
                    locale="ja"
                    selected={this.state.surgery_day}
                    onChange={this.setDateValue.bind(this,"surgery_day")}
                    dateFormat="yyyy/MM/dd"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dayClassName = {date => setDateColorClassName(date)}
                  />
                  <div className={'sub-div'}>
                    <InputWithLabelBorder
                      label="手術名"
                      type="text"
                      id='surgery_name_id'
                      getInputText={this.setTextValue.bind(this,"surgery_name")}
                      diseaseEditData={this.state.surgery_name}
                    />
                  </div>
                  <Button type="mono" className="clear-button" onClick={this.clearData.bind(this,"surgery_name")}>C</Button>
                </div>
                <div className="flex date-area">
                  <div className="date topic-label">治療日</div>
                  <DatePicker
                    locale="ja"
                    selected={this.state.treatment_day}
                    onChange={this.setDateValue.bind(this,"treatment_day")}
                    dateFormat="yyyy/MM/dd"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dayClassName = {date => setDateColorClassName(date)}
                  />
                  <div className={'sub-div'}>
                    <InputWithLabelBorder
                      label="治療名"
                      type="text"
                      id='treatment_name_id'
                      getInputText={this.setTextValue.bind(this,"treatment_name")}
                      diseaseEditData={this.state.treatment_name}
                    />
                  </div>
                  <Button type="mono" className="clear-button" onClick={this.clearData.bind(this,"treatment_name")}>C</Button>
                </div>
                {/*<div className="flex date-area">*/}
                {/*<div className="date topic-label">検査日</div>*/}
                {/*<DatePicker*/}
                {/*locale="ja"*/}
                {/*selected={this.state.inspection_date}*/}
                {/*onChange={this.setDateValue.bind(this,"inspection_date")}*/}
                {/*dateFormat="yyyy/MM/dd"*/}
                {/*showMonthDropdown*/}
                {/*showYearDropdown*/}
                {/*dropdownMode="select"*/}
                {/*/>*/}
                {/*<div className={'sub-div'}>*/}
                {/*<InputWithLabelBorder*/}
                {/*label="検査名"*/}
                {/*type="text"*/}
                {/*id='inspection_name_id'*/}
                {/*getInputText={this.setTextValue.bind(this,"inspection_name")}*/}
                {/*diseaseEditData={this.state.inspection_name}*/}
                {/*/>*/}
                {/*</div>*/}
                {/*<Button type="mono" className="clear-button" onClick={this.clearData.bind(this,"inspection_name")}>C</Button>*/}
                {/*<Button type="mono" style={{height:"1.875rem", padding:0}} onClick={this.openSelectExamModal}>検査一覧</Button>*/}
                {/*</div>*/}
                <div className="flex select-box-area">
                  <SelectorWithLabel
                    title="推定入院期間"
                    id='estimated_hospitalization_period_id_id'
                    options={estimated_hospitalization_period_master}
                    getSelect={this.setSelectorValue.bind(this,"estimated_hospitalization_period_id")}
                    departmentEditCode={this.state.estimated_hospitalization_period_id}
                  />
                  <div className="select-style-01">
                    <SelectorWithLabel
                      title="緊急度"
                      options={urgency_master}
                      getSelect={this.setSelectorValue.bind(this,"urgency_id")}
                      departmentEditCode={this.state.urgency_id}
                    />
                  </div>
                  <div className="select-style-01">
                    <SelectorWithLabel
                      title="安静度"
                      options={rest_master}
                      getSelect={this.setSelectorValue.bind(this,"rest_id")}
                      departmentEditCode={this.state.rest_id}
                    />
                  </div>
                  <div className="select-style-01 select-style-spec">
                    <SelectorWithLabel
                      title="希望部屋種"
                      options={desired_room_type_master}
                      getSelect={this.setSelectorValue.bind(this,"desired_room_type_id")}
                      departmentEditCode={this.state.desired_room_type_id}
                    />
                  </div>
                </div>
                <div className="flex">
                  <div className="left-area order-area" style = {{width:'45%', marginRight:'3%'}}>
                    {this.props.type =='decision' ? (
                      <>
                        <div className="flex hope-hospital-area" style={{marginBottom:'0.25rem'}}>
                          <div className="date topic-label">入院日時</div>
                          <DatePicker
                            locale="ja"
                            id='date_and_time_of_hospitalization_id'
                            selected={this.state.date_and_time_of_hospitalization}
                            onChange={this.setDateValue.bind(this,"date_and_time_of_hospitalization")}
                            dateFormat="yyyy/MM/dd HH:mm"
                            timeCaption="時間"
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={10}
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            minDate={this.date_and_time_of_hospitalization}
                            onBlur={this.validateDate.bind(this, 'date_and_time_of_hospitalization')}
                            dayClassName = {date => setDateColorClassName(date)}
                          />
                        </div>
                      </>
                    ):(
                      <>
                        <div className="flex hope-hospital-area" style={{marginBottom:'0.25rem'}}>
                          <div className="date topic-label">入院予定日時</div>
                          <DatePicker
                            locale="ja"
                            id='desired_hospitalization_date_id'
                            selected={this.state.desired_hospitalization_date}
                            onChange={this.setDateValue.bind(this,"desired_hospitalization_date")}
                            dateFormat="yyyy/MM/dd HH:mm"
                            timeCaption="時間"
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={60}
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            minDate={this.desired_hospitalization_date}
                            onBlur={this.validateDate.bind(this, 'desired_hospitalization_date')}
                            dayClassName = {date => setDateColorClassName(date)}
                          />
                          <SelectorWithLabel
                            title=""
                            options={this.time_type}
                            getSelect={this.setSelectorValue.bind(this,"desired_hospitalization_time_category_id")}
                            departmentEditCode={this.state.desired_hospitalization_time_category_id}
                          />
                        </div>
                      </>
                    )}

                    <SelectorWithLabel
                      title="診療科"
                      options={this.departmentOptions}
                      getSelect={this.setSelectorValue.bind(this,"department_id")}
                      departmentEditCode={this.state.department_id}
                    />
                    {this.props.type == "decision" ? (
                      <div className="d-flex" style={{marginBottom:"0.5rem"}}>
                        <label className="topic-label">病棟/病室/病床</label>
                        <div className="remove-x-input" onClick={this.selectWard}>
                          <InputWithLabelBorder
                            type="text"
                            id={this.state.ward_name == null ? 'first_ward_id_id' : 'hospital_room_id_id'}
                            isDisabled={true}
                            diseaseEditData={
                              (this.state.ward_name == null ? '' : this.state.ward_name)+(this.state.room_name == null ? '' : "/"+this.state.room_name)+(this.state.bed_name == null ? '' : "/"+this.state.bed_name)}
                          />
                        </div>
                      </div>
                    ):(
                      <>
                        <SelectorWithLabel
                          title="第1病棟"
                          options={ward_master}
                          id='first_ward_id_id'
                          getSelect={this.setSelectorValue.bind(this,"first_ward_id")}
                          departmentEditCode={this.state.first_ward_id}
                        />
                        <SelectorWithLabel
                          title="第2病棟"
                          options={ward_master}
                          getSelect={this.setSelectorValue.bind(this,"second_ward_id")}
                          departmentEditCode={this.state.second_ward_id}
                        />
                      </>
                    )}
                    <div className='free-input-area'>
                      {this.props.type == "decision" ?(
                        <InputWithLabelBorder
                          label="緊急入院時コメント"
                          type="text"
                          id='emergency_admission_comments_id'
                          getInputText={this.setTextValue.bind(this,"emergency_admission_comments")}
                          diseaseEditData={this.state.emergency_admission_comments}
                        />
                      ):(
                        <InputWithLabelBorder
                          label="フリーコメント"
                          type="text"
                          id='free_comment_id'
                          getInputText={this.setTextValue.bind(this,"free_comment")}
                          diseaseEditData={this.state.free_comment}
                        />
                      )}
                      <div className="chk-style-01" style={{marginLeft:"11rem"}}>
                        <Checkbox
                          label="掲示板参照"
                          getRadio={this.setCheckValue.bind(this)}
                          value={this.state.bulletin_board_reference_flag}
                          name="bulletin_check"
                        />
                      </div>
                    </div>


                  </div>
                  <div className="right-area order-area" style = {{width:'50%'}} >
                    <SelectorWithLabel
                      title="主担当医"
                      id='main_doctor_id_id'
                      options={this.doctor_list}
                      getSelect={this.setSelectorValue.bind(this,"main_doctor_id")}
                      departmentEditCode={this.state.main_doctor_id}
                    />
                    <div className='flex mb-2'>
                      <div className="topic-label">
                        <div className="topic-label">担当医</div>
                        <Button type="common" onClick={this.selectDoctor.bind(this)}>担当医選択</Button>
                      </div>
                      <div className="kinds_content_list select-doctor" id="wordList-table" >
                        {selected_doctor_list != null && selected_doctor_list.length >0 && selected_doctor_list.map((item, index)=>{
                          return (
                            <>
                              <div className={'flex'}>
                                <div className={'doctor-name'}>{this.getDoctorName(item)}</div>
                                <div className={'delete-icon'} onClick={this.removeDoctor.bind(this, index)}><Icon icon={faMinusCircle} /></div>
                              </div>
                            </>
                          )
                        })}
                      </div>
                    </div>
                    <SelectorWithLabel
                      title="担当看護師"
                      options={nurse_master}
                      getSelect={this.setSelectorValue.bind(this,"nurse_id_in_charge")}
                      departmentEditCode={this.state.nurse_id_in_charge}
                    />
                    <SelectorWithLabel
                      title="副担当看護師"
                      options={nurse_master}
                      getSelect={this.setSelectorValue.bind(this,"deputy_nurse_id")}
                      departmentEditCode={this.state.deputy_nurse_id}
                    />
                  </div>
                </div>
                <div className='flex'>
                  <div className='left-area' style={{width:'45%', marginRight:'3%', marginTop:this.props.type == "decision"?"-5rem":"-3rem"}}>
                    <div>患者感染症</div>
                    <div className={'table-area'}>
                      <table className='table-scroll table table-bordered'>
                        <thead>
                        <tr>
                          <th className="td-title">感染症</th>
                          <th className={'td-status'}>状態</th>
                          <th className={'td-datetime'}>検査日</th>
                        </tr>
                        </thead>
                        <tbody>
                        {infection_list !== undefined && infection_list != null && infection_list.length > 0 && infection_list.map(item=>{
                          return (
                            <tr key={item}>
                              <td className={'td-title'}>{item.body_1}</td>
                              <td className={'td-status'}>{ALLERGY_STATUS_ARRAY[parseInt(item.body_2)]}</td>
                              <td className={'td-datetime'}>
                                {item.updated_at.substr(0, 4)}/
                                {item.updated_at.substr(5, 2)}/
                                {item.updated_at.substr(8, 2)}
                                {' '}{item.updated_at.substr(11, 2)}時
                                {item.updated_at.substr(14, 2)}分
                              </td>
                            </tr>
                          )})}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className='right-area meal-area' style={{width:'49%'}}>
                    {this.props.type == "decision" && (
                      <>
                        <div className={'hospital-condition flex'} style={{marginBottom:"0.5rem"}}>
                          <div className='meal-title-label topic-label'>入院経路</div>
                          <SelectorWithLabel
                            title=""
                            options={hospitalization_route_master}
                            getSelect={this.setHospitalizationRoute}
                            departmentEditCode={this.state.hospitalization_route}
                          />
                        </div>
                        <div className={'hospital-condition flex'} style={{marginBottom:"0.5rem"}}>
                          <div className='meal-title-label topic-label'>入院識別</div>
                          <SelectorWithLabel
                            title=""
                            options={hospitalization_identification_master}
                            getSelect={this.setHospitalizationDdentification}
                            departmentEditCode={this.state.hospitalization_identification}
                          />
                        </div>
                      </>
                    )}
                    <div className='flex' style={{marginBottom:"0.5rem"}}>
                      <label className='meal-title-label topic-label'>食事開始日時</label>
                      <DatePicker
                        locale="ja"
                        id='start_date_id'
                        selected={this.state.start_date}
                        onChange={this.setDateValue.bind(this,"start_date")}
                        dateFormat="yyyy/MM/dd"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        minDate={this.props.type == "decision" ? this.state.date_and_time_of_hospitalization : this.state.desired_hospitalization_date}
                        onBlur={this.validateDate.bind(this, 'start_date')}
                        disabled={this.can_edit_meal_info === false}
                        dayClassName = {date => setDateColorClassName(date)}
                      />
                      <div className={'start-time-classification'}>
                        <SelectorWithLabel
                          title=""
                          options={meal_time_classification_master}
                          id='start_time_classification_id'
                          getSelect={this.setSelectorValue.bind(this,"start_time_classification")}
                          departmentEditCode={this.state.start_time_classification}
                          disabledValue={changeMealStatus}
                          isDisabled={this.can_edit_meal_info === false}
                        />
                      </div>
                      <div style={{lineHeight:"1.875rem", marginLeft:"0.5rem"}}>から開始</div>
                    </div>
                    <div className='flex food-type'>
                      <label className='meal-title-label topic-label'>食事</label>
                      <SelectorWithLabel
                        title=""
                        options={food_type_master}
                        id='food_type_id_id'
                        getSelect={this.setSelectorValue.bind(this,"food_type_id")}
                        departmentEditCode={this.state.food_type_id}
                        isDisabled={this.can_edit_meal_info === false}
                      />
                    </div>
                  </div>
                </div>
              </Popup>
            ):(
              <>
                <div style={{width:"100%"}}>
                  <SpinnerWrapper>
                    <Spinner animation="border" variant="secondary" />
                  </SpinnerWrapper>
                </div>
              </>
            )}
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.confirmCloseModal}>キャンセル</Button>
            <Button
              tooltip={this.can_register ? '' : '権限がありません。'}
              className={(this.can_register && this.change_flag == 1) ? 'red-btn' : 'disable-btn'}
              onClick={this.openConfirmModal}
            >確定</Button>
          </Modal.Footer>
          {this.state.isOpenSelectDiseaseModal && (
            <SelectMedicineModal
              closeModal = {this.closeModal}
              system_patient_id={this.props.patientId}
              selectDiseaseName={this.selectDiseaseName}
            />
          )}
          {this.state.isAddDiseaseNameModal && (
            <DiseaseNameModal
              closeModal = {this.closeModal}
              patientId={this.props.patientId}
            />
          )}
          {this.state.clearConfirmModal && (
            <SystemConfirmModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.clearConfirmOk.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.openWardModal && (
            <WardSelectModal
              closeModal={this.closeModal}
              ward_master={ward_master}
              room_master={hospital_room_master}
              hospital_bed_master={hospital_bed_master}
              handleOk={this.setWard}
              MasterName={`病棟・病室選択`}
              hospital_date={this.props.type == "decision" ? this.state.date_and_time_of_hospitalization : null}
              from_modal={'hospital_application'}
            />
          )}
          {this.state.openSelectDoctorModal && (
            <HarukaSelectMasterModal
              selectMaster = {this.selectDoctorFromModal}
              closeModal = {this.closeModal}
              MasterCodeData = {this.doctor_list}
              MasterName = '医師'
            />
          )}
          {this.state.check_message != "" && (
            <ValidateAlertModal
              handleOk={this.closeValidateAlertModal}
              alert_meassage={this.state.check_message}
            />
          )}
          {this.state.isOpenSelectItemModal && (
            <SelectPannelHarukaModal
              selectMaster={this.setExamName}
              closeModal={this.closeModal}
              MasterName= {'検査項目'}
            />
          )}
          {this.state.saveConfirmModal && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.saveData}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.confirm_message !== "" && this.state.confirm_type === "close" && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.props.closeModal}
              confirmTitle= {this.state.confirm_message}
              title = {this.state.confirm_alert_title}
            />
          )}
          {this.state.confirm_message !== "" && this.state.confirm_type === "check_date" && (
            <SystemAlertModal
              hideModal= {this.confirmCancel.bind(this)}
              handleOk= {this.confirmCancel.bind(this)}
              showMedicineContent= {this.state.confirm_message}
              showTitle= {true}
              title = {this.state.confirm_alert_title}
            />
          )}
          {this.state.alert_messages !== "" && (
            <AlertNoFocusModal
              hideModal= {this.confirmCancel.bind(this)}
              handleOk= {this.confirmCancel.bind(this)}
              showMedicineContent= {this.state.alert_messages}
              title={this.state.alert_title}
            />
          )}
        </Modal>
      </>
    );
  }
}
HospitalApplicationOrder.contextType = Context;

HospitalApplicationOrder.propTypes = {
  patientId: PropTypes.number,
  closeModal: PropTypes.func,
  patientInfo: PropTypes.object,
  type:PropTypes.string,

};

export default HospitalApplicationOrder;
