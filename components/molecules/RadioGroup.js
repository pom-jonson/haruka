import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "../_nano/colors";

const Styled = styled.div`
  display: inline;

  > input {
    display: none;
  }

  > input + label {
    border-radius: 13.5px;
    border: none;
    cursor: pointer;
    font-family: NotoSansJP;
    font-size: 12px;
    line-height: 27px;
    text-align: center;
    color: ${colors.focusedItemColor};
    width: 152px;
    width: 100%;
  }

  > input:checked + label {
    background-color: #ddd;
    color: #4c4b4b;
  }
`;

const RadioGroupButton = ({ id, label, name, value, usageType, checked, getUsage }) => {
  if (id < 10) id = "0" + id;
  return (
    <Styled className={`radio-group-btn ${checked ? "focused" : ""}`}>
      <input
        id={id}
        type="checkbox"
        label={label}
        name={name}
        value={value}
        usageType={usageType}
        data-name={label}
        onClick={getUsage}
        checked={checked}
      />
      <label htmlFor={id}>{label}</label>
    </Styled>
  );
};

RadioGroupButton.propTypes = {
  getUsage: PropTypes.func,
  id: PropTypes.number,
  value: PropTypes.number,
  name: PropTypes.string,
  label: PropTypes.string,
  checked: PropTypes.bool,
  usageType: PropTypes.number
};

export default RadioGroupButton;
