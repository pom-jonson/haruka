import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import DialRecord_A_Multi from "~/components/templates/Dial/Board/molecules/printSheets/DialRecord_A_Multi";
import {formatDateLine, getPrevDayByJapanFormat, getNextDayByJapanFormat,formatJapanDate} from "~/helpers/date";
import DatePicker from "react-datepicker";
import DialSideBar from "~/components/templates/Dial/DialSideBar";
import DialPatientNav from "~/components/templates/Dial/DialPatientNav";
import axios from "axios";
import * as apiClient from "~/api/apiClient";
import MultiRecordSheetPreviewModal from "./Modal/MultiRecordSheetPreviewModal"
import * as methods from "~/components/templates/Dial/DialMethods";
import {setDateColorClassName} from "~/helpers/dialConstants";

const Wrapper = styled.div`
    position: fixed;
    top: 70px;
    height: calc(100vh - 100px);
    font-size: 14px;
    width: calc(100% - 390px);
    left:200px;
    padding:20px;
    .sheet_button{
        margin-left: 20px;
        opacity: 0.5;
    }
    .flex{
        display:flex;
    }
    .header{
        padding-left:35%;
        padding-bottom:10px;
        button span{
            font-size:17px;
        }
        .label-title{
            font-size: 15px;
            margin-top: 1px;
            text-align: right;
            margin-right: 14px;
        }
    }
    .prev-day {
        cursor: pointer;
        padding-right: 0.625rem;
        display: inline-block;
        font-size: 1.25rem;
      }
      .next-day {
        cursor: pointer;
        padding-left: 0.625rem;
        display: inline-block;
        font-size: 1.25rem;
        margin-right:1rem;
      }
      .react-datepicker-wrapper{
        font-size: 1.25rem;
      }
    .selected.sheet_button{
        opacity: 1;
        border: 2px dotted;
    }

    .title {
        font-size: 2rem;
        padding-left: 7px;
        border-left: solid 5px #69c8e1;
    }
    .main{
        height:calc(100vh - 250px);
        overflow-y:scroll;
        background:white;
    }
    .footer-buttons{
        text-align:center;
        padding-top:1rem;
        .react-datepicker-wrapper{
            width: 7rem;
            input{
                width: 100%;
                height:2rem;
                font-size:1rem;
            }
        }
        .from-to {
          line-height:2rem;
          padding:0 0.3rem;
          font-size:1rem;
        }
        .red-btn {
            height: 2.3rem;
            line-height: 2.3rem;
            width:10rem;
            padding: 0;
            text-align:center;
            span{
                font-size:1rem;
            }
        }
        .select_date_range{
            .period-label{
                width:150px;
                text-align:right;
            }
            .period-label, span, button{
                margin-left:10px;
                margin-right:10px;
            }
            .react-datepicker-wrapper input{
                width:200px;
            }
        }
        .select-date {
          margin-right: 5rem;
          display: flex;
          align-items: center;
          .period-label{
            margin: 0;
            margin-right: 0.5rem;
            font-size: 1rem;
            line-height: 2rem;
          }
        }
    }

`;

class RecordSheet extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    var oneMonthago = new Date();
    oneMonthago.setDate(oneMonthago.getDate()-10);
    let schedule_date = new Date();
    let from_daily_print_date = JSON.parse(window.sessionStorage.getItem("from_daily_print"));
    if (from_daily_print_date != undefined && from_daily_print_date != null){
      schedule_date = new Date(from_daily_print_date);
      window.sessionStorage.removeItem("from_daily_print");
    }
    this.state = {
      schedule_date,
      sheet_style:'A',
      isOpenPreviewModal:false,
      
      start_date:oneMonthago,
      end_date:new Date(),
    }
  }
  
  async componentDidMount () {
    // let from_daily_print_date = JSON.parse(window.sessionStorage.getItem("from_daily_print"));
    // window.sessionStorage.removeItem("from_daily_print");
    // if (from_daily_print_date != undefined && from_daily_print_date != null){
    //     this.setState({schedule_date:new Date(from_daily_print_date)},()=>{
    //         this.getSchedule();
    //     })
    // } else {
    await this.getSchedule();
    await this.getStaffs();
    await this.getDoctors();
    // }
  }
  
  getStartDate = value => {
    this.setState({start_date:value});
  };
  
  getEndDate = value => {
    this.setState({end_date:value});
  };
  
  PrevDay = () => {
    let now_day = this.state.schedule_date;
    let cur_day = getPrevDayByJapanFormat(now_day);
    this.setState({ schedule_date: cur_day}, () => {
      this.getSchedule();
    });
  };
  
  NextDay = () => {
    let now_day = this.state.schedule_date;
    let cur_day = getNextDayByJapanFormat(now_day);
    this.setState({ schedule_date: cur_day}, () => {
      this.getSchedule();
    });
  };
  
  getSchedule = async() => {
    // let patientInfo = sessApi.getObjectValue("dial_setting","patient");
    let patientInfo = this.state.patientInfo;
    if (patientInfo == undefined || patientInfo == null){
      return;
    }
    let path = "/app/api/v2/dial/schedule/dial_get_schedule";
    let post_data = {
      params:{
        cur_day:formatDateLine(this.state.schedule_date),
        system_patient_id:patientInfo.system_patient_id
      },
    }
    await axios.post(path, post_data).then(res => {
      var schedule_data = res.data[0];
      if (schedule_data != undefined && schedule_data != null){
        path = "/app/api/v2/dial/board/get_all_ms_data";
        post_data.schedule_id=schedule_data.number;
        axios.post(path, {params: post_data}).then( res => {
          this.setState({
            schedule_data,
            rows_measure: res.data.handle_data !== undefined && res.data.handle_data.measure_data !== undefined ? res.data.handle_data.measure_data : [],
            rows_blood: res.data.handle_data !== undefined && res.data.handle_data.blood_data !== undefined ? res.data.handle_data.blood_data: [],
            rows_temp: res.data.handle_data !== undefined && res.data.handle_data.temperature_data !== undefined ?res.data.handle_data.temperature_data: [] ,
            patientInfo,
          }, () => {
            this.getSoapInfo();
            this.getInstructionInfo();
            this.getCurDiseaseInfo();
            this.getVARecordInfo();
          })
        })
        
        
      } else {
        this.setState({
          schedule_data:null,
          rows_measure:  [],
          rows_blood:  [],
          rows_temp: [] ,
          patientInfo,
        })
      }
    });
  }
  getVARecordInfo = async() => {
    let patientInfo = this.state.patientInfo;
    if(patientInfo == undefined || patientInfo == null || patientInfo.system_patient_id == undefined){
      return;
    }
    let schedule_date = this.state.schedule_date;
    if (schedule_date == undefined || schedule_date == null || schedule_date == "") return ;
    let path = "/app/api/v2/dial/medicine_information/VARecord/searchByDate";
    await apiClient
      ._post(path, {
        params: {
          patient_id:patientInfo.system_patient_id,
          schedule_date,
        }
      })
      .then((res) => {
        this.setState({
          showImage: res
        });
      })
      .catch(() => {
        this.setState({showImage:undefined})
      })
  };
  getInstructionInfo = async() => {
    let schedule_date = this.state.schedule_date;
    let path = "/app/api/v2/dial/board/Soap/search_instruction";
    await apiClient
      ._post(path, {
        params: {
          is_enabled:1,
          system_patient_id: this.state.patientInfo.system_patient_id,
          date: schedule_date
        }
      })
      .then((res) => {
        if (res.length != 0){
          this.setState({
            instruction_list:res,
          })
        } else {
          this.setState({
            instruction_list:[],
          })
        }
      });
  };
  
  getSoapInfo = async() => {
    let patientInfo = this.state.patientInfo;
    let schedule_date = this.state.schedule_date;
    if(patientInfo === undefined || patientInfo == null){
      return;
    }
    let path = "/app/api/v2/dial/board/Soap/search";
    await apiClient
      ._post(path, {
        params: {
          is_enabled:1,
          system_patient_id: patientInfo.system_patient_id,
          date: schedule_date
        }
      })
      .then((res) => {
        if (res.length != 0){
          this.setState({
            treat_monitor_list:res,
          })
        } else {
          this.setState({
            treat_monitor_list:[],
            
          })
        }
      })
      .catch(() => {
      
      });
  };
  getCurDiseaseInfo = async() => {
    let schedule_date = this.state.schedule_date;
    let path = "/app/api/v2/dial/board/Soap/search_disease";
    await apiClient
      ._post(path, {
        params: {
          is_enabled:1,
          system_patient_id: this.state.patientInfo.system_patient_id,
          date: schedule_date
        }
      })
      .then((res) => {
        this.setState({
          disease_history:res,
        });
      });
  };
  
  selectPatient = patientInfo =>{
    this.setState({patientInfo:patientInfo}, ()=>{
      this.getSchedule();
    })
  }
  
  switchSheet = (sheet) => {
    this.setState({sheet_style:sheet});
  }
  
  getScheduledate = value => {
    this.setState({schedule_date: value}, () => {
      this.getSchedule();
    });
  };
  
  async openPreviewModal(){
    if (this.state.patientInfo == undefined && this.state.patientInfo == null){
      window.sessionStorage.setItem("alert_messages", "左側のメニューから患者様をお選びください");
      return
    }
    this.setState({isOpenPreviewModal:true})
    
    // let path = "/app/api/v2/dial/print/get_general_schedule_data";
    // let post_data = {
    //     start_date : this.state.start_date,
    //     end_date : this.state.end_date,
    //     patient_id : this.state.patientInfo.system_patient_id,
    // }
    
    // await axios.post(path, {params:post_data}).then(res => {
    //     let frmPop = document.frmPopup;
    //     window.open("/print/print_dial_record_a.php", 'popupView', 'width = 1080, height = 700, scrollbars=yes');
    //     frmPop.action = "/print/print_dial_record_a.php";
    //     frmPop.target = 'popupView';
    //     frmPop.patientInfo.value = JSON.stringify(res.data.patient);
    //     frmPop.data.value = JSON.stringify(res.data.data);
    //     frmPop.submit();
    // })
    
  }
  
  closeModal(){
    this.setState({
      isOpenPreviewModal:false,
    })
  }
  
  render() {
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className="cur-date morning example-custom-input" onClick={onClick} style={{cursor:"pointer"}}>
        {formatJapanDate(value)}
      </div>
    );
    
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
          <form name="frmPopup" method="post">
            <input type="hidden" name="type" />
            <input type="hidden" name="patientInfo" />
            <input type="hidden" name="data" />
          </form>
          <div className="title">透析記録用紙</div>
          <div className="header flex">
            <div className="prev-day" onClick={this.PrevDay}>{"< "}</div>
            <DatePicker
              locale="ja"
              selected={this.state.schedule_date}
              onChange={this.getScheduledate.bind(this)}
              dateFormat="yyyy/MM/dd"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              customInput={<ExampleCustomInput />}
              dayClassName = {date => setDateColorClassName(date)}
            />
            <div className="next-day" onClick={this.NextDay}>{" >"}</div>
          </div>
          <div className="main">
            {this.state.sheet_style =='A' && this.state.schedule_data !=undefined && this.state.schedule_data !=null  && Object.keys(this.state.schedule_data).length !=0 && (
              <DialRecord_A_Multi
                // ref={el => (this.componentRef = el)}
                print_page={true}
                schedule_date={formatDateLine(this.state.schedule_date)}
                rows_blood={this.state.rows_blood}
                rows_measure={this.state.rows_measure}
                rows_temp={this.state.rows_temp}
                schedule_data={this.state.schedule_data}
                patientInfo = {this.state.patientInfo}
                instruction_list = {this.state.instruction_list}
                treat_monitor_list = {this.state.treat_monitor_list}
                disease_history = {this.state.disease_history}
                showImage = {this.state.showImage}
                staff_list_by_number = {this.state.staff_list_by_number}
                doctor_list_by_number = {this.state.doctor_list_by_number}
              />
            )}
            {(this.state.schedule_data == undefined || this.state.schedule_data == null || Object.keys(this.state.schedule_data).length ==0) && this.state.patientInfo != undefined &&(
              <div className="no-exist-notice" style={{fontSize:'25px'}}>登録された透析スケジュールがありません。</div>
            )}
          </div>
          <div className="footer-buttons">
            <div className={'select-date'}>
              <label className="period-label" style={{cursor:"text"}}>期間</label>
              <DatePicker
                locale="ja"
                selected={this.state.start_date}
                onChange={this.getStartDate.bind(this)}
                dateFormat="yyyy/MM/dd"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                dayClassName = {date => setDateColorClassName(date)}
              />
              <div className={'from-to'}>～</div>
              <DatePicker
                locale="ja"
                selected={this.state.end_date}
                onChange={this.getEndDate.bind(this)}
                dateFormat="yyyy/MM/dd"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                dayClassName = {date => setDateColorClassName(date)}
              />
            </div>
            <Button className={'red-btn'} onClick={this.openPreviewModal.bind(this)}>帳票プレビュー</Button>
          </div>
          {this.state.isOpenPreviewModal  && (
            <MultiRecordSheetPreviewModal
              closeModal = {this.closeModal.bind(this)}
              patientInfo = {this.state.patientInfo}
              start_date = {formatDateLine(this.state.start_date)}
              end_date = {formatDateLine(this.state.end_date)}
            />
          )}
        </Wrapper>
      </>
    );
  }
}

RecordSheet.contextType = Context;

RecordSheet.propTypes = {
  print_data: PropTypes.object,
  rows_blood: PropTypes.array,
  rows_measure: PropTypes.array,
  rows_temp: PropTypes.array,
  history: PropTypes.object,
};

export default RecordSheet;
