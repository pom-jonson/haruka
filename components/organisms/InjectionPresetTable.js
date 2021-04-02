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
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import $ from "jquery";
import InjectMedPopup from "./InjectMedPopup";
import SelectDoctorModal from "../templates/Patient/components/SelectDoctorModal";
import MedicineBodyParts from "../molecules/MedicineBodyParts";
import { LETTER_DATA } from "~/helpers/constants";

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
    }
  }
  .rp-number {
    margin-right: 4px;
    width: 75px;
  }
  .medicine {
    width: calc(100% - 163px);
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
  .blue-text {
    color: blue;
  }
`;

const Icon = styled(FontAwesomeIcon)`
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  margin-right: 4px;
`;

const UssageMenu = ({ visible, x, y, parent, presData }) => {
  const order = presData[parent.state.indexOfPres];
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div
              onClick={() =>
                parent.contextMenuAction("ussage_comment", presData)
              }
            >
              追加用法コメント
            </div>
          </li>
          {(order.body_part === undefined || order.body_part === "") && (
            <li>
              <div
                onClick={() => parent.contextMenuAction("body_part", presData)}
              >
                部位指定コメント
              </div>
            </li>
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
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
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
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
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

const ContextMenu = ({ visible, x, y, parent, presData }) => {
  const drugCount =
    presData[parent.state.indexOfPres] !== undefined
      ? presData[parent.state.indexOfPres].medicines.length
      : 0;
  // const medicine =
  //   presData[parent.state.indexOfPres] !== undefined
  //     ? presData[parent.state.indexOfPres].medicines[parent.state.indexOfMed]
  //     : undefined;

  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div onClick={() => parent.contextMenuAction("newdrug", presData)}>
              <Icon icon={faPlusSquare} />
              薬品の登録
            </div>
          </li>
          <li>
            <div
              onClick={() => parent.contextMenuAction("drugchange", presData)}
            >
              <Icon icon={faPenSquare} />
              薬品と数量の変更
            </div>
          </li>
          <li>
            <div
              onClick={() =>
                parent.contextMenuAction("drug_amount_change", presData)
              }
            >
              <Icon icon={faPenSquare} />
              数量の変更
            </div>
          </li>
          {drugCount != 1 && (
            <li>
              <div
                onClick={() => parent.contextMenuAction("drugdel", presData)}
              >
                <Icon icon={faTimesSquare} />
                薬品の削除
              </div>
            </li>
          )}
          <li>
            <div
              onClick={() => parent.contextMenuAction("paragraphdel", presData)}
            >
              <Icon icon={faTrash} />
              区切りの削除
            </div>
          </li>
          <li>
            <div onClick={() => parent.contextMenuAction("comment", presData)}>
              <Icon icon={faCommentPlus} />
              コメント追加
            </div>
          </li>          
          {parent.state.canViewDetail && (
            <li>
              <div onClick={() => parent.contextMenuAction("viewDetail", presData)}>
                <Icon icon={faBookMedical} />
                 詳細情報の閲覧
              </div>
            </li>
          )}          
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class InjectionPresetTable extends Component {
  constructor(props) {
    super(props);
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.state = {
      medShow: false,
      isLoaded: false,
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
    };
  }  

  UNSAFE_componentWillReceiveProps() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.setState({
      medShow: false,
      isLoaded: false,
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
    });
  }

  onClickUssage = indexOfPresData => {
    const realIndex =
      indexOfPresData + 1 == this.props.injectData.length ? -1 : indexOfPresData;
    this.props.onSelectUsage(realIndex);
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
    this.setState({
      isDoctorsOpen: false,
      canEdit: this.state.staff_category === 1
    });
  };

  handleClick(
    e,
    presData,
    indexOfPresData,
    indexOfMedicines,
    menu_type,
    comment_edit_index = -1
  ) {     
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
          this.setState({
            commentMenu: {
              visible: true,
              x: e.clientX,
              y: e.clientY + window.pageYOffset
            },
            medicine_comment_eedit_index: index,
            contextMenu: { visible: false },
            ussageMenu: { visible: false },
            bodyPartMenu: { visible: false },
            ussageCommentMenu: { visible: false }
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
          this.setState({
            contextMenu: {
              visible: true,
              x: e.clientX,
              y: e.clientY + window.pageYOffset
            },
            medicine_comment_eedit_index: index,
            commentMenu: { visible: false },
            ussageMenu: { visible: false },
            bodyPartMenu: { visible: false },
            ussageCommentMenu: { visible: false }
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
          this.setState({
            ussageMenu: {
              visible: true,
              x: e.clientX,
              y: e.clientY + window.pageYOffset
            },
            comment_edit_index: index,
            insurance_type_edit_index: indexOfPresData,
            start_date_edit_index: indexOfPresData,
            commentMenu: { visible: false },
            contextMenu: { visible: false },
            bodyPartMenu: { visible: false },
            ussageCommentMenu: { visible: false }
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
          this.setState({
            bodyPartMenu: {
              visible: true,
              x: e.clientX,
              y: e.clientY + window.pageYOffset
            },
            insurance_type_edit_index: index,
            contextMenu: { visible: false },
            ussageMenu: { visible: false },
            commentMenu: { visible: false },
            ussageCommentMenu: { visible: false }
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
          this.setState({
            ussageCommentMenu: {
              visible: true,
              x: e.clientX,
              y: e.clientY + window.pageYOffset
            },
            comment_edit_index: index,
            commentMenu: { visible: false },
            contextMenu: { visible: false },
            bodyPartMenu: { visible: false },
            ussageMenu: { visible: false }
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

  contextMenuAction = (act, presData) => {
    // const tempMedicine =
    //   presData[this.state.indexOfPres].medicines[this.state.indexOfMed];
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
    } else if (act === "ussage_comment") {
      this.setState({
        usage_remarks_comment_index: this.state.indexOfPres,
        usage_remarks_comment: ""
      });    
    } else if (act === "comment") {
      this.setState({
        comment: {
          indexOfPres: this.state.indexOfPres,
          indexOfMed: this.state.indexOfMed
        },
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
      });
    } else if (act === "comment_remove") {
      var free_comment =
        presData[this.state.indexOfPres].medicines[this.state.indexOfMed]
          .free_comment;
      const remove_comment =
        free_comment[this.state.medicine_comment_eedit_index];
      presData[this.state.indexOfPres].medicines[
        this.state.indexOfMed
      ].free_comment = free_comment.filter(item => item != remove_comment);
      this.props.storeDataInCache();
    } else if (act === "ussage_comment_edit") {
      const usage_remarks_comment =
        presData[this.state.indexOfPres].usage_remarks_comment;
      this.setState({
        usage_remarks_comment_index: this.state.indexOfPres,
        usage_remarks_comment:
          usage_remarks_comment[this.state.comment_edit_index]
      });
    } else if (act === "ussage_comment_remove") {
      var comment_list = presData[this.state.indexOfPres].usage_remarks_comment;
      const remove_comment = comment_list[this.state.comment_edit_index];
      presData[
        this.state.indexOfPres
      ].usage_remarks_comment = comment_list.filter(
        item => item != remove_comment
      );
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
      const order_number = presData[this.state.indexOfPres].order_number
      if (presData.length > 2) {
        presData.splice(this.state.indexOfPres, 1);
        this.props.resetPresData(order_number, presData);
      } else {
        this.props.resetPresData(order_number);
      }
      for (var key in window.localStorage) {
        if (key.includes("inject_keyword_" + this.state.indexOfPres)) {
          window.localStorage.removeItem(key);
        }
      }
      this.props.storeDataInCache();
    }
    if (act === "drug_amount_change") {
      this.props.changeAmountOrDays(
        true,
        this.state.indexOfPres,
        this.state.indexOfMed
      );
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
        // diagnosis_division: this.state.diagnosis_division,
        // is_internal_prescription: this.state.inOut,
        // drug_division: this.state.drug_division,
        enable_no_number_item: 0
      };
      if (this.props.unusedDrugSearch == 1) {
        postData.enable_no_number_item = 1;
      }
      if (this.props.profesSearch == 1) {
        postData.keyword_matching_mode = "all";
      }
      if (this.props.normalNameSearch == 1) {
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
    this.props.insertMed(medicine, indexOfInsertPres, indexOfInsertMed);
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
    this.props.selectDoctorFromModal(id, name);
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
      this.props.storeDataInCache();

      this.setState({
        comment: {
          indexOfPres: -1,
          indexOfMed: -1
        },
        free_comment: "",
        medicine_comment_eedit_index: -1
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
      this.props.storeDataInCache();

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
    const { injectData } = this.props;  
    return (
      <>
        <Wrapper
          className="droppable"
        >
          {injectData.map((order, indexOfPresData) => (
            <div className="prescribe-table" key={indexOfPresData}>
              <PresBox className="prescribe-box">
                {order.medicines.map((medicine, indexOfMedicines) => (
                  <div className="box" key={indexOfMedicines}>
                    <div className="drug-item table-row">
                          {indexOfMedicines == 0 && (
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
                          {!order.usageName ? "" : `手技: ${order.usageName}`}
                        </div>   
                        {parseInt(order.days) <= 0 ? (
                          <div className="unit" />
                        ) : (
                          <div className="unit">
                            {order.days}
                            {order.days_suffix !== undefined &&
                            order.days_suffix !== ""
                              ? order.days_suffix
                              : order.days === 0 || order.days === undefined ? "" : "日分"}
                          </div>
                        )}                     
                            <div className="btn-area unit">
                              <Button
                                className="usage-select"
                                onClick={() => this.onClickUssage(indexOfPresData)}
                              >
                                手技選択
                              </Button>
                      </div> 
                          </div> 
                          {order.usageName !== "" && (
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
                        ) }
                        <div className="unit" />
                            </div>
                          )}                                                                 
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
                      {order.usage_remarks_comment.map((coment, index) => (
                        <div key={index}>
                          {(comment_edit_index != index ||
                            (comment_edit_index == index &&
                              order.usage_remarks_comment.length > index &&
                              usage_remarks_comment == "")) && (
                            <div
                              className="comment-item table-row"
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
                  )}               
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
                    {medicine.free_comment.map((coment, index) => (
                      <div key={index}>
                        {(medicine_comment_eedit_index != index ||
                          (medicine_comment_eedit_index == index &&
                            medicine_comment_eedit_index <
                              medicine.free_comment.length &&
                            free_comment == "")) && (
                          <div
                            className="comment-item table-row"
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
                        )}
                        {comment.indexOfPres == indexOfPresData &&
                          comment.indexOfMed == indexOfMedicines &&
                          medicine_comment_eedit_index == index && (
                            <div className="comment table-row">
                              <input
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
                    {comment.indexOfPres == indexOfPresData &&
                      comment.indexOfMed == indexOfMedicines &&
                      medicine_comment_eedit_index ==
                        medicine.free_comment.length && (
                        <div className="comment table-row">
                          <input
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
          <BodyPartMenu
            {...this.state.bodyPartMenu}
            parent={this}
            presData={injectData}
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
              body_part=""
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

InjectionPresetTable.contextType = Context;

InjectionPresetTable.propTypes = {
  injectData: PropTypes.array,  
  handleCommentChange: PropTypes.func,
  handleFocusoutComment: PropTypes.func,
  handleUssageCommentChange: PropTypes.func,
  handleUssageCommentBlur: PropTypes.func,
  changeAmountOrDays: PropTypes.func,
  saveComment: PropTypes.func,
  saveUssageComment: PropTypes.func,
  patientInfo: PropTypes.object,
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
  resetPresData: PropTypes.func,
  bodyPartData: PropTypes.array,
  storeDataInCache: PropTypes.func,
  selectDoctorFromModal: PropTypes.func,
  openBodyParts: PropTypes.func,
  letterData: PropTypes.array,
  patientId: PropTypes.number,
};

export default InjectionPresetTable;
