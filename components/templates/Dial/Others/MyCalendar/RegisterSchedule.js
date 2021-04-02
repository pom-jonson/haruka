import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import * as apiClient from "~/api/apiClient";
import RadioButton from "~/components/molecules/RadioInlineButton";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import { faCalendarAlt } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color';
import {formatDateLine} from "~/helpers/date";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import { scheduleValidate } from '~/helpers/validate'
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from "jquery";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 1rem;
  margin-right: 0.3rem;
  cursor: pointer;
`;

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    overflow-y: auto;
    .flex {
        display: flex;
        flex-wrap: wrap;
    }
    .div-title {
        line-height:38px;
        height: 38px;
        width: 70px;
    }
    .select-dial-status {
        .radio-btn label {
            margin-bottom: 0px;
            border: solid 1px rgb(206, 212, 218);
            border-radius: 0.25rem;
            padding: 0px 0.3rem;
            text-align: center;
            margin-right:0.3rem;
            width: 15rem;
            font-size: 1.2rem;
            line-height: 38px;
        }
    }
    .select-date {
        margin-top: 8px;
        .react-datepicker-wrapper {
            line-height: 38px;
            height: 38px;
        }
        .icon-datepicker {
            div {
                margin: 0;
                height: 0;
            }
        }
    }

      .birthday_area{
         .react-datepicker-popper {
            left: -45px !important;
         }
          span{
            margin-right: 0.3rem;
            margin-left: 0.3rem;
            line-height: 38px;
          }
          .label-title{
            width: 0;
          }
          .pullbox-select{
              width:6rem;
          }
          .pullbox-label {
            margin:0;
          }
          .month_day{
            .pullbox-select{
                width: 4.5rem;
            }
            .label-title{
                display:none;
            }
            label {
                width: 4.5rem;
            }
          }
          label {
            width: 6rem;
          }
          .calendar_icon {
            left: 6.25rem;
            color: black;
          }
      }
      .summary {
        .div-title {
            margin-top: 8px;
        }
        .summary-text {
            width: calc(100% - 400px);
            .label-title {
                width: 0;
                margin:0;
            }
        }
      }
      .summary-color {
        margin-top: 8px;
      }
      .color-value {
        padding-left: 10px;
        line-height:38px;
      }
      .body {
        margin-top: 8px;
        height: 50%;
        textarea {
            width: calc(100% - 400px);
            height: 100%;
        }
      }
      .sketch-picker {width:230px !important;}
`;

class RegisterSchedule extends Component {
  constructor(props) {
    super(props);
    let standard_year_list = [];
    let month_list = [];
    let day_list = [];
    var i =0;
    for (i=1;i<=12;i++){
      month_list.push({id:i,value:i});
    }
    for (i =1;i<=31;i++){
      day_list.push({id:i,value:i});
    }
    var current_year = new Date().getFullYear();
    for (i=1900;i <= current_year+30; i++){
      standard_year_list.push({id:i,value:i});
    }
    standard_year_list.reverse();
    let schedule_date = new Date(props.schedule_date);
    let schedule_year = schedule_date.getFullYear();
    let schedule_month = schedule_date.getMonth() + 1;
    let schedule_day = schedule_date.getDate();
    this.state = {
      day_list,
      month_list,
      standard_year_list,
      schedule_year,
      schedule_month,
      schedule_day,
      schedule_date,
      schedule_type:props.modal_data != null ? (props.modal_data.system_patient_id != null ? 1 : 0) : ((props.patientInfo != null && props.patientInfo !== undefined && props.patientInfo.system_patient_id > 0) ? 1: 0),
      alert_messages:"",
      confirm_message:"",
      summary:props.modal_data != null ? props.modal_data.summary : "",
      body:props.modal_data != null && props.modal_data.body != null ? props.modal_data.body : "",
      summary_color:props.modal_data != null && props.modal_data.summary_color != null ? props.modal_data.summary_color : '#000000',
      body_color:props.modal_data != null && props.modal_data.body_color != null ? props.modal_data.body_color : '#000000',
      displayColorPicker_back:false,
      displayColorPicker_font:false,
      system_patient_id:(props.patientInfo != null && props.patientInfo !== undefined) ? props.patientInfo.system_patient_id : null,
      number:props.modal_data != null ? props.modal_data.number :0,
      confirm_alert_title:'',
      check_message:"",
    };
    this.change_flag = 0;
  }
  
  async componentDidMount() {
    this.changeBackground();
  }
  
  componentDidUpdate () {
    this.changeBackground();
  }
  
  changeBackground = () => {
    scheduleValidate("my_calendar", this.state, "background");
  }
  
  setScheduleType = (e) => {
    if((parseInt(e.target.value) === 1 && this.state.system_patient_id == null) || this.state.number > 0){
      return;
    }
    this.setState({ schedule_type: parseInt(e.target.value)});
  };
  
  confirmSave=()=>{
    if(this.change_flag == 0){
      return;
    }
    let validate_data = scheduleValidate("my_calendar", this.state);
    if (validate_data['error_str_arr'].length > 0 ) {
      this.setState({
        check_message:validate_data['error_str_arr'].join('\n'),
        first_tag_id:validate_data['first_tag_id']
      });
      return;
    }
    this.setState({confirm_message:"この内容で"+(this.state.number === 0 ? "登録" : "編集")+"しますか？"});
  };
  
  closeAlertModal = () => {
    this.setState({check_message: ''});
    $("#" + this.state.first_tag_id).focus();
  }
  
  closeModal=()=>{
    this.setState({
      alert_messages:"",
      confirm_message:"",
      confirm_alert_title:'',
    });
  };
  
  register=async()=>{
    if(this.state.confirm_type === "close"){
      this.props.closeModal();
    } else {
      let path = "/app/api/v2/dial/mycalendar/register_schedule";
      let post_data = {
        number:this.state.number,
        schedule_date:formatDateLine(this.state.schedule_date),
        summary:this.state.summary,
        summary_color:this.state.summary_color,
        body:this.state.body,
        body_color:this.state.body_color,
        system_patient_id:this.state.schedule_type === 0 ? null : this.state.system_patient_id,
      };
      
      await apiClient._post(
        path,
        {params: post_data})
        .then((res) => {
          this.setState({
            confirm_message:"",
            alert_messages:res.error_message !== undefined ? res.error_message : "",
          }, ()=>{
            if(res.error_message === undefined){
              this.props.closeModal('register', post_data.schedule_date);
              var title = '';
              var message = res.alert_message;
              if (message.indexOf('変更') > -1) title = "変更完了##";
              if (message.indexOf('登録') > -1) title = "登録完了##";
              window.sessionStorage.setItem("alert_messages", title + res.alert_message);
            }
          });
        })
        .catch(() => {
        
        })
    }
  };
  
  setSummary = e => {
    this.change_flag = 1;
    this.setState({summary: e.target.value})
  };
  
  setBody = (e) => {
    this.change_flag = 1;
    this.setState({body:e.target.value});
  };
  
  formatMonthDate = value => {
    value = parseInt(value);
    if (value < 10) return "0" + value.toString();
    else return value.toString();
  };
  
  getBirthYear = e => {
    this.change_flag = 1;
    this.setState({
      schedule_year:e.target.id,
      schedule_date:new Date(e.target.id.toString() + '-' +  this.formatMonthDate(this.state.schedule_month) + '-' + this.formatMonthDate(this.state.schedule_day))
    });
  };
  getBirthMonth = e => {
    this.change_flag = 1;
    this.setState({
      schedule_month:e.target.id,
      schedule_date:new Date(this.state.schedule_year.toString() + '-' +  this.formatMonthDate(e.target.id) + '-' + this.formatMonthDate(this.state.schedule_day))
    });
  };
  getBirth_day = e => {
    this.change_flag = 1;
    this.setState({
      schedule_day:e.target.id,
      schedule_date:new Date(this.state.schedule_year.toString() + '-' +  this.formatMonthDate(this.state.schedule_month) + '-' + this.formatMonthDate(e.target.id))
    });
  };
  getBirthDate = value => {
    this.change_flag = 1;
    let schedule_date = new Date(value);
    this.setState({
      schedule_date,
      schedule_year:schedule_date.getFullYear(),
      schedule_month:schedule_date.getMonth() + 1,
      schedule_day:schedule_date.getDate(),
    });
  };
  
  handleClick_back = () => {
    this.setState({
      displayColorPicker_back: !this.state.displayColorPicker_back,
    })
  };
  
  handleClose = () => {
    this.setState({ displayColorPicker_back: false, displayColorPicker_font:false })
  };
  
  handleChange_back = (color) => {
    this.change_flag = 1;
    this.setState({
      summary_color:color.hex,
    })
  };
  
  handleClick_font = () => {
    this.setState({
      displayColorPicker_font: !this.state.displayColorPicker_font,
    });
  };
  
  handleChange_font = (color) => {
    this.change_flag = 1;
    this.setState({body_color:color.hex});
  };
  
  confirmClose=()=>{
    if(this.change_flag == 1){
      this.setState({
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type:"close",
        confirm_alert_title:'入力中',
      });
    } else {
      this.props.closeModal();
    }
  };
  
  render() {
    let {standard_year_list, month_list, day_list } = this.state;
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className="icon-datepicker" onClick={onClick}>
        <Icon icon={faCalendarAlt} className="calendar_icon" />
        <InputBoxTag
          label=""
          type="hidden"
          value = {value}
        />
      </div>
    );
    let back_styles = reactCSS({
      'default': {
        color: {
          width: '36px',
          height: '100%',
          borderRadius: '2px',
          background: this.state.summary_color,
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
          height:'38px'
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
          top:'25px'
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });
    let color_styles = reactCSS({
      'default': {
        color: {
          width: '36px',
          height: '100%',
          borderRadius: '2px',
          background: this.state.body_color,
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
          height:'38px'
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
          top:'25px'
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });
    return  (
      <Modal show={true} id="add_contact_dlg"  className="master-modal register-schedule-modal first-view-modal">
        <Modal.Header><Modal.Title>カレンダー{this.state.number === 0 ? "登録" : "編集"}</Modal.Title></Modal.Header>
        <Modal.Body>
          <DatePickerBox style={{width:"100%", height:"100%"}}>
            <Wrapper>
              <div className={'select-dial-status flex'}>
                <div className={'div-title'}>種類</div>
                <div className={'flex'}>
                  <RadioButton
                    id={'all'}
                    value={0}
                    label={'全体共通スケジュール'}
                    name="schedule_type"
                    getUsage={this.setScheduleType}
                    checked={this.state.schedule_type === 0}
                  />
                  <RadioButton
                    id={'person'}
                    value={1}
                    label={'患者指定のスケジュール'}
                    name="schedule_type"
                    getUsage={this.setScheduleType}
                    checked={this.state.schedule_type === 1}
                  />
                  {this.state.schedule_type === 1 && this.state.system_patient_id != null && (
                    <div style={{fontsize:"1.2rem", lineHeight:"38px"}}>{"（"+this.props.patientInfo.patient_number+" : "+this.props.patientInfo.patient_name+"）"}</div>
                  )}
                </div>
              </div>
              <div className={'select-date flex'}>
                <div className={'div-title'}>日付</div>
                <div className="flex birthday_area">
                  <SelectorWithLabel
                    options={standard_year_list}
                    title=""
                    getSelect={this.getBirthYear.bind(this)}
                    departmentEditCode={this.state.schedule_year}
                  />
                  <span>年</span>
                  <div className="month_day flex">
                    <SelectorWithLabel
                      options={month_list}
                      title=""
                      getSelect={this.getBirthMonth.bind(this)}
                      departmentEditCode={this.state.schedule_month}
                    />
                    <span>月</span>
                    <SelectorWithLabel
                      options={day_list}
                      title=""
                      getSelect={this.getBirth_day.bind(this)}
                      departmentEditCode={this.state.schedule_day}
                    />
                    <span>日</span>
                  </div>
                  <DatePicker
                    locale="ja"
                    selected={this.state.schedule_date}
                    onChange={this.getBirthDate.bind(this)}
                    dateFormat="yyyy/MM/dd"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dayClassName = {date => setDateColorClassName(date)}
                    customInput={<ExampleCustomInput />}
                  />
                </div>
              </div>
              <div className={'summary flex'}>
                <div className={'div-title'}>概要</div>
                <div className={'summary-text'}>
                  <InputWithLabelBorder
                    type="text"
                    id='summary_id'
                    getInputText={this.setSummary.bind(this)}
                    diseaseEditData={this.state.summary}
                  />
                </div>
                <div className={'div-title'} style={{marginLeft:"10px"}}>概要の色</div>
                <div className={'summary-color'}>
                  {this.state.displayColorPicker_back ? (
                    <div style={ back_styles.popover }>
                      <div style={ back_styles.cover } onClick={ this.handleClose }/>
                      <SketchPicker color={ this.state.summary_color } onChange={ this.handleChange_back } />
                    </div>
                  ) : null }
                  <div className="flex">
                    <div style={ back_styles.swatch } onClick={ this.handleClick_back.bind(this) }>
                      <div style={ back_styles.color } />
                    </div>
                    <div className="color-value">{this.state.summary_color}</div>
                  </div>
                </div>
              </div>
              <div className={'body flex'}>
                <div className={'div-title'}>本文</div>
                <textarea onChange={this.setBody.bind(this)} value={this.state.body} id='body_id'> </textarea>
                <div className={'div-title'} style={{marginLeft:"10px"}}>本文の色</div>
                <div className={'body-color'}>
                  {this.state.displayColorPicker_font ? (
                    <div style={ color_styles.popover }>
                      <div style={ color_styles.cover } onClick={ this.handleClose }/>
                      <SketchPicker color={ this.state.body_color } onChange={ this.handleChange_font } />
                    </div>
                  ) : null }
                  <div className="flex">
                    <div style={ color_styles.swatch } onClick={ this.handleClick_font.bind(this) }>
                      <div style={ color_styles.color } />
                    </div>
                    <div className="color-value">{this.state.body_color}</div>
                  </div>
                </div>
              </div>
            </Wrapper>
          </DatePickerBox>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.confirmClose}>キャンセル</Button>
          <Button className={this.change_flag == 1 ? "red-btn" : "disable-btn"} onClick={this.confirmSave}>{this.state.number === 0 ? "登録" : "編集"}</Button>
        </Modal.Footer>
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal= {this.closeModal.bind(this)}
            handleOk= {this.closeModal.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
        {this.state.confirm_message !== "" && (
          <SystemConfirmJapanModal
            hideConfirm= {this.closeModal.bind(this)}
            confirmCancel= {this.closeModal.bind(this)}
            confirmOk= {this.register.bind(this)}
            confirmTitle= {this.state.confirm_message}
            title = {this.state.confirm_alert_title}
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

RegisterSchedule.contextType = Context;

RegisterSchedule.propTypes = {
  closeModal: PropTypes.func,
  schedule_date:PropTypes.string,
  modal_data:PropTypes.array,
  patientInfo:PropTypes.array
};

export default RegisterSchedule;
