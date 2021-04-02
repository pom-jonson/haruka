import React, { Component } from "react";
import * as methods from "~/components/templates/Dial/DialMethods";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";

import InputBoxTag from "~/components/molecules/InputBoxTag";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import { formatJapanDate, formatTimePicker, formatDateIE, formatTime, formatDateLine} from "~/helpers/date";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import $ from "jquery";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import {makeList_code, extract_enabled} from "~/helpers/dialConstants";
registerLocale("ja", ja);

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 15px;
  margin-right: 5px;
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  width: 100%;
  height: 100%;
  float: left;
  .dailysis_condition{
    display:flex;
  }
  .direct_man{
    label{
      cursor: text !important;
    }
  }

  .entry_staff_number{
    label{
      cursor: text !important;
    }
    cursor: text !important;
  }
  
  .left{
    float:left;
    font-size:17px;
  }

  .right{
    float:right;
    font-size:15px;
    cursor:pointer;
  }
  .patient_id, .patient_name{
    font-size:25px;
  }
  .schedule_date, .dialyser_table{
    margin-top:15px;
    margin-bottom:10px;
    font-size:15px;
  }   
  .dialyser_table{
    max-height:400px;
    overflow-y:scroll;
  }
  input {
    width: 100%;
    font-size: 15px;
  }  
  td label{
    display:none;
  }
  th{
    font-size:13px;
    padding-left:2px;
    padding-right:2px;
    text-align:center;
  }
  td{
    vertical-align:middle;    
    text-align:center;
    font-size:14px;    
    padding-left:2px;
    padding-right:2px;
  }
  
  .done{
    background-color:rgb(105, 200, 225);
  }
  .not_done{
    background-color:lightgrey;
  }
  .checkbox_area {
    padding-left: 15px;
  }  
  .register_info{
    padding-left: 220px;
  }  
  .inline_input{
    display:flex;
    div{
      margin-top:0px !important;
    }
    .label-title, label{
      width:70px;
      text-align:right;
      margin-right:10px;
      font-size:12px;
    }
    .label-date{
      padding-top:5px;
    }
    input{
      width:180px;      
    } 
  }
  .table-content{
    overflow-y:scroll;
    max-height:200px;
    clear:both;
    margin-bottom:10px;
  }
  .footer {    
    margin-left: 30px;
    margin-top: 10px;
    text-align: center;
    padding-top:20px;
    clear:both;
    label{
      width:100px;      
    }        
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225); 
      border: none;
      margin-right: 30px;
      padding-left: 90px;
      padding-right: 90px;
    }
    .add-button {
      text-align: center;      
    }
    span {
      color: white;
      font-size: 15px;
      font-weight: 100;
    }
  }
 `;

 const ContextMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #5ab0cc;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 1240px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 84px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: white;
    cursor: pointer;
    font-size: 14px;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
    color:black;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .blue-text {
    color: blue;
  }
`;

 const ContextMenu = ({visible, x, y,parent,  item}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.stopSchedule(item)}>中止</div></li>                   
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class TempInspectionModal extends Component {
  constructor(props) {
    super(props); 
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    
    this.state = { 
        entry_date:'',
        entry_time:'',
        entry_staff_number:0,
        instructor_number:0,
        isShowInspectionMasterModal:false,
        isShowTimingcodeMasterModal:false,
        temp_inspect_list:[],
        selected_row_index:null,
    }    
  }

  async componentDidMount() {   
    let code_master = sessApi.getObjectValue("dial_common_master","code_master");
    let examinationCodeData = sessApi.getObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER,"examination_master");
    this.setState({
      examinationCodeData,
      timingCodeData:code_master['実施タイミング'],
      timing_codes:makeList_code(code_master['実施タイミング']),
      examination_codes:makeList_code(examinationCodeData),
    });
      if (this.context.selectedDoctor.code > 0) {
          this.setState({
              instruction_doctor_number: parseInt(this.context.selectedDoctor.code),
          });
      }
    
    this.getTempInspect();
    await this.getStaffs();
    await this.getDoctors();
  }

  getTempInspect = async() => {
    let path = "/app/api/v2/dial/schedule/inspection_search";
    await apiClient
      ._post(path, {
          params: {
            is_enabled:1,
            is_temporary:1,
            system_patient_id:this.props.patientInfo.system_patient_id,
            schedule_date:formatDateLine(this.props.schedule_date),
          }
      })
      .then((res) => {
        if (res.length > 0){            
            this.setState({
              temp_inspect_list:res, 
              entry_staff_number:res[0].updated_by,
              instructor_number:res[0].instruction_doctor_number,
              entry_time: (res[0].updated_at !=undefined && res[0].updated_at !== null) ? formatTimePicker(res[0].updated_at.split(" ")[1]) : "" ,
              entry_date: (res[0].updated_at !=undefined && res[0].updated_at !== null) ? formatDateIE(res[0].updated_at) : "" ,
            })
        } else {
            this.setState({
              temp_inspect_list:[],                
              entry_staff_number:0,
              instructor_number:0,
              entry_date:'',
              entry_time:'',
            })
        }
      })
      .catch(() => {

      });
  }
  showInspectionMaster = (index) => {
    this.setState({
      isShowInspectionMasterModal:true,
      selected_row_index:index,
    });
  }

  showTimingcodeMaster = (index) => {
    this.setState({
      isShowTimingcodeMasterModal:true,
      selected_row_index:index,
    });
  }

  getInputTime = value => {
    this.setState({entry_time: value});
  };

  getInputdate = value => {
    this.setState({entry_date: value});
  };

  showStaffList = (index) => {    
    this.setState({isShowStaffList:true, selected_row_index:index,});    
  }

  showDoctorList = (e) => {    

    // ■DN601 入力者関連のラベルのカーソルの統一
    if (e != undefined && (e.target.type == undefined || e.target.type != "text")) return;

    this.setState({isShowDoctorList:true});
  }

  selectStaff = (staff) => {
    if (this.state.selected_row_index == null){
      this.setState({entry_staff_number:staff.number});
    } else{
      var temp = this.state.temp_inspect_list;
      temp[this.state.selected_row_index].completed_by = staff.number;
      this.setState({temp_inspect_list:temp});
    }    
    
    this.closeModal();
  }

  selectDoctor = (doctor) => {    
    this.setState({instructor_number:doctor.number});
      this.context.$updateDoctor(doctor.number, doctor.name);

    this.closeModal();
  }

  change_not_done = (index) => {    
    var temp = this.state.temp_inspect_list;
    temp[index].is_completed = 0;
    temp[index].completed_by = '';
    this.setState({temp_inspect_list:temp});    
  }

  change_done = (index) => {   
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka")); 
    var temp = this.state.temp_inspect_list;
    temp[index].is_completed = 1;
    temp[index].completed_by = authInfo.user_number;
    this.setState({temp_inspect_list:temp});    
  }

  closeModal = () => {
    this.setState({
      isShowInspectionMasterModal:false,
      isShowTimingcodeMasterModal:false,
      isShowDoctorList:false,
      isShowStaffList:false,
    });
  }

  selectInspection = (item) =>{  
    var temp = this.state.temp_inspect_list;
    var index = this.state.selected_row_index;
    if (index ==null){
      var add_item = {
        'examination_code':item.code,
        'timing_code':'',
        'is_completed':0,
        'completed_by':'',
      }
      temp.push(add_item);
      this.setState({temp_inspect_list:temp});
    } else {
      temp[index].examination_code = item.code;
      this.setState({temp_inspect_list:temp});
    }  
    this.closeModal();
  }

  selectTimingcode = (item) => {
    var temp = this.state.temp_inspect_list;
    var index = this.state.selected_row_index;
    if (index != null){
      temp[index].timing_code = item.code;
      this.setState({temp_inspect_list:temp});
    }
    this.closeModal();
  }

  saveTempInspect = async() => {
    if (this.state.instructor_number == undefined || this.state.instructor_number == null || this.state.instructor_number ==''){
      // window.sessionStorage.setItem("alert_messages", '指示者を選択してください。');
      this.showDoctorList();
      return;
    }
    let path = "/app/api/v2/dial/schedule/inspection_schedule_update";
    let update_data = {
      temp_inspects:this.state.temp_inspect_list,
      system_patient_id:this.props.patientInfo.system_patient_id,
      schedule_date:formatDateLine(this.props.schedule_date),
      entry_date: formatDateLine(this.state.entry_date),
      entry_time: formatTime(this.state.entry_time),
      is_temporary:1,
      inputer:this.state.entry_staff_number,
      instruction_doctor_number:this.state.instructor_number,
    };  
  
    const post_data = {
      params: update_data
    };      
    await apiClient.post(path, post_data)
    .then(() =>{      
      this.props.handleOk();      
    });                
 }
  
handleClick = (e, item) => {
    document.addEventListener(`click`, function onClickOutside() {
      this.setState({ contextMenu: { visible: false } });
      document.removeEventListener(`click`, onClickOutside);
    });
    window.addEventListener("scroll", function onScrollOutside() {
      this.setState({
        contextMenu: { visible: false }
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    document
        .getElementById("dialyer-table")
        .addEventListener("scroll", function onScrollOutside() {
          this.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById("dialyer-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });        
    this.setState({
      contextMenu: {
        visible: true,
        x: e.clientX-$('.modal-dialog').offset().left,
        y: e.clientY -$('.modal-dialog').offset().top - 40,
        item:item
      },

    });
  // }
}

// saveEditedSchedule = async() => {

// };

  onHide=()=>{}

  render() {    
    let {examination_codes, timing_codes, temp_inspect_list} = this.state;
    return  (
      <Modal show={true} onHide={this.onHide}  className="master-modal dailysis-prescription-modal">
        <Modal.Header>
          <Modal.Title>臨時検査編集</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Wrapper>
              <div className='modal_header'>
                <div className="schedule_date">{formatJapanDate(this.props.schedule_date)}</div>
                <span className="patient_id">{this.props.patientInfo.patient_number} : </span>
                <span className="patient_name">{this.props.patientInfo.patient_name}</span>                
              </div>
                <div className = "dialyser_table">
                  
                  <div className="left">臨時検査</div>
                  <div className = "right" onClick ={this.showInspectionMaster.bind(this, null)}><Icon icon={faPlus} />臨時検査を追加</div>
                  <div className="table-content">
                  <table className="table-scroll table table-bordered" id="dialyer-table">
                    <thead>
                      <tr>                          
                        <th>検査名称</th>                          
                        <th>実施タイミング</th>
                        <th>時間</th>                          
                        <th>実施</th>
                        <th>実施者</th>
                      </tr>
                    </thead>
                    <tbody>  
                      {temp_inspect_list !== undefined && temp_inspect_list !== null && temp_inspect_list.length > 0 && examination_codes !== undefined && timing_codes !== undefined && this.state.staff_list_by_number != undefined && (
                        temp_inspect_list.map((item, index) => {
                          return(
                          <tr key={index}>                            
                            <td className="clickable" onClick = {this.showInspectionMaster.bind(this, index)}>{examination_codes[item.examination_code]}</td>
                            <td className="clickable" onClick = {this.showTimingcodeMaster.bind(this, index)}>{item.timing_code!=''?timing_codes[item.timing_code]:''}</td>
                            <td></td>
                            {item.is_completed ===1 && (
                              <td className="text-center done" onClick={() => this.change_not_done(index)}>済</td>
                            )}
                            {item.is_completed ===0 && (
                              <td className="text-center not_done" onClick={() => this.change_done(index)}>未</td>
                            )}                              
                            <td onClick={this.showStaffList.bind(this, index)} className="completed_by"> 
                                {item.completed_by>0?this.state.staff_list_by_number[item.completed_by]:''}
                            </td>
                          </tr>
                          )
                          
                        })
                      )} 
                    </tbody>
                  </table>
                  
                  </div>
                  
                  <div className="register_info">
                    <div className="inline_input">                    
                      <InputWithLabel
                            label="入力日"
                            type="date"
                            getInputText={this.getInputdate}
                            diseaseEditData={this.state.entry_date}
                      />
                      <div className="input-time">
                            <label style={{cursor:"text"}}>入力時間</label>
                            <DatePicker
                                selected={this.state.entry_time}
                                onChange={this.getInputTime}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={10}
                                dateFormat="HH:mm"
                                timeFormat="HH:mm"
                                timeCaption="時間"
                            />
                        </div>
                    </div>
                    <div className="inline_input">
                    {this.state.staff_list_by_number != undefined && (
                    <div className="entry_staff_number remove-x-input" onClick={this.showStaffList.bind(this, null)}>
                      <InputBoxTag
                          label="入力者"
                          type="text"
                          placeholder=""
                          className="left"
                          isDisabled={true}                        
                          value={this.state.entry_staff_number >0 ?this.state.staff_list_by_number[this.state.entry_staff_number]:''}
                      />
                      </div>
                      )}
                      {this.state.doctor_list_by_number != undefined && (
                      <div className='direct_man cursor-input remove-x-input' onClick={(e)=>this.showDoctorList(e).bind(this)}>
                      <InputBoxTag
                        label="指示者"
                        type="text"
                        placeholder=""
                        isDisabled={true}
                        className="left"                                                 
                        value={this.state.instructor_number >0 ?this.state.doctor_list_by_number[this.state.instructor_number]:''}
                      />
                      </div>
                      )}
                    </div>                    
                  </div>
                </div>
                <div className="footer-buttons">                  
                        <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
                        <Button className="red-bttn" onClick={this.saveTempInspect}>登録</Button>                        
                </div>
                <ContextMenu
                  {...this.state.contextMenu}
                  parent={this}
                  favouriteMenuType={this.state.favouriteMenuType}
                />
                {this.state.isShowInspectionMasterModal && (
                  <DialSelectMasterModal
                    closeModal = {this.closeModal}
                    selectMaster = {this.selectInspection}
                    MasterCodeData = {extract_enabled(this.state.examinationCodeData)}
                    MasterName ='検査名'
                  />
                )}
                {this.state.isShowTimingcodeMasterModal && (
                  <DialSelectMasterModal
                    closeModal = {this.closeModal}
                    selectMaster = {this.selectTimingcode}
                    MasterCodeData = {this.state.timingCodeData}
                    MasterName ='実施タイミング'
                  />
                )}
                {this.state.isShowDoctorList && (            
                  <DialSelectMasterModal   
                      selectMaster = {this.selectDoctor}
                      closeModal = {this.closeModal}
                      MasterCodeData = {this.state.doctors}
                      MasterName = '医師'
                  />
                )}
                {this.state.isShowStaffList && (            
                  <DialSelectMasterModal   
                      selectMaster = {this.selectStaff}
                      closeModal = {this.closeModal}
                      MasterCodeData = {this.state.staffs}
                      MasterName = 'スタッフ'
                  />
                )}

            </Wrapper>
        </Modal.Body>        
      </Modal>
    );
  }
}

TempInspectionModal.contextType = Context;

TempInspectionModal.propTypes = {
  closeModal: PropTypes.func,      
  handleOk : PropTypes.func,  
  patientInfo:PropTypes.object,  
  schedule_date:PropTypes.instanceOf(Date),
};

export default TempInspectionModal;
