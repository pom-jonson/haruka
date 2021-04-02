import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import InputWithLabel from "../../../../molecules/InputWithLabel";
import NumericInputWithUnitLabel from "../../../../molecules/NumericInputWithUnitLabel";
import { formatDateTimeStr, formatTime } from "../../../../../helpers/date";
import DatePicker from "react-datepicker";
import { CACHE_SESSIONNAMES, getServerTime} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import ValidateAlertModal from '~/components/molecules/ValidateAlertModal';
import {
  addRedBorder,
  addRequiredBg,
  removeRequiredBg,
  removeRedBorder,
  toHalfWidthOnlyNumber
} from '~/helpers/dialConstants';
import $ from 'jquery';

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 18px;
  width: 100%;
  height: 100%;
  flex-direction: column;
  display: flex;
  text-align: center;
  width: 100px;
  text-align: right;
  button {
    margin-left: auto;
    margin-right: auto;
  }
  input {
    height: 35px;
    width: 250px !important;
  }
  label {
    font-size: 18px !important;
    width: 180px !important;
  }
  .picker {
    margin: 10px auto;
  }
  .dKLdmM {
    margin-left: 7px;
  }
  .input-time {
    margin-top: 10px;
    display: flex;
    label {
      width: 80px;
      font-size: 18px;
    }
    .react-datepicker-wrapper {
      margin-left: 10px;
    }
  }
  .footer {
    display: flex;
    margin-left: 190px;
    margin-top: 10px;
    text-align: center;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 10px;
      min-width: 100px;
    }
    span {
      color: white;
      font-size: 20px;
      font-weight: 100;
    }
  }
`;

class BloodInputModal extends Component {
  constructor(props) {
    super(props);
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
    let dial_timezone = JSON.parse(window.sessionStorage.getItem("init_status"))
      .dial_timezone["timezone"];
    let base_value =
      dial_timezone != undefined &&
      dial_timezone != null &&
      dial_timezone[1] != undefined &&
      dial_timezone["1"] != null &&
      dial_timezone[1]["start"] != null &&
      dial_timezone[1]["start"] != ""
        ? dial_timezone[1]["start"]
        : "08:00";
    var base_hour = base_value.split(":")[0];
    var base_mins = base_value.split(":")[1];

    this.base_time_object = new Date(schedule_date);
    this.base_time_object.setHours(parseInt(base_hour));
    this.base_time_object.setMinutes(parseInt(base_mins));
    
    this.state = {      
      is_Blood: this.props.title === "血圧入力",
      staff_name: authInfo.name,
      pressure_max: "",
      pressure_min: "",
      pulse: "",
      temperature: 36.5,
      isBackConfirmModal: false,
      isRegisterConfirmModal: false,
      tempTemperature: {},
      confirm_message: "",
      confirm_alert_title:'',
      alert_message: '',
    };
    this.change_flag = false;
  }

  async componentDidMount(){
    let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
    let server_time = await getServerTime();
    var cur_time = new Date(schedule_date);
    var now = new Date(server_time);
    cur_time.setHours(now.getHours());
    cur_time.setMinutes(now.getMinutes());
    cur_time.setSeconds(0);

    if (this.base_time_object.getTime() > cur_time.getTime()) {
      cur_time.setDate(cur_time.getDate() + 1);
    }
    this.setState({cur_time});
  }

  register = () => {
    var cur_time = this.state.cur_time;
    if (this.state.is_Blood) {
      if (this.state.pressure_max === "") {
        window.sessionStorage.setItem(
          "alert_messages",
          "血圧高を入力してください。"
        );
        return;
      }
      if (
        this.state.pressure_max !== "" &&
        isNaN(parseFloat(this.state.pressure_max))
      ) {
        window.sessionStorage.setItem(
          "alert_messages",
          "血圧高を数字で入力してください。"
        );
        return;
      }
      if (this.state.pressure_min === "") {
        window.sessionStorage.setItem(
          "alert_messages",
          "血圧低を入力してください。"
        );
        return;
      }
      if (
        this.state.pressure_min !== "" &&
        isNaN(parseFloat(this.state.pressure_min))
      ) {
        window.sessionStorage.setItem(
          "alert_messages",
          "血圧低を数字で入力してください。"
        );
        return;
      }
      if (this.state.pulse === "") {
        window.sessionStorage.setItem(
          "alert_messages",
          "脈拍を入力してください。"
        );
        return;
      }
      if (this.state.pulse !== "" && isNaN(parseFloat(this.state.pulse))) {
        window.sessionStorage.setItem(
          "alert_messages",
          "脈拍を数字で入力してください。"
        );
        return;
      }
      let blood = {
        input_time: formatDateTimeStr(cur_time),
        staff: this.state.staff_name,
        bp_pressure_max: this.state.pressure_max ? this.state.pressure_max : "",
        bp_pressure_min: this.state.pressure_min ? this.state.pressure_min : "",
        bp_pulse: this.state.pulse ? this.state.pulse : "",
        is_enabled: 1,
      };
      this.props.handleModal(blood, this.state.is_Blood);
    } else {
      let error_str_array = [];
      let first_tag_id = '';
      removeRedBorder('temperature_id');
      if (this.state.temperature == "") {
        error_str_array.push("体温を入力してください。");
        first_tag_id = 'temperature_id';
        addRedBorder('temperature_id');
      } else if (this.state.temperature != "" && this.state.temperature < 34) {
        error_str_array.push("体温を34℃以上で入力してください。");
        first_tag_id = 'temperature_id';
        addRedBorder('temperature_id');
      } else if (this.state.temperature != "" && this.state.temperature > 43) {
        error_str_array.push("体温を43℃以下で入力してください。");
        first_tag_id = 'temperature_id';
        addRedBorder('temperature_id');
      }
      if (first_tag_id != "") {
        this.setState({ first_tag_id: first_tag_id });
      }
      if (error_str_array.length > 0) {
        this.setState({ alert_message: error_str_array.join('\n') })
        return;
      }
      let temperature = {
        input_time: formatDateTimeStr(cur_time),
        staff: this.state.staff_name,
        temperature: this.state.temperature ? this.state.temperature : "",
      };

      this.setState({
        isRegisterConfirmModal: true,
        confirm_message: "体温を登録しますか？",
        confirm_alert_title:'登録確認',
        tempTemperature: temperature
      });      
    }
  };
  componentDidUpdate () {
    this.changeBackground();
  }
  changeBackground = () => {
    if (this.state.temperature == '') {
      addRequiredBg("temperature_id");
    } else {
      removeRequiredBg("temperature_id");
    }
  }
  closeAlertModal = () => {
    this.setState({alert_message: ''});
    if(this.state.first_tag_id  != ''){
      let first_tag_id = this.state.first_tag_id;
      $("#" + first_tag_id).focus();
    }
  }

  insertStrTimeStyle=(input)=>{
    return input.slice(0, 2) + ':' + input.slice(2,input.length);
  }

  timeKeyEvent = (e) => {    
    var start_pos = e.target.selectionStart;
    var end_pos = e.target.selectionEnd;
    var key_code = e.keyCode;    
    this.key_code = key_code;
    this.start_pos = start_pos;
    var obj = document.getElementById('input_time_id');

    let input_value = e.target.value;    
    
    if (start_pos == end_pos) {
      if (key_code == 37 && start_pos == 3){
        e.target.setSelectionRange(start_pos-1, start_pos-1);
      }
      if (key_code == 39 && start_pos == 2){
        e.target.setSelectionRange(start_pos+1, start_pos+1);
      }
    }

    input_value = input_value.replace(/[^0-9０-９]/g, '');
    if (input_value.length > 4) return;
    input_value = toHalfWidthOnlyNumber(input_value);

    if(input_value.length >= 2 ){
      input_value = this.insertStrTimeStyle(input_value);
    }
    if (key_code == 9) {
      this.setTime(e);
      return;
    }
    
    if (key_code == 8){          
      if (input_value.length == 1 && start_pos == 1 && start_pos == end_pos){
        this.setState({input_time_value:''}, () => {
          obj.setSelectionRange(0, 0);
        })
        e.preventDefault();
      }
      if (input_value.length == 3 && start_pos == 1 && start_pos == end_pos){
        input_value = input_value.slice(1.2);
        this.setState({input_time_value:input_value}, () => {
          obj.setSelectionRange(0,0);
        });
        e.preventDefault();
      }
      if (start_pos == end_pos && start_pos == 3){        
        input_value = input_value.slice(0,1) + input_value.slice(3, input_value.length);        
        this.setState({
          input_time_value:input_value,
        }, () => {
          obj.setSelectionRange(1, 1);
        })
        e.preventDefault();
      }
      
      if (start_pos != end_pos){        
        input_value = input_value.slice(0, start_pos) + input_value.slice(end_pos, input_value.length);
        this.setState({
          input_time_value:input_value,
        }, () => {
          obj.setSelectionRange(start_pos, start_pos);
        })
        e.preventDefault();
      }
    }
    if (key_code == 46){
      if (start_pos != end_pos){        
        input_value = input_value.slice(0, start_pos) + input_value.slice(end_pos, input_value.length);
        this.setState({
          input_time_value:input_value,
        }, () => {
          obj.setSelectionRange(start_pos, start_pos);
        })
        e.preventDefault();
      }
      if (input_value.length == 1 && start_pos == 0 && start_pos == end_pos){        
        this.setState({input_time_value:''}, () => {
          obj.setSelectionRange(0, 0);
        })
        e.preventDefault();
      }
      if (start_pos == end_pos && input_value.length == 3){
        if (start_pos == 0){          
          this.setState({
            input_time_value:input_value.slice(1,2),            
          }, () => {
            obj.setSelectionRange(0, 0);
          })
          e.preventDefault();
        }
        if (start_pos == 1){          
          this.setState({
            input_time_value:input_value.slice(0,1),            
          }, () => {
            obj.setSelectionRange(1, 1);
          })
          e.preventDefault();
        }
      }
    }    
    if (key_code != 8 && key_code != 46){
      this.setState({
        input_time_value:input_value,
      })
    }
  }

  setTime = (e) => {        
    if (e.target.value.length != 5) {
      this.setState({
        cur_time:'',
        input_time_value:undefined
      })
      this.change_flag = true;
      return;
    }
    var input_value = e.target.value;
    var hours = input_value.split(':')[0];
    var mins = input_value.split(':')[1];
    if (hours > 23 || mins > 60){
      this.setState({
        cur_time:'',
        input_time_value:undefined
      })      
      return;
    }
    let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
    var value_time_object = new Date(schedule_date);

    value_time_object.setMinutes(mins);
    value_time_object.setHours(hours);
    if (this.base_time_object.getTime() > value_time_object.getTime()) {
      value_time_object.setDate(value_time_object.getDate() + 1);
    }

    this.setState({cur_time:value_time_object})
    this.change_flag = true;
  }

  getInputTime = (value, e) => {
    let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
    var value_time_object = new Date(schedule_date);      
    if (e == undefined){
      value_time_object.setMinutes(value.getMinutes());
      value_time_object.setHours(value.getHours());
      if (this.base_time_object.getTime() > value_time_object.getTime()) {
        value_time_object.setDate(value_time_object.getDate() + 1);
      }
      this.setState({
        cur_time:value_time_object,
        input_time_value:formatTime(value)
      })
      this.change_flag = true;
      return;
    }
    var input_value = e.target.value;

    input_value = input_value.replace(/[^0-9０-９]/g, '');
    if (input_value.length > 4) return;
    input_value = toHalfWidthOnlyNumber(input_value);

    if(input_value.length >= 2 ){
      input_value = this.insertStrTimeStyle(input_value);
    }
    if (input_value.length == 5) this.setTime(e);
    this.setState({
      input_time_value:input_value
    }, () => {
      var obj = document.getElementById('input_time_id');
      if (this.key_code == 46){        
        obj.setSelectionRange(this.start_pos, this.start_pos);
      }
      if (this.key_code == 8){        
        obj.setSelectionRange(this.start_pos - 1, this.start_pos - 1);
      }
    })
  };

  onChange = (e, value) => {
    if (value === "pressure_max")
      this.setState({ pressure_max: e.target.value });
    else if (value === "pressure_min")
      this.setState({ pressure_min: e.target.value });
    else if (value === "pulse") this.setState({ pulse: e.target.value });
    else if (value === "temperature") {
      if (parseFloat(e) < 0) e = 0;
      this.setState({ temperature: e });
    } else if (value === "input_time") {
      let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");

      var value_time_object = new Date(schedule_date);
      value_time_object.setMinutes(e.getMinutes());
      value_time_object.setHours(e.getHours());
      if (this.base_time_object.getTime() > value_time_object.getTime()) {
        value_time_object.setDate(value_time_object.getDate() + 1);
      }
      this.setState({ cur_time: value_time_object });
    }
    this.change_flag = true;
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
      this.props.closeModal(true);
    }
  };

  confirmCancel() {
    this.setState({
      isBackConfirmModal: false,
      isRegisterConfirmModal: false,
      isUpdateConfirmModal: false,
      confirm_message: "",
      confirm_alert_title:'',
      tempTemperature: {},
    });
  }
  closeConfirmModal = () => {
    this.confirmCancel();
    this.props.closeModal(true);
  };

  confirmCloseOk = () => {
    this.props.handleModal(this.state.tempTemperature, this.state.is_Blood);
  }

  render() {
    return (
      <Modal
        show={true}
        onHide={this.closeModal}
        id="add_contact_dlg"
        className="master-modal staf-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            {/*<InputWithLabel*/}
            {/*label="入力時間"*/}
            {/*type="text"*/}
            {/*className="kana_area"*/}
            {/*diseaseEditData={formatTime(this.state.cur_time)}*/}
            {/*disabled*/}
            {/*/>*/}
            <div className="input-time">
              <label>入力時間</label>
              <DatePicker
                selected={this.state.cur_time}
                // onChange={(e) => this.onChange(e, "input_time")}
                onChange={this.getInputTime}
                onKeyDown = {this.timeKeyEvent}
                onBlur = {this.setTime}
                value = {this.state.input_time_value}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={10}
                dateFormat="HH:mm"
                timeFormat="HH:mm"
                timeCaption="時間"
                id = 'input_time_id'
              />
            </div>
            <InputWithLabel
              label="入力者"
              type="text"
              diseaseEditData={this.state.staff_name}
              disabled
            />
            {this.state.is_Blood ? (
              <>
                <InputWithLabel
                  label="最高血圧"
                  type="text"
                  getInputText={(e) => this.onChange(e, "pressure_max")}
                  diseaseEditData={this.state.pressure_max}
                />
                <InputWithLabel
                  label="最低血圧"
                  type="text"
                  getInputText={(e) => this.onChange(e, "pressure_min")}
                  diseaseEditData={this.state.pressure_min}
                />
                <InputWithLabel
                  label="脈拍"
                  type="text"
                  getInputText={(e) => this.onChange(e, "pulse")}
                  diseaseEditData={this.state.pulse}
                />
              </>
            ) : (
              <>
                <NumericInputWithUnitLabel
                  label="体温"
                  unit="℃"
                  className="form-control"
                  value={this.state.temperature}
                  getInputText={(e) => this.onChange(e, "temperature")}
                  min={34}
                  max={41}
                  step={0.1}
                  precision={1}
                  size={5}
                  inputmode="numeric"
                  id="temperature_id"
                />
              </>
            )}
          </Wrapper>
        </Modal.Body>
        {this.state.isBackConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.closeConfirmModal}
            confirmTitle={this.state.confirm_message}
            title = {this.state.confirm_alert_title}
          />
        )}
        {this.state.isRegisterConfirmModal !== false &&  (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.confirmCloseOk}
            confirmTitle= {this.state.confirm_message}
            title = {this.state.confirm_alert_title}
          />
        )}
        {this.state.alert_message != "" && (
          <ValidateAlertModal
            handleOk={this.closeAlertModal}
            alert_meassage={this.state.alert_message}
          />
        )}
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
            <Button className="red-btn" onClick={this.register}>登録</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

BloodInputModal.contextType = Context;

BloodInputModal.propTypes = {
  closeModal: PropTypes.func,
  handleModal: PropTypes.func,
  title: PropTypes.string,
  start_time: PropTypes.string,
};

export default BloodInputModal;
