import React, { Component } from "react";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import PropTypes from "prop-types";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import NumericInputWithUnitLabel from "../../../molecules/NumericInputWithUnitLabel";
import * as apiClient from "~/api/apiClient";
import {formatTime} from "../../../../helpers/date";
import * as methods from "../DialMethods";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import { secondary600 } from "~/components/_nano/colors";
import ValidateAlertModal from '~/components/molecules/ValidateAlertModal';
import $ from 'jquery';
import {
  removeRedBorder
} from '~/helpers/dialConstants';

const Wrapper = styled.div`
  width: 100%;
  height: calc(100vh - 200px);
  padding: 15px;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  .flex {
    display: flex;
    width: 100%;
    input {
      font-size: 15px !important;
      height: 2.5rem;
    }
  }
  .label-title {
    margin-top: 0;
    margin-bottom: 0;
    text-align: right;
    font-size: 15px;
    width: 200px;
    line-height: 2.5rem;
  }
  .label-unit {
    margin-top: 0;
    margin-bottom: 0;
    font-size: 15px;
    width: 70px;
    line-height: 2.5rem;
  }
  .form-control {
    text-align: right;
    padding-right: 1.2rem !important;
  }
  .footer {
    width: 100%;
    margin-top: 20px;
    .disable-button {
      background: rgb(101, 114, 117);
    }
    button {
      span {
        font-size: 1.25rem;
        font-weight: bold;
      }
    }
    button:hover {
      background-color: ${secondary600};
    }
    .red-btn {
      background: #cc0000;
      border:2px solid #cc0000;
      span {
        color: #ffffff;
      }
    }
    .red-btn:hover {
      background: #e81123;
      span {
        color: #ffffff;
      }
    }
  }
`;

class BloodSet extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>{
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))}
    );
    this.state={
      schedule_data: null,
      number:0,
      blood_pressure_max: "",
      blood_pressure_min: "",
      blood_pressure_emax: "",
      blood_pressure_emin: "",
      pluse_max:"",
      pluse_min: "",
      blood_pressure_step: "",
      isConfirmSave: false,
      isConfirmMove: false,
      data_json: {
        blood_pressure_max: "",
        blood_pressure_min: "",
        blood_pressure_emax: "",
        blood_pressure_emin: "",
        pluse_max: "",
        pluse_min: "",
        blood_pressure_step: ""
      },
      confirm_alert_title:'',
      alert_message: ''
    };
    this.double_click = false;
  }
  
  componentDidMount() {
    let schedule_data = this.props.schedule_data;
    this.bloodSetState(schedule_data);
  }
  
  componentWillUnmount() {
    this.double_click = null;

    var html_obj = document.getElementsByClassName("blood_set_wrapper")[0];
    if(html_obj !== undefined && html_obj != null){
        html_obj.innerHTML = "";
    }
  }
  
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.schedule_data == nextProps.schedule_data) {
      return;
    }
    let schedule_data =nextProps.schedule_data === undefined || nextProps.schedule_data == null ? null : nextProps.schedule_data;
    this.bloodSetState(schedule_data)
  }
  
  bloodSetState = (schedule_data) => {
    let default_array = this.getTelegramDefaultValue();
    let number,blood_pressure_max,blood_pressure_min,blood_pressure_emax,blood_pressure_emin,pluse_max,pluse_min, blood_pressure_step= "";
    if (schedule_data !== null && schedule_data.blood_info !== undefined && schedule_data.blood_info != null &&
      schedule_data.blood_info.body !== undefined && schedule_data.blood_info.body != null){
      number = schedule_data.blood_info.number;
      blood_pressure_max = schedule_data.blood_info.body.blood_pressure_max;
      blood_pressure_min = schedule_data.blood_info.body.blood_pressure_min;
      blood_pressure_emax = schedule_data.blood_info.body.blood_pressure_emax;
      blood_pressure_emin = schedule_data.blood_info.body.blood_pressure_emin;
      pluse_max = schedule_data.blood_info.body.pluse_max;
      pluse_min = schedule_data.blood_info.body.pluse_min;
      blood_pressure_step = schedule_data.blood_info.body.blood_pressure_step;
    }
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if ((patientInfo != undefined && patientInfo != null && patientInfo.system_patient_id != undefined) &&
      (blood_pressure_max == null || blood_pressure_max === "") &&
      (default_array !== undefined && default_array != null)){
      blood_pressure_max = default_array.blood_pressure_max !== undefined && default_array.blood_pressure_max != null && default_array.blood_pressure_max.default_value;
      blood_pressure_min = default_array.blood_pressure_min !== undefined && default_array.blood_pressure_min != null && default_array.blood_pressure_min.default_value;
      blood_pressure_emax = default_array.blood_pressure_emax !== undefined && default_array.blood_pressure_emax != null && default_array.blood_pressure_emax.default_value;
      blood_pressure_emin = default_array.blood_pressure_emin !== undefined && default_array.blood_pressure_emin != null && default_array.blood_pressure_emin.default_value;
      pluse_max = default_array.pluse_max !== undefined && default_array.pluse_max != null && default_array.pluse_max.default_value;
      pluse_min = default_array.pluse_min !== undefined && default_array.pluse_min != null && default_array.pluse_min.default_value;
      blood_pressure_step = default_array.blood_pressure_step !== undefined && default_array.blood_pressure_step != null && default_array.blood_pressure_step.default_value;
    }
    this.setState({
      schedule_data,
      number,
      blood_pressure_max,
      blood_pressure_min,
      blood_pressure_emax,
      blood_pressure_emin,
      pluse_max,
      pluse_min,
      blood_pressure_step,
    });
  };
  
  getValue = (key, value) => {
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if(patientInfo == undefined || patientInfo == null || patientInfo.system_patient_id == undefined){
      return;
    }
    let schedule_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_data");
    if(schedule_data == undefined || schedule_data == null || schedule_data.number == undefined){
      return;
    }
    let cur_value = this.state[key];
    if(value != null && value < 0 && value > 1000){
      value = cur_value;
    }
    this.setChangeFlag(1);
    this.setState({[key]:value});
  };
  
  setChangeFlag=(change_flag = 0)=>{
    this.change_flag = change_flag;
    if (change_flag){
      sessApi.setObjectValue('dial_change_flag', 'dial_blood_set', 1);
    } else {
      sessApi.remove('dial_change_flag');
    }
    this.setState({change_flag});
  }
  
  saveData = async () => {
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if(patientInfo == undefined || patientInfo == null || patientInfo.system_patient_id == undefined){
      window.sessionStorage.setItem("alert_messages", "患者様を選択してください。");
      return;
    }
    let schedule_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_data");
    if(schedule_data == undefined || schedule_data == null || schedule_data.number == undefined){
      window.sessionStorage.setItem("alert_messages", "スケジュールを登録してください。");
      return;
    }
    let error_str_array = this.checkValidation();
    
    if (error_str_array.length > 0) {
      this.setState({ alert_message: error_str_array.join('\n') })
      return
    }
    this.setState({
      isConfirmSave: true,
      confirm_message: '血圧設定を変更しますか？'
    });
  };
  
  movetoOther = () => {
    this.setState({
      isConfirmMove: true,
      confirm_message: '登録していない内容があります。\n変更内容を破棄して移動しますか？',
      confirm_alert_title:'入力中'
    });
  };
  
  confirmSave = async () => {
    this.confirmCancel();
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    let schedule_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_data");
    if (this.double_click == true) return;
    this.double_click = true;
    let data_json = this.state.data_json;
    data_json.blood_pressure_max = this.state.blood_pressure_max;
    data_json.blood_pressure_min = this.state.blood_pressure_min;
    data_json.blood_pressure_emax = this.state.blood_pressure_emax;
    data_json.blood_pressure_emin = this.state.blood_pressure_emin;
    data_json.pluse_max = this.state.pluse_max;
    data_json.pluse_min = this.state.pluse_min;
    data_json.blood_pressure_step = this.state.blood_pressure_step;
    this.setState({data_json});
    let path = "/app/api/v2/dial/board/Soap/register";
    let post_data = {
      number:this.state.number,
      system_patient_id:patientInfo.system_patient_id,
      write_date:formatTime(this.state.entry_time),
      schedule_date:schedule_data.schedule_date,
      category_1:"血圧パターン",
      category_2:"",
      body:JSON.stringify(data_json),
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        window.sessionStorage.setItem("alert_messages","変更完了##" + res.alert_message);
        this.setChangeFlag(0);
        this.props.getSchedule();
      }).catch(() => {
      
      }).finally(()=>{
        this.double_click=false;
      });
  };
  
  confirmCancel() {
    this.setState({
      isConfirmSave: false,
      isConfirmMove: false,
      confirm_message: "",
      confirm_alert_title:''
    });
  }
  
  checkValidation = () => {
    removeRedBorder('time_limit_from_id');
    let error_str_arr = [];
    
    let validate_data = this.telegramValidate(this.state.dial_method);
    
    if (validate_data.first_tag_id != '') {
      this.setState({ first_tag_id: validate_data.first_tag_id })
    }
    if (validate_data.error_str_arr.length > 0) {
      validate_data.error_str_arr.map(item => {
        error_str_arr.push(item);
      })
    }
    return error_str_arr;
  }
  
  closeAlertModal = () => {
    this.setState({ alert_message: '' });
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null){
      $('#' + first_tag_id).focus()
    }
  }
  
  render() {
    return (
      <>
        <Wrapper className="blood_set_wrapper">
          <div className={'flex'}>
            <NumericInputWithUnitLabel
              label="最高血圧上限"
              unit="mmHg"
              className="form-control"
              value={this.state.blood_pressure_max}
              getInputText={this.getValue.bind(this,"blood_pressure_max")}
              inputmode="numeric"
              min={0}
              id='blood_pressure_max_id'
            />
          </div>
          <div className={'flex'}>
            <NumericInputWithUnitLabel
              label="最高血圧下限"
              unit="mmHg"
              className="form-control"
              value={this.state.blood_pressure_min}
              getInputText={this.getValue.bind(this,"blood_pressure_min")}
              inputmode="numeric"
              min={0}
              id='blood_pressure_min_id'
            />
          </div>
          <div className="flex">
            <NumericInputWithUnitLabel
              label="最低血圧上限"
              unit="mmHg"
              className="form-control"
              value={this.state.blood_pressure_emax}
              getInputText={this.getValue.bind(this,"blood_pressure_emax")}
              inputmode="numeric"
              min={0}
              id='blood_pressure_emax_id'
            />
          </div>
          <div className={'flex'}>
            <NumericInputWithUnitLabel
              label="最低血圧下限"
              unit="mmHg"
              className="form-control"
              value={this.state.blood_pressure_emin}
              getInputText={this.getValue.bind(this,"blood_pressure_emin")}
              inputmode="numeric"
              min={0}
              id='blood_pressure_emin_id'
            />
          </div>
          <div className={'flex'}>
            <NumericInputWithUnitLabel
              label="脈拍上限"
              unit="bpm"
              className="form-control"
              value={this.state.pluse_max}
              getInputText={this.getValue.bind(this,"pluse_max")}
              inputmode="numeric"
              min={0}
              id='pluse_max_id'
            />
          </div>
          <div className={'flex'}>
            <NumericInputWithUnitLabel
              label="脈拍下限"
              unit="bpm"
              className="form-control"
              value={this.state.pluse_min}
              getInputText={this.getValue.bind(this,"pluse_min")}
              inputmode="numeric"
              min={0}
              id='pluse_min_id'
            />
          </div>
          <div className={'flex'}>
            <NumericInputWithUnitLabel
              label="血圧自動測定間隔"
              unit="min"
              className="form-control"
              value={this.state.blood_pressure_step}
              getInputText={this.getValue.bind(this,"blood_pressure_step")}
              inputmode="numeric"
              min={0}
              id='blood_pressure_step_id'
            />
          </div>
          <div className="footer">
            <Button onClick={this.saveData.bind(this)} className="red-btn">
              {(this.props.schedule_data !== undefined && this.props.schedule_data.blood_info !== undefined && this.props.schedule_data.blood_info != null) ? '変更' : '登録'}</Button>
          </div>
          {this.state.isConfirmSave == true && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.confirmSave.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.isConfirmMove == true && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.movetoOther.bind(this)}
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
        </Wrapper>
      </>
    )
  }
}

BloodSet.contextType = Context;

BloodSet.propTypes = {
  schedule_data: PropTypes.object,
  getSchedule: PropTypes.func,
};

export default BloodSet