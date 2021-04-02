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
const InputBoxTag = props => {
  return (
    <DatePickerBox>
      <InputBox>
        <Label className="label-title">{props.label}</Label>
        {props.type === "date" ? (
          <DatePicker
            locale="ja"
            selected={props.value}
            onChange={props.getInputText.bind(this)}
            dateFormat="yyyy/MM/dd"
            // placeholderText="年/月/日"
            showMonthDropdown
            todayButton={props.noTodayButton == true ? "" : "今日"}
            showYearDropdown
            dropdownMode="select"
            dayClassName = {date => setDateColorClassName(date)}
          />
        ) : (
            <Input
              id={props.id}
              className={props.className}
              type={props.type}
              placeholder={props.placeholder}
              onChange={e => {
                if (props.getInputText != undefined) props.getInputText(e, props.label);
              }}
              onKeyDown={e => {
                if (props.getInputText != undefined) props.getInputText(e, props.label);
              }}
              onKeyUp = {e => {
                if (props.onKeyUp != undefined) props.onKeyUp(e, props.label);
              }}
              onClick={e => {
                if (props.onClick != undefined) props.onClick(e)
              }}
              disabled={props.isDisabled}
              onBlur={e => { if (props.onBlur != undefined) props.onBlur(e, props.label); }}
              value={props.value}
              ref={e => {
                if (props.myref !== undefined) {
                  props.myref(e);
                } else {
                  return null;
                }
              }}
            />
          )}
      </InputBox>
    </DatePickerBox>
  );
};

InputBoxTag.defaultProps = {
  value: null
};

InputBoxTag.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  getInputText: PropTypes.func,
  className: PropTypes.string,
  // onKeyPressed:PropTypes.func,
  onBlur: PropTypes.func,
  onClick: PropTypes.func,
  value: PropTypes.string,
  isDisabled: PropTypes.bool,
  noTodayButton: PropTypes.bool,
  myref: PropTypes.func,
  onKeyUp : PropTypes.func
};

export default InputBoxTag;
