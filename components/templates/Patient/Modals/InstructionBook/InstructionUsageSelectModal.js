import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import ja from "date-fns/locale/ja";
import DatePicker, { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import Button from "~/components/atoms/Button";
import {formatDateFull} from "~/helpers/date";
import {
  addRedBorder,
  // removeRedBorder
  setDateColorClassName
} from '~/helpers/dialConstants';
import $ from 'jquery';
import ValidateAlertModal from '~/components/molecules/ValidateAlertModal';
import Spinner from "react-bootstrap/Spinner";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`
    overflow-y: auto;
    height: 100%;
    font-size:1rem;
    .right-area {
      padding: 2rem;
      padding-top: 0;
      .table-area table {
        thead{
          display:table;
          width:100%;
        }
        tbody{
            display:block;
            overflow-y: auto;
            height: 4.25rem;
            width:100%;
        }
        tr{
            display: table;
            width: 100%;
        }
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2 !important;}
        td {
          word-break: break-all;
            padding: 0.25rem;
        }
        th {
            position: sticky;
            text-align: center;
            padding: 0.3rem;
        }
        .date {
            width: 10rem;
        }
        .version {
            width: 4rem;
        }
        .w-3 {
          width: 3rem;
        }
        .w-5 {
          width: 5rem;
        }
        .name{
          width:4rem;
        }
      }
      .week-area table {
        td {
          padding: 0.25rem;
          label {
            margin-right: 0;
          }
          border: solid 1px #dee2e6;;
        }
      }
      .date-area {
        display: flex;
        .react-datepicker__input-container input {
          height: 2rem;
          width: 12rem;
        }
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
        label {
          line-height: 2rem;
          margin: 0;
          margin-right: 1rem;
          width: auto;
        }
        .end-date {
          margin-left: 1rem;
        }
      }
      .tab-area{
        margin-top:1rem;
        height: calc(100% - 1.5rem);
        border: solid 1px gray;
        width:93%;
        .content-item {
          text-align: center;
          cursor: pointer;
        }
        .selected {
          background: lightblue;
        }
      }
      .pannel-menu {
        width: 100%;
        margin-bottom: 10px;
        background: lightgray;
        .center-btn {
          border-left: 1px solid gray;
          border-right: 1px solid gray;
        }
        .menu-btn {
            text-align: center;
            border-bottom: 1px solid gray;
            padding: 0.25rem 0;
            cursor: pointer;
        }
        .active-menu {
            text-align: center;
            border-bottom: none;
            padding: 0.25rem 0;
        }
      }
      .radio-text {
        .input-box{
          .label-title {
            width: 0;
          }
          input {
            height: 2rem;
            width: 5rem;
          }
          div {
            margin-top: 0.5rem;
          }
        }
        .radio-box {
          margin-top: 0.5rem;
        }
        .label-suffix {
          margin: 0.5rem 0 0 0.5rem;
          line-height: 2rem;
        }
      }
      .radio-box {
        label {
          font-size: 1rem;
          line-height: 2rem;
        }
      }
      .title-area {
        textarea {
          width: 100%;
          height: calc(100% - 1.5rem);
        }
      }
    }
`;
const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 100px;
  margin-left: 16vw;
  display: table-caption;
  position: absolute;
  top: 230px;
`;

class InstructionUsageSelectModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    let start_date = modal_data !== undefined && modal_data.start_date != undefined && modal_data.start_date != null && modal_data.start_date != "" ? new Date(modal_data.start_date) : new Date();
    let end_date = modal_data !== undefined && modal_data.end_date != undefined && modal_data.end_date != null && modal_data.end_date != "" ? new Date(modal_data.end_date) : "";
    let title = modal_data !== undefined && modal_data.title != undefined && modal_data.title != null && modal_data.title != "" ? modal_data.title : "";
    let number_of_times_per_day = modal_data !== undefined && modal_data.number_of_times_per_day != undefined && modal_data.number_of_times_per_day != null && modal_data.number_of_times_per_day != "" ? modal_data.number_of_times_per_day : "";
    let time_interval_id = modal_data !== undefined && modal_data.time_interval_id != undefined && modal_data.time_interval_id != null && modal_data.time_interval_id != "" ? modal_data.time_interval_id : "";
    let tab_id = 0;
    if (modal_data != undefined && modal_data != null) {
      if (modal_data.usage_class == 2) tab_id = 1;
      else if (modal_data.usage_class == 3) tab_id = 2;
    }
    this.state = {
      confirm_message:"",
      alert_messages:"",
      tab_id,
      one_day_number_master: [],
      target_time_master: [],
      time_interval_master: [],
      isConfirmModal: false,
      confirm_title: '',
      start_date,
      end_date,
      title,
      target_time_info_array: [],
      number_of_interval: '',
      alert_message: '',
      target_time_info_id: '',
      number_of_times_per_day,
      time_interval_id,
      is_loaded: false,
    };
    this.init_state={
      start_date:"",
      end_date:"",
      title,
      target_time_info_id: '',
      number_of_times_per_day: '',
      time_interval_id: '',
      target_time_info_array: [],
    };
  }
  
  async UNSAFE_componentWillMount () {
    await this.getMasterData();
  }
  async getMasterData () {
    let path = "/app/api/v2/master/nurse/nurse_level_search";
    let post_data = {};
    await apiClient.post(path, post_data)
      .then((res) => {
        let {target_time_info_array} = this.state;
        if (this.props.modal_data != undefined && this.props.modal_data != null && this.props.modal_data.target_time_ids != null && this.props.modal_data.target_time_ids != "") {
          target_time_info_array = this.makeTargetTimeArray(this.props.modal_data.target_time_ids, res.target_time_master);
        }
        this.target_time_info_array = target_time_info_array;
        this.setState({
          master_data:res,
          one_day_number_master: res.one_day_number_master,
          target_time_master: res.target_time_master,
          time_interval_master: res.time_interval_master,
          target_time_info_array,
          is_loaded: true,
        });
      });
  }
  
  
  onHide= () => {};
  
  setTab = (tab_id) => {
    this.setState({tab_id});
  };
  confirmCancel() {
    this.modalBlackBack();
    this.setState({
      isConfirmModal: false,
      confirm_message: "",
      confirm_title: '',
      confirm_action:""
    });
  }
  confirmOK () {
    this.confirmCancel();
    if (this.state.confirm_action == "clear") {
      this.setState({selected_instruction_items:[]});
    } else if (this.state.confirm_action == "cancel") {
      this.props.closeModal();
    } else if (this.state.confirm_action == "save") {
      this.confirmSave();
    }
  }
  
  selectTabItem = (state_key, item) => {
    if (state_key == 'target_time_info_id') {
      let {target_time_info_array} = this.state;
      if (target_time_info_array.length > 0 && target_time_info_array.find(x=>x.number == item.number)  != undefined) {
        target_time_info_array = target_time_info_array.filter(x=>x.number != item.number);
      } else {
        target_time_info_array.push(item);
      }
      this.setState({target_time_info_array});
    } else {
      this.setState({[state_key]:item.number});
    }
  }
  
  inArray (array, item) {
    if (array != undefined && array != null && array.length > 0 && item != undefined && item != null && item.number != undefined && array.find(x=>x.number==item.number) != undefined)
      return true;
    else return false;
  }
  
  validate = () => {
    let error_str = [];
    let first_tag_id = '';
    if (this.state.start_date == null || this.state.start_date == '') {
      error_str.push('開始を選択してください。');
      first_tag_id ='start_date_id';
    }
    if (this.state.end_date != null && this.state.end_date != '' && !this.checkDate(this.state.start_date, this.state.end_date)) {
      error_str.push('終了は開始以降の日付を選択してください。');
      addRedBorder('end_date_id');
      if (first_tag_id != '') first_tag_id ='end_date_id';
    }
    if (first_tag_id  != '') this.setState({first_tag_id});
    return error_str;
  }
  checkDate(from, to) {
    from = new Date(from);
    to = new Date(to);
    if (from.getTime() > to.getTime()) return false;
    return true;
  }
  
  save = () => {
    let error_str = this.validate();
    this.modalBlack();
    if (error_str.length > 0 ) {
      this.setState({ alert_message: error_str.join('\n') })
      return;
    }
    this.setState({
      isConfirmModal: true,
      confirm_message: "用法を登録しますか？",
      confirm_action: "save",
      confirm_title: '登録確認'
    });
  }
  confirmSave = async () => {
    let post_data = {
      start_date: this.state.start_date != '' ? formatDateFull(this.state.start_date,"/"):'',
      end_date: this.state.end_date != '' ? formatDateFull(this.state.end_date,"/"):"",
      title: this.state.title,
      number_of_times_per_day: this.state.number_of_times_per_day,
      time_interval_id: this.state.time_interval_id,
      target_time_info_array: this.state.target_time_info_array,
    };
    if (this.state.tab_id == 0) {
      post_data.number_of_times_per_day = null;
      post_data.time_interval_id = null;
      post_data.usage_class = 1;
    } else if (this.state.tab_id == 1) {
      post_data.target_time_info_array = null;
      post_data.time_interval_id = null;
      post_data.usage_class = 2;
    } else {
      post_data.number_of_times_per_day = null;
      post_data.target_time_info_array = null;
      post_data.usage_class = 3;
    }
    this.props.saveUsage(post_data)
  };
  closeAlertModal = () => {
    // removeRedBorder('start_date_id');
    // removeRedBorder('end_date_id');
    this.setState({ alert_message: '' });
    this.modalBlackBack();
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null){
      $('#' + first_tag_id).focus();
    }
  };
  modalBlack() {
    var base_modal = document.getElementsByClassName("instruction-usage-add-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1040;
  }
  modalBlackBack() {
    var base_modal = document.getElementsByClassName("instruction-usage-add-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1050;
  }
  getChangeState () {
    let changed = false;
    Object.keys(this.init_state).map(index=>{
      if (JSON.stringify(this.state[index]) != JSON.stringify(this.init_state[index]))
        changed = true;
    });
    return changed;
  }
  
  getDate = (key,value) => {
    this.setState({[key]: value});
  }
  
  getComment = (e) => {
    this.setState({title: e.target.value});
  }
  
  resetDatePicker = (e) => {
    if (e.target.id == this.state.first_tag_id){
      addRedBorder(e.target.id);
    }
    this.forceUpdate();
  };
  
  makeTargetTimeArray = (numbers, target_time_master) => {
    let {target_time_info_array} = this.state;
    let number_array = numbers.split(",");
    number_array.map(item=>{
      let insert_item = target_time_master.find(x=>x.number == item);
      target_time_info_array.push(insert_item);
    });
    return target_time_info_array;
  }
  
  render() {
    let { target_time_master, one_day_number_master, time_interval_master, target_time_info_array} = this.state;
    let changed = this.getChangeState();
    return (
      <>
        <Modal show={true} className="instruction-usage-add-modal" onHide={this.onHide}>
          <Modal.Header><Modal.Title>用法選択</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
            {this.state.is_loaded ? (
              <Wrapper>
                <div className="right-area">
                  <div className="w-100 mt-3">
                    <div className="date-area mt-2">
                      <div className='start-date'>
                        <label>日付</label>
                        <DatePicker
                          locale="ja"
                          id='start_date_id'
                          selected={this.state.start_date}
                          onChange={this.getDate.bind(this,"start_date")}
                          dateFormat="yyyy/MM/dd HH:mm"
                          timeCaption="時間"
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={10}
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          onBlur = {e => this.resetDatePicker(e)}
                          dayClassName = {date => setDateColorClassName(date)}                          
                        />
                      </div>
                      <div className='end-date'>
                        <label>～</label>
                        <DatePicker
                          locale="ja"
                          id='end_date_id'
                          selected={this.state.end_date}
                          onChange={this.getDate.bind(this,"end_date")}
                          dateFormat="yyyy/MM/dd HH:mm"
                          timeCaption="時間"
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={10}
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          onBlur = {e => this.resetDatePicker(e)}
                          dayClassName = {date => setDateColorClassName(date)}
                        />
                      </div>
                    </div>
                    <div className='title-area flex mt-3'>
                      <div style={{marginRight:'1rem', paddingTop:'4px'}}>表示タイトル（10文字)</div>
                      <input style={{width:'18.6rem'}} onChange={this.getComment.bind(this)} value={this.state.title}></input>
                    </div>
                    <div className="pl-3">
                      <div style={{marginTop:'1rem'}}>時間指定</div>
                      <div className="tab-area">
                        <div className="pannel-menu d-flex w-100">
                          <div className={this.state.tab_id == 0 ? 'active-menu' : 'menu-btn'} onClick={this.setTab.bind(this,0)} style={{width:"33.33%"}}>時間指定</div>
                          <div className={this.state.tab_id == 1 ? 'active-menu center-btn' : 'menu-btn center-btn'} onClick={this.setTab.bind(this,1)} style={{width:"33.33%"}}>１日回数</div>
                          <div className={this.state.tab_id == 2 ? 'active-menu' : 'menu-btn'} onClick={this.setTab.bind(this,2)} style={{width: "33.34%"}}>時間間隔</div>
                        </div>
                        <div className='pannel-content w-100'>
                          {this.state.tab_id == 0 && (
                            target_time_master != undefined && target_time_master.map((item,key)=>{
                              if (key < 8)
                                return (
                                  <div key={key} className="d-flex">
                                    <div className={this.inArray(target_time_info_array, item) ? "selected content-item" : "content-item"} onClick={this.selectTabItem.bind(this,"target_time_info_id", item)} style={{width:"33%"}}>{item.name}</div>
                                    <div className={target_time_master[key+8] != undefined && target_time_master[key+8] != null && this.inArray(target_time_info_array, target_time_master[key+8]) ? "selected content-item" : "content-item"}
                                         onClick={this.selectTabItem.bind(this,"target_time_info_id", target_time_master[key+8])} style={{width:"33%"}}>{target_time_master[key+8] != undefined ? target_time_master[key+8].name : ""}</div>
                                    <div className={target_time_master[key+16] != undefined && target_time_master[key+16] != null && this.inArray(target_time_info_array, target_time_master[key+16]) ? "selected content-item" : "content-item"}
                                         onClick={this.selectTabItem.bind(this,"target_time_info_id", target_time_master[key+16])} style={{width:"33%"}}>{target_time_master[key+16] != undefined ? target_time_master[key+16].name : ""}</div>
                                  </div>
                                )
                            })
                          )}
                          {this.state.tab_id == 1 && (
                            one_day_number_master != undefined && one_day_number_master.map((item,key)=>{
                              if (key < 8)
                                return (
                                  <div key={key} className="d-flex">
                                    <div className={this.state.number_of_times_per_day == item.number ? "selected content-item" : "content-item"} onClick={this.selectTabItem.bind(this,"number_of_times_per_day", item)} style={{width:"33%"}}>{item.name}</div>
                                    <div className={one_day_number_master[key+8] != undefined && one_day_number_master[key+8] != null && this.state.number_of_times_per_day == one_day_number_master[key+8].number ? "selected content-item" : "content-item"}
                                         onClick={this.selectTabItem.bind(this,"number_of_times_per_day", one_day_number_master[key+8])} style={{width:"33%"}}>{one_day_number_master[key+8] != undefined ? one_day_number_master[key+8].name : ""}</div>
                                    <div className={one_day_number_master[key+16] != undefined && one_day_number_master[key+16] != null && this.state.number_of_times_per_day == one_day_number_master[key+16].number ? "selected content-item" : "content-item"}
                                         onClick={this.selectTabItem.bind(this,"number_of_times_per_day", one_day_number_master[key+16])} style={{width:"33%"}}>{one_day_number_master[key+16] != undefined ? one_day_number_master[key+16].name : ""}</div>
                                  </div>
                                )
                            })
                          )}
                          {this.state.tab_id == 2 && (
                            time_interval_master != undefined && time_interval_master.map((item,key)=>{
                              if (key < 8)
                                return (
                                  <div key={key} className="d-flex">
                                    <div className={this.state.time_interval_id == item.number ? "selected content-item" : "content-item"} onClick={this.selectTabItem.bind(this,"time_interval_id", item)} style={{width:"33%"}}>{item.name}</div>
                                    <div className={time_interval_master[key+8] != undefined && time_interval_master[key+8] != null && this.state.time_interval_id == time_interval_master[key+8].number ? "selected content-item" : "content-item"}
                                         onClick={this.selectTabItem.bind(this,"time_interval_id", time_interval_master[key+8])} style={{width:"33%"}}>{time_interval_master[key+8] != undefined ? time_interval_master[key+8].name : ""}</div>
                                    <div className={time_interval_master[key+16] != undefined && time_interval_master[key+16] != null && this.state.time_interval_id == time_interval_master[key+16].number ? "selected content-item" : "content-item"}
                                         onClick={this.selectTabItem.bind(this,"time_interval_id", time_interval_master[key+16])} style={{width:"33%"}}>{time_interval_master[key+16] != undefined ? time_interval_master[key+16].name : ""}</div>
                                  </div>
                                )
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Wrapper>
            ):(
                <div className='text-center'>
                  <SpinnerWrapper>
                    <Spinner animation="border" variant="secondary" />
                  </SpinnerWrapper>
                </div>
            )}
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            <Button className={changed ? "red-btn" : "disable-btn"} onClick={this.save}>確定</Button>
          </Modal.Footer>
          {this.state.isConfirmModal != false && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.confirmOK.bind(this)}
              confirmTitle= {this.state.confirm_message}
              title={this.state.confirm_title}
            />
          )}
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
          {this.state.alert_message != "" && (
            <ValidateAlertModal
              handleOk={this.closeAlertModal}
              alert_meassage={this.state.alert_message}
            />
          )}
        </Modal>
      </>
    );
  }
}

InstructionUsageSelectModal.contextType = Context;
InstructionUsageSelectModal.propTypes = {
  closeModal: PropTypes.func,
  saveUsage: PropTypes.func,
  modal_data:PropTypes.object
};

export default InstructionUsageSelectModal;