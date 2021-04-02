import React, { Component } from "react";
// import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
// import ReactToPrint from "react-to-print";
// import * as apiClient from "~/api/apiClient";
import {formatDateLine, formatJapanDate, getNextDayByJapanFormat, getPrevDayByJapanFormat} from "~/helpers/date";
import DatePicker from "react-datepicker";
import * as sessApi from "~/helpers/cacheSession-utils";
import DialSideBar from "~/components/templates/Dial/DialSideBar";
import DialPatientNav from "~/components/templates/Dial/DialPatientNav";
import axios from "axios";
// import * as methods from "~/components/templates/Dial/DialMethods";
import {displayLineBreak, setDateColorClassName} from "~/helpers/dialConstants"
import DialCoursePrintModal from "~/components/templates/Dial/Board/molecules/printSheets/DialCoursePrintModal";

const Wrapper = styled.div`
    position: fixed;
    top: 70px;
    height: calc(100vh - 100px);
    font-size: 14px;
    width: calc(100% - 390px);
    left:200px;
    padding:20px;
    .flex{
        display:flex;
    }
    .print-button{
        // z-index: 10001;
        // position: absolute;
    }
    .header{
        // position: absolute;
        // z-index: 10001;
        text-align:center;
        button span{
            font-size:17px;
        }
        // margin-top: 2.5rem;
        .label-title{
            font-size: 15px;
            margin-top: 1px;
            text-align: right;
            margin-right: 14px;
        }
    }

    .cur-date{
        font-size:18px;
    }
    .prev-day {
        cursor: pointer;
        padding-right: 10px;
        font-size:18px;
    }
    .next-day {
        cursor: pointer;
        padding-left: 10px;
        font-size:18px;
    }
    td, th{
        font-size:1rem;
        vertical-align:middle;
    }
`;

const Card = styled.div`
    // position: absolute;
    // z-index: 100;
    // top: 0px;
    // width: 100%;
    // padding-top:70px;
    // padding-left:60px;
    // padding-right:40px;
    // padding-bottom:40px;
    .title {
        font-size: 2rem;
        padding-left: 7px;
        text-align:center;
    }
    .title-cell{
        width:50px;
        text-align:center;
    }
    .main{
        height:calc(100vh - 250px);
        overflow-y:scroll;
        background:white;
        font-size:17px;
        position: relative;
    }
    .bold-border{
        border:1px solid black;
        td, th{
            border:1px solid black;
        }
    }
    .weight{
        div{
            text-align: center;
        }
        .cell-div{
            text-align: center;
            border-right:1px solid;
        }
        div label{
            margin-bottom: 0px;
            text-align: center;
            border-right:1px solid;
        }
    }
    .footer{
        text-align:center;
        padding-top:10px;
        .select_date_range{
            .period-label, span, button{
                margin-left:10px;
                margin-right:10px;
            }
        }
        .facility_info{
            position: absolute;
            right: 50px;
        }
        margin-top:1rem;
        width: 100%;
    }
`;

class DialCourse extends Component {
  constructor(props) {
    super(props);
    let patientInfo = sessApi.getObjectValue("dial_setting","patient");
    this.state = {
      schedule_date:new Date(),
      isOpenPrintModal: false,
      patientInfo,
    }
  }
  
  componentDidMount () {
    let from_daily_print_date = JSON.parse(window.sessionStorage.getItem("from_daily_print"));
    if (from_daily_print_date != undefined && from_daily_print_date != null){
      this.setState({schedule_date:new Date(from_daily_print_date)},()=>{
        this.getSchedule();
      })
    } else {
      this.getSchedule();
    }
  }
  getSchedule = async() => {
    let patientInfo = sessApi.getObjectValue("dial_setting","patient");
    if (patientInfo == undefined || patientInfo == null){
      return;
    }
    if(this.state.schedule_date == undefined || this.state.schedule_date == null || this.state.schedule_date =='') return;
    
    let path = "/app/api/v2/dial/print/get_dial_course_data";
    let post_data = {
      schedule_date:formatDateLine(this.state.schedule_date),
      patient_id : patientInfo.system_patient_id,
    }
    await axios.post(path, {params:post_data}).then(res => {
      this.setState({schedule_data:res.data});
    })
  }
  
  selectPatient = patientInfo =>{
    this.setState({patientInfo:patientInfo}, ()=>{
      this.getSchedule();
    })
  }
  
  getDate = value => {
    this.setState({ schedule_date: value}, () => {
      this.getSchedule();
    })
  };
  
  PrevDay = () => {
    let now_day = this.state.schedule_date;
    let cur_day = getPrevDayByJapanFormat(now_day);
    this.setState({ schedule_date: cur_day}, () => {
      this.getSchedule();
    })
  };
  
  NextDay = () => {
    let now_day = this.state.schedule_date;
    let cur_day = getNextDayByJapanFormat(now_day);
    this.setState({ schedule_date: cur_day}, () => {
      this.getSchedule();
    })
  };
  
  openPrintPreview = () => {
    if (this.state.patientInfo === undefined || this.state.patientInfo == null) {
      return;
    }
    this.setState({
      isOpenPrintModal: true,
    });
  };
  
  closeModal = () => {
    this.setState({
      isOpenPrintModal: false,
    });
  };
  
  render() {
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className="cur-date example-custom-input" onClick={onClick} style={{cursor:"pointer"}}>
        {formatJapanDate(value)}
      </div>
    );
    
    let {schedule_data, patientInfo} = this.state;
    let facility = this.state.facilityInfo!=undefined?this.state.facilityInfo[0].medical_institution_name:'';
    var genders ={0:'', 1:'男', 2:'女'};
    var count_disease = 0;
    return  (
      <>
        <DialSideBar
          onGoto={this.selectPatient}
          history = {this.props.history}
        />
        <DialPatientNav
          patientInfo={this.state.patientInfo}
          history = {this.props.history}
        />
        <Wrapper>
          <div className="header flex">
            <div className="prev-day" onClick={this.PrevDay}>{"< "}</div>
            <DatePicker
              locale="ja"
              selected={this.state.schedule_date}
              onChange={this.getDate.bind(this)}
              dateFormat="yyyy/MM/dd"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              customInput={<ExampleCustomInput />}
              dayClassName = {date => setDateColorClassName(date)}
            />
            <div className="next-day" onClick={this.NextDay}>{" >"}</div>
          </div>
          <Card>
              <>
                <div className="title">透析経過管理表</div>
                <div className="main">
                  {(schedule_data == undefined || schedule_data == null || schedule_data.length ==0) && patientInfo != undefined &&(
                    <div className="no-exist-notice" style={{fontSize:'25px'}}>登録された透析スケジュールがありません。</div>
                  )}
                  {schedule_data != undefined && schedule_data.length >0 && (
                    <>
                      <table className='table-scroll table table-bordered bold-border'>
                        <thead>
                        <tr>
                          <th colSpan='2' className="title-cell">診断</th>
                          <th colSpan ='3'>
                            {schedule_data[0] != undefined && schedule_data[0].disease != null && schedule_data[0].disease != undefined && schedule_data[0].disease.map(item=>{
                              if (item.name != undefined && item.name != null && item.name != "") {
                                count_disease++;
                                if (count_disease > 3) return;
                                return(
                                  <>
                                    <label>{item.name}</label><br/>
                                  </>
                                );
                              }
                            })}
                          </th>
                          <th colSpan ='3'>
                            <label>氏名&nbsp;&nbsp;:</label>&nbsp;&nbsp;
                            {patientInfo!= undefined && patientInfo!=null && patientInfo.patient_name}
                          </th>
                          <th colSpan ='3'>
                            <label>{patientInfo!= undefined && patientInfo!=null && patientInfo.age}歳({patientInfo!= undefined && patientInfo!=null && genders[patientInfo.gender]})</label>&nbsp;&nbsp;
                            <label>DW:&nbsp;{patientInfo!= undefined && patientInfo!=null && patientInfo.dw}kg({formatJapanDate(schedule_data[0].dial_schedule.schedule_date)})</label>
                          </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                          <td colSpan='2' style={{textAlign:'center'}}>月日</td>
                          <td colSpan ='3'>{formatJapanDate(schedule_data[2].dial_schedule.schedule_date)}</td>
                          <td colSpan ='3'>{formatJapanDate(schedule_data[1].dial_schedule.schedule_date)}</td>
                          <td colSpan ='3'>{formatJapanDate(schedule_data[0].dial_schedule.schedule_date)}</td>
                        </tr>
                        <tr>
                          <td colSpan='2' style={{textAlign:'center'}}>血液透析</td>
                          <td colSpan ='3'>{schedule_data[2] != undefined?schedule_data[2].dial_schedule.dial_method_name:''}</td>
                          <td colSpan ='3'>{schedule_data[1] != undefined?schedule_data[1].dial_schedule.dial_method_name:''}</td>
                          <td colSpan ='3'>{schedule_data[0] != undefined?schedule_data[0].dial_schedule.dial_method_name:''}</td>
                        </tr>
                        <tr>
                          <td colSpan='2' style={{textAlign:'center'}}>注射</td>
                          <td colSpan ='3'>
                            {schedule_data[2] != undefined && schedule_data[2].inject_schedule.length>0 && (
                              schedule_data[2].inject_schedule.map(item => {
                                var data_json = JSON.parse(item.data_json);
                                return(
                                  <>
                                    <div className ="inject-set">
                                      {data_json.map(val => {
                                        if (val.item_name != ''){
                                          return(
                                            <>
                                              <div>{val.item_name}&nbsp;&nbsp;{val.amount}</div>
                                            </>
                                          )
                                        }
                                      })}
                                    </div>
                                  </>
                                )
                              })
                            )}
                          </td>
                          <td colSpan ='3'>
                            {schedule_data[1] != undefined && schedule_data[1].inject_schedule.length>0 && (
                              schedule_data[1].inject_schedule.map(item => {
                                var data_json = JSON.parse(item.data_json);
                                return(
                                  <>
                                    <div className ="inject-set">
                                      {data_json.map(val => {
                                        if (val.item_name != ''){
                                          return(
                                            <>
                                              <div className="inject-medicine">{val.item_name}&nbsp;&nbsp;{val.amount}</div>
                                            </>
                                          )
                                        }
                                      })}
                                    </div>
                                  </>
                                
                                )
                              })
                            )}
                          </td>
                          <td colSpan ='3'>
                            {schedule_data[0] != undefined && schedule_data[0].inject_schedule.length>0 && (
                              schedule_data[0].inject_schedule.map(item => {
                                var data_json = JSON.parse(item.data_json);
                                return(
                                  <>
                                    <div className ="inject-set">
                                      {data_json.map(val => {
                                        if (val.item_name != ''){
                                          return(
                                            <>
                                              <div>{val.item_name}&nbsp;&nbsp;{val.amount}</div>
                                            </>
                                          )
                                        }
                                      })}
                                    </div>
                                  </>
                                )
                              })
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan='2' style={{textAlign:'center'}}>薬</td>
                          <td colSpan ='3'>
                            {schedule_data[2] != undefined && schedule_data[2].dial_pres.length>0 && (
                              schedule_data[2].dial_pres.map(item => {
                                return (
                                  <>
                                    <div>{item.medicine_name}&nbsp;&nbsp;{item.amount}</div>
                                  </>
                                )
                              })
                            )}
                          </td>
                          <td colSpan ='3'>
                            {schedule_data[1] != undefined && schedule_data[1].dial_pres.length>0 && (
                              schedule_data[1].dial_pres.map(item => {
                                return (
                                  <>
                                    <div>{item.medicine_name}&nbsp;&nbsp;{item.amount}</div>
                                  </>
                                )
                              })
                            )}
                          </td>
                          <td colSpan ='3'>
                            {schedule_data[0] != undefined && schedule_data[0].dial_pres.length>0 && (
                              schedule_data[0].dial_pres.map(item => {
                                return (
                                  <>
                                    <div>{item.medicine_name}&nbsp;&nbsp;{item.amount}</div>
                                  </>
                                )
                              })
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan='2' style={{textAlign:'center'}}>検<br/>査<br/>・<br/>処<br/>置</td>
                          <td colSpan ='3'>
                            {schedule_data[2] != undefined && schedule_data[2].inspect_schedule.length>0 && (
                              schedule_data[2].inspect_schedule.map(item => {
                                return(
                                  <>
                                    <div>{item.name}</div>
                                  </>
                                )
                              })
                            )}
                            {schedule_data[2] != undefined && schedule_data[2].p.length>0 && (
                              schedule_data[2].p.map(item => {
                                return(
                                  <>
                                    <div>{displayLineBreak(item.body)}</div>
                                  </>
                                )
                              })
                            )}
                          </td>
                          <td colSpan ='3'>
                            {schedule_data[1] != undefined && schedule_data[1].inspect_schedule.length>0 && (
                              schedule_data[1].inspect_schedule.map(item => {
                                return(
                                  <>
                                    <div>{item.name}</div>
                                  </>
                                )
                              })
                            )}
                            {schedule_data[1] != undefined && schedule_data[1].p.length>0 && (
                              schedule_data[1].p.map(item => {
                                return(
                                  <>
                                    <div>{displayLineBreak(item.body)}</div>
                                  </>
                                )
                              })
                            )}
                          </td>
                          <td colSpan ='3'>
                            {schedule_data[0] != undefined && schedule_data[0].inspect_schedule.length>0 && (
                              schedule_data[0].inspect_schedule.map(item => {
                                return(
                                  <>
                                    <div>{item.name}</div>
                                  </>
                                )
                              })
                            )}
                            {schedule_data[0] != undefined && schedule_data[0].p.length>0 && (
                              schedule_data[0].p.map(item => {
                                return(
                                  <>
                                    <div>{displayLineBreak(item.body)}</div>
                                  </>
                                )
                              })
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td style={{width:'20px', padding:'0px', textAlign:'center', fontSize:'0.9rem',borderBottom:'none'}}>体<br/>重<br/>・</td>
                          <td style={{fontSize:'0.9rem',width:'20px', padding:'0px', textAlign:'center'}}>前</td>
                          {schedule_data[2] != undefined && schedule_data[2].dial_schedule != null ? (
                            <>
                              <td className="cell-div" style={{width:'10%'}}>
                                {schedule_data[2].dial_schedule.weight_before != null && schedule_data[2].dial_schedule.weight_before != undefined && schedule_data[2].dial_schedule.weight_before != ""?parseFloat(schedule_data[2].dial_schedule.weight_before).toFixed(1)+'kg':' '}
                              </td>
                              <td className="cell-div" style={{width:'10%', textAlign:'center'}}>除水量</td>
                              <td className="cell-div" style={{width:'12%'}}>
                                {(schedule_data[2].dial_schedule.blood_data.before_pressure_max != null || schedule_data[2].dial_schedule.blood_data.before_pressure_min != null) ? (
                                  <>{schedule_data[2].dial_schedule.blood_data.before_pressure_min}～{schedule_data[2].dial_schedule.blood_data.before_pressure_max}</>
                                ):(<>&nbsp;</>)}
                              </td>
                            </>
                          ):(
                            <>
                              <td style={{width:'10%'}}>&nbsp;</td>
                              <td style={{width:'10%'}}>&nbsp;</td>
                              <td style={{width:'12%'}}>&nbsp;</td>
                            </>
                          )}
                          {schedule_data[1] != undefined && schedule_data[1].dial_schedule != null ? (
                            <>
                              <td className="cell-div" style={{width:'10%'}}>
                                {schedule_data[1].dial_schedule.weight_before != null && schedule_data[1].dial_schedule.weight_before != undefined && schedule_data[1].dial_schedule.weight_before != ""?parseFloat(schedule_data[1].dial_schedule.weight_before).toFixed(1)+'kg':' '}
                              </td>
                              <td className="cell-div" style={{width:'10%', textAlign:'center'}}>除水量</td>
                              <td className="cell-div" style={{width:'12%'}}>
                                {(schedule_data[1].dial_schedule.blood_data.before_pressure_max != null || schedule_data[1].dial_schedule.blood_data.before_pressure_min != null) ? (
                                  <>{schedule_data[1].dial_schedule.blood_data.before_pressure_min}～{schedule_data[1].dial_schedule.blood_data.before_pressure_max}</>
                                ):(<>&nbsp;</>)}
                              </td>
                            </>
                          ):(
                            <>
                              <td style={{width:'10%'}}>&nbsp;</td>
                              <td style={{width:'10%'}}>&nbsp;</td>
                              <td style={{width:'12%'}}>&nbsp;</td>
                            </>
                          )}
                          {schedule_data[0] != undefined && schedule_data[0].dial_schedule != null ? (
                            <>
                              <td className="cell-div" style={{width:'10%'}}>
                                {schedule_data[0].dial_schedule.weight_before != null && schedule_data[0].dial_schedule.weight_before != undefined && schedule_data[0].dial_schedule.weight_before != ""?parseFloat(schedule_data[0].dial_schedule.weight_before).toFixed(1)+'kg':' '}
                              </td>
                              <td className="cell-div" style={{width:'10%', textAlign:'center'}}>除水量</td>
                              <td className="cell-div" style={{width:'12%'}}>
                                {(schedule_data[0].dial_schedule.blood_data.before_pressure_max != null || schedule_data[0].dial_schedule.blood_data.before_pressure_min != null) ? (
                                  <>{schedule_data[0].dial_schedule.blood_data.before_pressure_min}～{schedule_data[0].dial_schedule.blood_data.before_pressure_max}</>
                                ):(<>&nbsp;</>)}
                              </td>
                            </>
                          ):(
                            <>
                              <td style={{width:'10%'}}>&nbsp;</td>
                              <td style={{width:'10%'}}>&nbsp;</td>
                              <td style={{width:'12%'}}>&nbsp;</td>
                            </>
                          )}
                        </tr>
                        <tr>
                          <td style={{width:'20px', padding:'0px', textAlign:'center', fontSize:'0.9rem', borderTop:'none'}}>血<br/>圧</td>
                          <td style={{width:'20px', padding:'0px', textAlign:'center', fontSize:'0.9rem'}}>後</td>
                          {schedule_data[2] != undefined && schedule_data[2].dial_schedule != null ? (
                            <>
                              <td className="cell-div" style={{width:'10%'}}>
                                {schedule_data[2].dial_schedule.weight_after != null && schedule_data[2].dial_schedule.weight_after != undefined && schedule_data[2].dial_schedule.weight_after != ""?parseFloat(schedule_data[2].dial_schedule.weight_after).toFixed(1)+'kg':' '}
                              </td>
                              <td className="cell-div" style={{width:'10%'}}>
                                {schedule_data[2].dial_schedule.weight_after > 0 && schedule_data[2].dial_schedule.weight_before > 0 ? parseFloat(schedule_data[2].dial_schedule.weight_before - schedule_data[2].dial_schedule.weight_after).toFixed(1) + "kg" : ""}
                              </td>
                              <td className="cell-div" style={{width:'12%'}}>
                                {(schedule_data[2].dial_schedule.blood_data.after_pressure_max != null || schedule_data[2].dial_schedule.blood_data.after_pressure_min != null) ? (
                                  <>{schedule_data[2].dial_schedule.blood_data.after_pressure_min}～{schedule_data[2].dial_schedule.blood_data.after_pressure_max}</>
                                ):(<>&nbsp;</>)}
                              </td>
                            </>
                          ):(
                            <>
                              <td style={{width:'10%'}}>&nbsp;</td>
                              <td style={{width:'10%'}}>&nbsp;</td>
                              <td style={{width:'12%'}}>&nbsp;</td>
                            </>
                          )}
                          {schedule_data[1] != undefined && schedule_data[1].dial_schedule != null ? (
                            <>
                              <td className="cell-div" style={{width:'10%'}}>
                                {schedule_data[1].dial_schedule.weight_after != null && schedule_data[1].dial_schedule.weight_after != undefined && schedule_data[1].dial_schedule.weight_after != ""?parseFloat(schedule_data[1].dial_schedule.weight_after).toFixed(1)+'kg':' '}
                              </td>
                              <td className="cell-div" style={{width:'10%'}}>
                                {schedule_data[1].dial_schedule.weight_after > 0 && schedule_data[1].dial_schedule.weight_before > 0 ? parseFloat(schedule_data[1].dial_schedule.weight_before - schedule_data[1].dial_schedule.weight_after).toFixed(1) + "kg" : ""}
                              </td>
                              <td className="cell-div" style={{width:'12%'}}>
                                {(schedule_data[1].dial_schedule.blood_data.after_pressure_max != null || schedule_data[1].dial_schedule.blood_data.after_pressure_min != null) ? (
                                  <>{schedule_data[1].dial_schedule.blood_data.after_pressure_min}～{schedule_data[1].dial_schedule.blood_data.after_pressure_max}</>
                                ):(<>&nbsp;</>)}
                              </td>
                            </>
                          ):(
                            <>
                              <td style={{width:'10%'}}>&nbsp;</td>
                              <td style={{width:'10%'}}>&nbsp;</td>
                              <td style={{width:'12%'}}>&nbsp;</td>
                            </>
                          )}
                          {schedule_data[0] != undefined && schedule_data[0].dial_schedule != null ? (
                            <>
                              <td className="cell-div" style={{width:'10%'}}>
                                {schedule_data[0].dial_schedule.weight_after != null && schedule_data[0].dial_schedule.weight_after != undefined && schedule_data[0].dial_schedule.weight_after != ""?parseFloat(schedule_data[0].dial_schedule.weight_after).toFixed(1)+'kg':' '}
                              </td>
                              <td className="cell-div" style={{width:'10%'}}>
                                {schedule_data[0].dial_schedule.weight_after > 0 && schedule_data[0].dial_schedule.weight_before > 0 ? parseFloat(schedule_data[0].dial_schedule.weight_before - schedule_data[0].dial_schedule.weight_after).toFixed(1) + "kg" : ""}
                              </td>
                              <td className="cell-div" style={{width:'12%'}}>
                                {(schedule_data[0].dial_schedule.blood_data.after_pressure_max != null || schedule_data[0].dial_schedule.blood_data.after_pressure_min != null) ? (
                                  <>{schedule_data[0].dial_schedule.blood_data.after_pressure_min}～{schedule_data[0].dial_schedule.blood_data.after_pressure_max}</>
                                ):(<>&nbsp;</>)}
                              </td>
                            </>
                          ):(
                            <>
                              <td style={{width:'10%'}}>&nbsp;</td>
                              <td style={{width:'10%'}}>&nbsp;</td>
                              <td style={{width:'12%'}}>&nbsp;</td>
                            </>
                          )}
                        </tr>
                        <tr>
                          <td colSpan='2' style={{textAlign:'center'}}>症状</td>
                          <td colSpan='3'>
                            {schedule_data[2] != undefined && schedule_data[2].o.length>0 && (
                              schedule_data[2].o.map(item => {
                                return(
                                  <>
                                    <div>{displayLineBreak(item.body)}</div>
                                  </>
                                )
                              })
                            )}
                          </td>
                          <td colSpan='3'>
                            {schedule_data[1] != undefined && schedule_data[1].o.length>0 && (
                              schedule_data[1].o.map(item => {
                                return(
                                  <>
                                    <div>{displayLineBreak(item.body)}</div>
                                  </>
                                )
                              })
                            )}
                          </td>
                          <td colSpan='3'>
                            {schedule_data[0] != undefined && schedule_data[0].o.length>0 && (
                              schedule_data[0].o.map(item => {
                                return(
                                  <>
                                    <div>{displayLineBreak(item.body)}</div>
                                  </>
                                )
                              })
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan='2' style={{textAlign:'center'}}>その他</td>
                          <td colSpan='3'></td>
                          <td colSpan='3'></td>
                          <td colSpan='3'></td>
                        </tr>
                        </tbody>
                      </table>
                      <div className="footer">
                        <div className="facility_info">{facility}</div>
                      </div>
                    </>
                  )}
                </div>
              
              </>
          </Card>
          <div className='footer-buttons' style={{marginTop:"10px"}}>
            <Button className={'red-btn'} onClick={this.openPrintPreview}>帳票プレビュー</Button>
          </div>
          {this.state.isOpenPrintModal && (
            <DialCoursePrintModal
              handleOk={this.handleOk}
              closeModal={this.closeModal}
              print_data={this.state}
              patientInfo={this.state.patientInfo}
            />
          )}
        </Wrapper>
      </>
    );
  }
}

DialCourse.contextType = Context;

DialCourse.propTypes = {
  patientInfo:PropTypes.object,
  history: PropTypes.object,
};

export default DialCourse;
