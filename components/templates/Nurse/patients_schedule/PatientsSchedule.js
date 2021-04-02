import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import ja from "date-fns/locale/ja";
import DatePicker, { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import Radiobox from "~/components/molecules/Radiobox";
import {formatDateLine} from "~/helpers/date";
import * as apiClient from "~/api/apiClient";
import Button from "~/components/atoms/Button";
import {getNextDayByJapanFormat, getPrevDayByJapanFormat} from "~/helpers/date";
import InstructionConfirmList from "./InstructionConfirmList";
import SlipDetail from "./SlipDetail";
import PatientDailyMemo from "./PatientDailyMemo";
import Spinner from "react-bootstrap/Spinner";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`
  overflow-y: auto;
  height: 100%;
  font-size: 1rem;
  .flex {
    display: flex;
  }
  .btn-area button {
    height: 2rem;
    font-size: 1rem;
    margin-right:1rem;
  }
  .date-area {
    margin-bottom:0.5rem;
    .select-date {
      margin:0 0.5rem; 
      .react-datepicker-wrapper {
        input {
         height: 2rem;
         width: 7rem;
         font-size:1rem;
         text-align:center;
        }
      }
    }
    button {
      font-size: 1rem;
    }
  }
  .select-radio {
    margin-left:1rem;
    .div-title {
      height:2rem;
      line-height:2rem;
      width:4rem;
    }
    label {
      line-height: 2rem;
      font-size: 1rem;
    }
  }
  .calendar-area {
    margin-top: 0.5rem;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    table {
      // width:100%;
      margin:0;
      tbody{
        display:block;
        overflow-y: scroll;
        height: calc(80vh - 22rem);
        width:100%;
      }
      tr{
        display: table;
        // width: 100%;
      }
      thead{
        display:table;
        // width:100%;    
        border-bottom: 1px solid #dee2e6;    
        tr{margin-right:17px;}
      }
      th {
        position: sticky;
        text-align: center;
        padding: 0.3rem;
        white-space:nowrap;
        border:none;
        border-right:1px solid #dee2e6;
        vertical-align: middle;
      }
      td {
        padding: 0.25rem;
        word-break: break-all;
        button {
          min-height: 2rem;
          height: 100%;
          padding: 0px;
        }
      }
      .room-name {
        width: 5rem;
        min-width: 5rem;
      }
      .confirm-status {
        width: 3rem;
        min-width: 3rem;
      }
      .patient-name {
        width: 21rem;
        min-width: 21rem;
      }
      .patient-memo {
        width: 6rem;
        min-width: 6rem;
      }
      .date-memo {
        width: 6rem;
        min-width: 6rem;
      }
      .in-progress {
        min-width: 4rem;
      }
      .non-time-series {
        width: 10rem;
        min-width: 10rem;
      }
      .meal-title {
        width: 15rem;
        min-width: 15rem;
      }
      .time-title {
        width: 10rem;
        min-width: 10rem;
      }
      .div-button{
        border: 2px solid rgb(126, 126, 126) !important;
        width: 100%;
        height: 2rem;
        line-height: 2rem;
        background: rgb(239, 239, 239);
        cursor: pointer;
      }
    } 
  }
`;

const SpinnerWrapper = styled.div`
  width:85vw;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class PatientsSchedule extends Component {
  constructor(props) {
    super(props);
    this.holidays_color = JSON.parse(window.sessionStorage.getItem("init_status")).dial_schedule_date_color;
    this.state = {
      work_zone:0,
      search_date:new Date(),
      shift_pattern_master:[],
      isOpenInstructionConfirmList:false,
      isOpenSlipDetail:false,
      isOpenPatientDailyMemo:false,
      load_data:false,
      schedule_data:[],
      start_hour:null,
      end_hour:null,
    };
    this.time_list = [];
    for(let index = 8; index < 24; index++){
      this.time_list.push(index);
    }
    for(let index = 0; index < 8; index++){
      this.time_list.push(index);
    }
  }

  async UNSAFE_componentWillMount () {
    let path = "/app/api/v2/ward/get/shift_pattern_master";
    let post_data = {
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        res.push({number:0, name:"全日"});
        this.setState({shift_pattern_master:res});
      })
      .catch(() => {

      });
  }

  setWorkZone = (e) => {
    let start_hour = null;
    let end_hour = null;
    if(parseInt(e.target.value) != 0){
      start_hour = this.state.shift_pattern_master.find((x) => x.number === parseInt(e.target.value)).start_hour;
      end_hour = this.state.shift_pattern_master.find((x) => x.number === parseInt(e.target.value)).end_hour;
    }
    this.setState({
      work_zone:parseInt(e.target.value),
      start_hour,
      end_hour,
    });
  };

  setDate = value => {
    if(value == null || value == ""){
      value =  new Date();
    }
    this.setState({
      search_date: value,
      load_data:false
    }, ()=>{
      this.getPatientsSchedule();
    });
  };

  createTable = (patient_idx, patient) => {
    let schedule_tr = [];
    let meal_info = patient.meal;
    schedule_tr.push(
      <td className={'meal-title'}>
        <div>朝:{meal_info.morning.food_type_name}{meal_info.morning.food_name != "" ? "（"+meal_info.morning.food_name+"）" : ""}</div>
        <div>昼:{meal_info.noon.food_type_name}{meal_info.noon.food_name != "" ? "（"+meal_info.noon.food_name+"）" : ""}</div>
        <div>夕:{meal_info.night.food_type_name}{meal_info.night.food_name != "" ? "（"+meal_info.night.food_name+"）" : ""}</div>
      </td>
    );
    let schedule_info = patient.schedule;
    let exist_schedule = false;
    if(schedule_info['none'] != undefined){
      exist_schedule = true;
      let time_data = schedule_info['none'];
      schedule_tr.push(
        <td className={'time-title'}>
          {time_data.map(time_info=>{
            return (
              <>
                <div style={{color:time_info.done_order == 0 ? "#ED1A3D" : ""}}>{time_info.label}</div>
              </>
            )
          })}
        </td>
      );
    } else {
      schedule_tr.push(
        <td className={'time-title'}><div>&nbsp;</div></td>
      );
    }
    this.time_list.map(time_value=>{
      if(this.state.start_hour == null || (time_value >= this.state.start_hour && time_value <= this.state.end_hour)){
        if(schedule_info[time_value] != undefined){
          exist_schedule = true;
          let time_data = schedule_info[time_value];
          schedule_tr.push(
            <td className={'time-title'}>
              {time_data.map(time_info=>{
                return (
                  <>
                    <div style={{color:time_info.done_order == 0 ? "#ED1A3D" : ""}}>{time_info.label}</div>
                  </>
                )
              })}
            </td>
          );
        } else {
          schedule_tr.push(
            <td className={'time-title'}><div>&nbsp;</div></td>
          );
        }
      }
    });
    let tr_html = [];
    if(exist_schedule){
      tr_html.push(
        <tr>
          <td className="room-name">{patient_idx == 0 ? patient.room_name : ""}</td>
          {/*<td className="confirm-status" style={{padding:0}}>*/}
          {/*{tr_count == 0 && (*/}
          {/*<button style={{width:"calc(3rem - 1px)"}} onClick={this.openInstructionConfirmList.bind(this, patient)}>&nbsp;</button>*/}
          {/*)}*/}
          {/*</td>*/}
          <td className="patient-name">{patient.patient_name}</td>
          <td className="patient-memo" style={{padding:0}}>
            <div className={'div-button'} onClick={this.openPatientDailyMemo.bind(this, "patient", patient)}>&nbsp;</div>
          </td>
          <td className="date-memo" style={{padding:0}}>
            <div className={'div-button'} onClick={this.openPatientDailyMemo.bind(this, "date", patient)}>&nbsp;</div>
          </td>
          {schedule_tr}
        </tr>
      );
    }
    return tr_html;
  };

  moveDay = (type) => {
    let now_day = this.state.search_date;
    if(now_day === ''){now_day = new Date();}
    let cur_day = type === 'next' ? getNextDayByJapanFormat(now_day) : getPrevDayByJapanFormat(now_day);
    this.setState({
      search_date: cur_day,
      load_data:false
    }, ()=>{
      this.getPatientsSchedule();
    });
  };

  openInstructionConfirmList=(patient)=>{
    this.setState({
      isOpenInstructionConfirmList:true,
      patient_info:patient,
    });
  }

  openSlipDetail=(patient)=>{
    this.setState({
      isOpenSlipDetail:true,
      patient_info:patient,
    })
  }

  openPatientDailyMemo=(type, patient)=>{
    this.setState({
      isOpenPatientDailyMemo:true,
      modal_type:type,
      patient_info:patient,
    })
  }

  closeModal=()=>{
    this.setState({
      isOpenInstructionConfirmList:false,
      isOpenSlipDetail:false,
      isOpenPatientDailyMemo:false,
    });
  };

  async componentDidMount() {
    await this.getPatientsSchedule();
  }

  getPatientsSchedule=async()=>{
    if(this.state.load_data){
      this.setState({load_data:false});
    }
    let path = "/app/api/v2/nursing_service/search/patients_schedule";
    let post_data = {
      search_date: (this.state.search_date != null && this.state.search_date != "") ? formatDateLine(this.state.search_date) : "",
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          schedule_data:res,
          load_data:true,
        });
      })
      .catch(() => {

      });
  }

  render() {
    return (
      <>
        <Modal show={true} className="custom-modal-sm patients-schedule first-view-modal">
          <Modal.Header><Modal.Title>患者スケジュール</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                {/*<div className={'flex btn-area'}>*/}
                {/*<button>指示簿一覧</button>*/}
                {/*<button>汎用ワークシート</button>*/}
                {/*<button>SOAP＆フォーカス</button>*/}
                {/*<button>会計オーダ</button>*/}
                {/*<button>経過表</button>*/}
                {/*</div>*/}
                <div className={'flex'}>
                  <div className={'flex date-area'}>
                    <Button type="common" onClick={this.moveDay.bind(this, 'prev')}>＜</Button>
                    <div className={'select-date'}>
                      <DatePicker
                        locale="ja"
                        selected={this.state.search_date}
                        onChange={this.setDate.bind(this)}
                        dateFormat="yyyy/MM/dd"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dayClassName = {date => setDateColorClassName(date)}
                      />
                    </div>
                    <Button type="common" onClick={this.moveDay.bind(this, 'next')}>＞</Button>
                  </div>
                  <div className={'select-radio flex'}>
                    <div className={'div-title'}>勤務帯</div>
                    {this.state.shift_pattern_master.length > 0 && (
                      this.state.shift_pattern_master.map(item=>{
                        return (
                          <>
                            <Radiobox
                              label={item.name}
                              value={item.number}
                              getUsage={this.setWorkZone.bind(this)}
                              checked={this.state.work_zone === item.number}
                              disabled={true}
                              name={`work_zone`}
                            />
                          </>
                        )
                      })
                    )}
                  </div>
                </div>
                <div className={'flex btn-area'}>
                  <Button type="common" onClick={this.getPatientsSchedule}>検索/最新</Button>
                </div>
                <div className={'calendar-area'}>
                  <table className="table-scroll table table-bordered" id="code-table">
                    <thead>
                    <tr>
                      <th className="room-name">病室</th>
                      {/*<th className="confirm-status">確認</th>*/}
                      <th className="patient-name">氏名</th>
                      <th className="patient-memo">患者別メモ</th>
                      <th className="date-memo">日別メモ</th>
                      {/*<th className="in-progress">実施中</th>*/}
                      {/*<th className="non-time-series">非時系列</th>*/}
                      <th className="meal-title">食事</th>
                      <th className="time-title">時間未定</th>
                      {this.time_list.map(time=>{
                        if(this.state.start_hour == null || (time >= this.state.start_hour && time <= this.state.end_hour)){
                          return (
                            <>
                              <th className={'time-title'}>{time+"時"}</th>
                            </>
                          );
                        }
                      })}
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.load_data ? (
                      <>
                        {Object.keys(this.state.schedule_data).length > 0 && (
                          Object.keys(this.state.schedule_data).map(room_id=>{
                            let patients = this.state.schedule_data[room_id];
                            return (
                              <>
                                {patients.map((patient, patient_idx)=>{
                                  return (
                                    <>
                                      {this.createTable(patient_idx, patient)}
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
                        <SpinnerWrapper>
                          <Spinner animation="border" variant="secondary" />
                        </SpinnerWrapper>
                      </tr>
                    )}
                    </tbody>
                  </table>
                </div>
              </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            {/*<Button className="red-btn">印刷</Button>*/}
            {/*<Button className="red-btn">確定</Button>*/}
          </Modal.Footer>
          {this.state.isOpenInstructionConfirmList && (
            <InstructionConfirmList
              closeModal={this.closeModal}
              shift_pattern_master={this.state.shift_pattern_master}
              work_zone={this.state.work_zone}
              patient_info={this.state.patient_info}
              search_date={this.state.search_date}
              start_hour={this.state.start_hour}
              end_hour={this.state.end_hour}
            />
          )}
          {this.state.isOpenSlipDetail&& (
            <SlipDetail
              closeModal={this.closeModal}
              patient_info={this.state.patient_info}
            />
          )}
          {this.state.isOpenPatientDailyMemo&& (
            <PatientDailyMemo
              closeModal={this.closeModal}
              modal_type={this.state.modal_type}
              patient_info={this.state.patient_info}
              search_date={this.state.search_date}
            />
          )}
        </Modal>
      </>
    );
  }
}

PatientsSchedule.contextType = Context;
PatientsSchedule.propTypes = {
  closeModal: PropTypes.func,
};

export default PatientsSchedule;
