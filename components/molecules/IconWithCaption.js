import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import * as colors from "../_nano/colors";

const Text = styled.span`
  color: ${colors.onSecondaryDark};
  font-family: NotoSansJP;
  font-size: 12px;
  line-height: 1.33;
  letter-spacing: 0.4px;
  padding-left: 3px;
`;

const IconWithCaption = props => {
  return (
    <div>
      <FontAwesomeIcon
        icon={props.icon}
        size="xs"
        color={colors.onSurface}
        fixedWidth
      />
      <Text>{props.word}</Text>
    </div>
  );
};

IconWithCaption.propTypes = {
  icon: PropTypes.object,
  word: PropTypes.string
};

export default IconWithCaption;
