import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import * as colors from "../_nano/colors";

const PullBox = styled.div`
  display: flex;
`;

const Title = styled.div`
  display: inline-block;
  width: 150px;
  font-size: 12px;
  line-height: 38px;
  letter-spacing: 0.4px;
  color: ${colors.onSecondaryDark};
`;

const Label = styled.label`
  position: relative;
  display: inline-block;

  &:before {
    position: absolute;
    content: "";
    top: 50%;
    right: 10px;
    width: 0px;
    height: 0px;
    margin: -2px 0 0 0;
    border: 5px solid transparent;
    border-top: 5px solid #343a40;
    cursor: pointer;
    pointer-events: none;
  }
`;

const Select = styled.select`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  display: block;
  width: 370px;
  height: 38px;
  border-radius: 4px;
  border: solid 1px #ced4da;
  background: ${colors.surface};
  font-size: 14px;
  padding: 0 8px;
  color: ${colors.onSecondaryDark};
  &::-ms-expand {
    display: none;
  }
`;

class SelectorWithNumberName extends Component {
  getSelect = e => {
    // イベントe.target.valueには選択した選択肢の表示用の値が設定される。選択肢自体はselect自身であるe.currentTargetから抜き出す
    e.target.id = e.currentTarget[e.currentTarget.selectedIndex].id;
    this.props.getSelect(e.target.id);
  };

  render() {
    const optionList = [];
    if (this.props.options) {
      this.props.options.map((option,index) => {
        if (this.props.selectedValue == option.number) {
          optionList.push(
            <option
              key={index}
              id={index}
              value={option.name}
              selected
            >
              {option.name}
            </option>
          );
        } else {
          optionList.push(
            <option key={index} id={index} value={option.name}>
              {option.name}
            </option>
          );
        }
      });
    }
    const { title } = this.props;
    return (
      <PullBox className="pullbox">
        <Title className="label-title pullbox-title">{title}</Title>
        <Label className="pullbox-label">
          <Select
            className="pullbox-select"
            onChange={this.getSelect}
            value={this.props.value}
          >
            <option
                key={0}
                id={0}
                value=""
            >
            </option>
            {optionList}
          </Select>
        </Label>
      </PullBox>
    );
  }
}

SelectorWithNumberName.defaultProps = {
  selectedValue: null
};

SelectorWithNumberName.propTypes = {
  title: PropTypes.string,
  getSelect: PropTypes.func,
  options: PropTypes.array,
  value: PropTypes.string, // 選択済の選択肢
  selectedValue: PropTypes.string
};

export default SelectorWithNumberName;
