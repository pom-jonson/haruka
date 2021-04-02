import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import InputWithLabel from "../../../../molecules/InputWithLabel";
import {
  formatDateTimeStr,
  formatDateTimeIE,
  formatNowTime,
  formatTime
} from "../../../../../helpers/date";
import DatePicker from "react-datepicker";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import NumericInputWithUnitLabel from "../../../../molecules/NumericInputWithUnitLabel";
import { CACHE_SESSIONNAMES } from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
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

class TemperatureEditModal extends Component {
  constructor(props) {
    super(props);
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let { modal_data } = this.props;
    this.state = {
      number: modal_data != null ? modal_data.number : 0,
      cur_time:
        modal_data != null
          ? formatDateTimeIE(modal_data.input_time)
          : formatNowTime(),
      staff_name: authInfo.name,
      temperature: modal_data != null ? modal_data.temperature : "",
      isBackConfirmModal: false,
      isUpdateConfirmModal: false,
      confirm_message: "",
      confirm_alert_title:'',
      alert_message: '',
    };
    this.change_flag = false;
  }

  editData = () => {
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
      this.setState({ alert_message: error_str_array.join('\n') });
      this.modalBlack();
      return;
    }
    if (this.props.modal_data !== null) {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "変更しますか?",
      });
      this.modalBlack();
    }
  };

  register = () => {
    var cur_time = this.state.cur_time;
    let post_data = {
      number: this.state.number,
      input_time: formatDateTimeStr(cur_time),
      staff: this.state.staff_name,
      temperature: this.state.temperature ? this.state.temperature : "",
    };
    this.setState(
      {
        isUpdateConfirmModal: false,
        confirm_message: "",
      },
      () => {
        this.props.handleModal(post_data);
      }
    );
  };
  closeConfirmModal = () => {
    this.confirmCancel();
    this.props.closeModal(true);
  };

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
    var base_time_object = new Date(schedule_date);

    value_time_object.setMinutes(mins);
    value_time_object.setHours(hours);
    if (base_time_object.getTime() > value_time_object.getTime()) {
      value_time_object.setDate(value_time_object.getDate() + 1);
    }

    this.setState({cur_time:value_time_object})
    this.change_flag = true;
  }

  getInputTime = (value, e) => {
    let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
    var value_time_object = new Date(schedule_date);    
    var base_time_object = new Date(schedule_date);
    if (e == undefined){
      value_time_object.setMinutes(value.getMinutes());
      value_time_object.setHours(value.getHours());
      if (base_time_object.getTime() > value_time_object.getTime()) {
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
    if (value === "temperature") this.setState({ temperature: e });
    else if (value === "input_time") {
      let schedule_date = sessApi.getObjectValue(
        CACHE_SESSIONNAMES.DIAL_BOARD,
        "schedule_date"
      );
      var base_time_object = new Date(schedule_date);
      var value_time_object = new Date(schedule_date);
      value_time_object.setMinutes(e.getMinutes());
      value_time_object.setHours(e.getHours());

      let dial_timezone = JSON.parse(
        window.sessionStorage.getItem("init_status")
      ).dial_timezone["timezone"];
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
      base_time_object.setHours(parseInt(base_hour));
      base_time_object.setMinutes(parseInt(base_mins));

      if (base_time_object.getTime() > value_time_object.getTime()) {
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
      this.modalBlack();
    } else {
      this.props.closeModal(true);
    }
  };

  confirmCancel() {
    this.setState({
      isBackConfirmModal: false,
      isUpdateConfirmModal: false,
      confirm_message: "",
      confirm_alert_title:''
    });
    this.modalBlackBack();
  }
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
  modalBlack = () => {
    let base_modal = document.getElementsByClassName("temperature_edit_modal")[0];
    if(base_modal !== undefined && base_modal != null){
      base_modal.style['z-index'] = 1040;
    }
  }
  modalBlackBack = () => {
    let base_modal = document.getElementsByClassName("temperature_edit_modal")[0];
    if(base_modal !== undefined && base_modal != null){
      base_modal.style['z-index'] = 1050;
    }
  }

  render() {
    return (
      <Modal
        show={true}
        onHide={this.closeModal}
        id="add_contact_dlg"
        className="master-modal staf-modal temperature_edit_modal"
      >
        <Modal.Header>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
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
            {/*<InputWithLabel*/}
            {/*    label="体温"*/}
            {/*    type="text"*/}
            {/*    getInputText={(e) => this.onChange(e,"temperature")}*/}
            {/*    diseaseEditData={this.state.temperature}*/}
            {/*/>*/}
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
          </Wrapper>
          {this.state.isUpdateConfirmModal !== false && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.register.bind(this)}
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
          {this.state.alert_message != "" && (
            <ValidateAlertModal
              handleOk={this.closeAlertModal}
              alert_meassage={this.state.alert_message}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
            <Button className="red-btn" onClick={this.editData}>登録</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

TemperatureEditModal.contextType = Context;

TemperatureEditModal.propTypes = {
  staffInfo: PropTypes.object,
  closeModal: PropTypes.func,
  handleModal: PropTypes.func,
  title: PropTypes.string,
  modal_data: PropTypes.object,
  start_time: PropTypes.object,
};

export default TemperatureEditModal;
