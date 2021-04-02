import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import Checkbox from "~/components/molecules/Checkbox";
import RadioButton from "~/components/molecules/RadioInlineButton";
import DatePicker, { registerLocale } from "react-datepicker";
import { formatJapanDate, formatDateLine} from "~/helpers/date";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import {makeList_data, makeList_code, extract_enabled, makeList_codeName,addRedBorder, addRequiredBg, removeRequiredBg,removeRedBorder, setDateColorClassName} from "~/helpers/dialConstants";
import * as sessApi from "~/helpers/cacheSession-utils";
import {getTimeZoneList} from "~/components/templates/Dial/DialMethods/getSystemTimeZone";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from 'jquery';
import Spinner from "react-bootstrap/Spinner";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const SpinnerWrapper = styled.div`
  height: 12.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  float: left;
  .flex{
    display:flex;
    margin-top:10px;
    label{
      font-size:1rem;
    }
  }  
  label {
    text-align: right;
    width: 145px;    
  }
  .label{
    padding-top:0.5rem;
    font-size:1rem;
  }
  .label-title{
    font-size:1rem
  }
  input {
    width: 265px;
    font-size: 1rem;
  }  
  .patient_id, .patient_name{
    font-size:25px;
  }
  .schedule_date{
    margin-top:0.5rem;
    margin-bottom:0.5rem;
    font-size:1rem
  }
  .modal_container{
    padding-left:20px;
  }
  .react-datepicker-wrapper {
      width: fit-content;
      border: 1px solid;
      margin-left:10px;
      padding: 5px;
      .example-custom-input{
        font-size:20px;
      }
  }
  .modal_container{
    .pullbox{
      margin-top:0.5rem;
    }
    .pullbox-title{
      width: 145px;
      text-align: right;
      padding-right: 10px;
    }
    .pullbox-label, .pullbox-select{
      width:265px;
    }
  }

  .radio-btn label{
    width: 60px;
    border: solid 1px rgb(206, 212, 218);
    border-radius: 4px;
    margin: 0 5px;
    padding: 4px 5px;
  }

  .other_moves_group{
    .include-label{
      margin-left: -10px;
      font-size:1rem;
    }
    .checkbox-area label {
      width: 75px;
      font-size: 1rem;
    }
  }
  .schedule_time {
    label {
      padding-right: 10px;
      margin-right: -5px;
    }
  }

  .checkbox_area {
    padding-left: 15px;
    margin-top:0.5rem;
    margin-left: 113px;
    margin-bottom: 15px;
    label{
      text-align:left;
      font-size:1rem;
      width:128px;
    }
  }  
  .new_schedule_date{
    text-align: center;
    margin-left:-70px;
  }

  .radio-btn label{
    font-size:1rem;
  } 
}
 `;

class EditMoveDateModal extends Component {
  constructor(props) {
    super(props);
    let time_zone_list = getTimeZoneList();
    var schedule_date = this.props.schedule_date;
    var system_patient_id = this.props.system_patient_id;
    this.getScheduleItem(system_patient_id, schedule_date);

    this.state = {
      schedule_date,
      system_patient_id,
      time_zone_list,    
      new_schedule_date:new Date(schedule_date),
      move_date_flag:1,

      injection_move:1,
      inspection_move:1,
      prescription_move:1,
      manage_move:1,
      group:0,
      reservation_time:'',
      time_zone:'',
      bed_no:'',
      console:'',
      isUpdateConfirmModal: false,

      isConfirmComplete: false,
      isCloseConfirmModal: false,
      complete_message: '',
      confirm_alert_title:'',
      alert_message:'',
      is_loaded: false,
    }
    this.double_click=false;
  }

  componentDidMount(){
    var schedule_date = this.props.schedule_date;
    var system_patient_id = this.props.system_patient_id;
    this.getScheduleItem(system_patient_id, schedule_date);
    this.setChangeFlag(0);
    let bed_master = sessApi.getObjectValue("dial_common_master","bed_master");
    let console_master = sessApi.getObjectValue("dial_common_master","console_master");
    let code_master = sessApi.getObjectValue("dial_common_master","code_master");
    this.setState({
      bed_master,
      bed_master_number_list:makeList_data(extract_enabled(bed_master)),
      console_master,
      console_master_code_list:makeList_code(extract_enabled(console_master)),
      console_master_code_options:makeList_codeName(extract_enabled(console_master)),
      dial_group_codes:makeList_codeName(extract_enabled(code_master['グループ'])),
    });
    this.setReservationRange();
  }
  
  componentWillUnmount() {
    sessApi.remove('dial_change_flag');
  }

  async getScheduleItem(system_patient_id, schedule_date){
    let path = "/app/api/v2/dial/schedule/dial_schedule_item";
    let post_data = {
      params:{"schedule_date":schedule_date, "system_patient_id":system_patient_id, 'request_source':'schedule_menu'},
    }
    await apiClient.post(path, post_data)
      .then((res) => {
        this.setState({
            schedule_item:res,
            reservation_time:res.dial_pattern.reservation_time,
            group:res.dial_pattern.group,
            time_zone:res.dial_pattern.time_zone,
            bed_no:res.dial_pattern.bed_no,
            console:res.dial_pattern.console,
            pre_start_confirm_at:res.pre_start_confirm_at,
            is_loaded: true,
        });
      });
  }

  openConfirmCompleteModal =(message)=>{
    this.setState({
        isConfirmComplete:true,
        complete_message: message,
    });
  }

  getValue = (key, e) => {   
    this.setChangeFlag(1); 
    switch(key){
      case 'reservation_time':
          this.setState({
              reservation_time: e.target.value,
          });
        break;
      case 'time_zone':
          this.setState({
              time_zone: e.target.id
          });
        break;
      case 'bed_no':        
          if (e.target.id != 0){
            let default_console = this.state.bed_master.find(x => x.number === parseInt(e.target.id)).default_console_code;
            if(default_console !=null && default_console !== '' && this.state.console_master_code_list[default_console] != undefined){
                this.setState({console:default_console});
            }
          }
          this.setState({
              bed_no: parseInt(e.target.id)
          });
          break;
      case 'console':
          this.setState({
              console: parseInt(e.target.id)
          });
          break;
      case 'group':
          this.setState({
              group: e.target.id
          });
          break;
    }
  };

    setReservationRange () {
        let dial_tiems = [
            { id: 0, value: "" },
            { id: 1, value: "03:00" },
            { id: 2, value: "03:30" },
            { id: 3, value: "04:00" },
            { id: 4, value: "04:30" },
            { id: 5, value: "04:45" },
            { id: 6, value: "05:00" },
            { id: 7, value: "06:00" },
            { id: 8, value: "06:30" },
            { id: 9, value: "07:00" },
            { id: 10, value: "" },
        ];
        let index = 11;
        for(let hour = 1; hour < 8; hour++){
            for(let minutes = 0; minutes < 60; minutes+=5){
                let dial_tiem = '';
                if(minutes < 10){
                    dial_tiem = {id: index, value: "0" + hour + ":" + "0" + minutes};
                } else {
                    dial_tiem = {id: index, value: "0" + hour + ":" + minutes};
                }
                dial_tiems[index]= dial_tiem;
                index++;
            }
        }
        dial_tiems[index]= {id: index, value: "08:00"};
        this.setState({dial_tiems,})
    }

  changeMoveDateSetting = (name, value) => {
    if (name == 'move_date_setting'){      
        this.setState({move_date_flag:value});
    }
  }

  getDate = value => {
    this.setChangeFlag(1);
    this.setState({
      new_schedule_date: value,
    });
  };

  changeScheduleTime = (e) => {
    this.setChangeFlag(1);
    this.setState({
        time_zone:e.target.value
    });
    
  }
  confirmCancel() {
    this.setState({
      confirm_message:'',
      isUpdateConfirmModal:false,
      isConfirmComplete:false,
      isCloseConfirmModal:false,
      complete_message: '',
      confirm_alert_title:''
    })
  }

  moveSchedule = async() => {
    this.confirmCancel();
    let path = "/app/api/v2/dial/schedule/dial_schedule_move";
    if (this.double_click == true) return;
    this.double_click = true;
    this.openConfirmCompleteModal('保存中');

    const post_data = {
        params: {
            number:this.state.schedule_item.number,
            system_patient_id:this.state.schedule_item.system_patient_id,
            schedule_date:formatDateLine(this.state.new_schedule_date),
            reservation_time:this.state.reservation_time,
            group:this.state.group,
            time_zone:this.state.time_zone,
            bed_no:this.state.bed_no,
            console:this.state.console,
            injection:this.state.injection_move,
            prescription:this.state.prescription_move,
            inspection:this.state.inspection_move,
            manage:this.state.manage_move,
        }
    };
    await apiClient.post(path, post_data)
      .then(() => {          
          this.props.closeModal();
          this.props.handleOk(this.state.schedule_item);
          window.sessionStorage.setItem("alert_messages", "変更完了##" + "スケジュールを変更しました。");
      })
      .finally(()=>{
        this.double_click=false;
        this.confirmCancel();
      });
  }

  checkValidation = () => {    
    removeRedBorder('group_id');
    removeRedBorder('reservation_time_id');
    removeRedBorder('bed_no_id');
    removeRedBorder('console_id');
    let error_str_arr = [];
    let first_tag_id = '';
    var tag_ids = [];    
    if (this.state.group == undefined || this.state.group == null || this.state.group == '' || this.state.group == 0 ) {
      error_str_arr.push('グループを選択してください');
      addRedBorder('group_id');
      tag_ids.push('group_id');
    }
    if (this.state.reservation_time == undefined || this.state.reservation_time == null || this.state.reservation_time == '' || this.state.reservation_time == 0 ) {
      error_str_arr.push('透析時間を選択してください');
      addRedBorder('reservation_time_id');      
      tag_ids.push('reservation_time_id');
    }
    if (this.state.bed_no == undefined || this.state.bed_no == null || this.state.bed_no == '' || this.state.bed_no == 0 ) {
      error_str_arr.push('ベッド番号を選択してください');
      addRedBorder('bed_no_id');   
      tag_ids.push('bed_no_id');
    }
    if (this.state.console == undefined || this.state.console == null || this.state.console == '' || this.state.console == 0 ) {
      error_str_arr.push('コンソールを選択してください');
      addRedBorder('console_id');
      tag_ids.push('console_id');
    }
    if (tag_ids.length>0) first_tag_id = tag_ids[0];
    this.setState({ first_tag_id });    
    return error_str_arr;
  }

  handleOK = async() => {
    if (this.state.move_date_flag === 0) return;
    if(this.context.$canDoAction(this.context.FEATURES.DIAL_SYSTEM, this.context.AUTHS.EDIT) === false) {
      window.sessionStorage.setItem("alert_messages", '変更権限がありません。');
      return;
    }
    
    let error_str_array = this.checkValidation();
    if(this.state.pre_start_confirm_at != null && this.state.pre_start_confirm_at !== ""){
      error_str_array.unshift("透析開始前確認を完了したスケジュールは変更できません。");            
    }

    if (error_str_array.length > 0) {
      this.setState({ alert_message: error_str_array.join('\n') })
      return;
    }
    this.setState({
      isUpdateConfirmModal: true,
      confirm_message:"スケジュール情報を変更しますか？",
    })
  }

  checkOtherScheduleMove = (name, value) => {
    this.setChangeFlag(1);
    switch(name){
      case "injection":
        this.setState({injection_move:value});
        break;
      case "prescription":
        this.setState({prescription_move:value});
        break;
      case "inspection":
        this.setState({inspection_move:value});
        break;
      case "manage":
        this.setState({manage_move:value});
        break;
    }
  }

  onHide=()=>{}

  setChangeFlag=(change_flag)=>{
      this.change_flag = change_flag;
      this.setState({change_flag});
      if (change_flag){
          sessApi.setObjectValue('dial_change_flag', 'edit_move_date_modal', 1)
      } else {
          sessApi.remove('dial_change_flag');
      }
  };

  closeAlertModal = () => {
    this.setState({ alert_message: '' });
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null){
      $('#' + first_tag_id).focus()
    }
  }

  closeModal = () => {
    let nFlag = sessApi.getObjectValue('dial_change_flag', 'edit_move_date_modal');
    if (nFlag == 1) {      
      this.setState({
        isCloseConfirmModal:true,
        confirm_message:'登録していない内容があります。\n変更内容を破棄して閉じますか？', 
        confirm_alert_title:'入力中',
      })
    } else {
      this.confirmCloseOk();      
    }
    // this.props.closeModal();    
  };

  confirmCloseOk = () => {
    this.setState({confirm_alert_title:''})
    this.props.closeModal();
  }

  componentDidUpdate () {
    this.changeBackground();
  }

  changeBackground = () => {    
    if (this.state.group == undefined || this.state.group == null || this.state.group == '' || this.state.group == 0 ) {
      addRequiredBg("group_id");
    } else {
      removeRequiredBg("group_id");
    }
    if (this.state.reservation_time == undefined || this.state.reservation_time == null || this.state.reservation_time == '' || this.state.reservation_time == 0 ) {
      addRequiredBg("reservation_time_id");
    } else {
      removeRequiredBg("reservation_time_id");
    }
    if (this.state.bed_no == undefined || this.state.bed_no == null || this.state.bed_no == '' || this.state.bed_no == 0 ) {
      addRequiredBg("bed_no_id");
    } else {
      removeRequiredBg("bed_no_id");
    }
    if (this.state.console == undefined || this.state.console == null || this.state.console == '' || this.state.console == 0 ) {
      addRequiredBg("console_id");
    } else {
      removeRequiredBg("console_id");
    }
  }

  render() {    
    let data_changed = sessApi.getObjectValue("dial_change_flag","edit_move_date_modal");
    let {schedule_item} = this.state;
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className="cur-date morning example-custom-input" onClick={onClick}>
          {formatJapanDate(value)}
      </div>
    );

    return  (
      <Modal show={true} onHide={this.onHide}  className="master-modal first-view-modal edit-date-move-modal">
        <Modal.Header>
          <Modal.Title>透析スケジュール移動</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DatePickerBox style={{width:"100%", height:"100%"}}>
            {schedule_item != undefined && this.state.is_loaded ?(
              <Wrapper>
                <div className='modal_header'>
                  <div className="schedule_date">{formatJapanDate(schedule_item.schedule_date)}</div>
                  <span className="patient_id">{schedule_item.patient_id} : </span>
                  <span className="patient_name">{this.state.schedule_item.patient_name}</span>                
                </div>
                <div className="modal_container">
                  {/* <SelectorWithLabel
                      options={dailysis_facilities}
                      title="透析施設"
                      isDisabled={(this.state.move_date_flag===0)?true:false}
                      // getSelect={this.getValue.bind(this, 'dailysis_facilities')}
                      // departmentEditCode={this.state.schedule_item.schedule_time}                                            
                  />                 */}
                  <SelectorWithLabel
                        options={this.state.dial_group_codes}
                        title="グループ"
                        getSelect={this.getValue.bind(this, 'group')}
                        isDisabled={(this.state.move_date_flag === 0)?true:false}
                        departmentEditCode={this.state.group}
                        id = 'group_id'
                    />
                  <div className="flex">
                      <SelectorWithLabel
                          title="透析時間"
                          options={this.state.dial_tiems != undefined && this.state.dial_tiems != null && this.state.dial_tiems}
                          getSelect={this.getValue.bind(this,"reservation_time")}
                          value={this.state.reservation_time}
                          isDisabled={(this.state.move_date_flag === 0) ? true : false}
                          id = 'reservation_time_id'
                      />
                  </div>
                  
                  <div className  ="flex schedule_time">
                      <label className="label">時間帯</label>
                      <>
                          {this.state.time_zone_list != undefined && this.state.time_zone_list.length>0 &&(
                              this.state.time_zone_list.map((item)=>{
                                  return (
                                      <>
                                          <RadioButton
                                              id={`male_${item.id}`}
                                              value={item.id}
                                              label={item.value}
                                              name="schedule_time"
                                              isDisabled={(this.state.move_date_flag===0)?true:false}
                                              getUsage={this.changeScheduleTime.bind(this)}
                                              checked={this.state.time_zone == item.id ? true : false}
                                          />
                                      </>
                                  );
                              })
                          )}
                      </>
                  </div>
                  <SelectorWithLabel
                      options={this.state.bed_master_number_list}
                      title="ベッド番号"
                      getSelect={this.getValue.bind(this, 'bed_no')}
                      isDisabled={(this.state.move_date_flag===0)?true:false}
                      departmentEditCode={this.state.bed_no}
                      id='bed_no_id'
                  />
                  <SelectorWithLabel
                      options={this.state.console_master_code_options}
                      title="コンソール"
                      getSelect={this.getValue.bind(this, 'console')}
                      isDisabled={(this.state.move_date_flag===0)?true:false}
                      departmentEditCode={this.state.console}
                      id='console_id'
                  />
                  <div className="other_moves_group flex">
                    <label className="include-label">移動対象に含める</label>
                    <div className="checkbox-area">
                      <Checkbox
                        label="注射"
                        getRadio={this.checkOtherScheduleMove.bind(this)}
                        value={this.state.injection_move}
                        isDisabled={(this.state.move_date_flag===0)?true:false}
                        name="injection"
                      />
                      <Checkbox
                        label="処方"
                        getRadio={this.checkOtherScheduleMove.bind(this)}
                        value={this.state.prescription_move}
                        isDisabled={(this.state.move_date_flag===0)?true:false}
                        name="prescription"
                      />
                      <Checkbox
                        label="検査"
                        getRadio={this.checkOtherScheduleMove.bind(this)}
                        value={this.state.inspection_move}
                        isDisabled={(this.state.move_date_flag===0)?true:false}
                        name="inspection"
                      />
                      <Checkbox
                        label="管理料"
                        getRadio={this.checkOtherScheduleMove.bind(this)}
                        value={this.state.manage_move}
                        isDisabled={(this.state.move_date_flag===0)?true:false}
                        name="manage"
                      />
                  </div>
                  </div>
                  <div className="checkbox_area">
                    {/* <Checkbox
                      label="指定日へ移動"
                      getRadio={this.changeMoveDateSetting.bind(this)}
                      value={this.state.move_date_flag}                    
                      name="move_date_setting"
                    /> */}
                    {/* <label className="checkbox-label">指定日へ移動</label> */}
                  </div>
                  <div className="new_schedule_date">
                    <DatePicker
                        locale="ja"
                        selected={this.state.new_schedule_date}
                        onChange={this.getDate.bind(this)}
                        dateFormat="yyyy/MM/dd"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dayClassName = {date => setDateColorClassName(date)}
                        disabled={(this.state.move_date_flag===0)?true:false}                      
                        customInput={<ExampleCustomInput />}
                    />
                  </div>
                </div>              
              </Wrapper>
            ):(
              <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
              </SpinnerWrapper>
            )}
          </DatePickerBox>
        </Modal.Body> 
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
          <Button className={data_changed == 1 ? "red-btn" : "disable-btn"} onClick={this.handleOK.bind(this)}>登録</Button>
        </Modal.Footer>       
        {this.state.isUpdateConfirmModal == true && (
          <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.moveSchedule.bind(this)}
              confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.isConfirmComplete !== false && (
            <CompleteStatusModal
                message = {this.state.complete_message}
            />
        )}
        {this.state.isCloseConfirmModal !== false &&  (
            <SystemConfirmJapanModal
                hideConfirm= {this.confirmCancel.bind(this)}
                confirmCancel= {this.confirmCancel.bind(this)}
                confirmOk= {this.confirmCloseOk}
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
      </Modal>
      
    );
  }
}

EditMoveDateModal.contextType = Context;

EditMoveDateModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk:PropTypes.func,  
  schedule_date : PropTypes.string,
  system_patient_id : PropTypes.number,

};

export default EditMoveDateModal;
