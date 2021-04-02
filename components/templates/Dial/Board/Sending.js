import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Checkbox from "~/components/molecules/Checkbox";
import Button from "~/components/atoms/Button";
import { Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import * as apiClient from "~/api/apiClient";
import { displayLineBreak, stripHtml } from "~/helpers/dialConstants";
import * as methods from "~/components/templates/Dial/DialMethods";
import { formatDateLine } from "~/helpers/date";
import { Dial_tab_index } from "~/helpers/dialConstants";
import InputPanel from "~/components/templates/Dial/Board/molecules/InputPanel";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import { CACHE_SESSIONNAMES, getServerTime } from "~/helpers/constants";
import DialShowShemaModal from "~/components/templates/Patient/Modals/Common/DialShowShemaModal";
import { secondary600 } from "~/components/_nano/colors";

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 15px;
  margin-right: 5px;
`;
const Wrapper = styled.div`
  border: 1px solid lightgrey;
  .text-left {
    text-align: left;
  }
  .text-right {
    text-align: right;
  }
  .text-center {
    text-align: center;
  }
  .half {
    width: 50%;
    overflow: hidden;
  }
  .content {
    display: flex;
  }
  .title_area {
    margin-bottom: 1rem;
    display: flex;
    font-size: ;
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
    }
    .schema-button {
      float: right;
    }
  }
  .add_area {
    position: absolute;
    right: 1rem;
    font-size: 1rem;
    padding-top: 11px;
    cursor: pointer;
  }
  .title {
    font-size: 1.25rem;
  }
  .send_content {
    font-size: 1rem;
  }
  .label-title {
    width: 100px;
    font-size: 20px;
    text-align: right;
    margin-right: 10px;
  }
  .pullbox-select {
    width: 200px;
    font-size: 16px;
  }
  .select_date_range {
    display: flex;
    .pullbox {
      margin-right: 20px;
    }
    span {
      padding-top: 9px;
    }
  }
  .example-custom-input {
    font-size: 16px;
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
  .content {
    padding-top: 0px;
    height: calc(100vh - 17rem);
  }
  .continue-table-area {
    width: 100%;
  }
  .before-table-area,
  .next-table-area {
    width: 100%;
    .table{
      margin-bottom:0;
    }
  }
  th {
    font-size: 1rem;
    text-align: center;
    padding: 1px;
    border: 1px solid #dee2e6;
    background:lightgray;
    font-weight:normal;
    height:2rem;
  }
  .width-8 {
    width: 8%;
  }
  .width-6 {
    width: 6%;
  }
  .width-20 {
    width: 20%;
  }
  .width-10 {
    width: 10%;
  }
  td {
    font-size: 13px;
    vertical-align: middle;
    padding: 2px !important;
    label {
      margin: 0;
    }
  }
  tr {
    display: table;
    width: 100%;
    box-sizing: border-box;
  }
  .continue-table-area {
    thead {
      display: table;
      width: 100%;
    }
    tbody {
      height: calc(100vh - 23rem + 2.5px);
      overflow-y: auto;
      display: block;
    }
  }

  .before-table-area {
    thead {
      display: table;
      width: 100%;
    }
    tbody {
      height: calc(50vh - 14rem);
      overflow-y: auto;
      display: block;
    }
  }

  .next-table-area {
    thead {
      display: table;
      width: 100%;
    }
    tbody {
      height: calc(50vh - 14rem);
      overflow-y: auto;
      display: block;
    }
  }

  .footer {
    button {
      padding-left: 40px;
      padding-right: 40px;
    }
    button span {
      font-size: 1.25rem;
      font-weight: bold;
    }
    button:hover {
      background-color: ${secondary600};
    }
    padding-bottom:10px;
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
    font-size: 16px;
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

const ContextMenu = ({
  visible,
  x,
  y,
  parent,
  favouriteMenuType,
  index,
  complete,
}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {favouriteMenuType === "continue" && (
            <>
              <li>
                <div
                  onClick={() =>
                    parent.contextMenuAction(favouriteMenuType, index, "edit")
                  }
                >
                  編集
                </div>
              </li>
              <li>
                <div
                  onClick={() =>
                    parent.contextMenuAction(favouriteMenuType, index, "delete")
                  }
                >
                  削除
                </div>
              </li>
              {complete == null && (
                <>
                  <li>
                    <div
                      onClick={() =>
                        parent.contextMenuAction(
                          favouriteMenuType,
                          index,
                          "complete"
                        )
                      }
                    >
                      この申し送りを完了（次回から非表示）
                    </div>
                  </li>
                </>
              )}
            </>
          )}
          {favouriteMenuType === "before" && (
            <>
              {complete == null && (
                <>
                  <li>
                    <div
                      onClick={() =>
                        parent.contextMenuAction(
                          favouriteMenuType,
                          index,
                          "complete"
                        )
                      }
                    >
                      この申し送りを確認
                    </div>
                  </li>
                </>
              )}
              {/* <li>
                                <div onClick={() => parent.contextMenuAction(favouriteMenuType, index, "delete")}>削除</div>
                            </li> */}
            </>
          )}
          {favouriteMenuType === "next" && (
            <>
              <li>
                <div
                  onClick={() =>
                    parent.contextMenuAction(favouriteMenuType, index, "edit")
                  }
                >
                  編集
                </div>
              </li>
              <li>
                <div
                  onClick={() =>
                    parent.contextMenuAction(favouriteMenuType, index, "delete")
                  }
                >
                  削除
                </div>
              </li>
            </>
          )}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class Sending extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    this.state = {
      done_flag: 0,
      see_doctor_flag: 0,
      showContinueSendingModal: false,
      showNextSendingModal: false,
      sending_continue_list: [],
      edit_modal_data: {},
      sending_before_list: [],
      sending_next_list: [],
      patientId:
        this.props.patientInfo !== undefined && this.props.patientInfo !== null
          ? this.props.patientInfo.system_patient_id
          : "",
      schedule_date: this.props.schedule_date !== undefined && this.props.schedule_date !== null? formatDateLine(this.props.schedule_date) : formatDateLine(new Date()),
      isDeleteConfirmModal: false,
      confirm_message: "",
      timezone: this.props.timezone,
      isOpenShemaModal: false,
    };
  }

  componentWillUnmount() {
    
    var html_obj = document.getElementsByClassName("sending_wrapper")[0];
    if(html_obj !== undefined && html_obj != null){
        html_obj.innerHTML = "";
    }    
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.patientInfo != null && nextProps.patientInfo != undefined) {
      if (
        this.props.patientInfo == null ||
        this.props.patientInfo == undefined
      ) {
        this.setState(
          {
            ...this.state,
            patientId: nextProps.patientInfo.system_patient_id,
            schedule_date: formatDateLine(nextProps.schedule_date),
          },
          () => {
            this.getConstInfo();
          }
        );
      } else if (
        nextProps.patientInfo !== this.props.patientInfo ||
        nextProps.schedule_date !== this.props.schedule_date
      ) {
        this.setState(
          {
            ...this.state,
            patientId: nextProps.patientInfo.system_patient_id,
            schedule_date: formatDateLine(nextProps.schedule_date),
            sending_continue_list: [],
            sending_before_list: [],
            sending_next_list: [],
          },
          () => {
            this.getConstInfo();
          }
        );
      }

      if (this.state.timezone != nextProps.timezone) {
        this.setState(
          {
            timezone: nextProps.timezone,
          },
          () => {
            this.getConstInfo();
          }
        );
      }
    }

    return null;
  }

  async componentDidMount() {
    await this.getStaffs();
    let server_time = await getServerTime();
    this.setState({
      schedule_date: this.props.schedule_date !== undefined && this.props.schedule_date !== null? formatDateLine(this.props.schedule_date) : formatDateLine(new Date(server_time)),
    })    
    if (
      this.props.patientInfo.id != undefined &&
      this.props.schedule_date != undefined
    ) {
      this.getConstInfo();
    }
  }

  getConstInfo = async () => {
    if (
      this.state.patientId != "" &&
      this.state.patientId != undefined &&
      this.state.schedule_date != undefined
    ) {
      let path = "/app/api/v2/dial/board/getSendingData";
      let post_data = {
        patient_id: this.state.patientId,
        schedule_date: this.state.schedule_date,
        timezone: this.state.timezone,
      };
      apiClient
        .post(path, {
          params: post_data,
        })
        .then((data) => {
          this.setState({
            sending_continue_list: data[0],
            sending_next_list: data[1],
            sending_before_list: data[2],
          });
        })
        .catch(() => {});
    }
  };

  setConfirm = async (name, number) => {
    if (name == "before") {
      let data = {
        number: number,
      };

      let path = "/app/api/v2/dial/board/setCompletedData";
      apiClient
        .post(path, {
          params: data,
        })
        .then(() => {
          this.getConstInfo();
        })
        .catch(() => {});
    }
  };

  openAddContinueSendingModal = () => {
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if (patientInfo == undefined || patientInfo == null || patientInfo.system_patient_id == undefined) {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    this.setState({
      edit_modal_data: null,
      showContinueSendingModal: true,
    });
  };

  openAddNextSendingModal = () => {
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if (
      patientInfo == undefined ||
      patientInfo == null ||
      patientInfo.system_patient_id == undefined
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    this.setState({
      edit_modal_data: null,
      showNextSendingModal: true,
    });
  };
  closeModal = () => {
    this.setState({
      showContinueSendingModal: false,
      showNextSendingModal: false,
    });
    this.getConstInfo();
  };

  handleClick = (e, type, index, complete) => {
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
      if (type === "next") {
        document
          .getElementById("next-table")
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({
              contextMenu: { visible: false },
            });
            document
              .getElementById("next-table")
              .removeEventListener(`scroll`, onScrollOutside);
          });
      } else {
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
      }
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - 20,
          y: e.clientY + window.pageYOffset,
        },
        favouriteMenuType: type,
        index: index,
        complete,
      });
    }
  };

  confirmCancel() {
    this.setState({
      isDeleteConfirmModal: false,
      confirm_message: "",
    });
  }

  delete() {
    let data = {
      number: this.state.delete_number,
      system_patient_id: this.state.patientId,
    };

    let path = "/app/api/v2/dial/board/deleteSendingData";
    apiClient
      .post(path, {
        params: data,
      })
      .then(() => {
        this.confirmCancel();
        this.getConstInfo();
        window.sessionStorage.setItem("alert_messages",  "削除完了##" + "削除しました。");
      })
      .catch(() => {});
  }
  contextMenuAction = (type, index, act) => {
    if (act === "delete") {
      this.setState({
        isDeleteConfirmModal: true,
        confirm_message: "この申し送りを削除して良いですか？",
        delete_number:
          type === "next"
            ? this.state.sending_next_list[index].number
            : type === "before"
            ? this.state.sending_before_list[index].number
            : this.state.sending_continue_list[index].number,
      });
    } else if (act === "edit") {
      if (type === "next") {
        this.setState({
          edit_modal_data: this.state.sending_next_list[index],
          showNextSendingModal: true,
        });
      } else {
        this.setState({
          edit_modal_data: this.state.sending_continue_list[index],
          showContinueSendingModal: true,
        });
      }
    }
    if (act === "complete") {
      let data = {
        number:
          type === "before"
            ? this.state.sending_before_list[index].number
            : this.state.sending_continue_list[index].number,
      };
      let path = "/app/api/v2/dial/board/setCompletedData";
      apiClient
        .post(path, {
          params: data,
        })
        .then(() => {
          this.getConstInfo();
        })
        .catch(() => {});
    }
    if (type === "before") {
      this.props.getSchedule(1);
    }
  };

  handleOk = () => {
    this.closeModal();
    this.getConstInfo();
  };
  tabChange = (type) => {
    if (type === "drainage") this.props.tabChange(Dial_tab_index.DrainageSet);
    else if (type === "before_confirm")
      this.props.tabChange(Dial_tab_index.BeforeConfirm);
  };
  goPrintInstruction = () => {
    var schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    sessApi.setObjectValue("from_bedside", "schedule_date", schedule_date);
    sessApi.setObjectValue("from_bedside", "patient", patientInfo);
    this.props.history.replace("/dial/others/sendingList");
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
    return (
      <Wrapper className="sending_wrapper">
        <div className="content">
          <Col className="half">
            <div className="title_area continue_sending_title_area">
              <div className="continue_sending_title title">継続申し送り</div>
              <div
                className="continue_sending_add add_area"
                onClick={this.openAddContinueSendingModal}
              >
                <Icon icon={faPlus} />
                申し送りを追加
              </div>
            </div>
            <div className="continue-table-area">
              <table className="table table-bordered table-hover" id="code-table">
                <thead>
                  <tr>
                    <th style={{ width: "20px" }}></th>
                    <th>内容</th>
                    <th style={{ width: "10rem" }}>入力者</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.sending_continue_list !== undefined &&
                    this.state.sending_continue_list.length > 0 &&
                    this.state.sending_continue_list.map((item, index) => {
                      return (
                        <>
                          <tr
                            onContextMenu={(e) =>
                              this.handleClick(
                                e,
                                "continue",
                                index,
                                item.completed_by
                              )
                            }
                          >
                            <td
                              style={{ width: "20px" }}
                              className="text-center"
                            >
                              {index + 1}
                            </td>
                            <td className="send_content">
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
                                    <div className="schema-button">
                                      <Button
                                        onClick={() => this.openShema(item)}
                                      >
                                        シェーマを見る
                                      </Button>
                                    </div>
                                  )}
                              </div>
                            </td>
                            <td
                              style={{ width: "10rem", fontSize: "0.875rem",letterSpacing:"-0.8px" }}
                              className="text-center"
                            >
                              {this.state.staff_list_by_number != undefined &&
                              this.state.staff_list_by_number != null &&
                              item.updated_by !== 0
                                ? this.state.staff_list_by_number[
                                    item.updated_by
                                  ]
                                : ""}
                            </td>
                          </tr>
                        </>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </Col>
          <Col className="half">
            <div className="sending_from_before_area">
              <div className="title_area sending_from_before_title_area">
                <div className="sending_from_before_title title">
                  前回から申し送り
                </div>
                <button
                  style={{position: "absolute", right: "15px",fontSize: "15px",top:'5px'}}
                  onClick={this.goPrintInstruction.bind(this)}
                >
                  全患者の申し送り一覧
                </button>
              </div>
              <div className="before-table-area">
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th style={{ width: "2.2rem" }}>確認</th>
                      <th>内容</th>
                      <th style={{ width: "7rem" }}>入力者</th>
                      <th style={{ width: "7rem" }}>確認者</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.sending_before_list !== undefined &&
                      this.state.sending_before_list.length > 0 &&
                      this.state.sending_before_list.map((item, index) => {
                        return (
                          <>
                            <tr onContextMenu={(e) => this.handleClick(e,"before",index,item.completed_by)}>
                              <td style={{ width: "2.2rem" }} className="text-center">
                                {item.completed_by != null ? (
                                  <>
                                    <Checkbox
                                      label=""
                                      isDisabled={true}
                                      value={true}
                                    />
                                  </>
                                ) : (
                                  <>
                                    <Checkbox
                                      label=""
                                      isDisabled={true}
                                      value={false}
                                    />
                                  </>
                                )}
                              </td>
                              <td className="text-left send_content">
                                <div className="schema-div">
                                  <div className={item.image_path != null && item.image_path != "" && item.imgBase64 != "" ? "schema-content" :"no-schema"}style={{ wordBreak: "break-all" }}>
                                    {displayLineBreak(stripHtml(item.message))}
                                  </div>
                                    {item.image_path != null && item.image_path != "" && item.imgBase64 != "" && (
                                      <div className="schema-button">
                                        <Button onClick={() => this.openShema(item)}>シェーマを見る</Button>
                                      </div>
                                    )}
                                </div>
                              </td>
                              <td style={{ width: "7rem", fontSize: "0.875rem",letterSpacing:"-0.8px" }} className="text-center">
                                {this.state.staff_list_by_number != undefined &&
                                this.state.staff_list_by_number != null &&
                                item.updated_by !== 0
                                  ? this.state.staff_list_by_number[
                                      item.updated_by
                                    ]
                                  : ""}
                              </td>
                              <td
                                style={{ width: "7rem", fontSize: "0.875rem",letterSpacing:"-0.8px" }}
                                className="text-center"
                              >
                                {this.state.staff_list_by_number != undefined &&
                                this.state.staff_list_by_number != null &&
                                item.completed_by !== 0
                                  ? this.state.staff_list_by_number[
                                      item.completed_by
                                    ]
                                  : ""}
                              </td>
                            </tr>
                          </>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="sending_to_next_area">
              <div className="title_area sending_to_next_title_area">
                <div className="sending_to_next_title title" style={{paddingTop:'0.2rem', height:'2rem'}}>次回への申し送り</div>
                <div className="continue_sending_add add_area" onClick={this.openAddNextSendingModal}>
                  <Icon icon={faPlus} />
                  申し送りを追加
                </div>
              </div>
              <div className="next-table-area">
                <table className="table table-bordered table-hover"id="next-table">
                  <thead>
                    <tr>
                      <th style={{ width: "20px" }}></th>
                      <th>内容</th>
                      <th style={{ width: "10rem" }}>入力者</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.sending_next_list !== undefined &&
                      this.state.sending_next_list.length > 0 &&
                      this.state.sending_next_list.map((item, index) => {
                        return (
                          <>
                            <tr
                              onContextMenu={(e) =>
                                this.handleClick(e, "next", index, null)
                              }
                            >
                              <td
                                style={{ width: "20px" }}
                                className="text-center"
                              >
                                {index + 1}
                              </td>
                              <td className="send_content">
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
                                      <div className="schema-button">
                                        <Button
                                          onClick={() => this.openShema(item)}
                                        >
                                          シェーマを見る
                                        </Button>
                                      </div>
                                    )}
                                </div>
                              </td>
                              <td
                                style={{ width: "10rem", fontSize: "0.875rem",letterSpacing:"-0.8px" }}
                                className="text-center"
                              >
                                {this.state.staff_list_by_number != undefined &&
                                this.state.staff_list_by_number != null &&
                                item.updated_by !== 0
                                  ? this.state.staff_list_by_number[
                                      item.updated_by
                                    ]
                                  : ""}
                              </td>
                            </tr>
                          </>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
        </div>
        <div className="footer">
          <Button onClick={() => this.tabChange("drainage")}>除水設定</Button>
          <Button onClick={() => this.tabChange("before_confirm")}>
            開始時チェック
          </Button>
        </div>
        {this.state.showContinueSendingModal && (
          <InputPanel
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            kind="申し送り/継続"
            patient_id={this.state.patientId}
            schedule_date={this.state.schedule_date}
            item={this.state.edit_modal_data}
          />
        )}
        {this.state.showNextSendingModal && (
          <InputPanel
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            kind="申し送り/次回"
            patient_id={this.state.patientId}
            schedule_date={this.state.schedule_date}
            item={this.state.edit_modal_data}
          />
        )}
        {this.state.isDeleteConfirmModal && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.delete.bind(this)}
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
          favouriteMenuType={this.state.favouriteMenuType}
          index={this.state.index}
          complete={this.state.complete}
        />
      </Wrapper>
    );
  }
}

Sending.contextType = Context;

Sending.propTypes = {
  patientInfo: PropTypes.object,
  tabChange: PropTypes.func,
  schedule_date: PropTypes.string,
  getSchedule: PropTypes.func,
  timezone: PropTypes.number,
  history: PropTypes.object,
};

export default Sending;
