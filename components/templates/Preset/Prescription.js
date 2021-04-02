import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Title from "../../atoms/Title";
import TitleTabs from "../../organisms/TitleTabs";
import Context from "~/helpers/configureStore";
import MedicineSetDataSelection from "../../organisms/MedicineSetDataSelection";
//import PresetTable from "../../organisms/PrescribeTable";
import PresetTable from "../../organisms/PresetTable";
import Button from "../../atoms/Button";
import * as colors from "../../_nano/colors";

import Remarks from "../../organisms/Remarks";
import Calc from "../../molecules/Calc";
import BodyParts from "../../molecules/BodyParts";
import DropModal from "../../molecules/DropModal";
import AlertModal from "../../molecules/AlertModal";
//import enhance from "./@enhance";
import SelectUsageModal from "./components/SelectUsageModal";
import SelectDoctorModal from "./components/SelectDoctorModal";
import InOutNav from "../../organisms/InOutNav";
import EndExaminationModal from "../../organisms/EndExaminationModal";
import NotConsentedModal from "../../organisms/NotConsentedModal";
// import * as methods from "../Patient/PrescriptionMethods";
import * as methods from "./methods";
import { getCurrentDate } from "../../../helpers/date";
import { persistedState } from "../../../helpers/cache";
import auth from "~/api/auth";
import DiagnosisModal from "../../organisms/DiagnosisModal";
import DiagnosisRpModal from "../../organisms/DiagnosisRpModal";
import {CACHE_SESSIONNAMES, PERMISSION_TYPE} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";

const PrescriptionWrapper = styled.div`
  width: 100%;
  padding-top: 12px;
`;

const PrescriptionMain = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  width: 100%;
`;

const Col = styled.div`
  width: 48%;
`;

const WrapperContainer = styled.div`
  max-height: calc(100vh - 260px);
  overflow: auto;
`;

const InputBox = styled.div`
  display: flex;
  margin-left: 0px;
  width: 80%;
  label {    
    color: ${colors.onSecondaryDark};
    font-size: 14px;
    line-height: 38px;
    letter-spacing: 0.4px;
    margin-right: 12px;
    width: 80px;
  }
  input {
    border-radius: 4px;
    border: solid 1px #ced4da;
    background: ${colors.surface};
    color: ${colors.onSecondaryDark};    
    font-size: 12px;
    padding: 0 8px;
    width: 70%;
    height: 38px;
    margin-left: 12px;
  }
  input::-ms-clear {
    visibility: hidden;
  }
`;

const Flex = styled.div`
  background: ${colors.background};
  display: flex;
  align-items: center;
  padding: 4px 0;
  position: relative;  
  width: 100%;
  z-index: 100;
  .label-title {
    text-align: right;
    width: auto;
    margin: 0 8px 0 24px;
  }
  select {
    width: 120px;
  }
  label {
    margin: 0;
  }
  button {
    background-color: ${colors.surface};
    min-width: 80px;
    margin-left: 24px;
  }
`;


//@enhance
class Prescription extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );   
    this.m_medicine = []; 
    this.m_indexOfInsertPres = 0;
    this.m_indexOfInsertMed = 0;
    this.japic_alert_reject = 1;
    let conf_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "conf_data");
    if(conf_data != undefined && conf_data != null && conf_data.japic_alert_reject != undefined && conf_data.japic_alert_reject != null && conf_data.japic_alert_reject != ""){
      this.japic_alert_reject = conf_data.japic_alert_reject;
    }
  }

  getDepartment = e =>
    this.setState(
      { department: e.target.value, departmentId: e.target.id },
      function() {
        this.storeDataInCache();
      }
    );
  getPsychoReason = e =>
    this.setState(
      { psychotropic_drugs_much_reason: e.target.value },
      function() {
        this.storeDataInCache();
      }
    );
  getFreeComment = e =>
    this.setState({ free_comment: e.target.value }, function() {
      this.storeDataInCache();
    });
  getPoulticeReason = e =>
    this.setState({ poultice_many_reason: e.target.value }, function() {
      this.storeDataInCache();
    });
  closeUsage = () => this.setState({ usageModal: false, usageOpen: false });
  selectInOut = e =>
    this.setState({ inOut: parseInt(e.target.id) }, function() {
      this.storeDataInCache();
    });
  selectTitleTab = e => {
    this.setState({ titleTab: parseInt(e.target.id) });
  };
  closeModal = () => this.setState({ modalVisible: false, isSending: false });
  cancelExamination = () => this.props.history.replace("/patients");
  allPrescriptionOpen = () =>
    this.setState({ allPrescriptionOpen: !this.state.allPrescriptionOpen });
  PACSOn = () => this.setState({ pacsOn: true });
  PACSOff = () => this.setState({ pacsOn: false });
  openNotConsentedModal = () =>
    this.setState({ isNotConsentedModalOpen: true });
  closeNotConsentedModal = () =>
    this.setState({ isNotConsentedModalOpen: false });
  refreshNotConsented = () => this.props.history.replace("/patients");
  getdoubleDigestNumer = number => ("0" + number).slice(-2);
  getTabId = id =>
    this.setState({ tab: parseInt(id) }, function() {
      this.storeDataInCache();
    });
  closeBodyParts = () =>
    this.setState({ isBodyPartOpen: false, indexOfEditPres: -1 });
  openBodyParts = index =>
    this.setState({ isBodyPartOpen: true, indexOfEditPres: index });
  dayCancel = () =>
    this.setState({ isDaysOpen: false, daysInitial: 0, daysLabel: "" });
  handleClose = () =>
    this.setState({
      isAmountOpen: false,
      isDaysOpen: false,
      daysInitial: 0,
      daysLabel: "",
      daysSuffix: "",
      showedPresData: {
        medicineName: ""
      }
    });
  getDoctor = async (e) => {
    this.selectDoctorFromModal(e.target.id, e.target.getAttribute("label"));    
    this.setState(
      {
        isLoaded: false
      });  

    await this.getSetData(e.target.id, this.context.department.code, 0, 0); 
  }
  handleClick = () => {
    this.sendRegisterSetData();
  }
  handleChange = (e) => {
    this.setState({
      preset_name: e.target.value
    });
  } 
  handleEditOrder = prescription => {       
    this.setState({
      isForUpdate:true,
      preset_name: prescription.preset_name
    });       

    
    this.editOrders(prescription);
  }
  handleDeleteOrder = prescription => {           
    this.deleteOrders(prescription.preset_number);
  }
  onDragOver = e => {
    e.preventDefault();
  };
  showDiagnosisPermission = (rpIdx, medIdx) => {
    let diagnosisData =  {};
    diagnosisData[rpIdx] = [medIdx];
    this.setState({
      diagnosisModal: true,
      diagnosisData: diagnosisData,
    });
  }

  diagnosisOK = () => {
    let rpIdx = 0;
    let medIdx = 0;
    Object.keys(this.state.diagnosisData).map(key=>{
      rpIdx = parseInt(key);
      medIdx = this.state.diagnosisData[key][0];
    });

    let original = this.state.presData;
    original[rpIdx].medicines[medIdx].diagnosis_permission = 1;

    // let origithis.state.presData
    this.setState({      
      diagnosisModal: false,
      diagnosisData: {},
      insertMedicineFlag : true,
      presData : original,
    }, function() {
      this.storeDataInCache();      
    });
  }

  diagnosisCancel = () => {
    this.setState({      
      diagnosisModal: false,
      diagnosisData: {},
      insertMedicineFlag : true,
    });
  }

  diagnosisOrderOK = () => {
    let diagnosisOrder = this.state.diagnosisOrderData;
    let presData = this.state.presData;

    Object.keys(diagnosisOrder).map(rpIdx=>{
      diagnosisOrder[rpIdx].map(medIdx=>{
        presData[rpIdx].medicines[medIdx].diagnosis_permission = 1;                
      });
    });    


    this.setState({
      diagnosisOrderModal: false,
      diagnosisOrderData: {},
      messageType: "",
      presData : presData,
    }, function(){
      this.storeDataInCache();
    });
  }

  hideModal = () => {
    this.setState({
      insertMedicineFlag: false,
      hideDuplicateModal: true,
      modalType: "",
      bgMedicine: "",
    });
    this.amountCancel();
  }

  stepOneCancel = () => {
    this.setState({
      insertMedicineFlag: false,
      hideDuplicateModal: true,
      modalType: "",
      bgMedicine: "",
    });    
    this.amountCancel();
  }

  stepOneOk = () => {
    this.setState({
      insertMedicineFlag: false,
      hideDuplicateModal: true,
      modalType: ""
    });
    if(this.state.modalType === "Duplicate"){
      this.setState({
        insertStep: 1
      });
      this.insertMed(this.m_medicine, this.m_indexOfInsertPres, this.m_indexOfInsertMed);
    }
  }

  stepTwoCancel = () => {
    this.setState({
      insertMedicineFlag: false,
      hideDuplicateModal: true,
      modalType: "",      
      bgMedicine: "",
    });
    this.amountCancel();
  }

  stepTwoOk = () => {  
    if (this.state.modalType !== "OnlyAlert") {
      this.insertMed(this.m_medicine, this.m_indexOfInsertPres, this.m_indexOfInsertMed, false);
    }
    this.setState({
      hideDuplicateModal: true,
      modalType: "",
      insertStep: 0
    });    
  }

  dropCancel = () => {
    this.setState({
      dropStep: 0,
      dropOrderList: [],
      duplicateList: [],
      rejectList: [],
      alertList: [],
      dropText: ""
    });
  }

  dropOneOk = () => {
    if(this.state.rejectList.length > 0) {
      this.dropCancel();
      return;
    }
    if(this.state.duplicateList.length > 0) {
      let _existReject = false;
      this.state.duplicateList.map(item=>{
        if (item.if_duplicate == "reject") {
          _existReject = true;
        }
      })
      if (_existReject) {
        this.dropCancel();
        return;
      }
    }  

    if(this.state.alertList.length === 0) {
      this.setState({
        dropStep: 0,
        dropOrderList: [],
        duplicateList: [],
        rejectList: [],
        alertList: [],        
      });
      this.dropRun();
    } else {
      this.setState({
        dropStep: 2,
      });      
    }
  }

  dropTwoOk = () => {
    this.setState({
      dropStep: 0,
      dropOrderList: [],
      duplicateList: [],
      rejectList: [],
      alertList: [],        
    });
    this.dropRun();
  }

  dropRun = () => {
    this.onDrop(this.state.dropText);   
    // //set start date
    // if(this.state.startDate) return;

    // const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    // let tmpDepartmentId = this.context.department.code;
    // let offset_date = 0;
    // for (let [key, value] of Object.entries(authInfo.default_prescription_start_date_offset)) {
    //   if(tmpDepartmentId == key){
    //     offset_date = value;
    //     break;
    //   }
    // }
    // var today = new Date();
    // var newDate = new Date();
    // newDate.setDate(today.getDate()+offset_date);
    // let date = newDate.getDate();
    // let month = newDate.getMonth() + 1;
    // let year = newDate.getFullYear();
    // let dateResult = "";
    // let tmpMonth = month < 10 ? `0${month}`: `${month}`;
    // let tmpDate = date < 10 ? `0${date}`: `${date}`;
    // dateResult = `${year}${tmpMonth}${tmpDate}`;
    // this.setState({startDate: dateResult});
  }

  diagnosisOrderCancel = () => {
    this.setState({
      diagnosisOrderModal: false,
      messageType: "",
      diagnosisOrderData: {}
    });
  }

  sendDiagnosisCancel = () => {
    this.setState({
      sendDiagnosisModal : false,
      sendDiagnosisOrderData :  {}
    });
  }
  sendDiagnosisOK = () => {
    this.setState({
      sendDiagnosisModal : false,
      diagnosis_valid : 1, 
      sendDiagnosisOrderData :  {}
    }, function(){
      this.sendRegisterSetData();
    });
  }

  onDropEvent = e => {
    if(this.checkCanEdit(0) === true){
      // define drop order list
        let dropOrderList = this.getDropOrderList(e);  
        let duplicateList = [];
        let rejectList = [];
        let arr_IdList = [];
        let alertList = [];     
        dropOrderList.map(medicine => {
          if(arr_IdList.includes(medicine.item_number)) return;
          arr_IdList.push(medicine.item_number);
          if( !this.checkCanAddMedicine(medicine.item_number) ) {
            duplicateList.push(medicine);          
          }
          let reject = this.checkDropContraindicationReject(medicine);
          if(reject.length > 0){
            rejectList[medicine.item_number] = {item: medicine, reject,};
          }
          let alert = this.checkDropContraindicationAlert(medicine);
          if(alert.length > 0){
            alertList[medicine.item_number] = {item: medicine, alert};
          }
        });    

        if (duplicateList.length > 0) {
          this.setState({bgMedicine: "medicine_duplicate"});
        }  

        let step = 0;
        step = this.getDropModalStep(duplicateList, rejectList, alertList);  
        this.setState({
          dropStep: step,
          dropOrderList: dropOrderList,
          duplicateList: duplicateList,
          rejectList: rejectList,
          alertList: alertList,
          dropText: e.dataTransfer.getData("text")
        });

        e.preventDefault();
        if (step !== 0) {
          return;
        }

      this.onDrop(e.dataTransfer.getData("text"));
    }
  };

  getDropModalStep = (arrDuplicateList = [], arrRejectList = [], arrAlertList = []) => {
    if (arrRejectList.length == 0) {
      if (arrDuplicateList.length == 0){
        if (arrAlertList.length != 0) {
          this.setState({
            bgMedicine: "medicine_alert" 
          });
          return 2;
        }
        return 0;
      }else{
        let _existReject = false;
        arrDuplicateList.map(item=>{
          if (item.if_duplicate == "reject") {
            _existReject = true;
          }
        })
        if (_existReject == true) {
          return 1;
        }else{
          this.setState({
            bgMedicine: "medicine_alert" 
          });
          return 2;
        }
      }
    }
    return arrRejectList.length == 0 ? 0 : 1;
  }

  handleInsertMedicine = (medicine, indexOfInsertPres, indexOfInsertMed) => {
    if( !this.checkCanAddMedicine(medicine.code) ) {
      if (medicine.if_duplicate === "alert") {
        this.setState({showMedicineSelected: medicine.name + "は"});
        this.setState({showMedicineOrigin: ""});
        this.setState({hideDuplicateModal: false});   
        this.setState({showMedicineContent: "既に存在しますが追加しますか？"});
        this.setState({modalType: "Duplicate"});
      } else {
        this.setState({showMedicineSelected: medicine.name + "は"});
        this.setState({showMedicineOrigin: ""});
        this.setState({hideDuplicateModal: false});   
        this.setState({showMedicineContent: "既に存在するため追加できません。"});
        this.setState({modalType: "Notify"});
      }        
    }else{
      this.setState({
        insertStep: 1
      });
      this.insertMed(medicine, indexOfInsertPres, indexOfInsertMed);
    }
    this.m_medicine = medicine; 
    this.m_indexOfInsertPres = indexOfInsertPres;
    this.m_indexOfInsertMed = indexOfInsertMed;
    
  }

  componentDidUpdate() {
    if (
      document.getElementById("prescription_dlg") !== undefined &&
      document.getElementById("prescription_dlg") !== null
    ) {
      document.getElementById("prescription_dlg").focus();
    }
  }

  async componentDidMount() {
    this.resetState();
    window.localStorage.setItem("medicine_selection_wrapper_scroll", 0);
    window.localStorage.removeItem("haruka_edit_cache");
    this.context.$updatePageNumber(0);
    this.context.$updateStopGetHistory(false);          

    await this.getSetData(0, 0, 0, 1);
    await this.getHistoryData({
      id: this.props.match.params.id,
      limit: 10,
      offset: this.state.offset
    });
    this.setState({
      hideDuplicateModal: true,
      diagnosisModal: false,
      diagnosisData: {},
      diagnosisOrderModal: false,
      diagnosisOrderData: {},
      sendDiagnosisModal : false,
      sendDiagnosisOrderData :  {},
      diagonosis_valid : 0,
      insertStep: 0,
      dropStep: 0,
      dropOrderList: [],
      duplicateList: [],
      rejectList: [],
      alertList: [],
      dropText: "",
      showMedicineOrigin: "",
      showMedicineContent: "",
      showMedicineSelected: "",
      modalType: "",
      insertMedicineFlag: true,
      bgMedicine: "",
      messageType: "",        
    });

        this.getNotConsentedHistoryData();
        this.getDoctorsList();
        this.getUsageData();
        //this.getDiseaseList();
        this.context.$updateStaffCategory(this.state.staff_category);

        let presData = this.state.presData;
        presData[0].start_date = getCurrentDate();
        this.setState({
          departmentId: this.context.department.code,
          department: this.context.department.name,
          presData
        });
        // document.getElementById("2").click();
        // if (
        //   document.getElementById("prescription_dlg") !== undefined &&
        //   document.getElementById("prescription_dlg") !== null
        // ) {
        //   document.getElementById("prescription_dlg").focus();
        // }
        // this.getMedicineRankData({
        //   id: this.props.match.params.id
        // });

        let { cacheDelState } = persistedState();

        if (cacheDelState) {
          this.getDelData(cacheDelState);
        }

        this.state.medicineDBHistory.map(medicine => {
          if (medicine.history != "") {
            this.getTrackData(medicine.number);
          }
        });
        this.loadCachedData();
        this.getHistoryMoreData({
          id: this.props.match.params.id
        });
    auth.refreshAuth(location.pathname+location.hash);
  }

  checkPermissionByType = (rpIdx, medIdx, nType) => {    
    let selectedMedicine = this.state.presData[rpIdx].medicines[medIdx];

    // [区分]
    if (nType === PERMISSION_TYPE.DIAGNOSIS) {      
      let diagnosisData = {};
      diagnosisData[rpIdx] = [medIdx];
      this.setState({
        insertMedicineFlag: false,
        diagnosisModal: true,
        diagnosisData: diagnosisData
      });
    }

    // [用量]
    if (nType === PERMISSION_TYPE.USAGE) {      
      this.handleMedicineClick(rpIdx, medIdx);
    }

    // [禁忌]
    if (nType === PERMISSION_TYPE.DISEASE) {       
      this.setState({
        diseaseModal: true,
        messageType: "alert",
        diseaseData: selectedMedicine.disease_alert_content,
        insertMedicineFlag: false,
      });
    }

    // [重複]
    if (nType === PERMISSION_TYPE.DUPLICATE) {  
      let duplicateOrderData = {};
      this.state.presData.map((item, index)=>{
        item.medicines.filter((element,nIdx)=>{
          if (index == rpIdx && nIdx == medIdx) {
            return false;
          }else{
            return true;
          }
        }).map((ele,idx)=>{   
          if (ele.duplciate_permission != 0 && ele.medicineName == selectedMedicine.medicineName) {
            if (duplicateOrderData[index] == undefined) {
              duplicateOrderData[index] = [];
            }
            duplicateOrderData[index].push(idx);
          }
        });
      });
      this.setState({
        diagnosisOrderModal: true,
        messageType:"duplicate",
        diagnosisOrderData: duplicateOrderData
      });
    }

    // [併用]
    if (nType === PERMISSION_TYPE.ALERT) {  
      let result = this.checkMedicineContraindication(selectedMedicine);
      this.setState({
        hideDuplicateModal: false,
        modalType: "OnlyAlert",
        insertStep: result
      });
    }

  }

  render() {      
    const { indexOfInsertPres, indexOfInsertMed, presData } = this.state;
    const indexPres =
      indexOfInsertPres === -1 || indexOfInsertPres >= presData.length
        ? presData.length - 1
        : indexOfInsertPres;
    var indexMed =
      indexOfInsertMed === -1 ||
      indexOfInsertMed >= presData[indexPres].medicines.length
        ? presData[indexPres].medicines.length - 1
        : indexOfInsertMed;
    var units = [];
    const tabs = [      
      {
        id: 0,
        title: "セット"
      }
    ];
    if (presData[indexPres].medicines[indexMed] == undefined) {
      indexMed = presData[indexPres].medicines.length - 1;
    }
    if (presData[indexPres].medicines[indexMed].main_unit === undefined) {
      if (
        presData[indexPres].medicines[indexMed].units_list !== undefined &&
        presData[indexPres].medicines[indexMed].units_list.length > 0
      ) {
        units = presData[indexPres].medicines[indexMed].units_list;
      } else {
        units = [
          {
            name: presData[indexPres].medicines[indexMed].unit,
            main_unit_flag:
              presData[indexPres].medicines[indexMed].main_unit_flag
          }
        ];
      }
    } else {
      units = presData[indexPres].medicines[indexMed].units;
    }     

    let indexUsage = (this.state.indexOfEditPres == -1) ? this.state.presData.length - 1 : this.state.indexOfEditPres;
    
    
    return (
      <>
        <PrescriptionWrapper>
          <PrescriptionMain>
            <Col>
              <TitleTabs
                tabs={tabs}
                selectTitleTab={this.selectTitleTab}
                id={this.state.titleTab}
              />                           
              {this.state.titleTab == 0 && this.state.isLoaded === true && (
                <MedicineSetDataSelection
                  isLoaded={this.state.isLoaded} 
                  patientId={this.props.match.params.id}
                  allPrescriptionOpen={this.state.allPrescriptionOpen}
                  doctors={this.state.doctors}
                  doctor_code={this.context.selectedDoctor.code}
                  doctor_name={this.context.selectedDoctor.name}
                  setDoctorInfo={this.setDoctorInfo}
                  medicineHistory={this.state.medicineSetData}
                  consent={this.consent}
                  copyOrder={this.copyOrder}
                  copyOrders={this.copyOrders}
                  editOrders={this.handleEditOrder}
                  deleteOrders={this.handleDeleteOrder}
                />
              )}              
            </Col>
            <Col>
              <Title title={this.getOrderTitle()} />
              <Flex>
                <InputBox>
                  <label>セット名</label>
                  <input type="text"
                    onChange={this.handleChange}
                    value={this.state.preset_name}
                  />               
                </InputBox>
                <Button type="mono"
                  onClick={this.handleClick}
                >
                  登録
                </Button>              
              </Flex>
              <InOutNav
                selectInOut={this.selectInOut}
                id={this.state.inOut}
                unusedDrugSearch={this.state.unusedDrugSearch}
                profesSearch={this.state.profesSearch}
                normalNameSearch={this.state.normalNameSearch}
                getRadio={this.getRadio}
              />
              <WrapperContainer
                id="prescribe-container"
                onDrop={e => this.onDropEvent(e)}
                onDragOver={e => this.onDragOver(e)}
              >
                <PresetTable
                  patientInfo={this.state.patientInfo}
                  presData={this.state.presData}
                  confirm={this.confirm}
                  onSelectUsage={this.onSelectUsage}
                  insertMed={this.handleInsertMedicine}
                  changeAmountOrDays={this.changeAmountOrDays}
                  isForUpdate={this.state.isForUpdate}
                  doctors={this.state.doctors}
                  setDoctorInfo={this.setDoctorInfo}
                  doctor_code={this.context.selectedDoctor.code}
                  doctor_name={this.context.selectedDoctor.name}
                  unusedDrugSearch={this.state.unusedDrugSearch}
                  profesSearch={this.state.profesSearch}
                  normalNameSearch={this.state.normalNameSearch}
                  checkOptions={this.checkOptions}
                  resetPresData={this.resetPresData}
                  bodyPartData={this.state.bodyPartData}
                  storeDataInCache={this.storeDataInCache}
                  selectDoctorFromModal={this.selectDoctorFromModal}
                  openBodyParts={this.openBodyParts}
                  showDiagnosisPermission={this.showDiagnosisPermission}
                  checkPermissionByType={this.checkPermissionByType}
                  patientId={this.props.match.params.id}
                />
                <Title title="備考・その他" />
                <Remarks
                  inOut={this.state.inOut}
                  getRadio={this.getRadio}
                  getDepartment={this.getDepartment}
                  getPsychoReason={this.getPsychoReason}
                  getFreeComment={this.getFreeComment}
                  getPoulticeReason={this.getPoulticeReason}
                  departmentId={this.state.departmentId}
                  department={this.state.department} // 選択済の診療科
                  psychotropic_drugs_much_reason={
                    this.state.psychotropic_drugs_much_reason
                  }
                  poultice_many_reason={this.state.poultice_many_reason}
                  free_comment={this.state.free_comment}
                  bulk={this.state.bulk}
                  presData={this.state.presData}
                />
              </WrapperContainer>
            </Col>

            {this.context.autoLogoutModalShow === false &&
            this.state.usageOpen ? (
              <SelectUsageModal
                closeUsage={this.closeUsage}
                getUsage={this.getUsage}
                getUsageFromModal={this.getUsageFromModal}
                usageData={this.state.usageData}
                diagnosis_division = {this.state.presData[indexUsage].medicines[0].diagnosis_division}  
              />
            ) : (
              ""
            )}
            {this.context.autoLogoutModalShow === false &&
            this.context.needSelectDoctor === true ? (
              <SelectDoctorModal
                closeDoctor={this.closeDoctor}
                getDoctor={this.getDoctor}
                selectDoctorFromModal={this.selectDoctorFromModal}
                doctors={this.state.doctors}
              />
            ) : (
              ""
            )}
          </PrescriptionMain>          
          {this.context.autoLogoutModalShow === false &&
            this.state.isNotConsentedModalOpen === true &&
            this.state.staff_category === 1 && (
              <NotConsentedModal
                patientId={this.props.match.params.id}
                refresh={this.refreshNotConsented.bind(this)}
                closeNotConsentedModal={this.closeNotConsentedModal}
                fromPatient={false}
              />
            )}
        </PrescriptionWrapper>
        {this.state.modalVisible && (
          <EndExaminationModal
            patientInfo={this.state.patientInfo}
            visible={this.state.modalVisible}
            sendPrescription={this.sendPrescription}
            closeModal={this.closeModal}
            cancelExamination={this.cancelExamination}
            pacsOn={this.state.pacsOn}
            PACSOff={this.PACSOff}
            isSending={this.state.isSending}
            getMessageSendKarte={this.getMessageSendKarte}
			goKartePage={this.goKartePage}
          />
        )}
        {this.state.isAmountOpen ? (
          <Calc
            calcConfirm={this.amountConfirm}
            units={units}
            calcCancel={this.amountCancel}
            daysSelect={false}
            daysInitial={this.state.daysInitial}
            daysLabel=""
            daysSuffix=""
            usageData={this.state.usageData}
            bodyPartData={this.state.bodyPartData}
            showedPresData={this.state.showedPresData}
          />
        ) : (
          ""
        )}
        {this.context.autoLogoutModalShow === false &&
        this.state.isBodyPartOpen ? (
          <BodyParts
            bodyPartData={this.state.bodyPartData}
            closeBodyParts={this.closeBodyParts}
            usageName={
              this.state.presData[this.state.indexOfEditPres].usageName
            }
            body_part={
              this.state.presData[this.state.indexOfEditPres].body_part
            }
            bodyPartConfirm={this.bodyPartConfirm}
          />
        ) : (
          ""
        )}
        {this.state.isDaysOpen ? (
          <Calc
            calcConfirm={this.daysConfirm}
            units={[]}
            daysSelect={true}
            calcCancel={this.dayCancel}
            daysInitial={this.state.daysInitial}
            daysLabel={this.state.daysLabel}
            daysSuffix={this.state.daysSuffix}
            usageData={this.state.usageData}
          />
        ) : (
          ""
        )}
        {this.state.diagnosisModal === true && (
          <DiagnosisModal
            hideModal = {this.diagnosisCancel}
            diagnosisData = {this.state.diagnosisData}
            presData={this.state.presData}
            handleCancel = {this.diagnosisCancel}
            handleOk = {this.diagnosisOK}
            type={"medicine"}
          />       
        )}
        {this.state.sendDiagnosisModal === true && (
          <DiagnosisRpModal
            hideModal = {this.sendDiagnosisCancel}
            diagnosisData = {this.state.sendDiagnosisOrderData}
            presData={this.state.presData}
            handleCancel = {this.sendDiagnosisCancel}
            handleOk = {this.sendDiagnosisOK}
            messageType = {this.state.messageType}            
          />       
        )}
        {this.state.diagnosisOrderModal === true && (
          <DiagnosisRpModal
            hideModal = {this.diagnosisOrderCancel}
            diagnosisData = {this.state.diagnosisOrderData}
            presData={this.state.presData}
            handleCancel = {this.diagnosisOrderCancel}
            handleOk = {this.diagnosisOrderOK}
            messageType = {this.state.messageType}            
          />       
        )}
        {this.state.dropStep === 1 && (
          <DropModal
            hideModal = {this.dropCancel}
            duplicateList = {this.state.duplicateList}
            rejectList = {this.state.rejectList}
            alertList = {[]}
            modalType = {"stepDuplicateReject"}
            handleCancel = {this.dropCancel}
            handleOk = {this.dropOneOk}

          />        
        )}
        {this.state.dropStep === 2 && (
          <DropModal
            hideModal = {this.dropCancel}
            duplicateList = {this.state.duplicateList}
            rejectList = {[]}
            alertList = {this.state.alertList}
            modalType = {"stepAlert"}
            handleCancel = {this.dropCancel}
            handleOk = {this.dropTwoOk}

          />        
        )}
        {this.state.hideDuplicateModal === false && this.state.insertStep === 0 ? (
          <AlertModal
            hideModal = {this.hideModal}
            showMedicineOrigin = {this.state.showMedicineOrigin}
            showMedicineContent = {this.state.showMedicineContent}
            showMedicineSelected = {this.state.showMedicineSelected}
            modalType = {this.state.modalType}
            handleCancel = {this.stepOneCancel}
            handleOk = {this.stepOneOk}

          />
        ) : (
          ""
        )}
        {this.state.hideDuplicateModal === false && this.state.insertStep === 1 ? (
          <AlertModal
            hideModal = {this.hideModal}
            showMedicineOrigin = {this.state.showMedicineOrigin}
            showMedicineContent = {this.state.showMedicineContent}
            showMedicineSelected = {this.state.showMedicineSelected}
            modalType = {this.state.modalType}
            handleCancel = {this.stepTwoCancel}
            handleOk = {this.stepTwoOk}

          />
        ) : (
          ""
        )}
      </>
    );
  }
}
Prescription.contextType = Context;

Prescription.propTypes = {
  patientInfo: PropTypes.object.isRequired,
  patientId: PropTypes.number.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.node
    }).isRequired
  }).isRequired,
  history: PropTypes.object
};

export default Prescription;
