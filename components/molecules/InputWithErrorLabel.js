import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const FormControl = styled.div`
  display: flex;
  margin-top: 8px;

  .label-title {
    font-size: 12px;
    width: 70px;
    margin-top: 0px;
    padding-right: 8px;
  }
`;

const InputBox = styled.div`
  .show {
    display: block !important;
  }

  .hidden {
    display: none !important;
  }

  .label-error {
    display: block;
    width: 100%;
    font-size: 13px;
    line-height: 18px;
    color: red;
  }

  input {
    border-radius: 4px;
    border: solid 1px #ced4da;
    font-size: 14px;
    width: 100%;
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
const InputWithErrorLabel = props => {
  return (
    <DatePickerBox>
      <FormControl>
        <label className="label-title">{props.label}</label>
        <InputBox>
          {props.type === "date" ? (
            <DatePicker
              locale="ja"
              selected={props.diseaseEditData}
              onChange={props.getInputText.bind(this)}
              dateFormat="yyyy/MM/dd"
              placeholderText="年/月/日"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              dayClassName = {date => setDateColorClassName(date)}
            />
          ) : (
            <input
              type={props.type}
              placeholder={props.placeholder}
              onChange={e => {
                props.getInputText(e, props.label);
              }}
              value={props.diseaseEditData}
              disabled={props.disabled}
              onKeyPress={props.handleKeyPress}
            />
          )}
          <label className="label-error `${props.error != ''? 'show':'hidden'}`">
            {props.error}
          </label>
        </InputBox>
      </FormControl>
    </DatePickerBox>
  );
};

InputWithErrorLabel.defaultProps = {
  diseaseEditData: null
};

InputWithErrorLabel.propTypes = {
  handleKeyPress: PropTypes.func,
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  getInputText: PropTypes.func,
  onBlur: PropTypes.func,
  diseaseEditData: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool
};

export default InputWithErrorLabel;
