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

class SelectorWithLabelCodeBase extends Component {
  getSelect = e => {
    // イベントe.target.valueには選択した選択肢の表示用の値が設定される。選択肢自体はselect自身であるe.currentTargetから抜き出す
    e.target.id = e.currentTarget[e.currentTarget.selectedIndex].id;
    this.props.getSelect(e);
  };

  render() {
    const optionList = [];
    var flag = true;    
    if (this.props.options) {      
      
      if (this.props.selectedValue > 0){
        flag =  this.props.selectedValue in this.props.options;
      } else {
        flag = true;
      }      
      Object.keys(this.props.options).map((id) =>{          
        if (this.props.selectedValue == id) {
          optionList.push(
            <option
              key={id}
              id={id}
              value={this.props.options[id]}
              selected
            >
              {this.props.options[id]}
            </option>
          );
        } else {
          optionList.push(
            <option key={id} id={id} value={this.props.options[id]}>
              {this.props.options[id]}
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
            disabled={this.props.isDisabled}
          >
            {flag === false && (
              <>
              <option
                key={0}
                id={0}
                selected
                value={"削除済み項目（コード: " + this.props.selectedValue + ")"}
              >
                {"削除済み項目（コード: " + this.props.selectedValue + ")"}
              </option>
              </>
            )}
            {flag === true && (
              <>
              <option
                key={0}
                id={0}
                value=""
              >
              </option>
              </>
            )}
            {optionList}
          </Select>
        </Label>
      </PullBox>
    );
  }
}

SelectorWithLabelCodeBase.defaultProps = {
  selectedValue: null
};

SelectorWithLabelCodeBase.propTypes = {
  title: PropTypes.string,
  getSelect: PropTypes.func,
  options: PropTypes.array,
  value: PropTypes.string, // 選択済の選択肢
  selectedValue: PropTypes.string,  
  isDisabled: PropTypes.bool,
};

export default SelectorWithLabelCodeBase;
