import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const textAlignRight = {
  textAlign: "right"
};

const underLine = {
  textDecorationLine: "underline"
};

const DrugItem = styled.div`
  .full-width {
    width: 100%;
  }
  .option {
    text-align: right;
  }
  .options {
    float: right;
  }
`;

class SetHistoryUl extends Component {
  state = {
    unit: this.props.medi.unit,
    is_not_generic: this.props.medi.is_not_generic,
    can_generic_name: this.props.medi.can_generic_name,
    amount: this.props.medi.amount,
    separate_packaging: this.props.medi.separate_packaging,
    milling: this.props.medi.milling,
    usage_comment: this.props.medi.usage_comment,
    poultice_one_day: this.props.medi.poultice_one_day,
    poultice_days: this.props.medi.poultice_days,
    free_comment: this.props.medi.free_comment,
    item_name: this.props.medi.item_name,
    medicineData: [],
    delete_flag: 1,
    allOptions: [
      "milling",
      "can_generic_name",
      "is_not_generic",
      "one_dose_package",
      "temprary_dedicine",
      "insurance_type",
      "separate_packaging"
    ]
  };

  timer = "";

  getUnevenValues = (values, unit) => {
    let unevenValues = [];
    values.map(splitNum => {
      if (splitNum.value !== undefined) {
        unevenValues.push(splitNum.label + " " + splitNum.value + unit);
      }
    });
    return unevenValues.join(",");
  };

  render() {
    const { medi, serial_number, sameKeys, keyNames, orderIndex } = this.props;
    return (
      <DrugItem className="drug-item table-row">
        <div className="flex between">
          <div className="flex full-width table-item">
            <div className="number" style={underLine}>
              {serial_number !== 1 ? "" : " Rp" + orderIndex}
            </div>

            <div className="ml-3 full-width mr-2 ml">
              {medi.item_name}
              {(medi.amount > 0 &&
                medi.uneven_values !== undefined &&
                medi.uneven_values.length > 0) && (
                  <p style={textAlignRight}>
                    {this.getUnevenValues(medi.uneven_values, medi.unit)}
                  </p>
                )}
              {medi.free_comment
                ? medi.free_comment.map(comment => {
                    return (
                      <p key={comment.id} style={textAlignRight}>
                        {comment}
                      </p>
                    );
                  })
                : ""}
              <div className="options flex">
                {this.state.allOptions.map(option => {
                  if (sameKeys.indexOf(option) == -1) {                    
                    if (
                      keyNames[option] &&
                      medi[option] !== "" &&
                      medi[option] !== undefined &&
                      medi[option] !== 0 &&
                      medi[option] !== "0" &&
                      medi[option][0] !== ""
                    ) {
                      return (
                        <div className={option} key={option} style={underLine}>
                          【{keyNames[option]}】&nbsp;
                          {medi[option] !== 1 && medi[option] !== "1" ? (
                            <span>:{medi[option]}</span>
                          ) : (
                            ""
                          )}
                        </div>
                      );
                    }
                  }
                })}
              </div>
            </div>
          </div>
          <div className="w80 table-item" style={textAlignRight}>
            {" "}
            {medi.amount}
            {medi.unit}
          </div>
        </div>
      </DrugItem>
    );
  }
}

SetHistoryUl.propTypes = {
  medi: PropTypes.object,
  putMedicine: PropTypes.func,
  units: PropTypes.array,
  sameKeys: PropTypes.array,
  keyNames: PropTypes.object,
  serial_number: PropTypes.string,
  orderIndex: PropTypes.string
};

export default SetHistoryUl;
