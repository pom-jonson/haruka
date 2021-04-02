import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import * as colors from "~/components/_nano/colors";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import RadioButton from "~/components/molecules/RadioInlineButton";
import Radiobox from "~/components/molecules/Radiobox";
import Checkbox from "~/components/molecules/Checkbox";
import * as apiClient from "~/api/apiClient";
import {formatDateLine, formatJapanDateSlash} from "~/helpers/date";
import InspectionDoneModal from "~/components/templates/OrderList/InspectionDoneModal";
import TreatDoneModal from "~/components/templates/OrderList/TreatDoneModal";
import NotDoneListModal from "~/components/organisms/NotDoneListModal";
import OrderDoneModal from "~/components/templates/OrderList/OrderDoneModal";
import RehabilyOrderDoneModal from "~/components/templates/OrderList/RehabilyOrderDoneModal";
import SelectDoctorModal from "~/components/templates/Patient/components/SelectDoctorModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import {CACHE_SESSIONNAMES} from "~/helpers/constants";
import ExaminationDoneModal from "~/components/templates/OrderList/ExaminationDoneModal";
import {setDateColorClassName} from '~/helpers/dialConstants';
registerLocale("ja", ja);
import $ from 'jquery';
import {DatePickerBox} from "~/components/styles/DatePickerBox";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  .treat-date{
    padding: 5px;
  }
  .treat-date-label{
    height: 2rem;
    line-height: 2rem;
    margin-right: 10px;
    font-size: 1rem;
  }
  .date-select{
    input{
        width: 100px;
    }
  }
  .depart-label{
    font-size: 1rem;
    margin-right: 10px;
    line-height: 2rem;
  }
  .search-department-type{
    display: flex;
    width: 30%;
    label{        
        font-size: 1rem;
        line-height: 2rem;
    }
  }
  .ok{
    width: 100px;
    font-size: 1rem;
    span{
        font-size: 1rem;
    }
  }
  .search-order-type{
    width: 70%;
    display: flex;
    justify-content: flex-end;
    .order-label{
        margin-right: 10px;
        line-height: 2rem;
        font-size: 1rem;
    }
    label{
        font-size: 1rem;
    }

    .radio-btn{
        width: 100px;
        margin-left: 10px;
        label{
            background: #aaa;
            border-radius: 0px;
            color: white;
        }
    }
    .focused{
        input:checked + label{
            background: white;
            color: #212529;
            border: 1px solid #212529;
        }
    }
  }
  .search-order-results{
    // overflow-y: auto;
    // height: 60vh;
    // border: 1px solid #ddd;
  }

  table{
    width: 100%;
    border: 1px solid #ddd;
  }

  thead{
    margin-bottom: 0;
    display:table;
    width:100%;        
    border: 1px solid #dee2e6;
    tr{
      width: calc(100% - 16px);
    }
  }
  tbody{
    height: calc(100vh - 35vh);
    overflow-y: scroll;
    display:block;
  }
  th {
    background-color: ${colors.midEmphasis};
    color: ${colors.surface};
    text-align: center;
    font-weight: normal;
    label {
      color: ${colors.surface};
    }
  }
  tr{
    display: table;
    width: 100%;
    box-sizing: border-box;
  }
  th,td {
    border: 1px solid #ddd;
    padding: 4px 8px;
    label {font-size:1rem;}
  }
  .div-button{
    border: 2px solid rgb(126, 126, 126) !important;
    margin: 0px;
    padding: 0px;
    width: 100%;
    line-height: 2rem;    
    background: rgb(239, 239, 239);
    cursor: pointer;
    text-align: center;
    }
    .all-del-check {
      margin-right: 24rem;
      margin-bottom: 0.5rem;
      float: right;
      label {
        margin-right: 0;
        font-size:1rem;
      }
    }
`;


class OutHospitalGroupDeleteModal extends Component {
  constructor(props) {
    super(props);
    this.state={
      discharge_date: this.props.discharge_date ? new Date(this.props.discharge_date) : new Date(),
      search_department_type: 0,
      search_order_type: 3,
      checkList: [],
      list_data: [],
      isDoctorsOpen: false,
      isOpenexaminDoneModal: false,
      isOpenRehabilyDoneModal: false,
      delete_flag:true,
      old_delete_flag:true,
      confirm_type:"",
      confirm_title:"",
      confirm_message:"",
      load_flag:false,
    };
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.cur_date = new Date();
  }

  async componentDidMount() {
    this.getSearchResult();
    let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
    if (init_status != null && init_status != undefined && init_status.doctors_list != undefined && init_status.doctors_list != null) {
      this.setState({doctors: init_status.doctors_list});
    }
    var all_check_obj = document.getElementsByClassName('all-del-check')[0];
    let html_obj = document.getElementsByTagName("html")[0];
    let width = html_obj.offsetWidth;
    if(parseInt(width) < 1367){
      all_check_obj.style['margin-right'] = '23.5rem';
    } else if(parseInt(width) < 1441){
      all_check_obj.style['margin-right'] = '23.5rem';
    } else if(parseInt(width) < 1601){
      all_check_obj.style['margin-right'] = '24rem';
    } else if(parseInt(width) < 1681){
      all_check_obj.style['margin-right'] = '24.5rem';
    } else if(parseInt(width) > 1919){
      all_check_obj.style['margin-right'] = '25rem';
    }
    $(document).ready(function(){
      $(window).resize(function(){
        let html_obj = document.getElementsByTagName("html")[0];
        let width = html_obj.offsetWidth;
        if(parseInt(width) < 1367){
          all_check_obj.style['margin-right'] = '23.5rem';
        } else if(parseInt(width) < 1441){
          all_check_obj.style['margin-right'] = '23.5rem';
        } else if(parseInt(width) < 1601){
          all_check_obj.style['margin-right'] = '24rem';
        } else if(parseInt(width) < 1681){
          all_check_obj.style['margin-right'] = '24.5rem';
        } else if(parseInt(width) > 1919){
          all_check_obj.style['margin-right'] = '25rem';
        }
      });
    });
    if (this.context.$canDoAction(this.context.FEATURES.DISCHARGE_DELETE,this.context.AUTHS.DELETE)
      || this.context.$canDoAction(this.context.FEATURES.DISCHARGE_DELETE,this.context.AUTHS.DELETE_PROXY))
    {
      this.setState({delete_flag:false});
    }
    if (this.context.$canDoAction(this.context.FEATURES.DISCHARGE_DELETE,this.context.AUTHS.DELETE_OLD)
      || this.context.$canDoAction(this.context.FEATURES.DISCHARGE_DELETE,this.context.AUTHS.DELETE_PROXY_OLD))
    {
      this.setState({old_delete_flag:false});
    }
  }

  getDepartmentName = (id = null) => {
    let code = this.context.department.code;
    if (id != null) code = id;
    let name = "";
    this.departmentOptions.map(item => {
      if (item.id === parseInt(code)) {
        name = item.value;
      }
    });
    if (this.context.department.code == 0) {
      return "内科";
    }
    return name;
  };

  setSearchDepartmentType = (department_type) => {
    this.setState({
      search_department_type: department_type
    }, ()=>{
      this.getSearchResult();
    });
  }

  selectOrderType = (order_type) => {
    this.setState({
      search_order_type: order_type
    }, ()=>{
      this.getSearchResult();
    });
  }

  getDate = value => {
    this.setState({
      discharge_date: value,
    }, ()=>{
      this.getSearchResult();
    });
  };

  getRadio(name, value) {
    let chkList = [...this.state.checkList];
    if( value === 1) {
      chkList.push(parseInt(name));
    } else {
      var index = chkList.indexOf(name)
      if (index !== -1) {
        chkList.splice(index, 1);
      }
    }
    let {all_check} = this.state;
    if (chkList.length != 0 && chkList.length == this.state.list_data.length) {
      all_check = 1;
    } else {
      all_check = 0;
    }
    this.setState({
      checkList: chkList,
      all_check
    });
  }

  getSearchResult =async()=>{
    if(this.state.load_flag){
      this.setState({load_flag: false});
    }
    let path = "/app/api/v2/in_out_hospital/order_after_out_hospital/get";
    let post_data = {
      search_order_type:this.state.search_order_type,
      search_department_type:this.state.search_department_type == 0 ? 0 : this.context.department.code,
      discharge_date:this.state.discharge_date !== '' ? formatDateLine(this.state.discharge_date) : '',
      patient_id: this.props.patientId
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          list_data: res,
          load_flag:true,
        });
      })
      .catch(() => {
      });
  }

  handleDelete = () => {
    if (this.state.checkList.length == 0 || this.state.list_data.length == 0) return;
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
      this.setState({isDoctorsOpen: true});
      return;
    }
    this.setState({
      confirm_type: "_delete",
      confirm_title: "削除確認",
      confirm_message: "選択した項目を削除しますか？",
    });
  }

  doDelete = async () => {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let arr = [];
    this.state.list_data.map(item=>{
      if (this.state.checkList.indexOf(item.number) != -1) {
        // if (item.category == "") {}
        let path = "";
        let post_data = {};
        switch(item.category){
          case "処方":
          case "在宅":
            path = "/app/api/v2/order/prescription/delete_from_soap";
            break;
          case "記":
            path = "/app/api/v2/order/hospital/allergy/delete";
            break;
          case "検査":
            path = "/app/api/v2/order/examination/delete";
            break;
          case "注射":
            path = "/app/api/v2/order/injection/delete_from_soap";
            break;
          case "生理検査":
          case "内視鏡検査":
            path = "/app/api/v2/order/inspection/delete";
            break;
          case "処置":
            path = "/app/api/v2/order/treat/delete";
            break;
          case "放射線":
            path = "/app/api/v2/order/radiation/deleteOrder";
            post_data.type = 'order';
            post_data.number = item.number;
            break;
          case "リハビリ":
            path = "/app/api/v2/order/rehabily/delete";
            break;
          case "汎用オーダー":
            path = "/app/api/v2/order/guidance/delete";
            break;
          case "管理・指導":
            path = "/app/api/v2/order/guidance/delete";
            break;
        }

        post_data.number = item.record_number;
        post_data.doctor_code = authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code,
          post_data.doctor_name = authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name,

          arr.push({path: path, post_data: post_data});
        // await apiClient
        // ._post(path, {
        //     params: post_data
        // });
      }
    });
    for (let i = 0; i < arr.length; i ++) {
      await apiClient
        ._post(arr[i].path, {
          params: arr[i].post_data
        });
    }
    this.getSearchResult();
  }

  handleShowDetail = (item) => {
    if(item.category === '処方'){
      this.setState({
        modal_title: "処方",
        modal_type: "prescription",
        modal_data: item,
        only_close_btn: true,
        isOpenDoneModal: true
      });
    }
    if(item.category === '注射'){
      this.setState({
        modal_title: "注射",
        modal_type: "injection",
        modal_data: item,
        only_close_btn: true,
        isOpenDoneModal: true
      });
    }
    if(item.category === '処置'){
      this.setState({
        isOpenTreatmentDoneModal: true,
        only_close_btn: true,
        modal_data:item,
      });
    }
    if(item.category === '生理検査' || item.category === '内視鏡検査'){
      this.setState({
        isOpenInspectionDoneModal: true,
        modal_title:item.category,
        modal_type:item.category === '生理検査' ? 'inspection' :'endoscope',
        only_close_btn: true,
        modal_data:item,
      });
    }
    if(item.category === '放射線'){
      this.setState({
        isOpenOrderDoneModal: true,
        modal_title:item.category,
        modal_type:'radiation',
        only_close_btn: true,
        modal_data:item,
      });
    }
    if(item.category === 'リハビリ'){
      this.setState({
        isOpenRehabilyDoneModal: true,
        modal_title:item.category,
        modal_type:'rehabily',
        only_close_btn: true,
        modal_data:item,
      });
    }
    if(item.category === '汎用オーダー' || item.category == '管理・指導'){
      this.setState({
        isOpenOrderDoneModal: true,
        modal_title:item.category,
        modal_type:'guidance',
        only_close_btn: true,
        modal_data:item,
      });
    }
    if(item.category === '検査' && (item.sub_category === 'オーダー' || item.sub_category === '細胞診検査' ||
      item.sub_category === '病理検査' || item.sub_category === '細菌検査')){
      this.setState({
        isOpenexaminDoneModal: true,
        modal_title:'検体検査',
        modal_type:'examination',
        only_close_btn: true,
        modal_data:item,
      });
    }
  }

  closeModal =()=>{
    this.setState({
      isOpenInspectionDoneModal: false,
      isOpenRehabilyDoneModal: false,
      isOpenTreatmentDoneModal: false,
      isOpenexaminDoneModal: false,
      isOpenOrderDoneModal: false,
      isOpenDoneModal: false,
      confirm_type:"",
      confirm_title:"",
      confirm_message:"",
    });
  }

  closeDoctorModal = () => {
    this.setState({isDoctorsOpen: false});
  };

  getDoctor = e => {
    let department_name = "その他";
    this.state.doctors.map(doctor => {
      if (doctor.doctor_code === parseInt(e.target.id)) {
        if (doctor.diagnosis_department_name !== "") {
          department_name = doctor.diagnosis_department_name;
        }
      }
    });
    this.context.$updateDoctor(e.target.id, e.target.getAttribute("label"), department_name);

    this.setState({isDoctorsOpen: false});
    this.handleDelete();
  }

  confirmOk = () => {
    if(this.state.confirm_type === "modal_close"){
      this.props.closeModal();
    }
    if(this.state.confirm_type === "_delete"){
      this.doDelete();
      this.closeModal();
    }
  }

  getAllCheck = (name, value) => {
    if (name == 'check') {
      let {list_data, checkList} = this.state;
      if (value == 1) {
        if (list_data.length > 0) {
          list_data.map(item=>{
            var index = checkList.indexOf(item.number)
            if (index == -1) {
              checkList.push(parseInt(item.number));
            }
          })
        }
      } else {
        checkList = [];
      }
      this.setState({all_check: value, checkList});
    }
  }
  
  confirmCloseModal=()=>{
    if(this.state.checkList.length > 0){
      this.setState({
        confirm_type:"modal_close",
        confirm_title:"入力中",
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
      });
    } else {
      this.props.closeModal();
    }
  }

  render() {
    let cur_department = this.getDepartmentName();
    return (
      <>
        <Modal show={true} id="outpatient" className="custom-modal-sm patient-exam-modal outpatient-modal first-view-modal">
          <Modal.Header><Modal.Title>退院一括削除</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox>
              <Wrapper>
                <div style={{display:"flex"}}>
                  <div className="treat-date-label">日付</div>
                  <div className="date-select no-border">
                    <DatePicker
                      locale="ja"
                      selected={this.state.discharge_date}
                      onChange={this.getDate.bind(this)}
                      dateFormat="yyyy/MM/dd"
                      placeholderText="年/月/日"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      className={this.state.datefocus ? "readline" : ""}
                      minDate={this.state.old_delete_flag ? this.cur_date : ""}
                      dayClassName = {date => setDateColorClassName(date)}
                    />
                  </div>
                  <div className="treat-date-label" style={{marginLeft:"0.5rem"}}>以降</div>
                </div>
                <div style={{display:"flex", marginTop:"5px"}}>
                  <div className="search-department-type">
                    <div className="depart-label">診療科</div>
                    <Radiobox
                      label={'全科'}
                      value={0}
                      getUsage={()=>this.setSearchDepartmentType(0)}
                      checked={this.state.search_department_type == 0 ? true : false}
                      name={`search_department_type`}
                    />
                    <Radiobox
                      label={cur_department}
                      value={1}
                      getUsage={()=>this.setSearchDepartmentType(1)}
                      checked={this.state.search_department_type == 1 ? true : false}
                      name={`search_department_type`}
                    />
                  </div>
                  <div className="search-order-type">
                    <div className="order-label" style={{marginRight:"10px"}}>オーダー</div>
                    <RadioButton
                      id={'order_type_0'}
                      value={0}
                      label={'処置'}
                      getUsage={()=>this.selectOrderType(0)}
                      checked={this.state.search_order_type == 0 ? true : false}
                      name={'search_order_type'}
                    />
                    <RadioButton
                      id={'order_type_1'}
                      value={1}
                      label={'検査'}
                      getUsage={()=>this.selectOrderType(1)}
                      checked={this.state.search_order_type == 1 ? true : false}
                      name={'search_order_type'}
                    />
                    <RadioButton
                      id={'order_type_2'}
                      value={2}
                      label={'処方/注射'}
                      getUsage={()=>this.selectOrderType(2)}
                      checked={this.state.search_order_type == 2 ? true : false}
                      name={'search_order_type'}
                    />
                    <RadioButton
                      id={'order_type_3'}
                      value={3}
                      label={'全て'}
                      getUsage={()=>this.selectOrderType(3)}
                      checked={this.state.search_order_type == 3 ? true : false}
                      name={'search_order_type'}
                    />
                  </div>
                </div>
                <div className='all-del-check'>
                  <Checkbox
                    label="一括チェック"
                    getRadio={this.getAllCheck.bind(this)}
                    value={this.state.all_check}
                    name={`check`}
                    isDisabled={this.state.delete_flag}
                  />
                </div>
                <div className="search-order-results">
                  <table>
                    <thead>
                    <tr>
                      <th style={{width:"10rem"}}>実施日</th>
                      <th style={{width:"10rem"}}>時間</th>
                      <th>オーダー</th>
                      <th style={{width:"10rem"}}>詳細</th>
                      <th style={{width:"10rem"}}>必要(削除)</th>
                      <th style={{width:"10rem"}}>入外</th>
                      <th style={{width:"10rem"}}>診療科</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.load_flag ? (
                      <>
                        {this.state.list_data.length > 0 && this.state.list_data.map(item=>{
                          let order_title = item.category;
                          var treat_date = null;
                          var treat_time = null;
                          if(item.category === '処方' || item.category === '処置' || item.category === '注射'){
                            order_title = (item.karte_status === 1 ? '外来' : item.karte_status === 3 ? '入院' :'在宅') + item.category;
                            if (item.category === '処方'){
                              var start_date = item.order_data.order_data[0].start_date;
                              treat_date = start_date.substring(0, 4) + '-' + start_date.substring(4, 6) + '-' + start_date.substring(6, 8);
                            }
                            if (item.category === '処置'){
                              treat_date = item.date;
                            }
                            if (item.category === '注射'){
                              treat_date = item.order_data.schedule_date;
                            }
                          }
                          if(item.category === '検査' && (item.sub_category === 'オーダー' || item.sub_category === '細胞診検査' ||
                            item.sub_category === '病理検査' || item.sub_category === '細菌検査')){
                            order_title = '検体検査';
                            if (item.sub_category == "細胞診検査") order_title = "細胞診検査";
                            else if (item.sub_category == "病理検査") order_title = "病理組織検査";
                            else if (item.sub_category == "細菌検査") order_title = "細菌・抗酸菌検査";
                            treat_date = item.order_data.order_data.collected_date;
                            treat_time = item.order_data.order_data.collected_time;
                          }
                          if(item.category === '放射線' || item.target_table === 'inspection_order'){
                            order_title = item.sub_category;
                            if(item.category === '放射線'){
                              treat_date = item.order_data.order_data.treat_date;
                            }
                            if(item.target_table === 'inspection_order'){
                              treat_date = item.order_data.order_data.inspection_DATETIME;
                              treat_time = (item.order_data.order_data.reserve_time !== undefined && item.order_data.order_data.reserve_time != null
                                && item.order_data.order_data.reserve_time !== "") ? item.order_data.order_data.reserve_time : ""
                            }
                          }
                          if(item.category === 'リハビリ'){
                            treat_date = item.order_data.order_data.done_want_date;
                          }
                          return(
                            <>
                              <tr>
                                <td style={{width:"10rem"}}>{formatJapanDateSlash(treat_date)}</td>
                                <td style={{width:"10rem"}}>{treat_time}</td>
                                <td>{order_title}</td>
                                <td style={{width:"10rem", textAlign:"center", padding:0}}>
                                  <div className="div-button ok" onClick={()=>this.handleShowDetail(item, order_title)}>詳細</div>
                                </td>
                                <td style={{width:"10rem"}}>
                                  <Checkbox
                                    label="削除"
                                    getRadio={this.getRadio.bind(this)}
                                    value={this.state.checkList.indexOf(item.number) !== -1 ? 1 : 0}
                                    name={item.number}
                                    isDisabled={this.state.delete_flag}
                                  />
                                </td>
                                <td style={{width:"10rem"}}>{item.karte_type}</td>
                                <td style={{width:"10rem"}}>{this.getDepartmentName(item.medical_department_code)}</td>
                              </tr>
                            </>
                          );
                        })}
                      </>
                    ):(
                      <tr>
                        <td colSpan={'7'} style={{height:"60vh"}}>
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
              {this.state.isOpenTreatmentDoneModal && (
                <TreatDoneModal
                  closeModal={this.closeModal}
                  modal_data={this.state.modal_data}
                  from_page={'outhospital_delete'}
                  only_close_btn={this.state.only_close_btn}
                />
              )}
              {this.state.isOpenInspectionDoneModal && (
                <InspectionDoneModal
                  closeModal={this.closeModal}
                  modal_title={this.state.modal_title}
                  modal_data={this.state.modal_data}
                  modal_type={this.state.modal_type}
                  from_page={'outhospital_delete'}
                  only_close_btn={this.state.only_close_btn}
                />
              )}
              {this.state.isOpenRehabilyDoneModal && (
                <RehabilyOrderDoneModal
                  closeModal={this.closeModal}
                  modal_title={this.state.modal_title}
                  modal_data={this.state.modal_data}
                  modal_type={this.state.modal_type}
                  from_page={'outhospital_delete'}
                  only_close_btn={this.state.only_close_btn}
                />
              )}
              {this.state.isOpenOrderDoneModal && (
                <OrderDoneModal
                  closeModal={this.closeModal}
                  modal_title={this.state.modal_title}
                  modal_data={this.state.modal_data}
                  modal_type={this.state.modal_type}
                  from_page={'outhospital_delete'}
                  only_close_btn={this.state.only_close_btn}
                />
              )}
              {this.state.isOpenDoneModal && (
                <NotDoneListModal
                  patientId={this.state.system_patient_id}
                  closeModal={this.closeModal}
                  closeModalAndRefresh={this.closeModal}
                  modal_type={this.state.modal_type}
                  modal_title={this.state.modal_title}
                  modal_data={this.state.modal_data}
                  from_page={'outhospital_delete'}
                  only_close_btn={this.state.only_close_btn}
                />
              )}
              {this.state.isOpenexaminDoneModal && (
                <ExaminationDoneModal
                  patientId={this.props.patientId}
                  closeModal={this.closeModal}
                  modal_data={this.state.modal_data}
                  from_page={'outhospital_delete'}
                  only_close_btn={this.state.only_close_btn}
                />
              )}
              {this.state.isDoctorsOpen && (
                <SelectDoctorModal
                  closeDoctor={this.closeDoctorModal}
                  getDoctor={this.getDoctorModal}
                  selectDoctorFromModal={this.selectDoctorFromModal}
                  doctors={this.state.doctors}
                />
              )}
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.confirmCloseModal}>閉じる</Button>
            <Button className={this.state.checkList.length > 0 ? "red-btn" : "disable-btn"} onClick={this.handleDelete}>確定</Button>
          </Modal.Footer>
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
      </>
    );
  }
}

OutHospitalGroupDeleteModal.contextType = Context;
OutHospitalGroupDeleteModal.propTypes = {
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,
  closeModal: PropTypes.func,
  discharge_date: PropTypes.string,
  cache_index:PropTypes.number,
};

export default OutHospitalGroupDeleteModal;