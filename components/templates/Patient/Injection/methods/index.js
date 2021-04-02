/* constructor */
/* componentDidMount */
export resetState from "./../../PrescriptionMethods/resetState";
export getPatientInfor from "./../../PrescriptionMethods/getPatientInfor";
export getDoctorsList from "./../../PrescriptionMethods/getDoctorsList";
export getUsageInjectData from "./getUsageInjectData";
export getUsageData from "./getUsageData";
export getContraindicationsToDisease from "./../../PrescriptionMethods/getContraindicationsToDisease";
export getContraindicationsToDiseaseApi from "./../../PrescriptionMethods/getContraindicationsToDiseaseApi";
export getTrackData from "./../../PrescriptionMethods/getTrackData";
export loadInjectCachedData from "./loadInjectCachedData";


// export getDelInjectData from "./getDelInjectData";
/* InjectionTree */

/* InjectionSelection */
export checkDiseaseOrderInjection from "./checkDiseaseOrderInjection"; // order
export checkDiseaseInjection from "./checkDiseaseInjection"; // prescription
export checkPeriodMedicineInjection from "./checkPeriodMedicineInjection"; // order = true, prescription = false
export checkPeriodmedicineUnit from "./../../PrescriptionMethods/checkPeriodmedicineUnit";
export setDepartment from "./../../PrescriptionMethods/setDepartment";
export copyInjectionOrder from "./copyInjectionOrder";
export copyInjectionOrders from "./copyInjectionOrders";
export printInjectionOrders from "./printInjectionOrders";
export editInjectOrders from "./editInjectOrders";
// call in editInjectOrders 
export getEmptyInjection from "./getEmptyInjection";
export changeInjectionList from "./changeInjectionList";

export setDoctorInfo from "./../../PrescriptionMethods/setDoctorInfo";
export getDelInjectData from "./getDelInjectData";
export getDoneInjectData from "./getDoneInjectData";
export scrollAddInjectionHistoryData from "./scrollAddInjectionHistoryData";


/* InjectionRankSelection */

/* InjectionSetSelection */
// export setDoctorInfo from "./../../PrescriptionMethods/setDoctorInfo";
export consent from "./../../PrescriptionMethods/consent";

/*禁忌薬の判定*/
export getAlertReject from "./getAlertReject";


/* Title */
export getInjectionOrderTitle from "./getInjectionOrderTitle";

/* InjectionInOutNav */
export getInjectRadio from "./getInjectRadio";

/* onDropEvent */
export getDropInjectionOrderUsageList from "./getDropInjectionOrderUsageList"; // get usage info (is_enabled)
export getDropInjectionOrderList from "./getDropInjectionOrderList";
export checkInjectionDropContraindicationReject from "./checkInjectionDropContraindicationReject";
export checkInjectionDropContraindicationAlert from "./checkInjectionDropContraindicationAlert";



/* InjectionTable */
export changeInjectAmountOrDays from "./changeInjectAmountOrDays";
export storeInjectionDataInCache from "./storeInjectionDataInCache";
export resetInjectData from "./resetInjectData";
export checkCanAddInjection from "./checkCanAddInjection";

// export selectDoctorFromModal from "./../../PrescriptionMethods/selectDoctorFromModal";


/* SelectUsageInjectModal */
export getInjectUsage from "./getInjectUsage";
export getInjectionUsage from "./getInjectionUsage";
export getUsageInfo from "./getUsageInfo";
export getUsageInjectFromModal from "./getUsageInjectFromModal";
export getInjectionUsageFromModal from "./getInjectionUsageFromModal";
export selectInjectDoctorFromModal from "./selectInjectDoctorFromModal";


/* InjectCalc */
export daysInjectConfirm from "./daysInjectConfirm";
// export daysInjectionConfirm from "./daysInjectionConfirm";

/* SelectDoctorModal */


//this.state.isAmountOpen && this.state.hideDuplicateModal && this.state.insertMedicineFlag
/* InjectCalc */
export amountInjectConfirm from "./amountInjectConfirm";
// call  getEmptyInject, getEmptyInjection
export getEmptyInject from "./getEmptyInject";

export amountInjectCancel from "./amountInjectCancel";

/* BodyParts */
export bodyPartInjectConfirm from "./bodyPartInjectConfirm";

/* EndExaminationModal */
export sendKarte from "./../../PrescriptionMethods/sendKarte";
export getMessageSendKarte from "./../../PrescriptionMethods/getMessageSendKarte";
export goKartePage from "./../../PrescriptionMethods/goKartePage";
export openModal from "./../../PrescriptionMethods/openModal";

/* DropModal */
export onInjectionDrop from "./onInjectionDrop";
// call in onInjectionDrop 
export dragAndDropCopyInjectionOrder from "./dragAndDropCopyInjectionOrder";
export dragAndDropCopyInjectionOrders from "./dragAndDropCopyInjectionOrders";
export dragAndDropInjectionInsertMed from "./dragAndDropInjectionInsertMed";
export dragAndDropCopyInjectionItemDetails from "./dragAndDropCopyInjectionItemDetails";

/* ContraindicationToDiseaseModal */

/* PeriodModal */

/* DepartmentModal */

/* RegisterSetModal */
export registerNewInjectionSet from "./registerNewInjectionSet";

/* AlertModal */
export insertInjectMed from "./insertInjectMed";

// call in insertInjectMed
export checkInjectCanEdit from "./checkInjectCanEdit";
export checkInjectionContraindication from "./checkInjectionContraindication";

/* SystemConfirmModal */ // 入力内容を破棄
//call setInjectDoCopyStatus
export setInjectDoCopyStatus from "./setInjectDoCopyStatus";
//---------------------------------------


/* Title Tabs*/
export getInjectionSetData from "./getInjectionSetData";
export getInjectionRankData from "./getInjectionRankData";
// export doneCacheInjection from "./doneCacheInjection";

export getHistoryInjectionApi from "./getHistoryInjectionApi";
export getInjectionHistoryMoreData from "./getInjectionHistoryMoreData";
// export injectionUsageConfirm from "./injectionUsageConfirm";



/* Send Karte */
// Prescription
export addMessageSendKarte from "~/components/templates/Patient/PrescriptionMethods/addMessageSendKarte";
export createCacheOrderData from "~/components/templates/Patient/PrescriptionMethods/createCacheOrderData";
export checkCachePrescriptionData from "~/components/templates/Patient/PrescriptionMethods/checkCachePrescriptionData";
export deleteCachePrescription from "~/components/templates/Patient/PrescriptionMethods/deleteCachePrescription";
export doneCachePrescription from "~/components/templates/Patient/PrescriptionMethods/doneCachePrescription";
export hasChangedData from "~/components/templates/Patient/PrescriptionMethods/hasChangedData";

// Injection

export createInjectCacheOrderData from "~/components/templates/Patient/Injection/methods/createInjectCacheOrderData";
export checkCacheInjectionData from "~/components/templates/Patient/Injection/methods/checkCacheInjectionData";
export checkInjectDataFromInjection from "~/components/templates/Patient/Injection/methods/checkInjectDataFromInjection";
export deleteCacheInjection from "~/components/templates/Patient/Injection/methods/deleteCacheInjection";
export doneCacheInjection from "~/components/templates/Patient/Injection/methods/doneCacheInjection";


export state from "./../../PrescriptionMethods/state";




