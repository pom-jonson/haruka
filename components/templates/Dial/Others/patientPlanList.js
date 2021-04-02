import React, { Component } from "react";

import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import DatePicker from "react-datepicker";
import Checkbox from "~/components/molecules/Checkbox";
import Button from "~/components/atoms/Button";
import {
  formatDateLine,
  formatJapan,
  formatJapanDate,
  formatJapanYear,
  formatJapanYearMonth,
} from "~/helpers/date";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import DialMultiSelectPatientModal from "~/components/templates/Dial/Common/DialMultiSelectPatientModal";
import * as methods from "~/components/templates/Dial/DialMethods";
import axios from "axios";
import * as apiClient from "~/api/apiClient";
import Context from "~/helpers/configureStore";
import { displayLineBreak, makeList_code, setDateColorClassName} from "~/helpers/dialConstants";
import * as sessApi from "~/helpers/cacheSession-utils";
import { getTimeZoneList } from "~/components/templates/Dial/DialMethods/getSystemTimeZone";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SchedulePreviewModal from "~/components/templates/Dial/Schedule/modals/SchedulePreviewModal";
import PatientScheduleModal from "~/components/templates/Dial/Schedule/modals/PatientScheduleModal";
import PlanPrintPrewModal from "~/components/templates/Dial/Schedule/modals/PlanPrintPrewModal";
import { secondary600 } from "~/components/_nano/colors";
import PropTypes from "prop-types";

const Card = styled.div`
  position: fixed;
  top: 0px;
  width: calc(100% - 190px);
  margin: 0px;
  height: 100vh;
  float: left;
  background-color: ${surface};
  padding: 1.25rem;
  .title {
    font-size: 2.5rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;
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
      margin-top: 2.2rem;
      float: right;
    }
    button:hover {
      background-color: ${secondary600};
    }
    span {
      color: white;
      font-size: 1rem;
      font-weight: 100;
    }
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
`;
const SearchPart = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 4.375rem;
  padding: 1.25rem;
  float: left;
  .search-box {
    width: 100%;
    display: flex;
  }
  .label-title {
    width: 6rem;
    text-align: right;
    margin-right: 0.625rem;
  }
  .pullbox-select {
    font-size: 1rem;
    width: 9.375rem;
  }
  .ixnvCM {
    font-size: 1.25rem;
  }
  .medicine_type {
    font-size: 1rem;
    margin-left: 1rem;
    .radio-btn label {
      width: 3.75rem;
      border: solid 1px rgb(206, 212, 218);
      border-radius: 0.25rem;
      margin: 0 0.3rem;
      padding: 0.25rem 0.3rem;
      font-size: 1rem;
    }
  }
  .radio-label {
    padding-right: 0.5rem;
    line-height: 2rem;
  }
  .select_date_range {
    display: flex;
    .pullbox {
      margin-right: 1.25rem;
    }
    span {
      margin: 0px 0.5rem;
      line-height: 2rem;
    }
  }
  .checkboxpart label {
    font-size: 1rem;
    margin-right: 4rem;
    line-height: 2rem;
  }
  .example-custom-input {
    font-size: 1rem;
    width: 11rem;
    text-align: center;
    padding: 0 0.5rem;
    border: 1px solid;
    line-height: 2rem;
    cursor: pointer;
  }
  .example-custom-input.disabled {
    background: lightgray;
  }
  .select_patient {
    button {
      span {
        font-size: 1rem;
      }
    }
  }

  button {
    margin-left: 0.625rem;
  }
`;
const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: calc(100vh - 15.625rem);
  float: left;
  margin-bottom: 0.625rem;
  label {
    text-align: right;
  }
  table {
    thead {
      display: table;
      width: calc(100% - 18px);
    }
    tbody {
      display: block;
      overflow-y: scroll;
      height: calc(100vh - 19rem);
      width: 100%;
    }
    tr {
      display: table;
      width: 100%;
    }
    tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    tr:hover{background-color:#e2e2e2 !important;}
    td {
      padding: 0.25rem;
      word-break: break-all;
      word-wrap: break-word;
    }
    th {
      position: sticky;
      text-align: center;
      padding: 0.3rem;
      word-break: break-all;
      word-wrap: break-word;
    }
    .last-th {
      border-right-style: none;
    }
    .table-check {
      width: 3.75rem;
      label {margin:0;}
      input {margin:0;}
    }
    .item-no {
      width: 3.125rem;
    }
    .code-number {
      width: 7.5rem;
    }
    .timezone {
      width: 3.8rem;
    }
    .patient_type {
      width: 5rem;
    }
    .patient-id {
      width: 7rem;
    }
    .patient-name {
      width: 20rem;
    }
    .manager_name {
      width: 12rem;
    }
    .attach_doc {
      width: 3rem;
    }
    .date-area {
      width: 9rem;
    }
  }
`;

const ContextMenuUl = styled.ul`
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
    font-size: 14px;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0 20px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
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
`;

const attach_doc_check = ["要", "不要", "未定"];

const ContextMenu = ({ visible, x, y, parent, favouriteMenuType }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div
              onClick={() =>
                parent.contextMenuAction(favouriteMenuType, "preview")
              }
            >
              プレビュー
            </div>
          </li>
          <li>
            <div
              onClick={() =>
                parent.contextMenuAction(favouriteMenuType, "edit")
              }
            >
              編集
            </div>
          </li>
          <li>
            <div
              onClick={() =>
                parent.contextMenuAction(favouriteMenuType, "delete")
              }
            >
              削除
            </div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const ContextMenu_d = ({ visible, x, y, parent, favouriteMenuType }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div
              onClick={() =>
                parent.contextMenuAction(favouriteMenuType, "recover")
              }
            >
              削除の取り消し
            </div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class patientPlanList extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let table_data = [];
    let time_zone_list = getTimeZoneList();
    let code_master = sessApi.getObjectValue(
      "dial_common_master",
      "code_master"
    );
    let oneMonthAgoFirstDay = new Date();
    oneMonthAgoFirstDay.setMonth(oneMonthAgoFirstDay.getMonth() - 1);
    oneMonthAgoFirstDay.setDate(1);
    let nextMonthlaterDay = new Date();
    nextMonthlaterDay.setMonth(nextMonthlaterDay.getMonth() + 2);
    nextMonthlaterDay.setDate(0);
    this.state = {
      start_date: oneMonthAgoFirstDay,
      end_date: nextMonthlaterDay,
      table_data,
      staff_name: "",
      patient_name: "",
      patient_id: 0,
      staff_id: 0,
      isShowPatientList: false,
      isShowStaffList: false,
      confirm_message: "",
      display_all: 1,
      all_period: 0,
      finishdelete: 0,
      preview_index: null,
      isOpenModal: false,

      selected_patients_list: [],
      time_zone_list,
      reserved_patient_codes: makeList_code(code_master["患者予定"]),
    };
  }

  async componentDidMount () {
    await this.getList();
    await this.getStaffs();
    //   this.getPatientList();
  }

  getList = async () => {
    let path = "/app/api/v2/dial/schedule/patient_schedule/list";
    let type = "";
    this.state.finishdelete == 1 ? (type = "all") : (type = "onlyenable");
    let post_data = {
      type: type,
      patient_number: 0,
      start_date:
        this.state.all_period != 1
          ? formatDateLine(this.state.start_date)
          : undefined,
      end_date:
        this.state.all_period != 1
          ? formatDateLine(this.state.end_date)
          : undefined,
      patient_ids: this.state.patient_ids,
    };
    const { data } = await axios.post(path, { params: post_data });
    if (data != undefined && data != null) {
      this.setState({
        table_data: data,
      });
    } else {
      this.setState({
        table_data: [],
      });
    }
  };

  getPatientList = async () => {
    let path = "/app/api/v2/dial/patient/list";
    var post_data = {};
    const { data } = await axios.post(path, { param: post_data });
    if (
      data != undefined &&
      data != null &&
      data.data != undefined &&
      data.data != null &&
      data.data.length > 0
    ) {
      var temp = [];
      data.data.map((item) => {
        item.name = item.patient_name;
        item.number = item.patient_number;
        temp.push(item.patient_number);
      });
      this.setState({
        selected_patients_list: temp,
        patientList: data.data,
      });
    } else {
      this.setState({
        patientList: [],
      });
    }
  };

  handleClick = (e, type) => {
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      that.setState({ contextMenu_d: { visible: false } });
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextMenu: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: { visible: false },
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("code-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false },
          });
          document
            .getElementById("code-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX,
          y: e.clientY + window.pageYOffset,
        },
        favouriteMenuType: type,
      });
    }
  };
  handleClickDeletedRow = (e, type) => {
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      that.setState({ contextMenu: { visible: false } });
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextMenu_d: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu_d: { visible: false },
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("code-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu_d: { visible: false },
          });
          document
            .getElementById("code-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      this.setState({
        contextMenu_d: {
          visible: true,
          x: e.clientX,
          y: e.clientY + window.pageYOffset,
        },
        favouriteMenuType: type,
      });
    }
  };

  closeModal = () => {
    this.setState({
      isShowPatientList: false,
      isShowStaffList: false,
    });
  };

  deleteconfirmModal = (index) => {
    this.setState({
      deleteconfirm: true,
      confirm_message: "削除しますか？",
      deleteindex: index,
    });
    return;
  };

  openeditModal = () => {
    if (this.state.patient_id == 0) {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    this.setState({
      modal_data: null,
      row_index: -1,
      isOpenModal: true,
    });
  };
  closeeditModal = () => {
    this.setState({
      isOpenModal: false,
      isOpenPrintPreviewModal: false,
    });
  };
  handleOk = () => {
    this.getSearchResult().then(() => {
      this.setState({
        isOpenModal: false,
      });
    });
  };
  openPrintPreview = () => {
    this.setState({
      isOpenPrintPreviewModal: true,
    });
  };
  getStartDate = (value) => {
    this.setState(
      {
        start_date: value,
      },
      () => {
        this.getList();
      }
    );
  };

  getEndDate = (value) => {
    this.setState(
      {
        end_date: value,
      },
      () => {
        this.getList();
      }
    );
  };

  showPatientList = () => {
    this.setState({
      isShowPatientList: true,
    });
  };

  showStaffList = () => {
    this.setState({
      isShowStaffList: true,
    });
  };

  selectPatients = (patients) => {
    this.setState(
      {
        // patient_name:patient.patient_name,
        selected_patients_list: patients,
        patient_ids: patients,
      },
      () => {
        this.getList();
      }
    );
    this.closeModal();
  };

  selectStaff = (staff) => {
    this.setState({
      staff_name: staff.name,
      staff_id: staff.number,
    });
    this.closeModal();
  };

  clearPatient = () => {
    this.setState({
      patient_name: "",
      patient_id: 0,
    });
    this.closeModal();
  };

  clearStaff = () => {
    this.setState({
      staff_name: "",
      staff_id: 0,
    });
    this.closeModal();
  };

  getShowDate = (item) => {
    if (item == undefined || item == null) return "";
    if (item.schedule_date != null) {
      return formatJapan(item.schedule_date);
    } else if (item.schedule_month != null) {
      var month;
      if (item.schedule_month < 10)
        month = "0" + item.schedule_month.toString();
      else month = item.schedule_month;
      return formatJapanYearMonth(item.schedule_year + "-" + month);
    } else {
      if (item.schedule_year != null) {
        return formatJapanYear(item.schedule_year.toString());
      }
      return "未定";
    }
  };

  checkAllPeriod = (name, value) => {
    if (name == "period_all") {
      this.setState({ all_period: value }, () => {
        this.getList();
      });
    }
  };

  finishdelete = (name, value) => {
    if (name == "finishdelete") {
      this.setState({ finishdelete: value }, () => {
        this.getList();
      });
    }
  };

  switchDisplay = (name, value) => {
    if (name === "switch_dispaly") {
      this.setState({ display_all: value });
    }
  };

  updateData = (index) => {
    let modal_data = this.state.table_data;
    this.setState({
      modal_data: modal_data[index],
      row_index: index,
      isOpenModal: true,
      patient_id: modal_data[index].system_patient_id,
      patient_number: modal_data[index].patient_number,
      patient_name: modal_data[index].patient_name
    });
  };

  // データ
  deleteData = async (index) => {
    let path = "/app/api/v2/dial/schedule/patient_schedule/delete";
    let post_data = {
      params: {
        number: index,
        system_patient_id: this.state.patient_id,
      },
    };
    await apiClient
      .post(path, post_data)
      .then((res) => {
        if (res) {
          window.sessionStorage.setItem("alert_messages", "削除完了##" + res.alert_message);
          this.getList();
        }
      })
      .catch(() => {
        return false;
      });
  };

  recoverData = async (index) => {
    let path = "/app/api/v2/dial/schedule/patient_schedule/recover";
    let post_data = {
      params: {
        number: index,
        system_patient_id: this.state.patient_id,
      },
    };
    await apiClient
      .post(path, post_data)
      .then((res) => {
        if (res) {
          window.sessionStorage.setItem("alert_messages", res.alert_message);
          this.getList();
        }
      })
      .catch(() => {
        return false;
      });
  };

  confirm = async (object) => {
    //これはリムシコードです。DB起動後は必要ありません。
    object.patient_number = this.state.patient_id;
    let path = "/app/api/v2/dial/schedule/patient_schedule/register";
    await apiClient
      .post(path, { params: object })
      .then((res) => {
        this.setState({
          isOpenModal: false,
          patient_id: 0,
        });
        if (res) {
          var title = '';
          var message = res.alert_message;
          if (message.indexOf('変更') > -1) title = "変更完了##";
          if (message.indexOf('登録') > -1) title = "登録完了##";
          window.sessionStorage.setItem("alert_messages", title + res.alert_message);
          this.getList();
        }
      })
      .catch(() => {
        return false;
      });
    this.closeeditModal();
  };

  contextMenuAction = (index, type) => {
    if (type === "edit") {
      this.updateData(index);
      this.setState({
        isopenpreviewModal: false,
      });
    }
    if (type === "delete") {
      this.deleteconfirmModal(index);
      this.setState({
        isopenpreviewModal: false,
      });
    }
    if (type === "preview") {
      this.setState({
        isopenpreviewModal: true,
        preview_index: index,
        selectedScheduledata: this.state.table_data[index],
      });
    }
    if (type === "recover") {
      this.recoverModal(index);
      this.setState({
        isopenpreviewModal: false,
      });
    }
  };

  recoverModal = (index) => {
    this.setState({
      recoverconfirm: true,
      confirm_message: "予定の削除を取りやめますか？",
      recoverindex: index,
    });
    return;
  };
  closePreviewModal = () => {
    this.setState({
      isopenpreviewModal: false,
      selectedScheduledata: {},
    });
    return;
  };

  confirmOk() {
    this.deleteData(
      this.state.table_data[this.state.deleteindex].schedule_number
    );
    this.deleteconfirmCancel();
  }
  recoverconfirmOk() {
    this.recoverData(
      this.state.table_data[this.state.recoverindex].schedule_number
    );
    this.recoverconfirmCancel();
  }

  deleteconfirmCancel() {
    this.setState({
      deleteconfirm: false,
      confirm_message: "",
      deleteindex: 0,
    });
  }
  recoverconfirmCancel() {
    this.setState({
      recoverconfirm: false,
      confirm_message: "",
      recoverindex: 0,
    });
  }
  goOtherPage(go_url) {
    this.props.history.replace(go_url);
  }

  render() {
    let table_data = this.state.table_data;
    let reserved_patient_codes = this.state.reserved_patient_codes;
    const ExampleCustomInput = ({ value, onClick }) => (
      <div
        className={
          this.state.all_period
            ? "example-custom-input disabled"
            : "example-custom-input"
        }
        onClick={onClick}
      >
        {formatJapanDate(value)}
      </div>
    );
    return (
      <Card>
        <div className="d-flex">
          <div className="title">患者予定一覧</div>
          <div className={"other-pattern"}>
            <Button
              onClick={this.goOtherPage.bind(this, "/dial/schedule/Schedule")}
            >
              スケジュール
            </Button>
            <Button className="disable-button">患者予定</Button>
            <Button onClick={this.goOtherPage.bind(this, "/dial/others/my_calendar")}>カレンダー</Button>
          </div>
        </div>
        <SearchPart>
          <div className="select_date_range">
            <div className="radio-label">期間</div>
            <DatePicker
              locale="ja"
              selected={this.state.start_date}
              onChange={this.getStartDate.bind(this)}
              dateFormat="yyyy/MM/dd"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              dayClassName = {date => setDateColorClassName(date)}
              customInput={<ExampleCustomInput />}
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
              dayClassName = {date => setDateColorClassName(date)}
              customInput={<ExampleCustomInput />}
            />
          </div>
          <div className="checkboxpart">
            <Checkbox
              label="全期間を表示"
              getRadio={this.checkAllPeriod.bind(this)}
              value={this.state.all_period}
              checked={this.state.all_period === 1}
              name="period_all"
            />
            <Checkbox
              label="削除済み"
              getRadio={this.finishdelete.bind(this)}
              value={this.state.finishdelete}
              checked={this.state.finishdelete === 1}
              name="finishdelete"
            />
            <Checkbox
              label="未定を表示"
              getRadio={this.switchDisplay.bind(this)}
              value={this.state.display_all}
              checked={this.state.display_all === 1}
              name="switch_dispaly"
            />
          </div>
          <div className="select_patient">
            <Button onClick={this.showPatientList.bind(this)}>患者選択</Button>
          </div>
        </SearchPart>
        <Wrapper>
          <table className="table-scroll table table-bordered table-hover">
            <thead>
              <th className="table-check">完了</th>
              <th className="table-check">添書</th>
              <th className="table-check">受診</th>
              <th className="patient-id">患者番号</th>
              <th className="patient-name">患者氏名</th>
              <th className="date-area">日付</th>
              <th className="timezone">時間帯</th>
              <th style={{ width: "13rem" }}>施設名・診療科・担当医師</th>
              <th className="patient_type">種類</th>
              <th>内容</th>
              <th className="manager_name">担当者</th>
              <th className="attach_doc last-th">添書</th>
            </thead>
            <tbody id={"code-table"}>
              {table_data !== undefined &&
                table_data !== null &&
                table_data.length > 0 &&
                table_data.map((item, index) => {
                  if (
                    this.getShowDate(item) != "未定" ||
                    this.state.display_all == 1
                  ) {
                    return (
                      <>
                        <tr
                          onContextMenu={(e) =>
                            item.is_enabled == 1
                              ? this.handleClick(e, index)
                              : this.handleClickDeletedRow(e, index)
                          }
                          style={{
                            backgroundColor: item.is_enabled == 1 ? "" : "grey",
                          }}
                        >
                          <td className="text-center table-check">
                            <Checkbox
                              value={item.checked_by_complete}
                              checked={item.checked_by_complete === 1}
                              name="check"
                              isDisabled={true}
                            />
                          </td>
                          <td className="text-center table-check">
                            <Checkbox
                              value={item.checked_by_accompanying}
                              checked={item.checked_by_accompanying === 1}
                              name="check"
                              isDisabled={true}
                            />
                          </td>
                          <td className="text-center table-check">
                            <Checkbox
                              value={item.checked_by_medical_examination}
                              checked={
                                item.checked_by_medical_examination === 1
                              }
                              name="check"
                              isDisabled={true}
                            />
                          </td>
                          <td style={{ textAlign: "right"}} className="a-tag patient-id">{item.patient_number}</td>
                          <td
                            style={{ textAlign: "left" }}
                            className="a-tag patient-name"
                          >
                            {item.patient_name}
                          </td>
                          <td className="text-left date-area">
                            {this.getShowDate(item)}
                          </td>
                          <td className="text-left timezone">
                            {item.time_zone != null
                              ? this.state.time_zone_list[item.time_zone].value
                              : "未定"}
                          </td>
                          <td className="text-left" style={{ width: "13rem" }}>
                            {item.facility}
                          </td>
                          <td className="text-left patient_type">
                            {reserved_patient_codes[item.schedule_type_code]}
                          </td>
                          <td className="text-left">
                            {displayLineBreak(item.content)}
                          </td>
                          <td className="text-left manager_name">
                            {item.doctor_name}
                          </td>
                          <td className="text-left attach_doc">{attach_doc_check[item.require_accompanying_document]}</td>
                        </tr>
                      </>
                    );
                  }
                })}
            </tbody>
          </table>
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
            favouriteMenuType={this.state.favouriteMenuType}
          />
          <ContextMenu_d
            {...this.state.contextMenu_d}
            parent={this}
            favouriteMenuType={this.state.favouriteMenuType}
          />
        </Wrapper>
        <div className="footer-buttons">
          <Button onClick={this.openPrintPreview.bind(this)} className={this.state.curFocus === 1 ? "focus red-btn" : "red-btn"}
          >
            帳票プレビュー
          </Button>
        </div>
        {this.state.deleteconfirm && (
          <SystemConfirmJapanModal
            confirmCancel={() => {
              this.setState({
                deleteconfirm: false,
              });
            }}
            confirmOk={() => {
              this.confirmOk();
            }}
            confirmTitle={this.state.confirm_message}
          />
        )}
        {this.state.recoverconfirm && (
          <SystemConfirmJapanModal
            confirmCancel={() => {
              this.setState({
                recoverconfirm: false,
              });
            }}
            confirmOk={() => {
              this.recoverconfirmOk();
            }}
            confirmTitle={this.state.confirm_message}
          />
        )}
        {this.state.isShowStaffList !== false && (
          <DialSelectMasterModal
            selectMaster={this.selectStaff}
            closeModal={this.closeModal}
            MasterCodeData={this.state.staffs}
            MasterName="スタッフ"
            clearItem={this.clearStaff}
          />
        )}
        {this.state.isShowPatientList !== false && (
          <DialMultiSelectPatientModal
            selectMasters={this.selectPatients}
            closeModal={this.closeModal}
            selected_masters_list={this.state.selected_patients_list}
            clearItem={this.clearPatient}
          />
        )}
        {this.state.isopenpreviewModal && (
          <SchedulePreviewModal
            checked_by_complete={
              this.state.selectedScheduledata.checked_by_complete
            }
            checked_by_accompanying={
              this.state.selectedScheduledata.checked_by_accompanying
            }
            checked_by_medical_examination={
              this.state.selectedScheduledata.checked_by_medical_examination
            }
            schedulenum={this.state.selectedScheduledata.schedule_number}
            scheduledate={this.getShowDate(this.state.selectedScheduledata)}
            scheduletimezone={
              this.state.selectedScheduledata.time_zone != null
                ? this.state.time_zone_list[
                    this.state.selectedScheduledata.time_zone
                  ].value
                : "未定"
            }
            schedulefacility={this.state.selectedScheduledata.facility}
            patientcode={
              reserved_patient_codes[
                this.state.selectedScheduledata.schedule_type_code
              ]
            }
            content={this.state.selectedScheduledata.content}
            note={this.state.selectedScheduledata.note}
            attachdoccheck={
              attach_doc_check[
                this.state.selectedScheduledata.require_accompanying_document
              ]
            }
            closeModal={this.closePreviewModal}
            // delete={this.contextMenuAction(this.state.selectedScheduledata.schedule_number,"delete")}
            delete={() => {
              this.contextMenuAction(this.state.preview_index, "delete");
            }}
            editModal={() => {
              this.contextMenuAction(this.state.preview_index, "edit");
            }}
            // editModal={this.contextMenuAction(this.state.selectedScheduledata.schedule_number,"edit")}
          />
        )}
        {((this.state.isOpenModal && this.state.patient_id) ||
          (this.state.isOpenModal && this.state.modal_data != null)) && (
          <PatientScheduleModal
            patient_id={this.state.patient_id}
            patient_number={this.state.patient_number}
            patient_name={this.state.patient_name}
            row_index={this.state.row_index}
            modal_data={this.state.modal_data}
            handleOk={this.handleOk}
            closeModal={this.closeeditModal}
            saveData={this.confirm}
          />
        )}
        {this.state.isOpenPrintPreviewModal && (
          <PlanPrintPrewModal
            closeModal={this.closeeditModal}
            patient_id={this.state.patient_ids}
            start_date={
              this.state.all_period != 1
                ? formatDateLine(this.state.start_date)
                : undefined
            }
            end_date={
              this.state.all_period != 1
                ? formatDateLine(this.state.end_date)
                : undefined
            }
            reserved_patient_codes={this.state.reserved_patient_codes}
            finishdelete={this.state.finishdelete}
            table_data={this.state.table_data}
            print_data={this.state}
            staff_list_by_number = {this.state.staff_list_by_number}
            from_mode={'patient_plan_list'}
          />
        )}
      </Card>
    );
  }
}

patientPlanList.contextType = Context;
patientPlanList.propTypes = {
  history: PropTypes.object,
};
export default patientPlanList;
