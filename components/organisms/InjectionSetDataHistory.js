import React, { Component } from "react";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import PropTypes from "prop-types";
import InjectionSetDataHistoryList from "../molecules/InjectionSetDataHistoryList";
import SetListItem from "./SetListItem";
import $ from "jquery";
import Context from "~/helpers/configureStore";
import { getRandomKey } from "../../helpers/random";

const InjectionSelectionWrapper = styled.div`
  font-family: "Noto Sans JP", sans-serif;
  width: 100%;
  height: 100%;
  max-height: calc(100vh - 220px);
  background-color: #ffffff;
  border: 1px solid ${colors.disable};
  border-top: none;
  overflow-y: auto;
`;

const InjectionListWrapper = styled.div`
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
    width: 75px;
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
  let inject_consult = "";
  let supply_inject_info = "";
  if (!Array.isArray(order_json.params.injection.order_data)) {
    order_data = Object.values(
      order_json.params.injection.order_data.order_data
    );    
  }
  let is_enabled = 0;
  let class_name =
    order_json.params.injection.class_name === "open" ? "" : "hidden";

  const data = order_data.map(function(order, index) {
    return (
      <InjectionSetDataHistoryList
        key={getRandomKey()}
        orderNumber={order_json.params.injection.preset_number}
        order_data={order_json.params.injection.order_data}
        order={order}
        order_dataIndex = {order_json.params.orderIndex}
        orderIndex={index}
        doctor_code={order_json.params.parent.props.doctor_code}
        doctor_name={order_json.params.parent.props.doctor_name}
        setDoctorInfo={order_json.params.parent.props.setDoctorInfo}
        class_name={class_name}
        patientInfo={order_json.params.parent.props.patientInfo}
        onCopyOrder={order_json.params.parent.onCopyOrder}
        onCopyOrders={order_json.params.parent.onCopyOrders}
        onEditOrders={order_json.params.parent.onEditOrders}
        onDeleteOrders={order_json.params.parent.onDeleteOrders}
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
          {inject_consult !== "" && (
            <div className="flex between option table-row">
              <div className="text-right table-item">{inject_consult}</div>
            </div>
          )}
          {supply_inject_info !== "" && (
            <div className="flex between option table-row">
              <div className="text-right table-item">{supply_inject_info}</div>
            </div>
          )}
          {order_json.params.injection.order_data
            .psychotropic_drugs_much_reason !== undefined &&
            order_json.params.injection.order_data
              .psychotropic_drugs_much_reason !== "" && (
              <div className="flex between option table-row">
                <div className="text-right table-item">
                  {`向精神薬多剤投与理由: ${
                    order_json.params.injection.order_data
                      .psychotropic_drugs_much_reason
                  }`}
                </div>
              </div>
            )}
          {order_json.params.injection.order_data.poultice_many_reason !==
            undefined &&
            order_json.params.injection.order_data.poultice_many_reason !==
              "" && (
              <div className="flex between option table-row">
                <div className="text-right table-item">
                  {`湿布薬超過投与理由: ${
                    order_json.params.injection.order_data.poultice_many_reason
                  }`}
                </div>
              </div>
            )}
        </div>
      </div>
    </>
  );
}

class InjectionSetDataHistory extends Component {
  state = {
    injectionHistory: this.props.injectionHistory,
    allPrescriptionOpen: null,
    order: [],
    modalVisible: false,
    selectedOrderNumber: 0
  };
  constructor(props) {
    super(props);
  }

  injectionData = [];

  isMounted = false;

  async UNSAFE_componentWillMount(){
    this.state.injectionHistory.map(item => {
      item.class_name = "";
    });
  }

  async componentDidMount() {
    this.isMounted = true;
    document
      .getElementById("injection_set_selection_wrapper")
      .addEventListener("scroll", this.handleScroll);
    
    const scrollTop = window.localStorage.getItem("injection_set_selection_wrapper_scroll", 0);

    $("#injection_set_selection_wrapper").scrollTop(scrollTop);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.allPrescriptionOpen != prevState.allPrescriptionOpen) {
      this.state.injectionHistory.map(item => {
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
    let history = this.state.injectionHistory.map(function(item) {
      if (item.preset_number === number) {
        item.class_name =
          item.class_name === "open" ? "" : "open";
      }
      return item;
    });

    this.setState({
      injectionHistory: history
    });
  }

  onCopyOrder = order => {
    if (this.props.copyOrder(order) === false) {
      alert("このRpは薬品が重複されているので追加できません。");
    }
  };

  onCopyOrders = index => {
    this.props.copyOrders(this.state.injectionHistory[index]);
  };

  onEditOrders = index => {    
    this.props.editOrders(this.state.injectionHistory[index]);
  };

  onDeleteOrders = index => {        
    this.props.deleteOrders(this.state.injectionHistory[index]);
  };  

  onDragStart = (e, number) => {
    e.dataTransfer.setData("text", "injection_set:" + number);
  };

  handleScroll = async () => {
    window.localStorage.setItem("injection_set_selection_wrapper_scroll", $("#injection_set_selection_wrapper").scrollTop());
  };

  render() {
    let injectionHistoryList = this.props.injectionHistory.map(
      (injection, orderIndex) => {
        return (
          <div
            key={orderIndex}
            className="draggable"
            draggable={true}
            onDragStart={e => this.onDragStart(e, injection.preset_number)}
          >
            <SetListItem
              class_name={injection.class_name}
              onAngleClicked={this.onAngleClicked.bind(this)}
              preset_name={injection.preset_name}
              number={injection.preset_number}
            />
            {injection.class_name === "open" && (
              <>
                <CheckArrayList
                  params={{
                    injection: injection,
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
      <InjectionSelectionWrapper id="injection_set_selection_wrapper">
        <InjectionListWrapper id="injection_set_history_wrapper">
          {injectionHistoryList}
        </InjectionListWrapper>
      </InjectionSelectionWrapper>
    );
  }
}
InjectionSetDataHistory.contextType = Context;
InjectionSetDataHistory.defaultProps = {
  allPrescriptionOpen: null
};

InjectionSetDataHistory.propTypes = {
  copyOrder: PropTypes.func,
  copyOrders: PropTypes.func,
  editOrders: PropTypes.func,
  deleteOrders: PropTypes.func,
  allPrescriptionOpen: PropTypes.boolean,
  doctors: PropTypes.array,
  doctor_code: PropTypes.number,
  doctor_name: PropTypes.string,
  setDoctorInfo: PropTypes.func,
  injectionHistory: PropTypes.array,
  match: PropTypes.object
};

export default InjectionSetDataHistory;
