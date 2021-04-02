import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "../_nano/colors";

const Styled = styled.div`
  display: inline-block;

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
    background: ${colors.focusedItemBG};
  }
`;

const RadioButton = ({ id, label, name, usageType, checked, getUsage, mouseHover }) => {
  if (id < 10) id = "0" + id;
  return (
    <Styled className={`radio-btn ${checked ? "focused" : ""}`}>
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
      <label onMouseOver = {mouseHover} htmlFor={id}>{label}</label>
    </Styled>
  );
};

RadioButton.propTypes = {
  getUsage: PropTypes.func,
  id: PropTypes.number,
  name: PropTypes.string,
  label: PropTypes.string,
  checked: PropTypes.bool,
  usageType: PropTypes.number,
  mouseHover: PropTypes.func,
};

export default RadioButton;
