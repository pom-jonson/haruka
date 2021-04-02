import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Checkbox from "~/components/molecules/Checkbox";
import Button from "~/components/atoms/Button";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import {
  formatDateLine,
  formatJapanDate,
} from "~/helpers/date";
import axios from "axios/index";
import * as methods from "~/components/templates/Dial/DialMethods";
import { CACHE_SESSIONNAMES } from "~/helpers/constants";
registerLocale("ja", ja);
import PatientScheduleModal from "../Schedule/modals/PatientScheduleModal";
import * as apiClient from "~/api/apiClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import MasterPatient from "../Schedule/MasterPatient";
import PlanPrintPrewModal from "../Schedule/modals/PlanPrintPrewModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import { makeList_code, setDateColorClassName} from "~/helpers/dialConstants";

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 1rem;
  margin-right: 0.3rem;
  cursor: pointer;
`;

const Wrapper = styled.div`
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
    cursor: pointer;
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
  th{
    background:lightgray;
    font-weight:normal;
  }
`;

class PatientPlan extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
    let code_master = sessApi.getObjectValue(
      "dial_common_master",
      "code_master"
    );
    let twoMonthAgoFirstDay = schedule_date != null && schedule_date != ''? new Date(schedule_date): new Date();
    twoMonthAgoFirstDay.setMonth(twoMonthAgoFirstDay.getMonth() - 2);
    twoMonthAgoFirstDay.setDate(1);
    let nextMonthlaterDay = schedule_date != null && schedule_date != ''? new Date(schedule_date): new Date();
    nextMonthlaterDay.setMonth(nextMonthlaterDay.getMonth() + 2);
    nextMonthlaterDay.setDate(0);
    this.double_click = false;
    this.state = {
      start_date: twoMonthAgoFirstDay,
      end_date: nextMonthlaterDay,
      patientInfo,
      system_patient_id:patientInfo != undefined && patientInfo != null ? patientInfo.system_patient_id : 0,
      patient_number:patientInfo != undefined && patientInfo != null ? patientInfo.patient_number : 0,
      patient_name:patientInfo != undefined && patientInfo != null ? patientInfo.patient_name : "",
      table_data: [],
      row_index: "",
      display_all: 1,
      all_period: 0,
      finishdelete: 0,
      isOpenModal: false,
      modal_data: {},
      isOpenPrintPreviewModal: false,
      reservedPatientData: code_master["患者予定"],
      reserved_patient_codes: makeList_code(code_master["患者予定"]),
    };
  }

  async componentDidMount () {
    await this.getList();
    await this.getStaffs();
  }

  componentWillUnmount() {
    this.double_click = null;
    
    var html_obj = document.getElementsByClassName("patient_plan_warpper")[0];
    if(html_obj !== undefined && html_obj != null){
        html_obj.innerHTML = "";
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.patientInfo != undefined &&
      nextProps.patientInfo != null &&
      nextProps.patientInfo.system_patient_id != this.state.system_patient_id
    ) {
      this.setState(
        {
          system_patient_id: nextProps.patientInfo.system_patient_id,
          patient_number: nextProps.patientInfo.patient_number,
          patient_name: nextProps.patientInfo.patient_name,
          patientInfo:nextProps.patientInfo,
        },
        () => {
          this.getList();
        }
      );
    }
  }

  // モーダル
  openModal = () => {
    if (this.state.system_patient_id == 0) {
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
        system_patient_id: this.state.system_patient_id,
      },
    };
    await apiClient
      .post(path, post_data)
      .then((res) => {
        if (res) {
          window.sessionStorage.setItem("alert_messages","削除完了##" +  res.alert_message);
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
        system_patient_id: this.state.system_patient_id,
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
    object.patient_number = this.state.system_patient_id;
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
          window.sessionStorage.setItem("alert_messages",title + res.alert_message);
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

   getList=async()=>{
    if (this.state.system_patient_id == 0) return;
    let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
    schedule_date = schedule_date != null && schedule_date !=''?schedule_date:formatDateLine(new Date());
    this.props.checkPatientPlanStatus(this.state.system_patient_id, schedule_date);
    let path = "/app/api/v2/dial/schedule/patient_schedule/list";
    let type = "";
    this.state.finishdelete == 1 ? (type = "all") : (type = "onlyenable");
    let post_data = {
      type: type,
      patient_number: this.state.system_patient_id,
      start_date:this.state.all_period != 1 ? formatDateLine(this.state.start_date) : undefined,
      end_date: this.state.all_period != 1 ? formatDateLine(this.state.end_date) : undefined,
    };

    let { data } = await axios.post(path, { params: post_data });
    this.setState({table_data: data == undefined ? [] : data,});
  }

  goPlanList = () => {
    this.props.history.replace("/dial/others/patientPlanList");
  };

  openPrintPreview = () => {
    if (this.state.system_patient_id == 0) {
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
      <Wrapper className="patient_plan_warpper">
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
            <button className="seeallschedulebtn" onClick={this.goPlanList.bind(this)}>全患者の予定一覧</button> 
            <div className="add_area" onClick={this.openModal}>
              <Icon icon={faPlus} className="plus_icon" />予定追加
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
            <Button onClick={this.openPrintPreview.bind(this)} className={this.state.curFocus === 1 ? "red-btn focus" : "red-btn"}>帳票プレビュー</Button>
            <div className="add_area" onClick={this.openModal}>
              <Icon icon={faPlus} className="plus_icon" />
              予定追加
            </div>
        </div>
       {((this.state.isOpenModal && this.state.system_patient_id) ||
        (this.state.isOpenModal && this.state.modal_data != null)) && (
        <PatientScheduleModal
          patient_id={this.state.system_patient_id}
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
          patient_id={this.state.system_patient_id}
          start_date={this.state.all_period != 1 ? formatDateLine(this.state.start_date) : undefined}
          end_date={this.state.all_period != 1 ? formatDateLine(this.state.end_date) : undefined}
          reserved_patient_codes={this.state.reserved_patient_codes}
          finishdelete={this.state.finishdelete}
          display_all = {this.state.display_all}
          all_period = {this.state.all_period}
          table_data={this.state.table_data}
          print_data={this.state}
          staff_list_by_number = {this.state.staff_list_by_number}
          patientInfo = {this.state.patientInfo}
          from_mode={'patient_plan'}
        />
      )}
      </Wrapper>
    );
  }
}

PatientPlan.contextType = Context;

PatientPlan.propTypes = {
  patientInfo: PropTypes.object,
  checkPatientPlanStatus: PropTypes.func,
  history: PropTypes.object,
};

export default PatientPlan;
