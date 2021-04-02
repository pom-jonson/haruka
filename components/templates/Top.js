import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import Context from "~/helpers/configureStore";
import auth from "~/api/auth";
import * as methods from "~/components/methods/StoreMethods";
import * as patientMethods from "./PatientMethods";
import * as apiClient from "../../api/apiClient";
import NotConsentedModal from "../organisms/NotConsentedModal";
import SystemConfirmModal from "../molecules/SystemConfirmModal";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as localApi from "~/helpers/cacheLocal-utils";
import SelectDoctorModal from "../molecules/SelectDoctorModal";

import InspectionReservationListModal from "~/components/templates/Patient/Modals/Physiological/InspectionReservationListModal";
import EndoscopeReservationListModal from "~/components/templates/Patient/Modals/Endoscope/EndoscopeReservationListModal";
import InspectionStatusList from "~/components/templates/Patient/Modals/Physiological/InspectionStatusList";
import InspectionDepartmentResultModal from "~/components/templates/Patient/Modals/Physiological/InspectionDepartmentResultModal";
import EndoscopeDepartmentResultModal from "~/components/templates/Patient/Modals/Endoscope/EndoscopeDepartmentResultModal";
import RadiationDepartmentResultModal from "~/components/templates/Patient/Modals/Radiation/RadiationDepartmentResultModal";
import EndoscopeStatusListModal from "~/components/templates/Patient/Modals/Endoscope/EndoscopeStatusListModal";
import RadiationStatusListModal from "~/components/templates/Patient/Modals/Radiation/RadiationStatusListModal";
import OutExamCooperationRequestOutputModal
  from "~/components/templates/InspectionList/OutExamCooperationRequestOutputModal";
import ReportCreatListModal from "~/components/templates/Report/ReportCreatListModal";
import AdminDiaryModal from "~/components/templates/Report/AdminDiaryModal";
import AdministrationDiaryMenuModal from "~/components/templates/Nurse/AdministrationDiaryMenuModal";
import EmergencyReceptionModal from "~/components/templates/Emergency/EmergencyReceptionModal";
import RadiationReservationListModal
  from "~/components/templates/Patient/Modals/Radiation/RadiationReservationListModal";
import MedicationGuidanceSchedule from "~/components/templates/Patient/Medication/MedicationGuidanceSchedule";
import NutritionGuidanceSlipTotal from "../templates/Nutrition/NutritionGuidanceSlipTotal";
import ChemicalInformationSearch from "../templates/Patient/Chemicals/ChemicalInformationSearch";
import HospitalPlanList from "../templates/Patient/Modals/Hospital/HospitalPlanList";
import WardLabel from "~/components/templates/Patient/Modals/WardLabel/WardLabel";
import ScannerBatchTakeDoc from "../templates/ScannerBatchTakeDoc";
import InpatientContactList from "~/components/templates/InpatientContactList";
import PatientsSchedule from "../templates/Nurse/patients_schedule/PatientsSchedule";
import NurseAssignment from "../templates/Nurse/nurse_assignment/NurseAssignment";
import MovePlanPatientList from "../templates/Ward/MovePlanPatientList";
import OutInjectionPatientModal from "~/components/templates/Nurse/TreatInjectionPatientList/OutInjectionPatientModal";
import ProgressChart from "~/components/templates/Nurse/ProgressChart/ProgressChart";
import NurseSummaryList from "~/components/templates/Nurse/NurseSummaryList/NurseSummaryList";
import VisitNurseSummaryList from "~/components/templates/Nurse/NurseSummaryList/VisitNurseSummaryList";
import DocumentReference from "~/components/templates/Patient/Modals/Document/DocumentReference";
import PatientCertification from "~/components/templates/Nurse/patient_certification/PatientCertification";
import HospitalPatientBarcodePrint from "~/components/templates/Nurse/barcode_print/HospitalPatientBarcodePrint";
import SummaryList from "~/components/templates/Ward/Summary/SummaryList";

registerLocale("ja", ja);

const PatientsWrapper = styled.div`
  width: 100%;
  margin: auto;
`;


class Top extends Component {
  getBookmarksInfor = methods.getBookmarksInfor.bind(this);
  getLinkHistoryInfor = methods.getLinkHistoryInfor.bind(this);
  getFavouriteHistoryType = methods.getFavouriteHistoryType.bind(this);
  checkHasCacheData = patientMethods.checkHasCacheData.bind(this);
  getTrackData = patientMethods.getTrackData.bind(this);
  constructor(props) {
    super(props);    
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.state = {
      // staff_category: authInfo.staff_category || 2,
      authInfo: authInfo,
      confirm_message: "",
      hasNotConsentedData: false,
      isScannerBatchTakeDocPopupOpen: false,
      isHospitalPlanListPopupOpen: false,
      isSummaryListPopupOpen: false,
      isDocumentReferencePopupOpen: false,
      isRadiationReservationListPopupOpen: false,
      isChemicalInformationSearchPopupOpen: false,
      isNutritionGuidanceSlipTotalPopupOpen: false,
      isInspectionReservationListPopupOpen: false,
      isEndoscopeReservationListPopupOpen: false,
      isWardLabelPopupOpen: false,
      isInspectionStatusListPopupOpen: false,
      isEndoscopeStatusListPopupOpen: false,
      isRadiationStatusListPopupOpen: false,
      isInspectionDepartmentResultPopupOpen: false,
      isEndoscopeDepartmentResultPopupOpen: false,
      isRadiationDepartmentResultPopupOpen: false,
      isOutExamCooperationRequestOutputPopupOpen: false,
      isEmergencyReceptionPopupOpen: false,
      isReportCreatListPopupOpen: false,
      isAdminDiaryPopupOpen: false,
      isAdministrationDiaryPopupOpen: false,     
      isInpatientContactListPopupOpen: false,
      isPatientsSchedulePopupOpen: false,
      isMovePlanPatientListPopupOpen: false,
      isHospitalPatientBarcodePrintPopupOpen: false,
      isPatientCertificationPopupOpen: false,
      isNurseSummaryListPopupOpen: false,
      isVisitNurseSummaryListPopupOpen:false,
      isNurseAssignmentPopupOpen: false,
      isOutInjectionPatientListPopupOpen: false,
      isMedicationGuidanceSchedulePopupOpen: false,
      isProgressChartPopup: false,      
      report_creat_list_type:"",
    };
    this._mounted = false;
    this.modal_show_flag = 0;
  }

  async componentDidMount () {
    this._mounted = true;
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    let currentSystem = this.enableHaruka(initState);
    this.context.$updateCurrentSystem(currentSystem);
    if (this.context.bookmarksList.length <= 0 || this.context.linkHistoryList.length <= 0) {      
      // お気に入りメニュー取得
      this.getBookmarksInfor(currentSystem);
      this.getLinkHistoryInfor(currentSystem);
      this.getFavouriteHistoryType();
    }
    
    this.context.$updateAuths(
      this.state.authInfo.feature_auth === undefined
        ? ""
        : this.state.authInfo.feature_auth,
      this.state.authInfo.common_auth === undefined
        ? ""
        : this.state.authInfo.common_auth
    );
    auth.refreshAuth(location.pathname+location.hash);
    this.context.$updateAuths(
      this.state.authInfo.feature_auth === undefined
        ? ""
        : this.state.authInfo.feature_auth,
      this.state.authInfo.common_auth === undefined
        ? ""
        : this.state.authInfo.common_auth
    );


    if(currentSystem === "haruka"){
    if(this.context.consentedFromNav === true){
        this.setState({
            hasNotConsentedData: true
        }, ()=>{
            this.context.$updateConsentedFromNav(false);
        });
    }
    }

    // ■YJ781 ログイン時画面・ホームボタン関連の修正
    let home_special_modal_open = JSON.parse(localApi.getValue("home_special_modal_open"));
    if (home_special_modal_open != undefined && home_special_modal_open != null) {
      let menu_item = home_special_modal_open;
      if (menu_item.id != undefined && menu_item.id != null) {

        localApi.remove("home_special_modal_open");
        
        let temp_url = "";
        if (menu_item.name == "グループスケジュール登録") {
          temp_url = "visit_treatment_group";
        } else if(menu_item.name == "スケジュール登録") {
          temp_url = "visit_treatment_patient";
        } else if(menu_item.name == "予約登録") {
          temp_url = "reservation_create";
        }
        if (temp_url != "") {        
          let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
          if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
            await this.getDoctorsList();
            this.context.$selectDoctor(true);
            this.modal_show_flag = 1;
            this.setState({          
              modal_url: temp_url
            });
          } else {
            this.showModalByCategory(temp_url);
          }
        }
      }
    }

    let home_normal_modal_open = JSON.parse(localApi.getValue("home_normal_modal_open"));
    if (home_normal_modal_open != undefined && home_normal_modal_open != null) {
      let menu_item = home_normal_modal_open;
      if (menu_item.id != undefined && menu_item.id != null) {
        localApi.remove("home_normal_modal_open");

        if(menu_item.name == "放射線検査予定一覧"){
          this.setState({
            isOpenModal: false,
            isRadiationReservationListPopupOpen:true,
          });
          return;
        }
        if(menu_item.name == "薬品情報検索"){
          this.setState({
            isOpenModal: false,
            isChemicalInformationSearchPopupOpen:true,
          });
          return;
        }
        if(menu_item.name == "栄養指導"){
          this.setState({
            isOpenModal: false,
            isNutritionGuidanceSlipTotalPopupOpen:true,
          });
          return;
        }
        if(menu_item.name == "生理検査予定一覧"){
          this.setState({
            isOpenModal: false,
            isInspectionReservationListPopupOpen:true,
          });
          return;
        }
        if(menu_item.name == "内視鏡検査予定一覧"){
          this.setState({
            isOpenModal: false,
            isEndoscopeReservationListPopupOpen:true,
          });
          return;
        }
        if(menu_item.name == "病棟検体ラベル"){
          this.setState({
            isOpenModal: false,
            isWardLabelPopupOpen:true,
          });
          return;
        }
        if(menu_item.name == "生理検査予約状況一覧"){
          this.setState({
            isOpenModal: false,
            isInspectionStatusListPopupOpen:true,
          });
          return;
        }
        if(menu_item.name == "endoscope_status_list"){
          this.setState({
            isOpenModal: false,
            isEndoscopeStatusListPopupOpen:true,
          });
          return;
        }
        if(menu_item.name == "放射線予約状況一覧"){
          this.setState({
            isOpenModal: false,
            isRadiationStatusListPopupOpen:true,
          });
          return;
        }
        if(menu_item.name == "生理検査科別統計"){
          this.setState({
            isOpenModal: false,
            isInspectionDepartmentResultPopupOpen:true,
          });
          return;
        }
        if(menu_item.name == "放射線統計"){
          this.setState({
            isOpenModal: false,
            isRadiationDepartmentResultPopupOpen:true,
          });
          return;
        }
        if(menu_item.name == "内視鏡科別統計"){
          this.setState({
            isOpenModal: false,
            isEndoscopeDepartmentResultPopupOpen:true,
          });
          return;
        }
        if(menu_item.name == "外注検査連携依頼出力"){
          this.setState({
            isOpenModal: false,
            isOutExamCooperationRequestOutputPopupOpen:true,
          });
          return;
        }
        if(menu_item.name == "救急受付"){
          this.setState({
            isOpenModal: false,
            isEmergencyReceptionPopupOpen:true,
          });
          return;
        }
        if(menu_item.id == 299 || menu_item.id == 452 || menu_item.id == 453 || menu_item.id == 454 || menu_item.id == 455){
          let report_creat_list_type = "";
          switch (menu_item.id){
            case 299:
              break;
            case 452:
              report_creat_list_type = "rehabily";
              break;
            case 453:
              report_creat_list_type = "radiation";
              break;
            case 454:
              report_creat_list_type = "inspection";
              break;
            case 455:
              report_creat_list_type = "endoscope";
              break;
          }
          this.setState({
            isOpenModal: false,
            isReportCreatListPopupOpen:true,
            report_creat_list_type,
          });
          return;
        }
        if(menu_item.name == "看護日誌統計") {
          this.setState({
            isOpenModal: false,
            isAdminDiaryPopupOpen:true,
          });
          return;
        }
        if(menu_item.name == "管理日誌メニュー") {
          this.setState({
            isOpenModal: false,
            isAdministrationDiaryPopupOpen:true,
          });
          return;
        }        
        if(menu_item.name == "入院連絡患者一覧"){
          this.setState({
            isOpenModal: false,
            isInpatientContactListPopupOpen:true,
          });
          return;
        }
        if(menu_item.name == "処置注射患者一覧"){
          this.setState({
            isOpenModal: false,
            isOutInjectionPatientListPopupOpen:true,
          });
          return;
        }
        if(menu_item.name == "看護師業務分担"){
          this.setState({
            isOpenModal: false,
            isNurseAssignmentPopupOpen:true,
          });
          return;
        }
        if(menu_item.name == "患者スケジュール"){
          this.setState({
            isOpenModal: false,
            isPatientsSchedulePopupOpen:true,
          });
          return;
        }
        if(menu_item.name == "移動予定患者一覧"){
          this.setState({
            isOpenModal: false,
            isMovePlanPatientListPopupOpen:true,
          });
          return;
        }
        if(menu_item.name == "入院患者バーコード印刷"){
          this.setState({
            isOpenModal: false,
            isHospitalPatientBarcodePrintPopupOpen:true,
          });
          return;
        }
        if(menu_item.name == "患者認証業務"){
          this.setState({
            isOpenModal: false,
            isPatientCertificationPopupOpen:true,
          });
          return;
        }
        if(menu_item.name == "看護サマリー一覧"){
          this.setState({
            isOpenModal: false,
            isNurseSummaryListPopupOpen:true,
          });
          return;
        }
        if (menu_item.name == '訪問看護サマリー一覧'){
          this.setState({
            isOpenModal: false,
            isVisitNurseSummaryListPopupOpen:true,
          });
          return;
        }
        if(menu_item.name == "服薬指導スケジュール"){
          this.setState({
            isOpenModal: false,
            isMedicationGuidanceSchedulePopupOpen:true,
          });
          return;
        }
        if(menu_item.name == '入退院計画一覧'){
          this.setState({
            isOpenModal: false,
            isHospitalPlanListPopupOpen:true,
          });
          return;
        }
        if(menu_item.name == 'サマリ一覧'){
          this.setState({
            isOpenModal: false,
            isSummaryListPopupOpen:true,
          });
          return;
        }
        if(menu_item.name == '文書参照'){
          this.setState({
            isOpenModal: false,
            isDocumentReferencePopupOpen:true,
          });
          return;
        }
        if(menu_item.name == 'スキャナ一括取込（紙文書取込）'){
          this.setState({
            isOpenModal: false,
            isScannerBatchTakeDocPopupOpen:true,
          });
          return;
        }
        if(menu_item.name == '熱型表'){
          this.setState({
            isOpenModal: false,
            isProgressChartPopup:true,
          });
          return;
        }        
      }
    }
    
  }

  selectDoctorFromModal = (id, name) => {
    let department_name = "その他";
    this.state.doctors.map(doctor => {
      if (doctor.doctor_code === parseInt(id)) {
        if (doctor.diagnosis_department_name !== "") {
          department_name = doctor.diagnosis_department_name;
        }
      }
    });
    this.context.$updateDoctor(id, name, department_name);        
    this.context.$selectDoctor(false);
    if (this.modal_show_flag == 0) return;    
    this.showModalByCategory();    
  }

  showModalByCategory = (url = "") => {
    this.modal_show_flag = 0;
    let modal_url = url;
    if (modal_url == "") {
      modal_url = this.state.modal_url;
    }
    if(modal_url == 'visit_treatment_group'){
      localApi.setValue("visit_treatment_group_open", 1);
      this.props.history.replace("/visit/schedule");
    }
    if(modal_url == 'visit_treatment_patient'){      
      localApi.setValue("visit_treatment_patient_open", 1);
      this.props.history.replace("/visit/schedule");
    }
    if(modal_url == 'reservation_create'){
      localApi.setValue("reservation_create_modal_open", 1);
      this.props.history.replace("/reservation/schedule");
    }    
  }

  closeNotConsentedModal = () => {
    this.setState({ hasNotConsentedData: false });
  };

  getNotConsentedHistoryData = async () => {
    let cache_data = sessApi.getObject('prescription_consented_list');
    if (cache_data != undefined && cache_data != null) return cache_data;
    let params = {
      get_consent_pending: 1
    };
    return await apiClient.get("/app/api/v2/order/prescription/patient", {
      params: params
    });
  };

  getNotConsentedInjectionHistoryData = async () => {
    let cache_data = sessApi.getObject('injection_consented_list');
    if (cache_data != undefined && cache_data != null) return cache_data;
    let params = {
      get_consent_pending: 1
    };
    return await apiClient.get("/app/api/v2/order/injection/find", {
      params: params
    });
  };

  getNotConsentedAllOrderHistoryData = async () => {
    let cache_data = sessApi.getObject('allOrder_consented_list');
    if (cache_data != undefined && cache_data != null) return cache_data;
    let params = {
      get_consent_pending: 1
    };
    return await apiClient.get("/app/api/v2/order/notConsented/findHistory", {
      params: params
    });
  };

  systemConfirmOk() {
    this.setState({
      hasNotConsentedData: true
    });
    this.context.$setUnconsentedConfirmed(true);
    this.setState({confirm_message: ""});
  }

  systemConfirmCancel() {
    this.setState({confirm_message: ""});
  }

  enableHaruka = (initState) => {    
    if (initState == null || initState == undefined) {
      return "haruka";
    }    
    if(initState.enable_ordering_karte == 1) return "haruka";
    if(initState.enable_dialysis == 1) return "dialysis";
    return "haruka";
  };

  getDoctorsList = async () => {
    let data = sessApi.getDoctorList();
    if(data == null) {
      data = await apiClient.get("/app/api/v2/secure/doctor/search?");
    }
    // let data = await apiClient.get("/app/api/v2/secure/doctor/search?");
    this.setState({ doctors: data }, ()=>{
      this.context.$selectDoctor(true);
    });
  };

  closeDoctor = () => {
    this.modal_show_flag = 0;
    this.context.$selectDoctor(false);    
  }

  getDoctor = e => {
    this.selectDoctorFromModal(e.target.id, e.target.getAttribute("label"));
  }

  closeModal = () => {
    this.setState({
      isScannerBatchTakeDocPopupOpen: false,
      isHospitalPlanListPopupOpen: false,
      isSummaryListPopupOpen: false,
      isDocumentReferencePopupOpen: false,
      isRadiationReservationListPopupOpen: false,
      isChemicalInformationSearchPopupOpen: false,
      isNutritionGuidanceSlipTotalPopupOpen: false,
      isInspectionReservationListPopupOpen: false,
      isEndoscopeReservationListPopupOpen: false,
      isWardLabelPopupOpen: false,
      isInspectionStatusListPopupOpen: false,
      isEndoscopeStatusListPopupOpen: false,
      isRadiationStatusListPopupOpen: false,
      isInspectionDepartmentResultPopupOpen: false,
      isEndoscopeDepartmentResultPopupOpen: false,
      isRadiationDepartmentResultPopupOpen: false,
      isOutExamCooperationRequestOutputPopupOpen: false,
      isEmergencyReceptionPopupOpen: false,
      isReportCreatListPopupOpen: false,
      isAdminDiaryPopupOpen: false,
      isAdministrationDiaryPopupOpen: false,     
      isInpatientContactListPopupOpen: false,
      isPatientsSchedulePopupOpen: false,
      isMovePlanPatientListPopupOpen: false,
      isHospitalPatientBarcodePrintPopupOpen: false,
      isPatientCertificationPopupOpen: false,
      isNurseSummaryListPopupOpen: false,
      isVisitNurseSummaryListPopupOpen:false,
      isNurseAssignmentPopupOpen: false,
      isOutInjectionPatientListPopupOpen: false,
      isMedicationGuidanceSchedulePopupOpen: false,
      isProgressChartPopup: false,      
      report_creat_list_type:"",
    })
  };

  goToPage = (url) => {    
    this.props.history.replace(url);
  }

  render() {
    return (
      <PatientsWrapper>
        <div className="div-top">
        </div>
        {this.state.hasNotConsentedData && (
          <NotConsentedModal
            patiendId={0}
            fromPatient={true}
            closeNotConsentedModal={this.closeNotConsentedModal}
          />
        )}
        {this.state.confirm_message !== "" && (
        <SystemConfirmModal
            hideConfirm= {this.systemConfirmCancel.bind(this)}
            confirmCancel= {this.systemConfirmCancel.bind(this)}
            confirmOk= {this.systemConfirmOk.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.doctors != undefined && this.context.needSelectDoctor === true && (
          <SelectDoctorModal
            closeDoctor={this.closeDoctor}
            getDoctor={this.getDoctor}
            selectDoctorFromModal={this.selectDoctorFromModal}
            doctors={this.state.doctors}
          />
        )}
        {this.state.isHospitalPlanListPopupOpen && (
          <HospitalPlanList
            closeModal={this.closeModal}
          />
        )}
        {this.state.isSummaryListPopupOpen && (
          <SummaryList
            closeModal={this.closeModal}
            goKartePage = {this.goKartePage}
          />
        )}
        { this.state.isDocumentReferencePopupOpen && (
          <DocumentReference
            closeModal={this.closeModal}
          />
        )}
        { this.state.isScannerBatchTakeDocPopupOpen && (
          <ScannerBatchTakeDoc
            closeModal={this.closeModal}
          />
        )}
        { this.state.isChemicalInformationSearchPopupOpen && (
          <ChemicalInformationSearch
            closeModal={this.closeModal}
          />
        )}
        { this.state.isNutritionGuidanceSlipTotalPopupOpen && (
          <NutritionGuidanceSlipTotal
            closeModal={this.closeModal}
          />
        )}
        { this.state.isInspectionReservationListPopupOpen && (
          <InspectionReservationListModal
            closeModal={this.closeModal}
          />
        )}
        { this.state.isRadiationReservationListPopupOpen && (
          <RadiationReservationListModal
            closeModal={this.closeModal}
          />
        )}
        { this.state.isInspectionStatusListPopupOpen && (
          <InspectionStatusList
            closeModal={this.closeModal}
          />
        )}
        { this.state.isEndoscopeStatusListPopupOpen && (
          <EndoscopeStatusListModal
            closeModal={this.closeModal}
          />
        )}
        { this.state.isRadiationStatusListPopupOpen && (
          <RadiationStatusListModal
            closeModal={this.closeModal}
          />
        )}
        { this.state.isEndoscopeReservationListPopupOpen && (
          <EndoscopeReservationListModal
            closeModal={this.closeModal}
          />
        )}
        { this.state.isWardLabelPopupOpen && (
          <WardLabel
            closeModal={this.closeModal}
          />
        )}
        { this.state.isInspectionDepartmentResultPopupOpen && (
          <InspectionDepartmentResultModal
            closeModal={this.closeModal}
          />
        )}
        { this.state.isRadiationDepartmentResultPopupOpen && (
          <RadiationDepartmentResultModal
            closeModal={this.closeModal}
          />
        )}
        { this.state.isEndoscopeDepartmentResultPopupOpen && (
          <EndoscopeDepartmentResultModal
            closeModal={this.closeModal}
          />
        )}
        { this.state.isOutExamCooperationRequestOutputPopupOpen && (
          <OutExamCooperationRequestOutputModal
            closeModal={this.closeModal}
          />
        )}
        { this.state.isEmergencyReceptionPopupOpen && (
          <EmergencyReceptionModal
            closeModal={this.closeModal}
          />
        )}
        { this.state.isReportCreatListPopupOpen && (
          <ReportCreatListModal
            closeModal={this.closeModal}
            goToPage = {this.goToPage}
            report_creat_list_type = {this.state.report_creat_list_type}
          />
        )}
        { this.state.isAdminDiaryPopupOpen && (
          <AdminDiaryModal
            closeModal={this.closeModal}
            goToPage = {this.goToPage}
          />
        )}
        { this.state.isAdministrationDiaryPopupOpen && (
          <AdministrationDiaryMenuModal
            closeModal={this.closeModal}
            goToPage = {this.goToPage}
          />
        )}
        { this.state.isInpatientContactListPopupOpen && (
          <InpatientContactList
            closeModal={this.closeModal}
          />
        )}
        { this.state.isOutInjectionPatientListPopupOpen && (
          <OutInjectionPatientModal
            closeModal={this.closeModal}
            goKartePage = {this.goKartePage}
          />
        )}
        { this.state.isNurseAssignmentPopupOpen && (
          <NurseAssignment
            closeModal={this.closeModal}
          />
        )}
        { this.state.isPatientsSchedulePopupOpen && (
          <PatientsSchedule
            closeModal={this.closeModal}
          />
        )}
        { this.state.isMovePlanPatientListPopupOpen && (
          <MovePlanPatientList
            closeModal={this.closeModal}
          />
        )}
        { this.state.isHospitalPatientBarcodePrintPopupOpen && (
          <HospitalPatientBarcodePrint
            closeModal={this.closeModal}
          />
        )}
        { this.state.isPatientCertificationPopupOpen && (
          <PatientCertification
            closeModal={this.closeModal}
          />
        )}
        { this.state.isNurseSummaryListPopupOpen && (
          <NurseSummaryList
            closeModal={this.closeModal}
          />
        )}
        { this.state.isVisitNurseSummaryListPopupOpen && (
          <VisitNurseSummaryList
            closeModal={this.closeModal}
          />
        )}
        { this.state.isMedicationGuidanceSchedulePopupOpen && (
          <MedicationGuidanceSchedule
            closeModal={this.closeModal}
          />
        )}              
        {this.state.isProgressChartPopup &&  (
          <ProgressChart
            closeModal={this.closeModal}
          />
        )}                                             
      </PatientsWrapper>
    );
  }
}
Top.contextType = Context;
Top.propTypes = {
  history: PropTypes.object
};

export default Top;
