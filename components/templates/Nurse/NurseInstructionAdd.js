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
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import Radiobox from "~/components/molecules/Radiobox";
import Checkbox from "~/components/molecules/Checkbox";
import {formatDateFull, formatDateTimeIE} from "~/helpers/date";
import {
  addRedBorder,
  // removeRedBorder
  setDateColorClassName
} from '~/helpers/dialConstants';
import $ from 'jquery';
import ValidateAlertModal from '~/components/molecules/ValidateAlertModal';
import Spinner from "react-bootstrap/Spinner";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const SpinnerWrapper = styled.div`
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
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
          margin-left: 3rem;
        }
      }
      .tab-area{
        height: calc(100% - 1.5rem);
        border: solid 1px gray;
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
      .comment-area {
        textarea {
          width: 100%;
          height: calc(100% - 1.5rem);
        }
      }
    }
`;
const week_days = ["日", "月", "火", "水", "木", "金", "土", "毎日"];

class NurseInstructionAdd extends Component {
  constructor(props) {
    super(props);
    var start_date = new Date();    
    if (this.props.selected_td_date != undefined && this.props.selected_td_date != ''){
      start_date = formatDateTimeIE(this.props.selected_td_date);
    } else{
      if (this.props.instruction_item != undefined && this.props.instruction_item != null && this.props.instruction_item != ''){
        start_date = formatDateTimeIE(this.props.instruction_item.start_date);
      }
    }

    this.state = {
      guidance_date:(props.guidance_date !== undefined && props.guidance_date != null) ? new Date(props.guidance_date) : new Date(),
      table_data:[],
      confirm_message:"",
      alert_messages:"",
      data_tree: [],
      tab_id: 0,
      master_data:[],
      incidental_attribute_master: [],
      incidental_level_master: [],
      nurse_instruction_item_level_master: [],
      nurse_instruction_slip_master: [],
      one_day_number_master: [],
      target_time_master: [],
      time_interval_master: [],
      usage_control_master: [],
      selected_instruction_items: [],
      isConfirmModal: false,
      confirm_title: '',
      selected_incidental_array: [],
      selected_usage_array: [],
      final_week_days: 0,
      checkalldays: {0: false,1: false,2: false,3: false,4: false,5: false,6: false,7: false},
      selected_item_number: null,
      start_date,
      end_date: '',
      target_time_info_array: [],
      number_of_interval: '',
      alert_message: '',
      implementation_interval_class: '',
      comment:'',
      weekly_bit : '',
      target_time_info_id: '',
      number_of_times_per_day: '',
      time_interval_id: '',
      is_loaded: false,
    };
    this.init_state={
      start_date,
      end_date: '',
      comment:'',
      implementation_interval_class: '',
      number_of_interval: '',
      weekly_bit : '',
      target_time_info_id: '',
      number_of_times_per_day: '',
      time_interval_id: '',
      target_time_info_array: [],
    };
  }
  
  async componentDidMount () {
    this.getMasterData();
  }
  async getMasterData () {
    let path = "/app/api/v2/master/nurse/nurse_level_search";
    let post_data = {};
    await apiClient.post(path, post_data)
      .then((res) => {
        let selected_incidental_array = this.state.selected_incidental_array;
        if (res.incidental_level_master.length > 0) {
          res.incidental_level_master.map(item=>{
            if (item.item_level_id == this.props.instruction_item.number) {
              selected_incidental_array.push(item);
            }
          })
        }
        let usage_control_master = [];
        if (res.usage_control_master != null && res.usage_control_master.length > 0) {
          usage_control_master = res.usage_control_master.find(x=>x.item_level_id == this.props.instruction_item.number);
        }
        let final_week_days = 0;
        let number_of_interval = '';
        let implementation_interval_class = '';
        let number_of_times_per_day = '';
        let time_designation = '';
        let time_interval = '';
        let checkalldays = this.state.checkalldays;
        let {target_time_info_array} = this.state;
        if (usage_control_master != undefined) {
          final_week_days = usage_control_master.weekly_bit != null ? usage_control_master.weekly_bit : 0;
          number_of_interval = usage_control_master.number_of_interval != null ? usage_control_master.number_of_interval: '';
          implementation_interval_class = usage_control_master.implementation_interval_class != null ? usage_control_master.implementation_interval_class: '';
          number_of_times_per_day = usage_control_master.number_of_times_per_day != null ? usage_control_master.number_of_times_per_day: '';
          time_designation = usage_control_master.time_designation != null ? usage_control_master.time_designation: '';
          time_interval = usage_control_master.time_interval != null ? usage_control_master.time_interval: '';
          if (res.target_time_master != null && res.target_time_master.length > 0 && time_designation != '') {
            let find_time_target = res.target_time_master.find(x=>x.number == time_designation);
            if (find_time_target != undefined) target_time_info_array.push(find_time_target);
          }
          if (final_week_days != '') {
            var weekday = parseInt(final_week_days);
            for (var i = 0; i < 7; i++) {
              var pval = Math.pow(2, i);
              if ((weekday & pval) > 0) {
                checkalldays[i] = true;
              } else {
                checkalldays[i] = false;
              }
            }
            if (final_week_days == 127) checkalldays[7] = true;
          }
        }
        this.setState({
          master_data:res,
          incidental_attribute_master: res.incidental_attribute_master,
          incidental_level_master: res.incidental_level_master,
          nurse_instruction_item_level_master: res.nurse_instruction_item_level_master,
          nurse_instruction_slip_master: res.nurse_instruction_slip_master,
          one_day_number_master: res.one_day_number_master,
          target_time_master: res.target_time_master,
          time_interval_master: res.time_interval_master,
          usage_control_master,
          selected_incidental_array,
          implementation_interval_class,
          final_week_days,
          number_of_interval,
          number_of_times_per_day,
          time_interval_id:time_interval,
          checkalldays,
          target_time_info_array,
          is_loaded: true,
        });
      });
  }
  closeModal=()=>{
    this.setState({
      confirm_message:"",
      confirm_type:"",
      alert_messages:"",
    });
  };
  maincloseModal = () => {
    if (this.props.readOnly) this.props.closeModal();
    if (this.getChangeState()) {
      this.modalBlack();
      this.setState({
        confirm_message: "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_title: '入力中',
        isConfirmModal: true,
        confirm_action: "cancel"
      });
      return;
    }
    this.props.closeModal();
  };
  setValue = (key,e) => {
    this.setState({[key]: e.target.value});
  };
  addInstruction = () => {
    this.setState({addInstructionModal: true});
  };
  onHide= () => {};
  showDetail = (index) => {
    let data_tree = this.state.data_tree;
    data_tree[index].detail_show = data_tree[index].detail_show == 1 ? 0 : 1;
    this.setState({data_tree});
  }
  resetDatePicker = (e) => {
    if (e.target.id == this.state.first_tag_id){
      addRedBorder(e.target.id);
    }
    this.forceUpdate();
  };
  getDate = (key,value) => {
    this.setState({[key]: value});
  }
  getComment = (e) => {
    this.setState({comment: e.target.value});
  }
  getKind (e){
    this.setState({
      implementation_interval_class:e.target.value,
      number_of_interval: '',
    })
  }
  getRadio = async (key,name,value) => {
    if (name === "check") {
      this.setState({[key]:value});
    }
  };
  getText = (key, e) => {
    if (key == 'number_of_interval') {
      if (e.target.value.toString().length > 4) return;
      var RegExp = /^[0-9０-９]*$/;
      if (!RegExp.test(e.target.value)) {
        return;
      }
    }
    this.setState({[key]: e.target.value});
  };
  setTab = (tab_id) => {
    if(this.props.readOnly) return;
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
  addDay = (value) => {
    let checkalldays = this.state.checkalldays;
    checkalldays[value] = checkalldays[value] ? false : true;
    var final_week_days = parseInt(this.state.final_week_days);
    if (value != 7) {
      var pval = Math.pow(2, value);
      final_week_days =
        (final_week_days & pval) > 0
          ? final_week_days - pval
          : final_week_days + pval;
      checkalldays[7] = final_week_days == 127 ? true : false;
    } else {
      for (var i= 0; i< 7; i++)
        checkalldays[i] = checkalldays[value];
      final_week_days = checkalldays[value] ? 127 : 0;
    }
    this.setState({ final_week_days, checkalldays });
  };
  saveData = () => {
    let {selected_instruction_items} = this.state;
    let instruction_item = selected_instruction_items.find(x=>x.number == this.state.selected_item_number);
    if (instruction_item == undefined || instruction_item == null) return;
    let selected_incidental_array = this.state.selected_incidental_array;
    let selected_incidental_item = this.state.incidental_level_master.find(x=>x.item_level_id == instruction_item.number);
    if (selected_incidental_item == undefined) return;
    if (selected_incidental_item != undefined && selected_incidental_array.findIndex(x=>x.number == selected_incidental_item.number) == -1) {
      selected_incidental_array.push(selected_incidental_item);
    }
    this.setState({
      selected_incidental_array,
      // selected_item_number: null,
    });
  };
  
  selectTabItem = (state_key, item) => {
    if (this.props.readOnly) return;
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
    if (this.props.instruction_item == undefined || this.props.instruction_item.number == null) {
      error_str.push('看護指示を選択してください。');
      addRedBorder('instruction_list_id');
    }
    if (this.state.start_date == null || this.state.start_date == '') {
      error_str.push('開始を選択してください。');
      first_tag_id ='start_date_id';
    }
    if (this.state.end_date != null && this.state.end_date != '' && !this.checkDate(this.state.start_date, this.state.end_date)) {
      error_str.push('終了は開始以降の日付を選択してください。');
      addRedBorder('end_date_id');
      if (first_tag_id != '') first_tag_id ='end_date_id';
    }
    if (this.state.implementation_interval_class == undefined || this.state.implementation_interval_class == null || this.state.implementation_interval_class == '') {
      error_str.push('実施間隔区分を選択してください。');
    }
    if (this.state.implementation_interval_class > 1 && this.state.number_of_interval == '') {
      error_str.push('間隔数を入力してください。');
      addRedBorder('number_of_interval_id');
      if (first_tag_id != '') first_tag_id = 'number_of_interval_id';
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
    if (this.props.readOnly) return;
    let error_str = this.validate();
    this.modalBlack();
    if (error_str.length > 0 ) {
      this.setState({ alert_message: error_str.join('\n') })
      return;
    }
    this.setState({
      isConfirmModal: true,
      confirm_message: "看護指示を登録しますか？",
      confirm_action: "save",
      confirm_title: '登録確認'
    });
  }
  confirmSave = async () => {
    let post_data = {
      patient_id: this.props.patientId,
      selected_incidental_array: this.state.selected_incidental_array,
      start_date: this.state.start_date != '' ? formatDateFull(this.state.start_date,"-"):'',
      end_date: this.state.end_date != '' ? formatDateFull(this.state.end_date,"-"):'',
      comment: this.state.comment,
      implementation_interval_class: this.state.implementation_interval_class,
      number_of_interval: this.state.number_of_interval,
      weekly_bit: this.state.final_week_days,
      target_time_info_id: this.state.target_time_info_id,
      number_of_times_per_day: this.state.number_of_times_per_day,
      time_interval_id: this.state.time_interval_id,
      target_time_info_array: this.state.target_time_info_array,
      item_level_id: this.props.instruction_item.number
    };
    // this.props.handleOk(post_data, this.props.selected_open_mode);
    // this.props.closeModal();
    let path = "/app/api/v2/nurse/register_nurse_instruction";
    await apiClient.post(path, {params: post_data})
      .then((res) => {
        if (res.alert_message != undefined) {
          window.sessionStorage.setItem("alert_messages", res.alert_message);
          this.props.closeModal(1);
        }
      })
      .catch(() => {
      
      });
  };
  closeAlertModal = () => {
    // removeRedBorder('instruction_list_id');
    // removeRedBorder('number_of_interval_id');
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
    var base_modal = document.getElementsByClassName("nurse_instruction_add")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1040;
  }
  modalBlackBack() {
    var base_modal = document.getElementsByClassName("nurse_instruction_add")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1050;
  }
  getAttribute = (incidental_level_id) => {
    if (incidental_level_id == undefined || incidental_level_id == null || incidental_level_id == '') return null;
    let find_attribute = this.state.incidental_attribute_master.filter(x=>x.incidental_level_id == incidental_level_id);
    return find_attribute;
  }
  getChangeState () {
    let changed = false;
    Object.keys(this.init_state).map(index=>{
      if (JSON.stringify(this.state[index]) != JSON.stringify(this.init_state[index]))
        changed = true;
    });
    return changed;
  }
  
  render() {
    let {selected_incidental_array, target_time_master, one_day_number_master, time_interval_master, target_time_info_array} = this.state;
    let {instruction_item} = this.props;
    return (
      <>
        <Modal show={true} className="nurse_instruction_add" onHide={this.onHide}>
          <Modal.Header><Modal.Title>看護指示（新規指示入力）</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                {this.state.is_loaded ? (
                  <div className="right-area">
                    <div className="w-100 text-right">
                      <button>初期表示</button>
                    </div>
                    <div className="border p-1 w-50 text-left">{instruction_item.name}</div>
                    <div className="date-area mt-2">
                      <div className='start-date'>
                        <label>開始</label>
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
                          disabled = {this.props.readOnly}
                          dayClassName = {date => setDateColorClassName(date)}
                        />
                      </div>
                      <div className='end-date'>
                        <label>終了</label>
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
                          disabled = {this.props.readOnly}
                          dayClassName = {date => setDateColorClassName(date)}
                        />
                      </div>
                    </div>
                    <div className="w-100 mt-3">
                      <div>付帯情報</div>
                      <div className="border" style={{height:"5rem",overflowY:"scroll"}}>
                        {selected_incidental_array.length > 0 && selected_incidental_array.map((item, key)=>{
                          let attribute = this.getAttribute(item.number);
                          return (
                            <>
                              <div key={key} className="border-bottom">{item.name}</div>
                              {attribute != null && attribute.length > 0 && attribute.map((attri_item, attri_key)=>{
                                return(
                                  <div key={attri_key} className="ml-3">{attri_item.name}</div>
                                )
                              })}
                            </>
                          )
                        })}
                      </div>
                      <div className='comment-area mt-3'>
                        <div>コメント</div>
                        <textarea
                          onChange={this.getComment.bind(this)}
                          value={this.state.comment}
                          disabled = {this.props.readOnly}
                        ></textarea>
                      </div>
                    </div>
                    <div className="w-100 d-flex mt-3">
                      <div className="w-50 pr-3 week-area">
                        <div>日数指定</div>
                        <div className='radio-box'>
                          <Radiobox
                            id = {1}
                            label={'単日指定'}
                            value={1}
                            getUsage={this.getKind.bind(this)}
                            checked={this.state.implementation_interval_class == 1 ? true : false}
                            name={`kind`}
                            isDisabled = {this.props.readOnly}
                          />
                        </div>
                        <div className="d-flex radio-text">
                          <div className="radio-box">
                            <Radiobox
                              id = {2}
                              label={'間隔'}
                              value={2}
                              getUsage={this.getKind.bind(this)}
                              checked={this.state.implementation_interval_class == 2 ? true : false}
                              name={`kind`}
                              isDisabled = {this.props.readOnly}
                            />
                          </div>
                          <div className='input-box'>
                            <InputWithLabelBorder
                              label=""
                              type="number"
                              id='number_of_interval_id'
                              getInputText={this.getText.bind(this,'number_of_interval')}
                              diseaseEditData={this.state.implementation_interval_class == 2 ? this.state.number_of_interval : ""}
                              isDisabled={this.state.implementation_interval_class != 2 || this.props.readOnly}
                            />
                          </div>
                          <label className="label-suffix">日ごと</label>
                        </div>
                        <div className="d-flex radio-text">
                          <div className="radio-box">
                            <Radiobox
                              id = {3}
                              label={'間隔'}
                              value={3}
                              getUsage={this.getKind.bind(this)}
                              checked={this.state.implementation_interval_class == 3 ? true : false}
                              name={`kind`}
                              isDisabled = {this.props.readOnly}
                            />
                          </div>
                          <div className="input-box">
                            <InputWithLabelBorder
                              label=""
                              type="number"
                              id='number_of_interval_id'
                              getInputText={this.getText.bind(this,'number_of_interval')}
                              diseaseEditData={this.state.implementation_interval_class == 3 ? this.state.number_of_interval : ""}
                              isDisabled={this.state.implementation_interval_class != 3 || this.props.readOnly}
                            />
                          </div>
                          <label className="label-suffix">週ごと</label>
                        </div>
                        <table className="table table-border mt-3">
                          <tr>
                            {week_days.map((item, key)=>{
                              return (<>
                                <td style={{width:"2.3rem"}} className='text-center' key={key}>{item}</td>
                              </>)})}
                          </tr>
                          <tr>
                            {week_days.map((item, key)=>{
                              return (<>
                                <td className="text-center check" key={key}>
                                  <Checkbox
                                    label=""
                                    id={`week_day_${key}`}
                                    getRadio={this.addDay.bind(this,key)}
                                    value={this.state.checkalldays[key]}
                                    name="check"
                                    isDisabled = {this.props.readOnly}
                                  />
                                </td>
                              </>)})}
                          </tr>
                        </table>
                      </div>
                      <div className="w-50 pl-3">
                        <div>時間指定</div>
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
                ):(
                  <SpinnerWrapper>
                    <Spinner animation="border" variant="secondary" />
                  </SpinnerWrapper>
                )}
              </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.maincloseModal}>キャンセル</Button>
            <Button className={this.props.readOnly ? 'disable-btn' : "red-btn"} onClick={this.save}>確定</Button>
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

NurseInstructionAdd.contextType = Context;
NurseInstructionAdd.propTypes = {
  closeModal: PropTypes.func,
  guidance_date: PropTypes.string,
  instruction_item: PropTypes.object,
  patientId: PropTypes.number,
  readOnly: PropTypes.bool,
  selected_td_date: PropTypes.object,
  selected_open_mode: PropTypes.string,
  handleOk: PropTypes.func
};

export default NurseInstructionAdd;
