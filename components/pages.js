import loadable from "@loadable/component";

export const login = [
  {
    component: loadable(() => import(`./templates/Login`)),
    path: "/",
    exact: true
  }
];

export const manageSetting = [
  {
    component: loadable(() => import(`./templates/ManageSetting`)),
    path: "/manage_setting",
    exact: true
  }
];

export const tempLogin = [
  {
    component: loadable(() => import(`./templates/TempLogin`)),
    path: "/tempLogin",
    exact: true
  }
];

export const top = [
  {
    component: loadable(() => import(`./templates/Top`)),
    path: "/top",
    exact: true,
    protectedRoute: true
  }
];

export const help = [
  {
    component: loadable(() => import(`./templates/Help`)),
    path: "/help",
    exact: true,
    protectedRoute: true
  }
];

export const receptionList = [
  {
    component: loadable(() => import(`./templates/ReceptionList`)),
    path: "/receptionList",
    exact: true,
    protectedRoute: true
  }
];

export const patients = [
  {
    component: loadable(() => import(`./templates/Patients`)),
    path: "/patients",
    exact: true,
    protectedRoute: true
  }
];

export const patientsSearch = [
  {
    component: loadable(() => import(`./templates/PatientsSearch`)),
    path: "/patients_search",
    exact: true,
    protectedRoute: true
  }
];

export const HospitalWardList = [
  {
    component: loadable(() => import(`./templates/HospitalWardList`)),
    path: "/hospital_ward_list",
    exact: true,
    protectedRoute: true
  }
];

// export const prescriptionList = [
//   {
//     component: loadable(() => import(`./templates/PrescriptionList`)),
//     path: "/prescriptionList",
//     exact: true,
//     protectedRoute: true
//   }
// ];

// export const injectionList = [
//   {
//     component: loadable(() => import(`./templates/InjectionList`)),
//     path: "/injection/order_list",
//     exact: true,
//     protectedRoute: true
//   }
// ];

// 処方受付
export const PrescriptionAcceptList = [
  {
    component: loadable(() => import(`./templates/OrderList/PrescriptionAcceptList`)),
    path: "/prescriptionList",
    exact: true,
    protectedRoute: true
  }
];

// 注射受付
export const InjectionAcceptList = [
  {
    component: loadable(() => import(`./templates/OrderList/InjectionAcceptList`)),
    path: "/injection/order_list",
    exact: true,
    protectedRoute: true
  }
];
export const HospitalInjectionAcceptList = [
  {
    component: loadable(() => import(`./templates/OrderList/InjectionAcceptList`)),
    path: "/injection/hospital_order_list",
    exact: true,
    protectedRoute: true
  }
];

export const inspectionList = [
  {
    component: loadable(() => import(`./templates/InspectionList`)),
    path: "/inspectionList",
    exact: true,
    protectedRoute: true
  }
];
export const bmlUpload = [
  {
    component: loadable(() => import(`./templates/Examination/Bml`)),
    path: "/examination/import/bml",
    exact: true,
    protectedRoute: true
  }
];

export const inHospital = [
  {
    component: loadable(() => import(`./templates/Examination/InHospital`)),
    path: "/examination/import/in_hospital",
    exact: true,
    protectedRoute: true
  }
];

export const mypage = [
  {
    component: loadable(() => import(`./templates/Mypage/Config`)),
    path: "/mypage/config",
    protectedRoute: true
  }
];

export const patient = [
  {
    render: loadable(() => import(`./templates/Patient/Karte`)),
    path: "/patients/:id",
    exact: true,
    protectedRoute: true
  },
  {
    component: loadable(() => import(`./templates/Patient/Edit`)),
    path: "/patients/:id/edit",
    protectedRoute: true
  },
  {
    render: loadable(() => import(`./templates/Patient/Prescription`)),
    path: "/patients/:id/prescription",
    protectedRoute: true
  },
  {
    component: loadable(() => import(`./templates/Patient/Karte`)),
    path: "/patients/:id/karte",
    protectedRoute: true
  },
  {
    component: loadable(() => import(`./templates/Patient/Meal`)),
    path: "/patients/:id/meal",
    protectedRoute: true
  },
  {
    component: loadable(() => import(`./templates/Patient/Overnight`)),
    path: "/patients/:id/overnight",
    protectedRoute: true
  },
  {
    component: loadable(() => import(`./templates/Patient/Coaching`)),
    path: "/patients/:id/coaching",
    protectedRoute: true
  },
  {
    component: loadable(() => import(`./templates/Patient/File`)),
    path: "/patients/:id/file",
    protectedRoute: true
  },
  {
    component: loadable(() => import(`./templates/Patient/Reserve`)),
    path: "/patients/:id/reserve",
    protectedRoute: true
  },
  {
    component: loadable(() => import(`./templates/Patient/Discharge`)),
    path: "/patients/:id/discharge",
    protectedRoute: true
  },
  {
    component: loadable(() => import(`./templates/Patient/Disease`)),
    path: "/patients/:id/disease",
    protectedRoute: true
  },
  {
    component: loadable(() => import(`./templates/Patient/SOAP`)),
    path: "/patients/:id/soap",
    protectedRoute: true
  },
  {
    component: loadable(() => import(`./templates/Patient/NursingDocument/NursingDocument`)),
    path: "/patients/:id/nursing_document",
    protectedRoute: true
  },
  {
    component: loadable(() => import(`./templates/Patient/Inspection`)),
    path: "/patients/:id/inspection",
    protectedRoute: true
  },
  {
    component: loadable(() => import(`./templates/Patient/Injection.js`)),
    path: "/patients/:id/injection",
    protectedRoute: true
  },
  {
    component: loadable(() => import(`./templates/Patient/EmergencyKarte.js`)),
    path: "/patients/:id/emergency_karte",
    protectedRoute: true
  }
];

export const preset = [
  {
    component: loadable(() => import(`./templates/Preset/Prescription`)),
    path: "/preset/prescription",
    exact: true,
    protectedRoute: true
  }
];

export const InjectionPreset = [
  {
    component: loadable(() => import(`./templates/InjectionPreset/Injection`)),
    path: "/preset/injection",
    exact: true,
    protectedRoute: true
  }
];

export const medicine_master = [
  {
    component: loadable(() => import(`./templates/MedicineMaster`)),
    path: "/management/medicine_master",
    exact: true,
    protectedRoute: true
  },
  {
    component: loadable(() => import(`./templates/MedicineMaster/Medicine`)),
    path: "/management/medicine_master/:id",
    protectedRoute: true
  },
  {
    component: loadable(() => import(`./templates/MedicineMaster/Bml`)),
    path: "/management/medicine_master_csv/upload",
    protectedRoute: true
  },

];

export const preset_examination = [
  {
    component: loadable(() => import(`./templates/Examination/Preset`)),
    path: "/preset/examination",
    exact: true,
    protectedRoute: true
  }
];

export const bulletin = [
  {
    component: loadable(() => import(`./templates/Bulletin/Bulletin`)),
    path: "/admin/entrance_bulletin_board/edit",
    exact: true,
    protectedRoute: true
  }
];

export const collectReceptionList = [
  {
    component: loadable(() => import(`./templates/ExaminationList`)),
    path: "/examination/collect_reception",
    exact: true,
    protectedRoute: true
  }
];
export const hospitalCollectReceptionList = [
  {
    component: loadable(() => import(`./templates/ExaminationList`)),
    path: "/examination/hospital_collect_reception",
    exact: true,
    protectedRoute: true
  }
];
export const collectDoneList = [
  {
    component: loadable(() => import(`./templates/ExaminationList`)),
    path: "/examination/collect_done",
    exact: true,
    protectedRoute: true
  }
];
export const hospitalCollectDoneList = [
  {
    component: loadable(() => import(`./templates/ExaminationList`)),
    path: "/examination/hospital_collect_done",
    exact: true,
    protectedRoute: true
  }
];
export const examinationList = [
  {
    component: loadable(() => import(`./templates/ExaminationList`)),
    path: "/examination/done",
    exact: true,
    protectedRoute: true
  }
];

export const inspectionResultList = [
  {
    component: loadable(() => import(`./templates/InspectionList/InspectionList`)),
    path: "/inspectionResult/inspection_result_list",
    exact: true,
    protectedRoute: true
  }
];

export const dialNewPatient = [
  {
    component: loadable(() => import(`./templates/Dial/DialPatient`)),
    path: "/dial/dial_new_patient",
    exact: true,
    protectedRoute: true
  }
];
export const dialPatient = [
  {
    component: loadable(() => import(`./templates/Dial/DialPatient`)),
    path: "/dial/dial_patient",
    exact: true,
    protectedRoute: true
  }
];
export const dialInsurance = [
  {
    component: loadable(() => import(`./templates/Dial/DialInsurance`)),
    path: "/dial/dial_insurance",
    exact: true,
    protectedRoute: true
  }
];
export const dialEmergencyContact = [
  {
    component: loadable(() => import(`./templates/Dial/DialEmergencyContact`)),
    path: "/dial/dial_emergency",
    exact: true,
    protectedRoute: true
  }
];
export const dialFamily = [
  {
    component: loadable(() => import(`./templates/Dial/DialFamily`)),
    path: "/dial/dial_family",
    exact: true,
    protectedRoute: true
  }
];
export const dialPattern = [
  {
    component: loadable(() => import(`./templates/Dial/Pattern/DialPattern`)),
    path: "/dial/pattern/dialPattern",
    exact: true,
    protectedRoute: true
  }
];
export const injection_pattern = [
  {
    component: loadable(() => import(`./templates/Dial/Pattern/Injection`)),
    path: "/dial/pattern/injection",
    exact: true,
    protectedRoute: true
  }
];
export const prescription_pattern = [
  {
    component: loadable(() => import(`./templates/Dial/Pattern/Prescription`)),
    path: "/dial/pattern/prescription",
    exact: true,
    protectedRoute: true
  }
];
export const pattern_inspection = [
  {
    component: loadable(() => import(`./templates/Dial/Pattern/Inspection`)),
    path: "/dial/pattern/inspection",
    exact: true,
    protectedRoute: true
  }
];

export const multi_inspection = [
  {
    component: loadable(() => import(`./templates/Dial/Pattern/MultiInspection`)),
    path: "/dial/pattern/multi_inspection",
    exact: true,
    protectedRoute: true
  }
];

export const anticoagulation = [
  {
    component: loadable(() => import(`./templates/Dial/Pattern/Anticoagulation`)),
    path: "/dial/pattern/anticoagulation",
    exact: true,
    protectedRoute: true
  }
];
export const dialPrescript = [
  {
    component: loadable(() => import(`./templates/Dial/Pattern/DialPrescript`)),
    path: "/dial/pattern/dialPrescript",
    exact: true,
    protectedRoute: true
  }
];
export const dializer = [
  {
    component: loadable(() => import(`./templates/Dial/Pattern/Dializer`)),
    path: "/dial/pattern/Dializer",
    exact: true,
    protectedRoute: true
  }
];
export const administrativefee = [
  {
    component: loadable(() => import(`./templates/Dial/Pattern/Administrativefee`)),
    path: "/dial/pattern/administrativefee",
    exact: true,
    protectedRoute: true
  }
];
export const code = [
  {
    component: loadable(() => import(`./templates/Dial/Master/Code`)),
    path: "/dial/master/code",
    exact: true,
    protectedRoute: true
  }
];
export const material = [
  {
    component: loadable(() => import(`./templates/Dial/Master/Material`)),
    path: "/dial/master/material",
    exact: true,
    protectedRoute: true
  }
];
export const Examination = [
  {
    component: loadable(() => import(`./templates/Dial/Master/Examination`)),
    path: "/dial/master/examination",
    exact: true,
    protectedRoute: true
  }
];
export const medicine = [
  {
    component: loadable(() => import(`./templates/Dial/Master/Medicine`)),
    path: "/dial/master/medicine",
    exact: true,
    protectedRoute: true
  }
];
export const usage = [
  {
    component: loadable(() => import(`./templates/Dial/Master/Usage`)),
    path: "/dial/master/usage",
    exact: true,
    protectedRoute: true
  }
];
export const usage_group = [
  {
    component: loadable(() => import(`./templates/Dial/Master/UsageGroup`)),
    path: "/dial/master/usage_group",
    exact: true,
    protectedRoute: true
  }
];
export const injection = [
  {
    component: loadable(() => import(`./templates/Dial/Master/DialInjection`)),
    path: "/dial/master/injection",
    exact: true,
    protectedRoute: true
  }
];
export const medicines = [
  {
    component: loadable(() => import(`./templates/Dial/Master/Medicines`)),
    path: "/dial/master/medicines",
    exact: true,
    protectedRoute: true
  }
];
export const inspection = [
  {
    component: loadable(() => import(`./templates/Dial/Master/DialInspection`)),
    path: "/dial/master/inspection",
    exact: true,
    protectedRoute: true
  }
];
export const inspection_pattern = [
  {
    component: loadable(() => import(`./templates/Dial/Master/InspectionPattern`)),
    path: "/dial/master/inspection_pattern",
    exact: true,
    protectedRoute: true
  }
];
export const complications_inspection_pattern = [
  {
    component: loadable(() => import(`./templates/Dial/Master/ComplicationInspectionPattern`)),
    path: "/dial/master/complications_inspection_pattern",
    exact: true,
    protectedRoute: true
  }
];
export const injection_set = [
  {
    component: loadable(() => import(`./templates/Dial/Master/InjectionSet`)),
    path: "/dial/master/injection_set",
    exact: true,
    protectedRoute: true
  }
];
export const disease = [
  {
    component: loadable(() => import(`./templates/Dial/Master/Disease`)),
    path: "/dial/master/disease",
    exact: true,
    protectedRoute: true
  }
];
export const image_genre = [
  {
    component: loadable(() => import(`./templates/Dial/Master/ImageGenre`)),
    path: "/dial/master/image_genre",
    exact: true,
    protectedRoute: true
  }
];
export const post_number = [
  {
    component: loadable(() => import(`./templates/Dial/Master/PostNumber`)),
    path: "/dial/master/post",
    exact: true,
    protectedRoute: true
  }
];
export const managefee = [
  {
    component: loadable(() => import(`./templates/Dial/Master/Managefee`)),
    path: "/dial/master/managefee",
    exact: true,
    protectedRoute: true
  }
];
export const holiday = [
  {
    component: loadable(() => import(`./templates/Dial/Master/Holiday`)),
    path: "/dial/master/holiday",
    exact: true,
    protectedRoute: true
  }
];
export const other_facilities = [
  {
    component: loadable(() =>
      import(`./templates/Dial/Master/OtherFacilities`)
    ),
    path: "/dial/master/other_facilities",
    exact: true,
    protectedRoute: true
  }
];
export const facility = [
  {
    component: loadable(() => import(`./templates/Dial/Master/Facility`)),
    path: "/dial/master/facility",
    exact: true,
    protectedRoute: true
  }
];
export const bed = [
  {
    component: loadable(() => import(`./templates/Dial/Master/Bed`)),
    path: "/dial/master/bed",
    exact: true,
    protectedRoute: true
  }
];
export const prescription_set = [
  {
    component: loadable(() => import(`./templates/Dial/Master/PrescriptionSetMaster`)),
    path: "/dial/master/prescription_set",
    exact: true,
    protectedRoute: true
  }
];
export const clinical_master_update = [
  {
    component: loadable(() => import(`./templates/Dial/Master/ClinicalMasterUpdate`)),
    path: "/dial/master/clinical_master_update",
    exact: true,
    protectedRoute: true
  }
];
export const jcl_exam_upload = [
  {
    component: loadable(() => import(`./templates/Dial/Master/JCLExamUpload`)),
    path: "/dial/master/jcl_exam_upload",
    exact: true,
    protectedRoute: true
  }
];
export const weight_initialize = [
  {
    component: loadable(() => import(`./templates/Dial/Weight/Initialize`)),
    path: "/dial/weight/initialize",
    exact: true,
    protectedRoute: true
  }
];
export const weight_createCard = [
  {
    component: loadable(() => import(`./templates/Dial/Weight/CreateCard`)),
    path: "/dial/weight/createCard",
    exact: true,
    protectedRoute: true
  }
];
export const weight_calculate = [
  {
    component: loadable(() => import(`./templates/Dial/Weight/Calculate`)),
    path: "/dial/weight/calculate",
    exact: true,
    protectedRoute: true
  }
];
export const weight_recalculate = [
  {
    component: loadable(() => import(`./templates/Dial/Weight/ReCalculate`)),
    path: "/dial/weight/recalculate",
    exact: true,
    protectedRoute: true
  }
];
export const weight_calculateminusclothes = [
  {
    component: loadable(() => import(`./templates/Dial/Weight/CalculateMinusClothes`)),
    path: "/dial/weight/calculateminusclothes",
    exact: true,
    protectedRoute: true
  }
];
export const weight_inputweight = [
  {
    component: loadable(() => import(`./templates/Dial/Weight/InputWeight`)),
    path: "/dial/weight/:id/inputweight",
    exact: true,
    protectedRoute: true
  }
];
export const weight_patientList = [
  {
    component: loadable(() => import(`./templates/Dial/Weight/PatientList`)),
    path: "/dial/weight/patientList",
    exact: true,
    protectedRoute: true
  }
];
/*
*  06_CARE_BOARD_編
*   1. システム設定
*/
export const system_setting = [
  {
    component: loadable(() => import(`./templates/Dial/Board/DialMain`)),
    path: "/dial/board/system_setting",
    exact: true,
    protectedRoute: true
  }
];

export const dr_karte = [
  {
    component: loadable(() => import(`./templates/Dial/Board/DialMain`)),
    path: "/dial/board/dr_karte",
    exact: true,
    protectedRoute: true
  }
];

/*
*  05_その他機能
*/
export const bed_table = [
  {
    component: loadable(() => import(`./templates/Dial/Others/BedTable`)),
    path: "/dial/others/bed_table",
    exact: true,
    protectedRoute: true
  }
];
export const status_monitor = [
  {
    component: loadable(() => import(`./templates/Dial/Others/StatusMonitor`)),
    path: "/dial/others/status_monitor",
    exact: true,
    protectedRoute: true
  }
];
export const aggregate = [
  {
    component: loadable(() => import(`./templates/Dial/Others/Aggregate`)),
    path: "/dial/others/aggregate",
    exact: true,
    protectedRoute: true
  }
];
export const inspection_result = [
  {
    component: loadable(() => import(`./templates/Dial/Others/InspectionResult`)),
    path: "/dial/others/inspection_result",
    exact: true,
    protectedRoute: true
  }
];
export const complications_inspection_result = [
  {
    component: loadable(() => import(`./templates/Dial/Others/ComplicationsInspectionResult`)),
    path: "/dial/others/complications_inspection_result",
    exact: true,
    protectedRoute: true
  }
];
export const guideline = [
  {
    component: loadable(() => import(`./templates/Dial/Others/Guideline`)),
    path: "/dial/others/guideline",
    exact: true,
    protectedRoute: true
  }
];
export const proper_dial_analysis = [
  {
    component: loadable(() => import(`./templates/Dial/Others/ProperDialAnalysis`)),
    path: "/dial/others/proper_dial_analysis",
    exact: true,
    protectedRoute: true
  }
];
export const my_calendar = [
  {
    component: loadable(() => import(`./templates/Dial/Others/MyCalendar/MyCalendar`)),
    path: "/dial/others/my_calendar",
    exact: true,
    protectedRoute: true
  }
];
export const dial_user_search = [
  {
    component: loadable(() => import(`./templates/Dial/Others/DialUserSearch`)),
    path: "/dial/others/dial_user_search",
    exact: true,
    protectedRoute: true
  }
];

export const GuidelineTSAT = [
  {
    component: loadable(() => import(`./templates/Dial/Others/GuidelineTSAT`)),
    path: "/dial/others/GuidelineTSAT",
    exact: true,
    protectedRoute: true
  }
];

export const sendingList = [
  {
    component: loadable(() => import(`./templates/Dial/Others/SendingList`)),
    path: "/dial/others/sendingList",
    exact: true,
    protectedRoute: true
  }
];

export const patientPlanList = [
  {
    component: loadable(() => import(`./templates/Dial/Others/patientPlanList`)),
    path: "/dial/others/patientPlanList",
    exact: true,
    protectedRoute: true
  }
];
//----------------スケジュール------------------------------
// 透析

export const schedule_dialysis = [
  {
    component: loadable(() => import(`./templates/Dial/Schedule/Schedule`)),
    path: "/dial/schedule/Schedule",
    exact: true,
    protectedRoute: true
  },
  {
    component: loadable(() => import(`./templates/Dial/Schedule/DialysisPrescription`)),
    path: "/dial/schedule/DialysisPrescription",
    exact: true,
    protectedRoute: true
  },
  {
    component: loadable(() => import(`./templates/Dial/Schedule/Patient`)),
    path: "/dial/schedule/Patient",
    exact: true,
    protectedRoute: true
  },
  {
    component: loadable(() => import(`./templates/Dial/Schedule/Prescription`)),
    path: "/dial/schedule/prescription_schedule",
    exact: true,
    protectedRoute: true
  },
  {
    component: loadable(() => import(`./templates/Dial/Schedule/Injection`)),
    path: "/dial/schedule/injection_schedule",
    exact: true,
    protectedRoute: true
  },
];
// 透析->診療情報入力
export const medical_information = [
  {
    component: loadable(() => import(`./templates/Dial/MedicalInformation/Infection`)),
    path: "/dial/medical_infor/infection",
    exact: true,
    protectedRoute: true
  }
];

export const contraindication = [
  {
    component: loadable(() => import(`./templates/Dial/MedicalInformation/Contraindication`)),
    path: "/dial/medical_infor/Contraindication",
    exact: true,
    protectedRoute: true
  }
];

export const va_record = [
  {
    component: loadable(() => import(`./templates/Dial/MedicalInformation/VARecord`)),
    path: "/dial/medical_infor/va_record",
    exact: true,
    protectedRoute: true
  }
];

export const medical_history = [
  {
    component: loadable(() => import(`./templates/Dial/MedicalInformation/MedicalHistory`)),
    path: "/dial/medical_infor/medical_history",
    exact: true,
    protectedRoute: true
  }
];

export const heart_individual = [
  {
    component: loadable(() => import(`./templates/Dial/MedicalInformation/HeartIndividual`)),
    path: "/dial/medical_infor/heart_individual",
    exact: true,
    protectedRoute: true
  }
];

export const heart_batch = [
  {
    component: loadable(() => import(`./templates/Dial/MedicalInformation/HeartBatch`)),
    path: "/dial/medical_infor/heart_batch",
    exact: true,
    protectedRoute: true
  }
];

export const image_regist = [
  {
    component: loadable(() => import(`./templates/Dial/MedicalInformation/ImageRegist`)),
    path: "/dial/medical_infor/image_regist",
    exact: true,
    protectedRoute: true
  }
];

export const image_display_individual = [
  {
    component: loadable(() => import(`./templates/Dial/MedicalInformation/ImageDisplayIndividual`)),
    path: "/dial/medical_infor/image_display_individual",
    exact: true,
    protectedRoute: true
  }
];

export const image_display_batch = [
  {
    component: loadable(() => import(`./templates/Dial/MedicalInformation/ImageDisplayBatch`)),
    path: "/dial/medical_infor/image_display_batch",
    exact: true,
    protectedRoute: true
  }
];

export const basic_data = [
  {
    component: loadable(() => import(`./templates/Dial/MedicalInformation/BasicData`)),
    path: "/dial/medical_infor/basic_data",
    exact: true,
    protectedRoute: true
  }
];

export const foot_care = [
  {
    component: loadable(() => import(`./templates/Dial/MedicalInformation/FootCare`)),
    path: "/dial/medical_infor/foot_care",
    exact: true,
    protectedRoute: true
  }
];

export const insulin = [
  {
    component: loadable(() => import(`./templates/Dial/MedicalInformation/Insulin`)),
    path: "/dial/medical_infor/insulin",
    exact: true,
    protectedRoute: true
  }
];

export const inspection_data = [
  {
    component: loadable(() => import(`./templates/Dial/MedicalInformation/InspectionData`)),
    path: "/dial/medical_infor/inspection_data",
    exact: true,
    protectedRoute: true
  }
];

export const ComplicationsInspectionData = [
  {
    component: loadable(() => import(`./templates/Dial/MedicalInformation/ComplicationsInspectionData`)),
    path: "/dial/medical_infor/complications_inspection_data",
    exact: true,
    protectedRoute: true
  }
];

export const inspection_capture = [
  {
    component: loadable(() => import(`./templates/Dial/MedicalInformation/InspectionCapture`)),
    path: "/dial/medical_infor/inspection_capture",
    exact: true,
    protectedRoute: true
  }
];

export const dial_prescription = [
  {
    component: loadable(() => import(`./templates/Patient/DialPrescription`)),
    path: "/dial_patients/dial_prescription",
    exact: true,
    protectedRoute: true
  }
];
export const word_list = [
  {
    component: loadable(() => import(`./templates/Dial/WordList`)),
    path: "/dial/word_list",
    exact: true,
    protectedRoute: true
  }
];


// 印刷
export const medical_info_service = [
  {
    component: loadable(() => import(`./templates/Print/MedicalInfoDoc`)),
    path: "/print/medical_info_doc",
    exact: true,
    protectedRoute: true
  }
];
export const intro_letter = [
  {
    component: loadable(() => import(`./templates/Print/IntroLetter`)),
    path: "/print/intro_letter",
    exact: true,
    protectedRoute: true
  }
];


export const xRayLetter = [
  {
    component: loadable(() => import(`./templates/Print/XRayLetter`)),
    path: "/print/x_ray_letter",
    exact: true,
    protectedRoute: true
  }
];
// export const print_prescription = [
//     {
//       component: loadable(() => import(`./templates/Print/Prescription`)),
//       path: "/print/prescription",
//       exact: true,
//       protectedRoute: true
//     }
// ];
export const staff_setting = [
  {
    component: loadable(() => import(`./templates/Dial/Master/DialStaff`)),
    path: "/master/staff_setting",
    exact: true,
    protectedRoute: true
  }
];

export const seal = [
  {
    component: loadable(() => import(`./templates/Print/Seal`)),
    path: "/print/seal",
    exact: true,
    protectedRoute: true
  }
];
export const PatientGroup = [
  {
    component: loadable(() => import(`./templates/Print/PatientGroup`)),
    path: "/print/PatientGroup",
    exact: true,
    protectedRoute: true
  }
];
export const CollectionList = [
  {
    component: loadable(() => import(`./templates//Print/CollectionList`)),
    path: "/print/collection_list",
    exact: true,
    protectedRoute: true
  }
];

export const DoctorKarte = [
  {
    component: loadable(() => import(`./templates/Print/DoctorKarte`)),
    path: "/print/DoctorKarte",
    exact: true,
    protectedRoute: true
  }
];

export const RecordSheet = [
  {
    component: loadable(() => import(`./templates/Print/RecordSheet`)),
    path: "/print/RecordSheet",
    exact: true,
    protectedRoute: true
  }
];

export const medicine_infor = [
  {
    component: loadable(() => import(`./templates/Print/MedicineInfor`)),
    path: "/print/medicine_infor",
    exact: true,
    protectedRoute: true
  }
];

export const DialInfo = [
  {
    component: loadable(() => import(`./templates/Print/DialInfo`)),
    path: "/print/DialInfo",
    exact: true,
    protectedRoute: true
  }
];

export const PrintLog = [
  {
    component: loadable(() => import(`./templates/Print/PrintLog`)),
    path: "/print/PrintLog",
    exact: true,
    protectedRoute: true
  }
];

export const DrProposal = [
  {
    component: loadable(() => import(`./templates/Print/DrProposal`)),
    path: "/print/DrProposal",
    exact: true,
    protectedRoute: true
  }
];
export const InstructionPrint = [
  {
    component: loadable(() => import(`./templates/Print/InstructionPrint`)),
    path: "/print/InstructionPrint",
    exact: true,
    protectedRoute: true
  }
];
export const DailyPrint = [
  {
    component: loadable(() => import(`./templates/Print/DailyPrint`)),
    path: "/print/DailyPrint",
    exact: true,
    protectedRoute: true
  }
];
export const DialCourse = [
  {
    component: loadable(() => import(`./templates/Print/DialCourse`)),
    path: "/print/DialCourse",
    exact: true,
    protectedRoute: true
  }
];

export const NutritionGuide = [
  {
    component: loadable(() => import(`./templates/Print/NutritionGuide`)),
    path: "/print/Nutrition_Guide",
    exact: true,
    protectedRoute: true
  }
];
//-----------------------------------------------------------------------

export const terminal_setting = [
  {
    component: loadable(() => import(`./templates/Maintenance/SystemSetting/SystemSettingMaster`)),
    path: "/maintenance/system_setting",
    exact: true,
    protectedRoute: true
  }
];

export const department_occupation = [
  {
    component: loadable(() => import(`./templates/Maintenance/DepartmentOccupation`)),
    path: "/maintenance/department_occupation",
    exact: true,
    protectedRoute: true
  }
];

export const authority = [
  {
    component: loadable(() => import(`./templates/Maintenance/Authority`)),
    path: "/maintenance/authority",
    exact: true,
    protectedRoute: true
  }
];

export const FootCareBasicInformationSetting = [
  {
    component: loadable(() => import(`./templates/Maintenance/FootCareBasicInformationSetting`)),
    path: "/maintenance/foot_care_basic_information_setting",
    exact: true,
    protectedRoute: true
  }
];

export const staff_operation_log = [
  {
    component: loadable(() => import(`./templates/Maintenance/StaffOperationLog`)),
    path: "/maintenance/staff_operation_log",
    exact: true,
    protectedRoute: true
  }
];

export const staff_operation_history_log = [
  {
    component: loadable(() => import(`./templates/Maintenance/StaffOperationHistoryLog`)),
    path: "/maintenance/staff_operation_history_log",
    exact: true,
    protectedRoute: true
  }
];
// 生理受付
export const PhysiologicalList = [
  {
    component: loadable(() => import(`./templates/OrderList/PhysiologicalList`)),
    path: "/physiological/order_list",
    exact: true,
    protectedRoute: true
  }
];
// 生理実施
export const PhysiologicalDoneList = [
  {
    component: loadable(() => import(`./templates/OrderList/PhysiologicalDoneList`)),
    path: "/physiological/done_list",
    exact: true,
    protectedRoute: true
  }
];
// 内視鏡受付
export const EndoscopeList = [
  {
    component: loadable(() => import(`./templates/OrderList/EndoscopeList`)),
    path: "/endoscope/order_list",
    exact: true,
    protectedRoute: true
  }
];
// 内視鏡実施
export const EndoscopeDoneList = [
  {
    component: loadable(() => import(`./templates/OrderList/EndoscopeDoneList`)),
    path: "/endoscope/done_list",
    exact: true,
    protectedRoute: true
  }
];

// 処置受付
export const OutPatientTreatList = [
  {
    component: loadable(() => import(`./templates/OrderList/OutPatientTreatList`)),
    path: "/outpatient_treat/order_list",
    exact: true,
    protectedRoute: true
  }
];

export const Inspection_Haruka = [
  {
    component: loadable(() => import(`./templates/Maintenance/Master/Inspection_Haruka`)),
    path: "/maintenance/master/inspection_haruka",
    exact: true,
    protectedRoute: true
  }
];

export const Treat_Haruka = [
  {
    component: loadable(() => import(`./templates/Maintenance/Master/Treat_Haruka`)),
    path: "/maintenance/master/treat_haruka",
    exact: true,
    protectedRoute: true
  }
];

export const Inspection_Kind_Haruka = [
  {
    component: loadable(() => import(`./templates/Maintenance/Master/Inspection_Kind_Haruka`)),
    path: "/maintenance/master/inspection_kind_haruka",
    exact: true,
    protectedRoute: true
  }
];

export const Endscope_Master_Haruka = [
  {
    component: loadable(() => import(`./templates/Maintenance/Master/Endscope_Master_Haruka`)),
    path: "/maintenance/master/endscope_master_haruka",
    exact: true,
    protectedRoute: true
  }
];

export const Part_Position_Master = [
  {
    component: loadable(() => import(`./templates/Maintenance/Master/Part_Position_Master`)),
    path: "/maintenance/master/part_position_master",
    exact: true,
    protectedRoute: true
  }
];

export const Department_Practice_Master = [
  {
    component: loadable(() => import(`./templates/Maintenance/Master/Department_Practice_Master`)),
    path: "/maintenance/master/department_practice_master",
    exact: true,
    protectedRoute: true
  }
];

export const Treat_Practice_Master = [
  {
    component: loadable(() => import(`./templates/Maintenance/Master/Treat_Practice_Master`)),
    path: "/maintenance/master/treat_practice_master",
    exact: true,
    protectedRoute: true
  }
];

export const Examination_Master = [
  {
    component: loadable(() => import(`./templates/Maintenance/Master/Examination_Master`)),
    path: "/maintenance/master/examination_master",
    exact: true,
    protectedRoute: true
  }
];

export const Examination_Category_Tab = [
  {
    component: loadable(() => import(`./templates/Maintenance/Master/Examination_Category_Tab`)),
    path: "/maintenance/master/examination_category_tab",
    exact: true,
    protectedRoute: true
  }
];

export const Treat_Set_Master = [
  {
    component: loadable(() => import(`./templates/Maintenance/Master/Treat_Set_Master`)),
    path: "/maintenance/master/treat_set_master",
    exact: true,
    protectedRoute: true
  }
];

export const Exam_Book_Master = [
  {
    component: loadable(() => import(`./templates/Maintenance/Master/Exam_Book_Master`)),
    path: "/maintenance/master/exam_book_master",
    exact: true,
    protectedRoute: true
  }
];

export const Exam_Set_Master = [
  {
    component: loadable(() => import(`./templates/Maintenance/Master/Exam_Set_Master`)),
    path: "/maintenance/master/exam_set_master",
    exact: true,
    protectedRoute: true
  }
];

export const Radiation_Order_Master = [
  {
    component: loadable(() => import(`./templates/Maintenance/Master/Radiation_Order_Master`)),
    path: "/maintenance/master/radiation_order_master",
    exact: true,
    protectedRoute: true
  }
];

export const Radiation_Part_Master = [
  {
    component: loadable(() => import(`./templates/Maintenance/Master/Radiation_Part_Master`)),
    path: "/maintenance/master/radiation_part_master",
    exact: true,
    protectedRoute: true
  }
];

export const Addition_Master = [
  {
    component: loadable(() => import(`./templates/Maintenance/Master/Addition_Master`)),
    path: "/maintenance/master/addition_master",
    exact: true,
    protectedRoute: true
  }
];
export const Guidance_Master = [
  {
    component: loadable(() => import(`./templates/Maintenance/Master/Guidance_Master`)),
    path: "/maintenance/master/guidance_master",
    exact: true,
    protectedRoute: true
  }
];
export const Inhome_Master = [
  {
    component: loadable(() => import(`./templates/Maintenance/Master/Inhome_Master`)),
    path: "/maintenance/master/inhome_master",
    exact: true,
    protectedRoute: true
  }
];
export const Spirit_Master = [
  {
    component: loadable(() => import(`./templates/Maintenance/Master/Spirit_Master`)),
    path: "/maintenance/master/spirit_master",
    exact: true,
    protectedRoute: true
  }
];

export const Function_Item_Master = [
  {
    component: loadable(() => import(`./templates/Maintenance/Master/Function_Item_Master`)),
    path: "/maintenance/master/function_item_master",
    exact: true,
    protectedRoute: true
  }
];

export const Rehabily_Reception_List = [
  {
    component: loadable(() => import(`./templates/OrderList/OrderDoneList`)),
    path: "/order_list/reception/rehabily",
    exact: true,
    protectedRoute: true
  }
];
export const Rehabily_Done_List = [
  {
    component: loadable(() => import(`./templates/OrderList/OrderDoneList`)),
    path: "/order_list/done/rehabily",
    exact: true,
    protectedRoute: true
  }
];
export const Guidance_Done_List = [
  {
    component: loadable(() => import(`./templates/OrderList/OrderDoneList`)),
    path: "/order_list/done/guidance",
    exact: true,
    protectedRoute: true
  }
];
export const Radiation_Reception_List = [
  {
    component: loadable(() => import(`./templates/OrderList/RadiationOrderDoneList`)),
    path: "/order_list/reception/radiation",
    exact: true,
    protectedRoute: true
  }
];
export const Radiation_Done_List = [
  {
    component: loadable(() => import(`./templates/OrderList/RadiationOrderDoneList`)),
    path: "/order_list/done/radiation",
    exact: true,
    protectedRoute: true
  }
];
export const Reservation_Schedule = [
  {
    component: loadable(() => import(`./templates/Patient/Modals/Reservation/ReservationSchedule`)),
    path: "/reservation/schedule",
    exact: true,
    protectedRoute: true
  }
];
export const Visit_Treatment_Schedule = [
  {
    component: loadable(() => import(`./templates/Patient/Modals/Visit/VisitTreatmentSchedule`)),
    path: "/visit/schedule",
    exact: true,
    protectedRoute: true
  }
];
export const VisitGroupMaster = [
  {
    component: loadable(() => import(`./templates/Patient/Modals/Visit/VisitGroupMaster`)),
    path: "/visit/group_master",
    exact: true,
    protectedRoute: true
  }
];
export const VisitScheduleList = [
  {
    component: loadable(() => import(`./templates/Patient/Modals/Visit/VisitTreatmentScheduleList`)),
    path: "/visit_schedule_list",
    exact: true,
    protectedRoute: true
  }
];
export const LoginList = [
  {
    component: loadable(() => import(`./templates/LoginList`)),
    path: "/login_list",
    exact: true,
    protectedRoute: true
  }
];
export const NotDoneList = [
  {
    component: loadable(() => import(`./templates/NotDoneList`)),
    path: "/not_done/list",
    exact: true,
    protectedRoute: true
  }
];

export const ReservationList = [
  {
    component: loadable(() => import(`./templates/Patient/Modals/Reservation/ReservationScheduleList`)),
    path: "/reservation_list",
    exact: true,
    protectedRoute: true
  }
];

export const MenuSetting = [
  {
    component: loadable(() => import(`./templates/Maintenance/Master/MenuSetting`)),
    path: "/maintenance/menu_setting",
    exact: true,
    protectedRoute: true
  }
];
export const SystemSetting = [
  {
    component: loadable(() => import(`./templates/Maintenance/SystemSetting`)),
    path: "/system_setting",
    exact: true,
    protectedRoute: true
  }
];
export const UsageDataUpload = [
  {
    component: loadable(() => import(`./templates/Maintenance/Japic/UsageDataUpload`)),
    path: "/japic/usage_data_upload",
    exact: true,
    protectedRoute: true
  }
];

export const StickyNoteMaster = [
  {
    component: loadable(() => import(`./templates/Maintenance/Master/StickyNoteMaster`)),
    path: "/maintenance/sticky_note_master",
    exact: true,
    protectedRoute: true
  }
];

export const DocotrDataUpload = [
  {
    component: loadable(() => import(`./templates/Maintenance/Master/DocotrDataUpload`)),
    path: "/maintenance/doctor_data_upload",
    exact: true,
    protectedRoute: true
  }
];

export const BMLExamMasterUpload = [
  {
    component: loadable(() => import(`./templates/Maintenance/Master/BMLExamMasterUpload`)),
    path: "/maintenance/bml_exam_master_upload",
    exact: true,
    protectedRoute: true
  }
];

export const BMLExamMasterCSVUpload = [
  {
    component: loadable(() => import(`./templates/Maintenance/Master/BMLExamMasterCSVUpload`)),
    path: "/examination/import/bml_csv",
    exact: true,
    protectedRoute: true
  }
];

export const DiagnosisMaster = [
  {
    component: loadable(() => import(`./templates/Maintenance/Master/DiagnosisMaster`)),
    path: "/maintenance/diagnosis_master",
    exact: true,
    protectedRoute: true
  }
];

export const ObservationMaster = [
  {
    component: loadable(() => import(`./templates/Maintenance/Master/ObservationMaster`)),
    path: "/maintenance/observation_master",
    exact: true,
    protectedRoute: true
  }
];

export const ErrorPage = [
  {
    component: loadable(() => import(`./templates/ErrorPage`)),
    path: "/error_page",
    exact: true,
    protectedRoute: true
  }
];

export const KartePatient = [
  {
    component: loadable(() => import(`./templates/KartePatient`)),
    path: "/karte_patient",
    exact: true,
    protectedRoute: true
  }
];

export const SelfInspectionList = [
  {
    component: loadable(() => import(`./templates/InspectionList/SelfInspectionList`)),
    path: "/self_inspection_list",
    exact: true,
    protectedRoute: true
  }
];

export const Medicine_Use_History = [
  {
    component: loadable(() => import(`./templates/InspectionList/MedicineUseHistoryList`)),
    path: "/medicine_use_history",
    exact: true,
    protectedRoute: true
  }
];

export const EmergencyPatients = [
  {
    component: loadable(() => import(`./templates/Emergency/EmergencyPatientList`)),
    path: "/emergency_patients",
    exact: true,
    protectedRoute: true
  }
];

export const HospitalWardMap = [
  {
    component: loadable(() => import(`./templates/Ward/WardMap`)),
    path: "/hospital_ward_map",
    exact: true,
    protectedRoute: true
  }
];

export const EatingOutput = [
  {
    component: loadable(() => import(`./templates/EatOutput/EatingOutputList`)),
    path: "/eat_output",
    exact: true,
    protectedRoute: true
  }
];

export const PatientLedger = [
  {
    component: loadable(() => import(`./templates/Print/PatientLedger`)),
    path: "/print/patient_ledger",
    exact: true,
    protectedRoute: true
  }
];

export const BulletinRead = [
  {
    component: loadable(() => import(`./templates/Maintenance/BulletinRead`)),
    path: "/entrance_bulletin_board/read",
    exact: true,
    protectedRoute: true
  }
];

export const HomeDialPrint = [
    {
        component: loadable(() => import(`./templates/Print/HomeDialPrint`)),
        path: "/print/home_dial",
        exact: true,
        protectedRoute: true
    }
];

export const MealInstructionList = [
  {
    component: loadable(() => import(`./templates/Meal/MealInstructionList`)),
    path: "/meal_instruction_list",
    exact: true,
    protectedRoute: true
  }
];

export const MealPrescriptionList = [
  {
    component: loadable(() => import(`./templates/Meal/MealPrescriptionList`)),
    path: "/meal_prescription_list",
    exact: true,
    protectedRoute: true
  }
];

export const MealInformationList = [
  {
    component: loadable(() => import(`./templates/Meal/MealInformationList`)),
    path: "/meal_information_list",
    exact: true,
    protectedRoute: true
  }
];
