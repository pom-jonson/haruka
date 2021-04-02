import React, { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";

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
    delete_flag: 1
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

  render() {
    const { isEdit, medi } = this.props;

    return (
      <div className="drug-item">
        <div className="flex">
          <div>{medi.item_number}</div>
          <div>処方</div>
          <div>外来</div>
          <div className="date">H25-02-06</div>
        </div>
        <div className="flex between">
          <div className="ml">{medi.free_comment}</div>
          <div className="w50">
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
        </div>
        <div className="flex between">
          <div className="text-right">●１日１回 朝食後</div>
          <div className="w50">１９日分</div>
        </div>
      </div>
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
  getDelete: PropTypes.func
};

export default HistoryUl;
