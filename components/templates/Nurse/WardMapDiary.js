import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import Button from "~/components/atoms/Button";
import {formatDateLine} from "~/helpers/date";
import * as apiClient from "~/api/apiClient";
import Spinner from "react-bootstrap/Spinner";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Checkbox from "~/components/molecules/Checkbox";
import DatePicker, { registerLocale } from "react-datepicker";
import renderHTML from 'react-render-html';
import SelectDoctorModal from "~/components/molecules/SelectDoctorModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import ja from "date-fns/locale/ja";
import DiseaseNameModal from "~/components/templates/Patient/Modals/Disease/DiseaseNameModal";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import StateBatchRegist from "../Ward/StateBatchRegist";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import axios from "axios/index";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

registerLocale("ja", ja);

const Wrapper = styled.div`
  height: 100%;
  font-size:1rem;
  .select-ward{
   width:auto;
   div{
    margin-top:0
   }
   .clickable{
     cursor: pointer;
   }

   .label-title{
    line-height: 2rem;
    font-size: 1rem;
    text-align: right;
    margin-right: 0.5rem;
   }
   .pullbox-label, .pullbox-select{
    width:100%;
    height:2rem;
    font-size:1rem;
   }
   .pullbox-label{
     margin-top:0rem;
     margin-bottom:0px;
   }
   .pullbox{
     width:auto;
   }
 }
 .left-area{
   width: calc(100% - 12rem);
   .blank-td {
     width: 1.8rem;
   }
  .content {
    height: calc(100% - 3rem);
    .table-area{
      height: calc(100% - 1.8rem);
      table{
        margin-bottom: 0;
        td {
          word-break: break-all;
          padding: 0 0.1rem;
          font-size:1rem;
          text-align:center;
          vertical-align: middle;
        }
      }
      .td-first {
        width: 2rem;
        vertical-align: top;
      }
      .scroll-table {
        overflow-y: scroll;
      }
      .w-3 {
        width: 3rem;
      }
      .w-5 {
        width: 5rem;
      }
    }
    .scroll-div {
      overflow-y: auto;
      width: 100%;
    }
    .last-table {
      height: calc(100% - 37rem);
    }
    .gray-back{
      background: #d9d9d9;
    }
    .gray2-td{
      background: #ebf1d2;
    }
    .td-one-letter {
      width: 2rem;
    }
    .td-date {
      width: 6rem;
    }
    .selected {
      background: lightblue;
    }
    .clickable {
      cursor: pointer;
    }
    .classification-td {
      width: 5rem;
    }
    .department-td {
      width: 6rem;
    }
    .room-td {
      width: 4rem;
    }
    .age-td {
      width: 3rem;
    }
    .td-one-letter{
      width: 2rem;
    }
    .note-td {
      width: 20rem;
    }
  }
 }
 .right-area {
   width: 11rem;
   margin-left: 1rem;
   button {
     width: 100%;
     margin-bottom: 1rem;
   }
 }
`;
const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display:flex;
  justify-content: center;
  align-items: center;
`;
class WardMapDiary extends Component {
    constructor(props) {
        super(props);
        let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
        let department_count = departmentOptions.length;
        for (var i = department_count; i < 20; i++) {
          departmentOptions.push({id:'', value:''});
        }
        this.departmentOptions = departmentOptions;
        this.state = {
          is_loaded: false,
          search_date: props.search_date,
          first_ward_id: props.first_ward_id != undefined ? props.first_ward_id : 0,      
          ward_master: props.ward_master != undefined ? props.ward_master : [{id:0, value:""}],
          work_info: [],
          ward_patient_numbers:[],
          department_patient_numbers:[],
          tab_id: 0,
          selectDoctorModal: false,
          doctor_division: '',
          work_division: [],
          hospital_transfer_data: [],
          out_hospital_data: [],
          out_come_data: [],
          transfer_manage: [],
          operation_manage: [],
          critically_ill_patient_manage: [],
          first_doctor: '',
          second_doctor: '',
          third_doctor: '',
          forth_doctor: '',
          fifth_doctor: '',
          isConfirmModal: false,
          isAddDiseaseNameModal: false,
          isOpenStateBatchRegist: false,
          alert_messages: "",
          complete_message: ""
      };
    }

    async UNSAFE_componentWillMount () {
      await this.getSearchResult();
    }
    onHide = () => {};

    getSearchResult = async()=> {
      let path = "/app/api/v2/nurse/ward_diary";
      this.setState({is_loaded: false});
      await apiClient.post(path, {params: {
        search_date: formatDateLine(this.state.search_date),
        first_ward_id: this.state.first_ward_id
      }})
      .then(res => {
        let ward_patient_numbers = res.ward_patient_numbers;
        let department_patient_numbers = res.department_patient_numbers;
        this.setState({
          ward_patient_numbers,
          department_patient_numbers,
          work_info: res.work_info,
          hospital_transfer_data: res.hospital_transfer_data,
          out_hospital_data: res.out_hospital_data,
          out_come_data: res.out_come_data,
          transfer_manage: res.transfer_manage,
          operation_manage: res.operation_manage,
          critically_ill_patient_manage: res.critically_ill_patient_manage,
          is_loaded: true
        });
      })
    }
    setWard=(e)=>{
      this.setState({first_ward_id:e.target.id},()=>{
        this.getSearchResult();
      });
    };

    getDate = (value) => {
      this.setState({search_date:value}, ()=>{
        this.getSearchResult();
      })
    };
    getDisplayCheck = (name,value) => {
      this.setState({[name]:value});
    };
    selectTab = (tab_id) => {
      this.setState({tab_id});
    }
    getDepartmentName = (str) => {
      if (str == '') return '&nbsp';
      let ret = '';
      for (var i = 0; i < str.length; i++) {
        ret += str.charAt(i) + '<br />';
      }
      return ret;
    };
    selectDoctor = (doctor_division) => {
      if (doctor_division == "first_doctor" && this.state.first_check != 1) return;
      if (doctor_division == "second_doctor" && this.state.second_check != 1) return;
      if (doctor_division == "third_doctor" && this.state.third_check != 1) return;
      if (doctor_division == "forth_doctor" && this.state.forth_check != 1) return;
      if (doctor_division == "fifth_doctor" && this.state.fifth_check != 1) return;
      this.setState({
        selectDoctorModal: true,
        doctor_division,
      });
    };
    closeDoctor = () => {
      this.setState({
        selectDoctorModal: false,
        doctor_division: '',
      });
    };
    getDoctor = e => {
        this.selectDoctorFromModal(e.target.id, e.target.getAttribute("label"));
    };

    selectDoctorFromModal = (id, name) => {
        this.setState({
            selectDoctorModal: false,
            [this.state.doctor_division]:name,
        })
    };
    save = () => {
      if (this.state.first_ward_id > 0) {
        this.setState({
          isConfirmModal: true,
          confirm_message: "登録しますか？",
          confirm_action: "save",
          confirm_title: '登録確認'
        });
      } else {
        window.sessionStorage.setItem('alert_messages', '病棟を選択してください。');
      }
    };
    confirmOK = async () =>{
      this.confirmCancel();
      let post_data = {
        search_date: formatDateLine(this.state.search_date),
        first_ward_id: this.state.first_ward_id,
        doctor_data: this.getDoctorDataArray(),
        ward_patient_numbers: this.state.ward_patient_numbers,
        department_patient_numbers: this.state.department_patient_numbers,
        work_info: this.state.work_info,
        hospital_transfer_data: this.state.hospital_transfer_data,
        out_hospital_data: this.state.out_hospital_data,
        out_come_data: this.state.out_come_data,
        transfer_manage: this.state.transfer_manage,
        operation_manage: this.state.operation_manage,
        critically_ill_patient_manage: this.state.critically_ill_patient_manage,
      };
      let path = "/app/api/v2/nurse/register_ward_diary";
      await apiClient.post(path, {params: post_data})
      .then(res => {
        if (res.alert_message != undefined) window.sessionStorage.setItem('alert_messages', res.alert_message);
        else window.sessionStorage.setItem('alert_messages', '失敗しました。');
      });
    }

    getDoctorDataArray = () => {
      let doctor_data = [];
      if (this.state.first_check == 1 && this.state.first_doctor != '')
        doctor_data.push({work_division:1, name_of_confirmer: this.state.first_doctor});
      if (this.state.second_check == 1 && this.state.second_doctor != '')
        doctor_data.push({work_division:2, name_of_confirmer: this.state.second_doctor});
      if (this.state.third_check == 1 && this.state.third_doctor != '')
        doctor_data.push({work_division:3, name_of_confirmer: this.state.third_doctor});
      if (this.state.forth_check == 1 && this.state.forth_doctor != '')
        doctor_data.push({work_division:4, name_of_confirmer: this.state.forth_doctor});
      if (this.state.fifth_check == 1 && this.state.fifth_doctor != '')
        doctor_data.push({work_division:4, name_of_confirmer: this.state.fifth_doctor});
      return doctor_data;  
    }
    confirmCancel() {
      this.setState({
          isConfirmModal: false,
          confirm_message: "",
          confirm_title: '',
          confirm_action:"",
          alert_messages: ""
      });
    }
    closeModal = () => {
      this.setState({
        isAddDiseaseNameModal: false,
        isOpenStateBatchRegist: false,
      })
    }
    openDiseaseModal = () => {
      if (this.state.system_patient_id == undefined) {
        this.setState({alert_messages:"患者様を選択してください。"});
        return;
      }
      this.setState({isAddDiseaseNameModal: true});
    };
    openBatchRegistModal = () => {
      this.setState({isOpenStateBatchRegist: true});
    };
    createBlankOutHospitalTable = (tr_count) => {
      if (tr_count.length > 2) return;
      let table = [];
      for (let i= 0; i < (3 - tr_count); i++) {
        table.push(
          <tr>
            <td className="classification-td">&nbsp;</td>
            <td className="department-td">&nbsp;</td>
            <td className="room-td">&nbsp;</td>
            <td colSpan="5"></td>
            <td className="age-td">&nbsp;</td>
            <td colSpan='3'>&nbsp;</td>
          </tr>
        )
      }
      return table;
    }
    createBlankHospitalTable = (tr_count) => {
      if (tr_count.length > 2) return;
      let table = [];
      for (let i= 0; i < (3 - tr_count); i++) {
        table.push(
          <tr>
            <td className="classification-td"></td>
            <td className="department-td"></td>
            <td className="room-td"></td>
            <td className='gray-back td-one-letter'>→</td>
            <td className="room-td"></td>
            <td colSpan="5"></td>
            <td className="age-td text-right"></td>
            <td colSpan='13'></td>
            <td colSpan="5"></td>
            <td colSpan='3'></td>
          </tr>
        )
      }
      return table;
    }
    createBlankOutComeTable = (tr_count) => {
      if (tr_count.length > 2) return;
      let table = [];
      for (let i= 0; i < (3 - tr_count); i++) {
        table.push(
          <tr>
            <td className="classification-td">  </td>
            <td className="room-td">  </td>
            <td colSpan="5">  </td>
            <td colSpan='3'>  </td>
            <td className='gray-back td-one-letter'>～</td>
            <td colSpan='3'>  </td>
          </tr>
        )
      }
      return table;
    }
    createBlankTransferTable = (tr_count) => {
      if (tr_count.length > 2) return;
      let table = [];
      for (let i= 0; i < (3 - tr_count); i++) {
        table.push(
          <tr>
            <td className="classification-td"/>
            <td colSpan="5"/>
            <td className="department-td"/>
            <td className="room-td"/>
            <td className='gray-back td-one-letter'>→</td>
            <td className="department-td"/>
            <td className="room-td"/>
          </tr> 
        )
      }
      return table;
    }
    createBlankOperationTable = (tr_count) => {
      if (tr_count.length > 2) return;
      let table = [];
      for (let i= 0; i < (3 - tr_count); i++) {
        table.push(
          <tr>
            <td className="room-td">&nbsp;</td>
            <td colSpan="5">&nbsp;</td>
            <td className="age-td">&nbsp;</td>
            <td colSpan='7'>&nbsp;</td>
          </tr> 
        )
      }
      return table;
    }
    createBlankUrgencyTable = (tr_count) => {
      if (tr_count.length > 2) return;
      let table = [];
      for (let i= 0; i < (3 - tr_count); i++) {
        table.push(
          <tr>
            <td className="classification-td"/>
            <td className="room-td"/>
            <td style={{width:"13rem"}}/>
            <td className='age-td text-right'/>
            <td colSpan='14'/>
            <td className="note-td">{` `}</td>
          </tr> 
        )
      }
      return table;
    };
  
    selectPatient = (system_patient_id) => {
      this.setState({system_patient_id});
    };
    printData = () => {
    this.setState({
      confirm_message:"",
      complete_message:"印刷中"
    });
    let path = "/app/api/v2/nurse/ward_diary/print_list";
    let print_data = {params:this.state};
    print_data.departmentOptions = this.departmentOptions;
    axios({
      url: path,
      method: 'POST',
      data:{print_data},
      responseType: 'blob', // important
    }).then((response) => {
      this.setState({complete_message:""});
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      let title = "病棟管理日誌" + ".pdf"
      if(window.navigator.msSaveOrOpenBlob) {
        //IE11 & Edge
        window.navigator.msSaveOrOpenBlob(blob, title);
      }
      else{
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', title); //or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    })
      .catch(() => {
        this.setState({
          complete_message:"",
          alert_messages:"印刷失敗",
        });
      })
  };

    render() {
      let {ward_patient_numbers, department_patient_numbers, work_info, hospital_transfer_data, out_hospital_data, out_come_data, transfer_manage,operation_manage, critically_ill_patient_manage} = this.state;
      return (
        <>
          <Modal show={true} className="custom-modal-sm patient-exam-modal medication-guidance-schedule first-view-modal" onHide={this.onHide}>
            <Modal.Header><Modal.Title>病棟管理日誌</Modal.Title></Modal.Header>
            <Modal.Body>
              <DatePickerBox style={{width:"100%", height:"100%"}}>
                <Wrapper>
                  <div className="w-100 d-flex h-100">
                    <div className="left-area">
                      <div className="header d-flex">
                        <span className="mr-3" style={{lineHeight:"2rem"}}>日付</span>
                        <DatePicker
                          locale="ja"
                          id='search_date_id'
                          selected={this.state.search_date}
                          onChange={this.getDate.bind(this)}
                          dateFormat="yyyy/MM/dd"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          dayClassName = {date => setDateColorClassName(date)}
                        />
                        <div className={'select-ward'}>
                          <SelectorWithLabel
                            title="病棟"
                            options={this.state.ward_master}
                            getSelect={this.setWard}
                            departmentEditCode={this.state.first_ward_id}
                          />
                        </div>
                      </div>
                      {this.state.is_loaded ? (
                        <div className="content border pl-3 w-100 mt-3">
                        <div className="w-100 d-flex">
                          <div className="w-50 text-center border-right" onClick={this.selectTab.bind(this, 0)} style={{cursor:"pointer"}}>患者数・移動情報等</div>
                          <div className="w-50 text-center" onClick={this.selectTab.bind(this, 1)} style={{cursor:"pointer"}}>勤務情報等</div>
                        </div>
                        {this.state.tab_id == 0 ? (
                          <div className="table-area">
                            <table className="table-scroll table table-bordered" id="code-table">
                              <tr>
                                <td className="td-first" rowSpan="9">患<br/>者<br/>数</td>
                                <td colSpan="3">定床</td>
                                <td colSpan="3">前日数</td>
                                <td colSpan="3">現在数</td>
                                <td colSpan="3">入院</td>
                                <td colSpan="3">退院</td>
                                <td colSpan="2">死亡</td>
                                <td colSpan="3">転入</td>
                                <td colSpan="3">転出</td>
                                <td colSpan="3">外出</td>
                                <td colSpan="2">外泊</td>
                                <td colSpan="2">付添</td>
                                <td colSpan="2">担送</td>
                                <td colSpan="2">護送</td>
                                <td colSpan="2">独歩</td>
                                <td colSpan="3">拘束中</td>
                                <td colSpan="2">入室</td>
                                <td colSpan="2">退室</td>
                              </tr>
                              <tr>
                                <td className="text-right" colSpan="3">{ward_patient_numbers[0]}</td>
                                <td className="text-right" colSpan="3">{ward_patient_numbers[1]}</td>
                                <td className="text-right" colSpan="3">{ward_patient_numbers[2]}</td>
                                <td className="text-right" colSpan="3">{ward_patient_numbers[3]}</td>
                                <td className="text-right" colSpan="3">{ward_patient_numbers[4]}</td>
                                <td className="text-right" colSpan="2">{ward_patient_numbers[5]}</td>
                                <td className="text-right" colSpan="3">{ward_patient_numbers[6]}</td>
                                <td className="text-right" colSpan="3">{ward_patient_numbers[7]}</td>
                                <td className="text-right" colSpan="3">{ward_patient_numbers[8]}</td>
                                <td className="text-right" colSpan="2">{ward_patient_numbers[9]}</td>
                                <td className="text-right" colSpan="2">{ward_patient_numbers[10]}</td>
                                <td className="text-right" colSpan="2">{ward_patient_numbers[11]}</td>
                                <td className="text-right" colSpan="2">{ward_patient_numbers[12]}</td>
                                <td className="text-right" colSpan="2">{ward_patient_numbers[13]}</td>
                                <td className="text-right" colSpan="3">{ward_patient_numbers[14]}</td>
                                <td className="text-right" colSpan="2">{ward_patient_numbers[15]}</td>
                                <td className="text-right" colSpan="2">{ward_patient_numbers[16]}</td>
                              </tr>
                              <tr>
                                {this.departmentOptions.map(item=>{
                                  return (
                                    <td rowSpan="5" style={{background:"lightblue"}} className={item.value == '' ? "blank-td":""} key={item}>{renderHTML(this.getDepartmentName(item.value))}</td>
                                  )
                                })}
                                <td colSpan="10" className="text-left">ストレッチグライド</td>
                                <td colSpan="2" className="text-right">0</td>
                                <td colSpan="10" className="text-left">アドバン</td>
                                <td colSpan="2" className="text-right">0</td>
                              </tr>
                              <tr>
                                <td colSpan="10" className="text-left">ウレタンマット</td>
                                <td colSpan="2" className="text-right">0</td>
                                <td colSpan="10" className="text-left">ビッグセル</td>
                                <td colSpan="2" className="text-right">0</td>
                              </tr>
                              <tr>
                                <td colSpan="10" className="text-left">アクアフロート</td>
                                <td colSpan="2" className="text-right">0</td>
                                <td colSpan="10" className="text-left">アクアフロート</td>
                                <td colSpan="2" className="text-right">0</td>
                              </tr>
                              <tr>
                                <td colSpan="10" className="text-left">プライム</td>
                                <td colSpan="2" className="text-right">0</td>
                                <td colSpan="10" className="text-left">その他</td>
                                <td colSpan="2" className="text-right">0</td>
                              </tr>
                              <tr>
                                <td colSpan="10">トライセル</td>
                                <td colSpan="2" className="text-right">0</td>
                                <td colSpan="10"></td>
                                <td colSpan="2" className="text-right">0</td>
                              </tr>
                              <tr>
                                {this.departmentOptions.map((item,index)=>{
                                  return (
                                    <td rowSpan="2" key={item}>{department_patient_numbers[index] != undefined ? department_patient_numbers[index]: ""}</td>
                                  )
                                })}
                                <td colSpan="10">手術件数</td>
                                <td colSpan="2" className="text-right"></td>
                                <td colSpan="10">新生児</td>
                                <td colSpan="2" className="text-right"></td>
                              </tr>
                              <tr>
                                <td colSpan="10">正常分娩件数</td>
                                <td colSpan="2" className="text-right"></td>
                                <td colSpan="10">異常分娩件数</td>
                                <td colSpan="2" className="text-right"></td>
                              </tr>
                            </table>
                            <div className="scroll-div border-bottom" style={{height:"7.6rem"}}>
                              <table className="table-scroll table table-bordered">
                                <tr>
                                  <td rowSpan={hospital_transfer_data.length >= 4 ? hospital_transfer_data.length + 1 : 4} className="td-first">入<br />院<br />・<br />転<br />入</td>
                                  <td className='gray2-td classification-td'>区分</td>
                                  <td className='gray2-td department-td'>診療科</td>
                                  <td className='gray2-td room-td'>元病室</td>
                                  <td className='gray2-td td-one-letter'>&nbsp;</td>
                                  <td className='gray2-td room-td'>先病室</td>
                                  <td colSpan="5" className='gray2-td'>患者氏名</td>
                                  <td className='age-td gray2-td'>年齢</td>
                                  <td colSpan='13' className='gray2-td' style={{width: "14.625rem"}}>主病名</td>
                                  <td colSpan='5' className='gray2-td'>主治医</td>
                                  <td colSpan='3' className='gray2-td'>時間</td>
                                </tr>
                                {hospital_transfer_data.length>0 && hospital_transfer_data.map((item,index)=>{
                                  return(
                                    <tr key={index} className={this.state.system_patient_id == item.patient_id ? "selected clickable":"clickable"} onClick={this.selectPatient.bind(this, item.patient_id)}>
                                      <td className="classification-td text-left">{item.movement_classification == 1 ? "入院":"転院"}</td>
                                      <td className="department-td text-left">{item.diagnosis_name}</td>
                                      <td className="room-td text-left">{item.origin_room}</td>
                                      <td className='gray-back td-one-letter'>→</td>
                                      <td className="room-td text-left">{item.room_name}</td>
                                      <td colSpan="5" className="text-left">{item.patient_name.trim()}</td>
                                      <td className="age-td text-right">{item.age}</td>
                                      <td colSpan='13' className="text-left" style={{width: "14.625rem"}}>{item.disease_name}</td>
                                      <td colSpan="5" className="text-left">{item.doctor_name}</td>
                                      <td colSpan='3' className={`td-date text-left`}>{item.date_and_time_of_hospitalization != null && item.date_and_time_of_hospitalization != '' ?
                                      item.date_and_time_of_hospitalization.substr(11,5) : ""}</td>
                                    </tr>
                                  )
                                })}
                                {this.createBlankHospitalTable(hospital_transfer_data.length)}
                              </table>
                            </div>
                            <div className="w-100 d-flex border " style={{height:"7.6rem"}}>
                              <div className="scroll-div w-50 h-100">
                                <table className="table-scroll table table-bordered">
                                  <tr>
                                    <td rowSpan={out_hospital_data.length >= 4 ? out_hospital_data.length + 1 : 4} className="td-first">退<br />院<br />・<br />転<br />出</td>
                                    <td className='gray2-td classification-td'>区分</td>
                                    <td className='gray2-td department-td'>診療科</td>
                                    <td className='gray2-td room-td'>元病室</td>
                                    <td className='gray2-td' colSpan="5">患者氏名</td>
                                    <td className='gray2-td age-td'>年齢</td>
                                    <td className='gray2-td' colSpan='3'>転帰</td>
                                  </tr>
                                  {out_hospital_data.length > 0 && out_hospital_data.map((item,index)=>{
                                    return (
                                      <tr key={index} className={this.state.system_patient_id == item.patient_id ? "selected clickable":"clickable"} onClick={this.selectPatient.bind(this, item.patient_id)}>
                                        <td className="classification-td text-left">退院</td>
                                        <td className="department-td text-left">{item.diagnosis_name}</td>
                                        <td className="room-td text-left">{item.room_name}</td>
                                        <td colSpan="5" className="text-left">{item.patient_name.trim()}</td>
                                        <td className="age-td text-right">{item.age}</td>
                                        <td colSpan='3' className="text-left">{item.reason}</td>
                                      </tr>
                                    )
                                  })}
                                  {this.createBlankOutHospitalTable(out_hospital_data.length)}
                                </table>
                              </div>
                              <div className="scroll-div w-50 h-100">
                                <table className="table-scroll table table-bordered">
                                  <tr>
                                    <td rowSpan={out_come_data.length >= 4 ? out_come_data.length + 1 : 4} className="td-first">外<br />出<br />・<br />外<br />泊</td>
                                    <td className='gray2-td classification-td'>区分</td>
                                    <td className='gray2-td room-td'>病室</td>
                                    <td className='gray2-td' colSpan="5">患者氏名</td>
                                    <td className='gray2-td' colSpan='3'>出棟</td>
                                    <td className='gray2-td td-one-letter'/>
                                    <td className='gray2-td' colSpan='3'>帰棟</td>
                                  </tr>
                                  {out_come_data.length > 0 && out_come_data.map ((item, index)=>{
                                    return (
                                      <tr key={index} className={this.state.system_patient_id == item.patient_id ? "selected clickable":"clickable"} onClick={this.selectPatient.bind(this, item.patient_id)}>
                                        <td className="classification-td text-left">{item.start_date == null ? "外泊" : "帰棟"}</td>
                                        <td className="room-td text-left">{item.room_name}</td>
                                        <td colSpan="5" className="text-left">{item.patient_name.trim()}</td>
                                        <td colSpan='3' className={`td-date text-left`}>{item.stop_serving_date != null ? item.stop_serving_date.substr(0,10) : ""}</td>
                                        <td className='gray-back td-one-letter text-left'>～</td>
                                        <td colSpan='3' className={`td-date text-left`}>{item.start_date != null ? item.start_date.substr(0,10) : ""}</td>
                                      </tr>
                                    )
                                  })}
                                  {this.createBlankOutComeTable(out_come_data.length)}
                                </table>
                              </div>
                            </div>
                            <div className="w-100 d-flex border" style={{height:"7.6rem"}}>
                              <div className="scroll-div w-50 h-100">
                                <table className="table-scroll table table-bordered">
                                  <tr>
                                    <td rowSpan={transfer_manage.length >= 4 ? transfer_manage.length + 1 : 4} className="td-first">転<br />科<br />・<br />転<br />室</td>
                                    <td className='gray2-td classification-td'>区分</td>
                                    <td className='gray2-td' colSpan="5">患者氏名</td>
                                    <td className='gray2-td department-td'>診療科</td>
                                    <td className='gray2-td room-td'>病室</td>
                                    <td className='gray2-td td-one-letter'/>
                                    <td className='gray2-td department-td'>診療科</td>
                                    <td className='gray2-td room-td'>病室</td>
                                  </tr>
                                  {transfer_manage.length > 0 && transfer_manage.map((item, index)=>{
                                    return (
                                      <tr key={index} className={this.state.system_patient_id == item.patient_id ? "selected clickable":"clickable"} onClick={this.selectPatient.bind(this, item.patient_id)}>
                                      <td className="classification-td text-left">{item.go_out_category_id}</td>
                                      <td colSpan="5" className="text-left">{item.patient_name}</td>
                                      <td className="department-td text-left">{item.original_department_name}</td>
                                      <td className="room-td text-left">{item.original_hospital_room_name}</td>
                                      <td className='gray-back td-one-letter'>→</td>
                                      <td className="department_id text-left">{item.chenged_department_name}</td>
                                      <td className="room-td text-left">{item.chenged_hospital_room_name}</td>
                                      </tr>
                                    )
                                  })}
                                  {this.createBlankTransferTable(transfer_manage.length)}
                                </table>
                              </div>
                              <div className="scroll-div w-50 h-100">
                                <table className="table-scroll table table-bordered">
                                  <tr>
                                    <td rowSpan={operation_manage.length >= 4 ? operation_manage.length + 1 : 4} className="td-first"><br />手<br /><br /><br />術<br /></td>
                                    <td className='gray2-td room-td'>病室</td>
                                    <td className='gray2-td' colSpan="5">患者氏名</td>
                                    <td className='gray2-td age-td'>年齢</td>
                                    <td className='gray2-td' colSpan='7'>術式</td>
                                  </tr>
                                  {operation_manage != undefined && operation_manage.length > 0 && operation_manage.map((item,index)=>{
                                    return (
                                      <tr key={index} className={this.state.system_patient_id == item.patient_id ? "selected clickable":"clickable"} onClick={this.selectPatient.bind(this, item.patient_id)}>
                                        <td className="room-td text-left">{item.room_name}</td>
                                        <td colSpan="5" className="text-left">{item.patient_name}</td>
                                        <td className="age-td text-right">{item.age}</td>
                                        <td colSpan='7' className="text-left">{item.surgery_name}</td>
                                      </tr>
                                    )
                                  })}
                                  {this.createBlankOperationTable(operation_manage.length)}
                                </table>
                              </div>
                            </div>
                            <div className="scroll-div last-table border">
                              <table className="table-scroll table table-bordered">
                                <tr>
                                  <td rowSpan={critically_ill_patient_manage.length >= 4 ? critically_ill_patient_manage.length + 1 : 4} className="td-first">重<br />症<br />・<br />症<br />注<br />意</td>
                                  <td className='gray2-td classification-td'>区分</td>
                                  <td className='gray2-td room-td'>病室</td>
                                  <td className='gray2-td' style={{width:"13rem"}}>患者氏名</td>
                                  <td className='gray2-td age-td'>年齢</td>
                                  <td className='gray2-td' colSpan='14'>病名</td>
                                  <td className='gray2-td note-td'>記事</td>
                                </tr>
                                {critically_ill_patient_manage != undefined && critically_ill_patient_manage.length > 0 && critically_ill_patient_manage.map((item,index)=>{
                                  return (
                                    <tr key={index} className={this.state.system_patient_id == item.patient_id ? "selected clickable":"clickable"} onClick={this.selectPatient.bind(this, item.patient_id)}>
                                      <td className="classification-td text-left">{item.urgency_name} {item.rest_name}</td>
                                      <td className="room-td text-left">{item.room_name}</td>
                                      <td style={{width:"13rem"}} className="text-left">{item.patient_name}</td>
                                      <td className='age-td text-right'>{item.age}</td>
                                      <td colSpan='14' className="text-left">{item.disease_name}</td>
                                      <td className="note-td text-left">{` `}</td>
                                    </tr>
                                  )
                                })}
                                {this.createBlankUrgencyTable(critically_ill_patient_manage.length)}
                              </table>
                            </div>
                          </div>
                        ):(
                          <div className="table-area">
                            <table className="table-scroll table table-bordered" style={{height:"100%"}}>
                              <tr style={{height: "1%"}}>
                                <td rowSpan="4">勤<br/>務<br/>区<br/>分</td>
                                <td rowSpan="2">看<br/>護<br/>師</td>
                                <td className="w-30">日		勤</td>
                                <td className="w-10">夜	勤	明	け</td>
                                <td className="w-10">夜	勤	入	り</td>
                                <td className="w-20">週	休</td>
                                <td className="w-10">有	休</td>
                                <td className="w-10">欠	勤</td>
                                <td className="w-10">特	休</td>
                              </tr>
                              <tr style={{height:"33%"}}>
                              {work_info[1] != undefined && work_info[1].length > 0 ? (
                                <>
                                  {work_info[1].map(item=>{
                                    return(
                                      <td className="w-30" key={item}>{item}&nbsp;</td>
                                    )
                                  })}
                                </>
                              ):(<>
                                <td className="w-30">&nbsp;</td>
                                <td className="w-10">&nbsp;</td>
                                <td className="w-10">&nbsp;</td>
                                <td className="w-20">&nbsp;</td>
                                <td className="w-10">&nbsp;</td>
                                <td className="w-10">&nbsp;</td>
                                <td className="w-10">&nbsp;</td>
                              </>)}
                              </tr>
                              <tr style={{height:"33%"}}>
                                <td>准<br/>看</td>
                                {work_info[2] != undefined && work_info[2].length > 0 ? (
                                  <>
                                    {work_info[2].map(item=>{
                                      return(
                                        <td className="w-30" key={item}>{item}&nbsp;</td>
                                      )
                                    })}
                                  </>
                                ):(<>
                                  <td className="w-30">&nbsp;</td>
                                  <td className="w-10">&nbsp;</td>
                                  <td className="w-10">&nbsp;</td>
                                  <td className="w-20">&nbsp;</td>
                                  <td className="w-10">&nbsp;</td>
                                  <td className="w-10">&nbsp;</td>
                                  <td className="w-10">&nbsp;</td>
                                </>)}
                              </tr>
                              <tr style={{height:"33%"}}>
                                <td>補<br/>助<br/>者</td>
                                {work_info[3] != undefined && work_info[3].length > 0 ? (
                                  <>
                                    {work_info[3].map(item=>{
                                      return(
                                        <td className="w-30" key={item}>{item}&nbsp;</td>
                                      )
                                    })}
                                  </>
                                ):(<>
                                  <td className="w-30">&nbsp;</td>
                                  <td className="w-10">&nbsp;</td>
                                  <td className="w-10">&nbsp;</td>
                                  <td className="w-20">&nbsp;</td>
                                  <td className="w-10">&nbsp;</td>
                                  <td className="w-10">&nbsp;</td>
                                  <td className="w-10">&nbsp;</td>
                                </>)}
                              </tr>
                            </table>
                          </div>
                        )}
                      </div>
                      ):(
                        <SpinnerWrapper>
                          <Spinner animation="border" variant="secondary" />
                        </SpinnerWrapper>
                      )}
                    </div>
                    <div className="right-area">
                      <Button type="common" onClick={this.getSearchResult}>取込</Button>
                      <Button type="common" onClick={this.openDiseaseModal.bind(this)}>病名・観察理由</Button>
                      <Button type="common" onClick={this.openBatchRegistModal.bind(this)}>状態一括登録</Button>
                      <Button type="common" onClick={this.selectTab.bind(this, 1)}>勤務表記録</Button>
                      <div className="mt-4 mb-3">サイン</div>
                      <Checkbox
                        label='早出'
                        id={`display_check`}
                        getRadio={this.getDisplayCheck.bind(this)}
                        value={this.state.first_check}
                        name="first_check"
                      />
                      <div className='w-100 text-center' style={{background:"lightblue"}} >確認者氏名</div>
                      <div className="w-100 text-center border mb-2 clickable" onClick={this.selectDoctor.bind(this,"first_doctor")}>{this.state.first_doctor}&nbsp;</div>
                      <Checkbox
                        label='日勤'
                        id={`display_check`}
                        getRadio={this.getDisplayCheck.bind(this)}
                        value={this.state.second_check}
                        name="second_check"
                      />
                      <div className='w-100 text-center' style={{background:"lightblue"}}>確認者氏名</div>
                      <div className="w-100 text-center border mb-2 clickable" onClick={this.selectDoctor.bind(this,"second_doctor")}>{this.state.second_doctor}&nbsp;</div>
                      <Checkbox
                        label='遅出'
                        id={`display_check`}
                        getRadio={this.getDisplayCheck.bind(this)}
                        value={this.state.third_check}
                        name="third_check"
                      />
                      <div className='w-100 text-center' style={{background:"lightblue"}}>確認者氏名</div>
                      <div className="w-100 text-center border mb-2 clickable" onClick={this.selectDoctor.bind(this,"third_doctor")}>{this.state.third_doctor}&nbsp;</div>
                      <Checkbox
                        label='夜勤'
                        id={`display_check`}
                        getRadio={this.getDisplayCheck.bind(this)}
                        value={this.state.forth_check}
                        name="forth_check"
                      />
                      <div className='w-100 text-center' style={{background:"lightblue"}}>確認者氏名</div>
                      <div className="w-100 text-center border mb-2 clickable" onClick={this.selectDoctor.bind(this,"forth_doctor")}>{this.state.forth_doctor}&nbsp;</div>
                      <Checkbox
                        label='看護師長'
                        id={`display_check`}
                        getRadio={this.getDisplayCheck.bind(this)}
                        value={this.state.fifth_check}
                        name="fifth_check"
                      />
                      <div className='w-100 text-center' style={{background:"lightblue"}}>確認者氏名</div>
                      <div className="w-100 text-center border mb-2 clickable" onClick={this.selectDoctor.bind(this,"fifth_doctor")}>{this.state.fifth_doctor}&nbsp;</div>
                    </div>
                  </div>
                </Wrapper>
              </DatePickerBox>
            </Modal.Body>
            <Modal.Footer>
              <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
              <Button className="red-btn" onClick={this.save.bind(this)}>確定</Button>
              <Button className="red-btn" onClick={this.printData}>印刷</Button>

            </Modal.Footer>
            {this.state.selectDoctorModal && (
              <SelectDoctorModal
                closeDoctor={this.closeDoctor}
                getDoctor={this.getDoctor}
                selectDoctorFromModal={this.selectDoctorFromModal}
              />
            )}
            {this.state.isConfirmModal != false && (
              <SystemConfirmJapanModal
                hideConfirm= {this.confirmCancel.bind(this)}
                confirmCancel= {this.confirmCancel.bind(this)}
                confirmOk= {this.confirmOK.bind(this)}
                confirmTitle= {this.state.confirm_message}
                title={this.state.confirm_title}
              />
            )}
            {this.state.isAddDiseaseNameModal && (
                <DiseaseNameModal
                  closeModal = {this.closeModal}
                  patientId={this.state.system_patient_id}
                />
            )}
            {this.state.isOpenStateBatchRegist && (
              <StateBatchRegist
                closeModal = {this.closeModal}
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

WardMapDiary.contextType = Context;
WardMapDiary.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  ward_master: PropTypes.array,
  first_ward_id: PropTypes.number,
  search_date: PropTypes.object,
};

export default WardMapDiary;