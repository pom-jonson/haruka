import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

const Icon = styled(FontAwesomeIcon)`
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  margin-right: 4px;
`;

const PrescriptionAction = ({
  displayCheck,
  contextFn,
  classCheck,
  name,
  icon
}) => {
  {
    displayCheck && (
      <li>
        <div onClick={contextFn} className={classCheck == 1 ? "blue-text" : ""}>
          {icon && <Icon icon={icon} />}
          {name}
        </div>
      </li>
    );
  }
};

PrescriptionAction.propTypes = {
  displayCheck: PropTypes.bool,
  name: PropTypes.string,
  icon: PropTypes.string,
  classCheck: PropTypes.string,
  contextFn: PropTypes.func
};

export default PrescriptionAction;
