import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import * as apiClient from "~/api/apiClient";
import auth from "~/api/auth";
import SearchBar from "~/components/molecules/SearchBar";
import Button from "~/components/atoms/Button";
import * as localApi from "~/helpers/cacheLocal-utils";
import Checkbox from "~/components/molecules/Checkbox";
import Spinner from "react-bootstrap/Spinner";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import {addRedBorder, removeRedBorder, setDateColorClassName, toHalfWidthOnlyNumber} from "~/helpers/dialConstants";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import {formatDateLine, formatDateSlash, formatTimeIE} from "~/helpers/date";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
registerLocale("ja", ja);
import {DatePickerBox} from "~/components/styles/DatePickerBox";
import HarukaSelectMasterModal from "~/components/molecules/HarukaSelectMasterModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import WardSelectModal from "~/components/templates/Patient/Modals/Hospital/WardSelectModal";
import SelectMedicineModal from "~/components/templates/Patient/Modals/Common/SelectMedicineModal";

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  display: block;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  .search-area {
    display:flex;
    align-items: center;
    input {ime-mode:inactive;}
    .gana_search{
      margin-left: 0.5rem;
      button {
        height:38px;
        padding: 0px 0.5rem;
        background-color: rgb(255, 255, 255);
        span {font-size:1rem;}
      }
    }
  }
  .table-area {
    width: 100%;
    .table-head {
      border:1px solid #dee2e6;
      width:100%;
      .menu {
        border-right:1px solid #dee2e6;
        text-align:center;
        height:2rem;
        line-height:2rem;
      }
      .td-last {
        width: 17px;
        border-right: none;
      }
    }
    .table-body {
      width:100%;
      border:1px solid #dee2e6;
      border-top:none;
      overflow-y: scroll;
      height: 32vh;
      .div-tr {
        width:100%;
        border-bottom:1px solid #dee2e6;
      }
      .div-tr:nth-child(even) {background-color: #f2f2f2;}
      .div-tr:hover{background-color:#e2e2e2 !important;}
      .new-tr {
        text-align:center;
        height:2rem;
        line-height:2rem;
        cursor:"pointer";
      }
      .div-td {
        border-right:1px solid #dee2e6;
        padding: 0 0.25rem;
        word-break: break-all;
        vertical-align: middle;
        line-height: 2rem;
        .pullbox {
          .pullbox-title {display: none !important;}
            .pullbox-label {
              width:100%;
              margin-bottom: 0;
              .pullbox-select {
                width:100%;
                height:2rem;
              }
            }
          }
        }
      }
      .td-select-date {
        .react-datepicker-wrapper {
          width:100%;
          .react-datepicker__input-container {
            width:100%;
            input {
              width:100%;
              height: 2rem;
              font-size:1rem;
            }
          }
        }
      }
    }
    .td-check {
      width:3rem;
      text-align: center;
      label {
        margin-right: 0;
        input {margin-right: 0;}
      }
    }
    .td-patient-number{width:6rem;}
    .td-patient-name{width:16rem;}
    .td-birthday{width:6rem;}
    .td-hos-date{width:6rem;}
    .td-hos-date-time{width:4rem;}
    .td-hos-period{width:7rem;}
    .td-department{width:7rem;}
    .td-hos-ward{width:10rem;}
    .td-doctor-name{width:11rem;}
    .td-food-type{width:9rem;}
    .td-food-start-date{
      width:10rem;
      .react-datepicker-popper {
        left: -20px !important;
      }
    }
    .td-pd-0{padding:0 !important;}
  }
  .out-patient {
    margin-top:0.5rem;
    .table-head {
      .td-ward-name {width: calc(100% - 17px - 25rem);}
    }
    .table-body {
      .td-ward-name {
        border-right: none;
        width: calc(100% - 25rem);
      }
    }
  }
  .hos-patient {
    .table-head {
      .td-disease-name{width: calc(100% - 17px - 95rem);}
    }
    .table-body {
      .td-disease-name{width: calc(100% - 95rem);}
    }
  }
  .btn-area {
    display:flex;
    margin: 0.5rem 0;
    button {
      height: 2rem;
      padding-top: 0px;
      padding-bottom: 0px;
    }
    .red-btn {
      border: 2px solid #cc0000;
      background: #cc0000 !important;
      span {
        color: #ffffff !important;
        font-size: 1rem;
      }
    }
    .red-btn:hover {
      background: #e81123 !important;
      span {
        color: #ffffff !important;
        font-size: 1rem;
      }
    }
    .disable-btn {
      background: lightgray;
      cursor: auto;
      span {
        color: #595959 !important;
        font-size: 1rem;
      }
    }
    .disable-btn:hover {
      background: lightgray !important;
      span {
        color: #595959 !important;
        font-size: 1rem;
      }
    }
    .select-doctor {
      display:flex;
      margin-left:0.5rem;
      .doctor-label {
        margin-right:0.5rem;
        line-height:2rem;
        font-size:1rem;
      }
      .doctor-name {
        border:1px solid #aaa;
        min-width:15rem;
        height:2rem;
        line-height:2rem;
        padding:0 0.2rem;
        cursor:pointer;
      }
    }
    .select-food {
      display:flex;
      margin-left:0.5rem;
      .label-title {
        width:3rem;
        margin:0;
        margin-right:0.5rem;
        line-height:2rem;
        font-size:1rem;
        text-align:right;
      }
      .pullbox-label {
        margin:0;
        .pullbox-select {
          width:15rem;
          height:2rem;
          line-height:2rem;
          font-size:1rem;
        }
      }
    }
  }
`;

const ContextMenuUl = styled.div`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 1240px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 84px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 1rem;
    font-weight: normal;
    line-height: 1.5rem;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
      font-size: 16px;
    }
    img {
      width: 2.2rem;
      height: 2.2rem;
    }
    svg {
      width: 2.2rem;
      margin: 8px 0;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
`;

const ContextMenu = ({visible, x, y, selected_index, parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.contextMenuAction("delete", selected_index)}>登録取りやめ</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

class HospitalizedSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchId:"",
      patient_list:[],
      patient_ids:[],
      load_flag:false,
      food_types:[],
      hos_patient_list:[],
      hos_patient_ids:[],
      estimated_hospitalization_period_master:[],
      meal_time_classification_master:[],
      isOpenSelectDoctorModal:false,
      selected_index:null,
      doctor_id:0,
      food_type_id:0,
      confirm_title:"",
      confirm_message:"",
      alert_messages:"",
      complete_message:"",
      isOpenWardModal:false,
      ward_names:{},
      ward_master:[],
      room_names:{},
      hospital_room_master:[],
      bed_names:{},
      hospital_bed_master:[],
      isOpenSelectDiseaseModal:false,
    };
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.department_codes = [{id:0, value:""}];
    departmentOptions.map(department=>{
      this.department_codes.push(department);
    });
    this.doctor_list = [];
    this.doctor_names={};
    let doctor_code_list = [];
    let doctor_data = sessApi.getDoctorList();
    doctor_data.map(doctor=>{
      let index = doctor_code_list.indexOf(doctor.doctor_code);
      if(index === -1){
        doctor_code_list.push(doctor.doctor_code);
        doctor.id = doctor.number;
        doctor.value = doctor.name;
        this.doctor_list.push(doctor);
        this.doctor_names[doctor.number] = doctor.name;
      }
    });
    this.key_code = {};
    this.start_pos = {};
  }
  
  async componentDidMount(){
    localApi.setValue("system_next_page", "/hospital_ward_map");
    localApi.setValue("system_before_page", "/hospital_ward_map");
    await this.getPatientList();
    auth.refreshAuth(location.pathname+location.hash);
  }
  
  getPatientList=async()=>{
    if(this.state.hos_patient_list.length > 0){
      this.setState({
        confirm_type:"search_patient",
        confirm_title:'入力中',
        confirm_message:"登録していない内容があります。\n変更内容を破棄しますか？",
      });
      return;
    }
    if(this.state.load_flag){
      this.setState({load_flag:false});
    }
    let path = "/app/api/v2/ward/get/hospital_setting/patient_list";
    let post_data = {};
    post_data.keyword = this.state.searchId != "" ? this.state.searchId : "";
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        let food_types = [{id:0, value:""}];
        if(res.food_type_master.length > 0){
          res.food_type_master.map(item=>{
            food_types.push({id:item.number, value:item.name});
          });
        }
        let estimated_hospitalization_period_master = [{id:0, value:""}];
        if(res.estimated_hospitalization_period_master.length > 0){
          res.estimated_hospitalization_period_master.map(item=>{
            estimated_hospitalization_period_master.push({id:item.number, value:item.name});
          });
        }
        let meal_time_classification_master = [{id:0, value:""}];
        if(res.meal_time_classification_master.length > 0){
          res.meal_time_classification_master.map(item=>{
            meal_time_classification_master.push({id:item.number, value:item.name});
          });
        }
        let ward_names = {};
        if(res.ward_master.length > 0){
          res.ward_master.map(item=>{
            ward_names[item.number] = item.name;
          });
        }
        let room_names = {};
        if(res.hospital_room_master.length > 0){
          res.hospital_room_master.map(item=>{
            room_names[item.number] = item.name;
          });
        }
        let bed_names = {};
        if(res.hospital_bed_master.length > 0){
          res.hospital_bed_master.map(item=>{
            bed_names[item.number] = item.name;
          });
        }
        this.setState({
          load_flag:true,
          food_types,
          estimated_hospitalization_period_master,
          meal_time_classification_master,
          patient_list:res.patient_list,
          ward_names,
          ward_master:res.ward_master,
          room_names,
          hospital_room_master:res.hospital_room_master,
          bed_names,
          hospital_bed_master:res.hospital_bed_master,
        });
      })
      .catch(()=>{
      });
  }
  
  searchId =(word)=> {
    word = word.toString().trim();
    this.setState({searchId:word});
  };
  
  enterPressedKana = e => {
    let code = e.keyCode || e.which;
    if (code === 13) {
      this.getPatientList();
    }
  };
  
  selectPatient =(name, number)=>{
    if(name == "out_patient"){
      let patient_ids = this.state.patient_ids;
      let index = patient_ids.indexOf(number);
      if(index === -1){
        patient_ids.push(number);
      } else {
        patient_ids.splice(index, 1);
      }
      this.setState({patient_ids});
    } else {
      let hos_patient_ids = this.state.hos_patient_ids;
      let index = hos_patient_ids .indexOf(number);
      if(index === -1){
        hos_patient_ids.push(number);
      } else {
        hos_patient_ids.splice(index, 1);
      }
      this.setState({hos_patient_ids});
    }
  };
  
  addHosPatient=()=>{
    let hos_patient_list = this.state.hos_patient_list;
    let patient_list = [];
    this.state.patient_list.map(item=>{
      if(this.state.patient_ids.includes(item.system_patient_id)){
        hos_patient_list.push(item);
      } else {
        patient_list.push(item);
      }
    });
    this.setState({
      patient_ids:[],
      patient_list,
      hos_patient_list,
    }, ()=>{
      this.checkValidate();
    });
  }
  
  selectFood=(e)=>{
    this.setState({food_type_id:parseInt(e.target.id)});
  };
  
  setHosDate=(key,value)=>{
    let name = key.split(':')[0];
    let index = key.split(':')[1];
    let hos_patient_list = this.state.hos_patient_list;
    if(value == null || value == ""){
      hos_patient_list[index][name] = undefined;
    } else {
      hos_patient_list[index][name] = formatDateLine(value);
      if(name === "hos_date"){
        hos_patient_list[index]['start_date'] = formatDateLine(value);
      }
    }
    this.setState({hos_patient_list});
  };
  
  confirmClose=()=>{
    if(this.state.hos_patient_list.length > 0){
      this.setState({
        confirm_type:"modal_close",
        confirm_title:'入力中',
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
      });
    } else {
      this.props.closeModal();
    }
  }
  
  getInputTime = (index, value, e) => {
    let hos_patient_list = this.state.hos_patient_list;
    if (e === undefined){
      if(value == null || value == ""){
        hos_patient_list[index]['hos_date_time'] = undefined;
        hos_patient_list[index]['hos_date_time_value'] = undefined;
      } else {
        hos_patient_list[index]['hos_date_time'] = formatTimeIE(value);
        hos_patient_list[index]['hos_date_time_value'] = formatTimeIE(value);
      }
      this.setState({hos_patient_list});
      return;
    }
    let input_value = e.target.value;
    input_value = input_value.replace(/[^0-9０-９]/g, '');
    if (input_value.length > 4) return;
    input_value = toHalfWidthOnlyNumber(input_value);
    if(input_value.length >= 2 ){
      input_value = this.insertStrTimeStyle(input_value);
    }
    if (input_value.length == 5){
      this.setTime(index, e);
    }
    hos_patient_list[index]['hos_date_time_value'] = input_value;
    this.setState({hos_patient_list},() => {
      let obj = document.getElementById('hos_date_time_'+index);
      if (this.key_code[index] == 46){
        obj.setSelectionRange(this.start_pos[index], this.start_pos[index]);
      }
      if (this.key_code[index] == 8){
        obj.setSelectionRange(this.start_pos[index] - 1, this.start_pos[index] - 1);
      }
    })
  };
  
  setTime = (index, e) => {
    let hos_patient_list = this.state.hos_patient_list;
    if (e.target.value.length != 5) {
      hos_patient_list[index]['hos_date_time'] = undefined;
      hos_patient_list[index]['hos_date_time_value'] = undefined;
      this.setState({hos_patient_list});
      return;
    }
    let input_value = e.target.value;
    let hours = input_value.split(':')[0];
    let mins = input_value.split(':')[1];
    if (hours > 23 || mins > 60){
      hos_patient_list[index]['hos_date_time'] = undefined;
      hos_patient_list[index]['hos_date_time_value'] = undefined;
      this.setState({hos_patient_list});
      return;
    }
    let now = new Date();
    now.setHours(hours);
    now.setMinutes(mins);
    hos_patient_list[index]['hos_date_time'] = formatTimeIE(now);
    this.setState({hos_patient_list});
  }
  
  timeKeyEvent = (index, e) => {
    let hos_patient_list = this.state.hos_patient_list;
    let start_pos = e.target.selectionStart;
    let end_pos = e.target.selectionEnd;
    let key_code = e.keyCode;
    this.key_code[index] = key_code;
    this.start_pos[index] = start_pos;
    let obj = document.getElementById('hos_date_time_' + index);
    let input_value = e.target.value;
    if (start_pos == end_pos) {
      if (key_code == 37 && start_pos == 3){
        e.target.setSelectionRange(start_pos-1, start_pos-1);
      }
      if (key_code == 39 && start_pos == 2){
        e.target.setSelectionRange(start_pos+1, start_pos+1);
      }
    }
    input_value = input_value.replace(/[^0-9０-９]/g, '');
    if (input_value.length > 4) return;
    input_value = toHalfWidthOnlyNumber(input_value);
    if(input_value.length >= 2 ){
      input_value = this.insertStrTimeStyle(input_value);
    }
    if (key_code == 9) {
      this.setTime(index, e);
      return;
    }
    if(key_code == 8){
      if (input_value.length == 1 && start_pos == 1 && start_pos == end_pos){
        hos_patient_list[index]['hos_date_time_value'] = '';
        this.setState({hos_patient_list}, () => {
          obj.setSelectionRange(0, 0);
        });
        e.preventDefault();
      }
      if (input_value.length == 3 && start_pos == 1 && start_pos == end_pos){
        input_value = input_value.slice(1.2);
        hos_patient_list[index]['hos_date_time_value'] = input_value;
        this.setState({hos_patient_list}, () => {
          obj.setSelectionRange(0, 0);
        });
        e.preventDefault();
      }
      if (start_pos == end_pos && start_pos == 3){
        input_value = input_value.slice(0,1) + input_value.slice(3, input_value.length);
        hos_patient_list[index]['hos_date_time_value'] = input_value;
        this.setState({hos_patient_list}, () => {
          obj.setSelectionRange(1, 1);
        });
        e.preventDefault();
      }
      if (start_pos != end_pos){
        input_value = input_value.slice(0, start_pos) + input_value.slice(end_pos, input_value.length);
        hos_patient_list[index]['hos_date_time_value'] = input_value;
        this.setState({hos_patient_list}, () => {
          obj.setSelectionRange(start_pos, start_pos);
        });
        e.preventDefault();
      }
    }
    if (key_code == 46){
      if (start_pos != end_pos){
        input_value = input_value.slice(0, start_pos) + input_value.slice(end_pos, input_value.length);
        hos_patient_list[index]['hos_date_time_value'] = input_value;
        this.setState({hos_patient_list}, () => {
          obj.setSelectionRange(start_pos, start_pos);
        });
        e.preventDefault();
      }
      if (input_value.length == 1 && start_pos == 0 && start_pos == end_pos){
        hos_patient_list[index]['hos_date_time_value'] = '';
        this.setState({hos_patient_list}, () => {
          obj.setSelectionRange(0, 0);
        });
        e.preventDefault();
      }
      if (start_pos == end_pos && input_value.length == 3){
        if (start_pos == 0){
          hos_patient_list[index]['hos_date_time_value'] = input_value.slice(1,2);
          this.setState({hos_patient_list}, () => {
            obj.setSelectionRange(0, 0);
          });
          e.preventDefault();
        }
        if (start_pos == 1){
          hos_patient_list[index]['hos_date_time_value'] = input_value.slice(0,1);
          this.setState({hos_patient_list}, () => {
            obj.setSelectionRange(1, 1);
          });
          e.preventDefault();
        }
      }
    }
    if (key_code != 8 && key_code != 46){
      hos_patient_list[index]['hos_date_time_value'] = input_value;
      this.setState({hos_patient_list});
    }
  }
  
  insertStrTimeStyle=(input)=>{
    return input.slice(0, 2) + ':' + input.slice(2,input.length);
  }
  
  setSelectValue =(value, e)=>{
    let name = value.split(':')[0];
    let index = value.split(':')[1];
    let hos_patient_list = this.state.hos_patient_list;
    hos_patient_list[index][name] = parseInt(e.target.id);
    this.setState({hos_patient_list});
  }
  
  handleClick=(e, index)=>{
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({contextMenu: {visible: false}});
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: {visible: false}
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      if(this.state.patient_list.length > 0){
        document
          .getElementById("patient_list")
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({contextMenu: {visible: false}});
            document
              .getElementById("patient_list")
              .removeEventListener(`scroll`, onScrollOutside);
          });
      }
      if(this.state.hos_patient_list.length > 0){
        document
          .getElementById("hos_patient_list")
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({contextMenu: {visible: false}});
            document
              .getElementById("hos_patient_list")
              .removeEventListener(`scroll`, onScrollOutside);
          });
      }
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - 20,
          y: e.clientY + window.pageYOffset,
          selected_index:index,
        },
      })
    }
  };
  
  contextMenuAction = (act, value) => {
    let hos_patient_list = [];
    let hos_patient_ids = [];
    if(act === "delete"){
      this.state.hos_patient_list.map((patient, index)=>{
        if(value != index){
          hos_patient_list.push(patient);
          if(this.state.hos_patient_ids.includes(patient.patient_id)){
            hos_patient_ids.push(patient.patient_id);
          }
        }
      });
      this.setState({hos_patient_list, hos_patient_ids});
    }
  }
  
  selectDoctor=(index=null)=> {
    this.setState({
      selected_index:index,
      isOpenSelectDoctorModal:true,
    });
  };
  
  closeModal=()=>{
    this.setState({
      isOpenSelectDoctorModal:false,
      isOpenWardModal:false,
      isOpenSelectDiseaseModal:false,
      confirm_type:"",
      confirm_title:"",
      confirm_message:"",
      alert_messages:"",
      selected_index:null,
    });
  }
  
  selectDoctorFromModal = (doctor) => {
    let state_data = {};
    state_data.isOpenSelectDoctorModal = false;
    if(this.state.selected_index != null){
      let hos_patient_list = this.state.hos_patient_list;
      hos_patient_list[this.state.selected_index]['main_doctor_id'] = doctor.id;
      state_data.hos_patient_list = hos_patient_list;
    } else {
      state_data.doctor_id = doctor.id;
    }
    this.setState(state_data);
  };
  
  setAllDoctorId=()=>{
    let hos_patient_list = this.state.hos_patient_list;
    hos_patient_list.map(patient=>{
      if(this.state.hos_patient_ids.includes(patient.patient_id)){
        patient.main_doctor_id = this.state.doctor_id;
      }
    });
    this.setState({hos_patient_list});
  }
  
  setAllFoodTypeId=()=>{
    let hos_patient_list = this.state.hos_patient_list;
    hos_patient_list.map(patient=>{
      if(this.state.hos_patient_ids.includes(patient.patient_id)){
        patient.food_type_id = this.state.food_type_id;
      }
    });
    this.setState({hos_patient_list});
  }
  
  confirmRegister=(value)=>{
    if(!value){return;}
    this.setState({
      confirm_type:"register",
      confirm_title:"登録確認",
      confirm_message:"登録しますか？",
    });
  }
  
  confirmOk=()=>{
    if(this.state.confirm_type === "modal_close"){
      this.props.closeModal();
    }
    if(this.state.confirm_type === "register"){
      this.register();
    }
    if(this.state.confirm_type === "search_patient"){
      this.setState({
        confirm_type:"",
        confirm_title:"",
        confirm_message:"",
        hos_patient_list:[],
        hos_patient_ids:[],
        load_flag:false,
      }, ()=>{
        this.getPatientList();
      });
    }
  }
  
  selectWard = (index) =>{
    let hos_patient_list = this.state.hos_patient_list;
    if(hos_patient_list[index]['hos_date'] === undefined || hos_patient_list[index]['hos_date'] === null || hos_patient_list[index]['hos_date'] === ""){
      this.setState({alert_messages: '入院日を選択してください。'});
      return;
    }
    if(hos_patient_list[index]['hos_date_time'] === undefined || hos_patient_list[index]['hos_date_time'] === null || hos_patient_list[index]['hos_date_time'] === ""){
      this.setState({alert_messages: '入院時刻を選択してください。'});
      return;
    }
    let date_and_time_of_hospitalization = new Date((hos_patient_list[index]['hos_date'].split('-').join('/')) +" "+ hos_patient_list[index]['hos_date_time']+":00");
    let use_beds = [];
    hos_patient_list.map((patient, idx)=>{
      if(idx != index && patient.hospital_bed_id !== undefined && patient.hospital_bed_id != null){
        use_beds.push(patient.hospital_bed_id);
      }
    });
    this.setState({
      selected_index:index,
      isOpenWardModal:true,
      date_and_time_of_hospitalization,
      use_beds,
    });
  };
  
  setWard = (ward, room, bed) => {
    let hos_patient_list = this.state.hos_patient_list;
    hos_patient_list[this.state.selected_index]['first_ward_id'] = ward.number;
    hos_patient_list[this.state.selected_index]['hospital_room_id'] = room.number;
    hos_patient_list[this.state.selected_index]['hospital_bed_id'] = bed.number;
    this.setState({
      isOpenWardModal:false,
      hos_patient_list,
      selected_index:null,
    });
  };
  
  setDiseaseName=(index)=>{
    this.setState({
      selected_index:index,
      isOpenSelectDiseaseModal: true,
    });
  }
  
  selectDiseaseName = (disease_name, disease) =>{
    let hos_patient_list = this.state.hos_patient_list;
    hos_patient_list[this.state.selected_index]['disease_name'] = disease_name;
    hos_patient_list[this.state.selected_index]['hospitalized_disease_name_id'] = disease.number;
    this.setState({
      hos_patient_list,
      selected_index:null,
      isOpenSelectDiseaseModal:false,
    });
  }
  
  checkValidate=()=>{
    let can_save = true;
    if(this.state.hos_patient_list.length === 0){return false;}
    this.state.hos_patient_list.map((patient, index)=>{
      removeRedBorder('hos_date_'+index);
      if(patient.hos_date === undefined || patient.hos_date == null || patient.hos_date == ""){
        can_save = false;
        addRedBorder('hos_date_'+index);
      }
      removeRedBorder('hos_date_time_'+index);
      if(patient.hos_date_time === undefined || patient.hos_date_time == null || patient.hos_date_time == ""){
        can_save = false;
        addRedBorder('hos_date_time_'+index);
      }
      removeRedBorder('estimated_hospitalization_period_id_'+index);
      if(patient.estimated_hospitalization_period_id === undefined || patient.estimated_hospitalization_period_id == null || patient.estimated_hospitalization_period_id === 0){
        can_save = false;
        addRedBorder('estimated_hospitalization_period_id_'+index);
      }
      removeRedBorder('department_id_'+index);
      if(patient.department_id === undefined || patient.department_id == null || patient.department_id === 0){
        can_save = false;
        addRedBorder('department_id_'+index);
      }
      removeRedBorder('disease_name_'+index);
      if(patient.disease_name === undefined || patient.disease_name == null){
        can_save = false;
        addRedBorder('disease_name_'+index);
      }
      removeRedBorder('hospital_bed_id_'+index);
      if(patient.hospital_bed_id === undefined || patient.hospital_bed_id == null){
        can_save = false;
        addRedBorder('hospital_bed_id_'+index);
      }
      removeRedBorder('main_doctor_id_'+index);
      if(patient.main_doctor_id === undefined || patient.main_doctor_id == null){
        can_save = false;
        addRedBorder('main_doctor_id_'+index);
      }
      removeRedBorder('start_date_'+index);
      if(patient.start_date === undefined || patient.start_date == null || patient.start_date === ""){
        can_save = false;
        addRedBorder('start_date_'+index);
      }
      removeRedBorder('start_time_classification_'+index);
      if(patient.start_time_classification === undefined || patient.start_time_classification == null || patient.start_time_classification === 0){
        can_save = false;
        addRedBorder('start_time_classification_'+index);
      }
      removeRedBorder('food_type_id_'+index);
      if(patient.food_type_id === undefined || patient.food_type_id == null || patient.food_type_id === 0){
        can_save = false;
        addRedBorder('food_type_id_'+index);
      }
    });
    return can_save;
  }
  
  register=async()=>{
    this.setState({
      confirm_type:"",
      confirm_title:"",
      confirm_message:"",
      complete_message:"登録中",
    });
    let path = "/app/api/v2/ward/register/hospital_setting/patient_list";
    let patient_list = this.state.hos_patient_list;
    patient_list.map(patient=>{
      patient.doctor_name = this.doctor_names[patient.main_doctor_id];
      patient.ward_name = this.state.ward_names[patient.first_ward_id];
      patient.room_name = this.state.room_names[patient.hospital_room_id];
      patient.bed_name = this.state.bed_names[patient.hospital_bed_id];
      patient.start_time_name = (this.state.meal_time_classification_master.find((x) => x.id == patient.start_time_classification) !== undefined) ?
        this.state.meal_time_classification_master.find((x) => x.id == patient.start_time_classification).value : "";
    });
    let post_data = {
      patient_list,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        let state_data = {};
        if(res.patient_list !== undefined){
          state_data.alert_messages = "病床重複";
          state_data.hos_patient_list = res.patient_list;
        } else if(res.alert_message !== undefined) {
          state_data.hos_patient_list = [];
          state_data.alert_messages = res.alert_message;
        } else {
          state_data.alert_messages = res.error_message
        }
        state_data.hos_patient_ids = [];
        state_data.complete_message = "";
        this.setState(state_data, ()=>{
          this.checkValidate();
        });
      })
      .catch(()=>{
      });
  }
  
  render() {
    let can_save = this.checkValidate();
    return (
      <Modal
        show={true}
        id="outpatient"
        className="custom-modal-sm patient-exam-modal hospitalized-setting first-view-modal"
      >
        <Modal.Header><Modal.Title>入院済み設定</Modal.Title></Modal.Header>
        <Modal.Body>
          <DatePickerBox style={{width:"100%", height:"100%"}}>
            <Wrapper>
              <div className={'search-area'}>
                <SearchBar
                  placeholder="患者ID / カナ氏名"
                  search={this.searchId}
                  enterPressed={this.enterPressedKana}
                  value={this.state.searchId}
                  id={'search_bar'}
                />
                <div className="gana_search">
                  <Button type="mono" onClick={this.getPatientList}>検索</Button>
                </div>
              </div>
              <div className={'table-area out-patient'}>
                <div className={'table-head flex'}>
                  <div className={'menu td-check'}>選択</div>
                  <div className={'menu td-patient-number'}>患者ID</div>
                  <div className={'menu td-patient-name'}>患者氏名</div>
                  <div className={'menu td-ward-name'}>病床</div>
                  <div className={'menu td-last'}> </div>
                </div>
                <div className={'table-body'} id={'patient_list'}>
                  {this.state.load_flag ? (
                    <>
                      {this.state.patient_list.length > 0 && (
                        this.state.patient_list.map(patient=>{
                          return (
                            <>
                              <div className={'flex div-tr'}>
                                <div className={'div-td td-check'}>
                                  {patient.is_carried_out_of_hospitalization == 0 && (
                                    <Checkbox
                                      getRadio={this.selectPatient.bind(this)}
                                      value={(this.state.patient_ids.includes(patient.system_patient_id))}
                                      number={patient.system_patient_id}
                                      name="out_patient"
                                    />
                                  )}
                                </div>
                                <div className={'text-right div-td td-patient-number'}>{patient.patient_number}</div>
                                <div className={'div-td td-patient-name'}>{patient.patient_name}</div>
                                <div className={'div-td td-ward-name'}>
                                  {patient.hos_number == null ? "" : (patient.ward_name + '/' + (patient.room_name == null ? '病室未指定' : patient.room_name) + '/' + (patient.bed_name == null ? '病床未指定' : patient.bed_name))}
                                </div>
                              </div>
                            </>
                          )
                        })
                      )}
                    </>
                  ):(
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  )}
                </div>
              </div>
              <div className={'btn-area'}>
                <Button className={this.state.patient_ids.length > 0 ? "red-btn" : "disable-btn"} onClick={this.addHosPatient}>↓追加</Button>
                <div className={'select-doctor'}>
                  <div className={'doctor-label'}>主担当医</div>
                  <div className={'doctor-name'} onClick={this.selectDoctor.bind(this, null)}>
                    {this.doctor_names[this.state.doctor_id] !== undefined ? this.doctor_names[this.state.doctor_id] : ""}
                    </div>
                  <button disabled={this.state.doctor_id === 0 || this.state.hos_patient_ids.length === 0} onClick={this.setAllDoctorId.bind(this)}>主担当医一括設定</button>
                </div>
                <div className={'select-food'}>
                  <SelectorWithLabel
                    options={this.state.food_types}
                    title={'食種'}
                    getSelect={this.selectFood.bind(this)}
                    departmentEditCode={this.state.food_type_id}
                  />
                  <button disabled={this.state.food_type_id === 0 || this.state.hos_patient_ids.length === 0} onClick={this.setAllFoodTypeId.bind(this)}>食種一括設定</button>
                </div>
              </div>
              <div className={'table-area hos-patient'}>
                <div className={'table-head flex'}>
                  <div className={'menu td-check'}>選択</div>
                  <div className={'menu td-patient-number'}>患者ID</div>
                  <div className={'menu td-patient-name'}>患者氏名</div>
                  <div className={'menu td-birthday'}>生年月日</div>
                  <div className={'menu td-hos-date'}>入院日</div>
                  <div className={'menu td-hos-date-time'}>時刻</div>
                  <div className={'menu td-hos-period'}>推定入院期間</div>
                  <div className={'menu td-department'}>診療科</div>
                  <div className={'menu td-disease-name'}>病名</div>
                  <div className={'menu td-hos-ward'}>病床</div>
                  <div className={'menu td-doctor-name'}>主担当医</div>
                  <div className={'menu td-food-start-date'}>食事開始日時</div>
                  <div className={'menu td-food-type'}>食種</div>
                  <div className={'menu td-last'}> </div>
                </div>
                <div className={'table-body'} id={'hos_patient_list'}>
                  {this.state.hos_patient_list.length > 0 && (
                    this.state.hos_patient_list.map((patient, index)=>{
                      return (
                        <>
                          <div className={'flex div-tr hospital-row:'+index} onContextMenu={e => this.handleClick(e, index)}>
                            <div className={'div-td td-check'}>
                              <Checkbox
                                getRadio={this.selectPatient.bind(this)}
                                value={(this.state.hos_patient_ids.includes(patient.system_patient_id))}
                                number={patient.system_patient_id}
                                name="hos_patient"
                              />
                            </div>
                            <div className={'text-right div-td td-patient-number'}>{patient.patient_number}</div>
                            <div className={'div-td td-patient-name'}>{patient.patient_name}</div>
                            <div className={'div-td td-birthday'}>{patient.birthday}</div>
                            <div className={'div-td td-hos-date td-select-date td-pd-0'}>
                              <DatePicker
                                locale="ja"
                                selected={patient.hos_date !== undefined ? new Date(patient.hos_date.split("-").join("/")) : ""}
                                onChange={this.setHosDate.bind(this, 'hos_date:'+index)}
                                dateFormat="yyyy/MM/dd"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                dayClassName = {date => setDateColorClassName(date)}
                                id={'hos_date_'+index}
                                onBlur = {() => this.checkValidate()}
                              />
                            </div>
                            <div className={'div-td td-hos-date-time td-select-date td-pd-0'}>
                              <DatePicker
                                selected={patient.hos_date_time !== undefined ? new Date(formatDateSlash(new Date()) + " " + patient.hos_date_time+":00") : ""}
                                onKeyDown = {this.timeKeyEvent.bind(this, index)}
                                onChange={this.getInputTime.bind(this, index)}
                                onBlur = {this.setTime.bind(this, index)}
                                value = {patient.hos_date_time_value}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={10}
                                dateFormat="HH:mm"
                                timeFormat="HH:mm"
                                timeCaption="時間"
                                id={'hos_date_time_'+index}
                              />
                            </div>
                            <div className={'div-td td-hos-period td-pd-0'}>
                              <SelectorWithLabel
                                id={"estimated_hospitalization_period_id_"+index}
                                options={this.state.estimated_hospitalization_period_master}
                                title=""
                                getSelect={this.setSelectValue.bind(this, "estimated_hospitalization_period_id:"+index)}
                                departmentEditCode={patient.estimated_hospitalization_period_id}
                              />
                            </div>
                            <div className={'div-td td-department td-pd-0'}>
                              <SelectorWithLabel
                                id={"department_id_"+index}
                                options={this.department_codes}
                                title=""
                                getSelect={this.setSelectValue.bind(this, "department_id:"+index)}
                                departmentEditCode={patient.department_id}
                              />
                            </div>
                            <div className={'div-td td-disease-name'} onClick={this.setDiseaseName.bind(this, index)} style={{cursor:"pointer"}} id={'disease_name_'+index}>
                              {patient.disease_name !== undefined ? patient.disease_name : ""}
                            </div>
                            <div className={'div-td td-hos-ward'} onClick={this.selectWard.bind(this, index)} style={{cursor:"pointer"}} id={'hospital_bed_id_'+index}>
                              {(patient.first_ward_id != null && this.state.ward_names[patient.first_ward_id]) ? this.state.ward_names[patient.first_ward_id] : ""}
                              {(patient.hospital_room_id != null && this.state.room_names[patient.hospital_room_id]) ? ('/'+this.state.room_names[patient.hospital_room_id]) : ""}
                              {(patient.hospital_bed_id != null && this.state.bed_names[patient.hospital_bed_id]) ? ('/'+this.state.bed_names[patient.hospital_bed_id]) : ""}
                            </div>
                            <div className={'div-td td-doctor-name'} style={{cursor:"pointer"}} onClick={this.selectDoctor.bind(this, index)} id={'main_doctor_id_'+index}>
                              {(patient.main_doctor_id !== undefined && this.doctor_names[patient.main_doctor_id] !== undefined) ? this.doctor_names[patient.main_doctor_id] : ""}
                            </div>
                            <div className={'div-td td-food-start-date flex td-pd-0'}>
                              <div style={{width:"6rem"}} className={'td-select-date'}>
                                <DatePicker
                                  locale="ja"
                                  selected={patient.start_date !== undefined ? new Date(patient.start_date.split("-").join("/")) : ""}
                                  onChange={this.setHosDate.bind(this, 'start_date:'+index)}
                                  dateFormat="yyyy/MM/dd"
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  dayClassName = {date => setDateColorClassName(date)}
                                  id={'start_date_'+index}
                                  onBlur = {() => this.checkValidate()}
                                />
                              </div>
                              <div style={{width:"calc(100% - 6rem)"}}>
                                <SelectorWithLabel
                                  id={"start_time_classification_"+index}
                                  options={this.state.meal_time_classification_master}
                                  title=""
                                  getSelect={this.setSelectValue.bind(this, "start_time_classification:"+index)}
                                  departmentEditCode={patient.start_time_classification}
                                />
                              </div>
                            </div>
                            <div className={'div-td td-food-type td-pd-0'}>
                              <SelectorWithLabel
                                id={"food_type_id_"+index}
                                options={this.state.food_types}
                                title=""
                                getSelect={this.setSelectValue.bind(this, "food_type_id:"+index)}
                                departmentEditCode={patient.food_type_id}
                              />
                            </div>
                          </div>
                        </>
                      )
                    })
                  )}
                </div>
              </div>
            </Wrapper>
          </DatePickerBox>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.confirmClose}>キャンセル</Button>
          <Button className={can_save ? "red-btn" : "disable-btn"} onClick={this.confirmRegister.bind(this, can_save)}>登録</Button>
        </Modal.Footer>
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
        />
        {this.state.isOpenSelectDoctorModal && (
          <HarukaSelectMasterModal
            selectMaster = {this.selectDoctorFromModal}
            closeModal = {this.closeModal}
            MasterCodeData = {this.doctor_list}
            MasterName = '医師'
          />
        )}
        {this.state.isOpenWardModal && (
          <WardSelectModal
            closeModal={this.closeModal}
            ward_master={this.state.ward_master}
            room_master={this.state.hospital_room_master}
            hospital_bed_master={this.state.hospital_bed_master}
            handleOk={this.setWard}
            MasterName={`病棟・病室選択`}
            hospital_date={this.state.date_and_time_of_hospitalization}
            from_modal={'hospitalized_setting'}
            use_beds={this.state.use_beds}
          />
        )}
        {this.state.isOpenSelectDiseaseModal && (
          <SelectMedicineModal
            closeModal = {this.closeModal}
            system_patient_id={this.state.hos_patient_list[this.state.selected_index]['patient_id']}
            selectDiseaseName={this.selectDiseaseName}
          />
        )}
        {this.state.confirm_message !== "" && (
          <ConfirmNoFocusModal
            hideConfirm= {this.closeModal.bind(this)}
            confirmCancel= {this.closeModal.bind(this)}
            confirmOk= {this.confirmOk}
            confirmTitle= {this.state.confirm_message}
            title = {this.state.confirm_title}
          />
        )}
        {this.state.complete_message !== '' && (
          <CompleteStatusModal
            message = {this.state.complete_message}
          />
        )}
        {this.state.alert_messages !== "" && (
          <AlertNoFocusModal
            hideModal= {this.closeModal.bind(this)}
            handleOk= {this.closeModal.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
      </Modal>
    )
  }
}

HospitalizedSetting.contextType = Context;
HospitalizedSetting.propTypes = {
  closeModal: PropTypes.func,
};
export default HospitalizedSetting;