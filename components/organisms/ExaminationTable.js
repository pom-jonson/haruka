import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import * as colors from "../_nano/colors";
import Context from "~/helpers/configureStore";
import ExamHistoryList from "../molecules/ExamHistoryList";
import ListItem from "./ExamListItem";

const MedicineSelectionWrapper = styled.div`
  width: 100%;
  // height: 100%;
  // max-height: 650px;
  background-color: #ffffff;
  border: 1px solid ${colors.disable};
  border-top: none;
  overflow-y: auto;
  -ms-overflow-style: none;
`;

const HistoryListDiv = styled.div`
  width: 100%;
  .line-through {
    color: #ff0000;
  }
`;
const MedicineListWrapper = styled.div`
  width:100%;
  font-size: 12px;
  p {
    margin-bottom: 0;
  }
  .row {
    border-top: 1px solid ${colors.disable};
    margin: 0;
  }

  .department {
    width: 15%;
  }

  .patient-name {
    margin: auto;
  }

  .name-label {
    width: 35%;
    p {
      display: inline-block;
      margin-left: 8px;
    }
  }

  .history-item {
    &:first-child {
      .box {
        border-top: none;
      }
    }
    &:after {
      content: "";
      display: block;
      clear: both;
    }
  }

  .box {
    border-top: 1px solid ${colors.disable};
    border-right: 1px solid ${colors.disable};
    float: left;
    line-height: 1.3;
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
  }

  .table-row {
    border-bottom: 1px solid ${colors.disable};
    line-height: 1.3;
    padding: 4px;
    &:nth-child(2n) {
      background-color: ${colors.secondary200};
    }
    &:last-child {
      border-bottom: none;
    }
  }

  .number {
    margin-right: 8px;
    width: 75px;
  }

  .remarks-comment {
    margin-left: auto;
    width: calc(100% - 80px);
    word-wrap: break-word;
  }

  .text-right {
    width: calc(100% - 88px);
  }

  .w80 {
    text-align: right;
    width: 80px;
    margin-left: 8px;
  }

  .w70p {
    width: 70%;
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

  .patient-info {
    color: #000;
  }

  .w30p {
    width: 30%;
  }

  .patient-info-header {
    background-color: #fbeaea;
    padding-left: 16px;
  }

  .patientinfo-item {
    border-bottom: 1px solid ${colors.disable};
    line-height: 1.3;
    padding: 4px;
  }
  .exam-order {
        margin-left: 75px;
      }

  .detail-item {
    display: inline-block;
    width: 50%;
    &:nth-of-type(2) {
      width: 100%;
    }
    &:nth-of-type(3) {
      border-right: 1px solid ${colors.disable};
    }
  }

  .draggable {
    border-right: solid 1px ${colors.disable};
  }

  .order-copy {
    background-color: transparent;
    border: 1px solid #ced4da;
    padding: 0 4px;
    min-width: auto;
    span {
      color: ${colors.midEmphasis};
      font-weight: normal;
      letter-spacing: 0;
    }
  }

  .hidden {
    display: none;
  }
`;

class BaseExaminationTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prescriptionsData: [
        {
          number: 1,
          prescriptionNumber: " 9999999",
          systemprescriptionId: 1,
          name: "テスト　患者３１７ ",
          age: 73,
          sex: 1,
          inOut: 0,
          department: "内科",
          accepted_time: "00:31:06",
          diagnosis_type: 1,
          diagnosis_type_name: "診察",
          registration_type: 0,
          registration_type_name: "再来",
          mainDoctor: "",
          mainNurse: ""
        }
      ],
      medicineHistory: this.props.prescriptionsList,
      openPatientId: -1,
      openPatientInfo: null
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      medicineHistory: nextProps.prescriptionsList
    });
  }

  getRandomKey = () => {
    const l = 10;
    const c = "abcdefghijklmnopqrstuvwxyz0123456789";
    const cl = c.length;
    let r = "";
    for (var i = 0; i < l; i++) {
      r += c[Math.floor(Math.random() * cl)];
    }
    return r;
  };

  onAngleClicked(e, number) {
    if (e.type == 'click') {
      let history = this.state.medicineHistory.map(function(item) {
        if (item.prescription.number === number) {
          item.prescription.order_data.class_name =
            item.prescription.order_data.class_name === "open" ? "" : "open";
        }
        return item;
      });

      this.setState({
        medicineHistory: history
      });
    }
  }
  onMedicineClicked() {}

  render() {
    let medicineHistoryList = this.state.medicineHistory.map(
      (medicine, orderIndex) => {
        return (
          <div key={orderIndex} style={{width:"100%"}}>
            <ListItem
              department={medicine.prescription.order_data.department}
              ya
              doctor_name={medicine.prescription.order_data.doctor_name}
              class_name={medicine.prescription.order_data.class_name}
              substitute_name={medicine.prescription.order_data.substitute_name}
              diagnosing_date={
                medicine.prescription.order_data.executed_date_time
                  ? medicine.prescription.order_data.executed_date_time
                  : ""
              }
              is_internal_prescription={
                medicine.prescription.order_data.is_internal_prescription
              }
              onAngleClicked={this.onAngleClicked.bind(this)}
              number={medicine.prescription.number}
              isEdit={false}
              is_doctor_consented={medicine.prescription.is_doctor_consented}
              is_enabled={
                medicine.prescription.is_enabled !== undefined
                  ? medicine.prescription.is_enabled
                  : 1
              }
              isNotConsentedPopup={false}
              orderNumber={medicine.prescription.number}
              getOrderNumberList={this.getOrderNumberList}
              patientName={medicine.patient.name}
              patientNumber={medicine.patient.patientNumber}
              receiverName={medicine.prescription.receiver_key_name}
              isFromPrescriptionList={true}
              done_order={medicine.prescription.done_order}
            />
            <HistoryListDiv>
              <ExamHistoryList
                key={this.getRandomKey()}
                orderNumber={medicine.prescription.number}
                patientId="169"
                order_data={medicine.prescription.order_data}
                order={medicine.prescription.order_data.order_data}
                orderIndex={orderIndex}
                // serial_number={index + 1}
                onCopyOrder={null}
                onCopyOrders={null}
                onEditOrders={null}
                doctors={null}
                doctor_code={medicine.prescription.order_data.doctor_name}
                doctor_name={medicine.prescription.order_data.doctor_name}
                setDoctorInfo={null}
                patientInfo={null}
                class_name={
                  medicine.prescription.order_data.class_name === "open"
                    ? ""
                    : "hidden"
                }
                is_doctor_consented={false}
                is_enabled={
                  medicine.prescription.is_enabled !== undefined
                    ? medicine.prescription.is_enabled
                    : 1
                }
                openNotConsentedModal={false}
                isNotConsentedPopup={false}
                isNotConsentedDataLength={0}
                forNotConsentedCheckDoctorCode={
                  medicine.prescription.order_data.doctor_code
                }
                consent={null}
                isPatientInfo={true}
                patientInfoObject={medicine.patient}
                done_order={medicine.prescription.done_order}
                searchPrescriptionList = {this.props.searchPrescriptionList}
              />
            </HistoryListDiv>
          </div>
        );
      }
    );

    return (
      <MedicineSelectionWrapper>
        <MedicineListWrapper>{medicineHistoryList}</MedicineListWrapper>
      </MedicineSelectionWrapper>
    );
  }
}

BaseExaminationTable.contextType = Context;
BaseExaminationTable.propTypes = {
  prescriptionsList: PropTypes.array,
  searchPrescriptionList:PropTypes.func
};
class ExaminationTable extends BaseExaminationTable{
  constructor(props){
    super(props);
  }
  closeModal(){
    this.setState({openPatientId: -1, openPatientInfo: null});
  }

  onMedicineClicked(e, number){
    if(e.nativeEvent.which == 3){
      let patientId = this.state.medicineHistory[number].prescription.patient_id;
      let patientInfo = this.state.medicineHistory[number].patient;
      this.setState({openPatientId: patientId, openPatientInfo: patientInfo});
    }

    e.preventDefault();
  }
}


export default ExaminationTable;
