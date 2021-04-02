import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import Checkbox from "~/components/molecules/Checkbox";
import Button from "~/components/atoms/Button";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import {formatDateLine,  formatJapanDate, getNextDayByJapanFormat, getPrevDayByJapanFormat} from "~/helpers/date";
import axios from "axios/index";
import * as methods from "~/components/templates/Dial/DialMethods";
import Radiobox from "~/components/molecules/Radiobox";
registerLocale("ja", ja);
import * as sessApi from "~/helpers/cacheSession-utils";
import {Dial_tab_index,
  displayLineBreak,
  stripHtml, 
  setDateColorClassName
} from "~/helpers/dialConstants";
import DrProposalPreview from "./Modal/DrProposalPreview";
import Spinner from "react-bootstrap/Spinner";
import {getServerTime} from "~/helpers/constants";

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 20rem;
  display: flex;
`;

const Wrapper = styled.div`
  position: fixed;
  top: 0px;
  width: calc(100% - 190px);
  margin: 0px;
  height: 100vh;
  background-color: ${surface};
  padding: 1.25rem;
  .title{
    font-size:2rem;
    margin-bottom:1.25rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;
    margin-right:9rem;
  }
  .flex{
    display:flex;
  }
  .custom-date-input{
      font-size: 2rem;
      margin: 0 10px;
      cursor: pointer;
  }
  .prev-day{
      font-size: 1.875rem;
      cursor: pointer;
  }
  .next-day {
      font-size: 1.875rem;
      cursor: pointer;
  }
  .others {
    position:absolute;
    right:1.25rem;
    button {
        margin-left: 0.2rem;
        margin-bottom: 0px;
        margin-top: 0.3rem;
    }
    span {
        font-size: 1rem;
    }
  }
  .disable-button {
    background: rgb(101, 114, 117);
    cursor:auto;
  }
  
  .radio-area{
    line-height: 2rem;
    label {font-size:1rem;}
  }
  
  .search_part{
    display:flex;
    margin-bottom: 0.5rem;
    .switch{
      position: absolute;
      right: 1.5rem;
      label{
        font-size:1rem;
      }
    }
  }
  .label-title{
      width:6.25rem;
      font-size:1rem;
      text-align:right;
      margin-right:0.625rem;
  }
  .pullbox-select{
      width:12.5rem;
      font-size:1rem;
  }
  .select_date_range{
    display:flex;
    margin-right: 1rem;
    .pullbox{
      margin-right:1.25rem;
    }
    span{
      margin: 0px 0.625rem;
      line-height: 2rem;
    }
    .select-period {
      display:flex;
      width:25rem;
    }
    .period-label {
      width:3rem;
      line-height: 2rem;
    }
  }
   .example-custom-input{
      font-size: 1rem;
      text-align:center;
      padding: 0 0.2rem;
      border: 1px solid;
      line-height: 2rem;
    }
    .example-custom-input.disabled{
        background:lightgray;
    }
    .content{
        background:white;
    }
    table{
        thead{
            display:table;
            width:calc(100% - 17px);
        }
        tbody{
            display:block;
            overflow-y: scroll;
            height: calc( 100vh - 17rem);
            width:100%;
        }
        tr{
            display: table;
            width:100%;
        }
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2 !important;}
        th{
            font-size:1rem;
            text-align:center;
            // border:none;
            padding-left: 2px;
            padding-right: 2px;
            word-break:break-all;
            word-wrap:break-word;
        }
        td{
            font-size:1rem;
            vertical-align:middle;
            // border:none;
            label{
                margin:0;
            }
            word-break:break-all;
            word-wrap:break-word;
        }
    }
    .a-tag{
        color: #007bff;
        text-decoration: none;
        background-color: transparent;
    }
    .a-tag:hover{
        color: #0056b3;
        text-decoration: underline;
        cursor:pointer;
    }
      .table-check {
          width: 3.5rem;
          input {margin:0;}
      }
      .date-area {
          width: 8rem;
      }
      .patient_no {
          width: 2.8rem;
      }
      .patient_type {
          width: 5.625rem;
      }
      .attach_doc {
          width: 3.75rem;
      }
      .manager_name {
          width: 5rem;
      }
      .patient_name {
          width: 20rem;
      }
      .created-name {
          width: 15rem;
      }
      .footer {
        margin-top: 0.625rem;
        text-align: center;
        button {
          text-align: center;
          border-radius: 0.25rem;
          background: rgb(105, 200, 225);
          border: none;
          margin-right: 1.875rem;
        }
        
        span {
          color: white;
          font-size: 1rem;
          font-weight: 100;
        }
    }
 `;

class DrProposal extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let patientInfo = sessApi.getObjectValue("dial_setting","patient");
    let schedule_date = sessApi.getObjectValue("from_bedside","schedule_date");
    this.state = {
      start_date:'',
      end_date:'',
      patientInfo,
      system_patient_id : patientInfo != undefined && patientInfo != null?patientInfo.system_patient_id:0,
      table_data:[],
      display_all:1,
      all_period:0,
      date_setting:schedule_date != undefined && schedule_date != null? 1 : 0,
      schedule_date:'',
      openPreviewModal:false,
      isLoaded:false,
    }
    this.go_back_flag = false;
    if (schedule_date != undefined && schedule_date != null && this.state.system_patient_id > 0) {
      this.go_back_flag = true;
      this.cache_schedule_date = schedule_date;
    }
  }
  
  async componentDidMount(){
    let schedule_date = "";
    let start_date = "";
    let end_date = "";
    let cache_schedule_date = sessApi.getObjectValue("from_bedside","schedule_date");
    sessApi.remove("from_bedside");
    let from_daily_print_date = JSON.parse(window.sessionStorage.getItem("from_daily_print"));
    window.sessionStorage.removeItem("from_daily_print");
    if(cache_schedule_date != undefined && cache_schedule_date != null){
      schedule_date = new Date(cache_schedule_date);
      start_date = schedule_date;
      end_date = schedule_date;
    } else if(from_daily_print_date != undefined && from_daily_print_date != null) {
      schedule_date = new Date(from_daily_print_date);
      start_date = schedule_date;
      end_date = schedule_date;
    } else {
      let server_time = await getServerTime();
      schedule_date = new Date(server_time);
      let today = new Date(server_time);
      let year = today.getFullYear();
      let month = today.getMonth();
      start_date = new Date(year, month, 1);
      end_date = new Date(year, month+1, 0);
    }
    this.setState({
      schedule_date,
      start_date,
      end_date
    },async()=>{
      await this.getList();
    });
  }
  
  getList = async() => {
    let path = "/app/api/v2/dial/board/getDrProposalSendingData";
    let start_date, end_date;
    if(this.state.date_setting == 0){
      let server_time = await getServerTime();
      start_date = formatDateLine(new Date(server_time));
      end_date = start_date;
    } else if(this.state.date_setting == 1){
      start_date = formatDateLine(this.state.start_date);
      end_date = formatDateLine(this.state.end_date);
    } else {
      start_date = undefined;
      end_date = undefined;
    }
    let post_data = {
      start_date,
      end_date,
      category:'Dr上申'
    };
    let { data } = await axios.post(path, {params: post_data});
    this.setState({
      table_data: data == undefined ? [] : data,
      isLoaded: true
    });
  }
  
  // モーダル
  openModal = () => {
    if(this.state.table_data !== undefined && this.state.table_data != null && this.state.table_data.length > 0){
      this.setState({openPreviewModal:true});
    }
    // let frmPop = document.frmPopup;
    // window.open("/print/DrProposal.php", 'popupView', 'width = 1080, height = 700, scrollbars=yes');
    // frmPop.action = "/print/DrProposal.php";
    // frmPop.target = 'popupView';
    // frmPop.start_date.value = JSON.stringify(this.state.start_date);
    // frmPop.end_date.value = JSON.stringify(this.state.end_date);
    // frmPop.table_data.value = JSON.stringify(this.state.table_data);
    // frmPop.all_period.value = JSON.stringify(this.state.all_period);
    // frmPop.date_setting.value = JSON.stringify(this.state.date_setting);
    // frmPop.submit();
  };
  
  closeModal=()=>{
    this.setState({openPreviewModal:false});
  };
  
  checkAllPeriod = (name, value) => {
    if (name == "period_all"){
      this.setState({all_period:value, isLoaded: false}, async() => {
        await this.getList();
      });
    }
  }
  
  getStartDate = value => {
    this.setState({ start_date: value, isLoaded: false }, async()=>{ await this.getList() });
  };
  getEndDate = value => {
    this.setState({ end_date: value, isLoaded: false }, async()=>{ await this.getList() });
  };
  
  goBedside = (system_patient_id, schedule_date) => {
    sessApi.setObjectValue("from_print", "schedule_date", schedule_date);
    sessApi.setObjectValue("from_print", "system_patient_id", system_patient_id);
    sessApi.setObjectValue("from_print", "tab_id", Dial_tab_index.DoctorProposal);
    this.props.history.replace("/dial/board/system_setting");
  }
  
  PrevDay = () => {
    let now_day = this.state.schedule_date;
    let cur_day = getPrevDayByJapanFormat(now_day);
    this.setState({
      schedule_date: cur_day,
      start_date:cur_day,
      end_date:cur_day,
      isLoaded: false
    }, async() => {
      await this.getList();
    });
    
  };
  
  NextDay = () => {
    let now_day = this.state.schedule_date;
    let cur_day = getNextDayByJapanFormat(now_day);
    this.setState({
      schedule_date: cur_day,
      start_date:cur_day,
      end_date:cur_day,
      isLoaded: false
    }, async() => {
      await this.getList();
    });
  };
  
  getDate = value => {
    this.setState({
      schedule_date: value,
      start_date:value,
      end_date:value,
      isLoaded: false
    }, async() => {
      await this.getList();
    });
  };
  
  changeDateSetting = e => {
    this.setState({
      date_setting:parseInt(e.target.value),
      isLoaded: false
    }, async() => {
      await this.getList();
    })
  }
  
  goOtherPage (url){
    this.props.history.replace(url);
  }
  
  render() {
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className={this.state.date_setting!=1?"example-custom-input disabled":"example-custom-input"} onClick={onClick}>
        {formatJapanDate(value)}
      </div>
    );
    const CustomDateInput = ({value, onClick}) => (
      <div className={"custom-date-input"} onClick={onClick}>
        {formatJapanDate(value)}
      </div>
    )
    let table_data = this.state.table_data;
    return (
      <>
        <Wrapper>
          <form name="frmPopup" method="post">
            <input type="hidden" name="start_date" />
            <input type="hidden" name="end_date" />
            <input type="hidden" name="patientInfo" />
            <input type="hidden" name="table_data" />
            <input type="hidden" name="all_period" />
            <input type="hidden" name="date_setting" />
          </form>
          <div className = "flex">
            <div className="title">Dr上申</div>
            {this.state.schedule_date != "" && (
              <>
                <div className="prev-day" onClick={this.PrevDay}>{"< "}</div>
                <DatePicker
                  locale="ja"
                  selected={this.state.schedule_date}
                  onChange={this.getDate.bind(this)}
                  dateFormat="yyyy/MM/dd"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  customInput={<CustomDateInput />}
                  dayClassName = {date => setDateColorClassName(date)}
                />
                <div className="next-day" onClick={this.NextDay}>{" >"}</div>
              </>
            )}
            <div className="others">
              {this.go_back_flag && (
                <>
                  <Button className="" onClick = {this.goBedside.bind(this, this.state.system_patient_id, this.cache_schedule_date)}>患者別に戻る</Button>
                </>
              )}
              <Button onClick={this.goOtherPage.bind(this,"/dial/others/sendingList")}>申し送り一覧</Button>
              <Button className="disable-button">Dr上申</Button>
              <Button onClick={this.goOtherPage.bind(this,"/print/InstructionPrint")}>指示</Button>
            </div>
          </div>
          <div className="search_part">
            <div className = "select_date_range">
              <div className={'select-period'}>
                {this.state.start_date != "" && (
                  <>
                    <div className={'period-label'}>期間</div>
                    <DatePicker
                      locale="ja"
                      selected={this.state.start_date}
                      onChange={this.getStartDate.bind(this)}
                      dateFormat="yyyy/MM/dd"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      disabled={this.state.date_setting!=1?true:false}
                      customInput={<ExampleCustomInput />}
                      dayClassName = {date => setDateColorClassName(date)}
                    />
                    <span>～</span>
                    <DatePicker
                      locale="ja"
                      selected={this.state.end_date}
                      onChange={this.getEndDate.bind(this)}
                      dateFormat="yyyy/MM/dd"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      disabled={this.state.date_setting!=1?true:false}
                      customInput={<ExampleCustomInput />}
                      dayClassName = {date => setDateColorClassName(date)}
                    />
                  </>
                )}
              </div>
              <div className='radio-area'>
                <Radiobox
                  label={'本日'}
                  value={0}
                  getUsage={this.changeDateSetting.bind(this)}
                  checked={this.state.date_setting === 0 ? true : false}
                  name={`date-setting`}
                />
                <Radiobox
                  label={'期間指定'}
                  value={1}
                  getUsage={this.changeDateSetting.bind(this)}
                  checked={this.state.date_setting === 1 ? true : false}
                  name={`date-setting`}
                />
                <Radiobox
                  label={'全期間'}
                  value={2}
                  getUsage={this.changeDateSetting.bind(this)}
                  checked={this.state.date_setting === 2 ? true : false}
                  name={`date-setting`}
                />
              </div>
              {/* <Checkbox
                            label = "全期間を表示"
                            getRadio={this.checkAllPeriod.bind(this)}
                            value={this.state.all_period}
                            checked={this.state.all_period === 1}
                            name="period_all"
                        /> */}
            </div>
          </div>
          <div className='content'>
            <table className="table-scroll table table-bordered table-hover" id={'code-table'}>
              <thead>
              <th className="table-check">完了</th>
              <th className="patient_name">患者情報</th>
              <th className="date-area">記入日時</th>
              <th className="created-name">記入者</th>
              <th>内容</th>
              <th className="date-area">確認日時</th>
              <th className="created-name">確認医師</th>              
              </thead>
              <tbody>
              {this.state.isLoaded == false ? (
                <div className='spinner-disease-loading center'>
                  <SpinnerWrapper>
                    <Spinner animation="border" variant="secondary" />
                  </SpinnerWrapper>
                </div>
              ):(
                <>
                  {table_data !== undefined && table_data !== null && table_data.length > 0 && (
                    table_data.map((item) => {
                      return (
                        <>
                          <tr>
                            <td className="table-check text-center">
                              <Checkbox
                                value={item.completed_by > 0}
                                checked={item.completed_by > 0}
                                name="check"
                                isDisabled={true}
                              />
                            </td>
                            <td className="patient_name a-tag" onClick={this.goBedside.bind(this, item.system_patient_number, item.updated_at)}>{item.patient_number}&nbsp;:&nbsp;{item.patient_name}</td>
                            <td className="date-area text-center">{item.updated_at!=null?item.updated_at.split(' ')[0]:''}</td>
                            <td className="created-name text-left">{item.updater_name}</td>
                            <td>{displayLineBreak(stripHtml(item.message))}</td>
                            <td className="date-area text-center">{item.completed_at!=null?item.completed_at.split(' ')[0]:''}</td>
                            <td className="created-name text-center">{item.complete_name}</td>                            
                          </tr>
                        </>
                      )
                    })
                  )}
                </>
              )}
              </tbody>
            </table>
          </div>
          <div className="footer-buttons">
            <Button className={(table_data !== undefined && table_data !== null && table_data.length > 0) ? 'red-btn' : 'disable-btn'} onClick={this.openModal}>帳票プレビュー</Button>
          </div>
        </Wrapper>
        {this.state.openPreviewModal && (
          <DrProposalPreview
            closeModal={this.closeModal.bind(this)}
            table_data={table_data}
            start_date={this.state.start_date}
            end_date={this.state.end_date}
            all_period={this.state.all_period}
            date_setting={this.state.date_setting}
          />
        )}
      </>
    )
  }
}

DrProposal.contextType = Context;

DrProposal.propTypes = {
  patientInfo: PropTypes.object,
  patientId: PropTypes.number,
  checkDoneAllFlag:PropTypes.func,
  history:PropTypes.object,
};

export default DrProposal