import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import * as colors from "../_nano/colors";
import Context from "~/helpers/configureStore";
import * as localApi from "~/helpers/cacheLocal-utils";

const PullBox = styled.div`
  display: flex;
`;

const Label = styled.label`
  position: relative;
  display: inline-block;
  width: 100%;
`;

const Select = styled.select`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  display: block;
  width: 100%;
  height: 99px;
  overflow-y: auto;
  border-radius: 4px;
  border: solid 1px #ced4da;
  background: ${colors.surface};
  font-size: 13px;
  padding: 0px;
  color: ${colors.onSecondaryDark};
  &::-ms-expand {
    display: none;
  }
  option{
    height: 24px;
    margin-top: 1px;
    padding-left: 5px;
  }
  option:nth-child(1){
    background: ${colors.firstPatientColor};
    margin-top: 0px !important;
  }
  option:nth-child(2){
    background: ${colors.firstPatientColor};
  }
  option:nth-child(3){
    background: ${colors.firstPatientColor};
  }
  option:nth-child(4){
    background: ${colors.firstPatientColor};
  }
`;

class SelectorDefault extends Component {
  getSelect = e => {
    // イベントe.target.valueには選択した選択肢の表示用の値が設定される。選択肢自体はselect自身であるe.currentTargetから抜き出す
    e.target.id = e.currentTarget[e.currentTarget.selectedIndex].id;
    this.props.getSelect(e, e.currentTarget[e.currentTarget.selectedIndex].id);
  };

  handleClick = (e) => {
    let sel_id = e.currentTarget.selectedIndex;
    if (sel_id == undefined || sel_id == null){
      sel_id = 0;
    } else {
      e.target.id = e.currentTarget[sel_id].id;
    }
    this.props.getSelect(e, e.target.id);
  }

  render() {
    let current_system_patient_id = localApi.getValue("current_system_patient_id");
    current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
    const optionList = [];
    if (this.props.options) {
      this.props.options.map(option => {
        /*if (this.props.patientId == option.system_patient_id) {
          optionList.push(
            <option
              key={option.system_patient_id}
              id={option.system_patient_id}
              value={option.name}
              selected
            >
              {option.name}
            </option>
          );
        } else {
          optionList.push(
            <option key={option.system_patient_id} id={option.system_patient_id} value={option.name}>
              {option.name}
            </option>
          );
        }*/
        if(option.system_patient_id == current_system_patient_id){
          optionList.push(
            <option key={option.system_patient_id} onClick={(e)=>this.handleClick(e)} id={option.system_patient_id} value={option.name} selected>
              {option.name}
            </option>
          );
        } else {
          optionList.push(
            <option key={option.system_patient_id} id={option.system_patient_id} value={option.name}>
              {option.name}
            </option>
          );
        }
        
      });
    }
    return (
      <PullBox className="pullbox">        
        <Label className="pullbox-label">
          <Select
            className="pullbox-select"
            onClick={(e)=>this.handleClick(e)}
            value={this.props.value}
            size={'3'}
          >
            {optionList}
          </Select>
        </Label>
      </PullBox>
    );
  }
}

SelectorDefault.defaultProps = {
  departmentEditCode: null
};

SelectorDefault.propTypes = {
  getSelect: PropTypes.func,
  options: PropTypes.array,
  value: PropTypes.string, // 選択済の選択肢
  patientId: PropTypes.number,
  departmentEditCode: PropTypes.string
};

SelectorDefault.contextType = Context;
export default SelectorDefault;
