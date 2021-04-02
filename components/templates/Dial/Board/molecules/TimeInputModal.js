import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import InputWithLabel from "../../../../molecules/InputWithLabel";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import UpDownTimeset from "~/components/organisms/UpDownTimeset";
import { formatTime, formatTimePicker } from "../../../../../helpers/date";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import * as methods from "~/components/templates/Dial/DialMethods";
import {CACHE_SESSIONNAMES, getServerTime} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  width: 100%;
  height: 100%;
  flex-direction: column;
  display: flex;
  text-align: center;
  button {
    margin-left: auto;
    margin-right: auto;
  }
  input {
    height: 30px;
  }
  label {
    font-size: 16px;
    margin-top: 0;
  }
  .react-datepicker-wrapper {
    margin: 10px auto;
    input {
      font-size: 18px;
    }
  }
  .footer {
    display: flex;
    margin-left: 40px;
    margin-top: 40px !important;
    text-align: center;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 10px !important;
      margin-left: 10px !important;
      background: #3374eb;
    }
    span {
      width: 180px;
      color: white;
      font-size: 20px;
      font-weight: 100;
    }
    button:hover {
      background: #3374ab;
    }
    .disable-btn {
      background: lightgray;
      span {
        color: rgb(84, 84, 84);
      }
    }
    .disable-btn:hover {
      background: lightgray !important;
    }
  }
  .time-area {
    margin: 30px auto;
  }
  .btn-set {
    width: 280px;
  }

  .hvMNwk {
    .label-title {
      width: 140px;
      line-height: 2.5;
    }
    input {
      height: 50px;
      text-align: left;
      font-size: 30px;
      width: 270px;
      background: #c1e6f4;
      border: 1px solid #aaa;
    }
  }
`;

class TimeInputModal extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let schedule_data = sessApi.getObjectValue(
      CACHE_SESSIONNAMES.DIAL_BOARD,
      "schedule_data"
    );
    this.state = {
      start_staff_name:
        schedule_data != undefined ? schedule_data.start_staff_name : "",
      start_staff_number:
        schedule_data != undefined && schedule_data.start_staff != null && schedule_data.start_staff != '' ? schedule_data.start_staff : authInfo.user_number,
      end_staff_name:
        schedule_data != undefined ? schedule_data.end_staff_name : "",
      puncture_staff_name:
        schedule_data != undefined ? schedule_data.puncture_staff_name : "",
      puncture_staff_number:
        schedule_data != undefined && schedule_data.puncture_staff != null
          ? schedule_data.puncture_staff
          : authInfo.user_number,
      is_start: this.props.title === "透析開始時刻設定",
      time_value: "",
      hour_one: "",
      hour_two: "",
      min_one: "",
      min_two: "",
      time_h_m: "00:00",
      isShowStaffList: false,
      isBackConfirmModal: false,
      isConfirmTimeModal: false,
      confirm_message: "",
      confirm_alert_title:'',
      schedule_data,
      change_flag: false,
      is_loaded: false,
      is_started:
        (schedule_data.console_start_date !== undefined &&
          schedule_data.console_start_date != null) ||
        (schedule_data.start_date !== undefined &&
          schedule_data.start_date != null)
          ? 1
          : 0,
    };
    this.change_flag = false;
  }

  async componentDidMount () {
    await this.getStaffs();
    let server_time = await getServerTime();
    let time_now = new Date(server_time);
    let time_hours = time_now.getHours();
    let time_mins = time_now.getMinutes();
    let state_data = {};
    state_data['hour_one'] = parseInt(time_hours/10);
    state_data['hour_two'] = time_hours % 10;
    state_data['min_one'] = parseInt(time_mins/10);
    state_data['min_two'] = time_mins % 10;
    let schedule_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_data");
    
    if (schedule_data != undefined && schedule_data.console_start_date != undefined && schedule_data.console_start_date != null && this.state.is_start) {
      state_data['time_value'] = formatTimePicker(schedule_data.console_start_date.split(" ")[1]);
      state_data['time_h_m'] = schedule_data.console_start_date.split(" ")[1];
      state_data['hour_one'] = parseInt(schedule_data.console_start_date.split(" ")[1].substring(0, 1));
      state_data['hour_two'] = parseInt(schedule_data.console_start_date.split(" ")[1].substring(1, 2));
      state_data['min_one'] = parseInt(schedule_data.console_start_date.split(" ")[1].substring(3, 4));
      state_data['min_two'] = parseInt(schedule_data.console_start_date.split(" ")[1].substring(4, 5));
    }
    if (schedule_data != undefined && schedule_data.start_date != undefined && schedule_data.start_date != null && this.state.is_start) {
      state_data['time_value'] = formatTimePicker(schedule_data.start_date.split(" ")[1]);
      state_data['time_h_m'] = schedule_data.start_date.split(" ")[1];
      state_data['hour_one'] = parseInt(schedule_data.start_date.split(" ")[1].substring(0, 1));
      state_data['hour_two'] = parseInt(schedule_data.start_date.split(" ")[1].substring(1, 2));
      state_data['min_one'] = parseInt(schedule_data.start_date.split(" ")[1].substring(3, 4));
      state_data['min_two'] = parseInt(schedule_data.start_date.split(" ")[1].substring(4, 5));
    } else if (schedule_data != undefined &&schedule_data.end_date != undefined &&schedule_data.end_date != null && !this.state.is_start) {
      state_data['time_value'] = formatTimePicker(schedule_data.end_date.split(" ")[1]);
      state_data['time_h_m'] = schedule_data.end_date.split(" ")[1];
      state_data['hour_one'] = parseInt(schedule_data.end_date.split(" ")[1].substring(0, 1));
      state_data['hour_two'] = parseInt(schedule_data.end_date.split(" ")[1].substring(1, 2));
      state_data['min_one'] = parseInt(schedule_data.end_date.split(" ")[1].substring(3, 4));
      state_data['min_two'] = parseInt(schedule_data.end_date.split(" ")[1].substring(4, 5));
    }
    state_data['is_loaded'] = true;
    this.setState(state_data);
  }
  
  confirmCancel = () => {
    this.setState({
      isBackConfirmModal: false,
      isShowStaffList: false,
      isConfirmTimeModal: false,
      confirm_message: "",
      confirm_alert_title:''
    });
  }

  register = () => {
    if (!this.state.is_loaded) return;
    if (sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "all_check") !== 1) {
      return;
    }
    let schedule_data = sessApi.getObjectValue(
      CACHE_SESSIONNAMES.DIAL_BOARD,
      "schedule_data"
    );
    if (this.state.is_start) {
      if (
        (schedule_data.console_start_date !== undefined &&
          schedule_data.console_start_date != null) ||
        (schedule_data.start_date !== undefined &&
          schedule_data.start_date != null)
      ) {
        this.setState({
          isConfirmTimeModal: true,
          confirm_message: "開始時刻を変更しますか？",
        });
        return;
      }
    } else {
      if ((schedule_data.end_date !== undefined && schedule_data.end_date != null)) {
        this.setState({
          isConfirmTimeModal: true,
          confirm_message: "終了時刻を変更しますか？",
        });
        return;
      }
    }
    this.registerTime();
  };

  registerTime = () => {
    if (sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "all_check") !== 1) {
      return;
    }
    if (this.state.is_start == 0 && this.state.is_started == 0) {
      return;
    }
    let regist_time =
      this.state.hour_one.toString() +
      this.state.hour_two.toString() +
      ":" +
      this.state.min_one.toString() +
      this.state.min_two.toString();
    // this.props.handleModal(formatTime(this.state.time_value), this.state.is_start, this.state.puncture_staff_number);
    this.props.handleModal(regist_time,this.state.is_start,this.state.puncture_staff_number,this.state.start_staff_number);    
  };

  selectCurTime =async() => {
    let server_time = await getServerTime();
    this.setState({
      time_value: new Date(server_time),
      time_h_m: formatTime(new Date(server_time)),
      hour_one: parseInt(formatTime(new Date(server_time)).substring(0, 1)),
      hour_two: parseInt(formatTime(new Date(server_time)).substring(1, 2)),
      min_one: parseInt(formatTime(new Date(server_time)).substring(3, 4)),
      min_two: parseInt(formatTime(new Date(server_time)).substring(4, 5)),
    });
    this.change_flag = true;
  };

  onChange = (value) => {
    this.setState({ time_value: value });
  };

  closeModal = () => {
    this.setState({ isShowStaffList: false });
  };

  selectStaff = (staff) => {
    if (this.state.staff_key == "puncture_staff") {
      this.setState({
        puncture_staff_name: staff.name,
        puncture_staff_number: staff.number,
        isShowStaffList: false,
      });
    } else {
      
      this.setState({
        start_staff_name: staff.name,
        start_staff_number: staff.number,
        isShowStaffList: false,
      });
    }
    this.change_flag = true;
  };

  openStaffModal = (e, staff_key) => {
    
    // ■DN601 入力者関連のラベルのカーソルの統一
    if (e != undefined && (e.target.type == undefined || e.target.type != "text")) return;

    if (staff_key == "start_staff"){
      let schedule_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_data");
      if (schedule_data.start_staff != null && schedule_data.start_staff != "") return;
    }
    this.setState({
      isShowStaffList: true,
      staff_key,
    });
  };

  updateTime = (type, post) => {
    if (type == "hour_first") {
      this.setState({
        hour_one: post,
      });
    }
    if (type == "hour_second") {
      this.setState({
        hour_two: post,
      });
    }
    if (type == "min_first") {
      this.setState({
        min_one: post,
      });
    }
    if (type == "hour_min") {
      this.setState({
        hour_one: post.hour_first,
        hour_two: post.hour_second,
        min_one: post.min_first,
        min_two: post.min_second,
      });
    }
    this.change_flag = true;
  };
  closeConfirmModal = () => {
    this.confirmCancel();
    this.props.closeModal(true);
  };
  closeModal = () => {
    if (this.change_flag) {
      this.setState({
        isBackConfirmModal: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_alert_title:'入力中'
      });
    } else {
      this.props.closeModal();
    }
  };

  render() {
    let tooltip = "";
    if (sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "all_check") !== 1) {
      tooltip = "開始前確認をチェックしてください。";
    }
    if (this.state.is_start == 0 && this.state.is_started == 0) {
      tooltip = "スケジュールを開始してください。";
    }
    if (!this.state.is_loaded) {
      tooltip = "時刻処理中";
    }
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let { start_staff_name, puncture_staff_name, end_staff_name } = this.state;
  
    let start_disable = false;
    let schedule_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_data");
    if (schedule_data.start_staff != null && schedule_data.start_staff != "") start_disable = true;
    
    return (
      <Modal
        show={true}
        id="add_contact_dlg"
        className="master-modal staff-time-modal modal-w-700 first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            {this.state.is_start ? (
              <>
              <div className={start_disable ? 'remove-x-input' : 'remove-x-input cursor-input'} onClick={(e)=>this.openStaffModal(e, "start_staff").bind(this)}>
                <InputWithLabel
                  label="開始スタッフ"
                  isDisabled={true}
                  type="text"
                  className="kana_area"
                  diseaseEditData={
                    start_staff_name != "" ? start_staff_name : authInfo.name
                  }
                  readonly
                />
              </div>
                <div className="remove-x-input cursor-input" onClick={(e)=>this.openStaffModal(e, "puncture_staff").bind(this)}>
                  <InputWithLabel
                    label="穿刺スタッフ"
                    isDisabled={true}
                    type="text"
                    diseaseEditData={
                      puncture_staff_name != ""
                        ? puncture_staff_name
                        : authInfo.name
                    }
                    readonly
                  />
                </div>
              </>
            ) : (
              <InputWithLabel
                label="終了スタッフ"
                type="text"
                isDisabled={true}
                className="kana_area"
                diseaseEditData={
                  end_staff_name != "" ? end_staff_name : authInfo.name
                }
                readonly
              />
            )}
            <div className="time-area">
              <UpDownTimeset
                selected={this.state.time_h_m}
                hour_one={this.state.hour_one}
                hour_two={this.state.hour_two}
                min_one={this.state.min_one}
                min_two={this.state.min_two}
                updateTime={this.updateTime}
              />
            </div>
            <button className="btn-set" onClick={this.selectCurTime} style={{ fontSize: 18 }}>
              <span>現在の時刻を設定</span>
            </button>
            {this.state.isShowStaffList && (
              <DialSelectMasterModal
                selectMaster={this.selectStaff}
                closeModal={this.confirmCancel}
                MasterCodeData={this.state.staffs}
                MasterName="スタッフ"
              />
            )}
          </Wrapper>
        </Modal.Body>
        {this.state.isConfirmTimeModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.registerTime.bind(this)}
            confirmTitle={this.state.confirm_message}
          />
        )}
        {this.state.isBackConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.closeConfirmModal}
            confirmTitle={this.state.confirm_message}
            title = {this.state.confirm_alert_title}
          />
        )}
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
          <Button onClick={this.register} tooltip={tooltip} className={tooltip != "" ? "disable-btn" : "red-btn"}>登録</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

TimeInputModal.contextType = Context;

TimeInputModal.propTypes = {
  closeModal: PropTypes.func,
  handleModal: PropTypes.func,
  title: PropTypes.string,
  is_started:PropTypes.number
};

export default TimeInputModal;
