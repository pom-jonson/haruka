import React, { Component } from "react";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import ContraindicationModal from "../modals/ContraindicationModal";
import * as apiClient from "~/api/apiClient";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import * as methods from "../DialMethods";
import {
  formatJapan,
  formatJapanYearMonth,
  formatJapanYear,
} from "~/helpers/date";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import { displayLineBreak } from "~/helpers/dialConstants";
import * as sessApi from "~/helpers/cacheSession-utils";

const Wrapper = styled.div`
  padding: 1.25rem 0.625rem;
  width:100%;
  height: calc(100% - 3.125rem);

  .title {
    font-size: 2rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;
  }

  .text-left {
    text-align: left;
  }
  .text-right {
    text-align: right;
  }
  .text-center {
    text-align: center;
  }
  .label-title {
    width: 6.25rem;
    font-size: 1rem;
    text-align: right;
    margin-right: 0.625rem;
  }
  .pullbox-select {
    width: 12.5rem;
    font-size: 10.3rem;
  }

  .content {
    width:100%;
    margin-top: 0.625rem;
    height: calc(100% - 4rem);
  }
  table {
    thead {
      display: table;
      width: 100%;
    }
    tbody {
      display: block;
      overflow-y: auto;
      height: calc(100vh - 21.3rem);
      width: 100%;
    }
    tr {
      display: table;
      width: 100%;
    }
    tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    tr:hover{background-color:#e2e2e2 !important;}
    td {
      word-break: break-all;
      padding: 0.25rem;
    }
    th {
      position: sticky;
      text-align: center;
      padding: 0.3rem;
    }
    .table-check {
      width: 4.375rem;
    }
    .item-no {
      width: 3.125rem;
    }
    .code-number {
      width: 7.5rem;
    }
    .name {
      width: 14rem;
    }
  }
  .width-40 {
    width: 40%;
  }
  .width-20 {
    width: 20%;
  }
  .width-14 {
    width: 14%;
  }
  .width-30 {
    width: 30%;
  }

  .footer {
    bottom: 5.5rem;
  }
`;

const ContextMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 1rem;
    font-weight: normal;
    line-height: 1.5rem;
    margin: 0;
    padding: 0 1.25rem;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 0.3rem 12px;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 0.5rem;
  }
  .blue-text {
    color: blue;
  }
`;

const SpinnerWrapper = styled.div`
  width:100%;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContextMenu = ({ visible, x, y, parent, favouriteMenuType }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
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

class ContraindicationBody extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let code_master = sessApi.getObjectValue("dial_common_master","code_master");
    this.state = {
      table_data: [],
      isOpenModal: false,
      isLoaded: false,
      patient: {},
      patient_name: "",
      modal_data: null,
      commonCodeData: code_master['禁忌薬（アレルギー）'],
      isDeleteConfirmModal: false,
      confirm_message: "",
      delete_id: "",
      name: "",
    };
    this.double_click = false;
  }
  
  async componentDidMount() {    
    this.setState(
      {
        patient_number:
          this.props.patientInfo != undefined && this.props.patientInfo != null
            ? this.props.patientInfo.system_patient_id
            : "",
        patient:
          this.props.patientInfo != undefined && this.props.patientInfo != null
            ? this.props.patientInfo
            : "",
      },
      () => {
        this.getList().then(() => {
          this.setState({
            isLoaded: true,
          });
        });
      }
    );
  }
  
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.patientInfo != undefined && nextProps.patientInfo != null) {
      this.setState(
        {
          patient: nextProps.patientInfo,
          patient_name: nextProps.patientInfo.patient_name,
          patient_number: nextProps.patientInfo.system_patient_id,
          patientInfo: nextProps.patientInfo,
        },
        () => {
          this.getList();
        }
      );
    }
  }
  
  async getList() {
    if (this.state.patient_number != "") {
      let path = "/app/api/v2/dial/medicine_information/contraindication/list";
      let post_data = {
        patient_number: this.state.patient_number,
      };
      let { data } = await axios.post(path, { params: post_data });
      this.setState({
        table_data: data,
      });
    }
  }
  handleClick = (e, index, name) => {
    if (this.props.type == 'modal') return;
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
          x: this.props.type === "modal" ? e.clientX - 190 : e.clientX - 200,
          y: this.props.type === "modal" ? e.clientY - 190 : e.clientY - 70,
        },
        favouriteMenuType: index,
        name,
      });
    }
  };
  
  contextMenuAction = (index, type) => {
    if (type === "edit") {
      this.editData(index);
    }
    if (type === "delete") {
      this.setState({
        isDeleteConfirmModal: true,
        confirm_message:
        "「" + this.state.name + "」" + " これを削除して良いですか？",
        delete_id: this.state.table_data[index].id,
      });
    }
  };
  
  confirmCancel() {
    this.setState({
      isDeleteConfirmModal: false,
      confirm_message: "",
    });
  }
  
  handleInsert = () => {
    let size = Object.keys(this.state.patient).length;
    if (
      this.state.patient == undefined ||
      this.state.patient == null ||
      size == 0
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    
    this.setState({
      isOpenModal: true,
      modal_data: null,
    });
  };
  
  handleOk = async (post_data) => {
    post_data.patient_number = this.state.patient.system_patient_id;
    let path =
      "/app/api/v2/dial/medicine_information/contraindication/register";
    if (this.double_click == true) return;
    this.double_click = true;
    await apiClient
      .post(path, { params: post_data })
      .then((res) => {
        this.setState({
          isOpenModal: false,
        });
        if (res) {
          if (this.props.type === "modal") {
            this.props.handleOk();
          }
          this.getList();
          var title = '';
          var message = res.alert_message;
          if (message.indexOf('変更') > -1) title = "変更完了##";
          if (message.indexOf('登録') > -1) title = "登録完了##";
          window.sessionStorage.setItem("alert_messages", title + res.alert_message);
        }
      })
      .catch(() => {
        return false;
      })
      .finally(() => {
        this.double_click = false;
      });
  };
  
  closeModal = () => {
    this.setState({ isOpenModal: false });
  };
  
  editData = (index) => {
    let modal_data = this.state.table_data[index];
    this.setState({
      modal_data,
      isOpenModal: true,
    });
  };
  
  deleteData = async () => {
    if (this.state.delete_id !== "") {
      let path =
        "/app/api/v2/dial/medicine_information/contraindication/delete";
      let post_data = {
        params: this.state.delete_id,
        patient_number: this.state.patient_number,
      };
      if (this.double_click == true) return;
      this.double_click = true;
      await apiClient.post(path, post_data).then(()=>{
        window.sessionStorage.setItem(
          "alert_messages",
          "削除完了##" + "削除しました。");
      }).finally(() => {
        this.double_click = false;
      });
      this.getList();
    }
    this.confirmCancel();
  };
  
  getShowDate = (item) => {
    if (item == undefined || item == null) return "";
    if (item.date != null) {
      return formatJapan(item.date);
    } else if (item.month != null) {
      return formatJapanYearMonth(
        item.year.toString() + "-" + ("00" + item.month.toString()).slice(-2)
      );
    } else {
      return formatJapanYear(item.year.toString());
    }
  };
  
  render() {
    const { table_data, isLoaded } = this.state;
    let code_arr = {};
    this.state.commonCodeData.map((item) => {
      code_arr[item.code] = item.name;
    });
    
    return (
      <>
        <Wrapper className="bedside-contradication">
          <div className="content">
            <table className="table-scroll table table-bordered table-hover">
              <thead>
              <th className={`item-no`}></th>
              <th style={{ width: "4rem" }}>区分</th>
              <th style={{ width: "18rem" }}>名称</th>
              <th style={{ width: "35rem" }}>備考</th>
              <th>日付</th>
              </thead>
              <tbody id="code-table">
              {isLoaded ? (
                <>
                  {table_data != undefined && table_data != null && table_data.length > 0 && (
                    table_data.map((item, index) => {
                      return (
                        <>
                          <tr
                            onContextMenu={(e) =>
                              this.handleClick(
                                e,
                                index,
                                code_arr[item.contraindicant_code] !=
                                undefined &&
                                code_arr[item.contraindicant_code] != null
                                  ? code_arr[item.contraindicant_code]
                                  : ""
                              )
                            }
                          >
                            <td className={`text-right item-no`} key={index}>
                              {index + 1}
                            </td>
                            <td style={{ width: "4rem" }}>
                              {item.type_contraindicant}
                            </td>
                            <td style={{ width: "18rem" }}>
                              {code_arr[item.contraindicant_code] !=
                              undefined &&
                              code_arr[item.contraindicant_code] != null
                                ? code_arr[item.contraindicant_code]
                                : ""}
                            </td>
                            <td style={{ width: "35rem" }}>
                              {displayLineBreak(item.note)}
                            </td>
                            <td>{this.getShowDate(item)}</td>
                          </tr>
                        </>
                      );
                    })
                  )}
                </>
              ) : (
                <tr>
                  <td colSpan={'4'}>
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  </td>
                </tr>
              )}
              </tbody>
            </table>
          </div>
          <div className={"footer-buttons"}>
            {this.props.type != undefined &&
            this.props.type != null &&
            this.props.type === "modal" ? (
              <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            ):(
              <Button className="red-btn" onClick={this.handleInsert}>追加</Button>
            )}
          </div>
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
            favouriteMenuType={this.state.favouriteMenuType}
          />
        </Wrapper>
        {this.state.isOpenModal && (
          <ContraindicationModal
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            system_patient_id={
              this.state.patient == null
                ? ""
                : this.state.patient.system_patient_id
            }
            modal_data={this.state.modal_data}
            codeData={this.state.commonCodeData}
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
      </>
    );
  }
}

ContraindicationBody.contextType = Context;

ContraindicationBody.propTypes = {
  patientInfo: PropTypes.array,
  type: PropTypes.string,
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  from_source:PropTypes.string
};
export default ContraindicationBody;
