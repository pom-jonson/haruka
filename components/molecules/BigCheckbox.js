import React, { Component } from "react";
import styled from "styled-components";
import { surface, secondary, onSecondaryDark } from "../_nano/colors";
import PropTypes from "prop-types";

const Div = styled.div`
  display: flex;
  cursor: pointer;
  font-size: 12px;
  margin-right: 10px;
  color: ${onSecondaryDark};
  img {
    width: 30px;
  }
`;
const PLabel = styled.p`
  font-size: 18px;
  margin-bottom: 0;
  line-height: 30px;
`;

const Check = styled.input`
  position: relative;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 30px;
  width: 30px !important;
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
    font-size: 18px;
    font-weight: bold;
    line-height: 30px;
    position: absolute;
    display: inline-block;
    width: 30px;
    height: 30px;
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

class BigCheckbox extends Component {
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
            this.props.isDisabled ? (
                <Div>
                    <Check
                        type="checkbox"
                        name={name}
                        onClick={this.getCheckbox.bind(this)}
                        checked={this.state.value === 1 || this.state.value === true}
                        disabled={this.props.isDisabled}
                    />
                    {this.props.img ? <img src={this.props.img} /> : ""}
                    <PLabel>{label}</PLabel>
                </Div>
            ) : (
                <Div onClick={this.getCheckbox.bind(this)}>
                    <Check
                        type="checkbox"
                        name={name}
                        onClick={this.getCheckbox.bind(this)}
                        checked={this.state.value === 1 || this.state.value === true}
                        disabled={this.props.isDisabled}
                    />
                    {this.props.img ? <img src={this.props.img} /> : ""}
                    <PLabel>{label}</PLabel>
                </Div>
            )
        );
    }
}

BigCheckbox.propTypes = {
    getRadio: PropTypes.func,
    label: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.number,
    isGroup: PropTypes.bool,
    img: PropTypes.object,
    number: PropTypes.number,
    isDisabled: PropTypes.bool,
};

export default BigCheckbox;
