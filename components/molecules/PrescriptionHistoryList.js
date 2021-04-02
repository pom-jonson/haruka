import React, { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import PrescriptionHistoryUl from "./PrescriptionHistoryUl";
import PrescriptionListItem from "../organisms/PrescriptionListItem";

class PrescriptionHistoryList extends Component {
  state = {
    isEdit: false,
    order: this.props.order,
    days: this.props.order.days,
    days_suffix: this.props.order.days_suffix,
    one_dose_package: this.props.order.one_dose_package,
    temporary_medication: this.props.order.temporary_medication,
    insurance_type: this.props.order.insurance_type,
    body_part: this.props.order.body_part,
    usage: this.props.order.usage,
    usage_name: this.props.order.usage_name
  };

  changeForm = () => {
    this.setState({ isEdit: this.state.isEdit ? false : true });
    if (this.state.isEdit === true) {
      this.props.order.med.map((medicine, index) => {
        if (medicine.delete_flag === 1) {
          this.props.order.med.splice(index, 1);
        }
      });

      if (this.props.order.med === []) {
        this.stopOrder();
        return true;
      }

      this.props.order.usage = this.state.usage;
      this.props.order.usage_name = this.state.usage_name;
      this.props.order.days = this.state.days;
      this.props.order.days_suffix = this.state.days_suffix;
      this.props.order.insurance_type = this.state.insurance_type;
      const postData = {
        system_patient_id: this.props.patientId, //HARUKA患者番号
        insurance_type: this.state.insurance_type, //保険情報現状固定
        body_part: this.state.body_part,
        order_data: this.props.order,
        med_consult: 1, //お薬相談希望ありフラグ
        supply_med_info: 1, //薬剤情報提供ありフラグ
        psychotropic_drugs_much_reason: "", //向精神薬多剤投与理由
        poultice_many_reason: "", //向精神薬多剤投与理由
        free_comment: [], //備考
        department_code: 1
      };

      axios
        .post("/app/api/v2/order/prescription/update", {
          params: postData
        })
        .catch(() => {
          alert("送信に失敗しました");
        });
    }
  };

  stopOrder = () => {
    const postData = {
      number: this.props.orderNumber,
      system_patient_id: this.props.patientId, //HARUKA患者番号
      insurance_type: 0, //保険情報現状固定
      body_part: "",
      order_data: [
        {
          order_number: this.props.order.order_number, // ※該当する区切りのオーダー番号
          order_number_serial: this.props.order.order_number_serial // ※該当する区切りのオーダー連番
        }
      ],
      med_consult: 1, //お薬相談希望ありフラグ
      supply_med_info: 1, //薬剤情報提供ありフラグ
      psychotropic_drugs_much_reason: "", //向精神薬多剤投与理由
      poultice_many_reason: "", //向精神薬多剤投与理由
      free_comment: [], //備考
      department_code: 1
    };

    axios
      .post("/app/api/v2/order/prescription/delete", {
        params: postData
      })
      .catch(() => {
        alert("送信に失敗しました");
      });
  };

  addMedicine = () => {
    this.state.order.med.push({
      item_number: 0,
      item_name: "",
      amount: 0,
      unit: "錠",
      main_unit_flag: 0,
      is_not_generic: 0,
      can_generic_name: 0,
      milling: 0,
      separate_packaging: 0,
      free_comment: "",
      usage_comment: "",
      usage_optional_num: 0,
      poultice_one_day: 0,
      poultice_days: 0,
      uneven_values: [],
      real_amount: 0,
      real_unit: "",
      units_list: [
        { name: "錠", main_unit_flag: 1 },
        { name: "箱", main_unit_flag: 0 }
      ]
    });
    this.setState({ order: this.state.order });
  };

  getText = (name, value, id) => {
    this.props.order.med[id][name] = value;
  };

  getUnit = (unit, id) => {
    this.props.order.med[id]["unit"] = unit;
  };

  getDelete = (delete_flag, id) => {
    this.props.order.med[id]["delete_flag"] = delete_flag;
  };

  putMedicine = (medicineName, medicineId, unit, id) => {
    this.props.order.med[id]["item_number"] = medicineId;
  };

  i = 0;
  render() {
    const { isEdit, order, mediInfo } = this.state;
    return (
      <div className="history-item">
        <PrescriptionListItem />
        <div className="box">
          <div className="dl-box">
            <dl className="flex">
              <dt>指示日</dt>
              <dd>H25-02-05</dd>
            </dl>
            <dl className="flex">
              <dt>患者指名</dt>
              <dd>
                12345<span className="patient-name">患者太郎</span>
              </dd>
            </dl>
            <dl className="flex">
              <dt>脳神経外科</dt>
              <dd className="doctor">医者太郎</dd>
            </dl>
          </div>
          <div>
            {order.med.map((medi, index) => {
              this.i += 1;
              return (
                <PrescriptionHistoryUl
                  key={this.i}
                  getText={this.getText.bind(this)}
                  id={index}
                  medi={medi}
                  isEdit={isEdit}
                  units={mediInfo}
                  putMedicine={this.putMedicine.bind(this)}
                  getUnit={this.getUnit.bind(this)}
                  getDelete={this.getDelete.bind(this)}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

PrescriptionHistoryList.propTypes = {
  order: PropTypes.object,
  patientId: PropTypes.number,
  orderNumber: PropTypes.number
};

export default PrescriptionHistoryList;
