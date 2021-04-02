import React, { Component } from "react";
import styled from "styled-components";
import enhance from "./@enhance";
import * as methods from "./SOAP/methods";
import PropTypes from "prop-types";
import LeftBox from "./SOAP/components/LeftBox";
import MiddleBox from "./SOAP/components/MiddleBox";
import RightBox from "./SOAP/components/RightBox";
import Context from "~/helpers/configureStore";
import SelectDoctorModal from "./components/SelectDoctorModal";
import SelectPatientSoapModal from "./components/SelectPatientSoapModal";
import EndExaminationNoRefreshModal from "../../organisms/EndExaminationNoRefreshModal";
import { SOAP_TREE_CATEGORY, TREE_FLAG, CACHE_LOCALNAMES, CACHE_SESSIONNAMES, KARTEMODE, openPacs } from "~/helpers/constants";
import {surface,error,secondary,disable} from "../../_nano/colors";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as karteApi from "~/helpers/cacheKarte-utils";
import { patientModalEvent } from "~/events/PatientModalEvent";
import auth from "~/api/auth";
import SelectModeModal from "~/components/templates/Patient/SelectModeModal"
import * as apiClient from "~/api/apiClient";
import PanelGroup from "./PanelGroup/PanelGroup";
import * as localApi from "~/helpers/cacheLocal-utils";
import * as patientApi from "~/helpers/cachePatient-utils";
import {formatDateLine} from "~/helpers/date";
import $ from "jquery";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import AlertNotDoneListModal from "~/components/templates/Patient/Modals/Soap/AlertNotDoneListModal";

const PrescriptionWrapper = styled.div`
  width: 100%;
  padding-top: 120px;
  display: flex;
  flex-flow: nowrap column;
  overflow: hidden;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 0.875rem;
  width: 100%;
  .soap-content{
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    width: calc(100% - 420px);
  }  
  .note-red{
    color: ${error};
  }
  .exam-order{
    margin-left: 75px;
    margin-right: 80px !important;
  }
  nav {
    padding: 4px 0;
    ul {
      padding-left: 0;
      margin-bottom: 8px;
      &:before {
        content: "";
        border-left: 1px solid #ccc;
        display: block;
        width: 0;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
      }
      .sel_open {
        background: #ddd;
      }
      ul {
        margin-left: 10px;
        position: relative;
        margin-bottom: 0px;
        li {
          padding: 0px 12px;
          &:before {
            content: "";
            border-top: 1px solid #ccc;
            display: block;
            width: 8px;
            height: 0;
            position: absolute;
            top: 10px;
            left: 0;
          }
          &:last-child:before {
            background: #fff;
            height: auto;
            top: 10px;
            bottom: 0;
          }
          ul {
            margin-bottom: 0px;
            li {
              padding: 0px 12px;
              ul {
                margin-bottom: 0px;
                li {
                  padding: 0px 12px;
                }
              }
            }
          }
        }
      }
      li {
        margin: 0;
        padding: 3px 12px;
        text-decoration: none;
        text-transform: uppercase;
        font-size: 0.8125‬rem;
        line-height: 20px;
        position: relative;
      }
    }
    li {
      cursor: pointer;
      list-style-type: none;
    }
  }
  .mark {
    color: ${surface};
    font-size: 0.75rem;
    display: inline-block;
    padding: 2px;
    line-height: 1;
    &.red {
      background-color: ${error};
    }
    &.blue {
      background-color: ${secondary};
    }
  }
  .data-item {
    padding: 4px 32px 4px 8px;
    position: relative;
    cursor: pointer;
    &.open {
      .angle {
        transform: rotate(180deg);
      }
    }
    &.changed {
      background: #eee;
    }
    &.updating {
      background: #ccc;
    }
  }
  p {
    margin: 0;
  }
  .flex {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
  .entry-name {
    display: inline-block;
    width: 35%;
  }
  .soap-data, .soap-data-item {
    width: 100%;
    .table-row:nth-child(2n) {
      background: #f7f7f7;
    }
    tr {
      flex-wrap: nowrap;
    }
    th,
    td {
      border: 1px solid ${disable};
      padding: 2px;
    }
    th {
      background: #e6e6e6;
      text-align: center;
      width: 3.125rem;
    }
    td {
      flex: 1;
    }
    input {
      width: 100%;
    }
  }
  .style-hide{
    display: none;
  }
  .detail-deleted {
      color: #ff0000;
      textarea {
        color: #ff0000;
      }
  }
  .soap-data-item {
    display: none;
    &.open {
      display: inline-table;
    }
    textarea {
      border: 0px;
      resize: none;
    }
    &.changed {
      background: #eee;
      textarea {
        background: #eee;
      }
    }
    &.doned {
      color: #0000ff;
    }
    &.deleted {
      color: #ff0000;
      textarea {
        color: #ff0000;
      }
    }
  }
  .data-input{
    display: none;
    &.open{
      display: block;
    }
  }
  .not-consented {
    color: ${error};
  }
  .btn {
    background-color: ${secondary};
    border: none;
    border-radius: 4px;
    box-sizing: border-box;
    color: ${surface};
    display: block;
    font-size: 0.875rem;
    text-align: center;
    margin-left: auto;
    padding: 2px 4px;
    line-height: 1;
  }  
  #soapTreeView li{
    cursor: default;
  }
  #soapTreeView li span{
    cursor: pointer;
  }
`;

@enhance
class SOAP extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    this.firstCount = 0;
    this.state ={
      isLoadData: false,
      confirm_msg_act: "",
      confirm_msg_index: 0,
      confirm_msg_type: "",
      other_value: null,
      showModal: false,
      isOpenDoctorSoapModal: false,
      bOpenCurrentSoap:true,
      bOpenAllSoap: false,
      bOpenAllExecuteOrder: false,
      bOpenGroupExamination: false,
      bOpenCurrentExamination: false,
      bOpenGlobalExamination: false,
      bOpenAllOrder: false,
      bOpenAllExamination: false,
      bOpenAllInspection: false,
      bOpenAllTreatment: false,
      bOpenAllRadiation: false,
      bOpenAllSoapTag: false,
      bOpenAllRehabily: false,
      bOpenAllProgress: false,
      bOpenSearchCondition: false,
      bOpenCurrentSoapLatest:true,
      bOpenAllSoapLatest: true,
      bOpenAllExecuteOrderLatest: true,
      bOpenAllOrderLatest: true,
      bOpenCurrentExaminationLatest: true,
      bOpenGlobalExaminationLatest: true,
      bOpenAllExaminationLatest: true,
      bOpenAllInspectionLatest: true,
      bOpenAllTreatmentLatest: true,
      bOpenAllRehabilyLatest: true,
      bOpenAllRadiationLatest: true,
      bOpenAllSoapTagLatest: true,
      bOpenAllProgressLatest: true,
      categoryType: -1,
      selYear:-1,
      selMonth:-1,
      selDay:-1,
      activeOperation: 'soap',
      show_list_condition:{condition:'', date:''},
      patientInfo: {}, // getPatientInfo
      soapList: [],   // getKarteTree
      soapTrees: [],  // getKarteTree
      soapOriginalList: [],
      usageData: [],
      isForUpdate: false,
      next_reservation_visit_date:undefined,
      alert_messages: '',
    };
    this.m_karte_status_code = -1;
    this.m_department_code = -1;
    this.middleRef_call_flag = 0;
    this.middleRef = React.createRef();
    this.rightRef = React.createRef();
    this.alertModalRef = React.createRef();
    this.autoLogoutModalShow = false;
    this.changeState = false;
    this.changeProps = false;
    this.leftBoxRef = React.createRef();
    this.selected_date=undefined;
    this.font_props = 1;
    this.changeSoapListFlag = false;
    this.doctors_data = null;
    this.alertModalShow = false;
    localApi.setValue("view_karte_calendar", "none");
    this.EndExaminationNoRefreshModalRef = React.createRef();
  }

  async UNSAFE_componentWillMount () {
    await this.getPatientInfor();
    localApi.setValue("get_karte_holiday", 0);
    localApi.remove(CACHE_LOCALNAMES.KARTE_HOLIDAYS);
  }

  getHolidays=async()=>{
    let cur_date = new Date();
    let middle_year = cur_date.getFullYear();
    let middle_month = cur_date.getMonth() + 1;
    let left_month = middle_month - 1;
    let left_year = middle_year;
    if(middle_month == 1){
      left_month = 12;
      left_year = middle_year - 1;
    }
    let right_month = middle_month + 1;
    let right_year = middle_year;
    if(middle_month == 12){
      right_month = 1;
      right_year = middle_year+1;
    }
    let from_date = formatDateLine(new Date(left_year, left_month - 1, 1));
    let end_date = formatDateLine(new Date(right_year, right_month, 0));
    let path = "/app/api/v2/dial/schedule/get_holidays";
    let post_data = {
      start_date: from_date,
      end_date:end_date,
    };
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        let holidays = {};
        holidays[middle_year+'-'+middle_month] = [];
        if(Object.keys(res).length > 0){
          holidays[middle_year+'-'+middle_month] = Object.keys(res);
        }
        localApi.setObject(CACHE_LOCALNAMES.KARTE_HOLIDAYS, holidays);
        localApi.setValue("get_karte_holiday", 1);
      })
      .catch(() => {
      });
  }

  async componentDidMount () {
    await this.getHolidays();
    let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
    if (init_status != null && init_status != undefined && init_status.doctors_list != undefined && init_status.doctors_list != null) {
      this.doctors_data = init_status.doctors_list;
    }
    //-------------------HARUKA--------------------------//
    if (this.context.currentSystem == "haruka") {
      // モーダル表示
      let menu_item = localApi.getObject("select_menu_info");
      if (menu_item != undefined && menu_item != null && menu_item.has_modal != null && menu_item.has_modal == 1 && this.context.$getKarteMode(this.props.match.params.id)  != KARTEMODE.READ) {

        // ■YJ97 死亡状態に関する修正
        let isDeathPatient = false;
        // check 死亡状態        
        if (this.checkDeathPatient("modal", menu_item.ele.url)) {          
          this.setState({alertMessage: "death"});
          isDeathPatient = true;          
        }
        if ((menu_item.ele.url == "physiological" || menu_item.ele.url == "endoscope") && !isDeathPatient) {
          this.emitPatientModalEvent("clickOpenPhysiologicalPopup", menu_item);
        }
        if (menu_item.ele.url == "openExamination" && !isDeathPatient) {
          this.emitPatientModalEvent("clickOpenExaminationPopup", menu_item);
        }
        if (menu_item.ele.url == "outpatient" && !isDeathPatient) {
          this.emitPatientModalEvent("clickOpenOutpatientPopup", menu_item);
        }
        if (menu_item.ele.url == "instruction_book") {
          this.emitPatientModalEvent("clickOpenInstructionBookPopup", menu_item);
        }
        if (menu_item.ele.url == "move_meal_calendar") {
          this.emitPatientModalEvent("clickOpenMoveMealCalendarPopup", menu_item);
        }
        if (menu_item.ele.url == "batch_do_prescription_list") {
          this.emitPatientModalEvent("clickOpenBatchDoPrescriptionListPopup", menu_item);
        }
        if (menu_item.ele.url == "nurse_plan") {
          this.emitPatientModalEvent("clickOpenNursePlanPopup", menu_item);
        }
        if (menu_item.ele.url == "nurse_plan_reference") {
          this.emitPatientModalEvent("clickOpenNursePlanReferencePopup", menu_item);
        }
        if (menu_item.ele.url == "nurse_instruction") {
          this.emitPatientModalEvent("clickNurseInstructionPopup", menu_item);
        }
        if (menu_item.ele.url == "incharge_sheet_list") {
          this.emitPatientModalEvent("clickInchargeSheetPopup", menu_item);
        }
        if (menu_item.ele.url == "progress_chart") {
          this.emitPatientModalEvent("clickProgressChartPopup", menu_item);
        }
        if (menu_item.ele.url == "nurse_profile") {
          this.emitPatientModalEvent("clickNurseProfilePopup", menu_item);
        }
        if (menu_item.ele.url == "visit_nurse_summary") {
          this.emitPatientModalEvent("clickVisitNurseSummaryPopup", menu_item);
        }
        if (menu_item.ele.url == "out_hospital_group_delete") {
          this.emitPatientModalEvent("clickOpenOutHospitalGroupDeletePopup", menu_item);
        }
        if (menu_item.ele.url == "instruction_book_list") {
          this.emitPatientModalEvent("clickOpenInstructionBookListPopup", menu_item);
        }
        if (menu_item.ele.url == "stop_prescription") {
          this.emitPatientModalEvent("clickOpenStopPrescriptionPopup", menu_item);
        }
        if (menu_item.ele.url == "account_hospital_order") {
          this.emitPatientModalEvent("clickOpenAccountHospitalOrderPopup", menu_item);
        }
        if (menu_item.ele.url == "allergy") {
          this.emitPatientModalEvent("clickOpenAllergyPopup", menu_item);
        }
        if (menu_item.ele.url == "guidance" && !isDeathPatient) {
          this.emitPatientModalEvent("clickOpenGuidancePopup", menu_item);
        }
        if (menu_item.ele.url == "change_responsibility" && !isDeathPatient) {
          this.emitPatientModalEvent("clickOpenChangeResponsibilityPopup", menu_item);
        }
        if (menu_item.ele.url == "account_order") {
          this.emitPatientModalEvent("clickOpenAccountOrderPopup", menu_item);
        }
        if (menu_item.ele.url == "visit_treatment_group") {
          this.emitPatientModalEvent("clickOpenVisitTreatmentGroupPopup", menu_item);
        }
        if (menu_item.ele.url == "rehabilitation" && !isDeathPatient) {
          this.emitPatientModalEvent("clickOpenRehabilyPopup", menu_item);
        }
        if (menu_item.ele.url == "simple_order") {
          this.emitPatientModalEvent("clickOpenSimpleOrderPopup", menu_item);
        }
        if (menu_item.ele.url == "spirit") {
          this.emitPatientModalEvent("clickOpenSpiritPopup", menu_item);
        }
        if (menu_item.ele.url == "radiation" && !isDeathPatient) {
          this.emitPatientModalEvent("clickOpenRadiationPopup", menu_item);
        }
        if (menu_item.ele.url == "diseaseName") {
          this.emitPatientModalEvent("clickOpenPatientDiseaseNamePopup", menu_item);
        }
        if (menu_item.ele.url == "home_treatment" && !isDeathPatient) {
          this.emitPatientModalEvent("clickOpenHomeTreatmentPopup", menu_item);
        }
        if (menu_item.ele.url == "hospital_treatment" && !isDeathPatient) {
          this.emitPatientModalEvent("clickOpenHospitalTreatmentPopup", menu_item);
        }
        if (menu_item.ele.url == "set_create") {
          this.emitPatientModalEvent("clickOpenSetCreatePopup", menu_item);
        }
        if (menu_item.ele.url == "set_register") {
          this.emitPatientModalEvent("clickOpenSetRegisterPopup", menu_item);
        }
        if (menu_item.ele.url == "set_deployment") {
          this.emitPatientModalEvent("clickOpenSetDeploymentPopup", menu_item);
        }
        if (menu_item.ele.url == "importance_order_list") {
          this.emitPatientModalEvent("clickOpenImportanceOrderListPopup", menu_item);
        }
        if (menu_item.ele.url == "period_order_list") {
          this.emitPatientModalEvent("clickOpenPeriodOrderListPopup", menu_item);
        }
        if (menu_item.ele.url === "print/haruka/medical_info_doc") {
          this.emitPatientModalEvent("clickOpenMedicalInfoPopup", menu_item);
        }
        if (menu_item.ele.url === "print/haruka/karte") {
          this.emitPatientModalEvent("clickOpenKartePrintPopup", menu_item);
        }
        if (menu_item.ele.url == "pills") {
          this.emitPatientModalEvent("clickOpenPillsPopup", menu_item);
        }
        if (menu_item.ele.url == "symptomDetail") {
          this.emitPatientModalEvent("clickOpenSymptomDetail", menu_item);
        }
        //指導料マスタメンテナンス
        if (menu_item.ele.url == "guidance_fee_master") {
          this.emitPatientModalEvent("clickOpenGuidanceFeeMaster", menu_item);
        }
        if (menu_item.ele.url == "hospital_application_order" && !isDeathPatient) {
          this.emitPatientModalEvent("clickOpenHospitalApplicationOrder", menu_item);
        }
        if (menu_item.ele.url == "barcode_mount_print") {
          this.emitPatientModalEvent("clickOpenBarcodeMountPrint", menu_item);
        }
        if (menu_item.ele.url == "discharge_permit_order" && !isDeathPatient) {
          this.emitPatientModalEvent("clickOpenDischargePermitOrder", menu_item);
        }
        if (menu_item.ele.url == "discharge_permit_order" && !isDeathPatient) {
          this.emitPatientModalEvent("clickOpenDischargePermitOrder", menu_item);
        }
        if (menu_item.ele.url == "discharge_decision") {
          this.emitPatientModalEvent("clickOpenDischargeDecisionOrder", menu_item);
        }
        if (menu_item.ele.url == "discharge_done") {
          this.emitPatientModalEvent("clickOpenDischargeDoneOrder", menu_item);
        }
        if (menu_item.ele.url == "death_register" && !isDeathPatient) {
          this.emitPatientModalEvent("clickOpenDeathRegister", menu_item);
        }
        if (menu_item.ele.url == "hospital_done" && !isDeathPatient) {
          this.emitPatientModalEvent("clickOpenHospitalDoneOrder", menu_item);
        }
        if (menu_item.ele.url == "instruction_book_calendar" && !isDeathPatient) {
          this.emitPatientModalEvent("clickOpenInstructionBookCalendar", menu_item);
        }
        if (menu_item.ele.url == "hospital_disease") {
          this.emitPatientModalEvent("clickOpenHospitalDisease", menu_item);
        }
        if (menu_item.ele.url == "medicine_guidance") {
          this.emitPatientModalEvent("clickOpenMedicineGuidance", menu_item);
        }
        if (menu_item.ele.url == "nutrition_guidance") {
          this.emitPatientModalEvent("clickOpenNutritionGuidance", menu_item);
        }
        if (menu_item.ele.url == "soap_focus") {
          this.emitPatientModalEvent("clickOpenSoapFocus", menu_item);
        }
        if (menu_item.ele.url == "bacillus_inspection") {
          this.emitPatientModalEvent("clickBacillusInspection", menu_item);
        }
        if (menu_item.ele.url == "potion_report") {
          this.emitPatientModalEvent("clickOpenPotionReportPopup", menu_item);
        }
        if (menu_item.ele.url == "hospital_prescription") {
          this.emitPatientModalEvent("clickOpenHospitalPrescriptionPopup", menu_item);
        }
        if (menu_item.ele.url == "pacs") {
          let patientInfo = karteApi.getPatient(this.props.match.params.id);
          if(patientInfo == undefined || patientInfo == null) return;
          // YJ34 PACS機能の修正
          patientApi.setVal(this.props.match.params.id, CACHE_LOCALNAMES.PAC_STATUS, JSON.stringify("on"));
          openPacs(patientInfo.receId, "open");
        }
        menu_item.has_modal = 0;
      }
    }
    //--------------------------------------------//
    let patient_id = this.props.match.params.id;
    if (patient_id == 0){
      setTimeout(()=>{
        this.setState({selectPatient: true});
      }, 500);
      return;
    }

    // YJ604 カルテ表示中にブラウザが閉じたりした場合の復元の修正
    let input_serial_number = null;    
    input_serial_number = this.getInputSerialNumber("prescription");
    if (input_serial_number != null) {
      // set active serial key      
      karteApi.setSubVal(this.props.match.params.id, CACHE_LOCALNAMES.ACTIVE_KEY, "prescription", input_serial_number);
      this.goToDropPage(`/patients/${this.props.match.params.id}/prescription`);
      return;
    }
    input_serial_number = this.getInputSerialNumber("injection");
    if (input_serial_number != null) {
      // set active serial key
      karteApi.setSubVal(this.props.match.params.id, CACHE_LOCALNAMES.ACTIVE_KEY, "injection", input_serial_number);
      this.goToDropPage(`/patients/${this.props.match.params.id}/injection`);
      return;
    }
    
    // middlebox scroll
    karteApi.setVal(this.props.match.params.id, CACHE_LOCALNAMES.SOAP_PAGE_NUMBER, 0);
    // no soap page permission go to prescription page
    this.m_karte_status_code = this.context.karte_status.code;
    this.m_department_code = this.context.department.code;
    this.setTimeOutFunc();
  }

  getInputSerialNumber = (_type=null) => {
    let result = null;
    if (_type == null) return result;

    if (_type == "prescription") {
      let cacheState = karteApi.getVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.PRESCRIPTION_EDIT);       
      if (cacheState != undefined && cacheState != null && Object.keys(cacheState).length > 0) {
        Object.keys(cacheState).map(key=>{
          let cache_data = cacheState[key][0];
          if (cache_data != undefined && 
            cache_data != null && 
            cache_data.temp_saved != undefined && 
            cache_data.temp_saved != null && 
            cache_data.temp_saved == 0) {
            result = key;
          }
        });      
      }
    } else if(_type == "injection") {
      let cacheInjectionState = karteApi.getVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.INJECTION_EDIT);
      if (cacheInjectionState != undefined && cacheInjectionState != null && Object.keys(cacheInjectionState).length > 0) {
        Object.keys(cacheInjectionState).map(key=>{
          let cache_data = cacheInjectionState[key][0];
          if (cache_data != undefined && 
            cache_data != null && 
            cache_data.temp_saved != undefined && 
            cache_data.temp_saved != null && 
            cache_data.temp_saved == 0) {
            result = key;
          }
        });      
      }
    }

    return result;
  }

  setTimeOutFunc = async() => {
    let isCallFirstKarteData = localApi.getValue('isCallFirstKarteData');
    let state_data = {};
    if(isCallFirstKarteData == 1){
      let first_karte_data = localApi.getObject(CACHE_LOCALNAMES.FIRST_KARTE_DATA);
      if(first_karte_data === undefined || first_karte_data == null || (first_karte_data !== undefined && first_karte_data != null && first_karte_data[this.props.match.params.id] === undefined)){
        this.firstCount++;
        if(this.firstCount <=30) {
          setTimeout(()=>{
            this.setTimeOutFunc()
          }, 200);
          return;
        }
      }
      if(first_karte_data !== undefined && first_karte_data != null && first_karte_data[this.props.match.params.id] !== undefined){
        let karte_data = first_karte_data[this.props.match.params.id];
        if(karte_data['exist_not_done_order'] != undefined && karte_data['exist_not_done_order'] != ''){
          this.alertModalRef.current.callVisible(true);
          this.alertModalShow = true;          
        }
      }
    }
    localApi.remove('isCallFirstKarteData');
    // 
    await this.getCurrentKarteTree({
      patient_id: this.props.match.params.id,
      medical_department_code: this.context.department.code,
      // karte_status: this.context.karte_status.code
    }, false);
    if(this.selected_date !== undefined){
      await this.changeSoapList(1, 0, 0, 0, -1);
    }
    let persistState = karteApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.SOAP_EDIT);
    if (persistState !== undefined && persistState !== null) {
      state_data['soapData'] = persistState.data;
      state_data['isForUpdate'] = persistState.isForUpdate;
      state_data['updateIndex'] = persistState.updateIndex;
      state_data['isForSave'] = persistState.isForSave;
    }
  
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    var path = window.location.href;
    if (path.includes("exam=1")) {
      this.emitPatientModalEvent("clickOpenExaminationPopup", "1");
    }
    state_data['patientInfo'] = karteApi.getPatient(this.props.match.params.id);
    state_data['isLoaded'] = true;
    this.setState(state_data);
    this.getAllKarteTree({
      patient_id: this.props.match.params.id,
      medical_department_code: this.context.department.code,
      // karte_status: this.context.karte_status.code
    }, false);
    this.getPresetDoPrescription(this.props.match.params.id, this.context.selectedDoctor.code);
    //覧モードの際、登録や編集等が行われていないか定期的にチェックして更新するように
    if(this.context.$getKarteMode(this.props.match.params.id) === KARTEMODE.READ){
      this.karteInterval = setInterval(async()=>{
        this.checkKarteData();
      }, 5*60*1000)
    }
    auth.refreshAuth(location.pathname+location.hash);
  };

  shouldComponentUpdate(nextprops, nextstate) {
    // karte close modal is open return true
    if(this.getAllKarteData){
      let selected_date_key = null;
      let soapTrees = nextstate.soapTrees;
      let soapList = nextstate.soapList;
      if(this.selected_date !== undefined){
        selected_date_key = this.getselectedtDate(soapTrees.current_soap, this.selected_date);
        soapList = this.setSoapListBydate(soapTrees, selected_date_key, nextstate.allDateList);
        soapTrees.current_soap = this.setSoapTreesBydate(soapTrees, selected_date_key);
      }
      this.leftBoxRef.current.setAllKarteData(soapTrees, nextstate.allDateList, nextstate.allTags, nextstate.search_condition_number, selected_date_key);
      this.middleRef.current.setAllKarteData(soapTrees, nextstate.allDateList, nextstate.allTags, soapList);
      this.rightRef.current.setAllKarteData(soapList);
      this.getAllKarteData = false;
      this.selected_date = undefined;
      return false;
    }
    if(this.changeSoapListFlag){
      this.changeSoapListFlag = false;
      return false;
    }
    if(this.autoLogoutModalShow != this.context.autoLogoutModalShow){
      this.autoLogoutModalShow = this.context.autoLogoutModalShow;
      return false;
    }

    // open modal refresh
    if (this.no_refresh == 1) { // open EndExaminationNoRefreshModal
      this.no_refresh = null;
      // this.EndExaminationNoRefreshModalRef.current.callVisible(true);
      this.EndExaminationNoRefreshModalRef.current.initStatus("show");
      return false;
    } else if(this.no_refresh == 2) { // close EndExaminationNoRefreshModal
      this.EndExaminationNoRefreshModalRef.current.callVisible(false);
      return false;
    } else if(this.no_refresh == 3) { // close karte page
      return false;
    }

    this.autoLogoutModalShow = this.context.autoLogoutModalShow;
    this.changeState = JSON.stringify(this.state) != JSON.stringify(nextstate);
    this.changeProps = JSON.stringify(this.props) != JSON.stringify(nextprops);
    if((this.changeState == false) && (this.changeProps == false)){
      return false;
    } else {
      // if(this.changeState){
      //   let state_data = this.state;
      //   let nextstate_data = nextstate;
      //   Object.keys(state_data).map(key=>{
      //     if(nextstate_data[key] !== undefined){
      //       if(state_data[key] != nextstate_data[key]){
      //         console.log('soap-state_data-'+key+'-'+state_data[key]);
      //         console.log('soap-nextstate_data-'+key+'-'+nextstate_data[key]);
      //       }
      //     } else {
      //       console.log('soap-state_data-'+key+'-'+state_data[key]);
      //     }
      //   });
      //   Object.keys(nextstate_data).map(key=>{
      //     if(state_data[key] !== undefined){
      //       if(state_data[key] != nextstate_data[key]){
      //         console.log('soap-state_data-'+key+'-'+state_data[key]);
      //         console.log('soap-nextstate_data-'+key+'-'+nextstate_data[key]);
      //       }
      //     } else {
      //       console.log('soap-nextstate_data-'+key+'-'+nextstate_data[key]);
      //     }
      //   });
      // }
      // if(this.changeProps){
      //   console.log('soap-JSON.stringify(this.props)', JSON.stringify(this.props));
      //   console.log('soap-JSON.stringify(this.props)', JSON.stringify(nextprops));
      // }
      return true;
    }
  }
  
  componentWillUnmount (){
    this.middleRef = null;
    this.rightRef = null;
    this.alertModalRef = null;
    this.leftBoxRef = null;
    this.doctors_data = null;
    clearInterval(this.karteInterval);
    this.setState({
      patientInfo: {}, // getPatientInfo
      soapList: [],   // getKarteTree
      soapTrees: [],  // getKarteTree
      soapOriginalList: [],
      usageData: []
    })
    var panelGroup = document.getElementsByClassName('container')[0];
    this.purge(panelGroup);
  }

  // ex) from_mode:"middle:中央カラム", "rigthbox:右カラム", "menu"
  emitPatientModalEvent = (key, param1, param2, isExistCache=true, from_mode=null) => {
    if (key == "edit_modal") {
      let param = {
        key: param1,
        stampKey: param2,
        isExistCache,
        from_mode,
      };
      patientModalEvent.emit("edit_modal", param);
    } else {
      patientModalEvent.emit(key, param1);
    }
  }

  closeModal = () => {
    // this.setState({ modalVisible: false, isSending: false});
    this.no_refresh = 2;
    this.setState({
      modalVisible: false
    });
    this.EndExaminationNoRefreshModalRef.current.callVisible(false);    
    // this.EndExaminationNoRefreshModalRef.current.initStatus("hide");    
  }

  cancelExamination = (url) => this.props.history.replace(url);

  PACSOn = () => this.setState({ pacsOn: true });

  PACSOff = () => this.setState({ pacsOn: false });

  getDoctor = e => {
    let department_name = "その他";
    this.doctors_data.map(doctor => {
      if (doctor.doctor_code === parseInt(e.target.id)) {
        if (doctor.diagnosis_department_name !== "") {
          department_name = doctor.diagnosis_department_name;
        }
      }
    });
    this.context.$updateDoctor(e.target.id, e.target.getAttribute("label"), department_name);
    if(this.state.cur_url === '/last_prescription_soap'){ //前回処方
      let systemPatientId = this.state.cur_patient_id;
      let url_path = 'soap';
      let his = this.props.history;
      this.setState({
        isOpenDoctorSoapModal: false,
        cur_url:'',
      });
      let department_code = this.context.department.code == 0 ? 1 : this.context.department.code;
      this.getLastPrescription(systemPatientId, department_code, this.state.karte_status_code, null, null, "from_soap").then(function(value){
        if(value == true) {
          his.replace(`/patients/${systemPatientId}/${url_path}`);
        } else if(value.res == "ok"){
          /*@cc_on _win = window; eval ( 'var window = _win') @*/
          window.localStorage.setItem("soap_insert_drop_number", value.prescription.target_number);
          his.replace(`/patients/${systemPatientId}/prescription`);
        }
      });
      return;
    }
    if(this.state.cur_url === '/medical_record_order'){ //診察済記録オーダ
      let url_path = 'soap';
      this.setState({
        isOpenDoctorSoapModal: false,
        cur_url:'',
      });
      let systemPatientId = this.state.cur_patient_id;
      this.createMedicalRecordOrder(systemPatientId, e.target.id, e.target.getAttribute("label"));
      this.props.history.replace(`/patients/${systemPatientId}/${url_path}`);
      return;
    }
    this.setState({
      isOpenDoctorSoapModal: false,
    });
    if (this.middleRef_call_flag == 0) return;

    if (this.state.confirm_msg_type == "middlebox_right_click") {
      // 医師選択モーダルが閉じるの場合、状態変数の同期化関連で500ms後に各機能の編集や削除関数を再度アクセスする。
      this.excuteMiddleConfirmMsg();
    } else if(this.state.confirm_msg_type == "middlebox_do") {
      // SOAP画面の中央カラムのDO処理
      this.excuteRightConfirmMsg();
    }
  }

  excuteMiddleConfirmMsg = () => {
    setTimeout(()=>{
      this.middleRef.current.contextMenuAction(this.state.confirm_msg_act, this.state.confirm_msg_index, 1, this.state.other_value);
      this.middleRef_call_flag = 0;
    }, 700);
  }

  excuteRightConfirmMsg = () => {
    setTimeout(()=>{
      this.rightRef.current.dropSoapEvent(this.state.confirm_msg_index);
      this.middleRef_call_flag = 0;
    }, 700);
  }

  closeDoctorModal = () => {
    this.setState({
      isOpenDoctorSoapModal: false
    });
    this.middleRef_call_flag = 0;
  }

  updateSoap = (soap, index, department_code=null, department_name=null) => {
    let actionFlag = false;
    if(this.context.$canDoAction(this.context.FEATURES.SOAP, this.context.AUTHS.EDIT) || this.context.$canDoAction(this.context.FEATURES.SOAP, this.context.AUTHS.EDIT_PROXY)){ // edit
      actionFlag = true;
    }
    if(!actionFlag){
      /*@cc_on _win = window; eval ( 'var window = _win') @*/
      window.sessionStorage.setItem("alert_messages", "権限がありません。");
      return;
    }
    let userInfo = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.HARUKA));
    const presDataStr = {
      user_number: userInfo.user_number,
      system_patient_id: this.props.match.params.id,
      data: soap,
      isForUpdate: true,
      updateIndex: index,
      isForSave: true
    };
    if(department_code != null && department_code != "change_karteStatus"){
      presDataStr.department_code = department_code;
      presDataStr.department_name = department_name;
    }
    // YJ94 保存済みレコードの入外区変更と診療科変更は権限で制限する
    if (department_code == "change_karteStatus") {
      presDataStr.karte_status = department_name; // department: karte_status
    }
    karteApi.setVal(this.props.match.params.id, CACHE_LOCALNAMES.SOAP_EDIT, JSON.stringify(presDataStr), 'insert');
    this.setState({isForUpdate: true, updateIndex: index, soapData: soap });
  }

  gotoPage = (type) => {
    this.context.$screenCapture();
    switch(type){
      case this.context.OperationURL.PRESCRIPTION:
        this.props.history.replace(`/patients/${this.props.match.params.id}/prescription`);
        break;
      case this.context.OperationURL.INSPECTION:
        this.props.history.replace(`/patients/${this.props.match.params.id}/inspection`);
        break;
      case this.context.OperationURL.INJECTION:
        this.props.history.replace(`/patients/${this.props.match.params.id}/injection`);
        break;
      default:
        break;
    }
  }

  setOpenClose = (nType, i) => {
    var setVal = false;
    if(i == TREE_FLAG.OPEN_TREE){
      setVal = true;
    }
    switch(nType){
      case SOAP_TREE_CATEGORY.CURRENT_SOAP:
        this.leftBoxRef.current.setChangeTree('bOpenCurrentSoap', setVal);
        break;
      case SOAP_TREE_CATEGORY.ALL_SOAP:
        this.leftBoxRef.current.setChangeTree('bOpenAllSoap', setVal);
        break;
      case SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER:
        this.leftBoxRef.current.setChangeTree('bOpenAllExecuteOrder', setVal);
        break;
      case SOAP_TREE_CATEGORY.GROUP_EXAMINATION:
        this.leftBoxRef.current.setChangeTree('bOpenGroupExamination', setVal);
        break;
      case SOAP_TREE_CATEGORY.CURRENT_EXAMINATION:
        this.leftBoxRef.current.setChangeTree('bOpenCurrentExamination', setVal);
        break;
      case SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION:
        this.leftBoxRef.current.setChangeTree('bOpenGlobalExamination', setVal);
        break;
      case SOAP_TREE_CATEGORY.ALL_ORDER:
        this.leftBoxRef.current.setChangeTree('bOpenAllOrder', setVal);
        break;
      case SOAP_TREE_CATEGORY.ALL_EXAMINATION:
        this.leftBoxRef.current.setChangeTree('bOpenAllExamination', setVal);
        break;
      case SOAP_TREE_CATEGORY.ALL_INSPECTION:
        this.leftBoxRef.current.setChangeTree('bOpenAllInspection', setVal);
        break;
      case SOAP_TREE_CATEGORY.ALL_TREATMENT:
        this.leftBoxRef.current.setChangeTree('bOpenAllTreatment', setVal);
        break;
      case SOAP_TREE_CATEGORY.ALL_REHABILY:
        this.leftBoxRef.current.setChangeTree('bOpenAllRehabily', setVal);
        break;
      case SOAP_TREE_CATEGORY.ALL_RADIATION:
        this.leftBoxRef.current.setChangeTree('bOpenAllRadiation', setVal);
        break;
      case SOAP_TREE_CATEGORY.ALL_SOAP_TAG:
        this.leftBoxRef.current.setChangeTree('bOpenAllSoapTag', setVal);
        break;
      case SOAP_TREE_CATEGORY.SEARCH_CONDITION:
        this.leftBoxRef.current.setChangeTree('bOpenSearchCondition', setVal);
        break;
      case SOAP_TREE_CATEGORY.CURRENT_SOAP_LATEST:
        this.leftBoxRef.current.setChangeTree('bOpenCurrentSoapLatest', setVal);
        break;
      case SOAP_TREE_CATEGORY.ALL_SOAP_LATEST:
        this.leftBoxRef.current.setChangeTree('bOpenAllSoapLatest', setVal);
        break;
      case SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER_LATEST:
        this.leftBoxRef.current.setChangeTree('bOpenAllExecuteOrderLatest', setVal);
        break;
      case SOAP_TREE_CATEGORY.CURRENT_EXAMINATION_LATEST:
        this.leftBoxRef.current.setChangeTree('bOpenCurrentExaminationLatest', setVal);
        break;
      case SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION_LATEST:
        this.leftBoxRef.current.setChangeTree('bOpenGlobalExaminationLatest', setVal);
        break;
      case SOAP_TREE_CATEGORY.ALL_ORDER_LATEST:
        this.leftBoxRef.current.setChangeTree('bOpenAllOrderLatest', setVal);
        break;
      case SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST:
        this.leftBoxRef.current.setChangeTree('bOpenAllExaminationLatest', setVal);
        break;
      case SOAP_TREE_CATEGORY.ALL_INSPECTION_LATEST:
        this.leftBoxRef.current.setChangeTree('bOpenAllInspectionLatest', setVal);
        break;
      case SOAP_TREE_CATEGORY.ALL_TREATMENT_LATEST:
        this.leftBoxRef.current.setChangeTree('bOpenAllTreatmentLatest', setVal);
        break;
      case SOAP_TREE_CATEGORY.ALL_REHABILY_LATEST:
        this.leftBoxRef.current.setChangeTree('bOpenAllRehabilyLatest', setVal);
        break;
      case SOAP_TREE_CATEGORY.ALL_RADIATION_LATEST:
        this.leftBoxRef.current.setChangeTree('bOpenAllRadiationLatest', setVal);
        break;
      case SOAP_TREE_CATEGORY.ALL_SOAP_TAG_LATEST:
        this.leftBoxRef.current.setChangeTree('bOpenAllSoapTagLatest', setVal);
        break;
      case SOAP_TREE_CATEGORY.ALL_HOSPITAL_ORDER:
        this.leftBoxRef.current.setChangeTree('bOpenAllHospital', setVal);
        break;
      case SOAP_TREE_CATEGORY.ALL_PROGRESS:
        this.leftBoxRef.current.setChangeTree('bOpenAllProgress', setVal);
        break;
      case SOAP_TREE_CATEGORY.ALL_PROGRESS_LATEST:
        this.leftBoxRef.current.setChangeTree('bOpenAllProgressLatest', setVal);
        break;
    }
  }

  setForUpdate = () => {
    this.setState({
      isForUpdate: false,
      updateIndex: -1
    });
  }

  closePatient = () => {
    let menu_item = localApi.getObject("select_menu_info");
    if (menu_item != null && menu_item != undefined && menu_item.from != null && menu_item.from != undefined && menu_item.from == "sidebar") {
      // from sidebar menu: don't show navigation menu
      this.context.$selectMenuModal(false);
    } else {
      // from navigation menu: show navigation menu
      this.context.$selectMenuModal(true);
    }

    this.setState({selectPatient: false})
    let system_before_page = localApi.getValue('system_before_page');
    this.props.history.replace(system_before_page != "" ? system_before_page : "/top");
  };

  hasPermissionConfig = (_type = null) => {
    let result = false;
    if (_type == null) return result;

    // get config info
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    if(initState == undefined && initState == null && initState.conf_data == undefined) return result;

    let permission = 0;

    switch(_type){
      case "訪問診療":// karte_in_out_enable_visiting
        if(initState.conf_data.karte_in_out_enable_visiting !== undefined && initState.conf_data.karte_in_out_enable_visiting == "ON"){
          permission = 1;
        }
        break;
      case "入院":// karte_in_out_enable_hospitalization
        if(initState.conf_data.karte_in_out_enable_hospitalization !== undefined && initState.conf_data.karte_in_out_enable_hospitalization == "ON"){
          permission = 1;
        }
        break;
    }

    if (permission == 1) result = true;
    return result;
  }

  setPatient = async(system_info) => {
    let systemPatientId = system_info.systemPatientId;
    this.setState({
      selectPatient: false,
    })
    let menu_item = localApi.getObject("select_menu_info");
    if (menu_item == null || menu_item == undefined) {
      return;
    }
    if (menu_item.ele.type == "modal") { // modal

      menu_item.has_modal = 1;
      localApi.setObject("select_menu_info", menu_item);
      this.props.history.replace(`/patients/${systemPatientId}/soap`);
    } else { // page
      let url_path = menu_item.ele.url;
      // 在宅処方、在宅注射の場合 karte status: 訪問診療
      if (menu_item.ele.url == "/home_prescription" || menu_item.ele.url == "/home_injection") {
        // check 訪問診療 config
        if (this.hasPermissionConfig("訪問診療") == true) {
          this.context.$updateKarteStatus(2, "訪問診療");
        } else {// no permission
          this.context.$updateKarteStatus(0, "外来");
        }
        if (menu_item.ele.url == "/home_prescription") url_path = "prescription";
        if (menu_item.ele.url == "/home_injection") url_path = "injection";
      }
      if (menu_item.ele.url == "/hospitalize_prescription" || menu_item.ele.url == "/hospitalize_injection" || menu_item.ele.url == "/hospitalize_soap") {
        if (menu_item.ele.url == "/hospitalize_prescription" || menu_item.ele.url == "/hospitalize_injection") {
          // check 入院 config
          if (this.hasPermissionConfig("入院") == true) {
            this.context.$updateKarteStatus(1, "入院");
          } else {// no permission
            this.context.$updateKarteStatus(0, "外来");
          }
        } else if(menu_item.ele.url == "/hospitalize_soap") { // 初診・入院時ノート
          karteApi.setVal(systemPatientId, CACHE_LOCALNAMES.SOAP_CATEGORY, JSON.stringify("hospital_note"));
        }
        url_path = menu_item.ele.url == "/hospitalize_prescription" ? "prescription" : menu_item.ele.url == "/hospitalize_injection" ? "injection" : "soap";
      }
      // if no 初診・入院時ノート, set soapCategory=>"soap"
      if (menu_item.ele.url == "/soap"){
        karteApi.setVal(systemPatientId, CACHE_LOCALNAMES.SOAP_CATEGORY, JSON.stringify("soap"));
      }
      if (menu_item.ele.url == "/prescription" || menu_item.ele.url == "/injection") {
        this.context.$updateKarteStatus(0, "外来");
      }
      if (menu_item.ele.url == "/prescription" || menu_item.ele.url == "/injection" || menu_item.ele.url == "/soap" || menu_item.ele.url == "/inspection") {
        url_path = menu_item.ele.url.substring(1, menu_item.ele.url.length);
      }
      if(menu_item.ele.url == "/last_prescription_soap"){
        url_path = "soap";
        if(this.context.$getKarteMode(this.props.match.params.id) == KARTEMODE.READ){
          this.props.history.replace(`/patients/${systemPatientId}/${url_path}`);
        } else {
          /*@cc_on _win = window; eval ( 'var window = _win') @*/
          let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
          let menu_id = menu_item.ele.id;
          let karte_status_code = 1;
          if(menu_id == 234){
            karte_status_code = 3;
          }
          if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
            let data = sessApi.getDoctorList();
            if(data == null) {
              data = await apiClient.get("/app/api/v2/secure/doctor/search?");
            }
            this.doctors_data = data;
            this.setState({
              cur_url:"/last_prescription_soap",
              cur_patient_id:systemPatientId,
              isOpenDoctorSoapModal: true,
              karte_status_code,
            });
            return;
          } else {
            let his = this.props.history;
            this.getLastPrescription(systemPatientId, this.context.department.code == 0 ? 1 : this.context.department.code, karte_status_code).then(function(value){
              if(value) {
                his.replace(`/patients/${systemPatientId}/${url_path}`);
              }
            });
          }
        }
      }
      if(menu_item.ele.url == "/medical_record_order"){
        /*@cc_on _win = window; eval ( 'var window = _win') @*/
        let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
        if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
          let data = sessApi.getDoctorList();
          if(data == null) {
            data = await apiClient.get("/app/api/v2/secure/doctor/search?");
          }
          this.doctors_data = data;
          this.setState({
            cur_url:"/medical_record_order",
            isOpenDoctorSoapModal:true,
            cur_patient_id:systemPatientId,
          });
          return;
        } else {
          this.createMedicalRecordOrder(systemPatientId);
          url_path = "soap";
          this.props.history.replace(`/patients/${systemPatientId}/${url_path}`);
        }
      } else {
        this.props.history.replace(`/patients/${systemPatientId}/${url_path}`);
      }
    }
  };

  changeLeftSoapList = (department, year, month, date, nCategoryType) => {
    karteApi.setVal(this.props.match.params.id, CACHE_LOCALNAMES.SOAP_PAGE_NUMBER, 0);
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    window.sessionStorage.setItem('soap_scroll_top', 0);
    karteApi.delVal(this.props.match.params.id, CACHE_LOCALNAMES.MIDDLE_ORDER_OPEN);
    this.changeSoapList(department, year, month, date, nCategoryType);
  }

  saveConfirmMessage = (act, index, type = "middlebox_right_click", other_value=null) => { //other_value:   ex)  inspection_id
    if(act === "last_prescription"){ //前回処方
      let karte_status_code = 1;
      if(this.context.karte_status.code == 1){
        karte_status_code = 3;
      }
      if(this.context.karte_status.code == 2){
        karte_status_code = 2;
      }
      this.setState({
        cur_url:"/last_prescription_soap",
        cur_patient_id:this.props.match.params.id,
        isOpenDoctorSoapModal: true,
        karte_status_code,
      });
    } else {
      this.setState({
        confirm_msg_index: index,
        confirm_msg_act: act,
        confirm_msg_type: type,
        isOpenDoctorSoapModal: true,
        other_value,
      });
      this.middleRef_call_flag = 1;
    }
  }

  setTagData =(act, karte_tree_number, data, sub_key= null)=>{
    let allTags = this.state.allTags;
    if(act === 'add'){
      Object.keys(data).map(key=>{
        if(allTags[karte_tree_number] === undefined){
          allTags[karte_tree_number] = {};
        }
        if(allTags[karte_tree_number][key] === undefined){
          allTags[karte_tree_number][key] = {};
        }
        allTags[karte_tree_number][key] = data[key];
      })
      if(sub_key != null){
        delete allTags[karte_tree_number][sub_key];
        if(Object.keys(allTags[karte_tree_number]).length === 0){
          delete allTags[karte_tree_number];
        }
      }
    } else if(act === 'delete'){
      delete allTags[karte_tree_number][data];
      if(Object.keys(allTags[karte_tree_number]).length === 0){
        delete allTags[karte_tree_number];
      }
    }
    this.setState({
      allTags
    }, ()=>{
      this.middleRef.current.setAllTagsData(allTags);
    });
  }

  setImportance =(soapIndex, importance_level)=>{
    let soapList = this.state.soapList;
    soapList[soapIndex]['importance_level'] = importance_level;
    this.setState({soapList}, ()=>{
      this.middleRef.current.setSoapListData(soapList);
    });
  }

  goToDropPage = (url="") => {
    if (url === "") return;
    this.props.history.replace(url);
  }

  copyInspection = (nIndex, other_value=null) => { //other_value ex)soapの#/S/O/A/P
    this.rightRef.current.dropSoapEvent(nIndex, other_value);
  }

  checkKarteData=async()=>{
    let path = "/app/api/v2/karte/tree/checkKarteData";
    let post_data = {
      system_patient_id:this.props.match.params.id,
      medical_department_code:this.context.department.code === 0 ? 1 : this.context.department.code,
      updated_at:this.state.recently_updated_datetime,
    };
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if(res.count > 0){
          this.getAllKarteTree({
            patient_id: this.props.match.params.id,
            medical_department_code: this.context.department.code,
            // karte_status: this.context.karte_status.code
          });
        }
      })
      .catch(() => {
      });
  }

  getselectedtDate =(current_soap, selected_date)=>{
    let year = selected_date.split('-')[0];
    let month = selected_date.split('-')[1];
    let date = selected_date.split('-')[2];
    if(current_soap !== undefined && current_soap != null && current_soap.length > 0){
      let year_key = '';
      let month_key = '';
      let date_key = '';
      current_soap.map((year_data, year_index)=>{
        if(year_data['year'] == year){
          year_key = year_index;
          year_data['data'].map((month_data, month_index)=>{
            if(month_data['month'] == year + '-' + month){
              month_key = month_index;
              month_data['data'].map((date_data, date_index)=>{
                if(date_data['date'] == year + '-' +month + '-' + date){
                  date_key = date_index;
                  return;
                }
              })
              return;
            }
          });
          return;
        }
      });
      if(year_key !== '' && month_key !== '' && date_key !== ''){
        return year_key+':'+month_key+':'+date_key;
      }
      return null;
    }
  }

  setSoapTreesBydate=(soapTrees, selected_date_key)=>{
    let selYear = selected_date_key.split(':')[0];
    let selMonth = selected_date_key.split(':')[1];
    let selDay = selected_date_key.split(':')[2];
    let current_soap = [...soapTrees.current_soap];
    current_soap.map((item, index) => {
      if (index == selYear) {
        item.class_name = "open";
      }
      item.data.map((monthItem, ind) => {
        if (ind == selMonth && index == selYear) {
          monthItem.class_name = "open";
        }
        monthItem.data.map((data, ind2) => {
          if (ind2 == selDay && ind == selMonth && index == selYear) {
            data.class_name = "open";
          }
        })
      })
    })
    return current_soap;
  }

  setSoapListBydate=(soapTrees, selected_date_key, allDateList)=>{
    let selYear = selected_date_key.split(':')[0];
    let selMonth = selected_date_key.split(':')[1];
    let selDay = selected_date_key.split(':')[2];
    let soapList = [];
    let showDelete = false;
    if(this.context.$canDoAction(this.context.FEATURES.SOAP, this.context.AUTHS.SHOW_DELETE)){
      showDelete = true;
    }
    let current_soap = [...soapTrees.current_soap];
    let cur_department_code = this.context.department.code;
    current_soap.map((item, index) => {
      if (index == selYear) {
        item.data.map((monthItem, ind) => {
          if (ind == selMonth) {
            monthItem.data.map((data, ind2) => {
              if (ind2 == selDay) {
                //date
                var arrAllCategories = allDateList[data.date];
                if (Object.keys(arrAllCategories).length < 1) {
                  return;
                }
                Object.keys(arrAllCategories).forEach(function(key){
                  arrAllCategories[key].map((soap)=>{
                    soap["openTag"] = 0;
                    soap.class_name = "open";
                    soap["openTag"] = 1;
                    if (cur_department_code == soap.medical_department_code || (cur_department_code == 0 && soap.medical_department_code == 1)) {
                      if (!showDelete) {
                        if (soap.is_enabled == 1) {
                          soapList.push(soap);
                        }
                      }else{
                        soapList.push(soap);
                      }
                    } else if (soap.target_table == "examination") {
                      if (!showDelete) {
                        if (soap.is_enabled == 1) {
                          soapList.push(soap);
                        }
                      }else{
                        soapList.push(soap);
                      }
                    }
                  });
                });
              }
            })
          }
        })
      }
    });
    return this.sortSoapList(soapList);
  };

  createMedicalRecordOrder=(systemPatientId, doctor_code=null, doctor_name=null)=>{
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let medical_examination_record = {};
    medical_examination_record['patient_id'] = systemPatientId;
    medical_examination_record['department_id'] = this.context.department.code == 0 ? 1 : this.context.department.code;
    medical_examination_record['doctor_code'] = doctor_code != null ? doctor_code : (authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code);
    medical_examination_record['doctor_name'] = doctor_name != null ? doctor_name : (authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name);
    karteApi.setVal(systemPatientId, CACHE_LOCALNAMES.MEDICAL_EXAMINATION_RECORD, JSON.stringify(medical_examination_record), 'insert');
  }

  onResizeEnd = (val) => {
    /*@cc_on _d = document; eval ( 'var document = _d') @*/
    let cache_tree_width = karteApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.TREE_WIDTH);
    cache_tree_width.soap.left.size = val[0].size;
    cache_tree_width.injection.left.size = val[0].size;
    cache_tree_width.inspection.left.size = val[0].size;
    cache_tree_width.prescription.left.size = val[0].size;
    // cache_tree_width.soap.middle.size = val[1].size;
    cache_tree_width.soap.right.size = val[2].size;
    karteApi.setVal(this.props.match.params.id, CACHE_LOCALNAMES.TREE_WIDTH, JSON.stringify(cache_tree_width));
    //プログレスノート width
    let SoapCategory = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.SOAP_CATEGORY);
    let minus_width = (SoapCategory != undefined && SoapCategory != null && SoapCategory == "hospital_note") ? 99 : 54;
    let panelWrapper = document.getElementsByClassName("panelWrapper")[2];
    if(panelWrapper !== undefined && panelWrapper != null){
      let panelWrapper_width = $(panelWrapper).width();
      let content_editable_obj = document.getElementsByClassName("content_editable_area");
      for(let index=0; index < content_editable_obj.length; index++){
        if(content_editable_obj[index] !== undefined && content_editable_obj[index] != null){
          content_editable_obj[index]['style']['width'] = (panelWrapper_width - minus_width - 17)+"px";
        }
      }
    }
    //rightbox  space_area
    let space_area = document.getElementsByClassName("space-area")[0];
    if(space_area !== undefined && space_area != null){
      let order_area_obj = document.getElementsByClassName("order-area")[0];
      if(order_area_obj !== undefined && order_area_obj != null){
        let order_area_obj_height = $(order_area_obj).height();
        let order_data_area_obj = document.getElementsByClassName("order-data-area")[0];
        let order_data_area_obj_height = $(order_data_area_obj).height();
        if(order_area_obj_height > order_data_area_obj_height){
          space_area.style['height'] = (order_area_obj_height - order_data_area_obj_height - 25)+"px";
        } else {
          space_area.style['height'] = "0px";
        }
      }
    }
  }

  applyRightDeleteData = () => {
    this.rightRef.current.testDeleteRender();
  }

  refreshRightBox = () => {
    this.rightRef.current.rightboxRefresh();
  }
  
  refreshMiddleBox = () => {
    this.middleRef.current.middleboxRefresh();
  }

  middleboxCancelDelData = (patientId, cache_name, sub_key=null) => {
    let cahce_data = null;
    if(sub_key == null){
      cahce_data = karteApi.getVal(patientId, cache_name);
    } else {
      cahce_data = karteApi.getSubVal(patientId, cache_name, sub_key);
    }
    this.middleRef.current.middleboxCancelDelData(cahce_data['karte_number'], cache_name, sub_key);
  }
  closeSystemAlertModal = () => {
    this.alertModalRef.current.callVisible(false);
    this.alertModalShow = false;
    // this.setState({alert_messages: '', alert_title:''});
  }

  checkDeathPatient = (_type, _url) => {
    if (_type == "modal" && 
        (_url == "physiological" || 
        _url == "endoscope" || 
        _url == "radiation" || 
        _url == "guidance" || 
        _url == "rehabilitation" || 
        _url == "hospital_application_order" || 
        _url == "hospital_dicision_order" || 
        _url == "discharge_permit_order" || 
        _url == "change_responsibility" || 
        _url == "hospital_dicision_order" || 
        _url == "hospital_done" || 
        _url == "home_treatment" || 
        _url == "hospital_treatment" || 
        _url == "openExamination" || 
        _url == "outpatient")
      ) {
      // 死亡状態に関する修正
      let current_system_patient_id = localApi.getValue("current_system_patient_id");
      current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
      if (karteApi.isDeathPatient(current_system_patient_id)){
        return true;
      }
    }

    return false;
  }

  cancelAlertModal = () => {
    this.setState({
      alertMessage: ""
    });
  }
  
  purge(d) {
    var a = d.attributes, i, l, n;
    if (a) {
      l = a.length;
      for (i = 0; i < l; i += 1) {
        n = a[i].name;
        if (typeof d[n] === 'function') {
          d[n] = null;
        }
      }
    }
    a = d.childNodes;
    if (a) {
      l = a.length;
      for (i = 0; i < l; i += 1) {
        this.purge(d.childNodes[i]);
      }
    }
  }
  
  changeAllDateList=(allDateList)=>{
    this.leftBoxRef.current.setChangeTree('allDateList', allDateList);
  }
  
  closeRightClickMenu=(from_click)=>{
    if(from_click === "right"){
      this.middleRef.current.closeRightClickMenu();
      this.leftBoxRef.current.closeRightClickMenu();
    }
    if(from_click === "middle"){
      this.rightRef.current.closeRightClickMenu();
      this.leftBoxRef.current.closeRightClickMenu();
    }
    if(from_click === "left"){
      this.middleRef.current.closeRightClickMenu();
      this.rightRef.current.closeRightClickMenu();
    }
  }

  // ●YJ1153 期間が終了していない定期処方を延長できるようにする
  openPrescriptionIncreasePeriodModal = (modal_data) => {
    this.middleRef.current.renderPrescriptionIncreasePeriodModal(modal_data);
  }

  render() {
    if (this.state.modalVisible == true) {
      this.EndExaminationNoRefreshModalRef.current.initStatus("show");
    }
    if ((this.m_department_code !== -1 && this.m_department_code !== this.context.department.code) && this.props.match.params.id > 0) {
      // this.m_karte_status_code = this.context.karte_status.code;
      this.m_department_code = this.context.department.code;
      karteApi.delVal(this.props.match.params.id, CACHE_LOCALNAMES.MIDDLE_ORDER_OPEN);
      this.setState({
        isLoaded: false
      },()=>{
        this.getCurrentKarteTree({
          patient_id: this.props.match.params.id,
          medical_department_code: this.context.department.code,
          // karte_status: this.context.karte_status.code
        }, true);
        this.getAllKarteTree({
          patient_id: this.props.match.params.id,
          medical_department_code: this.context.department.code,
          // karte_status: this.context.karte_status.code
        });
      });
    }

    // SOAPの左ツリー width setting
    let tree_width = [
      {size: 350, minSize:180, maxSize:400, resize: "dynamic"},
      {minSize:400, resize: "stretch"},
      {size: 450, minSize:390, resize: "dynamic"}
    ];

    let cache_tree_width = karteApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.TREE_WIDTH);
    if (cache_tree_width != undefined && cache_tree_width != null && cache_tree_width.soap != undefined && cache_tree_width.soap != null) {
      tree_width = [
        cache_tree_width.soap.left,
        cache_tree_width.soap.middle,
        cache_tree_width.soap.right
      ]
    }
    this.font_props = this.context.font_props;

    return (
      <div className="hello">
        <PrescriptionWrapper>
          <Wrapper>
            <PanelGroup borderColor="#DDD" spacing={2}
                        panelWidths={tree_width}
                        onResizeEnd={this.onResizeEnd}
            >
              <LeftBox
                ref={this.leftBoxRef}
                soapTrees={this.state.soapTrees}
                changeSoapList={this.changeLeftSoapList}
                departmentStr={this.context.department.name !== ""?this.context.department.name:"内科"}
                bOpenCurrentSoap={this.state.bOpenCurrentSoap}
                bOpenAllSoap={this.state.bOpenAllSoap}
                bOpenAllExecuteOrder={this.state.bOpenAllExecuteOrder}
                bOpenGroupExamination={this.state.bOpenGroupExamination}
                bOpenCurrentExamination={this.state.bOpenCurrentExamination}
                bOpenGlobalExamination={this.state.bOpenGlobalExamination}
                bOpenAllOrder={this.state.bOpenAllOrder}
                bOpenAllExamination={this.state.bOpenAllExamination}
                bOpenAllInspection={this.state.bOpenAllInspection}
                bOpenAllTreatment={this.state.bOpenAllTreatment}
                bOpenAllRehabily={this.state.bOpenAllRehabily}
                bOpenAllRadiation={this.state.bOpenAllRadiation}
                bOpenAllSoapTag={this.state.bOpenAllSoapTag}
                bOpenCurrentSoapLatest={this.state.bOpenCurrentSoapLatest}
                bOpenAllSoapLatest={this.state.bOpenAllSoapLatest}
                bOpenAllExecuteOrderLatest={this.state.bOpenAllExecuteOrderLatest}
                bOpenCurrentExaminationLatest={this.state.bOpenCurrentExaminationLatest}
                bOpenGlobalExaminationLatest={this.state.bOpenGlobalExaminationLatest}
                bOpenAllProgress = {this.state.bOpenAllProgress}
                bOpenAllOrderLatest={this.state.bOpenAllOrderLatest}
                bOpenAllExaminationLatest={this.state.bOpenAllExaminationLatest}
                bOpenAllInspectionLatest={this.state.bOpenAllInspectionLatest}
                bOpenAllTreatmentLatest={this.state.bOpenAllTreatmentLatest}
                bOpenAllRehabilyLatest={this.state.bOpenAllRehabilyLatest}
                bOpenAllRadiationLatest={this.state.bOpenAllRadiationLatest}
                bOpenAllSoapTagLatest={this.state.bOpenAllSoapTagLatest}
                bOpenAllProgressLatest = {this.state.bOpenAllProgressLatest}
                bOpenSearchCondition={this.state.bOpenSearchCondition}
                setOpenClose={this.setOpenClose}
                categoryType={this.state.categoryType}
                selYear={this.state.selYear}
                selMonth={this.state.selMonth}
                selDay={this.state.selDay}
                allTags={this.state.allTags}
                allDateList={this.state.allDateList}
                getAllKarteTree={this.getAllKarteTree}
                search_condition_number={this.state.search_condition_number}
                font_props = {this.font_props}
                closeRightClickMenu = {this.closeRightClickMenu}
              />
              <MiddleBox
                ref={this.middleRef}
                isLoaded={this.state.isLoaded}
                soapTrees={this.state.soapTrees}
                saveConfirmMessage={this.saveConfirmMessage}
                soapList={this.state.soapList}
                allTags={this.state.allTags}
                updateSoapList={this.updateSoapList}
                changeSoapList={this.changeSoapList}
                updateSoap={this.updateSoap}
                showModal={this.emitPatientModalEvent}
                patientId={this.props.match.params.id}
                patientInfo={this.state.patientInfo}
                categoryType={this.state.categoryType}
                updateIndex={this.state.updateIndex}
                selYear={this.state.selYear}
                selMonth={this.state.selMonth}
                selDay={this.state.selDay}
                setTagData={this.setTagData}
                setImportance={this.setImportance}
                goToDropPage={this.goToDropPage}
                copyInspectionAction={this.copyInspection}
                show_list_condition={this.state.show_list_condition}
                allDateList={this.state.allDateList}
                getLastPrescription={this.getLastPrescription}
                getLastInjection={this.getLastInjection}
                next_reservation_visit_date={this.state.next_reservation_visit_date}
                font_props = {this.font_props}
                applyRightDeleteData = {this.applyRightDeleteData}
                refreshRightBox = {this.refreshRightBox}
                changeAllDateList = {this.changeAllDateList}
                closeRightClickMenu = {this.closeRightClickMenu}
              />
              {/* <div style={{width:"100%", backgroundColor:"red"}}> */}
              <RightBox
                ref={this.rightRef}
                isLoaded={this.state.isLoaded}
                isForUpdate={this.state.isForUpdate}
                saveConfirmMessage={this.saveConfirmMessage}
                soapList={this.state.soapList}
                updateIndex={this.state.updateIndex}
                presData={this.state.soapData}
                patientId={this.props.match.params.id}
                patientInfo={this.state.patientInfo}
                setForUpdate={this.setForUpdate}
                showModal={this.emitPatientModalEvent}
                getSoapPrescriptionDelData={this.getSoapPrescriptionDelData}
                getSoapInjectionDelData={this.getSoapInjectionDelData}
                goToDropPage={this.goToDropPage}
                getLastPrescription={this.getLastPrescription}
                font_props = {this.font_props}
                middleboxCancelDelData = {this.middleboxCancelDelData}
                refreshMiddleBox = {this.refreshMiddleBox}
                closeRightClickMenu = {this.closeRightClickMenu}
                openPrescriptionIncreasePeriodModal = {this.openPrescriptionIncreasePeriodModal}
              />
              {/* </div> */}
            </PanelGroup>
            {(this.state.confirm_msg_act == "injectionStopOrder" || this.state.confirm_msg_act == "injectionStopCancelOrder") && this.middleRef_call_flag == 1 ? (
              <>
                {this.context.autoLogoutModalShow === false && this.doctors_data != null && this.state.isOpenDoctorSoapModal === true && (
                  <SelectDoctorModal
                    closeDoctor={this.closeDoctorModal}
                    getDoctor={this.getDoctor}
                    selectDoctorFromModal={this.selectDoctorFromModal}
                    doctors={this.doctors_data}
                    from_regular_injection={true}
                  />
                )}
              </>
            ):(
              <>
                {this.context.autoLogoutModalShow === false && this.doctors_data != null && this.state.isOpenDoctorSoapModal === true && (
                  <SelectDoctorModal
                    closeDoctor={this.closeDoctorModal}
                    getDoctor={this.getDoctor}
                    selectDoctorFromModal={this.selectDoctorFromModal}
                    doctors={this.doctors_data}
                  />
                )}
              </>
            )}
            {this.context.autoLogoutModalShow === false &&
            this.state.selectPatient == true && (
              <SelectPatientSoapModal
                closeModal={this.closePatient}
                handleOk={this.setPatient}
              />
            )}
            {this.state.showMdoal && (
              <SelectModeModal
                patientInfo={this.state.patientInfo}
              />
            )}            
            {this.state.alertMessage == "death" && (
              <AlertNoFocusModal
                hideModal= {this.cancelAlertModal.bind(this)}
                handleOk= {this.cancelAlertModal.bind(this)}
                showMedicineContent= {"死亡した患者です。"}
              />
            )}
            <AlertNotDoneListModal
              closeModal={this.closeSystemAlertModal}              
              ref={this.alertModalRef}
              alert_message={this.state.alert_messages}
              title={this.state.alert_title}
              visible={this.alertModalShow}
              patientId={this.props.match.params.id}
            />
          </Wrapper>          
          <EndExaminationNoRefreshModal
            ref={this.EndExaminationNoRefreshModalRef}
            visible={this.state.modalVisible}
            patientId={this.props.match.params.id}
            patientInfo={this.state.patientInfo}            
            sendPrescription={this.sendKarte}
            closeModal={this.closeModal}
            cancelExamination={this.cancelExamination}
            pacsOn={this.state.pacsOn}
            PACSOff={this.PACSOff}
            isSending={this.state.isSending}
            getMessageSendKarte={this.getMessageSendKarte}
            goKartePage={this.goKartePage}
          />
        </PrescriptionWrapper>
      </div>
    );
  }
}

SOAP.contextType = Context;

SOAP.propTypes = {
  patientInfo: PropTypes.object.isRequired,
  patientId: PropTypes.number.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.node
    }).isRequired
  }).isRequired,
  history: PropTypes.object
};
export default SOAP;
