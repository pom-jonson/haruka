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
    background-color: rgb(105, 200, 225);
    color: white;
  }
`;

const RadioInlineButtonsList = ({ id, label, name, value, usageType, checked, getUsage, className, isDisabled }) => {  
  return (
    <Styled className={`radio-btn ${checked ? "focused" : ""}`}>
      <input
        // id={id}
        type="radio"
        label={label}
        name={name}
        value={value}
        usageType={usageType}
        data-name={label}                
        checked={checked}
        disabled={isDisabled}
      />
      <label id={id} htmlFor={id} onClick={getUsage} className={className}>{label}</label>
    </Styled>
  );
};

RadioInlineButtonsList.propTypes = {
  getUsage: PropTypes.func,
  id: PropTypes.number,
  value: PropTypes.number,
  name: PropTypes.string,
  label: PropTypes.string,
  checked: PropTypes.bool,
  usageType: PropTypes.number,
  className:PropTypes.string,
  isDisabled: PropTypes.bool,
};

export default RadioInlineButtonsList;
