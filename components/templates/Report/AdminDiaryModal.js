import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import {formatDateLine} from "~/helpers/date";
import {
  getNextDayByJapanFormat,
  formatDateFull,
  getPrevDayByJapanFormat,
} from "~/helpers/date";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import SelectDoctorModal from "~/components/molecules/SelectDoctorModal";
import Button from "~/components/atoms/Button";
import Spinner from "react-bootstrap/Spinner";
import ja from "date-fns/locale/ja";
import DatePicker, { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import Checkbox from "~/components/molecules/Checkbox";
import axios from "axios/index";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import AdminDiaryPrintPreview from "./AdminDiaryPrintPreview";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`
    overflow-y: auto;
    height: 100%;
    font-size:1rem;
    .flex {
      display: flex;
    }
    .react-datepicker__input-container input {
      height: 2rem;
      width: 7rem;
    }
    .date-area {
      display: flex;
      margin-left: 3rem;
      .react-datepicker__input-container input {
        height: 2rem;
        width: 12rem;
      }
      .react-datepicker{
        width: 130% !important;
        font-size: 1.25rem;
        .react-datepicker__month-container{
          width:79% !important;
          height:20rem;
        }
        .react-datepicker__time-list {
          height: 17rem;
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
    .left-area{
      width: 70%;
      height: 100%;
      .header-table{
        .doctor_name-td {
          width: 15rem;
        }
      }
      .table-area {
        border: solid 1px gray;
        width: 100%;
        height: calc(100% - 3rem);
        overflow-y: auto;
      }
      .tab-area {
        margin-top: 1.5rem;
        .active-tab {
          background: lightgray;
          border: solid 1px black;
          border-bottom: none;
          padding: 0 0.5rem;
          cursor: pointer;
        }
        .inactive-tab {
          padding: 0 0.5rem;
          cursor: pointer;
          border: solid 1px black;
          background: white;
          border-bottom: none;
        }
      }
      table {
        margin-bottom:0;
        th {
          text-align: center;
          vertical-align: middle;
          padding:0;
        }
        td {
          padding:0.25rem;
          vertical-align: middle;
          text-align: center;
        }
      }
      .staff-table {
        table {
          width: calc(100% - 6rem);
        }
      }
    }
    .right-area{
        width: 28%;
        height: 100%;
        margin-left: 2%;
        label {
          margin-bottom: 0;
        }
        .input-list {
          height: calc(100% - 3rem);
          border: solid 1px gray;
          overflow-y: auto;
          margin-top: 1.2rem;
          padding: 0.5rem;
        }
        .list-title {
          border: solid 1px gray;
          border-bottom: none;
          margin-top: 1.5rem;
        }
    }
`;
const Footer = styled.div`
  display: flex;
  width: 100%;
  .check-box{
    line-height: 2.3rem;
    label {
      font-size: 1rem !important;
    }
  }
  span{
    color: white;
  }
  button{
    padding: 5px;
    margin-right: 16px;
  }
`;
const SpinnerWrapper = styled.div`
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class AdminDiaryModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
          search_date:new Date(),
          department_id:0,
          ward_master:[],
          nurse_category_master:[],
          first_ward_id:1,
          table_data:[],
          confirm_message:"",
          alert_messages:"",
          confirm_title: '',
          end_date: new Date(),
          search_option: 1,
          tab_id: 0,
          preview_check: false,
          selectDoctorModal: false,
          is_loaded: false,
          current_date: '',
          patient_data: [],
          nurse_master: [],
          staff_data: [],
          import_date_and_time: '',
          isOpenPrintPreviewModal:false,
          isConfirmComplete:false,
        };
    }

    async UNSAFE_componentWillMount () {
      await this.getMasterData();
      await this.getSearchResult();
    }
    getSearchResult = async()=> {
      let path = "/app/api/v2/nurse/get_nurse_diary";
      await apiClient.post(path, {params: {
        search_date: formatDateLine(this.state.search_date),
      }})
      .then(res => {
        this.setState({
          current_date: res.search_date,
          patient_data: res.ward_data,
          staff_table: res.staff_data,
          is_loaded: true
        });
      })
    }
    getMasterData = async()=> {
      let path = "/app/api/v2/nurse/get_nurse_diary";
      await apiClient.post(path, {params: {only_master: 1}})
      .then(res => {
        this.setState({
          nurse_master: res.nurse_master,
          ward_master: res.ward_master,
          nurse_category_master: res.nurse_category_master,
        });
      })
    }

    moveDay = (type) => {
      let now_day = this.state.search_date;
      if(now_day === ''){
        now_day = new Date();
      }
      let cur_day = type === 'next' ? getNextDayByJapanFormat(now_day) : getPrevDayByJapanFormat(now_day);

      this.setState({
        search_date: cur_day,
        // is_loaded: false,
      }, ()=>{
        this.getSearchResult();
      });
    };
    selectToday=()=>{
      this.setState({
        search_date: new Date(),
        // is_loaded: false,
      }, ()=>{
        this.getSearchResult();
      });
    };
    getDate = (key,value) => {
      if (key === 'search_date') {
        this.setState({[key]: value},()=>{
          this.getSearchResult();
        });
      } else {
        this.setState({[key]: value});
      }
    }
    closeModal=()=>{
      this.setState({
        confirm_message:"",
        confirm_type:"",
        confirm_action:'',
        alert_messages:"",
        isOpenPrintPreviewModal:false,
      });
    };
    confirmOk=()=>{
      this.closeModal();
      if (this.state.confirm_action === 'approval') {
        this.setState({approval_time: new Date()});
      } else if (this.state.confirm_action === 'cancel_approval') {
        this.setState({approval_time: ''});
      } else if (this.state.confirm_action === "register") {
        this.registerAdminDiary();
      }
    };
    registerAdminDiary = async () => {
      let diary_doctors = {
        nursing_diary_doctor_id1: this.state.nursing_diary_doctor_id1,
        nursing_diary_doctor_id2: this.state.nursing_diary_doctor_id2,
        nursing_diary_doctor_id3: this.state.nursing_diary_doctor_id3,
        nursing_diary_doctor_id4: this.state.nursing_diary_doctor_id4,
      };
      let post_data = {
        search_date: formatDateLine(this.state.search_date),
        staff_data: this.state.staff_table,
        patient_data: this.state.patient_data,
        diary_doctors,
      };
      if (this.state.approval_time !== undefined && this.state.approval_time !== "") {
        post_data.approval_time = formatDateFull(this.state.approval_time, "-");
      }
      if (this.state.import_date_and_time !== undefined && this.state.import_date_and_time !== "") {
        post_data.import_date_and_time = formatDateFull(this.state.import_date_and_time, "-");
      }
      let path = "/app/api/v2/nurse/register_nurse_diary";
      await apiClient.post(path, {params: post_data}).then(res=>{
        if (res) {
          window.sessionStorage.setItem('alert_messages', res.alert_message);
        }
      }).finally(()=>{
        this.props.closeModal();
      })
    };
    mainCloseModal = () => {
      this.props.closeModal();
    };
    onHide= () => {};
    selectTab = (tab_id) => {
      this.setState({tab_id});
    };
    getDisplayCheck = (name,value) => {
      if (name === 'check')
      this.setState({preview_check:value});
    };
    openStaffSet = (staff_key) => {
      this.setState({
        save_staff_key: staff_key,
        selectDoctorModal: true,
      })
    };
    closeDoctor = () => {
      this.setState({
        selectDoctorModal: false,
        save_staff_key: '',
      });
    };
    getDoctor = e => {
        this.selectDoctorFromModal(e.target.id, e.target.getAttribute("label"));
    };

    selectDoctorFromModal = (id, name) => {
        this.setState({
            selectDoctorModal: false,
            [this.state.save_staff_key]:name,
        });
        if (this.state.save_staff_key === "first_staff") {
          this.setState({nursing_diary_doctor_id1: id});
        } else if (this.state.save_staff_key === "second_staff") {
          this.setState({nursing_diary_doctor_id2: id});
        } else if (this.state.save_staff_key === "third_staff") {
          this.setState({nursing_diary_doctor_id3: id});
        } else if (this.state.save_staff_key === "forth_staff") {
          this.setState({nursing_diary_doctor_id4: id});
        }
    };
    approval = () => {
      this.setState({
        confirm_message: '承認しますか？',
        confirm_action: 'approval'
      })
    }
    cancelApproval = () => {
      this.setState({
        confirm_message: '承認取消しますか？',
        confirm_action: 'cancel_approval'
      });
    };
    showNurseList = () => {
      this.setState({nurse_show: true});
    };
    saveData = () => {
      if (this.state.nursing_diary_doctor_id1 === undefined && this.state.nursing_diary_doctor_id2 === undefined &&
        this.state.nursing_diary_doctor_id3 === undefined && this.state.nursing_diary_doctor_id4 === undefined) {
        this.setState({alert_messages:"医師を選択してください。"});
        return;
      }
      this.setState({
        confirm_message: '登録しますか？',
        confirm_action: 'register'
      });
    }

    printData = async() => {
      if (this.state.preview_check){
        this.setState({
          isOpenPrintPreviewModal:true
        })
      } else {
        this.setState({
          isConfirmComplete:true,
          complete_message:"印刷中"
        });
        var url = '/app/api/v2/print_haruka/generatepdf/adminDiary';
        axios({
          url: url,
          method: 'POST',
          data:{
            patient_data:this.state.patient_data,
            staff_table:this.state.staff_table,
            ward_master: this.state.ward_master
          },
          responseType: 'blob', // important
        }).then((response) => {
          this.setState({complete_message:"", isConfirmComplete:false});
          const blob = new Blob([response.data], { type: 'application/octet-stream' });
          var title = '看護部管理日誌.pdf';          
          if(window.navigator.msSaveOrOpenBlob) {
            //IE11 & Edge
            window.navigator.msSaveOrOpenBlob(blob, title);
          }
          else{
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', title); //or any other extension
            document.body.appendChild(link);
            link.click();
          }
        })
        .catch(() => {
          this.setState({
            isConfirmComplete:false,
            alert_messages:"印刷失敗",
          });
        })
      }
    }

    render() {
      let {staff_table, current_date, patient_data, nurse_master, ward_master} = this.state;
        return (
            <>
              <Modal show={true} className="custom-modal-sm patient-exam-modal medication-guidance-schedule first-view-modal" onHide={this.onHide}>
                <Modal.Header><Modal.Title>看護部管理日誌</Modal.Title></Modal.Header>
                <Modal.Body>
                  <DatePickerBox style={{width:"100%", height:"100%"}}>
                    <Wrapper>
                      <div className={'select-date flex'} style={{marginBottom:"0.5rem"}}>
                        <div className={'date-label mr-3'} style={{lineHeight:"2rem"}}>基準日</div>
                        <Button type="common" className='mr-3' onClick={this.moveDay.bind(this, 'prev')}>{'<'}</Button>
                        <DatePicker
                          locale="ja"
                          id='search_date_id'
                          selected={this.state.search_date}
                          onChange={this.getDate.bind(this, 'search_date')}
                          dateFormat="yyyy/MM/dd"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          dayClassName = {date => setDateColorClassName(date)}
                        />
                        <Button type="common" className="ml-3" onClick={this.moveDay.bind(this, 'next')}>{'>'}</Button>
                        <div className="date-area">
                        <div className='start-date'>
                          <label>承認時刻</label>
                          <DatePicker
                              locale="ja"
                              id='start_date_id'
                              selected={this.state.approval_time}
                              onChange={this.getDate.bind(this,"approval_time")}
                              dateFormat="yyyy/MM/dd HH:mm"
                              timeCaption="時間"
                              showTimeSelect
                              timeFormat="HH:mm"
                              timeIntervals={10}
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              dayClassName = {date => setDateColorClassName(date)}
                          />
                        </div>
                        <div className='end-date'>  
                          <label>取込時刻</label>
                          <DatePicker
                              locale="ja"
                              id='end_date_id'
                              selected={this.state.import_date_and_time}
                              onChange={this.getDate.bind(this,"import_date_and_time")}
                              dateFormat="yyyy/MM/dd HH:mm"
                              timeCaption="時間"
                              showTimeSelect
                              timeFormat="HH:mm"
                              timeIntervals={10}
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              dayClassName = {date => setDateColorClassName(date)}
                          />
                        </div>  
                      </div>
                      </div>
                      <div className="w-100 d-flex" style={{height:"calc(100% - 3.5rem)"}}>
                        <div className={'left-area'}>
                          <div className="tab-area flex">
                            <div className={this.state.tab_id === 0 ? "active-tab" : "inactive-tab"} onClick={this.selectTab.bind(this,0)}>患者管理</div>
                            <div className={this.state.tab_id === 1 ? "active-tab" : "inactive-tab"} onClick={this.selectTab.bind(this,1)}>職員管理</div>
                          </div>
                          {this.state.is_loaded ? (
                            <div className={`table-area`}>
                              {this.state.tab_id === 0 ? (
                                <>
                                  <div className="header-table">
                                    <table className="table-scroll table table-bordered">
                                      <tr>
                                        <td className="title text-center" rowSpan={4}>
                                          <div className={`text-center`} style={{fontSize:"2rem"}}>看護部管理日誌(患者管理)</div>
                                          <div>{current_date}</div>
                                        </td>
                                        <td rowSpan={4}>医<br/>師</td>
                                        <td>当直 内科</td>
                                        <td className="doctor_name-td">{this.state.first_staff}</td>
                                        <td onClick={this.openStaffSet.bind(this,'first_staff')} style={{background:"lightgray", cursor:"pointer"}}>...</td>
                                      </tr>
                                      <tr>
                                        <td>当直 外科</td>
                                        <td className="doctor_name-td">{this.state.second_staff}</td>
                                        <td onClick={this.openStaffSet.bind(this,'second_staff')} style={{background:"lightgray", cursor:"pointer"}}>...</td>
                                      </tr>
                                      <tr>
                                        <td>日直 内科</td>
                                        <td className="doctor_name-td">{this.state.third_staff}</td>
                                        <td onClick={this.openStaffSet.bind(this,'third_staff')} style={{background:"lightgray", cursor:"pointer"}}>...</td>
                                      </tr>
                                      <tr>
                                        <td>日直 外科</td>
                                        <td className="doctor_name-td">{this.state.forth_staff}</td>
                                        <td onClick={this.openStaffSet.bind(this,'forth_staff')} style={{background:"lightgray", cursor:"pointer"}}>...</td>
                                      </tr>
                                    </table>
                                  </div>
                                  <div className={`text-center`}>病棟患者数</div>
                                  <div className={`main-table`}>
                                    <table className="table-scroll table table-bordered" id="code-table">
                                      <tr>
                                        <td rowSpan={3}/>
                                        <td rowSpan={3}>定床数</td>
                                        <td rowSpan={3}>現在患者</td>
                                        <td rowSpan={3}>定床</td>
                                        <td rowSpan={3}>入院</td>
                                        <td rowSpan={3}>転入</td>
                                        <td rowSpan={3}>通院</td>
                                        <td rowSpan={3}>死亡</td>
                                        <td rowSpan={3}>転出</td>
                                        <td rowSpan={3}>転科</td>
                                        <td rowSpan={3}>外出泊</td>
                                        <td colSpan={4}>看護必要度</td>
                                      </tr>
                                      <tr>
                                        <td rowSpan={2}/>
                                        <td rowSpan={2}>患者数</td>
                                        <td colSpan={2}>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>数</td>
                                        <td>率(％)</td>
                                      </tr>
                                      {patient_data.length > 0 && patient_data.map((item, index)=>{
                                        return (
                                          <>
                                          {index < (patient_data.length -1) ? (
                                            <>
                                            <tr key={index}>
                                              <td rowSpan={2}>{item.ward_name}</td>
                                              <td rowSpan={2}>{item.nominal_number_of_beds}</td>
                                              <td rowSpan={2}>{item.current_patient_number}</td>
                                              <td rowSpan={2}>{item.norminal_bed}</td>
                                              <td rowSpan={2}>{item.hospital_patients_number}</td>
                                              <td rowSpan={2}>{item.move_in}</td>
                                              <td rowSpan={2}>{item.going}</td>
                                              <td rowSpan={2}>{item.death}</td>
                                              <td rowSpan={2}>{item.move_out}</td>
                                              <td rowSpan={2}>{item.department}</td>
                                              <td rowSpan={2}>{item.going_out}</td>
                                              <td>一般病室</td>
                                              <td>{item.common_room}</td>
                                              <td>{item.common_necessity}</td>
                                              <td>{item.common_percent}</td>
                                            </tr>
                                            <tr>
                                              <td>一般病室以外</td>
                                              <td>{item.noncommon_room}</td>
                                              <td>{item.noncommon_necessity}</td>
                                              <td>{item.noncommon_percent}</td>
                                            </tr>
                                            </>
                                          ):(
                                            <tr key={index}>
                                              <td>{item.ward_name}</td>
                                              <td>{item.nominal_number_of_beds}</td>
                                              <td>{item.current_patient_number}</td>
                                              <td>{item.norminal_bed}</td>
                                              <td>{item.hospital_patients_number}</td>
                                              <td>{item.move_in}</td>
                                              <td>{item.going}</td>
                                              <td>{item.death}</td>
                                              <td>{item.move_out}</td>
                                              <td>{item.department}</td>
                                              <td>{item.going_out}</td>
                                              <td>一般病室</td>
                                              <td>{item.common_room}</td>
                                              <td>{item.common_necessity}</td>
                                              <td>{item.common_percent}</td>
                                            </tr>
                                          )}
                                          </>
                                        )
                                      })}
                                    </table>
                                  </div>
                                </>
                              ):(
                                <>
                                  <div className="text-center" style={{fontSize: "2rem"}}>看護部管理日誌（職員管理）</div>
                                  <div className="d-flex staff-table">
                                    <div className="border-top border-bottom text-center" style={{width:"6rem"}}>看護要員数</div>
                                    <table className="table-scroll table table-bordered" id="code-table">
                                      <tr>
                                        <td rowSpan="2" className="td-name"/>
                                        {ward_master.length > 0 && ward_master.map((item,index)=>{
                                          return (
                                            <td colSpan="2" key={index}>{item.name}</td>  
                                          )
                                        })}
                                      </tr>
                                      <tr>
                                      {ward_master.length > 0 && ward_master.map((item,index)=>{
                                        return (<>
                                          <td key={index}>正</td>  
                                          <td>P</td>  
                                        </>)
                                      })}
                                      </tr>
                                      {staff_table !== undefined && staff_table.length > 0 && staff_table.map((item, index)=>{
                                        return (
                                          <tr key={index}>
                                            <td className="td-name">{item.name}</td>
                                            {Object.keys(item.values).length > 0 && Object.keys(item.values).map(sub_index=>{
                                              let sub_item = item.values[sub_index];
                                              return(
                                                <>
                                                  <td>{sub_item[0] != null ? sub_item[0] : ''}</td>
                                                  <td>{sub_item[1] != null ? sub_item[1] : ''}</td>
                                                </>
                                              )
                                            })}
                                          </tr>
                                        )
                                      })}
                                    </table>
                                  </div>
                                </>
                              )}
                            </div>
                          ):(
                            <SpinnerWrapper>
                              <Spinner animation="border" variant="secondary" />
                            </SpinnerWrapper>
                          )}
                        </div>
                        <div className="right-area">
                          <Button type="common" className="w-100 text-center" onClick={this.showNurseList.bind(this)}>入力候補一覧</Button>
                          <div className="input-list">
                            {this.state.nurse_show && this.state.tab_id === 1 && nurse_master.length > 0 && nurse_master.map(item=>{
                              return(
                                <div key={item} className="mt-1">
                                  {item.name}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                  </Wrapper>
                  </DatePickerBox>
                </Modal.Body>
                <Modal.Footer>
                  <Footer>
                    <Button className="print-btn" onClick={this.printData.bind(this)}>印刷</Button>
                    <div className='check-box'>
                      <Checkbox
                        label='プレビューを印刷する'
                        id={`display_check`}
                        getRadio={this.getDisplayCheck.bind(this)}
                        value={this.state.preview_check}
                        name="check"
                      />
                    </div>
                    <Button className="confirm-btn m-auto" onClick={this.approval.bind(this)}>承認</Button>
                    <Button className="print-btn m-auto" onClick={this.cancelApproval.bind(this)}>承認取消</Button>
                    <Button className="cancel-btn" onClick={this.mainCloseModal}>キャンセル</Button>
                    <Button className="red-btn" onClick={this.saveData}>登録</Button>
                  </Footer>
                </Modal.Footer>
                {this.state.confirm_message !== "" && (
                  <SystemConfirmJapanModal
                    hideConfirm= {this.closeModal.bind(this)}
                    confirmCancel= {this.closeModal.bind(this)}
                    confirmOk= {this.confirmOk.bind(this)}
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
                {this.state.selectDoctorModal && (
                  <SelectDoctorModal
                    closeDoctor={this.closeDoctor}
                    getDoctor={this.getDoctor}
                    selectDoctorFromModal={this.selectDoctorFromModal}
                  />
                )}
                {this.state.isOpenPrintPreviewModal && (
                  <AdminDiaryPrintPreview
                    closeModal = {this.closeModal}
                    patient_data = {patient_data}
                    staff_table = {staff_table}
                    ward_master = {ward_master}
                  />
                )}
                {this.state.isConfirmComplete == true && (
                  <CompleteStatusModal
                      message = {this.state.complete_message}
                  />
                )}
              </Modal>
            </>
        );
    }
}

AdminDiaryModal.contextType = Context;
AdminDiaryModal.propTypes = {
    closeModal: PropTypes.func,
    goToPage: PropTypes.func,
};

export default AdminDiaryModal;