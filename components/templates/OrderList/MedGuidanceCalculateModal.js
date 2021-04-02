import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { WEEKDAYS } from "~/helpers/constants";
import {
  surface,
  secondary200,
  midEmphasis,
  disable
} from "~/components/_nano/colors";
// import * as apiClient from "~/api/apiClient";
// import {formatJapanDateSlash} from "~/helpers/date";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import { Bar } from "~/components/styles/harukaBackgroundCss";
import MedicineGuidanceOrderData from "~/components/templates/Patient/Modals/Guidance/MedicineGuidanceOrderData";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import { FUNCTION_ID_CATEGORY } from "~/helpers/constants";
import axios from "axios/index";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  
  flex-direction column;
  display: flex;
  text-align: center;
  .content{
    height: 100%;
    width:55%;
  }
  .input-area {
    width:45%;
    padding-top:15px;
    padding-left:1rem;
    .select-area {
      .label-title {
        width: 0;
      }
      .pullbox {
        width: 100%;
      }
      .pullbox-select, .pullbox-label {
        width: 100%;
      }
    }
    .sub-title {
      text-align: left;
    }
  }
  .patient-info {
    text-align: right;
    font-size: 1.2rem;
    font-weight: bold;
  }
  .rehabily-content{
      height: calc(100% - 8rem);
      overflow-y: auto;
      .order{
        border-right: 1px solid rgb(213, 213, 213);
        border-left: 1px solid rgb(213, 213, 213);      
      }
  }
  .justify-content {
    align-items: flex-start;
    justify-content: space-between;
  }  
 `;
const Col = styled.div`
  background-color: ${surface};
  width: 100%;
  height: 100%;
  -ms-overflow-style: auto;
  textarea {
    width: 100%;
    resize: none;
  }
  .data-item {
    border-bottom: 1px solid ${disable};
    background: rgb(160, 235, 255);
  }
  .data-header {
    background: rgb(105, 200, 225);
    color: white;
    padding: 4px 8px;
  }
  .bottom-line {
    border-bottom: 1px solid rgb(213, 213, 213);
  }
  .data-title {
    border: 1px solid rgb(213, 213, 213);
    cursor: pointer;
    .data-item {
      padding: 10px;
    }
    .note {
      text-align: left;
    }
    .date {
      text-align: left;
    }
  }
  .department {
    font-size: 1rem;
  }
  .note {
    font-weight: bold;
  }
  .date {
    font-weight: bold;
  }
  .doctor-name {
    font-size: 1rem;
    padding-right: 0.5rem;
  }
  .history-region {
    border-bottom: 1px solid rgb(213, 213, 213);
    font-size: 1rem;
    padding-right: 0.5rem;
  }
  .order {
    display: block !important;
  }
  .data-list {
    overflow: hidden;
    height: calc(100% - 2rem);
  }

  .soap-history-title {
    font-size: 0.8rem;
  }

  .low-title,
  .middle-title {
    background: #ddf8ff;
  }

  .tb-soap {
    width: 100%;

    th {
      background: #f6fcfd;
    }

    textarea {
      background: white;
      color: black;
      height: 25px;
    }
  }
  .disable-button {
    background: rgb(101, 114, 117);
  }

  ._color_alerted {
    .history-region {
      background: #ffe5c7;
    }
    .doctor-name {
      background: #ffe5c7;
    }
    .data-item {
      background: linear-gradient(#e8d2ac, #ffe6b8, #ffe6b8);
    }
  }
  ._color_received {
    .history-region {
      background: #dbffff;
    }
    .doctor-name {
      background: #dbffff;
    }

    .data-item {
      background: linear-gradient(#bfefef, #c7f8f8, #c7f8f8);
    }
  }
  ._color_implemented {
    .history-region {
      background: #e5ffdb;
    }
    .doctor-name {
      background: #e5ffdb;
    }
    .data-item {
      background: linear-gradient(#d0e6b5, #e6ffcb, #e6ffcb);
    }
  }
  ._color_not_implemented {
    .history-region {
      background: #ffe5ef;
    }
    .doctor-name {
      background: #ffe5ef;
    }
    .data-item {
      background: linear-gradient(#eac1db, #ffd4f0, #ffd4f0);
    }
  }
`;

const MedicineListWrapper = styled.div`
  font-size: 0.8rem;
  height: calc(100% - 8rem);
  .history-item {
    height: 100%;
    overflow-y: auto;
    padding-bottom: 1px;
  }
  .row {
    margin: 0;
    &:first-child {
      border-top: 1px solid ${disable};
    }
  }

  .box {
    line-height: 1.3;
    position: relative;
    &:before {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 50px;
    }
    &:after {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      right: 80px;
    }

    .table-row {
      &:nth-child(2n) {
        background-color: ${secondary200};
      }
    }
  }

  .phy-box {
    line-height: 1.3;
    position: relative;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    &:before {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 200px;
    }

    .text-left {
      .table-item {
        width: 150px;
        float: left;
        text-align: right;
      }
    }
    .text-right {
      .table-item {
        text-align: left;
      }
    }

    .table-row {
      &:nth-child(2n) {
        background-color: ${secondary200};
      }
    }
  }

  .line-through {
    color: #ff0000;
  }

  .flex {
    display: flex;
    margin-bottom: 0;

    &.between {
      justify-content: space-between;

      div {
        margin-right: 0;
      }
    }

    div {
      margin-right: 8px;
    }

    .date {
      margin-left: auto;
      margin-right: 24px;
    }
  }

  .patient-name {
    margin-left: 1rem;
  }

  .drug-item {
    border-bottom: 1px solid ${disable};
    padding: 4px;
  }

  .number {
    margin-right: 8px;
    width: 75px;
  }
  .number .rp {
    text-decoration-line: underline;
  }

  .unit {
    text-align: right;
  }

  .w80 {
    text-align: right;
    width: 80px;
    margin-left: 8px;
  }

  .option {
    border-bottom: 1px solid ${disable};
    padding: 4px;
  }

  .text-right {
    width: calc(100% - 88px);
  }

  .remarks-comment {
    margin-left: auto;
    width: calc(100% - 80px);
    word-wrap: break-word;
  }

  .order-copy {
    background-color: transparent;
    border: 1px solid #ced4da;
    padding: 0 4px;
    min-width: auto;
    span {
      color: ${midEmphasis};
      font-weight: normal;
      letter-spacing: 0;
    }
  }

  .hidden {
    display: none;
  }

  p {
    margin-bottom: 0;
  }

  .doing {
    background: #ccc !important;

    .table-row {
      &:nth-child(2n) {
        background-color: #ccc;
      }
    }
  }
`;

class MedGuidanceCalculateModal extends Component {
  constructor(props) {
    super(props);

    var order_data = this.props.modal_data.order_data.order_data;
    let departmentOptions = JSON.parse(
      window.sessionStorage.getItem("init_status")
    ).diagnosis_treatment_department;
    let departements = {};
    if (departmentOptions != undefined && departmentOptions.length > 0) {
      departmentOptions.map(item => {
        departements[item.id] = item;
      });
    }
    this.state = {
      departmentOptions: departements,
      modal_title: this.props.modal_title,
      modal_data: this.props.modal_data,
      isOpenInspectionImageModal: false,
      isDeleteConfirmModal: false,
      isShowStaffList: false,
      confirm_message: "",
      order_data,
      alert_messages: "",
      calc_comment: "",
      calc_items: [{ id: 0, value: "" }],
      calc_id: 0
    };
  }

  async componentDidMount() {
    let path = "/app/api/v2/order/guidance/searchItem";
    let post_data = {
      function_id: FUNCTION_ID_CATEGORY.GUIDANCE,
      item_category_id: 19
    };
    await axios.post(path, { params: post_data }).then(res => {
      let { calc_items } = this.state;
      let index = 1;
      if (res.data.length > 0) {
        res.data.map(item => {
          calc_items[index] = { id: item.item_id, value: item.name };
          index++;
        });
      }
      this.setState({
        calc_items
      });
    });
  }

  doneData = () => {
    if (this.props.from_source == "schedule_modal") {
      var send_data = { ...this.props.modal_data };
      send_data.calc_id = this.state.calc_id;
      if (this.state.calc_comment != "") {
        send_data.calc_comment = this.state.calc_comment;
      }
      this.props.handleOk(send_data);
      return;
    }
  };

  getWeekDay = dateStr => {
    let weekday = new Date(dateStr).getDay();
    return WEEKDAYS[weekday];
  };

  getDoctorName = (nDoctorConsented = -1, strDoctorName = "") => {
    if (nDoctorConsented == 4) {
      return `（過去データ取り込み）${strDoctorName}`;
    }
    if (nDoctorConsented == 2) {
      return strDoctorName;
    } else {
      if (nDoctorConsented == 1) {
        return `[承認済み] 依頼医: ${strDoctorName}`;
      } else {
        return (
          <div>
            <span className="not-consented">[未承認]</span> 依頼医:{" "}
            {strDoctorName}
          </div>
        );
      }
    }
  };

  confirmCancel() {
    this.setState({
      confirm_message: "",
      isDeleteConfirmModal: false
    });
  }

  confirmOk = () => {
    this.doneData();
    this.setState({
      confirm_message: ""
    });
  };

  openConfirm = () => {
    if (this.state.calc_id == 0) return;
    this.setState({
      confirm_message: "算定しますか？"
    });
  };

  getOrderTitleClassName = param_obj => {
    if (param_obj.complete_flag == 1) return "_color_implemented";
    if (param_obj.time_id > 0) return "_color_received";
    if (param_obj.complete_flag == 0) return "_color_not_implemented";
    return "";
  };

  getHistoryInfo = (
    nHistoryLength = -1,
    strStuffName = "",
    strDateTime = "",
    nDoctorConsented = -1
  ) => {
    let strHistory = "";
    nHistoryLength++;
    if (nHistoryLength < 10) {
      nHistoryLength = `0${nHistoryLength}`;
    }

    if (nDoctorConsented == 4) {
      return "";
    }
    if (nDoctorConsented == 2) {
      strHistory = `${nHistoryLength}版 : ${strDateTime.substr(
        0,
        4
      )}/${strDateTime.substr(5, 2)}/${strDateTime.substr(
        8,
        2
      )} ${strDateTime.substr(11, 2)}時${strDateTime.substr(14, 2)}分`;
      return strHistory;
    } else {
      if (nDoctorConsented == 1) {
        strHistory = `${nHistoryLength}版 入力者 : ${strStuffName}`;
        return strHistory;
      } else {
        strHistory = `${nHistoryLength}版 : ${strDateTime.substr(
          0,
          4
        )}/${strDateTime.substr(5, 2)}/${strDateTime.substr(
          8,
          2
        )} ${strDateTime.substr(11, 2)}時${strDateTime.substr(
          14,
          2
        )}分 入力者 : ${strStuffName}`;
        if (nHistoryLength == 1) {
          strHistory = `${nHistoryLength}版 入力者 : ${strStuffName}`;
        }
        return strHistory;
      }
    }
  };

  getInputText = (name, e) => {
    this.setState({
      calc_comment: e.target.value
    });
  };

  closeAlertModal = () => {
    this.setState({ alert_messages: "" });
  };

  getDoneStatus(order_data) {
    if (order_data.complete_flag == 1) return "実施済";
    if (order_data.time_id > 0) return "予約済";
    if (order_data.complete_flag == 0) return "未予約";
    return "";
  }
  getItemCategory = e => {
    this.setState({ calc_id: e.target.id });
  };

  render() {
    const { modal_data, modal_title } = this.props;
    var { order_data } = this.state;
    var done_status = this.getDoneStatus(modal_data);
    // //-----------flex area-----------------------------------------
    var patient_number = this.props.modal_data.patient_number.trim();
    var patient_name = this.props.modal_data.patient_name.trim();
    // var history = this.props.from_source == 'done_list' ? modal_data.history:modal_data.data.history;
    let karte_status_name = "外来・";
    if (order_data != undefined && order_data.karte_status != undefined) {
      karte_status_name =
        order_data.karte_status == 1
          ? "外来・"
          : order_data.karte_status == 2
          ? "訪問診療・"
          : order_data.karte_status == 3
          ? "入院・"
          : "";
    }
    let disable = this.state.calc_id > 0 ? false : true;
    //-------------------------------------------------------------
    return (
      <Modal
        show={true}
        id="done-order-modal"
        className="custom-modal-sm first-view-modal haruka-done-modal haruka-done-radiation-modal"
      >
        <Modal.Header>
          <Modal.Title>{modal_title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <Col id="soap_list_wrapper">
              <Bar>
                <div className="flex" style={{ height: "100%" }}>
                  <div className="content">
                    <div className={"patient-info"}>
                      {patient_number} : {patient_name}
                    </div>
                    <div className="data-list">
                      <div
                        className={`data-title ${this.getOrderTitleClassName(
                          modal_data
                        )}`}
                      >
                        <div className={"data-item"}>
                          <div className="flex justify-content">
                            <div className="note">
                              【{karte_status_name}服薬指導】{done_status}
                            </div>
                            <div className="department text-right">
                              {
                                this.state.departmentOptions[
                                  order_data.department_id
                                ].value
                              }
                            </div>
                          </div>
                          <div className="date">
                            {modal_data.updated_at !== "" &&
                              modal_data.updated_at != null &&
                              modal_data.updated_at !== "" && (
                                <>
                                  {modal_data.updated_at.substr(0, 4)}/
                                  {modal_data.updated_at.substr(5, 2)}/
                                  {modal_data.updated_at.substr(8, 2)}(
                                  {this.getWeekDay(
                                    modal_data.updated_at.substr(0, 10)
                                  )}
                                  ) {modal_data.updated_at.substr(11, 2)}時
                                  {modal_data.updated_at.substr(14, 2)}分
                                </>
                              )}
                          </div>
                        </div>
                        <div className="doctor-name text-right low-title">
                          {this.getDoctorName(
                            modal_data.is_doctor_consented,
                            order_data.doctor_name
                          )}
                        </div>
                      </div>
                      <MedicineListWrapper>
                        <div className="history-item">
                          <MedicineGuidanceOrderData cache_data={order_data} />
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </div>
                  <div className="input-area">
                    <div className="select-area">
                      <div className="sub-title">指導項目</div>
                      <SelectorWithLabel
                        title=""
                        options={this.state.calc_items}
                        getSelect={this.getItemCategory.bind(this)}
                        departmentEditCode={this.state.calc_id}
                      />
                    </div>
                    <div className="comment-area">
                      <div className="sub-title">算定コメント</div>
                      <textarea
                        value={this.state.calc_comment}
                        onChange={this.getInputText.bind(this, "calc_comment")}
                      />
                    </div>
                  </div>
                </div>
              </Bar>
            </Col>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <div
            onClick={this.props.closeModal}
            className="custom-modal-btn cancel-btn"
            style={{ cursor: "pointer" }}
          >
            <span>キャンセル</span>
          </div>
          <div
            onClick={this.openConfirm.bind(this)}
            className={
              disable
                ? "custom-modal-btn disable-btn"
                : "custom-modal-btn red-btn"
            }
            style={{ cursor: "pointer" }}
          >
            <span>確定</span>
          </div>
        </Modal.Footer>
        {this.state.confirm_message !== "" && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.confirmOk.bind(this)}
            confirmTitle={this.state.confirm_message}
          />
        )}

        {this.state.isDeleteConfirmModal && (
          <ConfirmNoFocusModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.confirmDelete.bind(this)}
            confirmTitle={this.state.confirm_message}
          />
        )}
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal={this.closeAlertModal}
            handleOk={this.closeAlertModal}
            showMedicineContent={this.state.alert_messages}
          />
        )}
      </Modal>
    );
  }
}

MedGuidanceCalculateModal.contextType = Context;

MedGuidanceCalculateModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  modal_type: PropTypes.string,
  modal_title: PropTypes.string,
  modal_data: PropTypes.object,
  from_source: PropTypes.string
};

export default MedGuidanceCalculateModal;
