import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import ja from "date-fns/locale/ja";
import DatePicker, { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import {
  formatDateLine,
  formatTime,
  formatDateIE,
  getNextDayByJapanFormat, getNextMonthByJapanFormat,
  getPrevDayByJapanFormat,
  getPrevMonthByJapanFormat, getWeekName
} from "~/helpers/date";
import axios from "axios/index";
import ChangeMealModal from "./ChangeMealModal"
import FoodGroupModal from "./FoodGroupModal"
import OutReturnHospitalModal from "./OutReturnHospitalModal"
import renderHTML from 'react-render-html';
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import * as karteApi from "~/helpers/cacheKarte-utils";
import {CACHE_LOCALNAMES} from "~/helpers/constants";
import Spinner from "react-bootstrap/Spinner";
import Button from "~/components/atoms/Button";
import HospitalApplicationOrder from "~/components/templates/Patient/Modals/Hospital/HospitalApplicationOrder";
import ChangeResponsibilityModal from "./ChangeResponsibilityModal"
import DischargePermitOrder from "~/components/templates/Patient/Modals/Hospital/DischargePermitOrder";
import KarteDischargeHospitalDecision from "~/components/templates/Ward/KarteDischargeHospitalDecision";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 100%;
  display: flex;
`;

const Wrapper = styled.div`
    overflow-y: auto;
    height: 100%;
    .flex {
        display: flex;
    }
    .modal-btn {
        height: 2.3rem;
        line-height: 2.3rem;
        margin-right: 10px;
        padding-left: 0.65rem;
    }
    .move-calendar-btn{
      // margin-top: -0.1rem;
    }
    // .disable-btn {
    //   background: #eee;
    //   width: 120px;
    //   color: #999;
    //   text-align: center;
    //   border-right: 2px solid #666;
    //   border-bottom: 2px solid #666;
    //   line-height: 2.3rem;
    //   height: 2.3rem;
    //   cursor: pointer;
    //   margin-right: 10px;
    //   text-decoration: none;
    //   a, a:hover, a:link, a:active {
    //     text-decoration: none !important;
    //   }
    // }    
    .spinner-loading{      
      height: 30rem;
    }
    // .disable-btn, .disable-btn:hover, .disable-btn:link, .disable-btn:active {
    //   text-decoration: none !important;
    // }
    .patient-info-area {
      margin-bottom: 0.5rem;
    }
    .date-time-hospitalization {
      margin-bottom: 0.5rem;
      button{
        width: 2.3rem;
      }
      .select-date {
        .react-datepicker-wrapper {
            margin-left: -75px;
            margin-top: 15px;
            input {
                display: none;
            }
        }
      }
      .view-date {
        border: 1px solid #aaa;
        width: 220px;
        text-align: center;
        height: 2.3rem;
        line-height: 2.3rem;
      }
      .date-label {
        margin-bottom: 0;
        line-height: 2.3rem;
        margin-left: 10px;
        margin-right: 10px;
        height: 2.3rem;
        border: 1px solid white;
      }
    }
    .btn-area {
        button {
            width: 120px;
        }
        .btn-link {
            width: calc(100% - 260px);
        }
    }
    .calendar-area {
        margin-top: 10px;
        width: 100%;
        height: calc(100% - 130px);
        overflow-y: auto;
        table {
            margin-bottom: 0;
        }
        td {                
            height: 2rem;    
            font-size: 1rem;
            text-align: left;
            vertical-align: top;
            padding: 0.25rem;
        }
        .height-big{
            height: 50px;
        }

        th {
            text-align: center;
            padding: 0.5rem; 
            font-size: 1rem;
            font-weight: normal;
        }
        tr{
            .td-meal:hover{                
                cursor: pointer;
                background: rgb(217, 216, 177) !important;
            }    
            .td-selected{
                background: rgb(217, 216, 177) !important;
            }        
        }
    }
`;

const ContextMenuUl = styled.div`
  .cell-context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #FFFFCC;
    border-radius: 4px;
    border: solid 2px #FFCC9A;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 0px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 0px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
    max-width: 396px;
    max-height: 350px;
    overflow-y: auto;
  }
  .cell-context-menu li div{
    padding-left: 5px;
    padding-right: 5px;
  }
  
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    -webkit-transition: all 0.3s;

    div {
      padding: 5px 12px;
    }
  }
  .tooltip-title {
    border-bottom: solid 1px #FFCC9A;
    margin: 0 9px;
    padding: 3px;
  }

`;

// const Tooltip = ({visible,x,y,tooltip_content}) => {
//   if (visible) {
//     return (
//       <ContextMenuUl>
//         <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
//           {tooltip_content != "" && (
//             <li>
//               <div className={'tooltip-content'}>tooltip_content</div>              
//             </li>
//           )}
//         </ul>
//       </ContextMenuUl>
//     );
//   } else {
//     return null;
//   }
// };

class MoveMealCalendar extends Component {
  constructor(props) {
    super(props);
    this.holidays_color = JSON.parse(window.sessionStorage.getItem("init_status")).dial_schedule_date_color;
    let hospitalization_info = {
      is_carried_out_of_hospitalization:0,
      date_and_time_of_hospitalization:null,
    };
    this.state = {
      search_date: new Date(),
      from_date: null,
      end_date: null,
      moveMealData: {},
      selected_date: null,
      selected_meal_type: null,
      alert_messages: "",
      hospitalization_date: null,
      cache_index: null,
      is_loaded: false,
      openHospitalApplication:false,
      openDischargePermitOrder:false,
      openOutHospitalization:false,
      hospitalization_info,
    };
    this.focus = true;

    // ■YJ747 移動食事カレンダーから入院決定すると食事が表示されないので混乱する点の修正
    this.cache_decision = this.getCacheDecision();

    this.meal_edit_cache = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.MEAL_EDIT);
    this.meal_group_edit_cache = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.MEAL_GROUP_EDIT);
  }

  async componentDidMount() {
    let cell_obj = document.getElementsByClassName("cell-context-menu")[0];
    if(cell_obj !== undefined && cell_obj != null){
      cell_obj.style['display'] = "none";
    }
    await this.getMoveMealData();
    // await this.getHolidays();
  }

  // getMoveMealPermit = async () => {
  //     await apiClient.post("/app/api/v2/move_meal/get_permit").then(res=>{
  //         if (Object.keys(res).length > 0) {

  //         } else {
  //             this.setState({
  //               alert_messages: "入院患者を選択してください。",
  //             });
  //             return;
  //         }
  //     });
  // }

  getDateFormat = (_date) => {
    let now_year = _date.getFullYear();
    let now_month = _date.getMonth()+1;
    let date_number = _date.getDate();

    let tmp_month = now_month < 10 ? '0' + now_month : now_month;
    let tmp_date = (date_number) < 10 ? '0' + (date_number) : (date_number);
    let tmp_cur_date = now_year + '-' + tmp_month + '-' + tmp_date;
    let tmp_new_date = new Date(tmp_cur_date);

    return tmp_new_date;
  }

  getBeforeAndAfterDate = (_date, nDays) => {
    return new Date(_date.setDate(_date.getDate() + parseInt(nDays)));
  }

  getHospitalizationDate = (_date) => {
    let dt = _date;
    var y = dt.getFullYear();
    var m = ("00" + (dt.getMonth() + 1)).slice(-2);
    var d = ("00" + dt.getDate()).slice(-2);
    var weekday = new Array(7);
    weekday[0] = "日";
    weekday[1] = "月";
    weekday[2] = "火";
    weekday[3] = "水";
    weekday[4] = "木";
    weekday[5] = "金";
    weekday[6] = "土";

    var result = y  + '年' + m + '月' + d + '日' + '(' + weekday[dt.getDay()] + ')';
    return result;
  }

  getFormatTime = (_date) => {
    let dt = _date;
    var h = ("00" + dt.getHours()).slice(-2);
    var min = ("00" + dt.getMinutes()).slice(-2);
    var result = h + ":" + min ;
    return result;
  }

  // get meal_group_edit period from cache
  getMealGroupPeriodInfo = (_cache) => {
    let result = [];
    if (_cache == undefined || _cache == null || Object.keys(_cache).length < 1) return result;

    Object.keys(_cache).map(key=>{
      let temp = {};
      temp.start_date = _cache[key].start_date;
      temp.start_time_classification = _cache[key].start_time_classification;
      temp.start_date_to = _cache[key].start_date_to;
      temp.start_time_classification_to = _cache[key].start_time_classification_to;
      result.push(temp);
    });

    return result;
  }

  getMoveMealData = async () => {
    let search_date = this.state.search_date;
    let from_date = this.state.from_date;
    let end_date = this.state.end_date;
    let hospitalization_date = this.state.hospitalization_date;

    if (search_date != null) {
      let tmp_new_date = this.getDateFormat(search_date);
      from_date = this.getBeforeAndAfterDate(tmp_new_date, -1);
      end_date = this.getBeforeAndAfterDate(tmp_new_date, 11);
    }

    // get meal_group_edit array
    let cache_meal_group_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.MEAL_GROUP_EDIT);
    let meal_group_period_array = this.getMealGroupPeriodInfo(cache_meal_group_data);

    let path = "/app/api/v2/meal/get/move_meal_data";
    let post_data = {
      hospitalization_date: formatDateLine(search_date),
      patient_id: this.props.patientId,
      meal_group_period_array: meal_group_period_array
    };

    // has 入院日
    if (search_date != null && from_date != null && end_date != null) {
      post_data.from_date = formatDateLine(from_date);
      post_data.end_date = formatDateLine(end_date);
    }

    await axios.post(path, {params: post_data}).then((res)=>{
      if (Object.keys(res.data).length > 0) {
        if (res.data.no_hospitalization == 1) { 
          // YJ747 移動食事カレンダーから入院決定すると食事が表示されないので混乱する点の修正
          if (search_date == null) {
            search_date = new Date();
            let tmp_new_date = this.getDateFormat(search_date);
            from_date = this.getBeforeAndAfterDate(tmp_new_date, -1);
            end_date = this.getBeforeAndAfterDate(tmp_new_date, 11);
          }
          let _mealInfo = {};
          let _tmp = {};
          _tmp[1] = null;
          _mealInfo[formatDateLine(search_date)] = _tmp;
          let _state = {
            food_type_master: res.data.food_type_master,
            going_out:[],
            going_out_master:[],
            hos_number: null,
            hospitalization_detail:res.data.hospitalization_detail,
            hospitalization_doctor:{},
            hospitalization_info:{},
            meal_info:_mealInfo,
            staple_food_master:[],
            ward_master:[]
          };
          this.setState({
            search_date: search_date,
            is_loaded: true,
            from_date,
            end_date,
            moveMealData: _state,
            selected_date: null,
            selected_meal_type: null
          });          
        } else {          
          if (res.data.hospitalization_info != null && res.data.hospitalization_info != undefined) {
            if (res.data.hospitalization_info.date_and_time_of_hospitalization != null && res.data.hospitalization_info.date_and_time_of_hospitalization != "") {
              let str_date_arr = res.data.hospitalization_info.date_and_time_of_hospitalization.split(" ")[0];
              let str_time_arr = res.data.hospitalization_info.date_and_time_of_hospitalization.split(" ")[1];
              let str_date = this.getHospitalizationDate(new Date(str_date_arr.split("-")[0]+"/"+str_date_arr.split("-")[1]+"/"+str_date_arr.split("-")[2]));
              hospitalization_date = str_date + str_time_arr.split(":")[0] + "時" + str_time_arr.split(":")[1] + "分";
              if (search_date == null) {
                search_date = formatDateIE(res.data.hospitalization_info.date_and_time_of_hospitalization);
              }

              let _date = this.getDateFormat(search_date);

              if (from_date == null) {
                from_date = this.getBeforeAndAfterDate(_date, -1);
              }
              if (end_date == null) {
                end_date = this.getBeforeAndAfterDate(_date, 11);
              }
            }
            // if api's meal info is null and cache have meal group data, exchange null to cache meal group info
            if (res.data.meal_info != undefined && res.data.meal_info != null && Object.keys(res.data.meal_info).length > 0) {                        
              let check_status = this.existInMealGroupEdit(formatDateLine(from_date), 1);
              if (check_status.status == true) {
                res.data.meal_info[formatDateLine(from_date)][1] = check_status.meal_info;
              }
              /*Object.keys(res.data.meal_info).map(_date=>{
                Object.keys(_date).map(_classification=>{

                  // check _date includes cache of meal group edit
                  // let check_status = this.existInMealGroupEdit(_date, _classification);
                  console.log("_classification 88888888888888888", _classification);
                  console.log("from_date 88888888888888888", from_date);
                  let check_status = this.existInMealGroupEdit(formatDateLine(from_date), 1);
                  console.log("check_status", check_status);
                  if (check_status.status == true) {
                    res.data.meal_info[_date][_classification] = check_status.meal_info;
                  }

                  // check _date includes cache of meal edit
                  // check_status = false;
                  // check_status = this.existInMealGroupEdit(_date, _classification);
                  // if (check_status.status == true) {
                  //   res.data[_date][_classification] = check_status.meal_info;
                  // }
                })
              });*/
            }
          }
          this.setState({
            search_date: search_date,
            moveMealData:res.data,
            from_date,
            end_date,
            hospitalization_date,
            is_loaded: true,
            department_id:res.department_id,
            department_name:res.department_name,
            hos_number:res.hos_number,
            hospitalization_info:res.data.hospitalization_info,
            selected_date: null,
            selected_meal_type: null
          });
        }
      } else {
        if (search_date == null) {
          search_date = new Date();
          let tmp_new_date = this.getDateFormat(search_date);
          from_date = this.getBeforeAndAfterDate(tmp_new_date, -1);
          end_date = this.getBeforeAndAfterDate(tmp_new_date, 11);
        }
        let _mealInfo = {};
        let _tmp = {};
        _tmp[1] = null;
        _mealInfo[formatDateLine(search_date)] = _tmp;
        let _state = {
          food_type_master: [],
          going_out:[],
          going_out_master:[],
          hos_number: null,
          hospitalization_detail:{},
          hospitalization_doctor:{},
          hospitalization_info:{},
          meal_info:_mealInfo,
          staple_food_master:[],
          ward_master:[]
        };
        this.setState({
          search_date: search_date,
          is_loaded: true,
          from_date,
          end_date,
          moveMealData: _state,
          selected_date: null,
          selected_meal_type: null
        });
      }
    })
  }

  toggle = () => {
    this.component.setOpen(this.focus);
  };

  getSearchDate= value => {
    this.setState({
      search_date: value,
      is_loaded: false
    },()=>{
      this.getMoveMealData();
    });
  };

  moveDay = (type) => {
    let now_day = this.state.search_date;
    if(now_day === ''){
      now_day = new Date();
    }
    let cur_day = type === 'next' ? getNextDayByJapanFormat(now_day) : getPrevDayByJapanFormat(now_day);
    this.setState({
      search_date: cur_day,
      is_loaded: false,
    },()=>{
      this.getMoveMealData();
    });
  };

  moveMonth = (type) => {
    let now_month = this.state.search_date;
    let cur_month = type === 'next' ? getNextMonthByJapanFormat(now_month) : getPrevMonthByJapanFormat(now_month);
    this.setState({
      search_date: cur_month,
      is_loaded: false,
    },()=>{
      this.getMoveMealData();
    });
  };

  async getHolidays(){
    let now_date = this.state.search_date;
    let year = now_date.getFullYear();
    let month = now_date.getMonth();
    let from_date = formatDateLine(new Date(year, month, 1));
    let end_date = formatDateLine(new Date(year, month+1, 0));
    let path = "/app/api/v2/dial/schedule/get_holidays";
    let post_data = {
      start_date: from_date,
      end_date:end_date,
    };
    await axios.post(path, {params: post_data}).then((res)=>{
      this.setState({holidays:Object.keys(res.data)});
    })
  }

  setBackcolor = (date, day_of_week) => {
    let holidays = this.state.holidays;
    if (holidays == undefined || holidays == null || holidays.length == 0 || !holidays.includes(date)){
      if (this.holidays_color.days[day_of_week] == undefined || this.holidays_color.days[day_of_week] == null){
        return this.holidays_color.default.schedule_date_cell_back;
      } else {
        return this.holidays_color.days[day_of_week].schedule_date_cell_back;
      }
    } else {
      return this.holidays_color.holiday.schedule_date_cell_back;
    }
  };

  setFontcolor = (date, day_of_week) => {
    let holidays = this.state.holidays;
    if (holidays == undefined || holidays == null || holidays.length > 0 || !holidays.includes(date)){
      if (this.holidays_color.days[day_of_week] == undefined || this.holidays_color.days[day_of_week] == null){
        return this.holidays_color.default.schedule_date_cell_font;
      } else {
        return this.holidays_color.days[day_of_week].schedule_date_cell_font;
      }
    } else {
      return this.holidays_color.holiday.schedule_date_cell_font;
    }
  };

  createTable = (type, index, category, meal_type) => {
    let now_date = this.state.search_date;

    if (now_date == null) return;

    let now_year = now_date.getFullYear();
    let now_month = now_date.getMonth()+1;
    let date_number = now_date.getDate();

    let tmp_month = now_month < 10 ? '0' + now_month : now_month;
    let tmp_date = (date_number) < 10 ? '0' + (date_number) : (date_number);
    let tmp_cur_date = now_year + '-' + tmp_month + '-' + tmp_date;
    let tmp_new_date = new Date(tmp_cur_date);

    let yesterday = new Date(tmp_new_date.setDate(tmp_new_date.getDate()-1));
    let table_menu = [];

    if(type === 'thead' || type === 'tbody'){
      let while_condition = 0;
      do {
        now_year = yesterday.getFullYear();
        now_month = yesterday.getMonth()+1;
        date_number = yesterday.getDate();
        if(getWeekName(now_year, (now_month), (date_number)) === undefined){
          date_number = 1;
          if(now_month == 12){
            now_month = 1;
            now_year++;
          } else {
            now_month++;
          }
        }
        let month = now_month < 10 ? '0' + now_month : now_month;
        let date = (date_number) < 10 ? '0' + (date_number) : (date_number);
        let cur_date = now_year + '-' + month + '-' + date;
        if(type === 'thead'){
          let week = new Date(cur_date).getDay();
          table_menu.push(
            <th style={{background:this.setBackcolor(cur_date, week), color:this.setFontcolor(cur_date, week)}}>
              {now_month +'/'+(date_number)+'（'+getWeekName(now_year, now_month, (date_number))+'）'}
            </th>
          )
        }
        if(type === 'tbody') {
          switch (index){
            case 1:
              table_menu.push(<td style={{backgroundColor:"rgb(242, 192, 212)"}}>{renderHTML(this.getMoveInfo(category, cur_date))}</td>);
              break;
            case 2:
              table_menu.push(<td onClick={()=>this.handleClickMeal(cur_date, meal_type)} className={`td-meal height-big ${this.state.selected_date == cur_date && this.state.selected_meal_type == meal_type ? "td-selected" : ""}`} style={{backgroundColor:"rgb(255, 254, 208)"}}  onMouseOver={e=>this.editTooltip(e,category, cur_date)} onMouseOut={this.hideTooltip}>{renderHTML(this.getMealInfoByCategory(category, cur_date))}</td>);
              break;
            case 3:
              table_menu.push(<td style={{backgroundColor:"rgb(217, 251, 174)"}}>{renderHTML(' ')}</td>);
              break;
            case 4:
              table_menu.push(<td style={{backgroundColor:"rgb(202, 240, 247)"}}>{renderHTML(' ')}</td>);
              break;
          }
        }
        yesterday = new Date(yesterday.setDate(yesterday.getDate()+1));
        // date_number++;
        while_condition++;
      } while (while_condition < 12);
    }

    return table_menu;
  }

  getMoveInfo = (category, cur_date) => {
    let hos_info = this.state.moveMealData.hospitalization_info;
    let going_out_info = this.state.moveMealData.going_out;

    let result = [];

    let hos_in_date = null;
    let hos_out_date = null;
    let going_out_date = null;
    let going_out_return_date = null;

    // ○入院 or ○退院
    if (hos_info != null && hos_info != undefined) {
      if (hos_info.date_and_time_of_hospitalization != null &&
        hos_info.date_and_time_of_hospitalization != undefined &&
        cur_date == formatDateLine(hos_info.date_and_time_of_hospitalization)) {
        hos_in_date = formatTime(hos_info.date_and_time_of_hospitalization);
        result.push("○入院<br/>" + "(" + hos_in_date + ")");
      }

      if (hos_info.discharge_date != null &&
        hos_info.discharge_date != undefined &&
        cur_date == formatDateLine(hos_info.discharge_date)) {
        hos_out_date = formatTime(hos_info.discharge_date);
        result.push("○退院<br/>" + "(" + hos_out_date + ")");
      }

    }

    // ○外泊 or ○帰院
    if (going_out_info != null && going_out_info != undefined) {
      if (going_out_info.stop_serving_date != null &&
        going_out_info.stop_serving_date != undefined &&
        cur_date == formatDateLine(going_out_info.stop_serving_date)) {
        going_out_date = formatTime(going_out_info.stop_serving_date);
        result.push("○外泊<br/>" + "(" + going_out_date + ")");
      }
      if (going_out_info.start_date != null &&
        going_out_info.start_date != undefined &&
        cur_date == formatDateLine(going_out_info.start_date)) {
        going_out_return_date = formatTime(going_out_info.start_date);
        result.push("○帰院<br/>" + "(" + going_out_return_date + ")");
      }
    }

    let result_length = result.length;
    let nPos = category - 1;

    if (result_length > 0 && nPos <= result_length) {
      return result[nPos] == undefined || result[nPos] == null ? ' ' : result[nPos];
    } else {
      return ' ';
    }

    // if (result.length > 0 && ((category - 1) <= result.length) ) {
    //     return result[category - 1];
    // } else {
    //     return ' ';
    // }

  }

  // 食種マスタ.名称 from 食事テーブル.食種ID
  getFoodTypeName = (id, _type=null) => {
    let result = "";

    let food_type_master = this.state.moveMealData.food_type_master;
    if (_type == "is_decision") {
      food_type_master = this.state.food_type_master;
    }
    if (food_type_master != null && food_type_master != undefined && food_type_master.length > 0) {
      food_type_master.map(item=>{
        if (id == item.number) {
          result = item.name;
        }
      });
    }

    return result;
  }

  // 主食マスタ.名称 from 食事テーブル.主食ID
  getStapleFoodName = (id) => {
    let result = "";

    let staple_food_master = this.state.moveMealData.staple_food_master;
    if (staple_food_master != null && staple_food_master != undefined && staple_food_master.length > 0) {
      staple_food_master.map(item=>{
        if (id == item.number) {
          result = item.name;
        }
      });
    }

    return result;
  }

  getDateLine = (_date) => {
    let dt = _date;
    var y = dt.getFullYear();
    var m = ("00" + (dt.getMonth() + 1)).slice(-2);
    var d = ("00" + dt.getDate()).slice(-2);
    var result = y + '-' + m + '-' + d;
    return result;
  }

  getCacheDecision = () => {
    let result = null;
    // let cache_data = karteApi.getVal(this.props.patientId, key);
    let cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.IN_HOSPITAL_EDIT);
    if (cache_data != undefined && cache_data != null) {
      result = cache_data;
    }

    return result;
  }

  getCacheMealInfoByDateAndTimeClassification = (_date, _start_time_classification) => {    

    let result = {
      key: null,
      cache: null
    };
    // check meal_edit
    let cache_data = null;
    // cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.MEAL_EDIT);
    cache_data = this.meal_edit_cache;
    if (cache_data != null && cache_data != undefined && Object.keys(cache_data).length > 0) {
      Object.keys(cache_data).map(key=>{
        if (cache_data[key].start_date == _date && _start_time_classification == cache_data[key].start_time_classification) {
          result.key = key;
          result.cache = cache_data[key];
        }
      })
    }

    // check meal_group_edit
    cache_data = null;
    // cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.MEAL_GROUP_EDIT);
    cache_data = this.meal_group_edit_cache;
    if (cache_data != null && cache_data != undefined && Object.keys(cache_data).length > 0) {
      Object.keys(cache_data).map(key=>{
        if (cache_data[key].start_date == _date && _start_time_classification == cache_data[key].start_time_classification) {
          result.key = key;
          result.cache = cache_data[key];
        }
        if (cache_data[key].start_date_to == _date && _start_time_classification == cache_data[key].start_time_classification_to) {
          result.key = key;
          result.cache = cache_data[key];
        }
      })
    }

    return result;
  }

  isAfterDecision = (_cacheDecision, _curData, _categoryNum) => {
    let result = 0;
    let decision_start_date = new Date(_cacheDecision.start_date);
    let cur_date = new Date(_curData);
    if (decision_start_date.getTime() == cur_date.getTime()) {
      if (_cacheDecision.start_time_classification <= _categoryNum) {
        result = 1;
      } 
    } else if(cur_date.getTime() > decision_start_date.getTime()) {
      result = 1;
    }
    
    return result;
  }

  getMealInfoByCategory = (category, cur_date) => {
    let category_num = category == "morning" ? 1 : category == "noon" ? 2 : category == "evening" ? 3: 0;
    if(category_num == 0) return;

    let meal_info = null;
    // if (this.state.moveMealData != null &&
    //     this.state.moveMealData != undefined &&
    //     this.state.moveMealData.meal_info != undefined &&
    //     this.state.moveMealData.meal_info != null &&
    //     this.state.moveMealData.meal_info[cur_date] != undefined &&
    //     this.state.moveMealData.meal_info[cur_date][category_num] != undefined) {
    //     meal_info = this.state.moveMealData.meal_info[cur_date][category_num];
    // }

    // ■YJ747 移動食事カレンダーから入院決定すると食事が表示されないので混乱する点の修正
    // let cache_decision = this.getCacheDecision();  
    let is_decision = 0;  
    let is_after_decision = 0;
    if (this.cache_decision != null && this.cache_decision.hospital_type == "in_decision" && this.cache_decision.isForUpdate != 1) {
      is_after_decision = this.isAfterDecision(this.cache_decision, cur_date, category_num);    
    }
    if (is_after_decision == 1) {
      meal_info = this.cache_decision;
      is_decision = 1;
    } else {
      meal_info = this.getMealInfoData(cur_date, category_num);
    }

    let cache_meal_info = null;
    if (is_decision == 1) {      
      // ■YJ747 移動食事カレンダーから入院決定すると食事が表示されないので混乱する点の修正
      cache_meal_info = null;
    } else {      
      cache_meal_info = this.getCacheMealInfoByDateAndTimeClassification(cur_date, category_num).cache;
    }    

    // ■YJ747 移動食事カレンダーから入院決定すると食事が表示されないので混乱する点の修正

    if (meal_info == null || meal_info == undefined){
      if (cache_meal_info == null || cache_meal_info == undefined) {
        return "■";
      }
    }

    // if exist cache data, convert;
    if (cache_meal_info != null && cache_meal_info != undefined) meal_info = cache_meal_info;


    // get before date meal info for compare
    let _date = this.getDateFormat(new Date(cur_date));
    let before_date = this.getBeforeAndAfterDate(_date, -1);
    let meal_before_info = null;    
    if(category_num == 1){
      // let meal_before_info = this.state.moveMealData.meal_info[formatDateLine(before_date)];
      meal_before_info = this.getMealInfoData(formatDateLine(before_date), 4);// get before date and evening's info
    } else {
      meal_before_info = this.getMealInfoData(cur_date, category_num - 1);// get cur date and before time's info
    }

    // get before date's cache
    let cache_meal_before_info = null;
    if(category_num == 1){
      cache_meal_before_info = this.getCacheMealInfoByDateAndTimeClassification(formatDateLine(before_date), 4).cache;
    } else {
      cache_meal_before_info = this.getCacheMealInfoByDateAndTimeClassification(formatDateLine(before_date), category_num - 1).cache;
    }

    if (cache_meal_before_info != null && cache_meal_before_info != undefined) meal_before_info = cache_meal_before_info;


    let str_from_date_line = this.getDateLine(this.state.from_date);

    // if current date is first date in 11 days, make before date's meal to null.
    if (cur_date == str_from_date_line && category == "morning") {
      meal_before_info = null;
    }

    // let cur_date_obj = new Date(cur_date);

    // if (category == "morning") {
    // get current meal info
    let staple_food_id = meal_info.staple_food_id_morning;
    if (category == "noon") {
      staple_food_id = meal_info.staple_food_id_noon;
    } else if(category == "evening") {
      staple_food_id = meal_info.staple_food_id_evening;
    }
    if (staple_food_id == null) {
      // YJ435 移動食事カレンダーの流動食関連の情報不足の修正
      // →流動食のみの場合などもあるので「食種」を表示するかどうかは主食有無は関係なく食種で表示するように。
      if (meal_info.food_type_id != undefined && meal_info.food_type_id != null && meal_info.food_type_id != "" && this.getFoodTypeName(meal_info.food_type_id) != "") {
        return this.getFoodTypeName(meal_info.food_type_id);
      } else {
        // YJ747 移動食事カレンダーから入院決定すると食事が表示されないので混乱する点の修正
        if (is_decision == 1) {
          if (this.getFoodTypeName(meal_info.food_type_id, "is_decision") != "") {
            let show_food_type = this.getFoodTypeName(meal_info.food_type_id, "is_decision");
            return show_food_type;
          } else {
            return "■";
          }
        } else {
          return "■";
        }
      }
    }
    if (meal_before_info != null && meal_before_info != undefined) {
      // get before meal info
      let staple_food_id_before = meal_before_info.staple_food_id_evening;
      if (category == "noon") {
        staple_food_id_before = meal_before_info.staple_food_id_morning;
      } else if(category == "evening") {
        staple_food_id_before = meal_before_info.staple_food_id_noon;
      }
      // YJ243 食事のキュー内容などの不具合
      // 移動食事カレンダーには、ひとつ前と主食が同じでも食種が違う場合は変更扱いするように
      if (staple_food_id_before == staple_food_id && meal_info.food_type_id == meal_before_info.food_type_id) {
        return "↓";
      } else {
        if (cur_date == str_from_date_line) {
          return "→" + this.getFoodTypeName(meal_info.food_type_id) + "<br/>" + "<" + this.getStapleFoodName(staple_food_id) + ">";
        } else {
          return this.getFoodTypeName(meal_info.food_type_id) + "<br/>" + "<" + this.getStapleFoodName(staple_food_id) + ">";
        }
      }
    } else {
      if (cur_date == str_from_date_line) {
        return "→" + this.getFoodTypeName(meal_info.food_type_id) + "<br/>" + "<" + this.getStapleFoodName(staple_food_id) + ">";
      } else {
        return this.getFoodTypeName(meal_info.food_type_id) + "<br/>" + "<" + this.getStapleFoodName(staple_food_id) + ">";
      }
    }
    // }
    // else if(category == "noon") {
    //     if (meal_info.staple_food_id_noon == null) return "■";
    //     if (meal_info.staple_food_id_morning == meal_info.staple_food_id_noon) {
    //         return "↓";
    //     } else {
    //         if (cur_date == str_from_date_line) {
    //             return "→" + this.getFoodTypeName(meal_info.food_type_id) + "<br/>" + "<" + this.getStapleFoodName(meal_info.staple_food_id_noon) + ">";
    //         } else {
    //             return this.getFoodTypeName(meal_info.food_type_id) + "<br/>" + "<" + this.getStapleFoodName(meal_info.staple_food_id_noon) + ">";
    //         }
    //     }
    // } else if(category == "evening") {
    //     if (meal_info.staple_food_id_evening == null) return "■";
    //     if (meal_info.staple_food_id_noon == meal_info.staple_food_id_evening) {
    //         return "↓";
    //     } else {
    //         if (cur_date == str_from_date_line) {
    //             return "→" + this.getFoodTypeName(meal_info.food_type_id) + "<br/>" + "<" + this.getStapleFoodName(meal_info.staple_food_id_evening) + ">";
    //         } else {
    //             return this.getFoodTypeName(meal_info.food_type_id) + "<br/>" + "<" + this.getStapleFoodName(meal_info.staple_food_id_evening) + ">";
    //         }
    //     }
    // }
  }

  handleClickMeal = (sel_date, meal_type) => {
    this.setState({
      selected_date: sel_date,
      selected_meal_type: meal_type
    });
  }

  // 担当変更
  changeResponsibility = () => {
    this.setState({
      isOpenChangeResponsibilityModal: false
    });
  }

  // 食事変更
  changeMeal = () => {
    this.setState({
      isOpenChangeMealModal: false,
      cache_index: null,
    });
  }

  // 食事一括表示
  confirmFoodGroup = () => {
    this.setState({
      isOpenFoodGroupModal: false
    });
  }

  // 外出泊・帰院
  confirmOutReturnHospital = () => {
    this.setState({
      isOpenOutRetrurnHospitalModal: false
    });
  }

  closeModal = () => {
    this.meal_edit_cache = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.MEAL_EDIT);
    this.meal_group_edit_cache = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.MEAL_GROUP_EDIT);

    this.setState({
      isOpenChangeResponsibilityModal : false,
      isOpenChangeMealModal : false,
      isOpenFoodGroupModal : false,
      isOpenOutRetrurnHospitalModal : false,
      cache_index : null,
      is_loaded: false,
      openHospitalApplication :false,
      openDischargePermitOrder :false,
      openOutHospitalization :false,
    }, ()=>{
      this.getMoveMealData();
    });

    // let _state = {};

    // if (this.modal_type == "changeMeal" || this.modal_type == "showFoodGroup") {
    //   _state.is_loaded = false;
    // }

    // _state.isOpenChangeResponsibilityModal = false;
    // _state.isOpenChangeMealModal = false;
    // _state.isOpenFoodGroupModal = false;
    // _state.isOpenOutRetrurnHospitalModal = false;
    // _state.cache_index = null;
    // _state.openHospitalApplication =false;
    // _state.openDischargePermitOrder =false;
    // _state.openOutHospitalization =false;

    // this.setState(_state, ()=>{
    //   if (this.modal_type == "changeMeal" || this.modal_type == "showFoodGroup") {
    //     this.getMoveMealData();
    //   }
    // });
  }

  openChangeModal = (type) => {
    let _state = {};
    if(type == "changeResponsibility"){
      _state.isOpenChangeResponsibilityModal = true;
    }
    if(type == "changeMeal"){
      // is not hospital patient => return;
      if (this.state.hospitalization_info.is_carried_out_of_hospitalization == 0) {
        this.setState({alert_messages: "入院患者を選択してください。",});
        return;
      }
      if (this.state.selected_date != null) {
        let data = this.getCacheMealInfoByDateAndTimeClassification(this.state.selected_date, this.state.selected_meal_type);
        let cache_data = data.cache;
        if (cache_data != null && cache_data != undefined) {
          _state.cache_index = data.key;
        }
        _state.isOpenChangeMealModal = true;
      }
    }
    if(type == "showFoodGroup"){
      // is not hospital patient => return;
      if (this.state.hospitalization_info.is_carried_out_of_hospitalization == 0) {
        this.setState({alert_messages: "入院患者を選択してください。"});
        return;
      }
      _state.isOpenFoodGroupModal = true;
    }
    if(type == "outAndReturnHospital"){
      _state.isOpenOutRetrurnHospitalModal = true;
    }
    this.setState(_state);
  }

  closeAlertModal = () => {
    this.setState({
      alert_messages:"",
    });
  }

  getMealInfoData = (_date, _start_time_classification) => {
    // ■YJ747 移動食事カレンダーから入院決定すると食事が表示されないので混乱する点の修正
    // let cache_decision = this.getCacheDecision();      
    if (this.cache_decision != null && this.cache_decision.start_date == _date && this.cache_decision.start_time_classification == _start_time_classification && this.cache_decision.hospital_type == "in_decision" && this.cache_decision.isForUpdate != 1) {
      return null;
    }


    let meal_info = null;
    let meal_date = this.state.from_date;
    let break_flag = 0;

    // date loop
    /*
    for(let i = 1; i <= 12; i++){
        if(break_flag == 1) break;

        let str_date = formatDateLine(meal_date);
        if(!this.state.moveMealData.meal_info[str_date]) {
            meal_date = getNextDayByJapanFormat(meal_date);
            if(str_date == _date) {
                break;
            }
            continue;
        }

        // start_time_classification loop
        for(let j = 1; j<= 3; j++){
            if(!this.state.moveMealData.meal_info[str_date][j]){
                if(str_date == _date && j == _start_time_classification) {
                    break_flag = 1;
                    break;
                }
                continue;
            }

            meal_info = this.state.moveMealData.meal_info[str_date][j];

            if(str_date == _date && j == _start_time_classification) {
                break_flag = 1;
                break;
            }
        }
        meal_date = getNextDayByJapanFormat(meal_date);
    }

    */

    for(let i = 1; i <= 12; i++){

      if(break_flag == 1) break;

      let str_date = formatDateLine(meal_date);      

      // start_time_classification loop
      for(let j = 1; j<= 4; j++){

        // check cache
        let cache_data = this.getCacheMealInfoByDateAndTimeClassification(str_date, j);
        if(cache_data != undefined && cache_data != null && cache_data.key != null){
          meal_info = cache_data.cache;

          // check loop condition
          if(str_date == _date && j == _start_time_classification) {
            break_flag = 1;
            break;
          }
          continue;
        }

        // check api data (date)
        if(!this.state.moveMealData.meal_info[str_date]){
          // check loop condition
          if(str_date == _date && j == _start_time_classification) {
            break_flag = 1;
            break;
          }
          // loop again!
          continue;
        }

        // check api data(date and classification)
        if(!this.state.moveMealData.meal_info[str_date][j]){
          // check loop condition
          if(str_date == _date && j == _start_time_classification) {
            break_flag = 1;
            break;
          }
          continue;
        }

        meal_info = this.state.moveMealData.meal_info[str_date][j];

        // check loop condition
        if(str_date == _date && j == _start_time_classification) {
          break_flag = 1;
          break;
        }
      }
      meal_date = getNextDayByJapanFormat(meal_date);
    }


    return meal_info;
  }

  // meal info of date and start_time classification
  getMealInfo = (_date, _start_time_classification) => {

    let send_data = {};
    // get date and start_time classification's data
    let modal_data = this.state.moveMealData.meal_info[_date];
    if(modal_data != null && modal_data != undefined){
      modal_data = this.state.moveMealData.meal_info[_date][_start_time_classification];
    }

    // get last date and start_time classification's data
    if(modal_data == null || modal_data == undefined){
      modal_data =  this.getMealInfoData(_date, _start_time_classification);
    }

    let hospitalization_info = this.state.moveMealData.hospitalization_info;

    if (modal_data == null || modal_data == undefined) {
      send_data.hos_number = hospitalization_info.hos_number;
      send_data.department_id = hospitalization_info.department_id;
      send_data.department_name = hospitalization_info.department_name;
    } else {
      send_data = modal_data;
      send_data.hos_number = hospitalization_info.hos_number;
      send_data.department_id = hospitalization_info.department_id;
      send_data.department_name = hospitalization_info.department_name;
    }
    send_data.start_date = _date;
    send_data.start_time_classification = _start_time_classification;
    if (this.state.moveMealData.hospitalization_detail != undefined && 
      this.state.moveMealData.hospitalization_detail != null && 
      this.state.moveMealData.hospitalization_detail.id != undefined && 
      this.state.moveMealData.hospitalization_detail.id > 0) {
      send_data.hos_detail_number = this.state.moveMealData.hospitalization_detail.id;
    }
    return send_data;
  }

  confirmCloseModal=()=>{
    this.context.$setExaminationOrderFlag(1);
    this.props.closeModal();
  };

  handleShowDBData = () => {
    this.setState({
      is_loaded: false
    }, ()=> {
      this.getMoveMealData();
    });
  }

  openHospitalApplication=(type)=>{
    this.setState({
      openHospitalApplication:true,
      modal_type:type
    });
  }

  openDischargePermitOrder=()=>{
    this.setState({
      openDischargePermitOrder:true,
    });
  }

  openOutHospitalizationModal=()=>{
    // is not hospital patient => return;
    if (this.state.hospitalization_info.is_carried_out_of_hospitalization == 0) {
      this.setState({alert_messages: "入院患者を選択してください。",});
      return;
    }
    this.setState({openOutHospitalization:true});
  }

  existInMealGroupEdit = (_date, _classification) => {
    let cache_meal_group_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.MEAL_GROUP_EDIT);

    let result = {
      status: false,
      meal_info: {}
    };
    if (cache_meal_group_data == undefined || cache_meal_group_data == null || Object.keys(cache_meal_group_data).length < 1) return result;

    let compare_date = new Date(_date.split("-").join("/")).getTime();

    Object.keys(cache_meal_group_data).map(key=>{
      let from = new Date(cache_meal_group_data[key].start_date.split("-").join("/")).getTime();
      let to = new Date(cache_meal_group_data[key].start_date_to.split("-").join("/")).getTime();
      if (from <= compare_date && compare_date <= to) {
        if (from == to) {
          if (cache_meal_group_data[key].start_time_classification <= _classification && _classification <= cache_meal_group_data[key].start_time_classification_to) {
            result.status = true;
          }
        } else if(from == compare_date) {
          if (cache_meal_group_data[key].start_time_classification <= _classification && _classification <= 4) {
            result.status = true;
          }
        } else if(compare_date == to) {
          if (1 <= _classification && _classification <= cache_meal_group_data[key].start_time_classification_to) {
            result.status = true;
          }
        } else {
          result.status = true;
        }
      }
      if(result.status == true) result.meal_info = cache_meal_group_data[key]
    });

    return result;
  }

  // ●YJ435 移動食事カレンダーの流動食関連の情報不足の修正
  // 移動食事カレンダーで、流動食のセルはオンマウスで名称・摂取方法・朝昼夕本数を表示するように
  getThickLiquidFoodContent = (_category=null, _date=null) => {
    let result={
      thick_liquid_food_name:"",
      ingestion_method_name:"",
      thick_liquid_food_number_id_morning:"",
      thick_liquid_food_number_id_noon:"",
      thick_liquid_food_number_id_evening:""
    };

    let category_num = _category == "morning" ? 1 : _category == "noon" ? 2 : _category == "evening" ? 3: 0;
    if(category_num == 0) return result;

    let meal_info = null;
    // if (this.state.moveMealData != null &&
    //     this.state.moveMealData != undefined &&
    //     this.state.moveMealData.meal_info != undefined &&
    //     this.state.moveMealData.meal_info != null &&
    //     this.state.moveMealData.meal_info[cur_date] != undefined &&
    //     this.state.moveMealData.meal_info[cur_date][category_num] != undefined) {
    //     meal_info = this.state.moveMealData.meal_info[cur_date][category_num];
    // }

    meal_info = this.getMealInfoData(_date, category_num);

    let cache_meal_info = this.getCacheMealInfoByDateAndTimeClassification(_date, category_num).cache;
    if (meal_info == null || meal_info == undefined){
      if (cache_meal_info == null || cache_meal_info == undefined) {
        return result;
      }
    }

    // if exist cache data, convert;
    if (cache_meal_info != null && cache_meal_info != undefined) meal_info = cache_meal_info;
    if (meal_info.thick_liquid_food_id != undefined && meal_info.thick_liquid_food_id != null && meal_info.thick_liquid_food_id > 0) {
      result.thick_liquid_food_name = this.getThickLiquidFoodName(meal_info.thick_liquid_food_id);
      // get 摂取方法, 本数（朝）, 本数（昼）, 本数（夕）
      result = this.getIngestionMethodNameMealCount(result, meal_info.ingestion_method_id, meal_info.thick_liquid_food_number_id_morning, meal_info.thick_liquid_food_number_id_noon, meal_info.thick_liquid_food_number_id_evening);
      // if (meal_info.ingestion_method_id != undefined && meal_info.ingestion_method_id != null && meal_info.ingestion_method_id > 0) {
      //   result.ingestion_method_name = getIngestionMethodName(meal_info.ingestion_method_id);
      // }
    }

    return result;
  }

  // 摂取方法, 本数（朝）, 本数（昼）, 本数（夕）
  getIngestionMethodNameMealCount = (_result, _ingestion_method_id=null, _thick_liquid_food_number_id_morning=null, _thick_liquid_food_number_id_noon=null, _thick_liquid_food_number_id_evening=null) => {
    let result = _result;

    let ingestion_method = [];
    let thick_liquid_food_morning = [];
    let thick_liquid_food_noon = [];
    let thick_liquid_food_evening = [];
    if(this.state.moveMealData != undefined && 
      this.state.moveMealData !=null && 
      this.state.moveMealData.thick_liquid_food_and_milk_item_master != undefined && 
      this.state.moveMealData.thick_liquid_food_and_milk_item_master !=null && 
      this.state.moveMealData.thick_liquid_food_and_milk_item_master.length > 0){
      this.state.moveMealData.thick_liquid_food_and_milk_item_master.map(item=>{
        if(item.attribute_classification == "01"){ //01：摂取方法
          ingestion_method.push({id:item.number, value:item.name});
        }
        // if(item.attribute_classification == "02"){ //02：回数
        //   meal_number_master.push({id:item.number, value:item.name});
        // }
        // if(item.attribute_classification == "03"){ //03：一回量
        //   milk_amount.push({id:item.number, value:item.name});
        // }
        if(item.attribute_classification == "05"){ //05：本数（朝）
          thick_liquid_food_morning.push({id:item.number, value:item.name});
        }
        if(item.attribute_classification == "06"){ //06：本数（昼）
          thick_liquid_food_noon.push({id:item.number, value:item.name});
        }
        if(item.attribute_classification == "07"){ //07：本数（夕）
          thick_liquid_food_evening.push({id:item.number, value:item.name});
        }

      });

      if(ingestion_method.length > 0 && _ingestion_method_id != undefined && _ingestion_method_id != null && _ingestion_method_id > 0){
        ingestion_method.map(item=>{
          if (item.id == _ingestion_method_id) {
            result.ingestion_method_name = item.value;
          }
        });
      }
      if(thick_liquid_food_morning.length > 0 && _thick_liquid_food_number_id_morning != undefined && _thick_liquid_food_number_id_morning != null && _thick_liquid_food_number_id_morning > 0){
        thick_liquid_food_morning.map(item=>{
          if (item.id == _thick_liquid_food_number_id_morning) {
            result.thick_liquid_food_number_id_morning = item.value;
          }
        });
      }
      if(thick_liquid_food_noon.length > 0 && _thick_liquid_food_number_id_noon != undefined && _thick_liquid_food_number_id_noon != null && _thick_liquid_food_number_id_noon > 0){
        thick_liquid_food_noon.map(item=>{
          if (item.id == _thick_liquid_food_number_id_noon) {
            result.thick_liquid_food_number_id_noon = item.value;
          }
        });
      }
      if(thick_liquid_food_evening.length > 0 && _thick_liquid_food_number_id_evening != undefined && _thick_liquid_food_number_id_evening != null && _thick_liquid_food_number_id_evening > 0){
        thick_liquid_food_evening.map(item=>{
          if (item.id == _thick_liquid_food_number_id_evening) {
            result.thick_liquid_food_number_id_evening = item.value;
          }
        });
      }
    }
    return result;
  }

  // 流動食 name
  getThickLiquidFoodName = (thick_liquid_food_id=null) => {
    let result = "";
    if (thick_liquid_food_id == null || thick_liquid_food_id == undefined || thick_liquid_food_id <= 0) return result;

    if (this.state.moveMealData != undefined && 
      this.state.moveMealData !=null && 
      this.state.moveMealData.thick_liquid_food_master != undefined && 
      this.state.moveMealData.thick_liquid_food_master != null && 
      this.state.moveMealData.thick_liquid_food_master.length > 0) {
      this.state.moveMealData.thick_liquid_food_master.map(item=>{
        if (item.number == thick_liquid_food_id) {
          result = item.name;  
        }
      });      
    }
    return result;
  }

  editTooltip = async(e, _category, _date) => {   
    let cur_date_test = new Date(_date);
    let _searchDate = new Date(formatDateLine(this.state.search_date));
    let compare_date = new Date(_searchDate.setDate(_searchDate.getDate() + 5));
    
    let content = null;
    content = this.getThickLiquidFoodContent(_category, _date);
    if (content.thick_liquid_food_name == "") return;
    // thick_liquid_food_name:"",
    // ingestion_method_name:"",
    // thick_liquid_food_number_id_morning:"",
    // thick_liquid_food_number_id_noon:"",
    // thick_liquid_food_number_id_evening:""

    let cell_obj = document.getElementsByClassName("cell-context-menu")[0];
    if(cell_obj !== undefined && cell_obj != null){
      cell_obj.style['display'] = "block";
      let _x = e.clientX - 40;
      if (cur_date_test > compare_date) {
        _x = _x - 200;
      }
      cell_obj.style['left'] = _x +"px";
      let _y = e.clientY - 30;
      cell_obj.style['top'] = _y +"px";
      let cell_td_obj1 = document.getElementsByClassName("tooltip-content")[0];
      if(cell_td_obj1 !== undefined && cell_td_obj1 != null){
        cell_td_obj1.innerHTML = "流動食: " + content.thick_liquid_food_name;
      }
      if (content.ingestion_method_name != undefined && content.ingestion_method_name != "") {        
        let cell_td_obj2 = document.getElementsByClassName("tooltip-ingestion-method")[0];
        if(cell_td_obj2 !== undefined && cell_td_obj2 != null){
          cell_td_obj2.innerHTML = "摂取方法: " + content.ingestion_method_name;
        }
      }
      if ((content.thick_liquid_food_number_id_morning != undefined && content.thick_liquid_food_number_id_morning != "") || 
        (content.thick_liquid_food_number_id_noon != undefined && content.thick_liquid_food_number_id_noon != "") || 
        (content.thick_liquid_food_number_id_evening != undefined && content.thick_liquid_food_number_id_evening != "")) {        
        let cell_td_obj3 = document.getElementsByClassName("tooltip-meal-count")[0];
        if(cell_td_obj3 !== undefined && cell_td_obj3 != null){
          // console.log("cell_td_obj3 content", content);
          let content_val = this.getMealCountLabel(content.thick_liquid_food_number_id_morning, content.thick_liquid_food_number_id_noon, content.thick_liquid_food_number_id_evening);
          cell_td_obj3.innerHTML = content_val;
        }
      }        
    }

    // $(".context-menu")

    // this.setState({
    //   tooltip: {
    //     visible: true,
    //     x: e.clientX-20,
    //     y: e.clientY+window.pageYOffset,
    //   },
    //   tooltip_content:content
    // });
  };

  // ・SOAP右・中央カラムとシールは、流動食名の下に摂取方法、その下に「朝1、夕1」のように本数を表示するように
  getMealCountLabel = (_morning, _noon, _evening) => {
    let result = [];
    if (_morning != undefined && _morning != null && _morning != "") {
      result.push("朝" + _morning);
    }
    if (_noon != undefined && _noon != null && _noon != "") {
      result.push("昼" + _noon);
    }
    if (_evening != undefined && _evening != null && _evening != "") {
      result.push("夕" + _evening);
    }
    return result.join("、");
  }

  hideTooltip = () => {
    // this.setState({ tooltip: { visible: false} });

    let cell_obj = document.getElementsByClassName("cell-context-menu")[0];
    if(cell_obj !== undefined && cell_obj != null){
      cell_obj.style['display'] = "none";
      let cell_td_obj = document.getElementsByClassName("tooltip-content")[0];
      if(cell_td_obj !== undefined && cell_td_obj != null){        
        cell_td_obj.innerHTML = "";
      }
      let cell_td_obj2 = document.getElementsByClassName("tooltip-ingestion-method")[0];
      if(cell_td_obj2 !== undefined && cell_td_obj2 != null){
        cell_td_obj2.innerHTML = "";
      }
      let cell_td_obj3 = document.getElementsByClassName("tooltip-content")[0];
      if(cell_td_obj3 !== undefined && cell_td_obj3 != null){
        cell_td_obj3.innerHTML = "";
      }
    }
  };

  render() {
    // ●YJ356 食事の締め切りの調整と権限の追加
    // B. 権限に「食事」を追加。「変更」と、新たに「実施直前変更」
    let permission_meal = this.context.$canDoAction(this.context.FEATURES.MEAL_CHANGE,this.context.AUTHS.EDIT) || this.context.$canDoAction(this.context.FEATURES.MEAL_CHANGE,this.context.AUTHS.MEAL_IMPLEMENT_EDIT);
    

    // YJ614 移動食事カレンダで、日付セルを選んでいないから食事変更が押せないとわかる表現が未実装
    let show_tooltip_meal_change = true;
    if (this.state.selected_date != null && this.state.selected_meal_type != null) {
      show_tooltip_meal_change = false;
    }

    return (
      <>
        <Modal
          show={true}
          className="custom-modal-sm patient-exam-modal move-meal-calendar first-view-modal"
        >
          <Modal.Header><Modal.Title>移動食事カレンダー</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                <>
                  {this.props.patientInfo != undefined && this.props.patientInfo.receId != undefined && this.props.patientInfo.receId != "" && this.props.patientInfo.name != undefined && this.props.patientInfo.name != "" && (
                    <div className="flex patient-info-area" style={{fontSize: "1rem"}}>
                      {this.props.patientInfo.receId + ": " + this.props.patientInfo.name}
                    </div>
                  )}
                  <div className={'date-time-hospitalization flex'}>
                    <Button type="common" className={'modal-btn'} onClick={this.moveMonth.bind(this, 'prev')}><div className="move-calendar-btn">{'<<'}</div></Button>
                    <Button type="common" className={'modal-btn'} onClick={this.moveDay.bind(this, 'prev')}><div className="move-calendar-btn">{'<'}</div></Button>
                    <Button type="common" className={'modal-btn'} onClick={() => this.toggle()}>{'▼'}</Button>                    
                    <div className={'select-date'}>
                      <DatePicker
                        ref={(r) => {
                          this.component = r;
                        }}
                        locale="ja"
                        selected={''}
                        onChange={this.getSearchDate.bind(this)}
                        dateFormat="yyyy/MM/dd"
                        placeholderText=""
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dayClassName = {date => setDateColorClassName(date)}
                      />
                    </div>
                    <Button type="common" className={'modal-btn'} onClick={this.moveDay.bind(this, 'next')}><div className="move-calendar-btn">{'>'}</div></Button>
                    <Button type="common" className={'modal-btn'} onClick={this.moveMonth.bind(this, 'next')}><div className="move-calendar-btn">{'>>'}</div></Button>                    
                    <label className={'date-label'}>入院日</label>
                    <div className={'view-date'}>{this.state.hospitalization_date}</div>
                  </div>
                  <div className={'btn-area flex'}>
                    <div style={{width:"130px", textAlign:"center"}}>                      
                      <Button type="common" className={'modal-btn'} onClick={()=>this.handleShowDBData()}>最新表示</Button>
                    </div>
                    <div className={''}>
                      {/*<div className={'flex'}>
                          <button className={'modal-btn'} onClick={this.openHospitalApplication.bind(this, "application")}>入院申込</button>
                          <button className={'modal-btn'} onClick={this.openDischargePermitOrder}>退院許可</button>
                          <button className={'modal-btn'}>転棟申込</button>
                          <button className={'modal-btn'}>転室・転床</button>
                          <button className={'modal-btn'} onClick={()=>this.openChangeModal("outAndReturnHospital")}>外出泊・帰院</button>
                          <button className={'modal-btn'} onClick={()=>this.openChangeModal("changeMeal")}>食事変更</button>
                        </div>
                        <div className={'flex'} style={{marginTop:"10px"}}>
                          <button className={'modal-btn'} onClick={this.openHospitalApplication.bind(this, "decision")}>入院</button>
                          <button className={'modal-btn'} onClick={this.openOutHospitalizationModal}>退院</button>
                          <button className={'modal-btn'}>転棟</button>
                          <button className={'modal-btn'} onClick={this.openChangeModal.bind(this, "changeResponsibility")}>転科</button>
                          <button className={'modal-btn'} onClick={this.openChangeModal.bind(this, "changeResponsibility")}>担当変更</button>
                          <button className={'modal-btn'} onClick={()=>this.openChangeModal("showFoodGroup")}>食事一括指示</button>
                        </div>*/}
                      <div className={'flex'}>                        
                        <Button
                          type="common"
                          className={this.state.hospitalization_info.is_carried_out_of_hospitalization == 1 ? 'disable-btn modal-btn' : 'modal-btn'}
                          onClick={this.openHospitalApplication.bind(this, "application")}
                          isDisabled={this.state.hospitalization_info.is_carried_out_of_hospitalization == 1}
                        >入院申込</Button>
                        <Button
                          type="common"
                          className={this.state.hospitalization_info.is_carried_out_of_hospitalization == 1 ? 'disable-btn modal-btn' : 'modal-btn'}
                          onClick={this.openHospitalApplication.bind(this, "decision")}
                          isDisabled={this.state.hospitalization_info.is_carried_out_of_hospitalization == 1}
                        >入院</Button>
                        <Button
                          type="common"
                          className={this.state.hospitalization_info.is_carried_out_of_hospitalization == 0 ? 'disable-btn modal-btn' : 'modal-btn'}
                          onClick={this.openDischargePermitOrder}
                          isDisabled={this.state.hospitalization_info.is_carried_out_of_hospitalization == 0}
                        >退院許可</Button>
                        <Button
                          type="common"
                          className={this.state.hospitalization_info.is_carried_out_of_hospitalization == 0 ? 'disable-btn modal-btn' : 'modal-btn'}
                          onClick={this.openOutHospitalizationModal}
                          isDisabled={this.state.hospitalization_info.is_carried_out_of_hospitalization == 0}>退院</Button>
                        <Button
                          type="common"
                          className={this.state.hospitalization_info.date_and_time_of_hospitalization == null ? 'disable-btn modal-btn' : 'modal-btn'}
                          onClick={this.openChangeModal.bind(this, "changeResponsibility")}
                          isDisabled={this.state.hospitalization_info.date_and_time_of_hospitalization == null}
                        >転科</Button>
                        <Button
                          type="common"
                          className={this.state.hospitalization_info.date_and_time_of_hospitalization == null ? 'disable-btn modal-btn' : 'modal-btn'}
                          onClick={this.openChangeModal.bind(this, "changeResponsibility")}
                          isDisabled={this.state.hospitalization_info.date_and_time_of_hospitalization == null}
                        >担当変更</Button>
                        {this.state.hospitalization_info.is_carried_out_of_hospitalization == 0 || permission_meal != true ? (
                          <>
                            <Button 
                              type="common" 
                              className={'disable-btn modal-btn'}                              
                              isDisabled={true}
                            >食事変更</Button>                        
                          </>
                        ):(
                          <>
                            {show_tooltip_meal_change ? (
                              <Button 
                                type="common" 
                                tooltip={show_tooltip_meal_change ? '日付・タイミングをクリックで選択してください。' : ''}
                                tooltip_position={'bottom'}
                                className={'disable-btn modal-btn'}                                 
                                isDisabled={true}
                              >食事変更</Button>
                            ):(
                              <Button 
                                type="common" 
                                onClick={()=>this.openChangeModal("changeMeal")}
                                className={'modal-btn'}                                                              
                              >食事変更</Button>
                            )}
                          </>
                        )}                                             
                        <Button
                          type="common"
                          className={this.state.hospitalization_info.is_carried_out_of_hospitalization == 0 || permission_meal != true ? 'disable-btn modal-btn' : 'modal-btn'}
                          onClick={()=>this.openChangeModal("showFoodGroup")}
                          isDisabled={this.state.hospitalization_info.is_carried_out_of_hospitalization == 0 || permission_meal != true}
                        >食事一括指示</Button>
                      </div>
                    </div>
                  </div>
                  <div className={'calendar-area'}>
                    {this.state.is_loaded == false ? (
                      <div className='spinner-loading center'>
                        <SpinnerWrapper>
                          <Spinner animation="border" variant="secondary" />
                        </SpinnerWrapper>
                      </div>
                    ):(
                      <>
                        <table className="table-scroll table table-bordered" id="code-table">
                          <thead>
                          <tr>
                            <th>{this.state.search_date != null && this.state.search_date.getFullYear()+'年'}</th>
                            {this.createTable('thead')}
                          </tr>
                          </thead>
                          <tbody>
                          {/*<tr>
                          <td rowSpan={'4'}>移動情報</td>
                          {this.createTable('tbody', 1, 1)}
                        </tr>
                        <tr>
                          {this.createTable('tbody', 1, 2)}
                        </tr>
                        <tr>
                          {this.createTable('tbody', 1, 3)}
                        </tr>
                        <tr>
                          {this.createTable('tbody', 1, 4)}
                        </tr>*/}
                          <tr>
                            <td>食事（朝）</td>
                            {this.createTable('tbody', 2, "morning", 1)}
                          </tr>
                          <tr>
                            <td>食事（昼）</td>
                            {this.createTable('tbody', 2, "noon", 2)}
                          </tr>
                          <tr>
                            <td>食事（夕）</td>
                            {this.createTable('tbody', 2, "evening", 3)}
                          </tr>
                          {/*<tr>
                          <td>診療科</td>
                          {this.createTable('tbody', 3)}
                        </tr>
                        <tr>
                          <td>病棟</td>
                          {this.createTable('tbody', 3)}
                        </tr>
                        <tr>
                          <td>病室</td>
                          {this.createTable('tbody', 3)}
                        </tr>
                        <tr>
                          <td>主担当医</td>
                          {this.createTable('tbody', 4)}
                        </tr>
                        <tr>
                          <td>担当医</td>
                          {this.createTable('tbody', 4)}
                        </tr>
                        <tr>
                          <td>担当看護</td>
                          {this.createTable('tbody', 4)}
                        </tr>
                        <tr>
                          <td>副担当看護</td>
                          {this.createTable('tbody', 4)}
                        </tr>
                        <tr>
                          <td>チーム</td>
                          {this.createTable('tbody', 4)}
                        </tr>*/}
                          </tbody>
                        </table>
                      </>
                    )}
                  </div>

                  <ContextMenuUl>
                    <ul className="cell-context-menu">
                      <li>
                        <div className={'tooltip-content'}></div>              
                      </li>
                      <li>
                        <div className={'tooltip-ingestion-method'}></div>              
                      </li>
                      <li>
                        <div className={'tooltip-meal-count'}></div>              
                      </li>                    
                    </ul>
                  </ContextMenuUl>
                </>
              </Wrapper>            
              {this.state.isOpenChangeResponsibilityModal == true && (
                <ChangeResponsibilityModal
                  closeModal={this.closeModal}
                  handleOk={this.changeResponsibility}
                  patientId={this.props.patientId}
                  from_mode={'calendar'}
                />
              )}
              {this.state.isOpenChangeMealModal == true && (
                <ChangeMealModal
                  closeModal={this.closeModal}
                  patientId={this.props.patientId}
                  modalData={this.getMealInfo(this.state.selected_date, this.state.selected_meal_type)}
                  start_date={this.state.selected_date}
                  handleOk={this.changeMeal}
                  cache_index={this.state.cache_index}
                  patientInfo={this.props.patientInfo}
                  from_mode={'calendar'}
                />
              )}
              {this.state.isOpenFoodGroupModal == true && (
                <FoodGroupModal
                  closeModal={this.closeModal}
                  modalData={this.getMealInfo(this.state.selected_date, this.state.selected_meal_type)}
                  patientId={this.props.patientId}
                  handleOk={this.confirmFoodGroup}
                />
              )}
              {this.state.alert_messages !== "" && (
                <SystemAlertModal
                  hideModal= {this.closeAlertModal.bind(this)}
                  handleOk= {this.closeAlertModal.bind(this)}
                  showMedicineContent= {this.state.alert_messages}
                />
              )}
              {this.state.isOpenOutRetrurnHospitalModal == true && (
                <OutReturnHospitalModal
                  closeModal={this.closeModal}
                  handleOk={this.confirmOutReturnHospital}
                  patientId={this.props.patientId}
                  department_id={this.state.department_id}
                  department_name={this.state.department_name}
                  hos_number={this.state.hos_number}
                  from_mode={'calendar'}
                />
              )}
              {this.state.openHospitalApplication && (
                <HospitalApplicationOrder
                  closeModal={this.closeModal}
                  type={this.state.modal_type}
                  patientId={this.props.patientId}
                  patientInfo={this.props.patientInfo}
                />
              )}
              {this.state.openDischargePermitOrder && (
                <DischargePermitOrder
                  closeModal={this.closeModal}
                  patientId={this.props.patientId}
                />
              )}
              {this.state.openOutHospitalization && (
                <KarteDischargeHospitalDecision
                  closeModal={this.closeModal}
                  patientId={this.props.patientId}
                />
              )}
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className={'cancel-btn'} onClick={this.confirmCloseModal}>閉じる</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

MoveMealCalendar.contextType = Context;
MoveMealCalendar.propTypes = {
  closeModal: PropTypes.func,
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,
};

export default MoveMealCalendar;
