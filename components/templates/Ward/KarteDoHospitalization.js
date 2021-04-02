import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import ja from "date-fns/locale/ja";
import DatePicker, { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import {formatDateLine, formatTimeIE} from "~/helpers/date";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import Spinner from "react-bootstrap/Spinner";
import {CACHE_LOCALNAMES, CACHE_SESSIONNAMES, getEnableChangeMeal} from "~/helpers/constants";
import WardSelectModal from "~/components/templates/Patient/Modals/Hospital/WardSelectModal";
import * as karteApi from "~/helpers/cacheKarte-utils";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";
const renderTooltip = (props) => <Tooltip {...props} className={'tooltip-area'}>{props}</Tooltip>;

const Wrapper = styled.div`
  display: block;
  width: 100%;
  height: 100%;
  .flex {display: flex;}
  .div-title {
    line-height: 2rem;
    width: 8rem;
  }
  .search-date {
    border: 1px solid #aaa;
    width: 10rem;
    background: white;
    height: 2rem;
    display:flex;
    align-items:center;
    padding-left:0.3rem;
  }
  .from-to {
    padding: 0 0.3rem;
    line-height: 2rem;
  }
  .table-area {
    width:100%;
    table {
      margin:0;
      tbody{
        display:block;
        overflow-y: scroll;
        height: calc(95vh - 33rem);
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
        border-bottom: 1px solid #dee2e6;    
        tr{width: calc(100% - 17px);}
      }
      th {
        position: sticky;
        text-align: center;
        padding: 0.3rem;
        white-space:nowrap;
        border:1px solid #dee2e6;
        border-bottom:none;
        border-top:none;
        vertical-align: middle;
      }
      td {
        padding: 0.25rem;
        word-break: break-all;
      }
    }  
  }
  .pullbox {
      .label-title {
          width: 0;
      }
      .pullbox-label {
          margin-bottom: 0;
          select {
              width: 100px;
              height: 2rem;
          }
      }
  }
  .react-datepicker-wrapper {
    input {
      width:11rem;
      height: 2rem;
    }
  }
  .start-date .react-datepicker-wrapper {
    input {
      width:10rem;
      height: 2rem;
    }
  }
  .hospital-condition {
    .pullbox .pullbox-label select {width:10rem;}
  }
  .select-date{
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
  .ward-name {
    border:1px solid #aaa;
    min-width: 11rem;
    height: 2rem;
    line-height: 2rem;
    padding-left: 0.3rem;
  }
`;

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class KarteDoHospitalization extends Component {
  constructor(props) {
    super(props);
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    let department_codes = [];
    this.diagnosis = {};
    departmentOptions.map(department=>{
      department_codes.push(department);
      this.diagnosis[parseInt(department.id)] = department.value;
    });
    this.state = {
      date_and_time_of_hospitalization:new Date(),
      start_date:new Date(),
      start_time_classification:0,
      meal_time_classification_master:[{id:0, value:""}],
      alert_title:"",
      alert_messages:"",
      move_history:[],
      department_codes,
      department_id:0,
      first_load:false,
      confirm_type:"",
      confirm_alert_title:"",
      confirm_message:"",
      first_ward_id:0,
      ward_name:"",
      hospital_room_id:0,
      room_name:"",
      hospital_bed_id:0,
      bed_name:"",
      openWardModal:false,
      ward_master:[],
      room_master:[],
      bed_master:[],
      using_beds:[],
    };
    this.change_flag = 0;
    this.date_and_time_of_hospitalization = formatDateLine(new Date());
    this.date_and_time_of_hospitalization = new Date(this.date_and_time_of_hospitalization.split('-').join('/')+" 00:00:00");
    this.meal_implement_edit = false;
    this.can_edit_meal_info = true;
    this.can_register = false;
  }

  async componentDidMount() {
    this.meal_implement_edit = this.context.$canDoAction(this.context.FEATURES.MEAL_CHANGE,this.context.AUTHS.MEAL_IMPLEMENT_EDIT);
    this.can_register = this.context.$canDoAction(this.context.FEATURES.HOSPITAL_DONE, this.context.AUTHS.DONE_OREDER);
    let cache_exit = this.loadFromCache();
    await this.getData(cache_exit);
  }

  getData=async(cache_exit)=>{
    let path = "/app/api/v2/ward/get/do_hospitalization";
    let post_data = {
      patient_id:this.props.patientId
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        if(res.error_message !== undefined){
          this.setState({
            alert_title: "移動エラー",
            alert_messages: res.error_message,
            confirm_type:"modal_close"
          });
        } else {
          let meal_time_classification_master = this.state.meal_time_classification_master;
          if(res.meal_time_classification_master.length > 0){
            res.meal_time_classification_master.map(meal=>{
              meal_time_classification_master.push({id:meal.number, value:meal.name});
            });
          }
          let date_and_time_of_hospitalization = new Date(res.date_and_time_of_hospitalization.split('-').join('/'));
          if(date_and_time_of_hospitalization.getTime() < new Date().getTime()){
            date_and_time_of_hospitalization = new Date();
          }
          let start_date = res.start_date != null ? new Date(res.start_date.split('-').join('/')) : new Date();
          if(start_date.getTime() < date_and_time_of_hospitalization.getTime()){
            start_date = date_and_time_of_hospitalization;
          }
          let ward_name = "";
          if(res.ward_master.length > 0){
            res.ward_master.map(ward=>{
              if(ward.number == res.first_ward_id){
                ward_name = ward.name;
              }
            })
          }
          let room_name = "";
          if(res.room_master.length > 0){
            res.room_master.map(room=>{
              if(room.number == res.hospital_room_id){
                room_name = room.name;
              }
            })
          }
          let bed_name = "病床未指定";
          if(res.bed_master.length > 0){
            res.bed_master.map(bed=>{
              if(bed.number == res.hospital_bed_id){
                bed_name = bed.name;
              }
            })
          }
          let state_data = {
            first_load:true,
            meal_time_classification_master,
            move_history:res.move_history,
            ward_master:res.ward_master,
            room_master:res.room_master,
            bed_master:res.bed_master,
            using_beds:res.using_beds,
          };
          if(res.moving_day !== undefined){
            let final_moving_day = new Date(res.moving_day);
            if(final_moving_day.getTime() > this.date_and_time_of_hospitalization.getTime()){
              this.date_and_time_of_hospitalization = final_moving_day;
              date_and_time_of_hospitalization = final_moving_day;
            }
          }
          if(!cache_exit){
            if(!this.meal_implement_edit){
              let changeMealStatus = getEnableChangeMeal(start_date, meal_time_classification_master);
              let isDisableMealSelected = false;
              if (changeMealStatus != "") {
                let meal_status_array = [];
                meal_status_array = changeMealStatus.split(":");
                if (meal_status_array.includes(res.start_time_classification.toString())) {
                  isDisableMealSelected = true;
                }
              }
              this.can_edit_meal_info = !isDisableMealSelected;
            }
            state_data.date_and_time_of_hospitalization = date_and_time_of_hospitalization;
            state_data.start_date = start_date;
            state_data.start_time_classification = res.start_time_classification;
            state_data.first_ward_id = res.first_ward_id;
            state_data.ward_name = ward_name;
            state_data.hospital_room_id = res.hospital_room_id;
            state_data.room_name = room_name;
            state_data.hospital_bed_id = res.hospital_bed_id;
            state_data.bed_name = bed_name;
            state_data.hos_number = res.hos_number;
            state_data.department_id = res.department_id;
          }
          this.setState(state_data);
        }
      })
      .catch(() => {

      });
  };

  getDateStr=(value = null)=>{
    let search_date = value;
    if(value == null){
      if(this.state.date_and_time_of_hospitalization == null || this.state.date_and_time_of_hospitalization === ""){
        return '';
      }
      search_date = this.state.date_and_time_of_hospitalization;
    }
    if(search_date instanceof Date) {
      let y = search_date.getFullYear();
      let m = ("00" + (search_date.getMonth() + 1)).slice(-2);
      let d = ("00" + search_date.getDate()).slice(-2);
      let h = ("00" + search_date.getHours()).slice(-2);
      let min = ("00" + search_date.getMinutes()).slice(-2);
      let result = y + "/" + m + "/" + d + " " + h + ":" + min;
      return result;
    }
  };

  setDateValue = (key, value) => {
    this.change_flag = 1;
    this.setState({[key]:value});
  };

  setSelectorValue = (e) => {
    this.change_flag = 1;
    this.setState({start_time_classification:parseInt(e.target.id)});
  };
  
  setDepartmentCode = (e) => {
    this.change_flag = 1;
    this.setState({department_id:parseInt(e.target.id)});
  };

  handleOk=()=>{
    if (!this.can_register) {return;}
    if(this.validateDate('date_and_time_of_hospitalization') == false){
      return;
    }
    if(this.state.hospital_bed_id == null){
      this.setState({alert_messages:"病床を選択してください。"});
      return;
    }
    if(this.state.using_beds.includes(this.state.hospital_bed_id)){
      this.setState({alert_messages:"選択中の病床は利用できません。病床を変更してください。"});
      return;
    }
    if(this.validateDate('start_date') == false){
      return;
    }
    if(this.state.start_time_classification === 0){
      this.setState({alert_messages:"食事時間区分を選択してください。"});
      return;
    }
    // 食事の時間帯に対する時刻設定
    if(!this.meal_implement_edit && this.can_edit_meal_info){ //「実施直前変更」権限
      let changeMealStatus = getEnableChangeMeal(this.state.start_date, this.state.meal_time_classification_master);
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
        let cur_start_time_name = (this.state.meal_time_classification_master.find((x) => x.id == this.state.start_time_classification) != undefined) ?
          this.state.meal_time_classification_master.find((x) => x.id == this.state.start_time_classification).value : "";
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
      confirm_message:"この内容で確定しますか？",
      confirm_type:'register',
      confirm_alert_title:"確認"
    });
  };

  saveCache=()=>{
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let hospital_done = {};
    hospital_done['karte_do'] = 1;
    hospital_done['hos_number'] = this.state.hos_number;
    hospital_done['patient_id'] = this.props.patientId;
    hospital_done['ward_id'] = this.state.first_ward_id;
    hospital_done['ward_name'] = this.state.ward_name;
    hospital_done['hospital_room_id'] = this.state.hospital_room_id;
    hospital_done['room_name'] = this.state.room_name;
    hospital_done['hospital_bed_id'] = this.state.hospital_bed_id;
    hospital_done['bed_name'] = this.state.bed_name;
    hospital_done['date_and_time_of_hospitalization'] = formatDateLine(this.state.date_and_time_of_hospitalization)+' '+formatTimeIE(this.state.date_and_time_of_hospitalization);
    hospital_done['doctor_code'] = authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code;
    hospital_done['doctor_name'] = authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name;
    hospital_done['department_id'] = this.state.department_id;
    hospital_done['department_name'] = this.diagnosis[parseInt(this.state.department_id)];
    hospital_done['is_carried_out_of_hospitalization'] = 0;
    hospital_done['start_date'] = formatDateLine(this.state.start_date);
    hospital_done['start_time_classification'] = this.state.start_time_classification;
    hospital_done.start_time_name = (this.state.meal_time_classification_master.find((x) => x.id == this.state.start_time_classification) != undefined) ?
      this.state.meal_time_classification_master.find((x) => x.id == this.state.start_time_classification).value : "";
    // save to cache
    karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.HOSPITAL_DONE, JSON.stringify(hospital_done), 'insert');
    this.context.$setExaminationOrderFlag(1);
    this.props.closeModal();
  }

  loadFromCache=()=>{
    let cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.HOSPITAL_DONE);
    if (cache_data === undefined || cache_data == null) return false;
    let date_and_time_of_hospitalization = new Date(cache_data.date_and_time_of_hospitalization.split("-").join("/"));
    let start_date = new Date(cache_data.start_date.split("-").join("/"));
    if(date_and_time_of_hospitalization.getTime() < this.date_and_time_of_hospitalization.getTime()){
      date_and_time_of_hospitalization = this.date_and_time_of_hospitalization;
    }
    if(start_date.getTime() < this.date_and_time_of_hospitalization.getTime()){
      start_date = this.date_and_time_of_hospitalization;
    }
    this.setState({
      hos_number:cache_data.hos_number,
      first_ward_id:cache_data.ward_id,
      ward_name:cache_data.ward_name,
      hospital_room_id:cache_data.hospital_room_id,
      room_name:cache_data.room_name,
      hospital_bed_id:cache_data.hospital_bed_id,
      bed_name:cache_data.bed_name,
      date_and_time_of_hospitalization,
      department_id:cache_data.department_id,
      start_date,
      start_time_classification:cache_data.start_time_classification,
    });
    return true;
  }

  confirmCancel=()=>{
    if(this.state.confirm_type == "modal_close"){
      this.props.closeModal();
    }
    this.setState({
      alert_title:"",
      alert_messages:"",
      confirm_message:"",
      confirm_type:"",
      confirm_alert_title:"",
      openWardModal:false,
    });
  };

  validateDate=(key)=>{
    let compare_value = "";
    let key_name = "";
    let date_name = "";
    if(key == "date_and_time_of_hospitalization"){
      compare_value = this.date_and_time_of_hospitalization.getTime();
      key_name = "実施／予定日時";
      date_name = "本日";
    }
    if(key == "start_date"){
      compare_value = formatDateLine(this.state.date_and_time_of_hospitalization);
      compare_value = new Date(compare_value.split('-').join('/')+" 00:00:00").getTime();
      key_name = "配膳開始日";
      date_name = "実施日";
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

  selectWard = () =>{
    if (this.state.date_and_time_of_hospitalization == null || this.state.date_and_time_of_hospitalization == '') {
      this.setState({alert_messages: '入院日時を選択してください。'});
      return;
    }
    this.setState({
      openWardModal:true,
    });
  };

  setWard = (ward, room, bed) => {
    this.change_flag = 1;
    this.setState({
      first_ward_id: ward.number,
      ward_name: ward.name,
      hospital_room_id:room.number,
      room_name:room.name,
      bed_name:bed.name,
      hospital_bed_id:bed.number,
      openWardModal:false,
    });
  };

  getBedColor=()=>{
    if(this.state.hospital_bed_id == null){
      return "red";
    }
    if(this.state.using_beds.includes(this.state.hospital_bed_id)){
      return "red";
    }
    return "";
  }

  render() {
    // 食事の時間帯に対する時刻設定
    let changeMealStatus = "";
    if(!this.meal_implement_edit){
      changeMealStatus = getEnableChangeMeal(this.state.start_date, this.state.meal_time_classification_master);
    }
    return (
      <>
        <Modal
          show={true}
          className="custom-modal-sm patient-exam-modal move-hospitalization-modal first-view-modal"
        >
          <Modal.Header><Modal.Title>入院実施</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                {this.state.first_load ? (
                  <>
                    <div className={'flex'}>
                      <div className={'div-title'}>実施／予定日時</div>
                      <div className={'select-date'}>
                        {(this.date_and_time_of_hospitalization.getTime() > new Date().getTime()) ? (
                          <OverlayTrigger placement={"top"} overlay={renderTooltip("最新の移動より前の日付は選択できません。")}>
                            <DatePicker
                              locale="ja"
                              id='cur_date_id'
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
                          </OverlayTrigger>
                        ):(
                          <DatePicker
                            locale="ja"
                            id='cur_date_id'
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
                        )}
                      </div>
                    </div>
                    {/*<div className={'flex'} style={{paddingTop:"0.5rem"}}>*/}
                      {/*<div className={'div-title'}>変更可能日</div>*/}
                      {/*<div className={'search-date'}>{(this.getDateStr())}</div>*/}
                      {/*<div className={'from-to'}>～</div>*/}
                      {/*<div className={'search-date'}>{(this.getDateStr(new Date()))}</div>*/}
                    {/*</div>*/}
                    <div className="d-flex" style={{marginTop:"0.5rem"}}>
                      <div className="div-title">病棟/病室/病床</div>
                      <div className={'ward-name'} onClick={this.selectWard}>
                        <span>{this.state.ward_name + "/" +this.state.room_name + "/"}</span>
                        <span style={{color:this.getBedColor()}}>{this.state.bed_name}</span>
                      </div>
                    </div>
                    <div className={'flex'} style={{paddingTop:"0.5rem"}}>
                      <div className={'div-title'}>診療科</div>
                      <div className={'hospital-condition'}>
                        <SelectorWithLabel
                          title=""
                          options={this.state.department_codes}
                          getSelect={this.setDepartmentCode}
                          departmentEditCode={this.state.department_id}
                        />
                      </div>
                    </div>
                    <div className={'flex'} style={{paddingTop:"0.5rem"}}>
                      <div className={'div-title'}>配膳開始</div>
                      <div className={'start-date'}>
                        <DatePicker
                          locale="ja"
                          selected={this.state.start_date}
                          onChange={this.setDateValue.bind(this, 'start_date')}
                          dateFormat="yyyy/MM/dd"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          minDate={this.state.date_and_time_of_hospitalization}
                          onBlur={this.validateDate.bind(this, 'start_date')}
                          disabled={this.can_edit_meal_info === false}
                          dayClassName = {date => setDateColorClassName(date)}
                        />
                      </div>
                      <SelectorWithLabel
                        title=""
                        options={this.state.meal_time_classification_master}
                        getSelect={this.setSelectorValue}
                        departmentEditCode={this.state.start_time_classification}
                        disabledValue={changeMealStatus}
                        isDisabled={this.can_edit_meal_info === false}
                      />
                    </div>
                    <div style={{paddingTop:"1rem"}}>当該患者の他移動情報</div>
                    <div className={'table-area'}>
                      <table className="table-scroll table table-bordered" id="code-table">
                        <thead>
                        <tr>
                          <th style={{width:"3rem"}}>&nbsp;</th>
                          <th style={{width:"3rem"}}>状態</th>
                          <th style={{width:"8rem"}}>実施日</th>
                          <th style={{width:"3rem"}}>時間</th>
                          <th style={{width:"10rem"}}>区分</th>
                          <th style={{width:"4rem"}}>病棟</th>
                          <th style={{width:"4rem"}}>病室</th>
                          <th style={{width:"10rem"}}>ベッド</th>
                          <th>診療科</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.move_history.length > 0 && (
                          this.state.move_history.map((detail, index)=>{
                            return (
                              <>
                                <tr>
                                  <td style={{width:"3rem"}} className={'text-right'}>{index+1}</td>
                                  <td style={{width:"3rem"}}>{new Date(formatDateLine(detail.moving_day)).getTime() >= new Date(formatDateLine(new Date())).getTime() ? "未" : "済"}</td>
                                  <td style={{width:"8rem"}}>{detail.moving_day}</td>
                                  <td style={{width:"3rem"}}>{detail.moving_time == "00:00" ? "" : detail.moving_time}</td>
                                  <td style={{width:"10rem"}}>{detail.movement_name}</td>
                                  <td style={{width:"4rem"}}>{detail.ward_name}</td>
                                  <td style={{width:"4rem"}}>{detail.room_name}</td>
                                  <td style={{width:"10rem"}}>{detail.bed_name}</td>
                                  <td>{this.diagnosis[detail.department_id]}</td>
                                </tr>
                              </>
                            )
                          })
                        )}
                        </tbody>
                      </table>
                    </div>
                  </>
                ):(
                  <>
                    <div style={{width:"100%"}}>
                      <SpinnerWrapper>
                        <Spinner animation="border" variant="secondary" />
                      </SpinnerWrapper>
                    </div>
                  </>
                )}
              </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className={'cancel-btn'} onClick={this.props.closeModal}>キャンセル</Button>
            <Button tooltip={this.can_register ? '' : '権限がありません。'} className={this.can_register ? 'red-btn' : 'disable-btn'} onClick={this.handleOk}>確定</Button>
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <AlertNoFocusModal
              hideModal= {this.confirmCancel.bind(this)}
              handleOk= {this.confirmCancel.bind(this)}
              showMedicineContent= {this.state.alert_messages}
              title={this.state.alert_title}
            />
          )}
          {this.state.confirm_type == "check_date" && this.state.confirm_message !== "" && (
            <SystemAlertModal
              hideModal= {this.confirmCancel.bind(this)}
              handleOk= {this.confirmCancel.bind(this)}
              showMedicineContent= {this.state.confirm_message}
              showTitle= {true}
              title = {this.state.confirm_alert_title}
            />
          )}
          {this.state.openWardModal && (
            <WardSelectModal
              closeModal={this.confirmCancel}
              ward_master={this.state.ward_master}
              room_master={this.state.room_master}
              hospital_bed_master={this.state.bed_master}
              handleOk={this.setWard}
              MasterName={`病棟・病室選択`}
              hospital_date={this.state.date_and_time_of_hospitalization}
              from_modal={'karte_do_hospital'}
            />
          )}
          {this.state.confirm_type == "register" && this.state.confirm_message !== "" && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.saveCache}
              confirmTitle= {this.state.confirm_message}
              title= {this.state.confirm_alert_title}
            />
          )}
        </Modal>
      </>
    );
  }
}

KarteDoHospitalization.contextType = Context;
KarteDoHospitalization.propTypes = {
  closeModal: PropTypes.func,
  patientId: PropTypes.number,
};

export default KarteDoHospitalization;
