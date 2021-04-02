import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Button from "~/components/atoms/Button";
import ja from "date-fns/locale/ja";
import DatePicker, { registerLocale } from "react-datepicker";
import {formatDateLine} from "~/helpers/date";
registerLocale("ja", ja);
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`  
  width: 100%;
  height: 100%;
  font-size: 1rem;
  overflow-y:auto;
  .flex{display: flex;}
  .select-date {
    text-align:center;
    .react-datepicker{
      width: 130% !important;
      font-size: 1.25rem;
      .react-datepicker__month-container{
        width:79% !important;
        height:24.375rem;
      }
      .react-datepicker__navigation--next--with-time{
        right: 6rem;
      }
      .react-datepicker__time-container{
        width:21% !important;
      }
      .react-datepicker__time-box{
        width:auto !important;
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
    input {
      width:12rem;
      height:2rem;
      font-size:1rem;
      text-align:center;
    }
  }
  .text-area {
    width:100%;
    height:5rem;
    overflow-y:auto;
    border: 1px solid #aaa;
    textarea {
      width: 100%;
      height: 100%;
      border: none;
    }
  }
`;

class SelectDoneReservationDateTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      done_date: "",
      done_comment: "",
      alert_messages: "",
    };
    this.done_date = new Date(formatDateLine(new Date()).split('-').join('/')+' 00:00:00');
    this.change_flag = 0;
  }
  
  setDateValue = (key,value) => {
    this.change_flag = 1;
    this.setState({[key]:value});
  };
  
  selectCurrentTime=()=>{
    this.change_flag = 1;
    this.setState({done_date:new Date()});
  }
  
  setTextValue = (e) => {
    this.change_flag = 1;
    if(e.target.value.length > 50){
      this.setState({alert_messages: "実施コメントは５０文字以内で入力してください。"});
    } else {
      this.setState({done_comment: e.target.value});
    }
  }
  
  confirmRegister=()=>{
    if(this.change_flag == 0){
      return;
    }
    this.props.closeModal('open_input_result');
  }
  
  closeModal=()=>{
    this.setState({alert_messages: ""});
  }

  render() {
    return (
      <>
        <Modal
          show={true}
          className="custom-modal-sm select-done-reservation-date-time first-view-modal"
        >
          <Modal.Header><Modal.Title>実施／予定日時</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                <div className={'select-date'}>
                  <DatePicker
                    locale="ja"
                    id='discharge_date_id'
                    selected={this.state.done_date}
                    onChange={this.setDateValue.bind(this,"done_date")}
                    dateFormat="yyyy/MM/dd HH:mm"
                    timeCaption="時間"
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={10}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    minDate={this.done_date}
                    dayClassName = {date => setDateColorClassName(date)}
                  />
                </div>
                <div style={{width:"100%", textAlign:"center", marginTop:"0.5rem"}}>
                  <button onClick={this.selectCurrentTime}>現在時刻をセット</button>
                </div>
                <div style={{marginTop:"0.5rem", lineHeight:"2rem"}}>実施コメント</div>
                <div> ※５０文字以内で入力してください。</div>
                <div className={'text-area'}>
                  <textarea
                    value={this.state.done_comment}
                    style={{width:"100%", height:"100%"}}
                    onChange={this.setTextValue.bind(this)}
                  ></textarea>
                </div>
              </Wrapper>
            </DatePickerBox>  
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            <Button className={this.change_flag == 1 ? 'red-btn' : 'disable-btn'} onClick={this.confirmRegister}>確定</Button>
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
        </Modal>
      </>
    );
  }
}

SelectDoneReservationDateTime.propTypes = {
  closeModal: PropTypes.func,
};

export default SelectDoneReservationDateTime;
