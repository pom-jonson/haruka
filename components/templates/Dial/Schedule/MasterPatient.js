import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import Checkbox from "~/components/molecules/Checkbox";
import {
  formatJapan,
  formatJapanYearMonth,
  formatJapanYear,
} from "~/helpers/date";
import { displayLineBreak } from "~/helpers/dialConstants";
import { getTimeZoneList } from "~/components/templates/Dial/DialMethods/getSystemTimeZone";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SchedulePreviewModal from "~/components/templates/Dial/Schedule/modals/SchedulePreviewModal";
import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: calc((98vh - 16rem) - 70px);
  border: solid 1px lightgrey;
  margin-top: 20px;
  margin-bottom: 22px;
  overflow:hidden;
  label {
    text-align: right;
  }
  table {
    font-size: 1rem;
    margin-bottom: 0;
  }
  thead{
    margin-bottom: 0;
    display:table;
    width:100%;
    tr{width: calc(100% - 17px);}
  }
  tbody{
    height: calc(100vh - 25.5rem);
    overflow-y: scroll;
    display:block;
  }
  tr{
    display: table;
    width: 100%;
    box-sizing: border-box;
  }
  td {
      padding: 0.25rem;
      text-align: left;
      vertical-align: middle;
      border-bottom: 1px solid #dee2e6;
  }
  th {
      text-align: center;
      padding: 0.3rem;
      border-bottom: 1px solid #dee2e6;
  }
  .table-check {
    width: 4rem;
    label {margin:0;}
    input {margin:0;}
  }
  .timezone {
    width: 5rem;
  }
  .patient_type {
    width: 7.5rem;
    word-break: break-all;
  }
  .facility-content {
    width: 15rem;
    word-break: break-all;
  }
  .date-area {
    width: 9rem;
  }
  .attach_doc {
    width: 3rem;
    word-break: break-all;
  }
  .content {
    word-break: break-all;
  }
  .name{
    width:12rem;
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
    left: 1240px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 84px;
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
    padding: 0 20px;
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

const attach_doc_check = ["要", "不要", "未定"];

const ContextMenu = ({ visible, x, y, parent, favouriteMenuType }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div onClick={() =>parent.contextMenuAction(favouriteMenuType, "preview")}>プレビュー</div>
          </li>
          <li>
            <div onClick={() =>parent.contextMenuAction(favouriteMenuType, "edit")}>編集</div>
          </li>
          <li>
            <div onClick={() =>parent.contextMenuAction(favouriteMenuType, "delete")}>削除</div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const ContextMenu_d = ({ visible, x, y, parent, favouriteMenuType }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div onClick={() =>parent.contextMenuAction(favouriteMenuType, "recover")}>削除の取り消し</div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class MasterPatient extends Component {
  constructor(props) {
    super(props);
    let time_zone_list = getTimeZoneList();
    this.state = {
      table_data: this.props.table_data,
      time_zone_list,
      preview_index: null,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      table_data: nextProps.table_data,
      });
  }

  handleClick = (e, type) => {
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      that.setState({ contextMenu_d: { visible: false } });
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextMenu: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: { visible: false },
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("code-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false },
          });
          document
            .getElementById("code-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      let cur_page = "";
      let path = window.location.href.split("/");
      path.map(word=>{
        if(word === "system_setting"){
          cur_page = word;
        }
      });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - (cur_page === "" ? 240 : 0),
          y: e.clientY + window.pageYOffset - (cur_page === "" ? 70 : 0),
        },
        favouriteMenuType: type,
      });
    }
  };

  handleClickDeletedRow = (e, type) => {
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      that.setState({ contextMenu: { visible: false } });
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextMenu_d: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu_d: { visible: false },
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("code-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu_d: { visible: false },
          });
          document
            .getElementById("code-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      let cur_page = "";
      let path = window.location.href.split("/");
      path.map(word=>{
        if(word === "system_setting"){
          cur_page = word;
        }
      });
      this.setState({
        contextMenu_d: {
          visible: true,
          x: e.clientX - (cur_page === "" ? 240 : 0),
          y: e.clientY + window.pageYOffset - (cur_page === "" ? 70 : 0),
        },
        favouriteMenuType: type,
      });
    }
  };

  contextMenuAction = (index, type) => {
    if (type === "edit") {
      this.props.editData(index);
      this.setState({
        isopenpreviewModal: false,
      });
    }
    if (type === "delete") {
      this.closeModal(index);
      this.setState({
        isopenpreviewModal: false,
      });
    }
    if (type === "preview") {
      this.setState({
        isopenpreviewModal: true,
        preview_index: index,
        selectedScheduledata: this.props.table_data[index],
      });
    }
    if (type === "recover") {
      this.recoverModal(index);
      this.setState({
        isopenpreviewModal: false,
      });
    }
  };
  closeModal = (index) => {
    this.setState({
      deleteconfirm: true,
      confirm_message: "削除しますか？",
      deleteindex: index,
    });
    return;
  };
  recoverModal = (index) => {
    this.setState({
      recoverconfirm: true,
      confirm_message: "予定の削除を取りやめますか？",
      recoverindex: index,
    });
    return;
  };
  closePreviewModal = () => {
    this.setState({
      isopenpreviewModal: false,
      selectedScheduledata: {},
    });
    return;
  };

  confirmOk() {
    this.props.deleteData(
      this.props.table_data[this.state.deleteindex].schedule_number
    );
    this.confirmCancel();
  }
  recoverconfirmOk() {
    this.props.recoverData(
      this.props.table_data[this.state.recoverindex].schedule_number
    );
    this.recoverconfirmCancel();
  }

  confirmCancel() {
    this.setState({
      deleteconfirm: false,
      confirm_message: "",
      deleteindex: 0,
    });
  }
  recoverconfirmCancel() {
    this.setState({
      recoverconfirm: false,
      confirm_message: "",
      recoverindex: 0,
    });
  }

  getShowDate = (item) => {
    if (item == undefined || item == null) return "";
    if (item.schedule_date != null) {
      return formatJapan(item.schedule_date);
    } else if (item.schedule_month != null) {
      var month;
      if (item.schedule_month < 10)
        month = "0" + item.schedule_month.toString();
      else month = item.schedule_month;
      return formatJapanYearMonth(item.schedule_year + "-" + month);
    } else {
      if (item.schedule_year != null) {
        return formatJapanYear(item.schedule_year.toString());
      }
      return "未定";
    }
  };

  render() {
    let { table_data } = this.props;
    let reserved_patient_codes = this.props.reserved_patient_codes;
    return (
      <Wrapper>
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th className="table-check">完了</th>
              <th className="table-check">添書</th>
              <th className="table-check">受診</th>
              <th className="date-area">日付</th>
              <th className="timezone">時間帯</th>
              <th className="facility-content">施設名・診療科・担当医師</th>
              <th className="patient_type">種類</th>
              <th className="content">内容</th>
              <th className='name'>担当者</th>
              <th className="attach_doc">添書</th>
            </tr>
          </thead>
          <tbody id = 'code-table'>
            {table_data !== undefined &&
              table_data !== null &&
              table_data.length > 0 &&
              table_data.map((item, index) => {
                if (
                  this.getShowDate(item) != "未定" ||
                  this.props.display_all == 1
                ) {
                  return (
                    <>
                      <tr
                        onContextMenu={(e) =>item.is_enabled == 1 ? this.handleClick(e, index) : this.handleClickDeletedRow(e, index)}
                        style={{backgroundColor: item.is_enabled == 1 ? "" : "grey"}}
                      >
                        <td
                          className="text-center table-check"
                          style={{backgroundColor: item.is_enabled != 0 ? "" : "grey"}}
                        >
                          <Checkbox
                            value={item.checked_by_complete}
                            checked={item.checked_by_complete === 1}
                            name="check"
                            isDisabled={true}
                          />
                        </td>
                        <td className="text-center table-check">
                          <Checkbox
                            value={item.checked_by_accompanying}
                            checked={item.checked_by_accompanying === 1}
                            name="check"
                            isDisabled={true}
                          />
                        </td>
                        <td className="text-center table-check">
                          <Checkbox
                            value={item.checked_by_medical_examination}
                            checked={item.checked_by_medical_examination === 1}
                            name="check"
                            isDisabled={true}
                          />
                        </td>
                        <td className="text-left date-area">{this.getShowDate(item)}</td>
                        <td className="text-left timezone">
                          {item.time_zone != null
                            ? this.state.time_zone_list[item.time_zone].value
                            : "未定"}
                        </td>
                        <td className="text-left facility-content">
                          {item.facility}
                        </td>
                        <td className="text-left patient_type">
                          {reserved_patient_codes[item.schedule_type_code]}
                        </td>
                        <td className={"text-left content"}>
                          {displayLineBreak(item.content)}
                        </td>
                        <td className='text-left name'>
                          {this.props.staff_list_by_number != undefined && this.props.staff_list_by_number != null? this.props.staff_list_by_number[item.responsible_staff]:''}
                        </td>
                        <td className="text-left attach_doc">
                          {attach_doc_check[item.require_accompanying_document]}
                        </td>
                      </tr>
                    </>
                  );
                }
              })}
              {table_data == undefined && (
                <>
                  <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                  </SpinnerWrapper>
                  </>
              )}
          </tbody>
        </table>
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
          favouriteMenuType={this.state.favouriteMenuType}
        />
        <ContextMenu_d
          {...this.state.contextMenu_d}
          parent={this}
          favouriteMenuType={this.state.favouriteMenuType}
        />
        {this.state.deleteconfirm && (
          <SystemConfirmJapanModal
            confirmCancel={() => {
              this.setState({
                deleteconfirm: false,
              });
            }}
            confirmOk={() => {
              this.confirmOk();
            }}
            confirmTitle={this.state.confirm_message}
          />
        )}
        {this.state.recoverconfirm && (
          <SystemConfirmJapanModal
            confirmCancel={() => {
              this.setState({
                recoverconfirm: false,
              });
            }}
            confirmOk={() => {
              this.recoverconfirmOk();
            }}
            confirmTitle={this.state.confirm_message}
          />
        )}
        {this.state.isopenpreviewModal && (
          <SchedulePreviewModal
            checked_by_complete={
              this.state.selectedScheduledata.checked_by_complete
            }
            checked_by_accompanying={
              this.state.selectedScheduledata.checked_by_accompanying
            }
            checked_by_medical_examination={
              this.state.selectedScheduledata.checked_by_medical_examination
            }
            schedulenum={this.state.selectedScheduledata.schedule_number}
            scheduledate={this.getShowDate(this.state.selectedScheduledata)}
            scheduletimezone={
              this.state.selectedScheduledata.time_zone != null
                ? this.state.time_zone_list[
                    this.state.selectedScheduledata.time_zone
                  ].value
                : "未定"
            }
            schedulefacility={this.state.selectedScheduledata.facility}
            patientcode={
              reserved_patient_codes[
                this.state.selectedScheduledata.schedule_type_code
              ]
            }
            content={this.state.selectedScheduledata.content}
            note={this.state.selectedScheduledata.note}
            attachdoccheck={
              attach_doc_check[
                this.state.selectedScheduledata.require_accompanying_document
              ]
            }
            closeModal={this.closePreviewModal}
            // delete={this.contextMenuAction(this.state.selectedScheduledata.schedule_number,"delete")}
            delete={() => {
              this.contextMenuAction(this.state.preview_index, "delete");
            }}
            editModal={() => {
              this.contextMenuAction(this.state.preview_index, "edit");
            }}
            // editModal={this.contextMenuAction(this.state.selectedScheduledata.schedule_number,"edit")}
          />
        )}
      </Wrapper>
    );
  }
}
MasterPatient.contextType = Context;

MasterPatient.propTypes = {
  table_data: PropTypes.array,
  reserved_patient_codes: PropTypes.array,
  editData: PropTypes.func,
  deleteData: PropTypes.func,
  recoverData: PropTypes.func,
  patient_name: PropTypes.string,
  display_all: PropTypes.bool,
  staff_list_by_number: PropTypes.object,
};
export default MasterPatient;
