import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
// import * as apiClient from "~/api/apiClient";
import * as methods from "~/components/templates/Dial/DialMethods";
import {
  makeList_number,
  makeList_code,  
  sortTimingCodeMaster,
} from "~/helpers/dialConstants";
import * as sessApi from "~/helpers/cacheSession-utils";
import { getTimeZoneList } from "~/components/templates/Dial/DialMethods/getSystemTimeZone";
import { CACHE_SESSIONNAMES } from "~/helpers/constants";
import Checkbox from "~/components/molecules/Checkbox";

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
    height:10rem;
    font-size: 1rem;
    margin-bottom:1rem;
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
    height: calc( 84vh - 12rem);
    font-size:1rem;    
    .content-header {
      background: lightblue;
      text-align: left;
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

class DialPatternHistoryModal extends Component {
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
    this.state ={}
  }

  async componentDidMount() {    
    let bed_master = sessApi.getObjectValue("dial_common_master", "bed_master");
    let console_master = sessApi.getObjectValue("dial_common_master", "console_master");
    let dial_method_master = sessApi.getObjectValue("dial_common_master", "dial_method_master");
    let code_master = sessApi.getObjectValue("dial_common_master","code_master");
    let material_master = sessApi.getObjectValue("dial_common_master","material_master");
    let time_zones = getTimeZoneList();
    let examinationCodeData = sessApi.getObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER,"examination_master");
    var timingCodeData = sortTimingCodeMaster(code_master["実施タイミング"]);

    var selected_history_item = this.props.selected_history_item;
    var history_list = selected_history_item.history_data != null?selected_history_item.history_data:[selected_history_item];
    history_list.map((item, index) => {
      item.enable_show = true;
      let prev = undefined;
      if(index < history_list.length -1){
        prev = history_list[index + 1];
      }
      item.prev = prev;
    })
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

      history_list,
    });
    await this.getDoctors();
    await this.getStaffs();
  }

  onHide = () => {};

  getRadio = async (number,name,value) => {
    if (name === "check") {
      let {history_list} = this.state;
      history_list.find(x=>x.number == number).enable_show = value;      
      this.setState({history_list})
    }
  };

  render() {    
    let {time_zones, bed_master_number_list, console_master_code_list, dial_group_codes, dial_group_codes2, dial_method_master_code_list, puncture_needle_a,
      puncture_needle_v, fixed_tape, disinfection_liquid, dialysates,
      history_list, doctor_list_by_number, staff_list_by_number} = this.state;
    let pattern_unit = this.pattern_unit;
    return (
      <Modal show={true} onHide={this.onHide} className="master-modal dial_condition_detail_modal first-view-modal">
        <Modal.Header>
          <Modal.Title>透析パターン変更履歴</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
          <div className="history-list">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th className="check"></th>
                    <th className="version">版数</th>
                    <th className="w-3">進捗</th>
                    <th className="date">変更日時</th>
                    <th className="">変更者</th>
                  </tr>
                </thead>
                <tbody>                  
                  {history_list !== undefined && history_list !== null && history_list.length > 0 &&
                    doctor_list_by_number != undefined && staff_list_by_number != undefined && 
                    history_list.map((item, index) => {
                      index = history_list.length - index;
                      return (
                        <>
                          <tr>
                            <td className="text-center check">
                              <Checkbox
                                label=""
                                getRadio={this.getRadio.bind(this, item.number)}
                                value={item.enable_show}
                                name="check"
                              />
                            </td>
                            <td className="version">{index == 1 ? "初版" : parseInt(index).toString() + "版"}</td>
                            <td className="w-3">{index == 1 ? "新規" : "修正"}</td>
                            <td className="date">{item.updated_at.split('-').join('/')}</td>
                            <td className="text-left">
                              {doctor_list_by_number[item.instruction_doctor_number]}
                              {item.updated_by != null && staff_list_by_number[item.updated_by]!= doctor_list_by_number[item.instruction_doctor_number] && ("、 入力者: " + staff_list_by_number[item.updated_by])}
                            </td>
                          </tr>
                        </>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <div className="history-content">
              <div className="content-body">
              {history_list !== undefined && history_list !== null && history_list.length > 0 &&
                doctor_list_by_number != undefined && staff_list_by_number != undefined && 
                history_list.map((history_item, index) => {
                  index = history_list.length - index;
                  if (history_item.enable_show){
                    var pattern_data = history_item.pattern;
                    if (Array.isArray(pattern_data)) {
                      var pattern_data_obejct = {};
                      pattern_data.map(pattern_item => {
                        if (pattern_item.time_zone != '') pattern_data_obejct[pattern_item.day_int] = pattern_item;
                      })
                      pattern_data = pattern_data_obejct;
                    }
                    return(
                      <>
                      <div className="content-header pl-1">
                        <span className="mr-3">{index == 1 ? "初版" : parseInt(index).toString() + "版"}</span>
                        <span className="mr-3">{index == 1 ? "新規" : "修正"}</span>                            
                        <span className="mr-3">{history_item.updated_at.split('-').join('/')}</span>
                        <span className="mr-3">
                          {doctor_list_by_number[history_item.instruction_doctor_number]}
                          {history_item.updated_by != null && staff_list_by_number[history_item.updated_by]!= doctor_list_by_number[history_item.instruction_doctor_number] && ("、 入力者: " + staff_list_by_number[history_item.updated_by])}
                        </span>
                      </div>

                      <div className={index == 1?'blue-div':''}>
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
                                if (history_item.prev != undefined && history_item.prev.pattern != undefined && history_item.prev.pattern != null){
                                  if (history_item.prev.pattern[pattern_key] == undefined) {
                                    new_added_weekday = true;
                                  } else {
                                    prev_item = history_item.prev.pattern[pattern_key][cond_item.key];
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
                        <div className={(index == 1 || (history_item.prev != undefined && (history_item.time_limit_to != history_item.prev.time_limit_to || history_item.time_limit_from != history_item.prev.time_limit_from)))?'blue-div':''}>
                          {history_item.time_limit_from}～{history_item.time_limit_to != null?history_item.time_limit_to:'無期限'}
                        </div>
                        {history_item.prev != undefined && (history_item.time_limit_to != history_item.prev.time_limit_to || history_item.time_limit_from != history_item.prev.time_limit_from) && (
                          <>
                          <del>{history_item.prev.time_limit_from}～{history_item.prev.time_limit_to != null?history_item.prev.time_limit_to:'無期限'}</del>
                          </>
                        )}
                      </div>
                      </>
                    )
                  }

                })
              }
              </div>
            </div>            
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <div onClick={this.props.closeModal} className="custom-modal-btn cancel-btn" style={{cursor:"pointer"}}>
            <span>閉じる</span>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }
}

DialPatternHistoryModal.contextType = Context;

DialPatternHistoryModal.propTypes = {  
  closeModal: PropTypes.func,
  selected_history_item: PropTypes.array,
};

export default DialPatternHistoryModal;