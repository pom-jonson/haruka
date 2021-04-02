import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
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

const renderTooltip = (props) => <Tooltip style={{
  display: props && props !== '' ? "block" : "none"
}} {...props}>{props}</Tooltip>;

/**
 * type=text のとき、getInputText のパラメータは(event, label)
 * type=date のとき、getInputText のパラメータは(date)
 * @param {*} props
 */
const InputWithLabelBorder = (props) => {
  return (
    <OverlayTrigger
      placement={props.tooltip_position}
      overlay={renderTooltip(props.tooltip)}
    >
      <DatePickerBox className='datepickerbox'>
        <InputBox>
          <Label className="label-title">{props.label}</Label>
          {props.type === "date" ? (
            <DatePicker
              locale="ja"
              selected={props.diseaseEditData}
              onChange={props.getInputText.bind(this)}
              dateFormat={props.dateFormat}
              placeholderText={props.placeholder!=''?props.placeholder:"年/月/日"}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              disabled={props.isDisabled}
              id={props.id}
              onBlur={(e) => {
                if (props.onBlur != undefined) props.onBlur(e, props.label);
              }}
              dayClassName = {date => setDateColorClassName(date)}
            />
          ) : (
            <Input
              id={props.id}
              type={props.type}
              placeholder={props.placeholder}
              onChange={(e) => {
                props.getInputText(e, props.label);
              }}
              onBlur={(e) => {
                if (props.onBlur != undefined) props.onBlur(e, props.label);
              }}
              onClick={(e) => {
                if (props.onClick != undefined) props.onClick(e);
              }}
              disabled={props.isDisabled}
              value={props.diseaseEditData}
              autocomplete={"off"}
              tabIndex={props.tabIndex}
            />
          )}
        </InputBox>
      </DatePickerBox>
    </OverlayTrigger>
  );
};

InputWithLabelBorder.defaultProps = {
  tooltip_position: "top",
  diseaseEditData: null,
  dateFormat: "yyyy/MM/dd",
};

InputWithLabelBorder.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  getInputText: PropTypes.func,
  onClick: PropTypes.func,
  onBlur: PropTypes.func,
  diseaseEditData: PropTypes.string,
  isDisabled: PropTypes.bool,
  dateFormat: PropTypes.string,
  tooltip: PropTypes.string,
  tooltip_position: PropTypes.string,
  tabIndex: PropTypes.number,
};

export default InputWithLabelBorder;
