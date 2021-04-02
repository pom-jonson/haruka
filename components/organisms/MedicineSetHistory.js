import React, { Component } from "react";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import PropTypes from "prop-types";
import SetHistoryList from "../molecules/SetHistoryList";
import SetListItem from "../organisms/SetListItem";
import $ from "jquery";
import Context from "~/helpers/configureStore";
import { getRandomKey } from "../../helpers/random";
import {KARTEMODE} from "~/helpers/constants"

const MedicineSelectionWrapper = styled.div`
  font-family: "Noto Sans JP", sans-serif;
  width: 100%;
  height: 100%;
  max-height: calc(100vh - 220px);
  background-color: #ffffff;
  border: 1px solid ${colors.disable};
  border-top: none;
  overflow-y: scroll;
`;

const MedicineListWrapper = styled.div`
  font-size: 12px;

  .row {
    margin: 0;
    &:first-child {
      border-top: 1px solid ${colors.disable};
    }
  }

  .box {
    line-height: 1.3;
    position: relative;
    &:before {
      content: "";
      background-color: ${colors.disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 60px;
    }
    &:after {
      content: "";
      background-color: ${colors.disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      right: 70px;
    }

    .table-row {
      &:nth-child(2n) {
        background-color: ${colors.secondary200};
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
    margin-left: 16px;
  }

  .drug-item {
    border-bottom: 1px solid ${colors.disable};
    padding: 4px;
  }

  .number {
    margin-right: 8px;
    width: 55px;
  }

  .w80 {
    text-align: right;
    width: 80px;
    margin-left: 8px;
  }

  .option {
    border-bottom: 1px solid ${colors.disable};
    padding: 4px;
  }

  .text-right {
    width: calc(100% - 70px);
    .table-item{
      padding-left:70px;
    }
  }
  .ml{
    margin-left:17px;
    width: calc(100% - 70px);
  }
  .padleft70{
    padding-left:70px;
  }

  .remarks-comment {
    margin-left: auto;
    width: calc(100% - 70px);
    word-wrap: break-word;
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

function CheckArrayList(order_json) {
  let order_data = [];
  let med_consult = "";
  let supply_med_info = "";
  let potion_info = "";
  if (order_json.params.medicine.order_data) {
    order_data = Object.values(
      order_json.params.medicine.order_data.order_data
    );
    if (
      order_json.params.medicine.order_data.med_consult !== undefined &&
      order_json.params.medicine.order_data.med_consult === 1
    ) {
      med_consult = "【お薬相談希望あり】";
    }
    if (
      order_json.params.medicine.order_data.supply_med_info !== undefined &&
      order_json.params.medicine.order_data.supply_med_info === 1
    ) {
      supply_med_info = "【薬剤情報提供あり】";
    }
    if (
      order_json.params.medicine.order_data.potion !== undefined && 
      order_json.params.medicine.order_data.is_internal_prescription == 5 && 
      (order_json.params.medicine.order_data.potion === 0 || order_json.params.medicine.order_data.potion === 1)
    ) {
      potion_info = order_json.params.medicine.order_data.potion ? "持参薬（自院）" : "持参薬（他院）";
    }
  }
  let is_enabled = 0;
  let class_name =
    order_json.params.medicine.class_name === "open" ? "" : "hidden";
  let free_comment =
    order_json.params.medicine.free_comment !== undefined
      ? Array.isArray(order_json.params.medicine.free_comment)
        ? order_json.params.medicine.free_comment.join("、")
        : order_json.params.medicine.free_comment
      : "";

  const data = order_data.map(function(order, index) {
    return (
      <SetHistoryList
        key={getRandomKey()}
        orderNumber={order_json.params.medicine.preset_number}
        patientId={order_json.params.parent.props.patientId}
        order_data={order_json.params.medicine.order_data}
        order={order}
        orderIndex={index}
        doctor_code={order_json.params.parent.props.doctor_code}
        doctor_name={order_json.params.parent.props.doctor_name}
        setDoctorInfo={order_json.params.parent.props.setDoctorInfo}
        class_name={class_name}
        patientInfo={order_json.params.parent.props.patientInfo}
      />
    );
  });
  return (
    <>
      {data}
      <div
        className={
          (is_enabled !== undefined && is_enabled === 2
            ? "history-item line-through "
            : "history-item ") + class_name
        }
      >
        <div className="box w70p float-left-prescription">
          {med_consult !== "" && (
            <div className="flex between option table-row">
              <div className="text-right table-item">{med_consult}</div>
            </div>
          )}
          {supply_med_info !== "" && (
            <div className="flex between option table-row">
              <div className="text-right table-item">{supply_med_info}</div>
            </div>
          )}
          {potion_info !== "" && (
            <div className="flex between option table-row">
              <div className="text-right table-item">{potion_info}</div>
            </div>
          )}
          {order_json.params.medicine.order_data
            .psychotropic_drugs_much_reason !== undefined &&
            order_json.params.medicine.order_data
              .psychotropic_drugs_much_reason !== "" && (
              <div className="flex between option table-row">
                <div className="text-right table-item padleft70">
                  <label>向精神薬多剤投与理由: </label>
                  <label>{order_json.params.medicine.order_data.psychotropic_drugs_much_reason}</label>                  
                </div>
              </div>
            )}
          {order_json.params.medicine.order_data.poultice_many_reason !==
            undefined &&
            order_json.params.medicine.order_data.poultice_many_reason !==
              "" && (
              <div className="flex between option table-row">
                <div className="text-right table-item padleft70">
                  <label>湿布薬超過投与理由: </label>
                  <label>{order_json.params.medicine.order_data.poultice_many_reason}</label>
                </div>
              </div>
            )}
          {free_comment !== "" && (
            <div className="flex between option table-row">
              <div className="text-right table-item padleft70">
                <label>備考: </label>
                <label>{free_comment}</label>                
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

class MedicineSetHistory extends Component {
  state = {
    medicineHistory: this.props.medicineHistory,
    allPrescriptionOpen: null,
    order: [],
    modalVisible: false,
    selectedOrderNumber: 0
  };
  constructor(props) {
    super(props);
  }

  medicineData = [];

  isMounted = false;

  async UNSAFE_componentWillMount(){
    this.state.medicineHistory.map(item => {
      item.class_name = "";
    });
  }  

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ medicineHistory: nextProps.medicineHistory });
  }

  async componentDidMount() {
    this.isMounted = true;
    document
      .getElementById("medicine_set_selection_wrapper")
      .addEventListener("scroll", this.handleScroll);
    
    const scrollTop = window.localStorage.getItem("medicine_set_selection_wrapper_scroll", 0);

    $("#medicine_set_selection_wrapper").scrollTop(scrollTop);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.allPrescriptionOpen != prevState.allPrescriptionOpen) {
      this.state.medicineHistory.map(item => {
        if (this.props.allPrescriptionOpen !== undefined) {
          if (this.props.allPrescriptionOpen == true) {
            item.class_name = "";
          } else if (this.props.allPrescriptionOpen == false) {
            item.class_name = "open";
          }
        }
      });
    }
  }

  onAngleClicked(e, number) {
    e.stopPropagation();
    e.preventDefault();
    let history = this.state.medicineHistory.map(function(item) {
      if (item.preset_number === number) {
        item.class_name =
          item.class_name === "open" ? "" : "open";
      }
      return item;
    });

    this.setState({
      medicineHistory: history
    });
  }

  onDragStart = (e, number) => {
    if (this.context.$getKarteMode(this.props.patientId) == KARTEMODE.READ) {
      e.stopPropagation();
      return;
    }

    e.dataTransfer.setData("text", "preset_prescription:" + number);
  };

  handleScroll = async () => {
    window.localStorage.setItem("medicine_set_selection_wrapper_scroll", $("#medicine_set_selection_wrapper").scrollTop());
  };

  presetRefresh = () => {
    this.props.presetRefresh();
  }

  render() {
    // const keyName = {
    //   can_generic_name: "一般名処方",
    //   is_not_generic: "後発不可",
    //   milling: "粉砕",
    //   free_comment: "備考",
    //   separate_packaging: "別包",
    //   one_dose_package: "全て一包化",
    //   temporary_medication: "全て臨時処方"
    // };

    let medicineHistoryList = this.state.medicineHistory.map(
      (medicine, orderIndex) => {
        return (
          <div
            key={orderIndex}
            className="draggable"
            draggable={true}
            onDragStart={e => this.onDragStart(e, medicine.preset_number)}
          >
            <SetListItem
              class_name={medicine.class_name}
              onAngleClicked={this.onAngleClicked.bind(this)}
              preset_name={medicine.preset_name}
              number={medicine.preset_number}
              patientId={medicine.system_patient_id}
              presetRefresh={this.presetRefresh}
            />
            {medicine.class_name === "open" && (
              <>
                <CheckArrayList
                  params={{
                    medicine: medicine,
                    orderIndex: orderIndex,
                    parent: this
                  }}
                />
              </>
            )}
          </div>
        );
      }
    );

    return (
      <MedicineSelectionWrapper id="medicine_set_selection_wrapper">
        <MedicineListWrapper id="medicine_set_history_wrapper">
          {medicineHistoryList}
        </MedicineListWrapper>
      </MedicineSelectionWrapper>
    );
  }
}
MedicineSetHistory.contextType = Context;
MedicineSetHistory.defaultProps = {
  allPrescriptionOpen: null
};

MedicineSetHistory.propTypes = {
  patientId: PropTypes.number,
  allPrescriptionOpen: PropTypes.boolean,
  doctors: PropTypes.array,
  doctor_code: PropTypes.number,
  doctor_name: PropTypes.string,
  setDoctorInfo: PropTypes.func,
  presetRefresh: PropTypes.func,
  medicineHistory: PropTypes.array,
  match: PropTypes.object
};

export default MedicineSetHistory;
