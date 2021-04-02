import React, { Component } from "react";
import * as methods from "~/components/templates/Dial/DialMethods";
import styled from "styled-components";
import PropTypes from "prop-types";
import Button from "~/components/atoms/Button";
import { surface } from "~/components/_nano/colors";
import {getNextDayByJapanFormat, getPrevDayByJapanFormat, formatJapanDate, formatDateLine} from "~/helpers/date"
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import RadioButton from "~/components/molecules/RadioInlineButton";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import { getTimeZoneList } from "~/components/templates/Dial/DialMethods/getSystemTimeZone";
import axios from "axios/index";
import * as sessApi from "~/helpers/cacheSession-utils";
import { makeList_code,displayLineBreak, makeList_codeName, setDateColorClassName} from "~/helpers/dialConstants";
import BloodRecordPrintModal from "~/components/templates/Dial/Board/molecules/printSheets/BloodRecordPrintModal";
import DailyPrintSchedule from "~/components/templates/Dial/Board/molecules/printSheets/DailyPrintSchedule";
import Spinner from "react-bootstrap/Spinner";
import $ from "jquery";

const SpinnerWrapper = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
`;
const Card = styled.div`
  position: relative;
  width: 100%;
  margin: 0px;
  float: left;
  width: calc(100% - 190px);
  height: 100vh;
  position: fixed;
  background-color: ${surface};
  padding: 20px;
  .footer {
    margin-top: 20px;
    text-align: center;
    margin-left: 0px !important;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 30px;
    }
    span {
      color: white;
      font-size: 20px;
      font-weight: 100;
    }
  }

  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
  .selected{
      background: lightblue;
  }
`;
const SearchPart = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  width: 100%;
  height: 70px;
  padding: 10px;
  float: left;
  .search-box {
      width: 100%;
      display: flex;
  }
  .label-title {
    width: 95px;
    text-align: right;
    margin-right: 10px;
    font-size: 1.2rem;
  }
  .pullbox-select {
      font-size: 1rem;
      width: 9rem;
  }
  .cur_date {
    font-size: 25px;
    display: flex;
    flex-wrap: wrap;
  }
  .gender {
    font-size: 1rem;
    margin-left: 15px;
    .radio-btn label{
        width: 75px;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 4px;
        margin: 0 5px;
        padding: 4px 5px;
        font-size: 1.2rem;
        font-weight: bold;
    }
  }
  .prev-day {
    cursor: pointer;
    padding-right: 10px;
  }
  .next-day {
    cursor: pointer;
    padding-left: 10px;
  }
  .patient-count {
    width: 10%;
    font-size: 25px;
    text-align: center;
  }
 `;

const Wrapper = styled.div`
    width: 100%;
    height: calc( 100vh - 220px);
    align-items: flex-start;
    justify-content: space-between;
    font-size: 1rem;
    display: inline-block;
    .w-15{width: 15%;}
    .w-85{width: 85%;}
    .print-type {
        .radio-btn label{
            width: 100%;
            border: solid 1px rgb(206, 212, 218);
            border-radius: 4px;
            margin: 10px 0;
            padding: 4px 5px;
            font-size: 20px;
            font-weight: bold;
        }
    }
    table {
        td {
          padding: 0.25rem;
        }
        thead{
            width: calc(100% - 17px);
            display: table
        }
        th {
          position: sticky;
          text-align: center;
          vertical-align: middle;
          padding: 0.3rem;
        }
        .patient-name{
          width:240px;
        }
        tbody{
            display: block;
            height: 65vh;
            overflow-y: scroll;
            width: 100%;
        }
        .w-5rem {
            width: 5rem;
        }
        .w-15rem {
            width: 15rem;
        }
        .w-6rem {
            width: 6rem;
        }
        .shanto {
            width: 31.8rem;
        }
    }
    .
 `;

class DailyPrint extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let time_zone_list = getTimeZoneList();
    let code_master = sessApi.getObjectValue("dial_common_master","code_master");
    this.state = {
      time_zone_list,
      schedule_date: new Date(),  //日付表示
      timezone: 1,
      table_data:[],
      selected_type :'',
      selected_group :'',
      dial_group_codes:makeList_code(code_master['グループ']),
      dial_group_codes_options:makeList_codeName(code_master['グループ'], 1),
      isOpenPrintModal:false,
      isOpenScheulePrintModal:false,
      print_type:[
        {id: 1, value:"スケジュール表"},
        {id: 2, value:"記録用紙"},
        {id: 3, value:"血液透析伝票"},
        {id: 4, value:"経過管理表"},
        {id: 10, value:"回収表"},
        {id: 5, value:"申し送り一覧"},
        {id: 6, value:"Dr上申"},
        {id: 7, value:"指示リスト"},
        {id: 8, value:"抗凝固剤シール"},
        {id: 9, value:"Drカルテ"},
      ],
      is_loaded: false,
      sort_order:0,
    }
    this.display_order = [
      { id: 0, value: "ベッドNo", field_name:"bed_no"},
      { id: 1, value: "患者ID", field_name:"patient_id"},
      { id: 2, value: "カナ氏名", field_name:"name_kana"}
    ];
  }
  componentDidMount(){
    this.cnt_request = 0;
    this.cnt_response = 0;
    this.getSearchResult();
  }
  componentDidUpdate() {
    var detail_tbody = document.getElementsByClassName('detail-tbody')[0];
    let html_obj = document.getElementsByTagName("html")[0];
    var shanto_obj = document.getElementsByClassName('shanto');
    let width = html_obj.offsetWidth;
    if (detail_tbody == undefined) return;
    if(parseInt(width) < 1367){
      detail_tbody.style['height'] = '61vh';
      for(var i=0; i<shanto_obj.length; i++)
        shanto_obj[i].style['width'] = '18.8rem';
    } else if(parseInt(width) > 1919){
      detail_tbody.style['height'] = '65vh';
      for(i=0; i<shanto_obj.length; i++)
        shanto_obj[i].style['width'] = '31.8rem';
    }
    
    $(document).ready(function(){
      $(window).resize(function(){
        let html_obj = document.getElementsByTagName("html")[0];
        let width = html_obj.offsetWidth;
        if(parseInt(width) < 1367){
          detail_tbody.style['height'] = '61vh';
          for(var i=0; i<shanto_obj.length; i++)
            shanto_obj[i].style['width'] = '18.8rem';
        } else if(parseInt(width) > 1919){
          detail_tbody.style['height'] = '65vh';
          for(i=0; i<shanto_obj.length; i++)
            shanto_obj[i].style['width'] = '31.8rem';
        }
      });
    });
  }
  
  openPreviewModal = () => {
    if (this.state.selected_type == '') {
      window.sessionStorage.setItem('alert_messages','印刷する分類を選択してください。');
      return;
    }
    this.setState({
      isOpenScheulePrintModal: true,
    })
    
  };
  
  selectTimezone = (e) => {
    this.setState({ timezone: parseInt(e.target.value)}, () => {
      this.getSearchResult();
    })
  };
  
  selectPrintType = (e) => {
    
    window.sessionStorage.setItem("from_daily_print",JSON.stringify(formatDateLine(this.state.schedule_date)));
    setTimeout(()=>{
    }, 100);
    if (e.target.value == 2) {
      this.props.history.replace("/print/RecordSheet");
    } else if (e.target.value == 3) {
      if (this.state.patientInfo == undefined || this.state.patientInfo == null || this.state.patientInfo.system_patient_id == undefined) {
        window.sessionStorage.setItem("alert_messages", "患者様を選択してください。");
        return;
      }
      this.setState({isOpenPrintModal:true});
    } else if (e.target.value == 4){
      this.props.history.replace("/print/DialCourse");
    } else if (e.target.value == 5) {
      this.props.history.replace("/dial/others/sendingList");
    } else if (e.target.value == 6) {
      this.props.history.replace("/print/DrProposal");
    } else if (e.target.value == 7) {
      this.props.history.replace("/print/InstructionPrint");
    } else if (e.target.value == 8) {
      this.props.history.replace("/print/seal");
    } else if (e.target.value == 9) {
      this.props.history.replace("/print/DoctorKarte");
    } else if (e.target.value == 1) {
      this.setState({
        table_data:[],
        selected_type: parseInt(e.target.value),
      }, () => {
        this.getSearchResult();
      })
    } else if (e.target.value == 10) {
      this.props.history.replace("/print/collection_list");
    }
    
  };
  
  getDate = value => {
    this.setState({ schedule_date: value}, () => {
      this.getSearchResult();
    })
  };
  
  PrevDay = () => {
    let now_day = this.state.schedule_date;
    let cur_day = getPrevDayByJapanFormat(now_day);
    this.setState({ schedule_date: cur_day}, () => {
      this.getSearchResult();
    })
  };
  
  NextDay = () => {
    let now_day = this.state.schedule_date;
    let cur_day = getNextDayByJapanFormat(now_day);
    this.setState({ schedule_date: cur_day}, () => {
      this.getSearchResult();
    })
  };
  getSortSelect = e => {
    this.setState({ sort_order: parseInt(e.target.id)}, () => {
      this.getSearchResult();
    });
  };
  
  getSearchResult = async() => {
    if (this.state.schedule_date == undefined || this.state.schedule_date == '') return;
    if (this.state.selected_type == undefined || this.state.selected_type == '') return;
    
    var path = "/app/api/v2/dial/schedule/getDailyPrintSchedule";
    var post_data = {
      schedule_date:formatDateLine(this.state.schedule_date),
      time_zone:this.state.timezone,
      group:this.state.selected_group,
      order:this.display_order[this.state.sort_order].field_name,
      cnt_request: this.cnt_request
    }
    this.setState({is_loaded: false})
    await axios.post(path, {params: post_data}).then(res=>{
      this.cnt_response++;
      if(this.cnt_request == res.data.cnt_response) {
        this.setState({table_data:res.data.data, is_loaded:true});
        this.search_end = true;
        this.cnt_request = 0;
        this.cnt_response = 0;
      }
    }).catch((err)=>{
      this.cnt_response++;
      if(this.cnt_request == err.data.cnt_response) {
        this.setState({table_data:[], is_loaded:true});
        this.search_end = true;
        this.cnt_request = 0;
        this.cnt_response = 0;
      }
    });
  };
  
  getGroup = e => {
    this.setState({selected_group:e.target.id}, ()=> {
      this.getSearchResult();
    })
  };
  selectPatient = (patient) => {
    this.setState({
      system_patient_id:patient.system_patient_id,
      patientInfo:patient,
    });
  };
  closeModal = () => {
    this.setState({
      isOpenPrintModal:false,
      isOpenScheulePrintModal:false,
    });
  };
  
  
  render() {
    let table_list = this.state.table_data;
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className="cur-date morning example-custom-input" onClick={onClick} style={{cursor:"pointer"}}>
        {formatJapanDate(value)}
      </div>
    );
    return (
      <>
        <Card>
          <form name="frmPopup" method="post">
            <input type="hidden" name="print_type" />
            <input type="hidden" name="schedule_date" />
            <input type="hidden" name="time_zone" />
            <input type="hidden" name="time_zone_list" />
            <input type="hidden" name="table_data" />
            <input type="hidden" name="group" />
            <input type="hidden" name="group_constants" />
          </form>
          <div className="title">日常印刷</div>
          <SearchPart>
            <div className="search-box">
              <div className="cur_date flex">
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
              <div className="gender">
                  <>
                    {this.state.time_zone_list != undefined && this.state.time_zone_list.length>0 &&(
                      this.state.time_zone_list.map((item)=>{
                        return (
                          <>
                            <RadioButton
                              id={`male_${item.id}`}
                              value={item.id}
                              label={item.value}
                              name="usage"
                              getUsage={this.selectTimezone.bind(this)}
                              checked={this.state.timezone === item.id ? true : false}
                            />
                          </>
                        );
                      })
                    )}
                  </>
              </div>
              <SelectorWithLabel
                options={this.state.dial_group_codes_options}
                title="グループ"
                getSelect={this.getGroup}
                departmentEditCode={this.state.selected_group}
              />
              <SelectorWithLabel
                options={this.display_order}
                title="表示順"
                getSelect={this.getSortSelect}
                departmentEditCode={this.state.sort_order}
              />
            </div>
          </SearchPart>
          <Wrapper>
            <div className="d-flex h-100">
              <div className="type w-15 print-type">
                {this.state.print_type != undefined && this.state.print_type.length>0 &&(
                  this.state.print_type.map((item)=>{
                    return (
                      <>
                        <RadioButton
                          id={`print_type_${item.id}`}
                          value={item.id}
                          label={item.value}
                          name="print-type"
                          getUsage={this.selectPrintType.bind(this)}
                          checked={this.state.selected_type === item.id ? true : false}
                        />
                      </>
                    );
                  })
                )}
              
              </div>
              <div className="w-85 h-100 p-3">
                {this.state.selected_type === 1 && (    //スケジュール表
                  <table className="table table-bordered" id="code-table">
                    <thead>
                    <tr>
                      <th className={`w-5rem`} rowSpan={2}>ベッド名</th>
                      <th className={`w-5rem`} rowSpan={2}>透析回数</th>
                      <th className={`w-15rem`}>患者ID</th>
                      <th className={`shanto`}>シャント</th>
                      <th className={`w-5rem`}>透析時間</th>
                      <th className={`w-5rem`}>開始時刻</th>
                      <th colSpan={2}>血圧</th>
                      <th colSpan={2}>体重</th>
                    </tr>
                    <tr className="second-th">
                      <th>患者氏名</th>
                      <th>ダイアライザ</th>
                      <th>前回体重</th>
                      <th>終了時刻</th>
                      <th className={`w-5rem`}>透析前</th>
                      <th className={`w-5rem`}>透析後</th>
                      <th className={`w-5rem`}>透析前</th>
                      <th className={`w-5rem`}>透析後</th>
                    </tr>
                    </thead>
                    {this.state.is_loaded ? (
                      <>
                        <tbody className={`detail-tbody`}>
                        {table_list !== undefined && table_list !== null && table_list.length > 0 && (
                          table_list.map(item => {
                            return (
                              <>
                                <tr onClick={this.selectPatient.bind(this,item)} style={{cursor:"pointer"}}
                                    className={this.state.system_patient_id == item.system_patient_id ? "selected":""}>
                                  <td className={`w-5rem`} rowSpan={2}>{item.bed_name}</td>
                                  <td className="text-right w-5rem" rowSpan={2}>{item.dial_count_number}</td>
                                  <td className={`w-15rem`}>{item.patient_number}</td>
                                  <td className={`shanto`}>{item.shanto != undefined && item.shanto != null ? item.shanto.va_name : ''}</td>
                                  <td className={`w-5rem`}>{item.dial_time != undefined?item.dial_time: item.reservation_time}</td>
                                  <td className={`w-5rem`}>{item.start_date != null && item.start_date != ""?item.start_date: item.console_start_date}</td>
                                  <td className="text-right w-5rem" rowSpan={2}>{item.before_pressure_max != "" ? (item.before_pressure_max + "/" + item.before_pressure_min): ""}</td>
                                  <td className="text-right w-5rem" rowSpan={2}>{item.after_pressure_max != "" ? (item.after_pressure_max + "/" + item.after_pressure_min): ""}</td>
                                  <td className="text-right w-5rem" rowSpan={2}>{item.weight_before >0 ? parseFloat(item.weight_before).toFixed(1): ''}</td>
                                  <td className="text-right w-5rem" rowSpan={2}>{item.weight_after >0 ? parseFloat(item.weight_after).toFixed(1): ''}</td>
                                </tr>
                                <tr onClick={this.selectPatient.bind(this,item)} style={{cursor:"pointer"}}
                                    className={this.state.system_patient_id == item.system_patient_id ? "selected":""}>
                                  <td>{item.patient_name}</td>
                                  <td>{item.dial_dialyzer}</td>
                                  <td className="text-right w-5rem">{item.prev_weight_after >0 ? parseFloat(item.prev_weight_after).toFixed(1): ''}</td>
                                  {/* <td className="text-right w-5rem">{item.end_date != null && item.end_date != ""?item.end_date: item.console_end_date}</td> */}
                                  <td className="text-right w-5rem">{item.end_date}</td>
                                </tr>
                              </>)
                          })
                        )}
                        </tbody>
                      </>
                    ):(
                      <SpinnerWrapper>
                        <Spinner animation="border" variant="secondary" />
                      </SpinnerWrapper>
                    )}
                  </table>
                )}
                {this.state.selected_type === 2 && (
                  <table className="table table-bordered table-striped table-hover" id="code-table">
                    <tr>
                      <th className="code-number" style={{width:"110px"}}>患者番号</th>
                      <th className="patient-name" style={{width:"190px"}}>漢字氏名</th>
                      <th className="">指示内容</th>
                    </tr>
                    {table_list !== undefined && table_list !== null && table_list.length > 0 && (
                      table_list.map(item => {
                        return (
                          <>
                            <tr>
                              <td className="text-center">{item.patient_number}</td>
                              <td className="text-center">{item.patient_name}</td>
                              <td>{displayLineBreak(item.instruction)}</td>
                            </tr>
                          </>)
                      })
                    )}
                  </table>
                )}
              </div>
            </div>
            <div className="footer-buttons">
              <Button className={'red-btn'} onClick={this.openPreviewModal.bind(this)}>帳票プレビュー</Button>
            </div>
          </Wrapper>
          {this.state.isOpenPrintModal && (
            <BloodRecordPrintModal
              handleOk={this.closeModal}
              closeModal={this.closeModal}
              patient_id = {this.state.patientInfo.system_patient_id}
              schedule_date = {this.state.schedule_date}
              time_zone={this.state.timezone}
              print_data={this.state.patientInfo}
            />
          )}
          {this.state.isOpenScheulePrintModal && (
            <DailyPrintSchedule
              handleOk={this.closeModal}
              closeModal={this.closeModal}
              schedule_date = {this.state.schedule_date}
              time_zone={this.state.timezone}
              print_data={this.state}
            />
          )}
        </Card>
      </>
    )
  }
}
DailyPrint.propTypes = {
  history: PropTypes.object
};

export default DailyPrint
