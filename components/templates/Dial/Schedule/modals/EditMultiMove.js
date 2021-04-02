import React, { Component } from "react";
import { Modal, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import Checkbox from "~/components/molecules/Checkbox";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import RadioButton from "~/components/molecules/RadioInlineButton";
import RadioGroupButton from "~/components/molecules/RadioGroup";
import DatePicker, { registerLocale } from "react-datepicker";
import { formatJapanDate, formatDateLine } from "~/helpers/date";
import ja from "date-fns/locale/ja";
import { getTimeZoneList } from "~/components/templates/Dial/DialMethods/getSystemTimeZone";
import * as sessApi from "~/helpers/cacheSession-utils";
import { makeList_codeName, setDateColorClassName} from "~/helpers/dialConstants";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
registerLocale("ja", ja);
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  float: left;
  .flex {
    display: flex;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 1rem;
  }

  .left {
    float: left;
  }
  .right {
    float: right;
  }
  label {
    text-align: right;
    width: 100px;
  }
  .label {
    padding-top: 0.5rem;
    width: 4rem;
  }
  input {
    width: 200px;
    font-size: 1rem;
  }
  .modal_header {
    font-size: 1rem;
    span {
      margin-left: 20px;
      padding-top: 0.5rem;
    }
  }
  .patient_id,
  .patient_name {
    font-size: 20px;
  }
  .schedule_date {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .input_area {
    .label-title {
      display: none;
    }
    .count {
      padding-top: 1rem;
      padding-left: 0.25rem;
    }
  }
  .checkbox_area {    
    margin-top: 0px;
    position: absolute;
    right: 7px;
    .checkbox-label {
      text-align: left;
    }
  }
  .search {
    position: absolute;
    right: 19px;
    cursor: pointer;
  }
  .main_part {
    width: 100%;
    height: 400px;
    overflow-y: scroll;
    border: 1px solid lightgray;
    .radio-group-btn label {
      border-radius: 0;
      margin-right: 3px;
      width: 32%;
      text-align: left;
      padding-left: 0.5rem;  
    }
  }
  .bottom_part {
    border: 1px solid lightgray;
    padding-left: 1rem;
  }
  .old_date_area {
    margin-top: 2rem;
    margin-bottom: 1rem;
    .old_date {
      font-size: 1rem;
      margin-right: 0.5rem;
    }
  }
  .react-datepicker-wrapper {
    width: fit-content;
    border: 1px solid;
    margin-left: 0px;
    margin-right: 20px;
    margin-bottom: 1rem;
    padding: 0.25rem;
    .react-datepicker__input-container {
      width: 100%;
      margin-top: 3px;
      div {
        font-size: 1rem;
      }
      input {
        width: 100%;
        height: 2.375rem;
        border-radius: 4px;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(206, 212, 218);
        border-image: initial;
        padding: 0px 0.5rem;
      }
    }
  }
  .sub-title {
    font-size: 1rem;
  }
  .modal_container {
    .pullbox {
      margin-top: 0.5rem;
    }
    .pullbox-title {
      width: 5rem;
      font-size: 1rem;
      text-align: right;
      padding-right: 0.5rem;
    }
    .pullbox-label,
    .pullbox-select {
      width: 130px;
    }
  }
  .schedule_time {
    button {
      padding: 0px;
      min-width: 70px;
      height: 38px;
      background: lightblue;
    }
    .label {
      font-size: 1rem;
      padding-top: 4px;
    }
  }
  .radio-btn label {
    width: 4rem;
    border: solid 1px rgb(206, 212, 218);
    border-radius: 4px;
    margin: 0 0.25rem;
    margin-right: 0.25rem;
    padding: 4px 0.25rem;
    font-size: 1rem;
  }
  .radio-group-btn label {
    font-size: 1rem;
  }
`;

class EditMultiMove extends Component {
  constructor(props) {
    super(props);
    let code_master = sessApi.getObjectValue(
      "dial_common_master",
      "code_master"
    );
    this.state = {
      schedule_item: this.props.schedule_item,
      schedule_date: new Date(),
      all_check_flag: 0,
      selected_patients_list: [],
      patients_list: this.props.patients_same_day,
      time_zone_list: getTimeZoneList(),
      groups: makeList_codeName(code_master["グループ"],1),
      isUpdateConfirmModal: false,
      confirm_message: "",
    };
  }

  getCheckAll = (name, value) => {
    var temp = [];
    if (name == "select_all") {
      this.setState({ all_check_flag: value });
    }
    if (value === 1) {
      Object.keys(this.state.patients_list).map((patient_id) => {
        temp.push(
          parseInt(this.state.patients_list[patient_id].system_patient_id)
        );
      });
      this.setState({ selected_patients_list: temp });
    } else {
      this.setState({
        selected_patients_list: [],
        all_check_flag: 0,
      });
    }
  };

  getDate = (value) => {
    this.setState({
      schedule_date: value,
    });
  };
  changeScheduleTime = (e) => {
    var temp = this.state.schedule_item;
    temp.schedule_time = parseInt(e.target.value);
    this.setState({
      schedule_item: temp,
    });
  };
  getGroup = (e) => {
    this.setState({ selected_group: e.target.id }, () => {
      this.extractPatients(this.state.time_zone, this.state.selected_group);
    });
  };

  extractPatients = (time_zone, group) => {
    var temp = this.props.patients_same_day;
    var new_list = {};
    Object.keys(temp).map((patient_id) => {
      var patient = temp[patient_id];
      if (time_zone > 0) {
        if (patient.time_zone == time_zone) {
          if (group > 0) {
            if (patient.group == group) new_list[patient_id] = patient;
          } else {
            new_list[patient_id] = patient;
          }
        }
      } else {
        if (group > 0) {
          if (patient.group == group) new_list[patient_id] = patient;
        } else {
          new_list[patient_id] = patient;
        }
      }
    });
    this.setState({ patients_list: new_list });
  };

  selectTimezone = (e) => {
    this.setState({ time_zone: parseInt(e.target.value) }, () => {
      this.extractPatients(this.state.time_zone, this.state.selected_group);
    });
  };

  selectAllTimes = () => {
    this.setState(
      {
        time_zone: 0,
        selected_group: 0,
      },
      () => {
        this.extractPatients(this.state.time_zone, this.state.selected_group);
      }
    );
  };

  selectPatient = (e) => {
    var temp = [...this.state.selected_patients_list];
    if (temp.indexOf(parseInt(e.target.value)) < 0) {
      temp.push(parseInt(e.target.value));
    } else {
      var index = temp.indexOf(parseInt(e.target.value));
      if (index !== -1) {
        temp.splice(index, 1);
      }
    }
    if (temp.length == Object.keys(this.state.patients_list).length) {
      this.setState({ all_check_flag: 1 });
    } else {
      this.setState({ all_check_flag: 0 });
    }
    this.setState({ selected_patients_list: temp });
  };

  handleMoveMulti = () => {
    if (this.state.selected_patients_list.length < 1) {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    this.setState({
      isUpdateConfirmModal: true,
      confirm_message: "処方スケジュールを一括で移動しますか？",
    });    
  }

  moveMulti = () => {    
    let req = [];
    Object.keys(this.state.patients_list)
      .filter((item) => {
        if (this.state.selected_patients_list.indexOf(parseInt(item)) >= 0) {
          return true;
        }
      })
      .map((patient_id) => {
        let arr = {
          patient_id: parseInt(patient_id),
          schedule_date: this.state.patients_list[patient_id].schedule_date,
        };
        req.push(arr);
      });
    let newDate = this.state.schedule_date;
    this.props.handleMoveMulti(req, formatDateLine(newDate));
  };

  onHide = () => {};

  confirmCancel = () => {
    this.setState({
      confirm_message: "",
      isUpdateConfirmModal: false
    });
  }

  confirmOk = () => {
    this.setState({
      confirm_message: "",
      isUpdateConfirmModal: false
    });
    this.moveMulti(); 
  }

  render() {
    let { patients_list } = this.state;
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className="cur-date morning example-custom-input" onClick={onClick}>
        {formatJapanDate(value)}
      </div>
    );

    return (
      <Modal
        show={true}
        onHide={this.onHide}
        className="master-modal prescription-multiSet-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>処方スケジュール一括移動</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DatePickerBox style={{width:"100%", height:"100%"}}>
            <Wrapper>
              <Col md="4" className="left">
                <div className="schedule_date">
                  <div className="old_date_area">
                    <span className="old_date">
                      {formatJapanDate(this.props.schedule_item.schedule_date)}
                    </span>
                    <span>の処方予定を</span>
                  </div>
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
                  へ移動する
                </div>
                <div className="sub-title">対象の処方区分</div>
                <div className="flex schedule_time">
                  <RadioButton
                    id="111"
                    value={0}
                    label="定期1"
                    name="schedule_time"
                    // getUsage={this.changeScheduleTime}
                    // checked={this.state.schedule_item.schedule_time == 0 ? true : false}
                  />
                  <RadioButton
                    id="112"
                    value={1}
                    label="定期2"
                    name="schedule_time"
                    // getUsage={this.changeScheduleTime}
                    // checked={this.state.schedule_item.schedule_time == 1 ? true : false}
                  />
                  <RadioButton
                    id="113"
                    value={2}
                    label="定期3"
                    name="schedule_time"
                    // getUsage={this.changeScheduleTime}
                    // checked={this.state.schedule_item.schedule_time == 2 ? true : false}
                  />
                </div>
              </Col>
              <Col md="8" className="right">
                <div className="modal_container">
                  <div className="top_part flex">
                    <div className="">対象患者一覧</div>
                    <div className="checkbox_area">
                      <Checkbox
                        label="全患者選択"
                        getRadio={this.getCheckAll.bind(this)}
                        value={this.state.all_check_flag}
                        name="select_all"
                      />
                      {/* <label className="checkbox-label">全患者選択</label> */}
                    </div>
                    {/* <div className="search">
                      <Icon icon={faSearch} />
                      検索
                    </div> */}
                  </div>
                  <div className="main_part">
                    {Object.keys(patients_list).map((patient_id) => {
                      return (
                        <>
                          <RadioGroupButton
                            id={patient_id}
                            value={patient_id}
                            label={
                              patients_list[patient_id].patient_number +
                              " : " +
                              patients_list[patient_id].patient_name
                            }
                            name="patient_name"
                            getUsage={(e) => this.selectPatient(e)}
                            checked={
                              this.state.selected_patients_list.indexOf(
                                parseInt(patient_id)
                              ) >= 0
                                ? true
                                : false
                            }
                          />
                        </>
                      );
                    })}
                  </div>
                  <div className="bottom_part flex">
                    <SelectorWithLabel
                      options={this.state.groups}
                      title="グループ"
                      getSelect={this.getGroup.bind(this)}
                      departmentEditCode={this.state.selected_group}
                    />
                    <div className="flex schedule_time">
                      <label className="label">時間帯</label>
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
                                  this.state.time_zone === item.id ? true : false
                                }
                              />
                            </>
                          );
                        })}
                      {/*/>*/}
                      <Button type="mono" onClick={this.selectAllTimes}>
                        すべて
                      </Button>
                    </div>
                  </div>
                </div>
              </Col>
            </Wrapper>
            {this.state.isUpdateConfirmModal !== false && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.confirmOk.bind(this)}
                confirmTitle={this.state.confirm_message}
                title='変更確認'
              />
            )}
          </DatePickerBox>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
          <Button className="red-btn" onClick={this.handleMoveMulti.bind(this)}>一括移動</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

EditMultiMove.contextType = Context;

EditMultiMove.propTypes = {
  closeModal: PropTypes.func,
  handleMoveMulti: PropTypes.func,
  saveDailysisSchedule: PropTypes.func,
  schedule_item: PropTypes.array,
  patients_same_day: PropTypes.array,
};

export default EditMultiMove;