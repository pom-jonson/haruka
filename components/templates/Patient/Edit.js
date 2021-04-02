import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import FormWithTitle from "../../molecules/FormWithTitle";
import Button from "../../atoms/Button";

const EditArea = styled.div`
  width: 675px;
  margin: auto;

  button {
    display: block;
    margin-left: auto;
  }
`;

const Edit = ({ patientId }) => (
  <EditArea className="my-3">
    <h1>DEBUG_LOG: patientId: {patientId}</h1>
    <form>
      <FormWithTitle title="病名" type="text" />
      <FormWithTitle title="Subjective" type="text" />
      <FormWithTitle title="Assessment" type="text" />
      <FormWithTitle title="Plan" type="text" />
      <Button>保存</Button>
    </form>
  </EditArea>
);
Edit.propTypes = {
  patientId: PropTypes.number
};

export default Edit;
