import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  secondary,
  onSecondaryLight,
  secondary600,
  midEmphasis,
  highEmphasis,
} from "../_nano/colors";
import { Button as ButtonText } from "../_nano/types";
import { Link } from "react-router-dom";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const Base = styled.button`
  display: inline-block;
  padding: 8px 16px;
  border-radius: 4px;
  box-sizing: border-box;
  min-width: 91px;

  /* Start if it as Link */
  &:hover {
    text-decoration: none;
  }
  /* End if it as Link */
`;

const Primary = styled(Base)`
  border: none;
  background-color: ${secondary};

  ${ButtonText} {
    color: ${onSecondaryLight};
  }

  &:hover {
    background-color: ${secondary600};
  }
`;

const Mono = styled(Base)`
  border: 1px solid ${midEmphasis};

  ${ButtonText} {
    color: ${midEmphasis};
  }

  &:hover {
    border: 1px solid ${highEmphasis};
  }

  &:hover ${ButtonText}, svg {
    color: ${highEmphasis};
  }
`;

const defaultProps = {
  type: "primary",
  tooltip_position: "top",
};

const propTypes = {
  children: PropTypes.string.isRequired,
  type: PropTypes.string,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  isDisabled: PropTypes.bool,
  tooltip: PropTypes.string,
  tooltip_position: PropTypes.string,
};

const renderTooltip = (props) => <Tooltip {...props}>{props}</Tooltip>;

function Button({ children, type, ...props }) {
  if (props.tooltip != undefined && props.tooltip != "") {
    switch (type) {
      case "primary":
        return (
          <OverlayTrigger
            placement={props.tooltip_position}
            overlay={renderTooltip(props.tooltip)}
          >
            <Primary as={props.to && Link} {...props}>
              <ButtonText>{children}</ButtonText>
            </Primary>
          </OverlayTrigger>
        );
      case "mono":
        return (
          <OverlayTrigger
            placement={props.tooltip_position}
            overlay={renderTooltip(props.tooltip)}
          >
            <Mono as={props.to && Link} {...props}>
              <ButtonText>{children}</ButtonText>
            </Mono>
          </OverlayTrigger>
        );
    }
  } else {
    switch (type) {
      case "primary":
        return (
          <Primary as={props.to && Link} {...props}>
            <ButtonText>{children}</ButtonText>
          </Primary>
        );
      case "mono":
        return (
          <Mono as={props.to && Link} {...props}>
            <ButtonText>{children}</ButtonText>
          </Mono>
        );
    }
  }
}

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
