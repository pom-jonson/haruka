import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const TextareaBox = styled.div`
  display: flex;
  margin-top: 8px;
`;

const Label = styled.label`
  font-size: 12px;
  width: 180px;
  margin-top: 10px;
  margin-right: 8px;
`;


const renderTooltip = (props) => (
  <Tooltip
    style={{
      display: props && props !== "" ? "block" : "none",
    }}
    {...props}
  >
    {props}
  </Tooltip>
);

/**
 * type=text のとき、getInputText のパラメータは(event, label)
 * type=date のとき、getInputText のパラメータは(date)
 * @param {*} props
 */
const TextareaWithLabelBorder = (props) => {
  return (
    <OverlayTrigger
      placement={props.tooltip_position}
      overlay={renderTooltip(props.tooltip)}
    >
      <TextareaBox>
        <Label className="label-title">{props.label}</Label>
        <textarea {...props} />
      </TextareaBox>
    </OverlayTrigger>
  );
};

TextareaWithLabelBorder.defaultProps = {
  tooltip_position: "top",
  diseaseEditData: null,
  dateFormat: "yyyy/MM/dd",
};

TextareaWithLabelBorder.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  getInputText: PropTypes.func,
  diseaseEditData: PropTypes.string,
  isDisabled: PropTypes.bool,
  dateFormat: PropTypes.string,
  tooltip: PropTypes.string,
  tooltip_position: PropTypes.string,
};

export default TextareaWithLabelBorder;
