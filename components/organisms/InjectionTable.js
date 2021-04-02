/* eslint-disable consistent-this */
import React, { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import Context from "~/helpers/configureStore";
import InjectionTableBody from "./InjectionTableBody";
import Button from "../atoms/Button";
import {
  faPlusSquare,
  faPenSquare,
  faTimesSquare,
  faTrash,
  faCommentPlus,
  faBookMedical,
  // faSack
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import $ from "jquery";
import InjectMedPopup from "./InjectMedPopup";
import SelectDoctorModal from "../templates/Patient/components/SelectDoctorModal";
import MedicineBodyParts from "../molecules/MedicineBodyParts";
import {CACHE_LOCALNAMES, CACHE_SESSIONNAMES, LETTER_DATA, KARTEMODE, PERMISSION_TYPE, BOILERPLATE_FUNCTION_ID_CATEGORY} from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";
import * as sessApi from "~/helpers/cacheSession-utils";
import Spinner from "react-bootstrap/Spinner";
import {formatJapanDateSlash, getWeekNamesBySymbol} from "~/helpers/date";

const SpinnerWrapper = styled.div`
  // height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  background: #f1f3f4;
  width: 50%;
  z-index: 1;
  height: calc(100vh - 260px);
`;

const Wrapper = styled.div`
  background-color: ${colors.onSecondaryLight};
  border: 1px solid ${colors.disable};
  width: 100%;
  margin-bottom: 16px;
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
  }
  .medicine_alert{
    background-color: #ffddcc;
  }
  .medicine_duplicate{
    background-color: #ffffcc;
  }
  .usage-permission-allow{
    background-color: #ffffcc;
  }
  .usage-permission-reject{
    background-color: #ffddcc;
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

const Icon = styled(FontAwesomeIcon)`
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  margin-right: 4px;
`;

// const UssageMenu = ({ visible, x, y, parent, presData, karteStatus, inOut, isForUpdate }) => {
const UssageMenu = ({ visible, x, y, parent, presData }) => {
  const order = presData[parent.state.indexOfPres];
  let blue_text = presData[parent.state.indexOfPres] != undefined && presData[parent.state.indexOfPres] != null && presData[parent.state.indexOfPres]['is_precision'] == 1 ? "blue-text" : "";
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu usage-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {order.usageName != undefined && order.usageName != null && order.usageName != "" && (
            <>
              <li className={'ussage_regular_comment-menu'}>
                <div onMouseOver={(e) =>parent.contextMenuAction("ussage_regular_comment", presData, e, x, y)}>追加用法コメント(定型)</div>
              </li>
              <li>
                <div
                  onClick={() => parent.contextMenuAction("ussage_comment", presData)}
                  onMouseOver={() => parent.closeHoverMenu()}
                >追加用法コメント</div></li>
            </>
          )}
          {(order.body_part === undefined || order.body_part === "") && (
            <li>
              <div
                onClick={() => parent.contextMenuAction("body_part", presData)}
                onMouseOver={() => parent.closeHoverMenu()}
              >部位指定コメント</div></li>
          )}
          <li>
            <div
              onClick={() =>parent.contextMenuAction("insurance_edit", presData)}
              onMouseOver={() => parent.closeHoverMenu()}
            >保険変更</div></li>
          {presData[parent.state.indexOfPres]['receipt_key_if_precision'] != null && (
            <li>
              <div
                onClick={() => parent.contextMenuAction("receipt_key", presData)}
                onMouseOver={() => parent.closeHoverMenu()}
                className={blue_text}
              >精密持続点滴</div></li>
          )}
          {/*{karteStatus == 1 && parseInt(inOut) == 4 && !isForUpdate && (
            <li>
              <div
                onClick={() => parent.contextMenuAction("administrate_period", presData)}
                onMouseOver={() => parent.closeHoverMenu()}
              >投与期間入力</div></li>
          )}*/}
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
        <ul className="context-menu usage-comment-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() =>parent.contextMenuAction("ussage_comment_edit", presData)}>コメント変更</div></li>
          <li><div onClick={() =>parent.contextMenuAction("ussage_comment_remove", presData)}>コメント削除</div></li>
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
          <li><div onClick={() =>parent.contextMenuAction("body_part_edit", presData)}>部位指定コメント変更</div></li>
          <li><div onClick={() =>parent.contextMenuAction("body_part_remove", presData)}>部位指定コメント削除</div></li>
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
          <li><div onClick={() => parent.contextMenuAction("comment_edit", presData)}>コメント変更</div></li>
          <li><div onClick={() =>parent.contextMenuAction("comment_remove", presData)}>コメント削除</div></li>
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

const ContextMenu = ({ visible, x, y, parent, presData }) => {
  const drugCount =
    presData[parent.state.indexOfPres] !== undefined
      ? presData[parent.state.indexOfPres].medicines.length
      : 0;
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div
              onClick={() => parent.contextMenuAction("newdrug", presData)}
              onMouseOver={() => parent.closeHoverMenu()}
            ><Icon icon={faPlusSquare} />薬品の登録</div></li>
          <li>
            <div
              onClick={() => parent.contextMenuAction("drugchange", presData)}
              onMouseOver={() => parent.closeHoverMenu()}
            ><Icon icon={faPenSquare} />薬品と数量の変更</div></li>
          <li><div
            onClick={() =>parent.contextMenuAction("drug_amount_change", presData)}
            onMouseOver={() => parent.closeHoverMenu()}
          ><Icon icon={faPenSquare} />数量の変更</div></li>
          {drugCount != 1 && (
            <li>
              <div
                onClick={() => parent.contextMenuAction("drugdel", presData)}
                onMouseOver={() => parent.closeHoverMenu()}
              ><Icon icon={faTimesSquare} />薬品の削除</div></li>
          )}
          <li>
            <div
              onClick={() => parent.contextMenuAction("paragraphdel", presData)}
              onMouseOver={() => parent.closeHoverMenu()}
            ><Icon icon={faTrash} />区切りの削除</div></li>
          <li className="comment-regular-menu"><div onMouseOver={(e) => parent.contextMenuAction("comment_regular", presData, e, x, y)}><Icon icon={faCommentPlus} />コメント</div></li>
          <li><div
            onClick={() => parent.contextMenuAction("comment", presData)}
            onMouseOver={() => parent.closeHoverMenu()}
          ><Icon icon={faCommentPlus} />フリーコメント</div></li>
          {parent.state.canViewDetail && (
            <li>
              <div
                onClick={() => parent.contextMenuAction("viewDetail", presData)}
                onMouseOver={() => parent.closeHoverMenu()}
              ><Icon icon={faBookMedical} />詳細情報の閲覧</div></li>
          )}
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
              <li key={index}>
                <div onMouseOver={() => parent.setHover(x,y, presData,item, index)} onClick={() => parent.contextMenuAction("first_hover_comment", presData, item)}>
                  {item.category_name}{item.body}
                </div>
              </li>
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
        <ul className={`context-menu ${parent.second_menu_pos == "left" ? "pos-left":""}`} style={{ left: `${x}px`, top: `${y}px` }}>
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

class InjectionTable extends Component {
  constructor(props) {
    super(props);
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.state = {
      medShow: false,
      isLoaded: false,
      isPropsLoaded: props.isLoaded,
      stopLoadingFlag: props.stopLoadingFlag,
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
      administrateMenu: {
        visible: false,
        x: 0,
        y: 0
      },
      ussageCommentMenu: {
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
      free_comment: "",
      usage_remarks_comment_index: -1,
      usage_remarks_comment: "",
      comment_edit_index: -1,
      medicine_comment_eedit_index: -1,
      isDoctorsOpen: false,
      selectedDoctorID: this.props.doctor_code,
      selectedDoctorName: this.props.doctor_name,
      canEdit: authInfo.staff_category === 1,
      staff_category: authInfo.staff_category || 2,
      insurance_type_edit: {
        index: -1,
        value: 0
      },
      insurance_type_edit_index: -1,
      injectData: this.props.injectData,
    };
    this.boilerplate_master = null;
    this.boilerplate_master_category = null;
    this.body_part = '';
    
    // manage showing position second menu of コメント and 追加用法コメント(定型)
    this.second_menu_pos = "right";

    // ●YJ884 薬剤検索時に依頼医選択が割り込んだ時に、クリックで選ぶと検索はキャンセルされた扱いになる
    this.word = null;
    this.indexOfPresData = null;
    this.indexOfMedicines = null;
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
  
  onClickUssage = indexOfPresData => {
    if (this.context.$getKarteMode(this.props.patientId) == KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
    const realIndex =
      indexOfPresData + 1 == this.props.injectData.length ? -1 : indexOfPresData;
    this.props.onSelectUsage(realIndex);
  };
  
  onClickInjectUssage = indexOfPresData => {
    const realIndex =
      indexOfPresData + 1 == this.props.injectData.length ? -1 : indexOfPresData;
    this.props.onSelectInjectUsage(realIndex);
  };
  
  medClose = () => {
    this.setState({
      medShow: false,
      canEdit: this.state.staff_category === 1,
      isLoaded: false,
      medicineData: [],
    });
  };
  
  closeDoctor = () => {
    // ●YJ884 薬剤検索時に依頼医選択が割り込んだ時に、クリックで選ぶと検索はキャンセルされた扱いになる
    this.word = null;
    this.indexOfPresData = null;
    this.indexOfMedicines = null;

    this.setState({
      isDoctorsOpen: false,
      canEdit: this.state.staff_category === 1
    });
  };
  
  handleClick(e,presData,indexOfPresData,indexOfMedicines,menu_type,comment_edit_index = -1) {
    
    // check is update => not show 投与期間入力 menu
    let cacheState = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_EDIT, this.props.cacheSerialNumber);
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
    let clientX = e.clientX;
    let clientY = e.clientY;
    var index;
    if (menu_type < 2) {
      index =
        comment_edit_index == -1
          ? presData[indexOfPresData].medicines[indexOfMedicines].free_comment
            .length
          : comment_edit_index;
    } else if (menu_type === 5 || menu_type === 6 || menu_type === 9) {
      index = indexOfPresData;
    } else {
      index =
        comment_edit_index == -1
          ? presData[indexOfPresData].usage_remarks_comment.length
          : comment_edit_index;
    }
    if (e.type === "contextmenu") {
      if (
        presData.length - 1 != indexOfPresData ||
        presData[presData.length - 1].medicines.length - 1 !=
        indexOfMedicines ||
        this.props.isForUpdate == true
      ) {
        this.setState({
          indexOfPres: indexOfPresData,
          indexOfMed: indexOfMedicines
        });
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
          let state_data = {};
          state_data['commentMenu'] = {
            visible: true,
            x: e.clientX - $('#injection-div-history').offset().left,
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
              state_data['commentMenu']['x'] = clientX - $('#injection-div-history').offset().left - menu_width;
              state_data['commentMenu']['y'] = clientY + window.pageYOffset - menu_height - 120;
            } else if (((clientY + menu_height) > window_height) && ((clientX + menu_width + 190) < window_width)) {
              state_data['commentMenu']['x'] = clientX - $('#injection-div-history').offset().left;
              state_data['commentMenu']['y'] = clientY + window.pageYOffset - menu_height - 120;
            } else if (((clientY + menu_height) < window_height) && ((clientX + menu_width + 190) > window_width)) {
              state_data['commentMenu']['x'] = clientX - $('#injection-div-history').offset().left - menu_width;
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
          let state_data = {};
          state_data['contextMenu'] = {
            visible: true,
            x: e.clientX - $('#injection-div-history').offset().left,
            y: e.clientY + window.pageYOffset - 120
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
              state_data['contextMenu']['x'] = clientX - $('#injection-div-history').offset().left - menu_width;
              state_data['contextMenu']['y'] = clientY + window.pageYOffset - menu_height - 120;
            } else if (((clientY + menu_height) > window_height) && ((clientX + menu_width + 190) < window_width)) {
              state_data['contextMenu']['x'] = clientX - $('#injection-div-history').offset().left;
              state_data['contextMenu']['y'] = clientY + window.pageYOffset - menu_height - 120;
            } else if (((clientY + menu_height) < window_height) && ((clientX + menu_width + 190) > window_width)) {
              // コメント'second menu position
              this.second_menu_pos = "left";
              state_data['contextMenu']['x'] = clientX - $('#injection-div-history').offset().left - menu_width;
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
          let state_data = {};
          state_data['ussageMenu'] = {
            visible: true,
            x: e.clientX - $('#injection-div-history').offset().left,
            y: e.clientY + window.pageYOffset - 120
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
            let menu_height = document.getElementsByClassName("usage-menu")[0].offsetHeight;
            let menu_width = document.getElementsByClassName("usage-menu")[0].offsetWidth;
            let window_height = window.innerHeight;
            let window_width = window.innerWidth;
            if (((clientY + menu_height) > window_height) && ((clientX + menu_width + 190) > window_width)) {
              state_data['ussageMenu']['x'] = clientX - $('#injection-div-history').offset().left - menu_width;
              state_data['ussageMenu']['y'] = clientY + window.pageYOffset - menu_height - 120;
            } else if (((clientY + menu_height) > window_height) && ((clientX + menu_width + 190) < window_width)) {
              state_data['ussageMenu']['x'] = clientX - $('#injection-div-history').offset().left;
              state_data['ussageMenu']['y'] = clientY + window.pageYOffset - menu_height - 120;
            } else if (((clientY + menu_height) < window_height) && ((clientX + menu_width + 190) > window_width)) {
              // 追加用法コメント(定型)'second menu position
              this.second_menu_pos = "left";
              state_data['ussageMenu']['x'] = clientX - $('#injection-div-history').offset().left - menu_width;
              state_data['ussageMenu']['y'] = clientY + window.pageYOffset - 120;
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
          let state_data = {};
          state_data['bodyPartMenu'] = {
            visible: true,
            x: e.clientX - $('#injection-div-history').offset().left,
            y: e.clientY + window.pageYOffset - 120
          };
          state_data['insurance_type_edit_index'] = index;
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
              state_data['bodyPartMenu']['x'] = clientX - $('#injection-div-history').offset().left - menu_width;
              state_data['bodyPartMenu']['y'] = clientY + window.pageYOffset - menu_height - 120;
            } else if (((clientY + menu_height) > window_height) && ((clientX + menu_width + 190) < window_width)) {
              state_data['bodyPartMenu']['x'] = clientX - $('#injection-div-history').offset().left;
              state_data['bodyPartMenu']['y'] = clientY + window.pageYOffset - menu_height - 120;
            } else if (((clientY + menu_height) < window_height) && ((clientX + menu_width + 190) > window_width)) {
              state_data['bodyPartMenu']['x'] = clientX - $('#injection-div-history').offset().left - menu_width;
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
          let state_data = {};
          state_data['administrateMenu'] = {
            visible: true,
            x: e.clientX - $('#injection-div-history').offset().left,
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
              state_data['administrateMenu']['x'] = clientX - $('#injection-div-history').offset().left-menu_width;
              state_data['administrateMenu']['y'] = clientY + window.pageYOffset - 120 - menu_height;
            } else if (((clientY + menu_height) > window_height) && ((clientX + menu_width + 190) < window_width)) {
              state_data['administrateMenu']['x'] = clientX - $('#injection-div-history').offset().left;
              state_data['administrateMenu']['y'] = clientY + window.pageYOffset - 120 - menu_height;
            } else if (((clientY + menu_height) < window_height) && ((clientX + menu_width + 190) > window_width)) {
              state_data['administrateMenu']['x'] = clientX - $('#injection-div-history').offset().left -menu_width;
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
          let state_data = {};
          state_data['ussageCommentMenu'] = {
            visible: true,
            x: e.clientX - $('#injection-div-history').offset().left,
            y: e.clientY + window.pageYOffset - 120
          };
          state_data['comment_edit_index'] = index;
          state_data['insurance_type_edit_index'] = index;
          state_data['commentMenu'] = { visible: false };
          state_data['contextMenu'] = { visible: false };
          state_data['ussageMenu'] = { visible: false };
          state_data['bodyPartMenu'] = { visible: false };
          state_data['administrateMenu'] = { visible: false };
          this.setState(state_data, ()=>{
            let menu_height = document.getElementsByClassName("usage-comment-menu")[0].offsetHeight;
            let menu_width = document.getElementsByClassName("usage-comment-menu")[0].offsetWidth;
            let window_height = window.innerHeight;
            let window_width = window.innerWidth;
            if (((clientY + menu_height) > window_height) && ((clientX + menu_width + 190) > window_width)) {
              state_data['ussageCommentMenu']['x'] = clientX - $('#injection-div-history').offset().left - menu_width;
              state_data['ussageCommentMenu']['y'] = clientY + window.pageYOffset - menu_height - 120;
            } else if (((clientY + menu_height) > window_height) && ((clientX + menu_width + 190) < window_width)) {
              state_data['ussageCommentMenu']['x'] = clientX - $('#injection-div-history').offset().left;
              state_data['ussageCommentMenu']['y'] = clientY + window.pageYOffset - menu_height - 120;
            } else if (((clientY + menu_height) < window_height) && ((clientX + menu_width + 190) > window_width)) {
              state_data['ussageCommentMenu']['x'] = clientX - $('#injection-div-history').offset().left - menu_width;
              state_data['ussageCommentMenu']['y'] = clientY + window.pageYOffset - 120;
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
  
  contextMenuAction = (act, presData,e, x_pos=null, y_pos=null) => {
    window.sessionStorage.setItem("prescribe-auto-focus", 0);
    if (act === "newdrug") {
      const newData = presData[this.state.indexOfPres].medicines.slice(0); // copy
      
      const item = {
        medicineId: 0,
        medicineName: "",
        amount: 0,
        unit: "",
        usage_comment: "",
        free_comment: [],
      };
      
      newData.splice(this.state.indexOfMed + 1, 0, item);
      presData[this.state.indexOfPres].medicines = newData;
      window.sessionStorage.setItem("prescribe-auto-focus", 1);
      window.sessionStorage.setItem("createfocus", 1);
      
      this.props.storeDataInCache();
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
      this.props.storeDataInCache();
    } else if (act === "body_part") {
      this.props.openBodyParts(this.state.indexOfPres);
    } else if (act === "insurance_edit") {
      this.setState({
        insurance_type_edit: {
          index: this.state.insurance_type_edit_index,
          value: presData[this.state.insurance_type_edit_index].insurance_type
        }
      });
    } else if (act === "administrate_period") {
      this.props.openAdministratePeriodInputModal(this.state.indexOfPres);
    } else if (act === "ussage_comment") {
      this.setState({
        usage_remarks_comment_index: this.state.indexOfPres,
        comment_edit_index: presData[this.state.indexOfPres].usage_remarks_comment.length,
        usage_remarks_comment: ""
      });
    } else if (act === "comment") {
      this.setState({
        comment: {
          indexOfPres: this.state.indexOfPres,
          indexOfMed: this.state.indexOfMed
        },
        medicine_comment_eedit_index: presData[this.state.indexOfPres].medicines[this.state.indexOfMed].free_comment.length,
        free_comment: "",
        comment_focus: 1,
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
    } else if (act === "comment_remove") {
      var free_comment =
        presData[this.state.indexOfPres].medicines[this.state.indexOfMed]
          .free_comment;
      free_comment.splice(this.state.medicine_comment_eedit_index, 1);
      
      presData[this.state.indexOfPres].medicines[
        this.state.indexOfMed
        ].free_comment = free_comment;
      this.props.storeDataInCache();
    } else if (act === "administrate_remove") {
      delete presData[this.state.administrate_pres_index].administrate_period;
      this.setState({
        administrateMenu: { visible: false }
      },()=>{
        let _data = {"is_reload_state": false};
        this.props.storeDataInCache(_data);
      });
    } else if (act === "administrate_period_edit") {
      this.props.openAdministratePeriodInputModal(this.state.administrate_pres_index);
    } else if (act === "ussage_comment_edit") {
      const usage_remarks_comment =
        presData[this.state.indexOfPres].usage_remarks_comment;
      if (this.state.comment_edit_index != -1) {
        this.setState({
          usage_remarks_comment_index: this.state.indexOfPres,
          usage_remarks_comment:
            usage_remarks_comment[this.state.comment_edit_index]
        }, ()=>{
          this.setCaretPosition("usage_remarks_comment_input", usage_remarks_comment[this.state.comment_edit_index].length);
        });
      }
    } else if (act === "ussage_comment_remove") {
      var comment_list = presData[this.state.indexOfPres].usage_remarks_comment;
      comment_list.splice(this.state.comment_edit_index, 1);
      presData[
        this.state.indexOfPres
        ].usage_remarks_comment = comment_list;
      this.props.storeDataInCache();
    } else if (act === "body_part_edit") {
      this.props.openBodyParts(this.state.indexOfPres);
    } else if (act === "body_part_remove") {
      presData[this.state.indexOfPres].body_part = "";
      this.props.storeDataInCache();
    }else if (act === "drugdel") {
      presData[this.state.indexOfPres].medicines.splice(
        [this.state.indexOfMed],
        1
      );
      window.localStorage.removeItem(
        "inject_keyword_" +
        this.state.indexOfPres +
        "_" +
        this.state.indexOfMed
      );
      this.props.storeDataInCache();
    } else if (act === "paragraphdel") {
      const order_number = presData[this.state.indexOfPres].order_number;
      let cacheInjectState = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_EDIT, this.props.cacheSerialNumber);
      if(presData.length > 1 || cacheInjectState[0]['item_details'][0]['item_id'] !== 0){
        presData.splice(this.state.indexOfPres, 1);
        this.props.resetPresData(order_number, presData, this.props.patientId);
      } else {
        this.props.resetPresData(order_number, null, this.props.patientId);
      }
      for (var key in window.localStorage) {
        if (key.includes("inject_keyword_" + this.state.indexOfPres)) {
          window.localStorage.removeItem(key);
        }
      }
    } else if(act === "receipt_key") {
      if (presData[this.state.indexOfPres].receipt_key_if_precision !== undefined && presData[this.state.indexOfPres].receipt_key_if_precision != null) {
        presData[this.state.indexOfPres]['is_precision'] = presData[this.state.indexOfPres]['is_precision'] == undefined ||
        presData[this.state.indexOfPres]['is_precision'] == null || presData[this.state.indexOfPres]['is_precision'] == 0 ? 1 : 0;
      }
      let storeData ={"is_reload_state": false};
      this.props.storeDataInCache(storeData);
    }
    else if (act === "drug_amount_change") {
      this.props.changeAmountOrDays(
        true,
        this.state.indexOfPres,
        this.state.indexOfMed
      );
    } else if (act === "ussage_regular_comment") {
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
      this.setState(state_data, ()=>{
        let menu_width = document.getElementsByClassName("hover-first-menu")[0].offsetWidth;
        state_data['HoverFirstMenu']['x'] = x_pos - menu_width;
        this.setState(state_data);
      });
    } else if (act==="comment_regular") {
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
      this.setState(state_data, ()=>{
        let menu_width = document.getElementsByClassName("hover-first-menu")[0].offsetWidth;
        state_data['HoverFirstMenu']['x'] = x_pos - menu_width;
        this.setState(state_data);
      });
    } else if (act === "first_hover_comment") {
      let menu_item = e;
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
      let menu_item = e;
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
          comment_focus: 1,
        },()=>{
          this.setCaretPosition("usage_remarks_comment_input", comment.length);
        });
      }
    }
    
  };
  
  checkCanEdit = () => {
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
  
  search = (word, indexOfPresData, indexOfMedicines) => {
    if (this.state.staff_category != 1 && (this.state.selectedDoctorID == 0 || this.state.selectedDoctorID == undefined)) {
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
        isDoctorsOpen: true
      });
      return;
    }
    const { injectData } = this.props;
    const medicines = injectData[injectData.length - 1].medicines;
    if (word.length == 0 && medicines.length > 1) {
      const realIndex =
        indexOfPresData + 1 == injectData.length ? -1 : indexOfPresData;
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
      isLoaded: false
    });
    this.timer = setTimeout(() => {
      const postData = {
        word: word,
        mode: "injection",
        enable_no_number_item: 0
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
        .then(result => {
          const searchedMedicine = [];
          result.data.forEach(medicine => {
            searchedMedicine.push({
              code: medicine.code,
              name: medicine.name,
              main_unit: medicine.main_unit,
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
              tagret_contraindication: medicine.tagret_contraindication,
              yj_code: medicine.yj_code
            });
          });
          if (this.checkCanEdit() === false) {
            this.setState({ medicineData: searchedMedicine });
            return false;
          }
          
          this.setState({
            medicineData: searchedMedicine,
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
    this.setState({
      medShow: false
    },()=>{
      this.props.insertMed(medicine, indexOfInsertPres, indexOfInsertMed);
    });
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
  
  selectDoctorFromModal = (id, name) => {
    // ●YJ884 薬剤検索時に依頼医選択が割り込んだ時に、クリックで選ぶと検索はキャンセルされた扱いになる    
    if (this.word != "") {
      this.props.selectDoctorFromModal(id, name, this.word, this.indexOfPresData, this.indexOfMedicines);      
    } else {
      this.props.selectDoctorFromModal(id, name);      
    }    
  };
  
  getDoctor = e => {
    this.selectDoctorFromModal(e.target.id, e.target.getAttribute("label"));
  };
  
  handleInsuranceTypeChange = e => {
    const { insurance_type_edit_index } = this.state;
    
    this.props.injectData[insurance_type_edit_index].insurance_type = parseInt(
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
  
  handleConfirmComment = e => {
    if (e.key === "Enter") {
      this.saveComment(e);
    }
  };
  
  handleCommentChange = e => {
    this.setState({
      free_comment: e.target.value
    });
  };
  
  saveComment = e => {
    e.stopPropagation();
    e.preventDefault();
    const {
      comment,
      free_comment,
      medicine_comment_eedit_index
    } = this.state;
    if(free_comment.length > 0) {
      if (
        medicine_comment_eedit_index !=
        this.props.injectData[comment.indexOfPres].medicines[comment.indexOfMed]
          .free_comment.length
      ) {
        this.props.injectData[comment.indexOfPres].medicines[
          comment.indexOfMed
          ].free_comment[medicine_comment_eedit_index] =
          free_comment.length > 30
            ? free_comment.substring(0, 30)
            : free_comment;
      } else {
        this.props.injectData[comment.indexOfPres].medicines[
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
    this.setState({
      comment_focus: 0
    });
    this.saveComment(e);
  };
  
  
  handleUssageConfirmComment = e => {
    if (e.key === "Enter") {
      this.saveUssageComment(e)
    }
  };
  
  handleUssageCommentChange = e => {
    this.setState({
      usage_remarks_comment: e.target.value
    });
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
        this.props.injectData[usage_remarks_comment_index].usage_remarks_comment
          .length
      ) {
        this.props.injectData[usage_remarks_comment_index].usage_remarks_comment[
          comment_edit_index
          ] =
          usage_remarks_comment.length > 30
            ? usage_remarks_comment.substring(0, 30)
            : usage_remarks_comment;
      } else {
        this.props.injectData[
          usage_remarks_comment_index
          ].usage_remarks_comment.push(
          usage_remarks_comment.length > 30
            ? usage_remarks_comment.substring(0, 30)
            : usage_remarks_comment
        );
      }
      
      let storeData ={"is_reload_state": false};
      this.props.storeDataInCache(storeData);
      
      this.setState({
        usage_remarks_comment_index: -1,
        usage_remarks_comment: "",
        comment_edit_index: -1
      });
    } else {
      this.setState({
        usage_remarks_comment_index: -1,
        usage_remarks_comment: "",
        comment_edit_index: -1
      });
    }
  }
  
  handleUssageCommentBlur = e => {
    this.saveUssageComment(e);
  }
  
  closeMedicineBodyParts = () =>
    this.setState({ isMedicineBodyPartOpen: false });
  
  medicinebodyPartConfirm = value => {
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
    this.body_part = window.localStorage.getItem("inject_keyword");
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
  
  hasUnenabledUsage = (usage_number) => {
    // let usageNumberArray = [];
    let usageData = {};
    let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
    if (init_status != null && init_status != undefined && init_status.injection_usage != undefined && init_status.injection_usage != null) {
      usageData = init_status.injection_usage;
    }
    if (usage_number == null || usage_number == undefined) {
      return false;
    }
    
    let nHasUnenabledUsage = 0;
    if (usageData != null && usageData != undefined && usageData.length > 0) {
      usageData.map(ele=>{
        if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
          nHasUnenabledUsage = 1;
        }
      });
      if (nHasUnenabledUsage == 1) {
        return true;
      }
    }
    return false;
  }
  
  testRender = (injectData) => {
    this.setState({injectData: injectData});
    this.props.injectData = injectData;
  };
  
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
  
  // 790-1 処方・注射の薬剤のコメントや追加用法コメントの入力で、定型文を呼び出して追加もできるように
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
      first_usage_menu = category_data.filter(x=>x.function_id==BOILERPLATE_FUNCTION_ID_CATEGORY.INJECTION && x.is_flat != 1 && x.use_place === "追加用法コメント");
      first_med_menu = category_data.filter(x=>x.function_id==BOILERPLATE_FUNCTION_ID_CATEGORY.INJECTION && x.is_flat != 1 && x.use_place === "薬剤コメント");
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
        if (item.function_id == BOILERPLATE_FUNCTION_ID_CATEGORY.INJECTION && item.is_flat == 1 && item.use_place === "追加用法コメント"){
          flat_category.push(item.category_id);
        }
      });
      if (flat_category.length > 0) {
        let flat_first_usage_menu = master_data.filter(x=>flat_category.includes(x.category_id.toString()));
        first_usage_menu = first_usage_menu.concat(flat_first_usage_menu);
      }
      flat_category = [];
      category_data.map(item=>{
        if (item.function_id == BOILERPLATE_FUNCTION_ID_CATEGORY.INJECTION && item.is_flat == 1 && item.use_place === "薬剤コメント"){
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
  
  setHover (x,y, injectData, item, index) {
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
    state_data['injectData'] = injectData;
    state_data['second_menu_data'] = menu_data;
    this.setState(state_data, ()=>{
      let menu_width = document.getElementsByClassName("hover-second-menu")[0].offsetWidth;
      state_data['HoverSecondMenu']['x'] = x - menu_width;
      this.setState(state_data);
    });
    
    
    // let menu_width = document.getElementsByClassName('context-menu')[0].clientWidth;
    
    // // check second menu position
    // if (this.second_menu_pos == "left") {
    //   this.setState({
    //       HoverSecondMenu: {
    //           visible: true,
    //           x: x - menu_width -110,
    //           y: y,
    //       },
    //       injectData,
    //       second_menu_data:menu_data,
    //   });
    // } else {
    //   this.setState({
    //       HoverSecondMenu: {
    //           visible: true,
    //           x: x + menu_width,
    //           y: y,
    //       },
    //       injectData,
    //       second_menu_data:menu_data,
    //   });
    // }
  }
  
  setCaretPosition =(elemId, caretPos)=> {
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
  
  testIsLoadedRender = (isLoaded = false) => {
    this.setState({
      isPropsLoaded: isLoaded
    });
  }
  
  testModalObjRender = (_status) => {
    this.setState(_status);
  }
  
  // ■YJ401 Doや編集が展開できていないように見える問題の修正
  setPrescribeTableLoad = (val=true) => {
    this.setState({isSelfLoad: val});
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
    const {
      medicineData,
      indexOfInsertPres,
      indexOfInsertMed,
      usage_remarks_comment_index,
      usage_remarks_comment,
      comment_edit_index,
      free_comment,
      comment,
      medicine_comment_eedit_index,
      comment_focus,
      insurance_type_edit
    } = this.state;    
    const { injectData } = this.state;
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
            id="soap_list_wrapper"
          >
            {injectData.map((order, indexOfPresData) => (
              <div className="prescribe-table" key={indexOfPresData}>
                <PresBox className="prescribe-box">
                  <div className="usage">
                    <div
                      className="flex between table-row"
                      onContextMenu={e =>
                        this.handleClick(e, injectData, indexOfPresData, 0, 2)
                      }
                    >
                      <div className="rp-number">
                        <span>Rp {indexOfPresData + 1}</span>
                      </div>
                      <div className="text-right">
                        {!order.usageName ? (
                          <></>
                        ) : (
                          <>
                            {this.hasUnenabledUsage(order.usage) == true ? (
                              <>手技:<span className="line-through">{order.usageName}</span></>
                            ) : (
                              <>手技:{order.usageName}</>
                            )}
                          </>
                        )}
                      </div>
                      <div className="btn-area unit">
                        <Button
                          className="usage-select"
                          onClick={() => this.onClickUssage(indexOfPresData)}
                        >
                          手技選択
                        </Button>
                      </div>
                    </div>
                    {(order.is_precision !== undefined &&
                      order.is_precision === 1) && (
                      <div className="flex between table-row" onContextMenu={e =>this.handleClick(e,injectData,indexOfPresData,0,6)}>
                        <div className="unit" />
                        <div className="text-right">
                          【精密持続点滴】
                          &nbsp;
                        </div>
                        <div className="unit" />
                      </div>
                    )}
                  </div>
                  {order.medicines.map((medicine, indexOfMedicines) => (
                    <div className="box" key={indexOfMedicines}>
                      <div className="drug-item table-row">
                        {order.usageName !== "" && (
                          <div
                            className="flex"
                            onContextMenu={e =>
                              this.handleClick(e, injectData, indexOfPresData, indexOfMedicines, 0)
                            }
                          >
                            <div className="rp-number">
                            </div>
                            <InjectionTableBody
                              key={indexOfMedicines}
                              indexNum={indexOfMedicines}
                              medicine={medicine}
                              search={this.search}
                              indexOfPresData={indexOfPresData}
                              isLastRow={
                                indexOfPresData === injectData.length - 1
                                && indexOfMedicines === order.medicines.length - 1
                              }
                              openMedicineBodyParts={this.openMedicineBodyParts}
                              patientId={this.props.patientId}
                            />
                          </div>
                        )}
                      </div>
                      {parseInt(medicine.amount) >= 0 && (
                        (medicine.period_permission !== 0 && medicine.period_permission !== undefined) ||
                        (medicine.disease_permission !== 0 && medicine.disease_permission !== undefined) ||
                        (medicine.alert_permission !== 0 && medicine.alert_permission !== undefined) ||
                        (medicine.duplciate_permission !== 0 && medicine.duplciate_permission !== undefined)
                      ) && (
                        <>
                          <div className="drug-item table-row">
                            <div className="flex">
                              <div className="rp-number" />
                              <div className="text-right">
                                {medicine.medicineName != "" && medicine.period_permission !== undefined && medicine.period_permission !== 0 ? (
                                  <span onClick={() => this.onClickPermission(medicine.period_permission == 1, indexOfPresData, indexOfMedicines, PERMISSION_TYPE.PERIOD)} className={medicine.period_permission == 1 ? "usage-permission-allow" : "usage-permission-reject"}
                                        title="[期間] この製品は有効期間外のため使用できません"
                                  >[期] </span>
                                ) : ""}
                                {medicine.medicineName != "" && medicine.disease_permission != undefined && medicine.disease_permission != 0 ? (
                                  <span onClick={() => this.onClickPermission(medicine.disease_permission == 1, indexOfPresData, indexOfMedicines, PERMISSION_TYPE.DISEASE)} className={medicine.disease_permission == 1 ? "usage-permission-allow" : "usage-permission-reject"}
                                        title="[禁忌] 禁忌情報があります"
                                  >[禁] </span>
                                ) : ""}
                                {medicine.medicineName != "" && medicine.alert_permission != undefined && medicine.alert_permission != 0 ? (
                                  <span onClick={() => this.onClickPermission(medicine.alert_permission == 1, indexOfPresData, indexOfMedicines, PERMISSION_TYPE.ALERT)} className={medicine.alert_permission == 1 ? "usage-permission-allow" : "usage-permission-reject"}
                                        title="[併用] 相互作用情報があります"
                                  >[併] </span>
                                ) : ""}
                                {medicine.medicineName != "" && medicine.duplciate_permission != undefined && medicine.duplciate_permission != 0 ? (
                                  <span onClick={() => this.onClickPermission(medicine.duplciate_permission == 1, indexOfPresData, indexOfMedicines, PERMISSION_TYPE.DUPLICATE)} className={medicine.duplciate_permission == 1 ? "usage-permission-allow" : "usage-permission-reject"}
                                        title="[重複] 同一薬剤が登録されています"
                                  >[複] </span>
                                ) : ""}
                                &nbsp;
                              </div>
                              <div className="unit" />
                            </div>
                          </div>
                        </>
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
                                    injectData,
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
                      ))}
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
                  <div className="usage">
                    
                    {order.usageName !== "" && (
                      <>
                        <div
                          className="flex between table-row"
                          onContextMenu={e =>
                            this.handleClick(e, injectData, indexOfPresData, 0, 6)
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
                            onContextMenu={e =>
                              this.handleClick(
                                e,
                                injectData,
                                indexOfPresData,
                                0,
                                9
                              )
                            }
                          >
                            <div className="unit" />
                            <div className="text-right">
                              {`部位/補足: ${order.body_part}`}
                              &nbsp;
                            </div>
                            <div className="unit" />
                          </div>
                        )}
                        <div
                          className="flex between table-row"
                          onContextMenu={e =>
                            this.handleClick(e, injectData, indexOfPresData, 0, 2)
                          }
                        >
                          <div className="btn-area">
                            <Button
                              className="usage-select"
                              onClick={() => this.onClickInjectUssage(indexOfPresData)}
                            >
                              用法選択
                            </Button>
                          </div>
                          <div className="text-right">
                            {!order.injectUsageName ? "" : `用法: ${order.injectUsageName}`}
                          </div>
                          <div className="unit" />
                        </div>
                      </>
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
                            onContextMenu={e =>
                              this.handleClick(
                                e,
                                injectData,
                                indexOfPresData,
                                0,
                                3,
                                index
                              )
                            }
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
                      <div
                        className={'flex between table-row'}
                        onContextMenu={e => this.handleClick(e, injectData, indexOfPresData, 0, 11)}
                      >
                        <div className="unit"></div>
                        <div className="text-right">
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
                        <div className="unit">
                          {order.administrate_period.days != undefined && order.administrate_period.days > 0 ? order.administrate_period.days+"日分":""}
                        </div>
                      </div>
                    )}
                  </div>
                </PresBox>
              </div>
            ))}
            <ContextMenu
              {...this.state.contextMenu}
              parent={this}
              presData={injectData}
            />
            <UssageMenu
              {...this.state.ussageMenu}
              parent={this}
              presData={injectData}
              // karteStatus={this.context.karte_status.code}
              // inOut={this.props.inOut}
              // isForUpdate={this.state.isUpdatePrescription}
            />
            <CommentMenu
              {...this.state.commentMenu}
              parent={this}
              presData={injectData}
            />
            <UssageCommentMenu
              {...this.state.ussageCommentMenu}
              parent={this}
              presData={injectData}
            />
            <AdministrateMenu
              {...this.state.administrateMenu}
              parent={this}
              presData={injectData}
            />
            <BodyPartMenu
              {...this.state.bodyPartMenu}
              parent={this}
              presData={injectData}
            />
            <HoverFirstMenu
              {...this.state.HoverFirstMenu}
              parent={this}
              presData={injectData}
              menu_data={this.state.first_menu_data}
            />
            <HoverSecondMenu
              {...this.state.HoverSecondMenu}
              parent={this}
              presData={injectData}
              menu_data={this.state.second_menu_data}
            />
            {this.state.medShow ? (
              <InjectMedPopup
                isLoaded={this.state.isLoaded}
                medShow={this.state.medShow}
                medClose={this.medClose}
                medicineData={medicineData}
                insertMed={this.insertMed}
                indexOfInsertPres={indexOfInsertPres}
                indexOfInsertMed={indexOfInsertMed}
                presData={injectData}
              />
            ) : (
              ""
            )}
            {this.state.isDoctorsOpen === true ? (
              <SelectDoctorModal
                closeDoctor={this.closeDoctor}
                getDoctor={this.getDoctor}
                selectDoctorFromModal={this.selectDoctorFromModal}
                doctors={this.props.doctors}
              />
            ) : (
              ""
            )}
            {this.state.isMedicineBodyPartOpen ? (
              <MedicineBodyParts
                bodyPartData={LETTER_DATA['letterData']}
                closeMedicineBodyParts={this.closeMedicineBodyParts}
                usageName=""
                body_part={this.body_part}
                medicinebodyPartConfirm={this.medicinebodyPartConfirm}
              />
            ) : (
              ""
            )}
          </Wrapper>
        </>
      );
    }
  }
}
InjectionTable.contextType = Context;

InjectionTable.propTypes = {
  injectData: PropTypes.array,
  isLoaded: PropTypes.bool,  
  handleCommentChange: PropTypes.func,
  handleFocusoutComment: PropTypes.func,
  handleUssageCommentChange: PropTypes.func,
  handleUssageCommentBlur: PropTypes.func,
  changeAmountOrDays: PropTypes.func,
  saveComment: PropTypes.func,
  saveUssageComment: PropTypes.func,
  patientInfo: PropTypes.object,
  patientId: PropTypes.number,
  insertMed: PropTypes.func,
  onSelectUsage: PropTypes.func,
  onSelectInjectUsage: PropTypes.func,
  isForUpdate: PropTypes.bool,
  doctors: PropTypes.array,
  setDoctorInfo: PropTypes.func,
  doctor_code: PropTypes.number,
  doctor_name: PropTypes.string,
  unusedDrugSearch: PropTypes.bool,
  profesSearch: PropTypes.bool,
  normalNameSearch: PropTypes.bool,
  resetPresData: PropTypes.func,
  bodyPartData: PropTypes.array,
  storeDataInCache: PropTypes.func,
  checkPermissionByType: PropTypes.func,
  selectDoctorFromModal: PropTypes.func,
  usageInjectData: PropTypes.array,
  openBodyParts: PropTypes.func,
  openAdministratePeriodInputModal: PropTypes.func,
  cacheSerialNumber: PropTypes.number,
  stopLoadingFlag: PropTypes.number,
};

export default InjectionTable;
