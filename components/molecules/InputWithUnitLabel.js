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
    width: 80px;
    margin-top: 10px;
    margin-right: 8px;
  }
  .label-unit {
    text-align: left;
    font-size: 12px;
    margin-left: 8px;
    margin-top: 10px;
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
const InputWithUnitLabel = props => {
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
        </InputBox>
        <label className="label-unit `${props.unit != ''? 'show':'hidden'}`">
          {props.unit}
        </label>
      </FormControl>
    </DatePickerBox>
  );
};

InputWithUnitLabel.defaultProps = {
  diseaseEditData: null
};

InputWithUnitLabel.propTypes = {
  handleKeyPress: PropTypes.func,
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  getInputText: PropTypes.func,
  onBlur: PropTypes.func,
  diseaseEditData: PropTypes.string,
  unit: PropTypes.string,
  disabled: PropTypes.bool
};

export default InputWithUnitLabel;
