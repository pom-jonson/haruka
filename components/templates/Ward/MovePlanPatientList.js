import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import * as apiClient from "~/api/apiClient";
import Button from "~/components/atoms/Button";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import InputWithLabel from "~/components/molecules/InputWithLabel";
import {formatDateLine, formatTimeIE} from "~/helpers/date";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import HospitalPatientHistory from "~/components/templates/Ward/HospitalPatientHistory";
import {getServerTime} from "~/helpers/constants";
import axios from "axios/index";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
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
 .select-ward {
   margin-right:0.5rem;
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
 .date-title {
   height:2rem;
   line-height:2rem;
   width:3.5rem;
 }
 .div-value {
   height:2rem;
   line-height:2rem;
   padding:0 0.3rem;
 }
 .select-date {
    margin-left:0.5rem;
    height:2rem;
   .react-datepicker-wrapper {
       margin-left: -80px;
       margin-top: 15px;
       input {
           display: none;
       }
   }
   .react-datepicker {
       width:unset;
   }
   .react-datepicker-popper {
       transform: translate3d(8px, 29px, 0px);
       .react-datepicker__triangle {
         left: 50px !important;
       }
   }
   .react-datepicker{
     width: 130% !important;
     font-size: 1.25rem;
     .react-datepicker__month-container{
       width:79% !important;
       height:20rem;
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
 .search-date {
   border: 1px solid #aaa;
   width: 9rem;
   text-align: center;
   line-height: 2rem;
   height: 2rem;
 }
 .react-datepicker-wrapper {
   input {
    height: 2rem;
    width: 7rem;
    font-size:1rem;
   }
 }
 .input-area {
   .label-title {
    margin: 0;
    line-height: 2rem;
    font-size: 1rem;
    width: 3.5rem;
   }
   input {
    height: 2rem;
    font-size: 1rem;
    width:10rem;
    ime-mode: inactive;
   }
   div {margin-top:0;}
 }
 .btn-area button {
    margin-left:0.5rem;
    min-width: 2rem;
  }
 .patient-list-table {
   width: 100%;
   .table-title {
    width: 2rem;
    text-align: center;
    padding-top: 4.5rem;
   }
   table {
     width:100%;
     margin:0;
     tbody{
       display:block;
       overflow-y: scroll;
       height: calc(80vh - 20.5rem);
       width:100%;
       tr:nth-child(even) {background-color: #f2f2f2;}
       tr:hover{background-color:#e2e2e2;}
     }
     tr{
       display: table;
       width: 100%;
     }
     thead{
       display:table;
       width:100%;
       border-bottom: 1px solid #dee2e6;
       tr{width: calc(100% - 17px);}
       background-color: #a0ebff;
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
`;

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContextMenuUl = styled.div`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
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
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 1rem;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
      font-size: 1rem;
      font-weight: bold;
    }
    img {
      width: 2rem;
      height: 2rem;
    }
    svg {
      width: 2rem;
      margin: 8px 0;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .blue-text {
    color: blue;
  }
`;

const ContextMenu = ({visible, x, y, patient_info, parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.contextMenuAction("view_history",patient_info)}>履歴表示</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

class MovePlanPatientList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ward_master:[{id:0, value:"全病棟"}],
      first_ward_id:0,
      movement_classification:0,
      patient_id:'',
      seleted_date_time:new Date(),
      load_flag:true,
      patient_lsit:[],
      isOpenHospitalPatientHistory:false,
      complete_message:""
    };
    this.focus = true;
    this.movement_classifications = [
      {id:0, value:"全て"},
      {id:1, value:"入院"},
      {id:2, value:"退院"},
      {id:4, value:"転入"},
    ];
  }
  
  async UNSAFE_componentWillMount () {
    let path = "/app/api/v2/ward/get/ward_master";
    let post_data = {
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        let ward_master = this.state.ward_master;
        if(res.length > 0){
          res.map(ward=>{
            ward_master.push({id:ward.number, value:ward.name});
          });
        }
        this.setState({ward_master});
      })
      .catch(() => {
      
      });
  }
  
  async componentDidMount() {
    await this.searchPatientList();
  }
  
  setWard=(e)=>{
    this.setState({first_ward_id:parseInt(e.target.id)});
  }
  
  setMovementClassification=(e)=>{
    this.setState({movement_classification:parseInt(e.target.id)});
  };
  
  setDate=(value)=>{
    if(value == null || value == ""){
      value = new Date();
    }
    this.setState({seleted_date_time:value});
  };
  
  getDateStr=()=>{
    if(this.state.seleted_date_time == null || this.state.seleted_date_time === ""){
      return '';
    }
    let seleted_date_time = this.state.seleted_date_time;
    if(seleted_date_time instanceof Date) {
      let y = seleted_date_time.getFullYear();
      let m = ("00" + (seleted_date_time.getMonth() + 1)).slice(-2);
      let d = ("00" + seleted_date_time.getDate()).slice(-2);
      let h = ("00" + seleted_date_time.getHours()).slice(-2);
      let min = ("00" + seleted_date_time.getMinutes()).slice(-2);
      let result = y + "/" + m + "/" + d + " " + h + ":" + min;
      return result;
    }
  };
  
  selectToday=()=>{
    this.setState({seleted_date_time: new Date()});
  };
  
  toggle = () => {
    this.component.setOpen(this.focus);
    // this.focus = !this.focus;
  };
  
  setPatientId=(e)=>{
    this.setState({patient_id: e.target.value});
  }
  
  searchPatientList=async()=>{
    if(this.state.load_flag){
      this.setState({load_flag:false});
    }
    let path = "/app/api/v2/ward/search/hospital_patient";
    let post_data = {
      first_ward_id:this.state.first_ward_id,
      patient_id:this.state.patient_id,
      movement_classification:this.state.movement_classification,
      date_and_time_of_hospitalization:(this.state.seleted_date_time != null && this.state.seleted_date_time != "") ? (formatDateLine(this.state.seleted_date_time)+' '+formatTimeIE(this.state.seleted_date_time)) : "",
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          load_flag:true,
          patient_lsit:res,
        });
      })
      .catch(() => {
      
      });
  };
  
  closeModal=()=>{
    this.setState({isOpenHospitalPatientHistory:false});
  }
  
  clearCondition=()=>{
    this.setState({
      first_ward_id:0,
      movement_classification:0,
      patient_id:'',
      seleted_date_time:"",
    });
  }
  
  handleClick=(e, patient_info)=>{
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({contextMenu: {visible: false}});
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: {visible: false}
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("patient-list")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: {visible: false}
          });
          document
            .getElementById("patient-list")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      let modal_left = document.getElementsByClassName("move-plan-patient-list")[0].getElementsByClassName("modal-dialog")[0].offsetLeft;
      let table_left = document.getElementsByClassName("patient-list-table")[0].offsetLeft;
      let table_top = document.getElementsByClassName("patient-list-table")[0].offsetTop;
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - modal_left - table_left,
          y: e.clientY + window.pageYOffset - table_top,
          patient_info,
        }
      });
    }
  };
  
  contextMenuAction = (modal_type, patient_info) => {
    if(modal_type == "view_history") {
      this.setState({
        patient_info,
        isOpenHospitalPatientHistory:true,
      });
    }
  };
  
  get_title_pdf = async () => {
    let title = "移動予定患者一覧_";
    let server_time = await getServerTime();
    title += formatDateLine(this.state.seleted_date_time).split('-').join('') + formatTimeIE(this.state.seleted_date_time).split(':').join('') + '_';
    title += (server_time.split(' ')[0]).split('/').join('');
    return title+".pdf";
  }
  
  printPdf=async()=> {
    this.setState({complete_message:"印刷中"});
    let path = "/app/api/v2/ward/print/move_plan_patient_list";
    let pdf_file_name = await this.get_title_pdf();
    let print_data = {};
    print_data.patient_lsit = this.state.patient_lsit;
    print_data.ward_name = (this.state.ward_master.find((x) => x.id == this.state.first_ward_id) !== undefined) ?
      this.state.ward_master.find((x) => x.id == this.state.first_ward_id).value : "";
    print_data.seleted_date_time = formatDateLine(this.state.seleted_date_time) + " " + formatTimeIE(this.state.seleted_date_time);
    print_data.movement_classification_name = (this.movement_classifications.find((x) => x.id == this.state.movement_classification) !== undefined) ?
      this.movement_classifications.find((x) => x.id == this.state.movement_classification).value : "";
    print_data.patient_id = this.state.patient_id;
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
        this.setState({complete_message:""});
      })
  }
  
  render() {
    return (
      <>
        <Modal
          show={true}
          className="custom-modal-sm move-plan-patient-list first-view-modal"
        >
          <Modal.Header><Modal.Title>移動予定患者一覧</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                <div className={'select-condition'} style={{marginBottom:"0.5rem"}}>
                  <div className={'flex'}>
                    <div className={'select-ward'}>
                      <SelectorWithLabel
                        title="病棟"
                        options={this.state.ward_master}
                        getSelect={this.setWard}
                        departmentEditCode={this.state.first_ward_id}
                      />
                    </div>
                    <div className={'flex'}>
                      <div className={'date-title'}>日付</div>
                      <div style={{marginRight:"0.5rem"}}><Button type="common" onClick={this.selectToday.bind(this)}>本日</Button></div>
                      <Button type="common" onClick={() => this.toggle()}>日付指定</Button>
                      <div className={'select-date'}>
                        <DatePicker
                          ref={(r) => {this.component = r;}}
                          locale="ja"
                          selected={this.state.seleted_date_time}
                          onChange={this.setDate.bind(this)}
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
                      <div className={'search-date'}>{this.getDateStr()}</div>
                    </div>
                  </div>
                  <div className={'flex'} style={{marginTop:"0.5rem"}}>
                    <div className={'select-ward'}>
                      <SelectorWithLabel
                        title="移動区分"
                        options={this.movement_classifications}
                        getSelect={this.setMovementClassification}
                        departmentEditCode={this.state.movement_classification}
                      />
                    </div>
                    <div className={'input-area'}>
                      <InputWithLabel
                        type="text"
                        label={"患者ID"}
                        getInputText={this.setPatientId.bind(this)}
                        diseaseEditData={this.state.patient_id}
                      />
                    </div>
                    <div className={'flex btn-area'}>
                      <Button type="common" onClick={this.searchPatientList}>検索</Button>
                      <Button type="common" onClick={this.clearCondition}>C</Button>
                    </div>
                  </div>
                </div>
                <div className={'patient-list-table flex'}>
                  <table className="table-scroll table table-bordered table-hover">
                    <thead>
                    <tr>
                      <th style={{width:"5rem"}}>移動区分</th>
                      <th style={{width:"5rem"}}>時間</th>
                      <th style={{width:"15rem"}}>患者ID</th>
                      <th>患者氏名</th>
                      <th style={{width:"5rem"}}>病棟</th>
                      <th style={{width:"5rem"}}>病室</th>
                      <th style={{width:"5rem"}}>ベッド</th>
                      <th style={{width:"7rem"}}>希望部屋種</th>
                      <th style={{width:"8rem"}}>推定入院期間</th>
                    </tr>
                    </thead>
                    <tbody id={'patient-list'}>
                    {this.state.load_flag ? (
                      <>
                        {this.state.patient_lsit.length > 0 && (
                          this.state.patient_lsit.map(item=>{
                            return (
                              <>
                                <tr onContextMenu={e => this.handleClick(e, item)}>
                                  <td style={{width:"5rem"}}>{item.movement_classification_name}</td>
                                  <td style={{width:"5rem"}}>{item.move_time}</td>
                                  <td style={{width:"15rem"}} className={'text-right'}>{item.patient_number}</td>
                                  <td>{item.patient_name}</td>
                                  <td style={{width:"5rem"}}>{item.ward_name}</td>
                                  <td style={{width:"5rem"}}>{item.room_name}</td>
                                  <td style={{width:"5rem"}}>{item.bed_name == null ? "病床未定" : item.bed_name}</td>
                                  <td style={{width:"7rem"}}>{item.desired_name != null ? item.desired_name : ""}</td>
                                  <td style={{width:"8rem"}}>{item.estimated_name}</td>
                                </tr>
                              </>
                            )
                          })
                        )}
                      </>
                    ):(
                      <tr>
                        <td colSpan={'8'}>
                          <SpinnerWrapper>
                            <Spinner animation="border" variant="secondary" />
                          </SpinnerWrapper>
                        </td>
                      </tr>
                    )}
                    </tbody>
                  </table>
                </div>
              </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
            <Button
              className={(!this.state.load_flag || this.state.patient_lsit.length === 0) ?'disable-btn' : 'red-btn'}
              isDisabled={!this.state.load_flag || this.state.patient_lsit.length === 0}
              onClick={this.printPdf.bind(this)}
            >一覧印刷</Button>
          </Modal.Footer>
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
          />
          {this.state.isOpenHospitalPatientHistory && (
            <HospitalPatientHistory
              closeModal={this.closeModal}
              patient_info={this.state.patient_info}
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

MovePlanPatientList.propTypes = {
  closeModal: PropTypes.func,
};

export default MovePlanPatientList;
