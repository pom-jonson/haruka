import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import * as colors from "~/components/_nano/colors";

const PullBox = styled.div`
  display: flex;
`;

const Title = styled.div`
  display: inline-block;
  width: 9.375rem;
  font-size: 0.875rem;
  line-height: 2.375rem;
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
    right: 0.5rem;
    width: 0px;
    height: 0px;
    margin: -2px 0 0 0;
    border: 0.25rem solid transparent;
    border-top: 0.25rem solid #343a40;
    cursor: pointer;
    pointer-events: none;
  }
`;

const Select = styled.select`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  display: block;
  width: 23.125rem;
  height: 2.375rem;
  border-radius: 4px;
  border: solid 1px #ced4da;
  background: ${colors.surface};
  font-size: 0.875rem;
  padding: 0 0.5rem;
  color: ${colors.onSecondaryDark};
  &::-ms-expand {
    display: none;
  }
  &:disabled {
  background: #ddd;
}
`;

class SelectorWithLabel extends Component {
  getSelect = e => {
    // イベントe.target.valueには選択した選択肢の表示用の値が設定される。選択肢自体はselect自身であるe.currentTargetから抜き出す
    e.target.id = e.currentTarget[e.currentTarget.selectedIndex].id;
    this.props.getSelect(e);
  };

  render() {
    const optionList = [];
    if (this.props.options) {
      this.props.options.map(option => {
        let disabled = "";
        if(this.props.disabledValue != null){
          if(typeof this.props.disabledValue == "string"){
              let disabledValue = this.props.disabledValue.split(":");
              disabledValue.map(disabledId=>{
                  if(option.id == disabledId){
                      disabled = " disabled";
                  }
              });
          } else {
              disabled = (this.props.disabledValue != null && option.id == this.props.disabledValue ) ? " disabled": "";
          }
        }

        if (this.props.departmentEditCode == option.id) {
          optionList.push(
            <option
              key={option.id}
              id={option.id}
              value={option.value}
              disabled={disabled}
              selected
            >
              {option.value}
            </option>
          );
        } else {
          optionList.push(
            <option key={option.id} id={option.id} value={option.value} disabled={disabled}>
              {option.value}
            </option>
          );
        }
      });
    }
    const { title } = this.props;
    return (
      <PullBox className="pullbox">
        <Title className="label-title pullbox-title">{title}</Title>
        <Label className="pullbox-label" id = {this.props.id}>
          <Select
            className="pullbox-select"
            onChange={this.getSelect}
            value={this.props.value}
            disabled={this.props.isDisabled}            
          >
            {optionList}
          </Select>
        </Label>
      </PullBox>
    );
  }
}

SelectorWithLabel.defaultProps = {
  departmentEditCode: null,
  disabledValue: null,
};

SelectorWithLabel.propTypes = {
  title: PropTypes.string,
  getSelect: PropTypes.func,
  options: PropTypes.array,
  value: PropTypes.string, // 選択済の選択肢
  departmentEditCode: PropTypes.string,
  isDisabled: PropTypes.bool,
  disabledValue: PropTypes.string,
  id : PropTypes.string,
};

export default SelectorWithLabel;
