import React, { Component, useContext } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import InjectionHistoryUl from "./InjectionHistoryUl";
import Context from "~/helpers/configureStore";
import $ from "jquery";
import { formatDate, getCurrentDate, formatJapanDateSlash, getWeekNamesBySymbol } from "~/helpers/date";
import { persistedState } from "../../helpers/cache";
import SystemConfirmModal from "./SystemConfirmModal";
import SelectDoctorModal from "../templates/Patient/components/SelectDoctorModal";
import * as karteApi from "~/helpers/cacheKarte-utils";
import {CACHE_LOCALNAMES, KARTEMODE, getPeriodInjectionRpDoneStatus, getDoctorName} from "~/helpers/constants";
import DoneModal from "~/components/organisms/DoneModal";
import DeleteOperationConfirmModal from "~/components/molecules/DeleteOperationConfirmModal";
import * as apiClient from "~/api/apiClient";
import * as sessApi from "~/helpers/cacheSession-utils";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import * as localApi from "~/helpers/cacheLocal-utils";

const Wrapper = styled.div`
  ul{
    margin-bottom: 0px;
  }
  .text-right-other{
    width: calc(100% - 163px) !important;
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

const underLine = {
  textDecorationLine: "underline"
};

const ContextMenu = ({
                       visible,
                       x,
                       y,
                       parent,
                       staff_category,
                       isFromPrescriptionList,
                       is_receipt_archive_data,
                       is_enabled,
                       exist_del_cache,
                       current_date,
                       diagnosing_date,
                       is_doctor_consented,
                       done_order,
                       medicine
                     }) => {
  const { $canDoAction, FEATURES, AUTHS, karteMode } = useContext(Context);
  
  if (visible) {
    // RP1つの時は、右クリックメニューからRP単位の削除を非表示にして、処方箋単位/オーダー単位の削除だけにする
    let rp_count = parent.props.order_data.order_data.length;

    // 定期注射オーダーの画面で削除メニュー表示
      // PERIOD_INJECTION.DELETE_INJECTION_NOT_DONE => 未実施の依頼を削除(定期注射の未実施依頼の中止権限)
      // PERIOD_INJECTION.DELETE_INJECTION_DONE => 実施済の依頼を削除(定期注射の実施済依頼の削除権限)
      // PERIOD_INJECTION.INJECTION_DONE_TO_NOT_DONE => 実施済を未実施に戻す(定期注射の実施済の実施取り消し権限)
    let is_period_injection = 0;
    if (parent.props.is_completed == 4) is_period_injection = 1;

    // ①オーダーの状態が未実施の場合 (定期注射) done_order = 0
    let not_done_period_injection_menu = 0;
    if ($canDoAction(FEATURES.PERIOD_INJECTION, AUTHS.DELETE_INJECTION_NOT_DONE) && parent.props.done_order == 0) {
      not_done_period_injection_menu = 1;
    }

    // ②オーダーの状態が実施中の場合 (定期注射)
    let doing_done_period_injection_menu = 0;
    if ($canDoAction(FEATURES.PERIOD_INJECTION, AUTHS.DELETE_INJECTION_DONE)  && parent.props.done_order == 2) {
      doing_done_period_injection_menu = 1;
    }

    // ③オーダーの状態が実施済の場合 (定期注射)
    let done_done_period_injection_menu = 0;
    if ($canDoAction(FEATURES.PERIOD_INJECTION, AUTHS.DELETE_INJECTION_DONE) && parent.props.done_order == 1) {
      done_done_period_injection_menu = 1;
    }

    let props_rp_order = parent.props.order;

    let can_show_period_doing_all_stop_rp = 0; // if exist 実施 record ?

    if (is_period_injection == 1) {
      if(props_rp_order.done_numbers != undefined && props_rp_order.done_numbers != null && (props_rp_order.done_numbers.length > 0 || Object.keys(props_rp_order.done_numbers).length > 0)) {
        Object.keys(props_rp_order.done_numbers).map(key=>{
          props_rp_order.done_numbers[key].map(ele=>{
            if (ele.completed_at != undefined && ele.completed_at == "") {
              can_show_period_doing_all_stop_rp = 1;
            }
          });
        });
      }
    }

    let can_show_period_doing_some_del_rp = 0; // if exist =実施済 record ?

    if (is_period_injection == 1) {
      if(props_rp_order.done_numbers != undefined && props_rp_order.done_numbers != null && (props_rp_order.done_numbers.length > 0 || Object.keys(props_rp_order.done_numbers).length > 0)) {
        Object.keys(props_rp_order.done_numbers).map(key=>{
          props_rp_order.done_numbers[key].map(ele=>{
            if (ele.completed_at != undefined && ele.completed_at != "") {
              can_show_period_doing_some_del_rp = 1;
            }
          });
        });
      }
    }    

    let is_stoped_rp = 0; // if 中止Rp ?
    if (parent.props.order.stop_at != undefined && parent.props.order.stop_at != "") {
      is_stoped_rp = 1;
    }
    
    let curDate = new Date(current_date);
    let start_date = new Date(diagnosing_date.substring(0,10));
    
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
    
    // check delete
    // let treat_date = null;
    // parent.props.medicineHistory.map(ele=>{
    //   if (medicine.number == ele.number) {
    //     treat_date = ele.treat_date;
    //   }
    // });
    
    let canDelete = false;
    // ①「当日未受付の削除」「当日未受付の削除（代理）」
    if (start_date.getTime() == curDate.getTime() && (done_order == 0 || done_order == 2) && ($canDoAction(FEATURES.PRESCRIPTION, AUTHS.DELETE_TODAY_NOT_ACCEPT) || $canDoAction(FEATURES.PRESCRIPTION, AUTHS.DELETE_TODAY_NOT_ACCEPT_PROXY)) && is_doctor_consented !== 4) {
      // console.log("00");
      canDelete = true;
    }
    // ②「当日実施済みの削除」「当日実施済みの削除（代理）」
    // ・オーダー登録日時が現在日付なら、状態が進んでいるレコードでも削除可能
    if (start_date.getTime() == curDate.getTime() && done_order == 1 && ($canDoAction(FEATURES.PRESCRIPTION, AUTHS.DELETE_TODAY_DONE) || $canDoAction(FEATURES.PRESCRIPTION, AUTHS.DELETE_TODAY_DONE_PROXY)) && is_doctor_consented !== 4) {
      // console.log("01");
      canDelete = true;
    }
    let treat_date = null;
    // ・オーダー登録が過去でも、実施した日時が現在日付のレコードは削除可能
    if(done_order == 1 && medicine.order_data.executed_date_time != null && medicine.order_data.executed_date_time != "") treat_date = new Date(medicine.order_data.executed_date_time.substring(0,10));
    
    if (start_date.getTime() < curDate.getTime() && treat_date != null && treat_date.getTime() == curDate.getTime() && done_order == 1 && ($canDoAction(FEATURES.PRESCRIPTION, AUTHS.DELETE_TODAY_DONE) || $canDoAction(FEATURES.PRESCRIPTION, AUTHS.DELETE_TODAY_DONE_PROXY)) && is_doctor_consented !== 4) {
      // console.log("02");
      canDelete = true;
    }
    // ③「過去実施済みの削除」「過去実施済みの削除（代理）」
    if (start_date.getTime() < curDate.getTime() && ($canDoAction(FEATURES.PRESCRIPTION, AUTHS.DELETE_PAST_DONE) || $canDoAction(FEATURES.PRESCRIPTION, AUTHS.DELETE_PAST_DONE_PROXY)) && is_doctor_consented !== 4) {
      // console.log("03");
      canDelete = true;
    }
    var isWrite = (karteMode == KARTEMODE.READ) ?  false: true;
    let cache_data = sessApi.getObject('injection_consented_list');
    cache_data = cache_data.filter(x=>x.patient_id == parent.props.patientId);
    return (
      <ContextMenuUl>
        {isFromPrescriptionList ? (
          <ul
            className="context-menu"
            style={{ left: `${x}px`, top: `${y}px` }}
          />
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
                        <li><div onClick={() => parent.contextMenuAction("cancelAllRecovery")}>削除取りやめ[オーダー]</div></li>
                      </>
                    )}
                  </>
                )}
              </>
            ) : (
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
                          <li><div onClick={() => parent.contextMenuAction("doRp")}>Do注射[Rp単位]</div></li>
                        )}
                        <li><div onClick={() => parent.contextMenuAction("doAll")}>Do注射[オーダー]</div></li>
                      </>
                    )}
                  </>
                )}
                {(is_receipt_archive_data === undefined || (is_receipt_archive_data !== 1 && canEdit)) && isWrite && (
                  <li><div onClick={() => parent.contextMenuAction("edit")}>編集</div></li>
                )}
                <li><div onClick={() => parent.contextMenuAction("print")}>印刷</div></li>
                { $canDoAction(FEATURES.PRESET, AUTHS.REGISTER) && isWrite && (
                  <li><div onClick={() => parent.contextMenuAction("registerSet")}>セットとして登録</div></li>
                )}
                {is_period_injection != 1 ? (
                  <>
                    {(is_receipt_archive_data === undefined || (is_receipt_archive_data !== 1 && canDelete )) && isWrite && !parent.props.isEdit && (
                      <>
                        {rp_count > 1 && (
                          <li><div onClick={() => parent.contextMenuAction("cancel")}>削除[Rp単位]</div></li>
                        )}
                        <li><div onClick={() => parent.contextMenuAction("cancelAll")}>削除[オーダー]</div></li>
                      </>
                    )}
                  </>
                ):(
                  <></>
                )}
                {$canDoAction(FEATURES.PRESCRIPTION, AUTHS.DONE_OREDER) && is_doctor_consented !== 4 && done_order === 0 && isWrite && parent.props.is_completed != 4 && (
                  <>
                    <li><div onClick={() => parent.contextMenuAction("done_order")}>実施</div></li>
                    <li><div onClick={() => parent.contextMenuAction("done_edit_order")}>実施入力</div></li>
                  </>
                )}
                {($canDoAction(FEATURES.PRESCRIPTION, AUTHS.STOP) || $canDoAction(FEATURES.PRESCRIPTION, AUTHS.STOP_PROXY)) && is_doctor_consented !== 4 && done_order === 0 && isWrite && parent.props.is_completed != 4 && (
                  <li><div onClick={() => parent.contextMenuAction("stop_order")}>中止</div></li>
                )}                    
                {is_period_injection == 1 && (                  
                  <>
                    {not_done_period_injection_menu == 1 && is_stoped_rp != 1 && (
                      <>
                        {rp_count > 1 && (
                          <li><div onClick={() => parent.contextMenuAction("period_not_done_stop_rp")}>中止[Rp単位]</div></li>
                        )}
                        <li><div onClick={() => parent.contextMenuAction("period_not_done_stop_order")}>中止[オーダー単位]</div></li>
                      </>
                    )}
                    {doing_done_period_injection_menu == 1 && is_stoped_rp != 1 && (
                      <>
                        <li><div onClick={() => parent.contextMenuAction("period_doing_some_stop_rp")}>一部未実施中止[Rp単位]</div></li>
                        {can_show_period_doing_all_stop_rp == 1 && (
                          <>
                            {rp_count > 1 && (
                              <li><div onClick={() => parent.contextMenuAction("period_doing_all_stop_rp")}>全未実施中止[Rp単位]</div></li>
                            )}
                            <li><div onClick={() => parent.contextMenuAction("period_doing_all_stop_order")}>全未実施中止[オーダー単位]</div></li>
                          </>
                        )}
                        {can_show_period_doing_some_del_rp == 1 && (
                          <li><div onClick={() => parent.contextMenuAction("period_doing_some_del_rp")}>一部実施済削除[Rp単位]</div></li>
                        )}
                        {rp_count > 1 && (
                          <li><div onClick={() => parent.contextMenuAction("period_doing_all_del_rp")}>全削除[Rp単位]</div></li>
                        )}
                        <li><div onClick={() => parent.contextMenuAction("period_doing_all_del_order")}>全削除[オーダー単位]</div></li>                      
                      </>
                    )}
                    {done_done_period_injection_menu == 1 && is_stoped_rp != 1 && (
                      <>
                        {can_show_period_doing_some_del_rp == 1 && (
                          <li><div onClick={() => parent.contextMenuAction("period_done_del_rp")}>一部実施済削除[Rp単位]</div></li>                          
                        )}
                        {rp_count > 1 && (
                          <li><div onClick={() => parent.contextMenuAction("period_done_all_del_rp")}>全削除[Rp単位]</div></li>
                        )}
                        <li><div onClick={() => parent.contextMenuAction("period_done_all_del_order")}>全削除[オーダー単位]</div></li>
                      </>
                    )}                    
                  </>
                )}
                {staff_category == 1 && cache_data.length > 0 && isWrite && (
                  <li><div onClick={() => parent.contextMenuAction("viewAllNotConsented")}>未承認履歴</div></li>
                )}
                {(is_receipt_archive_data === undefined || (is_receipt_archive_data !==1 && $canDoAction(FEATURES.PRESCRIPTION, AUTHS.RECEIPT))) && isWrite && (
                  <li><div onClick={() => parent.contextMenuAction("changeDepartment")}>診療科修正</div></li>
                )}
                {medicine != undefined && medicine.number != undefined &&  medicine.history !== "" && medicine.history.split(",").length > 1 && (
                  <li><div onClick={() => parent.contextMenuAction("show_history", medicine.number)}>履歴表示</div></li>
                )}
              </>
            )}
          </ul>
        )}
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class InjectionHistoryList extends Component {
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
      discontinuationIndex: -1,
      discontinuationPresData: [],
      isDoctorsOpen: false,
      isOpenDeleteConfirmModal: false,
      selectedDoctorID: this.props.doctor_code,
      selectedDoctorName: this.props.doctor_name,
      currentUserName: authInfo.name,
      canEdit: authInfo.staff_category === 1,
      staff_category: authInfo.staff_category || 2,
      isBulkStop: false,
      hover: false,
      patientInfo: this.props.patientInfo,
      patientInfoObject: this.props.patientInfoObject,
      confirm_message: "",
      confirm_type: "",
      doctors: this.props.doctors
    };
    this.act_msg = "";
    this.gray_rps = [];
    this.i = 0;
    let injection_gray_info = localApi.getObject("injection_gray_info");
    if(injection_gray_info != undefined && injection_gray_info != null && injection_gray_info.rp_numbers != undefined){
      this.gray_rps = injection_gray_info.rp_numbers;
    }
  }
  
  async componentDidMount() {
    let data = sessApi.getDoctorList();
    if(data == null) {
      data = await apiClient.get("/app/api/v2/secure/doctor/search?");
    }
    // let data = await apiClient.get("/app/api/v2/secure/doctor/search?");
    this.setState({ doctors: data });
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
      // alert("権限がありません。");
      return;
    }
    
    if (canEdit === 2 && this.context.selectedDoctor.code <= 0) {
      this.setState({
        // isDoctorsOpen: true,
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
  
  contextMenuAction = (act, medicine_number=null) => {
    if (act != "show_history") {
      let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
        this.act_msg = act;
        this.setState({
          isDoctorsOpen: true
        });
        // this.context.$selectDoctor(true);
        return;
      }
    }
    this.doContextMenuAction(act, medicine_number);
  };
  
  doContextMenuAction = (act, medicine_number = null) => {
    this.act_msg = "";
    
    if (act === "doRp") {
      this.onCopyOrder();
    } else if (act === "doAll") {
      this.onCopyOrders();
    } else if (act === "edit") {
      this.setState({
        confirm_message: "注射履歴を編集しますか？",
        confirm_type: "_edit"
      });
    } else if (act === "print") {
      this.setState({
        confirm_message: "印刷してよろしいですか？",
        confirm_type: "_print"
      });
    } else if (act === "cancel") {
      // 処方・注射画面からの削除の動線の整理・修正(1)
      // (A) 処方/注射画面で入力・編集中は、破棄しないと削除を追加できないように。
      // check input or edit data exist?
      if (karteApi.existInputOrEditData(this.props.patientId, CACHE_LOCALNAMES.INJECTION_EDIT, this.props.cacheSerialNumber)) {
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
      if (karteApi.existInputOrEditData(this.props.patientId, CACHE_LOCALNAMES.INJECTION_EDIT, this.props.cacheSerialNumber)) {
        this.setState({
          isOpenDeleteConfirmModal: true,
          confirm_type: "_delRp"
        });
      } else {
        this.setState({
          confirm_message: "削除しますか？",
          confirm_type: "_delAll"
        });
      }
    } else if (act === "period_not_done_stop_rp") { // 中止[Rp単位] (done_order = 0)            
      this.setState({
        confirm_message: "定期注射[Rp単位]を中止しますか？",
        confirm_type: "_delPeriodRpStop"
      });    
      // this.setDoctorInformation();  
    } else if (act === "period_not_done_stop_order") { // 中止[オーダー単位] (done_order = 0)            
      this.setState({
        confirm_message: "定期注射[オーダー単位]を中止しますか？",
        confirm_type: "_delPeriodOrderStop"
      });      
      // this.setDoctorInformation();
    } else if (act === "period_doing_some_stop_rp") { // 一部未実施中止[Rp単位] (done_order = 2)                  
      this.props.openSomeCompletedCancel("SomeDoingNotDoneStop", this.props.order, this.props.orderNumber, this.props.serial_number);
      this.setDoctorInformation();    
    } else if (act === "period_doing_all_stop_rp") { // 全未実施中止[Rp単位] (done_order = 2)            
      this.setState({
        confirm_message: "定期注射全未実施中止[Rp単位]しますか？",
        confirm_type: "_delPeriodAllRpStop"
      });      
      // this.setDoctorInformation();
    } else if (act === "period_doing_all_stop_order") { // 全未実施中止[オーダー単位] (done_order = 2)            
      this.setState({
        confirm_message: "定期注射全未実施中止[オーダー単位]しますか？",
        confirm_type: "_delPeriodAllOrderStop"
      });      
      // this.setDoctorInformation();
    } else if (act === "period_doing_all_del_rp") { // 全削除[Rp単位] (done_order = 2)            
      this.setState({
        confirm_message: "未実施は中止にして、実施済みは実施の取り消しも行うことになる。全削除[Rp単位]しますか？",
        confirm_type: "_delPeriodDoingAllRpStop"
      });      
      // this.setDoctorInformation();
    } else if (act === "period_doing_all_del_order") { // 全削除[オーダー単位] (done_order = 2)            
      this.setState({
        confirm_message: "未実施は中止にして、実施済みは実施の取り消しも行うことになる。全削除[オーダー単位]しますか？",
        confirm_type: "_delPeriodDoingAllOrderStop"
      });
      // this.setDoctorInformation();
    } else if (act === "period_doing_some_del_rp") { // 一部実施済削除[Rp単位] (done_order = 2)                  
      this.props.openSomeCompletedCancel("SomeDoingCompletedCancel", this.props.order, this.props.orderNumber, this.props.serial_number);
      this.setDoctorInformation();    
    } else if (act === "period_done_del_rp") { // 一部実施済削除[Rp単位] (done_order = 1)                  
      this.props.openSomeCompletedCancel("SomeDoneCompletedCancel", this.props.order, this.props.orderNumber, this.props.serial_number);
      this.setDoctorInformation();    
    } else if (act === "period_done_all_del_rp") { // 全削除[Rp単位] (done_order = 1)            
      this.setState({
        confirm_message: "未実施は中止にして、実施済みは実施の取り消しも行うことになる。全削除[Rp単位]しますか？",
        confirm_type: "_delPeriodDoneAllRpStop"
      });
      // this.setDoctorInformation();
    } else if (act === "period_done_all_del_order") { // 全削除[オーダー単位] (done_order = 1)            
      this.setState({
        confirm_message: "未実施は中止にして、実施済みは実施の取り消しも行うことになる。全削除[オーダー単位]しますか？",
        confirm_type: "_delPeriodDoneAllOrderStop"
      });
      // this.setDoctorInformation();
    } else if (act === "cancelRecovery") {
      this.setState({
        confirm_message: "注射[Rp単位]の削除を取りやめますか？",
        confirm_type: "_recoveryRp"
      });
    } else if (act === "cancelAllRecovery") {
      this.setState({
        confirm_message: "注射[オーダー]の削除を取りやめますか？",
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
    }  else if (act === "registerSet") {
      this.onRegisterSet();
    } else if (act ==="done_order") {
      this.doneModalOrder();
    }else if (act ==="stop_order") {
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
      "injection_selection_wrapper_scroll",
      $("#injection_selection_wrapper").scrollTop()
    );
  };
  
  doChangeDepartmentAction = () => {
    this.props.doChangeDepartmentAction(this.props.orderIndex);
    this.setDoctorInformation();
  };
  
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
  
  onCopyOrders = () => {
    // 死亡状態に関する修正
    if (karteApi.isDeathPatient(this.props.patientId)){
      this.setState({
        alertMessage: "death"
      });
      return;
    }
    this.props.onCopyOrders(this.props.orderIndex, "hasDoctor");
    this.setDoctorInformation();
  };
  
  onEditOrders = () => {
    this.props.onEditOrders(this.props.orderIndex);
  };
  
  onPrintOrders = () => {
    this.props.onPrintOrders(this.props.orderIndex);
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

  stopPeriodRp = () => {
    // stopPeriodRp
    // rp number: this.props.serial_number
    if (this.department_label != null && this.department_label != undefined && this.department_label != "") {      
      this.props.stopPeriodRp(this.props.orderNumber, this.props.serial_number, this.department_id, this.department_label);
    } else {      
      this.props.stopPeriodRp(this.props.orderNumber, this.props.serial_number);
    }
  }
  
  stopPeriodOrder = () => {
    // stopPeriodOrder
    if (this.department_label != null && this.department_label != undefined && this.department_label != "") {
      this.props.stopPeriodOrder(this.props.orderNumber, this.department_id, this.department_label);
    } else {
      this.props.stopPeriodOrder(this.props.orderNumber);
    }
  }  
  
  stopPeriodAllRp = () => {    
    let param = {
      type:"stopPeriodAllRp",
      order_number: this.props.orderNumber,
      rp_number: this.props.serial_number      
    };
    if (this.department_label != null && this.department_label != undefined && this.department_label != "") {
      param.doctor_code = this.department_id;
      param.doctor_name = this.department_label;      
    }
    this.props.stopPeriodInjectionCategory(param);
  }
  
  stopPeriodAllOrder = () => {    
    let param = {
      type:"stopPeriodAllOrder",
      order_number: this.props.orderNumber      
    };
    if (this.department_label != null && this.department_label != undefined && this.department_label != "") {
      param.doctor_code = this.department_id;
      param.doctor_name = this.department_label;      
    }
    this.props.stopPeriodInjectionCategory(param);
  }
  
  stopPeriodDoingAllRp = () => {    
    let param = {
      type:"stopPeriodDoingAllRp",   
      order_number: this.props.orderNumber,
      rp_number: this.props.serial_number   
    };
    if (this.department_label != null && this.department_label != undefined && this.department_label != "") {
      param.doctor_code = this.department_id;
      param.doctor_name = this.department_label;      
    }
    this.props.stopPeriodInjectionCategory(param);
  }
  
  stopPeriodDoingAllOrder = () => {    
    let param = {
      type:"stopPeriodDoingAllOrder",
      order_number: this.props.orderNumber,      
    };
    if (this.department_label != null && this.department_label != undefined && this.department_label != "") {
      param.doctor_code = this.department_id;
      param.doctor_name = this.department_label;      
    }
    this.props.stopPeriodInjectionCategory(param);
  }
  
  stopPeriodDoneAllRp = () => {    
    let param = {
      type:"stopPeriodDoneAllRp",
      order_number: this.props.orderNumber,
      rp_number: this.props.serial_number      
    };
    if (this.department_label != null && this.department_label != undefined && this.department_label != "") {
      param.doctor_code = this.department_id;
      param.doctor_name = this.department_label;      
    }
    this.props.stopPeriodInjectionCategory(param);
  }
  
  stopPeriodDoneAllOrder = () => {    
    let param = {
      type:"stopPeriodDoneAllOrder",
      order_number: this.props.orderNumber,          
    };
    if (this.department_label != null && this.department_label != undefined && this.department_label != "") {
      param.doctor_code = this.department_id;
      param.doctor_name = this.department_label;      
    }
    this.props.stopPeriodInjectionCategory(param);
  }
  
  stopOrder = () => {
    // if (this.checkCanEdit(false) === false) return;
    const postData = [
      {
        number: this.props.orderNumber,
        system_patient_id: this.props.patientId, //HARUKA患者番号
        order_data: [
          {
            order_number: this.props.order.order_number, // ※該当する区切りのオーダー番号
            order_number_serial: this.props.order.order_number_serial // ※該当する区切りのオーダー連番
          }
        ],
        department_code: 1
      }
    ];
    
    let { cacheDelInjectState } = persistedState(this.props.patientId);
    if (!cacheDelInjectState) {
      cacheDelInjectState = [];
    }
    let prescription = null;
    cacheDelInjectState = cacheDelInjectState.filter(data => {
      if(data.number == this.props.orderNumber) {
        prescription = data;
      }
      
      return data.number !== this.props.orderNumber;
    });
    if(prescription == null){
      // set serialNumber to cache of injection;
      postData[0].cacheSerialNumber = this.props.cacheSerialNumber;
      cacheDelInjectState.push(postData[0]);
    }
    else {
      prescription.order_data.push(postData[0].order_data[0]);
      // set serialNumber to cache of injection;
      prescription.cacheSerialNumber = this.props.cacheSerialNumber;
      cacheDelInjectState.push(prescription);
    }
    // window.localStorage.setItem(
    //   "haruka_delete_inject_cache",
    //   JSON.stringify(cacheDelInjectState)
    // );
    karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DELETE, JSON.stringify(cacheDelInjectState));
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
    // if (this.checkCanEdit(true) === false) return;
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
        order_data: order_datas,
        department_code: 1
      }
    ];
    
    let { cacheDelInjectState } = persistedState(this.props.patientId);
    if (!cacheDelInjectState) {
      cacheDelInjectState = [];
    }
    let prescription = null;
    cacheDelInjectState = cacheDelInjectState.filter(data => {
      if(data.number == this.props.orderNumber) {
        prescription = data;
      }
      return data.number !== this.props.orderNumber;
    });
    if(prescription == null){
      // set serialNumber to cache of injection;
      postData[0].cacheSerialNumber = this.props.cacheSerialNumber;
      cacheDelInjectState.push(postData[0]);
    }
    else {
      prescription.order_data.push(postData[0].order_data[0]);
      // set serialNumber to cache of injection;
      prescription.cacheSerialNumber = this.props.cacheSerialNumber;
      cacheDelInjectState.push(prescription);
    }
    
    // cacheDelInjectState.push(postData[0]);
    // window.localStorage.setItem(
    //   "haruka_delete_inject_cache",
    //   JSON.stringify(cacheDelInjectState)
    // );
    karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DELETE, JSON.stringify(cacheDelInjectState));
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
    // if (this.checkCanEdit(true) === false) return;
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
        order_data: order_datas,
        department_code: 1,
        stop_order: 1,
      }
    ];
    
    let { cacheDelInjectState } = persistedState(this.props.patientId);
    if (!cacheDelInjectState) {
      cacheDelInjectState = [];
    }
    let prescription = null;
    cacheDelInjectState = cacheDelInjectState.filter(data => {
      if(data.number == this.props.orderNumber) {
        prescription = data;
      }
      return data.number !== this.props.orderNumber;
    });
    if(prescription == null)
      cacheDelInjectState.push(postData[0]);
    else {
      prescription.order_data.push(postData[0].order_data[0]);
      cacheDelInjectState.push(prescription);
    }
    karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DELETE, JSON.stringify(cacheDelInjectState));
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
  
  recoveryOrder = () => {
    // if (this.checkCanEdit(false) === false) return;
    let { cacheDelInjectState } = persistedState(this.props.patientId);
    
    if (!cacheDelInjectState)  return;
    let prescription = null;
    cacheDelInjectState = cacheDelInjectState.filter(data => {
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
      cacheDelInjectState.push(prescription);
    }
    if (cacheDelInjectState.length > 0) {
      // window.localStorage.setItem(
      //   "haruka_delete_inject_cache",
      //   JSON.stringify(cacheDelInjectState)
      // );
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DELETE, JSON.stringify(cacheDelInjectState));
    }else{
      // window.localStorage.removeItem(
      //   "haruka_delete_inject_cache"
      // );
      karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DELETE);
    }
    // window.localStorage.setItem(
    //   "haruka_delete_inject_cache",
    //   JSON.stringify(cacheDelInjectState)
    // );
    
    this.props.getDelData([prescription], "recovery");
  }
  
  doneModalOrder = () => {
    let modal_data = this.props.order_data;
    modal_data.updated_at = modal_data.executed_date_time;
    modal_data.target_number = this.props.orderNumber;
    let data = {
      order_data: JSON.parse(JSON.stringify(this.props.order_data)),
      item_details: JSON.parse(JSON.stringify(this.props.order_data.item_details))
    };
    modal_data.data = data;
    this.setState({
      done_modal_title: "注射",
      done_modal_type: "injection",
      done_modal_data: modal_data,
      isOpenDoneModal: true
    });
  };
  
  recoveryOrders = () => {
    // if (this.checkCanEdit(false) === false) return;
    let { cacheDelInjectState } = persistedState(this.props.patientId);
    
    if (!cacheDelInjectState)  return;
    let prescription = null;
    cacheDelInjectState = cacheDelInjectState.filter(data => {
      if(data.number == this.props.orderNumber) {
        prescription = data;
      }
      return data.number !== this.props.orderNumber;
    });
    
    if(prescription == null) return;
    prescription.order_data = [];
    if (cacheDelInjectState.length > 0) {
      // window.localStorage.setItem(
      //   "haruka_delete_inject_cache",
      //   JSON.stringify(cacheDelInjectState)
      // );
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DELETE, JSON.stringify(cacheDelInjectState));
    }else{
      // window.localStorage.removeItem(
      //   "haruka_delete_inject_cache"
      // );
      karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DELETE);
    }
    // window.localStorage.setItem(
    //   "haruka_delete_inject_cache",
    //   JSON.stringify(cacheDelInjectState)
    // );
    
    this.props.getDelData([prescription], "recovery");
  }
  onDragStart = (e, order_number) => {
    if (this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION, this.context.AUTHS.REGISTER_PROXY, 0) != true &&
      this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION, this.context.AUTHS.REGISTER, 0) != true ) {
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
  
  confirmOk() {
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
      case "_delPeriodRpStop":
        this.stopPeriodRp();
        break;
      case "_delPeriodOrderStop":
        this.stopPeriodOrder();
        break;
      case "_delPeriodAllRpStop":
        this.stopPeriodAllRp();
        break;
      case "_delPeriodAllOrderStop":
        this.stopPeriodAllOrder();
        break;
      case "_delPeriodDoingAllRpStop":
        this.stopPeriodDoingAllRp();
        break;
      case "_delPeriodDoingAllOrderStop":
        this.stopPeriodDoingAllOrder();
        break;
      case "_delPeriodDoneAllRpStop":
        this.stopPeriodDoneAllRp();
        break;
      case "_delPeriodDoneAllOrderStop":
        this.stopPeriodDoneAllOrder();
        break;
      case "_recoveryRp":
        this.recoveryOrder();
        break;
      case "_recoveryAll":
        this.recoveryOrders();
        break;
      case "_doneOrder":
        this.doneModalOrder();
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
  
  confirmCancel() {
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
  
  closeDoctor = () => {
    this.setState({
      isDoctorsOpen: false,
      canEdit: this.state.staff_category === 1,
      selectedDoctorID: 0,
      selectedDoctorName: ""
    });
  };
  
  getDoctorModal = e => {
    // this.selectDoctorFromModal(e.target.id, e.target.getAttribute("label"));
    this.department_id = e.target.id;
    this.department_label = e.target.getAttribute("label");
    
    this.setState({
      isDoctorsOpen: false
    },()=>{
      if (this.act_msg != "") {
        // this.doContextMenuAction(this.act_msg, department_id, department_label, department_name);
        this.doContextMenuAction(this.act_msg);
      }
    });
  };
  
  selectDoctorFromModal = (id, name) => {
    this.setState(
      {
        selectedDoctorID: id,
        selectedDoctorName: name,
        canEdit: true,
        isDoctorsOpen: false
      },
      function() {
        if (this.state.isBulkStop) {
          this.stopOrders();
        } else {
          this.stopOrder();
        }
      }
    );
  };
  
  handleClick(e) {
    // if (this.props.is_enabled !== undefined && this.props.is_enabled === 2)
    //   return;
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
          document.getElementById("injection_selection_wrapper") !== undefined &&
          document.getElementById("injection_selection_wrapper") !== null
        ) {
          document
            .getElementById("injection_selection_wrapper")
            .addEventListener("scroll", function onScrollOutside() {
              that.setState({
                contextMenu: { visible: false }
              });
              document
                .getElementById("injection_selection_wrapper")
                .removeEventListener(`scroll`, onScrollOutside);
            });
        }
        let clientY = e.clientY;
        this.setState({
          contextMenu: {
            visible: true,
            x: e.clientX - $('#injection_selection_wrapper').offset().left,
            y: e.clientY + window.pageYOffset - 120
          }
        }, ()=>{
          let menu_height = document.getElementsByClassName("context-menu")[0].offsetHeight;
          let window_height = window.innerHeight;
          if(clientY + menu_height + 70 > window_height){
            this.setState({
              contextMenu: {
                visible: true,
                x: e.clientX,
                y: clientY - menu_height - 100
              }
            })
          }
        });
        
      }
    }
  }
  
  setDoctorInformation = () =>{
    if (this.department_label != null && this.department_label != undefined && this.department_label != "") {
      this.props.setDoctorInfo(this.department_id, this.department_label);
    }
    
    this.department_id = "";
    this.department_label = "";
  }
  
  closeDoctorModal = () => {
    this.setState({isDoctorsOpen: false,});
  };
  
  closeModal = () => {
    this.setState({isOpenDoneModal: false});
  };
  
  isExistDeleteCache = () => {
    let result = false;
    
    let { cacheDelInjectState } = persistedState(this.props.patientId);
    if (!cacheDelInjectState)  return result;
    
    if (cacheDelInjectState.length > 0) {
      cacheDelInjectState.map(item=>{
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
  
  doDeleteOperation = () => {
    // init presData
    this.props.initInjectData();
    
    // do delete operation
    this.confirmOk();
  }
  
  cancelAlertModal = () => {
    this.setState({
      alertMessage: ""
    });
  }

  getDoneTimes = (_done_times=null) => {
    if (_done_times == null || _done_times.length < 1) return "";

    let result = _done_times.map((item, index)=>{
      return(
        <>
          <span> {index+1}回目 {item != "" ? item : "未定"}{index == (_done_times.length - 1) ? "":"、"}</span>
        </>
      );
    }); 

    return result;   
  }
  
  render() {
    const { isEdit, order, patientInfoObject } = this.state;
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
    
    const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let existDeleteCache = this.isExistDeleteCache();
    
    return (
      <Wrapper>
        <div
          className={
            ((this.props.is_enabled !== undefined && this.props.is_enabled === 2) || (this.props.order.stop_at != undefined && this.props.order.stop_at != "") || existDeleteCache
              ? "history-item line-through " : "history-item ") + this.props.class_name +
            ' inject-history inject-rp-'+order.order_number +
            ((this.gray_rps.includes(order.order_number)) ? ' doing ' : '')
          }
        >
          <div
            className="box w70p"
            draggable={
              ((this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION, this.context.AUTHS.REGISTER_PROXY, 0) == true ||
                this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION, this.context.AUTHS.REGISTER, 0) == true) ? true: false)
            }
            onDragStart={e => this.onDragStart(e, order.order_number)}
            onContextMenu={e => this.handleClick(e)}
          >
            <div className="flex between drug-item table-row">
              <div className="number"  style={underLine}>
                <span>{`Rp ${this.props.serial_number}`}</span>
              </div>
              <div className="text-right text-right-other">
                <div className="table-item">
                  {!order.usage_name ? "" : `手技: ${order.usage_name}`}
                </div>
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
            {order.med.map((medi, index) => {
              this.i += 1;
              return (
                <InjectionHistoryUl
                  key={this.i}
                  id={index}
                  medi={medi}
                  isEdit={isEdit}
                  serial_number={index === 0 ? this.props.serial_number : ""}
                />
              );
            })}
            {order.is_precision !== undefined && order.is_precision == 1 && (
              <div className="flex between option table-row">
                <div className="text-right table-item">【精密持続点滴】</div>
              </div>
            )}
            {order.administrate_period != undefined && order.administrate_period != null && (
              <div className="flex between option table-row">
                <div className="text-right table-item" style={{paddingLeft:"75px"}}>
                  <div>
                    1日{order.administrate_period.done_count}回 : {this.getDoneTimes(order.administrate_period.done_times)}
                  </div>
                  <div>
                    投与期間 : {formatJapanDateSlash(order.administrate_period.period_start_date)}～{formatJapanDateSlash(order.administrate_period.period_end_date)}
                  </div>
                  {order.administrate_period.period_type == 0 && order.administrate_period.period_category != null && (
                    <div>
                      間隔 : {order.administrate_period.period_category == 0 ? "日":order.administrate_period.period_category == 1 ? "週" : "月"}
                    </div>
                  )}
                  {order.administrate_period.period_type == 1 && order.administrate_period.period_week_days.length > 0 && (
                    <div>
                      曜日 : {getWeekNamesBySymbol(order.administrate_period.period_week_days)}
                    </div>
                  )}  
                  {order.administrate_period.start_count != undefined && order.administrate_period.done_days != undefined && ( order.administrate_period.start_count != 1 || order.administrate_period.end_count != order.administrate_period.done_count) && (
                    <>
                      <div>
                        初回 {formatJapanDateSlash(order.administrate_period.done_days[0])}の{order.administrate_period.start_count}回目から
                      </div>
                      <div>
                        最終 {formatJapanDateSlash(order.administrate_period.done_days[order.administrate_period.done_days.length - 1])}の{order.administrate_period.end_count}回目まで
                      </div>
                    </>
                  )}                
                </div>
                <div className="w80 table-item">
                  {order.administrate_period.days != undefined && order.administrate_period.days > 0 ? order.administrate_period.days+"日分":""}
                </div>
              </div>
            )}
            {order.insurance_type !== undefined && (
              <div className="flex between option table-row">
                <div className="text-right table-item">
                  {`保険: ${this.getInsurance(order.insurance_type)}`}
                </div>
              </div>
            )}
            {order.body_part !== undefined && order.body_part !== "" && (
              <div className="flex between option table-row">
                <div className="text-right table-item" style={{paddingLeft: "75px"}}>
                  {`部位/補足: ${order.body_part}`}
                </div>
              </div>
            )}
            {order.discontinuation_start_date !== undefined &&
            order.discontinuation_start_date !== "" && (
              <div className="flex between option table-row">
                <div className="text-right table-item">
                  {`中止期間の最初日: ${formatDate(
                    order.discontinuation_start_date
                  )}`}
                </div>
              </div>
            )}
            {order.discontinuation_end_date !== undefined &&
            order.discontinuation_end_date !== "" && (
              <div className="flex between option table-row">
                <div className="text-right table-item">
                  {`中止期間の最後日: ${formatDate(
                    order.discontinuation_end_date
                  )}`}
                </div>
              </div>
            )}
            {order.discontinuation_comment !== undefined &&
            order.discontinuation_comment !== "" && (
              <div className="flex between option table-row">
                <div className="text-right table-item">
                  {`中止コメント: ${order.discontinuation_comment}`}
                </div>
              </div>
            )}
            {((order.injectUsageName != undefined && order.injectUsageName != null && order.injectUsageName != "") || (order.usage_remarks_comment != undefined && order.usage_remarks_comment != null && order.usage_remarks_comment.length > 0)) && (
              <div className="flex between drug-item table-row">
                <div className="text-right">
                  <div className="table-item">
                    {order.injectUsageName && order.injectUsageName != "" ? `用法: ${order.injectUsageName}` : ""}
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
                </div>
              </div>
            )}
            {order.done_numbers != undefined && order.done_numbers != null && (order.done_numbers.length > 0 || Object.keys(order.done_numbers).length > 0) && (
              <div className="flex between option table-row">
                <div className="text-right table-item" style={{paddingLeft: 75}}>
                  {`実施状態: ${getPeriodInjectionRpDoneStatus(order.done_numbers) == 1 ? "実施済" : getPeriodInjectionRpDoneStatus(order.done_numbers) == 2 ? "実施中" : "未実施"}`}
                </div>
              </div>
            )}
          </div>
          {isPatientInfoField && this.props.serial_number === 1 ? (
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
          ) : (
            ""
          )}
          {authInfo != null && authInfo != undefined && authInfo.doctor_code != null && (
            <ContextMenu
              {...this.state.contextMenu}
              parent={this}
              doctor_code={authInfo.doctor_code}
              staff_category={authInfo.staff_category}
              isFromPrescriptionList={this.props.patientInfo === null}
              is_receipt_archive_data={this.props.is_receipt_archive_data}
              is_enabled={this.props.is_enabled}
              exist_del_cache = {existDeleteCache}
              current_date={getCurrentDate('-')}
              diagnosing_date={this.props.diagnosing_date}
              is_doctor_consented={this.props.is_doctor_consented}
              done_order={this.props.done_order}
              medicine={this.props.medicine}
            />
          )}
          {this.state.isDoctorsOpen === true ? (
            <SelectDoctorModal
              closeDoctor={this.closeDoctorModal}
              getDoctor={this.getDoctorModal}
              selectDoctorFromModal={this.selectDoctorFromModal}
              doctors={this.state.doctors}
            />
          ) : (
            ""
          )}
          {this.state.isOpenDeleteConfirmModal == true && (
            <DeleteOperationConfirmModal
              confirmCancel= {this.closeDeleteModal}
              confirmOk= {this.doDeleteOperation}
              modal_type= {"modal_delete"}
              type={"injection"}
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
          {this.state.isOpenDoneModal == true && (
            <DoneModal
              patientId={this.props.patientId}
              patientInfo={this.props.patientInfo}
              closeModal={this.closeModal}
              modal_type={this.state.done_modal_type}
              modal_title={this.state.done_modal_title}
              modal_data={this.state.done_modal_data}
              gotoUrl="injection"
            />
          )}
          {this.state.alertMessage == "death" && (
            <AlertNoFocusModal
              hideModal= {this.cancelAlertModal.bind(this)}
              handleOk= {this.cancelAlertModal.bind(this)}
              showMedicineContent= {"死亡した患者です。"}
            />
          )}
        </div>
      </Wrapper>
    );
  }
}
InjectionHistoryList.contextType = Context;

InjectionHistoryList.propTypes = {
  diagnosing_date: PropTypes.string,
  order: PropTypes.object,
  orderIndex: PropTypes.number,
  patientId: PropTypes.number,
  orderNumber: PropTypes.number,
  onCopyOrder: PropTypes.func,
  order_data: PropTypes.func,
  onCopyOrders: PropTypes.func,
  onEditOrders: PropTypes.func,
  doChangeDepartmentAction: PropTypes.func,
  onPrintOrders: PropTypes.func,
  onRegisterSet: PropTypes.func,
  serial_number: PropTypes.number,
  class_name: PropTypes.string,
  doctors: PropTypes.array,
  doctor_code: PropTypes.number,
  doctor_name: PropTypes.string,
  setDoctorInfo: PropTypes.func,
  patientInfo: PropTypes.array,
  is_doctor_consented: PropTypes.number,
  is_enabled: PropTypes.number,
  openNotConsentedModal: PropTypes.func,
  openSomeCompletedCancel: PropTypes.func,
  isNotConsentedPopup: PropTypes.bool,
  isNotConsentedDataLength: PropTypes.number,
  forNotConsentedCheckDoctorCode: PropTypes.number,
  patientInfoObject: PropTypes.Object,
  consent: PropTypes.func,
  getDelData: PropTypes.func,
  is_receipt_archive_data: PropTypes.number,
  done_order: PropTypes.number,
  medicine:PropTypes.object,
  openModal:PropTypes.func,
  initInjectData:PropTypes.func,
  stopPeriodRp:PropTypes.func,
  stopPeriodOrder:PropTypes.func,
  stopPeriodInjectionCategory:PropTypes.func,
  cacheSerialNumber: PropTypes.number,
  isEdit: PropTypes.bool,
  is_completed: PropTypes.number,
};

export default InjectionHistoryList;
