import React, { Component } from "react";
import PropTypes from "prop-types";
import DialSideBar from "../DialSideBar";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import Button from "~/components/atoms/Button";
import RadioButton from "~/components/molecules/RadioInlineButton";
import DatePicker,{ registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import {formatDateLine, formatDateSlash, formatJapanDate} from "~/helpers/date";
import axios from "axios/index";
import * as methods from "~/components/templates/Dial/DialMethods";
import DialPatientNav from "../DialPatientNav";
import FormWithLabel from "~/components/molecules/FormWithLabel";
import InspectionResultPreviewModal from "~/components/templates/Dial/Others/InspectionResultPreviewModal";
import {CACHE_SESSIONNAMES, getServerTime} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import {Dial_tab_index, setDateColorClassName} from "~/helpers/dialConstants";
registerLocale("ja", ja);
import Spinner from "react-bootstrap/Spinner";

const Card = styled.div`
  position: fixed;  
  top: 0px;
  width: calc(100% - 390px);
  left:200px;
  top: 70px;
  margin: 0px;
  height: calc(100vh - 70px);
  float: left;
  background-color: ${surface};
  padding: 1.25rem;
  font-size: 1rem;
  .justify-content {
    align-items: flex-start;
    justify-content: space-between;
  }
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;}
    .flex {
        display: flex;
     }
.footer {
    margin-top: 10px;
    text-align: center;
    clear: both;
    display: flex;
    position:relative;
    input{
        width:70px;
    }
    span {
      color: white;
      font-size: 1rem;    
      font-weight: normal;    
    }
    div{
      font-size:1.2rem;
    }
    
    .label-title{
      text-align:right;
      font-size:1.2rem;
    }
    .radio-btn{
        label{
          width: 5rem;
          border: 1px solid;
          margin-top: 15px;
          border-radius: 0px;
          margin-right: 3px;
          font-weight:600;
          font-size:1.2rem;
        }
    }
    .gender-label{
        margin-top:15px;
    }
    .jyodVd {
        flex-direction: row;
    }
    .cHYXnj {
        display: block;
        margin-top: 17px;
        width:7rem;
    }
    .eqryTP {
        display: block;
        margin-top: 10px;
    }
}
.other-pattern {
    position:absolute;
    right:1.25rem;
    button {
        margin-left: 0.2rem;
        margin-bottom: 0px;
        margin-top: 0.3rem;
        padding: 8px 10px;
        min-width: 5rem;
    }
    span {
        font-size: 1rem;
    }
  }
  .disable-button {
    background: rgb(101, 114, 117);
  }

  .print-button{
    position: absolute;
    right: 1.25rem;
    span {
      color: white;
      font-size: 1.25rem;
    }
    .red-btn {
      background: #cc0000;
      span {
        color: #ffffff;
      }
    }
    .red-btn:hover {
      background: #e81123;
      span {
        color: #ffffff;
      }
    }
  }
`;

const SearchPart = styled.div`
  display: flex;
  font-size: 1rem;
  width: 100%;
  height: 70px;
  padding: 1.25rem;
  .list-title {
    margin-top: 00px;
    font-size: 1.25rem;
    width: 20%;
  }
  .search-box {
      width: 80%;
      display: flex;
  }
  .label-title {
    width: 95px;
    text-align: right;
    margin-right: 10px;
  }
  .pullbox-select {
      font-size: 1rem;
      width: 200px;
  }
  .checkbox_area{
      margin-top:16px;
      label{
          font-size:1rem;
      }
  }
  .react-datepicker-wrapper {
    cursor:pointer;
  }
 `;

const List = styled.div`
  display: block;
  font-size: 1rem;
  width: 18%;
  height: 100%;
  padding: 2px;
  overflow-y: auto;
  border: solid 1px lightgrey;
  .table-row {
    font-size: 1rem;        
  }
  .selected {
    background: rgb(105, 200, 225) !important;
    color: white;
  }
  
  .table-row{
    background-color:white;
  }
  .none-table-row{
    background-color:#a2a2a2
  }
  div{
    border: 1px solid #dee2e6;
  }
  div:hover{
    background-color:#e2e2e2
  }
 `;

const Wrapper = styled.div`
  display: block;
  font-size: 1rem;
  width: 80%;
  height: 100%;
  border: solid 1px lightgrey;
  margin-bottom: 10px;
  label {
      text-align: right;
  }
    .flex {
        display: flex;
     }
    .inline-flex {
        display: inline-flex;
        border-bottom: 1px solid gray;
     }
     .fl {
        float: left;
     }
  table {
      overflow-y: auto;
      tr:nth-child(even) {background-color: #f2f2f2;}
      tr:hover{background-color:#e2e2e2 !important;}
      td {
          padding: 0.25rem;
      }
      th {
          text-align: center;
          padding: 0.3rem;
      }
      .table-check {
          width: 60px;
      }
      .item-no {
        width: 50px;
      }
      .code-number {
          width: 120px;
      }
  }
  
    .table-area {
        height: 100%;
        width: 100%;
        border: solid 1px darkgray;
        overflow-y: auto;
        overflow-x: scroll;
        .exam_name {
            width: 20rem;
            border-right: 1px solid gray;
            line-height: 2rem;
            padding-left:0.3rem;
        }
        .exam_unit {
            width: 10rem;
            border-right: 1px solid gray;
            line-height: 2rem;
            padding-left:0.3rem;
            padding-right:0.3rem;
        }
        .exam_date {
            width: 10rem;
            border-right: 1px solid gray;
            line-height: 2rem;
        }
        .exam_value {
            width: 5rem;
            padding-right: 5px;
            border-right: 1px solid gray;
            line-height: 2rem;
        }
        .table-menu {
            background-color: gainsboro;
            .exam_name, .exam_unit {
              line-height: 4rem;
            }
        }
    }
    .table-record:hover{
        background-color:#e2e2e2
    }
 `;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class InspectionResult extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    this.state = {
      schVal: "",
      curPatternCode:0,
      exam_table_data:[],
      examination_start_date:'',
      examination_end_date:'',
      patientInfo: patientInfo != undefined && patientInfo != null ? patientInfo : null,
      period_month:6,
      period_month_text:'',
      isOpenPreviewModal:false,
      all_exam_data:[],
      examinationPatternList:[],
      is_loaded:false,
    };
  }

  async componentDidMount() {
    let cur_date = "";
    let examination_end_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
    if(examination_end_date != undefined && examination_end_date != null){
      cur_date = new Date(examination_end_date);
    } else {
      let server_time = await getServerTime();
      cur_date = new Date(server_time);
    }
    sessApi.setObjectValue('for_left_sidebar', 'date', formatDateLine(cur_date));
    let path = "/app/api/v2/dial/master/get_examination_pattern_with_items";
    const { data } = await axios.post(path, {params: {order:'name_kana'}});
    this.setState({
      examination_start_date:new Date(cur_date.getFullYear(), cur_date.getMonth(), 1),
      examination_end_date:cur_date,
      examinationPatternList: data,
      is_loaded:true,
    }, () => {
      this.getSearchResult();
    });
  }
  
  componentWillUnmount (){
    sessApi.remove('for_left_sidebar');
  }

  handlePattern = (pattern_code) => {
    this.setState({
      curPatternCode: pattern_code
    }, () => {
      this.getSearchResult();
    });
  };

  selectPatient = (patientInfo) => {
    let cur_date = new Date(this.state.examination_end_date);
    cur_date.setMonth(cur_date.getMonth() - 6);
    this.setState({
      patientInfo: patientInfo,
      exam_table_data:[],
      isOpenModal: false,
      curPatternCode: 0,
      examination_start_date:cur_date,
      period_month:6,
      period_month_text:''
    }, () => {
      this.getSearchResult();
    })
  };

  getSearchResult = async () => {
    if(this.state.patientInfo !== null){
      let path = "/app/api/v2/dial/medicine_information/examination_data/getByDrkarte";
      let examination_end_date = this.state.examination_end_date;
      let cur_date = new Date(formatDateLine(examination_end_date));
      cur_date.setMonth(cur_date.getMonth() - parseInt(this.state.period_month));
      let post_data = {
        system_patient_id: this.state.patientInfo.system_patient_id,
        examination_start_date: formatDateLine(cur_date),
        examination_end_date: formatDateLine(examination_end_date),
        curPatternCode: this.state.curPatternCode,
        type:'asc',
      };
      const { data } = await axios.post(path, {params: post_data});
      var all_exam_data = this.state.all_exam_data;
      if (this.state.curPatternCode == 0){
        all_exam_data = data;
      }
      this.setState({
        exam_table_data: data,
        all_exam_data,
      });
    }
  };

  getRadio = (name) => {
    if (name === "check") {
      // console.log(name)
    }
  };

  getPeriod = value => {
    this.setState({
      period_month: value,
      period_month_text: '',
    }, ()=>{
      this.getSearchResult();
    })
  };


  getDate = value => {
    this.setState({examination_end_date: value}, ()=>{
      this.getSearchResult();
      sessApi.setObjectValue('for_left_sidebar', 'date', formatDateLine(this.state.examination_end_date));
    })
  };

  getPeriodMonths = (e) => {
    this.setState({
      period_month_text: e.target.value,
    })
  }

  onInputKeyPressed = (e) => {

    if(e.keyCode === 13 && this.state.period_month_text !== '' && (!isNaN(parseInt(this.state.period_month_text)))){
      this.setState({
        period_month: parseInt(this.state.period_month_text),
      }, ()=>{
        this.getSearchResult();
      })
    }
  }

  openPreviewModal = () => {
    if(this.state.patientInfo === null) {
      window.sessionStorage.setItem("alert_messages", "患者様を選択してください。");
      return;
    }
    if(this.state.exam_table_data === undefined || this.state.exam_table_data == null || (this.state.exam_table_data !== undefined && this.state.exam_table_data != null && this.state.exam_table_data.length === 0)) {
      window.sessionStorage.setItem("alert_messages", "検査結果がありません。");
      return;
    }
    this.setState({isOpenPreviewModal: true});
  };

  closeModal=()=>{
    this.setState({isOpenPreviewModal: false});
  };

  gotoBedside = () => {
    let patientInfo = this.state.patientInfo;
    let examination_end_date = this.state.examination_end_date;
    if (patientInfo != undefined && patientInfo != null && patientInfo.system_patient_id != undefined && examination_end_date != undefined) {
      sessApi.setObjectValue("from_print", "schedule_date",formatDateLine(examination_end_date));
      sessApi.setObjectValue("from_print", "system_patient_id", patientInfo.system_patient_id);
      sessApi.setObjectValue("from_print", "tab_id", Dial_tab_index.PatientInformation);
      setTimeout(() => {
        this.props.history.replace("/dial/board/system_setting");
      }, 100);
    }
  }

  goOtherPage = (url) => {
    this.props.history.replace(url);
  }

  checkExistExam = (pattern_items) => {
    if (pattern_items == undefined || pattern_items == null || pattern_items.length == 0) return false;
    var all_exam_data = this.state.all_exam_data;
    if (all_exam_data.length == 0) return false;
    var result = false;
    var all_exam_codes =Object.keys(all_exam_data[1]);
    pattern_items.map(item => {
      if (all_exam_codes.includes(item.item_code)) result = true;
    })
    return result;
  }

  getPatternName = (code = null) => {
    if (code == null || code == undefined || code == "" || code == 0) return '';
    if (this.state.examinationPatternList.length == 0) return '';
    let result = "";
    this.state.examinationPatternList.map(item=>{
      if (item.code == code) {
        result = item.name;
      }
    });
    return result;
  }

  render() {
    let {examinationPatternList} = this.state;
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className="cur-date example-custom-input" onClick={onClick}>
        {formatJapanDate(value)}
      </div>
    );
    var is_enabled = false;
    if (this.state.patientInfo != undefined && this.state.patientInfo != null && this.state.patientInfo.system_patient_id > 0) is_enabled = true;
    return (
      <>
        <DialSideBar
          onGoto={this.selectPatient}
          history = {this.props.history}
        />
        <DialPatientNav
          patientInfo={this.state.patientInfo}
          history = {this.props.history}
        />
        <Card>
          <div className="d-flex">
            <div className="title">検査結果一覧表</div>
            <div className={'other-pattern'}>
              {is_enabled && (
                <Button onClick={this.gotoBedside.bind(this)} style={{marginRight:'1.5rem'}}>ベッドサイド</Button>
              )}
              <Button className="disable-button">検査結果</Button>
              <Button onClick={this.goOtherPage.bind(this,"/dial/others/complications_inspection_result")}>合併症検査結果</Button>
            </div>
          </div>
          <SearchPart>
            <div className="list-title">
              <DatePicker
                locale="ja"
                selected={this.state.examination_end_date}
                onChange={this.getDate.bind(this)}
                dateFormat="yyyy/MM/dd"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                dayClassName = {date => setDateColorClassName(date)}
                customInput={<ExampleCustomInput />}
              />
            </div>
            {/* <div className="checkbox_area">
                            <Checkbox
                                label="体重・血圧を表示"
                                getRadio={this.getRadio.bind(this)}
                                // value={this.state.allChecked}
                                name="check"
                            />
                            <Checkbox
                                label="DWを表示"
                                getRadio={this.getRadio.bind(this)}
                                // value={this.state.allChecked}
                                name="check"
                            />
                        </div> */}
          </SearchPart>
          <div className={'flex justify-content'} style={{height:"calc(100% - 220px)"}}>
            <List>
              <div className={this.state.curPatternCode === 0 ? "selected table-row" : "table-row"} style={{cursor:"pointer"}} onClick={()=>this.handlePattern(0)}>{'すべて'}</div>
              {this.state.is_loaded ? (
                <>
                  {examinationPatternList.length > 0 && (
                    examinationPatternList.map((item) => {
                      if(item.is_enabled !== 0){
                        return (
                          <>
                            <div
                              style={{cursor:"pointer"}}
                              className={item.code === this.state.curPatternCode ? "selected" : this.checkExistExam(item.pattern_items)?"table-row":"none-table-row"}
                              onClick={()=>this.handlePattern(item.code)}
                            >
                              {item.name}
                            </div>
                          </>
                        )
                      }
                    })
                  )}
                </>
              ):(
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              )}
            </List>
            <Wrapper>
              <div className="table-area">
                { this.state.exam_table_data !== undefined && this.state.exam_table_data !== null && this.state.exam_table_data.length > 0 && (
                  <>
                    <div style={{float:"left"}}>
                      <div className={'inline-flex table-menu'}>
                        <div className="text-center exam_name">検査名</div>
                        <div className="text-center exam_unit">単位</div>
                        <div className="text-center exam_unit">基準値</div>
                        {this.state.exam_table_data[0] !== undefined && this.state.exam_table_data[0] !== null && this.state.exam_table_data[0].length > 0 && (
                          this.state.exam_table_data[0].map((item) => {
                            return (
                              <>
                                <div>
                                  <div className="text-center exam_date">{formatDateSlash(new Date(item))}</div>
                                  <div className={'flex'} style={{borderTop:"1px solid gray"}}>
                                    <div className="text-center exam_value">前</div>
                                    <div className="text-center exam_value">後</div>
                                  </div>
                                </div>
                              </>)
                          })
                        )}
                      </div>
                    </div>
                    {this.state.exam_table_data[1] !== undefined && this.state.exam_table_data[1] !== null && (
                      Object.keys(this.state.exam_table_data[1]).map((index) => {
                        let item = this.state.exam_table_data[1][index];
                        return (
                          <>
                            <div style={{float:"left"}}>
                              <div className={'inline-flex table-record'}>
                                <div className="text-left exam_name">{item.name}</div>
                                <div className="text-left exam_unit">{item.unit}</div>
                                { this.state.patientInfo != null && this.state.patientInfo.gender === 1 ? (
                                  <div className="exam_unit">{(item.reference_value_male != undefined && item.reference_value_male != null && item.reference_value_male !== '') ? "男:" + item.reference_value_male :
                                    ((item.reference_value_male_min!=null && item.reference_value_male_min!="" ? item.reference_value_male_min + "~" : "") + (item.reference_value_male_max!= null ?item.reference_value_male_max:""))}</div>
                                ) : (
                                  <div className="exam_unit">{(item.reference_value_female != undefined && item.reference_value_female != null && item.reference_value_female !== '') ? "女:" + item.reference_value_female :
                                    ((item.reference_value_female_min!=null && item.reference_value_female_min!="" ? item.reference_value_female_min + "~" : "")  + (item.reference_value_female_max!= null ?item.reference_value_female_max:""))}</div>
                                )}
                                {this.state.exam_table_data[0] !== undefined && this.state.exam_table_data[0] !== null && this.state.exam_table_data[0].length > 0 && (
                                  this.state.exam_table_data[0].map((date) => {
                                    if(item[date] != undefined){
                                      return (
                                        <>
                                          <div className="text-right exam_value">{item[date].value}</div>
                                          { item[date].value2 != undefined ? (
                                            <div className="text-right exam_value">{item[date].value2}</div>
                                          ) : (
                                            <div className="text-right exam_value"> </div>
                                          )}
                                        </>
                                      )
                                    } else {
                                      return (
                                        <>
                                          <div className="text-right exam_value"> </div>
                                          <div className="text-right exam_value"> </div>
                                        </>
                                      )
                                    }
                                  })
                                )}
                              </div>
                            </div>
                          </>
                        )
                      })
                    )}
                  </>
                )}
              </div>
            </Wrapper>
          </div>
          <div className="footer">
            <div className={'flex'}>
              <FormWithLabel
                type="number"
                label="指定日から"
                onChange={this.getPeriodMonths.bind(this)}
                onKeyPressed={this.onInputKeyPressed}
                value={this.state.period_month_text}
              />
              <label className="mr-2 gender-label">ヶ月</label>
            </div>
            <RadioButton
              id="period_1"
              value={0}
              label="６ヶ月"
              name="period"
              getUsage={this.getPeriod.bind(this, 6)}
              checked={this.state.period_month === 6}
            />
            <RadioButton
              id="period_2"
              value={1}
              label="１年"
              name="period"
              getUsage={this.getPeriod.bind(this, 12)}
              checked={this.state.period_month === 12}
            />
            <RadioButton
              id="period_3"
              value={2}
              label="2年"
              name="period"
              getUsage={this.getPeriod.bind(this, 24)}
              checked={this.state.period_month === 24}
            />
            <div className='print-button'>
              <Button className='red-btn' onClick={this.openPreviewModal}>帳票プレビュー</Button>
            </div>
          </div>
          {this.state.isOpenPreviewModal && (
            <InspectionResultPreviewModal
              closeModal={this.closeModal}
              print_data={this.state.exam_table_data}
              patientInfo={this.state.patientInfo}
              patternCodeName={this.getPatternName(this.state.curPatternCode)}
              title = {'検査結果一覧表'}
              sub_title = {'検査項目パターン'}
              end_date={formatDateLine(this.state.examination_end_date)}
              period_month = {this.state.period_month}
            />
          )}
        </Card>
      </>
    )
  }
}
InspectionResult.propTypes = {
  history:PropTypes.object,
};
export default InspectionResult