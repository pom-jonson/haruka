import React, { Component } from "react";
import PropTypes from "prop-types";
import SetHistoryUl from "./SetHistoryUl";
import Context from "~/helpers/configureStore";
import SameOptionsNew from "./SameOptionsNew";
import { formatDate } from "../../helpers/date";
import {KARTEMODE} from "~/helpers/constants"
import {formatJapanDateSlash} from "~/helpers/date";

class SetHistoryList extends Component {
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

  getCheckSameOptions = () => {
    let med = this.props.order.med[0];
    let keys = Object.keys(med);
    let equalKeys = [];
    const allEqual = arr => arr.every(v => v === arr[0]);
    keys.map(key => {
      let value = [];
      this.props.order.med.map(medi => {
        value.push(medi[key]);
      });
      if (allEqual(value)) {
        equalKeys.push(key);
      }
    });
    return equalKeys;
  };

  getSameOptions = aa => {
    let values = [];
    if (aa !== undefined) {
      aa.map(key => {
        let value = {};

        value[key] = this.props.order.med[0][key];
        values.push(value);
      });
    }
    let value = {};
    value["one_dose_package"] = this.props.order["one_dose_package"];
    values.push(value);
    value = {};
    value["temporary_medication"] = this.props.order["temporary_medication"];
    values.push(value);
    value = {};
    value["mixture"] = this.props.order["mixture"];
    values.push(value);
    return values;
  };

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
      "preset_order:" + this.props.orderNumber + ":" + order_number
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
    const keyName = {
      can_generic_name: "一般名処方",
      is_not_generic: "後発不可",
      milling: "粉砕",
      // free_comment: "備考",
      separate_packaging: "別包",
      one_dose_package: "一包化",
      temporary_medication: "臨時処方",
      mixture: "混合"
    };

    let sameKeys = this.getCheckSameOptions();
    const sameOptions = this.getSameOptions(sameKeys);
    let sameOptionsView;
    if (sameOptions !== undefined && sameOptions.length > 0) {
      sameOptionsView = (
        <SameOptionsNew sameOptions={sameOptions} keyNames={keyName} />
      );
    }

    return (
      <div
        className={
          "history-item " +
          this.props.class_name +
          (order.isDoing === true ? " doing " : "")
        }
      >
        <div
          className="box w70p"
          draggable={true}
          onDragStart={e => this.onDragStart(e, this.props.orderIndex)}
        >
          {order.med.map((medi, index) => {
            this.i += 1;
            return (
              <SetHistoryUl
                key={this.i}
                medi={medi}
                sameKeys={sameKeys}
                keyNames={keyName}
                units={mediInfo}
                serial_number={index + 1}
                orderIndex={this.props.orderIndex+1}
              />
            );
          })}
          <div className="flex between drug-item table-row">
            <div className="text-right">
              <div className="table-item">
                {!order.usage_name ? "" : `用法: ${order.usage_name}`}
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
          {order.start_date && (
            <div className="flex between option table-row">
              <div className="text-right table-item padleft70">
                <label>処方開始日: </label>
                <label>{formatJapanDateSlash(formatDate(order.start_date))}</label>
              </div>
            </div>
          )}
          {order.insurance_type !== undefined && (
            <div className="flex between option table-row">
              <div className="text-right table-item padleft70">
                <label>保険: </label>
                <label>{this.getInsurance(order.insurance_type)}</label>
              </div>
            </div>
          )}
          {order.body_part !== undefined && order.body_part !== "" && (
            <div className="flex between option table-row">
              <div className="text-right table-item padleft70">
                <label>部位/補足: </label>
                <label>{order.body_part}</label>
              </div>
            </div>
          )}
          {order.discontinuation_start_date !== undefined &&
            order.discontinuation_start_date !== "" && (
              <div className="flex between option table-row">
                <div className="text-right table-item padleft70">
                  <label>中止期間の最初日: </label>
                  <label>{formatDate(order.discontinuation_start_date)}</label>
                </div>
              </div>
            )}
          {order.discontinuation_end_date !== undefined &&
            order.discontinuation_end_date !== "" && (
              <div className="flex between option table-row">
                <div className="text-right table-item padleft70">
                  <label>中止期間の最後日: </label>
                  <label>{formatDate(order.discontinuation_end_date)}</label>
                </div>
              </div>
            )}
          {order.discontinuation_comment !== undefined &&
            order.discontinuation_comment !== "" && (
              <div className="flex between option table-row">
                <div className="text-right table-item padleft70">
                  <label>中止コメント: </label>
                  <label>{order.discontinuation_comment}</label>                  
                </div>
              </div>
            )}
          {sameOptionsView}
        </div>
      </div>
    );
  }
}
SetHistoryList.contextType = Context;

SetHistoryList.propTypes = {
  order: PropTypes.object,
  orderIndex: PropTypes.number,
  class_name: PropTypes.string,
  doctor_code: PropTypes.number,
  doctor_name: PropTypes.string,
  setDoctorInfo: PropTypes.func,
  patientInfo: PropTypes.array,
  orderNumber: PropTypes.number,
  patientId: PropTypes.number
};

export default SetHistoryList;
