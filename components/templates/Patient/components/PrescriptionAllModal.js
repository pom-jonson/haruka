import React, { Component } from "react";
import PropTypes from "prop-types";
import Calc from "~/components/molecules/Calc";
import CalcDaysChange from "~/components/molecules/CalcDaysChange";
// import BodyParts from "~/components/molecules/BodyParts";
import BodyPartsOneLine from "~/components/molecules/BodyPartsOneLine";
import UsageOverModal from "~/components/molecules/UsageOverModal";
import DropModal from "~/components/molecules/DropModal";
import SelectUsageModal from "./SelectUsageModal";
import SelectDoctorModal from "./SelectDoctorModal";
import NotConsentedPrescriptionModal from "~/components/organisms/NotConsentedPrescriptionModal";
import AlertModal from "~/components/molecules/AlertModal";
import NoUnitOrderModal from "~/components/organisms/NoUnitOrderModal";
import ContraindicationToDiseaseModal from "~/components/organisms/ContraindicationToDiseaseModal";
import PeriodModal from "~/components/organisms/PeriodModal";
import DiagnosisModal from "~/components/organisms/DiagnosisModal";
import DiagnosisRpModal from "~/components/organisms/DiagnosisRpModal";
import UsageAlertModal from "~/components/organisms/UsageAlertModal";
import MedicineDetailModal from "~/components/organisms/MedicineDetailModal";
import DepartmentModal from "~/components/organisms/DepartmentModal";
import RegisterSetModal from "~/components/organisms/RegisterSetModal";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import PrescriptionConfirmModal from "./PrescriptionConfirmModal";
import SystemDeletePrescriptionModal from "~/components/molecules/SystemDeletePrescriptionModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import DeleteOperationConfirmModal from "~/components/molecules/DeleteOperationConfirmModal";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import AdministratePeriodInputModal from "~/components/molecules/AdministratePeriodInputModal";
import MedicinePeriodDuplicateModal from "~/components/molecules/MedicinePeriodDuplicateModal";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import PeriodSettingPrintModal from "~/components/templates/Patient/Modals/Prescription/PeriodSettingPrintModal";
import PrescriptionRankPrintModal from "~/components/templates/Patient/Modals/Prescription/PrescriptionRankPrintModal";

export class PrescriptionAllModal extends Component {
  constructor(props) {
    super(props);    
    this.state = {  
      cur_timestamp: new Date().getTime()  
    };
    this.cur_state = this.props.props_state;
    this.cur_modal_obj = this.props.modal_obj;
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.PrescriptionConfirmModalRef = React.createRef();
  }

  async componentDidMount() {
    
  }

  setModalVisible = (_state, _type, _presData=null) => { 
    switch(_type){
      case "PrescriptionConfirmModal":
        this.PrescriptionConfirmModalRef.current.callVisible(_state, _presData);
        break;
    }       
  }

  testPatientModalRender = (props_state, modal_obj) => {
    this.cur_state = props_state;
    this.cur_modal_obj = modal_obj;    
    this.setState({cur_timestamp: new Date().getTime()});
  }

  dropCancel = () => {
    let cur_modal_obj = this.cur_modal_obj;
    cur_modal_obj.dropStep = 0;
    cur_modal_obj.dropOrderList = [];
    cur_modal_obj.duplicateList = [];
    cur_modal_obj.rejectList = [];
    cur_modal_obj.alertList = [];
    cur_modal_obj.dropText = "";
    this.cur_modal_obj = cur_modal_obj;
    this.setState({
      cur_timestamp: new Date().getTime()
    });
    this.props.setModalObj(cur_modal_obj);
  }

  dropOneOk = () => {    
    let cur_modal_obj = this.cur_modal_obj; 
    if(cur_modal_obj.rejectList.length > 0) {
      this.dropCancel();
      return;
    }
    if(cur_modal_obj.duplicateList.length > 0) {
      let _existReject = false;
      cur_modal_obj.duplicateList.map(item=>{
        if (item.if_duplicate == "reject") {
          _existReject = true;
        }
      });
      if (_existReject) {
        this.dropCancel();
        return;
      }
    }

    if(cur_modal_obj.alertList.length === 0) {           
      cur_modal_obj.dropStep = 0;
      cur_modal_obj.dropOrderList = [];
      cur_modal_obj.duplicateList = [];
      cur_modal_obj.rejectList = [];
      cur_modal_obj.alertList = [];      
      this.props.dropRun();
    } else {            
      cur_modal_obj.dropStep = 2;
    }

    this.cur_modal_obj = cur_modal_obj;
    this.setState({
      cur_timestamp: new Date().getTime()
    });
    this.props.setModalObj(cur_modal_obj);
  }

  dropTwoOk = () => {
    let cur_modal_obj = this.cur_modal_obj;     
    cur_modal_obj.dropStep = 0;
    cur_modal_obj.dropOrderList = [];
    cur_modal_obj.duplicateList = [];
    cur_modal_obj.rejectList = [];
    cur_modal_obj.alertList = [];
    this.cur_modal_obj = cur_modal_obj;
    this.setState({
      cur_timestamp: new Date().getTime()
    });
    this.props.dropRun();
    this.props.setModalObj(cur_modal_obj);
  }

  stepOneCancel = () => {    
    let cur_modal_obj = this.cur_modal_obj;     
    cur_modal_obj.insertMedicineFlag = false;
    cur_modal_obj.hideDuplicateModal = true;
    cur_modal_obj.modalType = "";
    cur_modal_obj.bgMedicine = "";
    cur_modal_obj.isAmountOpen = false;
    cur_modal_obj.showedPresData = {
      medicineName: ""
    };
    cur_modal_obj.insertStep = 0;
    this.cur_modal_obj = cur_modal_obj;
    this.setState({cur_timestamp: new Date().getTime()});
    this.props.amountCancel();
    this.props.setModalObj(cur_modal_obj);
  }

  stepOneOk = () => {  
    let cur_modal_obj = this.cur_modal_obj;   
    cur_modal_obj.insertMedicineFlag = false;
    cur_modal_obj.hideDuplicateModal = true;
    if(cur_modal_obj.modalType === "Duplicate"){       
      cur_modal_obj.insertStep = 1;
      cur_modal_obj.modalType = "";
      this.cur_modal_obj = cur_modal_obj;    
      this.setState({
        cur_timestamp: new Date().getTime()
      },()=>{
        this.props.insertMedModal();
      });    
      // this.props.setModalObj(cur_modal_obj);
      return;
    } else if(cur_modal_obj.modalType === "Notify"){
      this.stepOneCancel();
      return;
    }
    cur_modal_obj.modalType = "";
    this.cur_modal_obj = cur_modal_obj;    
    this.setState({
      cur_timestamp: new Date().getTime()
    });    
    this.props.setModalObj(cur_modal_obj);
  }

  hideModal = () => {
    let cur_modal_obj = this.cur_modal_obj;
    cur_modal_obj.insertMedicineFlag = false;
    cur_modal_obj.hideDuplicateModal = true;
    cur_modal_obj.modalType = "";
    cur_modal_obj.bgMedicine = "";
    cur_modal_obj.isAmountOpen = false;
    cur_modal_obj.showedPresData = {
      medicineName: ""
    };
    cur_modal_obj.insertStep = 0;
    this.cur_modal_obj = cur_modal_obj;
    this.setState({
      cur_timestamp: new Date().getTime()
    });
    this.props.amountCancel();
    this.props.setModalObj(cur_modal_obj);
  }

  stepTwoCancel = () => {
    let cur_modal_obj = this.cur_modal_obj;
    cur_modal_obj.insertMedicineFlag = false;
    cur_modal_obj.hideDuplicateModal = true;
    cur_modal_obj.modalType = "";
    cur_modal_obj.bgMedicine = "";
    cur_modal_obj.isAmountOpen = false;
    cur_modal_obj.showedPresData = {
      medicineName: ""
    };
    cur_modal_obj.insertStep = 0;
    this.cur_modal_obj = cur_modal_obj;
    this.setState({
      cur_timestamp: new Date().getTime()
    });
   this.props.amountCancel();
   this.props.setModalObj(cur_modal_obj);
  }

  stepTwoOk = () => {  
    let cur_modal_obj = this.cur_modal_obj;    
    cur_modal_obj.hideDuplicateModal = true;
    cur_modal_obj.modalType = "";
    cur_modal_obj.insertStep = 0;
    this.cur_modal_obj = cur_modal_obj;
    // this.props.setModalObj(cur_modal_obj);
    this.setState({
      cur_timestamp: new Date().getTime()
    },()=>{      
      if (cur_modal_obj.modalType !== "OnlyAlert") {
        this.props.insertMedModal(false);
      }
    });
  }

  amountCancel = () => {
    let cur_modal_obj = this.cur_modal_obj;
    cur_modal_obj.isAmountOpen = false;
    cur_modal_obj.showedPresData = {
      medicineName: ""
    };
    cur_modal_obj.insertStep = 0;
    this.cur_modal_obj = cur_modal_obj;
    this.setState({
      cur_timestamp: new Date().getTime()
    });
    this.props.amountCancel();

    this.props.setModalObj(cur_modal_obj);
  }

  handleClose = () =>{
    let cur_modal_obj = this.cur_modal_obj;
    cur_modal_obj.isAmountOpen = false;
    cur_modal_obj.isDaysOpen = false;
    cur_modal_obj.daysInitial = 0;
    cur_modal_obj.daysLabel = "";
    cur_modal_obj.daysSuffix = "";
    cur_modal_obj.showedPresData = {
      medicineName: ""    
    };
    cur_modal_obj.changeDepartmentModal = false;
    cur_modal_obj.registerSetModal = false;

    this.cur_modal_obj = cur_modal_obj;
    this.setState({
      cur_timestamp: new Date().getTime()
    });

    this.props.setModalObj(cur_modal_obj);
  }

  closeBodyParts = () => {
    this.cur_modal_obj.isBodyPartOpen = false;
    this.cur_modal_obj.indexOfEditPres = -1;
    this.setState({
      cur_timestamp: new Date().getTime()
    });

    // if exist usage set from cache (cacheName: prescription_current_usage_cache, index of med: this.modal_obj.lastOrderIndex)
    let before_usage = window.localStorage.getItem("prescription_current_usage_cache");
    if (before_usage != null && before_usage != undefined) {      
      window.localStorage.removeItem("prescription_current_usage_cache");      
      before_usage = JSON.parse(before_usage);      
      this.props.setBeforeUsage(before_usage.usage, before_usage.index, "bodyParts");        
      // initialize before presData cache
    }

    this.props.setModalObj(this.cur_modal_obj); 
  }  

  dayCancel = () => {
    this.cur_modal_obj.isDaysOpen = false;
    this.cur_modal_obj.daysInitial = 0;
    this.cur_modal_obj.daysLabel = "";
    this.setState({
      cur_timestamp: new Date().getTime()
    });

    // if exist usage set from cache (cacheName: prescription_current_usage_cache, index of med: this.modal_obj.lastOrderIndex)
    let before_usage = window.localStorage.getItem("prescription_current_usage_cache");
    if (before_usage != null && before_usage != undefined) {      
      before_usage = JSON.parse(before_usage);      
      if (before_usage.usage[before_usage.index].require_body_parts != 1) {
        // initialize before presData cache
        window.localStorage.removeItem("prescription_current_usage_cache");
      }
      this.props.setBeforeUsage(before_usage.usage, before_usage.index);  
      // no requireBodyParts
    }

    this.props.setModalObj(this.cur_modal_obj);
  }

  diseaseOk = () => {
    this.cur_modal_obj.diseaseModal = false;
    this.cur_modal_obj.diseaseData = [];
    this.cur_modal_obj.messageType = "";
    this.cur_modal_obj.insertMedicineFlag = true;

    this.setState({
      cur_timestamp: new Date().getTime()
    });

    this.props.setModalObj(this.cur_modal_obj);       
  }

  notUnitCancel = () => {
    this.cur_modal_obj.notHasUnitModal = false;
    this.cur_modal_obj.notHasUnitMed = null;

    this.setState({
      cur_timestamp: new Date().getTime()
    });    

    this.props.setModalObj(this.cur_modal_obj);
  }

  diseaseCancel = () => {
    this.cur_modal_obj.diseaseModal = false;
    this.cur_modal_obj.messageType = "";
    this.cur_modal_obj.diseaseData = [];
    this.cur_modal_obj.isAmountOpen = false;
    this.cur_modal_obj.showedPresData = {
      medicineName: ""
    };
    this.cur_modal_obj.insertStep = 0;
    this.setState({
      cur_timestamp: new Date().getTime()
    });
    this.props.amountCancel();

    this.props.setModalObj(this.cur_modal_obj);
  }

  diseaseOrderCancel = () => {    
    this.cur_modal_obj.diseaseOrderModal = false;
    this.cur_modal_obj.diseaseOrderData = [];
    this.cur_modal_obj.diseaseOrder = [];
    this.setState({
      cur_timestamp: new Date().getTime()
    });

    this.props.setModalObj(this.cur_modal_obj);
  }

  diseaseOrderOk = () => {
    this.props.diseaseOrderOk();
  }

  diseasePrescriptionCancel = () => {
    this.cur_modal_obj.diseasePrescriptionModal =  false;
    this.cur_modal_obj.diseasePrescriptionData =  [];
    this.cur_modal_obj.diseasePrescription =  [];
    
    this.setState({
      cur_timestamp: new Date().getTime()
    });

    this.props.setModalObj(this.cur_modal_obj);
  }
  
  diseasePrescriptionOk = () => {
    this.props.diseasePrescriptionOk();
  }

  periodCancel = () => {
    this.cur_modal_obj.periodModal = false;
    this.cur_modal_obj.periodData = [];
    this.cur_modal_obj.insertMedicineFlag = false;
    this.cur_modal_obj.isAmountOpen = false;
    this.cur_modal_obj.showedPresData = {
      medicineName: ""
    };
    this.cur_modal_obj.insertStep = 0;

    this.setState({
      cur_timestamp: new Date().getTime()
    });

    this.props.amountCancel();      
    this.props.setModalObj(this.cur_modal_obj); 
  }

  periodOk = () => {
    this.cur_modal_obj.periodModal = false;
    this.cur_modal_obj.periodData = [];
    this.cur_modal_obj.insertMedicineFlag  = true;
    
    this.setState({
      cur_timestamp: new Date().getTime()
    });

    this.props.setModalObj(this.cur_modal_obj);  
  }

  periodOrderOk = () => {
    // this.cur_modal_obj.periodOrderModal = false;
    // this.cur_modal_obj.periodOrderData = [];
    // this.cur_modal_obj.periodOrder = [];

    this.props.periodOrderOk();    

    // this.setState({
    //   cur_timestamp: new Date().getTime()
    // });

    // this.props.setModalObj(this.cur_modal_obj);  
  }

  periodOrderCancel = () => {
    this.cur_modal_obj.periodOrderModal = false;
    this.cur_modal_obj.periodOrderData = [];
    this.cur_modal_obj.periodOrder = [];

    this.setState({
      cur_timestamp: new Date().getTime()
    });

    this.props.setModalObj(this.cur_modal_obj);   
  }

  periodPrescriptionOk = () => {
    // this.cur_modal_obj.periodPrescriptionModal = false;
    // this.cur_modal_obj.periodPrescriptionData = {};
    // this.cur_modal_obj.periodPrescription = [];
    
    this.props.periodPrescriptionOk();    

    // this.setState({
    //   cur_timestamp: new Date().getTime()
    // });

    // this.props.setModalObj(this.cur_modal_obj);   
  }

  handleUsageModal = () => {
    this.cur_modal_obj.usageAlertModal = false;
    this.cur_modal_obj.usageRpIdx = -1;
    this.cur_modal_obj.usageRpOrderIdx = -1;
    this.cur_modal_obj.isAmountOpen = false;
    this.cur_modal_obj.showedPresData = {
      medicineName: ""
    };
    this.cur_modal_obj.insertStep = 0;
    
    this.setState({
      cur_timestamp: new Date().getTime()
    });

    this.props.amountCancel();
    this.props.setModalObj(this.cur_modal_obj);
  }

  handleUsageOk = () => {
    // this.cur_modal_obj.usageAlertModal = false;
    
    // this.setState({
    //   cur_timestamp: new Date().getTime()
    // });

    this.props.handleUsageOk();      
    // this.props.setModalObj(this.cur_modal_obj); 

  }

  handleUsageDetail = () =>{
    // this.cur_modal_obj.usageMedDetailModal = true;

    // this.setState({
    //   cur_timestamp: new Date().getTime()
    // });

    this.props.handleUsageDetail();      
    // this.props.setModalObj(this.cur_modal_obj);     
  }

  handleUsageHide  = () => {
    this.cur_modal_obj.usageOverModal = false;
    this.cur_modal_obj.usageOverItem = [];
    
    this.setState({
      cur_timestamp: new Date().getTime()
    });

    this.props.setModalObj(this.cur_modal_obj);     
  }

  handleUsageOverOK = (chk) => {
    // this.cur_modal_obj.usageOverModal = false;
    // this.cur_modal_obj.usageOverItem = [];
    
    // this.setState({
    //   cur_timestamp: new Date().getTime()
    // });

    this.props.handleUsageOverOK(chk);      
    // this.props.setModalObj(this.cur_modal_obj);     
  }

  diagnosisCancel = () => {
    // this.cur_modal_obj.diagnosisModal = false;
    // this.cur_modal_obj.diagnosisData = {};
    // this.cur_modal_obj.insertMedicineFlag  = false;
   
    // this.setState({
    //   cur_timestamp: new Date().getTime()
    // });

    // this.props.setModalObj(this.cur_modal_obj);
    this.props.diagnosisCancel();      
  }

  diagnosisOK = () => {
    // this.cur_modal_obj.diagnosisModal = false;
    // this.cur_modal_obj.diagnosisData = {};
    // this.cur_modal_obj.insertMedicineFlag  = true;

    // this.setState({
    //   cur_timestamp: new Date().getTime()
    // });

    this.props.diagnosisOK();
    // this.props.setModalObj(this.cur_modal_obj);      
  }

  diagnosisOrderCancel = () => {
    // this.cur_modal_obj.diagnosisOrderModal = false;
    // this.cur_modal_obj.messageType = "";
    // this.cur_modal_obj.diagnosisOrderData = {};    

    // this.setState({
    //   cur_timestamp: new Date().getTime()
    // });

    this.props.diagnosisOrderCancel();
    // this.props.setModalObj(this.cur_modal_obj);       
  }

  diagnosisOrderOK = () => {
    // this.cur_modal_obj.diagnosisOrderModal = false;
    // this.cur_modal_obj.diagnosisOrderData = {};
    // this.cur_modal_obj.messageType = "";
   
    // this.setState({
    //   cur_timestamp: new Date().getTime()
    // });

    this.props.diagnosisOrderOK();
    // this.props.setModalObj(this.cur_modal_obj);        
  }

  handleUsageMedDetailCancel = () => {
    this.cur_modal_obj.usageMedDetailModal = false;
   
    this.setState({
      cur_timestamp: new Date().getTime()
    });

    this.props.setModalObj(this.cur_modal_obj);         
  }

  handleChangeDeparment = (code) => {
    this.cur_modal_obj.changeDepartmentModal = false;
    
    this.setState({
      cur_timestamp: new Date().getTime()
    });

    this.props.handleChangeDeparment(code);
    this.props.setModalObj(this.cur_modal_obj);         
  };

  handleRegisterSet = (strName) => {
    this.cur_modal_obj.registerSetModal = false;
    
    this.setState({
      cur_timestamp: new Date().getTime()
    });

    this.props.handleRegisterSet(strName);
    this.props.setModalObj(this.cur_modal_obj);         
  }

  confirmCancel = () => {    
    this.cur_modal_obj.confirm_message = "";
    this.cur_modal_obj.confirm_type = "";
   
    this.setState({
      cur_timestamp: new Date().getTime()
    });

    this.props.setModalObj(this.cur_modal_obj);          
  }

  confirmOk = () => {
    // this.cur_modal_obj.confirm_message = "";
    // this.cur_modal_obj.confirm_type = "";
   
    // his.setState({
    //   cur_timestamp: new Date().getTime()
    // });t

    this.props.confirmOk();
    // this.props.setModalObj(this.cur_modal_obj);             
  }

  closeUsage = () => {
    this.cur_modal_obj.usageModal = false;
    this.cur_modal_obj.usageOpen = false;
    this.cur_modal_obj.indexOfEditPres = -1;

    this.setState({
      cur_timestamp: new Date().getTime()
    });

    this.props.setModalObj(this.cur_modal_obj);             
  }

  changeAllRpDaysAmountCancel = () => {
    this.cur_modal_obj.change_all_rp_days = null;    

    this.setState({
      cur_timestamp: new Date().getTime()
    });

    this.props.setModalObj(this.cur_modal_obj);              
  }

  closeOpenPrescriptionConfirm = () => {
    // this.cur_modal_obj.isOpenPrescriptionConfirmModal = false;

    // this.setState({
    //   cur_timestamp: new Date().getTime()
    // });

    // this.props.setModalObj(this.cur_modal_obj);               
    this.setModalVisible(false, "PrescriptionConfirmModal");

  }

  closeDeleteModal = () => {
    this.cur_modal_obj.isPrescriptionDeleteConfirmOpen = false;    
    this.cur_modal_obj.deletedNumbers = 0;
    this.cur_modal_obj.deleteModalType = "";

    this.setState({
      cur_timestamp: new Date().getTime()
    });

    this.props.setModalObj(this.cur_modal_obj);               

  }

  closeDeleteCancelModal = () => {    
    this.cur_modal_obj.isPrescriptionDeleteCancelOpen = false;
    this.cur_modal_obj.deletedNumbers = 0;
    this.cur_modal_obj.deleteModalType = "";

    this.setState({
      cur_timestamp: new Date().getTime()
    });

    this.props.setModalObj(this.cur_modal_obj);               

  }

  closeNotConsentedModal = () =>{
    let cur_modal_obj = this.cur_modal_obj;
    
    cur_modal_obj.isNotConsentedModalOpen = false;    

    this.cur_modal_obj = cur_modal_obj;
    this.setState({
      cur_timestamp: new Date().getTime()
    });

    this.props.setModalObj(cur_modal_obj);
  }  

  prescriptionConfirmOk = () => {
    setTimeout(()=>{      
      this.props.prescriptionConfirmOk();
    }, 500);
  }

  cancelAlertModal = () => {
    let cur_modal_obj = this.cur_modal_obj;
    
    cur_modal_obj.alertMessage = "";    

    this.cur_modal_obj = cur_modal_obj;
    this.setState({
      cur_timestamp: new Date().getTime()
    });

    this.props.setModalObj(cur_modal_obj);
  }

  closeAdministratePeriodModal = () => {
    this.cur_modal_obj.isAdministratePeriodOpen = false;
    this.cur_modal_obj.indexOfEditPres = -1;
    this.setState({
      cur_timestamp: new Date().getTime()
    });

    this.props.setModalObj(this.cur_modal_obj);
  }

  closeMedicinePeriodDuplicateModal = () => {
    this.cur_modal_obj.isMedicinePeriodDuplicateOpen = false;
    this.cur_modal_obj.medicinePeriodDuplicateList = [];          
    this.setState({
      cur_timestamp: new Date().getTime()
    });

    this.props.setModalObj(this.cur_modal_obj);
  }  

  closeSelfModal = () => {
    this.cur_modal_obj.periodSettingPrintModal = null;  
    this.cur_modal_obj.periodSettingPrintTabId = null;  
    this.cur_modal_obj.periodSettingPrintTitle = null;  
    this.cur_modal_obj.prescriptionRankData = null;  
    this.cur_modal_obj.print_post_param = null;  
    this.setState({
      cur_timestamp: new Date().getTime()
    });

    this.props.setModalObj(this.cur_modal_obj);
  }

  render() {
    // let {cur_state, cur_modal_obj} = this.state;
    let cur_state = this.cur_state;
    let cur_modal_obj = this.cur_modal_obj;
    let indexPres =
      cur_state.indexOfInsertPres === -1 || cur_state.indexOfInsertPres >= cur_state.presData.length
        ? cur_state.presData.length - 1
        : cur_state.indexOfInsertPres;
    var indexMed =
      cur_state.indexOfInsertMed === -1 ||
      cur_state.indexOfInsertMed >= cur_state.presData[indexPres].medicines.length
        ? cur_state.presData[indexPres].medicines.length - 1
        : cur_state.indexOfInsertMed;        

    // 08/28 if have modal_obj variables (indexOfInsertPres, indexOfInsertMed)
    if (cur_modal_obj.indexOfInsertPres != undefined && 
      cur_modal_obj.indexOfInsertPres != null && 
      cur_modal_obj.indexOfInsertMed != undefined && 
      cur_modal_obj.indexOfInsertMed != null) {
      indexPres = cur_modal_obj.indexOfInsertPres;
      indexMed = cur_modal_obj.indexOfInsertMed;

      // initialize (indexOfInsertPres, indexOfInsertMed) : changeAmountOrDays
      cur_modal_obj.indexOfInsertPres = null;
      cur_modal_obj.indexOfInsertMed = null;
      this.props.setModalObj(cur_modal_obj);
    }
    

    var units = [];
    if (cur_state.presData[indexPres].medicines[indexMed] == undefined) {
      indexMed = cur_state.presData[indexPres].medicines.length - 1;
    }
    if (cur_state.presData[indexPres].medicines[indexMed].main_unit === undefined) {
      if (
        cur_state.presData[indexPres].medicines[indexMed].units_list !== undefined &&
        cur_state.presData[indexPres].medicines[indexMed].units_list.length > 0
      ) {
        units = cur_state.presData[indexPres].medicines[indexMed].units_list;
      } else {
        units = [
          {
            name: cur_state.presData[indexPres].medicines[indexMed].unit,
            main_unit_flag:
              cur_state.presData[indexPres].medicines[indexMed].main_unit_flag
          }
        ];
      }
    } else {
      units = cur_state.presData[indexPres].medicines[indexMed].units;
    }

    let indexUsage = cur_modal_obj.indexOfEditPres == -1 ? cur_state.presData.length - 1 : cur_modal_obj.indexOfEditPres;    
    return (
      <>    
        {cur_modal_obj.change_all_rp_days == 1 ? (
          <CalcDaysChange
            calcConfirm={this.props.changeAllRpDaysAmount}
            units={"日分"}
            calcCancel={this.changeAllRpDaysAmountCancel}
            daysSelect={true}
            daysInitial={0}
            daysLabel=""
            daysSuffix=""     
            maxAmount={90}         
            calcTitle="投与日数一括変更"            
          />
        ) : (
          ""
        )}          
        {cur_modal_obj.isAmountOpen && cur_modal_obj.hideDuplicateModal && cur_modal_obj.insertMedicineFlag ? (
          <Calc
            calcConfirm={this.props.amountConfirm}
            units={units}
            calcCancel={this.amountCancel}
            daysSelect={false}
            daysInitial={cur_modal_obj.daysInitial}
            daysLabel=""
            daysSuffix=""
            usageData={cur_modal_obj.usageData}
            bodyPartData={cur_state.bodyPartData}
            showedPresData={cur_modal_obj.showedPresData}
            zeroEnable={true}
          />
        ) : (
          ""
        )}
        {cur_modal_obj.isBodyPartOpen ? (
          <BodyPartsOneLine
            bodyPartData={cur_modal_obj.bodyPartData}
            closeBodyParts={this.closeBodyParts}
            usageCode={cur_state.presData[cur_modal_obj.indexOfEditPres].usage}
            usageName={
              cur_state.presData[cur_modal_obj.indexOfEditPres].usageName
            }
            body_part={
              cur_state.presData[cur_modal_obj.indexOfEditPres].body_part
            }
            bodyPartConfirm={this.props.bodyPartConfirm}
            modal_type={'prescription'}
          />          
        ) : (
          ""
        )}
        {cur_modal_obj.isAdministratePeriodOpen ? (
          <AdministratePeriodInputModal
            closeModal={this.closeAdministratePeriodModal}
            saveAdministratePeriod={this.props.saveAdministratePeriod}
            administrate_period={cur_state.presData[cur_modal_obj.indexOfEditPres] != undefined && cur_state.presData[cur_modal_obj.indexOfEditPres] != null ? cur_state.presData[cur_modal_obj.indexOfEditPres].administrate_period : null}
            type={"prescription"}
          />
        ) : (
          ""
        )}
        {cur_modal_obj.isMedicinePeriodDuplicateOpen && (
          <MedicinePeriodDuplicateModal
            closeModal={this.closeMedicinePeriodDuplicateModal}
            handleCancel={this.closeMedicinePeriodDuplicateModal}
            handleOk={this.props.handleMedicinePeriodDuplicateModal}
            duplicateList={cur_modal_obj.medicinePeriodDuplicateList}
            modalType={"prescription"}
          />
        )}
        {cur_modal_obj.isDaysOpen ? (
          <Calc
            calcConfirm={this.props.daysConfirm}
            units={[]}
            daysSelect={true}
            calcCancel={this.dayCancel}
            daysInitial={cur_modal_obj.daysInitial}
            daysLabel={cur_modal_obj.daysLabel}
            daysSuffix={cur_modal_obj.daysSuffix}
            usageData={cur_modal_obj.usageData}
          />
        ) : (
          ""
        )}
        {cur_modal_obj.hideDuplicateModal === false && cur_modal_obj.insertStep === 0 ? (
          <AlertModal
            hideModal = {this.hideModal}
            showMedicineOrigin = {cur_modal_obj.showMedicineOrigin}
            showMedicineContent = {cur_modal_obj.showMedicineContent}
            showMedicineSelected = {cur_modal_obj.showMedicineSelected}
            modalType = {cur_modal_obj.modalType}
            handleCancel = {this.stepOneCancel}
            handleOk = {this.stepOneOk}

          />
        ) : (
          ""
        )}
        {cur_modal_obj.hideDuplicateModal === false && cur_modal_obj.insertStep === 1 && (
          <AlertModal
            hideModal = {this.hideModal}
            showMedicineOrigin = {cur_modal_obj.showMedicineOrigin}
            showMedicineContent = {cur_modal_obj.showMedicineContent}
            showMedicineSelected = {cur_modal_obj.showMedicineSelected}
            modalType = {cur_modal_obj.modalType}
            handleCancel = {this.stepTwoCancel}
            handleOk = {this.stepTwoOk}

          />
        )}
        {cur_modal_obj.dropStep === 1 && (
          <DropModal
            hideModal = {this.dropCancel}
            duplicateList = {cur_modal_obj.duplicateList}
            rejectList = {cur_modal_obj.rejectList}
            alertList = {[]}
            modalType = {"stepDuplicateReject"}
            handleCancel = {this.dropCancel}
            handleOk = {this.dropOneOk}

          />        
        )}
        {cur_modal_obj.dropStep === 2 && (
          <DropModal
            hideModal = {this.dropCancel}
            duplicateList = {cur_modal_obj.duplicateList}
            rejectList = {[]}
            alertList = {cur_modal_obj.alertList}
            modalType = {"stepAlert"}
            handleCancel = {this.dropCancel}
            handleOk = {this.dropTwoOk}

          />        
        )}       
        {cur_modal_obj.notHasUnitModal === true && (
          <NoUnitOrderModal
            hideModal = {this.notUnitCancel}
            notHasUnitMedData = {cur_modal_obj.notHasUnitMed}
            handleCancel = {this.notUnitCancel}
            // messageType = {cur_modal_obj.messageType}
            handleOk = {this.notUnitCancel}
          />       
        )}       
        {cur_modal_obj.diseaseModal === true && (
          <ContraindicationToDiseaseModal
            hideModal = {this.diseaseCancel}
            diseaseData = {cur_modal_obj.diseaseData}
            handleCancel = {this.diseaseCancel}
            messageType = {cur_modal_obj.messageType}
            handleOk = {this.diseaseOk}
          />       
        )}
        {cur_modal_obj.diseaseOrderModal === true && (
          <ContraindicationToDiseaseModal
            hideModal = {this.diseaseOrderCancel}
            diseaseData = {cur_modal_obj.diseaseOrderData}
            handleCancel = {this.diseaseOrderCancel}
            messageType = {cur_modal_obj.messageType}
            handleOk = {this.diseaseOrderOk}
          />       
        )}
        {cur_modal_obj.diseasePrescriptionModal === true && (
          <ContraindicationToDiseaseModal
            hideModal = {this.diseasePrescriptionCancel}
            diseaseData = {cur_modal_obj.diseasePrescriptionData}
            handleCancel = {this.diseasePrescriptionCancel}
            messageType = {cur_modal_obj.messageType}
            handleOk = {this.diseasePrescriptionOk}
          />       
        )}
        {cur_modal_obj.periodModal === true && (
          <PeriodModal
            hideModal = {this.periodCancel}
            periodData = {cur_modal_obj.periodData}
            handleCancel = {this.periodCancel}
            handleOk = {this.periodOk}
          />       
        )}
        {cur_modal_obj.periodOrderModal === true && (
          <PeriodModal
            hideModal = {this.periodOrderCancel}
            periodData = {cur_modal_obj.periodOrderData}
            handleCancel = {this.periodOrderOk}
            handleOk = {this.periodOrderOk}
          />       
        )}
        {cur_modal_obj.periodPrescriptionModal === true && (
          <PeriodModal
            hideModal = {this.periodPrescriptionOk}
            periodData = {cur_modal_obj.periodPrescriptionData}
            handleCancel = {this.periodPrescriptionOk}
            handleOk = {this.periodPrescriptionOk}
          />       
        )}
        {cur_modal_obj.usageAlertModal === true && (
          <UsageAlertModal
            hideModal = {this.handleUsageModal}
            alertContent = {cur_modal_obj.usageAlertContent}
            handleOk = {this.handleUsageOk}
            handleCancel = {this.handleUsageModal}
            handleDetail = {this.handleUsageDetail}
          />       
        )}
        {cur_modal_obj.usageOverModal === true && (
          <UsageOverModal
            hideModal= {this.handleUsageHide}
            handleOk= {this.handleUsageOverOK}
            showMedicineContent= {cur_state.alert_messages}
            items={cur_modal_obj.usageOverItem}
            presData={cur_state.presData}
            patientId={this.props.patientId}
          />       
        )}
        {cur_modal_obj.diagnosisModal === true && (
          <DiagnosisModal
            hideModal = {this.diagnosisCancel}
            diagnosisData = {cur_modal_obj.diagnosisData}
            presData={cur_state.presData}
            handleCancel = {this.diagnosisCancel}
            handleOk = {this.diagnosisOK}
            type={"medicine"}
          />       
        )}
        {cur_modal_obj.diagnosisOrderModal === true && (
          <DiagnosisRpModal
            hideModal = {this.diagnosisOrderCancel}
            diagnosisData = {cur_modal_obj.diagnosisOrderData}
            presData={cur_modal_obj.presData != null && cur_modal_obj.presData != undefined && cur_modal_obj.presData.length > 0 ? cur_modal_obj.presData : cur_state.presData}
            handleCancel = {this.diagnosisOrderCancel}            
            messageType = {cur_modal_obj.messageType}            
            handleOk = {this.diagnosisOrderOK}
          />       
        )}
        {cur_modal_obj.usageAlertModal && cur_modal_obj.usageMedDetailModal && (
            <MedicineDetailModal
              hideModal={this.handleUsageMedDetailCancel}
              handleCancel={this.handleUsageMedDetailCancel}
              medicineDetailList={cur_modal_obj.usageMedicineDetail}
            />
          )}
        {cur_modal_obj.changeDepartmentModal && (
          <DepartmentModal
            hideModal={this.handleClose}
            handleCancel={this.handleClose}
            handleChangeDeparment={this.handleChangeDeparment}
            departmentList={this.departmentOptions}
            departmentName={cur_modal_obj.departmentName}
            departmentCode={cur_modal_obj.departmentCode}
            departmentDate={cur_modal_obj.departmentDate}
          />
        )}
        {cur_modal_obj.registerSetModal && (
          <RegisterSetModal
            hideModal={this.handleClose}
            handleCancel={this.handleClose}
            handleOk={this.handleRegisterSet}
            setData={cur_state.medicineSetData}
            preset_do_count={cur_modal_obj.registerSetData.order_data.preset_do_count}
            patientId={this.props.patientId}
          />
        )}
        {cur_modal_obj.confirm_message !== undefined && cur_modal_obj.confirm_message !== "" && cur_modal_obj.confirm_type !== "" && (
          <SystemConfirmModal
            hideConfirm= {this.confirmCancel}
            confirmCancel= {this.confirmCancel}
            confirmOk= {this.confirmOk}
            confirmTitle= {cur_modal_obj.confirm_message}
          />
        )}
        {cur_modal_obj.usageOpen ? (
          <SelectUsageModal
            closeUsage={this.closeUsage}
            getUsage={this.props.getUsage}
            getUsageFromModal={this.props.getUsageFromModal}
            usageData={cur_modal_obj.usageData}
            diagnosis_division = {cur_state.presData[indexUsage].medicines[0].diagnosis_division}  
          />
        ) : (
          ""
        )}

        {cur_modal_obj.hasUnenabledUsage && cur_modal_obj.confirm_message !== undefined && cur_modal_obj.confirm_message !== "" && (
          <SystemConfirmModal
            hideConfirm= {this.props.confirmUnenabledUsageCancel}
            confirmCancel= {this.props.confirmUnenabledUsageCancel}
            confirmOk= {this.props.confirmUnenabledUsageOk}
            confirmTitle= {cur_modal_obj.confirm_message}
          />
        )}

        {/*{cur_modal_obj.isOpenPrescriptionConfirmModal == true && (
          <PrescriptionConfirmModal
            patientId={this.props.patientId}
            patientInfo={this.props.patientInfo}
            presData={cur_state.presData}
            closeModal={this.closeOpenPrescriptionConfirm}
            type={'prescription'}
            confirmPrescriptionOk={this.props.prescriptionConfirmOk}
            cacheSerialNumber={this.props.cacheSerialNumber}
          />
        )}*/}
        <PrescriptionConfirmModal
            ref={this.PrescriptionConfirmModalRef}
            patientId={this.props.patientId}
            patientInfo={this.props.patientInfo}
            presData={cur_state.presData}
            closeModal={this.closeOpenPrescriptionConfirm}
            type={'prescription'}
            confirmPrescriptionOk={this.prescriptionConfirmOk}
            cacheSerialNumber={this.props.cacheSerialNumber}
          />

        {cur_modal_obj.isDeletePrescriptionConfirmModal == true && (
          <SystemDeletePrescriptionModal
            confirmCancel= {this.props.deletePrescriptionCancel}
            confirmOk= {this.props.deletePrescriptionConfirm}
            confirmTitle= {'入力中の処方内容を破棄してSOAPに戻りますか？'}
          />
        )}

        {cur_modal_obj.isEditPrescriptionAfterDeleteModal == true && (
          <SystemDeletePrescriptionModal
            confirmCancel= {this.props.deletePrescriptionCancel}
            confirmOk= {this.props.editPrescriptionAfterDelConfirm}
            type={'_editAfterDelete'}
            confirmTitle= {'入力中の内容があります。破棄して新しく編集を始めますか？'}
          />
        )}

        {cur_modal_obj.check_alert_messages != "" && 
        cur_modal_obj.check_alert_messages != undefined && 
        cur_modal_obj.check_alert_messages != null && (
          <SystemAlertModal
            hideModal= {this.props.handleAlertOk.bind(this)}
            handleOk= {this.props.handleAlertOk.bind(this)}
            showMedicineContent= {cur_modal_obj.check_alert_messages}
          />
        )}

        {cur_modal_obj.isNotConsentedModalOpen === true &&
          cur_state.staff_category === 1 && (
            <NotConsentedPrescriptionModal
              patientId={this.props.patientId}
              refresh={this.props.refreshNotConsented}
              closeNotConsentedModal={this.closeNotConsentedModal}
              fromPatient={false}
            />
          )}  

        {cur_modal_obj.isPrescriptionDeleteConfirmOpen === true && (
            <DeleteOperationConfirmModal
              confirmCancel= {this.closeDeleteModal}
              confirmOk= {this.props.confirmDeletedData}
              del_numbers={cur_modal_obj.deletedNumbers}
              modal_type= {cur_modal_obj.deleteModalType}
            />
          )}  

        {cur_modal_obj.periodSettingPrintModal === true && cur_modal_obj.periodSettingPrintTitle == "処方歴" && (
            <PeriodSettingPrintModal
              confirmCancel= {this.closeSelfModal}
              confirmOk= {this.props.confirmPrintPrescription}                            
              medicineHistoryData={cur_modal_obj.medicineHistoryData}
              printPostParam={cur_modal_obj.print_post_param}
              patientInfo={this.props.patientInfo}
            />
          )}  

        {cur_modal_obj.periodSettingPrintModal === true && cur_modal_obj.periodSettingPrintTitle == "よく使う薬剤" && (
            <PrescriptionRankPrintModal
              confirmCancel= {this.closeSelfModal}
              confirmOk= {this.props.confirmPrintPrescription}              
              prescriptionRankData= {cur_modal_obj.prescriptionRankData}              
              patientInfo={this.props.patientInfo}
            />
          )}  

        {cur_modal_obj.isPrescriptionDeleteCancelOpen === true && (
            <DeleteOperationConfirmModal
              confirmCancel= {this.closeDeleteCancelModal}
              confirmOk= {this.props.confirmDeletedCancelData}
              del_numbers={cur_modal_obj.deletedNumbers}
              modal_type= {cur_modal_obj.deleteModalType}
            />
          )}  

          {cur_modal_obj.alertMessage == "death" && (
            <AlertNoFocusModal
              hideModal= {this.cancelAlertModal.bind(this)}
              handleOk= {this.cancelAlertModal.bind(this)}
              showMedicineContent= {"死亡した患者です。"}
            />
          )}
          {cur_modal_obj.complete_message !== '' && (
            <CompleteStatusModal
              message = {cur_modal_obj.complete_message}
            />
          )}

        {this.props.doctors != undefined && this.props.doctors != null && cur_modal_obj.isDoctorsOpen === true && (
          <SelectDoctorModal
            closeDoctor={this.props.closeDoctorModal}
            getDoctor={this.props.getDoctorModal}
            selectDoctorFromModal={this.props.selectDoctorFromModal}
            doctors={this.props.doctors}
          />
        )}
      </>
    );
  }
}

PrescriptionAllModal.propTypes = {
  amountConfirm: PropTypes.func,
  amountCancel: PropTypes.func,
  bodyPartConfirm: PropTypes.func,
  daysConfirm: PropTypes.func,
  hideModal: PropTypes.func,
  stepOneCancel: PropTypes.func,
  stepTwoCancel: PropTypes.func,
  stepTwoOk: PropTypes.func,
  dropCancel: PropTypes.func,
  dropTwoOk: PropTypes.func,
  diseaseCancel: PropTypes.func,
  diseaseOrderCancel: PropTypes.func,
  diseaseOrderOk: PropTypes.func,
  diseasePrescriptionCancel: PropTypes.func,
  diseasePrescriptionOk: PropTypes.func,
  periodCancel: PropTypes.func,
  periodOk: PropTypes.func,
  periodOrderOk: PropTypes.func,
  periodPrescriptionOk: PropTypes.func,
  handleUsageModal: PropTypes.func,
  handleUsageDetail: PropTypes.func,
  handleUsageHide: PropTypes.func,
  handleUsageOverOK: PropTypes.func,
  diagnosisCancel: PropTypes.func,
  diagnosisOK: PropTypes.func,
  handleUsageMedDetailCancel: PropTypes.func,
  handleClose: PropTypes.func,
  handleChangeDeparment: PropTypes.func,
  handleRegisterSet: PropTypes.func,
  confirmCancel: PropTypes.func,
  confirmOk: PropTypes.func,
  confirmUnenabledUsageOk: PropTypes.func,
  confirmUnenabledUsageCancel: PropTypes.func,
  dropOneOk: PropTypes.func,
  closeBodyParts: PropTypes.func,
  dayCancel: PropTypes.func,
  stepOneOk: PropTypes.func,
  diseaseOk: PropTypes.func,
  handleUsageOk: PropTypes.func,
  diagnosisOrderCancel: PropTypes.func,
  diagnosisOrderOK: PropTypes.func,
  dropRun: PropTypes.func,
  setModalObj: PropTypes.func,
  insertMedModal: PropTypes.func,
  getUsage: PropTypes.func,
  getUsageFromModal: PropTypes.func,
  closeDoctorModal: PropTypes.func,
  getDoctorModal: PropTypes.func,
  selectDoctorFromModal: PropTypes.func,
  changeAllRpDaysAmount: PropTypes.func,
  prescriptionConfirmOk: PropTypes.func,
  deletePrescriptionCancel: PropTypes.func,
  deletePrescriptionConfirm: PropTypes.func,
  editPrescriptionAfterDelConfirm: PropTypes.func,
  handleAlertOk: PropTypes.func,
  indexUsage: PropTypes.number,
  patientId: PropTypes.number,
  units: PropTypes.array,
  props_state: PropTypes.object,
  modal_obj: PropTypes.object,  
  patientInfo: PropTypes.object,
  refreshNotConsented: PropTypes.func,
  setBeforeUsage: PropTypes.func,
  confirmDeletedData: PropTypes.func,
  confirmDeletedCancelData: PropTypes.func,
  saveAdministratePeriod: PropTypes.func,
  handleMedicinePeriodDuplicateModal: PropTypes.func,
  confirmPrintPrescription: PropTypes.func,
  cacheSerialNumber: PropTypes.number,
  doctors: PropTypes.object,
};

export default PrescriptionAllModal;
