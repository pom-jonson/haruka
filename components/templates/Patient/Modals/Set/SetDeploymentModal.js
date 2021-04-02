import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import {disable, midEmphasis, secondary200, surface} from "~/components/_nano/colors";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import { faPlus, faMinus } from "@fortawesome/pro-solid-svg-icons";
import * as apiClient from "~/api/apiClient";
import {
  ALLERGY_STATUS_ARRAY,
  CACHE_LOCALNAMES,
  getInspectionName,
  getInsuranceName,
  HOSPITALIZE_PRESCRIPTION_TYPE
} from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import {displayLineBreak} from "~/helpers/dialConstants";
import renderHTML from "react-render-html";
import {formatDate4API, formatDateLine, formatJapanDateSlash} from "~/helpers/date";
import * as methods from "~/components/templates/Patient/SOAP/methods";
import * as localApi from "~/helpers/cacheLocal-utils";
import {getStrLength} from "~/helpers/constants";
import RehabilyOrderData from "~/components/templates/Patient/Modals/Rehabilitation/RehabilyOrderData";
import CytologyExamOrderData from "../Examination/CytologyExamOrderData";
import RadiationData from "~/components/templates/Patient/components/RadiationData";
import {formatTimeIE} from "../../../../../helpers/date";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .flex {display: flex;}
  .work-list{
    width: 100%;
    height: 100%;
    justify-content: space-between;
    .area-1 {
      height: 100%;
      margin-right: 3px;
      border: 1px solid #aaa;
    }
  }
`;

const Col = styled.div`
    width: 100%;
    flex-grow: 1;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;

  background-color: ${surface};
  height: 100%;
  overflow-y: auto;
  -ms-overflow-style: auto;
  .tree_open{

  }
  .tree_close{
    display:none;
  }
  nav ul li{
    padding-right: 0 !important;
  }
  li{
    cursor: default;
  }
  li span{
    cursor: pointer;
  }
  nav {
    padding: 4px 0;
    ul {
      padding-left: 0;
      margin-bottom: 8px;
      &:before {
        content: "";
        border-left: 1px solid #ccc;
        display: block;
        width: 0;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
      }

      .selected {
        background: #ddd;
      }
      ul {
        margin-left: 10px;
        position: relative;
        margin-bottom: 0px;

        li {
          padding: 0px 12px;

          &:before {
            content: "";
            border-top: 1px solid #ccc;
            display: block;
            width: 8px;
            height: 0;
            position: absolute;
            top: 10px;
            left: 0;
          }
          &:last-child:before {
            background: #fff;
            height: auto;
            top: 10px;
            bottom: 0;
          }

          ul {
            margin-bottom: 0px;
            li {
              padding: 0px 12px;

              ul {
                margin-bottom: 0px;

                li {
                  padding: 0px 12px;
                }
              }
            }
          }
        }
      }
      li {
        margin: 0;
        padding: 3px 12px;
        text-decoration: none;
        text-transform: uppercase;
        font-size: 0.8125‬rem;
        line-height: 20px;
        position: relative;
      }
    }

    li {
      cursor: pointer;
      list-style-type: none;
    }
  }
`;

const ColOrder = styled.div`
    width: 100%;
    box-sizing: border-box;
    text-align: center;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
    height: 100%;
    overflow-y: auto;
    -ms-overflow-style: auto;

    .hidden {
        visibility: hidden;
    }
  .data-list{
    .table-row:nth-child(2n) {
      background: #f7f7f7 !important;
    }
  }

  .function-region{
    border-bottom: 1px solid #ddd;
    overflow: hidden;
    .function-region-name{
      width: 70%;
      float: left;
      padding: 5px;
      border-right: 1px solid #ddd;      
    }
    .function-region-value{
      width: 30%;
      float: left;
      padding: 5px;      
    }
  }

  textarea {
    width: 100%;
    resize: none;
    height: 50px;
  }

  .order{
    display: block !important;
  }

  .data-title{
    border: 1px solid rgb(213,213,213);
    background: linear-gradient(#d0cfcf, #e6e6e7);
    cursor: pointer;
    label{
      margin-left: 10px;
    }
    .department{
      margin-left: auto;
    }
  }

  .data-item{   
    .flex{
      justify-content: flex-start;
    }
  }

  .line-done {
    color: #0000ff;
  }  
  .tb-soap{
    width: 100%;
    tr{
        border: 1px solid #aaa;
    }
    th{
      background: #f6fcfd; 
      border: 1px solid #aaa;
    }
    td {
        border: 1px solid #aaa;
    }
    textarea{
      background: white;
      color: black;
      height: 25px;
    }
  }
`;

const MedicineListWrapper = styled.div`
  font-size: 0.75rem;
  .row {
    margin: 0;
    &:first-child {
      border-top: 1px solid ${disable};
    }
  }
  .box {
    line-height: 1.3;
    position: relative;
    &:before {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 50px;
    }
    &:after {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      right: 80px;
    }

    .table-row {
      &:nth-child(2n) {
        background-color: ${secondary200};
      }
    }
  }
  .phy-box{
    line-height: 1.3;
    position: relative;
    &:before {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 200px;
    }    

    .text-left{
      .table-item{
        width: 9.375rem;
        float: left;
        text-align: right;
      }
    }
    .text-right{
      .table-item{
        text-align: left;
      }
    }
    .table-row {
      &:nth-child(2n) {
        background-color: ${secondary200};
      }
    }
  }
  .line-through {
    color: #ff0000;
  }
  .flex {
    display: flex;
    margin-bottom: 0;
    &.between {
      justify-content: space-between;
      div {
        margin-right: 0;
      }
    }
    div {
      margin-right: 8px;
    }
    .date {
      margin-left: auto;
      margin-right: 24px;      
    }
    .number {
        margin-right: 8px;
        width: 70px;
    }
  }
  .patient-name {
    margin-left: 16px;
  }
  .drug-item {
    border-bottom: 1px solid ${disable};
    padding: 4px;
  }
  .number {
    margin-right: 8px;
    width: 70px;
  }
  .number .rp{
    text-decoration-line: underline;
  }
  .unit{
    text-align: right;
  }
  .w80 {
    text-align: right;
    width: 5rem;
    margin-left: 8px;
  }
  .option {
    border-bottom: 1px solid ${disable};
    padding: 4px;
  }
  .text-right {
    width: calc(100% - 88px);
  }
  .remarks-comment {
    margin-left: auto;
    width: calc(100% - 80px);
    word-wrap: break-word;
  }
  .order-copy {
    background-color: transparent;
    border: 1px solid #ced4da;
    padding: 0 4px;
    min-width: auto;
    span {
      color: ${midEmphasis};
      font-weight: normal;
      letter-spacing: 0;
    }
  }
  .hidden {
    display: none;
  }
  p {
    margin-bottom: 0;
  }
  .doing {
    background: #ccc !important;

    .table-row {
      &:nth-child(2n) {
        background-color: #ccc;
      }
    }
  }
`;

const underLine = {
  textDecorationLine: "underline"
};

const Icon = styled(FontAwesomeIcon)`
  color: black;
  font-size: 15px;
  margin-right: 5px;
`;

class SetDeploymentModal extends Component {
  constructor(props) {
    super(props);
    this.authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.department_names ={};
    let openOtherDepartmentTree = {};
    openOtherDepartmentTree[0] = false;
    departmentOptions.map(department=>{
      openOtherDepartmentTree[parseInt(department.id)] = false;
      this.department_names[parseInt(department.id)] = department.value;
    });
    Object.entries(methods).forEach(([name, fn]) =>{
      if(name == "getLastPrescription" || name == "getLastInjection") {
        this[name] = fn.bind(this);
      }
    });
    let conf_data = JSON.parse(window.sessionStorage.getItem("init_status")).conf_data;
    this.treat_order_part_position_mode = 0;
    if (conf_data !== undefined && conf_data != null && conf_data.treat_order_part_position_mode !== undefined) {
      this.treat_order_part_position_mode = conf_data.treat_order_part_position_mode;
    }
    this.state = {
      departmentOptions,
      openPatientTree:false,
      openUserTree:false,
      openDepartmentTree:false,
      openCommonTree:false,
      openOtherDepartmentTree,
      selected_key:"",
      alert_messages:"",
      confirm_message:"",
      set_order_data:null,
    }
  }

  async componentDidMount() {
    await this.getSetData();
  }

  getSetData=async()=>{
    let path = "/app/api/v2/set/get_data";
    let post_data = {
      patient_id: this.props.patientId,
      user_number: this.authInfo.user_number,
      department: this.authInfo.department,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          patient_tree:res.patient,
          user_tree:res.user,
          department_tree:res.department,
          common_tree:res.common,
          other_department_tree:res.other_department,
        });
      })
      .catch(() => {

      });
  };

  changeTree=(register_category, act)=>{
    switch (register_category){
      case "patient":
        this.setState({
          openPatientTree:act,
          selected_key:"patient",
          register_category:1,
          register_key:this.props.patientId,
          category_name:null,
          set_order_data:[],
        });
        break;
      case "user_name":
        this.setState({
          openUserTree:act,
          selected_key:"user_name",
          register_category:2,
          register_key:this.authInfo.user_number,
          category_name:null,
          set_order_data:[],
        });
        break;
      case "department":
        this.setState({
          openDepartmentTree:act,
          selected_key:"department",
          register_category:3,
          register_key:this.authInfo.department,
          category_name:null,
          set_order_data:[],
        });
        break;
      case "common":
        this.setState({
          openCommonTree:act,
          selected_key:"common",
          register_category:4,
          register_key:"common",
          category_name:null,
          set_order_data:[],
        });
        break;
    }
    if(register_category.split(':')[0] === "other_department"){
      let openOtherDepartmentTree = this.state.openOtherDepartmentTree;
      let department_id = parseInt(register_category.split(':')[1]);
      openOtherDepartmentTree[department_id] = act;
      this.setState({
        openOtherDepartmentTree,
        selected_key:register_category,
        register_category:3,
        register_key:department_id,
        category_name:null,
        set_order_data:[],
      });
    }
  };

  onAngleClicked = (className, key, item) => {
    let set_ul = document.getElementsByClassName(className)[0].getElementsByClassName("set-ul")[0];
    if(set_ul !== undefined && set_ul != null){
      if(set_ul.style['display'] === "none"){
        set_ul.style['display'] = "block";
      } else {
        set_ul.style['display'] = "none";
      }
    }
    this.setState({
      selected_key:key,
      register_category:item.register_category,
      register_key:item.register_key,
      category_name:item.category_name,
      set_order_data:[],
    });
  };

  selectTree=(key, item)=>{
    this.setState({
      selected_key:key,
      register_category:item.register_category,
      register_key:item.register_key,
      category_name:item.category_name,
      set_name:item.set_name,
      set_order_data:item.order,
    });
  };

  closeModal=(act)=>{
    this.setState({
      alert_messages:"",
      confirm_message:"",
    }, ()=>{
      if(act === "register"){
        this.getSetData();
      }
    });
  };

  confrimDeploy=()=>{
    if (!(this.context.$canDoAction(this.context.FEATURES.SET_DEPLOY, this.context.AUTHS.REGISTER, 0))) {
      this.setState({alert_messages: "権限がありません。"});
      return;
    }
    this.setState({confirm_message:"全文書を展開しますか？"});
  };

  getInsurance = type => {
    let insurance = "既定";
    if (this.props.patientInfo && this.props.patientInfo.insurance_type_list) {
      this.props.patientInfo.insurance_type_list.map(item => {
        if (item.code === parseInt(type)) {
          insurance = item.name;
        }
      });
    }
    return insurance;
  };

  getUnevenValues = (values, unit) => {
    let unevenValues = [];
    values.map(splitNum => {
      if (splitNum.value !== undefined) {
        unevenValues.push(splitNum.label + " " + splitNum.value + unit);
      }
    });
    return unevenValues.join(",");
  };

  deployOrderSet=async()=>{
    if(this.state.set_order_data != null && this.state.set_order_data.length > 0){
      this.state.set_order_data.map(set_order=>{
        let new_order_data = set_order.order_data;
        if((set_order.order_table+"_edit") === CACHE_LOCALNAMES.INSPECTION_EDIT){
          new_order_data['isForUpdate'] = 0;
          new_order_data['number'] = 0;
          new_order_data['order_id'] = 0;
          new_order_data['inspection_DATETIME'] = formatDateLine(new Date());
          new_order_data['doctor_code'] = this.authInfo.staff_category == 1 ? this.authInfo.doctor_code : this.context.selectedDoctor.code;
          new_order_data['doctor_name'] = this.authInfo.staff_category == 1 ? this.authInfo.name : this.context.selectedDoctor.name;
          new_order_data['department_id'] = this.context.department.code == 0 ? 1 : this.context.department.code;
          new_order_data['system_patient_id'] = this.props.patientId;
          new_order_data['patientInfo'] = this.props.patientInfo;
          if(new_order_data['reserve_time'] !== undefined){delete new_order_data['reserve_time'];}
          if(new_order_data['reserve_data'] !== undefined){delete new_order_data['reserve_data'];}
          if(new_order_data['multi_reserve_flag'] !== undefined){delete new_order_data['multi_reserve_flag'];}
          if(new_order_data['done_numbers'] !== undefined){delete new_order_data['done_numbers'];}
          if(new_order_data.start_date !== undefined){delete new_order_data.start_date;}
          if(new_order_data.continue_date !== undefined){delete new_order_data.continue_date;}
          if(new_order_data.end_date !== undefined){delete new_order_data.end_date;}
          karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.INSPECTION_EDIT, new Date().getTime(), JSON.stringify(new_order_data), 'insert');
        }
        if((set_order.order_table+"_edit") === CACHE_LOCALNAMES.TREATMENT_EDIT){
          new_order_data['header']['isForUpdate'] = 0;
          new_order_data['header']['number'] = 0;
          new_order_data['header']['date'] = formatDateLine(new Date());
          new_order_data['header']['doctor_code'] = this.authInfo.staff_category == 1 ? this.authInfo.doctor_code : this.context.selectedDoctor.code;
          new_order_data['header']['doctor_name'] = this.authInfo.staff_category == 1 ? this.authInfo.name : this.context.selectedDoctor.name;
          new_order_data['header']['department_id'] = this.context.department.code == 0 ? 1 : this.context.department.code;
          new_order_data['header']['system_patient_id'] = this.props.patientId;
          new_order_data.detail.map((detail, detail_index)=>{
            if(detail.treat_done_info !== undefined){
              delete new_order_data.detail[detail_index]['treat_done_info'];
            }
            if(detail.done_comment !== undefined){
              delete new_order_data.detail[detail_index]['done_comment'];
            }
          });
          karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.TREATMENT_EDIT, new Date().getTime(), JSON.stringify(new_order_data), 'insert');
        }
        if((set_order.order_table+"_edit") === CACHE_LOCALNAMES.ALLERGY_EDIT){
          new_order_data['number'] = 0;
          new_order_data['isForUpdate'] = 0;
          new_order_data['doctor_code'] = this.authInfo.staff_category == 1 ? this.authInfo.doctor_code : this.context.selectedDoctor.code;
          new_order_data['doctor_name'] = this.authInfo.staff_category == 1 ? this.authInfo.name : this.context.selectedDoctor.name;
          new_order_data['department_id'] = this.context.department.code == 0 ? 1 : this.context.department.code;
          new_order_data['system_patient_id'] = this.props.patientId;
          karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.ALLERGY_EDIT, new Date().getTime(), JSON.stringify(new_order_data), 'insert');
        }
        if((set_order.order_table+"_edit") === CACHE_LOCALNAMES.RADIATION_EDIT){
          new_order_data['number'] = 0;
          new_order_data['isForUpdate'] = 0;
          new_order_data['treat_date'] = formatDateLine(new Date());
          if(new_order_data['reserve_time'] !== undefined){
            delete new_order_data['reserve_time'];
            if(new_order_data['reserve_data'] !== undefined){
              delete new_order_data['reserve_data'];
            }
          }
          new_order_data['doctor_code'] = this.authInfo.staff_category == 1 ? this.authInfo.doctor_code : this.context.selectedDoctor.code;
          new_order_data['doctor_name'] = this.authInfo.staff_category == 1 ? this.authInfo.name : this.context.selectedDoctor.name;
          new_order_data['department_id'] = this.context.department.code == 0 ? 1 : this.context.department.code;
          new_order_data['system_patient_id'] = this.props.patientId;
          karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.RADIATION_EDIT, new Date().getTime(), JSON.stringify(new_order_data), 'insert');
        }
        if((set_order.order_table+"_edit") === CACHE_LOCALNAMES.RIHABILY_EDIT){
          new_order_data['number'] = 0;
          new_order_data['isForUpdate'] = 0;
          new_order_data['treat_date'] = formatDateLine(new Date());
          new_order_data['prescription_date'] = formatDateLine(new Date());
          new_order_data['request_date'] = formatDateLine(new Date());
          new_order_data['request_doctor_number'] = this.authInfo.staff_category == 1 ? this.authInfo.doctor_code : this.context.selectedDoctor.code;
          new_order_data['request_doctor_name'] = this.authInfo.staff_category == 1 ? this.authInfo.name : this.context.selectedDoctor.name;
          new_order_data['prescription_doctor_number'] = this.authInfo.staff_category == 1 ? this.authInfo.doctor_code : this.context.selectedDoctor.code;
          new_order_data['prescription_doctor_name'] = this.authInfo.staff_category == 1 ? this.authInfo.name : this.context.selectedDoctor.name;
          new_order_data['doctor_code'] = this.authInfo.staff_category == 1 ? this.authInfo.doctor_code : this.context.selectedDoctor.code;
          new_order_data['doctor_name'] = this.authInfo.staff_category == 1 ? this.authInfo.name : this.context.selectedDoctor.name;
          new_order_data['department_id'] = this.context.department.code == 0 ? 1 : this.context.department.code;
          new_order_data['system_patient_id'] = this.props.patientId;
          karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.RIHABILY_EDIT, new Date().getTime(), JSON.stringify(new_order_data), 'insert');
        }
        if((set_order.order_table+"_edit") === CACHE_LOCALNAMES.GUIDANCE_EDIT){
          new_order_data['number'] = 0;
          new_order_data['isForUpdate'] = 0;
          new_order_data['treat_date'] = formatDateLine(new Date());
          new_order_data['doctor_code'] = this.authInfo.staff_category == 1 ? this.authInfo.doctor_code : this.context.selectedDoctor.code;
          new_order_data['doctor_name'] = this.authInfo.staff_category == 1 ? this.authInfo.name : this.context.selectedDoctor.name;
          new_order_data['department_id'] = this.context.department.code == 0 ? 1 : this.context.department.code;
          new_order_data['system_patient_id'] = this.props.patientId;
          karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.GUIDANCE_EDIT, new Date().getTime(), JSON.stringify(new_order_data), 'insert')
        }
        if((set_order.order_table+"_edit") === CACHE_LOCALNAMES.EXAM_EDIT || (set_order.order_table+"_edit") === CACHE_LOCALNAMES.CYTOLOGY_EXAM_EDIT || (set_order.order_table+"_edit") === CACHE_LOCALNAMES.PATHOLOGY_EXAM_EDIT || (set_order.order_table+"_edit") === CACHE_LOCALNAMES.BACTERIAL_EXAM_EDIT){
          new_order_data['number'] = 0;
          new_order_data['isForUpdate'] = 0;
          new_order_data['collected_date'] = formatDateLine(new Date());
          new_order_data['doctor_code'] = this.authInfo.staff_category == 1 ? this.authInfo.doctor_code : this.context.selectedDoctor.code;
          new_order_data['doctor_name'] = this.authInfo.staff_category == 1 ? this.authInfo.name : this.context.selectedDoctor.name;
          new_order_data['department_code'] = this.context.department.code == 0 ? 1 : this.context.department.code;
          new_order_data['system_patient_id'] = this.props.patientId;
          karteApi.setVal(this.props.patientId, set_order.order_table+"_edit", JSON.stringify(new_order_data), 'insert');
        }
        if((set_order.order_table+"_edit") === CACHE_LOCALNAMES.SOAP_EDIT){
          let new_soap_data = {};
          new_soap_data['data'] = new_order_data.data;
          new_soap_data['user_number'] = this.authInfo.user_number;
          new_soap_data['system_patient_id'] = this.props.patientId;
          new_soap_data['isForUpdate'] = false;
          new_soap_data['isForSave'] = true;
          new_soap_data['data']['soap_start_at'] = formatDate4API(new Date());
          karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_EDIT, JSON.stringify(new_soap_data), 'insert');
        }
        if((set_order.order_table+"_edit") === CACHE_LOCALNAMES.PRESCRIPTION_EDIT){
          let department_code = this.context.department.code === 0 ? 1 : this.context.department.code;
          let order_data = {};
          order_data['order_data'] = new_order_data;
          let karte_status_code = 1;
          if(this.context.karte_status.code == 1){
            karte_status_code = 3;
          }
          if(this.context.karte_status.code == 2){
            karte_status_code = 2;
          }
          this.getLastPrescription(this.props.patientId, department_code, this.department_names[department_code], karte_status_code, 0, order_data);
        }
        if((set_order.order_table+"_edit") === CACHE_LOCALNAMES.INJECTION_EDIT){
          let department_code = this.context.department.code === 0 ? 1 : this.context.department.code;
          let order_data = {};
          order_data['order_data'] = new_order_data;
          this.getLastInjection(this.props.patientId, department_code, this.department_names[department_code], 0, order_data);
        }
      });
      localApi.setValue("set_deplyment", 1);
      this.props.closeModal();
      this.context.$setExaminationOrderFlag(1);
    }
  };
  
  changeSpaceChar=(text)=>{
    if(text == null || text == ""){return '';}
    text = text.split('');
    let text_length = text.length;
    for(let index = 0; index < text_length; index++){
      if(text[index] == " "){
        if(index == 0){
          text[index] = "&nbsp;";
        } else {
          let change_flag = false;
          for(let prev_index = index - 1; prev_index >= 0; prev_index--){
            if(text[prev_index] == "<"){
              change_flag = true;
              break;
            }
            if(text[prev_index] == ">"){
              text[index] = "&nbsp;";
              change_flag = true;
              break;
            }
          }
          if(!change_flag){
            text[index] = "&nbsp;";
          }
        }
      }
    }
    return text.join('');
  }

  render() {
    return (
      <>
        <Modal show={true} className="custom-modal-sm patient-exam-modal set-modal first-view-modal">
          <Modal.Header><Modal.Title>セット展開</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className="flex work-list mt5">
                <div className="area-1" style={{width:"30%"}}>
                  <Col id="set_tree">
                    <nav>
                      <ul>
                        <li className={this.state.openPatientTree ? "tree_close":""}>
                                                    <span className={this.state.selected_key === "patient" ? "selected":""} onClick={this.changeTree.bind(this, 'patient', true)}>
                                                        <Icon icon={faPlus} />{this.props.patientInfo.name}
                                                    </span>
                        </li>
                        <li className={this.state.openPatientTree ? "":"tree_close"}>
                                                    <span className={this.state.selected_key === "patient" ? "selected":""} onClick={this.changeTree.bind(this, 'patient', false)}>
                                                        <Icon icon={faMinus} />{this.props.patientInfo.name}
                                                    </span>
                          <ul>
                            {this.state.patient_tree !== undefined && (
                              this.state.patient_tree.map(item=>{
                                if(item.category_name == null){//文書
                                  return (
                                    <>
                                      <li>
                                                                                <span className={this.state.selected_key === "patient-0"+'-'+item.number ? "selected":""} onClick={this.selectTree.bind(this, "patient-0"+'-'+item.number, item)}>
                                                                                    {item.set_name}
                                                                                </span>
                                      </li>
                                    </>
                                  )
                                } else {
                                  return (
                                    <>
                                      <li className={"patient-category"+item.number}>
                                                                                <span className={this.state.selected_key === 'patient-'+item.number ? "selected":""} onClick={this.onAngleClicked.bind(this, 'patient-category'+item.number, 'patient-'+item.number, item)}>
                                                                                    {item.category_name}
                                                                                </span>
                                        <ul className={'set-ul'} style={{display:"none"}}>
                                          {item.set_name != null && (
                                            item.set_name.map((set)=>{
                                              return (
                                                <>
                                                  <li>
                                                                                                        <span className={this.state.selected_key === "patient-"+item.number+'-'+set.number ? "selected":""} onClick={this.selectTree.bind(this, "patient-"+item.number+'-'+set.number, set)}>
                                                                                                            {set.set_name}
                                                                                                        </span>
                                                  </li>
                                                </>
                                              )
                                            })
                                          )}
                                        </ul>
                                      </li>
                                    </>
                                  )
                                }
                              })
                            )}
                          </ul>
                        </li>
                        <li className={this.state.openUserTree ? "tree_close":""}>
                                                    <span className={this.state.selected_key === "user_name" ? "selected":""} onClick={this.changeTree.bind(this, 'user_name', true)}>
                                                        <Icon icon={faPlus} />{this.authInfo.name}
                                                    </span>
                        </li>
                        <li className={this.state.openUserTree ? "":"tree_close"}>
                                                    <span className={this.state.selected_key === "user_name" ? "selected":""} onClick={this.changeTree.bind(this, 'user_name', false)}>
                                                        <Icon icon={faMinus} />{this.authInfo.name}
                                                    </span>
                          <ul>
                            {this.state.user_tree !== undefined && (
                              this.state.user_tree.map(item=>{
                                if(item.category_name == null){//文書
                                  return (
                                    <>
                                      <li>
                                                                                <span className={this.state.selected_key === "user-0"+'-'+item.number ? "selected":""} onClick={this.selectTree.bind(this, "user-0"+'-'+item.number, item)}>
                                                                                    {item.set_name}
                                                                                </span>
                                      </li>
                                    </>
                                  )
                                } else {
                                  return (
                                    <>
                                      <li className={"user-category"+item.number}>
                                                                                <span className={this.state.selected_key === 'user-'+item.number ? "selected":""} onClick={this.onAngleClicked.bind(this, 'user-category'+item.number, 'user-'+item.number, item)}>
                                                                                    {item.category_name}
                                                                                </span>
                                        <ul className={'set-ul'} style={{display:"none"}}>
                                          {item.set_name != null && (
                                            item.set_name.map((set)=>{
                                              return (
                                                <>
                                                  <li>
                                                                                                        <span className={this.state.selected_key === "user-"+item.number+'-'+set.number ? "selected":""} onClick={this.selectTree.bind(this, "user-"+item.number+'-'+set.number, set)}>
                                                                                                            {set.set_name}
                                                                                                        </span>
                                                  </li>
                                                </>
                                              )
                                            })
                                          )}
                                        </ul>
                                      </li>
                                    </>
                                  )
                                }
                              })
                            )}
                          </ul>
                        </li>
                        {this.authInfo.department > 0 && (
                          <>
                            <li className={this.state.openDepartmentTree ? "tree_close":""}>
                                                            <span className={this.state.selected_key === "department" ? "selected":""} onClick={this.changeTree.bind(this, 'department', true)}>
                                                                <Icon icon={faPlus} />{this.authInfo.medical_department_name}頻用
                                                            </span>
                            </li>
                            <li className={this.state.openDepartmentTree ? "":"tree_close"}>
                                                            <span className={this.state.selected_key === "department" ? "selected":""} onClick={this.changeTree.bind(this, 'department', false)}>
                                                                <Icon icon={faMinus} />{this.authInfo.medical_department_name}頻用
                                                            </span>
                              <ul>
                                {this.state.department_tree !== undefined && (
                                  this.state.department_tree.map(item=>{
                                    if(item.category_name == null){//文書
                                      return (
                                        <>
                                          <li>
                                                                                <span className={this.state.selected_key === "department-0"+'-'+item.number ? "selected":""} onClick={this.selectTree.bind(this, "department-0"+'-'+item.number, item)}>
                                                                                    {item.set_name}
                                                                                </span>
                                          </li>
                                        </>
                                      )
                                    } else {
                                      return (
                                        <>
                                          <li className={"department-category"+item.number}>
                                                                                <span className={this.state.selected_key === 'department-'+item.number ? "selected":""} onClick={this.onAngleClicked.bind(this, 'department-category'+item.number, 'department-'+item.number, item)}>
                                                                                    {item.category_name}
                                                                                </span>
                                            <ul className={'set-ul'} style={{display:"none"}}>
                                              {item.set_name != null && (
                                                item.set_name.map((set)=>{
                                                  return (
                                                    <>
                                                      <li>
                                                                                                        <span className={this.state.selected_key === "department-"+item.number+'-'+set.number ? "selected":""} onClick={this.selectTree.bind(this, "department-"+item.number+'-'+set.number, set)}>
                                                                                                            {set.set_name}
                                                                                                        </span>
                                                      </li>
                                                    </>
                                                  )
                                                })
                                              )}
                                            </ul>
                                          </li>
                                        </>
                                      )
                                    }
                                  })
                                )}
                              </ul>
                            </li>
                          </>
                        )}
                        <li className={this.state.openCommonTree ? "tree_close":""}>
                                                    <span className={this.state.selected_key === "common" ? "selected":""} onClick={this.changeTree.bind(this, 'common', true)}>
                                                        <Icon icon={faPlus} />共通
                                                    </span>
                        </li>
                        <li className={this.state.openCommonTree ? "":"tree_close"}>
                                                    <span className={this.state.selected_key === "common" ? "selected":""} onClick={this.changeTree.bind(this, 'common', false)}>
                                                        <Icon icon={faMinus} />共通
                                                    </span>
                          <ul>
                            {this.state.common_tree !== undefined && (
                              this.state.common_tree.map(item=>{
                                if(item.category_name == null){//文書
                                  return (
                                    <>
                                      <li>
                                                                                <span className={this.state.selected_key === "common-0"+'-'+item.number ? "selected":""} onClick={this.selectTree.bind(this, "common-0"+'-'+item.number, item)}>
                                                                                    {item.set_name}
                                                                                </span>
                                      </li>
                                    </>
                                  )
                                } else {
                                  return (
                                    <>
                                      <li className={"common-category"+item.number}>
                                                                                <span className={this.state.selected_key === 'common-'+item.number ? "selected":""} onClick={this.onAngleClicked.bind(this, 'common-category'+item.number, 'common-'+item.number, item)}>
                                                                                    {item.category_name}
                                                                                </span>
                                        <ul className={'set-ul'} style={{display:"none"}}>
                                          {item.set_name != null && (
                                            item.set_name.map((set)=>{
                                              return (
                                                <>
                                                  <li>
                                                                                                        <span className={this.state.selected_key === "common-"+item.number+'-'+set.number ? "selected":""} onClick={this.selectTree.bind(this, "common-"+item.number+'-'+set.number, set)}>
                                                                                                            {set.set_name}
                                                                                                        </span>
                                                  </li>
                                                </>
                                              )
                                            })
                                          )}
                                        </ul>
                                      </li>
                                    </>
                                  )
                                }
                              })
                            )}
                          </ul>
                        </li>
                        <li className={this.state.openOtherDepartmentTree[0] ? "tree_close":""}>
                                                    <span className={this.state.selected_key === "other_department:0" ? "selected":""} onClick={this.changeTree.bind(this, 'other_department:0', true)}>
                                                        <Icon icon={faPlus} />他科頻用
                                                    </span>
                        </li>
                        <li className={this.state.openOtherDepartmentTree[0] ? "":"tree_close"}>
                                                    <span className={this.state.selected_key === "other_department:0" ? "selected":""} onClick={this.changeTree.bind(this, 'other_department:0', false)}>
                                                        <Icon icon={faMinus} />他科頻用
                                                    </span>
                          <ul>
                            {this.state.departmentOptions.map(depart=> {
                              if (this.authInfo.department != depart.id) {//文書
                                return (
                                  <>
                                    <li className={this.state.openOtherDepartmentTree[depart.id] ? "tree_close" : ""}>
                                                                            <span
                                                                              className={this.state.selected_key === 'other_department:' + depart.id ? "selected" : ""}
                                                                              onClick={this.changeTree.bind(this, 'other_department:' + depart.id, true)}>
                                                                                <Icon icon={faPlus}/>{depart.value}
                                                                            </span>
                                    </li>
                                    <li className={this.state.openOtherDepartmentTree[depart.id] ? "" : "tree_close"}>
                                                                            <span
                                                                              className={this.state.selected_key === 'other_department:' + depart.id ? "selected" : ""}
                                                                              onClick={this.changeTree.bind(this, 'other_department:' + depart.id, false)}>
                                                                                <Icon icon={faMinus}/>{depart.value}
                                                                            </span>
                                      <ul>
                                        {this.state.other_department_tree !== undefined && this.state.other_department_tree[depart.id] !== undefined && (
                                          this.state.other_department_tree[depart.id].map(item=>{
                                            if(item.category_name == null){//文書
                                              return (
                                                <>
                                                  <li>
                                                                                                        <span className={this.state.selected_key === "other_department-0"+'-'+item.number ? "selected":""} onClick={this.selectTree.bind(this, "other_department-0"+'-'+item.number, item)}>
                                                                                                            {item.set_name}
                                                                                                        </span>
                                                  </li>
                                                </>
                                              )
                                            } else {
                                              return (
                                                <>
                                                  <li className={"other_department-category"+item.number}>
                                                                                                        <span className={this.state.selected_key === "other_department-"+item.number ? "selected":""} onClick={this.onAngleClicked.bind(this, 'other_department-category'+item.number, 'other_department-'+item.number, item)}>
                                                                                                            {item.category_name}
                                                                                                        </span>
                                                    <ul className={'set-ul'} style={{display:"none"}}>
                                                      {item.set_name != null && (
                                                        item.set_name.map((set)=>{
                                                          return (
                                                            <>
                                                              <li>
                                                                                                                                <span className={this.state.selected_key === "other_department-"+item.number+'-'+set.number ? "selected":""} onClick={this.selectTree.bind(this, "other_department-"+item.number+'-'+set.number, set)}>
                                                                                                                                    {set.set_name}
                                                                                                                                </span>
                                                              </li>
                                                            </>
                                                          )
                                                        })
                                                      )}
                                                    </ul>
                                                  </li>
                                                </>
                                              )
                                            }
                                          })
                                        )}
                                      </ul>
                                    </li>
                                  </>
                                )
                              }
                            })}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </Col>
                </div>
                <div className="area-1" style={{width:"68%"}}>
                  <ColOrder>
                    {this.state.set_order_data != null && this.state.set_order_data.length > 0 && (
                      this.state.set_order_data.map(set_order=>{
                        if((set_order.order_table+"_edit") === CACHE_LOCALNAMES.GUIDANCE_EDIT){
                          return (
                            <>
                              <div className="data-list">
                                <div className="data-title">
                                  <div className={`data-item`}>
                                    <div className="flex">
                                      <div className="note">【汎用オーダー】</div>
                                      <div className="department text-right">{this.department_names[set_order.order_data.department_id]}</div>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <MedicineListWrapper>
                                    <div className="open order">
                                      <div className="history-item">
                                        <div className="phy-box w70p" draggable="true">
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">日付</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">
                                              </div>
                                            </div>
                                          </div>
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">カルテ記述名称</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{set_order.order_data.karte_description_name !== undefined ? set_order.order_data.karte_description_name : ''}</div>
                                            </div>
                                          </div>
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">追加指示等</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">
                                                {set_order.order_data.additions !== undefined && Object.keys(set_order.order_data.additions).length > 0 && (
                                                  Object.keys(set_order.order_data.additions).map(addition=>{
                                                    return(
                                                      <>
                                                        <span>{set_order.order_data.additions[addition].name}</span><br />
                                                      </>
                                                    )
                                                  }))}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">カルテ記述内容</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">
                                                {set_order.order_data.karte_text_data !== undefined && set_order.order_data.karte_text_data.length > 0 && (
                                                  set_order.order_data.karte_text_data.map(karte_text=>{
                                                    return(
                                                      <>
                                                        <span>{karte_text.karte_text}</span><br />
                                                      </>
                                                    )
                                                  }))}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">コメント</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{set_order.order_data.comment !== undefined ? set_order.order_data.comment : ""}</div>
                                            </div>
                                          </div>
                                          {set_order.order_data.details !== undefined && set_order.order_data.details.length>0 &&(
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item"> </div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">
                                                  {set_order.order_data.details.map(detail=>{
                                                    return(
                                                      <>
                                                        <span>{detail.item_name}：</span>
                                                        {(detail.value1 !== undefined && detail.value1 != null && detail.value1 !== "") && (
                                                          <>
                                                            {getStrLength(detail.value1) > 32 && (
                                                              <br />
                                                            )}
                                                            <span>{(detail.value1_format !== undefined) ? detail.value1_format : detail.value1}</span><br />
                                                          </>
                                                        )}
                                                        {(detail.value2 !== undefined && detail.value2 != null && detail.value2 !== "") && (
                                                          <>
                                                            {getStrLength(detail.value2) > 32 && (
                                                              <br />
                                                            )}
                                                            <span>{(detail.value2_format !== undefined) ? detail.value2_format : detail.value2}</span><br />
                                                          </>
                                                        )}
                                                      </>
                                                    )
                                                  })}
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </MedicineListWrapper>
                                </div>
                              </div>
                            </>
                          );
                        }
                        if((set_order.order_table+"_edit") === CACHE_LOCALNAMES.INSPECTION_EDIT){
                          return (
                            <>
                              <div className={"data-list"}>
                                <div className="data-title">
                                  <div className={'data-item open'}>
                                    <div className="flex">
                                      <div className="note">【{getInspectionName(set_order.order_data.inspection_id)}】</div>
                                      <div className="department text-right">{this.department_names[set_order.order_data.department_id]}</div>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <MedicineListWrapper>
                                    <div className={'history-item soap-data-item open'}>
                                      <div className="history-item">
                                        <div className="phy-box w70p" draggable="true">
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">検査日</div>
                                            </div>
                                            <div className="text-right">
                                            </div>
                                          </div>
                                          {set_order.order_data.classification1_name !== undefined && set_order.order_data.classification1_name !== "" && (
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">検査種別</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">{set_order.order_data.classification1_name}</div>
                                              </div>
                                            </div>
                                          )}
                                          {set_order.order_data.classification2_name !== undefined && set_order.order_data.classification2_name !== "" && (
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">検査詳細</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">{set_order.order_data.classification2_name}</div>
                                              </div>
                                            </div>
                                          )}
                                          {set_order.order_data.inspection_type_name !== undefined && set_order.order_data.inspection_type_name !== "" && (
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">検査種別</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">{set_order.order_data.inspection_type_name}</div>
                                              </div>
                                            </div>
                                          )}
                                          {set_order.order_data.inspection_item_name !== undefined && set_order.order_data.inspection_item_name !== "" && (
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">検査項目</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">{set_order.order_data.inspection_item_name}</div>
                                              </div>
                                            </div>
                                          )}
                                          {set_order.order_data.endoscope_purpose_name !== undefined && set_order.order_data.endoscope_purpose_name !== "" && (
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">検査目的</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">{set_order.order_data.endoscope_purpose_name}</div>
                                              </div>
                                            </div>
                                          )}
                                          {set_order.order_data.inspection_purpose !== undefined && set_order.order_data.inspection_purpose != null && set_order.order_data.inspection_purpose.length > 0 && (
                                            set_order.order_data.inspection_purpose.map((item, index) =>{
                                              return (
                                                <>
                                                  <div className="flex between drug-item table-row">
                                                    <div className="text-left">
                                                      {index ===0 && (
                                                        <div className="table-item">検査目的</div>
                                                      )}
                                                      {index !==0 && (
                                                        <div className="table-item"></div>
                                                      )}
                                                    </div>
                                                    <div className="text-right">
                                                      <div className="table-item remarks-comment">{item.name}</div>
                                                    </div>
                                                  </div>
                                                </>
                                              )
                                            })
                                          )}
                                          {set_order.order_data.inspection_symptom !== undefined && set_order.order_data.inspection_symptom != null && set_order.order_data.inspection_symptom.length > 0 && (
                                            set_order.order_data.inspection_symptom.map((item, index)=>{
                                              return (
                                                <>
                                                  <div className="flex between drug-item table-row">
                                                    <div className="text-left">
                                                      {index ===0 && (
                                                        <div className="table-item">現症</div>
                                                      )}
                                                      {index !==0 && (
                                                        <div className="table-item"></div>
                                                      )}
                                                    </div>
                                                    <div className="text-right">
                                                      <div className="table-item remarks-comment">{item.name}</div>
                                                    </div>
                                                  </div>
                                                </>
                                              )
                                            })
                                          )}
                                          {set_order.order_data.inspection_risk !== undefined && set_order.order_data.inspection_risk != null && set_order.order_data.inspection_risk.length > 0 && (
                                            set_order.order_data.inspection_risk.map((item, index)=>{
                                              return (
                                                <>
                                                  <div className="flex between drug-item table-row">
                                                    <div className="text-left">
                                                      {index ===0 && (
                                                        <div className="table-item">{item.title}</div>
                                                      )}
                                                      {index !==0 && (
                                                        <div className="table-item"></div>
                                                      )}
                                                    </div>
                                                    <div className="text-right">
                                                      <div className="table-item remarks-comment">{item.name}</div>
                                                    </div>
                                                  </div>
                                                </>
                                              )
                                            })
                                          )}
                                          {set_order.order_data.inspection_sick !== undefined && set_order.order_data.inspection_sick != null && set_order.order_data.inspection_sick.length > 0 && (
                                            set_order.order_data.inspection_sick.map((item, index)=>{
                                              return (
                                                <>
                                                  <div className="flex between drug-item table-row">
                                                    <div className="text-left">
                                                      {index ===0 && (
                                                        <div className="table-item">{item.title}</div>
                                                      )}
                                                      {index !==0 && (
                                                        <div className="table-item"></div>
                                                      )}
                                                    </div>
                                                    <div className="text-right">
                                                      <div className="table-item remarks-comment">{item.name}</div>
                                                    </div>
                                                  </div>
                                                </>
                                              )
                                            })
                                          )}
                                          {set_order.order_data.inspection_request !== undefined && set_order.order_data.inspection_request != null && set_order.order_data.inspection_request.length > 0 && (
                                            set_order.order_data.inspection_request.map((item, index)=>{
                                              return (
                                                <>
                                                  <div className="flex between drug-item table-row">
                                                    <div className="text-left">
                                                      {index ===0 && (
                                                        <div className="table-item">{item.title}</div>
                                                      )}
                                                      {index !==0 && (
                                                        <div className="table-item"></div>
                                                      )}
                                                    </div>
                                                    <div className="text-right">
                                                      <div className="table-item remarks-comment">{item.name}</div>
                                                    </div>
                                                  </div>
                                                </>
                                              )
                                            })
                                          )}
                                          {set_order.order_data.is_anesthesia != undefined && set_order.order_data.is_anesthesia != null && set_order.order_data.is_anesthesia.length > 0 && (
                                            set_order.order_data.is_anesthesia.map((item, index)=>{
                                              return (
                                                <>
                                                  <div className="flex between drug-item table-row">
                                                    <div className="text-left">
                                                      {index ==0 && (
                                                        <div className="table-item">{item.title}</div>
                                                      )}
                                                      {index !=0 && (
                                                        <div className="table-item"></div>
                                                      )}
                                                    </div>
                                                    <div className="text-right">
                                                      <div className="table-item remarks-comment">{item.name}</div>
                                                    </div>
                                                  </div>
                                                </>
                                              )
                                            })
                                          )}
                                          {set_order.order_data.is_sedation != undefined && set_order.order_data.is_sedation != null && set_order.order_data.is_sedation.length > 0 && (
                                            set_order.order_data.is_sedation.map((item, index)=>{
                                              return (
                                                <>
                                                  <div className="flex between drug-item table-row">
                                                    <div className="text-left">
                                                      {index ==0 && (
                                                        <div className="table-item">{item.title}</div>
                                                      )}
                                                      {index !=0 && (
                                                        <div className="table-item"></div>
                                                      )}
                                                    </div>
                                                    <div className="text-right">
                                                      <div className="table-item remarks-comment">{item.name}</div>
                                                    </div>
                                                  </div>
                                                </>
                                              )
                                            })
                                          )}
                                          {set_order.order_data.inspection_movement != undefined && set_order.order_data.inspection_movement != null && set_order.order_data.inspection_movement.length > 0 && (
                                            set_order.order_data.inspection_movement.map((item, index)=>{
                                              return (
                                                <>
                                                  <div className="flex between drug-item table-row">
                                                    <div className="text-left">
                                                      {index ==0 && (
                                                        <div className="table-item">患者移動形態</div>
                                                      )}
                                                      {index !=0 && (
                                                        <div className="table-item"></div>
                                                      )}
                                                    </div>
                                                    <div className="text-right">
                                                      <div className="table-item remarks-comment">{item.name}</div>
                                                    </div>
                                                  </div>
                                                </>
                                              )
                                            })
                                          )}
                                          {set_order.order_data.height !== undefined && set_order.order_data.height != null && set_order.order_data.height != "" && (
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">身長</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">{set_order.order_data.height}cm</div>
                                              </div>
                                            </div>
                                          )}
                                          {set_order.order_data.weight != undefined && set_order.order_data.weight != null && set_order.order_data.weight != "" && (
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">体重</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">{set_order.order_data.weight}kg</div>
                                              </div>
                                            </div>
                                          )}
                                          {set_order.order_data.surface_area != undefined && set_order.order_data.surface_area != null && set_order.order_data.surface_area != "" && (
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">体表面積</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">{set_order.order_data.surface_area}㎡</div>
                                              </div>
                                            </div>
                                          )}
                                          {set_order.order_data.connection_date_title !== undefined && (
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">{set_order.order_data.connection_date_title}</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">{formatJapanDateSlash(set_order.order_data.calculation_start_date)}</div>
                                              </div>
                                            </div>
                                          )}
                                          {set_order.order_data.sick_name != undefined && set_order.order_data.sick_name != null && set_order.order_data.sick_name != "" && (
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">臨床診断、病名</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">{set_order.order_data.sick_name}</div>
                                              </div>
                                            </div>
                                          )}
                                          {set_order.order_data.etc_comment != undefined && set_order.order_data.etc_comment != null && set_order.order_data.etc_comment != "" && (
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">主訴、臨床経過、検査目的、コメント</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">{set_order.order_data.etc_comment}</div>
                                              </div>
                                            </div>
                                          )}
                                          {set_order.order_data.special_presentation != undefined && set_order.order_data.special_presentation != "" && (
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">特殊提示</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">{set_order.order_data.special_presentation}</div>
                                              </div>
                                            </div>
                                          )}
                                          {set_order.order_data.count != undefined && set_order.order_data.count != "" && (
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">{set_order.order_data.count_label !=''?set_order.order_data.count_label:''}</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">{set_order.order_data.count}{set_order.order_data.count_suffix !=''?set_order.order_data.count_suffix:''}</div>
                                              </div>
                                            </div>
                                          )}
                                          {((set_order.order_data.done_body_part !== undefined && set_order.order_data.done_body_part !== "")
                                            || (set_order.order_data.done_body_part === undefined && set_order.order_data.body_part !== undefined && set_order.order_data.body_part !== "")) && (
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">部位指定コメント</div>
                                              </div>
                                              <div className="text-right">
                                                <div className={'table-item remarks-comment'}>
                                                  {set_order.order_data.done_body_part !== undefined ? set_order.order_data.done_body_part : set_order.order_data.body_part}
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                          {set_order.order_data.additions != undefined && Object.keys(set_order.order_data.additions).length > 0 && (
                                            <MedicineListWrapper>
                                              <div className="open order">
                                                <div className="history-item">
                                                  <div className="phy-box w70p" draggable="true">
                                                    <div className="flex between drug-item table-row">
                                                      <div className="text-left">
                                                        <div className="table-item">追加指示等</div>
                                                      </div>
                                                      <div className="text-right">
                                                        <div className="table-item remarks-comment">
                                                          {Object.keys(set_order.order_data.additions).map(addition=>{
                                                            return(
                                                              <>
                                                                <span>{set_order.order_data.additions[addition].name}</span><br />
                                                              </>
                                                            )
                                                          })}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </MedicineListWrapper>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </MedicineListWrapper>
                                </div>
                              </div>
                            </>
                          );
                        }
                        if((set_order.order_table+"_edit") === CACHE_LOCALNAMES.RADIATION_EDIT){
                          return (
                            <>
                              <div className={"data-list"}>
                                <div className="data-title">
                                  <div className={`data-item`}>
                                    <div className="flex">
                                      <div className="note">【放射線】{ set_order.order_data.radiation_name}</div>
                                      <div className="department text-right">{this.department_names[set_order.order_data.department_id]}</div>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <MedicineListWrapper>
                                    <div className="history-item soap-data-item open order">
                                      <RadiationData
                                        data = {set_order.order_data}                                        
                                      />                                      
                                    </div>
                                  </MedicineListWrapper>
                                </div>
                              </div>
                            </>
                          );
                        }
                        if((set_order.order_table+"_edit") === CACHE_LOCALNAMES.TREATMENT_EDIT){
                          return (
                            <>
                              <div className="data-list">
                                <div className="data-title">
                                  <div className={`data-item `}>
                                    <div className="flex">
                                      <div className="note">【{(set_order.general_id === 2) ? "在宅処置" : (set_order.general_id === 3 ? "入院処置" : "外来処置")}】</div>
                                      <div className="department text-right">{this.department_names[set_order.order_data.header.department_id]}</div>
                                    </div>
                                  </div>
                                </div>
                                <MedicineListWrapper>
                                  <div className="open order">
                                    <div className="history-item">
                                      <div className="phy-box w70p" draggable="true">
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">処置日</div>
                                          </div>
                                          <div className="text-right">
                                          </div>
                                        </div>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">保険</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {getInsuranceName(set_order.order_data.header.insurance_name)}
                                            </div>
                                          </div>
                                        </div>
                                        {set_order.order_data.detail.map(item=>{
                                          return (
                                            <>
                                              {item.classification_name != undefined && item.classification_name != "" && (
                                                <div className="flex between drug-item table-row">
                                                  <div className="text-left">
                                                    <div className="table-item">分類</div>
                                                  </div>
                                                  <div className="text-right">
                                                    <div className="table-item remarks-comment">{item.classification_name}</div>
                                                  </div>
                                                </div>
                                              )}
                                              {item.practice_name != undefined && item.practice_name != "" && (
                                                <div className="flex between drug-item table-row">
                                                  <div className="text-left">
                                                    <div className="table-item">行為名</div>
                                                  </div>
                                                  <div className="text-right">
                                                    <div className="table-item remarks-comment d-flex" style={{justifyContent:"space-between"}}>
                                                      <span>{item.practice_name}</span>
                                                      {item.quantity_is_enabled == 1 && item.quantity !== undefined && item.quantity !== "" && (
                                                        <span className="d-flex">
                                                  （<span>{item.quantity}</span>
                                                          {item.unit != null && item.unit !== "" && (
                                                            <span>{item.unit}</span>
                                                          )}）
                                                </span>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              )}
                                              {item.request_name != undefined && item.request_name != "" && (
                                                <div className="flex between drug-item table-row">
                                                  <div className="text-left">
                                                    <div className="table-item">請求情報</div>
                                                  </div>
                                                  <div className="text-right">
                                                    <div className="table-item remarks-comment">{item.request_name}</div>
                                                  </div>
                                                </div>
                                              )}
                                              {this.treat_order_part_position_mode != 0 && item.part_name !== undefined && item.part_name !== "" && (
                                                <div className="flex between drug-item table-row">
                                                  <div className="text-left">
                                                    <div className="table-item">部位</div>
                                                  </div>
                                                  <div className="text-right">
                                                    <div className="table-item remarks-comment">{item.part_name}　{item.position_name !== undefined && item.position_name !== "" ? item.position_name : "" }</div>
                                                  </div>
                                                </div>
                                              )}
                                              {item.side_name != undefined && item.side_name != "" && (
                                                <div className="flex between drug-item table-row">
                                                  <div className="text-left">
                                                    <div className="table-item">左右</div>
                                                  </div>
                                                  <div className="text-right">
                                                    <div className="table-item remarks-comment">{item.side_name}</div>
                                                  </div>
                                                </div>
                                              )}
                                              {item.barcode != undefined && item.barcode != "" && (
                                                <div className="flex between drug-item table-row">
                                                  <div className="text-left">
                                                    <div className="table-item">バーコード</div>
                                                  </div>
                                                  <div className="text-right">
                                                    <div className="table-item remarks-comment">{item.barcode}</div>
                                                  </div>
                                                </div>
                                              )}
                                              {item.surface_data != undefined && item.surface_data.length > 0 && (
                                                <div className="flex between drug-item table-row">
                                                  <div className="text-left">
                                                    <div className="table-item">面積</div>
                                                  </div>
                                                  <div className="text-right">
                                                    <div className="table-item remarks-comment">
                                                      {item.surface_data.length > 0 && item.surface_data.map(sub_item=> {
                                                        return (
                                                          <div key={sub_item}>
                                                            <label>{sub_item.body_part != "" ? sub_item.body_part + "：" : ""}</label>
                                                            <label style={{width: "2.5rem"}}>{sub_item.x_value}cm</label>
                                                            <label className="ml-1 mr-1">×</label>
                                                            <label style={{width: "2.5rem"}}>{sub_item.y_value}cm</label>
                                                            <label className="ml-1 mr-1">=</label>
                                                            <label style={{width: "2.5rem"}}>{sub_item.total_x_y}㎠</label>
                                                          </div>
                                                        )
                                                      })}
                                                      {item.surface_data.length > 1 && (
                                                        <div>合計：{item.total_surface}㎠</div>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              )}
                                              {item.treat_detail_item != undefined && (
                                                <div className="flex between drug-item table-row">
                                                  <div className="text-left">
                                                    <div className="table-item">個別指示</div>
                                                  </div>
                                                  <div className="text-right">
                                                    <div className="table-item remarks-comment">
                                                      {item.treat_detail_item.map(detail=>{
                                                        let oxygen_data = detail['oxygen_data'] !== undefined && detail['oxygen_data'] != null ?
                                                          JSON.parse(detail['oxygen_data']) : null;
                                                        return(
                                                          <>
                                                            <div>
                                                              <label>・{detail.item_name}：</label>
                                                              <label>{detail.count}</label>
                                                              {(detail.unit_name !== '' || (detail.main_unit != null && detail.main_unit !== '')) && (
                                                                <>
                                                                  <label>{detail.unit_name !== '' ? detail.unit_name : detail.main_unit}</label>
                                                                </>
                                                              )}
                                                              <br />
                                                              {detail.lot !== undefined && detail.lot != null && detail.lot !== '' && (
                                                                <>
                                                                  <label>ロット:{detail.lot}</label><br />
                                                                </>
                                                              )}
                                                              {detail.comment !== undefined && detail.comment != null && detail.comment !== '' && (
                                                                <>
                                                                  <label>フリーコメント:{detail.comment}</label><br />
                                                                </>
                                                              )}
                                                            </div>
                                                            <div>
                                                              {oxygen_data != null && oxygen_data.length > 0 && oxygen_data.map((oxygen_item, oxygen_index)=>{
                                                        let oxygen_inhaler_name = oxygen_item.oxygen_inhaler_name !== undefined ? oxygen_item.oxygen_inhaler_name : "";
                                                        if (oxygen_index > 0 && oxygen_data[oxygen_index - 1].oxygen_inhaler_name == oxygen_item.oxygen_inhaler_name) oxygen_inhaler_name = "";
                                                                return (
                                                                  <div key={oxygen_item}>
                                                                    <label>{oxygen_inhaler_name} {formatTimeIE(oxygen_item.start_time)}~{formatTimeIE(oxygen_item.end_time)}</label>
                                                                    {oxygen_item.oxygen_flow !== undefined && oxygen_item.oxygen_flow != "" && (
                                                                      <label className="ml-2">{oxygen_item.oxygen_flow}L/分</label>
                                                                    )}
                                                                    {oxygen_item.fio2_value !== undefined && oxygen_item.fio2_value != "" && (
                                                                      <label className="ml-2">{oxygen_item.fio2_value * 100}%</label>
                                                                    )}
                                                                  </div>
                                                                )
                                                              })}
                                                            </div>
                                                          </>
                                                        )
                                                      })}
                                                    </div>
                                                  </div>
                                                </div>
                                              )}
                                              {item.comment != undefined && item.comment != "" && (
                                                <div className="flex between drug-item table-row">
                                                  <div className="text-left">
                                                    <div className="table-item">コメント</div>
                                                  </div>
                                                  <div className="text-right">
                                                    <div className="table-item remarks-comment">{item.comment}</div>
                                                  </div>
                                                </div>
                                              )}
                                            </>
                                          )
                                        })}
                                        {set_order.order_data.item_details !== undefined && set_order.order_data.item_details.length > 0 && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item"> </div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">
                                                {set_order.order_data.item_details.map(detail=>{
                                                  return(
                                                    <>
                                                      <div><label>{detail.item_name}
                                                        {((detail.value1 != undefined && detail.value1 != null) || (detail.value2 != undefined && detail.value2 != null))? "：": ""}</label>
                                                        {(detail.value1 !== undefined && detail.value1 != null && detail.value1 !== "") && (
                                                          <><label>{(detail.value1_format !== undefined) ? detail.value1_format : detail.value1}{detail.unit_name1 != undefined ? detail.unit_name1 : ""}</label><br /></>
                                                        )}
                                                        {(detail.value2 !== undefined && detail.value2 != null && detail.value2 !== "") && (
                                                          <><label>{(detail.value2_format !== undefined) ? detail.value2_format : detail.value2}{detail.unit_name2 != undefined ? detail.unit_name2 : ""}</label><br /></>
                                                        )}
                                                      </div>
                                                    </>
                                                  )
                                                })}
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                        {set_order.order_data.additions != undefined && Object.keys(set_order.order_data.additions).length > 0 && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">追加指示等</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">
                                                {Object.keys(set_order.order_data.additions).map(addition=>{
                                                  return(
                                                    <>
                                                      <span>{set_order.order_data.additions[addition].name}</span><br />
                                                    </>
                                                  )
                                                })}
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </MedicineListWrapper>
                              </div>
                            </>
                          );
                        }
                        if((set_order.order_table+"_edit") === CACHE_LOCALNAMES.ALLERGY_EDIT){
                          let body1_title = "";
                          let body2_title = "";
                          let alergy_title = "";
                          switch (set_order.order_data.type) {
                            case "past":
                              body1_title = "既往症";
                              body2_title = "アレルギー";
                              alergy_title = "既往歴・アレルギー";
                              break;
                            case "foodalergy":
                              body1_title = "食物アレルギー";
                              alergy_title = "食物アレルギー";
                              break;
                            case "drugalergy":
                              body1_title = "薬剤アレルギー";
                              alergy_title = "薬剤アレルギー";
                              break;
                            case "disabled":
                              body1_title = "障害情報";
                              alergy_title = "障害情報";
                              break;
                            case "vaccine":
                              body1_title = "患者ワクチン情報";
                              alergy_title = "患者ワクチン情報";
                              break;
                            case "adl":
                              body1_title = "ADL情報";
                              alergy_title = "ADL情報";
                              break;
                            case "infection":
                              body1_title = "感染症";
                              body2_title = "状態";
                              alergy_title = "感染症";
                              break;
                            case "alergy":
                              body1_title = "一般アレルギー";
                              body2_title = "状態";
                              alergy_title = "一般アレルギー";
                              break;
                            case "contraindication":
                              body1_title = "禁忌";
                              alergy_title = "禁忌";
                              break;
                            case "process_hospital":
                              body1_title = "主訴";
                              body2_title = "現病歴";
                              alergy_title = "入院までの経過";
                              break;
                            case "inter_summary":
                              body1_title = "臨床経過";
                              alergy_title = "中間サマリー";
                              body2_title = "治療方針";
                              break;
                            case "current_symptoms_on_admission":
                              body1_title = "入院時身体所見";
                              body2_title = "入院時検査所見";
                              alergy_title = "入院時現症";
                              break;
                          }
                          return (
                            <>
                              <div className="data-list">
                                <div className="data-title">
                                  <div className={`data-item`}>
                                    <div className="flex">
                                      <div className="note">【{alergy_title}】</div>
                                      <div className="department text-right">{this.department_names[set_order.order_data.department_id]}</div>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <MedicineListWrapper>
                                    <div className="open order">
                                      <div className="history-item">
                                        <div className="phy-box w70p" draggable="true">
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">{body1_title}</div>
                                            </div>
                                            <div className="text-right">
                                              <div
                                                className="table-item remarks-comment">{displayLineBreak(set_order.order_data.body_1)}</div>
                                            </div>
                                          </div>
                                          {body2_title !== "" && (
                                            <>
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item">{body2_title}</div>
                                                </div>
                                                <div className="text-right">
                                                  <div className="table-item remarks-comment">
                                                    {set_order.order_data.type == "current_symptoms_on_admission" && (
                                                      <>
                                                        {set_order.order_data.optional_json != undefined && set_order.order_data.optional_json['tpha'] != 0 && (
                                                          <span className="mr-2">TPHA：{set_order.order_data.optional_json['tpha'] == 1 ? "(+)": set_order.order_data.optional_json['tpha'] == 2 ? "(-)" : "(±)"}</span>
                                                        )}
                                                        {set_order.order_data.optional_json != undefined && set_order.order_data.optional_json['hbs_ag'] != 0 && (
                                                          <span className="mr-2">HBs-Ag：{set_order.order_data.optional_json['hbs_ag'] == 1 ? "(+)": set_order.order_data.optional_json['hbs_ag'] == 2 ? "(-)" : "(±)"}</span>
                                                        )}
                                                        {set_order.order_data.optional_json != undefined && set_order.order_data.optional_json['hcv_Ab'] != 0 && (
                                                          <span className="mr-2">HCV-Ab：{set_order.order_data.optional_json['hcv_Ab'] == 1 ? "(+)": set_order.order_data.optional_json['hcv_Ab'] == 2 ? "(-)" : "(±)"}</span>
                                                        )}
                                                        {set_order.order_data.optional_json != undefined && set_order.order_data.optional_json['hiv'] != 0 && (
                                                          <span className="mr-2">HIV：{set_order.order_data.optional_json['hiv'] == 1 ? "(+)": set_order.order_data.optional_json['hiv'] == 2 ? "(-)" : "(±)"}</span>
                                                        )}
                                                        <br />
                                                      </>
                                                    )}
                                                    {(set_order.order_data.type === "infection" || set_order.order_data.type === "alergy") ? ALLERGY_STATUS_ARRAY[parseInt(set_order.order_data.body_2)] : displayLineBreak(set_order.order_data.body_2)}
                                                  </div>
                                                </div>
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </MedicineListWrapper>
                                </div>
                              </div>
                            </>
                          );
                        }
                        if((set_order.order_table+"_edit") === CACHE_LOCALNAMES.RIHABILY_EDIT){
                          return (
                            <>
                              <div className="data-list">
                                <div className="data-title">
                                  <div className={`data-item`}>
                                    <div className="flex">
                                      <div className="note">【リハビリ】</div>
                                      <div className="department text-right">{this.department_names[set_order.order_data.department_id]}</div>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <RehabilyOrderData rehabily_data={set_order.order_data} />
                                </div>
                              </div>
                            </>
                          );
                        }
                        if((set_order.order_table+"_edit") === CACHE_LOCALNAMES.SOAP_EDIT){
                          return (
                            <>
                              <div className="data-list">
                                <div className="data-title">
                                  <div className={`data-item`}>
                                    <div className="flex">
                                      <div className="note">【プログレスノート】</div>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <div className={`soap-data-item open`}>
                                    <div>
                                      <table className="tb-soap">
                                        <tr>
                                          <th>#</th>
                                          <td>
                                            <div>{renderHTML(this.changeSpaceChar(set_order.order_data.data.sharp_text))}</div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <th>(S)</th>
                                          <td>
                                            <div>{renderHTML(this.changeSpaceChar(set_order.order_data.data.s_text))}</div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <th>(O)</th>
                                          <td>
                                            <div>{renderHTML(this.changeSpaceChar(set_order.order_data.data.o_text))}</div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <th>(A)</th>
                                          <td>
                                            <div>{renderHTML(this.changeSpaceChar(set_order.order_data.data.a_text))}</div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <th>(P)</th>
                                          <td>
                                            <div>{renderHTML(this.changeSpaceChar(set_order.order_data.data.p_text))}</div>
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          )
                        }
                        if((set_order.order_table+"_edit") === CACHE_LOCALNAMES.EXAM_EDIT
                          || (set_order.order_table+"_edit") === CACHE_LOCALNAMES.CYTOLOGY_EXAM_EDIT
                          || (set_order.order_table+"_edit") === CACHE_LOCALNAMES.PATHOLOGY_EXAM_EDIT
                          || (set_order.order_table+"_edit") === CACHE_LOCALNAMES.BACTERIAL_EXAM_EDIT){
                          return (
                            <>
                              <div className="data-list">
                                <div className="data-title">
                                  <div className={`data-item`}>
                                    <div className="flex">
                                      <div className="note">【検体検査】</div>
                                      <div className="department text-right">{this.department_names[set_order.order_data.department_code]}</div>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <MedicineListWrapper>
                                    <div className={`history-item soap-data-item `}>
                                      <div className="history-item">
                                        <div className="phy-box w70p">
                                          <div className="flex between drug-item table-row">
                                            <div className="text-right">
                                              <div className="table-item">検査日時:</div>
                                              <div className="table-item remarks-comment"></div>
                                            </div>
                                          </div>
                                          <div className="flex between drug-item table-row">
                                            <div className="text-right">
                                              <div className="table-item">検査項目</div>
                                              <div className="table-item remarks-comment"></div>
                                            </div>
                                          </div>
                                          {set_order.order_data.subject != undefined && set_order.order_data.subject != null && set_order.order_data.subject != '' && (
                                            <>
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item">概要</div>
                                                </div>
                                                <div className={`text-right`}>
                                                  <div className="table-item remarks-comment">{set_order.order_data.subject}</div>
                                                </div>
                                              </div>
                                            </>
                                          )}
                                          {set_order.order_data.examinations.map((item, key)=> {
                                            return (
                                              <div key={key} className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item"></div>
                                                </div>
                                                <div className="text-right">
                                                  <div className="table-item remarks-comment">{item.urgent != undefined && item.urgent == 1? "【至急】": ""}{item.name}</div>
                                                </div>
                                              </div>
                                            )
                                          })}
                                          <CytologyExamOrderData cache_data={set_order.order_data}  from_source={"detail-modal"}/>
                                          {set_order.order_data.todayResult === 1 && (
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">当日結果説明</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">あり</div>
                                              </div>
                                            </div>
                                          )}
                                          {set_order.order_data.order_comment !== "" && (
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">依頼コメント:</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">
                                                  {set_order.order_data.order_comment_urgent != undefined && set_order.order_data.order_comment_urgent == 1?"【至急】":""}
                                                  {set_order.order_data.fax_report != undefined && set_order.order_data.fax_report == 1?"【FAX報告】":""}
                                                  {set_order.order_data.order_comment}
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                          {set_order.order_data.free_comment !== "" && (
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item">フリーコメント:</div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">
                                                  {set_order.order_data.free_comment}
                                                </div>
                                              </div>
                                            </div>
                                          )}

                                          {set_order.order_data.additions != undefined && Object.keys(set_order.order_data.additions).length > 0 && (
                                            <>
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item">追加指示等</div>
                                                </div>
                                                <div className="text-right">
                                                  <div className="table-item remarks-comment">
                                                  </div>
                                                </div>
                                              </div>
                                              {Object.keys(set_order.order_data.additions).map(addition=>{
                                                return (

                                                  <div className="flex between drug-item table-row" key={addition}>
                                                    <div className="text-left">
                                                      <div className="table-item">追加指示等</div>
                                                    </div>
                                                    <div className="text-right">
                                                      <div className="table-item remarks-comment">
                                                        {set_order.order_data.additions[addition].name}
                                                      </div>
                                                    </div>
                                                  </div>
                                                )
                                              })}
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </MedicineListWrapper>
                                </div>
                              </div>
                            </>
                          );
                        }
                        if((set_order.order_table+"_edit") === CACHE_LOCALNAMES.PRESCRIPTION_EDIT || (set_order.order_table+"_edit") === CACHE_LOCALNAMES.INJECTION_EDIT){
                          let karte_status_name = "";
                          let category_title = "";
                          if((set_order.order_table+"_edit") === CACHE_LOCALNAMES.INJECTION_EDIT){
                            karte_status_name = set_order.order_data.karte_status == 1 ? "外来・" : set_order.order_data.karte_status == 2 ? "訪問診療・" : "";
                            category_title = karte_status_name + "注射";
                          } else {
                            karte_status_name = set_order.order_data.karte_status == 1 ? "外来・" : set_order.order_data.karte_status == 2 ? "訪問診療・" : set_order.order_data.karte_status == 3 ? "入院・" : "";
                            let prescription_category = set_order.order_data.is_internal_prescription == 0?"院外" : "院内";
                            if(set_order.order_data.karte_status == 3) prescription_category = HOSPITALIZE_PRESCRIPTION_TYPE[set_order.order_data.is_internal_prescription].value
                            category_title = karte_status_name + prescription_category;
                            category_title += '処方';
                          }
                          return (
                            <div className="data-list">
                              <div className="data-title">
                                <div className={`data-item`}>
                                  <div className="flex">
                                    <div className="note">【{category_title}】</div>
                                    <div className="department text-right">{this.department_names[set_order.order_data.department_code]}</div>
                                  </div>
                                </div>
                              </div>
                              <div >
                                <MedicineListWrapper>
                                  <div className={`history-item soap-data-item open order`}>
                                    <div>
                                      {set_order.order_data.order_data.length > 0 && set_order.order_data.order_data.map((item, key)=>{
                                        return (
                                          <div className="history-item" key={key}>
                                            <div className="box w70p">
                                              {(set_order.order_table+"_edit") === CACHE_LOCALNAMES.PRESCRIPTION_EDIT && item.med.length > 0 && item.med.map((medicine_item, medicine_key)=>{
                                                return (
                                                  <div className="drug-item table-row HistoryUl__DrugItem-h3zsie-0 ffNuc" key={medicine_key}>
                                                    <div className="flex between">
                                                      <div className="flex full-width table-item">
                                                        <div className="number" style={underLine}>
                                                          {medicine_key !== 0 ? "" : " Rp" + parseInt(key + 1)}
                                                        </div>

                                                        <div className="ml-3 full-width mr-2">
                                                          {medicine_item.item_name}
                                                          {medicine_item.amount > 0 &&
                                                          medicine_item.uneven_values !== undefined &&
                                                          medicine_item.uneven_values.length > 0 && (
                                                            <p style={{textAlign:"right"}}>
                                                              {this.getUnevenValues(medicine_item.uneven_values, medicine_item.unit)}
                                                            </p>
                                                          )}
                                                          {medicine_item.free_comment
                                                            ? medicine_item.free_comment.map(comment => {
                                                              return (
                                                                <p key={comment.id} style={{textAlign:"right"}}>
                                                                  {comment}
                                                                </p>
                                                              );
                                                            })
                                                            : ""}
                                                        </div>
                                                      </div>
                                                      <div className="w80 table-item" style={{textAlign:"right"}}>
                                                        {" "}
                                                        {medicine_item.amount}
                                                        {medicine_item.unit}
                                                      </div>
                                                    </div>
                                                  </div>
                                                )
                                              })}
                                              {(set_order.order_table+"_edit") === CACHE_LOCALNAMES.PRESCRIPTION_EDIT && (
                                                <div className="flex between drug-item table-row">
                                                  <div className="text-right">
                                                    <div className="table-item">
                                                      {!item.usage_name ? "" : `'用法:'} ${item.usage_name}`}
                                                    </div>
                                                  </div>
                                                  <div className="w80 table-item">
                                                    {item.days !== 0 && item.days !== undefined
                                                      ? item.days +
                                                      (item.days_suffix !== undefined && item.days_suffix !== ""
                                                        ? item.days_suffix
                                                        : "日分")
                                                      : ""}
                                                  </div>
                                                </div>
                                              )}
                                              {(set_order.order_table+"_edit") === CACHE_LOCALNAMES.INJECTION_EDIT && (
                                                <div className="flex between drug-item table-row">
                                                  <div className="number" style={underLine}>
                                                    {" Rp" + parseInt(key + 1)}
                                                  </div>
                                                  <div className="text-right">
                                                    <div className="table-item">
                                                      {!item.usage_name ? "" : `'手技:'} ${item.usage_name}`}
                                                    </div>
                                                    {item.usage_remarks_comment && (
                                                      <div className="table-item remarks-comment">
                                                        {item.usage_remarks_comment.map((comment, ci) => {
                                                          return <p key={ci}>{comment}</p>;
                                                        })}
                                                      </div>
                                                    )}
                                                  </div>
                                                  <div className="w80 table-item">
                                                    {item.days !== 0 && item.days !== undefined
                                                      ? item.days +
                                                      (item.days_suffix !== undefined && item.days_suffix !== ""
                                                        ? item.days_suffix
                                                        : "日分")
                                                      : ""}
                                                  </div>
                                                </div>
                                              )}
                                              {(set_order.order_table+"_edit") === CACHE_LOCALNAMES.INJECTION_EDIT && item.med.length > 0 && item.med.map((medicine_item, medicine_key)=>{
                                                return (
                                                  <div className="drug-item table-row HistoryUl__DrugItem-h3zsie-0 ffNuc" key={medicine_key}>
                                                    <div className="flex between">
                                                      <div className="flex full-width table-item">
                                                        <div className="number">
                                                        </div>

                                                        <div className="ml-3 full-width mr-2">
                                                          {medicine_item.item_name}
                                                          {medicine_item.amount > 0 &&
                                                          medicine_item.uneven_values !== undefined &&
                                                          medicine_item.uneven_values.length > 0 && (
                                                            <p style={{textAlign:"right"}}>
                                                              {this.getUnevenValues(medicine_item.uneven_values, medicine_item.unit)}
                                                            </p>
                                                          )}
                                                          {medicine_item.free_comment
                                                            ? medicine_item.free_comment.map(comment => {
                                                              return (
                                                                <p key={comment.id} style={{textAlign:"right"}}>
                                                                  {comment}
                                                                </p>
                                                              );
                                                            })
                                                            : ""}
                                                        </div>
                                                      </div>
                                                      <div className="w80 table-item" style={{textAlign:"right"}}>
                                                        {" "}
                                                        {medicine_item.amount}
                                                        {medicine_item.unit}
                                                      </div>
                                                    </div>
                                                  </div>
                                                )
                                              })}
                                              {item.is_precision !== undefined && item.is_precision == 1 && (
                                                <div className="flex between option table-row">
                                                  <div className="text-right table-item">
                                                    【精密持続点滴】
                                                  </div>
                                                </div>
                                              )}
                                              {item.start_date !== undefined && item.start_date !== "" && (
                                                <div className="flex between option table-row">
                                                  <div className="text-right table-item">
                                                    {`処方開始日: `}
                                                  </div>
                                                </div>
                                              )}
                                              {item.insurance_type !== undefined && (
                                                <div className="flex between option table-row">
                                                  <div className="text-right table-item">
                                                    {`保険: ${this.getInsurance(item.insurance_type)}`}
                                                  </div>
                                                </div>
                                              )}
                                              {item.body_part !== undefined && item.body_part !== "" && (
                                                <div className="flex between option table-row">
                                                  <div className="text-right table-item">
                                                    {`部位/補足: ${item.body_part}`}
                                                  </div>
                                                </div>
                                              )}
                                              {item.discontinuation_start_date !== undefined &&
                                              item.discontinuation_start_date !== "" && (
                                                <div className="flex between option table-row">
                                                  <div className="text-right table-item">
                                                    {`中止期間の最初日: `}
                                                  </div>
                                                </div>
                                              )}
                                              {item.discontinuation_end_date !== undefined &&
                                              item.discontinuation_end_date !== "" && (
                                                <div className="flex between option table-row">
                                                  <div className="text-right table-item">
                                                    {`中止期間の最後日: `}
                                                  </div>
                                                </div>
                                              )}
                                              {item.discontinuation_comment !== undefined &&
                                              item.discontinuation_comment !== "" && (
                                                <div className="flex between option table-row">
                                                  <div className="text-right table-item">
                                                    {`中止コメント: ${item.discontinuation_comment}`}
                                                  </div>
                                                </div>
                                              )}
                                              {(set_order.order_table+"_edit") === CACHE_LOCALNAMES.INJECTION_EDIT && item.injectUsageName != undefined && item.injectUsageName != null && item.injectUsageName != "" && (
                                                <div className="flex between drug-item table-row">
                                                  <div className="text-right">
                                                    <div className="table-item">
                                                      {!item.injectUsageName ? "" : `用法: ${item.injectUsageName}`}
                                                    </div>
                                                    {item.usage_remarks_comment ? (
                                                      <div className="table-item remarks-comment">
                                                        {item.usage_remarks_comment.map((comment, ci) => {
                                                          return <p key={ci}>{comment}</p>;
                                                        })}
                                                      </div>
                                                    ) : (
                                                      ""
                                                    )}
                                                  </div>
                                                  <div className="w80 table-item">
                                                  </div>
                                                </div>
                                              )}
                                              {(item.temporary_medication !== undefined && item.temporary_medication === 1) ||
                                              (item.med[0].one_dose_package !== undefined && item.med[0].one_dose_package === 1) ||
                                              (item.med[0].milling !== undefined && item.med[0].milling === 1) ||
                                              (item.med[0].is_not_generic !== undefined && item.med[0].is_not_generic === 1) ||
                                              (item.med[0].separate_packaging !== undefined && item.med[0].separate_packaging === 1) ||
                                              (item.med[0].can_generic_name !== undefined && item.med[0].can_generic_name === 1) && (

                                                <div className="option flex table-item table-row dcVhIR">
                                                  <div className={'text-right table-item'}>
                                                    {item.temporary_medication !== undefined && item.temporary_medication === 1 && (
                                                      <p className="gCXasu">【臨時処方】&nbsp;</p>
                                                    )}
                                                    {item.med[0].one_dose_package !== undefined && item.med[0].one_dose_package === 1 && (
                                                      <p className="gCXasu">【一包化】&nbsp;</p>
                                                    )}
                                                    {item.med[0].milling !== undefined && item.med[0].milling === 1 && (
                                                      <p className="gCXasu">【粉砕】&nbsp;</p>
                                                    )}
                                                    {item.med[0].is_not_generic !== undefined && item.med[0].is_not_generic === 1 && (
                                                      <p className="gCXasu">【後発不可】&nbsp;</p>
                                                    )}
                                                    {item.med[0].separate_packaging !== undefined && item.med[0].separate_packaging === 1 && (
                                                      <p className="gCXasu">【別包】&nbsp;</p>
                                                    )}
                                                    {item.med[0].can_generic_name !== undefined && item.med[0].can_generic_name === 1 && (
                                                      <p className="gCXasu">【一般名処方】&nbsp;</p>
                                                    )}
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        )
                                      })}

                                      {((set_order.order_table+"_edit") === CACHE_LOCALNAMES.INJECTION_EDIT && (set_order.order_data.done_order == 1 || (set_order.order_data.schedule_date != undefined && set_order.order_data.schedule_date != null && set_order.order_data.schedule_date != "")))  && (
                                        <div className="history-item">
                                          <div className="box w70p">
                                            <div className="drug-item table-row HistoryUl__DrugItem-h3zsie-0 ffNuc">
                                              <div className="flex between">
                                                <div className="text-right">
                                                  {set_order.order_data.schedule_date != undefined && set_order.order_data.schedule_date != null && set_order.order_data.schedule_date != "" && (
                                                    <div className="table-item">
                                                      {"実施予定日: " }
                                                    </div>
                                                  )}
                                                  {set_order.order_data.done_order == 1 && (
                                                    <div className="table-item">
                                                      {"実施日時: "}
                                                    </div>
                                                  )}
                                                </div>
                                                <div className="w80 table-item" style={{textAlign:"right"}}> </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {set_order.order_data.drip_rate !== null && set_order.order_data.drip_rate !== undefined && set_order.order_data.drip_rate !== "" &&
                                      set_order.order_data.drip_rate !== 0 && (
                                        <div className="history-item">
                                          <div className="box">
                                            <div className="flex between option table-row">
                                              <div className="text-right table-item">
                                                {`点滴速度: ${set_order.order_data.drip_rate}ml/h`}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {set_order.order_data.water_bubble !== null && set_order.order_data.water_bubble !== undefined && set_order.order_data.water_bubble !== "" &&
                                      set_order.order_data.water_bubble !== 0 && (                                                                                <div className="history-item">
                                          <div className="box">
                                            <div className="flex between option table-row">
                                              <div className="text-right table-item">
                                                {`1分あたり: ${set_order.order_data.water_bubble}滴`}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {set_order.order_data.exchange_cycle !== null && set_order.order_data.exchange_cycle !== undefined && set_order.order_data.exchange_cycle !== "" &&
                                      set_order.order_data.exchange_cycle !== 0 && (
                                        <div className="history-item">
                                          <div className="box">
                                            <div className="flex between option table-row">
                                              <div className="text-right table-item">
                                                {`交換サイクル: ${set_order.order_data.exchange_cycle}時間`}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {set_order.order_data.require_time !== null && set_order.order_data.require_time !== undefined && set_order.order_data.require_time !== "" &&
                                      set_order.order_data.require_time !== 0 && (
                                        <div className="history-item">
                                          <div className="box">
                                            <div className="flex between option table-row">
                                              <div className="text-right table-item">
                                                {`所要時間: ${set_order.order_data.require_time}時間`}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {set_order.order_data.item_details !== undefined && set_order.order_data.item_details != null && set_order.order_data.item_details.length > 0 && (
                                        <div className="history-item">
                                          <div className="box w70p">
                                            <div className="drug-item table-row HistoryUl__DrugItem-h3zsie-0 ffNuc">
                                              <div className="flex between">
                                                <div className="flex full-width table-item">
                                                  <div className="number">品名</div>
                                                  <div className="ml-3 full-width mr-2" style={{wordBreak:"break-all"}}>
                                                    {set_order.order_data.item_details.map(detail=>{
                                                      if(detail != null){
                                                        return(
                                                          <>
                                                            <span>{detail.item_name}：</span>
                                                            {(detail.value1 !== undefined && detail.value1 != null && detail.value1 !== "") && (
                                                              <>
                                                                {getStrLength(detail.value1) > 32 && (
                                                                  <br />
                                                                )}
                                                                <span>{(detail.value1_format !== undefined) ? detail.value1_format : detail.value1}</span><br />
                                                              </>
                                                            )}
                                                            {(detail.value2 !== undefined && detail.value2 != null && detail.value2 !== "") && (
                                                              <>
                                                                {getStrLength(detail.value2) > 32 && (
                                                                  <br />
                                                                )}
                                                                <span>{(detail.value2_format !== undefined) ? detail.value2_format : detail.value2}</span><br />
                                                              </>
                                                            )}
                                                          </>
                                                        )
                                                      }
                                                    })}
                                                  </div>
                                                </div>
                                                <div className="w80 table-item" style={{textAlign:"right"}}> </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </MedicineListWrapper>
                              </div>
                            </div>
                          )
                        }
                      })
                    )}
                  </ColOrder>
                </div>
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className={'cancel-btn'} onClick={this.props.closeModal}>キャンセル</Button>
            {this.state.selected_key !== "" && this.state.selected_key.split('-')[2] !== undefined ? (
              <Button className={'red-btn'} onClick={this.confrimDeploy}>全文書展開</Button>
            ):(
              <Button className={'disable-btn'}>全文書展開</Button>
            )}
          </Modal.Footer>
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
              confirmOk= {this.deployOrderSet.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
        </Modal>
      </>
    );
  }
}
SetDeploymentModal.contextType = Context;
SetDeploymentModal.propTypes = {
  closeModal: PropTypes.func,
  patientId: PropTypes.number,
  patientInfo: PropTypes.array,
};

export default SetDeploymentModal;
