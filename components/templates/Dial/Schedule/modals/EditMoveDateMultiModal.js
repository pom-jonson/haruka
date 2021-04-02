import React, { Component } from "react";
import { Modal } from "react-bootstrap";
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
registerLocale("ja", ja);
import { getTimeZoneList } from "~/components/templates/Dial/DialMethods/getSystemTimeZone";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSearch } from "@fortawesome/pro-solid-svg-icons";
import * as sessApi from "~/helpers/cacheSession-utils";
import { makeList_codeName, setDateColorClassName } from "~/helpers/dialConstants";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

// const Icon = styled(FontAwesomeIcon)`
//   color: blue;
//   font-size: 15px;
//   margin-right: 5px;
// `;

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
    margin-top: 0.625rem;
    font-size: 1rem;
  }
  label {
    text-align: right;
    width: 120px;
    font-size: 1rem;
  }
  .label {
    padding-top: 8px;
    width: 60px;
  }
  input {
    width: 200px;
    font-size: 1rem;
  }
  .modal_header {
    font-size: 1rem;
    span {
      margin-left: 20px;
      padding-top: 10px;
    }
  }
  .patient_id,
  .patient_name {
    font-size: 1.25rem;
  }
  .schedule_date {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .checkbox_area {
    padding-left: 15px;
    margin-top: 0px;
    position:absolute;
    right:8px;
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
      font-size:1rem;
    }
  }
  .bottom_part {
    border: 1px solid lightgray;
    padding-left: 15px;
  }
  .react-datepicker-wrapper {
    width: fit-content;
    border: 1px solid;
    margin-left: 50px;
    padding: 5px;
    .react-datepicker__input-container {
      width: 100%;
      margin-top: 3px;
      input {
        font-size: 1rem;
        width: 100%;
        height: 38px;
        border-radius: 4px;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(206, 212, 218);
        border-image: initial;
        padding: 0px 8px;
      }
    }
  }
  .modal_container {
    .pullbox {
      margin-top: 10px;
    }
    .pullbox-title {
      width: 60px;
      text-align: right;
      padding-right: 10px;
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
      padding-top: 8px;
    }
  }
  .other_moves_group{
    .include-label{
      margin-left: -10px;
      font-size:1rem;
      width:130px;
    }
    .checkbox-area label {
      width: 75px;
      font-size: 1rem;
    }
  }
  .radio-btn label {
    width: 55px;
    border: solid 1px rgb(206, 212, 218);
    border-radius: 4px;
    margin: 0 5px;
    padding: 4px 5px;
    font-size: 1rem;
  }
  .radio-group-btn label {
    font-size: 1rem;
  }
  .radio-group-btn {
    label {
      text-align: left;
    }
  }
  .footer {
    margin-top: 10px;
    text-align: center;
    padding-top: 20px;
    clear: both;
    label {
      width: 100px;
    }
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 30px;
      padding-left: 50px;
      padding-right: 50px;
    }
    .add-button {
      text-align: center;
    }
    span {
      color: white;
      font-size: 1rem;
      font-weight: 100;
      letter-spacing: 5px;
    }
  }
`;

class EditMoveDateMultiModal extends Component {
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
      isUpdateConfirmModal: false,
      groups: makeList_codeName(code_master["グループ"],1),
      time_zone: 0,
      selected_group: 0,
      confirm_message: '',
      injection_move:1,
      inspection_move:1,
      prescription_move:1,
      manage_move:1,
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
  saveEditedSchedule = () => {
    var temp = { ...this.state.schedule_item };
    temp.is_updated = 1;
    this.setState(
      {
        schedule_item: temp,
      },
      () => {
        this.props.saveDailysisSchedule(
          this.state.schedule_item,
          this.state.schedule_item.patient_id,
          this.state.schedule_item.schedule_day
        );
        this.props.closeModal();
      }
    );
  };

  selectTimezone = (e) => {
    this.setState({ time_zone: parseInt(e.target.value) }, () => {
      this.extractPatients(this.state.time_zone, this.state.selected_group);
    });
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
    } else {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message:"透析スケジュールを一括で移動しますか？",
      });
    }
  };
  
  modalBlack() {
    var base_modal = document.getElementsByClassName("multi-move-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1040;
  }
  modalBlackBack() {
    var base_modal = document.getElementsByClassName("multi-move-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1050;
  }

  moveSchedule = async() => {
    this.confirmCancel();
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
          patient_name: this.state.patients_list[patient_id].patient_name
        };
        req.push(arr);
      });
    let newDate = this.state.schedule_date;
    this.props.handleMoveMulti(req, formatDateLine(newDate), this.state.injection_move, this.state.inspection_move, this.state.prescription_move, this.state.manage_move);
  }

  getGroup = (e) => {
    this.setState({ selected_group: e.target.id }, () => {
      this.extractPatients(this.state.time_zone, this.state.selected_group);
    });
  };

  onHide = () => {};

  confirmCancel() {
    this.setState({
      confirm_message:'',
      isUpdateConfirmModal:false,
      confirm_alert_title:''
    });
    this.modalBlackBack();
  }

  checkOtherScheduleMove = (name, value) => {    
    switch(name){
      case "injection":
        this.setState({injection_move:value});
        break;
      case "prescription":
        this.setState({prescription_move:value});
        break;
      case "inspection":
        this.setState({inspection_move:value});
        break;
      case "manage":
        this.setState({manage_move:value});
        break;
    }
  }

  render() {
    let { patients_list, schedule_item } = this.state;
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className="cur-date morning example-custom-input" onClick={onClick}>
        {formatJapanDate(value)}
      </div>
    );

    return (
      <Modal
        show={true}
        onHide={this.onHide}
        className="master-modal multi-move-modal first-view-modal"
        style={{ top: "10%" }}
      >
        <Modal.Header>
          <Modal.Title>透析スケジュール一括移動</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DatePickerBox style={{width:"100%", height:"100%"}}>
            <Wrapper>
              <div className="modal_header flex">
                <div className="schedule_date">
                  {formatJapanDate(schedule_item.schedule_date)}
                </div>
                <span className="">の予定を</span>
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
                <span className="">へ移動する</span>
              </div>
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
                  </div>
                  {/* <div className="search">
                    <Icon icon={faSearch} />
                    検索
                  </div> */}
                </div>
                <div className="main_part">
                  {Object.keys(patients_list).map((patient_id) => {
                    if (
                      patients_list[patient_id].pre_start_confirm_at == null ||
                      patients_list[patient_id].pre_start_confirm_at == ""
                    ) {
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
                    }
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
                    <Button type="mono" onClick={this.selectAllTimes}>
                      すべて
                    </Button>
                  </div>
                </div>
                <div className="other_moves_group flex">
                  <label className="include-label">移動対象に含める</label>
                  <div className="checkbox-area">
                    <Checkbox
                      label="注射"
                      getRadio={this.checkOtherScheduleMove.bind(this)}
                      value={this.state.injection_move}                    
                      name="injection"
                    />
                    <Checkbox
                      label="処方"
                      getRadio={this.checkOtherScheduleMove.bind(this)}
                      value={this.state.prescription_move}                    
                      name="prescription"
                    />
                    <Checkbox
                      label="検査"
                      getRadio={this.checkOtherScheduleMove.bind(this)}
                      value={this.state.inspection_move}                    
                      name="inspection"
                    />
                    <Checkbox
                      label="管理料"
                      getRadio={this.checkOtherScheduleMove.bind(this)}
                      value={this.state.manage_move}                    
                      name="manage"
                    />
                  </div>
                </div>
              </div>
            </Wrapper>
          </DatePickerBox>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.props.closeModal}>
            キャンセル
          </Button>
          <Button className="red-btn" onClick={this.handleMoveMulti.bind(this)}>
            一括移動
          </Button>
        </Modal.Footer>
        {this.state.isUpdateConfirmModal == true && (
          <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.moveSchedule.bind(this)}
              confirmTitle= {this.state.confirm_message}
              title={'変更確認'}
          />
        )}
      </Modal>
    );
  }
}

EditMoveDateMultiModal.contextType = Context;

EditMoveDateMultiModal.propTypes = {
  closeModal: PropTypes.func,
  handleMoveMulti: PropTypes.func,
  saveDailysisSchedule: PropTypes.func,
  schedule_item: PropTypes.array,
  patients_same_day: PropTypes.array,
};

export default EditMoveDateMultiModal;
