import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import ja from "date-fns/locale/ja";
import DatePicker, { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import {formatDateLine, formatDateSlash, formatTimeIE} from "~/helpers/date";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import Spinner from "react-bootstrap/Spinner";
import SelectDoctorModal from "~/components/molecules/SelectDoctorModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import {CACHE_SESSIONNAMES, getEnableChangeMeal, getEnableInitMeal} from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const renderTooltip = (props) => <Tooltip {...props}>{props}</Tooltip>;

const Wrapper = styled.div`
  display: block;
  width: 100%;
  height: 100%;
  .flex {
    display: flex;
  }
  .div-title {
    line-height: 2rem;
    width: 120px;
  }
  .search-date {
    border: 1px solid #aaa;
    width: 10rem;
    background: white;
    height: 2rem;
    display:flex;
    align-items:center;
    padding-left:0.3rem;
  }
  .div-value {
    border: 1px solid #aaa;
    width: 15rem;
    line-height: 2rem;
    height: 2rem;
    padding:0 0.3rem;
  }
  .div-doctor {
    border: 1px solid #aaa;
    width: 15rem;
    max-height: 6rem;
    overflow-y:auto;
    div {
      width:100%;
      line-height: 2rem;
      height: 2rem;
      padding:0 0.3rem;
    }
  }
  .from-to {
    padding: 0 0.3rem;
    line-height: 2rem;
  }
  .table-area {
    width: 100%;
    table {
      margin:0;
      tbody{
        display:block;
        overflow-y: scroll;
        height: calc(94vh - 50rem);
        width:100%;
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2;}
      }
      tr{
        display: table;
        width: 100%;
      }
      thead{
        display:table;
        width:100%;
        border-bottom: 1px solid #dee2e6;
        tr{width: calc(100% - 17px);}
      }
      th {
        position: sticky;
        text-align: center;
        padding: 0.3rem;
        white-space:nowrap;
        border:1px solid #dee2e6;
        border-bottom:none;
        border-top:none;
        vertical-align: middle;
      }
      td {
        padding: 0.25rem;
        word-break: break-all;
      }
    }
  }
  .pullbox {
      .label-title {
          width: 0;
      }
      .pullbox-label {
          margin-bottom: 0;
      }
  }
  .going-out select {
      width: 200px;
      height: 2rem;
  }
  .time-class select {
      width: 100px;
      height: 2rem;
  }
  .select-date{
    .react-datepicker{
      width: 130% !important;
      font-size: 1.25rem;
      .react-datepicker__month-container{
        width:79% !important;
        height:24.375rem;
      }
      .react-datepicker__navigation--next--with-time{
        right: 6rem;
      }
      .react-datepicker__time-container{
        width:21% !important;
      }
      .react-datepicker__time-box{
        width:auto !important;
      }
      .react-datepicker__current-month{
        font-size: 1.25rem;
      }
      .react-datepicker__day-names, .react-datepicker__week{
        display: flex;
        justify-content: space-between;
      }
      .react-datepicker__month{
        .react-datepicker__week{
          margin-bottom:0.25rem;
        }
      }
    }
  }
  .react-datepicker-wrapper {
    input {
      height: 2rem;
      font-size: 1rem;
    }
  }
`;

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContextMenuUl = styled.div`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 1240px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 84px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 1rem;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
      font-size: 1rem;
      font-weight: bold;
    }
    img {
      width: 2rem;
      height: 2rem;
    }
    svg {
      width: 2rem;
      margin: 8px 0;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .blue-text {
    color: blue;
  }
  .patient-info-table {
    width: 100%;
    table {
      margin-bottom: 0;
    }
    th {
      font-size: 1rem;
      vertical-align: top;
      padding: 0;
      text-align: right;
      width: 110px;
      padding-right: 0.2rem;
    }
    td {
      font-size: 1rem;
      vertical-align: top;
      padding: 0;
      text-align: left;
      padding-left: 0.2rem;
      width:15rem;
      word-break: break-all;
      word-wrap: break-word;
    }
  }
`;

const HoverMenu = ({
                     visible,
                     x,
                     y,
                     detail_view_info,
                   }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu hover-menu" style={{ left: ('calc('+x+'px + 1rem)'), top: ('calc('+ y+'px + 4rem)')}}>
          <li>
            <div className={'patient-info-table'}>
              <table className="table-scroll table table-bordered">
                <tbody>
                {detail_view_info.view_type === "change_responsibility" && (
                  <>
                    <tr><th>主担当医</th><td>{detail_view_info.mainDoctor_name}</td></tr>
                    {detail_view_info.doctors_name.length > 0 && (
                      detail_view_info.doctors_name.map((name, index)=>{
                        return (
                          <>
                            <tr><th>{index === 0 ? "担当医" : ""}</th><td>{name}</td></tr>
                          </>
                        )
                      })
                    )}
                    {detail_view_info.nurse_id_in_charge_name !== "" && (
                      <tr><th>担当看護師</th><td>{detail_view_info.nurse_id_in_charge_name}</td></tr>
                    )}
                    {detail_view_info.deputy_nurse_name !== "" && (
                      <tr><th>副担当看護師</th><td>{detail_view_info.deputy_nurse_name}</td></tr>
                    )}
                    {detail_view_info.comment !== "" && (
                      <tr><th>フリーコメント</th><td>{detail_view_info.comment}</td></tr>
                    )}
                  </>
                )}
                {detail_view_info.view_type === "go_out_info" && (
                  <>
                    <tr><th>外出泊理由</th><td>{detail_view_info.going_out_name}</td></tr>
                    <tr><th>配膳停止</th><td>{formatDateSlash(detail_view_info.stop_serving_date.split('-').join('/'))+"（"+ detail_view_info.stop_serving_time_name +"）より停止"}</td></tr>
                    <tr><th>配膳開始</th><td>{formatDateSlash(detail_view_info.start_date.split('-').join('/'))+"（"+ detail_view_info.start_time_name +"）より開始"}</td></tr>
                  </>
                )}
                </tbody>
              </table>
            </div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class InputInformationDoHospital extends Component {
  constructor(props) {
    super(props);
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.diagnosis = {};
    departmentOptions.map(department=>{
      this.diagnosis[parseInt(department.id)] = department.value;
    });
    this.state = {
      going_out_id:0,
      going_out_name:"",
      stop_serving_date:new Date(),
      start_date:new Date(),
      cur_date:new Date(),
      stop_serving_time_class:0,
      start_time_classification:0,
      meal_time_classification_master:[{id:0, value:""}],
      going_out_master:[{id:0, value:""}],
      alert_messages:"",
      confirm_message:"",
      move_history:[],
      load_flag:false,
      isOpenSelectDoctor:false,
      confirm_alert_title:"",
    };
    this.change_flag = 0;
    this.discharge_date = null;
    this.doctors = sessApi.getDoctorList();
    this.cur_date = formatDateLine(new Date());
    this.cur_date = new Date(this.cur_date.split('-').join('/')+" 00:00:00");
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    this.is_seal_print = 0;
    if(initState !== undefined && initState != null && initState.conf_data !== undefined){
      if(initState.conf_data.sticker_print_mode !== undefined){
        if(props.modal_type === "discharge_practice"){
          if(initState.conf_data.sticker_print_mode.discharge_done == 2){
            this.is_seal_print = 1;
          }
        } else {
          if(initState.conf_data.sticker_print_mode.going_out_in == 2){
            this.is_seal_print = 1;
          }
        }
      }
    }
    this.IsExistNotDoneOrder = 0;
    this.meal_implement_edit = false;
    this.can_edit_meal_info = true;
    this.can_register = false;
  }

  async componentDidMount() {
    this.meal_implement_edit = this.context.$canDoAction(this.context.FEATURES.MEAL_CHANGE,this.context.AUTHS.MEAL_IMPLEMENT_EDIT);
    if(this.props.modal_type === "going_out" || this.props.modal_type === "going_in"){
      this.can_register = this.context.$canDoAction(this.context.FEATURES.OUT_RETURN, this.context.AUTHS.REGISTER)
        || this.context.$canDoAction(this.context.FEATURES.OUT_RETURN, this.context.AUTHS.REGISTER_PROXY);
    }
    if(this.props.modal_type === "discharge_practice"){
      this.can_register = this.context.$canDoAction(this.context.FEATURES.DISCHARGE_DONE, this.context.AUTHS.DONE_OREDER);
    }
    await this.getData();
  }

  getData=async()=>{
    let path = "/app/api/v2/ward/get/hospital_move_history";
    let post_data = {
      hos_number:this.props.patient_info.hos_number,
      hospitalization_id:this.props.patient_info.id,
      modal_type:this.props.modal_type,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        let meal_time_classification_master = this.state.meal_time_classification_master;
        if(res.meal_time_classification_master.length > 0){
          res.meal_time_classification_master.map(meal=>{
            meal_time_classification_master.push({id:meal.number, value:meal.name});
          });
        }
        let going_out_master = this.state.going_out_master;
        if(this.props.modal_type === "going_out"){
          if(res.going_out_master.length > 0){
            res.going_out_master.map(going_out=>{
              going_out_master.push({id:going_out.number, value:going_out.name});
            });
          }
        }
        let stop_serving_date = this.state.stop_serving_date;
        let stop_serving_time_class = this.state.stop_serving_time_class;
        let cur_date = this.state.cur_date;
        if(this.props.modal_type === "discharge_practice"){
          stop_serving_date = res.start_date != null ? new Date(res.start_date.split("-").join("/")) : new Date();
          stop_serving_time_class = res.start_time_classification;
          cur_date = new Date(res.discharge_date.split("-").join("/"));
          if(cur_date.getTime() < this.cur_date.getTime()){
            cur_date = this.cur_date;
          }
          if(res.moving_day !== undefined){
            let final_moving_day = new Date(res.moving_day);
            if(final_moving_day.getTime() > this.cur_date.getTime()){
              this.cur_date = final_moving_day;
              cur_date = final_moving_day;
            }
          }
          this.IsExistNotDoneOrder = res.IsExistNotDoneOrder;
        }
        let start_date = this.state.start_date;
        let start_time_classification = this.state.start_time_classification;
        let check_init_date_classification_start_date = {
          start_date: null,
          start_time_classification: null
        };
        let check_init_date_classification_stop_date = {
          start_date: null,
          start_time_classification: null
        };
        if(this.props.modal_type === "going_in"){
          if(res.start_date !== undefined){
            start_date = new Date(res.start_date.split("-").join("/"));
            check_init_date_classification_stop_date.start_date = start_date;
            if(start_date.getTime() < this.cur_date.getTime()){
              start_date = this.cur_date;
            }
            check_init_date_classification_stop_date.start_date = start_date;
          }
          if(res.start_time_classification !== undefined){
            start_time_classification = res.start_time_classification;
          }
          check_init_date_classification_stop_date.start_time_classification = start_time_classification;
        }
        if(this.props.modal_type !== "discharge_practice"){
          if(!this.meal_implement_edit){
            check_init_date_classification_stop_date = getEnableInitMeal(stop_serving_date, meal_time_classification_master, true, stop_serving_time_class);
            if(this.props.modal_type === "going_in"){
              let changeMealStatus = getEnableChangeMeal(start_date, meal_time_classification_master);
              let isDisableMealSelected = false;
              if (changeMealStatus != "") {
                let meal_status_array = [];
                meal_status_array = changeMealStatus.split(":");
                if (meal_status_array.includes(start_time_classification.toString())) {
                  isDisableMealSelected = true;
                }
              }
              this.can_edit_meal_info = !isDisableMealSelected;
            } else {
              check_init_date_classification_start_date = getEnableInitMeal(start_date, meal_time_classification_master, true, start_time_classification);
            }
          }
        }
        this.setState({
          cur_date,
          meal_time_classification_master,
          going_out_master,
          move_history:res.move_history,
          stop_serving_date:check_init_date_classification_stop_date.start_date != null ? check_init_date_classification_stop_date.start_date : stop_serving_date,
          stop_serving_time_class: check_init_date_classification_stop_date.start_time_classification != null ? check_init_date_classification_stop_date.start_time_classification : stop_serving_time_class,
          start_date:check_init_date_classification_start_date.start_date != null ? check_init_date_classification_start_date.start_date : start_date,
          start_time_classification: check_init_date_classification_start_date.start_time_classification != null ? check_init_date_classification_start_date.start_time_classification : start_time_classification,
          load_flag:true,
        });
      })
      .catch(() => {
      });
  };

  getDateStr=(value = null)=>{
    let search_date = value;
    if(value == null){
      // search_date = formatDateTimeIE(this.props.patient_info.date_and_time_of_hospitalization);
      search_date = new Date();
    }
    if(search_date instanceof Date) {
      let y = search_date.getFullYear();
      let m = ("00" + (search_date.getMonth() + 1)).slice(-2);
      let d = ("00" + search_date.getDate()).slice(-2);
      let h = ("00" + search_date.getHours()).slice(-2);
      let min = ("00" + search_date.getMinutes()).slice(-2);
      let result = y + "/" + m + "/" + d + " " + h + ":" + min;
      return result;
    }
  };

  setDateValue = (key, value) => {
    this.change_flag = 1;
    if(value == null || value == ""){
      value = new Date();
    }
    this.setState({[key]:value});
  };

  setGoingOutId = (e) => {
    this.change_flag = 1;
    this.setState({
      going_out_id:parseInt(e.target.id),
      going_out_name:e.target.value
    });
  };

  setStartTimeClassification = (key, e) => {
    this.change_flag = 1;
    this.setState({[key]:parseInt(e.target.id)});
  };

  handleOk=()=>{
    if(!this.can_register){return;}
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
      this.setState({isOpenSelectDoctor: true});
      return;
    }
    if(this.props.modal_type === "going_out"){
      if(this.state.going_out_id === 0){
        this.setState({alert_messages:"外出泊理由を選択してください。"});
        return;
      }
      if(this.validateDate('start_date') == false){
        return;
      }
      if(this.validateDate('stop_serving_date') == false){
        return;
      }
      if(new Date(formatDateLine(this.state.stop_serving_date)).getTime() > new Date(formatDateLine(this.state.start_date)).getTime()){
        this.setState({alert_messages:"配膳開始日は、配膳停止日以降で選択してください。"});
        return;
      }
      if((new Date(formatDateLine(this.state.stop_serving_date)).getTime() == new Date(formatDateLine(this.state.start_date)).getTime())
        && this.state.stop_serving_time_class == this.state.start_time_classification){
        this.setState({alert_messages:"配膳の停止と再開が重なっています。"});
        return;
      }
    }
    if(this.props.modal_type === "discharge_practice"){
      if(this.validateDate('stop_serving_date') == false){
        return;
      }
    }
    if(this.props.modal_type === "going_in"){
      if(this.validateDate('start_date') == false){
        return;
      }
    }
    if(this.props.modal_type != "discharge_practice" && (this.state.start_date == null || this.state.start_date === "")){
      this.setState({alert_messages:"配膳開始日を選択してください。"});
      return;
    }
    if(this.props.modal_type != "going_in" && (this.state.stop_serving_date == null || this.state.stop_serving_date === "")){
      this.setState({alert_messages:"配膳停止日を選択してください。"});
      return;
    }
    if(this.props.modal_type !== "going_in" && this.state.stop_serving_time_class === 0){
      this.setState({alert_messages:"配膳停止の時間区分を選択してください。"});
      return;
    }
    if(this.props.modal_type !== "discharge_practice" && this.state.start_time_classification === 0){
      this.setState({alert_messages:"配膳開始の時間区分を選択してください。"});
      return;
    }
  
    if(!this.meal_implement_edit && this.can_edit_meal_info){ //「実施直前変更」権限
      // 食事の時間帯に対する時刻設定
      if (this.props.modal_type == "going_out") {
        let isDisableMealSelected_going_in = false;
        let changeMealStatus_goint_in = getEnableChangeMeal(this.state.start_date, this.state.meal_time_classification_master);
        if (changeMealStatus_goint_in != "") {
          let meal_status_array = [];
          meal_status_array = changeMealStatus_goint_in.split(":");
          if (meal_status_array.includes(this.state.start_time_classification.toString())) {
            isDisableMealSelected_going_in = true;
          }
        }
        if (isDisableMealSelected_going_in) {
          let cur_start_date = formatDateLine(this.state.start_date).split('-').join('/');
          let cur_start_time_name = (this.state.meal_time_classification_master.find((x) => x.id == this.state.start_time_classification) != undefined) ?
            this.state.meal_time_classification_master.find((x) => x.id == this.state.start_time_classification).value : "";
          let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
          if(cur_start_time_name == "朝" || cur_start_time_name == "夜"){
            let morning_time = "10:15";
            if (init_status != null && init_status != undefined && init_status.morning_time != undefined && init_status.morning_time != null) {
              morning_time = init_status.morning_time;
            }
            this.setState({alert_messages:"前日の"+morning_time+"を過ぎているため、"+cur_start_date+"の"+cur_start_time_name+"食の有無は変更できません。"});
            return;
          }
          if(cur_start_time_name == "昼"){
            let noon_time = "13:45";
            if (init_status != null && init_status != undefined && init_status.noon_time != undefined && init_status.noon_time != null) {
              noon_time = init_status.noon_time;
            }
            this.setState({alert_messages:"前日の"+noon_time+"を過ぎているため、"+cur_start_date+"の"+cur_start_time_name+"食の有無は変更できません。"});
            return;
          }
          if(cur_start_time_name == "夕"){
            let evening_time = "15:45";
            if (init_status != null && init_status != undefined && init_status.evening_time != undefined && init_status.evening_time != null) {
              evening_time = init_status.evening_time;
            }
            this.setState({alert_messages:"前日の"+evening_time+"を過ぎているため、"+cur_start_date+"の"+cur_start_time_name+"食の有無は変更できません。"});
            return;
          }
        }
        let isDisableMealSelected_discharge = false;
        let changeMealStatus_discharge = getEnableChangeMeal(this.state.stop_serving_date, this.state.meal_time_classification_master);
        if (changeMealStatus_discharge != "") {
          let meal_status_array = [];
          meal_status_array = changeMealStatus_discharge.split(":");
          if (meal_status_array.includes(this.state.stop_serving_time_class.toString())) {
            isDisableMealSelected_discharge = true;
          }
        }
        if (isDisableMealSelected_discharge) {
          let cur_start_date = formatDateLine(this.state.stop_serving_date).split('-').join('/');
          let cur_start_time_name = (this.state.meal_time_classification_master.find((x) => x.id == this.state.stop_serving_time_class) != undefined) ?
            this.state.meal_time_classification_master.find((x) => x.id == this.state.stop_serving_time_class).value : "";
          let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
          if(cur_start_time_name == "朝" || cur_start_time_name == "夜"){
            let morning_time = "10:15";
            if (init_status != null && init_status != undefined && init_status.morning_time != undefined && init_status.morning_time != null) {
              morning_time = init_status.morning_time;
            }
            this.setState({alert_messages:"前日の"+morning_time+"を過ぎているため、"+cur_start_date+"の"+cur_start_time_name+"食の有無は変更できません。"});
            return;
          }
          if(cur_start_time_name == "昼"){
            let noon_time = "13:45";
            if (init_status != null && init_status != undefined && init_status.noon_time != undefined && init_status.noon_time != null) {
              noon_time = init_status.noon_time;
            }
            this.setState({alert_messages:"前日の"+noon_time+"を過ぎているため、"+cur_start_date+"の"+cur_start_time_name+"食の有無は変更できません。"});
            return;
          }
          if(cur_start_time_name == "夕"){
            let evening_time = "15:45";
            if (init_status != null && init_status != undefined && init_status.evening_time != undefined && init_status.evening_time != null) {
              evening_time = init_status.evening_time;
            }
            this.setState({alert_messages:"前日の"+evening_time+"を過ぎているため、"+cur_start_date+"の"+cur_start_time_name+"食の有無は変更できません。"});
            return;
          }
        }
      }
      if (this.props.modal_type == "going_in") {
        let isDisableMealSelected_going_in = false;
        let changeMealStatus_goint_in = getEnableChangeMeal(this.state.start_date, this.state.meal_time_classification_master);
        if (changeMealStatus_goint_in != "") {
          let meal_status_array = [];
          meal_status_array = changeMealStatus_goint_in.split(":");
          if (meal_status_array.includes(this.state.start_time_classification.toString())) {
            isDisableMealSelected_going_in = true;
          }
        }
        if (isDisableMealSelected_going_in) {
          let cur_start_date = formatDateLine(this.state.start_date).split('-').join('/');
          let cur_start_time_name = (this.state.meal_time_classification_master.find((x) => x.id == this.state.start_time_classification) != undefined) ?
            this.state.meal_time_classification_master.find((x) => x.id == this.state.start_time_classification).value : "";
          let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
          if(cur_start_time_name == "朝" || cur_start_time_name == "夜"){
            let morning_time = "10:15";
            if (init_status != null && init_status != undefined && init_status.morning_time != undefined && init_status.morning_time != null) {
              morning_time = init_status.morning_time;
            }
            this.setState({alert_messages:"前日の"+morning_time+"を過ぎているため、"+cur_start_date+"の"+cur_start_time_name+"食の有無は変更できません。"});
            return;
          }
          if(cur_start_time_name == "昼"){
            let noon_time = "13:45";
            if (init_status != null && init_status != undefined && init_status.noon_time != undefined && init_status.noon_time != null) {
              noon_time = init_status.noon_time;
            }
            this.setState({alert_messages:"前日の"+noon_time+"を過ぎているため、"+cur_start_date+"の"+cur_start_time_name+"食の有無は変更できません。"});
            return;
          }
          if(cur_start_time_name == "夕"){
            let evening_time = "15:45";
            if (init_status != null && init_status != undefined && init_status.evening_time != undefined && init_status.evening_time != null) {
              evening_time = init_status.evening_time;
            }
            this.setState({alert_messages:"前日の"+evening_time+"を過ぎているため、"+cur_start_date+"の"+cur_start_time_name+"食の有無は変更できません。"});
            return;
          }
        }
      }
    }
    let confirm_message = "";
    let confirm_alert_title = "";
    if(this.props.modal_type === "discharge_practice"){
      if(this.IsExistNotDoneOrder == 1){
        confirm_alert_title = '注意';
        confirm_message = "未実施のオーダーがあります。\nこのまま退院を実施しますか？";
      } else {
        confirm_message = "退院情報を登録しますか？"
      }
    }
    if(this.props.modal_type === "going_out"){
      confirm_message = "外出情報を登録しますか？"
    }
    if(this.props.modal_type === "going_in"){
      confirm_message = "帰院情報を登録しますか？"
    }
    this.setState({
      confirm_message,
      confirm_alert_title
    });
  };

  confirmCancel=()=>{
    this.setState({
      alert_messages:"",
      confirm_message:"",
      confirm_alert_title:"",
      isOpenSelectDoctor:false,
    });
  };

  confirmOk=async()=>{
    let path = "";
    let post_data = {};
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    post_data['doctor_code'] = authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code;
    post_data['doctor_name'] = authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name;
    if(this.props.modal_type === "discharge_practice"){
      path = "/app/api/v2/ward/do/discharge";
      post_data.hos_number = this.props.patient_info.hos_number;
      post_data.hos_detail_id = this.props.patient_info.id;
      post_data.patient_id = this.props.patient_info.patient_id;
      post_data.moving_day = formatDateLine(this.state.cur_date)+' '+formatTimeIE(this.state.cur_date);
      post_data.start_date = formatDateLine(this.state.stop_serving_date);
      post_data.start_time_classification = this.state.stop_serving_time_class;
      post_data.start_time_name = (this.state.meal_time_classification_master.find((x) => x.id == this.state.stop_serving_time_class) != undefined) ?
        this.state.meal_time_classification_master.find((x) => x.id == this.state.stop_serving_time_class).value : "";
      post_data.department_id = this.props.patient_info.department_id;
    }
    if(this.props.modal_type === "going_out"){
      path = "/app/api/v2/ward/going_out/hospital";
      post_data.hos_number = this.props.patient_info.hos_number;
      post_data.hos_detail_id = this.props.patient_info.id;
      post_data.patient_id = this.props.patient_info.patient_id;
      post_data.going_out_id = this.state.going_out_id; //外出泊理由マスタのID
      post_data.going_out_name = this.state.going_out_name; //外出泊理由マスタのID
      post_data.is_treatment = 0; //治療外泊フラグ
      post_data.stop_serving_date = formatDateLine(this.state.stop_serving_date);
      post_data.stop_serving_time_class = this.state.stop_serving_time_class;
      post_data.stop_serving_time_name = (this.state.meal_time_classification_master.find((x) => x.id == this.state.stop_serving_time_class) != undefined) ?
        this.state.meal_time_classification_master.find((x) => x.id == this.state.stop_serving_time_class).value : "";
      post_data.start_date = formatDateLine(this.state.start_date);
      post_data.start_time_classification = this.state.start_time_classification;
      post_data.start_time_name = (this.state.meal_time_classification_master.find((x) => x.id == this.state.start_time_classification) != undefined) ?
        this.state.meal_time_classification_master.find((x) => x.id == this.state.start_time_classification).value : "";
      post_data.moving_day = formatDateLine(this.state.cur_date)+' '+formatTimeIE(this.state.cur_date);
      post_data.department_id = this.props.patient_info.department_id;
    }
    if(this.props.modal_type === "going_in"){
      path = "/app/api/v2/ward/going_in/hospital";
      post_data.hos_number = this.props.patient_info.hos_number;
      post_data.hos_detail_id = this.props.patient_info.id;
      post_data.patient_id = this.props.patient_info.patient_id;
      post_data.is_treatment = 0; //治療外泊フラグ
      post_data.start_date = formatDateLine(this.state.start_date);
      post_data.start_time_classification = this.state.start_time_classification;
      post_data.start_time_name = (this.state.meal_time_classification_master.find((x) => x.id == this.state.start_time_classification) != undefined) ?
        this.state.meal_time_classification_master.find((x) => x.id == this.state.start_time_classification).value : "";
      post_data.moving_day = formatDateLine(this.state.cur_date)+' '+formatTimeIE(this.state.cur_date);
      post_data.department_id = this.props.patient_info.department_id;
    }
    post_data.is_seal_print = this.is_seal_print;
    if(path !== ""){
      await apiClient
        .post(path, {
          params: post_data
        })
        .then((res) => {
          if(res.alert_message !== undefined){
            if(this.props.modal_type === "discharge_practice"){
              let patientInfo = karteApi.getPatient(this.props.patient_info.patient_id);
              if(patientInfo != undefined && patientInfo != null){
                if(res.is_death != undefined && res.is_death == 1){ //死亡
                  patientInfo.is_death = 1;
                }
                patientInfo.is_hospital = 0;
                patientInfo.karte_status = {code: 0, name: '外来'};
                this.context.$updateKarteStatus(0, "外来", this.props.patient_info.patient_id);
                karteApi.setPatient(this.props.patient_info.patient_id, JSON.stringify(patientInfo));
              }
            }
            this.props.closeModal('register', res.alert_message);
          } else {
            this.setState({alert_messages:res.error_message});
          }
        })
        .catch(() => {

        });
    }
  };

  getDoctor = e => {
    this.selectDoctorFromModal(e.target.id, e.target.getAttribute("label"));
  }

  selectDoctorFromModal = (id, name) => {
    let department_name = "その他";
    this.doctors.map(doctor => {
      if (doctor.doctor_code === parseInt(id)) {
        if (doctor.diagnosis_department_name !== "") {
          department_name = doctor.diagnosis_department_name;
        }
      }
    });
    this.context.$updateDoctor(id, name, department_name);
    this.setState({isOpenSelectDoctor:false}, ()=>{
      this.handleOk();
    })
  }

  validateDate=(key)=>{
    let compare_value = "";
    let key_name = "";
    let date_name = "";
    if(key == "cur_date"){
      compare_value = this.cur_date.getTime();
      key_name = "実施／予定日時";
      date_name = "本日";
    }
    if(key == "start_date"){
      compare_value = formatDateLine(this.state.cur_date);
      compare_value = new Date(compare_value.split('-').join('/')+" 00:00:00").getTime();
      key_name = "配膳開始日";
      date_name = "実施日";
    }
    if(key == "stop_serving_date"){
      compare_value = formatDateLine(this.state.cur_date);
      compare_value = new Date(compare_value.split('-').join('/')+" 00:00:00").getTime();
      key_name = "配膳停止日";
      date_name = "実施日";
    }
    if(this.state[key] == null || (this.state[key] != null && this.state[key].getTime() < compare_value)){
      this.setState({
        confirm_alert_title:"日付エラー",
        alert_messages:key_name+"は"+date_name+"以降の日付を選択してください。"
      });
      return false;
    } else {
      return true;
    }
  }
  
  viewDetailInfo=(e, detail, index)=> {
    if(detail.change_responsibility === undefined && detail.go_out_info === undefined){return;}
    e.preventDefault();
    // eslint-disable-next-line consistent-this
    const that = this;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({ hoverMenu: { visible: false } });
      document.removeEventListener(`click`, onClickOutside);
    });
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({
        hoverMenu: { visible: false }
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    document
      .getElementById("code-table")
      .addEventListener("scroll", function onScrollOutside() {
        that.setState({
          hoverMenu: { visible: false },
        });
        document
          .getElementById("code-table")
          .removeEventListener(`scroll`, onScrollOutside);
      });
    let clientY = e.clientY;
    let clientX = e.clientX;
    let state_data = {};
    state_data['hoverMenu'] = {
      visible: true,
      x: clientX - 200,
      y: clientY + window.pageYOffset
    };
    if(detail.change_responsibility !== undefined){
      state_data['hoverMenu']['detail_view_info'] = detail.change_responsibility;
      state_data['hoverMenu']['detail_view_info']['view_type'] = "change_responsibility";
    }
    if(detail.go_out_info !== undefined){
      state_data['hoverMenu']['detail_view_info'] = detail.go_out_info;
      state_data['hoverMenu']['detail_view_info']['view_type'] = "go_out_info";
    }
    this.setState(state_data, ()=>{
      let patient_height = document.getElementsByClassName("patient-info")[0].offsetHeight;
      let table_top = document.getElementsByClassName("table-area")[0].offsetTop;
      let tr_top = document.getElementsByClassName("tr-"+index)[0].offsetTop;
      let tr_height = document.getElementsByClassName('tr-'+index)[0].offsetHeight;
      let menu_height = document.getElementsByClassName("hover-menu")[0].offsetHeight;
      state_data['hoverMenu']['y'] = patient_height + tr_top + table_top + tr_height - menu_height;
      let td_width = document.getElementsByClassName('movement_name-'+index)[0].offsetWidth;
      let td_left = document.getElementsByClassName('movement_name-'+index)[0].offsetLeft;
      state_data['hoverMenu']['x'] = td_width + td_left;
      this.setState(state_data);
    });
  };
  
  closeViewDetailInfo=()=>{
    let hoverMenu = this.state.hoverMenu;
    if(hoverMenu !== undefined && hoverMenu.visible){
      this.setState({
        hoverMenu: {
          visible: false,
        }
      });
    }
  };

  render() {
    // 食事の時間帯に対する時刻設定
    let changeMealStatus_goint_in = "";
    let changeMealStatus_discharge = "";
    if(!this.meal_implement_edit) {  //「実施直前変更」権限
      if (this.props.modal_type == "going_out") {
        changeMealStatus_goint_in = getEnableChangeMeal(this.state.start_date, this.state.meal_time_classification_master);
        changeMealStatus_discharge = getEnableChangeMeal(this.state.stop_serving_date, this.state.meal_time_classification_master);
      }
      if (this.props.modal_type == "going_in") {
        changeMealStatus_goint_in = getEnableChangeMeal(this.state.start_date, this.state.meal_time_classification_master);
      }
    }
    return (
      <>
        <Modal
          show={true}
          className="custom-modal-sm patient-exam-modal move-hospitalization-modal first-view-modal"
        >
          <Modal.Header><Modal.Title>実施情報入力</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                <div className={'patient-info'}>
                  <div className={'flex select-date'}>
                    <div className={'div-title'}>実施／予定日時</div>
                    {(this.cur_date.getTime() > new Date().getTime()) ? (
                      <OverlayTrigger placement={"top"} overlay={renderTooltip("最新の移動より前の日付は選択できません。")}>
                        <DatePicker
                          locale="ja"
                          id='cur_date_id'
                          selected={this.state.cur_date}
                          onChange={this.setDateValue.bind(this,"cur_date")}
                          dateFormat="yyyy/MM/dd HH:mm"
                          timeCaption="時間"
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={10}
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          minDate={this.cur_date}
                          onBlur={this.validateDate.bind(this, 'cur_date')}                        
                          dayClassName = {date => setDateColorClassName(date)}
                        />
                      </OverlayTrigger>
                    ):(
                      <DatePicker
                        locale="ja"
                        id='cur_date_id'
                        selected={this.state.cur_date}
                        onChange={this.setDateValue.bind(this,"cur_date")}
                        dateFormat="yyyy/MM/dd HH:mm"
                        timeCaption="時間"
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={10}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        minDate={this.cur_date}
                        onBlur={this.validateDate.bind(this, 'cur_date')}
                        dayClassName = {date => setDateColorClassName(date)}
                      />
                    )}
                  </div>
                  {/*<div className={'flex'} style={{paddingTop:"0.5rem"}}>*/}
                  {/*<div className={'div-title'}>変更可能日</div>*/}
                  {/*<div className={'search-date'}>*/}
                  {/*{this.props.modal_type == "discharge_practice" ? this.getDateStr(this.discharge_date) : this.getDateStr()}</div>*/}
                  {/*<div className={'from-to'}>～</div>*/}
                  {/*<div className={'search-date'}>{(this.getDateStr(this.state.cur_date))}</div>*/}
                  {/*</div>*/}
                  <div className={'flex'} style={{paddingTop:"0.5rem"}}>
                    <div className={'div-title'}>オーダー</div>
                    <div className={'search-date'}>
                      {this.props.modal_type === "discharge_practice" ? "退院" : (this.props.modal_type === "going_out" ? "外出・外泊" : "帰院")}
                    </div>
                  </div>
                  {this.props.modal_type === "going_out" && (
                    <div className={'flex'} style={{paddingTop:"0.5rem"}}>
                      <div className={'div-title'}>外出泊理由</div>
                      <div className={'going-out'}>
                        <SelectorWithLabel
                          title=""
                          options={this.state.going_out_master}
                          getSelect={this.setGoingOutId}
                          departmentEditCode={this.state.going_out_id}
                        />
                      </div>
                    </div>
                  )}
                  {this.props.modal_type !== "going_in" && (
                    <div className={'flex'} style={{paddingTop:"0.5rem"}}>
                      <div className={'div-title'}>配膳停止</div>
                      <DatePicker
                        locale="ja"
                        selected={this.state.stop_serving_date}
                        onChange={this.setDateValue.bind(this, 'stop_serving_date')}
                        dateFormat="yyyy/MM/dd"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        minDate={this.state.cur_date}
                        onBlur={this.validateDate.bind(this, 'stop_serving_date')}
                        dayClassName = {date => setDateColorClassName(date)}
                      />
                      <div className={'time-class'}>
                        <SelectorWithLabel
                          title=""
                          options={this.state.meal_time_classification_master}
                          getSelect={this.setStartTimeClassification.bind(this, 'stop_serving_time_class')}
                          departmentEditCode={this.state.stop_serving_time_class}
                          disabledValue={changeMealStatus_discharge}
                        />
                      </div>
                      <div className={'div-title'}>より停止</div>
                    </div>
                  )}
                  {this.props.modal_type !== "discharge_practice" && (
                    <div className={'flex'} style={{paddingTop:"0.5rem"}}>
                      <div className={'div-title'}>配膳開始</div>
                      <DatePicker
                        locale="ja"
                        selected={this.state.start_date}
                        onChange={this.setDateValue.bind(this, 'start_date')}
                        dateFormat="yyyy/MM/dd"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        minDate={this.state.cur_date}
                        onBlur={this.validateDate.bind(this, 'start_date')}
                        disabled={this.can_edit_meal_info === false}
                        dayClassName = {date => setDateColorClassName(date)}
                      />
                      <div className={'time-class'}>
                        <SelectorWithLabel
                          title=""
                          options={this.state.meal_time_classification_master}
                          getSelect={this.setStartTimeClassification.bind(this, 'start_time_classification')}
                          departmentEditCode={this.state.start_time_classification}
                          disabledValue={changeMealStatus_goint_in}
                          isDisabled={this.can_edit_meal_info === false}
                        />
                      </div>
                      <div className={'div-title'}>より開始</div>
                    </div>
                  )}
                  <div style={{paddingTop:"0.5rem"}}>
                    <div className={'flex'}>
                      <div className={'div-title'}> </div>
                      <div className={'div-value'} style={{border:"none", textAlign:"left"}}>移動元</div>
                      <div className={'div-title'}> </div>
                      <div className={'div-value'} style={{border:"none", textAlign:"left"}}>移動先</div>
                    </div>
                    <div className={'flex'} style={{marginTop:"-1px"}}>
                      <div className={'div-title'}>病棟</div>
                      <div className={'div-value'}>{this.props.ward_name == undefined ? this.props.patient_info.ward_name : this.props.ward_name}</div>
                      <div className={'div-title'} style={{textAlign:"center"}}>→</div>
                      <div className={'div-value'}> </div>
                    </div>
                    <div className={'flex'} style={{marginTop:"-1px"}}>
                      <div className={'div-title'}>病室</div>
                      <div className={'div-value'}>{this.props.frame_name == undefined ? this.props.patient_info.room_name : this.props.frame_name}</div>
                      <div className={'div-title'} style={{textAlign:"center"}}>→</div>
                      <div className={'div-value'}> </div>
                    </div>
                    <div className={'flex'} style={{marginTop:"-1px"}}>
                      <div className={'div-title'}>ベッド</div>
                      <div className={'div-value'}>{this.props.bed_name == undefined ? this.props.patient_info.bed_name : this.props.bed_name}</div>
                      <div className={'div-title'} style={{textAlign:"center"}}>→</div>
                      <div className={'div-value'}> </div>
                    </div>
                    <div className={'flex'} style={{marginTop:"-1px"}}>
                      <div className={'div-title'}>診療科</div>
                      <div className={'div-value'}>{this.diagnosis[this.props.patient_info.department_id]}</div>
                      <div className={'div-title'} style={{textAlign:"center"}}>→</div>
                      <div className={'div-value'}> </div>
                    </div>
                    <div className={'flex'} style={{marginTop:"-1px"}}>
                      <div className={'div-title'}>主担当医</div>
                      <div className={'div-value'}>{(this.props.patient_info.doctor_names != null && this.props.patient_info.doctor_names[0] !== undefined) ? this.props.patient_info.doctor_names[0] : ""}</div>
                      <div className={'div-title'} style={{textAlign:"center"}}>→</div>
                      <div className={'div-value'}> </div>
                    </div>
                    {this.props.patient_info.doctor_names != null && (
                      <div className={'flex'} style={{marginTop:"-1px"}}>
                        <div className={'div-title'}>担当医</div>
                        <div className={'div-doctor'}>
                          {Object.keys(this.props.patient_info.doctor_names).map(doctor=>{
                            return (
                              <>
                                <div>{this.props.patient_info.doctor_names[doctor]}</div>
                              </>
                            )
                          })}
                        </div>
                        <div className={'div-title'} style={{textAlign:"center"}}>→</div>
                        <div className={'div-doctor'}> </div>
                      </div>
                    )}
                    <div className={'flex'} style={{marginTop:"-1px"}}>
                      <div className={'div-title'}>担当看護師</div>
                      <div className={'div-value'}>{this.props.patient_info.nurse_name_1 !== undefined ? this.props.patient_info.nurse_name_1 : ""}</div>
                      <div className={'div-title'} style={{textAlign:"center"}}>→</div>
                      <div className={'div-value'}> </div>
                    </div>
                    <div className={'flex'} style={{marginTop:"-1px"}}>
                      <div className={'div-title'}>副担当看護師</div>
                      <div className={'div-value'}>{this.props.patient_info.nurse_name_2 !== undefined ? this.props.patient_info.nurse_name_2 : ""}</div>
                      <div className={'div-title'} style={{textAlign:"center"}}>→</div>
                      <div className={'div-value'}> </div>
                    </div>
                  </div>
                  <div style={{paddingTop:"1rem"}}>当該患者の他移動情報</div>
                </div>
                <div className={'table-area'}>
                  <table className="table-scroll table table-bordered">
                    <thead>
                    <tr>
                      <th style={{width:"3rem"}}>&nbsp;</th>
                      <th style={{width:"3rem"}}>状態</th>
                      <th style={{width:"8rem"}}>実施日</th>
                      <th style={{width:"3rem"}}>時間</th>
                      <th style={{width:"10rem"}}>区分</th>
                      <th style={{width:"4rem"}}>病棟</th>
                      <th style={{width:"4rem"}}>病室</th>
                      <th style={{width:"10rem"}}>ベッド</th>
                      <th>診療科</th>
                    </tr>
                    </thead>
                    <tbody id="code-table">
                    {this.state.load_flag ? (
                      <>
                        {this.state.move_history.length > 0 && (
                          this.state.move_history.map((detail, index)=>{
                            return (
                              <>
                                <tr className={'tr-'+index}>
                                  <td style={{width:"3rem"}} className={'text-right'}>{index+1}</td>
                                  <td style={{width:"3rem"}}>{new Date(detail.moving_day+" "+detail.moving_time+":00").getTime() >= new Date().getTime() ? "未" : "済"}</td>
                                  <td style={{width:"8rem"}}>{detail.moving_day}</td>
                                  <td style={{width:"3rem"}}>{detail.moving_time == "00:00" ? "" : detail.moving_time}</td>
                                  <td
                                    style={{width:"10rem"}} className={'movement_name-'+index}
                                    onMouseOver={e => this.viewDetailInfo(e, detail, index)}
                                    onMouseOut={e => {this.closeViewDetailInfo(e)}}
                                  >{detail.movement_name}</td>
                                  <td style={{width:"4rem"}}>{detail.ward_name}</td>
                                  <td style={{width:"4rem"}}>{detail.room_name}</td>
                                  <td style={{width:"10rem"}}>{detail.bed_name}</td>
                                  <td>{this.diagnosis[detail.department_id]}</td>
                                </tr>
                              </>
                            )
                          })
                        )}
                      </>
                    ):(
                      <tr>
                        <td colSpan={'9'}>
                          <SpinnerWrapper>
                            <Spinner animation="border" variant="secondary" />
                          </SpinnerWrapper>
                        </td>
                      </tr>
                    )}
                    </tbody>
                  </table>
                </div>
              </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className={'cancel-btn'} onClick={this.props.closeModal}>キャンセル</Button>
            <Button tooltip={this.can_register ? '' : '権限がありません。'} className={this.can_register ? 'red-btn' : 'disable-btn'} onClick={this.handleOk}>確定</Button>
          </Modal.Footer>
          <HoverMenu
            {...this.state.hoverMenu}
          />
          {this.state.confirm_message !== "" && (
            <ConfirmNoFocusModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.confirmOk.bind(this)}
              confirmTitle={this.state.confirm_message}
              title={this.state.confirm_alert_title}
            />
          )}
          {this.state.isOpenSelectDoctor && (
            <SelectDoctorModal
              closeDoctor={this.confirmCancel}
              getDoctor={this.getDoctor}
              selectDoctorFromModal={this.selectDoctorFromModal}
              doctors={this.doctors}
            />
          )}
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.confirmCancel.bind(this)}
              handleOk= {this.confirmCancel.bind(this)}
              showMedicineContent= {this.state.alert_messages}
              showTitle= {this.state.confirm_alert_title == "" ? false : true}
              title = {this.state.confirm_alert_title}
            />
          )}
        </Modal>
      </>
    );
  }
}

InputInformationDoHospital.contextType = Context;
InputInformationDoHospital.propTypes = {
  closeModal: PropTypes.func,
  modal_type:PropTypes.string,
  ward_name:PropTypes.string,
  frame_name:PropTypes.string,
  bed_name:PropTypes.string,
  patient_info:PropTypes.array,
};

export default InputInformationDoHospital;
