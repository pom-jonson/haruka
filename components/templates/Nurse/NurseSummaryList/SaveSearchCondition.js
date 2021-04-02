import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Radiobox from "~/components/molecules/Radiobox";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import DatePicker, { registerLocale } from "react-datepicker";
import * as sessApi from "~/helpers/cacheSession-utils";
import Checkbox from "~/components/molecules/Checkbox";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as apiClient from "~/api/apiClient";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import {formatDateLine} from "~/helpers/date";
import Spinner from "react-bootstrap/Spinner";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`  
  width: 100%;
  height: 100%;
  font-size: 1rem;
  .flex{display: flex;}
  .input-div {
    div {margin-top:0;}
    .label-title {
      width:5rem;
      font-size:1rem;
      line-height:2rem;
      margin:0;
    }
    input {
      width:10rem;
      font-size:1rem;
      height:2rem;
    }
  }
  .select-div {
    .label-title {
      width:5rem;
      font-size:1rem;
      line-height:2rem;
      margin:0;
    }
    .pullbox-label {
      margin:0;
      .pullbox-select {
        width:10rem;
        font-size:1rem;
        height:2rem;
      }
    }
  }
  .react-datepicker__month {
    margin: 0.4rem !important;
  }
 .input-date-area{
    div{margin-top:0}
    .react-datepicker-popper {
      margin-top:10px;
    }
   .label-title{display:none;}
   input[type="text"]{
    width:8rem;
    padding-top:0;
    height:2rem;
    font-size:1rem;
  }
 }
 .radio-area{
    label {
      font-size:1rem;
      line-height:2rem;
    }
 }
 .checkbox-area {
    label {
      font-size:1rem;
      line-height:2rem;
      min-width: 6rem;
    }
 }
 .nurse-select {
  .label-title {display:none;}
  .pullbox-select {width:15rem !important;}
 }
`;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class SaveSearchCondition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patient_number:"",
      department_id:0,
      first_ward_id:0,
      date_type:0,
      start_date:"",
      end_date:"",
      nurse_type:0,
      display_nurse_id:0,
      create_flags:[],
      approval_categorys:[],
      load_flag:false,
      confirm_type:"",
      confirm_title:"",
      confirm_message:"",
      alert_messages:"",
    };
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.department_codes = [{id:0, value:"全て"}];
    departmentOptions.map(department=>{
      this.department_codes.push(department);
    });
    let cache_ward_master = JSON.parse(window.sessionStorage.getItem("init_status")).ward_master;
    this.ward_master = [{id:0, value:"全病棟"}];
    if (cache_ward_master != undefined && cache_ward_master != null && cache_ward_master.length > 0){
      cache_ward_master.map(ward=>{
        this.ward_master.push({id:ward.number, value: ward.name});
      });
    }
    this.nurses_list = sessApi.getStaffList(2);
    this.nurses_list.unshift({id:0,value:''});
    this.init_state = {
      patient_number:"",
      department_id:0,
      first_ward_id:0,
      date_type:0,
      start_date:"",
      end_date:"",
      nurse_type:0,
      display_nurse_id:0,
      create_flags:[],
      approval_categorys:[],
    };
    this.exist_condition = false;
  }
  
  async componentDidMount() {
    await this.getConditionInfo();
  }
  
  getConditionInfo=async()=>{
    let path = "/app/api/v2/search_condition/condition/get";
    let psot_data = {};
    psot_data.option_key = "看護サマリ一覧_検索条件";
    await apiClient.post(path, {params: psot_data})
      .then(res => {
        if(Object.keys(res).length > 0){
          this.init_state = res;
          this.exist_condition = true;
        }
      })
      .catch(()=> {
      });
    let state_data = JSON.parse(JSON.stringify(this.init_state));
    state_data.load_flag = true;
    this.setState(state_data);
  }
  
  setPatientId=(e)=>{
    this.setState({patient_number: e.target.value});
  }
  
  getDepartment = e => {
    this.setState({department_id:e.target.id});
  };
  
  setWard=(e)=>{
    this.setState({first_ward_id:e.target.id});
  };
  
  selectDateType = (e) => {
    this.setState({date_type:parseInt(e.target.value)});
  };
  
  setDateValue = (key,value) => {
    this.setState({[key]:value});
  };
  
  selectNurseType = (e) => {
    this.setState({nurse_type:parseInt(e.target.value)});
  }
  
  getNurse = (e) => {
    this.setState({display_nurse_id:e.target.id});
  }
  
  setCheckStatusAll=(value)=>{
    this.setState({
      create_flags:value == 1 ? [0,1,2] : [],
      approval_categorys:value == 1 ? [0,1,2] : [],
    });
  }
  
  setCheckStatus =(name, number)=>{
    let data = this.state[name];
    let index = data.indexOf(number);
    if(index === -1){
      data.push(number);
    } else {
      data.splice(index, 1);
    }
    this.setState({[name]:data});
  };
  
  confrimSaveCondition=()=>{
    let change_flag = false;
    if(this.state.load_flag){
      Object.keys(this.init_state).map((k) => {
        if(!change_flag && (k == "create_flags" || k == "approval_categorys")){
          if(this.init_state[k].length != this.state[k].length){
            change_flag = true;
          }
          if(!change_flag && this.init_state[k].length >0){
            this.init_state[k].map(value=>{
              if(!(this.state[k].includes(value))){
                change_flag = true;
              }
            });
          }
        } else {
          if (!change_flag && (this.init_state[k] !== this.state[k])) {
            change_flag = true;
          }
        }
      });
    }
    if(!change_flag){return;}
    this.setState({
      confirm_type:"save_condition",
      confirm_title:"保存確認",
      confirm_message:"検索条件を保存しますか？",
    });
  }
  
  closeModal=()=>{
    this.setState({
      confirm_type:"",
      confirm_title:"",
      confirm_message:"",
      alert_messages:"",
    });
  }
  
  confirmOk=()=>{
    if(this.state.confirm_type == "save_condition"){
      this.saveCondition();
    }
  }
  
  saveCondition=async()=>{
    this.setState({
      confirm_title:"",
      confirm_message:"",
      confirm_type:"",
      load_flag:false,
    });
    let path = "/app/api/v2/search_condition/condition/register";
    let psot_data = {};
    psot_data.option_key = "看護サマリ一覧_検索条件";
    psot_data.value = {
      patient_number:this.state.patient_number,
      department_id:this.state.department_id,
      first_ward_id:this.state.first_ward_id,
      date_type:this.state.date_type,
      start_date:(this.state.start_date != null && this.state.start_date != "") ? formatDateLine(this.state.start_date) : "",
      end_date:(this.state.end_date != null && this.state.end_date != "") ? formatDateLine(this.state.end_date) : "",
      nurse_type:this.state.nurse_type,
      display_nurse_id:this.state.display_nurse_id,
      create_flags:this.state.create_flags,
      approval_categorys:this.state.approval_categorys,
    };
    let alert_messages = "";
    await apiClient.post(path, {params: psot_data})
      .then(res => {
        if(res.alert_message != undefined){
          alert_messages = res.alert_message;
          let init_state = {};
          Object.keys(this.init_state).map((k) => {
            init_state[k] = this.state[k];
          });
          this.init_state = init_state;
          this.exist_condition = true;
        } else {
          alert_messages = res.error_message;
        }
      })
      .catch(()=> {
      });
    this.setState({
      alert_messages,
      load_flag:true,
    });
  }
  
  setCondition=()=>{
    if(!this.exist_condition){
      return;
    }
    this.props.setCondition(this.init_state);
  }

  render() {
    let change_flag = false;
    if(this.state.load_flag){
      Object.keys(this.init_state).map((k) => {
        if(!change_flag && (k == "create_flags" || k == "approval_categorys")){
          if(this.init_state[k].length != this.state[k].length){
            change_flag = true;
          }
          if(!change_flag && this.init_state[k].length >0){
            this.init_state[k].map(value=>{
              if(!(this.state[k].includes(value))){
                change_flag = true;
              }
            });
          }
        } else {
          if (!change_flag && (this.init_state[k] !== this.state[k])) {
            change_flag = true;
          }
        }
      });
    }
    return (
      <>
        <Modal show={true} className="custom-modal-sm save-search-condition first-view-modal">
          <Modal.Header><Modal.Title>検索条件</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                {this.state.load_flag ? (
                  <>
                    <div className={'input-div'}>
                      <InputWithLabel
                        type="text"
                        label={"患者ID"}
                        getInputText={this.setPatientId.bind(this)}
                        diseaseEditData={this.state.patient_number}
                      />
                    </div>
                    <div className={'select-div'} style={{marginTop:"0.5rem"}}>
                      <SelectorWithLabel
                        options={this.department_codes}
                        title={'診療科'}
                        getSelect={this.getDepartment}
                        departmentEditCode={this.state.department_id}
                      />
                    </div>
                    <div className={'select-div'} style={{marginTop:"0.5rem"}}>
                      <SelectorWithLabel
                        title="病棟"
                        options={this.ward_master}
                        getSelect={this.setWard}
                        departmentEditCode={this.state.first_ward_id}
                      />
                    </div>
                    <div className={'flex'}>
                      <div className={'select-date'}>
                        <div className='radio-area'>
                          <Radiobox
                            label={'入院日'}
                            value={1}
                            getUsage={this.selectDateType.bind(this)}
                            checked={this.state.date_type === 1}
                            name="date_type:search"
                          />
                          <Radiobox
                            label={'診療日'}
                            value = {2}
                            getUsage={this.selectDateType.bind(this)}
                            checked={this.state.date_type === 2}
                            name={`date_type:search`}
                          />
                          <Radiobox
                            label={'日未定'}
                            value = {0}
                            getUsage={this.selectDateType.bind(this)}
                            checked={this.state.date_type === 0}
                            name={`date_type:search`}
                          />
                        </div>
                        <div className='flex input-date-area'>
                          <InputWithLabel
                            label=""
                            type="date"
                            getInputText={this.setDateValue.bind(this,"start_date")}
                            diseaseEditData={this.state.start_date}
                            isDisabled={this.state.date_type === 0}
                          />
                          <span style={{marginLeft:'0.5rem', marginRight:'0.5rem', paddingTop:'0.2rem'}}>～</span>
                          <DatePicker
                            locale="ja"
                            selected={this.state.end_date}
                            onChange={this.setDateValue.bind(this,"end_date")}
                            dateFormat="yyyy/MM/dd"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            minDate={this.state.start_date}
                            disabled={this.state.date_type === 0}
                            dayClassName = {date => setDateColorClassName(date)}
                          />
                        </div>
                      </div>
                      <div className='nurse-area' style={{marginLeft:"0.5rem"}}>
                        <div className='radio-area'>
                          <Radiobox
                            label={'担当看護師'}
                            value = {0}
                            getUsage={this.selectNurseType.bind(this)}
                            checked={this.state.nurse_type === 0}
                            name={`nurse_type`}
                          />
                          <Radiobox
                            label={'副担当看護師'}
                            value = {1}
                            getUsage={this.selectNurseType.bind(this)}
                            checked={this.state.nurse_type === 1}
                            name={`nurse_type`}
                          />
                        </div>
                        <div className='flex select-div nurse-select'>
                          <SelectorWithLabel
                            options={this.nurses_list}
                            title={'表示'}
                            getSelect={this.getNurse.bind(this)}
                            departmentEditCode={this.state.display_nurse_id}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='flex'>
                      <div className='button-area' style={{marginRight:"0.5rem"}}>
                        <div style={{lineHeight:"2rem", textAlign:"center", marginRight:"0.5rem"}}>状態</div>
                        <button onClick={this.setCheckStatusAll.bind(this, 1)}>全選択</button><br/>
                        <button onClick={this.setCheckStatusAll.bind(this, 0)}>全解除</button>
                      </div>
                      <div className='checkbox-area'>
                        <Checkbox
                          label={'未作成'}
                          getRadio={this.setCheckStatus.bind(this)}
                          name="create_flags"
                          value={(this.state.create_flags.includes(0))}
                          number={0}
                        />
                        <Checkbox
                          label={'未承認'}
                          getRadio={this.setCheckStatus.bind(this)}
                          name="approval_categorys"
                          value={(this.state.approval_categorys.includes(0))}
                          number={0}
                        />
                        <br/>
                        <Checkbox
                          label={'作成中'}
                          getRadio={this.setCheckStatus.bind(this)}
                          name="create_flags"
                          value={(this.state.create_flags.includes(1))}
                          number={1}
                        />
                        <Checkbox
                          label={'承認済み'}
                          getRadio={this.setCheckStatus.bind(this)}
                          name="approval_categorys"
                          value={(this.state.approval_categorys.includes(1))}
                          number={1}
                        />
                        <br/>
                        <Checkbox
                          label={'作成済み'}
                          getRadio={this.setCheckStatus.bind(this)}
                          name="create_flags"
                          value={(this.state.create_flags.includes(2))}
                          number={2}
                        />
                        <Checkbox
                          label={'差し戻し'}
                          getRadio={this.setCheckStatus.bind(this)}
                          name="approval_categorys"
                          value={(this.state.approval_categorys.includes(2))}
                          number={2}
                        />
                      </div>
                    </div>
                  </>
                ):(
                  <SpinnerWrapper>
                    <Spinner animation="border" variant="secondary" />
                  </SpinnerWrapper>
                )}
              </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <div onClick={this.props.closeModal} className={"custom-modal-btn cancel-btn"} style={{cursor:"pointer"}} id='cancel_btn'>
              <span>キャンセル</span>
            </div>
            <div onClick={this.confrimSaveCondition.bind(this)} className={"custom-modal-btn " + (change_flag ? 'red-btn' : 'disable-btn')} style={{cursor:"pointer"}}>
              <span>検索条件を保存</span>
            </div>
            <div onClick={this.setCondition.bind(this)} className={"custom-modal-btn " + (this.exist_condition ? 'red-btn' : 'disable-btn')} style={{cursor:"pointer"}}>
              <span>保存した条件で検索</span>
            </div>
          </Modal.Footer>
          {this.state.confirm_message !== "" && (
            <SystemConfirmJapanModal
              hideConfirm= {this.closeModal.bind(this)}
              confirmCancel= {this.closeModal.bind(this)}
              confirmOk= {this.confirmOk.bind(this)}
              confirmTitle= {this.state.confirm_message}
              title= {this.state.confirm_title}
            />
          )}
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal}
              handleOk= {this.closeModal}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
        </Modal>
      </>
    );
  }
}

SaveSearchCondition.propTypes = {
  closeModal: PropTypes.func,
  setCondition: PropTypes.func,
};

export default SaveSearchCondition;
