import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import * as apiClient from "~/api/apiClient";
import {formatDateLine, formatTimeIE} from "~/helpers/date";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import * as karteApi from "~/helpers/cacheKarte-utils";
import {CACHE_LOCALNAMES} from "~/helpers/constants";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import ja from "date-fns/locale/ja";
import DatePicker, { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import { harukaValidate } from "~/helpers/haruka_validate";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Spinner from "react-bootstrap/Spinner";
import $ from 'jquery';
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import OutHospitalGroupDeleteModal from "~/components/templates/Patient/Modals/OutHospital/OutHospitalGroupDeleteModal";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const renderTooltip = (props) => <Tooltip {...props} className={'tooltip-area'}>{props}</Tooltip>;

const Wrapper = styled.div`
  widht: 100%;
  height: 100%;
  overflow-y: auto;
  .flex {display: flex;}
  .div-title {
    line-height: 30px;
    width: 130px;
  }
  .search-date {
    border: 1px solid #aaa;
    width: 200px;
    background: white;
    line-height: 30px;
    height: 30px;
    padding-left: 5px;
  }
  .table-area {
    width: 100%;
    height: calc(100% - 250px);
    border: 1px solid #aaa;
    th {
      text-align: center;
      padding:0;
    }
    td {
      padding:0;
      padding-left:5px;
    }
    .td-no {width: 30px;}
  }
  .react-datepicker-wrapper {
    input {
      width: 195px;
      height: 30px;
    }
  }
  .pullbox {
    .label-title {
      width: 0;
    }
    .pullbox-label {
      margin-bottom: 0;
      select {
        width: 100px;
        height: 30px;
      }
    }
  }
  .outcome-reason {
    .label-title {
      width: 130px;
      line-height: 30px;
      font-size: 16px;
      color: unset;
    }
    .pullbox-label {
      select {width: 200px;}
    }
  }
  .free-comment {
    div {margin-top:0;}
    .label-title {
      width: 130px;
      margin: 0;
      font-size: 16px;
      line-height: 30px;
    }
    input {
      width: 200px;
      height: 30px;
    }
  }
  .select-date{
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
  }
`;

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class KarteDischargeHospitalDecision extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load_flag:false,
      alert_messages:"",
      check_message:"",
      confirm_type:"",
      confirm_title:"",
      confirm_message:"",
      discharge_date:new Date(),
      start_date:new Date(),
      meal_time_classification_master:[{id:0, value:""}],
      outcome_reason_master:[{id:0, value:""}],
      discharge_route_master:[{id:0, value:""}],
      start_time_classification:0,
      outcome_reason_id:0,
      discharge_route_id:0,
      discharge_free_comment:"",
      isOpenOutHospitalGroupDeleteModal:false,
    };
    this.change_flag = 0;
    this.discharge_date = formatDateLine(new Date());
    this.discharge_date = new Date(this.discharge_date.split('-').join('/')+" 00:00:00");
    this.can_register = false;
  }

  async UNSAFE_componentWillMount() {
    this.can_register = this.context.$canDoAction(this.context.FEATURES.DISCHARGE_DECISION,this.context.AUTHS.REGISTER)
      || this.context.$canDoAction(this.context.FEATURES.DISCHARGE_DECISION,this.context.AUTHS.REGISTER_PROXY);
    let cache_exit = this.loadFromCache();
    await this.getDischargePermit(cache_exit);
  }

  getDischargePermit = async (cache_exit) => {
    let path = "/app/api/v2/ward/get/karte_discharge_hospital";
    let post_data = {
      patient_id: this.props.patientId
    };
    await apiClient
      .post(path, {
        params: post_data
      }).then(res=>{
        if(res.error_message !== undefined){
          this.setState({
            alert_messages: res.error_message,
            confirm_type:"close_modal"
          });
          return;
        } else {
          if(res.hos_data.discharge_date != null){
            this.setState({
              alert_messages:"既に退院決定した患者です。",
              confirm_type:"close_modal"
            });
            return;
          }
          let meal_time_classification_master = this.state.meal_time_classification_master;
          let outcome_reason_master = this.state.outcome_reason_master;
          let discharge_route_master = this.state.discharge_route_master;
          if(res.meal_time_classification_master.length > 0){
            res.meal_time_classification_master.map(meal=>{
              meal_time_classification_master.push({id:meal.number, value:meal.name});
            });
          }
          if(res.outcome_reason_master.length > 0){
            res.outcome_reason_master.map(outcome=>{
              outcome_reason_master.push({id:outcome.number, value:outcome.name});
            });
          }
          if(res.discharge_route_master.length > 0){
            res.discharge_route_master.map(outcome=>{
              discharge_route_master.push({id:outcome.number, value:outcome.name});
            });
          }
          let discharge_date = new Date();
          let start_date = new Date();
          if(res.hos_data.expected_discharge_date != null && discharge_date.getTime() < new Date(res.hos_data.expected_discharge_date.split("-").join("/")).getTime()){
            discharge_date = new Date(res.hos_data.expected_discharge_date.split("-").join("/"));
          }
          if(res.hos_data.discharge_date != null && discharge_date.getTime() < new Date(res.hos_data.discharge_date.split("-").join("/")).getTime()){
            discharge_date = new Date(res.hos_data.discharge_date.split("-").join("/"));
          }
          if(res.hos_data.start_date != null){
            start_date = new Date(res.hos_data.start_date.split("-").join("/"))
          }
          if(start_date.getTime() < discharge_date.getTime()){
            start_date = discharge_date;
          }
          let state_data = {
            load_flag:true,
            meal_time_classification_master,
            outcome_reason_master,
            discharge_route_master
          };
          if(!cache_exit){
            state_data.discharge_date = discharge_date;
            state_data.start_date = start_date;
            state_data.start_time_classification = res.hos_data.start_time_classification;
            state_data.outcome_reason_id = res.hos_data.outcome_reason_id;
            state_data.discharge_route_id = res.hos_data.discharge_route_id;
            state_data.discharge_free_comment = res.hos_data.discharge_free_comment;
            state_data.hos_number = res.hos_data.hos_number;
            state_data.hos_detail_id = res.hos_data.id;
            state_data.department_id = res.hos_data.department_id;
          }
          this.setState(state_data);
        }
      })
      .catch(() => {

      });
  };

  componentDidUpdate() {
    harukaValidate('karte', 'hospital', 'discharge_done', this.state, 'background');
  }

  setDateValue = (key,value) => {
    this.change_flag = 1;
    this.setState({[key]:value});
  };

  setSelectorValue = (e) => {
    this.change_flag = 1;
    this.setState({start_time_classification:parseInt(e.target.id)});
  };

  setOutcomeReason = (e) => {
    this.change_flag = 1;
    this.setState({outcome_reason_id:parseInt(e.target.id)});
  };

  setDischargeRoute = (e) => {
    this.change_flag = 1;
    this.setState({discharge_route_id:parseInt(e.target.id)});
  };

  setFreeComment = e => {
    this.change_flag = 1;
    this.setState({discharge_free_comment: e.target.value});
  };

  checkValidation = () => {
    let error_str_arr = [];
    let validate_data = harukaValidate('karte', 'hospital', 'discharge_done', this.state);
    if (validate_data.error_str_arr.length > 0) {
      error_str_arr = validate_data.error_str_arr;
    }
    if (validate_data.first_tag_id != "") {
      this.setState({ first_tag_id: validate_data.first_tag_id });
    }
    return error_str_arr;
  };

  closeValidateAlertModal = () => {
    this.setState({ check_message: "" });
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null) {
      $("#" + first_tag_id).focus();
    }
  };

  handleOk = () => {
    if (!this.can_register) {return;}
    var error = this.checkValidation();
    if (error.length > 0) {
      this.setState({ check_message: error.join("\n") });
      return;
    }
    if(this.validateDate('start_date') == false){
      return;
    }
    this.setState({
      confirm_type:"register",
      confirm_title:"登録確認",
      confirm_message:"退院決定情報を登録しますか？"
    });
  };

  register = async () => {
    let discharge_done = {};
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    discharge_done['doctor_code'] = authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code;
    discharge_done['doctor_name'] = authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name;
    discharge_done.hos_number = this.state.hos_number;
    discharge_done.hos_detail_id = this.state.hos_detail_id;
    discharge_done.patient_id = this.props.patientId;
    discharge_done.moving_day = formatDateLine(this.state.discharge_date)+' '+formatTimeIE(this.state.discharge_date);
    discharge_done.start_date = formatDateLine(this.state.start_date);
    discharge_done.start_time_classification = this.state.start_time_classification;
    discharge_done.start_time_name = (this.state.meal_time_classification_master.find((x) => x.id == this.state.start_time_classification) != undefined) ?
      this.state.meal_time_classification_master.find((x) => x.id == this.state.start_time_classification).value : "";
    discharge_done.department_id = this.state.department_id;
    discharge_done.outcome_reason_id = this.state.outcome_reason_id;
    discharge_done.outcome_reason_name = (this.state.outcome_reason_master.find((x) => x.id == this.state.outcome_reason_id) != undefined) ?
      this.state.outcome_reason_master.find((x) => x.id == this.state.outcome_reason_id).value : "";
    discharge_done.discharge_route_id = this.state.discharge_route_id;
    discharge_done.discharge_route_name = (this.state.discharge_route_master.find((x) => x.id == this.state.discharge_route_id) != undefined) ?
      this.state.discharge_route_master.find((x) => x.id == this.state.discharge_route_id).value : "";
    discharge_done.discharge_free_comment = this.state.discharge_free_comment == null ? "" : this.state.discharge_free_comment;

    // save to cache
    karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.DISCHARGE_DECISION, JSON.stringify(discharge_done), 'insert');
    this.context.$setExaminationOrderFlag(1);
    this.props.closeModal();
  }

  loadFromCache = () => {
    let cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.DISCHARGE_DECISION);
    if (cache_data === undefined || cache_data == null) return false;
    let discharge_date = new Date(cache_data.moving_day.split("-").join("/"));
    let start_date = new Date(cache_data.start_date.split("-").join("/"));
    if(discharge_date.getTime() < this.discharge_date.getTime()){
      discharge_date = this.discharge_date;
    }
    if(start_date.getTime() < this.discharge_date.getTime()){
      start_date = this.discharge_date;
    }
    this.setState({
      load_flag:true,
      hos_number:cache_data.hos_number,
      hos_detail_id:cache_data.hos_detail_id,
      discharge_date,
      start_date,
      start_time_classification:cache_data.start_time_classification,
      start_time_name:cache_data.start_time_name,
      department_id:cache_data.department_id,
      outcome_reason_id:cache_data.outcome_reason_id,
      outcome_reason_name:cache_data.outcome_reason_name,
      discharge_route_id:cache_data.discharge_route_id,
      discharge_route_name:cache_data.discharge_route_name,
      discharge_free_comment:cache_data.discharge_free_comment,
    });
    return true;
  };

  handleSearch = () => {
    this.setState({
      isOpenOutHospitalGroupDeleteModal: true
    });
  }

  confirmCancel=()=>{
    if(this.state.confirm_type == "close_modal"){
      this.props.closeModal();
    }
    this.setState({
      alert_messages:"",
      confirm_type:"",
      confirm_title:"",
      confirm_message:"",
      isOpenOutHospitalGroupDeleteModal:false,
    });
  }

  validateDate=(key)=>{
    let compare_value = "";
    let key_name = "";
    let date_name = "";
    if(key == "discharge_date"){
      compare_value = this.discharge_date.getTime();
      key_name = "退院日時";
      date_name = "本日";
    }
    if(key == "start_date"){
      compare_value = formatDateLine(this.state.discharge_date);
      compare_value = new Date(compare_value.split('-').join('/')+" 00:00:00").getTime();
      key_name = "食事停止日";
      date_name = "退院日";
    }
    if(this.state[key] == null || (this.state[key] != null && formatDateLine(this.state[key].getTime() < compare_value))){
      this.setState({
        confirm_title:"日付エラー",
        alert_messages:key_name+"は"+date_name+"以降の日付を選択してください。"
      });
      return false;
    } else {
      return true;
    }
  }
  
  confirmCloseModal=()=>{
    if(this.change_flag == 1){
      this.setState({
        confirm_type:"modal_close",
        confirm_title:'入力中',
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
      });
    } else {
      this.props.closeModal();
    }
  }
  
  confirmOk=()=>{
    if(this.state.confirm_type === "modal_close"){
      this.props.closeModal();
    }
    if(this.state.confirm_type === "register"){
      this.register();
    }
  }

  render() {
    return  (
      <Modal show={true} id="add_contact_dlg"  className="out-hospitalization-modal first-view-modal">
        <Modal.Header>
          <Modal.Title>退院決定</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DatePickerBox style={{width:"100%", height:"100%"}}>
            <Wrapper>
              <div>退院情報</div>
              {this.state.load_flag ? (
                <div style={{paddingTop:"40px", paddingLeft:"60px"}}>
                  <div className={'flex select-date'}>
                    <div className={'div-title'}>退院日時</div>
                    <DatePicker
                      locale="ja"
                      id='discharge_date_id'
                      selected={this.state.discharge_date}
                      onChange={this.setDateValue.bind(this,"discharge_date")}
                      dateFormat="yyyy/MM/dd HH:mm"
                      timeCaption="時間"
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={10}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      minDate={this.discharge_date}
                      onBlur={this.validateDate.bind(this, 'discharge_date')}
                      dayClassName = {date => setDateColorClassName(date)}
                    />
                  </div>
                  <div style={{paddingTop:"10px"}}>
                    <div className={'flex'}>
                      <div className={'div-title'}>食事停止日</div>
                      <DatePicker
                        locale="ja"
                        id={'start_date_id'}
                        selected={this.state.start_date}
                        onChange={this.setDateValue.bind(this,"start_date")}
                        dateFormat="yyyy/MM/dd"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        minDate={this.state.discharge_date}
                        onBlur={this.validateDate.bind(this, 'start_date')}
                        dayClassName = {date => setDateColorClassName(date)}
                      />
                      <SelectorWithLabel
                        title=""
                        id={'start_time_classification_id'}
                        options={this.state.meal_time_classification_master}
                        getSelect={this.setSelectorValue}
                        departmentEditCode={this.state.start_time_classification}
                      />
                      <div className={'div-title'} style={{paddingLeft:"3px"}}>より停止</div>
                    </div>
                    <div className={'outcome-reason'} style={{paddingTop:"0.5rem"}}>
                      <SelectorWithLabel
                        title="転帰理由"
                        id={'outcome_reason_id_id'}
                        options={this.state.outcome_reason_master}
                        getSelect={this.setOutcomeReason}
                        departmentEditCode={this.state.outcome_reason_id}
                      />
                    </div>
                    <div className={'outcome-reason'} style={{paddingTop:"0.5rem"}}>
                      <SelectorWithLabel
                        title="退院経路"
                        id={'discharge_route_id_id'}
                        options={this.state.discharge_route_master}
                        getSelect={this.setDischargeRoute}
                        departmentEditCode={this.state.discharge_route_id}
                      />
                    </div>
                    <div className={'flex free-comment'} style={{paddingTop:"0.5rem"}}>
                      <InputWithLabelBorder
                        label="フリーコメント"
                        type="text"
                        id={'discharge_free_comment_id'}
                        getInputText={this.setFreeComment.bind(this)}
                        diseaseEditData={this.state.discharge_free_comment}
                      />
                      <div className={'div-title'}>（25文字まで）</div>
                    </div>
                  </div>
                </div>
              ):(
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              )}
            </Wrapper>
          </DatePickerBox>
        </Modal.Body>
        <Modal.Footer>
          <div onClick={this.confirmCloseModal} className={"custom-modal-btn cancel-btn"} style={{cursor:"pointer"}} id='cancel_btn'>
            <span>キャンセル</span>
          </div>
          <div onClick={this.handleSearch} className={"custom-modal-btn red-btn"} style={{cursor:"pointer"}}>
            <span>退院日時後のオーダー検索</span>
          </div>
          {this.can_register ? (
            <div onClick={this.handleOk} className={"custom-modal-btn red-btn"} style={{cursor:"pointer"}}>
              <span>確定</span>
            </div>
          ):(
            <OverlayTrigger placement={"top"} overlay={renderTooltip("権限がありません。")}>
              <div className={"custom-modal-btn disable-btn"}><span>確定</span></div>
            </OverlayTrigger>
          )}
        </Modal.Footer>
        {this.state.check_message !== "" && (
          <ValidateAlertModal
            handleOk={this.closeValidateAlertModal}
            alert_meassage={this.state.check_message}
          />
        )}
        {this.state.isOpenOutHospitalGroupDeleteModal && (
          <OutHospitalGroupDeleteModal
            closeModal={this.confirmCancel}
            discharge_date={this.state.discharge_date}
            patientId={this.props.patientId}
          />
        )}
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal= {this.confirmCancel.bind(this)}
            handleOk= {this.confirmCancel.bind(this)}
            showMedicineContent= {this.state.alert_messages}
            showTitle= {true}
            title = {this.state.confirm_title}
          />
        )}
        {this.state.confirm_message !== "" && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.confirmOk}
            confirmTitle= {this.state.confirm_message}
            title = {this.state.confirm_title}
          />
        )}
      </Modal>
    );
  }
}

KarteDischargeHospitalDecision.contextType = Context;

KarteDischargeHospitalDecision.propTypes = {
  closeModal: PropTypes.func,
  patientId : PropTypes.number,
};

export default KarteDischargeHospitalDecision;
