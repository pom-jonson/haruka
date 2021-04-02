import React, { Component } from "react";
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
    background-color: ${colors.focusedItemBG};
  }
`;

class RadioButtonWithFunc extends Component {
  constructor(props) {
    super(props);
    this.onMouseOver = this.onMouseOver.bind(this);
  }

  onMouseOver(e, index) {
    if (e !== undefined) this.props.onMouseOver(index);
  }

  render() {
    const {
      id,
      label,
      name,
      usageType,
      checked,
      getUsage,
      suffix,
      enableDays,
      requireBodyParts,
      usageName,
      showName,
        receipt_key_if_precision
    } = this.props;
    return (
      <Styled
        className={`radio-btn ${checked ? "focused" : ""}`}
        onMouseOver={e => this.onMouseOver(e, this.props.index)}
      >
        <input
          id={id}
          type="radio"
          label={label}
          name={name}
          value={id}
          usageType={usageType}
          suffix={suffix}
          enableDays={enableDays}
          data-name={label}
          onClick={getUsage}
          checked={checked}
          requireBodyParts={requireBodyParts}
          usageName={usageName}
          showName={showName}
          receipt_key_if_precision={receipt_key_if_precision}
        />
        <label htmlFor={id}>{label}</label>
      </Styled>
    );
  }
}

RadioButtonWithFunc.propTypes = {
  onMouseOver: PropTypes.func,
  getUsage: PropTypes.func,
  id: PropTypes.number,
  name: PropTypes.string,
  label: PropTypes.string,
  checked: PropTypes.bool,
  usageType: PropTypes.number,
  index: PropTypes.number,
  suffix: PropTypes.string,
  enableDays: PropTypes.number,
  requireBodyParts: PropTypes.number,
  receipt_key_if_precision: PropTypes.string,
  showName: PropTypes.string,
  usageName: PropTypes.string
};

export default RadioButtonWithFunc;
