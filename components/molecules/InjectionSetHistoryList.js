import React, { Component } from "react";
import PropTypes from "prop-types";
import InjectionSetHistoryUl from "./InjectionSetHistoryUl";
import Context from "~/helpers/configureStore";
import { formatDate } from "../../helpers/date";
import {KARTEMODE} from "~/helpers/constants"

class InjectionSetHistoryList extends Component {
  constructor(props) {
    super(props);
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.state = {
      isEdit: false,
      order: this.props.order,
      days: this.props.order.days,
      days_suffix: this.props.order.days_suffix,
      one_dose_package: this.props.order.one_dose_package,
      temporary_medication: this.props.order.temporary_medication,
      insurance_type: this.props.order.insurance_type,
      body_part: this.props.order.body_part,
      usage: this.props.order.usage,
      usage_name: this.props.order.usage_name,
      selectedDoctorID: this.props.doctor_code,
      selectedDoctorName: this.props.doctor_name,
      currentUserName: authInfo.name,
      staff_category: authInfo.staff_category || 2
    };
  }

  async componentDidMount() {}


  onDragStart = (e, order_number) => {
    if (this.context.$getKarteMode(this.props.patientId) == KARTEMODE.READ) {
      e.stopPropagation();
      return;
    }

    // get clipboard data
    let before_data = "";
    if (window.clipboardData) {
      before_data = window.clipboardData.getData ("Text");
    }

    e.dataTransfer.setData(
      "text",
      "injection_order:" + this.props.orderNumber + ":" + order_number
    );

    // set clipboardData
    if (window.clipboardData) {
      window.clipboardData.setData ("Text", before_data);
    }
    e.stopPropagation();
  };

  getInsurance = type => {
    let insurance = "既定";
    if (this.props.patientInfo && this.props.patientInfo.insurance_type_list) {
      this.props.patientInfo.insurance_type_list.map(item => {
        if (item.code === parseInt(type)) {
          insurance = item.name;
        }
      });
    }

    return insurance;
  };
  i = 0;
  render() {       
    const { order, mediInfo } = this.state;

    return (
      <div
        className={
          (this.props.is_enabled !== undefined && this.props.is_enabled === 2
            ? "history-item line-through "
            : "history-item ") +
          this.props.class_name +
          (order.isDoing === true ? " doing " : "")
        }
      >
        <div
          className="box w70p"
          draggable={
            this.props.is_enabled !== undefined && this.props.is_enabled === 2
              ? false
              : true
          }
          onDragStart={e => this.onDragStart(e, this.props.orderIndex)}
        >
          {order.med.map((medi, index) => {
            this.i += 1;
            return (
              <InjectionSetHistoryUl
                key={this.i}
                medi={medi}
                units={mediInfo}
                serial_number={index + 1}
                orderIndex={this.props.orderIndex+1}
              />
            );
          })}
          <div className="flex between drug-item table-row">
            <div className="text-right">
              <div className="table-item">
                {!order.usage_name ? "" : `手技: ${order.usage_name}`}
              </div>
              {order.usage_remarks_comment ? (
                <div className="table-item remarks-comment">
                  {order.usage_remarks_comment.map((comment, ci) => {
                    return <p key={ci}>{comment}</p>;
                  })}
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="w80 table-item">
              {order.days !== 0 && order.days !== undefined
                ? order.days +
                  (order.days_suffix !== undefined && order.days_suffix !== ""
                    ? order.days_suffix
                    : "日分")
                : ""}
            </div>
          </div>
          {order.insurance_type !== undefined && (
            <div className="flex between option table-row">
              <div className="text-right table-item">
                {`保険: ${this.getInsurance(order.insurance_type)}`}
              </div>
            </div>
          )}
          {order.body_part !== undefined && order.body_part !== "" && (
            <div className="flex between option table-row">
              <div className="text-right table-item">
                {`部位/補足: ${order.body_part}`}
              </div>
            </div>
          )}
          {order.discontinuation_start_date !== undefined &&
            order.discontinuation_start_date !== "" && (
              <div className="flex between option table-row">
                <div className="text-right table-item">
                  {`中止期間の最初日: ${formatDate(
                    order.discontinuation_start_date
                  )}`}
                </div>
              </div>
            )}
          {order.discontinuation_end_date !== undefined &&
            order.discontinuation_end_date !== "" && (
              <div className="flex between option table-row">
                <div className="text-right table-item">
                  {`中止期間の最後日: ${formatDate(
                    order.discontinuation_end_date
                  )}`}
                </div>
              </div>
            )}
          {order.discontinuation_comment !== undefined &&
            order.discontinuation_comment !== "" && (
              <div className="flex between option table-row">
                <div className="text-right table-item">
                  {`中止コメント: ${order.discontinuation_comment}`}
                </div>
              </div>
            )}
        </div>
      </div>
    );
  }
}
InjectionSetHistoryList.contextType = Context;

InjectionSetHistoryList.propTypes = {
  order: PropTypes.object,
  orderIndex: PropTypes.number,
  class_name: PropTypes.string,
  doctor_code: PropTypes.number,
  doctor_name: PropTypes.string,
  setDoctorInfo: PropTypes.func,
  patientInfo: PropTypes.array,
  orderNumber: PropTypes.number,
  is_enabled: PropTypes.number,
  patientId: PropTypes.number,
};

export default InjectionSetHistoryList;
