import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Button from "../atoms/Button";
import Context from "~/helpers/configureStore";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import * as apiClient from "~/api/apiClient";
import styled from "styled-components";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from "jquery";
import {addRedBorder, removeRedBorder, addRequiredBg, removeRequiredBg, toHalfWidthOnlyNumber} from "~/helpers/dialConstants";
import NumberFormat from 'react-number-format';

const Wrapper = styled.div`
  width: 100%;
  #dial_note_id{
    min-height:150px;
  }
  .title-label{
    text-align: right!important;
    width: 5rem!important;
    margin-right: 0.625rem!important;
    line-height:2.5rem;
    text-align:right;
    margin-bottom:0;
  }
  .hankaku-eng-num-input {
    ime-mode: inactive;
    input{
      ime-mode: inactive;
    }
  }
  input {
    font-size: 0.875rem;
    width: 8rem;
    height: 2.5rem;
    border-radius: 4px;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(206, 212, 218);
    border-image: initial;
    padding: 0px 8px;
  }
  .number-input-area {
    .value-area {
      width:calc(100% - 7.5rem);
    }
    input {
      text-align:right;
    }
    .tall {
      line-height: 2.5rem;
      margin-left: 0.3rem;
    }
  }
  .end-date {
    label {
      width:1rem;
      text-align:center;
      margin: 0;
      line-height: 2.5rem;
    }
  }
  .start-date {
    label {
      width: 0;
      margin: 0;
    }
  }
  .flex{
      display:flex;
  }
}
`;

class MoveList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startdate: (props.modal_data !== undefined && props.modal_data != null && props.modal_data.moving_period_start_date != null) ? new Date(props.modal_data.moving_period_start_date) : "",
      enddate: (props.modal_data !== undefined && props.modal_data != null && props.modal_data.moving_period_end_date != null) ? new Date(props.modal_data.moving_period_end_date) : "",
      dial_times: (props.modal_data !== undefined && props.modal_data != null && props.modal_data.number_of_dialysis != null) ? props.modal_data.number_of_dialysis : 0,
      dial_note: (props.modal_data !== undefined && props.modal_data != null && props.modal_data.remarks != null) ? props.modal_data.remarks : "",
      number:(props.modal_data !== undefined && props.modal_data != null && props.modal_data.number !== undefined && props.modal_data.number > 0) ? props.modal_data.number : 0,
      isUpdateConfirmModal: false,
      isCloseConfirmModal:false,
      confirm_message: "",
      alert_message:''
    };
    this.registering_flag = false;
    this.change_flag = false;
    this.original = JSON.stringify(this.state);
  }

  componentDidMount () {
    this.changeBackground();
  }

  componentDidUpdate () {
    this.changeBackground();

    // eslint-disable-next-line consistent-this
    const that = this;
    let dial_times_id_obj = document.getElementById("dial_times_id");
    if(dial_times_id_obj !== undefined && dial_times_id_obj != null){
      dial_times_id_obj.addEventListener('focus', function(){
        that.setCaretPosition('dial_times_id',dial_times_id_obj.value);
      });
    }
  }

  setCaretPosition =(elemId, value)=> {
    let caretPos = value.toString().length;
    var elem = document.getElementById(elemId);
    var range;
    if(elem != null) {
      if(elem.createTextRange) {
        range = elem.createTextRange();
        range.move('character', caretPos);
        range.select();
      } else {
        elem.focus();
        if(elem.selectionStart !== undefined) {
          elem.setSelectionRange(caretPos, caretPos);
        }
      }
    }
  }

  changeBackground = () => {
    if (this.state.startdate == "") {
      addRequiredBg("startdate_id");
    } else {
      removeRequiredBg("startdate_id");
    }
    if (this.state.enddate == "") {
      addRequiredBg("enddate_id");
    } else {
      removeRequiredBg("enddate_id");
    }
    if (this.state.dial_times == 0) {
      addRequiredBg("dial_times_id");
    } else {
      removeRequiredBg("dial_times_id");
    }
  }

  handleTimesChange =( value )=> {
    let input_value = value.value.replace(/[^0-9０-９]/g, '');
    if (input_value.length > 9) {
      let dial_times = this.state.dial_times;
      this.setState({dial_times: dial_times}, ()=>{
        // this.setCaretPosition("dial_count_number_id", cur_dial_count_number.toString().length);
      });
      return;
    }
    if (input_value != "") {
      input_value = parseInt(toHalfWidthOnlyNumber(input_value));
    }
    this.setState({ dial_times:input_value });
  };

  handleNoteChane = e => {
    this.setState({ dial_note: e.target.value})
  }

  checkValidation () {
    removeRedBorder('startdate_id');
    removeRedBorder('enddate_id');
    removeRedBorder('dial_times_id');
    let error_str_arr = [];
    let error_arr = [];

    var startdate = this.state.startdate;
    var enddate = this.state.enddate;
    startdate = (startdate != null && startdate !== "") ? this.formatDate(startdate):"";
    enddate = (enddate != null && enddate !== "") ? this.formatDate(enddate):"";
    if(startdate === ""){
      error_str_arr.push("移動期間の開始日を入力してください。");
      error_arr.push({
        state_key: 'startdate',
        error_msg: "移動期間の開始日を入力してください。",
        error_type: 'blank',
        tag_id:'startdate_id'
      });
      addRedBorder('startdate_id')
    }
    if(enddate === ""){
      error_str_arr.push("移動期間の終了日を入力してください。");
      error_arr.push({
        state_key: 'enddate',
        error_msg: "移動期間の終了日を入力してください。",
        error_type: 'blank',
        tag_id:'enddate_id'
      });
      addRedBorder('enddate_id')
    }
    if(this.state.dial_times === null || this.state.dial_times === 0 || this.state.dial_times === ""){
      error_str_arr.push('透析回数を入力してください。');
      error_arr.push({
        state_key: 'enddate',
        error_msg: '透析回数を入力してください。',
        error_type: 'blank',
        tag_id:'dial_times_id'
      });
      addRedBorder('dial_times_id');
    }

    if (this.state.dial_note != '' && this.state.dial_note.length > 100){
      error_str_arr.push('備考は100文字以下で入力してください。');
      error_arr.push({
        state_key: 'dial_note',
        error_msg: '備考は100文字以下で入力してください。',
        error_type: 'blank',
        tag_id:'dial_note_id'
      });
      addRedBorder('dial_note_id');
    }
    this.setState({error_arr});
    return error_str_arr;
  }

  handleOk = async () => {
    if (this.change_flag == false) return;
    if(this.registering_flag) return;
    var error = this.checkValidation();
    if (error.length > 0){
      this.setState({alert_message:error.join('\n')});
      return;
    }
    this.setState({
      isUpdateConfirmModal:true,
      confirm_message:this.state.number>0?'変更しますか？':'登録しますか？'
    })
  }

  closeAlertModal = () => {
    this.setState({alert_message: ''});
    if(this.state.error_arr.length > 0){
      let first_obj = this.state.error_arr[0];
      $("#" + first_obj.tag_id).focus();
    }
  }

  register = async() => {
    this.confirmCancel();
    this.change_flag = false;
    var startdate = this.state.startdate;
    var enddate = this.state.enddate;
    startdate = (startdate != null && startdate !== "") ? this.formatDate(startdate):"";
    enddate = (enddate != null && enddate !== "") ? this.formatDate(enddate):"";

    var post_data = {
      moving_period_start_date: startdate,
      moving_period_end_date: enddate,
      number_of_dialysis: this.state.dial_times,
      remarks: this.state.dial_note,
      number:this.state.number,
    };
    post_data.patient_id = this.props.patient_id;
    this.registering_flag = true;

    let path = "/app/api/v2/dial/patient/registerMoveList";
    await apiClient
       ._post(path, {
           params: post_data
       })
       .then((res) => {
           if (res){
               if(this.state.number > 0){
                   window.sessionStorage.setItem("alert_messages", "移動履歴を変更しました。");
               } else {
                   window.sessionStorage.setItem("alert_messages", "移動履歴を登録しました。");
               }
               this.props.handleOk(res);
           } else {
               window.sessionStorage.setItem("alert_messages", "移動履歴項目を正確に入力してください。");
           }
           this.registering_flag = false;
       })
       .catch(() => {
           window.sessionStorage.setItem("alert_messages", "移動履歴項目を正確に入力してください。");
       }).finally(()=>{
           this.registering_flag = false;
       });
  }


  getStartdate = value => {
    this.setState({startdate: value});
  }
  getEnddate = value => {
    this.setState({enddate: value});
  }

  formatDate  = dt => {
    var y = dt.getFullYear();
    var m = ("00" + (dt.getMonth() + 1)).slice(-2);
    var d = ("00" + dt.getDate()).slice(-2);
    var result = y + "-" + m + "-" + d;
    return result;
  };

  confirmCancel() {
    this.setState({
        isUpdateConfirmModal: false,
        isCloseConfirmModal:false,
        confirm_message: "",
    });
  }

  close = () => {
      if (this.change_flag){
        this.setState({
          isCloseConfirmModal:true,
          confirm_message:'登録していない内容があります。\n変更内容を破棄して移動しますか？'
        })
      } else {
        this.closeThisModal();
      }
  }

  closeThisModal = () => {
    this.confirmCancel();
    this.props.closeModal();
    this.change_flag = false;
  }

  render() {
    if (this.original != JSON.stringify(this.state)){
      this.change_flag = true;
    } else {
      this.change_flag = false;
    }
    return  (
      <Modal show={true} id="moveList_dlg" className="custom-modal movelist-modal master-modal first-view-modal">
        <Modal.Header><Modal.Title>患者移動履歴{this.state.number === 0 ? '追加' : '編集'}</Modal.Title></Modal.Header>
        <Modal.Body>
            <Wrapper>
                <div className="flex mb-2">
                  <label className='title-label' style={{lineHeight:"2.5rem", marginTop:"8px"}}>移動期間</label>
                  <div className={'start-date'}>
                    <InputWithLabelBorder
                      label=""
                      type="date"
                      getInputText={this.getStartdate}
                      diseaseEditData={this.state.startdate}
                      id = 'startdate_id'
                    />
                  </div>
                  <div className={'end-date'}>
                    <InputWithLabelBorder
                      label="～"
                      type="date"
                      getInputText={this.getEnddate}
                      diseaseEditData={this.state.enddate}
                      id = 'enddate_id'
                    />
                  </div>
                </div>
                <div className={'flex mb-2 number-input-area'}>
                  <div className={'title-label'}>透析回数</div>
                  <div className={'flex value-area'}>
                    <NumberFormat
                      id = 'dial_times_id'
                      className="hankaku-eng-num-input"
                      thousandSeparator={true}
                      value={this.state.dial_times}
                      onValueChange={this.handleTimesChange.bind(this)}
                    />
                    <span className="tall">回</span>
                  </div>
                </div>
                <div>
                    <span>備考</span>
                    <textarea id = 'dial_note_id' onChange={this.handleNoteChane.bind(this)}>{this.state.dial_note}</textarea>
                </div>

            </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className='cancel-btn' onClick={this.close}>キャンセル</Button>
          <Button className={this.change_flag ? "red-btn" : "disable-btn"} onClick={this.handleOk}>{this.state.number === 0 ? '登録' : '変更'}</Button>
        </Modal.Footer>
        {this.state.isUpdateConfirmModal !== false && (
          <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.register.bind(this)}
              confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.isCloseConfirmModal !== false && (
          <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.closeThisModal.bind(this)}
              confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.alert_message != "" && (
          <ValidateAlertModal
            handleOk={this.closeAlertModal}
            alert_meassage={this.state.alert_message}
          />
        )}
      </Modal>
    );
  }
}

MoveList.contextType = Context;

MoveList.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  patient_id: PropTypes.number,
  modal_data: PropTypes.array,
};

export default MoveList;
