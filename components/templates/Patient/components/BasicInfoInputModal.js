import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import * as apiClient from "~/api/apiClient";
import NumericInputWithUnitLabel from "../../../molecules/NumericInputWithUnitLabel";
import {formatDateFull, formatDateLine, formatTimeIE} from "../../../../helpers/date";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import DatePicker from "react-datepicker";
import ja from "date-fns/locale/ja";
import { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import {setDateColorClassName, toHalfWidthOnlyNumber} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import InspectionDoneModal from "~/components/templates/OrderList/InspectionDoneModal";

const Wrapper = styled.div`
  display: block;
  width: 100%;
  height: 100%;
  font-size: 1rem !important;
  div {margin-top:0;}
  .label-title {
    width:5rem;
    font-size: 1rem;
    margin:0;
    line-height:2rem;
  }
  .input-result input {
    height: 2rem;
    font-size: 1rem;
    width: 6rem;
  }
  .react-numeric-input input{
    width:6rem !important;
    height:2rem;
    font-size: 1rem !important;
  }
  .label-unit {
    font-size: 1rem;
    margin: 0;
    margin-left: 0.5rem;
    line-height: 2rem;
  }
  .react-datepicker-wrapper input {
    height:2rem;
    font-size: 1rem;
    width: 9rem !important;
  }
  .react-datepicker{
    width: 100% !important;
    .react-datepicker__month-container{
      width:75% !important;
      height:17rem;
    }
    .react-datepicker__navigation--next--with-time{
      right: 6rem;
    }
    .react-datepicker__time-container{
      width:25% !important;
    }
    .react-datepicker__time-box{
      width:auto !important;
      .react-datepicker__time-list {
        height: 17rem;
      }
    }
    .react-datepicker__current-month{
      font-size: 1.25rem;
    }
    .react-datepicker__day-names, .react-datepicker__week{
      display: flex;
      justify-content: space-between;
    }
    .react-datepicker__month{
      .react-datepicker__week{
        margin-bottom:0.25rem;
      }
    }
  }
  .input-result {
    margin-top:0.5rem;
    .ime-active input {
      ime-mode: active;
    }
    .ime-inactive input {
      ime-mode: inactive;
    }
    .text-area {
      width:calc(100% - 10rem);
      height:4rem;
      overflow-y:auto;
      border: 1px solid #aaa;
    }
    .no-label .label-title{
      display:none;
    }
  }
`;

const ContextMenuUl = styled.div`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 1240px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 84px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 1rem;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 0.3rem 0.5rem;
      font-size: 1rem;
    }
    img {
      width: 2rem;
      height: 2rem;
    }
    svg {
      width: 2rem;
      margin: 8px 0;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .blue-text {
    color: blue;
  }
`;

const ContextMenu = ({visible, x, y, parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.contextMenuAction("view_inspection_info")}>詳細</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

export class BasicInfoInputModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = props.modal_data;
    let input_date = props.measure_at !== undefined ? props.measure_at : new Date();
    let inspection_info = null; // ＳｐＯ２
    this.disable_spo2_value = false;
    if(props.from_page === "progress_chart" && props.inspection_data.length > 0){
      props.inspection_data.map(inspection=>{
        if(inspection.name === "ＳｐＯ２" && inspection.order_data.start_date !== undefined && inspection.order_data.end_date === undefined){
          if(inspection_info == null){
            inspection_info = inspection;
            if(input_date.getTime() < new Date(inspection.order_data.start_date).getTime()){
              this.disable_spo2_value = true;
            }
          } else if(inspection.order_data.number > inspection_info.order_data.number) {
            inspection_info = inspection;
            if(input_date.getTime() < new Date(inspection.order_data.start_date).getTime()){
              this.disable_spo2_value = true;
            } else {
              this.disable_spo2_value = false;
            }
          }
        }
      });
    }
    this.state = {
      number: modal_data != null ? modal_data.number:0,
      height: modal_data != null && modal_data.height !== undefined ? modal_data.height: "",
      weight: modal_data != null && modal_data.weight !== undefined ? modal_data.weight: "",
      measure_date: modal_data != null && modal_data.measure_date !== undefined ? modal_data.measure_date: null,
      measure_at : modal_data != null && modal_data.measure_at !== undefined ? modal_data.measure_at: null,
      temperature: modal_data != null && modal_data.temperature !== undefined ? modal_data.temperature: "",
      max_blood: modal_data != null && modal_data.max_blood !== undefined ? modal_data.max_blood: "",
      min_blood: modal_data != null && modal_data.min_blood !== undefined ? modal_data.min_blood: "",
      pluse: modal_data != null && modal_data.pluse !== undefined ? modal_data.pluse: "",
      respiratory: modal_data != null && modal_data.respiratory !== undefined ? modal_data.respiratory: "",
      isUpdateConfirmModal: false,
      confirm_message: "",
      confirm_title: "",
      alert_messages: "",
      input_date,
      isCloseConfirmModal:false,
      confirm_alert_title:'',
      inspection_info,
      spo2_value:"",
      isOpenInspectionDoneModal:false,
    };
    this.change_flag = 0;
  }
  
  getValue = (name, value) => {
    this.setState({[name]:isNaN(parseFloat(value))?'':value});
    this.change_flag = 1;
  };
  
  register =() => {
    var max_min_constants = this.props.max_min_constants;
    if (this.props.patientId === undefined || this.props.patientId == null) return;
    let alert_messages = "";
    if (this.props.modal_type ==0) {
      if (this.state.weight < max_min_constants.weight_min_limit) {
        alert_messages = '体重を'+max_min_constants.weight_min_limit+'以上で登録してください。';
      }
      if (this.state.height < max_min_constants.height_min_limit) {
        alert_messages = '身長を'+max_min_constants.height_min_limit+'以上で登録してください。';
      }
      if (this.state.weight > max_min_constants.weight_max_limit) {
        alert_messages = '体重を'+max_min_constants.weight_max_limit+'以下で登録してください。';
      }
      if (this.state.height > max_min_constants.height_max_limit) {
        alert_messages = '身長を'+max_min_constants.height_max_limit+'以下で登録してください。';
      }
      if (this.state.weight == null || this.state.weight === "") {
        alert_messages = '体重を入力してください。';
      }
      if (this.state.height == null || this.state.height === "") {
        alert_messages = "身長を入力してください。";
      }
    } else if (this.props.modal_type ==1 ) {
      if (this.state.respiratory < max_min_constants.respiratory_min_limit) {
        alert_messages = '呼吸数を'+max_min_constants.respiratory_min_limit+'以上で登録してください。';
      }
      if (this.state.respiratory > max_min_constants.respiratory_max_limit) {
        alert_messages = '呼吸数を'+max_min_constants.respiratory_max_limit+'以下で登録してください。';
      }
      if (this.state.pluse < max_min_constants.pulse_min_limit) {
        alert_messages = '脈拍を'+max_min_constants.pulse_min_limit+'以上で登録してください。';
      }
      if (this.state.pluse > max_min_constants.pulse_max_limit) {
        alert_messages = '脈拍を'+max_min_constants.pulse_max_limit+'以下で登録してください。';
      }
      if (this.state.min_blood < max_min_constants.low_blood_min_limit) {
        alert_messages = '最低血圧を'+max_min_constants.low_blood_min_limit+'以上で登録してください。';
      }
      if (this.state.min_blood > max_min_constants.low_blood_max_limit) {
        alert_messages = '最低血圧を'+max_min_constants.low_blood_max_limit+'以下で登録してください。';
      }
      if (this.state.max_blood < max_min_constants.high_blood_min_limit) {
        alert_messages = '最高血圧を'+max_min_constants.high_blood_min_limit+'以上で登録してください。';
      }
      if (this.state.max_blood > max_min_constants.high_blood_max_limit) {
        alert_messages = '最高血圧を'+max_min_constants.high_blood_max_limit+'以下で登録してください。';
      }
      if (this.state.temperature < max_min_constants.temperature_min_limit) {
        alert_messages = '体温を'+max_min_constants.temperature_min_limit+'以上で登録してください。';
      }
      if (this.state.temperature > max_min_constants.temperature_max_limit) {
        alert_messages = '体温を'+max_min_constants.temperature_max_limit+'以下で登録してください。';
      }
      if (this.state.respiratory == null || this.state.respiratory === "") {
        alert_messages = '呼吸数を入力してください。';
      }
      if (this.state.pluse == null || this.state.pluse === "") {
        alert_messages = '脈拍を入力してください。';
      }
      if (this.state.min_blood == null || this.state.min_blood === "") {
        alert_messages = '最低血圧を入力してください。';
      }
      if (this.state.max_blood == null || this.state.max_blood === "") {
        alert_messages = '最高血圧を入力してください。';
      }
      if (this.state.temperature == null || this.state.temperature === "") {
        alert_messages = '体温を入力してください。';
      }
    }
    if(alert_messages != ""){
      this.setState({alert_messages});
      return;
    }
    this.setState({
      isUpdateConfirmModal : true,
      confirm_message: this.state.number !== 0 ? "変更しますか？" : "登録しますか？",
      confirm_title: this.state.number !== 0 ? "変更確認" : "登録確認"
    });
  };
  
  confirmRegister=async()=> {
    let post_data = {};
    if (this.props.modal_type == 0) {
      post_data = {
        number: this.state.number,
        type: "height_weight",
        system_patient_id: this.props.patientId,
        measure_date: this.state.measure_date!=null?this.state.measure_date:(this.context.dateStatus != undefined && this.context.dateStatus != null ? formatDateLine(this.context.dateStatus):null),
        height: this.state.height,
        weight: this.state.weight,
      }
    } else if (this.props.modal_type == 1) {
      if (this.props.from_page == "progress_chart") {
        post_data.measure_at = formatDateFull(this.state.input_date,"-");
        if(this.state.inspection_info != null && !this.disable_spo2_value && this.state.spo2_value !== ""){
          let path = "/app/api/v2/order/inspection/start_end_date/register";
          let order_data = this.state.inspection_info.order_data;
          if(order_data.continue_date === undefined){
            order_data.continue_date = [];
          }
          let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
          let done_info = {};
          done_info.date = formatDateLine(this.state.input_date) + " " + formatTimeIE(this.state.input_date) + ":00";
          done_info.user_number = authInfo.user_number;
          done_info.done_result = this.state.spo2_value;
          done_info.result_suffix = this.state.inspection_info.result_suffix;
          order_data.continue_date.push(done_info);
          let post_params = {
            type:'done_continue_date',
            order_data,
          };
          await apiClient._post(
            path,
            {params: post_params})
            .then(() => {
            })
            .catch(() => {
            });
        }
      }
      post_data = {
        number: this.state.number,
        type: "vital",
        system_patient_id: this.props.patientId,
        measure_at: this.state.measure_at!=null?this.state.measure_at:(this.context.dateStatus != undefined && this.context.dateStatus != null ? formatDateLine(this.context.dateStatus) + " " + formatTimeIE(new Date()):null),
        temperature: this.state.temperature,
        max_blood: this.state.max_blood,
        min_blood: this.state.min_blood,
        pluse: this.state.pluse,
        respiratory: this.state.respiratory,
      }
    }
    let path = "/app/api/v2/patients/basic_data/register";
    await apiClient.post(path, {
      params: post_data
    }).then(() => {
      let msg = this.state.number === 0 ? "登録" : "変更";
      let alert_messages = "";
      if (this.props.modal_type == 0){
        alert_messages = '身長・体重を'+ msg +'しました。';
      } else if (this.props.modal_type == 1) {
        alert_messages = 'バイタルを'+ msg +'しました。';
      }
      if (this.props.from_page == "progress_chart") {
        this.props.handleOk("登録しました。");
        return;
      }
      this.props.closeModal("register", alert_messages);
    });    
    this.change_flag = 0;
  };
  
  confirmCancel=()=>{
    this.setState({
      isUpdateConfirmModal: false,
      isCloseConfirmModal:false,
      confirm_message: "",
      alert_messages: "",
      confirm_alert_title:'',
      isOpenInspectionDoneModal:false,
    });
  }
  
  getDate = (key,value) => {
    if(value == null || value === ""){
      value = new Date();
    }
    this.change_flag = 1;
    if(key === "input_date" && this.props.from_page === "progress_chart" && this.state.inspection_info != null){
      if(value.getTime() < new Date(this.state.inspection_info.order_data.start_date).getTime()){
        this.disable_spo2_value = true;
      } else {
        this.disable_spo2_value = false;
      }
    }
    this.setState({
      [key]: value,
      spo2_value:this.disable_spo2_value ? '' : this.state.spo2_value,
    });
  }

  closeThisModal = () => {
    if (this.change_flag){
      this.setState({
        isCloseConfirmModal:true,
        confirm_message:'登録していない内容があります。\n変更内容を破棄して移動しますか？',
        confirm_alert_title:'入力中'
      })
    } else {
      this.props.closeModal();
    }
  }
  
  setDoneResult = (e) => {
    let value = e.target.value;
    if(this.state.inspection_info.result_type === 0){
      let RegExp = /^[0-9０-９]+\.?[0-9０-９]*$/;
      if ((value !== '' && !RegExp.test(value)) || (value.length > this.state.inspection_info.result_input_length)){
        this.setState({spo2_value: this.state.spo2_value});
      } else {
        this.setState({spo2_value: toHalfWidthOnlyNumber(value)});
      }
    } else {
      if (value.length > this.state.inspection_info.result_input_length){
        this.setState({spo2_value: this.state.spo2_value});
      } else {
        this.setState({spo2_value: value});
      }
    }
  }
  
  handleClick=(e)=>{
    /*@cc_on _d = document; eval ( 'var document = _d') @*/
    e.preventDefault();
    // eslint-disable-next-line consistent-this
    const that = this;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({ contextMenu: { visible: false } });
      document.removeEventListener(`click`, onClickOutside);
    });
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({
        contextMenu: { visible: false }
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    let modal_top = document.getElementsByClassName("basic-data-input-modal")[0].offsetTop;
    let modal_header_height = document.getElementsByClassName("basic-data-input-modal")[0].getElementsByClassName("modal-header")[0].offsetHeight;
    let label_top = document.getElementsByClassName("input-result")[0].getElementsByClassName("label-title")[0].offsetTop;
    let label_left = document.getElementsByClassName("input-result")[0].getElementsByClassName("label-title")[0].offsetLeft;
    let state_data = {};
    state_data.contextMenu = {
      visible: true,
      x: label_left,
      y: modal_top + label_top - modal_header_height - label_left + window.pageYOffset,
    };
    this.setState(state_data);
  }
  
  contextMenuAction=(act)=>{
    if(act === "view_inspection_info"){
      let inspection_modal_data = JSON.parse(JSON.stringify(this.state.inspection_info));
      inspection_modal_data.patient_number = this.props.patient_number;
      inspection_modal_data.patient_name = this.props.patient_name;
      inspection_modal_data.order_data = {};
      inspection_modal_data.order_data.order_data = this.state.inspection_info.order_data;
      this.setState({
        isOpenInspectionDoneModal:true,
        inspection_modal_data,
      });
    }
  }
  
  render() {
    let {modal_type, max_min_constants} = this.props;
    return (
      <Modal show={true} className="custom-modal-sm basic-data-modal basic-data-input-modal first-view-modal">
        <Modal.Header><Modal.Title>{modal_type == 0 ? "身長・体重入力" : "バイタル入力"}</Modal.Title></Modal.Header>
        <Modal.Body>
          <DatePickerBox style={{width:"100%", height:"100%"}}>
            <Wrapper>
              {modal_type == 0 ? (
                <>
                  <div className="d-flex w-100">
                    <NumericInputWithUnitLabel
                      label="身長"
                      unit="cm"
                      max={250}
                      min={0}
                      className="form-control"
                      value={this.state.height}
                      precision={max_min_constants.height_decimal_place}
                      step={0.001}
                      maxLength={10}
                      getInputText={this.getValue.bind(this,"height")}
                      inputmode="numeric"
                    />
                  </div>
                  <div className="d-flex w-100" style={{marginTop:"0.5rem"}}>
                    <NumericInputWithUnitLabel
                      label="体重"
                      unit="kg"
                      max={250}
                      min={0}
                      precision={max_min_constants.weight_decimal_place}
                      step={0.001}
                      maxLength={10}
                      className="form-control"
                      value={this.state.weight}
                      getInputText={this.getValue.bind(this,"weight")}
                      inputmode="numeric"
                    />
                  </div>
                </>
              ):(
                <>
                  {this.props.from_page === "progress_chart" && (
                    <div className="d-flex w-100">
                      <label className="label-title">日時</label>
                      <DatePicker
                        locale={ja}
                        id='end_date_id'
                        selected={this.state.input_date}
                        onChange={this.getDate.bind(this,"input_date")}
                        dateFormat="yyyy/MM/dd HH:mm"
                        timeCaption="時間"
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={10}
                        showMonthDropdown
                        showYearDropdown
                        maxDate={this.props.measure_at !== undefined ? new Date(formatDateLine(this.props.measure_at)):new Date()}
                        dropdownMode="select"
                        dayClassName = {date => setDateColorClassName(date)}
                      />
                    </div>
                  )}
                  <div className="d-flex w-100" style={{marginTop:"0.5rem"}}>
                    <NumericInputWithUnitLabel
                      label="体温"
                      unit="℃"
                      max={99.9}
                      min={0}
                      className="form-control"
                      value={this.state.temperature}
                      precision={1}
                      step={0.1}
                      getInputText={this.getValue.bind(this,"temperature")}
                      inputmode="numeric"
                    />
                  </div>
                  <div className="d-flex w-100" style={{marginTop:"0.5rem"}}>
                    <NumericInputWithUnitLabel
                      label="最高血圧"
                      unit="mmHg"
                      max={250}
                      min={0}
                      precision={0}
                      className="form-control"
                      value={this.state.max_blood}
                      getInputText={this.getValue.bind(this,"max_blood")}
                      inputmode="numeric"
                    />
                  </div>
                  <div className="d-flex w-100" style={{marginTop:"0.5rem"}}>
                    <NumericInputWithUnitLabel
                      label="最低血圧"
                      unit="mmHg"
                      max={250}
                      min={0}
                      precision={0}
                      className="form-control"
                      value={this.state.min_blood}
                      getInputText={this.getValue.bind(this,"min_blood")}
                      inputmode="numeric"
                    />
                  </div>
                  <div className="d-flex w-100" style={{marginTop:"0.5rem"}}>
                    <NumericInputWithUnitLabel
                      label="脈拍"
                      unit="bpm"
                      max={250}
                      min={0}
                      precision={0}
                      className="form-control"
                      value={this.state.pluse}
                      getInputText={this.getValue.bind(this,"pluse")}
                      inputmode="numeric"
                    />
                  </div>
                  <div className="d-flex w-100" style={{marginTop:"0.5rem"}}>
                    <NumericInputWithUnitLabel
                      label="呼吸数"
                      unit="bpm"
                      max={35}
                      min={10}
                      precision={0}
                      className="form-control"
                      value={this.state.respiratory}
                      getInputText={this.getValue.bind(this,"respiratory")}
                      inputmode="numeric"
                    />
                  </div>
                  {(this.props.from_page === "progress_chart" && this.state.inspection_info != null) && (
                    <div className="w-100 input-result flex">
                      {this.state.inspection_info.enable_result === 1 && (
                        <>
                          {this.state.inspection_info.result_type === 0 && (
                            <>
                              <div className='label-title' onContextMenu={e => this.handleClick(e)}>SpO2</div>
                              <div className='ime-inactive no-label'>
                                <InputWithLabelBorder
                                  label=""
                                  type="text"
                                  getInputText={this.setDoneResult.bind(this)}
                                  diseaseEditData={this.state.spo2_value}
                                  isDisabled={this.disable_spo2_value}
                                />
                              </div>
                              <div className='label-unit'>{this.state.inspection_info.result_suffix}</div>
                            </>
                          )}
                          {this.state.inspection_info.result_type === 1 && (
                            <>
                              <div className='label-title' onContextMenu={e => this.handleClick(e)}>SpO2</div>
                              <div className='ime-active no-label'>
                                <InputWithLabelBorder
                                  label=""
                                  type="text"
                                  getInputText={this.setDoneResult.bind(this)}
                                  diseaseEditData={this.state.spo2_value}
                                  isDisabled={this.disable_spo2_value}
                                />
                              </div>
                              <div className='label-unit'>{this.state.inspection_info.result_suffix}</div>
                            </>
                          )}
                          {this.state.inspection_info.result_type === 2 && (
                            <>
                              <div className='label-title' onContextMenu={e => this.handleClick(e)}>SpO2</div>
                              <div className={'text-area'}>
                                <textarea disabled={this.disable_spo2_value} value={this.state.spo2_value} onChange={this.setDoneResult.bind(this)} style={{width:"100%", height:"4rem"}}/>
                              </div>
                              <div className='label-unit'>{this.state.inspection_info.result_suffix}</div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </Wrapper>
          </DatePickerBox>
        </Modal.Body>
        <Modal.Footer>
          <div onClick={this.closeThisModal} className={"custom-modal-btn cancel-btn"} style={{cursor:"pointer"}} id='btnCancel'>
            <span>キャンセル</span>
          </div>
          <div onClick={this.register.bind(this)} className={"custom-modal-btn red-btn"} style={{cursor:"pointer"}} id="btnOk">
            <span>{this.state.number === 0?"登録":"変更"}</span>
          </div>
        </Modal.Footer>
        {this.state.isUpdateConfirmModal !== false && (
          <ConfirmNoFocusModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.confirmRegister.bind(this)}
            confirmTitle= {this.state.confirm_message}
            title = {this.state.confirm_title}
          />
        )}
        {this.state.isCloseConfirmModal && (
          <ConfirmNoFocusModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.props.closeModal}
            confirmTitle= {this.state.confirm_message}
            title = {this.state.confirm_alert_title}
          />
        )}
        {this.state.alert_messages !== "" && (
          <AlertNoFocusModal
            hideModal= {this.confirmCancel.bind(this)}
            handleOk= {this.confirmCancel.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
        />
        {this.state.isOpenInspectionDoneModal && (
          <InspectionDoneModal
            closeModal={this.confirmCancel}
            modal_title={this.state.inspection_modal_data.category}
            modal_data={this.state.inspection_modal_data}
            only_close_btn={true}
          />
        )}
      </Modal>
    );
  }
}

BasicInfoInputModal.contextType = Context;
BasicInfoInputModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  patientId: PropTypes.number,
  modal_type: PropTypes.string,
  modal_data: PropTypes.object,
  max_min_constants : PropTypes.object,
  from_page:PropTypes.string,
  measure_at: PropTypes.string,
  inspection_data: PropTypes.object,
  patient_number: PropTypes.string,
  patient_name: PropTypes.string,
};

export default BasicInfoInputModal;