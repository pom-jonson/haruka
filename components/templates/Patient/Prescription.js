import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Title from "../../atoms/Title";
import TitleHasMenu from "../../organisms/TitleHasMenu";
import PrescriptionConfirmButton from "../../atoms/PrescriptionConfirmButton";
import TitleTabs from "../../organisms/TitleTabs";
import Context from "~/helpers/configureStore";
import MedicineSelection from "../../organisms/MedicineSelection";
import MedicineRankSelection from "../../organisms/MedicineRankSelection";
import MedicineSetSelection from "../../organisms/MedicineSetSelection";
import PrescribeTable from "../../organisms/PrescribeTable";
import Remarks from "../../organisms/Remarks";
import enhance from "./@enhance";
import InOutNav from "../../organisms/InOutNav";
import EndExaminationModal from "../../organisms/EndExaminationModal";
import * as methods from "./FinalPrescriptionMethods";
import { getCurrentDate, formatDateFull } from "../../../helpers/date";
import { persistedState } from "../../../helpers/cache";
import {
  OPERATION_TYPE,
  PERMISSION_TYPE,
  SOAP_TREE_CATEGORY,
  TREE_FLAG,
  CACHE_LOCALNAMES,
  FUNCTION_ID_CATEGORY,
  KARTEMODE, CACHE_SESSIONNAMES,
  Karte_Types,
  handleDocumentHref
} from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";
import auth from "~/api/auth";
import axios from "axios";
import PrescriptionTree from "~/components/templates/Patient/PrescriptionTree";
import * as apiClient from "~/api/apiClient";
import ItemPrescriptionTableBody from "~/components/templates/Patient/components/ItemPrescriptionTableBody";
import Button from "~/components/atoms/Button";
import {onSurface} from "../../_nano/colors";
import { faAngleDown } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PrescriptionAllModal from "./components/PrescriptionAllModal";
import $ from "jquery";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as localApi from "~/helpers/cacheLocal-utils";
import PanelGroup from "./PanelGroup/PanelGroup";

const PrescriptionWrapper = styled.div`
  display: flex;
  width: 100%;
  height:100%;
  padding: 120px 0px 0px 0px;
  .no-visible{
    display: none;
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
        font-size: 13px;
        line-height: 20px;
        position: relative;
      }
    }
    li {
      cursor: pointer;
      list-style-type: none;
    }
  }
  #soapTreeView li{
    cursor: default;
    span{
      cursor: pointer
    }
  }
`;

const PrescriptionMain = styled.div`
  display: flex;
  justify-content: space-between;  
  margin-top: 16px;
  width: 100%;
  .prescription-check{
    float: right;
    margin-top: 10px;
    button{
      background: #d3d3d3;
      padding: 2px 4px;
      span{
        color: #595959;
        font-size: 14px;
      }
    } 
    button:first-child{
      margin-right: 5px;
      background: #ffffff !important;
      border: solid 1px #7e7e7e !important;
      span {
        color: #7e7e7e !important;
      }
    }
    button:first-child:hover{
      margin-right: 5px !important;
      border: solid 1px #000000 !important;
      background: #ffffff !important;
      span {
        color: #000000 !important;
      }
    }     
  }
  .confirm{      
    button:first-child{
      background: #ffffff;
      border: solid 1px #7e7e7e;
      span {
        color: #7e7e7e;
      }
    }
    button:first-child:hover{
      border: solid 1px #000000;
      background: #ffffff;
      span {
        color: #000000;
      }
    }
    button:last-child{
      background: #cc0000;
      span {
        color: #ffffff;
      } 
    }
    button:last-child:hover{
      background: #e81123;
      span {
        color: #ffffff;
      }
    }    
  }
  .ccsEcX{
    .cWeVcM:first-child{
      float:left;
    }
  }
  .set-detail-area {
    width: 100%;
    max-height: calc(100% - 250px);
    overflow-y: auto;
    font-size: 12px;
    margin-bottom: 16px;
    .close-table {
        transform: rotate(180deg);
    }
    .flex{
      display: flex;
    }
    table {
        margin-bottom: 0;
        margin-top: 5px;
        .value-input{
          width: 200px !important;
        }
        .detail-category{
          width: 120px !important;
        }
        .react-numeric-input{
          input{
            font-size:12px !important;
            height: 30px !important;
          }
        }
    }
    .table-menu {
      background-color: #e2caff;
    }
    .td-no {
      background-color: #e2caff;
    }
    td {
      padding: 3px;
      vertical-align: middle;
    }
    .pullbox-label {
      width: 100%;
      margin: 0;
      font-size: 12px;
      .pullbox-select{
        font-size: 12px !important;
        height: 34px;
      }
    }
    .label-title {
        width: 0;
        margin: 0;
    }
    .label-unit {
        width: 0;
        margin: 0;
    }
    .hvMNwk, .dZZuAe {
      margin:0;
    }
    .select-class {
      select{width:100%;}
    }
    .cqhJKX {
        width:100%;
        input {
            width: 100% !important;
        }
    }
    .search-item-btn {
      margin: 0;
      padding: 0;
      width: 100%;
      height: auto;
    }
    
    .birthday_area{
      span{
        line-height:34px;
        margin-right: 5px;
        margin-left: 5px;
      }
      .pullbox-select{
          width:75px;
      }
      .month_day{
        .pullbox-select{
            width:50px;
        }
        .label-title{
            display:none;
        }
          label {
            width: 50px;
          }
      }
      label {
        width: 80px;
      }
      .calendar_icon {
        left: 100px;
      }
      .react-datepicker-wrapper {
        width: 35px;
        svg {
            left: 10px;
            top: 0px;
        }
      }
    }
    .react-datepicker-wrapper {
        width: 100%;
        .react-datepicker__input-container {
            width: 100%;
            input {
                font-size: 12px;
                width: 100%;
                height: 38px;
                padding: 0px 8px;
            }
        } 
    }
    .calendar_icon{
        font-size:18px;
        position: absolute;
        top: 17px;
        left: 66px;
        color: #6a676a;
    }
  }
  .status-select{
    button {
      margin-left: -85%;
      border: solid 1px black;
      padding: 3px;
      margin-top: -5px;
      min-width: 65px;
    }
    .no-selected{
      background-color: white;
      span {
        color: black;
      }
    }
    .selected {
      background-color: rgb(105, 200, 225);
      span {
        color: white;
      }
    }
    .btn-disable {
      background: #d3d3d3 !important;
      cursor:auto;
      span {
        color: #595959 !important;
      }
    }
  }
`;

const Col = styled.div`
  width: 49%;
`;

const WrapperContainer = styled.div`
  height: calc(100vh - 280px);
  overflow: auto;
`;

const Angle = styled(FontAwesomeIcon)`
  color: ${onSurface};
  cursor: pointer;
  display: inline-block;
  font-size: 25px;
  margin-left: 20px;
  margin-top: -5px;
`;

@enhance
class Prescription extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    // 処方画面で、区分を処方や入院、訪問診療に変えた場合、処方歴の読み込みが終わらない
    this.first_load_page = 1;
    this.m_medicine = [];
    this.m_indexOfInsertPres = 0;
    this.m_indexOfInsertMed = 0;
    this.m_show_detail_flag = 0;
    this.act_msg = "";
    this.m_presDataFromSoap = undefined;
    this.additions_action = false;
    this.preset_do_count = null;
    // right menu from prescribetable's 数量の変更
    this.amountCancelFromMenu = "";

    this.search_date = null;
    this.modal_obj = {
      canConfirm: 0,
      isAmountOpen: false,
      hideDuplicateModal: true,
      insertMedicineFlag: true,
      registerPatientSetData: false, // 患者別処方セット
      isBodyPartOpen: false,
      isDaysOpen: false,
      daysInitial: 0,
      insertStep: 0,
      dropStep: 0,
      diseaseModal: false,
      diseaseData: [],
      diseaseOrderModal: false,
      diseasePrescriptionModal: false,
      periodModal: false,
      periodOrderModal: false,
      periodPrescriptionModal: false,
      usageAlertModal: false,
      usageOverModal: false,
      diagnosisModal: false,
      diagnosisOrderModal: false,
      usageMedDetailModal: false,
      diagnosisOrderData: {},
      changeDepartmentModal: false,
      registerSetModal: false,
      confirm_message: "",
      confirm_type: "",
      dropText: "",
      showMedicineSelected: "",
      showMedicineOrigin: "",
      modalType: "",
      amountTyped: false,
      indexOfEditPres: -1,
      isEdintingIndex: -1,
      diagnosisData: {},
      messageType: "",
      daysLabel: "",
      usageName: "",
      showMedicineContent: "",
      periodData: [],
      diseaseOrderData: [],
      diseaseOrder: [],
      periodOrder: [],
      periodPrescription: [],
      diseasePrescriptionData: [],
      diseasePrescription: [],
      usageMedicineDetail: [],
      usageOverItem: [],
      usageOpen: false,
      isNotConsentedModalOpen: false,
      isMedicinePeriodDuplicateOpen: false,
      complete_message: "",
      daysSuffix: "",
      usage: 0,
      usageRpIdx: -1,
      usageRpOrderIdx: -1,
      usageData: [],
      periodOrderData: {},
      periodPrescriptionData: {},
      departmentDate: "",
      departmentNumber: 0,
      is_done: false,
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
      duplicateList: [],
      rejectList: [],
      alertList: [],
      item_details:[
        {classfic: 0, classfic_name:'', item_id: 0, item_name: "", attribute1:"0", format1:"", unit_name1:"", max_length1:"", value1:"", attribute2:"0", format2:"", unit_name2:"", max_length2:"", value2:""},
      ],
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
    };

    this.autoLogoutModalShow = false;
    this.changeState = false;
    this.changeProps = false;
    this.tempPresData = undefined;
    this.tempMedicineHistory = undefined;
    this.tempMedicineRankHistory = undefined;
    this.tempMedicineSetHistory = undefined;
    this.confirmButtonRef = React.createRef();
    this.inOutRef = React.createRef();
    this.titleRef = React.createRef();
    this.remarkRef = React.createRef();
    this.prescriptionNameRef = React.createRef();
    this.prescriptionTreeRef = React.createRef();
    this.prescribeTableRef = React.createRef();
    this.medicineSelectionRef = React.createRef();
    this.medicineRankSelectionRef = React.createRef();
    this.medicineSetSelectionRef = React.createRef();
    /*@cc_on 
    var w = window;
    eval('var window = w');
    @*/
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.patientModalRef = React.createRef();
    this.patientModal = null;
    this.firstLogin = true;
    this.buttonDoubleClick = null;
    this.selected_tab_flag = 0;

    // 処方オーダーKey setting
    let active_key = karteApi.getSubVal(this.props.match.params.id, CACHE_LOCALNAMES.ACTIVE_KEY, "prescription");
    if (active_key == undefined || active_key == null) {
      active_key = new Date().getTime();
      karteApi.setSubVal(this.props.match.params.id, CACHE_LOCALNAMES.ACTIVE_KEY, "prescription", active_key);
    }
    this.m_cacheSerialNumber = active_key;
    this.japic_alert_reject = 1;
    let conf_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "conf_data");
    if(conf_data != undefined && conf_data != null && conf_data.japic_alert_reject != undefined && conf_data.japic_alert_reject != null && conf_data.japic_alert_reject != ""){
      this.japic_alert_reject = conf_data.japic_alert_reject;
    }
    localApi.remove('prescription_gray_info');
  }

  async UNSAFE_componentWillMount () {
    await this.getPatientInfor();
    if(this.context.department.code == 0){
      this.context.$updateDepartment(1, "内科");
    }
  }

  componentDidUpdate() {
    /*@cc_on 
    var doc = document;
    eval('var document = doc');
    @*/
    if (
      document.getElementById("prescription_dlg") !== undefined &&
      document.getElementById("prescription_dlg") !== null
    ) {
      document.getElementById("prescription_dlg").focus();
    }
  }
  
  componentWillUnmount() {
    /*@cc_on 
    var w = window;
    eval('var window = w');
    @*/
    this.contraindications_to_disease = null;
    this.modal_obj = null;
    this.prescriptionTreeRef = null;
    this.prescribeTableRef = null;
    this.confirmButtonRef = null;
    this.inOutRef = null;
    this.titleRef = null;
    this.remarkRef = null;
    this.prescriptionNameRef = null;
    this.medicineSelectionRef = null;
    this.medicineRankSelectionRef = null;
    this.medicineSetSelectionRef = null;
    this.departmentOptions = null;
    this.patientModalRef = null;
    this.setState({
      tempItems: [],
      medicineHistory: [],
      injectionHistory: [],
      soapList: [],
      soapTrees: [],
      soapOriginalList: [],
      medicineDBHistory: [],
      injectionDBHistory: [],
      medicineRankData: [],
      medicineSetData: [],
      injectionSetData: [],
      presData:[],
      usageOverItem :[], // 数量チェック Modal Items
      bodyPartData: [],
      item_details:[],
      patientInfo: {},
    })
    karteApi.delSubVal(this.props.match.params.id, CACHE_LOCALNAMES.ACTIVE_KEY, "prescription");
    window.localStorage.removeItem("prescription_origin_data");
    var panelGroup = document.getElementsByClassName('container')[0];
    if (panelGroup != undefined) this.purge(panelGroup);
    for (var key in window.localStorage) {
      if (key.includes("medicine_keyword_")) {
        window.localStorage.removeItem(key);
      }
    }
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

  async componentDidMount() {
    /*@cc_on 
    var w = window;
    eval('var window = w');
    @*/
    let oplog = window.localStorage.getItem("operation_log");
    let operation_log = [];
    if(oplog !== null) {
      operation_log = JSON.parse(window.localStorage.getItem("operation_log") || "");
    }
    let log = {
      time: formatDateFull(new Date(), "-"),
      category: "see",
      detail: "処方箋(閲覧中)"
    };
    operation_log.push(log);
    window.localStorage.setItem("operation_log", JSON.stringify(operation_log));
    window.localStorage.setItem("medicine_selection_wrapper_scroll", 0);
    // medicine history scroll
    karteApi.setVal(this.props.match.params.id, CACHE_LOCALNAMES.SOAP_PAGE_NUMBER, 0);
    this.medicineSelectionRef.current.testStopGetHistoryRender(false);
    this.modal_obj.inOut = this.context.karte_status.code == 1 ? 1 : 0; // karte_status.name : 入院 => 院内
    if (this.context.karte_status.code == 1) {
      if (this.context.$getKarteMode(this.props.match.params.id) == KARTEMODE.WRITE) {
        this.modal_obj.inOut = 0;
      } else if(this.context.$getKarteMode(this.props.match.params.id) == KARTEMODE.EXECUTE){
        this.modal_obj.inOut = 2;
      }
    }
    //加算項目制御条件の機能
    let addition_condition = undefined;
    await this.getConditionByAdditions().then(function(data){
      addition_condition = data;
    });
    // await this.getDiseaseList();
    //加算項目制御
    let additions = null;
    await this.getAdditions(true).then(function(data){
      additions = data;
    });

    let isNotConsentedDataLength = 0;
    let doctors = sessApi.getDoctorList();
    if(doctors == null) {
      doctors = await apiClient.get("/app/api/v2/secure/doctor/search?");
    }
    let usageData = null;
    await this.getUsageData().then(function(data){
      usageData = data;
    });

    await this.getContraindicationsToDiseaseApi(this.props.match.params.id);
    await this.getPresetDoPrescription(this.props.match.params.id, this.context.selectedDoctor.code);
    let presData = this.state.presData;
    presData[0].start_date = getCurrentDate();
    this.modal_obj.departmentId = this.context.department.code;
    this.modal_obj.department = this.context.department.name;
    let { cacheDelState } = persistedState(this.props.match.params.id);
    let medicineHistory = this.state.medicineHistory;
    if (cacheDelState) {
      medicineHistory = this.getDelData(cacheDelState, "del", true);
    }
    let state_data = {
      patientInfo:karteApi.getPatient(this.props.match.params.id),
      addition_condition,
      additions,
      isNotConsentedDataLength,
      doctors,
      usageData,
      departmentId: this.context.department.code,
      department: this.context.department.name,
      presData,
      medicineHistory,
      hideDuplicateModal: true,
      showMedicineOrigin: "",
      showMedicineContent: "",
      showMedicineSelected: "",
      modalType: "",
      selYear: -1,
      selMonth: -1,
      selDay: -1,
      insertMedicineFlag: true,
      insertStep: 0,
      dropStep: 0,
      dropOrderList: [],
      duplicateList: [],
      rejectList: [],
      alertList: [],
      dropText: "",
      diseaseModal: false,
      diseaseData: [],
      diseaseOrderModal: false,
      diseaseOrderData: [],
      diseaseOrder: [],
      diseasePrescriptionModal: false,
      diseasePrescriptionData: [],
      diseasePrescription: [],
      periodModal: false,
      periodData: {},
      periodOrderModal: false,
      periodOrderData: {},
      periodOrder: [],
      periodPrescriptionModal: false,
      periodPrescriptionData: {},
      periodPrescription: [],
      patientDiseaseData: [],
      diagnosisModal: false,
      diagnosisData: {},
      diagnosisOrderModal: false,
      diagnosisOrderData: {},
      usageAlertModal: false,
      usageAlertContent: [],
      usageRpIdx: -1,
      usageRpOrderIdx: -1,
      usageMedDetailModal: false,
      usageMedicineDetail: [],
      changeDepartmentModal: false,
      departmentName: "内科",
      departmentDate: "",
      departmentNumber: 0,
      bgMedicine: "",
      registerSetModal: false,
      show_item_detail: false,
      registerSetData: [],
      sendDiagnosisModal : false,
      sendDiagnosisOrderData :  {},
      diagonosis_valid : 0,
      confirm_message: "",
      confirm_type: "",
      messageType: "",
      categoryOperation: -1,
      select_outpatient: false,
      select_home: false,
      select_hospitalize: false,
      item_details:[
        {classfic: 0, classfic_name:'', item_id: 0, item_name: "", attribute1:"0", format1:"", unit_name1:"", max_length1:"", value1:"", attribute2:"0", format2:"", unit_name2:"", max_length2:"", value2:""},
      ],
      inOut: this.context.karte_status.code == 1 ? 1 : 0,// karte_status.name : 入院 => 院内
      isDoctorsOpen: false,
      isOpenPrescriptionConfirmModal: false,
    };
    let load_cache_data = this.loadCachedData(this.props.match.params.id);
    if(Object.keys(load_cache_data).length > 0){
      Object.keys(load_cache_data).map(key=>{
        state_data[key] = load_cache_data[key];
      })
    }

    // soap insert drop index
    let insertDropSoapNumber = window.localStorage.getItem("soap_insert_drop_number");
    if (insertDropSoapNumber > 0) {
      let cache_karte_status_code = null;
      await this.getDropPrescriptionData(insertDropSoapNumber).then(function(data){
        state_data['medicineSoap'] = data;
        cache_karte_status_code = data[insertDropSoapNumber].karte_status;
      });

      // ●YJ110 SOAPの中央カラムからDoしたときに、新規発行する入外区分は現在の区分に合わせるように
      let karte_status_code = 1;
      if(this.context.karte_status.code == 1){
        karte_status_code = 3;
      }
      if(this.context.karte_status.code == 2){
        karte_status_code = 2;
      }
      // ・外来処方や在宅処方を入院にDoしたときは、デフォルトの「臨時処方」を選択"
      if (karte_status_code == 3 && cache_karte_status_code != null && cache_karte_status_code != 3) {
        this.modal_obj.inOut = 0;
        this.modal_obj.inOut_fromSoap_flag = true;
        let remark_status = {
          id: 0
        };
        this.inOutRef.current.testInOutRender(remark_status);
      } else if(karte_status_code != 3 && cache_karte_status_code != null && cache_karte_status_code == 3) {
        // ・入院処方を外来や在宅にDoしたときは、デフォルトの「院外」を選択
        this.modal_obj.inOut = 0;
        this.modal_obj.inOut_fromSoap_flag = true;
        let remark_status = {
          id: 0
        };
        this.inOutRef.current.testInOutRender(remark_status);
      }
    }

    // this.medicineSoap = soap_insert_drop_number;
    let editDropSoapNumber = window.localStorage.getItem("soap_edit_drop_number");
    // soap edit drop index
    let prescription = undefined;
    if (editDropSoapNumber > 0) {
      await this.getEditDropPrescriptionData(editDropSoapNumber).then(function(data){
        prescription = data;
      });
    }

    this.setState(state_data,async() => {
      /*@cc_on 
      var doc = document;
      eval('var document = doc');
      @*/
      if (document.getElementById("prescription_dlg") !== undefined
        && document.getElementById("prescription_dlg") !== null) {
        document.getElementById("prescription_dlg").focus();
      }
      // 品名 open flag
      this.m_show_detail_flag = 0;
      this.showItemDetailArea(0);
      // this.modal_obj.getHistoryEnd = 1;
      // this.setState({isLoaded:true});
      if (insertDropSoapNumber > 0) {
        window.localStorage.removeItem("soap_insert_drop_number");
        await this.onDropEvent("prescription:" + insertDropSoapNumber, null, "_fromSoap");
      }
      if (editDropSoapNumber > 0) {
        if(prescription !== undefined){
          await this.editOrders(prescription);
        }
        window.localStorage.removeItem("soap_edit_drop_number");
      }
    });

    //SOAP画面から処方Do展開
    let preset_do_deploy_index = localApi.getValue('preset_do_deploy_index');
    if (preset_do_deploy_index !== undefined && preset_do_deploy_index != null) {
      let preset_do_deployment_data = karteApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.PRESET_DO_DEPLOYMENT);
      let preset_data = {};
      let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
      let patient_do_get_mode = initState.patient_do_get_mode;
      if(patient_do_get_mode == 0 || authInfo.staff_category === 1){
        preset_data.order_data = preset_do_deployment_data[preset_do_deploy_index]['prescription_data'];
      } else {
        preset_data.order_data = preset_do_deployment_data[this.context.selectedDoctor.code][preset_do_deploy_index]['prescription_data'];
      }
      this.copyOrdersPrescription(preset_data, "hasDoctor");
    }
    this.firstLogin = false;
    auth.refreshAuth(location.pathname+location.hash);
  }

  shouldComponentUpdate(nextprops, nextstate) {
    // console.log("shouldComponentUpdate=======================");
    if (this.modal_obj.forceRefresh == 1) {
      this.modal_obj.forceRefresh = null;
      return true;
    }
    // console.log("00");
    if (this.modal_obj.store_no_fresh != null && this.modal_obj.store_no_fresh == 1) {
      this.modal_obj.store_no_fresh = null;
      return false;
    }
    // console.log("01");
    if (this.modal_obj.loadedEnd == true && this.m_need_load == 1) {
      this.modal_obj.loadedEnd = false;
      this.modal_obj.getHistoryEnd = -1;
      return true;
    }

    // console.log("02");
    if (this.modal_obj.daysXXConfirm == 1) {
      this.modal_obj.daysXXConfirm = null;
      return true;
    }
    // console.log("03");
    // remove loading icon
    if (this.modal_obj.loadedEnd == true && this.modal_obj.removeLoadingIcon == 1) {
      // console.log("04");
      this.modal_obj.removeLoadingIcon = 0;
      //外来のみ... ボタンのグレーアウト解除
      $(".status-select button").removeClass("btn-disable");
      if(this.medicineSelectionRef.current != undefined){
        this.medicineSelectionRef.current.testIsLoadedRender(true);
      }
      if(this.prescribeTableRef.current != undefined){
        this.prescribeTableRef.current.testIsLoadedRender(true);
      }
      this.tempMedicineHistory = [...nextstate.medicineHistory];
      if(this.medicineSelectionRef.current != undefined){
        this.medicineSelectionRef.current.testMedRender(this.tempMedicineHistory);
      }
      nextstate.selDay = this.modal_obj.selDay;
      nextstate.selMonth = this.modal_obj.selMonth;
      nextstate.selYear = this.modal_obj.selYear;
      if(this.prescriptionTreeRef.current != undefined){
        this.prescriptionTreeRef.current.testTreeRender(nextstate);
      }
      return false;
    }

    // console.log("05");
    if (this.selected_tab_flag == 1) {
      this.selected_tab_flag = 0;
      return true;
    }

    // console.log("06");
    if (this.state.isLoaded == true) {
      // console.log("07");
      if(this.autoLogoutModalShow != this.context.autoLogoutModalShow){
        return false;
      }
      this.changeState = JSON.stringify(this.state) != JSON.stringify(nextstate);
      this.changeProps = JSON.stringify(this.props) != JSON.stringify(nextprops);
      this.autoLogoutModalShow = this.context.autoLogoutModalShow;

      if (this.state.unusedDrugSearch != nextstate.unusedDrugSearch) {
        if(this.prescribeTableRef.current != undefined){
          this.prescribeTableRef.current.testSearchOptionRender("unusedDrugSearch", nextstate.unusedDrugSearch);
        }
        // YJ604 カルテ表示中にブラウザが閉じたりした場合の復元の修正
        if (this.firstLogin != true) {
          return false;
        }
      }
      if (this.state.profesSearch != nextstate.profesSearch) {
        this.prescribeTableRef.current.testSearchOptionRender("profesSearch", nextstate.profesSearch);
        // YJ604 カルテ表示中にブラウザが閉じたりした場合の復元の修正
        if (this.firstLogin != true) {
          return false;
        }
      }
      if (this.state.normalNameSearch != nextstate.normalNameSearch) {
        if(this.prescribeTableRef.current != undefined){
          this.prescribeTableRef.current.testSearchOptionRender("normalNameSearch", nextstate.normalNameSearch);
        }
        // YJ604 カルテ表示中にブラウザが閉じたりした場合の復元の修正
        if (this.firstLogin != true) {
          return false;
        }
      }
      // console.log("08");
      if (this.state.isDoctorsOpen == true) {
        return true;
      }
      if(this.state.soapTrees != nextstate.soapTrees ||
        this.state.curScrollTop != nextstate.curScrollTop ||
        this.state.selYear != nextstate.selYear ||
        this.state.selMonth != nextstate.selMonth ||
        this.state.selDay != nextstate.selDay
      ) {
        if (this.state.titleTab == 0) {
          this.tempMedicineHistory = [...nextstate.medicineHistory];
          if(this.medicineSelectionRef.current != undefined){
            this.medicineSelectionRef.current.testMedRender(this.tempMedicineHistory, this.modal_obj.isEdintingIndex);
          }
        }
        return false;
      }

      // console.log("09");
      // presData
      // 08/26 this.tempPresData != undefined => when load from soap, 処方や注射をSOAP画面から「編集」で開いた場合に「数量の変更」で単位が表示されない不具合
      if (this.tempPresData != undefined && JSON.stringify(this.tempPresData) != JSON.stringify(nextstate.presData)) {
        // console.log("10");
        this.tempPresData = [...nextstate.presData];
        if(this.prescribeTableRef.current != undefined){
          this.prescribeTableRef.current.testRender(this.tempPresData);
        }
        if (this.state.titleTab == 0) {
          // medicineHistory
          if (JSON.stringify(this.tempMedicineHistory) == JSON.stringify(nextstate.medicineHistory)) {
            return false;
          } else {
            this.tempMedicineHistory = [...nextstate.medicineHistory];
            if(this.medicineSelectionRef.current != undefined){
              this.medicineSelectionRef.current.testMedRender(this.tempMedicineHistory, this.modal_obj.isEdintingIndex);
            }
          }
        } else if(this.state.titleTab == 1) {
          if (JSON.stringify(this.tempMedicineRankHistory) == JSON.stringify(nextstate.medicineRankData)) {
            return false;
          } else {
            this.tempMedicineRankHistory = [...nextstate.medicineRankData];
            if(this.medicineRankSelectionRef.current != undefined){
              this.medicineRankSelectionRef.current.testMedRankRender(this.tempMedicineRankHistory);
            }
          }
        } else if(this.state.titleTab == 2) {
          if (JSON.stringify(this.tempMedicineSetHistory) == JSON.stringify(nextstate.medicineSetData)) {
            return false;
          } else {
            this.tempMedicineSetHistory = [...nextstate.medicineSetData];
            if (this.medicineSetSelectionRef.current != null && this.medicineSetSelectionRef.current != undefined) {
              this.medicineSetSelectionRef.current.testMedSetRender(this.tempMedicineSetHistory);
            }
          }
        }
        // console.log("11");
        return false;
      }

      if(this.state.titleTab == 1) {
        if (JSON.stringify(this.tempMedicineRankHistory) != JSON.stringify(nextstate.medicineRankData)) {          
          this.tempMedicineRankHistory = [...nextstate.medicineRankData];
          if(this.medicineRankSelectionRef.current != undefined){
            this.medicineRankSelectionRef.current.testMedRankRender(this.tempMedicineRankHistory);
          }
          return false;
        }
      }

      // 区切りの削除
      if (this.modal_obj.rp_delete == 1 && JSON.stringify(this.tempMedicineHistory) == JSON.stringify(nextstate.medicineHistory)) {
        this.modal_obj.rp_delete = null;
        return false;
      }

      // console.log("12");
      // 投与日数一括変更
      if (this.modal_obj.change_rp_days == 1) {
        this.modal_obj.change_rp_days = null;
        return false;
      }

      // 備考・そのチェックボックス
      if (this.modal_obj.bulk_options == 1) {
        this.modal_obj.bulk_options = null;
        return false;
      }

      // console.log("13");
      // insert med refresh
      if (this.modal_obj.insert_med_option == 1) {
        this.modal_obj.insert_med_option = null;
        return false;
      }

      // amount confirm
      if (this.modal_obj.amount_confirm_option == 1) {
        this.modal_obj.amount_confirm_option = null;
        return false;
      }

      // change amount refresh
      if (this.modal_obj.change_amount_option == 1) {
        this.modal_obj.change_amount_option = null;
        return false;
      }

      // get usage
      if (this.modal_obj.get_Usage_option == 1) {
        this.modal_obj.get_Usage_option = null;
        return false;
      }

      // days confirm of setting usage
      if (this.modal_obj.days_confirm_option == 1) {
        this.modal_obj.get_Usage_option = null;
        return false;
      }

      // no refresh
      if (this.modal_obj.no_refresh == 1) {
        this.modal_obj.no_refresh = null;
        return false;
      }

      // editOrders refresh
      if (this.modal_obj.edit_no_refresh == 1) {
        this.modal_obj.edit_no_refresh = null;
        return false;
      }
      this.tempMedicineHistory = [...nextstate.medicineHistory];
      this.tempPresData = [...nextstate.presData];
    }
    // console.log("14");
    if (this.modal_obj.getHistoryEnd == 0) {
      return false;
    }

    // console.log("15");
    if (this.modal_obj.getHistoryEnd == 1 && this.state.titleTab == 0) {
      // console.log("16");
      //外来のみ... ボタンのグレーアウト解除
      $(".status-select button").removeClass("btn-disable");
      if(this.medicineSelectionRef.current != undefined){
        this.medicineSelectionRef.current.testIsLoadedRender(true);
      }
      if(this.prescribeTableRef.current != undefined){
        this.prescribeTableRef.current.testIsLoadedRender(true);
      }
      this.tempMedicineHistory = [...nextstate.medicineHistory];
      if(this.medicineSelectionRef.current != undefined){
        this.medicineSelectionRef.current.testMedRender(this.tempMedicineHistory, this.modal_obj.isEdintingIndex);
      }
      this.modal_obj.getHistoryEnd = -1;
      if(this.prescriptionTreeRef.current != undefined){
        this.prescriptionTreeRef.current.testTreeRender(this.state);
      }
      return false;
    }
    // console.log("17");
    return true;
  }

  getDepartment = e => {
    this.modal_obj.department = e.target.value;
    this.modal_obj.departmentId = e.target.id;
    let remark_status = {
      department: this.modal_obj.department,
      departmentId: this.modal_obj.departmentId
    };
    this.remarkRef.current.testRemarkRender(remark_status);
    this.storeDataInCache();
  }

  getPsychoReason = e => {
    this.modal_obj.psychotropic_drugs_much_reason = e.target.value;
    let remark_status = {
      psychotropic_drugs_much_reason: this.modal_obj.psychotropic_drugs_much_reason
    };
    this.remarkRef.current.testRemarkRender(remark_status);
    let storeData ={"is_reload_state": false};
    this.storeDataInCache(storeData);
  }

  getFreeComment = e => {
    this.modal_obj.free_comment = e.target.value;
    let remark_status = {
      free_comment: this.modal_obj.free_comment
    };
    this.remarkRef.current.testRemarkRender(remark_status);
    let storeData ={"is_reload_state": false};
    this.storeDataInCache(storeData);
  }

  getAdditionsCheck = (additions_check, additions_send_flag_check) => {
    this.additions_action = true;
    let data = {};
    data.additions_check = additions_check;
    data.additions_send_flag_check = additions_send_flag_check;
    data.is_reload_state = false;
    this.storeDataInCache(data);
  }

  getPoulticeReason = e => {
    this.modal_obj.poultice_many_reason = e.target.value;
    let remark_status = {
      poultice_many_reason: this.modal_obj.poultice_many_reason
    };
    this.remarkRef.current.testRemarkRender(remark_status);
    let storeData ={"is_reload_state": false};
    this.storeDataInCache(storeData);
  }

  selectInOut = e =>{
    // if loading, no operation
    if (this.state.stop_prescribe_table_load == false && this.state.isLoaded == false) {
      return;
    }
    if (this.context.$getKarteMode(this.props.match.params.id) == KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
    // 死亡状態に関する修正
    if (karteApi.isDeathPatient(this.props.match.params.id)){
      this.modal_obj.alertMessage = "death";
      if (this.patientModalRef.current != undefined) {
        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      }
      return;
    }

    // 院内/院外や、入院処方の各タブは「編集」の際は変更不可です。
    if (this.state.isForUpdate !== undefined && this.state.isForUpdate) {
      return;
    }

    let cacheState = karteApi.getSubVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.m_cacheSerialNumber);
    let hasAdministratePeriod = false;
    if (cacheState != undefined && cacheState != null && cacheState[0].presData.length > 0) {
      cacheState[0].presData.map(item=>{
        if (item.administrate_period != undefined && item.administrate_period != null) {
          hasAdministratePeriod = true;
        }
      });
    }
    if (hasAdministratePeriod) {
      return;
    }

    this.modal_obj.inOut = parseInt(e.target.id);
    let remark_status = {
      id: this.modal_obj.inOut,
      unusedDrugSearch: this.state.unusedDrugSearch,
      profesSearch: this.state.profesSearch,
      normalNameSearch: this.state.normalNameSearch
    };
    let inout_status = {
      inOut: this.modal_obj.inOut
    };
    if (this.modal_obj.inOut == 5) {
      inout_status.potion = 0;
    } else {
      inout_status.potion = 2;
    }
    this.modal_obj.potion = inout_status.potion;
    this.inOutRef.current.testInOutRender(remark_status);
    this.remarkRef.current.testRemarkRender(inout_status);
    let data ={"is_reload_state": false};
    this.storeDataInCache(data);
  };

  selectTitleTab = e => {
    if (this.state.isLoaded == false) return;
    this.selected_tab_flag = 1;
    if(parseInt(e.target.id) == 0) {
      this.setState({
        titleTab: parseInt(e.target.id) ,
      });
    }
    if(parseInt(e.target.id) == 1) {
      this.setState({
        stop_prescribe_table_load:true,
        titleTab: parseInt(e.target.id),
        isLoaded: false,
      }, () => {
        this.getMedicineRankData({
          id: this.props.match.params.id
        });
      });
    }
    if(parseInt(e.target.id) == 2) {
      this.setState({
        stop_prescribe_table_load:true,
        titleTab: parseInt(e.target.id) ,
        isLoaded: false,
      }, () => {
        this.getSetData(this.context.selectedDoctor.code, this.context.department.code, 0, 0);
      });
    }
  };

  closeModal = () => this.setState({ modalVisible: false, isSending: false });

  cancelExamination = (url) => this.props.history.replace(url);

  allPrescriptionOpen = () =>this.setState({ allPrescriptionOpen: !this.state.allPrescriptionOpen });

  PACSOn = () => this.setState({ pacsOn: true });

  PACSOff = () => this.setState({ pacsOn: false });

  openNotConsentedModal = () =>{
    // this.setState({ isNotConsentedModalOpen: true });
    this.modal_obj.isNotConsentedModalOpen = true;
    if(this.patientModalRef.current != undefined){
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  }

  // closeNotConsentedModal = () =>this.setState({ isNotConsentedModalOpen: false });

  refreshNotConsented = () => {
    this.props.history.replace("/patients/"+this.props.match.params.id+"/prescription");
  }

  getdoubleDigestNumer = number => ("0" + number).slice(-2);

  getTabId = id =>this.setState({ tab: parseInt(id) }, function() {this.storeDataInCache();});

  openBodyParts = index =>{
    this.modal_obj.isBodyPartOpen = true;
    this.modal_obj.indexOfEditPres = index;
    if (this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  }

  // 投与期間入力モーダル
  openAdministratePeriodInputModal = index =>{
    this.modal_obj.isAdministratePeriodOpen = true;
    this.modal_obj.indexOfEditPres = index;
    if(this.patientModalRef.current != undefined){
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  }

  getDoctorModal =async (e) => {
    let id = e.target.id;
    let name = e.target.getAttribute("label");
    let department_name = "その他";
    this.state.doctors.map(doctor => {
      if (doctor.doctor_code === parseInt(id)) {
        if (doctor.diagnosis_department_name !== "") {
          department_name = doctor.diagnosis_department_name;
        }
      }
    });
    this.modal_obj.isDoctorsOpen = false;
    // if (this.patientModalRef.current != undefined) {
    //   this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    // }
    if (this.act_msg != null && this.act_msg != undefined && this.act_msg != "") {
      if(this.act_msg === "last_prescription"){
        this.act_msg = "";
        let department_code = this.context.department.code == 0 ? 1 : this.context.department.code;
        let karte_status_code = 1;
        if(this.context.karte_status.code == 1){
          karte_status_code = 3;
        }
        if(this.context.karte_status.code == 2){
          karte_status_code = 2;
        }
        await this.getLastPrescription(this.props.match.params.id, department_code, karte_status_code, null, null, "prescription_page");
        // YJ404 処方画面で前回処方を使うと確認がグレーアウトしたままで、SOAP右カラムに追加されている不具合
        if (this.confirmButtonRef.current != undefined && this.confirmButtonRef.current != undefined) {
          this.confirmButtonRef.current.testConfirmRender(1);
          this.modal_obj.canConfirm = 1;
        }
      } else {
        //check 手技 is_enabled
        let _hasUnenabledUsage = this.hasUnenabledUsage(this.modal_obj.dropOrderUsageList);
        if (_hasUnenabledUsage == false) {
          await this.doOnDropEvent(this.act_msg);
        } else {
          this.modal_obj.hasUnenabledUsage = true;
          this.modal_obj.confirm_message = "使用できない用法が選択されています。登録する場合は用法を変更してください。";
          if (this.patientModalRef.current != undefined) {
            this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
          }
        }
      }
    }
    this.context.$updateDoctor(id, name, department_name);
  }

  hasUnenabledUsage = (dropOrderList) => {
    if (dropOrderList == null || dropOrderList == undefined || dropOrderList.length <= 0) {
      return false;
    }
    let nHasUnenabledUsage = 0;
    if (this.modal_obj.usageData != null && this.modal_obj.usageData != undefined) {
      this.modal_obj.usageData.external.all.map(ele=>{
        if (dropOrderList.includes(ele.code) && ele.is_enabled == 0) {
          nHasUnenabledUsage = 1;
        }
      });
      if (nHasUnenabledUsage == 1) return true;
      this.modal_obj.usageData.injection.all.map(ele=>{
        if (dropOrderList.includes(ele.code) && ele.is_enabled == 0) {
          nHasUnenabledUsage = 1;
        }
      });
      if (nHasUnenabledUsage == 1) return true;
      if (this.modal_obj.usageData.internal != null && this.modal_obj.usageData.internal.internal_other != null) {
        this.modal_obj.usageData.internal.internal_other.map(ele=>{
          if (dropOrderList.includes(ele.code) && ele.is_enabled == 0) {
            nHasUnenabledUsage = 1;
          }
        });
      }
      if (nHasUnenabledUsage == 1) return true;
      this.modal_obj.usageData.internal.times_1.map(ele=>{
        if (dropOrderList.includes(ele.code) && ele.is_enabled == 0) {
          nHasUnenabledUsage = 1;
        }
      });
      if (nHasUnenabledUsage == 1) return true;
      this.modal_obj.usageData.internal.times_2.map(ele=>{
        if (dropOrderList.includes(ele.code) && ele.is_enabled == 0) {
          nHasUnenabledUsage = 1;
        }
      });
      if (nHasUnenabledUsage == 1) return true;
      this.modal_obj.usageData.internal.times_3.map(ele=>{
        if (dropOrderList.includes(ele.code) && ele.is_enabled == 0) {
          nHasUnenabledUsage = 1;
        }
      });
      if (nHasUnenabledUsage == 1) return true;
      this.modal_obj.usageData.when_necessary.all.map(ele=>{
        if (dropOrderList.includes(ele.code) && ele.is_enabled == 0) {
          nHasUnenabledUsage = 1;
        }
      });
      if (nHasUnenabledUsage == 1) return true;
    }
    return false;
  }

  onDragOver = e => {
    e.preventDefault();
  };

  onDropEvent = async(e, type=null, from=null) => {
    if (this.context.$getKarteMode(this.props.match.params.id) == KARTEMODE.READ) return;
    // 死亡状態に関する修正
    if (karteApi.isDeathPatient(this.props.match.params.id)){
      this.modal_obj.alertMessage = "death";
      if (this.patientModalRef.current != undefined) {
        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      }
      return;
    }
    // ----------- start ---------
    let canEdit = 0;
    if (this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION,this.context.AUTHS.REGISTER)
      || this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION,this.context.AUTHS.REGISTER_OLD)
    ) {
      canEdit = 1;
    }
    if (this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION,this.context.AUTHS.REGISTER_PROXY)
      || this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION,this.context.AUTHS.REGISTER_PROXY_OLD)
    ) {
      canEdit = 2;
    }

    if (canEdit === 0) {
      /*@cc_on  var w = window; eval('var window = w'); @*/
      window.sessionStorage.setItem("alert_messages", "権限がありません。");
      return;
    }

    //check usage is_enabled = 処方の用法の有効・無効を判定するように
    this.modal_obj.dropOrderUsageList = this.getDropOrderUsageList(e);
    if (this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
    let _hasUnenabledUsage = this.hasUnenabledUsage(this.modal_obj.dropOrderUsageList);

    // if type = "hasDoctor", mean selectedDoctor context is set.
    if (canEdit === 2 && this.context.selectedDoctor.code <= 0 && type == null) {
      this.modal_obj.isDoctorsOpen = true;
      if (this.patientModalRef.current != undefined) {
        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      }
      this.act_msg = e.dataTransfer.getData("text");
      return;
    }
    // ----------- end ---------

    if (_hasUnenabledUsage == false) {
      await this.doOnDropEvent(e, from);
    } else {
      // if (e.dataTransfer != undefined) {
      this.act_msg = e.dataTransfer.getData("text");
      // }
      this.modal_obj.hasUnenabledUsage = true;
      this.modal_obj.confirm_message = "使用できない用法が選択されています。登録する場合は用法を変更してください";
      if (this.patientModalRef.current != undefined) {
        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      }
    }
  }

  doOnDropEvent = async (e, from=null) => {
    this.act_msg = "";
    this.modal_obj.dropOrderUsageList = null;
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
        rejectList[medicine.item_number] = {item: medicine, reject};
      }

      let alert = this.checkDropContraindicationAlert(medicine);
      if(alert.length > 0){
        alertList[medicine.item_number] = {item: medicine, alert};
      }
    });

    let bgMedicine = "";
    if (duplicateList.length > 0) {
      bgMedicine = "medicine_duplicate";
    }
    let step = 0;
    let ret_step = this.getDropModalStep(duplicateList, rejectList, alertList);
    step = ret_step[0];
    if(ret_step[1] != "") {
      bgMedicine = ret_step[1];
    }
    this.modal_obj.dropStep = step;
    if(bgMedicine!= "") {
      this.modal_obj.bgMedicine = bgMedicine;
    }
    //modal state

    // soap drop
    let is_drop_soap = typeof(e) == "string";
    let dropText = is_drop_soap ? e : e.dataTransfer.getData("text");
    this.modal_obj.dropOrderList = dropOrderList;
    this.modal_obj.duplicateList = duplicateList;
    this.modal_obj.rejectList = rejectList;
    this.modal_obj.alertList = alertList;
    this.modal_obj.dropText = dropText;
    if (!is_drop_soap) e.preventDefault();
    if (step !== 0) {
      if (this.patientModalRef.current != undefined) {
        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      }
      return;
    }
    await this.onDrop(dropText, from);
  }

  // SOAP画面からDragAndDrop追加操作
  getDropPrescriptionData = async (number = 0) => {
    let param = {
      numbers: number,
      del_order: 1 // SOAP中央カラムから削除済みの処方、注射の内容を右カラムにDoした時に、処方、注射画面に内容が表示されない(1218-5)
    };
    let drop_prescription_data = await apiClient.get("/app/api/v2/order/prescription/patient", {
      params: param
    });
    this.m_presDataFromSoap = drop_prescription_data;
    return drop_prescription_data;
  }

  // SOAP画面からDragAndDrop編集操作
  getEditDropPrescriptionData = async (number = 0) => {
    let param = {
      numbers: number
    };
    let edit_drop_prescription_data = await apiClient.get("/app/api/v2/order/prescription/patient", {
      params: param
    });
    let prescription = undefined;
    if (edit_drop_prescription_data != null && edit_drop_prescription_data != undefined) {
      Object.keys(edit_drop_prescription_data).map(medicine => {
        if (parseInt(medicine) === parseInt(number)) {
          prescription = edit_drop_prescription_data[medicine];
        }
      });
    }
    return prescription;
  }

  getAdditions = async (init=false) => {
    const { data } = await axios.post(
      "/app/api/v2/order/prescription/getAdditionMaster",
      {
        type: "prescription",
        function_id: this.context.karte_status.code
      }
    );
    let additions = (data != null && data != undefined) ? data : null;
    if(init){
      return additions;
    } else {
      this.setState({additions});
    }
  }

  getConditionByAdditions = async () => {
    const { data } = await axios.post(
      "/app/api/v2/order/prescription/getConditionByAdditions",
      {system_patient_id:this.props.match.params.id}
    );
    if(this.context.addition_condition !== undefined){
      this.context.$updateAdditionCondition(undefined);
    }
    return data;
  }

  gotoPage = (type) => {
    let bFlag = false;
    if(this.context.$canDoAction(this.context.FEATURES.SOAP, this.context.AUTHS.REGISTER) || this.context.$canDoAction(this.context.FEATURES.SOAP, this.context.AUTHS.REGISTER_PROXY)){
      bFlag = true;
    }
    this.context.$screenCapture();
    switch(type){
      case this.context.OperationURL.SOAP:
        if(bFlag)
          this.props.history.replace(`/patients/${this.props.match.params.id}/soap`);
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

  insertMedModal = (condition = true) =>{
    if (condition == false) {      
      this.modal_obj.hideDuplicateModal = true;
      this.modal_obj.modalType = "";
      this.modal_obj.insertStep = 0;
    } else {
      this.modal_obj.insertMedicineFlag = false;
      this.modal_obj.hideDuplicateModal = true;
      this.modal_obj.insertStep = 1;
      this.modal_obj.modalType = "";
    }
    this.insertMed(this.m_medicine, this.m_indexOfInsertPres, this.m_indexOfInsertMed, condition);
  }

  handleInsertMedicine = (medicine, indexOfInsertPres, indexOfInsertMed) => {
    if( !this.checkCanAddMedicine(medicine.code) ) {
      if (medicine.if_duplicate === "alert") {
        this.modal_obj.showMedicineSelected = medicine.name + "は";
        this.modal_obj.showMedicineOrigin = "";
        this.modal_obj.hideDuplicateModal = false;
        this.modal_obj.showMedicineContent = "既に存在しますが追加しますか？";
        this.modal_obj.modalType = "Duplicate";
        if (this.patientModalRef.current != undefined) {
          this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
        }
      } else {
        this.modal_obj.showMedicineSelected = medicine.name + "は";
        this.modal_obj.showMedicineOrigin = "";
        this.modal_obj.hideDuplicateModal = false;
        this.modal_obj.showMedicineContent = "既に存在するため追加できません。";
        this.modal_obj.modalType = "Notify";
        if (this.patientModalRef.current != undefined) {
          this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
        }
      }
    } else{
      this.modal_obj.insertStep = 1;
      this.insertMed(medicine, indexOfInsertPres, indexOfInsertMed);
    }
    this.m_medicine = medicine;
    this.m_indexOfInsertPres = indexOfInsertPres;
    this.m_indexOfInsertMed = indexOfInsertMed;
  }

  dropRun = () => {
    this.onDrop(this.modal_obj.dropText);
  }

  diseaseOrderOk = () => {
    if(!this.checkPeriodMedicine(this.modal_obj.diseaseOrder)) {
      if(!this.copyOrder(this.modal_obj.diseaseOrder)) {
        // alert("このRpは薬品が重複されているので追加できません。");
      }
    }
    this.modal_obj.diseaseOrderModal = false;
    this.modal_obj.diseaseOrderData = [];
    this.modal_obj.diseaseOrder = [];
    if (this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  }

  diseasePrescriptionOk = () => {
    this.modal_obj.diseasePrescriptionModal = false;
    this.modal_obj.diseasePrescriptionData = [];
    if (this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
    if(!this.checkPeriodMedicine(this.modal_obj.diseasePrescription, false)) {
      if(!this.copyOrders(this.modal_obj.diseasePrescription)) {
        // alert("このRpは薬品が重複されているので追加できません。");
      }
    }
    this.modal_obj.diseasePrescription = [];
  }

  periodOrderOk = () => {
    this.copyOrder(this.modal_obj.periodOrder);
    this.modal_obj.periodOrderModal = false;
    this.modal_obj.periodOrderData = [];
    this.modal_obj.periodOrder = [];
    if (this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  }

  periodPrescriptionOk = () => {
    this.copyOrders(this.modal_obj.periodPrescription);
    this.modal_obj.periodPrescriptionModal = false;
    this.modal_obj.periodPrescriptionData = {};
    this.modal_obj.periodPrescription = [];
    if (this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  }

  showDiagnosisPermission = (rpIdx, medIdx) => {
    let diagnosisData =  {};
    diagnosisData[rpIdx] = [medIdx];
    this.modal_obj.diagnosisModal = true;
    this.modal_obj.diagnosisData = diagnosisData;
    if (this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  }

  checkPermissionByType = (rpIdx, medIdx, nType) => {
    let selectedMedicine = this.state.presData[rpIdx].medicines[medIdx];
    // [区分]
    if (nType === PERMISSION_TYPE.DIAGNOSIS) {
      let diagnosisData = {};
      diagnosisData[rpIdx] = [medIdx];
      this.modal_obj.insertMedicineFlag = false;
      this.modal_obj.diagnosisModal = true;
      this.modal_obj.diagnosisData = diagnosisData;
      if (this.patientModalRef.current != undefined) {
        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      }
    }
    // [用量]
    if (nType === PERMISSION_TYPE.USAGE) {
      this.handleMedicineClick(rpIdx, medIdx);
    }
    // [禁忌]
    if (nType === PERMISSION_TYPE.DISEASE) {
      this.modal_obj.diseaseModal = true;
      this.modal_obj.messageType = "alert";
      this.modal_obj.diseaseData = selectedMedicine.disease_alert_content;
      this.modal_obj.insertMedicineFlag = false;
      if (this.patientModalRef.current != undefined) {
        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      }
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
      this.modal_obj.diagnosisOrderModal = true;
      this.modal_obj.messageType ="duplicate";
      this.modal_obj.diagnosisOrderData = duplicateOrderData;
      if (this.patientModalRef.current != undefined) {
        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      }
    }
    // [併用]
    if (nType === PERMISSION_TYPE.ALERT) {
      let result = this.checkMedicineContraindication(selectedMedicine);
      this.modal_obj.hideDuplicateModal = false;
      this.modal_obj.showMedicineSelected = selectedMedicine.medicineName + "は";
      this.modal_obj.modalType = "OnlyAlert";
      this.modal_obj.insertStep = result;
      if (this.patientModalRef.current != undefined) {
        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      }
    }
  }

  diagnosisOK = () => {
    let rpIdx = 0;
    let medIdx = 0;
    Object.keys(this.modal_obj.diagnosisData).map(key=>{
      rpIdx = parseInt(key);
      medIdx = this.modal_obj.diagnosisData[key][0];
    });
    let original = this.state.presData;
    original[rpIdx].medicines[medIdx].diagnosis_permission = 1;
    this.modal_obj.diagnosisModal = false;
    this.modal_obj.diagnosisData = {};
    this.modal_obj.insertMedicineFlag  = true;
    // ■1211-3 処方薬品登録
    this.modal_obj.med_diagnosis_ok  = true;
    if (this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
    let data = {};
    data['presData'] = original;
    data['is_reload_state'] = false;
    this.storeDataInCache(data);
  }

  diagnosisOrderOK = () => {
    // ■YS5 処方箋単位でDoしたときに、区分跨ぎエラーの警告でキャンセルすると、品名の反映がキャンセルされない
    if (this.modal_obj.diagnosisOrderModal_from_copyOrders != undefined && this.modal_obj.diagnosisOrderModal_from_copyOrders != null) {
      this.modal_obj.diagnosisOrderModal_from_copyOrders = null;
    }

    let diagnosisOrder = this.modal_obj.diagnosisOrderData;
    let presData = this.state.presData;
    Object.keys(diagnosisOrder).map(rpIdx=>{
      diagnosisOrder[rpIdx].map(medIdx=>{
        presData[rpIdx].medicines[medIdx].diagnosis_permission = 1;
      });
    });
    this.modal_obj.diagnosisOrderModal = false;
    this.modal_obj.diagnosisOrderData = {};
    this.modal_obj.messageType = "";
    this.modal_obj.presData = null;
    this.modal_obj.do_prescription = null; // all rp copy
    this.modal_obj.do_order = null; // rp copy
    /*@cc_on 
    var w = window;
    eval('var window = w');
    @*/
    window.localStorage.removeItem("last_order_pres_data");
    this.modal_obj.lastOrderIndex = null;// last usage
    if (this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
    let data = {};
    data['presData'] = presData;
    data['is_reload_state'] = false;
    this.storeDataInCache(data);
  }

  // check exist medicine data
  existMedicineData = (_presData = null) => {
    let result = false;
    let presData = _presData == null ? this.state.presData : _presData;
    presData.map(item=>{
      if (item.medicines[0].medicineName != "") {
        result = true;
      }
    });

    return result;
  }

  // RP1の用法の区分エラーのダイアログ
  diagnosisCancel = () => {
    let presData = JSON.parse(JSON.stringify(this.state.presData));
    this.modal_obj.diagnosisModal = false;
    this.modal_obj.diagnosisData = {};
    this.modal_obj.insertMedicineFlag = false;
    if (this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }

    if (presData[this.m_indexOfInsertPres] && presData[this.m_indexOfInsertPres].medicines.length > 0) {

      presData[this.m_indexOfInsertPres].medicines.splice(
        [this.m_indexOfInsertMed],
        1
      );
      if (presData[this.m_indexOfInsertPres].medicines.length == 0) {
        presData[this.m_indexOfInsertPres].medicines.push(this.getEmptyMedicine());
      }

      let data = {};
      data['presData'] = presData;
      data['is_reload_state'] = false;
      // return;
      this.storeDataInCache(data);
    }

  }

  // 用法区分エラーのダイアログ
  diagnosisOrderCancel = () => {
    let presData = JSON.parse(JSON.stringify(this.state.presData));
    /*@cc_on 
    var w = window;
    eval('var window = w');
    @*/

    if (this.modal_obj.diagnosisOrderModal_from_copyOrders == true &&
      this.modal_obj.do_item_details != null &&
      this.modal_obj.do_item_details != undefined &&
      this.modal_obj.do_item_details.length > 0) {

      // get all item_details
      let all_item_details = this.modal_obj.all_item_details;
      let result_item_details = [];

      if (all_item_details != undefined && all_item_details != null && all_item_details.length > 0) {
        let blank_insert = {classfic: 0, classfic_name:'', item_id: 0, item_name: "", attribute1:"0", format1:"", unit_name1:"", max_length1:"", value1:"", attribute2:"0", format2:"", unit_name2:"", max_length2:"", value2:""};
        all_item_details = all_item_details.filter(x=>x.item_id !== 0);

        // result_item_details = all_item_details.splice(all_item_details.length - this.modal_obj.do_item_details.length, this.modal_obj.do_item_details.length);
        result_item_details = all_item_details.splice(0, all_item_details.length - this.modal_obj.do_item_details.length);

        result_item_details.push(blank_insert);
      }

      this.modal_obj.all_item_details = null;
      this.modal_obj.do_item_details = null;
      this.diagnosisOrderModal_from_copyOrders = null;

      this.modal_obj.item_details = result_item_details;
      let cacheState = karteApi.getSubVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.m_cacheSerialNumber);
      if (cacheState != undefined && cacheState != null) {
        cacheState[0].item_details = result_item_details;
      }

      if (this.prescriptionNameRef.current != undefined && this.prescriptionNameRef.current != null) {
          this.prescriptionNameRef.current.testPrescriptionNameRender({item_details:result_item_details});
      }

    }

    // 用法を変更して区分エラーになった場合
    if (this.modal_obj.lastOrderIndex != null && this.modal_obj.lastOrderIndex != undefined) {
      let lastOrderData =  JSON.parse(window.localStorage.getItem("last_order_pres_data"));
      if (lastOrderData == null || lastOrderData == undefined) {
        return;
      }
      if (presData[this.modal_obj.lastOrderIndex]) {
        presData[this.modal_obj.lastOrderIndex] = lastOrderData;
        // ●YS68 空の薬品欄のEnterで用法選択操作をして途中キャンセル時の挙動の修正の残件
        // if (this.modal_obj.no_enableDays == 1) {
        let result = [];
        if (presData.length > 1 &&
          presData[presData.length - 1] != undefined &&
          presData[presData.length - 1].medicines[0].medicineName == "" &&
          presData[presData.length - 2] != undefined &&
          presData[presData.length - 2].usageName == "") {
          // remove last rp (no need)
          result = presData.splice(0, presData.length - 1);
        }
        if (result.length > 0) {
          presData = result;
        }
        // this.modal_obj.no_enableDays = null;
        // }

        let data = {};
        data['presData'] = presData;
        data['is_reload_state'] = false;
        this.storeDataInCache(data);
      }
      window.localStorage.removeItem("last_order_pres_data");
      this.modal_obj.lastOrderIndex = null;
      this.modal_obj.diagnosisOrderModal = false;
      this.modal_obj.messageType = "";
      this.modal_obj.diagnosisOrderData = {};
      this.modal_obj.presData = null;
      this.modal_obj.do_prescription = null; // all rp copy
      this.modal_obj.do_order = null; // rp copy
      if (this.patientModalRef.current != undefined) {
        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      }
      return;
    }

    // 処方箋単位でDoして用法区分エラーになった場合
    if (this.modal_obj.presData != null){
      presData = this.modal_obj.presData;
    }
    let delRpNumberArray = [];
    // this.modal_obj.do_prescription => prescription drag and drop
    // Doで用法区分エラーのダイアログが出たときのキャンセルが、Doを取りやめるのではなく当該薬剤を削除してDoになっている不具合
    if (this.modal_obj.do_prescription != null && this.modal_obj.do_prescription != undefined) {
      if (presData.length > 0) {
        presData.map((item, rpIdx)=>{
          if (this.modal_obj.do_prescription.order_data != undefined && this.modal_obj.do_prescription.order_data.order_data != undefined && this.modal_obj.do_prescription.order_data.order_data.length > 0) {
            let isExist = 0;
            this.modal_obj.do_prescription.order_data.order_data.map(ele=>{
              if (item.order_number != undefined) {
                if (ele.order_number == item.order_number) {
                  isExist = 1;
                }
              } else if(ele.serial_key > 0 && ele.serial_key == item.serial_key) {
                isExist = 1;
              }
            });
            if (isExist == 1) {
              if (this.state.titleTab == 0) {
                // this.medicineSelectionRef.current.testMedRender(this.setDoCopyStatus(item.order_number, false));
                this.setDoCopyStatus(item.order_number, false);
              }
              delRpNumberArray.push(rpIdx);
            }
          }
        });
      }
    }
    // this.modal_obj.do_order => rp drag and drop
    if (this.modal_obj.do_order != null && this.modal_obj.do_order != undefined) {
      if (presData.length > 0) {
        presData.map((item, rpIdx)=>{
          if (item.order_number != undefined) { // 1218-19 Rp2が消える
            if (this.modal_obj.do_order.order_number == item.order_number) {
              if (this.state.titleTab == 0) {
                // this.medicineSelectionRef.current.testMedRender(this.setDoCopyStatus(item.order_number, false));
                this.setDoCopyStatus(item.order_number, false);
              }
              delRpNumberArray.push(rpIdx);
            }
          } else if(this.modal_obj.do_order.serial_key > 0 && this.modal_obj.do_order.serial_key == item.serial_key) {
            delRpNumberArray.push(rpIdx);
          }
        });
      }
    }
    let result_presData = [];
    if (delRpNumberArray.length > 0) {
      result_presData = presData.filter((item, idx)=>{
        if (delRpNumberArray.includes(idx)) {
          return false;
        } else {
          return true;
        }
      });
    }
    window.localStorage.removeItem("last_order_pres_data");
    this.modal_obj.diagnosisOrderModal = false;
    this.modal_obj.messageType = "";
    this.modal_obj.diagnosisOrderData = {};
    this.modal_obj.presData = null;
    this.modal_obj.do_prescription = null; // all rp copy
    this.modal_obj.do_order = null; // rp copy
    if (this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
    if (result_presData.length > 1) { // rp exist
      let data = {};
      data['presData'] = result_presData;
      data['is_reload_state'] = false;
      this.storeDataInCache(data);
    } else { // rp no exist
      // if exist med with name but not have usage
      if (result_presData.length == 1 &&
        result_presData[0].medicines != undefined &&
        result_presData[0].medicines != null &&
        result_presData[0].medicines.length > 0 &&
        result_presData[0].medicines[0].medicineName != "") {
        let data = {};
        data['presData'] = result_presData;
        data['is_reload_state'] = false;
        this.storeDataInCache(data);
      } else {
        this.confirmButtonRef.current.testConfirmRender(0);
        // initialize med(presData) info
        let initData = {
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
        };
        this.setState({
          presData: [initData],
          indexOfInsertMed: -1,
          isEdintingIndex: -1
        }, ()=> {
          karteApi.delSubVal(this.props.match.params.id, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.m_cacheSerialNumber);
        });
      }

    }
  }

  copyOrdersPrescription = async (prescription, type=null) => {
    if (type == "hasDoctor") {
      //処方Do展開
      let checkDisease = await this.checkDiseasePrescription(prescription);
      if (!checkDisease) {      
        if(!this.checkPeriodMedicine(prescription, false)) {
          this.copyOrders(prescription);
        }
      }
      return;
    }
    let post_str = "prescription:" + prescription.number;
    this.onDropEvent(post_str, type);
  }

  copyOrderPrescription = (order, type=null) => {
    let post_str = "order:" + order.order_number;
    // when do operation in patient page, selectedDoctor context unset well
    this.onDropEvent(post_str, type);
  }

  handleUsageOk = () => {
    let _presData = this.state.presData;
    _presData[this.modal_obj.usageRpIdx].medicines[this.modal_obj.usageRpOrderIdx].usage_permission = 1;
    let data = {};
    data['presData'] = _presData;
    this.modal_obj.usageAlertModal = false;
    this.modal_obj.usageRpIdx = -1;
    this.modal_obj.usageRpOrderIdx = -1;
    if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
    data['is_reload_state'] = false;
    this.storeDataInCache(data);
  }

  handleUsageDetail = () =>{
    let detailInfo = {};
    let medicine = this.state.presData[this.modal_obj.usageRpIdx].medicines[this.modal_obj.usageRpOrderIdx];
    detailInfo[medicine.medicineId] = medicine.medDetail;
    this.modal_obj.usageMedDetailModal = true;
    this.modal_obj.usageMedicineDetail = detailInfo;
    if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  }

  handleUsageMedDetailCancel = () => {
    this.modal_obj.usageMedDetailModal = false;
    if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  }

  handleMedicineClick = (rpIdx, rpOrderIdx) =>{
    this.modal_obj.usageAlertModal = true;
    this.modal_obj.usageAlertContent = this.state.presData[rpIdx].medicines[rpOrderIdx].usage_alert_content;
    this.modal_obj.usageRpIdx = rpIdx;
    this.modal_obj.usageRpOrderIdx = rpOrderIdx;
    if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  }

  changeDepartment = (prescription) => {
    this.modal_obj.changeDepartmentModal = true;
    this.modal_obj.departmentDate = prescription.updated_at;
    this.modal_obj.departmentNumber = prescription.number;
    this.modal_obj.departmentCode = prescription.order_data.department_code;
    this.modal_obj.departmentName = prescription.order_data.department;
    if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  }

  getDepartmentName = code => {
    let name = "";
    this.departmentOptions.map(item => {
      if (item.id === parseInt(code)) {
        name = item.value;
      }
    });
    return name;
  };

  handleChangeDeparment = async(code) => {
    await this.setDepartment(this.modal_obj.departmentNumber, code + 1).then(this.updateChangeDepartment);
  };

  updateChangeDepartment = (arr) => {
    /*@cc_on 
    var w = window;
    eval('var window = w');
    @*/
    if(arr[0] == 0) return;
    let new_number = arr[0];
    let code = arr[1];
    let cacheMedicineHistory = JSON.parse(
      window.localStorage.getItem("haruka_cache_medicineHistory")
    );
    if(cacheMedicineHistory != null) {
      cacheMedicineHistory = cacheMedicineHistory.map((item) => {
        if(item.number == this.modal_obj.departmentNumber) {
          item.history = (item.history == "") ? item.number + "," + new_number : item.history + "," + new_number
          item.number = new_number;
          item.order_data.department_code = code;
          item.order_data.department = this.getDepartmentName(code);
        }
        return item;
      });
      window.localStorage.setItem("haruka_cache_medicineHistory",  JSON.stringify(cacheMedicineHistory));
      this.getTrackData(new_number);
      this.setState({ medicineHistory: cacheMedicineHistory  });
    }

  };

  handleUsageOverOK = (chk) => {
    const { presData } = this.state;
    chk.map((item, i) => {
      presData[this.modal_obj.usageOverItem[i][0]].medicines[this.modal_obj.usageOverItem[i][1]].usage_permission = 1;
    });
    this.modal_obj.usageOverModal = false;
    this.modal_obj.usageOverItem = [];
    if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
    let data = {};
    data['presData'] = presData;
    data['is_reload_state'] = false;
    this.storeDataInCache(data);
  }

  getDropModalStep = (arrDuplicateList = [], arrRejectList = [], arrAlertList = []) => {
    let bgMedicine = "";
    if (arrRejectList.length == 0) {
      if (arrDuplicateList.length == 0){
        if (arrAlertList.length != 0) {
          bgMedicine = "medicine_alert" ;
          return [2, bgMedicine];
        }
        return [0, bgMedicine];
      } else{
        let _existReject = false;
        arrDuplicateList.map(item=>{
          if (item.if_duplicate == "reject") {
            _existReject = true;
          }
        });
        if (_existReject == true) {
          return [1, bgMedicine];
        } else{
          bgMedicine = "medicine_alert" ;
          return [2, bgMedicine];
        }
      }
    }
    return [arrRejectList.length == 0 ? 0 : 1, bgMedicine];
  }

  registerSet = (prescription, type = null) => {
    this.modal_obj.registerSetModal = true;
    this.modal_obj.registerSetData = prescription;
    this.modal_obj.registerPatientSetData = type == "patient" ? true : false;
    if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  }

  handleRegisterSet = (strName) => {
    if (this.modal_obj.registerPatientSetData == true) {
      this.registerNewSet(strName, "patient");
    } else {
      this.registerNewSet(strName);
    }
    this.modal_obj.registerPatientSetData = false;
  }

  contextTitleTabsMenuAction = (act, tab_id, title ) => {
    this.modal_obj.periodSettingPrintModal = true;        
    this.modal_obj.periodSettingPrintTabId = tab_id;        
    this.modal_obj.periodSettingPrintTitle = title; 
    if (title == "よく使う薬剤") {
      this.modal_obj.prescriptionRankData = this.state.medicineRankData; 
    } else if(title == "処方歴") {

      let karte_status = 0;
      if (this.context.karte_status.code == 0) {
        karte_status = this.state.select_outpatient == true ? 1 : 0;
      } else if (this.context.karte_status.code == 2) {
        karte_status = this.state.select_home == true ? 2 : 0;
      } else if (this.context.karte_status.code == 1) {
        karte_status = this.state.select_hospitalize == true ? 3 : 0;
      }

      let department_code = this.context.department.code;
      if (department_code == 0) {
        department_code = 1;
      }
      if (this.state.categoryType == SOAP_TREE_CATEGORY.ALL_ORDER || this.state.categoryType == SOAP_TREE_CATEGORY.ALL_ORDER_LATEST) {
        department_code = 0;
      }

      let latest_flag = 0;
      if (this.state.selYear == -1 && this.state.selMonth == -1 && this.state.selDay == -1) {
        latest_flag = 1;        
      }

      this.modal_obj.print_post_param = {
        department: department_code,
        karte_status: karte_status,
        search_date: null,
        latest_flag,
        patient_id: this.props.match.params.id,
        init_period_date: this.search_date
      };

      this.modal_obj.medicineHistoryData = this.state.medicineHistory; 
    }       
    if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  }

  confirmPrintPrescription = () => {
    // print

    // close modal
    this.modal_obj.periodSettingPrintModal = null;  
    this.modal_obj.periodSettingPrintTabId = null;  
    this.modal_obj.periodSettingPrintTitle = null;
    this.cur_modal_obj.print_post_param = null;
    if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  }

  contextMenuAction = async(act, nCategoryOperation, preset_do_count=null) => {
    /*@cc_on 
    var w = window;
    eval('var window = w');
    @*/
    if (act === "doDeleteArea") {
      let msg = "処方";
      if (nCategoryOperation == OPERATION_TYPE.REGIST) {
        msg = msg + "の入力内容を破棄しますか？";
      } else if (nCategoryOperation == OPERATION_TYPE.EDIT) {
        msg = msg + "の変更内容を破棄しますか？";
      }
      this.modal_obj.confirm_message = msg;
      this.modal_obj.confirm_type = "prescription";
      if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      }
    } else if (act.split(":")[0] === "prescription_do_deployment") {
      let index = act.split(":")[1];
      let preset_do_deployment_data = karteApi.getVal(this.props.match.params.id,CACHE_LOCALNAMES.PRESET_DO_DEPLOYMENT);
      let preset_data = {};
      let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
      let patient_do_get_mode = initState.patient_do_get_mode;
      if(patient_do_get_mode == 0 || authInfo.staff_category === 1){
        preset_data.order_data = preset_do_deployment_data[index]['prescription_data'];
      } else {
        preset_data.order_data = preset_do_deployment_data[this.context.selectedDoctor.code][index]['prescription_data'];
      }
      this.copyOrdersPrescription(preset_data);
    } else if(act === "prescription_do_set"){
      let preset_do_data = karteApi.getVal(this.props.match.params.id,CACHE_LOCALNAMES.PRESET_DO_PRESCRIPTION);
      let cur_preset_do_count = 0;
      if(preset_do_data !== undefined && preset_do_data != null){
        cur_preset_do_count = preset_do_data.length;
      }
      let confirm_message = "";
      if((parseInt(preset_do_count) + 1) > cur_preset_do_count){
        let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
        let patient_do_max_number = initState.patient_do_max_number;
        if(patient_do_max_number >1 && cur_preset_do_count > 0){
          confirm_message = "処方Do（"+(parseInt(preset_do_count) + 1)+"）を登録しますか？";
        } else {
          confirm_message = "処方Doを登録しますか？";
        }
      } else {
        confirm_message = "処方Doを新しい内容で上書きしますか？";
      }
      this.modal_obj.confirm_message = confirm_message;
      this.modal_obj.confirm_type = "prescription_do_set";
      this.preset_do_count = preset_do_count;
      if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      }
    } else if(act === "last_prescription"){
      let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
        this.modal_obj.isDoctorsOpen = true;
        this.act_msg = "last_prescription";
        if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
          this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
        }
        return;
      }      

      let department_code = this.context.department.code == 0 ? 1 : this.context.department.code;
      let karte_status_code = 1;
      if(this.context.karte_status.code == 1){
        karte_status_code = 3;
      }
      if(this.context.karte_status.code == 2){
        karte_status_code = 2;
      }
      await this.getLastPrescription(this.props.match.params.id, department_code, karte_status_code, null, null, "prescription_page");
      // YJ404 処方画面で前回処方を使うと確認がグレーアウトしたままで、SOAP右カラムに追加されている不具合
      if (this.confirmButtonRef.current != undefined && this.confirmButtonRef.current != undefined) {
        this.confirmButtonRef.current.testConfirmRender(1);
        this.modal_obj.canConfirm = 1;
      }
    }
  };

  confirmUnenabledUsageCancel = () => {
    this.modal_obj.confirm_message = "";
    this.modal_obj.confirm_type = "";
    this.modal_obj.hasUnenabledUsage = false;
    this.modal_obj.dropOrderUsageList = null;
    this.act_msg = "";
    if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  }

  confirmUnenabledUsageOk = () => {
    this.modal_obj.confirm_message = "";
    this.modal_obj.confirm_type = "";
    this.modal_obj.hasUnenabledUsage = false;
    if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
    if (this.act_msg != null && this.act_msg != undefined && this.act_msg != "") {
      this.doOnDropEvent(this.act_msg);
    }
  }

  confirmOk() {
    if (this.modal_obj.confirm_type == "prescription") {
      this.initPresData();
    } else if(this.modal_obj.confirm_type == "prescription_do_set"){
      /*@cc_on 
      var w = window;
      eval('var window = w');
      @*/
      let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      let name = "prescription_do_" + this.props.match.params.id.toString() + "_" + authInfo.name + "_" + (this.preset_do_count+1).toString();
      this.registerNewSet(name,"soap",this.preset_do_count, this.props.match.params.id);
    }
    this.modal_obj.confirm_message = "";
    this.modal_obj.confirm_type = "";
    if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
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
      case SOAP_TREE_CATEGORY.CURRENT_ORDER: // 処方、注射ページの自科
        this.setState({
          bOpenCurrentOrder:setVal,
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
      case SOAP_TREE_CATEGORY.CURRENT_ORDER_LATEST: // 処方、注射ページの全科
        this.setState({
          bOpenCurrentOrderLatest:setVal,
        });
        break;
    }
  }

  setCurScrollTop = (nVal) => {
    this.setState({
      curScrollTop: nVal
    });
  }

  showTreePrescription =async(_type=null)=>{
    if(this.state.isLoaded){
      this.medicineSelectionRef.current.testIsLoadedRender(false);
    }
    // first load flag
    this.m_need_load = 1;
    // set member variable of deparment
    this.m_department_code = this.context.department.code;
    // set member variable of karte status
    this.m_karte_status_code = this.context.karte_status.code;
    let tmpParams = {};
    tmpParams.patient_id = this.props.match.params.id;
    tmpParams.medical_department_code = this.context.department.code;
    if (tmpParams.medical_department_code == 0) {
      tmpParams.medical_department_code = 1;
    }
    tmpParams.type="prescription";
    if (this.context.karte_status.code == 0) {
      tmpParams.karte_status = 1;
      tmpParams.show_option = this.state.select_outpatient == true ? 1 : 0;
    } else if (this.context.karte_status.code == 2) {
      tmpParams.karte_status = 2;
      tmpParams.show_option = this.state.select_home == true || this.state.select_home == undefined ? 1 : 0;
    } else if (this.context.karte_status.code == 1) {
      tmpParams.karte_status = 3;
      tmpParams.show_option = this.state.select_hospitalize == true ? 1 : 0;
    }

    if (this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION, this.context.AUTHS.SHOW_DELETE)) {
      tmpParams.show_delete = 1;
    }

    await apiClient.get("/app/api/v2/order/prescription/dateTree", {
      params: tmpParams
    }).then((res) => {
      let nYear = -1;
      let nMonth = -1;
      let nDay = -1;
      this.setState({
        allDateList: res.original.all_dates,
        soapTrees: {
          all_order: res.original.all_order.data,
          all_order_latest: res.original.all_order.latest,
          current_order: res.original.current_order.data,
          current_order_latest: res.original.current_order.latest,
        },
        selYear: nYear,
        selMonth: nMonth,
        selDay: nDay,
        bOpenCurrentOrder: true,
        bOpenCurrentOrderLatest: true,
        bOpenAllOrder: false,
        bOpenAllOrderLatest: true,
      }, async()=>{
        await this.getHistoryDataByTree(SOAP_TREE_CATEGORY.CURRENT_ORDER_LATEST, nYear, nMonth, nDay, this.state.categoryType, "date", _type);
      });
    })
  }
  // _type => 外来のみ、在宅のみ、入院のみを押した場合、処方歴の読み込みが終わらない
  getHistoryDataByTree =async(department, year, month, date, nCategoryType, type)=>{    
    // when click prescription tree, 1188-62 処方の編集で、処方歴がローディングされている状態でコメント変更が反映されない
    this.modal_obj.removeLoadingIcon == 0;

    if(this.state.isLoaded){
      // this.setState({isLoaded:false},()=>{
      this.medicineSelectionRef.current.testIsLoadedRender(false);
      // });
    }
    let result = await this.changePrescriptList(department, year, month, date, nCategoryType);
    let search_date = '';
    if(type === "date"){
      search_date = year + "-" + month + "-" + date;
    }
    let soapTree_data = result.soapTrees.current_order != undefined && result.soapTrees.current_order != null ? result.soapTrees.current_order : this.state.soapTrees.current_order;
    let cateogry_type = result.categoryType != null && result.categoryType != undefined ? result.categoryType : this.state.categoryType;
    if (cateogry_type == SOAP_TREE_CATEGORY.ALL_ORDER || cateogry_type == SOAP_TREE_CATEGORY.ALL_ORDER_LATEST) {
      soapTree_data = result.soapTrees.all_order != undefined && result.soapTrees.all_order != null ? result.soapTrees.all_order : this.state.soapTrees.all_order;
    }
    // select day
    if(type === "date_index"){
      search_date = soapTree_data[year]['data'][month]['data'][date]['date'];
    }
    // select month
    if(date == -1 && month != -1){
      search_date = soapTree_data[year]['data'][month].month;
    }
    // select year
    if(date == -1 && month == -1 && year != -1){
      search_date = soapTree_data[year].year.toString();
    }
    // 最新15件
    let latest_flag = 0;
    if (year == -1 && month == -1 && date == -1) {
      latest_flag = 1;
      search_date = null;
    }
    if (search_date != '' || latest_flag == 1) {
      if (this.medicineSelectionRef.current != null && this.medicineSelectionRef.current != undefined) {
        this.medicineSelectionRef.current.testStopGetHistoryRender(false);
      }
      /*@cc_on 
      var w = window;
      eval('var window = w');
      @*/
      window.localStorage.setItem("medicine_selection_wrapper_scroll", 0);
      karteApi.setVal(this.props.match.params.id, CACHE_LOCALNAMES.SOAP_PAGE_NUMBER, 0);
      // karte_status: 1=> 外来, 2=>在宅
      let karte_status = 0;
      if (this.context.karte_status.code == 0) {
        karte_status = this.state.select_outpatient == true ? 1 : 0;
      } else if (this.context.karte_status.code == 2) {
        karte_status = this.state.select_home == true ? 2 : 0;
      } else if (this.context.karte_status.code == 1) {
        karte_status = this.state.select_hospitalize == true ? 3 : 0;
      }
      let department_code = this.context.department.code;
      if (department_code == 0) {
        department_code = 1;
      }
      if (cateogry_type == SOAP_TREE_CATEGORY.ALL_ORDER || cateogry_type == SOAP_TREE_CATEGORY.ALL_ORDER_LATEST) {
        department_code = 0;
      }
      let history_post_params = {
        id: this.props.match.params.id,
        limit: 10,
        offset: 0,
        search_date: search_date,
        karte_status: karte_status,
        department: department_code,
        latest_flag: latest_flag,
      };

      this.search_date = search_date;
      // let load_status = false;
      // // 処方画面で、区分を処方や入院、訪問診療に変えた場合、処方歴の読み込みが終わらない
      // if(_type == "only_prescription_hospital") load_status = true;
      // result.isLoaded = false;
      // 処方日付ツリー選択時、右エリア再描画
      result.getHistoryEnd = 0;
      this.modal_obj.getHistoryEnd = 0;
      await this.getHistoryData(history_post_params, false).then(function(data){
        if(Object.keys(data).length > 0){
          Object.keys(data).map(key=>{
            result[key] = data[key];
          })
        }
      });
      this.setState(result);
    }
  }

  // if click tree after first loaded
  getHistoryDataByTreeNotRefresh =async(department, year, month, date, nCategoryType, type)=>{
    // when click prescription tree, 1188-62 処方の編集で、処方歴がローディングされている状態でコメント変更が反映されない
    this.modal_obj.removeLoadingIcon = 1;
    this.modal_obj.selDay = date;
    this.modal_obj.selMonth = month;
    this.modal_obj.selYear = year;
    // first load flag
    this.m_need_load = 0;

    if(this.state.isLoaded){
      this.setState({
        isLoaded:false,
      },()=>{
        if(this.medicineSelectionRef.current != undefined){
          this.medicineSelectionRef.current.testIsLoadedRender(false);
        }
      });
    }
    let result = await this.changePrescriptList(department, year, month, date, nCategoryType);
    let search_date = '';
    if(type === "date"){
      search_date = year + "-" + month + "-" + date;
    }
    let soapTree_data = result.soapTrees.current_order != undefined && result.soapTrees.current_order != null ? result.soapTrees.current_order : this.state.soapTrees.current_order;
    let cateogry_type = result.categoryType != null && result.categoryType != undefined ? result.categoryType : this.state.categoryType;
    if (cateogry_type == SOAP_TREE_CATEGORY.ALL_ORDER || cateogry_type == SOAP_TREE_CATEGORY.ALL_ORDER_LATEST) {
      soapTree_data = result.soapTrees.all_order != undefined && result.soapTrees.all_order != null ? result.soapTrees.all_order : this.state.soapTrees.all_order;
    }
    // select day
    if(type === "date_index"){
      search_date = soapTree_data[year]['data'][month]['data'][date]['date'];
    }
    // select month
    if(date == -1 && month != -1){
      search_date = soapTree_data[year]['data'][month].month;
    }
    // select year
    if(date == -1 && month == -1 && year != -1){
      search_date = soapTree_data[year].year.toString();
    }
    // 最新15件
    let latest_flag = 0;
    if (year == -1 && month == -1 && date == -1) {
      latest_flag = 1;
      search_date = null;
    }
    if (search_date != '' || latest_flag == 1) {
      if (this.medicineSelectionRef.current != null && this.medicineSelectionRef.current != undefined) {
        this.medicineSelectionRef.current.testStopGetHistoryRender(false);
      }
      /*@cc_on 
      var w = window;
      eval('var window = w');
      @*/
      window.localStorage.setItem("medicine_selection_wrapper_scroll", 0);
      karteApi.setVal(this.props.match.params.id, CACHE_LOCALNAMES.SOAP_PAGE_NUMBER, 0);
      // karte_status: 1=> 外来, 2=>在宅
      let karte_status = 0;
      if (this.context.karte_status.code == 0) {
        karte_status = this.state.select_outpatient == true ? 1 : 0;
      } else if (this.context.karte_status.code == 2) {
        karte_status = this.state.select_home == true ? 2 : 0;
      } else if (this.context.karte_status.code == 1) {
        karte_status = this.state.select_hospitalize == true ? 3 : 0;
      }
      let department_code = this.context.department.code;
      if (department_code == 0) {
        department_code = 1;
      }
      if (cateogry_type == SOAP_TREE_CATEGORY.ALL_ORDER || cateogry_type == SOAP_TREE_CATEGORY.ALL_ORDER_LATEST) {
        department_code = 0;
      }
      let history_post_params = {
        id: this.props.match.params.id,
        limit: 10,
        offset: 0,
        search_date: search_date,
        karte_status: karte_status,
        department: department_code,
        latest_flag: latest_flag,
      };

      this.search_date = search_date;
      // result.isLoaded = false;
      // 処方日付ツリー選択時、右エリア再描画
      result.getHistoryEnd = 0;
      this.modal_obj.getHistoryEnd = 0;
      await this.getHistoryData(history_post_params, false, "no_refresh").then(function(data){
        if(Object.keys(data).length > 0){
          Object.keys(data).map(key=>{
            result[key] = data[key];
          })
        }
      });

      result.stop_prescribe_table_load = true;
      this.setState(result,()=>{
        // when click prescription tree, 1188-62 処方の編集で、処方歴がローディングされている状態でコメント変更が反映されない
        this.modal_obj.removeLoadingIcon = 1;
      });
    }
  }

  setItemDetails =(data)=>{
    this.modal_obj.item_details = data;
    if (this.prescriptionNameRef.current != undefined && this.prescriptionNameRef.current != null) {
      this.prescriptionNameRef.current.testPrescriptionNameRender({item_details:data});
    }
    this.modal_obj.no_refresh = 1;
    this.setState({item_details: data});
    let storeData ={"is_reload_state": false};
    this.storeDataInCache(storeData);
  };

  handleAddClass = (_id, _class = "selected") => {
    $("#" + _id).addClass(_class);
  };

  handleRemoveClass = (_id, _class = "selected") => {
    $("#" + _id).removeClass(_class);
  };

  selectKarteOutPatientStatus = () => {
    if (this.state.isLoaded == false) return;
    if(this.medicineSelectionRef.current != undefined && this.medicineSelectionRef.current.state.isLoaded == false){
      return;
    }
    if (this.buttonDoubleClick != null && ((new Date().getTime() - this.openModalTime) < 1000)) return;
    let _status = !this.state.select_outpatient;
    if (_status){
      this.handleAddClass("only-outpatient", "selected");
    } else {
      this.handleRemoveClass("only-outpatient", "selected");
    }
    this.buttonDoubleClick = new Date().getTime();
    this.setState({
      select_outpatient: _status,
      select_home: false,
      select_hospitalize: false,
    },()=>{
      $(".status-select button").addClass("btn-disable");
      // 処方画面で、区分を処方や入院、訪問診療に変えた場合、処方歴の読み込みが終わらない
      this.showTreePrescription("only_prescription_hospital");
    })
  };

  selectKarteHomeStatus = () => {
    if (this.state.isLoaded == false) return;
    if(this.medicineSelectionRef.current != undefined && this.medicineSelectionRef.current.state.isLoaded == false){
      return;
    }
    if (this.buttonDoubleClick != null && ((new Date().getTime() - this.openModalTime) < 1000)) return;
    let _status = !this.state.select_home;
    if (_status){
      this.handleAddClass("only-home", "selected");
    } else {
      this.handleRemoveClass("only-home", "selected");
    }
    this.buttonDoubleClick = new Date().getTime();
    this.setState({
      select_home: _status,
      select_outpatient: false,
      select_hospitalize: false,
    },()=>{
      $(".status-select button").addClass("btn-disable");
      // 処方画面で、区分を処方や入院、訪問診療に変えた場合、処方歴の読み込みが終わらない
      this.showTreePrescription("only_prescription_hospital");
    })
  };

  selectKarteHospitalizeStatus = () => {
    if (this.state.isLoaded == false) return;
    if(this.medicineSelectionRef.current != undefined && this.medicineSelectionRef.current.state.isLoaded == false){
      return;
    }
    let _status = !this.state.select_hospitalize;
    if (_status) {
      this.handleAddClass("only-hospital", "selected");
    } else {
      this.handleRemoveClass("only-hospital", "selected");
    }
    this.setState({
      select_hospitalize: _status,
      select_outpatient: false,
      select_home: false,
    },()=>{
      $(".status-select button").addClass("btn-disable");
      // 処方画面で、区分を処方や入院、訪問診療に変えた場合、処方歴の読み込みが終わらない
      this.showTreePrescription("only_prescription_hospital");
    })
  };

  onAngleClick = () => {
    if (this.context.$getKarteMode(this.props.match.params.id) == KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
    // 死亡状態に関する修正
    if (karteApi.isDeathPatient(this.props.match.params.id)){
      this.modal_obj.alertMessage = "death";
      if (this.patientModalRef.current != undefined) {
        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      }
      return;
    }
    this.m_show_detail_flag = (this.m_show_detail_flag + 1) % 2;
    if (this.m_show_detail_flag == 0) {
      this.showItemDetailArea(0);
    } else {
      this.showItemDetailArea(1);
    }
  };

  isExistItemDetail = () => {
    let result = false;
    if (this.modal_obj.item_details.length > 0) {
      this.modal_obj.item_details.map(item=>{
        if (item != null && item != undefined && item.item_id != 0) {
          result = true;
        }
      });
    }
    return result;
  }

  // 品名 show condition
  showItemDetailArea = (nFlag = 0) => {
    if (nFlag == 0) {
      if(!$("#item_detail").hasClass("no-visible")){
        $("#item_detail").addClass("no-visible");
      }
      $(".item-detai-label").removeClass("close-table");

    } else {
      $("#item_detail").removeClass("no-visible");
      if(!$(".item-detai-label").hasClass("close-table"))
        $(".item-detai-label").addClass("close-table");
    }
  }

  closeDoctorModal = () => {
    this.modal_obj.isDoctorsOpen = false;

    if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  };

  setModalObj = (modal_obj) => {
    this.modal_obj = modal_obj;
  }

  // 投与日数一括変更
  changeAllRpDays = () => {
    if (this.context.$getKarteMode(this.props.match.params.id) == KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合 2020-08-22
    // 死亡状態に関する修正
    if (karteApi.isDeathPatient(this.props.match.params.id)){
      this.modal_obj.alertMessage = "death";
      if (this.patientModalRef.current != undefined) {
        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      }
      return;
    }
    this.modal_obj.change_all_rp_days = 1;
    if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  }

  changeAllRpDaysAmount = (nDays) => {
    if (nDays < 1 || nDays > 90) return;
    this.modal_obj.change_all_rp_days = 0;
    if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
    let presData = this.state.presData
    if (presData.length > 0) {
      presData.map(item=>{
        if (item.usageName != "" && item.days_suffix == "日分") {
          item.days = nDays.toString();
        }
      });
    }
    this.modal_obj.change_rp_days = 1;
    this.prescribeTableRef.current.testRender(presData);
    let data = {};
    data['presData'] = presData;
    this.storeDataInCache(data);
  }

  presetRefresh = async () => {
    let doctor_code = this.context.selectedDoctor.code;
    let department_code = this.context.department.code;
    let patient_id = this.props.match.params.id;
    const { data } = await axios.get(
      `/app/api/v2/order/prescription/preset`,{
        params: {doctor_code: doctor_code, department_code: department_code, disable_common: 0, editable_only: 0, system_patient_id: patient_id}
      }
    );
    if (data) {
      if (this.medicineSetSelectionRef.current != null && this.medicineSetSelectionRef.current != undefined) {
        this.medicineSetSelectionRef.current.testMedSetRender(data);
      }
    }
  }

  handleAlertOk = () => {
    this.modal_obj.check_alert_messages = "";
    if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  }

  confirmPrescription = async (_existDelData=null, _delNumbers=null) => {
    // 1211-10 処方・注射画面からの削除の動線の整理・修正(2)
    if (_existDelData == true) { // if exist delete data (prescription)
      this.modal_obj.isPrescriptionDeleteConfirmOpen = true;
      this.modal_obj.deletedNumbers = _delNumbers;
      this.modal_obj.deleteModalType = "delete_ok";
      if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      }
      return;
    }
    // check prescriptio data
    let cacheState = karteApi.getSubVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.m_cacheSerialNumber);
    // 1. check has medicine info

    if (cacheState != undefined &&
      cacheState != null &&
      cacheState[0] != undefined &&
      cacheState[0].presData[0] != undefined &&
      cacheState[0].presData[0] != null &&
      cacheState[0].presData[0].medicines[0] != undefined &&
      cacheState[0].presData[0].medicines[0] != null) {
      if (cacheState[0].presData[0].medicines[0].medicineName == "") {
        let strMessage = "薬剤を入力して下さい。";
        this.modal_obj.check_alert_messages = strMessage;
        if(this.patientModalRef.current != undefined){
          this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
        }
        return;
      }
      if (cacheState[0].free_comment[0] != null && cacheState[0].free_comment[0] != "" && cacheState[0].free_comment[0].length > 20){
        let strMessage = "備考は、全角20文字以内で入力してください。";
        this.modal_obj.check_alert_messages = strMessage;
        if(this.patientModalRef.current != undefined){
          this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
        }
        return;
      }
    }

    if (cacheState != undefined &&
      cacheState != null &&
      cacheState[0] != undefined &&
      cacheState[0].presData.length > 0) {
      let strMessage = "";      
      cacheState[0].presData.map((item, index) => {        
        if (item.medicines.length < 1 && item.usageName != "" && strMessage == "") {
          strMessage = "Rp" + (index + 1) + "の薬剤を入力して下さい。";
        }
        if (item.medicines.length > 0 && item.usageName != "" && strMessage == "") {
          let med_count = 0;
          item.medicines.map(ele=>{
            if (ele.medicineName == "") {
              med_count ++;
            }
          });
          if (med_count == item.medicines.length) {
            strMessage = "Rp" + (index + 1) + "の薬剤を入力して下さい。";
          }
        }        
      });
      if (strMessage != "") {
        this.modal_obj.check_alert_messages = strMessage;
        if(this.patientModalRef.current != undefined){
          this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
        }
        return;
      }
    }

    // 2. check the others
    if (cacheState != undefined && cacheState != null && cacheState[0] != undefined) {
      let type = cacheState[0].isUpdate == 1 ? Karte_Types.Update : Karte_Types.Register;
      if(this.checkPresDataFromPrescription(cacheState[0].presData, type) != true){
        return;
      }
    }

    // check item_details
    let item_details_msg = "";
    if (cacheState[0] != undefined && cacheState[0] != null && cacheState[0].item_details != undefined && cacheState[0].item_details != null && cacheState[0].item_details.length > 0) {      
      cacheState[0].item_details.map(item=>{
        if (item['item_id'] !== 0 && ((item['value1'] == null || item['value1'].trim() === ""))){
          if (item['attribute1'] != null && item['attribute1'] != 0)
            item_details_msg = item['item_name'] + "を入力してください。";
        }
      });
    }
    
    if (item_details_msg != "") {      
      this.modal_obj.check_alert_messages = item_details_msg;
      if(this.patientModalRef.current != undefined){
        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      }
      return;
    }    

    // check only exist delete cache
    let _existPresData = 0;
    this.state.presData.filter(item=>{
      if (item.usageName != "") {
        _existPresData = 1;
      }
    });

    // check only exist delete cache
    if (_existPresData == 0) {

      // check deleted of medicine history
      let _existDelData = 0;
      let cache_del_prescription = karteApi.getVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.PRESCRIPTION_DELETE);
      if (cache_del_prescription != undefined && cache_del_prescription != null && cache_del_prescription.length > 0) {
        cache_del_prescription.filter(item=>{
          if (item.cacheSerialNumber == this.m_cacheSerialNumber) {
            _existDelData = 1;
          }
        });
      }

      // if exist Del data
      if (_existDelData == 1) {

        // 処方と注射の編集時の入外区分について
        //  ・処方や注射を「編集」で開いた際
        //  ・現在入院中かどうかなどは関係なく、編集しようとしているレコードの区分を選択。
        let patientKarteInfo = this.getPatientKarteInfo();
        if (patientKarteInfo != undefined && patientKarteInfo != null && patientKarteInfo.code != undefined) {
          if (parseInt(this.context.karte_status.code) != parseInt(patientKarteInfo.code)) {
            this.context.$updateKarteStatus(patientKarteInfo.code, patientKarteInfo.name);
          }
        }

        this.props.history.replace(`/patients/${this.props.match.params.id}/soap`);
      }

      return;
    }

    // YJ368 定期処方・定期注射の登録時、期間が重なる場合は警告を表示するように
    if (cacheState != undefined && cacheState != null && cacheState[0] != undefined) {      
      if(cacheState[0].karte_status_code == 1 && cacheState[0].is_internal_prescription == 3){                
        let period_date = this.getAdministratePeriodInfo(cacheState[0].presData);
        this.modal_obj.complete_message = "処理中";
        if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
          this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
        }
        let hasPeriodDuplicatePrescription = await this.checkPeriodDuplicatePrescription(period_date.min_date, period_date.max_date, cacheState[0].presData, cacheState[0].isUpdate, cacheState[0].number);
        this.modal_obj.complete_message = "";
        if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
          this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
        }
        if (hasPeriodDuplicatePrescription && hasPeriodDuplicatePrescription.length > 0) {
          this.modal_obj.isMedicinePeriodDuplicateOpen = true;
          this.modal_obj.medicinePeriodDuplicateList = hasPeriodDuplicatePrescription;          
          if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
            this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
          }
          return;
        }
      }
    }

    // show prescription confirm modal
    // this.modal_obj.isOpenPrescriptionConfirmModal = true;
    if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
      // this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      this.patientModalRef.current.setModalVisible(true, "PrescriptionConfirmModal", this.state.presData);
    }
  }

  // YJ368 定期処方・定期注射の登録時、期間が重なる場合は警告を表示するように
  // if check medicine duplicate modal, open confirmmodal
  handleMedicinePeriodDuplicateModal = () => {
    this.modal_obj.isMedicinePeriodDuplicateOpen = false;
    this.modal_obj.medicinePeriodDuplicateList = [];
    if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);          
      this.patientModalRef.current.setModalVisible(true, "PrescriptionConfirmModal", this.state.presData);
    } 
  }

  // get min and max date of administratePeriod
  getAdministratePeriodInfo = (_presData) => {
    let min_date = null;
    let max_date = null;
    _presData.map(item=>{
      if (item.administrate_period != undefined && item.administrate_period != null) {
        if (min_date == null) min_date = item.administrate_period.period_start_date.split("-").join("");
        if (max_date == null) max_date = item.administrate_period.period_end_date.split("-").join("");
        if (parseInt(min_date) > parseInt(item.administrate_period.period_start_date.split("-").join(""))) {
          min_date = item.administrate_period.period_start_date.split("-").join("");
        }
        if (parseInt(max_date) < parseInt(item.administrate_period.period_end_date.split("-").join(""))) {
          max_date = item.administrate_period.period_end_date.split("-").join("");
        }
      } else {
        if (item.medicines != undefined && item.medicines.length > 0 && item.medicines[0].medicineName != "") {          
          if (min_date == null) min_date = item.start_date.split("-").join("");
          if (max_date == null) max_date = item.start_date.split("-").join("");
          if (parseInt(min_date) > parseInt(item.start_date.split("-").join(""))) {
            min_date = item.start_date.split("-").join("");
          }
          if (parseInt(max_date) < parseInt(item.start_date.split("-").join(""))) {
            max_date = item.administrate_period.period_end_date.split("-").join("");
          }
        }
      }
    });
    return {min_date:min_date != null ? min_date.substring(0, 4)+"-"+min_date.substring(4, 6)+"-"+min_date.substring(6, 8) : null, max_date:max_date != null ? max_date.substring(0, 4)+"-"+max_date.substring(4, 6)+"-"+max_date.substring(6, 8) : null};
  }

  checkPeriodDuplicatePrescription = async (_min_date, _max_date, _pres_data, _is_update=null, _number=0) => {
    // YJ368 定期処方・定期注射の登録時、期間が重なる場合は警告を表示するように
    let path = "/app/api/v2/order/check_period_prescription_injection";
    let post_data = {      
      type: "prescription",
      patient_id: this.props.match.params.id,
      min_date: _min_date,
      max_date: _max_date      
    };

    if (_is_update == 1 && _number > 0) {
      post_data.number = _number;
    }

    let medicines = [];
    _pres_data.map(item=>{
      if (item.medicines != undefined && item.medicines.length > 0) {
        item.medicines.map(ele=>{
          if (ele.medicineId != 0) {
            let med = {
              medicine_id: ele.medicineId,
              medicine_name: ele.medicineName
            };
            medicines.push(med);
          }
        });
      }
    });
    post_data.medicines = medicines;
    
    let data = await apiClient.post(path, { params: post_data });    
    return data;
  }

  deletePrescriptionFun = (_existDelData=null, _delNumbers=null) => {
    // 1211-10 処方・注射画面からの削除の動線の整理・修正(2)
    if (_existDelData == true) { // if exist delete data (prescription)
      this.modal_obj.isPrescriptionDeleteCancelOpen = true;
      this.modal_obj.deletedNumbers = _delNumbers;
      this.modal_obj.deleteModalType = "delete_cancel";
      if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      }
      return;
    }
    if (this.modal_obj.canConfirm != 1) {
      // 処方と注射の編集時の入外区分について
      //  ・処方や注射を「編集」で開いた際
      //  ・現在入院中かどうかなどは関係なく、編集しようとしているレコードの区分を選択。
      let patientKarteInfo = this.getPatientKarteInfo();
      if (patientKarteInfo != undefined && patientKarteInfo != null && patientKarteInfo.code != undefined) {
        if (parseInt(this.context.karte_status.code) != parseInt(patientKarteInfo.code)) {
          this.context.$updateKarteStatus(patientKarteInfo.code, patientKarteInfo.name);
        }
      }
      /*@cc_on
      var w = window;
      eval('var window = w');
      @*/
      window.sessionStorage.removeItem("prescription_before");
      this.props.history.replace(`/patients/${this.props.match.params.id}/soap`);
    } else {
      this.modal_obj.isDeletePrescriptionConfirmModal = true;
      if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      }
    }
  }

  deletePrescriptionCancel = () => {
    this.modal_obj.isDeletePrescriptionConfirmModal = false;
    this.modal_obj.isEditPrescriptionAfterDeleteModal = false;
    if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  }

  deletePrescriptionConfirm = () => {
    /*@cc_on 
    var w = window;
    eval('var window = w');
    @*/
    // ■1016-1 右カラムに表示している保存前の処方・注射を編集できるように
    let prescription_before = JSON.parse(window.sessionStorage.getItem('prescription_before'));
    window.sessionStorage.removeItem("prescription_before");
    if (prescription_before != undefined &&
      prescription_before != null &&
      prescription_before[0] != undefined &&
      prescription_before[0] != null &&
      prescription_before[0].system_patient_id == parseInt(this.props.match.params.id)) {
      karteApi.setSubVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.m_cacheSerialNumber, JSON.stringify(prescription_before));
    } else {
      karteApi.delSubVal(this.props.match.params.id, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.m_cacheSerialNumber);
    }
    this.modal_obj.isDeletePrescriptionConfirmModal = false;
    if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }

    // cancel deleted of medicine history
    let cache_del_prescription = karteApi.getVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.PRESCRIPTION_DELETE);
    if (cache_del_prescription != undefined && cache_del_prescription != null && cache_del_prescription.length > 0) {
      karteApi.delCachePrescriptionByCacheNumber(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.PRESCRIPTION_DELETE, CACHE_LOCALNAMES.PRESCRIPTION_DELETE_HISTORY, this.m_cacheSerialNumber);
    }

    // 処方と注射の編集時の入外区分について
    //  ・処方や注射を「編集」で開いた際
    //  ・現在入院中かどうかなどは関係なく、編集しようとしているレコードの区分を選択。
    let patientKarteInfo = this.getPatientKarteInfo();
    if (patientKarteInfo != undefined && patientKarteInfo != null && patientKarteInfo.code != undefined) {
      if (parseInt(this.context.karte_status.code) != parseInt(patientKarteInfo.code)) {
        this.context.$updateKarteStatus(patientKarteInfo.code, patientKarteInfo.name);
      }
    }

    // karteApi.delSubVal(this.props.match.params.id, CACHE_LOCALNAMES.ACTIVE_KEY, "prescription");
    this.props.history.replace(`/patients/${this.props.match.params.id}/soap`);
  }

  prescriptionConfirmOk = () => {
    this.modal_obj.isOpenPrescriptionConfirmModal = false;
    if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
    this.modal_obj.canConfirm = 2;
    this.confirmButtonRef.current.testConfirmRender(this.modal_obj.canConfirm);
    
    let cacheState = karteApi.getSubVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.m_cacheSerialNumber);    
    if (cacheState != undefined && cacheState != null && cacheState[0] != undefined && cacheState[0] != null) {      
      cacheState[0].temp_saved = 1;
      cacheState[0].canConfirm = 2;
      let newStateStr = JSON.stringify(cacheState);
      karteApi.setSubVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.m_cacheSerialNumber, newStateStr, 'insert');
    }

    // let storeData ={"is_reload_state": false,"temp_saved":1, "canConfirm":2};
    // this.storeDataInCache(storeData);

    // 処方と注射の編集時の入外区分について
    //  ・処方や注射を「編集」で開いた際
    //  ・現在入院中かどうかなどは関係なく、編集しようとしているレコードの区分を選択。
    let patientKarteInfo = this.getPatientKarteInfo();
    if (patientKarteInfo != undefined && patientKarteInfo != null && patientKarteInfo.code != undefined) {
      if (parseInt(this.context.karte_status.code) != parseInt(patientKarteInfo.code)) {
        this.context.$updateKarteStatus(patientKarteInfo.code, patientKarteInfo.name);
      }
    }
    
    handleDocumentHref("patients/"+this.props.match.params.id+"/soap");
    // window.onbeforeunload = null;
    // this.webdav_system_path = "http://haruka-develop.99sv-coco.com/webdav/";
    // let href_url = "http://192.168.33.10:8084/front/dist/#/patients/" + this.props.match.params.id + "/soap";
    // document.location.href = "#/patients/"+this.props.match.params.id+"/soap";
    // setTimeout(()=>{
    //   window.onbeforeunload = function () {
    //     return "Really?";
    //   };
    // }, 200);
    // this.props.history.replace(`/patients/${this.props.match.params.id}/soap`);
  }

  updateStoreCacheNoRefresh = () => {
    let storeData ={"is_reload_state": false};
    this.storeDataInCache(storeData);
  }

  setRemarkState = (type = null, value = null) => {
    if (type == null || value == null){
      return;
    }
    let remark_status = {};
    if (type == "hospital_opportunity_disease") {
      this.modal_obj.hospital_opportunity_disease = value;
      remark_status.hospital_opportunity_disease = value;
    } else if(type == "potion") {
      this.modal_obj.potion = value;
      remark_status.potion = value;
    }
    this.remarkRef.current.testRemarkRender(remark_status);
    let storeData ={"is_reload_state": false};
    this.storeDataInCache(storeData);
  }

  editOrdersFun = (prescription, is_done = false) => {
    // check exist input or edit prescription
    let cacheState = karteApi.getSubVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.m_cacheSerialNumber);
    if (cacheState != undefined && cacheState != null) {
      this.modal_obj.isEditPrescriptionAfterDeleteModal = true;
      if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      }
      this.temp_prescription = prescription;
      this.temp_is_done = is_done;
      return;
    }
    this.editOrders(prescription, is_done);
    if(is_done){
      this.makeDoneEditdata(prescription);
    }
  }
  
  makeDoneEditdata=(prescription)=>{
    //----------実施入力----------//
    let order_datas = prescription.order_data.order_data.map(data => {
      return {
        order_number: data.order_number, // ※該当する区切りのオーダー番号
        order_number_serial: data.order_number_serial
      };
    });
    let postData = [
      {
        number: prescription.number,
        system_patient_id: this.props.match.params.id, //HARUKA患者番号
        insurance_type: 0, //保険情報現状固定
        body_part: "",
        order_data: order_datas,
        med_consult: 1, //お薬相談希望ありフラグ
        supply_med_info: 1, //薬剤情報提供ありフラグ
        psychotropic_drugs_much_reason: "", //向精神薬多剤投与理由
        poultice_many_reason: "", //向精神薬多剤投与理由
        free_comment: [], //備考
        department_code: 1,
        is_done : 1,
      }
    ];
  
    let { cacheDoneState } = persistedState(this.props.match.params.id);
    if (!cacheDoneState) {
      cacheDoneState = [];
    }
    cacheDoneState = cacheDoneState.filter(data => {
      return data.number !== prescription.number;
    });
    cacheDoneState.push(postData[0]);
    karteApi.setVal(this.props.match.params.id, CACHE_LOCALNAMES.PRESCRIPTION_DONE, JSON.stringify(cacheDoneState));
    this.getDoneData(postData);
  }

  editPrescriptionAfterDelConfirm = () => {
    this.cacheDelete();
    if (this.temp_prescription != null && this.temp_is_done != null) {
      this.editOrders(this.temp_prescription, this.temp_is_done);
      if(this.temp_is_done){
        this.makeDoneEditdata(this.temp_prescription);
      }
    }
    this.modal_obj.isEditPrescriptionAfterDeleteModal = false;
    if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
    this.temp_prescription = null;
    this.temp_is_done = null;
  }

  onResizeEnd = (val) => {
    let cache_tree_width = karteApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.TREE_WIDTH);
    cache_tree_width.prescription.left.size = val[0].size;
    cache_tree_width.injection.left.size = val[0].size;
    cache_tree_width.inspection.left.size = val[0].size;
    cache_tree_width.soap.left.size = val[0].size;
    // cache_tree_width.prescription.right.size = val[1].size;
    karteApi.setVal(this.props.match.params.id, CACHE_LOCALNAMES.TREE_WIDTH, JSON.stringify(cache_tree_width));
  }

  // Calc modal's cancel(or bodyParts modal's cancel) => return before usage of prescription
  setBeforeUsage = (_usage = null, _index = null, _from=null) => {
    if (_index != null && _index != undefined && _usage != null && _usage != undefined) {
      let usageData = _usage[_index];
      let _presData = this.state.presData;
      if (_presData[_index] != undefined && _presData[_index] != null) {
        _presData[_index] = usageData;
      }
      // ●YA67 空の薬品欄のEnterで用法選択操作をして途中キャンセル時の挙動の修正
      if (_from == "bodyParts") {
        let result = _presData;
        if (_presData.length > 1 &&
          _presData[_presData.length - 1] != undefined &&
          _presData[_presData.length - 1].medicines[0].medicineName == "" &&
          _presData[_presData.length - 2] != undefined &&
          _presData[_presData.length - 2].usageName == "") {
          // remove last rp (no need)
          result = _presData.splice(0, _presData.length - 1);
        }
        _presData = result;
      }
      let data = {};
      data['presData'] = _presData;
      data['is_reload_state'] = false;
      this.storeDataInCache(data);
    }

  }

  // set state from child (medicine selection)
  setChildState = (_type=null, _state=null) => {
    if (_type ==null || _state == null ) return false;

    this.modal_obj.forceRefresh = 1;
    let reset_state = {};
    switch(_type){
      case "medicineHistory":
        reset_state.medicineHistory = _state;
        break;
    }
    this.setState({
      reset_state
    });
  }

  // init 品名
  initItemDetails = () => {
    this.modal_obj.item_details = [
      {classfic: 0, classfic_name:'', item_id: 0, item_name: "", attribute1:"0", format1:"", unit_name1:"", max_length1:"", value1:"", attribute2:"0", format2:"", unit_name2:"", max_length2:"", value2:""},
    ];

    if (this.prescriptionNameRef.current != undefined && this.prescriptionNameRef.current != null) {
      this.prescriptionNameRef.current.testPrescriptionNameRender({item_details:this.modal_obj.item_details});
    }
  }

  // init 備考・その他
  initOtherInfo = () => {
    this.modal_obj.bulk = {
      milling: 0,
      supply_med_info: 0,
      med_consult: 0,
      is_not_generic: 0,
      can_generic_name: 1,
      separate_packaging: 0,
      temporary_medication: 0,
      one_dose_package: 0
    };
    // this.modal_obj.inOut = prescription.order_data.is_internal_prescription ? prescription.order_data.is_internal_prescription : 0;
    this.modal_obj.free_comment = "";
    this.modal_obj.psychotropic_drugs_much_reason = "";
    this.modal_obj.poultice_many_reason = "";
    let remark_status = {
      // inOut: prescription.order_data.is_internal_prescription ? prescription.order_data.is_internal_prescription : 0,
      bulk: this.modal_obj.bulk,
      free_comment: "",
      psychotropic_drugs_much_reason: "",
      poultice_many_reason: "",
    };

    this.remarkRef.current.testRemarkRender(remark_status);
  }

  initPresData = () => {
    let initData = {
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
    };
    // karteApi.delSubVal(this.props.match.params.id, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.m_cacheSerialNumber);
    this.cacheDelete();
    this.modal_obj.isEdintingIndex = -1;
    if (this.state.titleTab == 0) {
      this.setDoCopyStatus(0, false, true);
      let history_list_obj = $("#div-history");
      let obj_item = $(".pres-title", history_list_obj);
      if(obj_item.hasClass("edit")){
        obj_item.removeClass("edit");
      }
    }

    // delete 品名
    this.initItemDetails();

    // delete 備考・その他
    this.initOtherInfo();

    this.setState({
      presData: [initData],
      isForUpdate: false,
    },()=>{
      this.prescribeTableRef.current.testRender([initData]);
      this.prescribeTableRef.current.testModalObjRender({isForUpdate: false});
      // 処方箋 title update
      this.titleRef.current.testTitleRender(this.getOrderTitle());
    });
    /*@cc_on 
    var w = window;
    eval('var window = w');
    @*/
    for (var key in window.localStorage) {
      if (key.includes("medicine_keyword_")) {
        window.localStorage.removeItem(key);
      }
    }
  }
  
  cacheDelete = () => {
    let cacheData = karteApi.getSubVal(this.props.match.params.id, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.m_cacheSerialNumber);
    if (cacheData !=  undefined && cacheData[0] != undefined) {
      let cache_number = cacheData[0].number;
      karteApi.delSubVal(this.props.match.params.id, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.m_cacheSerialNumber);
      let cache_done_history = karteApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.PRESCRIPTION_DONE_HISTORY);
      let cache_done = karteApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.PRESCRIPTION_DONE);
      if (cache_done_history != null && cache_done_history.length > 0) {
        cache_done_history = cache_done_history.filter(x=>x.number!=cache_number);
      }
      if (cache_done != null && cache_done.length > 0) {
        cache_done = cache_done.map(medicine=>{
          if(medicine.number == cache_number){
            let pres_history_obj = $(".pres-medicine-"+cache_number);
            pres_history_obj.removeClass("line-done");
          } else {
            return medicine;
          }
        });
      }
      if (cache_done_history != null && cache_done_history.length > 0) {
          karteApi.setVal(this.props.match.params.id, CACHE_LOCALNAMES.PRESCRIPTION_DONE_HISTORY, JSON.stringify(cache_done_history));
          karteApi.setVal(this.props.match.params.id, CACHE_LOCALNAMES.PRESCRIPTION_DONE, JSON.stringify(cache_done));
      } else {
          karteApi.delVal(this.props.match.params.id, CACHE_LOCALNAMES.PRESCRIPTION_DONE_HISTORY);
          karteApi.delVal(this.props.match.params.id, CACHE_LOCALNAMES.PRESCRIPTION_DONE);
      }
      this.modal_obj.isEdintingIndex = -1;
    }
  }

  confirmDeletedData = () => {
    // 処方と注射の編集時の入外区分について
    //  ・処方や注射を「編集」で開いた際
    //  ・現在入院中かどうかなどは関係なく、編集しようとしているレコードの区分を選択。
    let patientKarteInfo = this.getPatientKarteInfo();
    if (patientKarteInfo != undefined && patientKarteInfo != null && patientKarteInfo.code != undefined) {
      if (parseInt(this.context.karte_status.code) != parseInt(patientKarteInfo.code)) {
        this.context.$updateKarteStatus(patientKarteInfo.code, patientKarteInfo.name);
      }
    }

    this.props.history.replace(`/patients/${this.props.match.params.id}/soap`);
  }

  confirmDeletedCancelData = () => {
    this.modal_obj.isPrescriptionDeleteCancelOpen = false;
    this.modal_obj.deletedNumbers = 0;
    this.modal_obj.deleteModalType = "";
    if(this.patientModalRef.current != undefined){
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
    // cancel deleted of medicine history
    let cache_del_prescription = karteApi.getVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.PRESCRIPTION_DELETE);
    if (cache_del_prescription != undefined && cache_del_prescription != null && cache_del_prescription.length > 0) {
      karteApi.delCachePrescriptionByCacheNumber(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.PRESCRIPTION_DELETE, CACHE_LOCALNAMES.PRESCRIPTION_DELETE_HISTORY, this.m_cacheSerialNumber);
    }

    // 処方と注射の編集時の入外区分について
    //  ・処方や注射を「編集」で開いた際
    //  ・現在入院中かどうかなどは関係なく、編集しようとしているレコードの区分を選択。
    let patientKarteInfo = this.getPatientKarteInfo();
    if (patientKarteInfo != undefined && patientKarteInfo != null && patientKarteInfo.code != undefined) {
      if (parseInt(this.context.karte_status.code) != parseInt(patientKarteInfo.code)) {
        this.context.$updateKarteStatus(patientKarteInfo.code, patientKarteInfo.name);
      }
    }
    this.props.history.replace(`/patients/${this.props.match.params.id}/soap`);
  }

  // get current patient's karte status code
  // 処方と注射の編集時の入外区分について
    //  ・処方や注射を「編集」で開いた際
    //  ・現在入院中かどうかなどは関係なく、編集しようとしているレコードの区分を選択。
  getPatientKarteInfo = () => {
    let current_system_patient_id = localApi.getValue("current_system_patient_id");
    current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
    let patient_data = karteApi.getVal(current_system_patient_id, CACHE_LOCALNAMES.PATIENT_INFORMATION);
    if(patient_data != undefined && patient_data != null){
      return patient_data.karte_status;      
    }
    return null;
  }

  // 投与期間入力
  saveAdministratePeriod = (_value) => {
    let originalNumber = this.state.presData;
    originalNumber[this.modal_obj.indexOfEditPres].administrate_period = _value;

    this.modal_obj.isAdministratePeriodOpen = false;
    this.modal_obj.indexOfEditPres = -1;
    this.modal_obj.hasAdministratePeriod = true;
    let data = {};
    data['presData'] = originalNumber;
    this.storeDataInCache(data);

    this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    // // YJ272 入院処方で、投与期間入力は「定期」でしか使えないように
    // this.inOutRef.current.testInOutRender({existAdministratePeriod:true});
  }

  cancelAdministratePeriod = () => {
    let _data = {"is_reload_state": false};
    this.storeDataInCache(_data);
    // YJ272 入院処方で、投与期間入力は「定期」でしか使えないように
    let _state = {};
    _state.unusedDrugSearch=this.state.unusedDrugSearch;
    _state.normalNameSearch=this.state.normalNameSearch;
    _state.profesSearch=this.state.profesSearch;
    _state.existAdministratePeriod=false;
    this.inOutRef.current.testInOutRender(_state);
  }

  // YJ758 禁忌薬警告でキャンセルしたときに、別の薬剤も一緒に消去される場合がある不具合
  indexPresAndMed = (_pres, _med) => {
    this.m_indexOfInsertPres = _pres;
    this.m_indexOfInsertMed = _med;
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
        title: "処方歴"
      },
      {
        id: 1,
        title: "よく使う薬剤"
      },
      {
        id: 2,
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
    if(this.context.preDepartmentCode != this.context.department.code){
      this.context.preDepartmentCode = this.context.department.code;
    }
    if(this.context.preDoctorCode != this.context.selectedDoctor.code){
      this.context.preDoctorCode = this.context.selectedDoctor.code;
    }
    let indexUsage = this.modal_obj.indexOfEditPres == -1 ? this.state.presData.length - 1 : this.modal_obj.indexOfEditPres;

    // if change department code
    if (this.context.department.code != 0 && (this.m_department_code != this.context.department.code) && (this.props.match.params.id > 0)) {
      // 処方画面で、区分を処方や入院、訪問診療に変えた場合、処方歴の読み込みが終わらない
      if (this.first_load_page == 1) {
        this.showTreePrescription();
      } else {
        this.showTreePrescription("only_prescription_hospital");
      }
      this.first_load_page = 0;
    }

    // if change karte status
    if ((this.m_department_code == this.context.department.code) && (this.m_karte_status_code !== this.context.karte_status.code) && (this.props.match.params.id > 0)) {
      this.m_karte_status_code = this.context.karte_status.code;
      // 処方画面で、区分を処方や入院、訪問診療に変えた場合、処方歴の読み込みが終わらない
      if (this.first_load_page == 1) {
        this.showTreePrescription();
      } else {
        this.showTreePrescription("only_prescription_hospital");
        // 入院処方から外来/訪問に切り替えたときの初期状態処理
        // 外来・訪問から入院に切り替えたときの初期状態処理
        if (this.context.karte_status.code == 0 || this.context.karte_status.code == 2) {
          this.modal_obj.inOut = 1; // 「院内」
        } else {
          this.modal_obj.inOut = 0; // 「臨時」
        }
      }
      this.getAdditions();
      this.first_load_page = 0;      

    }

    // Prescriptionの左ツリー width setting
    let tree_width = [
      {size: 350, minSize:180, maxSize:400, resize: "dynamic"},
      {minSize:600, resize: "stretch"}
    ];

    let cache_tree_width = karteApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.TREE_WIDTH);
    if (cache_tree_width != undefined && cache_tree_width != null && cache_tree_width.prescription != undefined && cache_tree_width.prescription != null) {
      tree_width = [
        cache_tree_width.prescription.left,
        cache_tree_width.prescription.right
      ]
    }

    let enable_function_item = 0;
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    if(initState !== undefined && initState != null && initState.conf_data !== undefined){
      if(initState.conf_data.enable_function_item !== undefined && initState.conf_data.enable_function_item == "ON"){
        enable_function_item = 1;
      }
    }
    let title_info = this.getOrderTitle();

    return (
      <>
        <PrescriptionWrapper>
          <PanelGroup borderColor="#DDD" spacing={2}
                      panelWidths={tree_width}
                      onResizeEnd={this.onResizeEnd}
          >
            <PrescriptionTree
              ref={this.prescriptionTreeRef}
              soapTrees={this.state.soapTrees}
              changeSoapList={this.getHistoryDataByTreeNotRefresh}
              departmentStr={this.context.department.name !== ""?this.context.department.name:"内科"}
              bOpenCurrentSoap={this.state.bOpenCurrentSoap}
              bOpenAllSoap={this.state.bOpenAllSoap}
              bOpenAllOrder={this.state.bOpenAllOrder}
              bOpenCurrentOrder={this.state.bOpenCurrentOrder}
              bOpenAllExamination={this.state.bOpenAllExamination}
              bOpenAllInspection={this.state.bOpenAllInspection}
              bOpenAllTreatment={this.state.bOpenAllTreatment}
              bOpenCurrentSoapLatest={this.state.bOpenCurrentSoapLatest}
              bOpenAllSoapLatest={this.state.bOpenAllSoapLatest}
              bOpenAllOrderLatest={this.state.bOpenAllOrderLatest}
              bOpenCurrentOrderLatest={this.state.bOpenCurrentOrderLatest}
              bOpenAllExaminationLatest={this.state.bOpenAllExaminationLatest}
              bOpenAllInspectionLatest={this.state.bOpenAllInspectionLatest}
              bOpenAllTreatmentLatest={this.state.bOpenAllTreatmentLatest}
              setOpenClose={this.setOpenClose}
              curScrollTop={this.state.curScrollTop}
              setCurScrollTop={this.setCurScrollTop}
              categoryType={this.state.categoryType}
              selYear={this.state.selYear}
              selMonth={this.state.selMonth}
              selDay={this.state.selDay}
            />
            {this.state.activeOperation === 'prescription' && (
              <PrescriptionMain>
                <Col id="div-history">
                  <div className="d-flex status-select">
                    <TitleTabs
                      tabs={tabs}
                      selectTitleTab={this.selectTitleTab}
                      id={this.state.titleTab}
                      tabType={"prescription"}
                      contextMenuAction={this.contextTitleTabsMenuAction}
                    />
                    {this.context.karte_status.code == 0 && (
                      <Button id="only-outpatient" className={`${this.state.isLoaded == true ? "":"btn-disable"} ${this.state.select_outpatient == true ? "selected":"no-selected"}`} onClick={this.selectKarteOutPatientStatus}>外来のみ</Button>
                    )}
                    {this.context.karte_status.code == 2 && (
                      <Button id="only-home" className={`${this.state.isLoaded == true ? "":"btn-disable"} ${this.state.select_home == true ? "selected":"no-selected"}`} onClick={this.selectKarteHomeStatus}>在宅のみ</Button>
                    )}
                    {this.context.karte_status.code == 1 && (
                      <Button id="only-hospital"  className={`${this.state.isLoaded == true ? "":"btn-disable"} ${this.state.select_hospitalize == true ? "selected":"no-selected"}`} onClick={this.selectKarteHospitalizeStatus}>入院のみ</Button>
                    )}
                  </div>
                  {this.state.titleTab == 0 && (
                    <MedicineSelection
                      ref={this.medicineSelectionRef}
                      isLoaded={this.state.isLoaded}
                      tab={this.state.tab}
                      getTabId={this.getTabId}
                      patientId={this.props.match.params.id}
                      moveList={this.moveList}
                      medical_business_diagnosing_type={this.state.medical_business_diagnosing_type}
                      copyOrder={this.copyOrderPrescription}
                      copyOrders={this.copyOrdersPrescription}
                      editOrders={this.editOrdersFun}
                      registerSet={this.registerSet}
                      changeDepartment={this.changeDepartment}
                      printOrders={this.printOrders}
                      allPrescriptionOpen={this.state.allPrescriptionOpen}
                      doctors={this.state.doctors}
                      doctor_code={this.context.selectedDoctor.code}
                      doctor_name={this.context.selectedDoctor.name}
                      setDoctorInfo={this.setDoctorInfo}
                      medicineHistory={this.state.medicineHistory}
                      patientInfo={this.state.patientInfo}
                      // isEditingIndex={this.modal_obj.isEdintingIndex}
                      openNotConsentedModal={this.openNotConsentedModal}
                      isNotConsentedPopup={false}
                      isNotConsentedDataLength={this.state.isNotConsentedDataLength}
                      getDelData={this.getDelData}
                      scrollAddHistoryData={this.scrollAddHistoryData}
                      match={this.props.match}
                      consent={this.consent}
                      setChildState={this.setChildState}
                      initPresData={this.initPresData}
                      cacheSerialNumber={this.m_cacheSerialNumber}
                    />
                  )}
                  {this.state.titleTab == 1 && (
                    <MedicineRankSelection
                      ref={this.medicineRankSelectionRef}
                      isLoaded={this.state.isLoaded}
                      isLoadedRank={this.state.isLoaded_rank}
                      medicineRankData={this.state.medicineRankData}
                      allPrescriptionOpen={this.state.allPrescriptionOpen}
                    />
                  )}
                  {this.state.titleTab == 2 && (
                    <MedicineSetSelection
                      ref={this.medicineSetSelectionRef}
                      isLoaded={this.state.isLoaded}
                      patientId={this.props.match.params.id}
                      allPrescriptionOpen={this.state.allPrescriptionOpen}
                      doctors={this.state.doctors}
                      doctor_code={this.context.selectedDoctor.code}
                      doctor_name={this.context.selectedDoctor.name}
                      setDoctorInfo={this.setDoctorInfo}
                      medicineHistory={this.state.medicineSetData}
                      consent={this.consent}
                      presetRefresh={this.presetRefresh}
                    />
                  )}
                </Col>
                <Col>
                  <TitleHasMenu
                    ref={this.titleRef}
                    id="div-title"
                    title={title_info.title}
                    fnMouseDown={this.onClickTitle}
                    menuType={'prescription'}
                    isForUpdate={this.state.isForUpdate}
                    patientId={this.props.match.params.id}
                    contextMenuAction={this.contextMenuAction}
                    changeAllRpDays={this.changeAllRpDays}
                  />
                  <InOutNav
                    ref={this.inOutRef}
                    selectInOut={this.selectInOut}
                    id={this.modal_obj.inOut}
                    cacheSerialNumber={this.m_cacheSerialNumber}
                    unusedDrugSearch={this.state.unusedDrugSearch}
                    profesSearch={this.state.profesSearch}
                    normalNameSearch={this.state.normalNameSearch}
                    getRadio={this.getRadio}
                    karteStatus={this.m_karte_status_code}
                    patientId={this.props.match.params.id}
                  />
                  <WrapperContainer
                    id="prescribe-container"
                    onDrop={async(e) => await this.onDropEvent(e)}
                    onDragOver={e => this.onDragOver(e)}
                  >
                    <PrescribeTable
                      ref={this.prescribeTableRef}
                      isLoaded={this.state.isLoaded}
                      patientInfo={this.state.patientInfo}
                      patientId={this.props.match.params.id}
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
                      bodyPartData={this.modal_obj.bodyPartData}
                      storeDataInCache={this.storeDataInCache}
                      openBodyParts={this.openBodyParts}
                      openAdministratePeriodInputModal={this.openAdministratePeriodInputModal}
                      // startDate = {this.state.startDate}
                      usageData={this.modal_obj.usageData}
                      handleMedicineClick = {this.handleMedicineClick}
                      selectDoctorFromModal={this.selectDoctorFromModal}
                      showDiagnosisPermission={this.showDiagnosisPermission}
                      checkPermissionByType={this.checkPermissionByType}
                      registerSet={this.registerSet}
                      createCacheOrderData={this.createCacheOrderData}
                      registerNewSet={this.registerNewSet}
                      cacheSerialNumber={this.m_cacheSerialNumber}
                      stopLoadingFlag={this.state.stop_prescribe_table_load}
                      med_consult={this.modal_obj.med_consult}
                      supply_med_info={this.modal_obj.supply_med_info}
                      in_out={this.modal_obj.inOut}
                      cancelAdministratePeriod={this.cancelAdministratePeriod}
                      indexPresAndMed={this.indexPresAndMed}
                    />
                    {(this.isExistItemDetail() == true || (enable_function_item == 1)) && (
                      <div className={'set-detail-area'}>
                        <div className={"d-flex"} style={{width:80,cursor:"pointer"}} onClick={this.onAngleClick} >
                          <Title title="品名" />
                          <Angle className={`item-detai-label angle ${this.m_show_detail_flag == 1 ? "close-table": ""}`} icon={faAngleDown} />
                        </div>
                        <div id="item_detail" className={this.m_show_detail_flag == 0 ? "no-visible" : ""}>
                          <ItemPrescriptionTableBody
                            ref={this.prescriptionNameRef}
                            function_id={FUNCTION_ID_CATEGORY.PRESCRIPTION}
                            item_details={this.modal_obj.item_details}
                            setItemDetails={this.setItemDetails.bind(this)}
                          />
                        </div>
                      </div>
                    )}
                    <Title title="備考・その他" />
                    <Remarks
                      ref={this.remarkRef}
                      inOut={this.modal_obj.inOut}
                      getRadio={this.getRadio}
                      getDepartment={this.getDepartment}
                      getPsychoReason={this.getPsychoReason}
                      getFreeComment={this.getFreeComment}
                      getPoulticeReason={this.getPoulticeReason}
                      departmentId={this.modal_obj.departmentId}
                      department={this.modal_obj.department} // 選択済の診療科
                      psychotropic_drugs_much_reason={
                        this.modal_obj.psychotropic_drugs_much_reason
                      }
                      poultice_many_reason={this.modal_obj.poultice_many_reason}
                      free_comment={this.modal_obj.free_comment}
                      med_consult={this.modal_obj.med_consult}
                      supply_med_info={this.modal_obj.supply_med_info}
                      bulk={this.modal_obj.bulk}
                      getAdditionsCheck={this.getAdditionsCheck}
                      presData={this.state.presData}
                      additions={this.state.additions}
                      addition_condition = {this.state.addition_condition}
                      patientId={this.props.match.params.id}
                      karteStatus={this.m_karte_status_code}
                      updateStoreCacheNoRefresh={this.updateStoreCacheNoRefresh}
                      potion={this.modal_obj.potion}
                      hospital_opportunity_disease={this.modal_obj.hospital_opportunity_disease}
                      setRemarkState={this.setRemarkState}
                      cacheSerialNumber={this.m_cacheSerialNumber}
                    />
                  </WrapperContainer>
                  <PrescriptionAllModal
                    ref={this.patientModalRef}
                    setBeforeUsage={this.setBeforeUsage}
                    amountConfirm={this.amountConfirm}
                    amountCancel={this.amountCancel}
                    bodyPartConfirm={this.bodyPartConfirm}
                    saveAdministratePeriod={this.saveAdministratePeriod}
                    daysConfirm={this.daysConfirm}
                    hideModal={this.hideModal}
                    stepOneCancel={this.stepOneCancel}
                    stepTwoCancel={this.stepTwoCancel}
                    stepTwoOk={this.stepTwoOk}
                    dropCancel={this.dropCancel}
                    dropTwoOk={this.dropTwoOk}
                    diseaseCancel={this.diseaseCancel}
                    diseaseOrderCancel={this.diseaseOrderCancel}
                    diseaseOrderOk={this.diseaseOrderOk}
                    diseasePrescriptionCancel={this.diseasePrescriptionCancel}
                    diseasePrescriptionOk={this.diseasePrescriptionOk}
                    periodCancel={this.periodCancel}
                    periodOk={this.periodOk}
                    periodOrderOk={this.periodOrderOk}
                    periodPrescriptionOk={this.periodPrescriptionOk}
                    handleUsageModal={this.handleUsageModal}
                    handleUsageDetail={this.handleUsageDetail}
                    handleUsageHide={this.handleUsageHide}
                    handleUsageOverOK={this.handleUsageOverOK}
                    diagnosisCancel={this.diagnosisCancel}
                    diagnosisOK={this.diagnosisOK}
                    handleUsageMedDetailCancel={this.handleUsageMedDetailCancel}
                    handleClose={this.handleClose}
                    handleChangeDeparment={this.handleChangeDeparment}
                    handleRegisterSet={this.handleRegisterSet}
                    confirmCancel={this.confirmCancel}
                    confirmOk={this.confirmOk.bind(this)}
                    confirmUnenabledUsageOk={this.confirmUnenabledUsageOk.bind(this)}
                    confirmUnenabledUsageCancel={this.confirmUnenabledUsageCancel.bind(this)}
                    dropOneOk={this.dropOneOk}
                    dayCancel={this.dayCancel}
                    closeBodyParts={this.closeBodyParts}
                    stepOneOk={this.stepOneOk}
                    diseaseOk={this.diseaseOk}
                    handleUsageOk={this.handleUsageOk}
                    diagnosisOrderCancel={this.diagnosisOrderCancel}
                    diagnosisOrderOK={this.diagnosisOrderOK}
                    patientId={this.props.match.params.id}
                    units={units}
                    props_state={this.state}
                    modal_obj={this.modal_obj}
                    setModalObj={this.setModalObj}
                    dropRun={this.dropRun}
                    insertMedModal={this.insertMedModal}
                    getUsage={this.getUsage}
                    getUsageFromModal={this.getUsageFromModal}
                    indexUsage={indexUsage}
                    selectDoctorFromModal={this.selectDoctorFromModal}
                    getDoctorModal={this.getDoctorModal}
                    closeDoctorModal={this.closeDoctorModal}
                    changeAllRpDaysAmount={this.changeAllRpDaysAmount}
                    patientInfo={this.state.patientInfo}
                    prescriptionConfirmOk={this.prescriptionConfirmOk}
                    deletePrescriptionCancel={this.deletePrescriptionCancel}
                    deletePrescriptionConfirm={this.deletePrescriptionConfirm}
                    editPrescriptionAfterDelConfirm={this.editPrescriptionAfterDelConfirm}
                    handleAlertOk={this.handleAlertOk}
                    cacheSerialNumber={this.m_cacheSerialNumber}
                    refreshNotConsented={this.refreshNotConsented}
                    confirmDeletedData={this.confirmDeletedData}
                    confirmDeletedCancelData={this.confirmDeletedCancelData}
                    handleMedicinePeriodDuplicateModal={this.handleMedicinePeriodDuplicateModal}
                    doctors={this.state.doctors}
                    confirmPrintPrescription={this.confirmPrintPrescription}
                  />
                  <PrescriptionConfirmButton
                    ref={this.confirmButtonRef}
                    canConfirm={this.modal_obj.canConfirm}
                    confirmPrescription={this.confirmPrescription}
                    deletePrescriptionFun={this.deletePrescriptionFun}
                    cacheSerialNumber={this.m_cacheSerialNumber}
                    patientId={this.props.match.params.id}
                  />
                </Col>
                {this.state.modalVisible && (
                  <EndExaminationModal
                    patientId={this.props.match.params.id}
                    visible={this.state.modalVisible}
                    sendPrescription={this.sendKarte}
                    closeModal={this.closeModal}
                    cancelExamination={this.cancelExamination}
                    pacsOn={this.state.pacsOn}
                    patientInfo={this.state.patientInfo}
                    PACSOff={this.PACSOff}
                    isSending={this.state.isSending}
                    getMessageSendKarte={this.getMessageSendKarte}
                    goKartePage={this.goKartePage}
                  />
                )}
              </PrescriptionMain>
            )}
            {/*{this.state.isNotConsentedModalOpen === true &&
              this.state.staff_category === 1 && (
              <NotConsentedModal
                patientId={this.props.match.params.id}
                refresh={this.refreshNotConsented.bind(this)}
                closeNotConsentedModal={this.closeNotConsentedModal}
                fromPatient={false}
              />
            )}*/}
          </PanelGroup>
        </PrescriptionWrapper>
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
