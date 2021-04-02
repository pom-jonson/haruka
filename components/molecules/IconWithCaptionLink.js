import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import * as activeIndicator from "../_nano/activeIndicator";

const LinkWrapper = styled.span`
  ${props =>
    props.active
      ? `${activeIndicator.activeIndicator}`
      : `${activeIndicator.indicator}`};
  display: block;
  padding: 10px 0 12px;
`;

const Text = styled.span`
  color: ${colors.onSecondaryDark};
  font-family: NotoSansJP;
  font-size: 12px;
  line-height: 1.33;
  letter-spacing: 0.4px;
  padding-left: 3px;
`;

const IconWithCaptionLink = props => {
  return (
    <LinkWrapper active={props.active}>
      <FontAwesomeIcon
        icon={props.icon}
        size="xs"
        color={colors.onSurface}
        fixedWidth
      />
      <Text>{props.word}</Text>
    </LinkWrapper>
  );
};

IconWithCaptionLink.propTypes = {
  active: PropTypes.bool,
  icon: PropTypes.object,
  word: PropTypes.string
};

export default IconWithCaptionLink;
