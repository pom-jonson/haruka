import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import * as apiClient from "~/api/apiClient";
import Button from "~/components/atoms/Button";
import {formatDateLine, formatTimeIE} from "~/helpers/date";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`  
  width: 100%;
  height: 100%;
  font-size: 1rem;
  overflow-y:auto;
  .flex{display: flex;}
  .view-date {
    margin-right:0.5rem;
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
    .react-datepicker-wrapper {
      input {
        text-align:center;
        width: 10rem;
        height: 2rem;
      }
    }
  }
 .memo-area {
    width: 100%;
    margin-top: 0.5rem;
    height: calc(40vh - 15rem);
    textarea {
      width: 100%;
      height: 100%;
    }
 }
 .react-datepicker-wrapper {
   input {
    height: 2.3rem;
    width: 7rem;
    font-size:1rem;
   }
 }
`;

class EditPassingTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passing_of_time:props.modal_data.passing_of_time,
      record_date:new Date(props.modal_data.record_date.split('-').join('/')),
      confirm_message:"",
      confirm_type:"",
      confirm_alert_title:'',
    };
    this.change_flag = 0;
  }
  
  setPassingTime = e => {
    this.change_flag = 1;
    this.setState({passing_of_time: e.target.value})
  };
  
  setDateValue = (key,value) => {
    if(value == "" || value == null){
      value = new Date();
    }
    this.change_flag = 1;
    this.setState({[key]:value});
  };
  
  confirmCloseModal=()=>{
    if(this.change_flag == 1){
      this.setState({
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type:"close_modal",
        confirm_alert_title:'入力中',
      });
    } else {
      this.props.closeModal();
    }
  }
  
  confirmSave=()=>{
    this.setState({
      confirm_message:"経時記録を編集しますか？",
      confirm_type:"register",
      confirm_alert_title:'編集確認',
    });
  }
  
  closeModal=()=>{
    this.setState({
      confirm_message:"",
      confirm_type:"",
      confirm_alert_title:''
    });
  }
  
  confirmOk=()=>{
    if(this.state.confirm_type == "close_modal"){
      this.props.closeModal();
      return;
    }
    if(this.state.confirm_type == "register"){
      this.register();
    }
  }
  
  register=async()=>{
    this.setState({
      confirm_message:"",
      confirm_type:"",
      confirm_title:"",
    });
    let path = "/app/api/v2/nurse/progress_chart/register_passing_time";
    let post_data = {
      number:this.props.modal_data.number,
      passing_of_time:this.state.passing_of_time,
      record_date: formatDateLine(this.state.record_date)+' '+formatTimeIE(this.state.record_date),
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.props.closeModal('register', res.error_message != undefined ? res.error_message : res.success_message);
      })
      .catch(() => {
      
      });
  };

  render() {
    return (
      <>
        <Modal show={true} className="custom-modal-sm edit-passing-time first-view-modal">
          <Modal.Header><Modal.Title>経時記録編集</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                <div className={'view-date'}>
                  <DatePicker
                    locale="ja"
                    selected={this.state.record_date}
                    onChange={this.setDateValue.bind(this,"record_date")}
                    dateFormat="yyyy/MM/dd HH:mm"
                    timeCaption="時間"
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={10}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dayClassName = {date => setDateColorClassName(date)}
                  />
                </div>
                <div className='memo-area'>
                  <textarea
                    onChange={this.setPassingTime.bind(this)}
                    value={this.state.passing_of_time}
                    id="passing_of_time_id"
                  />
                </div>
              </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.confirmCloseModal}>キャンセル</Button>
            <Button className={this.change_flag ? "red-btn" : "disable-btn"} onClick={this.confirmSave}>{"確定"}</Button>
          </Modal.Footer>
          {this.state.confirm_message !== "" && (
            <ConfirmNoFocusModal
              hideConfirm= {this.closeModal.bind(this)}
              confirmCancel= {this.closeModal.bind(this)}
              confirmOk= {this.confirmOk.bind(this)}
              confirmTitle= {this.state.confirm_message}
              title={this.state.confirm_alert_title}
            />
          )}
        </Modal>
      </>
    );
  }
}

EditPassingTime.propTypes = {
  closeModal: PropTypes.func,
  modal_data: PropTypes.object,
};

export default EditPassingTime;
