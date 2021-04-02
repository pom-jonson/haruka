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
  margin-top: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  width: 11.25rem;
  margin-top: 0.5rem;
  margin-right: 0.5rem;
`;

const Input = styled.input`
  border-radius: 4px;
  border: solid 1px #ced4da;
  font-size: 0.875rem;
  width: 100%;
  height: 2.375rem;
  padding: 0 0.5rem;
`;

/**
 * type=text のとき、getInputText のパラメータは(event, label)
 * type=date のとき、getInputText のパラメータは(date)
 * @param {*} props
 */
const InputWithLabel = props => {
  return (
    <DatePickerBox>
      <InputBox className={props.className}>
        <Label className="label-title">{props.label}</Label>
        {props.type === "date" ? (
          <DatePicker
            locale="ja"
            selected={props.diseaseEditData}
            onChange={props.getInputText.bind(this)}
            dateFormat={props.dateFormat}
            placeholderText="年/月/日"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            disabled = {props.isDisabled}
            id={props.id}
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
            id={props.id}
            style={props.style}
          />
        )}
      </InputBox>
    </DatePickerBox>
  );
};

InputWithLabel.defaultProps = {
  diseaseEditData: null,
  dateFormat: "yyyy/MM/dd",
  className: "input-with-label"
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
  id:PropTypes.string,
  className:PropTypes.string,
  style: PropTypes.string,
};

export default InputWithLabel;
