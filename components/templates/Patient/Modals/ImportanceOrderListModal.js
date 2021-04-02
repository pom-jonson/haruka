import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import ja from "date-fns/locale/ja";
import {formatDateLine, formatJapanDateSlash} from "~/helpers/date";
import InspectionDoneModal from "~/components/templates/OrderList/InspectionDoneModal";
import TreatDoneModal from "~/components/templates/OrderList/TreatDoneModal";
import NotDoneListModal from "~/components/organisms/NotDoneListModal";
import OrderDoneModal from "~/components/templates/OrderList/OrderDoneModal";
import RehabilyOrderDoneModal from "~/components/templates/OrderList/RehabilyOrderDoneModal";
import Spinner from "react-bootstrap/Spinner";
import * as apiClient from "~/api/apiClient";
import Checkbox from "~/components/molecules/Checkbox";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Radiobox from "~/components/molecules/Radiobox";
import DatePicker, { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import Context from "~/helpers/configureStore";
import {getInspectionName, HOSPITALIZE_PRESCRIPTION_TYPE} from "~/helpers/constants";
import InspectionResultModal from "~/components/organisms/InspectionResultModal";
import AllergyDetailModal from "~/components/templates/Patient/Modals/Allergy/AllergyDetailModal";
import ExaminationDoneModal from "~/components/templates/OrderList/ExaminationDoneModal";
import DoneModal from "~/components/organisms/DoneModal";
import PrescriptionDoneModal from "~/components/organisms/PrescriptionDoneModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import OrderDoneRaidationModal from "~/components/templates/OrderList/OrderDoneRaidationModal";
import {EXAM_DONE_STATUS, EXAM_STATUS_OPTIONS} from "~/helpers/constants";
import HospitalApplicationOrderDetail
  from "~/components/templates/Patient/Modals/Hospital/HospitalApplicationOrderDetail";
import HospitalDoneDetail from "~/components/templates/Ward/HospitalDoneDetail";
import ChangeResponsibilityDetail from "~/components/templates/Meal/ChangeResponsibilityDetail";
import HospitalMoveDetail from "~/components/templates/Ward/HospitalMoveDetail";
import HospitalOutInDetail from "~/components/templates/Ward/HospitalOutInDetail";
import HospitalDischargeDetail from "~/components/templates/Ward/HospitalDischargeDetail";
import GuidanceNutritionRequestDoneModal from "~/components/templates/OrderList/GuidanceNutritionRequestDoneModal";
import MealDetail from "~/components/templates/Ward/MealDetail";
import HospitalDischargeGuidanceReportDetail
  from "~/components/templates/Patient/Medication/HospitalDischargeGuidanceReportDetail";
import DocumentDetail from "~/components/templates/Patient/Modals/Document/DocumentDetail";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`
  overflow-y: auto;
  height: 100%;
  .flex {
    display: flex;
  }
  .MyCheck{
    margin-left: 1rem;
    label{
      font-size: 1rem;
      margin-right: 1rem;
      line-height: 2rem;
    }
  }
  .title-area {
    margin-left: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .title {
    font-size: 30px;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
  .hBWNut {
    padding-top: 90px!important;
  }
  .login-info-area {
    background-color: white;
    width: 100%;
    table {
      font-size: 1rem;
      margin-bottom: 0;
      thead{
        margin-bottom: 0;
        display:table;
        width:100%;        
        tr{width: calc(100% - 17px);}
      }
      tbody{
        height: calc(80vh - 19rem);
        overflow-y: scroll;
        display:block;
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
        border-bottom: 1px solid #dee2e6;
        font-size: 1rem;
      }
      th {
        text-align: center;
        padding: 0.3rem;
        border-bottom: 1px solid #dee2e6;
        font-size: 1rem;
      }
    }
    .order-area {
      cursor: pointer;
    }
    .order-area:hover{
      background:lightblue!important;      
    }
    .no-result {
      padding: 10rem;
      text-align: center;
      span {
        padding: 10px;
        border: 2px solid #aaa;
      }
    }
    .check-area {
      label {margin:0;}
    }
  }
`;

const Header = styled.div`
  span{
    font-size: 16px;
  }
  button{
    float: right;
    margin-right: 16px;
    padding: 5px;
    font-weight: 100;
  }
`;

const Flex = styled.div`
    display: flex;
    align-items: center;
    padding: 0.5rem;
    width: 100%;
    .label-title {
      width: 8rem;
      text-align: right;
      font-size: 1rem;
      padding-right: 0.5rem;
      line-height: 2rem;
    }
    .pullbox-label {
        margin-bottom: 0;
        select {
          width: 10rem;
          font-size: 1rem;
          height: 2rem;
          line-height: 2rem;
        }
    }
    .include-no-date {
        padding-left: 0.5rem;
        label {
          font-size: 1rem;
          line-height: 2rem;
        }
    }
    .react-datepicker-wrapper input {width: 7rem;}
    .search-btn {
        background-color: rgb(255, 255, 255);
        min-width: auto;
        margin-left: 1rem;
        padding-top: 0;
        padding-bottom: 0;
        height: 2rem;
        span {font-size: 1rem;}
    }
`;

const SpinnerWrapper = styled.div`
    padding: 0;
`;


class ImportanceOrderListModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list_data:null,
      classific:[
        {id:0, value:"全て"},
        {id:1, value:'処方'},
        {id:2, value:'注射'},
        {id:3, value:'処置'},
        {id:4, value:'検査'},
        {id:5, value:'汎用オーダー'},
        {id:7, value:'放射線'},
        {id:9, value:'リハビリ'},
      ],
      classific_id:0,
      order_category:[
        {id:0, value:""},
      ],
      order_category_id:0,
      search_date:new Date(),
      select_date_type:0,
      no_date:0,
      alert_msg: "",
      isOpenInspectionDoneModal:false,
      isOpenTreatmentDoneModal:false,
      isOpenOrderDoneModal:false,
      isOpenPrescriptionModal: false,
      isOpenInjectionDoneModal: false,
      isOpenRehabilyDoneModal: false,
      inspectionModal:false,
      openAllergyDetaiModal:false,
      isOpenRadiationDoneModal:false,
      isOpenExamDoneModal:false,
      isOpenHospitalApplicationOrderDetail:false,
      isOpenHospitalDoneDetail:false,
      isOpenChangeResponsibilityDetail:false,
      isOpenHospitalMoveDetail:false,
      isOpenHospitalOutInDetail:false,
      isOpenHospitalDischargeDetail:false,
      isOpenGuidanceDoneModal:false,
      isOpenGuidanceNutritionRequestDoneModal:false,
      isOpenGuidanceMedicationRequestDoneModal:false,
      isOpenMealDetail:false,
      isOpenHospitalDischargeGuidanceReportDetail:false,
      isOpenDocumentDetail:false,
    };
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.department_names = {};
    departmentOptions.map(department=>{
      this.department_names[parseInt(department.id)] = department.value;
    });
  }

  async componentDidMount() {
    this.getSearchResult();
  }

  getSearchResult =async()=>{
    this.setState({list_data: null});
    let path = "/app/api/v2/order/get/importance_order_list";
    let post_data = {
      classific_id:this.state.classific_id,
      order_category_id:this.state.order_category_id,
      search_date:this.state.search_date !== '' ? formatDateLine(this.state.search_date) : '',
      no_date:this.state.no_date,
      select_date_type:this.state.select_date_type,
      patient_id: this.props.patientId
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if(res.length > 0){
          this.setState({
            list_data: res,
          });
        } else {
          this.setState({
            list_data: [],
          });
        }
      })
      .catch(() => {
      });
  }

  setClassific = e =>{
    this.setState({
      classific_id: parseInt(e.target.id),
      order_category_id:0,
      order_category:[{id:0, value:""},],
    }, ()=>{
      this.getOrderCategory();
    });
  }

  getOrderCategory = async() => {
    if(this.state.classific_id === 0) return;
    let order_category = [{id:0, value:"全て"},];
    let path = "/app/api/v2/master/addition/searchFunctionsByCategory";
    let post_data = {
      params:{is_enabled:1, function_category_id:this.state.classific_id}
    }

    await apiClient.post(path, post_data).then((res)=>{
      if(res.length > 0){
        res.map(item => {
          order_category.push({id:item.id, value:item.name == "検査オーダー" ? "検体検査" : item.name});
        })
      }
    })
    this.setState({order_category})
  }

  setOrderCategory =e=>{
    this.setState({order_category_id: parseInt(e.target.id)});
  }

  setDateType =(e)=>{
    let search_date = this.state.search_date;
    if(parseInt(e.target.value) === 1){
      search_date = "";
    } else {
      search_date = new Date();
    }
    this.setState({
      select_date_type:parseInt(e.target.value),
      search_date,
    })
  }

  setSearchDate =(value)=>{
    this.setState({
      search_date: value,
      select_date_type:0,
    });
  }

  getIncludeNoDate = (name, value) => {
    if(name === 'include'){
      this.setState({no_date:value});
    }
  };

  openDetailModal=(item)=>{
    if(item.category === '処方'){
      this.setState({
        modal_title: "処方",
        modal_type: "prescription",
        modal_data: item,
        isOpenPrescriptionModal: true
      });
    }
    if(item.category === '注射'){
      this.setState({
        modal_title: "注射",
        modal_type: "injection",
        modal_data: item,
        isOpenInjectionDoneModal: true
      });
    }
    if(item.category === '処置'){
      this.setState({
        isOpenTreatmentDoneModal: true,
        modal_data:item,
      });
    }
    if(item.category === '生理検査' || item.category === '内視鏡検査'){
      this.setState({
        isOpenInspectionDoneModal: true,
        modal_title:item.category,
        modal_type:item.category === '生理検査' ? 'inspection' : 'endoscope',
        modal_data:item,
      });
    }
    if(item.category === '放射線'){      
      this.setState({
        isOpenRadiationDoneModal: true,
        modal_title:item.category,
        modal_type:'radiation',
        modal_data:item,
      });
    }
    if(item.category === 'リハビリ'){
      this.setState({
        isOpenRehabilyDoneModal: true,
        modal_title:item.category,
        modal_type:'rehabily',
        modal_data:item,
      });
    }
    if(item.category === '汎用オーダー' || item.category === '管理・指導'){
      if(item.sub_category == "栄養指導依頼"){
        item.data = {};
        item.data.history = item.history;
        item.reserve_datetime = item.treat_date;
        this.setState({
          isOpenGuidanceNutritionRequestDoneModal: true,
          modal_data:item,
        });
      } else {
        let patientInfo = {
          receId:item['patient_number'],
          name:item['patient_name'],
        };
        let modal_data = item;
        modal_data.data = [];
        modal_data.data.done_order = modal_data.done_order;
        modal_data.data.order_data = modal_data.order_data;
        modal_data.data.is_enabled = modal_data.is_enabled;
        modal_data.data.history = modal_data.history;
        modal_data.data.medical_department_name = this.department_names[modal_data.order_data.order_data.department_id];

        let _state = {          
          modal_data,
          patientInfo,
        };

        if (item.sub_category == "服薬指導") {
          _state.isOpenGuidanceMedicationRequestDoneModal = true;
        } else {
          _state.isOpenGuidanceDoneModal = true;          
        }
        this.setState(_state);
      }
    }
    if(item.category === '検査' && (item.sub_category === 'オーダー' || item.sub_category === '細胞診検査' || item.sub_category === '病理検査' || item.sub_category === '細菌検査')){
      this.setState({
        isOpenExamDoneModal: true,
        modal_title:'検体検査',
        modal_type:'examination',
        modal_data:item,
      });
    }
    if(item.target_table === 'examination'){
      this.getExaminationByNumber(item.record_number);
    }
    if(item.target_table === 'hospital_description'){
      this.setState({
        openAllergyDetaiModal: true,
        modal_data:item,
      });
    }
    if(item.sub_category === "入院申込オーダ" || item.sub_category === "入院決定オーダ"){
      this.setState({
        isOpenHospitalApplicationOrderDetail: true,
        modal_data:item,
      });
    }
    if(item.sub_category === "入院実施"){
      this.setState({
        isOpenHospitalDoneDetail: true,
        modal_data:item,
      });
    }
    if(item.sub_category === "担当変更オーダ"){
      this.setState({
        isOpenChangeResponsibilityDetail: true,
        modal_data:item,
      });
    }
    if(item.sub_category === "転棟・転室実施"){
      this.setState({
        isOpenHospitalMoveDetail: true,
        modal_data:item,
      });
    }
    if(item.sub_category === "外泊実施" || item.sub_category === "帰院実施"){
      this.setState({
        isOpenHospitalOutInDetail: true,
        modal_data:item,
      });
    }
    if(item.sub_category === "退院許可" || item.sub_category === "退院決定" || item.sub_category === "退院実施"){
      this.setState({
        isOpenHospitalDischargeDetail: true,
        modal_data:item,
      });
    }
    if(item.sub_category === "食事オーダ"){
      this.setState({
        isOpenMealDetail: true,
        modal_data:item,
      });
    }
    if(item.sub_category === "退院時指導レポート"){
      this.setState({
        isOpenHospitalDischargeGuidanceReportDetail: true,
        modal_data:item,
      });
    }
    if(item.sub_category === "文書"){
      this.setState({
        isOpenDocumentDetail: true,
        modal_data:item,
      });
    }
  }

  getExaminationByNumber=async(number)=>{
    let path = "/app/api/v2/order/get/examination_by_number";
    let post_data = {number};
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          inspectionModal: true,
          modal_data:res,
        });
      })
      .catch(() => {
      });
  }

  closeModal =(_param=null)=>{
    this.setState({
      isOpenInspectionDoneModal: false,
      isOpenTreatmentDoneModal: false,
      isOpenOrderDoneModal: false,
      isOpenPrescriptionModal: false,
      isOpenInjectionDoneModal: false,
      isOpenDoneModal: false,
      inspectionModal: false,
      openAllergyDetaiModal: false,
      isOpenRadiationDoneModal:false,
      isOpenExamDoneModal: false,
      isOpenRehabilyDoneModal: false,
      isOpenHospitalApplicationOrderDetail: false,
      isOpenHospitalDoneDetail: false,
      isOpenChangeResponsibilityDetail: false,
      isOpenHospitalMoveDetail: false,
      isOpenHospitalOutInDetail: false,
      isOpenHospitalDischargeDetail: false,
      isOpenGuidanceDoneModal: false,
      isOpenGuidanceNutritionRequestDoneModal: false,
      isOpenGuidanceMedicationRequestDoneModal: false,
      isOpenMealDetail: false,
      isOpenHospitalDischargeGuidanceReportDetail: false,
      isOpenDocumentDetail: false,
      alert_msg: "",
    }, ()=>{
      if (_param !== "noRefresh") {
        this.getSearchResult();
      }
    });
  }

  getModalData = (_modal_data) => {    
    let ret = {};
    ret.target_number = _modal_data.record_number;
    ret.patient_id = _modal_data.system_patient_id;
    ret.updated_at = _modal_data.updated_at;
    ret.treatment_datetime = _modal_data.treat_date;
    ret.is_doctor_consented = _modal_data.is_doctor_consented;
    ret.input_staff_name = _modal_data.input_staff_name;
    ret.doctor_name = _modal_data.doctor_name;
    ret.data = _modal_data;
    return ret;
  }

  closeDoneModal = (_msg='') => {
    this.setState()
    let _state = {};
    _state.isOpenPrescriptionModal = false;
    _state.alert_msg = _msg == "prescription_done" ? "実施しました。" : "";
    _state.isOpenKarteModeModal = false;
    // YJ234 処方受付で、実施完了時に「実施しました」アラートがない
    // ・処方の実施も完了アラートを出すように。    
    this.setState(_state,()=>{
      if (_msg == "prescription_done") {
    this.getSearchResult();
  }
    });
  }

  closeInjection = () => {
    this.setState({
      isOpenInjectionDoneModal: false,
      alert_msg: "実施しました。"
    },()=>{
      this.getSearchResult();
    });
  }

  render() {
    let disable_status = true;
    if(this.state.classific_id == 4 || this.state.classific_id == 7){
      disable_status = false;
    }
    return (
      <>
        <Modal show={true} className="custom-modal-sm importance-order-list-modal first-view-modal">
          <Modal.Header><Modal.Title><Header>重要項目一覧</Header></Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                <Flex>
                  <div className = "select-group">
                    <SelectorWithLabel
                      options={this.state.classific}
                      title="機能分類"
                      getSelect={this.setClassific}
                      departmentEditCode={this.state.classific_id}
                    />
                  </div>
                  <div className = "select-group">
                    <SelectorWithLabel
                      options={this.state.order_category}
                      title="オーダー種類"
                      getSelect={this.setOrderCategory}
                      departmentEditCode={this.state.order_category_id}
                      isDisabled={disable_status}
                    />
                  </div>
                  <div>
                    <div className="MyCheck d-flex">
                      <Radiobox
                        label="日付指定"
                        value={0}
                        getUsage={this.setDateType.bind(this)}
                        checked={this.state.select_date_type === 0 ? true : false}
                        name={`date-set`}
                      />
                      <DatePicker
                        locale="ja"
                        selected={this.state.search_date}
                        onChange={this.setSearchDate.bind(this)}
                        dateFormat="yyyy/MM/dd"
                        placeholderText="年/月/日"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dayClassName = {date => setDateColorClassName(date)}
                      />
                    </div>
                    <div className="MyCheck">
                      <Radiobox
                        label="日未定のみ"
                        value={1}
                        getUsage={this.setDateType.bind(this)}
                        checked={this.state.select_date_type === 1 ? true : false}
                        name={`date-set`}
                      />
                    </div>
                  </div>
                  <div className={'include-no-date'}>
                    <Checkbox
                      label={'日未定を含む'}
                      getRadio={this.getIncludeNoDate.bind(this)}
                      value={this.state.no_date}
                      name={`include`}
                    />
                  </div>
                  <Button type="mono" className={'search-btn'} onClick={this.getSearchResult.bind(this)}>検索</Button>
                </Flex>
                <div className={'login-info-area'}>
                  <table className="table-scroll table table-bordered" id="code-table">
                    <thead>
                    <tr>
                      <th>種類</th>
                      <th style={{width:"10rem"}}>登録日付</th>
                      <th style={{width:"10rem"}}>予定日付</th>
                      <th style={{width:"7rem"}}>状態</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.list_data == null ? (
                      <tr>
                        <td colSpan={'4'}>
                          <div className='spinner_area no-result'>
                            <SpinnerWrapper>
                              <Spinner animation="border" variant="secondary" />
                            </SpinnerWrapper>
                          </div>
                        </td>
                      </tr>
                    ):(
                      <>
                        {this.state.list_data.length === 0 ? (
                          <tr><td colSpan={'4'}><div className="no-result"><span>条件に一致する結果は見つかりませんでした。</span></div></td></tr>
                        ) : (
                          this.state.list_data.map((item) => {
                            let done_status = '';
                            let order_title = item.category;
                            let schedule_date = "";
                            let karte_status_name = (item.karte_status == undefined || item.karte_status == null || item.karte_status == 1) ?
                              "外来・" : (item.karte_status == 3 ? "入院・" : "訪問診療・");
                            if(item.category === '処方'){
                              let prescription_category = item.order_data.is_internal_prescription == 0 ? "院外" : "院内";
                              if(item.karte_status == 3) prescription_category = HOSPITALIZE_PRESCRIPTION_TYPE[item.order_data.is_internal_prescription].value;
                              order_title = karte_status_name + prescription_category + '処方';
                              schedule_date = "詳細を参照";
                            }
                            if(item.category === '注射'){
                              order_title = karte_status_name + "注射";
                              schedule_date = (item.order_data != null && item.order_data.schedule_date != null
                                && item.order_data.schedule_date != undefined && item.order_data.schedule_date != "")
                                ? formatJapanDateSlash(item.order_data.schedule_date) : "";
                            }
                            if(item.category === '処置'){
                              order_title = item.karte_status == 3 ? "入院処置" : (item.karte_status === 2 ? "在宅処置" : "外来処置");
                              schedule_date = (item.treat_date == null || item.treat_date === '') ? "日未定" : formatJapanDateSlash(item.treat_date);
                            }
                            if(item.category === '検査' && (item.sub_category === 'オーダー' || item.sub_category === '細胞診検査' ||
                              item.sub_category === '病理検査' || item.sub_category === '細菌検査')){
                              let title = '検体検査';
                              if (item.sub_category == "細胞診検査") title = "細胞診検査";
                              else if (item.sub_category == "病理検査") title = "病理組織検査";
                              else if (item.sub_category == "細菌検査") title = "細菌・抗酸菌検査";
                              order_title = karte_status_name + title;
                              schedule_date = (item.order_data != null && item.order_data.order_data != null && item.order_data.order_data.collected_date != null
                                && item.order_data.order_data.collected_date != undefined && item.order_data.order_data.collected_date != "")
                                ? formatJapanDateSlash(item.order_data.order_data.collected_date + " " + item.order_data.order_data.collected_time) : "日未定";
                            }
                            if(item.category === '放射線'){
                              order_title = karte_status_name + '放射線 '+ ' ' + item.sub_category;
                              schedule_date = (item.treat_date == null || item.treat_date === '') ? "日未定" : formatJapanDateSlash(item.treat_date);
                            }
                            if(item.target_table === 'inspection_order'){
                              if(item.order_data != null && item.order_data.order_data.inspection_id !== undefined){
                                order_title = karte_status_name + getInspectionName(item.order_data.order_data.inspection_id);
                              } else {
                                order_title = karte_status_name + "生理";
                              }
                              schedule_date = (item.treat_date == null || item.treat_date === '') ? "日未定" : formatJapanDateSlash(item.treat_date);
                            }
                            if(item.category === "リハビリ") {
                              order_title = karte_status_name + item.category;
                              schedule_date = (item.order_data != null && item.order_data.order_data != null && item.order_data.order_data.done_want_date != null
                                && item.order_data.order_data.done_want_date != undefined && item.order_data.order_data.done_want_date != "")
                                ? formatJapanDateSlash(item.order_data.order_data.done_want_date) : "日未定";
                            }
                            if(item.category === '汎用オーダー' || item.category === '管理・指導'){
                              schedule_date = (item.treat_date == null || item.treat_date === '') ? "日未定" : formatJapanDateSlash(item.treat_date);
                              if(item.sub_category == "栄養指導依頼"){
                                order_title = karte_status_name + item.sub_category;
                              } else if(item.sub_category == "服薬指導") {
                                order_title = karte_status_name + item.sub_category;
                              } else {
                                order_title = karte_status_name + item.category;
                              }
                            }
                            if(item.is_doctor_consented !== 4){
                              if(item.sub_category === 'オーダー' || item.sub_category === '細胞診検査' ||
                                item.sub_category === '病理検査' || item.sub_category === '細菌検査'){
                                if(item.done_order === EXAM_DONE_STATUS.NOT_RECEPTION){
                                  done_status = EXAM_STATUS_OPTIONS.NOT_RECEPTION;
                                }
                                if(item.done_order ===  EXAM_DONE_STATUS.COLLECTION_WAIT){
                                  done_status = EXAM_STATUS_OPTIONS.COLLECTION_WAIT;
                                }
                                if(item.done_order === EXAM_DONE_STATUS.COLLECTION_DONE){
                                  done_status = EXAM_STATUS_OPTIONS.COLLECTION_DONE;
                                }
                                if(item.done_order === EXAM_DONE_STATUS.COMPLETE_DONE){
                                  done_status = EXAM_STATUS_OPTIONS.COMPLETE_DONE;
                                }
                                if(item.done_order === EXAM_DONE_STATUS.RECEPTION_DONE && item.order_data != null && item.order_data.order_data.exist_result != 1){
                                  done_status = EXAM_STATUS_OPTIONS.RECEPTION_DONE;
                                }
                                if(item.order_data != null && item.order_data.order_data.exist_result == 1){
                                  done_status = EXAM_STATUS_OPTIONS.RESULT_DONE;
                                }
                              } else {
                                if(item.done_order === 0 || item.done_order === 3){
                                  done_status = (item.category== '注射' || item.category== '処方' || item.category === '汎用オーダー' || item.category === '管理・指導') ? '未実施' : '未受付';
                                }
                                if(item.done_order === 2){
                                  done_status = item.target_table === 'inspection_order' ? "実施済み" : "受付済み";
                                }
                                if(item.done_order === 1){
                                  done_status = item.target_table === 'inspection_order' ? "受付済み" : "実施済み";
                                }
                              }
                            }
                            if(item.target_table == "hospital_description"){
                              order_title = karte_status_name + item.sub_category;
                              done_status = "";
                            }
                            if(item.target_table == "soap"){
                              order_title = item.sub_category == "初診・入院時ノート" ? "初診・入院時ノート" : "プログレスノート";
                              done_status = "";
                            }
                            if(item.target_table == "examination"){
                              order_title = karte_status_name + item.category + item.sub_category;
                              done_status = "";
                            }
                            if(item.category == "入院"){
                              done_status = "";
                              if(item.sub_category == "入院申込オーダ"){
                                schedule_date = formatJapanDateSlash(item.order_data.order_data.desired_hospitalization_date);
                                order_title = karte_status_name + "申込オーダー";
                              }
                              if(item.sub_category == "入院決定オーダ"){
                                schedule_date = formatJapanDateSlash(item.order_data.order_data.date_and_time_of_hospitalization);
                                order_title = karte_status_name + "決定オーダー";
                              }
                              if(item.sub_category == "入院実施"){
                                schedule_date = formatJapanDateSlash(item.order_data.order_data.treat_date);
                                order_title = karte_status_name + "入院実施";
                              }
                              if(item.sub_category == "担当変更オーダ"){
                                schedule_date = formatJapanDateSlash(item.order_data.order_data.moving_day);
                                order_title = karte_status_name + "担当変更オーダー";
                              }
                              if(item.sub_category == "食事オーダ"){
                                schedule_date = formatJapanDateSlash(item.order_data.order_data.start_date);
                                order_title = karte_status_name + "食事オーダー";
                              }
                              if(item.sub_category == "転棟・転室実施"){
                                schedule_date = formatJapanDateSlash(item.order_data.order_data.treat_date);
                                order_title = karte_status_name + "転棟・転室実施";
                              }
                              if(item.sub_category == "外泊実施" || item.sub_category == "帰院実施"){
                                schedule_date = formatJapanDateSlash(item.order_data.order_data.treat_date);
                                order_title = karte_status_name + item.sub_category;
                              }
                              if(item.sub_category == "退院許可"){
                                schedule_date = formatJapanDateSlash(item.order_data.order_data.discharge_date);
                                order_title = karte_status_name + "退院許可";
                              }
                              if(item.sub_category == "退院決定" || item.sub_category == "退院実施"){
                                schedule_date = formatJapanDateSlash(item.order_data.order_data.treat_date);
                                order_title = karte_status_name + item.sub_category;
                              }
                            }
                            if(item.sub_category == "退院時指導レポート" || item.sub_category == "文書"){
                              schedule_date = formatJapanDateSlash(item.treat_date);
                              order_title = karte_status_name + item.sub_category;
                            }
                            return (
                              <>
                                <tr className={'order-area'} onClick={this.openDetailModal.bind(this, item, order_title)}>
                                  <td>{order_title}</td>
                                  <td style={{width:"10rem"}}>{item.created_at != null ? formatJapanDateSlash(item.created_at) : ""}</td>
                                  <td style={{width:"10rem"}}>{schedule_date}</td>
                                  <td style={{width:"7rem"}}>{done_status}</td>
                                </tr>
                              </>
                            )
                          })
                        )}
                      </>
                    )}
                    </tbody>
                  </table>
                </div>
                {this.state.isOpenTreatmentDoneModal && (
                  <TreatDoneModal
                    closeModal={this.closeModal}
                    modal_data={this.state.modal_data}
                  />
                )}
                {this.state.isOpenInspectionDoneModal && (
                  <InspectionDoneModal
                    closeModal={this.closeModal}
                    modal_title={this.state.modal_title}
                    modal_data={this.state.modal_data}
                    modal_type={this.state.modal_type}
                    reception_or_done={"done"}
                    from_page={"important_order_list"}
                  />
                )}
                {this.state.isOpenRehabilyDoneModal && (
                  <RehabilyOrderDoneModal
                    closeModal={this.closeModal}
                    modal_title={this.state.modal_title}
                    modal_data={this.state.modal_data}
                    modal_type={this.state.modal_type}
                    reception_or_done={"done"}
                  />
                )}
                {this.state.isOpenOrderDoneModal && (
                  <OrderDoneModal
                    closeModal={this.closeModal}
                    modal_title={this.state.modal_title}
                    modal_data={this.state.modal_data}
                    modal_type={this.state.modal_type}
                    reception_or_done={"done"}
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
                  />
                )}
                {this.state.isOpenPrescriptionModal && (
                  <PrescriptionDoneModal
                    patientId={this.state.modal_data.system_patient_id}
                    closeModal={this.closeDoneModal}
                    modal_type={"prescription"}
                    modal_title={this.state.modal_title}
                    modal_data={this.getModalData(this.state.modal_data)}            
                    patientInfo = {{receId:this.state.modal_data.patient_number, name:this.state.modal_data.patient_name}}
                  />
                )}
                {this.state.inspectionModal && (
                  <InspectionResultModal
                    closeModal = {this.closeModal}
                    inspectionList = {this.state.modal_data}
                    patientId={this.props.patientId}
                    patient_name_kana={this.props.patientInfo.kana}
                  />
                )}
                {this.state.openAllergyDetaiModal && (
                  <AllergyDetailModal
                    modal_data={this.state.modal_data}
                    closeModal={this.closeModal}
                  />
                )}
                {this.state.isOpenRadiationDoneModal && (
                  <OrderDoneRaidationModal                  
                    closeModal={this.closeModal}
                    modal_title={this.state.modal_title}
                    modal_data={this.state.modal_data}
                    modal_type={this.state.modal_type}
                    reception_or_done={"done"}
                    from_source = {'done_list'}
                  />
                )}
                {this.state.isOpenExamDoneModal && (
                  <ExaminationDoneModal
                    closeModal={this.closeModal}
                    modal_data={this.state.modal_data}
                    from_page={'not_done_list'}
                    done_status={'done'}
                    patientId={this.state.system_patient_id}
                    doneInspection={this.closeModal}
                  />
                )}
                {this.state.isOpenInjectionDoneModal && (
                  <DoneModal
                    modal_title={"注射"}
                    modal_type={"injection"}
                    closeModal={()=>this.closeModal("noRefresh")}
                    patientId={this.state.modal_data.patient_id}
                    fromPage={"notDoneList"}
                    closeInjection={this.closeInjection}
                    modal_data={this.getModalData(this.state.modal_data)}            
                    patientInfo = {{receId:this.state.modal_data.patient_number, name:this.state.modal_data.patient_name}}
                  />
                )}
                {this.state.isOpenGuidanceDoneModal && (
                  <DoneModal
                    modal_title={"汎用オーダー"}
                    modal_type={"guidance"}
                    modal_data={this.state.modal_data}
                    closeModal={this.closeModal}
                    patientId={this.state.modal_data.patient_id}
                    patientInfo={this.state.patientInfo}
                    fromPage={'no-soap'}
                  />
                )}
                {this.state.isOpenGuidanceMedicationRequestDoneModal && (
                  <DoneModal
                    modal_title={"服薬指導"}
                    modal_type={"guidance_medication"}
                    modal_data={this.state.modal_data}
                    closeModal={this.closeModal}
                    patientId={this.state.modal_data.patient_id}
                    patientInfo={this.state.patientInfo}
                    fromPage={'no-soap'}
                  />
                )}
                {this.state.alert_msg !== "" && (
                  <SystemAlertModal
                    hideModal= {()=>this.closeModal("noRefresh")}
                    handleOk= {()=>this.closeModal("noRefresh")}
                    showMedicineContent= {this.state.alert_msg}
                  />
                )}
                {this.state.isOpenHospitalApplicationOrderDetail && (
                  <HospitalApplicationOrderDetail
                    closeModal={this.closeModal}
                    modal_data={this.state.modal_data}
                  />
                )}
                {this.state.isOpenHospitalDoneDetail && (
                  <HospitalDoneDetail
                    closeModal={this.closeModal}
                    modal_data={this.state.modal_data}
                  />
                )}
                {this.state.isOpenChangeResponsibilityDetail && (
                  <ChangeResponsibilityDetail
                    closeModal={this.closeModal}
                    modal_data={this.state.modal_data}
                  />
                )}
                {this.state.isOpenHospitalMoveDetail && (
                  <HospitalMoveDetail
                    closeModal={this.closeModal}
                    modal_data={this.state.modal_data}
                  />
                )}
                {this.state.isOpenHospitalOutInDetail && (
                  <HospitalOutInDetail
                    closeModal={this.closeModal}
                    modal_data={this.state.modal_data}
                  />
                )}
                {this.state.isOpenHospitalDischargeDetail && (
                  <HospitalDischargeDetail
                    closeModal={this.closeModal}
                    modal_data={this.state.modal_data}
                  />
                )}
                {this.state.isOpenGuidanceNutritionRequestDoneModal && (
                  <GuidanceNutritionRequestDoneModal
                    closeModal={this.closeModal}
                    modal_data={this.state.modal_data}
                    from_page={'important_order_list'}
                  />
                )}
                {this.state.isOpenMealDetail && (
                  <MealDetail
                    closeModal={this.closeModal}
                    modal_data={this.state.modal_data}
                  />
                )}
                {this.state.isOpenHospitalDischargeGuidanceReportDetail && (
                  <HospitalDischargeGuidanceReportDetail
                    closeModal={this.closeModal}
                    modal_data={this.state.modal_data}
                  />
                )}
                {this.state.isOpenDocumentDetail && (
                  <DocumentDetail
                    closeModal={this.closeModal}
                    modal_data={this.state.modal_data}
                  />
                )}
              </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
ImportanceOrderListModal.contextType = Context;
ImportanceOrderListModal.propTypes = {
  closeModal: PropTypes.func,
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,
};

export default ImportanceOrderListModal;
