import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import * as methods from "../../DialMethods";
import Button from "~/components/atoms/Button";
import Checkbox from "~/components/molecules/Checkbox";
import * as apiClient from "~/api/apiClient";
import { makeList_number, makeList_code, sortTimingCodeMaster} from "~/helpers/dialConstants";
import { getTimeZoneList } from "~/components/templates/Dial/DialMethods/getSystemTimeZone";
import Spinner from "react-bootstrap/Spinner";
// import renderHTML from 'react-render-html';
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
// import {PER_PAGE} from "~/helpers/constants";
// import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Pagination from "~/components/molecules/Pagination";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";

const SpinnerWrapper = styled.div`
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  display: block;
  width: 100%;
  height: 100%;
  float: left;
  .no-result {
    padding: 200px;
    text-align: center;
    span {
      padding: 10px;
      border: 2px solid #aaa;
    }
  }
  .div-title {
    border-top: solid 1px gray;
    border-left: solid 1px gray;
    border-bottom: solid 1px gray;
    width: 20rem;
    padding-left:0.2rem;
  }
  .div-value {
    border-top: solid 1px gray;
    border-left: solid 1px gray;
    border-bottom: solid 1px gray;
    padding-left:0.2rem;
    word-break: break-all;
  }
  .right-border {
    border-right: solid 1px gray;
  }
  .history-list {
    width: 100%;
    height:3rem;
    font-size: 1rem;
    margin-bottom:1rem;
    label{
      font-size:1rem;
    }
    table {
      margin-bottom: 0;
      thead{
        display:table;
        width:100%;
      }
      tbody{
          display:block;
          overflow-y: scroll;
          height: 8rem;
          width:100%;
      }
      tr{
          display: table;
          width: 100%;
      }
      tr:nth-child(even) {background-color: #f2f2f2;}
      tr:hover{background-color:#e2e2e2 !important;}
      td {
        word-break: break-all;
          padding: 0.25rem;
      }
      th {
          position: sticky;
          text-align: center;
          padding: 0.3rem;
      }
      .check {
          width: 2rem;
          label {
            margin-right: 0;
          }
      }
      .date {
          width: 10rem;
      }
      .version {
          width: 3rem;
      }
      .w-3 {
        width: 3rem;
      }
      .w-5 {
        width: 5rem;
      }
      .name{
        width:20rem;
      }
    }
  }
  .history-content {
    width: 100%;
    height: calc( 84vh - 9rem);
    font-size:1rem;    
    .content-header {
      background: lightblue;
      text-align: left;
      label{
        font-size:1rem;
      }
    }
    .w100{
      width:100%;
      border:1px solid lightgray;
      text-align:left;
    }
    .w50{
      width:50%;      
    }
    .deleted-order .row{
      background-position: 0px 50%;
      color: black;
      text-decoration: none;
      background-image: linear-gradient(rgb(0,0,0), rgb(0,0,0));
      background-repeat: repeat-x;
      background-size: 100% 1px;
    }
    .content-body {
      overflow-y: scroll;
      height: 100%;
      border: solid 1px lightgray;
      .blue-div {
        color: blue;
      }
      .deleted {
        background-position: 0px 50%;
        color: black;
        text-decoration: none;
        background-image: linear-gradient(rgb(0,0,0), rgb(0,0,0));
        background-repeat: repeat-x;
        background-size: 100% 1px;
      }
    }
    .content-title {
      .left-div {
        width: calc(50% - 8.5px);
      }
      .right-div {
        width: calc(50% + 8.5px);
      }
    }
  }
`;


const dilution_timings = {
    0: { id: 0, value: "" },
    1:{ id: 1, value: "前補液" },
    2:  { id: 2, value: "後補液" },
  };
const week_days = ['日', '月','火', '水', '木','金', '土'];

class DialPatternConsentModal extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let dial_common_config = JSON.parse(window.sessionStorage.getItem("init_status")).dial_common_config;
    this.pattern_unit = null;
    this.decimal_info = null;
    if (dial_common_config !== undefined && dial_common_config != null) {
      if (dial_common_config["単位名：透析パターン"] !== undefined) this.pattern_unit = dial_common_config["単位名：透析パターン"];
      if (dial_common_config["小数点以下桁数：透析パターン"] !== undefined) this.decimal_info = dial_common_config["小数点以下桁数：透析パターン"];
    }
    this.conditions = [
      {title:'曜日', key:'day_int'},
      {title:'時間帯', key:'time_zone'},
      {title:'ベッドNo', key:'bed_no'},
      {title:'コンソール', key:'console'},
      {title:'透析時間', key:'reservation_time'},
      {title:'開始予定時刻', key:'scheduled_start_time'},
      {title:'終了予定時刻', key:'scheduled_end_time'},
      {title:'グループ', key:'group'},
      {title:'グループ2', key:'group2'},
      {title:'DW', key:'dw'},
      {title:'治療法', key:'dial_method'},
      {title:'血流量', key:'blood_flow'},
      {title:'透析液流量', key:'dialysate_amount'},
      {title:'透析液温度', key:'degree'},
      {title:'透析液', key:'dial_liquid'},
      {title:'前補液/後補液の選択', key:'dilution_timing'},
      {title:'補液速度', key:'fluid_speed'},
      {title:'補液量', key:'fluid_amount'},
      {title:'補液温度', key:'fluid_temperature'},
      {title:'I-HDF 補液開始時間', key:'hdf_init_time'},
      {title:'I-HDF 1回補液量', key:'hdf_init_amount'},
      {title:'I-HDF 補液間隔', key:'hdf_step'},
      {title:'I-HDF 1回補液速度', key:'hdf_speed'},
      {title:'最大除水量', key:'max_drainage_amount'},
      {title:'最大除水速度', key:'max_drainage_speed'},
      {title:'穿刺針A', key:'puncture_needle_a'},
      {title:'穿刺針V', key:'puncture_needle_v'},
      {title:'固定テープ', key:'fixed_tape'},
      {title:'消毒液', key:'disinfection_liquid'},
      {title:'補液', key:'fluid'},
      {title:'補食', key:'supplementary_food'},
      {title:'風袋', key:'windbag_1'},
      {title:'風袋2', key:'windbag_2'},
      {title:'風袋3', key:'windbag_3'},
      {title:'備考', key:'list_note'},
    ];
    var patientInfo = this.props.patientInfo;
    this.state ={
      is_loaded : false,
      patientInfo:patientInfo !== undefined && patientInfo != null ? patientInfo : undefined,
      current_page: 1,
      display_number: 1,
      checked_list: [],
      table_data:[],
      confirm_message: "",
      alert_messages: "",
      alert_action: "",
      pageOfItems:null,
      all_check: 0
    }
  }

  async componentDidMount(){
    let bed_master = sessApi.getObjectValue("dial_common_master", "bed_master");
    let console_master = sessApi.getObjectValue("dial_common_master", "console_master");
    let dial_method_master = sessApi.getObjectValue("dial_common_master", "dial_method_master");
    let code_master = sessApi.getObjectValue("dial_common_master","code_master");
    let material_master = sessApi.getObjectValue("dial_common_master","material_master");
    let time_zones = getTimeZoneList();
    let examinationCodeData = sessApi.getObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER,"examination_master");
    var timingCodeData = sortTimingCodeMaster(code_master["実施タイミング"]);
    this.setState({
      time_zones: time_zones != undefined ? time_zones : [],
      bed_master,
      bed_master_number_list: makeList_number((bed_master)),
      console_master,
      console_master_code_list: makeList_code(console_master),
      dial_method_master,
      dial_method_master_code_list: makeList_code(dial_method_master),
      timingCodeData,      
      examination_codes: makeList_code(examinationCodeData),
      dial_group_codes: makeList_code(code_master["グループ"]),
      dial_group_codes2: makeList_code(code_master["グループ2"]),
      puncture_needle_a: makeList_code(material_master["穿刺針"], 1),
      puncture_needle_v: makeList_code(material_master["穿刺針"], 1),
      dialysates: makeList_code(material_master["透析液"], 1),
      disinfection_liquid: makeList_code(material_master["消毒薬"], 1),
      fixed_tape: makeList_code(material_master["固定テープ"], 1),
      examinationCodeData,
      
    });
    await this.getDoctors();
    await this.getStaffs();
    await this.getNotConsentedList();
  }

  getNotConsentedList = async(_flag = null) => {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let params = {
      instruction_doctor_number: authInfo.doctor_number,
    }
    if (this.state.patientInfo !== undefined && this.state.patientInfo.system_patient_id !== undefined) {
      params.system_patient_id = this.state.patientInfo.system_patient_id;
    }
    let path = "/app/api/v2/dial/pattern/get_dialpattern_consent_list";
    await apiClient._post(path, params)
    .then(res => {
      if (res) {
        this.setState({
          table_data: res,
          is_loaded: true
        });
      } else {
        this.setState({
          table_data:[],
          is_loaded: true,
        })
      }
    })
    .catch(()=> {
       this.setState({
          table_data:[],
          is_loaded: true,
       })
    });
  }

  onChangePage(pageOfItems, pager) {
    this.setState({ pageOfItems: pageOfItems, current_page: pager.currentPage });
  }

  checkAllRadio = (name, value) => {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (name == "all_check") {
      let {table_data} = this.state;
      if (table_data.length == 0) return;
      table_data.map(item=>{
        if (item.is_doctor_consented == 0 && item.instruction_doctor_number == authInfo.doctor_number) item.is_checked = value;
        if (item.history_data != null){
          item.history_data.map(history_item => {
            if (history_item.is_doctor_consented == 0 && history_item.instruction_doctor_number == authInfo.doctor_number) history_item.is_checked = value;
          })
        }
      })
      this.setState({all_check: value, table_data});
    }
  }

  getRadio = (index, name, number) => {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));    
    if (name === "check") {
      var all_check = true;
      let {table_data, pageOfItems} = this.state;
      var findIndex = '';
      findIndex = table_data.findIndex(x=>x.number == number);      
      if (findIndex > -1) {        
        table_data[findIndex].is_checked = table_data[findIndex].is_checked == 1 ? 0 : 1;
      }
      if (pageOfItems[index].history_data != null){
        findIndex = pageOfItems[index].history_data.findIndex(x=>x.number == number);
        if (findIndex > -1) {
            pageOfItems[index].history_data[findIndex].is_checked = pageOfItems[index].history_data[findIndex].is_checked == 1 ? 0 : 1;
        }  
      }
      
      table_data.map(item => {
        if (item.is_doctor_consented == 0 && item.instruction_doctor_number == authInfo.doctor_number) {
          if (item.is_checked != true) {            
            all_check = false;
          }
        }
        if (item.history_data != null){
          item.history_data.map(history_item => {
            if (history_item.is_doctor_consented == 0 && history_item.instruction_doctor_number == authInfo.doctor_number) {
              if (history_item.is_checked != true) {                
                all_check = false;
              }
            }
          })
        }
      })
      this.setState({
        table_data,
        all_check
      });
    }
  };

  existCheck = () => {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let {table_data} = this.state;
    if (table_data === undefined || table_data.length == 0) return false;
    let findIndex = table_data.findIndex(x=>x.is_checked == 1 && x.is_doctor_consented == 0 && x.instruction_doctor_number == authInfo.doctor_number);
    if (findIndex > -1) return true;
    var res = false;
    table_data.map(item => {
      if (item.history_data != null){
        findIndex = item.history_data.findIndex(x=>x.is_checked == 1 && x.is_doctor_consented == 0 && x.instruction_doctor_number == authInfo.doctor_number);
        if (findIndex > -1) res = true;
      }
    })
    return res;
  };

  confirmCancel = () => {
    this.setState({
      confirm_message: "",
      confirm_action: "",
      alert_messages: "",
      alert_action: "",
      confirm_title: ""
    });
    if (this.state.alert_action == "close") {
      this.props.closeModal();
    }
  }

  openConfirmModal = () => {
    if (!this.existCheck()) return;
    this.setState({
      confirm_message: "チェックを入れている項目を承認しますか？",
      confirm_title: "承認確認",
      confirm_action: "register"
    });
    this.modalBlack();
  }

  confirmOk = () => {
    this.confirmCancel();
    if (this.state.confirm_action == "register") {
      this.register();
    } else if (this.state.confirm_action == "cancel") {
      this.props.closeModal();
    }
  }

  closeModal = () => {
    if (this.existCheck()) {
      this.setState({
        confirm_message: "チェックを入れている項目がありますが、破棄して画面を閉じますか？",
        confirm_title: "注意",
        confirm_action: "cancel"
      });
      this.modalBlack();
      return;
    }
    this.props.closeModal();
  };

  register = async () => {
    let post_data = {};
    this.state.table_data.map(item=> {
      if(item.is_checked == 1) {
        let system_patient_id = item.system_patient_id;
        if (post_data[system_patient_id] !== undefined) {
          post_data[system_patient_id].push(item.number)
        } else {
          post_data[system_patient_id] = [item.number];
        }
      }
      if (item.history_data != null){
        item.history_data.map(history_item => {
          if (history_item.is_checked == 1){
            let system_patient_id = history_item.system_patient_id;
            if (post_data[system_patient_id] !== undefined) {
              post_data[system_patient_id].push(history_item.number)
            } else {
              post_data[system_patient_id] = [history_item.number];
            }
          }
        })
      }
    });
    let path = "/app/api/v2/dial/pattern/consent_dialpattern";
    await apiClient._post(path, {params: post_data}).then(()=>{
      this.setState({
        alert_messages: "承認しました。",
        alert_action: "close"
      });
      this.modalBlack();
    })
  }

  getCheckCount = () => {
    let count = 0;
    var table_data = this.state.table_data;
    if (table_data == undefined || table_data == null || table_data.length == 0) return count;
    table_data.map(item=> {
      if(item.is_checked == 1) count++;
      if (item.history_data != null){
        item.history_data.map(history_item => {
          if (history_item.is_checked == 1 && history_item.number != item.number) count++;
        })
      }
    });
    return count;
  }
  getCurrentCheckCount = () => {
    let count = 0;
    if (this.state.pageOfItems === undefined || this.state.pageOfItems == null || this.state.pageOfItems.length === 0) return "";
    this.state.pageOfItems.map(item=> {
      if(item.is_checked == 1) count++;
      if (item.history_data != null){
        item.history_data.map(history_item => {
          if (history_item.is_checked == 1 && history_item.number != item.number) count++;
        })
      }
    });
    return count;
  }
  modalBlack = () => {
    let base_modal = document.getElementsByClassName("dial_condition_detail_modal")[0];
    if(base_modal !== undefined && base_modal != null){
      base_modal.style['z-index'] = 1040;
    }
  }

  onHide () {}

  render() {
    let {time_zones, bed_master_number_list, console_master_code_list, dial_group_codes, dial_group_codes2, dial_method_master_code_list, puncture_needle_a,
      puncture_needle_v, fixed_tape, disinfection_liquid, dialysates, pageOfItems, table_data, doctor_list_by_number, staff_list_by_number} = this.state;
    let pattern_unit = this.pattern_unit;
    var exist_check = this.existCheck();
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    return (
      <Modal show={true} onHide={this.onHide} className="master-modal dial_condition_detail_modal first-view-modal">
        <Modal.Header>
          <Modal.Title>透析パターン承認</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {this.state.is_loaded ? (
          <Wrapper>
            <div className="history-list">
              {this.state.patientInfo !== undefined && this.state.patientInfo.system_patient_id !== undefined && (
                <div className="patient-info">{this.state.patientInfo.patient_number}：{this.state.patientInfo.patient_name}</div>
              )}
              <div className="d-flex">
                <Checkbox
                  ref={ref => (this.selectAll = ref)}
                  label="ページ内の全件を選択"
                  getRadio={this.checkAllRadio.bind(this)}
                  value={this.state.all_check}
                  name="all_check"
                />
                <div className="ml-2">承認予定：{this.getCheckCount()}</div>
                <div className="ml-2">現ページ：{this.state.current_page}/{this.state.display_number}件　承認予定{this.getCurrentCheckCount()}件</div>
              </div>
            </div>
            <div className="history-content">
              <div className="content-body">
              {pageOfItems != null && pageOfItems.length > 0 &&
                pageOfItems.map((item, main_index) => {
                  var history_data = item.history_data != null?item.history_data:[item];
                  var first_item = history_data[history_data.length-1];
                  return(
                    <>
                    <div className="content-header pl-1">                      
                      {(this.state.patientInfo === undefined || this.state.patientInfo.system_patient_id === undefined) && (
                        <span className="mr-3">{item.patient_number}：{item.patient_name}</span>
                      )}
                      <span className="mr-3">初版登録：{item.created_at.split('-').join('/')}</span>
                      <span className="mr-3">初版依頼医：{first_item.instruction_doctor_number > 0 && doctor_list_by_number[first_item.instruction_doctor_number] !== undefined ? doctor_list_by_number[first_item.instruction_doctor_number] : ""}</span>
                    </div>
                    <div className='' style={{marginBottom:'1.5rem'}}>
                      {history_data != undefined && history_data != null && history_data.length > 0 && doctor_list_by_number != undefined && staff_list_by_number != undefined && (
                        history_data.map((history_item, history_index) => {
                          var prev_data = history_data[history_index + 1];
                          history_index = history_data.length - history_index;
                          var pattern_data = history_item.pattern;
                          if (Array.isArray(pattern_data)) {
                            var pattern_data_obejct = {};
                            pattern_data.map(pattern_item => {
                              if (pattern_item.time_zone != '') pattern_data_obejct[pattern_item.day_int] = pattern_item;
                            })
                            pattern_data = pattern_data_obejct;
                          }
                          if (history_item.is_doctor_consented == 0 && history_item.instruction_doctor_number == authInfo.doctor_number){
                            return(
                              <>
                              <div className="content-header pl-1">
                                <Checkbox
                                  label="選択"
                                  number={history_item.number}
                                  getRadio={this.getRadio.bind(this, main_index)}
                                  value={history_item.is_checked}
                                  name={"check"}
                                />
                                <span className="mr-3">{history_index == 1 ? "初版" : parseInt(history_index).toString() + "版"}</span>
                                <span className="mr-3">{history_index == 1 ? "新規" : "修正"}</span>                            
                                <span className="mr-3">{history_item.updated_at.split('-').join('/')}</span>
                                <span className="mr-3">
                                  {doctor_list_by_number[history_item.instruction_doctor_number]}
                                  {history_item.updated_by != null && staff_list_by_number[history_item.updated_by]!= doctor_list_by_number[history_item.instruction_doctor_number] && ("、 入力者: " + staff_list_by_number[history_item.updated_by])}
                                </span>
                              </div>

                              <div className={history_index == 1?'blue-div':''}>
                                {this.conditions.map(cond_item=>{
                                  return (
                                    <>
                                    <div className="div-row d-flex">
                                      <div className='div-title'>
                                      {cond_item.title} {pattern_unit[cond_item.key] != undefined && pattern_unit[cond_item.key] != null && pattern_unit[cond_item.key] != '' ? "（" + pattern_unit[cond_item.key]["value"] + "）" : ""  }
                                      </div>
                                      {pattern_data != undefined && pattern_data != null && Object.keys(pattern_data).length > 0 && Object.keys(pattern_data).map((pattern_key, index)=>{
                                        var item = pattern_data[pattern_key];
                                        let div_width = 80/Object.keys(pattern_data).length +"rem";
                                        var new_added_weekday = false;
                                        var prev_item = undefined;
                                        if (prev_data != undefined && prev_data.pattern != undefined && prev_data.pattern != null){
                                          if (prev_data.pattern[pattern_key] == undefined) {
                                            new_added_weekday = true;
                                          } else {
                                            prev_item = prev_data.pattern[pattern_key][cond_item.key];
                                          }
                                        }
                                        return (
                                          <>
                                          <div className={((index == pattern_data.length - 1) ? "div-value right-border" : "div-value") + (new_added_weekday?' blue-div':'')} style={{width:div_width}}>
                                            <div className={(prev_item == undefined || prev_item != item[cond_item.key])?'blue-div':''}>
                                              {item[cond_item.key] != undefined && item[cond_item.key] != null && item[cond_item.key] != '' && (
                                                <>
                                                  {cond_item.key == 'day_int' && week_days[item[cond_item.key]] != undefined ? week_days[item[cond_item.key]] : '' }
                                                  {cond_item.key == 'time_zone' && time_zones[item[cond_item.key]] != undefined ? time_zones[item[cond_item.key]]['value'] : '' }
                                                  {cond_item.key == 'bed_no' && bed_master_number_list[item[cond_item.key]] != undefined ? bed_master_number_list[item[cond_item.key]] : '' }
                                                  {cond_item.key == 'console' && console_master_code_list[item[cond_item.key]] != undefined ? console_master_code_list[item[cond_item.key]] : '' }
                                                  {cond_item.key == 'group' && dial_group_codes[item[cond_item.key]] != undefined ? dial_group_codes[item[cond_item.key]]: '' }
                                                  {cond_item.key == 'group2' && dial_group_codes2[item[cond_item.key]] != undefined ? dial_group_codes2[item[cond_item.key]] : '' }
                                                  {cond_item.key == 'dial_method' && dial_method_master_code_list[item[cond_item.key]] != undefined ? dial_method_master_code_list[item[cond_item.key]] : '' }
                                                  {cond_item.key == 'dial_liquid' && dialysates[item[cond_item.key]] != undefined ? dialysates[item[cond_item.key]] : '' }
                                                  {cond_item.key == 'dilution_timing' && dilution_timings[item[cond_item.key]] != undefined ? dilution_timings[item[cond_item.key]]['value'] : '' }
                                                  {cond_item.key == 'puncture_needle_a' && puncture_needle_a[item[cond_item.key]] != undefined ? puncture_needle_a[item[cond_item.key]] : '' }
                                                  {cond_item.key == 'puncture_needle_v' && puncture_needle_v[item[cond_item.key]] != undefined ? puncture_needle_v[item[cond_item.key]] : '' }
                                                  {cond_item.key == 'fixed_tape' && fixed_tape[item[cond_item.key]] != undefined ? fixed_tape[item[cond_item.key]] : '' }
                                                  {cond_item.key == 'disinfection_liquid' && disinfection_liquid[item[cond_item.key]] != undefined ? disinfection_liquid[item[cond_item.key]] : '' }
                                                  {cond_item.key != 'day_int' && cond_item.key != 'time_zone' && cond_item.key != 'bed_no' && cond_item.key != 'console' && cond_item.key != 'group' && cond_item.key != 'group2' && 
                                                    cond_item.key != 'dial_method' && cond_item.key != 'dilution_timing' && cond_item.key != 'puncture_needle_a' && cond_item.key != 'puncture_needle_v' && cond_item.key != 'dial_liquid' &&
                                                    cond_item.key != 'fixed_tape' && cond_item.key != 'disinfection_liquid' ? item[cond_item.key] : ''}
                                                </>
                                              )}
                                              {item[cond_item.key] === 0 && cond_item.key == 'day_int' && (
                                                <>
                                                {week_days[item[cond_item.key]] != undefined ? week_days[item[cond_item.key]] : '' }
                                                </>
                                              )}
                                            </div>
                                            {prev_item != undefined && prev_item != item[cond_item.key] && (
                                              <del>
                                                {prev_item != undefined && prev_item != null && prev_item != '' && (
                                                <>
                                                  {cond_item.key == 'day_int' && week_days[prev_item] != undefined ? week_days[prev_item] : '' }
                                                  {cond_item.key == 'time_zone' && time_zones[prev_item] != undefined ? time_zones[prev_item]['value'] : '' }
                                                  {cond_item.key == 'bed_no' && bed_master_number_list[prev_item] != undefined ? bed_master_number_list[prev_item] : '' }
                                                  {cond_item.key == 'console' && console_master_code_list[prev_item] != undefined ? console_master_code_list[prev_item] : '' }
                                                  {cond_item.key == 'group' && dial_group_codes[prev_item] != undefined ? dial_group_codes[prev_item]: '' }
                                                  {cond_item.key == 'group2' && dial_group_codes2[prev_item] != undefined ? dial_group_codes2[prev_item] : '' }
                                                  {cond_item.key == 'dial_method' && dial_method_master_code_list[prev_item] != undefined ? dial_method_master_code_list[prev_item] : '' }
                                                  {cond_item.key == 'dial_liquid' && dialysates[prev_item] != undefined ? dialysates[prev_item] : '' }
                                                  {cond_item.key == 'dilution_timing' && dilution_timings[prev_item] != undefined ? dilution_timings[prev_item]['value'] : '' }
                                                  {cond_item.key == 'puncture_needle_a' && puncture_needle_a[prev_item] != undefined ? puncture_needle_a[prev_item] : '' }
                                                  {cond_item.key == 'puncture_needle_v' && puncture_needle_v[prev_item] != undefined ? puncture_needle_v[prev_item] : '' }
                                                  {cond_item.key == 'fixed_tape' && fixed_tape[prev_item] != undefined ? fixed_tape[prev_item] : '' }
                                                  {cond_item.key == 'disinfection_liquid' && disinfection_liquid[prev_item] != undefined ? disinfection_liquid[prev_item] : '' }
                                                  {cond_item.key != 'day_int' && cond_item.key != 'time_zone' && cond_item.key != 'bed_no' && cond_item.key != 'console' && cond_item.key != 'group' && cond_item.key != 'group2' && 
                                                    cond_item.key != 'dial_method' && cond_item.key != 'dilution_timing' && cond_item.key != 'puncture_needle_a' && cond_item.key != 'puncture_needle_v' && cond_item.key != 'dial_liquid' &&
                                                    cond_item.key != 'fixed_tape' && cond_item.key != 'disinfection_liquid' ? prev_item : ''}
                                                </>
                                                )}
                                                {prev_item === 0 && cond_item.key == 'day_int' && (
                                                  <>
                                                  {week_days[prev_item] != undefined ? week_days[prev_item] : '' }
                                                  </>
                                                )}
                                              </del>
                                            )}
                                          </div>
                                          </>
                                        )
                                      })}
                                    </div>
                                    </>
                                  )
                                })}
                              </div>
                              <div className={'div-value'}>
                                <div className={(history_index == 1 || (prev_data != undefined && (history_item.time_limit_to != prev_data.time_limit_to || history_item.time_limit_from != prev_data.time_limit_from)))?'blue-div':''}>
                                  {history_item.time_limit_from}～{history_item.time_limit_to != null?history_item.time_limit_to:'無期限'}
                                </div>
                                {prev_data != undefined && (history_item.time_limit_to != prev_data.time_limit_to || history_item.time_limit_from != prev_data.time_limit_from) && (
                                  <>
                                  <del>{prev_data.time_limit_from}～{prev_data.time_limit_to != null?prev_data.time_limit_to:'無期限'}</del>
                                  </>
                                )}
                              </div>
                              </>
                            )
                          }
                        })
                      )}
                    </div>
                    </>
                  )

                })
              }
              </div>
            </div>
            <Pagination
              items={table_data}
              onChangePage={this.onChangePage.bind(this)}
              pageSize={parseInt(this.state.display_number)}
            />
          </Wrapper>
        ) : (
          <SpinnerWrapper>
            <Spinner animation="border" variant="secondary" />
          </SpinnerWrapper>
        )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.closeModal} className="cancel-btn">キャンセル</Button>
          <Button onClick={this.openConfirmModal} className={exist_check?"red-btn":"disable-btn"}>承認</Button>
        </Modal.Footer>
        {this.state.confirm_message !== "" && (
          <ConfirmNoFocusModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.confirmOk.bind(this)}
            confirmTitle={this.state.confirm_message}
          />
        )}
        {this.state.alert_messages !== "" && (
          <AlertNoFocusModal
            hideModal= {this.confirmCancel.bind(this)}
            handleOk= {this.confirmCancel.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
      </Modal>
    )

  }

}
DialPatternConsentModal.contextType = Context;

DialPatternConsentModal.propTypes = {  
  closeModal: PropTypes.func,
  patientInfo:PropTypes.object,
};

export default DialPatternConsentModal;