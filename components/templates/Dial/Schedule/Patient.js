import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import Button from "~/components/atoms/Button";
import MasterPatient from "./MasterPatient";
import PatientScheduleModal from "./modals/PatientScheduleModal";
import PlanPrintPrewModal from "./modals/PlanPrintPrewModal";
import DialSideBar from "../DialSideBar";
import axios from "axios";
import * as apiClient from "~/api/apiClient";
import * as methods from "../DialMethods";
import DialPatientNav from "../DialPatientNav";
import * as sessApi from "~/helpers/cacheSession-utils";
import { makeList_code, setDateColorClassName} from "~/helpers/dialConstants";
import DatePicker, { registerLocale } from "react-datepicker";
import { formatJapanDate, formatDateLine } from "~/helpers/date";
import ja from "date-fns/locale/ja";
import Checkbox from "~/components/molecules/Checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
registerLocale("ja", ja);

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 1rem;
  margin-right: 0.3rem;
  cursor: pointer;
`;

const Card = styled.div`
  position: fixed;
  top: 70px;
  left: 200px;
  width: calc(100% - 390px);
  margin: 0px;
  height: 100vh;
  float: left;
  background-color: ${surface};
  padding: 1.25rem;
  .flex {
    display:flex;
    flex-wrap: wrap;
  }
  .search_part {
    margin-top: 0.3rem;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    .switch {
      position: absolute;
      right: 1.5rem;
      label {
        font-size: 1rem;
      }
    }
  }  
  .seeallschedulebtn {
    text-align: center;
    border-radius: 0.25rem;
    background: rgb(105, 200, 225);
    border: none;
    font-size: 1rem;
    float: right;
    color: white;
    padding: 8px 16px;
    margin-top: -4px;
  }
  .label-title {
    width: 6.25rem;
    font-size: 1rem;
    text-align: right;
    margin-right: 0.625rem;
  }
  .pullbox-select {
    width: 12.5rem;
    font-size: 1rem;
  }
  .pullbox {
    margin-right: 1.25rem;
  }
  .select_date_range {
    span {
      line-height: 38px;
    }
    label {
      margin-left: 1.5rem;
      font-size: 1rem;
      line-height: 38px;
      margin-bottom: 0;
    }
  }
  .check-area {
    label {
      font-size: 1rem;
      line-height: 38px;
    }
  }
  .example-custom-input {
    font-size: 1rem;
    width: 11.5rem;
    text-align: center;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
    border: 1px solid;
    margin-left: 0.3rem;
    margin-right: 0.3rem;
  }
  .example-custom-input.disabled {
    background: lightgray;
  }
  .title {
    font-size: 2rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;
  }
  .add_area {
    cursor: pointer;
    line-height: 38px;
    margin-left: 1rem;    
    font-size: 1rem;
  }
  .react-datepicker__input-container{
    padding-top:3px;
  }
`;

class Patient extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let code_master = sessApi.getObjectValue(
      "dial_common_master",
      "code_master"
    );
    let patientInfo = sessApi.getObjectValue("dial_setting", "patient");
    let twoMonthAgoFirstDay = new Date();
    twoMonthAgoFirstDay.setMonth(twoMonthAgoFirstDay.getMonth() - 2);
    twoMonthAgoFirstDay.setDate(1);
    let nextMonthlaterDay = new Date();
    nextMonthlaterDay.setMonth(nextMonthlaterDay.getMonth() + 2);
    nextMonthlaterDay.setDate(0);
    this.state = {
      patientInfo,
      patient_id: patientInfo != undefined ? patientInfo.system_patient_id : 0,
      start_date: twoMonthAgoFirstDay,
      end_date: nextMonthlaterDay,

      table_data: [],
      row_index: "",
      display_all: 1,
      all_period: 0,
      finishdelete: 0,

      isOpenModal: false,
      modal_data: {},

      reservedPatientData: code_master["患者予定"],
      reserved_patient_codes: makeList_code(code_master["患者予定"]),
      isOpenPrintPreviewModal: false,
    };
  }

  componentDidMount = async() => {
    await this.getStaffs();
  }

  selectPatient = (patientInfo) => {
    this.setState(
      {
        patient_id: patientInfo.system_patient_id,
        patient_number: patientInfo.patient_number,
        patient_name: patientInfo.patient_name,
        patientInfo,
      },
      () => {
        this.getList();
      }
    );
  };

  // モーダル
  openModal = () => {
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
  closeModal = () => {
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

  updateData = (index) => {
    let modal_data = this.state.table_data;
    this.setState({
      modal_data: modal_data[index],
      row_index: index,
      isOpenModal: true,
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
    this.closeModal();
  };

  getStartDate = (value) => {
    this.setState({ start_date: value }, () => {
      this.getList();
    });
  };

  getEndDate = (value) => {
    this.setState({ end_date: value }, () => {
      this.getList();
    });
  };

  switchDisplay = (name, value) => {
    if (name === "switch_dispaly") {
      this.setState({ display_all: value });
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

  async getList() {
    if (this.state.patient_id == 0) return;
    let path = "/app/api/v2/dial/schedule/patient_schedule/list";
    let type = "";
    this.state.finishdelete == 1 ? (type = "all") : (type = "onlyenable");
    let post_data = {
      type: type,
      patient_number: this.state.patient_id,
      start_date:
        this.state.all_period != 1
          ? formatDateLine(this.state.start_date)
          : undefined,
      end_date:
        this.state.all_period != 1
          ? formatDateLine(this.state.end_date)
          : undefined,
    };

    let { data } = await axios.post(path, { params: post_data });
    this.setState({
      table_data: data == undefined ? [] : data,
    });
  }

  goPlanList = () => {
    this.props.history.replace("/dial/others/patientPlanList");
  };

  openPrintPreview = () => {
    if (this.state.patient_id == 0) {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    this.setState({
      isOpenPrintPreviewModal: true,
    });
  };

  render() {
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
          <div className="title">患者予定・他科受診</div>
          <div className="search_part flex">
            <div className="select_date_range flex">
              <label style={{cursor:"text"}}>期間</label>
              <DatePicker
                locale="ja"
                selected={this.state.start_date}
                onChange={this.getStartDate.bind(this)}
                dateFormat="yyyy/MM/dd"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                disabled={this.state.all_period}
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
                disabled={this.state.all_period}
                dayClassName = {date => setDateColorClassName(date)}
                customInput={<ExampleCustomInput />}
              />
            </div>
            <div className={'check-area'}>
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
            <div className="flex">
              <button
                className="seeallschedulebtn"
                onClick={this.goPlanList.bind(this)}
              >
                全患者の予定一覧
              </button>
              <div
                className="add_area"
                onClick={this.openModal}
              >
                <Icon icon={faPlus} className="plus_icon" />
                予定追加
              </div>
            </div>
          </div>
          {this.state.staff_list_by_number != undefined && this.state.staff_list_by_number != null ? (
            <MasterPatient
              table_data={this.state.table_data}
              editData={this.updateData}
              deleteData={this.deleteData}
              recoverData={this.recoverData}
              patient_name={this.state.patient_name}
              reserved_patient_codes={this.state.reserved_patient_codes}
              display_all={this.state.display_all}
              staff_list_by_number = {this.state.staff_list_by_number}
            />
          ):(
            <MasterPatient
              table_data={undefined}
              editData={this.updateData}
              deleteData={this.deleteData}
              recoverData={this.recoverData}
              patient_name={this.state.patient_name}
              reserved_patient_codes={this.state.reserved_patient_codes}
              display_all={this.state.display_all}
              staff_list_by_number = {this.state.staff_list_by_number}
            />
          )}
          <div className="footer-buttons">
              <Button
                onClick={this.openPrintPreview.bind(this)}
                className={this.state.curFocus === 1 ? "red-btn focus" : "red-btn"}
              >
                帳票プレビュー
              </Button>
              <div
                className="add_area"
                onClick={this.openModal}
              >
                <Icon icon={faPlus} className="plus_icon" />
                予定追加
              </div>
          </div>
          {((this.state.isOpenModal && this.state.patient_id) ||
            (this.state.isOpenModal && this.state.modal_data != null)) && (
            <PatientScheduleModal
              patient_id={this.state.patient_id}
              patient_number={this.state.patient_number}
              patient_name={this.state.patient_name}
              row_index={this.state.row_index}
              modal_data={this.state.modal_data}
              closeModal={this.closeModal}
              saveData={this.confirm}
            />
          )}
          {this.state.isOpenPrintPreviewModal && (
            <PlanPrintPrewModal
              closeModal={this.closeModal}
              patientInfo = {this.state.patientInfo}
              patient_id={this.state.patient_id}
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
              from_mode={'patient'}
            />
          )}
        </Card>
      </>
    );
  }
}

Patient.contextType = Context;

Patient.propTypes = {
  history: PropTypes.object,
};

export default Patient;
