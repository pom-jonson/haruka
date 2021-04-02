
/* OperationPanel */
export openModal from "./../../PrescriptionMethods/openModal";
// export onSelectDoctor from "./../../PrescriptionMethods/onSelectDoctor";
// export changeOperationTab from "./../../PrescriptionMethods/changeOperationTab";

/* EndExaminationModal */
export sendKarte from "./../../PrescriptionMethods/sendKarte";
export getMessageSendKarte from "./../../PrescriptionMethods/getMessageSendKarte";
export goKartePage from "./../../PrescriptionMethods/goKartePage";

/* SelectDoctorModal */
export selectDoctorFromModal from "./../../PrescriptionMethods/selectDoctorFromModal";

/* componentDidMount */
export getPatientInfor from "./../../FinalPrescriptionMethods/getPatientInfor";
export getCurrentKarteTree from "./getCurrentKarteTree";
export getAllKarteTree from "./getAllKarteTree";
// export getKarteTree from "./../../PrescriptionMethods/getKarteTree";
export getDoctorsList from "./getDoctorsList";
export getUsageData from "./../../PrescriptionMethods/getUsageData";
export getPresetDoPrescription from "./../../PrescriptionMethods/getPresetDoPrescription";
// export getPresetDoDeployment from "./../../PrescriptionMethods/getPresetDoDeployment";

/* MiddleBox */
export updateSoapList from "./updateSoapList";
export changeSoapList from "./changeSoapList";
export sortSoapList from "./sortSoapList"; // changeSoapList call
// before prescription 
export checkHasNoUnitSoapPrescription from "./checkHasNoUnitSoapPrescription";

/* RightBox */
export getSoapPrescriptionDelData from "./../../PrescriptionMethods/getSoapPrescriptionDelData";
export getSoapInjectionDelData from "./../../Injection/methods/getSoapInjectionDelData";
export getLastInjection from "./../../Injection/methods/getLastInjection";
export getLastPrescription from "./../../PrescriptionMethods/getLastPrescription";

/*MiddleBox RightBox*/
export clipboardPrescription from "./clipboardPrescription";
export clipboardInjection from "./clipboardInjection";

/* Send Karte */
// Prescription
export addMessageSendKarte from "~/components/templates/Patient/PrescriptionMethods/addMessageSendKarte";
export createCacheOrderData from "~/components/templates/Patient/PrescriptionMethods/createCacheOrderData";
// export checkCachePrescriptionData from "~/components/templates/Patient/PrescriptionMethods/checkCachePrescriptionData";
export deleteCachePrescription from "~/components/templates/Patient/PrescriptionMethods/deleteCachePrescription";
export doneCachePrescription from "~/components/templates/Patient/PrescriptionMethods/doneCachePrescription";
export hasChangedData from "~/components/templates/Patient/PrescriptionMethods/hasChangedData";
// export getContraindicationsToDisease from "~/components/templates/Patient/FinalPrescriptionMethods/getContraindicationsToDisease";// 病名禁忌
export getContraindicationsToDiseaseApi from "~/components/templates/Patient/FinalPrescriptionMethods/getContraindicationsToDiseaseApi";// 病名禁忌

//Injection
// Injection
export createInjectCacheOrderData from "~/components/templates/Patient/Injection/methods/createInjectCacheOrderData";
// export checkCacheInjectionData from "~/components/templates/Patient/Injection/methods/checkCacheInjectionData";
export deleteCacheInjection from "~/components/templates/Patient/Injection/methods/deleteCacheInjection";
export doneCacheInjection from "~/components/templates/Patient/Injection/methods/doneCacheInjection";
