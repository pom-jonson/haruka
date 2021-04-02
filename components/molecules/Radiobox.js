import React, { Component } from "react";
import styled from "styled-components";
import { surface, secondary, onSecondaryDark } from "../_nano/colors";
import PropTypes from "prop-types";

const Label = styled.label`
  cursor: pointer;
  font-size: 12px;
  margin-right: 10px;
  color: ${onSecondaryDark};
  margin-bottom: -2px;

  img {
    width: 20px;
  }
`;

const Radio = styled.input`
  position: relative;
  top: 3px;
  right: 0;
  bottom: 0;
  left: 0;
  width: 15px !important;
  height: 15px;
  margin-right: 4px;
  cursor: pointer;
  transition: all 0.15s ease-out 0s;
  color: ${surface};
  border: none;
  outline: none;
  border-radius: 2px;
  border: solid 1px #b8b8b8;

  &:checked {
    background: ${secondary};
    border-color: ${secondary};
  }
`;

class Radiobox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value
    };
  }

  render() {
    const {id, name, label, checked, value, getUsage } = this.props;
    return (
      <Label>
        <Radio
          type="radio"
          id = {id}
          name={name}
          value={value}
          onClick={getUsage}
          checked={checked}
          disabled={this.props.isDisabled}
        />
        {this.props.img ? <img src={this.props.img} /> : ""}
        {label}
      </Label>
    );
  }
}

Radiobox.propTypes = {
  id: PropTypes.string,
  getUsage: PropTypes.func,
  label: PropTypes.string,
  name: PropTypes.string,
  checked: PropTypes.bool,
  value: PropTypes.string,
  isGroup: PropTypes.bool,
  img: PropTypes.object,
  number: PropTypes.number,
  isDisabled: PropTypes.bool,
};

export default Radiobox;
