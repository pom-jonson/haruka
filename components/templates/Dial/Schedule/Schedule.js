import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import RadioButton from "~/components/molecules/RadioInlineButton";
import DialSideBar from "~/components/templates/Dial/DialSideBar";
import DatePicker, { registerLocale } from "react-datepicker";
import axios from "axios";
import {
  getPrevMonthByJapanFormat,
  getNextMonthByJapanFormat,
  formatJapanMonth,
  formatDateLine,
} from "~/helpers/date";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
// import ReadStatusModal from "~/components/templates/Dial/modals/ReadStatusModal";

import Dialysis from "./Dialysis";
import Prescription from "./Prescription";
import DialysisPrescription from "./DialysisPrescription";
import Injection from "./Injection";
import Inspection from "./Inspection";
import ManageMoney from "./ManageMoney";
import * as sessApi from "~/helpers/cacheSession-utils";
import Button from "~/components/atoms/Button";
import {makeList_codeName, compareNameKana, setDateColorClassName} from "~/helpers/dialConstants";
import Spinner from "react-bootstrap/Spinner";
import {getTimeZoneList} from "~/components/templates/Dial/DialMethods/getSystemTimeZone";

const SpinnerWrapper = styled.div`
  height: 200px;
  width:100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  position: fixed;
  top: 0px;
  width: calc(100% - 390px);
  left: 200px;
  margin: 0px;
  height: 100vh;
  float: left;
  background-color: ${surface};
  padding: 1.25rem;  
  .year_month,
  .patient_numbers {
    font-size: 1.25rem;
  }
  .flex {
    display: flex;
  }
  .arrow {
    cursor: pointer;
    font-size: 1.25rem;
  }
  .prev-month {
    padding-right: 0.3rem;
  }
  .next-month {
    padding-left: 0.3rem;
  }
  .title {
    margin-left: 0px;
    font-size: 2rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;
  }
  .other-pattern {
    position: absolute;
    right: 1.25rem;
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
    .disable-button {
      background: rgb(101, 114, 117);
      cursor: auto;
    }
    .schedule-button {
      margin-right: 0.5rem;
    }
  }

  .today-th{    
    border-right:2px solid red;
    border-left:2px solid red;
    border-top:2px solid red;
  }
  .today-td{    
    border-left:2px solid red;
    border-right:2px solid red;
  }
  .today-last-row-td{
    border-bottom:2px solid red;
  }
`;
const SearchPart = styled.div`
  display: flex;
  width: 100%;
  padding-top: 0.625rem;
  height: 3rem;
  float: left;
  .list-title {
    margin-top: 1.25rem;
    font-size: 1rem;
    width: 20%;
  }
  .search-box {
    width: 100%;
    display: flex;
  }
  .schedule_kind {
    display: flex;
    font-size: 0.9rem;
    margin-left: 1rem;
    .radio-btn {
      margin-left: 0.2rem;
    }
    .radio-btn label {
      font-size: 1.1rem;
      font-weight: bold;
      width: max-content;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      border: solid 1px rgb(206, 212, 218);
      border-radius: 0.25rem;
      margin: 0 0.3rem;
    }
  }

  .label-title {
    width: 3.4rem;
    text-align: right;
    margin-right: 0.625rem;
    line-height: 1.875rem;
  }
  .pullbox-select {
    font-size: 0.9rem;
    max-width: 9rem;
    height: 1.875rem;
    padding-right:1.5rem;
    width:auto;
  }
  .selectbox-area {
    margin-right: 0.625rem;
  }
  .top_right_area {
    position: absolute;
    right: 1.375rem;
    .label-title {
      font-size: 0.9rem;
      width: auto;
      margin-left:0rem;
      margin-right:0.5rem;
      padding-top:0.2rem;
    }
  }
`;

const Wrapper = styled.div`
  // width: 100%;
  // position:relative;
  // display: block;
  // justify-content: space-between;
`;
const display_order = [
  // { id: 0, value: "", field_name: "" },
  { id: 1, value: "ベッドNo", field_name: "bed_no" },
  { id: 2, value: "患者ID", field_name: "patient_number" },
  { id: 3, value: "カナ氏名", field_name: "name_kana" },  
];

const week_days = ["日", "月", "火", "水", "木", "金", "土"];

class Schedule extends Component {
  constructor(props) {
    super(props);
    let list_schedule = [];
    let list_date_week = [];
    let schedule_date = sessApi.getObjectValue("dial_schedule_table","schedule_date");    
    this.request_count = 0;    
    let prev_page = sessApi.getObjectValue("dial_schedule_table", "open_tab");
    let schedule_type = 0;
    let code_master = sessApi.getObjectValue("dial_common_master","code_master");
    this.display_group = makeList_codeName(code_master["グループ"], 1);

    this.api_delay = 1000;

    if (prev_page !== undefined && prev_page != null) {
      switch (prev_page) {
        case "dial":
          schedule_type = 0;
          break;
        case "medicine":
          schedule_type = 1;
          break;
        case "dialPrescription":
          schedule_type = 2;
          break;
        case "injection":
          schedule_type = 3;
          break;
        case "inspection":
          schedule_type = 4;
          break;
        case "admin_fee":
          schedule_type = 5;
          break;
        default:
          schedule_type = 0;
          break;
      }
    }
    let search_month =
      schedule_date != undefined ? new Date(schedule_date) : new Date();

    this.time_zone_list = [{id:-1, value:''},  {id:0, value:'全て'}]
    var time_zone_list = getTimeZoneList();
    if (time_zone_list != undefined && time_zone_list != null && time_zone_list.length > 0){
      time_zone_list.map(item => {
        this.time_zone_list.push({id:item.id, value:item.value})
      })
    }
    this.state = {
      search_month,
      list_date_week,
      list_schedule,
      list_matrix: {},
      list_by_date: {},
      patient_list: {},
      patients_in_month: {},
      schedule_type,
      schGroup: 0,
      schOrder: 1,      
      order_field: "bed_no",
      scroll_flag: false,
      is_loaded : false,
      time_zone:-1,
      complete_message: '読み込み中',
    };
  }

  getPeriod = (search_month) => {
    this.setState({ list_date_week: [] });
    var year = search_month.getFullYear();
    var month = search_month.getMonth();
    var from_date = new Date(year, month, 1);
    var end_date = new Date(year, month + 1, 0);
    var days_month = [];
    for (var d = from_date; d <= end_date; d.setDate(d.getDate() + 1)) {
      var week_name = week_days[d.getDay()];
      days_month.push({
        day: d.getDate(),
        day_of_week: d.getDay(),
        week: week_name,
        date: formatDateLine(d),
      });
    }
    return days_month;
  };

  async componentDidMount() {
    var patientInfo = sessApi.getObjectValue("dial_setting", "patient");

    this.getSearchResult(this.state.search_month, this.state.schedule_type);
    sessApi.remove("dial_schedule_table");
    if (patientInfo != null) {
      setTimeout(() => {
        this.scrollToelement();
      }, 200);
    }
  }

  selectScheduleKind = (e) => {
    this.setState({schedule_type: e.target.value}, () => {
      this.getSearchResult(this.state.search_month, this.state.schedule_type);
    });
  };

  getSearchResult = async (search_month, type) => {
    this.setState({is_loaded:false})
    let list_date_week = this.getPeriod(search_month);
    var year = search_month.getFullYear();
    var month = search_month.getMonth();
    var from_date = formatDateLine(new Date(year, month, 1));
    var end_date = formatDateLine(new Date(year, month + 1, 0));
    let path = "";
    switch (parseInt(type)) {
      case 0:
        path = "/app/api/v2/dial/schedule/dial_schedule_search";
        break;
      case 1:
        path = "/app/api/v2/dial/schedule/prescription_sch_pattern_search";
        break;
      case 2:
        path = "/app/api/v2/dial/schedule/dial_prescription_search";
        break;
      case 3:
        path = "/app/api/v2/dial/schedule/injection_schedule_search";
        break;
      case 4:
        path = "/app/api/v2/dial/schedule/inspection_search";
        break;
      case 5:
        path = "/app/api/v2/dial/schedule/fee_schedule_search";
        break;
      default:
        path = "/app/api/v2/dial/schedule/dial_schedule_search";
        break;
    }
    this.request_count++;
    let post_data = {
      from_date: from_date,
      end_date: end_date,
      group: this.state.schGroup,
      order: this.state.order_field,
      time_zone: this.state.time_zone,
      from_source:'schedule_page',
      request_count: this.request_count,
    };
    await axios.post(path, { params: post_data }).then((res) => {      
      if (this.request_count == res.data.response_count){
        let data = res.data.data;
        if (data != undefined && data != null && data.length > 0){
          if ( parseInt(type) != 1 && parseInt(type) != 4) {
            this.formatData(data, type);
          } else {
            if (parseInt(type) == 4) {
              //検査スケジュール
              let patient_list = {};
              let list_matrix = {};
              var new_list_matrix = [];
              var cur_patient_id = '';
              var temp_element = {};
  
              data.map((item) => {
                patient_list[item.system_patient_id] = {
                  patient_name: item.patient_name,
                  patient_number: item.patient_number,
                  system_patient_id: item.system_patient_id,
                };
                if (list_matrix[item.system_patient_id] == undefined) {
                  list_matrix[item.system_patient_id] = {};
                }
                if (list_matrix[item.system_patient_id][item.schedule_date] == undefined) {
                  list_matrix[item.system_patient_id][item.schedule_date] = [];
                }
                list_matrix[item.system_patient_id][item.schedule_date].push(item);
  
                //new matrix for order by
                if (cur_patient_id != item.system_patient_id) {
                  if (Object.keys(temp_element).length > 0) {
                    var exist_index = new_list_matrix.map(item =>{
                      return item.patient_id
                    }).indexOf(cur_patient_id);          
                    if (exist_index == -1){
                      new_list_matrix.push(temp_element);
                    } else {
                      Object.keys(temp_element).map(schedule_date => {
                        new_list_matrix[exist_index][schedule_date] = temp_element[schedule_date];
                      })
                    }
                  }
                  cur_patient_id = item.system_patient_id;
                  temp_element = {patient_id:cur_patient_id};
                }
                if (temp_element[item.schedule_date] == undefined) temp_element[item.schedule_date] = [];
                temp_element[item.schedule_date].push(item);
                //-----------------------
              });
              if (Object.keys(temp_element).length > 0) {
                var exist_index = new_list_matrix.map(item =>{
                  return item.patient_id
                }).indexOf(cur_patient_id);          
                if (exist_index == -1){
                  new_list_matrix.push(temp_element);
                } else {
                  Object.keys(temp_element).map(schedule_date => {
                    new_list_matrix[exist_index][schedule_date] = temp_element[schedule_date];
                  })
                }
              }          
              this.setState({
                patient_list,
                list_matrix,
                is_loaded:true,
                new_list_matrix
              });
            } else if (parseInt(type) == 1) {
              this.setPrescriptionData(data);
            } 
          }
          this.setState({
            list_schedule: data,
            list_date_week,
            search_month,
            is_loaded:true,
          }, () => {
            setTimeout(() => {
              this.scrollToelement();
            }, 200);}
          );
        } else {
          this.setState({
            list_matrix: {},
            list_by_date: {},
            patient_list: {},
            patients_in_month: {},
            new_list_matrix:[],
            is_loaded:true,
          });
        }

        this.getHolidays(from_date, end_date);
        this.getAllPatients(from_date, end_date);
      }
    })
  };

  sleep = (milliseconds) => {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

  async getHolidays(from_date, end_date) {
    let path = "/app/api/v2/dial/schedule/get_holidays";
    let post_data = {
      start_date: from_date,
      end_date: end_date,
    };
    await axios.post(path, { params: post_data }).then((res) => {
      let data = res.data;
      this.setState({ holidays: data });
    });
  }

  async getAllPatients(from_date, end_date) {
    let path = "/app/api/v2/dial/patient/search_all_patients";
    let post_data = {
      start_date: from_date,
      end_date: end_date,
    };
    await axios.post(path, { params: post_data }).then((res) => {
      let data = res.data;
      if (data.length > 0) {
        var all_patients = {};
        data.map((item) => {
          all_patients[item.system_patient_id] = item;
        });
        this.setState({ all_patients });
      } else {
        this.setState({ all_patients: data });
      }
    });
  }

  formatData = (data, type) => {
    let list_matrix = {};
    var new_list_matrix = [];
    let patient_list = {};
    let list_by_date = {};
    var list_by_date_manage = {};
    var patients_in_month = {};
    
    var cur_patient_id = '';
    var temp_element = {};
    data.map((item) => {
      if (list_matrix[item.system_patient_id] == undefined) {
        list_matrix[item.system_patient_id] = {};
      }
      if (
        list_matrix[item.system_patient_id][item.schedule_date] == undefined
      ) {
        list_matrix[item.system_patient_id][item.schedule_date] = item;
      }
      //new matrix for order by----------------------------------
      if (cur_patient_id != item.system_patient_id) {
        if (Object.keys(temp_element).length > 0) {
          var exist_index = new_list_matrix.map(item =>{
            return item.patient_id
          }).indexOf(cur_patient_id);

          if (exist_index == -1){
            new_list_matrix.push(temp_element);
          } else {
            Object.keys(temp_element).map(schedule_date => {
              new_list_matrix[exist_index][schedule_date] = temp_element[schedule_date];
            })
          }
        }
        cur_patient_id = item.system_patient_id;
        temp_element = {patient_id:cur_patient_id};
      }
      if (temp_element[item.schedule_date] == undefined) temp_element[item.schedule_date] = item;
      //--------------------------------------------------------------------

      if (patient_list[item.system_patient_id] == undefined) {
        patient_list[item.system_patient_id] = {
          patient_name: item.patient_name,
          patient_number: item.patient_number,
          system_patient_id: item.system_patient_id,
        };
      }      
      if (list_by_date[item.schedule_date] == undefined) {
        list_by_date[item.schedule_date] = {};
      }
      if (list_by_date[item.schedule_date][item.system_patient_id] == undefined) {
        list_by_date[item.schedule_date][item.system_patient_id] = item;
      }

      //for only manage schedule
      if (list_by_date_manage[item.schedule_date] == undefined) {
        list_by_date_manage[item.schedule_date] = {};
      }
      if (
        list_by_date_manage[item.schedule_date][item.system_patient_id] ==
        undefined
      ) {
        list_by_date_manage[item.schedule_date][item.system_patient_id] = [];
        list_by_date_manage[item.schedule_date][item.system_patient_id].push(
          item
        );
      } else {
        list_by_date_manage[item.schedule_date][item.system_patient_id].push(
          item
        );
      }

      if (patients_in_month[item.system_patient_id] == undefined) {
        patients_in_month[item.system_patient_id] = item;
      }
    });

    if (Object.keys(temp_element).length > 0) {      
      var exist_index = new_list_matrix.map(item =>{
        return item.patient_id
      }).indexOf(cur_patient_id);
      if (exist_index == -1){
        new_list_matrix.push(temp_element);
      } else {
        Object.keys(temp_element).map(schedule_date => {
          new_list_matrix[exist_index][schedule_date] = temp_element[schedule_date];
        })
      }
    }    
    if (this.state.order_field == 'bed_no' && parseInt(type) == 0){
      new_list_matrix = this.sortByTodayBedNo(new_list_matrix);      
    }
    
    
    this.setState({
      list_matrix,
      list_by_date,
      patient_list,
      patients_in_month,
      list_by_date_manage,
      new_list_matrix,
    });
  };

  sortByTodayBedNo (matrix) {
    var today = formatDateLine(new Date());
    var temp;
    if (matrix == undefined || matrix == null || matrix.length == 0) return matrix;
    for(var i = 0;i < matrix.length - 1; i++){
      for (var j = i + 1; j < matrix.length; j++){
        if (matrix[i][today] == undefined && matrix[j][today] != undefined){
          temp = matrix[i];
          matrix[i] = matrix[j];
          matrix[j] = temp;
        }
        if (matrix[i][today] != undefined && matrix[j][today] != undefined){
          if (matrix[i][today].bed_name == undefined && matrix[j][today].bed_name != undefined){
            temp = matrix[i];
            matrix[i] = matrix[j];
            matrix[j] = temp;
          }
          if (matrix[i][today].bed_name != undefined && matrix[j][today].bed_name != undefined){
            if(matrix[i][today].bed_name > matrix[j][today].bed_name){
              temp = matrix[i];
              matrix[i] = matrix[j];
              matrix[j] = temp;
            }
            if(matrix[i][today].bed_name == matrix[j][today].bed_name){
              if (matrix[i][today].time_zone > matrix[j][today].time_zone){
                temp = matrix[i];
                matrix[i] = matrix[j];
                matrix[j] = temp;
              }
              if (matrix[i][today].time_zone == matrix[j][today].time_zone){
                if (compareNameKana(matrix[i][today].name_kana, matrix[j][today].name_kana) == 1){
                  temp = matrix[i];
                  matrix[i] = matrix[j];
                  matrix[j] = temp;
                }
              }
            }
          }
        }
      }
    }
    return matrix;
  }

  setPrescriptionData = (data) => {
    let sch_data = data;
    let list_matrix = {};
    let patient_list = {};
    let list_by_date = {};
    var patients_in_month = {};
    var new_list_matrix = [];
    var cur_patient_id = '';
    var temp_element = {};
    sch_data.map((item) => {
      if (list_matrix[item.system_patient_id] == undefined) {
        list_matrix[item.system_patient_id] = {};
      }
      if (
        list_matrix[item.system_patient_id][item.schedule_date] == undefined
      ) {
        list_matrix[item.system_patient_id][item.schedule_date] = [];
      }
      list_matrix[item.system_patient_id][item.schedule_date].push(item);      
      //new matrix for order by-----------------------------------
      if (cur_patient_id != item.system_patient_id) {
        if (Object.keys(temp_element).length > 0) {
          var exist_index = new_list_matrix.map(item =>{
            return item.patient_id
          }).indexOf(cur_patient_id);          
          if (exist_index == -1){
            new_list_matrix.push(temp_element);
          } else {
            Object.keys(temp_element).map(schedule_date => {
              new_list_matrix[exist_index][schedule_date] = temp_element[schedule_date];
            })
          }
        }
        cur_patient_id = item.system_patient_id;
        temp_element = {patient_id:cur_patient_id};
      }
      if (temp_element[item.schedule_date] == undefined) temp_element[item.schedule_date] = [];
      temp_element[item.schedule_date].push(item);
      //--------------------------------------------------------------

      if (patient_list[item.system_patient_id] == undefined) {
        patient_list[item.system_patient_id] = {
          patient_name: item.patient_name,
          patient_number: item.patient_number,
          system_patient_id: item.system_patient_id,
        };
      }
      if (list_by_date[item.schedule_date] == undefined) {
        list_by_date[item.schedule_date] = {};
      }
      if (list_by_date[item.schedule_date][item.system_patient_id] == undefined) {
        list_by_date[item.schedule_date][item.system_patient_id] = item;
      }
      if (patients_in_month[item.system_patient_id] == undefined) {
        patients_in_month[item.system_patient_id] = item;
      }
    });

    
    if (Object.keys(temp_element).length > 0) {
      var exist_index = new_list_matrix.map(item =>{
        return item.patient_id
      }).indexOf(cur_patient_id);          
      if (exist_index == -1){
        new_list_matrix.push(temp_element);
      } else {
        Object.keys(temp_element).map(schedule_date => {
          new_list_matrix[exist_index][schedule_date] = temp_element[schedule_date];
        })
      }
    }
    this.setState({
      list_matrix,
      list_by_date,
      patient_list,
      patients_in_month,
      new_list_matrix
    });
  };

  PrevMonth = () => {
    this.setState({ list_date_week: [] }, () => {
      let now_month = this.state.search_month;
      let cur_month = getPrevMonthByJapanFormat(now_month);
      this.setState({ search_month: cur_month }, () => {
        this.getSearchResult(this.state.search_month, this.state.schedule_type);
      });
    });
  };

  NextMonth = () => {
    this.setState({ list_date_week: [] }, () => {
      let now_month = this.state.search_month;
      let cur_month = getNextMonthByJapanFormat(now_month);
      this.setState({ search_month: cur_month }, () => {
        this.getSearchResult(this.state.search_month, this.state.schedule_type);
      });
    });
  };

  getSearchMonth = (value) => {
    this.setState(
      {
        search_month: value,
        list_date_week: [],
      },
      () => {
        this.getSearchResult(this.state.search_month, this.state.schedule_type);
      }
    );
  };

  getGroupSelect = (e) => {
    this.setState({ schGroup: parseInt(e.target.id) }, () => {
      this.getSearchResult(this.state.search_month, this.state.schedule_type);
    });
  };

  getTimeZoneSelect = (e) => {
    this.setState({ time_zone: parseInt(e.target.id) }, () => {
      this.getSearchResult(this.state.search_month, this.state.schedule_type);
    });
  };

  getOrderSelect = (e) => {
    //表示順
    this.setState(
      {
        schOrder: parseInt(e.target.id),
        order_field: display_order[e.target.id - 1].field_name,
      },
      () => {
        this.getSearchResult(this.state.search_month, this.state.schedule_type);
      }
    );
  };
  selectPatient = (patient_info, scroll_flag = false) => {
    this.setState(
      {
        patientInfo: patient_info,
      },
      () => {
        if (scroll_flag) {
          this.scrollToelement();
        }
      }
    );
  };
  scrollToelement = () => {
    let els = document.getElementsByClassName("selected_tr")[0];
    let pa = document.getElementsByClassName("table-body")[0];
    if (els != undefined && pa != undefined) {
      let elHight = els.offsetHeight;
      let elTop = els.offsetTop;
      let paHeight = pa.offsetHeight;
      let scrollTop = elTop - (paHeight - elHight) / 2;
      pa.scrollTop = scrollTop - 100;
    }
  };
  goOtherPage(go_url) {
    this.props.history.replace(go_url);
  }

  render() {
    let { list_date_week, list_schedule, patient_list } = this.state;
    const ExampleCustomInput = ({ value, onClick }) => (
      <div
        className="cur-date arrow morning example-custom-input"
        onClick={onClick}
      >
        {formatJapanMonth(value)}
      </div>
    );
    return (
      <>
        <DialSideBar
          onGoto={this.selectPatient}
          history = {this.props.history} 
        />
        <Card>
          <div className="d-flex">
            <div className="title">スケジュール</div>
            <div className={"other-pattern"}>
              <Button className="disable-button">スケジュール</Button>
              <Button onClick={this.goOtherPage.bind(this,"/dial/others/patientPlanList")}>患者予定</Button>
              <Button onClick={this.goOtherPage.bind(this,"/dial/others/my_calendar")}>カレンダー</Button>
            </div>
          </div>
          <SearchPart>
            <div className="search-box">
              <div className="year_month flex">
                <div className="prev-month arrow" onClick={this.PrevMonth}>
                  {"< "}
                </div>
                <DatePicker
                  locale="ja"
                  selected={this.state.search_month}
                  onChange={this.getSearchMonth.bind(this)}
                  dateFormat="yyyy/MM/dd"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  dayClassName = {date => setDateColorClassName(date)}
                  customInput={<ExampleCustomInput />}
                />
                <div className="next-month arrow" onClick={this.NextMonth}>{" >"}</div>
              </div>
              <div className="schedule_kind">
                <RadioButton
                  id="dialysis"
                  value={0}
                  label="透析"
                  name="schedule_kind"
                  getUsage={this.selectScheduleKind}
                  checked={this.state.schedule_type == 0 ? true : false}
                />
                <RadioButton
                  id="injection"
                  value={3}
                  label="注射"
                  name="schedule_kind"
                  getUsage={this.selectScheduleKind}
                  checked={this.state.schedule_type == 3 ? true : false}
                />
                <RadioButton
                  id="prescription"
                  value={1}
                  label="処方"
                  name="schedule_kind"
                  getUsage={this.selectScheduleKind}
                  checked={this.state.schedule_type == 1 ? true : false}
                />
                <RadioButton
                  id="inspection"
                  value={4}
                  label="検査"
                  name="schedule_kind"
                  getUsage={this.selectScheduleKind}
                  checked={this.state.schedule_type == 4 ? true : false}
                />
                <RadioButton
                  id="dialysis_prescription"
                  value={2}
                  label="透析中処方"
                  name="schedule_kind"
                  getUsage={this.selectScheduleKind}
                  checked={this.state.schedule_type == 2 ? true : false}
                />
                <RadioButton
                  id="manageMoney"
                  value={5}
                  label="管理料"
                  name="schedule_kind"
                  getUsage={this.selectScheduleKind}
                  checked={this.state.schedule_type == 5 ? true : false}
                />
              </div>
              <div className="top_right_area flex">
                <div className="selectbox-area">
                  <SelectorWithLabel
                    options={this.display_group}
                    title="グループ"
                    getSelect={this.getGroupSelect}
                    departmentEditCode={this.state.schGroup}
                  />
                </div>
                <div className="selectbox-area">
                  <SelectorWithLabel
                    options={this.time_zone_list}
                    title="時間帯"
                    getSelect={this.getTimeZoneSelect}
                    departmentEditCode={this.state.time_zone}
                  />
                </div>
                <div className = "selectbox-area">
                  <SelectorWithLabel
                    options={display_order}
                    title="表示順"
                    getSelect={this.getOrderSelect}
                    departmentEditCode={this.state.schOrder}
                  />
                </div>
                <div className="patient_numbers">
                  {Object.keys(patient_list).length}名
                </div>
              </div>
            </div>
          </SearchPart>
          <Wrapper>
            {this.state.is_loaded == false && (
              <>
                {/* <ReadStatusModal message={this.state.complete_message} /> */}
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              </>
            )}
            {this.state.is_loaded == true && (
              <>
              {this.state.schedule_type == 0 &&
                list_schedule != undefined &&
                list_date_week.length > 0 && (
                  <Dialysis
                    list_date_week={this.state.list_date_week}
                    list_schedule={this.state.list_schedule}
                    list_matrix={this.state.list_matrix}
                    list_by_date={this.state.list_by_date}
                    patient_list={this.state.patient_list}
                    getSearchResult={this.getSearchResult}
                    history={this.props.history}
                    holidays={this.state.holidays}
                    patientInfo={this.state.patientInfo}
                    ref={(ref) => (this.tableRef = ref)}
                    new_list_matrix = {this.state.new_list_matrix}
                  />
                )}
              {this.state.schedule_type == 1 &&
                list_schedule != undefined &&
                list_date_week.length > 0 && (
                  <Prescription
                    list_date_week={this.state.list_date_week}
                    list_schedule={this.state.list_schedule}
                    list_matrix={this.state.list_matrix}
                    list_by_date={this.state.list_by_date}
                    patient_list={this.state.patient_list}
                    getSearchResult={this.getSearchResult}
                    holidays={this.state.holidays}
                    patients_in_month={this.state.patients_in_month}
                    all_patients={this.state.all_patients}
                    patientInfo={this.state.patientInfo}
                    // ref = {ref => this.tableRef = ref}
                    new_list_matrix = {this.state.new_list_matrix}
                  />
                )}
              {this.state.schedule_type == 2 &&
                list_schedule != undefined &&
                list_date_week.length > 0 && (
                  <DialysisPrescription
                    list_date_week={this.state.list_date_week}
                    list_schedule={this.state.list_schedule}
                    list_matrix={this.state.list_matrix}
                    list_by_date={this.state.list_by_date}
                    patient_list={this.state.patient_list}
                    getSearchResult={this.getSearchResult}
                    holidays={this.state.holidays}
                    patientInfo={this.state.patientInfo}
                    // ref = {ref => this.tableRef = ref}
                    new_list_matrix = {this.state.new_list_matrix}
                  />
                )}
              {this.state.schedule_type == 3 &&
                list_schedule != undefined &&
                list_date_week.length > 0 && (
                  <Injection
                    list_date_week={this.state.list_date_week}
                    list_schedule={this.state.list_schedule}
                    list_matrix={this.state.list_matrix}
                    list_by_date={this.state.list_by_date}
                    patient_list={this.state.patient_list}
                    getSearchResult={this.getSearchResult}
                    holidays={this.state.holidays}
                    patientInfo={this.state.patientInfo}
                    // ref = {ref => this.tableRef = ref}
                    new_list_matrix = {this.state.new_list_matrix}
                  />
                )}
              {this.state.schedule_type == 4 &&
                list_schedule != undefined &&
                list_date_week.length > 0 && (
                  <Inspection
                    list_date_week={this.state.list_date_week}
                    list_schedule={this.state.list_schedule}
                    list_matrix={this.state.list_matrix}
                    list_by_date={this.state.list_by_date}
                    patient_list={this.state.patient_list}
                    getSearchResult={this.getSearchResult}
                    holidays={this.state.holidays}
                    patientInfo={this.state.patientInfo}
                    // ref = {ref => this.tableRef = ref}
                    new_list_matrix = {this.state.new_list_matrix}
                  />
                )}
                {this.state.schedule_type == 5 &&
                  list_schedule != undefined &&
                  list_date_week.length > 0 && (
                  <ManageMoney
                    list_date_week={this.state.list_date_week}
                    list_schedule={this.state.list_schedule}
                    list_matrix={this.state.list_matrix}
                    list_by_date={this.state.list_by_date}
                    patient_list={this.state.patient_list}
                    getSearchResult={this.getSearchResult}
                    holidays={this.state.holidays}
                    patientInfo={this.state.patientInfo}
                    all_patients={this.state.all_patients}
                    list_by_date_manage={this.state.list_by_date_manage}
                    // ref = {ref => this.tableRef = ref}
                    new_list_matrix = {this.state.new_list_matrix}
                  />
                )}
              </>
            )}            
          </Wrapper>
        </Card>
      </>
    );
  }
}

Schedule.propTypes = {
  history: PropTypes.object,
};

export default Schedule;
