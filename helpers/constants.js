import * as sessApi from "~/helpers/cacheSession-utils";
import {formatDateFull, formatDateLine, formatJapanDateSlash, formatTimeIE} from "~/helpers/date";
import * as apiClient from "~/api/apiClient";
import React from "react";
import {displayLineBreak} from "~/helpers/dialConstants";

// export const IS_DEVELOP = process.env.NODE_ENV !== "production";
export const IS_DEVELOP = false;

export const KEY_CODES = {
  backspace: 8,
  tab: 9,
  enter: 13,
  esc: 27,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  del: 46,
  period: 190,
  period_ten: 110,
  one: 49
};

export const PRESCRIPTION_FEATURE_AUTHS = {
  100153: "一覧閲覧"
};

export const SOAP_TREE_CATEGORY = {
  CURRENT_SOAP: 1,
  ALL_SOAP: 2,
  ALL_ORDER: 3,
  ALL_EXAMINATION: 4,
  CURRENT_SOAP_LATEST: 5,
  ALL_SOAP_LATEST: 6,
  ALL_ORDER_LATEST: 7,
  ALL_EXAMINATION_LATEST: 8,
  ALL_INSPECTION: 9,
  ALL_INSPECTION_LATEST: 10,
  ALL_TREATMENT: 11,
  ALL_TREATMENT_LATEST: 12,
  // --------------------------------
  ALL_HOSPITAL: 13,
  ALL_HOSPITAL_LATEST: 14,
  ALL_REHABILY: 15,
  ALL_REHABILY_LATEST: 16,
  ALL_RADIATION: 17,
  ALL_RADIATION_LATEST: 18,
  CURRENT_ORDER: 19, // 処方、注射ページの自科
  CURRENT_ORDER_LATEST: 20, // 処方、注射ページの全科
  ALL_EXECUTE_ORDER: 21,// 「オーダ」
  ALL_EXECUTE_ORDER_LATEST: 22,// 「オーダ」
  CURRENT_EXAMINATION: 23,// 「結果・報告」(自科)
  CURRENT_EXAMINATION_LATEST: 24,// 「結果・報告」(自科)
  GLOBAL_EXAMINATION: 25,// 「結果・報告」(全科)
  GLOBAL_EXAMINATION_LATEST: 26,// 「結果・報告」(全科)
  GROUP_EXAMINATION: 27,// 「結果・報告」(自科・全科)
  ALL_SOAP_TAG_LATEST: 28,// 付箋ツリー
  ALL_SOAP_TAG: 29,// 付箋ツリー
  SEARCH_CONDITION: 30,// 付箋ツリー
  ALL_HOSPITAL_ORDER: 31,// 入院
  ALL_HOSPITAL_ORDER_LATEST: 32,// 入院
  ALL_PROGRESS:33, //プログレスノート
  ALL_PROGRESS_LATEST:34, //プログレスノート
}

export const TREE_FLAG = {
  OPEN_TREE: 0,
  CLOSE_TREE: 1,
  CLOSE_LATEST: 2,
}

export const WEEKDAYS = [
  '日',
  '月',
  '火',
  '水',
  '木',
  '金',
  '土'
];
export const Karte_Steps = {
  Patients: 0,
  Prescription : 1,
  Injection : 2,
  Soap : 3,
  Examination : 4,
  Hospital_Bed : 5, //入院実施 病床重複
  Hospital_In : 6, //入院申込・入院決定
  Discharge_Permit : 7, //退院許可
  Discharge_Decision : 8, //退院決定
  Discharge_Done : 9, //退院実施
  Ward_Move_Cancel : 10, //転棟転室取り消し
  Change_Responsibility_Cancel : 11, //担当変更取り消し
  Hospital_Done_Cancel : 12, //入院実施取り消し
  Discharge_Cancel : 13, //退院取り消し
  Hospital_Going_Cancel : 13, //退院取り消し
  Inspection_Stop : 14, //内視鏡の中止
};

export const Karte_Step_Title = {
  0 : "診察終了",
  1 : "処方",
  2 : "注射",
  3 : "SOAP",
  4 : "検体検査",
};

export const Karte_Types = {
  Register : 1,
  Update : 2,
  Delete : 3,
  Response : 4
};

export const Karte_Messages =  {
  1: "登録をしました",
  2:"の編集を確定しました",
  3:"の中止を確定しました"
};

export const Karte_Urls = {
  0: "patients",
  1: "prescription",
  2: 'injection',
  3: "soap",
};

export const CATEGORY_TYPE = {
  SOAP: 0,
  PRESCRIPTION: 1,
  INJECTION: 2,
  EXAMINATION: 3,
  INSPECTION: 4,
  TREATMENT: 5,
  ALLERGY: 6,
  GUIDANCE: 7,
  HOME: 8,
  SPIRIT: 9,
  REHABILY: 10,
  RADIATION: 11,
  HOMETREATMENT: 12,
  DISCHARGE_PERMIT: 13,
  CHANGE_RESPONSIBILITY: 14,
  MEAL: 15,
  IN_HOSPITAL_APP: 16, // 入院申込オーダ
  IN_HOSPITAL_DEC: 17, // 入院決定オーダ
  STOP_PRESCRIPTION: 18, // 中止処方
  HOSPITAL_OUT: 19, //外泊・外出
  HOSPITAL_RETURN: 20, //帰院
  BACILLUS:21,         //細菌検査
  MEDICINE_GUIDANCE: 22, //服薬指導
  NUTRITION_GUIDANCE: 23, //栄養指導依頼
  MEDICAL_EXAMINATION_RECORD: 24, //診察済記録オーダ
  HOSPITALTREATMENT: 25,
  DISCHARGE_DONE: 26, //退院実施
  DISCHARGE_DECISION: 27, //退院決定
  HOSPITAL_DONE: 28, //入院実施
  MEAL_GROUP: 29, //食事一括指示
  DOCUMENT_CREATE: 30, //文書作成
  DISCHARGE_GUIDANCE_REPORT: 31, //退院時指導レポート
  WARD_MOVE: 32, //転棟転室取り消し
  DEATH_REGISTER: 33, //死亡登録
  ENDOSCOPE: 34, //内視鏡
  CYTOLOGY: 35, // 細胞診検査
  PATHOLOGY: 36, //病理検査
  BACTERIAL: 37,  //細菌検査
};

export const OPERATION_TYPE = {
  REGIST: 0,
  EDIT: 1,
  DELETE: 2,
  DONE: 3,
  STOP: 4
};

export const CACHE_LOCALNAMES = {
  KARTE_CACHE_NAME:"haruka_cache_karte",
  PATIENT_INFORMATION: "patient",
  BEFORE_PAGE: "before_page",
  PRESCRIPTION_EDIT:"prescription_edit",
  PRESCRIPTION_DELETE:"prescription_delete",
  PRESCRIPTION_DELETE_HISTORY:"prescription_delete_history",
  PRESCRIPTION_DONE:"prescription_done",
  PRESCRIPTION_DONE_HISTORY:"prescription_done_history",
  INJECTION_EDIT:"injection_edit",
  INJECTION_DELETE:"injection_delete",
  INJECTION_DELETE_HISTORY:"injection_delete_history",
  INJECTION_DONE:"injection_done",
  INJECTION_DONE_HISTORY:"injection_done_history",
  SOAP_EDIT: "soap_edit",
  SOAP_DELETE: "soap_delete",
  EXAM_EDIT : "examination_edit",
  EXAM_DELETE: "exam_delete",
  EXAM_ORDER_DONE: "exam_order_done",
  INSPECTION_EDIT : "inspection_edit",
  INSPECTION_DELETE : "inspection_delete",
  TREATMENT_EDIT : "treatment_edit",
  TREATMENT_DELETE : "treatment_delete",
  ALLERGY_EDIT: "allergy_edit",
  ALLERGY_DELETE: "allergy_delete",
  ACCEPT_DATA: "accept_data",
  CALC : "haruka_calc_formula",
  DIAGNOSIS : "haruka_priscription_diagnosis",
  DONE_ORDER: "haruka_done_cache",
  INJECTION_DONE_ORDER: "haruka_inject_done_cache",
  TEMPORARYUSER: "haruka_temporary_user",
  PATIENT_PRESCRIPTION_EDIT: "haruka_edit_cache",
  PATIENT_INJECTION_EDIT: "haruka_inject_edit_cache",
  PATIENTSLIST : "patients_list",
  CUR_PATIENT : "current_patient",
  GUIDANCE_EDIT : "guidance_edit",
  GUIDANCE_DELETE : "guidance_delete",
  RIHABILY_EDIT:"rihabily_edit",
  RIHABILY_DELETE: "rihabily_delete",
  RADIATION_EDIT:"radiation_edit",
  RADIATION_DELETE:"radiation_delete",
  HARUKA_SEAL_PRINT:"haruka_seal_print",
  RESERVATION_INFO:"reservation_info",
  VISIT_INFO:"visit_info",
  DROP_INJECTION_DATA: "haruka_drop_injection_data", // ドラッグ&ドロップ操作時注射データ保存
  CONTRAINDICATION_DISEASE_DATA: "haruka_contraindication_disease", // 病名禁忌
  ORDER_SORT: "odrer_sort",
  MIDDLE_ORDER_OPEN: "middle_order_open",
  SOAP_PAGE_NUMBER : "soap_page_number",
  INSPECTION_PAGE_NUMBER : "inspection_page_number",
  KARTE_HOLIDAYS : "karte_holidays",
  FIRST_KARTE_DATA : "first_karte_data",
  PRESET_DO_PRESCRIPTION : "preset_do_prescription",
  PRESET_DO_DEPLOYMENT : "preset_do_deployment",
  ACTIVE_KEY: "active_key",// 処方複数登録対応
  WARD_MAP: "ward_map",// WARD_MAP
  DISCHARGE_PERMIT: "discharge_permit",// 退院許可
  DISCHARGE_DONE: "discharge_done",// 退院実施
  DISCHARGE_DECISION: "discharge_decision",// 退院決定
  CHANGE_RESPONSIBILITY: "change_responsibility",// 担当変更
  CHANGE_RESPONSIBILITY_DELETE: "change_responsibility_delete",// 担当変更取り消し
  MEAL_EDIT: "meal_edit",// 食事オーダ
  MEAL_GROUP_EDIT: "meal_group_edit",// 食事一括指示
  IN_HOSPITAL_EDIT: "in_hospital_edit",// 入院決定オーダ, 入院申込オーダ
  IN_HOSPITAL_DELETE: "in_hospital_delete",// 入院決定オーダ, 入院申込オーダ
  STOP_PRESCRIPTION_EDIT: "stop_prescription_edit",// 中止処方
  HOSPITAL_OUT: "hospital_out", //外泊・外出
  HOSPITAL_RETURN: "hospital_return", //帰院
  BACILLUS_EDIT:'bacillus_edit',      //細菌検査
  BACILLUS_DELETE:'bacillus_delete',  //細菌検査
  MEDICINE_GUIDANCE_EDIT:"medicine_guidance_edit", // 服薬指導
  MEDICINE_GUIDANCE_DELETE:"medicine_guidance_delete", // 服薬指導
  NUTRITION_GUIDANCE: "nutrition_guidance", //栄養指導依頼
  MEDICAL_EXAMINATION_RECORD: "medical_examination_record", //診察済記録オーダ
  TREE_WIDTH:"tree_width", //処方・注射・SOAPの左ツリー width
  SOAP_CATEGORY:"soap_category", //"soap" : プログレスノート, "hospital_note" : 初診・入院時ノート
  // 自動ログアウトした後にログインすると復元されてしまうものが他にもあると思われます
  CAN_SHOW_MODAL: "can_show_modal",
  PATIENT_CACHE_NAME:"haruka_cache_patient",
  CONTRAINDICATION_DISEASE:"contraindication_disease",
  CONTRAINDICATION_DISEASE_API:"contraindication_disease_api",
  PAC_STATUS:"pac_status", // YJ34 PACS機能の修正 on, off
  PRESET_DO:"preset_do",
  HOSPITAL_DONE: "hospital_done", //入院実施
  HOSPITAL_DONE_DELETE: "hospital_done_delete", //入院実施取り消し
  WARD_MOVE_DELETE: "ward_move_delete", //転棟転室取り消し
  DOCUMENT_CREATE: "document_create", //文書作成
  DOCUMENT_DELETE: "document_delete", //文書作成
  DISCHARGE_GUIDANCE_REPORT: "discharge_guidance_report", //退院時指導レポート
  DISCHARGE_DELETE: "discharge_delete", //退院取り消し
  HOSPITAL_GOING_DELETE: "hospital_going_delete", //外泊,帰院取り消し
  DEATH_REGISTER: "death_register", //死亡登録
  DEATH_REGISTER_DELETE: "death_register_delete", //死亡登録
  
  CYTOLOGY_EXAM_EDIT : "cytology_exam_edit",  //細胞診検査
  CYTOLOGY_EXAM_DELETE: "cytology_exam_delete",
  CYTOLOGY_EXAM_DONE: "cytology_exam_done",
  
  PATHOLOGY_EXAM_EDIT : "pathology_exam_edit",  //病理検査
  PATHOLOGY_EXAM_DELETE: "pathology_exam_delete",
  PATHOLOGY_EXAM_DONE: "pathology_exam_done",
  
  BACTERIAL_EXAM_EDIT : "bacterial_exam_edit",  //細菌検査
  BACTERIAL_EXAM_DELETE: "bacterial_exam_delete",
  BACTERIAL_EXAM_DONE: "bacterial_exam_done",
};

export const CACHE_SESSIONNAMES = {
  PATIENT_EXAM : "haruka_cache_examination",
  PATIENT_INSPECTION : "haruka_cache_inspection",
  PATIENT_TREATMENT : "haruka_cache_treatment",
  EXAMORDER_DONE_ORDER: "haruka_exam_done_cache",
  LOCK_SCREEN: "lock_screen",
  HARUKA : "haruka",
  // PATIENTSLIST : "patients_list",
  PATIENT_SOAP_EDIT: "haruka_soap_current_edit",
  INIT_STATUS: "init_status",
  DIAL_BOARD : "dial_board_data",
  COMMON_MASTER : "dial_common_master",
  // remove shema symbol (record selected symbole id)
  SHEMA_SELECTED_SYMBOL_TIME : "shema_selected_symbol_time",
  // shema selected Tool
  SHEMA_SELECTED_TOOL : "",
  HOSPITAL_ALLERGY : "haruka_hospital_allergy",
};

export const LETTER_DATA = {
  letterData: [
    {id: 1, label: "あ", value: "あ"},
    {id: 2, label: "か", value: "か"},
    {id: 3, label: "さ", value: "さ"},
    {id: 4, label: "た", value: "た"},
    {id: 5, label: "な", value: "な"},
    {id: 6, label: "は", value: "は"},
    {id: 7,label: "ま",value: "ま"},
    {id: 8,label: "や",value: "や"},
    {id: 9,label: "ら",value: "ら"},
    {id: 10,label: "わ",value: "わ"},
    {id: 11,label: "ん",value: "ん"},
    {id: 54,label: "ぁ",value: "ぁ"},
    {id: 12,label: "い",value: "い"},
    {id: 13,label: "き",value: "き"},
    {id: 14,label: "し",value: "し"},
    {id: 15,label: "ち",value: "ち"},
    {id: 16,label: "に",value: "に"},
    {id: 17,label: "ひ",value: "ひ"},
    {id: 18,label: "み",value: "み"},
    {id: 19,label: "り",value: "り"},
    {id: 47,label: "ー",value: "ー"},
    {id: 48,label: "っ",value: "っ"},
    {id: 55,label: "ぃ",value: "ぃ"},
    {id: 20,label: "う",value: "う"},
    {id: 21,label: "く",value: "く"},
    {id: 22,label: "す",value: "す"},
    {id: 23,label: "つ",value: "つ"},
    {id: 24,label: "ぬ",value: "ぬ"},
    {id: 25,label: "ふ",value: "ふ"},
    {id: 26,label: "む",value: "む"},
    {id: 27,label: "ゆ",value: "ゆ"},
    {id: 28,label: "る",value: "る"},
    {id: 49,label: "ゃ",value: "ゃ"},
    {id: 56,label: "ぅ",value: "ぅ"},
    {id: 29,label: "え",value: "え"},
    {id: 30,label: "け",value: "け"},
    {id: 31,label: "せ",value: "せ"},
    {id: 32,label: "て",value: "て"},
    {id: 33,label: "ね",value: "ね"},
    {id: 34,label: "へ",value: "へ"},
    {id: 35,label: "め",value: "め"},
    {id: 36,label: "れ",value: "れ"},
    {id: 50,label: "゛",value: "゛"},
    {id: 51,label: "ゅ",value: "ゅ"},
    {id: 57,label: "ぇ",value: "ぇ"},
    {id: 37,label: "お",value: "お"},
    {id: 38,label: "こ",value: "こ"},
    {id: 39,label: "そ",value: "そ"},
    {id: 40,label: "と",value: "と"},
    {id: 41,label: "の",value: "の"},
    {id: 42,label: "ほ",value: "ほ"},
    {id: 43,label: "も",value: "も"},
    {id: 44,label: "よ",value: "よ"},
    {id: 45,label: "ろ",value: "ろ"},
    {id: 46,label: "を",value: "を"},
    {id: 52,label: "゜",value: "゜"},
    {id: 53,label: "ょ",value: "ょ"},
    {id: 58,label: "ぉ",value: "ぉ"},
  ],
}

export const KARTE_STATUS_TYPE = [
  {
    id: 0,
    value: "外来"
  },
  {
    id: 1,
    value: "入院"
  },
  {
    id: 2,
    value: "訪問診療"
  }
];

export const HOSPITALIZE_PRESCRIPTION_TYPE = [ // php change
  {
    id: 0,
    value: "臨時"
  },
  {
    id: 1,
    value: "退院時"
  },
  {
    id: 2,
    value: "実施済"
  },
  {
    id: 3,
    value: "定期"
  },
  {
    id: 4,
    value: "つなぎ"
  },
  {
    id: 5,
    value: "持参薬"
  }
];

export const EXITUS_REASON = [
  {
    id: 0,
    value: ""
  },
  {
    id: 1,
    value: "治癒"
  },
  {
    id: 2,
    value: "死亡"
  },
  {
    id: 3,
    value: "中止"
  },
  {
    id: 4,
    value: "転医"
  }
];

export const PERMISSION_TYPE = {
  DIAGNOSIS: "diagnosis_permission",
  USAGE: "usage_permission",
  PERIOD: "period_permission",
  ALERT: "alert_permission",
  DUPLICATE: "duplciate_permission",
  DISEASE: "disease_permission",
}

export const FAMILY_CLASS = {
  GRAND_PARENT:-2,
  PARENT:-1,
  SAME:0,
  CHILD:1,
  GRAND_CHILD:2,
}

export const TIMEZONE = {
  1: "午前",
  2: "午後",
  3: "夜間",
  4: "深夜"
}

export const EXAMINATION_TYPE = {
  EXAMINATION: 1, // 検体検査
  CYTOLOGY: 2,    // 細胞診検査
  BACTERIAL: 3,   // 細菌・抗酸菌検査
  PATHOLOGY: 4    // 病理組織検査
};

export const RADIATION_NAME = [
  {id: 0, value: "全て"},
  {id: 1, value: "X線"},
  {id: 2, value: "透視造影TV"},
  {id: 3, value: "CT"},
  {id: 4, value: "MRI"},
  {id: 5, value: "MRI（藤井寺市民）"},
  {id: 6, value: "MMG"},
  {id: 7, value: "眼底検査"},
  {id: 8, value: "他医撮影診断"},
]

export const STATUS_OPTIONS = [
  {id: 0, value: "全て"},
  {id: 1, value: "未受付"},
  {id: 2, value: "受付済み"},
  {id: 3, value: "実施"}
];
export const EXAM_DONE_STATUS = {
 NOT_RECEPTION: 0,
 RECEPTION_DONE: 1,
 COLLECTION_WAIT: 2,
 COLLECTION_DONE: 3,
 COMPLETE_DONE: 4,
  IN_RESULT_DONE: 5,
  OUT_RESULT_DONE: 6,
  INOUT_RESULT_DONE: 7,
};
export const EXAM_STATUS_OPTIONS = {
  NOT_RECEPTION:"未受付",
  COLLECTION_WAIT:"採取待ち",
  COLLECTION_DONE:"採取済み",
  RECEPTION_DONE:"検査受付済み",
  COMPLETE_DONE:"検査済未登録",
  IN_RESULT_DONE:"院内結果登録済",
  OUT_RESULT_DONE:"外注結果登録済",
  INOUT_RESULT_DONE:"院外結果登録済",
};
export const BODY_PART_DATA = [
  {id: 1,label: "顔",value: "顔"},
  {id: 2,label: "頭部",value: "頭部"},
  {id: 3,label: "眼",value: "眼"},
  {id: 4,label: "右眼",value: "右眼"},
  {id: 5,label: "左眼",value: "左眼"},
  {id: 6,label: "両眼",value: "両眼"},
  {id: 7,label: "鼻",value: "鼻"},
  {id: 8,label: "首",value: "首"},
  {id: 10,label: "右肩",value: "右肩"},
  {id: 11,label: "左肩",value: "左肩"},
  {id: 12,label: "両肩",value: "両肩"},
  {id: 13,label: "胸",value: "胸"},
  {id: 14,label: "腹",value: "腹"},
  {id: 15,label: "背中",value: "背中"},
  {id: 16,label: "腰",value: "腰"},
  {id: 161,label: "臀部",value: "臀部"},
  {id: 162,label: "右臀部",value: "右臀部"},
  {id: 163,label: "左臀部",value: "左臀部"},
  {id: 201,label: "右上腕",value: "右上腕"},
  {id: 202,label: "左上腕",value: "左上腕"},
  {id: 203,label: "両上腕",value: "両上腕"},
  {id: 22,label: "右肘",value: "右肘"},
  {id: 23,label: "左肘",value: "左肘"},
  {id: 24,label: "両肘",value: "両肘"},
  {id: 241,label: "右前腕",value: "右前腕"},
  {id: 242,label: "左前腕",value: "左前腕"},
  {id: 243,label: "両前腕",value: "両前腕"},
  {id: 244,label: "右手首",value: "右手首"},
  {id: 245,label: "左手首",value: "左手首"},
  {id: 246,label: "両手首",value: "両手首"},
  {id: 25,label: "手",value: "手"},
  {id: 26,label: "右手",value: "右手"},
  {id: 27,label: "左手",value: "左手"},
  {id: 28,label: "両手",value: "両手"},
  {id: 29,label: "膝",value: "膝"},
  {id: 30,label: "右膝",value: "右膝"},
  {id: 31,label: "左膝",value: "左膝"},
  {id: 32,label: "両膝",value: "両膝"},
  {id: 34,label: "右足",value: "右足"},
  {id: 35,label: "左足",value: "左足"},
  {id: 36,label: "両足",value: "両足"},
  {id: 37,label: "右踵",value: "右踵"},
  {id: 38,label: "左踵",value: "左踵"},
  {id: 39,label: "両踵",value: "両踵"}
];
// 療法
export const THERAPHY = [
  { id:1, value:"理学療法"},
  { id:2, value:"作業療法"},
  { id:3, value:"言語療法"},
];
//追加品名機能ID
export const FUNCTION_ID_CATEGORY = {
  GUIDANCE: 1,
  HOME: 2,
  RADIATION: 3,
  SPIRIT: 4,
  RIHABILY: 5,
  TREATMENT: 6,
  PRESCRIPTION: 7,
  INJECTION: 8,
  ENDOSCOPE: 9,
};
// bolierplate 機能ID
export const BOILERPLATE_FUNCTION_ID_CATEGORY = {
  PRESCRIPTION: 7,
  INJECTION: 8,
  ALLERGY: 9,
  MEAL: 10,
};

export const ALLERGY_STATUS_ARRAY = {1:"未検査", 2:"陰性のみ", 3:"陽性なし・不明あり", 4:"陽性あり"};

export const ALLERGY_TYPE_ARRAY = {
  past:"既往歴・アレルギー",
  foodalergy:"食物アレルギー",
  drugalergy:"薬剤アレルギー",
  disabled:"障害情報",
  vaccine:"患者ワクチン情報",
  adl:"ADL情報",
  infection:"感染症",
  alergy:"一般アレルギー",
  contraindication:"禁忌",
  process_hospital:"入院までの経過",
  inter_summary:"中間サマリー",
  current_symptoms_on_admission:"入院時現症",
};

export const KARTEMODE = {
  READ:0, // 閲覧
  WRITE:1, // 記載
  EXECUTE:2 // 事後
};

export const EXAM_CATEGORY = {
  CONDITION_IN:1,  // 院内検査
  CONDITION_OUT:2  // 院外検査
};

export const SOAP_IMPORTANCE = {1:"標準", 2:"重要", 3:"問題", 4:"注意"};
export const PER_PAGE = [{id:1, value:20},{id:2, value:50},{id:3, value:100},];

export const ALLERGY_CATEGORY = {
    MEDICINE:1,
    FOOD:2,
    CONTRAST:3,
    OTEHR:4,
    INTRRADERMAL:5,
    IMPLANT:6,
};

export const ALLERGY_CATEGORY_TITLE = {
    1:"アレルギー薬剤",
    2:"アレルギー食物",
    3:"造影剤",
    4:"その他アレルギー",
    5:"皮内テスト",
    6:"インプラント",
};
export const REHABILY_DISEASE = {
    0:"開始日",
    1:"発症日",
    2:"手術日",
    3:"急性増悪日",
    4:"治療開始日",
    5:"診断日",
    8:"新たな治療開始日",
    9:"新たな発症日",
};

export function getStrLength (str) {
  if (str == "") return 0;
  let nLength = 0;
  var kanaregexp = /[Ａ-Ｚａ-ｚ０-９]/g;
  for (let i = 0; i < str.length; ++i) {
    if(kanaregexp.test(str[i]) != true){
      nLength += 2;
    } else {
      nLength += 1;
    }
  }
  return nLength;
}

export function getEnableChangeMeal (_start_date, _master) {
  if (_master == undefined || _master == null || _master.length < 1 || _start_date == null || _start_date == undefined || _start_date == "") {
    return "";
  }
  let disable_ids = [];
  let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
  // let cache_noon_time = "09:00";
  let cache_noon_time = "13:45"; // 昼、前日13:45
  if (init_status != null && init_status != undefined && init_status.noon_time != undefined && init_status.noon_time != null) {
    cache_noon_time = init_status.noon_time;
  }
  // 昼食変更締め切り
  // 夕食変更締め切り
  // let cache_evening_time = "12:00";
  let cache_evening_time = "15:45"; // 夕、前日15:45
  if (init_status != null && init_status != undefined && init_status.evening_time != undefined && init_status.evening_time != null) {
    cache_evening_time = init_status.evening_time;
  }
  // let cache_morning_time = "17:00";
  let cache_morning_time = "10:15"; // 朝、前日10:15
  // （次の日の）朝食変更締め切り
  if (init_status != null && init_status != undefined && init_status.morning_time != undefined && init_status.morning_time != null) {
    cache_morning_time = init_status.morning_time;
  }
  let _date = formatDateLine(_start_date).split("-").join("/");
  let cur_time = new Date().getTime();
  let next_date = new Date();
  next_date.setDate(new Date().getDate()+1);
  let only_start_date = new Date(_date + " 00:00:00").getTime();
  let only_cur_date = new Date(formatDateLine(new Date()).split("-").join("/") + " 00:00:00").getTime();
  if (only_start_date < only_cur_date) {
    _master.map(ele=>{
      if (ele.value == "朝" || ele.value == "昼" || ele.value == "夕" || ele.value == "夜") {
        disable_ids.push(ele.id);
      }
    });    
    if (disable_ids.length > 0) {
      return  disable_ids.join(":");
    }
  }
  let morning_time_flag, evening_time_flag, noon_time_flag, night_time_flag;
  if(formatDateLine(new Date()) == formatDateLine(_start_date)) {
    morning_time_flag = -1;
    evening_time_flag = -1;
    noon_time_flag = -1;
    let cur_date = formatDateLine(new Date()).split("-").join("/");
    let morning_time = new Date(cur_date + " " + cache_morning_time + ":00").getTime();
    night_time_flag = (cur_time < morning_time) ? 1 : -1;
  } else if (formatDateLine(next_date) == formatDateLine(_start_date) ) {
    let cur_date = formatDateLine(new Date()).split("-").join("/");
    // （次の日の）朝昼夕食変更締め切り
    let morning_time = new Date(cur_date + " " + cache_morning_time + ":00").getTime();
    let evening_time = new Date( cur_date + " " + cache_evening_time + ":00").getTime();
    let noon_time = new Date(cur_date + " " + cache_noon_time + ":00").getTime();
    morning_time_flag = (cur_time < morning_time) ? 1 : -1;
    evening_time_flag = (cur_time < evening_time) ? 1 : -1;
    noon_time_flag = (cur_time < noon_time) ? 1 : -1;
    night_time_flag = 1;
  } else {
    morning_time_flag = 1;
    evening_time_flag = 1;
    noon_time_flag = 1;
    night_time_flag = 1;
  }
  // 夕食変更締め切り
  _master.map(ele=>{
    if (ele.value == "朝" && morning_time_flag == -1) {
      disable_ids.push(ele.id);
    }
    if (ele.value == "昼" && noon_time_flag == -1) {
      disable_ids.push(ele.id);
    }
    if (ele.value == "夕" && evening_time_flag == -1) {
      disable_ids.push(ele.id);
    }
    if (ele.value == "夜" && night_time_flag == -1) {
      disable_ids.push(ele.id);
    }
  });
    
  if (disable_ids.length > 0) {
    return  disable_ids.join(":");
  }    

  return "";
}

// 2020/11/16 by p
export function getEnableInitMeal (_start_date, _master, _initValCheck=false, _time_classification) {
  let ret = {
    start_date: null,
    start_time_classification: null
  };
  if (_master == undefined || _master == null || _master.length < 1 || _start_date == null || _start_date == undefined || _start_date == "") {
    return ret;
  }

  let equalStartCurrentDate = false;
  let setStartToCurrentDate = false;
  
  var next_date = new Date();
  next_date.setDate(new Date().getDate()+1);
  
  let current_time = new Date(formatDateLine(new Date()).split("-").join("/") + " 00:00:00").getTime();
  let compare_time = new Date(formatDateLine(next_date).split("-").join("/") + " 00:00:00").getTime();
  let start_date_time = new Date(formatDateLine(_start_date).split("-").join("/") + " 00:00:00").getTime();  

  // 1. ------------- _start_date > cur_date + 1 -------------------
  // all enable
  if (start_date_time > compare_time) {
    ret.start_date = _start_date;
    ret.start_time_classification = _time_classification;
    return ret;
  } else if(start_date_time == compare_time) {
  // 2. ------------------- _start_date == cur_date + 1 -------------------
  // 3. ------------------- _start_date < cur_date + 1 ( _start_date <= cur_date ) -------------------
    _start_date = next_date;
  } else if(start_date_time == current_time && _time_classification == 4) {
    // if start_date == current date, equalStartCurrentDate=true
    _start_date = next_date;
    equalStartCurrentDate = true;    
  } else {
    _start_date = next_date;
    _time_classification = null;

  }    

  let disable_ids = [];

  let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
  // let cache_noon_time = "09:00";
  let cache_noon_time = "13:45"; // 昼、前日13:45
  if (init_status != null && init_status != undefined && init_status.noon_time != undefined && init_status.noon_time != null) {
    cache_noon_time = init_status.noon_time;
  }

  // 昼食変更締め切り
  // 夕食変更締め切り
  // let cache_evening_time = "12:00";
  let cache_evening_time = "15:45"; // 夕、前日15:45
  if (init_status != null && init_status != undefined && init_status.evening_time != undefined && init_status.evening_time != null) {
    cache_evening_time = init_status.evening_time;
  }

  // let cache_morning_time = "17:00";
  let cache_morning_time = "10:15"; // 朝、前日10:15
  // （次の日の）朝食変更締め切り
  if (init_status != null && init_status != undefined && init_status.morning_time != undefined && init_status.morning_time != null) {
    cache_morning_time = init_status.morning_time;
  }
  
  let cur_time = new Date().getTime();      

  let morning_time_flag, evening_time_flag, noon_time_flag;  

  if (formatDateLine(next_date) == formatDateLine(_start_date) ) {
    let cur_date = formatDateLine(new Date()).split("-").join("/");    
    // （次の日の）朝昼夕食変更締め切り
    let morning_time = new Date(cur_date + " " + cache_morning_time + ":00").getTime();
    let evening_time = new Date( cur_date + " " + cache_evening_time + ":00").getTime();
    let noon_time = new Date(cur_date + " " + cache_noon_time + ":00").getTime();    

    morning_time_flag = (cur_time < morning_time) ? 1 : -1;
    evening_time_flag = (cur_time < evening_time) ? 1 : -1;
    noon_time_flag = (cur_time < noon_time) ? 1 : -1;    

    if (equalStartCurrentDate == true) {
      // if equalStartCurrentDate=true && _time_classification=夜
      if (morning_time_flag == -1) {
        _time_classification = null;
      } else {
        setStartToCurrentDate = true;
      }
    }
  } else {
    morning_time_flag = 1;
    evening_time_flag = 1;
    noon_time_flag = 1;
  }
  
  // 夕食変更締め切り

  _master.map(ele=>{
    if (ele.value == "朝" && morning_time_flag == -1) {
      disable_ids.push(ele.id);
    }
    if (ele.value == "昼" && noon_time_flag == -1) {
      disable_ids.push(ele.id);
    }
    if (ele.value == "夕" && evening_time_flag == -1) {
      disable_ids.push(ele.id);
    }
  });

  //●YJ205 入退院の食事開始・停止の補正の調整
  if (_initValCheck == true) {      
    let ret = {};
    ret.start_date = _start_date;
    ret.start_time_classification = _time_classification != null ? _time_classification : 1;
    if (disable_ids.includes(1) && disable_ids.includes(2) && disable_ids.includes(3)) {
      let new_date = new Date();
      new_date.setDate(_start_date.getDate()+1);
      ret.start_date = new_date;
      // ret.start_time_classification = 1;      
      ret.start_date = _start_date;
      ret.start_time_classification = 4;      
    } else {
      if (disable_ids.includes(1) && disable_ids.includes(2)) {
        ret.start_time_classification = 3;
      } else if(disable_ids.includes(1)) {
        ret.start_time_classification = 2;
        if (_time_classification == 3) ret.start_time_classification = 3;
      }
    }

    if (_time_classification == 4) {
      if (setStartToCurrentDate == true) {
        ret.start_date = new Date();
      }
      ret.start_time_classification = 4;
    }

    return ret;
  } else {    
    if (disable_ids.length > 0) {
      return  disable_ids.join(":");
    }
  }

  return "";
}



export const openPacs = (patient_id, type) => {
  let url = "";
  let url_type = "";

  switch(type){
    case "open":
      if (patient_id == undefined || patient_id == null || parseInt(patient_id) < 1) return;
      url ="http://TFS-C054/01Link/start.aspx?UserID=miyakojima&Password=miyakojima&ApplicationID=1600&RedirectURL=PatID%3d" + patient_id;
      url_type = "OpenPACS";
      var params = [
        'height='+screen.height,
        'width='+screen.width,
        'fullscreen=yes', // only works in IE, but here for completeness
        'resizable=yes'
      ].join(',');
      window.open(url, url_type, params);
      break;
    case "close":
      url ="http://tfs-c054/01Link/minimizeDV.aspx";
      url_type = "ClosePACS";
      window.open(url, url_type, "height=600,width=600");
      break;
    case "blank":
      url ="http://tfs-c054/01Link/minimizeDV.aspx";
      url_type = "_blank";
      window.open(url, url_type);
      break;
  }

  // if (patient_id == undefined || patient_id == null || parseInt(patient_id) < 1) return;

  // let url =
  //   "http://TFS-C054/01Link/start.aspx?UserID=miyakojima&Password=miyakojima&ApplicationID=1600&RedirectURL=PatID%3d" +
  //   patient_id;
  // // window.open(url, "OpenPACS", "height=600,width=600");
  // var params = [
  //   'height='+screen.height,
  //   'width='+screen.width,
  //   'fullscreen=yes', // only works in IE, but here for completeness
  //   'resizable=yes'
  // ].join(',');
  // window.open(url, "OpenPACS", params);
};

// auto reload setting info
export const getAutoReloadInfo = (_page) => {

  // get reload info from cache
  let cache_auto_reload = null;
  let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
  let ret = { "reload_time": 60, "status": 1 };
  if (init_status != null && init_status != undefined && init_status.auto_reload != undefined && init_status.auto_reload != null) {
    cache_auto_reload = init_status.auto_reload;
    if(cache_auto_reload[_page] != undefined) return cache_auto_reload[_page];
    if(cache_auto_reload['default'] != undefined) return cache_auto_reload['default'];
  }

  return ret;
};

export const getStaffName = (staff_number) => {    
  // get staff_name from staff_number
  if (staff_number === undefined || staff_number == null || staff_number == '') return '';
  let staffs_list = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"staffs_list");
  if (staffs_list === undefined || staffs_list == null || staffs_list.length == 0 || staffs_list[staff_number] === undefined)  return '';
  if (staffs_list[staff_number].name === undefined || staffs_list[staff_number].name == null) return '';
  return staffs_list[staff_number].name;
};

export const hankaku2Zenkaku = (str) => { // 使用例 hankaku2Zenkaku('１２３ａｂＣ');  // '123abC'
  return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
};

export const zenkana2Hankana = (str) => { // 使用例 zenkana2Hankana('アシタハイイテンキカナ、ブーヴー');  // 'ｱｼﾀﾊｲｲﾃﾝｷｶﾅ､ﾌﾞｰｳﾞｰ'
  var kanaMap = {
    "ガ": "ｶﾞ", "ギ": "ｷﾞ", "グ": "ｸﾞ", "ゲ": "ｹﾞ", "ゴ": "ｺﾞ",
    "ザ": "ｻﾞ", "ジ": "ｼﾞ", "ズ": "ｽﾞ", "ゼ": "ｾﾞ", "ゾ": "ｿﾞ",
    "ダ": "ﾀﾞ", "ヂ": "ﾁﾞ", "ヅ": "ﾂﾞ", "デ": "ﾃﾞ", "ド": "ﾄﾞ",
    "バ": "ﾊﾞ", "ビ": "ﾋﾞ", "ブ": "ﾌﾞ", "ベ": "ﾍﾞ", "ボ": "ﾎﾞ",
    "パ": "ﾊﾟ", "ピ": "ﾋﾟ", "プ": "ﾌﾟ", "ペ": "ﾍﾟ", "ポ": "ﾎﾟ",
    "ヴ": "ｳﾞ", "ヷ": "ﾜﾞ", "ヺ": "ｦﾞ",
    "ア": "ｱ", "イ": "ｲ", "ウ": "ｳ", "エ": "ｴ", "オ": "ｵ",
    "カ": "ｶ", "キ": "ｷ", "ク": "ｸ", "ケ": "ｹ", "コ": "ｺ",
    "サ": "ｻ", "シ": "ｼ", "ス": "ｽ", "セ": "ｾ", "ソ": "ｿ",
    "タ": "ﾀ", "チ": "ﾁ", "ツ": "ﾂ", "テ": "ﾃ", "ト": "ﾄ",
    "ナ": "ﾅ", "ニ": "ﾆ", "ヌ": "ﾇ", "ネ": "ﾈ", "ノ": "ﾉ",
    "ハ": "ﾊ", "ヒ": "ﾋ", "フ": "ﾌ", "ヘ": "ﾍ", "ホ": "ﾎ",
    "マ": "ﾏ", "ミ": "ﾐ", "ム": "ﾑ", "メ": "ﾒ", "モ": "ﾓ",
    "ヤ": "ﾔ", "ユ": "ﾕ", "ヨ": "ﾖ",
    "ラ": "ﾗ", "リ": "ﾘ", "ル": "ﾙ", "レ": "ﾚ", "ロ": "ﾛ",
    "ワ": "ﾜ", "ヲ": "ｦ", "ン": "ﾝ",
    "ァ": "ｧ", "ィ": "ｨ", "ゥ": "ｩ", "ェ": "ｪ", "ォ": "ｫ",
    "ッ": "ｯ", "ャ": "ｬ", "ュ": "ｭ", "ョ": "ｮ",
    "。": "｡", "、": "､", "ー": "ｰ", "「": "｢", "」": "｣", "・": "･"
  }
  var reg = new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g');
  return str
    .replace(reg, function (match) {
      return kanaMap[match];
    })
    .replace(/゛/g, 'ﾞ')
    .replace(/゜/g, 'ﾟ');
};
export const checkMenuHasPermission = (_checkType, _menuId) => {
    let userInfo = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.HARUKA));    
    if (userInfo == undefined || 
      userInfo == null || 
      userInfo.menu_auth == undefined || 
      userInfo.menu_auth == null) return false;

    let arr_menu_permission = userInfo.menu_auth;    

    let result = false;
    if (Object.keys(arr_menu_permission).length > 0 && 
      arr_menu_permission[_menuId] != null && 
      arr_menu_permission[_menuId] != null && 
      arr_menu_permission[_menuId].length > 0 && 
      arr_menu_permission[_menuId].includes(_checkType)) {
      result = true;
    }

    return result;
  }

export const handleDocumentHref = (_url=null) => {
  
  if (_url == null || _url == "") return;
  /*@cc_on 
  var w = window;
  eval('var window = w');
  @*/

  window.onbeforeunload = null;
  /*@cc_on 
  var doc = document;
  eval('var document = doc');
  @*/
  document.location.href = "#/"+_url;

  setTimeout(()=>{
    window.onbeforeunload = function () {
      return "Really?";
    };
  }, 200);

}

export const getServerTime =async() => {
  let path = "/app/api/v2/top/getServerTime";
  let post_data = {};
  let server_time = formatDateFull(new Date(), "/");
  await apiClient
    .post(path, {
      params: post_data
    })
    .then((res) => {
      server_time = formatDateFull(new Date(res), "/");
    })
    .catch(() => {

    });
  return server_time;
}

// load list_status_row_color.json
export const getStatusRowColor = (_page) => {
  let status_row_color = {};
  let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
  if (init_status != null && init_status != undefined && init_status.list_status_row_color != undefined && init_status.list_status_row_color != null) {
    if(init_status.list_status_row_color[_page] != undefined && init_status.list_status_row_color[_page] != null){
      status_row_color = init_status.list_status_row_color[_page];
    }
  }
  return status_row_color;
};

export const checkSMPByUnicode = (theString) => {
  var res = false;
  if (theString == undefined || theString == null || theString.length == 0) return res;
  for (var i=0; i < theString.length; i++) {
    var theUnicode = theString.codePointAt(i).toString(16);
    theUnicode = '0x' + theUnicode;      
    if (parseInt(theUnicode) >= parseInt(0x10000) && parseInt(theUnicode) <= parseInt(0x1FFFF)) {
      return true;
    }
  }
  return res;
}

// get 定期注射 order'rp done status
export const getPeriodInjectionRpDoneStatus = (_data=null) => {  
  if (_data == null) {
    return null;
  }

  let done_exe = 0;  
  let done_all = 0;  
  if (Object.keys(_data).length > 0) {
    Object.keys(_data).map(key=>{
      let date_record = _data[key];
      if (date_record != undefined && date_record != null && date_record.length > 0) {
        date_record.map(ele=>{
          done_all++;
          if (ele.completed_at != undefined && ele.completed_at != null && ele.completed_at != "") {
            done_exe ++;            
          }
        });
      }
    });
  }
  
  let done_rp = 0; // rp done status

  if(done_exe > 0 ) {
    done_rp = done_exe == done_all ? 1: 2;
  }

  return done_rp;
}

// get 定期注射 order done status
export const getPeriodInjectionOrderDoneStatus = (_data=null) => {  
  if (_data == null) {
    return null;
  }

  let done_all = 0;
  let done_rp = 0;
  let done_stop = 0;
  if (_data.length > 0) {
    _data.map(item=>{
      done_all ++;
      let rp_status = 0;
      if (item.done_numbers != undefined) {
        rp_status = getPeriodInjectionRpDoneStatus(item.done_numbers);
      }
      if (rp_status == 1) {
        done_rp ++;
      } else if(rp_status == 2) {
        done_stop ++;
      }
    });
  }

  let done_order = 0;
  if (done_rp > 0) {
    done_order = done_all == done_rp ? 1 : 2;
  } else if(done_stop > 0) {
    done_order = 2;
  }
  return done_order;
}

export const filterShow = (str) => {
  if (str == undefined || str == null) return '';
  return str;
}

export const getInspectionName=(inspection_id)=> {
  let insepction_name = "生理";
  let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
  if(init_status == null || init_status === undefined){return insepction_name;}
  if(init_status.inspection_master === undefined || init_status.inspection_master == null){return insepction_name;}
  if (init_status.inspection_master.length > 0) {
    init_status.inspection_master.map(inspection=>{
      if(inspection.inspection_id === inspection_id){
        insepction_name = inspection.name;
      }
    });
  }
  return insepction_name;
}

export const getInspectionMasterInfo=(inspection_id, attribute=null)=> {
  let insepction_info = {};
  let insepction_attribute = null;
  let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
  if(init_status == null || init_status === undefined){return insepction_info;}
  if(init_status.inspection_master === undefined || init_status.inspection_master == null){return insepction_info;}
  if(init_status.inspection_master.length > 0) {
    init_status.inspection_master.map(inspection=>{
      if(inspection.inspection_id === inspection_id){
        insepction_info = inspection;
        insepction_attribute = inspection[attribute];
      }
    });
  }
  if(attribute != null){
    return insepction_attribute;
  }
  return insepction_info;
}

export const getInspectionNameList=()=> {
  let insepction_list = [{id: 0, value: "全て"}];
  let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
  if(init_status == null || init_status === undefined){return insepction_list;}
  if(init_status.inspection_master === undefined || init_status.inspection_master == null){return insepction_list;}
  if (init_status.inspection_master.length > 0) {
    init_status.inspection_master.map(inspection=>{
      if(inspection.inspection_id !== 17 && inspection.inspection_id !== 18){
        insepction_list.push({id: inspection.inspection_id, value: inspection.name});
      }
    });
  }
  return insepction_list;
}

// ●YJ698 注射に、薬剤なし登録できる手技を作れるように
export const getInjectionUsageInfo = (usage_code, get_type) => {
  let result = null;
  if (usage_code == undefined || usage_code == null || usage_code == "") return result;

  let initState = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
  if(initState !== undefined && initState != null){
    if(initState.injection_usage !== undefined && initState.injection_usage != null && initState.injection_usage.length > 0){
      initState.injection_usage.map(item=>{
        if (item.code == parseInt(usage_code) && item[get_type] != undefined) {
          result = item[get_type];
        }
      });
    }
  }
  return result;
}

export const getDoctorName=(doctor_code=null, doctor_number=null)=>{
  let doctor_name = "";
  let doctor_data = sessApi.getDoctorList();
  if(doctor_data !== undefined && doctor_data != null && doctor_data.length > 0){
    doctor_data.map(doctor=>{
      if(doctor_code != null && doctor_code == doctor.doctor_code){
        doctor_name = doctor.name
      }
      if(doctor_number != null && doctor_number == doctor.number){
        doctor_name = doctor.name
      }
    });
  }
  return doctor_name;
}

export const getInsuranceName = (_insuranceName) => {
  let result = "既定";
  if (_insuranceName == undefined || _insuranceName == null || _insuranceName == "") return result;
  return _insuranceName
}

// ●YJ1117 訪問診療のオーダーやカルテ記載内容は訪問診療先施設を記録・表示する
export const getVisitPlaceNameForModal = (place_id) => {
  let visitPlaceMaster = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "visit_place_master");    
  if (visitPlaceMaster == undefined || visitPlaceMaster == null || visitPlaceMaster.length == 0) {
    result = "※削除済施設(ID:" + place_id + ")";
    return;
  }
  let place_item = visitPlaceMaster.find(x=>x.visit_place_id == place_id);
  let result = "";
  if (place_item == undefined || place_item == null || place_item.name == "") {
    result = "※削除済施設(ID:" + place_id + ")";
  } else {
    result = "施設名：" + place_item.name;
  }
  return result;
}

export const getMultiReservationInfo=(reserve_data, done_numbers=undefined)=> {
  let date_arr = [];
  let date_html = [];
  reserve_data.map(item=>{
    let date = item.inspection_date;
    if(date_arr[date] === undefined){
      date_arr[date] = {};
    }
    date_arr[date][item.block_start_time] = item;
  });
  if(done_numbers !== undefined){
    done_numbers.map(item=>{
      let date = item.time.split(' ')[0];
      if(date_arr[date] === undefined){
        date_arr[date] = {};
      }
      let time = formatTimeIE(new Date(item.time.split('-').join('/')));
      date_arr[date][time] = item;
    });
  }
  Object.keys(date_arr).map(date=>{
    date_html.push(<p style={{margin:0}}>{formatJapanDateSlash(date)}</p>);
    let date_item = date_arr[date];
    Object.keys(date_arr[date]).map(time=>{
      date_html.push(
        <p style={{margin:0}}>・{time + " " + (date_item[time].completed_by !== undefined ? getStaffName(date_item[time].completed_by) : "")}</p>
      );
      if(date_item[time].done_height !== undefined || date_item[time].done_weight !== undefined || date_item[time].done_surface_area !== undefined){
        date_html.push(
          <p style={{margin:0}}>
            {"　" + (date_item[time].done_height !== undefined ? ("身長:" + date_item[time].done_height + "cm") : "")}
            {"　" + (date_item[time].done_weight !== undefined ? ("体重:" + date_item[time].done_weight + "kg") : "")}
            {"　" + (date_item[time].done_surface_area !== undefined ? ("体表面積:" + date_item[time].done_surface_area + "㎡") : "")}
          </p>
        );
      }
      if(date_item[time].done_comment !== undefined && date_item[time].done_comment != null && date_item[time].done_comment !== ""){
        date_html.push(
          <p style={{margin:0}}>{"　" + "実施コメント:" + displayLineBreak(date_item[time].done_comment)}</p>
        );
      }
      if(date_item[time].details !== undefined){
        date_item[time].details.map(detail=>{
          if(detail.item_id > 0){
            date_html.push(
              <p style={{margin:0}}>
                {"　" + detail.name}
                {((detail.value1 !== undefined && detail.value1 != null && detail.value1 !== "") || (detail.value2 !== undefined && detail.value2 != null))? "：": ""}
                {(detail.value1 !== undefined && detail.value1 != null && detail.value1 !== "") ? (detail.value1 + detail.input_item1_unit) : ""}
                {(detail.value2 !== undefined && detail.value2 != null && detail.value2 !== "") ? (detail.value2 + detail.input_item2_unit) : ""}
              </p>
            )
          }
        });
      }
    });
  });
  return date_html;
}

  