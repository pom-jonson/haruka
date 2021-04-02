import React, { Component } from "react";
import styled from "styled-components";
import { surface, secondary, onSecondaryDark } from "../_nano/colors";
import PropTypes from "prop-types";

const Label = styled.label`
  font-size: 12px;
  // margin-right: 10px;
  color: ${onSecondaryDark};
  margin-bottom: -2px;

  img {
    width: 20px;
  }
  cursor: pointer;
`;

const Check = styled.input`
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
  box-shadow: inset 0 1px 1px 0 rgba(0, 0, 0, 0.34);
  border: solid 1px #b8b8b8;
  background-color: ${surface};
  appearance: none;

  &:checked {
    background: ${secondary};
    border-color: ${secondary};
  }

  &:checked::before {
    font-size: 14px;
    line-height: 15px;
    position: absolute;
    display: inline-block;
    width: 15px;
    height: 15px;
    content: "✔";
    color: ${surface};
    text-align: center;
  }

  &:checked::after {
    position: relative;
    display: block;
    content: "";
    -webkit-animation: click-wave 0.65s;
    animation: click-wave 0.65s;
    background: ${secondary};
  }
`;

class ExamCheckbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value
    };
  }

  getCheckbox(e) {
    const { name, isGroup, number } = this.props;
    this.setState({ value: this.state.value ? 0 : 1 }, () => {
      if (number !== undefined) {
        this.props.getRadio(name, number);
      } else {
        if (isGroup === undefined) this.props.getRadio(name, this.state.value);
        else this.props.getRadio(name, this.state.value, isGroup);
      }
    });
    e.stopPropagation();
  }

  isChecked() {
    return this.state.value;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.value });
  }

  render() {
    const { name, label } = this.props;
    return (
      <Label className={this.state.value === 1 || this.state.value === true ? 'checked': 'other'} style={this.props.background != undefined && this.props.background != "" ? {background:this.props.background}:{}}>
        <Check
          type="checkbox"
          name={name}
          onClick={this.getCheckbox.bind(this)}
          checked={this.state.value === 1 || this.state.value === true}
        />
        {this.props.img ? <img src={this.props.img} /> : ""}
        {label}
      </Label>
    );
  }
}

ExamCheckbox.propTypes = {
  getRadio: PropTypes.func,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.number,
  isGroup: PropTypes.bool,
  img: PropTypes.object,
  number: PropTypes.number,
  id:PropTypes.number,
  background: PropTypes.string
};

export default ExamCheckbox;
