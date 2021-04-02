import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Select from "react-select";

import { KEY_CODES } from "../../helpers/constants";

const Item = styled.div`
  padding-top: 10px;

  input {
    margin-left: 10px;
    margin-right: 5px;
  }

  .select-div {
    display: inline-block;
    width: 250px;
    margin-left: 10px;
  }
`;

const CalcInputItemPropTypes = {
  spanText: PropTypes.string.isRequired,
  inputType: PropTypes.string.isRequired,
  inputName: PropTypes.string.isRequired,
  inputValue: PropTypes.string.isRequired,
  inputOnChange: PropTypes.func.isRequired,
  unit: PropTypes.string
};

function CalcInputItem({
  spanText,
  inputType,
  inputName,
  inputValue,
  inputOnChange,
  unit
}) {
  return (
    <Item>
      <span>{spanText}</span>
      <input
        type={inputType}
        name={inputName}
        value={inputValue}
        onChange={inputOnChange}
      />
      {inputName === "amount" && <span>{unit}</span>}
    </Item>
  );
}

CalcInputItem.propTypes = CalcInputItemPropTypes;

const CalcInputItemListsPropTypes = {
  calcInputItemValues: PropTypes.array.isRequired,
  inputOnChange: PropTypes.func.isRequired,
  unit: PropTypes.string
};

function CalcInputItemLists({ calcInputItemValues, inputOnChange, unit }) {
  const calcInputItems = calcInputItemValues.map(function(
    calcInputItemValuesObj,
    i
  ) {
    return (
      <CalcInputItem
        spanText={calcInputItemValuesObj.spanText}
        inputType={calcInputItemValuesObj.inputType}
        inputName={calcInputItemValuesObj.inputName}
        inputValue={calcInputItemValuesObj.inputValue}
        inputOnChange={inputOnChange}
        key={i}
        unit={unit}
      />
    );
  });
  return <>{calcInputItems}</>;
}

CalcInputItemLists.propTypes = CalcInputItemListsPropTypes;

class CalcPart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usageData: this.props.usageData,
      usageComment: this.props.partUsageItem.usageComment,
      usage_optional_num: this.props.partUsageItem.usage_optional_num,
      poultice_times_one_day: this.props.partUsageItem.poultice_times_one_day,
      days: this.props.partUsageItem.days,
      days_suffix: this.props.partUsageItem.days_suffix,
      usageName: this.props.partUsageItem.usageName,
      usageIndex: 0,
      amount: this.props.formula
    };
    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.onChangeComment = this.onChangeComment.bind(this);
    this.onChangeUsage = this.onChangeUsage.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  componentDidMount() {
    document.getElementById("calc_dlg").focus();
  }

  getPartUsage() {
    const {
      usageName,
      usageComment,
      usage_optional_num,
      poultice_times_one_day,
      days,
      usageIndex,
      days_suffix,
      amount
    } = this.state;
    const item = {
      usageName: usageName,
      usageComment: usageComment,
      usage_optional_num: usage_optional_num,
      poultice_times_one_day: poultice_times_one_day,
      days: days,
      days_suffix: days_suffix,
      usageIndex: usageIndex,
      amount: amount
    };
    return item;
  }

  onChangeComment = e => {
    this.setState({ usageComment: e.value }, () => {
      this.props.onChageUsagePart(this.getPartUsage());
    });
  };

  onChangeUsage = e => {
    this.setState({ usageName: e.value, usageIndex: e.usage }, () => {
      this.props.onChageUsagePart(this.getPartUsage());
    });
  };

  onChangePoulticeTimes = e => {
    this.setState({ poultice_times_one_day: e.target.value }, () => {
      this.props.onChageUsagePart(this.getPartUsage());
    });
  };

  onInputChange = e => {
    this.setState({ [e.target.name]: e.target.value }, () => {
      this.props.onChageUsagePart(this.getPartUsage());
    });
  };

  onKeyPressed(e) {
    if (e.keyCode === KEY_CODES.enter) {
      const {
        usageName,
        usageComment,
        usage_optional_num,
        poultice_times_one_day,
        days,
        amount
      } = this.state;
      const item = this.getPartUsage();
      if (
        usageName === "" ||
        usageComment === "" ||
        usage_optional_num === null ||
        poultice_times_one_day === null ||
        days <= 0 ||
        amount <= 0
      )
        return;
      this.props.calcConfirm(true, item);
    } else if (e.keyCode === KEY_CODES.left || e.keyCode === KEY_CODES.right) {
      this.props.onKeyPressed(e);
    }
  }

  handleKeyDown = e => {
    this.setState({ usageComment: e.target.value });
  };

  render() {
    const {
      usageData,
      usageComment,
      usage_optional_num,
      poultice_times_one_day,
      days,
      usageName,
      amount
    } = this.state;

    const calcInputItemValues = [
      {
        spanText: "１回数量",
        inputType: "number",
        inputName: "usage_optional_num",
        inputValue: usage_optional_num
      },
      {
        spanText: "１日回数",
        inputType: "number",
        inputName: "poultice_times_one_day",
        inputValue: poultice_times_one_day
      },
      {
        spanText: "処方総数",
        inputType: "number",
        inputName: "amount",
        inputValue: amount
      },
      {
        spanText: "日数",
        inputType: "number",
        inputName: "days",
        inputValue: days
      }
    ];

    var filterData = this.props.bodyPartData.filter(
      option => option.label === usageComment
    );
    if (filterData.length == 0) {
      filterData = [
        {
          id: 0,
          label: usageComment,
          value: usageComment
        }
      ];
    }

    return (
      <div onKeyDown={this.onKeyPressed} tabIndex="0" id="calc_third_part">
        <Item>
          <span>用法選択</span>
          <Select
            options={usageData}
            placeholder=""
            className="select-div"
            onChange={this.onChangeUsage}
            value={usageData.filter(option => option.label === usageName)}
            autoFocus
          />
        </Item>
        <Item>
          <span>部位/補足</span>
          <Select
            options={this.props.bodyPartData}
            placeholder=""
            className="select-div"
            onChange={this.onChangeComment}
            onKeyDown={this.handleKeyDown}
            value={filterData}
          />
        </Item>
        <CalcInputItemLists
          calcInputItemValues={calcInputItemValues}
          inputOnChange={this.onInputChange}
          unit={this.props.unit}
        />
      </div>
    );
  }
}

CalcPart.propTypes = {
  calcConfirm: PropTypes.func,
  onChageUsagePart: PropTypes.func,
  onKeyPressed: PropTypes.func,
  usageData: PropTypes.array,
  formula: PropTypes.String,
  bodyPartData: PropTypes.array,
  partUsageItem: PropTypes.object,
  unit: PropTypes.string
};

export default CalcPart;
