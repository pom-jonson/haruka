import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import Button from "~/components/atoms/Button";
import DialSideBar from "../DialSideBar";
import DialPatientNav from "../DialPatientNav";
import DatePicker, { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import ja from "date-fns/locale/ja";
import { formatDateLine, formatJapanDate, getNextDayByJapanFormat, getPrevDayByJapanFormat, formatTimeIE} from "~/helpers/date"
import * as methods from "../DialMethods";
import axios from "axios/index";
import BasicDataModal from "./BasicDataModal";
import BasicDataPreviewModalDom from "../modals/BasicDataPreviewModalDom";
import SearchBar from "~/components/molecules/SearchBar";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import PropTypes from "prop-types";
import * as sessApi from "~/helpers/cacheSession-utils";
import {getServerTime} from "~/helpers/constants";
import {setDateColorClassName} from "~/helpers/dialConstants";

const Card = styled.div`
  padding: 1.25rem;
  position: fixed;
  top: 70px;
  left: 200px;
  width: calc(100% - 390px);
  margin: 0px;
  height: 100%;
  float: left;
  overflow: auto;
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .bodywrap {
      display: flex;
  }
  .footer {
      margin-top: 10px;
      text-align: center;
      button {
        text-align: center;
        border-radius: 4px;
        background: rgb(105, 200, 225);
        border: none;
        margin-right: 30px;
      }
      
      span {
        color: white;
        font-size: 20px;
        font-weight: 100;
      }
  }
  background-color: ${surface};
    button {
        margin-bottom: 10px;
        margin-left: 10px;
    }
`;

const Wrapper = styled.div`
  height: 100%;

  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
  .text-left{
    text-align:left;
  }
  .text-right{
    text-align:right;
  }
  .text-center{
    text-align:center;
  }
  .label-title{
    width:100px;
    font-size:16px;
    text-align:right;
    margin-right:10px;
  }
  .pullbox-select{
    width:200px;
    font-size:15px;
  }

  .content{
    margin-top: 0.5rem;
  }
  table {
    font-size:0.9rem;
    margin-bottom: 0;
  }
  thead{
    margin-bottom: 0;
    display:table;
    width:100%;
    tr{width: calc(100% - 17px);}
  }
  tbody{
    height: calc( 100vh - 23rem);
    overflow-y: scroll;
    display:block;
  }
  tr{
    display: table;
    width: 100%;
    box-sizing: border-box;
  }
  td {
      padding: 0.2rem;
      text-align: left;
      vertical-align: middle;
      border-bottom: 1px solid #dee2e6;
  }
  th {
      text-align: center;
      padding: 0.2rem;
  }
  .patient-number{
      width:7.3rem;
  }
  .blood-value{
      width:6rem;
      letter-spacing: -1.5px;
  }
  .weight-value{
      width:4.5rem;
      letter-spacing: -2px;
  }
  .weight-value-td{
    letter-spacing: -1px;
  }
  .time-value {
      width: 4.5rem;
      letter-spacing: -1px;
  }
 `;

const ListTitle = styled.div`
    width: 100%;
    height: 40px;
    display: flex;
    margin-top: 10px;
    span {
        color: blue;
    }
    .left-area {
        display: -webkit-flex; /* Safari */
        -webkit-flex-wrap: wrap; /* Safari 6.1+ */
        display: flex;
        flex-wrap: wrap;
        button {
          margin-bottom: 0;
          padding: 0 16px;
          span {
            font-size: 1rem;
          }
        }
    }
    .right-area {
      margin-left: 2rem;
        display: -webkit-flex; /* Safari */
        -webkit-flex-wrap: wrap; /* Safari 6.1+ */
        display: flex;
        flex-wrap: wrap;
    }
  .cur_date {
    font-size: 1.8rem;
    display: flex;
    flex-wrap: wrap;
    line-height: 38px;
  }
  .prev-day {
    cursor: pointer;
    padding-right: 10px;
  }
  .next-day {
    cursor: pointer;
    padding-left: 10px;
  }
`;

class BasicData extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    this.state = {
      table_data: [],
      isOpenModal: false,
      schedule_date: '',
      isUpdateConfirmModal: false,
      isBackConfirmModal: false,
      isPreviewModal: false,
      confirm_message: "",
      changed: 0,
      confirm_alert_title:''
    };
    this.double_click = false;
  }
  
  async componentDidMount() {
    let server_time = await getServerTime();
    sessApi.setObjectValue('for_left_sidebar', 'date', formatDateLine(new Date(server_time)));
    this.setState({schedule_date:new Date(server_time)});
    await this.getSearchResult();
  }
  
  componentWillUnmount() {
    sessApi.remove('for_left_sidebar');
  }
  
  getSearchResult = async () => {
    let path = "/app/api/v2/dial/medicine_information/basic_data/get";
    let post_data = {
      schedule_date: formatDateLine(this.state.schedule_date),
      patient_id: this.state.schVal,
    };
    const { data } = await axios.post(path, { params: post_data });
    this.setState({
      table_data: data,
      changed: 0,
    });
    this.setChangeFlag(0);
  };
  
  handlePreview = () => {};
  
  handlePatientSearch = () => {
    if (this.change_flag == 1) {
      this.setState({
        isBackConfirmModal: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_alert_title:'入力中',
        confirm_action: "patient",
      });
      return;
    }
    this.getSearchResult();
  };
  enterPressed = (e) => {
    var code = e.keyCode || e.which;
    if (code === 13) {
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
      this.getSearchResult();
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
        confirm_action: "date",
        select_sch_date: value,
        confirm_alert_title:'入力中',
      });
      return;
    }
    this.setState({ schedule_date: value }, () => {
      this.getSearchResult();
      sessApi.setObjectValue('for_left_sidebar', 'date', formatDateLine(this.state.schedule_date));
    });
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
      this.getSearchResult();
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
      this.getSearchResult();
      sessApi.setObjectValue('for_left_sidebar', 'date', formatDateLine(this.state.schedule_date));
    });
  };
  
  selectPatient =async(patientInfo) => {
    let server_time = await getServerTime();
    this.setState({
      patientInfo: patientInfo,
      schedule_date: new Date(server_time),
    }, () =>{
      sessApi.setObjectValue('for_left_sidebar', 'date', formatDateLine(this.state.schedule_date));
    });
  };
  
  editBasicData = (e, index) => {
    this.setState({
      modal_data: this.state.table_data[index],
      isOpenModal: true,
    });
  };
  
  handleOk = (post_data) => {
    let table_data = this.state.table_data;
    table_data[post_data["patient_id"]]["before_pressure_max"] =
      post_data.before_pressure_max;
    table_data[post_data["patient_id"]]["before_pressure_min"] =
      post_data.before_pressure_min;
    table_data[post_data["patient_id"]]["after_pressure_max"] =
      post_data.after_pressure_max;
    table_data[post_data["patient_id"]]["after_pressure_min"] =
      post_data.after_pressure_min;
    table_data[post_data["patient_id"]]["before_pulse"] =
      post_data.before_pulse;
    table_data[post_data["patient_id"]]["after_pulse"] = post_data.after_pulse;
    table_data[post_data["patient_id"]]["update_flag"] = 1;
    
    this.setState({
      changed: 1,
      table_data,
    });
    this.setChangeFlag(1);
    this.closeModal();
  };
  closeModal = () => {
    this.setState({
      isOpenModal: false,
      isPreviewModal: false,
    });
  };
  registerData = () => {
    this.confirmCancel();
    let path = "/app/api/v2/dial/medicine_information/basic_data/register";
    if (this.double_click == true) return;
    this.double_click = true;
    axios
      .post(path, this.state.table_data)
      .then((res) => {
        if (res.data !== undefined) {
          window.sessionStorage.setItem(
            "alert_messages",
            res.data.alert_message
          );
          let table_data = this.state.table_data;
          Object.keys(this.state.table_data).map((key) => {
            table_data[key].update_flag = 0;
          });
          this.setState({
            table_data,
            changed: 0,
          });
        }
      })
      .catch(() => {})
      .finally(() => {
        this.double_click = false;
        this.setChangeFlag(0);
      });
  };
  
  getDiffMinutes(first_dt, second_dt) {
    if (
      first_dt == null ||
      first_dt === "" ||
      second_dt == null ||
      second_dt === ""
    )
      return "-- : --";
    let first_time = formatTimeIE(first_dt).split(":");
    let first_minute = parseInt(first_time[0]) * 60 + parseInt(first_time[1]);
    let second_time = formatTimeIE(second_dt).split(":");
    let second_minute =
      parseInt(second_time[0]) * 60 + parseInt(second_time[1]);
    let result = [];
    result[0] = parseInt((first_minute - second_minute) / 60);
    result[1] = parseInt(first_minute - second_minute) % 60;
    if (result[0] < 0 || result[1] < 0) return;
    var temp = "";
    if (isNaN(result[0]) || isNaN(result[1])) return;
    if (parseInt(result[0]) < 10) {
      temp = parseInt(result[0]);
      result[0] = "0" + temp.toString();
    }
    if (parseInt(result[1]) < 10) {
      temp = parseInt(result[1]);
      result[1] = "0" + temp.toString();
    }
    return result.join(":");
  }
  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isBackConfirmModal: false,
      confirm_message: "",
      confirm_alert_title:''
    });
  }
  handleInsert = () => {
    if (this.state.changed === 0) {
      return;
    }
    if (this.state.changed !== undefined && this.state.changed == 1) {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "変更内容を保存しますか？",
      });
    } else {
      window.sessionStorage.setItem("alert_messages", "変更内容がありません。");
    }
  };
  
  openPreviewModal = () => {
    if (this.state.changed === 1) {
      return;
    }
    this.setState({
      isPreviewModal: true,
    });
  };
  setChangeFlag = (change_flag = 0) => {
    this.change_flag = change_flag;
    if (change_flag == 1) {
      sessApi.setObjectValue("dial_change_flag", "dial_family", 1);
    } else {
      sessApi.remove("dial_change_flag");
    }
  };
  selcetDateConfirmModal = () => {
    this.confirmCancel();
    this.setChangeFlag(0);
    if (this.state.confirm_action == "date")
      this.getDate(this.state.select_sch_date);
    else if (this.state.confirm_action == "patient") this.getList();
  };
  
  render() {
    const { table_data } = this.state;
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className="cur-date morning example-custom-input" onClick={onClick}>
        {formatJapanDate(value)}
      </div>
    );
    return (
      <>
        <DialSideBar onGoto={this.selectPatient} history={this.props.history} />
        <DialPatientNav
          patientInfo={this.state.patientInfo}
          history={this.props.history}
        />
        <Card>
          <Wrapper>
            <div className="title">基礎データ入力</div>
            <ListTitle>
              <div className="left-area flex">
                <div>
                  <SearchBar
                    placeholder="患者番号入力"
                    search={this.search}
                    enterPressed={this.enterPressed}
                  />
                </div>
                <Button type="mono" onClick={this.handlePatientSearch}>検索</Button>
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
            <div className="content">
              <table className="table table-bordered table-striped table-hover">
                <thead>
                <tr>
                  <th className="patient-number">患者番号</th>
                  <th className="name">漢字氏名</th>
                  <th className="blood-value">血圧高（前）</th>
                  <th className="blood-value">血圧低（前）</th>
                  <th className="blood-value">血圧高（後）</th>
                  <th className="blood-value">血圧低（後）</th>
                  <th className="weight-value">脈拍（前）</th>
                  <th className="weight-value">脈拍（後）</th>
                  <th className="weight-value">体重（前）</th>
                  <th className="weight-value">体重（後）</th>
                  <th className="time-value">実体重減</th>
                  <th className="time-value">開始時間</th>
                  <th className="time-value">終了時間</th>
                  <th className="time-value">実時間</th>
                </tr>
                </thead>
                <tbody>
                {Object.keys(table_data).map((index) => {
                  let item = table_data[index];
                  return (
                    <>
                      <tr onDoubleClick={(e) => this.editBasicData(e, index)}>
                        <td className="patient-number text-right">{index}</td>
                        <td className="name">{item.patient_name}</td>
                        <td className="blood-value text-right">
                          {item.before_pressure_max != null
                            ? item.before_pressure_max
                            : 0}
                        </td>
                        <td className="blood-value text-right">
                          {item.before_pressure_min != null
                            ? item.before_pressure_min
                            : 0}
                        </td>
                        <td className="blood-value text-right">
                          {item.after_pressure_max != null
                            ? item.after_pressure_max
                            : 0}
                        </td>
                        <td className="blood-value text-right">
                          {item.after_pressure_min != null
                            ? item.after_pressure_min
                            : 0}
                        </td>
                        <td className="weight-value text-right weight-value-td">
                          {item.before_pulse != null ? item.before_pulse : 0}
                        </td>
                        <td className="weight-value text-right weight-value-td">
                          {item.after_pulse != null ? item.after_pulse : 0}
                        </td>
                        <td className="weight-value text-right weight-value-td">
                          {isNaN(parseFloat(item.weight_before))
                            ? ""
                            : parseFloat(item.weight_before).toFixed(1)}
                        </td>
                        <td className="weight-value text-right weight-value-td">
                          {isNaN(parseFloat(item.weight_after))
                            ? ""
                            : parseFloat(item.weight_after).toFixed(1)}
                        </td>
                        <td className="time-value text-right">
                          {isNaN(item.diff_weight)
                            ? 0
                            : item.diff_weight.toFixed(1)}
                        </td>
                        <td className="time-value">
                          {item.start_date != null
                            ? formatTimeIE(item.start_date)
                            : "-- : --"}
                        </td>
                        <td className="time-value">
                          {item.end_date != null
                            ? formatTimeIE(item.end_date)
                            : "-- : --"}
                        </td>
                        <td className="time-value">
                          {item.diff_time}
                        </td>
                      </tr>
                    </>
                  );
                })}
                </tbody>
              </table>
            </div>
            <div className="footer-buttons">
              <Button
                className={this.state.changed ? "disable-btn" : "red-btn"}
                onClick={this.openPreviewModal.bind(this)}
              >
                帳票プレビュー
              </Button>
              <Button
                className={this.state.changed ? "red-btn" : "disable-btn"}
                onClick={this.handleInsert}
              >
                登録
              </Button>
            </div>
          </Wrapper>
          {this.state.isOpenModal && (
            <BasicDataModal
              handleOk={this.handleOk}
              closeModal={this.closeModal}
              modal_data={this.state.modal_data}
              schedule_date={this.state.schedule_date}
            />
          )}
          {this.state.isBackConfirmModal && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.selcetDateConfirmModal.bind(this)}
              confirmTitle={this.state.confirm_message}
              title = {this.state.confirm_alert_title}
            />
          )}
          {this.state.isPreviewModal && (
            <BasicDataPreviewModalDom
              closeModal={this.closeModal}
              schedule_date={formatDateLine(this.state.schedule_date)}
              pres_data={this.state.table_data}
            />
          )}
          {this.state.isUpdateConfirmModal && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.registerData.bind(this)}
              confirmTitle={this.state.confirm_message}
            />
          )}
        </Card>
      </>
    );
  }
}

BasicData.propTypes = {
  history: PropTypes.object
};
export default BasicData