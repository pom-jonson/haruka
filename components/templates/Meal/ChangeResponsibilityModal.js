import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import DatePicker, { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import ja from "date-fns/locale/ja";
import HarukaSelectMasterModal from "../../molecules/HarukaSelectMasterModal";
import { faMinusCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as apiClient from "~/api/apiClient";
import { formatDateLine } from "../../../helpers/date";
import * as karteApi from "~/helpers/cacheKarte-utils";
import {CACHE_LOCALNAMES, checkSMPByUnicode} from "~/helpers/constants";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import Spinner from "react-bootstrap/Spinner";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const renderTooltip = (props) => <Tooltip {...props}>{props}</Tooltip>;

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 15px;
  margin-right: 5px;
`;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  display: block;
  font-size: 18px;
  width: 100%;
  height: 100%;
  .flex{
    display:flex;
  }
  .justify-content {
    align-items: flex-start;
    justify-content: space-between;
  }
  .label-title{
    text-align: left;
    width: 130px;
    font-size:16px;
    margin: 0;
    line-height: 38px;
  }
  .pullbox-select{
    width:150px;
  } 
  .input-comment {
    div {
      margin:0;
    }
    input {
      width: calc(100% - 130px);
    }
  } 
  .select-date {
    margin-bottom:0.5rem;
    .label-title {
      line-height:30px;
    }
  }
  .select-doctor {
    display:flex;
    margin-bottom: 0.5rem;
    .selected-doctors {
      width:calc(100% - 130px);
      border:1px solid #aaa;
      height: 100px;
      overflow-y: auto;
      .doctor-name {
        margin-left:0.3rem;
      }
      overflow-y: auto;
      .doctor-name {
        margin-left:0.3rem;
      }
      .delete-icon {
        cursor:pointer;
      }
    }
  }
  .select-box {
    .pullbox-label {
      width: calc(100% - 300px);
      select {width:100%;}
    }
  }
`;

class ChangeResponsibilityModal extends Component {
  constructor(props) {
    super(props);
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    let department_codes = [];
    this.diagnosis = {};
    departmentOptions.map(department=>{
      department_codes.push(department);
      this.diagnosis[parseInt(department.id)] = department.value;
    });
    this.state = {
      moving_day:new Date(),
      openSelectDoctorModal:false,
      selected_doctor_list:[],
      mainDoctor:0,
      nurse_id_in_charge:0,
      deputy_nurse_id:0,
      alert_messages:"",
      alert_type:"",
      team_id:0,
      department_id:0,
      comment:"",
      department_codes,
      alert_title: '',
      confirm_type:"",
      confirm_title:'',
      confirm_message:"",
      load_flag:false,
    };
    this.doctor_list = [];
    let doctor_code_list = [];
    let doctor_data = sessApi.getDoctorList();
    doctor_data.map(doctor=>{
      let index = doctor_code_list.indexOf(doctor.doctor_code);
      if(index === -1){
        doctor_code_list.push(doctor.doctor_code);
        doctor.id = doctor.number;
        doctor.value = doctor.name;
        this.doctor_list.push(doctor);
      }
    });
    this.doctor_list.unshift({id:0,value:''});
    this.nurses_list = [{id:0,value:''}];
    this.team_list = [{id: 0,value: "なし"}];
    this.change_flag = 0;
    this.moving_day = formatDateLine(new Date());
    this.moving_day = new Date(this.moving_day.split('-').join('/')+" 00:00:00");
    this.prev_main_doctor = 0;
    this.prev_main_doctor_name = "";
    this.prev_department_id = 0;
    this.prev_department_name = "";
    this.can_register = false;
  }

  async componentDidMount() {
    this.can_register = this.context.$canDoAction(this.context.FEATURES.CHANGE_RESPONSIBILITY, this.context.AUTHS.REGISTER) ||
      this.context.$canDoAction(this.context.FEATURES.CHANGE_RESPONSIBILITY, this.context.AUTHS.REGISTER_PROXY);
    let path = "/app/api/v2/ward/get/change_responsibility_info";
    let post_data = {
      patient_id:this.props.patientId,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        let mainDoctor = res.main_doctor;
        if(mainDoctor != null && mainDoctor !== 0){
          this.prev_main_doctor = mainDoctor;
          this.prev_main_doctor_name = (this.doctor_list.find((x) => x.id == mainDoctor) !== undefined) ? this.doctor_list.find((x) => x.id == mainDoctor).value : "";
        }
        let selected_doctor_list = res.doctors;
        let nurse_id_in_charge = res.nurse_id_in_charge;
        let deputy_nurse_id = res.deputy_nurse_id;
        let team_id = res.team_id != null ? res.team_id : 0;
        let department_id = res.department_id;
        this.prev_department_id = res.department_id;
        let department_name = res.department_name;
        this.prev_department_name = res.department_name;
        let hos_number = res.hos_number;
        let hos_detail_id = res.hos_detail_id;
        let moving_day = this.state.moving_day;
        if(res.moving_day !== undefined){
          let final_moving_day = new Date(res.moving_day);
          if(final_moving_day.getTime() > this.moving_day.getTime()){
            this.moving_day = final_moving_day;
            moving_day = final_moving_day;
          }
        }
        let comment = "";
        let cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.CHANGE_RESPONSIBILITY);
        if (cache_data !== undefined && cache_data != null){
          mainDoctor = cache_data.mainDoctor;
          selected_doctor_list = cache_data.doctors;
          nurse_id_in_charge = cache_data.nurse_id_in_charge;
          deputy_nurse_id = cache_data.deputy_nurse_id;
          comment = cache_data.comment;
          department_id = cache_data.department_id;
          department_name = cache_data.department_name;
          hos_number = cache_data.hos_number;
          hos_detail_id = cache_data.hos_detail_id;
          team_id = cache_data.team_id;
          moving_day = new Date(cache_data.moving_day);
        }
        if(res.error_message !== undefined){
          this.setState({
            alert_messages:res.error_message,
            alert_type:"modal_close",
          });
          return;
        }
        if(res.nurse_master.length > 0) {
          res.nurse_master.map(item=>{
            this.nurses_list.push({id:item.number, value:item.name});
          });
        }
        if(res.team_master.length > 0) {
          res.team_master.map(item=>{
            this.team_list.push({id:item.number, value:item.name});
          });
        }
        this.setState({
          moving_day,
          mainDoctor,
          selected_doctor_list,
          nurse_id_in_charge,
          team_id,
          deputy_nurse_id,
          comment,
          hos_number,
          hos_detail_id,
          department_id,
          department_name,
          load_flag:true,
        });
      })
      .catch(() => {
      });
  }

  getSearchDate= value => {
    this.change_flag = 1;
    this.setState({
      moving_day: value,
    });
  };

  getFreeCommnet=(e)=>{
    this.change_flag = 1;
    if(e.target.value.length > 25){
      this.setState({alert_messages:"フリーコメントは25文字以内で入力してください。"});
      return;
    }
    this.setState({comment:e.target.value});
  }

  setNurseId = (e) =>{
    this.change_flag = 1;
    this.setState({nurse_id_in_charge: parseInt(e.target.id),});
  };

  setDeputyNurseId = (e) =>{
    this.change_flag = 1;
    this.setState({deputy_nurse_id: parseInt(e.target.id)});
  };

  setDepartmentCode = (e) =>{
    this.change_flag = 1;
    this.setState({
      department_id: parseInt(e.target.id),
      department_name:e.target.value,
    });
  };

  setTeam = (e) =>{
    this.change_flag = 1;
    this.setState({team_id: parseInt(e.target.id)});
  };

  closeModal = () => {
    if(this.state.alert_type === "modal_close"){
      this.props.closeModal();
    }
    this.setState({
      openSelectDoctorModal: false,
      alert_messages: "",
      alert_title: '',
      confirm_type:"",
      confirm_title:'',
      confirm_message:"",
    });
  }

  openSelectDoctorModal=()=>{
    this.setState({openSelectDoctorModal:true});
  }

  selectDoctorFromModal = (doctor) => {
    this.change_flag = 1;
    let selected_doctor_list = this.state.selected_doctor_list;
    if (!selected_doctor_list.includes(doctor.id)){
      selected_doctor_list.push(doctor.id);
    }
    this.setState({
      openSelectDoctorModal:false,
      selected_doctor_list,
    });
  };

  getDoctorName=(id)=>{
    let doctor_name = "";
    let doctor = this.doctor_list.find(x=>x.number==id);
    if(doctor != undefined && doctor != null)
      doctor_name = doctor.name;
    return doctor_name;
  };

  removeDoctor=(index)=>{
    this.change_flag = 1;
    let selected_doctor_list = [];
    this.state.selected_doctor_list.map((doctor, key)=>{
      if(index !== key){
        selected_doctor_list.push(doctor);
      }
    });
    this.setState({selected_doctor_list});
  };

  setMainDoctor=(e)=>{
    this.change_flag = 1;
    this.setState({mainDoctor: parseInt(e.target.id)});
  };

  handleOk = () => {
    if(this.change_flag == 0 || !this.can_register){return;}
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let change_responsibility = {};
    if(this.state.moving_day === '' || this.state.moving_day == null){
      this.setState({
        alert_messages:"変更日を選択してください。",
        alert_title: 'エラー'
      });
      return;
    }    
    if (this.state.deputy_nurse_id != undefined && this.state.deputy_nurse_id != null && this.state.deputy_nurse_id != '' && this.state.deputy_nurse_id == this.state.nurse_id_in_charge) {
      this.setState({
        alert_messages: '同じ看護師が複数選択されています。',
        alert_title: 'エラー'
      });
      return;
    }    
    if (checkSMPByUnicode(this.state.comment)){
      this.setState({
        alert_messages: 'フリーコメントに印刷や医事連携できない可能性のある文字を含んでいます。機種依存文字は他の文字に置き換えてください。',
        alert_title: 'エラー'
      });
      return;
    }

    change_responsibility['moving_day'] = formatDateLine(this.state.moving_day);
    if(this.state.$ === 0){
      this.setState({
        alert_messages:"主担当医を選択してください。",
        alert_title: 'エラー'
      });
      return;
    }
    change_responsibility['mainDoctor'] = this.state.mainDoctor;
    if(this.doctor_list.find((x) => x.id == this.state.mainDoctor) !== undefined){
      change_responsibility['mainDoctor_name'] = this.doctor_list.find((x) => x.id == this.state.mainDoctor).value;
    } else {
      change_responsibility['mainDoctor_name'] = "";
    }
    if(this.prev_main_doctor !== 0){
      change_responsibility['prev_main_doctor'] = this.prev_main_doctor;
      change_responsibility['prev_main_doctor_name'] = this.prev_main_doctor_name;
    }
    change_responsibility['doctors'] = this.state.selected_doctor_list;
    change_responsibility['doctors_name'] = [];
    this.state.selected_doctor_list.map(doctor_id=>{
      if(this.doctor_list.find((x) => x.id == doctor_id) !== undefined){
        change_responsibility['doctors_name'].push(this.doctor_list.find((x) => x.id == doctor_id).value);
      }
    });
    change_responsibility['nurse_id_in_charge'] = this.state.nurse_id_in_charge;
    if(this.nurses_list.find((x) => x.id == this.state.nurse_id_in_charge) !== undefined){
      change_responsibility['nurse_id_in_charge_name'] = this.nurses_list.find((x) => x.id == this.state.nurse_id_in_charge).value;
    } else {
      change_responsibility['nurse_id_in_charge_name'] = "";
    }
    change_responsibility['deputy_nurse_id'] = this.state.deputy_nurse_id;
    if(this.nurses_list.find((x) => x.id == this.state.deputy_nurse_id) !== undefined){
      change_responsibility['deputy_nurse_name'] = this.nurses_list.find((x) => x.id == this.state.deputy_nurse_id).value;
    } else {
      change_responsibility['deputy_nurse_name'] = "";
    }
    change_responsibility['team_id'] = this.state.team_id;
    if(this.team_list.find((x) => x.id == this.state.team_id) !== undefined){
      change_responsibility['team_name'] = this.team_list.find((x) => x.id == this.state.team_id).value;
    } else {
      change_responsibility['team_name'] = "";
    }
    change_responsibility['comment'] = this.state.comment;
    change_responsibility['prev_department_id'] = this.prev_department_id;
    change_responsibility['prev_department_name'] = this.prev_department_name;
    change_responsibility['department_id'] = this.state.department_id;
    change_responsibility['department_name'] = this.state.department_name;
    change_responsibility['hos_number'] = this.state.hos_number;
    change_responsibility['hos_detail_id'] = this.state.hos_detail_id;
    change_responsibility['doctor_code'] = authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code;
    change_responsibility['doctor_name'] = authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name;
    change_responsibility['patient_id'] = this.props.patientId;
    karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.CHANGE_RESPONSIBILITY, JSON.stringify(change_responsibility), 'insert');
    if(this.props.from_mode != "calendar"){
      this.context.$setExaminationOrderFlag(1);
    }
    this.props.closeModal();
  };
  
  confirmCloseModal=()=>{
    if(this.change_flag == 1){
      this.setState({
        confirm_type:"close_modal",
        confirm_title:'入力中',
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
      });
    } else {
      this.props.closeModal();
    }
  }
  
  confirmOk=()=>{
    if(this.state.confirm_type === "close_modal"){
      this.props.closeModal();
    }
  }

  render() {
    return  (
      <Modal show={true} id="add_contact_dlg"  className="change-responsibility-modal first-view-modal">
        <Modal.Header>
          <Modal.Title>担当変更</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DatePickerBox style={{width:"100%", height:"100%"}}>
            <Wrapper>
              {this.state.load_flag ? (
                <div className='content'>
                  <div className="select-date flex">
                    <div className={'label-title'}>変更日</div>
                    {(this.moving_day.getTime() > new Date().getTime()) ? (
                      <OverlayTrigger placement={"top"} overlay={renderTooltip("最新の移動より前の日付は選択できません。")}>
                        <DatePicker
                          locale="ja"
                          selected={this.state.moving_day}
                          onChange={this.getSearchDate.bind(this)}
                          dateFormat="yyyy/MM/dd"
                          placeholderText="年/月/日"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          dayClassName = {date => setDateColorClassName(date)}
                          minDate={this.moving_day}
                        />
                      </OverlayTrigger>
                    ):(
                      <DatePicker
                        locale="ja"
                        selected={this.state.moving_day}
                        onChange={this.getSearchDate.bind(this)}
                        dateFormat="yyyy/MM/dd"
                        placeholderText="年/月/日"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dayClassName = {date => setDateColorClassName(date)}
                        minDate={this.moving_day}
                      />
                    )}
                  </div>
                  <div className="select-box">
                    <SelectorWithLabel
                      options={this.doctor_list}
                      title="主担当医"
                      getSelect={this.setMainDoctor}
                      departmentEditCode={this.state.mainDoctor}
                    />
                  </div>
                  <div className="select-doctor">
                    <div>
                      <div className={'label-title'}>担当医</div>
                      <Button type="common" onClick={this.openSelectDoctorModal.bind(this)}>担当医選択</Button>
                    </div>
                    <div className={'selected-doctors'}>
                      {this.state.selected_doctor_list.length >0 && this.state.selected_doctor_list.map((item, index)=>{
                        return (
                          <>
                            <div className={'flex justify-content'}>
                              <div className={'doctor-name'}>{this.getDoctorName(item)}</div>
                              <div className={'delete-icon'} onClick={this.removeDoctor.bind(this, index)}><Icon icon={faMinusCircle} /></div>
                            </div>
                          </>
                        )
                      })}
                    </div>
                  </div>
                  <div className="select-box">
                    <SelectorWithLabel
                      options={this.nurses_list}
                      title="担当看護師"
                      getSelect={this.setNurseId}
                      departmentEditCode={this.state.nurse_id_in_charge}
                    />
                  </div>
                  <div className="select-box">
                    <SelectorWithLabel
                      options={this.nurses_list}
                      title="副担当看護師"
                      getSelect={this.setDeputyNurseId}
                      departmentEditCode={this.state.deputy_nurse_id}
                    />
                  </div>
                  <div className="select-box">
                    <SelectorWithLabel
                      options={this.state.department_codes}
                      title="診療科"
                      getSelect={this.setDepartmentCode}
                      departmentEditCode={this.state.department_id}
                    />
                  </div>
                  <div className={'input-comment'}>
                    <InputBoxTag
                      label="フリーコメント"
                      type="text"
                      getInputText={this.getFreeCommnet.bind(this)}
                      value={this.state.comment}
                    />
                    <div style={{float:'right'}}>25文字まで</div>
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
          <Button className={'cancel-btn'} onClick={this.confirmCloseModal}>キャンセル</Button>
          <Button
            tooltip={this.can_register ? '' : '権限がありません。'}
            className={(this.can_register && this.change_flag == 1) ? 'red-btn' : 'disable-btn'}
            onClick={this.handleOk}
          >
            確定
          </Button>
        </Modal.Footer>
        {this.state.openSelectDoctorModal && (
          <HarukaSelectMasterModal
            selectMaster = {this.selectDoctorFromModal}
            closeModal = {this.closeModal}
            MasterCodeData = {this.doctor_list}
            MasterName = '医師'
          />
        )}
        {this.state.alert_messages !== "" && (
          <AlertNoFocusModal
            hideModal= {this.closeModal.bind(this)}
            handleOk= {this.closeModal.bind(this)}
            showMedicineContent= {this.state.alert_messages}
            title={this.state.alert_title}
          />
        )}
        {this.state.confirm_message !== "" && (
          <ConfirmNoFocusModal
            hideConfirm= {this.closeModal.bind(this)}
            confirmCancel= {this.closeModal.bind(this)}
            confirmOk= {this.confirmOk}
            confirmTitle= {this.state.confirm_message}
            title = {this.state.confirm_title}
          />
        )}
      </Modal>
    );
  }
}

ChangeResponsibilityModal.contextType = Context;
ChangeResponsibilityModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  patientId: PropTypes.number,
  from_mode: PropTypes.string,
};
export default ChangeResponsibilityModal;
