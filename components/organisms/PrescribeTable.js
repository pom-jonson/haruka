/* eslint-disable consistent-this */
import React, { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import styled from "styled-components";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import $ from "jquery";
import * as colors from "../_nano/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Context from "~/helpers/configureStore";
import MedicineDetailModal from "./MedicineDetailModal";
import * as apiClient from "../../api/apiClient";
import {
  faPlusSquare,
  faPenSquare,
  faTimesSquare,
  faTrash,
  faCommentPlus,
  faMortarPestle,
  faCapsules,
  faBookMedical,
  faCheck,
  faSack,
  faPlus
} from "@fortawesome/pro-regular-svg-icons";
import PrescribePopup from "./PrescribePopup";
import PrescribeTableBody from "./PrescribeTableBody";
import MedPopup from "./MedPopup";
import Button from "../atoms/Button";
import SelectDoctorModal from "../templates/Patient/components/SelectDoctorModal";
import MedicineBodyParts from "../molecules/MedicineBodyParts";
import {CACHE_LOCALNAMES, LETTER_DATA, PERMISSION_TYPE, KARTEMODE, CACHE_SESSIONNAMES, BOILERPLATE_FUNCTION_ID_CATEGORY} from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";
import * as sessApi from "~/helpers/cacheSession-utils";
import {formatDate, formatJapanDateSlash, getCurrentDate, getWeekNamesBySymbol} from "~/helpers/date";
registerLocale("ja", ja);
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import Spinner from "react-bootstrap/Spinner";
import {setDateColorClassName} from "~/helpers/dialConstants";

const SpinnerWrapper = styled.div`
  // height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  background: #f1f3f4;
  width: 50%;
  z-index: 1;
  height: calc(100vh - 280px);
`;


const Wrapper = styled.div`
  background-color: ${colors.onSecondaryLight};
  border: 1px solid ${colors.disable};
  width: 100%;
  margin-bottom: 16px;
  .usage-permission-allow{
    background-color: #ffffcc; 
  }
  .stop-prescription-div{
    pointer-events:none;
    background-color: rgb(229, 229, 229);
  }
  .usage-permission-reject{
    background-color: #ffddcc; 
  }
  .prescribe-table {
    padding-top: 8px;
    position: relative;
    &:before {
      content: "";
      background-color: ${colors.disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 75px;
    }
    &:after {
      content: "";
      background-color: ${colors.disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      right: 80px;
    }
    &:first-child {
      padding-top: 0;
      .prescribe-box {
        border-top: none;
      }
    }
  }

  .line-through{
    text-decoration: line-through;
  }

  ul{
    margin-bottom: 0px;
  }
`;

const PresBox = styled.div`
  border-top: 1px solid ${colors.disable};
  font-size: 12px;
  width: 100%;
  .table-row {
    border-bottom: 1px solid ${colors.disable};
    line-height: 1.3;
    &:hover {
      background-color: ${colors.background};
      cursor: pointer;
    }
  }
  .dl-box {
    padding: 0 4px;
  }
  input {
    width: 100%;
    margin: -2px 0;
  }
  .flex {
    display: flex;
    padding: 4px;
    margin-bottom: 0;
    &.between {
      justify-content: space-between;
      div {
        margin-right: 0;
      }
    }
    .date {
      margin-left: auto;
      margin-right: 24px;
    }
  }
  .patient-name {
    margin-left: 16px;
  }
  .doctor {
    margin-left: 140px;
  }
  .comment-item {
    text-align: right;
    width: 100%;
    padding: 4px 85px 4px 80px;
  }
  .comment {
    width: 100%;
    padding: 4px 85px 4px 80px;
    input {
      width: 100%;
      text-align: right;
    }
  }
  .rp-number {
    margin-right: 4px;
    width: 75px;
  }
  .medicine {
    width: calc(100% - 163px);
    display: flex;
    .mcinput{
      width: 90% !important;
    }
  }
  .medicine_alert{
    background-color: #ffddcc;
  }
  .medicine_duplicate{
    background-color: #ffffcc;
  }  
  .remarks-comment {
    text-align: center;
    padding: 4px;
    input {
      width: calc(100% - 163px);
      text-align: right;
    }
  }
  .full-text {
    width: 100%;
    text-align: right;
    margin-right: 11px;
  }
  .btn-area {
    padding: 0 4px;
    width: 75px;
  }
  .unit {
    margin-left: auto;
    text-align: right;
    width: 80px;
  }
  .text-right {
    width: calc(100% - 155px);
  }
  .span-inline{
    span{
      display: inline-block;
    }
  }
  .usage-select {
    background-color: ${colors.surface};
    border: 1px solid #ced4da;
    padding: 0 4px;
    min-width: auto;
    span {
      color: ${colors.midEmphasis};
      font-weight: normal;
      letter-spacing: 0;
    }
  }
  .prescribe-date{
    .react-datepicker-wrapper{
      input{
        width:90px;
      }
    }
    
    .react-datepicker-popper{
      left: -14rem !important;
    }
    .react-datepicker__triangle{
      margin-left: 14.5rem;
    }
  }
  dt {
    font-weight: normal;
  }
  dd {
    margin: 0 0 0 16px;
  }
  .ml {
    margin-left: 20px;
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
    max-height: 31rem;
    overflow-y: auto;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 0.1rem 12px;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .blue-text {
    color: blue;
  }
  .pos-left{
    min-width: 290px;
    div{
      width: 100%;
      text-align: right;
    }
  }
`;

// const initData = {
//   medicines: [
//     {
//       medicineId: 0,
//       medicineName: "",
//       amount: 0,
//       unit: "",
//       main_unit_flag: 1,
//       is_not_generic: 0,
//       can_generic_name: 0,
//       milling: 0,
//       separate_packaging: 0,
//       usage_comment: "",
//       usage_optional_num: 0,
//       poultice_times_one_day: 0,
//       poultice_one_day: 0,
//       poultice_days: 0,
//       free_comment: [],
//       uneven_values: []
//     }
//   ],
//   units: [],
//   days: 0,
//   days_suffix: "",
//   usage: 0,
//   usageName: "",
//   usageIndex: 0,
//   year: "",
//   month: "",
//   date: "",
//   supply_med_info: 0,
//   med_consult: 0,  
//   temporary_medication: 0,
//   one_dose_package: 0,
//   medical_business_diagnosing_type: 0,
//   insurance_type: 0,
//   body_part: "",
//   usage_remarks_comment: [],
//   start_date: getCurrentDate()
// };

const Icon = styled(FontAwesomeIcon)`
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  margin-right: 4px;
`;

const UssageMenu = ({ visible, x, y, parent, presData, karteStatus, isForUpdate, in_out }) => {
  if (visible) {
    const order = presData[parent.state.indexOfPres];
    let enable_days = 0;
    /*@cc_on 
    var w = window;
    eval('var window = w');
    @*/
    /*@cc_on 
    var w = window;
    eval('var window = w');
    @*/
    let usageCacheData = JSON.parse(window.localStorage.getItem('haruka_cache_usageData'));
    if (usageCacheData != undefined && usageCacheData != null) {
      if (order.usage != undefined && order.usage != null && order.usage != '') {
        let usage_data = null;
        let usageData;
        Object.keys(usageCacheData).map((kind)=>{
          usageData = usageCacheData[kind];	
          Object.keys(usageData).map((idx)=>{
            usageData[idx].map((item)=>{
              if(item.code == order.usage){
                usage_data = item;	
              } 
            })
          });
        });
        if (usage_data != null && usage_data.enable_days != undefined) {
          enable_days = usage_data.enable_days;
        }
      }
    }
    // YJ272 入院処方で、投与期間入力は「定期」でしか使えないように
    let existAdministratePeriod = false;
    presData.map(item=>{
      if (item.administrate_period != undefined && item.administrate_period != null) {
        existAdministratePeriod = true;
      }
    });
    return (
      <ContextMenuUl>
        <ul className="context-menu ussage-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li className={'ussage_regular_comment-menu'}>
            <div onMouseOver={(e) =>parent.contextMenuAction("ussage_regular_comment", presData, e, x, y)}>追加用法コメント(定型)</div>
          </li>
          <li>
            <div
              onClick={() =>parent.contextMenuAction("ussage_comment", presData)}
              onMouseOver={() => parent.closeHoverMenu()}
            >
              追加用法コメント
            </div>
          </li>
          {(order.body_part === undefined || order.body_part === "") && (
            <li>
              <div
                onClick={() => parent.contextMenuAction("body_part", presData)}
                onMouseOver={() => parent.closeHoverMenu()}
              >
                部位指定コメント
              </div>
            </li>
          )}
          {/*「一包化」「粉砕」は内服薬用の用法のRPだけ設定できるように*/}
          {order.allowed_diagnosis_division != undefined && (order.allowed_diagnosis_division.includes("21") || order.allowed_diagnosis_division.includes("21")) ? (
            <li>
              <div
                onClick={() =>parent.contextMenuAction("one_dose_package_action", presData)}
                onMouseOver={() => parent.closeHoverMenu()}
                className={order.one_dose_package == 1 ? "blue-text" : ""}
              >
                一包化
              </div>
            </li>
          ):(
            <></>
          )}
          {order.allowed_diagnosis_division != undefined && order.allowed_diagnosis_division.includes("23") ? (
            <li>
              <div
                onClick={() =>parent.contextMenuAction("mixture_action", presData)}
                onMouseOver={() => parent.closeHoverMenu()}
                className={order.mixture == 1 ? "blue-text" : ""}
              >
                混合
              </div>
            </li>
          ):(
            <></>
          )}
          <li>
            <div
              onClick={() =>parent.contextMenuAction("temporary_medication_action",presData)}
              onMouseOver={() => parent.closeHoverMenu()}
              className={order.temporary_medication == 1 ? "blue-text" : ""}
            >
              臨時処方
            </div>
          </li>
          {enable_days == 1 && (
            <li><div onClick={() =>parent.contextMenuAction("ussage_day_change", presData)} onMouseOver={() => parent.closeHoverMenu()}>日数変更</div></li>
          )}
          <li>
            <div
              onClick={() =>parent.contextMenuAction("startdate_edit", presData)}
              onMouseOver={() => parent.closeHoverMenu()}
            >
              処方開始日変更
            </div>
          </li>
          <li>
            <div
              onClick={() =>parent.contextMenuAction("insurance_edit", presData)}
              onMouseOver={() => parent.closeHoverMenu()}
            >
              保険変更
            </div>
          </li>
          {karteStatus == 1 && (!isForUpdate || existAdministratePeriod == true) && in_out == 3 && (
            <li>
              <div
                onClick={() => parent.contextMenuAction("administrate_period", presData)}
                onMouseOver={() => parent.closeHoverMenu()}
              >投与期間入力</div></li>
          )}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const UssageCommentMenu = ({ visible, x, y, parent, presData }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div
              onClick={() =>
                parent.contextMenuAction("ussage_comment_edit", presData)
              }
            >
              コメント変更
            </div>
          </li>
          <li>
            <div
              onClick={() =>
                parent.contextMenuAction("ussage_comment_remove", presData)
              }
            >
              コメント削除
            </div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const BodyPartMenu = ({ visible, x, y, parent, presData }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu body-part-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div
              onClick={() =>
                parent.contextMenuAction("body_part_edit", presData)
              }
            >
              部位指定コメント変更
            </div>
          </li>
          <li>
            <div
              onClick={() =>
                parent.contextMenuAction("body_part_remove", presData)
              }
            >
              部位指定コメント削除
            </div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const CommentMenu = ({ visible, x, y, parent, presData }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu comment-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div
              onClick={() => parent.contextMenuAction("comment_edit", presData)}
            >
              コメント変更
            </div>
          </li>
          <li>
            <div
              onClick={() =>
                parent.contextMenuAction("comment_remove", presData)
              }
            >
              コメント削除
            </div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const AdministrateMenu = ({ visible, x, y, parent, presData }) => {
  if (visible) {    
    return (
      <ContextMenuUl>
        <ul className="context-menu administrate-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div              
              onClick={() => parent.contextMenuAction("administrate_period_edit", presData)}
            >
              期間変更
            </div>
          </li>
          <li>
            <div
              onClick={() =>
                parent.contextMenuAction("administrate_remove", presData)
              }
            >
              期間削除
            </div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const ContextMenu = ({ visible, x, y,preset_menu_array, parent, presData }) => {
  const drugCount =
    presData[parent.state.indexOfPres] !== undefined
      ? presData[parent.state.indexOfPres].medicines.length
      : 0;
  const medicine =
    presData[parent.state.indexOfPres] !== undefined
      ? presData[parent.state.indexOfPres].medicines[parent.state.indexOfMed]
      : undefined;
  const order = presData[parent.state.indexOfPres];
  const showDiagnosis = (medicine != undefined && medicine != null && medicine.diagnosis_permission != undefined && medicine.diagnosis_permission != 0);
  if (visible && presData.length > 0 && parent.not_show_menu != 1) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div
              onClick={() => parent.contextMenuAction("newdrug", presData)}
              onMouseOver={() => parent.closeHoverMenu()}
            >
              <Icon icon={faPlusSquare} />
              薬品の登録
            </div>
          </li>
          <li>
            <div
              onClick={() => parent.contextMenuAction("drugchange", presData)}
              onMouseOver={() => parent.closeHoverMenu()}
            >
              <Icon icon={faPenSquare} />
              薬品と数量の変更
            </div>
          </li>
          <li>
            <div
              onClick={() =>parent.contextMenuAction("drug_amount_change", presData)}
              onMouseOver={() => parent.closeHoverMenu()}
            >
              <Icon icon={faPenSquare} />
              数量の変更
            </div>
          </li>
          {drugCount != 1 && (
            <li>
              <div
                onClick={() => parent.contextMenuAction("drugdel", presData)}
                onMouseOver={() => parent.closeHoverMenu()}
              >
                <Icon icon={faTimesSquare} />
                薬品の削除
              </div>
            </li>
          )}
          <li>
            <div onClick={() => parent.contextMenuAction("paragraphdel", presData)} onMouseOver={() => parent.closeHoverMenu()}>
              <Icon icon={faTrash} />区切りの削除
            </div>
          </li>
          <li className="comment-regular-menu">
            <div onMouseOver={(e) => parent.contextMenuAction("comment_regular", presData, e, x, y)}>
              <Icon icon={faCommentPlus} />
              コメント
            </div>
          </li>
          <li>
            <div
              onClick={() => parent.contextMenuAction("comment", presData)}
              onMouseOver={() => parent.closeHoverMenu()}
            >
              <Icon icon={faCommentPlus} />
              フリーコメント
            </div>
          </li>
          {/*「一包化」「粉砕」は内服薬用の用法のRPだけ設定できるように*/}
          {order != undefined && order.allowed_diagnosis_division != undefined && (order.allowed_diagnosis_division.includes("21") || order.allowed_diagnosis_division.includes("21")) ? (
            <li>
              <div
                onClick={() =>parent.contextMenuAction("milling_action", presData)}
                onMouseOver={() => parent.closeHoverMenu()}
                className={medicine.milling != undefined && medicine.milling == 1 ? "blue-text" : ""}
              >
                <Icon icon={faMortarPestle} />
                粉砕
              </div>
            </li>
          ):(
            <></>
          )}
          <li>
            <div
              onClick={() =>parent.contextMenuAction("is_not_generic_action", presData)}
              onMouseOver={() => parent.closeHoverMenu()}
              className={medicine.is_not_generic != undefined && medicine.is_not_generic == 1 ? "blue-text" : ""}
            >
              <Icon icon={faCheck} />
              後発不可
            </div>
          </li>
          <li>
            <div
              onClick={() =>parent.contextMenuAction("can_generic_name_action", presData)}
              onMouseOver={() => parent.closeHoverMenu()}
              className={medicine.can_generic_name != undefined && medicine.can_generic_name == 1 ? "blue-text" : ""}
            >
              <Icon icon={faCapsules} />
              一般名処方
            </div>
          </li>
          <li>
            <div
              onClick={() =>parent.contextMenuAction("separate_packaging_action",presData)}
              onMouseOver={() => parent.closeHoverMenu()}
              className={medicine.separate_packaging == 1 ? "blue-text" : ""}
            >
              <Icon icon={faSack} />
              別包
            </div>
          </li>
          {parent.state.canViewDetail && (
            <li>
              <div
                onClick={() => parent.contextMenuAction("viewDetail", presData)}
                onMouseOver={() => parent.closeHoverMenu()}
              >
                <Icon icon={faBookMedical} />
                詳細情報の閲覧
              </div>
            </li>
          )}
          {showDiagnosis && (
            <li>
              <div
                onClick={() => parent.contextMenuAction("viewDiagnosis", presData)}
                onMouseOver={() => parent.closeHoverMenu()}
              >
                <Icon icon={faBookMedical} />
                区分跨り許可
              </div>
            </li>
          )}
          {medicine.disease_permission !== undefined && medicine.disease_permission !== 0 && medicine.medicineName != "" && (
            <li>
              <div
                className={medicine.disease_permission == -1 && "usage-permission-reject"}
                onClick={() => parent.contextMenuAction(PERMISSION_TYPE.DISEASE, presData)}
                onMouseOver={() => parent.closeHoverMenu()}
              >
                <Icon icon={faCheck} />
                禁忌情報の確認
              </div>
            </li>
          )}
          {medicine.alert_permission !== undefined && medicine.alert_permission !== 0 && medicine.medicineName != "" && (
            <li>
              <div
                className={medicine.alert_permission == -1 && "usage-permission-reject"}
                onClick={() => parent.contextMenuAction(PERMISSION_TYPE.ALERT, presData)}
                onMouseOver={() => parent.closeHoverMenu()}
              >
                <Icon icon={faCheck} />
                相互作用情報の確認
              </div>
            </li>
          )}
          {medicine.usage_permission !== undefined && medicine.usage_permission !== 0 && medicine.medicineName != "" && (
            <li>
              <div
                className={medicine.usage_permission == -1 && "usage-permission-reject"}
                onClick={() => parent.contextMenuAction(PERMISSION_TYPE.USAGE, presData)}
                onMouseOver={() => parent.closeHoverMenu()}
              >
                <Icon icon={faCheck} />
                用量情報確認
              </div>
            </li>
          )}
          {medicine.duplciate_permission !== undefined && medicine.duplciate_permission !== 0 && medicine.medicineName != "" && (
            <li>
              <div
                className={medicine.duplciate_permission == -1 && "usage-permission-reject"}
                onClick={() => parent.contextMenuAction(PERMISSION_TYPE.DUPLICATE, presData)}
                onMouseOver={() => parent.closeHoverMenu()}
              >
                <Icon icon={faCheck} />
                重複の確認
              </div>
            </li>
          )}
          {medicine.diagnosis_permission !== undefined && medicine.diagnosis_permission !== 0 && medicine.medicineName != "" && (
            <li>
              <div
                className={medicine.diagnosis_permission == -1 && "usage-permission-reject"}
                onClick={() => parent.contextMenuAction(PERMISSION_TYPE.DIAGNOSIS, presData)}
                onMouseOver={() => parent.closeHoverMenu()}
              >
                <Icon icon={faCheck} />
                区分跨ぎ情報の確認
              </div>
            </li>
          )}
          {preset_menu_array !== undefined && preset_menu_array != null && preset_menu_array.length > 0 && preset_menu_array.map((item,index)=>{
            return (<li key={index}><div onClick={() =>parent.contextMenuAction("prescription_do_set",presData,index)}><Icon icon={faPlus}/>{item}</div></li>)
          })}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const HoverFirstMenu = ({ visible, x, y, parent, presData, menu_data }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu hover-first-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {menu_data.map((item,index)=>{
            return (
              <li key={index} className={'hover-first-menu'+index}><div onMouseOver={() => parent.setHover(x,y,presData,item, index)} onClick={() => parent.contextMenuAction("first_hover_comment", presData, item)}>{item.category_name}{item.body}</div></li>
            )
          })}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const HoverSecondMenu = ({ visible, x, y, parent, presData, menu_data }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className={`context-menu hover-second-menu ${parent.second_menu_pos == "left" ? "pos-left":""}`} style={{ left: `${x}px`, top: `${y}px` }}>
          {menu_data.map((item,index)=>{
            return (
              <li key={index}><div onClick={() => parent.contextMenuAction("second_hover_comment", presData, item)}>{item.body}</div></li>
            )
          })}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class PrescribeTable extends Component {
  constructor(props) {
    super(props);
    /*@cc_on 
    var w = window;
    eval('var window = w');
    @*/
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    // const { presData } = this.props;
    this.state = {
      isLoaded: false,
      isForUpdate: this.props.isForUpdate != undefined && this.props.isForUpdate != null ? this.props.isForUpdate : false,
      isPropsLoaded: props.isLoaded,
      stopLoadingFlag: props.stopLoadingFlag,
      medShow: false,
      show: false,
      medicine: {},
      indexNum: 0,
      medicineData: [],
      contextMenu: {
        visible: false,
        x: 0,
        y: 0
      },
      commentMenu: {
        visible: false,
        x: 0,
        y: 0
      },
      ussageMenu: {
        visible: false,
        x: 0,
        y: 0
      },
      ussageCommentMenu: {
        visible: false,
        x: 0,
        y: 0
      },
      administrateMenu: {
        visible: false,
        x: 0,
        y: 0
      },
      bodyPartMenu: {
        visible: false,
        x: 0,
        y: 0
      },
      indexOfPres: 0,
      indexOfMed: 0,
      indexOfInsertPres: 0,
      indexOfInsertMed: 0,
      comment: {
        indexOfPres: -1,
        indexOfMed: -1
      },
      start_date_edit: {
        indexOfPres: -1,
        start_date: ""
      },
      free_comment: "",
      usage_remarks_comment_index: -1,
      usage_remarks_comment: "",
      comment_edit_index: -1,
      medicine_comment_eedit_index: -1,
      start_date_edit_index: -1,
      isDoctorsOpen: false,
      selectedDoctorID: this.props.doctor_code,
      selectedDoctorName: this.props.doctor_name,
      currentUserName: authInfo.name,
      canEdit: authInfo.staff_category === 1,
      staff_category: authInfo.staff_category || 2,
      insurance_type_edit: {
        index: -1,
        value: 0
      },
      insurance_type_edit_index: -1,
      canViewDetail: false,
      showMedicineDetail: false,
      medicineDetail: [],
      presData: this.props.presData,
      isExistPrefixMedicine: false,
      confirm_message:"",
      supply_med_info: this.props.supply_med_info ? this.props.supply_med_info: 0,
      med_consult: this.props.med_consult ? this.props.med_consult: 0,
      in_out: this.props.in_out ? this.props.in_out: 0,
      // isLastDate: false
    };

    this.changeState = false;
    this.changeProps = false;
    this.preset_do_count = null;
    this.boilerplate_master = null;
    this.boilerplate_master_category = null;
    this.body_part = "";

    // manage showing position second menu of コメント and 追加用法コメント(定型)
    this.second_menu_pos = "right";

    // ●YJ884 薬剤検索時に依頼医選択が割り込んだ時に、クリックで選ぶと検索はキャンセルされた扱いになる
    this.word = null;
    this.indexOfPresData = null;
    this.indexOfMedicines = null;   
    
    // YJ1033 処方の区切りの削除でシステムエラーになる
    this.not_show_menu = 0;
  }

  componentDidMount() {
    this.setState({
      _unusedDrugSearch: this.props.unusedDrugSearch,
      _profesSearch: this.props.profesSearch,
      _normalNameSearch: this.props.normalNameSearch
    });
    this.getBoilerplateMenu();

    // ●YJ884 薬剤検索時に依頼医選択が割り込んだ時に、クリックで選ぶと検索はキャンセルされた扱いになる
    this.word = null;
    this.indexOfPresData = null;
    this.indexOfMedicines = null;    
  }

  handleClose() {
    this.setState({ show: false});
  }

  handleShow(medicine, indexNum) {
    this.setState({ show: true, medicine: medicine, indexNum: indexNum });
  }

  formatDate = dateStr => {
    dateStr = "" + dateStr;
    let newDate = new Date(
      dateStr.substring(0, 4),
      dateStr.substring(4, 6) - 1,
      dateStr.substring(6, 8)
    );
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();

    return `${year}-${month < 10 ? `0${month}` : `${month}`}-${
      date < 10 ? `0${date}` : `${date}`
      }`;
  };

  getDateStr = date => {
    var y = date.getFullYear();
    var m = ("00" + (date.getMonth() + 1)).slice(-2);
    var d = ("00" + date.getDate()).slice(-2);
    return y + m + d;
  };

  handleClick(e,presData,indexOfPresData,indexOfMedicines,menu_type,comment_edit_index = -1) {
    this.not_show_menu = 0;
    /*@cc_on 
    var w = window;
    eval('var window = w');
    @*/

    /*@cc_on 
    var doc = document;
    eval('var document = doc');
    @*/

    // check is update => not show 投与期間入力 menu
    let cacheState = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.props.cacheSerialNumber);
    // check item_details
    let isUpdatePrescription = false;
    if (cacheState != undefined && 
      cacheState != null && 
      cacheState[0] != undefined && 
      cacheState[0] != null && 
      cacheState[0]['isUpdate'] == 1) {
        isUpdatePrescription = true;
    }
    
    // this.second_menu_pos
    this.second_menu_pos = "right";
    if (this.context.$getKarteMode(this.props.patientId) == KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
    let clientX = e.clientX;
    let clientY = e.clientY;
    let state_data = {};
    state_data['canViewDetail'] = false;
    if(presData[indexOfPresData].medicines[indexOfMedicines].exists_detail_information === 1){
      state_data['canViewDetail'] = true;
    }
    var index;
    if (menu_type < 2) {
      index = comment_edit_index == -1 ? presData[indexOfPresData].medicines[indexOfMedicines].free_comment.length : comment_edit_index;
    } else if (menu_type === 5 || menu_type === 6 || menu_type === 9) {
      index = indexOfPresData;
    } else {
      index = comment_edit_index == -1 ? presData[indexOfPresData].usage_remarks_comment.length : comment_edit_index;
    }

    if (e.type === "contextmenu") {    
      if (((presData.length - 1) != indexOfPresData) || ((presData[presData.length - 1].medicines.length - 1) != indexOfMedicines) || this.state.isForUpdate == true) {
        state_data['indexOfPres'] = indexOfPresData;
        state_data['indexOfMed'] = indexOfMedicines;
        e.preventDefault();
        e.target.click();

        if (menu_type == 1) {
          const that = this;
          document.addEventListener(`click`, function onClickOutside() {
            that.setState({
              commentMenu: { visible: false }
            });
            document.removeEventListener(`click`, onClickOutside);
          });
          window.addEventListener("scroll", function onScrollOutside() {
            that.setState({
              commentMenu: { visible: false }
            });
            window.removeEventListener(`scroll`, onScrollOutside);
          });
          document
            .getElementById("prescribe-container")
            .addEventListener("scroll", function onScrollOutside() {
              that.setState({
                commentMenu: { visible: false }
              });
              document
                .getElementById("prescribe-container")
                .removeEventListener(`scroll`, onScrollOutside);
            });
          state_data['commentMenu'] = {
            visible: true,
            x: e.clientX - $('#div-history').offset().left,
            y: e.clientY + window.pageYOffset - 120
          };
          state_data['medicine_comment_eedit_index'] = index;
          state_data['contextMenu'] = { visible: false };
          state_data['ussageMenu'] = { visible: false };
          state_data['bodyPartMenu'] = { visible: false };
          state_data['ussageCommentMenu'] = { visible: false };
          state_data['administrateMenu'] = { visible: false };
          this.setState(state_data, ()=>{
            let menu_height = document.getElementsByClassName("comment-menu")[0].offsetHeight;
            let menu_width = document.getElementsByClassName("comment-menu")[0].offsetWidth;
            let window_height = window.innerHeight;
            let window_width = window.innerWidth;
            if (((clientY + menu_height) > window_height) && ((clientX + menu_width + 190) > window_width)) {
              state_data['commentMenu']['x'] = clientX - $('#div-history').offset().left - menu_width;
              state_data['commentMenu']['y'] = clientY + window.pageYOffset - 120 - menu_height;
            } else if (((clientY + menu_height) > window_height) && ((clientX + menu_width + 190) < window_width)) {
              state_data['commentMenu']['x'] = clientX - $('#div-history').offset().left;
              state_data['commentMenu']['y'] = clientY + window.pageYOffset - 120 - menu_height;
            } else if (((clientY + menu_height) < window_height) && ((clientX + menu_width + 190) > window_width)) {
              state_data['commentMenu']['x'] = clientX - $('#div-history').offset().left - menu_width;
              state_data['commentMenu']['y'] = clientY + window.pageYOffset - 120;
            }
            this.setState(state_data);
          });
        } else if (menu_type == 0) {
          const that = this;
          document.addEventListener(`click`, function onClickOutside() {
            that.setState({
              contextMenu: { visible: false }
            });
            document.removeEventListener(`click`, onClickOutside);
          });
          window.addEventListener("scroll", function onScrollOutside() {
            that.setState({
              contextMenu: { visible: false }
            });
            window.removeEventListener(`scroll`, onScrollOutside);
          });
          document
            .getElementById("prescribe-container")
            .addEventListener("scroll", function onScrollOutside() {
              that.setState({
                contextMenu: { visible: false }
              });
              document
                .getElementById("prescribe-container")
                .removeEventListener(`scroll`, onScrollOutside);
            });
          let preset_menu_array = [];
          if (this.context.$canDoAction(this.context.FEATURES.PRESET_DO_PRESCRIPTION,this.context.AUTHS.REGISTER)){
            let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
            let patient_do_max_number = initState.patient_do_max_number;
            let preset_do_data = karteApi.getVal(this.props.patientId,CACHE_LOCALNAMES.PRESET_DO_PRESCRIPTION);
            let preset_do_count = 0;
            if (preset_do_data == undefined || preset_do_data == null || preset_do_data.length == 0){
              preset_do_count = 1;
            } else {
              preset_do_count = preset_do_data.length >= patient_do_max_number ? patient_do_max_number: preset_do_data.length + 1;
            }
            if (preset_do_count==1) {
              preset_menu_array.push("処方Do登録");
            } else {
              for (var i=1; i<=preset_do_count; i++) {
                let menu_str = "処方Do" + "(" + i +")" + "登録";
                preset_menu_array.push(menu_str);
              }
            }
          }
          state_data['contextMenu'] = {
            visible: true,
            x: e.clientX - $('#div-history').offset().left,
            y: e.clientY + window.pageYOffset - 120,
            preset_menu_array,
          };
          state_data['medicine_comment_eedit_index'] = index;
          state_data['commentMenu'] = { visible: false };
          state_data['ussageMenu'] = { visible: false };
          state_data['bodyPartMenu'] = { visible: false };
          state_data['ussageCommentMenu'] = { visible: false };
          state_data['administrateMenu'] = { visible: false };
          this.setState(state_data, ()=>{
            let menu_height = document.getElementsByClassName("context-menu")[0].offsetHeight;
            let menu_width = document.getElementsByClassName("context-menu")[0].offsetWidth;
            let window_height = window.innerHeight;
            let window_width = window.innerWidth;
            if (((clientY + menu_height) > window_height) && ((clientX + menu_width + 190) > window_width)) {
              state_data['contextMenu']['x'] = clientX - $('#div-history').offset().left - menu_width;
              state_data['contextMenu']['y'] = clientY + window.pageYOffset - 120;
            } else if (((clientY + menu_height) > window_height) && ((clientX + menu_width + 190) < window_width)) {
              state_data['contextMenu']['x'] = clientX - $('#div-history').offset().left;
              state_data['contextMenu']['y'] = clientY + window.pageYOffset - menu_height -120;
            } else if (((clientY + menu_height) < window_height) && ((clientX + menu_width + 190) > window_width)) {
              this.second_menu_pos = "left";
              state_data['contextMenu']['x'] = clientX-menu_width - $('#div-history').offset().left;
              state_data['contextMenu']['y'] = clientY + window.pageYOffset - 120;
            }
            this.setState(state_data);
          });
        } else if (menu_type == 2 || menu_type == 6 || menu_type == 5) {
          const that = this;
          document.addEventListener(`click`, function onClickOutside() {
            that.setState({
              ussageMenu: { visible: false }
            });
            document.removeEventListener(`click`, onClickOutside);
          });
          window.addEventListener("scroll", function onScrollOutside() {
            that.setState({
              ussageMenu: { visible: false }
            });
            window.removeEventListener(`scroll`, onScrollOutside);
          });
          document
            .getElementById("prescribe-container")
            .addEventListener("scroll", function onScrollOutside() {
              that.setState({
                ussageMenu: { visible: false }
              });
              document
                .getElementById("prescribe-container")
                .removeEventListener(`scroll`, onScrollOutside);
            });
          state_data['ussageMenu'] = {
            visible: true,
            x: e.clientX - $('#div-history').offset().left,
            y: e.clientY + window.pageYOffset - 120,
          };
          state_data['comment_edit_index'] = index;
          state_data['insurance_type_edit_index'] = indexOfPresData;
          state_data['start_date_edit_index'] = indexOfPresData;
          state_data['isUpdatePrescription'] = isUpdatePrescription;
          state_data['commentMenu'] = { visible: false };
          state_data['contextMenu'] = { visible: false };
          state_data['bodyPartMenu'] = { visible: false };
          state_data['ussageCommentMenu'] = { visible: false };
          state_data['administrateMenu'] = { visible: false };
          this.setState(state_data, ()=>{
            let menu_height = document.getElementsByClassName("ussage-menu")[0].offsetHeight;
            let menu_width = document.getElementsByClassName("ussage-menu")[0].offsetWidth;
            let window_height = window.innerHeight;
            let window_width = window.innerWidth;
            if (((clientY + menu_height) > window_height) && ((clientX + menu_width + 190) > window_width)) {
              state_data['ussageMenu']['x'] = clientX - $('#div-history').offset().left -menu_width;
              state_data['ussageMenu']['y'] = clientY + window.pageYOffset - 120 - menu_height;
            } else if (((clientY + menu_height) > window_height) && ((clientX + menu_width + 190) < window_width)) {
              state_data['ussageMenu']['x'] = clientX - $('#div-history').offset().left;
              state_data['ussageMenu']['y'] = clientY + window.pageYOffset - 120 - menu_height;
            } else if (((clientY + menu_height) < window_height) && ((clientX + menu_width + 190) > window_width)) {
              this.second_menu_pos = "left";
              state_data['ussageMenu']['x'] = clientX - $('#div-history').offset().left - menu_width;
              state_data['ussageMenu']['y'] =clientY + window.pageYOffset - 120;
            }
            this.setState(state_data);
          });
        } else if (menu_type == 9) {
          const that = this;
          document.addEventListener(`click`, function onClickOutside() {
            that.setState({
              bodyPartMenu: { visible: false }
            });
            document.removeEventListener(`click`, onClickOutside);
          });
          window.addEventListener("scroll", function onScrollOutside() {
            that.setState({
              bodyPartMenu: { visible: false }
            });
            window.removeEventListener(`scroll`, onScrollOutside);
          });
          document
            .getElementById("prescribe-container")
            .addEventListener("scroll", function onScrollOutside() {
              that.setState({
                bodyPartMenu: { visible: false }
              });
              document
                .getElementById("prescribe-container")
                .removeEventListener(`scroll`, onScrollOutside);
            });
          state_data['bodyPartMenu'] = {
            visible: true,
            x: e.clientX - $('#div-history').offset().left,
            y: e.clientY + window.pageYOffset - 120,
          };
          state_data['insurance_type_edit_index'] = indexOfPresData;
          state_data['commentMenu'] = { visible: false };
          state_data['contextMenu'] = { visible: false };
          state_data['ussageMenu'] = { visible: false };
          state_data['ussageCommentMenu'] = { visible: false };
          state_data['administrateMenu'] = { visible: false };
          this.setState(state_data, ()=>{
            let menu_height = document.getElementsByClassName("body-part-menu")[0].offsetHeight;
            let menu_width = document.getElementsByClassName("body-part-menu")[0].offsetWidth;
            let window_height = window.innerHeight;
            let window_width = window.innerWidth;
            if (((clientY + menu_height) > window_height) && ((clientX + menu_width + 190) > window_width)) {
              state_data['bodyPartMenu']['x'] = clientX - $('#div-history').offset().left-menu_width;
              state_data['bodyPartMenu']['y'] = clientY + window.pageYOffset - 120 - menu_height;
            } else if (((clientY + menu_height) > window_height) && ((clientX + menu_width + 190) < window_width)) {
              state_data['bodyPartMenu']['x'] = clientX - $('#div-history').offset().left;
              state_data['bodyPartMenu']['y'] = clientY + window.pageYOffset - 120 - menu_height;
            } else if (((clientY + menu_height) < window_height) && ((clientX + menu_width + 190) > window_width)) {
              state_data['bodyPartMenu']['x'] = clientX - $('#div-history').offset().left -menu_width;
              state_data['bodyPartMenu']['y'] = clientY + window.pageYOffset - 120;
            }
            this.setState(state_data);
          });
        } else if (menu_type == 11) {
          const that = this;
          document.addEventListener(`click`, function onClickOutside() {
            that.setState({
              administrateMenu: { visible: false }
            });
            document.removeEventListener(`click`, onClickOutside);
          });
          window.addEventListener("scroll", function onScrollOutside() {
            that.setState({
              administrateMenu: { visible: false }
            });
            window.removeEventListener(`scroll`, onScrollOutside);
          });
          document
            .getElementById("prescribe-container")
            .addEventListener("scroll", function onScrollOutside() {
              that.setState({
                administrateMenu: { visible: false }
              });
              document
                .getElementById("prescribe-container")
                .removeEventListener(`scroll`, onScrollOutside);
            });
          state_data['administrateMenu'] = {
            visible: true,
            x: e.clientX - $('#div-history').offset().left,
            y: e.clientY + window.pageYOffset - 120,
          };
          state_data['administrate_pres_index'] = indexOfPresData;
          state_data['commentMenu'] = { visible: false };
          state_data['contextMenu'] = { visible: false };
          state_data['ussageMenu'] = { visible: false };
          state_data['ussageCommentMenu'] = { visible: false };          
          this.setState(state_data, ()=>{
            let menu_height = document.getElementsByClassName("administrate-menu")[0].offsetHeight;
            let menu_width = document.getElementsByClassName("administrate-menu")[0].offsetWidth;
            let window_height = window.innerHeight;
            let window_width = window.innerWidth;
            if (((clientY + menu_height) > window_height) && ((clientX + menu_width + 190) > window_width)) {
              state_data['administrateMenu']['x'] = clientX - $('#div-history').offset().left-menu_width;
              state_data['administrateMenu']['y'] = clientY + window.pageYOffset - 120 - menu_height;
            } else if (((clientY + menu_height) > window_height) && ((clientX + menu_width + 190) < window_width)) {
              state_data['administrateMenu']['x'] = clientX - $('#div-history').offset().left;
              state_data['administrateMenu']['y'] = clientY + window.pageYOffset - 120 - menu_height;
            } else if (((clientY + menu_height) < window_height) && ((clientX + menu_width + 190) > window_width)) {
              state_data['administrateMenu']['x'] = clientX - $('#div-history').offset().left -menu_width;
              state_data['administrateMenu']['y'] = clientY + window.pageYOffset - 120;
            }
            this.setState(state_data);
          });
        } else {
          const that = this;
          document.addEventListener(`click`, function onClickOutside() {
            that.setState({
              ussageCommentMenu: { visible: false }
            });
            document.removeEventListener(`click`, onClickOutside);
          });
          window.addEventListener("scroll", function onScrollOutside() {
            that.setState({
              ussageCommentMenu: { visible: false }
            });
            window.removeEventListener(`scroll`, onScrollOutside);
          });
          document
            .getElementById("prescribe-container")
            .addEventListener("scroll", function onScrollOutside() {
              that.setState({
                ussageCommentMenu: { visible: false }
              });
              document
                .getElementById("prescribe-container")
                .removeEventListener(`scroll`, onScrollOutside);
            });
          state_data['ussageCommentMenu'] = {
            visible: true,
            x: e.clientX - $('#div-history').offset().left,
            y: e.clientY + window.pageYOffset - 120,
          };
          state_data['comment_edit_index'] = index;
          state_data['commentMenu'] = { visible: false };
          state_data['contextMenu'] = { visible: false };
          state_data['ussageMenu'] = { visible: false };
          state_data['bodyPartMenu'] = { visible: false };
          state_data['administrateMenu'] = { visible: false };
          this.setState(state_data, ()=>{
            let menu_height = document.getElementsByClassName("context-menu")[0].offsetHeight;
            let menu_width = document.getElementsByClassName("context-menu")[0].offsetWidth;
            let window_height = window.innerHeight;
            let window_width = window.innerWidth;
            if (((clientY + menu_height) > window_height) && ((clientX + menu_width + 190) > window_width)) {
              state_data['ussageCommentMenu']['x'] = clientX - $('#div-history').offset().left -menu_width;
              state_data['ussageCommentMenu']['y'] = clientY + window.pageYOffset -120 - menu_height;
            } else if (((clientY + menu_height) > window_height) && ((clientX + menu_width + 190) < window_width)) {
              state_data['ussageCommentMenu']['x'] = clientX - $('#div-history').offset().left;
              state_data['ussageCommentMenu']['y'] = clientY + window.pageYOffset -120 - menu_height;
            } else if (((clientY + menu_height) < window_height) && ((clientX + menu_width + 190) > window_width)) {
              state_data['ussageCommentMenu']['x'] = clientX - $('#div-history').offset().left -menu_width;
              state_data['ussageCommentMenu']['y'] = clientY + window.pageYOffset -120;
            }
            this.setState(state_data);
          });
        }
      }
    }

    window.sessionStorage.setItem("prescribe-auto-focus", 0);
    window.sessionStorage.setItem(
      "prescribe-container-scroll",
      $("#prescribe-container").scrollTop()
    );
  }

  handleCancel = () => {
    this.setState({
      showMedicineDetail: false
    });
  }

  handleMedicineDetailClick = (code) => {
    let params = {type: "haruka", codes: parseInt(code)};
    this.getMedicineDetailList(params);
  }

  getMedicineDetailList = async (params) => {
    await apiClient.get("/app/api/v2/reference/medicines", {
      params: params
    }).then((res) => {
      this.setState({
        showMedicineDetail: true,
        medicineDetail: res
      });
    });
  }

  contextMenuAction = (act, presData, preset_do_count = null, x_pos=null, y_pos=null) => {
    const tempMedicine = presData[this.state.indexOfPres].medicines[this.state.indexOfMed];
    /*@cc_on 
    var w = window;
    eval('var window = w');
    @*/
    window.sessionStorage.setItem("prescribe-auto-focus", 0);
    /*@cc_on 
    var doc = document;
    eval('var document = doc');
    @*/
    if (act === "newdrug") {
      const newData = presData[this.state.indexOfPres].medicines.slice(0); // copy

      // ■1211-3 処方薬品登録
      // 処方箋の右クリックから用法が違う薬品を登録した場合に、「Rp1の用法区分は「用法」ですが「薬品名」を処方をしてもよろしいですか？」でキャンセルを押したのに、
      // 数量パッドが表示されたり、薬品名が表示されたままになっている      

      const item = {
        medicineId: 0,
        medicineName: "",
        amount: 0,
        unit: "",
        main_unit_flag: 1,
        is_not_generic: 0,
        can_generic_name: 0,
        milling: 0,
        separate_packaging: 0,
        free_comment: [],
        usage_comment: "",
        usage_optional_num: 0,
        poultice_one_day: 0,
        poultice_days: 0,
        uneven_values: []
      };

      newData.splice(this.state.indexOfMed + 1, 0, item);
      presData[this.state.indexOfPres].medicines = newData;
      window.sessionStorage.setItem("prescribe-auto-focus", 1);
      window.sessionStorage.setItem("createfocus", 1);
      let _data = {"is_reload_state": false};
      _data.med_indexOfPres = this.state.indexOfPres;      
      _data.med_indexOfMed = this.state.indexOfMed + 1;   
      this.props.indexPresAndMed(this.state.indexOfPres, this.state.indexOfMed);   
      this.props.storeDataInCache(_data);
    } else if (act === "drugchange") {
      presData[this.state.indexOfPres].medicines[
        this.state.indexOfMed
        ].medicineName = "";
      presData[this.state.indexOfPres].medicines[
        this.state.indexOfMed
        ].amount = 0;
      presData[this.state.indexOfPres].medicines[
        this.state.indexOfMed
        ].medicineId = 0;
      window.sessionStorage.setItem("prescribe-auto-focus", 1);      
      let _data = {"is_reload_state": false};

      // YJ758 禁忌薬警告でキャンセルしたときに、別の薬剤も一緒に消去される場合がある不具合
      this.props.indexPresAndMed(this.state.indexOfPres, this.state.indexOfMed);

      this.props.storeDataInCache(_data);
    } else if (act === "amountchange") {
      presData[this.state.indexOfPres].medicines[
        this.state.indexOfMed
        ].amount = 0;      
      this.props.storeDataInCache();
    } else if (act === "drugdel") {
      presData[this.state.indexOfPres].medicines.splice(
        [this.state.indexOfMed],
        1
      );
      window.localStorage.removeItem("medicine_keyword_" + this.state.indexOfPres + "_" + this.state.indexOfMed);
      this.setState({
        contextMenu: { visible: false }
      },()=>{
        let _data = {"is_reload_state": false};
        this.props.storeDataInCache(_data, "medicine_check");
      });
    } else if (act === "paragraphdel") {
      let _initData = {
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
      let order_number = presData[this.state.indexOfPres].order_number;
      let cacheState = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.props.cacheSerialNumber);
      // check item_details
      let existItemDetails = false;
      if (cacheState[0]['item_details'] != undefined && cacheState[0]['item_details'] != null && cacheState[0]['item_details'].length > 0) {
        existItemDetails = true;
      }
      this.not_show_menu = 1;
      // ■1195-30 区切りの削除をするときに、薬剤しか選んでいない作りかけのRPが一緒に消える
      if((presData.length >= 2 && presData[presData.length - 2].medicines[0].medicineName != "" ) || existItemDetails){
        if (presData[this.state.indexOfPres].usageName == "") {
          presData[this.state.indexOfPres] = _initData;
        } else {
          presData.splice(this.state.indexOfPres, 1);
        }
        this.props.resetPresData(order_number, presData, this.props.patientId);
      } else {
        if (presData.length == 2 && presData[this.state.indexOfPres].usageName == "" ) {
          presData[this.state.indexOfPres] = _initData;
          this.props.resetPresData(order_number, presData, this.props.patientId);
        } else {
          this.props.resetPresData(order_number, null, this.props.patientId);
        }
      }
      for (var key in window.localStorage) {
        if (key.includes("medicine_keyword_" + this.state.indexOfPres)) {
          window.localStorage.removeItem(key);
        }
      }
    } else if (act === "comment") {
      this.setState({
        comment: {
          indexOfPres: this.state.indexOfPres,
          indexOfMed: this.state.indexOfMed
        },
        medicine_comment_eedit_index: presData[this.state.indexOfPres].medicines[this.state.indexOfMed].free_comment.length,
        free_comment: "",
        comment_focus: 1
      });
    } else if (act === "comment_edit") {
      this.setState({
        comment: {
          indexOfPres: this.state.indexOfPres,
          indexOfMed: this.state.indexOfMed
        },
        comment_focus: 1,
        free_comment:
          presData[this.state.indexOfPres].medicines[this.state.indexOfMed]
            .free_comment[this.state.medicine_comment_eedit_index]
      },()=>{
        this.setCaretPosition("usage_remarks_comment_input", presData[this.state.indexOfPres].medicines[this.state.indexOfMed]
          .free_comment[this.state.medicine_comment_eedit_index].length);
      });
    } else if (act === "startdate_edit") {
      this.setState({
        start_date_edit: {
          indexOfPres: this.state.start_date_edit_index,
          start_date: new Date(this.formatDate(
            presData[this.state.start_date_edit_index].start_date
          ))
        }
      });
    } else if (act === "insurance_edit") {
      this.setState({
        insurance_type_edit: {
          index: this.state.insurance_type_edit_index,
          value: presData[this.state.insurance_type_edit_index].insurance_type
        }
      });
    } else if (act === "administrate_period") {
      this.props.openAdministratePeriodInputModal(this.state.indexOfPres);
    } else if (act === "administrate_period_edit") {
      this.props.openAdministratePeriodInputModal(this.state.administrate_pres_index);
    } else if (act === "comment_remove") {
      var free_comment =
        presData[this.state.indexOfPres].medicines[this.state.indexOfMed]
          .free_comment;
      free_comment.splice(this.state.medicine_comment_eedit_index, 1);
      presData[this.state.indexOfPres].medicines[
        this.state.indexOfMed
        ].free_comment = free_comment;
      this.setState({
        CommentMenu: { visible: false }
      },()=>{
        let _data = {"is_reload_state": false};
        this.props.storeDataInCache(_data);
      });
    } else if (act === "administrate_remove") {      
      delete presData[this.state.administrate_pres_index].administrate_period;                
      this.setState({
        administrateMenu: { visible: false },        
      },()=>{
        // let _data = {"is_reload_state": false};
        // this.props.storeDataInCache(_data);
        this.props.cancelAdministratePeriod();
      });
    } else if (act === "milling_action") {
      this.props.checkOptions(
        this.state.indexOfPres,
        this.state.indexOfMed,
        "milling"
      );
    } else if (act === "is_not_generic_action") {
      this.props.checkOptions(
        this.state.indexOfPres,
        this.state.indexOfMed,
        "is_not_generic"
      );
    } else if (act === "can_generic_name_action") {
      this.props.checkOptions(
        this.state.indexOfPres,
        this.state.indexOfMed,
        "can_generic_name"
      );
    } else if (act === "separate_packaging_action") {
      presData[this.state.indexOfPres].medicines[
        this.state.indexOfMed
        ].separate_packaging = 1 - tempMedicine.separate_packaging;
    } else if (act === "ussage_comment") {
      this.setState({
        usage_remarks_comment_index: this.state.indexOfPres,
        comment_edit_index: presData[this.state.indexOfPres].usage_remarks_comment.length,
        usage_remarks_comment: ""
      });
    } else if (act === "body_part") {
      this.props.openBodyParts(this.state.indexOfPres);
    } else if (act === "one_dose_package_action") {
      this.props.checkOptions(this.state.indexOfPres, 0, "one_dose_package");
    } else if (act === "mixture_action") {
      this.props.checkOptions(this.state.indexOfPres, 0, "mixture");
    } else if (act === "temporary_medication_action") {
      this.props.checkOptions(
        this.state.indexOfPres,
        0,
        "temporary_medication"
      );
    } else if (act === "ussage_comment_edit") {
      const usage_remarks_comment =
        presData[this.state.indexOfPres].usage_remarks_comment;
      this.setState({
        usage_remarks_comment_index: this.state.indexOfPres,
        usage_remarks_comment:
          usage_remarks_comment[this.state.comment_edit_index]
      }, ()=>{
        this.setCaretPosition("usage_remarks_comment_input", usage_remarks_comment[this.state.comment_edit_index].length);
      });
    } else if (act === "ussage_comment_remove") {
      var comment_list = presData[this.state.indexOfPres].usage_remarks_comment;
      comment_list.splice(this.state.comment_edit_index, 1);
      // const remove_comment = comment_list[this.state.comment_edit_index];
      presData[
        this.state.indexOfPres
        ].usage_remarks_comment = comment_list;
      let _data = {"is_reload_state": false};
      this.props.storeDataInCache(_data);
    } else if (act === "body_part_edit") {
      this.props.openBodyParts(this.state.indexOfPres);
    } else if (act === "body_part_remove") {
      presData[this.state.indexOfPres].body_part = "";
      let _data = {"is_reload_state": false};
      this.props.storeDataInCache(_data);
    } else if (act === "drug_amount_change") {
      this.props.changeAmountOrDays(
        true,
        this.state.indexOfPres,
        this.state.indexOfMed
      );
    } else if (act === "ussage_day_change") {
      this.props.changeAmountOrDays(
        false,
        this.state.indexOfPres,
        this.state.indexOfMed
      );
    } else if (act === "viewDetail") {
      this.handleMedicineDetailClick(tempMedicine.medicineId);
    } else if (act === "viewDiagnosis") {
      this.props.showDiagnosisPermission(this.state.indexOfPres, this.state.indexOfMed);
    } else if (act === PERMISSION_TYPE.DUPLICATE) {   // permission menu action
      this.props.checkPermissionByType(this.state.indexOfPres, this.state.indexOfMed, PERMISSION_TYPE.DUPLICATE);
    } else if (act === PERMISSION_TYPE.DIAGNOSIS) {
      this.props.checkPermissionByType(this.state.indexOfPres, this.state.indexOfMed, PERMISSION_TYPE.DIAGNOSIS);
    } else if (act === PERMISSION_TYPE.ALERT) {
      this.props.checkPermissionByType(this.state.indexOfPres, this.state.indexOfMed, PERMISSION_TYPE.ALERT);
    } else if (act === PERMISSION_TYPE.USAGE) {
      this.props.checkPermissionByType(this.state.indexOfPres, this.state.indexOfMed, PERMISSION_TYPE.USAGE);
    } else if (act === PERMISSION_TYPE.DISEASE) {
      this.props.checkPermissionByType(this.state.indexOfPres, this.state.indexOfMed, PERMISSION_TYPE.DISEASE);
    } else if (act === "prescription_do_set") { // 処方Do登録
      let preset_do_data = karteApi.getVal(this.props.patientId,CACHE_LOCALNAMES.PRESET_DO_PRESCRIPTION);
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
      this.setState({
        confirm_message,
      });
      this.preset_do_count = preset_do_count;
    } else if (act === "ussage_regular_comment") {  //
      var e = preset_do_count;
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ HoverFirstMenu: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          HoverFirstMenu: { visible: false }
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      let top_height = document.getElementsByClassName("ussage_regular_comment-menu")[0].offsetTop;
      let state_data = {};
      state_data['HoverFirstMenu'] = {
        visible: true,
        x: x_pos,
        y: y_pos+top_height
      };
      state_data['presData'] = presData;
      state_data['first_menu_data'] = this.first_usage_boilerplate;
      this.setState(state_data
        , ()=>{
          let menu_width = document.getElementsByClassName("hover-first-menu")[0].offsetWidth;
          state_data['HoverFirstMenu']['x'] = x_pos - menu_width;
          this.setState(state_data);
        });
    } else if (act==="comment_regular") {
      let e = preset_do_count;
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ HoverFirstMenu: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          HoverFirstMenu: { visible: false }
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      let top_height = document.getElementsByClassName("comment-regular-menu")[0].offsetTop;
      let state_data = {};
      state_data['HoverFirstMenu'] = {
        visible: true,
        x: x_pos,
        y: y_pos+top_height
      };
      state_data['presData'] = presData;
      state_data['first_menu_data'] = this.first_med_boilerplate;
      this.setState(state_data
        , ()=>{
          let menu_width = document.getElementsByClassName("hover-first-menu")[0].offsetWidth;
          state_data['HoverFirstMenu']['x'] = x_pos - menu_width;
          this.setState(state_data);
        });
    } else if (act === "first_hover_comment") {
         let menu_item = preset_do_count;
         // check usage menu or med menu
        let menu_act = "usage";
        let comment = menu_item.category_name;
        if (this.boilerplate_category.find(x=>x.category_id == menu_item.category_id).use_place === "薬剤コメント") {
            menu_act = "med";
        }
        if (menu_item.body !== undefined && menu_item.body != null) {
            comment = menu_item.body;
        }
        if (menu_act === "usage") {
            this.setState({
                usage_remarks_comment_index: this.state.indexOfPres,
                comment_edit_index: presData[this.state.indexOfPres].usage_remarks_comment.length,
                usage_remarks_comment: comment
            },()=>{
              this.setCaretPosition("usage_remarks_comment_input", comment.length);
            });
        } else if (menu_act === "med") {
            this.setState({
                comment: {
                    indexOfPres: this.state.indexOfPres,
                    indexOfMed: this.state.indexOfMed
                },
                medicine_comment_eedit_index: presData[this.state.indexOfPres].medicines[this.state.indexOfMed].free_comment.length,
                free_comment: comment,
                comment_focus: 1
            },()=>{
              this.setCaretPosition("usage_remarks_comment_input", comment.length);
            });
        }
    } else if (act === "second_hover_comment") {
         let menu_item = preset_do_count;
         // check usage menu or med menu
        let menu_act = "usage";
        let comment = menu_item.category_name;
        if (this.boilerplate_category.find(x=>x.category_id == menu_item.category_id).use_place === "薬剤コメント") {
            menu_act = "med";
        }
        if (menu_item.body !== undefined && menu_item.body != null) {
            comment = menu_item.body;
        }
        if (menu_act === "usage") {
            this.setState({
                usage_remarks_comment_index: this.state.indexOfPres,
                comment_edit_index: presData[this.state.indexOfPres].usage_remarks_comment.length,
                usage_remarks_comment: comment
            },()=>{
              this.setCaretPosition("usage_remarks_comment_input", comment.length);
            });
        } else if (menu_act === "med") {
            this.setState({
                comment: {
                    indexOfPres: this.state.indexOfPres,
                    indexOfMed: this.state.indexOfMed
                },
                free_comment: comment,
                medicine_comment_eedit_index: presData[this.state.indexOfPres].medicines[this.state.indexOfMed].free_comment.length,
                comment_focus: 1
            },()=>{
              this.setCaretPosition("usage_remarks_comment_input", comment.length);
            });
        }
    }
  };

  medOpen = () => {
    this.setState({ medShow: true });
  };

  medClose = () => {
    this.setState({
      medShow: false,
      canEdit: this.state.staff_category === 1,
      isLoaded: false,
      medicineData: [],
    });
  };

  confirm = item => {
    this.setState({ show: false, canEdit: this.state.staff_category === 1 });
    this.props.confirm(item);
  };

  checkCanEdit = () => {
    /*@cc_on 
    var w = window;
    eval('var window = w');
    @*/
    let canEdit = 0;
    if (
      this.context.$canDoAction(
        this.context.FEATURES.PRESCRIPTION,
        this.context.AUTHS.REGISTER
      ) ||
      this.context.$canDoAction(
        this.context.FEATURES.PRESCRIPTION,
        this.context.AUTHS.REGISTER_OLD
      )
    ) {
      canEdit = 1;
    }
    if (
      this.context.$canDoAction(
        this.context.FEATURES.PRESCRIPTION,
        this.context.AUTHS.REGISTER_PROXY
      ) ||
      this.context.$canDoAction(
        this.context.FEATURES.PRESCRIPTION,
        this.context.AUTHS.REGISTER_PROXY_OLD
      )
    ) {
      canEdit = 2;
    }

    if (canEdit === 0) {
      window.sessionStorage.setItem("alert_messages", "権限がありません。");
      // alert("権限がありません。");
      return;
    }

    if (
      // this.state.canEdit === false &&
      canEdit === 2 &&
      this.state.selectedDoctorID !== undefined &&
      this.state.selectedDoctorID <= 0
    ) {
      this.setState({
        isDoctorsOpen: true
      });
      return false;
    }
    return true;
  };

  closeDoctor = () => {
    this.word = null;
    this.indexOfPresData = null;
    this.indexOfMedicines = null;
    this.setState({
      isDoctorsOpen: false,
      canEdit: this.state.staff_category === 1
    });
  };

  getDoctor = e => {
    this.selectDoctorFromModal(e.target.id, e.target.getAttribute("label"));
  };

  selectDoctorFromModal = (id, name) => {
    // ●YJ884 薬剤検索時に依頼医選択が割り込んだ時に、クリックで選ぶと検索はキャンセルされた扱いになる    
    if (this.word != "") {
      this.props.selectDoctorFromModal(id, name, this.word, this.indexOfPresData, this.indexOfMedicines);      
    } else {
      this.props.selectDoctorFromModal(id, name);      
    }    
  };

  /**
   *  1秒間何も入力されなければ検索データを引き出すためのAPIへリクエスト
   */
  search = (word, indexOfPresData, indexOfMedicines) => {
    // YJ406 死亡した患者でも、処方と注射がDoでない通常の手順では登録できてしまう不具合
    // ・死亡している場合、処方・注射の右エリアは、処方歴・注射履歴の編集中以外は閲覧モードと同じ動作にする
    if (karteApi.isDeathPatient(this.props.patientId) && !this.state.isForUpdate){      
      return;
    }

    // YJ350 処方の薬剤検索で、院内で検索にかかる薬剤を制限できるように

    let available_In_hospital_pharmacy = 0;
    if (this.context.karte_status.code == 1) {
      available_In_hospital_pharmacy = 1;
    } else {
      if (this.state.in_out == 1) {
        available_In_hospital_pharmacy = 1;
      }
    }

    if (this.state.staff_category != 1 && this.state.selectedDoctorID == 0) {

      // ●YJ884 薬剤検索時に依頼医選択が割り込んだ時に、クリックで選ぶと検索はキャンセルされた扱いになる     
      if (word != null && word != "") {        
        word = word.trim();      
        if (word.length > 2) {        
          this.word = word;
          this.indexOfPresData = indexOfPresData;
          this.indexOfMedicines = indexOfMedicines;    
        }
      }
      
      this.setState({
        isDoctorsOpen: true,        
      });
      return;
    }
    // const { presData } = this.props;
    const { presData } = this.state;
    const medicines = presData[presData.length - 1].medicines;
    if ((word != undefined && word.length == 0) && medicines.length > 1) {
      const realIndex =
        indexOfPresData + 1 == presData.length ? -1 : indexOfPresData;
      this.props.onSelectUsage(realIndex);
    }
    if (this.timer) clearTimeout(this.timer);
    word = word.trim();
    if (word.length < 3) {
      return true;
    }

    this.setState({
      indexOfInsertPres: indexOfPresData,
      indexOfInsertMed: indexOfMedicines,
      medShow: true,
      isLoaded: false,
    });
    this.timer = setTimeout(() => {
      const postData = {
        word: word,
        diagnosis_division: this.state.diagnosis_division,
        is_internal_prescription: this.state.inOut,
        drug_division: this.state.drug_division,
        enable_no_number_item: 0,
        available_In_hospital_pharmacy: available_In_hospital_pharmacy
      };
      if (this.state._unusedDrugSearch == 1) {
        postData.enable_no_number_item = 1;
      }
      if (this.state._profesSearch == 1) {
        postData.keyword_matching_mode = "all";
      }
      if (this.state._normalNameSearch == 1) {
        postData.search_generic_name = 1;
      }
      axios
        .get("/app/api/v2/master/point/search/index", {
          params: postData
        })
        .then(res => {
          const searchedMedicine = [];
          res.data.forEach(medicine => {
            searchedMedicine.push({
              code: medicine.code,
              name: medicine.name,
              main_unit: medicine.main_unit,
              diagnosis_division: medicine.diagnosis_division,
              units: medicine.units,
              gene_name: medicine.gene_name,
              if_duplicate: medicine.if_duplicate,
              contraindication_alert: medicine.contraindication_alert,
              contraindication_reject: medicine.contraindication_reject,
              exists_detail_information: medicine.exists_detail_information,
              start_date:medicine.start_date,
              start_month:medicine.start_month,
              end_date:medicine.end_date,
              end_month:medicine.end_month,
              generic_flag:medicine.generic_flag,
              tagret_contraindication: medicine.tagret_contraindication,
              yj_code: medicine.yj_code
            });
          });

          let convert_medicineData = this.convertMedicneData(searchedMedicine);

          if (this.checkCanEdit() === false) {
            this.setState({ medicineData: convert_medicineData });
            return false;
          }


          this.setState({
            medicineData: convert_medicineData,
            medShow: true,
            isLoaded: true
          });

        })
        .catch(() => {
          alert("送信に失敗しました");
          this.setState({
            medicineData: [
              {
                diagnosis_division: 21,
                name: "ロキソニン錠６０ｍｇ",
                gene_name: "【般】ロキソプロフェンＮａ錠６０ｍｇ",
                main_unit: "錠",
                drug_division: 0,
                generic_flag: 0,
                psy_drug_flag: 0,
                code: 2188019,
                units: [
                  {
                    name: "錠",
                    main_unit_flag: 1
                  },
                  {
                    name: "主単位の1/2",
                    main_unit_flag: 0
                  },
                  {
                    name: "主単位の2倍",
                    main_unit_flag: 0
                  },
                  {
                    name: "主単位の3倍",
                    main_unit_flag: 0
                  }
                ]
              }
            ],
            medShow: true
          });
        });
    });
  };

  handleConfirmComment = e => {
    if (e.key === "Enter") {
      this.saveComment(e)
    }
  };

  handleConfirmStartDate = e => {
    if (e.key === "Enter") {
      e.stopPropagation();
      e.preventDefault();
      var { start_date_edit_index } = this.state;

      let sDate = this.getDateStr(new Date());
      if (this.isValidDate(e.target.value)) {
        sDate = e.target.value.split("/").join("");
      }
      if (start_date_edit_index == -1) {
        start_date_edit_index = this.props.presData.length - 1;
      }
      this.props.presData[start_date_edit_index].start_date = sDate;

      this.setState({
        start_date_edit: {
          indexOfPres: -1,
          start_date: ""
        },
        start_date_edit_index: -1
      }, function() {
        this.props.storeDataInCache();
      });
    }
    this.props.storeDataInCache();
  };

  handleCommentChange = e => {
    this.setState({
      free_comment: e.target.value
    });
  };

  saveComment = e => {
    this.setState({
      comment_focus: 0
    })
    e.stopPropagation();
    e.preventDefault();
    const {
      comment,
      free_comment,
      medicine_comment_eedit_index
    } = this.state;
    if(free_comment.length > 0){
      if (
        medicine_comment_eedit_index !=
        this.props.presData[comment.indexOfPres].medicines[comment.indexOfMed]
          .free_comment.length
      ) {
        this.props.presData[comment.indexOfPres].medicines[
          comment.indexOfMed
          ].free_comment[medicine_comment_eedit_index] =
          free_comment.length > 30
            ? free_comment.substring(0, 30)
            : free_comment;
      } else {
        this.props.presData[comment.indexOfPres].medicines[
          comment.indexOfMed
          ].free_comment.push(
          free_comment.length > 30
            ? free_comment.substring(0, 30)
            : free_comment
        );
      }

      this.setState({
          comment: {
            indexOfPres: -1,
            indexOfMed: -1
          },
          free_comment: "",
          medicine_comment_eedit_index: -1
        },
        function() {
          let storeData ={"is_reload_state": false};
          this.props.storeDataInCache(storeData);
        });
    } else {
      this.setState({
        comment: {
          indexOfPres: -1,
          indexOfMed: -1
        },
        free_comment: "",
        medicine_comment_eedit_index: -1
      });
    }
  }

  handleFocusoutComment = e => {
    this.saveComment(e)
  }

  isValidDate = dateStr => {
    var datePat = /^(\d{4}|\d{4})(\/)(\d{2,2})(\/)(\d{2,2})$/;

    var matchArray = dateStr.match(datePat); // is the format ok?
    if (matchArray == null) {
      return false;
    }
    return true;
  };

  handleStartDateChange = value => {
    const cDate = this.getDateStr(new Date());
    const sDate = this.getDateStr(value);

    if (!this.state.isForUpdate && cDate > sDate) {
      if (
        !(
          this.context.$canDoAction(
            this.context.FEATURES.PRESCRIPTION,
            this.context.AUTHS.REGISTER_OLD
          ) ||
          this.context.$canDoAction(
            this.context.FEATURES.PRESCRIPTION,
            this.context.AUTHS.REGISTER_PROXY_OLD
          )
        )
      ) {
        alert("現在日時より前の日付を選択することは不可能です。");
        this.setState({ isLastDate: true });
        return;
      }
    }
    this.setState(
      {
        start_date_edit: {
          indexOfPres: this.state.start_date_edit.indexOfPres,
          start_date: value
        }
      },
      () => {
        const { start_date_edit_index } = this.state;
        try {
          this.props.presData[start_date_edit_index].start_date = sDate;
          this.props.storeDataInCache();
        } catch (e) {
          console.log(e); /* eslint-disable-line no-console */
        }
      }
    );
  };

  handleUssageConfirmComment = e => {
    if (e.key === "Enter") {
      this.saveUssageComment(e);
    }
  };

  saveUssageComment = e => {
    e.stopPropagation();
    e.preventDefault();
    const {
      usage_remarks_comment,
      usage_remarks_comment_index,
      comment_edit_index
    } = this.state;
    if(usage_remarks_comment.length > 0) {
      if (
        comment_edit_index !=
        this.props.presData[usage_remarks_comment_index].usage_remarks_comment
          .length
      ) {
        this.props.presData[usage_remarks_comment_index].usage_remarks_comment[
          comment_edit_index
          ] =
          usage_remarks_comment.length > 30
            ? usage_remarks_comment.substring(0, 30)
            : usage_remarks_comment;
      } else {
        this.props.presData[
          usage_remarks_comment_index
          ].usage_remarks_comment.push(
          usage_remarks_comment.length > 30
            ? usage_remarks_comment.substring(0, 30)
            : usage_remarks_comment
        );
      }

      this.setState({
        usage_remarks_comment_index: -1,
        usage_remarks_comment: "",
        comment_edit_index: -1
      }, function() {
        let storeData ={"is_reload_state": false};
        this.props.storeDataInCache(storeData);
      });
    } else {
      this.setState({
        usage_remarks_comment_index: -1,
        usage_remarks_comment: "",
        comment_edit_index: -1
      });
    }
  }
  insertMed = async (medicine, indexOfInsertPres, indexOfInsertMed) => {
    if (
      this.state.selectedDoctorID > 0 &&
      this.props.doctor_code !== this.state.selectedDoctorID
    ) {
      await this.props.setDoctorInfo(
        this.state.selectedDoctorID,
        this.state.selectedDoctorName
      );
    }
    this.props.insertMed(medicine, indexOfInsertPres, indexOfInsertMed);
  };

  handleUssageCommentChange = e => {
    this.setState({
      usage_remarks_comment: e.target.value
    });
  };

  handleUssageCommentBlur = e => {
    this.saveUssageComment(e)
  }
  onClickUssage = indexOfPresData => {
    // get real presData length
    let cacheState = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.props.cacheSerialNumber);
    let presData_length = 0;
    if (cacheState != undefined && 
      cacheState != null && 
      cacheState[0] != undefined && 
      cacheState[0] != null && 
      cacheState[0].presData.length > 0) {
        presData_length = cacheState[0].presData.length;
    }
    const realIndex =
      indexOfPresData + 1 == presData_length ? -1 : indexOfPresData;
    this.props.onSelectUsage(realIndex);
  };

  getInsurance = type => {
    let insurance = "既定";
    if (this.props.patientInfo.insurance_type_list) {
      this.props.patientInfo.insurance_type_list.map(item => {
        if (item.code === parseInt(type)) {
          insurance = item.name;
        }
      });
    }
    return insurance;
  };

  handleInsuranceTypeChange = e => {
    const { insurance_type_edit_index } = this.state;

    this.props.presData[insurance_type_edit_index].insurance_type = parseInt(
      e.target.value
    );

    this.setState({
      insurance_type_edit: {
        index: -1,
        value: 0
      },
      insurance_type_edit_index: -1
    },()=>{
      let _data = {"is_reload_state": false};
      this.props.storeDataInCache(_data);
    });

  };

  getUnevenValues = (values, unit) => {
    let unevenValues = [];
    values.map(splitNum => {
      if (splitNum.value !== undefined) {
        unevenValues.push(splitNum.label + " " + splitNum.value + unit);
      }
    });
    return unevenValues.join(",");
  };

  closeMedicineBodyParts = () =>
    this.setState({ isMedicineBodyPartOpen: false });

  medicinebodyPartConfirm = value => {
    /*@cc_on 
    var w = window;
    eval('var window = w');
    @*/
    window.localStorage.setItem(this.state.mouseKeyname, value);
    window.sessionStorage.setItem("prescribe-auto-focus", 1);
    window.localStorage.setItem("prev_focus_key", this.state.mouseKeyname);
    window.sessionStorage.setItem("mouseWord", value);
    this.setState({
      isMedicineBodyPartOpen: false,
    },()=>{
      this.search(value,this.state.mousepresdata, this.state.mouseIndex);
    });

  }

  openMedicineBodyParts = (keyName, presdata,indexdata) => {
    /*@cc_on 
    var w = window;
    eval('var window = w');
    @*/
    this.body_part = window.localStorage.getItem("medicine_keyword");
    this.setState({
      isMedicineBodyPartOpen: true,
      mouseIndex: indexdata,
      mousepresdata: presdata,
      mouseKeyname: keyName
    });
  }

  onClickPermission = (nFlag = false, rpIdx, medIdx, nType) => {
    if (!nFlag) return;
    this.props.checkPermissionByType(rpIdx, medIdx, nType);
  }

  testRender = (presData) => {
    this.setState({presData: presData});
    this.props.presData = presData;
  }

  testModalObjRender = (_status) => {
    if (_status != undefined && _status != null && _status.presData != undefined && _status.presData != null) {
      this.props.presData = _status.presData;
    }
    this.setState(_status);
  }

  testSearchOptionRender = (type, value) => {
    if (type == "unusedDrugSearch") {
      this.setState({
        _unusedDrugSearch: value
      });
    } else if(type == "profesSearch") {
      this.setState({
        _profesSearch: value
      });
    } else if(type == "normalNameSearch") {
      this.setState({
        _normalNameSearch: value
      });
    }
  }

  find_duplicate_in_array = (arr) => {
    let object = {};
    let result = [];

    arr.map(ele=>{
      if (ele.gene_name != undefined && ele.gene_name != null && ele.gene_name != "") {
        if(!object[ele.gene_name])
          object[ele.gene_name] = 0;
        object[ele.gene_name] += 1;
      }
    });

    for (var key in object) {
      if(object[key] >= 2) {
        result.push(key);
      }
    }

    return result;

  }

  convertMedicneData = (medicineData) => {
    if (medicineData == null || medicineData == undefined || medicineData.length <=0) return [];

    let duplicate_array = this.find_duplicate_in_array(medicineData);

    if (duplicate_array.length > 0) {
      this.setState({
        isExistPrefixMedicine: true
      });
    } else {
      this.setState({
        isExistPrefixMedicine: false
      });
    }
    medicineData.map(item=>{
      if ( item.gene_name != undefined &&  item.gene_name != null &&  item.gene_name != "" && duplicate_array.includes(item.gene_name)) {
        if (item.generic_flag != undefined && item.generic_flag != null && (item.generic_flag == 0 || item.generic_flag == 1)) {
          item.prefix_name = item.generic_flag == 0 ? "先" : "後";
        }
      }
    });

    return medicineData;
  }

  hasUnenabledUsage = (usage_number) => {
    // let usageNumberArray = [];
    let usageData = {};
    let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
    if (init_status != null && init_status != undefined && init_status.prescription_usage != undefined && init_status.prescription_usage != null) {
      usageData = init_status.prescription_usage;
    }
    if (usage_number == null || usage_number == undefined) {
      return false;
    }

    let nHasUnenabledUsage = 0;
    if (usageData != null && usageData != undefined) {
      if(usageData.external !== undefined && usageData.external != null && usageData.external.all !== undefined && usageData.external.all != null && usageData.external.all.length > 0){
        usageData.external.all.map(ele=>{
          if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
            nHasUnenabledUsage = 1;
          }
        });
      }
      if (nHasUnenabledUsage == 1) return true;
      if(usageData.injection !== undefined && usageData.injection != null && usageData.injection.all !== undefined && usageData.injection.all != null && usageData.injection.all.length > 0){
        usageData.injection.all.map(ele=>{
          if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
            nHasUnenabledUsage = 1;
          }
        });
      }
      if (nHasUnenabledUsage == 1) return true;
      if (usageData.internal != null && usageData.internal.internal_other != null){
        usageData.internal.internal_other.map(ele=>{
          if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
            nHasUnenabledUsage = 1;
          }
        });
      }
      if (nHasUnenabledUsage == 1) return true;
      
      if (usageData.internal != undefined && usageData.internal != null && usageData.internal.times_1 != undefined && usageData.internal.times_1 != null){
        usageData.internal.times_1.map(ele=>{
          if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
            nHasUnenabledUsage = 1;
          }
        });
      }
      if (nHasUnenabledUsage == 1) return true;

      if (usageData.internal != undefined && usageData.internal != null && usageData.internal.times_2 != undefined && usageData.internal.times_2 != null){
        usageData.internal.times_2.map(ele=>{
          if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
            nHasUnenabledUsage = 1;
          }
        });
      }      
      if (nHasUnenabledUsage == 1) return true;

      if (usageData.internal != undefined && usageData.internal != null && usageData.internal.times_3 != undefined && usageData.internal.times_3 != null){
        usageData.internal.times_3.map(ele=>{
          if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
            nHasUnenabledUsage = 1;
          }
        });
      }
      if (nHasUnenabledUsage == 1) return true;

      if (usageData.when_necessary != undefined && usageData.when_necessary != null && usageData.when_necessary.all != undefined && usageData.when_necessary.all != null){
        usageData.when_necessary.all.map(ele=>{
          if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
            nHasUnenabledUsage = 1;
          }
        });
      }
      if (nHasUnenabledUsage == 1) return true;
    }
    return false;
  };

  confirmCancel=()=>{
    this.setState({
      confirm_message:"",
    });
  };

  confirmOk=()=>{
    let name = "prescription_do_" + this.props.patientId.toString() + "_" + this.state.currentUserName + "_" + (this.preset_do_count+1).toString();
    this.props.registerNewSet(name,"soap",this.preset_do_count, this.props.patientId);
    this.setState({
      confirm_message:"",
    });
  };

  getBoilerplateMenu(){
    let first_usage_menu = [];
    let first_med_menu = [];
    let second_usage_menu = [];
    let second_med_menu = [];
    let category_data = sessApi.getObjectValue('boilerplate_master',"boilerplate_master_category");
    this.boilerplate_category = category_data;
    let master_data = sessApi.getObjectValue('boilerplate_master',"boilerplate_master");
    this.boilerplate_master = master_data;
    if (category_data !== undefined && category_data != null){
      first_usage_menu = category_data.filter(x=>x.function_id==BOILERPLATE_FUNCTION_ID_CATEGORY.PRESCRIPTION && x.is_flat != 1 && x.use_place === "追加用法コメント");
      first_med_menu = category_data.filter(x=>x.function_id==BOILERPLATE_FUNCTION_ID_CATEGORY.PRESCRIPTION && x.is_flat != 1 && x.use_place === "薬剤コメント");
    }
    if (master_data !== undefined && master_data != null) {
      if (first_usage_menu !== undefined && first_usage_menu != null){
        first_usage_menu.map(item=>{
          let sub_menu = master_data.filter(x=>x.category_id==item.category_id);
          second_usage_menu = second_usage_menu.concat(sub_menu);
        });
      }
      if (first_med_menu !== undefined && first_med_menu != null){
        first_med_menu.map(item=>{
          let sub_menu = master_data.filter(x=>x.category_id==item.category_id);
          second_med_menu = second_med_menu.concat(sub_menu);
        });
      }
      let flat_category = [];
      category_data.map(item=>{
        if (item.function_id == BOILERPLATE_FUNCTION_ID_CATEGORY.PRESCRIPTION && item.is_flat == 1 && item.use_place === "追加用法コメント"){
          flat_category.push(item.category_id);
        }
      });
      if (flat_category.length > 0) {
        let flat_first_usage_menu = master_data.filter(x=>flat_category.includes(x.category_id.toString()));
        first_usage_menu = first_usage_menu.concat(flat_first_usage_menu);
      }
      flat_category = [];
      category_data.map(item=>{
        if (item.function_id == BOILERPLATE_FUNCTION_ID_CATEGORY.PRESCRIPTION && item.is_flat == 1 && item.use_place === "薬剤コメント"){
          flat_category.push(item.category_id);
        }
      });
      if (flat_category.length > 0) {
        let flat_first_med_menu = master_data.filter(x=>flat_category.includes(x.category_id.toString()));
        first_med_menu = first_med_menu.concat(flat_first_med_menu);
      }
    }
    this.first_usage_boilerplate = first_usage_menu;
    this.first_med_boilerplate = first_med_menu;
    this.second_usage_boilerplate = second_usage_menu;
    this.second_med_boilerplate = second_med_menu;
  }

  closeHoverMenu=()=>{
    let HoverFirstMenu = this.state.HoverFirstMenu;
    let HoverSecondMenu = this.state.HoverSecondMenu;
    if((HoverFirstMenu != undefined && HoverFirstMenu.visible) || (HoverSecondMenu != undefined && HoverSecondMenu.visible)){
      this.setState({
        HoverFirstMenu: { visible: false },
        HoverSecondMenu: { visible: false }
      });
    }
  }

  setHover (x, y, presData, item, index) {
    /*@cc_on 
    var w = window;
    eval('var window = w');
    @*/
    /*@cc_on 
    var doc = document;
    eval('var document = doc');
    @*/
    if (item.body !== undefined && item.body != null && item.body !== "") {
      this.setState({ HoverSecondMenu: { visible: false } });
      return;
    }
    let menu_data = null;
    if (this.boilerplate_category.find(x=>x.category_id==item.category_id).use_place=="薬剤コメント") {
      menu_data = this.second_med_boilerplate.filter(ele=>{
        if (item.category_id == ele.category_id) {
          return ele;
        }
      });
    } else if (this.boilerplate_category.find(x=>x.category_id==item.category_id).use_place=="追加用法コメント") {
      menu_data = this.second_usage_boilerplate.filter(ele=>{
        if (item.category_id == ele.category_id) {
          return ele;
        }
      });
    }
    // eslint-disable-next-line consistent-this
    const that = this;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({ HoverSecondMenu: { visible: false } });
      document.removeEventListener(`click`, onClickOutside);
    });
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({
        HoverSecondMenu: { visible: false }
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    let state_data = {};
    let top_height = document.getElementsByClassName("hover-first-menu"+index)[0].offsetTop;
    state_data['HoverSecondMenu'] = {
      visible: true,
      x: x,
      y: y + top_height
    };
    state_data['presData'] = presData;
    state_data['second_menu_data'] = menu_data;
    this.setState(state_data, ()=>{
      let menu_width = document.getElementsByClassName("hover-second-menu")[0].offsetWidth;
      state_data['HoverSecondMenu']['x'] = x - menu_width;
      this.setState(state_data);
    });
  }

  setCaretPosition =(elemId, caretPos)=> {
    /*@cc_on 
    var doc = document;
    eval('var document = doc');
    @*/
    var elem = document.getElementById(elemId);
    var range;
    if(elem != null) {
      if(elem.createTextRange) {
        range = elem.createTextRange();
        range.move('character', caretPos);
        range.select();
      } else {
        elem.focus();
        if(elem.selectionStart !== undefined) {
          elem.setSelectionRange(caretPos, caretPos);
        }
      }
    }
  }

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

  testIsLoadedRender = (isLoaded = false) => {
    this.setState({
      isPropsLoaded: isLoaded
    });
  }

  medicineExist (order) {
    let medicine_exist = false;
    if (order != undefined && order.medicines != undefined && order.medicines.length > 0) {
      if (order.usageName != "") return true;
      order.medicines.map(med_item=> {
        if (med_item.medicineName != '') {
          medicine_exist = true;
        }
      })
    }
    return medicine_exist;
  }  

  // ■YJ401 Doや編集が展開できていないように見える問題の修正
  setPrescribeTableLoad = (val=true) => {
    this.setState({isSelfLoad: val});
  }

  render() {
    const {
      medicineData,
      indexOfInsertPres,
      indexOfInsertMed,
      comment,
      usage_remarks_comment_index,
      usage_remarks_comment,
      free_comment,
      comment_edit_index,
      medicine_comment_eedit_index,
      start_date_edit,
      insurance_type_edit,
      comment_focus
      // isLastDate
    } = this.state;
    const { presData } = this.state;
    // let presData = JSON.parse(JSON.stringify(this.state.presData));    
    if ((this.state.isPropsLoaded == false) && (this.state.stopLoadingFlag == false)) {    
      return (
        <SpinnerWrapper>
          <Spinner animation="border" variant="secondary" />
        </SpinnerWrapper>
      );
    } else if(this.state.isSelfLoad === false) {
      return (
        <SpinnerWrapper>
          <Spinner animation="border" variant="secondary" />
        </SpinnerWrapper>
      );
    } else {
      return (
        <>
          <Wrapper
            className="droppable"
          >
            {presData.map((order, indexOfPresData) => (
              <div className={`prescribe-table ${this.isStopOrder(order.stop_flag, order.stop_date) == 1 ? "stop-prescription-div" : ""}`} key={indexOfPresData}>
                <PresBox className="prescribe-box">
                  {order.medicines.map((medicine, indexOfMedicines) => (
                    <div className="box" key={indexOfMedicines}>
                      <div className="drug-item table-row">
                        <div className="flex" onContextMenu={e =>this.handleClick(e,presData,indexOfPresData,indexOfMedicines,0)}>
                          <div className="rp-number">
                            {indexOfMedicines == 0 && (
                              <span>Rp {indexOfPresData + 1}</span>
                            )}
                          </div>
                          <PrescribeTableBody
                            key={indexOfMedicines}
                            indexNum={indexOfMedicines}
                            handleShow={this.handleShow.bind(this)}
                            medicine={medicine}
                            search={this.search}
                            indexOfPresData={indexOfPresData}
                            isLastRow={
                              indexOfPresData === presData.length - 1
                              && indexOfMedicines === order.medicines.length - 1
                            }
                            handleMedicineClick={this.props.handleMedicineClick}
                            openMedicineBodyParts={this.openMedicineBodyParts}
                            patientId={this.props.patientId}
                          />
                        </div>
                      </div>

                      {medicine.amount >= 0 &&
                      medicine.uneven_values !== undefined &&
                      medicine.uneven_values.length > 0 && (
                        <div
                          className="comment-item table-row"
                          onContextMenu={e =>
                            this.handleClick(
                              e,
                              presData,
                              indexOfPresData,
                              indexOfMedicines,
                              0
                            )
                          }
                        >
                          {this.getUnevenValues(
                            medicine.uneven_values,
                            medicine.unit
                          )}
                        </div>
                      )}
                      {medicine.amount >= 0 && (
                        (medicine.period_permission != undefined && medicine.period_permission !== 0) ||
                        (medicine.disease_permission != undefined && medicine.disease_permission !== 0) ||
                        (medicine.alert_permission != undefined && medicine.alert_permission !== 0) ||
                        (medicine.usage_permission != undefined && medicine.usage_permission !== 0) ||
                        (medicine.duplciate_permission != undefined && medicine.duplciate_permission !== 0) ||
                        (medicine.diagnosis_permission != undefined && medicine.diagnosis_permission !== 0)
                      ) && (
                        <div className="drug-item table-row">
                          <div className="flex">
                            <div className="rp-number" />
                            <div className="text-right"
                                 onContextMenu={e =>
                                   this.handleClick(
                                     e,
                                     presData,
                                     indexOfPresData,
                                     indexOfMedicines,
                                     0
                                   )
                                 }
                            >
                              {medicine.medicineName != "" && medicine.period_permission !== undefined && medicine.period_permission !== 0 ? (
                                <span onClick={() => this.onClickPermission(medicine.period_permission == -1, indexOfPresData, indexOfMedicines, PERMISSION_TYPE.PERIOD)} className={medicine.period_permission == 1 ? "usage-permission-allow" : "usage-permission-reject"}
                                      title="[期間] この製品は有効期間外のため使用できません"
                                > [期]</span>
                              ) : ""}
                              {medicine.medicineName != "" && medicine.disease_permission !== undefined && medicine.disease_permission !== 0 ? (
                                <span onClick={() => this.onClickPermission(medicine.disease_permission == -1, indexOfPresData, indexOfMedicines, PERMISSION_TYPE.DISEASE)} className={medicine.disease_permission == 1 ? "usage-permission-allow" : "usage-permission-reject"}
                                      title="[禁忌] 禁忌情報があります"
                                > [禁]</span>
                              ) : ""}
                              {medicine.medicineName != "" && medicine.alert_permission !== undefined && medicine.alert_permission !== 0 ? (
                                <span onClick={() => this.onClickPermission(medicine.alert_permission == -1, indexOfPresData, indexOfMedicines, PERMISSION_TYPE.ALERT)} className={medicine.alert_permission == 1 ? "usage-permission-allow" : "usage-permission-reject"}
                                      title="[併用] 相互作用情報があります"
                                > [併]</span>
                              ) : ""}
                              {medicine.medicineName != "" && medicine.usage_permission !== undefined && medicine.usage_permission !== 0 ? (
                                <span onClick={() => this.onClickPermission(medicine.usage_permission == -1, indexOfPresData, indexOfMedicines, PERMISSION_TYPE.USAGE)} className={medicine.usage_permission == 1 ? "usage-permission-allow" : "usage-permission-reject"}
                                      title="[用量] 用量情報があります"
                                > [量]</span>
                              ) : ""}
                              {medicine.medicineName != "" && medicine.duplciate_permission !== undefined && medicine.duplciate_permission !== 0 ? (
                                <span onClick={() => this.onClickPermission(medicine.duplciate_permission == -1, indexOfPresData, indexOfMedicines, PERMISSION_TYPE.DUPLICATE)} className={medicine.duplciate_permission == 1 ? "usage-permission-allow" : "usage-permission-reject"}
                                      title="[重複] 同一薬剤が登録されています"
                                > [複]</span>
                              ) : ""}
                              {medicine.medicineName != "" && medicine.diagnosis_permission !== undefined && medicine.diagnosis_permission !== 0 ? (
                                <span onClick={() => this.onClickPermission(medicine.diagnosis_permission == -1, indexOfPresData, indexOfMedicines, PERMISSION_TYPE.DIAGNOSIS)} className={medicine.diagnosis_permission == 1 ? "usage-permission-allow" : "usage-permission-reject"}
                                      title="[区分] 用法の区分と一致していません"
                                > [区]</span>
                              ) : ""}
                              &nbsp;
                            </div>
                            <div className="unit" />
                          </div>
                        </div>
                      )}
                      {medicine.medicineName != "" && medicine.amount >= 0 &&
                      (medicine.can_generic_name === 1 || medicine.is_not_generic === 1 || (medicine.milling != undefined && medicine.milling === 1) || medicine.separate_packaging === 1) && (
                        <div className="drug-item table-row" onContextMenu={e =>this.handleClick(e,presData,indexOfPresData,indexOfMedicines,0)}>
                          <div className="flex">
                            <div className="rp-number" />
                            <div className="text-right span-inline">
                              {medicine.can_generic_name === 1 && (
                                <span>&nbsp;【一般名処方】</span>
                              )}
                              {medicine.is_not_generic === 1 && (
                                <span>&nbsp;【後発不可】</span>
                              )}
                              {(medicine.milling !== undefined && medicine.milling === 1) && (
                                <span>&nbsp;【粉砕】</span>
                              )}
                              {medicine.separate_packaging === 1 && (
                                <span>&nbsp;【別包】</span>
                              )}
                            </div>
                            <div className="unit" />
                          </div>
                        </div>
                      )}
                      {medicine.free_comment.map((coment, index) => (
                        <div key={index}>                                                                              
                          {comment.indexOfPres == indexOfPresData &&
                          comment.indexOfMed == indexOfMedicines &&
                          medicine_comment_eedit_index == index ? (
                            <div className="comment table-row">
                              <input
                                id="usage_remarks_comment_input"
                                type="text"
                                value={free_comment}
                                onKeyPress={this.handleConfirmComment}
                                onChange={this.handleCommentChange}
                                onBlur={this.handleFocusoutComment}
                                autoFocus={comment_focus}
                              />
                            </div>
                          ):(
                            <>
                              <div
                                className="comment-item table-row"
                                style={{letterSpacing:"-1px"}}
                                onContextMenu={e =>
                                  this.handleClick(
                                    e,
                                    presData,
                                    indexOfPresData,
                                    indexOfMedicines,
                                    1,
                                    index
                                  )
                                }
                              >
                                {coment}
                              </div>
                            </>
                          )}
                        </div>
                      )
                      )}
                      {comment.indexOfPres == indexOfPresData &&
                      comment.indexOfMed == indexOfMedicines &&
                      medicine_comment_eedit_index ==
                      medicine.free_comment.length && (
                        <div className="comment table-row">
                          <input
                            id="usage_remarks_comment_input"
                            type="text"
                            value={free_comment}
                            onKeyPress={this.handleConfirmComment}
                            onChange={this.handleCommentChange}
                            onBlur={this.handleFocusoutComment}
                            autoFocus={comment_focus}
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  {this.medicineExist(order) == true && (
                    <div className="usage">
                      <div className="flex between table-row" onContextMenu={e => this.handleClick(e, presData, indexOfPresData, 0, 2)}>
                        <div className="btn-area">
                          <Button className="usage-select" onClick={() => this.onClickUssage(indexOfPresData)}>用法選択</Button>
                        </div>
                        <div className="text-right">
                          {!order.usageName ? (
                            <></>
                          ) : (
                            <>
                              {this.hasUnenabledUsage(order.usage) == true ? (
                                <>用法:<span className="line-through">{order.usageName}</span></>
                              ) : (
                                <>用法:{order.usageName}</>
                              )}
                            </>
                          )}
                        </div>
                        {parseInt(order.usageIndex) === 5 ||
                        parseInt(order.days) <= 0 ? (
                          <div className="unit" />
                        ) : (
                          <div className="unit">
                            {order.days}
                            {order.days_suffix !== undefined &&
                            order.days_suffix !== ""
                              ? order.days_suffix
                              : "日分"}
                          </div>
                        )}
                      </div>
                      {(order.one_dose_package === 1 ||
                        order.temporary_medication === 1 ||
                        order.mixture === 1) && (
                        <>
                          {/*「一包化」「粉砕」は内服薬用の用法のRPだけ設定できるように*/}
                          {order.one_dose_package == 1 && order.temporary_medication != 1 && order.mixture != 1 ? (
                            <>
                              {order.allowed_diagnosis_division != undefined && order.allowed_diagnosis_division.includes("21") ? (
                                <div className="flex between table-row" onContextMenu={e =>
                                  this.handleClick(e, presData, indexOfPresData, 0, 2)
                                }>
                                  <div className="unit" />
                                  <div className="text-right">
                                    {order.allowed_diagnosis_division != undefined && order.one_dose_package === 1 && order.allowed_diagnosis_division.includes("21")
                                      ? `【一包化】 `
                                      : ""}
                                    {order.temporary_medication === 1
                                      ? `【臨時処方】 `
                                      : ""}
                                    {order.allowed_diagnosis_division != undefined && order.mixture === 1 && order.allowed_diagnosis_division.includes("23")
                                      ? `【混合】 `
                                      : ""}
                                    &nbsp;
                                  </div>
                                  <div className="unit" />
                                </div>
                              ):(
                                <></>
                              )}
                            </>
                          ):(
                            <>
                              {/*「混合」は用法が外用のRPだけ設定できるように*/}
                              {order.one_dose_package != 1 && order.temporary_medication != 1 && order.mixture == 1 ? (
                                <>
                                  {order.allowed_diagnosis_division != undefined && order.allowed_diagnosis_division.includes("23") ? (
                                    <div className="flex between table-row" onContextMenu={e =>
                                      this.handleClick(e, presData, indexOfPresData, 0, 2)
                                    }>
                                      <div className="unit" />
                                      <div className="text-right">
                                        {order.allowed_diagnosis_division != undefined && order.one_dose_package === 1 && order.allowed_diagnosis_division.includes("21")
                                          ? `【一包化】 `
                                          : ""}
                                        {order.temporary_medication === 1
                                          ? `【臨時処方】 `
                                          : ""}
                                        {order.allowed_diagnosis_division != undefined && order.mixture === 1 && order.allowed_diagnosis_division.includes("23")
                                          ? `【混合】 `
                                          : ""}
                                        &nbsp;
                                      </div>
                                      <div className="unit" />
                                    </div>
                                  ):(
                                    <></>
                                  )}
                                </>
                              ):(
                                <div className="flex between table-row" onContextMenu={e =>
                                  this.handleClick(e, presData, indexOfPresData, 0, 2)
                                }>
                                  <div className="unit" />
                                  <div className="text-right">
                                    {order.allowed_diagnosis_division != undefined && order.one_dose_package === 1 && order.allowed_diagnosis_division.includes("21")
                                      ? `【一包化】 `
                                      : ""}
                                    {order.temporary_medication === 1
                                      ? `【臨時処方】 `
                                      : ""}
                                    {order.allowed_diagnosis_division != undefined && order.mixture === 1 && order.allowed_diagnosis_division.includes("23")
                                      ? `【混合】 `
                                      : ""}
                                    &nbsp;
                                  </div>
                                  <div className="unit" />
                                </div>
                              )}
                            </>
                          )}
                        </>
                      )}
                      {(order.administrate_period == undefined || order.administrate_period == null) && (
                        <div
                          className="flex between table-row prescribe-date"
                          onContextMenu={e =>
                            this.handleClick(e, presData, indexOfPresData, 0, 5)
                          }
                        >
                          <div className="unit" />
                            <>                            
                              {start_date_edit.indexOfPres == indexOfPresData ? (
                                <div className="text-right">
                                  <label>処方開始日: </label>
                                  <DatePicker
                                    locale="ja"
                                    selected={
                                      this.state.start_date_edit.start_date
                                    }
                                    onKeyDown={this.handleConfirmStartDate}
                                    onChange={this.handleStartDateChange}
                                    dateFormat="yyyy/MM/dd"
                                    placeholderText="年/月/日"
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    autoFocus
                                    dayClassName = {date => setDateColorClassName(date)}
                                  />
                                </div>
                              ) : (
                                <div className="text-right">
                                  {`処方開始日: ${formatJapanDateSlash(formatDate(order.start_date))}`}
                                  &nbsp;
                                </div>
                              )}
                            </>
                          <div className="unit" />
                        </div>
                      )}
                      <div
                        className="flex between table-row"
                        onContextMenu={e =>
                          this.handleClick(e, presData, indexOfPresData, 0, 6)
                        }
                      >
                        <div className="unit" />
                        {insurance_type_edit.index == indexOfPresData ? (
                          <div className="text-right">
                            <select
                              value={insurance_type_edit.value}
                              onChange={this.handleInsuranceTypeChange}
                              onKeyPress={this.handleInsuranceTypeChange}
                            >
                              {this.props.patientInfo.insurance_type_list.map(
                                (item, index) => {
                                  return (
                                    <option value={item.code} key={index}>
                                      {item.name}
                                    </option>
                                  );
                                }
                              )}
                            </select>
                          </div>
                        ) : (
                          <div className="text-right">
                            {`保険: ${this.getInsurance(order.insurance_type)}`}
                            &nbsp;
                          </div>
                        )}
                        <div className="unit" />
                      </div>
                      {(order.body_part !== undefined &&
                        order.body_part !== "") && (
                        <div
                          className="flex between table-row"
                          onContextMenu={e =>this.handleClick(e,presData,indexOfPresData,0,9)}
                        >
                          <div className="unit" />
                          <div className="text-right">
                            {`部位/補足: ${order.body_part}`}
                            &nbsp;
                          </div>
                          <div className="unit" />
                        </div>
                      )}
                      {order.usage_remarks_comment.map((coment, index) => (
                        <div key={index}>
                          {(comment_edit_index != index ||
                            (comment_edit_index == index &&
                              order.usage_remarks_comment.length > index &&
                              usage_remarks_comment == "")) && (
                            <div
                              className="comment-item table-row"
                              style={{letterSpacing:"-1px"}}
                              onContextMenu={e =>this.handleClick(e,presData,indexOfPresData,0,3,index)}
                            >
                              {coment}
                            </div>
                          )}
                          {usage_remarks_comment_index == indexOfPresData &&
                          comment_edit_index == index && (
                            <div className="remarks-comment table-row">
                              <input
                                id="usage_remarks_comment_input"
                                type="text"
                                value={usage_remarks_comment}
                                onKeyPress={this.handleUssageConfirmComment}
                                onChange={this.handleUssageCommentChange}
                                onBlur={this.handleUssageCommentBlur}
                                autoFocus
                              />
                            </div>
                          )}
                        </div>
                      ))}
                      {order.usage_remarks_comment.length ==
                      comment_edit_index &&
                      usage_remarks_comment_index == indexOfPresData && (
                        <div className="remarks-comment table-row">
                          <input
                            id="usage_remarks_comment_input"
                            type="text"
                            value={usage_remarks_comment}
                            onKeyPress={this.handleUssageConfirmComment}
                            onChange={this.handleUssageCommentChange}
                            onBlur={this.handleUssageCommentBlur}
                            autoFocus
                          />
                        </div>
                      )}
                      {order.administrate_period != undefined && order.administrate_period != null && (
                        <div className={'flex between table-row'}  onContextMenu={e => this.handleClick(e, presData, indexOfPresData, 0, 11)}>
                          <div className="unit"></div>
                          <div className="text-right">
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
                          <div className="unit">
                            {order.administrate_period.days != undefined && order.administrate_period.days > 0 ? order.administrate_period.days+"日分":""}
                          </div>
                        </div>
                      )}
                      {this.state.med_consult != undefined && this.state.med_consult == 1 && (
                        <div className={'flex between table-row'}>
                          <div className="unit"></div>
                          <div className="text-right">
                            【お薬相談希望あり】
                          </div>
                          <div className="unit"></div>
                        </div>
                      )}
                      {this.state.supply_med_info != undefined && this.state.supply_med_info == 1 && (
                        <div className={'flex between table-row'}>
                          <div className="unit"></div>
                          <div className="text-right">
                            【薬剤情報提供あり】
                          </div>
                          <div className="unit"></div>
                        </div>
                      )}
                    </div>
                  )}
                </PresBox>
              </div>
            ))}
          </Wrapper>
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
            presData={presData}
          />
          <CommentMenu
            {...this.state.commentMenu}
            parent={this}
            presData={presData}
          />
          <BodyPartMenu
            {...this.state.bodyPartMenu}
            parent={this}
            presData={presData}
          />
          <UssageMenu
            {...this.state.ussageMenu}
            parent={this}
            presData={presData}
            karteStatus={this.context.karte_status.code}
            isForUpdate={this.state.isUpdatePrescription}
            in_out={this.state.in_out}
          />
          <UssageCommentMenu
            {...this.state.ussageCommentMenu}
            parent={this}
            presData={presData}
          />
          <HoverFirstMenu
            {...this.state.HoverFirstMenu}
            parent={this}
            presData={presData}
            menu_data={this.state.first_menu_data}
          />
          <AdministrateMenu
            {...this.state.administrateMenu}
            parent={this}
            presData={presData}            
          />
          <HoverSecondMenu
            {...this.state.HoverSecondMenu}
            parent={this}
            presData={presData}
            menu_data={this.state.second_menu_data}
          />
          {this.state.medShow && (
            <MedPopup
              isLoaded={this.state.isLoaded}
              medShow={this.state.medShow}
              medClose={this.medClose}
              medicineData={medicineData}
              insertMed={this.insertMed}
              indexOfInsertPres={indexOfInsertPres}
              indexOfInsertMed={indexOfInsertMed}
              presData={presData}
              isExistPrefixMedicine={this.state.isExistPrefixMedicine}
              normalNameSearch={this.state._normalNameSearch}
            />
          )}
          {this.state.show && (
            <PrescribePopup
              patientInfo={this.props.patientInfo}
              indexNum={this.state.indexNum}
              medicine={this.state.medicine}
              show={this.state.show}
              handleClose={this.handleClose.bind(this)}
              confirm={this.confirm}
              insurance_type_list={this.props.patientInfo.insurance_type_list}
            />
          )}
          {this.state.isDoctorsOpen === true && (
            <SelectDoctorModal
              closeDoctor={this.closeDoctor}
              getDoctor={this.getDoctor}
              selectDoctorFromModal={this.selectDoctorFromModal}
              doctors={this.props.doctors}
            />
          )}
          {this.state.showMedicineDetail && (
            <MedicineDetailModal
              hideModal={this.handleCancel}
              handleCancel={this.handleCancel}
              medicineDetailList={this.state.medicineDetail}
            />
          )}
          {this.state.isMedicineBodyPartOpen && (
            <MedicineBodyParts
              bodyPartData={LETTER_DATA['letterData']}
              closeMedicineBodyParts={this.closeMedicineBodyParts}
              usageName=""
              body_part={this.body_part}
              medicinebodyPartConfirm={this.medicinebodyPartConfirm}
            />
          )}
          {this.state.confirm_message !== "" && (
            <SystemConfirmModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.confirmOk.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
        </>
      );
    }
  }
}
PrescribeTable.contextType = Context;

PrescribeTable.propTypes = {
  presData: PropTypes.array,
  confirm: PropTypes.func,
  handleCommentChange: PropTypes.func,
  saveUssageComment: PropTypes.func,
  handleFocusoutComment: PropTypes.func,
  saveComment: PropTypes.func,
  handleUssageCommentChange: PropTypes.func,
  handleUssageCommentBlur: PropTypes.func,
  changeAmountOrDays: PropTypes.func,
  indexNum: PropTypes.number,
  patientInfo: PropTypes.object,
  patientId: PropTypes.number,
  insertMed: PropTypes.func,
  onSelectUsage: PropTypes.func,
  isForUpdate: PropTypes.bool,
  doctors: PropTypes.array,
  setDoctorInfo: PropTypes.func,
  doctor_code: PropTypes.number,
  doctor_name: PropTypes.string,
  unusedDrugSearch: PropTypes.bool,
  profesSearch: PropTypes.bool,
  normalNameSearch: PropTypes.bool,
  isLoaded: PropTypes.bool,
  checkOptions: PropTypes.func,
  resetPresData: PropTypes.func,
  bodyPartData: PropTypes.array,
  storeDataInCache: PropTypes.func,
  showMedicineDetail: PropTypes.func,
  showDiagnosisPermission: PropTypes.func,
  checkPermissionByType: PropTypes.func,
  handleMedicineClick: PropTypes.func,
  selectDoctorFromModal: PropTypes.func,
  openBodyParts: PropTypes.func,
  registerSet: PropTypes.func,
  createCacheOrderData: PropTypes.func,
  usageData: PropTypes.array,
  letterData: PropTypes.array,
  registerNewSet: PropTypes.func,
  cancelAdministratePeriod: PropTypes.func,
  cacheSerialNumber: PropTypes.number,
  openAdministratePeriodInputModal: PropTypes.func,
  indexPresAndMed: PropTypes.func,
  stopLoadingFlag: PropTypes.number,
  med_consult: PropTypes.number,
  supply_med_info: PropTypes.number,
  in_out: PropTypes.number,
};

export default PrescribeTable;
