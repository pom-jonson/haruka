import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import NumericInput from 'react-numeric-input';

const FormControl = styled.div`
  display: flex;
  margin-top: 0.5rem;

  .label-title {
    font-size: 0.875rem;
    width: 5rem;
    margin-top: 0.25rem;
    margin-right: 0.5rem;
  }
  .label-unit {
    text-align: left;
    font-size: 0.875rem;
    margin-left: 0.5rem;
    margin-top: 0.25rem;
    width: 3rem;
  }
`;

const InputBox = styled.div`
  .show {
    display: block !important;
  }

  .hidden {
    display: none !important;
  }
  input {
    border-radius: 0.25rem;
    border: solid 1px #ced4da;
    font-size: 0.875rem;
    width: 6.25rem;
    height: 2.375rem;
    padding: 0 0.5rem;
  }

  input[disabled] {
    opacity: 0.8;
  }
`;

/**
 * type=text のとき、getInputText のパラメータは(event, label)
 * type=date のとき、getInputText のパラメータは(date)
 * @param {*} props
 */

const NumericInputWithUnitLabel = props => {
    return (
        <FormControl className={props.className}>
            <label className="label-title">{props.label}</label>
            <InputBox>
                <NumericInput
                    className="form-control"
                    value={props.value}
                    min={ props.min }
                    max={ props.max }
                    step={ props.step }
                    precision={ props.precision }
                    size={ props.size }
                    id={ props.id }
                    inputmode="numeric"
                    onClick={e => {
                        if (props.onClickEvent != undefined) props.onClickEvent(e);
                    }}
                    onChange={e => {
                        props.getInputText(e, props.label);
                    }}
                    onBlur={e => {if(props.onBlur != undefined) props.onBlur(e, props.label);}}
                    disabled={props.disabled}
                    maxLength={props.maxLength}
                    style={{
                        input: {
                            borderRadius: '0.25rem 2px 2px 0.25rem',
                            color: '#212529',
                            padding: '0.1ex 1ex',
                            border: '1px solid #ccc',
                            marginRight: 4,
                            display: 'block',
                            // fontWeight: 100,
                            fontSize:16
                        }
                    }}
                />

            </InputBox>
            <label className="label-unit `${props.unit != ''? 'show':'hidden'}`">
                {props.unit}
            </label>
        </FormControl>
    );
};

NumericInputWithUnitLabel.defaultProps = {
    value: null,
    size: 8,
    step:1,
    disabled:false,
    maxLength: 8,
    className:"numeric-input"
};

NumericInputWithUnitLabel.propTypes = {
    handleKeyPress: PropTypes.func,
    label: PropTypes.string,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    getInputText: PropTypes.func,
    onClickEvent: PropTypes.func,
    onBlur: PropTypes.func,
    value: PropTypes.string,
    unit: PropTypes.string,
    disabled: PropTypes.bool,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    precision: PropTypes.number,
    size: PropTypes.number,
    maxLength: PropTypes.number,
    id: PropTypes.string,
    className:PropTypes.string
};

export default NumericInputWithUnitLabel;
