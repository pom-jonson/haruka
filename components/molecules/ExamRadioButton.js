import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "../_nano/colors";

const Styled = styled.div`
  display: block;

  > input {
    display: none;
  }

  label{
    margin-bottom: 0px;
  }

  > input + label {
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-family: NotoSansJP;
    font-size: 12px;
    line-height: 27px;
    text-align: left;
    color: ${colors.focusedItemColor};
    width: 152px;
    width: 100%;
    padding-left: 15px;
  }
  .selected {
    background-color: #a0ebff;
  }   

  label:hover {
    background-color: #dedede;
  }  

  .selected:hover {
    background-color: #69c8ff;
  }
`;

const ExamRadioButton = ({ id, label, name, usageType, checked, getUsage }) => {
  if (id < 10) id = "0" + id;
  return (
    <Styled className={`radio-btn`}>
      <input
        id={id}
        type="radio"
        label={label}
        name={name}
        value={id}
        usageType={usageType}
        data-name={label}
        onClick={getUsage}
        checked={checked}
      />
      <label htmlFor={id} className={` ${checked ? "selected" : ""}`}>{label}</label>
    </Styled>
  );
};

ExamRadioButton.propTypes = {
  getUsage: PropTypes.func,
  id: PropTypes.number,
  name: PropTypes.string,
  label: PropTypes.string,
  checked: PropTypes.bool,
  usageType: PropTypes.number
};

export default ExamRadioButton;
