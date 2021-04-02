import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import DialChart from "./DialChart"
import styled from "styled-components";
import * as apiClient from "~/api/apiClient";
import {formatTimeIE, formatDateTimeIE, formatDateTimeStr} from "../../../../../helpers/date";
import TemperatureModal from "./TemperatureModal";
import DoneGeneralModal from "./DoneGeneralModal"
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as methods from "~/components/templates/Dial/DialMethods";
import * as colors from "~/components/_nano/colors";
import {displayLineBreak} from "~/helpers/dialConstants";
import InputPanel from "./InputPanel";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Spinner from "react-bootstrap/Spinner";
import {makeList_code, removeLeadZeros, sortTimingCodeMaster, compareTwoObjects} from "~/helpers/dialConstants";
import Button from "~/components/atoms/Button";
import {faAlarmClock} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import renderHTML from 'react-render-html';
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";

const Icon = styled(FontAwesomeIcon)`
    font-size: 20px;
    cursor: pointer;
    margin: 0 10px 0 10px;
`;

const PlusIcon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 1rem;
  margin-right: 0.3rem;
  margin-left:1rem;
`;
const Wrapper = styled.div`
 width: 100%;
 display: flex;
 font-size: 1rem;
 .flex {
    display: flex;
 }
 .border {
    border-bottom: solid 1px #eee;
    border-left: solid 1px #eee;
    border-top: solid 1px #eee;
 }
 .xchange-button{
    position: absolute;
    z-index: 1;
    margin-left: 3.2rem;
    top: 4px;
 }
 .small-td{
     font-size:0.8rem;
 }
 td{
  word-break: break-all
 }
 table {
     tr:nth-child(even) {background-color: #f2f2f2;}
      tr:hover{background-color:#e2e2e2 !important;}
 }

 `;
const LeftContent = styled.div`
 width: 75%;
 margin-right: 2px;
 overflow: hidden;
 .chat-image {
    width: 97%;
 }
 .chat-label {
    display: flex;
    padding-right: 0.625rem;
    background: #999;
    color: white;
    border-radius: 0.625rem;
    div {
        margin-right: 7%;
        margin-left: 3%;
    }
    .label {
       padding-left: 0px;
       margin-right: 0px;
       margin-left:1.875rem;
    }
 }
 .star {
    color: red;
    font-size: 1.25rem;
    cursor: pointer;
    margin-left: 39%;
    margin-top: 2.1%;
    position: absolute;
    z-index: 10;
 }

 .dial-chat{
    height: 30vh;
    position: relative;
 }
 
 `;
const RightContent = styled.div`
 width: 25%;
 font-size:1rem;
.current_diseases{
    .disease-content{
        height: 16.5vh;
        min-height: 5rem;
        overflow-y: auto;
    }
}

.top-div {
  margin-top: -1.5rem;
}
.instruction{
    margin-top: 0.5rem;
    .disease-content{
        height: 15.5vh;
        min-height: 5rem;
        overflow-y: auto;
    }
}
.right-table{
    td {
        border:1px solid black;
        padding:0.4rem;
    }
}
.data-label {
    background-color: #ddd;
    width:6rem;
    font-size:0.8rem
}
.right-data-label{
    width:4.3rem;
    background-color: #ddd;
    font-size:0.8rem
}
.button-area {
    button {
      margin-left: 0.2rem;
      margin-bottom: 0.3rem;
      padding: 0.3rem 0.2rem;
      min-width: 5rem;
    }
    span {
      font-size: 0.9rem;
      font-weight: normal;
    }
    .disable-btn {
      background: rgb(101, 114, 117);
    }
  }
  .border-line{
    border-bottom:1px solid cadetblue;
    padding-left:0.25rem;
  }
 `;

const GraphData = styled.div`
    margin-left: 0%;
    overflow-x: auto;
    width: 98%;
    display: flex;
    .title {
        width: 5.5rem;
        text-align: left;
        padding-left:0.2rem;
        font-size:0.8rem;
    }
    .unit {
        width: 4rem;
        font-size: 0.875rem
    }
    .graph-value {
        width: calc(100% - 5.625rem);
    }
    .item {
        width: 5.625rem;
        text-align: center;
    }
    .flex {
        display: flex;
     }
     .fl {
        float: left;
     }
     .w100p {
        width: 100%;
     }
    .inline-flex {
        width:100%;
     }
     table{
        table-layout: fixed;
     }
     td{
         text-align:center;
         border-color:black;
     }
    .row {
        margin-left: 0;
        margin-right: 0;
    }
    .red-div{
        color: red;
    }
    .grey-back { background: #ddd;}
    .moreshow-btn {
        cursor: pointer;
        border: solid 1px grey;
        border-radius: 0.25rem;
        padding: 0.25rem;
        font-size: 1rem;
        width: 2rem;
        height: 2.25rem;
        margin-right: 0.25rem;
        // margin-top: 26.75vh;
    }
 `;

const ContextMenuUl = styled.ul`
  margin-bottom:0;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 77.5rem;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 5.25rem;
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
    line-height: 1.5rem;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 0.3rem 0.75rem;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 0.5rem;
  }
  .blue-text {
    color: blue;
  }
`;
const SpinnerWrapper = styled.div`
  height: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TooltipMenuUl = styled.ul`
    margin-bottom: 0px !important;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
    width: 59rem;
    border: 2px solid #807f7f;
    border-radius: 12px;
    margin-bottom: 0px !important;
  }
    .inline-flex {
        width:100%;
    }
    .grey-back { background: #ddd;}
    .title {
        width: 6.5rem;
        text-align: left !important;
        padding-left:0.5rem;
        font-size:0.8rem;
    }
    .small-td{
         font-size:0.8rem;
    }

    .red-div{
        color: red;
    }
  .tooltip-item{
    display: flex;
  }
  .item-title{
    width: 7rem;
    text-align: right;
    padding: 5px 6px !important;
  }
  .item-content{
    width: 13rem;
  }
  .tooltip-content-area{
    line-height: 1rem;
    background: #050404;
    color: white;
  }
  .context-menu li {
    font-size: 1rem;
    line-height: 1.875rem;
    clear: both;
    color: black;
    cursor: pointer;
    font-weight: normal;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    border-bottom: solid 1px #888;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
    }
  }
  .table-bordered{
    width: 100%;
    table-layout: fixed;
    td{
        border: 1px solid #aaa;
        padding-left: 5px;
        text-align:center;
    }
    tr:nth-child(odd){
        background: rgb(221, 221, 221);
    }
  }
`;

const TooltipTitleMenuUl = styled.ul`
    margin-bottom: 0px !important;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 15px;
    position: absolute;
    text-align: left;
    overflow-y: auto;
    max-height: 35rem;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
    width: 34rem;
    border: 2px solid #807f7f;
    border-radius: 12px;
    margin-bottom: 0px !important;
  }
  .tooltip-item{
    display: flex;
  }
  .item-title{
    width: 7rem;
    text-align: right;
    padding: 5px 6px !important;
  }
  .item-content{
    width: 13rem;
  }
  .tooltip-content-area{
    line-height: 1rem;
    background: #050404;
    color: white;
  }
  font-size: 1rem;
  .context-menu li {
    font-size: 1rem;
    line-height: 1.875rem;
    clear: both;
    color: black;
    cursor: pointer;
    font-weight: normal;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    border-bottom: solid 1px #888;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
    }
  }
  .table-bordered{
    width: 100%;
    td{
        border: 1px solid #aaa;
        padding-left: 10px;
    }
    tr:nth-child(odd){
        background: rgb(221, 221, 221);
    }
  }
`;

const Tooltip = ({visible,x,y, parent,tooltip_display_measure_data, tooltip_time_series}) => {
  if (visible) {
    var graph_table_show = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data").graph_table_show;
    let temp;
    return (
      <TooltipMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div className="w100p">
              <div className={'fl w100p'}>
                <table className="w100p table-bordered">
                  {graph_table_show.ms_target_drainage == "ON" && (
                    <tr className={`inline-flex`}>
                      <td className={`title`}>除水量設定</td>
                      <td className={`unit`}>L</td>
                      {tooltip_display_measure_data != undefined && tooltip_display_measure_data != null && tooltip_display_measure_data.length > 0 &&
                      Object.keys(tooltip_time_series).map(key =>{
                        if (tooltip_display_measure_data[key] != undefined) {
                          temp = removeLeadZeros(tooltip_display_measure_data[key].ms_target_drainage);
                          return(
                            <>
                              <td className='small-td'>{temp}</td>
                            </>
                          )
                        } else {
                          return(
                            <>
                              <td>&nbsp;</td>
                            </>
                          )
                        }
                      })
                      }
                    </tr>
                  )}
                  {graph_table_show.ms_drainage_cur_speed == "ON" && (
                    <tr className={`inline-flex`}>
                      <td className={`title`}>除水速度</td>
                      <td className={`unit`}>L/h</td>
                      {tooltip_display_measure_data != undefined && tooltip_display_measure_data != null && tooltip_display_measure_data.length > 0 &&
                      Object.keys(tooltip_time_series).map(key =>{
                        if (tooltip_display_measure_data[key] != undefined) {
                          temp = removeLeadZeros(tooltip_display_measure_data[key].ms_drainage_cur_speed);
                          return(
                            <>
                              <td className='small-td'>{temp}</td>
                            </>
                          )
                        } else {
                          return(
                            <>
                              <td>&nbsp;</td>
                            </>
                          )
                        }
                      })
                      }
                    </tr>
                  )}
                  {graph_table_show.ms_cur_drainage == "ON" && (
                    <tr className={`inline-flex`}>
                      <td className={`title`}>除水量積算</td>
                      <td className={`unit`}>L</td>
                      {tooltip_display_measure_data != undefined && tooltip_display_measure_data != null && tooltip_display_measure_data.length > 0 &&
                      Object.keys(tooltip_time_series).map(key =>{
                        if (tooltip_display_measure_data[key] != undefined) {
                          temp = removeLeadZeros(tooltip_display_measure_data[key].ms_cur_drainage);
                          return(
                            <>
                              <td className={parent.determinLimit("ms_cur_drainage",tooltip_display_measure_data[key].ms_cur_drainage)?"red-div small-td":"small-td"}>
                                {temp}
                              </td>
                            </>
                          )
                        } else {
                          return(
                            <>
                              <td>&nbsp;</td>
                            </>
                          )
                        }
                      })
                      }
                    </tr>
                  )}
                  {graph_table_show.ms_blood_cur_flow == "ON" && (
                    <tr className={`inline-flex`}>
                      <td className={`title`}>血流量</td>
                      <td className={`unit`}>mL/min</td>
                      {tooltip_display_measure_data != undefined && tooltip_display_measure_data != null && tooltip_display_measure_data.length > 0 &&
                      Object.keys(tooltip_time_series).map(key =>{
                        if (tooltip_display_measure_data[key] != undefined) {
                          temp = removeLeadZeros(tooltip_display_measure_data[key].ms_blood_cur_flow);
                          return(
                            <>
                              <td className='small-td'>{temp}</td>
                            </>
                          )
                        } else {
                          return(
                            <>
                              <td>&nbsp;</td>
                            </>
                          )
                        }
                      })
                      }
                    </tr>
                  )}
                  {graph_table_show.ms_venous_pressure == "ON" && (
                    <tr className={`inline-flex`}>
                      <td className={`title`}>静脈圧</td>
                      <td className={`unit`}>mL/min</td>
                      {tooltip_display_measure_data != undefined && tooltip_display_measure_data != null && tooltip_display_measure_data.length > 0 &&
                      Object.keys(tooltip_time_series).map(key =>{
                        if (tooltip_display_measure_data[key] != undefined) {
                          temp = removeLeadZeros(tooltip_display_measure_data[key].ms_venous_pressure);
                          return(
                            <>
                              <td className='small-td'>{temp}</td>
                            </>
                          )
                        } else {
                          return(
                            <>
                              <td>&nbsp;</td>
                            </>
                          )
                        }
                      })
                      }
                    </tr>
                  )}
                  {graph_table_show.ms_fluid_pressure == "ON" && (
                    <tr className={`inline-flex`}>
                      <td className={`title`}>透析液圧</td>
                      <td className={`unit`}>mmHg</td>
                      {tooltip_display_measure_data != undefined && tooltip_display_measure_data != null && tooltip_display_measure_data.length > 0 &&
                      Object.keys(tooltip_time_series).map(key =>{
                        if (tooltip_display_measure_data[key] != undefined) {
                          // temp = removeLeadZeros(tooltip_display_measure_data[key].ms_fluid_pressure);
                          temp = tooltip_display_measure_data[key].ms_fluid_pressure;
                          return(
                            <>
                              <td className='small-td'>{temp}</td>
                            </>
                          )
                        } else {
                          return(
                            <>
                              <td>&nbsp;</td>
                            </>
                          )
                        }
                      })
                      }
                    </tr>
                  )}
                  {graph_table_show.ms_syringe_value == "ON" && this.state.table_all_show && (
                    <tr className={`moreshow-area inline-flex`}>
                      <td className={`title`}>SP積算</td>
                      <td className={`unit`}>mL</td>
                      {this.display_measure_data.length > 0 &&
                      Object.keys(this.time_series).map(key =>{
                        if (this.display_measure_data[key] != undefined) {
                          temp = removeLeadZeros(this.display_measure_data[key].ms_syringe_value);
                          return(
                            <>
                              <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                            </>
                          )
                        } else {
                          return(
                            <>
                              <td>&nbsp;</td>
                            </>
                          )
                        }
                      })
                      }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                      return (<><td key={item}></td></>)
                    })}
                    </tr>
                  )}
                  {graph_table_show.ms_dialysate_cur_temperature == "ON" && (
                    <tr className={`inline-flex`}>
                      <td className={`title`}>透析液温度</td>
                      <td className={`unit`}>℃</td>
                      {tooltip_display_measure_data != undefined && tooltip_display_measure_data != null && tooltip_display_measure_data.length > 0 &&
                      Object.keys(tooltip_time_series).map(key =>{
                        if (tooltip_display_measure_data[key] != undefined) {
                          temp = removeLeadZeros(tooltip_display_measure_data[key].ms_dialysate_cur_temperature);
                          return(
                            <>
                              <td className='small-td'>{temp}</td>
                            </>
                          )
                        } else {
                          return(
                            <>
                              <td>&nbsp;</td>
                            </>
                          )
                        }
                      })
                      }
                    </tr>
                  )}
                  {graph_table_show.ms_fluid_speed == "ON" && (
                    <tr className={`inline-flex`}>
                      <td className={`title`}>補液速度</td>
                      <td className={`unit`}>L/h</td>
                      {tooltip_display_measure_data != undefined && tooltip_display_measure_data != null && tooltip_display_measure_data.length > 0 &&
                      Object.keys(tooltip_time_series).map(key =>{
                        if (tooltip_display_measure_data[key] != undefined) {
                          temp = removeLeadZeros(tooltip_display_measure_data[key].ms_fluid_speed);
                          return(
                            <>
                              <td className='small-td'>{temp}</td>
                            </>
                          )
                        } else {
                          return(
                            <>
                              <td>&nbsp;</td>
                            </>
                          )
                        }
                      })
                      }
                    </tr>
                  )}
                  {graph_table_show.ms_fluid_cur_amount == "ON" && (
                    <tr className={`inline-flex`}>
                      <td className={`title`}>補液量積算</td>
                      <td className={`unit`}>L</td>
                      {tooltip_display_measure_data != undefined && tooltip_display_measure_data != null && tooltip_display_measure_data.length > 0 &&
                      Object.keys(tooltip_time_series).map(key =>{
                        if (tooltip_display_measure_data[key] != undefined) {
                          temp = removeLeadZeros(tooltip_display_measure_data[key].ms_fluid_cur_amount);
                          return(
                            <>
                              <td className='small-td'>{temp}</td>
                            </>
                          )
                        } else {
                          return(
                            <>
                              <td>&nbsp;</td>
                            </>
                          )
                        }
                      })
                      }
                    </tr>
                  )}
                  {graph_table_show.ms_hdf_count == "ON" && (
                    <tr className={`inline-flex`}>
                      <td className={`title`}>補液回数</td>
                      <td className={`unit`}>回</td>
                      {tooltip_display_measure_data != undefined && tooltip_display_measure_data != null && tooltip_display_measure_data.length > 0 &&
                      Object.keys(tooltip_time_series).map(key =>{
                        if (tooltip_display_measure_data[key] != undefined) {
                          temp = removeLeadZeros(tooltip_display_measure_data[key].ms_hdf_count);
                          return(
                            <>
                              <td className='small-td'>{temp}</td>
                            </>
                          )
                        } else {
                          return(
                            <>
                              <td>&nbsp;</td>
                            </>
                          )
                        }
                      })
                      }
                    </tr>
                  )}
                  {graph_table_show.ms_hdf_amount == "ON" && (
                    <tr className={`inline-flex`}>
                      <td className={`title`}>総補液積算</td>
                      <td className={`unit`}>L</td>
                      {tooltip_display_measure_data != undefined && tooltip_display_measure_data != null && tooltip_display_measure_data.length > 0 &&
                      Object.keys(tooltip_time_series).map(key =>{
                        if (tooltip_display_measure_data[key] != undefined) {
                          temp = removeLeadZeros(tooltip_display_measure_data[key].ms_hdf_amount);
                          return(
                            <>
                              <td className='small-td'>{temp}</td>
                            </>
                          )
                        } else {
                          return(
                            <>
                              <td>&nbsp;</td>
                            </>
                          )
                        }
                      })
                      }
                    </tr>
                  )}
                  {graph_table_show.input_time == "ON" && (
                    <tr className={`inline-flex`}>
                      <td className={`title`}>入力時間</td>
                      {tooltip_display_measure_data != undefined && tooltip_display_measure_data != null && tooltip_display_measure_data.length > 0 &&
                      Object.keys(tooltip_time_series).map(key =>{
                        if (tooltip_display_measure_data[key] != undefined) {
                          return(
                            <>
                              <td className='small-td'>{formatTimeIE(tooltip_display_measure_data[key].input_time)}</td>
                            </>
                          )
                        } else {
                          return(
                            <>
                              <td>&nbsp;</td>
                            </>
                          )
                        }
                      })
                      }
                    </tr>
                  )}
                </table>
              </div>
            </div>
          </li>
        </ul>
      </TooltipMenuUl>
    );
  } else {
    return null;
  }
};

const TooltipTitle = ({visible,x,y,title}) => {
  if (visible) {
    return (
      <TooltipTitleMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {title !== undefined && title != null && title.map ((item, idx)=>{
            return (
              <div key={idx}>
                {displayLineBreak(item.body)}
              </div>
            )}
          )}
        </ul>
      </TooltipTitleMenuUl>
    );
  } else {
    return null;
  }
};

const ContextMenu = ({ visible,x,y,parent,selected_item}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() =>parent.contextMenuAction(selected_item, "edit")}>編集</div></li>
          <li><div onClick={() =>parent.contextMenuAction(selected_item, "delete")}>削除</div></li>
          <li><div onClick={() => parent.registerSending(selected_item)}>次回の申し送りに登録</div></li>
          <li><div onClick={() => parent.showDrProposalModal(selected_item)}>Dr上申に追加</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class GraphMonitor extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let code_master = sessApi.getObjectValue("dial_common_master","code_master");
    let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
    var timingCodeData = sortTimingCodeMaster(code_master['実施タイミング']);
    let material_master = sessApi.getObjectValue("dial_common_master","material_master");
    var graph_table_show = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data").graph_table_show;
    var graph_axis = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data").graph_axis;
    
    this.measure_display_first_time = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data").measure_display_first_time;
    this.measure_display_period_offset = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data").measure_display_period_offset;
    this.measure_display_period = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data").measure_display_period;
    this.dial_init_machine_get_time = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data").dial_init_machine_get_time;
    if (this.measure_display_first_time == undefined) this.measure_display_first_time = 300;
    if (this.measure_display_period_offset == undefined) this.measure_display_period_offset = 0;
    if (this.measure_display_period == undefined) this.measure_display_period = 60;
    if (this.dial_init_machine_get_time == undefined) this.dial_init_machine_get_time = 30;

    this.monitor_dr_line = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data").monitor_dr_line;
    this.monitor_current_disease_line = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data").monitor_current_disease_line;

    if (this.monitor_dr_line == undefined) this.monitor_dr_line = 'OFF';
    if (this.monitor_current_disease_line == undefined) this.monitor_current_disease_line = 'OFF';

    this.ChartRef = React.createRef();
    
    this.graph_axis = {
      x_range_short:5,
      x_range_long:8
    }
    if (graph_axis != undefined && graph_axis != null && graph_axis != '') this.graph_axis = graph_axis;
    
    this.state = {
      graph_data: [],
      applied_data:[],
      list_data: [],
      is_started: 0,
      timerInterval: 1000,
      cnt: 0,
      blood_data: this.props.rows_blood,
      rows_measure: this.props.rows_measure,
      rows_temp: this.props.rows_temp,
      schedule_date,
      isDeleteConfirmModal:false,
      
      cur_disease_list:this.props.disease_history,
      treat_monitor_list:this.props.instruction_list,
      timingCodeData,
      timing_codes:makeList_code(timingCodeData),
      view_type: 'disease',
      dialysates:makeList_code(material_master['透析液']),
      target_weight: '',
      today_water_removal_amount: '',
      fluid: '',
      increase_amount: '',
      dw_increase_amount: '',
      supplementary_food: '',
      target_water_removal_amount: '',
      actualDrainage: '',
      drainage_speed: '',
      max_drainage_amount: '',
      max_drainage_speed: '',
      weight_after: '',
      weight_before: '',
      instruction_doctor: '',
      table_all_show: false,

      isDrProposalModal:false,
      alert_messages:'',
      confirm_alert_title:''
    };
    this.cnt = 0;
    this.min_x = '';
    this.max_x = '';
    this.time_series = [];
    this.display_measure_data = [];
    
    this.x_range = this.graph_axis.x_range_short;
    this.td_count = [];
    for(var i = 0; i < (this.x_range != undefined ? this.x_range : 8 ); i++) {
      this.td_count.push(i);
    }
    this.change_range_flag = false;
    sessApi.setObjectValue("from_graph_monitor", "x_range", this.graph_axis.x_range_short);
    this.graph_table_show = graph_table_show;
    this.openArrow = true;
    this.authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));

    this.prev_props = JSON.parse(JSON.stringify(this.props));
  }

  componentWillUnmount() {

    // initialize
    this.measure_display_first_time = null;
    this.measure_display_period_offset = null;
    this.measure_display_period = null;
    this.dial_init_machine_get_time = null;
    this.ChartRef = null;
    this.graph_axis = null;
    this.cnt = null;
    this.min_x = null;
    this.max_x = null;
    this.time_series = null;
    this.display_measure_data = null;
    
    this.x_range = null;
    this.td_count = null;    
    this.change_range_flag = null;    
    this.graph_table_show = null;
    this.openArrow = null;
    this.authInfo = null;
  }
  
  UNSAFE_componentWillReceiveProps(nextProps) {    
    this.change_range_flag = false;
    this.checkDoneStatus();
    if (JSON.stringify(this.state.schedule_data) == JSON.stringify(nextProps.schedule_data) &&
    JSON.stringify(this.state.rows_measure) == JSON.stringify(nextProps.rows_measure) &&
    JSON.stringify(this.state.rows_blood) == JSON.stringify(nextProps.rows_blood) &&
    JSON.stringify(this.state.rows_temp) == JSON.stringify(nextProps.rows_temp) &&
    JSON.stringify(this.state.patientInfo) == JSON.stringify(nextProps.patientInfo) &&
    JSON.stringify(this.state.treat_monitor_list) == JSON.stringify(nextProps.instruction_list) &&
    JSON.stringify(this.state.cur_disease_list) == JSON.stringify(nextProps.disease_history) &&
    JSON.stringify(this.state.schedule_date) == JSON.stringify(nextProps.schedule_date)
    ) return;

    this.setGraphListData(nextProps.rows_blood,nextProps.rows_measure,nextProps.rows_temp);
    this.setState({
      schedule_date:nextProps.schedule_date,
      rows_temp:nextProps.rows_temp,
      rows_blood:nextProps.rows_blood,
      patientInfo:nextProps.patientInfo,
      schedule_data:nextProps.schedule_data,
      cur_disease_list:nextProps.disease_history,
      treat_monitor_list:nextProps.instruction_list,
      instruction_doctor:nextProps.instruction_doctor,
    }, () => {      
      this.draingSetState(this.state.schedule_data);
    });
  }

  shouldComponentUpdate(nextprops, nextstate) {    
    nextprops = JSON.parse(JSON.stringify(nextprops));    
    if (compareTwoObjects(nextprops, this.prev_props) && compareTwoObjects(nextstate, this.state)) return false;
    this.prev_props = JSON.parse(JSON.stringify(nextprops));        
    return true;
  }
  
  async componentDidMount() {
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if(patientInfo == undefined || patientInfo == null || patientInfo.system_patient_id === undefined){
      var disease_area = document.getElementsByClassName("loaded-area-disease")[0];
      var instruction_area = document.getElementsByClassName("loaded-area-instruction")[0];
      if (disease_area != undefined) disease_area.style['display'] = "none";
      if (instruction_area != undefined) instruction_area.style['display'] = "none";
      return;
    }
    this.getRecvData().then(()=>{
      this.setGraphListData(this.state.blood_data,this.state.rows_measure,this.state.rows_temp);
    });
    this.checkDoneStatus();
  }
  
  changeX_Range = () => {
    if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
    this.change_range_flag = true;
    if (this.x_range == this.graph_axis.x_range_short) {
      this.x_range = this.graph_axis.x_range_long;
      sessApi.setObjectValue("from_graph_monitor", "x_range", this.graph_axis.x_range_long);
    } else {
      this.x_range = this.graph_axis.x_range_short;
      sessApi.setObjectValue("from_graph_monitor", "x_range", this.graph_axis.x_range_short);
    }
    this.forceUpdate();
  }
  
  setMinX = (min, value) => {
    if (min == '') return value;
    if (typeof min == 'string') min = min.split("-").join("/");
    if (typeof value == 'string') value = value.split("-").join("/");
    if (new Date(min).getTime() > new Date(value).getTime()) return new Date(value);
    return new Date(min);
  }
  
  setMaxX = (max, value) => {
    if (max == '') return value;
    if (typeof max == 'string') max = max.split("-").join("/");
    if (typeof value == 'string') value = value.split("-").join("/");
    if (new Date(max).getTime() < new Date(value).getTime()) return new Date(value);
    return new Date(max);
  }
  
  setGraphListData = (blood_data, measure_data, temperature_data) =>{
    this.min_x = '';
    this.max_x = '';
    this.display_measure_data = [];
    let graph_data = [
      { values: [], label: "脈拍"},
      { values: [], label: "最低血圧"},
      { values: [], label: "最高血圧"},
      // { values: [], label: "除水量積算"},
      { values: [], label: "体温"},
    ];
    let list_data = [];
    if (temperature_data != undefined && temperature_data != null && temperature_data.length > 0) {
      let filteredArr = temperature_data.reduce((acc, current) => {
        const x = acc.find(item => (item.input_time === current.input_time));
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      filteredArr.map(item => {
        let time = item.input_time;
        let temperature_value = {x: time, y: 10, indexLabel:parseFloat(item.temperature).toFixed(1) + "℃", indexLabelFontColor:item.temperature >37.5 ? "red":colors.temperatureLineColor};
        graph_data[3].values.push(temperature_value);
        this.min_x = this.setMinX(this.min_x, formatDateTimeIE(time));
        this.max_x = this.setMaxX(this.max_x, formatDateTimeIE(time));
      });
    }
    if (blood_data != undefined && blood_data != null && blood_data.length > 0) {
      let filteredArr = blood_data.filter(item=>{
        if (item.is_enabled === 1) {
          return item;
        }
      });
      filteredArr.map(item => {
        let time = item.input_time;
        let pulse_add_value = {x: time, y: parseInt(item.bp_pulse)};
        let blood_add_min_value = {x:time, y: parseInt(item.bp_pressure_min)};
        let blood_add_max_value = {x:time, y: parseInt(item.bp_pressure_max)};
        this.min_x = this.setMinX(this.min_x, formatDateTimeIE(time));
        this.max_x = this.setMaxX(this.max_x, formatDateTimeIE(time));
        graph_data[0].values.push(pulse_add_value);
        graph_data[1].values.push(blood_add_min_value);
        graph_data[2].values.push(blood_add_max_value);
      });
    }
    if (measure_data !== undefined && measure_data != null && measure_data.length > 0){
      measure_data.map((item) => {
        let time = item.input_time;
        // let blood_data = this.getRecentBloodData(time, blood_data);
        if (item.is_enabled){
          list_data.push({
            input_time: time,
            ms_number:item.ms_number,
            ms_blood_cur_flow:item.ms_blood_cur_flow,
            ms_venous_pressure:item.ms_venous_pressure,
            ms_fluid_pressure:item.ms_fluid_pressure,
            ms_cur_drainage:item.ms_cur_drainage,
            ms_dialysate_cur_temperature:item.ms_dialysate_cur_temperature,
            ms_drainage_cur_speed:item.ms_drainage_cur_speed,
            ms_target_drainage:item.ms_target_drainage,
            ms_fluid_speed:item.ms_fluid_speed,
            ms_fluid_cur_amount:item.ms_fluid_cur_amount,
            ms_hdf_count:item.ms_hdf_count,
            ms_hdf_amount:item.ms_hdf_amount,
            ms_blood_target_flow:item.ms_blood_target_flow,
            ms_syringe_speed:item.ms_syringe_speed,
            ms_syringe_value:item.ms_syringe_value,
            ms_dialysate_target_temperature:item.ms_dialysate_target_temperature,
            ms_dialysate_target_concentration:item.ms_dialysate_target_concentration,
            ms_dialysate_cur_concentration:item.ms_dialysate_cur_concentration,
            ms_dializer_pressure:item.ms_dializer_pressure,
            ms_arterial_pressure:item.ms_arterial_pressure,
            ms_fluid_target_amount:item.ms_fluid_target_amount,
            ms_fluid_target_temperature:item.ms_fluid_target_temperature,
            ms_fluid_cur_temperature:item.ms_fluid_cur_temperature,
            ms_emergency_amount:item.ms_emergency_amount,
            ms_tmp:item.ms_tmp,
          });
        }
        
      });
    }
    this.setState({
      graph_data: graph_data,
      list_data:list_data,
    });
  };
  
  checkDoneStatus = () => {
    let applied_data = [];
    let data_item = {};
    let schedule_date = this.state.schedule_date;
    if (schedule_date == undefined) schedule_date = new Date();
    
    let schedule_data = this.props.schedule_data;
    let plan_hours = schedule_data!=undefined && schedule_data.dial_pattern != undefined?schedule_data.dial_pattern.reservation_time:'';
    let schedule_start_time = '';
    var schedule_start_datetime = '';
    let schedule_end_time = '';
    var schedule_end_datetime='';
    if (schedule_data != undefined){
      if (schedule_data.start_date != null) {
        schedule_start_datetime = schedule_data.start_date;
        schedule_start_time = formatTimeIE(schedule_data.start_date);
      } else {
        if(schedule_data.console_start_date != null) {
          schedule_start_datetime = schedule_data.console_start_date;
          schedule_start_time = formatTimeIE(schedule_data.console_start_date);
        }
      }
      
      if (schedule_data.end_date != null) {
        schedule_end_datetime = schedule_data.end_date;
        schedule_end_time = formatTimeIE(schedule_data.end_date);
      }
    }
    
    
    if (schedule_start_time != '' && plan_hours != ''){
      let start_time = new Date(formatDateTimeIE(schedule_start_datetime));
      start_time.setSeconds(0);
      
      let start_time_temp = new Date(formatDateTimeIE(schedule_start_datetime));
      start_time_temp.setSeconds(0);
      var end_time = new Date(formatDateTimeIE(schedule_start_datetime));
      if (schedule_end_time != ''){
        end_time = new Date(formatDateTimeIE(schedule_end_datetime));
        
      } else {
        end_time.setHours(parseInt(schedule_start_time.split(':')[0]) + parseInt(plan_hours.split(':')[0]));
        end_time.setMinutes(parseInt(schedule_start_time.split(':')[1]) + parseInt(plan_hours.split(':')[1]));
      }
      end_time.setSeconds(0);
      
      var end_time_temp = new Date(schedule_date);
      if (schedule_end_time != ''){
        end_time_temp = new Date(formatDateTimeIE(schedule_end_datetime));
        
      } else {
        end_time_temp.setHours(parseInt(schedule_start_time.split(':')[0]) + parseInt(plan_hours.split(':')[0]));
        end_time_temp.setMinutes(parseInt(schedule_start_time.split(':')[1]) + parseInt(plan_hours.split(':')[1]));
      }
      end_time_temp.setSeconds(0);
      
      var mid_time = new Date((start_time.getTime() + end_time.getTime())/2);
      let apply_time;
      var timing_kind ='';
      var temp = '';
      if (this.props.done_inspection.length > 0){
        this.props.done_inspection.map(item=>{
          apply_time = this.getApplyTime(item.timing_code, start_time_temp, end_time_temp, mid_time);
          if (this.state.timing_codes != undefined){
            temp = this.state.timingCodeData.filter(x => x.code == item.timing_code);
            if (temp.length> 0) timing_kind = temp[0].value;
          }
          // this.min_x = this.setMinX(this.min_x, apply_time);
          // this.max_x = this.setMaxX(this.max_x, apply_time);
          if (item.is_completed) data_item = {x:apply_time, y:240, indexLabel:'★検', kind:'検', indexLabelFontColor:'#2AB6C1', timing:timing_kind};
          else data_item = {x:apply_time, y:240, indexLabel:'★検', kind:'検', indexLabelFontColor:'red', timing:timing_kind};
          var findIndex = applied_data.findIndex(x => x.kind == '検' && x.timing == timing_kind);          
          if (findIndex == -1){
            applied_data.push(data_item);
          } else {
            if (applied_data[findIndex].indexLabelFontColor == '#2AB6C1' && item.is_completed != 1){
              applied_data[findIndex].indexLabelFontColor = 'red';
            }
          }
        })
      }
      
      if (this.props.done_injection.length > 0){
        this.props.done_injection.map(item => {
          apply_time = this.getApplyTime(item.timing_code, start_time_temp, end_time_temp, mid_time);
          if (this.state.timing_codes != undefined){
            temp = this.state.timingCodeData.filter(x => x.code == item.timing_code);
            if (temp.length> 0) timing_kind = temp[0].value;
          }
          // this.min_x = this.setMinX(this.min_x, apply_time);
          // this.max_x = this.setMaxX(this.max_x, apply_time);
          if (item.is_completed) data_item = {x:apply_time, y:200, indexLabel:'★注', kind:'注', indexLabelFontColor:'#2AB6C1', timing:timing_kind}
          else data_item = {x:apply_time, y:200, indexLabel:'★注', kind:'注', indexLabelFontColor:'red', timing:timing_kind}
          var findIndex = applied_data.findIndex(x => x.kind == '注' && x.timing == timing_kind);          
          if (findIndex == -1){
            applied_data.push(data_item);
          } else {
            if (applied_data[findIndex].indexLabelFontColor == '#2AB6C1' && item.is_completed != 1){
              applied_data[findIndex].indexLabelFontColor = 'red';
            }
          }          
        });
      }
      if (this.props.done_dial_pres.length > 0){
        this.props.done_dial_pres.map(item=>{
          apply_time = this.getApplyTime(item.timing_code, start_time_temp, end_time_temp, mid_time);
          if (this.state.timing_codes != undefined){
            temp = this.state.timingCodeData.filter(x => x.code == item.timing_code);
            if (temp.length> 0) timing_kind = temp[0].value;
          }
          // this.min_x = this.setMinX(this.min_x, apply_time);
          // this.max_x = this.setMaxX(this.max_x, apply_time);
          if (item.is_completed) data_item = {x:apply_time, y:160, indexLabel:'★処', kind:'処', indexLabelFontColor:'#2AB6C1', timing:timing_kind};
          else data_item = {x:apply_time, y:160, indexLabel:'★処', kind:'処', indexLabelFontColor:'red', timing:timing_kind};
          var findIndex = applied_data.findIndex(x => x.kind == '処' && x.timing == timing_kind);
          if (findIndex == -1){
            applied_data.push(data_item);
          } else {
            if (applied_data[findIndex].indexLabelFontColor == '#2AB6C1' && item.is_completed != 1){
              applied_data[findIndex].indexLabelFontColor = 'red';
            }
          }
          
        })
      }
      
      this.setState({
        start_time,
        end_time
      })
      
    } else {
      this.setState({
        start_time:null,
        end_time: null,
      })
    }
    this.setState({
      applied_data,
    })
    
  };
  
  getApplyTime = (timing, start_time, end_time, mid_time) => {
    let apply_time = start_time;
    if (this.state.timing_codes != undefined){
      var timing_record = this.state.timingCodeData.filter(x => x.code == timing);
      if(timing_record.length> 0){
        switch(timing_record[0].value){
          case '透析開始前':
            apply_time = new Date(start_time.getTime());
            apply_time.setMinutes(start_time.getMinutes()-30);
            break;
          case '透析開始時～直後':
            apply_time = new Date(start_time.getTime());
            break;
          case '透析開始後':
            apply_time = new Date(start_time.getTime());
            apply_time.setMinutes(start_time.getMinutes()+30);
            break;
          case '透析中':
            apply_time = mid_time;
            break;
          case '透析終了前':
            apply_time = new Date(end_time.getTime());
            apply_time.setMinutes(end_time.getMinutes()-30);
            break;
          case '透析終了直前～終了時':
            apply_time = new Date(end_time.getTime());
            break;
          case '透析終了後':
            apply_time = new Date(end_time.getTime());
            apply_time.setMinutes(end_time.getMinutes()+30);
            break;
        }
      }
      
    }
    return apply_time;
    
  };
  
  getRecentBloodData=(input_time, blood_data)=> {
    let return_data = {};
    let filtered_data = blood_data.filter(item=>{
      var dt = new Date();
      var y = dt.getFullYear();
      var m = ("00" + (dt.getMonth() + 1)).slice(-2);
      var d = ("00" + dt.getDate()).slice(-2);
      var today = y+"/"+m+"/"+d;
      let first_time = new Date(today + " " +formatTimeIE(item.input_time));
      let second_time = new Date(today + " " +formatTimeIE(input_time));
      if(first_time.getTime()<second_time.getTime()){
        return item;
      }
    });
    if (filtered_data != null && filtered_data.length !== 0){
      return_data = filtered_data[filtered_data.length -1];
    }
    return return_data;
  };
  
  async getRecvData(){
    let schedule_data = this.props.schedule_data;
    let path = "/app/api/v2/dial/board/get_all_ms_data";
    const post_data = {
      schedule_id:schedule_data.number,
      system_patient_id:schedule_data.system_patient_id,
    };
    await apiClient._post(path, {params: post_data}).then((res)=>{
      if (res!= undefined && res != null){
        this.setState({
          blood_data:res.handle_data.blood_data,
          rows_measure:res.handle_data.measure_data,
          rows_temp:res.handle_data.temperature_data
        })
      }
    });
    
  }
  
  showDoneModal = (applied_kind, timing) => {
    if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if(patientInfo == undefined || patientInfo == null){
      return;
    }
    switch(applied_kind){
      case '検':
        this.setState({done_modal_inspection: true, timing});
        break;
      case '注':
        this.setState({done_modal_injection: true, timing});
        break;
      case '処':
        this.setState({done_modal_dial_pres: true, timing});
        break;
    }
    
  };
  
  showTemperature = () => {
    if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
    this.setState({isOpenTemperatureModal: true})
  };
  
  closeModal = () => {
    this.setState({
      done_modal_inspection: false,
      done_modal_injection: false,
      done_modal_dial_pres: false,
      isOpenTemperatureModal: false,
      isOpenMedicalHistoryModal: false,
      isDrProposalModal:false,
      alert_messages:'',
      confirm_alert_title:''
    });
  };
  
  saveEditedSchedule = (updated_data, title) => {
    this.props.saveEditedSchedule(updated_data, title);
  };
  
  openBloodModal = () => {
    if (this.state.blood_data === undefined || this.state.blood_data == null) return;
    this.setState({
      isOpenBloodModal: true,
      only_show: 1
    })
  };
  
  closeTemperatureModal = () => {
    this.setState({isOpenTemperatureModal: false})
  };
  
  setHandleTempData = (data) => {
    this.closeTemperatureModal();
    this.props.setHandleTempData(data);
  }
  
  getDiffMinutes(first_dt, second_dt){
    if (first_dt == undefined || second_dt == undefined || first_dt == null || second_dt == null || first_dt == "" || second_dt == "") return;
    if (first_dt instanceof Date) first_dt = formatDateTimeStr(first_dt);
    if (second_dt instanceof Date) second_dt = formatDateTimeStr(second_dt);
    if (!first_dt.includes(" ") || !second_dt.includes(" ")) return;
    first_dt = first_dt.split(" ");
    second_dt = second_dt.split(" ");
    if(first_dt[1] == null || first_dt[1] == "" || second_dt == null || second_dt == "") return;
    let first_time = first_dt[1].split(":");
    let first_minute = parseInt(first_time[0]) *60 + parseInt(first_time[1]);
    let second_time = second_dt[1].split(":");
    let second_minute = parseInt(second_time[0]) *60 + parseInt(second_time[1]);
    if(second_minute-first_minute<3){
      return true;
    } else {
      return false;
    }
  }
  
  determinLimit =(index, value) => {
    const {schedule_data} = this.props;
    if(schedule_data === undefined || schedule_data == null) return;
    if(schedule_data.dial_pattern === undefined || schedule_data.dial_pattern == null) return;
    if(index === "ms_cur_drainage") {
      if(schedule_data.dial_pattern.max_drainage_amount !== undefined && schedule_data.dial_pattern.max_drainage_amount != null &&
        schedule_data.dial_pattern.max_drainage_amount !== "" && schedule_data.dial_pattern.max_drainage_amount != 0 &&
        schedule_data.dial_pattern.max_drainage_amount < parseFloat(value)){
        return true;
      } else return false;
    } else if(index === "max_blood") {
      if((schedule_data.dial_pattern.blood_pressure_max !== undefined && schedule_data.dial_pattern.blood_pressure_max != null &&
        schedule_data.dial_pattern.blood_pressure_max !== "" && schedule_data.dial_pattern.blood_pressure_max != 0 &&
        parseFloat(schedule_data.dial_pattern.blood_pressure_max) < parseFloat(value)) || (
        schedule_data.dial_pattern.blood_pressure_min !== undefined && schedule_data.dial_pattern.blood_pressure_min != null &&
        schedule_data.dial_pattern.blood_pressure_min !== "" && schedule_data.dial_pattern.blood_pressure_min != 0 &&
        parseFloat(schedule_data.dial_pattern.blood_pressure_min) > parseFloat(value)
      )){
        return true;
      } else return false;
    } else if(index === "min_blood") {
      if((schedule_data.dial_pattern.blood_pressure_emax !== undefined && schedule_data.dial_pattern.blood_pressure_emax != null &&
        schedule_data.dial_pattern.blood_pressure_emax !== "" && schedule_data.dial_pattern.blood_pressure_max != 0 &&
        parseFloat(schedule_data.dial_pattern.blood_pressure_emax) < parseFloat(value)) || (
        schedule_data.dial_pattern.blood_pressure_emin !== undefined && schedule_data.dial_pattern.blood_pressure_emin != null &&
        schedule_data.dial_pattern.blood_pressure_emin !== "" && schedule_data.dial_pattern.blood_pressure_emin != 0 &&
        parseFloat(schedule_data.dial_pattern.blood_pressure_emin) > parseFloat(value)
      )){
        return true;
      } else return false;
    } else if(index === "plus") {
      if((schedule_data.dial_pattern.pluse_max !== undefined && schedule_data.dial_pattern.pluse_max != null &&
        schedule_data.dial_pattern.pluse_max !== "" && schedule_data.dial_pattern.pluse_max != 0 &&
        parseFloat(schedule_data.dial_pattern.pluse_max) < parseFloat(value)) || (
        schedule_data.dial_pattern.pluse_min !== undefined && schedule_data.dial_pattern.pluse_min != null &&
        schedule_data.dial_pattern.pluse_min !== "" && schedule_data.dial_pattern.pluse_min != 0 &&
        parseFloat(schedule_data.dial_pattern.pluse_min) > parseFloat(value)
      )){
        return true;
      } else return false;
    }
  };
  
  handleMoreDisplay = () => {
    this.props.setDisplayZoom();
    this.moreDisplay();
  }
  
  moreDisplay = () => {
    var more_show_btn = document.getElementsByClassName("moreshow-btn")[0];
    var moreshow_table_records = document.getElementsByClassName("moreshow-area");
    
    var dial_chat = document.getElementsByClassName("dial-chat")[0];
    let _obj_01 = null;
    let _temp_01 = document.getElementsByClassName("current-state")[0];
    if (_temp_01 != null && _temp_01 != undefined) {
      let _temp_02 = _temp_01.getElementsByClassName("disease-content")[0];
      _obj_01 = _temp_02;
    }
    var content = document.getElementsByClassName("content")[0];
    let _obj_02 = null;
    let _temp_03 = document.getElementsByClassName("instruction")[0];
    if (_temp_03 != null && _temp_03 != undefined) {
      let _temp_04 = _temp_03.getElementsByClassName("disease-content")[0];
      _obj_02 = _temp_04;
    }
    
    let display = "none";
    if (moreshow_table_records != undefined && moreshow_table_records.length > 0) {
      display = moreshow_table_records[0].style['display'];
      for(var i = 0; i < moreshow_table_records.length; i++ ){
        moreshow_table_records[i].style['display'] = display == "none" ? "table-row" : "none";
      }
      dial_chat.style.height = "30vh";
      if (_obj_01 != null && _obj_01 != undefined) _obj_01.style.height = "15.5vh";
      if (_obj_02 != null && _obj_02 != undefined) _obj_02.style.height = "15.5vh";
      
      content.style.height = "calc(100% - 48vh)";
      this.openArrow = false;
      
    } else {
      dial_chat.style.height = "30vh";
      if (_obj_01 != null && _obj_01 != undefined) _obj_01.style.height = "16.5vh";
      if (_obj_02 != null && _obj_02 != undefined) _obj_02.style.height = "33.5vh";
      content.style.height = "calc(100% - 66vh)";
      this.openArrow = true;
    }
    if (more_show_btn != undefined) {
      // more_show_btn.style['margin-top'] = display == "none" ? "26.5vh" : "0px";
      more_show_btn.style['margin-top'] = display == "none" ? "0px" : "0px";
      more_show_btn.innerHTML = display == "none" ? "↑":"↓";
    }
    this.setState({
      table_all_show:!this.state.table_all_show,
    })
  };
  
  removeLabel = (value) => {
    value = value.replace("(指示)", "");
    return value;
  };
  
  handleClick = (e, item) => {
    if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextMenu: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: { visible: false }
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("disease_area")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById("disease_area")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX,
          y: e.clientY + window.pageYOffset
        },
        selected_item: item
      });
    }
  }
  
  contextMenuAction = (selected_item, type) => {
    if (type === "edit"){
      this.editData(selected_item);
    }
    if (type === "delete"){
      this.setState({
        isDeleteConfirmModal:true,
        confirm_message:'選択された現症を削除しますか？',
        // selected_number:this.state.cur_disease_list[index].number
        selected_number:selected_item.number,
      })
    }
  };

  registerSending = async (selected_item) => {    
    var body = '';
    var source = '処置モニター';
    var handover_relation = '';    

    if (selected_item.body != undefined && selected_item.body != null && selected_item.body != ''){
      body = selected_item.body;
    }    
    handover_relation = selected_item.number;
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    let data = {
      patient_id: patientInfo.system_patient_id,
      category: '次回申し送り',
      message: body,
      source : source,
      relation: handover_relation,
    };
    let path = "/app/api/v2/dial/board/sendingDataRegister";
    await apiClient.post(path, {
      params: data
    }).then(() => {
      this.closeModal();
      this.setState({
        alert_messages:'次回申し送りを登録しました。',
        confirm_alert_title:'登録完了'
      })      
    }).catch(() => {
    });
  }

  showDrProposalModal = (selected_item) => {
    var body = "";
    var source = '処置モニター';
    var handover_relation = '';
    body = selected_item.body;
    handover_relation = selected_item.number;
    
    this.setState({
      isDrProposalModal:true,
      item:{message:body, number:0},
      source,
      handover_relation,
    })
  }
  
  confirmCancel = () => {
    this.setState({
      confirm_message: "",
      isDeleteConfirmModal:false,
      isEditConfirmModal:false,
    });
  }
  
  editData = (selected_item) => {    
    // let modal_data = this.state.cur_disease_list[index];    
    this.setState({
      modal_data:selected_item,
      isOpenMedicalHistoryModal: true
    });
  };
  
  handleOk = () => {
    this.closeModal();
    this.props.getCurDiseaseInfo();
  };
  
  deleteDisease = async () => {
    let path = "/app/api/v2/dial/board/Soap/disease_delete";
    let post_data = {
      params: this.state.selected_number,
    };
    await apiClient.post(path,  post_data);
    this.props.getCurDiseaseInfo();
    this.confirmCancel();
  };
  
  OpenInputPanelModal = () => {
    if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if(patientInfo == undefined || patientInfo == null || patientInfo.system_patient_id == undefined){
      this.setState({alert_messages:'患者様を選択してください。'})      
      return;
    }
    this.setState({
      isOpenMedicalHistoryModal:true,
      modal_data: undefined,
    });
  };
  
  
  makeTimeListMeasure(start_time, range_hours){
    if (start_time == undefined || start_time == null || start_time =='') return;    
    var temp = this.state.list_data;    
    this.time_series = [];
    this.display_measure_data = [];
    start_time = new Date(start_time);
    var proportion = 2;
    for (var i = 0;i<range_hours*proportion;i++){
      this.time_series.push(start_time.getTime()+ i *30*60*1000);
    }    
    var final_time_limit = start_time.getTime() + range_hours*60*60*1000;
    var interval_measure = 1;
    if (this.measure_display_period == 60) interval_measure = 2;
    var offset_time = this.measure_display_period_offset;
    var input_time_temp;
    this.time_series[0] = this.time_series[0] + this.measure_display_first_time * 1000 + offset_time * 1000;
    
    //---------------make even measure data----------------------------------------
    for(i = 0; i < range_hours*proportion; i = i + interval_measure){
      for (var j = temp.length - 1;j >= 0 ; j--){
        
        if (typeof temp[j].input_time == 'string') temp[j].input_time = temp[j].input_time.split("-").join("/");
        input_time_temp = new Date(temp[j].input_time).getTime();
        if (i == 0 && temp[j].ms_number == 0) input_time_temp += this.measure_display_first_time * 1000;

        if (input_time_temp >= this.time_series[i] - offset_time * 1000 && input_time_temp < final_time_limit){          
          if (this.time_series[i+interval_measure] > 0){
            if (input_time_temp < this.time_series[i+interval_measure] - offset_time * 1000){              
              if (i == 0){
                if (input_time_temp < start_time.getTime() + this.dial_init_machine_get_time * 60 * 1000 - offset_time * 1000){                  
                  this.display_measure_data[i] = temp[j];
                }
              } else {
                this.display_measure_data[i] = temp[j];
              }
            }
          } else {
            if (i == 0){
              if (input_time_temp < start_time.getTime() + this.dial_init_machine_get_time * 60 * 1000 - offset_time * 1000){
                this.display_measure_data[i] = temp[j];
              }
            } else {
              this.display_measure_data[i] = temp[j];
            }
          }
        }
      }
    }
    //----------------------------------------------------------------------------
    //---------------make odd measure data----------------------------------------
    if (interval_measure == 2){
      for(i = 1; i < range_hours*proportion; i = i + interval_measure){
        for (j = temp.length - 1;j >= 0 ; j--){
          if (typeof temp[j].input_time == 'string') temp[j].input_time = temp[j].input_time.split("-").join("/");
          input_time_temp = new Date(temp[j].input_time).getTime();
          if (this.display_measure_data[i-1] != undefined && input_time_temp < final_time_limit){
            var criteria_time = this.display_measure_data[i-1].input_time;
            if (typeof criteria_time == 'string') criteria_time = criteria_time.split("-").join("/");
            criteria_time = new Date(criteria_time).getTime();
            if (input_time_temp > criteria_time){
              if (this.time_series[i+1] > 0){
                if (input_time_temp < this.time_series[i+1] - offset_time * 1000){
                  this.display_measure_data[i] = temp[j];
                }
              } else {
                this.display_measure_data[i] = temp[j];
              }
            }
          }
        }
      }
    }
    //----------------------------------------------------------------------------
    //---------------make second element of display measure data------------------------
    if (this.dial_init_machine_get_time < 60){
      this.display_measure_data[1] = undefined;
      var second_element_criteria_time_min = start_time.getTime() + this.dial_init_machine_get_time * 60 * 1000 - offset_time * 1000;
      var second_element_criteria_time_max = start_time.getTime() + 60 * 60 * 1000 - offset_time * 1000;
      for (j = temp.length - 1;j >= 0 ; j--){
        if (typeof temp[j].input_time == 'string') temp[j].input_time = temp[j].input_time.split("-").join("/");
        input_time_temp = new Date(temp[j].input_time).getTime();
        if (input_time_temp >= second_element_criteria_time_min && input_time_temp < second_element_criteria_time_max && input_time_temp < final_time_limit){
          if (this.display_measure_data[0] != undefined){
            if (input_time_temp > new Date(this.display_measure_data[0].input_time).getTime()){
              this.display_measure_data[1] = temp[j];
            }
          } else {
            this.display_measure_data[1] = temp[j];
          }
        }
      }
    }
    //---------------------------------------------------------------------------------
    sessApi.setObjectValue("from_graph_monitor", "display_measure_data", this.display_measure_data);
  }
  
  showTable = (e, display_measure_data, time_series) => {
    if (this.openArrow == true) return;
    this.setState({
      tooltip: {
        visible: true,
        x: e.clientX,
        y: e.clientY+window.pageYOffset + 20,
        tooltip_display_measure_data: display_measure_data,
        tooltip_time_series: time_series
      },
    });
  };
  
  showTitle = (e, item) => {
    if (this.openArrow == true) return;
    this.setState({
      tooltipTitle: {
        visible: true,
        x: e.clientX - 380,
        y: e.clientY+window.pageYOffset + 20,
        title: item
      },
    });
  };
  
  hideTooltip = () => {
    this.setState({
      tooltip: { visible: false},
      tooltipTitle: { visible: false}
    });
  };
  
  setViewType = (view_type) => {
    if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
    if (this.state.view_type == view_type) return;
    this.setState({view_type});
  }
  getReservationTime(dt) {
    var datas = dt.split(":");
    if (parseInt(datas[1]) == 0) return parseInt(datas[0]);
    let result = parseInt(datas[0]) + parseInt(datas[1]) / 60;
    return result.toFixed(1);
  }
  getFluidAmount(speed, time) {
    let amount = "";
    if (speed != null && time != null && speed !== "" && time !== "") {
      amount = parseFloat(speed) * parseFloat(time).toFixed(1);
      if (isNaN(amount)) return "";
      return amount.toFixed(1);
    } else return amount;
  }
  getTTargetWaterRemovalAmount = (
    weight_before,
    fluid,
    supplementary_food,
    target_weight
  ) => {
    let new_target_water_removal_amount = 0;
    if (weight_before == undefined && weight_before == null) return "";
    
    new_target_water_removal_amount += parseFloat(weight_before);
    
    if (
      fluid !== undefined &&
      fluid !== null &&
      isNaN(parseFloat(fluid)) === false
    ) {
      new_target_water_removal_amount += parseFloat(fluid);
    }
    
    if (
      supplementary_food !== undefined &&
      supplementary_food !== null &&
      isNaN(parseFloat(supplementary_food)) === false
    ) {
      new_target_water_removal_amount += parseFloat(supplementary_food);
    }
    if (
      target_weight !== undefined &&
      target_weight !== null &&
      isNaN(parseFloat(target_weight)) === false
    ) {
      new_target_water_removal_amount -= parseFloat(target_weight);
    }
    
    if (isNaN(new_target_water_removal_amount)) return "";
    return parseFloat(new_target_water_removal_amount).toFixed(1);
  };
  draingSetState = (schedule_data, ms_cur_drainage) => {
    let drainage_speed = "";
    let drainage_time = "";
    let target_weight = "";
    let cur_waterRemovalAmount = "";
    let today_water_removal_amount = "";
    let fluid_amount = "";
    let actualDrainage = ms_cur_drainage;
    actualDrainage = ""; // 215-2 実除水が、前体重 - 後体重になっていない
    let increase_amount = '';
    let dw_increase_amount = '';
    if ( schedule_data != undefined && schedule_data !== null && schedule_data.dial_pattern !== undefined) {
      if ( schedule_data.dial_pattern.fluid_time != null && schedule_data.dial_pattern.fluid_time !== "" && schedule_data.dial_pattern.reservation_time != null && schedule_data.dial_pattern.reservation_time != "" )
        fluid_amount = this.getFluidAmount(
          schedule_data.dial_pattern.fluid_speed,
          this.getReservationTime(schedule_data.dial_pattern.fluid_time)
        );
      else
        fluid_amount = this.getFluidAmount(
          schedule_data.dial_pattern.fluid_speed,
          this.getReservationTime(schedule_data.dial_pattern.reservation_time)
        );
      if (
        schedule_data.weight_before != null &&
        schedule_data.weight_before != "" &&
        schedule_data.weight_after != null &&
        schedule_data.weight_after != ""
      ) {
        actualDrainage =
          schedule_data.weight_before - schedule_data.weight_after;
        actualDrainage = isNaN(parseFloat(actualDrainage))
          ? ""
          : parseFloat(actualDrainage).toFixed(2);
      }
      if (
        schedule_data.dial_pattern.drainage_time != null &&
        schedule_data.dial_pattern.drainage_time !== ""
      ) {
        drainage_time = schedule_data.dial_pattern.drainage_time;
      } else {
        drainage_time = schedule_data.dial_pattern.reservation_time;
      }
      
      if (drainage_time != null && drainage_time !== "") {
        target_weight =
          schedule_data.target_weight != null &&
          schedule_data.target_weight !== ""
            ? schedule_data.target_weight
            : schedule_data.dial_pattern.dw;
        target_weight = target_weight != "" ? parseFloat(target_weight) : "";
        if (
          schedule_data.weight_before != null &&
          schedule_data.weight_before != ""
        ) {
          today_water_removal_amount = isNaN(target_weight)
            ? schedule_data.weight_before
            : schedule_data.weight_before - target_weight;
          today_water_removal_amount = !isNaN(
            parseFloat(today_water_removal_amount)
          )
            ? parseFloat(today_water_removal_amount).toFixed(1)
            : 0;
          //-------------- 除水量積算 -------------------------
          // 本日目標除水量 + 補液 + 補食 = 除水量設定
          cur_waterRemovalAmount = this.getTTargetWaterRemovalAmount(
            schedule_data.weight_before,
            schedule_data.dial_pattern.fluid,
            schedule_data.dial_pattern.supplementary_food,
            target_weight
          );
        }
        // -------------- 除水速度------------------------
        // 除水速度 = 除水量積算/除水時間
        drainage_speed = (
          parseFloat(cur_waterRemovalAmount) /
          parseFloat(this.getReservationTime(drainage_time))
        ).toFixed(2);
        drainage_speed = isNaN(drainage_speed) ? "" : drainage_speed;
      }
      if ( schedule_data.weight_before > 0 && parseFloat(this.state.prevTimeWeight) > 0 ) {
        increase_amount = parseFloat(
          parseFloat(schedule_data.weight_before) -
          parseFloat(this.state.prevTimeWeight)
        ).toFixed(2);
      }
      if (schedule_data.weight_before > 0 && schedule_data.dial_pattern.dw > 0) {
        dw_increase_amount = parseFloat(schedule_data.weight_before) - parseFloat(schedule_data.dial_pattern.dw); 
      }
    }
    this.setState(
      {
        ms_cur_drainage: ms_cur_drainage,
        dilution_timing:
          schedule_data !== undefined &&
          schedule_data.dial_pattern !== undefined
            ? schedule_data.dial_pattern.dilution_timing
            : "",
        drainage_speed: drainage_speed,
        drainage_time,
        today_water_removal_amount: today_water_removal_amount,
        degree:
          schedule_data !== undefined &&
          schedule_data.dial_pattern !== undefined
            ? schedule_data.dial_pattern.degree
            : "",
        fluid_amount: fluid_amount,
        fluid_speed:
          schedule_data !== undefined &&
          schedule_data.dial_pattern !== undefined
            ? schedule_data.dial_pattern.fluid_speed
            : "",
        weight_before:
          schedule_data !== undefined &&
          schedule_data.weight_before != null &&
          schedule_data.weight_before !== ""
            ? parseFloat(schedule_data.weight_before).toFixed(1)
            : "",
        prevTimeWeight:
          schedule_data !== undefined && schedule_data != null
            ? schedule_data.prev_weight_after
            : "",
        dw:
          schedule_data !== undefined &&
          schedule_data.dial_pattern !== undefined
            ? schedule_data.dial_pattern.dw
            : "",
        target_weight,
        fluid:
          schedule_data !== undefined &&
          schedule_data.dial_pattern !== undefined
            ? schedule_data.dial_pattern.fluid
            : "",
        supplementary_food:
          schedule_data !== undefined &&
          schedule_data.dial_pattern !== undefined
            ? schedule_data.dial_pattern.supplementary_food
            : "",
        target_water_removal_amount: cur_waterRemovalAmount,
        max_drainage_amount:
          schedule_data !== undefined &&
          schedule_data.dial_pattern !== undefined
            ? schedule_data.dial_pattern.max_drainage_amount
            : "",
        max_drainage_speed:
          schedule_data !== undefined &&
          schedule_data.dial_pattern !== undefined
            ? schedule_data.dial_pattern.max_drainage_speed
            : "",
        weight_after: schedule_data !== undefined && schedule_data.weight_after != null
          ? schedule_data.weight_after
          : "",
        actualDrainage,
        increase_amount,
        dw_increase_amount,
      }
    );
  };
  prescriptionRender = (pres_array) => {
    let max_length = this.state.drkarte_style !== undefined && this.state.drkarte_style.drkarte_display_width !== undefined ? this.state.drkarte_style.drkarte_display_width : 80;
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

  handleDrProposal = () => {
    this.closeModal();
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");    
    this.props.refreshScheduleInfo(patientInfo.system_patient_id, this.state.schedule_date);
  }
  
  render() {    
    let {treat_monitor_list, cur_disease_list, dialysates} = this.state;
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    let { schedule_data } = this.state;
    if (patientInfo === undefined || patientInfo == null || Object.keys(patientInfo).length === 0) {
      cur_disease_list = [];
      treat_monitor_list = [];
    }
    let syringe_amount,syringe_speed,syringe_stop_time = "";
    if (schedule_data != undefined && schedule_data.dial_anti != undefined && schedule_data.dial_anti.anti_items != undefined &&
      schedule_data.dial_anti.anti_items != null && schedule_data.dial_anti.anti_items.length > 0){
      schedule_data.dial_anti.anti_items.map(item=>{
        if (item.category === "初回量") {
          syringe_amount = item.amount + item.unit;
        } else if (item.category === "持続量") {
          syringe_speed = item.amount + item.unit;
        } else if (item.category === "事前停止") {
          syringe_stop_time = item.amount + item.unit;
        }
      })
    }
    
    //measure data for graph
    let schedule_start_time = '';
    var schedule_start_datetime = '';
    if (schedule_data != undefined){
      if (schedule_data.start_date != null) {
        schedule_start_datetime = schedule_data.start_date;
        schedule_start_time = formatTimeIE(schedule_data.start_date);
      } else {
        if(schedule_data.console_start_date != null) {
          schedule_start_datetime = schedule_data.console_start_date;
          schedule_start_time = formatTimeIE(schedule_data.console_start_date);
        }
      }
    }
    
    var start_time = '';
    if (schedule_start_time != ''){
      start_time = new Date(formatDateTimeIE(schedule_start_datetime));
    }
    // if (this.state.start_time!= undefined && this.state.start_time != null) {
    //     this.min_x = this.setMinX(this.min_x, this.state.start_time);
    // }
    if (start_time != '') {
      this.min_x = this.setMinX(this.min_x, start_time);
    }
    if (this.state.end_time != undefined && this.state.end_time != null){
      this.max_x = this.setMaxX(this.max_x, this.state.end_time);
    }
    
    if (this.min_x != '' && this.max_x != '') {
      // this.min_x.setMinutes(0);
      if (this.change_range_flag == false){
        if (this.max_x.getTime()-this.min_x.getTime() > this.graph_axis.x_range_short*3600*1000){
          this.x_range = this.graph_axis.x_range_long;
          sessApi.setObjectValue("from_graph_monitor", "x_range", this.graph_axis.x_range_long);
        } else {
          this.x_range = this.graph_axis.x_range_short;
          sessApi.setObjectValue("from_graph_monitor", "x_range", this.graph_axis.x_range_short);
        }
      }
      
      if (start_time != '') {
        this.makeTimeListMeasure(new Date(start_time), this.x_range);
      } else {
        sessApi.setObjectValue("from_graph_monitor", "display_measure_data", []);
      }
    } else {
      sessApi.setObjectValue("from_graph_monitor", "display_measure_data", []);
    }
    var temp;
    let graph_table_show = this.graph_table_show;
    if (this.ChartRef.current != null) {
      sessApi.setObjectValue("from_graph_monitor", "graph_base64", this.ChartRef.current.chart.ctx.canvas.toDataURL());
    } else {
      sessApi.setObjectValue("from_graph_monitor", "graph_base64", '');
    }
    return (
      <>
        <Wrapper>
          <LeftContent>
            <div className="dial-chat">
              {/* <button onClick={this.changeX_Range.bind(this)} className="xchange-button">時間軸切り替え</button> */}
              <div className="d-flex xchange-button">
                <Icon icon={faAlarmClock} onClick={this.changeX_Range.bind(this)} style={{cursor:"pointer"}}/>
                {/* <span style={{marginLeft: 20}}>HR</span>
                            <span style={{marginLeft: 15}}>BP</span> */}
              </div>
              <div className={`d-flex`} style={{marginLeft:'0.9rem'}}>
                <div className="" style={{fontSize:'1rem', width:'3.2rem', marginRight:"1.2rem", marginTop:'3rem'}}>
                  <div className="text-center ml-3 mt-1">
                    <div className={``}>血圧</div>
                    <div className="" style={{paddingTop:'0.2rem'}}>
                      <div style={{color: colors.bloodLineColor}}>▼</div>
                      <div style={{marginTop:"-0.5rem",color:colors.bloodLineColor}}>▲</div>
                    </div>
                  </div>
                  <div className="text-center mt-1 ml-3" style={{paddingTop:'1rem'}}>
                    <div>脈拍</div>
                    <div className="" style={{color:colors.pulseLineColor, fontSize:"17px"}}>●</div>
                  </div>
                </div>
                <div className="chat-image">
                  <DialChart
                    showData={this.state.graph_data}
                    applied_data={this.state.applied_data}
                    scheduleData={this.props.schedule_data}
                    showDoneModal = {this.showDoneModal}
                    showTemperature = {this.showTemperature}
                    schedule_date = {this.state.schedule_date}
                    start_time = {this.state.start_time}
                    end_time = {this.state.end_time}
                    x_range = {this.x_range}
                    min_x = {this.min_x}
                    ref = {this.ChartRef}
                  />
                </div>
              </div>
            </div>
            <GraphData>
              <div className="fl text-center moreshow-btn"
                   onClick={this.handleMoreDisplay}
                // onMouseOver={e=>this.showTable(e, this.display_measure_data, this.time_series)}
                // onMouseOut={this.hideTooltip}
              >↓</div>
              <div className="w100p">
                <div className={'fl w100p'} style={{maxHeight:'33vh', overflowY:'auto'}}>
                  <table className="w100p table-bordered">
                    {graph_table_show.ms_target_drainage == "ON" && this.state.table_all_show && (
                      <tr className={`moreshow-area inline-flex`}>
                        <td className={`title`}>除水量設定</td>
                        <td className={`unit`}>L</td>
                        {this.display_measure_data.length > 0 &&
                        Object.keys(this.time_series).map(key =>{
                          if (this.display_measure_data[key] != undefined) {
                            temp = removeLeadZeros(this.display_measure_data[key].ms_target_drainage);
                            return(
                              <>
                                <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                              </>
                            )
                          } else {
                            return(
                              <>
                                <td>&nbsp;</td>
                              </>
                            )
                          }
                        })
                        }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                        return (<><td key={item}></td></>)
                      })}
                      </tr>
                    )}
                    {graph_table_show.ms_drainage_cur_speed == "ON" && (
                      <tr className={`inline-flex`}>
                        <td className={`title`}>除水速度</td>
                        <td className={`unit`}>L/h</td>
                        {this.display_measure_data.length > 0 &&
                        Object.keys(this.time_series).map(key =>{
                          if (this.display_measure_data[key] != undefined) {
                            temp = removeLeadZeros(this.display_measure_data[key].ms_drainage_cur_speed);
                            return(
                              <>
                                <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                              </>
                            )
                          } else {
                            return(
                              <>
                                <td>&nbsp;</td>
                              </>
                            )
                          }
                        })
                        }
                        {this.display_measure_data.length == 0 && this.td_count.map(item=>{
                          return (<><td key={item}></td></>)
                        })}
                      </tr>
                    )}
                    {graph_table_show.ms_cur_drainage == "ON" && (
                      <tr className={`inline-flex`}>
                        <td className={`title`}>除水量積算</td>
                        <td className={`unit`}>L</td>
                        {this.display_measure_data.length > 0 &&
                        Object.keys(this.time_series).map(key =>{
                          if (this.display_measure_data[key] != undefined) {
                            temp = removeLeadZeros(this.display_measure_data[key].ms_cur_drainage);
                            return(
                              <>
                                <td className={this.determinLimit("ms_cur_drainage",this.display_measure_data[key].ms_cur_drainage)?"red-div small-td":"small-td"}>
                                  {temp!=''?renderHTML(temp):''}
                                </td>
                              </>
                            )
                          } else {
                            return(
                              <>
                                <td>&nbsp;</td>
                              </>
                            )
                          }
                        })
                        }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                        return (<><td key={item}></td></>)
                      })}
                      </tr>
                    )}
                    {graph_table_show.ms_blood_target_flow == "ON" && this.state.table_all_show && (
                      <tr className={`moreshow-area inline-flex`}>
                        <td className={`title`}>血流量設定</td>
                        <td className={`unit`}>mL/min</td>
                        {this.display_measure_data.length > 0 &&
                        Object.keys(this.time_series).map(key =>{
                          if (this.display_measure_data[key] != undefined) {
                            temp = removeLeadZeros(this.display_measure_data[key].ms_blood_target_flow);
                            return(
                              <>
                                <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                              </>
                            )
                          } else {
                            return(
                              <>
                                <td>&nbsp;</td>
                              </>
                            )
                          }
                        })
                        }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                        return (<><td key={item}></td></>)
                      })}
                      </tr>
                    )}
                    {graph_table_show.ms_blood_cur_flow == "ON" && (
                      <tr className={`inline-flex`}>
                        <td className={`title`}>血流量</td>
                        <td className={`unit`}>mL/min</td>
                        {this.display_measure_data.length > 0 &&
                        Object.keys(this.time_series).map(key =>{
                          if (this.display_measure_data[key] != undefined) {
                            temp = removeLeadZeros(this.display_measure_data[key].ms_blood_cur_flow);
                            return(
                              <>
                                <td className='small-td'>{temp != null && temp != '' && temp>=0?parseInt(temp):''}</td>
                              </>
                            )
                          } else {
                            return(
                              <>
                                <td>&nbsp;</td>
                              </>
                            )
                          }
                        })
                        }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                        return (<><td key={item}></td></>)
                      })}
                      </tr>
                    )}
                    {graph_table_show.ms_syringe_speed == "ON" && this.state.table_all_show && (
                      <tr className={`moreshow-area inline-flex`}>
                        <td className={`title`}>シリンジポンプ速度設定</td>
                        <td className={`unit`}>mL/h</td>
                        {this.display_measure_data.length > 0 &&
                        Object.keys(this.time_series).map(key =>{
                          if (this.display_measure_data[key] != undefined) {
                            temp = removeLeadZeros(this.display_measure_data[key].ms_syringe_speed);
                            return(
                              <>
                                <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                              </>
                            )
                          } else {
                            return(
                              <>
                                <td>&nbsp;</td>
                              </>
                            )
                          }
                        })
                        }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                        return (<><td key={item}></td></>)
                      })}
                      </tr>
                    )}
                    {graph_table_show.ms_venous_pressure == "ON" && (
                      <tr className={`inline-flex`}>
                        <td className={`title`}>静脈圧</td>
                        <td className={`unit`}>mmHg</td>
                        {this.display_measure_data.length > 0 &&
                        Object.keys(this.time_series).map(key =>{
                          if (this.display_measure_data[key] != undefined) {
                            temp = removeLeadZeros(this.display_measure_data[key].ms_venous_pressure);
                            return(
                              <>
                                <td className='small-td'>{temp != null && temp != ''?parseInt(temp):''}</td>
                              </>
                            )
                          } else {
                            return(
                              <>
                                <td>&nbsp;</td>
                              </>
                            )
                          }
                        })
                        }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                        return (<><td key={item}></td></>)
                      })}
                      </tr>
                    )}
                    {graph_table_show.ms_fluid_pressure == "ON" && (
                      <tr className={`inline-flex`}>
                        <td className={`title`}>透析液圧</td>
                        <td className={`unit`}>mmHg</td>
                        {this.display_measure_data.length > 0 &&
                        Object.keys(this.time_series).map(key =>{
                          if (this.display_measure_data[key] != undefined) {
                            // temp = removeLeadZeros(this.display_measure_data[key].ms_fluid_pressure);
                            temp = this.display_measure_data[key].ms_fluid_pressure;
                            return(
                              <>
                                <td className='small-td'>{temp != null && temp != ''?parseInt(temp):''}</td>
                              </>
                            )
                          } else {
                            return(
                              <>
                                <td>&nbsp;</td>
                              </>
                            )
                          }
                        })
                        }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                        return (<><td key={item}></td></>)
                      })}
                      </tr>
                    )}
                    {graph_table_show.ms_syringe_value == "ON" && this.state.table_all_show && (
                      <tr className={`moreshow-area inline-flex`}>
                        <td className={`title`}>SP積算</td>
                        <td className={`unit`}>mL</td>
                        {this.display_measure_data.length > 0 &&
                        Object.keys(this.time_series).map(key =>{
                          if (this.display_measure_data[key] != undefined) {
                            temp = removeLeadZeros(this.display_measure_data[key].ms_syringe_value);
                            // temp = (this.display_measure_data[key].ms_syringe_value);
                            return(
                              <>
                                <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                              </>
                            )
                          } else {
                            return(
                              <>
                                <td>&nbsp;</td>
                              </>
                            )
                          }
                        })
                        }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                        return (<><td key={item}></td></>)
                      })}
                      </tr>
                    )}
                    {graph_table_show.ms_dialysate_target_temperature == "ON" && this.state.table_all_show && (
                      <tr className={`moreshow-area inline-flex`}>
                        <td className={`title`}>透析液温度設定</td>
                        <td className={`unit`}>℃</td>
                        {this.display_measure_data.length > 0 &&
                        Object.keys(this.time_series).map(key =>{
                          if (this.display_measure_data[key] != undefined) {
                            // temp = removeLeadZeros(this.display_measure_data[key].ms_dialysate_target_temperature);
                            temp = this.display_measure_data[key].ms_dialysate_target_temperature;
                            return(
                              <>
                                <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                              </>
                            )
                          } else {
                            return(
                              <>
                                <td>&nbsp;</td>
                              </>
                            )
                          }
                        })
                        }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                        return (<><td key={item}></td></>)
                      })}
                      </tr>
                    )}
                    
                    {graph_table_show.ms_dialysate_cur_temperature == "ON" && this.state.table_all_show && (
                      <tr className={`moreshow-area inline-flex`}>
                        <td className={`title`}>透析液温度</td>
                        <td className={`unit`}>℃</td>
                        {this.display_measure_data.length > 0 &&
                        Object.keys(this.time_series).map(key =>{
                          if (this.display_measure_data[key] != undefined) {
                            temp = removeLeadZeros(this.display_measure_data[key].ms_dialysate_cur_temperature);
                            return(
                              <>
                                <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                              </>
                            )
                          } else {
                            return(
                              <>
                                <td>&nbsp;</td>
                              </>
                            )
                          }
                        })
                        }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                        return (<><td key={item}></td></>)
                      })}
                      </tr>
                    )}
                    {graph_table_show.ms_dialysate_target_concentration == "ON" && this.state.table_all_show && (
                      <tr className={`moreshow-area inline-flex`}>
                        <td className={`title`}>透析液濃度設定</td>
                        <td className={`unit`}>mS/cm</td>
                        {this.display_measure_data.length > 0 &&
                        Object.keys(this.time_series).map(key =>{
                          if (this.display_measure_data[key] != undefined) {
                            temp = removeLeadZeros(this.display_measure_data[key].ms_dialysate_target_concentration);
                            return(
                              <>
                                <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                              </>
                            )
                          } else {
                            return(
                              <>
                                <td>&nbsp;</td>
                              </>
                            )
                          }
                        })
                        }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                        return (<><td key={item}></td></>)
                      })}
                      </tr>
                    )}
                    {graph_table_show.ms_dialysate_cur_concentration == "ON" && this.state.table_all_show && (
                      <tr className={`moreshow-area inline-flex`}>
                        <td className={`title`}>透析液濃度</td>
                        <td className={`unit`}>mS/cm</td>
                        {this.display_measure_data.length > 0 &&
                        Object.keys(this.time_series).map(key =>{
                          if (this.display_measure_data[key] != undefined) {
                            temp = removeLeadZeros(this.display_measure_data[key].ms_dialysate_cur_concentration);
                            return(
                              <>
                                <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                              </>
                            )
                          } else {
                            return(
                              <>
                                <td>&nbsp;</td>
                              </>
                            )
                          }
                        })
                        }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                        return (<><td key={item}></td></>)
                      })}
                      </tr>
                    )}
                    {graph_table_show.ms_tmp == "ON" && this.state.table_all_show && (
                      <tr className={`moreshow-area inline-flex`}>
                        <td className={`title`}>TMP</td>
                        <td className={`unit`}>mmHg</td>
                        {this.display_measure_data.length > 0 &&
                        Object.keys(this.time_series).map(key =>{
                          if (this.display_measure_data[key] != undefined) {
                            temp = removeLeadZeros(this.display_measure_data[key].ms_tmp);
                            return(
                              <>
                                <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                              </>
                            )
                          } else {
                            return(
                              <>
                                <td>&nbsp;</td>
                              </>
                            )
                          }
                        })
                        }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                        return (<><td key={item}></td></>)
                      })}
                      </tr>
                    )}
                    {graph_table_show.ms_dializer_pressure == "ON" && this.state.table_all_show && (
                      <tr className={`moreshow-area inline-flex`}>
                        <td className={`title`}>ダイアライザ血液入口圧</td>
                        <td className={`unit`}>mmHg</td>
                        {this.display_measure_data.length > 0 &&
                        Object.keys(this.time_series).map(key =>{
                          if (this.display_measure_data[key] != undefined) {
                            temp = removeLeadZeros(this.display_measure_data[key].ms_dializer_pressure);
                            return(
                              <>
                                <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                              </>
                            )
                          } else {
                            return(
                              <>
                                <td>&nbsp;</td>
                              </>
                            )
                          }
                        })
                        }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                        return (<><td key={item}></td></>)
                      })}
                      </tr>
                    )}
                    {graph_table_show.ms_arterial_pressure == "ON" && this.state.table_all_show && (
                      <tr className={`moreshow-area inline-flex`}>
                        <td className={`title`}>脱血圧</td>
                        <td className={`unit`}>mmHg</td>
                        {this.display_measure_data.length > 0 &&
                        Object.keys(this.time_series).map(key =>{
                          if (this.display_measure_data[key] != undefined) {
                            temp = removeLeadZeros(this.display_measure_data[key].ms_arterial_pressure);
                            return(
                              <>
                                <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                              </>
                            )
                          } else {
                            return(
                              <>
                                <td>&nbsp;</td>
                              </>
                            )
                          }
                        })
                        }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                        return (<><td key={item}></td></>)
                      })}
                      </tr>
                    )}
                    {graph_table_show.ms_fluid_target_amount == "ON" && this.state.table_all_show && (
                      <tr className={`moreshow-area inline-flex`}>
                        <td className={`title`}>目標補液量</td>
                        <td className={`unit`}>L</td>
                        {this.display_measure_data.length > 0 &&
                        Object.keys(this.time_series).map(key =>{
                          if (this.display_measure_data[key] != undefined) {
                            temp = removeLeadZeros(this.display_measure_data[key].ms_fluid_target_amount);
                            return(
                              <>
                                <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                              </>
                            )
                          } else {
                            return(
                              <>
                                <td>&nbsp;</td>
                              </>
                            )
                          }
                        })
                        }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                        return (<><td key={item}></td></>)
                      })}
                      </tr>
                    )}
                    {graph_table_show.ms_fluid_speed == "ON" && this.state.table_all_show && (
                      <tr className={`moreshow-area inline-flex`}>
                        <td className={`title`}>補液速度</td>
                        <td className={`unit`}>L/h</td>
                        {this.display_measure_data.length > 0 &&
                        Object.keys(this.time_series).map(key =>{
                          if (this.display_measure_data[key] != undefined) {
                            temp = removeLeadZeros(this.display_measure_data[key].ms_fluid_speed);
                            return(
                              <>
                                <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                              </>
                            )
                          } else {
                            return(
                              <>
                                <td>&nbsp;</td>
                              </>
                            )
                          }
                        })
                        }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                        return (<><td key={item}></td></>)
                      })}
                      </tr>
                    )}
                    {graph_table_show.ms_fluid_cur_amount == "ON" && this.state.table_all_show && (
                      <tr className={`moreshow-area inline-flex`}>
                        <td className={`title`}>補液量積算</td>
                        <td className={`unit`}>L</td>
                        {this.display_measure_data.length > 0 &&
                        Object.keys(this.time_series).map(key =>{
                          if (this.display_measure_data[key] != undefined) {
                            temp = removeLeadZeros(this.display_measure_data[key].ms_fluid_cur_amount);
                            return(
                              <>
                                <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                              </>
                            )
                          } else {
                            return(
                              <>
                                <td>&nbsp;</td>
                              </>
                            )
                          }
                        })
                        }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                        return (<><td key={item}></td></>)
                      })}
                      </tr>
                    )}
                    {graph_table_show.ms_fluid_target_temperature == "ON" && this.state.table_all_show && (
                      <tr className={`moreshow-area inline-flex`}>
                        <td className={`title`}>補液温度設定</td>
                        <td className={`unit`}>℃</td>
                        {this.display_measure_data.length > 0 &&
                        Object.keys(this.time_series).map(key =>{
                          if (this.display_measure_data[key] != undefined) {
                            temp = removeLeadZeros(this.display_measure_data[key].ms_fluid_target_temperature);
                            return(
                              <>
                                <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                              </>
                            )
                          } else {
                            return(
                              <>
                                <td>&nbsp;</td>
                              </>
                            )
                          }
                        })
                        }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                        return (<><td key={item}></td></>)
                      })}
                      </tr>
                    )}
                    {graph_table_show.ms_fluid_cur_temperature == "ON" && this.state.table_all_show && (
                      <tr className={`moreshow-area inline-flex`}>
                        <td className={`title`}>補液温度</td>
                        <td className={`unit`}>℃</td>
                        {this.display_measure_data.length > 0 &&
                        Object.keys(this.time_series).map(key =>{
                          if (this.display_measure_data[key] != undefined) {
                            temp = removeLeadZeros(this.display_measure_data[key].ms_fluid_cur_temperature);
                            return(
                              <>
                                <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                              </>
                            )
                          } else {
                            return(
                              <>
                                <td>&nbsp;</td>
                              </>
                            )
                          }
                        })
                        }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                        return (<><td key={item}></td></>)
                      })}
                      </tr>
                    )}
                    {graph_table_show.ms_hdf_count == "ON" && this.state.table_all_show && (
                      <tr className={`moreshow-area inline-flex`}>
                        <td className={`title`}>補液回数</td>
                        <td className={`unit`}>回</td>
                        {this.display_measure_data.length > 0 &&
                        Object.keys(this.time_series).map(key =>{
                          if (this.display_measure_data[key] != undefined) {
                            temp = this.display_measure_data[key].ms_hdf_count;
                            if (temp == undefined || temp == null) temp = '';
                            if (isNaN(parseInt(temp))){
                              temp = removeLeadZeros(temp);
                            } else {
                              temp = parseInt(temp);
                            }
                            return(
                              <>
                                <td className='small-td'>{temp}</td>
                              </>
                            )
                          } else {
                            return(
                              <>
                                <td>&nbsp;</td>
                              </>
                            )
                          }
                        })
                        }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                        return (<><td key={item}></td></>)
                      })}
                      </tr>
                    )}
                    {graph_table_show.ms_hdf_amount == "ON" && this.state.table_all_show && (
                      <tr className={`moreshow-area inline-flex`}>
                        <td className={`title`}>総補液積算</td>
                        <td className={`unit`}>L</td>
                        {this.display_measure_data.length > 0 &&
                        Object.keys(this.time_series).map(key =>{
                          if (this.display_measure_data[key] != undefined) {
                            temp = this.display_measure_data[key].ms_hdf_amount;
                            if (temp == undefined || temp == null) temp = '';
                            if (isNaN(parseFloat(temp))){
                              temp = removeLeadZeros(temp);
                            } else {
                              temp = parseFloat(temp).toFixed(1);
                            }
                            return(
                              <>
                                <td className='small-td'>{temp}</td>
                              </>
                            )
                          } else {
                            return(
                              <>
                                <td>&nbsp;</td>
                              </>
                            )
                          }
                        })
                        }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                        return (<><td key={item}></td></>)
                      })}
                      </tr>
                    )}
                    {graph_table_show.ms_emergency_amount == "ON" && this.state.table_all_show && (
                      <tr className={`moreshow-area inline-flex`}>
                        <td className={`title`}>緊急総補液量</td>
                        <td className={`unit`}>mL</td>
                        {this.display_measure_data.length > 0 &&
                        Object.keys(this.time_series).map(key =>{
                          if (this.display_measure_data[key] != undefined) {
                            temp = removeLeadZeros(this.display_measure_data[key].ms_emergency_amount);
                            return(
                              <>
                                <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                              </>
                            )
                          } else {
                            return(
                              <>
                                <td>&nbsp;</td>
                              </>
                            )
                          }
                        })
                        }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                        return (<><td key={item}></td></>)
                      })}
                      </tr>
                    )}
                    {graph_table_show.input_time == "ON" && (
                      <tr className={`inline-flex`}>
                        <td className={`title`}>入力時間</td>
                        <td className={`unit`}></td>
                        {this.display_measure_data.length > 0 &&
                        Object.keys(this.time_series).map(key =>{
                          if (this.display_measure_data[key] != undefined) {
                            return(
                              <>
                                <td className='small-td'>{formatTimeIE(this.display_measure_data[key].input_time)}</td>
                              </>
                            )
                          } else {
                            return(
                              <>
                                <td>&nbsp;</td>
                              </>
                            )
                          }
                        })
                        }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                        return (<><td key={item}></td></>)
                      })}
                      </tr>
                    )}
                  </table>
                </div>
              </div>
            </GraphData>
          </LeftContent>
          <RightContent>
            <div className="d-flex button-area">
              <Button className={this.state.view_type == "disease" ? "disable-btn" : ""} onClick={this.setViewType.bind(this,"disease")}>現症・Dr指示</Button>
              <Button className={this.state.view_type == "dial_condition" ? "disable-btn" : ""} onClick={this.setViewType.bind(this,"dial_condition")}>透析条件</Button>
              <Button className={this.state.view_type == "drainge_set" ? "disable-btn" : ""} onClick={this.setViewType.bind(this,"drainge_set")}>体重・除水設定</Button>
            </div>
            {this.state.view_type == 'disease' && (
              <>
                <div className="current-state current_diseases border border-dark">
                  <div className="border-bottom border-dark flex">
                    <div className="w-50" style={{fontSize:'1.5rem', paddingLeft:'1rem', background:'lightgray'}}>現  症</div>
                    <div className="text-right w-50" style={{cursor:"pointer",paddingRight: "0.1rem",paddingTop:'0.3rem', background:'lightgray'}} onClick={ this.OpenInputPanelModal.bind(this) }>
                      <PlusIcon icon={faPlus} />現症を追加
                    </div>
                  </div>
                  <div className="disease-content" id="disease_area">
                    {cur_disease_list !== undefined && cur_disease_list != null ? cur_disease_list.map ((item, idx)=>{
                      return (
                        <div
                          key={idx}
                          onContextMenu={e => this.handleClick(e, item)}
                          onMouseOver={e=>this.showTitle(e, cur_disease_list)}
                          onMouseOut={this.hideTooltip}
                          className={this.monitor_current_disease_line == 'ON'?'border-line':''}
                        >
                          {displayLineBreak(item.body)}
                        </div>
                      )}
                    ):(<>
                      {cur_disease_list !== undefined && cur_disease_list.length == 0 ? (<></>) : (
                        <>
                          <div className={'loaded-area'}>
                            <SpinnerWrapper>
                              <Spinner animation="border" variant="secondary" />
                            </SpinnerWrapper>
                          </div>
                        </>)}
                    </>)}
                  
                  </div>
                </div>
                <div className="instruction current_diseases border border-dark">
                  <div className="border-bottom border-dark" style={{fontSize:'1.5rem', paddingLeft:'1rem', background:'lightgray'}}>Dr指示</div>
                  <div className="disease-content" id = 'instruct-area'>
                    {treat_monitor_list !==undefined && treat_monitor_list != [] ? (
                      treat_monitor_list.map((item) => {
                        var body = displayLineBreak(renderHTML(item.body));
                        var is_borderline = true;
                        if (item.category_1 == 'Drカルテ' && item.category_2 == '定期処方') body = '[定期薬]　変更';
                        if (item.category_1 == 'Drカルテ' && item.category_2 == '定期処方' && item.export_destination == "Dr指示") body = '[定期薬]　処方';
                        if (item.category_1 == 'Drカルテ' && item.category_2 == '定期処方' && item.export_destination == "Dr指示_削除") body = '[定期薬]　削除';
                        if (item.category_1 == 'Drカルテ' && item.category_2 == '臨時処方' && this.IsJsonString(item.body)) {
                          body = this.prescriptionRender(JSON.parse(item.body));
                          is_borderline = false;
                        }
                        if (body != "")
                        return(
                          <>
                            <div key={item} onMouseOver={e=>this.showTitle(e, treat_monitor_list)} onMouseOut={this.hideTooltip}                              
                              className={is_borderline && this.monitor_dr_line == 'ON'?'border-line':''}>
                              {body}
                            </div>
                            {!is_borderline && (
                              <div style={{clear:"both"}} className={this.monitor_dr_line == 'ON'?'border-line':''}></div>
                            )}
                          </>
                        )
                      })
                    ) : (<>{treat_monitor_list == [] ? (<></>): (
                      <div className={'loaded-area'}>
                        <SpinnerWrapper style={{height: 100}}>
                          <Spinner animation="border" variant="secondary" />
                        </SpinnerWrapper>
                      </div>
                    )}
                    </>)}
                  
                  </div>
                </div>
              </>
            )}
            {this.state.view_type == "dial_condition" && (
              <table className='right-table table-scroll table table-bordered table-hover'>
                <tr>
                  <td className="data-label">回診医師</td>
                  <td>
                    {this.state.instruction_doctor != undefined ? this.state.instruction_doctor : ''}
                  </td>
                </tr>
                <tr>
                  <td className="data-label">DW</td>
                  <td>{schedule_data !== undefined && schedule_data.dial_pattern !==undefined && schedule_data.dial_pattern.dw != "" ?parseFloat(schedule_data.dial_pattern.dw).toFixed(1)+"㎏":""}</td>
                </tr>
                <tr>
                  <td className="right-data-label">治療法</td>
                  <td>
                    {schedule_data !== undefined && schedule_data.method_data !== undefined &&
                    schedule_data.dial_pattern !== undefined ?
                      schedule_data.method_data[schedule_data.dial_pattern.dial_method] : ""}
                  </td>
                </tr>
                <tr>
                  <td className="data-label">血流量</td>
                  <td>{schedule_data !== undefined && schedule_data.dial_pattern !==undefined && schedule_data.dial_pattern.blood_flow != null && schedule_data.dial_pattern.blood_flow !== "" ?
                    schedule_data.dial_pattern.blood_flow+"mL/min":""}</td>
                </tr>
                <tr>
                  <td className="right-data-label">透析液</td>
                  <td>{schedule_data !== undefined && schedule_data.dial_pattern !== undefined && dialysates !== undefined && dialysates != null && schedule_data.dial_pattern.dial_liquid !== undefined &&
                  schedule_data.dial_pattern.dial_liquid != null && dialysates[schedule_data.dial_pattern.dial_liquid] != null ? dialysates[schedule_data.dial_pattern.dial_liquid] : ""}</td>
                </tr>
                <tr>
                  <td className="data-label">ダイアライザ</td>
                  <td>{schedule_data !== undefined && schedule_data.dial_dialyzer !== undefined && schedule_data.dial_dialyzer !== null &&
                  schedule_data.dial_dialyzer[0] !== undefined && schedule_data.dial_dialyzer[0] !== null ?
                    schedule_data.dial_dialyzer[0].name: " "}
                  </td>
                </tr>
                <tr>
                  <td className="data-label">抗凝固剤</td>
                  <td>{schedule_data !== undefined && schedule_data.dial_anti !== undefined && schedule_data.dial_anti !== null?schedule_data.dial_anti.title : ""}</td>
                </tr>
                <tr>
                  <td className="data-label">初回投与量</td>
                  <td>{syringe_amount !== undefined && syringe_amount !== "" ? syringe_amount : ""}</td>
                </tr>
                <tr>
                  <td className="right-data-label">持続量</td>
                  <td>{syringe_speed !== undefined && syringe_speed !== "" ? syringe_speed : ""}</td>
                </tr>
                <tr>
                  <td className="data-label">事前停止</td>
                  <td>{syringe_stop_time !== undefined && syringe_stop_time !== "" ? syringe_stop_time : ""}</td>
                </tr>
              </table>
            )}
            {this.state.view_type == "drainge_set" && (
              <table className='right-table table-scroll table table-bordered table-hover'>
                <tr>
                  <td className="data-label">前回体重</td>
                  <td>{schedule_data !== undefined && schedule_data.prev_weight_after !==undefined && schedule_data.prev_weight_after != null && schedule_data.prev_weight_after >0 ?parseFloat(schedule_data.prev_weight_after).toFixed(1) +"㎏":""}</td>
                  <td className="right-data-label">本日目標体重</td>
                  <td>{this.state.target_weight >0 ? parseFloat(this.state.target_weight).toFixed(1) + "kg" : ''}</td>
                </tr>
                <tr>
                  <td className="data-label">DW</td>
                  <td>{schedule_data !== undefined && schedule_data.dial_pattern !==undefined && schedule_data.dial_pattern.dw > 0 ?parseFloat(schedule_data.dial_pattern.dw).toFixed(1)+"㎏":""}</td>
                  <td className="right-data-label">本日目標除水量</td>
                  <td>{this.state.today_water_removal_amount > 0 ? parseFloat(this.state.today_water_removal_amount).toFixed(2) + "kg" : ''}
                  </td>
                </tr>
                <tr>
                  <td className="data-label">前体重</td>
                  <td>{this.state.weight_before>0 ? parseFloat(this.state.weight_before).toFixed(1) + 'kg' : ''}</td>
                  <td className="right-data-label">補液</td>
                  <td>{this.state.fluid != '' && !isNaN(this.state.fluid) ? this.state.fluid + 'kg' : ''}</td>
                </tr>
                <tr>
                  <td className="data-label">前回からの増加量</td>
                  <td>{this.state.increase_amount > 0 ? parseFloat(this.state.increase_amount).toFixed(1) + 'kg' : ''}</td>
                  <td className="right-data-label">補食</td>
                  <td>{this.state.supplementary_food != '' && !isNaN(this.state.supplementary_food)? this.state.supplementary_food + 'kg' : ''}</td>
                </tr>
                <tr>
                  <td className="data-label">DWからの増加量</td>
                  <td>{this.state.dw_increase_amount !== '' && !isNaN(this.state.dw_increase_amount)? parseFloat(this.state.dw_increase_amount).toFixed(1) + 'kg' : ''}</td>
                  <td className="right-data-label">除水量設定</td>
                  <td>{this.state.target_water_removal_amount != '' && !isNaN(this.state.target_water_removal_amount) ? this.state.target_water_removal_amount + 'L' : ''}</td>
                </tr>
                <tr>
                  <td className="data-label"> </td>
                  <td> </td>
                  <td className="right-data-label">除水速度</td>
                  <td>{this.state.drainage_speed != '' && !isNaN(this.state.drainage_speed)? this.state.drainage_speed + 'L/h' : ''}</td>
                </tr>
                <tr>
                  <td className="data-label">後体重</td>
                  <td>{this.state.weight_after >0 ? parseFloat(this.state.weight_after).toFixed(1) + 'kg' : ''}</td>
                  <td className="right-data-label">最大除水量</td>
                  <td>{this.state.max_drainage_amount != '' && !isNaN(this.state.max_drainage_amount) ? this.state.max_drainage_amount + 'L' : ''}</td>
                </tr>
                <tr>
                  <td className="data-label">実除水</td>
                  <td>{this.state.actualDrainage != '' && !isNaN(this.state.actualDrainage)? this.state.actualDrainage + 'kg' : ''}</td>
                  <td className="right-data-label">最大除水速度</td>
                  <td>{this.state.max_drainage_speed != '' && !isNaN(this.state.max_drainage_speed) ? this.state.max_drainage_speed + 'L/h' : ''}</td>
                </tr>
              </table>
            )}
            <ContextMenu
              {...this.state.contextMenu}
              parent={this}
              selected_item={this.state.selected_item}
            />            
          </RightContent>
          
          {this.state.isOpenTemperatureModal && (
            <TemperatureModal
              setHandleTempData={this.setHandleTempData}
              closeModal={this.closeTemperatureModal}
              rows_temp={this.state.rows_temp}
              only_show={1}
            />
          )}
          {this.state.done_modal_inspection && (
            <DoneGeneralModal
              done_list={this.props.done_inspection}
              modal_title ="検査"
              closeModal={this.closeModal}
              saveEditedSchedule={this.saveEditedSchedule}
              timing = {this.state.timing}
            />
          )}
          {this.state.done_modal_injection && (
            <DoneGeneralModal
              done_list={this.props.done_injection}
              modal_title ="注射"
              closeModal={this.closeModal}
              saveEditedSchedule={this.saveEditedSchedule}
              timing = {this.state.timing}
            />
          )}
          {this.state.done_modal_dial_pres && (
            <DoneGeneralModal
              done_list={this.props.done_dial_pres}
              modal_title ="透析中処方"
              closeModal={this.closeModal}
              saveEditedSchedule={this.saveEditedSchedule}
              timing = {this.state.timing}
            />
          )}
          {this.state.isOpenMedicalHistoryModal && (
            <InputPanel
              handleOk={this.handleOk}
              closeModal={this.closeModal}
              kind="現症"
              patient_id = {patientInfo.system_patient_id}
              schedule_date={this.props.schedule_date}
              item={this.state.modal_data}
            />
          )}
          {this.state.isDrProposalModal && (
            <InputPanel
              handleOk={this.handleDrProposal}
              closeModal={this.closeModal}
              kind='Dr上申'
              patient_id = {patientInfo.system_patient_id}
              schedule_date={this.props.schedule_date}
              item={this.state.item}
              source = {this.state.source}
              handover_relation = {this.state.handover_relation}
            />
          )}
          {this.state.isDeleteConfirmModal && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.deleteDisease.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.alert_messages !== "" && (
          <AlertNoFocusModal
            hideModal= {this.closeModal.bind(this)}
            handleOk= {this.closeModal.bind(this)}
            showMedicineContent= {this.state.alert_messages}
            title={this.state.confirm_alert_title}
          />
        )}
        </Wrapper>
        <Tooltip
          {...this.state.tooltip}
          parent={this}
        />
        <TooltipTitle
          {...this.state.tooltipTitle}
          parent={this}
        />
      </>
    )
  }
}

GraphMonitor.contextType = Context;

GraphMonitor.propTypes = {
  schedule_data: PropTypes.object,
  patientInfo: PropTypes.object,
  patientId: PropTypes.number,
  rows_blood: PropTypes.array,
  rows_measure: PropTypes.array,
  rows_temp: PropTypes.array,
  done_inspection: PropTypes.array,
  done_injection: PropTypes.array,
  done_dial_pres: PropTypes.array,
  done_status: PropTypes.object,
  saveEditedSchedule: PropTypes.func,
  schedule_date : PropTypes.string,
  disease_history : PropTypes.array,
  instruction_list : PropTypes.array,
  getCurDiseaseInfo : PropTypes.func,
  setDisplayZoom : PropTypes.func,
  setHandleTempData : PropTypes.func,
  openLoginModal : PropTypes.func,
  instruction_doctor : PropTypes.string,
  refreshScheduleInfo : PropTypes.func
};

export default GraphMonitor