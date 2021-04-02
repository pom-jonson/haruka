import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const InputBox = styled.div`
  display: flex;
  margin-top: 8px;
`;

const Label = styled.label`
  font-size: 12px;
  width: 180px;
  margin-top: 10px;
  margin-right: 8px;
  cursor: text;
`;

const Input = styled.input`
  border-radius: 4px;
  border: solid 1px #ced4da;
  font-size: 14px;
  width: 100%;
  height: 38px;
  padding: 0 8px;
`;

/**
 * type=text のとき、getInputText のパラメータは(event, label)
 * type=date のとき、getInputText のパラメータは(date)
 * @param {*} props
 */
const InputWithLabel = props => {
  return (
    <DatePickerBox className='datepickerbox'>
      <InputBox>
        <Label className="label-title">{props.label}</Label>
        {props.type === "date" ? (
          <DatePicker
            locale="ja"
            selected={props.diseaseEditData}
            onChange={props.getInputText.bind(this)}
            dateFormat={props.dateFormat}
            placeholderText={props.placeholder != undefined ? props.placeholder : "年/月/日"}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            disabled = {props.isDisabled}
            dayClassName = {date => setDateColorClassName(date)}
          />
        ) : (
          <Input
            type={props.type}
            placeholder={props.placeholder}
            onChange={e => {
              props.getInputText(e, props.label);
            }}
            onBlur={e => {if(props.onBlur != undefined) props.onBlur(e, props.label);}}
            onClick={e => {
                if (props.onClick != undefined) props.onClick(e)
            }}
            disabled = {props.isDisabled}
            value={props.diseaseEditData}
            autocomplete={'off'}
          />
        )}
      </InputBox>
    </DatePickerBox>
  );
};

InputWithLabel.defaultProps = {
  diseaseEditData: null,
  dateFormat: "yyyy/MM/dd",
};

InputWithLabel.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  getInputText: PropTypes.func,
  onClick: PropTypes.func,
  onBlur: PropTypes.func,
  diseaseEditData: PropTypes.string,
  isDisabled:PropTypes.bool,
  dateFormat:PropTypes.string,
};

export default InputWithLabel;
