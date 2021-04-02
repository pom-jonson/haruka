import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/pro-regular-svg-icons";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import * as activeIndicator from "../_nano/activeIndicator";

const Drawer = styled.div`
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
  font-size: ${props => props.size};
  line-height: 1.33;
  letter-spacing: 0.4px;
`;

const TabLinkDrawer = props => {
  return (
    <Drawer className="drawer" active={props.active}>
      <Text size={props.size}>{props.LinkText}</Text>
      <FontAwesomeIcon
        icon={faAngleDown}
        size="xs"
        color={colors.onSecondaryDark}
        fixedWidth
      />
    </Drawer>
  );
};

TabLinkDrawer.propTypes = {
  active: PropTypes.bool,
  size: PropTypes.node,
  LinkText: PropTypes.string
};

export default TabLinkDrawer;
