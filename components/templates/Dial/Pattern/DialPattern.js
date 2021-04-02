import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "../../../_nano/colors";
import Button from "../../../atoms/Button";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import Checkbox from "../../../molecules/Checkbox";
import InputWithLabel from "../../../molecules/InputWithLabel";
import ReactDataGrid from "react-data-grid";
import { Editors, Menu } from "react-data-grid-addons";
import {
  formatDateSlash,
  formatDateLine,
  formatTime,
  formatTimePicker,
  formatJapanDateSlash,
  formatJapan,
} from "~/helpers/date";
import DialSideBar from "../DialSideBar";
import DialPatientNav from "../DialPatientNav";
import * as apiClient from "~/api/apiClient";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import axios from "axios/index";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as methods from "~/components/templates/Dial/DialMethods";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import Context from "~/helpers/configureStore";
import PropTypes from "prop-types";
import { getTimeZoneList } from "~/components/templates/Dial/DialMethods/getSystemTimeZone";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import PatternDeleteConfirmModal from "~/components/templates/Dial/modals/PatternDeleteConfirmModal";
import renderHTML from "react-render-html";
import {CACHE_SESSIONNAMES, getServerTime} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import { Dial_telegram_field, makeList_codeName, toHalfWidthOnlyNumber} from "~/helpers/dialConstants";
import PatternUpdateConfirmModal from "~/components/templates/Dial/modals/PatternUpdateConfirmModal";
registerLocale("ja", ja);
import {addRedBorder, removeRedBorder, addRequiredBg, removeRequiredBg} from "~/helpers/dialConstants";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from "jquery";
import DialPatternHistoryModal from "./Modal/DialPatternHistoryModal";
import DialPatternConsentModal from "./Modal/DialPatternConsentModal";

const Card = styled.div`
  padding: 1.25rem;
  position: fixed;
  top: 70px;
  left: 200px;
  width: calc(100% - 390px);
  margin: 0px;
  height: calc(100vh - 70px);
  float: left;
  .flex {
    display: flex;
  }
  .title {
    font-size: 2rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;
    width: 15rem;
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
  .bodywrap {
    display: flex;
    height: calc(100% - 6rem);
  }
  background-color: ${surface};
  button {
    margin-bottom: 0.625rem;
    margin-left: 0.625rem;
  }
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .padding {
    float: right;
    margin-top: -2rem;
    label {
      font-size: 1rem;
    }
  }
  .react-datepicker-popper {
    z-index: 2;
  }
  .top-table {
    display: flex;
    height: calc(100% - 39rem);
  }
  .dial-list {
    width: calc(100% - 10rem);
    height: calc(100% - 1rem);
    margin-top: 0.625rem;
    border: solid 1px rgb(206, 212, 218);
    overflow-y: hidden;
    overflow-x: hidden;
    display: flex;
    font-size: 1rem;
    flex-wrap: wrap;
    .row {
      width: 100%;
    }
    .row:hover {
      background-color: rgb(246, 252, 253);
      cursor: pointer;
    }
    .dial-period {
      width: 20%;
    }
    .col-md-1 {
      max-width: 6%;
    }
    .col-md-2 {
      max-width: 12%;
    }
    .col-md-3 {
      max-width: 16%;
    }
    .table-header {
      display: flex;
      width: calc(100% - 16px);
      margin-top: -1px;
      .bt-1p {
        border-top: 1px solid #aaa;
      }
      .br-1p {
        border-right: 1px solid #aaa;
      }
      .bb-1p {
        border-bottom: 1px solid #aaa;
      }
      .bl-1p {
        border-left: 1px solid #aaa;
      }
      .pattern-index {
        width: 2.15rem;
        text-align: right;
        padding-right: 0.2rem;
      }
      .pattern-week-day {
        width: 3.1rem;
        text-align: center;
      }
      .pattern-time_zone {
        width: 4rem;
        text-align: center;
      }
      .pattern-bed_no {
        width: 5rem;
        text-align: center;
      }
      .pattern-console {
        width: 6rem;
        text-align: center;
      }
      .pattern-scheduled_start_time {
        width: 7rem;
        text-align: center;
      }
      .pattern-reservation_time {
        width: 5rem;
        text-align: center;
      }

      .pattern-dial_method {
        width: calc(100% - 52.25rem);
        text-align: center;
      }
      .pattern-group {
        width: 7.5rem;
        text-align: center;
      }
      .pattern-time_limit_from {
        text-align: center;
        width: 12.45rem;
      }
      .pattern-time_limit_to {
        text-align: center;
        width: 6.25rem;
      }
    }
  }
  .dial-body {
    width: 100%;
    height: 308px;
    .react-grid-Grid {
      min-height: 290px !important;
    }
    .react-grid-Viewport {
      height: 230px;
    }
    .react-grid-Canvas {
      height: 230px !important;
      overflow-y: hidden !important;
    }
    .react-grid-Container {
      font-size: 1rem;
      .react-grid-Canvas {
      }
      // .react-grid-Canvas::-webkit-scrollbar {
      //     width: 12px!important;
      // }
      // /* Track */
      // .react-grid-Canvas::-webkit-scrollbar-track {
      //     -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3)!important;
      //     -webkit-border-radius: 10px!important;
      //     border-radius: 10px!important;
      // }
      //
      // /* Handle */
      // .react-grid-Canvas::-webkit-scrollbar-thumb {
      //     -webkit-border-radius: 10px!important;
      //     border-radius: 10px!important;
      //     background: rgba(255,0,0,0.8)!important;
      //     -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5)!important;
      // }
      // .react-grid-Canvas::-webkit-scrollbar-thumb:window-inactive {
      //     background: rgba(255,0,0,0.4)!important;
      // }
    }
    .react-grid-Header {
      border-bottom: 3px solid black !important;
    }
    .react-grid-HeaderCell {
      border-bottom: 3px solid black !important;
      display: flex !important;
      align-items: center;
      .widget-HeaderCell__value {
        width:100%;
        text-align:center;
      }
    }

    .bold-border {
      border-right: 3px solid black !important;
    }

    .week-name-area {
      margin-right: -1px;
      z-index: 2;
      .week-name {
        display: flex;
        align-items: center;
        font-weight: bold;
        height: 61px;
        border-bottom: 3px solid black !important;
        border-right: 3px solid black !important;
        border-left: 1px solid #dddddd;
        border-top: 1px solid #dddddd;
        width: 55px;
        label {
          width: 100%;
          text-align: center;
          margin: 0;
        }
        
      }
      .week-day {
        display: flex;
        align-items: center;
        height: 30px;
        border-right: 3px solid black !important;
        border-left: 1px solid #dddddd;
        border-bottom: 1px solid #dddddd;
        width: 55px;
        label {
          margin: 0;
          width:100%;
          text-align:center;
        }
      }
    }
  }
  .dial-oper {
    align-items: flex-start;
    justify-content: space-between;
    label {
      font-size: 1rem;
    }
    margin-bottom: 0.5rem;
    .row .col-md-3 label {
      width: 5.625rem;
      text-align: right;
      margin-right: 0.5rem;
      margin-top: 0.375rem;
      margin-bottom: 0;
    }
    .right-area {
      .remove-x-input {
        input {
          width: calc(100% - 5rem);
          height:2.5rem;
        }
      }
    }
    
  }

  .react-datepicker-wrapper {
    width: 7rem;
    .react-datepicker__input-container {
      width: 100%;
      input {
        font-size: 1rem;
        width: 100%;
        height: 2.5rem;
        border-radius: 0.5rem;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(206, 212, 218);
        border-image: initial;
        padding: 0px 0.5rem;
      }
    }
  }
  .period {
    display: flex;
    div {
      margin-top:0;
    }
    label {
      font-size: 1rem;
      text-align: right;
      width: 3.5rem;
      margin-right: 0.5rem;
      line-height:2.5rem;
      margin-bottom:0;
      margin-top:0;
    }
  }
  .from-padding {
    padding-left: 0.3rem;
    label {
      width: 1.25rem;
    }
  }
  .App {
    font-family: sans-serif;
    text-align: center;
  }
  .delete-date {
    div {
      margin-top:0;
    }
    label {
      font-size: 1rem;
      text-align: right;
      width: 3.5rem;
      margin-right: 0.5rem;
      line-height:2.5rem;
      margin-top:0;
      margin-bottom:0;
    }
    .from-to {
      line-height: 2.5rem;
      padding-left: 0.5rem;
    }
    input {
      font-size: 1rem;
    }
  }
  .input-time {
    display: flex;
    label {
      font-size: 1rem;
      margin-top: 0.5rem;
      margin-bottom: 0;
      width: 5rem;
      text-align: right;
      margin-right: 0.5rem;
    }
    input {
      font-size: 1rem;
    }
    div {
      margin-top:0;
    }
    .react-datepicker-popper {
      left: -40px !important;
      .react-datepicker__triangle {
        left: 70px !important;
      }
    }
  }
  .entry-time {
  }
  .final-info {
    padding-left: 6.875rem;
    padding-top: 0.3rem;
    font-size: 1rem;
  }
  .input-info {
    input {
      width: 15rem;
    }
    label {
      width: 5rem;
      text-align: right;
      margin-top:0;
      margin-bottom:0;
      line-height:2.5rem;
    }
  }

  .react-contextmenu {
    min-width: 10rem;
    padding: 0.3rem 0;
    margin: 2px 0 0;
    font-size: 1rem;
    color: #373a3c;
    text-align: left;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 0.25rem;
    outline: none;
    opacity: 0;
    pointer-events: none;
    transition: opacity 250ms ease !important;
  }

  .react-contextmenu.react-contextmenu--visible {
    opacity: 1;
    pointer-events: auto;
  }

  .react-contextmenu-item {
    padding: 3px 1.25rem;
    font-weight: 400;
    line-height: 1.5;
    color: #373a3c;
    text-align: inherit;
    white-space: nowrap;
    background: 0 0;
    border: 0;
    cursor: pointer;
  }

  .react-contextmenu-item.react-contextmenu-item--active,
  .react-contextmenu-item.react-contextmenu-item--selected {
    color: #fff;
    background-color: #20a0ff;
    border-color: #20a0ff;
    text-decoration: none;
  }

  .react-contextmenu-item.react-contextmenu-item--disabled,
  .react-contextmenu-item.react-contextmenu-item--disabled:hover {
    color: #878a8c;
    background-color: transparent;
    border-color: rgba(0, 0, 0, 0.15);
  }

  .react-contextmenu-item--divider {
    margin-bottom: 3px;
    padding: 2px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    cursor: inherit;
  }
  .react-contextmenu-item--divider:hover {
    background-color: transparent;
    border-color: rgba(0, 0, 0, 0.15);
  }

  .react-contextmenu-item.react-contextmenu-submenu {
    padding: 0;
  }

  .react-contextmenu-item.react-contextmenu-submenu > .react-contextmenu-item {
  }

  .react-contextmenu-item.react-contextmenu-submenu
    > .react-contextmenu-item:after {
    content: "▶";
    display: inline-block;
    position: absolute;
    right: 0.5rem;
  }

  .example-multiple-targets::after {
    content: attr(data-count);
    display: block;
  }
  .final-input {
    padding-left: 2rem;
  }
`;

const DialDataBox = styled.div`
  width: 100%;
  font-size: 1rem;
  height: calc(100% - 1.5rem);
  overflow-y: scroll;
  .row {
    padding-bottom: 0.3rem;
    text-align: center;
    margin: 0;
  }
  .pattern-list {
    cursor: pointer;
    display: flex;
    margin-top: -1px;
    .bt-1p {
      border-top: 1px solid #aaa;
    }
    .br-1p {
      border-right: 1px solid #aaa;
    }
    .bb-1p {
      border-bottom: 1px solid #aaa;
    }
    .bl-1p {
      border-left: 1px solid #aaa;
    }
  }
  .selected {
    background: lightblue;
  }
  .pattern-list:hover {
    background: #e2e2e2;
  }
  .selected : hover {
    background: lightblue;
  }
  .pattern-index {
    width: 2.25rem;
    text-align: right;
    padding-right: 0.2rem;
  }
  .pattern-area {
    width: calc(100% - 14.5rem);
  }
  .pattern-week-day {
    width: 3rem;
    padding-left: 0.3rem;
  }
  .pattern-time_zone {
    width: 4rem;
    padding-left: 0.3rem;
  }
  .pattern-bed_no {
    width: 5rem;
    padding-left: 0.3rem;
  }
  .pattern-console {
    width: 6rem;
    padding-left: 0.3rem;
  }
  .pattern-scheduled_start_time {
    width: 7rem;
    padding-left: 0.3rem;
  }
  .pattern-reservation_time {
    width: 5rem;
    padding-left: 0.3rem;
  }

  .pattern-dial_method {
    width: calc(100% - 37.5rem);
    padding-left: 0.3rem;
  }
  .pattern-group {
    width: 7.5rem;
    padding-left: 0.3rem;
  }
  .pattern-time_limit_from {
    padding-left: 0.3rem;
    width: 6.25rem;
  }
  .pattern-time_limit_to {
    padding-left: 0.3rem;
    width: 6.25rem;
  }
`;

const ContextMenuUl = styled.ul`
  margin-bottom:0px;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    left: 1240px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 5rem;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
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
`;

const ContextMenuPatternBox = ({visible,x,y,item,parent,}) => {  
  if (visible) {
    return (
      <ContextMenuUl>
      <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
        <li onClick={() =>parent.showHistoryModal(item)}><div>変更履歴</div></li>        
      </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const { DropDownEditor } = Editors;

let bed_nos = [{ id: 0, value: "", console: "" }];
const BedNoEditor = <DropDownEditor options={bed_nos} />;

let timezones = [{ id: 0, value: "" }];

const TimezoneEditor = <DropDownEditor options={timezones} />;

let consoles = [{ id: 0, value: "" }];
const ConsoleEditor = <DropDownEditor options={consoles} />;

let dial_tiems = [
  { id: 0, value: "" },
  { id: 1, value: "3:00" },
  { id: 2, value: "3:30" },
  { id: 3, value: "4:00" },
  { id: 4, value: "4:30" },
  { id: 5, value: "4:45" },
  { id: 6, value: "5:00" },
  { id: 7, value: "6:00" },
  { id: 8, value: "6:30" },
  { id: 9, value: "7:00" },
  { id: 10, value: "" },
];
const DialTimeEditor = <DropDownEditor options={dial_tiems} />;

let dial_start_tiems = [{ id: 0, value: "" }];
const DialStartTimeEditor = <DropDownEditor options={dial_start_tiems} />;

let dial_finish_tiems = [{ id: 0, value: "" }];
const DialFinishTimeEditor = <DropDownEditor options={dial_finish_tiems} />;

const dialGroups = [{ id: 0, value: "" }];
const GroupEditor = <DropDownEditor options={dialGroups} />;

const dialGroups2 = [{ id: 0, value: "" }];
const GroupEditor2 = <DropDownEditor options={dialGroups2} />;

let dialMethods = [{ id: 0, value: "" }];
const DialMethodEditor = <DropDownEditor options={dialMethods} />;

const dialysates = [{ id: 0, value: "" }];
const DialysateEditor = <DropDownEditor options={dialysates} />;

const puncture_needle_A = [{ id: 0, value: "" }];
const Puncture_needle_AEditor = <DropDownEditor options={puncture_needle_A} />;

const puncture_needle_V = [{ id: 0, value: "" }];
const Puncture_needle_VEditor = <DropDownEditor options={puncture_needle_V} />;

const fixedTapes = [{ id: 0, value: "" }];
const FixedTapesEditor = <DropDownEditor options={fixedTapes} />;

const antisepticLiquids = [{ id: 0, value: "" }];
const AntisepticLiquidsEditor = <DropDownEditor options={antisepticLiquids} />;

const dilution_timings = [
  { id: 0, value: "" },
  { id: 1, value: "前補液" },
  { id: 2, value: "後補液" },
];
const Dilution_timingsEditor = <DropDownEditor options={dilution_timings} />;

let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
let default_values = init_status.dial_method_default;

const { ContextMenu, MenuItem, ContextMenuTrigger } = Menu;

const ExampleContextMenu = ({ idx, id, rowIdx, parent }) => {
  if (rowIdx !== 0) {
    return (
      <ContextMenu id={id}>
        {rowIdx === 1 && ( //月
          <>
            <MenuItem
              data={{ rowIdx, idx }}
              onClick={() => parent.copyRowOne(rowIdx, 3, 5)}
            >
              水 / 金曜日にコピーする
            </MenuItem>
            <MenuItem
              data={{ rowIdx, idx }}
              onClick={() => parent.copyRowTwo(rowIdx, 2, 4, 6)}
            >
              火 / 木 / 土曜日にコピーする
            </MenuItem>
          </>
        )}
        {rowIdx === 2 && ( //火
          <>
            <MenuItem
              data={{ rowIdx, idx }}
              onClick={() => parent.copyRowOne(rowIdx, 4, 6)}
            >
              木 / 土曜日にコピーする
            </MenuItem>
            <MenuItem
              data={{ rowIdx, idx }}
              onClick={() => parent.copyRowTwo(rowIdx, 1, 3, 5)}
            >
              月 / 水 / 金曜日にコピーする
            </MenuItem>
          </>
        )}
        {rowIdx === 3 && ( //水
          <>
            <MenuItem
              data={{ rowIdx, idx }}
              onClick={() => parent.copyRowOne(rowIdx, 1, 5)}
            >
              月 / 金曜日にコピーする
            </MenuItem>
            <MenuItem
              data={{ rowIdx, idx }}
              onClick={() => parent.copyRowTwo(rowIdx, 2, 4, 6)}
            >
              火 / 木 / 土曜日にコピーする
            </MenuItem>
          </>
        )}
        {rowIdx === 4 && ( //木
          <>
            <MenuItem
              data={{ rowIdx, idx }}
              onClick={() => parent.copyRowOne(rowIdx, 2, 6)}
            >
              火 / 土曜日にコピーする
            </MenuItem>
            <MenuItem
              data={{ rowIdx, idx }}
              onClick={() => parent.copyRowTwo(rowIdx, 1, 3, 5)}
            >
              月 / 水 / 金曜日にコピーする
            </MenuItem>
          </>
        )}
        {rowIdx === 5 && ( //金
          <>
            <MenuItem
              data={{ rowIdx, idx }}
              onClick={() => parent.copyRowOne(rowIdx, 1, 3)}
            >
              月 / 水曜日にコピーする
            </MenuItem>
            <MenuItem
              data={{ rowIdx, idx }}
              onClick={() => parent.copyRowTwo(rowIdx, 2, 4, 6)}
            >
              火 / 木 / 土曜日にコピーする
            </MenuItem>
          </>
        )}
        {rowIdx === 6 && ( //土
          <>
            <MenuItem
              data={{ rowIdx, idx }}
              onClick={() => parent.copyRowOne(rowIdx, 2, 4)}
            >
              火 / 木曜日にコピーする
            </MenuItem>
            <MenuItem
              data={{ rowIdx, idx }}
              onClick={() => parent.copyRowTwo(rowIdx, 1, 3, 5)}
            >
              月 / 水 / 金曜日にコピーする
            </MenuItem>
          </>
        )}
        <MenuItem
          data={{ rowIdx, idx }}
          onClick={() => parent.deleteRow(rowIdx)}
        >
          この曜日を削除する
        </MenuItem>
      </ContextMenu>
    );
  } else {
    return (
      <ContextMenu id={id}>
        <MenuItem
          data={{ rowIdx, idx }}
          onClick={() => parent.deleteRow(rowIdx)}
        >
          この曜日を削除する
        </MenuItem>
      </ContextMenu>
    );
  }
};

class dialPattern extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let dial_common_config = JSON.parse(
      window.sessionStorage.getItem("init_status")
    ).dial_common_config;
    let pattern_unit = null;
    this.decimal_info = null;
    if (
      dial_common_config !== undefined &&
      dial_common_config != null      
    ) {
      if (dial_common_config["単位名：透析パターン"] !== undefined) pattern_unit = dial_common_config["単位名：透析パターン"];
      if (dial_common_config["小数点以下桁数：透析パターン"] !== undefined) this.decimal_info = dial_common_config["小数点以下桁数：透析パターン"];
    }
    let code_master = sessApi.getObjectValue("dial_common_master","code_master");
    this.dial_group_codes = makeList_codeName(code_master['グループ']);
    this.dial_group_2_codes = makeList_codeName(code_master['グループ2']);
    
    this.double_click = false;
    this.columns = [
      // { key: "day", name: "曜日", frozen: true, width: 55 },
      // { key: "day", name: "曜日", width: 55 },
      { key: "time_zone", name: "時間帯", editor: TimezoneEditor, width: 75 },
      // { key: "time_zone", name: "時間帯", editable: true, editor: <OwnerEditor options={timezones} />, width: 75,},
      { key: "bed_no", name: "ベッドNo", editor: BedNoEditor, width: 100 },
      {
        key: "console",
        name: "コンソール",
        editor: ConsoleEditor,
        width: 105,
        cellClass: "bold-border",
      },
      {
        key: "reservation_time",
        name: renderHTML(
          "<div>透析時間<br />" +
            (pattern_unit != null &&
            pattern_unit["reservation_time"] !== undefined &&
            pattern_unit["reservation_time"] !== ""
              ? "(" + pattern_unit["reservation_time"]["value"] + ")"
              : "") +
            "</div>"
        ),
        editor: DialTimeEditor,
        width: 95,
      },
      {
        key: "scheduled_start_time",
        name: renderHTML(
          "<div>開始予定時刻<br />" +
            (pattern_unit != null &&
            pattern_unit["scheduled_start_time"] !== undefined &&
            pattern_unit["scheduled_start_time"] !== ""
              ? "(" + pattern_unit["scheduled_start_time"]["value"] + ")"
              : "") +
            "</div>"
        ),
        editor: DialStartTimeEditor,
        width: 130,
      },
      {
        key: "scheduled_end_time",
        name: renderHTML(
          "<div>終了予定時刻<br />" +
            (pattern_unit != null &&
            pattern_unit["scheduled_end_time"] !== undefined &&
            pattern_unit["scheduled_end_time"] !== ""
              ? "(" + pattern_unit["scheduled_end_time"]["value"] + ")"
              : "") +
            "</div>"
        ),
        editor: DialFinishTimeEditor,
        width: 130,
      },
      { key: "group", name: "グループ", editor: GroupEditor, width: 140 },
      { key: "group2", name: "グループ2", editor: GroupEditor2, width: 110 },
      {
        key: "dw",
        name: renderHTML(
          "<div>DW<br />" +
            (pattern_unit != null &&
            pattern_unit["dw"] !== undefined &&
            pattern_unit["dw"] !== ""
              ? "(" + pattern_unit["dw"]["value"] + ")"
              : "") +
            "</div>"
        ),
        editable: function(rowData) {
          if (rowData.dial_method !== undefined && rowData.dial_method !== "") {
            let dial_method = dialMethods.find(
              (x) => x.value === rowData.dial_method
            ).id;
            let telegramDefaultData = default_values.find((item) => {
              if (
                item.telegram_item_id ===
                  Dial_telegram_field["dw"].telegram_item_id &&
                item.protocol === "4.0" &&
                item.dialysis_method_code == dial_method
              ) {
                return item;
              }
            });
            if (telegramDefaultData == undefined) {
              telegramDefaultData = default_values.find((item) => {
                if (
                  item.telegram_item_id ===
                    Dial_telegram_field["dw"].telegram_item_id &&
                  item.protocol === "4.0" &&
                  item.dialysis_method_code == 0
                ) {
                  return item;
                }
              });
            }
            if (
              telegramDefaultData !== undefined &&
              telegramDefaultData.is_usable === 0
            ) {
              return false;
            } else {
              return true;
            }
          }
          return true;
        },
        width: 65,
        cellClass: "bold-border dw-cell",
      },
      {
        key: "dial_method",
        name: "治療法",
        editor: DialMethodEditor,
        width: 160,
      },
      {
        key: "blood_flow",
        name: renderHTML(
          "<div>血流量<br />" +
            (pattern_unit != null &&
            pattern_unit["blood_flow"] !== undefined &&
            pattern_unit["blood_flow"] !== ""
              ? "(" + pattern_unit["blood_flow"]["value"] + ")"
              : "") +
            "</div>"
        ),
        editable: function(rowData) {
          if (rowData.dial_method !== undefined && rowData.dial_method !== "") {
            let dial_method = dialMethods.find(
              (x) => x.value === rowData.dial_method
            ).id;
            let telegramDefaultData = default_values.find((item) => {
              if (
                item.telegram_item_id ===
                  Dial_telegram_field["blood_flow"].telegram_item_id &&
                item.protocol === "4.0" &&
                item.dialysis_method_code == dial_method
              ) {
                return item;
              }
            });
            if (telegramDefaultData == undefined) {
              telegramDefaultData = default_values.find((item) => {
                if (
                  item.telegram_item_id ===
                    Dial_telegram_field["blood_flow"].telegram_item_id &&
                  item.protocol === "4.0" &&
                  item.dialysis_method_code == 0
                ) {
                  return item;
                }
              });
            }
            if (
              telegramDefaultData !== undefined &&
              telegramDefaultData.is_usable === 0
            ) {
              return false;
            } else {
              return true;
            }
          }
          return true;
        },
        width: 145,
        cellClass: "blood-flow",
      },
      {
        key: "dialysate_amount",
        name: renderHTML(
          "<div>透析液流量<br />" +
            (pattern_unit != null &&
            pattern_unit["dialysate_amount"] !== undefined &&
            pattern_unit["dialysate_amount"] !== ""
              ? "(" + pattern_unit["dialysate_amount"]["value"] + ")"
              : "") +
            "</div>"
        ),
        editable: function(rowData) {
          if (rowData.dial_method !== undefined && rowData.dial_method !== "") {
            let dial_method = dialMethods.find(
              (x) => x.value === rowData.dial_method
            ).id;
            let telegramDefaultData = default_values.find((item) => {
              if (
                item.telegram_item_id ===
                  Dial_telegram_field["dialysate_amount"].telegram_item_id &&
                item.protocol === "4.0" &&
                item.dialysis_method_code == dial_method
              ) {
                return item;
              }
            });
            if (telegramDefaultData == undefined) {
              telegramDefaultData = default_values.find((item) => {
                if (
                  item.telegram_item_id ===
                    Dial_telegram_field["dialysate_amount"].telegram_item_id &&
                  item.protocol === "4.0" &&
                  item.dialysis_method_code == 0
                ) {
                  return item;
                }
              });
            }
            if (
              telegramDefaultData !== undefined &&
              telegramDefaultData.is_usable === 0
            ) {
              return false;
            } else {
              return true;
            }
          }
          return true;
        },
        width: 110,
        cellClass: "dialysate-amount",
      },
      {
        key: "degree",
        name: renderHTML(
          "<div>透析液温度<br />" +
            (pattern_unit != null &&
            pattern_unit["degree"] !== undefined &&
            pattern_unit["degree"] !== ""
              ? "(" + pattern_unit["degree"]["value"] + ")"
              : "") +
            "</div>"
        ),
        editable: function(rowData) {
          if (rowData.dial_method !== undefined && rowData.dial_method !== "") {
            let dial_method = dialMethods.find(
              (x) => x.value === rowData.dial_method
            ).id;
            let telegramDefaultData = default_values.find((item) => {
              if (
                item.telegram_item_id ===
                  Dial_telegram_field["degree"].telegram_item_id &&
                item.protocol === "4.0" &&
                item.dialysis_method_code == dial_method
              ) {
                return item;
              }
            });
            if (telegramDefaultData == undefined) {
              telegramDefaultData = default_values.find((item) => {
                if (
                  item.telegram_item_id ===
                    Dial_telegram_field["degree"].telegram_item_id &&
                  item.protocol === "4.0" &&
                  item.dialysis_method_code == 0
                ) {
                  return item;
                }
              });
            }
            if (
              telegramDefaultData !== undefined &&
              telegramDefaultData.is_usable === 0
            ) {
              return false;
            } else {
              return true;
            }
          }
          return true;
        },
        width: 120,
        cellClass: "degree-cell",
      },
      {
        key: "dial_liquid",
        name: "透析液",
        editor: DialysateEditor,
        width: 150,
        cellClass: "bold-border",
      }, //資材マスタ: 透析液
      {
        key: "dilution_timing",
        name: "前補液/後補液の選択",
        editor: Dilution_timingsEditor,
        width: 190,
        cellClass: "dilution-timing",
      },
      {
        key: "fluid_speed",
        name: renderHTML(
          "<div>補液速度<br />" +
            (pattern_unit != null &&
            pattern_unit["fluid_speed"] !== undefined &&
            pattern_unit["fluid_speed"] !== ""
              ? "(" + pattern_unit["fluid_speed"]["value"] + ")"
              : "") +
            "</div>"
        ),
        editable: function(rowData) {
          if (rowData.dial_method !== undefined && rowData.dial_method !== "") {
            let dial_method = dialMethods.find(
              (x) => x.value === rowData.dial_method
            ).id;
            let telegramDefaultData = default_values.find((item) => {
              if (
                item.telegram_item_id ===
                  Dial_telegram_field["fluid_speed"].telegram_item_id &&
                item.protocol === "4.0" &&
                item.dialysis_method_code == dial_method
              ) {
                return item;
              }
            });
            if (telegramDefaultData == undefined) {
              telegramDefaultData = default_values.find((item) => {
                if (
                  item.telegram_item_id ===
                    Dial_telegram_field["fluid_speed"].telegram_item_id &&
                  item.protocol === "4.0" &&
                  item.dialysis_method_code == 0
                ) {
                  return item;
                }
              });
            }
            if (
              telegramDefaultData !== undefined &&
              telegramDefaultData.is_usable === 0
            ) {
              return false;
            } else {
              return true;
            }
          }
          return true;
        },
        width: 100,
        cellClass: "fluid-speed",
      },
      {
        key: "fluid_amount",
        name: renderHTML(
          "<div>補液量<br />" +
            (pattern_unit != null &&
            pattern_unit["fluid_amount"] !== undefined &&
            pattern_unit["fluid_amount"] !== ""
              ? "(" + pattern_unit["fluid_amount"]["value"] + ")"
              : "") +
            "</div>"
        ),
        editable: function(rowData) {
          if (rowData.dial_method !== undefined && rowData.dial_method !== "") {
            let dial_method = dialMethods.find(
              (x) => x.value === rowData.dial_method
            ).id;
            let telegramDefaultData = default_values.find((item) => {
              if (
                item.telegram_item_id ===
                  Dial_telegram_field["fluid_amount"].telegram_item_id &&
                item.protocol === "4.0" &&
                item.dialysis_method_code == dial_method
              ) {
                return item;
              }
            });
            if (telegramDefaultData == undefined) {
              telegramDefaultData = default_values.find((item) => {
                if (
                  item.telegram_item_id ===
                    Dial_telegram_field["fluid_amount"].telegram_item_id &&
                  item.protocol === "4.0" &&
                  item.dialysis_method_code == 0
                ) {
                  return item;
                }
              });
            }
            if (
              telegramDefaultData !== undefined &&
              telegramDefaultData.is_usable === 0
            ) {
              return false;
            } else {
              return true;
            }
          }
          return true;
        },
        width: 80,
        cellClass: "fluid-amount",
      },
      {
        key: "fluid_temperature",
        name: renderHTML(
          "<div>補液温度<br />" +
            (pattern_unit != null &&
            pattern_unit["fluid_temperature"] !== undefined &&
            pattern_unit["fluid_temperature"] !== ""
              ? "(" + pattern_unit["fluid_temperature"]["value"] + ")"
              : "") +
            "</div>"
        ),
        editable: function(rowData) {
          if (rowData.dial_method !== undefined && rowData.dial_method !== "") {
            let dial_method = dialMethods.find(
              (x) => x.value === rowData.dial_method
            ).id;
            let telegramDefaultData = default_values.find((item) => {
              if (
                item.telegram_item_id ===
                  Dial_telegram_field["fluid_temperature"].telegram_item_id &&
                item.protocol === "4.0" &&
                item.dialysis_method_code == dial_method
              ) {
                return item;
              }
            });
            if (telegramDefaultData == undefined) {
              telegramDefaultData = default_values.find((item) => {
                if (
                  item.telegram_item_id ===
                    Dial_telegram_field["fluid_temperature"].telegram_item_id &&
                  item.protocol === "4.0" &&
                  item.dialysis_method_code == 0
                ) {
                  return item;
                }
              });
            }
            if (
              telegramDefaultData !== undefined &&
              telegramDefaultData.is_usable === 0
            ) {
              return false;
            } else {
              return true;
            }
          }
          return true;
        },
        width: 100,
        cellClass: "bold-border fluid-temperature",
      },
      {
        key: "hdf_init_time",
        name: renderHTML(
          "<div>I-HDF 補液開始時間<br />" +
            (pattern_unit != null &&
            pattern_unit["hdf_init_time"] !== undefined &&
            pattern_unit["hdf_init_time"] !== ""
              ? "(" + pattern_unit["hdf_init_time"]["value"] + ")"
              : "") +
            "</div>"
        ),
        editable: function(rowData) {
          if (rowData.dial_method !== undefined && rowData.dial_method !== "") {
            let dial_method = dialMethods.find(
              (x) => x.value === rowData.dial_method
            ).id;
            let telegramDefaultData = default_values.find((item) => {
              if (
                item.telegram_item_id ===
                  Dial_telegram_field["hdf_init_time"].telegram_item_id &&
                item.protocol === "4.0" &&
                item.dialysis_method_code == dial_method
              ) {
                return item;
              }
            });
            if (telegramDefaultData == undefined) {
              telegramDefaultData = default_values.find((item) => {
                if (
                  item.telegram_item_id ===
                    Dial_telegram_field["hdf_init_time"].telegram_item_id &&
                  item.protocol === "4.0" &&
                  item.dialysis_method_code == 0
                ) {
                  return item;
                }
              });
            }
            if (
              telegramDefaultData !== undefined &&
              telegramDefaultData.is_usable === 0
            ) {
              return false;
            } else {
              return true;
            }
          }
          return true;
        },
        width: 180,
        cellClass: "hdf-init-time",
      },
      {
        key: "hdf_init_amount",
        name: renderHTML(
          "<div>I-HDF 1回補液量<br />" +
            (pattern_unit != null &&
            pattern_unit["hdf_init_amount"] !== undefined &&
            pattern_unit["hdf_init_amount"] !== ""
              ? "(" + pattern_unit["hdf_init_amount"]["value"] + ")"
              : "") +
            "</div>"
        ),
        editable: function(rowData) {
          if (rowData.dial_method !== undefined && rowData.dial_method !== "") {
            let dial_method = dialMethods.find(
              (x) => x.value === rowData.dial_method
            ).id;
            let telegramDefaultData = default_values.find((item) => {
              if (
                item.telegram_item_id ===
                  Dial_telegram_field["hdf_init_amount"].telegram_item_id &&
                item.protocol === "4.0" &&
                item.dialysis_method_code == dial_method
              ) {
                return item;
              }
            });
            if (telegramDefaultData == undefined) {
              telegramDefaultData = default_values.find((item) => {
                if (
                  item.telegram_item_id ===
                    Dial_telegram_field["hdf_init_amount"].telegram_item_id &&
                  item.protocol === "4.0" &&
                  item.dialysis_method_code == 0
                ) {
                  return item;
                }
              });
            }
            if (
              telegramDefaultData !== undefined &&
              telegramDefaultData.is_usable === 0
            ) {
              return false;
            } else {
              return true;
            }
          }
          return true;
        },
        width: 150,
        cellClass: "hdf-init-amount",
      },
      {
        key: "hdf_step",
        name: renderHTML(
          "<div>I-HDF 補液間隔<br />" +
            (pattern_unit != null &&
            pattern_unit["hdf_step"] !== undefined &&
            pattern_unit["hdf_step"] !== ""
              ? "(" + pattern_unit["hdf_step"]["value"] + ")"
              : "") +
            "</div>"
        ),
        editable: function(rowData) {
          if (rowData.dial_method !== undefined && rowData.dial_method !== "") {
            let dial_method = dialMethods.find(
              (x) => x.value === rowData.dial_method
            ).id;
            let telegramDefaultData = default_values.find((item) => {
              if (
                item.telegram_item_id ===
                  Dial_telegram_field["hdf_step"].telegram_item_id &&
                item.protocol === "4.0" &&
                item.dialysis_method_code == dial_method
              ) {
                return item;
              }
            });
            if (telegramDefaultData == undefined) {
              telegramDefaultData = default_values.find((item) => {
                if (
                  item.telegram_item_id ===
                    Dial_telegram_field["hdf_step"].telegram_item_id &&
                  item.protocol === "4.0" &&
                  item.dialysis_method_code == 0
                ) {
                  return item;
                }
              });
            }
            if (
              telegramDefaultData !== undefined &&
              telegramDefaultData.is_usable === 0
            ) {
              return false;
            } else {
              return true;
            }
          }
          return true;
        },
        width: 150,
        cellClass: "hdf-step",
      },
      {
        key: "hdf_speed",
        name: renderHTML(
          "<div>I-HDF 1回補液速度<br />" +
            (pattern_unit != null &&
            pattern_unit["hdf_speed"] !== undefined &&
            pattern_unit["hdf_speed"] !== ""
              ? "(" + pattern_unit["hdf_speed"]["value"] + ")"
              : "") +
            "</div>"
        ),
        editable: function(rowData) {
          if (rowData.dial_method !== undefined && rowData.dial_method !== "") {
            let dial_method = dialMethods.find(
              (x) => x.value === rowData.dial_method
            ).id;
            let telegramDefaultData = default_values.find((item) => {
              if (
                item.telegram_item_id ===
                  Dial_telegram_field["hdf_speed"].telegram_item_id &&
                item.protocol === "4.0" &&
                item.dialysis_method_code == dial_method
              ) {
                return item;
              }
            });
            if (telegramDefaultData == undefined) {
              telegramDefaultData = default_values.find((item) => {
                if (
                  item.telegram_item_id ===
                    Dial_telegram_field["hdf_speed"].telegram_item_id &&
                  item.protocol === "4.0" &&
                  item.dialysis_method_code == 0
                ) {
                  return item;
                }
              });
            }
            if (
              telegramDefaultData !== undefined &&
              telegramDefaultData.is_usable === 0
            ) {
              return false;
            } else {
              return true;
            }
          }
          return true;
        },
        width: 170,
        cellClass: "bold-border hdf-speed",
      },
      {
        key: "max_drainage_amount",
        name: renderHTML(
          "<div>最大除水量<br />" +
            (pattern_unit != null &&
            pattern_unit["max_drainage_amount"] !== undefined &&
            pattern_unit["max_drainage_amount"] !== ""
              ? "(" + pattern_unit["max_drainage_amount"]["value"] + ")"
              : "") +
            "</div>"
        ),
        editable: true,
        width: 110,
      },
      {
        key: "max_drainage_speed",
        name: renderHTML(
          "<div>最大除水速度<br />" +
            (pattern_unit != null &&
            pattern_unit["max_drainage_speed"] !== undefined &&
            pattern_unit["max_drainage_speed"] !== ""
              ? "(" + pattern_unit["max_drainage_speed"]["value"] + ")"
              : "") +
            "</div>"
        ),
        editable: true,
        width: 130,
        cellClass: "bold-border",
      },
      {
        key: "puncture_needle_a",
        name: "穿刺針A",
        editor: Puncture_needle_AEditor,
        width: 220,
      }, //資材マスタ: 穿刺針
      {
        key: "puncture_needle_v",
        name: "穿刺針V",
        editor: Puncture_needle_VEditor,
        width: 220,
      }, //資材マスタ: 穿刺針
      {
        key: "fixed_tape",
        name: "固定テープ",
        editor: FixedTapesEditor,
        width: 300,
      }, //資材マスタ: 固定テープ
      {
        key: "disinfection_liquid",
        name: "消毒液",
        editor: AntisepticLiquidsEditor,
        width: 300,
        cellClass: "bold-border",
      }, //資材マスタ: 消毒薬
      {
        key: "fluid",
        name: renderHTML(
          "<div>補液<br />" +
            (pattern_unit != null &&
            pattern_unit["fluid"] !== undefined &&
            pattern_unit["fluid"] !== ""
              ? "(" + pattern_unit["fluid"]["value"] + ")"
              : "") +
            "</div>"
        ),
        editable: true,
        width: 60,
      },
      {
        key: "supplementary_food",
        name: renderHTML(
          "<div>補食<br />" +
            (pattern_unit != null &&
            pattern_unit["supplementary_food"] !== undefined &&
            pattern_unit["supplementary_food"] !== ""
              ? "(" + pattern_unit["supplementary_food"]["value"] + ")"
              : "") +
            "</div>"
        ),
        editable: true,
        width: 60,
      },
      {
        key: "windbag_1",
        name: renderHTML(
          "<div>風袋<br />" +
            (pattern_unit != null &&
            pattern_unit["windbag_1"] !== undefined &&
            pattern_unit["windbag_1"] !== ""
              ? "(" + pattern_unit["windbag_1"]["value"] + ")"
              : "") +
            "</div>"
        ),
        editable: true,
        width: 60,
      },
      {
        key: "windbag_2",
        name: renderHTML(
          "<div>風袋2<br />" +
            (pattern_unit != null &&
            pattern_unit["windbag_2"] !== undefined &&
            pattern_unit["windbag_2"] !== ""
              ? "(" + pattern_unit["windbag_2"]["value"] + ")"
              : "") +
            "</div>"
        ),
        editable: true,
        width: 70,
      },
      {
        key: "windbag_3",
        name: renderHTML(
          "<div>風袋3<br />" +
            (pattern_unit != null &&
            pattern_unit["windbag_3"] !== undefined &&
            pattern_unit["windbag_3"] !== ""
              ? "(" + pattern_unit["windbag_3"]["value"] + ")"
              : "") +
            "</div>"
        ),
        editable: true,
        width: 70,
      },
      { key: "list_note", name: "備考", editable: true, width: 500 },
    ];

    this.rows = [
      {
        id: 0,
        time_zone: "",
        bed_no: "",
        console: "",
        reservation_time: "",
        scheduled_start_time: "",
        scheduled_end_time: "",
        group: "",
        group2: "",
        dw: "",
        dial_method: "",
        blood_flow: "",
        dialysate_amount: "",
        dilution_timing: "",
        degree: "",
        dial_liquid: "",
        fluid_speed: "",
        fluid_amount: "",
        fluid_temperature: "",
        hdf_init_time: "",
        hdf_init_amount: "",
        hdf_step: "",
        hdf_speed: "",
        max_drainage_amount: "",
        max_drainage_speed: "",
        puncture_needle_a: "",
        puncture_needle_v: "",
        fixed_tape: "",
        disinfection_liquid: "",
        fluid: "",
        supplementary_food: "",
        windbag_1: "",
        windbag_2: "",
        windbag_3: "",
        list_note: "",
      },
      {
        id: 1,
        time_zone: "",
        bed_no: "",
        console: "",
        reservation_time: "",
        scheduled_start_time: "",
        scheduled_end_time: "",
        group: "",
        group2: "",
        dw: "",
        dial_method: "",
        blood_flow: "",
        dialysate_amount: "",
        dilution_timing: "",
        degree: "",
        dial_liquid: "",
        fluid_speed: "",
        fluid_amount: "",
        fluid_temperature: "",
        hdf_init_time: "",
        hdf_init_amount: "",
        hdf_step: "",
        hdf_speed: "",
        max_drainage_amount: "",
        max_drainage_speed: "",
        puncture_needle_a: "",
        puncture_needle_v: "",
        fixed_tape: "",
        disinfection_liquid: "",
        fluid: "",
        supplementary_food: "",
        windbag_1: "",
        windbag_2: "",
        windbag_3: "",
        list_note: "",
      },
      {
        id: 2,
        time_zone: "",
        bed_no: "",
        console: "",
        reservation_time: "",
        scheduled_start_time: "",
        scheduled_end_time: "",
        group: "",
        group2: "",
        dw: "",
        dial_method: "",
        blood_flow: "",
        dialysate_amount: "",
        dilution_timing: "",
        degree: "",
        dial_liquid: "",
        fluid_speed: "",
        fluid_amount: "",
        fluid_temperature: "",
        hdf_init_time: "",
        hdf_init_amount: "",
        hdf_step: "",
        hdf_speed: "",
        max_drainage_amount: "",
        max_drainage_speed: "",
        puncture_needle_a: "",
        puncture_needle_v: "",
        fixed_tape: "",
        disinfection_liquid: "",
        fluid: "",
        supplementary_food: "",
        windbag_1: "",
        windbag_2: "",
        windbag_3: "",
        list_note: "",
      },
      {
        id: 3,
        time_zone: "",
        bed_no: "",
        console: "",
        reservation_time: "",
        scheduled_start_time: "",
        scheduled_end_time: "",
        group: "",
        group2: "",
        dw: "",
        dial_method: "",
        blood_flow: "",
        dialysate_amount: "",
        dilution_timing: "",
        degree: "",
        dial_liquid: "",
        fluid_speed: "",
        fluid_amount: "",
        fluid_temperature: "",
        hdf_init_time: "",
        hdf_init_amount: "",
        hdf_step: "",
        hdf_speed: "",
        max_drainage_amount: "",
        max_drainage_speed: "",
        puncture_needle_a: "",
        puncture_needle_v: "",
        fixed_tape: "",
        disinfection_liquid: "",
        fluid: "",
        supplementary_food: "",
        windbag_1: "",
        windbag_2: "",
        windbag_3: "",
        list_note: "",
      },
      {
        id: 4,
        time_zone: "",
        bed_no: "",
        console: "",
        reservation_time: "",
        scheduled_start_time: "",
        scheduled_end_time: "",
        group: "",
        group2: "",
        dw: "",
        dial_method: "",
        blood_flow: "",
        dialysate_amount: "",
        dilution_timing: "",
        degree: "",
        dial_liquid: "",
        fluid_speed: "",
        fluid_amount: "",
        fluid_temperature: "",
        hdf_init_time: "",
        hdf_init_amount: "",
        hdf_step: "",
        hdf_speed: "",
        max_drainage_amount: "",
        max_drainage_speed: "",
        puncture_needle_a: "",
        puncture_needle_v: "",
        fixed_tape: "",
        disinfection_liquid: "",
        fluid: "",
        supplementary_food: "",
        windbag_1: "",
        windbag_2: "",
        windbag_3: "",
        list_note: "",
      },
      {
        id: 5,
        time_zone: "",
        bed_no: "",
        console: "",
        reservation_time: "",
        scheduled_start_time: "",
        scheduled_end_time: "",
        group: "",
        group2: "",
        dw: "",
        dial_method: "",
        blood_flow: "",
        dialysate_amount: "",
        dilution_timing: "",
        degree: "",
        dial_liquid: "",
        fluid_speed: "",
        fluid_amount: "",
        fluid_temperature: "",
        hdf_init_time: "",
        hdf_init_amount: "",
        hdf_step: "",
        hdf_speed: "",
        max_drainage_amount: "",
        max_drainage_speed: "",
        puncture_needle_a: "",
        puncture_needle_v: "",
        fixed_tape: "",
        disinfection_liquid: "",
        fluid: "",
        supplementary_food: "",
        windbag_1: "",
        windbag_2: "",
        windbag_3: "",
        list_note: "",
      },
      {
        id: 6,
        time_zone: "",
        bed_no: "",
        console: "",
        reservation_time: "",
        scheduled_start_time: "",
        scheduled_end_time: "",
        group: "",
        group2: "",
        dw: "",
        dial_method: "",
        blood_flow: "",
        dialysate_amount: "",
        dilution_timing: "",
        degree: "",
        dial_liquid: "",
        fluid_speed: "",
        fluid_amount: "",
        fluid_temperature: "",
        hdf_init_time: "",
        hdf_init_amount: "",
        hdf_step: "",
        hdf_speed: "",
        max_drainage_amount: "",
        max_drainage_speed: "",
        puncture_needle_a: "",
        puncture_needle_v: "",
        fixed_tape: "",
        disinfection_liquid: "",
        fluid: "",
        supplementary_food: "",
        windbag_1: "",
        windbag_2: "",
        windbag_3: "",
        list_note: "",
      },
    ];
    this.state = {
      startdate: "",
      enddate: "",
      stop_date: "",
      reopening_date: "",
      checkPeriod: true,
      entry_date: '',
      entry_time: '',
      entry_name:authInfo != undefined && authInfo != null ? authInfo.name : "",
      directer_name: "",
      instruction_doctor_number: "",
      rows: this.rows,
      selector: [{}, {}, {}, {}, {}, {}, {}],
      dial_pattern_list: [],
      dial_pattern: [],
      weightMenu: { visible: false },
      patient_id: "",
      system_id: "",
      pattern_table_id: "",
      not_yet: false,
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      confirm_message: "",
      patientInfo: [],
      dial_group: "",
      dial_group2: "",
      isShowDoctorList: false,
      selected_pattern_data: "",
      isConfirmComplete: false,
      complete_message: "",
      final_entry_date: "",
      final_entry_time: "",
      final_entry_name: "",
      final_doctor_name: "",
      checkLastPeriod: 1,
      all_bed_no: 0,
      time_limit: "",
      confirm_action: "",
      confirm_type: "",
      isUpdateScheduleConfirmModal: false,
      isAddConfirmModal: false,
      isReScheduleConfirm: false,
      isClearConfirmModal: false,
      check_message:"",
      confirm_alert_title:'',
      error_arr:[],

      isOpenHistoryModal:false,
      isOpenConsentModal:false,
    };

    this.editPattern = this.editPattern.bind(this);
    this.addPattern = this.addPattern.bind(this);
    this.updatePattern = this.updatePattern.bind(this);
    this.deletePattern = this.deletePattern.bind(this);
    this.clearPattern = this.clearPattern.bind(this);
  }

  deleteRow = (rowIdx) => {
    let cur_rows = [...this.state.rows];
    cur_rows[rowIdx] = {
      id: rowIdx,
      time_zone: "",
      bed_no: "",
      console: "",
      reservation_time: "",
      scheduled_start_time: "",
      scheduled_end_time: "",
      group: "",
      group2: "",
      dw: "",
      dial_method: "",
      blood_flow: "",
      dialysate_amount: "",
      degree: "",
      dial_liquid: "",
      dilution_timing: "",
      fluid_speed: "",
      fluid_amount: "",
      fluid_temperature: "",
      hdf_init_time: "",
      hdf_init_amount: "",
      hdf_step: "",
      hdf_speed: "",
      max_drainage_amount: "",
      max_drainage_speed: "",
      puncture_needle_a: "",
      puncture_needle_v: "",
      fixed_tape: "",
      disinfection_liquid: "",
      fluid: "",
      supplementary_food: "",
      windbag_1: "",
      windbag_2: "",
      windbag_3: "",
      list_note: "",
    };
    let cur_selector = [...this.state.selector];
    cur_selector[rowIdx] = {
      bed_no: 0,
      console: 0,
      dial_liquid: 0,
      dial_method: 0,
      dilution_timing: 0,
      disinfection_liquid: 0,
      fixed_tape: 0,
      group: 0,
      group2: 0,
      puncture_needle_a: 0,
      puncture_needle_v: 0,
      time_zone: 0,
    };
    this.setState({
      rows: cur_rows,
      selector: cur_selector,
    });
    this.setChangeFlag(1);
  };

  copyRowOne = (rowIdx, week_day1, week_day2) => {
    let new_row_1 = {
      id: week_day1,
      time_zone: "",
      bed_no: "",
      console: "",
      reservation_time: "",
      scheduled_start_time: "",
      scheduled_end_time: "",
      group: "",
      group2: "",
      dw: "",
      dial_method: "",
      blood_flow: "",
      dialysate_amount: "",
      degree: "",
      dial_liquid: "",
      dilution_timing: "",
      fluid_speed: "",
      fluid_amount: "",
      fluid_temperature: "",
      hdf_init_time: "",
      hdf_init_amount: "",
      hdf_step: "",
      hdf_speed: "",
      max_drainage_amount: "",
      max_drainage_speed: "",
      puncture_needle_a: "",
      puncture_needle_v: "",
      fixed_tape: "",
      disinfection_liquid: "",
      fluid: "",
      supplementary_food: "",
      windbag_1: "",
      windbag_2: "",
      windbag_3: "",
      list_note: "",
    };
    let new_row_2 = {
      id: week_day2,
      time_zone: "",
      bed_no: "",
      console: "",
      reservation_time: "",
      scheduled_start_time: "",
      scheduled_end_time: "",
      group: "",
      group2: "",
      dw: "",
      dial_method: "",
      blood_flow: "",
      dialysate_amount: "",
      degree: "",
      dial_liquid: "",
      dilution_timing: "",
      fluid_speed: "",
      fluid_amount: "",
      fluid_temperature: "",
      hdf_init_time: "",
      hdf_init_amount: "",
      hdf_step: "",
      hdf_speed: "",
      max_drainage_amount: "",
      max_drainage_speed: "",
      puncture_needle_a: "",
      puncture_needle_v: "",
      fixed_tape: "",
      disinfection_liquid: "",
      fluid: "",
      supplementary_food: "",
      windbag_1: "",
      windbag_2: "",
      windbag_3: "",
      list_note: "",
    };

    let cur_rows = this.state.rows;
    Object.keys(cur_rows[rowIdx]).map((key) => {
      if (key !== "id" && key !== "day") {
        new_row_1[key] = cur_rows[rowIdx][key];
        new_row_2[key] = cur_rows[rowIdx][key];
      }
    });
    cur_rows[week_day1] = new_row_1;
    cur_rows[week_day2] = new_row_2;
    let cur_selectors = [...this.state.selector];
    let content_selector = cur_selectors[rowIdx];
    cur_selectors[week_day1] = content_selector;
    cur_selectors[week_day2] = content_selector;
    this.setState({
      rows: cur_rows,
      selector: cur_selectors,
    });
    this.setChangeFlag(1);
  };

  copyRowTwo = (rowIdx, week_day1, week_day2, week_day3) => {
    let new_row_1 = {
      id: week_day1,
      time_zone: "",
      bed_no: "",
      console: "",
      reservation_time: "",
      scheduled_start_time: "",
      scheduled_end_time: "",
      group: "",
      group2: "",
      dw: "",
      dial_method: "",
      blood_flow: "",
      dialysate_amount: "",
      degree: "",
      dial_liquid: "",
      dilution_timing: "",
      fluid_speed: "",
      fluid_amount: "",
      fluid_temperature: "",
      hdf_init_time: "",
      hdf_init_amount: "",
      hdf_step: "",
      hdf_speed: "",
      max_drainage_amount: "",
      max_drainage_speed: "",
      puncture_needle_a: "",
      puncture_needle_v: "",
      fixed_tape: "",
      disinfection_liquid: "",
      fluid: "",
      supplementary_food: "",
      windbag_1: "",
      windbag_2: "",
      windbag_3: "",
      list_note: "",
    };
    let new_row_2 = {
      id: week_day2,
      time_zone: "",
      bed_no: "",
      console: "",
      reservation_time: "",
      scheduled_start_time: "",
      scheduled_end_time: "",
      group: "",
      group2: "",
      dw: "",
      dial_method: "",
      blood_flow: "",
      dialysate_amount: "",
      degree: "",
      dial_liquid: "",
      dilution_timing: "",
      fluid_speed: "",
      fluid_amount: "",
      fluid_temperature: "",
      hdf_init_time: "",
      hdf_init_amount: "",
      hdf_step: "",
      hdf_speed: "",
      max_drainage_amount: "",
      max_drainage_speed: "",
      puncture_needle_a: "",
      puncture_needle_v: "",
      fixed_tape: "",
      disinfection_liquid: "",
      fluid: "",
      supplementary_food: "",
      windbag_1: "",
      windbag_2: "",
      windbag_3: "",
      list_note: "",
    };
    let new_row_3 = {
      id: week_day3,
      time_zone: "",
      bed_no: "",
      console: "",
      reservation_time: "",
      scheduled_start_time: "",
      scheduled_end_time: "",
      group: "",
      group2: "",
      dw: "",
      dial_method: "",
      blood_flow: "",
      dialysate_amount: "",
      degree: "",
      dial_liquid: "",
      dilution_timing: "",
      fluid_speed: "",
      fluid_amount: "",
      fluid_temperature: "",
      hdf_init_time: "",
      hdf_init_amount: "",
      hdf_step: "",
      hdf_speed: "",
      max_drainage_amount: "",
      max_drainage_speed: "",
      puncture_needle_a: "",
      puncture_needle_v: "",
      fixed_tape: "",
      disinfection_liquid: "",
      fluid: "",
      supplementary_food: "",
      windbag_1: "",
      windbag_2: "",
      windbag_3: "",
      list_note: "",
    };

    let cur_rows = this.state.rows;
    Object.keys(cur_rows[rowIdx]).map((key) => {
      if (key !== "id" && key !== "day") {
        new_row_1[key] = cur_rows[rowIdx][key];
        new_row_2[key] = cur_rows[rowIdx][key];
        new_row_3[key] = cur_rows[rowIdx][key];
      }
    });
    cur_rows[week_day1] = new_row_1;
    cur_rows[week_day2] = new_row_2;
    cur_rows[week_day3] = new_row_3;
    let cur_selectors = [...this.state.selector];
    let content_selector = cur_selectors[rowIdx];
    cur_selectors[week_day1] = content_selector;
    cur_selectors[week_day2] = content_selector;
    cur_selectors[week_day3] = content_selector;
    this.setState({
      rows: cur_rows,
      selector: cur_selectors,
    });
    this.setChangeFlag(1);
  };

  async UNSAFE_componentWillMount() {
    await this.getConstInfo();
    await this.setDoctors();
    await this.getStaffs();
  }

  async componentDidMount() {
    let server_time = await getServerTime();
    let state_data = {};
    state_data['entry_date'] = new Date(server_time);
    state_data['entry_time'] = new Date(server_time);
    if (this.context.selectedDoctor.code > 0) {
      state_data['instruction_doctor_number'] = parseInt(this.context.selectedDoctor.code);
      state_data['directer_name'] = this.context.selectedDoctor.name;
    }
    this.setState(state_data);
  }

  // 検索
  getConstInfo = async () => {
    let time_zone_list = getTimeZoneList();
    if (time_zone_list != undefined && time_zone_list.length > 0) {
      time_zone_list.map((item) => {
        timezones[item.id] = item;
      });
    }

    let path = "/app/api/v2/dial/pattern/getDialConditionInfo";
    let post_data = {
      keyword: "",
      is_enabled: 1,
    };
    let { data } = await axios.post(path, { params: post_data });

    data[0].map((item, index) => {
      let bed_info = {
        id: item.id,
        value: item.value,
        console: parseInt(item.console),
      };
      bed_nos[index + 1] = bed_info;
    });
    data[1].map((item, index) => {
      let console_info = { id: parseInt(item.id), value: item.value };
      consoles[index + 1] = console_info;
    });
    data[2].map((item, index) => {
      let dialMethod_info = { id: parseInt(item.code), value: item.value };
      dialMethods[index + 1] = dialMethod_info;
    });
    data[3].map((item, index) => {
      let group_info = { id: parseInt(item.code), value: item.value };
      dialGroups[index + 1] = group_info;
    });
    data[4].map((item, index) => {
      let group_info = { id: parseInt(item.code), value: item.value };
      dialGroups2[index + 1] = group_info;
    });
    data[5].map((item, index) => {
      let needle_info = { id: parseInt(item.code), value: item.value };
      puncture_needle_A[index + 1] = needle_info;
      puncture_needle_V[index + 1] = needle_info;
    });
    data[6].map((item, index) => {
      let fixed_tape_info = { id: parseInt(item.code), value: item.value };
      fixedTapes[index + 1] = fixed_tape_info;
    });
    data[7].map((item, index) => {
      let disinfection_liquid_info = {
        id: parseInt(item.code),
        value: item.value,
      };
      antisepticLiquids[index + 1] = disinfection_liquid_info;
    });
    data[8].map((item, index) => {
      let dial_liquid_info = { id: parseInt(item.code), value: item.value };
      dialysates[index + 1] = dial_liquid_info;
    });
    let index = 11;
    for (let hour = 1; hour < 8; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 5) {
        let dial_tiem = "";
        if (minutes < 10) {
          dial_tiem = { id: index, value: hour + ":" + "0" + minutes };
        } else {
          dial_tiem = { id: index, value: hour + ":" + minutes };
        }
        dial_tiems[index] = dial_tiem;
        index++;
      }
    }
    dial_tiems[index] = { id: index, value: "8:00" };
    index = 1;
    for (let hour = 0; hour < 24; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 10) {
        let dial_tiem = "";
        if (minutes < 10) {
          if (hour < 10) {
            dial_tiem = { id: index, value: "0" + hour + ":" + "0" + minutes };
          } else {
            dial_tiem = { id: index, value: hour + ":" + "0" + minutes };
          }
        } else {
          if (hour < 10) {
            dial_tiem = { id: index, value: "0" + hour + ":" + minutes };
          } else {
            dial_tiem = { id: index, value: hour + ":" + minutes };
          }
        }
        dial_start_tiems[index + 1] = dial_tiem;
        dial_finish_tiems[index + 1] = dial_tiem;
        index++;
      }
    }
  };

  async getDialPatternFromPost(system_id, patient_id) {
    let server_time = await getServerTime();
    let path = "/app/api/v2/dial/pattern/getDialPattern";
    const post_data = {
      system_id: system_id,
      patient_id: patient_id,
    };
    await apiClient
      ._post(path, {
        params: post_data,
      })
      .then((res) => {
        if (res) {
          let tmp = res;
          if (this.state.checkLastPeriod == 0) {
            let today = formatDateLine(new Date(server_time));
            tmp = this.getPatternListByDateCondition(res,today,"time_limit_from","time_limit_to");
          }
          this.setState({
            dial_pattern_list: tmp,
            origin_pattern_list: res,
            dial_pattern: res,
          });
        }
      })
      .catch(() => {});
  }

  getStartdate = (value) => {
    this.setChangeFlag(1);
    this.setState({ startdate: value });
  };

  getEnddate = (value) => {
    this.setChangeFlag(1);
    this.setState({ enddate: value });
  };

  getDeleteStartdate = (value) => {
    this.setChangeFlag(1);
    this.setState({ stop_date: value });
  };

  getDeleteEnddate = (value) => {
    this.setChangeFlag(1);
    this.setState({ reopening_date: value });
  };

  getCheckedDm = (name, value) => {
    if (name === "period") this.setState({ checkPeriod: value });
  };

  getCheckedLast = async(name, value) => {
    if (name === "last") {
      if (value == 0) {
        let server_time = await getServerTime();
        let tmp = [];
        let today = formatDateLine(new Date(server_time));
        tmp = this.getPatternListByDateCondition(this.state.dial_pattern_list,today,"time_limit_from","time_limit_to");
        this.setState({
          checkLastPeriod: value,
          dial_pattern_list: tmp,
        });
      } else {
        this.setState({
          checkLastPeriod: value,
          dial_pattern_list: this.state.origin_pattern_list,
        });
      }
    }
  };
  insertStrTimeStyle=(input)=>{
    return input.slice(0, 2) + ':' + input.slice(2,input.length);
  }

  timeKeyEvent = (e) => {    
    var start_pos = e.target.selectionStart;
    var end_pos = e.target.selectionEnd;
    var key_code = e.keyCode;     
    this.key_code = key_code;
    this.start_pos = start_pos;
    var obj = document.getElementById('entry_time_id');

    let input_value = e.target.value;    
    
    if (start_pos == end_pos) {
      if (key_code == 37 && start_pos == 3){
        e.target.setSelectionRange(start_pos-1, start_pos-1);
      }
      if (key_code == 39 && start_pos == 2){
        e.target.setSelectionRange(start_pos+1, start_pos+1);
      }
    }

    input_value = input_value.replace(/[^0-9０-９]/g, '');
    if (input_value.length > 4) return;
    input_value = toHalfWidthOnlyNumber(input_value);

    if(input_value.length >= 2 ){
      input_value = this.insertStrTimeStyle(input_value);
    }

    if (key_code == 9) {
      this.setTime(e);
      return;
    }
    
    if (key_code == 8){          
      if (input_value.length == 1 && start_pos == 1 && start_pos == end_pos){
        this.setState({input_time_value:''}, () => {
          obj.setSelectionRange(0, 0);
        })
        e.preventDefault();
      }
      if (input_value.length == 3 && start_pos == 1 && start_pos == end_pos){
        input_value = input_value.slice(1.2);
        this.setState({input_time_value:input_value}, () => {
          obj.setSelectionRange(0,0);
        });
        e.preventDefault();
      }
      if (start_pos == end_pos && start_pos == 3){        
        input_value = input_value.slice(0,1) + input_value.slice(3, input_value.length);        
        this.setState({
          input_time_value:input_value,
        }, () => {
          obj.setSelectionRange(1, 1);
        })
        e.preventDefault();
      }
      
      if (start_pos != end_pos){        
        input_value = input_value.slice(0, start_pos) + input_value.slice(end_pos, input_value.length);
        this.setState({
          input_time_value:input_value,
        }, () => {
          obj.setSelectionRange(start_pos, start_pos);
        })
        e.preventDefault();
      }
    }
    if (key_code == 46){
      if (start_pos != end_pos){        
        input_value = input_value.slice(0, start_pos) + input_value.slice(end_pos, input_value.length);
        this.setState({
          input_time_value:input_value,
        }, () => {
          obj.setSelectionRange(start_pos, start_pos);
        })
        e.preventDefault();
      }
      if (input_value.length == 1 && start_pos == 0 && start_pos == end_pos){        
        this.setState({input_time_value:''}, () => {
          obj.setSelectionRange(0, 0);
        })
        e.preventDefault();
      }
      if (start_pos == end_pos && input_value.length == 3){
        if (start_pos == 0){          
          this.setState({
            input_time_value:input_value.slice(1,2),            
          }, () => {
            obj.setSelectionRange(0, 0);
          })
          e.preventDefault();
        }
        if (start_pos == 1){          
          this.setState({
            input_time_value:input_value.slice(0,1),            
          }, () => {
            obj.setSelectionRange(1, 1);
          })
          e.preventDefault();
        }
      }
    }    
    if (key_code != 8 && key_code != 46){
      this.setState({
        input_time_value:input_value,
      })
    }
  }

  getInputTime = (value, e) => {
    if (e == undefined){
      this.setState({
        entry_time:value,
        input_time_value:formatTime(value)
      })
      this.setChangeFlag(1);
      return;
    }
    var input_value = e.target.value;

    input_value = input_value.replace(/[^0-9０-９]/g, '');
    if (input_value.length > 4) return;
    input_value = toHalfWidthOnlyNumber(input_value);

    if(input_value.length >= 2 ){
      input_value = this.insertStrTimeStyle(input_value);
    }

    if (input_value.length == 5) this.setTime(e);
    
    this.setState({
      input_time_value:input_value
    }, () => {
      var obj = document.getElementById('entry_time_id');
      if (this.key_code == 46){        
        obj.setSelectionRange(this.start_pos, this.start_pos);
      }
      if (this.key_code == 8){        
        obj.setSelectionRange(this.start_pos - 1, this.start_pos - 1);
      }
    })
  };

  setTime = (e) => {        
    if (e.target.value.length != 5) {      
      this.setState({
        entry_time:'',
        input_time_value:undefined
      })
      this.setChangeFlag(1);
      return;
    }    
    var input_value = e.target.value;
    var hours = input_value.split(':')[0];
    var mins = input_value.split(':')[1];    
    if (hours > 23 || mins > 60){
      this.setState({
        entry_time:'',
        input_time_value:undefined
      })      
      return;
    }    
    var now = new Date();
    now.setHours(hours);
    now.setMinutes(mins);
    this.setState({entry_time:now})
    this.setChangeFlag(1);
  }

  getInputdate = (value) => {
    this.setChangeFlag(1);
    this.setState({ entry_date: value });
  };

  openConfirmCompleteModal = (message) => {
    this.setState({
      isConfirmComplete: true,
      complete_message: message,
    });
  };

  initBorderColor=()=>{
    removeRedBorder("dial_body_id");
    removeRedBorder("startdate_id");
    removeRedBorder("enddate_id");
    removeRedBorder("stop_date_id");
    removeRedBorder("reopening_date_id");
    removeRedBorder("entry_date_id");
    removeRedBorder("entry_time_id");
  }
  
  checkValidation = () => {        
    let error_str_arr = [];
    let error_arr = [];
    this.initBorderColor();
    let row_key = {
      time_zone: "",
      bed_no: "",
      console: "",
      reservation_time: "",
      scheduled_start_time: "",
      scheduled_end_time: "",
      group: "",
      group2: "",
      dw: "",
      dial_method: "",
      blood_flow: "",
      dialysate_amount: "",
      dilution_timing: "",
      degree: "",
      dial_liquid: "",
      fluid_speed: "",
      fluid_amount: "",
      fluid_temperature: "",
      hdf_init_time: "",
      hdf_init_amount: "",
      hdf_step: "",
      hdf_speed: "",
      max_drainage_amount: "",
      max_drainage_speed: "",
      puncture_needle_a: "",
      puncture_needle_v: "",
      fixed_tape: "",
      disinfection_liquid: "",
      fluid: "",
      supplementary_food: "",
      windbag_1: "",
      windbag_2: "",
      windbag_3: "",
      list_note: "",
    }
    let week_days = ["日","月","火","水","木","金","土"];
    let row_no_data_count = 0;
    this.state.rows.map((row, index)=>{
      let input_column_count = 0;
      Object.keys(row_key).map(key=>{
        if(row[key] == row_key[key]){
          input_column_count++;
        }
      });
      if(input_column_count != Object.keys(row_key).length){
        if(row['time_zone'] == ""){
          error_str_arr.push(week_days[index]+"曜日の時間帯を選択してください。");
          error_arr.push({
            tag_id:'time_zone_id'
          });
        }
        if(row['bed_no'] == ""){
          error_str_arr.push(week_days[index]+"曜日のベッドNoを選択してください。");
          error_arr.push({
            tag_id:'bed_no_id'
          });
        }
        if(row['console'] == ""){
          error_str_arr.push(week_days[index]+"曜日のコンソールを選択してください。");
          error_arr.push({
            tag_id:'console_id'
          });
        }
        if(row['bed_no'] != "" && row['console'] != "" && row['bed_no'] == "未設定" && row['console'] != "未設定"){
          error_str_arr.push(week_days[index]+"'曜日のベッド番号が未設定の場合はコンソールを設定できません。");
          error_arr.push({
            tag_id:'console_id'
          });
        }
        if(row['reservation_time'] == ""){
          error_str_arr.push(week_days[index]+"曜日の透析時間を選択してください。");
          error_arr.push({
            tag_id:'reservation_time_id'
          });
        }
        if(row['group'] == ""){
          error_str_arr.push(week_days[index]+"曜日のグループを選択してください。");
          error_arr.push({
            tag_id:'group_id'
          });
        }
        if(row['dial_method'] == ""){
          error_str_arr.push(week_days[index]+"曜日の治療法を選択してください。");
          error_arr.push({
            tag_id:'dial_method_id'
          });
        } else {
          let dial_method = dialMethods.find((x) => x.value === row['dial_method']).id;
          let telegramDefaultData = this.getTelegramDefaultValue(dial_method);
          Object.keys(telegramDefaultData).map(telegram_item=>{
            if(telegramDefaultData[telegram_item]['is_required'] == 1 && row[telegram_item] == ""){
              error_str_arr.push(week_days[index]+"曜日の"+telegramDefaultData[telegram_item]['title']+"を"+(telegram_item == "dilution_timing" ? "選択" : "入力")+"してください。");
              error_arr.push({
                tag_id:telegram_item+'_id'
              });
            }
          })
        }
      } else {
        row_no_data_count++;
      }
    });
    if(row_no_data_count == 7){
      error_str_arr.push("透析パターン項目を入力してください。");
      error_arr.push({
        tag_id:'dial_body_id'
      });
      addRedBorder("dial_body_id");
    }
    if(this.state.startdate == "" || this.state.startdate == null){
      error_str_arr.push("開始日を選択してください。");
      error_arr.push({
        tag_id:'startdate_id'
      });
      addRedBorder("startdate_id");
    } else {
      if(this.state.enddate != null && this.state.enddate !== ""){
        if(this.state.startdate.getTime() > this.state.enddate.getTime()){
          error_str_arr.push(" 終了日は開始日以降の日付を選択してください。");
          error_arr.push({
            tag_id:'enddate_id'
          });
          addRedBorder("enddate_id");
        }
        if(this.state.stop_date != null && this.state.stop_date !== '' && this.state.stop_date.getTime() > this.state.enddate.getTime()){
          error_str_arr.push("中止日は終了日以前の日付を選択してください。");
          error_arr.push({
            tag_id:'stop_date_id'
          });
          addRedBorder("stop_date_id");
        }
        if(this.state.reopening_date != null && this.state.reopening_date !== '' && this.state.reopening_date.getTime() > this.state.enddate.getTime()){
          error_str_arr.push("再開日は終了日以前の日付を選択してください。");
          error_arr.push({
            tag_id:'reopening_date_id'
          });
          addRedBorder("reopening_date_id");
        }
      }
      if(this.state.stop_date != null && this.state.stop_date !== '' && this.state.startdate.getTime() > this.state.stop_date.getTime()){
        error_str_arr.push("中止日は開始日以降の日付を選択してください。");
        error_arr.push({
          tag_id:'stop_date_id'
        });
        addRedBorder("stop_date_id");
      }
      if(this.state.reopening_date != null && this.state.reopening_date !== '' && this.state.startdate.getTime() > this.state.reopening_date.getTime()){
        error_str_arr.push("再開日は開始日以降の日付を選択してください。");
        error_arr.push({
          tag_id:'reopening_date_id'
        });
        addRedBorder("reopening_date_id");
      }
    }
    if(this.state.stop_date != null && this.state.stop_date !== ''){
      if(this.state.reopening_date == null || this.state.reopening_date === ''){
        error_str_arr.push("再開日を選択してください。");
        error_arr.push({
          tag_id:'reopening_date_id'
        });
        addRedBorder("reopening_date_id");
      } else {
        if(this.state.stop_date.getTime() > this.state.reopening_date.getTime()){
          error_str_arr.push("再開日は中止日以降の日付を選択してください。");
          error_arr.push({
            tag_id:'reopening_date_id'
          });
          addRedBorder("reopening_date_id");
        }
      }
    } else {
      if(this.state.reopening_date != null && this.state.reopening_date !== ''){
        error_str_arr.push("中止日を選択してください。");
        error_arr.push({
          tag_id:'stop_date_id'
        });
        addRedBorder("stop_date_id");
      }
    }
    if(this.state.entry_date == "" || this.state.entry_date == null){
      error_str_arr.push("入力日を選択してください。");
      error_arr.push({
        tag_id:'entry_date_id'
      });
      addRedBorder("entry_date_id");
    }
    if(this.state.entry_time == "" || this.state.entry_time == null){
      error_str_arr.push("入力時間を選択してください。");
      error_arr.push({
        tag_id:'entry_time_id'
      });
      addRedBorder("entry_time_id");
    }

    this.setState({error_arr});
    return error_str_arr;
  }

  add = () => {
    if (this.state.patient_id === "") {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    if (
      this.context.$canDoAction(
        this.context.FEATURES.DIAL_SYSTEM,
        this.context.AUTHS.REGISTER
      ) === false
    ) {
      window.sessionStorage.setItem("alert_messages", "登録権限がありません。");
      return;
    }
    if (this.state.instruction_doctor_number === "") {
      this.showDoctorList();
      return;
    }
    let error_str_array = this.checkValidation();
    if (error_str_array.length > 0 ) {
        this.setState({check_message:error_str_array.join('\n')});
        return;
    }

    this.setState({
      isAddConfirmModal: true,
      confirm_message: "パターンを追加しますか？",
    });
  };

  addPattern = async () => {
    this.confirmCancel();
    await this.openConfirmCompleteModal("保存中");
    let new_dial_pattern = {
      patient_id: this.state.patient_id,
      system_patient_id: this.state.system_id,
      time_limit_from: formatDateLine(this.state.startdate),
      time_limit_to: this.state.enddate
        ? formatDateLine(this.state.enddate)
        : "",
      stop_date: this.state.stop_date
        ? formatDateLine(this.state.stop_date)
        : "",
      reopening_date: this.state.reopening_date
        ? formatDateLine(this.state.reopening_date)
        : "",
      schedule_start_day: this.state.checkPeriod,
      pattern: this.state.rows,
      selector: this.state.selector,
      entry_date: this.state.entry_date
        ? formatDateLine(this.state.entry_date)
        : "",
      entry_time: this.state.entry_time ? formatTime(this.state.entry_time) : "",
      instruction_doctor_number: this.state.instruction_doctor_number,
      all_bed_no: this.state.all_bed_no,
      time_limit: this.state.time_limit,
    };
    if (this.double_click == true) return;
    this.double_click = true;
    let path = "/app/api/v2/dial/pattern/registerDialPattern";
    apiClient
      .post(path, {
        params: new_dial_pattern,
      })
      .then(async(res) => {
        this.confirmCancel();
        if (res.alert_message != undefined && res.alert_message != null) {
          this.setChangeFlag(0);
          await this.selectPatient(this.state.patientInfo);
          if (this.state.checkPeriod)
            this.makeSchedule(
              res.pattern_number,
              res.condition_numbers,
              new_dial_pattern,
              0
            );
            var title = '';
            var message = res.alert_message;
            if (message.indexOf('変更') > -1) title = "変更完了##";
            if (message.indexOf('登録') > -1) title = "登録完了##";
            window.sessionStorage.setItem("alert_messages", title + res.alert_message);
        }
        if (res.bed_message != undefined && res.bed_message != null) {
          this.setState({
            confirm_message:
              res.bed_message +
              " 様 と重複しています。未設定として展開しますか？",
            confirm_action: "add_pattern",
            confirm_type: "bed_console",
          });
        }
        if (res.console_message != undefined && res.console_message != null) {
          this.setState({
            confirm_message:
              res.console_message +
              " 様 と重複しています。未設定として展開しますか？",
            confirm_action: "add_pattern",
            confirm_type: "bed_console",
          });
        }
        if (
          res.time_limit_message != undefined &&
          res.time_limit_message != null
        ) {
          this.setState({
            confirm_message:
              "期間が重複しています。元のパターンの期限を " +
              formatJapanDateSlash(res.time_limit_message) +
              " までに変更したうえで登録しますか？",
            confirm_action: "add_pattern",
            confirm_type: "time_limit",
          });
        }
      })
      .catch(() => {
        this.confirmCancel();
      })
      .finally(() => {
        this.double_click = false;
      });
  };

  makeScheduleByNoSet=(re_schedule)=>{
    this.setState({
      confirm_message: "",
      confirm_type: "",
      all_bed_no: 100,
    },async() => {
      if (this.state.confirm_action === "add_pattern") {
        await this.addPattern();
      } else {
        await this.updatePattern(re_schedule);
      }
    });
  }

  lastPatternDelete(re_schedule) {
    this.setState({
      confirm_message: "",
      confirm_type: "",
      time_limit: "delete",
    },async() => {
      if (this.state.confirm_action === "add_pattern") {
        await this.addPattern();
      } else {
        await this.updatePattern(re_schedule);
      }
    });
  }

  confirmCancel = () => {
    this.setState({
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      isUpdateScheduleConfirmModal: false,
      isAddConfirmModal: false,
      isReScheduleConfirm: false,
      confirm_message: "",
      isConfirmComplete: false,
      isOpenMoveOtherPageConfirm: false,
      isClearConfirmModal: false,
      complete_message: "",
      confirm_action: "",
      confirm_type: "",
      confirm_alert_title:'',

      isOpenHistoryModal:false,
      isOpenConsentModal:false,
    });
  }
  openScheduleConfirmModal = () => {
    this.setState({ isUpdateScheduleConfirmModal: true });
  };

  updatePatternSchedule =async(type) => {
    await this.updatePattern(true, type);
  };

  update = () => {
    if (this.state.patient_id === "") {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    if (this.state.pattern_table_id === "") {
      window.sessionStorage.setItem(
        "alert_messages",
        "変更するパターンを選択してください。"
      );
      return;
    }
    if (
      this.context.$canDoAction(
        this.context.FEATURES.DIAL_SYSTEM,
        this.context.AUTHS.EDIT
      ) === false
    ) {
      window.sessionStorage.setItem("alert_messages", "変更権限がありません。");
      return;
    }
    if (this.state.instruction_doctor_number === "") {
      // window.sessionStorage.setItem("alert_messages", '指示者を選択してください。');
      this.showDoctorList();
      return;
    }
    let error_str_array = this.checkValidation();
    if (error_str_array.length > 0 ) {
        this.setState({check_message:error_str_array.join('\n')});
        return;
    }
    this.setState({
      isUpdateConfirmModal: true,
      confirm_message: "パターン情報を変更しますか?",
    });
  };

  confirmReSchedule = () => {
    var start_date = formatJapan(this.state.startdate);
    var end_date = this.state.enddate
      ? formatJapan(this.state.enddate)
      : "無期限";
    this.setState({
      isReScheduleConfirm: true,
      confirm_message:
        "対象日全てに変更を反映しますか" +
        "\n" +
        "期限 " +
        start_date +
        " ～ " +
        end_date,
    });
  };

  reScheduleCancel =async() => {
    this.confirmCancel();
    await this.updatePattern(false);
  };

  checkEqual = (data1, data2) => {
    if (JSON.stringify(data1) == JSON.stringify(data2)) return true;
    return false;
  };

  updatePattern = async (re_schedule = true) => {
    await this.confirmCancel();
    var time_limit_from, time_limit_to, stop_date, reopening_date;
    if (re_schedule) {
      time_limit_from = this.state.startdate
        ? formatDateLine(this.state.startdate)
        : "";
      time_limit_to = this.state.enddate
        ? formatDateLine(this.state.enddate)
        : "";
      stop_date = this.state.stop_date
        ? formatDateLine(this.state.stop_date)
        : "";
      reopening_date = this.state.reopening_date
        ? formatDateLine(this.state.reopening_date)
        : "";
    } else {
      time_limit_from = formatDateLine(this.ex_startdate);
      time_limit_to = formatDateLine(this.ex_enddate);
      stop_date = formatDateLine(this.ex_stop_date);
      reopening_date = formatDateLine(this.ex_reopening_date);
    }

    let update_pattern = {
      number: this.state.pattern_table_id,
      patient_id: this.state.patient_id,
      system_patient_id: this.state.system_id,
      time_limit_from: time_limit_from,
      time_limit_to: time_limit_to,
      stop_date: stop_date,
      reopening_date: reopening_date,
      schedule_start_day: this.state.checkPeriod,
      pattern: this.state.rows,
      selector: this.state.selector,
      entry_date: this.state.entry_date
        ? formatDateLine(this.state.entry_date)
        : "",
      entry_time: this.state.entry_time ? formatTime(this.state.entry_time) : "",
      instruction_doctor_number: this.state.instruction_doctor_number,
      all_bed_no: this.state.all_bed_no,
      sch_all_remove: 1,
      time_limit: this.state.time_limit,
    };

    var new_updated_pattern = {
      patient_id: this.state.patient_id,
      system_patient_id: this.state.system_id,
      time_limit_from: time_limit_from,
      time_limit_to: time_limit_to,
      stop_date: stop_date,
      reopening_date: reopening_date,
      pattern: this.state.rows,
    };
    if (
      this.checkEqual(this.ex_pattern, new_updated_pattern) &&
      this.checkEqual(this.ex_pattern.pattern, new_updated_pattern.pattern)
    ) {
      this.confirmCancel();
      window.sessionStorage.setItem(
        "alert_messages",
        "変更されたデータがありません。"
      );
      return;
    }
    await this.openConfirmCompleteModal("保存中");
    let path = "/app/api/v2/dial/pattern/updateDialPattern";
    apiClient
      .post(path, {
        params: update_pattern,
      })
      .then(async(res) => {
        this.confirmCancel();
        if (res.alert_message != undefined && res.alert_message != null) {
          this.setChangeFlag(0);
          await this.selectPatient(this.state.patientInfo);
          if (this.state.checkPeriod)
            this.makeSchedule(
              res.pattern_number,
              res.condition_numbers,
              update_pattern,
              1
            );
            var title = '';
            var message = res.alert_message;
            if (message.indexOf('変更') > -1) title = "変更完了##";
            if (message.indexOf('登録') > -1) title = "登録完了##";
            window.sessionStorage.setItem("alert_messages", title + res.alert_message);
        }
        if (res.bed_message != undefined && res.bed_message != null) {
          this.setState({
            confirm_message:
              res.bed_message +
              " 様 と重複しています。未設定として展開しますか？",
            confirm_action: "update_pattern",
            confirm_type: "bed_console",
            re_schedule: re_schedule,
          });
        }
        if (res.console_message != undefined && res.console_message != null) {
          this.setState({
            confirm_message:
              res.console_message +
              " 様 と重複しています。未設定として展開しますか？",
            confirm_action: "update_pattern",
            confirm_type: "bed_console",
            re_schedule: re_schedule,
          });
        }
        if (
          res.time_limit_message != undefined &&
          res.time_limit_message != null
        ) {
          this.setState({
            confirm_message:
              "期間が重複しています。元のパターンの期限を " +
              formatJapanDateSlash(res.time_limit_message) +
              " までに変更したうえで登録しますか？",
            confirm_action: "update_pattern",
            confirm_type: "time_limit",
            re_schedule: re_schedule,
          });
        }
      })
      .catch(() => {
        this.confirmCancel();
      });
  };

  makeSchedule(pattern_number, condition_numbers, post_data, edit_flag) {
    post_data.pattern_number = pattern_number;
    post_data.condition_numbers = condition_numbers;
    post_data.edit_flag = edit_flag;
    let path = "/app/api/v2/dial/pattern/makeDialSchedule";
    apiClient.post(path, {
      params: post_data,
    });
  }

  delete = () => {
    let flag = true;
    if (this.state.patient_id === "") {
      flag = false;
    } else if (this.state.pattern_table_id === "") {
      flag = false;
    } else if (
      this.context.$canDoAction(
        this.context.FEATURES.DIAL_SYSTEM,
        this.context.AUTHS.DELETE
      ) === false
    ) {
      flag = false;
    }
    if (flag) {
      this.setState({
        isDeleteConfirmModal: true,
      });
    }
  };

  editpatternConfirm = (item) => {
    if (this.change_flag === 1) {
      this.setState({
        isOpenMoveOtherPageConfirm: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type: "edit_pattern",        
        edit_pattern_item : item,
        confirm_alert_title:'入力中',
      });
    } else {
      this.setState({
        edit_pattern_item : item,
      }, ()=> {
        this.editPattern();
      })
    }
  }
  editPattern = () => {
    let selected_pattern_data = this.state.edit_pattern_item;
    let npatern = [];
    let row_data = [];
    let ex_row_data = [];
    this.initBorderColor();
    npatern = selected_pattern_data.pattern;
    npatern.map((item) => {
      if (typeof item.time_zone == "number") {
        item.bed_no = this.getValueFromId(bed_nos, item.bed_no);
        item.time_zone =
          timezones[item.time_zone] != undefined
            ? timezones[item.time_zone].value
            : "";
        item.console = this.getValueFromId(consoles, item.console);
        item.group = this.dial_group_codes.find((x) => x.id == item.group).value;
        item.group2 =
          item.group2 != null && item.group2 !== 0
            ? this.dial_group_2_codes.find((x) => x.id == item.group2).value
            : "";
        item.dial_method = this.getValueFromId(dialMethods, item.dial_method);
        item.dilution_timing = this.getValueFromId(
          dilution_timings,
          item.dilution_timing
        );
        item.dial_liquid =
          item.dial_liquid != null &&
          item.dial_liquid !== 0 &&
          dialysates.find((x) => x.id === item.dial_liquid) != undefined
            ? dialysates.find((x) => x.id === item.dial_liquid).value
            : "";
        item.puncture_needle_a =
          item.puncture_needle_a != null &&
          item.puncture_needle_a !== 0 &&
          puncture_needle_A.find((x) => x.id === item.puncture_needle_a) !=
            undefined
            ? puncture_needle_A.find((x) => x.id === item.puncture_needle_a)
                .value
            : "";
        item.puncture_needle_v =
          item.puncture_needle_v != null &&
          item.puncture_needle_v !== 0 &&
          puncture_needle_V.find((x) => x.id === item.puncture_needle_v) !=
            undefined
            ? puncture_needle_V.find((x) => x.id === item.puncture_needle_v)
                .value
            : "";
        item.fixed_tape =
          item.fixed_tape != null &&
          item.fixed_tape !== 0 &&
          fixedTapes.find((x) => x.id === item.fixed_tape) != undefined
            ? fixedTapes.find((x) => x.id === item.fixed_tape).value
            : "";
        item.disinfection_liquid =
          item.disinfection_liquid != null &&
          item.disinfection_liquid !== 0 &&
          antisepticLiquids.find((x) => x.id === item.disinfection_liquid) !=
            undefined
            ? antisepticLiquids.find((x) => x.id === item.disinfection_liquid)
                .value
            : "";
        var dw_precision = this.decimal_info != null && this.decimal_info['dw'] !=undefined? this.decimal_info['dw']['value']: 1;
        item.dw =
          parseFloat(item.dw) > 0 ? parseFloat(item.dw).toFixed(dw_precision) : item.dw;
      }
      row_data.push(item);
      ex_row_data.push(item);
    });
    let create_at = selected_pattern_data.updated_at;
    let input_day = create_at.split(" ");
    this.setState({
      selected_pattern_data: selected_pattern_data,
      selected_row: selected_pattern_data.number,
      pattern_table_id: selected_pattern_data.number,
      rows: row_data,
      startdate: new Date(selected_pattern_data.time_limit_from),
      enddate:
      selected_pattern_data.time_limit_to == null
          ? null
          : new Date(selected_pattern_data.time_limit_to),
      not_yet: selected_pattern_data.time_limit_to ? false : true,
      final_entry_date: formatDateSlash(new Date(input_day[0])),
      final_entry_time: formatTime(formatTimePicker(input_day[1])),
      final_entry_name:
        this.state.staff_list_by_number != undefined &&
        this.state.staff_list_by_number != null
          ? selected_pattern_data.updated_by !== 0
            ? this.state.staff_list_by_number[
              selected_pattern_data.updated_by
              ]
            : ""
          : "",
      final_doctor_name:
        this.state.doctor_list_by_number != undefined &&
        selected_pattern_data.instruction_doctor_number != null
          ? this.state.doctor_list_by_number[
            selected_pattern_data.instruction_doctor_number
            ]
          : "",
      checkPeriod: selected_pattern_data.schedule_start_day,
      stop_date:
        selected_pattern_data.stop_date != undefined
          ? new Date(selected_pattern_data.stop_date)
          : "",
      reopening_date:
        selected_pattern_data.reopening_date != undefined
          ? new Date(selected_pattern_data.reopening_date)
          : "",
    });
    this.ex_startdate = new Date(
      selected_pattern_data.time_limit_from
    );
    this.ex_enddate =
      selected_pattern_data.time_limit_to == null
        ? null
        : new Date(selected_pattern_data.time_limit_to);
    this.ex_stop_date =
      selected_pattern_data.stop_date != undefined
        ? new Date(selected_pattern_data.stop_date)
        : "";
    this.ex_reopening_date =
      selected_pattern_data.reopening_date != undefined
        ? new Date(selected_pattern_data.reopening_date)
        : "";
    this.ex_pattern = {
      patient_id: this.state.patient_id,
      system_patient_id: this.state.system_id,
      time_limit_from: selected_pattern_data.time_limit_from,
      time_limit_to:
        selected_pattern_data.time_limit_to == null
          ? ""
          : selected_pattern_data.time_limit_to,
      stop_date:
        selected_pattern_data.stop_date != undefined
          ? selected_pattern_data.stop_date
          : "",
      reopening_date:
        selected_pattern_data.reopening_date != undefined
          ? selected_pattern_data.reopening_date
          : "",
      pattern: ex_row_data,
    };
    this.setChangeFlag(0);
  };

  selectPatient = async(patientInfo) => {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let server_time = await getServerTime();
    this.setState({
      patientInfo: patientInfo,
      dial_group: patientInfo.dial_group != null ? patientInfo.dial_group : "",
      dial_group2:
        patientInfo.dial_group2 != null ? patientInfo.dial_group2 : "",
      selected_row: "",
      pattern_table_id: "",
      system_id: patientInfo.system_patient_id,
      patient_id: patientInfo.patient_number,
      rows: this.rows,
      startdate: "",
      enddate: "",
      checkPeriod: true,
      entry_date: new Date(server_time),
      entry_time: new Date(server_time),
      entry_name:authInfo != undefined && authInfo != null ? authInfo.name : "",
      directer_name:
        this.context.selectedDoctor.code > 0
          ? this.context.selectedDoctor.name
          : "",
      instruction_doctor_number:
        this.context.selectedDoctor.code > 0
          ? parseInt(this.context.selectedDoctor.code)
          : "",
      selector: [{}, {}, {}, {}, {}, {}, {}],
      isShowDoctorList: false,
      final_entry_date: "",
      final_entry_time: "",
      final_entry_name: "",
      final_doctor_name: "",
      stop_date: "",
      reopening_date: "",
      all_bed_no: 0,
      time_limit: "",
      isOpenMoveOtherPageConfirm: false,
      change_flag: false,
      confirm_alert_title:'',
    });
    this.setChangeFlag(0);
    await this.getDialPatternFromPost(
      patientInfo.system_patient_id,
      patientInfo.patient_number
    );
    this.setDoctors();
    this.initBorderColor();
  };

  clear = () => {
    if (!this.change_flag) return;
    if (this.state.patient_id === "") {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    this.setState({
      isClearConfirmModal: true,
      confirm_message: "入力中の内容を消去しますか？",
    });
  };

  clearPattern =async() => {
    this.confirmCancel();
    this.setChangeFlag(0);
    if (this.state.patient_id !== "") {
      await this.selectPatient(this.state.patientInfo);
    }
  };

  deletePattern = async (type) => {
    await this.confirmCancel();
    await this.openConfirmCompleteModal("削除中");
    let delete_pattern = {
      number: this.state.pattern_table_id,
      system_patient_id: this.state.system_id,
      type: type,
    };
    let path = "/app/api/v2/dial/pattern/deleteDialPattern";

    await apiClient
      .post(path, {
        params: delete_pattern,
      })
      .then(async(res) => {
        this.setChangeFlag(0);
        window.sessionStorage.setItem("alert_messages", "削除完了##" +  res.alert_message);
        this.confirmCancel();
        await this.selectPatient(this.state.patientInfo);
      })
      .catch(() => {
        this.confirmCancel();
      });
  };

  onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    this.setChangeFlag(1);
    let rows = this.state.rows;
    var precision;
    {
      Object.keys(updated).map((key) => {
        if (key === "fluid_speed") {
          if (rows[fromRow]["dial_method"] !== "") {
            let dial_method = dialMethods.find(
              (x) => x.value === rows[fromRow]["dial_method"]
            ).id;
            let telegramDefaultData = this.getTelegramDefaultValue(dial_method);
            if (telegramDefaultData.fluid_speed.is_usable === "0") {
              // let fluid_speed_obj = document.getElementsByClassName("fluid-speed")[fromRow+1];
              // if(fluid_speed_obj !== undefined && fluid_speed_obj != null){
              //     fluid_speed_obj.style['background-color'] = "grey";
              // }
              return;
            }
            // let fluid_speed_obj = document.getElementsByClassName("fluid-speed")[fromRow+1];
            // if(fluid_speed_obj !== undefined && fluid_speed_obj != null){
            //     fluid_speed_obj.style['background-color'] = "";
            // }
          }
          if (updated[key] !== "" && rows[fromRow]["reservation_time"] !== "") {
            let time = rows[fromRow]["reservation_time"].split(":");
            let update_data = { fluid_amount: 0 };
            if (!isNaN(parseFloat(updated[key]))) {
              precision = this.decimal_info != null && this.decimal_info['fluid_amount'] !=undefined? this.decimal_info['fluid_amount']['value']: 1;
              update_data["fluid_amount"] = ((parseInt(time[0]) + parseInt(time[1]) / 60) *
                parseFloat(updated[key])
              ).toFixed(precision);
              this.setState((state) => {
                const rows = state.rows.slice();
                for (let i = fromRow; i <= toRow; i++) {
                  rows[i] = { ...rows[i], ...update_data };
                }
                return { rows };
              });
            }
          }
        }

        if (key == "dw") {
          let update_data = { dw: "" };
          if (parseFloat(updated[key]) >= 0) {
            precision = this.decimal_info != null && this.decimal_info['dw'] !=undefined? this.decimal_info['dw']['value']: 1;
            updated[key] = parseFloat(updated[key]).toFixed(precision);
            update_data["dw"] = parseFloat(updated[key]).toFixed(precision);
          } else {
            updated[key] = "";
            update_data["dw"] = "";
          }
        }
        if (key == "supplementary_food") {
          let update_data = { supplementary_food: "" };
          if (parseFloat(updated[key]) > 0) {
            precision = this.decimal_info != null && this.decimal_info['supplementary_food'] !=undefined? this.decimal_info['supplementary_food']['value']: 2;
            updated[key] = parseFloat(updated[key]).toFixed(precision);
            update_data["supplementary_food"] = parseFloat(updated[key]).toFixed(precision);
          } else {
            updated[key] = "";
            update_data["supplementary_food"] = "";
          }
        }

        if (key === "dial_method" && updated[key] !== "") {
          let dial_method = dialMethods.find((x) => x.value === updated[key])
            .id;
          let telegramDefaultData = this.getTelegramDefaultValue(dial_method);
          let update_data = [];
          if (telegramDefaultData.dw.is_usable === 1) {
            if (
              rows[fromRow]["dw"] === "" &&
              telegramDefaultData.dw.default_value !== "" &&
              telegramDefaultData.dw.default_value != null &&
              telegramDefaultData.dw.default_value !== "0"
            ) {
              precision = this.decimal_info != null && this.decimal_info['dw'] !=undefined? this.decimal_info['dw']['value']: 1;
              update_data["dw"] = parseFloat(
                telegramDefaultData.dw.default_value
              ).toFixed(precision);
            }
            // let dw_cell_obj= document.getElementsByClassName("dw-cell")[fromRow+1];
            // if(dw_cell_obj !== undefined && dw_cell_obj != null){
            //     dw_cell_obj.style['background-color'] = "";
            // }
          } else {
            // let dw_cell_obj= document.getElementsByClassName("dw-cell")[fromRow+1];
            // if(dw_cell_obj !== undefined && dw_cell_obj != null){
            //     dw_cell_obj.style['background-color'] = "grey";
            // }
            update_data["dw"] = "";
          }
          if (telegramDefaultData.fluid_amount.is_usable === 1) {
            if (
              rows[fromRow]["fluid_amount"] === "" &&
              telegramDefaultData.fluid_amount.default_value !== "" &&
              telegramDefaultData.fluid_amount.default_value != null &&
              telegramDefaultData.fluid_amount.default_value !== "0"
            ) {
              precision = this.decimal_info != null && this.decimal_info['fluid_amount'] !=undefined? this.decimal_info['fluid_amount']['value']: 1;
              update_data["fluid_amount"] =parseFloat(telegramDefaultData.fluid_amount.default_value).toFixed(precision);
            }
            // let fluid_amount_obj = document.getElementsByClassName("fluid-amount")[fromRow+1];
            // if(fluid_amount_obj !== undefined && fluid_amount_obj != null){
            //     fluid_amount_obj.style['background-color'] = "";
            // }
          } else {
            update_data["fluid_amount"] = "";
            // let fluid_amount_obj = document.getElementsByClassName("fluid-amount")[fromRow+1];
            // if(fluid_amount_obj !== undefined && fluid_amount_obj != null){
            //     fluid_amount_obj.style['background-color'] = "grey";
            // }
          }
          if (telegramDefaultData.fluid_speed.is_usable === 1) {
            if (
              rows[fromRow]["fluid_speed"] === "" &&
              telegramDefaultData.fluid_speed.default_value !== "" &&
              telegramDefaultData.fluid_speed.default_value != null &&
              telegramDefaultData.fluid_speed.default_value !== "0"
            ) {
              precision = this.decimal_info != null && this.decimal_info['fluid_speed'] !=undefined? this.decimal_info['fluid_speed']['value']: 1;
              update_data["fluid_speed"] =parseFloat(telegramDefaultData.fluid_speed.default_value).toFixed(precision);
            }
            // let fluid_speed_obj = document.getElementsByClassName("fluid-speed")[fromRow+1];
            // if(fluid_speed_obj !== undefined && fluid_speed_obj != null){
            //     fluid_speed_obj.style['background-color'] = "";
            // }
          } else {
            update_data["fluid_speed"] = "";
            // let fluid_speed_obj = document.getElementsByClassName("fluid-speed")[fromRow+1];
            // if(fluid_speed_obj !== undefined && fluid_speed_obj != null){
            //     fluid_speed_obj.style['background-color'] = "grey";
            // }
          }

          if (telegramDefaultData.blood_flow.is_usable === 1) {
            if (
              rows[fromRow]["blood_flow"] === "" &&
              telegramDefaultData.blood_flow.default_value !== "" &&
              telegramDefaultData.blood_flow.default_value != null &&
              telegramDefaultData.blood_flow.default_value !== "0"
            ) {
              update_data["blood_flow"] =
                telegramDefaultData.blood_flow.default_value;
            }
            // let blood_flow_obj = document.getElementsByClassName("blood-flow")[fromRow+1];
            // if(blood_flow_obj !== undefined && blood_flow_obj != null){
            //     blood_flow_obj.style['background-color'] = "";
            // }
          } else {
            update_data["blood_flow"] = "";
            // let blood_flow_obj = document.getElementsByClassName("blood-flow")[fromRow+1];
            // if(blood_flow_obj !== undefined && blood_flow_obj != null){
            //     blood_flow_obj.style['background-color'] = "grey";
            // }
          }
          if (telegramDefaultData.degree.is_usable === 1) {
            if (
              rows[fromRow]["degree"] === "" &&
              telegramDefaultData.degree.default_value !== "" &&
              telegramDefaultData.degree.default_value != null &&
              telegramDefaultData.degree.default_value !== "0"
            ) {
              update_data["degree"] = telegramDefaultData.degree.default_value;
            }
            // let degree_cell_obj = document.getElementsByClassName("degree-cell")[fromRow+1];
            // if(degree_cell_obj !== undefined && degree_cell_obj != null){
            //     degree_cell_obj.style['background-color'] = "";
            // }
          } else {
            update_data["degree"] = "";
            // let degree_cell_obj = document.getElementsByClassName("degree-cell")[fromRow+1];
            // if(degree_cell_obj !== undefined && degree_cell_obj != null){
            //     degree_cell_obj.style['background-color'] = "grey";
            // }
          }
          if (telegramDefaultData.fluid_temperature.is_usable === 1) {
            if (
              rows[fromRow]["fluid_temperature"] === "" &&
              telegramDefaultData.fluid_temperature.default_value !== "" &&
              telegramDefaultData.fluid_temperature.default_value != null &&
              telegramDefaultData.fluid_temperature.default_value !== "0"
            ) {
              update_data["fluid_temperature"] =
                telegramDefaultData.fluid_temperature.default_value;
            }
            // let fluid_temperature_obj = document.getElementsByClassName("fluid-temperature")[fromRow+1];
            // if(fluid_temperature_obj !== undefined && fluid_temperature_obj != null){
            //     fluid_temperature_obj.style['background-color'] = "";
            // }
          } else {
            update_data["fluid_temperature"] = "";
            // let fluid_temperature_obj = document.getElementsByClassName("fluid-temperature")[fromRow+1];
            // if(fluid_temperature_obj !== undefined && fluid_temperature_obj != null){
            //     fluid_temperature_obj.style['background-color'] = "grey";
            // }
          }
          if (telegramDefaultData.dialysate_amount.is_usable === 1) {
            if (
              rows[fromRow]["dialysate_amount"] === "" &&
              telegramDefaultData.dialysate_amount.default_value !== "" &&
              telegramDefaultData.dialysate_amount.default_value != null &&
              telegramDefaultData.dialysate_amount.default_value !== "0"
            ) {
              update_data["dialysate_amount"] =
                telegramDefaultData.dialysate_amount.default_value;
            }
            // let dialysate_amount_obj = document.getElementsByClassName("dialysate-amount")[fromRow+1];
            // if(dialysate_amount_obj !== undefined && dialysate_amount_obj != null){
            //     dialysate_amount_obj.style['background-color'] = "";
            // }
          } else {
            update_data["dialysate_amount"] = "";
            // let dialysate_amount_obj = document.getElementsByClassName("dialysate-amount")[fromRow+1];
            // if(dialysate_amount_obj !== undefined && dialysate_amount_obj != null){
            //     dialysate_amount_obj.style['background-color'] = "grey";
            // }
          }
          if (telegramDefaultData.hdf_init_time.is_usable === 1) {
            if (
              rows[fromRow]["hdf_init_time"] === "" &&
              telegramDefaultData.hdf_init_time.default_value !== "" &&
              telegramDefaultData.hdf_init_time.default_value != null &&
              telegramDefaultData.hdf_init_time.default_value !== "0"
            ) {
              update_data["hdf_init_time"] =
                telegramDefaultData.hdf_init_time.default_value;
            }
            // let hdf_init_time_obj = document.getElementsByClassName("hdf-init-time")[fromRow+1];
            // if(hdf_init_time_obj !== undefined && hdf_init_time_obj != null){
            //     hdf_init_time_obj.style['background-color'] = "";
            // }
          } else {
            update_data["hdf_init_time"] = "";
            // let hdf_init_time_obj = document.getElementsByClassName("hdf-init-time")[fromRow+1];
            // if(hdf_init_time_obj !== undefined && hdf_init_time_obj != null){
            //     hdf_init_time_obj.style['background-color'] = "grey";
            // }
          }
          if (telegramDefaultData.hdf_init_amount.is_usable === 1) {
            if (
              rows[fromRow]["hdf_init_amount"] === "" &&
              telegramDefaultData.hdf_init_amount.default_value !== "" &&
              telegramDefaultData.hdf_init_amount.default_value != null &&
              telegramDefaultData.hdf_init_amount.default_value !== "0"
            ) {
              update_data["hdf_init_amount"] =
                telegramDefaultData.hdf_init_amount.default_value;
            }
            // let hdf_init_amount_obj = document.getElementsByClassName("hdf-init-amount")[fromRow+1];
            // if(hdf_init_amount_obj !== undefined && hdf_init_amount_obj != null){
            //     hdf_init_amount_obj.style['background-color'] = "";
            // }
          } else {
            update_data["hdf_init_amount"] = "";
            // let hdf_init_amount_obj = document.getElementsByClassName("hdf-init-amount")[fromRow+1];
            // if(hdf_init_amount_obj !== undefined && hdf_init_amount_obj != null){
            //     hdf_init_amount_obj.style['background-color'] = "grey";
            // }
          }
          if (telegramDefaultData.hdf_step.is_usable === 1) {
            if (
              rows[fromRow]["hdf_step"] === "" &&
              telegramDefaultData.hdf_step.default_value !== "" &&
              telegramDefaultData.hdf_step.default_value != null &&
              telegramDefaultData.hdf_step.default_value !== "0"
            ) {
              update_data["hdf_step"] =
                telegramDefaultData.hdf_step.default_value;
            }
            // let hdf_step_obj = document.getElementsByClassName("hdf-step")[fromRow+1];
            // if(hdf_step_obj !== undefined && hdf_step_obj != null){
            //     hdf_step_obj.style['background-color'] = "";
            // }
          } else {
            update_data["hdf_step"] = "";
            // let hdf_step_obj = document.getElementsByClassName("hdf-step")[fromRow+1];
            // if(hdf_step_obj !== undefined && hdf_step_obj != null){
            //     hdf_step_obj.style['background-color'] = "grey";
            // }
          }
          if (telegramDefaultData.hdf_speed.is_usable === 1) {
            if (
              rows[fromRow]["hdf_speed"] === "" &&
              telegramDefaultData.hdf_speed.default_value !== "" &&
              telegramDefaultData.hdf_speed.default_value != null &&
              telegramDefaultData.hdf_speed.default_value !== "0"
            ) {
              update_data["hdf_speed"] =
                telegramDefaultData.hdf_speed.default_value;
            }
            // let hdf_speed_obj = document.getElementsByClassName("hdf-speed")[fromRow+1];
            // if(hdf_speed_obj !== undefined && hdf_speed_obj != null){
            //     hdf_speed_obj.style['background-color'] = "";
            // }
          } else {
            update_data["hdf_speed"] = "";
            // let hdf_speed_obj = document.getElementsByClassName("hdf-speed")[fromRow+1];
            // if(hdf_speed_obj !== undefined && hdf_speed_obj != null){
            //     hdf_speed_obj.style['background-color'] = "grey";
            // }
          }
          let selector = this.state.selector;
          if (selector[fromRow] == undefined) selector[fromRow] = {};
          if (telegramDefaultData.dilution_timing.is_usable === 1) {
            if (
              rows[fromRow]["dilution_timing"] === "" &&
              telegramDefaultData.dilution_timing.default_value !== "" &&
              telegramDefaultData.dilution_timing.default_value != null
            ) {
              selector[fromRow]["dilution_timing"] =
                parseInt(telegramDefaultData.dilution_timing.default_value) + 1;
              if (telegramDefaultData.dilution_timing.default_value == 0) {
                update_data["dilution_timing"] = "前補液";
              } else {
                update_data["dilution_timing"] = "後補液";
              }
              // let dilution_timing_obj= document.getElementsByClassName("dilution-timing")[fromRow+1];
              // if(dilution_timing_obj !== undefined && dilution_timing_obj != null){
              //     dilution_timing_obj.style['background-color'] = "";
              //     dilution_timing_obj.style['display'] = "block";
              // }
            }
          } else {
            update_data["dilution_timing"] = "";
            selector[fromRow]["dilution_timing"] = 0;
            // let dilution_timing_obj= document.getElementsByClassName("dilution-timing")[fromRow+1];
            // if(dilution_timing_obj !== undefined && dilution_timing_obj != null){
            //     dilution_timing_obj.style['background-color'] = "grey";
            // }
          }
          this.setState((state) => {
            const rows = state.rows.slice();
            for (let i = fromRow; i <= toRow; i++) {
              rows[i] = { ...rows[i], ...update_data };
            }
            return { rows, selector };
          });
        }

        if (
          key === "dw" &&
          updated[key] !== "" &&
          rows[fromRow]["dial_method"] !== ""
        ) {
          let dial_method = dialMethods.find(
            (x) => x.value === rows[fromRow]["dial_method"]
          ).id;
          let telegramDefaultData = this.getTelegramDefaultValue(dial_method);
          if (telegramDefaultData.dw.is_usable === 0) {
            updated[key] = "";
          }
        }

        if (
          key === "fluid_amount" &&
          updated[key] !== "" &&
          rows[fromRow]["dial_method"] !== ""
        ) {
          let dial_method = dialMethods.find(
            (x) => x.value === rows[fromRow]["dial_method"]
          ).id;
          let telegramDefaultData = this.getTelegramDefaultValue(dial_method);
          if (telegramDefaultData.fluid_amount.is_usable === 0) {
            updated[key] = "";
          }
        }

        if (
          key === "blood_flow" &&
          updated[key] !== "" &&
          rows[fromRow]["dial_method"] !== ""
        ) {
          let dial_method = dialMethods.find(
            (x) => x.value === rows[fromRow]["dial_method"]
          ).id;
          let telegramDefaultData = this.getTelegramDefaultValue(dial_method);
          if (telegramDefaultData.blood_flow.is_usable === 0) {
            updated[key] = "";
          }
        }

        if (
          key === "degree" &&
          updated[key] !== "" &&
          rows[fromRow]["dial_method"] !== ""
        ) {
          let dial_method = dialMethods.find(
            (x) => x.value === rows[fromRow]["dial_method"]
          ).id;
          let telegramDefaultData = this.getTelegramDefaultValue(dial_method);
          if (telegramDefaultData.degree.is_usable === 0) {
            updated[key] = "";
          }
        }

        if (
          key === "fluid_temperature" &&
          updated[key] !== "" &&
          rows[fromRow]["dial_method"] !== ""
        ) {
          let dial_method = dialMethods.find(
            (x) => x.value === rows[fromRow]["dial_method"]
          ).id;
          let telegramDefaultData = this.getTelegramDefaultValue(dial_method);
          if (telegramDefaultData.fluid_temperature.is_usable === 0) {
            updated[key] = "";
          }
        }

        if (
          key === "dialysate_amount" &&
          updated[key] !== "" &&
          rows[fromRow]["dial_method"] !== ""
        ) {
          let dial_method = dialMethods.find(
            (x) => x.value === rows[fromRow]["dial_method"]
          ).id;
          let telegramDefaultData = this.getTelegramDefaultValue(dial_method);
          if (telegramDefaultData.dialysate_amount.is_usable === 0) {
            updated[key] = "";
          }
        }

        if (
          key === "hdf_init_time" &&
          updated[key] !== "" &&
          rows[fromRow]["dial_method"] !== ""
        ) {
          let dial_method = dialMethods.find(
            (x) => x.value === rows[fromRow]["dial_method"]
          ).id;
          let telegramDefaultData = this.getTelegramDefaultValue(dial_method);
          if (telegramDefaultData.hdf_init_time.is_usable === 0) {
            updated[key] = "";
          }
        }

        if (
          key === "hdf_init_amount" &&
          updated[key] !== "" &&
          rows[fromRow]["dial_method"] !== ""
        ) {
          let dial_method = dialMethods.find(
            (x) => x.value === rows[fromRow]["dial_method"]
          ).id;
          let telegramDefaultData = this.getTelegramDefaultValue(dial_method);
          if (telegramDefaultData.hdf_init_amount.is_usable === 0) {
            updated[key] = "";
          }
        }

        if (
          key === "hdf_step" &&
          updated[key] !== "" &&
          rows[fromRow]["dial_method"] !== ""
        ) {
          let dial_method = dialMethods.find(
            (x) => x.value === rows[fromRow]["dial_method"]
          ).id;
          let telegramDefaultData = this.getTelegramDefaultValue(dial_method);
          if (telegramDefaultData.hdf_step.is_usable === 0) {
            updated[key] = "";
          }
        }

        if (
          key === "hdf_speed" &&
          updated[key] !== "" &&
          rows[fromRow]["dial_method"] !== ""
        ) {
          let dial_method = dialMethods.find(
            (x) => x.value === rows[fromRow]["dial_method"]
          ).id;
          let telegramDefaultData = this.getTelegramDefaultValue(dial_method);
          if (telegramDefaultData.hdf_speed.is_usable === 0) {
            updated[key] = "";
          }
        }

        if (
          key === "dilution_timing" &&
          updated[key] !== "" &&
          rows[fromRow]["dial_method"] !== ""
        ) {
          let dial_method = dialMethods.find(
            (x) => x.value === rows[fromRow]["dial_method"]
          ).id;
          let telegramDefaultData = this.getTelegramDefaultValue(dial_method);
          if (telegramDefaultData.dilution_timing.is_usable === 0) {
            updated[key] = "";
            let selector = this.state.selector;
            if (selector[fromRow] == undefined) selector[fromRow] = {};
            selector[fromRow]["dilution_timing"] = 0;
            this.setState({ selector });
          }
        }

        if (key === "reservation_time") {
          if (updated[key] !== "" && rows[fromRow]["fluid_speed"] !== "") {
            let time = updated[key].split(":");
            let update_data = { fluid_amount: "" };
            if (!isNaN(parseFloat(rows[fromRow]["fluid_speed"]))) {
              precision = this.decimal_info != null && this.decimal_info['fluid_amount'] !=undefined? this.decimal_info['fluid_amount']['value']: 1;
              update_data["fluid_amount"] = ((parseInt(time[0]) + parseInt(time[1]) / 60) *
                parseFloat(rows[fromRow]["fluid_speed"])
              ).toFixed(precision);
              this.setState((state) => {
                const rows = state.rows.slice();
                for (let i = fromRow; i <= toRow; i++) {
                  rows[i] = { ...rows[i], ...update_data };
                }
                return { rows };
              });
            }
          }
        }

        if (key === "reservation_time" || key === "scheduled_start_time") {
          let change_flag = false;
          let time = "";
          let start_time = "";
          if (key === "reservation_time") {
            if (
              updated[key] !== "" &&
              rows[fromRow]["scheduled_start_time"] !== ""
            ) {
              change_flag = true;
              time = updated[key];
              start_time = rows[fromRow]["scheduled_start_time"];
            }
          }
          if (key === "scheduled_start_time") {
            if (
              updated[key] !== "" &&
              rows[fromRow]["reservation_time"] !== ""
            ) {
              change_flag = true;
              time = rows[fromRow]["reservation_time"];
              start_time = updated[key];
            }
          }
          if (change_flag && time !== undefined && time != null && start_time !== undefined && start_time != null) {
            time = time.split(":");
            start_time = start_time.split(":");
            let update_data = { scheduled_end_time: "" };
            let finish_minutes = parseInt(start_time[1]) + parseInt(time[1]);
            let add_hour = false;
            if (finish_minutes % 10 === 5) {
              finish_minutes += 5;
            }
            if (finish_minutes >= 60) {
              add_hour = true;
              finish_minutes -= 60;
            }
            let finish_hour = parseInt(start_time[0]) + parseInt(time[0]);
            if (add_hour) {
              finish_hour += 1;
            }
            if (finish_hour >= 24) {
              finish_hour -= 24;
            }
            if (finish_hour < 10) {
              if (finish_minutes < 10) {
                update_data["scheduled_end_time"] =
                  "0" + finish_hour + ":" + "0" + finish_minutes;
              } else {
                update_data["scheduled_end_time"] =
                  "0" + finish_hour + ":" + finish_minutes;
              }
            } else {
              if (finish_minutes < 10) {
                update_data["scheduled_end_time"] =
                  finish_hour + ":" + "0" + finish_minutes;
              } else {
                update_data["scheduled_end_time"] =
                  finish_hour + ":" + finish_minutes;
              }
            }
            this.setState((state) => {
              const rows = state.rows.slice();
              for (let i = fromRow; i <= toRow; i++) {
                rows[i] = { ...rows[i], ...update_data };
              }
              return { rows };
            });
          }
        }

        if (key === "bed_no") {
          if (updated[key] !== "") {
            let cur_console = bed_nos.find((x) => x.value === updated[key])
              .console;
            if (!isNaN(cur_console)) {
              let update_data = {
                console: consoles.find((x) => x.id === cur_console).value,
              };
              let selector = this.state.selector;
              if (selector[fromRow] == undefined) selector[fromRow] = {};
              selector[fromRow]["console"] = cur_console;
              this.setState((state) => {
                const rows = state.rows.slice();
                for (let i = fromRow; i <= toRow; i++) {
                  rows[i] = { ...rows[i], ...update_data };
                }
                return { rows, selector };
              });
            }
          }
        }

        if (rows[fromRow].group === "" && updated[key] !== "") {
          if (this.state.dial_group !== "") {
            let selector = this.state.selector;
            if (selector[fromRow] == undefined) selector[fromRow] = {};
            selector[fromRow]["group"] = this.state.dial_group;
            let update_data = {
              group: this.dial_group_codes.find((x) => x.id == this.state.dial_group)
                .value,
            };
            this.setState((state) => {
              const rows = state.rows.slice();
              for (let i = fromRow; i <= toRow; i++) {
                rows[i] = { ...rows[i], ...update_data };
              }
              return { rows, selector };
            });
          }
        }

        if (rows[fromRow].group2 === "" && updated[key] !== "") {
          if (this.state.dial_group2 !== "") {
            let selector = this.state.selector;
            if (selector[fromRow] == undefined) selector[fromRow] = {};
            selector[fromRow]["group2"] = this.state.dial_group2;
            let update_data = {
              group2: this.dial_group_2_codes.find((x) => x.id == this.state.dial_group2)
                .value,
            };
            this.setState((state) => {
              const rows = state.rows.slice();
              for (let i = fromRow; i <= toRow; i++) {
                rows[i] = { ...rows[i], ...update_data };
              }
              return { rows, selector };
            });
          }
        }
      });
    }
    this.setState((state) => {
      const rows = state.rows.slice();
      for (let i = fromRow; i <= toRow; i++) {
        rows[i] = { ...rows[i], ...updated };
      }
      return { rows };
    });
  };

  getValueFromId = (options, id) => {
    let value = "";
    Object.keys(options).map((key) => {
      if (options[key].id == id) {
        value = options[key].value;
      }
    });

    return value;
  };

  getCellActions(column, row) {
    if (
      column.key === "time_zone" ||
      column.key === "bed_no" ||
      column.key === "console" ||
      column.key === "group" ||
      column.key === "group2" ||
      column.key === "dial_method" ||
      column.key === "dilution_timing" ||
      column.key === "dial_liquid" ||
      column.key === "puncture_needle_a" ||
      column.key === "puncture_needle_v" ||
      column.key === "fixed_tape" ||
      column.key === "disinfection_liquid"
    ) {
      column.editor.props.options.map((item) => {
        if (row[column.key] == item.value) {
          let selector = this.state.selector;
          if (selector[row.id] == undefined) selector[row.id] = {};

          let new_item = {};
          Object.keys(selector[row.id]).map((idx) => {
            new_item[idx] = selector[row.id][idx];
          });
          new_item[column.key] = item.id;
          selector[row.id] = new_item;
          this.setState({ selector: selector });
        }
      });
    }
  }

  selectDoctor = (doctor) => {
    this.setState({
      directer_name: doctor.name,
      instruction_doctor_number: doctor.number,
    });
    this.context.$updateDoctor(doctor.number, doctor.name);
    this.setChangeFlag(1);
    this.closeDoctorSelectModal();
  };

  showDoctorList = (e) => {
    
    // ■DN601 入力者関連のラベルのカーソルの統一
    if (e != undefined && (e.target.type == undefined || e.target.type != "text")) return;

    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.doctor_number > 0) {
      this.setState({
        directer_name: authInfo.name,
        instruction_doctor_number: authInfo.doctor_number,
      });
    } else {
      this.setState({
        isShowDoctorList: true,
      });
    }
  };

  closeDoctorSelectModal = () => {
    this.setState({
      isShowDoctorList: false,
    });
  };

  goOtherPattern = (url) => {
    if (this.change_flag === 1) {
      this.setState({
        isOpenMoveOtherPageConfirm: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type: "other_tab",
        go_url: url,
        confirm_alert_title:'入力中',
      });
      return;
    }
    if (url == "/dial/schedule/Schedule")
      sessApi.setObjectValue("dial_schedule_table", "open_tab", "dial");
    this.props.history.replace(url);
  };

  // handleCellFocus=()=>{}
  handleCellFocus = (args) => {
    //
    for (let index = 0; index < 7; index++) {
      let row_obj = document.getElementsByClassName("react-grid-Row")[index];
      let dilution_timing_obj = document.getElementsByClassName(
        "dilution-timing"
      )[index + 1];
      if (
        row_obj !== undefined &&
        row_obj != null &&
        dilution_timing_obj !== undefined &&
        dilution_timing_obj != null
      ) {
        row_obj.style["background-color"] = "";
        dilution_timing_obj.style["display"] = "block";
      }
    }
    if (args["idx"] == 14) {
      let rows = this.state.rows;
      let cur_row = rows[args["rowIdx"]];
      if (cur_row.dial_method !== "") {
        let dial_method = dialMethods.find(
          (x) => x.value === cur_row.dial_method
        ).id;
        let telegramDefaultData = this.getTelegramDefaultValue(dial_method);
        let dilution_timing_obj = document.getElementsByClassName(
          "dilution-timing"
        )[args["rowIdx"] + 1];
        let row_obj = document.getElementsByClassName("react-grid-Row")[
          args["rowIdx"]
        ];
        if (dilution_timing_obj !== undefined && dilution_timing_obj != null) {
          if (
            telegramDefaultData.dilution_timing.is_usable === 0 &&
            row_obj !== undefined &&
            row_obj != null
          ) {
            dilution_timing_obj.style["display"] = "none";
            row_obj.style["background-color"] = "grey";
          } else {
            dilution_timing_obj.style["display"] = "block";
            row_obj.style["background-color"] = "";
          }
        }
      }
    }
    // if(args['idx'] == 14){  //前補液/後補液の選択 row number = 14
    //     let cur_row = rows[args['rowIdx']];
    //     let dilution_timing_obj= document.getElementsByClassName("dilution-timing")[args['rowIdx']+1];
    //     if(dilution_timing_obj !== undefined && dilution_timing_obj != null){
    //         dilution_timing_obj.style['background-color'] = "";
    //     }
    //     if (document.getElementsByClassName("react-grid-Row")[args['rowIdx']] !=undefined){
    //         let dial_method_cell = document.getElementsByClassName("react-grid-Row")[args['rowIdx']].getElementsByClassName("react-grid-Cell")[14];
    //         if(cur_row.dial_method !== "" && dial_method_cell != undefined){
    //             let dial_method = dialMethods.find(x => x.value === cur_row.dial_method).id;
    //             let telegramDefaultData = this.getTelegramDefaultValue(dial_method);
    //             if(telegramDefaultData.dilution_timing.is_usable === 0){
    //                 dial_method_cell.style['display'] = "none";
    //                 let row_obj= document.getElementsByClassName("react-grid-Row")[args['rowIdx']];
    //                 if(row_obj !== undefined && row_obj != null){
    //                     row_obj.style['background-color'] = "grey";
    //                 }
    //             }
    //         }
    //     }
    // }
  };

  componentDidUpdate() {
    let pattern_data = this.state.rows;
    for (let index = 0; index < 7; index++) {
      let row_obj = document.getElementsByClassName("react-grid-Row")[index];
      let row_data = pattern_data[index];
      if (
        row_data["dial_method"] !== "" &&
        row_obj !== undefined &&
        row_obj != null
      ) {
        let dial_method = dialMethods.find(
          (x) => x.value === row_data["dial_method"]
        ).id;
        let telegramDefaultData = this.getTelegramDefaultValue(dial_method);
        let dw_cell_obj = document.getElementsByClassName("dw-cell")[index + 1];
        if (telegramDefaultData.dw.is_usable === 1) {
          if (dw_cell_obj !== undefined && dw_cell_obj != null) {
            dw_cell_obj.style["background-color"] = "";
          }
        } else {
          if (dw_cell_obj !== undefined && dw_cell_obj != null) {
            dw_cell_obj.style["background-color"] = "grey";
          }
        }
        let fluid_amount_obj = document.getElementsByClassName("fluid-amount")[
          index + 1
        ];
        if (telegramDefaultData.fluid_amount.is_usable === 1) {
          if (fluid_amount_obj !== undefined && fluid_amount_obj != null) {
            fluid_amount_obj.style["background-color"] = "";
          }
        } else {
          if (fluid_amount_obj !== undefined && fluid_amount_obj != null) {
            fluid_amount_obj.style["background-color"] = "grey";
          }
        }
        let fluid_speed_obj = document.getElementsByClassName("fluid-speed")[
          index + 1
        ];
        if (telegramDefaultData.fluid_speed.is_usable === 1) {
          if (fluid_speed_obj !== undefined && fluid_speed_obj != null) {
            fluid_speed_obj.style["background-color"] = "";
          }
        } else {
          if (fluid_speed_obj !== undefined && fluid_speed_obj != null) {
            fluid_speed_obj.style["background-color"] = "grey";
          }
        }
        let blood_flow_obj = document.getElementsByClassName("blood-flow")[
          index + 1
        ];
        if (telegramDefaultData.blood_flow.is_usable === 1) {
          if (blood_flow_obj !== undefined && blood_flow_obj != null) {
            blood_flow_obj.style["background-color"] = "";
          }
        } else {
          if (blood_flow_obj !== undefined && blood_flow_obj != null) {
            blood_flow_obj.style["background-color"] = "grey";
          }
        }
        let degree_cell_obj = document.getElementsByClassName("degree-cell")[
          index + 1
        ];
        if (telegramDefaultData.degree.is_usable === 1) {
          if (degree_cell_obj !== undefined && degree_cell_obj != null) {
            degree_cell_obj.style["background-color"] = "";
          }
        } else {
          if (degree_cell_obj !== undefined && degree_cell_obj != null) {
            degree_cell_obj.style["background-color"] = "grey";
          }
        }
        let fluid_temperature_obj = document.getElementsByClassName(
          "fluid-temperature"
        )[index + 1];
        if (telegramDefaultData.fluid_temperature.is_usable === 1) {
          if (
            fluid_temperature_obj !== undefined &&
            fluid_temperature_obj != null
          ) {
            fluid_temperature_obj.style["background-color"] = "";
          }
        } else {
          if (
            fluid_temperature_obj !== undefined &&
            fluid_temperature_obj != null
          ) {
            fluid_temperature_obj.style["background-color"] = "grey";
          }
        }
        let dialysate_amount_obj = document.getElementsByClassName(
          "dialysate-amount"
        )[index + 1];
        if (telegramDefaultData.dialysate_amount.is_usable === 1) {
          if (
            dialysate_amount_obj !== undefined &&
            dialysate_amount_obj != null
          ) {
            dialysate_amount_obj.style["background-color"] = "";
          }
        } else {
          if (
            dialysate_amount_obj !== undefined &&
            dialysate_amount_obj != null
          ) {
            dialysate_amount_obj.style["background-color"] = "grey";
          }
        }
        let hdf_init_time_obj = document.getElementsByClassName(
          "hdf-init-time"
        )[index + 1];
        if (telegramDefaultData.hdf_init_time.is_usable === 1) {
          if (hdf_init_time_obj !== undefined && hdf_init_time_obj != null) {
            hdf_init_time_obj.style["background-color"] = "";
          }
        } else {
          if (hdf_init_time_obj !== undefined && hdf_init_time_obj != null) {
            hdf_init_time_obj.style["background-color"] = "grey";
          }
        }
        let hdf_init_amount_obj = document.getElementsByClassName(
          "hdf-init-amount"
        )[index + 1];
        if (telegramDefaultData.hdf_init_amount.is_usable === 1) {
          if (
            hdf_init_amount_obj !== undefined &&
            hdf_init_amount_obj != null
          ) {
            hdf_init_amount_obj.style["background-color"] = "";
          }
        } else {
          if (
            hdf_init_amount_obj !== undefined &&
            hdf_init_amount_obj != null
          ) {
            hdf_init_amount_obj.style["background-color"] = "grey";
          }
        }
        let hdf_step_obj = document.getElementsByClassName("hdf-step")[
          index + 1
        ];
        if (telegramDefaultData.hdf_step.is_usable === 1) {
          if (hdf_step_obj !== undefined && hdf_step_obj != null) {
            hdf_step_obj.style["background-color"] = "";
          }
        } else {
          if (hdf_step_obj !== undefined && hdf_step_obj != null) {
            hdf_step_obj.style["background-color"] = "grey";
          }
        }
        let hdf_speed_obj = document.getElementsByClassName("hdf-speed")[
          index + 1
        ];
        if (telegramDefaultData.hdf_speed.is_usable === 1) {
          if (hdf_speed_obj !== undefined && hdf_speed_obj != null) {
            hdf_speed_obj.style["background-color"] = "";
          }
        } else {
          if (hdf_speed_obj !== undefined && hdf_speed_obj != null) {
            hdf_speed_obj.style["background-color"] = "grey";
          }
        }
        let dilution_timing_obj = document.getElementsByClassName(
          "dilution-timing"
        )[index + 1];
        if (telegramDefaultData.dilution_timing.is_usable === 1) {
          if (
            dilution_timing_obj !== undefined &&
            dilution_timing_obj != null
          ) {
            dilution_timing_obj.style["background-color"] = "";
            row_obj.style["background-color"] = "";
          }
        } else {
          if (
            dilution_timing_obj !== undefined &&
            dilution_timing_obj != null
          ) {
            dilution_timing_obj.style["background-color"] = "grey";
          }
        }
      } else {
        let dw_cell_obj = document.getElementsByClassName("dw-cell")[index + 1];
        if (dw_cell_obj !== undefined && dw_cell_obj != null) {
          dw_cell_obj.style["background-color"] = "";
        }
        let fluid_amount_obj = document.getElementsByClassName("fluid-amount")[
          index + 1
        ];
        if (fluid_amount_obj !== undefined && fluid_amount_obj != null) {
          fluid_amount_obj.style["background-color"] = "";
        }
        let fluid_speed_obj = document.getElementsByClassName("fluid-speed")[
          index + 1
        ];
        if (fluid_speed_obj !== undefined && fluid_speed_obj != null) {
          fluid_speed_obj.style["background-color"] = "";
        }
        let blood_flow_obj = document.getElementsByClassName("blood-flow")[
          index + 1
        ];
        if (blood_flow_obj !== undefined && blood_flow_obj != null) {
          blood_flow_obj.style["background-color"] = "";
        }
        let degree_cell_obj = document.getElementsByClassName("degree-cell")[
          index + 1
        ];
        if (degree_cell_obj !== undefined && degree_cell_obj != null) {
          degree_cell_obj.style["background-color"] = "";
        }
        let fluid_temperature_obj = document.getElementsByClassName(
          "fluid-temperature"
        )[index + 1];
        if (
          fluid_temperature_obj !== undefined &&
          fluid_temperature_obj != null
        ) {
          fluid_temperature_obj.style["background-color"] = "";
        }
        let dialysate_amount_obj = document.getElementsByClassName(
          "dialysate-amount"
        )[index + 1];
        if (
          dialysate_amount_obj !== undefined &&
          dialysate_amount_obj != null
        ) {
          dialysate_amount_obj.style["background-color"] = "";
        }
        let hdf_init_time_obj = document.getElementsByClassName(
          "hdf-init-time"
        )[index + 1];
        if (hdf_init_time_obj !== undefined && hdf_init_time_obj != null) {
          hdf_init_time_obj.style["background-color"] = "";
        }
        let hdf_init_amount_obj = document.getElementsByClassName(
          "hdf-init-amount"
        )[index + 1];
        if (hdf_init_amount_obj !== undefined && hdf_init_amount_obj != null) {
          hdf_init_amount_obj.style["background-color"] = "";
        }
        let hdf_step_obj = document.getElementsByClassName("hdf-step")[
          index + 1
        ];
        if (hdf_step_obj !== undefined && hdf_step_obj != null) {
          hdf_step_obj.style["background-color"] = "";
        }
        let hdf_speed_obj = document.getElementsByClassName("hdf-speed")[
          index + 1
        ];
        if (hdf_speed_obj !== undefined && hdf_speed_obj != null) {
          hdf_speed_obj.style["background-color"] = "";
        }
        let dilution_timing_obj = document.getElementsByClassName(
          "dilution-timing"
        )[index + 1];
        if (dilution_timing_obj !== undefined && dilution_timing_obj != null) {
          dilution_timing_obj.style["background-color"] = "";
          row_obj.style["background-color"] = "";
          dilution_timing_obj.style["display"] = "block";
        }
      }
    }
    this.changeBackground();
  }
  
  changeBackground = () => {
    if(this.state.startdate == "" || this.state.startdate == null){
      addRequiredBg("startdate_id");
    } else {
      removeRequiredBg("startdate_id");
    }
    if(this.state.entry_date == "" || this.state.entry_date == null){
      addRequiredBg("entry_date_id");
    } else {
      removeRequiredBg("entry_date_id");
    }
    if(this.state.entry_time == "" || this.state.entry_time == null){
      addRequiredBg("entry_time_id");
    } else {
      removeRequiredBg("entry_time_id");
    }
    if(this.state.directer_name == "" || this.state.directer_name == null){
      addRequiredBg("directer_name_id");
    } else {
      removeRequiredBg("directer_name_id");
    }
  }

  setChangeFlag = (change_flag) => {
    this.change_flag = change_flag;
    this.setState({ change_flag });
    if (change_flag) {
      sessApi.setObjectValue("dial_change_flag", "dial_pattern", 1);
    } else {
      sessApi.remove("dial_change_flag");
    }
  };

  moveOtherPage = () => {
    this.setChangeFlag(0);
    let confirm_type = this.state.confirm_type;
    let go_url = this.state.go_url;
    this.setState(
      {
        isOpenMoveOtherPageConfirm: false,
        confirm_message: "",
        confirm_type: "",
        confirm_alert_title:'',
      },
      () => {
        if (confirm_type === "other_tab") {
          this.goOtherPattern(go_url);
        } else if (confirm_type == "edit_pattern") {
          this.editPattern();
        }
      }
    );
  };

  closeAlertModal = () => {
    this.setState({check_message: ''});
    if(this.state.error_arr.length > 0){
      let first_obj = this.state.error_arr[0];
      $("#" + first_obj.tag_id).focus();
    }
  }

  resetDatePicker = (e) => {    
    if (this.state.error_arr.length > 0 && e.target.id == this.state.error_arr[0].tag_id){
      addRedBorder(e.target.id);
    }
    this.forceUpdate();
  }

  showHistoryModal = (item) => {        
    this.setState({
      isOpenHistoryModal:true,
      selected_history_item:item
    })
  }

  handleClick = (e, item) => {
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextMenuPatternBox: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextcontextMenuPatternBoxMenu: { visible: false }
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
          .getElementById("pattern-box")
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({
              contextMenuPatternBox: { visible: false }
            });
            document
              .getElementById("pattern-box")
              .removeEventListener(`scroll`, onScrollOutside);
          });  
      this.setState({
        contextMenuPatternBox: {
          visible: true,
          x: e.clientX -200,
          y: e.clientY + window.pageYOffset - 70,
          item:item
        },
      });
    }
  }

  openConsentModal = () => {    
    this.setState({
      isOpenConsentModal:true
    })
  }

  render() {    
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let conf_data = JSON.parse(window.sessionStorage.getItem("init_status")).conf_data;  
    let dialData = [];
    let message;
    let can_delete = this.state.pattern_table_id != "";
    let del_tooltip = "";
    if (this.state.patient_id === "") {
      del_tooltip = "患者様を選択してください。";
    }
    if (this.state.pattern_table_id === "") {
      del_tooltip = "削除するパターンを選択してください。";
    }
    if (this.context.$canDoAction(this.context.FEATURES.DIAL_SYSTEM,this.context.AUTHS.DELETE) === false) {
      del_tooltip = "削除権限がありません。";
    }
    let clear_tooltip = this.state.change_flag
      ? ""
      : "変更した内容がありません";
    if (this.state.dial_pattern_list.length) {
      dialData = this.state.dial_pattern_list.map((item, index) => {
        return (
          <>
            <div onContextMenu={e => this.handleClick(e, item)}
              className={this.state.selected_row == item.number? "selected pattern-list": "pattern-list"}
              onClick={this.editpatternConfirm.bind(this, item)}
            >
              <div className="pattern-index bt-1p bl-1p bb-1p br-1p">
                {index + 1}
              </div>
              <div className="pattern-area flex bt-1p bb-1p">
                {item.pattern.map((ele) => {
                  if (ele.time_zone != "") {
                    return (
                      <>
                        <div className="pattern-week-day border-bottom">
                          {ele.day}
                        </div>
                        {typeof ele.time_zone == "number" ? (
                          <>
                            <div className="pattern-time_zone bl-1p border-bottom">
                              {timezones[ele.time_zone] != undefined
                                ? timezones[ele.time_zone].value
                                : ""}
                            </div>
                            <div className="pattern-bed_no bl-1p border-bottom">
                              {this.getValueFromId(bed_nos, ele.bed_no)}
                            </div>
                            <div className="pattern-console bl-1p border-bottom">
                              {this.getValueFromId(consoles, ele.console)}
                            </div>
                            <div className="pattern-reservation_time bl-1p border-bottom">
                              {ele.reservation_time}
                            </div>
                            <div className="pattern-scheduled_start_time bl-1p border-bottom">
                              {ele.scheduled_start_time}&nbsp;
                            </div>
                            <div className="pattern-dial_method bl-1p border-bottom text-left pl-1">
                              {this.getValueFromId(
                                dialMethods,
                                ele.dial_method
                              )}
                            </div>
                            <div className="pattern-group bl-1p border-bottom">                              
                              {this.dial_group_codes.find((x) => x.id == ele.group).value}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="pattern-time_zone bl-1p border-bottom">
                              {ele.time_zone}
                            </div>
                            <div className="pattern-bed_no bl-1p border-bottom">
                              {ele.bed_no}
                            </div>
                            <div className="pattern-console bl-1p border-bottom">
                              {ele.console}
                            </div>
                            <div className="pattern-reservation_time bl-1p border-bottom">
                              {ele.reservation_time}
                            </div>
                            <div className="pattern-scheduled_start_time bl-1p border-bottom">
                              {ele.scheduled_start_time}
                            </div>
                            <div className="pattern-dial_method bl-1p border-bottom text-left pl-1">
                              {ele.dial_method}
                            </div>
                            <div className="pattern-group bl-1p border-bottom">
                              {ele.group}
                            </div>
                          </>
                        )}
                      </>
                    );
                  }
                })}
              </div>
              <div className="pattern-time_limit_from bt-1p bl-1p bb-1p">
                {formatDateSlash(item.time_limit_from)}
              </div>
              <div className="pattern-time_limit_to bt-1p bl-1p bb-1p br-1p">
                {item.time_limit_to == null
                  ? "～ 無期限"
                  : formatDateSlash(item.time_limit_to)}
              </div>
            </div>
          </>
        );
      });
    } else {
      message = (
        <div className="no-result">
          <span>登録された透析パターンがありません。</span>
        </div>
      );
    }
    return (
      <>
        <DialSideBar
          onGoto={this.selectPatient}
          ref={(ref) => (this.sideBarRef = ref)}
          history = {this.props.history}
        />
        <DialPatientNav
          patientInfo={this.state.patientInfo} 
          history = {this.props.history}
        />
        <Card>
          <div className={"flex"}>
            <div className="title">透析パターン</div>
            <div className={"other-pattern"}>
              <Button className="schedule-button" onClick={this.goOtherPattern.bind(this,"/dial/schedule/Schedule")}>スケジュール</Button>
              <Button className="disable-button">透析</Button>
              <Button onClick={this.goOtherPattern.bind(this,"/dial/pattern/anticoagulation")}>抗凝固法</Button>
              <Button onClick={this.goOtherPattern.bind(this,"/dial/pattern/Dializer")}>ダイアライザ</Button>
              <Button onClick={this.goOtherPattern.bind(this,"/dial/pattern/injection")}>注射</Button>
              <Button onClick={this.goOtherPattern.bind(this,"/dial/pattern/prescription")}>処方</Button>
              <Button onClick={this.goOtherPattern.bind(this,"/dial/pattern/inspection")}>検査</Button>
              <Button onClick={this.goOtherPattern.bind(this,"/dial/pattern/dialPrescript")}>透析中処方</Button>
              <Button onClick={this.goOtherPattern.bind(this,"/dial/pattern/administrativefee")}>管理料</Button>
            </div>
          </div>
          <div className="bodywrap">
            <Wrapper>
              <div className="top-table">
                <div className="dial-list">
                  <div className="table-header">
                    <div className={"pattern-index bt-1p bl-1p bb-1p"}>No</div>
                    <div className={"pattern-week-day bt-1p bl-1p bb-1p"}>曜日</div>
                    <div className={"pattern-time_zone  bt-1p bl-1p bb-1p"}>時間帯</div>
                    <div className={"pattern-bed_no  bt-1p bl-1p bb-1p"}>ベッドNo</div>
                    <div className={"pattern-console  bt-1p bl-1p bb-1p"}>コンソール</div>
                    <div className={"pattern-reservation_time  bt-1p bl-1p bb-1p"}>透析時間</div>
                    <div className={"pattern-scheduled_start_time  bt-1p bl-1p bb-1p"}>開始予定時刻</div>
                    <div className={"pattern-dial_method  bt-1p bl-1p bb-1p"}>治療法</div>
                    <div className={"pattern-group  bt-1p bl-1p bb-1p"}>グループ</div>
                    <div className={"pattern-time_limit_from bt-1p bl-1p bb-1p br-1p"}>期限</div>
                  </div>
                  <DialDataBox id = 'pattern-box'>
                    {dialData}
                    {message}
                  </DialDataBox>
                </div>
                {conf_data.instruction_doctor_consent_is_enabled == "ON" && authInfo.doctor_number > 0 && (
                  <div style={{marginTop:'0.6rem'}}>
                    <Button type='mono' className='cancel-btn' onClick={this.openConsentModal.bind(this)}>未承認一覧</Button>
                  </div>
                )}
              </div>
              <div className="padding">
                <Checkbox
                  label="期限切れも表示"
                  getRadio={this.getCheckedLast.bind(this)}
                  value={this.state.checkLastPeriod}
                  isDisabled = {this.state.patient_id>0?false:true}
                  name="last"
                />
              </div>
              <div className="dial-body flex transparent-border" id={'dial_body_id'}>
                <div className={"week-name-area"}>
                  <div className={"week-name"}>
                    <label>曜日</label>
                  </div>
                  <div className={"week-day"}>
                    <label>日</label>
                  </div>
                  <div className={"week-day"}>
                    <label>月</label>
                  </div>
                  <div className={"week-day"}>
                    <label>火</label>
                  </div>
                  <div className={"week-day"}>
                    <label>水</label>
                  </div>
                  <div className={"week-day"}>
                    <label>木</label>
                  </div>
                  <div className={"week-day"}>
                    <label>金</label>
                  </div>
                  <div className={"week-day"}>
                    <label>土</label>
                  </div>
                </div>
                <div style={{ width: "calc(100% - 55px)", zIndex: "1" }}>
                  <ReactDataGrid
                    columns={this.columns}
                    headerRowHeight={60}
                    rowGetter={(i) => this.state.rows[i]}
                    rowsCount={7}
                    rowHeight={30}
                    dragable={false}
                    onGridRowsUpdated={this.onGridRowsUpdated}
                    enableCellSelect={true}
                    getCellActions={(column, row) =>
                      this.getCellActions(column, row)
                    }
                    onCellSelected={(args) => {
                      this.handleCellFocus(args);
                    }}
                    contextMenu={<ExampleContextMenu parent={this} />}
                    RowsContainer={ContextMenuTrigger}
                  />
                </div>
              </div>
              <div className="dial-oper flex">
                <div className="left-area">
                  <div className="flex">
                    <div className="period">
                      <InputWithLabelBorder
                        label="期限"
                        type="date"
                        id='startdate_id'
                        getInputText={this.getStartdate.bind(this)}
                        diseaseEditData={this.state.startdate}
                        onBlur = {e => this.resetDatePicker(e)}
                      />
                      <div className="from-padding">
                        <InputWithLabelBorder
                          className=""
                          label="～"
                          type="date"
                          id='enddate_id'
                          placeholderText={
                            this.state.not_yet ? "無期限" : "年/月/日"
                          }
                          getInputText={this.getEnddate.bind(this)}
                          diseaseEditData={this.state.enddate}
                          onBlur = {e => this.resetDatePicker(e)}
                        />
                      </div>
                    </div>
                    <div className="delete-date flex">
                      <InputWithLabelBorder
                        label="中止日"
                        type="date"
                        id='stop_date_id'
                        getInputText={this.getDeleteStartdate.bind(this)}
                        diseaseEditData={this.state.stop_date}                        
                      />
                      <div className={"from-to"}>～</div>
                      <InputWithLabelBorder
                        className=""
                        label="再開日"
                        type="date"
                        id='reopening_date_id'
                        getInputText={this.getDeleteEnddate.bind(this)}
                        diseaseEditData={this.state.reopening_date}                        
                      />
                    </div>
                  </div>
                  <div className={"flex"}>
                    <div style={{width:"3.5rem", marginRight:"0.5rem"}}></div>
                    <Checkbox
                      label="自動スケジュールを展開"
                      getRadio={this.getCheckedDm.bind(this)}
                      value={this.state.checkPeriod}
                      name="period"
                    />
                  </div>
                </div>
                <div className="right-area" style={{width:"25rem", marginLeft:"auto"}}>
                  {this.state.final_entry_date !== "" && (
                    <div className={"final-input"} style={{marginLeft:"auto"}}>
                      <div>最終入力日時：{this.state.final_entry_date}</div>
                      <div>入力者：{this.state.final_entry_name}</div>
                      <div>
                        指示者：
                        {this.state.final_doctor_name != undefined
                          ? this.state.final_doctor_name
                          : ""}
                      </div>
                    </div>
                  )}
                  <div className="input-time flex">
                    <InputWithLabelBorder
                      label="入力日"
                      type="date"
                      id='entry_date_id'
                      getInputText={this.getInputdate.bind(this)}
                      diseaseEditData={this.state.entry_date}
                      onBlur = {e => this.resetDatePicker(e)}
                    />
                    <div className={"entry-time"} >
                      <label style={{cursor:"text"}}>入力時間</label>
                      <DatePicker
                        locale="ja"
                        selected={this.state.entry_time}
                        onChange={this.getInputTime.bind(this)}
                        onKeyDown = {this.timeKeyEvent}
                        onBlur = {this.setTime}
                        value = {this.state.input_time_value}
                        id='entry_time_id'
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={10}
                        dateFormat="HH:mm"
                        timeFormat="HH:mm"                        
                        timeCaption="時間"
                      />
                    </div>
                  </div>
                  <div className={"input-info remove-x-input"}>
                      <InputWithLabel
                        label="入力者"
                        type="text"
                        placeholder=""
                        isDisabled={true}
                        diseaseEditData={this.state.entry_name}
                      />
                      {authInfo != undefined &&
                      authInfo != null &&
                      authInfo.doctor_number > 0 ? (
                        <InputWithLabelBorder
                          label="指示者"
                          type="text"
                          id='directer_name_id'
                          isDisabled={true}
                          diseaseEditData={this.state.directer_name}
                        />
                      ) : (
                        <>
                          <div
                            className="direct_man cursor-input"
                            onClick={(e)=>this.showDoctorList(e).bind(this)}
                          >
                            <InputWithLabelBorder
                              label="指示者"
                              type="text"
                              id='directer_name_id'
                              isDisabled={true}
                              diseaseEditData={this.state.directer_name}
                            />
                          </div>
                        </>
                      )}
                    </div>
                </div>
              </div>
            </Wrapper>
          </div>
          <div className="footer-buttons">
              <Button
                className={can_delete ? "delete-btn" : "disable-btn"}
                onClick={this.delete.bind(this)}
                tooltip={del_tooltip}
              >
                削除
              </Button>
            <Button
              className={this.state.change_flag ? "cancel-btn" : "disable-btn"}
              onClick={this.clear}
              tooltip={clear_tooltip}
            >
              クリア
            </Button>
              <Button className="change-btn" onClick={this.update.bind(this)}>
                変更
              </Button>
              <Button className="add-btn" onClick={this.add.bind(this)}>
                追加
              </Button>
          </div>
          {this.state.isClearConfirmModal !== false &&
            this.state.isConfirmComplete === false && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.clearPattern.bind(this)}
                confirmTitle={this.state.confirm_message}
              />
            )}
          {this.state.isAddConfirmModal !== false &&
            this.state.isConfirmComplete === false && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.addPattern.bind(this)}
                confirmTitle={this.state.confirm_message}
              />
            )}
          {this.state.isUpdateConfirmModal !== false &&
            this.state.isConfirmComplete === false && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.confirmReSchedule.bind(this)}
                confirmTitle={this.state.confirm_message}
              />
            )}
          {this.state.isReScheduleConfirm !== false &&
            this.state.isConfirmComplete === false && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.reScheduleCancel.bind(this)}
                confirmOk={this.updatePattern.bind(this, true)}
                confirmTitle={this.state.confirm_message}
              />
            )}
          {this.state.isDeleteConfirmModal !== false &&
            this.state.isConfirmComplete === false && (
              <PatternDeleteConfirmModal
                title={"透析"}
                closeModal={this.confirmCancel.bind(this)}
                confirmOk={this.deletePattern.bind(this)}
              />
            )}
          {this.state.isUpdateScheduleConfirmModal !== false &&
            this.state.isConfirmComplete === false && (
              <PatternUpdateConfirmModal
                title={"透析"}
                closeModal={this.confirmCancel.bind(this)}
                confirmOk={this.updatePatternSchedule.bind(this)}
              />
            )}
          {this.state.isShowDoctorList !== false && (
            <DialSelectMasterModal
              selectMaster={this.selectDoctor}
              closeModal={this.closeDoctorSelectModal}
              MasterCodeData={this.state.doctors}
              MasterName="医師"
            />
          )}
          {this.state.isConfirmComplete !== false && (
            <CompleteStatusModal message={this.state.complete_message} />
          )}
          {this.state.confirm_type === "bed_console" && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.makeScheduleByNoSet.bind(
                this,
                this.state.re_schedule
              )}
              confirmTitle={this.state.confirm_message}
            />
          )}
          {this.state.isOpenMoveOtherPageConfirm && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.moveOtherPage.bind(this)}
              confirmTitle={this.state.confirm_message}
              title = {this.state.confirm_alert_title}
            />
          )}
          {this.state.confirm_type === "time_limit" && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.lastPatternDelete.bind(
                this,
                this.state.re_schedule
              )}
              confirmTitle={this.state.confirm_message}
            />
          )}
          <ContextMenuPatternBox
            {...this.state.contextMenuPatternBox}
            parent={this}              
          />
          {this.state.check_message != "" && (
            <ValidateAlertModal
              handleOk={this.closeAlertModal}
              alert_meassage={this.state.check_message}
            />
          )}
          {this.state.isOpenHistoryModal && (
            <DialPatternHistoryModal
              closeModal = {this.confirmCancel}
              selected_history_item = {this.state.selected_history_item}
            />
          )}
          {this.state.isOpenConsentModal && (
            <DialPatternConsentModal
              closeModal = {this.confirmCancel}
              patientInfo = {this.state.patientInfo}
            />
          )}
        </Card>
      </>
    );
  }
}
dialPattern.contextType = Context;

dialPattern.propTypes = {
  history: PropTypes.object,
};
export default dialPattern;
