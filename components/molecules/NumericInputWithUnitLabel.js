import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import NumericInput from 'react-numeric-input';

const FormControl = styled.div`
  display: flex;
  margin-top: 8px;

  .label-title {
    font-size: 12px;
    width: 80px;
    margin-top: 4px;
    margin-right: 8px;
    cursor: text;
  }
  .label-unit {
    text-align: left;
    font-size: 12px;
    margin-left: 8px;
    margin-top: 4px;
    width: 50px;
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
    border-radius: 4px;
    border: solid 1px #ced4da;
    font-size: 14px;
    width: 100px !important;
    height: 38px;
    padding: 0 8px;
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
        <FormControl>
            <label className="label-title">{props.label}</label>
            <InputBox>

                {/*<input*/}
                {/*type={props.type}*/}
                {/*placeholder={props.placeholder}*/}
                {/*onChange={e => {*/}
                {/*props.getInputText(e, props.label);*/}
                {/*}}*/}
                {/*value={props.value}*/}
                {/*disabled={props.disabled}*/}
                {/*onKeyPress={props.handleKeyPress}*/}
                {/*/>*/}
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
                    onKeyDown={e => {if(props.handleKeyPress != undefined) props.handleKeyPress(e);}}
                    disabled={props.disabled}
                    maxLength={props.maxLength}
                    style={{
                        input: {
                            borderRadius: '4px 2px 2px 4px',
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
    maxLength: 8
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

};

export default NumericInputWithUnitLabel;
