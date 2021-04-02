import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import {formatDateLine,  formatJapanDate, formatDateIE, getPrevDayByJapanFormat, getNextDayByJapanFormat} from "~/helpers/date";
import axios from "axios/index";
import * as methods from "~/components/templates/Dial/DialMethods";
import Radiobox from "~/components/molecules/Radiobox";
registerLocale("ja", ja);
import * as sessApi from "~/helpers/cacheSession-utils";
import {Dial_tab_index,  Instruction_status, displayLineBreak, setDateColorClassName} from "~/helpers/dialConstants";
import InstructionPrintPreview from "./Modal/InstructionPrintPreview";
import renderHTML from 'react-render-html';
import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 20rem;
  display: flex;
`;

const Wrapper = styled.div`
  position:fixed;
  padding:1.25rem 0.625rem;
  border:1px solid lightgrey;
  height: 100vh;
  width: calc(100% - 190px);
  .title{
    font-size:2rem;
    margin-left:1.875rem;
    margin-bottom:1.25rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;
    margin-right:9rem;
  }
  .flex{
      display:flex;
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
  
  .search_part{
    display:flex;
    .switch{
      position: absolute;
      right: 1.5rem;
      label{
          font-size:1rem;
      }
    }
}
.label-title{
    width:5rem;
    font-size:1rem;
    text-align:right;
    margin-right:0.625rem;
}
.pullbox-select{
    width:9.375rem;
    font-size:1rem;
}
.select_date_range{
    display:flex;
    .pullbox{
        margin-right:1.25rem;
    }
    span{
        padding-top:0.5rem;
    }
    label{
      margin-left: 1.5rem;
      font-size: 1rem;
    }
    .pullbox-label{
        margin-leff: 0px;
    }
    .ixnvCM{
        padding-top:0.3rem;
    }
}
.radio-area{
  padding-top:5px;
}
.example-custom-input{
    font-size: 1rem;
    width:12rem;
    text-align:center;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
    border: 1px solid;
    margin-left:0.3rem;
    margin-right:0.3rem;
}
.example-custom-input.disabled{
    background:lightgray;
}
.custom-date-input{
    font-size: 2rem;
    margin: 0 10px;
    cursor: pointer;
}
.content{
    background:white;
    margin-bottom: 1rem;
}
    table{
        margin-bottom:2px;
        thead{
            display:table;
            width:calc(100%);
        }
        tbody{
            display:block;
            overflow-y: auto;
            height: calc( 100vh - 17rem);
            width:100%;
        }
        tr{
            display: table;
            width:100%;
        }
        th{
            font-size:1rem;
            text-align:center;
            padding-left: 2px;
            padding-right: 2px;
            word-break:break-all;
            word-wrap:break-word;
        }
        td{
            font-size:1rem;
            vertical-align:middle;
            label{
                margin:0;
            }
            word-break:break-all;
            word-wrap:break-word;
            p{
                margin-bottom:0px;
            }
        }
        .top-div {
          margin-top: -1.5rem;
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
    .check-status {
        width: 6.25rem;
    }
    .date-area {
        width: 7.5rem;
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

const order_options = [
  { id: 0, value: "", field_name:"" },
  { id: 1, value: "日時", field_name:"write_date"},
  { id: 2, value: "対応状況", field_name:"status"},
]
class InstructionPrint extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let patientInfo = sessApi.getObjectValue("dial_setting","patient");
    var schedule_date = sessApi.getObjectValue("from_bedside","schedule_date");    

    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth();
    var start_date = new Date(year, month, 1);
    var end_date = new Date(year, month+1, 0);
    sessApi.remove("from_bedside");
    this.state = {
      start_date:schedule_date != undefined && schedule_date != null?new Date(schedule_date) : start_date,
      end_date:schedule_date != undefined && schedule_date != null?new Date(schedule_date) : end_date,
      patientInfo,
      system_patient_id : patientInfo != undefined && patientInfo != null?patientInfo.system_patient_id:0,
      table_data:[],
      display_all:1,
      isLoaded:false,
      all_period:0,
      date_setting:schedule_date != undefined && schedule_date != null? 1 : 0,
      schedule_date:schedule_date != undefined && schedule_date != null?new Date(schedule_date) : new Date(),
      openPreviewModal:false,
    }
    this.go_back_flag = false;
    if (schedule_date != undefined && schedule_date != null && this.state.system_patient_id > 0) {
      this.go_back_flag = true;
      this.cache_schedule_date = schedule_date;
    }
  }
  
  async componentDidMount(){
    let from_daily_print_date = JSON.parse(window.sessionStorage.getItem("from_daily_print"));
    window.sessionStorage.removeItem("from_daily_print");
    if (from_daily_print_date != undefined && from_daily_print_date != null){
      this.setState({schedule_date:new Date(from_daily_print_date)},()=>{
        this.getList();
      })
    } else {
      this.getList();
    }
  }
  
  getList = async() => {
    // let patientInfo = sessApi.getObjectValue("dial_setting","patient");
    // if (patientInfo == undefined || patientInfo == null){
    //     return;
    // }
    
    let path = "/app/api/v2/dial/board/Soap/getInstruction";
    var start_date, end_date;
    switch(this.state.date_setting){
      case 0:
        start_date = formatDateLine(new Date());
        end_date = formatDateLine(new Date());
        break;
      case 1:
        start_date = formatDateLine(this.state.start_date);
        end_date = formatDateLine(this.state.end_date);
        break;
      case 2:
        start_date = undefined;
        end_date = undefined;
        break;
    }
    let post_data = {
      // patient_id: patientInfo.system_patient_id,
      start_date,
      end_date,
      status: this.state.status,
      order_field: this.state.order_field,
    };
    let { data } = await axios.post(path, {params: post_data});
    this.setState({
      table_data: data == undefined ? [] : data,
      isLoaded: true
    });
  }
  
  changeDateSetting = e => {
    this.setState({
      date_setting:parseInt(e.target.value),
      isLoaded: false
    }, () => {
      this.getList();
    })
  }
  
  // モーダル
  openModal = () => {
    if(Object.keys(this.state.table_data).length > 0){
      this.setState({openPreviewModal:true});
    }
    // let frmPop = document.frmPopup;
    // window.open("/print/Instruction.php", 'popupView', 'width = 1080, height = 700, scrollbars=yes');
    // frmPop.action = "/print/Instruction.php";
    // frmPop.target = 'popupView';
    // frmPop.start_date.value = JSON.stringify(this.state.start_date);
    // frmPop.end_date.value = JSON.stringify(this.state.end_date);
    // frmPop.table_data.value = JSON.stringify(this.state.table_data);
    // frmPop.all_period.value = JSON.stringify(this.state.all_period);
    // frmPop.date_setting.value = JSON.stringify(this.state.date_setting);
    // frmPop.Instruction_status_constants.value = JSON.stringify(Instruction_status);
    // frmPop.submit();
  };
  
  closeModal=()=>{
    this.setState({openPreviewModal:false});
  };
  
  
  checkAllPeriod = (name, value) => {
    if (name == "period_all"){
      this.setState({all_period:value, isLoaded: false}, () => {
        this.getList();
      });
    }
  }
  
  getStartDate = value => {
    this.setState({ start_date: value, isLoaded: false }, ()=>{ this.getList() });
  };
  
  getEndDate = value => {
    this.setState({ end_date: value, isLoaded: false }, ()=>{ this.getList() });
  };
  
  getSearchStatus = (e) => {
    this.setState({status:parseInt(e.target.id), isLoaded: false}, () => {
      this.getList();
    })
  }
  
  getOrder = e => {
    this.setState({order_field: order_options[parseInt(e.target.id)].field_name, isLoaded: false}, () => {
      this.getList();
    })
  }
  
  goBedside = (system_patient_id, schedule_date) => {
    sessApi.setObjectValue("from_print", "schedule_date", schedule_date);
    sessApi.setObjectValue("from_print", "system_patient_id", system_patient_id);
    sessApi.setObjectValue("from_print", "tab_id", Dial_tab_index.Instruction);
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
    }, () => {
      this.getList();
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
    }, () => {
      this.getList();
    });
  };
  
  getDate = value => {
    this.setState({
      schedule_date: value,
      start_date:value,
      end_date:value,
      isLoaded: false
    }, () => {
      this.getList();
    });
  };
  prescriptionRender = (pres_array) => {
    let max_length = this.state.drkarte_style !== undefined && this.state.drkarte_style.instruction_list_width !== undefined ? this.state.drkarte_style.instruction_list_width : 120;
    return (pres_array.map(item=> {
      let lines = parseInt(item.left_str.length / max_length);
      let mods = (item.left_str.length % max_length + item.right_str.length) > max_length;
      let topstyle = lines > 0 && !mods;
      return (
        <div className="" key={item} style={{clear:"both"}}>
          <div className="left-div" style={(item.rp_key === undefined || item.rp_key >0) ? {float:"left"}:{float: "left", marginLeft:"1.5rem"}}>{item.left_str}</div>
          <div className={topstyle?"top-div":""} style={item.is_usage == 1 ? {float:"right", marginRight:"3rem"}:{float:"right"}}>{item.right_str}</div>
        </div>
      )
    }))
  }
  
  IsJsonString = (str) => {
    try {
      var json = JSON.parse(str);
      return (typeof json === 'object');
    } catch (e) {
      return false;
    }
  }
  
  goOtherPage (url){
    this.props.history.replace(url);
  }
  
  render() {
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className={this.state.date_setting!=1 ? "example-custom-input disabled" : "example-custom-input"} onClick={onClick} style={{cursor : this.state.date_setting == 1 ? 'pointer' : ''}}>
        {formatJapanDate(value)}
      </div>
    );
    
    const CustomDateInput = ({value, onClick}) => (
      <div className={"custom-date-input"} onClick={onClick}>
        {formatJapanDate(value)}
      </div>
    )
    
    let table_data = this.state.table_data;
    var instruction_options =[
      { id: 0, value: "" },
      { id: 1, value: "未"},
      // { id: 2, value: "要確認" },
      // { id: 3, value: "対応中"},
      { id: 4, value: "済"},
    ]
    return (
      <>
        {/* <DialSideBar
                onGoto={this.selectPatient}
            />
            <DialPatientNav
                patientInfo={this.state.patientInfo}
            /> */}
        <Wrapper>
          <form name="frmPopup" method="post">
            <input type="hidden" name="start_date" />
            <input type="hidden" name="end_date" />
            <input type="hidden" name="patientInfo" />
            <input type="hidden" name="table_data" />
            <input type="hidden" name="all_period" />
            <input type="hidden" name="date_setting" />
            <input type="hidden" name="Instruction_status_constants" />
          </form>
          <div className = "flex">
            <div className="title">指示一覧</div>
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
            <div className="others">
              {this.go_back_flag && (
                <>
                  <Button className="" onClick = {this.goBedside.bind(this, this.state.system_patient_id, this.cache_schedule_date)}>患者別に戻る</Button>
                </>
              )}
              <Button onClick={this.goOtherPage.bind(this,"/dial/others/sendingList")}>申し送り一覧</Button>
              <Button onClick={this.goOtherPage.bind(this,"/print/DrProposal")}>Dr上申</Button>
              <Button className="disable-button" >指示</Button>
            </div>
          </div>
          <div className="search_part">
            <div className = "select_date_range">
              <SelectorWithLabel
                options={instruction_options}
                title="対応状況"
                getSelect={this.getSearchStatus}
                departmentEditCode={this.state.status}
              />
              {/* <SelectorWithLabel
                          options={order_options}
                          title="表示順"
                          getSelect={this.getOrder}
                          departmentEditCode={this.state.order_field}
                        /> */}
              <label style={{marginRight:'5px', paddingTop:'5px',cursor:"text"}}>期間</label>
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
              {/* <Checkbox
                            label = "全期間を表示"
                            getRadio={this.checkAllPeriod.bind(this)}
                            value={this.state.all_period}
                            checked={this.state.all_period === 1}
                            name="period_all"
                        /> */}
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
            </div>
          </div>
          <div className='content'>
            <table className="table-scroll table table-bordered table-hover" id={'code-table'}>
              <thead>
              <th className="check-status">対応状況</th>
              <th className="patient_name">患者情報</th>
              <th className="date-area">記入日</th>
              <th className="created-name">記入者</th>
              <th>指示内容</th>
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
                  {Object.keys(table_data).length > 0 && (
                    Object.keys(table_data).map((key) => {
                      if (key != ''){
                        return(
                          <>
                            <tr onContextMenu={e => this.handleClick(e, table_data[key][0])}>
                              <td className="check-status text-center">
                                {table_data[key][0].status!=null?Instruction_status[table_data[key][0].status]:'未'}
                              </td>
                              <td className="patient_name text-left a-tag" onClick={this.goBedside.bind(this, table_data[key][0].system_patient_id, table_data[key][0].write_date)}>
                                {table_data[key][0].patient_number}&nbsp;:&nbsp;{table_data[key][0].patient_name}
                              </td>
                              <td className="date-area text-center">{formatDateLine(formatDateIE(table_data[key][0].write_date))}</td>
                              <td className="created-name text-left">{table_data[key][0].updater_name}</td>
                              <td>
                                {table_data[key].map(item => {
                                  if (item.category_1 == "Drカルテ" && item.category_2.includes('処方') && this.IsJsonString(item.body)) {
                                    return (
                                      <>
                                        <div>{this.prescriptionRender(JSON.parse(item.body))}</div>
                                      </>
                                    )
                                  } else {
                                    return(
                                      <>
                                        <div>{displayLineBreak(renderHTML(item.body))}</div>
                                      </>
                                    )
                                  }
                                })}
                              </td>
                            </tr>
                          </>
                        )
                      }
                    })
                  )}
                </>
              )}
              </tbody>
            </table>
          </div>
          <div className="footer-buttons">
            <Button onClick={this.openModal} className={Object.keys(table_data).length > 0 ? 'red-btn' : 'disable-btn'}>帳票プレビュー</Button>
          </div>
        </Wrapper>
        {this.state.openPreviewModal && (
          <InstructionPrintPreview
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

InstructionPrint.contextType = Context;

InstructionPrint.propTypes = {
  patientInfo: PropTypes.object,
  patientId: PropTypes.number,
  checkDoneAllFlag:PropTypes.func,
  history:PropTypes.object,
};

export default InstructionPrint