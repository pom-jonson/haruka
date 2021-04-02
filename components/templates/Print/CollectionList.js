import React, { Component } from "react";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import { surface } from "~/components/_nano/colors";
import {
  getNextDayByJapanFormat,
  getPrevDayByJapanFormat,
  formatJapanDate,
  formatDateLine,
} from "~/helpers/date"
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import RadioButton from "~/components/molecules/RadioInlineButton";
import * as apiClient from "~/api/apiClient";
import { getTimeZoneList } from "~/components/templates/Dial/DialMethods/getSystemTimeZone";
import * as sessApi from "~/helpers/cacheSession-utils";
import {CACHE_SESSIONNAMES} from "~/helpers/constants";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Checkbox from "~/components/molecules/Checkbox";
import CollectionListPrintPreview from "~/components/templates/Print/CollectionListPrintPreview";
import {setDateColorClassName} from '~/helpers/dialConstants';

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
    .react-datepicker-popper {
        z-index: 10 !important;
    }
  }
  .label-title {
    width: 95px;
    text-align: right;
    margin-right: 10px;
    font-size: 1.25rem;
  }
  .pullbox-select {
      font-size: 12px;
      width: 110px;
  }
  .cur_date {
    font-size: 25px;
    display: flex;
    flex-wrap: wrap;
  }
  .select-today {
      padding-left:1rem;
      font-size: 1.5rem;
      cursor: pointer;
  }
  .gender {
    font-size: 12px;
    margin-left: 15px;
    .radio-btn label{
        width: 75px;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 4px;
        margin: 0 5px;
        padding: 4px 5px;
        font-size: 1.25rem;
        font-weight: bold;
    }
  }
    .select-group {
        .pullbox {
            .label-title {
                width: 6rem;
                margin-bottom: 0;
            }
            .pullbox-label {
                margin-bottom: 0;
                select {
                    width: 15rem;
                    height: 38px;
                }
            }
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
  font-size: 1rem;
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .table-area {
    table{
      margin-bottom:4px;
    }
    tr:nth-child(even) {background-color: #f2f2f2;}
    tr:hover{background-color:#e2e2e2 !important;}
    thead{
      display:table;
      width:100%;
    }
    tbody{
      display:block;
      overflow-y: auto;
      height: calc( 100vh - 18rem);
      width:100%;
    }
    tr{
      display: table;
      width: 100%;
    }
    td {
      word-break: break-all;
      padding: 0.25rem;
      font-size:1rem;
    }
    th {
        position: sticky;
        text-align: center;
        padding: 0.3rem;
        font-size:1rem;
    }
    .td-check {
        width: 2rem;
        text-align: center;
        label {
            margin:0;
        }
    }
    .end-time{
        width: 5rem;
    }
    .patient-name{
        width: 20rem;
    }
  }
  .btn-area {
    text-align: center;
    span {
        font-size: 16px;
    }
  }

 `;

class PatientGroup extends Component {
  constructor(props) {
    super(props);
    this.time_zone_list = getTimeZoneList();
    this.time_zone_list.push({id:0, value:"全て"});
    let code_master = sessApi.getObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER,"code_master");
    this.dial_group_codes = [];
    this.dial_group_codes.push({id:0, value:"全て"});
    code_master['グループ'].map(dial_group=>{
      if(dial_group.is_enabled){
        this.dial_group_codes.push({id:dial_group.code, value:dial_group.name});
      }
    });
    this.state = {
      schedule_date: new Date(),  //日付表示
      timezone: 0,
      group_code:0,
      schedule_data:[],
      selected_numbers:[],
      isOpenPreviewModal: false,
      print_data:[],
      all_check:0,
    }
  }
  
  async UNSAFE_componentWillMount(){
    await this.getSearchResult();
  }
  
  getSearchResult = async () => {
    let path = "/app/api/v2/dial/medicine_information/get_schedule_data_by_collection_list";
    let post_data = {
      schedule_date:formatDateLine(this.state.schedule_date),
      time_zone:this.state.timezone,
      group:this.state.group_code,
    };
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        this.setState({
          schedule_data:res,
          selected_numbers:[],
        });
      })
      .catch(() => {
      
      })
  };
  
  openPreviewModal = () => {
    if(this.state.selected_numbers.length === 0){
      return;
    }
    let print_data = [];
    let time_zone_name = "";
    let group_name = "";
    this.state.schedule_data.map(item=>{
      if(this.state.selected_numbers.includes(item.schedule_number)){
        print_data.push(item);
      }
    });
    this.time_zone_list.map(item=>{
      if(item.id == this.state.timezone){
        time_zone_name = item.value;
      }
    });
    this.dial_group_codes.map(item=>{
      if(item.id == this.state.group_code){
        group_name = item.value;
      }
    });
    this.setState({
      isOpenPreviewModal: true,
      print_data,
      time_zone_name,
      group_name,
    });
  };
  
  closeModal = () => {
    this.setState({
      isOpenPreviewModal: false,
    });
  };
  
  selectTimezone = (e) => {
    this.setState({
      timezone: parseInt(e.target.value),
    }, () => {
      this.getSearchResult();
    })
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
  
  selectToday=()=>{
    this.setState({ schedule_date: new Date()}, () => {
      this.getSearchResult();
    })
  };
  
  getSelectGroup = e => {
    this.setState({
      group_code: parseInt(e.target.id),
    }, ()=>{
      this.getSearchResult();
    })
  };
  
  selectScheduleNumber =(name, number)=>{
    if(name == "all_check"){
      let selected_numbers = [];
      if(number && this.state.schedule_data.length > 0){
        this.state.schedule_data.map(item=>{
          selected_numbers.push(item.schedule_number);
        });
      }
      this.setState({
        all_check:number,
        selected_numbers,
      });
    }
    if(name == "schedule_number"){
      let selected_numbers = this.state.selected_numbers;
      let index = selected_numbers.indexOf(number);
      if(index === -1){
        selected_numbers.push(number);
      } else {
        selected_numbers.splice(index, 1);
      }
      let all_check = 0;
      if(selected_numbers.length > 0 && selected_numbers.length === this.state.schedule_data.length){
        all_check = 1;
      }
      this.setState({
        selected_numbers,
        all_check,
      });
    }
  };
  
  render() {
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className="cur-date morning example-custom-input" onClick={onClick} style={{cursor:"pointer"}}>
        {formatJapanDate(value)}
      </div>
    );
    return (
      <>
        <Card>
          <div className="title">回収表</div>
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
              <div className={'select-today'} onClick={this.selectToday}>本日</div>
              <div className="gender">
                  <>
                    {this.time_zone_list.map((item)=>{
                      return (
                        <>
                          <RadioButton
                            id={`male_${item.id}`}
                            value={item.id}
                            label={item.value}
                            name="usage"
                            getUsage={this.selectTimezone}
                            checked={this.state.timezone === item.id ? true : false}
                          />
                        </>
                      );
                    })}
                  </>
              </div>
              <div className="select-group">
                <SelectorWithLabel
                  title="クループ"
                  options={this.dial_group_codes}
                  getSelect={this.getSelectGroup}
                  departmentEditCode={this.state.group_code}
                />
              </div>
            </div>
          </SearchPart>
          <Wrapper>
            <div className='table-area'>
              <table className="table table-bordered table-hover" id="code-table">
                <thead>
                <tr>
                  <th className="td-check">
                    <Checkbox
                      label=""
                      getRadio={this.selectScheduleNumber.bind(this)}
                      value={this.state.all_check}
                      name="all_check"
                    />
                  </th>
                  <th className="end-time">終了時間</th>
                  <th className="patient-name">患者氏名</th>
                  <th>メモ</th>
                </tr>
                </thead>
                <tbody>
                {this.state.schedule_data.length > 0 && (
                  this.state.schedule_data.map((item) => {
                    return (
                      <>
                        <tr>
                          <td className="td-check">
                            <Checkbox
                              label=""
                              getRadio={this.selectScheduleNumber.bind(this)}
                              value={this.state.selected_numbers.includes(item.schedule_number)}
                              number={item.schedule_number}
                              name="schedule_number"
                            />
                          </td>
                          <td className="end-time text-left">{item.end_time}</td>
                          <td className="patient-name text-left">{item.patient_name}</td>
                          <td> </td>
                        </tr>
                      </>)
                  })
                )}
                </tbody>
              </table>
            </div>
            <div className="footer-buttons">
              <Button className={this.state.selected_numbers.length > 0 ? "red-btn" : "disable-btn"} onClick={this.openPreviewModal}>帳票プレビュー</Button>
            </div>
          </Wrapper>
          {this.state.isOpenPreviewModal!== false && (
            <CollectionListPrintPreview
              closeModal={this.closeModal}
              schedule_data={this.state.print_data}
              group_name={this.state.group_name}
              timezone_name={this.state.time_zone_name}
              schedule_date={formatDateLine(this.state.schedule_date)}
            />
          )}
        </Card>
      </>
    )
  }
}

export default PatientGroup
