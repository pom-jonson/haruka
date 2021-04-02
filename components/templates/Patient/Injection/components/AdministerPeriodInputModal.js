import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
// import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
// import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
// import RadioGroupButton from "~/components/molecules/RadioGroup";
// import InputWithLabel from "~/components/molecules/InputWithLabel";
// import * as apiClient from "~/api/apiClient";
// import {formatDateLine, formatTimeIE} from "~/helpers/date";
// import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
// import Radiobox from "~/components/molecules/Radiobox";
// import DatePicker, { registerLocale } from "react-datepicker";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
// import SelectDoctorModal from "~/components/templates/Patient/components/SelectDoctorModal";
// import MonthCalendar from "./MonthCalendar";
// import axios from "axios/index";
// import SystemAlertModal from "~/components/molecules/SystemAlertModal";
// import GroupScheduleRegisterConfirmModal from "./GroupScheduleRegisterConfirmModal";
// import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
// import Spinner from "react-bootstrap/Spinner";
// import * as sessApi from "~/helpers/cacheSession-utils";

const Wrapper = styled.div`  
    width: 100%;
    height: 100%;
    font-size: 1rem;
    overflow-y:auto;
    .flex{
        display: flex;
    }
    
`;

// const week_days = ["日", "月", "火", "水", "木", "金", "土"];

class AdministerPeriodInputModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  async componentDidMount() {    
  }

  

  render() {
    return (
      <>
        <Modal show={true} className="custom-modal-sm patient-exam-modal treatment_group_modal first-view-modal">
          <Modal.Header>
            <Modal.Title>投与期間入力</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className="flex">
                <div>
                  <div>投与開始日</div>
                </div>
                <div>
                  <div>投与終了日</div>
                </div>
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <div
              onClick={this.confirmClose}
              className={"custom-modal-btn cancel-btn"}
              style={{cursor:"pointer"}}
              id='cancel_btn'
            >
              <span>キャンセル</span>
            </div>
            <div
              onClick={this.openConfirmModal.bind(this, 'all_save')}
              className={"custom-modal-btn red-btn"}
              style={{cursor:"pointer"}}
            >
              <span>確定</span>
            </div>
          </Modal.Footer>
          {/* {this.state.confirm_message !== "" && this.state.confirm_type !== "" && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.confirmOk.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.complete_message !== '' && (
            <CompleteStatusModal
              message = {this.state.complete_message}
            />
          )}
          {this.doctors != null && this.state.openSelectDoctorModal && (
            <SelectDoctorModal
              closeDoctor={this.closeModal}
              getDoctor={this.getDoctor}
              selectDoctorFromModal={this.selectDoctorFromModal}
              doctors={this.doctors}
            />
          )}
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}         
          {this.state.isCloseConfirm && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.props.closeModal}
              confirmTitle={this.state.confirm_message}
            />
          )} */}
        </Modal>
      </>
    );
  }
}

AdministerPeriodInputModal.contextType = Context;
AdministerPeriodInputModal.propTypes = {
  closeModal: PropTypes.func,
};

export default AdministerPeriodInputModal;
