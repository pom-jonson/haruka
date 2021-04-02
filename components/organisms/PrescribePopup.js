import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Calc from "../molecules/Calc";
import {
  faBalanceScaleRight,
  faCalendarAlt,
  faCalculator
} from "@fortawesome/pro-regular-svg-icons";
import IconWithCaption from "../molecules/IconWithCaption";
import RadioButton from "../molecules/RadioButton";
import Button from "../atoms/Button";
import { Modal } from "react-bootstrap";
import CategoryContent from "../atoms/CategoryContent";
import { Flex, Input } from "../../style/common";

const H2 = styled.h2`
  border-bottom: 1px solid #cbcbcb;
  color: ${colors.onSurface};
  font-family: NotoSansJP;
  font-size: 17px;
  font-weight: 500;
  letter-spacing: 2.1px;
  padding: 0 0 8px 3px;
`;

const Select = styled.select`
  background-color: ${colors.surface};
  border: 1px solid #ced4da;
  border-radius: 4px;
  color: ${colors.onSurface};
  display: block;
  font-size: 12px;
  width: 72px;
  height: 38px;
  margin-left: 9px;
`;

const Calculator = styled(FontAwesomeIcon)`
  cursor: pointer;
  color: ${colors.midEmphasis};
  margin-left: 4px;
`;

const ModalWrapper = styled(Modal)`
  width: 1000px;
`;

const naihuku = [
  {
    id: 9801121,
    label: "１日４回  毎食後と寝る前",
    name: "radio"
  },
  {
    id: 9801122,
    label: "１日３回  毎食後",
    name: "radio"
  },
  {
    id: 9801123,
    label: "１日２回  朝夕食後",
    name: "radio"
  },
  {
    id: 9801124,
    label: "１日２回  朝昼食後",
    name: "radio"
  },
  {
    id: 9801125,
    label: "１日２回  朝食後と寝る前",
    name: "radio"
  },
  {
    id: 9801126,
    label: "１日３回  毎食前",
    name: "radio"
  },
  {
    id: 9801132,
    label: "１日１回 夕食後",
    name: "radio"
  },
  {
    id: 9801133,
    label: "１日１回 朝食前",
    name: "radio"
  },
  {
    id: 9801134,
    label: "１日１回 昼食前",
    name: "radio"
  }
];

const tonpuku = [
  {
    id: 9801138,
    label: "頓服（頭痛時）",
    name: "radio"
  },
  {
    id: 9801139,
    label: "頓服（腹痛時）",
    name: "radio"
  }
];

const gaiyo = [
  {
    id: 9801146,
    label: "１日 回（患部に貼付）",
    name: "radio"
  },
  {
    id: 9801147,
    label: "１日 回（患部に塗布）",
    name: "radio"
  }
];

class PrescribePopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      medical_business_diagnosing_type: 1,
      amount: this.props.medicine.amount,
      unit: this.props.medicine.main_unit,
      units: this.props.medicine.units,
      main_unit_flag: "",
      usageName: this.props.medicine.usageName,
      usage: this.props.medicine.usage,
      days: this.props.medicine.days,
      days_suffix: this.props.medicine.days_suffix,
      startYear: 0,
      startMonth: 0,
      startDate: 0,
      date: new Date(),
      isCalendarOpen: false,
      focusRadio: 0,
      isCalcOpen: false,
      is_not_generic: 0,
      can_generic_name: 0,
      milling: 0,
      separate_packaging: 0,
      free_comment: "",
      one_dose_package: 0,
      usage_comment: "",
      usage_optional_num: 0,
      poultice_one_day: 0,
      poultice_days: 0,
      insurance_type: this.props.patientInfo.insurance_type_list[0].code,
      body_part: "",
      uneven_values: []
    };

    this.state = {
      medicine: this.props.medicine
    };

    this.inputAmount = React.createRef();
  }

  selectTab = id => {
    this.setState({ medical_business_diagnosing_type: parseInt(id) });
  };

  getText(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  getSelect(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  getRadio(e) {
    this.setState({
      usageName: e.target.getAttribute("label"),
      usage: e.target.value
    });
  }

  getCheckbox(e) {
    this.setState({ [e.target.name]: this.state[e.target.name] ? 0 : 1 });
  }

  getUnit(e) {
    this.setState({
      unit: e.target.value,
      main_unit_flag: e.target.main
    });
  }

  confirm = () => {
    this.props.confirm({
      medicineId: this.props.medicine.medicineId,
      medicineName: this.props.medicine.medicineName,
      amount: parseInt(this.state.amount),
      unit: this.state.unit,
      units: this.props.medicine.units,
      main_unit_flag: this.state.main_unit_flag,
      usage: this.props.medicine.usage,
      usageName: this.props.medicine.usageName,
      days: this.props.medicine.days,
      days_suffix: this.props.medicine.days_suffix,
      year: this.state.startYear,
      month: this.state.startMonth,
      date: this.state.startDate,
      is_not_generic: this.state.is_not_generic,
      temporary_medication: this.state.temporary_medication,
      can_generic_name: this.state.can_generic_name,
      milling: this.state.milling,
      separate_packaging: this.state.separate_packaging,
      free_comment: this.state.free_comment,
      one_dose_package: this.state.one_dose_package,
      medical_business_diagnosing_type: this.state
        .medical_business_diagnosing_type,
      usage_comment: this.state.usage_comment,
      usage_optional_num: this.state.usage_optional_num,
      poultice_one_day: this.state.poultice_one_day,
      poultice_days: this.state.poultice_days,
      insurance_type: this.state.insurance_type,
      body_part: this.state.body_part,
      indexNum: this.props.indexNum,
      uneven_values: []
    });
  };

  onChange = date => this.setState({ date, isCalendarOpen: false });

  clickDate = () => {
    this.setState({ isCalendarOpen: this.state.isCalendarOpen ? false : true });
  };

  openCalc() {
    this.setState({ openCalc: this.state.isCalcOpen ? false : true });
  }

  handleClose() {
    this.setState({ show: false });
  }

  componentDidMount() {
    window.addEventListener("keydown", this.props.selectMedicineOnKeyboard);
  }

  render() {
    const usageList = [];
    switch (this.state.medical_business_diagnosing_type) {
      case 1:
        naihuku.forEach((usage, index) => {
          usageList.push(
            <RadioButton
              key={index}
              id={usage.id}
              label={usage.label}
              name={usage.name}
              getRadio={this.getRadio.bind(this)}
            />
          );
        });
        break;
      case 2:
        tonpuku.forEach((usage, index) => {
          usageList.push(
            <RadioButton
              key={index}
              id={usage.id}
              label={usage.label}
              name={usage.name}
              getRadio={this.getRadio.bind(this)}
            />
          );
        });
        break;
      case 3:
        gaiyo.forEach((usage, index) => {
          usageList.push(
            <RadioButton
              key={index}
              id={usage.id}
              label={usage.label}
              name={usage.name}
              getRadio={this.getRadio.bind(this)}
            />
          );
        });
        break;
      case 4:
        break;
    }

    const options = this.props.medicine.units.map(uni => {
      return (
        <option
          key={uni.name}
          style={{ color: `${uni.main_unit_flag ? "red" : "#000000"}` }}
          main={uni.main_unit_flag}
          value={`${uni.name}`}
        >{`${uni.name}`}</option>
      );
    });

    const insuranceTypeOptions = this.props.patientInfo.insurance_type_list.map(
      insurance => {
        return (
          <option key={insurance.code} value={`${insurance.code}`}>{`${
            insurance.name
          }`}</option>
        );
      }
    );

    return (
      <ModalWrapper show={this.props.show}>
        <Modal.Header>
          <Modal.Title>
            <H2>{this.props.medicineName}</H2>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <IconWithCaption
            className="categoryName"
            icon={faBalanceScaleRight}
            word="保険"
          />
          <Select name="insurance_type" onChange={this.getSelect.bind(this)}>
            {insuranceTypeOptions}
          </Select>
          <IconWithCaption
            className="categoryName"
            icon={faBalanceScaleRight}
            word="投薬量"
          />
          <div className="categoryContent">
            <Flex>
              <span>1回</span>
              <Input
                type="text"
                name="amount"
                ref={this.inputAmount}
                onChange={this.getText.bind(this)}
              />
              <Select name="unit" onChange={this.getUnit.bind(this)}>
                {options}
              </Select>
              <Calculator
                icon={faCalculator}
                size="xs"
                onClick={this.openCalc.bind(this)}
              />
              {this.state.isCalcOpen ? <Calc /> : ""}
            </Flex>
          </div>
          <IconWithCaption
            className="categoryName"
            icon={faCalendarAlt}
            word="部位など補足"
          />
          <div className="categoryContent">
            <Flex>
              <Input
                type="text"
                name="usage_comment"
                onChange={this.getText.bind(this)}
              />
              <span>部位など補足</span>
            </Flex>
          </div>

          <Flex>
            <span>1日</span>
            <Input
              type="text"
              name="usage_optional_num"
              onChange={this.getText.bind(this)}
            />
            <span>回</span>
            <span>塗り薬・貼り薬1日あたり数量</span>
            <Input
              type="text"
              name="poultice_one_day"
              onChange={this.getText.bind(this)}
            />
            <span>塗り薬・貼り薬 日分</span>
            <Input
              type="text"
              name="poultice_days"
              onChange={this.getText.bind(this)}
            />
          </Flex>

          {this.state.medical_business_diagnosing_type === 3 ? (
            <Flex>
              <span>1日</span>
              <Input
                type="text"
                name="usage_optional_num"
                onChange={this.getText.bind(this)}
              />
              <span>回</span>
              <span>塗り薬・貼り薬1日あたり数量</span>
              <Input
                type="text"
                name="poultice_one_day"
                onChange={this.getText.bind(this)}
              />
              <span>塗り薬・貼り薬 日分</span>
              <Input
                type="text"
                name="poultice_days"
                onChange={this.getText.bind(this)}
              />
            </Flex>
          ) : (
            ""
          )}

          {this.state.medical_business_diagnosing_type === 2 ? (
            <>
              <IconWithCaption
                className="categoryName"
                icon={faCalendarAlt}
                word="回数"
              />
              <CategoryContent
                fn={this.getText.bind(this)}
                span="回分"
                name="days"
              />
            </>
          ) : (
            ""
          )}
          <Flex>
            <CategoryContent
              fn={this.getCheckBox.bind(this)}
              span="後発不可"
              name="is_not_generic"
            />
            <CategoryContent
              fn={this.getCheckBox.bind(this)}
              span="一般名処方"
              name="can_generic_name"
            />
            <CategoryContent
              fn={this.getCheckBox.bind(this)}
              span="粉砕"
              name="milling"
            />
            <CategoryContent
              fn={this.getCheckBox.bind(this)}
              span="別包"
              name="separate_packaging"
            />
            <CategoryContent
              fn={this.getText.bind(this)}
              span="フリーコメント"
              name="free_comment"
            />
            <CategoryContent
              fn={this.getText.bind(this)}
              span="臨時処方フラグ"
              name="temporary_medication"
            />
            <CategoryContent
              fn={this.getText.bind(this)}
              span="一包化"
              name="one_dose_package"
            />
            <CategoryContent
              fn={this.getText.bind(this)}
              span="湿布薬1日あたり□枚"
              name="one_dose_package"
            />
          </Flex>
        </Modal.Body>
        <Modal.Footer>
          <div className="text-right btn-box">
            <Button type="mono" onClick={this.props.handleClose}>
              キャンセル
            </Button>
            <Button onClick={this.confirm}>確定</Button>
          </div>
        </Modal.Footer>
      </ModalWrapper>
    );
  }
}

PrescribePopup.propTypes = {
  isOpen: PropTypes.bool,
  medicineId: PropTypes.number,
  medicineName: PropTypes.string,
  medicineUnit: PropTypes.string,
  closeModal: PropTypes.func,
  confirm: PropTypes.func,
  selectMedicineOnKeyboard: PropTypes.func,
  unit: PropTypes.array,
  insurance_type_list: PropTypes.array,
  handleClose: PropTypes.func,
  medicine: PropTypes.object,
  show: PropTypes.bool,
  indexNum: PropTypes.number,
  patientInfo: PropTypes.object
};

export default PrescribePopup;
