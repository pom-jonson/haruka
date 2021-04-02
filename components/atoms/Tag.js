import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/pro-regular-svg-icons";
import styled from "styled-components";

const Label = styled.div`
  color: ${props => props.color};
  display: inline-block;
  font-family: NotoSansJP;
  font-size: 28px;
  letter-spacing: 2.2px;
  line-height: 1.2;
  margin-left: 8px;
`;

const TagIcon = styled(FontAwesomeIcon)`
  color: ${props => props.color};
`;

const propTypes = {
  color: PropTypes.node,
  tagText: PropTypes.string
};

const defaultProps = {
  color: null,
  tagText: ""
};

function Tag({ color, tagText }) {
  return (
    <Label color={color}>
      <TagIcon color={color} icon={faTag} size="sm" />
      {tagText}
    </Label>
  );
}

Tag.propTypes = propTypes;
Tag.defaultProps = defaultProps;

export default Tag;
