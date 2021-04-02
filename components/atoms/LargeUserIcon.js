import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

const propTypes = {
  size: PropTypes.node,
  color: PropTypes.node
};

const defaultProps = {
  size: null,
  color: null
};

function LargeUserIcon({ size, color }) {
  return <FontAwesomeIcon icon={faUserCircle} size={size} color={color} />;
}

LargeUserIcon.propTypes = propTypes;
LargeUserIcon.defaultProps = defaultProps;

export default LargeUserIcon;
