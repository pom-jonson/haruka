import React, { Component } from "react";
import styled from "styled-components";
// import OperationPanel from "../../organisms/OperationPanel";
import enhance from "./@enhance";
import * as methods from "./SOAP/methods";
import PropTypes from "prop-types";
import LeftBox from "./SOAP/components/LeftBox";
import MiddleBox from "./SOAP/components/MiddleBox";
import RightBox from "./SOAP/components/RightBox";
import Context from "~/helpers/configureStore";
import SelectDoctorModal from "./components/SelectDoctorModal";
import SelectPatientSoapModal from "./components/SelectPatientSoapModal";
import EndExaminationModal from "../../organisms/EndExaminationModal";
import { SOAP_TREE_CATEGORY, TREE_FLAG } from "../../../helpers/constants";
import {
  surface,
  error,
  secondary,
  disable
} from "../../_nano/colors";
import {CACHE_LOCALNAMES, CACHE_SESSIONNAMES, KARTEMODE} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as karteApi from "~/helpers/cacheKarte-utils";
import { patientModalEvent } from "~/events/PatientModalEvent";
import auth from "~/api/auth";
import SelectModeModal from "~/components/templates/Patient/SelectModeModal"
import * as apiClient from "~/api/apiClient";

// import ResizePanel from "react-resize-panel";
import PanelGroup from "./PanelGroup/PanelGroup";
import * as localApi from "~/helpers/cacheLocal-utils";
import * as patientApi from "~/helpers/cachePatient-utils";

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

  .soap-data,
  .soap-data-item {
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
    &.deleted {
      color: #ff0000;

      textarea {
        color: #ff0000;
      }
    }
    &.doned {
      color: #0000ff;
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
class EmergencyKarte extends Component {
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
        categoryType: -1,
        selYear:-1,
        selMonth:-1,
        selDay:-1,
        openStatus:{
          iSoap: 1,
          iPrescription: 1,
          iInjection: 1,
          eSoap: 1,
          ePrescription: 1,
          eInjection: 1,
          iExamination: 1,
          eExamination: 1,
          iInspection: 1,
          eInspection: 1,
          iTreatment: 1,
          eTreatment: 1,
        },
        activeOperation: 'soap',
        show_list_condition:'',
        patientInfo: {}, // getPatientInfo
        soapList: [],   // getKarteTree
        soapTrees: [],  // getKarteTree
        soapOriginalList: [],
        usageData: [],
        doctors: [],
        isForUpdate: false,
    };
    // this.setState({
    //   isLoadData: false,        
    //   confirm_msg_act: "",
    //   confirm_msg_index: 0,
    //   confirm_msg_type: "",
    //   showModal: false,
    //   isOpenDoctorSoapModal: false,
    // });
    this.m_department_code = -1;
    this.middleRef_call_flag = 0;

    this.middleRef = React.createRef();
    this.rightRef = React.createRef();
    this.autoLogoutModalShow = false;
    this.changeState = false;
    this.changeProps = false;
    this.leftBoxRef = React.createRef();
    this.selected_date=undefined;
  }

  async componentDidMount () { 
    //-------------------HARUKA--------------------------//
    if (this.context.currentSystem == "haruka") {
      // return;
      // モーダル表示
      let menu_item = localApi.getObject("select_menu_info");
      if (menu_item != undefined && menu_item != null && menu_item.has_modal != null && menu_item.has_modal == 1 && this.context.$getKarteMode(this.props.patientId)  != KARTEMODE.READ) {
        if (menu_item.ele.url == "physiological" || menu_item.ele.url == "endoscope") {
          this.emitPatientModalEvent("clickOpenPhysiologicalPopup", menu_item);
          // patientModalEvent.emit("clickOpenPhysiologicalPopup", menu_item);
          // event.stopPropagation();                      
        }
        if (menu_item.ele.url == "openExamination") {
          this.emitPatientModalEvent("clickOpenExaminationPopup", menu_item);
          // patientModalEvent.emit("clickOpenExaminationPopup", menu_item);
          // event.stopPropagation();              
        }
        if (menu_item.ele.url == "outpatient") {
          this.emitPatientModalEvent("clickOpenOutpatientPopup", menu_item);
          // patientModalEvent.emit("clickOpenOutpatientPopup", menu_item);
          // event.stopPropagation();              
        }
        if (menu_item.ele.url == "instruction_book") {
          this.emitPatientModalEvent("clickOpenInstructionBookPopup", menu_item);                    
        }
        if (menu_item.ele.url == "instruction_book_list") {
          this.emitPatientModalEvent("clickOpenInstructionBookListPopup", menu_item);                    
        }
        if (menu_item.ele.url == "allergy") {
          this.emitPatientModalEvent("clickOpenAllergyPopup", menu_item);
          // patientModalEvent.emit("clickOpenOutpatientPopup", menu_item);
          // event.stopPropagation();              
        }
        if (menu_item.ele.url == "guidance") {
            this.emitPatientModalEvent("clickOpenGuidancePopup", menu_item);
        }
        if (menu_item.ele.url == "visit_treatment_group") {
            this.emitPatientModalEvent("clickOpenVisitTreatmentGroupPopup", menu_item);
        }
        if (menu_item.ele.url == "rehabilitation") {
            this.emitPatientModalEvent("clickOpenRehabilyPopup", menu_item);
        }
        if (menu_item.ele.url == "home") {
            this.emitPatientModalEvent("clickOpenHomePopup", menu_item);
        }
        if (menu_item.ele.url == "spirit") {
            this.emitPatientModalEvent("clickOpenSpiritPopup", menu_item);
        }
        if (menu_item.ele.url == "radiation") {
          this.emitPatientModalEvent("clickOpenRadiationPopup", menu_item);
        }
        if (menu_item.ele.url == "diseaseName") {
          this.emitPatientModalEvent("clickOpenPatientDiseaseNamePopup", menu_item);
        }
        if (menu_item.ele.url == "home_treatment") {
            this.emitPatientModalEvent("clickOpenHomeTreatmentPopup", menu_item);
        }
        if (menu_item.ele.url == "hospital_treatment") {
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

        if (menu_item.ele.url == "hospital_application_order") {
          this.emitPatientModalEvent("clickOpenHospitalApplicationOrder", menu_item);          
        }
        
        if (menu_item.ele.url == "hospital_dicision_order") {
          this.emitPatientModalEvent("clickOpenHospitalDecisionOrder", menu_item);          
        }

        if (menu_item.ele.url == "discharge_permit_order") {
          this.emitPatientModalEvent("clickOpenDischargePermitOrder", menu_item);          
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
            // this.emitPatientModalEvent("clickOpenPacsPopup", menu_item);
            let patientInfo = karteApi.getPatient(this.props.match.params.id);
            if(patientInfo == undefined || patientInfo == null) return;

            // YJ34 PACS機能の修正
          let current_system_patient_id = localApi.getValue("current_system_patient_id");
          current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
          patientApi.setVal(current_system_patient_id, CACHE_LOCALNAMES.PAC_STATUS, JSON.stringify("on"));// 病名禁忌

            const url =
                "http://TFS-C054/01Link/start.aspx?UserID=miyakojima&Password=miyakojima&ApplicationID=1600&RedirectURL=PatID%3d" +
                patientInfo.receId;
            // window.open(url, "OpenPACS", "height=600,width=600");
              var params = [
                'height='+screen.height,
                'width='+screen.width,
                'fullscreen=yes', // only works in IE, but here for completeness
                'resizable=yes'
              ].join(',');
              window.open(url, "OpenPACS", params);
              this.PACSOn();
        }
        menu_item.has_modal = 0;
      }
    }
    //--------------------------------------------//
    let patient_id = this.props.match.params.id;
    if (patient_id == 0){
      setTimeout(()=>{
          this.setState({
            selectPatient: true
          });
      }, 500);
      return;
    }

    // this.getDoctorsList();
    let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
    if (init_status != null && init_status != undefined && init_status.doctors_list != undefined && init_status.doctors_list != null) {
      this.setState({
        doctors: init_status.doctors_list
      });
    }

    // middlebox scroll
    karteApi.setVal(this.props.match.params.id, CACHE_LOCALNAMES.SOAP_PAGE_NUMBER, 0);

    let bFlag = false;
    if(this.context.$canDoAction(this.context.FEATURES.SOAP, this.context.AUTHS.REGISTER) || this.context.$canDoAction(this.context.FEATURES.SOAP, this.context.AUTHS.REGISTER_PROXY)){
      bFlag = true;
    }     
    if(!bFlag)
      this.props.history.replace(`/patients/${this.props.match.params.id}/prescription`);


    this.m_department_code = this.context.department.code;
    // get 患者情報
    await this.getPatientInfor();

    this.setTimeOutFunc();
  }

  setTimeOutFunc = async() => {
      let isCallFirstKarteData = localApi.getValue('isCallFirstKarteData');
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
      }
      localApi.remove('isCallFirstKarteData');
      await this.getCurrentKarteTree({
          patient_id: this.props.match.params.id,
          medical_department_code: this.context.department.code
      }, false);
      if(this.selected_date !== undefined){
          this.changeSoapList(1, 0, 0, 0, -1);
      }

      //覧モードの際、登録や編集等が行われていないか定期的にチェックして更新するように
      if(this.context.$getKarteMode(this.props.patientId) === KARTEMODE.READ){
          this.karteInterval = setInterval(()=>{
              this.checkKarteData()
          }, 5*60*1000)
      }

      const persistState = karteApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.SOAP_EDIT);
      if (persistState !== undefined
          && persistState !== null) {
          this.setState({
              soapData: persistState.data,
              isForUpdate: persistState.isForUpdate,
              updateIndex: persistState.updateIndex,
              isForSave: persistState.isForSave
          });
      }
      auth.refreshAuth(location.pathname+location.hash);

      var path = window.location.href;
      if (path.includes("exam=1")) {
          this.emitPatientModalEvent("clickOpenExaminationPopup", "1");
      }

      this.setState({
          isLoaded: true
      });
      this.getAllKarteTree({
          patient_id: this.props.match.params.id,
          medical_department_code: this.context.department.code
      }, false);
      this.getPresetDoPrescription(this.props.match.params.id, this.context.selectedDoctor.code);
  };
  // UNSAFE_componentWillMount () {
  // }

  // UNSAFE_componentWillReceiveProps(nextProps) {    
  // }

  // UNSAFE_componentWillUpdate(nextProps, nextState) {
  // }
  // componentDidUpdate(prevProps, prevState) {
  // }

  shouldComponentUpdate(nextprops, nextstate) {
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
    if(this.autoLogoutModalShow != this.context.autoLogoutModalShow){
      this.autoLogoutModalShow = this.context.autoLogoutModalShow
      return false;
    }
    this.changeState = JSON.stringify(this.state) != JSON.stringify(nextstate);
    this.changeProps = JSON.stringify(this.props) != JSON.stringify(nextprops);
    this.autoLogoutModalShow = this.context.autoLogoutModalShow;    


    // var str_ret = JSON.stringify(this.state) != JSON.stringify(nextstate);
    // return str_ret;
    return true;
  }

  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   this.setState({
  //     soapList: nextProps.soapList
  //   })
  // }
  
  componentWillUnmount (){
    clearInterval(this.karteInterval);
  }

  emitPatientModalEvent = (key, param1, param2, isExistCache=true) => {
    if (key == "edit_modal") {
      let param = {
        key: param1,
        stampKey: param2,
        isExistCache:isExistCache,
      };
      patientModalEvent.emit("edit_modal", param);
    } else {
      patientModalEvent.emit(key, param1);
    }
  }

  closeModal = () => this.setState({ modalVisible: false, isSending: false});
  cancelExamination = (url) => this.props.history.replace(url);
  PACSOn = () => this.setState({ pacsOn: true });
  PACSOff = () => this.setState({ pacsOn: false });

  handleRegisterSoap = (soap) => {
    soap.system_patient_id = this.props.match.params.id;
    this.sendRegisterSoap(soap);
  }

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
    if(this.state.cur_url === '/last_prescription_soap'){ //前回処方
        let systemPatientId = this.state.cur_patient_id;
        let url_path = 'soap';
        let his = this.props.history;
        this.setState({
            isOpenDoctorSoapModal: false,
            cur_url:'',
        });
        this.getLastPrescription(systemPatientId, this.context.department.code == 0 ? 1 : this.context.department.code).then(function(value){
            if(value) {
                his.replace(`/patients/${systemPatientId}/${url_path}`);
            }
        });
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
          this.middleRef.current.contextMenuAction(this.state.confirm_msg_act, this.state.confirm_msg_index, 1);
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

  updateSoap = (soap, index) => {
    let actionFlag = false;
      
    if(this.context.$canDoAction(this.context.FEATURES.SOAP, this.context.AUTHS.EDIT) || this.context.$canDoAction(this.context.FEATURES.SOAP, this.context.AUTHS.EDIT_PROXY)){ // edit
      actionFlag = true;        
    }             

    if(!actionFlag){
      window.sessionStorage.setItem("alert_messages", "権限がありません。");
      return;
    }
    let userInfo = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.HARUKA));
    const presDataStr = JSON.stringify({
      user_number: userInfo.user_number,
      system_patient_id: this.props.match.params.id,
      data: soap,
      isForUpdate: true,
      updateIndex: index,
      isForSave: true
    });
    // window.sessionStorage.setItem("haruka_soap_current_edit", presDataStr);
    // patientCacheApi.setVal("session", this.props.match.params.id, CACHE_SESSIONNAMES.PATIENT_SOAP_EDIT, presDataStr);
    karteApi.setVal(this.props.match.params.id, CACHE_LOCALNAMES.SOAP_EDIT, presDataStr, 'insert');
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
        this.setState({
          bOpenCurrentSoap:setVal,          
        });
        break;
      case SOAP_TREE_CATEGORY.ALL_SOAP:
        this.setState({
          bOpenAllSoap:setVal,         
        });        
        break;
      case SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER:
        this.setState({
          bOpenAllExecuteOrder:setVal,         
        });        
        break;
      case SOAP_TREE_CATEGORY.GROUP_EXAMINATION:
        // if (setVal == true) {
        //   this.setState({
        //     bOpenGroupExamination:setVal,         
        //     bOpenCurrentExamination: true,
        //   });
        // } else {
        //   this.setState({
        //     bOpenGroupExamination:setVal,         
        //     bOpenCurrentExamination: false,
        //     bOpenGlobalExamination: false,
        //   });
        // }              
        this.setState({
          bOpenGroupExamination:setVal,         
        });        
        break;
      case SOAP_TREE_CATEGORY.CURRENT_EXAMINATION:
        this.setState({
          bOpenCurrentExamination:setVal,         
        });        
        break;
      case SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION:
        this.setState({
          bOpenGlobalExamination:setVal,         
        });        
        break;
      case SOAP_TREE_CATEGORY.ALL_ORDER:
        this.setState({
          bOpenAllOrder:setVal,          
        });
        break;
      case SOAP_TREE_CATEGORY.ALL_EXAMINATION:
        this.setState({
          bOpenAllExamination:setVal,        
        });
        break;
      case SOAP_TREE_CATEGORY.ALL_INSPECTION:
        this.setState({
          bOpenAllInspection:setVal,        
        });
        break;
      case SOAP_TREE_CATEGORY.ALL_TREATMENT:
        this.setState({
          bOpenAllTreatment:setVal,        
        });
        break;
      case SOAP_TREE_CATEGORY.ALL_REHABILY:
        this.setState({
          bOpenAllRehabily:setVal,        
        });
        break;
      case SOAP_TREE_CATEGORY.ALL_RADIATION:
        this.setState({
          bOpenAllRadiation:setVal,        
        });
        break;
      case SOAP_TREE_CATEGORY.ALL_SOAP_TAG:
        this.setState({
          bOpenAllSoapTag:setVal,
        });
        break;
      case SOAP_TREE_CATEGORY.SEARCH_CONDITION:
        this.setState({
          bOpenSearchCondition:setVal,
        });
        break;
      case SOAP_TREE_CATEGORY.CURRENT_SOAP_LATEST:
        this.setState({
          bOpenCurrentSoapLatest:setVal
        });
        break;
      case SOAP_TREE_CATEGORY.ALL_SOAP_LATEST:
        this.setState({
          bOpenAllSoapLatest:setVal
        });
        break;
      case SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER_LATEST:
        this.setState({
          bOpenAllExecuteOrderLatest:setVal
        });
        break;
      case SOAP_TREE_CATEGORY.CURRENT_EXAMINATION_LATEST:
        this.setState({
          bOpenCurrentExaminationLatest:setVal
        });
        break;
      case SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION_LATEST:
        this.setState({
          bOpenGlobalExaminationLatest:setVal
        });
        break;
      case SOAP_TREE_CATEGORY.ALL_ORDER_LATEST:
        this.setState({
          bOpenAllOrderLatest:setVal
        });
        break;
      case SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST:
        this.setState({
          bOpenAllExaminationLatest:setVal
        });
        break;
      case SOAP_TREE_CATEGORY.ALL_INSPECTION_LATEST:
        this.setState({
          bOpenAllInspectionLatest:setVal
        });
        break;
      case SOAP_TREE_CATEGORY.ALL_TREATMENT_LATEST:
        this.setState({
          bOpenAllTreatmentLatest:setVal
        });
        break;
      case SOAP_TREE_CATEGORY.ALL_REHABILY_LATEST:
        this.setState({
          bOpenAllRehabilyLatest:setVal
        });
        break;
      case SOAP_TREE_CATEGORY.ALL_RADIATION_LATEST:
        this.setState({
          bOpenAllRadiationLatest:setVal
        });
        break;
      case SOAP_TREE_CATEGORY.ALL_SOAP_TAG_LATEST:
        this.setState({
          bOpenAllSoapTagLatest:setVal
        });
        break;
    }    
  }

  setOpenStatus = (key, val) => {
    this.setState({
      openStatus:{
        ...this.state.openStatus,
        [key]: val
      }
    });
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
    
    this.setState({selectPatient: false});
    let system_before_page = localApi.getValue('system_before_page');
    this.props.history.replace(system_before_page != "" ? system_before_page : "/top");
  };

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
      // patientModalEvent.emit("clickOpenPhysiologicalPopup", "1");
    } else { // page
      let url_path = menu_item.ele.url;
      // 在宅処方、在宅注射の場合 karte status: 訪問診療
      if (menu_item.ele.url == "/home_prescription" || menu_item.ele.url == "/home_injection") {
        this.context.$updateKarteStatus(2, "訪問診療");
        if (menu_item.ele.url == "/home_prescription") url_path = "prescription";
        if (menu_item.ele.url == "/home_injection") url_path = "injection";
      }
      if (menu_item.ele.url == "/hospitalize_prescription") {
        this.context.$updateKarteStatus(1, "入院");
        url_path = "prescription";              
      }
      if (menu_item.ele.url == "/prescription" || menu_item.ele.url == "/injection") {
        this.context.$updateKarteStatus(0, "外来");              
      } 
      if (menu_item.ele.url == "/prescription" || menu_item.ele.url == "/injection" || menu_item.ele.url == "/soap" || menu_item.ele.url == "/inspection") {
        url_path = menu_item.ele.url.substring(1, menu_item.ele.url.length);
      }
      if(menu_item.ele.url == "/last_prescription_soap"){
          url_path = "soap";
          if(this.context.$getKarteMode(this.props.patientId) == KARTEMODE.READ){
              this.props.history.replace(`/patients/${systemPatientId}/${url_path}`);
          } else {
              let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
              if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
                  let data = sessApi.getDoctorList();
                  if(data == null) {
                      data = await apiClient.get("/app/api/v2/secure/doctor/search?");
                  }
                  // let data = await apiClient.get("/app/api/v2/secure/doctor/search?");
                  this.setState({
                      doctors: data,
                      cur_url:"/last_prescription_soap",
                      cur_patient_id:systemPatientId,
                      isOpenDoctorSoapModal: true,
                  });
                  return;
              } else {
                  let his = this.props.history;
                  this.getLastPrescription(systemPatientId, this.context.department.code == 0 ? 1 : this.context.department.code).then(function(value){
                      if(value) {
                          his.replace(`/patients/${systemPatientId}/${url_path}`);
                      }
                  });
              }
          }
      } else {
          this.props.history.replace(`/patients/${systemPatientId}/${url_path}`);
      }
    }
  };

  changeLeftSoapList = (department, year, month, date, nCategoryType) => {
    karteApi.setVal(this.props.match.params.id, CACHE_LOCALNAMES.SOAP_PAGE_NUMBER, 0);
    window.sessionStorage.setItem('soap_scroll_top', 0);
    karteApi.delVal(this.props.match.params.id, CACHE_LOCALNAMES.MIDDLE_ORDER_OPEN);
    this.changeSoapList(department, year, month, date, nCategoryType);
  }

  saveConfirmMessage = (act, index, type = "middlebox_right_click") => {
    if(act === "last_prescription"){ //前回処方
        this.setState({
            cur_url:"/last_prescription_soap",
            cur_patient_id:this.props.match.params.id,
            isOpenDoctorSoapModal: true,
        });
    } else {
        this.setState({
            confirm_msg_index: index,
            confirm_msg_act: act,
            confirm_msg_type: type,
            isOpenDoctorSoapModal: true
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
        allTags,
    });
  }

  setImportance =(soapIndex, importance_level)=>{
    let soapList = this.state.soapList;
    soapList[soapIndex]['importance_level'] = importance_level;
    this.setState({soapList,});
  }

  goToDropPage = (url="") => {
    if (url == "") return;
    this.props.history.replace(url);  
  }

  copyInspection = (nIndex) => {
    this.rightRef.current.dropSoapEvent(nIndex);
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
                  medical_department_code: this.context.department.code
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
  }

  render() {
    if (this.m_department_code != -1 && this.m_department_code !== this.context.department.code && this.props.match.params.id > 0) {
      this.m_department_code = this.context.department.code;
      karteApi.delVal(this.props.match.params.id, CACHE_LOCALNAMES.MIDDLE_ORDER_OPEN);
      this.setState({
        isLoaded: false
      },()=>{
        this.getCurrentKarteTree({
          patient_id: this.props.match.params.id,
          medical_department_code: this.context.department.code
        }, true);
        this.getAllKarteTree({
            patient_id: this.props.match.params.id,
            medical_department_code: this.context.department.code
        });
      });
    }

    return (
      <div className="hello">
        <PrescriptionWrapper>          
          <Wrapper>
            <PanelGroup borderColor="#DDD" spacing={2}
                        panelWidths={[
                            {size: 370, minSize:300, resize: "dynamic"},
                            {minSize:400, resize: "stretch"},
                            {size: 450, minSize:370, resize: "dynamic"}
                        ]}
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
                    bOpenAllOrderLatest={this.state.bOpenAllOrderLatest}
                    bOpenAllExaminationLatest={this.state.bOpenAllExaminationLatest}
                    bOpenAllInspectionLatest={this.state.bOpenAllInspectionLatest}
                    bOpenAllTreatmentLatest={this.state.bOpenAllTreatmentLatest}
                    bOpenAllRehabilyLatest={this.state.bOpenAllRehabilyLatest}
                    bOpenAllRadiationLatest={this.state.bOpenAllRadiationLatest}
                    bOpenAllSoapTagLatest={this.state.bOpenAllSoapTagLatest}
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
                    setOpenClose={this.setOpenClose}
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
                />
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
                    rightOpenStatus={this.state.openStatus}
                    setOpenStatus={this.setOpenStatus}
                    setForUpdate={this.setForUpdate}
                    showModal={this.emitPatientModalEvent}
                    getSoapPrescriptionDelData={this.getSoapPrescriptionDelData}
                    getSoapInjectionDelData={this.getSoapInjectionDelData}
                    goToDropPage={this.goToDropPage}
                    getLastPrescription={this.getLastPrescription}
                />
            </PanelGroup>
            {this.context.autoLogoutModalShow === false &&
              this.state.doctors != undefined &&
            this.state.isOpenDoctorSoapModal === true ? (
              <SelectDoctorModal
                closeDoctor={this.closeDoctorModal}
                getDoctor={this.getDoctor}
                selectDoctorFromModal={this.selectDoctorFromModal}
                doctors={this.state.doctors}
              />
            ) : (
              ""
            )}
            {this.context.autoLogoutModalShow === false &&
              this.state.selectPatient == true ? (
              <SelectPatientSoapModal
                closeModal={this.closePatient}
                handleOk={this.setPatient}
              />
            ) : (
              ""
            )}
            {this.state.showMdoal && (
                <SelectModeModal
                    patientInfo={this.state.patientInfo}
                />
            )}
            {this.state.modalVisible && (
              <EndExaminationModal
                patientId={this.props.match.params.id}
                patientInfo={this.state.patientInfo}
                visible={this.state.modalVisible}
                sendPrescription={this.sendKarte}
                closeModal={this.closeModal}
                cancelExamination={this.cancelExamination}
                pacsOn={this.state.pacsOn}
                PACSOff={this.PACSOff}
                isSending={this.state.isSending}
				getMessageSendKarte={this.getMessageSendKarte}
				goKartePage={this.goKartePage}
              />
            )}
          </Wrapper>
          {/*<OperationPanel
            openModal={this.openModal}
            patientId={this.state.patientInfo.receId}
            PACSOn={this.PACSOn}
            onSelectDoctor={this.onSelectDoctor}
            activeLink={this.state.activeOperation}
            changeOperationTab={this.changeOperationTab}     
            gotoPage={this.gotoPage}       
           />*/}

        </PrescriptionWrapper>
      </div>      
    );
  }
}

EmergencyKarte.contextType = Context;

EmergencyKarte.propTypes = {
  patientInfo: PropTypes.object.isRequired,
  patientId: PropTypes.number.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.node
    }).isRequired
  }).isRequired,
  history: PropTypes.object
};
export default EmergencyKarte;