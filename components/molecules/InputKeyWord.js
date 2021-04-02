import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const InputBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.div`
  display: inline-block;
  width: 97px;
  font-size: 14px;
  line-height: 1.33;
  letter-spacing: 0.4px;
`;

const Input = styled.input`
  display: inline-block;
  ime-mode: inactive;
  width: 100%;
  height: 35px;
  margin-top: 4px;
  border-radius: 4px;
  border: solid 1px #ced4da;
  font-size: 14px;
  padding: 0 8px;
`;

const InputKeyWord = ({
  type,
  label,
  placeholder,
  value,
  onChange,
  onKeyPressed,
  onClick,
  disabled,
  id,
  auto_focus, 
  onBlur
}) => (
  <InputBox>
    <Label>{label}</Label>
    <Input
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      onKeyDown={onKeyPressed}
      onClick={onClick}
      id={id !== undefined ? id : ""}
      disabled={disabled == 1 ? "disabled" : ""}
      autoFocus={auto_focus == "focus" ? true : false}
      onBlur={e => {if(onBlur != undefined) onBlur(e);}}
    />
  </InputBox>
);

InputKeyWord.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onKeyPressed: PropTypes.func,
  onClick: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.number,
  id: PropTypes.string,
  auto_focus: PropTypes.string,
};

export default InputKeyWord;
