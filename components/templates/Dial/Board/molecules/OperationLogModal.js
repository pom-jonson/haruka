import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as methods from "~/components/templates/Dial/DialMethods";
import * as apiClient from "~/api/apiClient";
import { CACHE_SESSIONNAMES } from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import OperationLogView from "./OperationLogView";
import AlarmNotificationView from "./AlarmNotificationView";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  width: 100%;
  height: auto;
  flex-direction: column;
  display: flex;
  text-align: center;
  .footer {
    margin-top: 15px;
    text-align: center;
    width: 100%;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      padding-left: 60px;
      padding-right: 60px;
      margin-right: 10px;
    }
    .add-button {
      text-align: center;
    }
    span {
      color: white;
      font-size: 16px;
      letter-spacing: 7px;
      margin-left: 4px;
      font-weight: 100;
    }
  }
`;
const Modal_Top = styled.div`
  display: flex;
  margin-bottom: 10px;
  font-size: 20px;
  .sheet_button {
    margin-left: 20px;
    opacity: 0.5;
  }
  .selected.sheet_button {
    opacity: 1;
    border: 2px dotted;
  }
  span {
    font-size: 20px;
  }
`;

class OperationLogModal extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    this.state = {
      is_loaded: false,
      log_data: [],
      alarm_data: [],
      table_kind: this.props.is_alarm_data ? 1 : 0,
      isBackConfirmModal: false,
      confirm_message: "",
      confirm_alert_title:'',
    };
    this.change_flag = false;
  }

  async componentDidMount() {
    let patientInfo = sessApi.getObjectValue(
      CACHE_SESSIONNAMES.DIAL_BOARD,
      "patient"
    );
    let schedule_date = sessApi.getObjectValue(
      CACHE_SESSIONNAMES.DIAL_BOARD,
      "schedule_date"
    );
    let schedule_data = sessApi.getObjectValue(
      CACHE_SESSIONNAMES.DIAL_BOARD,
      "schedule_data"
    );
    let path = "/app/api/v2/dial/board/log_search";
    let post_data = {
      patient_id: patientInfo.patient_number,
      schedule_date,
      schedule_number: schedule_data.number,
    };
    await apiClient.post(path, { params: post_data }).then((res) => {
      this.setState({
        is_loaded: true,
        log_data: res.log_data,
        alarm_data: res.alarm_data,
      });
    });
  }
  switchType = (type) => {
    if (type === 0) {
      this.setState({
        table_kind: type,
      });
    } else {
      this.setState({
        table_kind: type,
      });
    }
  };

  saveLog = async () => {
    let patientInfo = sessApi.getObjectValue(
      CACHE_SESSIONNAMES.DIAL_BOARD,
      "patient"
    );
    let path = "/app/api/v2/dial/board/log_update";
    
    let post_data = {
      items:
        this.state.table_kind == 0
          ? this.state.log_data
          : this.state.alarm_data,
      kind: this.state.table_kind == 0 ? "operation" : "alarm",
      system_patient_id: patientInfo.system_patient_id,
    };
    await apiClient.post(path, { params: post_data });
    window.sessionStorage.setItem("alert_messages",  '変更完了##' + '変更しました。');
    this.props.closeModal();
    this.props.handleOk();
  }

  onHide = () => {};

  changeData = () => {
    this.change_flag = true;
    this.setState({change_flag: true});
  };

  confirmCancel() {
    this.setState({
      isBackConfirmModal: false,
      confirm_message: "",
      confirm_alert_title:'',
    });
  }
  closeModal = () => {
    if (this.change_flag) {
      this.setState({
        isBackConfirmModal: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_alert_title:'入力中'
      });
    } else {
      this.props.closeModal();
    }
  };
  closeConfirmModal = () => {
    this.confirmCancel();
    this.props.closeModal();
  };

  render() {
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        id="add_contact_dlg"
        className="master-modal log-modal"
      >
        <Modal.Header>
          <Modal.Title style={{ fontSize: "25px" }}>
            {this.state.table_kind === 0 ? "操作履歴" : "警報履歴"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Modal_Top>
            <Button
              onClick={this.switchType.bind(this, 0)}
              className={
                this.state.table_kind === 0
                  ? "selected sheet_button"
                  : "sheet_button"
              }
            >
              操作履歴
            </Button>
            <Button
              onClick={this.switchType.bind(this, 1)}
              className={
                this.state.table_kind === 1
                  ? "selected sheet_button"
                  : "sheet_button"
              }
            >
              警報履歴
            </Button>
          </Modal_Top>
          <Wrapper>
            {this.state.table_kind === 0 && (
              <OperationLogView
                is_loaded={this.state.is_loaded}
                list_item={this.state.log_data}
                changeData={this.changeData}
              />
            )}
            {this.state.table_kind === 1 && (
              <AlarmNotificationView
                is_loaded={this.state.is_loaded}
                list_item={this.state.alarm_data}
                changeData={this.changeData}
              />
            )}
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
          {this.state.change_flag ? (
            <Button className="red-btn" onClick={this.saveLog.bind(this)}>登録</Button>
          ):(
            <Button className="disable-btn">登録</Button>
          )}
        </Modal.Footer>
        {this.state.isBackConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.closeConfirmModal}
            confirmTitle={this.state.confirm_message}
            title = {this.state.confirm_alert_title}
          />
        )}
      </Modal>
    );
  }
}

OperationLogModal.contextType = Context;

OperationLogModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  is_alarm_data: PropTypes.bool,
};

export default OperationLogModal;
