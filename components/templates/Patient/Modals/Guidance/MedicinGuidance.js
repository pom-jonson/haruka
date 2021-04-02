import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import InputWithLabel from "~/components/molecules/RemComponents/InputWithLabel";
registerLocale("ja", ja);
import Checkbox from "~/components/molecules/Checkbox";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Radiobox from "~/components/molecules/Radiobox";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as apiClient from "~/api/apiClient";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import {formatDateLine} from "~/helpers/date";
import * as karteApi from "~/helpers/cacheKarte-utils";
import {CACHE_LOCALNAMES} from "~/helpers/constants";
import ValidateAlertModal from '~/components/molecules/ValidateAlertModal'
import $ from 'jquery'
import {
  addRedBorder,
  addRequiredBg,
  removeRequiredBg,
  removeRedBorder,
  setDateColorClassName
} from '~/helpers/dialConstants'
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import {DatePickerBox} from "~/components/styles/DatePickerBox";
import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display:flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
 width: 100%;
 height: 100%;
 font-size: 1rem;
 overflow-y:auto;
 .flex{
  display: flex;
  margin-bottom:5px;
 }
.selected, .selected:hover{
  background:lightblue!important;
}
label{
  font-size:1rem;
}
.content{
  padding-left:40px;
  padding-right:40px;
}
.input-with-label input{
  width: 100%;
}
.input-with-label label{
  width: 8rem;
}
.guidance-start-date {
  label {
    width: 7rem;
    margin-right: 0;
    line-height: 2rem;
  }
}
.doctor-select {
  margin-left: -20px;
  .label-title {
    width: 7rem;
  }
}

.mt5{
  button{
  padding:5px;
  margin-left:5px;
  min-width:34px;
  }
}
.enable-area-content{
  padding-left:20px;
  .pd{
    padding-left:20px;
  }
}
.checkbox-contents{
  border: 1px solid;
  width: 100%;
  .label-title{
    display:none;
  }
  label {
    margin-right: 2rem;
  }
  .other_request_content{
    input {
      width:calc(100% - 20px);
    }
    margin-left:6rem;
  }
  margin-left:20px;
  padding-left: 1rem !important;
}
.disable-area{
  .label-title{
    text-align:left;
    margin-right:10px;
  }
}
.react-datepicker__input-container{
  input {
    height: 2rem;
    width: 8rem;
  }
}
.table-area{
  width: calc(100% - 40px);
  margin-left: 40px;
}
.mt5{margin-top:5px;}
.header-second{
  display: flex;
  margin-bottom:5px;
  label{
    margin-top:-5px;
    margin-left: 5px;
    margin-right:15px;
    margin-bottom:5px;
  }
}
  .header-first{
    display: flex;
    padding-left:20px;
    .label-title{
      text-align:right;
      margin-right:10px;
      font-size: 1rem;
    }
    .pullbox-select{
      width:15rem;
    }
    .treat-date {
        line-height: 2rem;
        margin-right: 0.5rem;
    }
  }
  .table {
    .pullbox-title{width:0;}
    tr{height: 30px;}
    td{padding:0;}
    th{padding:3px;}
  }
  
  }
`;

class MedicinGuidance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patient_id: props.patientId,
      is_loaded: false,
      guidance_date: new Date(),
      item_details:[],
      classific_id:'',
      classific_name:'',
      classific_detail_id:'',
      classific_detail_name:'',
      classific_detail_master:[],
      send_flag:0,
      sending_category:null,
      number:0,
      isForUpdate:0,
      done_order:0,
      created_at:'',
      notes_id:0,
      karte_description_name:null,
      karte_text_data:[],
      request_contents_array: [],
      confirm_message: "",
      consent_date: new Date(),
      doctor_id: '',
      medication_instruction_flag: 1,
      guidance_medication_master: null,
      alert_message: '',
      alert_messages: '',
      drug_instruction_flag: 0,
      confirm_alert_title: ""
    }
    
    this.sampleOptions = [
      {id:0, value:''},
      {id:1, value:'サンプル1'},
      {id:2, value:'サンプル2'},
      {id:3, value:'サンプル3'},
      {id:4, value:'サンプル4'},
    ];
    this.doctor_list = [];
    let doctor_code_list = [];
    let doctor_data = sessApi.getDoctorList();
    doctor_data.map(doctor=>{
      let index = doctor_code_list.indexOf(doctor.doctor_code);
      if(index === -1){
        doctor_code_list.push(doctor.doctor_code);
        doctor.id = doctor.doctor_code;
        doctor.value = doctor.name;
        this.doctor_list.push(doctor);
      }
    });
    this.doctor_list.unshift({id:0,value:''});
    this.change_flag = 0;
  }
  
  async componentDidMount () {
    let path = "/app/api/v2/master/guidanceMedicine/searchMasterData";
    let post_data = {
      patient_id:this.props.patientId,
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if (res) {
          if(res.error_message !== undefined){
            this.setState({
              alert_messages:res.error_message,
              close_type:true,
            });
            return;
          }
          let guidance_medication_master = res.guidance_medication_master;
          let request_contents_array = [];
          if (guidance_medication_master != null && guidance_medication_master.length > 0) {
            guidance_medication_master.map(item => {
              request_contents_array.push({
                guidance_medication_id:item.guidance_medication_id,
                guidance_medication_name:item.guidance_medication_name,
                receipt_key:item.receipt_key,
              });
            });
          }
          this.setState({
            hos_number:res.hos_number,
            department_id:res.department_id,
            department_name:res.department_name,
            request_contents_array,
            guidance_medication_master,
            is_loaded : true
          });
        }
      })
      .catch(() => {
      });
    let number = this.state.number;
    let isForUpdate = this.state.isForUpdate;
    let done_order = this.state.done_order;
    let created_at = this.state.created_at;
    let cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.MEDICINE_GUIDANCE_EDIT, this.props.cache_index);
    if (this.props.cache_data != undefined && this.props.cache_data != null) cache_data =JSON.parse(JSON.stringify(this.props.cache_data));
    if (cache_data === undefined || cache_data == null) return;
    number = cache_data.number;
    isForUpdate = number > 0 ? 1 : 0;
    done_order = cache_data.done_order;
    created_at = cache_data.created_at;
    
    this.setState({
      number,
      isForUpdate,
      done_order,
      created_at,
      consent_date: new Date(cache_data.consent_date),
      doctor_id:cache_data.doctor_id,
      medication_instruction_flag:cache_data.medication_instruction_flag,
      guidance_date:cache_data.guidance_date !== undefined ? new Date(cache_data.guidance_date) : '',
      home_instruction_flag:cache_data.home_instruction_flag !== undefined ? cache_data.home_instruction_flag: '',
      drug_instruction_flag:cache_data.drug_instruction_flag !== undefined ? cache_data.drug_instruction_flag: '',
      disease_name_flag:cache_data.disease_name_flag !== undefined ? cache_data.disease_name_flag: '',
      patient_description:cache_data.patient_description !== undefined ? cache_data.patient_description: '',
      impossible_reason:cache_data.impossible_reason !== undefined ? cache_data.impossible_reason: '',
      request_contents_array:cache_data.request_contents_array !== undefined  && cache_data.request_contents_array.length > 0 ? cache_data.request_contents_array: [],
      other_request_content:cache_data.other_request_content !== undefined ? cache_data.other_request_content: '',
      is_loaded: true
    });
  }
  componentDidUpdate () {
    if(this.state.consent_date == ''){
      addRequiredBg("consent_date_id");
    } else {
      removeRequiredBg("consent_date_id");
    }
    if(this.state.doctor_id == ''){
      addRequiredBg("doctor_id_id");
    } else {
      removeRequiredBg("doctor_id_id");
    }
    if(this.state.medication_instruction_flag == 1 && this.state.request_contents_array.length == 0){
      addRequiredBg("request_contents_id");
    } else {
      removeRequiredBg("request_contents_id");
    }
  }
  
  getEnableState(key,e) {
    this.change_flag = 1;
    this.setState({[key]:e.target.value})
  }
  
  getDate(key,value){
    this.change_flag = 1;
    this.setState({[key]:value});
  }
  getRadio(item,name){
    if (name =='check'){
      let request_contents_array = this.state.request_contents_array;
      let index = request_contents_array.findIndex(x=>x.guidance_medication_id == item.guidance_medication_id);
      if(index == -1){
        request_contents_array.push(item);
      } else {
        request_contents_array.splice(index, 1);
      }
      this.change_flag = 1;
      this.setState({
        request_contents_array
      });
    }
  }
  confirmCancel() {
    this.setState({
      confirm_message: "",
      confirm_alert_title: "",
      confirm_action: "",
      alert_messages: "",
    });
    if(this.state.close_type){
      this.props.closeModal();
    }
  }
  closeAlertModal = () => {
    this.setState({alert_message: ''});
    if(this.state.first_tag_id  != ''){
      let first_tag_id = this.state.first_tag_id;
      $("#" + first_tag_id).focus();
    }
  }
  saveCheck = () => {
    let result = '';
    if (!(this.state.number > 0) && !this.context.$canDoAction(this.context.FEATURES.GUIDANCEORDER, this.context.AUTHS.REGISTER) && !this.context.$canDoAction(this.context.FEATURES.GUIDANCEORDER, this.context.AUTHS.REGISTER_PROXY)) result = "登録権限がありません。";
    if (this.state.number > 0 && !this.context.$canDoAction(this.context.FEATURES.GUIDANCEORDER, this.context.AUTHS.EDIT) && !this.context.$canDoAction(this.context.FEATURES.GUIDANCEORDER, this.context.AUTHS.EDIT_PROXY)) result = "編集権限がありません。";
    return result;
  }
  save = () =>{
    if (!(this.state.number > 0) && !this.context.$canDoAction(this.context.FEATURES.GUIDANCEORDER, this.context.AUTHS.REGISTER) && !this.context.$canDoAction(this.context.FEATURES.GUIDANCEORDER, this.context.AUTHS.REGISTER_PROXY)) return;
    if (this.state.number > 0 && !this.context.$canDoAction(this.context.FEATURES.GUIDANCEORDER, this.context.AUTHS.EDIT) && !this.context.$canDoAction(this.context.FEATURES.GUIDANCEORDER, this.context.AUTHS.EDIT_PROXY)) return;
    removeRedBorder("consent_date_id");
    removeRedBorder("doctor_id_id");
    removeRedBorder("request_contents_id");
    let error_str_array = [];
    let first_tag_id = '';
    if(this.state.consent_dateconsent_date === ''){
      error_str_array.push("同意日を選択してください。");
      addRedBorder("consent_date_id");
      if (first_tag_id == '') first_tag_id = "consent_date_id";
    }
    if(this.state.doctor_id === ''){
      error_str_array.push("医師名を選択してください。");
      addRedBorder("doctor_id_id");
      if (first_tag_id == '') first_tag_id = "doctor_id_id";
    }
    if(this.state.medication_instruction_flag == 1 && this.state.request_contents_array.length == 0){
      error_str_array.push("指導依頼内を選択してください。");
      addRedBorder("request_contents_id");
      if (first_tag_id == '') first_tag_id = "request_contents_id";
    }
    if (error_str_array.length > 0) {
      this.setState({ alert_message: error_str_array.join('\n') })
      return;
    }
    this.setState({
      confirm_message:'登録しますか？',
      confirm_action: "save"
    })
  }
  
  confirmOk = () => {
    this.confirmCancel();
    if (this.state.confirm_action === "save"){
      this.saveData();
    } else if (this.state.confirm_action === "close"){
      this.props.closeModal();
    }
  }
  
  saveData = () =>{
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let guidance_order = {};
    guidance_order['consent_date'] = formatDateLine(this.state.consent_date);
    guidance_order['doctor_id'] = this.state.doctor_id;
    guidance_order['medication_instruction_flag'] = this.state.medication_instruction_flag;
    if (this.state.medication_instruction_flag == 1) {
      if (this.state.guidance_date_check == 1)
        guidance_order['guidance_date'] = formatDateLine(this.state.guidance_date);
      guidance_order['home_instruction_flag'] = this.state.home_instruction_flag;
      guidance_order['drug_instruction_flag'] = this.state.drug_instruction_flag;
      guidance_order['disease_name_flag'] = this.state.disease_name_flag;
      guidance_order['patient_description'] = this.state.patient_description;
      guidance_order['request_contents_array'] = this.state.request_contents_array;
      if (this.state.request_contents_array != null && this.state.request_contents_array.findIndex(x=>x.guidance_medication_name == "その他特に注意すべき事項など")>-1)
        guidance_order['other_request_content'] = this.state.other_request_content;
    } else {
      guidance_order['impossible_reason'] = this.state.impossible_reason;
    }
    guidance_order['number'] = this.state.number;
    guidance_order['isForUpdate'] = this.state.isForUpdate;
    if(this.state.isForUpdate === 1 && this.props.cache_index != null){
      let cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.MEDICINE_GUIDANCE_EDIT, this.props.cache_index);
      if(cache_data !== undefined && cache_data != null && cache_data.last_doctor_code !== undefined){
        guidance_order.last_doctor_code = cache_data.last_doctor_code;
        guidance_order.last_doctor_name = cache_data.last_doctor_name;
      }
      if (this.props.cache_data !== undefined && this.props.cache_data != null){
        cache_data = JSON.parse(JSON.stringify(this.props.cache_data));
        guidance_order.last_doctor_code = cache_data.doctor_code;
        guidance_order.last_doctor_name = cache_data.doctor_name;
      }
    }
    guidance_order['system_patient_id'] = this.state.patient_id;
    guidance_order['treat_date'] = formatDateLine(this.state.consent_date);
    guidance_order['hos_number'] = this.state.hos_number;
    guidance_order['department_id'] = this.state.department_id;
    guidance_order['department_name'] = this.state.department_name;
    guidance_order['doctor_code'] = authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code;
    guidance_order['doctor_name'] = authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name;
    if (authInfo.staff_category !== 1){
      guidance_order['substitute_name'] = authInfo.name;
    }
    if(this.props.cache_index != null){
      karteApi.setSubVal(this.state.patient_id, CACHE_LOCALNAMES.MEDICINE_GUIDANCE_EDIT, this.props.cache_index, JSON.stringify(guidance_order), 'insert');
    } else {
      karteApi.setSubVal(this.state.patient_id, CACHE_LOCALNAMES.MEDICINE_GUIDANCE_EDIT, new Date().getTime(), JSON.stringify(guidance_order), 'insert');
    }
    this.context.$setExaminationOrderFlag(1);
    this.props.closeModal();
  };
  getDescription = (key, e) => {
    if (e.target.value.length > 25) {
      this.setState({alert_messages: "全角25文字以上入力できません。"});
      return;
    }
    this.change_flag = 1;
    this.setState({[key]: e.target.value})
  }
  
  getCheckValue = (name, value) => {
    this.change_flag = 1;
    this.setState({[name]:value});
  }
  getDoctor = (e) => {
    this.change_flag = 1;
    this.setState({doctor_id: e.target.id})
  }
  getCheckState = (item) => {
    let request_contents_array = this.state.request_contents_array;
    let index = request_contents_array.findIndex(x=>x.guidance_medication_id == item.guidance_medication_id);
    return (index > -1);
  }
  mainCloseModal = () => {
    if (this.change_flag == 1) {
      this.setState({
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_action:"close",
        confirm_alert_title:'入力中',
      });
      return;
    }
    this.props.closeModal();
  }
  
  render() {
    let {guidance_medication_master} = this.state;
    return (
      <>
        <Modal show={true} id="first-view-modal" className="custom-modal-sm medicine-guidance-modal first-view-modal">
          <Modal.Header>
            <Modal.Title>服薬指導依頼</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.is_loaded ? (
              <DatePickerBox style={{width:"100%", height:"100%"}}>
                <Wrapper>
                  <div className="header-first">
                    <div className='flex w-50'>
                      <div className="treat-date">同意日</div>
                      <DatePicker
                        locale="ja"
                        selected={this.state.consent_date}
                        onChange={this.getDate.bind(this, "consent_date")}
                        dateFormat="yyyy/MM/dd"
                        placeholderText="年/月/日"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        id="consent_date_id"
                        dayClassName = {date => setDateColorClassName(date)}
                      />
                    </div>
                    <div className='flex doctor-select'>
                      <SelectorWithLabel
                        options={this.doctor_list}
                        title={'医師名'}
                        getSelect={this.getDoctor}
                        departmentEditCode={this.state.doctor_id}
                        id="doctor_id_id"
                      />
                    </div>
                  </div>
                  <div className="content">
                    <div className='enable-area'>
                      <div className='flex'>
                        <div className="w-50">
                          <Radiobox
                            id = {1}
                            label={'服薬指導 可'}
                            value={1}
                            getUsage={this.getEnableState.bind(this, "medication_instruction_flag")}
                            checked={this.state.medication_instruction_flag == 1 ? true : false}
                            name={`enable_state`}
                          />
                        </div>
                        <div className='flex guidance-start-date'>
                          <Checkbox
                            label={'指導開始日'}
                            value = {this.state.guidance_date_check == 1}
                            getRadio={this.getCheckValue.bind(this)}
                            checked = {this.state.guidance_date_check == 1}
                            name="guidance_date_check"
                            isDisabled={this.state.medication_instruction_flag == 0}
                          />
                          <DatePicker
                            locale="ja"
                            selected={this.state.guidance_date}
                            onChange={this.getDate.bind(this, "guidance_date")}
                            dateFormat="yyyy/MM/dd"
                            placeholderText="年/月/日"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            disabled={this.state.medication_instruction_flag == 0 || this.state.guidance_date_check != 1}
                            dayClassName = {date => setDateColorClassName(date)}
                          />
                        </div>
                      
                      </div>
                      <div className='enable-area-content'>
                        <div className="pd">
                          <Checkbox
                            label={'在宅指導'}
                            value = {this.state.home_instruction_flag == 1}
                            getRadio={this.getCheckValue.bind(this)}
                            checked = {this.state.home_instruction_flag == 1}
                            name="home_instruction_flag"
                            isDisabled={this.state.medication_instruction_flag == 0}
                          />
                        </div>
                        <div className='pd'>
                          <Radiobox
                            id = {'drug_1'}
                            label={'麻薬指導あり'}
                            value={1}
                            getUsage={this.getEnableState.bind(this,"drug_instruction_flag")}
                            checked={this.state.drug_instruction_flag == 1 ? true : false}
                            name={`drug_state`}
                            isDisabled={this.state.medication_instruction_flag == 0}
                          />
                          <Radiobox
                            id = {'drug_0'}
                            label={'麻薬指導なし'}
                            value={0}
                            getUsage={this.getEnableState.bind(this,"drug_instruction_flag")}
                            checked={this.state.drug_instruction_flag == 0 ? true : false}
                            name={`drug_state`}
                            isDisabled={this.state.medication_instruction_flag == 0}
                          />
                        </div>
                        <div className='pd'>
                          <div>
                            <Checkbox
                              label={'病名等未告知'}
                              value = {this.state.disease_name_flag == 1}
                              getRadio={this.getCheckValue.bind(this)}
                              checked = {this.state.disease_name_flag == 1}
                              name="disease_name_flag"
                              isDisabled={this.state.medication_instruction_flag == 0}
                            />
                          </div>
                          <InputWithLabel
                            label="患者への説明"
                            type="text"
                            getInputText = {this.getDescription.bind(this,"patient_description")}
                            diseaseEditData={this.state.patient_description}
                            isDisabled={this.state.medication_instruction_flag == 0}
                          />
                          <div className="text-right">（全角25文字まで）</div>
                        </div>
                        <div className='sub-title pd'>指導依頼内容</div>
                        <div className='checkbox-contents pd' id="request_contents_id">
                          <div className='checkbox-area'>
                            {guidance_medication_master != null && guidance_medication_master.length > 0 && this.state.request_contents_array != null && guidance_medication_master.map(item=>{
                              return (
                                <>
                                  <Checkbox
                                    label={item.guidance_medication_name}
                                    getRadio={this.getRadio.bind(this,item)}
                                    value={this.getCheckState(item)}
                                    name="check"
                                    isDisabled={this.state.medication_instruction_flag == 0}
                                  />
                                </>
                              )
                            })}
                          </div>
                          {this.state.request_contents_array != null && (
                            <>
                              <InputWithLabel
                                label=""
                                type="text"
                                getInputText = {this.getDescription.bind(this,"other_request_content")}
                                diseaseEditData={this.state.other_request_content}
                                isDisabled={(this.state.request_contents_array.findIndex(x=>x.guidance_medication_name == "その他特に注意すべき事項など")==-1 || this.state.medication_instruction_flag == 0) == true ? true : false}
                                className="other_request_content"
                              />
                              <div style={{marginRight:20, textAlign:"right"}}>（全角25文字まで）</div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='disable-area mt-3'>
                      <div>
                        <Radiobox
                          id = {0}
                          label={'服薬指導 不可'}
                          value={0}
                          getUsage={this.getEnableState.bind(this, "medication_instruction_flag")}
                          checked={this.state.medication_instruction_flag == 0 ? true : false}
                          name={`enable_state`}
                        />
                      </div>
                      <div style={{marginLeft:40}}>
                        <InputWithLabel
                          label="不可理由"
                          type="text"
                          getInputText = {this.getDescription.bind(this,"impossible_reason")}
                          diseaseEditData={this.state.impossible_reason}
                          isDisabled={this.state.medication_instruction_flag == 1}
                        />
                      </div>
                      <div className="text-right">（全角25文字まで）</div>
                      <div className='table-area'>
                        <div>服薬指導同意実績</div>
                        <table className='table-scroll table table-bordered' style={{maxHeight:'100px'}}>
                          <thead>
                          <tr>
                            <th>同意日</th>
                            <th>指示日</th>
                            <th>診療科</th>
                            <th>病棟</th>
                          </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </Wrapper>
              </DatePickerBox>
            ):(
              <SpinnerWrapper>
                <Spinner animation="border" variant="secondary" />
              </SpinnerWrapper>
            )}
          </Modal.Body>
          {this.state.confirm_message !== "" && (
            <ConfirmNoFocusModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.confirmOk.bind()}
              confirmTitle= {this.state.confirm_message}
              title= {this.state.confirm_alert_title}
            />
          )}
          {this.state.alert_message !== "" && (
            <ValidateAlertModal
              handleOk={this.closeAlertModal}
              alert_meassage={this.state.alert_message}
            />
          )}
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.confirmCancel.bind(this)}
              handleOk= {this.confirmCancel.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.mainCloseModal}>キャンセル</Button>
            <Button className="red-btn" onClick = {this.save.bind(this)}>確定</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

MedicinGuidance.contextType = Context;
MedicinGuidance.propTypes = {
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,
  closeModal: PropTypes.func,
  cache_index:PropTypes.number,
  cache_data:PropTypes.object,
};

export default MedicinGuidance;
