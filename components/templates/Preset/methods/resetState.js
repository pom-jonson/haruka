import { getCurrentDate } from "../../../../helpers/date";
import { diagnosis } from "../../../../helpers/departments";

export default function() {
  const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));

  this.setState({
    isLoaded: false,
    presData: [
      {
        medicines: [
          {
            medicineId: 0,
            medicineName: "",
            amount: 0,
            unit: "",
            main_unit_flag: 1,
            is_not_generic: 0,
            can_generic_name: 0,
            milling: 0,
            separate_packaging: 0,
            usage_comment: "",
            usage_optional_num: 0,
            poultice_times_one_day: 0,
            poultice_one_day: 0,
            poultice_days: 0,
            free_comment: [],
            uneven_values: []
          }
        ],
        units: [],
        days: 0,
        days_suffix: "",
        usage: 0,
        usageName: "",
        usageIndex: 0,
        year: "",
        month: "",
        date: "",
        supply_med_info: 0,
        med_consult: 0,
        temporary_medication: 0,
        one_dose_package: 0,
        medical_business_diagnosing_type: 0,
        insurance_type: 0,
        body_part: "",
        usage_remarks_comment: [],
        start_date: getCurrentDate()
      }
    ],
    orderNumber: 0,
    isForUpdate: false, //処方歴からの編集モードかどうか
    showedPresData: {
      medicineId: 0,
      medicineName: "",
      unit: []
    },
    isAmountOpen: false,
    isDaysOpen: false,
    isBodyPartOpen: false,
    daysInitial: 0,
    daysLabel: "",
    daysSuffix: "",
    doctors: [],
    amountTyped: false,
    tab: 1,
    department: authInfo.medical_department_name || "",
    departmentId: authInfo.department,
    psychotropic_drugs_much_reason: "",
    poultice_many_reason: "",
    free_comment: "",
    inOutName: "",
    calcNum: 0,
    medical_business_diagnosing_type: 0,
    usageOpen: false,
    lengthId: 0,
    rp: 1,
    usage: 0,
    usageModal: false,
    patientInfo: {},
    usageSelectIndex: -1,
    selectedUsageTabIndex: -1,
    diagnosis: diagnosis,
    indexOfInsertPres: -1,
    indexOfInsertMed: -1,
    indexOfEditPres: -1,
    inOut: 0,
    bulk: {
      milling: 0,
      supply_med_info: 0,
      med_consult: 0,
      is_not_generic: 0,
      can_generic_name: 1,
      separate_packaging: 0,
      temporary_medication: 0,
      one_dose_package: 0
    },
    usagePartItem: null,
    changeNumber: {
      indexPres: -1,
      indexMed: -1
    },
    pacsOn: false,
    //再描画を抑止させるフラグ
    shouldUpdate: true,
    currentUserName: authInfo.name,
    canEdit: authInfo.staff_category === 1,
    staff_category: authInfo.staff_category || 2,
    isCopyOrder: false,
    isEditOrder: false,
    tempItems: [],
    medicineHistory: [],
    medicineDBHistory: [],
    medicineRankData: [],
    medicineSetData: [],
    titleTab: 0,
    isEdintingIndex: -1,
    unusedDrugSearch: 0,
    profesSearch: 0,
    normalNameSearch: 0,
    isNotConsentedDataLength: 0,
    isNotConsentedModalOpen: false,
    bodyPartData: [
      {
        id: 1,
        label: "顔",
        value: "顔"
      },
      {
        id: 2,
        label: "頭部",
        value: "頭部"
      },
      {
        id: 3,
        label: "眼",
        value: "眼"
      },
      {
        id: 4,
        label: "右眼",
        value: "右眼"
      },
      {
        id: 5,
        label: "左眼",
        value: "左眼"
      },
      {
        id: 6,
        label: "両眼",
        value: "両眼"
      },
      {
        id: 7,
        label: "鼻",
        value: "鼻"
      },
      {
        id: 8,
        label: "首",
        value: "首"
      },
      {
        id: 10,
        label: "右肩",
        value: "右肩"
      },
      {
        id: 11,
        label: "左肩",
        value: "左肩"
      },
      {
        id: 12,
        label: "両肩",
        value: "両肩"
      },
      {
        id: 13,
        label: "胸",
        value: "胸"
      },
      {
        id: 14,
        label: "腹",
        value: "腹"
      },
      {
        id: 15,
        label: "背中",
        value: "背中"
      },
      {
        id: 16,
        label: "腰",
        value: "腰"
      },
      {
        id: 161,
        label: "臀部",
        value: "臀部"
      },
      {
        id: 162,
        label: "右臀部",
        value: "右臀部"
      },
      {
        id: 163,
        label: "左臀部",
        value: "左臀部"
      },
      {
        id: 201,
        label: "右上腕",
        value: "右上腕"
      },
      {
        id: 202,
        label: "左上腕",
        value: "左上腕"
      },
      {
        id: 203,
        label: "両上腕",
        value: "両上腕"
      },
      {
        id: 22,
        label: "右肘",
        value: "右肘"
      },
      {
        id: 23,
        label: "左肘",
        value: "左肘"
      },
      {
        id: 24,
        label: "両肘",
        value: "両肘"
      },
      {
        id: 241,
        label: "右前腕",
        value: "右前腕"
      },
      {
        id: 242,
        label: "左前腕",
        value: "左前腕"
      },
      {
        id: 243,
        label: "両前腕",
        value: "両前腕"
      },
      {
        id: 244,
        label: "右手首",
        value: "右手首"
      },
      {
        id: 245,
        label: "左手首",
        value: "左手首"
      },
      {
        id: 246,
        label: "両手首",
        value: "両手首"
      },
      {
        id: 25,
        label: "手",
        value: "手"
      },
      {
        id: 26,
        label: "右手",
        value: "右手"
      },
      {
        id: 27,
        label: "左手",
        value: "左手"
      },
      {
        id: 28,
        label: "両手",
        value: "両手"
      },
      {
        id: 29,
        label: "膝",
        value: "膝"
      },
      {
        id: 30,
        label: "右膝",
        value: "右膝"
      },
      {
        id: 31,
        label: "左膝",
        value: "左膝"
      },
      {
        id: 32,
        label: "両膝",
        value: "両膝"
      },
      {
        id: 34,
        label: "右足",
        value: "右足"
      },
      {
        id: 35,
        label: "左足",
        value: "左足"
      },
      {
        id: 36,
        label: "両足",
        value: "両足"
      },
      {
        id: 37,
        label: "右踵",
        value: "右踵"
      },
      {
        id: 38,
        label: "左踵",
        value: "左踵"
      },
      {
        id: 39,
        label: "両踵",
        value: "両踵"
      }
    ],
    limit: 5,
    offset: 0,
    isSending: false,
    item_details:[
      {classfic: 0, classfic_name:'', item_id: 0, item_name: "", attribute1:"0", format1:"", unit_name1:"", max_length1:"", value1:"", attribute2:"0", format2:"", unit_name2:"", max_length2:"", value2:""},
    ],
  });
}
