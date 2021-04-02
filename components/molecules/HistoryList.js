import React, { Component, useContext } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import styled from "styled-components";
// import HistoryUl from "./HistoryUl";
import SameOptionsNew from "./SameOptionsNew";
import Context from "~/helpers/configureStore";
import DiscontinuationModal from "../templates/Patient/components/DiscontinuationModal";
import SelectDoctorModal from "../templates/Patient/components/SelectDoctorModal";
import $ from "jquery";
import { formatDate, getCurrentDate, getWeekNamesBySymbol } from "~/helpers/date";
import { persistedState } from "../../helpers/cache";
import SystemConfirmModal from "./SystemConfirmModal";
import {CACHE_LOCALNAMES, CACHE_SESSIONNAMES, getDoctorName, KARTEMODE} from "~/helpers/constants";
import * as localApi from "~/helpers/cacheLocal-utils";
import * as karteApi from "~/helpers/cacheKarte-utils";
import {formatJapanDateSlash} from "~/helpers/date";
import PrescriptionDoneModal from "~/components/organisms/PrescriptionDoneModal";
import DeleteOperationConfirmModal from "~/components/molecules/DeleteOperationConfirmModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";

const Wrapper = styled.div`
  ul{
    margin-bottom: 0px;
  }
`;

const ContextMenuUl = styled.ul`
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
      padding: 0.15rem 0.75rem;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
`;

const textAlignRight = {
  textAlign: "right"
};

const underLine = {
  textDecorationLine: "underline"
};

const DrugItem = styled.div`
  .full-width {
    width: 100%;
  }
  .option {
    text-align: right;
  }
  .options {
    float: right;
  }
`;

const ContextMenu = ({
                       visible,
                       x,
                       y,
                       preset_do_deployment,
                       parent,
                       doctor_code,
                       staff_category,
                       isFromPrescriptionList,
                       is_receipt_archive_data,
                       is_doctor_consented,
                       done_order,
                       is_enabled,
                       exist_del_cache,
                       current_date,
                       order,
                       medicine
                     }) => {
  const { $canDoAction, FEATURES, AUTHS, karteMode} = useContext(Context);
  if (visible) {
    // RP1つの時は、右クリックメニューからRP単位の削除を非表示にして、処方箋単位/オーダー単位の削除だけにする
    let rp_count = parent.props.order_data.order_data.length;
    
    let curDate = new Date(current_date);
    let start_date = new Date(order.start_date.substring(0, 4)+"-"+order.start_date.substring(4, 6)+"-"+order.start_date.substring(6, 8));
    // check edit
    let canEdit = false;
    if (start_date >= curDate) {
      if ($canDoAction(FEATURES.PRESCRIPTION, AUTHS.EDIT) || $canDoAction(FEATURES.PRESCRIPTION, AUTHS.EDIT_PROXY)) {
        canEdit = true;
      }
    } else {
      if ($canDoAction(FEATURES.PRESCRIPTION, AUTHS.EDIT_OLD) || $canDoAction(FEATURES.PRESCRIPTION, AUTHS.EDIT_PROXY_OLD)) {
        canEdit = true;
      }
    }
    
    let treat_date = null;
    parent.props.medicineHistory.map(ele=>{
      if (medicine.number == ele.number) {
        treat_date = ele.treat_date;
      }
    });
    
    // check delete
    let canDelete = false;
    // ①「当日未受付の削除」「当日未受付の削除（代理）」
    if (start_date.getTime() == curDate.getTime() && done_order == 0 && ($canDoAction(FEATURES.PRESCRIPTION, AUTHS.DELETE_TODAY_NOT_ACCEPT) || $canDoAction(FEATURES.PRESCRIPTION, AUTHS.DELETE_TODAY_NOT_ACCEPT_PROXY)) && is_doctor_consented !== 4) {
      // console.log("00");
      canDelete = true;
    }
    // ②「当日実施済みの削除」「当日実施済みの削除（代理）」
    // ・オーダー登録日時が現在日付なら、状態が進んでいるレコードでも削除可能
    if (start_date.getTime() == curDate.getTime() && done_order == 1 && ($canDoAction(FEATURES.PRESCRIPTION, AUTHS.DELETE_TODAY_DONE) || $canDoAction(FEATURES.PRESCRIPTION, AUTHS.DELETE_TODAY_DONE_PROXY)) && is_doctor_consented !== 4) {
      // console.log("01");
      canDelete = true;
    }
    // ・オーダー登録が過去でも、実施した日時が現在日付のレコードは削除可能
    if(done_order == 1 && treat_date != null && treat_date != undefined && treat_date != "") treat_date = new Date(treat_date.substring(0,10));
    
    if (start_date.getTime() < curDate.getTime() && treat_date != null && treat_date != undefined && treat_date != "" && treat_date.getTime() == curDate.getTime() && done_order == 1 && ($canDoAction(FEATURES.PRESCRIPTION, AUTHS.DELETE_TODAY_DONE) || $canDoAction(FEATURES.PRESCRIPTION, AUTHS.DELETE_TODAY_DONE_PROXY)) && is_doctor_consented !== 4) {
      // console.log("02");
      canDelete = true;
    }
    // ③「過去実施済みの削除」「過去実施済みの削除（代理）」
    if (start_date.getTime() < curDate.getTime() && ($canDoAction(FEATURES.PRESCRIPTION, AUTHS.DELETE_PAST_DONE) || $canDoAction(FEATURES.PRESCRIPTION, AUTHS.DELETE_PAST_DONE_PROXY)) && is_doctor_consented !== 4) {
      // console.log("03");
      canDelete = true;
    }
    
    //処方Do展開
    let preset_menu_array = [];
    let preset_do_deployment_count = 0;
    if (preset_do_deployment !== undefined && preset_do_deployment != null){
      preset_do_deployment_count = preset_do_deployment.length;
    }
    if (preset_do_deployment_count !== 0) {
      if(preset_do_deployment_count === 1) {
        preset_menu_array.push("処方Do展開");
      }
      if(preset_do_deployment_count > 1) {
        for (let i=1; i<=preset_do_deployment_count; i++) {
          let menu_str = "処方Do" + "(" + i +")" + "展開";
          preset_menu_array.push(menu_str);
        }
      }
    }
    let isWrite = (karteMode == KARTEMODE.READ) ?  false: true;
    let cache_data = sessApi.getObject('prescription_consented_list');
    cache_data = cache_data.filter(x=>x.patient_id == parent.props.patientId);
    return (
      <ContextMenuUl>
        {isFromPrescriptionList ? (
          <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}/>
        ) : (
          <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
            {is_enabled == 2 || exist_del_cache == true ? (
              <>
                {(is_receipt_archive_data === undefined ||
                  (is_receipt_archive_data !== 1 &&
                    ($canDoAction(FEATURES.PRESCRIPTION, AUTHS.DELETE) ||
                      $canDoAction(FEATURES.PRESCRIPTION, AUTHS.DELETE_OLD) ||
                      $canDoAction(FEATURES.PRESCRIPTION, AUTHS.DELETE_PROXY) ||
                      $canDoAction(
                        FEATURES.PRESCRIPTION,
                        AUTHS.DELETE_PROXY_OLD
                      )))) && (
                  <>
                    {isWrite && exist_del_cache == true && (
                      <>
                        {rp_count > 1 && (
                          <li><div onClick={() => parent.contextMenuAction("cancelRecovery")}>削除取りやめ[Rp単位]</div></li>
                        )}
                        <li><div onClick={() => parent.contextMenuAction("cancelAllRecovery")}>削除取りやめ[処方箋]</div></li>
                      </>
                    )}
                  </>
                )}
              </>
            ):(
              <>
                {($canDoAction(FEATURES.PRESCRIPTION, AUTHS.REGISTER) ||
                  $canDoAction(FEATURES.PRESCRIPTION, AUTHS.REGISTER_OLD) ||
                  $canDoAction(FEATURES.PRESCRIPTION, AUTHS.REGISTER_PROXY) ||
                  $canDoAction(FEATURES.PRESCRIPTION, AUTHS.REGISTER_PROXY_OLD) ||
                  $canDoAction(FEATURES.PRESCRIPTION, AUTHS.EDIT) ||
                  $canDoAction(FEATURES.PRESCRIPTION, AUTHS.EDIT_OLD) ||
                  $canDoAction(FEATURES.PRESCRIPTION, AUTHS.EDIT_PROXY) ||
                  $canDoAction(FEATURES.PRESCRIPTION, AUTHS.EDIT_PROXY_OLD)) && (
                  <>
                    {isWrite && (
                      <>
                        {rp_count > 1 && (
                          <li><div onClick={() => parent.contextMenuAction("doRp")}>Do処方[Rp単位]</div></li>
                        )}
                        <li>
                          <div onClick={() => parent.contextMenuAction("doAll")}>
                            Do処方[処方箋]
                          </div>
                        </li>
                        {preset_menu_array.length > 0 && preset_menu_array.map((item,index)=>{
                          return (<li key={index}><div onClick={() =>parent.contextMenuAction("prescription_do_deployment:"+index)}>{item}</div></li>)
                        })}
                      </>
                    )}
                  </>
                )}
                {(is_receipt_archive_data === undefined || (is_receipt_archive_data !== 1 && canEdit)) && isWrite && (
                  <>
                    <li><div onClick={() => parent.contextMenuAction("edit")}>編集</div></li>
                  </>
                )}
                <li><div onClick={() => parent.contextMenuAction("print")}>印刷</div></li>
                { $canDoAction(FEATURES.PRESET, AUTHS.REGISTER) && (
                  <>
                    {isWrite && (
                      <li><div onClick={() => parent.contextMenuAction("registerSet")}>医師別セットとして登録</div></li>
                    )}
                  </>
                )}
                { $canDoAction(FEATURES.PRESET_PATIENT_PRESCRIPTION, AUTHS.REGISTER) && (
                  <li><div onClick={() => parent.contextMenuAction("registerPatientSet")}>患者別セットとして登録</div></li>
                )}
                {(is_receipt_archive_data === undefined || (is_receipt_archive_data !== 1 && canDelete)) && isWrite && !parent.props.isEdit && (
                  <>
                    {rp_count > 1 && (
                      <li><div onClick={() => parent.contextMenuAction("cancel")}>削除[Rp単位]</div></li>
                    )}
                    <li><div onClick={() => parent.contextMenuAction("cancelAll")}>削除[処方箋]</div></li>
                  </>
                )}
                {$canDoAction(FEATURES.PRESCRIPTION, AUTHS.DONE_OREDER) && is_doctor_consented !== 4 && done_order === 0 && (
                  <>
                    <li><div onClick={() => parent.contextMenuAction("done_order", medicine.number, medicine)}>実施</div></li>
                    <li><div onClick={() => parent.contextMenuAction("done_edit_order")}>実施入力</div></li>
                  </>
                )}
                {($canDoAction(FEATURES.PRESCRIPTION, AUTHS.STOP) ||$canDoAction(FEATURES.PRESCRIPTION, AUTHS.STOP_PROXY)) && is_doctor_consented !== 4 && done_order === 0 && isWrite && (
                  <li><div onClick={() => parent.contextMenuAction("stop_order")}>中止</div></li>
                )}
                {$canDoAction(FEATURES.PRESCRIPTION, AUTHS.CONFIRM) && parent.props.is_doctor_consented == 0 && parent.props.forNotConsentedCheckDoctorCode == doctor_code && staff_category == 1 && (
                  <li><div onClick={() => parent.contextMenuAction("consent")}>承認</div></li>
                )}
                {staff_category == 1 && cache_data.length > 0 && isWrite && (
                  <li><div onClick={() => parent.contextMenuAction("viewAllNotConsented")}>未承認履歴</div></li>
                )}
                {(is_receipt_archive_data === undefined || (is_receipt_archive_data !==1 && $canDoAction(FEATURES.PRESCRIPTION, AUTHS.RECEIPT))) && isWrite && (
                  <li><div onClick={() => parent.contextMenuAction("changeDepartment")}>診療科修正</div></li>
                )}
              </>
            )}
            {medicine != undefined && medicine.number != undefined &&  medicine.history !== "" && medicine.history.split(",").length > 1 && (
              <li><div onClick={() => parent.contextMenuAction("show_history", medicine.number)}>履歴表示</div></li>
            )}
          </ul>
        )}
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class HistoryList extends Component {
  constructor(props) {
    super(props);
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.state = {
      isEdit: false,
      order: this.props.order,
      days: this.props.order.days,
      days_suffix: this.props.order.days_suffix,
      one_dose_package: this.props.order.one_dose_package,
      temporary_medication: this.props.order.temporary_medication,
      insurance_type: this.props.order.insurance_type,
      body_part: this.props.order.body_part,
      usage: this.props.order.usage,
      usage_name: this.props.order.usage_name,
      contextMenu: {
        visible: false,
        x: 0,
        y: 0
      },
      isDiscontinuationOpen: false,
      isOpenDeleteConfirmModal: false,
      discontinuationIndex: -1,
      discontinuationPresData: [],
      isDoctorsOpen: false,
      selectedDoctorID: this.props.doctor_code,
      selectedDoctorName: this.props.doctor_name,
      currentUserName: authInfo.name,
      canEdit: authInfo.staff_category === 1,
      staff_category: authInfo.staff_category || 2,
      isBulkStop: false,
      hover: false,
      isOpenPrescriptionDoneModal: false,
      patientInfo: this.props.patientInfo,
      patientInfoObject: this.props.patientInfoObject,
      confirm_message: "",
      confirm_type: "",
      doctors: this.props.doctors,
      medicineHistory: this.props.medicineHistory,
      allOptions: [
        "milling",
        "can_generic_name",
        "is_not_generic",
        "one_dose_package",
        "temprary_dedicine",
        "insurance_type",
        "separate_packaging"
      ]
    };
    this.act_msg = "";
    this.i = 0;
    this.gray_rps = [];
    let prescription_gray_info = localApi.getObject("prescription_gray_info");
    if(prescription_gray_info != undefined && prescription_gray_info != null && prescription_gray_info.rp_numbers != undefined){
      this.gray_rps = prescription_gray_info.rp_numbers;
    }
  }
  
  checkCanEdit = flg => {
    let canEdit = 0;
    if (
      this.context.$canDoAction(
        this.context.FEATURES.PRESCRIPTION,
        this.context.AUTHS.STOP
      ) ||
      this.context.$canDoAction(
        this.context.FEATURES.PRESCRIPTION,
        this.context.AUTHS.STOP_OLD
      ) ||
      this.context.$canDoAction(
        this.context.FEATURES.PRESCRIPTION,
        this.context.AUTHS.DELETE
      ) ||
      this.context.$canDoAction(
        this.context.FEATURES.PRESCRIPTION,
        this.context.AUTHS.DELETE_OLD
      )
    ) {
      canEdit = 1;
    }
    if (
      this.context.$canDoAction(
        this.context.FEATURES.PRESCRIPTION,
        this.context.AUTHS.STOP_PROXY
      ) ||
      this.context.$canDoAction(
        this.context.FEATURES.PRESCRIPTION,
        this.context.AUTHS.STOP_PROXY_OLD
      ) ||
      this.context.$canDoAction(
        this.context.FEATURES.PRESCRIPTION,
        this.context.AUTHS.DELETE_PROXY
      ) ||
      this.context.$canDoAction(
        this.context.FEATURES.PRESCRIPTION,
        this.context.AUTHS.DELETE_PROXY_OLD
      )
    ) {
      canEdit = 2;
    }
    
    if (canEdit === 0) {
      window.sessionStorage.setItem("alert_messages", "権限がありません。");
      return;
    }
    
    if (canEdit === 2 && this.context.selectedDoctor.code <= 0) {
      this.setState({
        isBulkStop: flg
      });
      this.context.$selectDoctor(true);
      return false;
    }
    this.setState({
      isBulkStop: flg
    });
    return true;
  };
  
  closeDoctorModal = () => {
    this.setState({isDoctorsOpen: false});
  };
  
  getDoctorModal = e => {
    this.department_id = e.target.id;
    this.department_label = e.target.getAttribute("label");
    this.setState({
      isDoctorsOpen: false
    },()=>{
      if (this.act_msg != "") {
        this.doContextMenuAction(this.act_msg);
      }
    });
  };
  
  selectDoctorFromModal = (id, name) => {
    this.setState({
      selectedDoctorID: id,
      selectedDoctorName: name,
      canEdit: true,
      isDoctorsOpen: false
    },function() {
      if (this.state.isBulkStop) {
        this.stopOrders();
      } else {
        this.stopOrder();
      }
    });
  };
  
  closeDiscontinuation = () => {
    this.setState({
      isDiscontinuationOpen: false,
      discontinuationIndex: -1,
      discontinuationPresData: [],
      canEdit: this.state.staff_category === 1,
      isBulkStop: false
    });
  };
  
  setDiscontinuation = presData => {
    this.setState({
      isDiscontinuationOpen: false,
      discontinuationPresData: [],
      discontinuationIndex: -1
    });
    
    this.props.order_data.order_data = presData;
    
    this.setState({
      canEdit: this.state.staff_category === 1,
      isBulkStop: false
    });
    
    if (this.state.selectedDoctorID > 0 && this.props.doctor_code !== this.state.selectedDoctorID) {
      this.props.setDoctorInfo(
        this.state.selectedDoctorID,
        this.state.selectedDoctorName
      );
    }
  };
  
  createOrderData = () => {
    return this.props.order_data.order_data.map(pres => {
      let usageRemarksList = [];
      if (Array.isArray(pres.usage_remarks_comment)) {
        usageRemarksList = pres.usage_remarks_comment;
      } else {
        usageRemarksList.push(pres.usage_remarks_comment);
      }
      let ord = {
        medical_business_diagnosing_type: pres.medical_business_diagnosing_type,
        med_consult: pres.med_consult,
        supply_med_info: pres.supply_med_info,
        one_dose_package: pres.one_dose_package,
        temporary_medication: pres.temporary_medication,
        mixture:pres.mixture,
        usage: pres.usage,
        usage_name: pres.usageName,
        days: pres.days,
        days_suffix: pres.days_suffix,
        start_date: pres.start_date, // 20190307,
        insurance_type: pres.insurance_type,
        body_part: pres.body_part,
        usage_remarks_comment: usageRemarksList,
        discontinuation_start_date: pres.discontinuation_start_date,
        discontinuation_end_date: pres.discontinuation_end_date,
        discontinuation_comment: pres.discontinuation_comment,
        doctor_code: pres.doctor_code,
        doctor_name: pres.doctor_name
      };
      ord["update_mode"] = "update";
      ord["order_number"] = pres.order_number;
      ord["order_number_serial"] = pres.order_number_serial;
      
      return ord;
    });
  };
  
  contextMenuAction = (act, medicine_number=null, medicine=null) => {
    if (act != "show_history") {
      let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
        let act_info = {
          act: act,
          type:"rightClickHistoryList"
        };
        localApi.setValue(CACHE_LOCALNAMES.ACT_TEMP_DATA, JSON.stringify(act_info));
        this.act_msg = act;
        this.setState({isDoctorsOpen: true});
        return;
      }
    }
    this.doContextMenuAction(act, medicine_number, medicine);
  };
  
  doContextMenuAction = (act, medicine_number = null, medicine=null) => {
    this.act_msg = "";
    if (act === "doRp") {
      this.onCopyOrder();
    } else if (act === "doAll") {
      this.onCopyOrders();
    } else if (act.split(":")[0] === "prescription_do_deployment") {
      this.onCopyOrders(act.split(":")[1]);
    } else if (act === "edit") {
      this.setState({
        confirm_message: "処方歴を編集しますか？",
        confirm_type: "_edit"
      });
    } else if (act === "print") {
      this.setState({
        confirm_message: "印刷してよろしいですか？",
        confirm_type: "_print"
      });
    } else if (act === "registerSet") {
      this.onRegisterSet();
    } else if (act === "registerPatientSet") {
      this.onRegisterPatientSet();
    } else if (act === "cancel") {
      // 処方・注射画面からの削除の動線の整理・修正(1)
      // (A) 処方/注射画面で入力・編集中は、破棄しないと削除を追加できないように。
      // check input or edit data exist?
      if (karteApi.existInputOrEditData(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.props.cacheSerialNumber)) {
        this.setState({
          isOpenDeleteConfirmModal: true,
          confirm_type: "_delRp"
        });
      } else {
        this.setState({
          confirm_message: "削除しますか？",
          confirm_type: "_delRp"
        });
      }
    } else if (act === "cancelAll") {
      // 処方・注射画面からの削除の動線の整理・修正(1)
      // (A) 処方/注射画面で入力・編集中は、破棄しないと削除を追加できないように。
      // check input or edit data exist?
      if (karteApi.existInputOrEditData(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.props.cacheSerialNumber)) {
        this.setState({
          isOpenDeleteConfirmModal: true,
          confirm_type: "_delAll"
        });
      } else {
        this.setState({
          confirm_message: "削除しますか？",
          confirm_type: "_delAll"
        });
      }
    } else if (act === "cancelRecovery") {
      this.setState({
        confirm_message: "処方[Rp単位]の削除を取りやめますか？",
        confirm_type: "_recoveryRp"
      });
    } else if (act === "cancelAllRecovery") {
      this.setState({
        confirm_message: "処方[処方箋]の削除を取りやめますか？",
        confirm_type: "_recoveryAll"
      });
    } else if (act === "consent") {
      this.setState({
        confirm_message: "承認しますか？",
        confirm_type: "_consented"
      });
    } else if (act === "viewAllNotConsented") {
      this.props.openNotConsentedModal();
      this.setDoctorInformation();
    } else if (act === "doDone") {
      this.doDoneAction();
    } else if (act === "changeDepartment") {
      this.doChangeDepartmentAction();
    } else if (act ==="done_order") {
      let selectedMedPatientInfo = {};
      if(medicine != null){
        selectedMedPatientInfo.receId = medicine.patient_number;
        selectedMedPatientInfo.name = medicine.patient_name;
      }
      this.setState({
        confirm_message: "実施しますか？",
        confirm_type: "_doneOrder",
        done_order_number: medicine_number,
        selectedMedPatientInfo
      });
    } else if (act ==="stop_order") {
      this.setState({
        confirm_message: "中止しますか？",
        confirm_type: "_closeOrders"
      });
    } else if (act ==="done_edit_order") {
      this.setState({
        confirm_message: "実施入力しますか？",
        confirm_type: "_done_edit"
      });
    } else if (act == "show_history") {
      this.props.openModal(medicine_number);
    }
    
    window.localStorage.setItem(
      "medicine_selection_wrapper_scroll",
      $("#medicine_selection_wrapper").scrollTop()
    );
  };
  
  doDoneAction = () => {};
  
  isConsented = () => {
    var orderNumberList = [];
    orderNumberList.push(this.props.orderNumber);
    const postData = {
      order: orderNumberList
    };
    
    this.props.consent(postData);
  };
  
  doChangeDepartmentAction = () => {
    this.props.doChangeDepartmentAction(this.props.orderIndex);
    this.setDoctorInformation();
  };
  
  doDoneOrder = () => {
    this.setState({
      done_modal_title: "処方",
      done_modal_type: "prescription",
      done_modal_data: [],
      isOpenPrescriptionDoneModal: true
    });
  }
  
  handleClick(e, stop_flag, stop_date) {
    // 中止処方 check
    if(this.isStopOrder(stop_flag, stop_date) == 1){
      return;
    }
    
    if (this.props.patientInfo) {
      if (e.type === "contextmenu" && !this.props.isNotConsentedPopup) {
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
          document.getElementById("medicine_selection_wrapper") !== undefined &&
          document.getElementById("medicine_selection_wrapper") !== null
        ) {
          document
            .getElementById("medicine_selection_wrapper")
            .addEventListener("scroll", function onScrollOutside() {
              that.setState({
                contextMenu: { visible: false }
              });
              document
                .getElementById("medicine_selection_wrapper")
                .removeEventListener(`scroll`, onScrollOutside);
            });
        }
        //処方Do展開
        let preset_do_deployment_cache = karteApi.getVal(this.props.patientId,CACHE_LOCALNAMES.PRESET_DO_DEPLOYMENT);
        let preset_do_deployment;
        if (preset_do_deployment_cache !== undefined && preset_do_deployment_cache != null){
          let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
          let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
          let patient_do_get_mode = initState.patient_do_get_mode;
          if(patient_do_get_mode == 0 || authInfo.staff_category === 1){
            preset_do_deployment = preset_do_deployment_cache;
          } else {
            if(this.context.selectedDoctor.code > 0 && preset_do_deployment_cache[this.context.selectedDoctor.code] !== undefined){
              preset_do_deployment = preset_do_deployment_cache[this.context.selectedDoctor.code];
            } else {
              preset_do_deployment = null;
            }
          }
        }
        let clientY = e.clientY;
        this.setState({
          contextMenu: {
            visible: true,
            x: e.clientX - $('#medicine_selection_wrapper').offset().left,
            y: e.clientY + window.pageYOffset - 150,
            preset_do_deployment,
          }
        }, ()=>{
          let menu_height = document.getElementsByClassName("context-menu")[0].offsetHeight;
          // let window_height = document.getElementById('medicine_selection_wrapper').offsetHeight;
          let window_height = window.innerHeight;
          if(clientY + menu_height + 75 > window_height){
            this.setState({
              contextMenu: {
                visible: true,
                x: e.clientX,
                y: clientY - menu_height - 120,
                preset_do_deployment,
              }
            })
          }
        });
      }
    }
  }
  
  changeForm = () => {
    this.setState({ isEdit: this.state.isEdit ? false : true });
    if (this.state.isEdit === true) {
      this.props.order.med.map((medicine, index) => {
        if (medicine.delete_flag === 1) {
          this.props.order.med.splice(index, 1);
        }
      });
      
      if (this.props.order.med === []) {
        this.stopOrder();
        return true;
      }
      
      this.props.order.usage = this.state.usage;
      this.props.order.usage_name = this.state.usage_name;
      this.props.order.days = this.state.days;
      this.props.order.days_suffix = this.state.days_suffix;
      this.props.order.insurance_type = this.state.insurance_type;
      const postData = {
        system_patient_id: this.props.patientId, //HARUKA患者番号
        insurance_type: this.state.insurance_type, //保険情報現状固定
        body_part: this.state.body_part,
        order_data: this.props.order,
        med_consult: 1, //お薬相談希望ありフラグ
        supply_med_info: 1, //薬剤情報提供ありフラグ
        psychotropic_drugs_much_reason: "", //向精神薬多剤投与理由
        poultice_many_reason: "", //向精神薬多剤投与理由
        free_comment: [], //備考
        department_code: 1
      };
      
      axios
        .post("/app/api/v2/order/prescription/update", {
          params: postData
        })
        .catch(() => {
          alert("送信に失敗しました");
        });
    }
  };
  
  recoveryOrder = () => {
    // 死亡状態に関する修正
    if (karteApi.isDeathPatient(this.props.patientId)){
      this.setState({
        alertMessage: "death"
      });
      return;
    }
    let { cacheDelState } = persistedState(this.props.patientId);
    if (!cacheDelState)  return;
    let prescription = null;
    cacheDelState = cacheDelState.filter(data => {
      if(data.number == this.props.orderNumber) {
        prescription = data;
      }
      return data.number !== this.props.orderNumber;
    });
    if(prescription == null) return;
    let order_data = prescription.order_data.filter(data=>{
      return data.order_number !== this.props.order.order_number;
    });
    prescription.order_data = order_data;
    if(order_data.length > 0) {
      cacheDelState.push(prescription);
    }
    if (cacheDelState.length > 0) {
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DELETE, JSON.stringify(cacheDelState));
    } else{
      karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DELETE);
    }
    this.props.getDelData([prescription], "recovery");
  }
  
  recoveryOrders = () => {
    if (karteApi.isDeathPatient(this.props.patientId)){
      this.setState({
        alertMessage: "death"
      });
    }
    let { cacheDelState } = persistedState(this.props.patientId);
    if (!cacheDelState)  return;
    let prescription = null;
    cacheDelState = cacheDelState.filter(data => {
      if(data.number == this.props.orderNumber) {
        prescription = data;
      }
      return data.number !== this.props.orderNumber;
    });
    
    if(prescription == null) return;
    prescription.order_data = [];
    if (cacheDelState.length > 0) {
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DELETE, JSON.stringify(cacheDelState));
    } else{
      karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DELETE);
    }
    this.props.getDelData([prescription], "recovery");
  }
  
  stopOrder = () => {
    const postData = [
      {
        number: this.props.orderNumber,
        system_patient_id: this.props.patientId, //HARUKA患者番号
        insurance_type: 0, //保険情報現状固定
        body_part: "",
        order_data: [
          {
            order_number: this.props.order.order_number, // ※該当する区切りのオーダー番号
            order_number_serial: this.props.order.order_number_serial // ※該当する区切りのオーダー連番
          }
        ],
        med_consult: 1, //お薬相談希望ありフラグ
        supply_med_info: 1, //薬剤情報提供ありフラグ
        psychotropic_drugs_much_reason: "", //向精神薬多剤投与理由
        poultice_many_reason: "", //向精神薬多剤投与理由
        free_comment: [], //備考
        department_code: 1
      }
    ];
    
    let { cacheDelState } = persistedState(this.props.patientId);
    if (!cacheDelState) {
      cacheDelState = [];
    }
    let prescription = null;
    cacheDelState = cacheDelState.filter(data => {
      if(data.number == this.props.orderNumber) {
        prescription = data;
      }
      return data.number !== this.props.orderNumber;
    });
    if(prescription == null){
      postData[0].cacheSerialNumber = this.props.cacheSerialNumber;
      cacheDelState.push(postData[0]);
    }
    else {
      prescription.order_data.push(postData[0].order_data[0]);
      prescription.cacheSerialNumber = this.props.cacheSerialNumber;
      cacheDelState.push(prescription);
    }
    karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DELETE, JSON.stringify(cacheDelState));
    if(this.props.order_data.doctor_code != null){
      postData[0].last_doctor_code = this.props.order_data.doctor_code;
      if(this.props.order_data.doctor_name !== undefined && this.props.order_data.doctor_name != null){
        postData[0].last_doctor_name = this.props.order_data.doctor_name;
      } else {
        postData[0].last_doctor_name = getDoctorName(this.props.order_data.doctor_code);
      }
    }
    this.props.getDelData(postData, "rp_delete");
  };
  
  stopOrders = () => {
    let order_datas = this.props.order_data.order_data.map(data => {
      return {
        order_number: data.order_number, // ※該当する区切りのオーダー番号
        order_number_serial: data.order_number_serial
      };
    });
    const postData = [
      {
        number: this.props.orderNumber,
        system_patient_id: this.props.patientId, //HARUKA患者番号
        insurance_type: 0, //保険情報現状固定
        body_part: "",
        order_data: order_datas,
        med_consult: 1, //お薬相談希望ありフラグ
        supply_med_info: 1, //薬剤情報提供ありフラグ
        psychotropic_drugs_much_reason: "", //向精神薬多剤投与理由
        poultice_many_reason: "", //向精神薬多剤投与理由
        free_comment: [], //備考
        department_code: 1
      }
    ];
    
    let { cacheDelState } = persistedState(this.props.patientId);
    if (!cacheDelState) {
      cacheDelState = [];
    }
    cacheDelState = cacheDelState.filter(data => {
      return data.number !== this.props.orderNumber;
    });
    
    // set serialNumber to cache of prescription;
    postData[0].cacheSerialNumber = this.props.cacheSerialNumber;
    cacheDelState.push(postData[0]);
    karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DELETE, JSON.stringify(cacheDelState));
    if(this.props.order_data.doctor_code != null){
      postData[0].last_doctor_code = this.props.order_data.doctor_code;
      if(this.props.order_data.doctor_name !== undefined && this.props.order_data.doctor_name != null){
        postData[0].last_doctor_name = this.props.order_data.doctor_name;
      } else {
        postData[0].last_doctor_name = getDoctorName(this.props.order_data.doctor_code);
      }
    }
    this.props.getDelData(postData, "order_delete");
  };
  
  doCloseOrders = () => {
    let order_datas = this.props.order_data.order_data.map(data => {
      return {
        order_number: data.order_number, // ※該当する区切りのオーダー番号
        order_number_serial: data.order_number_serial
      };
    });
    const postData = [
      {
        number: this.props.orderNumber,
        system_patient_id: this.props.patientId, //HARUKA患者番号
        insurance_type: 0, //保険情報現状固定
        body_part: "",
        order_data: order_datas,
        med_consult: 1, //お薬相談希望ありフラグ
        supply_med_info: 1, //薬剤情報提供ありフラグ
        psychotropic_drugs_much_reason: "", //向精神薬多剤投与理由
        poultice_many_reason: "", //向精神薬多剤投与理由
        free_comment: [], //備考
        department_code: 1,
        stop_order: 1,
      }
    ];
    let { cacheDelState } = persistedState(this.props.patientId);
    if (!cacheDelState) {
      cacheDelState = [];
    }
    cacheDelState = cacheDelState.filter(data => {
      return data.number !== this.props.orderNumber;
    });
    cacheDelState.push(postData[0]);
    karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DELETE, JSON.stringify(cacheDelState));
    if(this.props.order_data.doctor_code != null){
      postData[0].last_doctor_code = this.props.order_data.doctor_code;
      if(this.props.order_data.doctor_name !== undefined && this.props.order_data.doctor_name != null){
        postData[0].last_doctor_name = this.props.order_data.doctor_name;
      } else {
        postData[0].last_doctor_name = getDoctorName(this.props.order_data.doctor_code);
      }
    }
    this.props.getDelData(postData);
  };
  
  doneEditOrders = () => {
    this.props.onEditOrders(this.props.orderIndex, true);
  }
  
  // getText = (name, value, id) => {
  //   this.props.order.med[id][name] = value;
  // };
  
  // getUnit = (unit, id) => {
  //   this.props.order.med[id]["unit"] = unit;
  // };
  
  // getDelete = (delete_flag, id) => {
  //   this.props.order.med[id]["delete_flag"] = delete_flag;
  // };
  
  onCopyOrder = () => {
    // 死亡状態に関する修正
    if (karteApi.isDeathPatient(this.props.patientId)){
      this.setState({
        alertMessage: "death"
      });
      return;
    }
    this.props.onCopyOrder(this.state.order, "hasDoctor");
    this.setDoctorInformation();
  };
  
  onCopyOrders = (index=null) => {
    // 死亡状態に関する修正
    if (karteApi.isDeathPatient(this.props.patientId)){
      this.setState({
        alertMessage: "death"
      });
      return;
    }
    if(index != null){
      this.props.onCopyOrders(index, 'preset_do_deployment');
    } else {
      this.props.onCopyOrders(this.props.orderIndex, 'hasDoctor');
    }
    this.setDoctorInformation();
  };
  
  onEditOrders = () => {
    this.props.onEditOrders(this.props.orderIndex);
    
  };
  
  onRegisterSet = () => {
    // 死亡状態に関する修正
    if (karteApi.isDeathPatient(this.props.patientId)){
      this.setState({
        alertMessage: "death"
      });
      return;
    }
    this.props.onRegisterSet(this.props.orderIndex);
    this.setDoctorInformation();
  };
  
  onRegisterPatientSet = () => {
    // 死亡状態に関する修正
    if (karteApi.isDeathPatient(this.props.patientId)){
      this.setState({
        alertMessage: "death"
      });
      return;
    }
    this.props.onRegisterSet(this.props.orderIndex, "patient");
    this.setDoctorInformation();
  };
  
  onPrintOrders = () => {
    this.props.onPrintOrders(this.props.orderIndex);
  };
  
  putMedicine = (medicineName, medicineId, unit, id) => {
    this.props.order.med[id]["item_number"] = medicineId;
  };
  
  getCheckSameOptions = () => {
    let med = this.props.order.med[0];
    let keys = Object.keys(med);
    let equalKeys = [];
    const allEqual = arr => arr.every(v => v === arr[0]);
    keys.map(key => {
      let value = [];
      this.props.order.med.map(medi => {
        value.push(medi[key]);
      });
      if (allEqual(value)) {
        equalKeys.push(key);
      }
    });
    return equalKeys;
  };
  
  getSameOptions = aa => {
    let values = [];
    if (aa !== undefined) {
      aa.map(key => {
        let value = {};
        
        value[key] = this.props.order.med[0][key];
        values.push(value);
      });
    }
    let value = {};
    value["one_dose_package"] = this.props.order["one_dose_package"];
    values.push(value);
    value = {};
    value["temporary_medication"] = this.props.order["temporary_medication"];
    values.push(value);
    value = {};
    value["mixture"] = this.props.order["mixture"];
    values.push(value);
    return values;
  };
  
  isStopOrder = (stop_flag, stop_date) => {
    let result = 0;
    if (stop_flag == 1) {
      let now_date_time = new Date().getTime();
      let stop_date_time = 0;
      if (stop_date != "") {
        stop_date_time = new Date(stop_date.split("-").join("/")).getTime();
      }
      if (now_date_time > stop_date_time) result = 1;
    }
    
    return result;
  }
  
  onDragStart = (e, order_number, stop_flag, stop_date) => {
    if (this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION, this.context.AUTHS.REGISTER_PROXY, 0) != true &&
      this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION, this.context.AUTHS.REGISTER, 0) != true ) {
      e.stopPropagation();
      return;
    }
    // 中止処方 check
    if (this.isStopOrder(stop_flag, stop_date) == 1){
      e.stopPropagation();
      return;
    }
    
    if (this.context.$getKarteMode(this.props.patientId) == KARTEMODE.READ) {
      e.stopPropagation();
      return;
    }
    
    // 死亡状態に関する修正
    if (karteApi.isDeathPatient(this.props.patientId)){
      this.setState({
        alertMessage: "death"
      });
      return;
    }
    
    // get clipboard data
    let before_data = "";
    if (window.clipboardData) {
      before_data = window.clipboardData.getData ("Text");
    }
    
    e.dataTransfer.setData("text", "order:" + order_number);
    
    // set clipboardData
    if (window.clipboardData) {
      window.clipboardData.setData ("Text", before_data);
    }
    e.stopPropagation();
  };
  
  getInsurance = type => {
    let insurance = "既定";
    if (this.props.patientInfo && this.props.patientInfo.insurance_type_list) {
      this.props.patientInfo.insurance_type_list.map(item => {
        if (item.code === parseInt(type)) {
          insurance = item.name;
        }
      });
    }
    return insurance;
  };
  
  confirmOk=()=> {
    switch(this.state.confirm_type){
      case "_edit":
        this.onEditOrders();
        break;
      case "_consented":
        this.isConsented();
        break;
      case "_print":
        this.onPrintOrders();
        break;
      case "_delRp":
        this.stopOrder();
        break;
      case "_delAll":
        this.stopOrders();
        break;
      case "_recoveryRp":
        this.recoveryOrder();
        break;
      case "_recoveryAll":
        this.recoveryOrders();
        break;
      case "_doneOrder":
        this.doDoneOrder();
        break;
      case "_closeOrders":
        this.doCloseOrders();
        break;
      case "_done_edit":
        this.doneEditOrders();
        break;
    }
    
    // set doctor information
    this.setDoctorInformation();
    
    this.setState({
      confirm_message: "",
      confirm_type: "",
    });
  }
  
  confirmCancel=()=> {
    this.setDoctorInformation();
    this.setState({
      confirm_message: "",
      confirm_type: "",
    });
  }
  
  closeDeleteModal = () => {
    this.setState({
      isOpenDeleteConfirmModal: false,
    });
  }
  
  setDoctorInformation = () =>{
    if (this.department_label != null && this.department_label != undefined && this.department_label != "") {
      this.props.setDoctorInfo(this.department_id, this.department_label);
    }
    this.department_id = "";
    this.department_label = "";
  }
  
  isExistDeleteCache = () => {
    let result = false;
    let { cacheDelState } = persistedState(this.props.patientId);
    if (!cacheDelState)  return result;
    if (cacheDelState.length > 0) {
      cacheDelState.map(item=>{
        if (item.order_data != undefined && item.order_data.length > 0) {
          item.order_data.map(element=>{
            if (this.state.order.order_number == element.order_number) {
              result = true;
            }
          });
        }
      });
    }
    return result;
  }
  
  closeDoneModal = () => {
    this.setState({isOpenPrescriptionDoneModal: false});
  }
  
  closeModalAndRefresh = () => {
    this.setState({isOpenPrescriptionDoneModal: false});
  }
  
  getCurrentItem = (number) => {
    let result = [];
    if (number == null || number == undefined) {
      return result;
    }
    this.state.medicineHistory.map(item=>{
      if (item.number == number) {
        result = item;
      }
    });
    
    let ret = {};
    ret.target_number = result.number;
    ret.patient_id = result.patient_id;
    ret.updated_at = result.updated_at;
    ret.treatment_datetime = result.treat_date;
    ret.is_doctor_consented = result.is_doctor_consented;
    ret.input_staff_name = result.proxy_input_staff_name;
    ret.doctor_name = result.order_data.doctor_name;
    ret.data = result;
    return ret;
  }
  
  doDeleteOperation = () => {
    this.props.initPresData();
    this.confirmOk();
  }
  
  cancelAlertModal = () => {
    this.setState({alertMessage: ""});
  }

  getUnevenValues = (values, unit) => {
    let unevenValues = [];
    values.map(splitNum => {
      if (splitNum.value !== undefined) {
        unevenValues.push(splitNum.label + " " + splitNum.value + unit);
      }
    });
    return unevenValues.join(",");
  };
  
  render() {
    // const { isEdit, order, mediInfo, patientInfoObject } = this.state;
    const { isEdit, order, patientInfoObject } = this.state;
    // const keyName = {
    //   can_generic_name: "一般名処方",
    //   is_not_generic: "後発不可",
    //   milling: "粉砕",
    //   separate_packaging: "別包",
    //   one_dose_package: "一包化",
    //   temporary_medication: "臨時処方",
    //   mixture:"混合"
    // };

    // rp options
    const keyName = {      
      one_dose_package: "一包化",
      temporary_medication: "臨時処方",
      mixture:"混合"
    };
    
    const isPatientInfoField = patientInfoObject ? true : false;
    const patientInfoKeyNames = [
      "患者情報",
      isPatientInfoField
        ? `${patientInfoObject.name} ${patientInfoObject.patientNumber}`
        : "",
      isPatientInfoField
        ? `${patientInfoObject.sex ? "男性" : "女性"} (${
          patientInfoObject.age
          }歳)`
        : "",
      isPatientInfoField ? `${patientInfoObject.birthday}` : ""
    ];
    let sameKeys = this.getCheckSameOptions();
    const sameOptions = this.getSameOptions(sameKeys);
    let sameOptionsView;
    if (sameOptions !== undefined && sameOptions.length > 0) {
      sameOptionsView = (
        <SameOptionsNew sameOptions={sameOptions} keyNames={keyName} />
      );      
      let noExistRpOptions = 0;
      sameOptions.map(option=>{        
        let key = Object.keys(option)[0];        
        if (key == "one_dose_package") {          
          if (option['one_dose_package'] == undefined || option['one_dose_package'] == null || option['one_dose_package'] == 0) {
             noExistRpOptions ++;
          }
        }
        if (key == "temporary_medication") {          
          if (option['temporary_medication'] == undefined || option['temporary_medication'] == null || option['temporary_medication'] == 0) {
             noExistRpOptions ++;
          }
        }
        if (key == "mixture") {          
          if (option['mixture'] == undefined || option['mixture'] == null || option['mixture'] == 0) {
             noExistRpOptions ++;
          }
        }
      })
      if (noExistRpOptions == 3) sameOptionsView = (<></>);
    }
    const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    
    // if this orderNumber contains in delete cache
    let existDeleteCache = this.isExistDeleteCache();
    return (
      <>
        <Wrapper className="history-list-obj">
          <div
            className={
              (((this.props.is_enabled !== undefined && this.props.is_enabled === 2) || existDeleteCache) ? "history-item line-through " : "history-item ") +
              this.props.class_name +
              '  pres-history pres-rp-'+order.order_number +
              ((this.gray_rps.includes(order.order_number)) ? ' doing ' : '') +
              (this.isStopOrder(order.stop_flag, order.stop_date) === 1 ? " stop-rp " : "")
            }
          >
            <div
              className="box w70p"
              draggable={
                ((this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION, this.context.AUTHS.REGISTER_PROXY, 0) == true ||
                  this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION, this.context.AUTHS.REGISTER, 0) == true) ? true: false)
              }
              onDragStart={e => this.onDragStart(e, order.order_number, order.stop_flag, order.stop_date)}
              onContextMenu={e => this.handleClick(e, order.stop_flag, order.stop_date)}
            >
              {order.med.map((medi, index) => {
                this.i += 1;
                let serial_number = index === 0 ? this.props.serial_number : "";
                return (                               
                <>
                  <DrugItem className="drug-item table-row">
                    <div className="flex between">
                      <div className="flex full-width table-item">
                        <div className="number" style={underLine}>
                          {serial_number === "" ? "" : " Rp" + serial_number}
                        </div>

                        <div className="ml-3 full-width mr-2 ml">
                          {medi.item_name}
                          {medi.amount > 0 &&
                            medi.uneven_values !== undefined &&
                            medi.uneven_values.length > 0 && (
                              <p style={textAlignRight}>
                                {this.getUnevenValues(medi.uneven_values, medi.unit)}
                              </p>
                            )}
                          {medi.free_comment
                            ? medi.free_comment.map(comment => {
                                return (
                                  <p key={comment.id} style={textAlignRight}>
                                    {comment}
                                  </p>
                                );
                              })
                            : ""}                          
                        </div>
                      </div>
                      <div className="w80 table-item" style={textAlignRight}>
                        {" "}
                        {isEdit ? (
                          <input
                            type="text"
                            value={`${medi.amount}`}
                            onChange={this.getAmount}
                          />
                        ) : (
                          `${medi.amount}`
                        )}
                        {medi.unit}
                      </div>                     
                    </div>
                  </DrugItem> 
                  {(medi.can_generic_name === 1 || medi.is_not_generic === 1 || (medi.milling != undefined && medi.milling === 1) || medi.separate_packaging === 1) && (
                    <div className="flex between option table-row">
                      <div className="text-right table-item padleft70">
                        {medi.can_generic_name === 1 && (
                          <>&nbsp;<span style={underLine}>【一般名処方】</span></>
                        )}
                        {medi.is_not_generic === 1 && (
                          <>&nbsp;<span style={underLine}>【後発不可】</span></>
                        )}
                        {(medi.milling !== undefined && medi.milling === 1) && (
                          <>&nbsp;<span style={underLine}>【粉砕】</span></>
                        )}
                        {medi.separate_packaging === 1 && (
                          <>&nbsp;<span style={underLine}>【別包】</span></>
                        )}
                      </div>
                    </div>
                  )}
                </>
                );
              })}
              <div className="flex between drug-item table-row">
                <div className="text-right">
                  <div className="table-item">
                    {order.usage_name && (
                      <>
                        <label>用法: </label>
                        <label>{order.usage_name}</label>
                      </>
                    )}
                  </div>
                  {order.usage_remarks_comment ? (
                    <div className="table-item remarks-comment">
                      {order.usage_remarks_comment.map((comment, ci) => {
                        return <p key={ci}>{comment}</p>;
                      })}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="w80 table-item">
                  {order.days !== 0 && order.days !== undefined
                    ? order.days +
                    (order.days_suffix !== undefined && order.days_suffix !== ""
                      ? order.days_suffix
                      : "日分")
                    : ""}
                </div>
              </div>
              {sameOptionsView}
              {this.props.is_doctor_consented !== 4 && (order.administrate_period == undefined || order.administrate_period == null) && (
                <div className="flex between option table-row">
                  <div className="text-right table-item padleft70">
                    <label>処方開始日: </label>
                    <label>{formatJapanDateSlash(formatDate(order.start_date))}</label>
                  </div>
                </div>
              )}
              {order.administrate_period != undefined && order.administrate_period != null && (
                <div className="flex between option table-row">
                  <div className="text-right table-item padleft70">
                    投与期間 : {formatJapanDateSlash(order.administrate_period.period_start_date)}~{formatJapanDateSlash(order.administrate_period.period_end_date)}
                    <br />
                    {order.administrate_period.period_type == 0 && order.administrate_period.period_category != null && (
                      <>
                        間隔 : {order.administrate_period.period_category == 0 ? "日":order.administrate_period.period_category == 1 ? "週" : "月"}
                      </>
                    )}
                    {order.administrate_period.period_type == 1 && order.administrate_period.period_week_days.length > 0 && (
                      <>
                        曜日 : {getWeekNamesBySymbol(order.administrate_period.period_week_days)}
                      </>
                    )}
                  </div>
                </div>
              )}
              {order.insurance_type !== undefined && (
                <div className="flex between option table-row">
                  <div className="text-right table-item padleft70">
                    <label>保険: </label>
                    <label>{this.getInsurance(order.insurance_type)}</label>
                  </div>
                </div>
              )}
              {order.body_part !== undefined && order.body_part !== "" && (
                <div className="flex between option table-row prescription-body-part">
                  <div className="text-right table-item padleft70">
                    <label>部位/補足: </label>
                    <label>{order.body_part}</label>
                  </div>
                </div>
              )}
              {order.discontinuation_start_date !== undefined &&
              order.discontinuation_start_date !== "" && (
                <div className="flex between option table-row">
                  <div className="text-right table-item padleft70">
                    <label>中止期間の最初日: </label>
                    <label>{formatDate(order.discontinuation_start_date)}</label>
                  </div>
                </div>
              )}
              {order.discontinuation_end_date !== undefined &&
              order.discontinuation_end_date !== "" && (
                <div className="flex between option table-row">
                  <div className="text-right table-item padleft70">
                    <label>中止期間の最後日: </label>
                    <label>{formatDate(order.discontinuation_end_date)}</label>
                  </div>
                </div>
              )}
              {order.discontinuation_comment !== undefined &&
              order.discontinuation_comment !== "" && (
                <div className="flex between option table-row">
                  <div className="text-right table-item padleft70">
                    <label>中止コメント: </label>
                    <label>{order.discontinuation_comment}</label>
                  </div>
                </div>
              )}              
            </div>
            {isPatientInfoField && this.props.serial_number === 1 && (
              <div className="w30p float-right patient-info">
                {patientInfoKeyNames.map((keyName, index) => {
                  return index == 0 ? (
                    <div
                      key={index}
                      className="patientinfo-item table-item text-left patient-info-header"
                    >
                      {keyName}
                    </div>
                  ) : (
                    <div
                      key={index}
                      className="patientinfo-item detail-item table-item text-right"
                    >
                      {keyName}
                    </div>
                  );
                })}
              </div>
            )}
            
            {this.state.isDiscontinuationOpen && (
              <DiscontinuationModal
                closeModal={this.closeDiscontinuation}
                presData={this.state.discontinuationPresData}
                presIndex={this.state.discontinuationIndex}
                setDiscontinuation={this.setDiscontinuation}
              />
            )}
            {this.state.isDoctorsOpen && (
              <SelectDoctorModal
                closeDoctor={this.closeDoctorModal}
                getDoctor={this.getDoctorModal}
                selectDoctorFromModal={this.selectDoctorFromModal}
                doctors={this.state.doctors}
              />
            )}
            {this.state.confirm_message !== "" && this.state.confirm_type !== "" && (
              <SystemConfirmModal
                hideConfirm= {this.confirmCancel.bind(this)}
                confirmCancel= {this.confirmCancel.bind(this)}
                confirmOk= {this.confirmOk.bind(this)}
                confirmTitle= {this.state.confirm_message}
              />
            )}
          </div>
          {authInfo != null && authInfo != undefined && authInfo.doctor_code != null && (
            <ContextMenu
              {...this.state.contextMenu}
              parent={this}
              doctor_code={authInfo.doctor_code}
              staff_category={authInfo.staff_category}
              isFromPrescriptionList={this.props.patientInfo === null}
              is_receipt_archive_data={this.props.is_receipt_archive_data}
              is_doctor_consented={this.props.is_doctor_consented}
              done_order={this.props.done_order}
              is_enabled = {this.props.is_enabled}
              exist_del_cache = {existDeleteCache}
              current_date={getCurrentDate('-')}
              order={this.props.order}
              medicine={this.props.medicine}
            />
          )}
          {this.state.isOpenPrescriptionDoneModal == true && (
            <PrescriptionDoneModal
              patientId={this.props.patientId}
              closeModal={this.closeDoneModal}
              modal_type={this.state.done_modal_type}
              modal_title={this.state.done_modal_title}
              modal_data={this.getCurrentItem(this.state.done_order_number)}
              patientInfo = {this.state.selectedMedPatientInfo}
              donePrescription={this.closeModalAndRefresh}
            />
          )}
          {this.state.isOpenDeleteConfirmModal == true && (
            <DeleteOperationConfirmModal
              confirmCancel= {this.closeDeleteModal}
              confirmOk= {this.doDeleteOperation}
              modal_type= {"modal_delete"}
            />
          )}
          {this.state.alertMessage == "death" && (
            <AlertNoFocusModal
              hideModal= {this.cancelAlertModal.bind(this)}
              handleOk= {this.cancelAlertModal.bind(this)}
              showMedicineContent= {"死亡した患者です。"}
            />
          )}
        </Wrapper>
      </>
    );
  }
}
HistoryList.contextType = Context;

HistoryList.propTypes = {
  order: PropTypes.object,
  orderIndex: PropTypes.number,
  patientId: PropTypes.number,
  orderNumber: PropTypes.number,
  onCopyOrder: PropTypes.func,
  order_data: PropTypes.func,
  onCopyOrders: PropTypes.func,
  onEditOrders: PropTypes.func,
  onRegisterSet: PropTypes.func,
  doChangeDepartmentAction: PropTypes.func,
  onPrintOrders: PropTypes.func,
  serial_number: PropTypes.number,
  class_name: PropTypes.string,
  doctors: PropTypes.array,
  medicineHistory: PropTypes.array,
  doctor_code: PropTypes.number,
  doctor_name: PropTypes.string,
  setDoctorInfo: PropTypes.func,
  patientInfo: PropTypes.array,
  is_doctor_consented: PropTypes.number,
  done_order: PropTypes.number,
  is_enabled: PropTypes.number,
  openNotConsentedModal: PropTypes.func,
  isNotConsentedPopup: PropTypes.bool,
  isNotConsentedDataLength: PropTypes.number,
  forNotConsentedCheckDoctorCode: PropTypes.number,
  patientInfoObject: PropTypes.Object,
  consent: PropTypes.func,
  getDelData: PropTypes.func,
  selectDoctorPrescription: PropTypes.func,
  is_receipt_archive_data: PropTypes.number,
  medicine:PropTypes.object,
  openModal:PropTypes.func,
  initPresData:PropTypes.func,
  cacheSerialNumber: PropTypes.number,
  isEdit: PropTypes.bool,
};

export default HistoryList;
