import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import Button from "~/components/atoms/Button";
import DialSideBar from "../DialSideBar";
import Spinner from "react-bootstrap/Spinner";
import DatePicker, { registerLocale } from "react-datepicker";
import {
  formatJapanDate,
  getPrevDayByJapanFormat,
  getNextDayByJapanFormat,
  formatDateLine,
} from "~/helpers/date";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import RadioButton from "~/components/molecules/RadioInlineButton";
import DialPatientNav from "../DialPatientNav";
import * as apiClient from "~/api/apiClient";
import HeartInputModal from "../modals/HeartInputModal";
import { getTimeZoneList } from "~/components/templates/Dial/DialMethods/getSystemTimeZone";
import SearchBar from "~/components/molecules/SearchBar";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import DialHeartBatchPreview from "~/components/templates/Dial/Master/DialHeartBatchPreview";
import * as sessApi from "~/helpers/cacheSession-utils";
import PropTypes from "prop-types";
import {getServerTime} from "~/helpers/constants";
import {setDateColorClassName} from "~/helpers/dialConstants";

const Card = styled.div`
  padding: 1.25rem;
  position: fixed;
  top: 70px;
  left: 200px;
  width: calc(100% - 390px);
  margin: 0px;
  height: 100vh;
  float: left;
  .title {
    font-size: 2rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;
  }
  .bodywrap {
    display: flex;
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
    }

    span {
      color: white;
      font-size: 1.25rem;
      font-weight: 100;
    }
  }
  background-color: ${surface};
  button {
    margin-bottom: 0.625rem;
    margin-left: 0.625rem;
  }
`;

const Wrapper = styled.div`
  padding: 1.25rem 0.625rem;

  .title {
    font-size: 2rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;
  }
  height: calc(100vh -5.625rem);
  .text-left {
    text-align: left;
  }
  .text-right {
    text-align: right;
  }
  .text-center {
    text-align: center;
  }
  .label-title {
    width: 6.25rem;
    font-size: 1.25rem;
    text-align: right;
    margin-right: 0.625rem;
  }
  .pullbox-select {
    width: 12.5rem;
    font-size: 1rem;
  }
  table {
    thead {
      display: table;
      width: 100%;
    }
    tbody {
      display: block;
      overflow-y: scroll;
      height: calc(100vh - 24.3rem);
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
      word-break: break-all;
      padding: 0.25rem;
    }
    th {
      position: sticky;
      text-align: center;
      padding: 0.3rem;
    }
    .patient-number{
      width: 9rem;
    }
    .table-check {
      width: 5rem;
    }
    .item-no {
      width: 3.125rem;
    }
    .code-number {
      width: 7.5rem;
    }
    .name {
      width: 11rem;
    }
  }
  .footer {
    button {
      padding-left: 2.5rem;
      padding-right: 2.5rem;
    }
    button span {
      font-size: 1.25rem;
    }
  }
  .selected {
    color: blue;
  }
  .flex {
    display: flex;
  }
`;

const SearchPart = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1.25rem;
  width: 100%;
  padding: 1rem;
  .flex {
    display: flex;
    flex-wrap: wrap;
    font-size: 1.5rem;
    .cur-date {
      text-align: center;
      cursor: pointer;
    }
  }
  .search-box {
    width: 100%;
    display: flex;
    input {
      width: 13rem;
    }
  }
  .search-btn {
    margin-bottom: 0;
    padding: 0 16px;
    span {
      font-size: 1rem;
    }
  }
  .label-title {
    width: 6rem;
    text-align: right;
    margin-right: 0.625rem;
  }
  .pullbox-label {
    margin-bottom: 0;
  }
  .pullbox-select {
    width: 9.375rem;
    font-size: 1rem;
  }
  .pullbox-title {
    font-size: 1rem;
  }
  .gender {
    margin-left: 0.5rem;
    .radio-btn label {
      width: 3rem;
      font-size: 1rem;
      border: solid 1px rgb(206, 212, 218);
      border-radius: 0.25rem;
      margin: 0 0.3rem;
      padding: 0.25rem 0.3rem;
    }
  }
  .prev-day {
    cursor: pointer;
    padding-right: 0.625rem;
  }
  .next-day {
    cursor: pointer;
    padding-left: 0.625rem;
  }
  .day-area {
    width: 17rem;
    align-items: flex-start;
    justify-content: space-between;
    line-height: 38px;
  }
`;

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 6.25rem;
  margin-left: 43%;
  display: table-caption;
  position: absolute;
  top: 15rem;
`;

const ContextMenuUl = styled.ul`
  margin-bottom:0;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.5rem;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 84px;
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
  .blue-text {
    color: blue;
  }
`;

const display_order = [
  { id: 0, value: "ベッド番号", field_name: "bed_no" },
  { id: 1, value: "患者 ID", field_name: "patient_number" },
];

const ContextMenu = ({ visible, x,  y,  parent,  row_index}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.inputValue(row_index)}>編集</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class HeartBatch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      table_data: [],
      isOpenModal: false,
      schedule_date: '',
      modal_data: null,
      system_patient_id: null,
      isUpdateConfirmModal: false,
      isOpenPreviewModal: false,
      isOpenMoveOtherPageConfirm: false,
      isBackConfirmModal: false,
      search_order: 0,
      timezone: 1,
      confirm_alert_title:'',
    };
    this.double_click = false;
    this.table_head = {};
    this.table_head["patient_number"] = "患者番号";
    this.table_head["patient_name"] = "姓名";
    this.table_head["heart"] = "心臓";
    this.table_head["thorax"] = "胸郭";
    this.table_head["chest_ratio"] = "心胸比";
    this.table_head["dial_status"] = "透析前後";
    this.table_head["weight"] = "体重";
    this.table_head["comment"] = "コメント";
    this.table_head_style = {};
    this.table_head_style["patient_number"] = "right";
    this.table_head_style["patient_name"] = "left";
    this.table_head_style["heart"] = "right";
    this.table_head_style["thorax"] = "right";
    this.table_head_style["chest_ratio"] = "right";
    this.table_head_style["dial_status"] = "left";
    this.table_head_style["weight"] = "right";
    this.table_head_style["comment"] = "left";
    this.change_flag = 0;
  }
  
  async componentDidMount() {
    let server_time = await getServerTime();
    this.setState({schedule_date:new Date(server_time)});
    this.setChangeFlag(0);
    this.getList().then(() => {
      this.setState({
        isLoaded: true,
        time_zone_list: getTimeZoneList(),
      });
    });
    sessApi.setObjectValue('for_left_sidebar', 'date', formatDateLine(new Date(server_time)));
  }
  
  componentWillUnmount (){
    sessApi.remove('for_left_sidebar')
  }
  
  async getList() {
    if (this.change_flag == 1) {
      this.setState({
        isBackConfirmModal: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_action: "patient",
        confirm_alert_title:'入力中',
      });
      return;
    }
    let path = "/app/api/v2/dial/medicine_information/heart/list";
    let post_data = {
      schedule_date: formatDateLine(this.state.schedule_date),
      timezone: this.state.timezone,
      patient_id: this.state.schVal,
      order: display_order[this.state.search_order].field_name,
    };
    await apiClient.post(path, { params: post_data }).then((data) => {
      this.setState({
        table_data: data,
      });
    });
    this.setChangeFlag(0);
  }
  enterPressed = (e) => {
    var code = e.keyCode || e.which;
    if (code === 13) {
      if (this.change_flag == 1) {
        this.setState({
          isBackConfirmModal: true,
          confirm_message:
            "登録していない内容があります。\n変更内容を破棄して移動しますか？",
          confirm_action: "patient",
        });
        return;
      }
      this.getList();
    }
  };
  search = (word) => {
    word = word.toString().trim();
    this.setState({ schVal: word });
  };
  getDate = (value) => {
    if (this.change_flag == 1) {
      this.setState({
        isBackConfirmModal: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        select_sch_date: value,
        confirm_action: "date",
        confirm_alert_title:'入力中',
      });
      return;
    }
    this.setState({schedule_date: value},() => {
      this.getList();
      sessApi.setObjectValue('for_left_sidebar', 'date', formatDateLine(this.state.schedule_date));
    });
  };
  selectTimezone = (e) => {
    if (this.change_flag == 1) {
      this.setState({
        isBackConfirmModal: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        select_timezone: parseInt(e.target.value),
        confirm_action: "timezone",
        confirm_alert_title:'入力中',
      });
      return;
    }
    this.setState({ timezone: parseInt(e.target.value) }, () => this.getList());
  };
  
  PrevDay = () => {
    let now_day = this.state.schedule_date;
    let cur_day = getPrevDayByJapanFormat(now_day);
    if (this.change_flag == 1) {
      this.setState({
        isBackConfirmModal: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        select_sch_date: cur_day,
        confirm_action: "date",
        confirm_alert_title:'入力中',
      });
      return;
    }
    this.setState({ schedule_date: cur_day }, () => {
      this.getList();
      sessApi.setObjectValue('for_left_sidebar', 'date', formatDateLine(this.state.schedule_date));
    });
  };
  
  NextDay = () => {
    let now_day = this.state.schedule_date;
    let cur_day = getNextDayByJapanFormat(now_day);
    if (this.change_flag == 1) {
      this.setState({
        isBackConfirmModal: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        select_sch_date: cur_day,
        confirm_action: "date",
        confirm_alert_title:'入力中',
      });
      return;
    }
    this.setState({ schedule_date: cur_day }, () => {
      this.getList();
      sessApi.setObjectValue('for_left_sidebar', 'date', formatDateLine(this.state.schedule_date));
    });
  };
  
  handleInsert = () => {
    if (this.state.system_patient_id == null) {
      window.sessionStorage.setItem(
        "alert_messages",
        "左側のメニューから患者様を選択してください。"
      );
      return;
    }
    this.setState({
      isOpenModal: true,
    });
  };
  
  openPreviewModal = () => {
    if (
      this.state.table_data !== undefined &&
      this.state.table_data !== null &&
      this.state.table_data.length > 0
    ) {
      this.setState({ isOpenPreviewModal: true });
    }
  };
  
  selectPatient = (patientInfo) => {
    this.setState(
      {
        patientInfo: patientInfo,
        system_patient_id: patientInfo.system_patient_id,
      },
      () => {
        this.getList();
      }
    );
  };
  
  inputValue = (index) => {
    this.setState({
      isOpenModal: true,
      modal_data: this.state.table_data[index],
      selected_index: index,
    });
  };
  closeModal = () => {
    this.setState({ isOpenModal: false });
  };
  
  handleOk = (input_val) => {
    let table_data = this.state.table_data;
    let selected_index = this.state.selected_index;
    table_data[selected_index]["heart"] = input_val.heart;
    table_data[selected_index]["thorax"] = input_val.thorax;
    table_data[selected_index]["chest_ratio"] = input_val.chest_ratio;
    table_data[selected_index]["comment"] = input_val.comment;
    table_data[selected_index]["dial_status"] = input_val.dial_status;
    table_data[selected_index]["update_flag"] = 1;
    this.setChangeFlag(1);
    this.setState({
      changed: 1,
      table_data,
      isOpenModal: false,
    });
  };
  
  register = () => {
    if (this.state.changed !== undefined && this.state.changed == 1) {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "変更内容を保存しますか？",
      });
    } else {
      window.sessionStorage.setItem("alert_messages", "変更内容がありません。");
    }
  };
  
  async registerData() {
    this.confirmCancel();
    let path = "/app/api/v2/dial/medicine_information/heart/register";
    if (this.double_click == true) return;
    this.double_click = true;
    await apiClient
      .post(path, {
        params: this.state.table_data,
      })
      .then((res) => {
        if (res) {
          var title = '';
          var message = res.alert_message;
          if (message.indexOf('変更') > -1) title = "変更完了##";
          if (message.indexOf('登録') > -1) title = "登録完了##";
          window.sessionStorage.setItem("alert_messages", title + res.alert_message);
        }
      })
      .finally(() => {
        this.double_click = false;
        this.setChangeFlag(0);
      });
  }
  
  getOrderSelect = (e) => {
    //表示順
    if (this.change_flag == 1) {
      this.setState({
        isBackConfirmModal: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        select_order: parseInt(e.target.id),
        confirm_action: "order",
        confirm_alert_title:'入力中',
      });
      return;
    }
    this.setState({ search_order: parseInt(e.target.id) }, () => {
      this.getList();
    });
  };
  confirmCancel() {
    this.setState({
      isBackConfirmModal: false,
      isUpdateConfirmModal: false,
      isOpenPreviewModal: false,
      confirm_message: "",
      confirm_alert_title:'',
    });
  }
  
  setChangeFlag = (change_flag) => {
    this.change_flag = change_flag;
    this.setState({ change_flag });
    if (change_flag) {
      sessApi.setObjectValue("dial_change_flag", "injection", 1);
    } else {
      sessApi.remove("dial_change_flag");
    }
  };
  
  selcetDateConfirmModal = () => {
    this.confirmCancel();
    this.setChangeFlag(0);
    if (this.state.confirm_action == "date")
      this.getDate(this.state.select_sch_date);
    else if (this.state.confirm_action == "timezone")
      this.setState({ timezone: parseInt(this.state.select_timezone) }, () =>
        this.getList()
      );
    else if (this.state.confirm_action == "patient") this.getList();
    else if (this.state.confirm_action == "order")
      this.setState({ search_order: parseInt(this.state.select_order) }, () => {
        this.getList();
      });
  };
  
  convertDecimal = (_val, _digits) => {
    if (isNaN(parseFloat(_val))) return "";
    return parseFloat(_val).toFixed(_digits);
  }
  
  handleClick = (e, index) => {
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
        .getElementById("code-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById("code-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - 200,
          y: e.clientY + window.pageYOffset - 70
        },
        row_index: index
      });
    }
  }
  
  render() {
    const { table_data } = this.state;
    const isLoaded = this.state.isLoaded;
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className="cur-date morning example-custom-input" onClick={onClick}>
        {formatJapanDate(value)}
      </div>
    );
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
          <Wrapper>
            <div className="title">心胸比（一括）</div>
            <SearchPart>
              <div className="search-box">
                <SearchBar
                  placeholder="患者番号入力"
                  search={this.search}
                  enterPressed={this.enterPressed}
                />
                <Button type="mono" className="search-btn" onClick={this.getList.bind(this)}>患者検索</Button>
                <div className="day-area flex ml-2">
                  {this.state.schedule_date != "" && (
                    <>
                      <div className="prev-day" onClick={this.PrevDay}>{"< "}</div>
                      <DatePicker
                        locale="ja"
                        selected={this.state.schedule_date}
                        onChange={this.getDate.bind(this)}
                        dateFormat="yyyy/MM/dd"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dayClassName = {date => setDateColorClassName(date)}
                        customInput={<ExampleCustomInput />}
                      />
                      <div className="next-day" onClick={this.NextDay}>{" >"}</div>
                    </>
                  )}
                </div>
                <div className="gender">
                  {this.state.time_zone_list != undefined &&
                  this.state.time_zone_list.length > 0 &&
                  this.state.time_zone_list.map((item) => {
                    return (
                      <>
                        <RadioButton
                          id={`male_${item.id}`}
                          value={item.id}
                          label={item.value}
                          name="usage"
                          getUsage={this.selectTimezone}
                          checked={
                            this.state.timezone === item.id ? true : false
                          }
                        />
                      </>
                    );
                  })}
                </div>
                <SelectorWithLabel
                  options={display_order}
                  title="表示順"
                  getSelect={this.getOrderSelect}
                  departmentEditCode={display_order[this.state.search_order].id}
                />
              </div>
            </SearchPart>
            {isLoaded ? (
              <>
                <div className="content">
                  <table className="table-scroll table table-bordered table-hover">
                    <thead>
                    <tr>
                      <th className="patient-number">患者番号</th>
                      <th className="name">姓名</th>
                      <th className="table-check">心臓</th>
                      <th className="table-check">胸郭</th>
                      <th className="table-check">心胸比</th>
                      <th className="table-check">透析前後</th>
                      <th className="table-check">体重</th>
                      <th style={{ wordBreak: "break-woard" }}>コメント</th>
                    </tr>
                    </thead>
                    <tbody id="code-table">
                    {table_data !== undefined &&
                    table_data !== null &&
                    table_data.length > 0 &&
                    table_data.map((item, index) => {
                      return (
                        <>
                          <tr key={index} onContextMenu={e => this.handleClick(e, index)}>
                            <td className="patient-number text-right">
                              {item.patient_number}
                            </td>
                            <td className="name">{item.patient_name}</td>
                            <td className="table-check text-right">{item.heart}</td>
                            <td className="table-check text-right">{item.thorax}</td>
                            <td className="table-check text-right">
                              {item.chest_ratio}
                            </td>
                            <td className="table-check">
                              {item.dial_status !== undefined &&
                              item.dial_status === 1
                                ? "後"
                                : item.dial_status !== undefined &&
                                item.dial_status === 0
                                  ? "前"
                                  : ""}
                            </td>
                            <td className="table-check text-right">
                              {item.dial_status !== undefined &&
                              item.dial_status === 1
                                ? this.convertDecimal(item.weight_after, 1)
                                : this.convertDecimal(item.weight_before, 1)}
                            </td>
                            <td style={{ wordBreak: "break-all" }}>
                              {item.comment}
                            </td>
                          </tr>
                        </>
                      );
                    })}
                    </tbody>
                  </table>
                </div>
                <div className="footer-buttons">
                  <Button className="red-btn" onClick={this.openPreviewModal}>帳票プレビュー</Button>
                  <Button className="red-btn" onClick={this.register}>登録</Button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              </div>
            )}
          </Wrapper>
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
            row_index={this.state.row_index}
          />
          {this.state.isOpenModal && (
            <HeartInputModal
              handleOk={this.handleOk}
              closeModal={this.closeModal}
              modal_data={this.state.modal_data}
            />
          )}
          {this.state.isUpdateConfirmModal !== false && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.registerData.bind(this)}
              confirmTitle={this.state.confirm_message}
            />
          )}
          {this.state.isOpenPreviewModal && (
            <DialHeartBatchPreview
              closeModal={this.confirmCancel.bind(this)}
              modal_title={"心胸比（一括）"}
              modal_type={"heart_batch"}
              table_head={this.table_head}
              table_head_style={this.table_head_style}
              table_body={table_data}
              time_zone={this.state.timezone}
              schedule_date={this.state.schedule_date}
            />
          )}
          {this.state.isBackConfirmModal !== false && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.selcetDateConfirmModal}
              confirmTitle={this.state.confirm_message}
              title = {this.state.confirm_alert_title}
            />
          )}
        </Card>
      </>
    );
  }
}

HeartBatch.propTypes = {
  history: PropTypes.object
};
export default HeartBatch;
