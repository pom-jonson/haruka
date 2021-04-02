import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Title from "../atoms/Title";

const InputBox = styled.div`
  margin-bottom: 32px;
`;

const Input = styled.input`
  display: inline-block;
  width: 675px;
  height: 38px;
  margin-top: 4px;
  border-radius: 4px;
  border: solid 1px #ced4da;
  padding: 0 8px;
`;

const FormWithTitle = props => {
  return (
    <InputBox>
      <Title title={props.title} />
      <Input type={props.type} placeholder={props.placeholder} />
    </InputBox>
  );
};

FormWithTitle.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string
};

export default FormWithTitle;
