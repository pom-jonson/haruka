import React, { Component } from "react";
import axios from "axios";
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

class HistoryUl extends Component {
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

  getText(e) {
    this.setState({ [e.target.name]: e.target.value });
    this.props.getText(e.target.name, e.target.value, this.props.id);
  }

  getUnit(e) {
    this.setState({ unit: e.target.value });
    this.props.getUnit(e.target.value, this.props.id);
  }

  getDelete() {
    this.setState({ delete_flag: this.state.delete_flag ? 0 : 1 });
    this.props.getDelete(this.state.delete_flag, this.props.id);
  }

  timer = "";

  /**
   *  1秒間何も入力されなければ検索データを引き出すためのAPIへリクエスト
   */
  search = e => {
    this.setState({ item_name: e.target.value });
    if (this.timer) clearTimeout(this.timer);

    if (!this.state.item_name) {
      return true;
    }
    if (this.state.item_name.length < 2) {
      return true;
    }

    this.timer = setTimeout(() => {
      const postData = {
        word: this.state.item_name
      };
      axios
        .get("/app/api/v2/master/point/search/index", {
          params: postData
        })
        .then(res => {
          const searchedMedicine = [];
          res.data.forEach(medicine => {
            searchedMedicine.push({
              medicineId: medicine.code,
              medicineName: medicine.name,
              unit: medicine.unit
            });
          });
          this.setState({ medicineData: searchedMedicine });
        })
        .catch(() => {
          alert("送信に失敗しました");
          this.setState({
            medicineData: [
              {
                medicineId: 12345,
                medicineName: "ロキソ",
                unit: [
                  { name: "錠", main_unit_flag: 1 },
                  { name: "パック", main_unit_flag: 0 }
                ]
              }
            ]
          });
        });
    }, 1000);
  };

  putMedicine(medicine) {
    this.setState({
      item_name: medicine.medicineName,
      item_number: medicine.medicineId,
      unit: medicine.unit[0].name
    });
    this.props.putMedicine(
      medicine.medicineName,
      medicine.medicineId,
      medicine.unit[0].name,
      this.props.id
    );
  }

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
    const { isEdit, medi, serial_number, sameKeys, keyNames } = this.props;
    return (
      <DrugItem className="drug-item table-row">
        <div className="flex between">
          <div className="flex full-width table-item">
            <div className="number" style={underLine}>
              {serial_number === "" ? "" : " Rp" + serial_number}
            </div>

            <div className="ml-3 full-width mr-2 ml">
              {medi.item_name}
              {medi.amount > 0 &&
                medi.uneven_values !== undefined &&
                medi.uneven_values.length > 0 && (
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
            {isEdit ? (
              <input
                type="text"
                value={`${medi.amount}`}
                onChange={this.getAmount}
              />
            ) : (
              `${medi.amount}`
            )}
            {medi.unit}
          </div>
          {/* {
            (isPatientInfo)? 
            (<div className="w30p" style={textAlignRight}> {patientInfoField} </div> )
            : ""
          } */}
        </div>
      </DrugItem>
    );
  }
}

HistoryUl.propTypes = {
  medi: PropTypes.object,
  isEdit: PropTypes.bool,
  getText: PropTypes.func,
  id: PropTypes.number,
  putMedicine: PropTypes.func,
  units: PropTypes.array,
  getUnit: PropTypes.func,
  getDelete: PropTypes.func,
  serial_number: PropTypes.string,
  sameKeys: PropTypes.array,
  keyNames: PropTypes.object,
  changedVal: PropTypes.array
};

export default HistoryUl;
