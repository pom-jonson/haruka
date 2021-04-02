import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import {formatDateLine,} from "~/helpers/date";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import * as colors from "~/components/_nano/colors";
import * as apiClient from "~/api/apiClient";
// import Spinner from "react-bootstrap/Spinner";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import Radiobox from "~/components/molecules/Radiobox";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import { formatJapan } from "../../../../../helpers/date";
import SelectPatientModal from "~/components/templates/Patient/components/SelectPatientModal";
import Button from "~/components/atoms/Button";
import RegisterModal from "./RegisterModal";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const PatientsWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin: auto;
  font-size:1rem;
  .flex {display: flex;}
  .justify-content {
    align-items: flex-start;
    justify-content: space-between;
  }
  .title {
    font-size: 30px;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
  .buttons-area{
    button {
      height:2.3rem;
      width:6rem;
    }
  }
  .period_symbol{
    padding-top: 8px;
    padding-left: 5px;
    padding-right: 5px;
  }
  .radio-area{
    line-height: 2.3rem;
    label {font-size:1rem;}
  }   
  .select-patient {
    align-items: center;
    .label-title {
      margin:0;
      text-align: right;
      margin-right: 0.5rem;
    }
    .patient-number {
      margin-right:0.5rem;
      border:1px solid #aaa;
      min-width:10rem;
      height:2.3rem;
      line-height:2.3rem;
      padding:0 0.2rem;
      font-size:1rem;
    }
    button {
      height: 2.3rem;
      padding: 0;
      span {font-size:1rem;}
    }
    .clear-button{
      margin-left: 0.25rem;
      min-width: 2.3rem;    
      width: 2.3rem;    
      height: 2.3rem;
      padding: 0rem;
      text-align:center;
    }
  }
  .panel-menu {
    margin-top:0.5rem;
    display:flex;
    width: 100%;
    font-size: 1rem;
    font-weight: bold;
    .menu-btn {
      width:100px;
      text-align: center;
      border: 1px solid #aaa;
      background-color: rgba(200, 194, 194, 0.22);
      height: 2rem;
      line-height: 2rem;
      cursor: pointer;
    }
    .active-menu {
      width:100px;
      text-align: center;
      border-top: 1px solid #aaa;
      border-right: 1px solid #aaa;
      border-left: 1px solid #aaa;
      height: 2rem;
      line-height: 2rem;
    }
    .no-menu {
      width: calc(100% - 100px);
      border-bottom: 1px solid #aaa;
    }
  }
  .schedule-area {
    background-color: white;
    width: 100%;
    .no-result {
      padding: 200px;
      text-align: center;
      .border {
        width: 360px;
        margin: auto;
        padding: 10px;
        border: 2px solid #aaa;
      }
    }
    table {
      margin:0;
      tbody{
        display:block;
        overflow-y: scroll;
        height: calc( 100vh - 30rem);
        width:100%;
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2 !important;}
      }
      tr{
        display: table;
        width: 100%;
      }
      thead{
        display:table;
        width:100%;    
        border-bottom: 1px solid #dee2e6;    
        tr{
          width: calc(100% - 17px);
        }
      }
      td {
        padding: 0.25rem;
        word-break: break-all;
        button{
          float:right;
        }
      }
      th {
        position: sticky;
        text-align: center;
        padding: 0.3rem;
        white-space:nowrap;
        border:none;
        border-right:1px solid #dee2e6;
      }
    }  
  }
`;

const Flex = styled.div`
  align-items: center;
  width: 100%;
  .search-box {
      width: 100%;
      display: flex;
  }
  .label-title {
    width: 4rem;
    line-height:2.3rem;
    font-size: 1rem;
  }
  .pullbox-label {
    margin-bottom:0;
  }
  .pullbox-select {
      font-size: 1rem;
      width: 9.375rem;
      height:2.3rem;
  }
  .select-group {
    margin-left: 1rem;
  }
  .tab-btn{
    background: rgb(208, 208, 208);
    span{
      font-weight: normal;
      color: black;
    }
  }
  .disabled{
    background: rgb(208, 208, 208);
    span{
      font-weight: normal;
      color: grey !important;
    }
  }
  .block-area {
    border: 1px solid #aaa;
    margin-left: 2rem;
    padding: 5px;
    position: relative;
    label {
      font-size: 0.875rem;
      width: auto;
    }
    .check-state {
      button {
        margin-left: 0;
        margin-top: 5px;
        margin-right: 7px;
        padding: 8px 12px;
      }
    }
  }
`;

const InputBox = styled.div`
  display: flex;
  label {
    color: ${colors.onSecondaryDark};
    letter-spacing: 0.4px;
    line-height: 2.3rem;
    font-size: 1rem;
    width: 5rem;
    margin-bottom: 0;
  }
  input {
    border-radius: 4px;
    border: solid 1px #ced4da;
    background: ${colors.surface};
    color: ${colors.onSecondaryDark};
    font-size: 1rem;
    padding: 0 8px;
    width: 7.5rem;
    height: 2.3rem;
  }
  input::-ms-clear {
    visibility: hidden;
  }
`;

class HospitalPlanList extends Component {
  constructor(props) {
    super(props);
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.department_codes = [{id:0, value:"全て"}];
    this.diagnosis = {};
    departmentOptions.map(department=>{
      this.department_codes.push(department);
      this.diagnosis[parseInt(department.id)] = department.value;
    });
    let cur_date = new Date();
    this.state = {
      from_date:new Date(),
      end_date:cur_date.setDate(cur_date.getDate() + 1),
      first_ward_id:0,
      ward_master : [{ id: 0, value: "全て" },],
      department_id:0,
      search_type:1,
      patient_id:"",
      tab_id:0,
      table_data:[],
      alert_messages:'',
      confirm_message:'',
      confirm_type:'',
      selectPatient: false,
      patient_number:"",
      openRegisterModal:false,
    };
    this.ward_name = [];
  }

  async componentDidMount() {
    await this.getMasterData();
    await this.getSearchResult();
  }

  getMasterData=async()=>{
    let path = "/app/api/v2/ward/get/master_data/plan_list";
    let post_data = {
    };
    await apiClient
      ._post(path, {
          params: post_data
      })
      .then((res) => {
        let ward_master = this.state.ward_master;
        if(res.ward_master.length > 0){
          res.ward_master.map(ward=>{
            this.ward_name[ward.number] = ward.name;
            ward_master.push({id:ward.number, value:ward.name});
          })
        }
        this.setState({ward_master});
      })
      .catch(() => {
      });
  }

  setWard = e => {
    this.setState({ first_ward_id: parseInt(e.target.id)}, ()=>{
      this.getSearchResult();
    });
  };

  setDepartment = e => {
    this.setState({ department_id: parseInt(e.target.id)}, ()=>{
      this.getSearchResult();
    });
  };

  getSearchResult =async()=>{
    let path = "/app/api/v2/ward/get/in_out/hospital/plan_list";
    let post_data = {
      from_date:formatDateLine(this.state.from_date),
      end_date:formatDateLine(this.state.end_date),
      first_ward_id:this.state.first_ward_id,
      department_id:this.state.department_id,
      patient_id:this.state.patient_id,
      search_type:this.state.search_type, //0:予定含む 1:決定完了
      tab_id:this.state.tab_id, //0:入院 1:退院
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          table_data: res,
        });
      })
      .catch(() => {
      });
  }

  confirmCancel() {
    let state_data = {
      alert_messages: "",
      confirm_message: "",
      confirm_type: ""
    };
    this.setState(state_data);
  }

  getDate = (key,value) => {
    if (value == null) {
      value = new Date();
    }
    this.setState({[key]: value}, ()=>{
      this.getSearchResult();
    });
  };

  setSearchType = (e) => {
    this.setState({search_type:parseInt(e.target.value)}, ()=>{
      this.getSearchResult();
    })
  }

  setTab = ( e, val ) => {
    this.setState({
      tab_id:parseInt(val),
    },()=>{this.getSearchResult();});
  };

  openSelectPatientModal = () => {
    this.setState({
      selectPatient: true
    });
  }

  selectPatient = (patient) => {
    this.setState({
      patient_number: patient.patientNumber,
      patient_id: patient.systemPatientId,
      selectPatient: false,
    }, ()=>{
      this.getSearchResult();
    });
  }

  closeModal = () => {
    this.setState({
      selectPatient: false,
      openRegisterModal: false,
    });
  }

  openRegisterModal = () => {
    this.setState({
      openRegisterModal: true
    });
  }

  removePatientId=()=>{
    this.setState({
      patient_number:"",
      confirm_message:"",
      confirm_type:"",
    }, ()=>{
      this.getSearchResult();
    });
  }

  confirmClear=()=>{
    if(this.state.patient_number != ""){
      this.setState({
        confirm_message:"患者IDをクリアします。よろしいですか？",
        confirm_type:"clear_patient"
      });
    }
  }

  render() {
    return (
      <Modal show={true} id="add_contact_dlg"  className="hospital-plan-list-modal first-view-modal">
        <Modal.Header><Modal.Title>入院診療計画書</Modal.Title></Modal.Header>
        <Modal.Body>
          <DatePickerBox style={{width:"100%", height:"100%"}}>
            <PatientsWrapper>
              <Flex>
                <div style={{display:'flex'}}>
                  <InputBox>
                    <label>表示期間</label>
                    <DatePicker
                      locale="ja"
                      selected={this.state.from_date}
                      onChange={this.getDate.bind(this, "from_date")}
                      dateFormat="yyyy/MM/dd"
                      placeholderText="年/月/日"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      dayClassName = {date => setDateColorClassName(date)}
                    />
                    <span className='period_symbol'>～</span>
                    <DatePicker
                      locale="ja"
                      selected={this.state.end_date}
                      onChange={this.getDate.bind(this, 'end_date')}
                      dateFormat="yyyy/MM/dd"
                      placeholderText="年/月/日"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      dayClassName = {date => setDateColorClassName(date)}
                    />
                  </InputBox>
                  <div className = "select-group">
                    <SelectorWithLabel
                      options={this.state.ward_master}
                      title="病棟"
                      getSelect={this.setWard}
                      departmentEditCode={this.state.first_ward_id}
                    />
                  </div>
                  <div className = "select-group">
                    <SelectorWithLabel
                      title="診療科"
                      options={this.department_codes}
                      getSelect={this.setDepartment}
                      departmentEditCode={this.state.department_id}
                    />
                  </div>
                </div>
                <div className='flex justify-content' style={{marginTop:'0.5rem'}}>
                  <div className={'flex'}>
                    <div className='radio-area'>
                      <Radiobox
                        id = {'is_carried'}
                        label={this.state.tab_id==0?'入院':'退院'}
                        value={1}
                        getUsage={this.setSearchType.bind(this)}
                        checked={this.state.search_type === 1}
                        name={`start_mode`}
                      />
                      <Radiobox
                        id = {'is_reservation'}
                        label={this.state.tab_id==0?'入院予定含む':'退院予定含む'}
                        value={0}
                        getUsage={this.setSearchType.bind(this)}
                        checked={this.state.search_type === 0}
                        name={`start_mode`}
                      />
                    </div>
                    <div className = "select-patient flex">
                      <div className={'label-title'}>患者ID</div>
                      <div className={'patient-number'}>{this.state.patient_number}</div>
                      <Button className="ok" onClick={this.openSelectPatientModal}>患者選択</Button>
                      <Button type={'mono'} className="clear-button" onClick={this.confirmClear}>C</Button>
                    </div>
                  </div>
                  <div className='buttons-area flex'>
                    <button onClick={this.openRegisterModal}>新規/修正</button>
                    {/*<button style={{marginRight:"0.5rem"}}>パス適用</button>*/}
                  </div>
                </div>
                <div className='flex buttons-area justify-content' style={{marginTop:'0.5rem'}}>
                  <div>
                    <button onClick={this.getSearchResult}>最新表示</button>
                  </div>
                  {/*<button style={{marginRight:"0.5rem"}}>詳細印刷</button>*/}
                  <button>条件保存</button>
                </div>
              </Flex>
              <div className="panel-menu">
                { this.state.tab_id === 0 ? (
                  <><div className="active-menu">入院一覧</div></>
                ) : (
                  <><div className="menu-btn" onClick={e => {this.setTab(e, 0);}}>入院一覧</div></>
                )}
                { this.state.tab_id === 1 ? (
                  <><div className="active-menu">退院一覧</div></>
                ) : (
                  <><div className="menu-btn" onClick={e => {this.setTab(e, 1);}}>退院一覧</div></>
                )}
                <div className="no-menu"/>
              </div>
              <div className={'schedule-area'}>
                <table className="table-scroll table table-bordered table-hover" id="code-table">
                  <thead>
                    <tr>
                      <th style={{width:"8rem"}}>提供(印刷)</th>
                      <th style={{width:"8rem"}}>印刷日時</th>
                      <th style={{width:"8rem"}}>{this.state.tab_id == 0 ? "入院日時(予定)" : "退院日時(予定)"}</th>
                      <th style={{width:"8rem"}}>記入状態</th>
                      <th style={{width:"8rem"}}>病棟</th>
                      <th style={{width:"8rem"}}>診療科</th>
                      <th style={{width:"14rem"}}>主担当医</th>
                      <th>氏名</th>
                      <th style={{width:"15rem"}}>フリガナ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.table_data.length > 0 && (
                      this.state.table_data.map(item=>{
                        return (
                          <>
                            <tr>
                              <td style={{width:"8rem"}}> </td>
                              <td style={{width:"8rem"}}> </td>
                              <td style={{width:"8rem"}}>
                                {this.state.tab_id == 0 ?
                                (item.date_and_time_of_hospitalization != null ?
                                  formatJapan(item.date_and_time_of_hospitalization.split("-").join("/")) :
                                  formatJapan(item.desired_hospitalization_date.split("-").join("/")))
                                  :(
                                    item.discharge_date != null ?
                                      formatJapan(item.discharge_date.split("-").join("/")) :
                                      (item.expected_discharge_date != null ? formatJapan(item.expected_discharge_date.split("-").join("/")) : "")
                                  )}
                              </td>
                              <td style={{width:"8rem"}}></td>
                              <td style={{width:"8rem"}}>{this.ward_name[item.first_ward_id]}</td>
                              <td style={{width:"8rem"}}>{this.diagnosis[item.department_id]}</td>
                              <td style={{width:"14rem"}}>{item.doctor_name}</td>
                              <td>{item.patient_name}</td>
                              <td style={{width:"15rem"}}>{item.patient_name_kana}</td>
                            </tr>
                          </>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </PatientsWrapper>
          </DatePickerBox>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeModal} className="cancel-btn">閉じる</Button>
        </Modal.Footer>
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal= {this.confirmCancel.bind(this)}
            handleOk= {this.confirmCancel.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
        {this.state.confirm_message !== "" && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.removePatientId.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.selectPatient && (
          <SelectPatientModal
            handleOk={this.selectPatient}
            closeModal={this.closeModal}
          />
        )}
        {this.state.openRegisterModal && (
          <RegisterModal
            handleOk={this.selectPatient}
            closeModal={this.closeModal}
          />
        )}
      </Modal>
    );
  }
}

HospitalPlanList.contextType = Context;
HospitalPlanList.propTypes = {
  closeModal: PropTypes.func,
}
export default HospitalPlanList;

