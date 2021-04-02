import React, { Component } from "react";
import DialSideBar from "../DialSideBar";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import {
  formatDateLine,
  formatJapanDate,
  getNextDayByJapanFormat,
  getPrevDayByJapanFormat,
} from "~/helpers/date";
import Button from "~/components/atoms/Button";
import InspectionDataModal from "./InspectionDataModal";
import DialPatientNav from "../DialPatientNav";
import DatePicker, { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import ja from "date-fns/locale/ja";
import * as methods from "../DialMethods";
import axios from "axios/index";
import * as apiClient from "~/api/apiClient";
import Checkbox from "~/components/molecules/Checkbox";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import InspectionCalcModal from "../modals/InspectionCalcModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import PropTypes from "prop-types";
import {getServerTime} from "~/helpers/constants";
import {setDateColorClassName} from "~/helpers/dialConstants";

const Card = styled.div`
  position: relative;
  width: 100%;
  top: 70px;
  margin: 0px;
  float: left;
  width: calc(100% - 390px);
  left: 200px;
  height: 100vh;
  position: fixed;
  background-color: ${surface};
  padding: 1.25rem;
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

  .title {
    font-size: 2rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;
  }
`;
const ListTitle = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 2.5rem;
  float: left;
  span {
    color: blue;
  }
  .left-area {
    font-size: 1.5rem;
    width: 20%;
    display: -webkit-flex; /* Safari */
    -webkit-flex-wrap: wrap; /* Safari 6.1+ */
    display: flex;
    flex-wrap: wrap;
  }
  .right-area {
    width: 78%;
    display: -webkit-flex; /* Safari */
    -webkit-flex-wrap: wrap; /* Safari 6.1+ */
    display: flex;
    flex-wrap: wrap;
  }
  .cur_date {
    font-size: 1.5rem;
    display: flex;
    flex-wrap: wrap;
  }
  .prev-day {
    cursor: pointer;
    padding-right: 0.625rem;
  }
  .next-day {
    cursor: pointer;
    padding-left: 0.625rem;
  }
`;

const List = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 20%;
  margin-right: 2%;
  float: left;
  overflow-y: auto;
  border: solid 1px lightgrey;
  label {
    margin: 0;
  }
  table {
    margin-bottom:0;
    tbody{
      display:block;
      overflow-y: scroll;
      height: calc(100vh - 21rem);
      width:100%;
      tr:nth-child(even) {background-color: #f2f2f2;}
      tr:hover{background-color:#e2e2e2 !important;}
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
    td {
      padding: 0.3rem;
      word-break: break-all;
      font-size: 1rem;
      vertical-align: middle;
    }
    th {
      position: sticky;
      text-align: center;
      padding: 0.25rem;
      white-space:nowrap;
      border:1px solid #dee2e6;
      border-bottom:none;
      border-top:none;
      font-weight: normal;
      font-size: 1.25rem;
    }
    .tl {
      text-align: left;
    }
    .td-no {
      width: 3rem;
      label{
        margin:0px;
      }
    }
  }
  .selected {
    background: rgb(105, 200, 225) !important;
    color: white;
  }
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 78%;  
  overflow-y: auto;
  border: solid 1px lightgrey;
  table {
    font-size: 1rem;
    margin-bottom: 0;
  }
  thead{
    margin-bottom: 0;
    display:table;
    width:100%;
    tr{width: calc(100% - 17px);}
  }
  tbody{
    height: calc(100vh - 21rem);
    overflow-y: scroll;
    display:block;
    tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    tr:hover{background-color:#e2e2e2 !important;}
  }
  tr{
    display: table;
    width: 100%;
    box-sizing: border-box;
  }
  td {
    padding: 0.25rem;
    text-align: left;
    vertical-align: middle;
    border-bottom: 1px solid #dee2e6;
    word-break: break-all;
    font-size: 1rem;
  }
  th {
    text-align: center;
    padding: 0.3rem;
    border-bottom: 1px solid #dee2e6;
    font-size: 1.25rem;
  }
  .code {
    width: 6.25rem;
  }
  .reference {
    width: 6.25rem;
  }
  .unit {
    width: 4.375rem;
  }
  .value {
    width: 5.625rem;
  }
  .tl {
    text-align: left;
  }
  .td-no {
    width: 3rem;
    label{
      margin:0;
      input {margin:0;}
    }
  }
  .tr {
    text-align: right;
  }
  margin-bottom: 0.625rem;
`;

const ContextMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
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

const ContextMenu = ({ visible, x, y, parent, index }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div onClick={() => parent.contextMenuAction(index, "edit")}>
              編集
            </div>
          </li>
          {/*<li><div onClick={() => parent.contextMenuAction(item, "delete")}>削除</div></li>*/}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class InspectionData extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    this.state = {
      patientInfo: null,
      examinationPatternList: [],
      table_data: {},
      isOpenModal: false,
      curPatternCode: 0,
      schedule_date: '',
      index: "",
      update_flag: 0,
      delete_number_list: [],
      isUpdateConfirmModal: false,
      isOpenConfirmModal: false,
      isConfirmMove: false,
      confirm_message: "",
      confirm_type: "",
      confirm_action: "",
      change_flag: 0,
      tmpPatternCode: 0,
      tmpDate: null,
    };
    this.double_click = false;
    this.openModalTime = null;
    this.ex_patient_id = null;
  }

  async componentDidMount() {
    let server_time = await getServerTime();
    sessApi.setObjectValue('for_left_sidebar', 'date', formatDateLine(new Date(server_time)));
    await this.setState({schedule_date:new Date(server_time)});
    await this.getExamPattern();
    await this.setChangeFlag(0);
  }
  
  componentWillUnmount() {
    sessApi.remove('dial_change_flag');
    sessApi.remove('for_left_sidebar');
  }

  getSearchResult = async () => {
    if (this.state.patientInfo != null && this.state.curPatternCode !== 0) {
      let path = "/app/api/v2/dial/medicine_information/examination_data/get";
      let post_data = {
        system_patient_id: this.state.patientInfo.system_patient_id,
        examination_date: formatDateLine(this.state.schedule_date),
        pattern_code: this.state.curPatternCode,
        order:'name_kana'
      };
      const { data } = await axios.post(path, { params: post_data });
      this.setState({
        table_data: data,
        update_flag: 0,
      });
    }
  };

  handleGetDate = (value) => {
    this.setState({ 
      schedule_date: value,
      confirm_type: "",
      tmpDate: null,
      isOpenConfirmModal: false,
    }, () => {
      this.getSearchResult();
      this.setChangeFlag(0);
    });
  }

  getDate = (value) => {
    if (formatDateLine(this.state.schedule_date) == formatDateLine(value)) return;
    if (this.state.change_flag == 1) {
      this.setState({
        isOpenConfirmModal: true,
        tmpDate: value,
        confirm_type: "date",
        confirm_message: "登録していない内容があります。変更内容を破棄して閉じますか？"
      });
      return;
    }    
    sessApi.setObjectValue('for_left_sidebar', 'date', formatDateLine(value));
    this.handleGetDate(value);

  };

  PrevDay = () => {
    let now_day = this.state.schedule_date;
    let cur_day = getPrevDayByJapanFormat(now_day);
    if (this.state.change_flag == 1) {
      this.setState({
        isOpenConfirmModal: true,
        tmpDate: cur_day,
        confirm_type: "prevDay",
        confirm_message: "登録していない内容があります。変更内容を破棄して閉じますか？"
      });
      return;
    }
    this.handlePrevDay(cur_day);
  }

  handlePrevDay = (value) => {        
    this.setState({ schedule_date: value }, () => {
      this.getSearchResult();
      this.setChangeFlag(0);      
    });
    sessApi.setObjectValue('for_left_sidebar', 'date', formatDateLine(value));
  };

  NextDay = () => {
    let now_day = this.state.schedule_date;
    let cur_day = getNextDayByJapanFormat(now_day);
    if (this.state.change_flag == 1) {
      this.setState({
        isOpenConfirmModal: true,
        tmpDate: cur_day,
        confirm_type: "nextDay",
        confirm_message: "登録していない内容があります。変更内容を破棄して閉じますか？"
      });
      return;
    }    
    this.handleNextDay(cur_day);
  }


  handleNextDay = (value) => {    
    this.setState({ schedule_date: value }, () => {
      this.getSearchResult();
      this.setChangeFlag(0);
    });
    sessApi.setObjectValue('for_left_sidebar', 'date', formatDateLine(value));
  };

  handlePattern = (pattern_code) => {
    if (pattern_code == this.state.curPatternCode) return;    
    if (this.state.change_flag == 1) {
      this.setState({
        isOpenConfirmModal: true,
        tmpPatternCode: pattern_code,
        confirm_type: "history",
        confirm_message: "登録していない内容があります。変更内容を破棄して閉じますか？"
      });
      return;
    }
    this.handlePatternAct(pattern_code);    
  };

  handlePatternAct = (pattern_code) => {
    this.setState(
      {
        curPatternCode: pattern_code,
        isOpenConfirmModal: false,
        tmpPatternCode: 0,
        confirm_message: "",
        confirm_type: "",
      },
      () => {
        this.setChangeFlag(0);
        this.getSearchResult();
      }
    );
  }

  createData = () => {
    if (this.state.update_flag === 0) {
      return;
    }
    this.setState({
      isUpdateConfirmModal: true,
      confirm_action: "register",
      confirm_message: "登録しますか？",
    });
  };

  closeModal = () => {
    this.setState({
      isOpenModal: false,
      index: "",
    });
  };

  selectPatient =async(patientInfo) => {
    if (this.ex_patient_id == patientInfo.system_patient_id) return;
    await this.moveOtherPatient(patientInfo);
  };

  moveOtherPatient =async(patientInfo) => {
    let server_time = await getServerTime();
    this.setState({
      patientInfo: patientInfo,
      table_data: {},
      isConfirmMove: false,
      isOpenModal: false,
      curPatternCode: 0,
      schedule_date: new Date(server_time),
      update_flag: 0,
      delete_number_list: [],
    },() => {
      this.ex_patient_id = patientInfo.system_patient_id;
      this.confirmCancel();
      this.getSearchResult();
    });
  };

  handleOk = (value, value2) => {
    if (this.state.index !== "") {
      let table_data = this.state.table_data;
      table_data[this.state.index]["update_flag"] = 1;
      table_data[this.state.index]["value"] = value;
      if (table_data[this.state.index]["before_or_after_enabled"] !== 0) {
        table_data[this.state.index]["value2"] = value2;
      }
      this.setState({
        table_data,
        update_flag: 1,
      });
    }
    this.openModalTime = new Date().getTime();
    this.setChangeFlag(1);
    this.setState({
      isOpenModal: false,
      index: "",
    });
  };

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
          contextMenu: { visible: false },
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("wordList-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false },
          });
          document
            .getElementById("wordList-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - 200,
          y: e.clientY + window.pageYOffset - 70,
          index: index,
        },
        index,
      });
    }
  };

  contextMenuAction = (index, act) => {
    if (act === "edit") {
      this.setState({
        isOpenModal: true,
        modal_data: this.state.table_data[index],
      });
    } else if (act === "delete") {
      // this.deleteData(index);
    }
  };

  inputValue = (index) => {
    if (this.openModalTime != null && new Date().getTime() - this.openModalTime < 1000){
      return;
    }
    this.setState({
      index,
      isOpenModal: true,
      modal_data: this.state.table_data[index],
    });
  };

  delete = async () => {
    this.confirmCancel();
    let path = "/app/api/v2/dial/medicine_information/examination_data/delete";
    await apiClient
      .post(path, {
        params: this.state.delete_number_list,
        system_patient_id: this.state.patientInfo.system_patient_id,
      })
      .then(() => {
        this.setState({ delete_number_list: [] });
        this.getSearchResult();
      });
  };

  getRadio = (number, name, value) => {
    if (name === "check") {
      let { delete_number_list } = this.state;
      const index = delete_number_list.indexOf(number);
      if (value == 1 && index == -1) {
        delete_number_list.push(number);
      } else {
        if (index > -1) {
          delete_number_list.splice(index, 1);
        }
      }
      this.setState({ delete_number_list });
    }
  };

  deleteData = () => {
    if (!(this.state.delete_number_list !== undefined &&
        this.state.delete_number_list.length > 0
      )) {
        return;
    }
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "一括削除しますか？",
      });
  };
  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isOpenConfirmModal: false,
      isConfirmMove: false,
      confirm_action: "",
      tmpPatternCode: 0,
      tmpDate: null,
      confirm_message: "",
      confirm_type: "",
    });    
  }

  inspectionCalc = () => {
    if (this.state.patientInfo == undefined || this.state.patientInfo == null) {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    this.setState({ openInspectionCalcModal: true });
  };
  closeInspectionCalc = () => {
    this.setState({ openInspectionCalcModal: false });
  };

  confirmOk = () => {
    if (this.state.confirm_action == "register") {
      this.registerConfirm();
    } else {
      this.delete();
    }
  };

  registerConfirm = () => {
    this.confirmCancel();
    let path =
      "/app/api/v2/dial/medicine_information/examination_data/register";
    let post_data = {
      system_patient_id: this.state.patientInfo.system_patient_id,
      examination_date: formatDateLine(this.state.schedule_date),
      exam_data: this.state.table_data,
    };
    if (this.double_click == true) return;
    this.double_click = true;

    apiClient
      .post(path, post_data)
      .then((res) => {
        var title = '';
        var message = res.alert_message;
        if (message.indexOf('変更') > -1) title = "変更完了##";
        if (message.indexOf('登録') > -1) title = "登録完了##";
        window.sessionStorage.setItem("alert_messages", title + res.alert_message);
        this.getSearchResult();
        this.setChangeFlag(0);
      })
      .catch(() => {})
      .finally(() => {
        this.double_click = false;
      });
  };

  setChangeFlag=(change_flag)=>{      
      this.setState({change_flag});
      if (change_flag){
          sessApi.setObjectValue('dial_change_flag', 'inspection_data', 1)
      } else {
          sessApi.remove('dial_change_flag');
      }
  };

  confirmCloseOk = () => {
    this.setState({
      isOpenConfirmModal: false,
      confirm_message: ""
    },()=>{
      if (this.state.confirm_type == "history") {
        this.handlePatternAct(this.state.tmpPatternCode);
      } else if(this.state.confirm_type == "date") {
        this.handleGetDate(this.state.tmpDate);
      } else if(this.state.confirm_type == "prevDay") {
        this.handlePrevDay(this.state.tmpDate);
      } else if(this.state.confirm_type == "nextDay") {
        this.handleNextDay(this.state.tmpDate);
      }
    });
  }

  render() {
    let del_tooltip = "";
    if (this.state.delete_number_list === undefined || this.state.delete_number_list == null ||
        this.state.delete_number_list.length == 0) {
      del_tooltip = "選択したデータがありません。";
    }
    let creat_tooltip = '';
    if (this.state.change_flag === 0) {
      creat_tooltip = "変更されていません。";
    }
    let no = 0;
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className="cur-date morning example-custom-input" onClick={onClick}>
        {formatJapanDate(value)}
      </div>
    );
    let { examinationPatternList, table_data, delete_number_list } = this.state;
    return (
      <>
        <DialSideBar          
          onGoto={this.selectPatient}
          history = {this.props.history}
        />
        <DialPatientNav patientInfo={this.state.patientInfo} />
        <Card>
          <div className="title">検査データ入力</div>
          <ListTitle>
            <div className="left-area">
              <div>検査パターン</div>
            </div>
            <div className="right-area">
              <div className="cur_date flex">
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
            </div>
          </ListTitle>
          <List>
            <table className="table-scroll table table-bordered table-hover" id={`inspection-pattern-table`}>
              <thead>
                <tr>
                  <th className={"td-no"} />
                  <th>パターン名称</th>
                </tr>
              </thead>
              <tbody>
                {examinationPatternList !== undefined &&
                  examinationPatternList !== null &&
                  examinationPatternList.length > 0 &&
                  examinationPatternList.map((item, index) => {
                    if(item.is_enabled !== 0) {
                      return (
                        <>
                          <tr className={item.code === this.state.curPatternCode ? "selected" : ""} onClick={() => this.handlePattern(item.code)}>
                            <td className="td-no">{index + 1}</td>
                            <td className="tl">{item.name}</td>
                          </tr>
                        </>
                      );
                    }
                  })}
              </tbody>
            </table>
          </List>
          <Wrapper>
            <table className="table-scroll table table-bordered table-hover">
              <thead>
                <tr>
                  <th className="td-no" />
                  <th className="td-no" />
                  <th className="code">コード</th>
                  <th>検査名称</th>
                  <th className="reference">基準値</th>
                  <th className="unit">単位</th>
                  <th className="value">透析前</th>
                  <th className='value'>透析後</th>
                </tr>
              </thead>
              <tbody id={"wordList-table"}>
                {table_data !== undefined &&
                  table_data !== null &&
                  Object.keys(table_data).map((index) => {
                    no++;
                    let item = table_data[index];
                    return (
                      <>
                        <tr
                          onDoubleClick={this.inputValue.bind(this, index)}
                          onContextMenu={(e) => this.handleClick(e, index)}
                        >
                          <td className={"td-no text-right"}>{no}</td>
                          <td className={"td-no text-center"}>
                            <Checkbox
                              label=""
                              getRadio={this.getRadio.bind(this, item.number)}
                              value={
                                delete_number_list.indexOf(item.number) > -1
                                  ? 1
                                  : 0
                              }
                              name="check"
                            />
                          </td>
                          <td className="code tr">{item.code}</td>
                          <td className="tl">
                            {item.name}
                          </td>
                          {this.state.patientInfo != null &&
                          this.state.patientInfo.gender === 1 ? (
                            <td className="reference">
                              {item.reference_value_male != undefined &&
                              item.reference_value_male != null &&
                              item.reference_value_male !== ""
                                ? "男:" + item.reference_value_male
                                : (item.reference_value_male_min != null &&
                                  item.reference_value_male_min != ""
                                    ? item.reference_value_male_min + "~"
                                    : "") +
                                  (item.reference_value_male_max != null
                                    ? item.reference_value_male_max
                                    : "")}
                            </td>
                          ) : (
                            <td className="reference">
                              {item.reference_value_female != undefined &&
                              item.reference_value_female != null &&
                              item.reference_value_female !== ""
                                ? "女:" + item.reference_value_female
                                : (item.reference_value_female_min != null &&
                                  item.reference_value_female_min != ""
                                    ? item.reference_value_female_min + "~"
                                    : "") +
                                  (item.reference_value_female_max != null
                                    ? item.reference_value_female_max
                                    : "")}
                            </td>
                          )}
                          <td className="unit text-left">
                            {item.unit != null ? item.unit : ""}
                          </td>
                          <td className="value text-right">
                            {item.value != undefined ? item.value : ""}
                          </td>
                          <td className="value text-right">
                            {item.value2 != undefined ? item.value2 : ""}
                          </td>
                        </tr>
                      </>
                    );
                  })}
              </tbody>
            </table>
          </Wrapper>
          <div className="footer-buttons">
            <Button onClick={this.deleteData} className={del_tooltip != "" ? "disable-btn" : "delete-btn"} tooltip={del_tooltip}>一括削除</Button>
            <Button onClick={this.inspectionCalc} className={'red-btn'}>検査計算</Button>
            <Button onClick={this.createData} className={this.state.change_flag == 0 ? "disable-btn" : "red-btn"} tooltip={creat_tooltip}>登録</Button>
          </div>
          {this.state.isOpenModal && this.state.patientInfo != null && (
            <InspectionDataModal
              handleOk={this.handleOk}
              closeModal={this.closeModal}
              modal_data={this.state.modal_data}
              system_patient_id={this.state.patientInfo.system_patient_id}
            />
          )}
          {this.state.isUpdateConfirmModal !== false && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.confirmOk.bind(this)}
              confirmTitle={this.state.confirm_message}
            />
          )}
          {this.state.isConfirmMove == true && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.moveOtherPatient.bind(
                this,
                this.state.new_patient
              )}
              confirmTitle={this.state.confirm_message}
            />
          )}
          {this.state.isOpenConfirmModal !== false &&  (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.confirmCloseOk}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.openInspectionCalcModal && (
            <InspectionCalcModal
              handleOk={this.closeInspectionCalc}
              closeModal={this.closeInspectionCalc}
              modal_data={this.state.table_data}
            />
          )}
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
            favouriteMenuType={this.state.favouriteMenuType}
          />
        </Card>
      </>
    );
  }
}

InspectionData.propTypes = {
  history: PropTypes.object
}
export default InspectionData;
