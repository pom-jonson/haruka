/* eslint-disable consistent-this */
import React, { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import styled from "styled-components";
//import DatePicker, { registerLocale } from "react-datepicker";
//import ja from "date-fns/locale/ja";
import $ from "jquery";
import * as colors from "../_nano/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Context from "~/helpers/configureStore";
import {
  faPlusSquare,
  faPenSquare,
  faTimesSquare,
  faTrash,
  faCommentPlus,
  faMortarPestle,
  faCapsules,
  faCheck,
  faBookMedical,
  faSack
} from "@fortawesome/pro-regular-svg-icons";
import PrescribePopup from "./PrescribePopup";
import PrescribeTableBody from "./PrescribeTableBody";
import MedPopup from "./MedPopup";
import Button from "../atoms/Button";
import SelectDoctorModal from "../templates/Preset/components/SelectDoctorModal";
import MedicineBodyParts from "../molecules/MedicineBodyParts";
import { LETTER_DATA, PERMISSION_TYPE } from "~/helpers/constants";

const Wrapper = styled.div`
  background-color: ${colors.onSecondaryLight};
  border: 1px solid ${colors.disable};
  width: 100%;
  margin-bottom: 16px;
  .usage-permission-allow{
    background-color: #ffffcc; 
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
          <li>
            <div
              onClick={() =>
                parent.contextMenuAction("one_dose_package_action", presData)
              }
              className={order.one_dose_package == 1 ? "blue-text" : ""}
            >
              一包化
            </div>
          </li>
          <li>
            <div
              onClick={() =>
                parent.contextMenuAction("mixture_action", presData)
              }
              className={order.mixture == 1 ? "blue-text" : ""}
            >
              混合
            </div>
          </li>
          <li>
            <div
              onClick={() =>
                parent.contextMenuAction(
                  "temporary_medication_action",
                  presData
                )
              }
              className={order.temporary_medication == 1 ? "blue-text" : ""}
            >
              臨時処方
            </div>
          </li>
          <li>
            <div
              onClick={() =>
                parent.contextMenuAction("ussage_day_change", presData)
              }
            >
              日数変更
            </div>
          </li>          
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
  const medicine =
    presData[parent.state.indexOfPres] !== undefined
      ? presData[parent.state.indexOfPres].medicines[parent.state.indexOfMed]
      : undefined;
  const showDiagnosis = (medicine != null && medicine.diagnosis_permission != undefined && medicine.diagnosis_permission != 0);
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
          <li>
            <div
              onClick={() =>
                parent.contextMenuAction("milling_action", presData)
              }
              className={medicine.milling == 1 ? "blue-text" : ""}
            >
              <Icon icon={faMortarPestle} />
              粉砕
            </div>
          </li>
          <li>
            <div
              onClick={() =>
                parent.contextMenuAction("is_not_generic_action", presData)
              }
              className={medicine.is_not_generic == 1 ? "blue-text" : ""}
            >
              <Icon icon={faCheck} />
              後発不可
            </div>
          </li>
          <li>
            <div
              onClick={() =>
                parent.contextMenuAction("can_generic_name_action", presData)
              }
              className={medicine.can_generic_name == 1 ? "blue-text" : ""}
            >
              <Icon icon={faCapsules} />
              一般名処方
            </div>
          </li>
          <li>
            <div
              onClick={() =>
                parent.contextMenuAction(
                  "separate_packaging_action",
                  presData
                )
              }
              className={medicine.separate_packaging == 1 ? "blue-text" : ""}
            >
              <Icon icon={faSack} />
              別包
            </div>
          </li>
          {showDiagnosis && (
          <li>
            <div onClick={() => parent.contextMenuAction("viewDiagnosis", presData)}>
              <Icon icon={faBookMedical} />
               区分跨り許可
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

class PresetTable extends Component {
  constructor(props) {
    super(props);
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.state = {
      isLoaded: false,
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
      currentUserName: authInfo.name,
      canEdit: authInfo.staff_category === 1,
      staff_category: authInfo.staff_category || 2,      
      // isLastDate: false
    };
  }

  UNSAFE_componentWillReceiveProps() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.setState({
      isLoaded: false,
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
      currentUserName: authInfo.name,
      canEdit: authInfo.staff_category === 1,
      staff_category: authInfo.staff_category || 2,      
      // isLastDate: false
    });
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow(medicine, indexNum) {
    this.setState({ show: true, medicine: medicine, indexNum: indexNum });
  }

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
    const tempMedicine =
      presData[this.state.indexOfPres].medicines[this.state.indexOfMed];
    window.sessionStorage.setItem("prescribe-auto-focus", 0);
    if (act === "newdrug") {
      const newData = presData[this.state.indexOfPres].medicines.slice(0); // copy

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
      window.localStorage.removeItem(
        "medicine_keyword_" +
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
        if (key.includes("medicine_keyword_" + this.state.indexOfPres)) {
          window.localStorage.removeItem(key);
        }
      }
      // this.props.storeDataInCache();
    } else if (act === "comment") {
      this.setState({
        comment: {
          indexOfPres: this.state.indexOfPres,
          indexOfMed: this.state.indexOfMed
        },
        free_comment: ""
      });
    } else if (act === "comment_edit") {
      this.setState({
        comment: {
          indexOfPres: this.state.indexOfPres,
          indexOfMed: this.state.indexOfMed
        },
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
    } else if (act === "viewDiagnosis") {   
      this.props.showDiagnosisPermission(this.state.indexOfPres, this.state.indexOfMed);
    }
  };
  medOpen = () => {
    this.setState({ medShow: true });
  };

  medClose = () => {
    this.setState({ medShow: false, canEdit: this.state.staff_category === 1, isLoaded: false });
  };

  confirm = item => {
    this.setState({ show: false, canEdit: this.state.staff_category === 1 });
    this.props.confirm(item);
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
      alert("権限がありません。");
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
    this.setState({
      isDoctorsOpen: false,
      canEdit: this.state.staff_category === 1
    });
  };

  getDoctor = e => {
    this.selectDoctorFromModal(e.target.id, e.target.getAttribute("label"));
  };

  selectDoctorFromModal = (id, name) => {
    this.props.selectDoctorFromModal(id, name);
  };

  /**
   *  1秒間何も入力されなければ検索データを引き出すためのAPIへリクエスト
   */
  search = (word, indexOfPresData, indexOfMedicines) => {
    if (this.state.staff_category != 1 && (this.state.selectedDoctorID == 0 || this.state.selectedDoctorID == undefined)) {
      this.setState({
        isDoctorsOpen: true
      });
      return;
    }
    const { presData } = this.props;
    const medicines = presData[presData.length - 1].medicines;
    if (word.length == 0 && medicines.length > 1) {
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
        .then(res => {
          const searchedMedicine = [];
          res.data.forEach(medicine => {
            searchedMedicine.push({
              code: medicine.code,
              name: medicine.name,
              diagnosis_division: medicine.diagnosis_division,
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
          this.setState({ medicineData: searchedMedicine, medShow: true, isLoaded: true });
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
      e.stopPropagation();
      e.preventDefault();
      const {
        comment,
        free_comment,
        medicine_comment_eedit_index
      } = this.state;

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
      });
    }
  };  

  handleCommentChange = e => {
    this.setState({ free_comment: e.target.value });
  };    

  handleUssageConfirmComment = e => {
    if (e.key === "Enter") {
      e.stopPropagation();
      e.preventDefault();
      const {
        usage_remarks_comment,
        usage_remarks_comment_index,
        comment_edit_index
      } = this.state;

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
      });
    }
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

  handleUssageCommentChange = e => {
    this.setState({ usage_remarks_comment: e.target.value });
  };

  onClickUssage = indexOfPresData => {
    const realIndex =
      indexOfPresData + 1 == this.props.presData.length ? -1 : indexOfPresData;
    this.props.onSelectUsage(realIndex);
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
      medicine_comment_eedit_index
      // isLastDate
    } = this.state;
    const { presData } = this.props;
    return (
      <>
        <Wrapper
          className="droppable"
        >
          {presData.map((order, indexOfPresData) => (
            <div className="prescribe-table" key={indexOfPresData}>
              <PresBox className="prescribe-box">
                {order.medicines.map((medicine, indexOfMedicines) => (
                  <div className="box" key={indexOfMedicines}>
                    <div className="drug-item table-row">
                      <div
                        className="flex"
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
                          openMedicineBodyParts={this.openMedicineBodyParts}
                          patientId={this.props.patientId}
                        />
                      </div>
                    </div>
                    {medicine.amount > 0 && (
                        medicine.alert_permission !== 0 ||
                        medicine.duplciate_permission !== 0 ||
                        medicine.diagnosis_permission !== 0 
                      ) && (
                        <div className="drug-item table-row">
                          <div className="flex">
                            <div className="rp-number" />
                            <div className="medicine full-text"
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
                              {medicine.alert_permission !== undefined && medicine.alert_permission !== 0 ? (
                                <span onClick={() => this.onClickPermission(medicine.alert_permission == -1, indexOfPresData, indexOfMedicines, PERMISSION_TYPE.ALERT)} className={medicine.alert_permission == 1 ? "usage-permission-allow" : "usage-permission-reject"}
                                  title="[併用] 相互作用情報があります"
                                >[併] </span>
                                ) : ""}
                              {medicine.duplciate_permission !== undefined && medicine.duplciate_permission !== 0 ? (
                                <span onClick={() => this.onClickPermission(medicine.duplciate_permission == -1, indexOfPresData, indexOfMedicines, PERMISSION_TYPE.DUPLICATE)} className={medicine.duplciate_permission == 1 ? "usage-permission-allow" : "usage-permission-reject"}
                                  title="[重複] 同一薬剤が登録されています"
                                >[複] </span>
                                ) : ""}
                              {medicine.diagnosis_permission !== undefined && medicine.diagnosis_permission !== 0 ? (
                                <span onClick={() => this.onClickPermission(medicine.diagnosis_permission == -1, indexOfPresData, indexOfMedicines, PERMISSION_TYPE.DIAGNOSIS)} className={medicine.diagnosis_permission == 1 ? "usage-permission-allow" : "usage-permission-reject"}
                                  title="[区分] 用法の区分と一致していません"
                                >[区] </span>
                               ) : ""}
                              &nbsp;
                            </div>
                            <div className="unit" />
                          </div>
                        </div>
                      )}
                    {medicine.amount > 0 &&
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
                    {medicine.amount > 0 &&
                      (medicine.can_generic_name === 1 ||
                        medicine.is_not_generic === 1 ||
                        medicine.milling === 1 ||
                        medicine.separate_packaging === 1) && (
                        <div
                          className="drug-item table-row"
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
                          <div className="flex">
                            <div className="rp-number" />
                            <div className="medicine full-text">
                              {medicine.can_generic_name === 1
                                ? "【一般名処方】 "
                                : ""}
                              {medicine.is_not_generic === 1
                                ? "【後発不可】 "
                                : ""}
                              {medicine.milling === 1 ? "【粉砕】" : ""}
                              {medicine.separate_packaging === 1
                                ? "【別包】 "
                                : ""}
                              &nbsp;
                            </div>
                            <div className="unit" />
                          </div>
                        </div>
                      )}
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
                                autoFocus
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
                            autoFocus
                          />
                        </div>
                      )}
                  </div>
                ))}

                {order.medicines.length > 0 &&
                  order.medicines[0].medicineName != "" && (
                    <div className="usage">
                      <div
                        className="flex between table-row"
                        onContextMenu={e =>
                          this.handleClick(e, presData, indexOfPresData, 0, 2)
                        }
                      >
                        <div className="btn-area">
                          <Button
                            className="usage-select"
                            onClick={() => this.onClickUssage(indexOfPresData)}
                          >
                            用法選択
                          </Button>
                        </div>
                        <div className="text-right">
                          {!order.usageName ? "" : `用法: ${order.usageName}`}
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
                      {order.usageName != "" &&
                        (order.one_dose_package === 1 ||
                          order.temporary_medication === 1 || 
                          order.mixture === 1) && (
                          <div className="flex between table-row" onContextMenu={e =>
                            this.handleClick(e, presData, indexOfPresData, 0, 2)
                          }>
                            <div className="unit" />
                            <div className="text-right">
                              {order.one_dose_package === 1
                                ? `【一包化】 `
                                : ""}
                              {order.temporary_medication === 1
                                ? `【臨時処方】 `
                                : ""}
                              {order.mixture === 1
                                ? `【混合】 `
                                : ""}
                              &nbsp;
                            </div>
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
                                presData,
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
                                  presData,
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
                              autoFocus
                            />
                          </div>
                        )}
                    </div>
                  )}
              </PresBox>
            </div>
          ))}
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
          />
          <UssageCommentMenu
            {...this.state.ussageCommentMenu}
            parent={this}
            presData={presData}
          />
          {this.state.medShow ? (
            <MedPopup
              isLoaded={this.state.isLoaded}
              medShow={this.state.medShow}
              medClose={this.medClose}
              medicineData={medicineData}
              insertMed={this.insertMed}
              indexOfInsertPres={indexOfInsertPres}
              indexOfInsertMed={indexOfInsertMed}
              presData={presData}
            />
          ) : (
            ""
          )}
          {this.state.show ? (
            <PrescribePopup
              patientInfo={this.props.patientInfo}
              indexNum={this.state.indexNum}
              medicine={this.state.medicine}
              show={this.state.show}
              handleClose={this.handleClose.bind(this)}
              confirm={this.confirm}              
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
PresetTable.contextType = Context;

PresetTable.propTypes = {
  presData: PropTypes.array,
  confirm: PropTypes.func,
  handleCommentChange: PropTypes.func,
  handleUssageCommentChange: PropTypes.func,
  changeAmountOrDays: PropTypes.func,
  indexNum: PropTypes.number,
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
  checkOptions: PropTypes.func,
  resetPresData: PropTypes.func,
  bodyPartData: PropTypes.array,
  storeDataInCache: PropTypes.func,
  selectDoctorFromModal: PropTypes.func,
  openBodyParts: PropTypes.func,
  showDiagnosisPermission: PropTypes.func,
  checkPermissionByType: PropTypes.func,
  patientId: PropTypes.number,
};

export default PresetTable;
