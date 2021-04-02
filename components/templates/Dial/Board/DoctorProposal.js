import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";

import Checkbox from "~/components/molecules/Checkbox";
// import * as colors from "~/components/_nano/colors";
import Button from "~/components/atoms/Button";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import { formatDateLine } from "~/helpers/date";
import axios from "axios/index";
import * as methods from "~/components/templates/Dial/DialMethods";

registerLocale("ja", ja);
import InputPanel from "~/components/templates/Dial/Board/molecules/InputPanel";
import * as apiClient from "~/api/apiClient";
import { CACHE_SESSIONNAMES, getServerTime} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import { displayLineBreak, stripHtml} from "~/helpers/dialConstants";
import DialShowShemaModal from "~/components/templates/Patient/Modals/Common/DialShowShemaModal";
import { secondary600 } from "~/components/_nano/colors";
// import renderHTML from 'react-render-html';

const Wrapper = styled.div`
  border: none;
  .text-left {
    text-align: left;
  }
  .text-right {
    text-align: right;
  }
  .text-center {
    text-align: center;
  }
  .search_part {
    display: flex;
    .switch {
      position: absolute;
      right: 25px;
      label {
        font-size: 1rem;
      }
    }
  }
  .schema-div {
    display: block;
    width: 100%;
    .schema-content {
      width: 100%;
      float: left;
    }
    .no-schema {
        width: 100%;
        text-align: left;
    }
    .schema-button {
      float: right;
    }
  }
  .label-title {
    width: 100px;
    font-size: 1rem;
    text-align: right;
    margin-right: 10px;
  }
  .pullbox-select {
    width: 200px;
    font-size: 1rem;
  }
  .select_date_range {
    display: flex;
    .pullbox {
      margin-right: 20px;
    }
    span {
      padding-top: 9px;
    }
    label {
      margin-left: 25px;
      font-size: 1rem;
    }
  }
  .example-custom-input {
    font-size: 1rem;
    width: 180px;
    text-align: center;
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 5px;
    padding-bottom: 5px;
    border: 1px solid;
    margin-left: 5px;
    margin-right: 5px;
  }
  .example-custom-input.disabled {
    background: lightgray;
  }
  .content {
    overflow: hidden;
    border: 1px solid lightgrey;
  }
  table {
    margin: 0;
    thead {
      display: table;
      width: calc(100% - 17px);
    }
    tbody {
      height: calc(100vh - 25rem);
      overflow-y: scroll;
      display: block;
    }
    tr {
      display: table;
      width: 100%;
      box-sizing: border-box;
    }
  }
  th {
    font-size: 1rem;
    font-weight: normal;
    text-align: center;
    padding: 0 0.3rem !important;
  }
  td {
    font-size: 1rem;
    vertical-align: middle;
    word-break: break-all;
    padding: 0 0.3rem !important;
    label {
      margin: 0;
    }
  }
  .table-check {
    width: 3rem;
    text-align:center;
  }
  .date-area {
    width: 7rem;
  }
  .patient_no {
    width: 45px;
  }
  .patient_type {
    width: 90px;
  }
  .attach_doc {
    width: 60px;
  }
  .manager_name {
    width: 80px;
  }
  .patient_name {
    width: 20rem;
  }
  .footer {
    button {
      padding-left: 40px;
      padding-right: 40px;
    }
    button span {
      font-size: 1.25rem;
    }
    button:hover {
      background-color: ${secondary600};
    }
    .red-btn {
      background: #cc0000 !important;
      border:2px solid #cc0000;
      span {
        color: #ffffff;
      }
    }
    .red-btn:hover {
      background: #e81123 !important;
      span {
        color: #ffffff;
      }
    }
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

const ContextMenu = ({ visible, x, y, parent, item }) => {
  let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li onClick={() => parent.contextMenuAction(item, "edit")}>
            <div>編集</div>
          </li>
          <li onClick={() => parent.contextMenuAction(item, "delete")}>
            <div>削除</div>
          </li>
          {item.completed_by == null && authInfo.doctor_number > 0 && (
            <li onClick={() => parent.contextMenuAction(item, "setComplete")}>
              <div>確認済みにする</div>
            </li>
          )}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class DoctorProposal extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD, "patient");
    let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
    // let code_master = sessApi.getObjectValue("dial_common_master","code_master");
    // let oneMonthAgo = new Date();
    // oneMonthAgo.setDate(oneMonthAgo.getDate()-30);
    this.state = {
      start_date: schedule_date != undefined ? schedule_date : new Date(),
      end_date: schedule_date != undefined ? schedule_date : new Date(),
      schedule_date,
      system_patient_id:patientInfo != undefined && patientInfo != null ? patientInfo.system_patient_id : 0,
      patient_number:patientInfo != undefined && patientInfo != null ? patientInfo.patient_number : 0,
      patient_name:patientInfo != undefined && patientInfo != null ? patientInfo.patient_name : "",
      isOpenModal: false,
      isDeleteConfirmModal: false,
      isSetCompleteConfirmModal: false,
      modal_data: {},
      table_data: this.props.dr_proposal_list,
      display_all: 1,
      all_period: 1,
      isOpenShemaModal: false,
    };
  }

  async componentDidMount() {
    let server_time = await getServerTime();
    let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
    this.setState({ 
      table_data: this.props.dr_proposal_list,
      start_date: schedule_date != undefined ? schedule_date : new Date(server_time),
      end_date: schedule_date != undefined ? schedule_date : new Date(server_time),
    });
    this.getList();
  }

  componentWillUnmount() {    

    var html_obj = document.getElementsByClassName("doctor_proposal_wrapper")[0];
    if(html_obj !== undefined && html_obj != null){
        html_obj.innerHTML = "";
    }
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.patientInfo != undefined && nextProps.patientInfo != null && nextProps.patientInfo.system_patient_id > 0) {
      this.setState({table_data: nextProps.dr_proposal_list});
    } else {
      this.setState({ table_data: [] });
    }
    if (nextProps.patientInfo.system_patient_id == this.state.system_patient_id && nextProps.schedule_date == this.state.schedule_date) return;
    let server_time = await getServerTime();
    this.setState({
      system_patient_id: nextProps.patientInfo.system_patient_id,
      patient_number: nextProps.patientInfo.patient_number,
      patient_name: nextProps.patientInfo.patient_name,
      schedule_date: nextProps.schedule_date,
      start_date:nextProps.schedule_date != undefined ? nextProps.schedule_date : new Date(server_time),
      end_date:nextProps.schedule_date != undefined ? nextProps.schedule_date : new Date(server_time),
    },() => {
      this.props.getDrProposalStatus(this.state.system_patient_id, this.state.schedule_date);
    });
  }
  
  getList = async () => {
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if (patientInfo == undefined || patientInfo.system_patient_id == undefined) {
      this.setState({ table_data: [] });
      return;
    }
    let path = "/app/api/v2/dial/board/getDrProposalSendingData";
    let post_data = {
      patient_id: this.state.system_patient_id,
      start_date: formatDateLine(this.state.start_date),
      end_date: formatDateLine(this.state.end_date),
      category: "Dr上申",
    };
    let { data } = await axios.post(path, { params: post_data });
    this.setState({
      table_data: data == undefined ? [] : data,
    });
  };

  // モーダル
  openModal = () => {
    if (
      this.state.system_patient_id == undefined ||
      this.state.system_patient_id == 0
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "表示患者様を選択してください。"
      );
      return;
    } else {
      this.setState({
        modal_data: null,
        isOpenModal: true,
      });
    }
  };
  closeModal = () => {
    this.setState({ isOpenModal: false });
    this.props.getDrProposalStatus(
      this.state.system_patient_id,
      this.state.schedule_date
    );
  };
  handleOk = () => {
    this.closeModal();
    this.props.getDrProposalStatus(
      this.state.system_patient_id,
      this.state.schedule_date
    );
  };

  confirmCancel() {
    this.setState({
      isDeleteConfirmModal: false,
      isSetCompleteConfirmModal: false,
      confirm_message: "",
    });
  }

  checkAllPeriod = (name, value) => {
    if (name == "period_all") {
      this.setState({ all_period: value }, () => {
        this.getList();
      });
    }
  };

  getStartDate = (value) => {
    this.setState({ start_date: value }, () => {
      this.getList();
    });
  };
  getEndDate = (value) => {
    this.setState({ end_date: value }, () => {
      this.getList();
    });
  };

  handleClick = (e, item) => {
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
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
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX,
          y: e.clientY + window.pageYOffset,
        },
        item: item,
      });
    }
  };

  contextMenuAction = (item, type) => {
    if (type === "edit") {
      this.updateData(item);
    }
    if (type === "delete") {
      this.setState(
        {
          selected_number: item.number,
          item: item,
        },
        () => {
          this.delete();
        }
      );
    }
    if (type === "setComplete") {
      this.setState(
        {
          selected_number: item.number,
          item: item,
        },
        () => {
          this.setComplete();
        }
      );
    }
  };

  setComplete = () => {
    let item = this.state.item;
    if (item != null) {
      this.setState({
        isSetCompleteConfirmModal: true,
        confirm_message: "この項目を確認済みにして良いですか？",
      });
    }
  };

  changeToComplete = async () => {
    let path = "/app/api/v2/dial/board/setCompletedData";
    let post_data = {
      params: {
        number: this.state.selected_number,
      },
    };
    await apiClient
      .post(path, post_data)
      .then((res) => {
        if (res) {
          window.sessionStorage.setItem("alert_messages", "変更完了##" + res.alert_message);
          this.confirmCancel();
          this.props.getDrProposalStatus(
            this.state.system_patient_id,
            formatDateLine(this.state.schedule_date)
          );
        }
      })
      .catch(() => {
        return false;
      });
  };

  updateData = (item) => {
    this.setState({
      system_patient_id: item.system_patient_number,
      modal_data: item,
      isOpenModal: true,
    });
  };

  delete = () => {
    let item = this.state.item;
    if (item != null) {
      this.setState({
        isDeleteConfirmModal: true,
        confirm_message: "この項目を削除して良いですか？",
      });
    }
  };

  // データ
  deleteData = async () => {
    let path = "/app/api/v2/dial/board/deleteSendingData";
    let post_data = {
      params: {
        number: this.state.selected_number,
        system_patient_id: this.state.system_patient_id,
      },
    };
    await apiClient
      .post(path, post_data)
      .then((res) => {
        if (res) {
          window.sessionStorage.setItem("alert_messages", "削除完了##" + "削除しました。");
          this.confirmCancel();
          this.props.getDrProposalStatus(
            this.state.system_patient_id,
            this.state.schedule_date
          );
          // this.getList();
        }
      })
      .catch(() => {
        return false;
      });
  };

  goPrintInstruction = () => {
    var schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    sessApi.setObjectValue("from_bedside", "schedule_date", schedule_date);
    sessApi.setObjectValue("from_bedside", "patient", patientInfo);
    this.props.history.replace("/print/DrProposal");
  };

  openShema = (item) => {
    this.setState({
      isOpenShemaModal: true,
      imgBase64: item.imgBase64,
      image_comment: item.image_comment,
      title: item.title,
    });
  };

  closeShemaModal = () => {
    this.setState({
      isOpenShemaModal: false,
    });
  };

  render() {    
    let table_data = this.state.table_data;
    return (
      <Wrapper className="doctor_proposal_wrapper">
        <div className="search_part">
          <div className="select_date_range">            
            <button
              style={{ fontSize: "15px" }}
              onClick={this.goPrintInstruction.bind(this)}
            >
              全患者のDr上申一覧
            </button>
          </div>
        </div>
        <div className="content">
          <table
            className="table-scroll table table-bordered"
            id={"code-table"}
          >
            <thead>
              <th className="table-check">完了</th>
              <th className="date-area">記入日時</th>
              <th className="patient_name">記入者</th>
              <th>内容</th>
              <th className="date-area">確認日時</th>
              <th className="patient_name">確認医師</th>              
            </thead>
            <tbody>
              {table_data !== undefined &&
                table_data !== null &&
                table_data.length > 0 &&
                table_data.map((item) => {
                  return (
                    <>
                      <tr onContextMenu={(e) => this.handleClick(e, item)}>
                        <td className="table-check">
                          <Checkbox
                            value={item.completed_by > 0}
                            checked={item.completed_by > 0}
                            name="check"
                            isDisabled={true}
                          />
                        </td>
                        <td className="date-area">
                          {item.updated_at != null ? item.updated_at.split(" ")[0] : ""}
                        </td>
                        <td className="patient_name">
                          {item.updater_name}
                        </td>
                        <td>
                          <div className="schema-div">
                            <div
                              className={item.image_path != null &&
                                        item.image_path != "" &&
                                        item.imgBase64 != "" ? "schema-content" :"no-schema"}
                              style={{ wordBreak: "break-all" }}
                            >
                              {displayLineBreak(stripHtml(item.message))}
                            </div>
                            {item.image_path != null &&
                              item.image_path != "" &&
                              item.imgBase64 != "" && (
                                <div>
                                  <Button onClick={() => this.openShema(item)}>
                                    シェーマを見る
                                  </Button>
                                </div>
                              )}
                          </div>
                        </td>
                        <td className="date-area">
                          {item.completed_at != null ? item.completed_at.split(" ")[0] : ""}
                        </td>
                        <td className="patient_name">
                          {item.complete_name}
                        </td>                        
                      </tr>
                    </>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="footer-buttons footer">
          <span className="right-btn">
            <Button className="red-btn" onClick={this.openModal}>Dr上申追加</Button>
          </span>
        </div>
        {((this.state.isOpenModal && this.state.system_patient_id) ||
          (this.state.isOpenModal && this.state.modal_data != null)) && (
          <InputPanel
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            kind="Dr上申"
            patient_id={this.state.system_patient_id}
            schedule_date={this.state.schedule_date}
            item={this.state.modal_data}
          />
        )}
        {this.state.isDeleteConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.deleteData.bind(this)}
            confirmTitle={this.state.confirm_message}
          />
        )}
        {this.state.isSetCompleteConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.changeToComplete.bind(this)}
            confirmTitle={this.state.confirm_message}
          />
        )}
        {this.state.isOpenShemaModal === true && (
          <DialShowShemaModal
            closeModal={this.closeShemaModal}
            imgBase64={this.state.imgBase64}
            image_comment={this.state.image_comment}
            title={this.state.title}
          />
        )}
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
          index={this.state.index}
          item={this.state.item}
        />
      </Wrapper>
    );
  }
}

DoctorProposal.contextType = Context;

DoctorProposal.propTypes = {
  patientInfo: PropTypes.object,
  schedule_date: PropTypes.string,
  history: PropTypes.object,
  dr_proposal_list: PropTypes.array,
  getDrProposalStatus: PropTypes.func,
};

export default DoctorProposal;
