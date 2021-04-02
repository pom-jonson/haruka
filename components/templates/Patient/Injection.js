import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import enhance from "./@enhance";
import Title from "../../atoms/Title";
import TitleHasMenu from "../../organisms/TitleHasMenu";
import PrescriptionConfirmButton from "../../atoms/PrescriptionConfirmButton";
import Context from "~/helpers/configureStore";
import TitleTabs from "../../organisms/TitleTabs";
import InjectionTable from "../../organisms/InjectionTable";
import InjectionSelection from "../../organisms/InjectionSelection";
import InjectionSetSelection from "../../organisms/InjectionSetSelection";
import InjectionRankSelection from "../../organisms/InjectionRankSelection";
import InjectionRemarks from "../../organisms/InjectionRemarks";
import InjectionInOutNav from "../../organisms/InjectionInOutNav";
import * as injectionMethods from "./Injection/FinalMethods";
import EndExaminationModal from "../../organisms/EndExaminationModal";
import { getCurrentDate, formatDateFull } from "../../../helpers/date";
import { persistedState } from "../../../helpers/cache";
import * as apiClient from "../../../api/apiClient";
import { 
  OPERATION_TYPE, 
  SOAP_TREE_CATEGORY, 
  TREE_FLAG, 
  CACHE_LOCALNAMES, 
  FUNCTION_ID_CATEGORY, 
  KARTEMODE, 
  PERMISSION_TYPE, 
  Karte_Types, 
  CACHE_SESSIONNAMES, 
  handleDocumentHref,
  getInjectionUsageInfo
} from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";
import axios from "axios";
import InjectionTree from "~/components/templates/Patient/InjectionTree";
import ItemPrescriptionTableBody from "~/components/templates/Patient/components/ItemPrescriptionTableBody";
import auth from "~/api/auth";
import Button from "~/components/atoms/Button";
import { faAngleDown } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {onSurface} from "../../_nano/colors";
import InjectionAllModal from "./components/InjectionAllModal";
import PanelGroup from "./PanelGroup/PanelGroup";
import $ from "jquery";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as localApi from "~/helpers/cacheLocal-utils";

const InjectionWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
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
      cursor: pointer;
    }
  }
`;

const InjectionMain = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;  
  width: 100%;
    .prescription-check{
      float: right;
      margin-top: 10px;
      button{
        background: #d3d3d3;
        border: 1px solid #aaa;
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
      height: 34px;
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
      margin-left: -83%;
      border: solid 1px black;
      padding: 3px;
      margin-top: -5px;
      min-width: 60px;
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
  height: calc(100vh - 260px);
  overflow: auto;
`;

const ContextMenuUl = styled.ul`
  margin-bottom: 0px;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 0px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 0px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 14px;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
`;

const Angle = styled(FontAwesomeIcon)`
  color: ${onSurface};
  cursor: pointer;
  display: inline-block;
  font-size: 25px;
  margin-left: 20px;
  margin-top: -5px;
`;

const ContextMenu = ({
                       visible,
                       x,
                       y,
                       categoryOperation,
                       parent
                     }) => {
  if (visible && categoryOperation !== undefined) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <>
            <li>
              <div onClick={() => parent.contextMenuAction("doDeleteArea", categoryOperation)}>
                {categoryOperation == OPERATION_TYPE.REGIST?"入力を破棄":categoryOperation == OPERATION_TYPE.EDIT?"変更を破棄":"削除を取りやめ"}
              </div>
            </li>
          </>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

@enhance
class Injection extends Component {
  constructor(props) {
    super(props);
    Object.entries(injectionMethods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );

    // 注射の検索モードの「全文検索」のデフォルトがオンかオフかを設定できるように
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    let injection_pro_search = false;
    if(initState !== undefined && initState != null && initState.conf_data !== undefined){
      if(initState.conf_data.injection_pro_search !== undefined && initState.conf_data.injection_pro_search == "ON"){
        injection_pro_search = true;
      }      
    }    
    this.injection_pro_search = injection_pro_search;

    this.first_load_page = 1;
    this.m_medicine = [];
    this.m_indexOfInsertPres = 0;
    this.m_indexOfInsertMed = 0;
    this.m_show_detail_flag = 0;
    this.act_msg = "";
    this.m_injectDataFromSoap = undefined;
    this.additions_action = false;
    this.cur_date = new Date();
    this.schedule_date = new Date();
    this.schedule_date.setDate(new Date().getDate()+1);
    this.buttonDoubleClick = null;
    // right menu from prescribetable's 数量の変更
    this.amountCancelFromMenu = "";

    this.search_date = null;

    this.modal_obj = {
      canConfirm: 0,
      isAmountOpen: false,
      hideDuplicateModal: true,
      insertMedicineFlag: true,
      isBodyPartOpen: false,
      isAdministratePeriodOpen: false,
      isDaysOpen: false,
      daysInitial: 0,
      insertStep: 0,
      dropStep: 0,
      inOut: 1,
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
      isSomeCompletedCancelModalOpen: false,
      isMedicinePeriodDuplicateOpen: false,
      complete_message: "",
      daysSuffix: "",
      usage: 0,
      usageRpIdx: -1,
      usageRpOrderIdx: -1,
      usageInjectData: [],
      periodOrderData: {},
      periodPrescriptionData: {},
      departmentDate: "",
      departmentNumber: 0,
      is_done: false,
      item_details:[
        {classfic: 0, classfic_name:'', item_id: 0, item_name: "", attribute1:"0", format1:"", unit_name1:"", max_length1:"", value1:"", attribute2:"0", format2:"", unit_name2:"", max_length2:"", value2:""},
      ],
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
      schedule_date: this.schedule_date,
      rpNewCreate: 0,
      duplicateList: [],
      rejectList: [],
      alertList: [],

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
    this.scrollHistoryDataFlag = 0;
    this.tempInjectData = undefined;
    this.tempInjectionHistory = undefined;
    this.tempMedicineRankHistory = undefined;
    this.tempInjectionSetHistory = undefined;
    this.tempItemDetails = undefined;
    this.confirmButtonRef = React.createRef();
    this.titleRef = React.createRef();
    this.remarkRef = React.createRef();
    this.injectionInOutRef = React.createRef();
    this.prescribeTableRef = React.createRef();
    this.injectionTreeRef = React.createRef();
    this.medicineSelectionRef = React.createRef();
    this.medicineRankSelectionRef = React.createRef();
    this.medicineSetSelectionRef = React.createRef();
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.patientModalRef = React.createRef();
    this.itemPrescriptionRef = React.createRef();
    this.patientModal = null;
    this.firstLogin = true;
    // 注射オーダーKey setting
    let active_key = karteApi.getSubVal(this.props.match.params.id, CACHE_LOCALNAMES.ACTIVE_KEY, "injection");
    if (active_key == undefined || active_key == null) {
      active_key = new Date().getTime();
      karteApi.setSubVal(this.props.match.params.id, CACHE_LOCALNAMES.ACTIVE_KEY, "injection", active_key);
    }
    this.m_cacheSerialNumber = active_key;
    this.selected_tab_flag = 0;
    this.japic_alert_reject = 1;
    let conf_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "conf_data");
    if(conf_data != undefined && conf_data != null && conf_data.japic_alert_reject != undefined && conf_data.japic_alert_reject != null && conf_data.japic_alert_reject != ""){
      this.japic_alert_reject = conf_data.japic_alert_reject;
    }
    localApi.remove('injection_gray_info');
  }

  componentDidUpdate() {
    if (
      document.getElementById("Injection_dlg") !== undefined &&
      document.getElementById("Injection_dlg") !== null
    ) {
      document.getElementById("Injection_dlg").focus();
    }
  }
  
  componentWillUnmount() {
    this.tempInjectData = undefined;
    this.tempInjectionHistory = undefined;
    this.tempMedicineRankHistory = undefined;
    this.tempInjectionSetHistory = undefined;
    this.tempItemDetails = undefined;
    this.confirmButtonRef = null;
    this.titleRef = null;
    this.remarkRef = null;
    this.injectionInOutRef = null;
    this.prescribeTableRef = null;
    this.injectionTreeRef = null;
    this.medicineSelectionRef = null;
    this.medicineRankSelectionRef = null;
    this.medicineSetSelectionRef = null;
    this.departmentOptions = null;
    this.patientModalRef = null;
    this.itemPrescriptionRef = null;
    this.modal_obj = {};
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
    
    karteApi.delSubVal(this.props.match.params.id, CACHE_LOCALNAMES.ACTIVE_KEY, "injection");
    window.localStorage.removeItem("prescription_origin_data");
  
    var panelGroup = document.getElementsByClassName('container')[0];
    if (panelGroup != undefined) this.purge(panelGroup);
    for (var key in window.localStorage) {
      if (key.includes("inject_keyword_")) {
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

  shouldComponentUpdate(nextprops, nextstate) {
    // console.log("shouldComponentUpdate ========================");
    if (this.modal_obj.store_no_fresh == 1) {
      this.modal_obj.store_no_fresh = null;
      return false;
    }

    if (this.modal_obj.loadedEnd == true) {
      // console.log('injection-794');
      this.modal_obj.loadedEnd = false;
      this.modal_obj.getHistoryEnd = -1;
      return true;
    }

    if (this.selected_tab_flag == 1) {
      this.selected_tab_flag = 0;
      return true;
    }

    if (this.state.isLoaded == true) {
      // console.log('injection-800');
      if (this.scrollHistoryDataFlag == 1) { // scroll history injection call
        // console.log('injection-802');
        this.scrollHistoryDataFlag = 0;
        return false;
      }
      if(this.autoLogoutModalShow != this.context.autoLogoutModalShow){
        // console.log('injection-807');
        return false;
      }
      this.changeState = JSON.stringify(this.state) != JSON.stringify(nextstate);
      this.changeProps = JSON.stringify(this.props) != JSON.stringify(nextprops);
      this.autoLogoutModalShow = this.context.autoLogoutModalShow;
      if (this.state.unusedDrugSearch != nextstate.unusedDrugSearch) {
        // console.log('injection-814');
        if(this.prescribeTableRef.current != undefined){
          this.prescribeTableRef.current.testSearchOptionRender("unusedDrugSearch", nextstate.unusedDrugSearch);
        }
        return false;
      }
      if (this.state.profesSearch != nextstate.profesSearch) {
        // console.log('injection-819');
        if(this.prescribeTableRef.current != undefined){
          this.prescribeTableRef.current.testSearchOptionRender("profesSearch", nextstate.profesSearch);
        }
        return false;
      }
      if (this.state.normalNameSearch != nextstate.normalNameSearch) {
        // console.log('injection-824');
        if(this.prescribeTableRef.current != undefined){
          this.prescribeTableRef.current.testSearchOptionRender("normalNameSearch", nextstate.normalNameSearch);
        }
        return false;
      }
      // if (JSON.stringify(this.state.bulk) != JSON.stringify(nextstate.bulk)) {return false;}
      if (this.state.psychotropic_drugs_much_reason != nextstate.psychotropic_drugs_much_reason){
        // console.log('injection-830');
        return false;
      }
      if (this.state.free_comment != nextstate.free_comment){
        // console.log('injection-834');
        return false;
      }
      if (this.state.poultice_many_reason != nextstate.poultice_many_reason){
        // console.log('injection-834');
        return false;
      }
      if (this.state.isDoctorsOpen == true) {
        // console.log('injection-842');
        return true;
      }
      if(this.state.soapTrees != nextstate.soapTrees ||
        this.state.categoryType != nextstate.categoryType ||
        this.state.curScrollTop != nextstate.curScrollTop ||
        this.state.selYear != nextstate.selYear ||
        this.state.selMonth != nextstate.selMonth ||
        this.state.selDay != nextstate.selDay
      ) {
        // console.log('injection-852');
        if (this.state.titleTab == 0) {
          // console.log('injection-853');
          this.tempInjectionHistory = [...nextstate.injectionHistory];
          if(this.medicineSelectionRef.current != undefined){
            // console.log('injection-877');
            this.medicineSelectionRef.current.testMedRender(this.tempInjectionHistory, this.modal_obj.isEdintingIndex);
          }
        }
        return false;
      }

      // injectData
      // 08/26 this.tempPresData != undefined => when load from soap, 処方や注射をSOAP画面から「編集」で開いた場合に「数量の変更」で単位が表示されない不具合
      if (this.tempInjectData != undefined && JSON.stringify(this.tempInjectData) != JSON.stringify(nextstate.injectData)) {
        // console.log('injection-864');
        this.tempInjectData = [...nextstate.injectData];
        if(this.prescribeTableRef.current != undefined){
          this.prescribeTableRef.current.testRender(this.tempInjectData);
        }
        if (this.state.titleTab == 0) {
          // injectionHistoryu
          if (JSON.stringify(this.tempInjectionHistory) == JSON.stringify(nextstate.injectionHistory)) {
            return false;
          } else {
            this.tempInjectionHistory = [...nextstate.injectionHistory];
            if(this.medicineSelectionRef.current != undefined){
              this.medicineSelectionRef.current.testMedRender(this.tempInjectionHistory, this.modal_obj.isEdintingIndex);
            }
          }
        } else if(this.state.titleTab == 1) {
          // medicineRankHistory
          if (JSON.stringify(this.tempMedicineRankHistory) == JSON.stringify(nextstate.medicineRankData)) {
            return false;
          } else {
            this.tempMedicineRankHistory = [...nextstate.medicineRankData];
            if(this.medicineRankSelectionRef.current != undefined){
              this.medicineRankSelectionRef.current.testMedRankRender(this.tempMedicineRankHistory);
            }
          }
        } else if(this.state.titleTab == 2) {
          // medicineSetHistory
          if (JSON.stringify(this.tempInjectionSetHistory) == JSON.stringify(nextstate.injectionSetData)) {
            return false;
          } else {
            this.tempInjectionSetHistory = [...nextstate.injectionSetData];
            if(this.medicineSetSelectionRef.current != undefined){
              this.medicineSetSelectionRef.current.testMedSetRender(this.tempInjectionSetHistory);
            }
          }
        }
        return false;
      }                

      if(this.state.titleTab == 1) {
        // medicineRankHistory
        if (JSON.stringify(this.tempMedicineRankHistory) != JSON.stringify(nextstate.medicineRankData)) {      
          this.tempMedicineRankHistory = [...nextstate.medicineRankData];
          if(this.medicineRankSelectionRef.current != undefined){
            this.medicineRankSelectionRef.current.testMedRankRender(this.tempMedicineRankHistory);
          }
          return false;
        }
      }

      if (this.modal_obj.rp_delete == 1 && JSON.stringify(this.tempInjectionHistory) == JSON.stringify(nextstate.injectionHistory)) {
        // console.log('injection-895');
        this.modal_obj.rp_delete = null;
        return false;
      }

      // insert med refresh
      if (this.modal_obj.insert_med_option == 1) {
        // console.log('shouldComponentUpdate-1101');
        this.modal_obj.insert_med_option = null;
        return false;
      }

      // change amount refresh
      if (this.modal_obj.change_amount_option == 1) {
        this.modal_obj.change_amount_option = null;
        return false;
      }

      // amount confirm
      if (this.modal_obj.amount_confirm_option == 1) {
        this.modal_obj.amount_confirm_option = null;
        return false;
      }

      // get usage
      if (this.modal_obj.get_injection_Usage_option == 1) {
        // console.log('injection-902');
        this.modal_obj.get_injection_Usage_option = null;
        return false;
      }

      // no refresh
      if (this.modal_obj.no_refresh == 1) {
        this.modal_obj.no_refresh = null;
        return false;
      }

      this.tempInjectionHistory = [...nextstate.injectionHistory];
      this.tempInjectData = [...nextstate.injectData];
    }
    if (this.modal_obj.getHistoryEnd == 0) {
      // console.log('injection-915');
      return false;
    }

    if (this.modal_obj.getHistoryEnd == 1 && this.state.titleTab == 0) {
      // console.log('injection-920');
      //外来のみ... ボタンのグレーアウト解除
      $(".status-select button").removeClass("btn-disable");
      if(this.medicineSelectionRef.current != undefined){
        this.medicineSelectionRef.current.testIsLoadedRender(true);
      }
      if(this.prescribeTableRef.current != undefined){
        this.prescribeTableRef.current.testIsLoadedRender(true);
      }
      this.tempInjectionHistory = [...nextstate.injectionHistory];
      if(this.medicineSelectionRef.current != undefined){
        this.medicineSelectionRef.current.testMedRender(this.tempInjectionHistory, this.modal_obj.isEdintingIndex);
      }
      this.modal_obj.getHistoryEnd = -1;
      if(this.injectionTreeRef.current != undefined){
        this.injectionTreeRef.current.testTreeRender(this.state);
      }
      return false;
    }
    return true;
  }

  async UNSAFE_componentWillMount () {
    await this.getPatientInfor();
    if(this.context.department.code == 0){
      this.context.$updateDepartment(1, "内科");
    }
  }
  // カルテを記載モードで開いているときの新規の注射で「実施済み注射」「当日注射」「予約注射」のどれが初期選択されるかを設定 2020-10-09
  setInOutDefault = (conf_data, injection_pro_search) => {
    if (this.context.$getKarteMode(this.props.match.params.id) != KARTEMODE.WRITE) return;
    let injection_inout_default = conf_data.injection_inout_default;
    let injection_inout_default_id = 1;
    if (injection_inout_default == undefined) return;
    if (this.context.karte_status != undefined && this.context.karte_status.name == "外来") {
      injection_inout_default_id = injection_inout_default.outpatient;
    }
    if (this.context.karte_status != undefined && this.context.karte_status.name == "入院") {
      injection_inout_default_id = injection_inout_default.hospital;      
    }
    if (this.context.karte_status != undefined && this.context.karte_status.name == "訪問診療") {
      injection_inout_default_id = injection_inout_default.home;      
    }
    if (window.sessionStorage.getItem('completed_injection') == 1) {
      injection_inout_default_id = 1;      
      window.sessionStorage.removeItem('completed_injection');      
    }
    this.setInOut(injection_inout_default_id, injection_pro_search);
    
  }
  
  setInOut = (default_val, injection_pro_search) => {
    let inOut_id = 1;
    if (default_val == 1) inOut_id = 1;
    else if (default_val == 0) inOut_id = 3;
    else if (default_val == 2) inOut_id = 0;

    let schedule_date = this.modal_obj.schedule_date;
    if (inOut_id == 3 || inOut_id == 1) { // 当日注射
      schedule_date = new Date();
    } else {
      let date1 = this.state.schedule_date;
      date1.setHours(0, 0, 0, 0);
      let date2 = new Date();
      date2.setHours(0, 0, 0, 0);
      if (date1.getTime() == date2.getTime()) {
        schedule_date = this.schedule_date;
      }
    }

    this.modal_obj.schedule_date = schedule_date;
    this.modal_obj.inOut = parseInt(inOut_id);
    let reset_state = {
      id: this.modal_obj.inOut,
      schedule_date: this.modal_obj.schedule_date,
      profesSearch: injection_pro_search
    };
    if(this.injectionInOutRef.current != undefined){
      this.injectionInOutRef.current.testInOutRender(reset_state);
    }
  }

  async componentDidMount() {
    /*@cc_on _win = window; eval ( 'var window = _win') @*/
    // 注射の検索モードの「全文検索」のデフォルトがオンかオフかを設定できるように
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    let injection_pro_search = false;
    if(initState !== undefined && initState != null && initState.conf_data !== undefined){
      if(initState.conf_data.injection_pro_search !== undefined && initState.conf_data.injection_pro_search == "ON"){
        injection_pro_search = true;
      }
      this.setInOutDefault(initState.conf_data, injection_pro_search);
    }

    let oplog = window.localStorage.getItem("operation_log");
    let operation_log = [];
    if(oplog !== null) {
      operation_log = JSON.parse(window.localStorage.getItem("operation_log") || "");
    }
    let log = {
      time: formatDateFull(new Date(), "-"),
      category: "see",
      detail: "注射(閲覧中)"
    };
    operation_log.push(log);
    window.localStorage.setItem("operation_log", JSON.stringify(operation_log));
    window.localStorage.setItem("injection_selection_wrapper_scroll", 0);
    // medicine history scroll
    karteApi.setVal(this.props.match.params.id, CACHE_LOCALNAMES.SOAP_PAGE_NUMBER, 0);
    if(this.medicineSelectionRef.current != undefined){
      this.medicineSelectionRef.current.testStopGetHistoryRender(false);
    }
    //加算項目制御
    let additions = null;
    await this.getAdditions(true).then(function(data){
      additions = data;
    });
    // 実施場所
    await this.getImplementLocationApi();
    let doctors = null;
    await this.getDoctorsList().then(function(data){
      doctors = data;
    });
    let usageData = null;
    await this.getUsageData().then(function(data){
      usageData = data;
    });
    let usageInjectData = null;
    await this.getUsageInjectData().then(function(data){
      usageInjectData = data;
    });
    await this.getContraindicationsToDiseaseApi(this.props.match.params.id);
    let injectData = this.state.injectData;
    injectData[0].start_date = getCurrentDate();
    let { cacheDelInjectState } = persistedState();
    let injectionHistory = this.state.injectionHistory;
    if (cacheDelInjectState) {
      injectionHistory = this.getDelInjectData(cacheDelInjectState, "del", true);
    }
    let state_data = {
      patientInfo:karteApi.getPatient(this.props.match.params.id),
      additions,
      doctors,
      usageData,
      usageInjectData,
      departmentId: this.context.department.code,
      department: this.context.department.name,
      injectData,
      injectionHistory,
      showMedicineOrigin: "",
      showMedicineContent: "",
      showMedicineSelected: "",
      modalType: "",
      changeDepartmentModal: false,
      departmentName: "内科",
      departmentDate: "",
      departmentNumber: 0,
      registerSetModal: false,
      profesSearch: injection_pro_search,
      registerSetData: [],
      contextMenu: {
        visible: false,
        x: 0,
        y: 0,
      },
      confirm_message: "",
      confirm_type: "",
      categoryOperation: -1,
      inOut: 1,
      select_outpatient: false,
      select_home: true,
      dropStep: 0,
      dropOrderList: [],
      duplicateList: [],
      patientDiseaseData: [],
      rejectList: [],
      alertList: [],
      dropText: "",
      bgMedicine: "",
      messageType: "",
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
      hideDuplicateModal: true,
      insertMedicineFlag: true,
      isDoctorsOpen: false,
    };
    let load_cache_data = this.loadInjectCachedData(this.props.match.params.id);
    if(Object.keys(load_cache_data).length > 0){
      Object.keys(load_cache_data).map(key=>{
        state_data[key] = load_cache_data[key];
      })
    }

    // soap drop index
    let insertDropSoapNumber = window.localStorage.getItem("soap_insert_drop_number");
    if (insertDropSoapNumber > 0) {
      await this.getDropInjectionData(insertDropSoapNumber).then(function(data){
        state_data['medicineSoap'] = data;
      });
    }
    // soap edit drop index
    let editDropSoapNumber = window.localStorage.getItem("soap_edit_drop_number");
    let injection = undefined;
    if (editDropSoapNumber > 0) {
      await this.getEditDropPrescriptionData(editDropSoapNumber).then(function(data){
        injection = data;
      });
    }
    this.setState(state_data, async()=>{
      // 品名 open flag
      this.m_show_detail_flag = 0;
      this.showItemDetailArea(0);
      /*@cc_on _win = window; eval ( 'var window = _win') @*/
      if (insertDropSoapNumber > 0) {
        window.localStorage.removeItem("soap_insert_drop_number");
        await this.onDropEvent("injection:" + insertDropSoapNumber, null, "_fromSoap");
      }
      if (editDropSoapNumber > 0) {
        if (injection != undefined){
          await this.editInjectOrders(injection);
        }
        window.localStorage.removeItem("soap_edit_drop_number");
      }
    });
    this.firstLogin = false;
    auth.refreshAuth(location.pathname+location.hash);
  }

  // SOAP画面からDragAndDrop追加操作
  getDropInjectionData = async (number = 0) => {
    if(number == 0) return;
    let param = {
      numbers: number,
      del_order: 1 // SOAP中央カラムから削除済みの処方、注射の内容を右カラムにDoした時に、処方、注射画面に内容が表示されない(1218-5)
    };
    let drop_injection_data = await apiClient.get("/app/api/v2/order/injection/find", {
      params: param
    });
    this.m_injectDataFromSoap = drop_injection_data;
    return drop_injection_data;
  }

  // SOAP画面からDragAndDrop編集操作
  getEditDropPrescriptionData = async (number = 0) => {
    let param = {
      numbers: number
    };
    let drop_injection_data = await apiClient.get("/app/api/v2/order/injection/find", {
      params: param
    });
    let injection = undefined;
    if (drop_injection_data != null && drop_injection_data != undefined) {
      Object.keys(drop_injection_data).map(medicine => {
        if (parseInt(medicine) === parseInt(number)) {
          injection = drop_injection_data[medicine];
        }
      });
    }
    return injection;
  }

  getAdditions = async (init=false) => {
    const { data } = await axios.post(
      "/app/api/v2/order/prescription/getAdditionMaster",
      {
        type: "injection",
        function_id:this.context.karte_status.code,
      }
    );
    let additions = (data != null && data != undefined) ? data : null;
    if(init){
      return additions;
    } else {
      this.setState({additions});
    }
  }

  getImplementLocationApi = async () => {
    let path = "/app/api/v2/order/prescription/getImplementLocation";
    let post_data = {
      patient_id: this.props.match.params.id
    };
    await apiClient._post(path,
      {params: post_data})
      .then((res) => {
        if (res) {
          let treat_location = [{id:0,value:""}];
          if (res.treat_location != null && res.treat_location.length > 0){
            res.treat_location.map(item=>{
              treat_location.push({id:item.location_id, value: item.name})
            });

            // YJ419 入院患者の処置や注射は、病棟に応じた実施場所が初期選択されるように
            if (res.treat_init_location != undefined && res.treat_init_location != null && this.context.karte_status != undefined && this.context.karte_status.name == "入院") {
              this.modal_obj.location_id = res.treat_init_location;
            }
          }
          this.modal_obj.implement_location = treat_location;
        }
      })
      .catch(() => {
      });
  }

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
        this.getInjectionRankData({
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
        this.getInjectionSetData();
      });
    }
  };

  getNotConsentedInjectionHistoryData = async () => {
    let params = {
      patient_id: this.props.match.params.id,
      get_consent_pending: 1
    };
    return await apiClient.get("/app/api/v2/order/injection/find", {
      params: params
    });
  };

  getFreeComment = e => {
    this.modal_obj.free_comment = e.target.value;
    let remark_status = {
      free_comment: this.modal_obj.free_comment
    };
    this.remarkRef.current.testRemarkRender(remark_status);
    let storeData ={"is_reload_state": false};
    this.storeInjectionDataInCache(storeData);

    // this.setState({ free_comment: e.target.value }, function() {
    //   this.storeInjectionDataInCache(this.props.match.params.id);
    // });
  }

  getAdditionsCheck = (additions_check, additions_send_flag_check) => {
    this.additions_action = true;
    let data = {};
    data.additions_check = additions_check;
    data.additions_send_flag_check = additions_send_flag_check;
    this.storeInjectionDataInCache(data);
  }

  getAdditionsSendFlagCheck = additions_send_flag_check => {
    this.setState({ additions_send_flag_check: additions_send_flag_check }, function() {
      this.storeInjectionDataInCache(this.props.match.params.id);
    });
  }

  closeModal = () => this.setState({ modalVisible: false, isSending: false });

  cancelExamination = (url) => this.props.history.replace(url);

  PACSOn = () => this.setState({ pacsOn: true });

  PACSOff = () => this.setState({ pacsOn: false });

  openNotConsentedModal = () =>{
    // this.setState({ isNotConsentedModalOpen: true });
    this.modal_obj.isNotConsentedModalOpen = true;
    if(this.patientModalRef.current != undefined){
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  }

  openSomeCompletedCancel = (_type, _rp_order, order_number, rp_number) =>{ // 「一部実施済削除」のモーダル   
    this.modal_obj.isSomeCompletedCancelModalOpen = true;
    this.modal_obj.injection_period_rp_order = _rp_order;
    this.modal_obj.injection_period_order_number = order_number;
    this.modal_obj.injection_period_rp_number = rp_number;
    this.modal_obj.injection_period_type = _type;
    if(this.patientModalRef.current != undefined){
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  }

  // closeNotConsentedModal = () =>this.setState({ isNotConsentedModalOpen: false });

  refreshNotConsented = () =>{
    this.props.history.replace("/patients/"+this.props.match.params.id+"/injection");
    // this.props.history.replace("/patients");
  }

  handleSomeCompletedCancel = (_type, _rp_data, order_number, rp_number) =>{
    let _param = {
      type: _type,
      order_number: order_number,
      rp_number: rp_number,
      complete_cancel_data: _rp_data
    };
    this.handlePeriodInjectionStop(_param);
  }

  openBodyParts = index =>{
    this.modal_obj.isBodyPartOpen = true;
    this.modal_obj.indexOfEditPres = index;
    if(this.patientModalRef.current != undefined){
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

  getDoctorModal = async(e) => {
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
    // if(this.patientModalRef.current != undefined){
    //   this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    // }
    if (this.act_msg != null && this.act_msg != undefined && this.act_msg != "") {
      //check 手技 is_enabled
      let _hasUnenabledUsage = this.hasUnenabledUsage(this.modal_obj.dropOrderUsageList);
      if (_hasUnenabledUsage == false) {
        await this.doOnDropEvent(this.act_msg);
      } else {
        this.modal_obj.hasUnenabledUsage = true;
        this.modal_obj.confirm_message = "使用できない手技が選択されています。登録する場合は手技を変更してください";
        if(this.patientModalRef.current != undefined){
          this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
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
    if (this.modal_obj.usageInjectData != null && this.modal_obj.usageInjectData != undefined && this.modal_obj.usageInjectData.length > 0) {
      this.modal_obj.usageInjectData.map(ele=>{
        if (dropOrderList.includes(ele.code) && ele.is_enabled == 0) {
          nHasUnenabledUsage = 1;
        }
      });
      if (nHasUnenabledUsage == 1) {
        return true;
      }
    }
    return false;
  }

  onDragOver = e => {
    e.preventDefault();
  };

  onDropEvent = (e, type=null, from=null) => {
    if (this.context.$getKarteMode(this.props.match.params.id) == KARTEMODE.READ) return;
    // --------- new code start
    // ----------- start ---------
    let canEdit = 0;
    if (this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION,this.context.AUTHS.REGISTER)
      || this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION, this.context.AUTHS.REGISTER_OLD)) {
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

    //check 手技 is_enabled = 注射の手技の有効・無効を判定するように
    this.modal_obj.dropOrderUsageList = this.getDropInjectionOrderUsageList(e);
    if(this.patientModalRef.current != undefined){
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
    let _hasUnenabledUsage = this.hasUnenabledUsage(this.modal_obj.dropOrderUsageList);
    // if type = "hasDoctor", mean selectedDoctor context is set.
    if (canEdit === 2 && this.context.selectedDoctor.code <= 0 && type == null) {
      this.modal_obj.isDoctorsOpen = true;
      if(this.patientModalRef.current != undefined){
        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      }
      this.act_msg = e.dataTransfer.getData("text");
      return;
    }
    // ----------- end ---------

    //check 手技 is_enabled
    if (_hasUnenabledUsage == false) {
      this.doOnDropEvent(e, from);
    } else {
      this.act_msg = e.dataTransfer.getData("text");
      this.modal_obj.hasUnenabledUsage = true;
      this.modal_obj.confirm_message = "使用できない手技が選択されています。登録する場合は手技を変更してください";
      if(this.patientModalRef.current != undefined){
        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      }
    }
  }

  doOnDropEvent = (e, from=null) => {
    this.act_msg = "";
    this.modal_obj.dropOrderUsageList = null;
    // define drop order list
    let dropOrderList = this.getDropInjectionOrderList(e);
    let duplicateList = [];
    let rejectList = [];
    let arr_IdList = [];
    let alertList = [];
    dropOrderList.map(medicine => {
      if(arr_IdList.includes(medicine.item_number)) return;
      arr_IdList.push(medicine.item_number);
      if( !this.checkCanAddInjection(medicine.item_number) ) {
        duplicateList.push(medicine);
      }
      let reject = this.checkInjectionDropContraindicationReject(medicine);
      if(reject.length > 0){
        let oneReject = [];
        reject.map(item =>{
          oneReject.push(item);
        });
        rejectList[medicine.item_number] = {item: medicine, reject: oneReject};
      }
      let alert = this.checkInjectionDropContraindicationAlert(medicine);
      if(alert.length > 0){
        let oneAlert = [];
        alert.map(item =>{
          oneAlert.push(item);
        });
        alertList[medicine.item_number] = {item: medicine, alert: oneAlert};
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
      if(this.patientModalRef.current != undefined){
        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      }
      return;
    }

    // --------- new code end
    this.onInjectionDrop(dropText, from);
  }

  //usage
  onSelectUsage = indexOfInject => {
    this.modal_obj.usageOpen = true;
    this.modal_obj.usageModal = true;
    this.modal_obj.amountTyped = false;
    this.modal_obj.indexOfEditPres = indexOfInject;
    if(this.patientModalRef.current != undefined){
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  }

  //inject usage
  onSelectInjectUsage = indexOfInject => {
    if (this.context.karte_status.code == 1 && this.modal_obj.inOut == 4) { // 定期注射
      this.openAdministratePeriodInputModal(indexOfInject);
    } else {      
      this.modal_obj.injectUsageOpen = true;
      this.modal_obj.injectUsageModal = true;
      this.modal_obj.amountTyped = false;
      this.modal_obj.indexOfEditPres = indexOfInject;
    }
    if(this.patientModalRef.current != undefined){
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  }

  gotoPage = (type) => {
    let bFlag = false
    if(this.context.$canDoAction(this.context.FEATURES.SOAP, this.context.AUTHS.REGISTER) || this.context.$canDoAction(this.context.FEATURES.SOAP, this.context.AUTHS.REGISTER_PROXY)){
      bFlag = true;
    }
    this.context.$screenCapture();
    switch(type){
      case this.context.OperationURL.PRESCRIPTION:
        this.props.history.replace(`/patients/${this.props.match.params.id}/prescription`);
        break;
      case this.context.OperationURL.SOAP:
        if(bFlag)
          this.props.history.replace(`/patients/${this.props.match.params.id}/soap`);
        break;
      case this.context.OperationURL.INSPECTION:
        this.props.history.replace(`/patients/${this.props.match.params.id}/inspection`);
        break;
      default:
        break;
    }
  }

  handleInsertInjection = (medicine, indexOfInsertPres, indexOfInsertMed) => {
    if( !this.checkCanAddInjection(medicine.code) ) {
      if (medicine.if_duplicate === "alert") {
        this.modal_obj.showMedicineSelected = medicine.name + "は";
        this.modal_obj.showMedicineOrigin = "";
        this.modal_obj.hideDuplicateModal = false;
        this.modal_obj.showMedicineContent = "既に存在しますが追加しますか？";
        this.modal_obj.modalType = "Duplicate";
        if(this.patientModalRef.current != undefined){
          this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
        }
      } else {
        this.modal_obj.showMedicineSelected = medicine.name + "は";
        this.modal_obj.showMedicineOrigin = "";
        this.modal_obj.hideDuplicateModal = false;
        this.modal_obj.showMedicineContent = "既に存在するため追加できません。";
        this.modal_obj.modalType = "Notify";
        if(this.patientModalRef.current != undefined){
          this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
        }
      }
    }else{
      this.modal_obj.insertStep = 1;
      this.insertInjectMed(medicine, indexOfInsertPres, indexOfInsertMed);
    }
    this.m_medicine = medicine;
    this.m_indexOfInsertPres = indexOfInsertPres;
    this.m_indexOfInsertMed = indexOfInsertMed;
  }

  dropRun = () => {
    this.onInjectionDrop(this.modal_obj.dropText);
  }

  diseaseOrderOk = () => {
    if(!this.checkPeriodMedicineInjection(this.modal_obj.diseaseOrder)) {
      if(!this.copyInjectionOrder(this.modal_obj.diseaseOrder)) {
        // alert("このRpは薬品が重複されているので追加できません。");
      }
    }
    this.modal_obj.diseaseOrderModal = false;
    this.modal_obj.diseaseOrderData = [];
    this.modal_obj.diseaseOrder = [];
    if(this.patientModalRef.current != undefined){
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  }

  diseasePrescriptionOk = () => {
    if(!this.checkPeriodMedicineInjection(this.modal_obj.diseasePrescription, false)) {
      if(!this.copyInjectionOrders(this.modal_obj.diseasePrescription)) {
        // alert("このRpは薬品が重複されているので追加できません。");
      }
    }
    this.modal_obj.diseasePrescriptionModal = false;
    this.modal_obj.diseasePrescriptionData = [];
    this.modal_obj.diseasePrescription = [];
    if(this.patientModalRef.current != undefined){
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  }

  periodOrderOk = () => {
    this.copyInjectionOrder(this.modal_obj.periodOrder);
    this.modal_obj.periodOrderModal = false;
    this.modal_obj.periodOrderData = [];
    this.modal_obj.periodOrder = [];
    if(this.patientModalRef.current != undefined){
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  }

  periodPrescriptionOk = () => {
    this.copyInjectionOrders(this.modal_obj.periodPrescription);
    this.modal_obj.periodPrescriptionModal = false;
    this.modal_obj.periodPrescriptionData = {};
    this.modal_obj.periodPrescription = [];
    if(this.patientModalRef.current != undefined){
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  }

  checkPermissionByType = (rpIdx, medIdx, nType) => {
    let selectedMedicine = this.state.injectData[rpIdx].medicines[medIdx];
    // [禁忌]
    if (nType === PERMISSION_TYPE.DISEASE) {
      this.modal_obj.diseaseModal = true;
      this.modal_obj.messageType = "alert";
      this.modal_obj.diseaseData = selectedMedicine.disease_alert_content;
      this.modal_obj.insertMedicineFlag = false;
      if(this.patientModalRef.current != undefined){
        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      }
    }

    // [重複]
    if (nType === PERMISSION_TYPE.DUPLICATE) {
      let duplicateOrderData = {};
      this.state.injectData.map((item, index)=>{
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
      if(this.patientModalRef.current != undefined){
        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      }
    }

    // [併用]
    if (nType === PERMISSION_TYPE.ALERT) {
      let result = this.checkInjectionContraindication(selectedMedicine);
      this.modal_obj.hideDuplicateModal = false;
      this.modal_obj.modalType = "OnlyAlert";
      this.modal_obj.insertStep = result;
      if(this.patientModalRef.current != undefined){
        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      }
    }
  }

  diagnosisOrderOK = () => {
    let diagnosisOrder = this.modal_obj.diagnosisOrderData;
    let injectData = this.state.injectData;
    Object.keys(diagnosisOrder).map(rpIdx=>{
      diagnosisOrder[rpIdx].map(medIdx=>{
        injectData[rpIdx].medicines[medIdx].diagnosis_permission = 1;
      });
    });
    this.modal_obj.diagnosisOrderModal = false;
    this.modal_obj.diagnosisOrderData = {};
    this.modal_obj.messageType = "";
    this.modal_obj.injectData = null; // @@@@
    if(this.patientModalRef.current != undefined){
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
    let data = {};
    data['injectData'] = injectData;
    this.storeInjectionDataInCache(data);
  }

  copyOrdersInjection = (prescription, type=null) => {
    let post_str = "injection:" + prescription.number;
    this.onDropEvent(post_str, type);
  }

  copyOrderInjection = (order, type=null) => {
    let post_str = "order:" + order.order_number;
    this.onDropEvent(post_str, type);
  }

  stopPeriodRpInjection = (order_number, rp_number, depart_id=null, depart_label=null) => {
    // 中止[Rp単位]
    let param = {
      order_number: order_number,
      rp_number: rp_number,
      type: "stopPeriodRpInjection",
      depart_id: depart_id,
      depart_label: depart_label
    };
    this.handlePeriodInjectionDelete("stopPeriodRpInjection", param);
  }

  stopPeriodOrderInjection = (order_number, depart_id=null, depart_label=null) => {
    // 中止[オーダー単位]
    let param = {
      order_number: order_number,
      type: "stopPeriodOrderInjection",
      depart_id: depart_id,
      depart_label: depart_label
    };
    this.handlePeriodInjectionDelete("stopPeriodOrderInjection", param);
  }

  handleStopPeriodInjectionCategory = (_param) => {    
    this.handlePeriodInjectionStop(_param);
  }

  changeDepartment = (prescription) => {
    this.modal_obj.changeDepartmentModal = true;
    this.modal_obj.departmentDate = prescription.updated_at;
    this.modal_obj.departmentNumber = prescription.number;
    this.modal_obj.departmentCode = prescription.order_data.department_code;
    this.modal_obj.departmentName = prescription.order_data.department;
    if(this.patientModalRef.current != undefined){
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
  handleChangeDeparment = (code) => {
    this.setDepartment(this.modal_obj.departmentNumber, code).then(this.updateChangeDepartment);
  };

  updateChangeDepartment = (arr) => {
    if(arr[0] == 0) return;
    let new_number = arr[0];
    let code = arr[1];
    let cacheMedicineHistory = JSON.parse(
      window.localStorage.getItem("haruka_cache_injectionHistory")
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

      window.localStorage.setItem("haruka_cache_injectionHistory",  JSON.stringify(cacheMedicineHistory));
      this.getTrackData(new_number);
      this.setState({ injectionHistory: cacheMedicineHistory  });
    }

  };
  getDropModalStep = (arrDuplicateList = [], arrRejectList = [], arrAlertList = []) => {
    let bgMedicine = "";
    if (arrRejectList.length == 0) {
      if (arrDuplicateList.length == 0){
        if (arrAlertList.length != 0) {
          bgMedicine = "medicine_alert" ;
          return [2, bgMedicine];
        }
        return [0, bgMedicine];
      }else{
        let _existReject = false;
        arrDuplicateList.map(item=>{
          if (item.if_duplicate == "reject") {
            _existReject = true;
          }
        })
        if (_existReject == true) {
          return [1, bgMedicine];
        }else{
          bgMedicine = "medicine_alert" ;
          return [2, bgMedicine];
        }
      }
    }
    return [arrRejectList.length == 0 ? 0 : 1, bgMedicine];
  }
  registerSet = (prescription) => {
    this.modal_obj.registerSetModal = true;
    this.modal_obj.registerSetData = prescription;
    if(this.patientModalRef.current != undefined){
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  }

  handleRegisterSet = (strName) => {
    this.registerNewInjectionSet(strName);
  }

  onClickTitle = (e, menuType) => {
    if (this.context.$getKarteMode(this.props.match.params.id) == KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合

    if(e.button == 2 && menuType == "injection") { // if 右クリック
      e.preventDefault();
      e.target.click();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextMenu: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: { visible: false }
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      if (
        document.getElementById("div-title") !== undefined &&
        document.getElementById("div-title") !== null
      ) {
        document
          .getElementById("div-title")
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({
              contextMenu: { visible: false }
            });
            document
              .getElementById("div-title")
              .removeEventListener(`scroll`, onScrollOutside);
          });
      }
      let nOperationType = -1;
      if(this.state.isForUpdate !== undefined && this.state.isForUpdate){
        nOperationType = OPERATION_TYPE.EDIT;
      }else {
        nOperationType = OPERATION_TYPE.REGIST;
      }
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX,
          y: e.clientY + window.pageYOffset,
        },
        categoryOperation: nOperationType
      });
    }
  }

  contextMenuAction = (act, nCategoryOperation) => {
    if (act === "doDeleteArea") {
      let msg = "注射";
      if (nCategoryOperation == OPERATION_TYPE.REGIST) {
        msg = msg + "の入力内容を破棄しますか？";
      } else if (nCategoryOperation == OPERATION_TYPE.EDIT) {
        msg = msg + "の変更内容を破棄しますか？";
      }
      this.modal_obj.confirm_message = msg;
      this.modal_obj.confirm_type = "injection";
      if(this.patientModalRef.current != undefined){
        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      }
    }
  };

  confirmUnenabledUsageCancel = () => {
    this.modal_obj.confirm_message = "";
    this.modal_obj.confirm_type = "";
    this.modal_obj.hasUnenabledUsage = false;
    this.modal_obj.dropOrderUsageList = null;
    this.act_msg = "";
    if(this.patientModalRef.current != undefined){
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  }

  confirmUnenabledUsageOk = () => {
    this.modal_obj.confirm_message = "";
    this.modal_obj.confirm_type = "";
    this.modal_obj.hasUnenabledUsage = false;
    if(this.patientModalRef.current != undefined){
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
    if (this.act_msg != null && this.act_msg != undefined && this.act_msg != "") {
      this.doOnDropEvent(this.act_msg);
    }
  }

  // init 品名
  initItemDetails = () => {
    this.modal_obj.item_details = [
      {classfic: 0, classfic_name:'', item_id: 0, item_name: "", attribute1:"0", format1:"", unit_name1:"", max_length1:"", value1:"", attribute2:"0", format2:"", unit_name2:"", max_length2:"", value2:""},
    ];

    if (this.itemPrescriptionRef.current != undefined && this.itemPrescriptionRef.current != null) {
      this.itemPrescriptionRef.current.testPrescriptionNameRender({item_details:this.modal_obj.item_details});
    }
  }

  // init 備考・その他
  initOtherInfo = () => {
    this.modal_obj.location_id = 0;
    this.modal_obj.location_name = "";
    this.modal_obj.drip_rate = 0;
    this.modal_obj.water_bubble = 0;
    this.modal_obj.exchange_cycle = 0;
    this.modal_obj.require_time = 0;
    this.modal_obj.free_comment = "";

    let remark_status = {
      location_id: 0,
      drip_rate: 0,
      water_bubble: 0,
      exchange_cycle: 0,
      require_time: 0,
      free_comment: ""
    };

    this.remarkRef.current.testRemarkRender(remark_status);
  }

  confirmOk(type=null) {
    const initData = {
      medicines: [
        {
          medicineId: 0,
          medicineName: "",
          amount: 0,
          unit: "",
          free_comment: []
        }
      ],
      days: 0,
      days_suffix: "",
      insurance_type: 0,
      usage: 0,
      usageName: "",
      usageIndex: 0,
      year: "",
      month: "",
      date: "",
      body_part: "",
      usage_remarks_comment: [],
      start_date: getCurrentDate()
    };
    if (this.modal_obj.confirm_type == "injection" || type == "init") {
      this.cacheDelete();
    }
    this.modal_obj.confirm_message = "";
    this.modal_obj.confirm_type = "";
    this.modal_obj.isEdintingIndex = -1;
    if(this.patientModalRef.current != undefined){
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
    if (this.state.titleTab == 0) {
      this.setInjectDoCopyStatus(0, false, true);
      let history_list_obj = $("#injection_history_wrapper");
      let obj_item = $(".inject-title", history_list_obj);
      if(obj_item.hasClass("edit")){
        obj_item.removeClass("edit");
      }
    }

    // delete 品名
    this.initItemDetails();

    // delete 備考・その他
    this.initOtherInfo();

    this.setState({
      injectData: [initData],
      isForUpdate: false,
    },()=>{
      // title update
      if(this.titleRef.current != undefined){
        this.titleRef.current.testTitleRender(this.getInjectionOrderTitle());
      }
    });

    // ■YJ658 注射画面で、薬剤検索をキャンセルした後で、新規入力時に検索キーワードが残っている不具合
    for (var key in window.localStorage) {
      if (key.includes("inject_keyword_")) {
        window.localStorage.removeItem(key);
      }
    }
  }
  
  cacheDelete = () => {
    let cacheData = karteApi.getSubVal(this.props.match.params.id, CACHE_LOCALNAMES.INJECTION_EDIT, this.m_cacheSerialNumber);
    if (cacheData !=  undefined && cacheData[0] != undefined) {
      let cache_number = cacheData[0].number;
      karteApi.delSubVal(this.props.match.params.id, CACHE_LOCALNAMES.INJECTION_EDIT, this.m_cacheSerialNumber);
      let cache_done_history = karteApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.INJECTION_DONE_HISTORY);
      let cache_done = karteApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.INJECTION_DONE);
      if (cache_done_history != null && cache_done_history.length > 0) {
        cache_done_history = cache_done_history.filter(x=>x.number!=cache_number);
      }
      if (cache_done != null && cache_done.length > 0) {
        cache_done = cache_done.map(medicine=>{
          if(medicine.number == cache_number){
            let pres_history_obj = $(".inject-medicine-"+cache_number);
            pres_history_obj.removeClass("line-done");
          } else {
            return medicine;
          }
        });
      }
      if (cache_done_history != null && cache_done_history.length > 0) {
        karteApi.setVal(this.props.match.params.id, CACHE_LOCALNAMES.INJECTION_DONE_HISTORY, JSON.stringify(cache_done_history));
        karteApi.setVal(this.props.match.params.id, CACHE_LOCALNAMES.INJECTION_DONE, JSON.stringify(cache_done));
      } else {
        karteApi.delVal(this.props.match.params.id, CACHE_LOCALNAMES.INJECTION_DONE_HISTORY);
        karteApi.delVal(this.props.match.params.id, CACHE_LOCALNAMES.INJECTION_DONE);
      }
    }
    this.modal_obj.isEdintingIndex = -1;
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

  showTreePrescription =async(first_load=null)=>{
    if(this.state.isLoaded){
      this.medicineSelectionRef.current.testIsLoadedRender(false);
    }
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
    tmpParams.type="injection";
    if (this.context.karte_status.code == 0) {
      tmpParams.karte_status = 1;
      tmpParams.show_option = this.state.select_outpatient == true ? 1 : 0;
    } else if (this.context.karte_status.code == 2) {
      tmpParams.karte_status = 2;
      tmpParams.show_option = this.state.select_home == true || this.state.select_home == undefined ? 1 : 0;
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
      }, ()=>{
        this.getHistoryDataByTree(SOAP_TREE_CATEGORY.CURRENT_ORDER_LATEST, nYear, nMonth, nDay, this.state.categoryType, "date", first_load);
      });
    })
  }

  getHistoryDataByTree =async(department, year, month, date, nCategoryType, type, first_load)=>{
    if(this.state.isLoaded){
      // this.setState({isLoaded:false},()=>{
      if(this.medicineSelectionRef.current != undefined){
        this.medicineSelectionRef.current.testIsLoadedRender(false);
      }
      // });
    }
    let result = await this.changeInjectionList(department, year, month, date, nCategoryType);
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
      if (this.medicineSelectionRef.current != undefined && this.medicineSelectionRef.current != null) {
        this.medicineSelectionRef.current.testStopGetHistoryRender(false);
      }
      window.localStorage.setItem("injection_selection_wrapper_scroll", 0);
      karteApi.setVal(this.props.match.params.id, CACHE_LOCALNAMES.SOAP_PAGE_NUMBER, 0);
      // karte_status: 1=> 外来, 2=>在宅
      let karte_status = 0;
      if (this.context.karte_status.code == 0) {
        karte_status = this.state.select_outpatient == true ? 1 : 0;
      } else if (this.context.karte_status.code == 2) {
        karte_status = this.state.select_home == true ? 2 : 0;
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
      // result.isLoaded = false;

      this.search_date = search_date;

      // 日付ツリー選択時、右エリア再描画
      result.getHistoryEnd = 0;
      this.modal_obj.getHistoryEnd = 0;
      await this.getHistoryInjectionApi(history_post_params, first_load).then(function(data){
        if(Object.keys(data).length > 0){
          Object.keys(data).map(key=>{
            result[key] = data[key];
          })
        }
      });
      this.setState(result);
    }
  }

  selectInOut = (id, schedule_date) => {
    if (this.context.$getKarteMode(this.props.match.params.id) == KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
    if (this.state.isForUpdate != undefined && this.state.isForUpdate) {
      return;
    }
    this.modal_obj.schedule_date = schedule_date;
    this.modal_obj.inOut = parseInt(id);
    let reset_state = {
      id: this.modal_obj.inOut,
      schedule_date: this.modal_obj.schedule_date
    };
    if(this.injectionInOutRef.current != undefined){
      this.injectionInOutRef.current.testInOutRender(reset_state);
    }
    let data ={"is_reload_state": false};
    this.storeInjectionDataInCache(data);
  };

  setScheduleDate = (value) => {
    this.modal_obj.schedule_date = value;
    let reset_state = {
      schedule_date: value
    };
    this.injectionInOutRef.current.testInOutRender(reset_state);
    let data ={"is_reload_state": false};
    this.storeInjectionDataInCache(data);
  }

  setItemDetails =(data)=>{
    this.modal_obj.item_details = data;
    if (this.itemPrescriptionRef.current != undefined && this.itemPrescriptionRef.current != null) {
      this.itemPrescriptionRef.current.testPrescriptionNameRender({item_details:data});
    }
    this.modal_obj.no_refresh = 1;
    this.setState({item_details: data});
    let _data ={"is_reload_state": false};
    this.storeInjectionDataInCache(_data);
  };

  handleAddClass = (_id, _class = "selected") => {
    if (!$("#" + _id).hasClass(_class)) {
      $("#" + _id).addClass(_class);
    }
  };

  handleRemoveClass = (_id, _class = "selected") => {
    if ($("#" + _id).hasClass(_class)) {
      $("#" + _id).removeClass(_class);
    }
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
    },()=>{
      $(".status-select button").addClass("btn-disable");
      this.showTreePrescription();
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
    },()=>{
      $(".status-select button").addClass("btn-disable");
      this.showTreePrescription();
    })
  };

  onAngleClick = () => {
    if (this.context.$getKarteMode(this.props.match.params.id) == KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
    this.m_show_detail_flag = (this.m_show_detail_flag + 1) % 2;
    if (this.m_show_detail_flag == 0) {
      this.showItemDetailArea(0);
    } else {
      this.showItemDetailArea(1);
    }
  };

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

  closeDoctorModal = () => {
    this.modal_obj.isDoctorsOpen = false;
    if(this.patientModalRef.current != undefined){
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
    this.setState({
      isDoctorsOpen: false,
    });
  };

  setModalObj = (modal_obj) => {
    this.modal_obj = modal_obj;
  }

  setInjectionHistory = (historyData) => {
    this.scrollHistoryDataFlag = 1;
    this.setState({
      injectionHistory: historyData
    });
  }

  // 実施場所
  getImplementLocation = (location_id, location_name) => {
    this.modal_obj.location_id = location_id;
    this.modal_obj.location_name = location_name;
    let reset_state = {
      location_id: this.modal_obj.location_id
    };
    if(this.remarkRef.current != undefined){
      this.remarkRef.current.testRemarkRender(reset_state);
    }
    let data = {"is_reload_state": false};
    this.storeInjectionDataInCache(data);
  }

  // 数値変更
  changeConditionAmount = (type = null) => {
    if (type == null) return;
    this.modal_obj.change_drip_rate_amount = 1;
    this.modal_obj.change_amount_type = type;
    if (type == "drip_rate") {
      this.modal_obj.calcUnit = "ml/h";
      this.modal_obj.calcTitle = "点滴速度";
    } else if (type == "water_bubble") {
      this.modal_obj.calcUnit = "滴";
      this.modal_obj.calcTitle = "1分あたり";
    } else if (type == "exchange_cycle") {
      this.modal_obj.calcUnit = "時間";
      this.modal_obj.calcTitle = "交換サイクル";
    } else if (type == "require_time") {
      this.modal_obj.calcUnit = "時間";
      this.modal_obj.calcTitle = "所要時間";
    }
    if(this.patientModalRef.current != undefined){
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  }

  changeConditionAmountConfirm = (nVal) => {
    this.modal_obj.change_drip_rate_amount = 0;
    let remark_status = {};
    if (this.modal_obj.change_amount_type == "drip_rate") {
      remark_status["drip_rate"] = parseInt(nVal);
      this.modal_obj.drip_rate = parseInt(nVal);
    } else if(this.modal_obj.change_amount_type == "water_bubble") {
      remark_status["water_bubble"] = parseInt(nVal);
      this.modal_obj.water_bubble = parseInt(nVal);
    } else if(this.modal_obj.change_amount_type == "exchange_cycle") {
      remark_status["exchange_cycle"] = parseFloat(nVal);
      this.modal_obj.exchange_cycle = parseFloat(nVal);
    } else if(this.modal_obj.change_amount_type == "require_time") {
      remark_status["require_time"] = parseFloat(nVal);
      this.modal_obj.require_time = parseFloat(nVal);
    }
    if(this.remarkRef.current != undefined){
      this.remarkRef.current.testRemarkRender(remark_status);
    }
    if(this.patientModalRef.current != undefined){
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
    let data = {"is_reload_state": false};
    this.storeInjectionDataInCache(data);
  }

  insertInjectMedModal = (condition = true) =>{
    this.insertInjectMed(this.m_medicine, this.m_indexOfInsertPres, this.m_indexOfInsertMed, condition);
  }

  handleAlertOk = () => {
    this.modal_obj.check_alert_messages = "";
    if(this.patientModalRef.current != undefined){
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
    let cacheState = karteApi.getSubVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.INJECTION_EDIT, this.m_cacheSerialNumber);
    // 1. check has medicine info
    if (cacheState != undefined &&
      cacheState != null &&
      cacheState[0] != undefined &&
      cacheState[0].injectData.length > 0) {
            
      let strMessage = "";
      cacheState[0].injectData.map((item, index) => {
        if (item != undefined && item != null) {  
          if (index == 0 && item.usageName == "") {
            strMessage = "手技を選択して下さい。";
          }                  
          // ●YJ698 注射に、薬剤なし登録できる手技を作れるように
          let usage_allow_no_medicine = null;
          usage_allow_no_medicine = getInjectionUsageInfo(item.usage, "allow_registration_of_no_medicine");

          if (usage_allow_no_medicine != 1 && item.usageName != "") {
            if (item.medicines[0].medicineName == "") {
              strMessage = "Rp" + (index + 1) + "の薬剤を入力して下さい。";            
            }    
          }        
        }
      });

      if (strMessage != "") {
        // let strMessage = "薬剤を入力して下さい。";
        this.modal_obj.check_alert_messages = strMessage;
        if(this.patientModalRef.current != undefined){
          this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
        }
        return;
      }
    }
    // 2. check the others
    if (cacheState != undefined && cacheState != null && cacheState[0] != undefined && cacheState[0] != null) {
      let type = cacheState[0].isUpdate == 1 ? Karte_Types.Update : Karte_Types.Register;
      if(this.checkInjectDataFromInjection(cacheState[0].injectData, type) != true)
        return;
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
    let _existInjectData = 0;
    this.state.injectData.filter(item=>{
      if (item.usageName != "") {
        _existInjectData = 1;
      }
    });

    // check only exist delete cache
    if (_existInjectData == 0) {

      // check deleted of medicine history
      let _existDelData = 0;
      let cache_del_injection = karteApi.getVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.INJECTION_DELETE);
      if (cache_del_injection != undefined && cache_del_injection != null && cache_del_injection.length > 0) {
        cache_del_injection.filter(item=>{
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
      if(cacheState[0].karte_status_code == 1 && this.modal_obj.inOut == 4){                
        let period_date = this.getAdministratePeriodInfo(cacheState[0].injectData);
        if (period_date != undefined && 
          period_date != null && 
          period_date.min_date != undefined && 
          period_date.min_date != null && 
          period_date.max_date != undefined && 
          period_date.max_date != null && 
          period_date.max_date != period_date.max_date) {
          
          this.modal_obj.complete_message = "処理中";
          if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
            this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
          }
          let hasPeriodDuplicatePrescription = await this.checkPeriodDuplicatePrescription(period_date.min_date, period_date.max_date, cacheState[0].injectData, cacheState[0].isUpdate, cacheState[0].number);
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
    }

    if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
      this.patientModalRef.current.setModalVisible(true, "InjectionConfirmModal", this.state.injectData);
    }
  }

  // YJ368 定期処方・定期注射の登録時、期間が重なる場合は警告を表示するように
  // if check medicine duplicate modal, open confirmmodal
  handleMedicinePeriodDuplicateModal = () => {
    this.modal_obj.isMedicinePeriodDuplicateOpen = false;
    this.modal_obj.medicinePeriodDuplicateList = [];
    if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);          
      this.patientModalRef.current.setModalVisible(true, "InjectionConfirmModal", this.state.injectData);
    } 
  }

  // get min and max date of administratePeriod
  getAdministratePeriodInfo = (_injectData) => {
    let min_date = null;
    let max_date = null;
    _injectData.map(item=>{
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
      type: "injection",
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

      window.sessionStorage.removeItem("injection_before");
      this.props.history.replace(`/patients/${this.props.match.params.id}/soap`);
    } else {
      this.modal_obj.isDeletePrescriptionConfirmModal = true;
      if (this.patientModalRef.current != null && this.patientModalRef.current != undefined){
        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      }
    }
  }

  getPatientKarteInfo = () => {
    let current_system_patient_id = localApi.getValue("current_system_patient_id");
    current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
    let patient_data = karteApi.getVal(current_system_patient_id, CACHE_LOCALNAMES.PATIENT_INFORMATION);
    if(patient_data != undefined && patient_data != null){
      return patient_data.karte_status;      
    }
    return null;
  }

  deletePrescriptionCancel = () => {
    this.modal_obj.isDeletePrescriptionConfirmModal = false;
    this.modal_obj.isEditInjectionAfterDeleteModal = false;
    if(this.patientModalRef.current != undefined){
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  }

  deletePrescriptionConfirm = () => {
    // ■1016-1 右カラムに表示している保存前の処方・注射を編集できるように
    let injection_before = JSON.parse(window.sessionStorage.getItem('injection_before'));
    window.sessionStorage.removeItem("injection_before");
    if (injection_before != undefined &&
      injection_before != null &&
      injection_before[0] != undefined &&
      injection_before[0] != null &&
      injection_before[0].system_patient_id == parseInt(this.props.match.params.id)) {
      karteApi.setSubVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.INJECTION_EDIT, this.m_cacheSerialNumber, JSON.stringify(injection_before));
    } else {
      karteApi.delSubVal(this.props.match.params.id, CACHE_LOCALNAMES.INJECTION_EDIT, this.m_cacheSerialNumber);
    }
    this.modal_obj.isDeletePrescriptionConfirmModal = false;
    if(this.patientModalRef.current != undefined){
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }

    // cancel deleted of injection history
    let cache_del_injection = karteApi.getVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.INJECTION_DELETE);
    if (cache_del_injection != undefined && cache_del_injection != null && cache_del_injection.length > 0) {
      karteApi.delCachePrescriptionByCacheNumber(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.INJECTION_DELETE, CACHE_LOCALNAMES.INJECTION_DELETE_HISTORY, this.m_cacheSerialNumber);
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

  prescriptionConfirmOk = () => {
    this.modal_obj.isOpenPrescriptionConfirmModal = false;
    if(this.patientModalRef.current != undefined){
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
    this.modal_obj.canConfirm = 2;
    if(this.confirmButtonRef.current != undefined){
      this.confirmButtonRef.current.testConfirmRender(this.modal_obj.canConfirm);
    }
    let storeData ={"is_reload_state": false,"temp_saved":1, "canConfirm":2};
    this.storeInjectionDataInCache(storeData);

    // 処方と注射の編集時の入外区分について
    //  ・処方や注射を「編集」で開いた際
    //  ・現在入院中かどうかなどは関係なく、編集しようとしているレコードの区分を選択。
    let patientKarteInfo = this.getPatientKarteInfo();
    if (patientKarteInfo != undefined && patientKarteInfo != null && patientKarteInfo.code != undefined) {
      if (parseInt(this.context.karte_status.code) != parseInt(patientKarteInfo.code)) {
        this.context.$updateKarteStatus(patientKarteInfo.code, patientKarteInfo.name);
      }
    }
    // this.props.history.replace(`/patients/${this.props.match.params.id}/soap`);
    handleDocumentHref("patients/"+this.props.match.params.id+"/soap");
  }

  editOrdersFun = (prescription, is_done = false) => {
    // check exist input or edit prescription
    let cacheState = karteApi.getSubVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.INJECTION_EDIT, this.m_cacheSerialNumber);
    if (cacheState != undefined && cacheState != null) {
      this.modal_obj.isEditInjectionAfterDeleteModal = true;
      if(this.patientModalRef.current != undefined){
        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      }
      this.temp_injection = prescription;
      this.temp_is_done = is_done;
      return;
    }
    // when load first in injection, click edit, for apply inject data.
    if (this.tempInjectData == undefined) this.tempInjectData = [];
    this.editInjectOrders(prescription, is_done);
    if(is_done){
      this.makeDoneEditdata(prescription);
    }
  }
  
  makeDoneEditdata=(injection)=>{
    //----------実施入力----------//
    let order_datas = injection.order_data.order_data.map(data => {
      return {
        order_number: data.order_number, // ※該当する区切りのオーダー番号
        order_number_serial: data.order_number_serial
      };
    });
    const postData = [
      {
        number: injection.number,
        system_patient_id: this.props.match.params.id, //HARUKA患者番号
        order_data: order_datas,
        department_code: 1,
        is_done : 1,
      }
    ];
    let { cacheDoneInjectState } = persistedState(this.props.match.params.id);
    if (!cacheDoneInjectState) {
      cacheDoneInjectState = [];
    }
    cacheDoneInjectState = cacheDoneInjectState.filter(data => {
      return data.number !== injection.number;
    });
    cacheDoneInjectState.push(postData[0]);
    karteApi.setVal(this.props.match.params.id, CACHE_LOCALNAMES.INJECTION_DONE, JSON.stringify(cacheDoneInjectState));
    this.getDoneInjectData(postData);
  }

  editInjectionAfterDelConfirm = () => {
    this.cacheDelete();
    if (this.temp_injection != null && this.temp_is_done != null) {
      this.editInjectOrders(this.temp_injection, this.temp_is_done);
      if(this.temp_is_done){
        this.makeDoneEditdata(this.temp_injection);
      }
    }
    this.modal_obj.isEditInjectionAfterDeleteModal = false;
    if(this.patientModalRef.current != undefined){
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
    this.temp_injection = null;
    this.temp_is_done = null;
  }

  onResizeEnd = (val) => {
    let cache_tree_width = karteApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.TREE_WIDTH);
    cache_tree_width.injection.left.size = val[0].size;
    cache_tree_width.prescription.left.size = val[0].size;
    cache_tree_width.inspection.left.size = val[0].size;
    cache_tree_width.soap.left.size = val[0].size;
    karteApi.setVal(this.props.match.params.id, CACHE_LOCALNAMES.TREE_WIDTH, JSON.stringify(cache_tree_width));
  }

  initInjectData = () => {
    this.confirmOk("init");
    for (var key in window.localStorage) {
      if (key.includes("inject_keyword_")) {
        window.localStorage.removeItem(key);
      }
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
    // cancel deleted of injection history
    let cache_del_injection = karteApi.getVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.INJECTION_DELETE);
    if (cache_del_injection != undefined && cache_del_injection != null && cache_del_injection.length > 0) {
      karteApi.delCachePrescriptionByCacheNumber(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.INJECTION_DELETE, CACHE_LOCALNAMES.INJECTION_DELETE_HISTORY, this.m_cacheSerialNumber);
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

  // 投与期間入力
  saveAdministratePeriod = (_value) => {
    let originalNumber = this.state.injectData;
    originalNumber[this.modal_obj.indexOfEditPres].administrate_period = _value;

    this.modal_obj.isAdministratePeriodOpen = false;
    this.modal_obj.indexOfEditPres = -1;
    let data = {};
    data['injectData'] = originalNumber;
    this.storeInjectionDataInCache(data);

    this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
  }

  // Calc modal's cancel(or bodyParts modal's cancel) => return before usage of prescription
  setBeforeUsage = (_usage = null, _index = null, _from=null) => {
    if (_index != null && _index != undefined && _usage != null && _usage != undefined) {
      let usageData = _usage[_index];
      let _injectData = this.state.injectData;
      if (_injectData[_index] != undefined && _injectData[_index] != null) {
        _injectData[_index] = usageData;
      }
      // ●YA67 空の薬品欄のEnterで用法選択操作をして途中キャンセル時の挙動の修正
      if (_from == "bodyParts") {
        let result = _injectData;
        if (_injectData.length > 1 &&
          _injectData[_injectData.length - 1] != undefined &&
          _injectData[_injectData.length - 1].medicines[0].medicineName == "" &&
          _injectData[_injectData.length - 2] != undefined &&
          _injectData[_injectData.length - 2].usageName == "") {
          // remove last rp (no need)
          result = _injectData.splice(0, _injectData.length - 1);
        }
        _injectData = result;
      }
      let data = {};
      data['injectData'] = _injectData;
      data['is_reload_state'] = false;
      this.storeInjectionDataInCache(data);
    }

  }

  contextTitleTabsMenuAction = (act, tab_id, title ) => {
    this.modal_obj.periodSettingPrintModal = true;        
    this.modal_obj.periodSettingPrintTabId = tab_id;        
    this.modal_obj.periodSettingPrintTitle = title; 
    if (title == "よく使う薬剤") {
      this.modal_obj.prescriptionRankData = this.state.medicineRankData; 
    } else if(title == "注射履歴") {

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

      this.modal_obj.medicineHistoryData = this.state.injectionHistory; 
    }       
    if (this.patientModalRef.current != null && this.patientModalRef.current != undefined) {
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  }

  render() {    
    const { indexOfInsertPres, indexOfInsertMed, injectData } = this.state;
    const indexPres =
      indexOfInsertPres === -1 || indexOfInsertPres >= injectData.length
        ? injectData.length - 1
        : indexOfInsertPres;
    var indexMed =
      indexOfInsertMed === -1 ||
      indexOfInsertMed >= injectData[indexPres].medicines.length
        ? injectData[indexPres].medicines.length - 1
        : indexOfInsertMed;
    var units = [];
    const tabs = [
      {
        id: 0,
        title: "注射履歴"
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
    if (injectData[indexPres].medicines[indexMed] == undefined) {
      indexMed = injectData[indexPres].medicines.length - 1;
    }
    if (injectData[indexPres].medicines[indexMed].main_unit === undefined) {
      if (
        injectData[indexPres].medicines[indexMed].units_list !== undefined &&
        injectData[indexPres].medicines[indexMed].units_list.length > 0
      ) {
        units = injectData[indexPres].medicines[indexMed].units_list;
      } else {
        units = [
          {
            name: injectData[indexPres].medicines[indexMed].unit,
            main_unit_flag: 0
          }
        ];
      }
    } else {
      units = injectData[indexPres].medicines[indexMed].units;
    }
    // if change department code
    if (this.context.department.code != 0 && (this.m_department_code != this.context.department.code) && (this.props.match.params.id > 0)) {
      if (this.first_load_page == 1) {
        this.showTreePrescription("first_load");
      } else {
        this.showTreePrescription();
      }
      this.first_load_page = 0;      
    }
    // if change karte status
    if (this.m_karte_status_code !== this.context.karte_status.code && this.props.match.params.id > 0) {
      this.m_karte_status_code = this.context.karte_status.code;
      if (this.first_load_page == 1) {
        this.showTreePrescription("first_load");
      } else {
        this.showTreePrescription();
      }
      this.getAdditions();
    }
    let indexUsage = this.modal_obj.indexOfEditPres == -1 ? this.state.injectData.length - 1 : this.modal_obj.indexOfEditPres;
    // injectionの左ツリー width setting
    let tree_width = [
      {size: 350, minSize:180, maxSize:400, resize: "dynamic"},
      {minSize:600, resize: "stretch"}
    ];
    let cache_tree_width = karteApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.TREE_WIDTH);
    if (cache_tree_width != undefined && cache_tree_width != null && cache_tree_width.injection != undefined && cache_tree_width.injection != null) {
      tree_width = [
        cache_tree_width.injection.left,
        cache_tree_width.injection.right
      ]
    }
    let enable_function_item = 0;
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    if(initState !== undefined && initState != null && initState.conf_data !== undefined){
      if(initState.conf_data.enable_function_item !== undefined && initState.conf_data.enable_function_item == "ON"){
        enable_function_item = 1;
      }
    }
    let title_info = this.getInjectionOrderTitle();

    return (
      <>
        <InjectionWrapper>
          <PanelGroup borderColor="#DDD" spacing={2}
                      panelWidths={tree_width}
                      onResizeEnd={this.onResizeEnd}
          >
            <InjectionTree
              ref={this.injectionTreeRef}
              soapTrees={this.state.soapTrees}
              changeSoapList={this.getHistoryDataByTree}
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
            <InjectionMain>
              <Col id="injection-div-history">
                <div className="d-flex status-select">
                  <TitleTabs
                    tabs={tabs}
                    selectTitleTab={this.selectTitleTab}
                    id={this.state.titleTab}
                    tabType={"injection"}
                    contextMenuAction={this.contextTitleTabsMenuAction}
                  />
                  {this.context.karte_status.code == 0 && (
                    <Button id="only-outpatient" className={`${this.state.isLoaded == true ? "":"btn-disable"} ${this.state.select_outpatient == true ? "selected":"no-selected"}`} onClick={this.selectKarteOutPatientStatus}>外来のみ</Button>
                  )}
                  {this.context.karte_status.code == 2 && (
                    <Button id="only-home" className={`${this.state.isLoaded == true ? "":"btn-disable"} ${this.state.select_home == true ? "selected":"no-selected"}`} onClick={this.selectKarteHomeStatus}>在宅のみ</Button>
                  )}
                </div>
                {this.state.titleTab == 0 && (
                  <InjectionSelection
                    ref={this.medicineSelectionRef}
                    isLoaded={this.state.isLoaded}
                    copyOrder={this.copyOrderInjection}
                    copyOrders={this.copyOrdersInjection}
                    stopPeriodRp={this.stopPeriodRpInjection}
                    stopPeriodOrder={this.stopPeriodOrderInjection}
                    stopPeriodInjectionCategory={this.handleStopPeriodInjectionCategory}
                    printOrders={this.printInjectionOrders}
                    injectionHistory={this.state.injectionHistory}
                    patientId={this.props.match.params.id}
                    patientInfo={this.state.patientInfo}
                    registerSet={this.registerSet}
                    doctors={this.state.doctors}
                    editOrders={this.editOrdersFun}
                    setDoctorInfo={this.setDoctorInfo}
                    changeDepartment={this.changeDepartment}
                    getDelData={this.getDelInjectData}
                    openNotConsentedModal={this.openNotConsentedModal}
                    openSomeCompletedCancel={this.openSomeCompletedCancel}
                    match={this.props.match}
                    scrollAddInjectionHistoryData={this.scrollAddInjectionHistoryData}
                    setInjectionHistory={this.setInjectionHistory.bind(this)}
                    initInjectData={this.initInjectData}
                    cacheSerialNumber={this.m_cacheSerialNumber}
                  />
                )}
                {this.state.titleTab == 1 && (
                  <InjectionRankSelection
                    ref={this.medicineRankSelectionRef}
                    isLoaded={this.state.isLoaded}
                    isLoadedRank={this.state.isLoaded_rank}
                    medicineRankData={this.state.medicineRankData}
                    allPrescriptionOpen={this.state.allPrescriptionOpen}
                  />
                )}
                {this.state.titleTab == 2 && (
                  <InjectionSetSelection
                    ref={this.medicineSetSelectionRef}
                    isLoaded={this.state.isLoaded}
                    patientId={this.props.match.params.id}
                    allPrescriptionOpen={this.state.allPrescriptionOpen}
                    doctors={this.state.doctors}
                    doctor_code={this.context.selectedDoctor.code}
                    doctor_name={this.context.selectedDoctor.name}
                    setDoctorInfo={this.setDoctorInfo}
                    injectionHistory={this.state.injectionSetData}
                    consent={this.consent}
                  />
                )}
              </Col>
              <Col>
                <TitleHasMenu
                  ref={this.titleRef}
                  id="div-title"
                  title={title_info.title}
                  fnMouseDown={this.onClickTitle}
                  menuType={'injection'}
                  isForUpdate={this.state.isForUpdate}
                  patientId={this.props.match.params.id}
                  contextMenuAction={this.contextMenuAction}
                />
                <InjectionInOutNav
                  ref={this.injectionInOutRef}
                  selectInOut={this.selectInOut}
                  setScheduleDate={this.setScheduleDate}
                  id={this.modal_obj.inOut}
                  unusedDrugSearch={this.state.unusedDrugSearch}
                  profesSearch={this.firstLogin == true ? this.injection_pro_search : this.state.profesSearch}
                  normalNameSearch={this.state.normalNameSearch}
                  schedule_date={this.modal_obj.schedule_date}
                  getRadio={this.getInjectRadio}
                  patientId={this.props.match.params.id}
                  cacheSerialNumber={this.m_cacheSerialNumber}
                />
                <WrapperContainer
                  id="prescribe-container"
                  onDrop={e => this.onDropEvent(e)}
                  onDragOver={e => this.onDragOver(e)}
                >
                  <InjectionTable
                    ref={this.prescribeTableRef}
                    isLoaded={this.state.isLoaded}                    
                    injectData={this.state.injectData}
                    onSelectUsage={this.onSelectUsage}
                    onSelectInjectUsage={this.onSelectInjectUsage}
                    changeAmountOrDays={this.changeInjectAmountOrDays}
                    unusedDrugSearch={this.state.unusedDrugSearch}
                    profesSearch={this.state.profesSearch}
                    normalNameSearch={this.state.normalNameSearch}
                    setDoctorInfo={this.setDoctorInfo}
                    doctors={this.state.doctors}
                    doctor_code={this.context.selectedDoctor.code}
                    doctor_name={this.context.selectedDoctor.name}
                    storeDataInCache={this.storeInjectionDataInCache}
                    insertMed={this.handleInsertInjection}
                    openBodyParts={this.openBodyParts}
                    openAdministratePeriodInputModal={this.openAdministratePeriodInputModal}
                    resetPresData={this.resetInjectData}
                    bodyPartData={this.modal_obj.bodyPartData}
                    usageInjectData={this.modal_obj.usageInjectData}
                    selectDoctorFromModal={this.selectInjectDoctorFromModal}
                    patientInfo={this.state.patientInfo}
                    patientId={this.props.match.params.id}
                    isForUpdate={this.state.isForUpdate}
                    checkPermissionByType={this.checkPermissionByType}
                    cacheSerialNumber={this.m_cacheSerialNumber}
                    stopLoadingFlag={this.state.stop_prescribe_table_load}
                  />
                  {(this.isExistItemDetail() == true || (enable_function_item === 1)) && (
                    <div className={'set-detail-area'}>
                      <div className={"d-flex"} style={{width:80,cursor:"pointer"}} onClick={this.onAngleClick} >
                        <Title title="品名" />
                        <Angle className={`item-detai-label angle ${this.m_show_detail_flag == 1 ? "close-table": ""}`} icon={faAngleDown} />
                      </div>
                      <div id="item_detail" className={this.m_show_detail_flag == 0 ? "no-visible" : ""}>
                        <ItemPrescriptionTableBody
                          ref={this.itemPrescriptionRef}
                          function_id={FUNCTION_ID_CATEGORY.INJECTION}
                          item_details={this.modal_obj.item_details}
                          setItemDetails={this.setItemDetails.bind(this)}
                        />
                      </div>
                    </div>
                  )}
                  <Title title="備考・その他" />
                  <InjectionRemarks
                    ref={this.remarkRef}
                    getFreeComment={this.getFreeComment}
                    changeConditionAmount={this.changeConditionAmount}
                    getImplementLocation={this.getImplementLocation}
                    getAdditionsCheck={this.getAdditionsCheck}
                    freeComment={this.modal_obj.free_comment}
                    dripRate={this.modal_obj.drip_rate}
                    locationId={this.modal_obj.location_id}
                    waterBubble={this.modal_obj.water_bubble}
                    exchangeCycle={this.modal_obj.exchange_cycle}
                    requireTime={this.modal_obj.require_time}
                    additions={this.state.additions}
                    patientId={this.props.match.params.id}
                    implementLocationArray={this.modal_obj.implement_location}
                    cacheSerialNumber={this.m_cacheSerialNumber}
                  />
                </WrapperContainer>
                <InjectionAllModal
                  ref={this.patientModalRef}
                  amountInjectConfirm={this.amountInjectConfirm}
                  setBeforeUsage={this.setBeforeUsage}
                  amountInjectCancel={this.amountInjectCancel}
                  bodyPartInjectConfirm={this.bodyPartInjectConfirm}
                  saveAdministratePeriod={this.saveAdministratePeriod}
                  daysInjectConfirm={this.daysInjectConfirm}
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
                  diagnosisOrderCancel={this.diagnosisOrderCancel}
                  diagnosisOrderOK={this.diagnosisOrderOK}
                  patientId={this.props.match.params.id}
                  units={units}
                  props_state={this.state}
                  modal_obj={this.modal_obj}
                  setModalObj={this.setModalObj}
                  dropRun={this.dropRun}
                  insertInjectMedModal={this.insertInjectMedModal}
                  getInjectUsage={this.getInjectUsage}
                  getInjectionUsage={this.getInjectionUsage}
                  getUsageInjectFromModal={this.getUsageInjectFromModal}
                  getInjectionUsageFromModal={this.getInjectionUsageFromModal}
                  indexUsage={indexUsage}
                  selectInjectDoctorFromModal={this.selectInjectDoctorFromModal}
                  getDoctorModal={this.getDoctorModal}
                  closeDoctorModal={this.closeDoctorModal}
                  changeConditionAmountConfirm={this.changeConditionAmountConfirm}
                  prescriptionConfirmOk={this.prescriptionConfirmOk}
                  deletePrescriptionCancel={this.deletePrescriptionCancel}
                  deletePrescriptionConfirm={this.deletePrescriptionConfirm}
                  editInjectionAfterDelConfirm={this.editInjectionAfterDelConfirm}
                  handleAlertOk={this.handleAlertOk}
                  patientInfo={this.state.patientInfo}
                  refreshNotConsented={this.refreshNotConsented}
                  handleSomeCompletedCancel={this.handleSomeCompletedCancel}
                  confirmDeletedData={this.confirmDeletedData}
                  confirmDeletedCancelData={this.confirmDeletedCancelData}
                  handleMedicinePeriodDuplicateModal={this.handleMedicinePeriodDuplicateModal}
                />
                <PrescriptionConfirmButton
                  ref={this.confirmButtonRef}
                  canConfirm={this.modal_obj.canConfirm}
                  confirmPrescription={this.confirmPrescription}
                  deletePrescriptionFun={this.deletePrescriptionFun}
                  cacheSerialNumber={this.m_cacheSerialNumber}
                  patientId={this.props.match.params.id}
                  is_injection={1}
                />
              </Col>
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

            </InjectionMain>
          </PanelGroup>
        </InjectionWrapper>
        {/*{this.state.isNotConsentedModalOpen === true &&
          this.state.staff_category === 1 && (
            <NotConsentedInjectionModal
              patientId={this.props.match.params.id}
              refresh={this.refreshNotConsented.bind(this)}
              closeNotConsentedModal={this.closeNotConsentedModal}
              fromPatient={false}
            />
          )}*/}
        {/*{this.state.confirm_message !== undefined && this.state.confirm_message !== "" && this.state.confirm_type !== "" && (
            <SystemConfirmModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.confirmOk.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}*/}
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
          categoryOperation={this.state.categoryOperation}
        />

      </>
    );
  }
}
Injection.contextType = Context;

Injection.propTypes = {
  patientInfo: PropTypes.object.isRequired,
  patientId: PropTypes.number.isRequired,
  
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.node
    }).isRequired
  }).isRequired,
  history: PropTypes.object
};

export default Injection;
