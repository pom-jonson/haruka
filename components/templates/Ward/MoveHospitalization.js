import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import ja from "date-fns/locale/ja";
import DatePicker, { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import {formatDateLine, formatTimeIE} from "~/helpers/date";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import Spinner from "react-bootstrap/Spinner";
import SelectDoctorModal from "~/components/molecules/SelectDoctorModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import {CACHE_SESSIONNAMES} from "~/helpers/constants";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const renderTooltip = (props) => <Tooltip {...props}>{props}</Tooltip>;

const Wrapper = styled.div`
  display: block;
  width: 100%;
  height: 100%;
  .flex {display: flex;}
  .div-title {
    line-height: 2rem;
    width: 130px;
  }
  .search-date {
    border: 1px solid #aaa;
    width: 10rem;
    background: white;
    height: 2rem;
    display:flex;
    align-items:center;
    padding-left:0.3rem;
  }
  .from-to {
    padding: 0 0.3rem;
    line-height: 2rem;
  }
  .div-value {
    border: 1px solid #aaa;
    width: 15rem;
    line-height: 2rem;
    height: 2rem;
    padding:0 0.3rem;
  }
  .div-doctor {
    border: 1px solid #aaa;
    width: 15rem;
    max-height: 10rem;
    overflow-y:auto;
    div {
      width:100%;
      line-height: 2rem;
      height: 2rem;
      padding:0 0.3rem;
    }
  }
  .table-area {
    width:100%;
    table {
      margin:0;
      tbody{
        display:block;
        overflow-y: scroll;
        height: calc(94vh - 46.5rem);
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
      }
      th {
        position: sticky;
        text-align: center;
        padding: 0.3rem;
        white-space:nowrap;
        border:1px solid #dee2e6;
        border-bottom:none;
        border-top:none;
        vertical-align: middle;
      }
      td {
        padding: 0.25rem;
        word-break: break-all;
      }
    }  
  }
  .pullbox {
      .label-title {
          width: 0;
      }
      .pullbox-label {
          margin-bottom: 0;
          select {
              width: 100px;
              height: 2rem;
          }
      }
  }
  .react-datepicker-wrapper {
    input {
      width:11rem;
      height: 2rem;
    }
  }
  .start-date .react-datepicker-wrapper {
    input {
      width:10rem;
      height: 2rem;
    }
  }
  .hospital-condition {
    .pullbox .pullbox-label select {width:10rem;}
  }
  .select-date{
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
  .patient-info-table {
    width: 100%;
    table {
      margin-bottom: 0;
    }
    th {
      font-size: 1rem;
      vertical-align: top;
      padding: 0;
      text-align: right;
      width: 110px;
      padding-right: 0.2rem;
    }
    td {
      font-size: 1rem;
      vertical-align: top;
      padding: 0;
      text-align: left;
      padding-left: 0.2rem;
      width:15rem;
      word-break: break-all;
      word-wrap: break-word;
    }
  }
`;

const HoverMenu = ({
                     visible,
                     x,
                     y,
                     change_responsibility,
                   }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu hover-menu" style={{ left: ('calc('+x+'px + 1rem)'), top: ('calc('+ y+'px + 4rem)')}}>
          <li>
            <div className={'patient-info-table'}>
              <table className="table-scroll table table-bordered" id="code-table">
                <tbody>
                <tr><th>主担当医</th><td>{change_responsibility.mainDoctor_name}</td></tr>
                {change_responsibility.doctors_name.length > 0 && (
                  change_responsibility.doctors_name.map((name, index)=>{
                    return (
                      <>
                        <tr><th>{index == 0 ? "担当医" : ""}</th><td>{name}</td></tr>
                      </>
                    )
                  })
                )}
                {change_responsibility.nurse_id_in_charge_name != "" && (
                  <tr><th>担当看護師</th><td>{change_responsibility.nurse_id_in_charge_name}</td></tr>
                )}
                {change_responsibility.deputy_nurse_name != "" && (
                  <tr><th>副担当看護師</th><td>{change_responsibility.deputy_nurse_name}</td></tr>
                )}
                {change_responsibility.comment != "" && (
                  <tr><th>フリーコメント</th><td>{change_responsibility.comment}</td></tr>
                )}
                </tbody>
              </table>
            </div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class MoveHospitalization extends Component {
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
      date_and_time_of_hospitalization:new Date(),
      start_date:new Date(),
      alert_messages:"",
      move_history:[],
      hospitalization_route:0,
      hospitalization_identification:0,
      department_codes,
      department_id:props.department_id,
      first_load:false,
      isOpenSelectDoctor:false,
    };
    this.change_flag = 0;
    this.doctors = sessApi.getDoctorList();
    this.ward_master = [];
    this.room_master = [];
    this.bed_master = [];
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    this.is_seal_print = 0;
    if(initState !== undefined && initState != null && initState.conf_data !== undefined){
      if(initState.conf_data.sticker_print_mode !== undefined && initState.conf_data.sticker_print_mode.hospital_move == 2){
        this.is_seal_print = 1;
      }
    }
    this.date_and_time_of_hospitalization = formatDateLine(new Date());
    this.date_and_time_of_hospitalization = new Date(this.date_and_time_of_hospitalization.split('-').join('/')+" 00:00:00");
    this.can_register = false;
  }

  async componentDidMount() {
    this.can_register = this.context.$canDoAction(this.context.FEATURES.MOVE_WARD, this.context.AUTHS.REGISTER)
     || this.context.$canDoAction(this.context.FEATURES.MOVE_WARD, this.context.AUTHS.REGISTER_PROXY);
    await this.getData();
  }

  getData=async()=>{
    let path = "/app/api/v2/ward/get/hospital_move_history";
    let post_data = {
      hos_number:this.props.hos_number,
      modal_type:"move_hospital"
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        if(res.ward_master != undefined && res.ward_master.length > 0){
          res.ward_master.map(ward=>{
            this.ward_master[ward.number] = ward.name;
          })
        }
        if(res.room_master != undefined && res.room_master.length > 0){
          res.room_master.map(room=>{
            this.room_master[room.number] = room.name;
          })
        }
        if(res.bed_master != undefined && res.bed_master.length > 0){
          res.bed_master.map(bed=>{
            this.bed_master[bed.number] = bed.name;
          })
        }
        let date_and_time_of_hospitalization = this.state.date_and_time_of_hospitalization;
        if(res.moving_day !== undefined){
          let final_moving_day = new Date(res.moving_day);
          if(final_moving_day.getTime() > this.date_and_time_of_hospitalization.getTime()){
            this.date_and_time_of_hospitalization = final_moving_day;
            date_and_time_of_hospitalization = final_moving_day;
          }
        }
        this.setState({
          move_history:res.move_history,
          first_load:true,
          date_and_time_of_hospitalization,
        });
      })
      .catch(() => {

      });
  };

  getDateStr=(value = null)=>{
    let search_date = value;
    if(value == null){
      search_date = new Date();
    }
    if(search_date instanceof Date) {
      let y = search_date.getFullYear();
      let m = ("00" + (search_date.getMonth() + 1)).slice(-2);
      let d = ("00" + search_date.getDate()).slice(-2);
      let h = ("00" + search_date.getHours()).slice(-2);
      let min = ("00" + search_date.getMinutes()).slice(-2);
      let result = y + "/" + m + "/" + d + " " + h + ":" + min;
      return result;
    }
  };

  setDateValue = (key, value) => {
    this.change_flag = 1;
    this.setState({[key]:value});
  };

  setDepartmentCode = (e) => {
    this.change_flag = 1;
    this.setState({department_id:parseInt(e.target.id)});
  };

  handleOk=()=>{
    if(!this.can_register) {return;}
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
      this.setState({isOpenSelectDoctor: true});
      return;
    }
    if(this.state.start_date == null || this.state.start_date === ""){
      this.setState({alert_messages:"配膳開始日を入力してください。"});
      return;
    }
    if(this.state.start_time_classification === 0){
      this.setState({alert_messages:"食事時間区分を選択してください。"});
      return;
    }
    let data = [];
    data['date_and_time_of_hospitalization'] = formatDateLine(this.state.date_and_time_of_hospitalization)+' '+formatTimeIE(this.state.date_and_time_of_hospitalization);
    data['start_date'] = formatDateLine(this.state.start_date);
    data['doctor_code'] = authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code;
    data['doctor_name'] = authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name;
    data['department_id'] = this.state.department_id;
    data['department_name'] = this.diagnosis[this.state.department_id];
    data['ward_name'] = this.props.ward_name;
    data['room_name'] = this.props.frame_name;
    data['bed_name'] = this.props.bed_name;
    data['is_seal_print'] = this.is_seal_print;
    this.props.handleOk(data);
  };

  confirmCancel=()=>{
    this.setState({
      alert_messages:"",
      isOpenSelectDoctor:false
    });
  };

  getDoctor = e => {
    this.selectDoctorFromModal(e.target.id, e.target.getAttribute("label"));
  }

  selectDoctorFromModal = (id, name) => {
    let department_name = "その他";
    this.doctors.map(doctor => {
      if (doctor.doctor_code === parseInt(id)) {
        if (doctor.diagnosis_department_name !== "") {
          department_name = doctor.diagnosis_department_name;
        }
      }
    });
    this.context.$updateDoctor(id, name, department_name);
    this.setState({isOpenSelectDoctor:false}, ()=>{
      this.handleOk();
    })
  }
  
  viewResponsibilityInfo = (e, change_responsibility, index) => {
    if(change_responsibility === undefined){return;}
    e.preventDefault();
    // eslint-disable-next-line consistent-this
    const that = this;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({ hoverMenu: { visible: false } });
      document.removeEventListener(`click`, onClickOutside);
    });
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({
        hoverMenu: { visible: false }
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    let clientY = e.clientY;
    let clientX = e.clientX;
    let state_data = {};
    state_data['hoverMenu'] = {
      visible: true,
      x: clientX - 200,
      y: clientY + window.pageYOffset
    };
    state_data['change_responsibility'] = change_responsibility;
    this.setState(state_data, ()=>{
      let patient_height = document.getElementsByClassName("patient-info")[0].offsetHeight;
      let table_top = document.getElementsByClassName("table-area")[0].offsetTop;
      let tr_top = document.getElementsByClassName("tr-"+index)[0].offsetTop;
      let tr_height = document.getElementsByClassName('tr-'+index)[0].offsetHeight;
      let menu_height = document.getElementsByClassName("hover-menu")[0].offsetHeight;
      state_data['hoverMenu']['y'] = patient_height + tr_top + table_top + tr_height - menu_height;
      let td_width = document.getElementsByClassName('movement_name-'+index)[0].offsetWidth;
      let td_left = document.getElementsByClassName('movement_name-'+index)[0].offsetLeft;
      state_data['hoverMenu']['x'] = td_width + td_left;
      this.setState(state_data);
    });
  };
  
  closeViewResponsibilityInfo=()=>{
    let hoverMenu = this.state.hoverMenu;
    if(hoverMenu !== undefined && hoverMenu.visible){
      this.setState({hoverMenu: {visible: false}});
    }
  };

  render() {
    return (
      <>
        <Modal
          show={true}
          className="custom-modal-sm patient-exam-modal move-hospitalization-modal first-view-modal"
        >
          <Modal.Header><Modal.Title>実施状況入力</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                {this.state.first_load ? (
                  <>
                    <div className={'patient-info'}>
                      <div className={'flex select-date'}>
                        <div className={'div-title'}>実施／予定日時</div>
                        {(this.date_and_time_of_hospitalization.getTime() > new Date().getTime()) ? (
                          <OverlayTrigger placement={"top"} overlay={renderTooltip("最新の移動より前の日付は選択できません。")}>
                            <DatePicker
                              locale="ja"
                              id='cur_date_id'
                              selected={this.state.date_and_time_of_hospitalization}
                              onChange={this.setDateValue.bind(this,"date_and_time_of_hospitalization")}
                              dateFormat="yyyy/MM/dd HH:mm"
                              timeCaption="時間"
                              showTimeSelect
                              timeFormat="HH:mm"
                              timeIntervals={10}
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              minDate={this.date_and_time_of_hospitalization}
                              dayClassName = {date => setDateColorClassName(date)}
                            />
                          </OverlayTrigger>
                        ):(
                          <DatePicker
                            locale="ja"
                            id='cur_date_id'
                            selected={this.state.date_and_time_of_hospitalization}
                            onChange={this.setDateValue.bind(this,"date_and_time_of_hospitalization")}
                            dateFormat="yyyy/MM/dd HH:mm"
                            timeCaption="時間"
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={10}
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            minDate={this.date_and_time_of_hospitalization}
                            dayClassName = {date => setDateColorClassName(date)}
                          />
                        )}
                      </div>
                      <div className={'flex'} style={{paddingTop:"0.5rem"}}>
                        <div className={'div-title'}>オーダー</div>
                        <div className={'search-date'}>転棟・転室</div>
                      </div>
                      <div className={'flex'} style={{paddingTop:"0.5rem"}}>
                        <div className={'div-title'}>診療科</div>
                        <div className={'hospital-condition'}>
                          <SelectorWithLabel
                            title=""
                            options={this.state.department_codes}
                            getSelect={this.setDepartmentCode}
                            departmentEditCode={this.state.department_id}
                          />
                        </div>
                      </div>
                      <div style={{paddingTop:"0.5rem"}}>
                        <div className={'flex'}>
                          <div className={'div-title'}> </div>
                          <div className={'div-value'} style={{border:"none", textAlign:"left"}}>移動元</div>
                          <div className={'div-title'}> </div>
                          <div className={'div-value'} style={{border:"none", textAlign:"left"}}>移動先</div>
                        </div>
                        <div className={'flex'} style={{marginTop:"-1px"}}>
                          <div className={'div-title'}>病棟</div>
                          <div className={'div-value'}>{this.ward_master[this.props.patient_info.first_ward_id]}</div>
                          <div className={'div-title'} style={{textAlign:"center"}}>→</div>
                          <div className={'div-value'}>{this.props.ward_name}</div>
                        </div>
                        <div className={'flex'} style={{marginTop:"-1px"}}>
                          <div className={'div-title'}>病室</div>
                          <div className={'div-value'}>{this.room_master[this.props.patient_info.hospital_room_id]}</div>
                          <div className={'div-title'} style={{textAlign:"center"}}>→</div>
                          <div className={'div-value'}>{this.props.frame_name}</div>
                        </div>
                        <div className={'flex'} style={{marginTop:"-1px"}}>
                          <div className={'div-title'}>ベッド</div>
                          <div className={'div-value'}>{this.bed_master[this.props.patient_info.hospital_bed_id]}</div>
                          <div className={'div-title'} style={{textAlign:"center"}}>→</div>
                          <div className={'div-value'}>{this.props.bed_name}</div>
                        </div>
                        <div className={'flex'} style={{marginTop:"-1px"}}>
                          <div className={'div-title'}>主担当医</div>
                          <div className={'div-value'}>{(this.props.patient_info.doctor_names != null && this.props.patient_info.doctor_names[0] !== undefined) ? this.props.patient_info.doctor_names[0] : ""}</div>
                          <div className={'div-title'} style={{textAlign:"center"}}>→</div>
                          <div className={'div-value'}>{(this.props.patient_info.doctor_names != null && this.props.patient_info.doctor_names[0] !== undefined) ? this.props.patient_info.doctor_names[0] : ""}</div>
                        </div>
                        {this.props.patient_info.doctor_names != null && (
                          <div className={'flex'} style={{marginTop:"-1px"}}>
                            <div className={'div-title'}>担当医</div>
                            <div className={'div-doctor'}>
                            {Object.keys(this.props.patient_info.doctor_names).map(doctor=>{
                              return (
                                <>
                                  <div>{this.props.patient_info.doctor_names[doctor]}</div>
                                </>
                              )
                            })}
                            </div>
                            <div className={'div-title'} style={{textAlign:"center"}}>→</div>
                            <div className={'div-doctor'}>
                              {Object.keys(this.props.patient_info.doctor_names).map(doctor=>{
                                return (
                                  <>
                                    <div>{this.props.patient_info.doctor_names[doctor]}</div>
                                  </>
                                )
                              })}
                            </div>
                          </div>
                        )}
                        <div className={'flex'} style={{marginTop:"-1px"}}>
                          <div className={'div-title'}>担当看護師</div>
                          <div className={'div-value'}>{this.props.patient_info.nurse_name_1 !== undefined ? this.props.patient_info.nurse_name_1 : ""}</div>
                          <div className={'div-title'} style={{textAlign:"center"}}>→</div>
                          <div className={'div-value'}>{this.props.patient_info.nurse_name_1 !== undefined ? this.props.patient_info.nurse_name_1 : ""}</div>
                        </div>
                        <div className={'flex'} style={{marginTop:"-1px"}}>
                          <div className={'div-title'}>副担当看護師</div>
                          <div className={'div-value'}>{this.props.patient_info.nurse_name_2 !== undefined ? this.props.patient_info.nurse_name_2 : ""}</div>
                          <div className={'div-title'} style={{textAlign:"center"}}>→</div>
                          <div className={'div-value'}>{this.props.patient_info.nurse_name_2 !== undefined ? this.props.patient_info.nurse_name_2 : ""}</div>
                        </div>
                      </div>
                      <div style={{paddingTop:"1rem"}}>当該患者の他移動情報</div>
                    </div>
                    <div className={'table-area'}>
                      <table className="table-scroll table table-bordered" id="code-table">
                        <thead>
                        <tr>
                          <th style={{width:"3rem"}}>&nbsp;</th>
                          <th style={{width:"3rem"}}>状態</th>
                          <th style={{width:"8rem"}}>実施日</th>
                          <th style={{width:"3rem"}}>時間</th>
                          <th style={{width:"10rem"}}>区分</th>
                          <th style={{width:"4rem"}}>病棟</th>
                          <th style={{width:"4rem"}}>病室</th>
                          <th style={{width:"10rem"}}>ベッド</th>
                          <th>診療科</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.move_history.length > 0 && (
                          this.state.move_history.map((detail, index)=>{
                            return (
                              <>
                                <tr className={'tr-'+index}>
                                  <td style={{width:"3rem"}} className={'text-right'}>{index+1}</td>
                                  <td style={{width:"3rem"}}>{new Date(formatDateLine(detail.moving_day)).getTime() >= new Date(formatDateLine(new Date())).getTime() ? "未" : "済"}</td>
                                  <td style={{width:"8rem"}}>{detail.moving_day}</td>
                                  <td style={{width:"3rem"}}>{detail.moving_time == "00:00" ? "" : detail.moving_time}</td>
                                  <td
                                    style={{width:"10rem"}} className={'movement_name-'+index}
                                    onMouseOver={e => this.viewResponsibilityInfo(e, detail.change_responsibility, index)}
                                    onMouseOut={e => {this.closeViewResponsibilityInfo(e)}}
                                  >{detail.movement_name}</td>
                                  <td style={{width:"4rem"}}>{detail.ward_name}</td>
                                  <td style={{width:"4rem"}}>{detail.room_name}</td>
                                  <td style={{width:"10rem"}}>{detail.bed_name}</td>
                                  <td>{this.diagnosis[detail.department_id]}</td>
                                </tr>
                              </>
                            )
                          })
                        )}
                        </tbody>
                      </table>
                    </div>
                  </>
                ):(
                  <>
                    <div style={{width:"100%"}}>
                      <SpinnerWrapper>
                        <Spinner animation="border" variant="secondary" />
                      </SpinnerWrapper>
                    </div>
                  </>
                )}
              </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className={'cancel-btn'} onClick={this.props.closeModal}>キャンセル</Button>
            <Button tooltip={this.can_register ? '' : '権限がありません。'} className={this.can_register ? 'red-btn' : 'disable-btn'} onClick={this.handleOk}>確定</Button>
          </Modal.Footer>
          <HoverMenu
            {...this.state.hoverMenu}
            change_responsibility={this.state.change_responsibility}
          />
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.confirmCancel.bind(this)}
              handleOk= {this.confirmCancel.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
          {this.state.isOpenSelectDoctor && (
            <SelectDoctorModal
              closeDoctor={this.confirmCancel}
              getDoctor={this.getDoctor}
              selectDoctorFromModal={this.selectDoctorFromModal}
              doctors={this.doctors}
            />
          )}
        </Modal>
      </>
    );
  }
}

MoveHospitalization.contextType = Context;
MoveHospitalization.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  hos_number:PropTypes.number,
  ward_name:PropTypes.string,
  frame_name:PropTypes.string,
  bed_name:PropTypes.string,
  date_and_time_of_hospitalization:PropTypes.string,
  department_id:PropTypes.number,
  patient_info:PropTypes.object,
};

export default MoveHospitalization;
