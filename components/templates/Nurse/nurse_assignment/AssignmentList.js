import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import * as apiClient from "~/api/apiClient";
import {formatDateLine, formatDateSlash} from "~/helpers/date";
import Button from "~/components/atoms/Button";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Spinner from "react-bootstrap/Spinner";
import NurseList from "./NurseList";
import axios from "axios/index";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";

const Wrapper = styled.div`  
 width: 100%;
 height: 100%;
 font-size: 1rem;
 overflow-y:auto;
 .flex{display: flex;}
 .justify-content {
  align-items: flex-start;
  justify-content: space-between;
 }
 .div-title {
   height:2rem;
   line-height:2rem;
 }
 .div-value {
   height:2rem;
   line-height:2rem;
   padding:0 0.3rem;
   border:1px solid #aaa;
 }
 .select-shift-pattern {
   margin-left:0.5rem;
   .label-title {
     width:5rem;
     margin:0;
     line-height: 2rem;
     font-size: 1rem;
   }
   .pullbox-label {
      margin-bottom:0;
      select {
        height: 2rem;
        font-size: 1rem;
        width: 7rem;
      }
   }
 }
 .left-area {
    width: calc(60% - 6rem);
 }
 .middle-area {
    width: 6rem;
    text-align: center;
 }
 .right-area {
   width:40%;
 }
 .table-area {
   width: 100%;
   table {
    width: 100%;
     margin:0;
     tbody{
       display:block;
       overflow-y: scroll;
       height:calc(80vh - 22rem);
       width:100%;
       tr:nth-child(even) {background-color: #f2f2f2;}
       tr:hover{background-color:#e2e2e2;}
     }
     tr{
       display: table;
       width: 100%;
     }
     thead{
       display:table;
       width:100%;    
       // border-bottom: 1px solid #dee2e6;    
       tr{width: calc(100% - 17px);}
       background-color: #a0ebff;
     }
     th {
       position: sticky;
       text-align: center;
       padding: 0.3rem;
       white-space:nowrap;
       border-bottom: 1px solid #dee2e6;
       vertical-align: middle;
     }
     td {
       padding: 0.25rem;
       word-break: break-all;
       .pullbox {
         .pullbox-title {display: none !important;}
         .pullbox-label {
           width:100%;
           margin-bottom:0;
           .pullbox-select {
             width:100%;
             height:2rem;
           }
         }
       }
     }
     .selected {background-color:lightblue !important;}
     .selected:hover {background-color:lightblue !important;}
   }  
 }
`;

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class AssignmentList extends Component {
  constructor(props) {
    super(props);
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.department_names = {};
    departmentOptions.map(department=>{
      this.department_names[parseInt(department.id)] = department.value;
    });
    this.state = {
      load_flag:false,
      select_allocation:props.select_allocation,
      shift_pattern_id:0,
      start_hour:0,
      start_minutes:0,
      service_classific:0,
      alert_messages:"",
      nurse_data:[],
      patient_list:[],
      selected_patients:[],
      selected_nurse:-1,
      isOpenNurseList:false,
      confirm_title: "",
      confirm_message: "",
      confirm_type: "",
      complete_message: "",
    };
    this.duty_master = [
      {id:0, value:""},
      {id:1, value:"〇"}
    ];
    this.shift_pattern_master = [{id:0, value:"", start_hour:0, start_minutes:0}];
    this.attendance_master = [{id:0, value:""}];
    this.change_flag = 0;
    this.attendance_names = {};
    this.room_names = {};
    this.bed_names = {};
    this.nurse_names = {};
    this.init_patients_ids = [];
  }

  async componentDidMount() {
  }

  async UNSAFE_componentWillMount () {
    await this.getMasterData();
    await this.getNursePatientList();
  }

  getMasterData=async()=>{
    let path = "/app/api/v2/nursing_service/get/master/assignment_list";
    let post_data = {
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        if(res.shift_pattern_master.length > 0){
          res.shift_pattern_master.map(pattern=>{
            this.shift_pattern_master.push({id:pattern.number, value:pattern.name, start_hour:pattern.start_hour, start_minutes:pattern.start_minutes});
          });
        }
        this.attendance_names = [];
        this.attendance_names[0] = "";
        if(res.attendance_master.length > 0){
          res.attendance_master.map(item=>{
            this.attendance_master.push({id:item.number, value:item.name});
            this.attendance_names[item.number] = item.name;
          });
        }
        if(res.nurse_master.length > 0){
          res.nurse_master.map(nurse=>{
            this.nurse_names[nurse.number] = nurse.name;
          })
        }
        if(res.hospital_room_master.length > 0){
          res.hospital_room_master.map(room=>{
            this.room_names[room.number] = room.name;
          })
        }
        if(res.hospital_bed_master.length > 0){
          res.hospital_bed_master.map(bed=>{
            this.bed_names[bed.number] = bed.name;
          })
        }
      })
      .catch(() => {

      });
  }

  getNursePatientList=async()=>{
    if(this.state.load_flag){
      this.setState({load_flag:false});
    }
    let path = "/app/api/v2/nursing_service/get/nursing_business_division";
    let post_data = {
      date:this.props.seleted_date,
      first_ward_id:this.props.first_ward_id,
      start_hour:this.state.start_hour,
      start_minutes:this.state.start_minutes,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.init_patients_ids = [];
        if(Object.keys(res.patient_list).length > 0){
          Object.keys(res.patient_list).map(room_number=>{
            let room_data = res.patient_list[room_number];
            if(Object.keys(room_data).length > 0){
              Object.keys(room_data).map(patient=>{
                this.init_patients_ids.push(patient.patient_id);
              })
            }
          })
        }
        this.patient_list_length = Object.keys(res.patient_list).length;
        this.setState({
          nurse_data:res.nurse_data,
          patient_list:res.patient_list,
          load_flag:true,
          selected_patients:[],
        });
      })
      .catch(() => {
      });
  }
  
  checkChangeStatus=()=>{
    let change_flag = false;
    let cur_patient_ids = [];
    let cur_patient_list_length = Object.keys(this.state.patient_list).length;
    if(this.init_patients_ids.length == 0 && cur_patient_list_length > 0){
      change_flag = true;
    }
    if(!change_flag && cur_patient_list_length > 0){
      Object.keys(this.state.patient_list).map(room_number=>{
        let room_data = this.state.patient_list[room_number];
        if(Object.keys(room_data).length > 0){
          Object.keys(room_data).map(patient=>{
            if(!this.init_patients_ids.includes(patient.patient_id)){
              change_flag = true;
            }
            cur_patient_ids.push(patient.patient_id);
          })
        }
      })
    }
    if(!change_flag && (this.init_patients_ids.length !== cur_patient_ids.length)){
      change_flag = true;
    }
    return change_flag;
  }

  setShiftPattern=(e)=>{
    let start_hour = this.shift_pattern_master.find((x) => x.id === parseInt(e.target.id)).start_hour;
    let start_minutes = this.shift_pattern_master.find((x) => x.id === parseInt(e.target.id)).start_minutes;
    let change_flag = this.checkChangeStatus();
    if(change_flag){
      this.shift_pattern_id = parseInt(e.target.id);
      this.start_hour = start_hour;
      this.start_minutes = start_minutes;
      this.last_shift_pattern_id = this.state.shift_pattern_id;
      this.setState({
        confirm_title: "クリア確認",
        confirm_message: "割り振り処理が確定していません。割り振り内容がクリアされますがよろしいですか？",
        confirm_type: "set_shift_pattern",
      });
    } else {
      this.setState({
        shift_pattern_id:parseInt(e.target.id),
        start_hour,
        start_minutes,
        load_flag:false,
      }, ()=>{
        this.getNursePatientList();
      });
    }
  };

  setAttendance =(nurse_idx, e)=>{
    let nurse_data = this.state.nurse_data;
    nurse_data[nurse_idx]['attendance_id'] = parseInt(e.target.id);
    this.setState({nurse_data});
  }

  setDuty =(nurse_idx, e)=>{
    let nurse_data = this.state.nurse_data;
    nurse_data[nurse_idx]['is_duty'] = parseInt(e.target.id);
    this.setState({nurse_data});
  }

  seletePatient=(number)=>{
    let selected_patients = this.state.selected_patients;
    let index = selected_patients.indexOf(number);
    if(index === -1){
      selected_patients.push(number);
    } else {
      selected_patients.splice(index, 1);
    }
    this.setState({
      selected_patients,
    });
  }

  getPatientsData=(nurse_idx)=>{
    if(this.state.selected_patients.length == 0){
      this.setState({alert_messages:"患者を選択してください。"});
      return;
    }
    this.change_flag = 1;
    let selected_patients = this.state.selected_patients;
    let move_data = [];
    let patient_list = [];
    if(this.state.select_allocation == 1){ //部屋単位
      Object.keys(this.state.patient_list).map(room_id=>{
        let index = selected_patients.indexOf(parseInt(room_id));
        if(index === -1){
          patient_list[room_id] = [];
          Object.keys(this.state.patient_list[room_id]).map(bed_id=>{
            patient_list[room_id][bed_id] = this.state.patient_list[room_id][bed_id];
          });
        } else {
          selected_patients.splice(index, 1);
          Object.keys(this.state.patient_list[room_id]).map(bed_id=>{
            move_data.push(this.state.patient_list[room_id][bed_id]);
          })
        }
      });
    } else { //患者単位
      Object.keys(this.state.patient_list).map(room_id=>{
        Object.keys(this.state.patient_list[room_id]).map(bed_id=>{
          let index = selected_patients.indexOf(parseInt(bed_id));
          if(index === -1){
            if(patient_list[room_id] == undefined){
              patient_list[room_id] = [];
            }
            patient_list[room_id][bed_id] = this.state.patient_list[room_id][bed_id];
          } else {
            selected_patients.splice(index, 1);
            move_data.push(this.state.patient_list[room_id][bed_id]);
          }
        });
      });
    }
    let nurse_data = this.state.nurse_data;
    move_data.map(patient=>{
      let data = {};
      data['ward_id'] = patient.first_ward_id;
      data['hospital_room_id'] = patient.hospital_room_id;
      data['hospital_bed_id'] = patient.hospital_bed_id;
      data['treatment_department'] = patient.department_id;
      data['patient_id'] = patient.patient_id;
      data['patient_name'] = patient.patient_name;
      data['nurse_id_in_charge'] = patient.nurse_id_in_charge;
      data['edit_flag'] = 1;
      nurse_data[nurse_idx]['patient_charge'].push(data);
    });
    this.setState({
      patient_list,
      nurse_data,
      selected_patients
    });
  }

  setAllocation=()=>{
    this.setState({
      select_allocation:this.state.select_allocation == 1 ? 2 : 1,
      selected_patients:[],
    });
  }

  selecteNurse=(nurse_idx)=>{
    this.setState({selected_nurse:nurse_idx});
  }

  movePatientList=()=>{
    if(this.state.selected_nurse == -1){
      this.setState({alert_messages:"看護師を選択してください。"});
      return;
    }
    let nurse_data= this.state.nurse_data;
    let patient_list= this.state.patient_list;
    if(nurse_data[this.state.selected_nurse]['patient_charge'].length == 0){
      return;
    }
    nurse_data[this.state.selected_nurse]['patient_charge'].map(patient=>{
      if(patient_list[patient.hospital_room_id] == undefined){
        patient_list[patient.hospital_room_id] = {};
      }
      let data = {};
      data['first_ward_id'] = patient['ward_id'];
      data['hospital_room_id'] = patient['hospital_room_id'];
      data['hospital_bed_id'] = patient['hospital_bed_id'];
      data['department_id'] = patient['treatment_department'];
      data['patient_id'] = patient['patient_id'];
      data['patient_name'] = patient['patient_name'];
      data['nurse_id_in_charge'] = patient['nurse_id_in_charge'];
      patient_list[patient.hospital_room_id][patient.hospital_bed_id] = data;
    });
    nurse_data[this.state.selected_nurse]['patient_charge'] = [];
    this.setState({
      nurse_data,
      patient_list
    });
  }

  closeModal = () => {
    let state_data = {};
    if(this.state.confirm_type == "set_shift_pattern"){
      state_data.shift_pattern_id = this.last_shift_pattern_id;
      let select_obj = document.getElementsByClassName("select-shift-pattern")[0].getElementsByTagName("select")[0];
      select_obj.selectedIndex = this.last_shift_pattern_id;
    }
    state_data.alert_messages = "";
    state_data.confirm_message = "";
    state_data.confirm_title = "";
    state_data.isOpenNurseList = false;
    this.setState(state_data);
  }

  openNurseList=()=>{
    if(this.state.nurse_data.length === 0){return;}
    this.setState({isOpenNurseList:true});
  }

  confirmRegister=()=>{
    this.setState({
      confirm_title: "登録確認",
      confirm_message: "登録しますか？",
      confirm_type: "register",
    })
  }

  confirmOk=()=>{
    if(this.state.confirm_type === "register"){
      this.register();
    }
    if(this.state.confirm_type === "set_shift_pattern"){
      this.setState({
        shift_pattern_id:this.shift_pattern_id,
        start_hour:this.start_hour,
        start_minutes:this.start_minutes,
        confirm_type: "",
        confirm_message: "",
        confirm_title: "",
      }, ()=>{
        this.getNursePatientList();
      });
    }
    if(this.state.confirm_type === "modal_close"){
      this.props.closeModal();
    }
  }

  register=async()=>{
    let path = "/app/api/v2/nursing_service/save/nursing_business_division";
    let post_data = {
      date:this.props.seleted_date,
      nurse_data:this.state.nurse_data
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        if(res.success_message != undefined){
          this.props.closeModal();
          window.sessionStorage.setItem("alert_messages", res.success_message);
        } else if(res.error_message != undefined){
          this.setState({
            complete_message:"",
            alert_messages:res.error_message
          });
        }
      })
      .catch(() => {

      });
  }
  
  get_title_pdf = async () => {
    let pdf_file_name = "看護師業務分担_";
    pdf_file_name = pdf_file_name + formatDateLine(this.props.seleted_date).split("-").join("");
    return pdf_file_name+".pdf";
  }
  
  printNurseList=async()=>{
    if(this.state.nurse_data.length === 0 || !this.state.load_flag){return;}
    this.setState({
      complete_message:"印刷中"
    });
    let pdf_file_name = await this.get_title_pdf();
    let path = "/app/api/v2/nursing_service/print/nursing_business_division";
    let print_data = {
      date:formatDateLine(this.props.seleted_date),
      ward_name:this.props.ward_name,
      shift_pattern_name:(this.shift_pattern_master.find((x) => x.id == this.state.shift_pattern_id) != undefined) ?
        this.shift_pattern_master.find((x) => x.id == this.state.shift_pattern_id).value : "",
      nurse_data:this.state.nurse_data,
      attendance_names:this.attendance_names,
      room_names:this.room_names,
      bed_names:this.bed_names,
      department_names:this.department_names,
      nurse_names:this.nurse_names,
    };
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
  
  confirmCloseModal=()=>{
    let change_flag = this.checkChangeStatus();
    if(change_flag){
      this.setState({
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type:"modal_close",
        confirm_title:'入力中',
      });
    } else {
      this.props.closeModal();
    }
  }

  render() {
    let confrim_flag = false;
    if(this.state.load_flag && this.state.patient_list.length == 0 && this.change_flag == 1){
      confrim_flag = true;
    }
    return (
      <>
        <Modal
          show={true}
          className="custom-modal-sm assignment-list first-view-modal"
        >
          <Modal.Header><Modal.Title>看護師業務分担</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className={'flex'}>
                <div className={'div-title'} style={{width:"3rem"}}>日付</div>
                <div className={'div-value'}>{formatDateSlash(this.props.seleted_date)}</div>
                <div className={'div-title'} style={{width:"3rem", marginLeft:"0.5rem"}}>病棟</div>
                <div className={'div-value'}>{this.props.ward_name}</div>
                <div className={'select-shift-pattern'}>
                  <SelectorWithLabel
                    title="勤務区分"
                    options={this.shift_pattern_master}
                    getSelect={this.setShiftPattern}
                    departmentEditCode={this.state.shift_pattern_id}
                  />
                </div>
              </div>
              <div className={'flex justify-content'} style={{marginTop:"0.5rem"}}>
                <div className={'left-area'}>
                  <div className={'div-title'}>患者選択後担当看護師の割振ボタンを押してください</div>
                  <Button type="common" onClick={this.setAllocation}>{this.state.select_allocation == 1 ? "部屋割振" : "患者割振"}</Button>
                </div>
                <div className={'middle-area'}>
                  <div className={'div-title'}>患者を戻す</div>
                  <Button
                    type="common"
                    onClick={this.movePatientList}
                    isDisabled={this.state.selected_nurse === -1 || !this.state.load_flag || (this.state.selected_nurse !== -1 && this.state.nurse_data[this.state.selected_nurse]['patient_charge'].length === 0)}
                    className={(this.state.selected_nurse === -1 || !this.state.load_flag || (this.state.selected_nurse !== -1 && this.state.nurse_data[this.state.selected_nurse]['patient_charge'].length === 0)) ? 'disable-btn' : ''}
                  >{'>>'}</Button>
                </div>
                <div className={'right-area'} style={{textAlign:"right"}}>
                  <Button
                    type="common"
                    onClick={this.openNurseList}
                    isDisabled={this.state.nurse_data.length === 0 || !this.state.load_flag}
                    className={(this.state.nurse_data.length === 0 || !this.state.load_flag) ? 'disable-btn' : ''}
                  >一覧表示</Button>
                </div>
              </div>
              <div className={'flex justify-content'} style={{marginTop:"0.5rem"}}>
                <div className={'table-area'} style={{width:"59%"}}>
                  <table className="table-scroll table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th style={{width:"10rem"}}>看護師名</th>
                        <th style={{width:"5rem"}}>出勤状況</th>
                        <th style={{width:"4rem"}}>当直</th>
                        <th style={{width:"3rem"}}>部屋</th>
                        <th style={{width:"4rem"}}>ベッド</th>
                        <th style={{width:"7rem"}}>診療科</th>
                        <th>患者氏名</th>
                        <th style={{width:"4rem"}}>チーム</th>
                        <th style={{width:"8rem"}}>担当看護師</th>
                        <th style={{width:"3.5rem"}}>割振</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.load_flag ? (
                        <>
                          {this.state.nurse_data.length > 0 && (
                            this.state.nurse_data.map((nurse, nurse_idx)=>{
                              return (
                                <>
                                  {nurse.patient_charge.length > 0 ? (
                                    nurse.patient_charge.map((patient, patient_idx)=>{
                                      return (
                                        <>
                                          <tr>
                                            <td
                                              style={{width:"10rem", cursor:patient_idx == 0 ? "pointer" : ""}}
                                              className={(patient_idx == 0 && this.state.selected_nurse == nurse_idx) ? "selected" : ""}
                                              onClick={this.selecteNurse.bind(this, nurse_idx)}
                                            >
                                              {patient_idx == 0 ? nurse.name : ""}
                                            </td>
                                            <td style={{width:"5rem", padding:0}}>
                                              {patient_idx == 0 && (
                                                <SelectorWithLabel
                                                  options={this.attendance_master}
                                                  title=""
                                                  getSelect={this.setAttendance.bind(this, nurse_idx)}
                                                  departmentEditCode={nurse.attendance_id}
                                                />
                                              )}
                                            </td>
                                            <td style={{width:"4rem", padding:0}}>
                                              {patient_idx == 0 && (
                                                <SelectorWithLabel
                                                  options={this.duty_master}
                                                  title=""
                                                  getSelect={this.setDuty.bind(this, nurse_idx)}
                                                  departmentEditCode={nurse.is_duty}
                                                />
                                              )}
                                            </td>
                                            <td style={{width:"3rem"}} className={(patient['edit_flag'] != undefined && patient['edit_flag'] == 1) ? "selected" : ""}>
                                              {this.room_names[patient.hospital_room_id]}</td>
                                            <td style={{width:"4rem"}} className={(patient['edit_flag'] != undefined && patient['edit_flag'] == 1) ? "selected" : ""}>
                                              {this.bed_names[patient.hospital_bed_id]}</td>
                                            <td style={{width:"7rem"}} className={(patient['edit_flag'] != undefined && patient['edit_flag'] == 1) ? "selected" : ""}>
                                              {this.department_names[patient.treatment_department]}</td>
                                            <td className={(patient['edit_flag'] != undefined && patient['edit_flag'] == 1) ? "selected" : ""}>
                                              {patient.patient_name}</td>
                                            <td style={{width:"4rem"}} className={(patient['edit_flag'] != undefined && patient['edit_flag'] == 1) ? "selected" : ""}>なし</td>
                                            <td style={{width:"8rem"}} className={(patient['edit_flag'] != undefined && patient['edit_flag'] == 1) ? "selected" : ""}>
                                              {this.nurse_names[patient.nurse_id_in_charge]}</td>
                                            <td style={{width:"3.5rem", padding:0}}>
                                              {patient_idx == 0 && (
                                                <button
                                                 style={{width:"100%", height:"2rem"}}
                                                 onClick={this.getPatientsData.bind(this, nurse_idx)}>{'<<'}</button>
                                              )}
                                            </td>
                                          </tr>
                                        </>
                                      )
                                    })
                                  ):(
                                    <>
                                      <tr>
                                        <td
                                         style={{width:"10rem", cursor:"pointer"}}
                                         className={this.state.selected_nurse == nurse_idx ? "selected" : ""}
                                         onClick={this.selecteNurse.bind(this, nurse_idx)}
                                        >{nurse.name}</td>
                                        <td style={{width:"5rem", padding:0}}>
                                          <SelectorWithLabel
                                            options={this.attendance_master}
                                            title=""
                                            getSelect={this.setAttendance.bind(this, nurse_idx)}
                                            departmentEditCode={nurse.attendance_id}
                                          />
                                        </td>
                                        <td style={{width:"4rem", padding:0}}>
                                          <SelectorWithLabel
                                            options={this.duty_master}
                                            title=""
                                            getSelect={this.setDuty.bind(this, nurse_idx)}
                                            departmentEditCode={nurse.is_duty}
                                          />
                                        </td>
                                        <td style={{width:"3rem"}}></td>
                                        <td style={{width:"4rem"}}></td>
                                        <td style={{width:"7rem"}}></td>
                                        <td></td>
                                        <td style={{width:"4rem"}}></td>
                                        <td style={{width:"8rem"}}></td>
                                        <td style={{width:"3.5rem", padding:0}}>
                                          <button
                                           style={{width:"100%", height:"2rem"}}
                                           onClick={this.getPatientsData.bind(this, nurse_idx)}>{'<<'}</button>
                                        </td>
                                      </tr>
                                    </>
                                  )}
                                </>
                              )
                            })
                          )}
                        </>
                      ):(
                        <tr>
                          <td colSpan={'3'}>
                            <SpinnerWrapper>
                              <Spinner animation="border" variant="secondary" />
                            </SpinnerWrapper>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className={'table-area'} style={{width:"40%"}}>
                  <table className="table-scroll table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th style={{width:"3rem"}}>部屋</th>
                        <th style={{width:"5.5rem"}}>ベッド</th>
                        <th style={{width:"7rem"}}>診療科</th>
                        <th>患者氏名</th>
                        <th style={{width:"4rem"}}>チーム</th>
                        <th style={{width:"8rem"}}>担当看護師</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.load_flag ? (
                        <>
                          {Object.keys(this.state.patient_list).length > 0 && (
                            Object.keys(this.state.patient_list).map(room_id=>{
                              return (
                                <>
                                  {Object.keys(this.state.patient_list[room_id]).map(bed_id=>{
                                    let item = this.state.patient_list[room_id][bed_id];
                                    return (
                                      <>
                                        <tr
                                          onClick={this.seletePatient.bind(this, this.state.select_allocation == 1 ? item.hospital_room_id : item.hospital_bed_id)}
                                          className={this.state.selected_patients.includes(this.state.select_allocation == 1 ? item.hospital_room_id : item.hospital_bed_id) ? "selected" : ""}
                                          style={{cursor:"pointer"}}
                                        >
                                          <td style={{width:"3rem"}}>{this.room_names[item.hospital_room_id]}</td>
                                          <td style={{width:"5.5rem"}}>{this.bed_names[item.hospital_bed_id]}</td>
                                          <td style={{width:"7rem"}}>{this.department_names[item.department_id]}</td>
                                          <td>{item.patient_name}</td>
                                          <td style={{width:"4rem"}}>なし</td>
                                          <td style={{width:"8rem"}}>{this.nurse_names[item.nurse_id_in_charge]}</td>
                                        </tr>
                                      </>
                                    )
                                  })}
                                </>
                              )
                            })
                          )}
                        </>
                      ):(
                        <tr>
                          <td colSpan={'3'}>
                            <SpinnerWrapper>
                              <Spinner animation="border" variant="secondary" />
                            </SpinnerWrapper>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.confirmCloseModal}>キャンセル</Button>
            {confrim_flag ? (
              <Button className={"red-btn"} onClick={this.confirmRegister}>{"確定"}</Button>
            ):(
              <Button className={"disable-btn"}>{"確定"}</Button>
            )}
            <Button
              onClick={this.printNurseList}
              isDisabled={this.state.nurse_data.length === 0 || !this.state.load_flag}
              className={(this.state.nurse_data.length === 0 || !this.state.load_flag) ? 'disable-btn' : 'red-btn'}
            >印刷</Button>
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
          {this.state.isOpenNurseList && (
            <NurseList
              closeModal={this.closeModal}
              nurse_data={this.state.nurse_data}
              attendance_names={this.attendance_names}
              room_names={this.room_names}
              bed_names={this.bed_names}
              department_names={this.department_names}
              nurse_names={this.nurse_names}
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
        </Modal>

      </>
    );
  }
}

AssignmentList.propTypes = {
  closeModal: PropTypes.func,
  first_ward_id: PropTypes.number,
  select_allocation: PropTypes.number,
  ward_name: PropTypes.string,
  seleted_date: PropTypes.string,
};

export default AssignmentList;
