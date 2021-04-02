import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import * as apiClient from "~/api/apiClient";
import {formatDateLine, formatDateSlash, formatTimeIE} from "~/helpers/date";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import axios from "axios/index";
import HospitalApplicationOrder from "~/components/templates/Patient/Modals/Hospital/HospitalApplicationOrder";
import DischargePermitOrder from "../Patient/Modals/Hospital/DischargePermitOrder";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Button from "~/components/atoms/Button";
import SelectModeModal from "~/components/templates/Patient/SelectModeModal";
import Context from "~/helpers/configureStore";
import Spinner from "react-bootstrap/Spinner";
import * as sessApi from "~/helpers/cacheSession-utils";
import SelectDoctorModal from "~/components/molecules/SelectDoctorModal";
registerLocale("ja", ja);
import KarteDischargeHospitalDecision from "~/components/templates/Ward/KarteDischargeHospitalDecision";

const Wrapper = styled.div`  
 width: 100%;
 height: 100%;
 font-size: 1rem;
 .flex{display: flex;}
 label {
   margin-bottom:0;
   height:2rem;
   line-height:2rem;
 }
 button {
  height: 2rem;
  font-size: 1rem;
 }
  .select-period {
    .period-title {
      line-height: 2rem;
      margin: 0;
      width: 5rem;
      font-size:1rem;
    }
    div {margin-top: 0;}
    .react-datepicker-popper {
      margin-top: 10px;
    }
    input {
      width:7rem;
      height:2rem;
      font-size:1rem;
    }
    .from-to{
      padding-left:5px;
      padding-right:5px;
      line-height: 2rem;
      font-size:1rem;
    }
    .label-title {
      width: 0;
      margin: 0;
    }
  }
  .pullbox-select {
      height: 2rem;
      width: 10rem;
      font-size:1rem;
  }
  .pullbox {
    .label-title {
      width: 4rem;
      text-align: right;
      line-height: 2rem;
      margin-right: 0.5rem;
      font-size:1rem;
    }
  }
  .radio-area {
      label {
          line-height: 2rem;
          font-size: 14px;
          width: 100px;
      }
  }
  .table-title {
      margin-top: 0.5rem;
      label {
          margin-bottom: 0;
      }
      .table-name {
          border: 1px solid #aaa;
          width: 10rem;
          text-align: center;
      }
      .table-color {
          width: 4rem;
          text-align: center;
      }
      .table-request {
        width: 3rem;
        text-align: center;
        border: 1px solid #aaa;
      }
      .table-ok {
          width: 3rem;
          text-align: center;
          border: 1px solid #aaa;
      }
  }
  .purple-row {
    background-color: rgb(208, 200, 251);
  }
  .pink-row {
    background-color: rgb(254, 230, 226);
  }
  .table-area {
    table {
      font-size: 1rem;
      margin-bottom: 0;
    }
    thead{
      margin-bottom: 0;
      display:table;
      width:100%;
      tr{width: calc(100% - 17px);}
    }
    tbody{
      height: 27vh;
      overflow-y: scroll;
      display:block;
    }
    tr{
      display: table;
      width: 100%;
      box-sizing: border-box;
    }
    td {
        padding: 0.25rem;
        text-align: left;
        vertical-align: middle;
        border-bottom: 1px solid #dee2e6;
    }
    th {
        text-align: center;
        padding: 0.3rem;
    }
    .tl {
        text-align: left;
    }
    .tr {
        text-align: right;
    }
    .white-row:hover {
      background-color: #f2f2f2;
    }
    .purple-row:hover {
      background:lightblue;
    }
    .pink-row:hover {
      background:lightblue;
    }
  }
  // .selected {
  //     background: rgb(105, 200, 225) !important;
  // }
  .react-datepicker-popper {
    .react-datepicker {
      .react-datepicker__navigation--previous, .react-datepicker__navigation--next {
        height:10px !important;
      }
    }
  }
  .mono-btn {
    padding:0 0.5rem;
    background-color: rgb(255, 255, 255);
    span {font-size:1rem;}
    height:2rem;
    line-height:1.8rem;
  }
  .print-btn {line-height:2rem;}
  .disable-btn {
    background: lightgray;
    cursor: auto;
    span {color: #595959 !important;}
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
    font-size: 14px;
    font-weight: normal;
    line-height: 22px;
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
      width: 2rem;
      height: 2rem;
    }
    svg {
      width: 2rem;
      margin: 8px 0;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .blue-text {
    color: blue;
  }
`;

const ContextMenu = ({visible,x,y,hos_data,cancel_act_menu_flag,parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.contextMenuAction("change_act", hos_data)}>修正</div></li>
          {cancel_act_menu_flag && (
            <li><div onClick={() => parent.contextMenuAction("cancel_act", hos_data)}>取り消し</div></li>
          )}
          {/*<li><div onClick={() => parent.contextMenuAction("delete_act")}>削除</div></li>*/}
          <li><div onClick={() => parent.contextMenuAction("karte_input", hos_data)}>カルテ入力</div></li>
          {/*<li><div onClick={() => parent.contextMenuAction("instruction_do_list")}>指示実施一覧</div></li>*/}
          {/*<li><div onClick={() => parent.contextMenuAction("move_meal")}>移動食事</div></li>*/}
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

const SpinnerWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class BedControlModal extends Component {
  constructor(props) {
    super(props);
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    let department_codes = [{id:0, value:"全て"}];
    let diagnosis = {};
    departmentOptions.map(department=>{
      department_codes.push(department);
      diagnosis[parseInt(department.id)] = department.value;
    });
    let last_week = new Date();
    last_week.setDate(last_week.getDate() - 7);
    let next_week = new Date();
    next_week.setDate(next_week.getDate() + 7);
    this.state = {
      start_date: last_week,
      end_date: next_week,
      ward_master:[{id:0, value:"全病棟"}],
      ward_names:{},
      urgency_master:{},
      discharge_route_master:{},
      hospital_room_master:{},
      outcome_reason_master:{},
      department_codes,
      diagnosis,
      department_id:0,
      first_ward_id:0,
      hospitalization_list:[],
      discharge_list:[],
      openOutHospitalization:false,
      hos_number:0,
      alert_messages:"",
      complete_message:"",
      openHospitalApplication:false,
      openDischargePermitOrder:false,
      confirm_message:"",
      confirm_type:"",
      pre_hos:0,
      next_hos:0,
      isOpenKarteModeModal:false,
      load_data:false,
      isOpenSelectDoctor:false,
    };
    this.doctors = sessApi.getDoctorList();
  }

  async componentDidMount() {
    await this.getMaster();
    await this.getScheduleList();
  }

  getMaster=async()=> {
    let path = "/app/api/v2/ward/get/bed_control/master_data";
    let post_data = {
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        let ward_master = this.state.ward_master;
        let ward_names = this.state.ward_names;
        let urgency_master = this.state.urgency_master;
        let discharge_route_master = this.state.discharge_route_master;
        let hospital_room_master = this.state.hospital_room_master;
        let outcome_reason_master = this.state.outcome_reason_master;
        if(res.ward_master.length > 0){
          res.ward_master.map(ward=>{
            ward_master.push({id:ward.number, value:ward.name});
            ward_names[ward.number] = ward.name;
          });
        }
        if(res.urgency_master.length > 0){
          res.urgency_master.map(urgency=>{
            urgency_master[urgency.number] = urgency.name;
          });
        }
        if(res.discharge_route_master.length > 0){
          res.discharge_route_master.map(route=>{
            discharge_route_master[route.number] = route.name;
          });
        }
        if(res.hospital_room_master.length > 0){
          res.hospital_room_master.map(room=>{
            hospital_room_master[room.number] = room.name;
          });
        }
        if(res.outcome_reason_master.length > 0){
          res.outcome_reason_master.map(reason=>{
            outcome_reason_master[reason.number] = reason.name;
          });
        }
        this.setState({
          ward_master,
          ward_names,
          urgency_master,
          discharge_route_master,
          hospital_room_master,
          outcome_reason_master,
        });
      })
      .catch(() => {

      });
  };

  getScheduleList=async()=>{
    if(this.state.load_data){
      this.setState({load_data:false});
    }
    let path = "/app/api/v2/ward/search/bed_control";
    let post_data = {
      first_ward_id:this.state.first_ward_id,
      start_date:(this.state.start_date != null && this.state.start_date !== "") ? formatDateLine(this.state.start_date) : "",
      end_date:(this.state.end_date != null && this.state.end_date !== "") ? formatDateLine(this.state.end_date) : "",
      department_id:this.state.department_id,
      pre_hos:this.state.pre_hos,
      next_hos:this.state.pre_hos,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          hospitalization_list:res.hospitalization_list,
          discharge_list:res.discharge_list,
          hos_number:0,
          load_data:true,
        });
      })
      .catch(() => {

      });
  };

  setPeriod=(key,value)=>{
    if(value == null || value == ""){
      value = new Date();
    }
    this.setState({[key]:value}, ()=>{
      this.getScheduleList();
    });
  };

  setWard=(e)=>{
    this.setState({first_ward_id:e.target.id}, ()=>{
      this.getScheduleList();
    });
  };

  getDepartment = e => {
    this.setState({
      department_id:e.target.id,
    }, ()=>{
      this.getScheduleList();
    });
  };

  closeModal=(act=null, message=null)=>{
    this.setState({
      openOutHospitalization:false,
      openHospitalApplication:false,
      openDischargePermitOrder:false,
      isOpenKarteModeModal:false,
      alert_messages:(act === "register" && message != null) ? message : "",
      confirm_message:"",
      confirm_type:"",
    },()=>{
      if(act === "register"){
        this.getScheduleList();
      }
    });
  };
  
  get_title_pdf = async () => {
    let pdf_file_name = "ベッドコントロール_";
    pdf_file_name = pdf_file_name + formatDateLine(this.state.start_date).split("-").join("") + "-" + formatDateLine(this.state.end_date).split("-").join("");
    return pdf_file_name+".pdf";
  }

  printPdf=async()=>{
    if(this.state.hospitalization_list.length === 0 && this.state.discharge_list.length === 0){return;}
    this.setState({complete_message:"印刷中"});
    let pdf_file_name = await this.get_title_pdf();
    let path = "/app/api/v2/ward/print/hospitalization_list";
    let print_data = {};
    print_data.hospitalization_list = this.state.hospitalization_list;
    print_data.discharge_list = this.state.discharge_list;
    print_data.ward_names = this.state.ward_names;
    print_data.urgency_master = this.state.urgency_master;
    print_data.discharge_route_master = this.state.discharge_route_master;
    print_data.hospital_room_master = this.state.hospital_room_master;
    print_data.outcome_reason_master = this.state.outcome_reason_master;
    print_data.diagnosis = this.state.diagnosis;
    print_data.start_date = formatDateLine(this.state.start_date);
    print_data.end_date = formatDateLine(this.state.end_date);
    print_data.ward_name = (this.state.ward_master.find((x) => x.id == this.state.first_ward_id) != undefined) ?
      this.state.ward_master.find((x) => x.id == this.state.first_ward_id).value : "";
    print_data.department_name = (this.state.department_codes.find((x) => x.id == this.state.department_id) != undefined) ?
      this.state.department_codes.find((x) => x.id == this.state.department_id).value : "";
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
  };

  openHospitalApplicationModal=(order, type=null)=>{
    let patientInfo = {};
    patientInfo.receId = order.patient_number;
    patientInfo.name = order.patient_name;
    patientInfo.sex = order.gender;
    patientInfo.age = order.age;
    patientInfo.age_month = order.age_month;

    this.setState({
      openHospitalApplication:true,
      patientId:order.patient_id,
      patientInfo,
      modal_type:(type == null && order.date_and_time_of_hospitalization == null) ? 'application' : 'decision',
    });
  };

  openOutHospitalization=(order, type=null)=>{
    let _state = {};
    _state.hos_data = order;
    _state.patient_id = order.patient_id;
    _state.hos_number = order.hos_number;
    if(type != null){
      _state.openOutHospitalization = true;
    } else {
      if(order.discharge_date != null){
        _state.openOutHospitalization = true;
      } else {
        _state.openDischargePermitOrder = true;
      }
    }
    this.setState(_state);
  };

  handleClick=(e, hos_data)=>{
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
      let cancel_act_menu_flag = true;
      if(hos_data.date_and_time_of_hospitalization == null){
        if (!this.context.$canDoAction(this.context.FEATURES.HOSPITAL_APPLY,this.context.AUTHS.DELETE) && !this.context.$canDoAction(this.context.FEATURES.HOSPITAL_APPLY,this.context.AUTHS.DELETE_PROXY)) {
          cancel_act_menu_flag = false;
        }
      }
      if(hos_data.date_and_time_of_hospitalization != null && hos_data.expected_discharge_date == null){
        if (!this.context.$canDoAction(this.context.FEATURES.HOSPITAL_DECISION,this.context.AUTHS.DELETE) && !this.context.$canDoAction(this.context.FEATURES.HOSPITAL_DECISION,this.context.AUTHS.DELETE_PROXY)) {
          cancel_act_menu_flag = false;
        }
      }
      if(hos_data.date_and_time_of_hospitalization != null && hos_data.expected_discharge_date != null && hos_data.discharge_date == null){
        if (!this.context.$canDoAction(this.context.FEATURES.DISCHARGE_PERMISSION,this.context.AUTHS.DELETE) && !this.context.$canDoAction(this.context.FEATURES.DISCHARGE_PERMISSION,this.context.AUTHS.DELETE_PROXY)) {
          cancel_act_menu_flag = false;
        }
      }
      if(hos_data.discharge_date != null){
        if (!this.context.$canDoAction(this.context.FEATURES.DISCHARGE_DECISION,this.context.AUTHS.DELETE) && !this.context.$canDoAction(this.context.FEATURES.DISCHARGE_DECISION,this.context.AUTHS.DELETE_PROXY)) {
          cancel_act_menu_flag = false;
        }
      }
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - 100,
          y: e.clientY + window.pageYOffset,
          hos_data,
          cancel_act_menu_flag
        },
      })
    }
  };

  contextMenuAction = (act, hos_data) => {
    if(act === "change_act"){
      if(hos_data.expected_discharge_date == null && hos_data.discharge_date == null){
        this.openHospitalApplicationModal(hos_data);
      } else {
        this.openOutHospitalization(hos_data);
      }
    }
    if(act === "cancel_act"){
      let confirm_message = "";
      let confrim_type = "";
      if(hos_data.date_and_time_of_hospitalization == null){
        confirm_message = "入院申込を取り消します。よろしいですか？";
        confrim_type = "cancel_application";
      }
      if(hos_data.date_and_time_of_hospitalization != null && hos_data.expected_discharge_date == null){
        confirm_message = "入院決定を取り消します。よろしいですか？";
        confrim_type = "cancel_decision";
      }
      if(hos_data.date_and_time_of_hospitalization != null && hos_data.expected_discharge_date != null && hos_data.discharge_date == null){
        confirm_message = "退院許可を取り消します。よろしいですか？";
        confrim_type = "cancel_discharge-permit";
      }
      if(hos_data.discharge_date != null){
        confirm_message = "退院決定を取り消します。よろしいですか？";
        confrim_type = "cancel_discharge-decision";
      }
      this.setState({
        confirm_message,
        confrim_type,
        hos_data,
      });
    }
    if(act == "karte_input" ){
      this.goKartePage(hos_data.patient_id, hos_data.department_id);
    }
    // let _state = {};
    // _state.hos_data = hos_data;

    // switch(act){
    //   case "delete_act":
    //     break;
    //   case "instruction_do_list":
    //     break;
    //   case "move_meal":
    //     break;
    // }

    // this.setState(_state);
  };

  confirmOk=()=>{
    if(this.state.confrim_type.split('_')[0] === "cancel"){
      let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
        this.setState({
          confirm_message:"",
          isOpenSelectDoctor: true
        });
      } else {
        this.cancelAction(this.state.confrim_type.split('_')[1], this.state.hos_data);
        this.closeModal();
      }
    }
  }

  cancelAction=async(action, hos_data)=>{
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let path = "/app/api/v2/ward/cancel/hospital";
    let post_data = {
      action,
      hos_number:hos_data.hos_number,
      detail_id:hos_data.id,
      patient_id:hos_data.patient_id,
      doctor_code:authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code,
      doctor_name:authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        if(res.alert_message !== undefined || res.error_message !== undefined){
          this.setState({
            confrim_type:"",
            confrim_message:"",
            alert_messages:res.alert_message !== undefined ? res.alert_message : res.error_message,
          },()=>{
            this.getScheduleList();
          });
        } else {
          this.closeModal();
        }
      })
      .catch(() => {

      });
  }

  getCheckedDm = (name, value) => {
    if (name != ""){
      this.setState({ [name]: value });
    }
  };

  goKartePage = async(systemPatientId, diagnosis_code, index=null) => {
    if(index != null){
      this.setState({selected_index:index});
    }
    let patients_list = this.context.patientsList;
    let isExist = 0;
    patients_list.map(item=>{
      if (item.system_patient_id == systemPatientId) {
        isExist = 1;
      }
    });
    if (patients_list != undefined && patients_list != null && patients_list.length > 3 && isExist == 0) {
      this.setState({alert_messages: '4人以上の患者様を編集することはできません。'});
      return;
    }
    if (isExist == 0) { // new patient connect
      let modal_data = {
        systemPatientId,
        diagnosis_code,
        diagnosis_name : this.state.diagnosis[diagnosis_code],
        department : this.state.diagnosis[diagnosis_code],
      };
      this.setState({
        isOpenKarteModeModal: true,
        modal_data,
      });
    } else { // exist patient connect
      this.goToUrlFunc(systemPatientId);
    }
  }

  goToUrlFunc = (patient_id) => {
    this.props.goKartePage(patient_id);
    this.setState({
      isOpenKarteModeModal: false,
    });
    this.props.closeModal();
  };

  closeBedControl=()=>{
    this.props.closeModal();
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
    this.setState({
      isOpenSelectDoctor:false,
      confirm_message:"",
    }, ()=>{
      this.cancelAction(this.state.confrim_type.split('_')[1], this.state.hos_data);
    })
  }

  render() {
    return (
      <>
        <Modal
          show={true}
          id="outpatient"
          className="custom-modal-sm patient-exam-modal bed-control-modal first-view-modal"
        >
          <Modal.Header><Modal.Title>ベッドコントロール</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className={'flex'}>
                <div className={'select-period flex'}>
                  <div className={'period-title'}>入院期間</div>
                  <InputWithLabel
                    type="date"
                    getInputText={this.setPeriod.bind(this, 'start_date')}
                    diseaseEditData={this.state.start_date}
                  />
                  <div className={'from-to'}>～</div>
                  <InputWithLabel
                    type="date"
                    getInputText={this.setPeriod.bind(this, 'end_date')}
                    diseaseEditData={this.state.end_date}
                  />
                </div>
                <div className={'select-ward'}>
                  <SelectorWithLabel
                    title="病棟"
                    options={this.state.ward_master}
                    getSelect={this.setWard}
                    departmentEditCode={this.state.first_ward_id}
                  />
                </div>
                <div className={'select-department'}>
                  <SelectorWithLabel
                    title="診療科"
                    options={this.state.department_codes}
                    getSelect={this.getDepartment}
                    departmentEditCode={this.state.department_id}
                  />
                </div>
              </div>
              {/*<div className={'radio-area flex'}>*/}
                {/*<Checkbox*/}
                  {/*label="入院前"*/}
                  {/*getRadio={this.getCheckedDm.bind(this)}*/}
                  {/*value={this.state.pre_hos === 1}*/}
                  {/*name="pre_hos"*/}
                {/*/>*/}
                {/*<Checkbox*/}
                  {/*label="入院済"*/}
                  {/*getRadio={this.getCheckedDm.bind(this)}*/}
                  {/*value={this.state.next_hos === 1}*/}
                  {/*name="next_hos"*/}
                {/*/>*/}
              {/*</div>*/}
              <div className={'flex'} style={{marginTop:"0.5rem"}}>
                <Button type="mono" className={'mono-btn'} onClick={this.getScheduleList}>最新表示</Button>
                {/*<div style={{textAlign:"right", marginLeft:"auto", marginRight:0}}>*/}
                  {/*<button style={{marginLeft:"10px"}}>検索条件</button>*/}
                {/*</div>*/}
              </div>
              <div className={'table-title flex'}>
                <label className={'table-name'}>転入・入院予定一覧</label>
                <label className={'table-color'}>背景色</label>
                <label className={'table-request'}>申込</label>
                <label className={'purple-row table-ok'}>確定</label>
                <div style={{marginLeft:"1rem", lineHeight:"2rem"}}>※転棟決定および、転棟決定の修正・取消は、転入・入院予定一覧で行います。</div>
              </div>
              <div className={'table-area'}>
                <table className="table-scroll table table-bordered">
                  <thead>
                  <tr>
                    <th style={{width:"5rem"}}>状態</th>
                    <th style={{width:"3rem"}}>区分</th>
                    <th style={{width:"8rem"}}>緊急度</th>
                    <th style={{width:"6rem"}}>申し込み日</th>
                    <th style={{width:"9rem"}}>希望日・決定</th>
                    <th style={{width:"6rem"}}>患者ID</th>
                    <th style={{width:"12rem"}}>患者氏名</th>
                    <th style={{width:"3rem"}}>性別</th>
                    <th style={{width:"4rem"}}>年齢</th>
                    <th style={{width:"6rem"}}>診療科</th>
                    <th>病名</th>
                    <th style={{width:"12rem"}}>担当医</th>
                    <th style={{width:"12rem"}}>申込者</th>
                  </tr>
                  </thead>
                  <tbody>
                  {this.state.load_data ? (
                    <>
                      {this.state.hospitalization_list.length > 0 && (
                        this.state.hospitalization_list.map(order=>{
                          let cur_status = "入院";
                          if(order.out_in_flag == 0){
                            let stop_serving_date = new Date(order.stop_serving_date.split("-").join("/")).getTime();
                            let start_date = new Date(order.start_date.split("-").join("/")).getTime();
                            if(new Date().getTime() >= stop_serving_date){
                              cur_status = "外泊中";
                              if(new Date().getTime() == start_date){
                                cur_status = "帰院予定";
                              }
                            }
                          }
                          return (
                            <>
                              <tr
                                className={(order.date_and_time_of_hospitalization == null ? "white-row" : "purple-row") + (this.state.hos_number === order.hos_number ? ' selected' : "")}
                                onContextMenu={e => this.handleClick(e, order)}
                              >
                                <td style={{width:"5rem"}}>{cur_status}</td>
                                <td style={{width:"3rem"}}>{order.date_and_time_of_hospitalization != null ? "確定" : "申込"}</td>
                                <td style={{width:"8rem"}}>{this.state.urgency_master[order.urgency_id] !== undefined ? this.state.urgency_master[order.urgency_id] : ""}</td>
                                <td style={{width:"6rem"}}>{order.updated_at != null ? formatDateSlash(order.updated_at.split(" ")[0]) : ""}</td>
                                <td style={{width:"9rem"}}>
                                  {order.date_and_time_of_hospitalization != null
                                    ? (formatDateSlash(order.date_and_time_of_hospitalization.split(" ")[0])+ " " +
                                      (order.date_and_time_of_hospitalization.split(" ")[1] == "00:00:00" ? "未指定" : formatTimeIE(order.date_and_time_of_hospitalization.split("-").join('/'))))
                                    : ""}
                                </td>
                                <td style={{width:"6rem", textAlign:"right"}}>{order.patient_number}</td>
                                <td
                                  style={{width:"12rem", cursor:"pointer"}}
                                  onClick={this.openHospitalApplicationModal.bind(this, order, 'select-patient')}
                                >
                                  {order.patient_name}
                                </td>
                                <td style={{width:"3rem"}}>{order.gender == 1 ? '男' : '女'}</td>
                                <td style={{width:"4rem"}}>{order.age}歳</td>
                                <td style={{width:"6rem"}}>{this.state.diagnosis[order.department_id]}</td>
                                <td>{order.disease_name}</td>
                                <td style={{width:"12rem"}}>{order.main_doctor_name !== undefined ? order.main_doctor_name : ''}</td>
                                <td style={{width:"12rem"}}>{order.staff_name}</td>
                              </tr>
                            </>
                          )
                        })
                      )}
                    </>
                  ):(
                    <tr>
                      <td colSpan={'13'} style={{height:"10rem"}}>
                        <SpinnerWrapper>
                          <Spinner animation="border" variant="secondary" />
                        </SpinnerWrapper>
                      </td>
                    </tr>
                  )}
                  </tbody>
                </table>
              </div>
              <div className={'table-title flex'}>
                <label className={'table-name'}>転出・退院予定一覧</label>
                <label className={'table-color'}>背景色</label>
                <label className={'table-request'}>申込</label>
                <label className={'table-ok pink-row'}>確定</label>
                <div style={{marginLeft:"1rem", lineHeight:"2rem"}}>※転棟決定および、転棟決定の修正・取消は、転入・入院予定一覧で行います。</div>
              </div>
              <div className={'table-area'}>
                <table className="table-scroll table table-bordered">
                  <thead>
                  <tr>
                    <th style={{width:"5rem"}}>状態</th>
                    <th style={{width:"3rem"}}>区分</th>
                    <th style={{width:"9rem"}}>予定日</th>
                    <th style={{width:"6rem"}}>患者ID</th>
                    <th style={{width:"12rem"}}>患者氏名</th>
                    <th style={{width:"3rem"}}>性別</th>
                    <th style={{width:"4rem"}}>年齢</th>
                    <th style={{width:"6rem"}}>診療科</th>
                    <th style={{width:"6rem"}}>転帰</th>
                    <th>退院経路</th>
                    <th style={{width:"6rem"}}>病棟</th>
                    <th style={{width:"6rem"}}>病室</th>
                    <th style={{width:"10rem"}}>申込者</th>
                    <th style={{width:"10rem"}}>カナ氏名</th>
                  </tr>
                  </thead>
                  <tbody>
                  {this.state.load_data ? (
                    <>
                      {this.state.discharge_list.length > 0 && (
                        this.state.discharge_list.map(order=>{
                          let cur_status = "入院";
                          if(order.out_in_flag == 0){
                            let stop_serving_date = new Date(order.stop_serving_date.split("-").join("/")).getTime();
                            let start_date = new Date(order.start_date.split("-").join("/")).getTime();
                            if(new Date().getTime() >= stop_serving_date){
                              cur_status = "外泊中";
                              if(new Date().getTime() == start_date){
                                cur_status = "帰院予定";
                              }
                            }
                          }
                          return (
                            <>
                              <tr
                                className={(order.discharge_date == null ? "white-row" : "pink-row") + (this.state.hos_number === order.hos_number ? ' selected' : "")}
                                onContextMenu={e => this.handleClick(e, order)}
                              >
                                <td style={{width:"5rem"}}>{cur_status}</td>
                                <td style={{width:"3rem"}}>{order.discharge_date != null ? "確定" : "申込"}</td>
                                <td style={{width:"9rem"}}>
                                  {order.discharge_date == null
                                    ? (formatDateSlash(order.expected_discharge_date.split(" ")[0])+ " " +
                                      (order.expected_discharge_date.split(" ")[1] == "00:00:00" ? "未指定" : formatTimeIE(order.expected_discharge_date.split("-").join('/'))))
                                    :
                                    (formatDateSlash(order.discharge_date.split(" ")[0])+ " " +
                                      (order.discharge_date.split(" ")[1] == "00:00:00" ? "未指定" : formatTimeIE(order.discharge_date.split("-").join('/'))))
                                  }
                                </td>
                                <td style={{width:"6rem", textAlign:"right"}}>{order.patient_number}</td>
                                <td
                                  style={{width:"12rem", cursor:"pointer"}}
                                  onClick={this.openOutHospitalization.bind(this, order, 'select-patient')}
                                >{order.patient_name}</td>
                                <td style={{width:"3rem"}}>{order.gender == 1 ? '男' : '女'}</td>
                                <td style={{width:"4rem"}}>{order.age}歳</td>
                                <td style={{width:"6rem"}}>{this.state.diagnosis[order.department_id]}</td>
                                <td style={{width:"6rem"}}>{this.state.outcome_reason_master[order.outcome_reason_id]}</td>
                                <td>{this.state.discharge_route_master[order.discharge_route_id] !== undefined ? this.state.discharge_route_master[order.discharge_route_id] : ""}</td>
                                <td style={{width:"6rem"}}>{this.state.ward_names[order.first_ward_id] !== undefined ? this.state.ward_names[order.first_ward_id] : ""}</td>
                                <td style={{width:"6rem"}}>{this.state.hospital_room_master[order.hospital_room_id] !== undefined ? this.state.hospital_room_master[order.hospital_room_id] : ""}</td>
                                <td style={{width:"10rem"}}>{order.staff_name}</td>
                                <td style={{width:"10rem"}}>{order.staff_name_kana}</td>
                              </tr>
                            </>
                          )
                        })
                      )}
                    </>
                  ):(
                    <tr>
                      <td colSpan={'14'} style={{height:"10rem"}}>
                        <SpinnerWrapper>
                          <Spinner animation="border" variant="secondary" />
                        </SpinnerWrapper>
                      </td>
                    </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.closeBedControl}>閉じる</Button>
            <Button
              className={(this.state.hospitalization_list.length === 0 && this.state.discharge_list.length === 0) ? 'disable-btn' : 'red-btn'}
              onClick={this.printPdf}
              isDisabled={this.state.hospitalization_list.length === 0 && this.state.discharge_list.length === 0}
            >印刷</Button>
          </Modal.Footer>
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
          />
          {this.state.openOutHospitalization && (
            <KarteDischargeHospitalDecision
              closeModal={this.closeModal}
              patientId={this.state.patient_id}
            />
          )}
          {this.state.openDischargePermitOrder && (
            <DischargePermitOrder
              closeModal={this.closeModal}
              patientId={this.state.patient_id}
            />
          )}
          {this.state.openHospitalApplication && (
            <HospitalApplicationOrder
              closeModal={this.closeModal}
              type={this.state.modal_type}
              patientId={this.state.patientId}
              patientInfo={this.state.patientInfo}
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
          {this.state.confirm_message !== "" && (
            <SystemConfirmJapanModal
              hideConfirm= {this.closeModal.bind(this)}
              confirmCancel= {this.closeModal.bind(this)}
              confirmOk= {this.confirmOk.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.isOpenKarteModeModal && (
            <SelectModeModal
              modal_data={this.state.modal_data}
              goToUrl={this.goToUrlFunc.bind(this)}
              closeModal={this.closeModal}
              modal_type={'bed_control'}
            />
          )}
          {this.state.isOpenSelectDoctor && (
            <SelectDoctorModal
              closeDoctor={this.confirmCancel}
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

BedControlModal.contextType = Context;
BedControlModal.propTypes = {
  closeModal: PropTypes.func,
  goKartePage: PropTypes.func,
};

export default BedControlModal;
