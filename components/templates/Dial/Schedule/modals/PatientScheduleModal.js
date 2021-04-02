import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import TextareaWithLabelBorder from "~/components/molecules/TextareaWithLabelBorder";
import RadioButton from "~/components/molecules/RadioInlineButton";
import Checkbox from "~/components/molecules/Checkbox";
import { formatDateLine } from "~/helpers/date";
import * as methods from "../../DialMethods";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import { getTimeZoneList } from "~/components/templates/Dial/DialMethods/getSystemTimeZone";
import * as sessApi from "~/helpers/cacheSession-utils";
import { makeList_code, makeList_codeName, makeList_data, extract_enabled, makeList_number} from "~/helpers/dialConstants";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import axios from "axios/index";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import { scheduleValidate } from '~/helpers/validate'
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from "jquery";
import Spinner from "react-bootstrap/Spinner";
const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
`;
const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 16px;
  width: 100%;
  height: 100%;
  float: left;
  .add-button {
    text-align: center;
    width: 100%;
    .first {
      margin-left: -30px;
    }
  }
  .red_field {
    border-color: red;
  }
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .patient_info {
    font-size: 25px;
    padding-bottom: 20px;
  }
  .left-area {
    width: 65%;
    .react-datepicker-wrapper {
      width: 100%;
      .react-datepicker__input-container {
        width: 100%;
        input {
          font-size: 16px;
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
    .pullbox-select {
      font-size: 16px;
      width: 100%;
    }
    .pullbox .pullbox-label {
      height: 38px;
      width: calc(100% - 65px);
      margin-right: 0px;
    }
    .pullbox .label-title {
      width: 125px;
      text-align: right;
      font-size: 16px;
      margin-right: 10px;
      margin-top: 5px;
    }
    .search-btn {
      border: 1px solid rgb(206, 212, 218);
      font-size: 16px;
      margin-top: 8px;
      margin-left: 5px;
      padding: 8px 10px 0 10px;
    }
    .select-day {
      width: 40%;
      .react-datepicker-wrapper {
        width: calc(100% - 75px);
      }
    }
    .input-title {
      width: calc(100% - 75px);
      input {
        width: calc(100% - 175px);
      }
    }
    .display-day {
      width: 60%;
      margin-top: 3px;
      font-size: 16px;
      .display-day-label {
        width: 80px;
        margin-right: 10px;
        margin-top: 12px;
        float: left;
        font-size: 16px;
        text-align: right;
      }
      .radio-btn {
        label {
          width: 60px;
        }
      }
    }
    .attach_doc_check {
      width: 50%;
      margin-top: 3px;
      font-size: 16px;
      .attach_doc_check-label {
        width: 90px;
        margin-right: 10px;
        margin-top: 12px;
        float: left;
        font-size: 16px;
        text-align: right;
      }
    }

    .description {
      width: 100%;
      padding-top: 15px;
      .label-title {
        width: 100px;
        text-align: right;
        margin-right: 10px;
      }
      .input-text-area {
        width: calc(100% - 80px);
        textarea {
          width: 505px;
          height: 100px;
        }
      }
    }
    .white_field {
      background-color: #eeffee;
    }
  }
  label {
    width: 100px;
    font-size: 16px;
    text-align: right;
    margin-top: 9px;
    margin-right: 10px;
  }

  .radio-btn label {
    font-size: 16px;
    width: 55px;
    border: solid 1px rgb(206, 212, 218);
    border-radius: 4px;
    padding: 4px 5px;
    text-align: center;
    margin-right: 10px;
  }
  .right-area {
    width: 35%;
    position: relative;
    min-height: 200px;
    .btn-style-1:hover{
      background: rgb(38, 159, 191);
    }
    .confirm-area {
      position: absolute;
      bottom: 0;
      left: 0;
      .select-day {
        .label-title {
          width: 100px;
        }
        input {
          width: calc(100% - 140px);
        }
      }
      .checkbox-label {
        margin-right: 10px;
        width: 100px;
        text-align: right;
        margin-top: 10px;
      }
      .checkbox_area {
        label {
          width: 0;
        }
      }
    }
    .pullbox-title {
      width: 100px;
      font-size: 16px;
    }
    .pullbox-label {
      width: 240px;
      margin-top: 0;
    }
    .pullbox-select {
      width: 240px;
    }
    button {
      width: 310px;
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 30px;
      span {
        color: white;
        font-size: 16px;
        font-weight: 100;
      }
    }
  }
`;
const init_other_facilities_department_datas = [{ id: 0, value: "" }];

const init_other_facilities_doctors = [{ id: 0, value: "" }];

class PatientScheduleModal extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );

    let modal_data = this.props.modal_data;
    let type_date = 0;
    let date = "";
    let time_zone_list = getTimeZoneList();
    let code_master = sessApi.getObjectValue("dial_common_master","code_master");
    var facility_master = sessApi.getObjectValue("dial_common_master","facility_master");
    if (modal_data != null) {
      if (modal_data.schedule_date) {
        type_date = 0;
        date = modal_data.schedule_date;
      } else if (modal_data.schedule_month) {
        var month = "";
        if (modal_data.schedule_month < 10)
          month = "0" + modal_data.schedule_month;
        else month = modal_data.schedule_month;
        date = modal_data.schedule_year + "-" + month;
        type_date = 1;
      } else if (modal_data.schedule_year) {
        date = modal_data.schedule_year + "-01";
        type_date = 2;
      } else {
        type_date = 3;
        date = "";
      }
    }
    this.state = {
      patient_id: modal_data != null ? modal_data.no : this.props.patient_id,
      displayDay: modal_data != null ? modal_data.displayDay : 0,
      planned_date: date != null ? (date != "" ? new Date(date) : "") : "",
      attachDocCheck:
        modal_data != null ? modal_data.require_accompanying_document : 0,
      planned_type: modal_data != null ? modal_data.schedule_type_code : "",
      type_date,
      time_zone: modal_data != null ? modal_data.time_zone : null,
      date_input_disabeld: type_date == 3 ? true : false,
      title: modal_data != null ? modal_data.title : "",
      facility: modal_data != null ? modal_data.facility : "",
      is_note: modal_data != null ? modal_data.checked_by_accompanying : 0,
      is_examine:
        modal_data != null ? modal_data.checked_by_medical_examination : 0,
      is_end: modal_data != null ? modal_data.checked_by_complete : 0,
      block_save: modal_data === null,
      reason_block_save:
        modal_data != null ? "" : "予定種類を選択してください。",
      responsible_staff: modal_data != null ? modal_data.responsible_staff : 0,
      validation_result: {},
      manager_name: "",
      description: modal_data != null ? modal_data.content : "",
      note: modal_data != null ? modal_data.note : "",
      isShowStaffList: false,
      time_zone_list,
      reservedPatientData: code_master["患者予定"],
      reserved_patient_codes: makeList_code(code_master["患者予定"]),
      reserved_patient_codes_options:makeList_codeName(code_master["患者予定"], 1),
      other_facility_options:makeList_data(extract_enabled(facility_master)),
      otherFacilitiesData:makeList_number(facility_master),
      other_facility_number: 0,
      other_facilities_department: 0,
      other_facilities_doctor: 0,
      other_facilities_data: [],
      other_facilities_department_datas: init_other_facilities_department_datas,
      other_facilities_doctors: init_other_facilities_doctors,
      isUpdateConfirmModal: false,
      confirm_alert_title:'',
      check_message:"",
      is_loaded: false,
    };

    const {
      planned_date,
      displayDay,
      time_zone,
      planned_type,
      attachDocCheck,
      facility,
      description,
      note,
      other_facility_number,
      other_facilities_department,
      other_facilities_doctor,
      responsible_staff,
      is_note,
      is_examine,
      is_end,
    } = this.state;
    this.initState = {
      planned_date,
      displayDay,
      type_date,
      time_zone,
      planned_type,
      attachDocCheck,
      facility,
      description,
      note,
      other_facility_number,
      other_facilities_department,
      other_facilities_doctor,
      responsible_staff,
      is_note,
      is_examine,
      is_end,
    };
  }

  async componentDidMount() {
    await this.getStaffs();    
    await this.getOtherFacilitiesDepartmentDatas();
    await this.getOtherFacilitiesDoctors();
    this.changeBackground();
    this.setState({is_loaded: true});
  }
    
  componentDidUpdate () {
    this.changeBackground();
  }

  changeBackground = () => {
    scheduleValidate("patient_schedule", this.state, "background");
  }

  selectTypeDate = (value) => {
    if (value == 3) {
      this.setState({
        type_date: value,
        date_input_disabeld: true,
        planned_date: "",
      });
    } else {
      this.setState({
        type_date: value,
        date_input_disabeld: false,
      });
    }
  };

  selectTimeZone = (value) => {
    this.setState({ time_zone: value });
  };
  setAttachDocCheck = (value) => {
    this.setState({ attachDocCheck: value });
  };
  getPlannedtype = (e) => {
    //表示順
    this.setState({ planned_type: e.target.id });
  };
  getTitle = (e) => {
    this.setState({ title: e.target.value });
  };
  getotherfacility = (e) => {
    this.setState({ facility: e.target.value });
  };
  getDescription = (e) => {
    this.setState({ description: e.target.value });
  };
  getNote = (e) => {
    this.setState({ note: e.target.value });
  };
  getPlannedDate = (value) => {
    this.setState({ planned_date: value });
  };
  getNoteStatus = (name, value) => {
    if (name === "is_note") this.setState({ is_note: value });
  };
  getExamineStatus = (name, value) => {
    if (name === "is_examine") this.setState({ is_examine: value });
  };
  getEndStatus = (name, value) => {
    if (name === "is_end") this.setState({ is_end: value });
  };

  closeModal = () => {
    let isChange = false;
    Object.keys(this.initState).map((k) => {
      if (!isChange && this.initState[k] !== this.state[k]) {
        isChange = true;
      }
    });
    if (isChange) {
      this.setState({
        isOpenMoveOtherPageConfirm: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_alert_title:'入力中',
      });
      var base_modal = document.getElementsByClassName(
        "add-patient-schedule-modal"
      )[0];
      if (base_modal !== undefined && base_modal != null) {
        base_modal.style["z-index"] = 1040;
      }
      return;
    } else {
      this.props.closeModal();
    }
  };

  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      isOpenReplaceConfirmModal: false,
      isOpenRegisterConfirmModal: false,
      showConfirmDeleteMOdal: false,
      confirm_message: "",
      isSearchAddress: false,
      isOpenMoveOtherPageConfirm: false,
      confirm_alert_title:'',
    });
    var base_modal = document.getElementsByClassName(
      "add-patient-schedule-modal"
    )[0];
    if (base_modal !== undefined && base_modal != null) {
      base_modal.style["z-index"] = 1050;
    }
  }

  register = () => {
    if (this.double_click == true) return;
    this.double_click = true;
    let new_patient_schedule = {
      sch_date: formatDateLine(this.state.planned_date),
      sch_code: this.state.planned_type,
      title: this.state.title,
      facility: this.state.facility,
      content: this.state.description,
      note: this.state.note,
      type_date: this.state.type_date,
      time_zone: this.state.time_zone,
      accomplaying: this.state.attachDocCheck,
      checked_by_accompanying: this.state.is_note,
      checked_by_complete: this.state.is_end,
      checked_by_medical_examination: this.state.is_examine,
      responsible_staff: this.state.responsible_staff,
    };
    if (this.props.modal_data != null) {
      new_patient_schedule.number = this.props.modal_data.schedule_number;
    }
    this.double_click = false;
    this.props.saveData(new_patient_schedule);
  };

  saveData = () => {
    let isChange = false;
    Object.keys(this.initState).map((k) => {
      if (!isChange && this.initState[k] !== this.state[k]) {
        isChange = true;
      }
    });
    if(!isChange){
      return;
    }
    let validate_data = scheduleValidate("patient_schedule", this.state);
    if (validate_data['error_str_arr'].length > 0 ) {
        this.setState({
          check_message:validate_data['error_str_arr'].join('\n'),
          first_tag_id:validate_data['first_tag_id']
        });
        return;
    }
    this.setState({
      isUpdateConfirmModal: true,
      confirm_message:
        this.props.modal_data != undefined && this.props.modal_data != null
          ? "変更しますか？"
          : "登録しますか？",
    });
    var base_modal = document.getElementsByClassName(
      "add-patient-schedule-modal"
    )[0];
    if (base_modal !== undefined && base_modal != null) {
      base_modal.style["z-index"] = 1040;
    }
  };

  closeAlertModal = () => {
    this.setState({check_message: ''});
    $("#" + this.state.first_tag_id).focus();
  }

  showStaffList = (e) => {

    // ■DN601 入力者関連のラベルのカーソルの統一
    if (e != undefined && (e.target.type == undefined || e.target.type != "text")) return;
    
    this.setState({ isShowStaffList: true });
  };

  selectStaff = (staff) => {
    this.setState({ responsible_staff: staff.number });
    this.closeDoctorSelectModal();
  };

  setselfstaff = () => {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let user_number = authInfo.user_number;
    this.setState({ responsible_staff: user_number });
  };

  closeDoctorSelectModal = () => {
    this.setState({
      isShowStaffList: false,
    });
  };

  getOtherFacilitiesDepartment = (e) => {
    this.setState({
      other_facilities_department: parseInt(e.target.id),
    });
  };

  getOtherFacilitiesDoctors = async (
    other_facility_number = undefined,
    other_facilities_department = undefined
  ) => {
    let path = "/app/api/v2/dial/master/other_facilities_doctor_search";
    let post_data = {
      other_facilities_number: other_facility_number,
      other_facilities_department_number: other_facilities_department,
      is_enabled: 1,
      order:'sort_number'
    };
    let { data } = await axios.post(path, { params: post_data });
    let doctor_datas = [{ id: 0, value: "" }];

    data.map((item, index) => {
      let doctor_info = { id: item.number, value: item.name };
      doctor_datas[index + 1] = doctor_info;
    });
    this.setState({ other_facilities_doctors: doctor_datas });
  };

  getOtherFacilitiesDoctor = (e) => {
    this.setState({
      other_facilities_doctor: parseInt(e.target.id),
    });
  };

  getOtherFacilityName = (e) => {
    this.setState({
      other_facility_number: parseInt(e.target.id),
    });
  };

  getOtherFacilitiesDepartmentDatas = async (
    other_facility_number = undefined
  ) => {
    let path = "/app/api/v2/dial/master/other_facilities_department_search";
    let post_data = {
      other_facilities_number: other_facility_number,
      is_enabled: 1,
      order:'sort_number',
    };
    let { data } = await axios.post(path, { params: post_data });
    let department_datas = init_other_facilities_department_datas;
    data.map((item, index) => {
      let department_info = { id: item.number, value: item.name };
      department_datas[index + 1] = department_info;
    });
    this.setState({
      other_facilities_department_datas: department_datas,
    });
  };

  addFacility = () => {
    let {
      otherFacilitiesData,
      other_facilities_department_datas,
      other_facilities_doctors,
    } = this.state;
    let facility = "";
    if (this.state.other_facility_number > 0 && otherFacilitiesData != null) {
      facility =
        facility + " " + otherFacilitiesData[this.state.other_facility_number];
    }
    if (
      this.state.other_facilities_department > 0 &&
      other_facilities_department_datas != null &&
      other_facilities_department_datas.length > 0
    ) {
      facility =
        facility +
        " " +
        other_facilities_department_datas.find(
          (x) => x.id === this.state.other_facilities_department
        ).value;
    }
    if (
      this.state.other_facilities_doctor > 0 &&
      other_facilities_doctors != null &&
      other_facilities_doctors.length > 0
    ) {
      facility =
        facility +
        " " +
        other_facilities_doctors.find(
          (x) => x.id === this.state.other_facilities_doctor
        ).value;
    }
    this.setState({ facility });
  };

  onHide = () => {};

  render() {
    let reserved_patient_codes_options = this.state.reserved_patient_codes_options;
    let {
      time_zone_list,
      // otherFacilitiesData,
      other_facilities_department_datas,
      other_facilities_doctors,
    } = this.state;
    var display_day = ["年月日", "年月", "年", "未定"];
    var attach_doc_check = ["要", "不要", "未定"];
    var display_format = ["yyyy年MM月dd日", "yyyy年MM月", "yyyy年"];
    let isChange = false;
    Object.keys(this.initState).map((k) => {
      if (!isChange && this.initState[k] !== this.state[k]) {
        isChange = true;
      }
    });
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        id="add_contact_dlg"
        className="master-modal add-patient-schedule-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>
            患者予定・他科受診{this.props.modal_data !== null ? "変更" : "登録"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.is_loaded ? (
            <Wrapper>
              <div className="patient_info">
                {this.props.patient_number} : {this.props.patient_name}
              </div>
              <div className="flex">
                <div className="left-area">
                  <div className="flex">
                    <div className="select-day">
                      <InputWithLabel
                        label="日付"
                        type="date"
                        isDisabled={this.state.date_input_disabeld}
                        getInputText={this.getPlannedDate.bind(this)}
                        diseaseEditData={this.state.planned_date}
                        dateFormat={display_format[this.state.type_date]}
                      />
                    </div>
                    <div className="display-day">
                      <label className="display-day-label">日付表示</label>
                      <>
                        {display_day.map((item, key) => {
                          return (
                            <>
                              <RadioButton
                                id={`display_day_${key}`}
                                value={item}
                                label={item}
                                name="display_day"
                                getUsage={this.selectTypeDate.bind(this, key)}
                                checked={this.state.type_date === key}
                              />
                            </>
                          );
                        })}
                      </>
                    </div>
                  </div>
                  <div className="time-zone-area">
                    <label className="time-zone-label">時間帯</label>
                    <>
                      {time_zone_list.map((item) => {
                        return (
                          <>
                            <RadioButton
                              id={`time_zones_${item.id}`}
                              value={item.id}
                              label={item.value}
                              name="time_zones"
                              getUsage={this.selectTimeZone.bind(this, item.id)}
                              checked={this.state.time_zone === item.id}
                            />
                          </>
                        );
                      })}
                      <RadioButton
                        id={`time_zones_none`}
                        value="未定"
                        label="未定"
                        name="time_zones"
                        getUsage={this.selectTimeZone.bind(this, null)}
                        checked={this.state.time_zone === null}
                      />
                    </>
                  </div>
                  <div className="flex">
                    <div className="area_planned_type_id select-day">
                      <SelectorWithLabel
                        tooltip={
                          this.state.validation_result.planned_type
                            ? this.state.validation_result.planned_type.error_str
                            : ""
                        }
                        id="planned_type_id"
                        options={reserved_patient_codes_options}
                        title="予定種類"
                        getSelect={this.getPlannedtype}
                        departmentEditCode={this.state.planned_type}
                      />
                    </div>
                    <div className="attach_doc_check">
                      <label className="attach_doc_check-label">添書要否</label>
                      <>
                        {attach_doc_check.map((item, key) => {
                          return (
                            <>
                              <RadioButton
                                id={`attach_doc_check_${key}`}
                                value={item}
                                label={item}
                                name="attach_doc_check"
                                getUsage={this.setAttachDocCheck.bind(this, key)}
                                checked={
                                  this.state.attachDocCheck === key ? true : false
                                }
                              />
                            </>
                          );
                        })}
                      </>
                    </div>
                  </div>
                  {/* <div className="flex">
                            <div className="input-title">
                                <InputWithLabel
                                    label="タイトル"
                                    type="text"
                                    getInputText={this.getTitle.bind(this)}
                                    diseaseEditData={this.state.title}
                                />
                            </div>
                        </div> */}
                  <div className="flex">
                    <div className="area_facility_id input-title">
                      <InputWithLabelBorder
                        tooltip={
                          this.state.validation_result.facility
                            ? this.state.validation_result.facility.error_str
                            : ""
                        }
                        label="施設等"
                        type="text"
                        // tooltip={this.state.validation_result.facility ? this.state.validation_result.facility.error_str : ''}
                        id="facility_id"
                        getInputText={this.getotherfacility.bind(this)}
                        diseaseEditData={this.state.facility}
                      />
                    </div>
                  </div>
                  <div className="description flex">
                    <div className="area_description_id input-text-area">
                      <TextareaWithLabelBorder
                        tooltip={
                          this.state.validation_result.description
                            ? this.state.validation_result.description.error_str
                            : ""
                        }
                        label="内容"
                        id="description_id"
                        onChange={this.getDescription.bind(this)}
                        value={this.state.description}
                        className="required-text-area"
                      />
                    </div>
                  </div>
                  <div className="description flex">
                    <div className="area_note_id input-text-area">
                      <TextareaWithLabelBorder
                        tooltip={
                          this.state.validation_result.note
                            ? this.state.validation_result.note.error_str
                            : ""
                        }
                        label="備考"
                        id="note_id"
                        onChange={this.getNote.bind(this)}
                        value={this.state.note}
                        className="required-text-area"
                      />
                    </div>
                  </div>
                </div>
                <div className="right-area">
                  <div className="mt-5 mb-2">他施設マスタから選択</div>
                  <SelectorWithLabel
                    options={this.state.other_facility_options}
                    title="施設"
                    getSelect={this.getOtherFacilityName.bind(this)}
                    departmentEditCode={this.state.other_facility_number}
                  />
                  <SelectorWithLabel
                    title="診療科"
                    options={other_facilities_department_datas}
                    getSelect={this.getOtherFacilitiesDepartment}
                    departmentEditCode={this.state.other_facilities_department}
                  />
                  <SelectorWithLabel
                    title="担当医"
                    options={other_facilities_doctors}
                    getSelect={this.getOtherFacilitiesDoctor}
                    departmentEditCode={this.state.other_facilities_doctor}
                  />
                  <Button className="btn-style-1" onClick={this.addFacility}>
                    ≪施設欄に胋付け
                  </Button>
                  <div className="confirm-area">
                    <div
                      className="entry_name select-day staff-div remove-x-input cursor-input"
                      onClick={(e)=>this.showStaffList(e).bind(this)}
                    >
                      <InputWithLabel
                        label="担当者"
                        type="text"
                        isDisabled={true}
                        diseaseEditData={
                          this.state.responsible_staff > 0 &&
                          this.state.staff_list_by_number != undefined &&
                          this.state.staff_list_by_number[
                            this.state.responsible_staff
                            ] != undefined &&
                          this.state.staff_list_by_number[
                            this.state.responsible_staff
                            ] != null
                            ? this.state.staff_list_by_number[
                              this.state.responsible_staff
                              ]
                            : ""
                        }
                      />
                    </div>
                    <Button className="btn-style-1" onClick={this.setselfstaff}>
                      自分を担当にする
                    </Button>
                    <div className="flex">
                      <div className="checkbox-label">添書確認</div>
                      <div className="checkbox_area">
                        <Checkbox
                          label=""
                          getRadio={this.getNoteStatus.bind(this)}
                          value={this.state.is_note}
                          checked={this.state.is_note === 1}
                          name="is_note"
                        />
                      </div>
                    </div>
                    <div className="flex">
                      <div className="checkbox-label">診察確認</div>
                      <div className="checkbox_area">
                        <Checkbox
                          label=""
                          getRadio={this.getExamineStatus.bind(this)}
                          value={this.state.is_examine}
                          checked={this.state.is_examine === 1}
                          name="is_examine"
                        />
                      </div>
                    </div>
                    <div className="flex">
                      <div className="checkbox-label">完了確認</div>
                      <div className="checkbox_area">
                        <Checkbox
                          label=""
                          getRadio={this.getEndStatus.bind(this)}
                          value={this.state.is_end}
                          checked={this.state.is_end === 1}
                          name="is_end"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {this.state.isShowStaffList && (
                <DialSelectMasterModal
                  selectMaster={this.selectStaff}
                  closeModal={this.closeDoctorSelectModal}
                  MasterCodeData={this.state.staffs}
                  MasterName="スタッフ"
                />
              )}
            </Wrapper>
          ):(
            <SpinnerWrapper>
              <Spinner animation="border" variant="secondary"/>
            </SpinnerWrapper>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
          <Button
            className={isChange ? "red-btn" : "disable-btn"}
            onClick={this.saveData}
          >
            {this.props.modal_data !== null ? "変更" : "登録"}
          </Button>
        </Modal.Footer>
        {this.state.isOpenMoveOtherPageConfirm && (
          <SystemConfirmJapanModal
            confirmCancel={() => {
              this.setState({
                isOpenMoveOtherPageConfirm: false,
                confirm_alert_title:'',
              });
            }}
            confirmOk={() => {
              this.props.closeModal();
            }}
            confirmTitle={this.state.confirm_message}
            title = {this.state.confirm_alert_title}
          />
        )}
        {this.state.isUpdateConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.register.bind(this)}
            confirmTitle={this.state.confirm_message}
          />
        )}
        {this.state.check_message != "" && (
          <ValidateAlertModal
            handleOk={this.closeAlertModal}
            alert_meassage={this.state.check_message}
          />
        )}
      </Modal>
    );
  }
}

PatientScheduleModal.contextType = Context;

PatientScheduleModal.propTypes = {
  patient_id: PropTypes.number,
  patient_name: PropTypes.string,
  row_index: PropTypes.number,
  modal_data: PropTypes.object,
  closeModal: PropTypes.func,  
  saveData: PropTypes.func,
  patient_number: PropTypes.string,
};

export default PatientScheduleModal;
