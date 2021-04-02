import React, { Component } from "react";
import styled from "styled-components";
import Spinner from "react-bootstrap/Spinner";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import DatePicker, { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import ja from "date-fns/locale/ja";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import * as apiClient from "~/api/apiClient";
import {formatDateLine, formatDateSlash} from "~/helpers/date";
import Button from "~/components/atoms/Button";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import Radiobox from "~/components/molecules/Radiobox";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`
  width:100%;
  height:100%;
  font-size: 1rem;
  overflow-y:auto;
  .flex{
    display: flex;
  }
  .label-title {
    margin:0;
    line-height:2rem;
    font-size: 1rem;
  }
  .select-period {
    .period-title {    
      line-height: 2rem;
      width: 5.5rem;
    }
    div {
      margin-top: 0;
    }
    .from-to{
      padding: 0 0.3rem;                
      line-height: 2rem;
    }
    .label-title {display:none;}
  }
  .select-ward {
    margin-left:0.5rem;
    .label-title {
      width: 3rem;
    }
  }
  .select-department {
    margin-left:0.5rem;
    .label-title {
      width: 4rem;
    }
  }
  .pullbox-label {
    .pullbox-select {
      width: 10rem;
      font-size: 1rem;
      height:2rem;
    }
  }
  .radio-area {
    .radio-title {
      width:3rem;
      line-height: 2rem;
    }
    label {
      margin: 0px;
      height: 2rem;
      line-height: 2rem;
      font-size: 1rem;
      margin-right:0.5rem;
    }
  }
  .btn-area {
    margin-top: 2rem;
    button {margin-right: 0.5rem;}
  }
  
  .table-area {
    margin-top: 0.5rem;
    table {
      font-size: 1rem;
      margin-bottom: 0;
    }
    thead{
      margin-bottom: 0;
      display:table;
      width:100%;        
      tr{
        width: calc(100% - 18px);
      }
    }
    tbody{
      height: calc(90vh - 25rem);
      overflow-y: scroll;
      display:block;
      tr:nth-child(even) {background-color: #f2f2f2;}
      tr:hover{background-color:#e2e2e2;}
      tr {cursor:pointer;}
    }
    tr{
      display: table;
      width: 100%;
      box-sizing: border-box;
    }
    td {
      padding: 0.25rem;
      text-align: left;
      vertical-align: middle;
    }
    th {
      text-align: center;
      padding: 0.3rem;
      border-bottom-width: 1px;
    }      
    .tl {
      text-align: left;
    }      
    .tr {
      text-align: right;
    }
    .td-status {width:4rem;}
    .td-patient-id {width:7rem;}
    .td-patient-name {width:14rem};
    .td-home-tel {width:10rem;}
    .td-emergency-contact {width:8rem;}
    .td-work-tel {width:10rem;}
    .td-office-extension {width:6rem;}
    .td-desired-date {width:6rem;}
    .td-ward {width:3rem;}
    .td-department {width:4rem;}
    .td-contact-date {width:6rem;}
    .selected {background-color:#F9F1C0 !important;}
    .selected:hover {background-color:#F9F1C0 !important;}
    .input-td {
      width:8rem;
      padding:0;
      div {margin-top:0;}
      .label-title {width:0;}
      input {
        width:8rem;
        height: 2rem;
      }
    }
  }
  .spinner_area {
    text-align: center;
  }
 .react-datepicker-wrapper {
   input {
    height: 2rem;
    width: 7rem;
    font-size:1rem;
    cursor:pointer;
   }
 }
`;

const SpinnerWrapper = styled.div`
    padding: 5rem 0;
`;

class InpatientContactList extends Component {
  constructor(props) {
    super(props);
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.department_codes = [{id:0, value:"全て"}];
    this.diagnosis = {};
    departmentOptions.map(department=>{
      this.department_codes.push(department);
      this.diagnosis[parseInt(department.id)] = department.value;
    });
    let last_week = new Date();
    last_week.setDate(last_week.getDate() - 7);
    let next_week = new Date();
    next_week.setDate(next_week.getDate() + 7);
    this.state = {
      start_date: last_week,
      end_date: next_week,
      ward_master:[{id:0, value:"全病棟"}],
      ward_names:{},
      first_ward_id:0,
      department_id:0,
      hospitalization_contact_class:1,
      load_flag:false,
      list_data:[],
      selected_numbers:[],
      confirm_message:"",
      confirm_alert_title:"",
      complete_message:"",
      alert_messages:"",
    };
  }

  setPeriod=(key,value)=>{
    this.setState({[key]:value}, ()=>{
      this.searchList();
    });
  };

  setWard=(e)=>{
    this.setState({first_ward_id:e.target.id}, ()=>{
      this.searchList();
    });
  };

  getDepartment = e => {
    this.setState({department_id:e.target.id}, ()=>{
      this.searchList();
    });
  };

  setContactType = (e) => {
    this.setState({hospitalization_contact_class:parseInt(e.target.value)}, ()=>{
      this.searchList();
    });
  };

  async componentDidMount() {
    await this.getMaster();
    await this.searchList();
  }

  getMaster=async()=> {
    let path = "/app/api/v2/ward/get/contact_list/master_data";
    let post_data = {
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        let ward_master = this.state.ward_master;
        let ward_names = this.state.ward_names;
        if(res.ward_master.length > 0){
          res.ward_master.map(ward=>{
            ward_master.push({id:ward.number, value:ward.name});
            ward_names[ward.number] = ward.name;
          });
        }
        this.setState({
          ward_master,
          ward_names,
        });
      })
      .catch(() => {

      });
  };

  searchList=async()=> {
    if(this.state.load_flag){
      this.setState({load_flag:false});
    }
    let path = "/app/api/v2/ward/get/contact_list/search_list";
    let post_data = {
      first_ward_id:this.state.first_ward_id,
      department_id:this.state.department_id,
      hospitalization_contact_class:this.state.hospitalization_contact_class,
      start_date:(this.state.start_date != null && this.state.start_date !="") ? formatDateLine(this.state.start_date) : "",
      end_date:(this.state.end_date != null && this.state.end_date !="") ? formatDateLine(this.state.end_date) : "",
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          load_flag:true,
          list_data:res,
          selected_numbers:[],
        });
      })
      .catch(() => {

      });
  };

  selectPatient=(number)=>{
    let selected_numbers = this.state.selected_numbers;
    let index = selected_numbers.indexOf(number);
    if(index === -1){
      selected_numbers.push(number);
    } else {
      selected_numbers.splice(index, 1);
    }
    this.setState({
      selected_numbers,
    });
  };

  confirmChange=(value)=>{
    if(this.state.selected_numbers.length === 0){return;}
    let confirm_message = "";
    if(value == 1){
      confirm_message = "選択した患者様を連絡前に修正しますか？";
    }
    if(value == 2){
      confirm_message = "選択した患者様を未連絡にしますか？";
    }
    if(value == 3){
      confirm_message = "選択した患者様を連絡済みにしますか？";
    }
    if(confirm_message != ""){
      this.setState({
        confirm_message,
        confirm_alert_title:"変更確認",
        change_type:value,
      });
    }
  }

  changeContactClassific=async()=> {
    this.setState({
      confirm_message:"",
      confirm_alert_title:"",
      complete_message:"変更中"
    });
    let path = "/app/api/v2/ward/hospitalization_contact_class/change";
    let post_data = {
      hospitalization_contact_class:this.state.change_type,
      numbers:this.state.selected_numbers
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then(() => {
        this.setState({
          selected_numbers:[],
          complete_message:"",
          alert_messages:"状態を変更しました。",
          confirm_alert_title:"変更完了",
          load_flag:false,
        }, ()=>{
          this.searchList();
        });
      })
      .catch(() => {

      });
  };

  setUncontactedItemsEtc=(key, e)=>{
    let list_data = this.state.list_data;
    list_data[key]['uncontacted_items_etc'] = e.target.value;
    this.setState({list_data});
  };

  updateUncontactedItemsEtc=async(index)=>{
    let path = "/app/api/v2/ward/uncontacted_items_etc/change";
    let list_data = this.state.list_data;
    let post_data = {
      number:list_data[index]['number'],
      uncontacted_items_etc:list_data[index]['uncontacted_items_etc'],
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then(() => {
      })
      .catch(() => {

      });
  };

  closeModal=()=>{
    this.setState({
      confirm_message:"",
      confirm_alert_title:"",
      alert_messages:""
    });
  }

  render() {
    return (
      <>
        <Modal
          show={true}
          id={'hospital_contact_patient_list'}
          className="custom-modal-sm patient-exam-modal hospital-contact-patient-list first-view-modal"
        >
          <Modal.Header><Modal.Title>入院連絡患者一覧</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              <DatePickerBox style={{width:"100%", height:"100%"}}>
                <div className={'flex'}>
                  <div className={'select-period flex'}>
                    <div className={'period-title'}>入院予定日</div>
                    <DatePicker
                      locale="ja"
                      selected={this.state.start_date}
                      onChange={this.setPeriod.bind(this,"start_date")}
                      dateFormat="yyyy/MM/dd"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      dayClassName = {date => setDateColorClassName(date)}
                    />
                    <div className={'from-to'}>～</div>
                    <DatePicker
                      locale="ja"
                      selected={this.state.end_date}
                      onChange={this.setPeriod.bind(this,"end_date")}
                      dateFormat="yyyy/MM/dd"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      dayClassName = {date => setDateColorClassName(date)}
                    />
                  </div>
                  <div className={'select-ward'}>
                    <SelectorWithLabel
                      title="病棟"
                      options={this.state.ward_master}
                      getSelect={this.setWard}
                      departmentEditCode={this.state.first_ward_id}
                    />
                  </div>
                  <div className={'select-department'}>
                    <SelectorWithLabel
                      title="診療科"
                      options={this.department_codes}
                      getSelect={this.getDepartment}
                      departmentEditCode={this.state.department_id}
                    />
                  </div>
                </div>
                <div className={'radio-area flex'}>
                  <div className={'radio-title'}>状態</div>
                  <Radiobox
                    label={'連絡前'}
                    value={1}
                    getUsage={this.setContactType.bind(this)}
                    checked={this.state.hospitalization_contact_class === 1}
                    disabled={true}
                    name={`hospitalization_contact_class`}
                  />
                  <Radiobox
                    label={'未連絡'}
                    value={2}
                    getUsage={this.setContactType.bind(this)}
                    checked={this.state.hospitalization_contact_class === 2}
                    disabled={true}
                    name={`hospitalization_contact_class`}
                  />
                  <Radiobox
                    label={'連絡済'}
                    value={3}
                    getUsage={this.setContactType.bind(this)}
                    checked={this.state.hospitalization_contact_class === 3}
                    disabled={true}
                    name={`hospitalization_contact_class`}
                  />
                </div>
                <div className={'flex'}>
                  <div className={'btn-area'}>
                    <Button type="common" onClick={this.searchList}>最新表示</Button>
                    <Button
                      type="common"
                      onClick={this.confirmChange.bind(this, 1)}
                      isDisabled={this.state.selected_numbers.length === 0 || !this.state.load_flag}
                      className={(this.state.selected_numbers.length === 0 || !this.state.load_flag) ? 'disable-btn' : ''}
                    >連絡前に修正</Button>
                    <Button
                      type="common"
                      onClick={this.confirmChange.bind(this, 3)}
                      isDisabled={this.state.selected_numbers.length === 0 || !this.state.load_flag}
                      className={(this.state.selected_numbers.length === 0 || !this.state.load_flag) ? 'disable-btn' : ''}
                    >連絡済</Button>
                  </div>
                  <div>
                    <div>前：連絡前－患者さんに連絡を行っていない状態</div>
                    <div>未：未連絡－患者さんに連絡をしたが、確認が取れなかった状態</div>
                    <div>済：連絡済－患者さんに連絡をし、確認が取れた状態</div>
                  </div>
                </div>
                <div className={'table-area'}>
                  <table className="table-scroll table table-bordered">
                    <thead>
                    <tr>
                      <th className={'td-status'}>状態</th>
                      <th className={'td-patient-id'}>患者ID</th>
                      <th className={'td-patient-name'}>患者氏名</th>
                      <th className={'td-kana-name'}>患者カナ氏名</th>
                      <th className={'td-home-tel'}>自宅TEL</th>
                      <th className={'td-emergency-contact'}>緊急連絡先</th>
                      <th className={'td-work-tel'}>勤務先TEL</th>
                      <th className={'td-office-extension'}>勤務先内線</th>
                      <th className={'td-desired-date'}>入院予定</th>
                      <th className={'td-ward'}>病棟</th>
                      <th className={'td-department'}>診療科</th>
                      <th className={'td-contact-date'}>連絡日</th>
                      <th className={'input-td'} style={{padding:"0.3rem"}}>未連絡項目等</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.load_flag ? (
                      <>
                        {this.state.list_data.map((item, index)=>{
                          return (
                            <>
                              <tr className={(this.state.selected_numbers.includes(item.number) ? "selected" : "")}>
                                <td className={'td-status'} onClick={this.selectPatient.bind(this, item.number)}>{item.hospitalization_contact_class == 1 ? "連絡前" : (item.hospitalization_contact_class == 2 ? "未連絡" : "連絡済")}</td>
                                <td className={'td-patient-id tr'} onClick={this.selectPatient.bind(this, item.number)}>{item.patient_number}</td>
                                <td className={'td-patient-name'} onClick={this.selectPatient.bind(this, item.number)}>{item.patient_name}</td>
                                <td className={'td-kana-name'} onClick={this.selectPatient.bind(this, item.number)}>{item.patient_name_kana}</td>
                                <td className={'td-home-tel'} onClick={this.selectPatient.bind(this, item.number)}>{item.home_tel}</td>
                                <td className={'td-emergency-contact'} onClick={this.selectPatient.bind(this, item.number)}>{item.emergency_contact}</td>
                                <td className={'td-work-tel'} onClick={this.selectPatient.bind(this, item.number)}>{item.work_tel}</td>
                                <td className={'td-office-extension'} onClick={this.selectPatient.bind(this, item.number)}>{item.office_extension}</td>
                                <td className={'td-desired-date'} onClick={this.selectPatient.bind(this, item.number)}>{formatDateSlash(item.desired_hospitalization_date.split("-").join("/"))}</td>
                                <td className={'td-ward'} onClick={this.selectPatient.bind(this, item.number)}>{this.state.ward_names[item.first_ward_id]}</td>
                                <td className={'td-department'} onClick={this.selectPatient.bind(this, item.number)}>{this.diagnosis[item.department_id]}</td>
                                <td className={'td-contact-date'} onClick={this.selectPatient.bind(this, item.number)}>{item.contact_date != null ? formatDateSlash(item.contact_date.split("-").join("/")) : ""}</td>
                                <td className={'input-td'}>
                                  <InputWithLabel
                                    type="text"
                                    getInputText={this.setUncontactedItemsEtc.bind(this, index)}
                                    diseaseEditData={item.uncontacted_items_etc}
                                    onBlur={this.updateUncontactedItemsEtc.bind(this, index)}
                                  />
                                </td>
                              </tr>
                            </>
                          )
                        })}
                      </>
                    ):(
                      <tr style={{height:"calc(90vh - 25rem)"}}>
                        <td colSpan={'5'}>
                          <div className='spinner_area'>
                            <SpinnerWrapper>
                              <Spinner animation="border" variant="secondary" />
                            </SpinnerWrapper>
                          </div>
                        </td>
                      </tr>
                    )}
                    </tbody>
                  </table>
                </div>
              </DatePickerBox>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
          </Modal.Footer>
          {this.state.confirm_message !== "" && (
            <ConfirmNoFocusModal
              hideConfirm= {this.closeModal.bind(this)}
              confirmCancel= {this.closeModal.bind(this)}
              confirmOk= {this.changeContactClassific}
              confirmTitle= {this.state.confirm_message}
              title = {this.state.confirm_alert_title}
            />
          )}
          {this.state.complete_message !== '' && (
            <CompleteStatusModal
              message = {this.state.complete_message}
            />
          )}
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
              showTitle= {true}
              title = {this.state.confirm_alert_title}
            />
          )}
        </Modal>
      </>
    );
  }
}

InpatientContactList.propTypes = {
  closeModal: PropTypes.func,
};
export default InpatientContactList;
