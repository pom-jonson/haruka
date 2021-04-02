import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import * as apiClient from "~/api/apiClient";
import Checkbox from "~/components/molecules/Checkbox";
import Button from "~/components/atoms/Button";
registerLocale("ja", ja);
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import {formatDateLine, formatJapanDate, formatTimeIE, formatTimeSecondIE} from "~/helpers/date";
import Spinner from "react-bootstrap/Spinner";
import SelectStatusItem from "./SelectStatusItem";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import axios from "axios/index";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";
const Wrapper = styled.div`  
 width: 100%;
 height: 100%;
 font-size: 1rem;
 overflow-y:auto;
 .flex{
  display: flex;
 }
 .justify-content {
  align-items: flex-start;
  justify-content: space-between;
 }
 .div-title {
   height:2rem;
   line-height:2rem;
   width:5rem;
 }
 .select-ward {
   margin-left:0.5rem;
   .label-title {
     width:5rem;
     margin:0;
     line-height: 2rem;
     font-size: 1rem;
   }
   .pullbox-label {
      margin:0;
      select {
        height: 2rem;
        font-size: 1rem;
        width: 7rem;
      }
   }
 }
 .select-date {
    .cur-date {
      line-height: calc(2rem - 2px);
      border: 1px solid #aaa;
      padding: 0 0.2rem;
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
 }
 .check-area {
  margin-top: 0.5rem;
   label {
    font-size: 1rem;
    line-height: 2rem;
    height: 2rem;
    margin-bottom: 0;
   }
 }
 .left-table-area {
   margin-top: 0.5rem;
   border: 1px solid #dee2e6;    
   width: calc(100% - 15rem);
   overflow-x: auto;
   overflow-y: hidden;
   height: calc(80vh - 18rem);
   table {
     margin:0;
     border:none;
     tbody{
       display:block;
       overflow-y: scroll;
       height: calc(80vh - 21.5rem);
       width:100%;
     }
     tr{
       display: table;
       // width: 100%;
     }
     thead{
       display:table;
       // width:100%;    
       border-bottom: 1px solid #dee2e6;    
       // tr{width: calc(100% - 17px);}
     }
     th {
       position: sticky;
       text-align: center;
       padding: 0.3rem;
       white-space:nowrap;
       border:none;
       border-right:1px solid #dee2e6;
       vertical-align: middle;
     }
     td {
       padding: 0.25rem;
       word-break: break-all;
       button {
         width:100%;
         height:2rem;
       }
       .pullbox {
         .pullbox-title {display: none !important;}
         .pullbox-label {
           width:100%;
           margin-bottom: 0;
           .pullbox-select {
             width:100%;
             height:2rem;
           }
         }
       }
     }
     .stop-btn {
       width: 4rem;
       min-width: 4rem;
     }
     .room-name {
       width: 4rem;
       min-width: 4rem;
     }
     .patient-name {
       width: 15.65rem;
       min-width: 15.65rem;
     }
     .age-gender {
       width: 3rem;
       min-width: 3rem;
     }
     .department-name {
       width: 8rem;
       min-width: 8rem;
     }
     .last-th {
      border-right: none;
      padding: 0;
       div {
        width: calc(100% - 17px);
        border-right: 1px solid #dee2e6;
        height: 2rem;
        line-height: 2rem;
       }
     }
   } 
   .selected {background-color:#6FF;}
   .selected:hover {background-color:#6FF;}
 }
 .right-table-area {
   margin-top:0.5rem;
   width:14rem;
   table {
     width:100%;
     margin:0;
     tbody{
       display:block;
       overflow-y: scroll;
       height: calc(80vh - 20rem);
       width:100%;
       tr:nth-child(even) {background-color: #f2f2f2rem;}
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
     th {
       position: sticky;
       text-align: center;
       padding: 0.3rem;
       white-space:nowrap;
       border:none;
       border-right:1px solid #dee2e6;
       vertical-align: middle;
     }
     td {
       padding: 0.25rem;
       word-break: break-all;
     }
    }
   }  
 }
`;

const SpinnerWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class StateBatchRegist extends Component {
  constructor(props) {
    super(props);
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.department_names = {};
    departmentOptions.map(department=>{
      this.department_names[parseInt(department.id)] = department.value;
    });
    this.state = {
      first_ward_id:0,
      seleted_date_time:new Date(),
      view_mode:0,
      alert_messages:"",
      load_flag:false,
      load_data_flag:false,
      isOpenSelectStatusItem:false,
      patient_list:[],
      selected_status_index:"",
      item_master_data:[],
      confirm_message:"",
      confirm_type:"",
      complete_message:"",
    };
    this.ward_master = [];
    this.nursing_status_registration_master = [];
    this.nursing_status_item_master = [];
  }

  async componentDidMount() {
    await this.getMasterData();
    await this.getStatusBatchRegistInfo();
  }
  
  getMasterData=async()=>{
    let path = "/app/api/v2/ward/get/master/state_batch_regist";
    let post_data = {
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        let first_ward_id = 0;
        if(res.ward_master.length > 0){
          res.ward_master.map(ward=>{
            if(first_ward_id == 0){first_ward_id = ward.number;}
            this.ward_master.push({id:ward.number, value:ward.name});
          });
        }
        this.nursing_status_registration_master = res.nursing_status_registration_master;
        this.nursing_status_item_master = res.nursing_status_item_master;
        this.setState({
          load_flag:true,
          first_ward_id,
        });
      })
      .catch(() => {
      
      });
  }

  getStatusBatchRegistInfo=async()=>{
    if(this.state.load_data_flag){
      this.setState({load_data_flag:false});
    }
    let path = "/app/api/v2/nursing_service/get/StatusBatchRegistInfo";
    let post_data = {
      first_ward_id:this.state.first_ward_id,
      date_and_time_of_hospitalization:(this.state.seleted_date_time != null && this.state.start_date_time !== "")
        ? (formatDateLine(this.state.seleted_date_time)+' '+formatTimeIE(this.state.seleted_date_time).split(':')[0]) : "",
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          patient_list:res,
          load_data_flag:true,
        })
      })
      .catch(() => {

      });
  };

  setDate=(value)=>{
    this.setState({seleted_date_time:value}, ()=>{
      this.getStatusBatchRegistInfo();
    });
  };

  setWard=(e)=>{
    this.setState({first_ward_id:parseInt(e.target.id)}, ()=>{
      this.getStatusBatchRegistInfo();
    });
  };

  setViewMode = (name, value) => {
    this.setState({[name]: value});
  }

  closeModal = () => {
    this.setState({
      alert_messages: "",
      confirm_message: "",
      confirm_type: "",
      isOpenSelectStatusItem: false,
    });
  }

  createTable = (type, status_data=null, patient_index=null) => {
    let table_menu = [];
    let index = 0;
    if(type === 'thead'){
      if(this.nursing_status_registration_master.length > 0){
        let master_count = this.nursing_status_registration_master.length;
        for(index = 0; index < (master_count - 1); index++){
          let registration_master_data = this.nursing_status_registration_master[index];
          let max_name_length = registration_master_data['name'].length + 3;
          if(this.nursing_status_item_master[registration_master_data['number']] != undefined && this.nursing_status_item_master[registration_master_data['number']].length > 0){
            this.nursing_status_item_master[registration_master_data['number']].map(item=>{
              if(max_name_length < (item.value.length + 3)){
                max_name_length = item.value.length + 3;
              }
            })
          }
          table_menu.push(
            <th style={{minWidth:max_name_length+"rem"}}>
              {this.nursing_status_registration_master[index]['name']}
            </th>
          );
        }
        let registration_master_data = this.nursing_status_registration_master[master_count - 1];
        let max_name_length = registration_master_data['name'].length + 4;
        if(this.nursing_status_item_master[registration_master_data['number']] != undefined && this.nursing_status_item_master[registration_master_data['number']].length > 0){
          this.nursing_status_item_master[registration_master_data['number']].map(item=>{
            if(max_name_length < (item.value.length + 3)){
              max_name_length = item.value.length + 3;
            }
          })
        }
        table_menu.push(
          <th style={{minWidth:"calc("+max_name_length+"rem + 17px)"}} className={'last-th'}>
            <div>{this.nursing_status_registration_master[master_count - 1]['name']}</div>
          </th>
        )
      }
    }
    if(type === 'tbody') {
      if(this.nursing_status_registration_master.length > 0){
        let master_count = this.nursing_status_registration_master.length;
        for(index = 0; index < (master_count - 1); index++){
          let item_master_data = [{id:0,value:''}];
          let registration_master_data = this.nursing_status_registration_master[index];
          let master_name = "";
          let max_name_length = registration_master_data['name'].length + 3;
          if(this.nursing_status_item_master[registration_master_data['number']] != undefined && this.nursing_status_item_master[registration_master_data['number']].length > 0){
            this.nursing_status_item_master[registration_master_data['number']].map(item=>{
              if(status_data[registration_master_data['number']] != undefined && item.id == status_data[registration_master_data['number']]){
                master_name = item.value;
              }
              if(max_name_length < (item.value.length + 3)){
                max_name_length = item.value.length + 3;
              }
              item_master_data.push(item);
            })
          }
          if(this.state.view_mode == 0){
            table_menu.push(
              <td
               style={{minWidth:max_name_length+"rem", padding:"0.25rem", cursor:"pointer"}}
               className={this.state.selected_status_index == patient_index+":"+registration_master_data['number'] ? "selected" : ""}
               onClick={this.openSelectStatusItem.bind(this, item_master_data, patient_index+":"+registration_master_data['number'])}
              >{master_name}</td>
            );
          } else {
            table_menu.push(
              <td style={{minWidth:max_name_length+"rem", padding:0}}>
                <SelectorWithLabel
                  options={item_master_data}
                  title=""
                  getSelect={this.setStatusItem.bind(this, patient_index+":"+registration_master_data['number'])}
                  departmentEditCode={(status_data[registration_master_data['number']] != undefined) ? status_data[registration_master_data['number']] : 0}
                />
              </td>
            );
          }
        }
        let item_master_data = [{id:0,value:''}];
        let registration_master_data = this.nursing_status_registration_master[master_count - 1];
        let master_name = "";
        let max_name_length = registration_master_data['name'].length + 4;
        if(this.nursing_status_item_master[registration_master_data['number']] != undefined && this.nursing_status_item_master[registration_master_data['number']].length > 0){
          this.nursing_status_item_master[registration_master_data['number']].map(item=>{
            if(status_data[registration_master_data['number']] != undefined && item.id == status_data[registration_master_data['number']]){
              master_name = item.value;
            }
            if(max_name_length < (item.value.length + 3)){
              max_name_length = item.value.length + 3;
            }
            item_master_data.push(item);
          })
        }
        if(this.state.view_mode == 0){
          table_menu.push(
            <td
             style={{minWidth:max_name_length+"rem", padding:"0.25rem", cursor:"pointer"}}
             className={this.state.selected_status_index == patient_index+":"+registration_master_data['number'] ? "selected" : ""}
             onClick={this.openSelectStatusItem.bind(this, item_master_data, patient_index+":"+registration_master_data['number'])}
            >{master_name}</td>
          );
        } else {
          table_menu.push(
            <td style={{minWidth:max_name_length+"rem", padding:0}}>
              <SelectorWithLabel
                options={item_master_data}
                title=""
                getSelect={this.setStatusItem.bind(this, patient_index+":"+registration_master_data['number'])}
                departmentEditCode={(status_data[registration_master_data['number']] != undefined) ? status_data[registration_master_data['number']] : 0}
              />
            </td>
          );
        }
      }
    }
    return table_menu;
  };

  setStatusItem =(value, e)=>{
    let patient_index = value.split(':')[0];
    let nursing_status_registration_id = value.split(':')[1];
    let patient_list = this.state.patient_list;
    patient_list[patient_index]['status_data'][nursing_status_registration_id] = parseInt(e.target.id);
    patient_list[patient_index]['edit_flag'] = 1;
    this.setState({patient_list});
  }

  openSelectStatusItem =(item_master_data, value)=>{
    this.setState({
      item_master_data,
      selected_status_index:value,
      isOpenSelectStatusItem:true,
    });
  }

  setStatusItemByModal =(item_id)=>{
    let patient_index = this.state.selected_status_index.split(':')[0];
    let nursing_status_registration_id = this.state.selected_status_index.split(':')[1];
    let patient_list = this.state.patient_list;
    patient_list[patient_index]['status_data'][nursing_status_registration_id] = parseInt(item_id);
    patient_list[patient_index]['edit_flag'] = 1;
    this.setState({
      patient_list,
      isOpenSelectStatusItem:false,
    });
  }

  getStatusItemCount=(item_id)=>{
    let nursing_status_registration_id = this.state.selected_status_index.split(':')[1];
    let count = 0;
    if(this.state.patient_list.length > 0){
      this.state.patient_list.map(patient=>{
        if(patient['status_data'][nursing_status_registration_id] != undefined && patient['status_data'][nursing_status_registration_id] == item_id){
          count++;
        }
      })
    }
    return count;
  }

  stopStatusData=(index)=>{
    let patient_list = this.state.patient_list;
    patient_list[index]['stop_flag'] = 1;
    patient_list[index]['edit_flag'] = 1;
    this.setState({patient_list});
  }

  confirmRegister=()=>{
    this.setState({
      confirm_message:"登録しますか？",
      confirm_type:"register",
    });
  }

  confirmOk=()=>{
    if(this.state.confirm_type == "register"){
      this.register();
    }
  }

  register=async()=>{
    this.setState({
      confirm_message:"",
      confirm_type:"",
      complete_message:"登録中"
    });
    let path = "/app/api/v2/nursing_service/save/StatusBatchRegistInfo";
    let post_data = {
      first_ward_id:this.state.first_ward_id,
      target_datetime:(this.state.seleted_date_time != null && this.state.start_date_time !== "") ? (formatDateLine(this.state.seleted_date_time)+' '+formatTimeIE(this.state.seleted_date_time)) : "",
      data:this.state.patient_list,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        if(res.success_message != undefined){
          window.sessionStorage.setItem("alert_messages", res.success_message);
          this.props.closeModal();
        } else if(res.error_message != undefined){
          this.setState({
            complete_message:"",
            alert_messages:res.error_message
          });
        }
      })
      .catch(() => {

      });
  }
  
  get_title_pdf = async () => {
    let pdf_file_name = "状態一括登録_";
    pdf_file_name = pdf_file_name + formatDateLine(this.state.seleted_date_time).split("-").join("") + formatTimeSecondIE(this.state.seleted_date_time).split(":").join("");
    return pdf_file_name+".pdf";
  }
  
  printList=async()=>{
    if (this.state.patient_list.length === 0 || this.state.load_data_flag == false){
      return;
    }
    this.setState({
      complete_message:"印刷中"
    });
    let pdf_file_name = await this.get_title_pdf();
    let path = "/app/api/v2/nursing_service/print/StatusBatchRegistInfo";
    let print_data = {
      patient_list:this.state.patient_list,
      date:formatJapanDate(this.state.seleted_date_time) + " " + formatTimeIE(this.state.seleted_date_time).split(':')[0]+'時',
      ward_name:(this.ward_master.find((x) => x.id == this.state.first_ward_id) != undefined) ?
        this.ward_master.find((x) => x.id == this.state.first_ward_id).value : "",
      nursing_status_registration_master:this.nursing_status_registration_master,
      nursing_status_item_master:this.nursing_status_item_master,
      department_names:this.department_names,
    };
    axios({
      url: path,
      method: 'POST',
      data:{print_data},
      responseType: 'blob', // important
    }).then((response) => {
        this.setState({complete_message:""});
        const blob = new Blob([response.data], { type: 'application/octet-stream' });
        if(window.navigator.msSaveOrOpenBlob) {
          //IE11 & Edge
          window.navigator.msSaveOrOpenBlob(blob, pdf_file_name);
        }
        else{
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', pdf_file_name); //or any other extension
          document.body.appendChild(link);
          link.click();
        }
      })
      .catch(() => {
        this.setState({
          complete_message:"",
          alert_messages:"印刷失敗",
        });
      })
  }

  render() {
    let change_flag = false;
    if(this.state.patient_list.length > 0){
      this.state.patient_list.map(patient=>{
        if(patient.edit_flag != undefined && patient.edit_flag == 1){
          change_flag = true;
        }
      })
    }
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className="cur-date morning example-custom-input" onClick={onClick}>
        {formatJapanDate(value) + " " + formatTimeIE(value).split(':')[0]+'時'}
      </div>
    );

    return (
      <>
        <Modal
          show={true}
          className="custom-modal-sm state-batch-regist first-view-modal"
        >
          <Modal.Header><Modal.Title>状態一括登録</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                <div className={'flex'}>
                  <div className={'flex select-period'}>
                    <div className={'div-title'}>対象日時</div>
                    <div className={'select-date'}>
                      <DatePicker
                        locale="ja"
                        selected={this.state.seleted_date_time}
                        onChange={this.setDate.bind(this)}
                        dateFormat="yyyy/MM/dd HH:mm"
                        timeCaption="時間"
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={60}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        customInput={<ExampleCustomInput />}
                        dayClassName = {date => setDateColorClassName(date)}
                      />
                    </div>
                  </div>
                  <div className={'select-ward'}>
                    <SelectorWithLabel
                      title="選択病棟"
                      options={this.ward_master}
                      getSelect={this.setWard}
                      departmentEditCode={this.state.first_ward_id}
                    />
                  </div>
                </div>
                <div className={'check-area'}>
                  <Checkbox
                    label="POPUP表示しない"
                    getRadio={this.setViewMode.bind(this)}
                    value={this.state.view_mode === 1}
                    name="view_mode"
                  />
                </div>
                <div className={'flex justify-content'}>
                  <div className={'left-table-area'}>
                    {this.state.load_flag ? (
                      <>
                        <table className="table-scroll table table-bordered table-hover">
                          <thead>
                            <tr>
                              <th className={'stop-btn'}>一括止</th>
                              <th className={'room-name'}>病室</th>
                              <th className={'patient-name'}>氏名</th>
                              <th className={'age-gender'}>年齢</th>
                              <th className={'age-gender'}>性別</th>
                              <th className={'department-name'}>診療科</th>
                              {this.createTable('thead')}
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.load_data_flag ? (
                              <>
                                {this.state.patient_list.length > 0 && (
                                  this.state.patient_list.map((item, index)=>{
                                    if(item.stop_flag != 1){
                                      return (
                                        <>
                                          <tr>
                                            <td className={'stop-btn'} style={{padding:0}}><button onClick={this.stopStatusData.bind(this, index)}>止め</button></td>
                                            <td className={'room-name'}>{item.room_name}</td>
                                            <td className={'patient-name'}>{item.patient_name}</td>
                                            <td className={'age-gender'}>{item.age + "歳"}</td>
                                            {/* <td className={'age-gender'}>{item.age + "歳" + item.age_month+"ヶ月"}</td> */}
                                            <td className={'age-gender'}>{item.gender == 1 ? "男" : "女"}性</td>
                                            <td className={'department-name'}>{this.department_names[item.department_id]}</td>
                                            {this.createTable('tbody', item['status_data'], index)}
                                          </tr>
                                        </>
                                      );
                                    }
                                  })
                                )}
                              </>
                            ):(
                              <tr style={{width:"100%"}}>
                                <td colSpan={6+this.nursing_status_registration_master.length}>
                                  <SpinnerWrapper style={{padding:"10rem"}}>
                                    <Spinner animation="border" variant="secondary" />
                                  </SpinnerWrapper>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </>
                    ):(
                      <SpinnerWrapper>
                        <Spinner animation="border" variant="secondary" />
                      </SpinnerWrapper>
                    )}
                  </div>
                  <div className={'right-table-area'}>
                    <table className="table-scroll table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>項目名称</th>
                          <th style={{width:"6rem"}}>合計</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.item_master_data.length > 0 && (
                          this.state.item_master_data.map(item=>{
                            if(item.id != 0){
                              return (
                                <>
                                  <tr>
                                    <td>{item.value}</td>
                                    <td style={{width:"3rem", textAlign:"right"}}>{this.getStatusItemCount(item.id)}</td>
                                  </tr>
                                </>
                              );
                            }
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            <Button className={"red-btn"} onClick={this.printList}>{"印刷"}</Button>
            {change_flag ? (
              <Button className={"red-btn"} onClick={this.confirmRegister}>{"確定"}</Button>
            ):(
              <Button className={"disable-btn"}>{"確定"}</Button>
            )}

          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
          {this.state.isOpenSelectStatusItem && (
            <SelectStatusItem
              closeModal={this.closeModal}
              setStatusItem={this.setStatusItemByModal}
              master_data={this.state.item_master_data}
            />
          )}
          {this.state.confirm_message !== "" && (
            <SystemConfirmJapanModal
              hideConfirm= {this.closeModal.bind(this)}
              confirmCancel= {this.closeModal.bind(this)}
              confirmOk= {this.confirmOk}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.complete_message !== '' && (
            <CompleteStatusModal
              message = {this.state.complete_message}
            />
          )}
        </Modal>
      </>
    );
  }
}

StateBatchRegist.propTypes = {
  closeModal: PropTypes.func
};

export default StateBatchRegist;
