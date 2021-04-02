import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import * as colors from "../_nano/colors";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

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
  &:disabled {
    background: #ddd;
  }
`;

const renderTooltip = (props) => (
  <Tooltip
    style={{
      display: props && props !== "" ? "block" : "none",
    }}
    {...props}
  >
    {props}
  </Tooltip>
);

class SelectorWithLabelIndexBorder extends Component {
  getSelect = (e) => {
    // イベントe.target.valueには選択した選択肢の表示用の値が設定される。選択肢自体はselect自身であるe.currentTargetから抜き出す
    e.target.value = e.currentTarget[e.currentTarget.selectedIndex].value;
    this.props.getSelect(e);
  };

  render() {
    const optionList = [];
    if (this.props.options) {
      Object.keys(this.props.options).map((value) => {
        // this.props.options.map(value => {
        if (this.props.departmentEditCode == value) {
          optionList.push(
            <option key={value} value={value} selected>
              {this.props.options[value]}
            </option>
          );
        } else {
          optionList.push(
            <option key={value} value={value}>
              {this.props.options[value]}
            </option>
          );
        }
      });
    }
    const { title } = this.props;
    return (
      <OverlayTrigger
        placement={this.props.tooltip_position}
        overlay={renderTooltip(this.props.tooltip)}
      >
        <PullBox className="pullbox">
          <Title className="label-title pullbox-title">{title}</Title>
          <Label className="pullbox-label">
            <Select
              id={this.props.id || ""}
              className="pullbox-select"
              onChange={this.getSelect}
              value={this.props.value}
              disabled={this.props.isDisabled}
              ref={(e) => {
                if (this.props.myref !== undefined) {
                  this.props.myref(e);
                } else {
                  return null;
                }
              }}
            >
              <option key={""} value={""}></option>
              {optionList}
            </Select>
          </Label>
        </PullBox>
      </OverlayTrigger>
    );
  }
}

SelectorWithLabelIndexBorder.defaultProps = {
  departmentEditCode: null,
  tooltip_position: "top",
};

SelectorWithLabelIndexBorder.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  getSelect: PropTypes.func,
  options: PropTypes.array,
  value: PropTypes.string, // 選択済の選択肢
  departmentEditCode: PropTypes.string,
  isDisabled: PropTypes.bool,
  myref: PropTypes.func,
  tooltip: PropTypes.string,
  tooltip_position: PropTypes.string,
};

export default SelectorWithLabelIndexBorder;
