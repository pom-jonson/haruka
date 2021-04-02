import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import * as activeIndicator from "../_nano/activeIndicator";

const LinkWrapper = styled.a`
  ${props =>
    props.active
      ? `${activeIndicator.activeIndicator}`
      : `${activeIndicator.indicator}`};
  display: inline-block;
  cursor: pointer;
  padding: 0 8px 8px;
`;

const Text = styled.span`
  color: ${colors.onSecondaryDark};
  font-family: NotoSansJP;
  font-size: 12px;
  line-height: 1.33;
  letter-spacing: 0.4px;
`;

const TabLink = props => {
  return (
    <LinkWrapper active={props.active}>
      <Text>{props.LinkText}</Text>
    </LinkWrapper>
  );
};

TabLink.propTypes = {
  active: PropTypes.bool,
  LinkText: PropTypes.string
};

export default TabLink;
