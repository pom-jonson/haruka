import React, { Component } from "react";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import Button from "~/components/atoms/Button";
// import Checkbox from "~/components/molecules/Checkbox";
import { surface } from "~/components/_nano/colors";
import PropTypes from "prop-types";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import DatePicker from "react-datepicker";
import CloseableTabs from "react-closeable-tabs";
import Error from "../MedicalInformation/Error";
import ErrorData from "../MedicalInformation/ErrorData";
import CalcData from "../MedicalInformation/CalcData";
import LogData from "../MedicalInformation/LogData";
import { formatJapanDate } from "~/helpers/date";
import SelectDialPatientPannel from "~/components/templates/Dial/Common/SelectDialPatientPannel";
import InspectionItemSelectModal from "./InspectionItemSelectModal";
import * as apiClient from "~/api/apiClient";
import { formatDateLine } from "~/helpers/date";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Card = styled.div`
  position: relative;
  overflow: hidden;
  overflow-y: auto;
  width: 100%;
  margin: 0px;
  float: left;
  width: 100%;
  height: 80vh;
  background-color: ${surface};
  padding: 20px;
  .footer {
    margin-top: 10px;
    text-align: center;
    margin-left: 0px !important;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 30px;
    }

    span {
      color: white;
      font-size: 20px;
      font-weight: 100;
    }
  }

  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
`;
// const Footer = styled.div`
//   width: 60%;
//   button{
//     margin-right: 0.4rem;
//   }
// `;
const List = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 18px;
  width: 100%;
  margin-right: 2%;
  height: 84%;
  float: left;
  overflow-y: auto;
  border: solid 1px lightgrey;
  label {
    margin: 0;
  }
  table {
    tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    tr:hover{background-color:#e2e2e2 !important;}
    td {
      padding: 0.25rem;
      text-align: center;
      input {
        margin: 0;
      }
    }
    th {
      text-align: center;
      padding: 0.3rem;
    }
    .table-check {
      width: 60px;
    }
    .code-number {
      width: 120px;
    }
  }
  .tl {
    text-align: left;
  }
  .tr {
    text-align: right;
  }
`;
const Wrapper = styled.div`
  width: 100%;
  height: calc(100vh - 250px);
  align-items: flex-start;
  justify-content: space-between;
  font-size: 18px;

  .content {
    margin-top: 10px;
    overflow: hidden;
    overflow-y: auto;
    height: calc(100vh - 210px);
  }
  .flex {
    display: flex;
    height: 95% !important;
    flex-wrap: wrap;
  }

  .patient-sel-buttons {
    button {
      margin-right: 10px;
    }
  }

  .example-custom-input {
    font-size: 18px;
    width: 200px;
    text-align: center;
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 5px;
    padding-bottom: 5px;
    border: 1px solid;
    margin-left: 5px;
    margin-right: 5px;
  }

  .div-style1 {
    display: block;
    overflow: hidden;
    .label-type1 {
      float: left;
    }
    .label-type2 {
      float: right;
    }
  }

  .left-area {
    width: 40%;
    height: 100%;
    .main-info {
      overflow: hidden;
      label {
        width: 0px;
        margin: 0px;
      }
    }
    .main-info .disease-name {
      height: 80%;
      overflow: hidden;
      border: 1px solid #ddd;
      p {
        margin: 0;
        text-align: center;
        font-size: 20px;
      }
    }
    .history-list {
      margin-top: 20px;
      overflow: hidden;
      height: 50%;
    }
    .history-list .disease-name {
      height: 80%;
      border: 1px solid #ddd;
      .history-title {
        font-size: 20px;
      }
      .flex div {
        width: 50%;
      }
      .history-delete {
        cursor: pointer;
      }
    }
    .box-border {
      overflow: hidden;
      overflow-y: auto;
      border: 1px solid black;
      height: 85%;
      p {
        margin: 0;
        text-align: center;
      }
      .select-area .radio-group-btn label {
        text-align: left;
        padding-left: 10px;
        border-radius: 4px;
      }
    }
  }
  .right-area {
    width: 60%;
    padding-left: 20px;
    height: 90%;
    .sc-bdVaJa {
      border: 1px solid #ddd;
      padding-top: 5px;
      height: 100%;
    }

    .sc-htpNat {
      margin-top: -10px;
      background: none;
      font-size: 18px;
      border-bottom: 1px solid #ddd;
      .tab {
        border-bottom: solid 1px #ddd;
      }
      .tab.active {
        border-left: solid 1px #ddd;
        border-bottom: none;
        border-right: solid 1px #ddd;
        border-top: solid 1px #ddd;
        outline: none;
      }
    }

    .first-area {
      .entry-date {
        width: 35%;
        label {
          text-align: right;
          width: 90px;
          font-size: 18px;
          margin-top: 7px;
          margin-bottom: 0;
        }
        input {
          width: 64%;
          height: 35px;
        }
        .react-datepicker-wrapper {
          width: 64%;
          .react-datepicker__input-container {
            width: 100%;
            input {
              display: block;
              width: 100%;
              height: 38px;
              border-radius: 4px;
              border-width: 1px;
              border-style: solid;
              border-color: rgb(206, 212, 218);
              border-image: initial;
              padding: 0px 8px;
            }
          }
        }
      }
      .entry-date div:first-child {
        margin-top: 0;
      }
    }
    .second-area {
      .left-space {
        width: 30%;
        .flex div {
          width: 50%;
        }
      }
      .right-space {
        width: 70%;
        font-size: 18px;
        .foot-label {
          height: 40px;
          padding-top: 5px;
          margin-right: 1px;
          width: 49%;
          text-align: center;
          background-color: #4f95ef;
          color: white;
        }
      }
    }
    .third-area {
      padding-top: 20px;
      table {
        td {
          width: 40%;
          label {
            width: 30%;
            text-align: left;
            margin-right: 0;
            font-size: 18px;
          }
          padding: 5px 0px 5px 0;
        }
        .table-label {
          width: 20%;
          background-color: #74a6f4;
          text-align: center;
          color: white;
        }
        .col-md-2 {
          padding: 0;
          max-width: 16%;
          label {
            width: 100%;
          }
        }
        .col-md-1 {
          padding: 0;
        }
      }
      .ml-29 {
        margin-left: 29px;
        max-width: 14% !important;
      }
      .mwp-11 {
        max-width: 11% !important;
      }
      .td-input {
        max-width: 17% !important;
        label {
          width: 0px !important;
        }
        input {
          height: 22px;
          padding: 0;
        }
        div {
          margin-top: -1px;
        }
      }
    }
  }

  .radio-label {
    width: 115px;
    padding-top: 10px;
    text-align: right;
  }
  .prev-content {
    .radio-btn label {
      width: 75px;
      border: solid 1px rgb(206, 212, 218);
      border-radius: 4px;
      margin: 0 5px;
      padding: 4px 5px;
      font-size: 18px;
    }
  }
  .print-type {
    .radio-btn label {
      width: 75px;
      border: solid 1px rgb(206, 212, 218);
      border-radius: 4px;
      margin: 0 5px;
      padding: 4px 5px;
      font-size: 18px;
    }
  }
  .text-left {
    text-align: left;
  }
  .text-right {
    text-align: right;
  }
  .label-box {
    font-size: 18px;
    border: 1px solid #a0a0a0;
  }
  .prev-session {
    width: 65%;
    padding-left: 5%;
  }
  .pt-20 {
    padding-top: 20px;
  }
  .pt-10 {
    padding-top: 10px;
  }
  .pt-12 {
    padding-top: 12px;
  }
  .padding-top-5 {
    padding-top: 5px;
  }
  .wp-30 {
    width: 30%;
  }
  .wp-35 {
    width: 35%;
  }
  .wp-40 {
    width: 40%;
  }
  .wp-45 {
    width: 45%;
    cursor: pointer;
  }
  .wp-55 {
    width: 55%;
  }
  .wp-60 {
    width: 60%;
  }
  .wp-70 {
    width: 70%;
  }
  .hp-100 {
    height: 100%;
  }
  .footer {
    margin-top: 10px !important;
    button span {
      font-size: 20px;
    }
  }

  .table-view {
    border: 1px solid #ddd;
    overflow: hidden;
    height: 90%;
  }

  .div-double-content {
    width: 50%;
    display: block;
    overflow: hidden;
    float: left;
    margin-top: 10px;
  }
  .list-content {
    border: 1px solid #ddd;
    height: 200px;
    width: 100%;
  }

  .div-regist-content {
    height: 50%;
    .div-double-content {
      height: 95%;
    }
    .list-content {
      height: 90%;
    }
  }

  .arm-img {
    margin-top: 20px;
  }

  .history-item {
    padding: 5px;
  }

  .history-header {
    overflow: hidden;
    display: block;
    margin-bottom: 20px;
  }

  .header-item {
    width: 30%;
    float: left;
    margin-right: 30px;
    label {
      text-align: left;
      width: 60px;
      font-size: 18px;
      margin-top: 7px;
      margin-bottom: 0;
    }
    input {
      width: 64%;
      height: 35px;
      border-radius: 4px;
      border-width: 1px;
      border-style: solid;
      border-color: rgb(206, 212, 218);
      border-image: initial;
      padding: 0px 8px;
    }
  }
`;

class InspectionCalcModal extends Component {
  constructor(props) {
    super(props);
    let prev_content = ["処置", "観察", "その他"];
    let list_array = props.modal_data;
    let delete_datas = null;
    this.state = {
      prev_content,
      prev_content_value: 0,
      nextCheckDate: "",
      delete_datas,
      data: [
        {
          tab: "エラー",
          component: <Error />,
          id: 0,
        },
        {
          tab: "エラー＆データ不備",
          component: <ErrorData />,
          id: 1,
        },
        {
          tab: "計算済",
          component: <CalcData />,
          id: 2,
        },
        {
          tab: "すべてのログ",
          component: <LogData />,
          id: 3,
        },
      ],
      activeIndex: 0,
      start_date: new Date(),
      end_date: new Date(),
      list_array,
      isOpenItmeModal: false,
      isOpenConfirmModal: false,
      confirm_message: "",
      change_flag: 0,
    };
  }

  componentDidMount() {
    this.setChangeFlag(0);    
  }
  
  componentWillUnmount() {
    sessApi.delObjectValue('dial_change_flag', 'inspection_calc_modal');
  }

  setChangeFlag=(change_flag)=>{      
      this.setState({change_flag});
      if (change_flag){
          sessApi.setObjectValue('dial_change_flag', 'inspection_calc_modal', 1)
      } else {
          sessApi.remove('dial_change_flag');
      }
  };

  SelectPrevContent = (e) => {
    this.setState({ prev_content_value: parseInt(e.target.value) });
  };

  getNextCheckDate = (value) => {
    this.setState({ nextCheckDate: value });
  };

  getEntryStaff = (e) => {
    this.setState({ entryStaff: e.target.value });
  };

  getRadio = (number, name, value) => {
    if (name === "check") {
      let { list_array } = this.state;
      list_array[number].is_selected = value;
      this.setState({ list_array });
    }
  };

  makeDeleteHistoryData = () => {};

  deleteHistory = () => {};

  selectTitleTab = (e) => {
    this.setState({ activeIndex: parseInt(e.target.id) });
  };

  tabChange = (val) => {
    this.setState({ activeIndex: val });
  };

  getStartDate = (value) => {
    this.setState({
      start_date: value,
    });
  };
  getEndDate = (value) => {
    this.setState({
      end_date: value,
    });
  };

  openPatientModal = () => {
    this.setState({ isOpenSelectModal: true });
  };
  openItmeModal = () => {
    this.setState({ isOpenItmeModal: true });
  };
  closeModal = () => {
    this.setState({
      isOpenItmeModal: false,
      isOpenSelectModal: false,
    });
  };

  selectPatient = (item) => {
    this.setChangeFlag(1);
    this.closeModal();
    this.setState({
      system_patient_id: item.system_patient_id,
      select_patient: item.patient_number + " : " + item.patient_name,
    });
  };

  handleOk = (calc_item) => {
    this.setChangeFlag(1);
    this.setState({ calc_item });
    this.closeModal();
  };

  startCalculate = async () => {
    if (this.state.change_flag == 0) return;
    if (
      this.state.system_patient_id === undefined ||
      this.state.system_patient_id == null
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を指定してください。"
      );
      return;
    }
    if (this.state.calc_item === undefined || this.state.calc_item == null) {
      window.sessionStorage.setItem(
        "alert_messages",
        "検査データ計算項目を設定してください。"
      );
      return;
    }
    let path = "/app/api/v2/dial/medicine_information/calculate_exam";
    let post_data = {
      calc_items: this.state.calc_item,
      exam_items: this.state.list_array,
      is_all_patient: this.state.is_all_patient,
      system_patient_id: this.state.system_patient_id,
      start_date: formatDateLine(this.state.start_date),
      end_date: formatDateLine(this.state.end_date),
    };
    await apiClient.post(path, { params: post_data }).then((res) => {
      window.sessionStorage.setItem("alert_messages", "計算しました。");
      this.setChangeFlag(0);
      this.setState({
        log_data: res,
        data: [
          {
            tab: "エラー",
            component: <Error log_data={res} />,
            id: 0,
          },
          {
            tab: "エラー＆データ不備",
            component: <ErrorData log_data={res} />,
            id: 1,
          },
          {
            tab: "計算済",
            component: <CalcData log_data={res} />,
            id: 2,
          },
          {
            tab: "すべてのログ",
            component: <LogData log_data={res} />,
            id: 3,
          },
        ],
      });
    });
  };

  allPatient = () => {
    this.setChangeFlag(1);
    this.setState({
      is_all_patient: 1,
      select_patient: "",
      system_patient_id: 0,
    });
  };

  handleClose = () => {
    if (this.state.change_flag == 1) {
      this.setState({
        isOpenConfirmModal: true,
        confirm_message: "登録していない内容があります。変更内容を破棄して閉じますか？"
      });
      return;
    }

    this.props.closeModal();
  }

  confirmCancel = () =>{
    this.setState({
      isOpenConfirmModal: false,
      confirm_message: ""
    });
  }

  confirmCloseOk = () => {
    this.setState({
      isOpenConfirmModal: false,
      confirm_message: ""
    },()=>{
      this.props.closeModal();
    });
  }

  render() {
    // const { closeModal } = this.props;
    let list_array = this.state.calc_item;
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className="cur-date example-custom-input" onClick={onClick}>
        {formatJapanDate(value)}
      </div>
    );
    return (
      <Modal
        show={true}
        // onHide={closeModal}
        id="add_contact_dlg"
        className="master-modal exam-calc-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>検査計算</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <DatePickerBox>
              <Wrapper>
                <div className="flex hp-100 content">
                  <div className="left-area">
                    <div className="history-header">
                      <p>期間指定</p>
                      <DatePicker
                        locale="ja"
                        selected={this.state.start_date}
                        onChange={this.getStartDate.bind(this)}
                        dateFormat="yyyy/MM/dd"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dayClassName = {date => setDateColorClassName(date)}
                        customInput={<ExampleCustomInput />}
                      />
                      <span>～</span>
                      <DatePicker
                        locale="ja"
                        selected={this.state.end_date}
                        onChange={this.getEndDate.bind(this)}
                        dateFormat="yyyy/MM/dd"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dayClassName = {date => setDateColorClassName(date)}
                        customInput={<ExampleCustomInput />}
                      />
                    </div>
                    <div className="main-info">
                      <p>患者指定</p>
                      <div className="patient-sel-buttons">
                        <Button type="mono" onClick={this.openPatientModal}>
                          選択
                        </Button>
                        <Button type="mono" onClick={this.allPatient}>
                          全患者
                        </Button>
                      </div>
                      <InputWithLabel
                        label=""
                        type="text"
                        diseaseEditData={this.state.select_patient}
                      />
                    </div>
                    <div className="history-list">
                      <p>計算項目</p>
                      <List>
                        <table
                          className="table-scroll table table-bordered"
                          id="wordList-table"
                        >
                          <tbody>
                            {list_array !== undefined &&
                              list_array !== null &&
                              Object.keys(list_array).length > 0 &&
                              Object.keys(list_array).map((index) => {
                                let item = list_array[index];
                                return (
                                  <>
                                    <tr
                                      onContextMenu={(e) =>
                                        this.handleClick(e, index, item)
                                      }
                                    >
                                      {/*<td>*/}
                                      {/*<Checkbox*/}
                                      {/*label=""*/}
                                      {/*getRadio={this.getRadio.bind(this,index)}*/}
                                      {/*isDisabled={true}*/}
                                      {/*value={item.is_selected != undefined && item.is_selected ==1}*/}
                                      {/*name="check"*/}
                                      {/*/>*/}
                                      {/*</td>*/}
                                      <td className="tl">{item.name}</td>
                                    </tr>
                                  </>
                                );
                              })}
                          </tbody>
                        </table>
                      </List>
                    </div>
                  </div>
                  <div className="right-area">
                    <CloseableTabs
                      tabPanelColor="lightgray"
                      data={this.state.data}
                      activeIndex={this.state.activeIndex}
                      tabContentClass=""
                      log_data={this.state.log_data}
                    />
                  </div>
                </div>
              </Wrapper>
            </DatePickerBox>
          </Card>
        </Modal.Body>
        <Modal.Footer>
            <Button className="red-btn" onClick={this.openItmeModal}>設定</Button>
          <Button className="cancel-btn" onClick={this.handleClose}>キャンセル</Button>
            <Button className={this.state.change_flag == 0 ? "disable-btn" : "red-btn"} onClick={this.startCalculate}>計算開始</Button>
        </Modal.Footer>
        {this.state.isOpenSelectModal && (
          <SelectDialPatientPannel
            selectMaster={this.selectPatient}
            closeModal={this.closeModal}
            MasterName="患者"
          />
        )}
        {this.state.isOpenConfirmModal !== false &&  (
              <SystemConfirmJapanModal
                  hideConfirm= {this.confirmCancel.bind(this)}
                  confirmCancel= {this.confirmCancel.bind(this)}
                  confirmOk= {this.confirmCloseOk}
                  confirmTitle= {this.state.confirm_message}
              />
          )}
        {this.state.isOpenItmeModal && (
          <InspectionItemSelectModal
            closeModal={this.closeModal}
            handleOk={this.handleOk}
            modal_data={this.state.list_array}
          />
        )}
      </Modal>
    );
  }
}

InspectionCalcModal.contextType = Context;

InspectionCalcModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  modal_data: PropTypes.object,
};

export default InspectionCalcModal;
